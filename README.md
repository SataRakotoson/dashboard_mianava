# 📊 Mianava - Dashboard d'Administration

Un dashboard d'administration moderne pour la gestion de produits, inventaire et utilisateurs, développé avec Next.js 14, TypeScript et Supabase.

## ✨ Fonctionnalités

### 🔧 Dashboard Administration
- **Vue d'ensemble** avec statistiques et KPI
- **Gestion des produits** (CRUD complet)
- **Gestion de l'inventaire** avec alertes de stock
- **Gestion des utilisateurs** et rôles
- **Gestion des catégories et marques**
- **Logs d'activité** pour traçabilité
- **Analytics** et rapports
- **Interface responsive** optimisée mobile et desktop

### 👥 Gestion des Utilisateurs
- **Rôles**: Admin, Manager, Utilisateur
- **Authentification** sécurisée avec Supabase
- **Permissions** granulaires par rôle
- **Profils** utilisateur personnalisables

### 📦 Gestion des Produits
- **Catalogue** complet avec images
- **Variantes** de produits (taille, couleur, etc.)
- **Gestion de stock** en temps réel
- **Catégorisation** hiérarchique
- **Marques** et étiquetage

### 🏗️ Architecture Technique
- **Frontend**: Next.js 14 avec App Router
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth avec RLS
- **Clients Supabase**: Séparation client/serveur pour la sécurité
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI + Custom Components
- **TypeScript**: Types complets pour la sécurité

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Supabase

### 1. Cloner le projet
\`\`\`bash
git clone <votre-repo>
cd dashboard_mianava
\`\`\`

### 2. Installer les dépendances
\`\`\`bash
npm install
\`\`\`

### 3. Configuration Supabase

1. Créer un nouveau projet sur [Supabase](https://supabase.com)
2. Exécuter le script SQL \`supabase-schema.sql\` dans l'éditeur SQL
3. Configurer les variables d'environnement

### 4. Variables d'environnement

Créer un fichier \`.env.local\` :

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

### 5. Lancer le serveur de développement
\`\`\`bash
npm run dev
\`\`\`

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

\`\`\`
src/
├── app/                    # Pages Next.js 14 (App Router)
│   ├── admin/             # Dashboard administration
│   ├── shop/              # Interface e-commerce
│   ├── api/               # API Routes
│   └── (auth)/            # Pages d'authentification
├── components/            # Composants réutilisables
│   ├── ui/                # Composants UI de base
│   ├── layout/            # Composants de mise en page
│   └── shop/              # Composants spécifiques e-commerce
├── contexts/              # Contexts React (Auth, Cart)
├── lib/                   # Utilitaires et configurations
├── types/                 # Types TypeScript
└── styles/                # Styles globaux
\`\`\`

## 🔐 Authentification et Permissions

### Rôles Utilisateurs
- **Admin**: Accès complet au dashboard et gestion des utilisateurs
- **Manager**: Gestion des produits, catégories et inventaire
- **User**: Accès en lecture seule aux données

### Sécurité
- **Row Level Security (RLS)** activé sur Supabase
- **Permissions granulaires** par rôle et table
- **Validation côté serveur** pour toutes les opérations
- **Sessions sécurisées** avec Supabase Auth
- **Séparation client/serveur** pour les clés Supabase
- **Clé service role** jamais exposée côté client

## 📝 Logs d'Activité

### Traçabilité Complète
- **Enregistrement automatique** de toutes les actions
- **Détails des modifications** avec before/after
- **Horodatage précis** de chaque opération
- **Association utilisateur** pour chaque action

## 📊 Base de Données

### Schéma Principal
- **users**: Utilisateurs et profils avec rôles
- **categories**: Catégories de produits hiérarchiques
- **brands**: Marques et fabricants
- **products**: Produits avec métadonnées complètes
- **product_variants**: Variantes (taille, couleur, etc.)
- **activity_logs**: Logs d'activité et traçabilité

### Fonctionnalités Avancées
- **Triggers automatiques** pour updated_at
- **Index optimisés** pour les performances
- **Contraintes d'intégrité** référentielle
- **Row Level Security** pour la sécurité
- **Fonctions personnalisées** pour les logs

## 🎨 UI/UX Design

### Design System
- **Palette de couleurs** cohérente
- **Typography** avec Inter font
- **Spacing** uniforme avec Tailwind
- **Composants réutilisables**

### Responsive Design
- **Mobile-first** approach
- **Breakpoints** optimisés
- **Navigation adaptive**

## 🚀 Déploiement

### Vercel (Recommandé)
\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Configuration Production
1. Configurer les variables d'environnement
2. Mettre à jour les URLs de callback Stripe
3. Configurer le domaine personnalisé
4. Activer les webhooks Stripe

## 🛠️ Scripts Disponibles

\`\`\`bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linting ESLint
\`\`\`

## 📍 **Pages Principales :**
- `/admin` - Dashboard administration (page d'accueil)
- `/admin/products` - Gestion des produits
- `/admin/categories` - Gestion des catégories
- `/admin/users` - Gestion des utilisateurs
- `/admin/analytics` - Rapports et statistiques
- `/admin/login` - Connexion administrateur

## 📈 Fonctionnalités à Venir

- [ ] Gestion avancée des permissions
- [ ] Exports de données (CSV, Excel)
- [ ] Notifications en temps réel
- [ ] API REST complète
- [ ] Intégration avec des services externes
- [ ] Rapports personnalisés
- [ ] Thèmes personnalisables
- [ ] Multi-langue
- [ ] Audit trail avancé
- [ ] Sauvegarde automatique

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (\`git checkout -b feature/amazing-feature\`)
3. Commit les changements (\`git commit -m 'Add amazing feature'\`)
4. Push vers la branche (\`git push origin feature/amazing-feature\`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier \`LICENSE\` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- Email: support@mianava.com
- Documentation: [docs.mianava.com](https://docs.mianava.com)
- Issues GitHub: [Créer une issue](https://github.com/votre-repo/issues)

---

## 🎯 **Utilisation**

### Premier Démarrage
1. Accédez à `http://localhost:3000`
2. Vous serez redirigé vers `/admin/login`
3. Créez un compte administrateur dans Supabase
4. Connectez-vous avec vos identifiants

### Gestion des Rôles
- **Admin** : Peut gérer tous les aspects du dashboard
- **Manager** : Peut gérer les produits et l'inventaire
- **User** : Accès en lecture seule

### Structure Recommandée
1. Créer les catégories de base
2. Ajouter les marques principales
3. Importer les produits
4. Configurer les rôles utilisateurs
5. Monitorer via les logs d'activité

---

**Développé avec ❤️ par l'équipe Mianava**
