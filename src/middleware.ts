// ============================================
// REKAIRE - Middleware
// Routage FR/ES par domaine + redirection géographique
// + Headers de sécurité + Rate limiting
// ============================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ES_HOSTS,
  FR_HOSTS,
  ES_INTERNAL_PREFIX,
  SITE_URLS,
  SITE_CHOICE_COOKIE,
  SITE_CHOICE_PARAM,
  equivalentPath,
  type SiteId,
} from '@/config/sites';

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

// ========================================
// Sites FR / ES
// ========================================

const IS_PRODUCTION = process.env.VERCEL_ENV === 'production';
// Hors production (previews Vercel, local) : ?site=es mémorise la version à afficher
const PREVIEW_SITE_COOKIE = 'rk_preview_site';

// Robots et outils d'audit : jamais de redirection géographique (sinon le .es ne serait pas indexé)
const BOT_UA = /bot|crawl|spider|slurp|lighthouse|pagespeed|headless|facebookexternalhit|linkedin|whatsapp|semrush|ahrefs|bingpreview|yandex|baidu|duckduck/i;

// Pages FR à ne jamais rediriger (tunnel de commande, admin)
const NO_GEO_PATHS = ['/checkout', '/success', '/cancel', '/admin'];

function getHost(request: NextRequest): string {
  return (request.headers.get('host') || '').split(':')[0].toLowerCase();
}

function resolveSite(request: NextRequest, host: string): { site: SiteId; setPreviewCookie?: SiteId } {
  if (ES_HOSTS.includes(host)) return { site: 'es' };
  if (FR_HOSTS.includes(host)) return { site: 'fr' };
  if (host.startsWith('es.')) return { site: 'es' }; // es.localhost en local

  if (!IS_PRODUCTION) {
    const param = request.nextUrl.searchParams.get('site');
    if (param === 'es' || param === 'fr') return { site: param, setPreviewCookie: param };
    if (request.cookies.get(PREVIEW_SITE_COOKIE)?.value === 'es') return { site: 'es' };
  }
  return { site: 'fr' };
}

// Fichiers statiques et routes techniques : servis tels quels quel que soit le domaine
function isTechnicalPath(pathname: string): boolean {
  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/monitoring') ||
    pathname.startsWith('/.well-known') ||
    (/\.[a-z0-9]+$/i.test(pathname) && pathname !== '/sitemap.xml' && pathname !== '/robots.txt')
  );
}

function geoRedirect(request: NextRequest, host: string, site: SiteId): NextResponse | null {
  const isRealDomain = ES_HOSTS.includes(host) || FR_HOSTS.includes(host);
  if (!isRealDomain || request.method !== 'GET') return null;

  const { pathname, searchParams } = request.nextUrl;
  if (NO_GEO_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
  if (BOT_UA.test(request.headers.get('user-agent') || '')) return null;
  // Choix explicite du visiteur (sélecteur de langue) : on le respecte
  if (request.cookies.has(SITE_CHOICE_COOKIE) || searchParams.has(SITE_CHOICE_PARAM)) return null;

  const country = request.headers.get('x-vercel-ip-country');
  const target: SiteId | null =
    site === 'fr' && country === 'ES' ? 'es' :
    site === 'es' && country === 'FR' ? 'fr' :
    null;
  if (!target) return null;

  const url = new URL(equivalentPath(site, pathname), SITE_URLS[target]);
  const response = NextResponse.redirect(url, 307);
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

function routeSite(request: NextRequest): NextResponse {
  const host = getHost(request);
  const { pathname, searchParams } = request.nextUrl;
  const { site, setPreviewCookie } = resolveSite(request, host);

  let response: NextResponse | null = null;

  if (!isTechnicalPath(pathname)) {
    response = geoRedirect(request, host, site);

    if (!response && site === 'es') {
      if (pathname === ES_INTERNAL_PREFIX || pathname.startsWith(`${ES_INTERNAL_PREFIX}/`)) {
        // rekaire.es/es/rk01 → rekaire.es/rk01
        const url = request.nextUrl.clone();
        url.pathname = pathname.slice(ES_INTERNAL_PREFIX.length) || '/';
        response = NextResponse.redirect(url, 308);
      } else {
        const url = request.nextUrl.clone();
        url.pathname = pathname === '/' ? ES_INTERNAL_PREFIX : `${ES_INTERNAL_PREFIX}${pathname}`;
        response = NextResponse.rewrite(url);
      }
    }

    // Pages espagnoles appelées depuis rekaire.fr → rekaire.es
    if (!response && site === 'fr' && IS_PRODUCTION &&
        (pathname === ES_INTERNAL_PREFIX || pathname.startsWith(`${ES_INTERNAL_PREFIX}/`))) {
      const url = new URL(pathname.slice(ES_INTERNAL_PREFIX.length) || '/', SITE_URLS.es);
      response = NextResponse.redirect(url, 308);
    }
  }

  response ??= NextResponse.next();

  const choice = searchParams.get(SITE_CHOICE_PARAM);
  if (choice === 'fr' || choice === 'es') {
    response.cookies.set(SITE_CHOICE_COOKIE, choice, { maxAge: 60 * 60 * 24 * 365, path: '/', sameSite: 'lax' });
  }
  if (setPreviewCookie) {
    response.cookies.set(PREVIEW_SITE_COOKIE, setPreviewCookie, { path: '/', sameSite: 'lax' });
  }

  return response;
}

export function middleware(request: NextRequest) {
  // ========================================
  // Rate limiting sur les API
  // ========================================
  if (request.nextUrl.pathname.startsWith('/api/') && !request.nextUrl.pathname.includes('/webhook/')) {
    // Les webhooks ont leur propre protection
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

  const response = routeSite(request);

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
      "script-src 'self' 'unsafe-inline' https://js.stripe.com https://challenges.cloudflare.com https://www.googletagmanager.com https://connect.facebook.net https://www.google.com https://googleads.g.doubleclick.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self'",
      "connect-src 'self' https://api.stripe.com https://*.sanity.io https://*.supabase.co https://api-adresse.data.gouv.fr https://challenges.cloudflare.com https://www.google-analytics.com https://region1.google-analytics.com https://www.google.com https://www.googletagmanager.com https://googleads.g.doubleclick.net https://*.google.com https://*.sentry.io https://*.ingest.de.sentry.io https://pagead2.googlesyndication.com",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google.com",
      "media-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "worker-src 'self' blob:",
    ].join('; ')
  );

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
