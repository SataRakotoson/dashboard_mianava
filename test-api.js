// Script de test pour les API routes
// Utilisation: node test-api.js

const BASE_URL = 'http://localhost:3000'

async function testAPI(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    console.log(`🔍 Test ${method} ${endpoint}`)
    if (data) {
      console.log('📝 Données:', data)
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const result = await response.json()

    if (response.ok) {
      console.log('✅ Succès:', result)
    } else {
      console.log('❌ Erreur:', response.status, result)
    }
    
    console.log('---')
    return { success: response.ok, data: result, status: response.status }
  } catch (error) {
    console.log('💥 Erreur réseau:', error.message)
    console.log('---')
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('🚀 Test des API Routes Mianava\n')

  // Test 1: Lire les catégories
  await testAPI('/api/admin/categories')

  // Test 2: Lire les marques
  await testAPI('/api/admin/brands')

  // Test 3: Créer une marque
  const testBrand = {
    name: 'Marque Test',
    slug: 'marque-test-' + Date.now(),
    description: 'Test de création depuis le script',
    is_active: true
  }
  const createResult = await testAPI('/api/admin/brands', 'POST', testBrand)

  // Test 4: Créer une catégorie
  const testCategory = {
    name: 'Catégorie Test',
    slug: 'categorie-test-' + Date.now(),
    description: 'Test de création depuis le script',
    sort_order: 999,
    is_active: true
  }
  await testAPI('/api/admin/categories', 'POST', testCategory)

  // Test 5: Modifier la marque créée (si création réussie)
  if (createResult.success && createResult.data.brand) {
    const brandId = createResult.data.brand.id
    const updateData = {
      id: brandId,
      name: 'Marque Test Modifiée',
      description: 'Description mise à jour'
    }
    await testAPI('/api/admin/brands', 'PUT', updateData)

    // Test 6: Supprimer la marque
    await testAPI(`/api/admin/brands?id=${brandId}`, 'DELETE')
  }

  console.log('🎉 Tests terminés!')
}

// Vérifier si le serveur est démarré
fetch(`${BASE_URL}/api/debug/connection`)
  .then(response => {
    if (response.ok) {
      console.log('✅ Serveur détecté, lancement des tests...\n')
      runTests()
    } else {
      console.log('❌ Serveur non accessible. Démarrez le serveur avec: npm run dev')
    }
  })
  .catch(error => {
    console.log('❌ Serveur non accessible. Démarrez le serveur avec: npm run dev')
    console.log('Erreur:', error.message)
  })
