// ============================================
// REKAIRE - Cookie Consent Banner (RGPD)
// ============================================

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Check, Settings } from "lucide-react";

type ConsentStatus = "pending" | "accepted" | "rejected" | "custom";

interface CookiePreferences {
  necessary: boolean; // Toujours true
  analytics: boolean;
  marketing: boolean;
}

const CONSENT_KEY = "rekaire_cookie_consent";
const PREFERENCES_KEY = "rekaire_cookie_preferences";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Attendre un peu avant d'afficher la bannière
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Charger les préférences existantes
      const savedPrefs = localStorage.getItem(PREFERENCES_KEY);
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs) as CookiePreferences;
        setPreferences(prefs);
        loadScripts(prefs);
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
    localStorage.setItem(CONSENT_KEY, status);
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
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
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]" />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {!showSettings ? (
            // Vue principale
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🍪 Nous utilisons des cookies
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic 
                    et personnaliser le contenu. En cliquant sur &quot;Tout accepter&quot;, vous consentez 
                    à l&apos;utilisation de tous les cookies.{" "}
                    <Link href="/confidentialite" className="text-orange-600 hover:underline">
                      En savoir plus
                    </Link>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Tout accepter
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Tout refuser
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Personnaliser
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Vue paramètres
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Paramètres des cookies
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Cookies nécessaires */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Cookies nécessaires</h4>
                    <p className="text-sm text-gray-500">
                      Essentiels au fonctionnement du site (session, sécurité)
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-orange-500 rounded-full flex items-center justify-end px-1 cursor-not-allowed opacity-60">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>

                {/* Cookies analytics */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Cookies analytiques</h4>
                    <p className="text-sm text-gray-500">
                      Google Analytics pour comprendre l&apos;utilisation du site
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
                    <h4 className="font-medium text-gray-900">Cookies marketing</h4>
                    <p className="text-sm text-gray-500">
                      Meta Pixel et Google Ads pour des publicités pertinentes
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
                  Enregistrer mes préférences
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Tout accepter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Déclaration du type pour window.dataLayer
declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}
