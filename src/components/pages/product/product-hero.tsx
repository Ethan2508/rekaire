"use client";

// ============================================
// REKAIRE - Product Hero Section
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { formatPrice, PRICES } from "@/config/product";
import { ProductOrder } from "@/components/product-order";
import { VideoModal } from "@/components/video-modal";
import { Check, Shield, Zap, Clock, ChevronLeft, ChevronRight } from "lucide-react";

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
    <section className="pt-28 pb-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Product Images - Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="sticky top-28"
          >
            <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              {/* Main Image */}
              <div className="relative aspect-[4/3] bg-gray-50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={productImages[currentImage].src}
                      alt={productImages[currentImage].alt}
                      fill
                      className="object-contain p-4"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors z-10"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors z-10"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Dots indicator */}
              <div className="flex justify-center gap-2 py-4 bg-white border-t border-gray-100">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      index === currentImage ? "bg-orange-500" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex justify-center gap-3 mt-4">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-20 h-20 rounded-lg border-2 transition-all cursor-pointer bg-white p-1 overflow-hidden ${
                    index === currentImage 
                      ? "border-orange-500 shadow-md" 
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={`Miniature ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              En stock
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              RK01 - Système Autonome d&apos;Extinction Incendie
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              Protection automatique et préventive pour tableaux électriques. 
              Détection et extinction autonome sans intervention humaine.
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-sm">Protection 24/7</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-sm">Durée de vie 5 ans</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-sm">Sans électricité</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-sm">Sans maintenance</span>
              </div>
            </div>

            {/* Order Box avec sélecteur quantité */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6">
              <ProductOrder location="product-page" />
            </div>

            {/* Vidéo */}
            <div className="flex justify-center mb-6">
              <VideoModal videoSrc="/videos/video-rk01.mp4" buttonText="Voir en action" />
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Paiement sécurisé
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Livraison 24-48h
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Garantie 5 ans
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
