"use client";

// ============================================
// REKAIRE - Partners Section (2 catégories)
// ============================================

import { motion } from "framer-motion";
import Image from "next/image";
import { Handshake, Users } from "lucide-react";

// Partenaires par catégorie
const partnersCategories = [
  {
    title: "Nos partenaires",
    icon: Handshake,
    partners: [
      { name: "Socoda", logo: "/images/partners/socoda.png" },
      { name: "Synexium", logo: "/images/partners/synexium.png" },
    ]
  },
  {
    title: "Ils sont protégés par le RK01",
    icon: Users,
    partners: [
      { name: "Brice Robert", logo: "/images/partners/bricerobert.webp" },
      { name: "Viva Energie", logo: "/images/partners/viva.png" },
    ]
  }
];

export function PartnersSection() {
  return (
    <section className="py-20 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-sm font-semibold mb-6">
            <Handshake className="w-5 h-5" />
            Nos partenaires de confiance
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Ils nous font confiance
          </h2>
        </motion.div>
        
        {/* Boucle sur les catégories */}
        <div className="space-y-12">
          {partnersCategories.map((category, catIndex) => (
            <div key={category.title}>
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
                className="text-xl font-semibold text-gray-700 mb-6 flex items-center justify-center gap-2"
              >
                <category.icon className="w-5 h-5 text-orange-500" />
                {category.title}
              </motion.h3>
              
              <div className="grid grid-cols-2 md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
                {category.partners.map((partner, index) => (
                  <motion.div
                    key={partner.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (catIndex * 0.2) + (index * 0.1) }}
                    className="relative group"
                  >
                    <div className="p-6 md:p-8 rounded-2xl bg-white border border-gray-200 group-hover:border-orange-300 group-hover:shadow-lg transition-all flex items-center justify-center min-h-[120px] md:min-h-[140px]">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={200}
                        height={100}
                        className="max-h-16 md:max-h-20 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
