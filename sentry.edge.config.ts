// ============================================
// REKAIRE - Sentry Edge Configuration
// Monitoring des erreurs dans le middleware Edge
// ============================================

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Environnement
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
  
  // Taux d'échantillonnage réduit pour Edge (coût)
  tracesSampleRate: 0.01, // 1% seulement
});
