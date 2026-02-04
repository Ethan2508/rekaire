-- ============================================
-- REKAIRE - Créer l'utilisateur Admin dans Supabase Auth
-- À exécuter dans Supabase SQL Editor
-- ============================================

-- ⚠️ IMPORTANT: Remplacer 'VOTRE_MOT_DE_PASSE_TEMPORAIRE' par un mot de passe réel
-- Exemple: ChangeMeLater123!

-- Supprimer l'utilisateur s'il existe déjà (pour réinitialiser)
DELETE FROM auth.users WHERE email = 'contact@rekaire.fr';

-- Créer l'utilisateur admin avec email vérifié
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'contact@rekaire.fr',
  crypt('VOTRE_MOT_DE_PASSE_TEMPORAIRE', gen_salt('bf')), -- ⚠️ CHANGER ICI
  NOW(), -- Email déjà confirmé
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin Rekaire"}',
  NOW(),
  NOW(),
  '', -- Pas besoin de token de confirmation
  '',
  '',
  ''
);

-- Vérifier que l'utilisateur a bien été créé
SELECT email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'contact@rekaire.fr';

-- ✅ TERMINÉ !
-- Maintenant le Magic Link fonctionnera pour contact@rekaire.fr
