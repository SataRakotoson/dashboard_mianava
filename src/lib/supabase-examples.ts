// Exemples d'utilisation des clients Supabase
// Ce fichier est à des fins de documentation uniquement

import { supabase } from './supabase'
import { createServerClient } from './supabase-utils'

// ❌ MAUVAIS : Ne pas utiliser le client serveur côté client
// const serverClient = createServerClient() // Erreur si utilisé côté client

// ✅ BON : Utiliser le client client pour l'authentification
export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// ✅ BON : Utiliser le client client pour les opérations publiques
export async function getPublicProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
  return { data, error }
}

// ✅ BON : Utiliser le client serveur dans les API routes
export async function createUserServerSide(userData: any) {
  // Cette fonction ne doit être appelée que côté serveur
  const serverClient = createServerClient()
  
  const { data, error } = await serverClient
    .from('users')
    .insert([userData])
    .select()
    .single()
    
  return { data, error }
}

// ✅ BON : Utiliser le client serveur pour les opérations administratives
export async function getAllUsersServerSide() {
  // Cette fonction ne doit être appelée que côté serveur
  const serverClient = createServerClient()
  
  const { data, error } = await serverClient
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    
  return { data, error }
}

// ✅ BON : Pattern pour les API routes
export async function handleApiRequest() {
  try {
    // Utiliser le client serveur dans les API routes
    const serverClient = createServerClient()
    
    const { data, error } = await serverClient
      .from('products')
      .select('*')
      
    if (error) throw error
    
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
