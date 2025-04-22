'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import ruTranslations from './locales/ru.json';
import deTranslations from './locales/de.json';
import frTranslations from './locales/fr.json';
import esTranslations from './locales/es.json';
import itTranslations from './locales/it.json';
import ptTranslations from './locales/pt.json';
import nlTranslations from './locales/nl.json';
import plTranslations from './locales/pl.json';
import ukTranslations from './locales/uk.json';

const initI18next = async () => {
  if (i18n.isInitialized) {
    return i18n;
  }

  return i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: enTranslations },
        ru: { translation: ruTranslations },
        de: { translation: deTranslations },
        fr: { translation: frTranslations },
        es: { translation: esTranslations },
        it: { translation: itTranslations },
        pt: { translation: ptTranslations },
        nl: { translation: nlTranslations },
        pl: { translation: plTranslations },
        uk: { translation: ukTranslations },
      },
      lng: typeof localStorage !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: 'language',
        caches: ['localStorage'],
      },
    });
};

// Initialize i18next
if (typeof window !== 'undefined') {
  initI18next();
}

export default i18n; 