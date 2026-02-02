-- ============================================
-- REKAIRE - Table Leads (Supabase)
-- Exécuter dans Supabase SQL Editor
-- ============================================

-- Table leads pour capturer tous les contacts
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
  source TEXT DEFAULT 'checkout', -- checkout, popup, newsletter, etc.
  last_order_id TEXT,
  converted BOOLEAN DEFAULT FALSE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherches rapides
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_converted ON leads(converted);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Service role peut tout faire
CREATE POLICY "Service role can manage leads" ON leads
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Fonction pour marquer un lead comme converti
CREATE OR REPLACE FUNCTION mark_lead_converted(lead_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE leads
  SET converted = TRUE, updated_at = NOW()
  WHERE email = lead_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
