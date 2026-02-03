"use client";

// ============================================
// REKAIRE - Checkout Progress Bar
// Barre de progression visuelle du checkout
// ============================================

import { Check } from "lucide-react";

interface CheckoutProgressProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { number: 1, label: "Informations" },
  { number: 2, label: "Paiement" },
  { number: 3, label: "Confirmation" },
];

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Ligne de progression */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-10">
          <div
            className="h-full bg-orange-500 transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center relative">
              {/* Cercle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  isCompleted
                    ? "bg-orange-500 text-white"
                    : isCurrent
                    ? "bg-orange-500 text-white ring-4 ring-orange-100"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-xs font-medium ${
                  isCurrent || isCompleted
                    ? "text-gray-900"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
