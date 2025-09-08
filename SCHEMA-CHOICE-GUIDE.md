# 🚀 Guide de Choix du Script SQL

Choisissez le bon script selon votre situation :

## 📊 Scripts Disponibles

### 1. `supabase-schema-safe.sql` ⭐ **RECOMMANDÉ**
**Utilisation :** Installation complète ou mise à jour sécurisée
- ✅ Peut être exécuté plusieurs fois sans erreur
- ✅ Gère les éléments existants automatiquement  
- ✅ Crée toutes les tables, policies, triggers et fonctions
- ✅ Insère les données de test si elles n'existent pas

**Quand l'utiliser :**
- ✅ Première installation
- ✅ Mise à jour complète
- ✅ Quand vous avez des erreurs "already exists"

### 2. `update-schema.sql`
**Utilisation :** Mise à jour incrémentale uniquement
- ✅ Ajoute seulement les nouvelles fonctionnalités
- ✅ Ne touche pas aux tables existantes
- ✅ Configure les fonctions admin et triggers

**Quand l'utiliser :**
- ✅ Vous avez déjà les tables de base
- ✅ Vous voulez juste ajouter les fonctionnalités admin
- ✅ Mise à jour légère

### 3. `cleanup-schema.sql` ⚠️ **DANGER**
**Utilisation :** Nettoyage complet (supprime tout!)
- ❌ Supprime TOUTES les données
- ❌ Supprime toutes les tables et structures
- ⚠️ Irréversible sans sauvegarde

**Quand l'utiliser :**
- ⚠️ Seulement si vous voulez repartir de zéro
- ⚠️ Après avoir fait une sauvegarde
- ⚠️ En cas de corruption majeure

## 🎯 Recommandations par Situation

### Situation 1: Première Installation
```sql
-- Exécutez dans cet ordre :
1. supabase-schema-safe.sql
```

### Situation 2: Erreurs "already exists"
```sql
-- Solution simple :
1. supabase-schema-safe.sql
```

### Situation 3: Tables existantes, ajout des fonctions admin
```sql
-- Solution légère :
1. update-schema.sql
```

### Situation 4: Corruption ou problèmes majeurs
```sql
-- Solution radicale (⚠️ perte de données) :
1. cleanup-schema.sql
2. supabase-schema-safe.sql
```

## 📝 Instructions d'Exécution

### Dans Supabase Dashboard :
1. Allez dans **SQL Editor**
2. Copiez le contenu du script choisi
3. Cliquez sur **Run**
4. Vérifiez les messages dans la console

### Vérification après exécution :
```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Vérifier l'admin
SELECT email, role FROM public.users 
WHERE email = 'admin@mianava.com';
```

## 🔧 En cas de problème

### Erreur "relation already exists"
➡️ Utilisez `supabase-schema-safe.sql`

### Erreur "function does not exist"  
➡️ Utilisez `update-schema.sql` ou `supabase-schema-safe.sql`

### Erreur "permission denied"
➡️ Vérifiez que vous êtes connecté avec les droits admin dans Supabase

### Données incohérentes
➡️ `cleanup-schema.sql` puis `supabase-schema-safe.sql` (⚠️ perte de données)

## ✅ Checklist Post-Installation

- [ ] Tables créées : users, categories, brands, products, etc.
- [ ] RLS activé sur toutes les tables
- [ ] Policies créées et fonctionnelles
- [ ] Triggers configurés (updated_at, handle_new_user)
- [ ] Fonctions admin disponibles
- [ ] admin@mianava.com configuré avec le rôle admin
- [ ] Données de test insérées

---

💡 **Conseil :** En cas de doute, utilisez toujours `supabase-schema-safe.sql` - c'est le plus sûr !
