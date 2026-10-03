import React from 'react';
import { Circle } from 'lucide-react';

interface YinYangIconProps {
  className?: string;
  isDecomposing?: boolean;
}

export const RefractedYinYangIcon: React.FC<YinYangIconProps> = ({ className = 'w-5 h-5 text-indigo-400' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Circle className="w-full h-full animate-spin-slow" />
    </div>
  );
};
