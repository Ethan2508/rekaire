// ============================================
// REKAIRE - Admin Orders API
// CRUD pour gestion des commandes
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  getOrders, 
  getOrderById, 
  updateTrackingNumber, 
  markOrderDelivered,
  updateOrderStatus,
  logAdminAction,
  isAdminWhitelisted
} from '@/lib/supabase-admin';
import { sendShippingEmail } from '@/lib/email';

// Middleware d'authentification admin
async function verifyAdminAuth(request: NextRequest): Promise<{ 
  authorized: boolean; 
  email?: string;
  error?: string;
}> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return { authorized: false, error: 'Token manquant' };
  }

  const token = authHeader.substring(7);

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user?.email) {
      return { authorized: false, error: 'Token invalide' };
    }

    // Vérifier whitelist
    const isWhitelisted = await isAdminWhitelisted(user.email);
    if (!isWhitelisted) {
      return { authorized: false, error: 'Non autorisé' };
    }

    return { authorized: true, email: user.email };
  } catch {
    return { authorized: false, error: 'Erreur d\'authentification' };
  }
}

/**
 * GET /api/admin/orders - Liste des commandes
 * Query params: status, limit, offset
 */
export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  const orders = await getOrders({ status, limit, offset });

  // Log de l'accès
  await logAdminAction(
    auth.email!,
    'VIEW_ORDERS',
    'orders',
    undefined,
    { status, limit, offset, count: orders.length }
  );

  return NextResponse.json({ orders });
}

/**
 * PATCH /api/admin/orders - Mise à jour d'une commande
 * Body: { orderId, action, data }
 */
export async function PATCH(request: NextRequest) {
  const auth = await verifyAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId, action, data } = body;

    if (!orderId || !action) {
      return NextResponse.json(
        { error: 'orderId et action requis' },
        { status: 400 }
      );
    }

    let success = false;
    let message = '';

    switch (action) {
      case 'add_tracking': {
        if (!data?.trackingNumber) {
          return NextResponse.json(
            { error: 'trackingNumber requis' },
            { status: 400 }
          );
        }

        success = await updateTrackingNumber(
          orderId, 
          data.trackingNumber,
          data.trackingUrl
        );

        if (success) {
          // Récupérer les détails de la commande pour l'email
          const order = await getOrderById(orderId);
          
          if (order?.customer_email) {
            // Envoyer l'email de suivi
            await sendShippingEmail({
              customerEmail: order.customer_email,
              customerName: order.customer_name,
              orderNumber: order.order_number,
              trackingNumber: data.trackingNumber,
              trackingUrl: data.trackingUrl || `https://www.laposte.fr/outils/suivre-vos-envois?code=${data.trackingNumber}`,
              carrier: 'Colissimo'
            });
          }

          message = 'Tracking ajouté et email envoyé';

          await logAdminAction(
            auth.email!,
            'ADD_TRACKING',
            'order',
            orderId,
            { trackingNumber: data.trackingNumber, emailSent: true }
          );
        }
        break;
      }

      case 'mark_delivered': {
        success = await markOrderDelivered(orderId);
        message = 'Commande marquée comme livrée';

        if (success) {
          await logAdminAction(
            auth.email!,
            'MARK_DELIVERED',
            'order',
            orderId
          );
        }
        break;
      }

      case 'update_status': {
        if (!data?.status) {
          return NextResponse.json(
            { error: 'status requis' },
            { status: 400 }
          );
        }

        const statusResult = await updateOrderStatus(orderId, data.status);
        success = statusResult.success;
        message = statusResult.success 
          ? `Statut mis à jour: ${data.status}`
          : statusResult.error || 'Erreur mise à jour statut';

        if (success) {
          await logAdminAction(
            auth.email!,
            'UPDATE_STATUS',
            'order',
            orderId,
            { newStatus: data.status }
          );
        }
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Action non reconnue' },
          { status: 400 }
        );
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Échec de la mise à jour' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message });

  } catch (error) {
    console.error('Admin orders PATCH error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
