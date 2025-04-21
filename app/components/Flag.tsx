import React from 'react';
import { FLAGS } from '../consts';

interface FlagProps {
  code: string;
  className?: string;
}

const Flag: React.FC<FlagProps> = ({ code, className = '' }) => {
  // Create a data URL from the SVG string
  const svgString = FLAGS[code as keyof typeof FLAGS] || '';
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);

  return (
    <img 
      src={svgUrl}
      alt={`${code.toUpperCase()} flag`}
      className={`inline-block w-4 h-3 ${className}`}
      onLoad={() => URL.revokeObjectURL(svgUrl)}
    />
  );
};

export default Flag; 