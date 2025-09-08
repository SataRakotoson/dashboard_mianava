import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Client Supabase pour le côté client (avec clé anonyme)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes pour le client')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
