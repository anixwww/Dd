import React from 'react';
import { AnimatedAnalyzerIcon } from './AnimatedAnalyzerIcon';

export { AnimatedAnalyzerIcon };

interface NavIconProps {
  active: boolean;
  className?: string;
}

/**
  * 1. Головна — Будинок (без інь-ян та зірки)
  */
export const NavHomeIcon: React.FC<NavIconProps> = ({ active, className = 'w-5 h-5' }) => {
  return (
    <span className={`inline-flex items-center justify-center relative ${className}`}>
      <style>{`
        @keyframes navHouseFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-1.5px) scale(1.05); }
        }
        .animate-nav-house {
          animation: navHouseFloat 4.5s ease-in-out infinite;
          transform-origin: 12px 12px;
        }
      `}</style>
      <svg
        viewBox="0 0 24 24"
        className={`w-full h-full overflow-visible transition-all duration-300 ${active ? 'scale-110 animate-nav-house' : 'opacity-85'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* House Gabled Roof & Walls */}
        <path
          d="M 12,3 L 3,11 L 5,11 L 5,20 C 5,20.8 5.6,21.5 6.4,21.5 L 17.6,21.5 C 18.4,21.5 19,20.8 19,20 L 19,11 L 21,11 Z"
          className={active ? 'stroke-amber-300 fill-amber-500/10' : 'stroke-current fill-current/5'}
          strokeWidth="1.8"
        />
        {/* Simple House Door / Window */}
        <rect
          x="9.5"
          y="14"
          width="5"
          height="7"
          rx="1"
          className={active ? 'stroke-amber-300 fill-zinc-950' : 'stroke-current fill-current/10'}
          strokeWidth="1.2"
        />
      </svg>
    </span>
  );
};

/**
  * 2. СОС — Компас (без інь-ян та зірки)
  */
export const NavSosIcon: React.FC<NavIconProps> = ({ active, className = 'w-5 h-5' }) => {
  return (
    <span className={`inline-flex items-center justify-center relative ${className}`}>
      <style>{`
        @keyframes navCompassSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-nav-compass-spin {
          animation: navCompassSpin 18s linear infinite;
          transform-origin: 12px 12px;
        }
      `}</style>
      <svg
        viewBox="0 0 24 24"
        className={`w-full h-full overflow-visible transition-all duration-300 ${active ? 'scale-110' : 'opacity-85'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Outer Compass Degree Dial */}
        <circle
          cx="12"
          cy="12"
          r="9.5"
          className={active ? 'stroke-rose-400 fill-rose-500/10' : 'stroke-current fill-current/5'}
          strokeWidth="1.8"
        />

        {/* Rotating 8-Wind Rays */}
        <g className={`animate-nav-compass-spin ${active ? '' : 'opacity-70'}`}>
          <line x1="12" y1="2.8" x2="12" y2="21.2" className={active ? 'stroke-rose-300/80' : 'stroke-current'} strokeWidth="1" strokeDasharray="1.5 2" />
          <line x1="2.8" y1="12" x2="21.2" y2="12" className={active ? 'stroke-rose-300/80' : 'stroke-current'} strokeWidth="1" strokeDasharray="1.5 2" />
          <line x1="5.5" y1="5.5" x2="18.5" y2="18.5" className={active ? 'stroke-rose-300/60' : 'stroke-current'} strokeWidth="0.8" strokeDasharray="1 2" />
          <line x1="18.5" y1="5.5" x2="5.5" y2="18.5" className={active ? 'stroke-rose-300/60' : 'stroke-current'} strokeWidth="0.8" strokeDasharray="1 2" />
        </g>

        {/* Central Compass Needle / Crosshair */}
        <circle
          cx="12"
          cy="12"
          r="2"
          className={active ? 'stroke-rose-300 fill-zinc-950' : 'stroke-current fill-current'}
          strokeWidth="1"
        />
        <path
          d="M 12,7 L 12,17 M 7,12 L 17,12"
          className={active ? 'stroke-rose-300' : 'stroke-current'}
          strokeWidth="1.2"
        />
      </svg>
    </span>
  );
};

/**
  * 3. Ще — Коробки / Скрині (без інь-ян та зірки)
  */
export const NavMoreIcon: React.FC<NavIconProps> = ({ active, className = 'w-5 h-5' }) => {
  return (
    <span className={`inline-flex items-center justify-center relative ${className}`}>
      <style>{`
        @keyframes navBoxesFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-1.5px) scale(1.05); }
        }
        .animate-nav-boxes {
          animation: navBoxesFloat 5s ease-in-out infinite;
          transform-origin: 12px 12px;
        }
      `}</style>
      <svg
        viewBox="0 0 24 24"
        className={`w-full h-full overflow-visible transition-all duration-300 ${active ? 'scale-110 animate-nav-boxes' : 'opacity-85'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Back Stacked Box (Shifted Left & Top) */}
        <path
          d="M 6,3.5 L 15,3.5 L 18,6.5 L 9,6.5 Z M 18,6.5 L 18,13.5 L 15,13.5 M 6,3.5 L 6,10.5 L 9,13.5"
          className={active ? 'stroke-indigo-400/70 fill-indigo-500/10' : 'stroke-current/60 fill-none'}
          strokeWidth="1.2"
        />

        {/* Front Main Celestial Chest / Box */}
        <rect
          x="3.5"
          y="8.5"
          width="16"
          height="12"
          rx="2"
          className={active ? 'stroke-indigo-300 fill-indigo-500/15' : 'stroke-current fill-current/5'}
          strokeWidth="1.8"
        />

        {/* Box Lid Opening Line */}
        <line
          x1="3.5"
          y1="12"
          x2="19.5"
          y2="12"
          className={active ? 'stroke-indigo-200' : 'stroke-current'}
          strokeWidth="1.2"
        />

        {/* Simple Box Handle / Lock */}
        <rect
          x="10"
          y="14"
          width="4"
          height="3"
          rx="1"
          className={active ? 'stroke-indigo-200 fill-zinc-950' : 'stroke-current fill-current/20'}
          strokeWidth="1"
        />
      </svg>
    </span>
  );
};

/**
 * 4. Часові досягнення — Астролябія / Хронометр свободи (в стилі Головна, СОС, Ще)
 */
export const NavTimeAchievementIcon: React.FC<NavIconProps> = ({ active, className = 'w-5 h-5' }) => {
  return (
    <span className={`inline-flex items-center justify-center relative ${className}`}>
      <svg
        viewBox="0 0 24 24"
        className={`w-full h-full overflow-visible transition-all duration-300 ${active ? 'scale-110' : 'opacity-85'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Top Winder & Loop (Astrolabe / Pocket Chronometer Crown) */}
        <path
          d="M 9.5,2.2 C 9.5,1 14.5,1 14.5,2.2 M 12,2.2 L 12,4"
          className={active ? 'stroke-amber-300' : 'stroke-current'}
          strokeWidth="1.4"
        />
        <rect
          x="10"
          y="2.5"
          width="4"
          height="2"
          rx="0.5"
          className={active ? 'stroke-amber-300 fill-zinc-950' : 'stroke-current fill-current/10'}
          strokeWidth="1.2"
        />

        {/* Main Outer Chronometer Dial */}
        <circle
          cx="12"
          cy="13"
          r="8.5"
          className={active ? 'stroke-amber-400 fill-amber-500/10' : 'stroke-current fill-current/5'}
          strokeWidth="1.8"
        />

        {/* 4 Cardinal Ticks / Astrolabe Points */}
        <line x1="12" y1="5.5" x2="12" y2="7.5" className={active ? 'stroke-amber-300' : 'stroke-current'} strokeWidth="1.2" />
        <line x1="12" y1="18.5" x2="12" y2="20.5" className={active ? 'stroke-amber-300' : 'stroke-current'} strokeWidth="1.2" />
        <line x1="4.5" y1="13" x2="6.5" y2="13" className={active ? 'stroke-amber-300' : 'stroke-current'} strokeWidth="1.2" />
        <line x1="17.5" y1="13" x2="19.5" y2="13" className={active ? 'stroke-amber-300' : 'stroke-current'} strokeWidth="1.2" />

        {/* Victory Clock Hands (pointing to 10:10) */}
        <line
          x1="12"
          y1="13"
          x2="8.8"
          y2="9.8"
          className={active ? 'stroke-amber-200' : 'stroke-current'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="12"
          y1="13"
          x2="15.8"
          y2="10.8"
          className={active ? 'stroke-amber-300' : 'stroke-current'}
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Center Jewel Pivot */}
        <circle
          cx="12"
          cy="13"
          r="1.8"
          className={active ? 'stroke-amber-200 fill-zinc-950' : 'stroke-current fill-zinc-950'}
          strokeWidth="1.2"
        />

        {/* Inner Diamond / Star of Freedom at 12 o'clock */}
        <polygon
          points="12,8 12.6,9.2 13.8,9.5 12.8,10.3 13.2,11.5 12,10.8 10.8,11.5 11.2,10.3 10.2,9.5 11.4,9.2"
          className={active ? 'fill-amber-300 stroke-none' : 'fill-current/30 stroke-none'}
        />
      </svg>
    </span>
  );
};
