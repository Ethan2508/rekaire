// ============================================
// REKAIRE - Conditions Générales de Vente (Consommateurs)
// ============================================

import { Header, Footer } from "@/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente - Consommateurs",
  description: "CGV applicables aux consommateurs et particuliers - Rekaire",
};

export default function CGVPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Conditions Générales de Vente
          </h1>
          <p className="text-lg text-orange-600 font-medium mb-8">
            Applicables aux consommateurs et particuliers
          </p>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-600">
            {/* Article 1 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Champ d&apos;application
              </h2>
              <p>
                Les présentes conditions générales de vente («&nbsp;CGV&nbsp;») s&apos;appliquent sans restriction ni réserve à l&apos;ensemble des ventes conclues par la société NELIOR («&nbsp;Le Fournisseur&nbsp;») auprès de consommateurs et d&apos;acheteurs non professionnels («&nbsp;Les Acheteurs ou l&apos;Acheteur&nbsp;») désirant acquérir les produits suivants&nbsp;: Système autonome d&apos;extinction incendie + FT («&nbsp;les Produits&nbsp;») et les prestations de services associées («&nbsp;les Services&nbsp;»), via le site internet du Fournisseur (https://rekaire.com/), par contact direct ou via un support papier.
              </p>
              <p>
                Ces CGV sont systématiquement communiquées à tout Acheteur préalablement à la passation de commande et prévaudront, le cas échéant, sur toute autre version ou tout autre document contradictoire.
              </p>
              <p>
                La validation de la commande par l&apos;Acheteur vaut acceptation sans restriction ni réserve des présentes CGV.
              </p>
              <p>
                L&apos;Acheteur reconnaît avoir la capacité requise pour contracter et acquérir les Produits et Services proposés sur le site internet https://rekaire.com/.
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
                2. Produits et Services
              </h2>
              <p>
                Les caractéristiques principales des Produits et Services, regroupant l&apos;ensemble des informations substantielles requises par la réglementation applicable et notamment les spécifications, illustrations et indications de dimensions ou de capacité des Produits, sont présentées sur le site internet (https://rekaire.com/), dans les fiches produits et le catalogue du Fournisseur.
              </p>
              <p>
                L&apos;Acheteur est tenu d&apos;en prendre connaissance avant toute passation de commande.
              </p>
              <p>
                Le choix et l&apos;achat d&apos;un Produit ou d&apos;un Service sont de la seule responsabilité de l&apos;Acheteur.
              </p>
              <p>
                Les photographies et graphismes présentés sur le site internet https://rekaire.com/ ne sont pas contractuels et ne sauraient engager la responsabilité du Fournisseur.
              </p>
            </section>

            {/* Article 3 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. Commandes - Tarifs
              </h2>
              <p>
                <strong>3.1</strong> Les ventes ne sont parfaites qu&apos;après acceptation expresse et par écrit de la commande de l&apos;Acheteur, par le Fournisseur, qui s&apos;assurera notamment, de la disponibilité des Produits et Services demandés, matérialisée par l&apos;envoi d&apos;un devis, valable 30 jours. La commande ne deviendra ferme et définitive qu&apos;après le retour par l&apos;Acheteur du devis daté, signé et revêtu de la mention «&nbsp;bon pour accord&nbsp;», accompagné du versement de l&apos;acompte ou du prix total selon ce qui a été convenu.
              </p>
              <p>
                Le Fournisseur dispose également de moyens de commande électroniques via le site suivant&nbsp;: https://rekaire.com/
              </p>
              <p>
                Pour les commandes passées exclusivement sur internet, l&apos;enregistrement d&apos;une commande sur le site du Fournisseur est réalisé lorsque l&apos;Acheteur accepte les présentes CGV en cochant la case prévue à cet effet, valide sa commande et en règle le prix. L&apos;Acheteur a la possibilité de vérifier le détail de sa commande, son prix total et de corriger d&apos;éventuelles erreurs avant de confirmer son acceptation (article 1127-2 du Code Civil). Cette validation implique l&apos;acceptation de l&apos;intégralité des présentes CGV et constituent une preuve du contrat de vente. La prise en compte de la commande et l&apos;acceptation de celle-ci sont confirmées par l&apos;envoi d&apos;un mail.
              </p>
              <p>
                <strong>3.2</strong> En cas d&apos;annulation de la commande par l&apos;Acheteur après son acceptation par le Fournisseur moins de 20 jours au moins avant la date prévue pour la fourniture des Produits et Services commandés, pour quelque raison que ce soit hormis la force majeure et l&apos;exercice du droit de rétractation, l&apos;acompte ou le prix versé à la commande sera de plein droit acquis au Fournisseur et ne pourra donner lieu à un quelconque remboursement.
              </p>
              <p>
                <strong>3.3</strong> Les Produits et Services sont fournis aux tarifs du Fournisseur en vigueur au jour de la passation de la commande, et, le cas échéant, dans la proposition commerciale spécifique adressée à l&apos;Acquéreur. Ces tarifs sont fermes et non révisables pendant leur période de validité, telle qu&apos;indiquée par le Fournisseur.
              </p>
              <p>
                Ces prix sont nets et TTC, départ usine et emballage en sus. Ils ne comprennent pas le transport, ni les frais de douane éventuels et les assurances qui restent à la charge de l&apos;Acheteur et seront calculés préalablement à la passation de la commande.
              </p>
              <p>
                Des conditions tarifaires particulières peuvent être pratiquées en fonction des spécificités demandées par l&apos;Acheteur concernant, notamment, les modalités et délais de livraison ou les délais et conditions de règlement. Une offre commerciale particulière sera alors adressée à l&apos;Acheteur par le Fournisseur.
              </p>
              <p>
                <strong>3.4</strong> En cas de commande vers un pays autre que la France métropolitaine, l&apos;Acheteur est l&apos;importateur du ou des Produits concernés. Pour tous les Produits expédiés hors Union européenne et DOM-TOM, le prix sera calculé hors taxes automatiquement sur la facture. Des droits de douane ou autres taxes locales ou droits d&apos;importation ou taxes d&apos;état sont susceptibles d&apos;être exigibles. Ils seront à la charge et relèvent de la seule responsabilité de l&apos;Acheteur.
              </p>
            </section>

            {/* Article 4 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. Conditions de paiement
              </h2>
              <p>
                Pour les commandes par contact direct, un acompte minimum correspondant à 50&nbsp;% du prix total d&apos;acquisition des Produits et Services est exigé lors de la passation de la commande. Cet acompte ne pourra en aucun cas être qualifié d&apos;arrhes. Le solde du prix est payable au comptant, au jour de la livraison et de l&apos;installation, dans les conditions définies à l&apos;article «&nbsp;Livraisons&nbsp;» ci-après. Toute somme versée d&apos;avance sur le prix, arrhes ou acompte, est productive d&apos;intérêt au taux légal à l&apos;expiration d&apos;un délai de trois mois à compter du versement et jusqu&apos;à la date de livraison (article L 214-2 du Code de la consommation).
              </p>
              <p>
                Pour les commandes sur internet, le prix est intégralement payable à la commande sur le site https://rekaire.com/, par voie de paiement sécurisé.
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

            {/* Article 5 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. Livraisons
              </h2>
              <p>
                La délivrance des Produits s&apos;entend du transfert à l&apos;Acheteur de la possession physique ou du contrôle des Produits commandés.
              </p>
              <p>
                Conformément aux dispositions de l&apos;article L. 216-4 du Code de la consommation, la délivrance des Produits s&apos;accompagne de la remise de la notice d&apos;emploi, des instructions d&apos;installation et d&apos;un écrit mentionnant la possibilité de formuler des réserves.
              </p>
              <p>
                Les Produits et Services commandés par l&apos;Acheteur seront livrés ou fournis en France métropolitaine dans un délai maximum de 30 jours à compter de la réception par le Fournisseur du devis correspondant dûment signé et accompagné du montant de l&apos;acompte exigible à cette date, ou de la commande passée sur internet.
              </p>
              <p>
                Ce délai ne constitue pas un délai de rigueur et le Fournisseur ne pourra voir sa responsabilité engagée à l&apos;égard de l&apos;Acheteur en cas de retard de livraison n&apos;excédant pas 60 jours.
              </p>
              <p>
                En cas de retard supérieur à 60 jours, pour toute autre cause que la force majeure ou le fait de l&apos;Acheteur, l&apos;Acheteur pourra notifier au Fournisseur, dans les conditions prévues à l&apos;article L. 216-6 du Code de la consommation&nbsp;:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>soit la suspension du paiement de tout ou partie du prix jusqu&apos;à ce que le Fournisseur s&apos;exécute, dans les conditions prévues aux articles 1219 et 1220 Code civil (exception d&apos;inexécution),</li>
                <li>soit la résolution de la vente, après avoir mis le Fournisseur en demeure de s&apos;exécuter dans un délai supplémentaire raisonnable, non respecté par le Fournisseur.</li>
              </ul>
              <p>
                La résolution peut être immédiate si le Fournisseur refuse de s&apos;exécuter ou s&apos;il est manifeste qu&apos;il ne pourra pas délivrer les Produits ou fournir les Services ou si le délai de délivrance non respecté constituait, pour l&apos;Acheteur, une condition essentielle de la vente.
              </p>
              <p>
                En cas de résolution de la vente, les sommes versées par l&apos;Acheteur lui seront alors restituées au plus tard dans les quatorze jours qui suivent la date de dénonciation du contrat, à l&apos;exclusion de toute indemnisation ou retenue.
              </p>
              <p>
                Le Fournisseur prend à sa charge les risques du transport et est tenu de rembourser l&apos;Acheteur en cas de dommages causés pendant le transport.
              </p>
              <p>
                Les livraisons sont assurées par un transporteur indépendant, à l&apos;adresse mentionnée par l&apos;Acheteur lors de la commande et à laquelle le transporteur pourra facilement accéder.
              </p>
              <p>
                En cas de demande particulière de l&apos;Acheteur concernant les conditions d&apos;emballage ou de transport des Produits commandés, dûment acceptées par écrit par le Fournisseur, les coûts y liés feront l&apos;objet d&apos;une facturation spécifique complémentaire, sur acceptation préalable de l&apos;Acheteur.
              </p>
              <p>
                L&apos;Acheteur est tenu de vérifier l&apos;état des Produits délivrés. Il dispose d&apos;un délai de 3 jours à compter de la délivrance pour formuler par écrit (courrier postal, courrier électronique) toutes réserves ou réclamations pour non-conformité, défaut ou vice apparent des Produits délivrés (par exemple colis endommagé, déjà ouvert, etc.), comme en cas de défaut de remise de la notice d&apos;emploi ou des instructions d&apos;installation, avec tous les justificatifs y afférents (photographies notamment). Passé ce délai et à défaut d&apos;avoir respecté ces formalités, les Produits seront réputés conformes et exempts de tout vice apparent.
              </p>
              <p>
                Il est rappelé que l&apos;absence de réserves formulées par l&apos;Acheteur lors de la délivrance des Produits n&apos;exonère pas le Fournisseur de la garantie de conformité, telle que décrite ci-dessous.
              </p>
              <p>
                Les Services seront fournis à l&apos;adresse communiquée par l&apos;Acheteur au moment de la commande.
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
                <strong>6.2</strong> Quelle que soit la date du transfert de propriété des Produits, le transfert des risques de perte et de détérioration s&apos;y rapportant, ne sera réalisé qu&apos;au moment où l&apos;Acheteur prendra physiquement possession des Produits qui voyagent donc aux risques et périls du Fournisseur, sauf lorsque l&apos;Acheteur fait appel à un transporteur qu&apos;il a lui-même choisi, indépendant du Fournisseur, auquel cas le transfert des risques est effectué au moment de la remise des Produits commandés par le Fournisseur au transporteur choisi par l&apos;Acheteur.
              </p>
            </section>

            {/* Article 7 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7. Droit de rétractation
              </h2>
              <p>
                Conformément aux dispositions légales en vigueur, en cas uniquement de vente à distance, l&apos;Acheteur dispose d&apos;un délai de quatorze jours à compter de la réception des Produits pour exercer son droit de rétractation auprès du Fournisseur, sans avoir à justifier de motifs ni à payer de pénalité, à fin d&apos;échange ou de remboursement, à condition que les Produits soient retournés dans leur emballage d&apos;origine et en parfait état dans les quatorze jours suivant la notification au Fournisseur de la décision de rétractation de l&apos;Acheteur.
              </p>
              <p>
                Les retours sont à effectuer dans leur état d&apos;origine et complets (emballage, accessoires, notice, etc.) permettant leur remise sur le marché à l&apos;état neuf, accompagnés de la facture d&apos;achat.
              </p>
              <p>
                Les Produits endommagés, salis ou incomplets ne sont pas repris.
              </p>
              <p>
                Le droit de rétractation peut être exercé en ligne, par déclaration dénuée d&apos;ambiguïté, exprimant la volonté de se rétracter, à l&apos;adresse suivante&nbsp;: <a href="mailto:noam.kalfa@nelior.fr" className="text-orange-600 hover:underline">noam.kalfa@nelior.fr</a>
              </p>
              <p>
                En cas d&apos;exercice du droit de rétractation dans le délai susvisé, seul le prix du ou des Produits achetés et les frais de livraison sont remboursés&nbsp;; les frais de retour restent à la charge de l&apos;Acheteur.
              </p>
              <p>
                Le remboursement sera effectué dans un délai de quatorze jours à compter de la notification au Fournisseur de la décision de rétractation.
              </p>
            </section>

            {/* Article 8 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                8. Responsabilité du Fournisseur - Garantie
              </h2>
              <p>
                Les Produits et Services vendus sont conformes à la réglementation en vigueur en France et ont des performances compatibles avec des usages non professionnels.
              </p>
              <p>
                Les Produits et Services fournis bénéficient de plein droit et sans paiement complémentaire, indépendamment du droit de rétractation, conformément aux dispositions légales&nbsp;:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>de la garantie légale de conformité, pour les Produits et Services apparemment défectueux, abîmés ou endommagés ou ne correspondant pas à la commande,</li>
                <li>de la garantie légale contre les vices cachés provenant d&apos;un défaut de matière, de conception ou de fabrication affectant les Produits et Services livrés et les rendant impropres à l&apos;utilisation.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                8.1 Garantie légale de conformité
              </h3>
              <p>
                Le Fournisseur s&apos;engage à délivrer un Produit et à fournir un Service conformes à la description contractuelle ainsi qu&apos;aux critères énoncés à l&apos;article L. 217-5 du Code de la consommation.
              </p>
              <p>
                Il répond des défauts de conformité existant au moment de la délivrance des Produits et Services et qui apparaissent dans un délai de deux ans à compter de celle-ci.
              </p>
              <p>
                Ce délai de garantie s&apos;applique sans préjudice des articles 2224 et suivants du Code civil, la prescription commençant à courir au jour de la connaissance du défaut de conformité par l&apos;Acheteur.
              </p>
              <p>
                Les défauts de conformité qui apparaissent dans un délai de vingt-quatre mois ou de douze mois s&apos;il s&apos;agit d&apos;un bien d&apos;occasion à compter de la délivrance des Produits, sont, sauf preuve contraire, présumés exister au moment de la délivrance.
              </p>
              <p>
                En cas de défaut de conformité, l&apos;Acheteur peut exiger la mise en conformité des Produits et Services délivrés par réparation ou leur remplacement ou, à défaut, une réduction du prix ou la résolution de la vente, dans les conditions légales.
              </p>
              <p>
                Il peut également suspendre le paiement de tout ou partie du prix prévu au contrat jusqu&apos;à ce que le Fournisseur ait satisfait aux obligations qui lui incombent au titre de la garantie légale de conformité, dans les conditions des articles 1219 et 1220 du Code civil.
              </p>
              <p>
                Il appartient à l&apos;Acheteur de solliciter auprès du Fournisseur la mise en conformité des Produits et Services, en choisissant entre la réparation et le remplacement. La mise en conformité du bien a lieu dans un délai ne pouvant excéder trente jours suivant la demande de l&apos;Acheteur.
              </p>
              <p>
                La réparation ou le remplacement du Produit ou Service non conforme inclut, s&apos;il y a lieu, l&apos;enlèvement et la reprise de celui-ci ainsi que l&apos;installation du Produit mis en conformité ou remplacé.
              </p>
              <p>
                Tout Produit mis en conformité dans le cadre de la garantie légale de conformité bénéficie d&apos;une extension de cette garantie de six mois.
              </p>
              <p>
                En cas de remplacement du Produit ou Service non conforme lorsque, malgré le choix de l&apos;Acheteur, la mise en conformité n&apos;a pas été effectuée par le Fournisseur, le remplacement fait courir, au profit de l&apos;Acheteur, un nouveau délai de garantie légale de conformité, à compter de la délivrance du Produit ou Service remplacé.
              </p>
              <p>
                Si la mise en conformité sollicitée est impossible ou entraîne des coûts disproportionnés dans les conditions prévues à l&apos;article L. 217-12 du Code de la consommation, le Fournisseur peut refuser celle-ci. Si les conditions prévues à l&apos;article L. 217-12 du Code de la consommation ne sont pas remplies, l&apos;Acheteur peut, après mise en demeure, poursuivre l&apos;exécution forcée en nature de la solution initialement sollicitée, conformément aux articles 1221 et suivants du Code civil.
              </p>
              <p>
                L&apos;Acheteur peut enfin exiger une réduction de prix ou la résolution de la vente (sauf si le défaut de conformité est mineur) dans les cas prévus à l&apos;article L. 217-14 du Code de la consommation.
              </p>
              <p>
                Lorsque le défaut de conformité est si grave qu&apos;il justifie que la réduction du prix ou la résolution immédiate de la vente, l&apos;Acheteur n&apos;est alors pas tenu de demander au préalable la réparation ou le remplacement du Produit ou Service non conforme.
              </p>
              <p>
                La réduction du prix est proportionnelle à la différence entre la valeur du Produit ou Service délivré et la valeur de ces derniers en l&apos;absence du défaut de conformité.
              </p>
              <p>
                En cas de résolution de la vente, l&apos;Acheteur est remboursé du prix payé contre restitution des Produits non conformes au Fournisseur, aux frais de ce dernier.
              </p>
              <p>
                Le remboursement est effectué dès réception du Produit non conforme ou de la preuve de son renvoi par l&apos;Acheteur et au plus tard dans les quatorze jours suivants, avec le même moyen de paiement que celui utilisé par l&apos;Acheteur lors du paiement, sauf accord exprès de ce dernier et en tout état de cause sans frais supplémentaire.
              </p>
              <p>
                Les dispositions qui précèdent sont sans préjudice de l&apos;allocation éventuelle de dommages et intérêts à l&apos;Acheteur, à raison du préjudice subi par ce dernier du fait du défaut de conformité.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                8.2 Garantie légale contre les vices cachés
              </h3>
              <p>
                Le Fournisseur répond des vices cachés dans le cadre de la garantie légale contre les vices cachés provenant d&apos;un défaut de matière, de conception ou de fabrication affectant les Produits ou Services délivrés et les rendant impropres à l&apos;utilisation.
              </p>
              <p>
                L&apos;Acheteur peut décider de mettre en œuvre la garantie contre les défauts cachés des Produits ou Services conformément à l&apos;article 1641 du code Civil&nbsp;; dans ce cas, il peut choisir entre la résolution de la vente ou une réduction du prix de vente conformément à l&apos;article 1644 du Code civil.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                8.3 Exclusions de garantie
              </h3>
              <p>
                La responsabilité du Fournisseur ne saurait être engagée dans les cas suivants&nbsp;:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>en cas de non-respect de la législation du pays dans lequel les Produits ou Services sont délivrés, qu&apos;il appartient à l&apos;Acheteur de vérifier avant passation de sa commande,</li>
                <li>en cas de mauvaise utilisation, d&apos;utilisation à des fins professionnelles, négligence ou défaut d&apos;entretien de la part de l&apos;Acheteur, comme en cas d&apos;usure normale du Produit ou des Services, d&apos;accident ou de force majeure.</li>
              </ul>

              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <p className="text-sm">
                  <strong>Rappel légal&nbsp;:</strong> Le consommateur dispose d&apos;un délai de deux ans à compter de la délivrance du bien pour obtenir la mise en œuvre de la garantie légale de conformité en cas d&apos;apparition d&apos;un défaut de conformité. Durant ce délai, le consommateur n&apos;est tenu d&apos;établir que l&apos;existence du défaut de conformité et non la date d&apos;apparition de celui-ci.
                </p>
                <p className="text-sm mt-2">
                  La garantie légale de conformité emporte obligation pour le professionnel, le cas échéant, de fournir toutes les mises à jour nécessaires au maintien de la conformité du bien.
                </p>
                <p className="text-sm mt-2">
                  La garantie légale de conformité donne au consommateur droit à la réparation ou au remplacement du bien dans un délai de trente jours suivant sa demande, sans frais et sans inconvénient majeur pour lui.
                </p>
                <p className="text-sm mt-2">
                  Si le bien est réparé dans le cadre de la garantie légale de conformité, le consommateur bénéficie d&apos;une extension de six mois de la garantie initiale.
                </p>
                <p className="text-sm mt-2">
                  Si le consommateur demande la réparation du bien, mais que le vendeur impose le remplacement, la garantie légale de conformité est renouvelée pour une période de deux ans à compter de la date de remplacement du bien.
                </p>
                <p className="text-sm mt-2">
                  Le consommateur bénéficie également de la garantie légale des vices cachés en application des articles 1641 à 1649 du Code civil, pendant une durée de deux ans à compter de la découverte du défaut. Cette garantie donne droit à une réduction de prix si le bien est conservé ou à un remboursement intégral contre restitution du bien.
                </p>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                8.4 Installation
              </h3>
              <p>
                Le Fournisseur déclare et l&apos;Acheteur reconnaît que lors de l&apos;installation des Produits, l&apos;intervention se limite exclusivement à la pose des Produits à l&apos;intérieur du tableau électrique, sans modification ou manipulation du câblage, des disjoncteurs ou de tout autre élément électrique. En conséquence, le Fournisseur décline toute responsabilité en cas de dysfonctionnement, panne ou incident liés à l&apos;installation électrique ou à son câblage, ceux-ci demeurant sous l&apos;entière responsabilité de l&apos;Acheteur ou de l&apos;installateur initial.
              </p>
            </section>

            {/* Article 9 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                9. Propriété intellectuelle
              </h2>
              <p>
                Le Fournisseur conserve l&apos;ensemble des droits de propriété industrielle et intellectuelle afférents aux Produits, photos, documentations techniques et autres contenus de son site internet, qui ne peuvent être communiqués ni exécutés sans son autorisation écrite. Toute reproduction totale ou partielle de ce contenu est strictement interdite et est susceptible de constituer un délit de contrefaçon.
              </p>
            </section>

            {/* Article 10 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                10. Données personnelles
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

            {/* Article 11 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                11. Force majeure
              </h2>
              <p>
                Les Parties ne pourront être tenues pour responsables si la non-exécution ou le retard dans l&apos;exécution de l&apos;une quelconque de leurs obligations, telles que décrites dans les présentes découle d&apos;un cas de force majeure, au sens de l&apos;article 1218 du Code civil ou d&apos;aléas sanitaires ou climatiques exceptionnels indépendants de la volonté des Parties.
              </p>
            </section>

            {/* Article 12 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                12. Résiliation du contrat
              </h2>
              <p>
                Il est rappelé que, conformément aux dispositions légales, la résiliation du contrat par voie électronique est possible lorsque le contrat a été conclu par voie électronique ou, lorsqu&apos;au jour de la résiliation le Fournisseur offre aux Acheteurs la possibilité de conclure des contrats par voie électronique.
              </p>
              <p>
                A cet effet, une fonctionnalité gratuite est mise à la disposition de l&apos;Acheteur, lui permettant d&apos;accomplir, par voie électronique, la notification et toutes les démarches nécessaires à la résiliation du contrat, dont le Fournisseur devra accuser réception en informant l&apos;Acheteur, sur un support durable et dans un délai raisonnable, de la date à laquelle le contrat prend fin et des effets de la résiliation.
              </p>
            </section>

            {/* Article 13 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                13. Droit applicable - Litiges
              </h2>
              <p>
                Les présentes CGV et les opérations qui en découlent sont régies par le droit français.
              </p>
              <p>
                Elles sont rédigées en langue française. Dans le cas où elles seraient traduites en une ou plusieurs langues, seul le texte français ferait foi en cas de litige.
              </p>
              <p>
                Tous les litiges auxquels les présentes et les accords qui en découlent pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résolution, leurs conséquences et leurs suites, et qui n&apos;auraient pas pu être résolus à l&apos;amiable entre les parties, seront soumis aux Tribunaux compétents dans les conditions de droit commun.
              </p>
              <p>
                L&apos;Acheteur est informé qu&apos;il peut en tout état de cause recourir à une médiation conventionnelle, notamment auprès de la Commission de la médiation de la consommation (article L. 612-1 du Code de la consommation) ou auprès des instances de médiation sectorielles existantes, ou à tout mode alternatif de règlement des différends (conciliation, par exemple) en cas de contestation.
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
