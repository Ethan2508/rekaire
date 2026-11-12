"use client";

// ============================================
// REKAIRE - Hero cinématique : le RK01 en 3D piloté par le scroll
// 126 images (rendu 3D, fond transparent) dessinées dans un canvas :
//   0 → 50 %  le produit tourne sur lui-même, les atouts apparaissent
//  50 → 95 %  vue éclatée : les 4 pièces se séparent, chacune est nommée
// ============================================

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Flame, Shield, Truck } from "lucide-react";
import { CTAButton } from "@/components/cta-button";
import { VideoModal } from "@/components/video-modal";
import { SalesCounterBadge } from "@/components/live-sales-counter";
import { Embers } from "./embers";

const FRAMES = 126;
const LAST = FRAMES - 1;
type Tier = "xl" | "lg" | "sm";
// xl = résolution native des rendus (écrans Retina), lg = 1280 px, sm = 640 px
const pickTier = (): Tier => {
  const retina = (window.devicePixelRatio || 1) > 1.25;
  if (window.innerWidth >= 900) return retina ? "xl" : "lg";
  return retina ? "lg" : "sm";
};
const src = (size: Tier, i: number) => `/images/product/seq/${size}/${String(i).padStart(3, "0")}.webp`;

// Repères de la narration (fraction du scroll de la section)
const T = { titleOut: 0.1, rotateEnd: 0.52, explodeEnd: 0.92 };
const progressToFrame = (p: number) => {
  if (p <= T.titleOut) return 0;
  if (p <= T.rotateEnd) return ((p - T.titleOut) / (T.rotateEnd - T.titleOut)) * 62;
  if (p <= T.explodeEnd) return 62 + ((p - T.rotateEnd) / (T.explodeEnd - T.rotateEnd)) * (LAST - 62);
  return LAST;
};

const CHAPTERS = [
  { at: 0.16, title: "Sans électricité", text: "Aucun branchement, aucun câblage : il fonctionne seul.", side: "left" as const },
  { at: 0.29, title: "Sans pile", text: "Rien à recharger, rien à changer pendant 5 ans.", side: "right" as const },
  { at: 0.42, title: "S'installe en 30 secondes", text: "Un adhésif haute résistance, sous le plafond du tableau.", side: "left" as const },
];

const PARTS = [
  { at: 0.58, title: "Boîtier", text: "Fond à 170 °C pour activer le système", y: "22%" },
  { at: 0.67, title: "Mécanisme de déclenchement", text: "Activation automatique en moins de 5 secondes", y: "40%" },
  { at: 0.76, title: "Agent extincteur", text: "Aérosol non conducteur, efficace sur les feux électriques", y: "58%" },
  { at: 0.85, title: "Support de fixation", text: "Adhésif haute résistance, pose sans outil", y: "76%" },
];

function Fade({ p, at, span = 0.1, children, className = "" }: { p: MotionValue<number>; at: number; span?: number; children: React.ReactNode; className?: string }) {
  const opacity = useTransform(p, [at - 0.03, at, at + span, at + span + 0.04], [0, 1, 1, 0]);
  const y = useTransform(p, [at - 0.03, at, at + span, at + span + 0.04], [24, 0, 0, -16]);
  return (
    <motion.div style={{ opacity, y }} className={`absolute ${className}`}>
      {children}
    </motion.div>
  );
}

export function ScrollSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const frameRef = useRef(0);
  const sizeRef = useRef<Tier>("lg");
  const [ready, setReady] = useState(false);
  const [desktop, setDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  // Dessine la frame la plus proche déjà chargée, centrée et contenue dans le canvas
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const want = Math.round(frameRef.current);
    let img: HTMLImageElement | null = null;
    for (let d = 0; d < FRAMES && !img; d++) {
      const a = imagesRef.current[want - d], b = imagesRef.current[want + d];
      img = (a && a.complete && a.naturalWidth ? a : null) || (b && b.complete && b.naturalWidth ? b : null);
    }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = canvas.clientWidth, H = canvas.clientHeight;
    if (canvas.width !== Math.round(W * dpr)) { canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, W, H);
    if (!img) return;
    const scale = Math.min(W / img.naturalWidth, H / img.naturalHeight) * (W < 768 ? 1.15 : 1);
    const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
    ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  };

  useMotionValueEvent(p, "change", (v) => {
    frameRef.current = progressToFrame(v);
    requestAnimationFrame(draw);
  });

  // Chargement : la 1re image tout de suite, puis par passes de plus en plus fines
  useEffect(() => {
    sizeRef.current = pickTier();
    const size = sizeRef.current;
    const order: number[] = [0];
    for (const step of [16, 8, 4, 2, 1]) for (let i = 0; i < FRAMES; i += step) if (!order.includes(i)) order.push(i);
    let cancelled = false;
    const load = (i: number) =>
      new Promise<void>((res) => {
        const im = new Image();
        im.decoding = "async";
        im.onload = () => { imagesRef.current[i] = im; if (i === 0) setReady(true); draw(); res(); };
        im.onerror = () => res();
        im.src = src(size, i);
      });
    (async () => {
      await load(order[0]);
      // 4 téléchargements en parallèle pour ne pas saturer la connexion
      const queue = order.slice(1);
      await Promise.all(Array.from({ length: 4 }, async () => { while (queue.length && !cancelled) await load(queue.shift()!); }));
    })();
    const ro = new ResizeObserver(() => draw());
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => { cancelled = true; ro.disconnect(); };
  }, []);

  // Léger parallaxe à la souris
  const mx = useSpring(0, { stiffness: 60, damping: 20 });
  const my = useSpring(0, { stiffness: 60, damping: 20 });
  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 18);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 12);
  };

  // Au départ, le produit laisse la place au titre (à droite sur ordinateur, plus bas sur mobile)
  const shiftX = useTransform(p, [0, T.titleOut], [desktop ? 22 : 0, 0]);
  const shiftY = useTransform(p, [0, T.titleOut], [desktop ? 4 : 9, 0]);
  const shiftXvw = useTransform(shiftX, (v) => `${v}vw`);
  const shiftYvh = useTransform(shiftY, (v) => `${v}vh`);
  const titleOpacity = useTransform(p, [0, T.titleOut * 0.8], [1, 0]);
  const titleY = useTransform(p, [0, T.titleOut], [0, -60]);
  const glow = useTransform(p, [0, T.rotateEnd, 1], [0.35, 0.6, 0.25]);
  const hintOpacity = useTransform(p, [0, 0.05], [1, 0]);
  const partsLines = useTransform(p, [T.rotateEnd, T.rotateEnd + 0.08], [0, 1]);

  return (
    <section ref={sectionRef} data-header-theme="dark" className="relative bg-[#0a0a0b] text-white" style={{ height: "520vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden" onMouseMove={onMove}>
        {/* Fond : halo + grain */}
        <motion.div style={{ opacity: glow }} className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(235,81,34,0.55),rgba(235,81,34,0.12)_55%,transparent)] blur-2xl" />
        </motion.div>
        <Embers className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22/></svg>')]" />

        {/* Produit */}
        <motion.div style={{ x: shiftXvw, y: shiftYvh }} className="absolute inset-0">
          <motion.div style={{ x: mx, y: my }} className="absolute inset-0 flex items-center justify-center">
            <canvas ref={canvasRef} className={`h-[52vh] w-full max-w-[1400px] transition-opacity duration-700 md:h-[78vh] ${ready ? "opacity-100" : "opacity-0"}`} />
          </motion.div>
        </motion.div>

        {/* Titre d'ouverture */}
        <motion.div style={{ opacity: titleOpacity, y: titleY }} className="absolute inset-x-0 top-0 pt-24 lg:pt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <SalesCounterBadge />
              <span className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-gray-200 backdrop-blur sm:inline-flex">
                🇫🇷 Marque française
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300">
                <Flame className="h-4 w-4" /> 300 000 incendies/an en France
              </span>
            </div>
            <h1 className="mt-8 max-w-4xl text-center font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-left lg:text-7xl xl:text-8xl">
              Le feu démarre
              <br />
              dans le tableau.
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Le RK01 l&apos;éteint.</span>
            </h1>
          </div>
        </motion.div>

        {/* Pied du hero : accroche + CTA (disparaît avec le titre) */}
        <motion.div style={{ opacity: titleOpacity }} className="absolute inset-x-0 bottom-0 pb-10 lg:pb-14">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <p className="hidden max-w-xl text-center text-base leading-relaxed text-gray-300 sm:block lg:text-left lg:text-lg">
              Le <span className="font-semibold text-orange-400">RK01</span>, l&apos;extincteur autonome qui protège votre maison, votre bureau, votre local 24h/24.
            </p>
            <div className="flex flex-col items-center gap-4 lg:items-end">
              <div className="flex flex-wrap justify-center gap-3">
                <CTAButton location="hero" size="large" />
                <VideoModal videoSrc="/videos/video-rk01.mp4" buttonText="Voir la démo" />
              </div>
              <div className="flex gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-400" /> Garantie 5 ans</span>
                <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-sky-400" /> Livraison 24-48h</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Indice de scroll */}
        <motion.div style={{ opacity: hintOpacity }} className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-gray-500 lg:block">
          Faites défiler
        </motion.div>

        {/* Chapitres pendant la rotation */}
        {CHAPTERS.map((c) => (
          <Fade key={c.title} p={p} at={c.at} span={0.07} className={`top-1/2 w-[min(88vw,420px)] -translate-y-1/2 ${c.side === "left" ? "left-4 sm:left-10 lg:left-[8vw]" : "right-4 text-right sm:right-10 lg:right-[8vw]"}`}>
            <p className="font-display text-3xl font-bold leading-tight sm:text-5xl">{c.title}</p>
            <p className="mt-3 text-base text-gray-300 sm:text-lg">{c.text}</p>
          </Fade>
        ))}

        {/* Vue éclatée : titre + 4 pièces */}
        <Fade p={p} at={T.rotateEnd + 0.02} span={0.36} className="left-1/2 top-20 w-[92vw] -translate-x-1/2 text-center lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-400">Vue éclatée</p>
          <p className="mt-2 font-display text-2xl font-bold sm:text-4xl">Tout est mécanique. Zéro électronique.</p>
        </Fade>
        <motion.div style={{ opacity: partsLines }} className="absolute inset-y-0 left-0 hidden w-[42%] lg:block">
          {PARTS.map((part, i) => (
            <Fade key={part.title} p={p} at={part.at} span={T.explodeEnd - part.at + 0.08} className="inset-y-0 left-[6vw] right-0">
              <div style={{ position: "absolute", top: part.y, left: 0, right: 0 }} className="flex items-center gap-4">
                <div className="w-[260px] shrink-0 text-right">
                  <p className="font-display text-xl font-bold">{part.title}</p>
                  <p className="mt-1 text-sm text-gray-400">{part.text}</p>
                </div>
                <div className="relative h-px flex-1 bg-gradient-to-r from-orange-500/80 to-orange-500/0">
                  <span className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_14px_rgba(235,81,34,0.9)]" />
                  <span className="absolute -top-3 right-0 text-xs font-semibold text-orange-400">0{i + 1}</span>
                </div>
              </div>
            </Fade>
          ))}
        </motion.div>
        {/* Mobile : les pièces défilent en bas */}
        <div className="absolute inset-x-0 bottom-8 lg:hidden">
          {PARTS.map((part, i) => (
            <Fade key={part.title} p={p} at={part.at} span={0.055} className="inset-x-5 bottom-0">
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur">
                <p className="text-xs font-semibold text-orange-400">0{i + 1}</p>
                <p className="font-display text-xl font-bold">{part.title}</p>
                <p className="mt-1 text-sm text-gray-300">{part.text}</p>
              </div>
            </Fade>
          ))}
        </div>

        {/* Fin : rappel des chiffres clés */}
        <Fade p={p} at={0.94} span={0.2} className="inset-x-0 bottom-8">
          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-4 px-4 text-center">
            {[["< 5 s", "Temps d'activation"], ["5 min", "Installation"], ["5 ans", "Durée de vie"]].map(([v, l]) => (
              <div key={l}>
                <p className="font-display text-2xl font-bold text-orange-400 sm:text-4xl">{v}</p>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">{l}</p>
              </div>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}
