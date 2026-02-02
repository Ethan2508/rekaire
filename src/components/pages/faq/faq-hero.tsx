"use client";

// ============================================
// REKAIRE - FAQ Hero Section (Premium Design)
// ============================================

import { motion } from "framer-motion";
import { Search, HelpCircle, BookOpen, MessageCircle } from "lucide-react";

export function FAQHero() {
  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-orange-50/30" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-orange-100/40 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-gray-200/30 to-transparent rounded-full blur-3xl" />
      
      {/* Floating icons */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-[15%] hidden lg:block"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <HelpCircle className="w-6 h-6 text-white" />
        </div>
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-40 right-[15%] hidden lg:block"
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
      </motion.div>
      
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 right-[25%] hidden lg:block"
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
      </motion.div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200/80 text-orange-600 text-sm font-semibold mb-8 shadow-sm"
          >
            <HelpCircle className="w-4 h-4" />
            Centre d&apos;aide
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Comment pouvons-nous{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              vous aider ?
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Retrouvez les réponses aux questions les plus fréquentes sur nos produits et services.
          </p>

          {/* Premium Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative max-w-xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une question..."
                className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 shadow-xl shadow-gray-200/50 transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>
            {/* Quick suggestions */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Installation", "Garantie", "Livraison", "SAV"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-600 hover:border-orange-300 hover:text-orange-600 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
