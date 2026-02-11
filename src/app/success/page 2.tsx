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

        setVerificationData(data);

        if (data.verified) {
          setState(data.pending ? "pending" : "verified");
          
          // Track payment success seulement si vérifié
          if (!data.pending && data.orderId) {
            trackPaymentSuccess(
              data.orderId,
              product.priceCents,
              product.currency,
              product.id,
              product.name
            );
          }
        } else {
          setState("error");
          // Rediriger vers cancel après 5 secondes si non payé
          setTimeout(() => {
            router.push(`/cancel?order_id=${orderId || ""}&reason=payment_not_verified`);
          }, 5000);
        }
      } catch (error) {
        console.error("[Success] Verification error:", error);
        setState("error");
      }
    }

    verifyPayment();
  }, [orderId, sessionId, product, router]);

  // État de chargement
  if (state === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (state === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Paiement non vérifié
          </h1>
          <p className="text-gray-600 mb-8">
            {verificationData?.error || "Nous n'avons pas pu confirmer votre paiement."}
            <br />
            <span className="text-sm">Redirection automatique dans 5 secondes...</span>
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Contactez-nous
          </Link>
        </div>
      </div>
    );
  }

  // État en attente (webhook en cours)
  if (state === "pending") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Paiement confirmé !
          </h1>
          <p className="text-gray-600 mb-8">
            Votre paiement a été reçu. Nous finalisons votre commande...
            <br />
            <span className="text-sm">Vous recevrez un email de confirmation sous peu.</span>
          </p>
        </div>
      </div>
    );
  }

  // État vérifié - SUCCESS
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
        {(verificationData?.orderNumber || orderId) && (
          <div className="bg-white rounded-lg px-6 py-4 mb-8 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Référence commande</p>
            <p className="text-lg font-mono text-gray-900">
              {verificationData?.orderNumber || orderId}
            </p>
          </div>
        )}

        {/* Email notice */}
        <div className="flex items-center justify-center gap-3 text-gray-600 mb-8">
          <Mail className="w-5 h-5" />
          <p className="text-sm">
            {verificationData?.email 
              ? `Email de confirmation envoyé à ${verificationData.email}`
              : content.success.message
            }
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm"
        >
          {content.success.cta}
          <ArrowRight className="w-4 h-4" />
        </Link>
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
