require('dotenv').config({ path: '.env.local' });
// ou en ESM : import 'dotenv/config'; // puis DOTENV_CONFIG_PATH=.env.local (voir option B)

// Script de test pour vérifier les variables d'environnement
console.log('=== Test des variables d\'environnement ===');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Définie' : '❌ Manquante');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Définie' : '❌ Manquante');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Définie' : '❌ Manquante');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('\n🚨 PROBLÈME DÉTECTÉ : Variables Supabase manquantes !');
  console.log('Vérifiez votre fichier .env.local');
} else {
  console.log('\n✅ Variables d\'environnement OK');
}
