# 👑 Guide de Configuration de l'Administrateur

Ce guide vous explique comment configurer `admin@mianava.com` en tant qu'administrateur dans votre système RLS.

## 🎯 Méthodes de Configuration

### Méthode 1 : Configuration Automatique (Recommandée)

1. **Créez le compte dans Supabase Auth :**
   - Allez dans votre dashboard Supabase
   - Section **Authentication > Users**
   - Cliquez sur **Add user**
   - Email : `admin@mianava.com`
   - Mot de passe : choisissez un mot de passe fort
   - ✅ Cochez **Auto confirm user**

2. **Exécutez le script de mise à jour du schéma :**
   - Allez dans **SQL Editor**
   - Exécutez le contenu mis à jour de `supabase-schema.sql`
   - Le trigger se chargera automatiquement de créer le profil admin

3. **Vérifiez la configuration :**
   ```sql
   SELECT 
     u.email,
     pu.role,
     pu.full_name
   FROM auth.users u
   JOIN public.users pu ON u.id = pu.id
   WHERE u.email = 'admin@mianava.com';
   ```

### Méthode 2 : Configuration Manuelle

Si vous avez déjà créé le compte mais qu'il n'a pas le bon rôle :

1. **Exécutez le script admin-setup.sql :**
   - Ouvrez **SQL Editor** dans Supabase
   - Copiez et exécutez le contenu de `admin-setup.sql`
   - Lancez : `SELECT setup_admin_user();`

2. **Ou utilisez la fonction de promotion :**
   ```sql
   SELECT promote_user_to_admin('admin@mianava.com');
   ```

### Méthode 3 : Configuration Directe par UUID

Si vous connaissez l'UUID de l'utilisateur :

```sql
-- Remplacez 'UUID_ICI' par l'UUID réel
INSERT INTO public.users (id, email, full_name, role)
VALUES ('UUID_ICI', 'admin@mianava.com', 'Administrateur Mianava', 'admin')
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();
```

## 🔍 Vérifications

### 1. Vérifier que l'utilisateur existe dans auth.users
```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@mianava.com';
```

### 2. Vérifier le profil dans public.users
```sql
SELECT id, email, role, created_at 
FROM public.users 
WHERE email = 'admin@mianava.com';
```

### 3. Tester les permissions RLS
```sql
-- Simuler l'utilisateur admin pour tester les permissions
SELECT * FROM categories; -- Doit fonctionner
```

## 🚀 Test de Connexion Admin

1. **Connectez-vous avec admin@mianava.com**
2. **Allez sur `/admin`**
3. **Testez les fonctionnalités :**
   - ✅ Voir les catégories
   - ✅ Créer une catégorie
   - ✅ Modifier une catégorie
   - ✅ Supprimer une catégorie

## 🛠️ Fonctions Utilitaires Créées

### `setup_admin_user()`
Configure automatiquement admin@mianava.com en tant qu'admin.

### `promote_user_to_admin(email)`
Promeut n'importe quel utilisateur en admin par son email.

### `handle_new_user()` (Trigger)
Crée automatiquement un profil pour les nouveaux utilisateurs, avec admin@mianava.com configuré automatiquement en admin.

## 📋 Checklist de Configuration

- [ ] Créer le compte `admin@mianava.com` dans Authentication
- [ ] Exécuter le schéma mis à jour (`supabase-schema.sql`)
- [ ] Vérifier que l'utilisateur a le rôle `admin`
- [ ] Tester la connexion
- [ ] Tester les permissions admin

## 🔐 Sécurité

- **Mot de passe fort** pour le compte admin
- **2FA activé** si possible
- **Accès limité** aux clés de service
- **Audit régulier** des permissions

## 🆘 En cas de problème

### "User not found in auth.users"
1. Créez d'abord le compte dans Authentication
2. Puis exécutez le script de configuration

### "Permission denied"
1. Vérifiez que le rôle est bien 'admin'
2. Vérifiez les policies RLS
3. Vérifiez que l'UUID correspond

### "Trigger not working"
1. Vérifiez que le trigger est créé
2. Re-exécutez la partie trigger du schéma

---

🎉 **Une fois configuré, votre admin@mianava.com aura accès complet à toutes les fonctionnalités d'administration !**
