import React, { useState, useEffect } from 'react';
import { 
  X, 
  Coins, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  Trash2, 
  History, 
  Sparkles, 
  Check, 
  TrendingUp,
  RefreshCw,
  RotateCcw,
  SlidersHorizontal,
  Target,
  Gift,
  Coffee,
  BookOpen,
  Film,
  Award,
  ChevronDown,
  Plus,
  Heart,
  Zap,
  CheckCircle2,
  Wallet
} from 'lucide-react';
import { MonolithicSegmentedControl } from './MonolithicSegmentedControl';
import { MoneySettings, PriceTier, Streak, GoalsState } from '../types';

export interface SavedResourcesSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  money: MoneySettings | null;
  onSave: (newSettings: MoneySettings) => void;
  accent?: string;
  totalSaved?: number;
  cigsAvoided?: number;
  diffMs?: number;
  startDate?: number;
  longestStreakMs?: number;
  streaks?: Streak[];
  goals?: GoalsState;
  onOpenSetup?: () => void;
  onOpenRelapse?: () => void;
  onUndoLastRelapse?: () => void;
  onOpenGoalsModal?: () => void;
}

export const SavedResourcesSettingsModal: React.FC<SavedResourcesSettingsModalProps> = ({
  isOpen,
  onClose,
  money,
  onSave,
  accent = 'indigo',
  totalSaved = 0,
  cigsAvoided = 0,
  diffMs = 0,
  startDate,
  longestStreakMs,
  streaks = [],
  goals,
  onOpenSetup,
  onOpenRelapse,
  onUndoLastRelapse,
  onOpenGoalsModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'journey'>('overview');
  
  // Settings state
  const [packPrice, setPackPrice] = useState<number>(money?.packPrice ?? 100);
  const [packSize, setPackSize] = useState<number>(money?.packSize ?? 20);
  const [perDay, setPerDay] = useState<number>(money?.perDay ?? 15);
  const [minutesPerCig, setMinutesPerCig] = useState<number>(money?.minutesPerCig ?? 7);
  const [currency, setCurrency] = useState<string>(money?.cur ?? '₴');
  const [priceHistory, setPriceHistory] = useState<PriceTier[]>(money?.priceHistory ?? []);

  const [showHistorySection, setShowHistorySection] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [economyMode, setEconomyMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:economy-mode') === 'true';
    } catch {
      return false;
    }
  });

  const [newTierPrice, setNewTierPrice] = useState<number>(100);
  const [newTierDate, setNewTierDate] = useState<string>(() => {
    const d = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });

  // Selected period for forecast: 1m, 6m, 1y, 3y, 5y
  const [selectedHorizon, setSelectedHorizon] = useState<'1m' | '6m' | '1y' | '3y' | '5y'>('1y');

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPackPrice(money?.packPrice ?? 100);
      setPackSize(money?.packSize ?? 20);
      setPerDay(money?.perDay ?? 15);
      setMinutesPerCig(money?.minutesPerCig ?? 7);
      setCurrency(money?.cur ?? '₴');
      setPriceHistory(money?.priceHistory ?? []);
      setShowHistorySection(false);
      setIsSavedSuccess(false);
      try {
        setEconomyMode(localStorage.getItem('quit-smoking:economy-mode') === 'true');
      } catch {}
    }
  }, [isOpen, money]);

  if (!isOpen) return null;

  // Safe numerical parameters
  const safePackSize = Math.max(1, packSize || 20);
  const safePackPrice = Math.max(0, packPrice || 0);
  const safePerDay = Math.max(0, perDay || 0);
  const safeMinPerCig = Math.max(1, minutesPerCig || 7);

  // Daily / Monthly / Yearly baseline formulas
  const costPerCig = safePackSize > 0 ? safePackPrice / safePackSize : 0;
  const costPerDay = (safePerDay / safePackSize) * safePackPrice;
  const costPerMonth = costPerDay * 30.416;
  const costPerYear = costPerDay * 365;
  const timePerDayMinutes = safePerDay * safeMinPerCig;
  const timePerDayHours = Number((timePerDayMinutes / 60).toFixed(1));

  // Determine effective total savings & avoided cigarettes
  // If user changed parameters from initial, compute responsive live values
  const hasSettingsChanged = 
    packPrice !== (money?.packPrice ?? 100) ||
    packSize !== (money?.packSize ?? 20) ||
    perDay !== (money?.perDay ?? 15);

  const daysElapsed = diffMs > 0 ? diffMs / (24 * 3600 * 1000) : 0;
  
  const effectiveCigsAvoided = (hasSettingsChanged && daysElapsed > 0)
    ? Math.round(daysElapsed * safePerDay)
    : (cigsAvoided > 0 ? cigsAvoided : Math.round(daysElapsed * safePerDay));

  const effectiveTotalSaved = (hasSettingsChanged && daysElapsed > 0)
    ? Math.round((effectiveCigsAvoided / safePackSize) * safePackPrice)
    : (totalSaved > 0 ? totalSaved : Math.round((effectiveCigsAvoided / safePackSize) * safePackPrice));

  const effectiveTimeMinutes = effectiveCigsAvoided * safeMinPerCig;
  const effectiveTimeHours = Math.floor(effectiveTimeMinutes / 60);
  const effectiveTimeDays = Math.floor(effectiveTimeHours / 24);
  const remainingHours = effectiveTimeHours % 24;
  const remainingMinutes = Math.floor(effectiveTimeMinutes % 60);

  // Tar toxins prevented (~10mg = 0.01g per standard cigarette)
  const tarGramsPrevented = (effectiveCigsAvoided * 0.01).toFixed(1);

  // Real life tangible equivalents
  const coffeeCups = Math.floor(effectiveTotalSaved / 65);
  const cinemaTickets = Math.floor(effectiveTotalSaved / 250);
  const booksCount = Math.floor(effectiveTotalSaved / 350);
  const sneakersCount = (effectiveTotalSaved / 3200).toFixed(1);
  const travelTripPct = Math.min(100, Math.round((effectiveTotalSaved / 7500) * 100));

  // Time equivalents
  const booksReadTime = (effectiveTimeMinutes / (60 * 5.5)).toFixed(1); // 1 book ~ 5.5 hours
  const moviesWatchedTime = Math.floor(effectiveTimeMinutes / 115); // 1 movie ~ 115 mins

  // Active savings goal calculation
  const activeGoal = goals?.queue && goals.queue.length > 0 ? goals.queue[0] : null;
  const spentMoney = (goals?.base || 0) + (goals?.done?.reduce((acc, g) => acc + (g.amount || g.total || 0), 0) || 0);
  const availableForGoal = Math.max(0, effectiveTotalSaved - spentMoney);
  const goalTargetAmount = activeGoal?.amount || 0;
  const goalProgressPct = goalTargetAmount > 0 
    ? Math.min(100, Math.round((availableForGoal / goalTargetAmount) * 100))
    : 0;

  const handleAddPriceTier = () => {
    if (!newTierDate || newTierPrice <= 0) return;
    const ts = new Date(newTierDate).getTime();
    if (!isFinite(ts)) return;

    const updated = [
      ...priceHistory.filter((t) => Math.abs(t.timestamp - ts) > 86400000),
      {
        timestamp: ts,
        packPrice: newTierPrice
      }
    ].sort((a, b) => a.timestamp - b.timestamp);

    setPriceHistory(updated);
    if (ts <= Date.now()) {
      setPackPrice(newTierPrice);
    }
  };

  const handleDeleteTier = (idx: number) => {
    setPriceHistory((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const validPackPrice = Math.max(1, Number(packPrice) || 100);
    const validPackSize = Math.max(1, Number(packSize) || 20);
    const validPerDay = Math.max(1, Number(perDay) || 15);
    const validMinutes = Math.max(1, Math.min(60, Number(minutesPerCig) || 7));

    const updated: MoneySettings = {
      packPrice: validPackPrice,
      packSize: validPackSize,
      perDay: validPerDay,
      minutesPerCig: validMinutes,
      cur: currency || '₴',
      priceHistory: priceHistory.length > 0 ? priceHistory : undefined
    };

    localStorage.setItem('quit-smoking:economy-mode', String(economyMode));
    window.dispatchEvent(new Event('storage'));

    onSave(updated);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
    }, 500);
  };

  const fmtDuration = (ms: number) => {
    const totalDays = Math.floor(ms / (24 * 3600 * 1000));
    const totalHours = Math.floor((ms % (24 * 3600 * 1000)) / (3600 * 1000));
    if (totalDays > 0) return `${totalDays} дн ${totalHours} год`;
    return `${totalHours} год`;
  };

  // Horizon forecast numbers
  const getHorizonMultiplier = (horizon: '1m' | '6m' | '1y' | '3y' | '5y') => {
    switch (horizon) {
      case '1m': return 30.416;
      case '6m': return 182.5;
      case '1y': return 365;
      case '3y': return 365 * 3;
      case '5y': return 365 * 5;
    }
  };

  const currentMultiplier = getHorizonMultiplier(selectedHorizon);
  const horizonCost = costPerDay * currentMultiplier;
  const horizonHours = Math.round((timePerDayMinutes * currentMultiplier) / 60);
  const horizonPacks = Math.round((safePerDay * currentMultiplier) / safePackSize);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#141418] w-full max-w-xl rounded-3xl border border-[#2a2a34] shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative my-auto max-h-[92vh] flex flex-col text-white overflow-hidden animate-smoothModalSlideUp">
        
        {/* TOP ACCENT GLOW */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 opacity-90" />

        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 pb-3 border-b border-white/10 flex-none flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/25 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center flex-none shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Заощаджені ресурси
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/20">
                  Капітал
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-tight">
                Фінанси, повернений час та показники чистого життя
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer transition-colors active:scale-95"
            aria-label="Закрити"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="px-4 sm:px-5 pt-3 flex-none">
          <MonolithicSegmentedControl
            items={[
              { id: 'overview', label: 'Капітал', icon: <Sparkles className="w-3.5 h-3.5" /> },
              { id: 'settings', label: 'Калькулятор', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
              { id: 'journey', label: 'Шлях і серії', icon: <Award className="w-3.5 h-3.5" /> },
            ]}
            value={activeTab}
            onChange={(val) => setActiveTab(val as 'overview' | 'settings' | 'journey')}
            size="md"
          />
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* TAB 1: OVERVIEW & CAPITAL */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* TRIO OF CORE SAVINGS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                {/* 1. Money Saved */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#1f1d17] to-[#171613] border border-amber-500/30 flex flex-col justify-between shadow-[0_4px_20px_rgba(245,158,11,0.08)]">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span className="flex items-center gap-1.5 font-bold text-amber-400/90 text-[11px] uppercase tracking-wider">
                      <Wallet className="w-3.5 h-3.5 text-amber-400" />
                      Заощаджено
                    </span>
                    <span className="text-[10px] text-amber-300/80 font-mono">+{costPerDay.toFixed(0)} {currency}/дн</span>
                  </div>
                  
                  <div className="my-2">
                    <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
                      {Math.floor(effectiveTotalSaved).toLocaleString('uk-UA')} <span className="text-amber-400 text-lg">{currency}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-400 flex items-center justify-between">
                    <span>Темп:</span>
                    <span className="font-mono font-semibold text-zinc-300">~{Math.round(costPerMonth).toLocaleString('uk-UA')} {currency}/міс</span>
                  </div>
                </div>

                {/* 2. Free Time Returned */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#151c24] to-[#12161c] border border-sky-500/30 flex flex-col justify-between shadow-[0_4px_20px_rgba(56,189,248,0.08)]">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span className="flex items-center gap-1.5 font-bold text-sky-400/90 text-[11px] uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      Вільний час
                    </span>
                    <span className="text-[10px] text-sky-300/80 font-mono">+{timePerDayMinutes} хв/дн</span>
                  </div>

                  <div className="my-2">
                    <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
                      {effectiveTimeDays > 0 ? (
                        <>
                          {effectiveTimeDays}<span className="text-sky-400 text-sm font-bold">дн</span> {remainingHours}<span className="text-sky-400 text-sm font-bold">год</span>
                        </>
                      ) : (
                        <>
                          {effectiveTimeHours}<span className="text-sky-400 text-sm font-bold">год</span> {remainingMinutes}<span className="text-sky-400 text-sm font-bold">хв</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-400 flex items-center justify-between">
                    <span>Чистий ресурс:</span>
                    <span className="font-mono font-semibold text-zinc-300">~{timePerDayHours} год/день</span>
                  </div>
                </div>

                {/* 3. Cigarettes Avoided */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#141e17] to-[#111712] border border-emerald-500/30 flex flex-col justify-between shadow-[0_4px_20px_rgba(16,185,129,0.08)]">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-400/90 text-[11px] uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Не викурено
                    </span>
                    <span className="text-[10px] text-emerald-300/80 font-mono">чисто</span>
                  </div>

                  <div className="my-2">
                    <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
                      {effectiveCigsAvoided.toLocaleString('uk-UA')} <span className="text-emerald-400 text-sm font-bold">шт</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-400 flex items-center justify-between">
                    <span>В пачках:</span>
                    <span className="font-mono font-semibold text-zinc-300">
                      ~{(effectiveCigsAvoided / safePackSize).toFixed(1)} пач
                    </span>
                  </div>
                </div>

              </div>

              {/* TANGIBLE REAL-LIFE IMPACT (Що це у житті?) */}
              <div className="p-4 rounded-2xl bg-[#181820] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-amber-400" />
                    <span>Матеріалізація збережених ресурсів</span>
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">еквівалент</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex flex-col items-center text-center">
                    <Coffee className="w-4 h-4 text-amber-400 mb-1" />
                    <span className="text-sm font-black font-mono text-white">
                      {Math.max(1, coffeeCups)}
                    </span>
                    <span className="text-[10px] text-zinc-400 leading-tight">чашок кави</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex flex-col items-center text-center">
                    <Film className="w-4 h-4 text-sky-400 mb-1" />
                    <span className="text-sm font-black font-mono text-white">
                      {Math.max(0, cinemaTickets)}
                    </span>
                    <span className="text-[10px] text-zinc-400 leading-tight">походів у кіно</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex flex-col items-center text-center">
                    <BookOpen className="w-4 h-4 text-emerald-400 mb-1" />
                    <span className="text-sm font-black font-mono text-white">
                      {Math.max(0, booksCount)}
                    </span>
                    <span className="text-[10px] text-zinc-400 leading-tight">цікавих книг</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex flex-col items-center text-center">
                    <Heart className="w-4 h-4 text-rose-400 mb-1" />
                    <span className="text-sm font-black font-mono text-white">
                      {tarGramsPrevented} <span className="text-[10px] text-zinc-400">г</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 leading-tight">смоли оминуто</span>
                  </div>
                </div>

                {/* Returned time tangible equivalency */}
                <div className="p-2.5 rounded-xl bg-sky-500/5 border border-sky-500/15 text-xs flex items-center justify-between text-zinc-300">
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-sky-400 flex-none" />
                    <span>Повернений час достатній для:</span>
                  </span>
                  <span className="font-semibold text-sky-300 font-mono">
                    ~{booksReadTime} книг або {moviesWatchedTime} фільмів
                  </span>
                </div>
              </div>

              {/* SAVINGS GOAL INTEGRATION */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span>Фінансова мрія на збережене</span>
                  </span>
                  {activeGoal && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      {goalProgressPct}%
                    </span>
                  )}
                </div>

                {activeGoal ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white truncate max-w-[200px]">
                        {activeGoal.name}
                      </span>
                      <span className="font-mono text-zinc-300">
                        {Math.floor(availableForGoal).toLocaleString('uk-UA')} / {activeGoal.amount?.toLocaleString('uk-UA')} {currency}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(3, goalProgressPct))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-zinc-400">
                        {goalProgressPct >= 100 
                          ? '🎉 Мета досягнута! Можна святкувати та реалізувати!'
                          : `Залишилось накопичити: ${Math.max(0, (activeGoal.amount || 0) - availableForGoal).toLocaleString('uk-UA')} ${currency}`}
                      </span>

                      {onOpenGoalsModal && (
                        <button
                          type="button"
                          onClick={() => { onClose(); onOpenGoalsModal(); }}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>Всі цілі</span>
                          <span>→</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-zinc-400 text-[11px]">
                      Поставте мету, щоб бачити, на яку мрію перетворюються ваші заощадження
                    </span>
                    {onOpenGoalsModal && (
                      <button
                        type="button"
                        onClick={() => { onClose(); onOpenGoalsModal(); }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Додати ціль</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* FORECAST & FINANCIAL HORIZON */}
              <div className="p-4 rounded-2xl bg-[#181820] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Фінансовий горизонт (Прогноз)</span>
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">на майбутнє</span>
                </div>

                {/* Horizon Switcher Chips */}
                <div className="grid grid-cols-5 gap-1 p-1 bg-black/30 rounded-xl border border-white/5">
                  {(['1m', '6m', '1y', '3y', '5y'] as const).map((h) => {
                    const label = h === '1m' ? '1 міс' : h === '6m' ? '6 міс' : h === '1y' ? '1 рік' : h === '3y' ? '3 роки' : '5 років';
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setSelectedHorizon(h)}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                          selectedHorizon === h
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Highlighted Result for Selected Horizon */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block mb-0.5">
                      Очікуване збереження коштів:
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-white">
                      ~{Math.round(horizonCost).toLocaleString('uk-UA')} <span className="text-emerald-400 text-base">{currency}</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block mb-0.5">
                      Звільнено часу:
                    </span>
                    <span className="text-sm font-bold font-mono text-sky-300">
                      ~{horizonHours.toLocaleString('uk-UA')} год
                    </span>
                    <span className="text-[10px] text-zinc-500 block font-mono">
                      (~{horizonPacks} пачок)
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CALCULATOR & PARAMETERS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* 1. Pack Price & Currency */}
              <div className="p-4 rounded-2xl bg-[#181820] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>Вартість однієї пачки</span>
                  </label>
                  
                  {/* Currency selector chips */}
                  <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                    {['₴', '$', '€', 'zł', '£'].map((cur) => (
                      <button
                        key={cur}
                        type="button"
                        onClick={() => setCurrency(cur)}
                        className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                          currency === cur ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {cur}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Input with quick adjust buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPackPrice(Math.max(100, (packPrice || 100) - 1))}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-base flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                    title="-1"
                  >
                    -1
                  </button>

                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="100"
                      step="1"
                      value={packPrice || ''}
                      onChange={(e) => setPackPrice(Math.max(100, Number(e.target.value)))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-base font-mono font-bold text-white focus:outline-none focus:border-amber-500 transition-all text-center"
                      placeholder="100"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold font-mono text-amber-400 pointer-events-none">
                      {currency}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPackPrice((packPrice || 100) + 1)}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-base flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                    title="+1"
                  >
                    +1
                  </button>
                </div>

                {/* Quick Price Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[100, 120, 140, 160, 180, 200].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPackPrice(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
                        packPrice === p
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                          : 'bg-black/30 border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {p} {currency}
                    </button>
                  ))}
                </div>

                {/* Price History Toggle */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowHistorySection(!showHistorySection)}
                    className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <History className="w-3.5 h-3.5 text-amber-400" />
                    <span>Історія зміни цін за періодами ({priceHistory.length})</span>
                  </button>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${showHistorySection ? 'rotate-180' : ''}`} />
                </div>

                {/* Price History Sub-panel */}
                {showHistorySection && (
                  <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-2.5 text-xs">
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Вкажіть попередні ціни, якщо сигарети раніше коштували дешевше, для абсолютно точного історичного розрахунку.
                    </p>

                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={newTierDate}
                        onChange={(e) => setNewTierDate(e.target.value)}
                        className="flex-1 bg-[#1a1a20] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <div className="relative w-24">
                        <input
                          type="number"
                          min="1"
                          placeholder="Ціна"
                          value={newTierPrice || ''}
                          onChange={(e) => setNewTierPrice(Number(e.target.value))}
                          className="w-full bg-[#1a1a20] border border-white/10 rounded-lg px-2 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500 text-center"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500">
                          {currency}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddPriceTier}
                        className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-bold cursor-pointer transition-colors active:scale-95"
                      >
                        Додати
                      </button>
                    </div>

                    {priceHistory.length > 0 ? (
                      <div className="space-y-1 pt-1">
                        {priceHistory.map((tier, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-[#141418] border border-white/5 text-xs"
                          >
                            <span className="text-zinc-300">
                              З {new Date(tier.timestamp).toLocaleDateString('uk-UA')}:
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold font-mono text-white">
                                {tier.packPrice} {currency}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteTier(idx)}
                                className="text-zinc-500 hover:text-rose-400 p-1 rounded cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-zinc-500 block text-center py-1 font-mono">
                        Використовується єдина поточна ціна
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Cigarettes per Pack */}
              <div className="p-4 rounded-2xl bg-[#181820] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Сигарет у пачці</span>
                  </label>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/20">
                    {packSize} шт
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="40"
                  step="1"
                  value={packSize}
                  onChange={(e) => setPackSize(Number(e.target.value))}
                  className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <button type="button" onClick={() => setPackSize(10)} className="hover:text-white cursor-pointer">10 шт</button>
                  <button type="button" onClick={() => setPackSize(20)} className="font-bold text-emerald-400 cursor-pointer">20 шт (стандарт)</button>
                  <button type="button" onClick={() => setPackSize(25)} className="hover:text-white cursor-pointer">25 шт</button>
                  <button type="button" onClick={() => setPackSize(40)} className="hover:text-white cursor-pointer">40 шт</button>
                </div>
              </div>

              {/* 3. Cigarettes per Day */}
              <div className="p-4 rounded-2xl bg-[#181820] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Сигарет на день (до відмови)</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono text-zinc-400">
                      ≈ {(safePerDay / safePackSize).toFixed(1)} пач/дн
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 font-mono font-bold text-xs border border-indigo-500/20">
                      {perDay} шт
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min="1"
                  max="60"
                  step="1"
                  value={perDay}
                  onChange={(e) => setPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />

                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <button type="button" onClick={() => setPerDay(5)} className="hover:text-white cursor-pointer">5 шт</button>
                  <button type="button" onClick={() => setPerDay(10)} className="hover:text-white cursor-pointer">10 шт</button>
                  <button type="button" onClick={() => setPerDay(20)} className="font-bold text-indigo-400 cursor-pointer">20 шт (1 пачка)</button>
                  <button type="button" onClick={() => setPerDay(30)} className="hover:text-white cursor-pointer">30 шт</button>
                  <button type="button" onClick={() => setPerDay(40)} className="hover:text-white cursor-pointer">40 шт</button>
                </div>
              </div>

              {/* 4. Minutes per Cigarette */}
              <div className="p-4 rounded-2xl bg-[#181820] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>Час на одну сигарету</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono text-zinc-400">
                      ~{timePerDayHours} год/день
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 font-mono font-bold text-xs border border-sky-500/20">
                      {minutesPerCig} хв
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={minutesPerCig}
                  onChange={(e) => setMinutesPerCig(Number(e.target.value))}
                  className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />

                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <button type="button" onClick={() => setMinutesPerCig(3)} className="hover:text-white cursor-pointer">3 хв</button>
                  <button type="button" onClick={() => setMinutesPerCig(5)} className="hover:text-white cursor-pointer">5 хв</button>
                  <button type="button" onClick={() => setMinutesPerCig(7)} className="font-bold text-sky-400 cursor-pointer">7 хв (середнє)</button>
                  <button type="button" onClick={() => setMinutesPerCig(10)} className="hover:text-white cursor-pointer">10 хв</button>
                  <button type="button" onClick={() => setMinutesPerCig(15)} className="hover:text-white cursor-pointer">15 хв</button>
                </div>
              </div>

              {/* 5. Economy Mode (Battery / Performance) */}
              <div className="p-3.5 rounded-2xl bg-[#181820] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-none" />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Економний режим інтерфейсу
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Вимкнути важкі фонові анімації для економії заряду
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEconomyMode(!economyMode)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer flex-none ${
                    economyMode ? 'bg-emerald-500' : 'bg-zinc-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    economyMode ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Dynamic Recalculation Note */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-center justify-between">
                <span>Розрахунок за параметрами:</span>
                <span className="font-mono font-bold text-white">
                  ~{costPerDay.toFixed(0)} {currency}/день • ~{Math.round(costPerYear).toLocaleString('uk-UA')} {currency}/рік
                </span>
              </div>

            </div>
          )}

          {/* TAB 3: JOURNEY & STREAKS */}
          {activeTab === 'journey' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* START DATE & JOURNEY BEGINNING */}
              <div className="p-4 rounded-2xl bg-[#181820] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>Початок шляху відмови</span>
                  </span>
                  <span className="text-[10px] text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 font-mono">
                    {startDate ? `${Math.floor(daysElapsed)} дн чистоти` : '—'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Точна дата та час старту:</span>
                  <span className="font-mono font-bold text-white">
                    {startDate ? new Date(startDate).toLocaleString('uk-UA', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Не встановлено'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {onOpenSetup && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onOpenSetup(); }}
                      className="py-2 px-3 bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-95"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Змінити дату</span>
                    </button>
                  )}

                  {onOpenRelapse && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onOpenRelapse(); }}
                      className="py-2 px-3 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Зафіксувати зрив</span>
                    </button>
                  )}
                </div>
              </div>

              {/* STREAKS & RECORD */}
              <div className="p-4 rounded-2xl bg-[#181820] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span>Серії чистоти та особистий рекорд</span>
                  </span>
                  {streaks && streaks.length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20 font-mono">
                      {streaks.length} зрив(ів)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block mb-1">
                      Найдовша серія:
                    </span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {longestStreakMs ? fmtDuration(longestStreakMs) : '—'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block mb-1">
                      Минулих зривів:
                    </span>
                    <span className="font-mono font-bold text-zinc-200 text-sm">
                      {streaks ? streaks.length : 0}
                    </span>
                  </div>
                </div>

                {streaks && streaks.length > 0 && onUndoLastRelapse && (
                  <button
                    type="button"
                    onClick={onUndoLastRelapse}
                    className="w-full py-2.5 px-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Скасувати останній зрив</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 pt-3 border-t border-white/10 flex-none flex items-center justify-between gap-3 bg-[#111115]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
          >
            Закрити
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md ${
                isSavedSuccess
                  ? 'bg-emerald-500 text-black'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold'
              }`}
            >
              {isSavedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Збережено!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Зберегти налаштування</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
