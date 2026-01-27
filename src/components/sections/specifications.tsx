"use client";

// ============================================
// REKAIRE - Specifications Section (Light Theme)
// ============================================

import { motion } from "framer-motion";
import Image from "next/image";
import { getMainProduct } from "@/config/product";

export function SpecificationsSection() {
  const product = getMainProduct();

  return (
    <section id="specifications" className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Spécifications techniques
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Le RK01 est conçu pour une protection maximale avec une simplicité d&apos;utilisation totale.
            </p>

            {/* Specs table */}
            <div className="space-y-4">
              {Object.entries(product.specifications).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex justify-between items-center py-3 border-b border-gray-200"
                >
                  <span className="text-gray-600">{key}</span>
                  <span className="text-gray-900 font-medium">{value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual - Exploded view */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative max-w-md mx-auto">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-200/30 to-orange-300/30 rounded-3xl blur-2xl" />
              
              {/* Exploded view diagram */}
              <div className="relative bg-white rounded-3xl border border-gray-200 p-8 shadow-xl">
                <div className="space-y-4">
                  {/* Part 1 - Top */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-4"
                  >
                    <Image
                      src="/images/product/rk01-part1.png"
                      alt="RK01 - Capuchon"
                      width={100}
                      height={100}
                      className="w-20 h-20 object-contain"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Capuchon protecteur</p>
                      <p className="text-gray-500">Résistant à la chaleur</p>
                    </div>
                  </motion.div>

                  {/* Part 2 */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-4"
                  >
                    <Image
                      src="/images/product/rk01-part2.png"
                      alt="RK01 - Mécanisme"
                      width={100}
                      height={100}
                      className="w-20 h-20 object-contain"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Mécanisme de déclenchement</p>
                      <p className="text-gray-500">Activation à 90°C</p>
                    </div>
                  </motion.div>

                  {/* Part 3 */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-4"
                  >
                    <Image
                      src="/images/product/rk01-part3.png"
                      alt="RK01 - Réservoir"
                      width={100}
                      height={100}
                      className="w-20 h-20 object-contain"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Agent extincteur</p>
                      <p className="text-gray-500">Efficace sur feux électriques</p>
                    </div>
                  </motion.div>

                  {/* Part 4 - Bottom */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-4"
                  >
                    <Image
                      src="/images/product/rk01-part4.png"
                      alt="RK01 - Base"
                      width={100}
                      height={100}
                      className="w-20 h-20 object-contain"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Support de fixation</p>
                      <p className="text-gray-500">Adhésif haute résistance</p>
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
