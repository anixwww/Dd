import React from 'react';
import { Shield, Sparkles, Heart, Activity, Zap, Compass, Star } from 'lucide-react';

interface PictogramProps {
  name?: string;
  category?: string;
  className?: string;
}

export const RefractedSectionPictograms: React.FC<PictogramProps> = ({ name, category, className = 'w-5 h-5 text-amber-400' }) => {
  return getSectionRefractedPictogram(name || category || '', className);
};

export const getSectionRefractedPictogram = (name: string, className = 'w-5 h-5 text-amber-400') => {
  switch (name) {
    case 'shield':
    case 'health_advice':
      return <Shield className={className} />;
    case 'sparkles':
    case 'app_guide':
      return <Sparkles className={className} />;
    case 'heart':
    case 'poetic':
      return <Heart className={className} />;
    case 'activity':
    case 'science':
      return <Activity className={className} />;
    case 'zap':
    case 'absurd':
      return <Zap className={className} />;
    case 'compass':
    case 'subtle_mundane':
      return <Compass className={className} />;
    default:
      return <Star className={className} />;
  }
};
