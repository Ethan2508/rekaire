"use client";

// ============================================
// REKAIRE - Fire Statistics Section (Light Clean)
// ============================================

import { motion } from "framer-motion";
import { Flame, AlertTriangle, Users, Zap, ArrowRight, ShieldAlert } from "lucide-react";

const fireStats = [
  {
    value: "300 000",
    label: "Incendies domestiques",
    sublabel: "chaque année en France",
    icon: Flame,
    color: "red"
  },
  {
    value: "1 sur 4",
    label: "Est d'origine électrique",
    sublabel: "25-30% des incendies",
    icon: Zap,
    color: "amber"
  },
  {
    value: "10 000",
    label: "Blessés par an",
    sublabel: "dont 70% la nuit",
    icon: Users,
    color: "orange"
  },
  {
    value: "500+",
    label: "Décès annuels",
    sublabel: "en France",
    icon: AlertTriangle,
    color: "rose"
  },
];

const colorClasses = {
  red: "from-red-500 to-red-600",
  amber: "from-amber-500 to-amber-600",
  orange: "from-orange-500 to-orange-600",
  rose: "from-rose-500 to-rose-600"
};

export function FireStatsSection() {
  return (
    <section className="relative py-20 lg:py-24 bg-gray-900 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 mb-6">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-medium text-sm">Chaque année en France</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Les incendies domestiques :{" "}
            <span className="text-red-400">un danger réel</span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            En France, <strong className="text-white">1 incendie se déclenche toutes les 2 minutes</strong>. 
            La majorité pourrait être évitée avec une protection adaptée.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
          {fireStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </p>
              <p className="text-white font-medium text-sm mb-1">
                {stat.label}
              </p>
              <p className="text-gray-500 text-xs">
                {stat.sublabel}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-400 text-lg mb-6">
            Le <strong style={{ color: '#eb5122' }}>RK01</strong> protège automatiquement vos tableaux électriques 24h/24
          </p>
          <motion.a
            href="#product"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-colors"
          >
            Découvrir la solution
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
