import { useState, useCallback } from 'react'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface ApiOperations<T, CreateData, UpdateData> {
  state: ApiState<T[]>
  create: (data: CreateData) => Promise<boolean>
  update: (id: string, data: Partial<UpdateData>) => Promise<boolean>
  remove: (id: string) => Promise<boolean>
  reload: () => Promise<void>
}

export function useApiCrud<T, CreateData = any, UpdateData = any>(
  endpoint: string
): ApiOperations<T, CreateData, UpdateData> {
  const [state, setState] = useState<ApiState<T[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const handleApiCall = useCallback(async (apiCall: () => Promise<Response>) => {
    try {
      const response = await apiCall()
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Une erreur est survenue')
      }
      return response
    } catch (error) {
      console.error('Erreur API:', error)
      setState(prev => ({ ...prev, error: error instanceof Error ? error.message : 'Erreur inconnue' }))
      throw error
    }
  }, [])

  const reload = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const response = await handleApiCall(() => fetch(endpoint))
      const result = await response.json()
      
      // Détecter automatiquement la clé de données (categories, brands, etc.)
      const dataKey = Object.keys(result).find(key => Array.isArray(result[key]))
      const data = dataKey ? result[dataKey] : result
      
      setState(prev => ({ ...prev, data, loading: false }))
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [endpoint, handleApiCall])

  const create = useCallback(async (data: CreateData): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }))
      await handleApiCall(() => 
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      )
      await reload()
      return true
    } catch (error) {
      return false
    }
  }, [endpoint, handleApiCall, reload])

  const update = useCallback(async (id: string, data: Partial<UpdateData>): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }))
      await handleApiCall(() => 
        fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...data }),
        })
      )
      await reload()
      return true
    } catch (error) {
      return false
    }
  }, [endpoint, handleApiCall, reload])

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }))
      await handleApiCall(() => fetch(`${endpoint}?id=${id}`, { method: 'DELETE' }))
      await reload()
      return true
    } catch (error) {
      return false
    }
  }, [endpoint, handleApiCall, reload])

  return {
    state,
    create,
    update,
    remove,
    reload,
  }
}

// Hook spécialisé pour les catégories
export function useCategories() {
  return useApiCrud('/api/admin/categories')
}

// Hook spécialisé pour les marques
export function useBrands() {
  return useApiCrud('/api/admin/brands')
}

// Hook spécialisé pour les produits
export function useProducts() {
  return useApiCrud('/api/admin/products')
}

// Hook spécialisé pour les variants d'un produit
export function useProductVariants(productId: string) {
  const endpoint = `/api/admin/products/${productId}/variants`
  const variants = useApiCrud(endpoint)
  
  // Override des méthodes pour utiliser les bonnes routes
  const updateVariant = useCallback(async (variantId: string, data: any): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/variants/${variantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du variant')
      }
      
      await variants.reload()
      return true
    } catch (error) {
      console.error('Erreur update variant:', error)
      return false
    }
  }, [variants])

  const removeVariant = useCallback(async (variantId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/variants/${variantId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du variant')
      }
      
      await variants.reload()
      return true
    } catch (error) {
      console.error('Erreur remove variant:', error)
      return false
    }
  }, [variants])

  return {
    ...variants,
    update: updateVariant,
    remove: removeVariant,
  }
}

// Fonction utilitaire pour créer une nouvelle catégorie
export async function createCategory(name: string) {
  try {
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: null,
        image_url: null,
        parent_id: null,
        sort_order: 0,
        is_active: true
      }),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la catégorie')
    }

    const result = await response.json()
    return result.category || result
  } catch (error) {
    console.error('Erreur création catégorie:', error)
    return null
  }
}

// Fonction utilitaire pour créer une nouvelle marque
export async function createBrand(name: string) {
  try {
    const response = await fetch('/api/admin/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: null,
        logo_url: null,
        website_url: null,
        is_active: true
      }),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la marque')
    }

    const result = await response.json()
    return result.brand || result
  } catch (error) {
    console.error('Erreur création marque:', error)
    return null
  }
}