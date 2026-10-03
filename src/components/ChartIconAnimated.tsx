import React from 'react';

interface ChartIconAnimatedProps {
  isActive?: boolean;
  className?: string;
}

/**
 * Animated Graph Pictogram:
 * 1. Base "L" shape draws into a square "O" and returns to "L"
 * 2. "L" tilts sideways and springs back into upright equilibrium
 * 3. "L" grows horizontal strokes to become "E" and returns to "L"
 */
export const ChartIconAnimated: React.FC<ChartIconAnimatedProps> = ({ 
  isActive = false, 
  className = "w-4 h-4" 
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        className={`w-full h-full overflow-visible ${
          isActive ? 'text-cyan-400' : 'text-current'
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 5 5 L 5 19 L 19 19" />
      </svg>
    </div>
  );
};
