// ============================================
// REKAIRE ES - Root Layout (rekaire.es)
// Servido en rekaire.es/* mediante el middleware (prefijo interno /es)
// ============================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { Analytics, GTMNoScript } from "@/components/analytics";
import { CookieConsent } from "@/components/cookie-consent";
import { OrganizationSchemaEs, WebSiteSchemaEs } from "@/components/es/schema-es";
import { siteEs } from "@/config/es/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteEs.url),
  title: {
    default: "Rekaire España – Extinción automática para cuadros eléctricos",
    template: "%s | Rekaire España",
  },
  description: siteEs.description,
  applicationName: "Rekaire",
  authors: [{ name: siteEs.name }],
  creator: siteEs.name,
  publisher: siteEs.company.legalName,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: siteEs.locale,
    alternateLocale: ["fr_FR"],
    url: siteEs.url,
    siteName: "Rekaire España",
    title: "Rekaire España – Extinción automática para cuadros eléctricos",
    description: siteEs.description,
    images: [{ url: "/images/product/rk01-main.png", alt: "RK01 – Sistema autónomo de extinción" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rekaire España",
    description: siteEs.description,
    images: ["/images/product/rk01-main.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icon-512.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export default function EsRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-ES" className={inter.variable}>
      <head>
        <link rel="preload" as="image" href="/images/product/360/frame_001.webp" fetchPriority="high" />
        {/* Google Consent Mode v2 : denegado por defecto hasta que el visitante elija */}
        <Script
          id="google-consent-init"
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
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-17976614746" strategy="afterInteractive" />
        <Script
          id="google-ads-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17976614746');
              gtag('config', 'G-G46KL6NKEE');
            `,
          }}
        />
        <OrganizationSchemaEs />
        <WebSiteSchemaEs />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        <GTMNoScript />
        {children}
        <Analytics />
        <CookieConsent locale="es" />
      </body>
    </html>
  );
}
