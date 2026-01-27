"use client";

// ============================================
// REKAIRE - FAQ Contact Section
// ============================================

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

export function FAQContact() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <MessageCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vous n&apos;avez pas trouvé votre réponse ?
          </h2>
          <p className="text-gray-600 mb-8">
            Notre équipe est à votre disposition pour répondre à toutes vos questions.
          </p>
          
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
          >
            <Mail className="w-5 h-5" />
            Nous contacter
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
