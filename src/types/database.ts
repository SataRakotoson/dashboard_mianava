export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'manager' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'manager' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'manager' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
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
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      brands: {
        Row: {
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
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
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
          dimensions: Json | null
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
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          sku: string
          price: number
          compare_price?: number | null
          cost_price?: number | null
          category_id: string
          brand_id?: string | null
          images?: string[]
          tags?: string[]
          weight?: number | null
          dimensions?: Json | null
          inventory_quantity?: number
          track_inventory?: boolean
          allow_backorder?: boolean
          is_digital?: boolean
          is_active?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          sku?: string
          price?: number
          compare_price?: number | null
          cost_price?: number | null
          category_id?: string
          brand_id?: string | null
          images?: string[]
          tags?: string[]
          weight?: number | null
          dimensions?: Json | null
          inventory_quantity?: number
          track_inventory?: boolean
          allow_backorder?: boolean
          is_digital?: boolean
          is_active?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          name: string
          sku: string
          price: number
          compare_price: number | null
          cost_price: number | null
          inventory_quantity: number
          attributes: Json
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          sku: string
          price: number
          compare_price?: number | null
          cost_price?: number | null
          inventory_quantity?: number
          attributes?: Json
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          sku?: string
          price?: number
          compare_price?: number | null
          cost_price?: number | null
          inventory_quantity?: number
          attributes?: Json
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          details?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
