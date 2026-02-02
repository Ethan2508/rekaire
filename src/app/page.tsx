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
  SocialProofSection,
  PartnersSection,
  GuaranteesSection,
  CTASection,
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
        <SocialProofSection />
        <GuaranteesSection />
        <CTASection />
      </main>
      <Footer />
      {/* Live Sales Notifications */}
      <LiveSalesCounter />
    </>
  );
}
