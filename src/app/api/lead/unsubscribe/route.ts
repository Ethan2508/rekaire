// ============================================
// REKAIRE - Désinscription des emails de relance
// Lien présent dans chaque relance (et en-tête List-Unsubscribe en un clic).
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function unsubscribe(token: string | null) {
  if (!token || !UUID.test(token)) return false;
  const { error } = await supabaseAdmin
    .from("leads")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .is("unsubscribed_at", null);
  return !error;
}

function page(message: string) {
  return new NextResponse(
    `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Rekaire</title><meta name="robots" content="noindex"></head>
<body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;color:#111827;">
<div style="max-width:480px;margin:80px auto;padding:32px 24px;background:#fff;border-radius:12px;text-align:center;">
<p style="font-size:18px;">${message}</p><p><a href="https://www.rekaire.fr" style="color:#eb5122;">Retour sur rekaire.fr</a></p></div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

// Clic sur le lien dans l'email
export async function GET(request: NextRequest) {
  await unsubscribe(request.nextUrl.searchParams.get("t"));
  return page("C'est noté : vous ne recevrez plus de rappel concernant votre commande.");
}

// Désinscription en un clic depuis la messagerie (RFC 8058)
export async function POST(request: NextRequest) {
  const ok = await unsubscribe(request.nextUrl.searchParams.get("t"));
  return NextResponse.json({ ok });
}
