"use client";

// ============================================
// REKAIRE - Specifications Section (Light Clean)
// ============================================

import { motion } from "framer-motion";
import Image from "next/image";
import { getMainProduct } from "@/config/product";
import { CheckCircle2, Sparkles } from "lucide-react";

export function SpecificationsSection() {
  const product = getMainProduct();

  const parts = [
    {
      src: "/images/product/rk01-part1.png",
      alt: "RK01 - Capuchon",
      title: "Capuchon protecteur",
      desc: "Résistant à la chaleur",
      color: "orange"
    },
    {
      src: "/images/product/rk01-part2.png",
      alt: "RK01 - Mécanisme",
      title: "Mécanisme de déclenchement",
      desc: "Activation à 170°C",
      color: "blue"
    },
    {
      src: "/images/product/rk01-part3.png",
      alt: "RK01 - Réservoir",
      title: "Agent extincteur",
      desc: "Efficace sur feux électriques",
      color: "emerald"
    },
    {
      src: "/images/product/rk01-part4.png",
      alt: "RK01 - Base",
      title: "Support de fixation",
      desc: "Adhésif haute résistance",
      color: "purple"
    }
  ];

  const colorClasses = {
    orange: "bg-orange-50 border-orange-200 hover:border-orange-300",
    blue: "bg-blue-50 border-blue-200 hover:border-blue-300",
    emerald: "bg-emerald-50 border-emerald-200 hover:border-emerald-300",
    purple: "bg-purple-50 border-purple-200 hover:border-purple-300"
  };

  return (
    <section id="specifications" className="relative py-20 lg:py-24 bg-gray-50 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 mb-6">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 font-medium text-sm">Fiche technique</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Spécifications{" "}
              <span className="text-orange-500">techniques</span>
            </h2>
            
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Le RK01 est conçu pour une protection maximale avec une simplicité d&apos;utilisation totale.
            </p>

            {/* Specs table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {Object.entries(product.specifications).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className={`flex justify-between items-center px-6 py-4 ${
                    index !== Object.entries(product.specifications).length - 1 ? 'border-b border-gray-100' : ''
                  } hover:bg-gray-50 transition-colors`}
                >
                  <span className="text-gray-600 text-sm flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-orange-500" />
                    {key}
                  </span>
                  <span className="text-gray-900 font-medium text-sm">{value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual - Exploded view */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex items-start"
          >
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm w-full">
              <div className="space-y-3">
                {parts.map((part, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`flex items-center gap-4 p-4 rounded-xl ${colorClasses[part.color as keyof typeof colorClasses]} border transition-all cursor-default min-h-[88px]`}
                  >
                    <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Image
                        src={part.src}
                        alt={part.alt}
                        width={80}
                        height={80}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{part.title}</p>
                      <p className="text-gray-500 text-sm">{part.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
