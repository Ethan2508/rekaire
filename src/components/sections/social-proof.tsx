"use client";

// ============================================
// REKAIRE - Social Proof Section (Clean Design)
// ============================================

import { content } from "@/config/content";
import { Star, Quote } from "lucide-react";

export function SocialProofSection() {
  return (
    <section id="proof" className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-orange-500 font-medium text-sm uppercase tracking-wider">
            Témoignages
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {content.proof.title}
          </h2>
          <p className="text-gray-600">
            {content.proof.subtitle}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {content.proof.stats.map((stat) => (
            <div key={stat.label} className="text-center p-4 md:p-6 bg-white rounded-xl border border-gray-100">
              <p className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-6">
          {content.proof.testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="bg-white rounded-xl p-6 border border-gray-100"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-orange-200 mb-4" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-xs text-gray-500">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
