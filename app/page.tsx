'use client';

import './App.css'
import { useState, useEffect } from 'react';
import Card from './components/ui/Card';
import Overlay from './components/Overlay';
import LeftPanel from './components/LeftPanel';
import { ItemType } from './types';
import { TAGS } from './consts';
import { getUniqueTags } from './utils';
import { useDebounce } from './utils/hooks';
import { fetchItems, fetchFavorites, addToFavorites, removeFromFavorites } from './utils/api';
import './i18n';

function App() {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<ItemType | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [activeTags, setActiveTags] = useState<{ [key: string]: string[] }>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState<number>(0);
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Загрузка данных с сервера
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchItems();
        setItems(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      loadData();
    }
  }, [mounted]);

  // Загрузка избранных элементов с сервера
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await fetchFavorites();
        setFavorites(data);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };

    if (mounted) {
      loadFavorites();
    }
  }, [mounted]);

  // Проверка URL при загрузке приложения
  useEffect(() => {
    if (mounted) {
      const urlParams = new URLSearchParams(window.location.search);
      const itemId = urlParams.get('item');
      const imageIdx = urlParams.get('image');
      
      if (itemId) {
        const item = items.find(item => item.id.toString() === itemId);
        if (item) {
          setSelected(item);
          if (imageIdx) {
            const idx = parseInt(imageIdx, 10);
            if (!isNaN(idx) && idx >= 0 && idx < (item.figures?.length || 0) + 1) {
              setInitialImageIndex(idx);
            }
          }
        }
      }
    }
  }, [mounted, items]);

  // Обновление URL при выборе элемента
  useEffect(() => {
    if (mounted) {
      const url = new URL(window.location.href);
      if (selected) {
        url.searchParams.set('item', selected.id.toString());
      } else {
        url.searchParams.delete('item');
        url.searchParams.delete('image');
      }
      window.history.pushState({}, '', url.toString());
    }
  }, [selected, mounted]);

  // Добавление/удаление из избранного
  const toggleFavorite = async (id: number) => {
    const idStr = id.toString();
    const isFavorite = favorites.includes(idStr);
    
    try {
      if (isFavorite) {
        // Удаляем из избранного
        await removeFromFavorites(idStr);
        setFavorites(prev => prev.filter(favId => favId !== idStr));
      } else {
        // Добавляем в избранное
        await addToFavorites(idStr);
        setFavorites(prev => [...prev, idStr]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const tags = {
    [TAGS.material]: getUniqueTags(items, TAGS.material),
    [TAGS.manufacturer]: getUniqueTags(items, TAGS.manufacturer),
    [TAGS.scale]: getUniqueTags(items, TAGS.scale),
    [TAGS.type]: getUniqueTags(items, TAGS.type),
  };

  const handleTagClick = (param: string, value: string) => {
    setActiveTags(prev => {
      const current = prev[param] || [];
      if (current.includes(value)) {
        return { ...prev, [param]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [param]: [...current, value] };
      }
    });
  };

  const handleResetAll = () => {
    setActiveTags({});
  };

  const filteredItems = items.filter(item => {
    const searchLower = debouncedSearch.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(searchLower) || 
                         item.manufacturer.toLowerCase().includes(searchLower);
    const matchesTags = Object.entries(activeTags).every(([param, values]) => {
      if (values.length === 0) return true;
      return values.includes(item[param as keyof typeof item] as string);
    });
    const matchesFavorites = !showFavorites || favorites.includes(item.id.toString());
    return matchesSearch && matchesTags && matchesFavorites;
  });

  // Only render the full UI after the component has mounted
  if (!mounted) {
    return <div className="flex w-full h-screen items-center justify-center">Loading...</div>;
  }

  if (loading) {
    return <div className="flex w-full h-screen items-center justify-center">Loading data...</div>;
  }

  if (error) {
    return <div className="flex w-full h-screen items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex w-full h-screen">
      <LeftPanel
        search={search}
        setSearch={setSearch}
        tags={tags}
        onTagClick={handleTagClick}
        activeTags={activeTags}
        onResetAll={handleResetAll}
        showFavorites={showFavorites}
        onToggleFavorites={() => setShowFavorites(!showFavorites)}
      />
      <div className="flex flex-col w-full relative">
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[10px] sm:gap-3 md:gap-4 lg:gap-6 items-start">
            {filteredItems.map((item: ItemType) => (
              <Card
                key={item.id}
                item={item}
                onClick={() => setSelected(item)}
                isFavorite={favorites.includes(item.id.toString())}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      </div>
      {selected && (
        <Overlay 
          item={selected} 
          onClose={() => {
            setSelected(null);
            setInitialImageIndex(0);
          }} 
          initialImageIndex={initialImageIndex}
        />
      )}
    </div>
  )
}

export default App
