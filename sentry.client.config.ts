// ============================================
// REKAIRE - Sentry Client Configuration
// Monitoring des erreurs côté client
// ============================================

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Environnement
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
  
  // Taux d'échantillonnage des transactions (performance monitoring)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Taux d'échantillonnage des replays (session replay)
  replaysSessionSampleRate: 0.1, // 10% des sessions
  replaysOnErrorSampleRate: 1.0, // 100% des sessions avec erreur
  
  // Ignorer certaines erreurs communes
  ignoreErrors: [
    // Erreurs réseau
    'NetworkError',
    'Failed to fetch',
    'Network request failed',
    // Erreurs navigateur
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    // Extensions navigateur
    'Non-Error promise rejection captured',
  ],
  
  // Filtrer les données sensibles
  beforeSend(event, hint) {
    // Supprimer les données de paiement des logs
    if (event.request?.data) {
      const data = event.request.data as any;
      if (typeof data === 'object') {
        delete data.card;
        delete data.cardNumber;
        delete data.cvv;
        delete data.password;
      }
    }
    
    return event;
  },
  
  // Intégrations
  integrations: [],
});
