"use client";

// ============================================
// REKAIRE - Partners Section (Clean Design)
// ============================================

import Image from "next/image";

const partners = [
  { name: "Synexium", logo: "/images/partners/synexium.png", size: "large" },
  { name: "Viva", logo: "/images/partners/viva.png", size: "large" },
  { name: "Socoda", logo: "/images/partners/socoda.png", size: "normal" },
  { name: "Brice Robert", logo: "/images/partners/bricerobert.webp", size: "normal" },
];

export function PartnersSection() {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 mb-8">
          Ils nous font confiance
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={partner.size === "large" ? 180 : 140}
                height={partner.size === "large" ? 80 : 60}
                className={`${partner.size === "large" ? "h-14 md:h-16" : "h-10 md:h-12"} w-auto object-contain`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
