import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../consts';
import Flag from './ui/Flag';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = async (code: string) => {
    try {
      await i18n.changeLanguage(code);
      localStorage.setItem('language', code);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const currentLang = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

  return (
    <div className="relative cursor-pointer" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 bg-white"
      >
        <Flag code={currentLang.code} />
        <span>{currentLang.name}</span>
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-[60]">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center gap-1 px-2 py-1 text-sm cursor-pointer hover:bg-gray-50"
            >
              <Flag code={lang.code} />
              <span>{lang.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 