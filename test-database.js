// Script de test pour vérifier la connexion et la structure de la base de données

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testDatabase() {
  console.log('🔍 Test de la base de données Mianava...\n')

  // Vérifier les variables d'environnement
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    console.error('❌ Variables d\'environnement manquantes:')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌')
    console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
    console.log('\n📝 Copiez .env.example vers .env.local et configurez vos clés Supabase')
    return
  }

  console.log('✅ Variables d\'environnement configurées\n')

  // Client avec service role pour les tests admin
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // Test 1: Vérifier la connexion
    console.log('1️⃣ Test de connexion...')
    const { data: users, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (connectionError) {
      console.error('❌ Erreur de connexion:', connectionError.message)
      return
    }
    console.log('✅ Connexion réussie\n')

    // Test 2: Vérifier les tables
    console.log('2️⃣ Vérification des tables...')
    const tables = ['users', 'categories', 'brands', 'products', 'product_variants', 'activity_logs']
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`)
        } else {
          console.log(`✅ Table ${table}: OK`)
        }
      } catch (err) {
        console.log(`❌ Table ${table}: ${err.message}`)
      }
    }

    // Test 3: Vérifier les données existantes
    console.log('\n3️⃣ Vérification des données...')
    
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
    console.log(`📊 Catégories: ${categoriesData?.length || 0} entrées`)

    const { data: brandsData } = await supabase
      .from('brands')
      .select('*')
    console.log(`📊 Marques: ${brandsData?.length || 0} entrées`)

    const { data: productsData } = await supabase
      .from('products')
      .select('*')
    console.log(`📊 Produits: ${productsData?.length || 0} entrées`)

    // Test 4: Test d'insertion
    console.log('\n4️⃣ Test d\'insertion de catégorie...')
    
    const testCategory = {
      name: 'Test Category',
      slug: 'test-category-' + Date.now(),
      description: 'Catégorie de test',
      sort_order: 999,
      is_active: true
    }

    const { data: insertData, error: insertError } = await supabase
      .from('categories')
      .insert(testCategory)
      .select()
      .single()

    if (insertError) {
      console.error('❌ Erreur d\'insertion:', insertError.message)
      console.error('Détails:', insertError)
    } else {
      console.log('✅ Insertion réussie:', insertData.name)
      
      // Nettoyage
      await supabase
        .from('categories')
        .delete()
        .eq('id', insertData.id)
      console.log('🧹 Données de test supprimées')
    }

    console.log('\n🎉 Tests terminés!')

  } catch (error) {
    console.error('❌ Erreur générale:', error.message)
    console.error('Stack:', error.stack)
  }
}

testDatabase()
