import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

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
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const body = await request.json()

    const { data: variant, error } = await supabase
      .from('product_variants')
      .insert({
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
      })
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
