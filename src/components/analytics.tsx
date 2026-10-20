// ============================================
// REKAIRE - GTM & Analytics Script Component (RGPD Compliant)
// Google Consent Mode v2
// ============================================

"use client";

import { useEffect } from "react";
import { trackingConfig } from "@/config/tracking";
import { flushMetaQueue } from "@/lib/tracking";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const PREFERENCES_KEY = "rekaire_cookie_preferences";

// Déclarer gtag globalement
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const { meta } = trackingConfig;

  useEffect(() => {
    // Fonction pour mettre à jour le consentement Google
    const updateGoogleConsent = (prefs: CookiePreferences) => {
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: prefs.analytics ? "granted" : "denied",
          ad_storage: prefs.marketing ? "granted" : "denied",
          ad_user_data: prefs.marketing ? "granted" : "denied",
          ad_personalization: prefs.marketing ? "granted" : "denied",
        });
      }
    };

    // Charge le pixel Meta une seule fois, et seulement avec le consentement marketing
    const loadMetaPixel = (prefs: CookiePreferences) => {
      if (!prefs.marketing || !meta.pixelId || meta.pixelId.includes("PLACEHOLDER") || window.fbq) return;
      /* eslint-disable */
      // Code officiel Meta
      (function (f: any, b: Document, e: string, v: string) {
        if (f.fbq) return;
        const n: any = (f.fbq = function (...args: unknown[]) {
          n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
        });
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        const t = b.createElement(e) as HTMLScriptElement;
        t.async = true;
        t.src = v;
        const s = b.getElementsByTagName(e)[0];
        s.parentNode?.insertBefore(t, s);
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      /* eslint-enable */
      // Relu via une fonction : TypeScript le croit encore absent après le test ci-dessus
      const getFbq = () => window.fbq;
      getFbq()?.("init", meta.pixelId);
      getFbq()?.("track", "PageView");
      // Événements survenus avant le consentement (ex. arrivée sur la page produit)
      flushMetaQueue();
    };

    // Vérifier le consentement existant au chargement
    // localStorage peut lever SecurityError (mode privé, iframe cross-origin, etc.)
    try {
      const savedPrefs = localStorage.getItem(PREFERENCES_KEY);
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs) as CookiePreferences;
        updateGoogleConsent(prefs);
        loadMetaPixel(prefs);
      }
    } catch {
      // Storage inaccessible : consentement par défaut (denied)
    }

    // Écouter les changements de consentement
    const handleConsent = (e: Event) => {
      const customEvent = e as CustomEvent<CookiePreferences>;
      updateGoogleConsent(customEvent.detail);
      loadMetaPixel(customEvent.detail);
    };

    window.addEventListener("cookieConsent", handleConsent);
    return () => window.removeEventListener("cookieConsent", handleConsent);
  }, [meta.pixelId]);

  return (
    <>
      {/* Les scripts Google sont maintenant dans layout.tsx avec beforeInteractive */}
      {/* Ce composant gère les mises à jour de consentement ; le pixel Meta est chargé dans le useEffect */}

    </>
  );
}

// GTM NoScript (pour le body)
export function GTMNoScript() {
  const { gtm } = trackingConfig;
  if (!gtm.id || gtm.id.includes('PLACEHOLDER')) return null;
  
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtm.id}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
