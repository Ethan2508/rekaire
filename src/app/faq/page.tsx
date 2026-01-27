// ============================================
// REKAIRE - FAQ Page
// ============================================

import { Header, Footer } from "@/components";
import { FAQHero } from "@/components/pages/faq/faq-hero";
import { FAQCategories } from "@/components/pages/faq/faq-categories";
import { FAQContact } from "@/components/pages/faq/faq-contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Questions fréquentes | Rekaire",
  description: "Retrouvez toutes les réponses à vos questions sur le RK01, son installation, son fonctionnement et notre service client.",
};

export default function FAQPage() {
  return (
    <>
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
