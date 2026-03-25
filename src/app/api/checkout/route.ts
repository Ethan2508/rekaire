// ============================================
// REKAIRE - Checkout API Route
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { getMainProduct, calculateTotal } from "@/config/product";
import { isValidOrderId } from "@/lib/order";
import { createClient } from "@supabase/supabase-js";
import { rateLimitDB } from "@/lib/rate-limit";

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
  // Adresse de livraison
  address: string;
  postalCode: string;
  city: string;
  // Adresse de facturation
  billingSameAsShipping: boolean;
  billingName?: string;
  billingCompany?: string;
  billingAddress?: string;
  billingPostalCode?: string;
  billingCity?: string;
  billingVatNumber?: string;
}

export async function POST(request: NextRequest) {
  // 🔒 RATE LIMITING (DB-based, serverless-safe)
  const rateLimitResponse = await rateLimitDB(request, {
    maxRequests: 10,
    keyPrefix: "checkout",
  });
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const { orderId, productId, quantity = 1, promoCode, customer } = body as {
      orderId: string;
      productId: string;
      quantity: number;
      promoCode?: string;
      customer?: CustomerData;
    };

    // ⚠️ SÉCURITÉ : Ne JAMAIS faire confiance au promoDiscount du client
    // On va le recalculer côté serveur

    // Validation
    if (!orderId || !isValidOrderId(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      );
    }

    // 🔒 VALIDATION STRICTE quantité (1-99 = paiement, 100+ = devis)
    const validQuantity = Math.floor(Math.abs(quantity));
    if (validQuantity < 1 || validQuantity > 99) {
      return NextResponse.json(
        { error: "Invalid quantity. Must be between 1 and 99 units. For 100+ units, please request a quote." },
        { status: 400 }
      );
    }

    // 🔒 VALIDATION STRICTE client
    if (!customer || !customer.email || !customer.firstName || !customer.lastName) {
      return NextResponse.json(
        { error: "Customer information required" },
        { status: 400 }
      );
    }

    // Sanitisation email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(customer.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Sanitisation nom/prénom (pas de caractères spéciaux dangereux)
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{1,100}$/;
    if (!nameRegex.test(customer.firstName) || !nameRegex.test(customer.lastName)) {
      return NextResponse.json(
        { error: "Invalid name format" },
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

    // 🔒 VÉRIFICATION STOCK AVANT PAIEMENT
    const { checkStock } = await import("@/lib/supabase-admin");
    const stockCheck = await checkStock(product.slug, validQuantity);
    
    if (stockCheck.dbError) {
      console.warn("[Checkout] Stock check DB error, proceeding anyway (fail-open)");
    }
    
    if (!stockCheck.available) {
      return NextResponse.json(
        { 
          error: "Stock insuffisant",
          available: stockCheck.currentStock,
          requested: validQuantity
        },
        { status: 400 }
      );
    }

    // Calcul du prix selon quantité (2+ = prix réduit) - avec quantité VALIDÉE
    const { unitPriceHT, totalHT, totalTTC } = calculateTotal(validQuantity);
    
    // 🔒 SÉCURITÉ CRITIQUE: Tous les calculs de prix se font ICI côté serveur
    // Le client NE PEUT PAS manipuler les prix car ils sont recalculés
    // Les montants sont passés à Stripe dans les metadata pour validation webhook
    
    // 🔒 VALIDATION CÔTÉ SERVEUR du code promo
    let promoDiscount = 0;
    let validatedPromoCode = null;
    
    if (promoCode) {
      // Valider le code promo avec Supabase (côté serveur)
      const { data: promo, error } = await supabaseAdmin
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (promo && !error) {
        const now = new Date();
        
        // Vérifier dates de validité
        const isValidDate = 
          (!promo.valid_from || new Date(promo.valid_from) <= now) &&
          (!promo.valid_until || new Date(promo.valid_until) >= now);
        
        // Vérifier limite d'utilisations
        const hasUsesLeft = !promo.max_uses || promo.current_uses < promo.max_uses;
        
        // Vérifier montant minimum
        const meetsMinOrder = !promo.min_order || totalHT >= promo.min_order;
        
        if (isValidDate && hasUsesLeft && meetsMinOrder) {
          // Calculer la réduction (discount_percent = pourcentage de réduction)
          const percentage = Math.min(Math.max(0, promo.discount_percent), 100);
          promoDiscount = Math.round((totalHT * percentage / 100) * 100) / 100;
          
          validatedPromoCode = promo;
          
          // Incrémenter le compteur d'utilisation ATOMIQUEMENT
          await supabaseAdmin.rpc("increment_promo_usage", {
            promo_id: promo.id,
          });
          
          // 🔒 AUDIT : Logger l'utilisation pour détection fraude
          try {
            await supabaseAdmin.rpc("log_promo_usage", {
              p_promo_code_id: promo.id,
              p_order_id: orderId,
              p_customer_email: customer.email,
              p_discount_amount: promoDiscount,
              p_ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null,
              p_user_agent: request.headers.get("user-agent") || null,
            });
          } catch (logError) {
            console.error("[Checkout] Promo usage log error:", logError);
            // Continue même si le log échoue
          }
        }
      }
    }
    
    // Appliquer la réduction validée (tout est déjà en centimes)
    const totalHTAfterPromo = Math.max(0, totalHT - promoDiscount);
    const totalTTCAfterPromo = Math.round(totalHTAfterPromo * 1.2);
    
    // ⚠️ IMPORTANT: On envoie le prix HT à Stripe + tax_rate pour qu'il affiche la TVA séparément
    const totalPriceHT = Math.round(totalHTAfterPromo);

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

    // Crée la session Stripe avec les infos client + adresse pré-remplie
    const session = await createCheckoutSession({
      orderId,
      productName: product.name,
      productDescription: product.shortDescription,
      priceInCents: Math.round(totalPriceHT), // Prix HT pour que Stripe calcule la TVA
      currency: product.currency.toLowerCase(),
      quantity: 1, // On passe quantity = 1 car le prix total inclut déjà tout
      customerEmail: customer.email,
      // 🎯 Pré-remplir l'adresse dans Stripe Checkout
      customerAddress: {
        name: `${customer.firstName} ${customer.lastName}`,
        line1: customer.address,
        city: customer.city,
        postal_code: customer.postalCode,
        country: 'FR',
        phone: customer.phone,
      },
      taxRate: 20, // TVA 20% pour la France
      metadata: {
        product_id: product.id,
        product_name: product.shortName,
        quantity: String(validQuantity),
        unit_price_ht: String(unitPriceHT),
        unit_price: String(Math.round(unitPriceHT * 1.2)), // Prix unitaire TTC pour emails
        total_ht: String(totalHTAfterPromo),
        total_ttc: String(totalTTCAfterPromo),
        promo_code: validatedPromoCode?.code || "",
        promo_discount: String(promoDiscount), // Réduction HT
        discount_amount: String(Math.round(promoDiscount * 1.2)), // Réduction TTC pour emails
        customer_name: `${customer.firstName} ${customer.lastName}`,
        customer_phone: customer.phone,
        customer_company: customer.companyName || "",
        // Adresse de livraison
        shipping_address: customer.address,
        shipping_postal_code: customer.postalCode,
        shipping_city: customer.city,
        // Adresse de facturation
        billing_same_as_shipping: String(customer.billingSameAsShipping),
        billing_name: customer.billingName || `${customer.firstName} ${customer.lastName}`,
        billing_company: customer.billingCompany || customer.companyName || "",
        billing_address: customer.billingAddress || customer.address,
        billing_postal_code: customer.billingPostalCode || customer.postalCode,
        billing_city: customer.billingCity || customer.city,
        billing_vat_number: customer.billingVatNumber || "",
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
