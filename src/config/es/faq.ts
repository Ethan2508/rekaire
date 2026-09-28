// ============================================
// REKAIRE ES - Preguntas frecuentes
// ============================================

export interface FaqItem {
  q: string;
  a: string;
}

export const faqEs: { category: string; items: FaqItem[] }[] = [
  {
    category: "Producto",
    items: [
      {
        q: "¿Qué es el RK01?",
        a: "Un sistema autónomo de extinción por aerosol condensado para espacios pequeños y cerrados: cuadros eléctricos, armarios eléctricos, cuadros de distribución, cajas de contadores y paneles de control.",
      },
      {
        q: "¿Cómo se activa?",
        a: "Por temperatura. Cuando el entorno del dispositivo alcanza 170 °C ± 10 °C, se activa automáticamente y descarga el agente extintor en 5 segundos o menos. No necesita electricidad, batería ni intervención humana.",
      },
      {
        q: "¿Qué volumen protege una unidad?",
        a: "Hasta 0,1 m³. En armarios de mayor volumen o con una configuración compleja pueden instalarse varias unidades, distribuidas estratégicamente. El número y la ubicación de los dispositivos deben determinarse según las características de la instalación.",
      },
      {
        q: "¿Cuánto dura?",
        a: "La vida útil es de 5 años. Según la documentación del producto, no requiere mantenimiento rutinario; recomendamos incluir una revisión visual del dispositivo en las inspecciones habituales del cuadro.",
      },
    ],
  },
  {
    category: "Instalación",
    items: [
      {
        q: "¿Cómo se instala?",
        a: "Se fija con adhesivo de alta resistencia, normalmente en la parte superior interior de la envolvente. No requiere cableado ni modificar el esquema eléctrico.",
      },
      {
        q: "¿Hay condiciones de montaje?",
        a: "Sí: no debe haber obstáculos a menos de 100 mm delante de las boquillas de descarga, y la temperatura de funcionamiento está comprendida entre -30 °C y 70 °C.",
      },
      {
        q: "¿Puedo instalarlo en un cuadro existente?",
        a: "Sí. El montaje adhesivo permite equipar tanto cuadros nuevos como cuadros ya en servicio.",
      },
    ],
  },
  {
    category: "Normativa y documentación",
    items: [
      {
        q: "¿El RK01 es obligatorio?",
        a: "No. Ninguna normativa española obliga a instalar el RK01. La exigencia de sistemas automáticos de extinción en un establecimiento depende de su uso, actividad, nivel de riesgo, configuración y superficie, y se determina en cada proyecto.",
      },
      {
        q: "¿Sustituye a los sistemas exigidos por el RSCIEI o el CTE?",
        a: "No. El RK01 es una protección localizada y complementaria del interior de envolventes eléctricas. No sustituye a las instalaciones de protección contra incendios exigidas por la normativa aplicable.",
      },
      {
        q: "¿Qué documentación tiene?",
        a: "El dispositivo de referencia (K180-5) dispone de una verificación de conformidad voluntaria con la norma EN 15276-1:2019 (informe HUAX23030561C, válida hasta el 19/10/2028) y está clasificado como artículo pirotécnico de categoría P1 según la Directiva 2013/29/UE (organismo notificado 1395, ensayos según EN 16263).",
      },
      {
        q: "¿Cómo obtengo la documentación técnica?",
        a: "Solicítala desde el área profesional indicando tu empresa y tu proyecto. Te enviaremos la ficha técnica, la ficha de datos de seguridad y la documentación de conformidad.",
      },
    ],
  },
  {
    category: "Compra",
    items: [
      {
        q: "¿Cómo puedo comprar el RK01 en España?",
        a: "En España trabajamos bajo presupuesto, directamente con profesionales y a través de distribuidores. Indícanos tu necesidad desde el formulario y te responderemos.",
      },
      {
        q: "¿Buscan distribuidores?",
        a: "Sí. Si eres distribuidor de material eléctrico o de protección contra incendios, contacta con nosotros desde el área profesional.",
      },
    ],
  },
];

export const faqEsFlat: FaqItem[] = faqEs.flatMap((c) => c.items);
