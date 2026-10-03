import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  RotateCcw, 
  Vibrate, 
  Sparkle,
  Maximize2,
  CheckCircle2,
  Type,
  Wand2,
  Palette
} from 'lucide-react';
import { MonolithicSegmentedControl } from './MonolithicSegmentedControl';
import { 
  TIMER_STYLES, 
  TimerStyleType, 
  getTimerStyleCssClass,
  TIMER_FONTS,
  TimerFontType,
  getTimerFontCssClass,
  TIMER_EFFECTS,
  TimerEffectType,
  getTimerEffectCssClass
} from './CounterTab/TimerStyles';

interface TimerStylesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStyle: TimerStyleType;
  onSelectStyle: (style: TimerStyleType) => void;
  currentFont?: TimerFontType;
  onSelectFont?: (font: TimerFontType) => void;
  currentEffect?: TimerEffectType;
  onSelectEffect?: (effect: TimerEffectType) => void;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  humanQuitTimeText: string;
  digitalTimeText: string;
  onOpenZenMode?: () => void;
  accent?: string;
}

const STORAGE_HIDDEN_STYLES_KEY = 'quit-smoking:hidden-timer-styles';
const STORAGE_HIDDEN_FONTS_KEY = 'quit-smoking:hidden-timer-fonts';
const STORAGE_HIDDEN_EFFECTS_KEY = 'quit-smoking:hidden-timer-effects';

export const TimerStylesModal: React.FC<TimerStylesModalProps> = ({
  isOpen,
  onClose,
  currentStyle,
  onSelectStyle,
  currentFont = 'default',
  onSelectFont,
  currentEffect = 'none',
  onSelectEffect,
  days,
  hours,
  minutes,
  seconds,
  humanQuitTimeText,
  digitalTimeText,
  onOpenZenMode,
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'font' | 'effect'>('style');

  // Hidden lists
  const [hiddenStyleIds, setHiddenStyleIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_HIDDEN_STYLES_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  const [hiddenFontIds, setHiddenFontIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_HIDDEN_FONTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  const [hiddenEffectIds, setHiddenEffectIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_HIDDEN_EFFECTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  // Local active selections for instant preview
  const [selectedStyle, setSelectedStyle] = useState<TimerStyleType>(currentStyle);
  const [selectedFont, setSelectedFont] = useState<TimerFontType>(currentFont);
  const [selectedEffect, setSelectedEffect] = useState<TimerEffectType>(currentEffect);

  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:haptics') !== 'false';
    } catch {
      return true;
    }
  });

  // Filtered lists
  const availableStyles = TIMER_STYLES.filter((s) => !hiddenStyleIds.includes(s.id));
  const effectiveStyles = availableStyles.length > 0 ? availableStyles : [TIMER_STYLES[0]];

  const availableFonts = TIMER_FONTS.filter((f) => !hiddenFontIds.includes(f.id));
  const effectiveFonts = availableFonts.length > 0 ? availableFonts : [TIMER_FONTS[0]];

  const availableEffects = TIMER_EFFECTS.filter((e) => !hiddenEffectIds.includes(e.id));
  const effectiveEffects = availableEffects.length > 0 ? availableEffects : [TIMER_EFFECTS[0]];

  // Carousel indices for each tab
  const [styleIndex, setStyleIndex] = useState<number>(0);
  const [fontIndex, setFontIndex] = useState<number>(0);
  const [effectIndex, setEffectIndex] = useState<number>(0);

  const touchStartXRef = useRef<number | null>(null);

  // Sync on open
  useEffect(() => {
    if (isOpen) {
      setSelectedStyle(currentStyle);
      setSelectedFont(currentFont);
      setSelectedEffect(currentEffect);

      const sIdx = effectiveStyles.findIndex((s) => s.id === currentStyle);
      setStyleIndex(sIdx >= 0 ? sIdx : 0);

      const fIdx = effectiveFonts.findIndex((f) => f.id === currentFont);
      setFontIndex(fIdx >= 0 ? fIdx : 0);

      const eIdx = effectiveEffects.findIndex((e) => e.id === currentEffect);
      setEffectIndex(eIdx >= 0 ? eIdx : 0);
    }
  }, [isOpen, currentStyle, currentFont, currentEffect, effectiveStyles.length, effectiveFonts.length, effectiveEffects.length]);

  const triggerHaptic = useCallback(() => {
    if (hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch {}
    }
  }, [hapticsEnabled]);

  // Current slide helpers
  const currentTotal = activeTab === 'style' 
    ? effectiveStyles.length 
    : activeTab === 'font' 
    ? effectiveFonts.length 
    : effectiveEffects.length;

  const currentIdx = activeTab === 'style' 
    ? styleIndex 
    : activeTab === 'font' 
    ? fontIndex 
    : effectIndex;

  const goToNext = useCallback(() => {
    triggerHaptic();
    if (activeTab === 'style') {
      setStyleIndex((prev) => {
        const next = (prev + 1) % effectiveStyles.length;
        setSelectedStyle(effectiveStyles[next].id);
        return next;
      });
    } else if (activeTab === 'font') {
      setFontIndex((prev) => {
        const next = (prev + 1) % effectiveFonts.length;
        setSelectedFont(effectiveFonts[next].id);
        return next;
      });
    } else {
      setEffectIndex((prev) => {
        const next = (prev + 1) % effectiveEffects.length;
        setSelectedEffect(effectiveEffects[next].id);
        return next;
      });
    }
  }, [activeTab, effectiveStyles, effectiveFonts, effectiveEffects, triggerHaptic]);

  const goToPrev = useCallback(() => {
    triggerHaptic();
    if (activeTab === 'style') {
      setStyleIndex((prev) => {
        const next = (prev - 1 + effectiveStyles.length) % effectiveStyles.length;
        setSelectedStyle(effectiveStyles[next].id);
        return next;
      });
    } else if (activeTab === 'font') {
      setFontIndex((prev) => {
        const next = (prev - 1 + effectiveFonts.length) % effectiveFonts.length;
        setSelectedFont(effectiveFonts[next].id);
        return next;
      });
    } else {
      setEffectIndex((prev) => {
        const next = (prev - 1 + effectiveEffects.length) % effectiveEffects.length;
        setSelectedEffect(effectiveEffects[next].id);
        return next;
      });
    }
  }, [activeTab, effectiveStyles, effectiveFonts, effectiveEffects, triggerHaptic]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNext, goToPrev, onClose]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(diff) > 35) {
      if (diff < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // Active items
  const curStyleDef = effectiveStyles[Math.min(styleIndex, effectiveStyles.length - 1)] || TIMER_STYLES[0];
  const curFontDef = effectiveFonts[Math.min(fontIndex, effectiveFonts.length - 1)] || TIMER_FONTS[0];
  const curEffectDef = effectiveEffects[Math.min(effectIndex, effectiveEffects.length - 1)] || TIMER_EFFECTS[0];

  const isCurrentActive = activeTab === 'style'
    ? curStyleDef.id === currentStyle
    : activeTab === 'font'
    ? curFontDef.id === currentFont
    : curEffectDef.id === currentEffect;

  const handleApplyCurrent = () => {
    triggerHaptic();
    if (activeTab === 'style') {
      onSelectStyle(curStyleDef.id);
    } else if (activeTab === 'font') {
      if (onSelectFont) onSelectFont(curFontDef.id);
      try {
        localStorage.setItem('quit-smoking:timer-font', curFontDef.id);
        window.dispatchEvent(new Event('timer-font-change'));
      } catch {}
    } else {
      if (onSelectEffect) onSelectEffect(curEffectDef.id);
      try {
        localStorage.setItem('quit-smoking:timer-effect', curEffectDef.id);
        window.dispatchEvent(new Event('timer-effect-change'));
      } catch {}
    }
  };

  // Delete current option
  const handleDeleteCurrent = () => {
    triggerHaptic();
    if (activeTab === 'style') {
      const idToDelete = curStyleDef.id;
      const nextHidden = [...hiddenStyleIds, idToDelete];
      setHiddenStyleIds(nextHidden);
      try {
        localStorage.setItem(STORAGE_HIDDEN_STYLES_KEY, JSON.stringify(nextHidden));
      } catch {}
      const remaining = TIMER_STYLES.filter((s) => !nextHidden.includes(s.id));
      if (remaining.length > 0) {
        const nextIdx = Math.min(styleIndex, remaining.length - 1);
        setStyleIndex(nextIdx);
        setSelectedStyle(remaining[nextIdx].id);
        if (currentStyle === idToDelete) onSelectStyle(remaining[nextIdx].id);
      }
    } else if (activeTab === 'font') {
      const idToDelete = curFontDef.id;
      const nextHidden = [...hiddenFontIds, idToDelete];
      setHiddenFontIds(nextHidden);
      try {
        localStorage.setItem(STORAGE_HIDDEN_FONTS_KEY, JSON.stringify(nextHidden));
      } catch {}
      const remaining = TIMER_FONTS.filter((f) => !nextHidden.includes(f.id));
      if (remaining.length > 0) {
        const nextIdx = Math.min(fontIndex, remaining.length - 1);
        setFontIndex(nextIdx);
        setSelectedFont(remaining[nextIdx].id);
        if (currentFont === idToDelete && onSelectFont) onSelectFont(remaining[nextIdx].id);
      }
    } else {
      const idToDelete = curEffectDef.id;
      const nextHidden = [...hiddenEffectIds, idToDelete];
      setHiddenEffectIds(nextHidden);
      try {
        localStorage.setItem(STORAGE_HIDDEN_EFFECTS_KEY, JSON.stringify(nextHidden));
      } catch {}
      const remaining = TIMER_EFFECTS.filter((e) => !nextHidden.includes(e.id));
      if (remaining.length > 0) {
        const nextIdx = Math.min(effectIndex, remaining.length - 1);
        setEffectIndex(nextIdx);
        setSelectedEffect(remaining[nextIdx].id);
        if (currentEffect === idToDelete && onSelectEffect) onSelectEffect(remaining[nextIdx].id);
      }
    }
  };

  const handleRestoreCurrentTab = () => {
    triggerHaptic();
    if (activeTab === 'style') {
      setHiddenStyleIds([]);
      try { localStorage.removeItem(STORAGE_HIDDEN_STYLES_KEY); } catch {}
    } else if (activeTab === 'font') {
      setHiddenFontIds([]);
      try { localStorage.removeItem(STORAGE_HIDDEN_FONTS_KEY); } catch {}
    } else {
      setHiddenEffectIds([]);
      try { localStorage.removeItem(STORAGE_HIDDEN_EFFECTS_KEY); } catch {}
    }
  };

  const hiddenCount = activeTab === 'style' 
    ? hiddenStyleIds.length 
    : activeTab === 'font' 
    ? hiddenFontIds.length 
    : hiddenEffectIds.length;

  const toggleHaptics = () => {
    const next = !hapticsEnabled;
    setHapticsEnabled(next);
    try {
      localStorage.setItem('quit-smoking:haptics', String(next));
    } catch {}
    if (next && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(35);
      } catch {}
    }
  };

  if (!isOpen) return null;

  // Render combined live time display (Style + Font + Effect)
  const renderLiveTimeDisplay = () => {
    const previewStyleToRender = activeTab === 'style' ? curStyleDef.id : selectedStyle;
    const previewFontToRender = activeTab === 'font' ? curFontDef.id : selectedFont;
    const previewEffectToRender = activeTab === 'effect' ? curEffectDef.id : selectedEffect;

    const fontClass = getTimerFontCssClass(previewFontToRender);
    const effectClass = getTimerEffectCssClass(previewEffectToRender);
    const styleClass = getTimerStyleCssClass(previewStyleToRender);

    if (previewStyleToRender === 'harmonic') {
      return (
        <div className={`flex items-center justify-center gap-1.5 sm:gap-2 select-none py-1 ${fontClass} ${effectClass}`}>
          {days > 0 && (
            <div className="flex flex-col items-center px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/15 shadow-sm">
              <span className="text-xl font-bold leading-none">{days}</span>
              <span className="text-[9px] uppercase tracking-wider text-zinc-300 mt-0.5">днів</span>
            </div>
          )}
          <div className="flex flex-col items-center px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/15 shadow-sm">
            <span className="text-xl font-bold leading-none">{hours}</span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-300 mt-0.5">год</span>
          </div>
          <span className="text-white/60 font-serif text-lg leading-none">:</span>
          <div className="flex flex-col items-center px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/15 shadow-sm">
            <span className="text-xl font-bold leading-none">{minutes}</span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-300 mt-0.5">хв</span>
          </div>
          <span className="text-white/60 font-serif text-lg leading-none">:</span>
          <div className="flex flex-col items-center px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/15 shadow-sm">
            <span className="text-xl font-bold leading-none">{seconds}</span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-300 mt-0.5">сек</span>
          </div>
        </div>
      );
    }

    if (previewStyleToRender === 'digital') {
      return (
        <span className={`timer-digital-wrapper text-2xl sm:text-3xl tracking-wider ${fontClass} ${effectClass}`}>
          {digitalTimeText}
        </span>
      );
    }

    return (
      <span className={`${styleClass} ${fontClass} ${effectClass} text-2xl sm:text-3xl text-center leading-tight`}>
        {humanQuitTimeText}
      </span>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      <div 
        className="bg-[#141418] border border-[#2a2a34] w-full max-w-lg rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-zinc-100 relative"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#262630] flex items-center justify-between bg-gradient-to-r from-indigo-950/40 via-[#181820] to-purple-950/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shadow-inner text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white">
                Стиль таймера
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            title="Закрити"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Стиль | Шрифт | Ефект */}
        <div className="p-2.5 bg-[#181822] border-b border-[#262630] shrink-0">
          <MonolithicSegmentedControl
            items={[
              { id: 'style', label: 'Стиль', icon: <Palette className="w-3.5 h-3.5" /> },
              { id: 'font', label: 'Шрифт', icon: <Type className="w-3.5 h-3.5" /> },
              { id: 'effect', label: 'Ефект', icon: <Wand2 className="w-3.5 h-3.5" /> },
            ]}
            value={activeTab}
            onChange={(val) => {
              setActiveTab(val as 'style' | 'font' | 'effect');
              triggerHaptic();
            }}
            size="md"
          />
        </div>

        {/* Carousel Body */}
        <div className="p-4 sm:p-6 space-y-4">

          {/* Navigation Bar: Prev - Counter - Next */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goToPrev}
              className="w-10 h-10 rounded-2xl bg-[#1c1c26] hover:bg-indigo-600 border border-[#2e2e3e] hover:border-indigo-500 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-90"
              title="Попередній (←)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center">
              <span className="text-xs font-mono font-bold text-zinc-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                {currentIdx + 1} / {currentTotal}
              </span>
            </div>

            <button
              type="button"
              onClick={goToNext}
              className="w-10 h-10 rounded-2xl bg-[#1c1c26] hover:bg-indigo-600 border border-[#2e2e3e] hover:border-indigo-500 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-90"
              title="Наступний (→)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Live Preview Display Box */}
          <div 
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1c1c26] via-[#16161f] to-[#121218] border border-[#2e2e3e] shadow-inner relative overflow-hidden flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px] text-center"
          >
            {/* Combined Time Live Renderer */}
            <div className="py-3 px-2 w-full flex items-center justify-center overflow-x-auto no-scrollbar">
              {renderLiveTimeDisplay()}
            </div>
          </div>

          {/* Action Buttons: Apply & Delete */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleApplyCurrent}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 ${
                isCurrentActive
                  ? 'bg-emerald-600 text-white border border-emerald-500 shadow-emerald-900/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30 hover:shadow-indigo-600/50'
              }`}
            >
              {isCurrentActive ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Вибрано як активний</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Встановити цей {activeTab === 'style' ? 'стиль' : activeTab === 'font' ? 'шрифт' : 'ефект'}</span>
                </>
              )}
            </button>

            {currentTotal > 1 && (
              <button
                type="button"
                onClick={handleDeleteCurrent}
                className="py-3 px-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold active:scale-95 shrink-0"
                title="Видалити цей варіант, який не сподобався"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Видалити</span>
              </button>
            )}
          </div>

          {/* Footer Quick Options (Restore deleted, Zen mode, Haptics) */}
          <div className="pt-3 border-t border-[#262630] flex flex-wrap items-center justify-between gap-2 text-xs">
            {hiddenCount > 0 ? (
              <button
                type="button"
                onClick={handleRestoreCurrentTab}
                className="text-[11px] text-zinc-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
                title="Відновити всі раніше видалені варіанти для цієї вкладки"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Відновити видалені ({hiddenCount})</span>
              </button>
            ) : (
              <span className="text-[11px] text-zinc-500">
                Гортайте стрілками або свайпом
              </span>
            )}

            <div className="flex items-center gap-2">
              {onOpenZenMode && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenZenMode();
                  }}
                  className="px-2.5 py-1 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 hover:text-purple-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  title="Відкрити мінімалістичний режим повного екрану"
                >
                  <Sparkle className="w-3 h-3" />
                  <span>Дзен</span>
                </button>
              )}

              <button
                type="button"
                onClick={toggleHaptics}
                className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 ${
                  hapticsEnabled
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-zinc-500 hover:text-zinc-300'
                }`}
                title="Тактильна вібрація при перемиканні"
              >
                <Vibrate className="w-3 h-3" />
                <span>{hapticsEnabled ? 'Вібро ✓' : 'Вібро ✕'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
