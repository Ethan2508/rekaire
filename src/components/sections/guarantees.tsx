"use client";

// ============================================
// REKAIRE - Guarantees Section (Light Clean)
// ============================================

import { motion } from "framer-motion";
import { content } from "@/config/content";
import { Shield, Truck, Headphones } from "lucide-react";

const iconMap = {
  0: Shield,
  1: Truck,
  2: Headphones,
};

const colors = {
  0: "from-emerald-500 to-emerald-600",
  1: "from-blue-500 to-blue-600",
  2: "from-orange-500 to-orange-600",
};

export function GuaranteesSection() {
  return (
    <section className="py-16 lg:py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          {content.guarantees.items.map((item, index) => {
            const Icon = iconMap[index as keyof typeof iconMap] || Shield;
            const gradient = colors[index as keyof typeof colors] || colors[0];

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-base mb-1">{item.title}</h3>
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
