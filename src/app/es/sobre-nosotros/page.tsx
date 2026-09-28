// ============================================
// REKAIRE ES - Sobre nosotros
// ============================================

import type { Metadata } from "next";
import { Building2, Target, FileCheck2, Handshake } from "lucide-react";
import { HeaderEs } from "@/components/es/header-es";
import { FooterEs } from "@/components/es/footer-es";
import { PageHeroEs } from "@/components/es/page-hero";
import { FinalCtaEs } from "@/components/es/sections";
import { hreflangAlternates } from "@/config/sites";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "Rekaire desarrolla soluciones autónomas de protección contra incendios para instalaciones eléctricas. Protección localizada, directamente en el origen del riesgo.",
  alternates: hreflangAlternates("es", "/sobre-nosotros"),
};

const values = [
  {
    icon: Target,
    title: "Proteger en el origen",
    text: "Creemos que la protección más eficaz actúa donde nace el riesgo: dentro del cuadro eléctrico, en la fase inicial del incendio.",
  },
  {
    icon: FileCheck2,
    title: "Información verificable",
    text: "Comunicamos únicamente datos técnicos y documentos de los que disponemos, con una redacción precisa sobre su alcance.",
  },
  {
    icon: Handshake,
    title: "Trabajo con profesionales",
    text: "Acompañamos a instaladores, ingenierías, fabricantes de cuadros y distribuidores en el dimensionamiento y la documentación.",
  },
];

export default function SobreNosotrosPage() {
  return (
    <>
      <HeaderEs />
      <main>
        <PageHeroEs
          badge="Sobre nosotros"
          icon={Building2}
          title="Protección contra incendios localizada para instalaciones eléctricas"
          intro="Rekaire es una marca de NELIOR SAS, empresa francesa con sede en Lyon, dedicada a las soluciones autónomas de extinción para cuadros y armarios eléctricos. Tras su lanzamiento en Francia, el RK01 llega al mercado español."
        />
        <section className="pb-20 lg:pb-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-5">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6">
                <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4">
                  <v.icon className="w-6 h-6 text-white" />
                </span>
                <h2 className="font-bold text-gray-900 mb-2">{v.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </section>
        <FinalCtaEs />
      </main>
      <FooterEs />
    </>
  );
}
