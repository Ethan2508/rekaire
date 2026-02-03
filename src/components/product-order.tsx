"use client";

// ============================================
// REKAIRE - Product Order Component
// Sélection quantité + CTA vers page Checkout
// ============================================

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ArrowRight, MessageSquare, ShoppingCart } from "lucide-react";
import { trackCTAClick } from "@/lib/tracking";
import { getMainProduct, formatPrice, calculateTotal } from "@/config/product";
import Link from "next/link";

// Seuil pour demande de devis
const QUOTE_THRESHOLD = 3;

interface ProductOrderProps {
  location: string;
  className?: string;
}

export function ProductOrder({ location, className = "" }: ProductOrderProps) {
  const [quantity, setQuantity] = useState(1);
  const product = getMainProduct();

  const isQuoteMode = quantity >= QUOTE_THRESHOLD;

  // Prix calculés (seulement pour 1-2 unités)
  const { totalHT, totalTTC, unitPriceHT } = calculateTotal(Math.min(quantity, 2));

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQty = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const handleCTAClick = () => {
    trackCTAClick(location);
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
            {quantity >= 2 && (
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                -14% pack
              </span>
            )}
          </div>
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
              disabled={quantity >= 10}
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
        <p className="text-xs text-gray-500 text-center">
          {!isQuoteMode 
            ? "✓ Livraison gratuite • Paiement sécurisé Stripe"
            : "Devis gratuit sous 24h • Tarifs dégressifs"}
        </p>
      </div>
    </div>
  );
}
