import React from 'react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, onClick }) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
      isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
    }`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={isFavorite ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  </div>
);

export default FavoriteButton; 