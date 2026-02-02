"use client";

// ============================================
// REKAIRE - Social Proof Section (Dark Innovative)
// ============================================

import { motion } from "framer-motion";
import { content } from "@/config/content";
import { Star, Quote, TrendingUp, Users, Award } from "lucide-react";

const statIcons = [TrendingUp, Users, Award];
const statColors = ["from-orange-500 to-orange-600", "from-blue-500 to-blue-600", "from-emerald-500 to-emerald-600"];

export function SocialProofSection() {
  return (
    <section id="proof" className="py-20 lg:py-28 bg-[#0A0A0B] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold mb-6">
            <Star className="w-4 h-4 fill-orange-400" />
            Témoignages clients
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {content.proof.title}
          </h2>
          <p className="text-lg text-white/60">
            {content.proof.subtitle}
          </p>
        </motion.div>

        {/* Stats */}
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
                className="text-center p-6 md:p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:border-white/20 transition-all"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${statColors[index]} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <p className="text-3xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-sm md:text-base text-white/50">{stat.label}</p>
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
              className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 group hover:border-orange-500/30 transition-all overflow-hidden"
            >
              {/* Gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-transparent rounded-2xl transition-all" />

              {/* Quote icon */}
              <div className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Quote className="w-5 h-5 text-orange-400" />
              </div>

              {/* Stars */}
              <div className="relative flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-orange-500 fill-orange-500" />
                ))}
              </div>

              {/* Quote */}
              <p className="relative text-white/80 text-lg mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/30">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold">{testimonial.author}</p>
                  <p className="text-white/50 text-sm">
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
