import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-utils'
import { Database } from '@/types/database'

type Brand = Database['public']['Tables']['brands']['Row']
type BrandInsert = Database['public']['Tables']['brands']['Insert']
type BrandUpdate = Database['public']['Tables']['brands']['Update']

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Récupérer les marques avec tri par nom
    const { data: brands, error } = await supabase
      .from('brands')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Erreur lors de la récupération des marques:', error)
      return NextResponse.json({ 
        error: 'Erreur lors de la récupération des marques',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ brands })
  } catch (error) {
    console.error('Erreur API brands GET:', error)
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

    console.log('📝 Création de marque:', body)

    const { name, slug, description, logo_url, website_url, is_active } = body

    // Validation des données requises
    if (!name || !slug) {
      return NextResponse.json({ error: 'Le nom et le slug sont requis' }, { status: 400 })
    }

    // Vérifier l'unicité du slug
    const { data: existingBrand, error: checkError } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (checkError) {
      console.error('Erreur vérification slug:', checkError)
      return NextResponse.json({ 
        error: 'Erreur lors de la vérification',
        details: checkError.message 
      }, { status: 500 })
    }

    if (existingBrand) {
      return NextResponse.json({ error: 'Ce slug existe déjà' }, { status: 400 })
    }

    const brandData: BrandInsert = {
      name,
      slug,
      description: description || null,
      logo_url: logo_url || null,
      website_url: website_url || null,
      is_active: is_active !== undefined ? is_active : true,
    }

    console.log('💾 Données à insérer:', brandData)

    const { data: brand, error } = await supabase
      .from('brands')
      .insert(brandData)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de la marque:', error)
      return NextResponse.json({ 
        error: 'Erreur lors de la création de la marque',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    console.log('✅ Marque créée:', brand)
    return NextResponse.json({ brand }, { status: 201 })
  } catch (error) {
    console.error('Erreur API brands POST:', error)
    return NextResponse.json({ 
      error: 'Erreur interne du serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { id, name, slug, description, logo_url, website_url, is_active } = body

    if (!id) {
      return NextResponse.json({ error: 'ID de la marque requis' }, { status: 400 })
    }

    // Vérifier que la marque existe
    const { data: existingBrand, error: fetchError } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingBrand) {
      return NextResponse.json({ error: 'Marque non trouvée' }, { status: 404 })
    }

    // Vérifier l'unicité du slug (sauf pour cette marque)
    if (slug && slug !== existingBrand.slug) {
      const { data: duplicateSlug } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .maybeSingle()

      if (duplicateSlug) {
        return NextResponse.json({ error: 'Ce slug existe déjà' }, { status: 400 })
      }
    }

    const updateData: BrandUpdate = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description || null
    if (logo_url !== undefined) updateData.logo_url = logo_url || null
    if (website_url !== undefined) updateData.website_url = website_url || null
    if (is_active !== undefined) updateData.is_active = is_active

    const { data: brand, error } = await supabase
      .from('brands')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise à jour de la marque:', error)
      return NextResponse.json({ 
        error: 'Erreur lors de la mise à jour de la marque',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ brand })
  } catch (error) {
    console.error('Erreur API brands PUT:', error)
    return NextResponse.json({ 
      error: 'Erreur interne du serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID de la marque requis' }, { status: 400 })
    }

    // Vérifier que la marque existe
    const { data: existingBrand, error: fetchError } = await supabase
      .from('brands')
      .select('name')
      .eq('id', id)
      .single()

    if (fetchError || !existingBrand) {
      return NextResponse.json({ error: 'Marque non trouvée' }, { status: 404 })
    }

    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur lors de la suppression de la marque:', error)
      return NextResponse.json({ 
        error: 'Erreur lors de la suppression de la marque',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ message: 'Marque supprimée avec succès' })
  } catch (error) {
    console.error('Erreur API brands DELETE:', error)
    return NextResponse.json({ 
      error: 'Erreur interne du serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}