import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-utils'

export async function GET() {
  try {
    const supabase = createServerClient()

    console.log('🔍 Test de récupération des catégories...')

    // Test simple de récupération des catégories
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('❌ Erreur Supabase:', error)
      return NextResponse.json({ 
        error: 'Erreur lors de la récupération des catégories',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    console.log('✅ Catégories récupérées:', categories?.length || 0)
    return NextResponse.json({ categories, success: true })

  } catch (error) {
    console.error('❌ Erreur générale:', error)
    return NextResponse.json({ 
      error: 'Erreur interne du serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    console.log('🔍 Test d\'insertion de catégorie:', body)

    const { name, slug, description, image_url, parent_id, sort_order, is_active } = body

    // Validation basique
    if (!name || !slug) {
      return NextResponse.json({ error: 'Le nom et le slug sont requis' }, { status: 400 })
    }

    const categoryData = {
      name,
      slug,
      description: description || null,
      image_url: image_url || null,
      parent_id: parent_id || null,
      sort_order: sort_order || 0,
      is_active: is_active !== undefined ? is_active : true,
    }

    console.log('📝 Données à insérer:', categoryData)

    const { data: category, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur d\'insertion:', error)
      return NextResponse.json({ 
        error: 'Erreur lors de la création de la catégorie',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    console.log('✅ Catégorie créée:', category)
    return NextResponse.json({ category, success: true }, { status: 201 })

  } catch (error) {
    console.error('❌ Erreur générale POST:', error)
    return NextResponse.json({ 
      error: 'Erreur interne du serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}
