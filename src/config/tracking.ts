// ============================================
// REKAIRE - Tracking Configuration
// ============================================

export type TrackingEventName =
  | "page_view"
  | "cta_click"
  | "checkout_start"
  | "payment_success"
  | "payment_failed"
  | "add_to_cart"
  | "view_item"
  | "begin_checkout"
  | "contact_form";

export interface TrackingEvent {
  event: TrackingEventName;
  data?: Record<string, unknown>;
}

export const trackingConfig = {
  // Google Tag Manager
  gtm: {
    id: "GTM-XXXXXXX", // À configurer si nécessaire
  },

  // Google Analytics 4
  ga4: {
    id: "G-G46KL6NKEE",
  },

  // Google Ads
  googleAds: {
    id: "AW-17976614746",
    conversionLabel: "8k5ZCMng5P4bENq-9ftC", // Conversion achat
    contactConversionLabel: "QhySCMKaqoocENq-9ftC", // Conversion contact
    phoneConversionLabel: "jN4rCMzZtIocENq-9ftC", // Conversion téléphone
  },

  // Meta (Facebook) Pixel
  meta: {
    pixelId: "PLACEHOLDER_META_PIXEL", // À configurer si nécessaire
  },

  // Conversion values
  conversionValues: {
    purchase: 90, // Valeur achat en €
    contact: 15, // Valeur contact en €
    phoneClick: 1, // Valeur clic téléphone en €
  },
};

export default trackingConfig;
