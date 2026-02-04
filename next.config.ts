import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Variables d'environnement exposées
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || 'development',
  },
};

// Configuration Sentry
const sentryConfig = {
  silent: true, // Supprime les logs Sentry pendant le build
  hideSourceMaps: true, // Cache les source maps en prod
  disableLogger: true, // Désactive les logs Sentry
};

export default process.env.NEXT_PUBLIC_SENTRY_DSN 
  ? withSentryConfig(nextConfig, sentryConfig)
  : nextConfig;
