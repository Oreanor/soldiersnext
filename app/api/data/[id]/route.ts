import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Путь к файлу данных
const dataFilePath = path.join(process.cwd(), 'app', 'data', 'data.json');

// GET-маршрут для получения элемента по ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Проверяем, существует ли файл
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ error: 'Data file not found' }, { status: 404 });
    }

    // Читаем файл
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Находим элемент по ID
    const item = data.find((item: any) => item.id.toString() === id);
    
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error reading item:', error);
    return NextResponse.json({ error: 'Failed to read item' }, { status: 500 });
  }
}

// PUT-маршрут для обновления элемента
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Проверяем, существует ли файл
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ error: 'Data file not found' }, { status: 404 });
    }

    // Читаем файл
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Находим индекс элемента по ID
    const index = data.findIndex((item: any) => item.id.toString() === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    // Обновляем элемент
    data[index] = { ...data[index], ...body };
    
    // Записываем обновленные данные в файл
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json(data[index]);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

// DELETE-маршрут для удаления элемента
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Проверяем, существует ли файл
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ error: 'Data file not found' }, { status: 404 });
    }

    // Читаем файл
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Находим индекс элемента по ID
    const index = data.findIndex((item: any) => item.id.toString() === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    // Удаляем элемент
    const deletedItem = data.splice(index, 1)[0];
    
    // Записываем обновленные данные в файл
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json(deletedItem);
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
} 