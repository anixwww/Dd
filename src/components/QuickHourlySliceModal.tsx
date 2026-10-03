import React, { useState } from 'react';
import { X, Clock, Sparkles, Droplets, Heart, Zap, Check, Flame } from 'lucide-react';

interface QuickHourlySliceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (slice: {
    craving: number;
    energy: number;
    mood: number;
    waterAddedMl: number;
    isFullNorm?: boolean;
    symptoms: string[];
  }) => void;
}

const FEELING_TAGS = [
  { id: 'calm', label: '🧘 Спокійно' },
  { id: 'tension', label: '⚡ Напруга в тілі' },
  { id: 'headache', label: '🧠 Головний біль' },
  { id: 'thirsty', label: '💧 Спрага' },
  { id: 'tired', label: '🥱 Сонливість' },
  { id: 'hungry', label: '🍽️ Хочу їсти' },
];

export const QuickHourlySliceModal: React.FC<QuickHourlySliceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [craving, setCraving] = useState<number>(1);
  const [energy, setEnergy] = useState<number>(3);
  const [mood, setMood] = useState<number>(4);
  const [drankWater, setDrankWater] = useState<boolean>(false);
  const [drankFullNorm, setDrankFullNorm] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(['calm']);

  if (!isOpen) return null;

  const toggleTag = (id: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(id)) {
        return prev.filter((t) => t !== id);
      }
      return [...prev, id];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const waterAddedMl = drankFullNorm ? 2450 : (drankWater ? 250 : 0);
    onSubmit({
      craving,
      energy,
      mood,
      waterAddedMl,
      isFullNorm: drankFullNorm,
      symptoms: selectedTags,
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-zinc-900 border border-sky-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl text-white relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  Щогодинний зріз
                </span>
                <span className="text-xs text-zinc-400 font-mono">10 секунд</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Як ти почуваєшся прямо зараз?
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Craving scale */}
          <div className="p-3 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                <Flame className="w-4 h-4 text-rose-400" />
                Рівень тяги до паління
              </span>
              <span className={`font-bold ${craving >= 4 ? 'text-rose-400' : craving >= 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {craving === 1 ? 'Немає' : craving === 2 ? 'Легка' : craving === 3 ? 'Помітна' : craving === 4 ? 'Сильна' : 'Гостра'} ({craving}/5)
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setCraving(lvl)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    craving === lvl
                      ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)] scale-102'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Energy scale */}
          <div className="p-3 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                <Zap className="w-4 h-4 text-amber-400" />
                Рівень енергії / бадьорості
              </span>
              <span className="font-bold text-amber-300">
                {energy === 1 ? 'Спад' : energy === 2 ? 'Мляво' : energy === 3 ? 'Нормально' : energy === 4 ? 'Бадьоро' : 'Пік сил'} ({energy}/5)
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setEnergy(lvl)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    energy === lvl
                      ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-102 font-black'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Mood scale */}
          <div className="p-3 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                <Heart className="w-4 h-4 text-pink-400" />
                Настрій та емоційний спокій
              </span>
              <span className="font-bold text-pink-300">
                {mood === 1 ? 'Пригнічено' : mood === 2 ? 'Тривожно' : mood === 3 ? 'Рівно' : mood === 4 ? 'Добре' : 'Піднесено'} ({mood}/5)
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setMood(lvl)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mood === lvl
                      ? 'bg-pink-500 text-white shadow-[0_0_12px_rgba(236,72,153,0.4)] scale-102'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Water quick toggle */}
          <div className="space-y-2">
            <div 
              onClick={() => {
                if (!drankWater) {
                  setDrankWater(true);
                  setDrankFullNorm(false);
                } else {
                  setDrankWater(false);
                }
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                drankWater && !drankFullNorm
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                  : 'bg-zinc-800/40 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${drankWater && !drankFullNorm ? 'bg-sky-500 text-white' : 'bg-zinc-700 text-zinc-400'}`}>
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    Випив склянку води за останню годину?
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    {drankWater && !drankFullNorm ? '+250 мл буде додано до балансу' : 'Натисни, якщо випив воду (+250 мл)'}
                  </p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                drankWater && !drankFullNorm ? 'bg-sky-500 border-sky-400 text-white' : 'border-zinc-600'
              }`}>
                {drankWater && !drankFullNorm && <Check className="w-3.5 h-3.5" />}
              </div>
            </div>

            {/* Full norm toggle */}
            <div 
              onClick={() => {
                if (!drankFullNorm) {
                  setDrankFullNorm(true);
                  setDrankWater(false);
                } else {
                  setDrankFullNorm(false);
                }
              }}
              className={`p-2.5 px-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                drankFullNorm
                  ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-[0_0_15px_rgba(20,184,166,0.25)]'
                  : 'bg-zinc-800/30 border-zinc-700/60 text-zinc-400 hover:bg-zinc-800/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">💧</span>
                <span className="text-xs font-medium text-zinc-200">
                  Я вже випив усю денну норму води (100%)
                </span>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                drankFullNorm ? 'bg-teal-500 border-teal-400 text-white' : 'border-zinc-600'
              }`}>
                {drankFullNorm && <Check className="w-3 h-3" />}
              </div>
            </div>
          </div>

          {/* Sensation tags */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-zinc-300">Що відчуваєш прямо зараз?</span>
            <div className="flex flex-wrap gap-1.5">
              {FEELING_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                        : 'bg-zinc-800/80 border border-zinc-700 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Пізніше
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 active:scale-98 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Зберегти зріз</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
