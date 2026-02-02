"use client";

// ============================================
// REKAIRE - Features Section (Light Clean)
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
    <section id="features" className="py-20 lg:py-24 bg-gray-50 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" />
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.features.title}
          </h2>
          <p className="text-lg text-gray-600">
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
                className="group relative p-6 rounded-2xl bg-white border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300"
              >
                {/* Icon */}
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-5 shadow-lg shadow-orange-500/20">
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="relative text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="relative text-sm text-gray-600 leading-relaxed">
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