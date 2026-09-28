// ============================================
// REKAIRE - Sites (FR / ES)
// ============================================
// Un seul déploiement sert rekaire.fr et rekaire.es.
// Ce fichier est importé par le middleware : constantes uniquement, aucune dépendance.

export type SiteId = "fr" | "es";

export const SITE_URLS: Record<SiteId, string> = {
  fr: "https://rekaire.fr",
  es: "https://rekaire.es",
};

export const ES_HOSTS = ["rekaire.es", "www.rekaire.es"];
export const FR_HOSTS = ["rekaire.fr", "www.rekaire.fr"];

// Préfixe interne des pages espagnoles (src/app/es/*), invisible sur rekaire.es
export const ES_INTERNAL_PREFIX = "/es";

// Cookie posé quand le visiteur choisit explicitement une version (sélecteur FR/ES)
export const SITE_CHOICE_COOKIE = "rk_site_choice";
// Paramètre ajouté par le sélecteur de langue pour mémoriser ce choix sur l'autre domaine
export const SITE_CHOICE_PARAM = "rk_site";

// Pages équivalentes entre les deux versions (redirection géographique + hreflang)
export const FR_TO_ES_PATHS: Record<string, string> = {
  "/": "/",
  "/produit": "/rk01",
  "/contact": "/contacto",
  "/faq": "/preguntas-frecuentes",
  "/a-propos": "/sobre-nosotros",
  "/mentions-legales": "/aviso-legal",
  "/confidentialite": "/politica-de-privacidad",
};

export const ES_TO_FR_PATHS: Record<string, string> = Object.fromEntries(
  Object.entries(FR_TO_ES_PATHS).map(([fr, es]) => [es, fr])
);

export function equivalentPath(from: SiteId, pathname: string): string {
  const clean = pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname;
  const map = from === "fr" ? FR_TO_ES_PATHS : ES_TO_FR_PATHS;
  return map[clean] ?? "/";
}

// Alternates hreflang pour une page qui existe dans les deux langues
export function hreflangAlternates(site: SiteId, pathname: string) {
  const other: SiteId = site === "fr" ? "es" : "fr";
  const otherPath = (site === "fr" ? FR_TO_ES_PATHS : ES_TO_FR_PATHS)[pathname];
  const self = `${SITE_URLS[site]}${pathname === "/" ? "" : pathname}`;

  if (otherPath === undefined) {
    return { canonical: self };
  }

  const otherUrl = `${SITE_URLS[other]}${otherPath === "/" ? "" : otherPath}`;
  const frUrl = site === "fr" ? self : otherUrl;
  const esUrl = site === "es" ? self : otherUrl;

  return {
    canonical: self,
    languages: {
      "fr-FR": frUrl,
      "es-ES": esUrl,
      "x-default": frUrl,
    },
  };
}
