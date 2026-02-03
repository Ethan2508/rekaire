// ============================================
// REKAIRE - Page Article Blog
// Design moderne avec table des matières
// ============================================

import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Tag, User, Share2, BookOpen, ChevronRight, Flame } from "lucide-react";
import type { Metadata } from "next";
import { marked } from "marked";

// Configuration de marked pour mode synchrone
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
  featured_image?: string;
}

// Extraire les titres du contenu markdown pour la table des matières
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
    (match, level, text) => {
      const id = text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return `<h${level} id="${id}" class="scroll-mt-24">${text}</h${level}>`;
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

  // Incrémenter les vues (fire and forget)
  supabase.rpc("increment_article_views", { article_slug: slug });

  // Extraire les titres pour la table des matières
  const headings = extractHeadings(article.content || "");

  // Convertir le markdown en HTML et ajouter les IDs
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
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
              Accueil
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/blog" className="text-gray-500 hover:text-gray-700 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Category Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
              <Flame className="w-4 h-4" />
              {article.category}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 text-sm">{article.read_time} min de lecture</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl">
            {article.excerpt}
          </p>

          {/* Author & Date */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                {article.author?.charAt(0) || "R"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{article.author}</p>
                <p className="text-gray-500">{formatDate(article.published_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          
          {/* Table of Contents - Desktop Sidebar */}
          {headings.length > 2 && (
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    Sommaire
                  </h3>
                  <nav className="space-y-1">
                    {headings.map((heading, index) => (
                      <a
                        key={index}
                        href={`#${heading.id}`}
                        className={`block py-2 text-sm transition-colors hover:text-orange-600 ${
                          heading.level === 2
                            ? "text-gray-700 font-medium"
                            : "text-gray-500 pl-4 border-l-2 border-gray-200"
                        }`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Quick CTA */}
                <div className="mt-6 p-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl text-white">
                  <Flame className="w-8 h-8 mb-3 opacity-80" />
                  <h4 className="font-bold mb-2">Protégez-vous</h4>
                  <p className="text-sm text-white/80 mb-4">
                    Le RK01 s&apos;active automatiquement à 90°C
                  </p>
                  <Link
                    href="/produit"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:underline"
                  >
                    Découvrir <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </aside>
          )}

          {/* Article Content */}
          <article className={`${headings.length > 2 ? "lg:col-span-9" : "lg:col-span-12 max-w-3xl mx-auto"}`}>
            
            {/* Mobile Table of Contents */}
            {headings.length > 2 && (
              <div className="lg:hidden mb-8 bg-gray-50 rounded-xl p-5 border border-gray-100">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                      <BookOpen className="w-4 h-4 text-orange-500" />
                      Sommaire ({headings.length} sections)
                    </h3>
                    <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90" />
                  </summary>
                  <nav className="mt-4 space-y-2 pt-4 border-t border-gray-200">
                    {headings.map((heading, index) => (
                      <a
                        key={index}
                        href={`#${heading.id}`}
                        className={`block py-1 text-sm ${
                          heading.level === 2
                            ? "text-gray-700 font-medium"
                            : "text-gray-500 pl-4"
                        }`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </details>
              </div>
            )}

            {/* Article Body */}
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-100
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-800
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-orange-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:my-6 prose-ul:space-y-2
                prose-ol:my-6 prose-ol:space-y-2
                prose-li:text-gray-600 prose-li:leading-relaxed
                prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:text-gray-700 prose-blockquote:not-italic
                prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                prose-img:rounded-xl prose-img:shadow-lg"
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
                        className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Share & Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux articles
              </Link>
            </div>

            {/* CTA Banner */}
            <div className="mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 md:p-12">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500 rounded-full blur-3xl" />
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Image
                      src="/images/product/rk01-hero.png"
                      alt="RK01"
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Protégez votre foyer avec le RK01
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-xl">
                    Dispositif d&apos;extinction automatique qui se déclenche à 90°C. 
                    Installation en 30 secondes, sans outils, protection 24h/24.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link
                      href="/produit"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all shadow-lg shadow-orange-500/25"
                    >
                      Découvrir le RK01
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                    <span className="text-gray-400 text-sm">
                      À partir de <span className="text-white font-bold">70€ HT</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
