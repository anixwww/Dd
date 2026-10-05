import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckSquare, Brain, BookOpen, Maximize2, Minimize2 } from 'lucide-react';
import { DailyStepsSection } from '../DailyStepsSection';
import { MentalHealthCard } from '../MentalHealthCard';
import { GratitudeJournalCard } from '../GratitudeJournalCard';
import { GoalSettingsModal } from '../GoalSettingsModal';
import { MotivationalPhrasesModal, MotivationStyle } from '../MotivationalPhrasesModal';
import { IndicatorSettingsModal } from '../IndicatorSettingsModal';
import { HealthAnalyzerModal } from '../HealthAnalyzerModal';
import { HEALTH_MILESTONES } from '../../data/healthData';
import { Activity } from 'lucide-react';

const WhoMilestonesModal: React.FC<{ isOpen: boolean; onClose: () => void; diffMs?: number }> = ({ isOpen, onClose, diffMs = 0 }) => {
  if (!isOpen || typeof document === 'undefined') return null;
  return createPortal(
    <div 
      className="fixed inset-0 z-[500] flex items-center justify-center p-3.5 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#121217] border border-zinc-800 rounded-3xl max-w-lg w-full max-h-[86vh] sm:max-h-[88vh] overflow-hidden flex flex-col p-5 sm:p-6 text-white shadow-2xl animate-in fade-in zoom-in-95 origin-center duration-200 my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-zinc-800 shrink-0">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            Рубежі одужання за ВООЗ
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer transition-colors"
            title="Закрити"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar pb-6 sm:pb-2">
          {HEALTH_MILESTONES.map((m, idx) => {
            const isDone = diffMs >= m.t;
            return (
              <div key={idx} className={`p-3.5 rounded-2xl border ${isDone ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' : 'bg-zinc-900/80 border-zinc-800 text-zinc-400'}`}>
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
    </div>,
    document.body
  );
};
import { MoneySettings, GoalsState, Streak } from '../../types';

interface ModalContainerProps {
  modals: any;
  setIsStepsOpen: (val: boolean) => void;
  isStepsOpen: boolean;
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
  } = modals;

  const setIsMentalHealthOpen = (v: boolean) => toggleModal('isMentalHealthOpen', v);
  const setIsGratitudeOpen = (v: boolean) => toggleModal('isGratitudeOpen', v);
  const setIsCoffeeBreakfastModalOpen = (v: boolean) => toggleModal('isCoffeeBreakfastModalOpen', v);
  const setIsGoalModalOpen = (v: boolean) => toggleModal('isGoalModalOpen', v);
  const setIsMotivationsModalOpen = (v: boolean) => toggleModal('isMotivationsModalOpen', v);
  const setIsAnalyzerModalOpen = (v: boolean) => toggleModal('isAnalyzerModalOpen', v);

  const [isWhoMilestonesModalOpen, setIsWhoMilestonesModalOpen] = React.useState(false);
  const [isStepsExpanded, setIsStepsExpanded] = useState(false);

  React.useEffect(() => {
    const handleOpenWho = () => setIsWhoMilestonesModalOpen(true);
    const handleOpenGoal = () => setIsGoalModalOpen(true);

    window.addEventListener('open-who-milestones-modal', handleOpenWho);
    window.addEventListener('open-goal-modal', handleOpenGoal);

    return () => {
      window.removeEventListener('open-who-milestones-modal', handleOpenWho);
      window.removeEventListener('open-goal-modal', handleOpenGoal);
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

      {isStepsOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[500] flex items-center justify-center p-3.5 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setIsStepsOpen(false)}
        >
          <div 
            className={`bg-[#121217] border border-zinc-800 rounded-3xl p-5 sm:p-6 w-full flex flex-col shadow-2xl transition-all duration-200 animate-in fade-in zoom-in-95 origin-center overflow-hidden text-zinc-100 my-auto text-left ${
              isStepsExpanded
                ? 'max-w-3xl sm:max-w-4xl h-[90vh]'
                : 'max-w-lg max-h-[86vh] sm:max-h-[88vh]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800 mb-3.5 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
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
                  onClick={() => setIsStepsExpanded(!isStepsExpanded)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                  title={isStepsExpanded ? "Згорнути" : "Розширити вікно"}
                >
                  {isStepsExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsStepsOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                  title="Закрити"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 pr-1 text-zinc-100 custom-scrollbar pb-2">
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
        </div>,
        document.body
      )}

      {isMentalHealthOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[500] flex items-center justify-center p-3.5 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setIsMentalHealthOpen(false)}
        >
          <div 
            className="bg-[#121217] border border-zinc-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg max-h-[86vh] sm:max-h-[88vh] flex flex-col shadow-2xl transition-all duration-200 animate-in fade-in zoom-in-95 origin-center overflow-hidden text-zinc-100 my-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800 mb-3.5 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
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
                  className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                  title="Закрити"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar pb-2">
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
        </div>,
        document.body
      )}

      {isGratitudeOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[500] flex items-center justify-center p-3.5 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setIsGratitudeOpen(false)}
        >
          <div 
            className="bg-[#121217] border border-zinc-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg max-h-[86vh] sm:max-h-[88vh] flex flex-col shadow-2xl transition-all duration-200 animate-in fade-in zoom-in-95 origin-center overflow-hidden text-zinc-100 my-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800 mb-3.5 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
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
                  className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                  title="Закрити"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar pb-2">
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
        </div>,
        document.body
      )}

      <GoalSettingsModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        goals={goals || { queue: [], done: [], base: 0 }}
        totalSaved={totalSaved}
        money={money}
        onAddGoal={onAddGoal || (() => {})}
        onCompleteGoal={onCompleteGoal || (() => {})}
        onDeleteGoal={onDeleteGoal || (() => {})}
      />

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

      <HealthAnalyzerModal
        isOpen={isAnalyzerModalOpen}
        onClose={() => setIsAnalyzerModalOpen(false)}
        diffMs={diffMs}
        onOpenHealthTab={onOpenHealthTab}
        onOpenQuickMechanics={() => {
          setIsAnalyzerModalOpen(false);
          window.dispatchEvent(new CustomEvent('open-quick-mechanics', { detail: 'menu' }));
        }}
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
