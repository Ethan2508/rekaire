// ============================================
// REKAIRE - robots.txt (rekaire.fr)
// La version espagnole est servie par src/app/es/robots.txt/route.ts
// ============================================

import type { MetadataRoute } from "next";
import { SITE_URLS } from "@/config/sites";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/checkout", "/success", "/cancel"] },
    sitemap: `${SITE_URLS.fr}/sitemap.xml`,
  };
}
