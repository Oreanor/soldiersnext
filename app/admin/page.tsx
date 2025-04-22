'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import AdminItemCard from '../components/AdminItemCard'
import { AdminItemForm } from '../components/AdminItemForm'
import AdminHeader from '../components/AdminHeader'
import { DataItem } from '../types'
import { generateId } from '../utils/id'
import PasswordForm from '../components/PasswordForm'
import Spinner from '../components/ui/Spinner'

export default function AdminPage() {
  const [data, setData] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editItem, setEditItem] = useState<DataItem | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState<DataItem[]>([])
  const [imageVersion, setImageVersion] = useState(0)
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
      const response = await fetch('/api/admin/data')
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || error.details || 'Failed to fetch data')
      }
      const json = await response.json()
      console.log('Fetched data:', json)
      setData(json)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, fetchData])

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

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const response = await fetch(`/api/admin/data/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete item')
      await fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }, [fetchData])

  const handleSave = useCallback(async (item: DataItem) => {
    try {
      const isNewItem = !data.some(existingItem => existingItem.id === item.id)
      const response = await fetch(
        isNewItem ? '/api/admin/data' : `/api/admin/data/${item.id}`,
        {
          method: isNewItem ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save item')
      }

      await fetchData()
      setImageVersion(prev => prev + 1)
      setEditItem(null)

      if (!item.id && listContainerRef.current) {
        listContainerRef.current.scrollTo({
          top: listContainerRef.current.scrollHeight,
          behavior: 'smooth'
        })
      }
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Failed to save item: ' + (error as Error).message)
    }
  }, [fetchData, data])

  const handleAddNew = useCallback(() => {
    const newItem: DataItem = {
      id: generateId(),
      name: '',
      manufacturer: '',
      scale: '',
      folder: '',
      img: '',
      material: '',
      type: '',
      figures: []
    }
    setEditItem(newItem)
  }, [])

  const handleEdit = useCallback((item: DataItem) => {
    setEditItem(item)
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
      const deletePromises = Array.from(selectedItems).map(id =>
        fetch(`/api/admin/data/${id}`, {
          method: 'DELETE',
        })
      )
      
      await Promise.all(deletePromises)
      await fetchData()
      setSelectedItems(new Set())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete items')
    }
  }, [selectedItems, fetchData])

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
                version={imageVersion}
              />
            ))}
          </div>
        </div>

        {editItem && (
          <AdminItemForm
            item={editItem}
            onSave={handleSave}
            onCancel={() => setEditItem(null)}
            existingManufacturers={existingManufacturers}
            existingScales={existingScales}
            existingFolders={existingFolders}
          />
        )}
      </div>
    </div>
  )
} 