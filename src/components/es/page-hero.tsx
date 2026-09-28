// ============================================
// REKAIRE ES - Cabecera de páginas interiores (Server Component)
// ============================================

import type { LucideIcon } from "lucide-react";

export function PageHeroEs({
  badge,
  icon: Icon,
  title,
  intro,
  children,
}: {
  badge: string;
  icon?: LucideIcon;
  title: string;
  intro: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-orange-50/30 pt-32 lg:pt-40 pb-14 lg:pb-20">
      <div className="absolute top-10 right-1/4 w-[420px] h-[420px] bg-orange-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-orange-100 border border-orange-200 text-orange-700">
          {Icon && <Icon className="w-4 h-4" />}
          {badge}
        </span>
        <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-[1.12]">{title}</h1>
        <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">{intro}</p>
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}

// Bloque de texto para páginas de contenido (normativa, legales, aplicaciones)
export function ProseSection({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-5">{title}</h2>
      <div className="space-y-4 text-gray-700 leading-relaxed [&_a]:text-orange-600 [&_a]:underline [&_a:hover]:text-orange-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  );
}
