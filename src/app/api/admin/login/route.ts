// ============================================
// REKAIRE - Admin Login API
// Vérifie whitelist et envoie Magic Link
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { isAdminWhitelisted, logAdminAction } from '@/lib/supabase-admin';

// Rate limiting simple
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts?: number } {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);

  if (attempts) {
    // Reset si le lockout est passé
    if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
      loginAttempts.delete(ip);
      return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
    }

    if (attempts.count >= MAX_ATTEMPTS) {
      return { allowed: false, remainingAttempts: 0 };
    }

    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - attempts.count };
  }

  return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
}

function recordAttempt(ip: string) {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);

  if (attempts) {
    attempts.count++;
    attempts.lastAttempt = now;
  } else {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Récupérer l'IP (pour le rate limiting)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Vérifier le rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Vérifier si l'email est dans la whitelist
    const isWhitelisted = await isAdminWhitelisted(normalizedEmail);

    if (!isWhitelisted) {
      // Logger la tentative échouée
      await logAdminAction(
        normalizedEmail,
        'LOGIN_ATTEMPT_DENIED',
        'auth',
        undefined,
        { reason: 'not_whitelisted' },
        ip
      );

      // Enregistrer la tentative pour le rate limiting
      recordAttempt(ip);

      // Réponse volontairement vague pour ne pas révéler les emails autorisés
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Envoyer le Magic Link via Supabase
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error: otpError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: normalizedEmail,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rekaire.fr'}/admin/callback`
      }
    });

    // Alternative: utiliser signInWithOtp standard
    if (otpError) {
      // Fallback vers la méthode standard
      const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error: signInError } = await supabaseClient.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rekaire.fr'}/admin/callback`,
          shouldCreateUser: true // Supabase doit pouvoir créer l'utilisateur auth
        }
      });

      if (signInError) {
        console.error('Magic link error:', signInError);
        return NextResponse.json(
          { error: 'Erreur lors de l\'envoi du lien' },
          { status: 500 }
        );
      }
    }

    // Logger la tentative réussie
    await logAdminAction(
      normalizedEmail,
      'MAGIC_LINK_SENT',
      'auth',
      undefined,
      { ip_address: ip },
      ip
    );

    return NextResponse.json({ 
      success: true,
      message: 'Un lien de connexion a été envoyé à votre email'
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
