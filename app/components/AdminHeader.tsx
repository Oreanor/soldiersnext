import { useTranslation } from 'react-i18next';
import { ADD_ICON, DELETE_ICON } from '../consts';
import LanguageSelector from './LanguageSelector';
import { useState, useEffect } from 'react';

interface AdminHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedItems: Set<string>;
  onBulkDelete: () => void;
  onDeselectAll: () => void;
  onAddNew: () => void;
}

export default function AdminHeader({
  searchQuery,
  onSearchChange,
  selectedItems,
  onBulkDelete,
  onDeselectAll,
  onAddNew
}: AdminHeaderProps) {
  const { t } = useTranslation();
  const [version, setVersion] = useState<string>('');
  const isDevelopment = process.env.NODE_ENV === 'development';

  const fetchVersion = async () => {
    try {
      const response = await fetch('/api/version');
      const data = await response.json();
      setVersion(data.version);
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  };

  const handleUpdateVersion = async () => {
    if (!isDevelopment) return;
    
    try {
      const response = await fetch('/api/version', {
        method: 'POST',
      });
      const data = await response.json();
      setVersion(data.version);
    } catch (error) {
      console.error('Error updating version:', error);
    }
  };

  useEffect(() => {
    fetchVersion();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-0 z-50">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap flex items-center gap-2">
          {t('admin.title', 'Панель управления')}
          <button
            onClick={handleUpdateVersion}
            className={`text-sm px-2 py-1 rounded transition-colors ${
              isDevelopment 
                ? 'bg-blue-100 hover:bg-blue-200 text-blue-800 cursor-pointer' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!isDevelopment}
            title={isDevelopment ? 'Update version' : 'Version updates disabled in production'}
          >
            v{version}
          </button>
        </h1>
        <div className="flex-1 max-w-xl">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder={t('admin.searchPlaceholder', 'Search by name or manufacturer...')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2 whitespace-nowrap">
          {selectedItems.size > 0 && (
            <div className="flex gap-2">
              <button
                onClick={onBulkDelete}
                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                {DELETE_ICON}
                {t('admin.bulkDelete', 'Delete Selected')} ({selectedItems.size})
              </button>
              <button
                onClick={onDeselectAll}
                className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {t('admin.deselectAll', 'Deselect All')}
              </button>
            </div>
          )}
          <button
            onClick={onAddNew}
            className="px-2 py-1 bg-green-600 text-sm text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            {ADD_ICON}
            {t('admin.addNew', 'Add New Item')}
          </button>
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
} 