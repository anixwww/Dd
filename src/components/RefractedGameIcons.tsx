import React from 'react';

export interface RefractedGameIconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

/**
 * 1. Заломлений Пісочний Годинник Часу (Refracted Hourglass Prism Icon)
 * Для гри "Піщинки часу"
 */
export const RefractedSandglassIcon: React.FC<RefractedGameIconProps> = ({
  className = 'w-4 h-4',
  size,
  style
}) => {
  const css = `
    @keyframes sandglassSpin {
      0% {
        transform: rotate(0deg);
        filter: drop-shadow(0 0 2px rgba(245, 158, 11, 0.4)) drop-shadow(0 0 6px rgba(255, 253, 208, 0.3));
      }
      50% {
        transform: rotate(180deg);
        filter: drop-shadow(0 0 5px rgba(254, 240, 138, 0.8)) drop-shadow(0 0 10px rgba(245, 158, 11, 0.5));
      }
      100% {
        transform: rotate(360deg);
        filter: drop-shadow(0 0 2px rgba(245, 158, 11, 0.4)) drop-shadow(0 0 6px rgba(255, 253, 208, 0.3));
      }
    }

    @keyframes sandFall {
      0% {
        stroke-dashoffset: 0;
        opacity: 0.3;
      }
      50% {
        opacity: 1;
      }
      100% {
        stroke-dashoffset: -12;
        opacity: 0.3;
      }
    }

    .animate-sandglass-spin {
      animation: sandglassSpin 16s ease-in-out infinite;
      transform-origin: 16px 16px;
    }

    .animate-sand-stream {
      animation: sandFall 2.5s linear infinite;
      stroke-dasharray: 2 3;
    }
  `;

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`${className} select-none overflow-visible`}
      style={style}
    >
      <style>{css}</style>
      <defs>
        <radialGradient id="sandGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFDD0" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="prismSandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFDD0" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>

      <g className="animate-sandglass-spin">
        {/* Зовнішнє призматичне німбове коло */}
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke="url(#prismSandGrad)"
          strokeWidth="0.8"
          strokeDasharray="2 3"
          opacity="0.6"
        />

        {/* Верхній кристалічний трикутник */}
        <polygon
          points="7,6 25,6 16,15"
          fill="none"
          stroke="url(#prismSandGrad)"
          strokeWidth="1.2"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <polygon
          points="9,8 23,8 16,14"
          fill="#F59E0B"
          fillOpacity="0.15"
        />

        {/* Нижній кристалічний трикутник */}
        <polygon
          points="7,26 25,26 16,17"
          fill="none"
          stroke="url(#prismSandGrad)"
          strokeWidth="1.2"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <polygon
          points="9,24 23,26 16,18"
          fill="#38BDF8"
          fillOpacity="0.12"
        />

        {/* Центральний фокальний вузол перетікання часу */}
        <circle cx="16" cy="16" r="2.5" fill="url(#sandGlow)" />
        <circle cx="16" cy="16" r="1" fill="#FFFFFF" />

        {/* Струмінь кванта піщинок */}
        <line
          x1="16"
          y1="12"
          x2="16"
          y2="20"
          stroke="#FFFDD0"
          strokeWidth="1"
          strokeLinecap="round"
          className="animate-sand-stream"
        />

        {/* Верхня і нижня дзеркальні планки */}
        <line x1="6" y1="5" x2="26" y2="5" stroke="#FFFDD0" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
        <line x1="6" y1="27" x2="26" y2="27" stroke="#FFFDD0" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
      </g>
    </svg>
  );
};

/**
 * 2. Заломлене Дерево Життя (Refracted Tree of Life Icon)
 * Для гри "Святилище дерева"
 */
export const RefractedTreeOfLifeIcon: React.FC<RefractedGameIconProps> = ({
  className = 'w-4 h-4',
  size,
  style
}) => {
  const css = `
    @keyframes treePulseGlow {
      0%, 100% {
        transform: scale(0.97);
        filter: drop-shadow(0 0 2px rgba(16, 185, 129, 0.4)) drop-shadow(0 0 6px rgba(56, 189, 248, 0.3));
      }
      50% {
        transform: scale(1.04);
        filter: drop-shadow(0 0 6px rgba(52, 211, 153, 0.8)) drop-shadow(0 0 12px rgba(16, 185, 129, 0.5));
      }
    }

    @keyframes leafGlint {
      0%, 100% {
        opacity: 0.6;
      }
      50% {
        opacity: 1;
      }
    }

    .animate-tree-pulse {
      animation: treePulseGlow 4s ease-in-out infinite;
      transform-origin: 16px 16px;
    }

    .animate-leaf-glint {
      animation: leafGlint 3s ease-in-out infinite;
    }
  `;

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`${className} select-none overflow-visible`}
      style={style}
    >
      <style>{css}</style>
      <defs>
        <linearGradient id="prismTreeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#FFFDD0" />
        </linearGradient>
        <radialGradient id="treeCrownGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="animate-tree-pulse">
        {/* Земляний призматичний постамент */}
        <ellipse cx="16" cy="27" rx="10" ry="2" fill="none" stroke="url(#prismTreeGrad)" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />

        {/* Світловий кристал стовбура */}
        <path
          d="M16,27 L16,14 M16,20 L11,16 M16,17 L21,13 M16,14 L12,10 M16,14 L20,10"
          stroke="url(#prismTreeGrad)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Крона із сакральних алмазних фасетів */}
        {/* Центральний ромб */}
        <polygon points="16,4 19,9 16,14 13,9" fill="url(#treeCrownGlow)" stroke="#FFFDD0" strokeWidth="0.8" className="animate-leaf-glint" />
        
        {/* Лівий і правий кристали */}
        <polygon points="10,10 14,12 11,16 7,14" fill="#06B6D4" fillOpacity="0.4" stroke="#06B6D4" strokeWidth="0.7" />
        <polygon points="22,10 25,14 21,16 18,12" fill="#10B981" fillOpacity="0.4" stroke="#10B981" strokeWidth="0.7" />

        {/* Верхній сяючий кристал */}
        <circle cx="16" cy="4" r="1.5" fill="#FFFFFF" />
        <circle cx="10" cy="10" r="1" fill="#FFFDD0" />
        <circle cx="22" cy="10" r="1" fill="#FFFDD0" />
      </g>
    </svg>
  );
};

/**
 * 3. Заломлені Космічні Орбіти (Refracted Orbit Sphere Icon)
 * Для гри "Гравітаційні орбіти"
 */
export const RefractedOrbitSphereIcon: React.FC<RefractedGameIconProps> = ({
  className = 'w-4 h-4',
  size,
  style
}) => {
  const css = `
    @keyframes orbitSpin1 {
      0% {
        transform: rotate(0deg);
        filter: drop-shadow(0 0 2px rgba(56, 189, 248, 0.4));
      }
      100% {
        transform: rotate(360deg);
        filter: drop-shadow(0 0 2px rgba(56, 189, 248, 0.4));
      }
    }

    @keyframes orbitSpin2 {
      0% {
        transform: rotate(360deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }

    @keyframes coreGleam {
      0%, 100% {
        transform: scale(0.9);
        opacity: 0.85;
      }
      50% {
        transform: scale(1.15);
        opacity: 1;
        filter: drop-shadow(0 0 6px #ffffff);
      }
    }

    .animate-orbit-ring-1 {
      animation: orbitSpin1 12s linear infinite;
      transform-origin: 16px 16px;
    }

    .animate-orbit-ring-2 {
      animation: orbitSpin2 18s linear infinite;
      transform-origin: 16px 16px;
    }

    .animate-orbit-core {
      animation: coreGleam 3.5s ease-in-out infinite;
      transform-origin: 16px 16px;
    }
  `;

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`${className} select-none overflow-visible`}
      style={style}
    >
      <style>{css}</style>
      <defs>
        <radialGradient id="orbitStarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#818CF8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="prismOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Перша нахилена орбіта */}
      <g className="animate-orbit-ring-1">
        <ellipse
          cx="16"
          cy="16"
          rx="13"
          ry="6"
          fill="none"
          stroke="url(#prismOrbitGrad)"
          strokeWidth="1"
          strokeDasharray="4 2"
          transform="rotate(-28 16 16)"
        />
        <circle cx="27" cy="11" r="1.8" fill="#F59E0B" />
      </g>

      {/* Друга протилежно нахилена орбіта */}
      <g className="animate-orbit-ring-2">
        <ellipse
          cx="16"
          cy="16"
          rx="12"
          ry="5.5"
          fill="none"
          stroke="url(#prismOrbitGrad)"
          strokeWidth="0.9"
          strokeDasharray="3 3"
          transform="rotate(38 16 16)"
          opacity="0.8"
        />
        <circle cx="6" cy="19" r="1.5" fill="#38BDF8" />
      </g>

      {/* Центральна сяюча Зірка-Ядро (в стилі Зірки Медитації) */}
      <g className="animate-orbit-core">
        <circle cx="16" cy="16" r="3.5" fill="url(#orbitStarGlow)" />
        {/* 4-променева мікро-зірка ядра */}
        <polygon points="16,11 17.2,14.8 21,16 17.2,17.2 16,21 14.8,17.2 11,16 14.8,14.8" fill="#FFFFFF" />
      </g>
    </svg>
  );
};



