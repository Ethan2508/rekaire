"use client";

// ============================================
// REKAIRE - Social Proof Section (Premium Design)
// ============================================

import { motion } from "framer-motion";
import { content } from "@/config/content";
import { Star, Quote, TrendingUp, Users, Award } from "lucide-react";

export function SocialProofSection() {
  const statIcons = [TrendingUp, Users, Award];
  const statColors = ["from-orange-500 to-orange-600", "from-blue-500 to-blue-600", "from-emerald-500 to-emerald-600"];
  
  return (
    <section id="proof" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-orange-50/30" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-100/40 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-gray-100/50 to-transparent rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200/80 text-orange-600 text-sm font-semibold mb-6 shadow-sm"
          >
            <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
            Témoignages clients
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {content.proof.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            {content.proof.subtitle}
          </p>
        </motion.div>

        {/* Premium Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-16">
          {content.proof.stats.map((stat, index) => {
            const Icon = statIcons[index] || TrendingUp;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-xl shadow-gray-200/40 text-center group hover:shadow-2xl transition-shadow overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-100/30 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${statColors[index]} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                
                <p className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm md:text-base text-gray-600">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Premium Testimonials */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {content.proof.testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="relative bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-xl shadow-gray-200/40 group hover:shadow-2xl transition-shadow overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-100/20 to-transparent rounded-full blur-2xl" />
              
              {/* Quote icon */}
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <Quote className="w-5 h-5 text-orange-400" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-orange-500 fill-orange-500"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="relative text-gray-700 text-lg mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="relative flex items-center gap-4">
                {/* Premium Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/30">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">
                    {testimonial.role} • {testimonial.company}
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
