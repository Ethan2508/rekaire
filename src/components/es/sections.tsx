"use client";

// ============================================
// REKAIRE ES - Secciones (inicio, RK01, profesionales)
// ============================================

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Zap,
  BatteryCharging,
  Cable,
  Gauge,
  Hand,
  Wrench,
  Box,
  ShieldCheck,
  Building2,
  Factory,
  Warehouse,
  Server,
  HardHat,
  Cpu,
  PenTool,
  Plug,
  ChevronDown,
  FileCheck2,
  Scale,
  CheckCircle2,
  Layers,
  ArrowRight,
  Search,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { Product360Viewer } from "@/components/product-360-viewer";
import { cn } from "@/lib/utils";
import { proFormHref } from "@/config/es/site";
import { specsEs, autonomyPoints, conformity, installationNote } from "@/config/es/product";
import { obligationFactors } from "@/config/es/normativa";
import { ActivationSequence, PanelSchematic, EnclosureIllustration, type EnclosureKind } from "./diagrams";
import { Reveal, Badge, SectionHeader, ButtonLink } from "./ui";

// --------------------------------------------
// Hero con el visor 360° (elemento LCP : sin animación de entrada)
// --------------------------------------------

export function HeroEs({
  badge,
  title,
  accent,
  text,
  primary,
  secondary,
}: {
  badge: string;
  title: string;
  accent: string;
  text: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
}) {
  const stats = [
    { value: "170 °C", label: "Activación automática" },
    { value: "≤ 5 s", label: "Tiempo de descarga" },
    { value: "0,1 m³", label: "Por unidad" },
    { value: "5 años", label: "Vida útil" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-orange-50/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 pt-28 lg:pt-36 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="mb-8">
              <Badge icon={Flame}>{badge}</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.12] tracking-tight mb-6">
              {title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">{accent}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">{text}</p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
              <ButtonLink href={primary.href} size="large" location="es-hero-primary">{primary.label}</ButtonLink>
              <ButtonLink href={secondary.href} size="large" variant="secondary" location="es-hero-secondary">{secondary.label}</ButtonLink>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center lg:justify-start text-sm text-gray-600">
              {["Sin electricidad", "Sin batería", "Sin cableado", "Sin intervención humana"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200/40 to-orange-100/20 rounded-full blur-[80px] scale-75" />
            <div className="relative px-4 sm:px-8">
              <div className="relative max-w-[450px] mx-auto">
                <Product360Viewer className="w-full" altPrefix="Vista 360° del RK01 - Imagen" dragHint="Desliza para girar" loadingLabel="Cargando 360°…" viewLabel="Vista 360°" />
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-4 pt-4">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------
// El incendio eléctrico empieza pequeño
// --------------------------------------------

export function ProblemEs() {
  const phases = [
    { icon: Plug, title: "Defecto", text: "Conexión floja, sobrecarga, aislamiento envejecido o arco eléctrico." },
    { icon: Flame, title: "Calentamiento", text: "El calor se acumula dentro de la envolvente cerrada, sin nadie delante." },
    { icon: Zap, title: "Inicio de incendio", text: "Los materiales del interior del cuadro se inflaman." },
    { icon: Layers, title: "Propagación", text: "El fuego alcanza cableados, bandejas y equipos cercanos." },
  ];

  return (
    <section className="relative py-20 lg:py-24 bg-gray-900 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tone="dark"
          badge="El origen del riesgo"
          badgeIcon={Zap}
          title="El incendio eléctrico empieza pequeño."
          accent="Deténlo antes de que se propague."
          subtitle="Dentro de un cuadro, un defecto puede calentar durante horas antes de convertirse en incendio. Actuar en el interior de la envolvente permite intervenir en la fase inicial."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {phases.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div
                className={cn(
                  "relative h-full rounded-2xl p-6 border",
                  i === 1 || i === 2 ? "bg-orange-500/10 border-orange-500/40" : "bg-white/5 border-white/10"
                )}
              >
                <span className="text-xs font-mono text-gray-500">0{i + 1}</span>
                <p.icon className={cn("w-7 h-7 my-4", i === 1 || i === 2 ? "text-orange-400" : "text-gray-400")} />
                <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.text}</p>
                {i === 1 && (
                  <span className="absolute top-4 right-4 text-[11px] font-semibold text-orange-300 bg-orange-500/20 px-2 py-1 rounded-full">
                    Actúa el RK01
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------
// Autonomía 24/7
// --------------------------------------------

const autonomyIcons: LucideIcon[] = [Zap, BatteryCharging, Cable, Gauge, Hand, Wrench];

export function AutonomyEs() {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Autonomía total"
          badgeIcon={ShieldCheck}
          title="Protección autónoma 24/7."
          accent="Sin electricidad. Sin batería. Sin intervención humana."
          subtitle="El RK01 no depende de ninguna fuente de energía ni de un sistema de control: su activación es puramente térmica."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {autonomyPoints.map((point, i) => {
            const Icon = autonomyIcons[i];
            return (
              <Reveal key={point} delay={i * 0.06}>
                <div className="flex items-start gap-4 p-6 h-full rounded-2xl border border-gray-200 bg-gray-50/50 hover:border-orange-300 hover:shadow-lg transition-all">
                  <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Icon className="w-6 h-6 text-white" />
                  </span>
                  <p className="font-semibold text-gray-900 pt-3">{point}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------
// Funcionamiento : secuencia de activación
// --------------------------------------------

export function HowItWorksEs() {
  return (
    <section id="funcionamiento" className="py-20 lg:py-24 bg-gray-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Funcionamiento"
          badgeIcon={Timer}
          title="De la detección a la extinción"
          accent="en segundos."
          subtitle="Extinción automática directamente dentro del cuadro eléctrico, en cinco etapas."
        />
        <Reveal>
          <ActivationSequence />
        </Reveal>
      </div>
    </section>
  );
}

// --------------------------------------------
// ¿Dónde se instala?
// --------------------------------------------

const enclosures: { kind: EnclosureKind; title: string; text: string }[] = [
  { kind: "cuadro", title: "Cuadros eléctricos", text: "Cuadros generales y secundarios de baja tensión." },
  { kind: "armario", title: "Armarios industriales", text: "Armarios de automatización, variadores y control de máquinas." },
  { kind: "contador", title: "Cajas de contadores", text: "Centralizaciones y cajas de medida." },
  { kind: "control", title: "Paneles de control", text: "Cuadros de mando, PLC y paneles de operador." },
  { kind: "distribucion", title: "Armarios de distribución", text: "Distribución de potencia en naves, salas técnicas y CPD." },
];

export function WhereEs() {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Aplicaciones"
          badgeIcon={Box}
          title="¿Dónde se"
          accent="instala?"
          subtitle="En espacios pequeños y cerrados con equipamiento eléctrico, fijado en la parte superior interior de la envolvente."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {enclosures.map((e, i) => (
            <Reveal key={e.kind} delay={i * 0.06} className={i === 4 ? "col-span-2 md:col-span-1" : undefined}>
              <div className="h-full rounded-2xl border border-gray-200 bg-white p-5 text-center hover:border-orange-300 hover:shadow-lg transition-all">
                <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <EnclosureIllustration kind={e.kind} className="w-full h-full" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{e.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{e.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------
// Dimensionamiento : una unidad o varias
// --------------------------------------------

export function SizingEs({ title = "Protección adaptada al volumen del cuadro" }: { title?: string }) {
  return (
    <section id="dimensionamiento" className="py-20 lg:py-24 bg-gray-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Dimensionamiento"
          badgeIcon={Layers}
          title={title}
          subtitle={
            <>
              Cada RK01 protege hasta 0,1 m³. En armarios de mayor volumen o con una configuración compleja pueden instalarse
              varias unidades, distribuidas estratégicamente para adaptar la protección al espacio.
            </>
          }
        />
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <Reveal>
            <figure className="h-full rounded-3xl border border-gray-200 bg-white p-6 lg:p-8 shadow-sm flex flex-col">
              <PanelSchematic variant="single" className="w-full max-w-[320px] mx-auto h-auto" />
              <figcaption className="mt-6">
                <p className="font-semibold text-gray-900">Cuadro pequeño</p>
                <p className="text-sm text-gray-600 mt-1">Una sola unidad, cuando el dimensionamiento lo permite.</p>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.15}>
            <figure className="h-full rounded-3xl border border-gray-200 bg-white p-6 lg:p-8 shadow-sm flex flex-col">
              <PanelSchematic variant="multi" className="w-full max-w-[300px] mx-auto h-auto" />
              <figcaption className="mt-6">
                <p className="font-semibold text-gray-900">Armario de gran volumen</p>
                <p className="text-sm text-gray-600 mt-1">Varias unidades repartidas por zonas: protección multipunto.</p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-5 lg:p-6 flex gap-4">
            <Search className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700 leading-relaxed">
              <p className="font-semibold text-gray-900 mb-1">
                El número y la ubicación de los dispositivos deben determinarse según las características de la instalación.
              </p>
              <p>
                Esquemas ilustrativos, no constituyen un dimensionamiento. {installationNote}
              </p>
            </div>
          </div>
        </Reveal>
        <div className="mt-8 text-center">
          <ButtonLink href={proFormHref("proyecto")} location="es-sizing">Dimensionar mi instalación</ButtonLink>
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------
// Público profesional
// --------------------------------------------

const audiences: { icon: LucideIcon; title: string; href?: string }[] = [
  { icon: ShieldCheck, title: "Instaladores PCI" },
  { icon: PenTool, title: "Ingenierías" },
  { icon: Plug, title: "Instaladores eléctricos" },
  { icon: Cpu, title: "Fabricantes de cuadros eléctricos", href: "/fabricantes-cuadros-electricos" },
  { icon: Factory, title: "Industria" },
  { icon: Warehouse, title: "Almacenes y centros logísticos" },
  { icon: Server, title: "Centros de datos y salas técnicas" },
  { icon: Building2, title: "Instalaciones con equipamiento eléctrico crítico" },
];

export function AudienceEs() {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-2">
            <SectionHeader
              align="left"
              badge="Profesionales"
              badgeIcon={HardHat}
              title="Una solución profesional"
              accent="de protección localizada"
              subtitle="Trabajamos con quienes proyectan, fabrican, instalan y mantienen instalaciones eléctricas: dimensionamiento, documentación técnica y suministro bajo presupuesto."
            />
            <div className="flex flex-wrap gap-3 -mt-4">
              <ButtonLink href="/profesionales" location="es-audience">Área profesional</ButtonLink>
              <ButtonLink href={proFormHref("distribuidor")} variant="secondary" location="es-audience-distributor">
                Convertirse en distribuidor
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {audiences.map((a, i) => {
              const inner = (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50/60 hover:border-orange-300 hover:bg-white transition-all h-full">
                  <span className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <a.icon className="w-5 h-5 text-orange-500" />
                  </span>
                  <span className="font-medium text-gray-800 text-sm">{a.title}</span>
                  {a.href && <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />}
                </div>
              );
              return (
                <Reveal key={a.title} delay={i * 0.04}>
                  {a.href ? <Link href={a.href}>{inner}</Link> : inner}
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------
// ¿Tu establecimiento está sujeto a una obligación de extinción automática?
// --------------------------------------------

export function ObligationEs() {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gray-900 px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px]" />
            <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div>
                <Badge icon={Scale} tone="dark">RSCIEI · RIPCI · CTE</Badge>
                <h2 className="mt-6 text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                  ¿Tu establecimiento está sujeto a una obligación de extinción automática?
                </h2>
                <p className="mt-5 text-lg text-gray-300 leading-relaxed">
                  La superficie, el nivel de riesgo y la configuración del establecimiento determinan las medidas de protección contra incendios exigibles.
                </p>
                <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                  El RSCIEI establece la instalación de sistemas automáticos de extinción en determinados establecimientos industriales en función de factores como el nivel de riesgo, la configuración del establecimiento, su actividad y su superficie. Te ayudamos a situar tu instalación y a identificar dónde una protección localizada en los cuadros eléctricos aporta seguridad adicional, como complemento de las medidas exigibles.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href={proFormHref("proyecto")} size="large" location="es-obligation">Analizar mi instalación</ButtonLink>
                  <ButtonLink href="/normativa" size="large" variant="ghostDark" location="es-obligation-normativa">Ver la normativa</ButtonLink>
                </div>
              </div>
              <ul className="space-y-3">
                {obligationFactors.map((f, i) => (
                  <li key={f.title} className="flex gap-4 rounded-2xl bg-white/5 border border-white/10 p-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-500/20 text-orange-300 text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block font-semibold text-white text-sm">{f.title}</span>
                      <span className="block text-sm text-gray-400 mt-0.5 leading-relaxed">{f.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// --------------------------------------------
// Normativa (bloque pedagógico)
// --------------------------------------------

export function RegulationTeaserEs() {
  return (
    <section className="py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Normativa española"
          badgeIcon={Scale}
          title="Los aerosoles condensados en la"
          accent="normativa española"
          subtitle="La normativa española de protección contra incendios contempla los sistemas fijos de extinción por aerosoles condensados entre las tecnologías de extinción automática."
        />
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { code: "UNE-EN 15276-1", label: "Componentes", text: "Requisitos y métodos de ensayo de los componentes, entre ellos los generadores de aerosol." },
            { code: "UNE-EN 15276-2", label: "Diseño, instalación y mantenimiento", text: "Cómo se proyecta, instala y mantiene un sistema fijo de extinción por aerosol condensado." },
          ].map((s, i) => (
            <Reveal key={s.code} delay={i * 0.1}>
              <div className="h-full rounded-2xl bg-white border border-gray-200 p-6 lg:p-8">
                <p className="font-mono text-sm text-orange-600 font-semibold">{s.code}</p>
                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">{s.label}</h3>
                <p className="text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div className="mt-6 rounded-2xl bg-white border border-gray-200 p-6 lg:p-8 grid lg:grid-cols-3 gap-6 items-center">
            <p className="lg:col-span-2 text-gray-700 leading-relaxed">
              El diseño y dimensionamiento de una instalación con sistemas de aerosol debe realizarse de acuerdo con las exigencias aplicables al proyecto.
              La adecuación del RK01 a cada instalación debe estudiarse caso por caso: se trata de una protección localizada, complementaria de los sistemas exigidos por la normativa.
            </p>
            <div className="lg:text-right">
              <ButtonLink href="/normativa" location="es-regulation-teaser">Guía de normativa</ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// --------------------------------------------
// Conformidad y documentación
// --------------------------------------------

export function ConformityEs({ showDocsLink = true }: { showDocsLink?: boolean }) {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Documentación"
          badgeIcon={FileCheck2}
          title="Conformidad y"
          accent="documentación"
          subtitle="Información verificable, disponible para profesionales bajo solicitud."
        />
        <div className="grid md:grid-cols-3 gap-5">
          {conformity.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-gray-200 bg-gray-50/50 p-6">
                <FileCheck2 className="w-7 h-7 text-orange-500 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{c.body}</p>
                {c.details.length > 0 && (
                  <ul className="mt-4 space-y-1">
                    {c.details.map((d) => (
                      <li key={d} className="text-xs font-mono text-gray-500">{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {showDocsLink && <ButtonLink href="/documentacion" location="es-conformity">Ver la documentación</ButtonLink>}
          <ButtonLink href={proFormHref("documentacion")} variant="secondary" location="es-conformity-request">
            Solicitar documentación técnica
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------
// Especificaciones técnicas
// --------------------------------------------

const parts = [
  { src: "/images/product/rk01-part1.png", title: "Carcasa", desc: "Envolvente compacta del generador" },
  { src: "/images/product/rk01-part2.png", title: "Mecanismo de activación", desc: "Activación térmica a 170 °C ± 10 °C" },
  { src: "/images/product/rk01-part3.png", title: "Agente extintor", desc: "Aerosol condensado, descarga ≤ 5 s" },
  { src: "/images/product/rk01-part4.png", title: "Soporte de fijación", desc: "Adhesivo de alta resistencia" },
];

export function SpecsEs() {
  return (
    <section id="especificaciones" className="py-20 lg:py-24 bg-gray-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          align="left"
          badge="Ficha técnica"
          badgeIcon={FileCheck2}
          title="Especificaciones"
          accent="técnicas"
          subtitle="Datos según la ficha técnica del RK01."
        />
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Reveal>
            <dl className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {specsEs.map((s, i) => (
                <div
                  key={s.label}
                  className={cn("flex justify-between items-center gap-4 px-6 py-4", i !== specsEs.length - 1 && "border-b border-gray-100")}
                >
                  <dt className="text-gray-600 text-sm flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    {s.label}
                  </dt>
                  <dd className="text-gray-900 font-semibold text-sm text-right">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3">
              {parts.map((p) => (
                <div key={p.title} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Image src={p.src} alt={`RK01 – ${p.title}`} width={80} height={80} className="w-10 h-10 object-contain" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{p.title}</p>
                    <p className="text-gray-500 text-sm">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------
// FAQ (acordeón)
// --------------------------------------------

export function FaqAccordionEs({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={cn("rounded-2xl border bg-white transition-colors", isOpen ? "border-orange-300" : "border-gray-200")}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 p-5 text-left"
            >
              <span className="font-semibold text-gray-900">{item.q}</span>
              <ChevronDown className={cn("w-5 h-5 text-gray-400 flex-shrink-0 transition-transform", isOpen && "rotate-180 text-orange-500")} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-gray-600 leading-relaxed">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// --------------------------------------------
// CTA final
// --------------------------------------------

export function FinalCtaEs({
  title = "Hablemos de tu instalación",
  text = "Cuéntanos qué cuadros quieres proteger: te ayudamos a dimensionar la protección y te enviamos la documentación técnica.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">{title}</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">{text}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href={proFormHref("proyecto")} variant="dark" size="large" location="es-final-project">Estudiar un proyecto</ButtonLink>
            <ButtonLink href={proFormHref("documentacion")} variant="secondary" size="large" location="es-final-docs">
              Solicitar documentación técnica
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
