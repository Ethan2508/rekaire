// ============================================
// REKAIRE - CGV Professionnels
// ============================================

import { Header, Footer } from "@/components";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente Professionnels",
  description: "CGV pour les professionnels - Rekaire",
};

export default function CGVProPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Conditions Générales de Vente
          </h1>
          <p className="text-lg text-orange-600 font-medium mb-8">
            Applicables aux clients professionnels
          </p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 1 – Champ d&apos;application
              </h2>
              <p className="text-gray-600 mb-4">
                Les présentes Conditions Générales de Vente (CGV) s&apos;appliquent
                exclusivement aux ventes conclues entre {siteConfig.company.legalName}{" "}
                et tout acheteur professionnel (entreprise, commerçant, artisan,
                profession libérale, collectivité).
              </p>
              <p className="text-gray-600">
                Toute commande implique l&apos;acceptation pleine et entière des
                présentes CGV, qui prévalent sur tout autre document du client.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 2 – Produits et disponibilité
              </h2>
              <p className="text-gray-600 mb-4">
                Les produits proposés sont ceux figurant au catalogue en ligne,
                dans la limite des stocks disponibles. Les caractéristiques
                techniques sont données à titre indicatif.
              </p>
              <p className="text-gray-600">
                {siteConfig.company.name} se réserve le droit de modifier ses
                produits à tout moment sans préavis, sous réserve que cela
                n&apos;affecte pas les commandes en cours.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 3 – Prix et tarification
              </h2>
              <p className="text-gray-600 mb-4">
                Les prix sont indiqués en euros Hors Taxes (HT). La TVA au taux
                en vigueur sera facturée en sus, sauf en cas d&apos;exonération
                (livraison intracommunautaire avec numéro de TVA valide).
              </p>
              <p className="text-gray-600 mb-4">
                Pour les commandes de volume (3 unités et plus), un devis
                personnalisé sera établi sur demande.
              </p>
              <p className="text-gray-600">
                Les prix peuvent être modifiés à tout moment. Les commandes
                confirmées restent au tarif convenu au moment de la validation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 4 – Commandes et devis
              </h2>
              <p className="text-gray-600 mb-4">
                Pour les commandes inférieures à 3 unités, la commande est
                passée directement en ligne avec paiement immédiat.
              </p>
              <p className="text-gray-600 mb-4">
                Pour les commandes de 3 unités ou plus, un devis sera établi
                sous 24h ouvrées. Le devis est valable 30 jours à compter de son
                émission.
              </p>
              <p className="text-gray-600">
                La commande devient ferme et définitive dès acceptation du devis
                et réception du paiement ou de l&apos;acompte convenu.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 5 – Modalités de paiement
              </h2>
              <p className="text-gray-600 mb-4">
                <strong>Commandes en ligne :</strong> Paiement par carte
                bancaire via Stripe (Visa, Mastercard, American Express).
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Commandes sur devis :</strong> Paiement par virement
                bancaire. Un acompte de 30% peut être demandé pour les commandes
                importantes.
              </p>
              <p className="text-gray-600">
                En cas de retard de paiement, des pénalités de retard seront
                appliquées au taux BCE majoré de 10 points, ainsi qu&apos;une
                indemnité forfaitaire de 40€ pour frais de recouvrement (article
                L.441-6 du Code de commerce).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 6 – Livraison
              </h2>
              <p className="text-gray-600 mb-4">
                Les livraisons sont effectuées en France métropolitaine. Des
                livraisons internationales peuvent être organisées sur demande.
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Délais indicatifs :</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Commandes standards : 24-48h ouvrées</li>
                <li>Commandes sur devis : selon disponibilité (précisé au devis)</li>
              </ul>
              <p className="text-gray-600">
                Les délais sont donnés à titre indicatif. Un retard de livraison
                ne peut donner lieu à annulation de commande ni à indemnisation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 7 – Transfert de propriété et des risques
              </h2>
              <p className="text-gray-600 mb-4">
                Le transfert de propriété des produits est suspendu jusqu&apos;au
                paiement intégral du prix (clause de réserve de propriété).
              </p>
              <p className="text-gray-600">
                Le transfert des risques intervient à la livraison des produits.
                Toute anomalie constatée à la réception doit être signalée par
                réserves écrites sur le bon de livraison et confirmée par
                courrier recommandé sous 48h.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 8 – Droit de rétractation
              </h2>
              <p className="text-gray-600 mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <strong>Important :</strong> Conformément à l&apos;article L.221-3
                du Code de la consommation, le droit de rétractation de 14 jours
                ne s&apos;applique pas aux achats effectués dans le cadre d&apos;une
                activité professionnelle.
              </p>
              <p className="text-gray-600">
                Les retours ne sont acceptés qu&apos;après accord préalable écrit
                de {siteConfig.company.name}, pour des produits non utilisés,
                dans leur emballage d&apos;origine.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 9 – Garantie
              </h2>
              <p className="text-gray-600 mb-4">
                Les produits bénéficient de la garantie légale des vices cachés
                (articles 1641 et suivants du Code civil).
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Garantie commerciale :</strong> Les produits RK01 sont
                garantis 5 ans contre tout défaut de fabrication, dans des
                conditions normales d&apos;utilisation et d&apos;installation.
              </p>
              <p className="text-gray-600">
                La garantie ne couvre pas : l&apos;usure normale, les dommages
                résultant d&apos;une utilisation non conforme, les modifications
                non autorisées.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 10 – Responsabilité
              </h2>
              <p className="text-gray-600 mb-4">
                La responsabilité de {siteConfig.company.name} est limitée au
                montant de la commande concernée. En aucun cas,{" "}
                {siteConfig.company.name} ne pourra être tenue responsable des
                dommages indirects (perte d&apos;exploitation, préjudice
                commercial, etc.).
              </p>
              <p className="text-gray-600">
                {siteConfig.company.name} est dégagée de toute responsabilité en
                cas de force majeure, de fait d&apos;un tiers ou de faute du client.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 11 – Données personnelles
              </h2>
              <p className="text-gray-600">
                Les données collectées sont traitées conformément au RGPD et à
                notre{" "}
                <a
                  href="/confidentialite"
                  className="text-orange-500 hover:text-orange-600"
                >
                  Politique de confidentialité
                </a>
                . Elles sont utilisées pour le traitement des commandes, la
                facturation et la relation commerciale.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Article 12 – Droit applicable et litiges
              </h2>
              <p className="text-gray-600 mb-4">
                Les présentes CGV sont régies par le droit français.
              </p>
              <p className="text-gray-600">
                <strong>
                  En cas de litige, compétence exclusive est attribuée aux
                  tribunaux de commerce de Lyon
                </strong>
                , même en cas de pluralité de défendeurs ou d&apos;appel en garantie.
              </p>
            </section>

            <section className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Coordonnées
              </h2>
              <p className="text-gray-600 mb-2">
                <strong>{siteConfig.company.legalName}</strong>
              </p>
              <p className="text-gray-600 mb-2">
                SIRET : {siteConfig.company.siret}
              </p>
              <p className="text-gray-600 mb-2">
                TVA : {siteConfig.company.tva}
              </p>
              <p className="text-gray-600">
                Contact :{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
            </section>
          </div>

          <p className="mt-12 text-sm text-gray-500">
            Dernière mise à jour : Janvier 2026
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
