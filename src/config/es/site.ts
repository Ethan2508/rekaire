// ============================================
// REKAIRE ES - Configuración del sitio español
// ============================================

import { siteConfig } from "@/config/site";
import { SITE_URLS, SITE_CHOICE_PARAM } from "@/config/sites";

export const siteEs = {
  name: "Rekaire",
  url: SITE_URLS.es,
  locale: "es_ES",
  description:
    "Sistema autónomo de extinción automática por aerosol condensado para cuadros y armarios eléctricos. Protección localizada, directamente en el origen del riesgo.",
  contact: {
    email: "contacto@rekaire.es",
  },
  company: siteConfig.company,
  hosting: siteConfig.hosting,
  // Enlace a la versión francesa (memoriza la elección del visitante)
  frenchSiteUrl: `${SITE_URLS.fr}/?${SITE_CHOICE_PARAM}=fr`,
} as const;

// Enlaces de navegación principales
export const esNav = [
  { href: "/rk01", label: "RK01" },
  { href: "/profesionales", label: "Profesionales" },
  { href: "/normativa", label: "Normativa" },
  { href: "/documentacion", label: "Documentación" },
  { href: "/contacto", label: "Contacto" },
];

// Tipos de solicitud del formulario profesional (?solicitud=...)
export const requestTypes = {
  proyecto: "Estudiar un proyecto",
  documentacion: "Solicitar documentación técnica",
  distribuidor: "Convertirse en distribuidor",
  contacto: "Hablar con nuestro equipo",
} as const;

export type RequestType = keyof typeof requestTypes;

export function proFormHref(type: RequestType) {
  return `/profesionales?solicitud=${type}#formulario`;
}
