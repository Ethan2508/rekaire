"use client";

// ============================================
// REKAIRE - Guarantees Section (Premium Design)
// ============================================

import { motion } from "framer-motion";
import { content } from "@/config/content";
import { Shield, Truck, Headphones } from "lucide-react";

const iconMap = {
  0: Shield,
  1: Truck,
  2: Headphones,
};

const colorMap = {
  0: { bg: "bg-emerald-50", icon: "text-emerald-500", border: "border-emerald-100" },
  1: { bg: "bg-orange-50", icon: "text-orange-500", border: "border-orange-100" },
  2: { bg: "bg-blue-50", icon: "text-blue-500", border: "border-blue-100" },
};

export function GuaranteesSection() {
  return (
    <section className="py-16 md:py-20 bg-white relative">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {content.guarantees.items.map((item, index) => {
            const Icon = iconMap[index as keyof typeof iconMap] || Shield;
            const colors = colorMap[index as keyof typeof colorMap] || colorMap[0];

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex items-start gap-4 p-6 rounded-2xl border ${colors.border} bg-gradient-to-br from-white to-gray-50/50 hover:shadow-lg transition-all duration-300 group`}
              >
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </section>
  );
}
