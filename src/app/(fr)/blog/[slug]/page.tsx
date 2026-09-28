// ============================================
// REKAIRE - Page Article Blog
// ============================================

import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Header, Footer } from "@/components";
import { ArrowLeft, Calendar, Clock, Tag, ChevronRight, Flame, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { marked } from "marked";

// Configuration de marked
marked.setOptions({
  async: false,
  gfm: true,
  breaks: true,
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

// Extraire les titres pour la table des matières
function extractHeadings(markdown: string): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    headings.push({ id, text, level });
  }

  return headings;
}

// Ajouter des IDs aux titres dans le HTML
function addHeadingIds(html: string): string {
  return html.replace(
    /<h([23])>([^<]+)<\/h[23]>/g,
    (_, level, text) => {
      const id = text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return `<h${level} id="${id}">${text}</h${level}>`;
    }
  );
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
    .select("title, meta_title, meta_description, keywords, excerpt")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!article) {
    return { title: "Article non trouvé | Rekaire" };
  }

  return {
    title: article.meta_title || `${article.title} | Blog Rekaire`,
    description: article.meta_description || article.excerpt,
    keywords: article.keywords,
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt,
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

  // Incrémenter les vues
  supabase.rpc("increment_article_views", { article_slug: slug });

  // Extraire les titres pour la table des matières
  const headings = extractHeadings(article.content || "");

  // Convertir le markdown en HTML
  let contentHtml = marked.parse(article.content || "") as string;
  contentHtml = addHeadingIds(contentHtml);

  // Formater la date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-orange-600 transition-colors">
                Accueil
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link href="/blog" className="text-gray-500 hover:text-orange-600 transition-colors">
                Blog
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium truncate max-w-[200px]">
                {article.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <header className="bg-white py-12 md:py-16 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category & Read time */}
            <div className="flex items-center gap-4 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
                <Flame className="w-4 h-4" />
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-gray-500 text-sm">
                <Clock className="w-4 h-4" />
                {article.read_time} min de lecture
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {article.excerpt}
            </p>

            {/* Author & Date */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{article.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(article.published_at)}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            
            {/* Table of Contents - Sidebar */}
            {headings.length > 2 && (
              <aside className="hidden lg:block lg:col-span-3">
                <div className="sticky top-24 bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    Sommaire
                  </h3>
                  <nav className="space-y-2">
                    {headings.map((heading, index) => (
                      <a
                        key={index}
                        href={`#${heading.id}`}
                        className={`block py-1 text-sm transition-colors hover:text-orange-600 ${
                          heading.level === 2
                            ? "text-gray-700 font-medium"
                            : "text-gray-500 pl-3 border-l-2 border-gray-200"
                        }`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}

            {/* Article Content */}
            <article className={`${headings.length > 2 ? "lg:col-span-9" : "lg:col-span-12 max-w-3xl mx-auto"}`}>
              
              {/* Mobile Table of Contents */}
              {headings.length > 2 && (
                <div className="lg:hidden mb-8 bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <span className="flex items-center gap-2 text-sm font-bold text-gray-900">
                        <BookOpen className="w-4 h-4 text-orange-500" />
                        Sommaire ({headings.length} sections)
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90" />
                    </summary>
                    <nav className="mt-4 space-y-2 pt-4 border-t border-gray-200">
                      {headings.map((heading, index) => (
                        <a
                          key={index}
                          href={`#${heading.id}`}
                          className={`block py-1 text-sm text-gray-600 hover:text-orange-600 ${
                            heading.level === 3 ? "pl-4" : ""
                          }`}
                        >
                          {heading.text}
                        </a>
                      ))}
                    </nav>
                  </details>
                </div>
              )}

              {/* Article Body with custom styles */}
              <div 
                className="article-body"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour aux articles
                </Link>
              </div>

              {/* CTA */}
              <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <h3 className="text-2xl font-bold mb-3">
                  Protégez votre installation électrique
                </h3>
                <p className="text-white/90 mb-6">
                  Le RK01 s&apos;active automatiquement à 175°C et éteint les départs de feu 
                  avant qu&apos;ils ne se propagent. Installation en 30 secondes, sans outils.
                </p>
                <Link
                  href="/produit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Découvrir le RK01
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
