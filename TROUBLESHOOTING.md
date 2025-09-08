# 🔧 Guide de Dépannage - Dashboard Mianava

## 🚨 Problème : Chargement Infini

### Symptômes
- La page charge indéfiniment
- Pas de redirection vers la page de connexion
- Pas d'erreur visible dans la console

### Solutions

#### 1. Vérifier la Configuration Supabase

```bash
# Tester la configuration Supabase
npm run test:supabase
```

**Résultat attendu :**
```
✅ Définie - NEXT_PUBLIC_SUPABASE_URL
✅ Définie - NEXT_PUBLIC_SUPABASE_ANON_KEY  
✅ Définie - SUPABASE_SERVICE_ROLE_KEY
✅ Connexion réussie avec la clé anonyme
✅ Connexion réussie avec la clé service role
```

#### 2. Vérifier le Fichier .env.local

Assurez-vous que votre fichier `.env.local` contient :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 3. Vérifier le Schéma de Base de Données

1. Allez dans votre projet Supabase
2. Ouvrez l'éditeur SQL
3. Exécutez le contenu de `supabase-schema.sql`
4. Vérifiez que les tables sont créées

#### 4. Tester la Page de Debug

Accédez à `http://localhost:3000/debug` pour voir l'état de l'authentification.

#### 5. Vérifier la Console du Navigateur

Ouvrez les outils de développement (F12) et vérifiez :
- **Console** : Erreurs JavaScript
- **Network** : Requêtes qui échouent
- **Application** : Variables d'environnement

### Solutions Spécifiques

#### Problème : Variables d'environnement manquantes

```bash
# Vérifier que le fichier .env.local existe
ls -la .env.local

# Vérifier le contenu (sans afficher les valeurs)
grep -E "^[A-Z]" .env.local
```

#### Problème : Erreur de connexion Supabase

1. Vérifiez l'URL de votre projet Supabase
2. Vérifiez que les clés sont correctes
3. Vérifiez que le projet Supabase est actif

#### Problème : Utilisateur non trouvé

1. Créez un utilisateur dans Supabase Auth
2. Exécutez le script `admin-setup.sql`
3. Vérifiez que l'utilisateur existe dans la table `users`

### Debug Avancé

#### 1. Activer les Logs Détaillés

Ajoutez dans votre `.env.local` :

```env
NODE_ENV=development
DEBUG=*
```

#### 2. Vérifier les Requêtes Supabase

Dans la console du navigateur :

```javascript
// Tester la connexion Supabase
import { supabase } from './src/lib/supabase'
supabase.auth.getSession().then(console.log)
```

#### 3. Vérifier l'État de l'Authentification

```javascript
// Dans la console du navigateur
window.localStorage.getItem('sb-your-project-auth-token')
```

### Solutions par Étapes

#### Étape 1 : Configuration de Base
1. ✅ Créer le projet Supabase
2. ✅ Exécuter le schéma SQL
3. ✅ Configurer les variables d'environnement
4. ✅ Tester avec `npm run test:supabase`

#### Étape 2 : Création d'un Utilisateur Admin
1. ✅ Créer un utilisateur dans Supabase Auth
2. ✅ Exécuter `admin-setup.sql`
3. ✅ Tester la connexion

#### Étape 3 : Test de l'Application
1. ✅ Démarrer avec `npm run dev`
2. ✅ Accéder à `http://localhost:3000`
3. ✅ Vérifier la redirection vers `/admin/login`
4. ✅ Se connecter avec l'utilisateur admin

### Messages d'Erreur Courants

#### "supabaseKey is required"
- **Cause** : Variable d'environnement manquante
- **Solution** : Vérifier `.env.local`

#### "Invalid JWT"
- **Cause** : Clé Supabase incorrecte
- **Solution** : Vérifier les clés dans Supabase

#### "User not found"
- **Cause** : Utilisateur non créé dans la table `users`
- **Solution** : Exécuter `admin-setup.sql`

#### "Row Level Security policy"
- **Cause** : Politique RLS bloque l'accès
- **Solution** : Vérifier les politiques dans Supabase

### Contact et Support

Si le problème persiste :

1. Vérifiez les logs dans la console
2. Testez avec la page `/debug`
3. Vérifiez la configuration Supabase
4. Consultez la documentation Supabase

### Commandes Utiles

```bash
# Nettoyer le cache Next.js
rm -rf .next

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Tester la configuration
npm run test:supabase

# Démarrer en mode debug
DEBUG=* npm run dev
```
