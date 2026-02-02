// ============================================
// REKAIRE - Footer Component (Dark Innovative)
// ============================================

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { content } from "@/config/content";
import { Mail, ArrowUpRight, Shield, Truck, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-[#0A0A0B] text-white overflow-hidden">
      {/* Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block mb-5 group">
              <Image
                src="/logo.png"
                alt="Rekaire"
                width={120}
                height={35}
                className="h-8 w-auto brightness-0 invert transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-white/50 text-sm mb-5 max-w-xs leading-relaxed">
              {content.footer.description}
            </p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex items-center gap-2 text-white/60 hover:text-orange-400 transition-colors text-sm group"
            >
              <Mail className="w-4 h-4" />
              <span>{siteConfig.contact.email}</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
            </a>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm">Produit</h4>
            <ul className="space-y-3">
              {[
                { href: "/produit", label: "RK01" },
                { href: "/produit#specifications", label: "Spécifications" },
                { href: "/#how-it-works", label: "Fonctionnement" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm">Entreprise</h4>
            <ul className="space-y-3">
              {[
                { href: "/a-propos", label: "À propos" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm">Légal</h4>
            <ul className="space-y-3">
              {[
                { href: "/mentions-legales", label: "Mentions légales" },
                { href: "/cgv", label: "CGV" },
                { href: "/confidentialite", label: "Confidentialité" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm">Confiance</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-white/50">
                <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                Paiement sécurisé
              </li>
              <li className="flex items-center gap-2 text-white/50">
                <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5 text-blue-400" />
                </div>
                Livraison France
              </li>
              <li className="flex items-center gap-2 text-white/50">
                <div className="w-6 h-6 rounded-md bg-orange-500/20 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5 text-orange-400" />
                </div>
                Garantie 2 ans
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">{content.footer.copyright}</p>
          <div className="flex items-center gap-3">
            <span className="text-white/30 text-xs">Paiement sécurisé par</span>
            <div className="px-3 py-1.5 bg-white/5 rounded-md border border-white/10">
              <span className="text-white/60 text-xs font-medium tracking-wider">STRIPE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
