// ============================================
// REKAIRE - Blog Page
// ============================================

import { Header, Footer } from "@/components";
import { BlogHero, BlogGrid, BlogCategories } from "@/components/pages/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Rekaire - Actualités et conseils sécurité incendie",
  description: "Découvrez nos articles sur la prévention des incendies électriques, conseils de sécurité et actualités Rekaire.",
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <BlogHero />
        <div className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Sidebar - Catégories */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <BlogCategories />
              </div>
              {/* Articles Grid */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                <BlogGrid />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
