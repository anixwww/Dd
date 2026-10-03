import React from 'react';

export interface MonoIconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

const MonoDefs: React.FC = () => (
  <defs>
    {/* Crisp Light Monochrome Gradient */}
    <linearGradient id="monoLightGradSos" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
      <stop offset="40%" stopColor="#E4E4E7" stopOpacity="0.85" />
      <stop offset="80%" stopColor="#A1A1AA" stopOpacity="0.7" />
      <stop offset="100%" stopColor="#52525B" stopOpacity="0.5" />
    </linearGradient>

    {/* Beveled Dark Monochrome Gradient */}
    <linearGradient id="monoDarkGradSos" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FAFAFA" stopOpacity="0.9" />
      <stop offset="50%" stopColor="#D4D4D8" stopOpacity="0.75" />
      <stop offset="100%" stopColor="#3F3F46" stopOpacity="0.45" />
    </linearGradient>

    {/* Facet Accent Highlight */}
    <linearGradient id="monoFacetGradSos" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#71717A" stopOpacity="0.3" />
    </linearGradient>
  </defs>
);

/**
 * 1. Телефон SOS (Дзвінок другу)
 */
export const MonoRefractedPhoneIcon: React.FC<MonoIconProps> = ({
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
      d="M 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      fill="url(#monoLightGradSos)"
      fillOpacity="0.4"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M 14 2 C 16 2 18 3 20 5 C 21 7 21 9 21 10 M 14 6 C 15.5 6 17 6.5 18 8"
      stroke="#E4E4E7"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.85"
    />
  </svg>
);

/**
 * 2. Історія / Журнал Криз SOS
 */
export const MonoRefractedHistoryIcon: React.FC<MonoIconProps> = ({
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
      d="M 3 12 a 9 9 0 1 0 9 -9 a 9.3 9.3 0 0 0 -6.36 2.64 L 3 8"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="url(#monoLightGradSos)"
      fillOpacity="0.25"
    />
    <path
      d="M 3 3 v 5 h 5"
      stroke="#E4E4E7"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 12 7 v 5 l 4 2"
      stroke="#FAFAFA"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 3. Потік Вітру / Фізіологічне Дихання (Wind)
 */
export const MonoRefractedWindIcon: React.FC<MonoIconProps> = ({
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
      d="M 17.7 7.7 A 2.5 2.5 0 1 1 15 5 h 2.5 M 9.5 9.5 A 2.5 2.5 0 1 1 7 7 h 8 M 12.5 16.5 A 2.5 2.5 0 1 0 10 19 h 2.5"
      fill="url(#monoLightGradSos)"
      fillOpacity="0.3"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 2 8 h 13 M 2 12 h 11 M 2 16 h 8"
      stroke="#E4E4E7"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.8"
    />
  </svg>
);

/**
 * 4. Хвилі Серфінгу Тяги (Waves)
 */
export const MonoRefractedWavesIcon: React.FC<MonoIconProps> = ({
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
      d="M 2 6 C 5 2, 8 2, 11 6 C 14 10, 17 10, 22 6"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M 2 12 C 5 8, 8 8, 11 12 C 14 16, 17 16, 22 12"
      stroke="#E4E4E7"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="url(#monoLightGradSos)"
      fillOpacity="0.3"
    />
    <path
      d="M 2 18 C 5 14, 8 14, 11 18 C 14 22, 17 22, 22 18"
      stroke="#D4D4D8"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.75"
    />
  </svg>
);

/**
 * 5. Око / Заземлення 5-4-3-2-1 (Eye)
 */
export const MonoRefractedEyeIcon: React.FC<MonoIconProps> = ({
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
      d="M 1 12 S 5 4, 12 4 s 11 8, 11 8 s -4 8, -11 8 S 1 12, 1 12 Z"
      fill="url(#monoLightGradSos)"
      fillOpacity="0.35"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      fill="url(#monoDarkGradSos)"
      stroke="#FAFAFA"
      strokeWidth="1.2"
    />
    <circle cx="12" cy="12" r="1" fill="#FFFFFF" />
  </svg>
);

/**
 * 6. Звукотерапія / Музичні Ноти (Music)
 */
export const MonoRefractedMusicIcon: React.FC<MonoIconProps> = ({
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
      d="M 9 18 V 5 L 21 3 V 16"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="6"
      cy="18"
      r="3"
      fill="url(#monoLightGradSos)"
      fillOpacity="0.5"
      stroke="#E4E4E7"
      strokeWidth="1.2"
    />
    <circle
      cx="18"
      cy="16"
      r="3"
      fill="url(#monoDarkGradSos)"
      stroke="#FFFFFF"
      strokeWidth="1.2"
    />
    <line x1="9" y1="9" x2="21" y2="7" stroke="#E4E4E7" strokeWidth="1" />
  </svg>
);

/**
 * 7. Компас / Колесо замінників (Compass)
 */
export const MonoRefractedCompassIcon: React.FC<MonoIconProps> = ({
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
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="url(#monoLightGradSos)"
      fillOpacity="0.2"
      stroke="#FFFFFF"
      strokeWidth="1.3"
    />
    <polygon
      points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"
      fill="url(#monoDarkGradSos)"
      stroke="#FAFAFA"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
  </svg>
);

/**
 * 8. Геймпад / Бульбашки Антистрес (Gamepad)
 */
export const MonoRefractedGamepadIcon: React.FC<MonoIconProps> = ({
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
      d="M 6 12 h 4 M 8 10 v 4 M 15 11 h .01 M 18 13 h .01"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 2 12 C 2 7, 5 6, 9 6 h 6 c 4 0, 7 1, 7 6 c 0 4, -2 8, -5 8 c -1.5 0, -2.5 -1, -3.5 -2.5 h -3 C 9.5 19, 8.5 20, 7 20 C 4 20, 2 16, 2 12 Z"
      fill="url(#monoLightGradSos)"
      fillOpacity="0.35"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 9. Розгорнута Книга / Когнітивні картки (BookOpen)
 */
export const MonoRefractedBookOpenIcon: React.FC<MonoIconProps> = ({
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
      fill="url(#monoDarkGradSos)"
      stroke="#E4E4E7"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M 22 3 h -6 a 4 4 0 0 0 -4 4 v 14 a 3 3 0 0 1 3 -3 h 7 Z"
      fill="url(#monoLightGradSos)"
      fillOpacity="0.4"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 10. Краплі Холодної Води / Рефлекс нирця (Droplets)
 */
export const MonoRefractedDropletsIcon: React.FC<MonoIconProps> = ({
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
      d="M 7 16.5 C 7 18.98 9.02 21 11.5 21 C 13.98 21 16 18.98 16 16.5 C 16 13.7 11.5 8 11.5 8 C 11.5 8 7 13.7 7 16.5 Z"
      fill="url(#monoLightGradSos)"
      fillOpacity="0.45"
      stroke="#FFFFFF"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path
      d="M 16.5 10 C 16.5 11.66 17.84 13 19.5 13 C 21.16 13 22.5 11.66 22.5 10 C 22.5 8.2 19.5 4 19.5 4 C 19.5 4 16.5 8.2 16.5 10 Z"
      fill="url(#monoDarkGradSos)"
      stroke="#E4E4E7"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 11. Рятувальне Коло SOS (Lifebuoy)
 */
export const MonoRefractedLifebuoyIcon: React.FC<MonoIconProps> = ({
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
    <circle
      cx="12"
      cy="12"
      r="10"
      fill="url(#monoLightGradSos)"
      fillOpacity="0.3"
      stroke="#FFFFFF"
      strokeWidth="1.3"
    />
    <circle
      cx="12"
      cy="12"
      r="4"
      fill="url(#monoDarkGradSos)"
      stroke="#FAFAFA"
      strokeWidth="1.2"
    />
    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" stroke="#FFFFFF" strokeWidth="1.2" />
    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" stroke="#FFFFFF" strokeWidth="1.2" />
    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" stroke="#FFFFFF" strokeWidth="1.2" />
    <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" stroke="#FFFFFF" strokeWidth="1.2" />
  </svg>
);
