// ============================================
// REKAIRE - Stripe Webhook Handler (Sécurisé)
// Protection contre double traitement incluse
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, getCheckoutSession } from "@/lib/stripe";
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email";
import { incrementSalesCounter, decrementStock, createOrder as createSupabaseOrder } from "@/lib/supabase-admin";
import Stripe from "stripe";

// Désactive le body parser pour les webhooks Stripe
export const runtime = "nodejs";

// ============================================
// Protection contre le double traitement
// ============================================
const processedEvents = new Set<string>();
const MAX_PROCESSED_EVENTS = 1000;

function markEventProcessed(eventId: string): boolean {
  // Vérifie si déjà traité
  if (processedEvents.has(eventId)) {
    return false; // Déjà traité
  }
  
  // Ajoute à la liste
  processedEvents.add(eventId);
  
  // Nettoie si trop d'événements (garde les 1000 derniers)
  if (processedEvents.size > MAX_PROCESSED_EVENTS) {
    const firstEvent = processedEvents.values().next().value;
    if (firstEvent) processedEvents.delete(firstEvent);
  }
  
  return true; // Nouveau, peut être traité
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("[Webhook] No signature");
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = verifyWebhookSignature(body, signature);
  } catch (error) {
    console.error("[Webhook] Signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // ============================================
  // Protection double traitement
  // ============================================
  if (!markEventProcessed(event.id)) {
    console.log(`[Webhook] ⚠️ Event ${event.id} déjà traité, ignoré`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  console.log(`[Webhook] 📥 Event reçu: ${event.type} (${event.id})`);

  // Handle events
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("[Webhook] Checkout expired:", session.metadata?.order_id);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Webhook] Payment succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Webhook] Payment failed:", paymentIntent.id);
        // Optionnel: envoyer un email d'échec, logging, etc.
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// ============================================
// Handle checkout.session.completed
// ============================================
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id;
  const customerEmail = session.customer_details?.email;

  console.log("[Webhook] Checkout completed:", {
    orderId,
    email: customerEmail,
    amount: session.amount_total,
    currency: session.currency,
  });

  if (!orderId || !customerEmail) {
    console.error("[Webhook] Missing order_id or email");
    return;
  }

  // Récupère les détails complets de la session
  const fullSession = await getCheckoutSession(session.id);
  
  if (!fullSession) {
    console.error("[Webhook] Could not retrieve full session");
    return;
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
    console.error('[Webhook] ⚠️ FRAUDE DÉTECTÉE: Montant incorrect', {
      orderId,
      expectedTotalTTC,
      amountPaid,
      difference: amountPaid - expectedTotalTTC
    });
    // Logger l'incident mais traiter quand même la commande (Stripe a déjà encaissé)
    // TODO: Envoyer une alerte admin
  }

  // ============================================
  // MISE À JOUR SUPABASE (Stock + Compteur + Commande)
  // ============================================
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shippingDetails = (session as any).shipping_details;
  const billingAddress = session.customer_details?.address;
  
  // Récupérer la facture Stripe (générée par invoice_creation)
  let invoiceUrl: string | undefined;
  let invoiceNumber: string | undefined;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invoiceId = (session as any).invoice;
  if (invoiceId) {
    try {
      const { stripe } = await import("@/lib/stripe");
      const invoice = await stripe.invoices.retrieve(invoiceId);
      invoiceUrl = invoice.hosted_invoice_url || undefined;
      invoiceNumber = invoice.number || undefined;
      console.log("[Webhook] Invoice retrieved:", invoiceNumber, invoiceUrl);
    } catch (invoiceError) {
      console.error("[Webhook] Could not retrieve invoice:", invoiceError);
    }
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
      // Code promo & Facture Stripe
      promo_code: promoCode,
      promo_discount: promoDiscount,
      invoice_number: invoiceNumber,
      invoice_url: invoiceUrl,
    });
    console.log("[Webhook] Order created in Supabase with full billing/shipping addresses");

    // Décrémenter le stock
    await decrementStock('rk01', expectedQuantity); // 🔒 Utiliser la quantité validée
    console.log("[Webhook] Stock decremented by", quantity);

    // Incrémenter le compteur de ventes
    const newCount = await incrementSalesCounter(expectedQuantity); // 🔒 Utiliser la quantité validée
    console.log("[Webhook] Sales counter updated to", newCount);

  } catch (supabaseError) {
    console.error("[Webhook] Error updating Supabase:", supabaseError);
    // Ne pas bloquer le webhook même si Supabase échoue
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
    // Facture Stripe
    invoiceUrl: invoiceUrl || undefined,
    invoiceNumber: invoiceNumber || undefined,
  };

  // Envoie l'email de confirmation au client
  const emailResult = await sendOrderConfirmationEmail(emailData);

  if (emailResult.success) {
    console.log("[Webhook] Confirmation email sent to:", customerEmail);
  } else {
    console.error("[Webhook] Failed to send confirmation email");
  }

  // Envoie notification admin (avec tous les détails)
  await sendAdminNotificationEmail(emailData);
  
  console.log("[Webhook] Order processed successfully:", orderId);
}
