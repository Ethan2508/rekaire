"use client";

// ============================================
// REKAIRE - Braises : particules qui montent derrière le produit
// Canvas 2D, additif, coupé hors écran et en mode « réduire les animations »
// ============================================

import { useEffect, useRef } from "react";

type Ember = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number; hue: number };

export function Embers({ className = "", density = 70 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    const embers: Ember[] = [];

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = (e?: Ember): Ember => {
      const n: Ember = e ?? ({} as Ember);
      n.x = Math.random() * w; n.y = h + 10 + Math.random() * 40;
      n.vx = (Math.random() - 0.5) * 0.25; n.vy = -(0.25 + Math.random() * 0.6);
      n.r = 0.6 + Math.random() * 1.8; n.life = 0; n.max = 260 + Math.random() * 300;
      n.hue = 18 + Math.random() * 22;
      return n;
    };
    const count = Math.round(density * Math.min(1.4, w / 1200));
    resize();
    for (let i = 0; i < count; i++) { const e = spawn(); e.y = Math.random() * h; e.life = Math.random() * e.max; embers.push(e); }

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const e of embers) {
        e.life++;
        e.x += e.vx + Math.sin((e.life + e.y) * 0.01) * 0.2; e.y += e.vy;
        if (e.life > e.max || e.y < -10) spawn(e);
        const t = e.life / e.max; const a = Math.sin(Math.PI * t) * 0.9;
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4);
        g.addColorStop(0, `hsla(${e.hue},100%,70%,${a})`);
        g.addColorStop(0.4, `hsla(${e.hue},100%,55%,${a * 0.45})`);
        g.addColorStop(1, `hsla(${e.hue},100%,50%,0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(canvas);
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    tick();
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [density]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} />;
}
