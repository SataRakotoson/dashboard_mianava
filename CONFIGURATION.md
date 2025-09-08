# 🔧 Configuration du Dashboard Mianava

## 📋 Guide de Configuration Complète

### 1. Configuration Supabase

#### Étape 1 : Créer le projet
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez l'URL du projet et la clé anonyme

#### Étape 2 : Exécuter le schéma de base de données
1. Ouvrez l'éditeur SQL dans Supabase
2. Copiez-collez le contenu de `supabase-schema.sql`
3. Exécutez le script

#### Étape 3 : Créer un utilisateur administrateur
1. Dans l'onglet Authentication > Users, créez un nouvel utilisateur
2. Notez l'email utilisé
3. Exécutez le script `admin-setup.sql` en remplaçant l'email

### 2. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optionnel : Configuration pour le développement
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ Important :** 
- `NEXT_PUBLIC_*` : Variables exposées côté client
- `SUPABASE_SERVICE_ROLE_KEY` : Variable serveur uniquement (jamais exposée côté client)

### 3. Architecture des Clients Supabase

Le projet utilise une architecture séparée pour les clients Supabase :

#### Côté Client (`src/lib/supabase.ts`)
- **Clé** : `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Usage** : Authentification, lecture des données publiques
- **Sécurité** : Respecte les politiques RLS

#### Côté Serveur (`src/lib/supabase-server.ts`)
- **Clé** : `SUPABASE_SERVICE_ROLE_KEY`
- **Usage** : API routes, opérations administratives
- **Sécurité** : Bypass RLS, accès complet aux données

#### Utilitaires (`src/lib/supabase-utils.ts`)
- Fonctions pour créer les clients selon le contexte
- Validation des variables d'environnement

### 4. Démarrage du projet

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Accéder au dashboard
# http://localhost:3000 -> redirige vers /admin/login
```

### 5. Premier utilisateur administrateur

#### Option A : Via Supabase Dashboard
1. Authentication > Users > Invite a user
2. Entrez l'email de l'admin
3. L'utilisateur recevra un email d'invitation
4. Exécutez `admin-setup.sql` pour définir le rôle admin

#### Option B : Via SQL direct
```sql
-- Insérer un utilisateur admin directement
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@mianava.com',
  NOW(),
  NOW(),
  NOW()
);

-- Puis exécuter admin-setup.sql
```

### 5. Configuration des rôles

#### Hiérarchie des rôles
- **admin** : Accès complet, gestion des utilisateurs
- **manager** : Gestion produits, catégories, marques
- **user** : Lecture seule

#### Modification des rôles
```sql
-- Promouvoir un utilisateur en manager
UPDATE users SET role = 'manager' WHERE email = 'manager@example.com';

-- Rétrograder un utilisateur
UPDATE users SET role = 'user' WHERE email = 'user@example.com';
```

### 6. Sécurité et Row Level Security

#### Politiques activées
- Les utilisateurs ne voient que leurs propres données
- Les admins/managers ont accès selon leur rôle
- Les logs sont protégés et traçables

#### Vérification des permissions
```sql
-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### 7. Monitoring et Logs

#### Logs d'activité
- Toutes les actions importantes sont loggées
- Utilisation de la fonction `log_activity()`
- Visible dans le dashboard admin

#### Exemple d'utilisation
```sql
SELECT log_activity(
  user_id,
  'Produit créé',
  'product',
  product_id,
  '{"name": "Nouveau produit", "category": "Vêtements"}'::jsonb
);
```

### 8. Déploiement en production

#### Vercel (recommandé)
1. Connectez votre repository GitHub
2. Configurez les variables d'environnement
3. Déployez automatiquement

#### Variables d'environnement production
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=clé_production
SUPABASE_SERVICE_ROLE_KEY=clé_service_production
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

### 9. Maintenance

#### Sauvegarde régulière
- Exportez régulièrement vos données Supabase
- Sauvegardez les fichiers images uploadés

#### Nettoyage des logs
```sql
-- Supprimer les logs de plus de 6 mois
DELETE FROM activity_logs 
WHERE created_at < NOW() - INTERVAL '6 months';
```

### 10. Dépannage

#### Problèmes courants

**Erreur de connexion Supabase**
- Vérifiez les variables d'environnement
- Contrôlez que l'URL et les clés sont correctes

**Utilisateur ne peut pas se connecter**
- Vérifiez que l'email est confirmé dans Supabase
- Contrôlez le rôle de l'utilisateur

**Erreurs de permissions**
- Vérifiez les politiques RLS
- Contrôlez que l'utilisateur a le bon rôle

#### Logs de débogage
```bash
# Mode développement avec logs détaillés
DEBUG=* npm run dev

# Logs Supabase
# Activez les logs dans la console développeur
```

### 11. Personnalisation

#### Thème et couleurs
- Modifiez `tailwind.config.ts` pour les couleurs
- Ajustez les composants dans `/src/components/ui/`

#### Ajout de nouvelles fonctionnalités
1. Créez les nouvelles tables SQL si nécessaire
2. Ajoutez les types TypeScript
3. Créez les composants React
4. Mettez à jour la navigation

---

Pour toute question ou problème, consultez la documentation complète ou créez une issue sur le repository GitHub.
