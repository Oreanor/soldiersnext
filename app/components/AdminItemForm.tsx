import { useState, useEffect, useRef } from 'react'
import { DataItem } from '../types'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

// Захардкоженные значения для материала и типа
const MATERIAL_OPTIONS = ['plastic', 'metal'] as const
const TYPE_OPTIONS = ['flat', 'round'] as const

interface AdminItemFormProps {
  item: DataItem
  onSave: (item: DataItem) => Promise<void>
  onCancel: () => void
  existingManufacturers: string[]
  existingScales: string[]
  existingFolders: string[]
  mode: 'add' | 'edit'
}

export function AdminItemForm({ item, onSave, onCancel, existingManufacturers, existingScales, existingFolders, mode }: AdminItemFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<DataItem>({
    id: item.id,
    name: item.name || '',
    manufacturer: item.manufacturer || '',
    scale: item.scale || '',
    year: item.year || '',
    folder: item.folder || '',
    img: item.img || '',
    material: item.material || MATERIAL_OPTIONS[0],
    type: item.type || TYPE_OPTIONS[0],
    desc: item.desc || '',
    figures: item.figures || []
  })
  const [manufacturerInput, setManufacturerInput] = useState(item.manufacturer || '')
  const [scaleInput, setScaleInput] = useState(item.scale || '')
  const [folderInput, setFolderInput] = useState(item.folder || '')
  const [showManufacturerList, setShowManufacturerList] = useState(false)
  const [showScaleList, setShowScaleList] = useState(false)
  const [showFolderList, setShowFolderList] = useState(false)
  const [filteredManufacturers, setFilteredManufacturers] = useState<string[]>([])
  const [filteredScales, setFilteredScales] = useState<string[]>([])
  const [filteredFolders, setFilteredFolders] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const manufacturerDropdownRef = useRef<HTMLDivElement>(null)
  const scaleDropdownRef = useRef<HTMLDivElement>(null)
  const folderDropdownRef = useRef<HTMLDivElement>(null)

  // Load existing image when editing
  useEffect(() => {
    if (mode === 'edit' && item.img) {
      // Construct the full path to the image
      const imagePath = `http://localhost:3000/data/images/${item.folder}/${item.img}`;
      setImagePreview(imagePath);
    }
  }, [mode, item.img, item.folder]);

  useEffect(() => {
    if (manufacturerInput) {
      const filtered = existingManufacturers.filter(m => 
        m.toLowerCase().includes(manufacturerInput.toLowerCase())
      )
      setFilteredManufacturers(filtered)
    } else {
      setFilteredManufacturers(existingManufacturers)
    }
  }, [manufacturerInput, existingManufacturers])

  useEffect(() => {
    if (scaleInput) {
      const filtered = existingScales.filter(s => 
        s.toLowerCase().includes(scaleInput.toLowerCase())
      )
      setFilteredScales(filtered)
    } else {
      setFilteredScales(existingScales)
    }
  }, [scaleInput, existingScales])

  useEffect(() => {
    if (folderInput) {
      const filtered = existingFolders.filter(f => 
        f.toLowerCase().includes(folderInput.toLowerCase())
      )
      setFilteredFolders(filtered)
    } else {
      setFilteredFolders(existingFolders)
    }
  }, [folderInput, existingFolders])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (manufacturerDropdownRef.current && !manufacturerDropdownRef.current.contains(event.target as Node)) {
        setShowManufacturerList(false)
      }
      if (scaleDropdownRef.current && !scaleDropdownRef.current.contains(event.target as Node)) {
        setShowScaleList(false)
      }
      if (folderDropdownRef.current && !folderDropdownRef.current.contains(event.target as Node)) {
        setShowFolderList(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // If there's a new image selected, upload it first
    if (imagePreview && imagePreview.startsWith('data:')) {
      const fileInput = document.getElementById('image-upload') as HTMLInputElement
      const file = fileInput.files?.[0]
      
      if (file) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('folder', formData.folder)

        try {
          const uploadResponse = await fetch('/api/admin/upload', {
            method: 'POST',
            body: uploadFormData,
          })

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload image')
          }

          // Update the image name to 00.jpg
          setFormData(prev => ({
            ...prev,
            img: '00.jpg'
          }))
        } catch (error) {
          console.error('Error uploading image:', error)
          return
        }
      }
    }

    try {
      await onSave({
        ...formData,
        id: item.id,
        figures: item.figures
      })
      
      // Update preview only after successful save
      if (formData.img) {
        setImagePreview(`/data/images/${formData.folder}/${formData.img}?t=${Date.now()}`)
      }
    } catch (error) {
      console.error('Error saving item:', error)
    }
  }

  const handleChange = (field: keyof DataItem) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleManufacturerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setManufacturerInput(value)
    setFormData(prev => ({
      ...prev,
      manufacturer: value
    }))
    setShowManufacturerList(true)
  }

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setScaleInput(value)
    setFormData(prev => ({
      ...prev,
      scale: value
    }))
    setShowScaleList(true)
  }

  const handleManufacturerSelect = (manufacturer: string) => {
    setManufacturerInput(manufacturer)
    setFormData(prev => ({
      ...prev,
      manufacturer
    }))
    setShowManufacturerList(false)
  }

  const handleScaleSelect = (scale: string) => {
    setScaleInput(scale)
    setFormData(prev => ({
      ...prev,
      scale
    }))
    setShowScaleList(false)
  }

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFolderInput(value)
    setFormData(prev => ({
      ...prev,
      folder: value
    }))
    setShowFolderList(true)
  }

  const handleFolderSelect = (folder: string) => {
    setFolderInput(folder)
    setFormData(prev => ({
      ...prev,
      folder
    }))
    setShowFolderList(false)
  }

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      material: e.target.value
    }))
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      type: e.target.value
    }))
  }

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">
            {mode === 'add' ? t('admin.form.title') : t('admin.form.editTitle')}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Left column */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-0.5">{t('admin.form.name')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleChange('name')}
                  className="w-full border border-gray-300 rounded p-2 h-8 text-sm"
                  required
                />
              </div>
              
              <div className="relative" ref={manufacturerDropdownRef}>
                <label className="block text-xs font-medium mb-0.5">{t('admin.form.manufacturer')}</label>
                <input
                  type="text"
                  value={manufacturerInput}
                  onChange={handleManufacturerChange}
                  onFocus={() => setShowManufacturerList(true)}
                  className="w-full border border-gray-300 rounded p-2 h-8 text-sm"
                  required
                />
                {showManufacturerList && filteredManufacturers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
                    {filteredManufacturers.map((manufacturer, index) => (
                      <div
                        key={index}
                        className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleManufacturerSelect(manufacturer)}
                      >
                        {manufacturer}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={scaleDropdownRef}>
                <label className="block text-xs font-medium mb-0.5">{t('admin.form.scale')}</label>
                <input
                  type="text"
                  value={scaleInput}
                  onChange={handleScaleChange}
                  onFocus={() => setShowScaleList(true)}
                  className="w-full border border-gray-300 rounded p-2 h-8 text-sm"
                  required
                />
                {showScaleList && filteredScales.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
                    {filteredScales.map((scale, index) => (
                      <div
                        key={index}
                        className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleScaleSelect(scale)}
                      >
                        {scale}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-0.5">{t('admin.form.year')}</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={handleChange('year')}
                  className="w-full border border-gray-300 rounded p-2 h-8 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-0.5">{t('admin.form.folder')}</label>
                <div className="relative" ref={folderDropdownRef}>
                  <input
                    type="text"
                    value={folderInput}
                    onChange={handleFolderChange}
                    onFocus={() => setShowFolderList(true)}
                    className="w-full border border-gray-300 rounded p-2 h-8 text-sm"
                    required
                  />
                  {showFolderList && filteredFolders.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
                      {filteredFolders.map((folder, index) => (
                        <div
                          key={index}
                          className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => handleFolderSelect(folder)}
                        >
                          {folder}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Material and Type in one row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-0.5">{t('admin.form.material')}</label>
                  <select
                    value={formData.material}
                    onChange={handleMaterialChange}
                    className="w-full border border-gray-300 rounded p-2 h-8 text-sm bg-white"
                    required
                  >
                    {MATERIAL_OPTIONS.map(option => (
                      <option key={option} value={option}>
                        {t(`materials.${option}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-0.5">{t('admin.form.type')}</label>
                  <select
                    value={formData.type}
                    onChange={handleTypeChange}
                    className="w-full border border-gray-300 rounded p-2 h-8 text-sm bg-white"
                    required
                  >
                    {TYPE_OPTIONS.map(option => (
                      <option key={option} value={option}>
                        {t(`types.${option}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-0.5">{t('admin.form.image')}</label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="image-upload"
                      accept=".jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const dataUrl = event.target?.result as string;
                            setFormData(prev => ({
                              ...prev,
                              img: '00.jpg'
                            }));
                            setImagePreview(dataUrl);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300 transition cursor-pointer text-sm"
                    >
                      {t('admin.form.chooseFile')}
                    </button>
                    {formData.img && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 truncate">{formData.img}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, img: '' }));
                            setImagePreview(null);
                            // Clear the file input
                            const fileInput = document.getElementById('image-upload') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }}
                          className="text-gray-400 hover:text-gray-600 transition p-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-0.5">{t('admin.form.description')}</label>
                <textarea
                  value={formData.desc}
                  onChange={handleChange('desc')}
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('admin.form.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('admin.form.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 