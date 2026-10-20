// ============================================
// REKAIRE - Campagne promotionnelle en cours (pop-up + application automatique)
// Le code doit aussi exister dans la table promo_codes (Supabase) : c'est
// elle qui fait foi pour la validation et le calcul côté serveur.
// ============================================

export const promoCampaign = {
  active: true,
  code: "REKAIRE20",
  percent: 20,
  // Fin de l'offre (48 h à partir du 20/10/2026 17 h, heure de Paris)
  endsAt: "2026-10-22T17:00:00+02:00",
  endsLabel: "jeudi 22 octobre à 17 h",
} as const;

// Clé de stockage : code mémorisé pour l'appliquer automatiquement au paiement
export const PROMO_STORAGE_KEY = "rk_promo_code";

export function isPromoCampaignRunning(now = new Date()) {
  return promoCampaign.active && now <= new Date(promoCampaign.endsAt);
}

// Temps restant, ex. « 47 h 12 min » ; null si l'offre est terminée
export function promoTimeLeft(now = new Date()): string | null {
  const ms = new Date(promoCampaign.endsAt).getTime() - now.getTime();
  if (ms <= 0) return null;
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min`;
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
