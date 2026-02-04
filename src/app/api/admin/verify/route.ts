// ============================================
// REKAIRE - Admin Verify API
// Vérifie que l'utilisateur connecté est dans la whitelist
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminWhitelisted, logAdminAction } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const token = authHeader.substring(7);

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user?.email) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    // Vérifier la whitelist
    const isWhitelisted = await isAdminWhitelisted(user.email);
    
    if (!isWhitelisted) {
      // Logger la tentative
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
      await logAdminAction(
        user.email,
        'ACCESS_DENIED',
        'admin',
        undefined,
        { reason: 'not_whitelisted' },
        ip
      );

      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    // Logger l'accès réussi
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    await logAdminAction(
      user.email,
      'LOGIN_SUCCESS',
      'admin',
      undefined,
      {},
      ip
    );

    return NextResponse.json({ 
      success: true, 
      email: user.email 
    });

  } catch (error) {
    console.error('Admin verify error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
