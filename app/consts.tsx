import path from 'path'
import React from 'react';


export const EDIT_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

export const DELETE_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
); 

export const ADD_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

export const DELETE_ICON2 = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
); 

export const LANGUAGES = [
  { code: 'en', name: 'EN' },
  { code: 'ru', name: 'RU' },
  { code: 'de', name: 'DE' },
  { code: 'fr', name: 'FR' },
  { code: 'es', name: 'ES' },
  { code: 'it', name: 'IT' },
  { code: 'pt', name: 'PT' },
  { code: 'nl', name: 'NL' },
  { code: 'pl', name: 'PL' },
  { code: 'uk', name: 'UK' },
] as const;

export const IMAGE_PATH = 'data/images';

export const TAGS = {
  material: 'material',
  manufacturer: 'manufacturer',
  scale: 'scale',
  type: 'type',
} as const;

// Common SVG attributes
const svgAttrs = 'viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg"';

export const FLAGS = {
  en: `<svg ${svgAttrs}><path fill="#012169" d="M0 0h640v480H0"/><path fill="#fff" d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/><path fill="#C8102E" d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"/><path fill="#fff" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/><path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"/></svg>`,
  ru: `<svg ${svgAttrs}><path fill="#fff" d="M0 0h640v480H0"/><path fill="#0039A6" d="M0 160h640v320H0"/><path fill="#D52B1E" d="M0 320h640v160H0"/></svg>`,
  de: `<svg ${svgAttrs}><path fill="#000" d="M0 0h640v160H0"/><path fill="#D00" d="M0 160h640v160H0"/><path fill="#FFCE00" d="M0 320h640v160H0"/></svg>`,
  fr: `<svg ${svgAttrs}><path fill="#002395" d="M0 0h213.3v480H0"/><path fill="#fff" d="M213.3 0h213.3v480H213.3"/><path fill="#ED2939" d="M426.6 0H640v480H426.6"/></svg>`,
  es: `<svg ${svgAttrs}><path fill="#c60b1e" d="M0 0h640v480H0"/><path fill="#ffc400" d="M0 120h640v240H0"/></svg>`,
  it: `<svg ${svgAttrs}><path fill="#009246" d="M0 0h213.3v480H0"/><path fill="#fff" d="M213.3 0h213.3v480H213.3"/><path fill="#ce2b37" d="M426.6 0H640v480H426.6"/></svg>`,
  pt: `<svg ${svgAttrs}><path fill="#f00" d="M0 0h640v480H0"/><path fill="#060" d="M0 0h320v480H0"/><path fill="#ff0" d="M160 0a160 160 0 1 0 0 320 160 160 0 0 0 0-320"/><path fill="#fff" d="M160 80a80 80 0 1 1 0 160 80 80 0 0 1 0-160"/><path fill="#f00" d="M160 120a40 40 0 1 0 0 80 40 40 0 0 0 0-80"/></svg>`,
  nl: `<svg ${svgAttrs}><path fill="#21468B" d="M0 0h640v160H0"/><path fill="#FFFFFF" d="M0 160h640v160H0"/><path fill="#AE1C28" d="M0 320h640v160H0"/></svg>`,
  pl: `<svg ${svgAttrs}><path fill="#fff" d="M0 0h640v240H0"/><path fill="#dc143c" d="M0 240h640v240H0"/></svg>`,
  uk: `<svg ${svgAttrs}><path fill="#005BBB" d="M0 0h640v240H0"/><path fill="#FFD500" d="M0 240h640v240H0"/></svg>`,
} as const; 

export const DATA_FILE_PATH = path.join(process.cwd(), 'app', 'data', 'data.json') 

export const SOLDIER_PLACEHOLDER = (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
); 