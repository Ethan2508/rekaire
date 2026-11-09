"use client";

// ============================================
// REKAIRE - Spécifications, version sombre : fiche technique + vue éclatée
// ============================================

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getMainProduct } from "@/config/product";

export function SpecsDark() {
  const product = getMainProduct();
  const specs = Object.entries(product.specifications);
  return (
    <section id="specifications" data-header-theme="dark" className="relative overflow-hidden bg-[#0a0a0b] py-24 text-white lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/15 blur-3xl" />
          <Image
            src="/images/product/angles/rk01-vue-eclatee.webp"
            alt="Vue éclatée du RK01"
            width={1396}
            height={1047}
            className="relative w-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.7)]"
          />
          <p className="mt-4 text-center text-sm text-gray-500">Rendu 3D du RK01 : boîtier, mécanisme, agent extincteur, support adhésif</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-400">Spécifications techniques</p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">Tout ce qu&apos;il faut savoir sur le RK01</h2>
          <dl className="mt-10 divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            {specs.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-6 px-6 py-4">
                <dt className="text-gray-400">{k}</dt>
                <dd className="text-right font-semibold tabular-nums text-white">{v}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-6 grid gap-2 text-sm text-gray-300 sm:grid-cols-2">
            {["Marqué CE", "Garantie 5 ans", "Fabriqué en Roumanie, assemblé en France", "Aucun entretien"].map((t) => (
              <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> {t}</li>
            ))}
          </ul>
          <Link href="/produit" className="mt-8 inline-flex items-center gap-2 font-semibold text-orange-400 hover:text-orange-300">
            Voir la fiche produit complète <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
