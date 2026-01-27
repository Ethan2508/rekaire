// ============================================
// REKAIRE - Tracking Configuration
// ============================================
// Centralise tous les événements et IDs de tracking

export const trackingConfig = {
  gtm: {
    id: process.env.NEXT_PUBLIC_GTM_ID || "GTM-PLACEHOLDER",
  },
  ga4: {
    id: process.env.NEXT_PUBLIC_GA4_ID || "G-PLACEHOLDER",
  },
  meta: {
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "PLACEHOLDER",
  },
  googleAds: {
    id: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-PLACEHOLDER",
    conversionLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL || "PLACEHOLDER",
  },
} as const;

// Types d'événements standardisés
export type TrackingEventName =
  | "page_view"
  | "cta_click"
  | "checkout_start"
  | "payment_success"
  | "payment_failed"
  | "add_to_cart"
  | "view_item"
  | "begin_checkout"
  | "purchase";

export interface TrackingEvent {
  event: TrackingEventName;
  data?: {
    order_id?: string;
    order_value?: number;
    currency?: string;
    product_id?: string;
    product_name?: string;
    quantity?: number;
    page_path?: string;
    cta_location?: string;
    [key: string]: unknown;
  };
}

// Liste des événements obligatoires (pour documentation)
export const requiredEvents: TrackingEventName[] = [
  "page_view",
  "cta_click",
  "checkout_start",
  "payment_success",
  "payment_failed",
];

// Mapping des événements vers GA4
export const ga4EventMapping: Record<TrackingEventName, string> = {
  page_view: "page_view",
  cta_click: "cta_click",
  checkout_start: "begin_checkout",
  payment_success: "purchase",
  payment_failed: "payment_failed",
  add_to_cart: "add_to_cart",
  view_item: "view_item",
  begin_checkout: "begin_checkout",
  purchase: "purchase",
};

// Mapping des événements vers Meta Pixel
export const metaEventMapping: Record<TrackingEventName, string> = {
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
