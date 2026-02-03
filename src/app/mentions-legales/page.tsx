// ============================================
// REKAIRE - Mentions Légales (Light Theme)
// ============================================

import { Header, Footer } from "@/components";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Rekaire",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Mentions légales
          </h1>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Éditeur du site
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-700 mb-2">
                  <strong>Raison sociale :</strong> {siteConfig.company.legalName}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>SIREN :</strong> {siteConfig.company.siren}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>SIRET :</strong> {siteConfig.company.siret}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>N° TVA intracommunautaire :</strong> {siteConfig.company.tva}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Capital social :</strong> {siteConfig.company.capital}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>RCS :</strong> {siteConfig.company.rcs}
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

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Directeur de la publication
              </h2>
              <p className="text-gray-600">
                Le directeur de la publication est le représentant légal de la
                société {siteConfig.company.legalName}.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. Hébergement
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-700 mb-2">
                  <strong>Hébergeur :</strong> {siteConfig.hosting.provider}
                </p>
                <p className="text-gray-700">
                  <strong>Adresse :</strong> {siteConfig.hosting.address}
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. Propriété intellectuelle
              </h2>
              <p className="text-gray-600 mb-4">
                L&apos;ensemble du contenu de ce site (textes, images, graphismes,
                logo, icônes, etc.) est la propriété exclusive de{" "}
                {siteConfig.company.name}, à l&apos;exception des marques, logos ou
                contenus appartenant à d&apos;autres sociétés partenaires ou auteurs.
              </p>
              <p className="text-gray-600">
                Toute reproduction, distribution, modification, adaptation,
                retransmission ou publication, même partielle, de ces différents
                éléments est strictement interdite sans l&apos;accord exprès par écrit
                de {siteConfig.company.name}.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. Données personnelles
              </h2>
              <p className="text-gray-600 mb-4">
                Les informations recueillies sur ce site sont enregistrées dans un
                fichier informatisé par {siteConfig.company.name} pour le
                traitement de vos commandes et la gestion de notre relation
                commerciale.
              </p>
              <p className="text-gray-600 mb-4">
                Conformément à la loi « Informatique et Libertés » du 6 janvier
                1978 modifiée et au Règlement Général sur la Protection des
                Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de
                rectification, de suppression et d&apos;opposition aux données vous
                concernant.
              </p>
              <p className="text-gray-600">
                Pour exercer ces droits, contactez-nous à :{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                6. Cookies
              </h2>
              <p className="text-gray-600 mb-4">
                Ce site utilise des cookies pour améliorer l&apos;expérience
                utilisateur et mesurer l&apos;audience. En poursuivant votre
                navigation, vous acceptez l&apos;utilisation de cookies.
              </p>
              <p className="text-gray-600">
                Pour plus d&apos;informations, consultez notre{" "}
                <a
                  href="/confidentialite"
                  className="text-orange-500 hover:text-orange-600"
                >
                  Politique de confidentialité
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7. Droit applicable
              </h2>
              <p className="text-gray-600">
                Les présentes mentions légales sont soumises au droit français.
                En cas de litige, et après échec de toute tentative de recherche
                d&apos;une solution amiable, les tribunaux français seront seuls
                compétents.
              </p>
            </section>
          </div>

          <p className="mt-12 text-sm text-gray-400">
            Dernière mise à jour : Janvier 2026
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
