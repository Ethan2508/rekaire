// ============================================
// REKAIRE - API Route: Get Sales Counter
// ============================================

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('sales_counter')
      .select('count, updated_at')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json({
      count: data?.count ?? 0,
      updatedAt: data?.updated_at
    });
  } catch (error) {
    console.error('Error fetching sales counter:', error);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
