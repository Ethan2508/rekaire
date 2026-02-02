// ============================================
// REKAIRE - API Route: Get Product (stock, price, discount)
// ============================================

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', 'rk01')
      .eq('is_active', true)
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      name: data.name,
      slug: data.slug,
      priceHT: data.price_ht,
      discountPercent: data.discount_percent,
      stock: data.stock,
      isActive: data.is_active,
      inStock: data.stock > 0
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ 
      error: 'Product not found' 
    }, { status: 404 });
  }
}
