import { useTranslation } from 'react-i18next';
import { EDIT_ICON, DELETE_ICON } from '../consts';
import { DataItem } from '../types';
import { memo } from 'react';
import Image from 'next/image';
import { getImageUrl } from '../utils/supabase';

interface AdminItemCardProps {
  item: DataItem;
  onEdit: (item: DataItem) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  version?: number;
}

function AdminItemCard({ item, onEdit, onDelete, isSelected, onSelect, version = 0 }: AdminItemCardProps) {
  const { t } = useTranslation();

  const handleEdit = () => onEdit(item);
  const handleDelete = () => onDelete(item.id.toString());
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => onSelect?.(item.id.toString(), e.target.checked);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 relative">
      <div className="absolute top-2 right-2 flex space-x-2 z-10">
        <button
          onClick={handleEdit}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
          title={t('admin.card.edit', 'Edit')}
        >
          {EDIT_ICON}
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded cursor-pointer"
          title={t('admin.card.delete', 'Delete')}
        >
          {DELETE_ICON}
        </button>
      </div>
      {onSelect && (
        <div className="absolute top-4 left-4 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </div>
      )}
      <div className="relative h-48 mb-4 mt-8">
        {item.img ? (
          <Image
            src={getImageUrl(`${item.folder}/${item.img}`)}
            alt={item.name}
            fill
            className="object-cover rounded"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
            <span className="text-gray-400">{t('admin.card.noImage', 'No image')}</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold truncate flex-1">{item.name}</h3>
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <p className="italic">{item.manufacturer}, {item.scale}</p>
      </div>
    </div>
  );
}

export default memo(AdminItemCard); 