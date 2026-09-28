// ============================================
// REKAIRE ES - robots.txt (servido en rekaire.es/robots.txt)
// ============================================

import { SITE_URLS } from "@/config/sites";

export const dynamic = "force-static";

export function GET() {
  const body = ["User-agent: *", "Allow: /", "Disallow: /api/", "", `Sitemap: ${SITE_URLS.es}/sitemap.xml`, ""].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
