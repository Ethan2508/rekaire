// ============================================
// REKAIRE - API: Génération automatique d'articles
// Appelé par Zapier pour créer des articles avec OpenAI
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity";
import OpenAI from "openai";

// Secret pour sécuriser l'endpoint
const ZAPIER_SECRET = process.env.ZAPIER_SECRET || "rk-zapier-2026-secret";

// Topics pour la génération d'articles
const TOPICS = [
  "Statistiques sur les incendies domestiques en France : 300 000 incendies par an, 25-30% d'origine électrique, 10 000 blessés, plus de 500 décès",
  "Comment protéger efficacement son tableau électrique des risques d'incendie avec un dispositif automatique",
  "Les dangers des incendies nocturnes : 70% des incendies mortels se déclarent la nuit pendant le sommeil",
  "Pourquoi 75% des entreprises ferment définitivement après un incendie majeur",
  "Comparaison entre le RK01 et les extincteurs classiques : avantages de l'automatisation",
  "Réglementation incendie pour les professionnels et obligations légales en France",
  "Protéger son camping-car, van aménagé ou bateau des départs de feu électrique",
  "Les gestes qui sauvent en cas de départ de feu d'origine électrique",
  "Guide pratique : où et comment installer le RK01 pour une protection optimale",
  "Prévention incendie en cuisine : la deuxième cause d'incendie domestique",
  "Les risques électriques dans les maisons anciennes et comment s'en protéger",
  "Témoignages : ces familles sauvées grâce à la prévention incendie",
  "L'importance des détecteurs de fumée et leur complémentarité avec le RK01",
  "Incendies en entreprise : coûts, conséquences et solutions de prévention",
  "Les 5 zones les plus à risque dans une maison et comment les sécuriser",
];

// Catégories possibles
const CATEGORIES = [
  "statistiques",
  "prevention", 
  "tutoriels",
  "reglementation",
  "comparatifs",
  "conseils-maison",
  "entreprises",
  "actualites",
];

export async function POST(request: NextRequest) {
  try {
    // Vérifier le secret
    const body = await request.json();
    const { secret } = body;

    if (secret !== ZAPIER_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid secret" },
        { status: 401 }
      );
    }

    // Vérifier la clé OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json(
        { error: "Configuration error", message: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Initialiser OpenAI
    const openai = new OpenAI({ apiKey: openaiKey });

    // Choisir un topic au hasard
    const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

    console.log("[Blog Generate] Topic choisi:", randomTopic);

    // Générer l'article avec OpenAI
    const prompt = `Tu es un rédacteur expert en sécurité incendie pour Rekaire, une entreprise française qui vend le RK01.

Le RK01 est un dispositif révolutionnaire d'extinction automatique des départs de feu :
- Prix : 70€ HT (60€ HT à partir de 2 unités)
- Activation automatique à 68°C
- Durée de vie : 5 ans sans entretien
- Certifié CE, poudre ABC
- Installation sans outils
- Fonctionne sans électricité ni batterie

SUJET DE L'ARTICLE : ${randomTopic}

Génère un article de blog SEO-optimisé en français. RÉPONDS UNIQUEMENT avec ce JSON valide (sans texte avant/après, sans markdown) :

{"title":"Titre accrocheur de 50-70 caractères","slug":"titre-en-minuscules-avec-tirets-sans-accents","excerpt":"Résumé accrocheur de 150-200 caractères pour la preview","category":"${randomCategory}","tags":["tag1","tag2","tag3","tag4","tag5"],"contentMarkdown":"## Introduction\\n\\nParagraphe d'introduction captivant de 2-3 phrases.\\n\\n## Premier sous-titre\\n\\nContenu détaillé avec **mots en gras** importants et des statistiques.\\n\\n## Deuxième sous-titre\\n\\nAutre section avec des listes :\\n- Point 1\\n- Point 2\\n- Point 3\\n\\n## Le RK01 : une solution efficace\\n\\nMention naturelle du produit et ses avantages.\\n\\n## Conclusion\\n\\nRésumé et appel à l'action.","metaTitle":"Titre SEO de 50-60 caractères | Rekaire","metaDescription":"Description SEO de 150-160 caractères pour Google avec mots-clés importants.","keywords":["mot-clé 1","mot-clé 2","mot-clé 3"],"readTime":5}

RÈGLES STRICTES :
- Article de 800-1200 mots dans contentMarkdown
- Utilise ## pour les titres H2, ### pour H3
- Utilise **gras** pour l'emphase
- Mentionne le RK01 naturellement (pas de façon forcée)
- Inclus des statistiques réelles sur les incendies
- Ton professionnel mais accessible
- Le slug doit être en minuscules, sans accents, avec des tirets
- JSON valide uniquement, pas de texte autour`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Tu es un assistant qui génère du contenu JSON valide uniquement. Ne jamais ajouter de texte avant ou après le JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error("OpenAI n'a pas retourné de contenu");
    }

    console.log("[Blog Generate] Réponse OpenAI reçue");

    // Parser le JSON
    let articleData;
    try {
      // Nettoyer la réponse (enlever les éventuels backticks markdown)
      const cleanedResponse = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      articleData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("[Blog Generate] Erreur parsing JSON:", parseError);
      console.error("[Blog Generate] Réponse brute:", responseText);
      return NextResponse.json(
        { error: "Parse error", message: "Impossible de parser la réponse OpenAI", raw: responseText },
        { status: 500 }
      );
    }

    // Créer l'article dans Sanity
    const now = new Date().toISOString();
    
    const sanityDocument = {
      _type: "article",
      title: articleData.title,
      slug: {
        _type: "slug",
        current: articleData.slug,
      },
      excerpt: articleData.excerpt,
      category: articleData.category,
      tags: articleData.tags || [],
      contentMarkdown: articleData.contentMarkdown,
      metaTitle: articleData.metaTitle,
      metaDescription: articleData.metaDescription,
      keywords: articleData.keywords || [],
      author: "Équipe Rekaire",
      readTime: articleData.readTime || 5,
      source: "zapier-openai",
      aiPrompt: `Topic: ${randomTopic}`,
      generatedAt: now,
      needsReview: true,
      status: "draft",
      publishedAt: now,
    };

    const createdArticle = await sanityWriteClient.create(sanityDocument);

    console.log("[Blog Generate] Article créé:", createdArticle._id);

    return NextResponse.json({
      success: true,
      message: "Article généré et créé avec succès",
      article: {
        id: createdArticle._id,
        title: articleData.title,
        slug: articleData.slug,
        category: articleData.category,
        status: "draft",
        needsReview: true,
      },
      studioUrl: `https://rekaire.sanity.studio/structure/article;${createdArticle._id}`,
    });

  } catch (error) {
    console.error("[Blog Generate] Erreur:", error);
    return NextResponse.json(
      { 
        error: "Generation failed", 
        message: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

// GET pour tester que l'endpoint existe
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/blog/generate",
    method: "POST",
    description: "Génère automatiquement un article de blog avec OpenAI et le publie dans Sanity",
    usage: {
      secret: "Requis dans le body JSON",
      example: { secret: "votre-secret" },
    },
  });
}
