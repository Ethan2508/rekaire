// ============================================
// REKAIRE ES - Página de producto RK01
// ============================================

import type { Metadata } from "next";
import { HeaderEs } from "@/components/es/header-es";
import { FooterEs } from "@/components/es/footer-es";
import {
  HeroEs,
  HowItWorksEs,
  WhereEs,
  SizingEs,
  AutonomyEs,
  SpecsEs,
  ConformityEs,
  FaqAccordionEs,
  FinalCtaEs,
} from "@/components/es/sections";
import { ProductSchemaEs, BreadcrumbSchemaEs, FaqSchemaEs } from "@/components/es/schema-es";
import { proFormHref } from "@/config/es/site";
import { hreflangAlternates } from "@/config/sites";
import { faqEs } from "@/config/es/faq";

export const metadata: Metadata = {
  title: "RK01 – Extintor automático para cuadros eléctricos",
  description:
    "RK01: activación automática a 170 °C ± 10 °C, descarga ≤ 5 s, 0,1 m³ por unidad, 22 g, vida útil de 5 años. Sin alimentación, sin batería, sin cableado y sin presurizar. Instalación adhesiva.",
  alternates: hreflangAlternates("es", "/rk01"),
};

const productFaq = [...faqEs[0].items, ...faqEs[1].items];

export default function Rk01Page() {
  return (
    <>
      <ProductSchemaEs />
      <BreadcrumbSchemaEs items={[{ name: "Inicio", path: "/" }, { name: "RK01", path: "/rk01" }]} />
      <FaqSchemaEs items={productFaq} />
      <HeaderEs />
      <main>
        <HeroEs
          badge="RK01 · Sistema autónomo de extinción"
          title="Extinción automática"
          accent="directamente dentro del cuadro eléctrico."
          text="Un dispositivo de 22 g que se fija con adhesivo en el interior de la envolvente, vigila de forma pasiva la temperatura y se activa por sí solo a 170 °C para suprimir el incendio antes de que se propague."
          primary={{ href: proFormHref("proyecto"), label: "Solicitar presupuesto" }}
          secondary={{ href: "#especificaciones", label: "Ficha técnica" }}
        />
        <HowItWorksEs />
        <WhereEs />
        <SizingEs title="Una unidad o varias" />
        <AutonomyEs />
        <SpecsEs />
        <ConformityEs />
        <section className="py-20 lg:py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-10 text-center">
              Preguntas <span className="text-orange-500">frecuentes</span>
            </h2>
            <FaqAccordionEs items={productFaq} />
          </div>
        </section>
        <FinalCtaEs title="¿Quieres equipar tus cuadros?" />
      </main>
      <FooterEs />
    </>
  );
}
