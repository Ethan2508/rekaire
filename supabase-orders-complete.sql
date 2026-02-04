-- ============================================
-- REKAIRE - Schéma complet pour gestion commandes
-- Tables: orders, invoices, admin_whitelist, admin_sessions
-- ============================================

-- 1. Table des commandes (enrichie)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  stripe_session_id VARCHAR(255) UNIQUE,
  stripe_payment_intent VARCHAR(255),
  
  -- Statut commande
  status VARCHAR(50) DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  
  -- Produit
  product_slug VARCHAR(100) NOT NULL DEFAULT 'rk01',
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_ht INTEGER NOT NULL, -- en centimes
  total_ht INTEGER NOT NULL,
  tva_amount INTEGER NOT NULL,
  total_ttc INTEGER NOT NULL,
  promo_code VARCHAR(50),
  promo_discount INTEGER DEFAULT 0,
  
  -- Client
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_company VARCHAR(255),
  
  -- Adresse de livraison
  shipping_address_line1 VARCHAR(255),
  shipping_address_line2 VARCHAR(255),
  shipping_postal_code VARCHAR(20),
  shipping_city VARCHAR(100),
  shipping_country VARCHAR(10) DEFAULT 'FR',
  
  -- Livraison
  tracking_number VARCHAR(100),
  tracking_url VARCHAR(500),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  
  -- Facture
  invoice_number VARCHAR(50) UNIQUE,
  invoice_url VARCHAR(500),
  invoice_generated_at TIMESTAMPTZ,
  
  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- 2. Table des factures (pour numérotation séquentielle)
-- ============================================
CREATE TABLE IF NOT EXISTS invoice_sequence (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  last_number INTEGER DEFAULT 0,
  UNIQUE(year)
);

-- Initialiser l'année courante
INSERT INTO invoice_sequence (year, last_number) 
VALUES (2026, 0)
ON CONFLICT (year) DO NOTHING;

-- Fonction pour obtenir le prochain numéro de facture
CREATE OR REPLACE FUNCTION get_next_invoice_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  current_year INTEGER := EXTRACT(YEAR FROM NOW());
  next_num INTEGER;
  invoice_num VARCHAR(50);
BEGIN
  -- Insérer l'année si elle n'existe pas
  INSERT INTO invoice_sequence (year, last_number)
  VALUES (current_year, 0)
  ON CONFLICT (year) DO NOTHING;
  
  -- Incrémenter et récupérer
  UPDATE invoice_sequence 
  SET last_number = last_number + 1 
  WHERE year = current_year
  RETURNING last_number INTO next_num;
  
  -- Format: FW-2026-0001
  invoice_num := 'FW-' || current_year || '-' || LPAD(next_num::TEXT, 4, '0');
  
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- 3. Table whitelist admin
-- ============================================
CREATE TABLE IF NOT EXISTS admin_whitelist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ajouter l'admin
INSERT INTO admin_whitelist (email, name, is_active)
VALUES ('contact@rekaire.fr', 'Admin Rekaire', true)
ON CONFLICT (email) DO NOTHING;

-- 4. Table logs admin (audit)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50), -- 'order', 'invoice', etc.
  target_id VARCHAR(100),
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_log(admin_email);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_log(created_at DESC);

-- 5. Vue des commandes à expédier
-- ============================================
CREATE OR REPLACE VIEW orders_to_ship AS
SELECT 
  id,
  order_number,
  status,
  customer_name,
  customer_email,
  shipping_address_line1,
  shipping_postal_code,
  shipping_city,
  quantity,
  total_ttc,
  created_at
FROM orders
WHERE status = 'paid'
ORDER BY created_at ASC;

-- 6. RLS Policies
-- ============================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_sequence ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Orders: lecture/écriture via service_role uniquement
CREATE POLICY "Service role only for orders" ON orders
  FOR ALL USING (auth.role() = 'service_role');

-- Invoice sequence: service_role uniquement
CREATE POLICY "Service role only for invoice_sequence" ON invoice_sequence
  FOR ALL USING (auth.role() = 'service_role');

-- Admin whitelist: lecture pour authentifiés, écriture service_role
CREATE POLICY "Read admin whitelist for authenticated" ON admin_whitelist
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Service role write admin whitelist" ON admin_whitelist
  FOR ALL USING (auth.role() = 'service_role');

-- Audit log: service_role uniquement
CREATE POLICY "Service role only for audit" ON admin_audit_log
  FOR ALL USING (auth.role() = 'service_role');

-- 7. Fonction de mise à jour automatique updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 8. Storage bucket pour factures (à créer via Dashboard Supabase)
-- ============================================
-- Créer un bucket "invoices" avec accès privé
-- Les URLs signées seront générées via l'API

