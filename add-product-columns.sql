-- Script pour ajouter les nouvelles colonnes à la table products

-- Ajouter la colonne extra_details (texte long)
ALTER TABLE products 
ADD COLUMN extra_details TEXT;

-- Ajouter les colonnes booléennes avec valeurs par défaut
ALTER TABLE products 
ADD COLUMN is_flash_sale BOOLEAN DEFAULT FALSE;

ALTER TABLE products 
ADD COLUMN is_new BOOLEAN DEFAULT FALSE;

ALTER TABLE products 
ADD COLUMN is_match_li BOOLEAN DEFAULT FALSE;

-- Ajouter des commentaires pour documenter les colonnes
COMMENT ON COLUMN products.extra_details IS 'Détails supplémentaires du produit (texte long)';
COMMENT ON COLUMN products.is_flash_sale IS 'Indique si le produit est en vente flash';
COMMENT ON COLUMN products.is_new IS 'Indique si le produit est nouveau';
COMMENT ON COLUMN products.is_match_li IS 'Indique si le produit est en match li';

-- Mettre à jour les produits existants si nécessaire
-- (les valeurs par défaut seront appliquées automatiquement)
