// ============================================
// REKAIRE - Home Page (Landing + Vente)
// ============================================

import dynamic from "next/dynamic";
import {
  Header,
  Footer,
  HeroSection,
  FireStatsSection,
  PartnersSection,
} from "@/components";

// Lazy-load des sections sous le fold pour réduire le JS bundle initial
const FeaturesSection = dynamic(() => import("@/components/sections/features").then((m) => ({ default: m.FeaturesSection })));
const HowItWorksSection = dynamic(() => import("@/components/sections/how-it-works").then((m) => ({ default: m.HowItWorksSection })));
const SpecificationsSection = dynamic(() => import("@/components/sections/specifications").then((m) => ({ default: m.SpecificationsSection })));
const BlogPreviewSection = dynamic(() => import("@/components/sections/blog-preview").then((m) => ({ default: m.BlogPreviewSection })));
const GuaranteesSection = dynamic(() => import("@/components/sections/guarantees").then((m) => ({ default: m.GuaranteesSection })));
const CTASection = dynamic(() => import("@/components/sections/cta").then((m) => ({ default: m.CTASection })));
const LiveSalesCounter = dynamic(() => import("@/components/live-sales-counter").then((m) => ({ default: m.LiveSalesCounter })));

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FireStatsSection />
        <PartnersSection />
        <FeaturesSection />
        <HowItWorksSection />
        <SpecificationsSection />
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
