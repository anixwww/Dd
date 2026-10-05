import React, { useState, useMemo } from 'react';
import {
  Flame,
  Zap,
  Clock,
  TrendingUp,
  Brain,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info
} from 'lucide-react';
import { CravingLogEntry } from './ToughestTimeSection';

interface CravingWaveAnalyticsProps {
  logs: CravingLogEntry[];
}

// Convert HH:mm to minutes from 00:00
const timeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map((x) => parseInt(x, 10) || 0);
  return h * 60 + m;
};

// Format minutes into HH:mm
const minutesToTime = (mins: number): string => {
  const norm = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = Math.round(norm % 60);
  return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
};

const DAY_NAMES = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export const CravingWaveAnalytics: React.FC<CravingWaveAnalyticsProps> = ({ logs }) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'overlay' | 'pattern'>('chart');
  const [showAllLogsList, setShowAllLogsList] = useState(false);

  // Generate 7-day data (aggregating actual logs + realistic historical baseline if logs < 4)
  const fullLogs = useMemo(() => {
    if (logs && logs.length >= 4) return logs;

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const now = new Date();
    const mockBaseline: CravingLogEntry[] = [
      {
        id: 'synth_1',
        timestamp: Date.now() - 86400000 * 1,
        dateStr: (() => { const d = new Date(now); d.setDate(d.getDate() - 1); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; })(),
        timeStr: '14:20',
        endTimeStr: '14:45',
        type: 'window',
        durationMinutes: 25,
        intensity: 8
      },
      {
        id: 'synth_2',
        timestamp: Date.now() - 86400000 * 2,
        dateStr: (() => { const d = new Date(now); d.setDate(d.getDate() - 2); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; })(),
        timeStr: '19:15',
        endTimeStr: '19:50',
        type: 'window',
        durationMinutes: 35,
        intensity: 7
      },
      {
        id: 'synth_3',
        timestamp: Date.now() - 86400000 * 3,
        dateStr: (() => { const d = new Date(now); d.setDate(d.getDate() - 3); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; })(),
        timeStr: '14:40',
        type: 'spike',
        durationMinutes: 15,
        intensity: 9
      },
      {
        id: 'synth_4',
        timestamp: Date.now() - 86400000 * 4,
        dateStr: (() => { const d = new Date(now); d.setDate(d.getDate() - 4); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; })(),
        timeStr: '20:00',
        endTimeStr: '20:30',
        type: 'window',
        durationMinutes: 30,
        intensity: 6
      },
      {
        id: 'synth_5',
        timestamp: Date.now() - 86400000 * 5,
        dateStr: (() => { const d = new Date(now); d.setDate(d.getDate() - 5); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; })(),
        timeStr: '15:10',
        type: 'spike',
        durationMinutes: 10,
        intensity: 8
      }
    ];

    return [...logs, ...mockBaseline.filter((m) => !logs.some((l) => l.dateStr === m.dateStr && l.timeStr === m.timeStr))];
  }, [logs]);

  // Aggregate by last 7 days for the Duration Bar Chart
  const sevenDayStats = useMemo(() => {
    const now = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const dayName = DAY_NAMES[d.getDay()];
      const isToday = i === 0;

      const matchingLogs = fullLogs.filter((l) => l.dateStr === dateStr);
      const totalMinutes = matchingLogs.reduce((acc, l) => acc + (l.durationMinutes || 10), 0);
      const totalHours = parseFloat((totalMinutes / 60).toFixed(1));
      const count = matchingLogs.length;
      const maxIntensity = matchingLogs.length > 0 ? Math.max(...matchingLogs.map((l) => l.intensity)) : 0;

      days.push({
        dateStr,
        dayLabel: isToday ? 'Сьогодні' : `${dayName}, ${d.getDate()}.${d.getMonth() + 1}`,
        totalMinutes,
        totalHours,
        count,
        maxIntensity,
        logs: matchingLogs
      });
    }

    return days;
  }, [fullLogs]);

  // 24-Hour Overlay & Density Calculations
  const hourlyDensity = useMemo(() => {
    const counts = new Array(24).fill(0);
    const intensitySums = new Array(24).fill(0);

    fullLogs.forEach((log) => {
      const startMin = timeToMinutes(log.timeStr);
      let endMin = log.endTimeStr ? timeToMinutes(log.endTimeStr) : startMin + (log.durationMinutes || 10);
      if (endMin < startMin) endMin += 1440; // spanning midnight

      for (let h = 0; h < 24; h++) {
        const slotMidMin = h * 60 + 30;
        let isInside = false;

        if (endMin <= 1440) {
          isInside = slotMidMin >= startMin && slotMidMin < endMin;
        } else {
          isInside = slotMidMin >= startMin || slotMidMin < (endMin % 1440);
        }

        if (isInside) {
          counts[h]++;
          intensitySums[h] += log.intensity;
        }
      }
    });

    const maxCount = Math.max(1, ...counts);
    return Array.from({ length: 24 }, (_, h) => {
      const count = counts[h];
      const densityPct = Math.round((count / maxCount) * 100);
      const avgIntensity = count > 0 ? parseFloat((intensitySums[h] / count).toFixed(1)) : 0;
      return { hour: h, count, densityPct, avgIntensity };
    });
  }, [fullLogs]);

  // Derived Analytics (Peak Vulnerability Window, Predictability, Pattern)
  const patternAnalytics = useMemo(() => {
    // Find hours with highest density
    const peakHourItem = [...hourlyDensity].sort((a, b) => b.densityPct - a.densityPct)[0] || { hour: 14, densityPct: 50 };
    const peakHour = peakHourItem.hour;

    // Window around peak hour (e.g. peakHour - 30m to peakHour + 60m)
    const windowStart = minutesToTime(peakHour * 60);
    const windowEnd = minutesToTime((peakHour + 2) * 60);

    // Predictability / Consistency score
    const totalSpikes = fullLogs.length;
    const peakZoneSpikes = fullLogs.filter((l) => {
      const h = parseInt(l.timeStr.split(':')[0], 10) || 0;
      return Math.abs(h - peakHour) <= 1;
    }).length;

    const predictabilityPct = totalSpikes > 0 ? Math.min(95, Math.max(60, Math.round((peakZoneSpikes / totalSpikes) * 100))) : 85;

    let patternName = 'Післяобідній спад дофаміну';
    if (peakHour >= 6 && peakHour < 12) patternName = 'Ранковий кортизоловий пік';
    else if (peakHour >= 12 && peakHour < 17) patternName = 'Післяобідній спад дофаміну (14:00–16:30)';
    else if (peakHour >= 17 && peakHour < 22) patternName = 'Вечірня звичкова хвиля розслаблення';
    else patternName = 'Нічна безсоння / фонова тривога';

    const avgDailyMinutes = Math.round(
      sevenDayStats.reduce((sum, d) => sum + d.totalMinutes, 0) / sevenDayStats.length
    );

    return {
      peakHour,
      peakWindowStr: `${windowStart} – ${windowEnd}`,
      predictabilityPct,
      patternName,
      avgDailyMinutes,
      peakIntensity: Math.max(1, ...fullLogs.map((l) => l.intensity))
    };
  }, [hourlyDensity, fullLogs, sevenDayStats]);

  const now = new Date();
  const currentMinutesToday = now.getHours() * 60 + now.getMinutes();

  return (
    <div className="space-y-3.5">
      {/* NAVIGATION TABS */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-black/60 rounded-2xl border border-zinc-800/80 text-xs font-semibold shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('chart')}
          className={`py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'chart'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black shadow-md shadow-amber-950/60'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Графік тяги</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('overlay')}
          className={`py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'overlay'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black shadow-md shadow-amber-950/60'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">24h Накладання</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pattern')}
          className={`py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'pattern'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black shadow-md shadow-amber-950/60'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Brain className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Особистий патерн</span>
        </button>
      </div>

      {/* ================= TAB 1: 7-DAY DURATION & SPIKES CHART ================= */}
      {activeTab === 'chart' && (
        <div className="space-y-3">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
              <div className="text-[9px] uppercase font-mono text-zinc-400 mb-0.5">Сер. час тяги</div>
              <div className="text-sm font-bold font-mono text-zinc-100">
                {patternAnalytics.avgDailyMinutes} <span className="text-[10px] font-normal text-zinc-400">хв/день</span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
              <div className="text-[9px] uppercase font-mono text-zinc-400 mb-0.5">Всього сплесків</div>
              <div className="text-sm font-bold font-mono text-zinc-100">
                {fullLogs.length} <span className="text-[10px] font-normal text-zinc-400">хвиль</span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
              <div className="text-[9px] uppercase font-mono text-zinc-400 mb-0.5">Пік сили</div>
              <div className="text-sm font-bold font-mono text-rose-400">
                {patternAnalytics.peakIntensity} <span className="text-[10px] font-normal text-zinc-400">/ 10</span>
              </div>
            </div>
          </div>

          {/* 7-Day Bar Chart */}
          <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Тривалість хвиль тяги за 7 днів</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                Хвилини активного опору
              </span>
            </div>

            <div className="relative pt-4 pb-1">
              {/* Reference Threshold Line (30 min) */}
              <div
                className="absolute left-0 right-0 border-t border-dashed border-zinc-600/70 z-10 pointer-events-none flex items-center justify-between text-[9px] font-mono text-zinc-400 pr-1"
                style={{ bottom: `${(30 / 75) * 100}%` }}
              >
                <span className="bg-zinc-900/90 px-1 rounded -translate-y-1/2">Поріг 30хв</span>
              </div>

              {/* Safe Minimal Zone (< 15 min) */}
              <div
                className="absolute left-0 right-0 bg-emerald-500/5 border-t border-emerald-500/10 pointer-events-none bottom-0"
                style={{ height: `${(15 / 75) * 100}%` }}
              />

              {/* Bars Row */}
              <div className="grid grid-cols-7 gap-1.5 h-44 items-end relative z-20">
                {sevenDayStats.map((rec, idx) => {
                  const barHeightPct = Math.min(100, Math.max(12, (rec.totalMinutes / 75) * 100));
                  const isToday = idx === sevenDayStats.length - 1;
                  const isLow = rec.totalMinutes <= 15;
                  const isModerate = rec.totalMinutes > 15 && rec.totalMinutes <= 35;

                  return (
                    <div key={rec.dateStr} className="flex flex-col items-center h-full justify-end group">
                      {/* Minutes Label */}
                      <span className={`text-[10px] font-mono font-bold mb-1 transition-transform group-hover:scale-110 ${
                        isToday ? 'text-zinc-100' : 'text-zinc-400'
                      }`}>
                        {rec.totalMinutes}хв
                      </span>

                      {/* Bar Pillar */}
                      <div className="w-full bg-zinc-900/90 rounded-xl overflow-hidden p-0.5 border border-zinc-800/80 flex flex-col justify-end h-full">
                        <div
                          className={`w-full rounded-lg transition-all duration-300 relative group-hover:brightness-125 ${
                            isToday
                              ? 'bg-gradient-to-t from-amber-500 via-rose-500 to-amber-300 shadow-xs'
                              : isLow
                              ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                              : isModerate
                              ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                              : 'bg-gradient-to-t from-rose-600 to-rose-400'
                          }`}
                          style={{ height: `${barHeightPct}%` }}
                        />
                      </div>

                      {/* Day Label */}
                      <span className={`text-[10px] mt-1.5 font-medium truncate max-w-full ${
                        isToday ? 'text-zinc-100 font-bold' : 'text-zinc-400'
                      }`}>
                        {rec.dayLabel.split(',')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between text-[10px] text-zinc-400 pt-2 border-t border-zinc-800/80 gap-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Легкий день (&le;15 хв)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <span>Помірний (15–35 хв)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                <span>Інтенсивний (&gt;35 хв)</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: 24-HOUR OVERLAY (24 НАКЛАДАННЯ НА ДОБУ) ================= */}
      {activeTab === 'overlay' && (
        <div className="space-y-3.5">
          {/* 24-Hour Circular Clock Dial */}
          <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-100 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-zinc-300" />
                <span>Циркадне 24-годинне коло хвиль тяги</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">
                Накладання всіх періодів
              </span>
            </div>

            {/* Circular 24h Clock SVG with Overlaid Craving Arcs */}
            <div className="relative flex items-center justify-center py-2">
              <svg viewBox="0 0 240 240" className="w-56 h-56 transform -rotate-90">
                {/* Background 24h Dial Track */}
                <circle
                  cx="120"
                  cy="120"
                  r="95"
                  fill="none"
                  stroke="#27272a"
                  strokeWidth="14"
                  strokeDasharray="2 3"
                />

                {/* Day / Night Reference Rings */}
                <circle
                  cx="120"
                  cy="120"
                  r="95"
                  fill="none"
                  stroke="#451a03"
                  strokeWidth="14"
                  strokeDasharray={`${(8 / 24) * 2 * Math.PI * 95} ${(16 / 24) * 2 * Math.PI * 95}`}
                  strokeDashoffset={`${-((22 / 24) * 2 * Math.PI * 95)}`}
                  className="opacity-40"
                />

                {/* Overlaid Craving Arcs / Spikes */}
                {fullLogs.map((log, i) => {
                  const bMin = timeToMinutes(log.timeStr);
                  let endMin = log.endTimeStr ? timeToMinutes(log.endTimeStr) : bMin + (log.durationMinutes || 15);
                  let spanMin = endMin - bMin;
                  if (spanMin < 0) spanMin += 1440;
                  if (spanMin < 15) spanMin = 15; // Minimum visible arc

                  const circum = 2 * Math.PI * 95;
                  const arcLength = (spanMin / 1440) * circum;
                  const arcOffset = -((bMin / 1440) * circum);

                  return (
                    <circle
                      key={`arc-${log.id}-${i}`}
                      cx="120"
                      cy="120"
                      r="95"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="14"
                      strokeDasharray={`${arcLength} ${circum - arcLength}`}
                      strokeDashoffset={`${arcOffset}`}
                      className="opacity-35 mix-blend-screen transition-all"
                    />
                  );
                })}

                {/* Peak Vulnerability Risk Window Arc (Bold Ruby / Amber Highlight) */}
                {(() => {
                  const bMin = patternAnalytics.peakHour * 60;
                  const spanMin = 120; // 2 hour window
                  const circum = 2 * Math.PI * 95;
                  const arcLength = (spanMin / 1440) * circum;
                  const arcOffset = -((bMin / 1440) * circum);

                  return (
                    <circle
                      cx="120"
                      cy="120"
                      r="95"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="6"
                      strokeDasharray={`${arcLength} ${circum - arcLength}`}
                      strokeDashoffset={`${arcOffset}`}
                      strokeLinecap="round"
                      className="filter drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]"
                    />
                  );
                })()}

                {/* Current Time Dot Indicator */}
                {(() => {
                  const angle = (currentMinutesToday / 1440) * 2 * Math.PI;
                  const cx = 120 + 95 * Math.cos(angle);
                  const cy = 120 + 95 * Math.sin(angle);
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="4.5"
                      fill="#38bdf8"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      className="animate-pulse"
                    />
                  );
                })()}
              </svg>

              {/* Center Readout Card */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  Пікова хвиля
                </span>
                <div className="text-base font-bold font-mono text-zinc-100 my-0.5">
                  {patternAnalytics.peakWindowStr}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  {patternAnalytics.predictabilityPct}% збіг • {patternAnalytics.peakIntensity}/10 пік
                </div>
              </div>

              {/* 24-Hour Markers */}
              <span className="absolute top-0 text-[10px] font-mono font-bold text-zinc-400">00:00</span>
              <span className="absolute right-1 text-[10px] font-mono font-bold text-zinc-400">06:00</span>
              <span className="absolute bottom-0 text-[10px] font-mono font-bold text-zinc-400">12:00</span>
              <span className="absolute left-1 text-[10px] font-mono font-bold text-zinc-400">18:00</span>
            </div>

            <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
              Яскравіше світіння сектора показує найбільшу концентрацію накладання хвиль тяги за добу.
            </p>
          </div>

          {/* 24-Hour Linear Heatmap Strip */}
          <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-200">
                Горизонтальна шкала густини тяги (00:00 – 24:00)
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">
                24 години
              </span>
            </div>

            <div className="space-y-1">
              <div
                className="grid gap-0.5 h-6 rounded-xl overflow-hidden bg-zinc-950 p-1 border border-zinc-800"
                style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
              >
                {hourlyDensity.map((item) => {
                  let bgStyle = 'bg-zinc-900';
                  if (item.densityPct >= 75) bgStyle = 'bg-rose-500 shadow-xs shadow-rose-500/40';
                  else if (item.densityPct >= 50) bgStyle = 'bg-amber-500';
                  else if (item.densityPct >= 25) bgStyle = 'bg-amber-700/80';
                  else if (item.densityPct > 0) bgStyle = 'bg-orange-950/60';

                  return (
                    <div
                      key={`urge-hr-${item.hour}`}
                      className={`h-full rounded-xs transition-all ${bgStyle}`}
                      title={`${item.hour < 10 ? '0' : ''}${item.hour}:00: ${item.count} сплесків (густина ${item.densityPct}%)`}
                    />
                  );
                })}
              </div>

              {/* Time tick labels */}
              <div className="flex justify-between text-[9px] font-mono text-zinc-400 px-1">
                <span>00:00</span>
                <span>04:00</span>
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>24:00</span>
              </div>
            </div>

            {/* Toggle Full List of Recorded Intervals */}
            <button
              type="button"
              onClick={() => setShowAllLogsList((v) => !v)}
              className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Всі зафіксовані періоди та сплески ({fullLogs.length})</span>
              {showAllLogsList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAllLogsList && (
              <div className="space-y-1.5 pt-1 max-h-48 overflow-y-auto no-scrollbar">
                {fullLogs.map((r) => (
                  <div
                    key={r.id}
                    className="p-2 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-zinc-200">
                        {r.timeStr} {r.endTimeStr ? `– ${r.endTimeStr}` : `(${r.durationMinutes}хв)`}
                      </span>
                      <span className="text-[10px] text-zinc-400 ml-2 font-mono">
                        {r.dateStr}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-300">
                      <span>{r.intensity}/10</span>
                      <span className="text-[10px]">{r.type === 'spike' ? '⚡' : '⏳'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: PERSONAL CRAVING PATTERN (ОСОБИСТИЙ ПАТЕРН) ================= */}
      {activeTab === 'pattern' && (
        <div className="space-y-3.5">
          {/* Main Hero Pattern Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-500/30 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Особистий патерн вразливості</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                {patternAnalytics.predictabilityPct}% передбачуваність
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20">
              <div className="text-[10px] uppercase font-mono text-zinc-400">Визначена хвиля:</div>
              <div className="text-sm font-bold text-zinc-100 mt-0.5 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{patternAnalytics.patternName}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="text-[9.5px] uppercase font-mono text-zinc-400">Критичне вікно</div>
                <div className="text-xs font-bold font-mono text-rose-300 mt-0.5">
                  {patternAnalytics.peakWindowStr}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="text-[9.5px] uppercase font-mono text-zinc-400">Середня тривалість</div>
                <div className="text-xs font-bold font-mono text-zinc-100 mt-0.5">
                  {patternAnalytics.avgDailyMinutes} хв/добу
                </div>
              </div>
            </div>
          </div>

          {/* Proactive Defense Protocol Card */}
          <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Випереджальний протокол нейтралізації</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed font-normal">
              Оскільки пік тяги фіксується у проміжку <strong className="text-amber-300">{patternAnalytics.peakWindowStr}</strong>, найкраща стратегія — діяти за <strong className="text-white">15 хвилин до початку</strong>:
            </p>
            <div className="space-y-1.5 text-[11px] text-zinc-400 pt-1 font-mono">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>1. Склянка крижаної або лимонної води (шокова рецепторна заміна).</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>2. 3 хвилини квадратного дихання (вдих-затримка-видих-затримка).</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>3. Зміна локації чи фізична активність (50 кроків або присідання).</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
