export interface Figure {
  name: string;
  img: string;
  desc?: string;
}

export interface DataItem {
  id: string;
  name: string;
  manufacturer: string;
  scale: string;
  year: string;
  folder: string;
  img: string;
  image?: string;
  material: string;
  type: string;
  desc?: string;
  figures?: Figure[];
  file?: File;
}

export interface OverlayProps {
  item: DataItem;
  onClose: () => void;
  initialImageIndex?: number;
}

export interface CardProps {
  item: DataItem;
  onClick?: (item: DataItem) => void;
}

export interface LeftPanelProps {
  search: string;
  setSearch: (search: string) => void;
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

