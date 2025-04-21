import { ItemType } from '../types';

// Базовый URL для API
const API_BASE_URL = '/api';

// Функция для получения всех элементов
export async function fetchItems(): Promise<ItemType[]> {
  const response = await fetch(`${API_BASE_URL}/data`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }
  
  return response.json();
}

// Функция для получения элемента по ID
export async function fetchItemById(id: string): Promise<ItemType> {
  const response = await fetch(`${API_BASE_URL}/data/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch item');
  }
  
  return response.json();
}

// Функция для обновления элемента
export async function updateItem(id: string, data: Partial<ItemType>): Promise<ItemType> {
  const response = await fetch(`${API_BASE_URL}/data/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update item');
  }
  
  return response.json();
}

// Функция для удаления элемента
export async function deleteItem(id: string): Promise<ItemType> {
  const response = await fetch(`${API_BASE_URL}/data/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete item');
  }
  
  return response.json();
}

// Функция для получения избранных элементов
export async function fetchFavorites(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/favorites`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }
  
  return response.json();
}

// Функция для добавления элемента в избранное
export async function addToFavorites(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add to favorites');
  }
}

// Функция для удаления элемента из избранного
export async function removeFromFavorites(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove from favorites');
  }
} 