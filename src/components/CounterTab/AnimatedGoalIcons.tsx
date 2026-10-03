import React from 'react';

/**
 * AnimatedGiftIcon
 * Коробка подарунка динамічно труситься з боку в бік, наче хтось її підняв і трусить, намагаючись відгадати, що всередині
 */
export const AnimatedGiftIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 text-amber-400" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`overflow-visible shrink-0 ${className}`}
    >
      {/* Playful curiosity sparks when shaking */}
      <path 
        d="M3.5 6.5L3.5 8.5M2.5 7.5L4.5 7.5" 
        className="stroke-amber-300 animate-gift-shake-spark-l" 
        strokeWidth="1.2" 
      />
      <path 
        d="M20.5 6.5L20.5 8.5M19.5 7.5L21.5 7.5" 
        className="stroke-amber-300 animate-gift-shake-spark-r" 
        strokeWidth="1.2" 
      />

      {/* The entire Gift Box shaking playfully from side to side */}
      <g className="animate-gift-box-shake">
        {/* Box Body */}
        <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" className="stroke-current fill-current/15" />
        <line x1="12" y1="12" x2="12" y2="21" className="stroke-current" strokeWidth="2" />

        {/* Lid */}
        <rect x="3" y="8" width="18" height="4" rx="1" className="stroke-current fill-current/25" />
        <line x1="12" y1="8" x2="12" y2="12" className="stroke-current" strokeWidth="2" />
        
        {/* Bow Loops */}
        <path 
          d="M12 8C12 8 8 3.5 5.5 5C3.5 6.2 5 8 12 8Z" 
          className="stroke-current fill-current/30" 
          strokeWidth="1.6"
        />
        <path 
          d="M12 8C12 8 16 3.5 18.5 5C20.5 6.2 19 8 12 8Z" 
          className="stroke-current fill-current/30" 
          strokeWidth="1.6"
        />
        
        {/* Knot */}
        <circle cx="12" cy="8" r="1.3" className="fill-current stroke-current" />
      </g>
    </svg>
  );
};

/**
 * AnimatedLightningIcon
 * Блискавка повільно піднімається вгору, накопичуючи енергію, потім різко б'є вниз, розсипаючи сяючі іскри з кінчика
 */
export const AnimatedLightningIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 text-fuchsia-400" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`overflow-visible shrink-0 ${className}`}
    >
      {/* The Lightning Bolt that rises and sharply strikes down */}
      <path 
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" 
        className="stroke-current fill-current/25 animate-lightning-strike"
      />

      {/* Sparks bursting from the bottom tip */}
      <circle cx="9" cy="22" r="1" className="fill-current stroke-none animate-spark-1" />
      <circle cx="11.5" cy="24" r="1.2" className="fill-current stroke-none animate-spark-2" />
      <circle cx="14" cy="22.5" r="0.9" className="fill-current stroke-none animate-spark-3" />
      
      <path 
        d="M11 21.5L11 23.5M10 22.5L12 22.5" 
        className="stroke-current animate-spark-star" 
        strokeWidth="1.2" 
      />
    </svg>
  );
};
