"use client";

// ============================================
// REKAIRE - About Hero Section
// ============================================

import { motion } from "framer-motion";

export function AboutHero() {
  return (
    <section className="pt-28 pb-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-sm font-medium mb-6">
            Notre histoire
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Protéger ce qui compte,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              simplement.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Rekaire est née d&apos;une conviction simple : la protection contre les incendies 
            électriques devrait être accessible, efficace et sans contrainte pour tous.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
