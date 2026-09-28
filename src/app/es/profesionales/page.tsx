// ============================================
// REKAIRE ES - Área profesional
// ============================================

import type { Metadata } from "next";
import Link from "next/link";
import { HardHat, ShieldCheck, PenTool, Plug, Cpu, Truck, FileCheck2, ArrowRight } from "lucide-react";
import { HeaderEs } from "@/components/es/header-es";
import { FooterEs } from "@/components/es/footer-es";
import { PageHeroEs } from "@/components/es/page-hero";
import { ProFormEs } from "@/components/es/pro-form";
import { SizingEs } from "@/components/es/sections";
import { BreadcrumbSchemaEs } from "@/components/es/schema-es";
import { proFormHref, requestTypes, type RequestType } from "@/config/es/site";

export const metadata: Metadata = {
  title: "Profesionales: instaladores PCI, ingenierías y distribuidores",
  description:
    "Área profesional Rekaire España: dimensionamiento de la protección de cuadros eléctricos, documentación técnica, condiciones para distribuidores y fabricantes de cuadros.",
  alternates: { canonical: "/profesionales" },
};

const profiles = [
  {
    icon: ShieldCheck,
    title: "Instaladores PCI",
    text: "Una solución localizada para proteger el interior de cuadros y armarios, complementaria de las instalaciones de protección contra incendios que ya ejecutas.",
  },
  {
    icon: PenTool,
    title: "Ingenierías",
    text: "Datos técnicos, condiciones de montaje y apoyo al dimensionamiento para integrar la protección de envolventes eléctricas en tus proyectos.",
  },
  {
    icon: Plug,
    title: "Electricistas e instaladores eléctricos",
    text: "Montaje adhesivo sin cableado: puedes equipar cuadros nuevos o existentes durante tus intervenciones.",
  },
  {
    icon: Cpu,
    title: "Fabricantes de cuadros",
    text: "Integración en la línea de montaje y dimensionamiento por modelo de envolvente.",
    href: "/fabricantes-cuadros-electricos",
  },
  {
    icon: Truck,
    title: "Distribuidores",
    text: "Material eléctrico o de protección contra incendios: condiciones de distribución bajo presupuesto.",
  },
];

const ctas: { type: RequestType; text: string }[] = [
  { type: "distribuidor", text: "Condiciones para distribuidores de material eléctrico o PCI." },
  { type: "documentacion", text: "Ficha técnica, FDS y documentación de conformidad." },
  { type: "proyecto", text: "Dimensionamiento de la protección para tus cuadros." },
  { type: "contacto", text: "Cualquier otra pregunta sobre el RK01." },
];

export default function ProfesionalesPage() {
  return (
    <>
      <BreadcrumbSchemaEs items={[{ name: "Inicio", path: "/" }, { name: "Profesionales", path: "/profesionales" }]} />
      <HeaderEs />
      <main>
        <PageHeroEs
          badge="Área profesional"
          icon={HardHat}
          title="Protección localizada de cuadros eléctricos para profesionales"
          intro="Instaladores PCI, ingenierías, electricistas, fabricantes de cuadros y distribuidores: te acompañamos en el dimensionamiento, la documentación técnica y el suministro del RK01."
        />

        {/* 4 CTA */}
        <section className="pb-16 lg:pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ctas.map((c) => (
              <Link
                key={c.type}
                href={proFormHref(c.type)}
                className="group rounded-2xl border border-gray-200 bg-white p-6 hover:border-orange-300 hover:shadow-lg transition-all"
              >
                <p className="font-semibold text-gray-900 flex items-center justify-between gap-2">
                  {requestTypes[c.type]}
                  <ArrowRight className="w-4 h-4 text-orange-500 transition-transform group-hover:translate-x-1" />
                </p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{c.text}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Perfiles */}
        <section className="py-20 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-12 text-center">
              Para quién <span className="text-orange-500">trabajamos</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {profiles.map((p) => (
                <div key={p.title} className="rounded-2xl bg-white border border-gray-200 p-6">
                  <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4">
                    <p.icon className="w-6 h-6 text-white" />
                  </span>
                  <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.text}</p>
                  {p.href && (
                    <Link href={p.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700">
                      Más información <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ))}
              <div className="rounded-2xl bg-gray-900 p-6 text-white">
                <FileCheck2 className="w-8 h-8 text-orange-400 mb-4" />
                <h3 className="font-bold mb-2">Documentación técnica</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  Ficha técnica, ficha de datos de seguridad, documentación CE y P1, verificación EN 15276-1:2019.
                </p>
                <Link href="/documentacion" className="inline-flex items-center gap-1 text-sm font-semibold text-orange-300 hover:text-orange-200">
                  Ver la documentación disponible <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SizingEs />

        {/* Formulario */}
        <section id="formulario" className="py-20 lg:py-24 bg-white scroll-mt-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Cuéntanos tu <span className="text-orange-500">proyecto</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Te respondemos en 24 a 48 horas laborables con una propuesta de dimensionamiento o la documentación solicitada.
              </p>
            </div>
            <ProFormEs />
          </div>
        </section>
      </main>
      <FooterEs />
    </>
  );
}
