// ============================================
// REKAIRE - FAQ Page
// ============================================

import { Header, Footer } from "@/components";
import { FAQHero } from "@/components/pages/faq/faq-hero";
import { FAQCategories } from "@/components/pages/faq/faq-categories";
import { FAQContact } from "@/components/pages/faq/faq-contact";
import { FAQSchema, BreadcrumbSchema } from "@/components/schema-org";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Questions fréquentes | Rekaire",
  description: "Retrouvez toutes les réponses à vos questions sur le RK01, son installation, son fonctionnement et notre service client.",
};

// FAQ principale pour le Schema
const mainFAQs = [
  { question: "Qu'est-ce que le RK01 ?", answer: "Le RK01 est un système autonome d'extinction incendie conçu spécifiquement pour les tableaux électriques. Il se déclenche automatiquement en cas de surchauffe (175°C) et éteint les départs de feu sans intervention humaine." },
  { question: "Comment installer le RK01 ?", answer: "L'installation est très simple : nettoyez la surface, retirez le film protecteur de l'adhésif fourni, positionnez le RK01 au plafond du tableau et appuyez fermement 30 secondes. Aucun outil nécessaire." },
  { question: "Quelle est la durée de vie du RK01 ?", answer: "Le RK01 a une durée de vie de 5 ans sans aucune maintenance nécessaire. Une date de péremption est indiquée sur chaque unité." },
  { question: "L'agent extincteur est-il dangereux ?", answer: "Non, l'agent extincteur est non toxique, écologique et ne laisse aucun résidu. Il est spécialement conçu pour les feux d'origine électrique." },
  { question: "Quels modes de paiement acceptez-vous ?", answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express) via notre plateforme sécurisée Stripe." },
  { question: "Quels sont les délais de livraison ?", answer: "Les commandes sont expédiées sous 24h (jours ouvrés). La livraison en France métropolitaine prend généralement 24 à 48h." },
];

export default function FAQPage() {
  const breadcrumbs = [
    { name: "Accueil", url: siteConfig.url },
    { name: "FAQ", url: `${siteConfig.url}/faq` },
  ];

  return (
    <>
      <FAQSchema faqs={mainFAQs} />
      <BreadcrumbSchema items={breadcrumbs} />
      <Header />
      <main>
        <FAQHero />
        <FAQCategories />
        <FAQContact />
      </main>
      <Footer />
    </>
  );
}
