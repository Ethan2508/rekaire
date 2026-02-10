// ============================================
// REKAIRE - Supabase Client Configuration
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client pour le frontend (limité par RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour TypeScript
export interface Product {
  id: string;
  name: string;
  slug: string;
  price_ht: number; // en centimes
  discount_percent: number;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SalesCounter {
  id: number;
  count: number;
  updated_at: string;
}

export interface Order {
  id: string;
  stripe_session_id: string;
  stripe_payment_intent: string;
  product_id: string;
  quantity: number;
  unit_price_ht: number;
  total_ht: number;
  total_ttc: number;
  customer_email: string;
  customer_name: string;
  shipping_city: string;
  status: 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  valid_from: string;
  valid_until: string | null;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  created_at: string;
}

// ============================================
// FONCTIONS PRODUITS
// ============================================

export async function getProduct(slug: string = 'rk01'): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  return data;
}

export async function getProductStock(slug: string = 'rk01'): Promise<number> {
  const product = await getProduct(slug);
  return product?.stock ?? 0;
}

export async function isProductInStock(slug: string = 'rk01'): Promise<boolean> {
  const stock = await getProductStock(slug);
  return stock > 0;
}

// ============================================
// FONCTIONS COMPTEUR DE VENTES
// ============================================

export async function getSalesCount(): Promise<number> {
  const { data, error } = await supabase
    .from('sales_counter')
    .select('count')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Error fetching sales count:', error);
    return 0; // Pas de fallback mensonger
  }
  return data?.count ?? 0;
}

// ============================================
// FONCTIONS CODES PROMO
// ============================================

export async function validatePromoCode(code: string): Promise<PromoCode | null> {
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }

  // Vérifier la validité temporelle
  const now = new Date();
  if (data.valid_until && new Date(data.valid_until) < now) {
    return null;
  }

  // Vérifier le nombre d'utilisations
  if (data.max_uses && data.current_uses >= data.max_uses) {
    return null;
  }

  return data;
}

// ============================================
// FONCTIONS PRIX
// ============================================

export function calculatePrice(
  basePrice: number,
  quantity: number,
  discountPercent: number = 0,
  promoDiscountPercent: number = 0
): {
  unitPriceHT: number;
  totalHT: number;
  totalTTC: number;
  savings: number;
} {
  // Pas de remise quantité automatique
  const quantityDiscount = 0;
  
  // Cumul des remises (plafonné à 50%)
  const totalDiscount = Math.min(discountPercent + promoDiscountPercent + quantityDiscount, 50);
  
  const unitPriceHT = Math.round(basePrice * (1 - totalDiscount / 100));
  const totalHT = unitPriceHT * quantity;
  const totalTTC = Math.round(totalHT * 1.2); // TVA 20%
  const savings = (basePrice * quantity) - totalHT;

  return { unitPriceHT, totalHT, totalTTC, savings };
}

// ============================================
// FORMAT HELPERS
// ============================================

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}
