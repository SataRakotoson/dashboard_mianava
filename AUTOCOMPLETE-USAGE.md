# Composant Autocomplete - Guide d'utilisation

Le composant `Autocomplete` permet de créer des champs de sélection avec recherche en temps réel et création de nouvelles entrées.

## Fonctionnalités

### ✅ **Recherche en temps réel**
- Tapez pour filtrer les options
- Recherche insensible à la casse
- Surlignage des résultats

### ✅ **Navigation au clavier**
- `↑/↓` : Naviguer dans les options
- `Enter` : Sélectionner une option
- `Escape` : Fermer le dropdown
- `Space` : Ouvrir le dropdown

### ✅ **Création d'entrées**
- Possibilité de créer de nouvelles options
- API callback pour la création
- Rechargement automatique des données

### ✅ **UX optimisée**
- Bouton pour effacer la sélection
- Indicateurs visuels de sélection
- États de chargement pour la création

## Utilisation dans le formulaire produit

```tsx
// Autocomplete pour les catégories
<Autocomplete
  label="Catégorie"
  placeholder="Rechercher ou créer une catégorie..."
  options={categories.map(cat => ({ id: cat.id, name: cat.name }))}
  value={formData.category_id}
  onChange={(value) => setFormData({...formData, category_id: value})}
  onCreateNew={handleCreateCategory}
  required
  createNewLabel="Créer la catégorie"
/>

// Autocomplete pour les marques
<Autocomplete
  label="Marque"
  placeholder="Rechercher ou créer une marque..."
  options={brands.map(brand => ({ id: brand.id, name: brand.name }))}
  value={formData.brand_id}
  onChange={(value) => setFormData({...formData, brand_id: value})}
  onCreateNew={handleCreateBrand}
  createNewLabel="Créer la marque"
/>
```

## Props du composant

| Prop | Type | Description | Requis |
|------|------|-------------|---------|
| `label` | `string` | Label du champ | ✅ |
| `placeholder` | `string` | Texte d'aide | ✅ |
| `options` | `{ id: string, name: string }[]` | Options disponibles | ✅ |
| `value` | `string` | Valeur sélectionnée (ID) | ✅ |
| `onChange` | `(value: string) => void` | Callback de changement | ✅ |
| `onCreateNew` | `(name: string) => Promise<{id: string, name: string} \| null>` | Callback de création | ❌ |
| `required` | `boolean` | Champ obligatoire | ❌ |
| `className` | `string` | Classes CSS | ❌ |
| `createNewLabel` | `string` | Texte du bouton de création | ❌ |

## Fonctions de création

### Pour les catégories
```tsx
const handleCreateCategory = async (name: string) => {
  const newCategory = await createCategory(name)
  if (newCategory) {
    await categories.reload() // Recharger les données
    return { id: newCategory.id, name: newCategory.name }
  }
  return null
}
```

### Pour les marques
```tsx
const handleCreateBrand = async (name: string) => {
  const newBrand = await createBrand(name)
  if (newBrand) {
    await brands.reload() // Recharger les données
    return { id: newBrand.id, name: newBrand.name }
  }
  return null
}
```

## Workflow utilisateur

1. **Recherche** : L'utilisateur tape dans le champ
2. **Filtrage** : Les options sont filtrées en temps réel
3. **Sélection** : Clic ou Enter pour sélectionner
4. **Création** : Si aucun résultat, proposition de création
5. **Validation** : Création via API et rechargement des données

## Avantages par rapport aux selects

- **UX améliorée** : Recherche intuitive
- **Évolutivité** : Création directe de nouvelles entrées
- **Performance** : Filtrage côté client
- **Accessibilité** : Navigation clavier complète
- **Flexibilité** : Personnalisation facile

## Personnalisation

Le composant peut être étendu pour :
- Ajouter des icônes pour chaque option
- Implémenter la recherche côté serveur
- Ajouter des groupes d'options
- Personnaliser le style des options

## Tests

Pour tester le composant :
1. Tapez un nom de catégorie/marque existante
2. Utilisez les flèches pour naviguer
3. Tapez un nom inexistant et créez-le
4. Vérifiez que la nouvelle entrée apparaît dans la liste
