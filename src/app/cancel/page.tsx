"use client";

// ============================================
// REKAIRE - Cancel Page (Light Theme)
// ============================================

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { XCircle, ArrowRight, RefreshCw } from "lucide-react";
import { trackPaymentFailed } from "@/lib/tracking";
import { content } from "@/config/content";
import { CTAButton } from "@/components/cta-button";

function CancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    // Track payment failed/cancelled
    if (orderId) {
      trackPaymentFailed(orderId);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Logo */}
        <Link href="/" className="inline-block mb-8">
          <Image
            src="/logo.png"
            alt="Rekaire"
            width={140}
            height={40}
            className="h-10 w-auto mx-auto"
          />
        </Link>

        {/* Cancel Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <XCircle className="w-10 h-10 text-gray-500" />
        </motion.div>

        {/* Content */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {content.cancel.title}
        </h1>
        <p className="text-xl text-gray-600 mb-8">{content.cancel.subtitle}</p>

        <p className="text-gray-500 mb-8">{content.cancel.message}</p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <CTAButton location="cancel-page" size="default">
            <RefreshCw className="w-4 h-4 mr-2" />
            {content.cancel.cta}
          </CTAButton>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm"
          >
            Retour à l&apos;accueil
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Order ID (si présent) */}
        {orderId && (
          <p className="mt-8 text-xs text-gray-600">
            Référence: {orderId}
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Chargement...</div>
        </div>
      }
    >
      <CancelContent />
    </Suspense>
  );
}
