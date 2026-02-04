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
  // MISE À JOUR SUPABASE (Stock + Compteur + Commande)
  // ============================================
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shippingDetails = (session as any).shipping_details;
    const shippingCity = shippingDetails?.address?.city || 'France';
    
    const amountTotal = session.amount_total || 0;
    const totalTTC = amountTotal;
    const totalHT = Math.round(totalTTC / 1.2);
    const unitPriceHT = Math.round(totalHT / quantity);

    // Créer la commande dans Supabase
    await createSupabaseOrder({
      stripe_session_id: session.id,
      stripe_payment_intent: typeof session.payment_intent === 'string' 
        ? session.payment_intent 
        : session.payment_intent?.id,
      product_slug: 'rk01',
      quantity,
      unit_price_ht: unitPriceHT,
      total_ht: totalHT,
      total_ttc: totalTTC,
      customer_email: customerEmail,
      customer_name: session.customer_details?.name || undefined,
      shipping_city: shippingCity,
    });
    console.log("[Webhook] Order created in Supabase");

    // Décrémenter le stock
    await decrementStock('rk01', quantity);
    console.log("[Webhook] Stock decremented by", quantity);

    // Incrémenter le compteur de ventes
    const newCount = await incrementSalesCounter(quantity);
    console.log("[Webhook] Sales counter updated to", newCount);

  } catch (supabaseError) {
    console.error("[Webhook] Error updating Supabase:", supabaseError);
    // Ne pas bloquer le webhook même si Supabase échoue
  }

  // ============================================
  // ENVOI DES EMAILS
  // ============================================
  
  // Envoie l'email de confirmation
  const emailResult = await sendOrderConfirmationEmail({
    orderId,
    customerEmail,
    customerName: session.customer_details?.name || undefined,
    productName,
    quantity,
    amountCents: session.amount_total || 0,
    currency: (session.currency || "EUR").toUpperCase(),
  });

  if (emailResult.success) {
    console.log("[Webhook] Confirmation email sent to:", customerEmail);
  } else {
    console.error("[Webhook] Failed to send confirmation email");
  }

  // Envoie notification admin
  await sendAdminNotificationEmail({
    orderId,
    customerEmail,
    productName,
    quantity,
    amountCents: session.amount_total || 0,
    currency: (session.currency || "EUR").toUpperCase(),
  });
  
  console.log("[Webhook] Order processed successfully:", orderId);
}
