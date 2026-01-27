"use client";

// ============================================
// REKAIRE - Success Page (Light Theme)
// ============================================

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, Mail, ArrowRight } from "lucide-react";
import { trackPaymentSuccess } from "@/lib/tracking";
import { content } from "@/config/content";
import { getMainProduct } from "@/config/product";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");
  const product = getMainProduct();

  useEffect(() => {
    // Track payment success
    if (orderId) {
      trackPaymentSuccess(
        orderId,
        product.priceCents,
        product.currency,
        product.id,
        product.name
      );
    }
  }, [orderId, product]);

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

        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-green-500" />
        </motion.div>

        {/* Content */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {content.success.title}
        </h1>
        <p className="text-xl text-gray-600 mb-2">{content.success.subtitle}</p>

        {/* Order ID */}
        {orderId && (
          <div className="bg-white rounded-lg px-6 py-4 mb-8 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Référence commande</p>
            <p className="text-lg font-mono text-gray-900">{orderId}</p>
          </div>
        )}

        {/* Email notice */}
        <div className="flex items-center justify-center gap-3 text-gray-600 mb-8">
          <Mail className="w-5 h-5" />
          <p className="text-sm">{content.success.message}</p>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm"
        >
          {content.success.cta}
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Session ID (dev) */}
        {process.env.NODE_ENV === "development" && sessionId && (
          <p className="mt-8 text-xs text-gray-400 font-mono break-all">
            Session: {sessionId}
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Chargement...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
