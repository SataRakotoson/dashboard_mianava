import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Fonction utilitaire pour créer un client Supabase côté serveur
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Variables d\'environnement Supabase manquantes pour le serveur')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Fonction utilitaire pour créer un client Supabase côté client
export function createClientClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Variables d\'environnement Supabase manquantes pour le client')
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}
