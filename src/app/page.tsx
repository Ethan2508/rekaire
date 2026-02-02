// ============================================
// REKAIRE - Home Page (Landing + Vente)
// ============================================

import {
  Header,
  Footer,
  HeroSection,
  FireStatsSection,
  FeaturesSection,
  HowItWorksSection,
  SpecificationsSection,
  PartnersSection,
  GuaranteesSection,
  CTASection,
  BlogPreviewSection,
} from "@/components";
import { LiveSalesCounter } from "@/components/live-sales-counter";

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
