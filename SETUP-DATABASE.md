# 🚀 Guide de Configuration de la Base de Données

Ce guide vous aidera à résoudre les erreurs d'ajout et à configurer correctement votre base de données Supabase.

## 📋 Étapes de Configuration

### 1. Variables d'Environnement

1. **Copiez le fichier d'exemple :**
   ```bash
   cp env.example .env.local
   ```

2. **Configurez vos clés Supabase dans `.env.local` :**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
   SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role
   ```

3. **Trouvez vos clés dans Supabase :**
   - Allez sur [app.supabase.com](https://app.supabase.com)
   - Sélectionnez votre projet
   - Allez dans **Settings > API**
   - Copiez l'URL et les clés

### 2. Schéma de Base de Données

1. **Ouvrez l'éditeur SQL de Supabase :**
   - Dans votre projet Supabase, allez dans **SQL Editor**

2. **Exécutez le schéma :**
   - Copiez le contenu du fichier `supabase-schema.sql`
   - Collez-le dans l'éditeur SQL
   - Cliquez sur **Run**

### 3. Test de Connexion

1. **Redémarrez votre serveur :**
   ```bash
   npm run dev
   ```

2. **Allez sur la page de test :**
   - Ouvrez `http://localhost:3000/test-db`
   - Cliquez sur **Test Connexion**

3. **Testez les opérations CRUD :**
   - **Lire Catégories** : Vérifie la lecture des données
   - **Créer Catégorie** : Teste l'insertion

## 🔧 Résolution des Problèmes Courants

### Erreur "Variables d'environnement manquantes"
- ✅ Vérifiez que `.env.local` existe
- ✅ Vérifiez que toutes les variables sont définies
- ✅ Redémarrez le serveur après modification

### Erreur "Table doesn't exist"
- ✅ Exécutez le fichier `supabase-schema.sql`
- ✅ Vérifiez que toutes les tables sont créées
- ✅ Vérifiez les permissions RLS

### Erreur "Unauthorized"
- ✅ Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est correcte
- ✅ Vérifiez les policies RLS dans Supabase

### Erreur "Slug already exists"
- ✅ Normal : le slug doit être unique
- ✅ Modifiez le nom pour générer un slug différent

## 🛠️ Scripts de Test

### Test en ligne de commande
```bash
node test-database.js
```

### Test via l'interface web
```
http://localhost:3000/test-db
```

### Test des APIs
```bash
# Test lecture des catégories
curl http://localhost:3000/api/test/categories

# Test création d'une catégorie
curl -X POST http://localhost:3000/api/test/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","slug":"test-123","description":"Test"}'
```

## 📊 Structure des Tables

### Categories
- `id` : UUID (auto-généré)
- `name` : Nom (requis)
- `slug` : Slug unique (requis)
- `description` : Description (optionnel)
- `image_url` : URL de l'image (optionnel)
- `parent_id` : ID du parent (optionnel)
- `sort_order` : Ordre de tri (défaut: 0)
- `is_active` : Actif/Inactif (défaut: true)

### Brands
- `id` : UUID (auto-généré)
- `name` : Nom (requis)
- `slug` : Slug unique (requis)
- `description` : Description (optionnel)
- `logo_url` : URL du logo (optionnel)
- `website_url` : Site web (optionnel)
- `is_active` : Actif/Inactif (défaut: true)

## 🚨 En Cas de Problème

1. **Vérifiez les logs de la console** (F12 dans votre navigateur)
2. **Testez avec la page de debug** (`/test-db`)
3. **Vérifiez votre configuration Supabase**
4. **Consultez les logs Supabase** dans votre dashboard

## ✅ Vérification Finale

Une fois tout configuré, vous devriez pouvoir :
- ✅ Voir la liste des catégories/marques
- ✅ Créer de nouvelles entrées
- ✅ Modifier des entrées existantes
- ✅ Supprimer des entrées
- ✅ Activer/désactiver des entrées

---

📝 **Note :** Supprimez les fichiers de test (`test-database.js`, `/test-db`, `/api/test`) une fois que tout fonctionne correctement.
