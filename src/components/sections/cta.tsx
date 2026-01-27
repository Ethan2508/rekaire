"use client";

// ============================================
// REKAIRE - Final CTA Section (Light Theme)
// ============================================

import { motion } from "framer-motion";
import { content } from "@/config/content";
import { formatPrice, PRICES } from "@/config/product";
import { CTAButton } from "@/components/cta-button";
import { Lock, Truck, Check } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {content.cta.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {content.cta.subtitle}
          </p>

          {/* Price reminder */}
          <div className="inline-block bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
            <div className="flex items-baseline justify-center gap-3 mb-2">
              <span className="text-5xl font-bold text-gray-900">
                {formatPrice(PRICES.singleHT, "EUR")}
              </span>
              <span className="text-gray-500">HT / unité</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
              <Check className="w-4 h-4" />
              <span>2 pour {formatPrice(PRICES.bulkHT, "EUR")} HT</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center mb-8">
            <CTAButton location="cta-section" size="large" />
          </div>

          {/* Trust notes */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Paiement sécurisé
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Livraison 24-48h
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
