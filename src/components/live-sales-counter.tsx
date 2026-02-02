"use client";

// ============================================
// REKAIRE - Live Sales Counter (FOMO Effect)
// ============================================

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, MapPin, Clock } from "lucide-react";

// Villes françaises pour les notifications
const cities = [
  "Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse", 
  "Nantes", "Lille", "Strasbourg", "Nice", "Rennes",
  "Montpellier", "Grenoble", "Dijon", "Angers", "Tours",
  "Clermont-Ferrand", "Reims", "Metz", "Brest", "Rouen"
];

// Prénoms français
const firstNames = [
  "Thomas", "Marie", "Pierre", "Sophie", "Jean", "Claire",
  "Nicolas", "Julie", "François", "Isabelle", "Michel", "Anne",
  "Philippe", "Catherine", "Laurent", "Nathalie", "Christophe", "Sandrine",
  "Patrick", "Véronique", "Sébastien", "Caroline", "David", "Émilie"
];

interface SaleNotification {
  id: number;
  name: string;
  city: string;
  quantity: number;
  timeAgo: string;
}

export function LiveSalesCounter() {
  const [totalSales, setTotalSales] = useState(2847);
  const [notification, setNotification] = useState<SaleNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const generateNotification = useCallback(() => {
    const name = firstNames[Math.floor(Math.random() * firstNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const quantity = Math.random() > 0.7 ? 2 : 1; // 30% chance de pack de 2
    const minutesAgo = Math.floor(Math.random() * 5) + 1;

    return {
      id: Date.now(),
      name: `${name} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`,
      city,
      quantity,
      timeAgo: `Il y a ${minutesAgo} min`,
    };
  }, []);

  const showNotification = useCallback(() => {
    const newNotification = generateNotification();
    setNotification(newNotification);
    setIsVisible(true);
    
    // Incrémenter le compteur
    const increment = Math.floor(Math.random() * 5) + 1; // 1-5
    setTotalSales(prev => prev + increment);

    // Cacher après 5 secondes
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  }, [generateNotification]);

  useEffect(() => {
    // Première notification après 3-8 secondes
    const initialDelay = Math.random() * 5000 + 3000;
    const initialTimer = setTimeout(showNotification, initialDelay);

    // Notifications suivantes toutes les 5-8 minutes (300000-480000ms)
    // Pour la démo, on utilise 45-90 secondes
    const interval = setInterval(() => {
      showNotification();
    }, Math.random() * 45000 + 45000); // 45-90 secondes pour la démo

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
                  {notification.name} vient d&apos;acheter {notification.quantity} RK01
                </p>
                
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {notification.city}
                  </span>
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

      {/* Stats counter in hero (exporté pour être utilisé ailleurs) */}
      <div className="hidden" data-total-sales={totalSales} />
    </>
  );
}

// Composant pour afficher le compteur inline
export function SalesCounterBadge() {
  const [count, setCount] = useState(2847);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 3) + 1;
      setCount(prev => prev + increment);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, Math.random() * 60000 + 60000); // 1-2 minutes

    return () => clearInterval(interval);
  }, []);

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
          {count.toLocaleString('fr-FR')}
        </motion.span>
        {" "}unités vendues
      </span>
    </motion.div>
  );
}
