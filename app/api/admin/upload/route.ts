import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string

    if (!file || !folder) {
      console.error('Missing file or folder:', { file: !!file, folder })
      return NextResponse.json(
        { error: 'File and folder are required' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Create folder if it doesn't exist
    const folderPath = path.join(process.cwd(), 'public', 'data', 'images', folder)
    console.log('Creating folder:', folderPath)
    
    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true })
        console.log('Folder created successfully')
      }
    } catch (error) {
      console.error('Error creating folder:', error)
      return NextResponse.json(
        { error: 'Failed to create folder' },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file as 00.jpg
    const filePath = path.join(folderPath, '00.jpg')
    console.log('Saving file to:', filePath)
    
    try {
      fs.writeFileSync(filePath, buffer)
      console.log('File saved successfully')
    } catch (error) {
      console.error('Error saving file:', error)
      return NextResponse.json(
        { error: 'Failed to save file' },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error in upload handler:', error)
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
} 