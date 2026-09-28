// ============================================
// REKAIRE ES - Preguntas frecuentes
// ============================================

import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { HeaderEs } from "@/components/es/header-es";
import { FooterEs } from "@/components/es/footer-es";
import { PageHeroEs } from "@/components/es/page-hero";
import { FaqAccordionEs, FinalCtaEs } from "@/components/es/sections";
import { FaqSchemaEs } from "@/components/es/schema-es";
import { faqEs, faqEsFlat } from "@/config/es/faq";
import { hreflangAlternates } from "@/config/sites";

export const metadata: Metadata = {
  title: "Preguntas frecuentes sobre el RK01",
  description:
    "Activación, volumen protegido, instalación, vida útil, normativa y documentación del RK01, sistema autónomo de extinción para cuadros eléctricos.",
  alternates: hreflangAlternates("es", "/preguntas-frecuentes"),
};

export default function PreguntasFrecuentesPage() {
  return (
    <>
      <FaqSchemaEs items={faqEsFlat} />
      <HeaderEs />
      <main>
        <PageHeroEs
          badge="Preguntas frecuentes"
          icon={HelpCircle}
          title="Preguntas frecuentes"
          intro="Funcionamiento, instalación, dimensionamiento, normativa y compra del RK01."
        />
        <section className="pb-20 lg:pb-28 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {faqEs.map((cat) => (
              <div key={cat.category}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{cat.category}</h2>
                <FaqAccordionEs items={cat.items} />
              </div>
            ))}
          </div>
        </section>
        <FinalCtaEs title="¿No encuentras tu respuesta?" text="Escríbenos: nuestro equipo técnico te responde en 24 a 48 horas laborables." />
      </main>
      <FooterEs />
    </>
  );
}
