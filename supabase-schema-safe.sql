-- Création SÉCURISÉE du schéma de base de données pour Mianava Dashboard
-- Ce script peut être exécuté plusieurs fois sans erreur

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('admin', 'manager', 'user')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des marques
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  sku TEXT UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  weight DECIMAL(8,2),
  dimensions JSONB,
  inventory_quantity INTEGER DEFAULT 0,
  track_inventory BOOLEAN DEFAULT true,
  allow_backorder BOOLEAN DEFAULT false,
  is_digital BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des variantes de produits
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  inventory_quantity INTEGER DEFAULT 0,
  attributes JSONB DEFAULT '{}',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des logs d'activité
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Suppression des triggers existants avant recréation
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_brands_updated_at ON brands;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_product_variants_updated_at ON product_variants;

-- Recréation des triggers pour updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at 
  BEFORE UPDATE ON brands 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at 
  BEFORE UPDATE ON product_variants 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour les performances (CREATE INDEX IF NOT EXISTS n'existe pas, on utilise une approche différente)
DO $$
BEGIN
  -- Index pour products
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_products_category_id' AND n.nspname = 'public') THEN
    CREATE INDEX idx_products_category_id ON products(category_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_products_brand_id' AND n.nspname = 'public') THEN
    CREATE INDEX idx_products_brand_id ON products(brand_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_products_is_active' AND n.nspname = 'public') THEN
    CREATE INDEX idx_products_is_active ON products(is_active);
  END IF;
  
  -- Index pour product_variants
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_product_variants_product_id' AND n.nspname = 'public') THEN
    CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
  END IF;
  
  -- Index pour activity_logs
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_activity_logs_user_id' AND n.nspname = 'public') THEN
    CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_activity_logs_entity_type' AND n.nspname = 'public') THEN
    CREATE INDEX idx_activity_logs_entity_type ON activity_logs(entity_type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_activity_logs_created_at' AND n.nspname = 'public') THEN
    CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
  END IF;
END
$$;

-- Activation du RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Suppression et recréation des policies pour éviter les conflits
-- Policies pour les utilisateurs
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;

CREATE POLICY "Users can view their own profile" ON users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can view all users" ON users 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Policies pour les catégories
DROP POLICY IF EXISTS "Authenticated users can view categories" ON categories;
DROP POLICY IF EXISTS "Admin can manage categories" ON categories;

CREATE POLICY "Authenticated users can view categories" ON categories 
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage categories" ON categories 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Policies pour les marques
DROP POLICY IF EXISTS "Authenticated users can view brands" ON brands;
DROP POLICY IF EXISTS "Admin can manage brands" ON brands;

CREATE POLICY "Authenticated users can view brands" ON brands 
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage brands" ON brands 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Policies pour les produits
DROP POLICY IF EXISTS "Authenticated users can view products" ON products;
DROP POLICY IF EXISTS "Admin can manage products" ON products;

CREATE POLICY "Authenticated users can view products" ON products 
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage products" ON products 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Policies pour les variantes de produits
DROP POLICY IF EXISTS "Authenticated users can view product variants" ON product_variants;
DROP POLICY IF EXISTS "Admin can manage product variants" ON product_variants;

CREATE POLICY "Authenticated users can view product variants" ON product_variants 
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage product variants" ON product_variants 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Policies pour les logs d'activité
DROP POLICY IF EXISTS "Admin can view activity logs" ON activity_logs;
DROP POLICY IF EXISTS "System can insert activity logs" ON activity_logs;

CREATE POLICY "Admin can view activity logs" ON activity_logs 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "System can insert activity logs" ON activity_logs 
  FOR INSERT WITH CHECK (true);

-- Insertion de données de test (uniquement si elles n'existent pas)
-- Catégories
INSERT INTO categories (name, slug, description) 
SELECT 'Vêtements', 'vetements', 'Toute la mode masculine et féminine'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'vetements');

INSERT INTO categories (name, slug, description) 
SELECT 'Parfums', 'parfums', 'Parfums et eaux de toilette'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'parfums');

INSERT INTO categories (name, slug, description) 
SELECT 'Accessoires', 'accessoires', 'Accessoires de mode et bijoux'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'accessoires');

INSERT INTO categories (name, slug, description) 
SELECT 'Chaussures', 'chaussures', 'Chaussures pour tous les styles'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'chaussures');

-- Marques
INSERT INTO brands (name, slug, description) 
SELECT 'Zara', 'zara', 'Mode accessible et tendance'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE slug = 'zara');

INSERT INTO brands (name, slug, description) 
SELECT 'H&M', 'hm', 'Mode pour toute la famille'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE slug = 'hm');

INSERT INTO brands (name, slug, description) 
SELECT 'Chanel', 'chanel', 'Luxe et élégance française'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE slug = 'chanel');

INSERT INTO brands (name, slug, description) 
SELECT 'Nike', 'nike', 'Sport et lifestyle'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE slug = 'nike');

INSERT INTO brands (name, slug, description) 
SELECT 'Adidas', 'adidas', 'Performance et style'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE slug = 'adidas');

-- Fonction pour créer un log d'activité
CREATE OR REPLACE FUNCTION log_activity(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_details)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Suppression et recréation du trigger pour éviter les conflits
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Schéma Mianava Dashboard installé/mis à jour avec succès!';
  RAISE NOTICE '📊 Tables: users, categories, brands, products, product_variants, activity_logs';
  RAISE NOTICE '🔐 RLS activé avec policies configurées';
  RAISE NOTICE '⚡ Triggers et fonctions installés';
  RAISE NOTICE '👑 admin@mianava.com sera automatiquement configuré en admin';
END
$$;
