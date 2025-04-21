import React from 'react';
import { CardProps } from '../types';
import { IMAGE_PATH } from '../consts';
import FavoriteButton from './FavoriteButton';

const Card: React.FC<CardProps> = ({ item, isFavorite = false, onToggleFavorite, onClick }) => (
  <div
    onClick={() => onClick?.(item)}
    className="w-full sm:w-[100%] md:w-full rounded-lg shadow p-2 sm:p-3 md:p-4 bg-white flex flex-col items-center cursor-pointer hover:shadow-lg transition relative mx-auto"
  >
    <FavoriteButton isFavorite={isFavorite} onClick={() => onToggleFavorite?.(item.id)} />
    <img 
      src={`${IMAGE_PATH}/${item.folder}/${item.img}`}
      alt={item.name}
      className="w-full h-32 sm:h-36 md:h-40 object-contain mb-1 bg-white rounded"
    />
    <div className="font-bold text-base sm:text-md mb-1 text-center">{item.name}</div>
    <div className="text-xs sm:text-sm text-gray-600 mb-1 text-center">{item.manufacturer} • {item.scale}</div>
  </div>
);

export default Card; 