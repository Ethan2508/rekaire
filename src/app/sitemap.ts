// ============================================
// REKAIRE - Sitemap (rekaire.fr)
// Le sitemap espagnol est dans src/app/es/sitemap.ts
// ============================================

import { MetadataRoute } from "next";
import { SITE_URLS, hreflangAlternates } from "@/config/sites";

const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/produit", priority: 0.9, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/a-propos", priority: 0.5, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/mentions-legales", priority: 0.3, changeFrequency: "monthly" },
  { path: "/cgv", priority: 0.3, changeFrequency: "monthly" },
  { path: "/confidentialite", priority: 0.3, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => {
    const alternates = hreflangAlternates("fr", p.path);
    return {
      url: `${SITE_URLS.fr}${p.path === "/" ? "" : p.path}`,
      lastModified: new Date(),
      changeFrequency: p.changeFrequency,
      priority: p.priority,
      ...("languages" in alternates ? { alternates: { languages: alternates.languages } } : {}),
    };
  });
}
