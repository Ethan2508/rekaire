'use client';

// ============================================
// REKAIRE - Admin Page (Protected)
// Magic Link Authentication + Order Management
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Order {
  id: string;
  order_number: string;
  status: string;
  quantity: number;
  total_ttc: number;
  customer_email: string;
  customer_name?: string;
  shipping_address_line1?: string;
  shipping_postal_code?: string;
  shipping_city?: string;
  tracking_number?: string;
  tracking_url?: string;
  invoice_number?: string;
  invoice_url?: string;
  created_at: string;
  shipped_at?: string;
}

// Supabase client pour l'auth côté client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [loginError, setLoginError] = useState('');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Vérifier l'authentification au chargement
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

  // Charger les commandes quand authentifié
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, statusFilter]);

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

  async function handleLogin(e: React.FormEvent) {
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

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail(null);
    setOrders([]);
  }

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      params.append('limit', '100');

      const response = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
    } finally {
      setLoadingOrders(false);
    }
  }, [statusFilter]);

  async function handleAddTracking() {
    if (!selectedOrder || !trackingNumber.trim()) return;
    
    setIsUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          action: 'add_tracking',
          data: {
            trackingNumber: trackingNumber.trim()
          }
        })
      });

      if (response.ok) {
        setSelectedOrder(null);
        setTrackingNumber('');
        fetchOrders();
      }
    } catch (error) {
      console.error('Add tracking error:', error);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleMarkDelivered(orderId: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          orderId,
          action: 'mark_delivered'
        })
      });

      fetchOrders();
    } catch (error) {
      console.error('Mark delivered error:', error);
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">REKAIRE Admin</h1>
            <p className="text-gray-600 mt-2">Connexion sécurisée</p>
          </div>

          {loginStatus === 'sent' ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Lien envoyé !</h2>
              <p className="text-gray-600 mb-4">
                Un lien de connexion a été envoyé à <strong className="text-gray-900">{email}</strong>.
              </p>
              <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
                <p className="font-semibold mb-2">📧 Vérifiez :</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Votre boîte de réception</li>
                  <li>Le dossier <strong>Spam/Courrier indésirable</strong></li>
                  <li>Délai : jusqu&apos;à 2-3 minutes</li>
                </ul>
                <p className="mt-3 text-xs text-gray-500">
                  Pas d&apos;email ? L&apos;utilisateur n&apos;existe peut-être pas dans Supabase Auth.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  placeholder="contact@rekaire.fr"
                  required
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginStatus === 'sending'}
                className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loginStatus === 'sending' ? 'Envoi en cours...' : 'Recevoir le lien de connexion'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-gray-500">
            Seuls les emails autorisés peuvent accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">REKAIRE Admin</h1>
            <p className="text-sm text-gray-500">Connecté: {userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="À expédier"
            value={orders.filter(o => o.status === 'paid').length}
            color="orange"
          />
          <StatCard
            title="En transit"
            value={orders.filter(o => o.status === 'shipped').length}
            color="blue"
          />
          <StatCard
            title="Livrées"
            value={orders.filter(o => o.status === 'delivered').length}
            color="green"
          />
          <StatCard
            title="Total commandes"
            value={orders.length}
            color="gray"
          />
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow mb-6 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Filtrer par statut:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Toutes</option>
              <option value="paid">À expédier</option>
              <option value="shipped">En transit</option>
              <option value="delivered">Livrées</option>
            </select>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loadingOrders}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            {loadingOrders ? 'Chargement...' : '↻ Actualiser'}
          </button>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adresse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customer_name || '-'}</div>
                    <div className="text-xs text-gray-500">{order.customer_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.shipping_address_line1 || '-'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.shipping_postal_code} {order.shipping_city}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {(order.total_ttc / 100).toFixed(2)} €
                    </div>
                    <div className="text-xs text-gray-500">× {order.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                    {order.tracking_number && (
                      <div className="text-xs text-blue-600 mt-1">
                        {order.tracking_number}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.status === 'paid' && (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-orange-600 hover:text-orange-900 font-medium"
                      >
                        + Tracking
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => handleMarkDelivered(order.id)}
                        className="text-green-600 hover:text-green-900 font-medium"
                      >
                        ✓ Livré
                      </button>
                    )}
                    {order.tracking_url && (
                      <a
                        href={order.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 text-blue-600 hover:text-blue-900"
                      >
                        Suivre →
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Aucune commande trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Ajouter le numéro de suivi
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Commande: <strong>{selectedOrder.order_number}</strong><br />
              Client: {selectedOrder.customer_name || selectedOrder.customer_email}
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro Colissimo
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: 8R12345678901"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setTrackingNumber('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAddTracking}
                disabled={!trackingNumber.trim() || isUpdating}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {isUpdating ? 'Envoi...' : 'Confirmer & Notifier'}
              </button>
            </div>
            
            <p className="mt-3 text-xs text-gray-500 text-center">
              Un email avec le lien de suivi sera envoyé au client
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant StatCard
function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colors = {
    orange: 'bg-orange-50 text-orange-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    gray: 'bg-gray-50 text-gray-600'
  };

  return (
    <div className={`rounded-lg p-6 ${colors[color as keyof typeof colors]}`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm mt-1 opacity-80">{title}</div>
    </div>
  );
}

// Composant StatusBadge
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: { label: 'En attente', bg: 'bg-gray-100', text: 'text-gray-700' },
    paid: { label: 'À expédier', bg: 'bg-orange-100', text: 'text-orange-700' },
    processing: { label: 'En préparation', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    shipped: { label: 'En transit', bg: 'bg-blue-100', text: 'text-blue-700' },
    delivered: { label: 'Livré', bg: 'bg-green-100', text: 'text-green-700' },
    cancelled: { label: 'Annulé', bg: 'bg-red-100', text: 'text-red-700' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
