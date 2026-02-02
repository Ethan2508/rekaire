"use client";

// ============================================
// REKAIRE - Hero Section (Clean Minimal Design)
// ============================================

import Image from "next/image";
import { content } from "@/config/content";
import { formatPrice, PRICES } from "@/config/product";
import { CTAButton } from "@/components/cta-button";
import { VideoModal } from "@/components/video-modal";
import { Shield, Truck, Award } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-24 pb-16 lg:pt-28 lg:pb-20 bg-[#FAFAFA]">
      {/* Top accent line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400 z-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left - Content */}
          <div className="order-2 lg:order-1">
            {/* Small badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold uppercase tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              {content.hero.badge}
            </div>

            {/* Main headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {content.hero.headline}{" "}
              <span className="text-orange-500">{content.hero.headlineAccent}</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base lg:text-lg text-gray-600 mb-8 max-w-lg">
              {content.hero.subheadline}
            </p>

            {/* Price block */}
            <div className="flex items-end gap-3 mb-4">
              <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                {formatPrice(PRICES.singleHT, "EUR")}
              </span>
              <span className="text-gray-500 pb-1">HT / unité</span>
            </div>
            
            {/* Promo line */}
            <p className="text-sm text-emerald-600 font-medium mb-8 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">✓</span>
              Pack de 2 : {formatPrice(PRICES.bulkHT, "EUR")} HT — Économisez 10%
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <CTAButton location="hero" size="large" />
              <VideoModal 
                videoSrc="/videos/video-rk01.mp4" 
                buttonText="Voir la démo"
              />
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span>Garantie 5 ans</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-400" />
                <span>Livraison 24-48h</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-400" />
                <span>Made in France</span>
              </div>
            </div>
          </div>

          {/* Right - Product */}
          <div className="order-1 lg:order-2 relative">
            {/* Product card */}
            <div className="relative bg-white rounded-2xl p-6 lg:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100">
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                N°1 des ventes
              </div>
              
              {/* Product image */}
              <div className="relative aspect-square max-w-[280px] mx-auto">
                <Image
                  src="/images/product/rk01-main.png"
                  alt="RK01 - Système autonome d'extinction incendie"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {content.hero.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
