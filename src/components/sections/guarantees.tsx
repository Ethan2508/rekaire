"use client";

// ============================================
// REKAIRE - Guarantees Section (Light Theme)
// ============================================

import { motion } from "framer-motion";
import { content } from "@/config/content";
import { Shield, Truck, Headphones } from "lucide-react";

const iconMap = {
  0: Shield,
  1: Truck,
  2: Headphones,
};

export function GuaranteesSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {content.guarantees.items.map((item, index) => {
            const Icon = iconMap[index as keyof typeof iconMap] || Shield;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
