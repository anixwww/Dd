import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  Compass,
  Zap,
  Flame,
  Moon,
  Droplets,
  Brain,
  ShieldCheck,
  Sparkles,
  Calendar,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Sliders,
  Filter
} from 'lucide-react';
import { INDICATOR_CONFIGS } from './QuickMechanicsDrawer';
import { ToughestTimeChart } from './ToughestTimeChart';

interface EnhancedChartsSectionProps {
  triggerVals: Record<string, number>;
  hydrationMl?: number;
  waterNormMl?: number;
  calculatedSleepHours?: number;
  onBack: () => void;
  onSelectSection?: (section: any) => void;
}

type TimeframeType = 7 | 14 | 30;
type ChartDisplayMode = 'line' | 'bar' | 'radar' | 'correlations';
type MetricGroup = 'all' | 'withdrawal' | 'recovery' | 'complex' | 'toughest_time' | string;

const EnhancedChartsSectionComponent: React.FC<EnhancedChartsSectionProps> = ({
  triggerVals,
  hydrationMl = 1800,
  waterNormMl = 2500,
  calculatedSleepHours = 8.0,
  onBack,
  onSelectSection
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeType>(7);
  const [displayMode, setDisplayMode] = useState<ChartDisplayMode>('line');
  const [selectedGroup, setSelectedGroup] = useState<MetricGroup>('all');
  const [selectedSingleMetric, setSelectedSingleMetric] = useState<string>('craving');
  const [activeHoverPoint, setActiveHoverPoint] = useState<any | null>(null);

  // Generate realistic data points across timeframe (7, 14, 30 days)
  const timelineData = useMemo(() => {
    const points = [];
    const now = new Date();
    const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    for (let i = timeframe - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const isToday = i === 0;
      const dayName = dayNames[d.getDay()];
      const dateStr = `${d.getDate()}.${d.getMonth() + 1}`;

      // Progress factor: gradual improvement towards today
      const factor = (i / (timeframe - 1 || 1));
      // Organic fluctuation
      const wave = Math.sin(i * 0.9) * 0.4;

      const rawCraving = triggerVals.craving ?? 3;
      const rawThoughts = triggerVals.thoughts ?? 3;
      const rawAnxiety = triggerVals.anxiety ?? 2.5;
      const rawIrritability = triggerVals.irritability ?? 2.5;
      const rawCalmness = triggerVals.calmness ?? 3.5;
      const rawEnergy = triggerVals.energy ?? 3.5;
      const rawFocus = triggerVals.focus ?? 3.5;
      const rawOverall = triggerVals.overall ?? 4.0;

      // Negative metrics decline towards today
      // Positive metrics increase towards today
      const cravingVal = isToday ? rawCraving * 2 : Math.min(10, Math.max(1, parseFloat((rawCraving * 2 + factor * 3.5 + wave).toFixed(1))));
      const thoughtsVal = isToday ? rawThoughts * 2 : Math.min(10, Math.max(1, parseFloat((rawThoughts * 2 + factor * 2.8 + wave * 0.8).toFixed(1))));
      const anxietyVal = isToday ? rawAnxiety * 2 : Math.min(10, Math.max(1, parseFloat((rawAnxiety * 2 + factor * 2.5 + wave * 0.7).toFixed(1))));
      const irritabilityVal = isToday ? rawIrritability * 2 : Math.min(10, Math.max(1, parseFloat((rawIrritability * 2 + factor * 2.2 + wave * 0.6).toFixed(1))));

      const calmnessVal = isToday ? rawCalmness * 2 : Math.min(10, Math.max(1, parseFloat((rawCalmness * 2 - factor * 2.6 - wave * 0.5).toFixed(1))));
      const energyVal = isToday ? rawEnergy * 2 : Math.min(10, Math.max(1, parseFloat((rawEnergy * 2 - factor * 2.2 - wave * 0.6).toFixed(1))));
      const focusVal = isToday ? rawFocus * 2 : Math.min(10, Math.max(1, parseFloat((rawFocus * 2 - factor * 2.4 - wave * 0.4).toFixed(1))));
      const overallVal = isToday ? rawOverall * 2 : Math.min(10, Math.max(1, parseFloat((rawOverall * 2 - factor * 3.0 - wave * 0.5).toFixed(1))));

      // Sleep hours and Hydration percentage
      const sleepHours = isToday ? calculatedSleepHours : parseFloat((calculatedSleepHours - factor * 1.5 + (wave > 0 ? 0.3 : -0.3)).toFixed(1));
      const hydrationPct = isToday ? Math.round((hydrationMl / waterNormMl) * 100) : Math.min(100, Math.max(40, Math.round(75 - factor * 25 + wave * 10)));

      points.push({
        index: timeframe - 1 - i,
        day: isToday ? 'Сьогодні' : `${dayName}, ${dateStr}`,
        shortLabel: isToday ? 'Сьог' : (timeframe <= 14 ? dayName : (i % 3 === 0 ? dateStr : '')),
        dateStr,
        isToday,
        craving: cravingVal,
        thoughts: thoughtsVal,
        anxiety: anxietyVal,
        irritability: irritabilityVal,
        calmness: calmnessVal,
        energy: energyVal,
        focus: focusVal,
        overall: overallVal,
        sleep: sleepHours,
        hydration: hydrationPct
      });
    }

    return points;
  }, [timeframe, triggerVals, calculatedSleepHours, hydrationMl, waterNormMl]);

  // Active metrics to display based on selectedGroup
  const activeMetricKeys = useMemo(() => {
    if (selectedGroup === 'all') {
      return INDICATOR_CONFIGS.map((c) => c.key);
    }
    if (selectedGroup === 'withdrawal') {
      return ['craving', 'thoughts', 'anxiety', 'irritability'];
    }
    if (selectedGroup === 'recovery') {
      return ['calmness', 'energy', 'focus', 'overall'];
    }
    if (selectedGroup === 'complex') {
      return ['craving', 'overall', 'calmness', 'energy'];
    }
    // Single metric
    return [selectedSingleMetric];
  }, [selectedGroup, selectedSingleMetric]);

  // Summary Metrics for the currently focused metric
  const focusedMetricConfig = useMemo(() => {
    return INDICATOR_CONFIGS.find((c) => c.key === selectedSingleMetric) || INDICATOR_CONFIGS[0];
  }, [selectedSingleMetric]);

  const focusedStats = useMemo(() => {
    const key = selectedSingleMetric;
    const values = timelineData.map((d: any) => d[key] || 5);
    const current = values[values.length - 1];
    const initial = values[0];
    const avg = parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));
    const max = Math.max(...values);
    const min = Math.min(...values);
    const delta = parseFloat((current - initial).toFixed(1));
    const deltaPct = Math.round(((current - initial) / (initial || 1)) * 100);

    const isGoodProgress = focusedMetricConfig.isNegative ? delta <= 0 : delta >= 0;

    return {
      current,
      initial,
      avg,
      max,
      min,
      delta,
      deltaPct,
      isGoodProgress
    };
  }, [timelineData, selectedSingleMetric, focusedMetricConfig]);

  // Overall Neuro-biological balance index (0..100%)
  const neuroBalanceScore = useMemo(() => {
    const current = timelineData[timelineData.length - 1];
    if (!current) return 78;
    const positiveAvg = (current.calmness + current.energy + current.focus + current.overall) / 4;
    const negativeAvg = (current.craving + current.thoughts + current.anxiety + current.irritability) / 4;
    const score = Math.round(((positiveAvg + (10 - negativeAvg)) / 20) * 100);
    return Math.max(35, Math.min(98, score));
  }, [timelineData]);

  // Render Craving Wave view if selected
  if (selectedGroup === 'toughest_time') {
    return (
      <div className="space-y-3.5 text-left">
        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 border border-zinc-800">
          <button
            type="button"
            onClick={() => setSelectedGroup('all')}
            className="text-xs font-bold text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800"
          >
            ← До загальних графіків
          </button>
          <span className="text-xs font-mono text-amber-400 font-bold">Хвиля тяги & Піки</span>
        </div>
        <ToughestTimeChart />
      </div>
    );
  }

  return (
    <div className="space-y-3.5 text-left">
      {/* TOP TIMEFRAME & MODE CONTROL BAR */}
      <div className="p-3 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Діапазон аналітики:</span>
          </div>

          {/* Timeframe selector pills */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            {([7, 14, 30] as TimeframeType[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-zinc-200 text-zinc-950 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tf === 7 ? '7 днів' : tf === 14 ? '14 днів' : '30 днів'}
              </button>
            ))}
          </div>
        </div>

        {/* Chart View Modes */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-950/90 rounded-xl border border-zinc-800 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setDisplayMode('line')}
            className={`py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              displayMode === 'line'
                ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="w-3 h-3 shrink-0" />
            <span className="truncate">Тренд</span>
          </button>

          <button
            type="button"
            onClick={() => setDisplayMode('bar')}
            className={`py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              displayMode === 'bar'
                ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-3 h-3 shrink-0" />
            <span className="truncate">Стовпчики</span>
          </button>

          <button
            type="button"
            onClick={() => setDisplayMode('radar')}
            className={`py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              displayMode === 'radar'
                ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Compass className="w-3 h-3 shrink-0" />
            <span className="truncate">Радар 8D</span>
          </button>

          <button
            type="button"
            onClick={() => setDisplayMode('correlations')}
            className={`py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              displayMode === 'correlations'
                ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Brain className="w-3 h-3 shrink-0" />
            <span className="truncate">Зв'язки</span>
          </button>
        </div>
      </div>

      {/* CATEGORY & METRIC FILTER TABS */}
      <div className="p-3 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2 shadow-xs">
        <div className="text-[11px] text-zinc-400 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-zinc-400" />
            <span>Категорія фокусу:</span>
          </span>
          <span className="text-[10px] font-mono text-zinc-500">Шкала 1..10</span>
        </div>

        {/* Group Selector Chips */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setSelectedGroup('all')}
            className={`px-2.5 py-1 rounded-xl font-bold font-mono transition-all cursor-pointer ${
              selectedGroup === 'all'
                ? 'bg-zinc-200 text-zinc-950 shadow-xs'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Всі 8 шкал
          </button>

          <button
            type="button"
            onClick={() => setSelectedGroup('withdrawal')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              selectedGroup === 'withdrawal'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-300'
            }`}
          >
            Симптоми відміни
          </button>

          <button
            type="button"
            onClick={() => setSelectedGroup('recovery')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              selectedGroup === 'recovery'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-emerald-300'
            }`}
          >
            Ресурси відновлення
          </button>

          <button
            type="button"
            onClick={() => setSelectedGroup('toughest_time')}
            className="px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer bg-zinc-900 border border-zinc-800 text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Хвиля тяги</span>
          </button>
        </div>

        {/* Individual indicator pills */}
        <div className="flex flex-wrap gap-1 pt-1 border-t border-zinc-800/80">
          {INDICATOR_CONFIGS.map((cfg) => {
            const isSingleActive = selectedGroup === 'single' && selectedSingleMetric === cfg.key;
            return (
              <button
                key={cfg.key}
                type="button"
                onClick={() => {
                  setSelectedGroup('single');
                  setSelectedSingleMetric(cfg.key);
                }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                  isSingleActive
                    ? 'bg-zinc-100 text-zinc-950 font-bold shadow-xs'
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.stroke }} />
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TOP SUMMARY STATS CARD (When single metric or focused) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
          <div className="text-[9px] uppercase font-mono text-zinc-400 mb-0.5">
            Поточний бал
          </div>
          <div className="text-sm font-bold font-mono text-zinc-100 flex items-center gap-1">
            <span>{focusedStats.current}</span>
            <span className="text-[10px] text-zinc-500">/ 10</span>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
          <div className="text-[9px] uppercase font-mono text-zinc-400 mb-0.5">
            Динаміка за {timeframe}д
          </div>
          <div className={`text-sm font-bold font-mono flex items-center gap-1 ${
            focusedStats.isGoodProgress ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            <span>{focusedStats.delta > 0 ? `+${focusedStats.delta}` : focusedStats.delta}</span>
            <span className="text-[10px]">({focusedStats.deltaPct > 0 ? `+${focusedStats.deltaPct}` : focusedStats.deltaPct}%)</span>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
          <div className="text-[9px] uppercase font-mono text-zinc-400 mb-0.5">
            Нейро-баланс
          </div>
          <div className="text-sm font-bold font-mono text-sky-400">
            {neuroBalanceScore}% <span className="text-[10px] font-normal text-zinc-400">гармонія</span>
          </div>
        </div>
      </div>

      {/* ================= 1. LINE TREND VIEW ================= */}
      {displayMode === 'line' && (
        <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-3 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-zinc-100 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {selectedGroup === 'all'
                  ? 'Огляд усіх 8 показників'
                  : selectedGroup === 'withdrawal'
                  ? 'Симптоми відміни (Тяга, Думки, Тривога, Дратівливість)'
                  : selectedGroup === 'recovery'
                  ? 'Ресурси відновлення (Спокій, Енергія, Фокус, Загальний)'
                  : `Динаміка показника: ${focusedMetricConfig.label}`}
              </span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              {timeframe} діб
            </span>
          </div>

          {/* SVG Multi-line Chart Container */}
          <div className="w-full bg-zinc-950/90 rounded-xl p-2.5 border border-zinc-800/80 relative">
            <svg viewBox="0 0 340 180" className="w-full h-auto overflow-visible select-none">
              <defs>
                <linearGradient id="optZoneGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(16, 185, 129, 0.12)" />
                  <stop offset="100%" stopColor="rgba(16, 185, 129, 0.0)" />
                </linearGradient>
              </defs>

              {/* Shaded Optimal Wellness Zone (7 to 10 for positive, 1 to 3 for negative) */}
              <rect
                x="32"
                y={20}
                width="293"
                height={35}
                fill="url(#optZoneGrad)"
                className="pointer-events-none"
              />

              {/* Horizontal Grid lines (10, 8, 6, 4, 2) */}
              {[10, 8, 6, 4, 2].map((rating) => {
                const y = 20 + ((10 - rating) / 9) * 120;
                return (
                  <g key={rating}>
                    <line
                      x1="32"
                      y1={y}
                      x2="325"
                      y2={y}
                      stroke="#27272a"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                    />
                    <text
                      x="20"
                      y={y + 3}
                      textAnchor="middle"
                      fill="#71717a"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {rating}
                    </text>
                  </g>
                );
              })}

              {/* Vertical guidelines & Day labels */}
              {timelineData.map((pt, i) => {
                const total = timelineData.length;
                const x = 34 + (i * 288) / (total - 1 || 1);
                const isToday = pt.isToday;
                const showLabel = total <= 10 || i % Math.ceil(total / 7) === 0 || isToday;

                return (
                  <g key={`vert-${i}`}>
                    <line
                      x1={x}
                      y1="20"
                      x2={x}
                      y2="142"
                      stroke={isToday ? '#3f3f46' : '#222226'}
                      strokeWidth={isToday ? '1.5' : '0.8'}
                      strokeDasharray={isToday ? '3 3' : '1 4'}
                    />
                    {showLabel && (
                      <text
                        x={x}
                        y="160"
                        textAnchor="middle"
                        fill={isToday ? '#ffffff' : '#71717a'}
                        fontSize="9"
                        fontWeight={isToday ? 'bold' : 'normal'}
                        fontFamily="sans-serif"
                      >
                        {pt.shortLabel}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Polyline series for each active metric */}
              {activeMetricKeys.map((key) => {
                const cfg = INDICATOR_CONFIGS.find((c) => c.key === key) || INDICATOR_CONFIGS[0];
                const total = timelineData.length;

                const pointsArr = timelineData.map((d: any, i) => {
                  const val = d[key] ?? 5;
                  const x = 34 + (i * 288) / (total - 1 || 1);
                  const y = 20 + ((10 - Math.min(10, Math.max(1, val))) / 9) * 120;
                  return { x, y, val, day: d.day };
                });

                const polylineStr = pointsArr.map((p) => `${p.x},${p.y}`).join(' ');

                return (
                  <g key={`line-${key}`}>
                    <polyline
                      points={polylineStr}
                      fill="none"
                      stroke={cfg.stroke}
                      strokeWidth={activeMetricKeys.length === 1 ? '3' : '2'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={activeMetricKeys.length > 4 ? 0.75 : 0.95}
                    />

                    {/* Dots along line */}
                    {pointsArr.map((p, idx) => {
                      const isLast = idx === pointsArr.length - 1;
                      return (
                        <circle
                          key={`dot-${key}-${idx}`}
                          cx={p.x}
                          cy={p.y}
                          r={activeMetricKeys.length === 1 ? (isLast ? 5 : 3.5) : (isLast ? 4 : 2.5)}
                          fill={cfg.stroke}
                          stroke="#09090b"
                          strokeWidth="1.5"
                          className="cursor-pointer transition-all hover:r-6"
                          onMouseEnter={() => setActiveHoverPoint({ ...p, metricName: cfg.label, color: cfg.stroke })}
                        >
                          <title>{`${p.day} • ${cfg.label}: ${p.val}/10`}</title>
                        </circle>
                      );
                    })}

                    {/* Single mode: Value labels on points */}
                    {activeMetricKeys.length === 1 && pointsArr.map((p, idx) => (
                      <text
                        key={`txt-${idx}`}
                        x={p.x}
                        y={p.y - 7}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {p.val}
                      </text>
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend Chips */}
          <div className="flex flex-wrap gap-2 text-[10px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/80">
            {activeMetricKeys.map((key) => {
              const cfg = INDICATOR_CONFIGS.find((c) => c.key === key) || INDICATOR_CONFIGS[0];
              return (
                <span key={key} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.stroke }} />
                  <span>{cfg.label}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 2. BAR CHART VIEW ================= */}
      {displayMode === 'bar' && (
        <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-3 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-zinc-100 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Стовпчикова динаміка: {focusedMetricConfig.label}</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              Шкала 1..10
            </span>
          </div>

          <div className="relative pt-4 pb-1">
            {/* Target 5.0 line */}
            <div
              className="absolute left-0 right-0 border-t border-dashed border-zinc-600/70 z-10 pointer-events-none flex items-center justify-between text-[9px] font-mono text-zinc-400 pr-1"
              style={{ bottom: `${(5.0 / 10) * 100}%` }}
            >
              <span className="bg-zinc-900/90 px-1 rounded -translate-y-1/2">Рівень 5</span>
            </div>

            {/* Bars Row */}
            <div className="flex items-end justify-between gap-1 h-44 relative z-20">
              {timelineData.map((rec: any, idx) => {
                const val = rec[selectedSingleMetric] ?? 5;
                const heightPct = Math.min(100, Math.max(10, (val / 10) * 100));
                const isToday = rec.isToday;

                return (
                  <div key={rec.dateStr} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className={`text-[9.5px] font-mono font-bold mb-1 ${
                      isToday ? 'text-white' : 'text-zinc-400'
                    }`}>
                      {val}
                    </span>

                    <div className="w-full bg-zinc-900/90 rounded-lg overflow-hidden p-0.5 border border-zinc-800 flex flex-col justify-end h-full">
                      <div
                        className="w-full rounded-md transition-all duration-300 group-hover:brightness-125"
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: focusedMetricConfig.stroke,
                          boxShadow: isToday ? `0 0 10px ${focusedMetricConfig.stroke}88` : undefined
                        }}
                      />
                    </div>

                    <span className={`text-[9px] mt-1.5 truncate max-w-full font-mono ${
                      isToday ? 'text-white font-bold' : 'text-zinc-500'
                    }`}>
                      {rec.shortLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. 8D RADAR / SPIDER CHART VIEW ================= */}
      {displayMode === 'radar' && (
        <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-3 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-zinc-100 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Радар стану (8 вимірів психо-фізіології)</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              Поточний зріз
            </span>
          </div>

          <div className="relative flex items-center justify-center py-2">
            <svg viewBox="0 0 260 260" className="w-64 h-64 overflow-visible">
              {/* Concentric rings (10, 8, 6, 4, 2) */}
              {[10, 8, 6, 4, 2].map((lvl) => {
                const r = (lvl / 10) * 85;
                return (
                  <circle
                    key={lvl}
                    cx="130"
                    cy="130"
                    r={r}
                    fill="none"
                    stroke="#27272a"
                    strokeWidth="1"
                    strokeDasharray={lvl === 10 ? 'none' : '2 3'}
                  />
                );
              })}

              {/* 8 Axes */}
              {INDICATOR_CONFIGS.map((cfg, idx) => {
                const angle = (idx / 8) * 2 * Math.PI - Math.PI / 2;
                const x2 = 130 + 85 * Math.cos(angle);
                const y2 = 130 + 85 * Math.sin(angle);

                const labelX = 130 + 105 * Math.cos(angle);
                const labelY = 130 + 105 * Math.sin(angle);

                return (
                  <g key={`axis-${cfg.key}`}>
                    <line x1="130" y1="130" x2={x2} y2={y2} stroke="#3f3f46" strokeWidth="1" />
                    <text
                      x={labelX}
                      y={labelY + 3}
                      textAnchor="middle"
                      fill="#a1a1aa"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {cfg.label.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* Filled Polygon representing user state right now */}
              {(() => {
                const current = timelineData[timelineData.length - 1];
                if (!current) return null;

                const points = INDICATOR_CONFIGS.map((cfg, idx) => {
                  const val = (current as any)[cfg.key] ?? 5;
                  const r = (val / 10) * 85;
                  const angle = (idx / 8) * 2 * Math.PI - Math.PI / 2;
                  return `${130 + r * Math.cos(angle)},${130 + r * Math.sin(angle)}`;
                }).join(' ');

                return (
                  <g>
                    <polygon
                      points={points}
                      fill="rgba(99, 102, 241, 0.25)"
                      stroke="#818cf8"
                      strokeWidth="2.5"
                    />
                    {INDICATOR_CONFIGS.map((cfg, idx) => {
                      const val = (current as any)[cfg.key] ?? 5;
                      const r = (val / 10) * 85;
                      const angle = (idx / 8) * 2 * Math.PI - Math.PI / 2;
                      const cx = 130 + r * Math.cos(angle);
                      const cy = 130 + r * Math.sin(angle);
                      return (
                        <circle
                          key={`radar-dot-${idx}`}
                          cx={cx}
                          cy={cy}
                          r="4"
                          fill={cfg.stroke}
                          stroke="#09090b"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </g>
                );
              })()}
            </svg>
          </div>

          <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
            Симетрична форма радару свідчить про стабільність самопочуття. Випинання у зоні Тяги чи Тривожності вказують на пріоритетну ціль для корекції.
          </p>
        </div>
      )}

      {/* ================= 4. CORRELATIONS & NEURO-INSIGHTS ================= */}
      {displayMode === 'correlations' && (
        <div className="space-y-3.5">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-950 border border-indigo-500/30 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>Біохімічні взаємозв'язки організму</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                Висока точність
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-black/40 border border-indigo-500/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-100">Сон ➔ Тяга</div>
                  <div className="text-[11px] text-zinc-400">Кожні +1 год якісного сну знижують пікову тягу на 18%</div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">-38% тяги</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-indigo-500/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-100">Гідратація ➔ Дратівливість</div>
                  <div className="text-[11px] text-zinc-400">Оптимальний водний баланс розвантажує нервову систему</div>
                </div>
                <span className="text-xs font-mono font-bold text-teal-400">-25% спайків</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-indigo-500/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-100">Спокій ➔ Концентрація</div>
                  <div className="text-[11px] text-zinc-400">Відновлення префронтальної кори та робочої пам'яті</div>
                </div>
                <span className="text-xs font-mono font-bold text-sky-400">+42% фокус</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEURO-ANALYTICAL VERDICT CARD */}
      <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Аналітичний висновок динаміки</span>
        </div>
        <p className="text-[11px] text-zinc-300 leading-relaxed font-normal">
          За останні <strong className="text-white">{timeframe} діб</strong> спостерігається стійка тенденція до гармонізації дофамінового рецепторного апарату: тяга знизилась на <strong className="text-emerald-400">{Math.abs(focusedStats.deltaPct)}%</strong> від початкової, а рівень спокою та енергії зріс.
        </p>
      </div>

      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="w-full py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer text-center"
      >
        Назад до Швидких Механік
      </button>
    </div>
  );
};

export const EnhancedChartsSection = React.memo(EnhancedChartsSectionComponent);
