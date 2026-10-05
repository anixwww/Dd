import React from 'react';
import { Gift, Pin, Clock } from 'lucide-react';
import { RefractedPrismGiftIcon } from './RefractedStatusIcons';

interface GoalsSectionProps {
  goals: any;
  totalSaved: number;
  setIsGoalsDocked: (docked: boolean) => void;
  setIsGoalModalOpen: (open: boolean) => void;
  money: any;
  quickGoalNow: number;
}

export const GoalsSection = React.memo(({
  goals,
  totalSaved,
  setIsGoalsDocked,
  setIsGoalModalOpen,
  money,
  quickGoalNow,
}: GoalsSectionProps) => {
  const activeGoals = goals?.queue || [];
  const netSaved = Math.max(0, totalSaved - (goals?.base || 0));

  const activeGoal = activeGoals.length > 0 ? activeGoals[0] : null;
  const amount = activeGoal?.amount || 0;
  const cur = money?.cur || '₴';
  const pct = amount > 0 ? Math.min(100, Math.floor((netSaved / amount) * 100)) : 0;
  const isGoalReached = pct >= 100;

  // Estimate target accumulation date
  const dailyRate = money ? (money.perDay / (money.packSize || 20)) * money.packPrice : 0;
  const remainingAmount = Math.max(0, amount - netSaved);
  
  let estDateText = '';
  if (isGoalReached) {
    estDateText = 'Мета вже накопичена!';
  } else if (remainingAmount > 0 && dailyRate > 0) {
    const daysLeft = Math.ceil(remainingAmount / dailyRate);
    const targetDate = new Date(quickGoalNow + daysLeft * 24 * 60 * 60 * 1000);
    const formattedTargetDate = targetDate.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' });
    estDateText = formattedTargetDate;
  }

  return (
    <div 
      onClick={() => setIsGoalModalOpen(true)}
      className="w-full p-3.5 bg-[#18181f]/90 border border-zinc-800/80 hover:border-zinc-700 hover:bg-[#1f1f27] rounded-2xl transition-all duration-300 hover:scale-[1.01] shadow-xs active:scale-[0.98] text-left relative overflow-hidden group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center">
            <RefractedPrismGiftIcon className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-200">
            Ціль
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.vibrate) {
                try { navigator.vibrate(20); } catch {}
              }
              setIsGoalsDocked(true);
              try {
                localStorage.setItem('quit-smoking:goals-docked', 'true');
                window.dispatchEvent(new Event('goals-docked-change'));
                window.dispatchEvent(new Event('storage'));
              } catch {}
            }}
            className="w-8 h-8 flex items-center justify-center p-1.5 -mr-1 -my-1 text-zinc-400 hover:text-zinc-200 cursor-pointer rounded-xl hover:bg-zinc-800/60 active:scale-90 transition-all relative z-20 pointer-events-auto"
            title="Закріпити ціль у верхню панель"
          >
            <Pin className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeGoal ? (
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <span className="text-xs font-bold text-zinc-100 truncate">
              {activeGoal.name}
            </span>
            {amount > 0 && (
              <span className="text-[11px] font-mono font-bold text-zinc-200">
                {amount.toLocaleString('uk-UA')} {cur}
              </span>
            )}
          </div>

          <div>
            <div className="w-full h-2 bg-zinc-800/90 rounded-full overflow-hidden p-0.5 border border-zinc-700/60">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isGoalReached
                    ? 'bg-emerald-400'
                    : 'bg-zinc-300'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1 text-[10px]">
              <span className="text-zinc-400 font-medium truncate flex items-center gap-1">
                {isGoalReached ? (
                  <span className="text-emerald-400">Мета вже накопичена!</span>
                ) : estDateText ? (
                  <>
                    <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
                    <span>Очікується ~{estDateText}</span>
                  </>
                ) : (
                  <span>{netSaved.toLocaleString('uk-UA', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} {cur} з {amount.toLocaleString('uk-UA')} {cur}</span>
                )}
              </span>
              <span className="font-bold font-mono text-zinc-200 shrink-0">
                {pct}%
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <span className="text-xs font-bold text-zinc-300 truncate">
              Натисніть, щоб обрати бажану ціль
            </span>
            <span className="text-[11px] font-mono font-bold text-zinc-400 shrink-0">
              0 {cur}
            </span>
          </div>
          <div>
            <div className="w-full h-2 bg-zinc-800/90 rounded-full overflow-hidden p-0.5 border border-zinc-700/60">
              <div className="h-full rounded-full bg-zinc-600" style={{ width: '0%' }} />
            </div>
            <div className="flex justify-between items-center mt-1 text-[10px]">
              <span className="text-zinc-400 font-medium">Встановіть мету або подарунок</span>
              <span className="font-bold font-mono text-zinc-400">0%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

GoalsSection.displayName = 'GoalsSection';

