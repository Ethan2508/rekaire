"use client";

// ============================================
// REKAIRE - Features Section (Dark Innovative)
// ============================================

import { motion } from "framer-motion";
import { content } from "@/config/content";
import { Flame, Plug, Clock, Shield, Zap, Target } from "lucide-react";

const iconMap = {
  flame: Flame,
  plug: Plug,
  clock: Clock,
  shield: Shield,
  zap: Zap,
  target: Target,
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-[#0A0A0B] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" />
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {content.features.title}
          </h2>
          <p className="text-lg text-white/60">
            {content.features.subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.features.items.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap] || Shield;
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 transition-all" />

                {/* Icon */}
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-5 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="relative text-lg font-semibold text-white mb-3 group-hover:text-orange-50 transition-colors">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="relative text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

