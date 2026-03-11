// ============================================
// REKAIRE - GTM & Analytics Script Component (RGPD Compliant)
// Google Consent Mode v2
// ============================================

"use client";

import { useEffect } from "react";
import Script from "next/script";
import { trackingConfig } from "@/config/tracking";

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
    fbq: (...args: unknown[]) => void;
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

    // Vérifier le consentement existant au chargement
    const savedPrefs = localStorage.getItem(PREFERENCES_KEY);
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs) as CookiePreferences;
      updateGoogleConsent(prefs);
    }

    // Écouter les changements de consentement
    const handleConsent = (e: Event) => {
      const customEvent = e as CustomEvent<CookiePreferences>;
      updateGoogleConsent(customEvent.detail);
    };

    window.addEventListener("cookieConsent", handleConsent);
    return () => window.removeEventListener("cookieConsent", handleConsent);
  }, []);

  return (
    <>
      {/* Les scripts Google sont maintenant dans layout.tsx avec beforeInteractive */}
      {/* Ce composant gère uniquement les mises à jour de consentement et Meta Pixel */}

      {/* Meta Pixel - chargé si configuré et consentement vérifié côté client */}
      {meta.pixelId && !meta.pixelId.includes('PLACEHOLDER') && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var prefs = localStorage.getItem('${PREFERENCES_KEY}');
                if (!prefs) return;
                var consent = JSON.parse(prefs);
                if (!consent.marketing) return;
                
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${meta.pixelId}');
                fbq('track', 'PageView');
              })();
            `,
          }}
        />
      )}
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
