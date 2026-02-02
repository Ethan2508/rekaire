"use client";

// ============================================
// REKAIRE - Hero Section (Innovative Design)
// ============================================

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { content } from "@/config/content";
import { formatPrice, PRICES } from "@/config/product";
import { CTAButton } from "@/components/cta-button";
import { VideoModal } from "@/components/video-modal";
import { SalesCounterBadge } from "@/components/live-sales-counter";
import { Shield, Truck, Award, Flame, Zap, ArrowRight } from "lucide-react";

// Texte rotatif pour le hero
const rotatingTexts = ["LOGEMENT", "BUREAU", "DÉPÔT", "LOCAL", "VÉHICULE"];

export function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Rotation du texte
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-[#0A0A0B]">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-950/20 via-transparent to-orange-900/10" />
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(249, 115, 22, 0.03) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(249, 115, 22, 0.03) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 pt-24 lg:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            {/* Live sales badge */}
            <SalesCounterBadge />
            
            {/* Innovation badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-white/80">Innovation française</span>
            </div>
          </motion.div>

          {/* Main content */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              {/* Badge with fire icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 mb-8"
              >
                <Flame className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-sm font-semibold text-red-300">
                  300 000 incendies/an en France
                </span>
              </motion.div>

              {/* Headline with rotating text */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6">
                <span className="text-white/90">PROTÉGEZ</span>
                <br />
                <span className="text-white/90">VOTRE </span>
                <span className="relative inline-block min-w-[200px] lg:min-w-[300px]">
                  <motion.span
                    key={currentTextIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-gradient-animated"
                  >
                    {rotatingTexts[currentTextIndex]}
                  </motion.span>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg lg:text-xl text-white/60 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Découvrez le <span className="text-orange-400 font-semibold">RK01</span>, l&apos;extincteur autonome et innovant 
                qui protège vos espaces 24h/24. Installation en 30 secondes.
              </p>

              {/* Price block - Premium style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-block bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8"
              >
                <div className="flex items-baseline gap-2 justify-center lg:justify-start">
                  <span className="text-5xl lg:text-6xl font-bold text-white">
                    {formatPrice(PRICES.singleHT, "EUR")}
                  </span>
                  <span className="text-white/50">HT</span>
                </div>
                <p className="text-emerald-400 text-sm font-medium mt-2 flex items-center gap-2 justify-center lg:justify-start">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">✓</span>
                  Pack de 2 : {formatPrice(PRICES.bulkHT, "EUR")} HT — Économisez 10%
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12"
              >
                <CTAButton location="hero" size="large" className="group">
                  <span>Commander maintenant</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </CTAButton>
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
                  { icon: Shield, text: "Garantie 5 ans", color: "text-emerald-400" },
                  { icon: Truck, text: "Livraison 24-48h", color: "text-blue-400" },
                  { icon: Award, text: "Made in France", color: "text-orange-400" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-white/60 text-sm">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span>{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right - Product 3D showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              {/* Glow effect behind product */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-full blur-[100px] scale-75" />
              
              {/* Product container */}
              <div className="relative">
                {/* Circular background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[350px] h-[350px] lg:w-[450px] lg:h-[450px] rounded-full border border-white/10 animate-spin-slow" />
                  <div className="absolute w-[280px] h-[280px] lg:w-[380px] lg:h-[380px] rounded-full border border-orange-500/20" />
                </div>

                {/* Product card with glassmorphism */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
                >
                  {/* Bestseller badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30">
                      🔥 Bestseller 2025
                    </div>
                  </div>
                  
                  {/* Product image */}
                  <div className="relative aspect-square max-w-[300px] mx-auto my-4">
                    <motion.div
                      animate={{ rotateY: [0, 5, 0, -5, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Image
                        src="/images/product/rk01-main.png"
                        alt="RK01 - Système autonome d'extinction incendie"
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                      />
                    </motion.div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                    {[
                      { value: "90°C", label: "Activation" },
                      { value: "30s", label: "Installation" },
                      { value: "5 ans", label: "Durée de vie" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-white/50 mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Floating feature badges */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute -left-4 top-1/4 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium"
                >
                  ✓ Sans entretien
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute -right-4 top-1/3 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium"
                >
                  ⚡ Automatique
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  className="absolute -left-2 bottom-1/4 px-3 py-2 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                >
                  🌱 Écoresponsable
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

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
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
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
