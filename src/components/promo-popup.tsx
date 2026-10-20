"use client";

// ============================================
// REKAIRE - Pop-up promotionnelle (-20 % avec REKAIRE20)
// Affichée une fois, après le choix des cookies (pour ne pas s'empiler avec le
// bandeau), jamais dans le tunnel de commande ni dans l'admin.
// ============================================

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Check, X, Gift } from "lucide-react";
import { promoCampaign, isPromoCampaignRunning, rememberPromoCode, promoTimeLeft } from "@/config/promo-campaign";
import { trackEvent } from "@/lib/tracking";

const SEEN_KEY = `rk_promo_popup_seen_${promoCampaign.code}`;
const CONSENT_KEY = "rekaire_cookie_consent";
const HIDDEN_ON = ["/checkout", "/success", "/cancel", "/admin", "/cgv", "/mentions-legales", "/confidentialite"];
const DELAY_MS = 2500;

function safeGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function PromoPopup() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const hiddenHere = HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (hiddenHere || !isPromoCampaignRunning() || safeGet(SEEN_KEY)) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setOpen(true), DELAY_MS);
    };
    // Choix des cookies déjà fait : on programme tout de suite ; sinon on attend la réponse au bandeau
    if (safeGet(CONSENT_KEY)) schedule();
    window.addEventListener("cookieConsent", schedule);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("cookieConsent", schedule);
    };
  }, [hiddenHere]);

  // Compte à rebours, rafraîchi chaque minute tant que la pop-up est ouverte
  useEffect(() => {
    if (!open) return;
    const tick = () => setTimeLeft(promoTimeLeft());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [open]);

  const markSeen = () => {
    try {
      localStorage.setItem(SEEN_KEY, new Date().toISOString());
    } catch {
      // ignoré
    }
  };

  const close = () => {
    markSeen();
    setOpen(false);
  };

  // Fermeture au clavier
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      try {
        localStorage.setItem(SEEN_KEY, new Date().toISOString());
      } catch {
        // ignoré
      }
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(promoCampaign.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers indisponible (certains navigateurs intégrés) : le code reste lisible
    }
  };

  const claim = () => {
    rememberPromoCode(promoCampaign.code);
    trackEvent({ event: "cta_click", data: { cta_location: "promo-popup", promo_code: promoCampaign.code } });
    markSeen();
    setOpen(false);
    if (pathname === "/produit") {
      document.getElementById("commander")?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      router.push("/produit#commander");
    }
  };


  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9990] flex items-end sm:items-center justify-center p-3 sm:p-6">
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-title"
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
          >
            <button
              onClick={close}
              aria-label="Fermer"
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 px-6 pt-7 pb-6 text-white text-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-white/20 rounded-full px-3 py-1">
                <Gift className="w-3.5 h-3.5" /> Offre spéciale 48 h
              </span>
              <h2 id="promo-title" className="mt-3 text-4xl font-extrabold tracking-tight">
                -{promoCampaign.percent} %
              </h2>
              <p className="mt-1 text-white/90">sur le prix HT de votre RK01</p>
              {timeLeft && (
                <p className="mt-3 inline-block rounded-full bg-black/20 px-3 py-1 text-sm font-semibold">
                  Plus que {timeLeft}
                </p>
              )}
            </div>

            <div className="px-6 py-6 text-center">
              <button
                onClick={copyCode}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 text-left"
                aria-label={`Copier le code ${promoCampaign.code}`}
              >
                <span>
                  <span className="block text-xs text-gray-500">Votre code</span>
                  <span className="block font-mono text-lg font-bold text-gray-900 tracking-wider">{promoCampaign.code}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600">
                  {copied ? <><Check className="w-4 h-4" /> Copié</> : <><Copy className="w-4 h-4" /> Copier</>}
                </span>
              </button>

              <button
                onClick={claim}
                className="mt-4 w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25"
              >
                J&apos;en profite
              </button>
              <p className="mt-3 text-xs text-gray-500">
                Code appliqué automatiquement à la commande · valable jusqu&apos;au {promoCampaign.endsLabel}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
