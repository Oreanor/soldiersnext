import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { DataItem } from '@/app/types'

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() // Извлекаем ID из URL

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const dataPath = path.join(process.cwd(), 'app', 'data', 'data.json')
    
    // Read existing data
    const data = JSON.parse(await fs.readFile(dataPath, 'utf-8')) as DataItem[]
    
    // Find and remove the item
    const index = data.findIndex((i: DataItem) => i.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }
    
    // Remove the item
    data.splice(index, 1)
    
    // Write back to file
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2))
    
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
    const id = url.pathname.split('/').pop() // Извлекаем ID из URL

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const item = await request.json() as DataItem
    const dataPath = path.join(process.cwd(), 'app', 'data', 'data.json')
    
    // Read existing data
    const data = JSON.parse(await fs.readFile(dataPath, 'utf-8')) as DataItem[]
    
    // Find and update the item
    const index = data.findIndex((i: DataItem) => i.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }
    
    data[index] = { ...data[index], ...item }
    
    // Write back to file
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating item:', error)
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
} 