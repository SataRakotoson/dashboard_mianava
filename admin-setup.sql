-- Script pour configurer l'utilisateur admin@mianava.com
-- Ce script doit être exécuté dans l'éditeur SQL de Supabase

-- ⚠️ IMPORTANT: Exécutez ce script APRÈS avoir créé le compte admin@mianava.com 
-- dans l'interface d'authentification de Supabase

-- 1. Vérifier si l'utilisateur existe déjà dans auth.users
-- (Vous pouvez vérifier cela dans l'onglet Authentication de Supabase)

-- 2. Insérer ou mettre à jour l'utilisateur dans la table users avec le rôle admin
-- Remplacez 'UUID_DE_ADMIN' par l'UUID réel de l'utilisateur auth.users

-- Option A: Si vous connaissez l'UUID de l'utilisateur
/*
INSERT INTO public.users (id, email, full_name, role)
VALUES ('UUID_DE_ADMIN', 'admin@mianava.com', 'Administrateur Mianava', 'admin')
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();
*/

-- Option B: Utiliser l'email pour trouver l'UUID automatiquement
-- Cette option nécessite que l'utilisateur soit déjà créé dans auth.users

-- Fonction pour configurer automatiquement l'admin
CREATE OR REPLACE FUNCTION setup_admin_user()
RETURNS void AS $$
DECLARE
  admin_uuid UUID;
BEGIN
  -- Trouver l'UUID de l'utilisateur admin@mianava.com dans auth.users
  SELECT id INTO admin_uuid 
  FROM auth.users 
  WHERE email = 'admin@mianava.com';
  
  IF admin_uuid IS NULL THEN
    RAISE NOTICE 'Utilisateur admin@mianava.com non trouvé dans auth.users. Créez d''abord le compte via l''interface Supabase.';
    RETURN;
  END IF;
  
  -- Insérer ou mettre à jour dans la table users
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (admin_uuid, 'admin@mianava.com', 'Administrateur Mianava', 'admin')
  ON CONFLICT (id) 
  DO UPDATE SET 
    role = 'admin',
    full_name = 'Administrateur Mianava',
    updated_at = NOW();
    
  RAISE NOTICE 'Utilisateur admin@mianava.com configuré avec le rôle admin. UUID: %', admin_uuid;
END;
$$ LANGUAGE plpgsql;

-- Exécuter la fonction de configuration
SELECT setup_admin_user();

-- Vérifier que l'utilisateur a été configuré correctement
SELECT 
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
FROM public.users 
WHERE email = 'admin@mianava.com';

-- Fonction pour promouvoir un utilisateur existant en admin (par email)
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email TEXT)
RETURNS void AS $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Trouver l'UUID de l'utilisateur dans auth.users
  SELECT id INTO user_uuid 
  FROM auth.users 
  WHERE email = user_email;
  
  IF user_uuid IS NULL THEN
    RAISE NOTICE 'Utilisateur % non trouvé dans auth.users.', user_email;
    RETURN;
  END IF;
  
  -- Mettre à jour le rôle dans la table users
  INSERT INTO public.users (id, email, role)
  VALUES (user_uuid, user_email, 'admin')
  ON CONFLICT (id) 
  DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();
    
  RAISE NOTICE 'Utilisateur % promu admin. UUID: %', user_email, user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Exemples d'utilisation :
-- SELECT promote_user_to_admin('admin@mianava.com');
-- SELECT promote_user_to_admin('manager@mianava.com');

-- Vérifier tous les utilisateurs avec leurs rôles
SELECT 
  u.id,
  u.email,
  pu.full_name,
  pu.role,
  u.created_at as auth_created,
  pu.created_at as profile_created
FROM auth.users u
LEFT JOIN public.users pu ON u.id = pu.id
ORDER BY u.created_at DESC;