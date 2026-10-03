import React, { useState, useEffect } from 'react';
import { SentientRandomThought, THOUGHT_CATEGORIES_METADATA } from '../data/analyzerThoughts';

export interface AnalyzerThoughtViewProps {
  thought: SentientRandomThought | null;
  onNextThought: () => void;
  onPrevThought?: () => void;
  isVisible: boolean;
  fontSize?: number;
  cloudRestHue?: number;
}

export const AnalyzerThoughtView: React.FC<AnalyzerThoughtViewProps> = ({
  thought,
  onNextThought,
  isVisible,
  fontSize = 12,
}) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Smooth appearance trigger on thought change
  useEffect(() => {
    if (thought) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 350);
      return () => clearTimeout(timer);
    }
  }, [thought?.id, thought?.text]);

  if (!thought || !isVisible) {
    return (
      <div className="w-full h-[48px] min-h-[48px] flex items-center justify-center opacity-0 pointer-events-none select-none" />
    );
  }

  const handleTextClick = () => {
    if (navigator.vibrate) try { navigator.vibrate(8); } catch {}
    onNextThought();
  };

  const categoryTitle = thought.categoryLabel || (thought.category ? THOUGHT_CATEGORIES_METADATA[thought.category]?.label : '') || '';

  return (
    <div
      onClick={handleTextClick}
      className="w-full max-w-[360px] sm:max-w-md mx-auto py-1 flex flex-col items-center justify-center text-center cursor-pointer select-none px-3 transition-all duration-300"
      title="Натисніть, щоб прочитати наступну думку"
    >
      <div 
        className={`flex flex-col items-center justify-center text-center transition-all duration-400 ease-out ${
          isAnimating ? 'opacity-0 scale-98 translate-y-1' : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {categoryTitle && (
          <div className="mb-1.5 flex items-center justify-center">
            <span className="text-[10px] xs:text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-wider text-amber-200/90 drop-shadow-[0_0_8px_rgba(254,240,138,0.45)] select-none">
              {categoryTitle}
            </span>
          </div>
        )}
        <p 
          className="font-normal text-zinc-200 leading-snug tracking-tight max-w-[340px] sm:max-w-[380px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          style={{
            fontSize: fontSize ? `${fontSize}px` : '12px',
          }}
        >
          «{thought.text}»
        </p>
      </div>
    </div>
  );
};
