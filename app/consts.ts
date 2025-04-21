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
  en: `<svg ${svgAttrs}><path fill="#012169" d="M0 0h640v480H0"/><path stroke="#fff" stroke-width="120" d="M0 240h640"/><path stroke="#fff" stroke-width="120" d="M320 0v480"/><path stroke="#c8102e" stroke-width="80" d="M0 240h640"/><path stroke="#c8102e" stroke-width="80" d="M320 0v480"/><path stroke="#fff" stroke-width="120" d="M0 0l640 480"/><path stroke="#fff" stroke-width="120" d="M640 0l-640 480"/><path stroke="#c8102e" stroke-width="80" d="M0 0l640 480"/><path stroke="#c8102e" stroke-width="80" d="M640 0l-640 480"/></svg>`,
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