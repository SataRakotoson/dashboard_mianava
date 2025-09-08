'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const isDev = process.env.NEXT_PUBLIC_IS_DEV === 'true'

  useEffect(() => {
    // Debug information en console.log
    const debugInfo = `
État de l'application:
- Loading: ${loading}
- User: ${user ? 'Connecté' : 'Non connecté'}
- User role: ${user?.role || 'Aucun'}
- Timestamp: ${new Date().toLocaleTimeString()}
    `
    console.log(debugInfo)
    
    // PLUS DE REDIRECTION AUTOMATIQUE - L'utilisateur choisit où aller
    console.log('État actuel:', { user, role: user?.role, loading })
  }, [user, loading])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">M</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Mianava</h1>
          <p className="text-gray-600">Accédez à votre espace de travail</p>
        </div>

        {/* Carte principale */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {loading ? (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Chargement de l'application...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Message de bienvenue */}
              <div className="text-center">
                {user ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-green-600 text-xl">✓</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Bienvenue, {user.email}</h2>
                    <p className="text-gray-600">Vous êtes connecté en tant que {user.role}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-blue-600 text-xl">👋</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Bonjour !</h2>
                    <p className="text-gray-600">Connectez-vous pour accéder à votre dashboard</p>
                  </div>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="space-y-3">
                {!user ? (
                  <button 
                    onClick={() => router.push('/login')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <span>🔐</span>
                    <span>Se connecter</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => router.push('/admin')}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <span>⚡</span>
                    <span>Accéder au Dashboard</span>
                  </button>
                )}

                {/* Bouton debug (seulement en dev) */}
                {isDev && (
                  <button 
                    onClick={() => router.push('/debug')}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-200"
                  >
                    <span>🔧</span>
                    <span>Page de debug</span>
                  </button>
                )}
              </div>

              {/* Informations supplémentaires */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  {isDev ? 'Mode développement activé' : 'Mode production'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2025 Dashboard Mianava. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  )
}
