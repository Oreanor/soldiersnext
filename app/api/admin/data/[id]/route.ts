import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { DataItem } from '@/app/types'

async function removeDirectory(dirPath: string) {
  try {
    await fs.rm(dirPath, { recursive: true, force: true })
  } catch (error) {
    console.error('Error removing directory:', error)
  }
}

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
    
    // Find and remove the item, приводим оба ID к строке для сравнения
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
    
    // Write back to file
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2))

    // Remove the images folder
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
    
    // Find and update the item, приводим оба ID к строке для сравнения
    const index = data.findIndex((i: DataItem) => String(i.id) === String(id))
    if (index === -1) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }
    
    // Сохраняем оригинальный id и figures
    data[index] = {
      ...data[index],
      ...item,
      id: data[index].id,
      figures: data[index].figures
    }
    
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { password } = await request.json();
  const correctPassword = process.env.ADMIN_PASSWORD; // Получаем пароль из переменных окружения

  if (password === correctPassword) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json(
      { error: 'Неверный пароль' },
      { status: 401 }
    );
  }
}