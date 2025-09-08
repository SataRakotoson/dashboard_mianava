'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService, AuthUser } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Mode développement : créer un utilisateur factice si aucun utilisateur n'est connecté
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    // Vérifier l'état d'authentification au chargement
    authService.getCurrentUser()
      .then((user) => {
        if (mounted) {
          if (!user && isDevelopment) {
            // En mode développement, créer un utilisateur factice
            console.log('Mode développement : Création d\'un utilisateur factice')
            setUser({
              id: 'dev-user',
              email: 'admin@mianava.com',
              fullName: 'Administrateur Dev',
              role: 'admin',
              avatarUrl: undefined,
            })
          } else {
            setUser(user)
          }
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la vérification de l\'authentification:', error)
        if (mounted) {
          if (isDevelopment) {
            // En mode développement, créer un utilisateur factice même en cas d'erreur
            console.log('Mode développement : Création d\'un utilisateur factice après erreur')
            setUser({
              id: 'dev-user',
              email: 'admin@mianava.com',
              fullName: 'Administrateur Dev',
              role: 'admin',
              avatarUrl: undefined,
            })
          } else {
            setUser(null)
          }
          setLoading(false)
        }
      })

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      if (mounted) {
        setUser(user)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      await authService.signIn(email, password)
      const user = await authService.getCurrentUser()
      setUser(user)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true)
    try {
      await authService.signUp(email, password, fullName)
      // L'utilisateur sera défini via onAuthStateChange
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await authService.signOut()
      setUser(null)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    try {
      await authService.updateProfile(updates)
      // Recharger l'utilisateur pour obtenir les données mises à jour
      const updatedUser = await authService.getCurrentUser()
      setUser(updatedUser)
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook pour vérifier si l'utilisateur est connecté (SANS redirection automatique)
export function useRequireAuth() {
  const { user, loading } = useAuth()
  
  return { 
    user, 
    loading, 
    isAuthenticated: !loading && !!user,
    hasError: !loading && !user
  }
}

// Hook pour vérifier si l'utilisateur est admin (SANS redirection automatique)
export function useRequireAdmin() {
  const { user, loading } = useAuth()
  
  const isAdmin = user && ['admin', 'manager'].includes(user.role)
  
  return { 
    user, 
    loading, 
    isAdmin: !loading && isAdmin,
    hasError: !loading && !isAdmin,
    isAuthenticated: !loading && !!user
  }
}
