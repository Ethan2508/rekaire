// ============================================
// REKAIRE - Site Configuration
// ============================================
// Centralise toute la config du site
// Scalable pour multi-langue, multi-pays, multi-devise

export const siteConfig = {
  name: "Rekaire",
  description: "Sécurité incendie autonome pour tableaux électriques",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://rekaire.fr",
  
  // Contact
  contact: {
    email: "contact@rekaire.fr",
    phone: "+33 (0) 4 82 53 06 19",
  },

  // Company Info (pour mentions légales)
  company: {
    name: "Rekaire",
    legalName: "Rekaire SAS", // À compléter
    address: "123 Rue Exemple, 75001 Paris", // À compléter
    siret: "XXX XXX XXX XXXXX", // À compléter
    tva: "FR XX XXX XXX XXX", // À compléter
    capital: "10 000 €", // À compléter
    rcs: "Paris B XXX XXX XXX", // À compléter
  },

  // Hosting
  hosting: {
    provider: "Vercel",
    address: "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA",
  },

  // Social (futurs)
  social: {
    linkedin: "https://linkedin.com/company/rekaire",
    twitter: "https://twitter.com/rekaire",
  },

  // Locale config (prêt pour multi-langue)
  locales: {
    default: "fr",
    supported: ["fr"] as const,
  },

  // Currency config (prêt pour multi-devise)
  currency: {
    default: "EUR",
    supported: ["EUR"] as const,
    symbols: {
      EUR: "€",
    },
  },

  // Countries (prêt pour multi-pays)
  countries: {
    default: "FR",
    supported: ["FR"] as const,
  },
} as const;

export type Locale = (typeof siteConfig.locales.supported)[number];
export type Currency = (typeof siteConfig.currency.supported)[number];
export type Country = (typeof siteConfig.countries.supported)[number];
