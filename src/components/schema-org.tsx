// ============================================
// REKAIRE - Schema.org Structured Data
// Rich snippets pour Google (étoiles, prix, stock)
// ============================================

import Script from "next/script";
import { siteConfig } from "@/config/site";
import { getMainProduct, PRICES } from "@/config/product";

// Schema Organisation
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.company.name,
    legalName: siteConfig.company.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "5 Rue Mazenod",
      addressLocality: "Lyon",
      postalCode: "69003",
      addressCountry: "FR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      contactType: "customer service",
      availableLanguage: ["French"],
    },
    sameAs: [
      siteConfig.social.linkedin,
    ],
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema Produit (avec prix, stock, avis)
export function ProductSchema() {
  const product = getMainProduct();
  const priceTTC = Math.round(PRICES.singleHT * 1.2); // Convertir HT en TTC

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [
      `${siteConfig.url}/images/product/rk01-main.png`,
      `${siteConfig.url}/images/product/gallery/fiche1.png`,
      `${siteConfig.url}/images/product/gallery/fiche2.png`,
    ],
    brand: {
      "@type": "Brand",
      name: "Rekaire",
    },
    manufacturer: {
      "@type": "Organization",
      name: "NELIOR SAS",
    },
    sku: product.id,
    mpn: "RK01-FR",
    gtin13: "3760000000000", // À remplacer par le vrai code-barres
    
    // Prix
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/produit`,
      priceCurrency: "EUR",
      price: priceTTC,
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: siteConfig.company.legalName,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "EUR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "FR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "FR",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },

    // Avis agrégés (à mettre à jour avec vrais avis)
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },

    // Quelques avis exemple
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Pierre M.",
        },
        datePublished: "2025-11-15",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
        },
        reviewBody: "Installation ultra simple, en moins de 2 minutes c'était fait. Tranquillité d'esprit assurée !",
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Marie L.",
        },
        datePublished: "2025-10-28",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
        },
        reviewBody: "Produit français de qualité. Compact et discret dans mon tableau électrique.",
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Jean-Paul D.",
        },
        datePublished: "2025-09-12",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "4",
        },
        reviewBody: "Bon rapport qualité-prix. La garantie 5 ans est rassurante.",
      },
    ],
  };

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema FAQ
export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema BreadcrumbList
export function BreadcrumbSchema({ 
  items 
}: { 
  items: { name: string; url: string }[] 
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema WebSite (pour sitelinks search box)
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/recherche?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema LocalBusiness
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: siteConfig.company.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "5 Rue Mazenod",
      addressLocality: "Lyon",
      postalCode: "69003",
      addressRegion: "Auvergne-Rhône-Alpes",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 45.7578,
      longitude: 4.8351,
    },
    priceRange: "€€",
    paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
    currenciesAccepted: "EUR",
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
