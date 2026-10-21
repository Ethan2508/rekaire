-- ============================================
-- REKAIRE - Table leads (capture des emails saisis dans le tunnel de commande)
-- Idempotent : peut être rejouée sans risque.
-- ============================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  is_company BOOLEAN DEFAULT FALSE,
  company_name TEXT,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  source TEXT DEFAULT 'checkout',
  last_order_id TEXT,
  converted BOOLEAN DEFAULT FALSE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  last_ip TEXT,
  last_user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Colonnes utilisées par /api/lead, ajoutées si la table existait sans elles
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_ip TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_user_agent TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_converted ON leads(converted);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- Accès réservé au serveur (clé service role) : aucune lecture publique
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage leads" ON leads;
CREATE POLICY "Service role can manage leads" ON leads
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION mark_lead_converted(lead_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE leads SET converted = TRUE, updated_at = NOW() WHERE email = lead_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
