"use client";

// ============================================
// REKAIRE - Chiffres incendie, version sombre : compteurs animés
// ============================================

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldAlert } from "lucide-react";

const STATS = [
  { value: "300 000", label: "Incendies domestiques", sublabel: "chaque année en France" },
  { value: "1 sur 4", label: "Est d'origine électrique", sublabel: "25-30 % des incendies" },
  { value: "10 000", label: "Blessés par an", sublabel: "dont 70 % la nuit" },
  { value: "500+", label: "Décès annuels", sublabel: "en France" },
];

// Anime la partie numérique de la valeur (« 300 000 » → compteur ; « 1 sur 4 » → le 1)
function parseValue(value: string) {
  const m = value.match(/^(\d+(?:\s\d+)*)(.*)$/);
  if (!m) return null;
  return { target: parseInt(m[1].replace(/\s/g, ""), 10), suffix: m[2] };
}

function CountUp({ value, start }: { value: string; start: boolean }) {
  const parsed = useMemo(() => parseValue(value), [value]);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start || !parsed) return;
    const { target } = parsed;
    const t0 = performance.now(), dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, parsed]);
  if (!parsed) return <>{value}</>;
  return <>{n.toLocaleString("fr-FR")}{parsed.suffix}</>;
}

export function StatsDark() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  return (
    <section data-header-theme="dark" className="relative overflow-hidden bg-[#0a0a0b] py-24 text-white lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl" />
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300">
            <ShieldAlert className="h-4 w-4" /> Chaque année en France
          </span>
          <h2 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Les incendies domestiques : <span className="text-red-400">un danger réel</span>
          </h2>
          <p className="mt-6 text-lg text-gray-400">
            En France, <strong className="text-white">1 incendie se déclenche toutes les 2 minutes</strong>. La majorité pourrait être évitée avec une protection adaptée.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative bg-[#0f0f11] p-6 sm:p-10"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/0 to-orange-500/0 transition-colors duration-500 group-hover:to-orange-500/10" />
              <p className="relative font-display text-4xl font-extrabold tabular-nums tracking-tight text-white sm:text-6xl">
                <CountUp value={s.value} start={inView} />
              </p>
              <p className="relative mt-4 font-semibold text-white">{s.label}</p>
              <p className="relative mt-1 text-sm text-gray-500">{s.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
