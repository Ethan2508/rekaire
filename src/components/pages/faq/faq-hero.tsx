"use client";

// ============================================
// REKAIRE - FAQ Hero Section
// ============================================

import { motion } from "framer-motion";
import { Search } from "lucide-react";

export function FAQHero() {
  return (
    <section className="pt-28 pb-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comment pouvons-nous vous aider ?
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Retrouvez les réponses aux questions les plus fréquentes sur nos produits et services.
          </p>

          {/* Search bar (visual only for now) */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
