// ============================================
// REKAIRE - Home Page (Landing + Vente)
// Première moitié sombre et cinématique (RK01 en 3D piloté par le scroll),
// puis retour à la lumière pour la confiance et la commande.
// ============================================

import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { hreflangAlternates } from "@/config/sites";
import { Header, Footer, PartnersSection } from "@/components";
import { ScrollSequence } from "@/components/home/scroll-sequence";

// Lazy-load des sections sous le fold pour réduire le JS bundle initial
const StatsDark = dynamic(() => import("@/components/home/stats-dark").then((m) => ({ default: m.StatsDark })));
const StepsDark = dynamic(() => import("@/components/home/steps-dark").then((m) => ({ default: m.StepsDark })));
const FeaturesDark = dynamic(() => import("@/components/home/features-dark").then((m) => ({ default: m.FeaturesDark })));
const SpecsDark = dynamic(() => import("@/components/home/specs-dark").then((m) => ({ default: m.SpecsDark })));
const BlogPreviewSection = dynamic(() => import("@/components/sections/blog-preview").then((m) => ({ default: m.BlogPreviewSection })));
const GuaranteesSection = dynamic(() => import("@/components/sections/guarantees").then((m) => ({ default: m.GuaranteesSection })));
const CTASection = dynamic(() => import("@/components/sections/cta").then((m) => ({ default: m.CTASection })));
const LiveSalesCounter = dynamic(() => import("@/components/live-sales-counter").then((m) => ({ default: m.LiveSalesCounter })));

export const metadata: Metadata = {
  alternates: hreflangAlternates("fr", "/"),
};

export default function HomePage() {
  return (
    <>
      <Header theme="auto" />
      <main className="bg-[#0a0a0b]">
        <ScrollSequence />
        <StatsDark />
        <StepsDark />
        <FeaturesDark />
        <SpecsDark />
        <PartnersSection />
        <BlogPreviewSection />
        <GuaranteesSection />
        <CTASection />
      </main>
      <Footer />
      {/* Live Sales Notifications */}
      <LiveSalesCounter />
    </>
  );
}
