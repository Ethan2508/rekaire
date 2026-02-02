"use client";

// ============================================
// REKAIRE - Fire Statistics Section (Clean Design)
// ============================================

import { Flame, AlertTriangle, Users, Zap, ArrowRight } from "lucide-react";

const fireStats = [
  {
    value: "300 000",
    label: "Incendies domestiques",
    sublabel: "chaque année en France",
    icon: Flame,
  },
  {
    value: "1 sur 4",
    label: "Est d'origine électrique",
    sublabel: "25-30% des incendies",
    icon: Zap,
  },
  {
    value: "10 000",
    label: "Blessés par an",
    sublabel: "dont 70% la nuit",
    icon: Users,
  },
  {
    value: "500+",
    label: "Décès annuels",
    sublabel: "en France",
    icon: AlertTriangle,
  },
];

export function FireStatsSection() {
  return (
    <section className="py-16 lg:py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-red-400 font-medium text-sm uppercase tracking-wider">
            Chaque année en France
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-2 mb-4">
            Les incendies sont une <span className="text-red-400">tragédie évitable</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Un incendie domestique se déclare <strong className="text-white">toutes les 2 minutes</strong>. 
            La majorité pourrait être évitée avec une protection adaptée.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {fireStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-xl p-5 text-center"
            >
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </p>
              <p className="text-white text-sm font-medium mb-0.5">
                {stat.label}
              </p>
              <p className="text-gray-500 text-xs">
                {stat.sublabel}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Le <strong className="text-orange-400">RK01</strong> protège automatiquement vos tableaux électriques 24h/24
          </p>
          <a
            href="#product"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-colors"
          >
            Découvrir la solution
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
