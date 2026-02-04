-- ============================================
-- REKAIRE - Migration Script (SAFE)
-- Exécuter dans Supabase SQL Editor
-- ============================================

-- 1. Ajouter les colonnes manquantes à orders (si la table existe)
-- ============================================

-- Vérifier si order_number existe, sinon l'ajouter
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_number') THEN
    ALTER TABLE orders ADD COLUMN order_number VARCHAR(50);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tva_amount') THEN
    ALTER TABLE orders ADD COLUMN tva_amount INTEGER DEFAULT 0;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'promo_code') THEN
    ALTER TABLE orders ADD COLUMN promo_code VARCHAR(50);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'promo_discount') THEN
    ALTER TABLE orders ADD COLUMN promo_discount INTEGER DEFAULT 0;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_phone') THEN
    ALTER TABLE orders ADD COLUMN customer_phone VARCHAR(50);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_company') THEN
    ALTER TABLE orders ADD COLUMN customer_company VARCHAR(255);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_address_line1') THEN
    ALTER TABLE orders ADD COLUMN shipping_address_line1 VARCHAR(255);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_address_line2') THEN
    ALTER TABLE orders ADD COLUMN shipping_address_line2 VARCHAR(255);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_postal_code') THEN
    ALTER TABLE orders ADD COLUMN shipping_postal_code VARCHAR(20);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_country') THEN
    ALTER TABLE orders ADD COLUMN shipping_country VARCHAR(10) DEFAULT 'FR';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tracking_number') THEN
    ALTER TABLE orders ADD COLUMN tracking_number VARCHAR(100);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tracking_url') THEN
    ALTER TABLE orders ADD COLUMN tracking_url VARCHAR(500);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipped_at') THEN
    ALTER TABLE orders ADD COLUMN shipped_at TIMESTAMPTZ;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivered_at') THEN
    ALTER TABLE orders ADD COLUMN delivered_at TIMESTAMPTZ;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'invoice_number') THEN
    ALTER TABLE orders ADD COLUMN invoice_number VARCHAR(50);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'invoice_url') THEN
    ALTER TABLE orders ADD COLUMN invoice_url VARCHAR(500);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'invoice_generated_at') THEN
    ALTER TABLE orders ADD COLUMN invoice_generated_at TIMESTAMPTZ;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'notes') THEN
    ALTER TABLE orders ADD COLUMN notes TEXT;
  END IF;
END $$;

-- Générer order_number pour les commandes existantes qui n'en ont pas
UPDATE orders 
SET order_number = 'RK-' || TO_CHAR(created_at, 'YYYYMMDD') || '-' || SUBSTRING(id::text, 1, 4)
WHERE order_number IS NULL;

-- 2. Table des factures (numérotation séquentielle)
-- ============================================
CREATE TABLE IF NOT EXISTS invoice_sequence (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  last_number INTEGER DEFAULT 0,
  UNIQUE(year)
);

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
  INSERT INTO invoice_sequence (year, last_number)
  VALUES (current_year, 0)
  ON CONFLICT (year) DO NOTHING;
  
  UPDATE invoice_sequence 
  SET last_number = last_number + 1 
  WHERE year = current_year
  RETURNING last_number INTO next_num;
  
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

INSERT INTO admin_whitelist (email, name, is_active)
VALUES ('contact@rekaire.fr', 'Admin Rekaire', true)
ON CONFLICT (email) DO NOTHING;

-- 4. Table logs admin (audit)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id VARCHAR(100),
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_log(admin_email);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_log(created_at DESC);

-- 5. Vue des commandes à expédier (recréer)
-- ============================================
DROP VIEW IF EXISTS orders_to_ship;

CREATE VIEW orders_to_ship AS
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

-- 6. Index (si pas déjà créés)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- 7. Trigger updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 8. RLS (sécurité)
-- ============================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_sequence ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Supprimer les policies existantes pour éviter les conflits
DROP POLICY IF EXISTS "Service role only for orders" ON orders;
DROP POLICY IF EXISTS "Service role only for invoice_sequence" ON invoice_sequence;
DROP POLICY IF EXISTS "Read admin whitelist for authenticated" ON admin_whitelist;
DROP POLICY IF EXISTS "Service role write admin whitelist" ON admin_whitelist;
DROP POLICY IF EXISTS "Service role only for audit" ON admin_audit_log;

-- Recréer les policies
CREATE POLICY "Service role only for orders" ON orders
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only for invoice_sequence" ON invoice_sequence
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Read admin whitelist for authenticated" ON admin_whitelist
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Service role write admin whitelist" ON admin_whitelist
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only for audit" ON admin_audit_log
  FOR ALL USING (auth.role() = 'service_role');

-- ✅ TERMINÉ !
-- N'oubliez pas de créer le bucket "invoices" dans Storage (privé)
