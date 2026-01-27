// ============================================
// REKAIRE - Politique de Confidentialité
// ============================================

import { Header, Footer } from "@/components";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité du site Rekaire",
};

export default function ConfidentialitePage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Politique de confidentialité
          </h1>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600">
                La présente politique de confidentialité décrit comment{" "}
                {siteConfig.company.legalName} collecte, utilise et protège vos
                données personnelles lorsque vous utilisez notre site{" "}
                {siteConfig.url}.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Responsable du traitement
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-700 mb-2">
                  <strong>Société :</strong> {siteConfig.company.legalName}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Adresse :</strong> {siteConfig.company.address}
                </p>
                <p className="text-gray-700">
                  <strong>Email :</strong>{" "}
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    {siteConfig.contact.email}
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. Données collectées
              </h2>
              <p className="text-gray-600 mb-4">
                Nous collectons uniquement les données strictement nécessaires
                au traitement de votre commande :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Adresse email</li>
                <li>Nom et prénom</li>
                <li>Adresse de livraison</li>
                <li>Informations de paiement (traitées par Stripe)</li>
                <li>Historique de commande</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. Finalités du traitement
              </h2>
              <p className="text-gray-600 mb-4">
                Vos données sont utilisées pour :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Traiter et expédier vos commandes</li>
                <li>Vous envoyer les confirmations de commande</li>
                <li>Gérer le service après-vente</li>
                <li>Respecter nos obligations légales</li>
                <li>
                  Améliorer notre site (données anonymisées via analytics)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. Base légale
              </h2>
              <p className="text-gray-600">
                Le traitement de vos données repose sur l&apos;exécution du contrat
                de vente (votre commande) et nos obligations légales
                (facturation, comptabilité).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                6. Destinataires des données
              </h2>
              <p className="text-gray-600 mb-4">
                Vos données peuvent être transmises à :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <strong>Stripe</strong> – pour le traitement sécurisé des
                  paiements
                </li>
                <li>
                  <strong>Notre transporteur</strong> – pour la livraison
                </li>
                <li>
                  <strong>Resend</strong> – pour l&apos;envoi des emails
                  transactionnels
                </li>
                <li>
                  <strong>Vercel</strong> – hébergeur du site
                </li>
              </ul>
              <p className="text-gray-600 mt-4">
                Nous ne vendons jamais vos données à des tiers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7. Durée de conservation
              </h2>
              <p className="text-gray-600">
                Vos données sont conservées pendant la durée nécessaire aux
                finalités mentionnées, et au maximum pendant les durées légales
                de conservation (10 ans pour les documents comptables).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                8. Cookies et traceurs
              </h2>
              <p className="text-gray-600 mb-4">
                Notre site utilise des cookies pour :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>
                  <strong>Fonctionnement du site</strong> – cookies essentiels
                </li>
                <li>
                  <strong>Analyse d&apos;audience</strong> – Google Analytics (GA4)
                </li>
                <li>
                  <strong>Publicité</strong> – Meta Pixel, Google Ads
                </li>
              </ul>
              <p className="text-gray-600">
                Vous pouvez gérer vos préférences de cookies via les paramètres
                de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                9. Vos droits
              </h2>
              <p className="text-gray-600 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Droit d&apos;accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l&apos;effacement</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité</li>
                <li>Droit d&apos;opposition</li>
              </ul>
              <p className="text-gray-600">
                Pour exercer ces droits, contactez-nous à{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {siteConfig.contact.email}
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                10. Sécurité
              </h2>
              <p className="text-gray-600">
                Nous mettons en œuvre des mesures de sécurité appropriées pour
                protéger vos données contre tout accès non autorisé,
                modification, divulgation ou destruction. Les paiements sont
                traités de manière sécurisée par Stripe (certifié PCI-DSS).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                11. Réclamation
              </h2>
              <p className="text-gray-600">
                Si vous estimez que vos droits ne sont pas respectés, vous
                pouvez introduire une réclamation auprès de la CNIL (Commission
                Nationale de l&apos;Informatique et des Libertés) :{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-600"
                >
                  www.cnil.fr
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                12. Modification
              </h2>
              <p className="text-gray-600">
                Nous nous réservons le droit de modifier cette politique de
                confidentialité à tout moment. Les modifications seront publiées
                sur cette page avec une date de mise à jour.
              </p>
            </section>
          </div>

          <p className="mt-12 text-sm text-gray-600">
            Dernière mise à jour : Janvier 2026
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
