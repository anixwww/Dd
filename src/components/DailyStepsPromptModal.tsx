import React, { useState } from 'react';
import { CheckSquare, Sparkles, X, Plus, Check, ShieldCheck, Clock } from 'lucide-react';
import { DailyMicroStep } from '../types';

interface DailyStepsPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSteps: (steps: DailyMicroStep[]) => void;
}

const PRESET_IDEAS = [
  '💧 Випити склянку холодної води з лимоном',
  '🧘 Зробити 5 хвилин дихальної релаксації',
  '🚶 Зробити прогулянку 15 хвилин на свіжому повітрі',
  '🍏 З\'їсти свіже яблуко чи горіхи при бажанні закурити',
  ' Заварити соковитий трав\'яний чай замість перекуру',
  '🏋️ Зробити 15 віджимань чи легку зарядку',
  '📖 Прочитати 5 сторінок натхненної книги',
  '🧘‍️ Написати 3 вдячності у щоденник'
];

const STEPS_STORAGE_KEY = 'quit-smoking:daily-micro-steps';
const SHOW_INDICATOR_KEY = 'quit-smoking:daily-steps-show-indicator';

export const DailyStepsPromptModal: React.FC<DailyStepsPromptModalProps> = ({
  isOpen,
  onClose,
  onSaveSteps
}) => {
  if (!isOpen) return null;

  const [selectedPresets, setSelectedPresets] = useState<string[]>([
    PRESET_IDEAS[0],
    PRESET_IDEAS[1],
    PRESET_IDEAS[3]
  ]);
  const [customSteps, setCustomSteps] = useState<string[]>([]);
  const [customInputText, setCustomInputText] = useState('');

  const togglePreset = (preset: string) => {
    setSelectedPresets((prev) =>
      prev.includes(preset) ? prev.filter((p) => p !== preset) : [...prev, preset]
    );
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInputText.trim();
    if (!trimmed) return;
    setCustomSteps((prev) => [...prev, trimmed]);
    setCustomInputText('');
  };

  const handleRemoveCustom = (idx: number) => {
    setCustomSteps((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const allTitles = [...selectedPresets, ...customSteps];
    if (allTitles.length === 0) {
      onClose();
      return;
    }

    const newSteps: DailyMicroStep[] = allTitles.map((title, index) => ({
      id: `step_${Date.now()}_${index}`,
      title,
      isCustom: true,
      createdAt: Date.now()
    }));

    try {
      localStorage.setItem(STEPS_STORAGE_KEY, JSON.stringify(newSteps));
      localStorage.setItem(SHOW_INDICATOR_KEY, 'true');
    } catch {}

    onSaveSteps(newSteps);
    onClose();
  };

  const totalCount = selectedPresets.length + customSteps.length;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-fadeIn p-4">
      <div className="bg-[#16161a] border border-[#2a2a32] rounded-3xl p-5 sm:p-6 w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl transition-transform duration-300 animate-slideUp overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 text-white flex items-center justify-center shrink-0">
              <CheckSquare className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-1.5">
                <span>Справи на день</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              </h2>
              <p className="text-xs text-zinc-400">
                Корисні мікро-дії для легшого подолання тяги
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
            title="Закрити"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informative Banner */}
        <div className="mb-3.5 p-3 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex items-start gap-2.5 text-xs shrink-0">
          <Clock className="w-4 h-4 text-teal-400 flex-none mt-0.5" />
          <p className="text-zinc-300 leading-relaxed text-[11px]">
            Маленькі щоденні кроки полегшують відмову від нікотину. Оберіть готові ідеї або додайте власні справи на сьогодні.
          </p>
        </div>

        {/* Presets and Custom Inputs Container */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
          
          {/* Preset Ideas Selection */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
              Рекомендовані звички:
            </label>

            <div className="space-y-1.5">
              {PRESET_IDEAS.map((preset) => {
                const isSelected = selectedPresets.includes(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => togglePreset(preset)}
                    className={`w-full p-2.5 rounded-2xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-500/50 text-white font-medium shadow-xs'
                        : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="pr-2">{preset}</span>
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-none transition-colors ${
                        isSelected
                          ? 'bg-teal-500 border-teal-500 text-white'
                          : 'border-white/20 bg-white/5'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add Custom Task Input */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Додати власну справу:
            </label>

            <form onSubmit={handleAddCustom} className="flex gap-2">
              <input
                type="text"
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                placeholder="Наприклад: Випити склянку чаю..."
                className="flex-1 px-3 py-2 bg-black/40 border border-[#2a2a32] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
              />
              <button
                type="submit"
                disabled={!customInputText.trim()}
                className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Додати</span>
              </button>
            </form>

            {/* Added Custom Tasks List */}
            {customSteps.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {customSteps.map((task, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/25 text-xs text-white flex items-center justify-between"
                  >
                    <span>️ {task}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustom(idx)}
                      className="p-1 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3.5 border-t border-white/10 flex flex-col gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            disabled={totalCount === 0}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Зберегти ({totalCount}) та активувати індикатор</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-1.5 text-zinc-400 hover:text-white text-xs font-medium text-center transition-colors cursor-pointer"
          >
            Заповнити пізніше
          </button>
        </div>

      </div>
    </div>
  );
};
