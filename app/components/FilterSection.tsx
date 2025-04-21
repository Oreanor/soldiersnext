import { useTranslation } from 'react-i18next';
import Tag from './Tag';
import { TAGS } from '../consts';

interface FilterSectionProps {
  tags: { [key: string]: string[] };
  onTagClick: (param: string, value: string) => void;
  activeTags: { [key: string]: string[] };
}

const renderTags = (
  param: string,
  tags: string[],
  onTagClick: (param: string, value: string) => void,
  activeTags: { [key: string]: string[] }
) => (
  <div className="flex flex-wrap gap-1 mb-2">
    {tags.map(tag => {
      const isActive = (activeTags[param] || []).includes(tag);
      return (
        <Tag key={tag} active={isActive} onClick={() => onTagClick(param, tag)}>
          {tag}
        </Tag>
      );
    })}
  </div>
);

const FilterSection: React.FC<FilterSectionProps> = ({
  tags,
  onTagClick,
  activeTags
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 font-semibold">{t('LeftPanel.material')}</div>
        {renderTags(TAGS.material, tags.material, onTagClick, activeTags)}
      </div>
      <div>
        <div className="mb-1 font-semibold">{t('LeftPanel.manufacturer')}</div>
        {renderTags(TAGS.manufacturer, tags.manufacturer, onTagClick, activeTags)}
      </div>
      <div>
        <div className="mb-1 font-semibold">{t('LeftPanel.scale')}</div>
        {renderTags(TAGS.scale, tags.scale, onTagClick, activeTags)}
      </div>
      <div>
        <div className="mb-1 font-semibold">{t('LeftPanel.type')}</div>
        {renderTags(TAGS.type, tags.type, onTagClick, activeTags)}
      </div>
    </div>
  );
};

export default FilterSection; 