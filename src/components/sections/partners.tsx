"use client";

// ============================================
// REKAIRE - Partners Section (Premium Design)
// ============================================

import { motion } from "framer-motion";
import Image from "next/image";
import { Handshake } from "lucide-react";

const partners = [
  { name: "Synexium", logo: "/images/partners/synexium.png", size: "large" },
  { name: "Viva", logo: "/images/partners/viva.png", size: "large" },
  { name: "Socoda", logo: "/images/partners/socoda.png", size: "normal" },
  { name: "Brice Robert", logo: "/images/partners/bricerobert.webp", size: "normal" },
];

export function PartnersSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium mb-4">
            <Handshake className="w-4 h-4" />
            Ils nous font confiance
          </div>
          <p className="text-gray-500 max-w-lg mx-auto">
            Rekaire collabore avec les leaders de l&apos;industrie pour garantir la meilleure protection.
          </p>
        </motion.div>

        {/* Partners logos with premium styling */}
        <div className="relative">
          {/* Decorative gradient lines */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-transparent to-gray-200" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-l from-transparent to-gray-200" />
          
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 py-8 px-4">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200/0 to-orange-300/0 group-hover:from-orange-200/20 group-hover:to-orange-300/20 rounded-2xl blur-xl transition-all duration-500" />
                
                <div className="relative p-4 rounded-2xl bg-white border border-gray-100 shadow-sm group-hover:shadow-lg group-hover:border-orange-200/50 transition-all duration-300">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={partner.size === "large" ? 220 : 180}
                    height={partner.size === "large" ? 100 : 80}
                    className={`${partner.size === "large" ? "h-16 md:h-20" : "h-12 md:h-16"} w-auto object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
