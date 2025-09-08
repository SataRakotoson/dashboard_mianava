'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'

const products = [
  {
    id: '1',
    name: 'Robe d\'été Zara',
    sku: 'ZAR-ROB-001',
    category: 'Vêtements',
    brand: 'Zara',
    price: 49.99,
    stock: 25,
    status: 'Actif',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&h=100&fit=crop&crop=center',
  },
  {
    id: '2',
    name: 'Parfum Chanel N°5',
    sku: 'CHA-PAR-005',
    category: 'Parfums',
    brand: 'Chanel',
    price: 139.99,
    stock: 12,
    status: 'Actif',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&h=100&fit=crop&crop=center',
  },
  {
    id: '3',
    name: 'Sneakers Nike Air',
    sku: 'NIK-SNE-101',
    category: 'Chaussures',
    brand: 'Nike',
    price: 124.99,
    stock: 8,
    status: 'Stock faible',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop&crop=center',
  },
  {
    id: '4',
    name: 'Sac à main Hermès',
    sku: 'HER-SAC-201',
    category: 'Accessoires',
    brand: 'Hermès',
    price: 1249.99,
    stock: 3,
    status: 'Stock faible',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop&crop=center',
  },
  {
    id: '5',
    name: 'T-shirt H&M Basic',
    sku: 'HM-TSH-301',
    category: 'Vêtements',
    brand: 'H&M',
    price: 12.99,
    stock: 0,
    status: 'Rupture',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop&crop=center',
  },
]

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-100 text-green-800'
      case 'Stock faible':
        return 'bg-yellow-100 text-yellow-800'
      case 'Rupture':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Produits</h2>
          <p className="text-gray-600">Gérez votre catalogue de produits</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
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
                    Catégorie
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
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={product.image}
                          alt={product.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      €{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock} unités
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
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
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un nouveau produit"
        maxWidth="2xl"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nom du produit" placeholder="Ex: Robe d'été" />
            <Input label="SKU" placeholder="Ex: ROB-001" />
            <Input label="Prix (€)" type="number" placeholder="0.00" />
            <Input label="Prix comparé (€)" type="number" placeholder="0.00" />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Description du produit..."
              />
            </div>
            <Input label="Catégorie" placeholder="Sélectionner une catégorie" />
            <Input label="Marque" placeholder="Sélectionner une marque" />
            <Input label="Quantité en stock" type="number" placeholder="0" />
            <Input label="Poids (kg)" type="number" step="0.1" placeholder="0.0" />
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer le produit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
