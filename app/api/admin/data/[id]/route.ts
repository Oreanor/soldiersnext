import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { DataItem } from '@/app/types'

// Check if running on Vercel
const isVercel = process.env.VERCEL === '1'

// In-memory storage for Vercel
let inMemoryData: DataItem[] = []

// Initialize data
async function initializeData() {
  if (isVercel) {
    try {
      const envData = process.env.STORED_DATA
      if (envData) {
        inMemoryData = JSON.parse(envData)
      }
      console.log('Vercel data initialized:', inMemoryData.length, 'items')
    } catch (error) {
      console.error('Error parsing stored data:', error)
      return []
    }
  } else {
    try {
      const dataPath = path.join(process.cwd(), 'app', 'data', 'data.json')
      const data = JSON.parse(await fs.readFile(dataPath, 'utf-8'))
      console.log('Local data initialized:', data.length, 'items')
      return data
    } catch (error) {
      console.error('Error reading local data:', error)
      return []
    }
  }
  return inMemoryData
}

// Get data with initialization check
async function getData(): Promise<DataItem[]> {
  if (isVercel) {
    if (inMemoryData.length === 0) {
      await initializeData()
    }
    return inMemoryData
  }
  
  return initializeData()
}

async function saveData(data: DataItem[]): Promise<void> {
  if (isVercel) {
    inMemoryData = data
    console.log('Saved data in Vercel:', inMemoryData.length, 'items')
  } else {
    const dataPath = path.join(process.cwd(), 'app', 'data', 'data.json')
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2))
    console.log('Saved data locally:', data.length, 'items')
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
    console.log('Processing PUT for id:', id, 'Current items:', data.length)
    
    const index = data.findIndex((i: DataItem) => String(i.id) === String(id))
    if (index === -1) {
      // If item doesn't exist, add it to the array
      console.log('Adding new item:', id)
      data.push(item)
    } else {
      // Update existing item
      console.log('Updating existing item:', id)
      data[index] = {
        ...data[index],
        ...item,
        id: data[index].id,
        figures: data[index].figures || []
      }
    }
    
    // Save changes
    await saveData(data)
    console.log('Save completed, total items:', data.length)
    
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
    console.log('GET request, returning items:', data.length)
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