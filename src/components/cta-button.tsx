"use client";

// ============================================
// REKAIRE - CTA Button Component
// Redirige vers la page produit pour choisir la quantité
// ============================================

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { trackCTAClick } from "@/lib/tracking";
import { getMainProduct, formatPrice } from "@/config/product";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface CTAButtonProps {
  location: string; // Pour tracking (hero, features, footer, etc.)
  variant?: "primary" | "secondary";
  size?: "default" | "large";
  showPrice?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function CTAButton({
  location,
  variant = "primary",
  size = "default",
  showPrice = false,
  className,
  children,
}: CTAButtonProps) {
  const router = useRouter();
  const product = getMainProduct();

  const handleClick = () => {
    // Track CTA click
    trackCTAClick(location);

    // Rediriger vers la page produit pour choisir la quantité
    router.push("/produit#commander");
  };

  const baseStyles = cn(
    "relative inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white",
    {
      // Primary variant
      "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/25 hover:-translate-y-0.5 focus:ring-orange-500":
        variant === "primary",
      // Secondary variant
      "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200 hover:border-gray-300 focus:ring-gray-300":
        variant === "secondary",
      // Sizes
      "px-6 py-3 text-base": size === "default",
      "px-8 py-4 text-lg": size === "large",
    },
    className
  );

  return (
    <motion.button
      onClick={handleClick}
      className={baseStyles}
      whileTap={{ scale: 0.98 }}
    >
      <span>{children || "Commander maintenant"}</span>
      {showPrice && (
        <span className="opacity-80">
          {formatPrice(product.priceCents, product.currency)}
        </span>
      )}
      <ArrowRight className="w-5 h-5" />
    </motion.button>
  );
}
