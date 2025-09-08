// Script de test pour vérifier la configuration Supabase
// Exécuter avec: node test-supabase.js

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

// Vérifier les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Vérification de la configuration Supabase...\n')

console.log('Variables d\'environnement :')
console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Définie' : '❌ Manquante')
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Définie' : '❌ Manquante')
console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Définie' : '❌ Manquante')

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ Configuration incomplète. Vérifiez votre fichier .env.local')
  process.exit(1)
}

// Tester la connexion avec la clé anonyme
console.log('\n🔗 Test de connexion avec la clé anonyme...')
const supabase = createClient(supabaseUrl, supabaseAnonKey)

supabase.auth.getSession()
  .then(({ data, error }) => {
    if (error) {
      console.log('❌ Erreur de connexion:', error.message)
    } else {
      console.log('✅ Connexion réussie avec la clé anonyme')
    }
  })
  .catch((error) => {
    console.log('❌ Erreur inattendue:', error.message)
  })

// Tester la connexion avec la clé service role si disponible
if (supabaseServiceKey) {
  console.log('\n🔗 Test de connexion avec la clé service role...')
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  supabaseAdmin.from('users').select('count').limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.log('❌ Erreur avec la clé service role:', error.message)
      } else {
        console.log('✅ Connexion réussie avec la clé service role')
      }
    })
    .catch((error) => {
      console.log('❌ Erreur inattendue avec la clé service role:', error.message)
    })
} else {
  console.log('\n⚠️  Clé service role non définie - test ignoré')
}

console.log('\n📋 Instructions :')
console.log('1. Vérifiez que votre fichier .env.local contient toutes les variables')
console.log('2. Assurez-vous que le schéma de base de données est créé')
console.log('3. Testez l\'application sur http://localhost:3000/debug')
