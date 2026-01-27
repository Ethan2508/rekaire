// ============================================
// REKAIRE - Footer Component (Light Theme - Updated)
// ============================================

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { content } from "@/config/content";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image
              src="/logo.png"
              alt="Rekaire"
              width={120}
              height={35}
              className="h-8 w-auto mb-4"
            />
            <p className="text-gray-600 text-sm max-w-xs mb-6">
              {content.footer.description}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-gray-500 hover:text-orange-500 transition-colors text-sm"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>

          {/* Produit */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Produit</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/produit"
                  className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  RK01
                </Link>
              </li>
              <li>
                <Link
                  href="/produit#specifications"
                  className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  Spécifications
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  Fonctionnement
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/a-propos"
                  className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Légal</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/cgv"
                  className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  CGV
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">{content.footer.copyright}</p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>🔒 Paiement sécurisé Stripe</span>
            <span>🚚 Livraison France</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
