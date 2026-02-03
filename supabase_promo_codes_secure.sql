-- ============================================
-- REKAIRE - Supabase Schema: Promo Codes
-- Table pour gérer les codes promotionnels
-- VERSION SÉCURISÉE avec protections race conditions
-- ============================================

-- Créer la table des codes promo
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0 AND discount_value <= 100000),
  active BOOLEAN DEFAULT true,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  max_uses INTEGER CHECK (max_uses IS NULL OR max_uses > 0),
  current_uses INTEGER DEFAULT 0 CHECK (current_uses >= 0),
  min_order NUMERIC(10, 2) CHECK (min_order IS NULL OR min_order >= 0),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Contraintes de sécurité
  CONSTRAINT valid_percentage CHECK (
    discount_type != 'percentage' OR (discount_value >= 0 AND discount_value <= 100)
  ),
  CONSTRAINT valid_dates CHECK (
    valid_from IS NULL OR valid_until IS NULL OR valid_from <= valid_until
  )
);

-- Index pour recherche rapide par code
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(active);
CREATE INDEX IF NOT EXISTS idx_promo_codes_dates ON promo_codes(valid_from, valid_until) WHERE active = true;

-- 🔒 Fonction SÉCURISÉE pour incrémenter l'usage (avec vérification atomique)
CREATE OR REPLACE FUNCTION increment_promo_usage(promo_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_updated INTEGER;
BEGIN
  -- Incrémentation atomique SEULEMENT si under max_uses
  UPDATE promo_codes
  SET current_uses = current_uses + 1
  WHERE id = promo_id
    AND active = true
    AND (max_uses IS NULL OR current_uses < max_uses);
  
  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  
  -- Retourne true si l'incrémentation a réussi
  RETURN rows_updated > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- 🔒 SÉCURITÉ : Row Level Security (RLS)
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Autoriser SEULEMENT la lecture des codes actifs (empêche découverte codes désactivés)
DROP POLICY IF EXISTS "Promo codes are viewable by everyone" ON promo_codes;
CREATE POLICY "Only active promo codes are viewable"
  ON promo_codes FOR SELECT
  USING (active = true);

-- 🔒 EMPÊCHER les modifications directes (sauf via fonction RPC)
DROP POLICY IF EXISTS "Allow increment_promo_usage function" ON promo_codes;
CREATE POLICY "No direct updates allowed"
  ON promo_codes FOR UPDATE
  USING (false); -- Personne ne peut UPDATE directement

-- 🔒 EMPÊCHER les insertions/suppressions publiques
CREATE POLICY "No public insert" ON promo_codes FOR INSERT WITH CHECK (false);
CREATE POLICY "No public delete" ON promo_codes FOR DELETE USING (false);

-- 🔒 Table d'audit des utilisations (tracking fraude)
CREATE TABLE IF NOT EXISTS promo_code_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID REFERENCES promo_codes(id),
  order_id VARCHAR(255),
  customer_email VARCHAR(255),
  discount_amount NUMERIC(10, 2),
  ip_address INET,
  user_agent TEXT,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_promo_usage_log_code ON promo_code_usage_log(promo_code_id);
CREATE INDEX idx_promo_usage_log_email ON promo_code_usage_log(customer_email);
CREATE INDEX idx_promo_usage_log_date ON promo_code_usage_log(used_at);

-- 🔒 Fonction pour logger l'utilisation (anti-fraude)
CREATE OR REPLACE FUNCTION log_promo_usage(
  p_promo_code_id UUID,
  p_order_id VARCHAR(255),
  p_customer_email VARCHAR(255),
  p_discount_amount NUMERIC(10, 2),
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO promo_code_usage_log (
    promo_code_id,
    order_id,
    customer_email,
    discount_amount,
    ip_address,
    user_agent
  ) VALUES (
    p_promo_code_id,
    p_order_id,
    p_customer_email,
    p_discount_amount,
    p_ip_address,
    p_user_agent
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🔒 Vue pour détecter la fraude (multiples usages même email)
CREATE OR REPLACE VIEW promo_fraud_detection AS
SELECT 
  customer_email,
  promo_code_id,
  COUNT(*) as usage_count,
  SUM(discount_amount) as total_discount,
  MIN(used_at) as first_use,
  MAX(used_at) as last_use
FROM promo_code_usage_log
GROUP BY customer_email, promo_code_id
HAVING COUNT(*) > 1
ORDER BY usage_count DESC;

-- ============================================
-- 🔒 INSTRUCTIONS SÉCURISÉES
-- ============================================
-- 
-- ✅ Activer/Désactiver un code (ADMIN uniquement via service_role):
-- UPDATE promo_codes SET active = false WHERE code = 'REKAIRE12';
-- 
-- ✅ Créer un nouveau code:
-- INSERT INTO promo_codes (code, discount_type, discount_value, active, description)
-- VALUES ('PROMO20', 'fixed', 20, true, 'Réduction de 20€');
-- 
-- ✅ Voir les statistiques:
-- SELECT code, current_uses, max_uses, active FROM promo_codes;
--
-- ✅ Détecter la fraude:
-- SELECT * FROM promo_fraud_detection WHERE usage_count > 3;
--
-- ✅ Audit trail d'un code:
-- SELECT * FROM promo_code_usage_log 
-- WHERE promo_code_id = (SELECT id FROM promo_codes WHERE code = 'REKAIRE12')
-- ORDER BY used_at DESC;
--
