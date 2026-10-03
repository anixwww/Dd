import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  Coins, 
  ShieldCheck, 
  Heart, 
  BookOpen, 
  Coffee, 
  Film, 
  Pizza, 
  Zap,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Droplets,
  Trees,
  Calendar,
  Award,
  RefreshCw,
  Wallet,
  ShoppingBag
} from 'lucide-react';
import { MoneySettings, Streak, GoalsState } from '../../types';

interface ItemPrices {
  coffee: number;
  book: number;
  cinema: number;
  pizza: number;
}

const DEFAULT_PRICES: ItemPrices = {
  coffee: 65,
  book: 350,
  cinema: 250,
  pizza: 420
};

interface ExpandedSavedResourcesStatsProps {
  totalSaved: number;
  cigsAvoided: number;
  diffMs: number;
  startDate?: number;
  streaks?: Streak[];
  longestStreakMs?: number;
  money: MoneySettings | null;
  goals?: GoalsState;
  onOpenGoalsModal?: () => void;
  onOpenTreeTip?: () => void;
  onOpenSetup?: () => void;
  onOpenRelapse?: () => void;
  onUndoLastRelapse?: () => void;
}

export const ExpandedSavedResourcesStats: React.FC<ExpandedSavedResourcesStatsProps> = ({
  totalSaved,
  cigsAvoided,
  diffMs,
  startDate,
  streaks = [],
  longestStreakMs,
  money,
  goals,
  onOpenGoalsModal,
  onOpenTreeTip,
  onOpenSetup,
  onOpenRelapse,
  onUndoLastRelapse
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<'7d' | '1m' | '6m' | '1y' | '3y' | '5y'>('1y');

  // Item Prices State
  const [prices, setPrices] = useState<ItemPrices>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:item-prices');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          coffee: Number(parsed.coffee) || DEFAULT_PRICES.coffee,
          book: Number(parsed.book) || DEFAULT_PRICES.book,
          cinema: Number(parsed.cinema) || DEFAULT_PRICES.cinema,
          pizza: Number(parsed.pizza) || DEFAULT_PRICES.pizza,
        };
      }
    } catch {}
    return DEFAULT_PRICES;
  });

  const [isEditingPrices, setIsEditingPrices] = useState<boolean>(false);
  const [tempPrices, setTempPrices] = useState<ItemPrices>(prices);

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('quit-smoking:item-prices');
        if (saved) {
          const parsed = JSON.parse(saved);
          setPrices({
            coffee: Number(parsed.coffee) || DEFAULT_PRICES.coffee,
            book: Number(parsed.book) || DEFAULT_PRICES.book,
            cinema: Number(parsed.cinema) || DEFAULT_PRICES.cinema,
            pizza: Number(parsed.pizza) || DEFAULT_PRICES.pizza,
          });
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleSavePrices = () => {
    const sanitized: ItemPrices = {
      coffee: Math.max(1, Number(tempPrices.coffee) || DEFAULT_PRICES.coffee),
      book: Math.max(1, Number(tempPrices.book) || DEFAULT_PRICES.book),
      cinema: Math.max(1, Number(tempPrices.cinema) || DEFAULT_PRICES.cinema),
      pizza: Math.max(1, Number(tempPrices.pizza) || DEFAULT_PRICES.pizza),
    };
    setPrices(sanitized);
    setIsEditingPrices(false);
    try {
      localStorage.setItem('quit-smoking:item-prices', JSON.stringify(sanitized));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const handleResetPrices = () => {
    setTempPrices(DEFAULT_PRICES);
    setPrices(DEFAULT_PRICES);
    try {
      localStorage.setItem('quit-smoking:item-prices', JSON.stringify(DEFAULT_PRICES));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  // Baseline parameters
  const packPrice = money?.packPrice ?? 100;
  const packSize = money?.packSize ?? 20;
  const perDay = money?.perDay ?? 15;
  const minutesPerCig = money?.minutesPerCig ?? 7;
  const currency = money?.cur ?? '₴';

  const costPerDay = packSize > 0 ? (perDay / packSize) * packPrice : 0;
  const daysElapsed = Math.max(0, diffMs / (24 * 3600 * 1000));

  const fmtDuration = (ms: number) => {
    const totalDays = Math.floor(ms / (24 * 3600 * 1000));
    const totalHours = Math.floor((ms % (24 * 3600 * 1000)) / (3600 * 1000));
    if (totalDays > 0) return `${totalDays} дн ${totalHours} год`;
    return `${totalHours} год`;
  };

  // Forecast Horizon Calculations
  const horizonData = useMemo(() => {
    let days = 365;
    let label = '1 рік';
    if (selectedHorizon === '7d') { days = 7; label = '7 днів'; }
    if (selectedHorizon === '1m') { days = 30.416; label = '1 місяць'; }
    if (selectedHorizon === '6m') { days = 182.5; label = '6 місяців'; }
    if (selectedHorizon === '1y') { days = 365; label = '1 рік'; }
    if (selectedHorizon === '3y') { days = 1095; label = '3 роки'; }
    if (selectedHorizon === '5y') { days = 1825; label = '5 років'; }

    const forecastMoney = Math.round(costPerDay * days);
    const forecastCigs = Math.round(perDay * days);
    const forecastPacks = Math.round(forecastCigs / packSize);
    const forecastMinutes = forecastCigs * minutesPerCig;
    const forecastHours = Math.floor(forecastMinutes / 60);
    const forecastDaysTime = (forecastHours / 24).toFixed(1);

    return {
      label,
      days,
      forecastMoney,
      forecastCigs,
      forecastPacks,
      forecastHours,
      forecastDaysTime
    };
  }, [selectedHorizon, costPerDay, perDay, packSize, minutesPerCig]);

  // Toxicology & Biological Protection Metrics
  const tarGrams = (cigsAvoided * 0.01).toFixed(1);
  const coLiters = (cigsAvoided * 0.018).toFixed(1);
  const heartBeatsSaved = Math.round(cigsAvoided * 15 * 12);
  const nicotineMilligrams = (cigsAvoided * 1.2).toFixed(1);
  const treesSaved = (cigsAvoided / 300).toFixed(1);

  // Tangible Reward Equivalents calculated dynamically with custom prices
  const coffeeCups = Math.floor(totalSaved / (prices.coffee || 65));
  const booksCount = Math.floor(totalSaved / (prices.book || 350));
  const cinemaTickets = Math.floor(totalSaved / (prices.cinema || 250));
  const pizzaNights = Math.floor(totalSaved / (prices.pizza || 420));

  // Goals spending and available funds
  const spentOnGoals = (goals?.base || 0) + (goals?.done?.reduce((acc, g) => acc + (g.amount || g.total || 0), 0) || 0);
  const availableForGoals = Math.max(0, totalSaved - spentOnGoals);

  return (
    <div className="mt-3 pt-3 border-t border-zinc-800 space-y-3 font-sans select-none animate-fadeIn text-left">
      
      {/* 0. БЛОК: ЦІЛІ ТА БАЛАНС КОШТІВ */}
      <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 flex items-center justify-center shrink-0">
              <Coins className="w-3.5 h-3.5 text-zinc-300" />
            </div>
            <span className="text-xs font-semibold text-zinc-200">
              Цілі та баланс коштів
            </span>
          </div>
          {onOpenGoalsModal && (
            <button
              type="button"
              onClick={onOpenGoalsModal}
              className="text-[11px] font-medium text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Керувати цілями</span>
              <span>→</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-left">
            <div className="flex items-center gap-1 text-[9.5px] text-zinc-500 font-medium uppercase mb-0.5">
              <ShoppingBag className="w-3 h-3 text-zinc-400 shrink-0" />
              <span>Витрачено на цілі</span>
            </div>
            <div className="text-xs sm:text-sm font-bold font-mono text-zinc-200">
              {Math.floor(spentOnGoals).toLocaleString('uk-UA')} ₴
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-left">
            <div className="flex items-center gap-1 text-[9.5px] text-zinc-500 font-medium uppercase mb-0.5">
              <Wallet className="w-3 h-3 text-zinc-400 shrink-0" />
              <span>Доступно для цілей</span>
            </div>
            <div className="text-xs sm:text-sm font-bold font-mono text-zinc-100">
              {Math.floor(availableForGoals).toLocaleString('uk-UA')} ₴
            </div>
          </div>
        </div>
      </div>
      
      {/* 1. БЛОК: ШЛЯХ І СЕРІЇ ЧИСТОТИ */}
      <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 flex items-center justify-center shrink-0">
              <Award className="w-3.5 h-3.5 text-zinc-300" />
            </div>
            <span className="text-xs font-semibold text-zinc-200">
              Шлях і серії чистоти
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono font-medium bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
            {startDate ? `${Math.floor(daysElapsed)} дн чистоти` : '—'}
          </span>
        </div>

        {/* Start Date Card */}
        <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-zinc-400 text-[11px]">Початок відмови:</span>
          </div>
          <span className="font-mono font-semibold text-zinc-200 text-[11px]">
            {startDate ? new Date(startDate).toLocaleDateString('uk-UA', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : 'Не встановлено'}
          </span>
        </div>

        {/* Streaks Grid */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <div className="text-[9.5px] uppercase font-medium text-zinc-500">Найдовша серія</div>
            <div className="text-xs sm:text-sm font-bold font-mono text-zinc-100 truncate mt-0.5">
              {longestStreakMs ? fmtDuration(longestStreakMs) : '—'}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <div className="text-[9.5px] uppercase font-medium text-zinc-500">Минулих зривів</div>
            <div className="text-xs sm:text-sm font-bold font-mono text-zinc-100 truncate mt-0.5">
              {streaks ? streaks.length : 0}
            </div>
          </div>
        </div>

        {/* Action Buttons for Date & Relapse */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          {onOpenSetup && (
            <button
              type="button"
              onClick={onOpenSetup}
              className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold border border-zinc-700/80 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-zinc-300" />
              <span>Змінити дату</span>
            </button>
          )}

          {onOpenRelapse && (
            <button
              type="button"
              onClick={onOpenRelapse}
              className="py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-medium border border-zinc-800 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Фіксація зриву</span>
            </button>
          )}
        </div>

        {streaks && streaks.length > 0 && onUndoLastRelapse && (
          <button
            type="button"
            onClick={onUndoLastRelapse}
            className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-medium border border-zinc-800 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Скасувати останній зрив</span>
          </button>
        )}
      </div>

      {/* 2. Прогноз по горизонтах */}
      <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2.5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5 text-zinc-300" />
            </div>
            <span className="text-xs font-semibold text-zinc-200">
              Прогноз збережень
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            {horizonData.label}
          </span>
        </div>

        {/* Horizon Selector Tabs */}
        <div className="grid grid-cols-6 gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-[10.5px]">
          {(['7d', '1m', '6m', '1y', '3y', '5y'] as const).map((h) => {
            const labels: Record<string, string> = {
              '7d': '7д',
              '1m': '1м',
              '6m': '6м',
              '1y': '1р',
              '3y': '3р',
              '5y': '5р'
            };
            const active = selectedHorizon === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => setSelectedHorizon(h)}
                className={`py-1 rounded-lg transition-all cursor-pointer text-center text-[10.5px] ${
                  active 
                    ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700/80 shadow-xs' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {labels[h]}
              </button>
            );
          })}
        </div>

        {/* Forecast 3-Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <div className="text-[9.5px] uppercase font-medium text-zinc-500">Кошти</div>
            <div className="text-xs sm:text-sm font-bold font-mono text-zinc-100 truncate mt-0.5">
              +{horizonData.forecastMoney.toLocaleString('uk-UA')} {currency}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <div className="text-[9.5px] uppercase font-medium text-zinc-500">Час</div>
            <div className="text-xs sm:text-sm font-bold font-mono text-zinc-100 truncate mt-0.5">
              +{horizonData.forecastHours} год
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <div className="text-[9.5px] uppercase font-medium text-zinc-500">Не викурено</div>
            <div className="text-xs sm:text-sm font-bold font-mono text-zinc-100 truncate mt-0.5">
              +{horizonData.forecastPacks} пач
            </div>
          </div>
        </div>
      </div>

      {/* 3. Детокс та захист здоров'я */}
      <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
          </div>
          <span className="text-xs font-semibold text-zinc-200">
            Детокс та захист здоров'я
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-left">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <div className="flex items-center gap-1 text-[9.5px] text-zinc-500 font-medium uppercase mb-0.5">
              <Flame className="w-3 h-3 text-zinc-400 shrink-0" />
              <span>Смоли</span>
            </div>
            <div className="text-xs sm:text-sm font-bold font-mono text-zinc-100">
              -{tarGrams} г
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <div className="flex items-center gap-1 text-[9.5px] text-zinc-500 font-medium uppercase mb-0.5">
              <Droplets className="w-3 h-3 text-zinc-400 shrink-0" />
              <span>CO (Газ)</span>
            </div>
            <div className="text-xs sm:text-sm font-bold font-mono text-zinc-100">
              -{coLiters} л
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <div className="flex items-center gap-1 text-[9.5px] text-zinc-500 font-medium uppercase mb-0.5">
              <Heart className="w-3 h-3 text-zinc-400 shrink-0" />
              <span>Пульс</span>
            </div>
            <div className="text-xs sm:text-sm font-bold font-mono text-zinc-100">
              +{heartBeatsSaved.toLocaleString('uk-UA')}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <div className="flex items-center gap-1 text-[9.5px] text-zinc-500 font-medium uppercase mb-0.5">
              <Zap className="w-3 h-3 text-zinc-400 shrink-0" />
              <span>Нікотин</span>
            </div>
            <div className="text-xs sm:text-sm font-bold font-mono text-zinc-100">
              -{nicotineMilligrams} мг
            </div>
          </div>

          <div 
            onClick={(e) => {
              e.stopPropagation();
              onOpenTreeTip?.();
            }}
            className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 col-span-2 sm:col-span-1 cursor-pointer transition-all active:scale-95"
            title="Врятовані дерева (300 шт = 1 дерево)"
          >
            <div className="flex items-center gap-1 text-[9.5px] text-zinc-500 font-medium uppercase mb-0.5">
              <Trees className="w-3 h-3 text-zinc-400 shrink-0" />
              <span>Дерева</span>
            </div>
            <div className="text-xs sm:text-sm font-bold font-mono text-zinc-100">
              ~{treesSaved}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Блок еквівалентів товарів */}
      <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 flex items-center justify-center shrink-0">
              <Coins className="w-3.5 h-3.5 text-zinc-300" />
            </div>
            <span className="text-xs font-semibold text-zinc-200">
              Еквіваленти заощаджень
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setTempPrices(prices);
              setIsEditingPrices(!isEditingPrices);
            }}
            className="px-2.5 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[11px] font-medium text-zinc-300 flex items-center gap-1 cursor-pointer transition-colors border border-zinc-700/80 shadow-xs"
            title="Вказати вартість товарів"
          >
            <SlidersHorizontal className="w-3 h-3 text-zinc-400" />
            <span>{isEditingPrices ? 'Сховати' : 'Ціни'}</span>
          </button>
        </div>

        {/* Drawer для редагування цін */}
        {isEditingPrices && (
          <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
              <span>Вартість одиниці ({currency})</span>
              <button
                type="button"
                onClick={handleResetPrices}
                className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                title="Скинути до стандартних"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Скинути</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                  <Coffee className="w-3 h-3 text-zinc-400" />
                  <span>Кава</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={tempPrices.coffee}
                  onChange={(e) => setTempPrices({ ...tempPrices, coffee: Number(e.target.value) })}
                  className="w-full px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 text-xs font-mono focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-zinc-400" />
                  <span>Книга</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={tempPrices.book}
                  onChange={(e) => setTempPrices({ ...tempPrices, book: Number(e.target.value) })}
                  className="w-full px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 text-xs font-mono focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                  <Film className="w-3 h-3 text-zinc-400" />
                  <span>Кіно</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={tempPrices.cinema}
                  onChange={(e) => setTempPrices({ ...tempPrices, cinema: Number(e.target.value) })}
                  className="w-full px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 text-xs font-mono focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                  <Pizza className="w-3 h-3 text-zinc-400" />
                  <span>Піца</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={tempPrices.pizza}
                  onChange={(e) => setTempPrices({ ...tempPrices, pizza: Number(e.target.value) })}
                  className="w-full px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 text-xs font-mono focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSavePrices}
              className="w-full py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-zinc-700/80 shadow-sm"
            >
              <Check className="w-3.5 h-3.5 text-zinc-300" />
              <span>Зберегти</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <Coffee className="w-3.5 h-3.5 text-zinc-400 mx-auto mb-1" />
            <div className="text-xs font-bold font-mono text-zinc-100">{coffeeCups}</div>
            <div className="text-[8.5px] text-zinc-400 uppercase font-medium">Кава</div>
          </div>

          <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <BookOpen className="w-3.5 h-3.5 text-zinc-400 mx-auto mb-1" />
            <div className="text-xs font-bold font-mono text-zinc-100">{booksCount}</div>
            <div className="text-[8.5px] text-zinc-400 uppercase font-medium">Книги</div>
          </div>

          <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <Film className="w-3.5 h-3.5 text-zinc-400 mx-auto mb-1" />
            <div className="text-xs font-bold font-mono text-zinc-100">{cinemaTickets}</div>
            <div className="text-[8.5px] text-zinc-400 uppercase font-medium">Кіно</div>
          </div>

          <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <Pizza className="w-3.5 h-3.5 text-zinc-400 mx-auto mb-1" />
            <div className="text-xs font-bold font-mono text-zinc-100">{pizzaNights}</div>
            <div className="text-[8.5px] text-zinc-400 uppercase font-medium">Піца</div>
          </div>
        </div>
      </div>

    </div>
  );
};
