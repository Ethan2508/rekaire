"use client";

// ============================================
// REKAIRE - How It Works Section (Light Clean)
// ============================================

import { motion } from "framer-motion";
import { content } from "@/config/content";
import { Sparkles } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-orange-500" />
            Simple & Efficace
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.howItWorks.title} ?
          </h2>
          <p className="text-lg text-gray-600">
            {content.howItWorks.subtitle}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.howItWorks.steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Connector line */}
              {index < content.howItWorks.steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-0.5 bg-gray-200">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                    className="absolute inset-0 bg-orange-500 origin-left"
                  />
                </div>
              )}
              
              <div className="relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all h-full">
                {/* Number */}
                <div className="relative w-14 h-14 mb-5 mx-auto">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-orange-500/20">
                    {step.number}
                  </div>
                </div>
                
                <h3 className="relative text-lg font-semibold text-gray-900 mb-3 text-center">
                  {step.title}
                </h3>
                <p className="relative text-sm text-gray-600 leading-relaxed text-center">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}