import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-utils'

export async function GET(request: NextRequest) {
  try {
    const serverClient = createServerClient()
    
    const { data: users, error } = await serverClient
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const serverClient = createServerClient()
    
    const { data, error } = await serverClient
      .from('users')
      .insert([body])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ user: data })
  } catch (error: any) {
    console.error('Erreur lors de la création de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
