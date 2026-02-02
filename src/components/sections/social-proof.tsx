"use client";

// ============================================
// REKAIRE - Social Proof Section (Light Clean)
// ============================================

import { motion } from "framer-motion";
import { content } from "@/config/content";
import { Star, Quote, TrendingUp, Users, Award } from "lucide-react";

const statIcons = [TrendingUp, Users, Award];
const statColors = ["from-orange-500 to-orange-600", "from-blue-500 to-blue-600", "from-emerald-500 to-emerald-600"];

export function SocialProofSection() {
  return (
    <section id="proof" className="py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-sm font-semibold mb-6">
            <Star className="w-4 h-4 fill-orange-500" />
            Témoignages clients
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.proof.title}
          </h2>
          <p className="text-lg text-gray-600">
            {content.proof.subtitle}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-14">
          {content.proof.stats.map((stat, index) => {
            const Icon = statIcons[index] || TrendingUp;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 md:p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${statColors[index]} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm md:text-base text-gray-600">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-6">
          {content.proof.testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="relative bg-white rounded-2xl p-6 md:p-8 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Quote className="w-5 h-5 text-orange-500" />
              </div>

              {/* Stars */}
              <div className="relative flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-orange-500 fill-orange-500" />
                ))}
              </div>

              {/* Quote */}
              <p className="relative text-gray-700 text-lg mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/20">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">
                    {testimonial.role} - {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
