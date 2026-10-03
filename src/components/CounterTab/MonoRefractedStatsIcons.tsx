import React from 'react';

export interface MonoIconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

const MonoDefs: React.FC = () => (
  <defs>
    {/* Crisp Light Monochrome Gradient */}
    <linearGradient id="monoLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
      <stop offset="40%" stopColor="#E4E4E7" stopOpacity="0.85" />
      <stop offset="80%" stopColor="#A1A1AA" stopOpacity="0.7" />
      <stop offset="100%" stopColor="#52525B" stopOpacity="0.5" />
    </linearGradient>

    {/* Beveled Dark Monochrome Gradient */}
    <linearGradient id="monoDarkGrad" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FAFAFA" stopOpacity="0.9" />
      <stop offset="50%" stopColor="#D4D4D8" stopOpacity="0.75" />
      <stop offset="100%" stopColor="#3F3F46" stopOpacity="0.45" />
    </linearGradient>

    {/* Facet Accent Highlight */}
    <linearGradient id="monoFacetGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#71717A" stopOpacity="0.3" />
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
2. Птах / Гайворон / Пташка (Вільний час)
*/
export const MonoRefractedBirdIcon: React.FC<MonoIconProps> = ({
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
    {/* Faceted Origami Wings */}
    <path
      d="M 2 10 L 9 12 L 12 4 L 15 12 L 22 10 L 15 15 L 12 21 L 9 15 Z"
      fill="url(#monoLightGrad)"
      fillOpacity="0.45"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M 12 4 L 12 21 M 9 12 L 15 12 M 2 10 L 15 15 M 22 10 L 9 15"
      stroke="#E4E4E7"
      strokeWidth="0.8"
      strokeLinecap="round"
      opacity="0.75"
    />
  </svg>
);

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
