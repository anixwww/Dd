import React from 'react';
import { Tag } from 'lucide-react';

interface CategoryIconProps {
  name?: string;
  category?: string;
  className?: string;
}

export const RefractedCategoryIcon: React.FC<CategoryIconProps> = ({ className = 'w-4 h-4 text-amber-400' }) => {
  return <Tag className={className} />;
};
