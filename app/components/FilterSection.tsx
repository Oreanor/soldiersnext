import { useTranslation } from 'react-i18next';
import Tag from './ui/Tag';
import { TAGS } from '../consts';

interface FilterSectionProps {
  tags: { [key: string]: string[] };
  onTagClick: (param: string, value: string) => void;
  activeTags: { [key: string]: string[] };
}

const FilterSection: React.FC<FilterSectionProps> = ({
  tags,
  onTagClick,
  activeTags
}) => {
  const { t } = useTranslation();

  const renderTagSection = (param: keyof typeof TAGS) => (
    <div key={param}>
      <div className="mb-1 font-semibold">{t(`LeftPanel.${param}`)}</div>
      <div className="flex flex-wrap gap-1 mb-2">
        {tags[param].map(tag => {
          const isActive = (activeTags[param] || []).includes(tag);
          return (
            <Tag key={tag} active={isActive} onClick={() => onTagClick(param, tag)}>
              {tag}
            </Tag>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {(Object.keys(TAGS) as Array<keyof typeof TAGS>).map(param => renderTagSection(param))}
    </div>
  );
};

export default FilterSection; 