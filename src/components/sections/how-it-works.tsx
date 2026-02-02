"use client";

// ============================================
// REKAIRE - How It Works Section (Premium Design)
// ============================================

import { motion } from "framer-motion";
import { content } from "@/config/content";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-100/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-orange-500 font-semibold text-sm tracking-wider uppercase mb-4"
          >
            Simple & Efficace
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.howItWorks.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {content.howItWorks.subtitle}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line - desktop */}
          <div className="hidden lg:block absolute top-20 left-[12%] right-[12%] h-0.5">
            <div className="w-full h-full bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 rounded-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 blur-sm" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {content.howItWorks.steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center group"
              >
                {/* Number circle */}
                <div className="relative z-10 mx-auto mb-8">
                  <div className="w-20 h-20 mx-auto rounded-full bg-white shadow-xl shadow-orange-100/50 border-2 border-orange-100 flex items-center justify-center group-hover:border-orange-300 group-hover:shadow-orange-200/50 transition-all duration-500">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-500">
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>
                  </div>
                  
                  {/* Pulse effect */}
                  <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-orange-400/20 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '2s' }} />
                </div>

                {/* Content card */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 group-hover:bg-white group-hover:shadow-lg group-hover:border-orange-100 transition-all duration-500">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - mobile/tablet */}
                {index < content.howItWorks.steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-orange-300 rotate-90">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
