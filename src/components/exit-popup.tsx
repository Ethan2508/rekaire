"use client";

// ============================================
// REKAIRE - Exit Popup
// Capture email avant que l'utilisateur quitte
// ============================================

import { useState, useEffect } from "react";
import { X, Mail, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ExitPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Vérifier si déjà affiché dans cette session
    const shown = sessionStorage.getItem("exitPopupShown");
    if (shown) return;

    let exitIntent = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Détection sortie par le haut de la page
      if (e.clientY <= 0 && !exitIntent && !hasShown) {
        exitIntent = true;
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("exitPopupShown", "true");
      }
    };

    // Ajouter listener après 3 secondes (éviter trigger immédiat)
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Envoyer à l'API de contact (webhook Zapier)
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          subject: "Newsletter - Exit Popup",
          message: "Inscription newsletter via exit popup",
          type: "newsletter",
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Erreur soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 p-8 text-white">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Gift className="w-8 h-8" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-center mb-2">
                  Attendez ! 🎁
                </h2>
                <p className="text-center text-white/90">
                  Recevez <strong>10% de réduction</strong> sur votre première commande
                </p>
              </div>

              {/* Body */}
              <div className="p-8">
                {!isSuccess ? (
                  <>
                    <p className="text-gray-600 text-center mb-6">
                      Inscrivez-vous à notre newsletter et recevez le code <strong className="text-orange-600">REKAIRE12</strong>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="votre@email.com"
                          required
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? "Envoi..." : "Obtenir mon code promo"}
                      </button>

                      <p className="text-xs text-gray-500 text-center">
                        Pas de spam. Désinscription à tout moment.
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      C'est fait ! 🎉
                    </h3>
                    <p className="text-gray-600">
                      Votre code promo <strong>REKAIRE12</strong> vous attend dans votre boîte mail
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
