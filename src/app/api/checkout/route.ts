// ============================================
// REKAIRE - Checkout API Route
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { getMainProduct, calculateTotal } from "@/config/product";
import { isValidOrderId } from "@/lib/order";
import { createClient } from "@supabase/supabase-js";

// Supabase admin client pour bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isCompany: boolean;
  companyName?: string;
  address: string;
  postalCode: string;
  city: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, productId, quantity = 1, customer } = body as {
      orderId: string;
      productId: string;
      quantity: number;
      customer?: CustomerData;
    };

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

    // Validation client
    if (!customer || !customer.email || !customer.firstName || !customer.lastName) {
      return NextResponse.json(
        { error: "Customer information required" },
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
    const { unitPriceHT, totalHT, totalTTC } = calculateTotal(quantity);
    // Convertir en TTC pour Stripe
    const unitPriceTTC = Math.round(unitPriceHT * 1.2);

    // Stocker le lead dans Supabase (même si la commande n'aboutit pas)
    try {
      await supabaseAdmin.from("leads").upsert({
        email: customer.email,
        first_name: customer.firstName,
        last_name: customer.lastName,
        phone: customer.phone,
        is_company: customer.isCompany,
        company_name: customer.companyName || null,
        address: customer.address,
        postal_code: customer.postalCode,
        city: customer.city,
        source: "checkout",
        last_order_id: orderId,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "email"
      });
    } catch (leadError) {
      console.error("[Checkout] Lead save error:", leadError);
      // On continue même si le lead n'est pas sauvegardé
    }

    // Crée la session Stripe avec les infos client
    const session = await createCheckoutSession({
      orderId,
      productName: product.name,
      productDescription: product.shortDescription,
      priceInCents: unitPriceTTC,
      currency: product.currency.toLowerCase(),
      quantity,
      customerEmail: customer.email,
      metadata: {
        product_id: product.id,
        product_name: product.shortName,
        quantity: String(quantity),
        unit_price_ht: String(unitPriceHT),
        total_ht: String(totalHT),
        total_ttc: String(totalTTC),
        customer_name: `${customer.firstName} ${customer.lastName}`,
        customer_phone: customer.phone,
        customer_company: customer.companyName || "",
        shipping_address: customer.address,
        shipping_postal_code: customer.postalCode,
        shipping_city: customer.city,
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
