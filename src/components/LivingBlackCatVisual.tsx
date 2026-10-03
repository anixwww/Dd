import React, { useRef, useState } from 'react';

export interface LivingBlackCatVisualProps {
  mode?: string;
  hasUnreadAdvice?: boolean;
  hasAdvice?: boolean;
  isThinking?: boolean;
  isDialogueActive?: boolean;
  isAllGood?: boolean;
  onClick: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  blurAmount?: number;
  calmHue?: number;
}

/**
 * LivingBlackCatVisual - Статична 2D картинка «Чорний кіт» (без Canvas, без 3D, без анімацій).
 * 0% CPU навантаження, чистий чіткий векторний малюнок.
 */
export const LivingBlackCatVisual: React.FC<LivingBlackCatVisualProps> = ({
  hasUnreadAdvice = false,
  hasAdvice = false,
  isThinking = false,
  isDialogueActive = false,
  onClick,
  onLongPress,
}) => {
  const isPointerDownRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressActiveRef = useRef(false);
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    isLongPressActiveRef.current = false;
    setIsPressed(true);

    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }

    if (onLongPress) {
      longPressTimeoutRef.current = setTimeout(() => {
        if (isPointerDownRef.current) {
          isLongPressActiveRef.current = true;
          try {
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              navigator.vibrate(25);
            }
          } catch {}
          onLongPress();
        }
      }, 500);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    setIsPressed(false);

    if (isPointerDownRef.current && !isLongPressActiveRef.current) {
      const dx = dragStartRef.current ? Math.abs(e.clientX - dragStartRef.current.x) : 0;
      const dy = dragStartRef.current ? Math.abs(e.clientY - dragStartRef.current.y) : 0;

      if (dx < 12 && dy < 12) {
        onClick();
      }
    }

    isPointerDownRef.current = false;
    dragStartRef.current = null;
  };

  const isAlert = hasAdvice || hasUnreadAdvice;
  const eyeColor = isAlert ? "#f87171" : "#34d399"; // Emerald or Alert Coral
  const moonGold = "#fbbf24";

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative flex items-center justify-center cursor-pointer select-none touch-none active:scale-95 transition-transform duration-75"
      style={{
        width: 105,
        height: 105,
      }}
      title="Чорний кіт — натисніть для діалогу, затисніть для налаштувань"
    >
      {/* Статична 2D векторна картинка кота (Static 2D SVG Illustration) */}
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full block pointer-events-none drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Хвіст кота (Curved Tail) */}
        <path
          d="M82 92 C98 90, 108 76, 106 60 C104 46, 92 42, 90 48 C88 54, 98 56, 98 64 C98 74, 90 84, 76 86 Z"
          fill="#13141c"
          stroke="#0b0c12"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Тіло кота (Cat Body Silhouette) */}
        <path
          d="M36 94 C34 76, 40 56, 50 48 C56 44, 64 44, 70 48 C80 56, 86 76, 84 94 C84 100, 36 100, 36 94 Z"
          fill="#161823"
          stroke="#0c0d14"
          strokeWidth="3"
        />

        {/* Вушка (Cat Ears) */}
        {/* Ліве вушко */}
        <path
          d="M38 46 L30 18 L52 30 Z"
          fill="#161823"
          stroke="#0c0d14"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M37 40 L33 24 L48 30 Z"
          fill="#f472b6"
          opacity="0.8"
        />

        {/* Праве вушко */}
        <path
          d="M82 46 L90 18 L68 30 Z"
          fill="#161823"
          stroke="#0c0d14"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M83 40 L87 24 L72 30 Z"
          fill="#f472b6"
          opacity="0.8"
        />

        {/* Голова (Cat Head) */}
        <ellipse
          cx="60"
          cy="42"
          rx="26"
          ry="20"
          fill="#1a1c29"
          stroke="#0c0d14"
          strokeWidth="3"
        />

        {/* Золотий місячний півмісяць на лобі (Forehead Crescent Moon) */}
        <path
          d="M60 28 C57 28, 55 31, 55 34 C55 37, 57 40, 60 40 C58 38, 58 30, 60 28 Z"
          fill={moonGold}
        />

        {/* Очі (Emerald Cat Eyes) */}
        {/* Ліве око */}
        <ellipse
          cx="48"
          cy="42"
          rx="5.5"
          ry="7"
          fill={eyeColor}
          stroke="#0c0d14"
          strokeWidth="1.5"
        />
        {/* Зіниця */}
        <ellipse
          cx="48"
          cy="42"
          rx="1.6"
          ry="5.5"
          fill="#090a0f"
        />
        {/* Блік */}
        <circle cx="49.5" cy="39" r="1.2" fill="#ffffff" />

        {/* Праве око */}
        <ellipse
          cx="72"
          cy="42"
          rx="5.5"
          ry="7"
          fill={eyeColor}
          stroke="#0c0d14"
          strokeWidth="1.5"
        />
        {/* Зіниця */}
        <ellipse
          cx="72"
          cy="42"
          rx="1.6"
          ry="5.5"
          fill="#090a0f"
        />
        {/* Блік */}
        <circle cx="73.5" cy="39" r="1.2" fill="#ffffff" />

        {/* Рожевий носик (Nose) */}
        <path
          d="M58 49 L62 49 L60 52 Z"
          fill="#f472b6"
        />

        {/* Мордочка (Mouth) */}
        <path
          d="M56 53 C58 55, 60 54, 60 52 C60 54, 62 55, 64 53"
          stroke="#4b5563"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Вуса (Whiskers) */}
        {/* Ліва сторона */}
        <line x1="42" y1="48" x2="22" y2="45" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
        <line x1="42" y1="51" x2="20" y2="52" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
        <line x1="42" y1="54" x2="24" y2="59" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />

        {/* Права сторона */}
        <line x1="78" y1="48" x2="98" y2="45" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
        <line x1="78" y1="51" x2="100" y2="52" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
        <line x1="78" y1="54" x2="96" y2="59" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />

        {/* Червоний нашийник з золотим кулоном (Collar with Bell/Medallion) */}
        <path
          d="M44 60 C54 65, 66 65, 76 60 C74 63, 66 68, 54 68 C46 68, 44 63, 44 60 Z"
          fill="#ef4444"
          stroke="#991b1b"
          strokeWidth="1"
        />
        <circle cx="60" cy="67" r="3.5" fill={moonGold} stroke="#b45309" strokeWidth="1" />
        <circle cx="60" cy="67" r="1.2" fill="#fffbeb" />

        {/* Передні лапки (Front Paws) */}
        <ellipse cx="48" cy="94" rx="7" ry="4.5" fill="#1e202e" stroke="#0c0d14" strokeWidth="2" />
        <ellipse cx="72" cy="94" rx="7" ry="4.5" fill="#1e202e" stroke="#0c0d14" strokeWidth="2" />
        <line x1="46" y1="94" x2="46" y2="97" stroke="#4b5563" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="50" y1="94" x2="50" y2="97" stroke="#4b5563" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="70" y1="94" x2="70" y2="97" stroke="#4b5563" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="74" y1="94" x2="74" y2="97" stroke="#4b5563" strokeWidth="1.2" strokeLinecap="round" />
      </svg>

      {/* Discrete State Indicator for Dialogue / Thoughts */}
      {isThinking && (
        <span className="absolute -top-1 right-1 text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-700 text-amber-300 shadow-xs">
          💭
        </span>
      )}
      {isDialogueActive && (
        <span className="absolute -top-1 left-1 text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-500 text-emerald-300 shadow-xs">
          ^._.^
        </span>
      )}
    </div>
  );
};
