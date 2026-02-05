// ============================================
// REKAIRE - Stripe Server Utilities
// ============================================

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

// Types pour les sessions Checkout
export interface CreateCheckoutParams {
  orderId: string;
  productName: string;
  productDescription?: string;
  priceInCents: number;
  currency?: string;
  customerEmail?: string;
  quantity?: number;
  taxRate?: number; // Taux de TVA en pourcentage (ex: 20 pour 20%)
  metadata?: Record<string, string>;
}

// Créer une session Checkout avec Invoicing
export async function createCheckoutSession({
  orderId,
  productName,
  productDescription,
  priceInCents,
  currency = "eur",
  customerEmail,
  quantity = 1,
  taxRate,
  metadata = {},
}: CreateCheckoutParams): Promise<Stripe.Checkout.Session> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // D'abord créer ou récupérer le customer Stripe pour l'invoicing
  let customerId: string | undefined;
  
  if (customerEmail) {
    // Chercher si le customer existe déjà
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });
    
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    } else {
      // Créer un nouveau customer
      const customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          source: 'rekaire_checkout',
          first_order_id: orderId,
        },
      });
      customerId = customer.id;
    }
  }

  // Créer ou récupérer le tax_rate si fourni
  let taxRateId: string | undefined;
  if (taxRate && taxRate > 0) {
    // Chercher un tax_rate existant avec ce pourcentage
    const existingTaxRates = await stripe.taxRates.list({
      active: true,
      limit: 100,
    });
    
    const matchingTaxRate = existingTaxRates.data.find(
      (rate) => rate.percentage === taxRate && rate.jurisdiction === "FR" && rate.inclusive === false
    );
    
    if (matchingTaxRate) {
      taxRateId = matchingTaxRate.id;
    } else {
      // Créer un nouveau tax_rate
      const newTaxRate = await stripe.taxRates.create({
        display_name: `TVA ${taxRate}%`,
        description: `TVA française ${taxRate}%`,
        jurisdiction: "FR",
        percentage: taxRate,
        inclusive: false, // Prix HT + TVA = Prix TTC
        active: true,
      });
      taxRateId = newTaxRate.id;
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    // Apple Pay et Google Pay activés automatiquement si configurés dans Stripe Dashboard
    
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: productName,
            description: productDescription,
          },
          unit_amount: priceInCents,
          ...(taxRateId && {
            tax_behavior: "exclusive", // Prix HT, TVA calculée en plus
          }),
        },
        quantity,
        ...(taxRateId && {
          tax_rates: [taxRateId], // Appliquer le tax_rate à cette ligne
        }),
      },
    ],

    // URLs de redirection
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
    cancel_url: `${baseUrl}/cancel?order_id=${orderId}`,

    // Customer pour l'invoicing
    ...(customerId && { customer: customerId }),
    ...(!customerId && customerEmail && { customer_email: customerEmail }),

    // Metadata pour tracking
    metadata: {
      order_id: orderId,
      ...metadata,
    },

    // Options France
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: ["FR"],
    },
    
    // ============================================
    // STRIPE INVOICING - Génère une facture automatique
    // ============================================
    invoice_creation: {
      enabled: true,
      invoice_data: {
        description: `Commande ${orderId} - ${productName}`,
        metadata: {
          order_id: orderId,
        },
        // Pied de facture
        footer: "Rekaire - NELIOR SAS | SIRET: 989 603 907 00019 | TVA: FR51989603907",
        // Infos de rendu
        rendering_options: {
          amount_tax_display: "include_inclusive_tax",
        },
      },
    },

    // Expiration (30 min)
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,

    // Locale
    locale: "fr",
  });

  return session;
}

// Récupérer une session
export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session | null> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    });
    return session;
  } catch {
    return null;
  }
}

// Vérifier la signature webhook
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
