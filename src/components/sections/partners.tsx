"use client";

// ============================================
// REKAIRE - Partners Section (2 catégories avec carrousel)
// ============================================

import { motion } from "framer-motion";
import Image from "next/image";
import { Handshake, Users } from "lucide-react";
import { useEffect, useState } from "react";

// Partenaires distributeurs
const distributors = [
  { name: "Socoda", logo: "/images/partners/socoda.png" },
  { name: "Synexium", logo: "/images/partners/synexium.png" },
];

// Clients protégés par le RK01
const protectedClients = [
  { name: "Brice Robert", logo: "/images/partners/bricerobert.webp" },
  { name: "Viva Energie", logo: "/images/partners/viva.png" },
  { name: "Atalian", logo: "/images/partners/atalian.png" },
  { name: "Engie", logo: "/images/partners/engie-logo.png" },
  { name: "Eurodis", logo: "/images/partners/eurodis-logo.jpg" },
  { name: "Ideal Pneu", logo: "/images/partners/idealpneu-logo.png" },
  { name: "IKKS", logo: "/images/partners/ikks-logo.png" },
  { name: "Socotec", logo: "/images/partners/SOCOTEC-LOGO.png" },
  { name: "Sonepar", logo: "/images/partners/sonepar-logo.png" },
  { name: "Speedy", logo: "/images/partners/speedy-logo.png" },
  { name: "Uber", logo: "/images/partners/uber-logo.png" },
  { name: "Yamada", logo: "/images/partners/yamada-logo.png" },
  { name: "Yesss Electrique", logo: "/images/partners/YESSS-ELECTRIQUE-logo.png" },
];

export function PartnersSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4; // 4 logos visibles à la fois sur desktop
  const totalSlides = Math.ceil(protectedClients.length / itemsPerView);

  // Auto-rotation du carrousel toutes les 4 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(interval);
  }, [totalSlides]);

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
        
        {/* Nos partenaires distributeurs */}
        <div className="mb-16">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl font-semibold text-gray-700 mb-6 flex items-center justify-center gap-2"
          >
            <Handshake className="w-5 h-5 text-orange-500" />
            Nos partenaires
          </motion.h3>
          
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
            {distributors.map((partner, index) => (
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

        {/* Clients protégés - Carrousel */}
        <div>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl font-semibold text-gray-700 mb-6 flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5 text-orange-500" />
            Ils sont protégés par le RK01
          </motion.h3>

          {/* Carrousel */}
          <div className="relative overflow-hidden">
            <motion.div 
              className="flex gap-6"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="min-w-full grid grid-cols-2 md:grid-cols-4 gap-6">
                  {protectedClients
                    .slice(slideIndex * itemsPerView, (slideIndex + 1) * itemsPerView)
                    .map((client) => (
                      <motion.div
                        key={client.name}
                        className="relative group"
                      >
                        <div className="p-4 md:p-6 rounded-2xl bg-white border border-gray-200 group-hover:border-orange-300 group-hover:shadow-lg transition-all flex items-center justify-center min-h-[100px] md:min-h-[120px]">
                          <Image
                            src={client.logo}
                            alt={client.name}
                            width={150}
                            height={80}
                            className="max-h-12 md:max-h-16 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </motion.div>
                    ))}
                </div>
              ))}
            </motion.div>

            {/* Indicateurs de pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? "w-8 bg-orange-500" 
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
