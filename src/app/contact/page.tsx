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

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <ContactHero />
        <div className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Confirmation après une demande de devis depuis le checkout */}
            {success === "devis" && (
              <div className="mb-12 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-emerald-800">
                <p className="font-semibold">Votre demande de devis a bien été envoyée.</p>
                <p className="text-sm mt-1">Notre équipe vous recontacte sous 24 à 48 heures ouvrées.</p>
              </div>
            )}
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
