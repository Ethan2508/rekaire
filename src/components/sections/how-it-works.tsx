"use client";

// ============================================
// REKAIRE - How It Works Section (Clean Design)
// ============================================

import { content } from "@/config/content";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-orange-500 font-medium text-sm uppercase tracking-wider">
            Simple & Efficace
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {content.howItWorks.title}
          </h2>
          <p className="text-gray-600">
            {content.howItWorks.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.howItWorks.steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < content.howItWorks.steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px)] h-px bg-gray-200" />
              )}
              
              <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all h-full">
                {/* Number */}
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center text-lg font-bold mb-4">
                  {step.number}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

