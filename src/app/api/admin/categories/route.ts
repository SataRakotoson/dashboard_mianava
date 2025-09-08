import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-utils'
import { Database } from '@/types/database'

type Category = Database['public']['Tables']['categories']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']
type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Récupérer les catégories avec tri par ordre
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Erreur lors de la récupération des catégories:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des catégories' }, { status: 500 })
    }

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Erreur API categories:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const body = await request.json()
    const { name, slug, description, image_url, parent_id, sort_order, is_active } = body

    // Validation des données requises
    if (!name || !slug) {
      return NextResponse.json({ error: 'Le nom et le slug sont requis' }, { status: 400 })
    }

    // Vérifier l'unicité du slug
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
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

    if (existingCategory) {
      return NextResponse.json({ error: 'Ce slug existe déjà' }, { status: 400 })
    }

    const categoryData: CategoryInsert = {
      name,
      slug,
      description: description || null,
      image_url: image_url || null,
      parent_id: parent_id || null,
      sort_order: sort_order || 0,
      is_active: is_active !== undefined ? is_active : true,
    }

    const { data: category, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de la catégorie:', error)
      return NextResponse.json({ error: 'Erreur lors de la création de la catégorie' }, { status: 500 })
    }

    // Enregistrer l'activité
    await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'create',
        entity_type: 'category',
        entity_id: category.id,
        details: { category_name: category.name }
      })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('Erreur API categories POST:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const body = await request.json()
    const { id, name, slug, description, image_url, parent_id, sort_order, is_active } = body

    if (!id) {
      return NextResponse.json({ error: 'ID de la catégorie requis' }, { status: 400 })
    }

    // Vérifier que la catégorie existe
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (!existingCategory) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }

    // Vérifier l'unicité du slug (sauf pour cette catégorie)
    if (slug && slug !== existingCategory.slug) {
      const { data: duplicateSlug } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .maybeSingle()

      if (duplicateSlug) {
        return NextResponse.json({ error: 'Ce slug existe déjà' }, { status: 400 })
      }
    }

    const updateData: CategoryUpdate = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description || null
    if (image_url !== undefined) updateData.image_url = image_url || null
    if (parent_id !== undefined) updateData.parent_id = parent_id || null
    if (sort_order !== undefined) updateData.sort_order = sort_order
    if (is_active !== undefined) updateData.is_active = is_active

    const { data: category, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour de la catégorie' }, { status: 500 })
    }

    // Enregistrer l'activité
    await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'update',
        entity_type: 'category',
        entity_id: category.id,
        details: { category_name: category.name, changes: updateData }
      })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Erreur API categories PUT:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID de la catégorie requis' }, { status: 400 })
    }

    // Vérifier que la catégorie existe
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('name')
      .eq('id', id)
      .single()

    if (!existingCategory) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }

    // Vérifier qu'aucun produit n'utilise cette catégorie
    const { data: productsCount } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id)

    if (productsCount && productsCount.length > 0) {
      return NextResponse.json({ 
        error: 'Impossible de supprimer cette catégorie car elle est utilisée par des produits' 
      }, { status: 400 })
    }

    // Vérifier qu'aucune sous-catégorie n'existe
    const { data: subCategories } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })
      .eq('parent_id', id)

    if (subCategories && subCategories.length > 0) {
      return NextResponse.json({ 
        error: 'Impossible de supprimer cette catégorie car elle contient des sous-catégories' 
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error)
      return NextResponse.json({ error: 'Erreur lors de la suppression de la catégorie' }, { status: 500 })
    }

    // Enregistrer l'activité
    await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'delete',
        entity_type: 'category',
        entity_id: id,
        details: { category_name: existingCategory.name }
      })

    return NextResponse.json({ message: 'Catégorie supprimée avec succès' })
  } catch (error) {
    console.error('Erreur API categories DELETE:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
