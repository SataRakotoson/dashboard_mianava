import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

interface ProductVariant {
  id: string
  product_id: string
  name: string
  sku: string
  price: number
  compare_price: number | null
  cost_price: number | null
  inventory_quantity: number
  attributes: Record<string, any>
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ProductVariantInsert {
  product_id: string
  name: string
  sku: string
  price: number
  compare_price?: number | null
  cost_price?: number | null
  inventory_quantity?: number
  attributes?: Record<string, any>
  image_url?: string | null
  is_active?: boolean
}

function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()

    const { data: variants, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', params.id)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(variants)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des variants' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseClient()
    const body = await request.json()

    const variantData: ProductVariantInsert = {
      product_id: params.id,
      name: body.name,
      sku: body.sku,
      price: body.price,
      compare_price: body.compare_price,
      cost_price: body.cost_price,
      inventory_quantity: body.inventory_quantity || 0,
      attributes: body.attributes || {},
      image_url: body.image_url,
      is_active: body.is_active !== false
    }

    const { data: variant, error } = await supabase
      .from('product_variants')
      .insert(variantData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(variant)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du variant' },
      { status: 500 }
    )
  }
}
