import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ============================================
// API Admin - Gestion des Codes Promo
// GET: Liste tous les codes promo
// POST: Créer un nouveau code promo
// PATCH: Modifier un code existant
// DELETE: Supprimer un code promo
// ============================================

// Client admin avec service_role qui bypasse la RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Vérification admin
async function verifyAdmin(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('[Admin Promos] No auth header');
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    console.log('[Admin Promos] Invalid token or no user');
    return null;
  }

  // Vérifier que c'est un admin autorisé - support ADMIN_EMAILS et ADMIN_EMAIL
  const adminEmailsEnv = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '';
  const adminEmails = adminEmailsEnv.split(',').map(e => e.trim().toLowerCase()).filter(e => e);
  
  console.log('[Admin Promos] User email:', user.email, '| Allowed:', adminEmails);
  
  if (!adminEmails.includes(user.email?.toLowerCase() || '')) {
    console.log('[Admin Promos] Email not in admin list');
    return null;
  }

  return user.email || null;
}

// ============================================
// GET - Liste des codes promo
// ============================================
export async function GET(request: NextRequest) {
  try {
    const adminEmail = await verifyAdmin(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching promo codes:', error);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    return NextResponse.json({ promoCodes: data || [] });
  } catch (error) {
    console.error('GET promo codes error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// ============================================
// POST - Créer un code promo
// ============================================
export async function POST(request: NextRequest) {
  try {
    const adminEmail = await verifyAdmin(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { code, discount_type, discount_value, max_uses, min_order, valid_until } = body;

    // Validation
    if (!code || !discount_type || !discount_value) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    // Vérifier si le code existe déjà
    const { data: existing } = await supabaseAdmin
      .from('promo_codes')
      .select('id')
      .eq('code', code.toUpperCase())
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Ce code existe déjà' }, { status: 400 });
    }

    // Créer le code
    const { data, error } = await supabaseAdmin
      .from('promo_codes')
      .insert({
        code: code.toUpperCase(),
        discount_type,
        discount_value: discount_type === 'fixed' ? discount_value * 100 : discount_value, // Convertir en centimes si fixe
        max_uses: max_uses || null,
        min_order: min_order || null,
        valid_from: new Date().toISOString(),
        valid_until: valid_until ? new Date(valid_until).toISOString() : null,
        is_active: true,
        current_uses: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating promo code:', error);
      return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
    }

    // Log l'action
    await supabaseAdmin.from('admin_audit_log').insert({
      admin_email: adminEmail,
      action: 'PROMO_CREATED',
      target_type: 'promo_code',
      target_id: data.id,
      details: { code: code.toUpperCase(), discount_type, discount_value }
    });

    return NextResponse.json({ promoCode: data, success: true });
  } catch (error) {
    console.error('POST promo code error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// ============================================
// PATCH - Modifier un code promo
// ============================================
export async function PATCH(request: NextRequest) {
  try {
    const adminEmail = await verifyAdmin(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { id, code, discount_type, discount_value, max_uses, min_order, valid_until, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    // Construire l'objet de mise à jour
    const updateData: Record<string, unknown> = {};
    
    if (code !== undefined) updateData.code = code.toUpperCase();
    if (discount_type !== undefined) updateData.discount_type = discount_type;
    if (discount_value !== undefined) {
      updateData.discount_value = discount_type === 'fixed' ? discount_value * 100 : discount_value;
    }
    if (max_uses !== undefined) updateData.max_uses = max_uses || null;
    if (min_order !== undefined) updateData.min_order = min_order || null;
    if (valid_until !== undefined) {
      updateData.valid_until = valid_until ? new Date(valid_until).toISOString() : null;
    }
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabaseAdmin
      .from('promo_codes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating promo code:', error);
      return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 });
    }

    // Log l'action
    await supabaseAdmin.from('admin_audit_log').insert({
      admin_email: adminEmail,
      action: is_active !== undefined ? (is_active ? 'PROMO_ENABLED' : 'PROMO_DISABLED') : 'PROMO_UPDATED',
      target_type: 'promo_code',
      target_id: id,
      details: updateData
    });

    return NextResponse.json({ promoCode: data, success: true });
  } catch (error) {
    console.error('PATCH promo code error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// ============================================
// DELETE - Supprimer un code promo
// ============================================
export async function DELETE(request: NextRequest) {
  try {
    const adminEmail = await verifyAdmin(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    // Récupérer le code avant suppression pour le log
    const { data: promoCode } = await supabaseAdmin
      .from('promo_codes')
      .select('code')
      .eq('id', id)
      .single();

    const { error } = await supabaseAdmin
      .from('promo_codes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting promo code:', error);
      return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
    }

    // Log l'action
    await supabaseAdmin.from('admin_audit_log').insert({
      admin_email: adminEmail,
      action: 'PROMO_DELETED',
      target_type: 'promo_code',
      target_id: id,
      details: { code: promoCode?.code }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE promo code error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
