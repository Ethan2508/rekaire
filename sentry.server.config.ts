// ============================================
// REKAIRE - Sentry Server Configuration
// Monitoring des erreurs côté serveur
// ============================================

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Environnement
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
  
  // Taux d'échantillonnage des transactions
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Ignorer certaines erreurs
  ignoreErrors: [
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
  ],
  
  // Filtrer les données sensibles
  beforeSend(event, hint) {
    // Ne jamais logger les secrets
    if (event.request?.data) {
      const data = event.request.data as any;
      if (typeof data === 'object') {
        delete data.apiKey;
        delete data.secret;
        delete data.password;
        delete data.token;
      }
    }
    
    // Filtrer les headers sensibles
    if (event.request?.headers) {
      const headers = event.request.headers as any;
      delete headers['authorization'];
      delete headers['cookie'];
    }
    
    return event;
  },
});
