import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { DayRating } from '../types';
import { TrendingUp, Activity, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface StateDynamicsChartProps {
  days: Record<string, DayRating>;
  daysRange?: number;
  showPeriodSelector?: boolean;
}

type ChartType = 'line' | 'bar' | 'pie';

const METRIC_COLORS = {
  craving: '#f43f5e',  // Neon Rose
  energy: '#10b981',   // Neon Emerald
  calmness: '#06b6d4', // Neon Cyan
  focus: '#8b5cf6',    // Neon Purple
  sleep: '#38bdf8',    // Light Sky
  sex: '#ec4899'       // Hot Pink
};

const StateDynamicsChartComponent: React.FC<StateDynamicsChartProps> = ({
  days,
  daysRange = 7,
  showPeriodSelector = true
}) => {
  const [selectedRange, setSelectedRange] = useState<number>(daysRange);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [refreshTick, setRefreshTick] = useState<number>(0);

  // Listen for real-time checkin and slice updates
  React.useEffect(() => {
    const handleUpdate = () => setRefreshTick(t => t + 1);
    window.addEventListener('slice-saved', handleUpdate);
    window.addEventListener('health-slices-change', handleUpdate);
    window.addEventListener('checkin-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('slice-saved', handleUpdate);
      window.removeEventListener('health-slices-change', handleUpdate);
      window.removeEventListener('checkin-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Chart data for Line and Bar charts
  const chartData = useMemo(() => {
    const points = [];
    const today = new Date();

    for (let i = selectedRange - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      const dateKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const dayRating = days[dateKey];

      const weekday = d.toLocaleDateString('uk-UA', { weekday: 'short' });
      const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
      const dayMonth = d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
      const monthOnly = d.toLocaleDateString('uk-UA', { month: 'short' });

      let displayLabel = capitalizedWeekday;
      if (selectedRange > 7 && selectedRange <= 30) {
        displayLabel = `${d.getDate()} ${monthOnly}`;
      } else if (selectedRange > 30 && selectedRange <= 90) {
        displayLabel = `${d.getDate()} ${monthOnly}`;
      } else if (selectedRange > 90) {
        displayLabel = `${monthOnly}`;
      } else if (selectedRange > 90) {
        displayLabel = `${monthOnly}`;
      }

      const surveys = (dayRating as any)?.surveys || (dayRating as any)?.entries || [];
      const hasSurveys = surveys.length > 0;

      let daySlices: any[] = [];
      try {
        const raw = localStorage.getItem('quit-smoking:health-slices');
        if (raw) {
          const allSlices = JSON.parse(raw);
          if (Array.isArray(allSlices)) {
            daySlices = allSlices.filter((s: any) => s.date === dateKey);
          }
        }
      } catch {}

      let checkinEntries: any[] = [];
      try {
        const rawCheckin = localStorage.getItem(`quit-smoking:health-checkin:${dateKey}`);
        if (rawCheckin) {
          const parsed = JSON.parse(rawCheckin);
          if (Array.isArray(parsed.entries)) {
            checkinEntries = parsed.entries;
          }
        }
      } catch {}

      const calcAvg = (key: 'craving' | 'energy' | 'balance' | 'mood' | 'focus' | 'calmness') => {
        // 1. Average across intermediate slices for the day
        if (daySlices.length > 0) {
          let sum = 0;
          let count = 0;
          daySlices.forEach((s) => {
            const rawVal = key === 'balance' || key === 'mood' ? (s.calmness ?? s.overall) : s[key];
            if (typeof rawVal === 'number' && rawVal > 0) {
              sum += rawVal;
              count++;
            }
          });
          if (count > 0) return Number((sum / count).toFixed(1));
        }

        // 2. Average across check-in session entries
        if (checkinEntries.length > 0) {
          let sum = 0;
          let count = 0;
          checkinEntries.forEach((e) => {
            const rawVal = key === 'balance' ? e.calmness : key === 'mood' ? e.overall : e[key];
            if (typeof rawVal === 'number' && rawVal > 0) {
              sum += rawVal;
              count++;
            }
          });
          if (count > 0) return Number((sum / count).toFixed(1));
        }

        // 3. Fallback to surveys
        if (!hasSurveys) return null;
        let sum = 0;
        let count = 0;
        surveys.forEach((s) => {
          const val = (s as any)[key];
          if (typeof val === 'number' && val > 0) {
            sum += val;
            count++;
          }
        });
        return count > 0 ? Number((sum / count).toFixed(1)) : null;
      };

      const dRating: any = dayRating;
      const cravingVal = calcAvg('craving') ?? dRating?.craving ?? dRating?.cravingLevel ?? null;
      const energyVal = calcAvg('energy') ?? null;
      const calmnessVal = calcAvg('balance') ?? calcAvg('mood') ?? dRating?.mood ?? dRating?.moodLevel ?? null;
      const focusVal = calcAvg('focus') ?? null;

      const sleepHours = dRating?.sleep?.hours ?? null;
      const mealsCount = dRating?.meals?.length ?? 0;
      const drinksCount = dRating?.drinks?.length ?? 0;

      const sexEntries = surveys.filter(
        (s: any) => s.id?.startsWith('sex_') || s.note?.includes('Секс') || s.note?.includes('Близькість')
      );
      const sexCount = sexEntries.length > 0 ? sexEntries.length : null;

      const totalCheckinsCount = Math.max(surveys.length, daySlices.length, checkinEntries.length);
      const hasAnyData = hasSurveys || daySlices.length > 0 || checkinEntries.length > 0 || dRating?.sleep || mealsCount > 0 || drinksCount > 0 || cravingVal !== null;

      points.push({
        dateKey,
        displayLabel,
        fullDate: `${capitalizedWeekday}, ${dayMonth} ${d.getFullYear()}`,
        hasData: hasAnyData,
        craving: cravingVal,
        energy: energyVal,
        calmness: calmnessVal,
        focus: focusVal,
        sleepHours,
        sexCount,
        surveysCount: totalCheckinsCount
      });
    }

    return points;
  }, [days, selectedRange, refreshTick]);

  // Aggregated averages for Pie chart
  const pieData = useMemo(() => {
    let cravingSum = 0, cravingCount = 0;
    let energySum = 0, energyCount = 0;
    let calmnessSum = 0, calmnessCount = 0;
    let focusSum = 0, focusCount = 0;
    let sleepSum = 0, sleepCount = 0;
    let sexSum = 0;

    chartData.forEach((p) => {
      if (p.craving !== null) { cravingSum += p.craving; cravingCount++; }
      if (p.energy !== null) { energySum += p.energy; energyCount++; }
      if (p.calmness !== null) { calmnessSum += p.calmness; calmnessCount++; }
      if (p.focus !== null) { focusSum += p.focus; focusCount++; }
      if (p.sleepHours !== null) { sleepSum += p.sleepHours; sleepCount++; }
      if (p.sexCount !== null) { sexSum += p.sexCount; }
    });

    const items = [
      { name: 'Тяга', value: cravingCount > 0 ? Number((cravingSum / cravingCount).toFixed(1)) : 0, color: METRIC_COLORS.craving, unit: '/10' },
      { name: 'Енергія', value: energyCount > 0 ? Number((energySum / energyCount).toFixed(1)) : 0, color: METRIC_COLORS.energy, unit: '/10' },
      { name: 'Спокій', value: calmnessCount > 0 ? Number((calmnessSum / calmnessCount).toFixed(1)) : 0, color: METRIC_COLORS.calmness, unit: '/10' },
      { name: 'Фокус', value: focusCount > 0 ? Number((focusSum / focusCount).toFixed(1)) : 0, color: METRIC_COLORS.focus, unit: '/10' },
      { name: 'Сон', value: sleepCount > 0 ? Number((sleepSum / sleepCount).toFixed(1)) : 0, color: METRIC_COLORS.sleep, unit: 'г' },
      { name: 'Секс', value: sexSum > 0 ? sexSum : 0, color: METRIC_COLORS.sex, unit: 'раз' },
    ];

    return items.filter((item) => item.value > 0);
  }, [chartData]);

  // Determine tick interval for XAxis so labels don't crowd
  const xAxisInterval = useMemo(() => {
    if (selectedRange <= 7) return 0;
    if (selectedRange <= 14) return 1;
    if (selectedRange <= 30) return 4;
    if (selectedRange <= 90) return 14;
    if (selectedRange <= 180) return 29;
    return 30;
  }, [selectedRange]);

  const getRangeTitle = () => {
    switch (selectedRange) {
      case 7: return '7 днів';
      case 30: return '1 місяць';
      case 90: return '3 місяці';
      case 180: return '6 місяців';
      case 365: return '1 рік';
      default: return `${selectedRange} днів`;
    }
  };

  return (
    <div className="bg-[#14141c]/90 border border-zinc-800/80 rounded-3xl p-4 sm:p-5 shadow-2xl text-white backdrop-blur-xl relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Controls: Title, Chart Mode Switcher and Range Selector */}
      <div className="flex flex-col gap-3 mb-3 relative z-10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/40">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                <span>Динаміка стану</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                  {getRangeTitle()}
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Багатовимірний тренд показників самопочуття
              </p>
            </div>
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center gap-1 p-1 bg-black/60 rounded-xl border border-zinc-800 shadow-inner">
            <button
              type="button"
              onClick={() => setChartType('line')}
              className={`p-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartType === 'line'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black shadow-md shadow-emerald-950/60 font-black'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Хвильовий графік"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden xs:inline">Хвилі</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`p-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartType === 'bar'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black shadow-md shadow-emerald-950/60 font-black'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Стовпчиковий графік"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden xs:inline">Стовпчики</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType('pie')}
              className={`p-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartType === 'pie'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black shadow-md shadow-emerald-950/60 font-black'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Колова діаграма"
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden xs:inline">Коло</span>
            </button>
          </div>
        </div>

        {/* Time range switcher */}
        {showPeriodSelector && (
          <div className="grid grid-cols-5 gap-1 p-1 bg-black/60 rounded-xl border border-zinc-800 shadow-inner">
            {[
              { r: 7, label: '7 дн' },
              { r: 30, label: '1 міс' },
              { r: 90, label: '3 міс' },
              { r: 180, label: '6 міс' },
              { r: 365, label: '1 рік' }
            ].map(({ r, label }) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRange(r)}
                className={`py-1 text-[11px] font-bold rounded-lg text-center transition-all cursor-pointer ${
                  selectedRange === r
                    ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart container */}
      <div className="h-60 w-full mt-2 relative z-10 p-2 rounded-2xl bg-black/40 border border-zinc-800/60">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <AreaChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="area-craving" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={METRIC_COLORS.craving} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={METRIC_COLORS.craving} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="area-energy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={METRIC_COLORS.energy} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={METRIC_COLORS.energy} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="area-calmness" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={METRIC_COLORS.calmness} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={METRIC_COLORS.calmness} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="area-focus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={METRIC_COLORS.focus} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={METRIC_COLORS.focus} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a60" vertical={false} />
              <XAxis
                dataKey="displayLabel"
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval={xAxisInterval}
              />
              <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const p = payload[0].payload;
                  return (
                    <div className="bg-[#101018f0] text-white p-3 rounded-2xl text-xs space-y-1.5 shadow-2xl border border-zinc-700/80 backdrop-blur-xl">
                      <div className="font-bold border-b border-zinc-800 pb-1 flex items-center justify-between gap-3">
                        <span className="text-zinc-200">{p.fullDate}</span>
                        {p.surveysCount > 0 && (
                          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/40">
                            {p.surveysCount} зріз(ів)
                          </span>
                        )}
                      </div>
                      {p.hasData ? (
                        <div className="space-y-1 text-[11px] font-mono">
                          {p.craving !== null && <div className="flex items-center justify-between gap-3"><span className="text-zinc-300">Тяга:</span> <strong style={{ color: METRIC_COLORS.craving }}>{p.craving} / 10</strong></div>}
                          {p.energy !== null && <div className="flex items-center justify-between gap-3"><span className="text-zinc-300">Енергія:</span> <strong style={{ color: METRIC_COLORS.energy }}>{p.energy} / 10</strong></div>}
                          {p.calmness !== null && <div className="flex items-center justify-between gap-3"><span className="text-zinc-300">Спокій:</span> <strong style={{ color: METRIC_COLORS.calmness }}>{p.calmness} / 10</strong></div>}
                          {p.focus !== null && <div className="flex items-center justify-between gap-3"><span className="text-zinc-300">Фокус:</span> <strong style={{ color: METRIC_COLORS.focus }}>{p.focus} / 10</strong></div>}
                          {p.sleepHours !== null && <div className="flex items-center justify-between gap-3"><span className="text-zinc-300">Сон:</span> <strong style={{ color: METRIC_COLORS.sleep }}>{p.sleepHours} год</strong></div>}
                          {p.sexCount !== null && <div className="flex items-center justify-between gap-3"><span className="text-zinc-300">Секс:</span> <strong style={{ color: METRIC_COLORS.sex }}>{p.sexCount} раз</strong></div>}
                        </div>
                      ) : (
                        <div className="text-[11px] text-zinc-500">Немає записів за цей день</div>
                      )}
                    </div>
                  );
                }}
              />

              <Area
                type="monotone"
                dataKey="craving"
                name="Тяга"
                stroke={METRIC_COLORS.craving}
                strokeWidth={2.5}
                fill="url(#area-craving)"
                dot={selectedRange > 30 ? false : { r: 3, fill: METRIC_COLORS.craving, strokeWidth: 1.5, stroke: '#000' }}
                activeDot={{ r: 5, fill: METRIC_COLORS.craving, strokeWidth: 2, stroke: '#fff' }}
                connectNulls
              />
              <Area
                type="monotone"
                dataKey="energy"
                name="Енергія"
                stroke={METRIC_COLORS.energy}
                strokeWidth={2.5}
                fill="url(#area-energy)"
                dot={selectedRange > 30 ? false : { r: 3, fill: METRIC_COLORS.energy, strokeWidth: 1.5, stroke: '#000' }}
                activeDot={{ r: 5, fill: METRIC_COLORS.energy, strokeWidth: 2, stroke: '#fff' }}
                connectNulls
              />
              <Area
                type="monotone"
                dataKey="calmness"
                name="Спокій"
                stroke={METRIC_COLORS.calmness}
                strokeWidth={2.5}
                fill="url(#area-calmness)"
                dot={selectedRange > 30 ? false : { r: 3, fill: METRIC_COLORS.calmness, strokeWidth: 1.5, stroke: '#000' }}
                activeDot={{ r: 5, fill: METRIC_COLORS.calmness, strokeWidth: 2, stroke: '#fff' }}
                connectNulls
              />
              <Area
                type="monotone"
                dataKey="focus"
                name="Фокус"
                stroke={METRIC_COLORS.focus}
                strokeWidth={2.5}
                fill="url(#area-focus)"
                dot={selectedRange > 30 ? false : { r: 3, fill: METRIC_COLORS.focus, strokeWidth: 1.5, stroke: '#000' }}
                activeDot={{ r: 5, fill: METRIC_COLORS.focus, strokeWidth: 2, stroke: '#fff' }}
                connectNulls
              />
            </AreaChart>
          ) : chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a60" vertical={false} />
              <XAxis
                dataKey="displayLabel"
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval={xAxisInterval}
              />
              <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const p = payload[0].payload;
                  return (
                    <div className="bg-[#101018f0] text-white p-3 rounded-2xl text-xs space-y-1.5 shadow-2xl border border-zinc-700/80 backdrop-blur-xl">
                      <div className="font-bold border-b border-zinc-800 pb-1">
                        {p.fullDate}
                      </div>
                      {p.hasData ? (
                        <div className="space-y-1 text-[11px] font-mono">
                          {p.craving !== null && <div className="flex justify-between gap-3"><span>Тяга:</span> <strong style={{ color: METRIC_COLORS.craving }}>{p.craving} / 10</strong></div>}
                          {p.energy !== null && <div className="flex justify-between gap-3"><span>Енергія:</span> <strong style={{ color: METRIC_COLORS.energy }}>{p.energy} / 10</strong></div>}
                          {p.calmness !== null && <div className="flex justify-between gap-3"><span>Спокій:</span> <strong style={{ color: METRIC_COLORS.calmness }}>{p.calmness} / 10</strong></div>}
                          {p.focus !== null && <div className="flex justify-between gap-3"><span>Фокус:</span> <strong style={{ color: METRIC_COLORS.focus }}>{p.focus} / 10</strong></div>}
                          {p.sleepHours !== null && <div className="flex justify-between gap-3"><span>Сон:</span> <strong style={{ color: METRIC_COLORS.sleep }}>{p.sleepHours} год</strong></div>}
                        </div>
                      ) : (
                        <div className="text-[11px] text-zinc-500">Немає записів за цей день</div>
                      )}
                    </div>
                  );
                }}
              />

              <Bar dataKey="craving" name="Тяга" fill={METRIC_COLORS.craving} radius={[6, 6, 0, 0]} />
              <Bar dataKey="energy" name="Енергія" fill={METRIC_COLORS.energy} radius={[6, 6, 0, 0]} />
              <Bar dataKey="calmness" name="Спокій" fill={METRIC_COLORS.calmness} radius={[6, 6, 0, 0]} />
              <Bar dataKey="focus" name="Фокус" fill={METRIC_COLORS.focus} radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#18181b" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#101018f0] text-white p-2.5 rounded-2xl text-xs shadow-2xl border border-zinc-700 font-bold backdrop-blur-xl">
                      <span style={{ color: data.color }}>● {data.name}:</span> {data.value} {data.unit}
                    </div>
                  );
                }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Clean Modern Neon Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-zinc-800/80 text-[11px] font-medium text-zinc-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block shadow-[0_0_6px_currentColor]" style={{ backgroundColor: METRIC_COLORS.craving, color: METRIC_COLORS.craving }}></span>
          <span>Тяга (1–10)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block shadow-[0_0_6px_currentColor]" style={{ backgroundColor: METRIC_COLORS.energy, color: METRIC_COLORS.energy }}></span>
          <span>Енергія (1–10)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block shadow-[0_0_6px_currentColor]" style={{ backgroundColor: METRIC_COLORS.calmness, color: METRIC_COLORS.calmness }}></span>
          <span>Спокій (1–10)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block shadow-[0_0_6px_currentColor]" style={{ backgroundColor: METRIC_COLORS.focus, color: METRIC_COLORS.focus }}></span>
          <span>Фокус (1–10)</span>
        </div>
      </div>
    </div>
  );
};

export const StateDynamicsChart = React.memo(StateDynamicsChartComponent);
