import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Vérifier les variables d'environnement
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!supabaseAnonKey,
      SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey,
    }

    // Si les variables manquent, retourner l'état
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return NextResponse.json({
        success: false,
        error: 'Variables d\'environnement manquantes',
        envCheck,
        instructions: {
          step1: 'Copiez .env.example vers .env.local',
          step2: 'Configurez vos clés Supabase dans .env.local',
          step3: 'Redémarrez le serveur de développement'
        }
      }, { status: 500 })
    }

    // Tester la connexion Supabase
    const { createServerClient } = await import('@/lib/supabase-utils')
    const supabase = createServerClient()

    // Test simple de connexion
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Erreur de connexion Supabase',
        details: error.message,
        code: error.code,
        envCheck,
        suggestions: [
          'Vérifiez que votre URL Supabase est correcte',
          'Vérifiez que vos clés API sont valides',
          'Vérifiez que le schéma de base de données est appliqué'
        ]
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Connexion réussie à Supabase',
      envCheck,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erreur interne',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
