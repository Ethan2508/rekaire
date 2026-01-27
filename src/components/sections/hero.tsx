"use client";

// ============================================
// REKAIRE - Hero Section (Light Theme)
// ============================================

import { motion } from "framer-motion";
import Image from "next/image";
import { content } from "@/config/content";
import { formatPrice, PRICES } from "@/config/product";
import { CTAButton } from "@/components/cta-button";
import { VideoModal } from "@/components/video-modal";
import { Shield, Zap, Check } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Subtle pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-sm font-medium mb-6"
            >
              <Shield className="w-4 h-4" />
              {content.hero.badge}
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              {content.hero.headline}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                {content.hero.headlineAccent}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl">
              {content.hero.subheadline}
            </p>

            {/* Price */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(PRICES.singleHT, "EUR")}
                </span>
                <span className="text-gray-500">HT / unité</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <Check className="w-4 h-4" />
                <span>2 pour {formatPrice(PRICES.bulkHT, "EUR")} HT</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <CTAButton location="hero" size="large" />
              <VideoModal videoSrc="/videos/video-rk01.mp4" buttonText="Voir la vidéo" />
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-500" />
                Paiement sécurisé
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Zap className="w-4 h-4 text-orange-500" />
                Livraison 24-48h
              </div>
            </div>
          </motion.div>

          {/* Product Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 to-orange-300/20 rounded-3xl blur-3xl" />
              
              {/* Product image - no background */}
              <div className="relative p-8">
                <Image
                  src="/images/product/rk01-main.png"
                  alt="RK01 - Système autonome d'extinction incendie"
                  width={500}
                  height={500}
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>

            {/* Stats floating */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-3 px-4">
              {content.hero.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white shadow-lg border border-gray-100 rounded-lg px-4 py-3 text-center"
                >
                  <p className="text-xl font-bold text-orange-500">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-gray-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
