"use client";

// ============================================
// REKAIRE - FAQ Categories Section
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Package, Settings, CreditCard, Truck, HelpCircle } from "lucide-react";

const faqCategories = [
  {
    id: "product",
    icon: Package,
    title: "Produit",
    faqs: [
      {
        question: "Qu'est-ce que le RK01 ?",
        answer: "Le RK01 est un système autonome d'extinction incendie conçu spécifiquement pour les tableaux électriques. Il se déclenche automatiquement en cas de surchauffe (90°C) et éteint les départs de feu sans intervention humaine."
      },
      {
        question: "Le RK01 est-il adapté à mon tableau électrique ?",
        answer: "Oui, le RK01 est compatible avec tous types de tableaux électriques résidentiels et professionnels. Ses dimensions compactes (Ø32mm x 95mm) lui permettent de s'intégrer facilement."
      },
      {
        question: "Quelle est la durée de vie du RK01 ?",
        answer: "Le RK01 a une durée de vie de 5 ans sans aucune maintenance nécessaire. Une date de péremption est indiquée sur chaque unité."
      },
      {
        question: "L'agent extincteur est-il dangereux ?",
        answer: "Non, l'agent extincteur est non toxique, écologique et ne laisse aucun résidu. Il est spécialement conçu pour les feux d'origine électrique."
      },
      {
        question: "Combien de RK01 faut-il pour mon installation ?",
        answer: "Un RK01 couvre un volume d'environ 1m³. Pour un tableau standard, une unité suffit généralement. Pour les grandes armoires électriques, nous recommandons plusieurs unités."
      },
    ]
  },
  {
    id: "installation",
    icon: Settings,
    title: "Installation",
    faqs: [
      {
        question: "Comment installer le RK01 ?",
        answer: "L'installation est très simple : nettoyez la surface, retirez le film protecteur de l'adhésif fourni, positionnez le RK01 au plafond du tableau et appuyez fermement 30 secondes. Aucun outil nécessaire."
      },
      {
        question: "Où placer le RK01 dans le tableau ?",
        answer: "Idéalement au centre-haut du tableau électrique, la chaleur montant naturellement. Évitez de le placer directement sur un composant qui chauffe en fonctionnement normal."
      },
      {
        question: "Faut-il faire appel à un professionnel ?",
        answer: "Non, l'installation peut être réalisée par n'importe qui en 2 minutes. Cependant, si vous avez un doute sur l'état de votre installation électrique, consultez un électricien."
      },
      {
        question: "Le RK01 nécessite-t-il un raccordement électrique ?",
        answer: "Non, le RK01 est 100% autonome. Il fonctionne sans électricité grâce à un mécanisme thermosensible mécanique."
      },
    ]
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "Paiement",
    faqs: [
      {
        question: "Quels modes de paiement acceptez-vous ?",
        answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express) via notre plateforme sécurisée Stripe."
      },
      {
        question: "Le paiement est-il sécurisé ?",
        answer: "Oui, tous les paiements sont sécurisés par Stripe, leader mondial du paiement en ligne. Vos données bancaires ne transitent jamais par nos serveurs."
      },
      {
        question: "Puis-je payer en plusieurs fois ?",
        answer: "Actuellement, nous ne proposons pas le paiement en plusieurs fois. Pour les commandes professionnelles importantes, contactez-nous pour discuter des options."
      },
      {
        question: "Puis-je obtenir une facture ?",
        answer: "Oui, une facture est automatiquement envoyée par email après chaque commande. Vous pouvez également la télécharger depuis votre email de confirmation."
      },
    ]
  },
  {
    id: "shipping",
    icon: Truck,
    title: "Livraison",
    faqs: [
      {
        question: "Quels sont les délais de livraison ?",
        answer: "Les commandes sont expédiées sous 24h (jours ouvrés). La livraison en France métropolitaine prend généralement 24 à 48h."
      },
      {
        question: "Quels sont les frais de livraison ?",
        answer: "La livraison est offerte pour toute commande en France métropolitaine. Pour les DOM-TOM et l'international, des frais peuvent s'appliquer."
      },
      {
        question: "Puis-je suivre ma commande ?",
        answer: "Oui, un numéro de suivi vous est envoyé par email dès l'expédition de votre commande."
      },
      {
        question: "Livrez-vous à l'international ?",
        answer: "Actuellement, nous livrons uniquement en France métropolitaine. L'expansion internationale est prévue prochainement."
      },
    ]
  },
  {
    id: "support",
    icon: HelpCircle,
    title: "Support",
    faqs: [
      {
        question: "Comment contacter le service client ?",
        answer: "Vous pouvez nous contacter par email à contact@rekaire.fr ou par téléphone au +33 (0) 4 82 53 06 19. Nous répondons sous 24-48h ouvrées."
      },
      {
        question: "Quelle est la garantie du RK01 ?",
        answer: "Le RK01 est garanti 5 ans. En cas de défaut de fabrication, nous procédons au remplacement gratuit du produit."
      },
      {
        question: "Puis-je retourner le produit ?",
        answer: "Oui, vous disposez de 14 jours après réception pour retourner le produit non utilisé et dans son emballage d'origine. Le remboursement est effectué sous 14 jours."
      },
      {
        question: "Que faire après un déclenchement du RK01 ?",
        answer: "Après déclenchement, ne remettez pas le courant immédiatement. Faites vérifier votre installation par un électricien pour identifier la cause, puis remplacez le RK01."
      },
    ]
  },
];

export function FAQCategories() {
  const [activeCategory, setActiveCategory] = useState("product");
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  const currentCategory = faqCategories.find(c => c.id === activeCategory);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories sidebar */}
          <div className="lg:col-span-1">
            <nav className="sticky top-28 space-y-2">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setOpenQuestion(0);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeCategory === category.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span className="font-medium">{category.title}</span>
                  <span className={`ml-auto text-sm ${
                    activeCategory === category.id ? "text-orange-200" : "text-gray-400"
                  }`}>
                    {category.faqs.length}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* FAQ list */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {currentCategory?.title}
              </h2>

              <div className="space-y-4">
                {currentCategory?.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                          openQuestion === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openQuestion === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-5 pb-5 text-gray-600 border-t border-gray-100 pt-4">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
