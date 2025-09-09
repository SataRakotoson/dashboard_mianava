import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

// Client Supabase pour le côté client (avec clé anonyme)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes pour le client')
}

export const supabase: SupabaseClient<Database> = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)

// Fonction pour créer un client côté serveur avec les cookies
export function createClient(cookieStore: ReadonlyRequestCookies) {
  return createSupabaseClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: false
      }
    }
  )
}
