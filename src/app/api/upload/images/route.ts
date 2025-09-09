import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-utils'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'products'

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Utilisez JPG, PNG ou WebP.' },
        { status: 400 }
      )
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Taille maximale : 5MB' },
        { status: 400 }
      )
    }

    const serverClient = createServerClient()
    
    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = `${folder}/${fileName}`

    // Convertir le fichier en ArrayBuffer
    const fileBuffer = await file.arrayBuffer()

    // Uploader vers Supabase Storage
    const { data, error } = await serverClient.storage
      .from('product-images')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Erreur upload Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'upload de l\'image' },
        { status: 500 }
      )
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = serverClient.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      filePath: data.path,
      publicUrl,
      fileName
    })

  } catch (error: any) {
    console.error('Erreur lors de l\'upload:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('filePath')

    if (!filePath) {
      return NextResponse.json(
        { error: 'Chemin du fichier requis' },
        { status: 400 }
      )
    }

    const serverClient = createServerClient()

    const { error } = await serverClient.storage
      .from('product-images')
      .remove([filePath])

    if (error) {
      console.error('Erreur suppression Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de l\'image' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Erreur lors de la suppression:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
