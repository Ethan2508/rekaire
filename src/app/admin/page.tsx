'use client';

// ============================================
// REKAIRE - Admin Dashboard COMPLET
// Stats, Commandes, Codes Promo, Export, etc.
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AnalyticsCharts } from '@/components/admin-analytics';

// ============================================
// ICONS (inline SVG for no dependencies)
// ============================================

const Icons = {
  Package: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Truck: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  TrendingUp: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Download: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Send: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  FileText: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Tag: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  DollarSign: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  BarChart: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  LogOut: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Copy: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  X: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// ============================================
// TYPES
// ============================================

interface Order {
  id: string;
  order_number: string;
  status: string;
  quantity: number;
  unit_price_ht?: number;
  total_ht?: number;
  total_ttc: number;
  tva_amount?: number;
  promo_code?: string;
  promo_discount?: number;
  customer_email: string;
  customer_name?: string;
  customer_phone?: string;
  customer_company?: string;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_postal_code?: string;
  shipping_city?: string;
  shipping_country?: string;
  tracking_number?: string;
  tracking_url?: string;
  invoice_number?: string;
  invoice_url?: string;
  refund_id?: string;
  refund_amount?: number;
  refunded_at?: string;
  refunded_by?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  shipped_at?: string;
  delivered_at?: string;
}

interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  is_active: boolean;
  valid_from?: string;
  valid_until?: string;
  max_uses?: number;
  current_uses: number;
  min_order?: number;
  created_at: string;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  toShip: number;
  inTransit: number;
  delivered: number;
  todayOrders: number;
  todayRevenue: number;
  weekOrders: number;
  weekRevenue: number;
  monthOrders: number;
  monthRevenue: number;
}

interface AuditLog {
  id: string;
  admin_email: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

// ============================================
// SUPABASE CLIENT
// ============================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function AdminDashboard() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [loginError, setLoginError] = useState('');
  const [loginMethod, setLoginMethod] = useState<'magic' | 'password'>('magic');

  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'promos' | 'history' | 'settings'>('dashboard');

  // Dashboard stats
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState(30);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);

  // Promo codes state
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loadingPromos, setLoadingPromos] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [promoForm, setPromoForm] = useState({
    code: '',
    discount_percent: 10,
    max_uses: 100,
    min_order: 0,
    valid_until: ''
  });

  // Audit log state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ============================================
  // AUTH FUNCTIONS
  // ============================================

  useEffect(() => {
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || null);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserEmail(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (searchQuery) {
        query = query.or(`customer_email.ilike.%${searchQuery}%,customer_name.ilike.%${searchQuery}%,order_number.ilike.%${searchQuery}%`);
      }
      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }
      if (dateTo) {
        query = query.lte('created_at', dateTo + 'T23:59:59');
      }

      const { data, error } = await query;
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Fetch orders error:', error);
    } finally {
      setLoadingOrders(false);
    }
  }, [statusFilter, searchQuery, dateFrom, dateTo]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'orders') {
      fetchOrders();
    }
  }, [isAuthenticated, activeTab, statusFilter, fetchOrders]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'promos') {
      fetchPromoCodes();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'history') {
      fetchAuditLogs();
    }
  }, [isAuthenticated, activeTab]);

  async function checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMagicLinkLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginStatus('sending');
    setLoginError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || 'Erreur de connexion');
        setLoginStatus('error');
        return;
      }

      setLoginStatus('sent');
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Erreur de connexion');
      setLoginStatus('error');
    }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginStatus('sending');
    setLoginError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setLoginError(error.message);
        setLoginStatus('error');
        return;
      }

      if (data.session) {
        setIsAuthenticated(true);
        setUserEmail(data.session.user.email || null);
      }
    } catch (error) {
      console.error('Password login error:', error);
      setLoginError('Erreur de connexion');
      setLoginStatus('error');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail(null);
    setOrders([]);
    setStats(null);
  }

  // ============================================
  // DATA LOADING FUNCTIONS
  // ============================================

  async function loadDashboardData() {
    setLoadingStats(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch all orders for stats calculation
      const { data: allOrders, error } = await supabase
        .from('orders')
        .select('status, total_ttc, created_at');

      if (error) throw error;

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.setDate(now.getDate() - 7)).toISOString();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const calculatedStats: Stats = {
        totalOrders: allOrders?.length || 0,
        totalRevenue: allOrders?.reduce((sum, o) => sum + (o.total_ttc || 0), 0) || 0,
        avgOrderValue: allOrders && allOrders.length > 0 
          ? Math.round(allOrders.reduce((sum, o) => sum + (o.total_ttc || 0), 0) / allOrders.length) 
          : 0,
        toShip: allOrders?.filter(o => o.status === 'paid').length || 0,
        inTransit: allOrders?.filter(o => o.status === 'shipped').length || 0,
        delivered: allOrders?.filter(o => o.status === 'delivered').length || 0,
        todayOrders: allOrders?.filter(o => o.created_at >= todayStart).length || 0,
        todayRevenue: allOrders?.filter(o => o.created_at >= todayStart).reduce((sum, o) => sum + (o.total_ttc || 0), 0) || 0,
        weekOrders: allOrders?.filter(o => o.created_at >= weekStart).length || 0,
        weekRevenue: allOrders?.filter(o => o.created_at >= weekStart).reduce((sum, o) => sum + (o.total_ttc || 0), 0) || 0,
        monthOrders: allOrders?.filter(o => o.created_at >= monthStart).length || 0,
        monthRevenue: allOrders?.filter(o => o.created_at >= monthStart).reduce((sum, o) => sum + (o.total_ttc || 0), 0) || 0,
      };

      setStats(calculatedStats);
      
      // Load advanced analytics
      loadAnalytics();
    } catch (error) {
      console.error('Load stats error:', error);
    } finally {
      setLoadingStats(false);
    }
  }

  async function loadAnalytics() {
    setLoadingAnalytics(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/admin/analytics?days=${analyticsPeriod}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Load analytics error:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  }

  async function fetchPromoCodes() {
    setLoadingPromos(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/promos', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPromoCodes(data.promoCodes || []);
      }
    } catch (error) {
      console.error('Fetch promos error:', error);
    } finally {
      setLoadingPromos(false);
    }
  }

  async function fetchAuditLogs() {
    setLoadingLogs(true);
    try {
      const { data, error } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Audit logs not available:', error);
        setAuditLogs([]);
      } else {
        setAuditLogs(data || []);
      }
    } catch (error) {
      console.error('Fetch audit logs error:', error);
    } finally {
      setLoadingLogs(false);
    }
  }

  // ============================================
  // ORDER ACTIONS
  // ============================================

  async function handleAddTracking(orderId: string) {
    if (!trackingNumber.trim()) {
      showToast('Veuillez entrer un numéro de suivi', 'error');
      return;
    }
    
    setIsUpdating(true);
    try {
      // Utiliser la nouvelle API qui envoie l'email automatiquement
      const response = await fetch('/api/admin/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          orderId,
          trackingNumber: trackingNumber.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la mise à jour');
      }

      showToast(`✅ Expédié ! Email envoyé au client (${result.data.carrier})`, 'success');
      fetchOrders();
      setSelectedOrder(null);
      setTrackingNumber('');

    } catch (error) {
      console.error('Add tracking error:', error);
      showToast(error instanceof Error ? error.message : 'Erreur lors de la mise à jour', 'error');
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleMarkDelivered(orderId: string) {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'delivered',
          delivered_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      showToast('Commande marquée comme livrée', 'success');
      fetchOrders();
      setSelectedOrder(null);

      // Log action
      await supabase.from('admin_audit_log').insert({
        admin_email: userEmail,
        action: 'ORDER_DELIVERED',
        target_type: 'order',
        target_id: orderId
      });
    } catch (error) {
      console.error('Mark delivered error:', error);
      showToast('Erreur lors de la mise à jour', 'error');
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRefund(orderId: string) {
    setIsUpdating(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) throw new Error('No token');

      const response = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          reason: 'requested_by_customer'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur remboursement');
      }

      showToast('Remboursement effectué avec succès', 'success');
      fetchOrders();
      setSelectedOrder(null);
      setShowRefundConfirm(false);
    } catch (error: any) {
      console.error('Refund error:', error);
      showToast(error.message || 'Erreur lors du remboursement', 'error');
    } finally {
      setIsUpdating(false);
    }
  }

  // Télécharger une facture existante
  async function handleDownloadInvoice(orderId: string) {
    setIsDownloadingInvoice(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) throw new Error('No token');

      const response = await fetch(`/api/admin/invoices?orderId=${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur téléchargement facture');
      }

      // Ouvrir l'URL de la facture dans un nouvel onglet
      if (data.invoiceUrl) {
        window.open(data.invoiceUrl, '_blank');
        showToast('Facture ouverte', 'success');
      } else {
        throw new Error('URL de facture non disponible');
      }
    } catch (error: any) {
      console.error('Download invoice error:', error);
      showToast(error.message || 'Erreur lors du téléchargement', 'error');
    } finally {
      setIsDownloadingInvoice(false);
    }
  }

  // Générer une nouvelle facture
  async function handleGenerateInvoice(orderId: string) {
    setIsDownloadingInvoice(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) throw new Error('No token');

      const response = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur génération facture');
      }

      showToast(`Facture ${data.invoiceNumber} générée`, 'success');
      fetchOrders(); // Rafraîchir pour voir le numéro de facture
    } catch (error: any) {
      console.error('Generate invoice error:', error);
      showToast(error.message || 'Erreur lors de la génération', 'error');
    } finally {
      setIsDownloadingInvoice(false);
    }
  }

  async function handleExportCSV() {
    try {
      // Build CSV content
      const headers = ['N° Commande', 'Date', 'Client', 'Email', 'Téléphone', 'Adresse', 'CP', 'Ville', 'Quantité', 'Total TTC', 'Statut', 'N° Suivi'];
      const rows = orders.map(o => [
        o.order_number || o.id.slice(0, 8),
        new Date(o.created_at).toLocaleDateString('fr-FR'),
        o.customer_name || '',
        o.customer_email,
        o.customer_phone || '',
        o.shipping_address_line1 || '',
        o.shipping_postal_code || '',
        o.shipping_city || '',
        o.quantity.toString(),
        (o.total_ttc / 100).toFixed(2).replace('.', ',') + ' €',
        o.status,
        o.tracking_number || ''
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(';'))
        .join('\n');

      // Add BOM for Excel UTF-8 compatibility
      const bom = '\uFEFF';
      const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `commandes-rekaire-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      showToast('Export CSV téléchargé', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast('Erreur lors de l\'export', 'error');
    }
  }

  // ============================================
  // PROMO CODE ACTIONS
  // ============================================

  async function handleSavePromo() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/promos', {
        method: editingPromo ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          id: editingPromo?.id,
          ...promoForm
        })
      });

      if (response.ok) {
        showToast(editingPromo ? 'Code promo modifié' : 'Code promo créé', 'success');
        setShowPromoModal(false);
        setEditingPromo(null);
        resetPromoForm();
        fetchPromoCodes();
      } else {
        showToast('Erreur lors de la sauvegarde', 'error');
      }
    } catch (error) {
      console.error('Save promo error:', error);
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  }

  async function handleTogglePromo(promoId: string, is_active: boolean) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/promos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ id: promoId, is_active })
      });

      if (response.ok) {
        showToast(is_active ? 'Code activé' : 'Code désactivé', 'success');
        fetchPromoCodes();
      }
    } catch (error) {
      console.error('Toggle promo error:', error);
    }
  }

  async function handleDeletePromo(promoId: string) {
    if (!confirm('Supprimer ce code promo ?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/admin/promos?id=${promoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        showToast('Code promo supprimé', 'success');
        fetchPromoCodes();
      }
    } catch (error) {
      console.error('Delete promo error:', error);
    }
  }

  function resetPromoForm() {
    setPromoForm({
      code: '',
      discount_percent: 10,
      max_uses: 100,
      min_order: 0,
      valid_until: ''
    });
  }

  function openEditPromo(promo: PromoCode) {
    setEditingPromo(promo);
    setPromoForm({
      code: promo.code,
      discount_percent: promo.discount_percent,
      max_uses: promo.max_uses || 100,
      min_order: promo.min_order || 0,
      valid_until: promo.valid_until?.split('T')[0] || ''
    });
    setShowPromoModal(true);
  }

  // ============================================
  // HELPERS
  // ============================================

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function formatPrice(cents: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(cents / 100);
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    const labels: Record<string, string> = {
      pending: 'En attente',
      paid: 'Payée',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    showToast('Copié !', 'success');
  }

  // ============================================
  // RENDER: LOADING
  // ============================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // ============================================
  // RENDER: LOGIN
  // ============================================

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icons.Settings />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">REKAIRE Admin</h1>
            <p className="text-gray-500 mt-2">Connexion sécurisée</p>
          </div>

          {loginStatus === 'sent' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.Check />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Lien envoyé !</h2>
              <p className="text-gray-600 mb-4">
                Vérifiez votre boîte mail <strong className="text-gray-900">{email}</strong>
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-left">
                <p className="font-medium text-blue-800 mb-2">📧 Vérifiez :</p>
                <ul className="text-blue-700 space-y-1 list-disc list-inside">
                  <li>Votre boîte de réception</li>
                  <li>Le dossier Spam</li>
                </ul>
              </div>
              <button
                onClick={() => setLoginStatus('idle')}
                className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
              >
                Renvoyer le lien
              </button>
            </div>
          ) : (
            <form onSubmit={handleMagicLinkLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  placeholder="contact@rekaire.fr"
                  required
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  <Icons.AlertTriangle />
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginStatus === 'sending'}
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loginStatus === 'sending' ? (
                  <>
                    <div className="animate-spin"><Icons.Refresh /></div>
                    Envoi en cours...
                  </>
                ) : (
                  'Recevoir le lien magique'
                )}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-gray-500">
            Accès réservé aux administrateurs autorisés
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: DASHBOARD
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <Icons.Check /> : <Icons.X />}
          {toast.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">REKAIRE</h1>
          <p className="text-sm text-gray-500">Administration</p>
        </div>

        <nav className="p-4 space-y-1">
          {[
            { id: 'dashboard', icon: Icons.BarChart, label: 'Tableau de bord' },
            { id: 'orders', icon: Icons.Package, label: 'Commandes' },
            { id: 'promos', icon: Icons.Tag, label: 'Codes Promo' },
            { id: 'history', icon: Icons.Clock, label: 'Historique' },
            { id: 'settings', icon: Icons.Settings, label: 'Paramètres' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === item.id
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Icons.Users />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userEmail}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <Icons.LogOut />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* ==================== DASHBOARD TAB ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
                <p className="text-gray-500">Vue d&apos;ensemble de votre activité</p>
              </div>
              <button
                onClick={loadDashboardData}
                disabled={loadingStats}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-700"
              >
                <div className={loadingStats ? 'animate-spin' : ''}><Icons.Refresh /></div>
                Actualiser
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                    <Icons.DollarSign />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats ? formatPrice(stats.totalRevenue) : '—'}</p>
                <p className="text-sm text-gray-500">Chiffre d&apos;affaires total</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <Icons.Package />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                <p className="text-sm text-gray-500">Commandes totales</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600">
                    <Icons.Clock />
                  </div>
                </div>
                <p className="text-2xl font-bold text-orange-600">{stats?.toShip || 0}</p>
                <p className="text-sm text-gray-500">À expédier</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <Icons.TrendingUp />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats ? formatPrice(stats.avgOrderValue) : '—'}</p>
                <p className="text-sm text-gray-500">Panier moyen</p>
              </div>
            </div>

            {/* Period Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Aujourd&apos;hui</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Commandes</span>
                    <span className="font-semibold">{stats?.todayOrders || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Revenus</span>
                    <span className="font-semibold text-green-600">{stats ? formatPrice(stats.todayRevenue) : '—'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Cette semaine</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Commandes</span>
                    <span className="font-semibold">{stats?.weekOrders || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Revenus</span>
                    <span className="font-semibold text-green-600">{stats ? formatPrice(stats.weekRevenue) : '—'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Ce mois</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Commandes</span>
                    <span className="font-semibold">{stats?.monthOrders || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Revenus</span>
                    <span className="font-semibold text-green-600">{stats ? formatPrice(stats.monthRevenue) : '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Charts */}
            <AnalyticsCharts analytics={analytics} loading={loadingAnalytics} />

            {/* Order Status Overview */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-6">Statut des commandes</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-3xl font-bold text-blue-600">{stats?.toShip || 0}</p>
                  <p className="text-sm text-blue-700">À expédier</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-3xl font-bold text-purple-600">{stats?.inTransit || 0}</p>
                  <p className="text-sm text-purple-700">En transit</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-3xl font-bold text-green-600">{stats?.delivered || 0}</p>
                  <p className="text-sm text-green-700">Livrées</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-3xl font-bold text-gray-600">{stats?.totalOrders || 0}</p>
                  <p className="text-sm text-gray-700">Total</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== ORDERS TAB ==================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Commandes</h2>
                <p className="text-gray-500">{orders.length} commande{orders.length > 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-700"
                >
                  <Icons.Download />
                  Export CSV
                </button>
                <button
                  onClick={() => fetchOrders()}
                  disabled={loadingOrders}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
                >
                  <div className={loadingOrders ? 'animate-spin' : ''}><Icons.Refresh /></div>
                  Actualiser
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Icons.Search />
                <input
                  type="text"
                  placeholder="Rechercher client, email, n° commande..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
                  className="border-0 focus:ring-0 text-gray-900 placeholder:text-gray-400 w-64"
                />
              </div>

              <div className="h-8 w-px bg-gray-200" />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="paid">À expédier</option>
                <option value="shipped">En transit</option>
                <option value="delivered">Livrées</option>
                <option value="cancelled">Annulées</option>
              </select>

              <div className="h-8 w-px bg-gray-200" />

              <div className="flex items-center gap-2 text-gray-400">
                <Icons.Calendar />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900"
                />
                <span className="text-gray-400">→</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900"
                />
              </div>

              <button
                onClick={() => fetchOrders()}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium text-gray-700"
              >
                <Icons.Filter />
                Appliquer
              </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Commande</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Adresse</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Montant</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loadingOrders ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="animate-spin inline-block"><Icons.Refresh /></div>
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Aucune commande trouvée
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-mono text-sm font-medium text-gray-900">{order.order_number || order.id.slice(0, 8)}</p>
                            <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{order.customer_name || '—'}</p>
                            <p className="text-sm text-gray-500">{order.customer_email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            <p>{order.shipping_city}</p>
                            <p>{order.shipping_postal_code}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{formatPrice(order.total_ttc)}</p>
                            <p className="text-xs text-gray-500">{order.quantity} × RK01</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-600"
                              title="Voir détails"
                            >
                              <Icons.Eye />
                            </button>
                            {order.status === 'paid' && (
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setTrackingNumber('');
                                }}
                                className="p-2 hover:bg-blue-100 rounded-lg transition-all text-blue-500"
                                title="Ajouter tracking"
                              >
                                <Icons.Truck />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== PROMO CODES TAB ==================== */}
        {activeTab === 'promos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Codes Promo</h2>
                <p className="text-gray-500">{promoCodes.length} code{promoCodes.length > 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={() => {
                  setEditingPromo(null);
                  resetPromoForm();
                  setShowPromoModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
              >
                <Icons.Plus />
                Nouveau code
              </button>
            </div>

            {/* Promo Codes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingPromos ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="animate-spin"><Icons.Refresh /></div>
                </div>
              ) : promoCodes.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  Aucun code promo. Créez-en un !
                </div>
              ) : (
                promoCodes.map((promo) => (
                  <div
                    key={promo.id}
                    className={`bg-white rounded-xl border p-6 ${
                      promo.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                        onClick={() => copyToClipboard(promo.code)}
                      >
                        <code className="font-mono font-bold text-gray-900">{promo.code}</code>
                        <Icons.Copy />
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={promo.is_active}
                          onChange={(e) => handleTogglePromo(promo.id, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-2xl font-bold text-orange-600">
                        -{promo.discount_percent}%
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{promo.current_uses} / {promo.max_uses || '∞'} utilisations</span>
                      </div>
                      {promo.min_order && promo.min_order > 0 && (
                        <p className="text-sm text-gray-500">
                          Min: {formatPrice(promo.min_order)}
                        </p>
                      )}
                      {promo.valid_until && (
                        <p className="text-sm text-gray-500">
                          Expire: {new Date(promo.valid_until).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => openEditPromo(promo)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                      >
                        <Icons.Edit />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeletePromo(promo.id)}
                        className="flex items-center justify-center p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== HISTORY TAB ==================== */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Historique</h2>
                <p className="text-gray-500">Actions administrateur</p>
              </div>
              <button
                onClick={fetchAuditLogs}
                disabled={loadingLogs}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-700"
              >
                <div className={loadingLogs ? 'animate-spin' : ''}><Icons.Refresh /></div>
                Actualiser
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Admin</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Cible</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Détails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loadingLogs ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="animate-spin inline-block"><Icons.Refresh /></div>
                      </td>
                    </tr>
                  ) : auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        Aucune action enregistrée
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(log.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {log.admin_email}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {log.target_type && `${log.target_type}: ${log.target_id?.slice(0, 8) || '—'}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {log.details ? JSON.stringify(log.details).slice(0, 50) : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== SETTINGS TAB ==================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
              <p className="text-gray-500">Configuration de l&apos;administration</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Compte administrateur</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={userEmail || ''}
                    disabled
                    className="w-full max-w-md px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-600"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Informations système</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Version:</span> <span className="text-gray-900">1.0.0</span></p>
                <p><span className="text-gray-500">Dernière mise à jour:</span> <span className="text-gray-900">{new Date().toLocaleDateString('fr-FR')}</span></p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================== ORDER DETAIL MODAL ==================== */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Commande {selectedOrder.order_number || selectedOrder.id.slice(0, 8)}
                </h3>
                <p className="text-sm text-gray-500">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
              >
                <Icons.X />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-4">
                <span className="text-gray-500">Statut:</span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              {/* Client Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Client</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Nom</p>
                    <p className="text-gray-900">{selectedOrder.customer_name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedOrder.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Téléphone</p>
                    <p className="text-gray-900">{selectedOrder.customer_phone || '—'}</p>
                  </div>
                  {selectedOrder.customer_company && (
                    <div>
                      <p className="text-gray-500">Société</p>
                      <p className="text-gray-900">{selectedOrder.customer_company}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Livraison</h4>
                <div className="text-sm text-gray-900">
                  <p>{selectedOrder.shipping_address_line1}</p>
                  {selectedOrder.shipping_address_line2 && <p>{selectedOrder.shipping_address_line2}</p>}
                  <p>{selectedOrder.shipping_postal_code} {selectedOrder.shipping_city}</p>
                  <p>{selectedOrder.shipping_country || 'France'}</p>
                </div>
                {selectedOrder.tracking_number && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-500 text-sm">N° de suivi</p>
                    <p className="font-mono text-gray-900">{selectedOrder.tracking_number}</p>
                  </div>
                )}
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Détails commande</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Produit</span>
                    <span className="text-gray-900">{selectedOrder.quantity} × RK01</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total HT</span>
                    <span className="text-gray-900">{selectedOrder.total_ht ? formatPrice(selectedOrder.total_ht) : '—'}</span>
                  </div>
                  {selectedOrder.promo_code && (
                    <div className="flex justify-between text-green-600">
                      <span>Code promo ({selectedOrder.promo_code})</span>
                      <span>-{formatPrice(selectedOrder.promo_discount || 0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total TTC</span>
                    <span className="text-orange-600">{formatPrice(selectedOrder.total_ttc)}</span>
                  </div>
                </div>
              </div>

              {/* Facture */}
              <div className="bg-orange-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Icons.FileText />
                  Facture
                </h4>
                {selectedOrder.invoice_number ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 font-mono">N° {selectedOrder.invoice_number}</p>
                      <p className="text-sm text-gray-500">Générée automatiquement</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadInvoice(selectedOrder.id)}
                        disabled={isDownloadingInvoice}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
                      >
                        {isDownloadingInvoice ? (
                          <div className="animate-spin"><Icons.Refresh /></div>
                        ) : (
                          <Icons.Download />
                        )}
                        Télécharger PDF
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500">Aucune facture générée</p>
                    <button
                      onClick={() => handleGenerateInvoice(selectedOrder.id)}
                      disabled={isDownloadingInvoice}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
                    >
                      {isDownloadingInvoice ? (
                        <div className="animate-spin"><Icons.Refresh /></div>
                      ) : (
                        <Icons.Plus />
                      )}
                      Générer la facture
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              {selectedOrder.status === 'paid' && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Ajouter le suivi</h4>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Numéro Colissimo / Chronopost..."
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-900"
                    />
                    <button
                      onClick={() => handleAddTracking(selectedOrder.id)}
                      disabled={!trackingNumber.trim() || isUpdating}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isUpdating ? <div className="animate-spin"><Icons.Refresh /></div> : <Icons.Send />}
                      Expédier
                    </button>
                  </div>
                </div>
              )}

              {selectedOrder.status === 'shipped' && (
                <button
                  onClick={() => handleMarkDelivered(selectedOrder.id)}
                  disabled={isUpdating}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  {isUpdating ? <div className="animate-spin"><Icons.Refresh /></div> : <Icons.CheckCircle />}
                  Marquer comme livrée
                </button>
              )}

              {/* Refund Button */}
              {(selectedOrder.status === 'paid' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered') && !selectedOrder.refund_id && (
                <div className="pt-4 border-t border-gray-200">
                  {!showRefundConfirm ? (
                    <button
                      onClick={() => setShowRefundConfirm(true)}
                      className="w-full px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 flex items-center justify-center gap-2"
                    >
                      <Icons.X />
                      Rembourser cette commande
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-red-800 font-semibold mb-2">⚠️ Confirmer le remboursement</p>
                        <p className="text-sm text-red-700">
                          Cette action va rembourser {formatPrice(selectedOrder.total_ttc)} au client via Stripe.
                          Cette action est irréversible.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowRefundConfirm(false)}
                          disabled={isUpdating}
                          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleRefund(selectedOrder.id)}
                          disabled={isUpdating}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                        >
                          {isUpdating ? <div className="animate-spin"><Icons.Refresh /></div> : <Icons.CheckCircle />}
                          Confirmer le remboursement
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedOrder.refund_id && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-800 font-semibold">✓ Commande remboursée</p>
                  <p className="text-sm text-red-700 mt-1">
                    ID Stripe: {selectedOrder.refund_id}
                  </p>
                  {selectedOrder.refunded_at && (
                    <p className="text-xs text-red-600 mt-1">
                      Le {formatDate(selectedOrder.refunded_at)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== PROMO CODE MODAL ==================== */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingPromo ? 'Modifier le code' : 'Nouveau code promo'}
              </h3>
              <button
                onClick={() => {
                  setShowPromoModal(false);
                  setEditingPromo(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Icons.X />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                  placeholder="REKAIRE20"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono uppercase text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Réduction (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={promoForm.discount_percent}
                    onChange={(e) => setPromoForm({ ...promoForm, discount_percent: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Utilisations max</label>
                  <input
                    type="number"
                    value={promoForm.max_uses}
                    onChange={(e) => setPromoForm({ ...promoForm, max_uses: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min. commande (€)</label>
                <input
                  type="number"
                  value={promoForm.min_order / 100}
                  onChange={(e) => setPromoForm({ ...promoForm, min_order: (parseFloat(e.target.value) || 0) * 100 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date d&apos;expiration</label>
                <input
                  type="date"
                  value={promoForm.valid_until}
                  onChange={(e) => setPromoForm({ ...promoForm, valid_until: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowPromoModal(false);
                  setEditingPromo(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSavePromo}
                disabled={!promoForm.code.trim()}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {editingPromo ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
