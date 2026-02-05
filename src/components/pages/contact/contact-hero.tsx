// ============================================
// REKAIRE - Contact Page Hero (Premium Design)
// ============================================

"use client";

import { motion } from "framer-motion";
import { MessageSquare, Clock, Star, Phone } from "lucide-react";

export function ContactHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-gray-50" />
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-gradient-to-br from-orange-200/40 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-gray-200/30 to-transparent rounded-full blur-3xl" />
      
      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 right-[20%] hidden lg:block"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/30">
          <MessageSquare className="w-7 h-7 text-white" />
        </div>
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 left-[15%] hidden lg:block"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
          <Phone className="w-6 h-6 text-white" />
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200/80 text-orange-700 text-sm font-semibold mb-8 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Nous sommes là pour vous
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Contactez{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              notre équipe
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Une question ? Besoin d&apos;un devis professionnel ? 
            Notre équipe d&apos;experts est à votre disposition pour vous accompagner.
          </p>

          {/* Quick Stats - Premium Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14 grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto"
          >
            {[
              { icon: Clock, value: "24-48h", label: "Délai de réponse", color: "from-orange-500 to-orange-600" },
              { icon: Star, value: "98%", label: "Satisfaction client", color: "from-emerald-500 to-emerald-600" },
              { icon: Phone, value: "Lun-Ven", label: "9h - 18h", color: "from-blue-500 to-blue-600" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-4 md:p-5 shadow-lg shadow-gray-200/30 hover:shadow-xl transition-shadow"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
