import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

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

    // Создаем директорию если не существует
    const folderPath = path.join(process.cwd(), 'public', 'data', 'images', folder)
    console.log('Creating folder:', folderPath)
    
    try {
      await fs.mkdir(folderPath, { recursive: true })
      console.log('Folder created successfully')
    } catch (error) {
      console.error('Error creating folder:', error)
      return NextResponse.json(
        { error: 'Failed to create folder' },
        { status: 500 }
      )
    }

    // Конвертируем файл в буфер
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Сохраняем файл как 00.jpg
    const filePath = path.join(folderPath, '00.jpg')
    console.log('Saving file to:', filePath)
    
    try {
      await fs.writeFile(filePath, buffer)
      console.log('File saved successfully')
    } catch (error) {
      console.error('Error saving file:', error)
      return NextResponse.json(
        { error: 'Failed to save file' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in upload handler:', error)
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    )
  }
} 