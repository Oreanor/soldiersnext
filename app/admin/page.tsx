'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import AdminItemCard from '../components/AdminItemCard'
import { AdminItemForm } from '../components/AdminItemForm'
import AdminHeader from '../components/AdminHeader'
import { DataItem } from '../types'
import { generateId } from '../utils/utils'
import PasswordForm from '../components/PasswordForm'
import Spinner from '../components/ui/Spinner'

export default function AdminPage() {
  const [data, setData] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editItem, setEditItem] = useState<DataItem | null>(null)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState<DataItem[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [verificationInterval, setVerificationInterval] = useState<NodeJS.Timeout | null>(null)
  const listContainerRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const existingManufacturers = useMemo(() => 
    Array.from(new Set(data.map(item => item.manufacturer))).sort(),
    [data]
  )

  const existingScales = useMemo(() => 
    Array.from(new Set(data.map(item => item.scale))).sort(),
    [data]
  )

  const existingFolders = useMemo(() => 
    Array.from(new Set(data.map(item => item.folder))).sort(),
    [data]
  )

  const fetchData = useCallback(async () => {
    try {
      console.log('Fetching fresh data from Supabase...');
      const response = await fetch('/api/admin/data');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.details || 'Failed to fetch data');
      }
      const json = await response.json();
      console.log('Fetched data from Supabase:', json.length, 'items');
      setData(json);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      const query = searchQuery.toLowerCase()
      const filtered = data.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.manufacturer.toLowerCase().includes(query)
      )
      setFilteredData(filtered)
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, data])

  const verifyDataUpdate = useCallback(async (expectedLength: number, updatedItem?: DataItem) => {
    let attempts = 0;
    const maxAttempts = 54; // 54 попытки по 5 секунд = 4.5 минуты

    const checkData = async () => {
      try {
        const response = await fetch('/api/admin/data');
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        
        if (updatedItem) {
          // Проверяем конкретный объект при обновлении
          const serverItem = data.find((item: DataItem) => item.id === updatedItem.id);
          console.log('Verifying item update:', {
            local: updatedItem,
            server: serverItem
          });
          
          if (serverItem && JSON.stringify(serverItem) === JSON.stringify(updatedItem)) {
            console.log('Item verified successfully');
            setIsSaving(false);
            if (verificationInterval) {
              clearInterval(verificationInterval);
              setVerificationInterval(null);
            }
            return true;
          }
        } else {
          // Проверяем длину массива при добавлении/удалении
          console.log('Verifying data length. Current:', data.length, 'Expected:', expectedLength);
          if (data.length === expectedLength) {
            console.log('Data length verified successfully');
            setIsSaving(false);
            if (verificationInterval) {
              clearInterval(verificationInterval);
              setVerificationInterval(null);
            }
            return true;
          }
        }
        
        return false;
      } catch (error) {
        console.error('Error verifying data:', error);
        return false;
      }
    };

    const interval = setInterval(async () => {
      attempts++;
      const isUpdated = await checkData();
      
      if (isUpdated || attempts >= maxAttempts) {
        clearInterval(interval);
        setVerificationInterval(null);
        if (!isUpdated) {
          console.warn('Data verification failed after', attempts * 5, 'seconds');
          setIsSaving(false);
        }
      }
    }, 5000);

    setVerificationInterval(interval);
    return () => clearInterval(interval);
  }, [verificationInterval]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      setIsSaving(true);
      // Get current data and update local state
      setData(prev => {
        console.log('Current data before deletion:', prev.length, 'items');
        console.log('Looking for ID:', id, 'Type:', typeof id);
        console.log('Available IDs:', prev.map(item => {
          console.log('Item ID:', item.id, 'Type:', typeof item.id);
          return item.id;
        }));
        
        const itemToDelete = prev.find(item => String(item.id) === String(id));
        if (!itemToDelete) {
          console.error('Item not found with ID:', id);
          setIsSaving(false);
          return prev;
        }
        
        const updatedData = prev.filter(item => String(item.id) !== String(id));
        console.log('Data after deletion:', updatedData.length, 'items');
        
        // Upload updated data to Supabase
        fetch('/api/admin/data', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to update Supabase');
          }
          console.log('Data updated in Supabase successfully');
          // Start verification
          verifyDataUpdate(updatedData.length);
        })
        .catch(err => {
          console.error('Error updating Supabase:', err);
          setError(err instanceof Error ? err.message : 'Failed to update Supabase');
          setIsSaving(false);
        });

        return updatedData;
      });
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setIsSaving(false);
    }
  }, [verifyDataUpdate]);

  const handleSave = useCallback(async (item: DataItem) => {
    try {
      setIsSaving(true);
      let updatedItem = { ...item };

      // Если есть файл, сначала загружаем его
      if (item.file) {
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('folder', item.folder);

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          throw new Error(error.error || 'Failed to upload image');
        }

        const { path } = await uploadResponse.json();
        updatedItem = { ...updatedItem, image: path };
      }

      // Обновляем локальное состояние
      setData(prev => {
        const newData = mode === 'add' 
          ? [updatedItem, ...prev]  // Добавляем новый элемент в начало массива
          : prev.map(i => i.id === updatedItem.id ? updatedItem : i);

        // Загружаем обновленные данные на Supabase
        fetch('/api/admin/data', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newData),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to update Supabase');
          }
          console.log('Data updated in Supabase successfully');
          // Начинаем верификацию
          verifyDataUpdate(newData.length, updatedItem);
        })
        .catch(err => {
          console.error('Error updating Supabase:', err);
          setError(err instanceof Error ? err.message : 'Failed to update Supabase');
          setIsSaving(false);
        });

        return newData;
      });

      setEditItem(null);
      setMode('add');
    } catch (err) {
      console.error('Error saving item:', err);
      setError(err instanceof Error ? err.message : 'Failed to save item');
      setIsSaving(false);
    }
  }, [mode, verifyDataUpdate]);

  const handleAddNew = useCallback(() => {
    const newItem: DataItem = {
      id: generateId(),
      name: '',
      manufacturer: '',
      scale: '',
      year: '',
      folder: '',
      img: '',
      material: '',
      type: '',
      figures: []
    }
    setEditItem(newItem)
    setMode('add')
  }, [])

  const handleEdit = useCallback((item: DataItem) => {
    setEditItem(item)
    setMode('edit')
  }, [])

  const handleSelect = useCallback((id: string, selected: boolean) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }, [])

  const handleBulkDelete = useCallback(async () => {
    if (!confirm(`Are you sure you want to delete ${selectedItems.size} items?`)) return
    
    try {
      setIsSaving(true);
      // Обновляем локальное состояние
      setData(prev => {
        const updatedData = prev.filter(item => !selectedItems.has(item.id));
        
        // Загружаем обновленные данные на Supabase
        fetch('/api/admin/data', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to update Supabase');
          }
          console.log('Data updated in Supabase successfully');
          // Начинаем проверку
          verifyDataUpdate(updatedData.length);
        })
        .catch(err => {
          console.error('Error updating Supabase:', err);
          setError(err instanceof Error ? err.message : 'Failed to update Supabase');
          setIsSaving(false);
        });

        return updatedData;
      });

      setSelectedItems(new Set());
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete items');
      setIsSaving(false);
    }
  }, [selectedItems, verifyDataUpdate]);

  if (!isAuthenticated) {
    return <PasswordForm onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  if (loading) return <Spinner fullScreen />;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="h-screen bg-gray-50 p-4 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        <AdminHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedItems={selectedItems}
          onBulkDelete={handleBulkDelete}
          onDeselectAll={() => setSelectedItems(new Set())}
          onAddNew={handleAddNew}
        />

        <div ref={listContainerRef} className="flex-1 overflow-y-auto mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2.5">
            {(searchQuery ? filteredData : data).map(item => (
              <AdminItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isSelected={selectedItems.has(item.id)}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>

        {editItem && (
          <AdminItemForm
            item={editItem}
            mode={mode}
            onSave={handleSave}
            onCancel={() => setEditItem(null)}
            existingManufacturers={existingManufacturers}
            existingScales={existingScales}
            existingFolders={existingFolders}
          />
        )}

        {isSaving && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-lg text-gray-700">Saving data to server...</span>
              </div>
              <button
                onClick={() => setIsSaving(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 