'use client'

import { useState, useRef } from 'react'
import { Button } from './Button'
import { LoadingSpinner } from './LoadingSpinner'
import {
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  folder?: string
  className?: string
}

interface UploadedImage {
  url: string
  filePath: string
  uploading: boolean
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5, 
  folder = 'products',
  className = '' 
}: ImageUploadProps) {
  const [uploadingImages, setUploadingImages] = useState<UploadedImage[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    // Vérifier le nombre maximum d'images
    const totalImages = images.length + uploadingImages.length + files.length
    if (totalImages > maxImages) {
      setError(`Maximum ${maxImages} images autorisées`)
      return
    }

    setError(null)

    // Traiter chaque fichier
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Ajouter à la liste d'upload en cours
      const tempImage: UploadedImage = {
        url: URL.createObjectURL(file),
        filePath: '',
        uploading: true
      }
      
      setUploadingImages(prev => [...prev, tempImage])

      try {
        // Créer FormData pour l'upload
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)

        // Uploader vers l'API
        const response = await fetch('/api/upload/images', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Erreur d\'upload')
        }

        // Mettre à jour les images avec l'URL finale
        onImagesChange([...images, result.publicUrl])
        
        // Supprimer de la liste d'upload en cours
        setUploadingImages(prev => 
          prev.filter(img => img.url !== tempImage.url)
        )

        // Nettoyer l'URL temporaire
        URL.revokeObjectURL(tempImage.url)

      } catch (error: any) {
        console.error('Erreur upload:', error)
        setError(error.message || 'Erreur lors de l\'upload')
        
        // Supprimer de la liste d'upload en cours
        setUploadingImages(prev => 
          prev.filter(img => img.url !== tempImage.url)
        )
        
        // Nettoyer l'URL temporaire
        URL.revokeObjectURL(tempImage.url)
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = async (imageUrl: string, index: number) => {
    try {
      // Si c'est une image Supabase, essayer de la supprimer
      if (imageUrl.includes('supabase')) {
        // Extraire le chemin du fichier depuis l'URL
        const urlParts = imageUrl.split('/')
        const fileName = urlParts[urlParts.length - 1]
        const filePath = `${folder}/${fileName}`

        await fetch(`/api/upload/images?filePath=${encodeURIComponent(filePath)}`, {
          method: 'DELETE'
        })
      }

      // Supprimer de la liste locale
      const newImages = images.filter((_, i) => i !== index)
      onImagesChange(newImages)
      
    } catch (error) {
      console.error('Erreur suppression image:', error)
      // Supprimer quand même de la liste locale
      const newImages = images.filter((_, i) => i !== index)
      onImagesChange(newImages)
    }
  }

  const canAddMore = images.length + uploadingImages.length < maxImages

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-4">
        {/* Images existantes */}
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={imageUrl}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveImage(imageUrl, index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}

        {/* Images en cours d'upload */}
        {uploadingImages.map((image, index) => (
          <div key={`uploading-${index}`} className="relative">
            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
              <img
                src={image.url}
                alt="Upload en cours"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner size="sm" />
              </div>
            </div>
          </div>
        ))}

        {/* Bouton d'ajout */}
        {canAddMore && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <PlusIcon className="h-6 w-6 text-gray-400 mx-auto mb-1" />
              <span className="text-xs text-gray-500">Ajouter</span>
            </div>
          </div>
        )}
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Informations */}
      <div className="text-sm text-gray-500">
        <p>{images.length + uploadingImages.length}/{maxImages} images</p>
        <p>Formats acceptés : JPG, PNG, WebP (max 5MB par image)</p>
      </div>

      {/* Erreur */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
