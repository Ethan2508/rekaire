// ============================================
// REKAIRE - Promo Codes Management
// Validation et application des codes promo
// ============================================

import { supabase } from "@/lib/supabase";

export interface PromoCode {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed"; // pourcentage ou montant fixe
  discount_value: number; // 10 pour 10% ou 20 pour 20€
  active: boolean;
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
 * Valider un code promo
 */
export async function validatePromoCode(
  code: string,
  orderAmount: number
): Promise<PromoValidation> {
  try {
    // Récupérer le code promo
    const { data: promoCode, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .single();

    if (error || !promoCode) {
      return {
        valid: false,
        error: "Code promo invalide",
      };
    }

    // Vérifier si actif
    if (!promoCode.active) {
      return {
        valid: false,
        error: "Ce code promo n'est plus valide",
      };
    }

    // Vérifier les dates de validité
    const now = new Date();
    if (promoCode.valid_from && new Date(promoCode.valid_from) > now) {
      return {
        valid: false,
        error: "Ce code promo n'est pas encore valide",
      };
    }

    if (promoCode.valid_until && new Date(promoCode.valid_until) < now) {
      return {
        valid: false,
        error: "Ce code promo a expiré",
      };
    }

    // Vérifier le nombre d'utilisations
    if (
      promoCode.max_uses &&
      promoCode.current_uses >= promoCode.max_uses
    ) {
      return {
        valid: false,
        error: "Ce code promo a atteint sa limite d'utilisation",
      };
    }

    // Vérifier le montant minimum
    if (promoCode.min_order && orderAmount < promoCode.min_order) {
      return {
        valid: false,
        error: `Commande minimum de ${promoCode.min_order}€ requise`,
      };
    }

    // Calculer la réduction
    let discount = 0;
    if (promoCode.discount_type === "percentage") {
      discount = (orderAmount * promoCode.discount_value) / 100;
    } else {
      discount = promoCode.discount_value;
    }

    // S'assurer que la réduction ne dépasse pas le montant total
    discount = Math.min(discount, orderAmount);

    return {
      valid: true,
      discount: Math.round(discount * 100) / 100, // Arrondir à 2 décimales
      code: promoCode as PromoCode,
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
 * Formater l'affichage d'une réduction
 */
export function formatDiscount(
  type: "percentage" | "fixed",
  value: number
): string {
  if (type === "percentage") {
    return `-${value}%`;
  }
  return `-${value}€`;
}
