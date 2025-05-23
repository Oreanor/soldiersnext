import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { OverlayProps } from '../types';
import Image from 'next/image';
import { getImageUrl } from '../utils/supabase';

const Overlay: React.FC<OverlayProps> = ({ item, onClose, initialImageIndex = 0 }) => {
  const { t } = useTranslation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  
  // Main image is always first
  const images = [item.img, ...(item.figures?.map(f => f.img) || [])];
  const figureNames = [item.name, ...(item.figures?.map(f => f.name) || [])];

  const [mainIdx, setMainIdx] = useState(initialImageIndex);
  
  // Проверка URL при загрузке оверлея
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const imageIdx = urlParams.get('image');
    
    if (imageIdx) {
      const idx = parseInt(imageIdx, 10);
      if (!isNaN(idx) && idx >= 0 && idx < images.length) {
        setMainIdx(idx);
      }
    }
  }, [images.length]);

  // Обновление URL при выборе изображения
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('image', mainIdx.toString());
    window.history.pushState({}, '', url.toString());
  }, [mainIdx]);

  useEffect(() => {
    const checkHeight = () => {
      if (!overlayRef.current) return;
      
      const windowHeight = window.innerHeight;
      const overlayHeight = overlayRef.current.offsetHeight;
      
      if (overlayHeight > windowHeight * 0.9) {
        const newScale = (windowHeight * 0.9) / overlayHeight;
        setScale(newScale);
      } else {
        setScale(1);
      }
    };

    checkHeight();
    window.addEventListener('resize', checkHeight);
    
    return () => {
      window.removeEventListener('resize', checkHeight);
    };
  }, [mainIdx]);

  const handleImageLoad = (image: string) => {
    setLoadedImages(prev => new Set(prev).add(image));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        ref={overlayRef}
        className="bg-white rounded-lg shadow-lg py-6 px-10 max-w-4xl w-full relative" 
        onClick={e => e.stopPropagation()}
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        <div 
          className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-black cursor-pointer w-8 h-8 flex items-center justify-center" 
          onClick={onClose}
        >
          ×
        </div>
        <div className="font-bold text-2xl mb-2">{item.name}</div>
        <div className="text-gray-600 mb-2 italic">{[item.manufacturer, item.year, item.scale].filter(Boolean).join(', ')}</div>
        {item.desc && <div className="mb-4 text-gray-700 text-sm">{item.desc}</div>}
        
        <div className="flex gap-4 mb-8 justify-center">
          <div className="flex-1">
            <div className="relative aspect-square max-h-[50vh] w-full">
              {images[mainIdx] ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={getImageUrl(`${item.folder}/${images[mainIdx]}`)}
                    alt={figureNames[mainIdx] || item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-contain rounded transition-opacity duration-300 ${loadedImages.has(images[mainIdx]) ? 'opacity-100' : 'opacity-0'}`}
                    priority
                    onLoadingComplete={() => handleImageLoad(images[mainIdx])}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                  <span className="text-gray-400">{t('Overlay.noImage', 'No image')}</span>
                </div>
              )}
            </div>
          </div>
          
          {mainIdx > 0 && item.figures && item.figures[mainIdx - 1]?.desc ? (
            <div className="w-100 shrink-0 flex flex-col h-[45vh]">
              <div className="flex-1 overflow-y-auto">
                <div className="text-sm text-gray-700 pr-2">
                  {item.figures[mainIdx - 1].desc}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {item.figures && (
          <div className="flex flex-wrap gap-2 justify-center p-2">
            {images.map((img, idx) => (
              <div 
                key={`${item.id}-${idx}`} 
                className="relative w-[50px] h-[50px] cursor-pointer"
                onClick={() => setMainIdx(idx)}
              >
                <Image
                  src={getImageUrl(`${item.folder}/${img}`)}
                  alt={figureNames[idx] || t('Overlay.generalImage')}
                  fill
                  sizes="50px"
                  className={`object-contain rounded transition-opacity duration-300 ${loadedImages.has(img) ? 'opacity-100' : 'opacity-0'} ${mainIdx === idx ? 'ring-2 ring-blue-400' : ''}`}
                  priority
                  onLoadingComplete={() => handleImageLoad(img)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overlay; 