// ============================================
// REKAIRE - CGV Professionnels
// ============================================

import { Header, Footer } from "@/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente - Professionnels",
  description: "CGV applicables aux professionnels - Rekaire",
};

export default function CGVProPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Conditions Générales de Vente
          </h1>
          <p className="text-lg text-orange-600 font-medium mb-8">
            Applicables aux professionnels
          </p>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-600">
            {/* Article 1 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Champ d&apos;application
              </h2>
              <p>
                Les présentes conditions générales de vente («&nbsp;CGV&nbsp;») constituent, conformément à l&apos;article L. 441-1 du Code de commerce, le socle unique de la relation commerciale entre les parties.
              </p>
              <p>
                Elles ont pour objet de définir les conditions dans lesquelles la société NELIOR («&nbsp;Le Fournisseur&nbsp;») fournit aux Acheteurs professionnels («&nbsp;Les Acheteurs ou l&apos;Acheteur&nbsp;») qui lui en font la demande, via le site internet du Fournisseur (https://rekaire.com/), par contact direct ou via un support papier, les produits suivants&nbsp;: Système autonome d&apos;extinction incendie + FT («&nbsp;les Produits&nbsp;») et les prestations de services associées («&nbsp;les Services&nbsp;»).
              </p>
              <p>
                Elles s&apos;appliquent sans restriction ni réserve à toutes les ventes et prestations conclues par le Fournisseur auprès des Acheteurs de même catégorie, quelles que soient les clauses pouvant figurer sur les documents de l&apos;Acheteur, et notamment ses conditions générales d&apos;achat.
              </p>
              <p>
                Conformément à la réglementation en vigueur, ces CGV sont systématiquement communiquées à tout Acheteur qui en fait la demande, pour lui permettre de passer commande auprès du Fournisseur.
              </p>
              <p>
                Elles sont également communiquées à tout distributeur (hors grossiste) préalablement à la conclusion d&apos;une convention unique visées aux articles L. 441-3 et suivants du Code de commerce, dans les délais légaux.
              </p>
              <p>
                Toute commande de Produits ou de Services implique, de la part de l&apos;Acheteur, l&apos;acceptation des présentes CGV.
              </p>
              <p>
                Les renseignements figurant sur les catalogues, prospectus et tarifs du Fournisseur sont donnés à titre indicatif et sont révisables à tout moment. Le Fournisseur est en droit d&apos;y apporter toutes modifications qui lui paraîtront utiles.
              </p>
              <p>
                Conformément à la réglementation en vigueur, le Fournisseur se réserve le droit de déroger à certaines clauses des présentes CGV, en fonction des négociations menées avec l&apos;Acheteur, par l&apos;établissement de Conditions Particulières de Vente.
              </p>
            </section>

            {/* Article 2 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Commandes - Tarifs
              </h2>
              <p>
                <strong>2.1</strong> Les ventes ne sont parfaites qu&apos;après acceptation expresse et par écrit de la commande de l&apos;Acheteur, par le Fournisseur, qui s&apos;assurera notamment, de la disponibilité des Produits et Services demandés, matérialisée par l&apos;envoi d&apos;un devis, valable 30 jours. La commande ne deviendra ferme et définitive qu&apos;après le retour par l&apos;Acheteur du devis daté, signé et revêtu de la mention «&nbsp;bon pour accord&nbsp;», accompagné du versement de l&apos;acompte ou du prix total selon ce qui a été convenu.
              </p>
              <p>
                Le Fournisseur dispose également de moyens de commande électroniques via le site suivant&nbsp;: https://rekaire.com/
              </p>
              <p>
                Pour les commandes passées exclusivement sur internet, l&apos;enregistrement d&apos;une commande sur le site du Fournisseur est réalisé lorsque l&apos;Acheteur accepte les présentes CGV en cochant la case prévue à cet effet, valide sa commande et en règle le prix. L&apos;Acheteur a la possibilité de vérifier le détail de sa commande, son prix total et de corriger d&apos;éventuelles erreurs avant de confirmer son acceptation (article 1127-2 du Code Civil). Cette validation implique l&apos;acceptation de l&apos;intégralité des présentes CGV et constituent une preuve du contrat de vente. La prise en compte de la commande et l&apos;acceptation de celle-ci sont confirmées par l&apos;envoi d&apos;un mail.
              </p>
              <p>
                <strong>2.2</strong> En cas d&apos;annulation de la commande par l&apos;Acheteur après son acceptation par le Fournisseur moins de 20 jours au moins avant la date prévue pour la fourniture des Produits et Services commandés, pour quelque raison que ce soit hormis la force majeure, l&apos;acompte ou le prix versé à la commande sera de plein droit acquis au Fournisseur et ne pourra donner lieu à un quelconque remboursement.
              </p>
              <p>
                <strong>2.3</strong> Les Produits et Services sont fournis aux tarifs du Fournisseur en vigueur au jour de la passation de la commande, et, le cas échéant, dans la proposition commerciale spécifique adressée à l&apos;Acquéreur. Ces tarifs sont fermes et non révisables pendant leur période de validité, telle qu&apos;indiquée par le Fournisseur.
              </p>
              <p>
                Ces prix sont nets et HT, départ usine et emballage en sus. Ils ne comprennent pas le transport, ni les frais de douane éventuels et les assurances qui restent à la charge de l&apos;Acheteur.
              </p>
              <p>
                Des conditions tarifaires particulières peuvent être pratiquées en fonction des spécificités demandées par l&apos;Acheteur concernant, notamment, les modalités et délais de livraison ou les délais et conditions de règlement. Une offre commerciale particulière sera alors adressée à l&apos;Acheteur par le Fournisseur.
              </p>
            </section>

            {/* Article 3 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. Conditions de paiement
              </h2>
              <p>
                Un acompte minimum correspondant à 50&nbsp;% du prix total d&apos;acquisition des Produits et Services est exigé lors de la passation de la commande. Le solde du prix est payable au comptant, au jour de la livraison et de l&apos;installation, dans les conditions définies à l&apos;article «&nbsp;Livraisons&nbsp;» ci-après.
              </p>
              <p>
                Le Fournisseur ne sera pas tenu de procéder à la livraison des Produits et Services commandés par l&apos;Acheteur si celui-ci ne lui en paye pas le prix dans les conditions et selon les modalités ci-dessus indiquées.
              </p>
              <p>
                Les modes de paiement suivants peuvent être utilisés&nbsp;: cartes bancaires ou chèque bancaire.
              </p>
              <p>
                En cas de paiement par chèque bancaire, celui-ci doit être émis par une banque domiciliée en France métropolitaine ou à Monaco. La mise à l&apos;encaissement du chèque est réalisée immédiatement.
              </p>
              <p>
                Les paiements effectués par l&apos;Acheteur ne seront considérés comme définitifs qu&apos;après encaissement effectif des sommes dues, par le Fournisseur.
              </p>
              <p>
                En cas de retard de paiement et de versement des sommes dues par l&apos;Acheteur au-delà du délai ci-dessus fixé, et après la date de paiement figurant sur la facture adressée à celui-ci, des pénalités de retard calculées au taux de 12&nbsp;% du montant TTC du prix figurant sur ladite facture, seront automatiquement et de plein droit acquises au Fournisseur, sans formalité aucune ni mise en demeure préalable.
              </p>
              <p>
                En cas de non-respect des conditions de paiement figurant ci-dessus, le Fournisseur se réserve en outre le droit de suspendre ou d&apos;annuler la livraison des commandes en cours de la part de l&apos;Acheteur.
              </p>
              <p>
                Enfin, une indemnité forfaitaire pour frais de recouvrement, d&apos;un montant de 40 euros sera due, de plein droit et sans notification préalable par l&apos;Acheteur en cas de retard de paiement. Le Fournisseur se réserve le droit de demander à l&apos;Acheteur une indemnisation complémentaire si les frais de recouvrement effectivement engagés dépassaient ce montant, sur présentation des justificatifs.
              </p>
              <p>
                Le Fournisseur se réserve, jusqu&apos;au complet paiement du prix par l&apos;Acheteur, un droit de propriété sur les Produits vendus, lui permettant de reprendre possession desdits Produits. Tout acompte versé par l&apos;Acheteur restera acquis au Fournisseur à titre d&apos;indemnisation forfaitaire, sans préjudice de toutes autres actions qu&apos;il serait en droit d&apos;intenter de ce fait à l&apos;encontre de l&apos;Acheteur.
              </p>
              <p>
                En revanche, le risque de perte et de détérioration sera transféré à l&apos;Acheteur dès la livraison des Produits commandés.
              </p>
              <p>
                L&apos;Acheteur s&apos;oblige, en conséquence, à faire assurer, à ses frais, les Produits commandés, au profit du Fournisseur, par une assurance ad hoc, jusqu&apos;au complet transfert de propriété et à en justifier à ce dernier lors de la livraison. A défaut, le Fournisseur serait en droit de retarder la livraison jusqu&apos;à la présentation de ce justificatif.
              </p>
              <p>
                Aucun escompte ne sera pratiqué par le Fournisseur pour paiement avant la date figurant sur la facture ou dans un délai inférieur à celui mentionné aux présentes CGV.
              </p>
            </section>

            {/* Article 4 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. Remises et ristournes
              </h2>
              <p>
                L&apos;Acheteur pourra bénéficier des remises et ristournes figurant aux tarifs du Fournisseur, en fonction des quantités acquises ou livrées par le Fournisseur en une seule fois et un seul lieu, ou de la régularité de ses commandes.
              </p>
            </section>

            {/* Article 5 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. Livraisons
              </h2>
              <p>
                Les Produits acquis par l&apos;Acheteur seront livrés en France métropolitaine dans un délai maximum de 30 jours à compter de la réception par le Fournisseur du devis correspondant dûment signé et accompagné du montant de l&apos;acompte exigible à cette date.
              </p>
              <p>
                Ce délai ne constitue pas un délai de rigueur et le Fournisseur ne pourra voir sa responsabilité engagée à l&apos;égard de l&apos;Acheteur en cas de retard de livraison n&apos;excédant pas 60 jours.
              </p>
              <p>
                En cas de retard supérieur à 60 jours, pour toute autre cause que la force majeure ou le fait de l&apos;Acheteur, l&apos;Acheteur pourra demander la résolution de la vente. Les acomptes déjà versés lui seront alors restitués par le Fournisseur.
              </p>
              <p>
                La responsabilité du Fournisseur ne pourra en aucun cas être engagée en cas de retard ou de suspension de la livraison imputable à l&apos;Acheteur ou en cas de force majeure.
              </p>
              <p>
                La livraison sera effectuée à l&apos;adresse communiquée par l&apos;Acheteur, par la remise directe des Produits à l&apos;Acheteur ou la délivrance des Produits à un expéditeur ou transporteur, les Produits voyageant aux risques et périls de l&apos;Acheteur. Les Services seront fournis à l&apos;adresse communiquée par l&apos;Acheteur au moment de la commande.
              </p>
              <p>
                L&apos;Acheteur est tenu de vérifier l&apos;état apparent des Produits lors de la livraison. A défaut de réserves expressément émises par l&apos;Acheteur lors de la livraison, les Produits délivrés par le Fournisseur seront réputés conformes en quantité et qualité à la commande. L&apos;Acheteur disposera d&apos;un délai de 3 jours à compter de la livraison et de la réception des Produits commandés pour émettre, par écrit, de telles réserves auprès du Fournisseur. Aucune réclamation ne pourra être valablement acceptée en cas de non-respect de ces formalités par l&apos;Acheteur. Le Fournisseur remplacera dans les plus brefs délais et à ses frais, les Produits livrés dont le défaut de conformité aura été dûment prouvé par l&apos;Acheteur.
              </p>
              <p>
                Une fois les Services fournis, l&apos;Acheteur devra signer un procès-verbal de réception qui devra relever ses éventuelles réserves et réclamations&nbsp;; à défaut, les Services seront réputés conformes à la commande, en quantité et qualité.
              </p>
            </section>

            {/* Article 6 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                6. Transfert de propriété - Transfert des risques
              </h2>
              <p>
                <strong>6.1</strong> Le transfert de propriété des Produits, au profit de l&apos;Acheteur, ne sera réalisé qu&apos;après complet paiement du prix par ce dernier, et ce quelle que soit la date de livraison desdits Produits.
              </p>
              <p>
                <strong>6.2</strong> Le transfert à l&apos;Acheteur des risques de perte et de détérioration des Produits sera réalisé dès livraison et réception desdits Produits, indépendamment du transfert de propriété, et ce quelle que soit la date de la commande et du paiement de celle-ci.
              </p>
            </section>

            {/* Article 7 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7. Responsabilité du Fournisseur - Garantie
              </h2>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                7.1 Produits
              </h3>
              <p>
                Les Produits livrés par le Fournisseur bénéficient d&apos;une garantie contractuelle d&apos;une durée de 5 ans, à compter de la date de livraison, couvrant la non-conformité des Produits à la commande et tout vice caché, provenant d&apos;un défaut de matière, de conception ou de fabrication affectant les produits livrés et les rendant impropres à l&apos;utilisation.
              </p>
              <p>
                La garantie forme un tout indissociable avec le Produit vendu par le Fournisseur. Le Produit ne peut être vendu ou revendu altéré, transformé ou modifié.
              </p>
              <p>
                Cette garantie est limitée au remplacement ou au remboursement des Produits non conformes ou affectés d&apos;un vice.
              </p>
              <p>
                Toute garantie est exclue en cas de mauvaise utilisation, négligence ou défaut d&apos;entretien de la part de l&apos;Acheteur, comme en cas d&apos;usure normale du Produit ou de force majeure.
              </p>
              <p>
                Afin de faire valoir ses droits, l&apos;Acheteur devra, sous peine de déchéance de toute action s&apos;y rapportant, informer le Fournisseur, par écrit, de l&apos;existence des vices dans un délai maximum de 10 jours à compter de leur découverte.
              </p>
              <p>
                Le Fournisseur remplacera ou fera réparer les Produits ou pièces sous garantie jugés défectueux. Cette garantie couvre également les frais de main d&apos;œuvre.
              </p>
              <p>
                Le remplacement des Produits ou pièces défectueux n&apos;aura pas pour effet de prolonger la durée de la garantie ci-dessus fixée.
              </p>
              <p>
                La garantie enfin, ne peut intervenir si les Produits ont fait l&apos;objet d&apos;un usage anormal, ou ont été employés dans des conditions différentes de celles pour lesquelles ils ont été fabriqués, en particulier en cas de non-respect des conditions prescrites dans la notice d&apos;utilisation.
              </p>
              <p>
                Elle ne s&apos;applique pas non plus au cas de détérioration ou d&apos;accident provenant de choc, chute, négligence, défaut de surveillance ou d&apos;entretien, ou bien en cas de transformation du Produit.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                7.2 Services
              </h3>
              <p>
                Le Fournisseur déclare et l&apos;Acheteur reconnaît que lors de l&apos;installation des Produits, l&apos;intervention se limite exclusivement à la pose des Produits à l&apos;intérieur du tableau électrique, sans modification ou manipulation du câblage, des disjoncteurs ou de tout autre élément électrique. En conséquence, le Fournisseur décline toute responsabilité en cas de dysfonctionnement, panne ou incident liés à l&apos;installation électrique ou à son câblage, ceux-ci demeurant sous l&apos;entière responsabilité de l&apos;Acheteur ou de l&apos;installateur initial.
              </p>
            </section>

            {/* Article 8 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                8. Propriété intellectuelle
              </h2>
              <p>
                Le Fournisseur conserve l&apos;ensemble des droits de propriété industrielle et intellectuelle afférents aux Produits, photos, documentations techniques et autres contenus de son site internet, qui ne peuvent être communiqués ni exécutés sans son autorisation écrite. Toute reproduction totale ou partielle de ce contenu est strictement interdite et est susceptible de constituer un délit de contrefaçon.
              </p>
            </section>

            {/* Article 9 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                9. Données personnelles
              </h2>
              <p>
                Les données personnelles recueillies auprès des Acheteurs font l&apos;objet d&apos;un traitement informatique réalisé par le Fournisseur. Elles sont enregistrées dans son fichier Clients et sont indispensables au traitement de sa commande. Ces informations et données personnelles sont également conservées à des fins de sécurité, afin de respecter les obligations légales et réglementaires. Elles seront conservées aussi longtemps que nécessaire pour l&apos;exécution des commandes et des garanties éventuellement applicables.
              </p>
              <p>
                Le responsable du traitement des données est le Fournisseur. L&apos;accès aux données personnelles sera strictement limité aux employés du responsable de traitement, habilités à les traiter en raison de leurs fonctions. Les informations recueillies pourront éventuellement être communiquées à des tiers liés à l&apos;entreprise par contrat pour l&apos;exécution de tâches sous-traitées, sans que l&apos;autorisation de l&apos;Acheteur soit nécessaire.
              </p>
              <p>
                Dans le cadre de l&apos;exécution de leurs prestations, les tiers n&apos;ont qu&apos;un accès limité aux données et ont l&apos;obligation de les utiliser en conformité avec les dispositions de la législation applicable en matière de protection des données personnelles. En dehors des cas énoncés ci-dessus, le Fournisseur s&apos;interdit de vendre, louer, céder ou donner accès à des tiers aux données sans consentement préalable de l&apos;Acheteur, à moins d&apos;y être contrainte en raison d&apos;un motif légitime.
              </p>
              <p>
                Si les données sont amenées à être transférées en dehors de l&apos;UE, l&apos;Acheteur en sera informé et les garanties prises afin de sécuriser les données lui seront précisées.
              </p>
              <p>
                Conformément à la réglementation applicable, l&apos;Acheteur dispose d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, et de portabilité des données le concernant, ainsi que du droit de s&apos;opposer au traitement pour motif légitime, droits qu&apos;il peut exercer en s&apos;adressant au responsable de traitement à l&apos;adresse suivante&nbsp;: <a href="mailto:contact@rekaire.fr" className="text-orange-600 hover:underline">contact@rekaire.fr</a>
              </p>
              <p>
                En cas de réclamation, l&apos;Acheteur peut adresser une réclamation auprès du délégué à la protection des données personnelles du Fournisseur, joignable à l&apos;adresse suivante&nbsp;: <a href="mailto:noam.kalfa@nelior.fr" className="text-orange-600 hover:underline">noam.kalfa@nelior.fr</a>
              </p>
            </section>

            {/* Article 10 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                10. Imprévision
              </h2>
              <p>
                Le Fournisseur et l&apos;Acheteur renoncent chacun à se prévaloir des dispositions de l&apos;article 1195 du Code civil et du régime de l&apos;imprévision qui y est prévu, s&apos;engageant à assumer ses obligations même si l&apos;équilibre contractuel se trouve bouleversé par des circonstances qui étaient imprévisibles lors de la conclusion de la vente, quand bien même leur exécution s&apos;avèrerait excessivement onéreuse et à en supporter toutes les conséquences économiques et financières.
              </p>
            </section>

            {/* Article 11 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                11. Exécution forcée en nature
              </h2>
              <p>
                Par dérogation aux dispositions de l&apos;article 1221 du Code civil, les parties conviennent qu&apos;en cas de manquement de l&apos;une ou l&apos;autre des Parties à ses obligations, la Partie victime de la défaillance ne pourra en demander l&apos;exécution forcée.
              </p>
            </section>

            {/* Article 12 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                12. Exception d&apos;inexécution
              </h2>
              <p>
                Il est rappelé qu&apos;en application de l&apos;article 1219 du Code civil, chaque Partie pourra refuser d&apos;exécuter son obligation, alors même que celle-ci est exigible, si l&apos;autre Partie n&apos;exécute pas la sienne et si cette inexécution est suffisamment grave, c&apos;est-à-dire, susceptible de remettre en cause la poursuite du contrat ou de bouleverser fondamentalement son équilibre économique. La suspension d&apos;exécution prendra effet immédiatement, à réception par la Partie défaillante de la notification de manquement qui lui aura été adressée à cet effet par la Partie victime de la défaillance indiquant l&apos;intention de faire application de l&apos;exception d&apos;inexécution tant que la Partie défaillante n&apos;aura pas remédié au manquement constaté, signifiée par lettre recommandée avec demande d&apos;avis de réception ou sur tout autre support durable écrit permettant de ménager une preuve de l&apos;envoi.
              </p>
            </section>

            {/* Article 13 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                13. Force majeure
              </h2>
              <p>
                Les Parties ne pourront être tenues pour responsables si la non-exécution ou le retard dans l&apos;exécution de l&apos;une quelconque de leurs obligations, telles que décrites dans les présentes découle d&apos;un cas de force majeure, au sens de l&apos;article 1218 du Code civil ou d&apos;aléas sanitaires ou climatiques exceptionnels indépendants de la volonté des Parties.
              </p>
            </section>

            {/* Article 14 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                14. Résolution du contrat
              </h2>
              <p>
                En cas de non-respect par l&apos;une ou l&apos;autre des parties des obligations prévues aux présentes CGV, celui-ci pourra être résolu au gré de la Partie lésée.
              </p>
              <p>
                Il est expressément entendu que cette résolution pour manquement d&apos;une partie à ses obligations aura lieu de plein droit 15 jours après l&apos;envoi la réception d&apos;une mise en demeure de s&apos;exécuter, restée, en tout ou partie, sans effet. La mise en demeure pourra être notifiée par lettre recommandée avec demande d&apos;avis de réception ou tout acte extrajudiciaire. Cette mise en demeure devra mentionner l&apos;intention d&apos;appliquer la présente clause.
              </p>
              <p>
                En tout état de cause, la partie lésée pourra demander en justice l&apos;octroi de dommages et intérêts.
              </p>
            </section>

            {/* Article 15 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                15. Droit applicable - Litiges
              </h2>
              <p>
                Les présentes CGV et les opérations qui en découlent sont régies par le droit français.
              </p>
              <p>
                Elles sont rédigées en langue française. Dans le cas où elles seraient traduites en une ou plusieurs langues, seul le texte français ferait foi en cas de litige.
              </p>
              <p>
                Tous les litiges auxquels les présentes et les accords qui en découlent pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résolution, leurs conséquences et leurs suites seront soumis au <strong>Tribunal de commerce de Paris</strong>.
              </p>
            </section>

            {/* Article 16 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                16. Acceptation de l&apos;Acheteur
              </h2>
              <p>
                Les présentes CGV ainsi que les tarifs et barèmes concernant les remises et ristournes sont expressément agréés et acceptés par l&apos;Acheteur, qui déclare et reconnaît en avoir une parfaite connaissance, et renonce, de ce fait, à se prévaloir de tout document contradictoire et, notamment, ses propres conditions générales d&apos;achat.
              </p>
            </section>

            {/* Informations société */}
            <section className="border-t pt-8 mt-8">
              <p className="text-sm text-gray-500 text-center">
                <strong>NELIOR</strong><br />
                Société par actions simplifiée au capital de 1.260 €<br />
                RCS LYON 989 603 907
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
