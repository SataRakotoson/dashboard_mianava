// Types Supabase simplifiés et fonctionnels
export interface DatabaseUser {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'admin' | 'manager' | 'user'
  created_at: string
  updated_at: string
}

export interface DatabaseProduct {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  sku: string
  price: number
  compare_price: number | null
  cost_price: number | null
  category_id: string
  brand_id: string | null
  images: string[]
  tags: string[]
  weight: number | null
  dimensions: any | null
  inventory_quantity: number
  track_inventory: boolean
  allow_backorder: boolean
  is_digital: boolean
  is_active: boolean
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
}

export interface DatabaseCategory {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DatabaseBrand {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  website_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Types pour les insertions (champs optionnels)
export type UserInsert = Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

export type ProductInsert = Omit<DatabaseProduct, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

// Types pour les mises à jour (tous les champs optionnels)
export type UserUpdate = Partial<Omit<DatabaseUser, 'id' | 'created_at'>>
export type ProductUpdate = Partial<Omit<DatabaseProduct, 'id' | 'created_at'>>
