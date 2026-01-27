// ============================================
// REKAIRE - Contact Page (Formulaire complet)
// ============================================

import { Header, Footer } from "@/components";
import { ContactHero, ContactForm, ContactInfo } from "@/components/pages/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Rekaire",
  description: "Contactez l'équipe Rekaire - Questions sur le RK01, demandes de devis professionnels, support technique. Réponse sous 24-48h.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <ContactHero />
        <div className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Formulaire - 3 colonnes */}
              <div className="lg:col-span-3">
                <ContactForm />
              </div>
              {/* Infos contact - 2 colonnes */}
              <div className="lg:col-span-2">
                <ContactInfo />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
