// ============================================
// REKAIRE - API Admin Remboursement
// Rembourser une commande et mettre à jour le statut
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import * as Sentry from "@sentry/nextjs";

// Admin emails autorisés
const adminEmailsEnv = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '';
const ADMIN_EMAILS = adminEmailsEnv.split(',').map(e => e.trim().toLowerCase()).filter(e => e);

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user?.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, reason, amount } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId requis" },
        { status: 400 }
      );
    }

    // Récupérer la commande
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 });
    }

    // Vérifier qu'elle n'est pas déjà remboursée
    if (order.status === "refunded") {
      return NextResponse.json(
        { error: "Commande déjà remboursée" },
        { status: 400 }
      );
    }

    // Vérifier qu'on a bien un payment_intent
    if (!order.stripe_payment_intent) {
      return NextResponse.json(
        { error: "Pas de payment_intent trouvé pour cette commande" },
        { status: 400 }
      );
    }

    // Calculer le montant du remboursement
    // Si amount est fourni, l'utiliser (remboursement partiel), sinon remboursement total
    const refundAmount = amount ? Math.round(amount * 100) : undefined; // Convertir en centimes

    // Créer le remboursement dans Stripe
    let refund;
    try {
      refund = await stripe.refunds.create({
        payment_intent: order.stripe_payment_intent,
        amount: refundAmount,
        reason: reason || "requested_by_customer",
        metadata: {
          order_id: orderId,
          refunded_by: user.email,
          refund_reason: reason || "Admin refund",
        },
      });
    } catch (stripeError: any) {
      console.error("[Refund] Stripe error:", stripeError);
      Sentry.captureException(stripeError, {
        extra: { orderId, paymentIntent: order.stripe_payment_intent }
      });
      
      return NextResponse.json(
        { 
          error: "Erreur Stripe",
          details: stripeError.message 
        },
        { status: 500 }
      );
    }

    // Mettre à jour le statut de la commande
    // Note: total_ttc est déjà stocké en centimes dans la DB
    const isPartialRefund = refundAmount && refundAmount < (order.total_ttc || 0);
    const newStatus = isPartialRefund ? "partially_refunded" : "refunded";
    
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: newStatus,
        refund_id: refund.id,
        refund_amount: refund.amount,
        refund_reason: reason || null,
        refunded_at: new Date().toISOString(),
        refunded_by: user.email,
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("[Refund] Update error:", updateError);
      Sentry.captureException(updateError, { extra: { orderId } });
      
      return NextResponse.json(
        { 
          error: "Remboursement créé mais erreur mise à jour DB",
          refundId: refund.id 
        },
        { status: 500 }
      );
    }

    // Logger l'action admin
    try {
      await supabaseAdmin.from("admin_audit_log").insert({
        admin_email: user.email,
        action: "refund_order",
        target_type: "order",
        target_id: orderId,
        details: {
          refund_id: refund.id,
          amount: refund.amount,
          reason: reason || "requested_by_customer",
          status: refund.status,
        },
      });
    } catch (logError) {
      console.error("[Refund] Audit log error:", logError);
      // Continue même si le log échoue
    }

    // Optionnel: Envoyer un email au client
    // TODO: Créer sendRefundEmail dans lib/email.ts

    return NextResponse.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
        created: refund.created,
      },
      order: {
        id: orderId,
        status: newStatus,
      },
    });

  } catch (error: any) {
    console.error("[Refund] Error:", error);
    Sentry.captureException(error);
    
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}
