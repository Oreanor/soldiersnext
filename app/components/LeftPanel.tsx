import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import TagBlock from './TagBlock';
import { TAGS } from '../consts';

interface LeftPanelProps {
  search: string;
  setSearch: (value: string) => void;
  tags: {
    material: string[];
    manufacturer: string[];
    scale: string[];
    type: string[];
  };
  onTagClick: (param: string, value: string) => void;
  activeTags: { [key: string]: string[] };
  onResetAll: () => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  search,
  setSearch,
  tags,
  onTagClick,
  activeTags,
  onResetAll,
  showFavorites,
  onToggleFavorites
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full md:w-1/4 min-w-[180px] max-w-[300px] h-full bg-white flex flex-col overflow-hidden">
      {/* Фиксированная верхняя часть панели */}
      <div className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{t('App.title')}</h2>
          <LanguageSelector />
        </div>

        <input
          type="text"
          placeholder={t('LeftPanel.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <div className="flex gap-2">
          <div
            onClick={onToggleFavorites}
            className={`px-2 py-1 text-xs rounded cursor-pointer inline-block w-fit border ${
              showFavorites 
                ? 'bg-red-500 text-white border-red-500' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200'
            }`}
          >
            {showFavorites ? t('LeftPanel.showAll') : t('LeftPanel.showFavorites')}
          </div>
          <div
            onClick={onResetAll}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 rounded cursor-pointer inline-block w-fit border border-gray-200"
          >
            {t('LeftPanel.resetFilters')}
          </div>
        </div>
      </div>

      {/* Скроллируемая часть с тегами */}
      <div className="flex-1 overflow-y-auto p-4 pt-0">
        {Object.entries(TAGS).map(([key]) => (
          <div key={key} className="mb-4">
            <div className="mb-1 font-semibold">{t(`LeftPanel.${key}`)}</div>
            <TagBlock
              param={key}
              tags={tags[key as keyof typeof tags]}
              onTagClick={onTagClick}
              activeTags={activeTags}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftPanel; 