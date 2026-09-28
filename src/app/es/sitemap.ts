// ============================================
// REKAIRE ES - Sitemap (servido en rekaire.es/sitemap.xml)
// ============================================

import type { MetadataRoute } from "next";
import { SITE_URLS, hreflangAlternates } from "@/config/sites";
import { publishedLandings } from "@/config/es/landings";

const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/rk01", priority: 0.9, changeFrequency: "monthly" },
  { path: "/profesionales", priority: 0.9, changeFrequency: "monthly" },
  { path: "/normativa", priority: 0.8, changeFrequency: "monthly" },
  { path: "/documentacion", priority: 0.7, changeFrequency: "monthly" },
  { path: "/preguntas-frecuentes", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contacto", priority: 0.6, changeFrequency: "yearly" },
  { path: "/sobre-nosotros", priority: 0.5, changeFrequency: "yearly" },
  ...publishedLandings.map((l) => ({ path: `/${l.slug}`, priority: 0.8, changeFrequency: "monthly" as const })),
  { path: "/aviso-legal", priority: 0.2, changeFrequency: "yearly" },
  { path: "/politica-de-privacidad", priority: 0.2, changeFrequency: "yearly" },
  { path: "/politica-de-cookies", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => {
    const alternates = hreflangAlternates("es", p.path);
    return {
      url: `${SITE_URLS.es}${p.path === "/" ? "" : p.path}`,
      lastModified: new Date(),
      changeFrequency: p.changeFrequency,
      priority: p.priority,
      ...("languages" in alternates ? { alternates: { languages: alternates.languages } } : {}),
    };
  });
}
