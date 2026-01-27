// ============================================
// REKAIRE - Product Page (RK01)
// ============================================

import { Header, Footer } from "@/components";
import { ProductHero } from "@/components/pages/product/product-hero";
import { ProductDetails } from "@/components/pages/product/product-details";
import { ProductSpecs } from "@/components/pages/product/product-specs";
import { ProductFAQ } from "@/components/pages/product/product-faq";
import { CTASection } from "@/components/sections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RK01 - Système Autonome d'Extinction Incendie | Rekaire",
  description: "Découvrez le RK01, notre système autonome d'extinction incendie pour tableaux électriques. Protection automatique 24/7, sans maintenance, durée de vie 5 ans.",
};

export default function ProductPage() {
  return (
    <>
      <Header />
      <main>
        <ProductHero />
        <ProductDetails />
        <ProductSpecs />
        <ProductFAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
