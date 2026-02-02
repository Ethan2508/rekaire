"use client";

// ============================================
// REKAIRE - Specifications Section (Premium Design)
// ============================================

import { motion } from "framer-motion";
import Image from "next/image";
import { getMainProduct } from "@/config/product";
import { CheckCircle2 } from "lucide-react";

export function SpecificationsSection() {
  const product = getMainProduct();

  return (
    <section id="specifications" className="py-24 md:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block text-orange-500 font-semibold text-sm tracking-wider uppercase mb-4"
            >
              Fiche technique
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Spécifications techniques
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Le RK01 est conçu pour une protection maximale avec une simplicité d&apos;utilisation totale.
            </p>

            {/* Specs table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden">
              {Object.entries(product.specifications).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex justify-between items-center px-6 py-4 ${
                    index !== Object.entries(product.specifications).length - 1 ? 'border-b border-gray-100' : ''
                  } hover:bg-orange-50/50 transition-colors`}
                >
                  <span className="text-gray-600 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-400" />
                    {key}
                  </span>
                  <span className="text-gray-900 font-semibold">{value}</span>
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
            <div className="relative max-w-md mx-auto">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200/30 to-orange-100/20 rounded-3xl blur-3xl scale-110" />
              
              {/* Exploded view diagram */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-8 shadow-2xl shadow-gray-200/50">
                <div className="space-y-6">
                  {/* Part 1 - Top */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-orange-50/50 transition-colors group"
                  >
                    <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                      <Image
                        src="/images/product/rk01-part1.png"
                        alt="RK01 - Capuchon"
                        width={100}
                        height={100}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Capuchon protecteur</p>
                      <p className="text-gray-500 text-sm">Résistant à la chaleur</p>
                    </div>
                  </motion.div>

                  {/* Part 2 */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-orange-50/50 transition-colors group"
                  >
                    <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                      <Image
                        src="/images/product/rk01-part2.png"
                        alt="RK01 - Mécanisme"
                        width={100}
                        height={100}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Mécanisme de déclenchement</p>
                      <p className="text-gray-500 text-sm">Activation à 90°C</p>
                    </div>
                  </motion.div>

                  {/* Part 3 */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-orange-50/50 transition-colors group"
                  >
                    <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                      <Image
                        src="/images/product/rk01-part3.png"
                        alt="RK01 - Réservoir"
                        width={100}
                        height={100}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Agent extincteur</p>
                      <p className="text-gray-500 text-sm">Efficace sur feux électriques</p>
                    </div>
                  </motion.div>

                  {/* Part 4 - Bottom */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-orange-50/50 transition-colors group"
                  >
                    <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                      <Image
                        src="/images/product/rk01-part4.png"
                        alt="RK01 - Base"
                        width={100}
                        height={100}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Support de fixation</p>
                      <p className="text-gray-500 text-sm">Adhésif haute résistance</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
