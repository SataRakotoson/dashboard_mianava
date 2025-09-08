'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function TestDatabasePage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testCategories = async () => {
    setLoading(true)
    try {
      console.log('🔍 Test de récupération des catégories...')
      const response = await fetch('/api/test/categories')
      const data = await response.json()
      
      setResults({
        type: 'GET Categories',
        success: response.ok,
        status: response.status,
        data
      })
      
      console.log('Résultat:', data)
    } catch (error) {
      console.error('Erreur:', error)
      setResults({
        type: 'GET Categories',
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      })
    } finally {
      setLoading(false)
    }
  }

  const testCreateCategory = async () => {
    setLoading(true)
    try {
      console.log('🔍 Test de création de catégorie...')
      const testData = {
        name: 'Catégorie Test',
        slug: 'categorie-test-' + Date.now(),
        description: 'Test de création depuis l\'interface',
        sort_order: 999,
        is_active: true
      }

      const response = await fetch('/api/test/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })
      
      const data = await response.json()
      
      setResults({
        type: 'POST Category',
        success: response.ok,
        status: response.status,
        data,
        requestData: testData
      })
      
      console.log('Résultat:', data)
    } catch (error) {
      console.error('Erreur:', error)
      setResults({
        type: 'POST Category',
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      })
    } finally {
      setLoading(false)
    }
  }

  const testDatabaseConnection = async () => {
    setLoading(true)
    try {
      console.log('🔍 Test de connexion à la base...')
      const response = await fetch('/api/debug/connection')
      
      if (response.ok) {
        const data = await response.json()
        setResults({
          type: 'Connection Test',
          success: true,
          status: response.status,
          data
        })
      } else {
        const errorText = await response.text()
        setResults({
          type: 'Connection Test',
          success: false,
          status: response.status,
          error: errorText
        })
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      setResults({
        type: 'Connection Test',
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test de Base de Données</h1>
          <p className="text-gray-600">Diagnostiquer les problèmes de connexion et d'API</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button 
            onClick={testDatabaseConnection}
            disabled={loading}
            className="h-12"
          >
            {loading ? 'Test...' : 'Test Connexion'}
          </Button>
          
          <Button 
            onClick={testCategories}
            disabled={loading}
            className="h-12"
          >
            {loading ? 'Test...' : 'Lire Catégories'}
          </Button>

          <Button 
            onClick={testCreateCategory}
            disabled={loading}
            className="h-12"
          >
            {loading ? 'Test...' : 'Créer Catégorie'}
          </Button>
        </div>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {results.success ? '✅' : '❌'} 
                {results.type}
                {results.status && (
                  <span className={`text-sm px-2 py-1 rounded ${
                    results.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {results.status}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.requestData && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Données envoyées:</h4>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                      {JSON.stringify(results.requestData, null, 2)}
                    </pre>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    {results.success ? 'Réponse:' : 'Erreur:'}
                  </h4>
                  <pre className={`p-3 rounded text-sm overflow-auto ${
                    results.success ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    {JSON.stringify(results.data || results.error, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instructions de Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Variables d'environnement</h4>
              <p className="text-sm text-gray-600 mb-2">
                Copiez <code>.env.example</code> vers <code>.env.local</code> et configurez:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• <code>NEXT_PUBLIC_SUPABASE_URL</code></li>
                <li>• <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                <li>• <code>SUPABASE_SERVICE_ROLE_KEY</code></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Schéma de base de données</h4>
              <p className="text-sm text-gray-600">
                Exécutez le fichier <code>supabase-schema.sql</code> dans votre console Supabase.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Permissions RLS</h4>
              <p className="text-sm text-gray-600">
                Vérifiez que les policies RLS sont correctement configurées.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
