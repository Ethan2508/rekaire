-- ============================================
-- REKAIRE - Security Hardening for RLS Policies
-- Exécuter dans Supabase SQL Editor
-- ============================================

-- 🔒 SÉCURITÉ: Bloquer l'accès direct aux codes promo depuis le client
-- ============================================

-- Activer RLS sur promo_codes si pas déjà fait
ALTER TABLE IF EXISTS promo_codes ENABLE ROW LEVEL SECURITY;

-- Supprimer toutes les policies existantes sur promo_codes
DROP POLICY IF EXISTS "Public read access" ON promo_codes;
DROP POLICY IF EXISTS "Anyone can read promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Service role only for promo_codes" ON promo_codes;

-- 🔒 NOUVELLE POLICY: Seul le service_role peut accéder aux promo codes
CREATE POLICY "Service role only for promo_codes" ON promo_codes
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 🔒 SÉCURITÉ: Fonction SQL pour incrémenter promo usage (atomique)
-- ============================================

-- Fonction pour incrémenter l'utilisation d'un code promo de manière atomique
CREATE OR REPLACE FUNCTION increment_promo_usage(promo_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE promo_codes 
  SET current_uses = current_uses + 1
  WHERE id = promo_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 🔒 SÉCURITÉ: Fonction pour logger l'utilisation des promos (audit)
-- ============================================

-- Table pour auditer l'utilisation des codes promo
CREATE TABLE IF NOT EXISTS promo_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID REFERENCES promo_codes(id),
  order_id VARCHAR(50),
  customer_email VARCHAR(255),
  discount_amount INTEGER,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_promo_usage_promo_id ON promo_usage_log(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_usage_email ON promo_usage_log(customer_email);
CREATE INDEX IF NOT EXISTS idx_promo_usage_created ON promo_usage_log(created_at DESC);

-- RLS sur promo_usage_log
ALTER TABLE promo_usage_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only for promo_usage_log" ON promo_usage_log;
CREATE POLICY "Service role only for promo_usage_log" ON promo_usage_log
  FOR ALL USING (auth.role() = 'service_role');

-- Fonction pour logger l'utilisation
CREATE OR REPLACE FUNCTION log_promo_usage(
  p_promo_code_id UUID,
  p_order_id VARCHAR(50),
  p_customer_email VARCHAR(255),
  p_discount_amount INTEGER,
  p_ip_address VARCHAR(45),
  p_user_agent TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO promo_usage_log (
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

-- ============================================
-- 🔒 SÉCURITÉ: Bloquer l'accès public aux tables sensibles
-- ============================================

-- S'assurer que les tables sensibles sont protégées
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS invoice_sequence ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 🔒 SÉCURITÉ: Fonction pour détecter les fraudes de codes promo
-- ============================================

-- Vue pour détecter les utilisations suspectes de codes promo
CREATE OR REPLACE VIEW promo_fraud_detection AS
SELECT 
  customer_email,
  COUNT(*) as usage_count,
  COUNT(DISTINCT promo_code_id) as different_codes_used,
  SUM(discount_amount) as total_discounts,
  MAX(created_at) as last_usage,
  ARRAY_AGG(DISTINCT ip_address) as ip_addresses
FROM promo_usage_log
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY customer_email
HAVING COUNT(*) > 3 OR COUNT(DISTINCT promo_code_id) > 2;

-- ✅ TERMINÉ !
-- Les codes promo ne sont plus accessibles depuis le client
-- Toute validation passe par l'API serveur /api/promo/validate
