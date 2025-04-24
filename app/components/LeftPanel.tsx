import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import TagBlock from './TagBlock';
import Button from './ui/Button';
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
    <div className="w-full min-w-[180px] sm:max-w-[300px]  sm:h-full h-auto bg-white flex flex-col overflow-hidden z-10">
      {/* Фиксированная верхняя часть панели */}
      <div className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{t('App.title')}</h2>
          <LanguageSelector />
        </div>

        <div className="flex flex-row sm:flex-col gap-2">
          <input
            type="text"
            placeholder={t('LeftPanel.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />

          <div className="flex gap-2">
            <Button
              onClick={onToggleFavorites}
              variant={showFavorites ? 'danger' : 'primary'}
            >
              {showFavorites ? t('LeftPanel.showAll') : t('LeftPanel.showFavorites')}
            </Button>
            <Button
              onClick={onResetAll}
              variant="secondary"
              className="hidden sm:inline-block"
            >
              {t('LeftPanel.resetFilters')}
            </Button>
          </div>
        </div>
      </div>

      {/* Скроллируемая часть с тегами */}
      <div className="flex-1 overflow-y-auto p-4 pt-0 hidden sm:block">
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