// ============================================
// REKAIRE - Product Configuration
// ============================================
// Architecture prête pour multi-produits et variantes

export interface ProductVariant {
  id: string;
  name: string;
  priceCents: number;
  stock?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  shortDescription: string;
  features: string[];
  specifications: Record<string, string>;
  priceCents: number; // Prix unitaire pour 1 produit
  priceCents2Plus: number; // Prix unitaire pour 2+ produits
  currency: string;
  images: string[];
  variants?: ProductVariant[];
  inStock: boolean;
  badge?: string;
}

// Prix en centimes HT
// 1 produit = 70€ HT = 7000 centimes
// 2+ produits = 60€ HT/unité = 6000 centimes
const PRICE_SINGLE_HT = 7000; // 70€ HT
const PRICE_BULK_HT = 6000; // 60€ HT pour 2+
const TVA_RATE = 0.20;

// Calcul TTC
const priceToTTC = (priceHT: number) => Math.round(priceHT * (1 + TVA_RATE));

export const products: Product[] = [
  {
    id: "rk01",
    slug: "rk01",
    name: "RK01 – Système autonome d'extinction incendie",
    shortName: "RK01",
    description: `Dispositif autonome d'extinction incendie par aérosol, conçu pour protéger les tableaux et armoires électriques. 
    
Sans câblage, sans alimentation, sans maintenance. Activation automatique à haute température.

Le RK01 offre une protection ciblée et fiable pour vos installations électriques critiques.`,
    shortDescription:
      "Dispositif autonome d'extinction incendie par aérosol pour tableaux électriques. Sans câblage, sans maintenance.",
    features: [
      "Activation automatique à haute température",
      "Aucune alimentation, aucun câblage",
      "Installation en quelques secondes",
      "Sans entretien pendant toute sa durée de vie",
      "Protection ciblée des espaces électriques",
      "Aérosol non conducteur",
    ],
    specifications: {
      "Type d'agent": "Aérosol extincteur",
      "Température d'activation": "170°C ± 10°C",
      "Volume protégé": "0,1 m³",
      "Dimensions": "12,1 cm × 1,8 cm × 1,0 cm",
      "Poids": "22 g",
      "Durée de vie": "5 ans",
      "Certification": "CE / EN",
    },
    priceCents: priceToTTC(PRICE_SINGLE_HT), // 84€ TTC
    priceCents2Plus: priceToTTC(PRICE_BULK_HT), // 72€ TTC
    currency: "EUR",
    images: [
      "/images/product/rk01-main.png",
      "/images/product/rk01-part1.png",
      "/images/product/rk01-part2.png",
      "/images/product/rk01-part3.png",
      "/images/product/rk01-part4.png",
    ],
    inStock: true,
    badge: "Bestseller",
  },
];

// Helper pour récupérer le produit principal
export const getMainProduct = (): Product => products[0];

// Helper pour formater le prix
export const formatPrice = (
  cents: number,
  currency: string = "EUR",
  locale: string = "fr-FR"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
};

// Helper pour calculer le prix HT depuis TTC (TVA 20%)
export const getPriceHT = (priceTTCCents: number, tvaRate: number = 0.2): number => {
  return Math.round(priceTTCCents / (1 + tvaRate));
};

// Helper pour calculer la TVA
export const getTVA = (priceTTCCents: number, tvaRate: number = 0.2): number => {
  const priceHT = getPriceHT(priceTTCCents, tvaRate);
  return priceTTCCents - priceHT;
};

// Helper pour calculer le prix total selon quantité
export const calculateTotal = (quantity: number): { totalHT: number; totalTTC: number; unitPriceHT: number } => {
  const unitPriceHT = quantity >= 2 ? PRICE_BULK_HT : PRICE_SINGLE_HT;
  const totalHT = unitPriceHT * quantity;
  const totalTTC = priceToTTC(totalHT);
  return { totalHT, totalTTC, unitPriceHT };
};

// Export des constantes de prix
export const PRICES = {
  singleHT: PRICE_SINGLE_HT,
  bulkHT: PRICE_BULK_HT,
  tvaRate: TVA_RATE,
};
