import React, { useState } from 'react';
import {
  Calculator,
  Flame,
  Coins,
  Minus,
  Plus,
  Sparkles,
  Palette,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  Zap,
  Leaf,
  Snowflake,
  Flower2,
  Waves,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { MoneySettings } from '../types';
import { AnimatedAnalyzerIcon } from './AnimatedAnalyzerIcon';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  money: MoneySettings | null;
  onUpdateMoney: (money: MoneySettings) => void;
  appTheme: string;
  onUpdateAppTheme: (theme: string) => void;
  analyzerStyle: 'standard' | 'autumn' | 'fire' | 'snowflake' | 'flower' | 'wave' | 'cat' | 'cosmic_ring';
  onUpdateAnalyzerStyle: (style: 'standard' | 'autumn' | 'fire' | 'snowflake' | 'flower' | 'wave' | 'cat' | 'cosmic_ring') => void;
  analyzerName?: string;
  onOpenMoreTab?: () => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  money,
  onUpdateMoney,
  appTheme,
  onUpdateAppTheme,
  analyzerStyle,
  onUpdateAnalyzerStyle,
  analyzerName = 'Аналізатор',
  onOpenMoreTab,
}) => {
  // Step 1: Calculator
  // Step 2: Theme
  // Step 3: Analyzer Skin (Static B&W)
  // Step 4: Analyzer Thoughts (Simplified)
  // Step 5: Final Showcase (Total 5 steps)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // ---------------------------------------------------------------------------
  // STEP 1: Calculator State
  // ---------------------------------------------------------------------------
  const [perDay, setPerDay] = useState<string>(() => String(money?.perDay || 20));
  const [packPrice, setPackPrice] = useState<string>(() => String(money?.packPrice || 100));
  const packSize = money?.packSize || 20;
  const minutesPerCig = money?.minutesPerCig || 7;

  const numPerDay = Math.max(1, parseFloat(perDay) || 20);
  const numPackPrice = Math.max(100, parseFloat(packPrice) || 100);

  const costPerCig = numPackPrice / packSize;
  const monthlySaved = Math.round(numPerDay * costPerCig * 30.5);
  const yearlySaved = Math.round(numPerDay * costPerCig * 365);
  const monthlyHoursGained = Math.round((numPerDay * minutesPerCig * 30.5) / 60);

  const handleSaveMoney = () => {
    const updated: MoneySettings = {
      ...(money || {}),
      perDay: numPerDay,
      packPrice: numPackPrice,
      packSize: 20,
      minutesPerCig: 7,
      cur: '₴',
    };
    onUpdateMoney(updated);
    try {
      localStorage.setItem('quit-smoking:money', JSON.stringify(updated));
    } catch {}
  };

  // ---------------------------------------------------------------------------
  // STEP 2: Theme State
  // ---------------------------------------------------------------------------
  const [selectedTheme, setSelectedTheme] = useState<string>(() => appTheme || 'standard-static');

  const THEMES_LIST = [
    {
      id: 'standard-static',
      name: 'Стандартна без анімацій',
      desc: 'Енергоефективна тема: 0% CPU, 120 FPS, максимальне заощадження заряду батареї',
      tag: 'Рекомендована',
      icon: Zap,
      color: 'text-zinc-300',
      bgColor: 'bg-zinc-800',
      borderActive: 'border-zinc-500',
      gradient: 'from-[#0c0d12] via-[#14151d] to-[#0a0b0e]',
    },
    {
      id: 'standard',
      name: 'Космос (Зоряний пил)',
      desc: 'Багатошаровий зоряний простір, спектральні зорі та спалахи супернової',
      icon: Sparkles,
      color: 'text-zinc-300',
      bgColor: 'bg-zinc-800',
      borderActive: 'border-zinc-500',
      gradient: 'from-slate-950 via-indigo-950 to-purple-950',
    },
    {
      id: 'autumn',
      name: 'Осіння затишна',
      desc: 'Медитативний листопад з 5 видами листя, сонячні промені та іскри каміна',
      icon: Leaf,
      color: 'text-zinc-300',
      bgColor: 'bg-zinc-800',
      borderActive: 'border-zinc-500',
      gradient: 'from-[#211510] via-[#2a170d] to-[#1c110d]',
    },
    {
      id: 'winter',
      name: 'Зимова',
      desc: 'Легкий медитативний снігопад, кристальні сніжинки та морозне сяйво',
      icon: Snowflake,
      color: 'text-zinc-300',
      bgColor: 'bg-zinc-800',
      borderActive: 'border-zinc-500',
      gradient: 'from-[#0d1829] via-[#14233c] to-[#0a1220]',
    },
    {
      id: 'spring',
      name: 'Весняна',
      desc: 'Ніжні пелюстки сакури з 3D-перевертанням, квітучий весняний сад',
      icon: Flower2,
      color: 'text-zinc-300',
      bgColor: 'bg-zinc-800',
      borderActive: 'border-zinc-500',
      gradient: 'from-[#21111a] via-[#2d1424] to-[#131f18]',
    },
    {
      id: 'summer',
      name: 'Літня морська',
      desc: 'Шовкові 4-ярусні хвилі з піною, сонячні зайчики та морський бриз',
      icon: Waves,
      color: 'text-zinc-300',
      bgColor: 'bg-zinc-800',
      borderActive: 'border-zinc-500',
      gradient: 'from-[#06182c] via-[#092c48] to-[#041220]',
    },
    {
      id: 'eco',
      name: 'Еко (Глибокий чорний)',
      desc: 'Ультра-економна глибока чорна тема (#000000) для OLED-дисплеїв',
      icon: Zap,
      color: 'text-zinc-300',
      bgColor: 'bg-zinc-800',
      borderActive: 'border-zinc-500',
      gradient: 'from-black via-zinc-950 to-black',
    },
  ];

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    onUpdateAppTheme(themeId);
    try {
      localStorage.setItem('quit-smoking:app-theme', themeId);
    } catch {}
  };

  // ---------------------------------------------------------------------------
  // STEP 3: Analyzer Shell State (Static B&W Previews)
  // ---------------------------------------------------------------------------
  const [selectedShell, setSelectedShell] = useState<typeof analyzerStyle>(analyzerStyle || 'cosmic_ring');

  const SHELLS_LIST: Array<{
    id: typeof analyzerStyle;
    name: string;
    desc: string;
  }> = [
    {
      id: 'cosmic_ring',
      name: 'Кільце',
      desc: 'Кільце чистої зоряної енергії',
    },
    {
      id: 'standard',
      name: 'Глітер',
      desc: 'Енергетична аура сили волі',
    },
    {
      id: 'autumn',
      name: 'Осінь',
      desc: 'Золотий вихор листя та іскор',
    },
    {
      id: 'snowflake',
      name: 'Сніжинка',
      desc: 'Морозна геометрична чистота',
    },
    {
      id: 'flower',
      name: 'Квітка',
      desc: 'Пелюстки весняного цвіту',
    },
    {
      id: 'wave',
      name: 'Хвиля',
      desc: 'Хвилі спокою та релаксації',
    },
    {
      id: 'cat',
      name: 'Чорний кіт',
      desc: 'Супутник затишку та рівноваги',
    },
  ];

  const handleSelectShell = (shellId: typeof analyzerStyle) => {
    setSelectedShell(shellId);
    onUpdateAnalyzerStyle(shellId);
    try {
      localStorage.setItem('quit-smoking:analyzer-style', shellId);
    } catch {}
  };

  // ---------------------------------------------------------------------------
  // STEP 4: Thoughts Toggle State
  // ---------------------------------------------------------------------------
  const [isThoughtsEnabled, setIsThoughtsEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:analyzer-disable-phrases') !== 'true';
    } catch {
      return true;
    }
  });

  const handleToggleThoughts = (enabled: boolean) => {
    setIsThoughtsEnabled(enabled);
    try {
      localStorage.setItem('quit-smoking:analyzer-disable-phrases', String(!enabled));
      window.dispatchEvent(new Event('analyzer-phrases-toggle'));
    } catch {}
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-2xl animate-fadeIn select-none overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-900/95 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 px-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
              <AnimatedAnalyzerIcon className="w-5 h-5 text-zinc-200 grayscale" active={false} />
            </div>
            <div>
              <div className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                <span>Персональне налаштування</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono font-bold">
                  Крок {currentStep} з 5
                </span>
              </div>
              <div className="text-[10px] text-zinc-400">
                Гід із {analyzerName}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleFinish(false)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Пропустити гід"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-zinc-500 via-zinc-400 to-zinc-200 transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* ================================================================= */}
          {/* STEP 1: КАЛЬКУЛЯТОР ЕКОНОМІЇ */}
          {/* ================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Analyzer Speech Bubble */}
              <div className="p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-700/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5 text-zinc-300">
                  <Calculator className="w-4 h-4" />
                </div>
                <div className="text-xs text-zinc-200 leading-relaxed font-medium">
                  <span className="font-bold text-zinc-100">Вітаю на старті! 🌟</span>
                  <p className="mt-1 text-zinc-300 text-[11.5px]">
                    Вкажи параметри для точного розрахунку заощаджень.
                  </p>
                </div>
              </div>

              {/* Direct Calculator Cards */}
              <div className="space-y-3">
                {/* Cigarettes per day */}
                <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-zinc-400" />
                      <span>Сигарет на день:</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = String(Math.max(1, numPerDay - 1));
                          setPerDay(nextVal);
                        }}
                        className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700 flex items-center justify-center font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-12 text-center text-sm font-mono font-black text-zinc-100 bg-zinc-900 py-0.5 rounded-lg border border-zinc-700">
                        {numPerDay}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = String(Math.min(100, numPerDay + 1));
                          setPerDay(nextVal);
                        }}
                        className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700 flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs text-zinc-400 ml-1">шт</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={numPerDay}
                    onChange={(e) => setPerDay(e.target.value)}
                    className="w-full accent-zinc-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
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
                <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                    <span className="flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-zinc-400" />
                      <span>Ціна за пачку:</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = String(Math.max(100, numPackPrice - 1));
                          setPackPrice(nextVal);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 hover:bg-zinc-700 active:scale-95 transition-all cursor-pointer"
                        title="Зменшити на 1 грн"
                      >
                        -1
                      </button>
                      <input
                        type="number"
                        min="100"
                        max="1000"
                        value={numPackPrice}
                        onChange={(e) => setPackPrice(e.target.value)}
                        className="w-16 text-center text-sm font-mono font-black text-zinc-100 bg-zinc-900 py-0.5 rounded-lg border border-zinc-700 focus:outline-hidden focus:border-zinc-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = String(Math.min(1000, numPackPrice + 1));
                          setPackPrice(nextVal);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 hover:bg-zinc-700 active:scale-95 transition-all cursor-pointer"
                        title="Збільшити на 1 грн"
                      >
                        +1
                      </button>
                      <span className="text-xs text-zinc-300 font-bold ml-1">грн</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="300"
                    step="1"
                    value={Math.min(300, Math.max(100, numPackPrice))}
                    onChange={(e) => setPackPrice(e.target.value)}
                    className="w-full accent-zinc-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                    <span>100 ₴</span>
                    <span>150 ₴</span>
                    <span>200 ₴</span>
                    <span>250 ₴</span>
                    <span>300 ₴</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 2: ВИБІР ТЕМИ */}
          {/* ================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Analyzer Speech Bubble */}
              <div className="p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-700/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5 text-zinc-300">
                  <Palette className="w-4 h-4" />
                </div>
                <div className="text-xs text-zinc-200 leading-relaxed font-medium">
                  <span className="font-bold text-zinc-100">Обери тему застосунку 🎨</span>
                  <p className="mt-1 text-zinc-300 text-[11.5px]">
                    Торкнись потрібної теми для швидкої зміни атмосфери.
                  </p>
                </div>
              </div>

              {/* Direct Themes List */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {THEMES_LIST.map((themeItem) => {
                  const IconComp = themeItem.icon;
                  const isSelected = selectedTheme === themeItem.id;
                  return (
                    <div
                      key={themeItem.id}
                      onClick={() => handleSelectTheme(themeItem.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-zinc-500 bg-zinc-800/90 shadow-md ring-1 ring-zinc-500/40'
                          : 'border-zinc-800 bg-zinc-950/80 hover:bg-zinc-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl ${themeItem.bgColor} ${themeItem.color} flex items-center justify-center shrink-0`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {themeItem.name}
                          </div>
                          {themeItem.tag && (
                            <div className="mt-0.5">
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 inline-flex items-center gap-1">
                                <Zap className="w-2.5 h-2.5" />
                                {themeItem.tag}
                              </span>
                            </div>
                          )}
                          <div className="text-[10px] text-zinc-400 leading-snug line-clamp-1 mt-0.5">
                            {themeItem.desc}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-zinc-700 border border-zinc-600 text-zinc-100 flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 3: ОБОЛОНКА АНАЛІЗАТОРА (СТАТИЧНІ ЧОРНО-БІЛІ ПРЕВ'Ю) */}
          {/* ================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Analyzer Speech Bubble */}
              <div className="p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-700/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5 text-zinc-300">
                  <AnimatedAnalyzerIcon className="w-4 h-4 grayscale" active={false} />
                </div>
                <div className="text-xs text-zinc-200 leading-relaxed font-medium">
                  <span className="font-bold text-zinc-100">Обери форму оболонки 🔮</span>
                  <p className="mt-1 text-zinc-300 text-[11.5px]">
                    Твій супутник на Головному екрані.
                  </p>
                </div>
              </div>

              {/* Direct Shell Grid with Static Black & White Previews */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
                {SHELLS_LIST.map((shell) => {
                  const isSelected = selectedShell === shell.id;
                  return (
                    <div
                      key={shell.id}
                      onClick={() => handleSelectShell(shell.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'border-zinc-500 bg-zinc-800/90 shadow-md ring-1 ring-zinc-500/40'
                          : 'border-zinc-800 bg-zinc-950/80 hover:bg-zinc-800/60'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                        <AnimatedAnalyzerIcon
                          styleMode={shell.id}
                          className="w-7 h-7 grayscale contrast-125 opacity-85"
                          active={false}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">
                          {shell.name}
                        </div>
                        <div className="text-[9.5px] text-zinc-400 truncate">
                          {shell.desc}
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-zinc-200 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 4: ДІАЛОГИ ТА ПІДТРИМКА */}
          {/* ================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Analyzer Speech Bubble */}
              <div className="p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-700/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5 text-zinc-300">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="text-xs text-zinc-200 leading-relaxed font-medium">
                  <span className="font-bold text-zinc-100">Діалоги та підтримка 💬</span>
                  <p className="mt-1 text-zinc-300 text-[11.5px]">
                    Обери зручний формат сповіщень та думок:
                  </p>
                </div>
              </div>

              {/* 2 Option Cards */}
              <div className="space-y-3">
                {/* Option 1: Enabled */}
                <div
                  onClick={() => handleToggleThoughts(true)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isThoughtsEnabled
                      ? 'border-zinc-500 bg-zinc-800/90 shadow-md ring-1 ring-zinc-500/40'
                      : 'border-zinc-800 bg-zinc-950/80 hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-zinc-800 text-zinc-200 flex items-center justify-center shrink-0 text-xl border border-zinc-700">
                      💬
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Увімкнути підтримку</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                          Рекомендовано
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                        Аналізатор показуватиме корисні поради, етапи відновлення тіла та слова мотивації.
                      </p>
                    </div>
                  </div>
                  {isThoughtsEnabled && (
                    <div className="w-5 h-5 rounded-full bg-zinc-700 border border-zinc-600 text-zinc-100 flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Option 2: Disabled */}
                <div
                  onClick={() => handleToggleThoughts(false)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    !isThoughtsEnabled
                      ? 'border-zinc-500 bg-zinc-800/90 shadow-md ring-1 ring-zinc-500/40'
                      : 'border-zinc-800 bg-zinc-950/80 hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0 text-xl border border-zinc-700">
                      🔕
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Тихий режим</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700">
                          Лише таймер
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                        Повна тиша без жодних думок та підказок. Лише чистий лічильник часу.
                      </p>
                    </div>
                  </div>
                  {!isThoughtsEnabled && (
                    <div className="w-5 h-5 rounded-full bg-zinc-700 border border-zinc-600 text-zinc-100 flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 5: ФІНАЛЬНИЙ ЗРІЗ І СТАРТ */}
          {/* ================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fadeIn py-4">
              {/* Visual Header Emblem */}
              <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-zinc-800/90 via-zinc-900/90 to-black/90 border border-zinc-700/80 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4 shadow-lg shadow-black/50">
                  <CheckCircle2 className="w-9 h-9 text-zinc-100" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-wide">
                  Все готово для старту!
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-sm leading-relaxed">
                  Трекер налаштовано. Попереду — життя без залежності та свобода!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 px-5 border-t border-zinc-800 bg-zinc-950/90 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 1) {
                  handleSaveMoney();
                }
                setCurrentStep((s) => s + 1);
              }}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 border border-zinc-600 text-zinc-100 hover:text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-black/40 transition-all cursor-pointer"
            >
              <span>Далі</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleFinish(false)}
              className="px-5 py-2.5 rounded-xl bg-zinc-200 hover:bg-white active:scale-95 text-zinc-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-black/40 transition-all cursor-pointer"
            >
              <span>На головну</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
