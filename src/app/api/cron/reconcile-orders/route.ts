// ============================================
// REKAIRE - Rapprochement Stripe ↔ commandes
// Chaque jour : toute session Checkout payée chez Stripe dans les dernières 72 h
// qui n'existe pas en base est enregistrée (commande, facture, emails) et signalée.
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { fulfillPaidSession } from "@/lib/fulfillment";
import { orderExistsByStripeSession } from "@/lib/supabase-admin";
import { sendAdminAlertEmail } from "@/lib/email";

export const runtime = "nodejs";
export const maxDuration = 120;

const LOOKBACK_HOURS = 72;

async function reconcile() {
  const since = Math.floor(Date.now() / 1000) - LOOKBACK_HOURS * 3600;
  const missing: string[] = [];
  const recovered: string[] = [];
  const failed: string[] = [];
  let checked = 0;

  for await (const session of stripe.checkout.sessions.list({ created: { gte: since }, limit: 100 })) {
    if (session.payment_status !== "paid") continue;
    checked++;
    if (await orderExistsByStripeSession(session.id)) continue;

    const label = `${session.metadata?.order_id || "?"} — ${((session.amount_total || 0) / 100).toFixed(2)} € — ${session.customer_details?.email || "?"} (${session.id})`;
    missing.push(label);
    try {
      const result = await fulfillPaidSession(session.id, "reconciliation");
      (result.status === "created" ? recovered : failed).push(`${label} → ${result.status}`);
    } catch (error) {
      failed.push(`${label} → ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (missing.length > 0) {
    await sendAdminAlertEmail({
      subject: `Rapprochement Stripe : ${missing.length} paiement(s) absent(s) de la base`,
      lines: [
        `Sessions payées vérifiées sur ${LOOKBACK_HOURS} h : ${checked}`,
        ...recovered.map((r) => `Récupérée : ${r}`),
        ...failed.map((f) => `ÉCHEC : ${f}`),
        failed.length > 0
          ? "Les commandes en échec doivent être enregistrées à la main depuis Stripe."
          : "Les commandes récupérées ont reçu leur facture et leurs emails normalement.",
      ],
    });
  }

  return { checked, missing: missing.length, recovered: recovered.length, failed: failed.length };
}

// GET : appelé par Vercel Cron (Authorization: Bearer <CRON_SECRET>)
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await reconcile();
    console.log("[Reconcile] Résultat :", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Reconcile] Error:", error);
    return NextResponse.json({ error: "Reconciliation failed" }, { status: 500 });
  }
}
