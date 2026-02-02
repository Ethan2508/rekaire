"use client";

// ============================================
// REKAIRE - CTA Section (Dark Innovative)
// ============================================

import { motion } from "framer-motion";
import { content } from "@/config/content";
import { formatPrice, PRICES } from "@/config/product";
import { CTAButton } from "@/components/cta-button";
import { Lock, Truck, Shield, Star, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-[#0A0A0B] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[200px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[150px]" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-semibold mb-8"
        >
          <Star className="w-4 h-4 fill-orange-400" />
          Offre spéciale
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
        >
          {content.cta.title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-white/60 max-w-2xl mx-auto mb-10"
        >
          {content.cta.subtitle}
        </motion.p>

        {/* Price Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="inline-block bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-10"
        >
          <div className="flex items-baseline justify-center gap-3 mb-4">
            <span className="text-5xl md:text-7xl font-bold text-white">
              {formatPrice(PRICES.singleHT, "EUR")}
            </span>
            <span className="text-white/50 text-xl">HT / unité</span>
          </div>
          <p className="text-emerald-400 font-medium flex items-center justify-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">✓</span>
            Pack de 2 : {formatPrice(PRICES.bulkHT, "EUR")} HT — Économisez 10%
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <CTAButton location="cta-section" size="large" className="group">
            <span>Commander maintenant</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </CTAButton>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { icon: Lock, text: "Paiement sécurisé", color: "text-emerald-400" },
            { icon: Truck, text: "Livraison 24-48h", color: "text-blue-400" },
            { icon: Shield, text: "Garantie 5 ans", color: "text-orange-400" },
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-3 text-white/60">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <badge.icon className={`w-5 h-5 ${badge.color}`} />
              </div>
              <span>{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
