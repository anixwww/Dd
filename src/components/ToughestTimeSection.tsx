import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Flame,
  Zap,
  Clock,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Waves,
  Activity,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { CravingWaveAnalytics } from './CravingWaveAnalytics';

export interface CravingLogEntry {
  id: string;
  timestamp: number;
  dateStr: string;
  timeStr: string;
  type: 'spike' | 'window';
  endTimeStr?: string;
  durationMinutes: number;
  intensity: number; // 1 to 10
}

interface ToughestTimeSectionProps {
  onOpenDialog?: () => void;
  onOpenUrgeTimer?: () => void;
  onBack?: () => void;
  isEmbeddedInState?: boolean;
}

export const ToughestTimeSection: React.FC<ToughestTimeSectionProps> = ({
  onBack,
  onOpenUrgeTimer,
  isEmbeddedInState = false
}) => {
  const [logs, setLogs] = useState<CravingLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:toughest-time-logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    const now = Date.now();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    return [
      {
        id: 'init_1',
        timestamp: now - 3600 * 1000 * 4,
        dateStr,
        timeStr: '14:30',
        type: 'spike',
        durationMinutes: 10,
        intensity: 8
      },
      {
        id: 'init_2',
        timestamp: now - 3600 * 1000 * 24,
        dateStr,
        timeStr: '19:00',
        endTimeStr: '20:15',
        type: 'window',
        durationMinutes: 75,
        intensity: 7
      }
    ];
  });

  const saveLogs = useCallback((newLogs: CravingLogEntry[]) => {
    setLogs(newLogs);
    try {
      localStorage.setItem('quit-smoking:toughest-time-logs', JSON.stringify(newLogs));
      window.dispatchEvent(new CustomEvent('toughest-time-logs-updated', { detail: newLogs }));
      window.dispatchEvent(new CustomEvent('cravings-updated', { detail: newLogs }));
    } catch {}
  }, []);

  // Ensure default logs are persisted to localStorage if empty
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:toughest-time-logs');
      if (!saved && logs.length > 0) {
        localStorage.setItem('quit-smoking:toughest-time-logs', JSON.stringify(logs));
        window.dispatchEvent(new CustomEvent('toughest-time-logs-updated', { detail: logs }));
        window.dispatchEvent(new CustomEvent('cravings-updated', { detail: logs }));
      }
    } catch {}
  }, []);

  const [entryType, setEntryType] = useState<'spike' | 'window'>('spike');
  const [customTime, setCustomTime] = useState<string>(() => {
    const d = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [customEndTime, setCustomEndTime] = useState<string>('20:00');
  const [intensity, setIntensity] = useState<number>(7);
  const [durationMinutes, setDurationMinutes] = useState<number>(10);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSaveEntry = () => {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const newEntry: CravingLogEntry = {
      id: `craving_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      dateStr,
      timeStr: customTime,
      type: entryType,
      endTimeStr: entryType === 'window' ? customEndTime : undefined,
      durationMinutes: entryType === 'spike' ? durationMinutes : 60,
      intensity
    };

    const updated = [newEntry, ...logs];
    saveLogs(updated);
    showToast(entryType === 'spike' ? 'Точковий сплеск зафіксовано' : 'Період тяги зафіксовано');
  };

  const handleDeleteEntry = (id: string) => {
    const updated = logs.filter((l) => l.id !== id);
    saveLogs(updated);
    showToast('Запис видалено');
  };

  const handleLaunchUrgeTimer = () => {
    if (onOpenUrgeTimer) onOpenUrgeTimer();
    window.dispatchEvent(new CustomEvent('open-urge-surfing-timer'));
  };

  const getIntensityLabel = (val: number) => {
    if (val >= 8) return 'Критична';
    if (val >= 5) return 'Помітна';
    return 'Легка';
  };

  return (
    <div className="space-y-4 text-zinc-100 text-left select-none">
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs rounded-2xl shadow-2xl border border-amber-300 animate-fadeIn">
          {toastMsg}
        </div>
      )}

      {/* Main Container Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#14141c]/95 border border-zinc-800/80 shadow-2xl space-y-4 backdrop-blur-xl relative overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Hero Card */}
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/30 to-rose-600/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-amber-950/40">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-zinc-100 tracking-tight">
                  Хвиля тяги
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Піки & Спайки
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                Фіксація точкових сплесків, часових вікон та біоритмічна аналітика
              </p>
            </div>
          </div>

          {/* Quick Urge Surfing Timer Launch Button */}
          <button
            type="button"
            onClick={handleLaunchUrgeTimer}
            className="py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-md shadow-amber-950/30 shrink-0"
            title="Запустити дихальний таймер серфінгу тяги"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-[11px] hidden xs:inline">Серфінг тяги</span>
          </button>
        </div>

        {/* Format Switcher: Spike vs Window */}
        <div className="p-1 rounded-2xl bg-black/60 border border-zinc-800/80 grid grid-cols-2 gap-1 text-xs relative z-10 shadow-inner">
          <button
            type="button"
            onClick={() => setEntryType('spike')}
            className={`py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              entryType === 'spike'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-950/60 font-black'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>Точковий сплеск</span>
          </button>

          <button
            type="button"
            onClick={() => setEntryType('window')}
            className={`py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              entryType === 'window'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-950/60 font-black'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>Період тяги</span>
          </button>
        </div>

        {/* Main Parameters Form Surface */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-zinc-800/80 space-y-3.5 relative z-10 backdrop-blur-md">
          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-300 font-bold block">
                {entryType === 'window' ? 'Час початку:' : 'Час сплеску:'}
              </label>
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
              />
            </div>

            {entryType === 'window' ? (
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-300 font-bold block">Час завершення:</label>
                <input
                  type="time"
                  value={customEndTime}
                  onChange={(e) => setCustomEndTime(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-300 font-bold block">Тривалість:</label>
                <div className="grid grid-cols-4 gap-1">
                  {[5, 10, 15, 30].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDurationMinutes(m)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                        durationMinutes === m
                          ? 'bg-amber-400 text-black font-black shadow-md shadow-amber-950/40'
                          : 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {m}хв
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Intensity Range Slider */}
          <div className="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-zinc-300 text-[11px]">Інтенсивність тяги:</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    intensity >= 8
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                      : intensity >= 5
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {getIntensityLabel(intensity)}
                </span>
                <span className="font-mono font-black text-white text-xs px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700 shadow-xs">
                  {intensity} / 10
                </span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
              className="touch-range-slider w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>1 (Легка)</span>
              <span>5 (Помітна)</span>
              <span>10 (Критична)</span>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSaveEntry}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-black text-xs font-black transition-all cursor-pointer shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span>{entryType === 'spike' ? 'Зафіксувати точковий сплеск' : 'Зафіксувати період тяги'}</span>
          </button>
        </div>

        {/* Craving Wave Analytics: 7-Day Duration & Spikes, 24h Multi-Period Overlay, Personal Pattern */}
        <div className="pt-1">
          <CravingWaveAnalytics logs={logs} />
        </div>

        {/* History of Saved Entries */}
        <div className="space-y-2.5 pt-2 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-zinc-300 flex items-center gap-1.5 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Історія хвиль тяги ({logs.length}):</span>
            </span>
          </div>

          {logs.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-black/30 border border-zinc-800 text-zinc-500 text-xs">
              Поки немає записів. Зафіксуйте свій перший сплеск або період!
            </div>
          ) : (
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {logs.slice(0, 15).map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-2xl bg-black/40 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
                        log.type === 'spike'
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                          : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                      }`}
                    >
                      {log.type === 'spike' ? <Zap className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-zinc-200 font-mono text-xs truncate">
                        {log.timeStr} {log.endTimeStr ? `– ${log.endTimeStr}` : `(${log.durationMinutes} хв)`}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {log.type === 'spike' ? 'Сплеск' : 'Період'} • {log.dateStr}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
                        log.intensity >= 8
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : log.intensity >= 5
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {log.intensity}/10
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteEntry(log.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                      title="Видалити"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button (Only if not embedded in State) */}
        {!isEmbeddedInState && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Назад до Швидких Механік
          </button>
        )}
      </div>
    </div>
  );
};
