// ============================================
// REKAIRE - Page 404 globale (FR / ES)
// Nécessaire car le site a deux root layouts : (fr) et es
// ============================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Page introuvable · Página no encontrada | Rekaire",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="bg-white text-gray-900 antialiased">
        <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
          <div className="text-center max-w-lg">
            <p className="text-6xl font-bold text-orange-500">404</p>
            <h1 className="mt-4 text-2xl font-bold">Page introuvable</h1>
            <p className="mt-2 text-gray-600">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
            <p lang="es" className="mt-6 text-2xl font-bold">Página no encontrada</p>
            <p lang="es" className="mt-2 text-gray-600">La página que buscas no existe o se ha movido.</p>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- page hors layout, navigation complète voulue */}
            <a href="/" className="mt-8 inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold">
              Accueil · Inicio
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
