import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Путь к файлу избранных элементов
const favoritesFilePath = path.join(process.cwd(), 'app', 'data', 'favorites.json');

// GET-маршрут для получения всех избранных элементов
export async function GET() {
  try {
    // Проверяем, существует ли файл
    if (!fs.existsSync(favoritesFilePath)) {
      // Если файл не существует, создаем его с пустым массивом
      fs.writeFileSync(favoritesFilePath, JSON.stringify([], null, 2), 'utf8');
      return NextResponse.json([]);
    }

    // Читаем файл
    const fileContent = fs.readFileSync(favoritesFilePath, 'utf8');
    const favorites = JSON.parse(fileContent);

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error reading favorites:', error);
    return NextResponse.json({ error: 'Failed to read favorites' }, { status: 500 });
  }
}

// POST-маршрут для добавления элемента в избранное
export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    
    // Проверяем, существует ли файл
    if (!fs.existsSync(favoritesFilePath)) {
      // Если файл не существует, создаем его с пустым массивом
      fs.writeFileSync(favoritesFilePath, JSON.stringify([], null, 2), 'utf8');
    }

    // Читаем файл
    const fileContent = fs.readFileSync(favoritesFilePath, 'utf8');
    const favorites = JSON.parse(fileContent);
    
    // Проверяем, есть ли уже этот ID в избранном
    if (!favorites.includes(id)) {
      // Добавляем ID в избранное
      favorites.push(id);
      
      // Записываем обновленные данные в файл
      fs.writeFileSync(favoritesFilePath, JSON.stringify(favorites, null, 2), 'utf8');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 });
  }
}

// DELETE-маршрут для удаления элемента из избранного
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    // Проверяем, существует ли файл
    if (!fs.existsSync(favoritesFilePath)) {
      return NextResponse.json({ error: 'Favorites file not found' }, { status: 404 });
    }

    // Читаем файл
    const fileContent = fs.readFileSync(favoritesFilePath, 'utf8');
    const favorites = JSON.parse(fileContent);
    
    // Удаляем ID из избранного
    const updatedFavorites = favorites.filter((favoriteId: string) => favoriteId !== id);
    
    // Записываем обновленные данные в файл
    fs.writeFileSync(favoritesFilePath, JSON.stringify(updatedFavorites, null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json({ error: 'Failed to remove from favorites' }, { status: 500 });
  }
} 