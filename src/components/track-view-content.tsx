"use client";

// ============================================
// REKAIRE - Suivi « Afficher le contenu » (page produit)
// ============================================

import { useEffect } from "react";
import { getMainProduct } from "@/config/product";
import { trackViewContent } from "@/lib/tracking";

export function TrackViewContent() {
  useEffect(() => {
    const product = getMainProduct();
    trackViewContent(product.id, product.name, product.priceCents / 100, product.currency);
  }, []);
  return null;
}
