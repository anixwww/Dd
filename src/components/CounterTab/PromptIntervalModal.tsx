import React, { useState } from 'react';
import { X, Clock, Sparkles, Check, BellOff, Timer, RotateCcw } from 'lucide-react';

interface PromptIntervalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIntervalMin: number;
  onSelectInterval: (minutes: number) => void;
  onSetNextPromptIn: (minutes: number) => void;
}

const PRESET_INTERVALS = [
  { min: 15, label: '15 хв', desc: 'Для гострої фази тяги' },
  { min: 30, label: '30 хв', desc: 'Стандартний баланс' },
  { min: 45, label: '45 хв', desc: 'Спокійний ритм' },
  { min: 60, label: '1 год', desc: 'Погодинний моніторинг' },
  { min: 90, label: '1.5 год', desc: 'Зріз кожні 90 хвилин' },
  { min: 120, label: '2 год', desc: 'Глибокий самоконтроль' },
  { min: 0, label: 'Ручний режим', desc: 'Тільки коли ви захочете' },
];

const SNOOZE_PRESETS = [
  { min: 0, label: 'Зараз', desc: 'Одразу готово до зрізу' },
  { min: 10, label: '+10 хв', desc: 'Коротка пауза' },
  { min: 15, label: '+15 хв', desc: 'Через 15 хвилин' },
  { min: 30, label: '+30 хв', desc: 'Через пів години' },
  { min: 60, label: '+1 год', desc: 'Через 60 хвилин' },
  { min: 120, label: '+2 год', desc: 'Через 2 години' },
];

export const PromptIntervalModal: React.FC<PromptIntervalModalProps> = ({
  isOpen,
  onClose,
  currentIntervalMin,
  onSelectInterval,
  onSetNextPromptIn
}) => {
  const [customMin, setCustomMin] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'interval' | 'nextTime'>('interval');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMin, 10);
    if (!isNaN(val) && val > 0) {
      if (activeTab === 'interval') {
        onSelectInterval(val);
      } else {
        onSetNextPromptIn(val);
      }
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#141418] border border-[#2a2a34] w-full max-w-md rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#262630] flex items-center justify-between bg-gradient-to-r from-teal-950/40 via-[#181820] to-emerald-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Час появи зрізу
              </h2>
              <p className="text-xs text-zinc-400">
                Налаштуйте інтервал або змініть час наступного зрізу
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="p-3 bg-[#181820] border-b border-[#262630] grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('interval')}
            className={`py-2 px-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'interval'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Інтервал зрізів</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nextTime')}
            className={`py-2 px-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'nextTime'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Наступний зріз</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-3">
          {activeTab === 'interval' ? (
            <>
              <div className="text-xs text-zinc-400 mb-2">
                Оберіть як часто з'являтиметься нагадування про оцінку вашого стану:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_INTERVALS.map((item) => {
                  const isSelected = currentIntervalMin === item.min;
                  return (
                    <button
                      key={item.min}
                      type="button"
                      onClick={() => {
                        onSelectInterval(item.min);
                        onClose();
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? 'bg-teal-500/20 border-teal-500/60 ring-1 ring-teal-500/40 text-white'
                          : 'bg-[#181820]/70 hover:bg-[#1f1f2a] border-[#2a2a38] text-zinc-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          {item.min === 0 ? <BellOff className="w-3.5 h-3.5 text-zinc-400" /> : <Clock className="w-3.5 h-3.5 text-teal-400" />}
                          <span>{item.label}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">{item.desc}</div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-teal-500 text-black flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="text-xs text-zinc-400 mb-2">
                Встановіть або перенесіть час наступного зрізу:
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SNOOZE_PRESETS.map((item) => (
                  <button
                    key={item.min}
                    type="button"
                    onClick={() => {
                      onSetNextPromptIn(item.min);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-[#181820]/70 hover:bg-teal-500/15 border border-[#2a2a38] hover:border-teal-500/40 text-left transition-all cursor-pointer group active:scale-95"
                  >
                    <div className="text-xs font-extrabold text-teal-300 group-hover:text-teal-200">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Custom Input */}
          <form onSubmit={handleCustomSubmit} className="mt-4 pt-3 border-t border-[#262630] flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="1440"
              value={customMin}
              onChange={(e) => setCustomMin(e.target.value)}
              placeholder={activeTab === 'interval' ? 'Власний інтервал (хв)' : 'Через скільки хвилин'}
              className="flex-1 bg-black/40 border border-[#2e2e3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={!customMin}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer transition-all active:scale-95"
            >
              Встановити
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#262630] bg-[#16161c] flex items-center justify-between text-[11px] text-zinc-400">
          <span>Зміни зберігаються автоматично</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};
