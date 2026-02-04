"use client";

// ============================================
// REKAIRE - Product FAQ Section
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "Le RK01 est-il adapté à mon tableau électrique ?",
    answer: "Oui, le RK01 est compatible avec tous types de tableaux électriques résidentiels et professionnels. Ses dimensions compactes (Ø32mm x 95mm) lui permettent de s'intégrer dans la plupart des configurations. Pour les tableaux de grande taille, nous recommandons l'installation de plusieurs unités."
  },
  {
    question: "Comment se déclenche le RK01 ?",
    answer: "Le RK01 se déclenche automatiquement lorsque la température ambiante atteint 170°C (±5°C). Il n'a besoin d'aucune source d'énergie externe : le mécanisme est entièrement mécanique et thermosensible, garantissant un fonctionnement même en cas de coupure de courant."
  },
  {
    question: "L'agent extincteur est-il sans danger ?",
    answer: "Absolument. L'agent extincteur utilisé est non toxique, écologique et ne laisse aucun résidu. Il est spécialement conçu pour les feux d'origine électrique (classe E) et n'endommagera pas vos équipements électroniques."
  },
  {
    question: "Quelle est la durée de vie du RK01 ?",
    answer: "Le RK01 a une durée de vie de 5 ans à partir de la date de fabrication, sans aucune maintenance nécessaire. Une date de péremption est clairement indiquée sur chaque unité. Nous recommandons de remplacer le dispositif à l'approche de cette date."
  },
  {
    question: "Comment installer le RK01 ?",
    answer: "L'installation est très simple et ne nécessite aucun outil. Un adhésif haute résistance est fourni. Il suffit de nettoyer la surface de fixation, retirer le film protecteur de l'adhésif et appuyer fermement pendant 30 secondes. L'installation prend moins de 2 minutes."
  },
  {
    question: "Que se passe-t-il après le déclenchement ?",
    answer: "Après déclenchement, le RK01 doit être remplacé. L'agent extincteur ne laisse pas de résidu significatif, mais nous recommandons de faire vérifier votre installation électrique par un professionnel pour identifier la cause du départ de feu avant de remettre le courant."
  },
];

export function ProductFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-lg text-gray-600">
            Tout ce que vous devez savoir sur le RK01
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">
            Vous avez d&apos;autres questions ?
          </p>
          <Link
            href="/faq"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Voir toutes les FAQ →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
