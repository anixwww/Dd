import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  X, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  Clock, 
  Activity,
  ArrowRight,
  Pin,
  TrendingUp
} from 'lucide-react';
import { getBodySystemsRecovery, HEALTH_MILESTONES, getTodayHealthFact } from '../data/healthData';

interface HealthRecoveryWidgetProps {
  diffMs: number;
  startDate: number;
  accent?: string;
  onOpenFullHealth: () => void;
  onOpenAnalytics?: () => void;
  isDocked?: boolean;
  onDockChange?: (docked: boolean) => void;
}

const STORAGE_KEY = 'quit-smoking:health-widget-display-mode'; // 'expanded' | 'compact'

export const HealthRecoveryWidget: React.FC<HealthRecoveryWidgetProps> = ({
  diffMs,
  startDate,
  onOpenFullHealth,
  onOpenAnalytics,
  isDocked = false,
  onDockChange
}) => {
  const [displayMode, setDisplayMode] = useState<'expanded' | 'compact'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'compact' || saved === 'expanded') {
        return saved;
      }
    } catch {}
    return 'expanded';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, displayMode);
    } catch {}
  }, [displayMode]);

  // Calculations
  const allSystems = getBodySystemsRecovery(diffMs);
  const activeSystems = allSystems.filter((s) => s.progress < 100);
  const currentStage = activeSystems.length > 0 ? activeSystems[0] : allSystems[allSystems.length - 1];
  
  // Total overall average recovery
  const avgRecovery = Math.round(allSystems.reduce((acc, s) => acc + s.progress, 0) / allSystems.length);

  // Next WHO Medical Milestone
  const nextMilestone = HEALTH_MILESTONES.find((m) => m.t > diffMs) || HEALTH_MILESTONES[HEALTH_MILESTONES.length - 1];
  const isMilestoneCompleted = nextMilestone.t <= diffMs;
  const prevMilestoneTime = [...HEALTH_MILESTONES].reverse().find((prev) => prev.t < nextMilestone.t)?.t || 0;
  const totalMilestoneDuration = nextMilestone.t - prevMilestoneTime;
  const currentMilestoneProgress = isMilestoneCompleted 
    ? 100 
    : Math.min(100, Math.max(0, ((diffMs - prevMilestoneTime) / (totalMilestoneDuration || 1)) * 100));

  const msLeft = nextMilestone.t - diffMs;
  let milestoneTimeText = '';
  if (isMilestoneCompleted) {
    milestoneTimeText = 'Досягнуто';
  } else {
    const hoursLeft = msLeft / (1000 * 60 * 60);
    if (hoursLeft < 24) {
      milestoneTimeText = `ще ${Math.ceil(hoursLeft)} год.`;
    } else {
      const daysLeft = Math.ceil(hoursLeft / 24);
      milestoneTimeText = `ще ${daysLeft} дн.`;
    }
  }

  const todayFact = getTodayHealthFact(diffMs);

  // Key spotlight systems
  const keySystems = allSystems.filter(s => 
    s.name.includes('Бронх') || 
    s.name.includes('Серцево') || 
    s.name.includes('Дофамін') || 
    s.name.includes('Легені')
  ).slice(0, 4);

  // If compact - minimized to both Current Phase and WHO Medical Milestone
  if (displayMode === 'compact') {
    return (
      <div className="mt-3 p-3.5 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-emerald-400/35 dark:border-emerald-500/25 rounded-3xl transition-all select-none shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div 
            onClick={onOpenFullHealth}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-xl bg-white/90 dark:bg-zinc-800/90 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center flex-none text-emerald-600 dark:text-emerald-400 shadow-2xs">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                Відновлення організму
              </h3>
              <span className="text-[10px] text-zinc-400">
                Загальний індекс: {avgRecovery}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-0.5 flex-none ml-1">
            {onOpenAnalytics && (
              <button
                type="button"
                onClick={onOpenAnalytics}
                className="p-1.5 text-indigo-400 hover:text-indigo-300 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                title="Аналітика та закономірності"
              >
                <TrendingUp className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setDisplayMode('expanded')}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
              title="Розгорнути детальний віджет"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            {onDockChange && (
              <button
                type="button"
                onClick={() => onDockChange(true)}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center p-1.5 -mr-1 -my-1 text-zinc-400 hover:text-white rounded-xl hover:bg-white/15 active:bg-white/25 active:scale-90 cursor-pointer transition-all"
                title="Закріпити як індикатор"
              >
                <Pin className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 1. Поточна фаза */}
        <div 
          onClick={onOpenFullHealth}
          className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 cursor-pointer hover:bg-white/10 transition-all"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white truncate">
              Фаза: {currentStage.name}
            </span>
            <span className="font-mono font-bold text-emerald-400 flex-none ml-2">
              {currentStage.progress.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 to-teal-400"
              style={{ width: `${currentStage.progress}%` }}
            />
          </div>
        </div>

        {/* 2. Медичний рубіж */}
        <div 
          onClick={onOpenFullHealth}
          className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 cursor-pointer hover:bg-white/10 transition-all"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white truncate">
              Рубіж: {nextMilestone.title}
            </span>
            <span className="font-mono font-bold text-teal-300 flex-none ml-2">
              {currentMilestoneProgress.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-teal-500 to-cyan-400"
              style={{ width: `${currentMilestoneProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Full Expanded Widget (Styled in Goals Gradient Theme)
  return (
    <div className="mt-3 p-4 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-emerald-400/35 dark:border-emerald-500/25 rounded-3xl transition-all select-none space-y-3 shadow-2xs text-white">
      {/* 1. Заголовок */}
      <div className="flex items-center justify-between pb-2.5 border-b border-emerald-200/60 dark:border-emerald-900/40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-white/90 dark:bg-zinc-800/90 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-2xs">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold tracking-wide text-white">
                Відновлення організму
              </h3>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                {avgRecovery}%
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">
              Фізіологічні маркери та регенерація органів
            </p>
          </div>
        </div>

        {/* Кнопки керування */}
        <div className="flex items-center gap-0.5">
          {onOpenAnalytics && (
            <button
              type="button"
              onClick={onOpenAnalytics}
              className="p-1 text-indigo-400 hover:text-indigo-300 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
              title="Аналітика та закономірності"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setDisplayMode('compact')}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
            title="Згорнути"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          {onDockChange && (
            <button
              type="button"
              onClick={() => onDockChange(true)}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center p-1.5 -mr-1 -my-1 text-zinc-400 hover:text-white rounded-xl hover:bg-white/15 active:bg-white/25 active:scale-90 cursor-pointer transition-all"
              title="Закріпити як індикатор"
            >
              <Pin className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Поточний активний біологічний етап */}
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2 backdrop-blur-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-semibold text-emerald-400 tracking-wider block">
              Поточна фаза
            </span>
            <h4 className="text-xs font-bold text-white truncate">
              {currentStage.name}
            </h4>
          </div>
          <div className="text-right flex-none">
            <span className="text-xs font-mono font-bold text-emerald-400">
              {currentStage.progress.toFixed(1)}%
            </span>
            <span className="block text-[9px] text-slate-400 font-medium">
              {currentStage.timeRemainingText}
            </span>
          </div>
        </div>

        {/* Прогрес-бар */}
        <div className="w-full h-1.5 bg-slate-200/80 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 to-teal-400"
            style={{ width: `${currentStage.progress}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed">
          {currentStage.description}
        </p>
      </div>

      {/* 3. Медичний рубіж ВООЗ */}
      <div className="p-3 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1.5 backdrop-blur-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-semibold text-emerald-700 dark:text-emerald-400 tracking-wider block">
              Медичний рубіж ВООЗ
            </span>
            <h5 className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate">
              {nextMilestone.title}
            </h5>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex-none border border-emerald-200/60 dark:border-emerald-800/40">
            {currentMilestoneProgress.toFixed(0)}% • {milestoneTimeText}
          </span>
        </div>

        <div className="w-full h-1.5 bg-slate-200/80 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 to-teal-400"
            style={{ width: `${currentMilestoneProgress}%` }}
          />
        </div>

        <p className="text-[10px] text-slate-500 dark:text-zinc-400 italic">
          {nextMilestone.medicalFact}
        </p>
      </div>

      {/* 4. Міні-сітка систем */}
      <div className="grid grid-cols-2 gap-1.5">
        {keySystems.map((sys) => (
          <div 
            key={sys.name}
            className="p-2 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-emerald-200/50 dark:border-emerald-900/30 flex items-center gap-2 cursor-pointer hover:border-emerald-300 transition-colors"
            onClick={onOpenFullHealth}
            title="Натисніть для перегляду всіх систем"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="font-semibold text-slate-700 dark:text-zinc-300 truncate">
                  {sys.name.split(' ')[0]}
                </span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  {Math.round(sys.progress)}%
                </span>
              </div>
              <div className="w-full h-1 bg-slate-200/80 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${sys.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
