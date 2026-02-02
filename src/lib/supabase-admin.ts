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
