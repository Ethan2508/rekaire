-- ============================================
-- REKAIRE - Relance des paniers abandonnés
-- Suivi des 2 emails de relance et désinscription. Idempotent.
-- ============================================

ALTER TABLE leads ADD COLUMN IF NOT EXISTS recovery_1_sent_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS recovery_2_sent_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS unsubscribe_token UUID DEFAULT gen_random_uuid();
UPDATE leads SET unsubscribe_token = gen_random_uuid() WHERE unsubscribe_token IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_unsubscribe_token ON leads(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_leads_updated_at ON leads(updated_at);
