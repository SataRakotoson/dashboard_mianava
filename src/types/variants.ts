export interface ProductVariant {
  id: string
  product_id: string
  name: string
  sku: string
  price: number
  compare_price: number | null
  cost_price: number | null
  inventory_quantity: number
  attributes: VariantAttributes
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface VariantAttributes {
  // Attributs communs
  color?: string
  size?: string
  volume?: string
  material?: string
  
  // Attributs spécifiques par catégorie
  // Pour les vêtements
  fit?: 'slim' | 'regular' | 'oversized'
  
  // Pour les parfums
  concentration?: 'eau-de-toilette' | 'eau-de-parfum' | 'parfum'
  
  // Pour les chaussures
  shoe_size?: string
  
  // Attributs personnalisés
  [key: string]: string | number | boolean | undefined
}

export interface VariantFormData {
  name: string
  sku: string
  price: number
  compare_price: number
  cost_price: number
  inventory_quantity: number
  attributes: VariantAttributes
  image_url: string
  is_active: boolean
}

export interface VariantCreateData extends Omit<VariantFormData, 'id'> {
  product_id: string
}

// Types pour les templates de variants courants
export interface VariantTemplate {
  name: string
  description: string
  attributes: (keyof VariantAttributes)[]
  defaultValues?: Partial<VariantAttributes>
}

// Templates prédéfinis pour différents types de produits
export const VARIANT_TEMPLATES: Record<string, VariantTemplate> = {
  clothing: {
    name: 'Vêtements',
    description: 'Couleur, taille, coupe',
    attributes: ['color', 'size', 'fit'],
    defaultValues: { fit: 'regular' }
  },
  perfume: {
    name: 'Parfum',
    description: 'Volume, concentration',
    attributes: ['volume', 'concentration'],
    defaultValues: { concentration: 'eau-de-toilette' }
  },
  shoes: {
    name: 'Chaussures',
    description: 'Couleur, pointure',
    attributes: ['color', 'shoe_size']
  },
  accessories: {
    name: 'Accessoires',
    description: 'Couleur, matière',
    attributes: ['color', 'material']
  },
  custom: {
    name: 'Personnalisé',
    description: 'Attributs personnalisés',
    attributes: []
  }
}

// Types pour les options d'attributs
export const ATTRIBUTE_OPTIONS = {
  color: [
    'Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Orange', 'Violet',
    'Rose', 'Gris', 'Marron', 'Beige', 'Marine', 'Bordeaux', 'Kaki'
  ],
  size: [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'
  ],
  volume: [
    '30ml', '50ml', '75ml', '100ml', '125ml', '150ml', '200ml'
  ],
  concentration: [
    { value: 'eau-de-toilette', label: 'Eau de Toilette' },
    { value: 'eau-de-parfum', label: 'Eau de Parfum' },
    { value: 'parfum', label: 'Parfum' }
  ],
  fit: [
    { value: 'slim', label: 'Coupe Slim' },
    { value: 'regular', label: 'Coupe Regular' },
    { value: 'oversized', label: 'Coupe Oversized' }
  ],
  material: [
    'Coton', 'Polyester', 'Laine', 'Soie', 'Lin', 'Cuir', 'Daim', 'Denim',
    'Cachemire', 'Viscose', 'Élasthanne', 'Nylon'
  ],
  shoe_size: [
    '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'
  ]
}
