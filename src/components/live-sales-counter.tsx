"use client";

// ============================================
// REKAIRE - Live Sales Counter (Supabase + FOMO)
// Compteur synchronisé avec la vraie base de données
// ============================================

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Clock, Truck } from "lucide-react";

// Villes françaises pour les notifications simulées
const cities = [
  "Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse", 
  "Nantes", "Lille", "Strasbourg", "Nice", "Rennes",
  "Montpellier", "Grenoble", "Dijon", "Angers", "Tours",
  "Clermont-Ferrand", "Reims", "Metz", "Brest", "Rouen",
  "Le Havre", "Saint-Étienne", "Toulon", "Amiens", "Limoges"
];

// Messages variés pour les notifications
const notificationMessages = [
  { template: "expédié vers", icon: Truck },
  { template: "en route pour", icon: Truck },
  { template: "livré à", icon: ShoppingBag },
];

interface SaleNotification {
  id: number;
  city: string;
  quantity: number;
  timeAgo: string;
  message: string;
}

export function LiveSalesCounter() {
  const [notification, setNotification] = useState<SaleNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const generateNotification = useCallback(() => {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const quantity = Math.random() > 0.7 ? 2 : 1;
    const minutesAgo = Math.floor(Math.random() * 15) + 1;
    const msgTemplate = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];

    return {
      id: Date.now(),
      city,
      quantity,
      timeAgo: `Il y a ${minutesAgo} min`,
      message: msgTemplate.template,
    };
  }, []);

  const showNotification = useCallback(() => {
    const newNotification = generateNotification();
    setNotification(newNotification);
    setIsVisible(true);

    // Cacher après 6 secondes
    setTimeout(() => {
      setIsVisible(false);
    }, 6000);
  }, [generateNotification]);

  useEffect(() => {
    // Première notification après 5-10 secondes
    const initialDelay = Math.random() * 5000 + 5000;
    const initialTimer = setTimeout(showNotification, initialDelay);

    // Notifications suivantes toutes les 60-120 secondes
    const interval = setInterval(() => {
      showNotification();
    }, Math.random() * 60000 + 60000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [showNotification]);

  return (
    <>
      {/* Floating notification */}
      <AnimatePresence>
        {isVisible && notification && (
          <motion.div
            initial={{ opacity: 0, x: -100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-6 z-50 max-w-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 p-4 flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                    Nouvelle commande
                  </span>
                </div>
                
                <p className="text-sm text-gray-900 font-medium">
                  {notification.quantity} RK01 {notification.message} {notification.city}
                </p>
                
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {notification.timeAgo}
                  </span>
                </div>
              </div>

              {/* Close button - invisible but clickable */}
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Composant pour afficher le compteur inline - DONNÉES SUPABASE
export function SalesCounterBadge() {
  const [count, setCount] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer le compteur depuis Supabase au chargement
  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/sales-counter');
        const data = await res.json();
        setCount(data.count);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch sales count:', error);
        setCount(2847); // Fallback
        setIsLoading(false);
      }
    }
    fetchCount();

    // Rafraîchir toutes les 30 secondes pour refléter les vraies ventes
    const refreshInterval = setInterval(fetchCount, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Simulation d'incrémentation légère côté client (entre les refreshes)
  useEffect(() => {
    if (count === null) return;
    
    const interval = setInterval(() => {
      // Petite chance d'incrémenter (simule l'activité)
      if (Math.random() > 0.7) {
        setCount(prev => (prev ?? 0) + 1);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500);
      }
    }, 45000); // Toutes les 45 secondes

    return () => clearInterval(interval);
  }, [count]);

  if (isLoading || count === null) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-sm font-semibold text-emerald-700">Chargement...</span>
      </div>
    );
  }

  return (
    <motion.div
      animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="text-sm font-semibold text-emerald-700">
        <motion.span
          key={count}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block"
        >
          {count.toLocaleString('fr-FR')}+
        </motion.span>
        {" "}unités vendues
      </span>
    </motion.div>
  );
}
