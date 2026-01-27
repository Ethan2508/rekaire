"use client";

// ============================================
// REKAIRE - Partners Section
// ============================================

import { motion } from "framer-motion";
import Image from "next/image";

const partners = [
  { name: "Synexium", logo: "/images/partners/synexium.png", size: "large" },
  { name: "Viva", logo: "/images/partners/viva.png", size: "large" },
  { name: "Socoda", logo: "/images/partners/socoda.png", size: "normal" },
  { name: "Brice Robert", logo: "/images/partners/bricerobert.webp", size: "normal" },
];

export function PartnersSection() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Nos partenaires de confiance
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={partner.size === "large" ? 220 : 180}
                height={partner.size === "large" ? 100 : 80}
                className={`${partner.size === "large" ? "h-20 md:h-28" : "h-16 md:h-20"} w-auto object-contain`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
