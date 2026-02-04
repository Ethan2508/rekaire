"use client";

// ============================================
// REKAIRE - Blog Preview Section (Homepage)
// ============================================

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  category: string;
  readTime?: number;
  publishedAt: string;
}

// Articles statiques (fallback)
const fallbackArticles = [
  {
    _id: "1",
    title: "Incendies électriques en France : les chiffres alarmants",
    slug: { current: "incendies-electriques-france-statistiques" },
    excerpt: "Chaque année, 300 000 incendies domestiques dont 25% d'origine électrique. Découvrez les statistiques.",
    category: "Statistiques",
    readTime: 5,
    publishedAt: "2025-01-15",
  },
  {
    _id: "2",
    title: "Comment protéger efficacement votre tableau électrique ?",
    slug: { current: "protection-tableau-electrique-guide" },
    excerpt: "Guide complet pour sécuriser votre installation électrique et prévenir les risques d'incendie.",
    category: "Prévention",
    readTime: 7,
    publishedAt: "2025-01-08",
  },
  {
    _id: "3",
    title: "Installation du RK01 : guide étape par étape",
    slug: { current: "rk01-installation-etapes" },
    excerpt: "Installez votre dispositif RK01 en quelques minutes seulement avec notre tutoriel.",
    category: "Tutoriels",
    readTime: 4,
    publishedAt: "2025-01-02",
  },
];

export function BlogPreviewSection() {
  const articles = fallbackArticles;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-sm font-semibold mb-6">
            <BookOpen className="w-4 h-4" />
            Notre blog
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Restez informé sur la sécurité incendie
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conseils, actualités et guides pratiques pour protéger votre habitat et vos locaux.
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {articles.map((article, index) => (
            <motion.article
              key={article._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/blog/${article.slug.current}`}>
                <div className="h-full bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-orange-300 hover:shadow-lg transition-all">
                  {/* Category */}
                  <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium mb-4">
                    {article.category}
                  </span>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(article.publishedAt)}
                    </div>
                    {article.readTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime} min
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-medium transition-colors"
          >
            Voir tous les articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
