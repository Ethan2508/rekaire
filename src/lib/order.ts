// ============================================
// REKAIRE - Order Utilities
// ============================================

import { v4 as uuidv4 } from "uuid";

export interface Order {
  id: string;
  email: string;
  productId: string;
  productName: string;
  quantity: number;
  amountCents: number;
  currency: string;
  country: string;
  status: "pending" | "paid" | "failed" | "refunded";
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  paidAt?: string;
  metadata?: Record<string, string>;
}

// Génère un ID de commande unique
export function generateOrderId(): string {
  // Format: RK-{timestamp}-{uuid court}
  const timestamp = Date.now().toString(36).toUpperCase();
  const uuid = uuidv4().split("-")[0].toUpperCase();
  return `RK-${timestamp}-${uuid}`;
}

// Valide un ID de commande
export function isValidOrderId(orderId: string): boolean {
  return /^RK-[A-Z0-9]+-[A-Z0-9]+$/.test(orderId);
}

// Structure minimale pour stockage (RGPD compliant)
export interface OrderMinimal {
  id: string;
  email: string;
  product: string;
  amount: number;
  currency: string;
  country: string;
  timestamp: string;
}

// Convertit Order complet en minimal
export function toMinimalOrder(order: Order): OrderMinimal {
  return {
    id: order.id,
    email: order.email,
    product: order.productId,
    amount: order.amountCents,
    currency: order.currency,
    country: order.country,
    timestamp: order.createdAt,
  };
}
