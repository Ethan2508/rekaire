// ============================================
// REKAIRE - Promo Codes Management
// Validation et application des codes promo
// ============================================

import { supabase } from "@/lib/supabase";

export interface PromoCode {
  id: string;
  code: string;
  discount_percent: number; // pourcentage de réduction (ex: 10 pour -10%)
  is_active: boolean;
  valid_from?: string;
  valid_until?: string;
  max_uses?: number; // nombre max d'utilisations
  current_uses: number;
  min_order?: number; // montant minimum de commande
  created_at: string;
}

export interface PromoValidation {
  valid: boolean;
  error?: string;
  discount?: number;
  code?: PromoCode;
}

/**
 * Valider un code promo via l'API serveur
 * 🔒 SÉCURISÉ : Utilise l'API serveur au lieu de Supabase direct
 */
export async function validatePromoCode(
  code: string,
  orderAmount: number
): Promise<PromoValidation> {
  try {
    // 🔒 Sanitisation du code
    const sanitizedCode = code.toUpperCase().trim().slice(0, 50);
    
    // Vérifier format alphanumérique
    if (!/^[A-Z0-9]+$/.test(sanitizedCode)) {
      return {
        valid: false,
        error: "Code promo invalide",
      };
    }

    // Vérifier montant positif
    if (orderAmount <= 0) {
      return {
        valid: false,
        error: "Montant invalide",
      };
    }

    // 🔒 Appeler l'API serveur au lieu de Supabase directement
    const response = await fetch("/api/promo/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: sanitizedCode,
        orderAmount,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.valid) {
      return {
        valid: false,
        error: data.error || "Code promo invalide",
      };
    }

    return {
      valid: true,
      discount: data.discount,
      code: {
        id: "",
        code: data.code,
        discount_percent: data.discountPercent,
        is_active: true,
        current_uses: 0,
        created_at: new Date().toISOString(),
      } as PromoCode,
    };
  } catch (error) {
    console.error("Erreur validation code promo:", error);
    return {
      valid: false,
      error: "Erreur lors de la validation du code promo",
    };
  }
}

/**
 * Incrémenter le compteur d'utilisation d'un code promo
 */
export async function incrementPromoUsage(codeId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc("increment_promo_usage", {
      promo_id: codeId,
    });

    return !error;
  } catch (error) {
    console.error("Erreur incrémentation usage:", error);
    return false;
  }
}

/**
 * Formater l'affichage d'une réduction (toujours en pourcentage)
 */
export function formatDiscount(percent: number): string {
  return `-${percent}%`;
}
