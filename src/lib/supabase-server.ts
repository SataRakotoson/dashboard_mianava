import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Client Supabase pour le côté serveur (avec service role)
// Ce fichier ne doit être utilisé que côté serveur (API routes, Server Components, etc.)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Variables d\'environnement Supabase manquantes pour le serveur')
}

// Vérifier que nous sommes côté serveur
if (typeof window !== 'undefined') {
  throw new Error('supabaseAdmin ne doit être utilisé que côté serveur')
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
