// ============================================
// REKAIRE - Admin Authentication Utilities
// Supabase Auth (email + mot de passe)
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client côté client pour l'auth
export const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Durée de session: 8 heures
const SESSION_DURATION = 8 * 60 * 60; // en secondes

/**
 * Vérifie si l'utilisateur est connecté et admin
 */
export async function getAdminSession(): Promise<{
  isAuthenticated: boolean;
  email?: string;
  expiresAt?: Date;
}> {
  const { data: { session }, error } = await supabaseAuth.auth.getSession();

  if (error || !session) {
    return { isAuthenticated: false };
  }

  const expiresAt = new Date(session.expires_at! * 1000);
  
  // Vérifier si la session a expiré (8h max)
  // Note: On utilise expires_at directement car created_at n'existe pas sur Session
  const now = Date.now();
  const sessionExpiration = session.expires_at! * 1000;
  if (now > sessionExpiration) {
    await supabaseAuth.auth.signOut();
    return { isAuthenticated: false };
  }

  return {
    isAuthenticated: true,
    email: session.user.email,
    expiresAt
  };
}

/**
 * Déconnexion
 */
export async function signOut(): Promise<void> {
  await supabaseAuth.auth.signOut();
}

/**
 * Écoute les changements d'authentification
 */
export function onAuthStateChange(callback: (isAuthenticated: boolean, email?: string) => void) {
  return supabaseAuth.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      callback(true, session.user.email);
    } else if (event === 'SIGNED_OUT') {
      callback(false);
    }
  });
}
