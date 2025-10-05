'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { useProductVariants } from '@/lib/api-hooks'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SwatchIcon,
  TagIcon,
  CubeIcon,
} from '@heroicons/react/24/outline'
import { ProductVariant, VariantFormData, VariantAttributes, VARIANT_TEMPLATES, ATTRIBUTE_OPTIONS } from '@/types/variants'

interface ProductVariantsProps {
  productId: string
  productName: string
}

export default function ProductVariants({ productId, productName }: ProductVariantsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom')
  const [formData, setFormData] = useState<VariantFormData>({
    name: '',
    sku: '',
    price: 0,
    compare_price: 0,
    cost_price: 0,
    inventory_quantity: 0,
    attributes: {},
    image_url: '',
    is_active: true
  })
  const [variantImages, setVariantImages] = useState<string[]>([])

  const variants = useProductVariants(productId)

  useEffect(() => {
    variants.reload()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Utiliser la première image du tableau ou une chaîne vide
    const variantData = {
      ...formData,
      image_url: variantImages.length > 0 ? variantImages[0] : '',
      product_id: productId
    }
    
    let success = false
    if (editingVariant) {
      success = await variants.update(editingVariant.id, variantData)
    } else {
      success = await variants.create(variantData)
    }

    if (success) {
      handleCloseModal()
    }
  }

  const handleEdit = (variant: ProductVariant) => {
    setEditingVariant(variant)
    setFormData({
      name: variant.name,
      sku: variant.sku,
      price: variant.price,
      compare_price: variant.compare_price || 0,
      cost_price: variant.cost_price || 0,
      inventory_quantity: variant.inventory_quantity,
      attributes: variant.attributes || {},
      image_url: variant.image_url || '',
      is_active: variant.is_active
    })
    // Charger l'image existante dans le tableau
    setVariantImages(variant.image_url ? [variant.image_url] : [])
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce variant ?')) {
      await variants.remove(id)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      price: 0,
      compare_price: 0,
      cost_price: 0,
      inventory_quantity: 0,
      attributes: {},
      image_url: '',
      is_active: true
    })
    setVariantImages([])
    setSelectedTemplate('custom')
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingVariant(null)
    resetForm()
  }

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey)
    const template = VARIANT_TEMPLATES[templateKey]
    if (template.defaultValues) {
      setFormData(prev => ({
        ...prev,
        attributes: { ...prev.attributes, ...template.defaultValues }
      }))
    }
  }

  const updateAttribute = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: value
      }
    }))
  }

  const removeAttribute = (key: string) => {
    setFormData(prev => {
      const newAttributes = { ...prev.attributes }
      delete newAttributes[key]
      return {
        ...prev,
        attributes: newAttributes
      }
    })
  }

  const renderAttributeField = (attributeKey: string) => {
    const options = ATTRIBUTE_OPTIONS[attributeKey as keyof typeof ATTRIBUTE_OPTIONS]
    const value = String(formData.attributes[attributeKey] || '')

    if (Array.isArray(options)) {
      if (typeof options[0] === 'string') {
        // Options simples
        return (
          <div key={attributeKey} className="flex items-center space-x-2">
            <label className="block text-sm font-medium text-gray-700 w-24 capitalize">
              {attributeKey.replace('_', ' ')}
            </label>
            <select
              value={value}
              onChange={(e) => updateAttribute(attributeKey, e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Sélectionner...</option>
              {(options as string[]).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeAttribute(attributeKey)}
              className="text-red-500"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        )
      } else {
        // Options avec label
        return (
          <div key={attributeKey} className="flex items-center space-x-2">
            <label className="block text-sm font-medium text-gray-700 w-24 capitalize">
              {attributeKey.replace('_', ' ')}
            </label>
            <select
              value={value}
              onChange={(e) => updateAttribute(attributeKey, e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Sélectionner...</option>
              {(options as { value: string; label: string }[]).map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeAttribute(attributeKey)}
              className="text-red-500"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        )
      }
    }

    // Champ texte par défaut
    return (
      <div key={attributeKey} className="flex items-center space-x-2">
        <Input
          label={attributeKey.replace('_', ' ')}
          value={value}
          onChange={(e) => updateAttribute(attributeKey, e.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => removeAttribute(attributeKey)}
          className="text-red-500 mt-6"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const getVariantIcon = (attributes: VariantAttributes) => {
    if (attributes.color) return <SwatchIcon className="h-4 w-4" />
    if (attributes.size || attributes.shoe_size) return <TagIcon className="h-4 w-4" />
    if (attributes.volume) return <CubeIcon className="h-4 w-4" />
    return <TagIcon className="h-4 w-4" />
  }

  const formatAttributes = (attributes: VariantAttributes) => {
    const entries = Object.entries(attributes).filter(([_, value]) => value)
    if (entries.length === 0) return 'Aucun attribut'
    
    return entries.map(([key, value]) => {
      const option = ATTRIBUTE_OPTIONS[key as keyof typeof ATTRIBUTE_OPTIONS]
      if (Array.isArray(option) && typeof option[0] === 'object') {
        const found = (option as { value: string; label: string }[]).find((opt) => opt.value === value)
        return `${key.replace('_', ' ')}: ${found?.label || value}`
      }
      return `${key.replace('_', ' ')}: ${value}`
    }).join(', ')
  }

  if (variants.state.loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <LoadingSpinner />
      </div>
    )
  }

  const variantList = variants.state.data || []

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Variants de {productName}</CardTitle>
              <p className="text-sm text-gray-600">
                Gérez les différentes variations de ce produit ({variantList.length} variants)
              </p>
            </div>
            <Button onClick={() => {
              setEditingVariant(null)
              resetForm()
              setIsModalOpen(true)
            }}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter un variant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {variantList.length === 0 ? (
            <div className="text-center py-8">
              <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun variant</h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par créer le premier variant de ce produit.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(variantList as ProductVariant[]).map((variant) => (
                <div key={variant.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {variant.image_url ? (
                        <div className="relative h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={variant.image_url}
                            alt={variant.name}
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          {getVariantIcon(variant.attributes)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">{variant.name}</h4>
                        <span className="text-xs text-gray-500">({variant.sku})</span>
                        {!variant.is_active && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Inactif
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{formatAttributes(variant.attributes)}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm font-medium text-gray-900">€{variant.price}</span>
                        <span className="text-sm text-gray-500">{variant.inventory_quantity} en stock</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(variant)}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(variant.id)}>
                      <TrashIcon className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingVariant ? "Modifier le variant" : "Ajouter un nouveau variant"}
        maxWidth="2xl"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom du variant"
              placeholder="Ex: Nike Air Max - Rouge - 42"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input
              label="SKU"
              placeholder="Ex: NIKE-AM-R-42"
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
            <Input
              label="Prix de revient (€)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.cost_price}
              onChange={(e) => setFormData({...formData, cost_price: parseFloat(e.target.value) || 0})}
            />
            <Input
              label="Quantité en stock"
              type="number"
              placeholder="0"
              value={formData.inventory_quantity}
              onChange={(e) => setFormData({...formData, inventory_quantity: parseInt(e.target.value) || 0})}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image du variant
            </label>
            <ImageUpload
              images={variantImages}
              onImagesChange={setVariantImages}
              maxImages={1}
              folder="variants"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template d'attributs
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {Object.entries(VARIANT_TEMPLATES).map(([key, template]) => (
                  <option key={key} value={key}>
                    {template.name} - {template.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attributs du variant
              </label>
              <div className="space-y-3">
                {/* Attributs du template sélectionné */}
                {selectedTemplate !== 'custom' && 
                  VARIANT_TEMPLATES[selectedTemplate].attributes.map((attr) => renderAttributeField(String(attr)))
                }
                
                {/* Attributs personnalisés existants */}
                {Object.keys(formData.attributes).map(key => {
                  const templateAttributes = selectedTemplate !== 'custom' 
                    ? VARIANT_TEMPLATES[selectedTemplate].attributes 
                    : []
                  
                  if (!templateAttributes.includes(key as any)) {
                    return renderAttributeField(key)
                  }
                  return null
                })}
                
                {/* Bouton pour ajouter un attribut personnalisé */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const key = prompt('Nom de l\'attribut:')
                    if (key) {
                      updateAttribute(key.toLowerCase().replace(' ', '_'), '')
                    }
                  }}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Ajouter un attribut
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Variant actif
            </label>
          </div>

          {variants.state.error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {variants.state.error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button type="submit">
              {editingVariant ? 'Modifier' : 'Créer'} le variant
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
