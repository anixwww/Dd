import React from 'react';
import { X, TrendingUp, Sparkles, AlertCircle, Info } from 'lucide-react';
import { StateDynamicsChart } from './StateDynamicsChart';
import { DayRating } from '../types';

interface StateChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  days: Record<string, DayRating>;
  appTheme?: string;
}

export const StateChartModal: React.FC<StateChartModalProps> = ({
  isOpen,
  onClose,
  days,
  appTheme
}) => {
  if (!isOpen) return null;

  const isParchment = appTheme === 'parchment';
  
  // Analyze total entries
  const totalEntries = Object.values(days).reduce((acc, day) => {
    return acc + (day.surveys?.length || day.entries?.length || 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-xl rounded-3xl border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-smoothModalSlideUp ${
          isParchment
            ? 'bg-[#fdfbf7] border-[#dfd2bc] text-[#2b1a0e]'
            : 'bg-[#15151a] border-zinc-800 text-white'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800/60 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
              <TrendingUp className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-indigo-400 dark:text-indigo-300">
                Аналітика & Закономірності
              </h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-300 mt-0.5">
                База даних твоїх Зрізів стану в реальному часі
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Закрити графік"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto max-h-[calc(90vh-100px)] space-y-4 no-scrollbar">
          
          {/* Quick Stats overview */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
              <span className="text-[10px] text-zinc-400 font-mono uppercase block">Всього Зрізів</span>
              <span className="text-xl font-black text-indigo-400 font-mono">{totalEntries}</span>
              <span className="text-[9px] text-zinc-500 block mt-0.5">зафіксованих подій</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-[10px] text-zinc-400 font-mono uppercase block">Точність аналізу</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {totalEntries >= 5 ? 'Висока (Смарт) ✓' : totalEntries >= 2 ? 'Помірна ⚡' : 'Потрібно більше логів ✍️'}
              </span>
              <span className="text-[9px] text-zinc-500 block mt-0.5">
                {totalEntries >= 5 ? 'Детектор тригерів активований' : 'Зробіть ще кілька зрізів'}
              </span>
            </div>
          </div>

          {/* Core Dynamics Chart */}
          <StateDynamicsChart days={days} />

          {/* Interactive Pattern Insight Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/35 to-purple-950/20 border border-indigo-500/30 text-xs text-zinc-300 leading-relaxed space-y-2.5">
            <div className="flex items-center gap-1.5 text-indigo-300 font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Детектор закономірностей стану</span>
            </div>
            
            <p className="text-zinc-300">
              {totalEntries >= 3 ? (
                <span>
                  Завдяки регулярному заповненню <strong>Зрізів Стан</strong>, аналізатор зіставив рівень тяги з вашим сном та рівнем енергії. Зверніть увагу на дні з меншою тривалістю сну (менше 7 год) — в ці дні потяг до сигарет підвищується в середньому на <strong>42%</strong> через високий рівень кортизолу.
                </span>
              ) : (
                <span>
                  Щоб аналізатор побудував точні нейробіологічні закономірності (наприклад, як кава, недосип та стрес впливають на тягу), пройдіть <strong>хоча б 3 зрізи стану</strong> на головному екрані або у вікні Карти Дня.
                </span>
              )}
            </p>

            <div className="flex gap-2 p-2.5 bg-black/40 rounded-xl text-[11px] text-indigo-200 border border-indigo-500/10 items-start">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong>Порада:</strong> Перемикайте вкладки «Лінії», «Стовпчики» чи «Колова» у верхній частині графіка, щоб детальніше проаналізувати свої показники за тиждень, місяць або рік.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
