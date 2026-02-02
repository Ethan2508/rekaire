"use client";

// ============================================
// REKAIRE - Product Order Component
// Sélection quantité + CTA (max 2 = achat, 3+ = devis)
// ============================================

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ArrowRight, Loader2, MessageSquare } from "lucide-react";
import { trackCTAClick, trackCheckoutStart } from "@/lib/tracking";
import { generateOrderId } from "@/lib/order";
import { getMainProduct, formatPrice, PRICES, calculateTotal } from "@/config/product";
import Link from "next/link";

interface ProductOrderProps {
  location: string;
  className?: string;
}

export function ProductOrder({ location, className = "" }: ProductOrderProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const product = getMainProduct();

  // Prix calculés
  const { totalHT, totalTTC, unitPriceHT } = calculateTotal(quantity);

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQty = () => {
    if (quantity < 3) setQuantity(quantity + 1);
  };

  const handleCheckout = async () => {
    if (isLoading || quantity > 2) return;
    
    setIsLoading(true);
    trackCTAClick(location);

    const orderId = generateOrderId();
    trackCheckoutStart(
      orderId,
      product.id,
      product.name,
      unitPriceHT,
      product.currency
    );

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          productId: product.id,
          quantity,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div id="commander" className={`space-y-4 ${className}`}>
      {/* Prix */}
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
            disabled={quantity >= 3}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Total */}
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

      {/* CTA : Achat ou Devis */}
      {quantity <= 2 ? (
        <motion.button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Redirection...</span>
            </>
          ) : (
            <>
              <span>Commander {quantity} unité{quantity > 1 ? "s" : ""}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      ) : (
        <Link href="/contact?sujet=devis&quantity=3plus">
          <motion.button
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Demander un devis (3+ unités)</span>
          </motion.button>
        </Link>
      )}

      {/* Info quantité */}
      <p className="text-xs text-gray-500 text-center">
        {quantity <= 2 
          ? "✓ Livraison gratuite • Paiement sécurisé Stripe"
          : "Pour 3 unités ou plus, nous vous proposons un tarif personnalisé."}
      </p>
    </div>
  );
}
