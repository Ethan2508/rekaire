"use client";

// ============================================
// REKAIRE - About Mission Section
// ============================================

import { motion } from "framer-motion";
import { Flame, Shield, Users, AlertTriangle, Moon, Building2 } from "lucide-react";

const fireStats = [
  {
    value: "300 000",
    label: "Incendies domestiques par an en France",
    icon: Flame,
    color: "bg-red-100 text-red-500",
  },
  {
    value: "25-30%",
    label: "Sont d'origine électrique",
    icon: AlertTriangle,
    color: "bg-orange-100 text-orange-500",
  },
  {
    value: "~10 000",
    label: "Blessés chaque année",
    icon: Users,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    value: "500+",
    label: "Décès par an",
    icon: Shield,
    color: "bg-gray-100 text-gray-600",
  },
  {
    value: "70%",
    label: "Se produisent la nuit",
    icon: Moon,
    color: "bg-indigo-100 text-indigo-500",
  },
  {
    value: "75%",
    label: "Des entreprises cessent leur activité après un incendie majeur",
    icon: Building2,
    color: "bg-purple-100 text-purple-500",
  },
];

export function AboutMission() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-4">
              Chaque année en France
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Les incendies sont une <span className="text-red-500">tragédie</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {fireStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500 leading-tight">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 text-gray-500 text-sm"
          >
            Un incendie domestique se déclare <strong className="text-gray-700">toutes les 2 minutes</strong> en France.
          </motion.p>

          {/* Sources */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 bg-white rounded-xl border border-gray-200"
          >
            <p className="text-xs text-gray-400 text-center">
              <strong className="text-gray-500">Sources :</strong> INSEE, Ministère de l&apos;Intérieur, ONSE (Observatoire National de la Sécurité Électrique), 
              Direction Générale de la Sécurité Civile et de la Gestion des Crises (DGSCGC), Fédération Française de l&apos;Assurance (FFA).
            </p>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Notre mission
            </h2>
            
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                Chaque année en France, <strong className="text-gray-900">1 incendie sur 4 est d&apos;origine électrique</strong>. 
                Ces accidents, souvent évitables, causent des milliers de blessés et des centaines de décès.
              </p>
              
              <p>
                Chez Rekaire, nous avons développé le <strong className="text-gray-900">RK01</strong> pour offrir une solution 
                préventive simple et accessible. Pas de maintenance, pas de surveillance constante, 
                juste une protection automatique qui veille sur vos installations 24h/24.
              </p>
              
              <p>
                Notre ambition : rendre la sécurité incendie aussi simple que de fermer une porte à clé.
              </p>
            </div>
          </motion.div>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6"
          >
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">5 ans</p>
                  <p className="text-sm text-gray-700">De protection continue sans aucune maintenance</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">10 000+</p>
                  <p className="text-sm text-gray-600">Foyers et entreprises protégés par Rekaire</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">170°C</p>
                  <p className="text-sm text-gray-600">Activation automatique - aucune intervention requise</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
