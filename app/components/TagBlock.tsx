import React from 'react';
import { useTranslation } from 'react-i18next';
import Tag from './Tag';

interface TagBlockProps {
  param: string;
  tags: string[];
  onTagClick: (param: string, value: string) => void;
  activeTags: { [key: string]: string[] };
}

const TagBlock: React.FC<TagBlockProps> = ({
  param,
  tags,
  onTagClick,
  activeTags
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-1 mb-2">
      {tags.map(tag => {
        const isActive = (activeTags[param] || []).includes(tag);
        let displayText = tag;
        
        // Use translations for materials and types
        if (param === 'material') {
          displayText = t(`materials.${tag}`);
        } else if (param === 'type') {
          displayText = t(`types.${tag}`);
        }
        
        return (
          <Tag key={tag} active={isActive} onClick={() => onTagClick(param, tag)}>
            {displayText}
          </Tag>
        );
      })}
    </div>
  );
};

export default TagBlock; 