import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimitDB } from "@/lib/rate-limit";

// ============================================
// REKAIRE - API Lead (Capture contacts sécurisée)
// Rate limit + Honeypot + Turnstile CAPTCHA + Validation
// ============================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

// Validation email stricte
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Domaines email temporaires bloqués
const BLOCKED_DOMAINS = [
  'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'mailinator.com',
  '10minutemail.com', 'yopmail.com', 'temp-mail.org', 'fakeinbox.com',
];

function isValidEmail(email: string): boolean {
  if (!EMAIL_REGEX.test(email)) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return !BLOCKED_DOMAINS.some(blocked => domain.includes(blocked));
}

// Vérification Cloudflare Turnstile
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) {
    console.warn('[Lead API] ⚠️ TURNSTILE_SECRET_KEY non configuré');
    return true; // Fail open en dev
  }
  
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: ip,
      }),
    });
    
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('[Lead API] Turnstile verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  // 🔒 RATE LIMITING (5 requêtes/minute pour les leads)
  const rateLimitResponse = await rateLimitDB(request, {
    maxRequests: 5,
    keyPrefix: "lead",
  });
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const {
      email,
      firstName,
      lastName,
      phone,
      isCompany,
      companyName,
      source,
      address,
      postalCode,
      city,
      // 🔒 HONEYPOT fields (doivent être vides)
      honeypot,
      website,
      fax,
      // 🔒 TURNSTILE token
      turnstileToken,
    } = body;

    // 🔒 HONEYPOT CHECK (les bots remplissent ces champs)
    if (honeypot || website || fax) {
      console.log('[Lead API] 🤖 Bot détecté via honeypot');
      // Retourner success pour ne pas alerter le bot
      return NextResponse.json({ success: true });
    }

    // Récupérer IP pour vérification
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               request.headers.get("x-real-ip") || "unknown";

    // 🔒 TURNSTILE VERIFICATION
    if (TURNSTILE_SECRET && turnstileToken) {
      const isHuman = await verifyTurnstile(turnstileToken, ip);
      if (!isHuman) {
        console.log('[Lead API] 🤖 Turnstile verification failed');
        return NextResponse.json({ success: true }); // Fail silently
      }
    }

    // Validation email obligatoire
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Validation format email
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Récupérer user-agent pour audit
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Upsert: crée ou met à jour le lead
    const { data, error } = await supabase
      .from("leads")
      .upsert(
        {
          email,
          first_name: firstName || null,
          last_name: lastName || null,
          phone: phone || null,
          is_company: isCompany || false,
          company_name: companyName || null,
          source: source || "checkout",
          address: address || null,
          postal_code: postalCode || null,
          city: city || null,
          updated_at: new Date().toISOString(),
          // Audit trail
          last_ip: ip,
          last_user_agent: userAgent,
        },
        {
          onConflict: "email",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) {
      console.error("[Lead API] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[Lead API] Lead saved:", email, "IP:", ip);

    return NextResponse.json({ success: true, lead: data });
  } catch (error) {
    console.error("[Lead API] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
