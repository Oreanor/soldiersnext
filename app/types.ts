export type ItemType = {
  id: number;
  name: string;
  manufacturer: string;
  scale: string;
  year: string;
  folder: string;
  img: string;
  material: string;
  type: string;
  desc?: string;
  figures?: { name: string; img: string }[];
  [key: string]: any;
};

export interface OverlayProps {
  item: ItemType;
  onClose: () => void;
  initialImageIndex?: number;
}

export interface CardProps {
  item: ItemType;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  onClick?: (item: ItemType) => void;
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