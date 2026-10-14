// ============================================
// REKAIRE - Traitement d'une commande payée (Stripe → base → facture → emails)
// ============================================

import Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";
import { getCheckoutSession } from "@/lib/stripe";
import { sendOrderConfirmationEmail, sendAdminNotificationEmail, sendAdminAlertEmail } from "@/lib/email";
import {
  incrementSalesCounter,
  decrementStock,
  createOrder as createSupabaseOrder,
  orderExistsByStripeSession,
  getNextInvoiceNumber,
} from "@/lib/supabase-admin";
import { generateInvoicePDFBase64 } from "@/lib/invoice";
import type { InvoiceData } from "@/lib/invoice";

export type FulfillmentSource = "webhook" | "success-page" | "reconciliation";

export type FulfillmentResult =
  | { status: "created"; orderNumber: string; emailSent: boolean }
  | { status: "duplicate" }
  | { status: "unpaid" }
  | { status: "invalid"; reason: string };

// ============================================
// Traite une session Checkout payée : commande, stock, facture, emails.
// Idempotent : une session déjà enregistrée n'est jamais traitée deux fois.
// Appelée par le webhook Stripe, par la page de succès (fallback) et par le
// rapprochement quotidien, pour qu'une commande payée finisse toujours en base.
// ============================================
export async function fulfillPaidSession(sessionId: string, source: FulfillmentSource): Promise<FulfillmentResult> {
  const log = (msg: string, extra?: unknown) => console.log(`[Fulfillment:${source}] ${msg}`, extra ?? "");

  if (await orderExistsByStripeSession(sessionId)) {
    log(`Commande déjà existante pour ${sessionId}, ignorée`);
    return { status: "duplicate" };
  }

  const fullSession = await getCheckoutSession(sessionId);
  if (!fullSession) {
    return { status: "invalid", reason: "Session Stripe introuvable" };
  }
  if (fullSession.payment_status !== "paid") {
    return { status: "unpaid" };
  }
  const session = fullSession;

  const orderId = session.metadata?.order_id;
  const customerEmail = session.customer_details?.email;

  log("Session payée :", { orderId, email: customerEmail, amount: session.amount_total, currency: session.currency });

  if (!orderId || !customerEmail) {
    await sendAdminAlertEmail({
      subject: `Paiement reçu sans order_id ou email (session ${sessionId})`,
      lines: [
        `Source : ${source}`,
        `Session Stripe : ${sessionId}`,
        `Montant : ${((session.amount_total || 0) / 100).toFixed(2)} €`,
        `Email client : ${customerEmail || "inconnu"}`,
        "La commande n'a pas pu être enregistrée automatiquement : à traiter à la main depuis Stripe.",
      ],
    });
    return { status: "invalid", reason: "order_id ou email manquant" };
  }

  // Prépare les données pour l'email
  const lineItem = fullSession.line_items?.data[0];
  const productName = lineItem?.description || session.metadata?.product_name || "RK01";
  const quantity = lineItem?.quantity || 1;

  // ============================================
  // VALIDATION CRITIQUE : Vérifier le montant payé
  // ============================================
  const expectedQuantity = parseInt(session.metadata?.quantity || '1');
  const expectedTotalHT = parseInt(session.metadata?.total_ht || '0');
  const expectedTotalTTC = parseInt(session.metadata?.total_ttc || '0');
  const amountPaid = session.amount_total || 0;

  // 🔒 SÉCURITÉ : Vérifier que le montant payé correspond au montant attendu
  if (Math.abs(amountPaid - expectedTotalTTC) > 100) { // Tolérance de 1€ pour les arrondis
    console.error('[Fulfillment] ⚠️ FRAUDE DÉTECTÉE: Montant incorrect', {
      orderId,
      expectedTotalTTC,
      amountPaid,
      difference: amountPaid - expectedTotalTTC
    });
    // On traite quand même la commande (Stripe a déjà encaissé), mais on prévient l'admin
    await sendAdminAlertEmail({
      subject: `Montant payé différent du montant attendu (${orderId})`,
      lines: [
        `Commande : ${orderId}`,
        `Attendu : ${(expectedTotalTTC / 100).toFixed(2)} € TTC — Payé : ${(amountPaid / 100).toFixed(2)} €`,
        `Session Stripe : ${sessionId}`,
        "La commande a été enregistrée normalement. Vérifier dans Stripe avant expédition.",
      ],
    });
  }

  // ============================================
  // MISE À JOUR SUPABASE (Stock + Compteur + Commande)
  // ============================================
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shippingDetails = (session as any).shipping_details;
  const billingAddress = session.customer_details?.address;
  
  // ============================================
  // GÉNÉRATION DU NUMÉRO DE FACTURE (notre système, pas Stripe)
  // ============================================
  let invoiceNumber: string | undefined;
  try {
    invoiceNumber = await getNextInvoiceNumber();
    console.log("[Fulfillment] Generated invoice number:", invoiceNumber);
  } catch (invoiceNumError) {
    console.error("[Fulfillment] Failed to generate invoice number:", invoiceNumError);
  }
  
  try {
    const amountTotal = session.amount_total || 0;
    const totalTTC = amountTotal;
    const totalHT = Math.round(totalTTC / 1.2);
    const unitPriceHT = Math.round(totalHT / expectedQuantity);
    
    // Récupérer les infos du code promo depuis les metadata
    const promoCode = session.metadata?.promo_code || undefined;
    const promoDiscount = session.metadata?.promo_discount ? parseInt(session.metadata.promo_discount) : undefined;

    // Récupérer adresse de facturation depuis metadata (saisie par le client)
    const billingSameFromMetadata = session.metadata?.billing_same_as_shipping === 'true';
    const billingNameFromMetadata = session.metadata?.billing_name;
    const billingCompanyFromMetadata = session.metadata?.billing_company;
    const billingAddressFromMetadata = session.metadata?.billing_address;
    const billingPostalCodeFromMetadata = session.metadata?.billing_postal_code;
    const billingCityFromMetadata = session.metadata?.billing_city;
    const billingVatNumberFromMetadata = session.metadata?.billing_vat_number;

    // Déterminer si adresse facturation = adresse livraison
    const billingSameAsShipping = billingSameFromMetadata;

    // Créer la commande dans Supabase avec TOUTES les données
    await createSupabaseOrder({
      order_number: orderId!, // RK-XXXXX - Numéro de commande client
      stripe_session_id: session.id,
      stripe_payment_intent: typeof session.payment_intent === 'string' 
        ? session.payment_intent 
        : session.payment_intent?.id,
      product_slug: 'rk01',
      quantity: expectedQuantity,
      unit_price_ht: unitPriceHT,
      total_ht: totalHT,
      total_ttc: totalTTC,
      customer_email: customerEmail,
      customer_name: session.customer_details?.name || undefined,
      customer_phone: session.customer_details?.phone || session.metadata?.customer_phone || undefined,
      // Adresse de LIVRAISON
      shipping_address_line1: shippingDetails?.address?.line1 || session.metadata?.shipping_address || undefined,
      shipping_address_line2: shippingDetails?.address?.line2 || undefined,
      shipping_postal_code: shippingDetails?.address?.postal_code || session.metadata?.shipping_postal_code || undefined,
      shipping_city: shippingDetails?.address?.city || session.metadata?.shipping_city || undefined,
      shipping_country: shippingDetails?.address?.country || 'France',
      // Adresse de FACTURATION (depuis metadata saisies par le client)
      billing_same_as_shipping: billingSameAsShipping,
      billing_name: billingNameFromMetadata || session.customer_details?.name || undefined,
      billing_company: billingCompanyFromMetadata || undefined,
      billing_address_line1: billingAddressFromMetadata || billingAddress?.line1 || undefined,
      billing_address_line2: billingAddress?.line2 || undefined,
      billing_postal_code: billingPostalCodeFromMetadata || billingAddress?.postal_code || undefined,
      billing_city: billingCityFromMetadata || billingAddress?.city || undefined,
      billing_country: billingAddress?.country || 'France',
      billing_vat_number: billingVatNumberFromMetadata || undefined,
      // Code promo & Facture maison
      promo_code: promoCode,
      promo_discount: promoDiscount,
      invoice_number: invoiceNumber,
      invoice_url: undefined, // On n'héberge pas le PDF, il est envoyé par email
    });
    console.log("[Fulfillment] Order created in Supabase with full billing/shipping addresses");

    // Décrémenter le stock
    await decrementStock('rk01', expectedQuantity); // 🔒 Utiliser la quantité validée
    console.log("[Fulfillment] Stock decremented by", quantity);

    // Incrémenter le compteur de ventes
    const newCount = await incrementSalesCounter(expectedQuantity); // 🔒 Utiliser la quantité validée
    console.log("[Fulfillment] Sales counter updated to", newCount);

  } catch (supabaseError) {
    console.error(`[Fulfillment:${source}] Error updating Supabase:`, supabaseError);
    Sentry.captureException(supabaseError, {
      tags: { api: "fulfillment", source, step: "supabase-update" },
    });
    // Commande introuvable en base : alerte immédiate, puis on laisse l'appelant réessayer
    await sendAdminAlertEmail({
      subject: `COMMANDE PAYÉE NON ENREGISTRÉE (${orderId})`,
      lines: [
        `Source : ${source}`,
        `Commande : ${orderId}`,
        `Client : ${session.metadata?.customer_name || ""} <${customerEmail}>`,
        `Montant : ${((session.amount_total || 0) / 100).toFixed(2)} € TTC — ${expectedQuantity} × RK01`,
        `Session Stripe : ${sessionId}`,
        `Erreur : ${supabaseError instanceof Error ? supabaseError.message : String(supabaseError)}`,
        "Le paiement est encaissé. Le rapprochement quotidien réessaiera ; sinon, enregistrer la commande à la main.",
      ],
    });
    throw supabaseError;
  }

  // ============================================
  // ENVOI DES EMAILS (avec données complètes)
  // ============================================
  
  // Extraction des données détaillées - PRIORITÉ aux metadata (saisies par le client)
  const customerPhone = session.metadata?.customer_phone || session.customer_details?.phone;
  const promoCode = session.metadata?.promo_code;
  const discountAmount = session.metadata?.discount_amount ? parseInt(session.metadata.discount_amount) : undefined;
  const unitPrice = session.metadata?.unit_price ? parseInt(session.metadata.unit_price) : undefined;
  const paymentIntentId = typeof session.payment_intent === 'string' 
    ? session.payment_intent 
    : session.payment_intent?.id;

  // Construction de l'adresse de livraison - priorité aux metadata
  const shippingAddressForEmail = shippingDetails?.address ? {
    name: shippingDetails.name || session.customer_details?.name || session.metadata?.customer_name || undefined,
    line1: shippingDetails.address.line1,
    line2: shippingDetails.address.line2,
    city: shippingDetails.address.city,
    postalCode: shippingDetails.address.postal_code,
    country: shippingDetails.address.country || 'France',
  } : session.metadata?.shipping_address ? {
    name: session.metadata?.customer_name || session.customer_details?.name || undefined,
    line1: session.metadata?.shipping_address,
    line2: undefined,
    city: session.metadata?.shipping_city,
    postalCode: session.metadata?.shipping_postal_code,
    country: 'France',
  } : undefined;

  // Construction de l'adresse de facturation - priorité aux metadata
  const billingAddressForEmail = session.metadata?.billing_same_as_shipping === 'true' 
    ? shippingAddressForEmail
    : billingAddress ? {
        name: session.metadata?.billing_name || session.customer_details?.name || undefined,
        line1: session.metadata?.billing_address || billingAddress.line1 || undefined,
        line2: billingAddress.line2 || undefined,
        city: session.metadata?.billing_city || billingAddress.city || undefined,
        postalCode: session.metadata?.billing_postal_code || billingAddress.postal_code || undefined,
        country: billingAddress.country || 'France',
      } : session.metadata?.billing_address ? {
        name: session.metadata?.billing_name || undefined,
        line1: session.metadata?.billing_address,
        line2: undefined,
        city: session.metadata?.billing_city,
        postalCode: session.metadata?.billing_postal_code,
        country: 'France',
      } : undefined;

  // Prépare l'objet complet pour les emails
  const emailData = {
    orderId,
    customerEmail,
    customerName: session.metadata?.customer_name || session.customer_details?.name || undefined,
    customerPhone: customerPhone || undefined,
    productName,
    quantity,
    unitPriceCents: unitPrice || Math.round((session.amount_total || 0) / quantity),
    amountCents: session.amount_total || 0,
    currency: (session.currency || "EUR").toUpperCase(),
    shippingAddress: shippingAddressForEmail,
    billingAddress: billingAddressForEmail,
    promoCode: promoCode || undefined,
    discountCents: discountAmount,
    stripePaymentId: paymentIntentId || undefined,
    // Factures (on n'utilise plus Stripe Invoice, on génère la nôtre)
    invoiceUrl: undefined as string | undefined, // Désactivé
    invoiceNumber: undefined as string | undefined, // Sera remplacé par notre numéro
    invoicePdf: undefined as { content: string; filename: string } | undefined,
  };

  // ============================================
  // GÉNÉRATION DE LA FACTURE PDF MAISON
  // ============================================
  if (invoiceNumber) {
    try {
      // Préparer les données pour la facture
      const amountTTC = session.amount_total || 0;
      const amountHT = Math.round(amountTTC / 1.2);
      const vatAmount = amountTTC - amountHT;
      const unitPriceHTCents = Math.round(amountHT / quantity);
      
      // Calculer la réduction si présente
      const discountHTCents = discountAmount ? Math.round(discountAmount / 1.2) : undefined;
      const subtotalHTCents = discountHTCents ? amountHT + discountHTCents : amountHT;

      const invoiceData: InvoiceData = {
        invoiceNumber: invoiceNumber,
        orderNumber: orderId,
        date: new Date(),
        customer: {
          name: billingAddressForEmail?.name || shippingAddressForEmail?.name || session.customer_details?.name || 'Client',
          company: session.metadata?.billing_company || session.metadata?.customer_company || undefined,
          email: customerEmail,
          phone: customerPhone || undefined,
          address: {
            line1: billingAddressForEmail?.line1 || shippingAddressForEmail?.line1 || '',
            postalCode: billingAddressForEmail?.postalCode || shippingAddressForEmail?.postalCode || '',
            city: billingAddressForEmail?.city || shippingAddressForEmail?.city || '',
            country: billingAddressForEmail?.country || 'France',
          },
        },
        items: [{
          ref: 'RK01',
          description: `Système autonome d'extinction incendie`,
          quantity,
          unitPriceHT: unitPriceHTCents / 100,
          totalHT: (unitPriceHTCents * quantity) / 100,
        }],
        promoCode: promoCode || undefined,
        promoDiscount: discountHTCents ? discountHTCents / 100 : undefined,
        totalHT: amountHT / 100,
        tvaRate: 0.20,
        tvaAmount: vatAmount / 100,
        totalTTC: amountTTC / 100,
        isPaid: true,
        paymentMethod: 'Carte bancaire (Stripe)',
      };

      // Générer le PDF en base64
      const pdfBase64 = await generateInvoicePDFBase64(invoiceData);
      
      // Ajouter à l'email
      emailData.invoiceNumber = invoiceNumber;
      emailData.invoicePdf = {
        content: pdfBase64,
        filename: `Facture-${invoiceNumber}.pdf`,
      };

      console.log("[Fulfillment] Invoice PDF generated successfully");
    } catch (invoiceError) {
      console.error("[Fulfillment] Failed to generate invoice PDF:", invoiceError);
      Sentry.captureException(invoiceError, {
        tags: { api: "webhook-stripe", step: "invoice-generation" },
      });
      // Continue sans facture PDF (l'email partira quand même)
    }
  }

  // Envoie l'email de confirmation au client (avec facture PDF en pièce jointe)
  const emailResult = await sendOrderConfirmationEmail(emailData);

  if (emailResult.success) {
    console.log("[Fulfillment] Confirmation email sent to:", customerEmail);
  } else {
    console.error("[Fulfillment] Failed to send confirmation email");
  }

  // Envoie notification admin (avec tous les détails)
  await sendAdminNotificationEmail(emailData);
  
  log("Order processed successfully:", orderId);
  return { status: "created", orderNumber: orderId, emailSent: emailResult.success };
}
