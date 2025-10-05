# 📸 Guide d'Upload d'Images pour les Variants

## 🎯 Nouvelle Fonctionnalité : Upload Direct d'Images

### ✅ Ce qui a été ajouté :

1. **Composant ImageUpload** intégré dans le formulaire des variants
2. **Upload direct** vers Supabase Storage (dossier `variants`)
3. **Aperçu visuel** des images dans la liste des variants
4. **Limite d'1 image** par variant pour optimiser les performances

### 🚀 Comment utiliser :

#### **Créer un variant avec image :**
1. Cliquez sur l'icône cube (📦) à côté d'un produit
2. Cliquez sur "Ajouter un variant"
3. Remplissez les informations du variant
4. Dans la section "Image du variant" :
   - Cliquez sur "Choisir une image" ou glissez-déposez
   - L'image est automatiquement uploadée vers Supabase
   - Un aperçu s'affiche immédiatement

#### **Modifier l'image d'un variant :**
1. Cliquez sur l'icône crayon (✏️) du variant
2. Dans la section image, supprimez l'ancienne image
3. Uploadez la nouvelle image
4. Sauvegardez les modifications

### 🎨 Exemples d'utilisation :

#### **Chaussures Nike :**
- **Variant 1** : Nike Air Max Rouge 42 → Image de la chaussure rouge
- **Variant 2** : Nike Air Max Bleue 43 → Image de la chaussure bleue

#### **Parfum Chanel :**
- **Variant 1** : Chanel N°5 50ml → Image du flacon 50ml
- **Variant 2** : Chanel N°5 100ml → Image du flacon 100ml

#### **T-shirt :**
- **Variant 1** : T-shirt Noir M → Image du t-shirt noir
- **Variant 2** : T-shirt Blanc L → Image du t-shirt blanc

### 🔧 Spécifications techniques :

- **Formats supportés** : JPG, PNG, WebP, GIF
- **Taille maximale** : 5MB par image
- **Stockage** : Supabase Storage (dossier `variants/`)
- **Optimisation** : Redimensionnement automatique
- **Limite** : 1 image par variant

### 📱 Interface utilisateur :

#### **Dans la liste des variants :**
- Affichage de l'image en miniature (48x48px)
- Fallback vers l'icône d'attribut si pas d'image
- Hover effects et transitions fluides

#### **Dans le formulaire :**
- Zone de drag & drop intuitive
- Aperçu immédiat de l'image uploadée
- Bouton de suppression pour remplacer l'image
- Indicateur de progression d'upload

### 🎯 Avantages :

1. **Expérience utilisateur améliorée** : Plus besoin de gérer les URLs
2. **Cohérence visuelle** : Images optimisées et uniformes
3. **Performance** : Images automatiquement optimisées
4. **Sécurité** : Upload sécurisé via Supabase Storage
5. **Simplicité** : Interface drag & drop intuitive

### 🔄 Migration des variants existants :

Les variants existants avec des URLs d'images continuent de fonctionner normalement. Vous pouvez :
1. Éditer le variant
2. Supprimer l'ancienne image
3. Uploader une nouvelle image via l'interface

---

💡 **Astuce** : Utilisez des images de haute qualité (au moins 500x500px) pour un meilleur rendu dans votre boutique en ligne !
