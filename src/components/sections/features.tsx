"use client";

// ============================================
// REKAIRE - Features Section (Clean Design)
// ============================================

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
    <section id="features" className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-orange-500 font-medium text-sm uppercase tracking-wider">
            Fonctionnalités
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {content.features.title}
          </h2>
          <p className="text-gray-600">
            {content.features.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.features.items.map((feature) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap] || Shield;
            
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-xl border border-gray-100 bg-white hover:border-orange-200 hover:shadow-md transition-all"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-lg bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                  <Icon className="w-5 h-5 text-orange-500" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

