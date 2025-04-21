import { ItemType } from './types';

export function getUniqueTags(arr: ItemType[], key: keyof ItemType): string[] {
  return Array.from(new Set(arr.map(item => item[key]).filter(Boolean) as string[])).sort();
}
