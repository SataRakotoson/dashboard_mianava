'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, user, loading } = useAuth()
  const router = useRouter()

  // Afficher l'état de connexion sans redirection automatique
  useEffect(() => {
    if (!loading) {
      if (user && ['admin', 'manager'].includes(user.role)) {
        console.log('Utilisateur déjà connecté en tant qu\'admin:', user.email)
      } else if (user) {
        console.log('Utilisateur connecté mais pas admin:', user.email, user.role)
      } else {
        console.log('Aucun utilisateur connecté')
      }
    }
  }, [user, loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await signIn(email, password)
      console.log('Connexion réussie, redirection manuelle vers /admin')
      router.push('/admin')
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la connexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="ml-3 text-3xl font-bold text-gray-900">Mianava</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Dashboard Administration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous pour accéder au panneau d'administration
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion Administrateur</CardTitle>
          </CardHeader>
          <CardContent>
            {!loading && user && ['admin', 'manager'].includes(user.role) && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Vous êtes déjà connecté en tant qu'admin ({user.email})</p>
                    <button 
                      onClick={() => router.push('/admin')}
                      className="mt-2 text-green-600 hover:text-green-800 underline hover:no-underline font-medium"
                    >
                      Aller au dashboard →
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {!loading && user && !['admin', 'manager'].includes(user.role) && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm mb-4 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Permissions insuffisantes</p>
                    <p className="text-xs mt-1">Vous êtes connecté en tant que '{user.role}' mais vous n'avez pas les droits admin.</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Erreur de connexion</p>
                      <p className="text-xs mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <Input
                label="Adresse email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@mianava.com"
              />

              <Input
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={!email || !password}
              >
                Se connecter au dashboard
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Accès réservé aux administrateurs autorisés
              </p>
              <button 
                onClick={() => router.push('/')}
                className="mt-2 text-sm text-blue-600 hover:text-blue-500 underline"
              >
                Retour à l'accueil
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
