"use client";

// ============================================
// REKAIRE - Product Hero Section (Premium Design)
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { formatPrice, PRICES } from "@/config/product";
import { ProductOrder } from "@/components/product-order";
import { VideoModal } from "@/components/video-modal";
import { Check, Shield, Zap, Clock, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Truck } from "lucide-react";

// Nouvelles images produit depuis les fiches marketing
const productImages = [
  { src: "/images/product/gallery/fiche1.png", alt: "RK01 - Vue principale" },
  { src: "/images/product/gallery/fiche2.png", alt: "RK01 - Packaging" },
  { src: "/images/product/gallery/fiche3.png", alt: "RK01 - Détails techniques" },
];

export function ProductHero() {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-orange-50/30" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-orange-100/40 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-gray-100/50 to-transparent rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Product Images - Premium Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="sticky top-28"
          >
            <div className="relative bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-xl shadow-gray-200/50">
              
              {/* Main Image */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-white">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImage}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={productImages[currentImage].src}
                      alt={productImages[currentImage].alt}
                      fill
                      className="object-contain p-6"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
                
                {/* Navigation Arrows - Premium Style */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg shadow-gray-300/50 flex items-center justify-center hover:shadow-xl transition-shadow z-10 border border-gray-100"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg shadow-gray-300/50 flex items-center justify-center hover:shadow-xl transition-shadow z-10 border border-gray-100"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </motion.button>
              </div>

              {/* Premium Dots indicator */}
              <div className="flex justify-center gap-2 py-5 bg-gradient-to-t from-gray-50 to-white border-t border-gray-100">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentImage 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 w-8" 
                        : "bg-gray-300 hover:bg-gray-400 w-2"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Premium Thumbnails */}
            <div className="flex justify-center gap-4 mt-5">
              {productImages.map((img, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentImage(index)}
                  className={`relative w-24 h-24 rounded-2xl border-2 transition-all cursor-pointer bg-white p-2 overflow-hidden ${
                    index === currentImage 
                      ? "border-orange-500 shadow-lg shadow-orange-500/20 ring-4 ring-orange-500/10" 
                      : "border-gray-200 hover:border-orange-300 hover:shadow-md"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={`Miniature ${index + 1}`}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info - Premium */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:pl-4"
          >
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-semibold mb-5">
              <span className="relative w-2.5 h-2.5">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                <span className="relative block w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </span>
              En stock - Expédition sous 24h
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              RK01 - Système Autonome{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                d&apos;Extinction
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Protection automatique et préventive pour tableaux électriques. 
              Détection et extinction autonome sans intervention humaine.
            </p>

            {/* Key Features - Premium Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Shield, label: "Protection 24/7", color: "from-orange-500 to-orange-600" },
                { icon: Clock, label: "Durée de vie 5 ans", color: "from-blue-500 to-blue-600" },
                { icon: Zap, label: "Sans électricité", color: "from-amber-500 to-amber-600" },
                { icon: Check, label: "Sans maintenance", color: "from-emerald-500 to-emerald-600" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{feature.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Premium Order Box */}
            <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-100/50 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <ProductOrder location="product-page" />
              </div>
            </div>

            {/* Vidéo */}
            <div className="flex justify-center mb-8">
              <VideoModal videoSrc="/videos/video-rk01.mp4" buttonText="Voir en action" />
            </div>

            {/* Premium Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              {[
                { icon: ShieldCheck, label: "Paiement sécurisé", color: "text-emerald-500" },
                { icon: Truck, label: "Livraison 24-48h", color: "text-blue-500" },
                { icon: Shield, label: "Garantie 5 ans", color: "text-orange-500" },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-sm text-gray-600">
                  <badge.icon className={`w-5 h-5 ${badge.color}`} />
                  <span className="font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
