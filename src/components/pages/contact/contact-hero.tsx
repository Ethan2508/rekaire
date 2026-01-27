// ============================================
// REKAIRE - Contact Page Hero
// ============================================

"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export function ContactHero() {
  return (
    <section className="relative pt-32 pb-16 bg-gradient-to-b from-orange-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-100 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6"
          >
            <MessageSquare className="w-4 h-4" />
            Nous sommes là pour vous
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Contactez-nous
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Une question sur le RK01 ? Besoin d&apos;un devis professionnel ? 
            Notre équipe d&apos;experts est à votre disposition pour vous accompagner.
          </p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-wrap justify-center gap-8 md:gap-12"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">24-48h</div>
              <div className="text-sm text-gray-500 mt-1">Délai de réponse</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">98%</div>
              <div className="text-sm text-gray-500 mt-1">Satisfaction client</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">Lun-Ven</div>
              <div className="text-sm text-gray-500 mt-1">9h - 18h</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
