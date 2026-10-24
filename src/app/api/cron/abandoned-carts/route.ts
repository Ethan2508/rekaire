// ============================================
// REKAIRE - Relance des paniers abandonnés
// Toutes les heures : un email ~1 h après l'abandon, un rappel ~24 h plus tard.
// Ne relance pas : les commandes payées, les désinscrits, les demandes de devis,
// les adresses internes, ni les paniers de plus de 3 jours.
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendCartRecoveryEmail } from "@/lib/email";
import { promoCampaign, isPromoCampaignRunning } from "@/config/promo-campaign";

export const runtime = "nodejs";
export const maxDuration = 120;

const FIRST_AFTER_H = 1;
const SECOND_AFTER_H = 23;
const MAX_AGE_H = 72;
const INTERNAL_DOMAINS = ["rekaire.fr", "rekaire.es", "nelior.fr"];

type Lead = {
  id: string;
  email: string;
  first_name: string | null;
  updated_at: string;
  recovery_1_sent_at: string | null;
  unsubscribe_token: string;
};

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

async function hasOrder(email: string) {
  const { data, error } = await supabaseAdmin.from("orders").select("id").ilike("customer_email", email).limit(1);
  if (error) throw new Error(`orders lookup: ${error.message}`);
  return (data?.length ?? 0) > 0;
}

async function run(dryRun: boolean) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://www.rekaire.fr";
  const promo = isPromoCampaignRunning()
    ? { code: promoCampaign.code, percent: promoCampaign.percent, endsLabel: promoCampaign.endsLabel }
    : undefined;

  const select = "id, email, first_name, updated_at, recovery_1_sent_at, unsubscribe_token";
  const common = () =>
    supabaseAdmin.from("leads").select(select).eq("source", "checkout").eq("converted", false).is("unsubscribed_at", null);

  const [first, second] = await Promise.all([
    common().is("recovery_1_sent_at", null).lte("updated_at", hoursAgo(FIRST_AFTER_H)).gte("updated_at", hoursAgo(MAX_AGE_H)),
    common().not("recovery_1_sent_at", "is", null).is("recovery_2_sent_at", null).lte("recovery_1_sent_at", hoursAgo(SECOND_AFTER_H)),
  ]);
  if (first.error || second.error) throw new Error(first.error?.message || second.error?.message);

  const sent: string[] = [];
  const skipped: string[] = [];
  const failed: string[] = [];

  const queue: [Lead, 1 | 2][] = [
    ...((first.data ?? []) as Lead[]).map((l) => [l, 1] as [Lead, 1]),
    ...((second.data ?? []) as Lead[]).map((l) => [l, 2] as [Lead, 2]),
  ];

  for (const [lead, step] of queue) {
    const domain = lead.email.split("@")[1]?.toLowerCase() || "";
    if (INTERNAL_DOMAINS.includes(domain)) {
      skipped.push(`${lead.email} (interne)`);
      continue;
    }
    // Déjà client : on marque le lead converti et on ne relance pas
    if (await hasOrder(lead.email)) {
      if (!dryRun) await supabaseAdmin.from("leads").update({ converted: true }).eq("id", lead.id);
      skipped.push(`${lead.email} (déjà commandé)`);
      continue;
    }
    if (dryRun) {
      sent.push(`${lead.email} → relance ${step} (simulation)`);
      continue;
    }
    // On réserve l'envoi avant d'envoyer : deux exécutions simultanées ne doublent pas l'email
    const column = step === 1 ? "recovery_1_sent_at" : "recovery_2_sent_at";
    const { data: claimed } = await supabaseAdmin
      .from("leads")
      .update({ [column]: new Date().toISOString() })
      .eq("id", lead.id)
      .is(column, null)
      .select("id");
    if (!claimed?.length) continue;

    const result = await sendCartRecoveryEmail({
      customerEmail: lead.email,
      firstName: lead.first_name || undefined,
      step,
      promo,
      unsubscribeUrl: `${base}/api/lead/unsubscribe?t=${lead.unsubscribe_token}`,
    });
    if (result.success) {
      sent.push(`${lead.email} → relance ${step}`);
    } else {
      // Échec d'envoi : on libère la réservation pour réessayer à la prochaine heure
      await supabaseAdmin.from("leads").update({ [column]: null }).eq("id", lead.id);
      failed.push(`${lead.email} → relance ${step}`);
    }
  }

  return { sent, skipped, failed };
}

// GET : appelé par Vercel Cron (Authorization: Bearer <CRON_SECRET>) ; ?dry=1 : simulation sans envoi
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await run(request.nextUrl.searchParams.get("dry") === "1");
    console.log("[AbandonedCarts] Résultat :", JSON.stringify(result));
    return NextResponse.json(result);
  } catch (error) {
    console.error("[AbandonedCarts] Error:", error);
    return NextResponse.json({ error: "Abandoned carts run failed" }, { status: 500 });
  }
}
