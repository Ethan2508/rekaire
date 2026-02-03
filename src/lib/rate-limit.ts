// ============================================
// REKAIRE - Rate Limiting Middleware
// Protection contre abus API
// ============================================

import { NextRequest, NextResponse } from "next/server";

// Stockage en mémoire des tentatives (pour production, utiliser Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 10; // 10 requêtes max par minute

export function rateLimit(request: NextRequest): NextResponse | null {
  // Obtenir l'IP du client
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const rateLimitData = rateLimitMap.get(ip);

  if (!rateLimitData || now > rateLimitData.resetTime) {
    // Première requête ou fenêtre expirée
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return null; // Pas de limite
  }

  if (rateLimitData.count >= MAX_REQUESTS) {
    // Limite atteinte
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((rateLimitData.resetTime - now) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimitData.resetTime - now) / 1000)),
          "X-RateLimit-Limit": String(MAX_REQUESTS),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rateLimitData.resetTime),
        },
      }
    );
  }

  // Incrémenter le compteur
  rateLimitData.count++;
  rateLimitMap.set(ip, rateLimitData);

  return null; // Pas de limite
}

// Nettoyer les anciennes entrées toutes les 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);
