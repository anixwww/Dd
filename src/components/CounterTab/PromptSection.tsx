import React, { useState, useEffect } from 'react';
import { Sword, Minimize2, Pin, Maximize2, Sliders } from 'lucide-react';
import { PromptIntervalModal } from './PromptIntervalModal';

interface PromptSectionProps {
  startDate: number;
  quickGoalNow: number;
  isPromptCompact: boolean;
  setIsPromptCompact: (compact: boolean) => void;
  setIsPromptDocked: (docked: boolean) => void;
}

export const PromptSection = React.memo(({
  startDate,
  quickGoalNow,
  isPromptCompact,
  setIsPromptCompact,
  setIsPromptDocked,
}: PromptSectionProps) => {
  const [isIntervalModalOpen, setIsIntervalModalOpen] = useState(false);
  const [localInterval, setLocalInterval] = useState<number>(() => {
    try {
      const v = localStorage.getItem('quit-smoking:prompt-interval-min');
      if (v !== null) {
        const n = Number(v);
        if (!isNaN(n)) return n;
      }
    } catch {}
    return 30;
  });

  const [lastPromptTime, setLastPromptTime] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('quit-smoking:last-prompt') || 0);
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const handleIntervalChange = () => {
      try {
        const v = localStorage.getItem('quit-smoking:prompt-interval-min');
        if (v !== null) {
          const n = Number(v);
          if (!isNaN(n)) setLocalInterval(n);
        }
        setLastPromptTime(Number(localStorage.getItem('quit-smoking:last-prompt') || 0));
      } catch {}
    };

    window.addEventListener('prompt-interval-change', handleIntervalChange);
    window.addEventListener('storage', handleIntervalChange);
    return () => {
      window.removeEventListener('prompt-interval-change', handleIntervalChange);
      window.removeEventListener('storage', handleIntervalChange);
    };
  }, []);

  const [nowTime, setNowTime] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNowTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const intervalMin = localInterval;
  let lastPrompt = lastPromptTime;

  if (lastPrompt === 0) {
    lastPrompt = nowTime;
    try {
      localStorage.setItem('quit-smoking:last-prompt', String(nowTime));
    } catch {}
  }

  const isPromptDisabled = intervalMin === 0;
  const intervalMs = Math.max(1, intervalMin * 60 * 1000);
  const targetTime = lastPrompt + intervalMs;
  const timeLeftMs = isPromptDisabled ? 0 : Math.max(0, targetTime - nowTime);
  const elapsedMs = isPromptDisabled ? intervalMs : Math.min(intervalMs, Math.max(0, intervalMs - timeLeftMs));
  const pct = isPromptDisabled ? 100 : Math.min(100, Math.floor((elapsedMs / intervalMs) * 100));

  const totalSecs = Math.floor(timeLeftMs / 1000);
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const isReady = timeLeftMs <= 0 && !isPromptDisabled;
  const timeFormatted = `${pad(m)}:${pad(s)}`;
  const timeTextDisplay = isPromptDisabled
    ? 'Ручний режим'
    : isReady
      ? '0'
      : `через ${m > 0 ? `${m} хв ` : ''}${s} с (${timeFormatted})`;

  const handleSelectInterval = (newMinutes: number) => {
    setLocalInterval(newMinutes);
    const now = Date.now();
    setLastPromptTime(now);
    try {
      localStorage.setItem('quit-smoking:prompt-interval-min', String(newMinutes));
      localStorage.setItem('quit-smoking:last-prompt', String(now));
      
      const rawSettings = localStorage.getItem('quit-smoking:analyzer-dialogue-settings');
      if (rawSettings) {
        const parsed = JSON.parse(rawSettings);
        parsed.sliceIntervalMinutes = newMinutes;
        localStorage.setItem('quit-smoking:analyzer-dialogue-settings', JSON.stringify(parsed));
      }

      window.dispatchEvent(new Event('prompt-interval-change'));
      window.dispatchEvent(new Event('analyzer-dialogue-settings-changed'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const handleSetNextPromptIn = (inMinutes: number) => {
    // If inMinutes === 0, trigger immediate prompt
    const now = Date.now();
    const effectiveIntervalMin = intervalMin > 0 ? intervalMin : 30;
    const effectiveIntervalMs = effectiveIntervalMin * 60 * 1000;
    const desiredTargetTime = now + inMinutes * 60 * 1000;
    const computedLastPrompt = desiredTargetTime - effectiveIntervalMs;

    setLastPromptTime(computedLastPrompt);
    try {
      localStorage.setItem('quit-smoking:last-prompt', String(computedLastPrompt));
      window.dispatchEvent(new Event('prompt-interval-change'));
      window.dispatchEvent(new Event('storage'));
    } catch {}

    if (inMinutes === 0) {
      window.dispatchEvent(new Event('open-intermediate-prompt'));
    }
  };

  if (isPromptCompact) {
    return (
      <>
        <div 
          onClick={() => {
            window.dispatchEvent(new Event('open-intermediate-prompt'));
          }}
          className="mt-3 p-2.5 px-3.5 bg-gradient-to-r from-teal-500/15 via-emerald-500/10 to-indigo-500/15 dark:from-teal-950/40 dark:via-emerald-950/30 dark:to-indigo-950/40 border border-teal-400/35 dark:border-teal-500/25 rounded-2xl shadow-2xs flex items-center justify-between cursor-pointer hover:border-teal-500/60 transition-all text-white"
        >
          <div className="flex items-center gap-2">
            <Sword className="w-4 h-4 text-teal-400 shrink-0 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">Зріз</span>
            <span className="text-[11px] font-mono font-bold text-teal-300 bg-teal-500/25 px-2 py-0.5 rounded-lg border border-teal-400/30">
              {isPromptDisabled ? 'Ручний' : isReady ? 'Зараз' : timeFormatted}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsIntervalModalOpen(true);
              }}
              className="text-[10px] font-semibold text-teal-300 hover:text-white bg-teal-500/20 hover:bg-teal-500/40 px-2 py-0.5 rounded-lg border border-teal-400/30 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
              title="Натисніть щоб змінити час або інтервал"
            >
              <span>{intervalMin > 0 ? `${intervalMin}хв` : 'Ручний'}</span>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPromptCompact(false);
                try {
                  localStorage.setItem('quit-smoking:prompt-compact', 'false');
                  window.dispatchEvent(new Event('prompt-compact-change'));
                } catch {}
              }}
              className="p-1 text-teal-300 hover:text-white cursor-pointer rounded-lg hover:bg-teal-500/20 transition-colors"
              title="Розгорнути"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPromptDocked(true);
                try {
                  localStorage.setItem('quit-smoking:prompt-docked', 'true');
                  window.dispatchEvent(new Event('prompt-docked-change'));
                  window.dispatchEvent(new Event('storage'));
                } catch {}
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center p-1.5 -mr-1 -my-1 text-teal-300 hover:text-white cursor-pointer rounded-xl hover:bg-teal-500/25 active:bg-teal-500/40 active:scale-90 transition-all"
              title="Закріпити в індикатори"
            >
              <Pin className="w-4 h-4" />
            </button>
          </div>
        </div>

        <PromptIntervalModal
          isOpen={isIntervalModalOpen}
          onClose={() => setIsIntervalModalOpen(false)}
          currentIntervalMin={intervalMin}
          onSelectInterval={handleSelectInterval}
          onSetNextPromptIn={handleSetNextPromptIn}
        />
      </>
    );
  }

  return (
    <>
      <div 
        onClick={() => {
          window.dispatchEvent(new Event('open-intermediate-prompt'));
        }}
        className="mt-3 p-3.5 bg-gradient-to-r from-teal-500/15 via-emerald-500/10 to-indigo-500/15 dark:from-teal-950/40 dark:via-emerald-950/30 dark:to-indigo-950/40 border border-teal-400/35 dark:border-teal-500/25 rounded-2xl shadow-2xs relative overflow-hidden transition-all duration-300 cursor-pointer hover:border-teal-500/60 hover:scale-[1.01] active:scale-[0.99] text-white"
      >
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-teal-400/20 dark:bg-teal-500/15 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between mb-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-xs">
              <Sword className="w-3.5 h-3.5 fill-white/20" />
            </div>
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span>Зріз</span>
                <span className="text-[10px] font-mono font-bold text-teal-300 bg-teal-500/25 px-2 py-0.5 rounded-md border border-teal-400/30">
                  {isPromptDisabled ? 'Ручний' : isReady ? 'Зараз' : timeFormatted}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsIntervalModalOpen(true);
                  }}
                  className="text-[9px] font-semibold bg-teal-500/25 hover:bg-teal-500/40 text-teal-200 hover:text-white px-2 py-0.5 rounded-full border border-teal-400/40 transition-all cursor-pointer flex items-center gap-1 group/btn shadow-xs active:scale-95"
                  title="Натисніть щоб змінити час появи або інтервал наступного зрізу"
                >
                  <span>{intervalMin > 0 ? `${intervalMin}хв` : 'Ручний'}</span>
                  
                </button>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPromptCompact(true);
                try {
                  localStorage.setItem('quit-smoking:prompt-compact', 'true');
                  window.dispatchEvent(new Event('prompt-compact-change'));
                } catch {}
              }}
              className="p-1 text-slate-400 hover:text-teal-300 cursor-pointer rounded-lg hover:bg-teal-500/20 transition-colors"
              title="Мінімізувати в один рядок"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPromptDocked(true);
                try {
                  localStorage.setItem('quit-smoking:prompt-docked', 'true');
                  window.dispatchEvent(new Event('prompt-docked-change'));
                  window.dispatchEvent(new Event('storage'));
                } catch {}
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center p-1.5 -mr-1 -my-1 text-slate-400 hover:text-teal-300 cursor-pointer rounded-xl hover:bg-teal-500/25 active:bg-teal-500/40 active:scale-90 transition-all"
              title="Закріпити в індикатори"
            >
              <Pin className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative z-10 space-y-1.5 mt-2">
          <div className="w-full h-1.5 bg-slate-200/80 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 rounded-full transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-teal-200/80 font-medium">
            <span>
              {isPromptDisabled 
                ? 'Оцінка стану (на вимогу)' 
                : isReady 
                  ? '0' 
                  : `До наступного зрізу: ${totalSecs < 60 ? `${totalSecs} сек.` : `${m > 0 ? `${m} хв ` : ''}${s} с`}`}
            </span>
            <span>{isPromptDisabled ? '100%' : `${pct}%`}</span>
          </div>
        </div>
      </div>

      <PromptIntervalModal
        isOpen={isIntervalModalOpen}
        onClose={() => setIsIntervalModalOpen(false)}
        currentIntervalMin={intervalMin}
        onSelectInterval={handleSelectInterval}
        onSetNextPromptIn={handleSetNextPromptIn}
      />
    </>
  );
});

PromptSection.displayName = 'PromptSection';
