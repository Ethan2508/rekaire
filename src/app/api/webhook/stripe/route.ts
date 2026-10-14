// ============================================
// REKAIRE - Stripe Webhook Handler (Sécurisé)
// Protection contre double traitement avec vérification DB
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/stripe";
import { fulfillPaidSession } from "@/lib/fulfillment";
import Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";

// Désactive le body parser pour les webhooks Stripe
export const runtime = "nodejs";

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

  console.log(`[Webhook] 📥 Event reçu: ${event.type} (${event.id})`);

  // Handle events
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Traitement partagé (idempotent). En cas d'échec d'enregistrement, l'erreur remonte :
        // on répond 500 pour que Stripe réessaie, et l'admin a déjà reçu une alerte.
        const result = await fulfillPaidSession(session.id, "webhook");
        console.log(`[Webhook] Résultat : ${result.status}`);
        if (result.status === "duplicate") {
          return NextResponse.json({ received: true, duplicate: true });
        }
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
    Sentry.captureException(error, {
      tags: { api: "webhook-stripe", eventType: event.type },
      extra: { eventId: event.id },
    });
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
