'use client'

import { AdminLayout } from '@/components/layout/AdminLayout'
import { useRequireAdmin } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function AdminLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, isAdmin, hasError, isAuthenticated } = useRequireAdmin()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à cette page.</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Se connecter
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">Permissions insuffisantes</h1>
          <p className="text-gray-600 mb-2">Vous êtes connecté en tant que :</p>
          <p className="text-lg font-semibold text-gray-800 mb-2">{user?.email}</p>
          <p className="text-sm text-gray-500 mb-6">Rôle : {user?.role}</p>
          <p className="text-gray-600 mb-6">Seuls les administrateurs et managers peuvent accéder à cette zone.</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Changer de compte
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <AdminLayout>{children}</AdminLayout>
}
