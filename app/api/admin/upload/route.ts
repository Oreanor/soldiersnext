import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string

    if (!file || !folder) {
      return NextResponse.json(
        { error: 'File and folder are required' },
        { status: 400 }
      )
    }

    // Create folder if it doesn't exist
    const folderPath = path.join(process.cwd(), 'public', 'data', 'images', folder)
    await fs.mkdir(folderPath, { recursive: true })

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file as 00.jpg
    const filePath = path.join(folderPath, '00.jpg')
    await fs.writeFile(filePath, buffer)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 