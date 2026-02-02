-- ============================================
-- REKAIRE - Table Articles Blog (Supabase)
-- Exécuter dans Supabase SQL Editor
-- ============================================

-- Table articles pour le blog
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- Markdown
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  author TEXT DEFAULT 'Équipe Rekaire',
  read_time INTEGER DEFAULT 5,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherches rapides
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);

-- RLS (Row Level Security)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy: Tout le monde peut lire les articles publiés
CREATE POLICY "Anyone can read published articles" ON articles
  FOR SELECT
  USING (published = TRUE);

-- Policy: Service role peut tout faire
CREATE POLICY "Service role can manage articles" ON articles
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Fonction pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_article_views(article_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE articles
  SET views = views + 1
  WHERE slug = article_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insérer quelques articles de démo
INSERT INTO articles (title, slug, excerpt, content, category, tags, author, read_time, featured, published_at) VALUES
(
  'Incendies électriques en France : les chiffres alarmants',
  'incendies-electriques-france-statistiques',
  'Chaque année, 300 000 incendies domestiques dont 25% d''origine électrique. Découvrez les statistiques et comment vous protéger.',
  '## Les chiffres qui font froid dans le dos

En France, **300 000 incendies domestiques** se déclarent chaque année. Parmi eux, environ **25 à 30%** sont d''origine électrique, ce qui représente près de 80 000 incendies.

### Les conséquences dramatiques

- Plus de **10 000 blessés** par an
- Plus de **500 décès** annuels
- **70% des incendies mortels** se déclarent la nuit

### Les causes principales

1. **Tableaux électriques défectueux** ou surchargés
2. **Prises multiples** en surcharge
3. **Appareils électriques** défaillants
4. **Installations vétustes** non conformes

## Comment se protéger ?

La prévention est essentielle. Le **RK01** offre une protection automatique 24h/24 pour votre tableau électrique. En cas de surchauffe à 90°C, il se déclenche automatiquement et éteint le départ de feu avant qu''il ne se propage.

### Les avantages du RK01

- ✅ Activation automatique sans intervention
- ✅ Fonctionne sans électricité
- ✅ Durée de vie de 5 ans
- ✅ Installation en 30 secondes

## Conclusion

Ne prenez pas de risques avec la sécurité de votre famille. Un investissement de 70€ peut sauver des vies.',
  'Statistiques',
  ARRAY['incendie', 'électrique', 'statistiques', 'prévention', 'sécurité'],
  'Équipe Rekaire',
  5,
  TRUE,
  NOW() - INTERVAL '2 days'
),
(
  'Comment protéger efficacement votre tableau électrique ?',
  'protection-tableau-electrique-guide',
  'Guide complet pour sécuriser votre installation électrique et prévenir les risques d''incendie avec des solutions automatiques.',
  '## Pourquoi le tableau électrique est-il à risque ?

Le tableau électrique est le **cœur de votre installation**. C''est là que transitent tous les circuits de votre habitation. En cas de surcharge ou de court-circuit, c''est souvent là que naît l''incendie.

### Les signes d''alerte à surveiller

- Disjoncteurs qui sautent fréquemment
- Odeur de brûlé près du tableau
- Traces de chaleur ou décoloration
- Bourdonnements inhabituels

## Les solutions de protection

### 1. Vérification de l''installation

Faites contrôler votre installation par un électricien tous les 10 ans, surtout si votre logement a plus de 15 ans.

### 2. Protection automatique avec le RK01

Le **RK01** est un dispositif révolutionnaire qui protège votre tableau 24h/24 :

- **Détection automatique** à 90°C
- **Extinction immédiate** du départ de feu
- **Sans entretien** pendant 5 ans
- **Installation ultra simple** en 30 secondes

### 3. Bonnes pratiques

- Ne surchargez pas les prises multiples
- Remplacez les câbles abîmés
- Installez des détecteurs de fumée

## Conclusion

La combinaison d''une installation aux normes et d''un dispositif de protection automatique comme le RK01 offre une sécurité optimale pour votre foyer.',
  'Prévention',
  ARRAY['tableau électrique', 'protection', 'installation', 'RK01', 'sécurité'],
  'Équipe Rekaire',
  7,
  TRUE,
  NOW() - INTERVAL '5 days'
),
(
  'Installation du RK01 : guide étape par étape',
  'rk01-installation-guide-etapes',
  'Installez votre dispositif RK01 en quelques minutes seulement. Suivez notre tutoriel complet.',
  '## Avant de commencer

L''installation du RK01 est **extrêmement simple** et ne nécessite aucun outil. Comptez environ **2 minutes** pour une installation parfaite.

### Ce dont vous avez besoin

- Votre RK01 (livré avec son adhésif)
- Un chiffon propre pour nettoyer la surface

## Les étapes d''installation

### Étape 1 : Préparation

1. Coupez le disjoncteur principal par sécurité
2. Ouvrez le capot de votre tableau électrique
3. Nettoyez la surface intérieure du capot avec un chiffon sec

### Étape 2 : Positionnement

Le RK01 doit être installé **au centre-haut** du tableau électrique, idéalement sur la face intérieure du capot.

**Important** : La chaleur monte naturellement, c''est pourquoi la position haute est optimale.

### Étape 3 : Fixation

1. Retirez le film protecteur de l''adhésif
2. Positionnez le RK01 à l''endroit choisi
3. Appuyez fermement pendant **30 secondes**

### Étape 4 : Vérification

1. Assurez-vous que le RK01 est bien fixé
2. Refermez le capot du tableau
3. Réenclenchez le disjoncteur principal

## C''est terminé !

Votre installation électrique est maintenant protégée 24h/24. Le RK01 fonctionnera automatiquement en cas de surchauffe, sans aucune intervention de votre part.

### Conseils supplémentaires

- Notez la date d''installation
- Remplacez le RK01 après 5 ans
- Vérifiez occasionnellement qu''il est toujours bien fixé',
  'Tutoriels',
  ARRAY['installation', 'tutoriel', 'RK01', 'guide', 'étapes'],
  'Équipe Rekaire',
  4,
  FALSE,
  NOW() - INTERVAL '10 days'
);
