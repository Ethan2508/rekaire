// ============================================
// REKAIRE - Tracking Utilities (Client-side)
// ============================================

"use client";

import { trackingConfig, type TrackingEvent, type TrackingEventName } from "@/config/tracking";

// Vérifie si on est côté client
const isClient = typeof window !== "undefined";

// Types pour les data layers - déclarés dans analytics.tsx
// On réutilise les types globaux sans les redéclarer

// ============================================
// Google Tag Manager
// ============================================

export function pushToDataLayer(data: Record<string, unknown>) {
  if (!isClient) return;
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

// ============================================
// Google Analytics 4
// ============================================

export function trackGA4Event(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (!isClient || !window.gtag) return;
  
  window.gtag("event", eventName, params);
}

// ============================================
// Meta Pixel
// ============================================

// Événements émis avant le chargement du pixel (le pixel n'est chargé qu'après le
// consentement marketing, souvent après l'arrivée sur la page) : ils sont gardés en
// mémoire et envoyés dès que le pixel se charge. Sans consentement, ils ne partent jamais.
type QueuedMetaEvent = [string, Record<string, unknown> | undefined, string | undefined];
declare global {
  interface Window {
    __rkMetaQueue?: QueuedMetaEvent[];
  }
}

export function flushMetaQueue() {
  if (!isClient || !window.fbq) return;
  const queue = window.__rkMetaQueue || [];
  window.__rkMetaQueue = [];
  queue.forEach(([name, params, eventId]) => trackMetaEvent(name, params, eventId));
}

export function trackMetaEvent(
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string
) {
  if (!isClient) return;
  if (!window.fbq) {
    const item: QueuedMetaEvent = [eventName, params, eventId];
    window.__rkMetaQueue = [...(window.__rkMetaQueue || []), item].slice(-20);
    return;
  }

  // eventID : permet à Meta de dédoublonner un même événement envoyé deux fois
  if (eventId) window.fbq("track", eventName, params, { eventID: eventId });
  else window.fbq("track", eventName, params);
}

// ============================================
// Google Ads Conversion
// ============================================

export function trackGoogleAdsConversion(
  conversionValue?: number,
  currency: string = "EUR",
  orderId?: string
) {
  if (!isClient || !window.gtag) return;
  
  window.gtag("event", "conversion", {
    send_to: `${trackingConfig.googleAds.id}/${trackingConfig.googleAds.conversionLabel}`,
    value: conversionValue || undefined, // Valeur déjà en euros
    currency,
    transaction_id: orderId,
  });
}

// ============================================
// Unified Tracking Function
// ============================================

export function trackEvent({ event, data }: TrackingEvent) {
  // Push to GTM Data Layer (principal)
  pushToDataLayer({
    event,
    ...data,
  });

  // GA4 direct (backup)
  trackGA4Event(event, data);

  // Meta Pixel
  // PageView est déjà envoyé au chargement du pixel ; un clic sur un bouton n'est pas un prospect
  const metaEventMap: Partial<Record<TrackingEventName, string>> = {
    checkout_start: "InitiateCheckout",
    payment_success: "Purchase",
    add_to_cart: "AddToCart",
    view_item: "ViewContent",
    begin_checkout: "InitiateCheckout",
    contact_form: "Lead",
  };

  const metaEventName = metaEventMap[event];
  if (metaEventName) {
    trackMetaEvent(metaEventName, {
      value: data?.order_value ? Number(data.order_value) : undefined, // Valeur déjà en euros
      currency: (data?.currency as string) || "EUR",
      content_ids: data?.product_id ? [data.product_id] : undefined,
      content_name: data?.product_name,
      content_type: data?.product_id ? "product" : undefined,
      num_items: data?.quantity ? Number(data.quantity) : undefined,
    }, data?.order_id ? `${metaEventName}-${data.order_id}` : undefined);
  }

  // Google Ads Conversion (pour payment_success uniquement)
  if (event === "payment_success" && data?.order_value) {
    trackGoogleAdsConversion(Number(data.order_value), (data.currency as string) || "EUR", data.order_id as string);
  }

  // Log en dev
  if (process.env.NODE_ENV === "development") {
    console.log("[Tracking]", event, data);
  }
}

// ============================================
// Specific Event Helpers
// ============================================

export function trackPageView(pagePath: string) {
  trackEvent({
    event: "page_view",
    data: { page_path: pagePath },
  });
}

export function trackCTAClick(location: string) {
  trackEvent({
    event: "cta_click",
    data: { cta_location: location },
  });
}

// Visite de la page produit
export function trackViewContent(productId: string, productName: string, value: number, currency: string = "EUR") {
  trackEvent({
    event: "view_item",
    data: { product_id: productId, product_name: productName, order_value: value, currency },
  });
}

// Clic sur « Commander » (passage au tunnel de commande)
export function trackAddToCart(
  productId: string,
  productName: string,
  quantity: number,
  value: number,
  currency: string = "EUR"
) {
  trackEvent({
    event: "add_to_cart",
    data: { product_id: productId, product_name: productName, quantity, order_value: value, currency },
  });
}

export function trackCheckoutStart(
  orderId: string,
  productId: string,
  productName: string,
  value: number,
  currency: string = "EUR"
) {
  trackEvent({
    event: "checkout_start",
    data: {
      order_id: orderId,
      product_id: productId,
      product_name: productName,
      order_value: value,
      currency,
    },
  });
}

export function trackPaymentSuccess(
  orderId: string,
  value: number,
  currency: string = "EUR",
  productId?: string,
  productName?: string,
  quantity?: number
) {
  // Une seule conversion par commande, même si la page de succès est rechargée
  const key = `rk_purchase_tracked_${orderId}`;
  try {
    if (orderId && localStorage.getItem(key)) return;
    if (orderId) localStorage.setItem(key, "1");
  } catch {
    // Storage indisponible : l'eventID permet quand même à Meta de dédoublonner
  }
  trackEvent({
    event: "payment_success",
    data: {
      order_id: orderId,
      order_value: value,
      currency,
      product_id: productId,
      product_name: productName,
      quantity,
    },
  });
}

export function trackPaymentFailed(orderId: string) {
  trackEvent({
    event: "payment_failed",
    data: { order_id: orderId },
  });
}
