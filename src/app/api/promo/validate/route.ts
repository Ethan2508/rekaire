// ============================================
// REKAIRE - Promo Code Validation API (Server-Side)
// 🔒 SÉCURISÉ : Les clients ne peuvent plus voir tous les codes dans Supabase
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimitDB } from "@/lib/rate-limit";

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  // 🔒 RATE LIMITING
  // 🔒 RATE LIMITING (DB-based, serverless-safe)
  const rateLimitResponse = await rateLimitDB(request, {
    maxRequests: 10,
    keyPrefix: "promo",
  });
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const { code, orderAmount } = body;

    // Validation des inputs
    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, error: "Code promo requis" },
        { status: 400 }
      );
    }

    if (!orderAmount || typeof orderAmount !== "number" || orderAmount <= 0) {
      return NextResponse.json(
        { valid: false, error: "Montant de commande invalide" },
        { status: 400 }
      );
    }

    // 🔒 Sanitisation du code
    const sanitizedCode = code.toUpperCase().trim().slice(0, 50);
    
    // Vérifier format alphanumérique
    if (!/^[A-Z0-9]+$/.test(sanitizedCode)) {
      return NextResponse.json({
        valid: false,
        error: "Code promo invalide",
      });
    }

    // Récupérer le code promo depuis Supabase avec SERVICE_ROLE
    const { data: promoCode, error } = await supabaseAdmin
      .from("promo_codes")
      .select("*")
      .eq("code", sanitizedCode)
      .eq("is_active", true)
      .single();

    if (error || !promoCode) {
      return NextResponse.json({
        valid: false,
        error: "Code promo invalide",
      });
    }

    // Vérifier les dates de validité
    const now = new Date();
    if (promoCode.valid_from && new Date(promoCode.valid_from) > now) {
      return NextResponse.json({
        valid: false,
        error: "Ce code promo n'est pas encore valide",
      });
    }

    if (promoCode.valid_until && new Date(promoCode.valid_until) < now) {
      return NextResponse.json({
        valid: false,
        error: "Ce code promo a expiré",
      });
    }

    // Vérifier le nombre d'utilisations
    if (
      promoCode.max_uses &&
      promoCode.current_uses >= promoCode.max_uses
    ) {
      return NextResponse.json({
        valid: false,
        error: "Ce code promo a atteint sa limite d'utilisation",
      });
    }

    // Vérifier le montant minimum (en centimes)
    if (promoCode.min_order && orderAmount < promoCode.min_order) {
      return NextResponse.json({
        valid: false,
        error: `Commande minimum de ${(promoCode.min_order / 100).toFixed(2)}€ requise`,
      });
    }

    // Calculer la réduction (discount_percent = pourcentage)
    // 🔒 Limiter à 100% maximum
    const safePercentage = Math.min(Math.max(0, promoCode.discount_percent), 100);
    let discount = Math.round((orderAmount * safePercentage) / 100);

    // 🔒 S'assurer que la réduction ne dépasse JAMAIS le montant total
    discount = Math.max(0, Math.min(discount, orderAmount));

    return NextResponse.json({
      valid: true,
      discount,
      code: sanitizedCode,
      discountPercent: promoCode.discount_percent,
    });
  } catch (error) {
    console.error("[Promo API] Error:", error);
    return NextResponse.json(
      { valid: false, error: "Erreur lors de la validation du code promo" },
      { status: 500 }
    );
  }
}
