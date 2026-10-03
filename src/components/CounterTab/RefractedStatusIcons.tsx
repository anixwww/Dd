import React from 'react';

export interface RefractedStatusIconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * 1. ПОДАРУНОК / ШВИДКА ЦІЛЬ (Refracted Prism Gift Icon)
 * Стилістика заломленого крізь призму світла (як Зірка та Інь-Ян):
 * - Чіткі векторні лінії, алмазний бант, спектральні фасети
 * - Унікальна анімація: плавна левітація, спалахи алмазних іскор та перелив стрічки
 */
export const RefractedPrismGiftIcon: React.FC<RefractedStatusIconProps> = ({
  className = "w-5 h-5",
  size,
  style,
  onClick
}) => {
  const styleTag = `
    @keyframes refractGiftLevitate {
      0%, 100% {
        transform: translateY(0px) scale(0.97);
        filter: drop-shadow(0 0 2px rgba(255, 253, 208, 0.6)) drop-shadow(0 0 6px rgba(56, 189, 248, 0.35));
      }
      50% {
        transform: translateY(-1.5px) scale(1.04);
        filter: drop-shadow(0 0 4px rgba(254, 240, 138, 0.95)) drop-shadow(0 0 10px rgba(192, 132, 252, 0.6));
      }
    }

    @keyframes refractGiftBowSparkle {
      0%, 100% {
        transform: scale(0.9);
        opacity: 0.75;
      }
      50% {
        transform: scale(1.25);
        opacity: 1;
        filter: drop-shadow(0 0 4px #ffffff);
      }
    }

    @keyframes refractGiftRayShift {
      0% {
        stroke-dashoffset: 0;
        opacity: 0.35;
      }
      50% {
        opacity: 0.95;
      }
      100% {
        stroke-dashoffset: -16;
        opacity: 0.35;
      }
    }

    .animate-gift-float {
      animation: refractGiftLevitate 3.8s ease-in-out infinite;
      transform-origin: 12px 12px;
    }

    .animate-gift-bow-sparkle {
      animation: refractGiftBowSparkle 2.6s ease-in-out infinite;
      transform-origin: 12px 7.5px;
    }

    .animate-gift-ray-stream {
      animation: refractGiftRayShift 4s linear infinite;
      stroke-dasharray: 4 2;
    }
  `;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={`overflow-visible select-none inline-block align-middle transition-all duration-300 ${className}`}
      style={style}
      onClick={onClick}
      aria-label="Швидка ціль"
    >
      <style>{styleTag}</style>
      <defs>
        {/* Prismatic Gold Gradient: Diamond White -> Ivory Cream -> Golden Champagne -> Amber */}
        <linearGradient id="rStatGiftGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="25%" stopColor="#FFFDD0" stopOpacity="0.9" />
          <stop offset="65%" stopColor="#FEF08A" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.5" />
        </linearGradient>

        {/* Prismatic Cyan-Violet Gradient: Pure White -> Ice Sky -> Sky Cyan -> Electric Indigo */}
        <linearGradient id="rStatGiftCyan" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.85" />
          <stop offset="85%" stopColor="#818CF8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C084FC" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <g className="animate-gift-float">
        {/* Ambient diagonal refraction ray */}
        <line
          x1="2"
          y1="22"
          x2="22"
          y2="2"
          stroke="url(#rStatGiftCyan)"
          strokeWidth="0.7"
          strokeLinecap="round"
          className="animate-gift-ray-stream"
        />

        {/* Box Body (Crisp faceted glass) */}
        <path
          d="M 4.5 11 L 19.5 11 L 18 20.5 C 18 21.3 17.2 22 16.3 22 L 7.7 22 C 6.8 22 6 21.3 6 20.5 Z"
          fill="url(#rStatGiftGold)"
          fillOpacity="0.35"
          stroke="#FFFDD0"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Inner Refraction Facets */}
        <path
          d="M 6.5 14 L 17.5 14 M 7.5 17.5 L 16.5 17.5"
          stroke="#FFFFFF"
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Vertical Prismatic Ribbon */}
        <line
          x1="12"
          y1="11"
          x2="12"
          y2="22"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Box Lid (Beveled crystal cap) */}
        <rect
          x="3.5"
          y="7"
          width="17"
          height="4"
          rx="1"
          fill="url(#rStatGiftCyan)"
          fillOpacity="0.45"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <line
          x1="12"
          y1="7"
          x2="12"
          y2="11"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Diamond Bow Loops */}
        <path
          d="M 12 7 C 10 3.2 5.5 3.2 4.5 5 C 3.6 6.8 6.5 7.5 12 7 Z"
          fill="url(#rStatGiftGold)"
          fillOpacity="0.65"
          stroke="#FFFFFF"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path
          d="M 12 7 C 14 3.2 18.5 3.2 19.5 5 C 20.4 6.8 17.5 7.5 12 7 Z"
          fill="url(#rStatGiftCyan)"
          fillOpacity="0.65"
          stroke="#FFFFFF"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {/* Central Diamond Knot with Sparkle animation */}
        <g className="animate-gift-bow-sparkle">
          <polygon
            points="12,5.5 13.5,7 12,8.5 10.5,7"
            fill="#FFFFFF"
            stroke="#FFFDD0"
            strokeWidth="0.4"
          />
          <circle cx="12" cy="7" r="0.75" fill="#FEF08A" />
        </g>

        {/* Corner Micro Glints */}
        <circle cx="4.5" cy="7" r="0.8" fill="#FFFFFF" opacity="0.9" />
        <circle cx="19.5" cy="7" r="0.8" fill="#38BDF8" opacity="0.9" />
        <circle cx="7.7" cy="22" r="0.6" fill="#FFFDD0" opacity="0.8" />
        <circle cx="16.3" cy="22" r="0.6" fill="#FFFDD0" opacity="0.8" />
      </g>
    </svg>
  );
};

/**
 * 2. БЛИСКАВКА / ЦІЛЬ (Refracted Prism Lightning Icon)
 * Стилістика заломленого крізь призму світла (як Зірка та Інь-Ян):
 * - Чіткі кристалічні ребра, електричний спектральний розряд
 * - Унікальна анімація: високовольтний мікро-імпульс, каустичні спалахи в кутах зламу
 */
export const RefractedPrismLightningIcon: React.FC<RefractedStatusIconProps> = ({
  className = "w-5 h-5",
  size,
  style,
  onClick
}) => {
  const styleTag = `
    @keyframes refractZapDischarge {
      0%, 100% {
        transform: scale(0.96);
        filter: drop-shadow(0 0 2px rgba(255, 253, 208, 0.6)) drop-shadow(0 0 6px rgba(56, 189, 248, 0.4));
      }
      45% {
        transform: scale(1.02);
      }
      50% {
        transform: scale(1.12);
        filter: drop-shadow(0 0 5px #ffffff) drop-shadow(0 0 12px rgba(254, 240, 138, 0.95)) drop-shadow(0 0 16px rgba(56, 189, 248, 0.8));
      }
      55% {
        transform: scale(1.03);
      }
    }

    @keyframes refractZapArcStream {
      0% {
        stroke-dashoffset: 0;
        opacity: 0.3;
      }
      50% {
        opacity: 0.95;
      }
      100% {
        stroke-dashoffset: -20;
        opacity: 0.3;
      }
    }

    @keyframes refractZapCornerSpark {
      0%, 100% {
        opacity: 0.4;
        transform: scale(0.8);
      }
      50% {
        opacity: 1;
        transform: scale(1.35);
        filter: drop-shadow(0 0 4px #ffffff);
      }
    }

    .animate-zap-core {
      animation: refractZapDischarge 3.2s ease-in-out infinite;
      transform-origin: 12px 12px;
    }

    .animate-zap-arc {
      animation: refractZapArcStream 3.5s linear infinite;
      stroke-dasharray: 4 3;
    }

    .animate-zap-spark {
      animation: refractZapCornerSpark 1.8s ease-in-out infinite;
      transform-origin: center;
    }
  `;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={`overflow-visible select-none inline-block align-middle transition-all duration-300 ${className}`}
      style={style}
      onClick={onClick}
      aria-label="Ціль"
    >
      <style>{styleTag}</style>
      <defs>
        {/* Golden Refraction Gradient */}
        <linearGradient id="rStatZapGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="25%" stopColor="#FFFDD0" stopOpacity="0.95" />
          <stop offset="65%" stopColor="#FEF08A" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.5" />
        </linearGradient>

        {/* Violet-Cyan High Voltage Dispersion */}
        <linearGradient id="rStatZapViolet" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#C084FC" stopOpacity="0.85" />
          <stop offset="80%" stopColor="#38BDF8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <g className="animate-zap-core">
        {/* Diagonal high-energy orbital ray */}
        <path
          d="M 20 2 L 4 22"
          stroke="url(#rStatZapViolet)"
          strokeWidth="0.7"
          strokeLinecap="round"
          className="animate-zap-arc"
        />

        {/* Main Razor-Sharp Faceted Lightning Bolt */}
        <path
          d="M 13.5 1.5 L 4.5 12.5 L 11.5 12.5 L 9.5 22.5 L 19.5 10.5 L 12.5 10.5 L 14.5 1.5 Z"
          fill="url(#rStatZapGold)"
          fillOpacity="0.4"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Internal Laser Filament Core */}
        <path
          d="M 13 4 L 7.5 11.5 L 12 11.5 L 10.5 19 L 16.5 11.5 L 12 11.5 Z"
          fill="url(#rStatZapViolet)"
          fillOpacity="0.6"
          stroke="#FFFDD0"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* Diamond Sparklets on Lightning Vertices */}
        <circle cx="13.5" cy="1.5" r="1.1" fill="#FFFFFF" className="animate-zap-spark" />
        <circle cx="9.5" cy="22.5" r="1.2" fill="#FFFFFF" className="animate-zap-spark" />
        <circle cx="19.5" cy="10.5" r="1.0" fill="#38BDF8" />
        <circle cx="4.5" cy="12.5" r="0.9" fill="#FFFDD0" />
      </g>
    </svg>
  );
};

/**
 * 3. КРАПЛЯ / РЕГЕНЕРАЦІЯ СИСТЕМ (Refracted Prism Drop Icon)
 * Стилістика заломленого крізь призму світла (як Зірка та Інь-Ян):
 * - Кристалічна крапля води, оптичні хвильові каустики
 * - Унікальна анімація: дихання поверхневого натягу, пульсація світлових дуг та водяної алмазної роси
 */
export const RefractedPrismDropIcon: React.FC<RefractedStatusIconProps> = ({
  className = "w-5 h-5",
  size,
  style,
  onClick
}) => {
  const styleTag = `
    @keyframes refractDropBreath {
      0%, 100% {
        transform: scale(0.96) translateY(0px);
        filter: drop-shadow(0 0 2px rgba(255, 253, 208, 0.6)) drop-shadow(0 0 7px rgba(56, 189, 248, 0.45));
      }
      50% {
        transform: scale(1.06) translateY(-1px);
        filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 12px rgba(56, 189, 248, 0.75)) drop-shadow(0 0 16px rgba(129, 140, 248, 0.5));
      }
    }

    @keyframes refractDropWaveShift {
      0%, 100% {
        opacity: 0.5;
        transform: scale(0.92);
      }
      50% {
        opacity: 1;
        transform: scale(1.08);
      }
    }

    @keyframes refractDropOrbitRay {
      0% {
        stroke-dashoffset: 0;
        opacity: 0.3;
      }
      50% {
        opacity: 0.85;
      }
      100% {
        stroke-dashoffset: -24;
        opacity: 0.3;
      }
    }

    .animate-drop-core {
      animation: refractDropBreath 4s ease-in-out infinite;
      transform-origin: 12px 14px;
    }

    .animate-drop-wave {
      animation: refractDropWaveShift 3s ease-in-out infinite;
      transform-origin: 12px 14px;
    }

    .animate-drop-orbit {
      animation: refractDropOrbitRay 6s linear infinite;
      stroke-dasharray: 6 3 2 3;
    }
  `;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={`overflow-visible select-none inline-block align-middle transition-all duration-300 ${className}`}
      style={style}
      onClick={onClick}
      aria-label="Регенерація систем"
    >
      <style>{styleTag}</style>
      <defs>
        {/* Crystal Water Dispersion: Diamond -> Solar Cream -> Sky Cyan -> Electric Indigo */}
        <linearGradient id="rStatDropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="25%" stopColor="#FFFDD0" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      <g className="animate-drop-core">
        {/* Outer Spectral Orbit Ring */}
        <circle
          cx="12"
          cy="14"
          r="9"
          stroke="url(#rStatDropGrad)"
          strokeWidth="0.6"
          className="animate-drop-orbit"
        />

        {/* Razor-Sharp Crystalline Droplet Body */}
        <path
          d="M 12 2 C 12 2 4.5 11 4.5 15.5 C 4.5 19.5 7.8 22.5 12 22.5 C 16.2 22.5 19.5 19.5 19.5 15.5 C 19.5 11 12 2 12 2 Z"
          fill="url(#rStatDropGrad)"
          fillOpacity="0.38"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Internal Refracted Caustic Waves */}
        <g className="animate-drop-wave">
          <path
            d="M 8.5 12.5 C 8.5 10 11 8 12 6 C 13 8 15.5 10 15.5 12.5"
            stroke="#FFFFFF"
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          <path
            d="M 8 16.5 C 9.5 19 14.5 19 16 16.5"
            stroke="#FFFDD0"
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
        </g>

        {/* Incandescent Diamond Center & Tip Sparks */}
        <circle cx="12" cy="14.5" r="1.5" fill="#FFFFFF" />
        <circle cx="12" cy="14.5" r="0.75" fill="#38BDF8" />
        <circle cx="12" cy="2.5" r="0.9" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

/**
 * 4. ЩИТ / РУБЕЖІ ВООЗ (Refracted Prism Shield Icon)
 * Стилістика заломленого крізь призму світла (як Зірка та Інь-Ян):
 * - Кристалічний щит-егіда, сакральний хрест зцілення, спектральний обвід
 * - Унікальна анімація: обертання оптичних захисних променів, пульсація ядра зцілення
 */
export const RefractedPrismShieldIcon: React.FC<RefractedStatusIconProps> = ({
  className = "w-5 h-5",
  size,
  style,
  onClick
}) => {
  const styleTag = `
    @keyframes refractShieldPulse {
      0%, 100% {
        transform: scale(0.96);
        filter: drop-shadow(0 0 2px rgba(255, 253, 208, 0.6)) drop-shadow(0 0 7px rgba(56, 189, 248, 0.4));
      }
      50% {
        transform: scale(1.05);
        filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 12px rgba(134, 239, 172, 0.8)) drop-shadow(0 0 16px rgba(56, 189, 248, 0.6));
      }
    }

    @keyframes refractCrossShimmer {
      0%, 100% {
        opacity: 0.8;
        stroke-width: 1.3px;
      }
      50% {
        opacity: 1;
        stroke-width: 1.6px;
        filter: drop-shadow(0 0 3px #ffffff);
      }
    }

    @keyframes refractShieldOrbit {
      0% {
        stroke-dashoffset: 0;
        opacity: 0.35;
      }
      50% {
        opacity: 0.9;
      }
      100% {
        stroke-dashoffset: -28;
        opacity: 0.35;
      }
    }

    .animate-shield-core {
      animation: refractShieldPulse 4.2s ease-in-out infinite;
      transform-origin: 12px 12px;
    }

    .animate-shield-cross {
      animation: refractCrossShimmer 2.8s ease-in-out infinite;
    }

    .animate-shield-orbit {
      animation: refractShieldOrbit 7s linear infinite;
      stroke-dasharray: 8 4 3 4;
    }
  `;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={`overflow-visible select-none inline-block align-middle transition-all duration-300 ${className}`}
      style={style}
      onClick={onClick}
      aria-label="Рубежі ВООЗ"
    >
      <style>{styleTag}</style>
      <defs>
        {/* Emerald-Gold Healing Prism Gradient */}
        <linearGradient id="rStatShieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="25%" stopColor="#FFFDD0" stopOpacity="0.9" />
          <stop offset="65%" stopColor="#86EFAC" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.45" />
        </linearGradient>

        {/* Cyan-Azure Shield Trim Gradient */}
        <linearGradient id="rStatShieldCyan" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <g className="animate-shield-core">
        {/* Outer Spectral Orbit Shield Ring */}
        <circle
          cx="12"
          cy="12"
          r="10.5"
          stroke="url(#rStatShieldCyan)"
          strokeWidth="0.6"
          className="animate-shield-orbit"
        />

        {/* Razor-Sharp Crystalline Shield Body */}
        <path
          d="M 12 2 L 4 5.5 L 4 11.5 C 4 16.5 7.5 20.8 12 22 C 16.5 20.8 20 16.5 20 11.5 L 20 5.5 Z"
          fill="url(#rStatShieldGold)"
          fillOpacity="0.35"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Inner Refracted Cross of Life */}
        <path
          d="M 12 7.5 L 12 16.5 M 7.5 12 L 16.5 12"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinecap="round"
          className="animate-shield-cross"
        />

        {/* Diamond Sparklets at Cardinal Points */}
        <circle cx="12" cy="12" r="1.3" fill="#FFFFFF" />
        <circle cx="12" cy="2" r="0.9" fill="#FFFDD0" />
        <circle cx="4" cy="5.5" r="0.8" fill="#38BDF8" />
        <circle cx="20" cy="5.5" r="0.8" fill="#86EFAC" />
        <circle cx="12" cy="22" r="0.8" fill="#FFFDD0" />
      </g>
    </svg>
  );
};

/**
 * 5. ЩОДЕННІ СПРАВИ / КРОКИ (Refracted Prism Check Icon)
 */
export const RefractedPrismCheckIcon: React.FC<RefractedStatusIconProps> = ({
  className = "w-5 h-5",
  size,
  style,
  onClick
}) => {
  const styleTag = `
    @keyframes refractCheckPulse {
      0%, 100% {
        transform: scale(0.96);
        filter: drop-shadow(0 0 2px rgba(255, 253, 208, 0.6)) drop-shadow(0 0 6px rgba(56, 189, 248, 0.35));
      }
      50% {
        transform: scale(1.05);
        filter: drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 10px rgba(56, 189, 248, 0.7));
      }
    }

    .animate-check-core {
      animation: refractCheckPulse 3.6s ease-in-out infinite;
      transform-origin: 12px 12px;
    }
  `;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={`overflow-visible select-none inline-block align-middle transition-all duration-300 ${className}`}
      style={style}
      onClick={onClick}
      aria-label="Щоденні справи"
    >
      <style>{styleTag}</style>
      <defs>
        <linearGradient id="rStatCheckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="35%" stopColor="#FFFDD0" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <g className="animate-check-core">
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="4"
          fill="url(#rStatCheckGrad)"
          fillOpacity="0.35"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />
        <path
          d="M 7.5 12 L 10.5 15.5 L 16.5 8.5"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10.5" cy="15.5" r="1.1" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

/**
 * 6. ПСИХОЛОГІЧНИЙ СТАН (Refracted Prism Brain Icon)
 */
export const RefractedPrismBrainIcon: React.FC<RefractedStatusIconProps> = ({
  className = "w-5 h-5",
  size,
  style,
  onClick
}) => {
  const styleTag = `
    @keyframes refractBrainSynapse {
      0%, 100% {
        transform: scale(0.96);
        filter: drop-shadow(0 0 2px rgba(255, 253, 208, 0.6)) drop-shadow(0 0 6px rgba(192, 132, 252, 0.35));
      }
      50% {
        transform: scale(1.05);
        filter: drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 10px rgba(192, 132, 252, 0.75));
      }
    }

    .animate-brain-core {
      animation: refractBrainSynapse 3.8s ease-in-out infinite;
      transform-origin: 12px 12px;
    }
  `;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={`overflow-visible select-none inline-block align-middle transition-all duration-300 ${className}`}
      style={style}
      onClick={onClick}
      aria-label="Психологічний стан"
    >
      <style>{styleTag}</style>
      <defs>
        <linearGradient id="rStatBrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="35%" stopColor="#FFFDD0" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#C084FC" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <g className="animate-brain-core">
        <path
          d="M 9.5 4 C 7.5 4 6 5.5 6 7.5 C 4.5 8 3.5 9.5 3.5 11.5 C 3.5 13.5 5 15 6.5 15.5 C 6.5 17.5 8 19 10 19 C 10.5 19 11 18.8 11.5 18.5 L 11.5 5.5 C 11 5.2 10.5 4 9.5 4 Z"
          fill="url(#rStatBrainGrad)"
          fillOpacity="0.35"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />
        <path
          d="M 14.5 4 C 16.5 4 18 5.5 18 7.5 C 19.5 8 20.5 9.5 20.5 11.5 C 20.5 13.5 19 15 17.5 15.5 C 17.5 17.5 16 19 14 19 C 13.5 19 13 18.8 12.5 18.5 L 12.5 5.5 C 13 5.2 13.5 4 14.5 4 Z"
          fill="url(#rStatBrainGrad)"
          fillOpacity="0.35"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />
        <line x1="12" y1="5.5" x2="12" y2="18.5" stroke="#FFFFFF" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="1.1" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

/**
 * 7. ЩОДЕННИК ВДЯЧНОСТІ (Refracted Prism Book Icon)
 */
export const RefractedPrismBookIcon: React.FC<RefractedStatusIconProps> = ({
  className = "w-5 h-5",
  size,
  style,
  onClick
}) => {
  const styleTag = `
    @keyframes refractBookGleam {
      0%, 100% {
        transform: scale(0.96);
        filter: drop-shadow(0 0 2px rgba(255, 253, 208, 0.6)) drop-shadow(0 0 6px rgba(254, 240, 138, 0.35));
      }
      50% {
        transform: scale(1.05);
        filter: drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 10px rgba(254, 240, 138, 0.8));
      }
    }

    .animate-book-core {
      animation: refractBookGleam 3.8s ease-in-out infinite;
      transform-origin: 12px 12px;
    }
  `;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={`overflow-visible select-none inline-block align-middle transition-all duration-300 ${className}`}
      style={style}
      onClick={onClick}
      aria-label="Щоденник вдячності"
    >
      <style>{styleTag}</style>
      <defs>
        <linearGradient id="rStatBookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="35%" stopColor="#FFFDD0" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#FEF08A" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <g className="animate-book-core">
        <path
          d="M 4 19.5 C 4 18 5.5 17 7 17 L 20 17 L 20 4 L 7 4 C 5.5 4 4 5 4 6.5 Z"
          fill="url(#rStatBookGrad)"
          fillOpacity="0.35"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M 4 19.5 C 4 20.5 5 21 6.5 21 L 20 21"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line x1="7.5" y1="8" x2="16.5" y2="8" stroke="#FFFDD0" strokeWidth="1" strokeLinecap="round" />
        <line x1="7.5" y1="11.5" x2="14" y2="11.5" stroke="#FFFDD0" strokeWidth="1" strokeLinecap="round" />
        <circle cx="17" cy="11.5" r="1.1" fill="#FFFFFF" />
      </g>
    </svg>
  );
};
