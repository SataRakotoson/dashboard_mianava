'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { Autocomplete } from '@/components/ui/Autocomplete'
import { Checkbox } from '@/components/ui/Checkbox'
import { useProducts, useCategories, useBrands, createCategory, createBrand } from '@/lib/api-hooks'
import ProductVariants from '@/components/ProductVariants'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  PhotoIcon,
  CubeIcon,
} from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  sku: string
  price: number
  compare_price: number | null
  category_id: string
  brand_id: string | null
  images: string[]
  inventory_quantity: number
  is_active: boolean
  extra_details: string | null
  is_flash_sale: boolean
  is_new: boolean
  is_match_li: boolean
  categories?: { name: string }
  brands?: { name: string }
}

interface ProductFormData {
  name: string
  sku: string
  description: string
  price: number
  compare_price: number
  category_id: string
  brand_id: string
  inventory_quantity: number
  weight: number
  images: string[]
  extra_details: string
  is_flash_sale: boolean
  is_new: boolean
  is_match_li: boolean
}

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showingVariants, setShowingVariants] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    description: '',
    price: 0,
    compare_price: 0,
    category_id: '',
    brand_id: '',
    inventory_quantity: 0,
    weight: 0,
    images: [],
    extra_details: '',
    is_flash_sale: false,
    is_new: false,
    is_match_li: false
  })

  const products = useProducts()
  const categories = useCategories()
  const brands = useBrands()

  useEffect(() => {
    products.reload()
    categories.reload()
    brands.reload()
  }, [])

  const getStatusColor = (product: Product) => {
    if (!product.is_active) {
        return 'bg-gray-100 text-gray-800'
    }
    if (product.inventory_quantity === 0) {
      return 'bg-red-100 text-red-800'
    }
    if (product.inventory_quantity < 10) {
      return 'bg-yellow-100 text-yellow-800'
    }
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (product: Product) => {
    if (!product.is_active) return 'Inactif'
    if (product.inventory_quantity === 0) return 'Rupture'
    if (product.inventory_quantity < 10) return 'Stock faible'
    return 'Actif'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const productData = {
      ...formData,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tags: [],
      track_inventory: true,
      allow_backorder: false,
      is_digital: false,
      is_active: true
    }

    let success = false
    if (editingProduct) {
      success = await products.update(editingProduct.id, productData)
    } else {
      success = await products.create(productData)
    }

    if (success) {
      setIsModalOpen(false)
      setEditingProduct(null)
      resetForm()
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      price: product.price,
      compare_price: product.compare_price || 0,
      category_id: product.category_id,
      brand_id: product.brand_id || '',
      inventory_quantity: product.inventory_quantity,
      weight: 0,
      images: product.images || [],
      extra_details: product.extra_details || '',
      is_flash_sale: product.is_flash_sale || false,
      is_new: product.is_new || false,
      is_match_li: product.is_match_li || false
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await products.remove(id)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      description: '',
      price: 0,
      compare_price: 0,
      category_id: '',
      brand_id: '',
      inventory_quantity: 0,
      weight: 0,
      images: [],
      extra_details: '',
      is_flash_sale: false,
      is_new: false,
      is_match_li: false
    })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    resetForm()
  }

  const handleCreateCategory = async (name: string) => {
    const newCategory = await createCategory(name)
    if (newCategory) {
      // Recharger la liste des catégories
      await categories.reload()
      return { id: newCategory.id, name: newCategory.name }
    }
    return null
  }

  const handleCreateBrand = async (name: string) => {
    const newBrand = await createBrand(name)
    if (newBrand) {
      // Recharger la liste des marques
      await brands.reload()
      return { id: newBrand.id, name: newBrand.name }
    }
    return null
  }

  const filteredProducts = (products.state.data as Product[] || []).filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  )

  if (products.state.loading || categories.state.loading || brands.state.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Produits</h2>
          <p className="text-gray-600">Gérez votre catalogue de produits</p>
        </div>
        <Button onClick={() => {
          setEditingProduct(null)
          resetForm()
          setIsModalOpen(true)
        }}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle>Liste des produits ({filteredProducts.length})</CardTitle>
            <div className="flex space-x-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Détails
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product: Product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <>
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                                src={product.images[0]}
                          alt={product.name}
                        />
                              {product.images.length > 1 && (
                                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {product.images.length}
                                </div>
                              )}
                            </>
                          ) : (
                            <PhotoIcon className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brands?.name || 'Aucune marque'}</div>
                          <div className="flex gap-1 mt-1">
                            {product.is_new && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Nouveau
                              </span>
                            )}
                            {product.is_flash_sale && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Flash
                              </span>
                            )}
                            {product.is_match_li && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                Match Li
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600">
                          {product.categories?.name || 'Non classé'}
                        </div>
                        {product.extra_details && (
                          <div className="text-xs text-gray-500 truncate" title={product.extra_details}>
                            {product.extra_details.length > 50 
                              ? `${product.extra_details.substring(0, 50)}...` 
                              : product.extra_details
                            }
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      €{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.inventory_quantity} unités
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product)}`}>
                        {getStatusText(product)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowingVariants(product)} title="Gérer les variants">
                          <CubeIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? "Modifier le produit" : "Ajouter un nouveau produit"}
        maxWidth="2xl"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Nom du produit" 
              placeholder="Ex: Robe d'été" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input 
              label="SKU" 
              placeholder="Ex: ROB-001" 
              value={formData.sku}
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
              required
            />
            <Input 
              label="Prix (€)" 
              type="number" 
              step="0.01"
              placeholder="0.00" 
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
              required
            />
            <Input 
              label="Prix comparé (€)" 
              type="number" 
              step="0.01"
              placeholder="0.00" 
              value={formData.compare_price}
              onChange={(e) => setFormData({...formData, compare_price: parseFloat(e.target.value) || 0})}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                className="text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Description du produit..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Détails supplémentaires (mode d'emploi, tips, etc ...)
            </label>
            <textarea
              rows={4}
              className="text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Informations complémentaires sur le produit..."
              value={formData.extra_details}
              onChange={(e) => setFormData({...formData, extra_details: e.target.value})}
            />
          </div>
            <Autocomplete
              label="Catégorie"
              placeholder="Rechercher ou créer une catégorie..."
              options={(categories.state.data || []).map((category: any) => ({
                id: category.id,
                name: category.name
              }))}
              value={formData.category_id}
              onChange={(value) => setFormData({...formData, category_id: value})}
              onCreateNew={handleCreateCategory}
              required
              createNewLabel="Créer la catégorie"
            />
            <Autocomplete
              label="Marque"
              placeholder="Rechercher ou créer une marque..."
              options={(brands.state.data || []).map((brand: any) => ({
                id: brand.id,
                name: brand.name
              }))}
              value={formData.brand_id}
              onChange={(value) => setFormData({...formData, brand_id: value})}
              onCreateNew={handleCreateBrand}
              createNewLabel="Créer la marque"
            />
            <Input 
              label="Quantité en stock" 
              type="number" 
              placeholder="0" 
              value={formData.inventory_quantity}
              onChange={(e) => setFormData({...formData, inventory_quantity: parseInt(e.target.value) || 0})}
              required
            />
            <Input 
              label="Poids (kg)" 
              type="number" 
              step="0.1" 
              placeholder="0.0" 
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value) || 0})}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images du produit
            </label>
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => setFormData({...formData, images})}
              maxImages={5}
              folder="products"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Options du produit
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Checkbox
                label="Vente Flash"
                checked={formData.is_flash_sale}
                onChange={(checked) => setFormData({...formData, is_flash_sale: checked})}
                description="Produit en promotion temporaire"
              />
              <Checkbox
                label="Nouveau Produit"
                checked={formData.is_new}
                onChange={(checked) => setFormData({...formData, is_new: checked})}
                description="Marquer comme nouveau"
              />
              <Checkbox
                label="Match Li"
                checked={formData.is_match_li}
                onChange={(checked) => setFormData({...formData, is_match_li: checked})}
                description="Produit en match li"
              />
            </div>
          </div>
          
          {products.state.error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {products.state.error}
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button type="submit">
              {editingProduct ? 'Modifier' : 'Créer'} le produit
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal pour gérer les variants */}
      <Modal
        isOpen={!!showingVariants}
        onClose={() => setShowingVariants(null)}
        title="Gestion des variants"
        maxWidth="2xl"
      >
        {showingVariants && (
          <ProductVariants
            productId={showingVariants.id}
            productName={showingVariants.name}
          />
        )}
      </Modal>
    </div>
  )
}
