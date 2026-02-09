// ============================================
// REKAIRE - API Vérification Paiement
// Vérifie qu'une commande a bien été payée
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  if (!sessionId && !orderId) {
    return NextResponse.json(
      { verified: false, error: "session_id ou order_id requis" },
      { status: 400 }
    );
  }

  try {
    // Méthode 1: Vérifier via Stripe session_id
    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status === "paid") {
        // Vérifier aussi en DB
        const { data: order } = await supabaseAdmin
          .from("orders")
          .select("id, status, order_number, customer_email")
          .eq("stripe_session_id", sessionId)
          .single();

        if (order) {
          return NextResponse.json({
            verified: true,
            orderId: order.id,
            orderNumber: order.order_number,
            status: order.status,
            email: order.customer_email,
          });
        }

        // Session payée mais pas encore en DB (webhook en cours)
        return NextResponse.json({
          verified: true,
          pending: true,
          message: "Paiement confirmé, traitement en cours",
        });
      }

      return NextResponse.json({
        verified: false,
        error: "Paiement non confirmé",
        status: session.payment_status,
      });
    }

    // Méthode 2: Vérifier via order_id
    if (orderId) {
      const { data: order, error } = await supabaseAdmin
        .from("orders")
        .select("id, status, order_number, customer_email, stripe_session_id")
        .or(`id.eq.${orderId},order_number.eq.${orderId}`)
        .single();

      if (error || !order) {
        return NextResponse.json({
          verified: false,
          error: "Commande non trouvée",
        });
      }

      // Vérifier que le statut n'est pas "pending"
      const paidStatuses = ["paid", "shipped", "delivered", "partially_refunded"];
      const isPaid = paidStatuses.includes(order.status);

      return NextResponse.json({
        verified: isPaid,
        orderId: order.id,
        orderNumber: order.order_number,
        status: order.status,
        email: order.customer_email,
        ...(isPaid ? {} : { error: "Paiement non confirmé" }),
      });
    }

    return NextResponse.json({ verified: false, error: "Paramètres invalides" });
  } catch (error: any) {
    console.error("[VerifyPayment] Error:", error);
    return NextResponse.json(
      { verified: false, error: "Erreur de vérification" },
      { status: 500 }
    );
  }
}
