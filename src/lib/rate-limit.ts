// ============================================
// REKAIRE - Rate Limiting avec Supabase
// Protection contre abus API (persistant, serverless-safe)
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase admin pour bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_DEFAULT = 10; // 10 requêtes max par minute

interface RateLimitConfig {
  windowMs?: number;
  maxRequests?: number;
  keyPrefix?: string; // Pour différencier les routes
}

/**
 * Rate limiter basé sur Supabase (persistant entre instances serverless)
 * Utilise la table 'rate_limits' avec colonnes: key, count, expires_at
 */
export async function rateLimitDB(
  request: NextRequest,
  config: RateLimitConfig = {}
): Promise<NextResponse | null> {
  const {
    windowMs = RATE_LIMIT_WINDOW_MS,
    maxRequests = MAX_REQUESTS_DEFAULT,
    keyPrefix = "default",
  } = config;

  // Construire la clé unique (IP + route prefix)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  
  const key = `${keyPrefix}:${ip}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowMs);

  try {
    // Vérifier/mettre à jour le rate limit en une seule requête
    const { data, error } = await supabaseAdmin.rpc("check_rate_limit", {
      p_key: key,
      p_max_requests: maxRequests,
      p_window_ms: windowMs,
    });

    if (error) {
      // En cas d'erreur DB, on laisse passer (fail-open pour ne pas bloquer le business)
      console.error("[RateLimit] DB error:", error);
      return null;
    }

    // Si la fonction RPC n'existe pas, fallback sur logique manuelle
    if (data === null) {
      return await rateLimitFallback(key, maxRequests, windowMs, expiresAt);
    }

    const { allowed, remaining, reset_at } = data;

    if (!allowed) {
      const resetTime = new Date(reset_at).getTime();
      const retryAfter = Math.ceil((resetTime - now.getTime()) / 1000);

      return NextResponse.json(
        {
          error: "Trop de requêtes. Réessayez plus tard.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(maxRequests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(resetTime),
          },
        }
      );
    }

    // Ajouter headers informatifs (optionnel)
    // La requête sera traitée normalement
    return null;
  } catch (error) {
    console.error("[RateLimit] Error:", error);
    // Fail-open: en cas d'erreur, on laisse passer
    return null;
  }
}

/**
 * Fallback si la fonction RPC n'existe pas
 */
async function rateLimitFallback(
  key: string,
  maxRequests: number,
  windowMs: number,
  expiresAt: Date
): Promise<NextResponse | null> {
  const now = new Date();

  // Récupérer ou créer l'entrée
  const { data: existing } = await supabaseAdmin
    .from("rate_limits")
    .select("count, expires_at")
    .eq("key", key)
    .single();

  if (!existing || new Date(existing.expires_at) < now) {
    // Nouvelle fenêtre ou expirée
    await supabaseAdmin.from("rate_limits").upsert({
      key,
      count: 1,
      expires_at: expiresAt.toISOString(),
    });
    return null;
  }

  if (existing.count >= maxRequests) {
    const resetTime = new Date(existing.expires_at).getTime();
    const retryAfter = Math.ceil((resetTime - now.getTime()) / 1000);

    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez plus tard.", retryAfter },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(maxRequests),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // Incrémenter le compteur
  await supabaseAdmin
    .from("rate_limits")
    .update({ count: existing.count + 1 })
    .eq("key", key);

  return null;
}

// ============================================
// LEGACY: Rate limit en mémoire (pour compatibilité)
// ⚠️ Ne pas utiliser en production serverless
// ============================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(request: NextRequest): NextResponse | null {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const rateLimitData = rateLimitMap.get(ip);

  if (!rateLimitData || now > rateLimitData.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return null;
  }

  if (rateLimitData.count >= MAX_REQUESTS_DEFAULT) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((rateLimitData.resetTime - now) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimitData.resetTime - now) / 1000)),
          "X-RateLimit-Limit": String(MAX_REQUESTS_DEFAULT),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  rateLimitData.count++;
  rateLimitMap.set(ip, rateLimitData);
  return null;
}
