"use client";

// ============================================
// REKAIRE - Fire Statistics Section (Homepage)
// ============================================

import { motion } from "framer-motion";
import { Flame, AlertTriangle, Users, Moon, Building2, Zap } from "lucide-react";

const fireStats = [
  {
    value: "300 000",
    label: "Incendies domestiques",
    sublabel: "chaque année en France",
    icon: Flame,
    color: "bg-red-500",
  },
  {
    value: "1 sur 4",
    label: "Est d'origine électrique",
    sublabel: "25-30% des incendies",
    icon: Zap,
    color: "bg-orange-500",
  },
  {
    value: "10 000",
    label: "Blessés par an",
    sublabel: "dont 70% la nuit",
    icon: Users,
    color: "bg-yellow-500",
  },
  {
    value: "500+",
    label: "Décès annuels",
    sublabel: "en France",
    icon: AlertTriangle,
    color: "bg-gray-700",
  },
];

export function FireStatsSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm font-medium mb-4">
            <Flame className="w-4 h-4" />
            Chaque année en France
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Les incendies sont une{" "}
            <span className="text-red-500">tragédie</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Un incendie domestique se déclare <strong className="text-white">toutes les 2 minutes</strong>. 
            La majorité pourrait être évitée avec une protection adaptée.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {fireStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
            >
              <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">
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

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">70%</p>
              <p className="text-indigo-200 text-sm">des incendies mortels se produisent la nuit</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">75%</p>
              <p className="text-purple-200 text-sm">des entreprises cessent leur activité après un incendie majeur</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-4">
            Le <strong className="text-orange-400">RK01</strong> protège automatiquement vos tableaux électriques 24h/24
          </p>
          <a
            href="#product"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
          >
            Découvrir la solution
          </a>
        </motion.div>
      </div>
    </section>
  );
}
