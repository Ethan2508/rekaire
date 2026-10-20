"use client";

// ============================================
// REKAIRE - Product Order Component
// Sélection quantité + CTA vers page Checkout
// ============================================

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ArrowRight, MessageSquare, ShoppingCart } from "lucide-react";
import { trackCTAClick, trackAddToCart } from "@/lib/tracking";
import { getMainProduct, formatPrice, calculateTotal } from "@/config/product";
import { promoCampaign, isPromoCampaignRunning, rememberPromoCode } from "@/config/promo-campaign";
import Link from "next/link";

// Seuil pour demande de devis (100+ = devis obligatoire)
const QUOTE_THRESHOLD = 100;

interface ProductOrderProps {
  location: string;
  className?: string;
}

export function ProductOrder({ location, className = "" }: ProductOrderProps) {
  const [quantity, setQuantity] = useState(1);
  const product = getMainProduct();

  const isQuoteMode = quantity >= QUOTE_THRESHOLD;

  // Prix calculés
  const { totalHT, totalTTC, unitPriceHT } = calculateTotal(quantity);

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQty = () => {
    if (quantity < 100) setQuantity(quantity + 1);
  };

  const handleCTAClick = () => {
    trackCTAClick(location);
    if (!isQuoteMode && isPromoCampaignRunning()) rememberPromoCode(promoCampaign.code);
    if (!isQuoteMode) {
      trackAddToCart(product.id, product.name, quantity, totalTTC / 100, product.currency);
    }
  };

  return (
    <div id="commander" className={`space-y-4 ${className}`}>
      <div className="space-y-4">
        {/* Prix - caché si mode devis */}
        {!isQuoteMode && (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(unitPriceHT, "EUR")}
            </span>
            <span className="text-gray-500">/ unité HT</span>
          </div>
        )}

        {/* Offre en cours */}
        {!isQuoteMode && isPromoCampaignRunning() && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-orange-50 border border-orange-200">
            <span className="text-sm text-gray-800">
              <strong className="text-orange-600">-{promoCampaign.percent} %</strong> avec le code{" "}
              <span className="font-mono font-bold">{promoCampaign.code}</span>
            </span>
            <span className="text-xs text-gray-500">appliqué au paiement</span>
          </div>
        )}

        {/* Ramener le prix à la durée de protection (5 ans = 60 mois) */}
        {!isQuoteMode && (
          <p className="-mt-2 text-sm text-gray-600">
            Soit <strong className="text-gray-900">{formatPrice(Math.round(totalTTC / quantity / 60), "EUR")} TTC par mois</strong> pour 5 ans de protection
          </p>
        )}

        {/* Mode devis - message */}
        {isQuoteMode && (
          <div className="text-center py-2">
            <p className="text-lg font-semibold text-gray-900">
              Tarif personnalisé
            </p>
            <p className="text-sm text-gray-600">
              Pour {quantity} unités, nous vous proposons un devis sur mesure
            </p>
          </div>
        )}

        {/* Sélecteur quantité */}
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">Quantité :</span>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={decreaseQty}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 h-10 flex items-center justify-center font-semibold text-lg border-x border-gray-300 bg-white text-gray-900">
              {quantity}
            </span>
            <button
              onClick={increaseQty}
              disabled={quantity >= 100}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Total - caché si mode devis */}
        {!isQuoteMode && (
          <div className="py-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total HT</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(totalHT, "EUR")}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
              <span>Total TTC (TVA 20%)</span>
              <span>{formatPrice(totalTTC, "EUR")}</span>
            </div>
          </div>
        )}

        {/* CTA : Commander ou Demander un devis */}
        {!isQuoteMode ? (
          <Link href={`/checkout?qty=${quantity}`} onClick={handleCTAClick}>
            <motion.button
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Commander {quantity} unité{quantity > 1 ? "s" : ""}</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        ) : (
          <Link href={`/checkout?qty=${quantity}`} onClick={handleCTAClick}>
            <motion.button
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              whileTap={{ scale: 0.98 }}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Demander un devis ({quantity} unités)</span>
            </motion.button>
          </Link>
        )}

        {/* Info */}
        <p className="text-xs text-gray-500 text-center mt-4">
          {!isQuoteMode 
            ? "✓ Livraison gratuite • Paiement sécurisé Stripe"
            : "Devis gratuit sous 24h • Tarifs dégressifs"}
        </p>
      </div>
    </div>
  );
}
