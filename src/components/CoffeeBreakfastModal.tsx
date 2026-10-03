import React, { useState } from 'react';
import { Coffee, Utensils, X, Check, Sparkles, Clock } from 'lucide-react';

interface CoffeeBreakfastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const CoffeeBreakfastModal: React.FC<CoffeeBreakfastModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [selectedBeverage, setSelectedBeverage] = useState<string>(' Еспресо / Американо');
  const [selectedFood, setSelectedBreakfastFood] = useState<string>('🥐 Повноцінний сніданок');
  const [note, setNote] = useState<string>('');

  if (!isOpen) return null;

  const BEVERAGES = [
    ' Еспресо / Американо',
    '🥛 Капучино / Лате',
    '🍵 Трав’яний / Зелений чай',
    '🍋 Тепла вода з лимоном',
    '🧃 Свіжий сік / Смузі'
  ];

  const BREAKFAST_ITEMS = [
    '🥐 Повноцінний гарний сніданок',
    '🥣 Вівсяна каша з ягодами',
    '🍳 Яєчня / Омлет з зеленню',
    '🥪 Сендвіч / Тост',
    '🍎 Фрукти та горіхи'
  ];

  const handleSave = () => {
    const d = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const todayStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}`;

    // 1. Mark morning ritual as completed for today
    try {
      localStorage.setItem(`quit-smoking:morning-${todayStr}`, 'true');
    } catch {}

    // 2. Add detailed entry to health history log
    try {
      const historyKey = 'quit-smoking:health-custom-logs';
      const savedLogs = localStorage.getItem(historyKey);
      const logs = savedLogs ? JSON.parse(savedLogs) : [];
      const newLog = {
        id: `coffee_${Date.now()}`,
        timestamp: Date.now(),
        dateStr: todayStr,
        timeStr,
        category: 'coffee',
        title: 'Кава & Сніданок',
        value: selectedBeverage,
        details: `${selectedFood}${note.trim() ? ` · Нотатка: ${note.trim()}` : ''}`
      };
      logs.unshift(newLog);
      localStorage.setItem(historyKey, JSON.stringify(logs));
    } catch {}

    // Dispatch events to notify all listening components
    window.dispatchEvent(new Event('storage'));

    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in transition-all">
      <div className="bg-[#16161a] border border-amber-500/30 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-wide">
                Кава & Сніданок
              </h3>
              <p className="text-xs text-zinc-400">
                Затишний ранковий ритуал регенерації
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

        {/* Beverage Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Coffee className="w-3.5 h-3.5" />
            <span>Оберіть улюблений напій:</span>
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {BEVERAGES.map((bev) => (
              <button
                key={bev}
                type="button"
                onClick={() => setSelectedBeverage(bev)}
                className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer border ${
                  selectedBeverage === bev
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-extrabold shadow-xs'
                    : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{bev}</span>
                {selectedBeverage === bev && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Breakfast Selection */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5" />
            <span>Оберіть сніданок:</span>
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {BREAKFAST_ITEMS.map((food) => (
              <button
                key={food}
                type="button"
                onClick={() => setSelectedBreakfastFood(food)}
                className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer border ${
                  selectedFood === food
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-extrabold shadow-xs'
                    : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{food}</span>
                {selectedFood === food && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Note Input */}
        <div>
          <input
            type="text"
            placeholder="Власні нотатки до ранку (необов'язково)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full text-xs p-2.5 bg-black/50 border border-zinc-700 rounded-xl text-white outline-none focus:border-amber-500"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-xs rounded-xl cursor-pointer shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Відзначити сніданок та каву в Карті Дня</span>
          </button>
        </div>
      </div>
    </div>
  );
};
