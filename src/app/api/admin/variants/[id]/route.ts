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

    const { data: variant, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(variant)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du variant' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const body = await request.json()

    const { data: variant, error } = await supabase
      .from('product_variants')
      .update({
        name: body.name,
        sku: body.sku,
        price: body.price,
        compare_price: body.compare_price,
        cost_price: body.cost_price,
        inventory_quantity: body.inventory_quantity,
        attributes: body.attributes,
        image_url: body.image_url,
        is_active: body.is_active
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(variant)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la modification du variant' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du variant' },
      { status: 500 }
    )
  }
}
