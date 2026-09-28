// ============================================
// REKAIRE ES - Normativa (fuentes oficiales)
// ============================================
// Citas literales verificadas en los textos consolidados del BOE (septiembre 2026).
// No añadir ninguna obligación que no figure literalmente en el texto oficial.

export const boe = {
  rsciei2025: "https://www.boe.es/buscar/act.php?id=BOE-A-2025-7190",
  rsciei2004: "https://www.boe.es/buscar/act.php?id=BOE-A-2004-21216",
  ripci: "https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606",
  pirotecnia: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-12054",
  cteDbSi: "https://www.codigotecnico.org/pdf/Documentos/SI/DBSI.pdf",
} as const;

export const regulations = [
  {
    id: "rsciei",
    acronym: "RSCIEI",
    name: "Reglamento de seguridad contra incendios en los establecimientos industriales",
    reference: "Real Decreto 164/2025, de 4 de marzo",
    url: boe.rsciei2025,
    summary:
      "Establece los requisitos de seguridad contra incendios de los establecimientos cuyo uso principal es industrial: actividades industriales, almacenes industriales, talleres de reparación de vehículos y sus servicios auxiliares. Está en vigor desde el 10 de mayo de 2025.",
    note:
      "Sustituye al Real Decreto 2267/2004. Los establecimientos existentes antes de su entrada en vigor continúan rigiéndose, con carácter general, por la reglamentación que les era de aplicación, salvo en aspectos como el mantenimiento, las inspecciones o las reformas y cambios de actividad.",
    extraLink: { label: "RD 2267/2004 (texto anterior)", url: boe.rsciei2004 },
  },
  {
    id: "ripci",
    acronym: "RIPCI",
    name: "Reglamento de instalaciones de protección contra incendios",
    reference: "Real Decreto 513/2017, de 22 de mayo",
    url: boe.ripci,
    summary:
      "Determina «las condiciones y los requisitos exigibles al diseño, instalación/aplicación, mantenimiento e inspección de los equipos, sistemas y componentes que conforman las instalaciones de protección activa contra incendios».",
    note:
      "Incluye entre los sistemas fijos de extinción los sistemas por aerosoles condensados y fija su mantenimiento periódico.",
  },
  {
    id: "cte",
    acronym: "CTE DB-SI",
    name: "Código Técnico de la Edificación – Documento Básico de Seguridad en caso de incendio",
    reference: "Documento Básico SI",
    url: boe.cteDbSi,
    summary:
      "Se aplica a los edificios y establecimientos de uso no industrial (administrativo, comercial, docente, residencial, pública concurrencia…). Excluye los establecimientos industriales a los que se aplica el RSCIEI.",
  },
] as const;

// Texto oficial RIPCI, anexo I, sección 1.ª, epígrafe 12
export const ripciAerosolQuote =
  "Estos sistemas deben diseñarse conforme a la norma UNE-EN 15276-2 y sus componentes deben disponer de marca de conformidad a la norma UNE-EN 15276-1 de acuerdo al artículo 5.2 del presente reglamento.";

export const standards = [
  {
    code: "UNE-EN 15276-1",
    scope: "Componentes",
    title:
      "Sistemas fijos de lucha contra incendios. Sistemas de extinción por aerosoles condensados. Parte 1: Requisitos y métodos de ensayo para los componentes.",
    detail:
      "Define los requisitos y ensayos de los componentes, en particular los generadores de aerosol. La edición citada por el RIPCI es la UNE-EN 15276-1:2022.",
  },
  {
    code: "UNE-EN 15276-2",
    scope: "Diseño, instalación y mantenimiento",
    title:
      "Sistemas fijos de lucha contra incendios. Sistemas de extinción por aerosoles condensados. Parte 2: Diseño, instalación y mantenimiento.",
    detail:
      "Regula cómo se proyecta, instala y mantiene el sistema completo: cálculo de la cantidad de agente, estanqueidad del recinto, seguridad de las personas y revisiones. La edición citada por el RIPCI es la UNE-EN 15276-2:2022.",
  },
] as const;

// Factores de los que depende la exigencia de extinción automática (RSCIEI, anexos I y III)
export const obligationFactors = [
  { title: "Uso del establecimiento", text: "El RSCIEI se aplica a establecimientos de uso principal industrial; los usos no industriales se rigen por el CTE DB-SI." },
  { title: "Fabricación o almacenamiento", text: "El reglamento distingue las actividades de fabricación, producción, transformación o reparación de las de almacenamiento, con umbrales distintos." },
  { title: "Nivel de riesgo intrínseco", text: "Bajo, medio o alto (grados 1 a 8), según la densidad de carga de fuego ponderada y corregida del sector o área de incendio." },
  { title: "Configuración del edificio", text: "Tipo A (AV o AH), B, C o D, según si el establecimiento comparte edificio, está adosado, aislado o en espacio abierto." },
  { title: "Superficie del sector de incendio", text: "La superficie construida del sector, combinada con los factores anteriores, determina si la instalación es preceptiva." },
] as const;

// RSCIEI (RD 164/2025), anexo III, apartado 7.1.1 — umbrales literales
export const sprinklerThresholds = {
  source: "RD 164/2025, anexo III, apartado 7.1.1",
  intro:
    "«Se instalarán sistemas fijos de extinción automática, tales como sistemas de rociadores automáticos, en los sectores de incendio cuando en ellos se desarrollen:»",
  columns: ["Configuración", "Riesgo intrínseco medio", "Riesgo intrínseco alto"],
  fabrication: [
    ["Tipo AV", "≥ 500 m²", "—"],
    ["Tipo AH", "≥ 1.500 m²", "≥ 750 m²"],
    ["Tipo B", "≥ 2.500 m²", "≥ 1.000 m²"],
    ["Tipo C", "≥ 3.500 m²", "≥ 2.000 m²"],
  ],
  storage: [
    ["Tipo AV", "≥ 300 m²", "—"],
    ["Tipo AH", "≥ 1.000 m²", "≥ 600 m²"],
    ["Tipo B", "≥ 1.500 m²", "≥ 800 m²"],
    ["Tipo C", "≥ 2.000 m²", "≥ 1.000 m²"],
  ],
  notes: [
    "Superficie construida del sector de incendio. «—»: el texto no fija un umbral específico para esa combinación en este apartado.",
    "Cuando en un sector coexisten fabricación y almacenamiento, el reglamento aplica una suma de cocientes entre superficies y umbrales.",
    "Según el apartado 7.1.3, los rociadores pueden sustituirse por otros sistemas fijos de extinción automática recogidos en el RIPCI, siempre que sean adecuados y aporten al menos el mismo nivel de seguridad.",
    "Aplicable a establecimientos nuevos desde el 10/05/2025. Los existentes se rigen, con carácter general, por el RD 2267/2004.",
  ],
} as const;
