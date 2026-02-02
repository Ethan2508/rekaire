"use client";

// ============================================
// REKAIRE - Fire Statistics Section (Premium Design)
// ============================================

import { motion } from "framer-motion";
import { Flame, AlertTriangle, Users, Moon, Building2, Zap, ArrowRight } from "lucide-react";

const fireStats = [
  {
    value: "300 000",
    label: "Incendies domestiques",
    sublabel: "chaque année en France",
    icon: Flame,
    color: "from-red-500 to-red-600",
    shadow: "shadow-red-500/30",
  },
  {
    value: "1 sur 4",
    label: "Est d'origine électrique",
    sublabel: "25-30% des incendies",
    icon: Zap,
    color: "from-orange-500 to-orange-600",
    shadow: "shadow-orange-500/30",
  },
  {
    value: "10 000",
    label: "Blessés par an",
    sublabel: "dont 70% la nuit",
    icon: Users,
    color: "from-amber-500 to-amber-600",
    shadow: "shadow-amber-500/30",
  },
  {
    value: "500+",
    label: "Décès annuels",
    sublabel: "en France",
    icon: AlertTriangle,
    color: "from-gray-600 to-gray-700",
    shadow: "shadow-gray-500/30",
  },
];

export function FireStatsSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold mb-6"
          >
            <Flame className="w-4 h-4" />
            Chaque année en France
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Les incendies sont une{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              tragédie évitable
            </span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Un incendie domestique se déclare <strong className="text-white">toutes les 2 minutes</strong>. 
            La majorité pourrait être évitée avec une protection adaptée.
          </p>
        </motion.div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-14">
          {fireStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 text-center group hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity blur-xl`} />
              
              <div className={`relative w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 ${stat.shadow} shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <p className="relative text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </p>
              <p className="relative text-white font-medium text-sm mb-1">
                {stat.label}
              </p>
              <p className="relative text-gray-500 text-xs">
                {stat.sublabel}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional Stats - Premium Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-4 md:gap-6"
        >
          <div className="relative bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-6 flex items-center gap-5 overflow-hidden group hover:border-indigo-500/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
              <Moon className="w-7 h-7 text-white" />
            </div>
            <div className="relative">
              <p className="text-2xl md:text-3xl font-bold text-white">70%</p>
              <p className="text-indigo-200 text-sm">des incendies mortels se produisent la nuit</p>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 flex items-center gap-5 overflow-hidden group hover:border-purple-500/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div className="relative">
              <p className="text-2xl md:text-3xl font-bold text-white">75%</p>
              <p className="text-purple-200 text-sm">des entreprises cessent leur activité après un incendie majeur</p>
            </div>
          </div>
        </motion.div>

        {/* CTA - Premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-14"
        >
          <p className="text-gray-400 mb-6 text-lg">
            Le <strong className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">RK01</strong> protège automatiquement vos tableaux électriques 24h/24
          </p>
          <motion.a
            href="#product"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-full transition-all shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40"
          >
            Découvrir la solution
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
