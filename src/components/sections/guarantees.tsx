"use client";

// ============================================
// REKAIRE - Guarantees Section (Clean Design)
// ============================================

import { content } from "@/config/content";
import { Shield, Truck, Headphones } from "lucide-react";

const iconMap = {
  0: Shield,
  1: Truck,
  2: Headphones,
};

export function GuaranteesSection() {
  return (
    <section className="py-16 lg:py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          {content.guarantees.items.map((item, index) => {
            const Icon = iconMap[index as keyof typeof iconMap] || Shield;

            return (
              <div
                key={item.title}
                className="flex items-start gap-4 p-6 rounded-xl bg-gray-50"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-base mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
