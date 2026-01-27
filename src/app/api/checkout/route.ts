// ============================================
// REKAIRE - Checkout API Route
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { getMainProduct, calculateTotal } from "@/config/product";
import { isValidOrderId } from "@/lib/order";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, productId, quantity = 1 } = body;

    // Validation
    if (!orderId || !isValidOrderId(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      );
    }

    // Validation quantité max 2 pour achat direct
    if (quantity > 2) {
      return NextResponse.json(
        { error: "Maximum 2 units per order. Contact us for bulk orders." },
        { status: 400 }
      );
    }

    // Récupère le produit (pour MVP, un seul produit)
    const product = getMainProduct();

    if (productId && productId !== product.id) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Calcul du prix selon quantité (2+ = prix réduit)
    const { unitPriceHT } = calculateTotal(quantity);
    // Convertir en TTC pour Stripe
    const unitPriceTTC = Math.round(unitPriceHT * 1.2);

    // Crée la session Stripe
    const session = await createCheckoutSession({
      orderId,
      productName: product.name,
      productDescription: product.shortDescription,
      priceInCents: unitPriceTTC,
      currency: product.currency.toLowerCase(),
      quantity,
      metadata: {
        product_id: product.id,
        product_name: product.shortName,
        quantity: String(quantity),
        unit_price_ht: String(unitPriceHT),
      },
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("[Checkout API] Error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
