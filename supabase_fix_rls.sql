-- ============================================
-- REKAIRE - Fix RLS pour Codes Promo
-- Exécuter ce script dans Supabase SQL Editor
-- pour permettre la gestion admin des codes promo
-- ============================================

-- Supprimer les anciennes politiques restrictives
DROP POLICY IF EXISTS "No public insert" ON promo_codes;
DROP POLICY IF EXISTS "No public delete" ON promo_codes;
DROP POLICY IF EXISTS "No direct updates allowed" ON promo_codes;
DROP POLICY IF EXISTS "Only active promo codes are viewable" ON promo_codes;

-- ✅ Politique SELECT : tout le monde peut lire les codes actifs
CREATE POLICY "Active promo codes are viewable"
  ON promo_codes FOR SELECT
  USING (is_active = true);

-- ✅ Politique INSERT : seulement via service role (API admin)
-- Le service_role bypasse automatiquement RLS, donc pas besoin de politique spécifique

-- ✅ Politique UPDATE : seulement via service role (API admin)
-- Le service_role bypasse automatiquement RLS

-- ✅ Politique DELETE : seulement via service role (API admin)
-- Le service_role bypasse automatiquement RLS

-- Note: Les opérations INSERT/UPDATE/DELETE ne fonctionnent que via
-- l'API admin qui utilise SUPABASE_SERVICE_ROLE_KEY
-- Le service_role bypasse automatiquement la RLS

-- Vérification que RLS est activée
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'promo_codes';

-- Test: Lister les politiques actuelles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'promo_codes';
