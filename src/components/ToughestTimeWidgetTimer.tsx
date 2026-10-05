import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Flame,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  Timer
} from 'lucide-react';
import { CravingLogEntry } from './ToughestTimeSection';

interface ToughestTimeWidgetTimerProps {
  className?: string;
  onOpenDialog?: () => void;
}

export const ToughestTimeWidgetTimer: React.FC<ToughestTimeWidgetTimerProps> = ({
  className = '',
  onOpenDialog
}) => {
  const [now, setNow] = useState<number>(Date.now());
  const [isUrgeTimerActive, setIsUrgeTimerActive] = useState<boolean>(false);
  const [urgeSecondsLeft, setUrgeSecondsLeft] = useState<number>(420); // 7 minutes = 420 seconds default
  const [totalUrgeSeconds, setTotalUrgeSeconds] = useState<number>(420);
  const [isUrgeRunning, setIsUrgeRunning] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Update clock
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for open urge timer event
  useEffect(() => {
    const handleOpen = () => {
      setIsModalOpen(true);
      setIsUrgeTimerActive(true);
      setIsUrgeRunning(true);
    };
    window.addEventListener('open-urge-surfing-timer', handleOpen);
    return () => window.removeEventListener('open-urge-surfing-timer', handleOpen);
  }, []);

  // Active urge surfing countdown
  useEffect(() => {
    if (!isUrgeRunning) return;
    const timer = setInterval(() => {
      setUrgeSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsUrgeRunning(false);
          // Play celebration sound or vibrate
          if (navigator.vibrate) try { navigator.vibrate([100, 50, 100]); } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isUrgeRunning]);

  // Compute countdown to next scheduled tough time window
  const nextToughTimeInfo = useMemo(() => {
    let logs: CravingLogEntry[] = [];
    try {
      const saved = localStorage.getItem('quit-smoking:toughest-time-logs');
      if (saved) logs = JSON.parse(saved);
    } catch {}

    const d = new Date(now);
    const currentMinutes = d.getHours() * 60 + d.getMinutes();

    // Default peak hours if no logs: 08:30 (Morning), 14:00 (After lunch), 18:30 (Evening), 21:30 (Night)
    const targetHoursMinutes = [
      8 * 60 + 30,
      14 * 60,
      18 * 60 + 30,
      21 * 60 + 30
    ];

    // Add hours from logs
    logs.forEach((l) => {
      const parts = l.timeStr.split(':');
      const h = parseInt(parts[0], 10) || 0;
      const m = parseInt(parts[1], 10) || 0;
      const minVal = h * 60 + m;
      if (!targetHoursMinutes.includes(minVal)) {
        targetHoursMinutes.push(minVal);
      }
    });

    targetHoursMinutes.sort((a, b) => a - b);

    // Find next upcoming
    let nextTarget = targetHoursMinutes.find((tm) => tm > currentMinutes);
    let diffMinutes = 0;
    let isTomorrow = false;

    if (nextTarget !== undefined) {
      diffMinutes = nextTarget - currentMinutes;
    } else {
      // Wraparound to first target tomorrow
      nextTarget = targetHoursMinutes[0] || (8 * 60 + 30);
      diffMinutes = (24 * 60 - currentMinutes) + nextTarget;
      isTomorrow = true;
    }

    const targetH = Math.floor(nextTarget / 60);
    const targetM = nextTarget % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const timeStr = `${pad(targetH)}:${pad(targetM)}`;

    const hDiff = Math.floor(diffMinutes / 60);
    const mDiff = diffMinutes % 60;
    const sDiff = 59 - d.getSeconds();

    const formattedCountdown = hDiff > 0 
      ? `${hDiff} год ${mDiff} хв` 
      : `${mDiff} хв ${pad(sDiff)} с`;

    return {
      timeStr,
      formattedCountdown,
      isClose: diffMinutes <= 30
    };
  }, [now]);

  // Urge wave phase text
  const urgePhase = useMemo(() => {
    const passedSec = totalUrgeSeconds - urgeSecondsLeft;
    const pct = (passedSec / totalUrgeSeconds) * 100;
    if (pct < 25) {
      return { label: '1. Хвиля підіймається', color: 'text-amber-400', bar: 'from-amber-500 to-orange-500' };
    } else if (pct < 65) {
      return { label: '2. Пік тяги (дихай глибоко)', color: 'text-rose-400', bar: 'from-orange-500 to-rose-500' };
    } else if (pct < 100) {
      return { label: '3. Хвиля спадає', color: 'text-teal-400', bar: 'from-rose-500 to-teal-500' };
    } else {
      return { label: '4. Перемога! Тяга розсіялась', color: 'text-emerald-400', bar: 'from-teal-500 to-emerald-500' };
    }
  }, [urgeSecondsLeft, totalUrgeSeconds]);

  return (
    <>
      {/* COMPACT TRIGGER CARD FOR TIMER TAB / UI */}
      <div className={`p-2.5 sm:p-3 rounded-xl bg-black/40 border border-amber-500/25 shadow-xs flex items-center justify-between gap-2.5 text-left transition-all ${className}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center justify-center flex-none">
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-100 truncate">
                Хвиля тяги
              </span>
              {nextToughTimeInfo.isClose && (
                <span className="text-[8.5px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.2 rounded-md">
                  Увага
                </span>
              )}
            </div>
            <div className="text-[10.5px] font-mono font-medium text-amber-300/90">
              залишилось {nextToughTimeInfo.formattedCountdown}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            setIsUrgeRunning(true);
          }}
          className="px-2.5 py-1.5 rounded-lg bg-zinc-800/90 hover:bg-zinc-700/90 text-zinc-100 border border-zinc-700/80 font-bold text-[11px] flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer flex-none"
        >
          <Timer className="w-3.5 h-3.5 text-amber-400" />
          <span>Таймер хвилі</span>
        </button>
      </div>

      {/* FULL SCREEN / MODAL URGE SURFING TIMER */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[650] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-[#12131a] border border-zinc-800/90 rounded-3xl p-5 shadow-2xl text-zinc-100 relative space-y-4 animate-in zoom-in-95 duration-200 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Таймер витримки тяги (Urge Surfing)</span>
              </span>
              <h3 className="text-base font-extrabold text-white">
                {urgePhase.label}
              </h3>
            </div>

            {/* BIG DIGITS TIMER */}
            <div className="relative py-6 bg-zinc-950/70 rounded-3xl border border-zinc-800/80 space-y-2">
              <div className="text-4xl font-black font-mono tracking-tight text-white">
                {Math.floor(urgeSecondsLeft / 60)}:{String(urgeSecondsLeft % 60).padStart(2, '0')}
              </div>

              {/* Progress Bar */}
              <div className="w-48 mx-auto h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${urgePhase.bar} transition-all duration-1000`}
                  style={{
                    width: `${Math.round(((totalUrgeSeconds - urgeSecondsLeft) / totalUrgeSeconds) * 100)}%`
                  }}
                />
              </div>

              <span className="text-[10px] text-zinc-400 font-mono block">
                Пік триває до 5-7 хв і природно спадає
              </span>
            </div>

            {/* CONTROLS */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsUrgeRunning(!isUrgeRunning)}
                className={`py-3 px-6 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isUrgeRunning
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-lg'
                }`}
              >
                {isUrgeRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isUrgeRunning ? 'Пауза' : 'Продовжити'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUrgeSecondsLeft(totalUrgeSeconds);
                  setIsUrgeRunning(false);
                }}
                className="p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                title="Скинути таймер"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* ACTION FOOTER */}
            {urgeSecondsLeft === 0 ? (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 space-y-2">
                <div className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>7 хвилин витримано! Тяга розсіялась! 🏆</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs cursor-pointer"
                >
                  Закрити
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  if (onOpenDialog) onOpenDialog();
                }}
                className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 hover:text-amber-200 text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Відкрити Діалог самодопомоги</span>
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
