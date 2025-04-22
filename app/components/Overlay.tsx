import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { OverlayProps } from '../types';
import { IMAGE_PATH } from '../consts';
import Image from 'next/image';

const Overlay: React.FC<OverlayProps> = ({ item, onClose, initialImageIndex = 0 }) => {
  const { t } = useTranslation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  
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

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        ref={overlayRef}
        className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative" 
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
        {item.desc && mainIdx === 0 && <div className="mb-4 text-gray-700 text-sm">{item.desc}</div>}
        
        <div className="flex gap-4 mb-8 justify-center">
          <div className="flex-1 max-w-[600px]">
            <div className="relative aspect-square max-h-[50vh] w-full">
              {images[mainIdx] ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={`${IMAGE_PATH}/${item.folder}/${images[mainIdx]}`}
                    alt={figureNames[mainIdx] || item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain rounded"
                    priority
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                  <span className="text-gray-400">{t('Overlay.noImage', 'No image')}</span>
                </div>
              )}
            </div>
            <div className="text-center text-xs my-2 min-h-[1.5em]">
              {mainIdx === 0 ? t('Overlay.generalImage') : (figureNames[mainIdx] || '')}
            </div>
          </div>
          
          {mainIdx > 0 && item.figures && item.figures[mainIdx - 1] && item.figures[mainIdx - 1].desc && (
            <div className="w-64 shrink-0 flex flex-col h-[40vh]">
              <div className="flex-1 overflow-y-auto">
                <div className="text-sm text-gray-700 pr-2">
                  {item.figures[mainIdx - 1].desc}
                </div>
              </div>
            </div>
          )}
        </div>

        
        
        {images.length > 1 && (
          <div>
            <div className="flex flex-wrap gap-2 justify-center p-2">
              {images.map((img, idx) => (
                <div 
                  key={`${item.id}-${idx}`} 
                  className="relative w-[50px] h-[50px] cursor-pointer"
                  onClick={() => setMainIdx(idx)}
                >
                  <Image
                    src={`${IMAGE_PATH}/${item.folder}/${img}`}
                    alt={figureNames[idx] || t('Overlay.generalImage')}
                    fill
                    sizes="50px"
                    className={`object-contain rounded ${mainIdx === idx ? 'ring-2 ring-blue-400' : ''}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overlay; 