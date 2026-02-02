// ============================================
// REKAIRE - Footer Component (Clean Design)
// ============================================

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { content } from "@/config/content";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="Rekaire"
                width={120}
                height={35}
                className="h-8 w-auto brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-gray-500 text-sm mb-4 max-w-xs">
              {content.footer.description}
            </p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              {siteConfig.contact.email}
            </a>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Produit</h4>
            <ul className="space-y-2">
              {[
                { href: "/produit", label: "RK01" },
                { href: "/produit#specifications", label: "Spécifications" },
                { href: "/#how-it-works", label: "Fonctionnement" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Entreprise</h4>
            <ul className="space-y-2">
              {[
                { href: "/a-propos", label: "À propos" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Légal</h4>
            <ul className="space-y-2">
              {[
                { href: "/mentions-legales", label: "Mentions légales" },
                { href: "/cgv", label: "CGV" },
                { href: "/confidentialite", label: "Confidentialité" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Confiance</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li>🔒 Paiement sécurisé</li>
              <li>🚚 Livraison France</li>
              <li>✓ Garantie 2 ans</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-600 text-xs">{content.footer.copyright}</p>
          <div className="flex items-center gap-2">
            <span className="text-gray-700 text-xs">Propulsé par</span>
            <span className="text-gray-500 text-xs font-medium">Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
