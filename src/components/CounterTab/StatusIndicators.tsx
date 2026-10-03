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
import { BloodDropPictogram, GreenShieldPictogram } from './RecoveryPictograms';
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

  useEffect(() => {
    const handleEvents = () => {
      try {
        setIsBioPinned(localStorage.getItem('quit-smoking:bio-regeneration-pinned') === 'true');
        setIsWhoPinned(localStorage.getItem('quit-smoking:who-milestones-pinned') === 'true');
        setCurrentGoalsDocked(localStorage.getItem('quit-smoking:goals-docked') === 'true');
        setCurrentQuickGoalDocked(localStorage.getItem('quit-smoking:quick-goal-docked') === 'true');
        setCurrentHealthDocked(localStorage.getItem('quit-smoking:health-docked') === 'true');
        setCurrentStepsDocked(localStorage.getItem('quit-smoking:steps-docked') === 'true');
        setCurrentMentalHealthDocked(localStorage.getItem('quit-smoking:mental-health-docked') === 'true');
        setCurrentGratitudeDocked(localStorage.getItem('quit-smoking:gratitude-docked') === 'true');
      } catch {}
    };
    window.addEventListener('storage', handleEvents);
    window.addEventListener('recovery-pictograms-pinned-change', handleEvents);
    window.addEventListener('goals-docked-change', handleEvents);
    window.addEventListener('quick-goal-docked-change', handleEvents);
    window.addEventListener('health-docked-change', handleEvents);
    window.addEventListener('steps-docked-change', handleEvents);
    window.addEventListener('mental-health-docked-change', handleEvents);
    window.addEventListener('gratitude-docked-change', handleEvents);
    return () => {
      window.removeEventListener('storage', handleEvents);
      window.removeEventListener('recovery-pictograms-pinned-change', handleEvents);
      window.removeEventListener('goals-docked-change', handleEvents);
      window.removeEventListener('quick-goal-docked-change', handleEvents);
      window.removeEventListener('health-docked-change', handleEvents);
      window.removeEventListener('steps-docked-change', handleEvents);
      window.removeEventListener('mental-health-docked-change', handleEvents);
      window.removeEventListener('gratitude-docked-change', handleEvents);
    };
  }, []);

  const activeCount = [
    currentQuickGoalDocked,
    currentGoalsDocked,
    isBioPinned,
    isWhoPinned,
    currentStepsDocked && dailyStepsState.showIndicator,
    currentMentalHealthDocked && mentalHealthState.showIndicator,
    currentGratitudeDocked && gratitudeState.showIndicator,
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
  const itemClassName = "h-7 w-[52px] flex items-center justify-between gap-1 cursor-pointer select-none transition-all duration-300 active:scale-90 shrink-0 group py-1 px-0.5 text-[#FFFDD0] opacity-85 hover:opacity-100 hover:scale-105 pointer-events-auto";
  const iconWrapperClassName = "w-5 h-5 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 origin-center text-[#FFFDD0] group-hover:drop-shadow-[0_0_8px_rgba(255,253,208,0.9)]";
  const textClassName = "text-[11.5px] font-mono font-black leading-none tracking-tight text-[#FFFDD0] transition-all duration-300 group-hover:drop-shadow-[0_0_6px_rgba(255,253,208,0.7)] select-none shrink-0 text-right flex-1 tabular-nums";

  return (
    <div className="flex flex-col items-start gap-1 z-[45] pointer-events-none select-none">
      
      {/* 1. ПОДАРУНОК: ЦІЛЬ (Подарунок - ПЕРШИЙ) */}
      {currentGoalsDocked && (() => {
        const activeGoals = goals?.queue || [];
        const activeGoal = activeGoals.length > 0 ? activeGoals[0] : null;
        const hasGoal = Boolean(activeGoal && activeGoal.amount && Number(activeGoal.amount) > 0);
        const netSaved = Math.max(0, totalSaved - (goals?.base || 0));
        const amount = activeGoal?.amount || 0;
        const pct = hasGoal && amount > 0 ? Math.min(100, Math.floor((netSaved / amount) * 100)) : 0;

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
            title={hasGoal 
              ? `Ціль: «${activeGoal?.name || ''}» (${pct}%). Натисніть, щоб відкрити.`
              : "Ціль. Натисніть, щоб додати."
            }
          >
            <div className={`${iconWrapperClassName} animate-pictogram-step-1`}>
              {iconStyle === 'sparkles' ? (
                <Sparkle className="w-5 h-5 text-[#FFFDD0] shrink-0 animate-celestial-star origin-center transition-all duration-300 group-hover:scale-115 group-hover:[animation-duration:4s]" />
              ) : (
                <RefractedPrismGiftIcon className="w-5 h-5 shrink-0 animate-celestial-gift origin-center transition-all duration-300 group-hover:scale-115 group-hover:[animation-duration:3.5s]" />
              )}
            </div>
            {hasGoal && (
              <span className={textClassName}>
                {pct}%
              </span>
            )}
          </div>
        );
      })()}

      {/* 2. БЛИСКАВКА: ШВИДКА ЦІЛЬ (Блискавка - ПІД НИМ) */}
      {currentQuickGoalDocked && (() => {
        const hasQuickGoal = Boolean(quickGoalData && quickGoalData.targetTime && quickGoalData.targetTime > (quickGoalData.createdAt || 0));
        let qgPct = 0;
        if (hasQuickGoal) {
          const isFailed = Boolean(startDate && startDate > quickGoalData.createdAt && !quickGoalData.isCompleted);
          const isReached = quickGoalNow >= quickGoalData.targetTime;
          if (!isFailed && !isReached) {
            const totalDuration = quickGoalData.targetTime - quickGoalData.createdAt;
            const elapsed = quickGoalNow - quickGoalData.createdAt;
            qgPct = totalDuration > 0 ? Math.min(100, Math.max(0, Math.floor((elapsed / totalDuration) * 100))) : 0;
          } else if (isReached) { 
            qgPct = 100; 
          }
        }
        return (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent('open-quick-goal-modal'));
            }}
            className={itemClassName}
            title={hasQuickGoal 
              ? (quickGoalData?.title ? `Швидка ціль: «${quickGoalData.title}» (${qgPct}%). Натисніть, щоб відкрити.` : `Швидка ціль (${qgPct}%). Натисніть, щоб відкрити.`) 
              : "Швидка ціль. Натисніть, щоб встановити."
            }
          >
            <div className={`${iconWrapperClassName} animate-pictogram-step-2`}>
              {iconStyle === 'sparkles' ? (
                <Sparkle className="w-5 h-5 text-[#FFFDD0] shrink-0 animate-celestial-star origin-center transition-all duration-300 group-hover:scale-115 group-hover:[animation-duration:4s]" />
              ) : (
                <RefractedPrismLightningIcon className="w-5 h-5 shrink-0 animate-celestial-lightning origin-center transition-all duration-300 group-hover:scale-115 group-hover:[animation-duration:2.5s]" />
              )}
            </div>
            {hasQuickGoal && (
              <span className={textClassName}>
                {qgPct}%
              </span>
            )}
          </div>
        );
      })()}

      {/* 3. КРАПЛЯ: РЕГЕНЕРАЦІЯ СИСТЕМ (Крапля) */}
      {isBioPinned && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsBioPinned(false);
            try {
              localStorage.setItem('quit-smoking:bio-regeneration-pinned', 'false');
              window.dispatchEvent(new Event('recovery-pictograms-pinned-change'));
              window.dispatchEvent(new Event('storage'));
            } catch {}
          }}
          className={itemClassName}
          title={`Регенерація систем (${systemsPct}%). Натисніть, щоб зняти закріплення.`}
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
              setCurrentHealthDocked(false);
              setIsHealthDocked(false);
              try {
                localStorage.setItem('quit-smoking:health-docked', 'false');
                window.dispatchEvent(new Event('health-docked-change'));
                window.dispatchEvent(new Event('storage'));
              } catch {}
            }}
            className={itemClassName}
            title={`Відновлення організму (${avgRecovery}%). Натисніть, щоб зняти закріплення.`}
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
            setIsWhoPinned(false);
            try {
              localStorage.setItem('quit-smoking:who-milestones-pinned', 'false');
              window.dispatchEvent(new Event('recovery-pictograms-pinned-change'));
              window.dispatchEvent(new Event('storage'));
            } catch {}
          }}
          className={itemClassName}
          title={`Рубежі ВООЗ (${whoPct}%). Натисніть, щоб зняти закріплення.`}
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
      {currentStepsDocked && dailyStepsState.showIndicator && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setCurrentStepsDocked(false);
            setIsStepsDocked(false);
            try {
              localStorage.setItem('quit-smoking:steps-docked', 'false');
              window.dispatchEvent(new Event('steps-docked-change'));
              window.dispatchEvent(new Event('storage'));
            } catch {}
          }}
          className={itemClassName}
          title={`Щоденні справи: ${dailyStepsState.done}/${dailyStepsState.total}. Натисніть, щоб зняти закріплення.`}
        >
          <div className={iconWrapperClassName}>
            {iconStyle === 'sparkles' ? (
              <Sparkle className="w-5 h-5 text-[#FFFDD0] shrink-0" />
            ) : (
              <RefractedPrismCheckIcon className="w-5 h-5 shrink-0" />
            )}
          </div>
          <span className={textClassName}>
            {dailyStepsState.done}/{dailyStepsState.total}
          </span>
        </div>
      )}

      {/* 6. ПСИХОЛОГІЧНИЙ СТАН */}
      {currentMentalHealthDocked && mentalHealthState.showIndicator && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setCurrentMentalHealthDocked(false);
            setIsMentalHealthDocked(false);
            try {
              localStorage.setItem('quit-smoking:mental-health-docked', 'false');
              window.dispatchEvent(new Event('mental-health-docked-change'));
              window.dispatchEvent(new Event('storage'));
            } catch {}
          }}
          className={itemClassName}
          title={`Психологічний стан (${mentalHealthState.pct}%). Натисніть, щоб зняти закріплення.`}
        >
          <div className={iconWrapperClassName}>
            {iconStyle === 'sparkles' ? (
              <Sparkle className="w-5 h-5 text-[#FFFDD0] shrink-0" />
            ) : (
              <RefractedPrismBrainIcon className="w-5 h-5 shrink-0" />
            )}
          </div>
          <span className={textClassName}>
            {mentalHealthState.pct}%
          </span>
        </div>
      )}

      {/* 7. ЩОДЕННИК ВДЯЧНОСТІ */}
      {currentGratitudeDocked && gratitudeState.showIndicator && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setCurrentGratitudeDocked(false);
            setIsGratitudeDocked(false);
            try {
              localStorage.setItem('quit-smoking:gratitude-docked', 'false');
              window.dispatchEvent(new Event('gratitude-docked-change'));
              window.dispatchEvent(new Event('storage'));
            } catch {}
          }}
          className={itemClassName}
          title={`Щоденник вдячності (${gratitudeState.count} записів). Натисніть, щоб зняти закріплення.`}
        >
          <div className={iconWrapperClassName}>
            {iconStyle === 'sparkles' ? (
              <Sparkle className="w-5 h-5 text-[#FFFDD0] shrink-0" />
            ) : (
              <RefractedPrismBookIcon className="w-5 h-5 shrink-0" />
            )}
          </div>
          <span className={textClassName}>
            {gratitudeState.count}
          </span>
        </div>
      )}

    </div>
  );
});
