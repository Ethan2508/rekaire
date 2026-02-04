'use client';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsChartsProps {
  analytics: any;
  loading: boolean;
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#fbbf24', '#ef4444', '#8b5cf6'];

const STATUS_LABELS: { [key: string]: string } = {
  paid: 'Payées',
  shipped: 'Expédiées',
  delivered: 'Livrées',
  refunded: 'Remboursées',
  cancelled: 'Annulées'
};

export function AnalyticsCharts({ analytics, loading }: AnalyticsChartsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Graphique ventes par jour */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">📈 Ventes sur {analytics.period.days} jours</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.salesChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
            />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
              formatter={(value: any, name?: string) => {
                if (name === 'revenue') return [`${value.toFixed(2)} €`, 'CA'];
                return [value, 'Commandes'];
              }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="revenue" 
              stroke="#f97316" 
              strokeWidth={2}
              name="CA (€)"
              dot={{ fill: '#f97316', r: 4 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="orders" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Commandes"
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution par statut */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">📊 Répartition des commandes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.statusDistribution.filter((d: any) => d.count > 0)}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {analytics.statusDistribution.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name?: string) => [value, name ? STATUS_LABELS[name] || name : '']}
              />
              <Legend formatter={(value) => STATUS_LABELS[value] || value} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* CA par statut */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">💰 CA par statut</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.statusDistribution.filter((d: any) => d.revenue > 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="status" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => STATUS_LABELS[value] || value}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => STATUS_LABELS[value] || value}
                formatter={(value: any) => [`${value.toFixed(2)} €`, 'CA']}
              />
              <Bar dataKey="revenue" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock & Top Promos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">📦 Stock actuel</h3>
          <div className="space-y-3">
            {analytics.stockInfo.map((item: any) => (
              <div key={item.product} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900 uppercase">{item.product}</p>
                  <p className="text-sm text-gray-500">Valeur: {item.valueHT.toFixed(2)} € HT</p>
                </div>
                <div className={`text-2xl font-bold ${item.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                  {item.stock}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Codes Promo */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">🏷️ Codes promo les plus utilisés</h3>
          <div className="space-y-3">
            {analytics.topPromos.length > 0 ? (
              analytics.topPromos.map((promo: any, index: number) => (
                <div key={promo.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold font-mono text-gray-900">{promo.code}</p>
                      <p className="text-sm text-gray-500">
                        {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `${promo.discount_value / 100}€`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{promo.current_uses}</p>
                    <p className="text-xs text-gray-500">utilisations</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun code promo utilisé</p>
            )}
          </div>
        </div>
      </div>

      {/* Taux de conversion */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">🎯 Taux de conversion</h3>
            <p className="text-sm text-gray-600">
              {analytics.ordersTotal} commandes / {analytics.leadsTotal} visiteurs intéressés
            </p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold text-orange-600">{analytics.conversionRate}%</p>
          </div>
        </div>
        <div className="mt-4 h-2 bg-white rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(analytics.conversionRate, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
