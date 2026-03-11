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
  const { gtm, ga4, meta, googleAds } = trackingConfig;

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
      {/* Google Consent Mode v2 - Défaut: tout sur denied */}
      <Script
        id="google-consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `,
        }}
      />

      {/* GTM - chargé si configuré */}
      {gtm.id && !gtm.id.includes('PLACEHOLDER') && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtm.id}');
            `,
          }}
        />
      )}

      {/* Google Analytics 4 + Google Ads - Toujours chargés */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4.id}`}
        strategy="afterInteractive"
      />
      <Script
        id="gtag-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga4.id}', {
              page_path: window.location.pathname,
            });
            ${googleAds.id && !googleAds.id.includes('PLACEHOLDER') ? `gtag('config', '${googleAds.id}');` : ''}
          `,
        }}
      />

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
