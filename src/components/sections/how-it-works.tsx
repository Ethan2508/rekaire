"use client";

// ============================================
// REKAIRE - How It Works Section (Dark Innovative)
// ============================================

import { motion } from "framer-motion";
import { content } from "@/config/content";
import { Sparkles } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-gradient-to-b from-[#0A0A0B] via-[#0f0f10] to-[#0A0A0B] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-orange-400" />
            Simple & Efficace
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {content.howItWorks.title}
          </h2>
          <p className="text-lg text-white/60">
            {content.howItWorks.subtitle}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.howItWorks.steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Connector line */}
              {index < content.howItWorks.steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px">
                  <div className="w-full h-full bg-gradient-to-r from-orange-500/50 to-orange-500/10" />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 origin-left"
                  />
                </div>
              )}
              
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 hover:bg-white/10 transition-all h-full overflow-hidden">
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/10 group-hover:to-transparent rounded-2xl transition-all" />
                
                {/* Number */}
                <div className="relative w-16 h-16 mb-5">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                  <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-orange-500/30">
                    {step.number}
                  </div>
                </div>
                
                <h3 className="relative text-lg font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="relative text-sm text-white/50 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

