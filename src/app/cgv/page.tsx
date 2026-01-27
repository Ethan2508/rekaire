// ============================================
// REKAIRE - Conditions Générales de Vente
// ============================================

import { Header, Footer } from "@/components";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description: "CGV du site Rekaire",
};

export default function CGVPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Conditions Générales de Vente
          </h1>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 1 – Objet
              </h2>
              <p className="text-gray-600">
                Les présentes Conditions Générales de Vente (CGV) régissent les
                ventes de produits effectuées par {siteConfig.company.legalName}{" "}
                via le site internet {siteConfig.url}. Toute commande implique
                l&apos;acceptation sans réserve des présentes CGV.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 2 – Produits
              </h2>
              <p className="text-gray-600 mb-4">
                Les produits proposés à la vente sont ceux qui figurent sur le
                site, dans la limite des stocks disponibles. Les photographies
                illustrant les produits n&apos;entrent pas dans le champ
                contractuel.
              </p>
              <p className="text-gray-600">
                {siteConfig.company.name} se réserve le droit de modifier
                l&apos;assortiment de produits à tout moment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 3 – Prix
              </h2>
              <p className="text-gray-600 mb-4">
                Les prix sont indiqués en euros, toutes taxes comprises (TTC).
                La TVA applicable est celle en vigueur au jour de la commande.
              </p>
              <p className="text-gray-600">
                {siteConfig.company.name} se réserve le droit de modifier ses
                prix à tout moment, étant entendu que le prix figurant au
                catalogue le jour de la commande sera le seul applicable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 4 – Commande
              </h2>
              <p className="text-gray-600 mb-4">
                Le client passe commande sur le site internet. La validation de
                la commande implique l&apos;acceptation des présentes CGV et
                constitue un contrat de vente.
              </p>
              <p className="text-gray-600">
                Une confirmation de commande est envoyée par email à
                l&apos;adresse fournie par le client.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 5 – Paiement
              </h2>
              <p className="text-gray-600 mb-4">
                Le paiement s&apos;effectue en ligne par carte bancaire (Visa,
                Mastercard), Apple Pay ou Google Pay, via la plateforme
                sécurisée Stripe.
              </p>
              <p className="text-gray-600">
                La commande est validée après confirmation du paiement. Les
                données bancaires sont transmises de manière chiffrée et ne sont
                jamais stockées par {siteConfig.company.name}.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 6 – Livraison
              </h2>
              <p className="text-gray-600 mb-4">
                Les produits sont livrés en France métropolitaine uniquement. Le
                délai de livraison est de 24 à 48 heures ouvrées après
                validation du paiement.
              </p>
              <p className="text-gray-600 mb-4">
                Les frais de livraison sont indiqués avant la validation de la
                commande.
              </p>
              <p className="text-gray-600">
                En cas de retard de livraison supérieur à 7 jours, le client
                peut annuler sa commande et obtenir un remboursement intégral.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 7 – Droit de rétractation
              </h2>
              <p className="text-gray-600 mb-4">
                Conformément à l&apos;article L.221-18 du Code de la consommation,
                le client dispose d&apos;un délai de 14 jours à compter de la
                réception du produit pour exercer son droit de rétractation,
                sans avoir à justifier de motif.
              </p>
              <p className="text-gray-600 mb-4">
                Pour exercer ce droit, le client doit notifier sa décision par
                email à {siteConfig.contact.email}.
              </p>
              <p className="text-gray-600">
                Le produit doit être retourné dans son emballage d&apos;origine,
                non utilisé et en parfait état. Les frais de retour sont à la
                charge du client.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 8 – Garantie
              </h2>
              <p className="text-gray-600 mb-4">
                Les produits vendus bénéficient de la garantie légale de
                conformité (articles L.217-4 et suivants du Code de la
                consommation) et de la garantie des vices cachés (articles 1641
                et suivants du Code civil).
              </p>
              <p className="text-gray-600">
                Pour toute réclamation, contactez-nous à{" "}
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
                Article 9 – Responsabilité
              </h2>
              <p className="text-gray-600">
                {siteConfig.company.name} ne saurait être tenue responsable de
                l&apos;inexécution du contrat en cas de force majeure, de
                perturbation ou grève des services postaux et transports, ou en
                cas de fait imprévisible et insurmontable d&apos;un tiers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 10 – Données personnelles
              </h2>
              <p className="text-gray-600">
                Les données collectées lors de la commande sont nécessaires au
                traitement de celle-ci. Elles sont traitées conformément à notre{" "}
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
                Article 11 – Litiges
              </h2>
              <p className="text-gray-600 mb-4">
                Les présentes CGV sont soumises au droit français. En cas de
                litige, une solution amiable sera recherchée avant toute action
                judiciaire.
              </p>
              <p className="text-gray-400 mb-4">
                Conformément aux articles L.616-1 et R.616-1 du Code de la
                consommation, le client peut recourir gratuitement au service de
                médiation de la consommation.
              </p>
              <p className="text-gray-600">
                À défaut de résolution amiable, le litige sera porté devant les
                tribunaux compétents.
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
