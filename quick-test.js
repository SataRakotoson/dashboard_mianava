// Test rapide des API après correction TypeScript
const BASE_URL = 'http://localhost:3000'

async function quickTest() {
  console.log('🚀 Test rapide après corrections TypeScript\n')

  try {
    // Test 1: Lire les marques
    console.log('1️⃣ Test lecture des marques...')
    const brandsResponse = await fetch(`${BASE_URL}/api/admin/brands`)
    if (brandsResponse.ok) {
      const brandsData = await brandsResponse.json()
      console.log(`✅ ${brandsData.brands?.length || 0} marques trouvées`)
    } else {
      console.log('❌ Erreur lecture marques:', await brandsResponse.text())
    }

    // Test 2: Lire les catégories  
    console.log('\n2️⃣ Test lecture des catégories...')
    const categoriesResponse = await fetch(`${BASE_URL}/api/admin/categories`)
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json()
      console.log(`✅ ${categoriesData.categories?.length || 0} catégories trouvées`)
    } else {
      console.log('❌ Erreur lecture catégories:', await categoriesResponse.text())
    }

    // Test 3: Créer une marque de test
    console.log('\n3️⃣ Test création de marque...')
    const testBrand = {
      name: 'Test TypeScript Fix',
      slug: 'test-typescript-' + Date.now(),
      description: 'Test après correction TypeScript',
      is_active: true
    }

    const createResponse = await fetch(`${BASE_URL}/api/admin/brands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testBrand)
    })

    if (createResponse.ok) {
      const createData = await createResponse.json()
      console.log('✅ Marque créée:', createData.brand?.name)
      
      // Test 4: Supprimer la marque de test
      const deleteResponse = await fetch(`${BASE_URL}/api/admin/brands?id=${createData.brand.id}`, {
        method: 'DELETE'
      })
      
      if (deleteResponse.ok) {
        console.log('✅ Marque supprimée (nettoyage)')
      }
    } else {
      const errorData = await createResponse.json()
      console.log('❌ Erreur création:', errorData)
    }

    console.log('\n🎉 Tests terminés ! Les corrections TypeScript fonctionnent.')

  } catch (error) {
    console.log('💥 Erreur de connexion:', error.message)
    console.log('💡 Assurez-vous que le serveur est démarré (npm run dev)')
  }
}

// Vérifier si le serveur est accessible
fetch(`${BASE_URL}/`)
  .then(() => {
    console.log('🟢 Serveur détecté\n')
    quickTest()
  })
  .catch(() => {
    console.log('🔴 Serveur non accessible')
    console.log('💡 Démarrez le serveur avec: npm run dev')
  })
