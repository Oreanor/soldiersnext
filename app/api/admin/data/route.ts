import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { DataItem } from '@/app/types'
import { DATA_FILE_PATH } from '@/app/consts/paths'

function generateId(): string {
  return Math.random().toString(36).substring(2, 8);
}

async function readData(): Promise<DataItem[]> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, 'utf8')
    return JSON.parse(raw)
  } catch (error) {
    console.error('Error reading data:', error)
    throw error
  }
}

async function writeData(data: DataItem[]) {
  try {
    const dirPath = path.dirname(DATA_FILE_PATH)
    await fs.access(dirPath).catch(async () => {
      await fs.mkdir(dirPath, { recursive: true })
    })

    const jsonData = JSON.stringify(data, null, 2)
    await fs.writeFile(DATA_FILE_PATH, jsonData, 'utf8')
    
    const written = await fs.readFile(DATA_FILE_PATH, 'utf8')
    if (written !== jsonData) {
      throw new Error('Data verification failed')
    }
  } catch (error) {
    console.error('Error writing data:', error)
    throw error
  }
}

export async function GET() {
  const data = await readData()
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const data = await readData()
    let newItem;
    try {
      newItem = await request.json()
    } catch (error) {
      console.error('Error parsing request body:', error)
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }
    
    // Проверяем обязательные поля
    if (!newItem.name || !newItem.manufacturer) {
      return NextResponse.json({ error: 'Missing required fields: name and manufacturer' }, { status: 400 })
    }
    
    // Генерируем новый ID
    newItem.id = generateId()
    
    // Добавляем новый элемент в начало массива
    data.unshift(newItem)
    await writeData(data)
    return NextResponse.json(newItem)
  } catch (error) {
    console.error('Error in POST handler:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await readData()
    const updatedItem = await request.json()
    
    console.log('Updating item with ID:', updatedItem.id)
    
    const index = data.findIndex(item => item.id === updatedItem.id)
    console.log('Found index:', index)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    // Обновляем существующий объект, сохраняя id и figures
    data[index] = {
      ...data[index],
      ...updatedItem,
      id: data[index].id, // Сохраняем оригинальный id
      figures: data[index].figures // Сохраняем оригинальный массив figures
    }
    
    console.log('Updated item:', data[index])
    
    await writeData(data)
    
    return NextResponse.json(data[index])
  } catch (error) {
    console.error('Error in PUT handler:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 