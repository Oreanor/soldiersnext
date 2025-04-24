import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DataItem } from '../../types';

// Путь к файлу данных
const dataFilePath = path.join(process.cwd(), 'app', 'data', 'data.json');

// GET-маршрут для получения всех данных
export async function GET(
): Promise<NextResponse> {
  try {
    // Проверяем, существует ли файл
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ error: 'Data file not found' }, { status: 404 });
    }

    // Читаем файл
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent) as DataItem[];

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

// POST-маршрут для обновления данных
export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const body = await request.json() as DataItem[];
    
    // Записываем обновленные данные в файл
    fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
} 