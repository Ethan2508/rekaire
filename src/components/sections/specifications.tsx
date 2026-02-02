"use client";

// ============================================
// REKAIRE - Specifications Section (Clean Design)
// ============================================

import Image from "next/image";
import { getMainProduct } from "@/config/product";
import { CheckCircle2 } from "lucide-react";

export function SpecificationsSection() {
  const product = getMainProduct();

  return (
    <section id="specifications" className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="text-orange-500 font-medium text-sm uppercase tracking-wider">
              Fiche technique
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Spécifications techniques
            </h2>
            <p className="text-gray-600 mb-8">
              Le RK01 est conçu pour une protection maximale avec une simplicité d&apos;utilisation totale.
            </p>

            {/* Specs table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {Object.entries(product.specifications).map(([key, value], index) => (
                <div
                  key={key}
                  className={`flex justify-between items-center px-5 py-3 ${
                    index !== Object.entries(product.specifications).length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <span className="text-gray-600 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-400" />
                    {key}
                  </span>
                  <span className="text-gray-900 font-medium text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual - Exploded view */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="space-y-4">
              {/* Part 1 - Top */}
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Image
                    src="/images/product/rk01-part1.png"
                    alt="RK01 - Capuchon"
                    width={80}
                    height={80}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Capuchon protecteur</p>
                  <p className="text-gray-500 text-xs">Résistant à la chaleur</p>
                </div>
              </div>

              {/* Part 2 */}
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Image
                    src="/images/product/rk01-part2.png"
                    alt="RK01 - Mécanisme"
                    width={80}
                    height={80}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Mécanisme de déclenchement</p>
                  <p className="text-gray-500 text-xs">Activation à 90°C</p>
                </div>
              </div>

              {/* Part 3 */}
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Image
                    src="/images/product/rk01-part3.png"
                    alt="RK01 - Réservoir"
                    width={80}
                    height={80}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Agent extincteur</p>
                  <p className="text-gray-500 text-xs">Efficace sur feux électriques</p>
                </div>
              </div>

              {/* Part 4 - Bottom */}
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Image
                    src="/images/product/rk01-part4.png"
                    alt="RK01 - Base"
                    width={80}
                    height={80}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Support de fixation</p>
                  <p className="text-gray-500 text-xs">Adhésif haute résistance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
