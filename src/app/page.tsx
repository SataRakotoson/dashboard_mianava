'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    // Debug information
    const info = `
État de l'application:
- Loading: ${loading}
- User: ${user ? 'Connecté' : 'Non connecté'}
- User role: ${user?.role || 'Aucun'}
- Timestamp: ${new Date().toLocaleTimeString()}
    `
    setDebugInfo(info)
    
    // PLUS DE REDIRECTION AUTOMATIQUE - L'utilisateur choisit où aller
    console.log('État actuel:', { user, role: user?.role, loading })
  }, [user, loading])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Mianava</h1>
        
        <div className="space-y-4">
          {loading && (
            <div className="mb-4">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Chargement de l'application...</p>
            </div>
          )}
          
          <div className="text-left bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Informations de debug :</h3>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">{debugInfo}</pre>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-600">Choisissez votre destination :</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <button 
                onClick={() => router.push('/debug')}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg active:scale-95 font-medium"
              >
                📊 Page de debug
              </button>
              <button 
                onClick={() => router.push('/login')}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 hover:shadow-lg active:scale-95 font-medium"
              >
                🔐 Se connecter
              </button>
              {user && (
                <button 
                  onClick={() => router.push('/admin')}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:shadow-lg active:scale-95 font-medium"
                >
                  ⚡ Dashboard Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
