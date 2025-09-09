# Configuration Supabase Storage pour les Images

## Étapes de configuration

### 1. Créer le bucket de stockage

Dans votre tableau de bord Supabase :

1. Allez dans **Storage** > **Buckets**
2. Cliquez sur **New Bucket**
3. Nom du bucket : `product-images`
4. Cochez **Public bucket** pour permettre l'accès public aux images
5. Cliquez sur **Save**

### 2. Configurer les politiques de sécurité (RLS)

Dans l'onglet **Policies** du bucket `product-images`, ajoutez ces politiques :

#### Politique de lecture (SELECT)
```sql
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
```

#### Politique d'upload (INSERT)
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images');
```

#### Politique de suppression (DELETE)
```sql
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'product-images');
```

### 3. Variables d'environnement

Assurez-vous que votre fichier `.env.local` contient :

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Structure des dossiers

Les images seront organisées comme suit :
```
product-images/
  └── products/
      ├── timestamp1-image1.jpg
      ├── timestamp2-image2.png
      └── ...
```

## Fonctionnalités implémentées

### Upload d'images
- ✅ Support des formats : JPG, PNG, WebP
- ✅ Taille maximum : 5MB par image
- ✅ Maximum 5 images par produit
- ✅ Noms de fichiers uniques avec timestamp
- ✅ Validation côté client et serveur

### Gestion des images
- ✅ Prévisualisation en temps réel
- ✅ Suppression d'images
- ✅ Réorganisation par glisser-déposer
- ✅ Indicateur de progression d'upload

### Affichage
- ✅ Vignettes dans la liste des produits
- ✅ Indicateur du nombre d'images
- ✅ Image par défaut si aucune image

## API Endpoints

### POST /api/upload/images
Upload une nouvelle image

**Body:** FormData avec :
- `file`: Le fichier image
- `folder`: Dossier de destination (optionnel, par défaut "products")

**Response:**
```json
{
  "success": true,
  "filePath": "products/timestamp-filename.jpg",
  "publicUrl": "https://your-bucket.supabase.co/storage/v1/object/public/product-images/products/timestamp-filename.jpg",
  "fileName": "timestamp-filename.jpg"
}
```

### DELETE /api/upload/images?filePath=...
Supprime une image

**Query Parameters:**
- `filePath`: Chemin du fichier à supprimer

**Response:**
```json
{
  "success": true
}
```

## Troubleshooting

### Erreur : "The resource you requested could not be found"
- Vérifiez que le bucket `product-images` existe
- Vérifiez que le bucket est configuré comme public

### Erreur : "Permission denied"
- Vérifiez les politiques RLS
- Vérifiez que l'utilisateur est authentifié pour l'upload

### Images ne s'affichent pas
- Vérifiez l'URL publique du bucket
- Vérifiez les CORS si nécessaire

## Performance

Pour optimiser les performances :

1. **Compression d'images** : Ajoutez une compression côté client avant upload
2. **CDN** : Configurez un CDN devant Supabase Storage
3. **Formats modernes** : Utilisez WebP quand possible
4. **Lazy loading** : Implémentez le chargement différé des images
