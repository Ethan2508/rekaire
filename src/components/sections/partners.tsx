"use client";

// ============================================
// REKAIRE - Partners Section (Light Clean - Plus Visible)
// ============================================

import { motion } from "framer-motion";
import Image from "next/image";
import { Handshake } from "lucide-react";

const partners = [
  { name: "Synexium", logo: "/images/partners/synexium.png" },
  { name: "Viva", logo: "/images/partners/viva.png" },
  { name: "Socoda", logo: "/images/partners/socoda.png" },
  { name: "Brice Robert", logo: "/images/partners/bricerobert.webp" },
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
    </section>
  );
}
