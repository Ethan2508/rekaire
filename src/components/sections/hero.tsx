"use client";

// ============================================
// REKAIRE - Hero Section (Light Clean Design)
// ============================================

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatPrice, PRICES } from "@/config/product";
import { CTAButton } from "@/components/cta-button";
import { VideoModal } from "@/components/video-modal";
import { SalesCounterBadge } from "@/components/live-sales-counter";
import { Shield, Truck, Award, Flame, Zap, Check, Sparkles } from "lucide-react";

// Texte rotatif pour le hero
const rotatingTexts = ["MAISON", "BUREAU", "LOCAL", "DÉPÔT"];

export function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Rotation du texte
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-orange-50/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 pt-28 lg:pt-36 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-10"
          >
            {/* Live sales badge */}
            <SalesCounterBadge />
            
            {/* Innovation badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
              <span className="text-base">🇫🇷</span>
              <span className="text-sm font-medium text-gray-700">Innovation française</span>
            </div>
          </motion.div>

          {/* Main content */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              {/* Badge with fire icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 mb-8"
              >
                <Flame className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-red-600">
                  300 000 incendies/an en France
                </span>
              </motion.div>

              {/* Headline with rotating text - SMALLER SIZE */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.15] mb-6">
                <span>PROTÉGEZ VOTRE </span>
                <span className="relative inline-block">
                  <motion.span
                    key={currentTextIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600"
                  >
                    {rotatingTexts[currentTextIndex]}
                  </motion.span>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Découvrez le <span className="text-orange-500 font-semibold">RK01</span>, l&apos;extincteur autonome et innovant 
                qui protège vos espaces 24h/24. Installation en 30 secondes.
              </p>

              {/* Price block */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-block bg-white rounded-2xl p-6 border border-gray-200 shadow-lg mb-8"
              >
                <div className="flex items-baseline gap-2 justify-center lg:justify-start">
                  <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                    {formatPrice(PRICES.singleHT, "EUR")}
                  </span>
                  <span className="text-gray-500">HT</span>
                </div>
                <p className="text-emerald-600 text-sm font-medium mt-2 flex items-center gap-2 justify-center lg:justify-start">
                  <Check className="w-4 h-4" />
                  Pack de 2 : {formatPrice(PRICES.bulkHT, "EUR")} HT — Économisez 10%
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10"
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
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-6 justify-center lg:justify-start"
              >
                {[
                  { icon: Shield, text: "Garantie 5 ans", color: "text-emerald-500" },
                  { icon: Truck, text: "Livraison 24-48h", color: "text-blue-500" },
                  { icon: Award, text: "Made in France", color: "text-orange-500" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-gray-600 text-sm">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span>{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right - Product showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              {/* Glow effect behind product */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200/40 to-orange-100/20 rounded-full blur-[80px] scale-75" />
              
              {/* Product container */}
              <div className="relative px-4 sm:px-8">
                {/* Product card - sans fond blanc */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  {/* Product image */}
                  <div className="relative aspect-square max-w-[280px] sm:max-w-[320px] mx-auto">
                    <Image
                      src="/images/product/rk01-main.png"
                      alt="RK01 - Système autonome d'extinction incendie"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                    {[
                      { value: "90°C", label: "Activation" },
                      { value: "30s", label: "Installation" },
                      { value: "5 ans", label: "Durée de vie" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Floating feature badges - hidden on mobile to avoid overflow issues */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="hidden sm:flex absolute -left-2 top-1/4 px-3 py-2 rounded-xl bg-white border border-gray-200 shadow-md text-gray-700 text-xs font-medium items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Sans entretien
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="hidden sm:flex absolute -right-2 top-1/3 px-3 py-2 rounded-xl bg-white border border-gray-200 shadow-md text-gray-700 text-xs font-medium items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-orange-500" />
                  Automatique
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  className="hidden sm:flex absolute -left-1 bottom-1/4 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 shadow-md text-emerald-700 text-xs font-medium items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  Écoresponsable
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-orange-500 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
