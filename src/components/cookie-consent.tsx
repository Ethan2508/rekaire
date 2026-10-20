// ============================================
// REKAIRE - Cookie Consent Banner (RGPD)
// ============================================

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

type ConsentStatus = "pending" | "accepted" | "rejected" | "custom";

interface CookiePreferences {
  necessary: boolean; // Toujours true
  analytics: boolean;
  marketing: boolean;
}

const CONSENT_KEY = "rekaire_cookie_consent";
const PREFERENCES_KEY = "rekaire_cookie_preferences";

const texts = {
  fr: {
    title: "🍪 Nous utilisons des cookies",
    intro: "Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. En cliquant sur \"Tout accepter\", vous consentez à l'utilisation de tous les cookies.",
    more: "En savoir plus",
    policyHref: "/confidentialite",
    acceptAll: "Tout accepter",
    rejectAll: "Tout refuser",
    customize: "Personnaliser",
    settingsTitle: "Paramètres des cookies",
    necessaryTitle: "Cookies nécessaires",
    necessaryDesc: "Essentiels au fonctionnement du site (session, sécurité)",
    analyticsTitle: "Cookies analytiques",
    analyticsDesc: "Google Analytics pour comprendre l'utilisation du site",
    marketingTitle: "Cookies marketing",
    marketingDesc: "Meta Pixel et Google Ads pour des publicités pertinentes",
    save: "Enregistrer mes préférences",
    close: "Fermer",
  },
  es: {
    title: "Utilizamos cookies",
    intro: "Utilizamos cookies propias y de terceros para analizar el uso del sitio y medir nuestras campañas. Puede aceptarlas, rechazarlas o configurarlas.",
    more: "Política de cookies",
    policyHref: "/politica-de-cookies",
    acceptAll: "Aceptar todas",
    rejectAll: "Rechazar todas",
    customize: "Configurar",
    settingsTitle: "Configuración de cookies",
    necessaryTitle: "Cookies técnicas",
    necessaryDesc: "Imprescindibles para el funcionamiento y la seguridad del sitio",
    analyticsTitle: "Cookies analíticas",
    analyticsDesc: "Google Analytics, para conocer el uso del sitio",
    marketingTitle: "Cookies publicitarias",
    marketingDesc: "Google Ads, para medir y mejorar nuestras campañas",
    save: "Guardar preferencias",
    close: "Cerrar",
  },
} as const;

export function CookieConsent({ locale = "fr" }: { locale?: keyof typeof texts } = {}) {
  const t = texts[locale];
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    // localStorage peut lever SecurityError (mode privé, cookies tiers bloqués, iframe cross-origin)
    let consent: string | null = null;
    let savedPrefs: string | null = null;
    try {
      consent = localStorage.getItem(CONSENT_KEY);
      savedPrefs = localStorage.getItem(PREFERENCES_KEY);
    } catch {
      // Storage inaccessible : on affiche la bannière par défaut, sans persistance possible
    }

    if (!consent) {
      // Attendre un peu avant d'afficher la bannière
      const timer = setTimeout(() => setShowBanner(true), 600);
      return () => clearTimeout(timer);
    } else if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs) as CookiePreferences;
        setPreferences(prefs);
        loadScripts(prefs);
      } catch {
        // JSON invalide : ignorer
      }
    }
  }, []);

  const loadScripts = (prefs: CookiePreferences) => {
    // Déclencher un événement custom pour que Analytics sache quoi charger
    window.dispatchEvent(
      new CustomEvent("cookieConsent", { detail: prefs })
    );
  };

  const handleAcceptAll = () => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveConsent("accepted", prefs);
  };

  const handleRejectAll = () => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveConsent("rejected", prefs);
  };

  const handleSavePreferences = () => {
    saveConsent("custom", preferences);
  };

  const saveConsent = (status: ConsentStatus, prefs: CookiePreferences) => {
    try {
      localStorage.setItem(CONSENT_KEY, status);
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } catch {
      // Storage inaccessible : le choix ne sera pas persisté, mais on continue la session
    }
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
    loadScripts(prefs);

    // Envoyer à GTM
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "cookie_consent_update",
        cookie_consent: {
          analytics: prefs.analytics,
          marketing: prefs.marketing,
        },
      });
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Bandeau compact en bas d'écran, sans voile : la page reste visible et lisible.
          « Tout refuser » est aussi visible que « Tout accepter » (exigence CNIL / AEPD). */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-3 sm:p-4" role="dialog" aria-live="polite" aria-label={t.title}>
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] border border-gray-200 overflow-hidden">
          {!showSettings ? (
            // Vue principale
            <div className="p-4 sm:p-5">
              <p className="text-gray-700 text-[13px] sm:text-sm leading-snug">
                <Cookie className="inline w-4 h-4 text-orange-600 mr-1.5 -mt-0.5" aria-hidden="true" />
                <strong className="font-semibold text-gray-900">{t.title}.</strong> {t.intro}{" "}
                <Link href={t.policyHref} className="text-orange-600 underline">
                  {t.more}
                </Link>
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-none min-w-[8rem] px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  {t.acceptAll}
                </button>
                <button
                  onClick={handleRejectAll}
                  className="flex-1 sm:flex-none min-w-[8rem] px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  {t.rejectAll}
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-full sm:w-auto px-3 py-2 text-gray-600 hover:text-gray-900 text-sm underline underline-offset-2"
                >
                  {t.customize}
                </button>
              </div>
            </div>
          ) : (
            // Vue paramètres
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t.settingsTitle}
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  aria-label={t.close}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Cookies nécessaires */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{t.necessaryTitle}</h4>
                    <p className="text-sm text-gray-500">
                      {t.necessaryDesc}
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-orange-500 rounded-full flex items-center justify-end px-1 cursor-not-allowed opacity-60">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>

                {/* Cookies analytics */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{t.analyticsTitle}</h4>
                    <p className="text-sm text-gray-500">
                      {t.analyticsDesc}
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      preferences.analytics ? "bg-orange-500 justify-end" : "bg-gray-300 justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>

                {/* Cookies marketing */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{t.marketingTitle}</h4>
                    <p className="text-sm text-gray-500">
                      {t.marketingDesc}
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      preferences.marketing ? "bg-orange-500 justify-end" : "bg-gray-300 justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                >
                  {t.save}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  {t.acceptAll}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
