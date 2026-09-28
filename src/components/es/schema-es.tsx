// ============================================
// REKAIRE ES - Datos estructurados (Schema.org)
// Sin precios ni valoraciones : el sitio español funciona bajo presupuesto.
// ============================================

import { siteEs } from "@/config/es/site";
import { specsEs } from "@/config/es/product";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Contenido estático generado por nosotros, sin datos de usuario
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function OrganizationSchemaEs() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteEs.name,
        legalName: siteEs.company.legalName,
        url: siteEs.url,
        logo: `${siteEs.url}/logo.png`,
        contactPoint: {
          "@type": "ContactPoint",
          email: siteEs.contact.email,
          contactType: "sales",
          areaServed: "ES",
          availableLanguage: ["Spanish", "French"],
        },
      }}
    />
  );
}

export function WebSiteSchemaEs() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Rekaire España",
        url: siteEs.url,
        inLanguage: "es-ES",
      }}
    />
  );
}

export function ProductSchemaEs() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: "RK01 – Sistema autónomo de extinción por aerosol condensado",
        description:
          "Dispositivo autónomo de extinción automática para cuadros y armarios eléctricos. Activación a 170 °C, sin alimentación, sin batería y sin cableado. Protección de hasta 0,1 m³ por unidad.",
        image: [`${siteEs.url}/images/product/rk01-main.png`],
        brand: { "@type": "Brand", name: "Rekaire" },
        sku: "RK01",
        category: "Protección contra incendios",
        additionalProperty: specsEs.map((s) => ({
          "@type": "PropertyValue",
          name: s.label,
          value: s.value,
        })),
      }}
    />
  );
}

export function FaqSchemaEs({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((i) => ({
          "@type": "Question",
          name: i.q,
          acceptedAnswer: { "@type": "Answer", text: i.a },
        })),
      }}
    />
  );
}

export function BreadcrumbSchemaEs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${siteEs.url}${item.path === "/" ? "" : item.path}`,
        })),
      }}
    />
  );
}
