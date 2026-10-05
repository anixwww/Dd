import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Flame,
  Coins,
  Minus,
  Plus,
  Sparkles,
  ChevronRight,
  X,
  Zap
} from 'lucide-react';
import { MoneySettings } from '../types';


interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  money: MoneySettings | null;
  onUpdateMoney: (money: MoneySettings) => void;
  appTheme: string;
  onUpdateAppTheme: (theme: string) => void;
  analyzerStyle?: 'standard' | 'autumn' | 'fire' | 'snowflake' | 'flower' | 'wave' | 'cosmic_ring';
  onUpdateAnalyzerStyle?: (style: 'standard' | 'autumn' | 'fire' | 'snowflake' | 'flower' | 'wave' | 'cosmic_ring') => void;
  analyzerName?: string;
  onOpenMoreTab?: () => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  money,
  onUpdateMoney,
  appTheme: _appTheme,
  onUpdateAppTheme: _onUpdateAppTheme,
  analyzerStyle: _analyzerStyle,
  onUpdateAnalyzerStyle: _onUpdateAnalyzerStyle,
  analyzerName = 'Аналізатор',
  onOpenMoreTab,
}) => {
  // Step 1: Calculator
  // Step 2: Final Showcase (Total 2 steps)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // ---------------------------------------------------------------------------
  // STEP 1: Calculator State
  // ---------------------------------------------------------------------------
  const [perDay, setPerDay] = useState<string>(() => String(money?.perDay || 20));
  const [packPrice, setPackPrice] = useState<string>(() => String(money?.packPrice || 100));
  const [packSize, setPackSize] = useState<number>(() => money?.packSize || 20);
  const [minutesPerCig, setMinutesPerCig] = useState<number>(() => money?.minutesPerCig || 7);

  // Sync state whenever money prop updates from outside
  React.useEffect(() => {
    if (money) {
      setPerDay(String(money.perDay ?? 20));
      setPackPrice(String(money.packPrice ?? 100));
      setPackSize(money.packSize ?? 20);
      setMinutesPerCig(money.minutesPerCig ?? 7);
    }
  }, [money]);

  const numPerDay = Math.max(1, parseFloat(perDay) || 20);
  const numPackPrice = Math.max(1, Math.min(1000, parseFloat(packPrice) || 100));

  const costPerCig = numPackPrice / packSize;
  const monthlySaved = Math.round(numPerDay * costPerCig * 30.5);
  const yearlySaved = Math.round(numPerDay * costPerCig * 365);
  const monthlyHoursGained = Math.round((numPerDay * minutesPerCig * 30.5) / 60);

  const syncMoneyChanges = (newPerDay: number, newPackPrice: number, newPackSize: number, newMinutes: number) => {
    const updated: MoneySettings = {
      ...(money || {}),
      perDay: newPerDay,
      packPrice: newPackPrice,
      packSize: newPackSize,
      minutesPerCig: newMinutes,
      cur: '₴',
    };
    onUpdateMoney(updated);
    try {
      localStorage.setItem('quit-smoking:money', JSON.stringify(updated));
      window.dispatchEvent(new Event('money-settings-changed'));
      window.dispatchEvent(new Event('calculator-saved-change'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const handleSaveMoney = () => {
    syncMoneyChanges(numPerDay, numPackPrice, packSize, minutesPerCig);
  };

  // ---------------------------------------------------------------------------
  // Completion
  // ---------------------------------------------------------------------------
  const handleFinish = (goToMore: boolean = false) => {
    try {
      localStorage.setItem('quit-smoking:initial-walkthrough-completed', 'true');
    } catch {}
    onClose();
    try {
      window.dispatchEvent(new Event('guided-tour-finished-go-home'));
    } catch {}
    if (goToMore && onOpenMoreTab) {
      setTimeout(() => onOpenMoreTab(), 150);
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 select-none overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#12131a]/95 border border-zinc-800/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in zoom-in-95 duration-200 origin-center text-left">
        
        {/* Header Bar */}
        <div className="p-3.5 px-4.5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-200 shadow-xs">
              <Sparkles className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                <span>Персональне налаштування</span>
              </div>
              <div className="text-[10px] text-zinc-400">
                Гід із {analyzerName}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleFinish(false)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 transition-colors cursor-pointer"
            title="Пропустити гід"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1 scrollbar-thin scrollbar-thumb-zinc-800">
          
          {/* КАЛЬКУЛЯТОР ЕКОНОМІЇ */}
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Summary Stats Grid (Main Page & Statistics style) */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Місяць</div>
                <div className="text-sm font-bold text-zinc-100 truncate">
                  {monthlySaved.toLocaleString('uk-UA')} <span className="text-[10px] font-normal text-zinc-400">₴</span>
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Рік</div>
                <div className="text-sm font-bold text-zinc-100 truncate">
                  {yearlySaved.toLocaleString('uk-UA')} <span className="text-[10px] font-normal text-zinc-400">₴</span>
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Час / міс</div>
                <div className="text-sm font-bold text-zinc-100 truncate">
                  +{monthlyHoursGained} <span className="text-[10px] font-normal text-zinc-400">год</span>
                </div>
              </div>
            </div>

            {/* Direct Calculator Cards */}
            <div className="space-y-2.5">
              {/* Cigarettes per day */}
              <div className="p-3 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <Flame className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Сигарет на день:</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = Math.max(1, numPerDay - 1);
                        setPerDay(String(nextVal));
                        syncMoneyChanges(nextVal, numPackPrice, packSize, minutesPerCig);
                      }}
                      className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 flex items-center justify-center text-xs font-bold cursor-pointer active:scale-95"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-10 text-center text-sm font-mono font-bold text-zinc-100 bg-zinc-950/80 py-0.5 rounded-lg border border-zinc-800">
                      {numPerDay}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = Math.min(100, numPerDay + 1);
                        setPerDay(String(nextVal));
                        syncMoneyChanges(nextVal, numPackPrice, packSize, minutesPerCig);
                      }}
                      className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 flex items-center justify-center text-xs font-bold cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="text-xs text-zinc-400 ml-0.5 font-mono">шт</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  step="1"
                  value={numPerDay}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPerDay(String(v));
                    syncMoneyChanges(v, numPackPrice, packSize, minutesPerCig);
                  }}
                  className="w-full accent-zinc-200 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                  <span>1 шт</span>
                  <span>10</span>
                  <span>20 (пачка)</span>
                  <span>40</span>
                  <span>60 шт</span>
                </div>
              </div>

              {/* Price per pack */}
              <div className="p-3 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <Coins className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Ціна за пачку (100–300 грн):</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = Math.max(1, numPackPrice - 1);
                        setPackPrice(String(nextVal));
                        syncMoneyChanges(numPerDay, nextVal, packSize, minutesPerCig);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer font-mono"
                      title="Зменшити на 1 грн"
                    >
                      -1
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={packPrice}
                      onChange={(e) => {
                        const text = e.target.value.replace(/[^0-9]/g, '');
                        setPackPrice(text);
                        if (text !== '') {
                          const v = Number(text);
                          if (v >= 1 && v <= 1000) {
                            syncMoneyChanges(numPerDay, v, packSize, minutesPerCig);
                          }
                        }
                      }}
                      onBlur={() => {
                        let v = Number(packPrice);
                        if (isNaN(v) || v < 1) v = 100;
                        if (v > 1000) v = 1000;
                        setPackPrice(String(v));
                        syncMoneyChanges(numPerDay, v, packSize, minutesPerCig);
                      }}
                      className="w-14 text-center text-sm font-mono font-bold text-zinc-100 bg-zinc-950/80 py-0.5 rounded-lg border border-zinc-800 focus:outline-none focus:border-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = Math.min(1000, numPackPrice + 1);
                        setPackPrice(String(nextVal));
                        syncMoneyChanges(numPerDay, nextVal, packSize, minutesPerCig);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer font-mono"
                      title="Збільшити на 1 грн"
                    >
                      +1
                    </button>
                    <span className="text-xs text-zinc-400 font-mono font-bold ml-0.5">грн</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="100"
                  max="300"
                  step="1"
                  value={numPackPrice}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPackPrice(String(v));
                    syncMoneyChanges(numPerDay, v, packSize, minutesPerCig);
                  }}
                  className="w-full accent-zinc-200 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                  <span>100 ₴</span>
                  <span>150 ₴</span>
                  <span>200 ₴</span>
                  <span>250 ₴</span>
                  <span>300 ₴</span>
                </div>
              </div>

              {/* Cigarettes per pack */}
              <div className="p-3 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Сигарет у пачці:</span>
                  </span>
                  <span className="font-mono font-bold text-zinc-100 text-xs">
                    {packSize} шт
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[20, 25, 30].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setPackSize(sz);
                        syncMoneyChanges(numPerDay, numPackPrice, sz, minutesPerCig);
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer text-center ${
                        packSize === sz
                          ? 'bg-zinc-200 text-zinc-950 border-zinc-200 shadow-xs'
                          : 'bg-zinc-950/80 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      {sz} {sz === 20 ? '(стандарт)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutes per cigarette */}
              <div className="p-3 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <Zap className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Часу на одну сигарету:</span>
                  </span>
                  <span className="font-mono font-bold text-zinc-100 text-xs">
                    {minutesPerCig} хв
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 5, 7, 10].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMinutesPerCig(m);
                        syncMoneyChanges(numPerDay, numPackPrice, packSize, m);
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer text-center ${
                        minutesPerCig === m
                          ? 'bg-zinc-200 text-zinc-950 border-zinc-200 shadow-xs'
                          : 'bg-zinc-950/80 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      {m} хв {m === 7 ? '★' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-3.5 px-4.5 border-t border-zinc-800/80 bg-zinc-950/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              handleSaveMoney();
              handleFinish(false);
            }}
            className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-zinc-100 hover:bg-white active:scale-95 text-zinc-950 text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span>Почати</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
