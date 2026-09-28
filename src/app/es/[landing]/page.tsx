// ============================================
// REKAIRE ES - Páginas por aplicación y sector
// Contenido en src/config/es/landings.ts
// ============================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Layers } from "lucide-react";
import { HeaderEs } from "@/components/es/header-es";
import { FooterEs } from "@/components/es/footer-es";
import { PageHeroEs, ProseSection } from "@/components/es/page-hero";
import { ActivationSequence, PanelSchematic } from "@/components/es/diagrams";
import { FaqAccordionEs, FinalCtaEs } from "@/components/es/sections";
import { ButtonLink } from "@/components/es/ui";
import { BreadcrumbSchemaEs, FaqSchemaEs } from "@/components/es/schema-es";
import { getLanding, publishedLandings } from "@/config/es/landings";
import { proFormHref } from "@/config/es/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedLandings.map((l) => ({ landing: l.slug }));
}

type Props = { params: Promise<{ landing: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const landing = getLanding((await params).landing);
  if (!landing) return {};
  return {
    title: landing.metaTitle,
    description: landing.metaDescription,
    alternates: { canonical: `/${landing.slug}` },
  };
}

export default async function LandingPage({ params }: Props) {
  const landing = getLanding((await params).landing);
  if (!landing) notFound();

  const related = publishedLandings.filter((l) => l.slug !== landing.slug);

  return (
    <>
      <BreadcrumbSchemaEs items={[{ name: "Inicio", path: "/" }, { name: landing.navLabel, path: `/${landing.slug}` }]} />
      {landing.faq.length > 0 && <FaqSchemaEs items={landing.faq} />}
      <HeaderEs />
      <main>
        <PageHeroEs badge={landing.badge} icon={Layers} title={landing.h1} intro={landing.intro}>
          <ButtonLink href={proFormHref(landing.cta.type)} size="large" location={`es-landing-${landing.slug}`}>
            {landing.cta.type === "documentacion" ? "Solicitar documentación técnica" : "Estudiar un proyecto"}
          </ButtonLink>
          <ButtonLink href="/rk01" size="large" variant="secondary" location={`es-landing-${landing.slug}-product`}>
            Ver el RK01
          </ButtonLink>
        </PageHeroEs>

        <div className="bg-white pb-20 lg:pb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            {landing.sections.map((section, i) => (
              <div key={section.title} className="space-y-14">
                <ProseSection title={section.title}>
                  {section.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                  {section.bullets && (
                    <ul className="!list-none !pl-0 space-y-3">
                      {section.bullets.map((b) => (
                        <li key={b} className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </ProseSection>
                {/* Esquema tras la primera sección */}
                {i === 0 && landing.diagram === "multi" && (
                  <figure className="rounded-3xl border border-gray-200 bg-gray-50 p-6 lg:p-8">
                    <PanelSchematic variant="multi" className="w-full max-w-[300px] mx-auto h-auto" />
                    <figcaption className="mt-4 text-sm text-gray-500 text-center">
                      Esquema ilustrativo de protección multipunto. El número y la ubicación de los dispositivos se determinan según cada instalación.
                    </figcaption>
                  </figure>
                )}
              </div>
            ))}
          </div>
        </div>

        {landing.diagram === "activation" && (
          <section className="py-20 lg:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-12 text-center">
                De la detección a la extinción <span className="text-orange-500">en segundos</span>
              </h2>
              <ActivationSequence />
            </div>
          </section>
        )}

        {landing.faq.length > 0 && (
          <section className="py-20 lg:py-24 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-8 text-center">Preguntas frecuentes</h2>
              <FaqAccordionEs items={landing.faq} />
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="pb-20 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-sm font-semibold text-gray-500 mb-4">También te puede interesar</p>
              <div className="flex flex-wrap gap-3">
                {related.map((l) => (
                  <ButtonLink key={l.slug} href={`/${l.slug}`} variant="secondary">
                    {l.navLabel}
                  </ButtonLink>
                ))}
                <ButtonLink href="/normativa" variant="secondary">Normativa</ButtonLink>
              </div>
            </div>
          </section>
        )}

        <FinalCtaEs title={landing.cta.title} text={landing.cta.text} />
      </main>
      <FooterEs />
    </>
  );
}
