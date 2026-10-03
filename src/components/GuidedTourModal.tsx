import React, { useState, useEffect, useMemo } from 'react';
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
  Eye,
  Sliders,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  MessageSquare,
  VolumeX,
  Volume2
} from 'lucide-react';
import { MoneySettings } from '../types';
import { TIMER_STYLES, getTimerStyleCssClass } from './CounterTab/TimerStyles';
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
  // Step 3: Analyzer Skin
  // Step 4: Analyzer Thoughts (Simplified)
  // Step 5: Timer Skin
  // Step 6: Final Showcase
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
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderActive: 'border-emerald-500',
      gradient: 'from-[#0c0d12] via-[#14151d] to-[#0a0b0e]',
    },
    {
      id: 'standard',
      name: 'Космос (Зоряний пил)',
      desc: 'Багатошаровий зоряний простір, спектральні зорі та спалахи супернової',
      icon: Sparkles,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
      borderActive: 'border-indigo-500',
      gradient: 'from-slate-950 via-indigo-950 to-purple-950',
    },
    {
      id: 'autumn',
      name: 'Осіння затишна',
      desc: 'Медитативний листопад з 5 видами листя, сонячні промені та іскри каміна',
      icon: Leaf,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      borderActive: 'border-amber-500',
      gradient: 'from-[#211510] via-[#2a170d] to-[#1c110d]',
    },
    {
      id: 'winter',
      name: 'Зимова',
      desc: 'Легкий медитативний снігопад, кристальні сніжинки та морозне сяйво',
      icon: Snowflake,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      borderActive: 'border-cyan-400',
      gradient: 'from-[#0d1829] via-[#14233c] to-[#0a1220]',
    },
    {
      id: 'spring',
      name: 'Весняна',
      desc: 'Ніжні пелюстки сакури з 3D-перевертанням, квітучий весняний сад',
      icon: Flower2,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      borderActive: 'border-pink-400',
      gradient: 'from-[#21111a] via-[#2d1424] to-[#131f18]',
    },
    {
      id: 'summer',
      name: 'Літня морська',
      desc: 'Шовкові 4-ярусні хвилі з піною, сонячні зайчики та морський бриз',
      icon: Waves,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      borderActive: 'border-cyan-400',
      gradient: 'from-[#06182c] via-[#092c48] to-[#041220]',
    },
    {
      id: 'eco',
      name: 'Еко (Глибокий чорний)',
      desc: 'Ультра-економна глибока чорна тема (#000000) для OLED-дисплеїв',
      icon: Zap,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderActive: 'border-emerald-400',
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
  // STEP 3: Analyzer Shell State
  // ---------------------------------------------------------------------------
  const [selectedShell, setSelectedShell] = useState<typeof analyzerStyle>(analyzerStyle || 'cosmic_ring');

  const SHELLS_LIST: Array<{
    id: typeof analyzerStyle;
    name: string;
    desc: string;
    badgeColor: string;
    bgGlow: string;
    borderGlow: string;
  }> = [
    {
      id: 'cosmic_ring',
      name: 'Кільце',
      desc: 'Гіпер-плавне кільце живої зоряної енергії',
      badgeColor: 'border-purple-500/40 text-purple-300',
      bgGlow: 'bg-purple-950/40',
      borderGlow: 'border-purple-500/40',
    },
    {
      id: 'standard',
      name: 'Глітер',
      desc: 'Неонова енергетична аура сили волі',
      badgeColor: 'border-indigo-500/40 text-indigo-300',
      bgGlow: 'bg-indigo-950/40',
      borderGlow: 'border-indigo-500/40',
    },
    {
      id: 'autumn',
      name: 'Осінь',
      desc: 'Теплий золотий вихор листя та іскор',
      badgeColor: 'border-amber-500/40 text-amber-300',
      bgGlow: 'bg-amber-950/40',
      borderGlow: 'border-amber-500/40',
    },
    {
      id: 'snowflake',
      name: 'Сніжинка',
      desc: 'Морозна геометрична чистота та ясний розум',
      badgeColor: 'border-cyan-500/40 text-cyan-300',
      bgGlow: 'bg-cyan-950/40',
      borderGlow: 'border-cyan-500/40',
    },
    {
      id: 'flower',
      name: 'Квітка',
      desc: 'Ніжне відродження та весняне розквітання',
      badgeColor: 'border-pink-500/40 text-pink-300',
      bgGlow: 'bg-pink-950/40',
      borderGlow: 'border-pink-500/40',
    },
    {
      id: 'wave',
      name: 'Хвиля',
      desc: 'Шовкові припливи спокою та зняття напруги',
      badgeColor: 'border-teal-500/40 text-teal-300',
      bgGlow: 'bg-teal-950/40',
      borderGlow: 'border-teal-500/40',
    },
    {
      id: 'cat',
      name: 'Чорний кіт',
      desc: 'Затишний медитативний супутник спокою',
      badgeColor: 'border-emerald-500/40 text-emerald-300',
      bgGlow: 'bg-emerald-950/40',
      borderGlow: 'border-emerald-500/40',
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
  // STEP 5: Timer Skin State
  // ---------------------------------------------------------------------------
  const [selectedTimerSkin, setSelectedTimerSkin] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:timer-horizon-effect') || 'classic';
    } catch {
      return 'classic';
    }
  });

  const deletedSkinIds = useMemo<string[]>(() => {
    try {
      const raw = localStorage.getItem('quit-smoking:deleted-timer-skins');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  }, []);

  const activeTimerStyles = useMemo(() => {
    const filtered = TIMER_STYLES.filter((s) => !deletedSkinIds.includes(s.id));
    const classicStyle = TIMER_STYLES.find((s) => s.id === 'classic');
    if (classicStyle && !filtered.some((s) => s.id === 'classic')) {
      return [classicStyle, ...filtered];
    }
    // Make sure classic is always first
    const withoutClassic = filtered.filter((s) => s.id !== 'classic');
    return classicStyle ? [classicStyle, ...withoutClassic] : filtered;
  }, [deletedSkinIds]);

  const handleSelectTimerSkin = (skinId: string) => {
    setSelectedTimerSkin(skinId);
    try {
      localStorage.setItem('quit-smoking:timer-horizon-effect', skinId);
      window.dispatchEvent(new Event('timer-effect-change'));
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
        <div className="p-4 px-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
              <AnimatedAnalyzerIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                <span>Персональне налаштування</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                  Крок {currentStep} з 6
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
        <div className="w-full bg-zinc-800 h-1">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
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
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Calculator className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs text-zinc-200 leading-relaxed font-medium">
                  <span className="font-bold text-purple-300">Вітаю на старті! 🌟</span>
                  <p className="mt-1 text-zinc-300 text-[11.5px]">
                    Вкажи параметри для точного розрахунку заощаджень.
                  </p>
                </div>
              </div>

              {/* DEMO WINDOW: LIVE CALCULATOR FROM «ЩЕ» */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-4 shadow-inner">
                <div className="flex items-center justify-between text-xs font-bold text-white pb-2 border-b border-zinc-800">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-400" />
                    <span>Демонстраційне вікно: Калькулятор</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    Миттєвий розрахунок ₴
                  </span>
                </div>

                {/* Cigarettes per day */}
                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                    <span>Сигарет на день:</span>
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
                      <span className="w-12 text-center text-sm font-mono font-black text-emerald-400 bg-zinc-950 py-0.5 rounded-lg border border-zinc-700">
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
                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
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
                <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                    <span className="flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-amber-400" />
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
                        className="w-16 text-center text-sm font-mono font-black text-emerald-400 bg-zinc-950 py-0.5 rounded-lg border border-zinc-700 focus:outline-hidden focus:border-emerald-500"
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
                      <span className="text-xs text-emerald-400 font-bold ml-1">грн</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="300"
                    step="1"
                    value={Math.min(300, Math.max(100, numPackPrice))}
                    onChange={(e) => setPackPrice(e.target.value)}
                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
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
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Palette className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-xs text-zinc-200 leading-relaxed font-medium">
                  <span className="font-bold text-indigo-300">Обери тему застосунку 🎨</span>
                  <p className="mt-1 text-zinc-300 text-[11.5px]">
                    Торкнись потрібної теми для швидкої зміни атмосфери.
                  </p>
                </div>
              </div>

              {/* DEMO WINDOW: LIVE THEME PREVIEW */}
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white pb-2 border-b border-zinc-800">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Демонстраційне вікно: Активна тема</span>
                  </span>
                  <span className="text-[10px] text-indigo-300 font-mono uppercase font-bold">
                    {THEMES_LIST.find((t) => t.id === selectedTheme)?.name || 'Стандартна без анімацій'}
                  </span>
                </div>

                {/* Interactive Theme Cards List */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {THEMES_LIST.map((themeItem) => {
                    const IconComp = themeItem.icon;
                    const isSelected = selectedTheme === themeItem.id;
                    return (
                      <div
                        key={themeItem.id}
                        onClick={() => handleSelectTheme(themeItem.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? `${themeItem.borderActive} bg-zinc-800/90 shadow-md ring-1 ring-purple-500/40`
                            : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60'
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
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1">
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
                          <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 3: ОБОЛОНКА АНАЛІЗАТОРА (РЕАЛЬНІ ЖИВІ МІНІАТЮРИ) */}
          {/* ================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Analyzer Speech Bubble */}
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <AnimatedAnalyzerIcon className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs text-zinc-200 leading-relaxed font-medium">
                  <span className="font-bold text-purple-300">Обери форму оболонки 🔮</span>
                  <p className="mt-1 text-zinc-300 text-[11.5px]">
                    Твій живий супутник на Головному екрані.
                  </p>
                </div>
              </div>

              {/* DEMO WINDOW: LIVE SHELL PREVIEW */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white pb-2 border-b border-zinc-800">
                  <span>Демонстраційне вікно: Оболонка</span>
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">
                    {SHELLS_LIST.find((s) => s.id === selectedShell)?.name}
                  </span>
                </div>

                {/* Live Shell Center Showcase */}
                <div className="h-32 rounded-2xl bg-gradient-to-b from-purple-950/40 via-zinc-950/70 to-black/80 border border-purple-500/30 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center relative">
                    <AnimatedAnalyzerIcon styleMode={selectedShell} className="w-16 h-16" active={true} />
                  </div>
                  <div className="text-xs font-bold text-purple-200 mt-1">
                    {SHELLS_LIST.find((s) => s.id === selectedShell)?.name}
                  </div>
                </div>

                {/* Shell Grid with Real Graphic Miniatures */}
                <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {SHELLS_LIST.map((shell) => {
                    const isSelected = selectedShell === shell.id;
                    return (
                      <div
                        key={shell.id}
                        onClick={() => handleSelectShell(shell.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? `${shell.borderGlow} ${shell.bgGlow} shadow-md ring-1 ring-purple-500/40`
                            : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl ${shell.bgGlow} border ${shell.borderGlow} flex items-center justify-center shrink-0 overflow-hidden shadow-xs`}>
                          <AnimatedAnalyzerIcon styleMode={shell.id} className="w-7 h-7" active={true} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate">
                            {shell.name}
                          </div>
                          <div className="text-[9.5px] text-zinc-400 truncate">
                            {shell.desc}
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 4: СПРОЩЕНИЙ ВИБІР: ПОВІДОМЛЕННЯ ТА ПІДТРИМКА */}
          {/* ================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Analyzer Speech Bubble */}
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs text-zinc-200 leading-relaxed font-medium">
                  <span className="font-bold text-purple-300">Діалоги та підтримка 💬</span>
                  <p className="mt-1 text-zinc-300 text-[11.5px]">
                    Обери зручний формат сповіщень та думок:
                  </p>
                </div>
              </div>

              {/* 2 Crystal-Clear Option Cards */}
              <div className="space-y-3">
                {/* Option 1: Enabled */}
                <div
                  onClick={() => handleToggleThoughts(true)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isThoughtsEnabled
                      ? 'border-purple-500 bg-purple-500/15 shadow-md ring-1 ring-purple-500/40'
                      : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 text-xl border border-purple-500/30">
                      💬
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Увімкнути підтримку</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Рекомендовано
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                        Аналізатор показуватиме корисні поради, етапи відновлення тіла та слова мотивації.
                      </p>
                    </div>
                  </div>
                  {isThoughtsEnabled && (
                    <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Option 2: Disabled */}
                <div
                  onClick={() => handleToggleThoughts(false)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    !isThoughtsEnabled
                      ? 'border-zinc-500 bg-zinc-800/80 shadow-md ring-1 ring-zinc-500/40'
                      : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60'
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
                    <div className="w-5 h-5 rounded-full bg-zinc-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 5: ОБОЛОНКА ТАЙМЕРА */}
          {/* ================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Analyzer Speech Bubble */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xs text-zinc-200 leading-relaxed font-medium">
                  <span className="font-bold text-amber-300">Оболонка таймера ⏱️</span>
                  <p className="mt-1 text-zinc-300 text-[11.5px]">
                    Обери стиль відображення чистого часу.
                  </p>
                </div>
              </div>

              {/* DEMO WINDOW: LIVE TIMER SKIN PREVIEW */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white pb-2 border-b border-zinc-800">
                  <span>Демонстраційне вікно: Таймер</span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                    {activeTimerStyles.find((s) => s.id === selectedTimerSkin)?.name || 'Класичний'}
                  </span>
                </div>

                {/* Live Simulation Card */}
                <div className="py-4 px-3 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col items-center justify-center shadow-inner">
                  <div className={`text-2xl sm:text-3xl font-mono font-black select-none tracking-tight ${getTimerStyleCssClass(selectedTimerSkin)}`}>
                    01д 04г 18хв 22с
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-1">
                    Чистого часу без нікотину
                  </div>
                </div>

                {/* Skin Selector List */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {activeTimerStyles.slice(0, 12).map((skin) => {
                    const isSelected = selectedTimerSkin === skin.id;
                    return (
                      <div
                        key={skin.id}
                        onClick={() => handleSelectTimerSkin(skin.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/15 shadow-sm'
                            : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                            <span>{skin.name}</span>
                            {skin.id === 'classic' && (
                              <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Класика
                              </span>
                            )}
                          </div>
                          <div className="text-[9.5px] text-zinc-400 truncate">
                            {skin.desc}
                          </div>
                        </div>

                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 6: ПОКРАЩЕНИЙ ФІНАЛ */}
          {/* ================================================================= */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-fadeIn py-1">
              {/* Visual Header Emblem */}
              <div className="p-5 rounded-3xl bg-gradient-to-b from-emerald-950/40 via-zinc-900/70 to-black/80 border border-emerald-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-2.5 shadow-lg shadow-emerald-950/50">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                  Все готово для старту!
                </h3>
                <p className="text-xs text-zinc-300 mt-1.5 max-w-sm leading-relaxed">
                  Трекер налаштовано. Попереду — життя без залежності та свобода!
                </p>
              </div>

              {/* Summary Status Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <div className="text-[10px] text-zinc-400 font-medium">Розрахунок економії</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5 font-mono">
                    ~{monthlySaved} ₴ / місяць
                  </div>
                  <div className="text-[9.5px] text-zinc-500 mt-0.5">
                    {numPerDay} сиг. по {numPackPrice} ₴/пачка
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <div className="text-[10px] text-zinc-400 font-medium">Обрана тема</div>
                  <div className="text-xs font-bold text-indigo-300 mt-0.5 truncate">
                    {THEMES_LIST.find((t) => t.id === selectedTheme)?.name || 'Стандартна без анімацій'}
                  </div>
                  <div className="text-[9.5px] text-zinc-500 mt-0.5">
                    Енергозберігаюча
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <div className="text-[10px] text-zinc-400 font-medium">Оболонка супутника</div>
                  <div className="text-xs font-bold text-purple-300 mt-0.5 truncate">
                    {SHELLS_LIST.find((s) => s.id === selectedShell)?.name || 'Космічне кільце'}
                  </div>
                  <div className="text-[9.5px] text-zinc-500 mt-0.5">
                    Жива анімація
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                  <div className="text-[10px] text-zinc-400 font-medium">Режим підтримки</div>
                  <div className="text-xs font-bold text-amber-300 mt-0.5">
                    {isThoughtsEnabled ? 'Увімкнено' : 'Тихий режим'}
                  </div>
                  <div className="text-[9.5px] text-zinc-500 mt-0.5">
                    {isThoughtsEnabled ? 'Поради та мотивація' : 'Без повідомлень'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 px-5 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="px-3.5 py-2 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 1) {
                  handleSaveMoney();
                }
                setCurrentStep((s) => s + 1);
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-900/30 transition-all cursor-pointer"
            >
              <span>Далі</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleFinish(false)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <span>На головну</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
