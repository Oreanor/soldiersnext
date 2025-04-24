import { NextResponse } from 'next/server'
import { supabase } from '../../../utils/supabase'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string

    if (!file || !folder) {
      console.error('Missing file or folder:', { file: !!file, folder })
      return NextResponse.json(
        { error: 'File and folder are required' },
        { status: 400 }
      )
    }

    // Проверяем тип файла
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed types: JPEG, PNG, WebP' },
        { status: 400 }
      )
    }

    // Проверяем размер файла
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    // Читаем содержимое файла как ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Загружаем файл в Supabase Storage
    const fileName = `${folder}/00.jpg`
    console.log('Uploading file to Supabase:', fileName)
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, buffer, {
        upsert: true,
        contentType: file.type
      })

    if (error) {
      console.error('Error uploading to Supabase:', error)
      return NextResponse.json(
        { error: 'Failed to upload file to Supabase' },
        { status: 500 }
      )
    }

    console.log('File uploaded successfully to Supabase')
    return NextResponse.json({ success: true, path: data.path })
  } catch (error) {
    console.error('Error in upload handler:', error)
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    )
  }
} 