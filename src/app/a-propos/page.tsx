// ============================================
// REKAIRE - About Page (À propos / Qui sommes-nous)
// ============================================

import { Header, Footer } from "@/components";
import { AboutHero } from "@/components/pages/about/about-hero";
import { AboutMission } from "@/components/pages/about/about-mission";
import { AboutValues } from "@/components/pages/about/about-values";
import { AboutTeam } from "@/components/pages/about/about-team";
import { CTASection } from "@/components/sections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos - Qui sommes-nous | Rekaire",
  description: "Découvrez Rekaire, notre mission de protection contre les incendies électriques et notre engagement pour la sécurité de vos installations.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <AboutMission />
        <AboutValues />
        <AboutTeam />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
