import React from 'react';

export interface MonoIconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

const MonoDefs: React.FC = () => (
  <defs>
    {/* Crisp Light Monochrome Gradient with subtle iridescent pearl tints */}
    <linearGradient id="monoLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.96" />
      <stop offset="35%" stopColor="#E0F2FE" stopOpacity="0.88" />
      <stop offset="70%" stopColor="#E2E8F0" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#64748B" stopOpacity="0.5" />
    </linearGradient>

    {/* Beveled Dark Monochrome Gradient with gentle violet/titanium depth */}
    <linearGradient id="monoDarkGrad" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0.92" />
      <stop offset="45%" stopColor="#EDE9FE" stopOpacity="0.78" />
      <stop offset="100%" stopColor="#334155" stopOpacity="0.5" />
    </linearGradient>

    {/* Facet Accent Highlight with delicate emerald/mint reflection */}
    <linearGradient id="monoFacetGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#ECFDF5" stopOpacity="0.95" />
      <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.85" />
      <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.35" />
    </linearGradient>

    {/* Delicate Water/Sky Tint */}
    <linearGradient id="monoWaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#F0F9FF" stopOpacity="0.95" />
      <stop offset="50%" stopColor="#BAE6FD" stopOpacity="0.85" />
      <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.45" />
    </linearGradient>

    {/* Delicate Moon/Night Tint */}
    <linearGradient id="monoMoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#EEF2FF" stopOpacity="0.95" />
      <stop offset="50%" stopColor="#C7D2FE" stopOpacity="0.85" />
      <stop offset="100%" stopColor="#818CF8" stopOpacity="0.45" />
    </linearGradient>

    {/* Delicate Pulse/Craving Tint */}
    <linearGradient id="monoPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFF1F2" stopOpacity="0.95" />
      <stop offset="50%" stopColor="#FECDD3" stopOpacity="0.85" />
      <stop offset="100%" stopColor="#FB7185" stopOpacity="0.45" />
    </linearGradient>
  </defs>
);

/**
1. Гаманець (Заощаджено / Кошти)
*/
export const MonoRefractedWalletIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path
      d="M 3 6 C 3 4.8 4 4 5 4 L 18 4 C 19 4 20 4.8 20 6 L 20 8 C 20 8.5 19.5 9 19 9 L 5 9 C 3.8 9 3 8 3 7 Z"
      fill="url(#monoDarkGrad)"
      stroke="#E4E4E7"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M 3 8 L 19 8 C 20 8 21 8.8 21 10 L 21 18 C 21 19.2 20 20 19 20 L 5 20 C 3.8 20 3 19.2 3 18 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.45"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M 5 12 L 19 12 M 5 16 L 15 16"
      stroke="#E4E4E7"
      strokeWidth="0.7"
      strokeLinecap="round"
      opacity="0.6"
    />
    <path
      d="M 15 11 L 21 11 C 21.6 11 22 11.5 22 12.2 L 22 15.8 C 22 16.5 21.6 17 21 17 L 15 17 Z"
      fill="url(#monoDarkGrad)"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <circle cx="18" cy="14" r="1.2" fill="#FFFFFF" stroke="#A1A1AA" strokeWidth="0.6" />
  </svg>
);

/**
2. Три кристали, що зрослися в основі (Вільний час / Three Fused Crystals Cluster)
*/
export const MonoRefractedCrystalClusterIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    
    {/* Common Fused Matrix Base */}
    <polygon
      points="4,21 7,19 12,20 17,19 20,21 16,22 8,22"
      fill="url(#monoDarkGrad)"
      fillOpacity="0.75"
      stroke="#E4E4E7"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />

    {/* === LEFT CRYSTAL (Tilted Left) === */}
    {/* Left Crystal - Back/Shadow Facet */}
    <polygon
      points="5,8 2.5,12 4.5,20.5 7.5,19.5"
      fill="url(#monoDarkGrad)"
      fillOpacity="0.5"
      stroke="#A1A1AA"
      strokeWidth="0.9"
      strokeLinejoin="round"
    />
    {/* Left Crystal - Main Front Facet */}
    <polygon
      points="5,8 7.5,10.5 8,19 4.5,20.5"
      fill="url(#monoLightGrad)"
      fillOpacity="0.65"
      stroke="#FFFFFF"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    {/* Left Crystal - Top Cap Facet */}
    <polygon
      points="5,8 2.5,12 5.5,11.5 7.5,10.5"
      fill="url(#monoFacetGrad)"
      fillOpacity="0.85"
      stroke="#FFFFFF"
      strokeWidth="0.9"
      strokeLinejoin="round"
    />

    {/* === RIGHT CRYSTAL (Tilted Right) === */}
    {/* Right Crystal - Back/Shadow Facet */}
    <polygon
      points="19,10 21.5,13.5 19.5,20.5 16.5,19.5"
      fill="url(#monoDarkGrad)"
      fillOpacity="0.5"
      stroke="#A1A1AA"
      strokeWidth="0.9"
      strokeLinejoin="round"
    />
    {/* Right Crystal - Main Front Facet */}
    <polygon
      points="19,10 16.5,12 16,19 19.5,20.5"
      fill="url(#monoLightGrad)"
      fillOpacity="0.6"
      stroke="#FFFFFF"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    {/* Right Crystal - Top Cap Facet */}
    <polygon
      points="19,10 21.5,13.5 18.5,13 16.5,12"
      fill="url(#monoFacetGrad)"
      fillOpacity="0.8"
      stroke="#FFFFFF"
      strokeWidth="0.9"
      strokeLinejoin="round"
    />

    {/* === CENTRAL MAIN CRYSTAL (Tallest, Vertical Pillar) === */}
    {/* Center Crystal - Left Side Facet */}
    <polygon
      points="12,2.5 9,6.5 9.5,20 12,21.5"
      fill="url(#monoDarkGrad)"
      fillOpacity="0.6"
      stroke="#E4E4E7"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    {/* Center Crystal - Right Side Facet */}
    <polygon
      points="12,2.5 15,6.5 14.5,20 12,21.5"
      fill="url(#monoLightGrad)"
      fillOpacity="0.75"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Center Crystal - Front Diamond Ridge / Top Diamond Point */}
    <polygon
      points="12,2.5 9,6.5 12,8.5 15,6.5"
      fill="url(#monoFacetGrad)"
      fillOpacity="0.9"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />

    {/* Front Highlight Spine & Base Fusion Ridges */}
    <line x1="12" y1="8.5" x2="12" y2="21.5" stroke="#FFFFFF" strokeWidth="1" opacity="0.9" />
    <line x1="5" y1="8" x2="5.5" y2="11.5" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
    <line x1="5.5" y1="11.5" x2="4.5" y2="20.5" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.8" />
    <line x1="19" y1="10" x2="18.5" y2="13" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
    <line x1="18.5" y1="13" x2="19.5" y2="20.5" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.8" />
    
    {/* Interlocking Base Fusion Seams */}
    <line x1="7.5" y1="19.5" x2="9.5" y2="20" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.7" />
    <line x1="14.5" y1="20" x2="16.5" y2="19.5" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.7" />
    
    {/* Little Light Sparkle Glint at the apex of the central crystal */}
    <circle cx="12" cy="2.5" r="0.8" fill="#FFFFFF" />
  </svg>
);

export const MonoRefractedOrigamiIcon = MonoRefractedCrystalClusterIcon;
export const MonoRefractedBirdIcon = MonoRefractedCrystalClusterIcon;

/**
3. Сигарета (Не викурено)
*/
export const MonoRefractedCigaretteIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Filter */}
    <rect
      x="2"
      y="10"
      width="5"
      height="6"
      rx="1"
      fill="url(#monoDarkGrad)"
      stroke="#E4E4E7"
      strokeWidth="1.2"
    />
    {/* Body */}
    <rect
      x="7"
      y="10"
      width="13"
      height="6"
      rx="0.5"
      fill="url(#monoLightGrad)"
      fillOpacity="0.45"
      stroke="#FFFFFF"
      strokeWidth="1.3"
    />
    {/* Facet lines */}
    <line x1="7" y1="13" x2="20" y2="13" stroke="#E4E4E7" strokeWidth="0.7" opacity="0.6" />
    <line x1="13" y1="10" x2="13" y2="16" stroke="#E4E4E7" strokeWidth="0.7" opacity="0.6" />
    {/* Ember tip (extinguished crystal) */}
    <path
      d="M 20 10 L 22 13 L 20 16 Z"
      fill="#FFFFFF"
      fillOpacity="0.8"
      stroke="#E4E4E7"
      strokeWidth="1"
    />
  </svg>
);

/**
4. Дерево (Збережені дерева)
*/
export const MonoRefractedTreeIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Faceted Pine Crown */}
    <path
      d="M 12 2 L 18 9 L 15 9 L 20 16 L 14 16 L 14 21 L 10 21 L 10 16 L 4 16 L 9 9 L 6 9 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.45"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    {/* Inner facets */}
    <path
      d="M 12 2 L 12 16 M 9 9 L 15 9 M 6 16 L 18 16"
      stroke="#E4E4E7"
      strokeWidth="0.8"
      strokeLinecap="round"
      opacity="0.7"
    />
  </svg>
);

/**
5. Монети (Кошти / Баланс)
*/
export const MonoRefractedCoinsIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Back coin */}
    <ellipse cx="15" cy="9" rx="6" ry="3.5" fill="url(#monoDarkGrad)" stroke="#A1A1AA" strokeWidth="1.1" />
    <path d="M 9 9 L 9 12 C 9 13.9 11.7 15.5 15 15.5 C 18.3 15.5 21 13.9 21 12 L 21 9" stroke="#A1A1AA" strokeWidth="1.1" fill="none" />
    
    {/* Front coin */}
    <ellipse cx="9" cy="14" rx="6" ry="3.5" fill="url(#monoLightGrad)" fillOpacity="0.5" stroke="#FFFFFF" strokeWidth="1.3" />
    <path d="M 3 14 L 3 17 C 3 18.9 5.7 20.5 9 20.5 C 12.3 20.5 15 18.9 15 17 L 15 14" stroke="#FFFFFF" strokeWidth="1.3" fill="none" />
    <ellipse cx="9" cy="14" rx="3" ry="1.7" stroke="#E4E4E7" strokeWidth="0.7" opacity="0.8" />
  </svg>
);

/**
6. Торбинка / Пакет (Витрачено на цілі)
*/
export const MonoRefractedBagIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path
      d="M 5 8 L 19 8 L 18 20 C 18 20.8 17.2 21.5 16.4 21.5 L 7.6 21.5 C 6.8 21.5 6 20.8 6 20 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.45"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M 9 8 C 9 5.2 10.3 3 12 3 C 13.7 3 15 5.2 15 8"
      stroke="#E4E4E7"
      strokeWidth="1.3"
      strokeLinecap="round"
      fill="none"
    />
    <line x1="5" y1="13" x2="19" y2="13" stroke="#E4E4E7" strokeWidth="0.7" opacity="0.6" />
    <line x1="12" y1="8" x2="12" y2="21.5" stroke="#E4E4E7" strokeWidth="0.7" opacity="0.6" />
  </svg>
);

/**
7. Нагорода / Медаль (Серії чистоти)
*/
export const MonoRefractedAwardIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Ribbons */}
    <path d="M 8.5 14 L 6 21 L 10.5 19 L 12 21 M 15.5 14 L 18 21 L 13.5 19" stroke="#E4E4E7" strokeWidth="1.2" strokeLinejoin="round" fill="url(#monoDarkGrad)" />
    {/* Medal */}
    <circle cx="12" cy="9" r="6" fill="url(#monoLightGrad)" fillOpacity="0.5" stroke="#FFFFFF" strokeWidth="1.3" />
    <polygon points="12,5.5 13.2,7.8 15.7,8.2 13.9,10 14.3,12.5 12,11.3 9.7,12.5 10.1,10 8.3,8.2 10.8,7.8" fill="#FFFFFF" fillOpacity="0.9" />
  </svg>
);

/**
8. Календар (Дата початку)
*/
export const MonoRefractedCalendarIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <rect x="3" y="5" width="18" height="16" rx="2" fill="url(#monoLightGrad)" fillOpacity="0.4" stroke="#FFFFFF" strokeWidth="1.3" />
    <path d="M 3 9.5 L 21 9.5" stroke="#FFFFFF" strokeWidth="1.2" />
    <line x1="7" y1="3" x2="7" y2="6" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="17" y1="3" x2="17" y2="6" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
    <rect x="7" y="12" width="2.5" height="2.5" rx="0.5" fill="#FFFFFF" />
    <rect x="11.5" y="12" width="2.5" height="2.5" rx="0.5" fill="#FFFFFF" opacity="0.7" />
    <rect x="16" y="12" width="2.5" height="2.5" rx="0.5" fill="#FFFFFF" opacity="0.7" />
    <rect x="7" y="16" width="2.5" height="2.5" rx="0.5" fill="#FFFFFF" opacity="0.7" />
    <rect x="11.5" y="16" width="2.5" height="2.5" rx="0.5" fill="#FFFFFF" opacity="0.7" />
  </svg>
);

/**
9. Оновлення / Зрив (Refresh / Relapse)
*/
export const MonoRefractedRefreshIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path
      d="M 21 12 C 21 16.9 16.9 21 12 21 C 7.8 21 4.3 18.1 3.3 14 M 3 12 C 3 7.1 7.1 3 12 3 C 16.2 3 19.7 5.9 20.7 9.8"
      stroke="#FFFFFF"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <polygon points="21,7 21,12 16,12" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="1.2" />
    <polygon points="3,17 3,12 8,12" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="1.2" />
  </svg>
);

/**
10. Прогноз / Графік (Trending Up)
*/
export const MonoRefractedTrendingUpIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path d="M 3 17 L 9 11 L 13 15 L 21 7" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <polygon points="21,12 21,7 16,7" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1" />
    <polygon points="3,17 9,11 13,15 21,7 21,21 3,21" fill="url(#monoLightGrad)" fillOpacity="0.25" />
  </svg>
);

/**
11. Захист / Щит (Shield Check)
*/
export const MonoRefractedShieldIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path
      d="M 12 3 L 19 6 C 19 13 16 18 12 21 C 8 18 5 13 5 6 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.45"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M 9 11.5 L 11 13.5 L 15.5 9.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
12. Смоли / Полум'я (Flame)
*/
export const MonoRefractedFlameIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path
      d="M 12 3 C 12 3 16 7 16 11 C 16 13.5 14.5 16 12 16 C 9.5 16 8 13.5 8 11 C 8 7 12 3 12 3 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.5"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M 12 8 C 12 8 14 10.5 14 12.5 C 14 13.5 13 14.5 12 14.5 C 11 14.5 10 13.5 10 12.5 C 10 10.5 12 8 12 8 Z"
      fill="url(#monoDarkGrad)"
      stroke="#FFFFFF"
      strokeWidth="1"
    />
  </svg>
);

/**
13. Крапля / CO Газ (Droplet)
*/
export const MonoRefractedDropIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path
      d="M 12 3 C 12 3 18 10 18 15 C 18 18.3 15.3 21 12 21 C 8.7 21 6 18.3 6 15 C 6 10 12 3 12 3 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.45"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M 12 3 L 12 21 M 6 15 L 18 15" stroke="#E4E4E7" strokeWidth="0.7" opacity="0.6" />
  </svg>
);

/**
14. Серце / Пульс (Heart)
*/
export const MonoRefractedHeartIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path
      d="M 12 21.35 L 10.55 20.03 C 5.4 15.36 2 12.28 2 8.5 C 2 5.42 4.42 3 7.5 3 C 9.24 3 10.91 3.81 12 5.09 C 13.09 3.81 14.76 3 16.5 3 C 19.58 3 22 5.42 22 8.5 C 22 12.28 18.6 15.36 13.45 20.04 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.45"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M 6 11 L 10 11 L 11.5 8 L 13.5 14 L 15 11 L 18 11" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
15. Блискавка / Нікотин (Zap - Monochrome Refracted)
*/
export const MonoRefractedZapIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <polygon
      points="13,2 4,14 11,14 10,22 20,9 13,9"
      fill="url(#monoLightGrad)"
      fillOpacity="0.5"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <line x1="13" y1="2" x2="10" y2="22" stroke="#E4E4E7" strokeWidth="0.7" opacity="0.6" />
  </svg>
);

/**
16. Подарунок (Gift - Monochrome Refracted)
*/
export const MonoRefractedGiftIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Box Body */}
    <path
      d="M 4.5 11 L 19.5 11 L 18 20.5 C 18 21.3 17.2 22 16.3 22 L 7.7 22 C 6.8 22 6 21.3 6 20.5 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.45"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <line x1="12" y1="11" x2="12" y2="22" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
    {/* Lid */}
    <rect x="3.5" y="7" width="17" height="4" rx="1" fill="url(#monoDarkGrad)" stroke="#FFFFFF" strokeWidth="1.2" strokeLinejoin="round" />
    <line x1="12" y1="7" x2="12" y2="11" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
    {/* Bow */}
    <path d="M 12 7 C 10 3.2 5.5 3.2 4.5 5 C 3.6 6.8 6.5 7.5 12 7 Z" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="1" />
    <path d="M 12 7 C 14 3.2 18.5 3.2 19.5 5 C 20.4 6.8 17.5 7.5 12 7 Z" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="1" />
  </svg>
);

/**
17. Слайдери / Ціни (Sliders)
*/
export const MonoRefractedSlidersIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <line x1="4" y1="21" x2="4" y2="14" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="4" y1="10" x2="4" y2="3" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
    <rect x="2" y="10" width="4" height="4" rx="1" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="1.2" />

    <line x1="12" y1="21" x2="12" y2="12" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="12" y1="8" x2="12" y2="3" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
    <rect x="10" y="8" width="4" height="4" rx="1" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="1.2" />

    <line x1="20" y1="21" x2="20" y2="16" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="20" y1="12" x2="20" y2="3" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
    <rect x="18" y="12" width="4" height="4" rx="1" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="1.2" />
  </svg>
);

/**
18. Кава (Coffee)
*/
export const MonoRefractedCoffeeIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path d="M 18 8 h 1 a 4 4 0 0 1 0 8 h -1" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M 2 8 h 16 v 9 a 4 4 0 0 1 -4 4 H 6 a 4 4 0 0 1 -4 -4 Z" fill="url(#monoLightGrad)" fillOpacity="0.45" stroke="#FFFFFF" strokeWidth="1.3" />
    <line x1="6" y1="1" x2="6" y2="4" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="10" y1="1" x2="10" y2="4" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="14" y1="1" x2="14" y2="4" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/**
19. Книги (Book)
*/
export const MonoRefractedBookIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path
      d="M 2 3 h 6 a 4 4 0 0 1 4 4 v 14 a 3 3 0 0 0 -3 -3 H 2 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.45"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M 22 3 h -6 a 4 4 0 0 0 -4 4 v 14 a 3 3 0 0 1 3 -3 h 7 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.45"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

/**
20. Кіно (Film)
*/
export const MonoRefractedFilmIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <rect x="2" y="4" width="20" height="16" rx="2" fill="url(#monoLightGrad)" fillOpacity="0.4" stroke="#FFFFFF" strokeWidth="1.3" />
    <line x1="2" y1="8" x2="22" y2="8" stroke="#FFFFFF" strokeWidth="1" />
    <line x1="2" y1="16" x2="22" y2="16" stroke="#FFFFFF" strokeWidth="1" />
    <line x1="7" y1="4" x2="7" y2="8" stroke="#FFFFFF" strokeWidth="1" />
    <line x1="12" y1="4" x2="12" y2="8" stroke="#FFFFFF" strokeWidth="1" />
    <line x1="17" y1="4" x2="17" y2="8" stroke="#FFFFFF" strokeWidth="1" />
    <line x1="7" y1="16" x2="7" y2="20" stroke="#FFFFFF" strokeWidth="1" />
    <line x1="12" y1="16" x2="12" y2="20" stroke="#FFFFFF" strokeWidth="1" />
    <line x1="17" y1="16" x2="17" y2="20" stroke="#FFFFFF" strokeWidth="1" />
  </svg>
);

/**
21. Піца (Pizza)
*/
export const MonoRefractedPizzaIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path
      d="M 12 2 L 2 21 C 7 23 17 23 22 21 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.45"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="11" r="1.5" fill="#FFFFFF" />
    <circle cx="9" cy="16" r="1.5" fill="#FFFFFF" />
    <circle cx="15" cy="17" r="1.5" fill="#FFFFFF" />
  </svg>
);

/**
 * 22. Пресети та Конфігурації (Presets / Config Slots)
 */
export const MonoRefractedPresetsIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path
      d="M 4 16 L 12 20 L 20 16"
      stroke="#A1A1AA"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 4 12 L 12 16 L 20 12"
      stroke="#E4E4E7"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polygon
      points="12,4 20,8 12,12 4,8"
      fill="url(#monoLightGrad)"
      fillOpacity="0.5"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="8" r="1.5" fill="#FFFFFF" />
  </svg>
);

/**
 * 23. Теми оформлення (Palette / Themes)
 */
export const MonoRefractedPaletteIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path
      d="M 12 3 C 6.5 3 2 7.5 2 13 C 2 17.5 5.5 21 10 21 C 11.5 21 12 20 12 19 C 12 18.2 12.5 17.5 13.5 17.5 L 15 17.5 C 18.5 17.5 22 14.5 22 11 C 22 6.5 17.5 3 12 3 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.4"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <circle cx="7.5" cy="9.5" r="1.5" fill="#FFFFFF" />
    <circle cx="12" cy="7.5" r="1.5" fill="#E4E4E7" />
    <circle cx="16.5" cy="9.5" r="1.5" fill="#FFFFFF" />
    <circle cx="8.5" cy="14.5" r="1.5" fill="#A1A1AA" />
  </svg>
);

/**
 * 24. Оболонки таймера (Timer / Clock Skin)
 */
export const MonoRefractedTimerIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path d="M 10 2 L 14 2 M 12 2 L 12 5" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
    <circle
      cx="12"
      cy="14"
      r="8.5"
      fill="url(#monoLightGrad)"
      fillOpacity="0.35"
      stroke="#FFFFFF"
      strokeWidth="1.3"
    />
    <circle cx="12" cy="14" r="5.5" stroke="#E4E4E7" strokeWidth="0.8" fill="none" opacity="0.6" />
    <path d="M 12 14 L 12 8.5 M 12 14 L 15 14" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="12" cy="14" r="1" fill="#FFFFFF" />
  </svg>
);

/**
 * 25. Загальний акцент / Відтінок (Accent Hue / Color Drop)
 */
export const MonoRefractedAccentIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path
      d="M 12 3 C 12 3 5 11 5 15.5 C 5 19.5 8.1 22 12 22 C 15.9 22 19 19.5 19 15.5 C 19 11 12 3 12 3 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.4"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M 9.5 12.5 C 9.5 10 11.5 8.5 12 7 C 12.5 8.5 14.5 10 14.5 12.5"
      stroke="#E4E4E7"
      strokeWidth="0.8"
      strokeLinecap="round"
      fill="none"
      opacity="0.8"
    />
    <circle cx="12" cy="15" r="1.8" fill="#FFFFFF" />
  </svg>
);

/**
 * 26. Налаштування вікон / Режим рамок (Window Frames)
 */
export const MonoRefractedWindowIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="3"
      fill="url(#monoLightGrad)"
      fillOpacity="0.35"
      stroke="#FFFFFF"
      strokeWidth="1.3"
    />
    <line x1="3" y1="9" x2="21" y2="9" stroke="#E4E4E7" strokeWidth="1" />
    <circle cx="6.5" cy="6.5" r="0.8" fill="#FFFFFF" />
    <circle cx="9.5" cy="6.5" r="0.8" fill="#FFFFFF" />
    <circle cx="12.5" cy="6.5" r="0.8" fill="#FFFFFF" />
  </svg>
);

/**
 * 27. Символ ВООЗ (WHO - Rod of Asclepius with coiled serpent & globe meridians)
 */
export const MonoRefractedWhoIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Background subtle globe laurels */}
    <circle cx="12" cy="12" r="9.5" stroke="#71717A" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />
    <ellipse cx="12" cy="12" rx="4.5" ry="9.5" stroke="#71717A" strokeWidth="0.7" opacity="0.3" />
    <line x1="2.5" y1="12" x2="21.5" y2="12" stroke="#71717A" strokeWidth="0.7" opacity="0.3" />

    {/* Central Asclepius Staff / Rod */}
    <path
      d="M 11.2 3.5 L 12.8 3.5 L 12.5 21.5 L 11.5 21.5 Z"
      fill="url(#monoDarkGrad)"
      stroke="#E4E4E7"
      strokeWidth="0.9"
    />
    <circle cx="12" cy="3" r="1.6" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="1" />

    {/* Entwined Sacred Serpent */}
    <path
      d="M 12 4.8 C 13.6 4.8 15 6 15 7.4 C 15 9.2 12.5 10 10.5 10.8 C 8.5 11.6 8 13 8 14.2 C 8 16 11.5 16.5 13.5 17.2 C 15.5 17.9 16 19.2 16 20.2 C 16 21.4 14.5 22 13 22"
      fill="none"
      stroke="url(#monoLightGrad)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 12 4.8 C 13.6 4.8 15 6 15 7.4 C 15 9.2 12.5 10 10.5 10.8 C 8.5 11.6 8 13 8 14.2 C 8 16 11.5 16.5 13.5 17.2 C 15.5 17.9 16 19.2 16 20.2 C 16 21.4 14.5 22 13 22"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Serpent Head facing the staff */}
    <circle cx="11.8" cy="4.8" r="1.1" fill="#FFFFFF" />
  </svg>
);

/**
 * 28. Наукові тести (Tests / Diagnostic Checklist)
 */
export const MonoRefractedTestsIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Clipboard Base */}
    <rect
      x="4"
      y="4.5"
      width="16"
      height="17"
      rx="2.5"
      fill="url(#monoDarkGrad)"
      stroke="#E4E4E7"
      strokeWidth="1.2"
    />
    {/* Top Clip */}
    <path
      d="M 8.5 4.5 C 8.5 3.4 9.4 2.5 10.5 2.5 L 13.5 2.5 C 14.6 2.5 15.5 3.4 15.5 4.5 L 15.5 6 L 8.5 6 Z"
      fill="url(#monoLightGrad)"
      stroke="#FFFFFF"
      strokeWidth="1"
    />
    {/* Checkmark 1 */}
    <path
      d="M 7.5 10 L 9.5 12 L 13 8"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Line 1 */}
    <line x1="14.5" y1="10" x2="16.5" y2="10" stroke="#A1A1AA" strokeWidth="1.2" strokeLinecap="round" />
    {/* Checkmark 2 */}
    <path
      d="M 7.5 15.5 L 9.5 17.5 L 13 13.5"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Line 2 */}
    <line x1="14.5" y1="15.5" x2="16.5" y2="15.5" stroke="#A1A1AA" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/**
 * 29. Мої нотатки — простий олівець (Simple Pencil)
 */
export const MonoRefractedPencilIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Pencil Hexagonal Body */}
    <path
      d="M 6.5 17.5 L 17 7 L 19 9 L 8.5 19.5 Z"
      fill="url(#monoLightGrad)"
      stroke="#E4E4E7"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Center facet line along pencil */}
    <line x1="7.5" y1="18.5" x2="18" y2="8" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
    {/* Top Eraser / Ferrule */}
    <path
      d="M 17 7 L 18.5 5.5 C 19.3 4.7 20.6 4.7 21.4 5.5 C 22.2 6.3 22.2 7.6 21.4 8.4 L 19 9 Z"
      fill="url(#monoDarkGrad)"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Bottom Wooden Tip */}
    <path
      d="M 6.5 17.5 L 3 21 L 8.5 19.5 Z"
      fill="url(#monoFacetGrad)"
      stroke="#E4E4E7"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    {/* Graphite Tip Point */}
    <path
      d="M 4.5 19.5 L 3 21 L 5.5 20.2 Z"
      fill="#27272A"
      stroke="#52525B"
      strokeWidth="0.6"
    />
  </svg>
);

/**
 * 30. Оптимізація — ракета (Rocket)
 */
export const MonoRefractedRocketIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Rocket Fuselage */}
    <path
      d="M 14.5 2.5 C 17.5 3.5 20.5 6.5 21.5 9.5 C 20 14 16.5 16.5 13 17 L 7 11 C 7.5 7.5 10 4 14.5 2.5 Z"
      fill="url(#monoLightGrad)"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    {/* Porthole */}
    <circle cx="14.5" cy="9.5" r="2.2" fill="url(#monoDarkGrad)" stroke="#FFFFFF" strokeWidth="1" />
    <circle cx="14.5" cy="9.5" r="1" fill="#FFFFFF" opacity="0.8" />
    {/* Left Fin */}
    <path
      d="M 7 11 L 3.5 10.5 C 3 10.5 2.7 11.2 3.1 11.6 L 6 14.5 Z"
      fill="url(#monoDarkGrad)"
      stroke="#E4E4E7"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    {/* Bottom Fin */}
    <path
      d="M 13 17 L 13.5 20.5 C 13.5 21 12.8 21.3 12.4 20.9 L 9.5 18 Z"
      fill="url(#monoDarkGrad)"
      stroke="#E4E4E7"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    {/* Jet Thruster Flame */}
    <path
      d="M 9.5 14.5 L 6.5 17.5 C 6 18 5 18 4.5 17.5 C 4 17 4 16 4.5 15.5 L 7.5 12.5 Z"
      fill="url(#monoFacetGrad)"
      stroke="#FFFFFF"
      strokeWidth="0.9"
    />
  </svg>
);

/**
 * 31. Очищення кешу — корзина (Trash / Bin)
 */
export const MonoRefractedTrashIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Top Lid Handle */}
    <path
      d="M 9.5 3 C 9.5 2.4 10 2 10.6 2 L 13.4 2 C 14 2 14.5 2.4 14.5 3 L 14.5 4.5 L 9.5 4.5 Z"
      fill="url(#monoLightGrad)"
      stroke="#FFFFFF"
      strokeWidth="1"
    />
    {/* Lid Rim */}
    <path
      d="M 4 5 L 20 5"
      stroke="#FFFFFF"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    {/* Bin Bucket */}
    <path
      d="M 5.8 6 L 7.2 19.5 C 7.3 20.4 8.1 21.2 9 21.2 L 15 21.2 C 15.9 21.2 16.7 20.4 16.8 19.5 L 18.2 6 Z"
      fill="url(#monoDarkGrad)"
      stroke="#E4E4E7"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Vertical Grooves */}
    <line x1="10" y1="9" x2="10" y2="17" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
    <line x1="14" y1="9" x2="14" y2="17" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
  </svg>
);

/**
 * 32. Підтримка розробника — єдине кольорове червоне серце (Colored Red Heart)
 */
export const ColoredHeartIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <defs>
      <linearGradient id="redHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF4D6D" />
        <stop offset="35%" stopColor="#EF4444" />
        <stop offset="70%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <linearGradient id="redHeartGloss" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <filter id="heartShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#DC2626" floodOpacity="0.45" />
      </filter>
    </defs>
    {/* Base Heart */}
    <path
      d="M 12 21.35 C 11.65 21.35 11.3 21.2 11.05 20.95 C 5.5 15.65 2 12.3 2 8.5 C 2 5.4 4.4 3 7.5 3 C 9.3 3 10.9 3.8 12 5.1 C 13.1 3.8 14.7 3 16.5 3 C 19.6 3 22 5.4 22 8.5 C 22 12.3 18.5 15.65 12.95 20.95 C 12.7 21.2 12.35 21.35 12 21.35 Z"
      fill="url(#redHeartGrad)"
      stroke="#FF758F"
      strokeWidth="0.8"
      filter="url(#heartShadow)"
    />
    {/* Specular Glossy Reflection on top left */}
    <path
      d="M 7.5 4.5 C 5.8 4.5 4.5 5.7 4.2 7.3 C 4.8 6.5 6 5.8 7.5 5.8 C 8.8 5.8 10 6.5 10.8 7.4 C 10.2 5.7 9 4.5 7.5 4.5 Z"
      fill="url(#redHeartGloss)"
    />
    <circle cx="6.5" cy="7.5" r="0.8" fill="#FFFFFF" opacity="0.9" />
  </svg>
);

/**
 * 33. Фільтр вигляду: Великі плитки (Large Tiles)
 */
export const MonoRefractedLayoutLargeIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <rect
      x="3"
      y="3"
      width="8"
      height="8"
      rx="2"
      fill="url(#monoLightGrad)"
      stroke="#FFFFFF"
      strokeWidth="1.2"
    />
    <rect
      x="13"
      y="3"
      width="8"
      height="8"
      rx="2"
      fill="url(#monoDarkGrad)"
      stroke="#E4E4E7"
      strokeWidth="1.2"
    />
    <rect
      x="3"
      y="13"
      width="8"
      height="8"
      rx="2"
      fill="url(#monoDarkGrad)"
      stroke="#E4E4E7"
      strokeWidth="1.2"
    />
    <rect
      x="13"
      y="13"
      width="8"
      height="8"
      rx="2"
      fill="url(#monoLightGrad)"
      stroke="#FFFFFF"
      strokeWidth="1.2"
    />
  </svg>
);

/**
 * 34. Фільтр вигляду: Середні плитки (Medium Tiles)
 */
export const MonoRefractedLayoutMediumIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Top Row: 3 cards */}
    <rect x="2.5" y="3.5" width="5.5" height="7.5" rx="1.5" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="1" />
    <rect x="9.25" y="3.5" width="5.5" height="7.5" rx="1.5" fill="url(#monoDarkGrad)" stroke="#E4E4E7" strokeWidth="1" />
    <rect x="16" y="3.5" width="5.5" height="7.5" rx="1.5" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="1" />

    {/* Bottom Row: 3 cards */}
    <rect x="2.5" y="13" width="5.5" height="7.5" rx="1.5" fill="url(#monoDarkGrad)" stroke="#E4E4E7" strokeWidth="1" />
    <rect x="9.25" y="13" width="5.5" height="7.5" rx="1.5" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="1" />
    <rect x="16" y="13" width="5.5" height="7.5" rx="1.5" fill="url(#monoDarkGrad)" stroke="#E4E4E7" strokeWidth="1" />
  </svg>
);

/**
 * 35. Фільтр вигляду: Малі плитки (Small Tiles - 3x3)
 */
export const MonoRefractedLayoutSmallIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <rect x="2.5" y="2.5" width="5" height="5" rx="1" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="0.9" />
    <rect x="9.5" y="2.5" width="5" height="5" rx="1" fill="url(#monoDarkGrad)" stroke="#E4E4E7" strokeWidth="0.9" />
    <rect x="16.5" y="2.5" width="5" height="5" rx="1" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="0.9" />

    <rect x="2.5" y="9.5" width="5" height="5" rx="1" fill="url(#monoDarkGrad)" stroke="#E4E4E7" strokeWidth="0.9" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="0.9" />
    <rect x="16.5" y="9.5" width="5" height="5" rx="1" fill="url(#monoDarkGrad)" stroke="#E4E4E7" strokeWidth="0.9" />

    <rect x="2.5" y="16.5" width="5" height="5" rx="1" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="0.9" />
    <rect x="9.5" y="16.5" width="5" height="5" rx="1" fill="url(#monoDarkGrad)" stroke="#E4E4E7" strokeWidth="0.9" />
    <rect x="16.5" y="16.5" width="5" height="5" rx="1" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="0.9" />
  </svg>
);

/**
 * 36. Фільтр вигляду: Піктограми (Clean Pictograms / Faceted Prism Star)
 */
export const MonoRefractedLayoutPictogramsIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Central 4-point faceted diamond star */}
    <path
      d="M 12 2.5 L 14.5 9.5 L 21.5 12 L 14.5 14.5 L 12 21.5 L 9.5 14.5 L 2.5 12 L 9.5 9.5 Z"
      fill="url(#monoLightGrad)"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Inner prismatic facet division */}
    <path
      d="M 12 2.5 L 12 21.5"
      stroke="#FFFFFF"
      strokeWidth="0.8"
      opacity="0.8"
    />
    <path
      d="M 2.5 12 L 21.5 12"
      stroke="#FFFFFF"
      strokeWidth="0.8"
      opacity="0.8"
    />
    {/* Corner Sparkles */}
    <circle cx="18" cy="5" r="1.2" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="0.6" />
    <circle cx="5" cy="18" r="0.9" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="0.5" />
  </svg>
);

/**
 * 37. Фільтр вигляду: Список (List View)
 */
export const MonoRefractedLayoutListIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Row 1 */}
    <rect x="3" y="4" width="4" height="4" rx="1.2" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="1" />
    <rect x="9.5" y="4.5" width="11.5" height="3" rx="1" fill="url(#monoDarkGrad)" stroke="#E4E4E7" strokeWidth="0.9" />

    {/* Row 2 */}
    <rect x="3" y="10" width="4" height="4" rx="1.2" fill="url(#monoDarkGrad)" stroke="#E4E4E7" strokeWidth="1" />
    <rect x="9.5" y="10.5" width="11.5" height="3" rx="1" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="0.9" />

    {/* Row 3 */}
    <rect x="3" y="16" width="4" height="4" rx="1.2" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="1" />
    <rect x="9.5" y="16.5" width="11.5" height="3" rx="1" fill="url(#monoDarkGrad)" stroke="#E4E4E7" strokeWidth="0.9" />
  </svg>
);

/**
 * 38. Метод HALT (Hungry, Angry, Lonely, Tired) — 4-сегментна рефлексійна призма усвідомленості
 */
export const MonoRefractedHaltIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Outer Rounded Diamond / Shield */}
    <rect
      x="3.5"
      y="3.5"
      width="17"
      height="17"
      rx="4.5"
      fill="url(#monoDarkGrad)"
      stroke="#FFFFFF"
      strokeWidth="1.2"
    />
    {/* Top-Left: H (Hungry) */}
    <rect x="5.5" y="5.5" width="5.8" height="5.8" rx="2" fill="url(#monoLightGrad)" stroke="#E4E4E7" strokeWidth="0.8" />
    <path d="M 7.2 7 L 7.2 9.8 M 9.6 7 L 9.6 9.8 M 7.2 8.4 L 9.6 8.4" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
    
    {/* Top-Right: A (Angry) */}
    <rect x="12.7" y="5.5" width="5.8" height="5.8" rx="2" fill="url(#monoFacetGrad)" stroke="#E4E4E7" strokeWidth="0.8" />
    <path d="M 15.6 7 L 14.2 9.8 M 15.6 7 L 17 9.8 M 14.6 9 L 16.6 9" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
    
    {/* Bottom-Left: L (Lonely) */}
    <rect x="5.5" y="12.7" width="5.8" height="5.8" rx="2" fill="url(#monoFacetGrad)" stroke="#E4E4E7" strokeWidth="0.8" />
    <path d="M 7.4 14.2 L 7.4 17 L 9.5 17" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
    
    {/* Bottom-Right: T (Tired) */}
    <rect x="12.7" y="12.7" width="5.8" height="5.8" rx="2" fill="url(#monoLightGrad)" stroke="#E4E4E7" strokeWidth="0.8" />
    <path d="M 14.2 14.2 L 17 14.2 M 15.6 14.2 L 15.6 17" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/**
 * 39. Чек-ін
 */
export const MonoRefractedCheckinIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <rect x="4" y="5" width="16" height="16" rx="3.5" fill="url(#monoDarkGrad)" stroke="#FFFFFF" strokeWidth="1.2" />
    <rect x="8" y="2.5" width="8" height="4" rx="1.5" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="1" />
    <path d="M 8.5 13 L 11 15.5 L 16 10.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * 40. ШІ-Аналіз (Кристальний спалах ШІ)
 */
export const MonoRefractedSparklesIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Main central AI star */}
    <path
      d="M 12 2 L 14.2 9.8 L 22 12 L 14.2 14.2 L 12 22 L 9.8 14.2 L 2 12 L 9.8 9.8 Z"
      fill="url(#monoLightGrad)"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path d="M 12 2 L 12 22 M 2 12 L 22 12" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
    {/* Secondary small star */}
    <path
      d="M 19 3 L 19.8 5.2 L 22 6 L 19.8 6.8 L 19 9 L 18.2 6.8 L 16 6 L 18.2 5.2 Z"
      fill="url(#monoFacetGrad)"
      stroke="#E4E4E7"
      strokeWidth="0.8"
    />
  </svg>
);

/**
 * 41. ШІ-Чат (Когнітивний бот)
 */
export const MonoRefractedBotIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Antenna */}
    <line x1="12" y1="2" x2="12" y2="6" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="12" cy="2" r="1.5" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="0.8" />
    {/* Bot Head */}
    <rect x="3.5" y="6" width="17" height="14" rx="4" fill="url(#monoDarkGrad)" stroke="#FFFFFF" strokeWidth="1.2" />
    {/* Eyes */}
    <circle cx="8.5" cy="11.5" r="2" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="0.8" />
    <circle cx="15.5" cy="11.5" r="2" fill="url(#monoLightGrad)" stroke="#FFFFFF" strokeWidth="0.8" />
    {/* Mouth / Speaker grid */}
    <path d="M 8.5 16 H 15.5" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/**
 * 42. Монохромно адаптивна Крапля (Вода / Гідратація з легким аквамариновим відтінком)
 */
export const MonoRefractedWaterDropIcon: React.FC<MonoIconProps> = ({
  className = "w-3.5 h-3.5",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle transition-colors ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Refracted teardrop facet contour with subtle cyan tint */}
    <path
      d="M 12 2.5 C 12 2.5 19 10.5 19 15.5 C 19 19.1 15.9 22 12 22 C 8.1 22 5 19.1 5 15.5 C 5 10.5 12 2.5 12 2.5 Z"
      fill="url(#monoWaterGrad)"
      fillOpacity="0.35"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Internal refractive facets */}
    <path
      d="M 12 2.5 L 12 22 M 5 15.5 L 19 15.5"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeOpacity="0.5"
    />
    <path
      d="M 8 18.5 C 9.2 19.8 10.5 20.3 12 20.3"
      stroke="#7DD3FC"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeOpacity="0.85"
    />
  </svg>
);

/**
 * 43. Монохромно адаптивний Місяць (Сон / Циркадний ритм з легким індиго відтінком)
 */
export const MonoRefractedMoonIcon: React.FC<MonoIconProps> = ({
  className = "w-3.5 h-3.5",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle transition-colors ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Refracted Crescent Moon body with subtle indigo tint */}
    <path
      d="M 21 12.8 C 20.4 17.5 16.4 21 11.5 21 C 6.25 21 2 16.75 2 11.5 C 2 6.6 5.5 2.6 10.2 2 C 9.5 3.5 9.1 5.2 9.1 7 C 9.1 13 14 17.9 20 17.9 C 20.35 17.9 20.68 17.87 21 12.8 Z"
      fill="url(#monoMoonGrad)"
      fillOpacity="0.35"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Internal celestial refractive facets */}
    <path
      d="M 6 12 C 8 13.5 11 14 13 11 M 10.2 2 L 14.5 14.5"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeOpacity="0.5"
      strokeLinecap="round"
    />
    {/* Small night star accent */}
    <circle
      cx="18.5"
      cy="5.5"
      r="1.2"
      fill="#A5B4FC"
      stroke="currentColor"
      strokeWidth="0.5"
    />
  </svg>
);

/**
 * 44. Монохромно адаптивний Пульс / Тяга (Кардіограма з легким коралово-рожевим відтінком)
 */
export const MonoRefractedPulseIcon: React.FC<MonoIconProps> = ({
  className = "w-3.5 h-3.5",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle transition-colors ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Outer subtle protective facet capsule with subtle rose tint */}
    <rect
      x="2"
      y="4"
      width="20"
      height="16"
      rx="4"
      fill="url(#monoPulseGrad)"
      fillOpacity="0.28"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeOpacity="0.45"
    />
    {/* Cardiogram / Pulse waveform */}
    <path
      d="M 3.5 12 H 7.5 L 9.5 8 L 12 16 L 14.5 6 L 16.5 14 L 18 12 H 20.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Sparkle highlight at pulse peak */}
    <circle
      cx="14.5"
      cy="6"
      r="1.2"
      fill="#FDA4AF"
      stroke="currentColor"
      strokeWidth="0.5"
    />
  </svg>
);

/**
 * 45. Монохромно адаптивний Користувач / Фізичні параметри (User / Physical Profile)
 */
export const MonoRefractedUserIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Head */}
    <circle
      cx="12"
      cy="7"
      r="4"
      fill="url(#monoLightGrad)"
      stroke="#FFFFFF"
      strokeWidth="1.2"
    />
    <path
      d="M 10 5.5 C 10.8 4.6 12 4.4 13.2 4.8"
      stroke="#FFFFFF"
      strokeWidth="0.8"
      strokeLinecap="round"
      opacity="0.75"
    />
    {/* Torso / Shoulders */}
    <path
      d="M 4 20 C 4 15.5 7.6 13 12 13 C 16.4 13 20 15.5 20 20"
      fill="url(#monoDarkGrad)"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 8 18 C 9.5 16 12 15.5 14.5 16"
      stroke="#E4E4E7"
      strokeWidth="0.8"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

/**
 * 46. Монохромно адаптивне Попередження / Тригер (Alert / Trigger)
 */
export const MonoRefractedAlertIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    <path
      d="M 12 2.8 L 22 20.2 C 22.3 20.7 21.9 21.5 21.2 21.5 L 2.8 21.5 C 2.1 21.5 1.7 20.7 2 20.2 L 12 2.8 Z"
      fill="url(#monoDarkGrad)"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    {/* Internal facet accent */}
    <path
      d="M 12 6.5 L 18.5 18 L 5.5 18 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.25"
      stroke="#E4E4E7"
      strokeWidth="0.8"
      strokeLinejoin="round"
      opacity="0.6"
    />
    {/* Exclamation mark */}
    <line
      x1="12"
      y1="8.5"
      x2="12"
      y2="13.5"
      stroke="#FFFFFF"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle
      cx="12"
      cy="16.5"
      r="1.1"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * 47. Монохромно адаптивний Посуд / Напої та Їжа (Utensils / Food & Drinks)
 */
export const MonoRefractedUtensilsIcon: React.FC<MonoIconProps> = ({
  className = "w-4 h-4",
  size,
  style
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    className={`select-none inline-block align-middle ${className}`}
    style={style}
  >
    <MonoDefs />
    {/* Fork (left) */}
    <path
      d="M 5 2 L 5 8 C 5 9.7 6.3 11 8 11 L 8 22 M 5 4 H 8 M 8 2 L 8 11 M 11 2 L 11 8 C 11 9.7 9.7 11 8 11 M 8 4 H 11"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Knife (right) */}
    <path
      d="M 18 2 C 18 2 15 5 15 11 L 15 22 M 15 11 H 18 L 18 2 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.35"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 16.5 4 L 16.5 9"
      stroke="#E4E4E7"
      strokeWidth="0.8"
      strokeLinecap="round"
      opacity="0.7"
    />
  </svg>
);
