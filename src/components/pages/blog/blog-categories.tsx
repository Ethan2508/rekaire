// ============================================
// REKAIRE - Blog Categories Sidebar
// ============================================

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  BarChart3, 
  Shield, 
  BookOpen, 
  Scale, 
  GitCompare, 
  MessageSquare,
  TrendingUp,
  Tag
} from "lucide-react";
import { sanityClient } from "@/lib/sanity";

const categoryIcons: Record<string, any> = {
  "statistiques": { icon: BarChart3, color: "bg-blue-100 text-blue-600" },
  "prevention": { icon: Shield, color: "bg-green-100 text-green-600" },
  "tutoriels": { icon: BookOpen, color: "bg-purple-100 text-purple-600" },
  "reglementation": { icon: Scale, color: "bg-yellow-100 text-yellow-700" },
  "comparatifs": { icon: GitCompare, color: "bg-indigo-100 text-indigo-600" },
  "temoignages": { icon: MessageSquare, color: "bg-pink-100 text-pink-600" },
  "actualites": { icon: TrendingUp, color: "bg-red-100 text-red-600" },
};

interface CategoryCount {
  name: string;
  slug: string;
  count: number;
  icon: any;
  color: string;
}

export function BlogCategories() {
  const [categories, setCategories] = useState<CategoryCount[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Récupérer tous les articles publiés avec leur catégorie
        const articles = await sanityClient.fetch(`
          *[_type == "article" && status == "published"]{
            category
          }
        `);

        // Compter les articles par catégorie
        const categoryMap: Record<string, number> = {};
        articles.forEach((article: any) => {
          if (article.category) {
            categoryMap[article.category] = (categoryMap[article.category] || 0) + 1;
          }
        });

        // Transformer en format avec icônes
        const categoriesWithIcons = Object.entries(categoryMap)
          .map(([slug, count]) => {
            const iconData = categoryIcons[slug] || { 
              icon: Tag, 
              color: "bg-gray-100 text-gray-600" 
            };
            return {
              name: slug.charAt(0).toUpperCase() + slug.slice(1),
              slug,
              count,
              icon: iconData.icon,
              color: iconData.color,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        setCategories(categoriesWithIcons);
      } catch (error) {
        console.error('Erreur chargement catégories:', error);
      }
    };
    loadCategories();
  }, []);

  if (categories.length === 0) {
    return null; // Ne rien afficher si pas de catégories
  }

  return (
    <div className="space-y-8 lg:sticky lg:top-24">
      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-50 border border-gray-200 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          Catégories
        </h3>
        <ul className="space-y-2">
          {categories.map((category, index) => (
            <motion.li
              key={category.slug}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                href={`/blog/categorie/${category.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group"
              >
                <div className={`w-9 h-9 rounded-lg ${category.color} flex items-center justify-center`}>
                  <category.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-gray-700 group-hover:text-gray-900 font-medium text-sm">
                    {category.name}
                  </span>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Newsletter CTA */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white"
      >
        <h3 className="text-lg font-bold mb-2">
          Restez informé
        </h3>
        <p className="text-orange-100 text-sm mb-4">
          Recevez nos derniers articles et conseils directement dans votre boîte mail.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="votre@email.com"
            className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-orange-200 focus:bg-white/20 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="w-full py-2.5 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
          >
            S&apos;abonner
          </button>
        </form>
        <p className="text-xs text-orange-200 mt-3">
          Pas de spam, désabonnement en un clic.
        </p>
      </motion.div>
    </div>
  );
}
