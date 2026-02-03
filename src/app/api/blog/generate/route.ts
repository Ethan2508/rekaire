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
          content: `Tu es un rédacteur SEO expert en sécurité incendie pour Rekaire.

PRODUIT RK01 :
- Dispositif d'extinction automatique pour tableaux électriques
- Prix : 70€ HT (60€ HT dès 2 unités)
- Activation automatique à 90°C
- Durée de vie : 5 ans sans entretien
- Installation en 30 secondes, sans outils
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
  "content": "## Introduction\\n\\nParagraphe d'accroche avec une statistique choc. Présentation du sujet.\\n\\nDeuxième paragraphe qui explique l'importance du sujet.\\n\\n## Les chiffres clés en France\\n\\nEn France, **300 000 incendies domestiques** se déclarent chaque année. Parmi eux :\\n\\n- **25 à 30%** sont d'origine électrique\\n- **70%** des incendies mortels se déclarent la nuit\\n- Plus de **10 000 blessés** et **500 décès** par an\\n\\nCes statistiques montrent l'importance de la prévention.\\n\\n## Les causes principales des incendies électriques\\n\\nLes incendies d'origine électrique proviennent souvent de :\\n\\n- Tableaux électriques défectueux ou surchargés\\n- Prises multiples en surcharge\\n- Câbles endommagés ou vétustes\\n- Appareils défaillants laissés branchés\\n\\nUne installation non conforme multiplie les risques.\\n\\n## Comment se protéger efficacement\\n\\nLa prévention passe par plusieurs mesures :\\n\\n- Faire vérifier son installation par un professionnel\\n- Ne pas surcharger les prises électriques\\n- Installer des détecteurs de fumée\\n- Utiliser des dispositifs de protection automatique\\n\\nLa protection du tableau électrique est essentielle car c'est souvent le point de départ des incendies.\\n\\n## Le RK01 : une protection automatique 24h/24\\n\\nLe RK01 est un dispositif d'extinction automatique conçu pour les tableaux électriques. Ses avantages :\\n\\n- **Activation automatique** à 90°C sans intervention\\n- **Installation en 30 secondes** sans outils\\n- **Durée de vie de 5 ans** sans entretien\\n- Fonctionne **sans électricité ni batterie**\\n\\nÀ partir de **70€ HT**, c'est un investissement minime pour protéger votre famille et vos biens.\\n\\n## Conclusion\\n\\nLes incendies électriques représentent un danger réel mais évitable. En combinant bonnes pratiques et équipements de protection comme le RK01, vous réduisez considérablement les risques.",
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
