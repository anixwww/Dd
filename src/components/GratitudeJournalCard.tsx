import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Save, 
  CheckCircle2, 
  Trash2, 
  Heart, 
  Pin,
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react';

export interface GratitudeEntry {
  id: string;
  date: string; // YYYY-MM-DD
  formattedDate: string;
  g1: string;
  g2: string;
  g3: string;
  updatedAt: number;
}

const getTodayDateStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getTodayFormattedDate = () => {
  const d = new Date();
  return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
};

const GRATITUDE_JOURNAL_STORAGE_KEY = 'quit-smoking:gratitude-journal-entries';

interface GratitudeJournalCardProps {
  onUpdate?: () => void;
  isDocked?: boolean;
  onDockChange?: (docked: boolean) => void;
  isMinimized?: boolean;
  onMinimizeChange?: (minimized: boolean) => void;
  onOpenModal?: () => void;
  isFullView?: boolean;
}

export const GratitudeJournalCard: React.FC<GratitudeJournalCardProps> = ({ 
  onUpdate, 
  isDocked: _isDocked, 
  onDockChange,
  isMinimized,
  onMinimizeChange,
  onOpenModal,
  isFullView
}) => {
  const todayDateStr = getTodayDateStr();

  const [g1, setG1] = useState('');
  const [g2, setG2] = useState('');
  const [g3, setG3] = useState('');
  const [savedToast, setSavedToast] = useState(false);
  
  const [journalHistory, setJournalHistory] = useState<GratitudeEntry[]>([]);
  const [selectedDateOffset, setSelectedDateOffset] = useState(0); // 0 = today, -1 = yesterday, etc.

  const [reminderTime, setReminderTime] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:gratitude-reminder-time') || '';
    } catch {
      return '';
    }
  });

  const handleSetReminderTime = (time: string) => {
    setReminderTime(time);
    try {
      if (time) {
        localStorage.setItem('quit-smoking:gratitude-reminder-time', time);
      } else {
        localStorage.removeItem('quit-smoking:gratitude-reminder-time');
      }
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  // Load entries
  useEffect(() => {
    try {
      const saved = localStorage.getItem(GRATITUDE_JOURNAL_STORAGE_KEY);
      if (saved) {
        const list: GratitudeEntry[] = JSON.parse(saved);
        setJournalHistory(list);

        const todayEntry = list.find((e) => e.date === todayDateStr);
        if (todayEntry) {
          setG1(todayEntry.g1 || '');
          setG2(todayEntry.g2 || '');
          setG3(todayEntry.g3 || '');
        }
      }
    } catch {}
  }, [todayDateStr]);

  const getDateStrForOffset = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getFormattedDateForOffset = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    if (offset === 0) return 'Сьогодні, ' + d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
    if (offset === -1) return 'Вчора, ' + d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
    return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const formatted = getTodayFormattedDate();
    const entry: GratitudeEntry = {
      id: todayDateStr,
      date: todayDateStr,
      formattedDate: formatted,
      g1: g1.trim(),
      g2: g2.trim(),
      g3: g3.trim(),
      updatedAt: Date.now()
    };

    try {
      const existing = journalHistory.filter((item) => item.date !== todayDateStr);
      const updatedList = [entry, ...existing];
      setJournalHistory(updatedList);
      localStorage.setItem(GRATITUDE_JOURNAL_STORAGE_KEY, JSON.stringify(updatedList));

      // Mark gratitude habit as completed in Mental Health
      const d = new Date();
      const todayKey = `quit-smoking:mental-health-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const savedLogStr = localStorage.getItem(todayKey);
      const log = savedLogStr ? JSON.parse(savedLogStr) : {};

      const hasContent = g1.trim().length > 0 || g2.trim().length > 0 || g3.trim().length > 0;
      log.gratitude = hasContent;

      localStorage.setItem(todayKey, JSON.stringify(log));

      // Notify other components
      window.dispatchEvent(new Event('gratitude-updated'));
      window.dispatchEvent(new Event('storage'));

      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
      onUpdate?.();
    } catch {}
  };

  const handleDeleteEntry = (dateToDelete: string) => {
    try {
      const updatedList = journalHistory.filter((item) => item.date !== dateToDelete);
      setJournalHistory(updatedList);
      localStorage.setItem(GRATITUDE_JOURNAL_STORAGE_KEY, JSON.stringify(updatedList));

      if (dateToDelete === todayDateStr) {
        setG1('');
        setG2('');
        setG3('');

        const d = new Date();
        const todayKey = `quit-smoking:mental-health-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const savedLogStr = localStorage.getItem(todayKey);
        const log = savedLogStr ? JSON.parse(savedLogStr) : {};
        log.gratitude = false;
        localStorage.setItem(todayKey, JSON.stringify(log));

        window.dispatchEvent(new Event('gratitude-updated'));
        window.dispatchEvent(new Event('storage'));
      }

      onUpdate?.();
    } catch {}
  };

  const todayCount = (g1.trim() ? 1 : 0) + (g2.trim() ? 1 : 0) + (g3.trim() ? 1 : 0);
  const nextG = !g1.trim() ? "Записати вдячність №1" : !g2.trim() ? "Записати вдячність №2" : !g3.trim() ? "Записати вдячність №3" : null;

  if (isMinimized) {
    const gratitudePct = Math.min(100, Math.round((todayCount / 3) * 100));

    return (
      <div 
        onClick={() => onMinimizeChange?.(false)}
        className="w-full p-3.5 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/40 border border-amber-400/40 dark:border-amber-500/30 rounded-2xl shadow-2xs relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-md active:scale-[0.98] text-left cursor-pointer group"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 dark:text-[#f4f4f5]">
              Щоденник вдячності
            </h3>
          </div>

          {onDockChange && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDockChange(true);
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center p-1.5 -mr-1 -my-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 cursor-pointer rounded-xl hover:bg-amber-500/15 active:bg-amber-500/25 active:scale-90 transition-all"
                title="Закріпити у плаваючий острівець"
              >
                <Pin className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content & Progress Bar */}
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <span className="text-xs font-bold text-slate-900 dark:text-[#f4f4f5] truncate">
              {todayCount >= 3 ? '🎉 Щоденник на сьогодні заповнено!' : `✍️ ${nextG}`}
            </span>
            <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-300 shrink-0">
              {todayCount} з 3
            </span>
          </div>

          <div>
            <div className="w-full h-2 bg-slate-200/80 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-amber-500/20">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  todayCount >= 3
                    ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 animate-pulse'
                    : 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500'
                }`}
                style={{ width: `${gratitudePct}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1 text-[10px]">
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                {todayCount >= 3 ? 'Фокус на ресурсах 100%' : '3 приводи для радості'}
              </span>
              <span className="font-bold font-mono text-amber-600 dark:text-amber-400">
                {gratitudePct}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentViewingDateStr = getDateStrForOffset(selectedDateOffset);
  const selectedPastEntry = journalHistory.find(e => e.date === currentViewingDateStr);

  return (
    <div className="w-full text-left space-y-4">
      {/* 1. Calendar Date Navigation Carousel (Гортання вліво / вправо) */}
      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setSelectedDateOffset(prev => prev - 1)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors active:scale-95 flex items-center gap-1 text-xs font-semibold shrink-0"
          title="Попередній день"
        >
          <ChevronLeft className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline text-zinc-300">Раніше</span>
        </button>

        <div className="text-center min-w-0 flex-1">
          <div className="text-xs font-bold text-amber-400 font-mono flex items-center justify-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{getFormattedDateForOffset(selectedDateOffset)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {selectedDateOffset < 0 && (
            <button
              type="button"
              onClick={() => setSelectedDateOffset(0)}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
            >
              Сьогодні
            </button>
          )}
          <button
            type="button"
            onClick={() => setSelectedDateOffset(prev => Math.min(0, prev + 1))}
            disabled={selectedDateOffset >= 0}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white cursor-pointer transition-colors active:scale-95 flex items-center gap-1 text-xs font-semibold"
            title="Наступний день"
          >
            <span className="hidden sm:inline text-zinc-300">Пізніше</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* 2. Mode Display */}
      {selectedDateOffset === 0 ? (
        /* TODAY'S GRATITUDE INPUT FORM */
        <div className="space-y-4">
          {/* Progress Badge (Без дати в дужках) */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-400 fill-amber-400/30" />
              <span className="text-xs font-semibold text-zinc-200">
                Заповнено за сьогодні:
              </span>
            </div>
            <span className="text-xs font-bold font-mono px-2 py-0.5 bg-amber-500 text-white rounded-full">
              {todayCount}/3
            </span>
          </div>

          {/* Нагадування від Аналізатора */}
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-left">
              <span className="text-base shrink-0 select-none">⏰</span>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-zinc-200 block">
                  Нагадування від Аналізатора:
                </span>
                <span className="text-[10px] text-zinc-400 block leading-snug">
                  Запитуватиме про вдячність щодня у вказаний час
                </span>
              </div>
            </div>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => handleSetReminderTime(e.target.value)}
              className="bg-black/40 text-xs text-purple-300 rounded-xl px-2.5 py-1.5 border border-purple-500/30 focus:outline-none focus:ring-1 focus:ring-purple-500 shrink-0"
            />
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-mono">1</span>
                <span>За що ви вдячні перш за все?</span>
              </label>
              <input
                type="text"
                value={g1}
                onChange={(e) => setG1(e.target.value)}
                placeholder="Наприклад: За теплу каву та сонячний ранок..."
                className="w-full bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-amber-500/30 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-mono">2</span>
                <span>Хто або що порадувало вас сьогодні?</span>
              </label>
              <input
                type="text"
                value={g2}
                onChange={(e) => setG2(e.target.value)}
                placeholder="Наприклад: Підтримка друга / комплімент від колеги..."
                className="w-full bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-amber-500/30 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-mono">3</span>
                <span>Яку дрібничку ви зробили для себе чи інших?</span>
              </label>
              <input
                type="text"
                value={g3}
                onChange={(e) => setG3(e.target.value)}
                placeholder="Наприклад: Випив(ла) воду та зробив(ла) розтяжку..."
                className="w-full bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-amber-500/30 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
              />
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className={`px-6 py-2.5 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 ${
                  savedToast
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                {savedToast ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Збережено ✨</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Зберегти</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* PAST DATE VIEW */
        <div className="space-y-3">
          {selectedPastEntry ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                  <span>📖 Запис за</span>
                  <span>{selectedPastEntry.formattedDate || selectedPastEntry.date}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteEntry(selectedPastEntry.date)}
                  className="p-1 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Видалити запис"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-zinc-200">
                {selectedPastEntry.g1 && (
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-amber-400 font-bold block mb-0.5">1. Перш за все:</span>
                    <span>{selectedPastEntry.g1}</span>
                  </div>
                )}
                {selectedPastEntry.g2 && (
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-amber-400 font-bold block mb-0.5">2. Радість дня:</span>
                    <span>{selectedPastEntry.g2}</span>
                  </div>
                )}
                {selectedPastEntry.g3 && (
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-amber-400 font-bold block mb-0.5">3. Дрібничка дня:</span>
                    <span>{selectedPastEntry.g3}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] space-y-2">
              <p className="text-xs text-zinc-400 italic">
                📝 За цей день немає збережених записів вдячності.
              </p>
              <button
                type="button"
                onClick={() => setSelectedDateOffset(0)}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Перейти до сьогодні
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
