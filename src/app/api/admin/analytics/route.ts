// ============================================
// REKAIRE - API Analytics Dashboard
// Statistiques avancées pour l'admin
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const adminEmailsEnv = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '';
const ADMIN_EMAILS = adminEmailsEnv.split(',').map(e => e.trim().toLowerCase()).filter(e => e);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user?.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Période par défaut : 30 derniers jours
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // 1. Ventes par jour (graphique)
    const { data: salesByDay } = await supabaseAdmin
      .from('orders')
      .select('created_at, total_ttc, status')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    const salesChart = processSalesChart(salesByDay || [], days);

    // 2. Distribution par statut
    const { data: ordersByStatus } = await supabaseAdmin
      .from('orders')
      .select('status, total_ttc');

    const statusDistribution = processStatusDistribution(ordersByStatus || []);

    // 3. Stock actuel
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('slug, stock, price_ht');

    const stockInfo = products?.map(p => ({
      product: p.slug,
      stock: p.stock,
      valueHT: (p.stock * p.price_ht) / 100
    })) || [];

    // 4. Meilleurs clients (top 10)
    const { data: topCustomers } = await supabaseAdmin.rpc('get_top_customers', { limit_count: 10 });

    // 5. Codes promo les plus utilisés
    const { data: topPromos } = await supabaseAdmin
      .from('promo_codes')
      .select('code, current_uses, discount_value, discount_type')
      .order('current_uses', { ascending: false })
      .limit(5);

    // 6. Panier abandonné (leads sans commande)
    const { count: leadsCount } = await supabaseAdmin
      .from('leads')
      .select('*', { count: 'exact', head: true });

    const { count: ordersCount } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const conversionRate = ordersCount && leadsCount 
      ? ((ordersCount / leadsCount) * 100).toFixed(1)
      : '0';

    // 7. Revenus par période
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const { data: weekOrders } = await supabaseAdmin
      .from('orders')
      .select('total_ttc')
      .gte('created_at', startOfWeek.toISOString());

    const { data: monthOrders } = await supabaseAdmin
      .from('orders')
      .select('total_ttc')
      .gte('created_at', startOfMonth.toISOString());

    const weekRevenue = weekOrders?.reduce((sum, o) => sum + o.total_ttc, 0) || 0;
    const monthRevenue = monthOrders?.reduce((sum, o) => sum + o.total_ttc, 0) || 0;

    return NextResponse.json({
      salesChart,
      statusDistribution,
      stockInfo,
      topCustomers: topCustomers || [],
      topPromos: topPromos || [],
      conversionRate: parseFloat(conversionRate),
      leadsTotal: leadsCount || 0,
      ordersTotal: ordersCount || 0,
      weekRevenue,
      monthRevenue,
      period: {
        days,
        from: startDate.toISOString(),
        to: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('[Analytics] Error:', error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}

// Grouper les ventes par jour
function processSalesChart(orders: any[], days: number) {
  const chart: { [key: string]: { date: string; revenue: number; orders: number } } = {};
  
  // Initialiser tous les jours à 0
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    const dateStr = date.toISOString().split('T')[0];
    chart[dateStr] = {
      date: dateStr,
      revenue: 0,
      orders: 0
    };
  }

  // Remplir avec les vraies données
  orders.forEach(order => {
    const dateStr = order.created_at.split('T')[0];
    if (chart[dateStr]) {
      chart[dateStr].revenue += order.total_ttc / 100;
      chart[dateStr].orders += 1;
    }
  });

  return Object.values(chart);
}

// Calculer la distribution par statut
function processStatusDistribution(orders: any[]) {
  const distribution: { [key: string]: { count: number; revenue: number } } = {
    paid: { count: 0, revenue: 0 },
    shipped: { count: 0, revenue: 0 },
    delivered: { count: 0, revenue: 0 },
    refunded: { count: 0, revenue: 0 },
    cancelled: { count: 0, revenue: 0 }
  };

  orders.forEach(order => {
    const status = order.status || 'paid';
    if (distribution[status]) {
      distribution[status].count += 1;
      distribution[status].revenue += order.total_ttc / 100;
    }
  });

  return Object.entries(distribution).map(([status, data]) => ({
    status,
    count: data.count,
    revenue: data.revenue
  }));
}
