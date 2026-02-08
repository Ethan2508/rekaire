"use client";

// ============================================
// REKAIRE - CTA Button Component (Premium Design)
// ============================================

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { trackCTAClick } from "@/lib/tracking";
import { getMainProduct, formatPrice } from "@/config/product";
import { ArrowRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface CTAButtonProps {
  location: string;
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
  const pathname = usePathname();
  const product = getMainProduct();

  const handleClick = () => {
    trackCTAClick(location);
    
    if (pathname === "/produit") {
      // Déjà sur la page produit, scroll direct vers #commander
      const el = document.getElementById("commander");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Naviguer vers la page produit puis scroll
      router.push("/produit#commander");
      // Attendre que la page charge puis scroll
      setTimeout(() => {
        const el = document.getElementById("commander");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  };

  const baseStyles = cn(
    "group relative inline-flex items-center justify-center gap-2.5 font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 btn-shine",
    {
      // Primary variant - Premium gradient
      "bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 hover:from-orange-600 hover:via-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 focus:ring-orange-500":
        variant === "primary",
      // Secondary variant
      "bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md focus:ring-gray-300":
        variant === "secondary",
      // Sizes
      "px-6 py-3 text-sm": size === "default",
      "px-8 py-4 text-base": size === "large",
    },
    className
  );

  return (
    <motion.button
      onClick={handleClick}
      className={baseStyles}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span>{children || "Commander maintenant"}</span>
      {showPrice && (
        <span className="opacity-80">
          {formatPrice(product.priceCents, product.currency)}
        </span>
      )}
      <ArrowRight className={cn(
        "transition-transform duration-300 group-hover:translate-x-1",
        size === "default" ? "w-4 h-4" : "w-5 h-5"
      )} />
    </motion.button>
  );
}
