// ============================================
// REKAIRE ES - Documentación técnica
// Los documentos no se publican : se envían a profesionales bajo solicitud.
// ============================================

import type { Metadata } from "next";
import { FileText, Lock, FileCheck2 } from "lucide-react";
import { HeaderEs } from "@/components/es/header-es";
import { FooterEs } from "@/components/es/footer-es";
import { PageHeroEs } from "@/components/es/page-hero";
import { ConformityEs } from "@/components/es/sections";
import { ButtonLink } from "@/components/es/ui";
import { BreadcrumbSchemaEs } from "@/components/es/schema-es";
import { documents } from "@/config/es/product";
import { proFormHref } from "@/config/es/site";

export const metadata: Metadata = {
  title: "Documentación técnica del RK01",
  description:
    "Ficha técnica, ficha de datos de seguridad, documentación CE y P1 y verificación EN 15276-1:2019 del RK01, disponibles para profesionales bajo solicitud.",
  alternates: { canonical: "/documentacion" },
};

export default function DocumentacionPage() {
  return (
    <>
      <BreadcrumbSchemaEs items={[{ name: "Inicio", path: "/" }, { name: "Documentación", path: "/documentacion" }]} />
      <HeaderEs />
      <main>
        <PageHeroEs
          badge="Documentación técnica"
          icon={FileCheck2}
          title="Documentación técnica del RK01"
          intro="Ponemos a disposición de instaladores, ingenierías, fabricantes y distribuidores la documentación técnica y de conformidad del RK01. Se envía bajo solicitud, para cada proyecto."
        >
          <ButtonLink href={proFormHref("documentacion")} size="large" location="es-docs-hero">
            Solicitar documentación técnica
          </ButtonLink>
        </PageHeroEs>

        <section className="pb-20 lg:pb-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="grid sm:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <li key={doc.title} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                  <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-500" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold text-gray-900">{doc.title}</span>
                    <span className="block text-sm text-gray-600 mt-1">{doc.description}</span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                      <Lock className="w-3.5 h-3.5" /> Disponible bajo solicitud
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-gray-500 text-center">
              Solo se facilita la documentación efectivamente disponible para el producto. Indícanos en tu solicitud qué documentos necesitas.
            </p>
          </div>
        </section>

        <ConformityEs showDocsLink={false} />
      </main>
      <FooterEs />
    </>
  );
}
