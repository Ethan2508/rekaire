"use client";

// ============================================
// REKAIRE - Pop-up d'invitation à signer la pétition
// Affichée une fois, après le choix des cookies, jamais dans le tunnel de commande
// ni pendant une campagne promo (pour ne pas s'empiler avec sa pop-up).
// ============================================

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, PenLine } from "lucide-react";
import { petition } from "@/config/petition";
import { isPromoCampaignRunning } from "@/config/promo-campaign";
import { trackEvent } from "@/lib/tracking";

const SEEN_KEY = `rk_petition_popup_seen_${petition.url}`;
const CONSENT_KEY = "rekaire_cookie_consent";
const HIDDEN_ON = ["/checkout", "/success", "/cancel", "/admin", "/cgv", "/mentions-legales", "/confidentialite"];
const DELAY_MS = 8000;

function safeGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, new Date().toISOString());
  } catch {
    // ignoré
  }
}

export function PetitionPopup() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const hiddenHere = HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (!petition.active || hiddenHere || isPromoCampaignRunning() || safeGet(SEEN_KEY)) return;

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

  const close = () => {
    markSeen();
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const sign = () => {
    trackEvent({ event: "cta_click", data: { cta_location: "petition-popup" } });
    markSeen();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {/* hiddenHere : une pop-up programmée ailleurs ne doit jamais s'ouvrir dans le tunnel */}
      {open && !hiddenHere && (
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
            aria-labelledby="petition-title"
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
                <PenLine className="w-3.5 h-3.5" /> Pétition
              </span>
              <h2 id="petition-title" className="mt-3 text-2xl font-extrabold tracking-tight leading-tight">
                {petition.title}
              </h2>
            </div>

            <div className="px-6 py-6 text-center">
              <p className="text-gray-700">
                Un incendie domestique sur quatre part de l&apos;installation électrique, souvent la nuit. Nous demandons que les
                extincteurs automatiques pour tableaux électriques soient pris en charge à au moins 40 %.
              </p>
              <a
                href={petition.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={sign}
                className="mt-5 block w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25"
              >
                Signer la pétition
              </a>
              <button onClick={close} className="mt-3 text-sm text-gray-500 hover:text-gray-700">
                Plus tard
              </button>
              <p className="mt-2 text-xs text-gray-400">Signature gratuite sur change.org, en 30 secondes</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
