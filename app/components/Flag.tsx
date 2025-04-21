import { FLAGS } from '../consts';

interface FlagProps {
  code: string;
  className?: string;
}

export default function Flag({ code, className = '' }: FlagProps) {
  // Extract the path data from the SVG string
  const flagSvg = FLAGS[code.toLowerCase() as keyof typeof FLAGS];
  const pathMatch = flagSvg.match(/<path[^>]*>/g);
  
  return (
    <div className={`relative w-4 h-2.5 ${className}`}>
      <svg 
        viewBox="0 0 640 480" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {pathMatch?.map((path, index) => (
          <path key={index} {...extractPathAttributes(path)} />
        ))}
      </svg>
    </div>
  );
}

// Helper function to extract path attributes
function extractPathAttributes(pathString: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const matches = pathString.matchAll(/(\w+)="([^"]*)"/g);
  
  for (const match of matches) {
    attributes[match[1]] = match[2];
  }
  
  return attributes;
} 