'use client';

import './App.css'
import { useState, useEffect } from 'react';
import Card from './components/ui/Card';
import Overlay from './components/Overlay';
import LeftPanel from './components/LeftPanel';
import { DataItem } from './types';
import { TAGS } from './consts';
import { getUniqueTags } from './utils';
import { useDebounce } from './utils/hooks';
import { fetchItems } from './utils/api';
import { getFavorites } from './utils/cookies';
import './i18n';
import Spinner from './components/ui/Spinner'

function App() {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<DataItem | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [activeTags, setActiveTags] = useState<{ [key: string]: string[] }>({});
  const [showFavorites, setShowFavorites] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState<number>(0);
  const [items, setItems] = useState<DataItem[]>([]);
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
    const matchesFavorites = !showFavorites || getFavorites().includes(item.id.toString());
    return matchesSearch && matchesTags && matchesFavorites;
  });

  // Only render the full UI after the component has mounted
  if (!mounted) {
    return <Spinner fullScreen />;
  }

  if (loading) {
    return <Spinner fullScreen />;
  }

  if (error) {
    return <div className="flex w-full h-screen items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col sm:flex-row w-full h-screen overflow-hidden">
      <div className="h-auto sm:h-full shrink-0">
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
      </div>
      <div className="flex flex-col w-full relative flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 items-start">
            {filteredItems.map((item: DataItem) => (
              <Card
                key={item.id}
                item={item}
                onClick={() => setSelected(item)}
              />
            ))}
          </div>
        </div>
      </div>
      {selected && (
        <Overlay
          item={selected}
          onClose={() => setSelected(null)}
          initialImageIndex={initialImageIndex}
        />
      )}
    </div>
  );
}

export default App;
