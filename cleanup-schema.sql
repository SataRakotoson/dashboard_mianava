-- Script de nettoyage pour Mianava Dashboard
-- ⚠️ ATTENTION: Ce script supprime TOUTES les données et structures!
-- Utilisez uniquement si vous voulez repartir de zéro

-- Confirmation avant exécution
DO $$
BEGIN
  RAISE NOTICE '⚠️  ATTENTION: Ce script va supprimer toutes les données!';
  RAISE NOTICE '💾 Assurez-vous d''avoir une sauvegarde si nécessaire.';
  RAISE NOTICE '🚀 Après ce script, exécutez supabase-schema-safe.sql';
END
$$;

-- Suppression des triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_brands_updated_at ON brands;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_product_variants_updated_at ON product_variants;

-- Suppression des fonctions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS log_activity(UUID, TEXT, TEXT, UUID, JSONB);
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS setup_admin_user();
DROP FUNCTION IF EXISTS promote_user_to_admin(TEXT);

-- Suppression des policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "Authenticated users can view categories" ON categories;
DROP POLICY IF EXISTS "Admin can manage categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can view brands" ON brands;
DROP POLICY IF EXISTS "Admin can manage brands" ON brands;
DROP POLICY IF EXISTS "Authenticated users can view products" ON products;
DROP POLICY IF EXISTS "Admin can manage products" ON products;
DROP POLICY IF EXISTS "Authenticated users can view product variants" ON product_variants;
DROP POLICY IF EXISTS "Admin can manage product variants" ON product_variants;
DROP POLICY IF EXISTS "Admin can view activity logs" ON activity_logs;
DROP POLICY IF EXISTS "System can insert activity logs" ON activity_logs;

-- Suppression des tables (ordre important à cause des contraintes)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Suppression des index (s'ils existent encore)
DROP INDEX IF EXISTS idx_products_category_id;
DROP INDEX IF EXISTS idx_products_brand_id;
DROP INDEX IF EXISTS idx_products_is_active;
DROP INDEX IF EXISTS idx_product_variants_product_id;
DROP INDEX IF EXISTS idx_activity_logs_user_id;
DROP INDEX IF EXISTS idx_activity_logs_entity_type;
DROP INDEX IF EXISTS idx_activity_logs_created_at;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '🧹 Nettoyage terminé!';
  RAISE NOTICE '📝 Vous pouvez maintenant exécuter supabase-schema-safe.sql';
END
$$;
