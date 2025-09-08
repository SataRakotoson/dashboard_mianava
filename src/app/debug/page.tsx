'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function DebugPage() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Debug - État de l'authentification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">État actuel :</h3>
              <p className="text-sm text-gray-600">
                <strong>Loading :</strong> {loading ? 'Oui' : 'Non'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Utilisateur :</strong> {user ? 'Connecté' : 'Non connecté'}
              </p>
            </div>

            {user && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Informations utilisateur :</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm text-gray-800">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <Button onClick={() => window.location.href = '/admin/login'}>
                Aller à la page de connexion
              </Button>
              <Button onClick={() => window.location.href = '/admin'}>
                Aller au dashboard
              </Button>
              {user && (
                <Button variant="outline" onClick={signOut}>
                  Se déconnecter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
