"use client";

// ============================================
// REKAIRE - Features Section (Premium Design)
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
    <section id="features" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-50/50 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-orange-500 font-semibold text-sm tracking-wider uppercase mb-4"
          >
            Fonctionnalités
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.features.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {content.features.subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {content.features.items.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap] || Shield;
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white border border-gray-100 rounded-2xl p-8 hover:border-orange-200 transition-all duration-500 card-hover"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-100/0 group-hover:from-orange-50/50 group-hover:to-orange-100/30 rounded-2xl transition-all duration-500" />
                
                {/* Content */}
                <div className="relative">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-200/50 transition-all duration-500">
                    <Icon className="w-7 h-7 text-orange-500" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute inset-x-6 bottom-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
