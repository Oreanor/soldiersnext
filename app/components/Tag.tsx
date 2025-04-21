'use client';

import React from 'react';

interface TagProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Tag: React.FC<TagProps> = ({ active, onClick, children }) => (
  <div
    className={`px-2 py-0.5 min-w-[18px] min-h-[18px] border rounded-md text-[12px] transition select-none cursor-pointer inline-flex items-center justify-center ${active ? 'bg-black text-white border-black' : 'bg-white border-gray-300 text-black hover:bg-blue-100'}`}
    onClick={onClick}
    tabIndex={0}
    role="button"
  >
    {children}
  </div>
);

export default Tag; 