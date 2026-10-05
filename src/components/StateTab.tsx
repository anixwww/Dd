import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  Flame,
  Moon,
  Droplets,
  Brain,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Edit3,
  Plus,
  Compass,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowDown
} from 'lucide-react';
import { NavStateIcon } from './BottomNavIcons';
import { DayRating } from '../types';
import { StateTriggersAnalytics } from './StateTriggersAnalytics';
import { ToughestTimeSection } from './ToughestTimeSection';

export interface StateTabProps {
  diffMs?: number;
  startDate?: number;
  days?: Record<string, DayRating>;
  accent?: string;
}

export interface SliceRecord {
  id: number;
  date: string;
  time: string;
  craving: number; // 1-5
  thoughts: number; // 1-5
  anxiety: number; // 1-5
  irritability: number; // 1-5
  calmness: number; // 1-5
  energy: number; // 1-5
  focus: number; // 1-5
  overall: number; // 1-5
  fluctuation: string;
  note?: string;
}

export type SliceMetricKey =
  | 'all'
  | 'craving'
  | 'thoughts'
  | 'anxiety'
  | 'irritability'
  | 'calmness'
  | 'energy'
  | 'focus'
  | 'overall';

export type SliceChartType = 'wave' | 'bar' | 'radar' | 'pie';

export interface IndicatorMeta {
  key: keyof Omit<SliceRecord, 'id' | 'date' | 'time' | 'fluctuation' | 'note'>;
  label: string;
  shortLabel: string;
  stroke: string;
  color: string;
  isNegative: boolean;
}

export const SLICE_INDICATORS: readonly IndicatorMeta[] = [
  { key: 'craving', label: 'Тяга', shortLabel: 'Тяга', stroke: '#f59e0b', color: 'text-amber-400', isNegative: true },
  { key: 'thoughts', label: 'Думки про куріння', shortLabel: 'Думки', stroke: '#6366f1', color: 'text-indigo-400', isNegative: true },
  { key: 'anxiety', label: 'Тривожність', shortLabel: 'Тривога', stroke: '#f43f5e', color: 'text-rose-400', isNegative: true },
  { key: 'irritability', label: 'Дратівливість', shortLabel: 'Дратівл.', stroke: '#f97316', color: 'text-orange-400', isNegative: true },
  { key: 'calmness', label: 'Спокій', shortLabel: 'Спокій', stroke: '#14b8a6', color: 'text-teal-400', isNegative: false },
  { key: 'energy', label: 'Енергія', shortLabel: 'Енергія', stroke: '#10b981', color: 'text-emerald-400', isNegative: false },
  { key: 'focus', label: 'Концентрація', shortLabel: 'Фокус', stroke: '#06b6d4', color: 'text-cyan-400', isNegative: false },
  { key: 'overall', label: 'Загальний стан', shortLabel: 'Загальний', stroke: '#a855f7', color: 'text-purple-400', isNegative: false },
] as const;

type TimeframeOption = '24h' | '7d' | '14d' | '30d' | 'all';

interface CravingLogItem {
  id: string;
  timestamp: number;
  dateStr: string;
  timeStr: string;
  endTimeStr?: string;
  type?: 'spike' | 'window';
  durationMinutes?: number;
  intensity: number;
  trigger?: string;
}

const DEFAULT_TRIGGERS: Array<{ id: string; name: string; pct: number; count: number; impact: string }> = [
  { id: 'coffee', name: 'Кава / Кофеїн', pct: 38, count: 12, impact: 'Середній' },
  { id: 'stress', name: 'Стрес / Емоція', pct: 28, count: 9, impact: 'Високий' },
  { id: 'freetime', name: 'Вільний час / Нудьга', pct: 18, count: 6, impact: 'Помірний' },
  { id: 'after_food', name: 'Після їжі', pct: 10, count: 3, impact: 'Короткий' },
  { id: 'company', name: 'Компанія / Розмова', pct: 6, count: 2, impact: 'Низький' },
];

export const StateTab: React.FC<StateTabProps> = ({
  diffMs = 0,
  startDate,
  days = {},
  accent = 'emerald'
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('7d');
  const [activeChartMode, setActiveChartMode] = useState<'slice' | 'wave' | 'health' | 'sleep'>('slice');
  const [sliceChartType, setSliceChartType] = useState<SliceChartType>('wave');
  const [selectedSliceMetric, setSelectedSliceMetric] = useState<SliceMetricKey>('all');
  const [hoveredSliceIndex, setHoveredSliceIndex] = useState<number | null>(null);
  const [hoveredRadarMetric, setHoveredRadarMetric] = useState<string | null>(null);
  const [hoveredPieMetric, setHoveredPieMetric] = useState<string | null>(null);

  // Load today's date formatted
  const todayStr = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }, []);

  // 1. Slices from local storage
  const [slices, setSlices] = useState<SliceRecord[]>(() => {
    try {
      const raw = localStorage.getItem('quit-smoking:health-slices');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  const [latestSlice, setLatestSlice] = useState<SliceRecord | null>(() => {
    try {
      const raw = localStorage.getItem('quit-smoking:latest-slice');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncSlices = () => {
      try {
        const raw = localStorage.getItem('quit-smoking:health-slices');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setSlices(parsed);
        }
        const rawLat = localStorage.getItem('quit-smoking:latest-slice');
        if (rawLat) setLatestSlice(JSON.parse(rawLat));
      } catch {}
    };

    window.addEventListener('slice-saved', syncSlices);
    window.addEventListener('slice-change', syncSlices);
    window.addEventListener('health-slices-change', syncSlices);
    window.addEventListener('checkin-updated', syncSlices);
    window.addEventListener('storage', syncSlices);
    return () => {
      window.removeEventListener('slice-saved', syncSlices);
      window.removeEventListener('slice-change', syncSlices);
      window.removeEventListener('health-slices-change', syncSlices);
      window.removeEventListener('checkin-updated', syncSlices);
      window.removeEventListener('storage', syncSlices);
    };
  }, []);

  // Listen for open-craving-wave to activate wave mode and smoothly scroll to the section
  useEffect(() => {
    const handleOpenCravingWave = () => {
      setActiveChartMode('wave');
      setTimeout(() => {
        const el = document.getElementById('section-craving-wave');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);
    };
    window.addEventListener('open-craving-wave', handleOpenCravingWave);
    return () => window.removeEventListener('open-craving-wave', handleOpenCravingWave);
  }, []);

  // Sleep
  const [sleepData, setSleepData] = useState<{ hours: number; quality: number; bedtime: string; wakeTime: string }>({
    hours: 7.5,
    quality: 8,
    bedtime: '23:00',
    wakeTime: '06:30'
  });

  useEffect(() => {
    try {
      const q = localStorage.getItem('quit-smoking:sleep-quality');
      const b = localStorage.getItem('quit-smoking:sleep-bedtime') || '23:00';
      const w = localStorage.getItem('quit-smoking:sleep-waketime') || '06:30';
      const [bh, bm] = b.split(':').map(Number);
      const [wh, wm] = w.split(':').map(Number);
      let diff = 7.5;
      if (!isNaN(bh) && !isNaN(wh)) {
        let bMin = bh * 60 + (bm || 0);
        let wMin = wh * 60 + (wm || 0);
        if (wMin < bMin) wMin += 24 * 60;
        diff = Math.round(((wMin - bMin) / 60) * 10) / 10;
      }
      setSleepData({
        hours: diff > 0 ? diff : 7.5,
        quality: q ? parseInt(q, 10) || 8 : 8,
        bedtime: b,
        wakeTime: w
      });
    } catch {}
  }, []);

  // Craving logs (from Хвиля тяги)
  const cravingLogs = useMemo<CravingLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:toughest-time-logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    const now = Date.now();
    return [
      { id: 'c1', timestamp: now - 3600000 * 2, dateStr: todayStr, timeStr: '14:30', durationMinutes: 12, intensity: 6, trigger: 'stress' },
      { id: 'c2', timestamp: now - 3600000 * 6, dateStr: todayStr, timeStr: '10:15', durationMinutes: 8, intensity: 4, trigger: 'coffee' },
      { id: 'c3', timestamp: now - 86400000 * 1, dateStr: todayStr, timeStr: '19:40', durationMinutes: 15, intensity: 7, trigger: 'freetime' },
      { id: 'c4', timestamp: now - 86400000 * 2, dateStr: todayStr, timeStr: '14:45', durationMinutes: 10, intensity: 5, trigger: 'stress' },
      { id: 'c5', timestamp: now - 86400000 * 3, dateStr: todayStr, timeStr: '20:10', durationMinutes: 18, intensity: 8, trigger: 'tiredness' }
    ];
  }, [todayStr]);

  // Number of days to display based on timeframe
  const daysCount = useMemo(() => {
    if (timeframe === '24h') return 1;
    if (timeframe === '7d') return 7;
    if (timeframe === '14d') return 14;
    if (timeframe === '30d') return 30;
    return 60; // 'all'
  }, [timeframe]);

  // Prepare normalized points containing ALL 8 metrics from Slices
  const sliceTimelinePoints = useMemo(() => {
    const pointsCount = daysCount === 1 ? 8 : Math.min(14, Math.max(7, daysCount));
    const now = new Date();
    const result = [];
    const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    // Map existing slices sorted by date/time
    const sortedSlices = [...slices].sort((a, b) => {
      const da = new Date(`${a.date}T${a.time || '12:00'}`).getTime();
      const db = new Date(`${b.date}T${b.time || '12:00'}`).getTime();
      return da - db;
    });

    const activeLatest = latestSlice || (sortedSlices.length > 0 ? sortedSlices[sortedSlices.length - 1] : null);

    for (let i = pointsCount - 1; i >= 0; i--) {
      const factor = i / (pointsCount - 1 || 1);
      const wave = Math.sin(i * 0.9) * 0.4;
      const isToday = i === 0;

      let dateLabel = '';
      let timeLabel = '';
      let dateKey = '';

      if (daysCount === 1) {
        const h = Math.max(0, 24 - i * 3);
        timeLabel = `${String(h).padStart(2, '0')}:00`;
        dateLabel = timeLabel;
        dateKey = todayStr;
      } else {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
        dateKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        dateLabel = isToday ? 'Сьог' : (pointsCount <= 7 ? dayNames[d.getDay()] : `${d.getDate()}.${d.getMonth() + 1}`);
        timeLabel = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
      }

      // Check if actual slices exist around this date (including intermediate check-ins)
      const daySlices = sortedSlices.filter((s) => s.date === dateKey);
      const matchingSlice = daySlices.length > 0 ? daySlices[daySlices.length - 1] : null;

      // Helper to compute scale 1-10
      const getVal = (key: keyof Omit<SliceRecord, 'id' | 'date' | 'time' | 'fluctuation' | 'note'>, def: number, isNeg: boolean) => {
        if (daySlices.length > 0) {
          // If multiple intermediate check-ins exist for this day, calculate intermediate average
          if (daySlices.length > 1) {
            const vals = daySlices.map(s => Number(s[key])).filter(v => !isNaN(v) && v > 0);
            if (vals.length > 0) {
              const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
              return Math.min(10, Math.max(1, Number(avg.toFixed(1))));
            }
          }
          const raw = Number(matchingSlice?.[key]);
          return Math.min(10, Math.max(1, isNaN(raw) ? def : raw));
        }
        if (isToday && activeLatest && activeLatest[key] !== undefined) {
          const raw = Number(activeLatest[key]);
          return Math.min(10, Math.max(1, isNaN(raw) ? def : raw));
        }
        const delta = isNeg ? factor * 2.8 + wave : -factor * 2.5 - wave * 0.5;
        return Math.min(10, Math.max(1, parseFloat((def + delta).toFixed(1))));
      };

      const craving = getVal('craving', 3.5, true);
      const thoughts = getVal('thoughts', 3.5, true);
      const anxiety = getVal('anxiety', 3.0, true);
      const irritability = getVal('irritability', 3.0, true);
      const calmness = getVal('calmness', 8.0, false);
      const energy = getVal('energy', 7.5, false);
      const focus = getVal('focus', 7.5, false);
      const overall = getVal('overall', 8.0, false);

      result.push({
        index: pointsCount - 1 - i,
        dateKey,
        label: dateLabel,
        timeLabel: matchingSlice ? (daySlices.length > 1 ? `${matchingSlice.time} (${daySlices.length} зрізи)` : matchingSlice.time) : timeLabel,
        isRealSlice: Boolean(matchingSlice || (isToday && activeLatest)),
        fluctuation: matchingSlice?.fluctuation || (isToday && activeLatest?.fluctuation) || 'стабільний',
        note: matchingSlice?.note || (daySlices.length > 1 ? `Проміжні зрізи (${daySlices.length} за день)` : undefined) || (isToday && activeLatest?.note) || undefined,
        craving,
        thoughts,
        anxiety,
        irritability,
        calmness,
        energy,
        focus,
        overall
      });
    }

    return result;
  }, [daysCount, slices, latestSlice, todayStr]);

  // Overall Health / State Score (0-100)
  const stateScore = useMemo(() => {
    const latest = sliceTimelinePoints[sliceTimelinePoints.length - 1];
    if (!latest) return 86;
    const pos = (latest.calmness + latest.energy + latest.focus + latest.overall) / 4;
    const neg = (latest.craving + latest.thoughts + latest.anxiety + latest.irritability) / 4;
    const score = Math.round(pos * 10 - neg * 3);
    return Math.min(99, Math.max(35, score));
  }, [sliceTimelinePoints]);

  // Current slice values for Radar and Pie Chart
  const activeSliceSnapshot = useMemo(() => {
    const latest = sliceTimelinePoints[sliceTimelinePoints.length - 1];
    if (!latest) {
      return {
        craving: 3.5,
        thoughts: 3.5,
        anxiety: 3.0,
        irritability: 3.0,
        calmness: 8.0,
        energy: 7.5,
        focus: 7.5,
        overall: 8.0
      };
    }
    return {
      craving: latest.craving,
      thoughts: latest.thoughts,
      anxiety: latest.anxiety,
      irritability: latest.irritability,
      calmness: latest.calmness,
      energy: latest.energy,
      focus: latest.focus,
      overall: latest.overall
    };
  }, [sliceTimelinePoints]);

  // Wave Peak Hours from Craving logs
  const waveStats = useMemo(() => {
    const avgDuration = Math.round(cravingLogs.reduce((s, c) => s + (c.durationMinutes || 10), 0) / (cravingLogs.length || 1));
    const peakIntensity = Math.max(...cravingLogs.map((c) => c.intensity), 5);
    return {
      peakWindow: '14:00 – 16:30',
      avgDuration,
      peakIntensity,
      totalWaves: cravingLogs.length
    };
  }, [cravingLogs]);

  // SVG dimensions for Wave and Line Charts
  const svgWidth = 340;
  const svgHeight = 165;
  const padX = 26;
  const padY = 16;
  const chartW = svgWidth - padX * 2;
  const chartH = svgHeight - padY * 2;

  // Helper to build smooth curved SVG path
  const buildSmoothCurve = (values: number[]) => {
    if (values.length === 0) return { path: '', area: '', points: [] };
    const step = chartW / (values.length - 1 || 1);

    const pts = values.map((val, i) => {
      const x = padX + i * step;
      const y = padY + ((10 - Math.min(10, Math.max(1, val))) / 9) * chartH;
      return { x, y, val };
    });

    if (pts.length === 1) {
      return { path: `M ${pts[0].x} ${pts[0].y}`, area: '', points: pts };
    }

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const last = pts[pts.length - 1];
    const first = pts[0];
    const area = `${d} L ${last.x} ${padY + chartH} L ${first.x} ${padY + chartH} Z`;

    return { path: d, area, points: pts };
  };

  // Build curves for ALL 8 metrics from Зріз
  const allSliceCurves = useMemo(() => {
    const curves: Record<string, { path: string; area: string; points: Array<{ x: number; y: number; val: number }> }> = {};
    SLICE_INDICATORS.forEach((ind) => {
      curves[ind.key] = buildSmoothCurve(sliceTimelinePoints.map((p) => p[ind.key]));
    });
    return curves;
  }, [sliceTimelinePoints, chartW, chartH, padX, padY]);

  // Open the mechanics slice drawer to make a new slice
  const handleOpenNewSlice = () => {
    window.dispatchEvent(new CustomEvent('open-section-overlay', { detail: 'mechanics' }));
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-quick-mechanics', { detail: 'slice' }));
    }, 150);
  };

  const hoveredSlice = hoveredSliceIndex !== null ? sliceTimelinePoints[hoveredSliceIndex] : null;

  // Donut / Pie Calculations
  const pieSegments = useMemo(() => {
    const total = SLICE_INDICATORS.reduce((sum, ind) => sum + (activeSliceSnapshot[ind.key] || 1), 0);
    let currentAngle = -Math.PI / 2;
    const cx = 135;
    const cy = 130;
    const rOuter = 85;
    const rInner = 50;

    return SLICE_INDICATORS.map((ind) => {
      const val = activeSliceSnapshot[ind.key] || 1;
      const angleSpan = (val / total) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angleSpan;
      currentAngle = endAngle;

      // Arc coordinates
      const x1 = cx + rOuter * Math.cos(startAngle);
      const y1 = cy + rOuter * Math.sin(startAngle);
      const x2 = cx + rOuter * Math.cos(endAngle);
      const y2 = cy + rOuter * Math.sin(endAngle);

      const x3 = cx + rInner * Math.cos(endAngle);
      const y3 = cy + rInner * Math.sin(endAngle);
      const x4 = cx + rInner * Math.cos(startAngle);
      const y4 = cy + rInner * Math.sin(startAngle);

      const largeArc = angleSpan > Math.PI ? 1 : 0;
      const path = `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z`;
      const pct = Math.round((val / total) * 100);

      return {
        ...ind,
        val,
        pct,
        path,
        startAngle,
        endAngle
      };
    });
  }, [activeSliceSnapshot]);

  // Selected or hovered pie indicator
  const activePieItem = useMemo(() => {
    if (hoveredPieMetric) {
      return pieSegments.find((p) => p.key === hoveredPieMetric) || pieSegments[0];
    }
    return null;
  }, [hoveredPieMetric, pieSegments]);

  return (
    <div className="w-full max-w-md mx-auto px-3.5 pb-24 pt-3 space-y-3.5 text-left select-none animate-fadeIn">
      {/* 1. TOP HEADER (Хроніка свободи style) */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-[#121217]/95 border border-zinc-800/80 shadow-2xl flex items-center justify-between gap-3 backdrop-blur-xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-none text-emerald-400 shadow-inner">
            <NavStateIcon active={true} className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black tracking-tight text-white truncate">
                Стан
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-300">
                {stateScore}/100
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate">
              Всі 8 показників Зрізу стану & хвилі тяги
            </p>
          </div>
        </div>

        {/* Action: Open New Slice */}
        <button
          type="button"
          onClick={handleOpenNewSlice}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold cursor-pointer transition-all active:scale-95 shadow-xs shrink-0"
          title="Зробити новий зріз стану"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Зріз</span>
        </button>
      </div>

      {/* 2. TIMEFRAME FILTER BAR (24г, 7д, 14д, 30д, Увесь час) */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-[#14141c]/90 rounded-2xl border border-zinc-800/80 text-xs font-mono font-bold shadow-xs">
        {(
          [
            { id: '24h', label: '24г' },
            { id: '7d', label: '7д' },
            { id: '14d', label: '14д' },
            { id: '30d', label: '30д' },
            { id: 'all', label: 'Все' }
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTimeframe(tab.id)}
            className={`py-1.5 rounded-xl transition-all cursor-pointer text-center ${
              timeframe === tab.id
                ? 'bg-zinc-200 text-zinc-950 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. HERO OVERVIEW CARD: 8 KEY INDICATORS FROM SLICE */}
      <div className="relative p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-[#1a1a24] via-[#16161f] to-[#14141c] border border-emerald-500/20 shadow-xl overflow-hidden space-y-3">
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top metrics summary line */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>Зріз стану: поточні показники</span>
          </span>
          <span className="text-zinc-400 font-mono text-[11px]">
            {latestSlice ? `${latestSlice.date} ${latestSlice.time}` : 'Сьогодні'}
          </span>
        </div>

        {/* Full 8-Grid of Slice Metrics */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          {SLICE_INDICATORS.map((ind) => {
            const val = activeSliceSnapshot[ind.key] || 5;

            return (
              <button
                key={ind.key}
                type="button"
                onClick={() => {
                  setActiveChartMode('slice');
                  setSelectedSliceMetric(selectedSliceMetric === ind.key ? 'all' : ind.key);
                }}
                className={`p-1.5 rounded-xl border transition-all text-center cursor-pointer ${
                  selectedSliceMetric === ind.key
                    ? 'bg-zinc-800 border-white/40 shadow-xs'
                    : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ind.stroke }} />
                  <span className="text-[10px] font-bold font-mono text-zinc-100">
                    {val}/10
                  </span>
                </div>
                <div className="text-[9px] text-zinc-400 truncate">{ind.shortLabel}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN CHART MODE SELECTOR */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-[#14141c]/90 rounded-2xl border border-zinc-800/80 text-xs font-semibold shadow-xs">
        <button
          type="button"
          onClick={() => setActiveChartMode('slice')}
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
            activeChartMode === 'slice'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate text-[11px]">Зріз стану</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveChartMode('wave')}
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
            activeChartMode === 'wave'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate text-[11px]">Хвиля тяги</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveChartMode('health')}
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
            activeChartMode === 'health'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate text-[11px]">Тенденції</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveChartMode('sleep')}
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
            activeChartMode === 'sleep'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate text-[11px]">Сон</span>
        </button>
      </div>

      {/* 5. SLICE CHART SUB-TYPE SELECTOR: ХВИЛЯ | СТОВПЧИКИ | РАДАР | КРУГОВИЙ */}
      {activeChartMode === 'slice' && (
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#14141c]/90 rounded-2xl border border-zinc-800/80 text-xs font-semibold shadow-xs">
          <button
            type="button"
            onClick={() => setSliceChartType('wave')}
            className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              sliceChartType === 'wave'
                ? 'bg-zinc-200 text-zinc-950 font-bold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Хвиля</span>
          </button>

          <button
            type="button"
            onClick={() => setSliceChartType('bar')}
            className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              sliceChartType === 'bar'
                ? 'bg-zinc-200 text-zinc-950 font-bold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Стовпчики</span>
          </button>

          <button
            type="button"
            onClick={() => setSliceChartType('radar')}
            className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              sliceChartType === 'radar'
                ? 'bg-zinc-200 text-zinc-950 font-bold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Радар</span>
          </button>

          <button
            type="button"
            onClick={() => setSliceChartType('pie')}
            className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              sliceChartType === 'pie'
                ? 'bg-zinc-200 text-zinc-950 font-bold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Круговий</span>
          </button>
        </div>
      )}

      {/* 6. SLICE 8-METRIC FILTER CHIPS (When in 'wave' or 'bar' sub-type) */}
      {activeChartMode === 'slice' && (sliceChartType === 'wave' || sliceChartType === 'bar') && (
        <div className="p-2.5 rounded-2xl bg-[#14141c]/90 border border-zinc-800/80 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Показники Зрізу на графіку:</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Шкала 1..10</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedSliceMetric('all')}
              className={`px-2.5 py-1 rounded-xl text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                selectedSliceMetric === 'all'
                  ? 'bg-zinc-200 text-zinc-950 shadow-xs'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Всі 8 показників
            </button>

            {SLICE_INDICATORS.map((ind) => {
              const isActive = selectedSliceMetric === ind.key;
              return (
                <button
                  key={ind.key}
                  type="button"
                  onClick={() => setSelectedSliceMetric(isActive ? 'all' : ind.key)}
                  className={`px-2.5 py-1 rounded-xl text-[10.5px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-zinc-100 text-zinc-950 shadow-xs'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ind.stroke }} />
                  <span>{ind.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. MAIN CHART VIEWPORT */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-[#14141c]/95 border border-zinc-800/80 shadow-xl space-y-3">
        {/* Header inside Chart */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-100 flex items-center gap-1.5">
              {activeChartMode === 'slice' && (
                <>
                  {sliceChartType === 'wave' && (
                    <>
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      <span>
                        {selectedSliceMetric === 'all'
                          ? 'Зріз стану: всі 8 показників'
                          : `Зріз стану: ${SLICE_INDICATORS.find((i) => i.key === selectedSliceMetric)?.label}`}
                      </span>
                    </>
                  )}
                  {sliceChartType === 'bar' && (
                    <>
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      <span>
                        {selectedSliceMetric === 'all'
                          ? 'Стовпчиковий вигляд: 8 показників'
                          : `Стовпчики: ${SLICE_INDICATORS.find((i) => i.key === selectedSliceMetric)?.label}`}
                      </span>
                    </>
                  )}
                  {sliceChartType === 'radar' && (
                    <>
                      <Compass className="w-4 h-4 text-emerald-400" />
                      <span>8D Радар Зрізу стану</span>
                    </>
                  )}
                  {sliceChartType === 'pie' && (
                    <>
                      <PieChartIcon className="w-4 h-4 text-emerald-400" />
                      <span>Кругова діаграма балансу 8 показників</span>
                    </>
                  )}
                </>
              )}
              {activeChartMode === 'wave' && (
                <>
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Хвиля тяги & Піки</span>
                </>
              )}
              {activeChartMode === 'health' && (
                <>
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span>Тяга (червона) vs Спокій (індиго)</span>
                </>
              )}
              {activeChartMode === 'sleep' && (
                <>
                  <Moon className="w-4 h-4 text-cyan-400" />
                  <span>Динаміка сну (години)</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeChartMode === 'wave' && (
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('section-craving-wave');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span>Зафіксувати сплеск</span>
                <ArrowDown className="w-3 h-3 text-amber-400 animate-bounce" />
              </button>
            )}

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
              {activeChartMode === 'slice' && sliceChartType === 'pie'
                ? '% Балансу'
                : activeChartMode === 'sleep'
                ? 'Години'
                : 'Бали 1-10'}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: WAVE / LINE SPLINE CHART (Default & for other modes) */}
        {/* ========================================================================= */}
        {!(activeChartMode === 'slice' && (sliceChartType === 'bar' || sliceChartType === 'radar' || sliceChartType === 'pie')) && (
          <div className="w-full bg-[#0d0d12] rounded-2xl p-2 border border-zinc-800/60 relative overflow-hidden">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible select-none">
              <defs>
                {SLICE_INDICATORS.map((ind) => (
                  <linearGradient key={`grad-${ind.key}`} id={`grad-${ind.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ind.stroke} stopOpacity="0.32" />
                    <stop offset="100%" stopColor={ind.stroke} stopOpacity="0.0" />
                  </linearGradient>
                ))}

                <linearGradient id="stateWaveAmber" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="60%" stopColor="#ef4444" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>

                <linearGradient id="stateWaveCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines (10, 8, 6, 4, 2) */}
              {[10, 8, 6, 4, 2].map((val) => {
                const y = padY + ((10 - val) / 9) * chartH;
                return (
                  <g key={val}>
                    <line
                      x1={padX}
                      y1={y}
                      x2={svgWidth - padX}
                      y2={y}
                      stroke="#27272a"
                      strokeWidth="0.8"
                      strokeDasharray="2 3"
                    />
                    <text
                      x={padX - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="#71717a"
                      fontSize="8.5"
                      fontFamily="monospace"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* MODE: SLICE DATA (Всі 8 ліній) */}
              {activeChartMode === 'slice' && (
                <>
                  {selectedSliceMetric !== 'all' && allSliceCurves[selectedSliceMetric]?.area && (
                    <path
                      d={allSliceCurves[selectedSliceMetric].area}
                      fill={`url(#grad-${selectedSliceMetric})`}
                    />
                  )}

                  {SLICE_INDICATORS.map((ind) => {
                    const curve = allSliceCurves[ind.key];
                    if (!curve || !curve.path) return null;
                    const isFocused = selectedSliceMetric === ind.key;
                    const isVisible = selectedSliceMetric === 'all' || isFocused;
                    if (!isVisible) return null;

                    return (
                      <path
                        key={`line-${ind.key}`}
                        d={curve.path}
                        fill="none"
                        stroke={ind.stroke}
                        strokeWidth={isFocused ? '3.0' : '1.8'}
                        strokeOpacity={selectedSliceMetric === 'all' ? 0.88 : 1}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-300"
                      />
                    );
                  })}

                  {(() => {
                    const targetInd =
                      selectedSliceMetric !== 'all'
                        ? SLICE_INDICATORS.find((i) => i.key === selectedSliceMetric)
                        : SLICE_INDICATORS[0];

                    const pts = targetInd ? allSliceCurves[targetInd.key]?.points || [] : [];

                    return pts.map((pt, i) => {
                      const isHovered = hoveredSliceIndex === i;
                      return (
                        <g key={`pt-${i}`}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={14}
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredSliceIndex(i)}
                            onClick={() => setHoveredSliceIndex(hoveredSliceIndex === i ? null : i)}
                          />
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHovered ? 5.5 : 3.5}
                            fill={targetInd?.stroke || '#ffffff'}
                            stroke="#121217"
                            strokeWidth="2"
                            className="cursor-pointer transition-all duration-200 pointer-events-none"
                          />
                        </g>
                      );
                    });
                  })()}
                </>
              )}

              {/* MODE: WAVE */}
              {activeChartMode === 'wave' && (
                <>
                  {allSliceCurves.craving?.area && (
                    <path d={allSliceCurves.craving.area} fill="url(#stateWaveAmber)" />
                  )}
                  {allSliceCurves.craving?.path && (
                    <path
                      d={allSliceCurves.craving.path}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                  {allSliceCurves.craving?.points.map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredSliceIndex === i ? 5.5 : 3.5}
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredSliceIndex(i)}
                      onMouseLeave={() => setHoveredSliceIndex(null)}
                    />
                  ))}
                </>
              )}

              {/* MODE: HEALTH TRENDS */}
              {activeChartMode === 'health' && (
                <>
                  {allSliceCurves.craving?.path && (
                    <path
                      d={allSliceCurves.craving.path}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  )}
                  {allSliceCurves.calmness?.path && (
                    <path
                      d={allSliceCurves.calmness.path}
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  )}
                  {allSliceCurves.energy?.path && (
                    <path
                      d={allSliceCurves.energy.path}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.0"
                      strokeLinecap="round"
                    />
                  )}
                </>
              )}

              {/* MODE: SLEEP */}
              {activeChartMode === 'sleep' && (
                <>
                  <line
                    x1={padX}
                    y1={padY + ((10 - 8) / 9) * chartH}
                    x2={svgWidth - padX}
                    y2={padY + ((10 - 8) / 9) * chartH}
                    stroke="#10b981"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  {(() => {
                    const step = chartW / (sliceTimelinePoints.length - 1 || 1);
                    const pts = sliceTimelinePoints.map((pt, i) => ({
                      x: padX + i * step,
                      y: padY + ((10 - Math.min(10, Math.max(1, sleepData.hours))) / 9) * chartH
                    }));
                    let d = `M ${pts[0].x} ${pts[0].y}`;
                    for (let i = 0; i < pts.length - 1; i++) {
                      const cx = (pts[i].x + pts[i + 1].x) / 2;
                      d += ` C ${cx} ${pts[i].y}, ${cx} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
                    }
                    const area = `${d} L ${pts[pts.length - 1].x} ${padY + chartH} L ${pts[0].x} ${padY + chartH} Z`;
                    return (
                      <>
                        <path d={area} fill="url(#stateWaveCyan)" />
                        <path d={d} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
                      </>
                    );
                  })()}
                </>
              )}

              {/* X-Axis Labels */}
              {sliceTimelinePoints.map((pt, i) => {
                const step = chartW / (sliceTimelinePoints.length - 1 || 1);
                const x = padX + i * step;
                const isToday = i === sliceTimelinePoints.length - 1;
                const show = sliceTimelinePoints.length <= 8 || i % Math.ceil(sliceTimelinePoints.length / 6) === 0 || isToday;
                if (!show) return null;
                return (
                  <text
                    key={`lbl-${i}`}
                    x={x}
                    y={svgHeight - 2}
                    textAnchor="middle"
                    fill={isToday ? '#ffffff' : '#71717a'}
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight={isToday ? 'bold' : 'normal'}
                  >
                    {pt.label}
                  </text>
                );
              })}
            </svg>

            {/* Interactive Tooltip on hover/click with ALL 8 metrics */}
            {hoveredSlice && (
              <div className="absolute top-2 right-2 p-2.5 rounded-2xl bg-zinc-900/95 border border-zinc-700 shadow-2xl text-left text-[10px] font-mono space-y-1.5 backdrop-blur-md z-30 max-w-[210px]">
                <div className="text-zinc-200 font-bold flex items-center justify-between gap-2 border-b border-zinc-800 pb-1">
                  <span>{hoveredSlice.dateKey} ({hoveredSlice.timeLabel})</span>
                  <span className="text-emerald-400 capitalize">{hoveredSlice.fluctuation}</span>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9.5px]">
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Тяга: {hoveredSlice.craving}</span>
                  </span>
                  <span className="flex items-center gap-1 text-indigo-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>Думки: {hoveredSlice.thoughts}</span>
                  </span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>Тривога: {hoveredSlice.anxiety}</span>
                  </span>
                  <span className="flex items-center gap-1 text-orange-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span>Дратівл: {hoveredSlice.irritability}</span>
                  </span>
                  <span className="flex items-center gap-1 text-teal-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>Спокій: {hoveredSlice.calmness}</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Енергія: {hoveredSlice.energy}</span>
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Фокус: {hoveredSlice.focus}</span>
                  </span>
                  <span className="flex items-center gap-1 text-purple-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>Загальний: {hoveredSlice.overall}</span>
                  </span>
                </div>

                {hoveredSlice.note && (
                  <div className="text-zinc-400 italic truncate pt-1 border-t border-zinc-800">
                    «{hoveredSlice.note}»
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1B: BAR CHART (Стовпчиковий вигляд графіків) */}
        {/* ========================================================================= */}
        {activeChartMode === 'slice' && sliceChartType === 'bar' && (
          <div className="w-full bg-[#0d0d12] rounded-2xl p-3 border border-zinc-800/60 relative overflow-hidden select-none space-y-3">
            {selectedSliceMetric === 'all' ? (
              /* All 8 Indicators Comparative Column View */
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SLICE_INDICATORS.map((ind) => {
                    const latestVal = latestSlice ? Number(latestSlice[ind.key] || 5) : 5;
                    const val10 = latestVal;
                    const pct = Math.min(100, Math.max(10, val10 * 10));

                    return (
                      <div
                        key={`bar-ind-${ind.key}`}
                        onClick={() => setSelectedSliceMetric(ind.key)}
                        className="p-2.5 rounded-2xl bg-zinc-900/70 hover:bg-zinc-855 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer flex flex-col justify-between group shadow-xs active:scale-95"
                      >
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="text-[11px] font-bold text-zinc-300 group-hover:text-white truncate">
                            {ind.shortLabel}
                          </span>
                          <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-100" style={{ color: ind.stroke }}>
                            {val10}/10
                          </span>
                        </div>

                        {/* Vertical Pillar */}
                        <div className="w-full h-24 bg-zinc-950/80 rounded-xl overflow-hidden p-1 flex items-end justify-center border border-zinc-800/50 relative">
                          {/* Background Grid Lines */}
                          <div className="absolute inset-0 flex flex-col justify-between p-1 pointer-events-none opacity-20">
                            <div className="w-full border-b border-zinc-500 border-dashed" />
                            <div className="w-full border-b border-zinc-500 border-dashed" />
                            <div className="w-full border-b border-zinc-500 border-dashed" />
                          </div>

                          <div
                            className="w-full rounded-lg transition-all duration-700 relative group-hover:brightness-125"
                            style={{
                              height: `${pct}%`,
                              backgroundColor: ind.stroke,
                              boxShadow: `0 0 12px ${ind.stroke}40`,
                            }}
                          >
                            <div className="w-full h-full bg-gradient-to-t from-black/40 via-transparent to-white/25 rounded-lg" />
                          </div>
                        </div>

                        <div className="text-[9.5px] font-mono text-zinc-400 mt-1.5 text-center truncate">
                          {ind.isNegative ? (val10 > 6 ? '⚠️ Підвищено' : '✅ В нормі') : (val10 >= 6 ? '🌟 Чудово' : '🌱 Відновлення')}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-2 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>💡 Натисніть на стовпчик, щоб побачити його динаміку за часом</span>
                  <span className="font-mono text-zinc-300">8 показників</span>
                </div>
              </div>
            ) : (
              /* Single Metric Timeline Bar Chart */
              (() => {
                const currentInd = SLICE_INDICATORS.find((i) => i.key === selectedSliceMetric) || SLICE_INDICATORS[0];
                const points = sliceTimelinePoints;
                const maxVal = 10;
                const barWidth = Math.max(16, Math.min(36, Math.floor(280 / points.length)));

                // Calculate average
                const sum = points.reduce((acc, p) => {
                  const val = Number(p[currentInd.key] || 5);
                  return acc + val;
                }, 0);
                const avg = Math.round((sum / (points.length || 1)) * 10) / 10;

                return (
                  <div className="space-y-3">
                    {/* Bar chart SVG container */}
                    <div className="relative pt-4 pb-2 px-1">
                      <svg viewBox={`0 0 ${svgWidth} 170`} className="w-full h-auto overflow-visible select-none">
                        <defs>
                          <linearGradient id={`barGrad-${currentInd.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={currentInd.stroke} stopOpacity="0.95" />
                            <stop offset="100%" stopColor={currentInd.stroke} stopOpacity="0.35" />
                          </linearGradient>
                          <linearGradient id={`barGradHover-${currentInd.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                            <stop offset="100%" stopColor={currentInd.stroke} stopOpacity="0.8" />
                          </linearGradient>
                        </defs>

                        {/* Y-Axis Grid Lines */}
                        {[10, 7.5, 5, 2.5, 0].map((gridVal) => {
                          const y = 140 - (gridVal / maxVal) * 120;
                          return (
                            <g key={`grid-bar-${gridVal}`}>
                              <line
                                x1="28"
                                y1={y}
                                x2={svgWidth - 10}
                                y2={y}
                                stroke="#27272a"
                                strokeDasharray={gridVal === 0 ? undefined : "3 3"}
                                strokeWidth="1"
                              />
                              <text
                                x="20"
                                y={y + 3}
                                fill="#71717a"
                                fontSize="9"
                                fontFamily="monospace"
                                textAnchor="end"
                              >
                                {gridVal}
                              </text>
                            </g>
                          );
                        })}

                        {/* Average Reference Line */}
                        <line
                          x1="28"
                          y1={140 - (avg / maxVal) * 120}
                          x2={svgWidth - 10}
                          y2={140 - (avg / maxVal) * 120}
                          stroke={currentInd.stroke}
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                          opacity="0.6"
                        />
                        <text
                          x={svgWidth - 12}
                          y={140 - (avg / maxVal) * 120 - 4}
                          fill={currentInd.stroke}
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="end"
                        >
                          Сер: {avg}
                        </text>

                        {/* Bars for Each Timeline Point */}
                        {points.map((p, idx) => {
                          const valRaw = Number(p[currentInd.key] || 5);
                          const val = valRaw;
                          const barH = Math.max(6, (val / maxVal) * 120);
                          const stepX = (svgWidth - 48) / (points.length || 1);
                          const x = 36 + idx * stepX + (stepX - barWidth) / 2;
                          const y = 140 - barH;
                          const isHovered = hoveredSliceIndex === idx;

                          return (
                            <g
                              key={`bar-${idx}`}
                              onMouseEnter={() => setHoveredSliceIndex(idx)}
                              onMouseLeave={() => setHoveredSliceIndex(null)}
                              onClick={() => setHoveredSliceIndex(idx)}
                              className="cursor-pointer"
                            >
                              {/* Background highlight area */}
                              <rect
                                x={36 + idx * stepX}
                                y="10"
                                width={stepX}
                                height="140"
                                fill={isHovered ? 'rgba(255,255,255,0.04)' : 'transparent'}
                                rx="6"
                              />

                              {/* Main Pillar Bar */}
                              <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barH}
                                rx="5"
                                fill={isHovered ? `url(#barGradHover-${currentInd.key})` : `url(#barGrad-${currentInd.key})`}
                                stroke={isHovered ? '#ffffff' : currentInd.stroke}
                                strokeWidth={isHovered ? '1.5' : '1'}
                                className="transition-all duration-300"
                              />

                              {/* Value Label on Top of Bar */}
                              <text
                                x={x + barWidth / 2}
                                y={y - 4}
                                fill={isHovered ? '#ffffff' : currentInd.stroke}
                                fontSize="9"
                                fontFamily="monospace"
                                fontWeight="bold"
                                textAnchor="middle"
                              >
                                {val}
                              </text>

                              {/* X-Axis Date / Time Label */}
                              <text
                                x={x + barWidth / 2}
                                y="156"
                                fill={isHovered ? '#ffffff' : p.dateKey === todayStr ? '#38bdf8' : '#71717a'}
                                fontSize="9"
                                fontFamily="monospace"
                                fontWeight={p.dateKey === todayStr || isHovered ? 'bold' : 'normal'}
                                textAnchor="middle"
                              >
                                {p.label}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Interactive Tooltip Card for Selected Point */}
                    {hoveredSliceIndex !== null && points[hoveredSliceIndex] && (
                      <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-lg flex items-center justify-between gap-3 animate-fadeIn">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0"
                            style={{ backgroundColor: `${currentInd.stroke}20`, color: currentInd.stroke, border: `1px solid ${currentInd.stroke}40` }}
                          >
                            {Number(points[hoveredSliceIndex][currentInd.key] || 5)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                              {currentInd.label}: {points[hoveredSliceIndex].label}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono">
                              {currentInd.isNegative ? 'Шкала навантаження (1..10)' : 'Шкала ресурсу (1..10)'}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedSliceMetric('all')}
                          className="text-[10px] text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors font-mono cursor-pointer shrink-0"
                        >
                          Всі шкали ✕
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: 8D RADAR / SPIDER CHART */}
        {/* ========================================================================= */}
        {activeChartMode === 'slice' && sliceChartType === 'radar' && (
          <div className="w-full bg-[#0d0d12] rounded-2xl p-3 border border-zinc-800/60 flex flex-col items-center justify-center relative overflow-hidden select-none">
            <svg viewBox="0 0 280 280" className="w-full max-w-[280px] h-auto overflow-visible">
              {/* Concentric rings (10, 8, 6, 4, 2) */}
              {[10, 8, 6, 4, 2].map((lvl) => {
                const r = (lvl / 10) * 88;
                return (
                  <g key={`ring-${lvl}`}>
                    <circle
                      cx="140"
                      cy="140"
                      r={r}
                      fill="none"
                      stroke="#27272a"
                      strokeWidth="1"
                      strokeDasharray={lvl === 10 ? 'none' : '2 3'}
                    />
                    <text
                      x="142"
                      y={140 - r + 8}
                      fill="#52525b"
                      fontSize="7.5"
                      fontFamily="monospace"
                    >
                      {lvl}
                    </text>
                  </g>
                );
              })}

              {/* 8 Axes & Labels */}
              {SLICE_INDICATORS.map((ind, idx) => {
                const angle = (idx / 8) * 2 * Math.PI - Math.PI / 2;
                const x2 = 140 + 88 * Math.cos(angle);
                const y2 = 140 + 88 * Math.sin(angle);

                const labelX = 140 + 112 * Math.cos(angle);
                const labelY = 140 + 112 * Math.sin(angle);

                const val = activeSliceSnapshot[ind.key] || 5;
                const isHovered = hoveredRadarMetric === ind.key;

                return (
                  <g key={`axis-${ind.key}`}>
                    <line x1="140" y1="140" x2={x2} y2={y2} stroke="#3f3f46" strokeWidth="0.9" />
                    <text
                      x={labelX}
                      y={labelY + 3}
                      textAnchor="middle"
                      fill={isHovered ? '#ffffff' : ind.stroke}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      className="cursor-pointer transition-colors"
                      onMouseEnter={() => setHoveredRadarMetric(ind.key)}
                      onMouseLeave={() => setHoveredRadarMetric(null)}
                      onClick={() => setHoveredRadarMetric(hoveredRadarMetric === ind.key ? null : ind.key)}
                    >
                      {ind.shortLabel}
                    </text>
                  </g>
                );
              })}

              {/* Filled Polygon representing user state right now */}
              {(() => {
                const points = SLICE_INDICATORS.map((ind, idx) => {
                  const val = activeSliceSnapshot[ind.key] || 5;
                  const r = (val / 10) * 88;
                  const angle = (idx / 8) * 2 * Math.PI - Math.PI / 2;
                  return `${140 + r * Math.cos(angle)},${140 + r * Math.sin(angle)}`;
                }).join(' ');

                return (
                  <g>
                    <polygon
                      points={points}
                      fill="rgba(16, 185, 129, 0.22)"
                      stroke="#10b981"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                    />

                    {SLICE_INDICATORS.map((ind, idx) => {
                      const val = activeSliceSnapshot[ind.key] || 5;
                      const r = (val / 10) * 88;
                      const angle = (idx / 8) * 2 * Math.PI - Math.PI / 2;
                      const cx = 140 + r * Math.cos(angle);
                      const cy = 140 + r * Math.sin(angle);
                      const isHovered = hoveredRadarMetric === ind.key;

                      return (
                        <g key={`dot-${ind.key}`}>
                          <circle
                            cx={cx}
                            cy={cy}
                            r={14}
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredRadarMetric(ind.key)}
                            onMouseLeave={() => setHoveredRadarMetric(null)}
                            onClick={() => setHoveredRadarMetric(hoveredRadarMetric === ind.key ? null : ind.key)}
                          />
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isHovered ? 5.5 : 3.5}
                            fill={ind.stroke}
                            stroke="#0d0d12"
                            strokeWidth="2"
                            className="pointer-events-none transition-all duration-200"
                          />
                        </g>
                      );
                    })}
                  </g>
                );
              })()}
            </svg>

            {/* Radar Center Legend or Floating Badge */}
            <div className="w-full mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 text-[11px]">
                {hoveredRadarMetric
                  ? SLICE_INDICATORS.find((i) => i.key === hoveredRadarMetric)?.label
                  : '8-осьовий профіль стану'}
              </span>
              <span className="font-bold text-emerald-400">
                {hoveredRadarMetric
                  ? `${activeSliceSnapshot[hoveredRadarMetric as keyof typeof activeSliceSnapshot]}/10`
                  : `${stateScore}/100 індекс`}
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: CIRCULAR DONUT / PIE CHART */}
        {/* ========================================================================= */}
        {activeChartMode === 'slice' && sliceChartType === 'pie' && (
          <div className="w-full bg-[#0d0d12] rounded-2xl p-3 border border-zinc-800/60 flex flex-col items-center justify-center relative overflow-hidden select-none">
            <div className="relative flex items-center justify-center">
              <svg viewBox="0 0 270 260" className="w-64 h-64 overflow-visible">
                {/* 8 Donut Arcs */}
                {pieSegments.map((seg) => {
                  const isHovered = hoveredPieMetric === seg.key;
                  return (
                    <path
                      key={`pie-${seg.key}`}
                      d={seg.path}
                      fill={seg.stroke}
                      fillOpacity={isHovered ? 1 : 0.85}
                      stroke="#0d0d12"
                      strokeWidth="2.5"
                      className="cursor-pointer transition-all duration-200 hover:opacity-100"
                      onMouseEnter={() => setHoveredPieMetric(seg.key)}
                      onMouseLeave={() => setHoveredPieMetric(null)}
                      onClick={() => setHoveredPieMetric(hoveredPieMetric === seg.key ? null : seg.key)}
                    />
                  );
                })}

                {/* Inner Center Cutout Display */}
                <circle cx="135" cy="130" r="48" fill="#121217" stroke="#27272a" strokeWidth="1" />
              </svg>

              {/* Centered Dynamic Data in Donut Hole */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                {activePieItem ? (
                  <>
                    <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[70px]">
                      {activePieItem.shortLabel}
                    </span>
                    <span className="text-base font-black font-mono" style={{ color: activePieItem.stroke }}>
                      {activePieItem.val}/10
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">
                      {activePieItem.pct}%
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                      Баланс
                    </span>
                    <span className="text-base font-black font-mono text-emerald-400">
                      {stateScore}%
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">
                      8 шкал
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Circular Chart Legend Matrix */}
            <div className="grid grid-cols-4 gap-1 w-full pt-2 border-t border-zinc-800/60 text-[9px] font-mono">
              {pieSegments.map((seg) => {
                const isHovered = hoveredPieMetric === seg.key;
                return (
                  <button
                    key={`legend-${seg.key}`}
                    type="button"
                    onMouseEnter={() => setHoveredPieMetric(seg.key)}
                    onMouseLeave={() => setHoveredPieMetric(null)}
                    onClick={() => setHoveredPieMetric(hoveredPieMetric === seg.key ? null : seg.key)}
                    className={`p-1 rounded-lg border text-center transition-all cursor-pointer ${
                      isHovered ? 'bg-zinc-800 border-white/40' : 'bg-zinc-900/50 border-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: seg.stroke }} />
                      <span className="text-zinc-200 font-bold">{seg.val}</span>
                    </div>
                    <div className="text-zinc-400 truncate">{seg.shortLabel} ({seg.pct}%)</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend pills for all 8 lines when in 'all' view */}
        {activeChartMode === 'slice' && sliceChartType === 'wave' && selectedSliceMetric === 'all' && (
          <div className="grid grid-cols-4 gap-1 pt-1 border-t border-zinc-800/60 text-[9.5px] font-mono">
            {SLICE_INDICATORS.map((ind) => (
              <button
                key={ind.key}
                type="button"
                onClick={() => setSelectedSliceMetric(ind.key)}
                className="flex items-center justify-center gap-1 py-1 px-1 rounded-lg bg-zinc-900/60 border border-zinc-800/60 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: ind.stroke }} />
                <span className="truncate">{ind.shortLabel}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 8. LATEST SLICE CARD (Деталі останнього зрізу) */}
      {latestSlice && (
        <div className="p-3.5 sm:p-4 rounded-3xl bg-[#14141c]/95 border border-zinc-800/80 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-100 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-emerald-400" />
              <span>Деталі останнього зрізу</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 capitalize">
              {latestSlice.fluctuation || 'стабільний'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
            {SLICE_INDICATORS.map((ind) => {
              const raw = Number(latestSlice[ind.key] || 0);
              const val = raw;
              return (
                <div key={ind.key} className="p-1.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60 text-center">
                  <span className="text-[8.5px] text-zinc-400 block truncate">{ind.shortLabel}</span>
                  <span className={`font-bold ${ind.color}`}>{val}/10</span>
                </div>
              );
            })}
          </div>

          {latestSlice.note && (
            <div className="p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-xs text-zinc-300 italic">
              «{latestSlice.note}»
            </div>
          )}
        </div>
      )}

      {/* 9. ХВИЛЯ ТЯГИ: РЕЄСТРАЦІЯ СПЛЕСКІВ ТА АНАЛІТИКА ПІКІВ (ПЕРЕНЕСЕНО У СТАН) */}
      <div id="section-craving-wave" className="space-y-4 pt-1">
        <ToughestTimeSection isEmbeddedInState={true} />
      </div>

      {/* 10. TRIGGERS & FREQUENCY + PIE / BAR + AFFECTED METRICS ANALYTICS */}
      <StateTriggersAnalytics />

      {/* 10. INTERDEPENDENCIES & TRENDS (Взаємозалежності) */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-[#14141c]/95 border border-zinc-800/80 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-100 flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span>Взаємозалежності стану</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">Синхронізовано</span>
        </div>

        <div className="space-y-2 text-xs">
          {/* Card 1: Sleep -> Craving */}
          <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                <Moon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-zinc-200 truncate">Сон &gt; 7 годин</div>
                <div className="text-[10px] text-zinc-400 truncate">Знижує інтенсивність тяги на 42%</div>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400 shrink-0">-42%</span>
          </div>

          {/* Card 2: Hydration -> Energy */}
          <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-300 shrink-0">
                <Droplets className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-zinc-200 truncate">Вода &gt; 2000 мл</div>
                <div className="text-[10px] text-zinc-400 truncate">Підвищує денний спокій та бадьорість</div>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400 shrink-0">+28%</span>
          </div>

          {/* Card 3: Afternoon Dopamine Dip */}
          <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-zinc-200 truncate">Післяобідній спад</div>
                <div className="text-[10px] text-zinc-400 truncate">Критичне вікно: 14:00 - 16:30</div>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-400 shrink-0">Увага</span>
          </div>
        </div>
      </div>
    </div>
  );
};
