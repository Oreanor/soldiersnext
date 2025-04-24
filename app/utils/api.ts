import { DataItem } from '../types';
import { getData, updateData } from './supabase';

// Базовый URL для API
const API_BASE_URL = '/api';

// Функция для получения всех элементов
export const fetchItems = async (): Promise<DataItem[]> => {
  try {
    const data = await getData();
    return data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

// Функция для получения элемента по ID
export async function fetchItemById(id: string): Promise<DataItem> {
  const response = await fetch(`${API_BASE_URL}/data/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch item');
  }
  
  return response.json();
}

export const updateItems = async (items: DataItem[]): Promise<void> => {
  try {
    await updateData(items);
  } catch (error) {
    console.error('Error updating items:', error);
    throw error;
  }
}; 

// Функция для обновления элемента
export async function updateItem(id: string, data: Partial<DataItem>): Promise<DataItem> {
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
export async function deleteItem(id: string): Promise<DataItem> {
  const response = await fetch(`${API_BASE_URL}/data/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete item');
  }
  
  return response.json();
}

