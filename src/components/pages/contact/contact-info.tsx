// ============================================
// REKAIRE - Contact Info Sidebar
// ============================================

"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, MessageCircle, FileText } from "lucide-react";
import { siteConfig } from "@/config/site";
import Link from "next/link";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    description: "Pour toutes vos questions",
  },
  {
    icon: Phone,
    title: "Téléphone",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`,
    description: "Lun-Ven, 9h-18h",
  },
  {
    icon: MapPin,
    title: "Adresse",
    value: siteConfig.company.address,
    href: null,
    description: "Siège social",
  },
];

const quickLinks = [
  {
    icon: MessageCircle,
    title: "FAQ",
    description: "Réponses aux questions fréquentes",
    href: "/faq",
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Guides et fiches techniques",
    href: "/produit",
  },
];

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-8"
    >
      {/* Coordonnées */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Nos coordonnées
        </h3>
        <div className="space-y-5">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <method.icon className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{method.title}</h4>
                {method.href ? (
                  <a
                    href={method.href}
                    className="text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    {method.value}
                  </a>
                ) : (
                  <p className="text-gray-600">{method.value}</p>
                )}
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Horaires */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            Horaires d&apos;ouverture
          </h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Lundi - Vendredi</span>
            <span className="font-medium text-gray-900">9h00 - 18h00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Samedi</span>
            <span className="font-medium text-gray-900">Fermé</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Dimanche</span>
            <span className="font-medium text-gray-900">Fermé</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-orange-200">
          <p className="text-sm text-orange-700">
            📬 Emails traités sous 24-48h ouvrées
          </p>
        </div>
      </div>

      {/* Liens rapides */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Liens utiles
        </h3>
        <div className="space-y-3">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                <link.icon className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {link.title}
                </h4>
                <p className="text-sm text-gray-500">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Note de confidentialité */}
      <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
        <p>
          🔒 Vos données sont protégées et ne seront jamais partagées avec des tiers. 
          Consultez notre <Link href="/mentions-legales" className="text-orange-600 hover:underline">politique de confidentialité</Link>.
        </p>
      </div>
    </motion.div>
  );
}
