'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  QuestionMarkCircleIcon,
  CubeIcon,
  TagIcon,
  BuildingStorefrontIcon,
  PhotoIcon,
  CurrencyEuroIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

interface HelpSection {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  content: React.ReactNode
}

export default function AidePage() {
  const [openSections, setOpenSections] = useState<string[]>(['produits-base'])

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const helpSections: HelpSection[] = [
    {
      id: 'produits-base',
      title: 'Gestion des Produits - Informations de Base',
      icon: CubeIcon,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Vue d'ensemble</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Les produits sont le cœur de votre boutique. Chaque produit doit avoir des informations complètes et précises.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2">Champs obligatoires</h4>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Nom du produit</p>
                    <p className="text-sm text-gray-600">Utilisez un nom clair et descriptif. Exemple : "Robe d'été fleurie manches courtes"</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">SKU (Code produit)</p>
                    <p className="text-sm text-gray-600">Code unique d'identification. Format recommandé : CAT-001, ROB-FLEUR-001</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Prix</p>
                    <p className="text-sm text-gray-600">Prix de vente en euros. Utilisez des décimales si nécessaire (ex: 29.99)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Catégorie</p>
                    <p className="text-sm text-gray-600">Classez votre produit dans la bonne catégorie ou créez-en une nouvelle</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Quantité en stock</p>
                    <p className="text-sm text-gray-600">Nombre d'unités disponibles à la vente</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2">Champs optionnels</h4>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Description</p>
                    <p className="text-sm text-gray-600">Description détaillée du produit, ses caractéristiques et avantages</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Prix comparé</p>
                    <p className="text-sm text-gray-600">Prix barré pour montrer une réduction (doit être supérieur au prix de vente)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Marque</p>
                    <p className="text-sm text-gray-600">Associez le produit à une marque existante ou créez-en une nouvelle</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Poids</p>
                    <p className="text-sm text-gray-600">Poids du produit en kilogrammes (utile pour les frais de livraison)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Détails supplémentaires</p>
                    <p className="text-sm text-gray-600">Mode d'emploi, conseils d'entretien, informations complémentaires</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'produits-images',
      title: 'Gestion des Images de Produits',
      icon: PhotoIcon,
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-green-800">Bonnes pratiques</h4>
                <p className="text-sm text-green-700 mt-1">
                  Des images de qualité augmentent significativement les chances de vente de vos produits.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2">Spécifications techniques</h4>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-sm">
                  <li><strong>Formats acceptés :</strong> JPG, PNG, WEBP</li>
                  <li><strong>Taille maximale :</strong> 5 MB par image</li>
                  <li><strong>Nombre maximum :</strong> 5 images par produit</li>
                  <li><strong>Résolution recommandée :</strong> 1200x1200 pixels minimum</li>
                  <li><strong>Ratio recommandé :</strong> 1:1 (carré) ou 4:3</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2">Conseils pour de bonnes photos</h4>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mt-1" />
                  <p className="text-sm text-gray-600">Utilisez un éclairage naturel ou une lumière blanche uniforme</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mt-1" />
                  <p className="text-sm text-gray-600">Photographiez sur un fond neutre (blanc ou gris clair)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mt-1" />
                  <p className="text-sm text-gray-600">Montrez le produit sous plusieurs angles</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mt-1" />
                  <p className="text-sm text-gray-600">Incluez des photos de détails (textures, étiquettes, etc.)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mt-1" />
                  <p className="text-sm text-gray-600">La première image sera utilisée comme image principale</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Upload d'images</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Glissez-déposez vos images ou cliquez pour les sélectionner. L'ordre peut être modifié en faisant glisser les images.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'produits-options',
      title: 'Options et Étiquettes des Produits',
      icon: ClipboardDocumentListIcon,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <span className="text-red-600 font-semibold text-sm">FLASH</span>
                </div>
                <h4 className="font-semibold text-red-800">Vente Flash</h4>
              </div>
              <p className="text-sm text-red-700">
                Marque le produit comme étant en promotion temporaire. 
                Idéal pour les soldes, déstockages ou offres limitées dans le temps.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <span className="text-green-600 font-semibold text-sm">NEW</span>
                </div>
                <h4 className="font-semibold text-green-800">Nouveau Produit</h4>
              </div>
              <p className="text-sm text-green-700">
                Indique que le produit vient d'arriver dans votre catalogue. 
                Aide les clients à découvrir vos dernières nouveautés.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <span className="text-purple-600 font-semibold text-sm">MATCH</span>
                </div>
                <h4 className="font-semibold text-purple-800">Match Li</h4>
              </div>
              <p className="text-sm text-purple-700">
                Étiquette spéciale pour identifier les produits compatibles 
                avec le système "Match Li" de votre boutique.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Comment utiliser ces options</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ces étiquettes apparaîtront sur la fiche produit et dans les listes</li>
              <li>• Vous pouvez combiner plusieurs étiquettes sur un même produit</li>
              <li>• Elles aident les clients à identifier rapidement les types de produits</li>
              <li>• Utilisez-les de manière cohérente pour une meilleure expérience utilisateur</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'categories',
      title: 'Gestion des Catégories',
      icon: TagIcon,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Organisation de votre catalogue</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Les catégories permettent d'organiser vos produits de manière logique et d'améliorer la navigation pour vos clients.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2">Création d'une catégorie</h4>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Nom de la catégorie</p>
                    <p className="text-sm text-gray-600">Choisissez un nom clair et descriptif (ex: "Vêtements femme", "Accessoires")</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Slug</p>
                    <p className="text-sm text-gray-600">URL de la catégorie (généré automatiquement, modifiable)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Description</p>
                    <p className="text-sm text-gray-600">Description optionnelle pour expliquer le contenu de la catégorie</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Image</p>
                    <p className="text-sm text-gray-600">URL d'une image représentative de la catégorie</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2">Hiérarchie des catégories</h4>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Structure recommandée :</h5>
                <div className="text-sm text-gray-700 space-y-1 ml-4">
                  <div>📁 Vêtements</div>
                  <div className="ml-4">📂 Femme</div>
                  <div className="ml-8">📄 Robes</div>
                  <div className="ml-8">📄 Hauts</div>
                  <div className="ml-4">📂 Homme</div>
                  <div className="ml-8">📄 Chemises</div>
                  <div className="ml-8">📄 Pantalons</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600"><strong>Catégorie parent :</strong> Permet de créer une hiérarchie</p>
                <p className="text-sm text-gray-600"><strong>Ordre de tri :</strong> Définit l'ordre d'affichage (nombre croissant)</p>
                <p className="text-sm text-gray-600"><strong>Statut :</strong> Active/Inactive pour contrôler la visibilité</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Création rapide depuis les produits</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Lors de la création d'un produit, vous pouvez créer une nouvelle catégorie directement en tapant son nom dans le champ autocomplete.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'marques',
      title: 'Gestion des Marques',
      icon: BuildingStorefrontIcon,
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start">
              <InformationCircleIcon className="h-5 w-5 text-purple-500 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-purple-800">Importance des marques</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Les marques ajoutent de la crédibilité à vos produits et aident les clients à identifier leurs fabricants préférés.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2">Informations de base</h4>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Nom de la marque</p>
                    <p className="text-sm text-gray-600">Nom officiel de la marque (ex: "Nike", "Apple", "Samsung")</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Slug</p>
                    <p className="text-sm text-gray-600">Version URL-friendly du nom (généré automatiquement)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Description</p>
                    <p className="text-sm text-gray-600">Courte description de la marque et de ses spécialités</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2">Éléments visuels et liens</h4>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <PhotoIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Logo de la marque</p>
                    <p className="text-sm text-gray-600">URL vers le logo officiel de la marque (format PNG recommandé)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Site web</p>
                    <p className="text-sm text-gray-600">URL du site officiel de la marque</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Statut</p>
                    <p className="text-sm text-gray-600">Active/Inactive pour contrôler l'affichage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Conseils pour les logos</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Utilisez des logos sur fond transparent (PNG)</li>
              <li>• Résolution recommandée : 200x200 pixels minimum</li>
              <li>• Respectez les chartes graphiques des marques</li>
              <li>• Vérifiez que vous avez le droit d'utiliser le logo</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Création rapide depuis les produits</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Comme pour les catégories, vous pouvez créer une nouvelle marque directement lors de la création d'un produit.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'bonnes-pratiques',
      title: 'Bonnes Pratiques Générales',
      icon: QuestionMarkCircleIcon,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2 text-green-600">✅ À faire</h4>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Cohérence dans les noms</p>
                    <p className="text-sm text-gray-600">Utilisez une nomenclature cohérente pour vos produits et SKU</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Descriptions détaillées</p>
                    <p className="text-sm text-gray-600">Plus d'informations = plus de confiance de la part des clients</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Mise à jour régulière des stocks</p>
                    <p className="text-sm text-gray-600">Évitez les ruptures en surveillant vos inventaires</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Images de qualité</p>
                    <p className="text-sm text-gray-600">Investissez dans de bonnes photos, c'est crucial pour les ventes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Prix compétitifs</p>
                    <p className="text-sm text-gray-600">Vérifiez régulièrement vos prix par rapport à la concurrence</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b pb-2 text-red-600">❌ À éviter</h4>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">SKU en double</p>
                    <p className="text-sm text-gray-600">Chaque produit doit avoir un code unique</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Images floues ou pixelisées</p>
                    <p className="text-sm text-gray-600">La qualité visuelle impacte directement les ventes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Descriptions vides</p>
                    <p className="text-sm text-gray-600">Les clients ont besoin d'informations pour prendre leur décision</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Catégories trop générales</p>
                    <p className="text-sm text-gray-600">Créez des catégories spécifiques pour faciliter la navigation</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Stocks non mis à jour</p>
                    <p className="text-sm text-gray-600">Cela peut créer de la frustration chez vos clients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-800 mb-4">Workflow recommandé pour un nouveau produit</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <p className="text-sm text-blue-700">Créer ou vérifier la catégorie et la marque</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <p className="text-sm text-blue-700">Préparer les images (photographier, retoucher si nécessaire)</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <p className="text-sm text-blue-700">Rédiger le nom et la description du produit</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                <p className="text-sm text-blue-700">Déterminer le prix et vérifier la concurrence</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</div>
                <p className="text-sm text-blue-700">Créer le produit avec toutes les informations</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</div>
                <p className="text-sm text-blue-700">Vérifier l'affichage et ajuster si nécessaire</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Centre d'Aide</h2>
          <p className="text-gray-600">Documentation complète pour la gestion de vos produits, catégories et marques</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sommaire */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Sommaire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {helpSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => toggleSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    openSections.includes(section.id)
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <section.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Contenu */}
        <div className="lg:col-span-3 space-y-6">
          {helpSections.map((section) => (
            <div key={section.id} id={section.id} className={openSections.includes(section.id) ? '' : 'hidden'}>
              <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <section.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection(section.id)}
                  >
                    {openSections.includes(section.id) ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {section.content}
              </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Carte de contact pour support */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Besoin d'aide supplémentaire ?</h3>
              <p className="text-gray-600 mt-1">
                Si vous ne trouvez pas la réponse à votre question dans cette documentation, 
                n'hésitez pas à contacter notre équipe de support.
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Contacter le support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


