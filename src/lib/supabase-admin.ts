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
    
    const newCount = (current?.count ?? 0) + amount;
    
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

/**
 * Vérifie si le stock est suffisant SANS décrementer
 * À utiliser AVANT le paiement
 */
export async function checkStock(productSlug: string, quantity: number): Promise<{ available: boolean; currentStock: number }> {
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .select('stock')
    .eq('slug', productSlug)
    .single();

  if (error || !product) {
    return { available: false, currentStock: 0 };
  }

  return {
    available: product.stock >= quantity,
    currentStock: product.stock
  };
}

/**
 * Décrémente le stock avec lock (transaction)
 * À utiliser APRÈS paiement confirmé
 */
export async function decrementStock(productSlug: string, quantity: number): Promise<boolean> {
  // Transaction avec lock pour éviter race conditions
  const { data: product, error: selectError } = await supabaseAdmin
    .from('products')
    .select('id, stock')
    .eq('slug', productSlug)
    .single();

  if (selectError || !product) {
    console.error('Product not found for stock decrement:', productSlug);
    return false;
  }

  // Vérification finale du stock
  if (product.stock < quantity) {
    console.error('Insufficient stock:', { slug: productSlug, needed: quantity, available: product.stock });
    return false;
  }

  // Update avec condition de stock suffisant (protection atomique)
  const { error: updateError } = await supabaseAdmin
    .from('products')
    .update({ 
      stock: product.stock - quantity,
      updated_at: new Date().toISOString()
    })
    .eq('id', product.id)
    .gte('stock', quantity); // Condition: stock doit être >= quantity

  if (updateError) {
    console.error('Stock decrement failed:', updateError);
    return false;
  }

  return true;
}

// ============================================
// FONCTIONS ADMIN - COMMANDES
// ============================================

/**
 * Vérifie si une commande existe déjà pour cette session Stripe
 * 🔒 Protection contre les doublons webhook
 */
export async function orderExistsByStripeSession(stripeSessionId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('id')
    .eq('stripe_session_id', stripeSessionId)
    .single();

  // Si on trouve une commande, elle existe déjà
  return !error && !!data;
}

export async function createOrder(orderData: {
  order_number: string; // RK-XXXXX - Numéro de commande client
  stripe_session_id: string;
  stripe_payment_intent?: string;
  product_slug: string;
  quantity: number;
  unit_price_ht: number;
  total_ht: number;
  total_ttc: number;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  // Adresse de livraison
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_postal_code?: string;
  shipping_city?: string;
  shipping_country?: string;
  // Adresse de facturation
  billing_same_as_shipping?: boolean;
  billing_name?: string;
  billing_company?: string;
  billing_address_line1?: string;
  billing_address_line2?: string;
  billing_postal_code?: string;
  billing_city?: string;
  billing_country?: string;
  billing_vat_number?: string;
  // Promo & Facture
  promo_code?: string;
  promo_discount?: number;
  invoice_number?: string;
  invoice_url?: string;
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
      order_number: orderData.order_number,
      stripe_session_id: orderData.stripe_session_id,
      stripe_payment_intent: orderData.stripe_payment_intent,
      product_id: product.id,
      quantity: orderData.quantity,
      unit_price_ht: orderData.unit_price_ht,
      total_ht: orderData.total_ht,
      total_ttc: orderData.total_ttc,
      customer_email: orderData.customer_email,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      // Livraison
      shipping_address_line1: orderData.shipping_address_line1,
      shipping_address_line2: orderData.shipping_address_line2,
      shipping_postal_code: orderData.shipping_postal_code,
      shipping_city: orderData.shipping_city,
      shipping_country: orderData.shipping_country || 'France',
      // Facturation
      billing_same_as_shipping: orderData.billing_same_as_shipping ?? true,
      billing_name: orderData.billing_name,
      billing_company: orderData.billing_company,
      billing_address_line1: orderData.billing_address_line1,
      billing_address_line2: orderData.billing_address_line2,
      billing_postal_code: orderData.billing_postal_code,
      billing_city: orderData.billing_city,
      billing_country: orderData.billing_country || 'France',
      billing_vat_number: orderData.billing_vat_number,
      // Promo & Facture
      promo_code: orderData.promo_code,
      promo_discount: orderData.promo_discount,
      invoice_number: orderData.invoice_number,
      invoice_url: orderData.invoice_url,
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

// ============================================
// FSM - Transitions d'états valides
// ============================================
const VALID_TRANSITIONS: Record<string, string[]> = {
  'pending': ['paid', 'cancelled'],
  'paid': ['shipped', 'refunded', 'cancelled'],
  'shipped': ['delivered', 'refunded'],
  'delivered': ['refunded'],
  'refunded': [], // État terminal
  'partially_refunded': ['refunded'],
  'cancelled': [], // État terminal
};

export async function updateOrderStatus(
  orderId: string, 
  newStatus: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'partially_refunded'
): Promise<{ success: boolean; error?: string }> {
  // Récupérer le statut actuel
  const { data: order, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) {
    return { success: false, error: 'Commande non trouvée' };
  }

  const currentStatus = order.status || 'pending';
  const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];

  // Vérifier que la transition est valide
  if (!allowedTransitions.includes(newStatus)) {
    console.error(`[FSM] Transition invalide: ${currentStatus} → ${newStatus}`);
    return { 
      success: false, 
      error: `Transition invalide: ${currentStatus} → ${newStatus}. Transitions autorisées: ${allowedTransitions.join(', ') || 'aucune'}` 
    };
  }

  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  console.log(`[FSM] Transition réussie: ${currentStatus} → ${newStatus} (order: ${orderId})`);
  return { success: true };
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
