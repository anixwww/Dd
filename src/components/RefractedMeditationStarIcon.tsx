import React from 'react';
import { Star } from 'lucide-react';

interface StarIconProps {
  className?: string;
  isDecomposing?: boolean;
  style?: React.CSSProperties;
}

export const RefractedMeditationStarIcon: React.FC<StarIconProps> = ({ className = 'w-6 h-6 text-amber-400', isDecomposing, style }) => {
  return <Star style={style} className={`${className} ${isDecomposing ? 'animate-spin' : 'animate-pulse'}`} />;
};
