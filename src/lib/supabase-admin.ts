// ============================================
// REKAIRE - Supabase Admin Client (Server-side only)
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client admin pour le backend (bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// ============================================
// FONCTIONS ADMIN - COMPTEUR
// ============================================

export async function incrementSalesCounter(amount: number = 1): Promise<number> {
  const { data, error } = await supabaseAdmin.rpc('increment_sales_counter', { amount });
  
  if (error) {
    // Fallback: faire manuellement
    const { data: current } = await supabaseAdmin
      .from('sales_counter')
      .select('count')
      .eq('id', 1)
      .single();
    
    const newCount = (current?.count ?? 2847) + amount;
    
    await supabaseAdmin
      .from('sales_counter')
      .update({ count: newCount, updated_at: new Date().toISOString() })
      .eq('id', 1);
    
    return newCount;
  }
  
  return data;
}

// ============================================
// FONCTIONS ADMIN - STOCK
// ============================================

export async function decrementStock(productSlug: string, quantity: number): Promise<boolean> {
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('id, stock')
    .eq('slug', productSlug)
    .single();

  if (!product || product.stock < quantity) {
    return false;
  }

  const { error } = await supabaseAdmin
    .from('products')
    .update({ 
      stock: product.stock - quantity,
      updated_at: new Date().toISOString()
    })
    .eq('id', product.id);

  return !error;
}

// ============================================
// FONCTIONS ADMIN - COMMANDES
// ============================================

export async function createOrder(orderData: {
  stripe_session_id: string;
  stripe_payment_intent?: string;
  product_slug: string;
  quantity: number;
  unit_price_ht: number;
  total_ht: number;
  total_ttc: number;
  customer_email?: string;
  customer_name?: string;
  shipping_city?: string;
}): Promise<string | null> {
  // Récupérer le product_id
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('slug', orderData.product_slug)
    .single();

  if (!product) {
    console.error('Product not found:', orderData.product_slug);
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert({
      stripe_session_id: orderData.stripe_session_id,
      stripe_payment_intent: orderData.stripe_payment_intent,
      product_id: product.id,
      quantity: orderData.quantity,
      unit_price_ht: orderData.unit_price_ht,
      total_ht: orderData.total_ht,
      total_ttc: orderData.total_ttc,
      customer_email: orderData.customer_email,
      customer_name: orderData.customer_name,
      shipping_city: orderData.shipping_city,
      status: 'paid'
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return null;
  }

  return data.id;
}

export async function updateOrderStatus(
  orderId: string, 
  status: 'paid' | 'shipped' | 'delivered' | 'cancelled'
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  return !error;
}

// ============================================
// FONCTIONS ADMIN - CODES PROMO
// ============================================

export async function incrementPromoCodeUse(code: string): Promise<boolean> {
  const { data: promo } = await supabaseAdmin
    .from('promo_codes')
    .select('id, current_uses')
    .eq('code', code.toUpperCase())
    .single();

  if (!promo) return false;

  const { error } = await supabaseAdmin
    .from('promo_codes')
    .update({ current_uses: promo.current_uses + 1 })
    .eq('id', promo.id);

  return !error;
}

// ============================================
// FONCTIONS ADMIN - PRODUITS
// ============================================

export async function updateProductPrice(
  slug: string, 
  newPriceHT: number
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('products')
    .update({ 
      price_ht: newPriceHT,
      updated_at: new Date().toISOString()
    })
    .eq('slug', slug);

  return !error;
}

export async function updateProductDiscount(
  slug: string, 
  discountPercent: number
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('products')
    .update({ 
      discount_percent: discountPercent,
      updated_at: new Date().toISOString()
    })
    .eq('slug', slug);

  return !error;
}

export async function updateProductStock(
  slug: string, 
  stock: number
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('products')
    .update({ 
      stock: stock,
      updated_at: new Date().toISOString()
    })
    .eq('slug', slug);

  return !error;
}

// ============================================
// FONCTIONS ADMIN - FACTURES
// ============================================

/**
 * Génère le prochain numéro de facture au format FW-YYYY-XXXX
 */
export async function getNextInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  
  // Essaie d'utiliser la fonction RPC si disponible
  const { data: invoiceNum, error: rpcError } = await supabaseAdmin
    .rpc('get_next_invoice_number');
  
  if (!rpcError && invoiceNum) {
    return invoiceNum;
  }
  
  // Fallback: gérer manuellement
  const { data: sequence } = await supabaseAdmin
    .from('invoice_sequence')
    .select('last_number')
    .eq('year', currentYear)
    .single();
  
  let nextNum = 1;
  
  if (sequence) {
    nextNum = sequence.last_number + 1;
    await supabaseAdmin
      .from('invoice_sequence')
      .update({ last_number: nextNum })
      .eq('year', currentYear);
  } else {
    // Créer l'entrée pour cette année
    await supabaseAdmin
      .from('invoice_sequence')
      .insert({ year: currentYear, last_number: 1 });
  }
  
  return `FW-${currentYear}-${String(nextNum).padStart(4, '0')}`;
}

/**
 * Enregistre l'URL de la facture pour une commande
 */
export async function saveInvoiceUrl(
  orderId: string, 
  invoiceNumber: string,
  invoiceUrl: string
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ 
      invoice_number: invoiceNumber,
      invoice_url: invoiceUrl,
      invoice_generated_at: new Date().toISOString()
    })
    .eq('id', orderId);

  return !error;
}

// ============================================
// FONCTIONS ADMIN - TRACKING & EXPÉDITION
// ============================================

/**
 * Met à jour le numéro de tracking d'une commande
 */
export async function updateTrackingNumber(
  orderId: string, 
  trackingNumber: string,
  trackingUrl?: string
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ 
      tracking_number: trackingNumber,
      tracking_url: trackingUrl || `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`,
      status: 'shipped',
      shipped_at: new Date().toISOString()
    })
    .eq('id', orderId);

  return !error;
}

/**
 * Marque une commande comme livrée
 */
export async function markOrderDelivered(orderId: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ 
      status: 'delivered',
      delivered_at: new Date().toISOString()
    })
    .eq('id', orderId);

  return !error;
}

// ============================================
// FONCTIONS ADMIN - RÉCUPÉRATION COMMANDES
// ============================================

export interface OrderDetails {
  id: string;
  order_number: string;
  status: string;
  quantity: number;
  unit_price_ht: number;
  total_ht: number;
  total_ttc: number;
  promo_code?: string;
  promo_discount?: number;
  customer_email: string;
  customer_name?: string;
  customer_phone?: string;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_postal_code?: string;
  shipping_city?: string;
  shipping_country?: string;
  tracking_number?: string;
  tracking_url?: string;
  invoice_number?: string;
  invoice_url?: string;
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
}

/**
 * Récupère toutes les commandes avec filtres optionnels
 */
export async function getOrders(options?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<OrderDetails[]> {
  let query = supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options?.limit || 50) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data || [];
}

/**
 * Récupère une commande par son ID
 */
export async function getOrderById(orderId: string): Promise<OrderDetails | null> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data;
}

/**
 * Récupère les commandes à expédier (statut = paid)
 */
export async function getOrdersToShip(): Promise<OrderDetails[]> {
  return getOrders({ status: 'paid' });
}

// ============================================
// FONCTIONS ADMIN - AUDIT LOG
// ============================================

export async function logAdminAction(
  adminEmail: string,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: Record<string, unknown>,
  ipAddress?: string
): Promise<void> {
  try {
    await supabaseAdmin
      .from('admin_audit_log')
      .insert({
        admin_email: adminEmail,
        action,
        target_type: targetType,
        target_id: targetId,
        details,
        ip_address: ipAddress
      });
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
}

// ============================================
// FONCTIONS ADMIN - WHITELIST
// ============================================

export async function isAdminWhitelisted(email: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('admin_whitelist')
    .select('is_active')
    .eq('email', email.toLowerCase())
    .single();

  if (error || !data) {
    return false;
  }

  return data.is_active === true;
}
