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
    legalName: "NELIOR SAS",
    address: "5 Rue Mazenod, 69003 Lyon",
    siret: "989 603 907 00019",
    siren: "989 603 907",
    tva: "FR51989603907",
    capital: "1 260,00 €",
    rcs: "Lyon B 989 603 907",
    directors: "Noam Kalfa, Ethan Harfi",
    creationDate: "23/07/2025",
    activity: "Commerce de gros de fournitures et équipements divers pour le commerce et les services",
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
