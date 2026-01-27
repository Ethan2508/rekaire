// ============================================
// REKAIRE - Admin Configuration
// ============================================
// Configuration centralisée pour gérer les prix, contenus, etc.
// Modifiez ce fichier et redéployez pour mettre à jour le site

export const adminConfig = {
  // =========================================
  // PRODUITS
  // =========================================
  products: {
    rk01: {
      id: "rk01",
      name: "RK01 - Système Autonome d'Extinction Incendie",
      shortDescription: "Protection automatique pour tableaux électriques",
      
      // PRIX (modifiez ici)
      pricing: {
        singleHT: 70,        // Prix unitaire HT
        bulkHT: 60,          // Prix par unité pour lot
        bulkMinQuantity: 2,  // Quantité minimum pour prix lot
        tvaRate: 20,         // Taux TVA en %
      },

      // Stripe Price IDs (créez-les dans votre dashboard Stripe)
      stripe: {
        singlePriceId: "price_XXXXX",  // ID du prix unitaire
        bulkPriceId: "price_XXXXX",    // ID du prix en lot
      },

      // Stock
      stock: {
        available: true,
        quantity: -1, // -1 = illimité
      },

      // Spécifications techniques
      specifications: [
        { label: "Température d'activation", value: "175°C ± 10°C" },
        { label: "Durée de vie", value: "5 ans" },
        { label: "Temps de décharge", value: "< 10 secondes" },
        { label: "Volume protégé", value: "0.5 m³" },
        { label: "Dimensions", value: "Ø 50mm × 105mm" },
        { label: "Poids", value: "150g" },
        { label: "Agent extincteur", value: "Aérosol non conducteur" },
        { label: "Certifications", value: "CE, ISO 9001" },
      ],

      // Points forts
      features: [
        { icon: "shield", title: "Protection 24/7", description: "Surveillance permanente sans électricité" },
        { icon: "clock", title: "Durée de vie 5 ans", description: "Sans aucune maintenance" },
        { icon: "zap", title: "Sans câblage", description: "Installation autonome" },
        { icon: "check", title: "Sans maintenance", description: "Fonctionnel immédiatement" },
      ],

      // Images (chemins relatifs depuis /public)
      images: [
        { src: "/images/product/gallery/fiche1.png", alt: "RK01 - Vue principale" },
        { src: "/images/product/gallery/fiche2.png", alt: "RK01 - Packaging" },
        { src: "/images/product/gallery/fiche3.png", alt: "RK01 - Détails techniques" },
      ],
    },
  },

  // =========================================
  // PARTENAIRES
  // =========================================
  partners: [
    { name: "Synexium", logo: "/images/partners/synexium.png", size: "large", active: true },
    { name: "Viva", logo: "/images/partners/viva.png", size: "large", active: true },
    { name: "Socoda", logo: "/images/partners/socoda.png", size: "normal", active: true },
    { name: "Brice Robert", logo: "/images/partners/bricerobert.webp", size: "normal", active: true },
  ],

  // =========================================
  // STATISTIQUES INCENDIES
  // =========================================
  fireStats: {
    domesticFires: 300000,           // Incendies domestiques/an
    electricalPercentage: "25-30%",  // % d'origine électrique
    injuries: 10000,                 // Blessés/an
    deaths: 500,                     // Décès/an
    nightPercentage: 70,             // % la nuit
    businessClosure: 75,             // % entreprises qui ferment après incendie
  },

  // =========================================
  // LIVRAISON
  // =========================================
  shipping: {
    freeThreshold: 0,      // Livraison gratuite à partir de X€ (0 = toujours gratuit)
    standardPrice: 0,      // Prix livraison standard
    expressPrice: 9.90,    // Prix livraison express
    estimatedDays: {
      standard: "3-5 jours",
      express: "24-48h",
    },
  },

  // =========================================
  // PROMOTIONS
  // =========================================
  promotions: {
    active: false,
    code: "",
    discountPercent: 0,
    discountAmount: 0,
    validUntil: null,
  },
};

// Export des prix pour rétrocompatibilité
export const PRICES = adminConfig.products.rk01.pricing;
