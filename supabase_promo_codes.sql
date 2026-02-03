-- ============================================
-- REKAIRE - Supabase Schema: Promo Codes
-- Table pour gérer les codes promotionnels
-- ============================================

-- Créer la table des codes promo
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  active BOOLEAN DEFAULT true,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  min_order NUMERIC(10, 2),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide par code
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(active);

-- Fonction pour incrémenter l'usage d'un code promo
CREATE OR REPLACE FUNCTION increment_promo_usage(promo_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE promo_codes
  SET current_uses = current_uses + 1
  WHERE id = promo_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insérer le code REKAIRE12 (-10%)
INSERT INTO promo_codes (
  code,
  discount_type,
  discount_value,
  active,
  description
) VALUES (
  'REKAIRE12',
  'percentage',
  10,
  true,
  'Code promo -10% pour nouveaux clients'
) ON CONFLICT (code) DO NOTHING;

-- Politique RLS (Row Level Security) - Lecture publique, écriture admin uniquement
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Autoriser la lecture publique (pour validation côté client)
CREATE POLICY "Promo codes are viewable by everyone"
  ON promo_codes FOR SELECT
  USING (true);

-- Autoriser l'incrémentation d'usage par fonction RPC
CREATE POLICY "Allow increment_promo_usage function"
  ON promo_codes FOR UPDATE
  USING (true);

-- ============================================
-- INSTRUCTIONS D'UTILISATION
-- ============================================
-- 
-- Pour activer/désactiver un code:
-- UPDATE promo_codes SET active = false WHERE code = 'REKAIRE12';
-- 
-- Pour créer un nouveau code:
-- INSERT INTO promo_codes (code, discount_type, discount_value, active, description)
-- VALUES ('PROMO20', 'fixed', 20, true, 'Réduction de 20€');
-- 
-- Pour voir les statistiques:
-- SELECT code, current_uses, max_uses, active FROM promo_codes;
--
