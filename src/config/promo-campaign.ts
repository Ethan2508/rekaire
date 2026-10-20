// ============================================
// REKAIRE - Campagne promotionnelle en cours (pop-up + application automatique)
// Le code doit aussi exister dans la table promo_codes (Supabase) : c'est
// elle qui fait foi pour la validation et le calcul côté serveur.
// ============================================

export const promoCampaign = {
  active: true,
  code: "REKAIRE20",
  percent: 20,
  // Dernier jour inclus de l'offre (heure de Paris)
  endsAt: "2026-10-28T23:59:59+01:00",
  endsLabel: "28 octobre",
} as const;

// Clé de stockage : code mémorisé pour l'appliquer automatiquement au paiement
export const PROMO_STORAGE_KEY = "rk_promo_code";

export function isPromoCampaignRunning(now = new Date()) {
  return promoCampaign.active && now <= new Date(promoCampaign.endsAt);
}

export function rememberPromoCode(code: string) {
  try {
    localStorage.setItem(PROMO_STORAGE_KEY, code);
  } catch {
    // Storage indisponible : le code reste saisissable à la main
  }
}

export function getRememberedPromoCode(): string | null {
  try {
    return localStorage.getItem(PROMO_STORAGE_KEY);
  } catch {
    return null;
  }
}
