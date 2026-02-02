// ============================================
// REKAIRE - Contact Info Sidebar (Premium Design)
// ============================================

"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, MessageCircle, FileText, ArrowRight, Shield } from "lucide-react";
import { siteConfig } from "@/config/site";
import Link from "next/link";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    description: "Pour toutes vos questions",
    color: "from-orange-500 to-orange-600",
    shadow: "shadow-orange-500/30",
  },
  {
    icon: Phone,
    title: "Téléphone",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`,
    description: "Lun-Ven, 9h-18h",
    color: "from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/30",
  },
  {
    icon: MapPin,
    title: "Adresse",
    value: siteConfig.company.address,
    href: null,
    description: "Siège social",
    color: "from-emerald-500 to-emerald-600",
    shadow: "shadow-emerald-500/30",
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
      className="space-y-6"
    >
      {/* Coordonnées - Premium Card */}
      <div className="relative bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-100/30 to-transparent rounded-full blur-2xl" />
        
        <h3 className="relative text-lg font-bold text-gray-900 mb-6">
          Nos coordonnées
        </h3>
        <div className="relative space-y-5">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="flex items-start gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center flex-shrink-0 shadow-lg ${method.shadow} group-hover:scale-105 transition-transform`}>
                <method.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{method.title}</h4>
                {method.href ? (
                  <a
                    href={method.href}
                    className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
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

      {/* Horaires - Premium Card */}
      <div className="relative bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200/80 rounded-3xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-200/50 to-transparent rounded-full blur-xl" />
        
        <div className="relative flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            Horaires d&apos;ouverture
          </h3>
        </div>
        <div className="relative space-y-3 text-sm">
          {[
            { day: "Lundi - Vendredi", hours: "9h00 - 18h00", active: true },
            { day: "Samedi", hours: "Fermé", active: false },
            { day: "Dimanche", hours: "Fermé", active: false },
          ].map((schedule) => (
            <div key={schedule.day} className="flex justify-between items-center">
              <span className="text-gray-600">{schedule.day}</span>
              <span className={`font-semibold ${schedule.active ? "text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full" : "text-gray-500"}`}>
                {schedule.hours}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-5 pt-5 border-t border-orange-200">
          <p className="text-sm text-orange-700 font-medium flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Emails traités sous 24-48h ouvrées
          </p>
        </div>
      </div>

      {/* Liens rapides - Premium */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Liens utiles
        </h3>
        <div className="space-y-3">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200/80 rounded-2xl hover:border-orange-300 hover:shadow-lg shadow-sm transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-orange-600 flex items-center justify-center transition-all duration-300">
                <link.icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {link.title}
                </h4>
                <p className="text-sm text-gray-500">{link.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Note de confidentialité - Premium */}
      <div className="flex items-start gap-3 text-sm text-gray-600 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-4 border border-gray-200/80">
        <div className="w-8 h-8 rounded-lg bg-gray-200/80 flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-gray-500" />
        </div>
        <p>
          Vos données sont protégées et ne seront jamais partagées avec des tiers. 
          Consultez notre <Link href="/mentions-legales" className="text-orange-600 hover:underline font-medium">politique de confidentialité</Link>.
        </p>
      </div>
    </motion.div>
  );
}
