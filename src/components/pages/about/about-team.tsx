"use client";

// ============================================
// REKAIRE - About Team Section
// ============================================

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutTeam() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 lg:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Une équipe passionnée par la sécurité
            </h2>
            
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Rekaire est composée d&apos;experts en sécurité incendie, d&apos;ingénieurs et de 
              professionnels dédiés à la protection de vos biens. Notre équipe travaille 
              chaque jour pour améliorer nos produits et vous offrir le meilleur service.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                Nous contacter
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/produit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
              >
                Découvrir le RK01
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
