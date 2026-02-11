// ============================================
// REKAIRE - API: Génération automatique d'articles
// Génère des articles avec OpenAI, stocke dans Supabase
// Appelé par Vercel Cron (lundi et jeudi à 10h)
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

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

// Fonction principale de génération
async function generateArticle(customTopic?: string) {
    // Vérifier la clé OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return { error: "OpenAI API key not configured", status: 500 };
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
          content: `Tu es un rédacteur SEO expert en sécurité incendie pour Rekaire.

PRODUIT RK01 :
- Dispositif d'extinction automatique pour tableaux électriques
- Prix : 75€ HT (90€ TTC)
- Activation automatique à 170°C
- Durée de vie : 5 ans sans entretien
- Installation en quelques secondes, sans outils
- Fonctionne sans électricité ni batterie

RÈGLES DE RÉDACTION :
- Utilise UNIQUEMENT ## pour les titres (pas de ###)
- Chaque section doit avoir 2-4 paragraphes
- Utilise des listes à puces avec tirets -
- Mets en **gras** les chiffres et mots importants
- Sépare bien chaque paragraphe avec une ligne vide
- Écris en français courant, pas de jargon`
        },
        {
          role: "user",
          content: `SUJET : ${topic}
CATÉGORIE : ${category}

Écris un article de blog optimisé SEO. RÉPONDS UNIQUEMENT avec ce JSON :

{
  "title": "Titre accrocheur (50-65 caractères max)",
  "slug": "titre-sans-accents-en-minuscules",
  "excerpt": "Résumé captivant de 150-180 caractères qui donne envie de lire",
  "category": "${category}",
  "tags": ["sécurité incendie", "protection électrique", "prévention", "RK01", "extincteur automatique"],
  "content": "## Introduction\\n\\nParagraphe d'accroche...",
  "meta_title": "Titre SEO optimisé avec mot-clé | Rekaire",
  "meta_description": "Description SEO de 155 caractères avec mots-clés principaux pour Google",
  "keywords": ["incendie électrique", "protection tableau électrique", "extincteur automatique", "RK01", "sécurité incendie"],
  "read_time": 5
}

IMPORTANT : 
- Article de 800-1000 mots
- 5-6 sections avec titres ## uniquement
- Chaque section = 2-4 paragraphes + liste si pertinent
- Statistiques réelles sur les incendies en France
- Mentionne le RK01 dans UNE SEULE section`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    // Parser le JSON
    let articleData;
    try {
      const cleanJson = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      articleData = JSON.parse(cleanJson);
    } catch {
      console.error("[Blog Generate] Parse error:", responseText);
      return { error: "Failed to parse OpenAI response", status: 500 };
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
      return { error: "Failed to save article", details: insertError, status: 500 };
    }

    console.log("[Blog Generate] Article created:", article.slug);

    return {
      success: true,
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        category: article.category,
        url: `/blog/${article.slug}`,
      },
    };
}

// GET: Appelé par Vercel Cron
export async function GET(request: NextRequest) {
  // Vérifier le CRON_SECRET (Vercel envoie Authorization: Bearer <secret>)
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  
  // 🔒 SÉCURITÉ: Vérifier que CRON_SECRET existe ET correspond
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await generateArticle();
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 500 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Blog Generate] Cron error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Appel manuel (protégé par CRON_SECRET)
export async function POST(request: NextRequest) {
  // 🔒 SÉCURITÉ: Authentification requise
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const body = await request.json().catch(() => ({}));
    const { topic: customTopic } = body;

    const result = await generateArticle(customTopic);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status || 500 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Blog Generate] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
