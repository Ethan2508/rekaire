"use client";

// ============================================
// REKAIRE - CTA Section (Clean Design)
// ============================================

import { content } from "@/config/content";
import { formatPrice, PRICES } from "@/config/product";
import { CTAButton } from "@/components/cta-button";
import { Lock, Truck, Shield } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 lg:py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
          {content.cta.title}
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 max-w-xl mx-auto mb-8">
          {content.cta.subtitle}
        </p>

        {/* Price */}
        <div className="mb-4">
          <span className="text-4xl md:text-5xl font-bold text-white">
            {formatPrice(PRICES.singleHT, "EUR")}
          </span>
          <span className="text-gray-400 ml-2">HT / unité</span>
        </div>
        
        <p className="text-emerald-400 text-sm mb-8">
          2 pour {formatPrice(PRICES.bulkHT, "EUR")} HT — Économisez 10%
        </p>

        {/* CTA Button */}
        <div className="flex justify-center mb-10">
          <CTAButton location="cta-section" size="large" />
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Paiement sécurisé</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-orange-400" />
            <span>Livraison 24-48h</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Garantie 2 ans</span>
          </div>
        </div>
      </div>
    </section>
  );
}
