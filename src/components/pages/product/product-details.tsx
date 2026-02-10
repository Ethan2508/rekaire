"use client";

// ============================================
// REKAIRE - Product Details Section
// ============================================

import { motion } from "framer-motion";
import Image from "next/image";
import { Flame, Droplets, Timer, Settings } from "lucide-react";

const features = [
  {
    icon: Flame,
    title: "Détection thermique automatique",
    description: "Le RK01 se déclenche automatiquement lorsque la température atteint 170°C. Aucune intervention humaine nécessaire, aucune source d'énergie requise.",
  },
  {
    icon: Droplets,
    title: "Agent extincteur écologique",
    description: "Utilise un agent extincteur non toxique, sans résidu, efficace sur les feux d'origine électrique (classe E). Ne nécessite aucun nettoyage après déclenchement.",
  },
  {
    icon: Timer,
    title: "Réaction en quelques secondes",
    description: "Le temps de réaction ultra-rapide permet d'éteindre le départ de feu avant qu'il ne se propage. Protection efficace même en votre absence.",
  },
  {
    icon: Settings,
    title: "Installation simple",
    description: "Fixation par adhésif haute résistance inclus. Installation en 2 minutes, sans outils, sans raccordement électrique. Compatible avec tous types de tableaux.",
  },
];

export function ProductDetails() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comment fonctionne le RK01 ?
          </h2>
          <p className="text-lg text-gray-600">
            Une technologie éprouvée pour une protection maximale de vos installations électriques.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-5 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
                <feature.icon className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Exploded View */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-2xl p-8 md:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Anatomie du RK01
              </h3>
              <p className="text-gray-600 mb-6">
                Chaque composant du RK01 a été conçu pour garantir une fiabilité maximale 
                et une efficacité optimale en cas de départ de feu.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">1</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Boîtier</h4>
                    <p className="text-sm text-gray-600">Fond à 170°C pour déclencher l'agent extincteur</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">2</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Mécanisme de déclenchement</h4>
                    <p className="text-sm text-gray-600">Activation automatique à 170°C</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">3</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Agent extincteur</h4>
                    <p className="text-sm text-gray-600">Formule écologique efficace sur feux électriques</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">4</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Support de fixation</h4>
                    <p className="text-sm text-gray-600">Adhésif haute résistance fourni</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((num) => (
                  <motion.div
                    key={num}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: num * 0.1 }}
                    className="flex justify-center"
                  >
                    <Image
                      src={`/images/product/rk01-part${num}.png`}
                      alt={`RK01 composant ${num}`}
                      width={200}
                      height={200}
                      className="h-19 w-auto object-contain"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
