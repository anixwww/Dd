import React, { useState, useEffect } from 'react';
import { Pin, ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { getBodySystemsRecovery, HEALTH_MILESTONES } from '../../data/healthData';
import { RefractedPrismDropIcon, RefractedPrismShieldIcon } from './RefractedStatusIcons';

/**
 * 1. Заломлена крізь призму крапля для "Регенерація систем"
 */
export const BloodDropPictogram: React.FC<{ className?: string }> = ({ 
  className = "w-4 h-4" 
}) => {
  return <RefractedPrismDropIcon className={className} />;
};

/**
 * 2. Заломлений крізь призму щит для "Рубежі ВООЗ"
 */
export const GreenShieldPictogram: React.FC<{ className?: string }> = ({ 
  className = "w-4 h-4" 
}) => {
  return <RefractedPrismShieldIcon className={className} />;
};

// Aliases for compatibility
export const BioRegenerationPictogram = BloodDropPictogram;
export const WhoMilestonesPictogram = GreenShieldPictogram;

interface RecoveryPictogramsBlockProps {
  diffMs: number;
  onOpenHealthModal?: () => void;
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// Target durations in ms for each body system in getBodySystemsRecovery
const SYSTEM_TARGET_DURATIONS_MS = [
  72 * HOUR,   // 1. Детоксикація від нікотину та CO
  14 * DAY,    // 2. Смакові рецептори та нюх
  30 * DAY,    // 3. Бронхіальний захист і кашель
  90 * DAY,    // 4. Дофамінові рецептори та нерви
  270 * DAY,   // 5. Легені та дихальні шляхи
  365 * DAY,   // 6. Серцево-судинна система
  730 * DAY,   // 7. Еластичність артерій та ендотелій
  1825 * DAY,  // 8. Клітинне оновлення легень і ДНК
  3650 * DAY,  // 9. Судини мозку та захист від інсульту
  5475 * DAY   // 10. Повна тривалість життя
];

function getExactCompletionText(targetTimestamp: number, now: number) {
  if (now >= targetTimestamp) {
    return {
      dateText: 'Завершено',
      timeLeftText: '100% відновлено',
      isDone: true
    };
  }

  const diffMs = targetTimestamp - now;
  const targetDate = new Date(targetTimestamp);
  const nowDate = new Date(now);

  const isToday = targetDate.toDateString() === nowDate.toDateString();
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const isTomorrow = targetDate.toDateString() === tomorrowDate.toDateString();

  const timeStr = targetDate.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

  let dateText = '';
  if (isToday) {
    dateText = `Сьогодні о ${timeStr}`;
  } else if (isTomorrow) {
    dateText = `Завтра о ${timeStr}`;
  } else if (targetDate.getFullYear() === nowDate.getFullYear()) {
    dateText = `${targetDate.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })} о ${timeStr}`;
  } else {
    dateText = `${targetDate.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }

  const totalSecs = Math.floor(diffMs / 1000);
  const totalMins = Math.floor(totalSecs / 60);
  const totalHours = Math.floor(totalMins / 60);
  const days = Math.floor(totalHours / 24);

  let timeLeftText = '';
  if (days > 0) {
    const hoursLeft = totalHours % 24;
    timeLeftText = `Залишилось: ${days}д ${hoursLeft}год`;
  } else if (totalHours > 0) {
    const minsLeft = totalMins % 60;
    timeLeftText = `Залишилось: ${totalHours}год ${minsLeft}хв`;
  } else if (totalMins > 0) {
    const secsLeft = totalSecs % 60;
    timeLeftText = `Залишилось: ${totalMins}хв ${secsLeft}с`;
  } else {
    timeLeftText = `Залишилось: ${totalSecs}с`;
  }

  return { dateText, timeLeftText, isDone: false };
}

export const RecoveryPictogramsBlock: React.FC<RecoveryPictogramsBlockProps> = React.memo(({
  diffMs
}) => {
  const [now, setNow] = useState(Date.now());

  // Real-time 1s clock tick for accurate live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const startDate = now - diffMs;

  // 1. ВІДНОВЛЕННЯ СИСТЕМ: Поточна активна система
  const allSystems = getBodySystemsRecovery(diffMs);
  let activeSysIdx = allSystems.findIndex((s) => s.progress < 100);
  if (activeSysIdx < 0) {
    activeSysIdx = allSystems.length - 1;
  }
  const currSystem = allSystems[activeSysIdx];
  const currSysTargetMs = SYSTEM_TARGET_DURATIONS_MS[activeSysIdx] || (365 * DAY);
  const sysCompletionTimestamp = startDate + currSysTargetMs;
  const sysCompletionInfo = getExactCompletionText(sysCompletionTimestamp, now);

  // 2. РУБЕЖІ ВООЗ: Поточний активний рубіж
  const achievedMilestonesCount = HEALTH_MILESTONES.filter((m) => diffMs >= m.t).length;
  const achievedMilestones = HEALTH_MILESTONES.filter((m) => diffMs >= m.t);
  const prevMilestoneTime = achievedMilestones.length > 0 ? achievedMilestones[achievedMilestones.length - 1].t : 0;
  
  let nextMilestone = HEALTH_MILESTONES.find((m) => diffMs < m.t);
  if (!nextMilestone) {
    nextMilestone = HEALTH_MILESTONES[HEALTH_MILESTONES.length - 1];
  }

  let whoPct = 100;
  if (diffMs < nextMilestone.t) {
    const totalInStage = nextMilestone.t - prevMilestoneTime;
    const elapsedInStage = diffMs - prevMilestoneTime;
    whoPct = totalInStage > 0 ? Math.min(100, Math.max(0, Math.round((elapsedInStage / totalInStage) * 100))) : 0;
  }

  const milestoneCompletionTimestamp = startDate + nextMilestone.t;
  const milestoneCompletionInfo = getExactCompletionText(milestoneCompletionTimestamp, now);

  // Clean milestone title of emojis if any
  const cleanMilestoneTitle = nextMilestone.title.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

  // Стан мінімізації блоку "Відновлення"
  const [isMinimized, setIsMinimized] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('quit-smoking:recovery-block-minimized');
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  });

  // Стан закріплення окремих карток під блискавкою
  const [isBioPinned, setIsBioPinned] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:bio-regeneration-pinned') === 'true';
    } catch {
      return false;
    }
  });

  const [isWhoPinned, setIsWhoPinned] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:who-milestones-pinned') === 'true';
    } catch {
      return false;
    }
  });

  const toggleMinimized = () => {
    const nextVal = !isMinimized;
    setIsMinimized(nextVal);
    try {
      localStorage.setItem('quit-smoking:recovery-block-minimized', String(nextVal));
      window.dispatchEvent(new Event('recovery-block-minimized-change'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const handlePinBio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBioPinned(true);
    try {
      localStorage.setItem('quit-smoking:bio-regeneration-pinned', 'true');
      window.dispatchEvent(new Event('recovery-pictograms-pinned-change'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const handlePinWho = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWhoPinned(true);
    try {
      localStorage.setItem('quit-smoking:who-milestones-pinned', 'true');
      window.dispatchEvent(new Event('recovery-pictograms-pinned-change'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const val = localStorage.getItem('quit-smoking:recovery-block-minimized');
        setIsMinimized(val !== null ? val === 'true' : true);
        setIsBioPinned(localStorage.getItem('quit-smoking:bio-regeneration-pinned') === 'true');
        setIsWhoPinned(localStorage.getItem('quit-smoking:who-milestones-pinned') === 'true');
      } catch {}
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('recovery-pictograms-pinned-change', handleStorageChange);
    window.addEventListener('recovery-block-minimized-change', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('recovery-pictograms-pinned-change', handleStorageChange);
      window.removeEventListener('recovery-block-minimized-change', handleStorageChange);
    };
  }, []);

  // Відкриття окремого вікна Регенерації систем
  const handleOpenBioModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new Event('open-systems-recovery-modal'));
  };

  // Відкриття окремого вікна Рубежів ВООЗ
  const handleOpenWhoModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new Event('open-who-milestones-modal'));
  };

  // Якщо обидва вікна закріплені під блискавкою, блок можна не відображати
  if (isBioPinned && isWhoPinned) {
    return null;
  }

  return (
    <div className="w-full select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
      {/* Заголовок блоку "ВІДНОВЛЕННЯ" з трикутником мінімізації */}
      {isMinimized ? (
        <div 
          onClick={toggleMinimized}
          className="py-0.5 pl-[18px] pr-1 flex items-center justify-start mb-1 cursor-pointer group/min w-fit"
          title="Розгорнути блок Відновлення"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimized();
            }}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-all active:scale-90 cursor-pointer flex items-center justify-center shrink-0"
            title="Розгорнути блок Відновлення"
          >
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover/min:text-zinc-100 transition-colors animate-section-chevron section-delay-2" />
          </button>
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-zinc-400 ml-1 group-hover/min:text-zinc-100 transition-colors animate-section-header-text section-delay-2">
            Відновлення
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Верхній рядок із заголовком та трикутником згортання */}
          <div className="pl-[18px] pr-1 flex items-center justify-between">
            <div 
              onClick={toggleMinimized}
              className="flex items-center gap-2 cursor-pointer group/exp w-fit"
              title="Згорнути блок Відновлення"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMinimized();
                }}
                className="text-zinc-400 hover:text-zinc-200 shrink-0 flex items-center justify-center p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer active:scale-90"
                title="Згорнути блок Відновлення"
              >
                <ChevronLeft className="w-4 h-4 text-zinc-400 group-hover/exp:text-zinc-100 transition-transform animate-section-chevron section-delay-2" />
              </button>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-zinc-400 group-hover/exp:text-zinc-100 transition-colors animate-section-header-text section-delay-2">
                Відновлення
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {/* 1. ВІКНО: РЕГЕНЕРАЦІЯ СИСТЕМ */}
            {!isBioPinned && (
              <div
                onClick={handleOpenBioModal}
                className="w-full p-3.5 bg-[#18181f]/90 border border-zinc-800/80 hover:border-zinc-700 hover:bg-[#1f1f27] rounded-2xl shadow-xs transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] text-left relative overflow-hidden group cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-zinc-800/90 border border-zinc-700/60 text-zinc-300 flex items-center justify-center">
                      <BloodDropPictogram className="w-4 h-4 text-zinc-300" />
                    </div>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-200">
                      Регенерація систем
                    </h3>
                  </div>
                </div>

                {/* Content: Exact active system & details */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-0.5">
                        Поточний процес регенерації
                      </div>
                      <div className="text-xs font-bold text-zinc-200 truncate">
                        {currSystem.name}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug line-clamp-2">
                        {currSystem.description}
                      </p>
                    </div>
                    <span className="text-xs sm:text-sm font-mono font-bold text-zinc-200 shrink-0">
                      {currSystem.progress}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-zinc-800/90 rounded-full overflow-hidden p-0.5 border border-zinc-700/60">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-zinc-300"
                      style={{ width: `${Math.max(2, currSystem.progress)}%` }}
                    />
                  </div>

                  {/* Estimated completion date & timer */}
                  <div className="pt-1 flex items-center justify-between gap-2 text-[10px]">
                    <div className="flex items-center gap-1 text-zinc-400 font-medium truncate">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>Завершення: {sysCompletionInfo.dateText}</span>
                    </div>
                    <span className="font-mono font-bold text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-700/50 shrink-0">
                      {sysCompletionInfo.timeLeftText}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ВІКНО: РУБЕЖІ ВООЗ */}
            {!isWhoPinned && (
              <div
                onClick={handleOpenWhoModal}
                className="w-full p-3.5 bg-[#18181f]/90 border border-zinc-800/80 hover:border-zinc-700 hover:bg-[#1f1f27] rounded-2xl shadow-xs transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] text-left relative overflow-hidden group cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-zinc-800/90 border border-zinc-700/60 text-zinc-300 flex items-center justify-center">
                      <GreenShieldPictogram className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-200">
                        Рубежі ВООЗ
                      </h3>
                      <span className="text-[9px] font-semibold font-mono bg-zinc-800/80 text-zinc-400 px-1.5 py-0.5 rounded-md border border-zinc-700/50">
                        {achievedMilestonesCount}/{HEALTH_MILESTONES.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content: Exact active milestone & details */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-0.5">
                        Поточний рубіж здоровʼя
                      </div>
                      <div className="text-xs font-bold text-zinc-200 truncate">
                        {cleanMilestoneTitle}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug line-clamp-2">
                        {nextMilestone.medicalFact || nextMilestone.description}
                      </p>
                    </div>
                    <span className="text-xs sm:text-sm font-mono font-bold text-zinc-200 shrink-0">
                      {whoPct}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-zinc-800/90 rounded-full overflow-hidden p-0.5 border border-zinc-700/60">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-zinc-300"
                      style={{ width: `${Math.max(2, whoPct)}%` }}
                    />
                  </div>

                  {/* Estimated completion date & timer */}
                  <div className="pt-1 flex items-center justify-between gap-2 text-[10px]">
                    <div className="flex items-center gap-1 text-zinc-400 font-medium truncate">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>Очікується: {milestoneCompletionInfo.dateText}</span>
                    </div>
                    <span className="font-mono font-bold text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-700/50 shrink-0">
                      {milestoneCompletionInfo.timeLeftText}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
