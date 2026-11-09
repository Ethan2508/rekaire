"use client";

// ============================================
// REKAIRE - « Comment fonctionne le RK01 » : titre collant, étapes qui s'allument
// ============================================

import { motion } from "framer-motion";
import { content } from "@/config/content";
import { CTAButton } from "@/components/cta-button";

export function StepsDark() {
  const { title, subtitle, steps } = content.howItWorks;
  return (
    <section id="how-it-works" data-header-theme="dark" className="relative overflow-hidden bg-[#0a0a0b] py-24 text-white lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-400">Simple &amp; efficace</p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{title} ?</h2>
          <p className="mt-6 max-w-md text-lg text-gray-400">{subtitle}</p>
          <div className="mt-10 hidden lg:block">
            <CTAButton location="how-it-works" size="large" />
          </div>
        </div>

        <ol className="relative min-w-0 space-y-4">
          <span aria-hidden className="absolute bottom-6 left-7 top-6 w-px bg-gradient-to-b from-orange-500/0 via-orange-500/60 to-orange-500/0" />
          {steps.map((step, i) => (
            <motion.li
              key={step.number}
              initial={{ opacity: 0.35, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: "-35% 0px -35% 0px" }}
              transition={{ duration: 0.5 }}
              className="group relative flex gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition-colors hover:border-orange-500/40 sm:p-8"
            >
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 font-display text-xl font-extrabold shadow-[0_0_30px_rgba(235,81,34,0.35)]">
                {step.number}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-2xl font-bold">{step.title}</h3>
                <p className="mt-2 text-gray-400">{step.description}</p>
                {i === 2 && (
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-300">
                    170 °C · &lt; 5 secondes
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
