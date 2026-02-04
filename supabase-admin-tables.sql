-- ============================================
-- REKAIRE - Table Audit Log Admin
-- À exécuter dans Supabase SQL Editor
-- ============================================

-- Table pour l'historique des actions admin
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT,
    target_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_email ON admin_audit_log(admin_email);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);

-- RLS: Seuls les admins peuvent voir les logs
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Lecture pour les utilisateurs authentifiés (filtrée côté app)
CREATE POLICY "Authenticated users can read audit logs"
    ON admin_audit_log
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Insertion pour service_role seulement
CREATE POLICY "Service role can insert audit logs"
    ON admin_audit_log
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Permettre aussi à authenticated d'insérer (pour le client-side logging)
CREATE POLICY "Authenticated can insert audit logs"
    ON admin_audit_log
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Vérifier que la table promo_codes a tous les champs nécessaires
-- Si elle n'existe pas, la créer
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'promo_codes') THEN
        CREATE TABLE promo_codes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            code TEXT UNIQUE NOT NULL,
            discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
            discount_value INTEGER NOT NULL,
            active BOOLEAN DEFAULT true,
            valid_from TIMESTAMPTZ DEFAULT NOW(),
            valid_until TIMESTAMPTZ,
            max_uses INTEGER,
            current_uses INTEGER DEFAULT 0,
            min_order INTEGER,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Index sur le code
        CREATE UNIQUE INDEX idx_promo_codes_code ON promo_codes(code);
    END IF;
END $$;

-- Ajouter current_uses si elle n'existe pas
ALTER TABLE promo_codes ADD COLUMN IF NOT EXISTS current_uses INTEGER DEFAULT 0;

-- Ajouter min_order si elle n'existe pas
ALTER TABLE promo_codes ADD COLUMN IF NOT EXISTS min_order INTEGER;

COMMENT ON TABLE admin_audit_log IS 'Historique des actions administrateur pour audit et traçabilité';
COMMENT ON TABLE promo_codes IS 'Codes promotionnels avec gestion des limites et validité';
