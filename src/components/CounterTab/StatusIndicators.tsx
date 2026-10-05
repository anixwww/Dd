import React, { useState, useEffect } from 'react';
import { Sparkle } from 'lucide-react';
import { 
  RefractedPrismGiftIcon, 
  RefractedPrismLightningIcon, 
  RefractedPrismDropIcon, 
  RefractedPrismShieldIcon,
  RefractedPrismCheckIcon,
  RefractedPrismBrainIcon,
  RefractedPrismBookIcon
} from './RefractedStatusIcons';
import { HEALTH_MILESTONES, getBodySystemsRecovery } from '../../data/healthData';

interface StatusIndicatorsProps {
  isPromptDocked?: boolean;
  setIsPromptDocked?: (val: boolean) => void;
  setIsPromptCompact?: (val: boolean) => void;
  isGoalsDocked: boolean;
  setIsGoalsDocked: (val: boolean) => void;
  isQuickGoalDocked: boolean;
  setIsQuickGoalDocked: (val: boolean) => void;
  isHealthDocked: boolean;
  setIsHealthDocked: (val: boolean) => void;
  isAnalyzerDocked?: boolean;
  setIsAnalyzerDocked?: (val: boolean) => void;
  isSavedResourcesDocked?: boolean;
  setIsSavedResourcesDocked?: (val: boolean) => void;
  isStepsDocked: boolean;
  setIsStepsDocked: (val: boolean) => void;
  isMentalHealthDocked: boolean;
  setIsMentalHealthDocked: (val: boolean) => void;
  isGratitudeDocked: boolean;
  setIsGratitudeDocked: (val: boolean) => void;
  onOpenAnalyzerModal?: () => void;
  goals: any;
  totalSaved: number;
  money?: any;
  startDate: number;
  quickGoalData: any;
  quickGoalNow: number;
  diffMs: number;
  getBodySystemsRecovery: (ms: number) => { progress: number }[];
  setIsGoalModalOpen: (val: boolean) => void;
  handleHealthClick: () => void;
  setIsQuickGoalData?: (val: any) => void;
  setIsSavedResourcesModalOpen?: (val: boolean) => void;
  setIsStepsOpen: (val: boolean) => void;
  setIsMentalHealthOpen: (val: boolean) => void;
  setIsGratitudeOpen: (val: boolean) => void;
  dailyStepsState: { done: number; total: number; pct: number; showIndicator: boolean };
  mentalHealthState: { pct: number; showIndicator: boolean };
  gratitudeState: { count: number; showIndicator: boolean; isCompleted: boolean };
  iconStyle?: string;
  isAnalyzerModalOpen?: boolean;
}

export const StatusIndicators: React.FC<StatusIndicatorsProps> = React.memo(({
  isGoalsDocked,
  setIsGoalsDocked,
  isQuickGoalDocked,
  setIsQuickGoalDocked,
  isHealthDocked,
  setIsHealthDocked,
  isStepsDocked,
  setIsStepsDocked,
  isMentalHealthDocked,
  setIsMentalHealthDocked,
  isGratitudeDocked,
  setIsGratitudeDocked,
  goals,
  totalSaved,
  startDate,
  quickGoalData,
  quickGoalNow,
  diffMs,
  getBodySystemsRecovery,
  setIsGoalModalOpen,
  handleHealthClick,
  setIsStepsOpen,
  setIsMentalHealthOpen,
  setIsGratitudeOpen,
  dailyStepsState,
  mentalHealthState,
  gratitudeState,
  iconStyle = 'standard',
  isAnalyzerModalOpen = false
}) => {
  // Стан закріплення вікон відновлення (зберігається в localStorage)
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

  const [currentGoalsDocked, setCurrentGoalsDocked] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('quit-smoking:goals-docked');
      return stored !== null ? stored === 'true' : isGoalsDocked;
    } catch {
      return isGoalsDocked;
    }
  });

  const [currentQuickGoalDocked, setCurrentQuickGoalDocked] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('quit-smoking:quick-goal-docked');
      return stored !== null ? stored === 'true' : isQuickGoalDocked;
    } catch {
      return isQuickGoalDocked;
    }
  });

  const [currentHealthDocked, setCurrentHealthDocked] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('quit-smoking:health-docked');
      return stored !== null ? stored === 'true' : isHealthDocked;
    } catch {
      return isHealthDocked;
    }
  });

  const [currentStepsDocked, setCurrentStepsDocked] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('quit-smoking:steps-docked');
      return stored !== null ? stored === 'true' : isStepsDocked;
    } catch {
      return isStepsDocked;
    }
  });

  const [currentMentalHealthDocked, setCurrentMentalHealthDocked] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('quit-smoking:mental-health-docked');
      return stored !== null ? stored === 'true' : isMentalHealthDocked;
    } catch {
      return isMentalHealthDocked;
    }
  });

  const [currentGratitudeDocked, setCurrentGratitudeDocked] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('quit-smoking:gratitude-docked');
      return stored !== null ? stored === 'true' : isGratitudeDocked;
    } catch {
      return isGratitudeDocked;
    }
  });

  useEffect(() => {
    setCurrentGoalsDocked(isGoalsDocked);
  }, [isGoalsDocked]);

  useEffect(() => {
    setCurrentQuickGoalDocked(isQuickGoalDocked);
  }, [isQuickGoalDocked]);

  useEffect(() => {
    setCurrentHealthDocked(isHealthDocked);
  }, [isHealthDocked]);

  useEffect(() => {
    setCurrentStepsDocked(isStepsDocked);
  }, [isStepsDocked]);

  useEffect(() => {
    setCurrentMentalHealthDocked(isMentalHealthDocked);
  }, [isMentalHealthDocked]);

  useEffect(() => {
    setCurrentGratitudeDocked(isGratitudeDocked);
  }, [isGratitudeDocked]);

  const [, setTick] = useState(0);

  useEffect(() => {
    const handleEvents = () => {
      try {
        setIsBioPinned(localStorage.getItem('quit-smoking:bio-regeneration-pinned') === 'true');
        setIsWhoPinned(localStorage.getItem('quit-smoking:who-milestones-pinned') === 'true');
        const gDock = localStorage.getItem('quit-smoking:goals-docked');
        setCurrentGoalsDocked(gDock !== null ? gDock === 'true' : true);
        const qgDock = localStorage.getItem('quit-smoking:quick-goal-docked');
        setCurrentQuickGoalDocked(qgDock !== null ? qgDock === 'true' : true);
        setCurrentHealthDocked(localStorage.getItem('quit-smoking:health-docked') === 'true');
        setCurrentStepsDocked(localStorage.getItem('quit-smoking:steps-docked') === 'true');
        setCurrentMentalHealthDocked(localStorage.getItem('quit-smoking:mental-health-docked') === 'true');
        setCurrentGratitudeDocked(localStorage.getItem('quit-smoking:gratitude-docked') === 'true');
        setTick((t) => t + 1);
      } catch {}
    };
    window.addEventListener('storage', handleEvents);
    window.addEventListener('recovery-pictograms-pinned-change', handleEvents);
    window.addEventListener('goals-docked-change', handleEvents);
    window.addEventListener('quick-goal-docked-change', handleEvents);
    window.addEventListener('goals-change', handleEvents);
    window.addEventListener('quick-goal-change', handleEvents);
    window.addEventListener('health-docked-change', handleEvents);
    window.addEventListener('steps-docked-change', handleEvents);
    window.addEventListener('mental-health-docked-change', handleEvents);
    window.addEventListener('gratitude-docked-change', handleEvents);
    return () => {
      window.removeEventListener('storage', handleEvents);
      window.removeEventListener('recovery-pictograms-pinned-change', handleEvents);
      window.removeEventListener('goals-docked-change', handleEvents);
      window.removeEventListener('quick-goal-docked-change', handleEvents);
      window.removeEventListener('goals-change', handleEvents);
      window.removeEventListener('quick-goal-change', handleEvents);
      window.removeEventListener('health-docked-change', handleEvents);
      window.removeEventListener('steps-docked-change', handleEvents);
      window.removeEventListener('mental-health-docked-change', handleEvents);
      window.removeEventListener('gratitude-docked-change', handleEvents);
    };
  }, []);

  const isGoal100 = (() => {
    let liveGoals = goals;
    try {
      const savedGoals = localStorage.getItem('quit-smoking:goals');
      if (savedGoals) liveGoals = JSON.parse(savedGoals);
    } catch {}
    const activeGoals = liveGoals?.queue || [];
    const activeGoal = activeGoals.length > 0 ? activeGoals[0] : null;
    const hasGoal = Boolean(activeGoal && activeGoal.amount && Number(activeGoal.amount) > 0);
    const netSaved = Math.max(0, totalSaved - (liveGoals?.base || 0));
    const amount = activeGoal?.amount || 0;
    const pct = hasGoal && amount > 0 ? Math.min(100, Math.floor((netSaved / amount) * 100)) : 0;
    return pct >= 100;
  })();

  const isQuickGoal100 = (() => {
    let liveQuick = quickGoalData;
    try {
      const savedQG = localStorage.getItem('quit-smoking:quick-goal');
      if (savedQG) liveQuick = JSON.parse(savedQG);
    } catch {}
    const hasQuickGoal = Boolean(liveQuick && liveQuick.targetTime && liveQuick.targetTime > (liveQuick.createdAt || 0));
    if (!hasQuickGoal) return false;
    const isFailed = Boolean(startDate && startDate > liveQuick.createdAt && !liveQuick.isCompleted);
    const isReached = quickGoalNow >= liveQuick.targetTime;
    return !isFailed && isReached;
  })();

  const activeCount = [
    currentQuickGoalDocked,
    currentGoalsDocked,
    isBioPinned,
    isWhoPinned,
    currentStepsDocked && dailyStepsState?.showIndicator,
    currentMentalHealthDocked && mentalHealthState?.showIndicator,
    currentGratitudeDocked && gratitudeState?.showIndicator,
    currentHealthDocked
  ].filter(Boolean).length;

  if (activeCount === 0 || isAnalyzerModalOpen) return null;

  // 1. Регенерація систем (%) - прогрес ПОТОЧНОГО етапу (активної системи)
  const allSystems = getBodySystemsRecovery(diffMs || 0);
  const activeSystem = allSystems.find((s) => s.progress < 100);
  const rawSystemsPct = activeSystem ? activeSystem.progress : 100;
  const systemsPct = isNaN(rawSystemsPct) ? 100 : rawSystemsPct;

  // 2. Рубежі ВООЗ (%) - прогрес ПОТОЧНОГО етапу (до наступного рубежу)
  const safeDiffMs = isNaN(Number(diffMs)) ? 0 : Math.max(0, Number(diffMs));
  const achieved = HEALTH_MILESTONES.filter((m) => safeDiffMs >= m.t);
  const prevT = achieved.length > 0 ? achieved[achieved.length - 1].t : 0;
  const nextMilestone = HEALTH_MILESTONES.find((m) => safeDiffMs < m.t);
  let whoPct = 100;
  if (nextMilestone) {
    const nextT = nextMilestone.t;
    const totalInStage = nextT - prevT;
    const elapsedInStage = safeDiffMs - prevT;
    const rawWhoPct = totalInStage > 0 ? Math.min(100, Math.max(0, Math.round((elapsedInStage / totalInStage) * 100))) : 0;
    whoPct = isNaN(rawWhoPct) ? 0 : rawWhoPct;
  }

  // Inactive / Dimmed starlight styling matching inactive Yin-Yang and Eye icons (fixed width ensures all icons align perfectly in a vertical column)
  const itemClassName = "h-7 min-w-[56px] px-1.5 py-1 rounded-xl bg-[#14141c]/85 hover:bg-[#1a1a24] border border-zinc-800/80 hover:border-zinc-700/80 shadow-xs flex items-center justify-between gap-1.5 cursor-pointer select-none transition-all duration-200 active:scale-90 shrink-0 group pointer-events-auto backdrop-blur-md opacity-90 hover:opacity-100";
  const iconWrapperClassName = "w-4 h-4 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 origin-center text-zinc-300 group-hover:text-white";
  const textClassName = "text-[11px] font-mono font-bold leading-none tracking-tight text-zinc-200 group-hover:text-white select-none shrink-0 text-right flex-1 tabular-nums";

  return (
    <div className="flex flex-col items-start gap-1 z-[45] pointer-events-none select-none">
      
      {/* 1. ПОДАРУНОК: ЦІЛЬ (заощаджені кошти - показує поточний % накопичення) */}
      {currentGoalsDocked && (() => {
        let liveGoals = goals;
        try {
          const savedGoals = localStorage.getItem('quit-smoking:goals');
          if (savedGoals) liveGoals = JSON.parse(savedGoals);
        } catch {}
        const activeGoals = liveGoals?.queue || [];
        const activeGoal = activeGoals.length > 0 ? activeGoals[0] : null;
        const hasGoal = Boolean(activeGoal && activeGoal.amount && Number(activeGoal.amount) > 0);
        const netSaved = Math.max(0, totalSaved - (liveGoals?.base || 0));
        const amount = activeGoal?.amount || 0;
        const pct = hasGoal && amount > 0 ? Math.min(100, Math.max(0, Math.floor((netSaved / amount) * 100))) : 0;

        return (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              if (setIsGoalModalOpen) {
                setIsGoalModalOpen(true);
              }
              window.dispatchEvent(new CustomEvent('open-goal-modal'));
            }}
            className={itemClassName}
            title={hasGoal ? `Мета «${activeGoal.name}»: ${pct}% накопичено. Натисніть для деталей.` : 'Ціль не обрана. Натисніть, щоб обрати ціль на заощадження.'}
          >
            <div className={iconWrapperClassName}>
              {iconStyle === 'sparkles' ? (
                <Sparkle className="w-4 h-4 text-zinc-200 shrink-0 origin-center transition-transform duration-200 group-hover:scale-110" />
              ) : (
                <RefractedPrismGiftIcon className="w-4 h-4 shrink-0 origin-center transition-transform duration-200 group-hover:scale-110" />
              )}
            </div>
            <span className={textClassName}>
              {pct}%
            </span>
          </div>
        );
      })()}

      {/* 3. КРАПЛЯ: РЕГЕНЕРАЦІЯ СИСТЕМ (Крапля) */}
      {isBioPinned && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (handleHealthClick) {
              handleHealthClick();
            } else {
              window.dispatchEvent(new CustomEvent('open-section-overlay', { detail: 'health' }));
            }
          }}
          className={itemClassName}
          title={`Регенерація систем (${systemsPct}%). Натисніть, щоб відкрити вікно регенерації.`}
        >
          <div className={`${iconWrapperClassName} animate-pictogram-step-3`}>
            <RefractedPrismDropIcon className="w-5 h-5 shrink-0" />
          </div>
          <span className={textClassName}>
            {systemsPct}%
          </span>
        </div>
      )}

      {/* АЛЬТЕРНАТИВНА КРАПЛЯ: ЗАГАЛЬНЕ ВІДНОВЛЕННЯ (якщо перша не активна) */}
      {!isBioPinned && currentHealthDocked && (() => {
        const avgRecovery = systemsPct;

        return (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              if (handleHealthClick) {
                handleHealthClick();
              } else {
                window.dispatchEvent(new CustomEvent('open-section-overlay', { detail: 'health' }));
              }
            }}
            className={itemClassName}
            title={`Відновлення організму (${avgRecovery}%). Натисніть, щоб відкрити вікно відновлення.`}
          >
            <div className={`${iconWrapperClassName} animate-pictogram-step-3`}>
              {iconStyle === 'sparkles' ? (
                <Sparkle className="w-5 h-5 text-[#FFFDD0] shrink-0" />
              ) : (
                <RefractedPrismDropIcon className="w-5 h-5 shrink-0" />
              )}
            </div>
            <span className={textClassName}>
              {avgRecovery}%
            </span>
          </div>
        );
      })()}

      {/* 4. ЩИТ: РУБЕЖІ ВООЗ (Щит) */}
      {isWhoPinned && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (handleHealthClick) {
              handleHealthClick();
            } else {
              window.dispatchEvent(new CustomEvent('open-section-overlay', { detail: 'who_milestones' }));
            }
          }}
          className={itemClassName}
          title={`Рубежі ВООЗ (${whoPct}%). Натисніть, щоб відкрити рубежі ВООЗ.`}
        >
          <div className={`${iconWrapperClassName} animate-pictogram-step-4`}>
            <RefractedPrismShieldIcon className="w-5 h-5 shrink-0" />
          </div>
          <span className={textClassName}>
            {whoPct}%
          </span>
        </div>
      )}

      {/* 5. ЩОДЕННІ СПРАВИ */}
      {currentStepsDocked && dailyStepsState?.showIndicator && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (setIsStepsOpen) {
              setIsStepsOpen(true);
            } else {
              window.dispatchEvent(new CustomEvent('open-steps-modal'));
            }
          }}
          className={itemClassName}
          title={`Щоденні справи: ${dailyStepsState?.done ?? 0}/${dailyStepsState?.total ?? 0}. Натисніть, щоб відкрити.`}
        >
          <div className={iconWrapperClassName}>
            {iconStyle === 'sparkles' ? (
              <Sparkle className="w-5 h-5 text-[#FFFDD0] shrink-0" />
            ) : (
              <RefractedPrismCheckIcon className="w-5 h-5 shrink-0" />
            )}
          </div>
          <span className={textClassName}>
            {dailyStepsState?.done ?? 0}/{dailyStepsState?.total ?? 0}
          </span>
        </div>
      )}

      {/* 6. ПСИХОЛОГІЧНИЙ СТАН */}
      {currentMentalHealthDocked && mentalHealthState?.showIndicator && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (setIsMentalHealthOpen) {
              setIsMentalHealthOpen(true);
            } else {
              window.dispatchEvent(new CustomEvent('open-mental-health-modal'));
            }
          }}
          className={itemClassName}
          title={`Психологічний стан (${mentalHealthState?.pct ?? 0}%). Натисніть, щоб відкрити.`}
        >
          <div className={iconWrapperClassName}>
            {iconStyle === 'sparkles' ? (
              <Sparkle className="w-5 h-5 text-[#FFFDD0] shrink-0" />
            ) : (
              <RefractedPrismBrainIcon className="w-5 h-5 shrink-0" />
            )}
          </div>
          <span className={textClassName}>
            {mentalHealthState?.pct ?? 0}%
          </span>
        </div>
      )}

      {/* 7. ЩОДЕННИК ВДЯЧНОСТІ */}
      {currentGratitudeDocked && gratitudeState?.showIndicator && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (setIsGratitudeOpen) {
              setIsGratitudeOpen(true);
            } else {
              window.dispatchEvent(new CustomEvent('open-gratitude-modal'));
            }
          }}
          className={itemClassName}
          title={`Щоденник вдячності (${gratitudeState?.count ?? 0} записів). Натисніть, щоб відкрити.`}
        >
          <div className={iconWrapperClassName}>
            {iconStyle === 'sparkles' ? (
              <Sparkle className="w-5 h-5 text-[#FFFDD0] shrink-0" />
            ) : (
              <RefractedPrismBookIcon className="w-5 h-5 shrink-0" />
            )}
          </div>
          <span className={textClassName}>
            {gratitudeState?.count ?? 0}
          </span>
        </div>
      )}

    </div>
  );
});
