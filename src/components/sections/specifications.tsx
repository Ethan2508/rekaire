"use client";

// ============================================
// REKAIRE - Specifications Section (Dark Innovative)
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
      desc: "Activation à 90°C",
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
    orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30",
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    emerald: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30"
  };

  return (
    <section id="specifications" className="relative py-20 lg:py-28 bg-[#0A0A0B] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-medium text-sm">Fiche technique</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Spécifications{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                techniques
              </span>
            </h2>
            
            <p className="text-white/60 text-lg mb-10 leading-relaxed">
              Le RK01 est conçu pour une protection maximale avec une simplicité d&apos;utilisation totale.
            </p>

            {/* Specs table */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              {Object.entries(product.specifications).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className={`flex justify-between items-center px-6 py-4 ${
                    index !== Object.entries(product.specifications).length - 1 ? 'border-b border-white/5' : ''
                  } hover:bg-white/5 transition-colors`}
                >
                  <span className="text-white/60 text-sm flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-orange-400" />
                    {key}
                  </span>
                  <span className="text-white font-medium text-sm">{value}</span>
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
            className="relative"
          >
            <div className="bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <div className="space-y-4">
                {parts.map((part, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className={`flex items-center gap-5 p-4 rounded-xl bg-gradient-to-r ${colorClasses[part.color as keyof typeof colorClasses]} border transition-all cursor-default`}
                  >
                    <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Image
                        src={part.src}
                        alt={part.alt}
                        width={80}
                        height={80}
                        className="w-10 h-10 object-contain brightness-0 invert"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{part.title}</p>
                      <p className="text-white/50 text-sm">{part.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Decorative line */}
              <div className="absolute left-[60px] top-[100px] bottom-[100px] w-[2px] bg-gradient-to-b from-orange-500/0 via-orange-500/30 to-orange-500/0 hidden lg:block" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
