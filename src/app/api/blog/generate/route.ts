// ============================================
// REKAIRE - API: Génération automatique d'articles
// Génère des articles avec OpenAI, stocke dans Supabase
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// Secret pour sécuriser l'endpoint (optionnel)
const API_SECRET = process.env.BLOG_API_SECRET || "rk-blog-2026-secret";

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Topics pour la génération d'articles
const TOPICS = [
  "Statistiques sur les incendies domestiques en France : 300 000 incendies par an, 25-30% d'origine électrique",
  "Comment protéger efficacement son tableau électrique des risques d'incendie",
  "Les dangers des incendies nocturnes : 70% des incendies mortels se déclarent la nuit",
  "Pourquoi 75% des entreprises ferment après un incendie majeur",
  "Comparaison entre extincteurs automatiques et traditionnels",
  "Réglementation incendie pour les professionnels en France",
  "Protéger son camping-car ou van aménagé des départs de feu électrique",
  "Les gestes qui sauvent en cas de départ de feu électrique",
  "Guide pratique : où installer un dispositif de protection incendie",
  "Prévention incendie en cuisine : la deuxième cause d'incendie domestique",
  "Les risques électriques dans les maisons anciennes",
  "L'importance des détecteurs de fumée",
  "Incendies en entreprise : coûts, conséquences et solutions",
  "Les 5 zones les plus à risque dans une maison",
  "Sécurité incendie pour les locations Airbnb et gîtes",
];

const CATEGORIES = ["Statistiques", "Prévention", "Tutoriels", "Réglementation", "Comparatifs", "Conseils", "Entreprises"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { secret, topic: customTopic } = body;

    // Vérification optionnelle du secret
    if (secret && secret !== API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Vérifier la clé OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: openaiKey });

    // Choisir un topic
    const topic = customTopic || TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

    console.log("[Blog Generate] Topic:", topic);

    // Générer l'article avec OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Tu es un rédacteur expert en sécurité incendie pour Rekaire, une entreprise française.

PRODUIT RK01 :
- Dispositif d'extinction automatique pour tableaux électriques
- Prix : 70€ HT (60€ HT dès 2 unités)
- Activation automatique à 90°C
- Durée de vie : 5 ans sans entretien
- Installation en 30 secondes, sans outils
- Fonctionne sans électricité ni batterie
- Certifié et testé

STYLE D'ÉCRITURE :
- Professionnel mais accessible
- Informatif avec des données concrètes
- Structuré avec des sections claires
- Engageant pour le lecteur`
        },
        {
          role: "user",
          content: `SUJET : ${topic}
CATÉGORIE : ${category}

Génère un article de blog complet et bien structuré. RÉPONDS UNIQUEMENT avec ce JSON valide :

{
  "title": "Titre accrocheur et informatif (50-70 caractères)",
  "slug": "titre-en-minuscules-avec-tirets-sans-accents",
  "excerpt": "Résumé captivant qui donne envie de lire (150-200 caractères)",
  "category": "${category}",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "content": "## Introduction\\n\\nAccroche qui capte l'attention avec une statistique ou question. Présentation du problème et de ce que l'article va couvrir.\\n\\n## Les chiffres clés\\n\\nStatistiques importantes avec **données en gras**. Utilise des listes :\\n\\n- Point important 1\\n- Point important 2\\n- Point important 3\\n\\n## Les causes principales\\n\\nExplication détaillée des causes avec exemples concrets.\\n\\n### Sous-section si nécessaire\\n\\nDétails supplémentaires.\\n\\n## Comment se protéger\\n\\nConseils pratiques et solutions.\\n\\n## Le RK01 : une solution automatique\\n\\nPrésentation naturelle du produit comme solution au problème évoqué. Avantages concrets.\\n\\n## Conclusion\\n\\nRésumé des points clés et appel à l'action subtil.",
  "meta_title": "Titre SEO optimisé | Blog Rekaire",
  "meta_description": "Description SEO de 150-160 caractères avec mots-clés principaux",
  "keywords": ["mot-clé principal", "mot-clé secondaire", "mot-clé tertiaire"],
  "read_time": 6
}

RÈGLES IMPORTANTES :
1. Article de 1000-1500 mots minimum
2. Au moins 5 sections avec titres ## H2
3. Utilise ### H3 pour les sous-sections si nécessaire
4. **Gras** pour les données importantes et statistiques
5. Listes à puces pour faciliter la lecture
6. Mentionne le RK01 naturellement dans UNE section dédiée
7. Ton professionnel mais accessible
8. Slug en minuscules, sans accents, avec tirets
9. Inclus des statistiques réelles sur les incendies en France`
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    // Parser le JSON
    let articleData;
    try {
      const cleanJson = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      articleData = JSON.parse(cleanJson);
    } catch {
      console.error("[Blog Generate] Parse error:", responseText);
      return NextResponse.json({ error: "Failed to parse OpenAI response" }, { status: 500 });
    }

    // Vérifier slug unique
    const { data: existing } = await supabaseAdmin
      .from("articles")
      .select("slug")
      .eq("slug", articleData.slug)
      .single();

    if (existing) {
      articleData.slug = `${articleData.slug}-${Date.now()}`;
    }

    // Insérer dans Supabase
    const { data: article, error: insertError } = await supabaseAdmin
      .from("articles")
      .insert({
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt,
        content: articleData.content,
        category: articleData.category,
        tags: articleData.tags,
        author: "Équipe Rekaire",
        read_time: articleData.read_time || 5,
        meta_title: articleData.meta_title,
        meta_description: articleData.meta_description,
        keywords: articleData.keywords,
        featured: false,
        published: true,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Blog Generate] Insert error:", insertError);
      return NextResponse.json({ error: "Failed to save article", details: insertError }, { status: 500 });
    }

    console.log("[Blog Generate] Article created:", article.slug);

    return NextResponse.json({
      success: true,
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        category: article.category,
        url: `/blog/${article.slug}`,
      },
    });

  } catch (error) {
    console.error("[Blog Generate] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Blog generation API ready",
    topics: TOPICS.length,
    categories: CATEGORIES,
  });
}
