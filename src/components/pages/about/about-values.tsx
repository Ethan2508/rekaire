"use client";

// ============================================
// REKAIRE - About Values Section
// ============================================

import { motion } from "framer-motion";
import { Lightbulb, Heart, Leaf, Award } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Nous développons des solutions technologiques simples mais efficaces, accessibles à tous.",
  },
  {
    icon: Heart,
    title: "Engagement",
    description: "La sécurité de nos clients est notre priorité absolue. Chaque produit est testé et certifié.",
  },
  {
    icon: Leaf,
    title: "Responsabilité",
    description: "Nos produits sont conçus pour être écologiques, sans produits chimiques nocifs.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Nous visons l'excellence dans tout ce que nous faisons, de la conception au service client.",
  },
];

export function AboutValues() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos valeurs
          </h2>
          <p className="text-lg text-gray-600">
            Les principes qui guident notre travail au quotidien.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4 mx-auto">
                <value.icon className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
