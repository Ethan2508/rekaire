// ============================================
// REKAIRE - Blog Grid (Articles)
// Lit les articles depuis Supabase
// ============================================

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Type Article depuis Supabase
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  category: string;
  author?: string;
  read_time?: number;
  published_at: string;
  featured?: boolean;
}

// Articles de blog statiques (fallback si Sanity ne répond pas)
const fallbackArticles = [
  {
    id: "incendies-electriques-france-statistiques",
    title: "Incendies électriques en France : les chiffres alarmants de 2025",
    excerpt: "Chaque année, 300 000 incendies domestiques dont 25% d'origine électrique. Découvrez les statistiques et comment vous protéger.",
    category: "Statistiques",
    categorySlug: "statistiques",
    author: "Équipe Rekaire",
    date: "15 janvier 2025",
    readTime: "5 min",
    image: "/images/blog/incendie-electrique.jpg",
    featured: true,
  },
  {
    id: "protection-tableau-electrique-guide",
    title: "Comment protéger efficacement votre tableau électrique ?",
    excerpt: "Guide complet pour sécuriser votre installation électrique et prévenir les risques d'incendie avec des solutions automatiques.",
    category: "Prévention",
    categorySlug: "prevention",
    author: "Équipe Rekaire",
    date: "8 janvier 2025",
    readTime: "7 min",
    image: "/images/blog/tableau-electrique.jpg",
    featured: true,
  },
  {
    id: "rk01-installation-etapes",
    title: "Installation du RK01 : guide étape par étape",
    excerpt: "Installez votre dispositif RK01 en quelques minutes seulement. Suivez notre tutoriel complet avec photos.",
    category: "Tutoriels",
    categorySlug: "tutoriels",
    author: "Équipe Rekaire",
    date: "2 janvier 2025",
    readTime: "4 min",
    image: "/images/blog/installation-rk01.jpg",
    featured: false,
  },
  {
    id: "normes-securite-incendie-2025",
    title: "Nouvelles normes de sécurité incendie 2025 : ce qui change",
    excerpt: "Les réglementations évoluent. Découvrez les nouvelles obligations pour les particuliers et professionnels.",
    category: "Réglementation",
    categorySlug: "reglementation",
    author: "Équipe Rekaire",
    date: "20 décembre 2024",
    readTime: "6 min",
    image: "/images/blog/normes-securite.jpg",
    featured: false,
  },
  {
    id: "aerosol-extincteur-vs-traditionnel",
    title: "Extincteur aérosol vs traditionnel : lequel choisir ?",
    excerpt: "Comparatif complet entre les solutions d'extinction traditionnelles et les nouvelles technologies à aérosol.",
    category: "Comparatifs",
    categorySlug: "comparatifs",
    author: "Équipe Rekaire",
    date: "12 décembre 2024",
    readTime: "8 min",
    image: "/images/blog/comparatif-extincteur.jpg",
    featured: false,
  },
  {
    id: "temoignage-client-incendie-evite",
    title: "Témoignage : comment le RK01 a sauvé ma maison",
    excerpt: "Jean-Pierre nous raconte comment son RK01 s'est déclenché automatiquement et a évité un drame.",
    category: "Témoignages",
    categorySlug: "temoignages",
    author: "Équipe Rekaire",
    date: "5 décembre 2024",
    readTime: "3 min",
    image: "/images/blog/temoignage.jpg",
    featured: false,
  },
];

// Composant Article Card
function ArticleCard({ article, index, featured = false }: { 
  article: Article; 
  index: number;
  featured?: boolean;
}) {
  // Formater la date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group ${featured ? "md:col-span-2" : ""}`}
    >
      <Link href={`/blog/${article.slug}`} className="block">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Content */}
          <div className="p-6">
            {/* Category */}
            <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium mb-3">
              {article.category}
            </span>

            {/* Title */}
            <h3 className={`font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-3 ${featured ? "text-2xl" : "text-lg"}`}>
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className={`text-gray-600 mb-4 ${featured ? "text-base" : "text-sm"} line-clamp-2`}>
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(article.published_at)}
              </div>
              {article.read_time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.read_time} min
                </div>
              )}
            </div>

            {/* Read more (featured only) */}
            {featured && (
              <div className="mt-6 flex items-center gap-2 text-orange-600 font-medium group-hover:gap-3 transition-all">
                Lire l&apos;article
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function BlogGrid() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('id, title, slug, excerpt, featured_image, category, author, read_time, published_at, featured')
          .eq('published', true)
          .order('published_at', { ascending: false });

        if (error) throw error;
        setArticles(data || []);
      } catch (error) {
        console.error('Erreur chargement articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
          <span className="text-4xl">📝</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun article pour le moment</h3>
        <p className="text-gray-600">Les premiers articles arrivent bientôt !</p>
      </div>
    );
  }

  const featuredArticles = articles.filter(a => a.featured);
  const regularArticles = articles.filter(a => !a.featured);

  return (
    <div className="space-y-12">
      {/* Articles récents - tous les articles par date */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Articles récents
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} featured={article.featured} />
          ))}
        </div>
      </section>

      {/* Load More */}
      <div className="text-center pt-8">
        <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-orange-300 hover:text-orange-600 transition-colors">
          Charger plus d&apos;articles
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
