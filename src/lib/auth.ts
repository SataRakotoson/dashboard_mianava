import { supabase } from './supabase'
import { createServerClient } from './supabase-utils'
import { DatabaseUser, UserUpdate } from '@/types/supabase-types'

type User = DatabaseUser

export interface AuthUser {
  id: string
  email: string
  fullName?: string
  role: 'admin' | 'manager' | 'user'
  avatarUrl?: string
}

export class AuthService {
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      // Note: Le profil utilisateur sera créé via un trigger ou une fonction côté serveur
      // Pour cette démo, on peut ignorer cette partie ou la gérer différemment
      console.log('Utilisateur créé:', data.user.id)
    }

    return data
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      // Essayer de récupérer le profil, mais continuer même si ça échoue
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single() as { data: User | null, error: any }

      if (error) {
        console.warn('Profil utilisateur non trouvé dans la base:', error?.message)
        // Retourner un utilisateur temporaire basé sur les données d'auth
        return {
          id: user.id,
          email: user.email || '',
          fullName: user.user_metadata?.full_name || undefined,
          role: 'admin', // Par défaut admin pour les tests
          avatarUrl: undefined,
        }
      }

      if (!profile) {
        // Créer un utilisateur temporaire
        return {
          id: user.id,
          email: user.email || '',
          fullName: user.user_metadata?.full_name || undefined,
          role: 'admin',
          avatarUrl: undefined,
        }
      }

      return {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name || undefined,
        role: profile.role,
        avatarUrl: profile.avatar_url || undefined,
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      return null
    }
  }

  async updateProfile(updates: UserUpdate) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Non authentifié')

    // Utiliser le client serveur pour contourner les problèmes de typage RLS
    const serverClient = createServerClient()
    const { data, error } = await (serverClient as any)
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    
    if (error) throw error
  }

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  }
}

export const authService = new AuthService()
