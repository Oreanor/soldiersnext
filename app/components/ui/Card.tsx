import React, { useState, useEffect } from 'react';
import { CardProps } from '../../types';
import FavoriteButton from './FavoriteButton';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { isFavorite, addToFavorites, removeFromFavorites } from '../../utils/cookies';
import { getImageUrl } from '../../utils/supabase';

const Card: React.FC<CardProps> = ({ item, onClick }) => {
  const { t } = useTranslation();
  const [favorite, setFavorite] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(item.id.toString()))
  }, [item.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
      }
    );

    const currentElement = document.getElementById(`card-${item.id}`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [item.id]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const id = item.id.toString()
    if (favorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
    setFavorite(!favorite);
  };

  if (!isVisible) {
    return <div id={`card-${item.id}`} className="w-0 h-0" />;
  }

  return (
    <div
      id={`card-${item.id}`}
      onClick={() => onClick?.(item)}
      className="w-full rounded-lg shadow p-2 sm:p-3 md:p-4 bg-white flex flex-col items-center cursor-pointer hover:shadow-lg transition relative mx-auto"
    >
      <FavoriteButton isFavorite={favorite} onClick={handleToggleFavorite} />
      <div className="relative w-full aspect-square mb-4">
        {item.img ? (
          <Image
            width={300}
            height={300}
            src={getImageUrl(`${item.folder}/${item.img}`)}
            alt={item.name}
            className="w-full h-full object-contain rounded-t-lg opacity-0 transition-opacity duration-300"
            loading="lazy"
            unoptimized
            onLoadingComplete={(img) => img.classList.remove('opacity-0')}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-t-lg flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>
      <div className="w-full">
        <h3 className="text-md font-semibold mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 italic">{item.manufacturer}, {item.scale}</p>
      </div>
    </div>
  );
};

export default Card; 