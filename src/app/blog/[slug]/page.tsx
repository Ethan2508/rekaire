// ============================================
// REKAIRE - Page Article Blog
// Affiche un article depuis Supabase
// ============================================

import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import type { Metadata } from "next";
import { marked } from "marked";

// Configuration de marked pour mode synchrone
marked.setOptions({
  async: false,
});

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  read_time: number;
  published_at: string;
  meta_title: string;
  meta_description: string;
  keywords: string[];
}

// Générer les métadonnées dynamiques
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  const { data: article } = await supabase
    .from("articles")
    .select("title, meta_title, meta_description, keywords")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!article) {
    return { title: "Article non trouvé | Rekaire" };
  }

  return {
    title: article.meta_title || `${article.title} | Rekaire`,
    description: article.meta_description,
    keywords: article.keywords,
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description,
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Récupérer l'article
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !article) {
    notFound();
  }

  // Incrémenter les vues (ignore les erreurs)
  await supabase.rpc("increment_article_views", { article_slug: slug }).catch(() => {});

  // Convertir le markdown en HTML (mode synchrone)
  const contentHtml = marked.parse(article.content || "") as string;

  // Formater la date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>

          {/* Category */}
          <span className="inline-block px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium mb-4">
            {article.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold mb-6">{article.title}</h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-300 mb-8">{article.excerpt}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {article.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {formatDate(article.published_at)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {article.read_time} min de lecture
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          {/* Article content */}
          <article
            className="prose prose-lg prose-gray max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-ul:my-6 prose-li:text-gray-700
              prose-blockquote:border-l-orange-500 prose-blockquote:text-gray-600"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-5 h-5 text-gray-400" />
                {article.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Protégez votre installation électrique
            </h3>
            <p className="text-lg text-white/90 mb-6">
              Le RK01 s&apos;active automatiquement en cas de départ de feu et
              vous protège 24h/24.
            </p>
            <Link
              href="/produit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Découvrir le RK01
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
