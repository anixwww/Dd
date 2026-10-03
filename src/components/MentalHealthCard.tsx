import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Heart, 
  Sparkles, 
  Trash2, 
  Check, 
  Info, 
  Pin
} from 'lucide-react';

export interface DopamineHabit {
  id: string;
  title: string;
  category: 'social' | 'body' | 'mind' | 'sensory';
  icon: string;
  type: 'counter' | 'checkbox';
  targetCount?: number;
  currentCount?: number;
  completed?: boolean;
  description: string;
  isCustom?: boolean;
  scheduledTime?: string;
}

const DEFAULT_HABITS: DopamineHabit[] = [
  {
    id: 'hugs',
    title: 'Обійми або погладити тваринку',
    category: 'social',
    icon: '🤗',
    type: 'checkbox',
    completed: false,
    description: 'Вивільняє окситоцин та знижує рівень кортизолу (стресу).'
  },
  {
    id: 'gratitude',
    title: 'Щоденник вдячності (3 моменти)',
    category: 'mind',
    icon: '📝',
    type: 'checkbox',
    completed: false,
    description: 'Фокус на приємних ресурсах та дофаміновому балансі.'
  },
  {
    id: 'chat',
    title: 'Душевна розмова з близькими',
    category: 'social',
    icon: '💬',
    type: 'checkbox',
    completed: false,
    description: 'Соціальний контакт вивільняє серотонін та знімає напругу.'
  },
  {
    id: 'cold_splash',
    title: 'Контрастний душ або прохолодна вода',
    category: 'body',
    icon: '❄️',
    type: 'checkbox',
    completed: false,
    description: 'Стимуляція блукаючого нерва дає природний стрибок дофаміну.'
  },
  {
    id: 'sun_walk',
    title: '15-20 хвилин на сонці / прогулянка',
    category: 'body',
    icon: '☀️',
    type: 'checkbox',
    completed: false,
    description: 'Денне світло активує синтез серотоніну та циркадні ритми.'
  },
  {
    id: 'music',
    title: 'Улюблена музика для настрою',
    category: 'sensory',
    icon: '🎧',
    type: 'checkbox',
    completed: false,
    description: 'Музика активує систему винагороди мозку.'
  },
  {
    id: 'dark_chocolate',
    title: 'Чорний шоколад (>70%) або горіхи',
    category: 'sensory',
    icon: '🍫',
    type: 'checkbox',
    completed: false,
    description: 'Фенілетиламін та магній для м\'якого підйому настрою.'
  },
  {
    id: 'breathing',
    title: '2 хвилини глибокого дихання',
    category: 'mind',
    icon: '🫁',
    type: 'checkbox',
    completed: false,
    description: 'Вмикає парасимпатичну нервову систему і заспокоює.'
  },
  {
    id: 'micro_win',
    title: '1 мікро-перемога (прибрати стіл / ліжко)',
    category: 'mind',
    icon: '✨',
    type: 'checkbox',
    completed: false,
    description: 'Завершення маленької справи дає природний дофаміновий бонус.'
  },
  {
    id: 'smile',
    title: 'Щира посмішка або кумедне відео',
    category: 'mind',
    icon: '😄',
    type: 'checkbox',
    completed: false,
    description: 'Ендорфіновий сплеск розслабляє мімічні м\'язи.'
  }
];

const getTodayKey = () => {
  const d = new Date();
  return `quit-smoking:mental-health-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const HABITS_STORAGE_KEY = 'quit-smoking:mental-health-habits-config';
const SHOW_INDICATOR_KEY = 'quit-smoking:mental-health-show-indicator';

interface MentalHealthCardProps {
  onUpdate?: () => void;
  isDocked?: boolean;
  onDockChange?: (docked: boolean) => void;
  isMinimized?: boolean;
  onMinimizeChange?: (minimized: boolean) => void;
  onOpenModal?: () => void;
  isFullView?: boolean;
}

export const MentalHealthCard: React.FC<MentalHealthCardProps> = ({ 
  onUpdate, 
  onDockChange,
}) => {
  const todayKey = getTodayKey();

  const [habitConfigs, setHabitConfigs] = useState<DopamineHabit[]>(() => {
    try {
      const saved = localStorage.getItem(HABITS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_HABITS;
  });

  const [todayLog, setTodayLog] = useState<Record<string, any>>(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      const log = saved ? JSON.parse(saved) : {};

      const d = new Date();
      const todayDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const savedEntries = localStorage.getItem('quit-smoking:gratitude-journal-entries');
      if (savedEntries) {
        const list = JSON.parse(savedEntries);
        const todayEntry = Array.isArray(list) ? list.find((e: any) => e.date === todayDateStr) : null;
        if (todayEntry && (todayEntry.g1?.trim() || todayEntry.g2?.trim() || todayEntry.g3?.trim())) {
          log.gratitude = true;
        }
      }

      return log;
    } catch {}
    return {};
  });

  useEffect(() => {
    const handleGratitudeSync = () => {
      try {
        const saved = localStorage.getItem(todayKey);
        if (saved) setTodayLog(JSON.parse(saved));
      } catch {}
    };

    window.addEventListener('gratitude-updated', handleGratitudeSync);
    window.addEventListener('storage', handleGratitudeSync);

    return () => {
      window.removeEventListener('gratitude-updated', handleGratitudeSync);
      window.removeEventListener('storage', handleGratitudeSync);
    };
  }, [todayKey]);

  const [showIndicator, setShowIndicator] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SHOW_INDICATOR_KEY);
      if (saved !== null) return saved === 'true';
    } catch {}
    return true;
  });

  const [showTip, setShowTip] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [expandedInfoId, setExpandedInfoId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habitConfigs));
    } catch {}
  }, [habitConfigs]);

  useEffect(() => {
    try {
      localStorage.setItem(todayKey, JSON.stringify(todayLog));
    } catch {}
  }, [todayLog, todayKey]);

  useEffect(() => {
    try {
      localStorage.setItem(SHOW_INDICATOR_KEY, showIndicator.toString());
    } catch {}
  }, [showIndicator]);

  const totalWeight = habitConfigs.length;
  let totalScore = 0;

  habitConfigs.forEach((h) => {
    const val = todayLog[h.id];
    if (h.type === 'counter') {
      const target = h.targetCount || 10;
      const count = typeof val === 'number' ? val : 0;
      totalScore += Math.min(1, count / target);
    } else if (val === true) {
      totalScore += 1;
    }
  });

  const mentalHealthPct = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;

  const nextHabit = habitConfigs.find(h => {
    const val = todayLog[h.id];
    if (h.type === 'counter') {
      return (typeof val === 'number' ? val : 0) < (h.targetCount || 10);
    }
    return val !== true;
  });

  const handleToggleCheckbox = (id: string) => {
    setTodayLog((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
    onUpdate?.();
  };

  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHabit: DopamineHabit = {
      id: `custom_${Date.now()}`,
      title: newTitle.trim(),
      category: 'mind',
      icon: '🌱',
      type: 'checkbox',
      completed: false,
      description: 'Власний ритуал для підтримки ресурсу.',
      isCustom: true
    };

    setHabitConfigs((prev) => [...prev, newHabit]);
    setNewTitle('');
    onUpdate?.();
  };

  const handleDeleteCustomHabit = (id: string) => {
    setHabitConfigs((prev) => prev.filter((h) => h.id !== id));
    setTodayLog((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    onUpdate?.();
  };

  const handleSetHabitTime = (id: string, time: string) => {
    setHabitConfigs((prev) =>
      prev.map((h) => (h.id === id ? { ...h, scheduledTime: time || undefined } : h))
    );
    onUpdate?.();
  };

  return (
    <div className="w-full bg-white/95 dark:bg-[#1c1c22]/95 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs transition-all space-y-3.5 text-slate-800 dark:text-zinc-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 shrink-0">
            <Brain className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">
              Ментальне здоров'я та ритуали
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
              Природна дофамінова підтримка та відновлення нервової системи
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setShowTip(!showTip)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Наукове пояснення"
          >
            <Info className="w-4 h-4" />
          </button>

          {onDockChange && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDockChange(true);
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Закріпити в індикатори"
            >
              <Pin className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Science Info Banner (Collapsible) */}
      {showTip && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-950 dark:text-rose-200 leading-relaxed space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Як працюють природні дофамінові замінники?</span>
          </div>
          <p className="text-[11px]">
            Після відмови від нікотину рецепторам мозку потрібно 2-3 тижні на відновлення чутливості. 
            Прості дії (обійми, холодна вода, сонце, музика, глибоке дихання) м'яко вивільняють ендорфін, серотонін та дофамін без відкатів.
          </p>
        </div>
      )}

      {/* Progress Bar & Status */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
            <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Індекс ментального ресурсу:</span>
          </span>
          <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
            {mentalHealthPct}%
          </span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-zinc-700/80 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              mentalHealthPct >= 80
                ? 'bg-emerald-500'
                : mentalHealthPct >= 30
                ? 'bg-teal-500'
                : 'bg-rose-500'
            }`}
            style={{ width: `${mentalHealthPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
          <span>
            {mentalHealthPct >= 80
              ? '🌟 Відмінно! Ваша нервова система в ідеальному тонусі'
              : mentalHealthPct >= 30
              ? '💪 Гарний рівень. Виконайте ще 1-2 ритуали'
              : '🌱 Потрібне відновлення. Оберіть просту практику нижче'}
          </span>
          {nextHabit && (
            <span className="font-medium text-rose-600 dark:text-rose-400 shrink-0 ml-2">
              Наступне: {nextHabit.icon}
            </span>
          )}
        </div>
      </div>

      {/* Streamlined Habits List */}
      <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
        {habitConfigs.map((habit) => {
          const val = todayLog[habit.id];
          const isCompleted = val === true;
          const isInfoExpanded = expandedInfoId === habit.id;

          return (
            <div
              key={habit.id}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                isCompleted
                  ? 'bg-rose-500/10 border-rose-500/30 dark:bg-rose-500/15'
                  : 'bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-rose-900/60'
              }`}
              onClick={() => handleToggleCheckbox(habit.id)}
            >
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg shrink-0 leading-none select-none">{habit.icon}</span>
                  <div className="min-w-0">
                    <h4
                      className={`text-xs font-bold transition-colors truncate ${
                        isCompleted
                          ? 'line-through text-slate-400 dark:text-zinc-500'
                          : 'text-slate-800 dark:text-zinc-200'
                      }`}
                    >
                      {habit.title}
                    </h4>
                    <div className="flex items-center gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[9px] text-slate-400 dark:text-zinc-500">Час:</span>
                      <input
                        type="time"
                        value={habit.scheduledTime || ''}
                        onChange={(e) => handleSetHabitTime(habit.id, e.target.value)}
                        className="bg-slate-100 dark:bg-zinc-800 text-[9px] text-slate-600 dark:text-zinc-300 rounded px-1.5 py-0.5 border border-slate-200 dark:border-zinc-700/80 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedInfoId(isInfoExpanded ? null : habit.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                    title="Детальніше про користь"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>

                  {habit.isCustom && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomHabit(habit.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Видалити"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-rose-500 border-rose-500 text-white shadow-2xs'
                        : 'border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800'
                    }`}
                  >
                    {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>

              {/* Collapsible Info Subtext */}
              {isInfoExpanded && (
                <div 
                  className="mt-2 pt-2 border-t border-slate-200/60 dark:border-zinc-800 text-[11px] text-slate-600 dark:text-zinc-400 animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  {habit.description}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Habit Form */}
      <form onSubmit={handleAddCustomHabit} className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex gap-1.5">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Власний ритуал..."
          className="flex-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center justify-center cursor-pointer transition-all shrink-0"
        >
          Додати
        </button>
      </form>
    </div>
  );
};
