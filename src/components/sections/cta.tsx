"use client";

// ============================================
// REKAIRE - Final CTA Section (Premium Design)
// ============================================

import { motion } from "framer-motion";
import { content } from "@/config/content";
import { formatPrice, PRICES } from "@/config/product";
import { CTAButton } from "@/components/cta-button";
import { Lock, Truck, Check, Star, Shield } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-8"
          >
            <Star className="w-4 h-4" />
            <span>Offre limitée</span>
          </motion.div>

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {content.cta.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            {content.cta.subtitle}
          </p>

          {/* Price card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="inline-block bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-10 border border-white/10"
          >
            <div className="flex items-baseline justify-center gap-3 mb-3">
              <span className="text-6xl md:text-7xl font-bold text-white number-highlight">
                {formatPrice(PRICES.singleHT, "EUR")}
              </span>
              <span className="text-gray-400 text-xl">HT / unité</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-3 h-3" />
              </div>
              <span>2 pour {formatPrice(PRICES.bulkHT, "EUR")} HT — Économisez 10%</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-10"
          >
            <CTAButton location="cta-section" size="large" />
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 text-gray-400"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Lock className="w-5 h-5 text-emerald-400" />
              </div>
              <span>Paiement 100% sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Truck className="w-5 h-5 text-orange-400" />
              </div>
              <span>Livraison express 24-48h</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <span>Garantie 2 ans</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
