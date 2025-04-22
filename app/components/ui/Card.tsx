import React from 'react';
import { CardProps } from '../../types';
import FavoriteButton from './FavoriteButton';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

const Card: React.FC<CardProps> = ({ item, isFavorite = false, onToggleFavorite, onClick }) => {
  const { t } = useTranslation();

  return (
    <div
      onClick={() => onClick?.(item)}
      className="w-full sm:w-[100%] md:w-full rounded-lg shadow p-2 sm:p-3 md:p-4 bg-white flex flex-col items-center cursor-pointer hover:shadow-lg transition relative mx-auto"
    >
      <FavoriteButton isFavorite={isFavorite} onClick={() => onToggleFavorite?.(item.id)} />
      <div className="relative w-full pt-[75%] mb-4">
        {item.img ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={`/data/images/${item.folder}/${item.img}?v=${0}`}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain rounded"
              priority
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
            <span className="text-gray-400">{t('card.noImage', 'No image')}</span>
          </div>
        )}
      </div>
      <div className="font-bold text-base sm:text-md mb-1 text-center">{item.name}</div>
      <div className="text-xs sm:text-sm text-gray-600 mb-1 text-center">{item.manufacturer} • {item.scale}</div>
    </div>
  );
};

export default Card; 