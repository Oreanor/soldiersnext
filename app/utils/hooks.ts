import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DataItem } from '../types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    const idStr = id.toString();
    setFavorites(prev => {
      const newFavorites = prev.includes(idStr)
        ? prev.filter(favId => favId !== idStr)
        : [...prev, idStr];
      return newFavorites;
    });
  };

  return { favorites, toggleFavorite };
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export const useTranslatedItem = (item: DataItem) => {
  const { t } = useTranslation();
  const itemId = item.id.toString();

  return {
    ...item,
    name: t(`items.${itemId}.name`, { defaultValue: item.name }),
    material: t(`materials.${item.material}`, { defaultValue: item.material }),
    type: t(`types.${item.type}`, { defaultValue: item.type }),
    desc: t(`items.${itemId}.desc`, { defaultValue: item.desc || '' })
  };
}; 