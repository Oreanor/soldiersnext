import { DataItem } from '../types';

export function getUniqueTags(arr: DataItem[], key: keyof DataItem): string[] {
  return Array.from(new Set(arr.map(item => item[key]).filter(Boolean) as string[])).sort();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 8);
} 