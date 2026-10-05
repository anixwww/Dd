import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { MonoRefractedPulseIcon } from './MonoRefractedStatsIcons';

interface IndicatorItem {
  key: string;
  label: string;
  current: number;
  baseline: number;
  pct: number;
  isPositive: boolean;
  isNeutral: boolean;
  noteText: string;
  isRising: boolean;
  isFalling: boolean;
}

const INDICATOR_CONFIGS = [
  { key: 'craving', label: 'Тяга', isNegative: true },
  { key: 'thoughts', label: 'Нав\'язливі думки', isNegative: true },
  { key: 'anxiety', label: 'Тривожність', isNegative: true },
  { key: 'irritability', label: 'Дратівливість', isNegative: true },
  { key: 'calmness', label: 'Спокій', isNegative: false },
  { key: 'energy', label: 'Енергія', isNegative: false },
  { key: 'focus', label: 'Концентрація', isNegative: false },
  { key: 'overall', label: 'Загальний стан', isNegative: false },
];

const initialBenchmark: Record<string, number> = {
  craving: 6,
  thoughts: 6,
  anxiety: 5,
  irritability: 4,
  calmness: 5,
  energy: 5,
  focus: 5,
  overall: 5,
};

export const DynamicsMarqueeWidget: React.FC = () => {
  const [items, setItems] = useState<IndicatorItem[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const loadData = () => {
    try {
      const storedFilter = (localStorage.getItem('quit-smoking:dynamics-filter') as string) || 'prev_slice';

      const rawLatest = localStorage.getItem('quit-smoking:latest-slice');
      const latest = rawLatest ? JSON.parse(rawLatest) : null;

      const rawSlices = localStorage.getItem('quit-smoking:health-slices');
      let slices: any[] = rawSlices ? JSON.parse(rawSlices) : [];

      if (slices.length < 2) {
        const rawDays = localStorage.getItem('quit-smoking:days');
        if (rawDays) {
          const daysMap = JSON.parse(rawDays);
          const extraSlices: any[] = [];
          Object.keys(daysMap).sort().forEach((dateKey) => {
            const day = daysMap[dateKey];
            const surveys = day.surveys || day.entries || [];
            surveys.forEach((s: any, idx: number) => {
              extraSlices.push({
                id: new Date(s.timestamp || `${dateKey}T12:00:00`).getTime() || idx,
                date: dateKey,
                time: s.time || '12:00',
                craving: s.craving ?? 4,
                thoughts: s.intrusiveThoughts ?? s.thoughts ?? 4,
                anxiety: s.anxiety ?? 3,
                irritability: s.irritability ?? 2,
                calmness: s.balance ?? s.calmness ?? 7,
                energy: s.energy ?? 7,
                focus: s.focus ?? 7,
                overall: s.mood ?? s.overall ?? 7,
              });
            });
          });
          if (extraSlices.length > 0) {
            const map = new Map<number, any>();
            [...extraSlices, ...slices].forEach((s) => map.set(s.id, s));
            slices = Array.from(map.values()).sort((a, b) => a.id - b.id);
          }
        }
      }

      // Determine current slice values
      let currentVals: Record<string, number> = { ...initialBenchmark };
      if (slices.length > 0) {
        const last = slices[slices.length - 1];
        currentVals = {
          craving: last.craving ?? 4,
          thoughts: last.thoughts ?? 4,
          anxiety: last.anxiety ?? 3,
          irritability: last.irritability ?? 2,
          calmness: last.calmness ?? 7,
          energy: last.energy ?? 7,
          focus: last.focus ?? 7,
          overall: last.overall ?? 7,
        };
      } else if (latest) {
        currentVals = {
          craving: latest.craving ?? 4,
          thoughts: latest.thoughts ?? 4,
          anxiety: latest.anxiety ?? 3,
          irritability: latest.irritability ?? 2,
          calmness: latest.calmness ?? 7,
          energy: latest.energy ?? 7,
          focus: latest.focus ?? 7,
          overall: latest.overall ?? 7,
        };
      }

      // Determine baseline pool and metadata based on storedFilter
      let baselineVals: Record<string, number> = { ...initialBenchmark };
      const now = Date.now();
      const DAY_MS = 24 * 60 * 60 * 1000;

      if (storedFilter === 'prev_day') {
        const yesterday = new Date(now - DAY_MS);
        const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
        const yKey = `${yesterday.getFullYear()}-${pad(yesterday.getMonth() + 1)}-${pad(yesterday.getDate())}`;

        const yesterdaySlices = slices.filter((s) => s.date === yKey);
        const targetPool = yesterdaySlices.length > 0
          ? yesterdaySlices
          : (slices.length > 1 ? slices.slice(0, slices.length - 1) : [initialBenchmark]);

        INDICATOR_CONFIGS.forEach((cfg) => {
          const sum = targetPool.reduce((acc, s) => acc + (s[cfg.key] ?? initialBenchmark[cfg.key] ?? 3), 0);
          baselineVals[cfg.key] = parseFloat((sum / targetPool.length).toFixed(1));
        });
      } else if (storedFilter === 'prev_week') {
        const weekCutoff = now - 7 * DAY_MS;
        const weekSlices = slices.filter((s) => s.id >= weekCutoff && s.id < now - 3600000);
        const targetPool = weekSlices.length > 0 ? weekSlices : (slices.length > 0 ? slices : [initialBenchmark]);

        INDICATOR_CONFIGS.forEach((cfg) => {
          const sum = targetPool.reduce((acc, s) => acc + (s[cfg.key] ?? initialBenchmark[cfg.key] ?? 3), 0);
          baselineVals[cfg.key] = parseFloat((sum / targetPool.length).toFixed(1));
        });
      } else if (storedFilter === 'prev_month') {
        const monthCutoff = now - 30 * DAY_MS;
        const monthSlices = slices.filter((s) => s.id >= monthCutoff && s.id < now - 3600000);
        const targetPool = monthSlices.length > 0 ? monthSlices : (slices.length > 0 ? slices : [initialBenchmark]);

        INDICATOR_CONFIGS.forEach((cfg) => {
          const sum = targetPool.reduce((acc, s) => acc + (s[cfg.key] ?? initialBenchmark[cfg.key] ?? 3), 0);
          baselineVals[cfg.key] = parseFloat((sum / targetPool.length).toFixed(1));
        });
      } else if (storedFilter === 'all_time') {
        const targetPool = slices.length > 0 ? slices : [initialBenchmark];
        INDICATOR_CONFIGS.forEach((cfg) => {
          const sum = targetPool.reduce((acc, s) => acc + (s[cfg.key] ?? initialBenchmark[cfg.key] ?? 3), 0);
          baselineVals[cfg.key] = parseFloat((sum / targetPool.length).toFixed(1));
        });
      } else {
        // 'prev_slice' (Default)
        if (slices.length >= 2) {
          const prevSlice = slices[slices.length - 2];
          baselineVals = {
            craving: prevSlice.craving ?? 4,
            thoughts: prevSlice.thoughts ?? 4,
            anxiety: prevSlice.anxiety ?? 3,
            irritability: prevSlice.irritability ?? 2,
            calmness: prevSlice.calmness ?? 7,
            energy: prevSlice.energy ?? 7,
            focus: prevSlice.focus ?? 7,
            overall: prevSlice.overall ?? 7,
          };
        } else {
          baselineVals = { ...initialBenchmark };
        }
      }

      const computed = INDICATOR_CONFIGS.map((cfg) => {
        const current = currentVals[cfg.key] ?? 3;
        const baseline = baselineVals[cfg.key] ?? 3;
        const delta = current - baseline;
        const denominator = baseline > 0 ? baseline : 1;
        const pct = parseFloat(((delta / denominator) * 100).toFixed(1));

        let isPositive = false;
        let isNeutral = Math.abs(pct) < 0.1;

        if (!isNeutral) {
          if (cfg.isNegative) {
            isPositive = delta < 0; // lower craving/anxiety is good
          } else {
            isPositive = delta > 0; // higher energy/calmness is good
          }
        }

        return {
          key: cfg.key,
          label: cfg.label,
          current,
          baseline,
          pct,
          isPositive,
          isNeutral,
          noteText: '',
          isRising: delta > 0,
          isFalling: delta < 0,
        };
      });

      setItems(computed);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    window.addEventListener('slice-saved', loadData);
    window.addEventListener('health-slices-change', loadData);
    window.addEventListener('quick-mechanics-updated', loadData);
    window.addEventListener('dynamics-filter-changed', loadData);
    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('slice-saved', loadData);
      window.removeEventListener('health-slices-change', loadData);
      window.removeEventListener('quick-mechanics-updated', loadData);
      window.removeEventListener('dynamics-filter-changed', loadData);
    };
  }, []);

  const handleOpenAnalysis = () => {
    window.dispatchEvent(new CustomEvent('open-section-overlay', { detail: 'mechanics' }));
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-quick-mechanics', { detail: 'analysis' }));
    }, 150);
  };

  if (items.length === 0) return null;

  // Duplicate items in each track so it easily spans wide viewports
  const trackItems = [...items, ...items];

  const renderItemNodes = (trackId: string) => {
    return trackItems.map((item, idx) => {
      const pctColor = item.isNeutral
        ? 'text-zinc-400'
        : item.isPositive
        ? 'text-emerald-400'
        : 'text-rose-400';

      const pctText = item.isNeutral
        ? '0%'
        : `${item.isRising ? '+' : ''}${item.pct}%`;

      return (
        <div
          key={`${trackId}-${item.key}-${idx}`}
          className="flex items-center gap-2 text-[11px] whitespace-nowrap shrink-0"
        >
          <span className="text-zinc-300 font-medium">{item.label}</span>
          <span className={`font-mono font-bold flex items-center gap-0.5 ${pctColor}`}>
            {item.isRising && <TrendingUp className="w-3 h-3 shrink-0" />}
            {item.isFalling && <TrendingDown className="w-3 h-3 shrink-0" />}
            <span>{pctText}</span>
          </span>
          <span className="text-zinc-700 font-mono select-none pl-2">•</span>
        </div>
      );
    });
  };

  return (
    <div className="w-full max-w-md mx-auto mb-2.5 px-3 select-none">
      <div 
        onClick={handleOpenAnalysis}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="w-full py-2 px-3.5 rounded-2xl bg-[#14141c]/90 hover:bg-[#1a1a24] border border-zinc-800/80 hover:border-zinc-700/80 shadow-xs transition-colors duration-200 cursor-pointer active:scale-[0.99] backdrop-blur-md relative overflow-hidden"
      >
        {/* Subtle gradient edges for continuous marquee */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#14141c] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#14141c] to-transparent z-10 pointer-events-none" />

        {/* Continuous Solid Marquee Track with Zero-Jerk Infinite Loop */}
        <div className="flex overflow-hidden w-full select-none">
          <div
            className="flex shrink-0 items-center gap-5 pr-5 animate-marquee"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {renderItemNodes('t1')}
          </div>
          <div
            className="flex shrink-0 items-center gap-5 pr-5 animate-marquee"
            aria-hidden="true"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {renderItemNodes('t2')}
          </div>
        </div>
      </div>
    </div>
  );
};
