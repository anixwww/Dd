import React, { useState, useRef, useCallback } from 'react';
import { X, Sparkles, Sliders, RotateCcw, Check, Sun, Eye } from 'lucide-react';

export interface GlitterCustomConfig {
  hues: [number, number, number]; // [coreHue, secondaryHue, accentHue] in degrees 0..360
  glowBlur: number; // 0..25 px (Розмитість сяйва)
  glowIntensity: number; // 0.3..1.8 (Яскравість сяйва)
  glowRadius: number; // 0.6..1.6 (Радіус розсіювання)
}

export const DEFAULT_GLITTER_CONFIG: GlitterCustomConfig = {
  hues: [330, 200, 50],
  glowBlur: 10,
  glowIntensity: 1.0,
  glowRadius: 1.0,
};

// Convert Hue (0-360), Saturation (0-100), Lightness (0-100) to RGB [r, g, b]
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const normH = ((h % 360) + 360) % 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((normH / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (normH < 60) {
    rPrime = c; gPrime = x; bPrime = 0;
  } else if (normH < 120) {
    rPrime = x; gPrime = c; bPrime = 0;
  } else if (normH < 180) {
    rPrime = 0; gPrime = c; bPrime = x;
  } else if (normH < 240) {
    rPrime = 0; gPrime = x; bPrime = c;
  } else if (normH < 300) {
    rPrime = x; gPrime = 0; bPrime = c;
  } else {
    rPrime = c; gPrime = 0; bPrime = x;
  }

  return [
    Math.round((rPrime + m) * 255),
    Math.round((gPrime + m) * 255),
    Math.round((bPrime + m) * 255),
  ];
}

export function rgbToCss(rgb: [number, number, number], alpha = 1): string {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

interface PresetItem {
  name: string;
  emoji: string;
  hues: [number, number, number];
  glowBlur: number;
  glowIntensity: number;
  glowRadius: number;
}

const PRESETS: PresetItem[] = [
  { name: 'Сакура & Небо', emoji: '🌸', hues: [330, 200, 50], glowBlur: 10, glowIntensity: 1.0, glowRadius: 1.0 },
  { name: 'Смарагдовий ліс', emoji: '🌲', hues: [150, 185, 60], glowBlur: 12, glowIntensity: 1.1, glowRadius: 1.05 },
  { name: 'Космічний неон', emoji: '🌌', hues: [285, 320, 195], glowBlur: 14, glowIntensity: 1.25, glowRadius: 1.15 },
  { name: 'Сонячний бурштин', emoji: '✨', hues: [25, 48, 350], glowBlur: 8, glowIntensity: 1.15, glowRadius: 1.0 },
  { name: 'Льодовиковий кристал', emoji: '❄️', hues: [195, 220, 270], glowBlur: 10, glowIntensity: 1.05, glowRadius: 1.0 },
  { name: 'Магічний аметист', emoji: '🔮', hues: [270, 310, 45], glowBlur: 13, glowIntensity: 1.2, glowRadius: 1.1 },
  { name: 'Захід сонця', emoji: '🌅', hues: [15, 335, 50], glowBlur: 11, glowIntensity: 1.1, glowRadius: 1.05 },
  { name: 'Алмаз & Срібло', emoji: '💎', hues: [210, 180, 260], glowBlur: 8, glowIntensity: 0.95, glowRadius: 0.9 },
];

interface GlitterColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GlitterCustomConfig;
  onChangeConfig: (newConfig: GlitterCustomConfig) => void;
}

export const GlitterColorPickerModal: React.FC<GlitterColorPickerModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
}) => {
  const [activePoint, setActivePoint] = useState<0 | 1 | 2>(0);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  // Safe fallback values
  const safeConfig: GlitterCustomConfig = {
    hues: config?.hues || DEFAULT_GLITTER_CONFIG.hues,
    glowBlur: typeof config?.glowBlur === 'number' ? config.glowBlur : DEFAULT_GLITTER_CONFIG.glowBlur,
    glowIntensity: typeof config?.glowIntensity === 'number' ? config.glowIntensity : DEFAULT_GLITTER_CONFIG.glowIntensity,
    glowRadius: typeof config?.glowRadius === 'number' ? config.glowRadius : DEFAULT_GLITTER_CONFIG.glowRadius,
  };

  // Wheel dimensions
  const wheelRadius = 88; // distance from center to ring track
  const ringCenter = 105;  // half of 210px container

  // Calculate handle coordinates on the ring for a given hue
  const getHandlePos = (hue: number) => {
    // In conic gradient starting from top (0deg = 12 o'clock, clockwise)
    const rad = (hue - 90) * (Math.PI / 180);
    return {
      x: ringCenter + Math.cos(rad) * wheelRadius,
      y: ringCenter + Math.sin(rad) * wheelRadius,
    };
  };

  const updateHueFromCoords = useCallback(
    (clientX: number, clientY: number, pointIdx: 0 | 1 | 2) => {
      if (!ringRef.current) return;
      const rect = ringRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;

      // Calculate angle in degrees from 0 to 360 starting from 12 o'clock clockwise
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
      angle = Math.round(angle) % 360;

      const newHues: [number, number, number] = [...safeConfig.hues];
      newHues[pointIdx] = angle;
      onChangeConfig({
        ...safeConfig,
        hues: newHues,
      });
    },
    [safeConfig, onChangeConfig]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    // Check which handle is closest to the click point, or use activePoint
    if (ringRef.current) {
      const rect = ringRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let closestIdx: 0 | 1 | 2 = activePoint;
      let minDistance = Infinity;

      ([0, 1, 2] as const).forEach((idx) => {
        const pos = getHandlePos(safeConfig.hues[idx]);
        const dist = Math.hypot(clickX - pos.x, clickY - pos.y);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      // If clicked reasonably close to a point (within 36px), switch active point to it
      if (minDistance < 36) {
        setActivePoint(closestIdx);
        updateHueFromCoords(e.clientX, e.clientY, closestIdx);
      } else {
        updateHueFromCoords(e.clientX, e.clientY, activePoint);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updateHueFromCoords(e.clientX, e.clientY, activePoint);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  if (!isOpen) return null;

  const rgb0 = hslToRgb(safeConfig.hues[0], 85, 68);
  const rgb1 = hslToRgb(safeConfig.hues[1], 85, 72);
  const rgb2 = hslToRgb(safeConfig.hues[2], 90, 75);

  const pos0 = getHandlePos(safeConfig.hues[0]);
  const pos1 = getHandlePos(safeConfig.hues[1]);
  const pos2 = getHandlePos(safeConfig.hues[2]);

  const pointLabels = [
    { label: 'Основне (Ядро)', sub: 'Внутрішнє сяйво', color: rgbToCss(rgb0), ring: 'ring-pink-500' },
    { label: 'Вторинне (Хмара)', sub: 'Ефірне тіло', color: rgbToCss(rgb1), ring: 'ring-sky-500' },
    { label: 'Іскри (Акцент)', sub: 'Алмазний пил', color: rgbToCss(rgb2), ring: 'ring-amber-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="w-full max-w-sm max-h-[92vh] overflow-y-auto custom-scrollbar bg-white/95 dark:bg-[#18181f]/95 backdrop-blur-xl border border-slate-200 dark:border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-500/10 dark:bg-pink-500/20 text-pink-500">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-100">
                Колір та сяйво хмари
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Перетягуй 3 точки на колі кольорів у спокої
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Color Circle with 3 Points */}
        <div className="flex flex-col items-center justify-center py-3.5">
          <div
            ref={ringRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative w-[210px] h-[210px] rounded-full cursor-crosshair touch-none select-none flex items-center justify-center shadow-lg"
            style={{
              background: 'conic-gradient(from 0deg, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #ef4444)',
              boxShadow: `0 0 ${Math.max(12, safeConfig.glowBlur * 1.5)}px ${rgbToCss(rgb0, 0.35 * safeConfig.glowIntensity)}`,
            }}
          >
            {/* Inner Cutout with Center Multi-Color Glow Preview */}
            <div 
              className="w-[136px] h-[136px] rounded-full bg-slate-50 dark:bg-[#121217] flex flex-col items-center justify-center p-2 text-center shadow-inner border border-white/20 dark:border-white/5 relative overflow-hidden"
            >
              {/* Soft live ambient gradient blend in center */}
              <div 
                className="absolute inset-0 transition-all duration-300 pointer-events-none"
                style={{
                  opacity: Math.min(1, 0.55 * safeConfig.glowIntensity),
                  background: `radial-gradient(circle at 35% 35%, ${rgbToCss(rgb0, 0.75)}, transparent 65%), radial-gradient(circle at 65% 65%, ${rgbToCss(rgb1, 0.7)}, transparent 65%), radial-gradient(circle at 50% 50%, ${rgbToCss(rgb2, 0.5)}, transparent 70%)`,
                  filter: `blur(${Math.max(2, safeConfig.glowBlur * 0.45)}px)`,
                }}
              />

              <div className="relative z-10 flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 dark:text-zinc-400">
                  Активна точка:
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-100 mt-0.5">
                  #{activePoint + 1} {activePoint === 0 ? 'Ядро' : activePoint === 1 ? 'Хмара' : 'Іскри'}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5">
                  {safeConfig.hues[activePoint]}°
                </span>
              </div>
            </div>

            {/* Draggable Point 1 (Core) */}
            <div
              onClick={(e) => { e.stopPropagation(); setActivePoint(0); }}
              className={`absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border-2 transition-transform shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center ${
                activePoint === 0 ? 'scale-125 border-white ring-2 ring-pink-500 z-30' : 'border-white/90 z-20 hover:scale-110'
              }`}
              style={{
                left: `${pos0.x}px`,
                top: `${pos0.y}px`,
                backgroundColor: rgbToCss(rgb0),
              }}
              title="Точка 1: Основне сяйво ядра"
            >
              <span className="text-[10px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">1</span>
            </div>

            {/* Draggable Point 2 (Secondary) */}
            <div
              onClick={(e) => { e.stopPropagation(); setActivePoint(1); }}
              className={`absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border-2 transition-transform shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center ${
                activePoint === 1 ? 'scale-125 border-white ring-2 ring-sky-500 z-30' : 'border-white/90 z-20 hover:scale-110'
              }`}
              style={{
                left: `${pos1.x}px`,
                top: `${pos1.y}px`,
                backgroundColor: rgbToCss(rgb1),
              }}
              title="Точка 2: Вторинне сяйво хмари"
            >
              <span className="text-[10px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">2</span>
            </div>

            {/* Draggable Point 3 (Accent) */}
            <div
              onClick={(e) => { e.stopPropagation(); setActivePoint(2); }}
              className={`absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border-2 transition-transform shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center ${
                activePoint === 2 ? 'scale-125 border-white ring-2 ring-amber-400 z-30' : 'border-white/90 z-20 hover:scale-110'
              }`}
              style={{
                left: `${pos2.x}px`,
                top: `${pos2.y}px`,
                backgroundColor: rgbToCss(rgb2),
              }}
              title="Точка 3: Акцентні алмазні іскри"
            >
              <span className="text-[10px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">3</span>
            </div>
          </div>
        </div>

        {/* 3 Point Selectors */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {([0, 1, 2] as const).map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActivePoint(idx)}
              className={`p-2 rounded-2xl flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                activePoint === idx
                  ? 'bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-600 shadow-xs'
                  : 'bg-slate-50/60 dark:bg-zinc-900/40 border-slate-200/60 dark:border-zinc-800/60 hover:bg-slate-100/60'
              }`}
            >
              <div 
                className="w-4 h-4 rounded-full border border-white/60 shadow-xs"
                style={{ backgroundColor: pointLabels[idx].color }}
              />
              <span className="text-[10px] font-medium text-slate-800 dark:text-zinc-200 leading-tight">
                {pointLabels[idx].label}
              </span>
              <span className="text-[9px] text-slate-500 dark:text-zinc-400 font-mono">
                {safeConfig.hues[idx]}°
              </span>
            </button>
          ))}
        </div>

        {/* Glow & Blur Settings (Налаштування сяйва та розмитості) */}
        <div className="bg-slate-50/90 dark:bg-zinc-900/80 p-3 rounded-2xl border border-slate-200/70 dark:border-zinc-800 mb-3 space-y-3">
          {/* Setting 1: Glow Blur / Softness (Розмитість сяйва) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-pink-500" />
                Розмитість сяйва:
              </span>
              <span className="font-semibold text-slate-800 dark:text-zinc-200">
                {safeConfig.glowBlur === 0 ? 'Чітке' : safeConfig.glowBlur < 8 ? 'Легка' : safeConfig.glowBlur < 16 ? 'М’яка' : 'Глибока'} ({safeConfig.glowBlur}px)
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={25}
              step={1}
              value={safeConfig.glowBlur}
              onChange={(e) => onChangeConfig({ ...safeConfig, glowBlur: Number(e.target.value) })}
              className="w-full accent-pink-500 dark:accent-pink-400 cursor-pointer h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-lg appearance-none"
            />

            <div className="flex justify-between text-[9px] text-slate-400 dark:text-zinc-500">
              <span>0px Чітке</span>
              <span>10px М'яке</span>
              <span>25px Глибоке ефірне</span>
            </div>
          </div>

          {/* Setting 2: Glow Intensity (Яскравість сяйва) */}
          <div className="space-y-1.5 pt-1.5 border-t border-slate-200/60 dark:border-zinc-800/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                Яскравість сяйва:
              </span>
              <span className="font-semibold text-slate-800 dark:text-zinc-200">
                {Math.round(safeConfig.glowIntensity * 100)}%
              </span>
            </div>

            <input
              type="range"
              min={0.3}
              max={1.8}
              step={0.05}
              value={safeConfig.glowIntensity}
              onChange={(e) => onChangeConfig({ ...safeConfig, glowIntensity: Number(e.target.value) })}
              className="w-full accent-amber-500 dark:accent-amber-400 cursor-pointer h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-lg appearance-none"
            />

            <div className="flex justify-between text-[9px] text-slate-400 dark:text-zinc-500">
              <span>30% Стримане</span>
              <span>100% Природне</span>
              <span>180% Насичене</span>
            </div>
          </div>

          {/* Setting 3: Glow Radius (Розсіювання / Радіус) */}
          <div className="space-y-1.5 pt-1.5 border-t border-slate-200/60 dark:border-zinc-800/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-sky-500" />
                Розсіювання сяйва:
              </span>
              <span className="font-semibold text-slate-800 dark:text-zinc-200">
                {Math.round(safeConfig.glowRadius * 100)}%
              </span>
            </div>

            <input
              type="range"
              min={0.6}
              max={1.6}
              step={0.05}
              value={safeConfig.glowRadius}
              onChange={(e) => onChangeConfig({ ...safeConfig, glowRadius: Number(e.target.value) })}
              className="w-full accent-sky-500 dark:accent-sky-400 cursor-pointer h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-lg appearance-none"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5 mb-3.5">
          <span className="text-[11px] font-medium text-slate-600 dark:text-zinc-400">
            Швидкі палітри:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => onChangeConfig({ 
                  hues: [...p.hues], 
                  glowBlur: p.glowBlur,
                  glowIntensity: p.glowIntensity,
                  glowRadius: p.glowRadius
                })}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs text-slate-700 dark:text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <span className="text-sm">{p.emoji}</span>
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={() => onChangeConfig(DEFAULT_GLITTER_CONFIG)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors cursor-pointer py-1 px-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Скинути</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Готово</span>
          </button>
        </div>
      </div>
    </div>
  );
};

