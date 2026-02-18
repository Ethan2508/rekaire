// ============================================
// REKAIRE - GTM & Analytics Script Component (RGPD Compliant)
// ============================================

"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { trackingConfig } from "@/config/tracking";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const PREFERENCES_KEY = "rekaire_cookie_preferences";

export function Analytics() {
  const { gtm, ga4, meta, googleAds } = trackingConfig;
  const [consent, setConsent] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    // Vérifier le consentement existant
    const savedPrefs = localStorage.getItem(PREFERENCES_KEY);
    if (savedPrefs) {
      setConsent(JSON.parse(savedPrefs));
    }

    // Écouter les changements de consentement
    const handleConsent = (e: Event) => {
      const customEvent = e as CustomEvent<CookiePreferences>;
      setConsent(customEvent.detail);
    };

    window.addEventListener("cookieConsent", handleConsent);
    return () => window.removeEventListener("cookieConsent", handleConsent);
  }, []);

  // Aucun script chargé sans consentement
  if (!consent) return null;

  return (
    <>
      {/* GTM - chargé uniquement si analytics OU marketing acceptés */}
      {(consent.analytics || consent.marketing) && (
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

      {/* Google Analytics 4 - uniquement si analytics accepté */}
      {consent.analytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4.id}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4.id}', {
                  page_path: window.location.pathname,
                });
                gtag('config', '${googleAds.id}');
              `,
            }}
          />
        </>
      )}

      {/* Meta Pixel - uniquement si marketing accepté */}
      {consent.marketing && meta.pixelId && !meta.pixelId.includes('PLACEHOLDER') && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
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
            `,
          }}
        />
      )}
    </>
  );
}

// GTM NoScript (pour le body)
export function GTMNoScript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${trackingConfig.gtm.id}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
