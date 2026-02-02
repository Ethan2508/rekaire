"use client";

// ============================================
// REKAIRE - Fire Statistics Section (Dark Innovative)
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
  red: "from-red-500 to-red-600 shadow-red-500/30",
  amber: "from-amber-500 to-amber-600 shadow-amber-500/30",
  orange: "from-orange-500 to-orange-600 shadow-orange-500/30",
  rose: "from-rose-500 to-rose-600 shadow-rose-500/30"
};

export function FireStatsSection() {
  return (
    <section className="relative py-20 lg:py-28 bg-[#0A0A0B] overflow-hidden">
      {/* Animated Warning Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[200px] animate-pulse" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-medium text-sm">Chaque année en France</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Les incendies sont une{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              tragédie évitable
            </span>
          </h2>
          
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Un incendie domestique se déclare <strong className="text-white">toutes les 2 minutes</strong>. 
            La majorité pourrait être évitée avec une protection adaptée.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
          {fireStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-red-500/30 transition-all">
                <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <motion.p
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                >
                  {stat.value}
                </motion.p>
                <p className="text-white font-medium text-sm mb-1">
                  {stat.label}
                </p>
                <p className="text-white/50 text-xs">
                  {stat.sublabel}
                </p>
              </div>
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
          <p className="text-white/60 text-lg mb-6">
            Le <strong className="text-orange-400">RK01</strong> protège automatiquement vos tableaux électriques 24h/24
          </p>
          <motion.a
            href="#product"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
          >
            Découvrir la solution
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
