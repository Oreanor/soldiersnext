import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { DataItem } from '@/app/types'

// Check if running on Vercel
const isVercel = process.env.VERCEL === '1'

// In-memory storage for Vercel
let inMemoryData: DataItem[] = []

// Initialize Vercel data from environment variable if available
if (isVercel) {
  try {
    const envData = process.env.STORED_DATA
    if (envData) {
      inMemoryData = JSON.parse(envData)
    }
  } catch (error) {
    console.error('Error parsing stored data:', error)
  }
}

async function getData(): Promise<DataItem[]> {
  if (isVercel) {
    return inMemoryData
  }
  
  const dataPath = path.join(process.cwd(), 'app', 'data', 'data.json')
  const data = JSON.parse(await fs.readFile(dataPath, 'utf-8'))
  return data
}

async function saveData(data: DataItem[]): Promise<void> {
  if (isVercel) {
    inMemoryData = data
  } else {
    const dataPath = path.join(process.cwd(), 'app', 'data', 'data.json')
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2))
  }
}

async function removeDirectory(dirPath: string): Promise<void> {
  if (!isVercel) {
    try {
      await fs.rm(dirPath, { recursive: true, force: true })
    } catch (error) {
      console.error('Error removing directory:', error)
    }
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const data = await getData()
    const index = data.findIndex((i: DataItem) => String(i.id) === String(id))
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    // Get the folder path before removing the item
    const itemFolder = data[index].folder
    const imagesPath = path.join(process.cwd(), 'public', 'data', 'images', itemFolder)
    
    // Remove the item from data
    data.splice(index, 1)
    
    // Save changes
    await saveData(data)

    // Remove the images folder in local environment
    await removeDirectory(imagesPath)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const item = await request.json() as DataItem
    const data = await getData()
    
    const index = data.findIndex((i: DataItem) => String(i.id) === String(id))
    if (index === -1) {
      // If item doesn't exist, add it to the array
      data.push(item)
    } else {
      // Update existing item
      data[index] = {
        ...data[index],
        ...item,
        id: data[index].id,
        figures: data[index].figures || []
      }
    }
    
    // Save changes
    await saveData(data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating item:', error)
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const data = await getData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error getting data:', error)
    return NextResponse.json(
      { error: 'Failed to get data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { password } = await request.json()
  const correctPassword = process.env.ADMIN_PASSWORD

  if (password === correctPassword) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json(
      { error: 'Неверный пароль' },
      { status: 401 }
    )
  }
}