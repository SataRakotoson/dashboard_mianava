import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-utils'
import { ProductInsert } from '@/types/supabase-types'

export async function GET(request: NextRequest) {
  try {
    const serverClient = createServerClient()
    
    const { data: products, error } = await serverClient
      .from('products')
      .select(`
        *,
        categories(name),
        brands(name)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ products })
  } catch (error: any) {
    console.error('Erreur lors de la récupération des produits:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ProductInsert = await request.json()
    const serverClient = createServerClient()
    
    const { data, error } = await (serverClient as any)
      .from('products')
      .insert(body)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ product: data })
  } catch (error: any) {
    console.error('Erreur lors de la création du produit:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
