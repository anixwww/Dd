import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MonoRefractedWalletIcon,
  MonoRefractedBirdIcon,
  MonoRefractedCigaretteIcon,
  MonoRefractedTreeIcon
} from './MonoRefractedStatsIcons';

type ColorTheme = 'amber' | 'sky' | 'rose' | 'emerald';

interface ThemeStyles {
  textColor: string;
  glowColor: string;
  auraGradient: string;
  borderColor: string;
  bgActive: string;
  hoverBg: string;
  deltaColor: string;
}

const THEME_MAP: Record<ColorTheme, ThemeStyles> = {
  amber: {
    textColor: 'text-amber-300',
    glowColor: 'rgba(251, 191, 36, 0.75)',
    auraGradient: 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 75%)',
    borderColor: 'rgba(251, 191, 36, 0.45)',
    bgActive: 'bg-amber-500/10 shadow-[0_0_12px_rgba(251,191,36,0.2),inset_0_0_6px_rgba(251,191,36,0.1)]',
    hoverBg: 'hover:bg-amber-500/10',
    deltaColor: 'text-amber-200 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]'
  },
  sky: {
    textColor: 'text-sky-300',
    glowColor: 'rgba(56, 189, 248, 0.75)',
    auraGradient: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.25) 0%, rgba(14, 165, 233, 0.08) 50%, transparent 75%)',
    borderColor: 'rgba(56, 189, 248, 0.45)',
    bgActive: 'bg-sky-500/10 shadow-[0_0_12px_rgba(56,189,248,0.2),inset_0_0_6px_rgba(56,189,248,0.1)]',
    hoverBg: 'hover:bg-sky-500/10',
    deltaColor: 'text-sky-200 drop-shadow-[0_0_4px_rgba(56,189,248,0.8)]'
  },
  rose: {
    textColor: 'text-rose-300',
    glowColor: 'rgba(244, 63, 94, 0.75)',
    auraGradient: 'radial-gradient(ellipse at center, rgba(244, 63, 94, 0.25) 0%, rgba(225, 29, 72, 0.08) 50%, transparent 75%)',
    borderColor: 'rgba(244, 63, 94, 0.45)',
    bgActive: 'bg-rose-500/10 shadow-[0_0_12px_rgba(244,63,94,0.2),inset_0_0_6px_rgba(244,63,94,0.1)]',
    hoverBg: 'hover:bg-rose-500/10',
    deltaColor: 'text-rose-200 drop-shadow-[0_0_4px_rgba(244,63,94,0.8)]'
  },
  emerald: {
    textColor: 'text-emerald-300',
    glowColor: 'rgba(52, 211, 153, 0.75)',
    auraGradient: 'radial-gradient(ellipse at center, rgba(52, 211, 153, 0.25) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 75%)',
    borderColor: 'rgba(52, 211, 153, 0.45)',
    bgActive: 'bg-emerald-500/10 shadow-[0_0_12px_rgba(52,211,153,0.2),inset_0_0_6px_rgba(52,211,153,0.1)]',
    hoverBg: 'hover:bg-emerald-500/10',
    deltaColor: 'text-emerald-200 drop-shadow-[0_0_4px_rgba(52,211,153,0.8)]'
  }
};

interface DynamicStatItemProps {
  icon: React.ReactNode;
  formattedValue: string;
  numericValue?: number;
  theme: ColorTheme;
  title: string;
  onClick?: (e: React.MouseEvent) => void;
  deltaSuffix?: string;
}

const DynamicStatItem: React.FC<DynamicStatItemProps> = ({
  icon,
  formattedValue,
  numericValue,
  theme,
  title,
  onClick,
  deltaSuffix
}) => {
  const styles = THEME_MAP[theme];
  const [isIlluminated, setIsIlluminated] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<number>(0);
  const [changedIndices, setChangedIndices] = useState<Set<number>>(new Set());
  const [floatingDelta, setFloatingDelta] = useState<string | null>(null);

  const prevValueRef = useRef<string>(formattedValue);
  const prevNumRef = useRef<number | undefined>(numericValue);
  const isMountedRef = useRef<boolean>(false);
  const timerRef = useRef<any>(null);
  const deltaTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      prevValueRef.current = formattedValue;
      prevNumRef.current = numericValue;
      return;
    }

    if (prevValueRef.current !== formattedValue) {
      const prev = prevValueRef.current;
      const curr = formattedValue;
      const newChanged = new Set<number>();

      // Detect character differences
      if (prev.length === curr.length) {
        for (let i = 0; i < curr.length; i++) {
          if (curr[i] !== prev[i]) {
            newChanged.add(i);
          }
        }
      } else {
        // Length change (e.g. 9.99 -> 10.00): highlight all digits
        for (let i = 0; i < curr.length; i++) {
          if (/[0-9]/.test(curr[i])) {
            newChanged.add(i);
          }
        }
      }

      setChangedIndices(newChanged);
      setUpdateId((v) => v + 1);
      setIsIlluminated(true);

      // Check numeric delta
      if (numericValue !== undefined && prevNumRef.current !== undefined) {
        const diff = numericValue - prevNumRef.current;
        if (diff > 0.0001) {
          const deltaStr = diff < 0.1 
            ? `+${diff.toFixed(2)}` 
            : diff < 10 
              ? `+${diff.toFixed(1)}` 
              : `+${Math.round(diff)}`;
          setFloatingDelta(deltaSuffix ? `${deltaStr}${deltaSuffix}` : deltaStr);
          if (deltaTimerRef.current) clearTimeout(deltaTimerRef.current);
          deltaTimerRef.current = setTimeout(() => setFloatingDelta(null), 1400);
        }
      }

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsIlluminated(false);
        setChangedIndices(new Set());
      }, 1500);

      prevValueRef.current = formattedValue;
      prevNumRef.current = numericValue;
    }
  }, [formattedValue, numericValue, deltaSuffix]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (deltaTimerRef.current) clearTimeout(deltaTimerRef.current);
    };
  }, []);

  const renderedCharacters = useMemo(() => {
    return formattedValue.split('').map((char, idx) => {
      if (char === ' ') {
        return (
          <span key={`space-${idx}`} className="inline-block w-[2.5px]">
            {'\u00A0'}
          </span>
        );
      }
      const isChanged = changedIndices.has(idx);
      if (isChanged) {
        return (
          <span
            key={`char-${idx}-${updateId}-${char}`}
            className="animate-stat-digit-ignite font-black"
            style={{
              color: '#ffffff',
              textShadow: `0 0 5px ${styles.glowColor}`
            }}
          >
            {char}
          </span>
        );
      }
      return (
        <span
          key={`char-${idx}-${char}`}
          className="inline-block transition-colors duration-500"
        >
          {char}
        </span>
      );
    });
  }, [formattedValue, changedIndices, updateId, styles.glowColor]);

  return (
    <span
      onClick={onClick}
      className={`relative px-1 sm:px-1.5 py-0.5 rounded-lg sm:rounded-xl flex items-center gap-0.5 sm:gap-1 shrink-0 transition-all duration-500 ease-out select-none border ${
        isIlluminated
          ? `${styles.bgActive} border-[${styles.borderColor}]`
          : `border-transparent ${styles.hoverBg}`
      }`}
      style={{
        borderColor: isIlluminated ? styles.borderColor : 'transparent'
      }}
      title={title}
    >
      {/* Dynamic Ambient Backlight Aura */}
      {isIlluminated && (
        <div
          key={`aura-${updateId}`}
          className="absolute inset-0 rounded-xl animate-stat-aura pointer-events-none"
          style={{ background: styles.auraGradient }}
        />
      )}

      {/* Prismatic Shimmer Sweep */}
      {isIlluminated && (
        <div
          key={`sheen-${updateId}`}
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
        >
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-stat-sheen" />
        </div>
      )}

      {/* Floating Delta Badge */}
      {floatingDelta && (
        <div
          key={`delta-${updateId}`}
          className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-black whitespace-nowrap animate-stat-delta z-20 pointer-events-none ${styles.deltaColor}`}
        >
          {floatingDelta}
        </div>
      )}

      {/* Reactive Animated Icon */}
      <div
        key={`icon-${updateId}`}
        className={`shrink-0 transition-transform duration-300 ${
          isIlluminated ? 'animate-stat-icon-flare' : 'group-hover:scale-110'
        }`}
        style={{
          color: isIlluminated ? '#ffffff' : undefined,
          filter: isIlluminated ? `drop-shadow(0 0 8px ${styles.glowColor})` : undefined
        }}
      >
        {icon}
      </div>

      {/* Dynamic Character-Level Illuminated Text */}
      <span
        className={`font-mono font-bold tracking-tight text-[9px] min-[360px]:text-[10px] min-[400px]:text-[11px] sm:text-xs whitespace-nowrap inline-flex items-center tabular-nums transition-all duration-500 ${
          isIlluminated ? `${styles.textColor} font-black` : styles.textColor
        }`}
      >
        {renderedCharacters}
      </span>
    </span>
  );
};

interface MainStatsWidgetProps {
  totalSaved: number;
  cigsAvoided: number;
  returnedTimeText?: string;
  minutesPerCig?: number;
  currency?: string;
  onOpenStatistics?: () => void;
  onOpenTreeTip?: () => void;
  className?: string;
}

export const MainStatsWidget: React.FC<MainStatsWidgetProps> = ({
  totalSaved,
  cigsAvoided,
  returnedTimeText,
  minutesPerCig = 7,
  currency = '₴',
  onOpenStatistics,
  onOpenTreeTip,
  className = ''
}) => {
  const safeSaved = isNaN(Number(totalSaved)) ? 0 : Math.max(0, Number(totalSaved));
  const safeCigs = isNaN(Number(cigsAvoided)) ? 0 : Math.max(0, Number(cigsAvoided));
  const safeTrees = Number((safeCigs / 300).toFixed(2));

  // Adaptive compact number formatting with hundredths (.XX)
  const formatCompactHundredths = (val: number): string => {
    if (val >= 100000) {
      return `${(val / 1000).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', '.')}k`;
    }
    return val.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', '.');
  };

  // Time returned calculation in hundredths (соті)
  const safeMinutesPerCig = isNaN(Number(minutesPerCig)) ? 7 : Math.max(1, Number(minutesPerCig));
  const totalMinutesFloat = safeCigs * safeMinutesPerCig;
  const totalHoursFloat = totalMinutesFloat / 60;
  const totalDaysFloat = totalHoursFloat / 24;

  let safeTimeNum = 0;
  let timeUnitSuffix = ' хв';
  let formattedTime = '';

  if (totalDaysFloat >= 365) {
    const yearsFloat = totalDaysFloat / 365;
    safeTimeNum = Number(yearsFloat.toFixed(2));
    timeUnitSuffix = ' р';
    formattedTime = `${formatCompactHundredths(yearsFloat)} р`;
  } else if (totalDaysFloat >= 1) {
    safeTimeNum = Number(totalDaysFloat.toFixed(2));
    timeUnitSuffix = ' дн';
    formattedTime = `${formatCompactHundredths(totalDaysFloat)} дн`;
  } else if (totalHoursFloat >= 1) {
    safeTimeNum = Number(totalHoursFloat.toFixed(2));
    timeUnitSuffix = ' год';
    formattedTime = `${formatCompactHundredths(totalHoursFloat)} год`;
  } else {
    safeTimeNum = Number(totalMinutesFloat.toFixed(2));
    timeUnitSuffix = ' хв';
    formattedTime = `${formatCompactHundredths(totalMinutesFloat)} хв`;
  }

  const formattedSaved = `${formatCompactHundredths(safeSaved)} ${currency}`;
  const formattedCigs = `${formatCompactHundredths(safeCigs)} шт`;
  const formattedTrees = `${safeTrees.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(',', '.')} д`;

  const timeDetailedTooltip = totalDaysFloat >= 1
    ? `Повернений час життя: ${Math.floor(totalDaysFloat)} дн ${Math.floor(totalHoursFloat % 24)} год ${Math.floor(totalMinutesFloat % 60)} хв (${safeTimeNum.toFixed(2)} дн)`
    : totalHoursFloat >= 1
      ? `Повернений час життя: ${Math.floor(totalHoursFloat)} год ${Math.floor(totalMinutesFloat % 60)} хв (${safeTimeNum.toFixed(2)} год)`
      : `Повернений час життя: ${safeTimeNum.toFixed(2)} хв`;

  return (
    <div
      onClick={onOpenStatistics}
      className={`w-full py-1.5 sm:py-2 px-1.5 xs:px-2 sm:px-3 rounded-2xl flex items-center justify-between gap-0.5 sm:gap-2 font-mono cursor-pointer transition-all duration-500 ease-out select-none shadow-sm bg-[#16161f]/90 border border-zinc-800/90 hover:bg-[#1a1a26] hover:border-zinc-700/80 active:scale-[0.99] relative group overflow-hidden ${className}`}
      title="Детальна статистика (натисніть для огляду)"
    >
      <div className="flex-1 min-w-0 flex items-center justify-between sm:justify-center gap-0.5 min-[360px]:gap-1 sm:gap-2.5 text-zinc-300 font-semibold overflow-x-auto no-scrollbar">
        
        {/* 1. ГРОШІ (Золотистий / Gold) */}
        <DynamicStatItem
          icon={<MonoRefractedWalletIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />}
          formattedValue={formattedSaved}
          numericValue={safeSaved}
          theme="amber"
          title="Заощаджені гроші"
          deltaSuffix={` ${currency}`}
        />

        {/* 2. ЧАС (Блакитний / Sky Blue) — У СОТИХ З ДИНАМІЧНИМ ОСВІТЛЕННЯМ */}
        <DynamicStatItem
          icon={<MonoRefractedBirdIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400" />}
          formattedValue={formattedTime}
          numericValue={safeTimeNum}
          theme="sky"
          title={timeDetailedTooltip}
          deltaSuffix={timeUnitSuffix}
        />

        {/* 3. СИГАРЕТИ (Червоний / Red) */}
        <DynamicStatItem
          icon={<MonoRefractedCigaretteIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" />}
          formattedValue={formattedCigs}
          numericValue={safeCigs}
          theme="rose"
          title="Пропущені сигарети"
          deltaSuffix=" шт"
        />

        {/* 4. ЛІС (Зелений / Emerald Green) */}
        <DynamicStatItem
          icon={<MonoRefractedTreeIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />}
          formattedValue={formattedTrees}
          numericValue={safeTrees}
          theme="emerald"
          title="Врятовані дерева (натисніть для підказки)"
          onClick={(e) => {
            if (onOpenTreeTip) {
              e.stopPropagation();
              onOpenTreeTip();
            }
          }}
          deltaSuffix=" д"
        />

      </div>
    </div>
  );
};
