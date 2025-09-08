-- Script de mise à jour incrémentale pour Mianava Dashboard
-- Ce script ajoute seulement les nouvelles fonctionnalités sans recréer les tables existantes

-- Fonction pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN NEW.email = 'admin@mianava.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- L'utilisateur existe déjà, on met à jour seulement si c'est admin@mianava.com
    IF NEW.email = 'admin@mianava.com' THEN
      UPDATE public.users 
      SET role = 'admin', updated_at = NOW()
      WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour configurer l'admin
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

-- Fonction pour promouvoir un utilisateur en admin
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

-- Suppression et recréation du trigger pour éviter les conflits
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Fonction pour vérifier et corriger les policies manquantes
CREATE OR REPLACE FUNCTION check_and_fix_policies()
RETURNS void AS $$
BEGIN
  -- Vérifier et créer les policies pour les catégories si elles n'existent pas
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'categories' 
    AND policyname = 'Admin can manage categories'
  ) THEN
    CREATE POLICY "Admin can manage categories" ON categories 
    FOR ALL USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
    );
    RAISE NOTICE 'Policy "Admin can manage categories" créée';
  END IF;

  -- Vérifier et créer les policies pour les marques si elles n'existent pas
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'brands' 
    AND policyname = 'Admin can manage brands'
  ) THEN
    CREATE POLICY "Admin can manage brands" ON brands 
    FOR ALL USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
    );
    RAISE NOTICE 'Policy "Admin can manage brands" créée';
  END IF;

  RAISE NOTICE 'Vérification des policies terminée';
END;
$$ LANGUAGE plpgsql;

-- Exécuter la vérification des policies
SELECT check_and_fix_policies();

-- Supprimer la fonction temporaire
DROP FUNCTION check_and_fix_policies();

-- Configurer automatiquement l'admin s'il existe
SELECT setup_admin_user();

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Mise à jour du schéma terminée!';
  RAISE NOTICE '🔧 Fonctions admin ajoutées/mises à jour';
  RAISE NOTICE '⚡ Trigger handle_new_user configuré';
  RAISE NOTICE '👑 admin@mianava.com configuré automatiquement';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Fonctions disponibles:';
  RAISE NOTICE '   - setup_admin_user() : Configure admin@mianava.com';
  RAISE NOTICE '   - promote_user_to_admin(email) : Promeut un utilisateur';
END
$$;
