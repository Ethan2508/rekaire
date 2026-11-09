"use client";

// ============================================
// REKAIRE - Fonctionnalités clés : grille « bento » sombre
// 1 grande carte illustrée (rendu 3D) + 5 cartes, chacune avec son chiffre clé en filigrane
// ============================================

import Image from "next/image";
import { motion } from "framer-motion";
import { content } from "@/config/content";
import { Flame, Plug, Clock, Shield, Zap, Target } from "lucide-react";

const iconMap = { flame: Flame, plug: Plug, clock: Clock, shield: Shield, zap: Zap, target: Target } as const;

// Chiffre clé affiché en grand derrière chaque carte (dans l'ordre de content.features.items)
const FIGURES = ["170 °C", "0 W", "30 s", "5 ans", "230 V", "0,1 m³"];

export function FeaturesDark() {
  return (
    <section id="features" data-header-theme="dark" className="relative bg-[#0a0a0b] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-400">Fonctionnalités</p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{content.features.title}</h2>
          </div>
          <p className="max-w-sm text-gray-400">Un seul geste à la pose, puis plus rien à faire pendant 5 ans : le RK01 veille et agit seul.</p>
        </motion.div>

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          {content.features.items.map((item, i) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Shield;
            const hero = i === 0;
            const last = i === content.features.items.length - 1; // carte large, image à gauche
            const wide = hero || last;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.08 }}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7 transition-colors hover:border-orange-500/40 sm:p-8 ${hero ? "md:col-span-4 md:min-h-[380px]" : last ? "md:col-span-6 md:min-h-[300px]" : "md:col-span-2 md:min-h-[300px]"}`}
              >
                {/* Lueur au survol */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/0 blur-3xl transition-colors duration-700 group-hover:bg-orange-500/20" />

                {hero ? (
                  <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[55%] items-center justify-center md:flex">
                    <div className="absolute h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
                    <Image
                      src="/images/product/angles/rk01-angle-rapproche.webp"
                      alt="RK01 vu de près"
                      width={885}
                      height={664}
                      className="relative w-[92%] drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-[1.04]"
                    />
                  </div>
                ) : last ? (
                  <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[48%] items-center justify-center md:flex">
                    <div className="absolute h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />
                    <Image
                      src="/images/product/angles/rk01-angle-3-4.webp"
                      alt="RK01 de trois quarts"
                      width={885}
                      height={664}
                      className="relative w-[78%] drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-[1.04]"
                    />
                  </div>
                ) : (
                  <span aria-hidden className="pointer-events-none absolute -bottom-4 right-5 select-none font-display text-[88px] font-extrabold leading-none tracking-tight text-white/[0.05] transition-colors duration-500 group-hover:text-orange-500/15 sm:text-[104px]">
                    {FIGURES[i]}
                  </span>
                )}

                <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 text-orange-400 ${last ? "md:ml-[52%]" : ""}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className={`relative mt-auto pt-10 ${hero ? "md:max-w-[45%]" : last ? "md:ml-[52%] md:max-w-[44%]" : "max-w-[85%]"}`}>
                  {wide && <p className="mb-3 font-display text-5xl font-extrabold text-orange-400 sm:text-6xl">{FIGURES[i]}</p>}
                  <h3 className={`font-display font-bold leading-tight ${hero ? "text-2xl sm:text-3xl" : "text-xl"}`}>{item.title}</h3>
                  <p className="mt-3 text-gray-400">{item.description}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
