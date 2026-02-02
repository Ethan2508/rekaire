"use client";

// ============================================
// REKAIRE - Hero Section (Premium Design)
// ============================================

import { motion } from "framer-motion";
import Image from "next/image";
import { content } from "@/config/content";
import { formatPrice, PRICES } from "@/config/product";
import { CTAButton } from "@/components/cta-button";
import { VideoModal } from "@/components/video-modal";
import { Shield, Zap, Check, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-mesh">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      
      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-orange-100 text-orange-600 text-sm font-medium mb-8 shadow-sm badge-glow"
            >
              <Sparkles className="w-4 h-4" />
              <span>{content.hero.badge}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]"
            >
              {content.hero.headline}
              <br />
              <span className="text-gradient-shine">
                {content.hero.headlineAccent}
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {content.hero.subheadline}
            </motion.p>

            {/* Price Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="inline-block bg-white rounded-2xl p-6 mb-8 shadow-xl shadow-gray-200/50 border border-gray-100"
            >
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-gray-900 number-highlight">
                  {formatPrice(PRICES.singleHT, "EUR")}
                </span>
                <span className="text-gray-500 text-lg">HT / unité</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-emerald-600 text-sm font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <span>2 pour {formatPrice(PRICES.bulkHT, "EUR")} HT — Économisez 10%</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
            >
              <CTAButton location="hero" size="large" />
              <VideoModal 
                videoSrc="/videos/video-rk01.mp4" 
                buttonText="Voir la démo"
              />
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center gap-8 justify-center lg:justify-start pt-8 border-t border-gray-200/60"
            >
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-500" />
                </div>
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-orange-500" />
                </div>
                <span>Livraison 24-48h</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Product Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Glow behind product */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200/40 via-orange-100/20 to-transparent rounded-full blur-3xl scale-110" />
            
            {/* Product container */}
            <div className="relative">
              {/* Floating ring decoration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 md:w-96 md:h-96 rounded-full border-2 border-dashed border-orange-200/50 animate-spin" style={{ animationDuration: '30s' }} />
              </div>
              
              {/* Product image */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative p-8 md:p-12"
              >
                <Image
                  src="/images/product/rk01-main.png"
                  alt="RK01 - Système autonome d'extinction incendie"
                  width={500}
                  height={500}
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </div>

            {/* Floating stats cards */}
            <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-3 px-4">
              {content.hero.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  className="bg-white/90 backdrop-blur-sm shadow-lg shadow-gray-200/50 border border-gray-100 rounded-xl px-4 py-3 text-center card-hover"
                >
                  <p className="text-2xl font-bold text-gradient number-highlight">{stat.value}</p>
                  <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
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
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1.5 h-2.5 bg-orange-400 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
