// ============================================
// REKAIRE - Contact Form Component (Premium Design)
// ============================================

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Mail, Building2, MessageSquare, CheckCircle2, Loader2, Sparkles } from "lucide-react";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  type: "particulier" | "professionnel";
};

const subjectOptions = [
  { value: "", label: "Sélectionnez un sujet" },
  { value: "produit", label: "Question sur le produit RK01" },
  { value: "devis", label: "Demande de devis professionnel" },
  { value: "commande", label: "Suivi de commande" },
  { value: "technique", label: "Support technique" },
  { value: "partenariat", label: "Demande de partenariat" },
  { value: "autre", label: "Autre demande" },
];

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    type: "particulier",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Simulation d'envoi (à connecter à une API réelle)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-3xl p-8 md:p-12 text-center overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-200/50 to-transparent rounded-full blur-2xl" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30"
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="relative text-2xl font-bold text-gray-900 mb-3">
          Message envoyé !
        </h3>
        <p className="relative text-gray-600 mb-6">
          Merci pour votre message. Notre équipe vous répondra dans les 24 à 48 heures ouvrées.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              company: "",
              subject: "",
              message: "",
              type: "particulier",
            });
          }}
          className="relative text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Envoyer un autre message
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative bg-white border border-gray-200/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/50 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-gray-100/50 to-transparent rounded-full blur-2xl" />
        
        <div className="relative">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Envoyez-nous un message
          </h2>
          <p className="text-gray-600 mb-8">
            Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type de client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Vous êtes
              </label>
              <div className="flex gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, type: "particulier" })}
                  className={`flex-1 py-4 px-4 rounded-2xl border-2 text-sm font-semibold transition-all ${
                    formData.type === "particulier"
                      ? "border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100/50 text-orange-700 shadow-lg shadow-orange-500/10"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <User className={`w-5 h-5 mx-auto mb-2 ${formData.type === "particulier" ? "text-orange-500" : ""}`} />
                  Particulier
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, type: "professionnel" })}
                  className={`flex-1 py-4 px-4 rounded-2xl border-2 text-sm font-semibold transition-all ${
                    formData.type === "professionnel"
                      ? "border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100/50 text-orange-700 shadow-lg shadow-orange-500/10"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Building2 className={`w-5 h-5 mx-auto mb-2 ${formData.type === "professionnel" ? "text-orange-500" : ""}`} />
                  Professionnel
                </motion.button>
              </div>
            </div>

            {/* Nom / Prénom */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-gray-50/50 hover:bg-white"
                    placeholder="Jean"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-gray-50/50 hover:bg-white"
                  placeholder="Dupont"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-gray-50/50 hover:bg-white"
                  placeholder="jean.dupont@email.com"
                />
              </div>
            </div>

            {/* Entreprise (conditionnel) */}
            {formData.type === "professionnel" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-gray-50/50 hover:bg-white"
                    placeholder="Nom de votre entreprise"
                  />
                </div>
              </motion.div>
            )}

            {/* Sujet */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Sujet *
              </label>
              <select
                id="subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all appearance-none bg-gray-50/50 hover:bg-white cursor-pointer"
              >
                {subjectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all resize-none bg-gray-50/50 hover:bg-white"
                  placeholder="Décrivez votre demande..."
                />
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-300 disabled:to-orange-400 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/30"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Envoyer le message
                </>
              )}
            </motion.button>

            <p className="text-xs text-gray-500 text-center">
              En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
            </p>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
