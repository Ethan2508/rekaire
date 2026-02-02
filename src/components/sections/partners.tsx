"use client";

// ============================================
// REKAIRE - Partners Section (Dark Innovative)
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
    <section className="py-16 bg-[#0A0A0B] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm mb-4">
            <Handshake className="w-4 h-4" />
            Ils nous font confiance
          </div>
        </motion.div>
        
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 group-hover:border-orange-500/30 group-hover:bg-white/10 transition-all">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.size === "large" ? 180 : 140}
                  height={partner.size === "large" ? 80 : 60}
                  className={`${partner.size === "large" ? "h-12 md:h-14" : "h-8 md:h-10"} w-auto object-contain brightness-0 invert opacity-50 group-hover:opacity-80 transition-opacity`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
