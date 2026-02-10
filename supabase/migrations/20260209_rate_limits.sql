-- ============================================
-- REKAIRE - Migration: Rate Limits + Sécurité
-- Exécuter dans Supabase SQL Editor
-- ============================================

-- Table pour le rate limiting persistant
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour le nettoyage automatique
CREATE INDEX IF NOT EXISTS idx_rate_limits_expires 
ON rate_limits(expires_at);

-- Fonction RPC pour vérifier et incrémenter atomiquement
-- SÉCURISÉ: utilise make_interval au lieu de concaténation string
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_key TEXT,
  p_max_requests INTEGER,
  p_window_ms INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_now TIMESTAMPTZ := NOW();
  v_expires_at TIMESTAMPTZ;
  v_count INTEGER;
  v_allowed BOOLEAN;
  v_window_interval INTERVAL;
BEGIN
  -- Calculer l'intervalle de manière sécurisée (pas de concaténation SQL)
  v_window_interval := make_interval(secs => p_window_ms / 1000.0);
  v_expires_at := v_now + v_window_interval;
  
  -- Tenter de récupérer l'entrée existante
  SELECT count, expires_at INTO v_count, v_expires_at
  FROM rate_limits
  WHERE key = p_key
  FOR UPDATE;
  
  IF NOT FOUND THEN
    -- Nouvelle entrée
    INSERT INTO rate_limits (key, count, expires_at)
    VALUES (p_key, 1, v_now + v_window_interval);
    
    RETURN json_build_object(
      'allowed', true,
      'remaining', p_max_requests - 1,
      'reset_at', v_now + v_window_interval
    );
  END IF;
  
  -- Vérifier si la fenêtre a expiré
  IF v_expires_at < v_now THEN
    -- Reset le compteur
    UPDATE rate_limits
    SET count = 1, expires_at = v_now + v_window_interval
    WHERE key = p_key
    RETURNING expires_at INTO v_expires_at;
    
    RETURN json_build_object(
      'allowed', true,
      'remaining', p_max_requests - 1,
      'reset_at', v_expires_at
    );
  END IF;
  
  -- Vérifier la limite
  IF v_count >= p_max_requests THEN
    RETURN json_build_object(
      'allowed', false,
      'remaining', 0,
      'reset_at', v_expires_at
    );
  END IF;
  
  -- Incrémenter le compteur
  UPDATE rate_limits
  SET count = count + 1
  WHERE key = p_key;
  
  RETURN json_build_object(
    'allowed', true,
    'remaining', p_max_requests - v_count - 1,
    'reset_at', v_expires_at
  );
END;
$$;

-- Nettoyage automatique des anciennes entrées (sécurisé - service_role only)
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Cette fonction ne peut être appelée que depuis le backend (service_role)
  -- ou directement en SQL par un admin
  DELETE FROM rate_limits
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$;

-- Révoquer l'accès public à la fonction cleanup
REVOKE ALL ON FUNCTION cleanup_rate_limits() FROM PUBLIC;
REVOKE ALL ON FUNCTION cleanup_rate_limits() FROM anon;
REVOKE ALL ON FUNCTION cleanup_rate_limits() FROM authenticated;

-- Nettoyage des logs admin (garder 1 an)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM admin_audit_log
  WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$;

-- Révoquer l'accès public
REVOKE ALL ON FUNCTION cleanup_old_audit_logs() FROM PUBLIC;
REVOKE ALL ON FUNCTION cleanup_old_audit_logs() FROM anon;
REVOKE ALL ON FUNCTION cleanup_old_audit_logs() FROM authenticated;

-- Ajouter colonnes last_ip et last_user_agent à leads si n'existent pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'last_ip'
  ) THEN
    ALTER TABLE leads ADD COLUMN last_ip TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'last_user_agent'
  ) THEN
    ALTER TABLE leads ADD COLUMN last_user_agent TEXT;
  END IF;
END $$;

-- Commentaires
COMMENT ON TABLE rate_limits IS 'Rate limiting persistant pour APIs serverless';
COMMENT ON FUNCTION check_rate_limit IS 'Vérifie et incrémente atomiquement le rate limit';
