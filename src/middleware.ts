// ============================================
// REKAIRE - Middleware Sécurité
// Headers de sécurité + Rate limiting
// ============================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting en mémoire (simple, pour prod utiliser Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requêtes/minute

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'anonymous';
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  record.count++;
  return record.count > RATE_LIMIT_MAX_REQUESTS;
}

// Nettoyer périodiquement les anciennes entrées
function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, record] of rateLimit.entries()) {
    if (now > record.resetTime) {
      rateLimit.delete(key);
    }
  }
}

// Nettoyage toutes les 5 minutes
setInterval(cleanupRateLimit, 5 * 60 * 1000);

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // ========================================
  // Headers de sécurité
  // ========================================
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://connect.facebook.net https://www.google.com https://googleads.g.doubleclick.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self'",
      "connect-src 'self' https://api.stripe.com https://*.sanity.io https://*.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://www.google.com https://www.googletagmanager.com https://googleads.g.doubleclick.net https://*.google.com",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.googletagmanager.com https://www.google.com",
      "media-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
    ].join('; ')
  );
  
  // ========================================
  // Rate limiting sur les API
  // ========================================
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Exceptions pour les webhooks (ils ont leur propre protection)
    if (request.nextUrl.pathname.includes('/webhook/')) {
      return response;
    }
    
    const key = getRateLimitKey(request);
    
    if (isRateLimited(key)) {
      console.log(`🚫 Rate limit exceeded for IP: ${key}`);
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez dans 1 minute.' },
        { 
          status: 429, 
          headers: { 
            'Retry-After': '60',
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
          } 
        }
      );
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    // API routes
    '/api/:path*',
    // Pages (pour les headers de sécurité, exclure assets)
    '/((?!_next/static|_next/image|favicon.ico|images|videos|fonts).*)',
  ],
};
