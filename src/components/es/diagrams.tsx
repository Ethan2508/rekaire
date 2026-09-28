"use client";

// ============================================
// REKAIRE ES - Esquemas técnicos (SVG)
// Instalación dentro del cuadro, secuencia de activación,
// protección de una o varias unidades.
// Los esquemas son ilustrativos : no representan un dimensionamiento.
// ============================================

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Thermometer, Flame, Zap, Wind, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const BRAND = "#eb5122";
const STROKE = "#374151";
const LINE = "#d1d5db";

// --------------------------------------------
// Piezas básicas
// --------------------------------------------

function Rk01Glyph({ x, y, width = 56, glow = false }: { x: number; y: number; width?: number; glow?: boolean }) {
  const h = width / 6.2;
  const dots = 9;
  return (
    <g transform={`translate(${x - width / 2}, ${y - h / 2})`}>
      {glow && (
        <motion.rect
          x={-6}
          y={-6}
          width={width + 12}
          height={h + 12}
          rx={(h + 12) / 2}
          fill={BRAND}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.15, 0.45, 0.15] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
      <rect width={width} height={h} rx={h / 2} fill={BRAND} />
      {Array.from({ length: dots }).map((_, i) => (
        <circle
          key={i}
          cx={(width / (dots + 1)) * (i + 1)}
          cy={h / 2}
          r={Math.max(1, h / 6)}
          fill="#fff"
          opacity={0.85}
        />
      ))}
    </g>
  );
}

// Fila de carril DIN con interruptores automáticos
function DinRow({ x, y, width, count, hotIndex }: { x: number; y: number; width: number; count: number; hotIndex?: number }) {
  const gap = width / count;
  const bw = gap * 0.72;
  return (
    <g>
      <rect x={x} y={y + 10} width={width} height={4} fill={LINE} rx={1} />
      {Array.from({ length: count }).map((_, i) => {
        const bx = x + i * gap + (gap - bw) / 2;
        const hot = i === hotIndex;
        return (
          <g key={i}>
            <rect x={bx} y={y} width={bw} height={24} rx={2} fill={hot ? "#fee2e2" : "#fff"} stroke={hot ? "#ef4444" : STROKE} strokeWidth={1} />
            <rect x={bx + bw * 0.3} y={y + 7} width={bw * 0.4} height={6} rx={1} fill={hot ? "#ef4444" : "#9ca3af"} />
          </g>
        );
      })}
    </g>
  );
}

function Cabinet({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={8} fill="#f9fafb" stroke={STROKE} strokeWidth={2} />
      <rect x={x + 8} y={y + 8} width={width - 16} height={height - 16} rx={4} fill="#fff" stroke={LINE} strokeWidth={1} />
    </g>
  );
}

function Zone({ x, y, width, height, label, delay = 0 }: { x: number; y: number; width: number; height: number; label?: string; delay?: number }) {
  return (
    <g>
      <motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={6}
        fill={BRAND}
        stroke={BRAND}
        strokeDasharray="5 4"
        strokeWidth={1.2}
        initial={{ fillOpacity: 0, strokeOpacity: 0 }}
        whileInView={{ fillOpacity: 0.07, strokeOpacity: 0.55 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
      />
      {label && (
        <text x={x + width - 8} y={y + height - 8} textAnchor="end" fontSize={10} fontWeight={600} fill={BRAND}>
          {label}
        </text>
      )}
    </g>
  );
}

// --------------------------------------------
// Cuadro con una unidad / armario con varias unidades
// --------------------------------------------

export function PanelSchematic({ variant, className }: { variant: "single" | "multi"; className?: string }) {
  if (variant === "single") {
    return (
      <svg viewBox="0 0 240 200" className={className} role="img" aria-label="Cuadro eléctrico pequeño protegido por un RK01 fijado en la parte superior">
        <Cabinet x={16} y={10} width={208} height={180} />
        <Zone x={30} y={24} width={180} height={152} />
        <DinRow x={40} y={78} width={160} count={8} />
        <DinRow x={40} y={130} width={160} count={8} />
        <Rk01Glyph x={120} y={40} width={62} />
        <text x={120} y={62} textAnchor="middle" fontSize={9} fill="#6b7280">RK01</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 300 360" className={className} role="img" aria-label="Armario eléctrico grande con varias unidades RK01 distribuidas por zonas">
      <Cabinet x={16} y={10} width={268} height={340} />
      <Zone x={30} y={24} width={240} height={104} label="Zona 1" />
      <Zone x={30} y={134} width={240} height={104} label="Zona 2" delay={0.2} />
      <Zone x={30} y={244} width={240} height={92} label="Zona 3" delay={0.4} />
      <DinRow x={44} y={72} width={212} count={11} />
      <DinRow x={44} y={182} width={212} count={11} />
      <DinRow x={44} y={290} width={212} count={11} />
      <Rk01Glyph x={150} y={42} width={62} />
      <Rk01Glyph x={150} y={154} width={62} />
      <Rk01Glyph x={150} y={264} width={62} />
    </svg>
  );
}

// --------------------------------------------
// Dónde se instala : iconos de envolventes
// --------------------------------------------

export type EnclosureKind = "cuadro" | "armario" | "contador" | "control" | "distribucion";

export function EnclosureIllustration({ kind, className }: { kind: EnclosureKind; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {kind === "cuadro" && (
        <>
          <Cabinet x={18} y={22} width={84} height={78} />
          <DinRow x={30} y={58} width={60} count={5} />
          <Rk01Glyph x={60} y={38} width={38} />
        </>
      )}
      {kind === "armario" && (
        <>
          <Cabinet x={26} y={6} width={68} height={108} />
          <DinRow x={36} y={42} width={48} count={4} />
          <DinRow x={36} y={78} width={48} count={4} />
          <Rk01Glyph x={60} y={24} width={34} />
        </>
      )}
      {kind === "contador" && (
        <>
          <Cabinet x={24} y={18} width={72} height={86} />
          <rect x={38} y={48} width={44} height={40} rx={4} fill="#fff" stroke={STROKE} />
          <rect x={44} y={56} width={32} height={10} rx={2} fill="#e5e7eb" />
          <circle cx={60} cy={78} r={5} fill="none" stroke={STROKE} />
          <Rk01Glyph x={60} y={33} width={34} />
        </>
      )}
      {kind === "control" && (
        <>
          <Cabinet x={14} y={20} width={92} height={80} />
          <rect x={26} y={50} width={36} height={24} rx={3} fill="#e5e7eb" stroke={STROKE} />
          {[74, 86].map((cx) => (
            <circle key={cx} cx={cx} cy={56} r={4} fill={cx === 74 ? "#10b981" : "#ef4444"} />
          ))}
          <rect x={70} y={68} width={20} height={6} rx={2} fill="#9ca3af" />
          <Rk01Glyph x={60} y={35} width={38} />
        </>
      )}
      {kind === "distribucion" && (
        <>
          <Cabinet x={20} y={6} width={80} height={108} />
          <DinRow x={30} y={36} width={60} count={5} />
          <DinRow x={30} y={64} width={60} count={5} />
          <DinRow x={30} y={92} width={60} count={5} />
          <Rk01Glyph x={60} y={20} width={36} />
        </>
      )}
    </svg>
  );
}

// --------------------------------------------
// Secuencia de activación (5 etapas)
// --------------------------------------------

export const activationSteps = [
  { icon: Flame, title: "Sobrecalentamiento", text: "Un defecto eléctrico (conexión floja, sobrecarga, arco) provoca un calentamiento anómalo o un inicio de incendio." },
  { icon: Thermometer, title: "≈ 170 °C", text: "La temperatura en el entorno del dispositivo alcanza su umbral de activación (170 °C ± 10 °C)." },
  { icon: Zap, title: "Activación automática", text: "El RK01 se activa por sí solo, sin electricidad, sin batería y sin intervención humana." },
  { icon: Wind, title: "Descarga del agente", text: "El aerosol extintor se libera en ≤ 5 segundos y se distribuye en el volumen protegido." },
  { icon: ShieldCheck, title: "Supresión", text: "El incendio se suprime dentro del espacio protegido, antes de propagarse al resto de la instalación." },
] as const;

// Posiciones deterministas para las partículas (sin Math.random : evita errores de hidratación)
const particles = Array.from({ length: 36 }, (_, i) => ({
  x: 44 + ((i * 53) % 212),
  y: 60 + ((i * 37) % 148),
  r: 2 + (i % 3),
}));

export function ActivationSequence({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  const [manual, setManual] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (manual || reduceMotion) return;
    const id = setInterval(() => setStep((s) => (s + 1) % activationSteps.length), 2600);
    return () => clearInterval(id);
  }, [manual, reduceMotion]);

  const tempLevel = [0.45, 0.85, 0.9, 0.7, 0.2][step];
  const tempLabel = ["↑", "170 °C", "170 °C", "↓", "OK"][step];
  const fireVisible = step <= 3;

  return (
    <div className={cn("grid lg:grid-cols-5 gap-8 items-center", className)}>
      <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 p-4 sm:p-6">
        <svg viewBox="0 0 360 250" className="w-full h-auto" role="img" aria-label={`Etapa ${step + 1}: ${activationSteps[step].title}`}>
          <Cabinet x={16} y={14} width={270} height={222} />

          {/* Aerosol */}
          <AnimatePresence>
            {step >= 3 &&
              particles.map((p, i) => (
                <motion.circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={p.r}
                  fill="#9ca3af"
                  initial={{ opacity: 0, cx: 151, cy: 44 }}
                  animate={{ opacity: step === 3 ? 0.55 : 0.18, cx: p.x, cy: p.y }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, delay: (i % 12) * 0.03 }}
                />
              ))}
          </AnimatePresence>

          <DinRow x={40} y={112} width={222} count={10} hotIndex={step <= 3 ? 6 : undefined} />
          <DinRow x={40} y={176} width={222} count={10} />

          {/* Calor / llama sobre el interruptor defectuoso */}
          <AnimatePresence>
            {fireVisible && (
              <motion.g
                key="fire"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: step === 3 ? 0.35 : 1, scale: step === 0 ? 0.8 : 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.5 }}
                style={{ originX: "196px", originY: "108px" }}
              >
                <motion.path
                  d="M196 108 C186 98 190 88 196 80 C198 88 206 90 204 98 C208 94 208 90 207 86 C214 94 212 104 204 108 Z"
                  fill="#f97316"
                  animate={{ scaleY: [1, 1.12, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
                <path d="M198 108 C194 102 196 96 199 92 C201 98 205 100 203 108 Z" fill="#fde047" />
              </motion.g>
            )}
          </AnimatePresence>

          {step <= 1 &&
            [0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d={`M${186 + i * 10} 80 q -4 -8 0 -16 q 4 -8 0 -16`}
                stroke="#fca5a5"
                strokeWidth={1.5}
                fill="none"
                animate={{ opacity: [0, 0.9, 0], y: [0, -6, -12] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}

          {/* RK01 */}
          <Rk01Glyph x={151} y={44} width={70} glow={step === 2 || step === 3} />

          {/* Termómetro */}
          <g transform="translate(314, 30)">
            <rect x={-8} y={0} width={16} height={170} rx={8} fill="#fff" stroke={STROKE} strokeWidth={1.5} />
            <motion.rect
              x={-4}
              width={8}
              rx={4}
              fill={step === 4 ? "#10b981" : "#ef4444"}
              animate={{ y: 166 - 160 * tempLevel, height: 160 * tempLevel }}
              transition={{ duration: 0.8 }}
            />
            <circle cx={0} cy={186} r={12} fill={step === 4 ? "#10b981" : "#ef4444"} stroke={STROKE} strokeWidth={1.5} />
            <text x={0} y={218} textAnchor="middle" fontSize={11} fontWeight={700} fill={STROKE}>
              {tempLabel}
            </text>
          </g>

          {/* Protegido */}
          <AnimatePresence>
            {step === 4 && (
              <motion.g key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <rect x={96} y={140} width={110} height={28} rx={14} fill="#10b981" />
                <text x={151} y={158} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">
                  Incendio suprimido
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
        <p className="text-xs text-gray-400 text-center mt-2">Esquema ilustrativo del principio de funcionamiento.</p>
      </div>

      <ol className="lg:col-span-2 space-y-3">
        {activationSteps.map((s, i) => {
          const active = i === step;
          return (
            <li key={s.title}>
              <button
                type="button"
                onClick={() => {
                  setManual(true);
                  setStep(i);
                }}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "w-full text-left flex gap-4 p-4 rounded-2xl border transition-all",
                  active ? "bg-orange-50 border-orange-300 shadow-md" : "bg-white border-gray-200 hover:border-gray-300"
                )}
              >
                <span
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold",
                    active ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white" : "bg-gray-100 text-gray-500"
                  )}
                >
                  {i + 1}
                </span>
                <span>
                  <span className="flex items-center gap-2 font-semibold text-gray-900">
                    <s.icon className={cn("w-4 h-4", active ? "text-orange-500" : "text-gray-400")} />
                    {s.title}
                  </span>
                  <span className="block text-sm text-gray-600 mt-1 leading-relaxed">{s.text}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
