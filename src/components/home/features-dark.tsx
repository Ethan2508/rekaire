"use client";

// ============================================
// REKAIRE - Fonctionnalités clés : grille « bento » sombre avec vues 3D du produit
// ============================================

import Image from "next/image";
import { motion } from "framer-motion";
import { content } from "@/config/content";
import { Flame, Plug, Clock, Shield, Zap, Target } from "lucide-react";

const iconMap = { flame: Flame, plug: Plug, clock: Clock, shield: Shield, zap: Zap, target: Target } as const;

// Les deux premières cartes sont larges et illustrées par un rendu 3D
const ART: Record<number, { src: string; alt: string }> = {
  0: { src: "/images/product/angles/rk01-angle-rapproche.webp", alt: "RK01 vu de près" },
  1: { src: "/images/product/angles/rk01-angle-3-4.webp", alt: "RK01 de trois quarts" },
};

export function FeaturesDark() {
  return (
    <section id="features" data-header-theme="dark" className="relative bg-[#0a0a0b] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-400">Fonctionnalités</p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{content.features.title}</h2>
        </motion.div>

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          {content.features.items.map((item, i) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Shield;
            const art = ART[i];
            const wide = i < 2;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.08 }}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7 transition-colors hover:border-orange-500/40 ${wide ? "md:col-span-3 min-h-[360px]" : "md:col-span-2"}`}
              >
                <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-orange-500/0 blur-3xl transition-colors duration-700 group-hover:bg-orange-500/20" />
                {art && (
                  <Image
                    src={art.src}
                    alt={art.alt}
                    width={885}
                    height={664}
                    className="pointer-events-none absolute -bottom-6 -right-6 w-[62%] opacity-90 drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-105"
                  />
                )}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className={`relative mt-6 font-display font-bold ${wide ? "max-w-[60%] text-2xl sm:text-3xl" : "text-xl"}`}>{item.title}</h3>
                <p className={`relative mt-3 text-gray-400 ${wide ? "max-w-[58%]" : ""}`}>{item.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
