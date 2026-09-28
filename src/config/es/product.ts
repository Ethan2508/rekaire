// ============================================
// REKAIRE ES - Datos técnicos y documentación del RK01
// ============================================
// Fuente : ficha técnica RK01 y documentos del fabricante.
// No añadir aquí ninguna certificación sin el documento correspondiente.

export const specsEs = [
  { label: "Activación automática", value: "170 °C ± 10 °C" },
  { label: "Tiempo de descarga", value: "≤ 5 s" },
  { label: "Volumen de protección por unidad", value: "0,1 m³" },
  { label: "Temperatura de funcionamiento", value: "-30 °C a 70 °C" },
  { label: "Dimensiones", value: "12,1 × 1,8 × 1,0 cm" },
  { label: "Peso neto", value: "22 g" },
  { label: "Vida útil", value: "5 años" },
  { label: "Fijación", value: "Adhesivo de alta resistencia" },
] as const;

export const autonomyPoints = [
  "Sin alimentación eléctrica",
  "Sin batería",
  "Sin cableado",
  "Sin presurizar",
  "Instalación adhesiva",
  "Sin mantenimiento rutinario según la documentación del producto",
] as const;

// Condición de instalación indicada en la ficha técnica
export const installationNote =
  "Para un funcionamiento óptimo, no debe haber obstáculos a menos de 100 mm delante de las boquillas de descarga.";

// Documentación de conformidad disponible (redacción prudente y exacta)
export const conformity = [
  {
    id: "en15276",
    title: "Verificación EN 15276-1:2019",
    body:
      "Verificación de conformidad voluntaria del dispositivo de referencia K180-5 con la norma EN 15276-1:2019 (componentes de sistemas de extinción por aerosoles condensados).",
    details: ["Informe de ensayo HUAX23030561C", "Válida hasta el 19/10/2028"],
  },
  {
    id: "p1",
    title: "Artículo pirotécnico categoría P1",
    body:
      "El dispositivo de referencia K180-5 está clasificado como dispositivo pirotécnico de extinción de incendios, categoría P1, conforme a la Directiva 2013/29/UE.",
    details: [
      "Organismo notificado 1395",
      "Ensayos según EN 16263",
      "Nº de registro 1395-P1-0086/2025",
    ],
  },
  {
    id: "ce",
    title: "Marcado CE",
    body:
      "Producto con marcado CE en el marco de la Directiva 2013/29/UE sobre artículos pirotécnicos.",
    details: [],
  },
] as const;

// Documentos que pueden solicitarse (no se publican en el sitio)
export const documents = [
  { title: "Ficha técnica RK01", description: "Características, dimensiones y condiciones de instalación." },
  { title: "Ficha de datos de seguridad (FDS)", description: "Composición, manipulación, transporte y almacenamiento." },
  { title: "Documentación CE", description: "Documentación relativa al marcado CE del dispositivo." },
  { title: "Documentación P1", description: "Informe del organismo notificado 1395 (Directiva 2013/29/UE)." },
  { title: "Verificación EN 15276-1:2019", description: "Verificación de conformidad voluntaria del dispositivo de referencia K180-5." },
  { title: "Referencias de informes de ensayo", description: "Informes asociados a la documentación anterior." },
] as const;
