import React from 'react';
import { X, CheckSquare, Brain, BookOpen, Maximize2 } from 'lucide-react';
import { DailyStepsSection } from '../DailyStepsSection';
import { MentalHealthCard } from '../MentalHealthCard';
import { GratitudeJournalCard } from '../GratitudeJournalCard';
import { GoalSettingsModal } from '../GoalSettingsModal';
import { MotivationalPhrasesModal, MotivationStyle } from '../MotivationalPhrasesModal';
import { IndicatorSettingsModal } from '../IndicatorSettingsModal';
import { CoffeeBreakfastModal } from '../CoffeeBreakfastModal';
import { StateChartModal } from '../StateChartModal';
import { HealthAnalyzerModal } from '../HealthAnalyzerModal';
import { getBodySystemsRecovery, HEALTH_MILESTONES } from '../../data/healthData';
import { HeartPulse, Activity } from 'lucide-react';

const SystemsRecoveryModal: React.FC<{ isOpen: boolean; onClose: () => void; diffMs?: number }> = ({ isOpen, onClose, diffMs = 0 }) => {
  if (!isOpen) return null;
  const systems = getBodySystemsRecovery(diffMs);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#18181f] border border-zinc-700/80 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 text-white">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
          <h3 className="font-bold text-base flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-400" />
            Регенерація систем організму
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {systems.map((s, idx) => (
            <div key={idx} className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span>{s.name}</span>
                <span className="text-emerald-400 font-bold">{Math.round(s.progress)}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${s.progress}%` }} />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1.5">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WhoMilestonesModal: React.FC<{ isOpen: boolean; onClose: () => void; diffMs?: number }> = ({ isOpen, onClose, diffMs = 0 }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#18181f] border border-zinc-700/80 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 text-white">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            Рубежі одужання за ВООЗ
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {HEALTH_MILESTONES.map((m, idx) => {
            const isDone = diffMs >= m.t;
            return (
              <div key={idx} className={`p-3 rounded-xl border ${isDone ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' : 'bg-zinc-900/80 border-zinc-800 text-zinc-400'}`}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{m.title}</span>
                  <span>{isDone ? '✓ Досягнуто' : 'В процесі'}</span>
                </div>
                <p className="text-[11px] leading-relaxed">{m.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
import { MoneySettings, GoalsState, Streak } from '../../types';

interface ModalContainerProps {
  modals: any;
  setIsStepsOpen: (val: boolean) => void;
  isStepsOpen: boolean;
  isStepsPromptOpen: boolean;
  setIsStepsPromptOpen: (val: boolean) => void;
  handleUpdate: () => void;
  goals: GoalsState | undefined;
  totalSaved: number;
  money: MoneySettings | null;
  onAddGoal: ((name: string, amount?: number, targetDate?: string) => void) | undefined;
  onCompleteGoal: ((goalId: string) => void) | undefined;
  onDeleteGoal: ((goalId: string) => void) | undefined;
  reasons: string[];
  onUpdateReasons: ((reasons: string[]) => void) | undefined;
  motivationStyle: MotivationStyle;
  handleStyleChange: (style: MotivationStyle) => void;
  autoRotateMotivations: boolean;
  handleAutoRotateChange: (val: boolean) => void;
  accent: string;
  onUpdateMoney: ((money: MoneySettings) => void) | undefined;
  indicatorStyle: string;
  saveIndicatorStyle: (style: string) => void;
  setIsIndicatorSettingsOpen: (val: boolean) => void;
  isIndicatorSettingsOpen: boolean;
  analyzerHighlight: 'water' | 'sleep' | 'caffeine' | 'craving' | undefined;
  setAnalyzerHighlight: (val: any) => void;
  dayRatings: any;
  toggleModal: (key: any, val: boolean) => void;
  diffMs?: number;
  startDate?: number;
  cigsAvoided?: number;
  longestStreakMs?: number;
  streaks?: Streak[];
  onOpenSetup?: () => void;
  onOpenRelapse?: () => void;
  onUndoLastRelapse?: () => void;
  onOpenHealthTab?: () => void;
  isStepsDocked: boolean;
  setIsStepsDocked: (val: boolean) => void;
  isMentalHealthDocked: boolean;
  setIsMentalHealthDocked: (val: boolean) => void;
  isGratitudeDocked: boolean;
  setIsGratitudeDocked: (val: boolean) => void;
}

export const ModalContainer = React.memo(({
  modals,
  setIsStepsOpen,
  isStepsOpen,
  isStepsPromptOpen,
  setIsStepsPromptOpen,
  handleUpdate,
  goals,
  totalSaved,
  money,
  onAddGoal,
  onCompleteGoal,
  onDeleteGoal,
  reasons,
  onUpdateReasons,
  motivationStyle,
  handleStyleChange,
  autoRotateMotivations,
  handleAutoRotateChange,
  accent,
  onUpdateMoney,
  indicatorStyle,
  saveIndicatorStyle,
  setIsIndicatorSettingsOpen,
  isIndicatorSettingsOpen,
  analyzerHighlight,
  setAnalyzerHighlight,
  dayRatings,
  toggleModal,
  diffMs,
  startDate,
  cigsAvoided,
  longestStreakMs,
  streaks,
  onOpenSetup,
  onOpenRelapse,
  onUndoLastRelapse,
  onOpenHealthTab,
  isStepsDocked,
  setIsStepsDocked,
  isMentalHealthDocked,
  setIsMentalHealthDocked,
  isGratitudeDocked,
  setIsGratitudeDocked,
}: ModalContainerProps) => {
  const {
    isMentalHealthOpen,
    isGratitudeOpen,
    isCoffeeBreakfastModalOpen,
    isGoalModalOpen,
    isMotivationsModalOpen,
    isAnalyzerModalOpen,
    isTriggerDetectorOpen,
    isStateChartModalOpen,
  } = modals;

  const setIsMentalHealthOpen = (v: boolean) => toggleModal('isMentalHealthOpen', v);
  const setIsGratitudeOpen = (v: boolean) => toggleModal('isGratitudeOpen', v);
  const setIsCoffeeBreakfastModalOpen = (v: boolean) => toggleModal('isCoffeeBreakfastModalOpen', v);
  const setIsGoalModalOpen = (v: boolean) => toggleModal('isGoalModalOpen', v);
  const setIsMotivationsModalOpen = (v: boolean) => toggleModal('isMotivationsModalOpen', v);
  const setIsAnalyzerModalOpen = (v: boolean) => toggleModal('isAnalyzerModalOpen', v);
  const setIsTriggerDetectorOpen = (v: boolean) => toggleModal('isTriggerDetectorOpen', v);
  const setIsStateChartModalOpen = (v: boolean) => toggleModal('isStateChartModalOpen', v);

  const [isSystemsModalOpen, setIsSystemsModalOpen] = React.useState(false);
  const [isWhoMilestonesModalOpen, setIsWhoMilestonesModalOpen] = React.useState(false);

  React.useEffect(() => {
    const handleOpenSystems = () => setIsSystemsModalOpen(true);
    const handleOpenWho = () => setIsWhoMilestonesModalOpen(true);

    window.addEventListener('open-systems-recovery-modal', handleOpenSystems);
    window.addEventListener('open-who-milestones-modal', handleOpenWho);

    return () => {
      window.removeEventListener('open-systems-recovery-modal', handleOpenSystems);
      window.removeEventListener('open-who-milestones-modal', handleOpenWho);
    };
  }, []);

  return (
    <>
      <IndicatorSettingsModal
        isOpen={isIndicatorSettingsOpen}
        onClose={() => setIsIndicatorSettingsOpen(false)}
        displayStyle={indicatorStyle}
        onSave={saveIndicatorStyle}
      />

      {isStepsOpen && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-fadeIn p-4"
          onClick={() => setIsStepsOpen(false)}
        >
          <div 
            className="bg-[#141419]/95 dark:bg-[#141419]/95 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-5 sm:p-6 w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl transition-transform duration-300 animate-slideUp overflow-hidden text-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800/80 mb-3.5 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-100 tracking-wide">
                    Щоденні справи
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Корисні мікро-дії на сьогодні
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsStepsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-colors"
                  title="Закрити"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 pr-1 text-zinc-100">
              <DailyStepsSection 
                isOpen={true} 
                onToggle={() => {}} 
                onUpdate={handleUpdate} 
                isDocked={isStepsDocked}
                onDockChange={(docked) => {
                  setIsStepsDocked(docked);
                  try {
                    localStorage.setItem('quit-smoking:steps-docked', String(docked));
                    window.dispatchEvent(new Event('steps-docked-change'));
                    window.dispatchEvent(new Event('storage'));
                  } catch {}
                }}
              />
            </div>
          </div>
        </div>
      )}

      {isMentalHealthOpen && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-fadeIn p-4"
          onClick={() => setIsMentalHealthOpen(false)}
        >
          <div 
            className="bg-[#141419]/95 dark:bg-[#141419]/95 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-5 sm:p-6 w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl transition-transform duration-300 animate-slideUp overflow-hidden text-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800/80 mb-3.5 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-100 tracking-wide">
                    Ментальне здоров’я
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Практики спокою та внутрішнього балансу
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsMentalHealthOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-colors"
                  title="Закрити"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 pr-1">
              <MentalHealthCard 
                onUpdate={handleUpdate} 
                isDocked={isMentalHealthDocked}
                onDockChange={(docked) => {
                  setIsMentalHealthDocked(docked);
                  try {
                    localStorage.setItem('quit-smoking:mental-health-docked', String(docked));
                    window.dispatchEvent(new Event('mental-health-docked-change'));
                    window.dispatchEvent(new Event('storage'));
                  } catch {}
                }}
              />
            </div>
          </div>
        </div>
      )}

      {isGratitudeOpen && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-fadeIn p-4"
          onClick={() => setIsGratitudeOpen(false)}
        >
          <div 
            className="bg-[#141419]/95 dark:bg-[#141419]/95 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl p-5 sm:p-6 w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl transition-transform duration-300 animate-slideUp overflow-hidden text-zinc-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800/80 mb-3.5 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-100 tracking-wide">
                    Щоденник вдячності
                  </h2>
                  <p className="text-xs text-zinc-400">
                    3 приводи для радості та подяки сьогодні
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsGratitudeOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-colors"
                  title="Закрити"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 pr-1">
              <GratitudeJournalCard 
                onUpdate={handleUpdate} 
                isDocked={isGratitudeDocked}
                onDockChange={(docked) => {
                  setIsGratitudeDocked(docked);
                  try {
                    localStorage.setItem('quit-smoking:gratitude-docked', String(docked));
                    window.dispatchEvent(new Event('gratitude-docked-change'));
                    window.dispatchEvent(new Event('storage'));
                  } catch {}
                }}
              />
            </div>
          </div>
        </div>
      )}

      {goals && (
        <GoalSettingsModal
          isOpen={isGoalModalOpen}
          onClose={() => setIsGoalModalOpen(false)}
          goals={goals}
          totalSaved={totalSaved}
          money={money}
          onAddGoal={onAddGoal || (() => {})}
          onCompleteGoal={onCompleteGoal || (() => {})}
          onDeleteGoal={onDeleteGoal || (() => {})}
        />
      )}

      <MotivationalPhrasesModal
        isOpen={isMotivationsModalOpen}
        onClose={() => setIsMotivationsModalOpen(false)}
        reasons={reasons}
        onSaveReasons={(newReasons) => {
          onUpdateReasons?.(newReasons);
          try {
            localStorage.setItem('quit-smoking:reasons', JSON.stringify(newReasons));
            window.dispatchEvent(new Event('storage'));
          } catch {}
        }}
        currentStyle={motivationStyle}
        onStyleChange={handleStyleChange}
        autoRotate={autoRotateMotivations}
        onAutoRotateChange={handleAutoRotateChange}
        accent={accent}
      />

      <CoffeeBreakfastModal
        isOpen={isCoffeeBreakfastModalOpen}
        onClose={() => setIsCoffeeBreakfastModalOpen(false)}
        onSaved={handleUpdate}
      />

      <StateChartModal
        isOpen={isStateChartModalOpen}
        onClose={() => setIsStateChartModalOpen(false)}
        days={dayRatings}
      />

      <HealthAnalyzerModal
        isOpen={isAnalyzerModalOpen}
        onClose={() => setIsAnalyzerModalOpen(false)}
        diffMs={diffMs}
        onOpenHealthTab={onOpenHealthTab}
      />

      <SystemsRecoveryModal
        isOpen={isSystemsModalOpen}
        onClose={() => setIsSystemsModalOpen(false)}
        diffMs={diffMs}
      />

      <WhoMilestonesModal
        isOpen={isWhoMilestonesModalOpen}
        onClose={() => setIsWhoMilestonesModalOpen(false)}
        diffMs={diffMs}
      />
    </>
  );
});

ModalContainer.displayName = 'ModalContainer';
