import React, { useState } from 'react';
import { Sword, X, BellOff, ArrowRight, ClipboardList, Sparkles, Check, CheckSquare } from 'lucide-react';

interface IntermediatePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDisableReminders?: () => void;
  onSubmit: (entry: {
    craving: number;
    energy: number;
    balance: number;
    focus: number;
    mood: number;
    anxiety: number;
    note: string;
    triggers?: string[];
    symptoms?: string[];
    somaticNeeds?: string[];
  }) => void;
}

const AVAILABLE_TRIGGERS = [
  { id: 'stress', label: '💼 Стрес / Робота' },
  { id: 'coffee', label: '☕ Після кави' },
  { id: 'eating', label: '🍔 Після їжі' },
  { id: 'friends', label: '👥 У компанії' },
  { id: 'bored', label: '⏳ Очікування / Нудьга' },
  { id: 'driving', label: '🚗 Транзит / За кермом' }
];

const AVAILABLE_SYMPTOMS = [
  { id: 'tension', label: '⚡ Напруга в тілі' },
  { id: 'headache', label: '🧠 Головний біль' },
  { id: 'cough', label: '💨 Кашель / Першіння' },
  { id: 'pulse', label: '🫀 Швидкий пульс' },
  { id: 'normal', label: '🧘 Фізично спокійно' }
];

const AVAILABLE_NEEDS = [
  { id: 'hungry', label: '🍽️ Відчуваю голод' },
  { id: 'thirsty', label: '💧 Спрага / Мало води' },
  { id: 'tired', label: '🥱 Втома / Недосип' }
];

export const IntermediatePromptModal: React.FC<IntermediatePromptModalProps> = ({
  isOpen,
  onClose,
  onDisableReminders,
  onSubmit
}) => {
  const [isDetailed, setIsDetailed] = useState(false);
  const [craving, setCraving] = useState<number>(1);
  const [energy, setEnergy] = useState<number>(4);
  const [balance, setBalance] = useState<number>(4);
  const [focus, setFocus] = useState<number>(4);
  const [note, setNote] = useState<string>('');

  // Detailed survey selections
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleTrigger = (label: string) => {
    setSelectedTriggers(prev =>
      prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]
    );
  };

  const toggleSymptom = (label: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    );
  };

  const toggleNeed = (label: string) => {
    setSelectedNeeds(prev =>
      prev.includes(label) ? prev.filter(n => n !== label) : [...prev, label]
    );
  };

  const renderScale = (
    label: string,
    value: number,
    onChange: (v: number) => void,
    low: string,
    high: string,
    colorIndicator?: string
  ) => (
    <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-zinc-300 tracking-wide">{label}</span>
        <span className={`font-mono font-bold text-sm ${colorIndicator || 'text-emerald-400'}`}>
          {value}/5
        </span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer border ${
              value === v
                ? 'bg-white text-slate-900 border-white shadow-md scale-102 font-extrabold'
                : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between text-[9px] text-zinc-500">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );

  const handleSave = () => {
    onSubmit({
      craving,
      energy,
      balance,
      focus,
      mood: balance,
      anxiety: Math.max(1, 6 - balance),
      note: note.trim(),
      triggers: isDetailed ? selectedTriggers : [],
      symptoms: isDetailed ? selectedSymptoms : [],
      somaticNeeds: isDetailed ? selectedNeeds : []
    });
    
    // Reset state
    setIsDetailed(false);
    setNote('');
    setSelectedTriggers([]);
    setSelectedSymptoms([]);
    setSelectedNeeds([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in transition-all duration-300">
      <div className="bg-[#121216] border border-[#2a2a35] rounded-3xl p-5 sm:p-6 max-w-sm sm:max-w-md w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-white transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center">
              <Sword className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                {isDetailed ? 'Детальний зріз стану' : 'Зріз стану'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Параметри для смарт-аналізатора здоров'я
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
            title="Закрити"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Warning Alert Box */}
        {craving >= 3 && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-start gap-2.5 text-xs text-rose-300 leading-snug animate-pulse-slow">
            <Sparkles className="w-4 h-4 text-rose-400 flex-none shrink-0" />
            <div>
              <span className="font-bold">Виявлено високий потяг!</span> Рекомендуємо скористатися детальним опитуванням, щоб виявити прихований тригер прямо зараз.
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="space-y-3.5 my-2">
          
          {/* Base Scales */}
          {renderScale('Тяга (потяг до куріння)', craving, setCraving, '1 - Відсутня', '5 - Дуже сильна', 'text-rose-400')}
          {renderScale('Енергія (життєвий тонус)', energy, setEnergy, '1 - Виснаження', '5 - Бадьорість', 'text-emerald-400')}
          
          {/* Detailed Toggle Button */}
          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => setIsDetailed(!isDetailed)}
              className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 ${
                isDetailed
                  ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                  : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>{isDetailed ? 'Сховати детальний аналіз ✓' : '📊 Пройти детальніше опитування'}</span>
            </button>
          </div>

          {/* Detailed Mode Sections */}
          {isDetailed && (
            <div className="space-y-4 pt-2 border-t border-white/5 animate-fade-in">
              
              {/* 1. Triggers Context */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block px-1">
                  1. Момент виникнення (Контекст / Тригер)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_TRIGGERS.map((item) => {
                    const isSelected = selectedTriggers.includes(item.label);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleTrigger(item.label)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-xs'
                            : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 flex-none" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Somatic Symptoms */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block px-1">
                  2. Фізичні відчуття (Симптоми)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_SYMPTOMS.map((item) => {
                    const isSelected = selectedSymptoms.includes(item.label);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleSymptom(item.label)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-xs'
                            : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 flex-none" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Physiological Needs */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block px-1">
                  3. Соматичні потреби (Дефіцити)
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {AVAILABLE_NEEDS.map((item) => {
                    const isSelected = selectedNeeds.includes(item.label);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleNeed(item.label)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-xs'
                            : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-none ${
                          isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Core Remaining Sliders (Only if not in detailed mode, to keep it clean) */}
          {!isDetailed && (
            <div className="space-y-3 animate-fade-in">
              {renderScale('Спокій (емоційна рівновага)', balance, setBalance, '1 - Тривожність', '5 - Гармонія', 'text-indigo-400')}
              {renderScale('Фокус (ясність та увага)', focus, setFocus, '1 - Розсіяність', '5 - Чіткий фокус', 'text-purple-400')}
            </div>
          )}

          {/* Text note */}
          <div>
            <input
              type="text"
              maxLength={80}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Коротка нотатка (напр. 'Дуже хотілося після обіду')"
              className="w-full text-xs p-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10 shrink-0">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 border border-white/10 text-xs font-semibold rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
            >
              Пізніше
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all active:scale-[0.98] text-center"
            >
              Зберегти зріз
            </button>
          </div>

          {/* Disabler Button */}
          {onDisableReminders && (
            <button
              type="button"
              onClick={() => {
                onDisableReminders();
                onClose();
              }}
              className="w-full py-2 text-xs font-medium text-zinc-500 hover:text-rose-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <BellOff className="w-3.5 h-3.5" />
              <span>Вимкнути нагадування зрізу</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
