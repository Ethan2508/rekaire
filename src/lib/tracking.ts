// ============================================
// REKAIRE - Tracking Utilities (Client-side)
// ============================================

"use client";

import { trackingConfig, type TrackingEvent, type TrackingEventName } from "@/config/tracking";

// Vérifie si on est côté client
const isClient = typeof window !== "undefined";

// Types pour les data layers
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
  }
}

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

export function trackMetaEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (!isClient || !window.fbq) return;
  
  window.fbq("track", eventName, params);
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
    value: conversionValue ? conversionValue / 100 : undefined, // Convertir centimes en euros
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
  const metaEventMap: Record<TrackingEventName, string> = {
    page_view: "PageView",
    cta_click: "Lead",
    checkout_start: "InitiateCheckout",
    payment_success: "Purchase",
    payment_failed: "PaymentFailed",
    add_to_cart: "AddToCart",
    view_item: "ViewContent",
    begin_checkout: "InitiateCheckout",
    purchase: "Purchase",
  };

  const metaEventName = metaEventMap[event];
  if (metaEventName) {
    trackMetaEvent(metaEventName, {
      value: data?.order_value ? data.order_value / 100 : undefined,
      currency: data?.currency || "EUR",
      content_ids: data?.product_id ? [data.product_id] : undefined,
      content_name: data?.product_name,
    });
  }

  // Google Ads Conversion (pour payment_success uniquement)
  if (event === "payment_success" && data?.order_value) {
    trackGoogleAdsConversion(data.order_value, data.currency || "EUR", data.order_id);
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
  productName?: string
) {
  trackEvent({
    event: "payment_success",
    data: {
      order_id: orderId,
      order_value: value,
      currency,
      product_id: productId,
      product_name: productName,
    },
  });
}

export function trackPaymentFailed(orderId: string) {
  trackEvent({
    event: "payment_failed",
    data: { order_id: orderId },
  });
}
