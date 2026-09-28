"use client";

// ============================================
// REKAIRE ES - Header (reutiliza el Header del sitio francés)
// ============================================

import { Header } from "@/components/header";
import { esNav, proFormHref } from "@/config/es/site";
import { ButtonLink } from "./ui";

export function HeaderEs() {
  return (
    <Header
      navLinks={esNav}
      menuLabel="Menú"
      renderCTA={(placement) => (
        <ButtonLink
          href={proFormHref("proyecto")}
          location={`es-header-${placement}`}
          className={placement === "mobile" ? "w-full" : undefined}
        >
          Estudiar un proyecto
        </ButtonLink>
      )}
    />
  );
}
