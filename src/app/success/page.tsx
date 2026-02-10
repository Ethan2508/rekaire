"use client";

// ============================================
// REKAIRE - Success Page (avec vérification serveur)
// ============================================

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { trackPaymentSuccess } from "@/lib/tracking";
import { content } from "@/config/content";
import { getMainProduct } from "@/config/product";

type VerificationState = "loading" | "verified" | "error" | "pending";

interface VerificationResult {
  verified: boolean;
  pending?: boolean;
  orderId?: string;
  orderNumber?: string;
  email?: string;
  error?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");
  const product = getMainProduct();

  const [state, setState] = useState<VerificationState>("loading");
  const [verificationData, setVerificationData] = useState<VerificationResult | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId && !orderId) {
        setState("error");
        return;
      }

      try {
        const params = new URLSearchParams();
        if (sessionId) params.set("session_id", sessionId);
        if (orderId) params.set("order_id", orderId);

        const response = await fetch(`/api/verify-payment?${params.toString()}`);
        const data: VerificationResult = await response.json();

        if (data.verified) {
          setState("verified");
          setVerificationData(data);
          // Track conversion
          trackPaymentSuccess(
            data.orderId || orderId || "",
            product.priceCents / 100,
            "EUR"
          );
        } else if (data.pending) {
          setState("pending");
          setVerificationData(data);
        } else {
          setState("error");
          setVerificationData(data);
        }
      } catch (error) {
        console.error("Verification error:", error);
        setState("error");
      }
    }

    verifyPayment();
  }, [sessionId, orderId, product.priceCents, router]);

  // Loading state
  if (state === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vérification de votre paiement...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (state === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Erreur de vérification
            </h1>
            <p className="text-gray-600 mb-6">
              {verificationData?.error || "Impossible de vérifier votre paiement. Si vous avez été débité, contactez-nous."}
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
              >
                Nous contacter
              </Link>
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pending state
  if (state === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Paiement en cours de traitement
            </h1>
            <p className="text-gray-600 mb-6">
              Votre paiement est en cours de confirmation. Vous recevrez un email de confirmation dans quelques minutes.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Commande confirmée !
          </h1>
          <p className="text-lg text-gray-600">
            Merci pour votre confiance, {verificationData?.email?.split("@")[0]}
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="p-6 md:p-8">
            {/* Order Number */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500 mb-1">Numéro de commande</p>
                <p className="text-lg font-bold text-gray-900">
                  {verificationData?.orderNumber || orderId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Statut</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Confirmée
                </span>
              </div>
            </div>

            {/* Product */}
            <div className="py-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Image
                    src="/images/product/rk01-main.png"
                    alt={product.name}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.shortDescription}</p>
                </div>
              </div>
            </div>

            {/* Email Confirmation */}
            <div className="pt-6">
              <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl">
                <Mail className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">
                    Email de confirmation envoyé
                  </p>
                  <p className="text-sm text-gray-600">
                    Un email avec votre facture et les détails de livraison a été envoyé à{" "}
                    <span className="font-medium">{verificationData?.email}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Prochaines étapes</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Préparation de votre commande</p>
                <p className="text-sm text-gray-500">Votre RK01 sera expédié sous 24-48h</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Suivi de livraison</p>
                <p className="text-sm text-gray-500">Vous recevrez un email avec le numéro de suivi</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Installation en 30 secondes</p>
                <p className="text-sm text-gray-500">Suivez notre guide simple inclus dans le colis</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            Retour à l&apos;accueil
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
