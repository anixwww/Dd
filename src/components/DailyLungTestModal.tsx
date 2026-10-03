import React from 'react';
import { X, Activity, Wind, Sparkles } from 'lucide-react';
import { StangeTestCard } from './StangeTestCard';

interface DailyLungTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (seconds: number) => void;
}

export const DailyLungTestModal: React.FC<DailyLungTestModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  if (!isOpen) return null;

  const handleTestComplete = (seconds: number) => {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    try {
      localStorage.setItem(`quit-smoking:daily-lung-test-done-${todayStr}`, 'true');
      localStorage.setItem('quit-smoking:last-lung-test-seconds', String(seconds));
      window.dispatchEvent(new CustomEvent('daily-lung-test-completed', { detail: { seconds } }));
      window.dispatchEvent(new Event('storage'));
    } catch {}

    if (onComplete) {
      onComplete(seconds);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#16161c] border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-2xl text-zinc-100 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 flex items-center justify-center shrink-0">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Щоденний замір
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-100 mt-0.5">
                Тест на обʼєм легень (Проба Штанге)
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Motivational note from Analyzer */}
        <div className="mb-4 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed font-normal">
          <Sparkles className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
          <p>
            Аналізатор обрав цей момент для заміру, щоб зафіксувати природну регенерацію твого бронхіального дерева та зростання життєвої ємності легень.
          </p>
        </div>

        {/* Embedded Stange Test Card */}
        <StangeTestCard onTestComplete={handleTestComplete} />

        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span className="text-[11px]">Результат автоматично оновиться в Аналізаторі</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 font-semibold transition-colors cursor-pointer active:scale-95"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};
