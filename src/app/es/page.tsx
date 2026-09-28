// ============================================
// REKAIRE ES - Inicio (rekaire.es)
// ============================================

import type { Metadata } from "next";
import { HeaderEs } from "@/components/es/header-es";
import { FooterEs } from "@/components/es/footer-es";
import {
  HeroEs,
  ProblemEs,
  HowItWorksEs,
  WhereEs,
  SizingEs,
  AutonomyEs,
  AudienceEs,
  ObligationEs,
  RegulationTeaserEs,
  ConformityEs,
  FinalCtaEs,
} from "@/components/es/sections";
import { proFormHref } from "@/config/es/site";
import { hreflangAlternates } from "@/config/sites";

export const metadata: Metadata = {
  title: { absolute: "Extinción automática para cuadros eléctricos | Rekaire España" },
  description:
    "RK01: sistema autónomo de extinción por aerosol condensado para cuadros y armarios eléctricos. Activación a 170 °C, sin electricidad, sin batería y sin cableado. Protección localizada en el origen del riesgo.",
  alternates: hreflangAlternates("es", "/"),
};

export default function HomeEs() {
  return (
    <>
      <HeaderEs />
      <main>
        <HeroEs
          badge="Extinción automática para cuadros eléctricos"
          title="Protección automática localizada,"
          accent="directamente en el origen del riesgo."
          text="El RK01 es un sistema autónomo de extinción por aerosol condensado que se instala dentro de cuadros y armarios eléctricos. Se activa por sí solo a 170 °C y descarga en segundos, sin electricidad, sin batería y sin cableado."
          primary={{ href: proFormHref("proyecto"), label: "Estudiar un proyecto" }}
          secondary={{ href: "/rk01", label: "Descubrir el RK01" }}
        />
        <ProblemEs />
        <HowItWorksEs />
        <WhereEs />
        <SizingEs />
        <AutonomyEs />
        <AudienceEs />
        <ObligationEs />
        <RegulationTeaserEs />
        <ConformityEs />
        <FinalCtaEs />
      </main>
      <FooterEs />
    </>
  );
}
