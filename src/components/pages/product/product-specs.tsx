"use client";

// ============================================
// REKAIRE - Product Specs Section
// ============================================

import { motion } from "framer-motion";
import { getMainProduct } from "@/config/product";

export function ProductSpecs() {
  const product = getMainProduct();

  const additionalSpecs = {
    "Certifications": "CE, Norme EN3",
    "Température de déclenchement": "170°C ± 5°C",
    "Temps de réaction": "< 3 secondes",
    "Couverture": "Jusqu'à 1m³",
    "Matériaux": "ABS haute résistance",
    "Conditions de stockage": "-20°C à +50°C",
    "Humidité relative": "< 95%",
    "Garantie": "5 ans",
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Spécifications techniques
          </h2>
          <p className="text-lg text-gray-600">
            Tous les détails techniques du RK01 pour une intégration parfaite dans vos installations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Main Specs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4 bg-gray-900">
              <h3 className="text-lg font-semibold text-white">Caractéristiques physiques</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center px-6 py-4">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Additional Specs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4 bg-orange-500">
              <h3 className="text-lg font-semibold text-white">Performances & Certifications</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {Object.entries(additionalSpecs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center px-6 py-4">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Download section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">
            Besoin de plus d&apos;informations techniques ?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
          >
            Demander la fiche technique complète
          </a>
        </motion.div>
      </div>
    </section>
  );
}
