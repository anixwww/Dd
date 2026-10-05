import React, { useState, useCallback } from 'react';
import { Sparkles, Check, Sliders, Sun, Eye, Image as ImageIcon, RotateCcw, Compass } from 'lucide-react';
import { DEFAULT_AI_BACKGROUNDS, AiBackgroundTuning } from './AiGradientBackground';

interface AiBackgroundThemeSectionProps {
  activeAppTheme: string;
  onSelectAppTheme: (themeId: string, themeName: string, emoji: string, e?: React.MouseEvent) => void;
  showFeedback: (msg: string) => void;
}

export const AiBackgroundThemeSection: React.FC<AiBackgroundThemeSectionProps> = ({
  activeAppTheme,
  onSelectAppTheme,
  showFeedback
}) => {
  // Active custom BG url (default is Nebula)
  const defaultBg = DEFAULT_AI_BACKGROUNDS[0];
  const [activeBgUrl, setActiveBgUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:active-custom-bg') || defaultBg.url;
    } catch {
      return defaultBg.url;
    }
  });

  // Background tuning (brightness, blur, opacity)
  const [tuning, setTuning] = useState<AiBackgroundTuning>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:ai-bg-tuning');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { brightness: 85, blur: 0, opacity: 90 };
  });

  // Save tuning to localStorage and dispatch instant sync event
  const updateTuning = useCallback((key: keyof AiBackgroundTuning, val: number) => {
    setTuning((prev) => {
      const next = { ...prev, [key]: val };
      try {
        localStorage.setItem('quit-smoking:ai-bg-tuning', JSON.stringify(next));
        window.dispatchEvent(new Event('app-ai-bg-change'));
      } catch {}
      return next;
    });
  }, []);

  const handleResetTuning = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultTuning: AiBackgroundTuning = { brightness: 85, blur: 0, opacity: 90 };
    setTuning(defaultTuning);
    try {
      localStorage.setItem('quit-smoking:ai-bg-tuning', JSON.stringify(defaultTuning));
      window.dispatchEvent(new Event('app-ai-bg-change'));
    } catch {}
    showFeedback('Параметри фону скинуто до рекомендованих ✨');
  }, [showFeedback]);

  // Apply Cosmic Nebula background
  const applyNebula = useCallback((e?: React.MouseEvent) => {
    try {
      localStorage.setItem('quit-smoking:active-custom-bg', defaultBg.url);
      setActiveBgUrl(defaultBg.url);
      window.dispatchEvent(new Event('app-ai-bg-change'));
    } catch {}

    onSelectAppTheme('ai_gradient', defaultBg.title, '✨', e);
  }, [defaultBg.title, defaultBg.url, onSelectAppTheme]);

  const isAiThemeActive = activeAppTheme === 'ai_gradient';

  return (
    <div
      onClick={(e) => applyNebula(e)}
      className={`p-4 sm:p-5 rounded-3xl border transition-all space-y-4 select-none cursor-pointer relative overflow-hidden text-left ${
        isAiThemeActive
          ? 'border-violet-500/80 bg-gradient-to-br from-violet-950/40 via-[#181524] to-[#12111c] shadow-2xl ring-2 ring-violet-500/40'
          : 'border-zinc-800/80 bg-[#15151e]/90 hover:border-zinc-700 hover:bg-[#1a1a26]'
      }`}
    >
      {/* Background ambient decorative light */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500/30 to-purple-600/20 text-violet-300 border border-violet-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-violet-950/40">
            <Sparkles className="w-5 h-5 text-violet-300 animate-pulse" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-zinc-100 flex items-center gap-2">
              <span>{defaultBg.title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 font-bold">
                Динамічний AI Фон
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {defaultBg.subtitle} • Глибоке неонове занурення
            </p>
          </div>
        </div>

        {isAiThemeActive ? (
          <span className="px-2.5 py-1 rounded-full bg-violet-500 text-white text-[10px] font-black flex items-center gap-1 shadow-md shadow-violet-950/50 shrink-0">
            <Check className="w-3.5 h-3.5" />
            <span>Активна</span>
          </span>
        ) : (
          <span className="text-[11px] text-zinc-400 hover:text-white font-medium transition-colors shrink-0">
            Обрати →
          </span>
        )}
      </div>

      {/* Visual Live Preview Canvas Card */}
      <div className="relative rounded-2xl overflow-hidden h-32 w-full border border-violet-500/30 shadow-inner group">
        <img
          src={defaultBg.url}
          alt={defaultBg.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{
            filter: `brightness(${tuning.brightness}%) blur(${tuning.blur}px)`,
            opacity: tuning.opacity / 100
          }}
          referrerPolicy="no-referrer"
        />
        {/* Soft gradient glass vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d16]/90 via-transparent to-black/30" />

        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs z-10">
          <div className="flex items-center gap-1.5 text-violet-200 font-medium text-[11px] backdrop-blur-md px-2 py-0.5 rounded-lg bg-black/40 border border-violet-500/20">
            <Compass className="w-3.5 h-3.5 text-violet-400" />
            <span>Космічний простір</span>
          </div>

          <span className="text-[10px] font-mono text-zinc-300 backdrop-blur-md px-2 py-0.5 rounded-lg bg-black/40 border border-zinc-700/50">
            Яскр: {tuning.brightness}% • Прозор: {tuning.opacity}%
          </span>
        </div>
      </div>

      {/* Live Fine-Tuning Controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-3.5 rounded-2xl bg-black/50 border border-violet-500/25 space-y-3 relative z-10 backdrop-blur-md"
      >
        <div className="flex items-center justify-between text-xs font-bold text-violet-300 border-b border-violet-500/20 pb-2">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Налаштування вигляду фону</span>
          </div>
          <button
            type="button"
            onClick={handleResetTuning}
            className="text-[10px] text-zinc-400 hover:text-violet-300 flex items-center gap-1 transition-colors cursor-pointer"
            title="Скинути параметри до рекомендованих"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Скинути</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Brightness */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-300">
              <span className="flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-400" />
                <span>Яскравість</span>
              </span>
              <span className="font-mono font-bold text-zinc-200">{tuning.brightness}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="120"
              value={tuning.brightness}
              onChange={(e) => updateTuning('brightness', Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
            />
          </div>

          {/* Blur */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-300">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-cyan-400" />
                <span>Розмиття</span>
              </span>
              <span className="font-mono font-bold text-zinc-200">{tuning.blur} px</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              value={tuning.blur}
              onChange={(e) => updateTuning('blur', Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
            />
          </div>

          {/* Opacity */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-300">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-emerald-400" />
                <span>Прозорість</span>
              </span>
              <span className="font-mono font-bold text-zinc-200">{tuning.opacity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={tuning.opacity}
              onChange={(e) => updateTuning('opacity', Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
