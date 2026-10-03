import React from 'react';
import { 
  Droplets, 
  Moon, 
  ChevronUp, 
  ChevronDown, 
  Sliders, 
  TrendingUp, 
  AlertTriangle, 
  CalendarCheck,
  Activity,
  Check,
  Edit3
} from 'lucide-react';
import { AnimatedAnalyzerIcon } from '../AnimatedAnalyzerIcon';
import {
  ResponsiveContainer as RechartsResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  Cell as RechartsCell,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip
} from 'recharts';

interface HealthTabAnalyzerSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  hydrationCurrent: number;
  hydrationNorm: number;
  addAnalyzerWater: (ml: number) => void;
  analyzerInsights: any;
  sleepRegimenStatus: any;
  sleepBedTime: string;
  setSleepBedTime: (val: string) => void;
  sleepWakeTime: string;
  setSleepWakeTime: (val: string) => void;
  sleepDurationHours: number;
  sleepQuality: number;
  setSleepQuality: (val: number) => void;
  sleepChartData: any[];
  onSaveSleep: () => void;
  fluctMetric: 'craving' | 'mood' | 'energy' | 'anxiety';
  setFluctMetric: (val: 'craving' | 'mood' | 'energy' | 'anxiety') => void;
  fluctLevel: number;
  setFluctLevel: (val: number) => void;
  fluctCause: string;
  setFluctCause: (val: string) => void;
  customFluctCause: string;
  setCustomFluctCause: (val: string) => void;
  onSaveFluctuation: () => void;
  onOpenCheckIn?: () => void;
}

export const HealthTabAnalyzerSection: React.FC<HealthTabAnalyzerSectionProps> = ({
  isOpen,
  onToggle,
  hydrationCurrent,
  hydrationNorm,
  addAnalyzerWater,
  analyzerInsights,
  sleepRegimenStatus,
  sleepBedTime,
  setSleepBedTime,
  sleepWakeTime,
  setSleepWakeTime,
  sleepDurationHours,
  sleepQuality,
  setSleepQuality,
  sleepChartData,
  onSaveSleep,
  fluctMetric,
  setFluctMetric,
  fluctLevel,
  setFluctLevel,
  fluctCause,
  setFluctCause,
  customFluctCause,
  setCustomFluctCause,
  onSaveFluctuation,
  onOpenCheckIn,
}) => {
  const [analyzerName, setAnalyzerName] = React.useState<string>(() => {
    try {
      const s = localStorage.getItem('quit-smoking:analyzer-name');
      if (s && s.trim()) return s.trim();
    } catch {}
    return 'Аналізатор';
  });

  React.useEffect(() => {
    const handleSync = (e: any) => {
      if (typeof e?.detail === 'string' && e.detail.trim()) {
        setAnalyzerName(e.detail.trim());
      } else {
        try {
          const s = localStorage.getItem('quit-smoking:analyzer-name');
          setAnalyzerName((s && s.trim()) ? s.trim() : 'Аналізатор');
        } catch {}
      }
    };
    window.addEventListener('analyzer-name-changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('analyzer-name-changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const hydrationPct = Math.min(100, Math.round((hydrationCurrent / Math.max(1, hydrationNorm)) * 100));

  return (
    <div className={`bg-white/90 dark:bg-[#14131d]/90 border rounded-2xl shadow-xs overflow-hidden transition-all mt-3 ${isOpen ? 'border-slate-300 dark:border-zinc-700 shadow-sm' : 'border-slate-200/90 dark:border-zinc-800/90'}`}>
      <div className="w-full px-4 py-3.5 flex items-center justify-between gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/30">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-3 min-w-0 text-left flex-1 cursor-pointer"
        >
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
              <span>{analyzerName}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">
              Гідратація, сон та динаміка самопочуття
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new Event('open-analyzer-naming-modal'));
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors cursor-pointer"
            title="Змінити ім'я"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 pt-2 border-t border-slate-100 dark:border-white/5 space-y-4">
          
          {/* Щоденний чек-ін швидкий виклик */}
          {onOpenCheckIn && (
            <div className="p-3 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                    Щоденний чек-ін
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                    Швидка фіксація показників дня
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenCheckIn}
                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 active:scale-95"
              >
                Пройти чек-ін
              </button>
            </div>
          )}

          {/* 1. Гідратація */}
          <div className="p-3.5 bg-sky-500/5 border border-sky-500/20 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                <Droplets className="w-4 h-4 text-sky-400" />
                <span>Гідратація</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                {hydrationPct}%
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-500 dark:text-zinc-400">Вжито сьогодні:</span>
              <span className="font-black text-sky-400 font-mono text-sm">{hydrationCurrent} / {hydrationNorm} мл</span>
            </div>

            <div className="w-full h-2 bg-slate-200/60 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-zinc-700">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${hydrationPct}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[150, 250, 500].map((ml) => (
                <button
                  key={ml}
                  type="button"
                  onClick={() => addAnalyzerWater(ml)}
                  className="py-2 text-xs font-bold rounded-xl border border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/15 text-sky-400 transition-all cursor-pointer text-center active:scale-95"
                >
                  +{ml} мл
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed">
              {analyzerInsights.isWellHydrated
                ? 'Водний баланс у нормі. Кров розріджена для своєчасного очищення організму.'
                : 'Дефіцит води підсилює спазми судин та тягу. Зробіть кілька ковтків.'}
            </p>
          </div>

          {/* 2. Режим сну */}
          <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Режим сну</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                {sleepDurationHours} год
              </span>
            </div>

            <div className={`p-2.5 rounded-xl border text-[11px] leading-relaxed space-y-1 ${sleepRegimenStatus.color}`}>
              <div className="font-bold">{sleepRegimenStatus.label}</div>
              <div className="text-slate-600 dark:text-zinc-300 font-medium leading-relaxed">{sleepRegimenStatus.desc}</div>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400">Засинання</label>
                  <input
                    type="time"
                    value={sleepBedTime}
                    onChange={(e) => setSleepBedTime(e.target.value)}
                    className="w-full text-xs font-mono font-bold p-2 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400">Пробудження</label>
                  <input
                    type="time"
                    value={sleepWakeTime}
                    onChange={(e) => setSleepWakeTime(e.target.value)}
                    className="w-full text-xs font-mono font-bold p-2 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block">Якість відпочинку ({sleepQuality}/5)</label>
                <div className="grid grid-cols-5 gap-1">
                  {[
                    { val: 1, label: '😫' },
                    { val: 2, label: '🥱' },
                    { val: 3, label: '😐' },
                    { val: 4, label: '😊' },
                    { val: 5, label: '🌟' }
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setSleepQuality(item.val)}
                      className={`py-1 text-sm rounded-lg border transition-all cursor-pointer ${
                        sleepQuality === item.val
                          ? 'bg-indigo-600 text-white border-indigo-700 font-bold shadow-xs'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={onSaveSleep}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all active:scale-95 text-center"
              >
                Зберегти параметри сну
              </button>

              {/* Графік сну */}
              <div className="space-y-1.5 pt-3 border-t border-slate-200/40 dark:border-zinc-700/40">
                <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wide">
                  Хроніка режиму сну (7 днів)
                </span>
                
                <div className="h-32 w-full mt-1">
                  <RechartsResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={sleepChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <RechartsCartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                      <RechartsXAxis dataKey="label" fontSize={9} tickLine={false} axisLine={false} stroke="#8c9fb2" />
                      <RechartsYAxis domain={[0, 12]} ticks={[0, 4, 8, 12]} fontSize={9} tickLine={false} axisLine={false} stroke="#8c9fb2" unit="г" />
                      <RechartsTooltip
                        content={({ active, payload }) => {
                          if (!active || !payload || !payload.length) return null;
                          const p = payload[0].payload;
                          return (
                            <div className="bg-[#121216] border border-white/10 p-2 rounded-xl text-[10px] space-y-0.5 shadow-lg text-white">
                              <div className="font-bold text-zinc-300">{p.dateStr}</div>
                              <div className="text-indigo-400">Сон: <strong>{p.hours} год</strong></div>
                              <div className="text-zinc-400">Режим: <strong>{p.bedtime} - {p.wakeTime}</strong></div>
                            </div>
                          );
                        }}
                      />
                      <RechartsBar dataKey="hours" radius={[3, 3, 0, 0]}>
                        {sleepChartData.map((entry, idx) => (
                          <RechartsCell 
                            key={`cell-${idx}`} 
                            fill={entry.isDisrupted ? '#ef4444' : '#6366f1'} 
                          />
                        ))}
                      </RechartsBar>
                    </RechartsBarChart>
                  </RechartsResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Коливання стану */}
          <div className="p-3.5 bg-purple-500/5 border border-purple-500/20 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Коливання стану</span>
            </div>
            
            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400">Показник</label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { id: 'craving', label: 'Тяга' },
                    { id: 'mood', label: 'Настрій' },
                    { id: 'energy', label: 'Енергія' },
                    { id: 'anxiety', label: 'Тривога' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFluctMetric(m.id as any)}
                      className={`py-1.5 px-0.5 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                        fluctMetric === m.id
                          ? 'bg-purple-600 border-purple-700 text-white shadow-xs'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400">Рівень ({fluctLevel}/5)</label>
                <div className="grid grid-cols-5 gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFluctLevel(num)}
                      className={`py-1 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                        fluctLevel === num
                          ? 'bg-purple-600 border-purple-700 text-white shadow-xs'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400">Що спровокувало?</label>
                <div className="grid grid-cols-4 gap-1 mb-1">
                  {[
                    { id: 'кава', label: 'Кава' },
                    { id: 'їжа', label: 'Їжа' },
                    { id: 'недосипання', label: 'Сон' },
                    { id: 'стрес', label: 'Стрес' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setFluctCause(c.id);
                        setCustomFluctCause('');
                      }}
                      className={`py-1 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                        fluctCause === c.id && !customFluctCause
                          ? 'bg-purple-600 border-purple-700 text-white shadow-xs'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                
                <input
                  type="text"
                  placeholder="Інша причина..."
                  value={customFluctCause}
                  onChange={(e) => {
                    setCustomFluctCause(e.target.value);
                    setFluctCause(e.target.value);
                  }}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-800 dark:text-white"
                />
              </div>

              <button
                type="button"
                onClick={onSaveFluctuation}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Зберегти коливання</span>
              </button>
            </div>
          </div>

          {/* 4. Головний тригер */}
          <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Головний тригер: {analyzerInsights.topTrigger}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
              При контакті з цим тригером зробіть три глибокі вдихи та випийте склянку води для гасіння імпульсу.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
