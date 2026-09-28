// ============================================
// REKAIRE ES - Páginas por aplicación y sector (SEO)
// ============================================
// Cada entrada genera una página en rekaire.es/<slug> y se añade al sitemap.
// Añadir una página solo cuando su contenido sea específico y útil :
// nada de páginas duplicadas cambiando únicamente el nombre del sector.
// Pendientes de redactar : industria, almacenes, centros-logisticos, centros-de-datos.

import type { RequestType } from "./site";

export interface LandingSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Landing {
  slug: string;
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  badge: string;
  h1: string;
  intro: string;
  diagram?: "single" | "multi" | "activation";
  sections: LandingSection[];
  faq: { q: string; a: string }[];
  cta: { type: RequestType; title: string; text: string };
}

const landings: Landing[] = [
  {
    slug: "proteccion-cuadros-electricos",
    navLabel: "Cuadros eléctricos",
    metaTitle: "Protección contra incendios en cuadros eléctricos",
    metaDescription:
      "Extinción automática localizada para cuadros y armarios eléctricos. El RK01 se activa a 170 °C, sin alimentación ni cableado, y se dimensiona según el volumen del cuadro.",
    badge: "Cuadros y armarios eléctricos",
    h1: "Protección contra incendios en cuadros eléctricos",
    intro:
      "Un cuadro eléctrico concentra conexiones, protecciones y cargas en un volumen cerrado. Cuando algo falla —una conexión floja, una sobrecarga, un arco—, el calor se acumula dentro de la envolvente y el incendio empieza allí, muchas veces sin nadie delante. El RK01 lleva la extinción automática al interior del cuadro, en el origen del riesgo.",
    diagram: "activation",
    sections: [
      {
        title: "Por qué el riesgo empieza dentro del cuadro",
        paragraphs: [
          "La mayoría de los defectos que originan un incendio eléctrico se desarrollan lentamente: un apriete insuficiente que aumenta la resistencia de contacto, un aislamiento envejecido, una protección sobrecargada o polvo acumulado cerca de las bornas. El calentamiento es progresivo y se produce en un espacio reducido y cerrado.",
          "Mientras el cuadro permanece cerrado, el humo y el calor tardan en salir de la envolvente. La detección a nivel de sala actúa cuando el incendio ya ha salido del cuadro. Actuar dentro de la envolvente permite intervenir en la fase inicial, antes de que el fuego alcance cableados, bandejas o equipos cercanos.",
        ],
      },
      {
        title: "Extinción automática en el interior de la envolvente",
        paragraphs: [
          "El RK01 se fija con adhesivo en la parte superior interior del cuadro. Cuando la temperatura en su entorno alcanza 170 °C ± 10 °C, se activa por sí solo y descarga en 5 segundos o menos un aerosol extintor que se distribuye en el volumen protegido.",
        ],
        bullets: [
          "Sin alimentación eléctrica, sin batería y sin cableado",
          "Sin presurizar: nada que recargar ni controlar con manómetro",
          "Sin modificar el esquema eléctrico del cuadro",
          "Vida útil de 5 años, sin mantenimiento rutinario según la documentación del producto",
        ],
      },
      {
        title: "Dimensionar la protección",
        paragraphs: [
          "Cada RK01 protege hasta 0,1 m³. En armarios de mayor volumen o con una configuración compleja pueden instalarse varias unidades, distribuidas estratégicamente para adaptar la protección al espacio.",
          "El número y la ubicación de los dispositivos deben determinarse según las características de la instalación: volumen útil, compartimentación, disposición de los aparatos y zonas de mayor riesgo. Además, no debe haber obstáculos a menos de 100 mm delante de las boquillas de descarga.",
        ],
      },
      {
        title: "Qué papel cumple el RK01",
        paragraphs: [
          "El RK01 es una protección localizada y complementaria del interior de envolventes eléctricas. No sustituye a los sistemas de detección, extinción o protección exigidos por la normativa aplicable al establecimiento (RSCIEI, CTE DB-SI, RIPCI), ni a un sistema que proteja un edificio o una sala completa.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Cuántos RK01 necesita un cuadro eléctrico?",
        a: "Depende del volumen y de la configuración del cuadro. Cada unidad protege hasta 0,1 m³; en cuadros más grandes o compartimentados se instalan varias unidades distribuidas por zonas. El número y la ubicación se determinan para cada instalación.",
      },
      {
        q: "¿El RK01 necesita conexión eléctrica?",
        a: "No. Funciona sin alimentación, sin batería y sin cableado: se activa por temperatura (170 °C ± 10 °C).",
      },
      {
        q: "¿Dónde se coloca dentro del cuadro?",
        a: "Normalmente en la parte superior interior, donde se acumula el calor, dejando al menos 100 mm libres delante de las boquillas de descarga. En armarios grandes se reparten varias unidades por zonas.",
      },
    ],
    cta: {
      type: "proyecto",
      title: "¿Quieres proteger tus cuadros eléctricos?",
      text: "Indícanos el número de cuadros y sus dimensiones y te ayudamos a dimensionar la protección.",
    },
  },
  {
    slug: "aerosol-condensado",
    navLabel: "Aerosol condensado",
    metaTitle: "Extinción por aerosol condensado y UNE-EN 15276",
    metaDescription:
      "Qué es la extinción por aerosol condensado, cómo actúa sobre el fuego, qué regulan las normas UNE-EN 15276-1 y UNE-EN 15276-2 y cómo se aplica en cuadros eléctricos.",
    badge: "Tecnología",
    h1: "Extinción por aerosol condensado",
    intro:
      "El aerosol condensado es una tecnología de extinción que no utiliza agua, espuma ni gas a presión. Un compuesto sólido genera, al activarse, una nube de partículas muy finas que actúa sobre la combustión. Por su compacidad, se adapta especialmente bien a volúmenes cerrados y reducidos.",
    sections: [
      {
        title: "Cómo actúa sobre el fuego",
        paragraphs: [
          "Al activarse, el generador transforma un compuesto sólido en un aerosol de micropartículas sólidas suspendidas en gas. Estas partículas, de tamaño muy reducido, permanecen en suspensión en el volumen protegido e interfieren en las reacciones químicas en cadena de la combustión.",
          "A diferencia de los sistemas por gas, el agente no se almacena a presión: no hay botellas, válvulas ni tuberías. Esto permite fabricar generadores muy compactos, adecuados para proteger el interior de envolventes pequeñas.",
        ],
      },
      {
        title: "Qué regulan las normas UNE-EN 15276",
        paragraphs: [
          "La serie UNE-EN 15276 trata de los sistemas fijos de lucha contra incendios por aerosoles condensados y distingue dos niveles:",
        ],
        bullets: [
          "UNE-EN 15276-1 – Requisitos y métodos de ensayo para los componentes (los generadores de aerosol, entre otros).",
          "UNE-EN 15276-2 – Diseño, instalación y mantenimiento del sistema completo.",
        ],
      },
      {
        title: "Sistema fijo y dispositivo autónomo localizado",
        paragraphs: [
          "El Reglamento de instalaciones de protección contra incendios (RIPCI) describe los sistemas fijos de extinción por aerosoles condensados como conjuntos compuestos por dispositivos de accionamiento, equipos de control de funcionamiento y unidades generadoras, diseñados según UNE-EN 15276-2 y con componentes con marca de conformidad a UNE-EN 15276-1.",
          "Un dispositivo autónomo como el RK01 responde a otra necesidad: proteger el interior de una envolvente eléctrica concreta, sin instalación ni control asociados. Es una protección localizada y complementaria, que no sustituye a un sistema fijo exigido por la normativa.",
        ],
      },
      {
        title: "El RK01",
        paragraphs: [
          "El dispositivo de referencia del RK01 (K180-5) dispone de una verificación de conformidad voluntaria con la norma EN 15276-1:2019 y está clasificado como artículo pirotécnico de categoría P1 conforme a la Directiva 2013/29/UE. La documentación correspondiente está disponible para profesionales bajo solicitud.",
        ],
      },
    ],
    faq: [
      {
        q: "¿El aerosol condensado es un gas a presión?",
        a: "No. El agente se genera en el momento de la activación a partir de un compuesto sólido; el dispositivo no está presurizado.",
      },
      {
        q: "¿Qué diferencia hay entre UNE-EN 15276-1 y UNE-EN 15276-2?",
        a: "La parte 1 establece los requisitos y ensayos de los componentes; la parte 2 regula el diseño, la instalación y el mantenimiento del sistema completo.",
      },
    ],
    cta: {
      type: "documentacion",
      title: "¿Necesitas la documentación técnica?",
      text: "Ficha técnica, ficha de datos de seguridad y documentación de conformidad disponibles para profesionales.",
    },
  },
  {
    slug: "fabricantes-cuadros-electricos",
    navLabel: "Fabricantes de cuadros",
    metaTitle: "Extinción automática para fabricantes de cuadros",
    metaDescription:
      "Integra el RK01 en tus cuadros y armarios eléctricos desde fábrica: montaje adhesivo, sin cableado, dimensionamiento por modelo de envolvente y documentación técnica para tus clientes.",
    badge: "Fabricantes de cuadros",
    h1: "Extinción automática integrada desde fábrica",
    intro:
      "Para un fabricante o integrador de cuadros eléctricos, el RK01 es una opción que puede ofrecerse de serie o bajo pedido: se monta en segundos durante el ensamblaje, sin cableado y sin modificar el esquema del cuadro.",
    diagram: "multi",
    sections: [
      {
        title: "Integración en la línea de montaje",
        paragraphs: [
          "El RK01 mide 12,1 × 1,8 × 1,0 cm y pesa 22 g. Se fija con adhesivo de alta resistencia en la parte superior interior de la envolvente, sin taladros ni conexiones.",
        ],
        bullets: [
          "Sin cableado ni alimentación: no afecta al esquema eléctrico",
          "Temperatura de funcionamiento de -30 °C a 70 °C",
          "Condición de montaje: 100 mm libres delante de las boquillas de descarga",
        ],
      },
      {
        title: "Dimensionamiento por modelo de envolvente",
        paragraphs: [
          "Cada unidad protege hasta 0,1 m³. Para una gama de envolventes, definimos con tu oficina técnica el número de unidades y su posición para cada modelo, teniendo en cuenta el volumen útil y la disposición de los aparatos.",
          "En armarios de gran volumen o compartimentados se distribuyen varias unidades por zonas. El número y la ubicación se determinan según las características de cada envolvente.",
        ],
      },
      {
        title: "Un valor añadido para tus clientes",
        paragraphs: [
          "Ofrecer protección contra incendios en el interior del cuadro diferencia tu producto ante instaladores, industria y propiedades. Ponemos a tu disposición la documentación técnica del dispositivo para tus clientes y tu oficina técnica.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Se puede instalar en cuadros ya fabricados?",
        a: "Sí. El montaje es adhesivo, por lo que puede hacerse tanto en fábrica como en cuadros ya instalados.",
      },
      {
        q: "¿Ofrecen condiciones para series?",
        a: "Sí. Las condiciones para fabricantes y distribuidores se establecen bajo presupuesto, según volúmenes.",
      },
    ],
    cta: {
      type: "distribuidor",
      title: "Integra el RK01 en tu gama",
      text: "Cuéntanos qué envolventes fabricas y te proponemos un dimensionamiento por modelo.",
    },
  },
];

export const publishedLandings = landings;

export function getLanding(slug: string) {
  return landings.find((l) => l.slug === slug);
}
