// ============================================
// REKAIRE ES - Normativa española de protección contra incendios
// Contenido divulgativo basado en los textos oficiales (BOE).
// ============================================

import type { Metadata } from "next";
import { Scale, ExternalLink, Info, AlertTriangle } from "lucide-react";
import { HeaderEs } from "@/components/es/header-es";
import { FooterEs } from "@/components/es/footer-es";
import { PageHeroEs, ProseSection } from "@/components/es/page-hero";
import { ButtonLink } from "@/components/es/ui";
import { BreadcrumbSchemaEs } from "@/components/es/schema-es";
import {
  boe,
  regulations,
  ripciAerosolQuote,
  standards,
  obligationFactors,
  sprinklerThresholds,
} from "@/config/es/normativa";
import { proFormHref } from "@/config/es/site";

export const metadata: Metadata = {
  title: "Normativa: RSCIEI, RIPCI y UNE-EN 15276",
  description:
    "Guía de la normativa española de protección contra incendios: RSCIEI (RD 164/2025), RIPCI, CTE DB-SI, sistemas fijos de extinción por aerosoles condensados y normas UNE-EN 15276-1 y UNE-EN 15276-2.",
  alternates: { canonical: "/normativa" },
};

const toc = [
  { id: "reglamentos", label: "Los reglamentos" },
  { id: "extincion-automatica", label: "Sistemas automáticos de extinción" },
  { id: "aerosoles", label: "Aerosoles condensados" },
  { id: "une-en-15276", label: "UNE-EN 15276-1 y 15276-2" },
  { id: "obligatoria", label: "¿Cuándo es obligatoria?" },
  { id: "rk01", label: "¿Y el RK01?" },
];

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
      {children}
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

function ThresholdTable({ caption, rows }: { caption: string; rows: readonly (readonly string[])[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200">
      <table className="w-full text-sm">
        <caption className="text-left font-semibold text-gray-900 px-4 py-3 bg-gray-50 border-b border-gray-200">{caption}</caption>
        <thead>
          <tr className="text-left text-gray-500">
            {sprinklerThresholds.columns.map((c) => (
              <th key={c} scope="col" className="px-4 py-3 font-medium">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-gray-100">
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="px-4 py-3 text-left font-semibold text-gray-900">{cell}</th>
                ) : (
                  <td key={i} className="px-4 py-3 text-gray-700 font-mono">{cell}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function NormativaPage() {
  return (
    <>
      <BreadcrumbSchemaEs items={[{ name: "Inicio", path: "/" }, { name: "Normativa", path: "/normativa" }]} />
      <HeaderEs />
      <main>
        <PageHeroEs
          badge="Guía de normativa"
          icon={Scale}
          title="Normativa española de protección contra incendios y extinción por aerosoles"
          intro="RSCIEI, RIPCI, CTE, sistemas automáticos de extinción y normas UNE-EN 15276: una presentación divulgativa, con enlaces a los textos oficiales, para situar la protección de los cuadros eléctricos en el marco normativo."
        />

        <div className="bg-white pb-20 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-4 gap-10 lg:gap-14">
            <aside className="lg:col-span-1">
              <nav aria-label="Índice" className="lg:sticky lg:top-28 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Índice</p>
                <ol className="space-y-2 text-sm">
                  {toc.map((t, i) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-gray-700 hover:text-orange-600">
                        {i + 1}. {t.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <div className="lg:col-span-3 space-y-16">
              <ProseSection id="reglamentos" title="Los reglamentos de referencia">
                <div className="grid gap-4">
                  {regulations.map((r) => (
                    <article key={r.id} className="rounded-2xl border border-gray-200 p-6">
                      <p className="font-mono text-sm font-semibold text-orange-600">{r.acronym}</p>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">{r.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{r.reference}</p>
                      <p className="mt-3 text-gray-700">{r.summary}</p>
                      {"note" in r && r.note && <p className="mt-2 text-sm text-gray-600">{r.note}</p>}
                      <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                        <Source href={r.url}>Texto oficial</Source>
                        {"extraLink" in r && r.extraLink && <Source href={r.extraLink.url}>{r.extraLink.label}</Source>}
                      </p>
                    </article>
                  ))}
                </div>
              </ProseSection>

              <ProseSection id="extincion-automatica" title="Sistemas automáticos de extinción">
                <p>
                  El anexo III del RSCIEI (RD 164/2025) enumera los sistemas fijos de extinción automática: por rociadores automáticos y agua
                  pulverizada, por agua nebulizada, por espuma física, por polvo, por agentes extintores gaseosos y{" "}
                  <strong>por aerosoles condensados</strong>, así como otros sistemas fijos que puedan aparecer en el futuro y cumplan lo
                  establecido en el RIPCI.
                </p>
                <p>
                  La normativa española de protección contra incendios contempla, por tanto, los sistemas fijos de extinción por aerosoles
                  condensados entre las tecnologías de extinción automática. El RIPCI, por su parte, fija los requisitos de diseño,
                  instalación, mantenimiento e inspección de estos sistemas.
                </p>
                <p className="text-sm">
                  Fuente: <Source href={boe.rsciei2025}>RD 164/2025, anexo III</Source>
                </p>
              </ProseSection>

              <ProseSection id="aerosoles" title="Sistemas fijos de extinción por aerosoles condensados">
                <p>
                  El RIPCI (anexo I, sección 1.ª, epígrafe 12) describe estos sistemas como conjuntos compuestos por dispositivos de
                  accionamiento, equipos de control de funcionamiento y unidades de generadores de aerosol, y establece:
                </p>
                <blockquote className="border-l-4 border-orange-500 bg-orange-50/60 rounded-r-xl px-5 py-4 italic text-gray-800">
                  «{ripciAerosolQuote}»
                </blockquote>
                <p>
                  El artículo 5.2 del RIPCI precisa que esa marca de conformidad a norma debe ser concedida por un organismo de certificación
                  acreditado por la Entidad Nacional de Acreditación (ENAC). El anexo II del mismo reglamento incluye estos sistemas en el
                  programa de mantenimiento, con operaciones como la prueba de estanqueidad de la sala protegida según UNE-EN 15276-2.
                </p>
                <p className="text-sm">
                  Fuente: <Source href={boe.ripci}>RD 513/2017 (RIPCI), anexos I y II y artículo 5</Source>
                </p>
              </ProseSection>

              <ProseSection id="une-en-15276" title="UNE-EN 15276-1 y UNE-EN 15276-2: dos normas distintas">
                <div className="grid md:grid-cols-2 gap-4">
                  {standards.map((s) => (
                    <article key={s.code} className="rounded-2xl border border-gray-200 p-6">
                      <p className="font-mono text-sm font-semibold text-orange-600">{s.code}</p>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">{s.scope}</h3>
                      <p className="mt-3 text-sm text-gray-500 italic">{s.title}</p>
                      <p className="mt-3 text-gray-700">{s.detail}</p>
                    </article>
                  ))}
                </div>
                <p>
                  El diseño y dimensionamiento de una instalación con sistemas de aerosol debe realizarse de acuerdo con las exigencias
                  aplicables al proyecto.
                </p>
              </ProseSection>

              <ProseSection id="obligatoria" title="¿Cuándo es obligatoria la extinción automática?">
                <div className="rounded-3xl bg-gray-900 text-white p-6 lg:p-8">
                  <p className="text-gray-300">
                    El RSCIEI establece la instalación de sistemas automáticos de extinción en determinados establecimientos industriales en
                    función de factores como el nivel de riesgo, la configuración del establecimiento, su actividad y su superficie. No
                    existe un umbral único: depende, en particular, de:
                  </p>
                  <ul className="mt-5 grid sm:grid-cols-2 gap-3 !list-none !pl-0">
                    {obligationFactors.map((f) => (
                      <li key={f.title} className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <span className="block font-semibold text-white">{f.title}</span>
                        <span className="block text-sm text-gray-400 mt-1">{f.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <h3 className="text-xl font-bold text-gray-900 pt-4">
                  Ejemplo: sistemas fijos de extinción automática en el RSCIEI
                </h3>
                <p>{sprinklerThresholds.intro}</p>
                <div className="grid gap-4">
                  <ThresholdTable
                    caption="1.º Actividades de fabricación, producción, transformación, reparación u otras distintas al almacenamiento"
                    rows={sprinklerThresholds.fabrication}
                  />
                  <ThresholdTable caption="2.º Actividades de almacenamiento" rows={sprinklerThresholds.storage} />
                </div>
                <ul className="text-sm text-gray-600">
                  {sprinklerThresholds.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
                <p className="text-sm">
                  Fuente: <Source href={boe.rsciei2025}>{sprinklerThresholds.source}</Source>. Para los usos no industriales, consulta el{" "}
                  <Source href={boe.cteDbSi}>CTE DB-SI</Source>.
                </p>
              </ProseSection>

              <ProseSection id="rk01" title="¿Y el RK01?">
                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 space-y-3">
                  <p className="flex gap-3">
                    <Info className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                    <span>
                      El RK01 es un dispositivo autónomo de protección localizada del interior de envolventes eléctricas. Su dispositivo de
                      referencia (K180-5) dispone de una <strong>verificación EN 15276-1:2019</strong> de carácter voluntario y está
                      clasificado como artículo pirotécnico de categoría P1 conforme a la Directiva 2013/29/UE.
                    </span>
                  </p>
                  <p className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                    <span>
                      El RK01 no se presenta como componente de un sistema fijo de extinción conforme al RIPCI ni sustituye a las
                      instalaciones de protección contra incendios exigidas por el RSCIEI o el CTE. Su adecuación a cada instalación debe
                      estudiarse caso por caso, como protección complementaria en el origen del riesgo.
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <ButtonLink href={proFormHref("proyecto")} location="es-normativa-project">Analizar mi instalación</ButtonLink>
                  <ButtonLink href="/documentacion" variant="secondary" location="es-normativa-docs">Documentación técnica</ButtonLink>
                </div>
              </ProseSection>

              <p className="text-xs text-gray-500 border-t border-gray-200 pt-6">
                Contenido divulgativo elaborado a partir de los textos consolidados publicados en el BOE (consulta de septiembre de 2026).
                No sustituye a la lectura de los textos oficiales ni al análisis de un técnico competente para cada proyecto.
              </p>
            </div>
          </div>
        </div>
      </main>
      <FooterEs />
    </>
  );
}
