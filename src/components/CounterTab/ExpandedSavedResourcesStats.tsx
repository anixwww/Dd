import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Check,
  Calculator,
  X,
  History,
  Trash2,
  Calendar,
  Plus,
  Coins,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { 
  MonoRefractedWalletIcon,
  MonoRefractedBirdIcon,
  MonoRefractedCigaretteIcon,
  MonoRefractedCoinsIcon,
  MonoRefractedBagIcon,
  MonoRefractedAwardIcon,
  MonoRefractedCalendarIcon,
  MonoRefractedRefreshIcon,
  MonoRefractedTrendingUpIcon,
  MonoRefractedShieldIcon,
  MonoRefractedFlameIcon,
  MonoRefractedDropIcon,
  MonoRefractedHeartIcon,
  MonoRefractedZapIcon,
  MonoRefractedTreeIcon,
  MonoRefractedSlidersIcon,
  MonoRefractedCoffeeIcon,
  MonoRefractedBookIcon,
  MonoRefractedFilmIcon,
  MonoRefractedPizzaIcon
} from './MonoRefractedStatsIcons';
import { MoneySettings, Streak, GoalsState, PriceTier } from '../../types';

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
  onUpdateMoney?: (money: MoneySettings) => void;
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
  onUndoLastRelapse,
  onUpdateMoney
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<'7d' | '1m' | '6m' | '1y' | '3y' | '5y'>('1y');

  // Calculator Parameters State
  const [packPrice, setPackPrice] = useState<number>(() => {
    const val = Number(money?.packPrice);
    return !isNaN(val) && val >= 100 && val <= 300 ? val : 100;
  });
  const [rawPackPriceInput, setRawPackPriceInput] = useState<string>(() => String(packPrice));

  const [packSize, setPackSize] = useState<number>(() => {
    const val = Number(money?.packSize);
    return !isNaN(val) && val > 0 ? val : 20;
  });
  const [perDay, setPerDay] = useState<number>(() => {
    const val = Number(money?.perDay);
    return !isNaN(val) && val > 0 ? val : 20;
  });
  const [minutesPerCig, setMinutesPerCig] = useState<number>(() => {
    const val = Number(money?.minutesPerCig);
    return !isNaN(val) && val > 0 ? val : 7;
  });

  // Modal for "Змінити ціну на пачку"
  const [isPriceModalOpen, setIsPriceModalOpen] = useState<boolean>(false);
  const [newTierPrice, setNewTierPrice] = useState<number>(packPrice);
  const [rawNewTierPriceInput, setRawNewTierPriceInput] = useState<string>(() => String(packPrice));
  const [priceTierMode, setPriceTierMode] = useState<'today' | 'base'>('today');
  const [priceTierNote, setPriceTierNote] = useState<string>('');
  const [priceTierDate, setPriceTierDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  // Sync state if external money prop changes
  useEffect(() => {
    if (money) {
      if (money.packPrice !== undefined && !isNaN(Number(money.packPrice))) {
        const val = Number(money.packPrice);
        setPackPrice(val);
        setNewTierPrice(val);
        setRawPackPriceInput(prev => {
          const currentNum = Number(prev);
          return isNaN(currentNum) || currentNum !== val ? String(val) : prev;
        });
        setRawNewTierPriceInput(prev => {
          const currentNum = Number(prev);
          return isNaN(currentNum) || currentNum !== val ? String(val) : prev;
        });
      }
      if (money.packSize !== undefined && !isNaN(Number(money.packSize))) {
        setPackSize(Number(money.packSize));
      }
      if (money.perDay !== undefined && !isNaN(Number(money.perDay))) {
        setPerDay(Number(money.perDay));
      }
      if (money.minutesPerCig !== undefined && !isNaN(Number(money.minutesPerCig))) {
        setMinutesPerCig(Number(money.minutesPerCig));
      }
    }
  }, [money]);

  const applyMoneyUpdate = useCallback((newMoney: MoneySettings) => {
    try {
      localStorage.setItem('quit-smoking:money', JSON.stringify(newMoney));
      localStorage.setItem('quit-smoking:calculator-saved', 'true');
      window.dispatchEvent(new Event('calculator-saved-change'));
      window.dispatchEvent(new Event('money-settings-changed'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    if (onUpdateMoney) {
      onUpdateMoney(newMoney);
    }
  }, [onUpdateMoney]);

  const updatePackPrice = (newPrice: number) => {
    const clamped = Math.max(1, Math.min(1000, Math.round(newPrice)));
    setPackPrice(clamped);
    setRawPackPriceInput(String(clamped));
    const updated: MoneySettings = {
      ...(money || { cur: '₴', priceHistory: [] }),
      packPrice: clamped,
      packSize,
      perDay,
      minutesPerCig,
    };
    applyMoneyUpdate(updated);
  };

  const updatePackSize = (newSize: number) => {
    const clamped = Math.max(1, Math.min(100, Math.round(newSize)));
    setPackSize(clamped);
    const updated: MoneySettings = {
      ...(money || { cur: '₴', priceHistory: [] }),
      packPrice,
      packSize: clamped,
      perDay,
      minutesPerCig,
    };
    applyMoneyUpdate(updated);
  };

  const updateMinutesPerCig = (newMinutes: number) => {
    const clamped = Math.max(1, Math.min(30, Math.round(newMinutes)));
    setMinutesPerCig(clamped);
    const updated: MoneySettings = {
      ...(money || { cur: '₴', priceHistory: [] }),
      packPrice,
      packSize,
      perDay,
      minutesPerCig: clamped,
    };
    applyMoneyUpdate(updated);
  };

  const updatePerDay = (newPerDay: number) => {
    const clamped = Math.max(1, Math.min(100, Math.round(newPerDay)));
    setPerDay(clamped);
    const updated: MoneySettings = {
      ...(money || { cur: '₴', priceHistory: [] }),
      packPrice,
      packSize,
      perDay: clamped,
      minutesPerCig,
    };
    applyMoneyUpdate(updated);
  };

  const handleSavePriceChangeModal = () => {
    const clamped = Math.max(100, Math.min(300, Math.round(newTierPrice)));
    setPackPrice(clamped);
    setRawPackPriceInput(String(clamped));

    let updatedHistory = money?.priceHistory ? [...money.priceHistory] : [];
    if (priceTierMode === 'today') {
      const timestamp = priceTierDate ? new Date(priceTierDate).getTime() : Date.now();
      const newTier: PriceTier = {
        timestamp,
        packPrice: clamped,
        note: priceTierNote.trim() || undefined
      };
      updatedHistory = [...updatedHistory, newTier].sort((a, b) => a.timestamp - b.timestamp);
    }

    const updated: MoneySettings = {
      ...(money || { cur: '₴' }),
      packPrice: clamped,
      packSize,
      perDay,
      minutesPerCig,
      priceHistory: updatedHistory
    };

    applyMoneyUpdate(updated);
    setIsPriceModalOpen(false);
    setPriceTierNote('');
  };

  const handleDeletePriceTier = (timestamp: number) => {
    if (!money?.priceHistory) return;
    const filtered = money.priceHistory.filter(t => t.timestamp !== timestamp);
    const latestPrice = filtered.length > 0 ? filtered[filtered.length - 1].packPrice : packPrice;
    setPackPrice(latestPrice);
    setRawPackPriceInput(String(latestPrice));
    const updated: MoneySettings = {
      ...money,
      packPrice: latestPrice,
      priceHistory: filtered
    };
    applyMoneyUpdate(updated);
  };

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

  // Baseline dynamic parameters
  const currency = money?.cur ?? '₴';
  const costPerDay = packSize > 0 ? (perDay / packSize) * packPrice : 0;
  const costPerCig = packSize > 0 ? (packPrice / packSize) : 0;
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

  const safeCigsAvoided = isNaN(Number(cigsAvoided)) ? 0 : Math.max(0, Number(cigsAvoided));
  
  // Real-time calculated saved: if packPrice / packSize changed locally vs prop money, scale smoothly
  const safeTotalSaved = useMemo(() => {
    if (money && (money.packPrice !== packPrice || money.packSize !== packSize)) {
      if (money.packPrice > 0 && money.packSize > 0 && packSize > 0) {
        const propRate = money.packPrice / money.packSize;
        const currentRate = packPrice / packSize;
        if (propRate > 0 && totalSaved > 0) {
          return Math.max(0, Math.round((totalSaved / propRate) * currentRate));
        }
      }
    }
    return isNaN(Number(totalSaved)) ? 0 : Math.max(0, Number(totalSaved));
  }, [totalSaved, money, packPrice, packSize]);

  // Real-time time saved calculation
  const totalFreeMinutes = Math.round(safeCigsAvoided * minutesPerCig);
  const freeHours = Math.floor(totalFreeMinutes / 60);
  const freeDays = Math.floor(freeHours / 24);
  const remHours = freeHours % 24;
  const remMinutes = totalFreeMinutes % 60;
  const timeSavedFormatted = freeDays > 0 
    ? `${freeDays}д ${remHours}г` 
    : freeHours > 0 
      ? `${freeHours}г ${remMinutes}хв` 
      : `${totalFreeMinutes} хв`;

  // Toxicology & Biological Protection Metrics
  const tarGrams = (safeCigsAvoided * 0.01).toFixed(1);
  const coLiters = (safeCigsAvoided * 0.018).toFixed(1);
  const heartBeatsSaved = Math.round(safeCigsAvoided * 15 * 12);
  const nicotineMilligrams = (safeCigsAvoided * 1.2).toFixed(1);
  const treesSaved = (safeCigsAvoided / 300).toFixed(1);

  // Tangible Reward Equivalents calculated dynamically with custom prices
  const coffeeCups = Math.floor(safeTotalSaved / (prices.coffee || 65));
  const booksCount = Math.floor(safeTotalSaved / (prices.book || 350));
  const cinemaTickets = Math.floor(safeTotalSaved / (prices.cinema || 250));
  const pizzaNights = Math.floor(safeTotalSaved / (prices.pizza || 420));

  // Goals spending and available funds
  const spentOnGoals = (goals?.base || 0) + (goals?.done?.reduce((acc, g) => acc + (g.amount || g.total || 0), 0) || 0);
  const availableForGoals = Math.max(0, safeTotalSaved - spentOnGoals);

  return (
    <div className="mt-3 pt-3 border-t border-zinc-800 space-y-3 font-sans select-none animate-fadeIn text-left">
      
      {/* 0. БЛОК: ЦІЛІ ТА БАЛАНС КОШТІВ */}
      <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-emerald-500/20 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-emerald-500/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
              <MonoRefractedCoinsIcon className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-black text-emerald-200 tracking-wide">
              Цілі та баланс коштів
            </span>
          </div>
          {onOpenGoalsModal && (
            <button
              type="button"
              onClick={onOpenGoalsModal}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl"
            >
              <span>Керувати цілями</span>
              <span>→</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-rose-500/20 text-left">
            <div className="flex items-center gap-1 text-[10px] text-rose-300 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedBagIcon className="w-3.5 h-3.5 shrink-0 text-rose-400" />
              <span>Витрачено на цілі</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.3)]">
              {spentOnGoals.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', '.')} {currency}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-emerald-500/20 text-left">
            <div className="flex items-center gap-1 text-[10px] text-emerald-300 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedWalletIcon className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>Доступно для цілей</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]">
              {availableForGoals.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', '.')} {currency}
            </div>
          </div>
        </div>
      </div>
      
      {/* 1. БЛОК: ШЛЯХ І СЕРІЇ ЧИСТОТИ */}
      <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-indigo-500/20 space-y-3 shadow-md">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-indigo-500/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
              <MonoRefractedAwardIcon className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-black text-indigo-200 tracking-wide">
              Шлях і серії чистоти
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-indigo-300 font-black font-mono bg-indigo-950/80 px-2.5 py-1 rounded-xl border border-indigo-700/60 shadow-xs">
            {startDate ? `${Math.floor(daysElapsed)} дн чистоти` : '—'}
          </span>
        </div>

        {/* Start Date Card */}
        <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-indigo-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <MonoRefractedCalendarIcon className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
            <span className="text-zinc-300 font-bold text-[11px]">Початок відмови:</span>
          </div>
          <span className="font-mono font-black text-indigo-200 text-xs sm:text-sm">
            {startDate ? new Date(startDate).toLocaleDateString('uk-UA', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : 'Не встановлено'}
          </span>
        </div>

        {/* Streaks Grid */}
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-indigo-500/20">
            <div className="flex items-center gap-1 text-[10px] text-indigo-300 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedAwardIcon className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <span>Найдовша серія</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-indigo-300 truncate drop-shadow-[0_0_8px_rgba(129,140,248,0.35)]">
              {longestStreakMs ? fmtDuration(longestStreakMs) : '—'}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedRefreshIcon className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
              <span>Минулих зривів</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-amber-300 truncate">
              {streaks ? streaks.length : 0}
            </div>
          </div>
        </div>

        {/* Action Buttons for Date & Relapse */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenSetup) {
                onOpenSetup();
              } else if ((window as any).__openSetupModal) {
                (window as any).__openSetupModal();
              }
              window.dispatchEvent(new CustomEvent('open-setup-modal'));
            }}
            className="py-2.5 px-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 rounded-xl text-xs font-bold border border-indigo-500/40 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            <MonoRefractedCalendarIcon className="w-3.5 h-3.5 text-indigo-300" />
            <span>Змінити дату</span>
          </button>
 
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenRelapse) {
                onOpenRelapse();
              } else if ((window as any).__openRelapseModal) {
                (window as any).__openRelapseModal();
              }
              window.dispatchEvent(new CustomEvent('open-relapse-modal'));
            }}
            className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-rose-300 hover:text-rose-200 rounded-xl text-xs font-bold border border-rose-500/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <MonoRefractedRefreshIcon className="w-3.5 h-3.5 text-rose-400" />
            <span>Фіксація зриву</span>
          </button>
        </div>
 
        {streaks && streaks.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onUndoLastRelapse) {
                onUndoLastRelapse();
              } else if ((window as any).__undoLastRelapse) {
                (window as any).__undoLastRelapse();
              }
              window.dispatchEvent(new CustomEvent('undo-last-relapse'));
            }}
            className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 rounded-xl text-xs font-bold border border-zinc-800 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <MonoRefractedRefreshIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span>Скасувати останній зрив</span>
          </button>
        )}
      </div>

      {/* 2. Прогноз по горизонтах */}
      <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-cyan-500/20 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-cyan-500/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-xs">
              <MonoRefractedTrendingUpIcon className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-black text-cyan-200 tracking-wide">
              Прогноз збережень
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-cyan-300 font-black font-mono bg-cyan-950/80 px-2.5 py-1 rounded-xl border border-cyan-700/60 shadow-xs">
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
                className={`py-1 rounded-lg transition-all cursor-pointer text-center text-[10.5px] font-extrabold ${
                  active 
                    ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/50 shadow-xs' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {labels[h]}
              </button>
            );
          })}
        </div>

        {/* Forecast 3-Grid */}
        <div className="grid grid-cols-3 gap-2 text-left">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-emerald-500/20">
            <div className="flex items-center gap-1 text-[10px] text-emerald-300 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedCoinsIcon className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>Кошти</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-emerald-400 truncate drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]">
              +{horizonData.forecastMoney.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-cyan-500/20">
            <div className="flex items-center gap-1 text-[10px] text-cyan-300 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedBirdIcon className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
              <span>Час</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-cyan-400 truncate drop-shadow-[0_0_8px_rgba(34,211,238,0.35)]">
              +{horizonData.forecastHours} год
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-amber-500/20">
            <div className="flex items-center gap-1 text-[10px] text-amber-300 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedCigaretteIcon className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>Не викурено</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-amber-400 truncate drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]">
              +{horizonData.forecastPacks} пач
            </div>
          </div>
        </div>
      </div>

      {/* 3. Детокс та захист здоров'я */}
      <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-rose-500/20 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-rose-500/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 shadow-xs">
              <MonoRefractedShieldIcon className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-black text-rose-200 tracking-wide">
              Детокс та захист здоров'я
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-rose-300 font-black font-mono bg-rose-950/80 px-2.5 py-1 rounded-xl border border-rose-700/60 shadow-xs">
            Біо-показники
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-left">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-rose-500/20">
            <div className="flex items-center gap-1 text-[10px] text-rose-300 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedFlameIcon className="w-3.5 h-3.5 shrink-0 text-rose-400" />
              <span>Смоли</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-rose-400 truncate drop-shadow-[0_0_8px_rgba(251,113,133,0.3)]">
              -{tarGrams} г
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-sky-500/20">
            <div className="flex items-center gap-1 text-[10px] text-sky-300 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedDropIcon className="w-3.5 h-3.5 shrink-0 text-sky-400" />
              <span>CO (Газ)</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-sky-400 truncate drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]">
              -{coLiters} л
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-red-500/20">
            <div className="flex items-center gap-1 text-[10px] text-red-300 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedHeartIcon className="w-3.5 h-3.5 shrink-0 text-red-400" />
              <span>Пульс</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-red-400 truncate drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]">
              +{heartBeatsSaved.toLocaleString('uk-UA')}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-purple-500/20">
            <div className="flex items-center gap-1 text-[10px] text-purple-300 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedZapIcon className="w-3.5 h-3.5 shrink-0 text-purple-400" />
              <span>Нікотин</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-purple-400 truncate drop-shadow-[0_0_8px_rgba(192,132,252,0.3)]">
              -{nicotineMilligrams} мг
            </div>
          </div>

          <div 
            onClick={(e) => {
              e.stopPropagation();
              onOpenTreeTip?.();
            }}
            className="p-2.5 rounded-xl bg-zinc-900/90 border border-emerald-500/20 hover:border-emerald-500/40 col-span-2 sm:col-span-1 cursor-pointer transition-all active:scale-95"
            title="Врятовані дерева (300 шт = 1 дерево)"
          >
            <div className="flex items-center gap-1 text-[10px] text-emerald-300 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedTreeIcon className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>Дерева</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-emerald-400 truncate drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
              ~{treesSaved}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Блок еквівалентів товарів */}
      <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-teal-500/20 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-teal-500/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0 shadow-xs">
              <MonoRefractedBagIcon className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-black text-teal-200 tracking-wide">
              Еквіваленти заощаджень
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setTempPrices(prices);
              setIsEditingPrices(!isEditingPrices);
            }}
            className="px-2.5 py-1 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-[11px] font-bold text-teal-200 flex items-center gap-1 cursor-pointer transition-colors border border-teal-500/30 shadow-xs"
            title="Вказати вартість товарів"
          >
            <MonoRefractedSlidersIcon className="w-3 h-3 text-teal-400" />
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
                <MonoRefractedRefreshIcon className="w-2.5 h-2.5" />
                <span>Скинути</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                  <MonoRefractedCoffeeIcon className="w-3.5 h-3.5" />
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
                  <MonoRefractedBookIcon className="w-3.5 h-3.5" />
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
                  <MonoRefractedFilmIcon className="w-3.5 h-3.5" />
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
                  <MonoRefractedPizzaIcon className="w-3.5 h-3.5" />
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
          <div 
            onClick={() => { setTempPrices(prices); setIsEditingPrices(!isEditingPrices); }}
            className="p-2.5 rounded-xl bg-zinc-900/90 border border-amber-500/20 hover:border-amber-500/40 cursor-pointer active:scale-95 transition-all"
            title="Натисніть для зміни ціни"
          >
            <div className="flex items-center gap-1 text-[10px] text-amber-300 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedCoffeeIcon className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>Кава</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)] truncate">
              {coffeeCups} чашок
            </div>
          </div>

          <div 
            onClick={() => { setTempPrices(prices); setIsEditingPrices(!isEditingPrices); }}
            className="p-2.5 rounded-xl bg-zinc-900/90 border border-blue-500/20 hover:border-blue-500/40 cursor-pointer active:scale-95 transition-all"
            title="Натисніть для зміни ціни"
          >
            <div className="flex items-center gap-1 text-[10px] text-blue-300 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedBookIcon className="w-3.5 h-3.5 shrink-0 text-blue-400" />
              <span>Книги</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-blue-300 drop-shadow-[0_0_6px_rgba(147,197,253,0.3)] truncate">
              {booksCount} книг
            </div>
          </div>

          <div 
            onClick={() => { setTempPrices(prices); setIsEditingPrices(!isEditingPrices); }}
            className="p-2.5 rounded-xl bg-zinc-900/90 border border-purple-500/20 hover:border-purple-500/40 cursor-pointer active:scale-95 transition-all"
            title="Натисніть для зміни ціни"
          >
            <div className="flex items-center gap-1 text-[10px] text-purple-300 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedFilmIcon className="w-3.5 h-3.5 shrink-0 text-purple-400" />
              <span>Кіно</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-purple-300 drop-shadow-[0_0_6px_rgba(216,180,254,0.3)] truncate">
              {cinemaTickets} квитків
            </div>
          </div>

          <div 
            onClick={() => { setTempPrices(prices); setIsEditingPrices(!isEditingPrices); }}
            className="p-2.5 rounded-xl bg-zinc-900/90 border border-orange-500/20 hover:border-orange-500/40 cursor-pointer active:scale-95 transition-all"
            title="Натисніть для зміни ціни"
          >
            <div className="flex items-center gap-1 text-[10px] text-orange-300 font-extrabold uppercase mb-0.5 tracking-wider">
              <MonoRefractedPizzaIcon className="w-3.5 h-3.5 shrink-0 text-orange-400" />
              <span>Піца</span>
            </div>
            <div className="text-sm sm:text-base font-black font-mono text-orange-300 drop-shadow-[0_0_6px_rgba(253,186,116,0.3)] truncate">
              {pizzaNights} піц
            </div>
          </div>
        </div>
      </div>

      {/* КАЛЬКУЛЯТОР ПАРАМЕТРІВ ПАЧКИ ТА ЧАСУ (ПЕРЕМІЩЕНО УНИЗ) */}
      <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-amber-500/20 space-y-3 shadow-md">
        {/* Заголовок та кнопка "Змінити ціну на пачку" */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-500/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
              <Calculator className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-black text-amber-200 tracking-wide truncate">
                Калькулятор параметрів пачки
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-amber-400/80 truncate">
                Ціна, розмір пачки та час на сигарету
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setNewTierPrice(packPrice);
              setRawNewTierPriceInput(String(packPrice));
              setIsPriceModalOpen(true);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 text-[11px] font-bold transition-all cursor-pointer border border-amber-500/30 flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95"
            title="Змінити ціну на пачку з прив'язкою до дати або базову"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Змінити ціну</span>
          </button>
        </div>

        {/* Стрічка миттєвих підрахунків */}
        <div className="grid grid-cols-3 gap-2 text-left">
          <div 
            onClick={() => setIsPriceModalOpen(true)}
            className="p-2.5 rounded-xl bg-zinc-900/90 border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer active:scale-95"
            title="Змінити ціну"
          >
            <div className="text-[10px] uppercase font-extrabold tracking-wider text-amber-300/80 mb-0.5">1 сигарета</div>
            <div className="text-sm sm:text-base font-black font-mono text-amber-300 truncate drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]">
              {costPerCig.toFixed(2)} {currency}
            </div>
          </div>
          <div 
            onClick={() => setIsPriceModalOpen(true)}
            className="p-2.5 rounded-xl bg-zinc-900/90 border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer active:scale-95"
            title="Змінити ціну"
          >
            <div className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-300/80 mb-0.5">Витрати / день</div>
            <div className="text-sm sm:text-base font-black font-mono text-emerald-400 truncate drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]">
              {costPerDay.toFixed(2)} {currency}
            </div>
          </div>
          <div 
            onClick={() => {
              const el = document.getElementById('calc-pack-price-input');
              if (el) el.focus();
            }}
            className="p-2.5 rounded-xl bg-zinc-900/90 border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer active:scale-95"
            title="Натисніть для налаштування"
          >
            <div className="text-[10px] uppercase font-extrabold tracking-wider text-cyan-300/80 mb-0.5">Час / день</div>
            <div className="text-sm sm:text-base font-black font-mono text-cyan-400 truncate drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]">
              {Math.round(perDay * minutesPerCig)} хв
            </div>
          </div>
        </div>

        {/* 1. Ціна пачки в грн (1 - 1000 грн, крок 1 грн) */}
        <div className="space-y-1.5 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-200 font-bold">Ціна пачки в грн:</span>
            <div className="flex items-center gap-1.5">
              <input
                id="calc-pack-price-input"
                type="text"
                inputMode="numeric"
                value={rawPackPriceInput}
                onChange={(e) => {
                  const text = e.target.value.replace(/[^0-9]/g, '');
                  setRawPackPriceInput(text);
                  if (text !== '') {
                    const num = Number(text);
                    if (num >= 1 && num <= 1000) {
                      setPackPrice(num);
                      const updated: MoneySettings = {
                        ...(money || { cur: '₴', priceHistory: [] }),
                        packPrice: num,
                        packSize,
                        perDay,
                        minutesPerCig,
                      };
                      applyMoneyUpdate(updated);
                    }
                  }
                }}
                onBlur={() => {
                  let num = Number(rawPackPriceInput);
                  if (isNaN(num) || num < 1) num = 100;
                  if (num > 1000) num = 1000;
                  setRawPackPriceInput(String(num));
                  updatePackPrice(num);
                }}
                className="w-16 px-2 py-0.5 bg-zinc-950 border border-amber-500/40 rounded-lg text-center font-mono font-black text-xs text-amber-300 focus:outline-none focus:border-amber-400"
              />
              <span className="text-xs font-mono font-bold text-amber-400">грн</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1 my-1">
            {[80, 100, 120, 150, 200].map((priceVal) => (
              <button
                key={priceVal}
                type="button"
                onClick={() => updatePackPrice(priceVal)}
                className={`py-1.5 px-0.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer text-center ${
                  packPrice === priceVal
                    ? 'bg-amber-500/25 text-amber-200 border border-amber-500/50 shadow-xs'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:bg-zinc-800/50'
                }`}
              >
                {priceVal} грн
              </button>
            ))}
          </div>

          <input
            type="range"
            min={1}
            max={500}
            step={1}
            value={packPrice}
            onChange={(e) => updatePackPrice(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400 mt-1"
          />

          <div className="flex justify-between text-[10px] font-mono text-zinc-500 px-0.5">
            <span>1 грн</span>
            <span>100 грн</span>
            <span>200 грн</span>
            <span>300 грн</span>
            <span>500 грн</span>
          </div>
        </div>

        {/* 2. Сигарет у пачці (20 стандарт, 25, 30) */}
        <div className="space-y-1.5 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-200 font-bold">Сигарет у пачці:</span>
            <span className="font-mono font-black text-amber-300 text-xs">{packSize} шт</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { size: 20, label: '20 (Стандарт)' },
              { size: 25, label: '25' },
              { size: 30, label: '30' }
            ].map((item) => (
              <button
                key={item.size}
                type="button"
                onClick={() => updatePackSize(item.size)}
                className={`py-2 px-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center ${
                  packSize === item.size
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-xs'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:bg-zinc-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Часу на одну сигарету */}
        <div className="space-y-1.5 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-200 font-bold">Часу на одну сигарету:</span>
            <span className="font-mono font-black text-cyan-300 text-xs">{minutesPerCig} хв</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 mb-1">
            {[
              { min: 3, label: '3 хв' },
              { min: 5, label: '5 хв' },
              { min: 7, label: '7 хв (Стандарт)' },
              { min: 10, label: '10 хв' },
            ].map((item) => (
              <button
                key={item.min}
                type="button"
                onClick={() => updateMinutesPerCig(item.min)}
                className={`py-1.5 px-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer text-center truncate ${
                  minutesPerCig === item.min
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/50 shadow-xs'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:bg-zinc-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <input
            type="range"
            min={1}
            max={15}
            step={1}
            value={minutesPerCig}
            onChange={(e) => updateMinutesPerCig(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 mt-1"
          />

          <div className="flex justify-between text-[10px] font-mono text-zinc-500 px-0.5">
            <span>1 хв</span>
            <span>5 хв</span>
            <span>10 хв</span>
            <span>15 хв</span>
          </div>
        </div>

        {/* 4. Кількість викурюваних сигарет на день */}
        <div className="space-y-1.5 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-200 font-bold">Сигарет на день:</span>
            <span className="font-mono font-black text-emerald-300 text-xs">{perDay} шт/день</span>
          </div>

          <div className="grid grid-cols-5 gap-1 mb-1">
            {[10, 15, 20, 25, 30].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => updatePerDay(num)}
                className={`py-1.5 px-0.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer text-center ${
                  perDay === num
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/50 shadow-xs'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:bg-zinc-800/50'
                }`}
              >
                {num === 20 ? '20 (Пачка)' : `${num}`}
              </button>
            ))}
          </div>

          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={perDay}
            onChange={(e) => updatePerDay(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 mt-1"
          />

          <div className="flex justify-between text-[10px] font-mono text-zinc-500 px-0.5">
            <span>1 шт</span>
            <span>15 шт</span>
            <span>25 шт</span>
            <span>50 шт</span>
          </div>
        </div>
      </div>

      {/* МОДАЛЬНЕ ВІКНО «ЗМІНИТИ ЦІНУ НА ПАЧКУ» */}
      {isPriceModalOpen && (
        <div 
          className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsPriceModalOpen(false)}
        >
          <div 
            className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3.5 text-zinc-100 animate-in zoom-in-95 duration-200 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100">Змінити ціну на пачку</div>
                  <div className="text-[11px] text-zinc-400">Оновлення вартості для статистики</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPriceModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-full hover:bg-zinc-900 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Price Input & Slider */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-300 font-medium">Нова ціна пачки:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={rawNewTierPriceInput}
                    onChange={(e) => {
                      const text = e.target.value.replace(/[^0-9]/g, '');
                      setRawNewTierPriceInput(text);
                      if (text !== '') {
                        const num = Number(text);
                        if (num >= 1 && num <= 1000) {
                          setNewTierPrice(num);
                        }
                      }
                    }}
                    onBlur={() => {
                      let num = Number(rawNewTierPriceInput);
                      if (isNaN(num) || num < 1) num = 100;
                      if (num > 1000) num = 1000;
                      setRawNewTierPriceInput(String(num));
                      setNewTierPrice(num);
                    }}
                    className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-700 rounded-xl text-center font-mono font-bold text-sm text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                  <span className="font-mono font-bold text-zinc-400 text-sm">грн</span>
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={500}
                step={1}
                value={newTierPrice}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setNewTierPrice(v);
                  setRawNewTierPriceInput(String(v));
                }}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400 mt-1"
              />

              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>1 грн</span>
                <span>100 грн</span>
                <span>250 грн</span>
                <span>500 грн</span>
              </div>
            </div>

            {/* Mode: New Period (Tier) vs Base Price */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-zinc-400 font-medium">Тип застосування зміни:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPriceTierMode('today')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    priceTierMode === 'today'
                      ? 'bg-zinc-800 text-zinc-100 border-amber-500/50 shadow-xs'
                      : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>З нової дати</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    Зберігає старі ціни для минулих днів
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPriceTierMode('base')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    priceTierMode === 'base'
                      ? 'bg-zinc-800 text-zinc-100 border-amber-500/50 shadow-xs'
                      : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                    <span>Для всієї історії</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    Перераховує всі дні за новою ціною
                  </div>
                </button>
              </div>
            </div>

            {priceTierMode === 'today' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Дата початку нової ціни:</span>
                  <input
                    type="date"
                    value={priceTierDate}
                    onChange={(e) => setPriceTierDate(e.target.value)}
                    className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Примітка (наприклад: Подорожчання Parliament)"
                  value={priceTierNote}
                  onChange={(e) => setPriceTierNote(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />
              </div>
            )}

            {/* Price History List */}
            {money?.priceHistory && money.priceHistory.length > 0 && (
              <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Історія змін цін ({money.priceHistory.length}):</span>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {money.priceHistory.map((tier) => (
                    <div 
                      key={tier.timestamp}
                      className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="font-mono font-bold text-amber-300">{tier.packPrice} {currency}</div>
                        <div className="text-[10px] text-zinc-500">
                          з {new Date(tier.timestamp).toLocaleDateString('uk-UA')}
                          {tier.note && ` • ${tier.note}`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeletePriceTier(tier.timestamp)}
                        className="text-zinc-500 hover:text-rose-400 p-1 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
                        title="Видалити цей період"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsPriceModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-semibold border border-zinc-800 transition-colors cursor-pointer"
              >
                Скасувати
              </button>
              <button
                type="button"
                onClick={handleSavePriceChangeModal}
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                Зберегти нову ціну
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
