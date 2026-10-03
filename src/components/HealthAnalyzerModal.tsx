import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  X, 
  Sparkles, 
  Droplets, 
  Moon, 
  Activity, 
  Brain, 
  Zap, 
  Wind, 
  Check, 
  RefreshCw, 
  Sliders, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Heart,
  Lightbulb,
  Edit3
} from 'lucide-react';
import { getBodySystemsRecovery, DAY } from '../data/healthData';
import { AnimatedAnalyzerIcon } from './AnimatedAnalyzerIcon';
import { MonolithicSegmentedControl } from './MonolithicSegmentedControl';

interface HealthAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  diffMs?: number;
  onOpenHealthTab?: () => void;
}

interface AdviceResponse {
  headline: string;
  bodySummary: string;
  quickTips: string[];
  emergencyAction: string | null;
  biologicalFocus: string;
}

export const HealthAnalyzerModal: React.FC<HealthAnalyzerModalProps> = ({
  isOpen,
  onClose,
  diffMs = 0,
  onOpenHealthTab
}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [adviceData, setAdviceData] = useState<AdviceResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'tips' | 'fluctuations' | 'systems'>('tips');
  const [fluctMetric, setFluctMetric] = useState<'craving' | 'mood' | 'energy' | 'anxiety'>('craving');
  const [fluctLevel, setFluctLevel] = useState<number>(3);
  const [fluctCause, setFluctCause] = useState<string>('кава');
  const [customFluctCause, setCustomFluctCause] = useState<string>('');
  const [waterAdding, setWaterAdding] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Custom Analyzer Name
  const [analyzerName, setAnalyzerName] = useState<string>(() => {
    try {
      const s = localStorage.getItem('quit-smoking:analyzer-name');
      if (s && s.trim()) return s.trim();
    } catch {}
    return 'Аналізатор';
  });
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>('');

  useEffect(() => {
    const handleNameSync = (e: any) => {
      if (typeof e?.detail === 'string' && e.detail.trim()) {
        setAnalyzerName(e.detail.trim());
      } else {
        try {
          const s = localStorage.getItem('quit-smoking:analyzer-name');
          setAnalyzerName((s && s.trim()) ? s.trim() : 'Аналізатор');
        } catch {}
      }
    };
    window.addEventListener('analyzer-name-changed', handleNameSync);
    window.addEventListener('storage', handleNameSync);
    return () => {
      window.removeEventListener('analyzer-name-changed', handleNameSync);
      window.removeEventListener('storage', handleNameSync);
    };
  }, []);

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = tempName.trim() || 'Аналізатор';
    setAnalyzerName(finalName);
    setIsEditingName(false);
    try {
      localStorage.setItem('quit-smoking:analyzer-name', finalName);
      window.dispatchEvent(new CustomEvent('analyzer-name-changed', { detail: finalName }));
      window.dispatchEvent(new Event('storage'));
      showToast(`Ім'я змінено на «${finalName}» ✨`);
    } catch {}
  };

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const todayStr = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);

  const daysFree = Math.max(1, Math.floor(diffMs / DAY));

  // Load real user metrics from localStorage
  const metrics = useMemo(() => {
    let craving = 2;
    let mood = 3;
    let energy = 3;
    let water = 0;
    let weight = 70;
    let sleepHours = 7.5;
    let bedtime = '23:00';
    let wakeTime = '07:30';
    let sleepQuality = 4;
    let topTrigger = 'Кава';
    let breathSeconds = 0;
    let symptoms: string[] = [];

    try {
      // 1. Survey Data
      const savedDays = localStorage.getItem('quit-smoking:days');
      if (savedDays) {
        const daysMap = JSON.parse(savedDays);
        if (daysMap && daysMap[todayStr]) {
          const surveys = daysMap[todayStr].surveys || daysMap[todayStr].entries || [];
          if (surveys.length > 0) {
            const latest = surveys[surveys.length - 1];
            if (typeof latest.craving === 'number') craving = latest.craving;
            if (typeof latest.mood === 'number') mood = latest.mood;
            if (typeof latest.energy === 'number') energy = latest.energy;
            if (Array.isArray(latest.tags)) symptoms = latest.tags;
          }
        }
      }

      // 2. Hydration
      const savedWater = localStorage.getItem(`quit-smoking:hydration-${todayStr}`);
      if (savedWater) water = parseInt(savedWater, 10) || 0;

      // 3. Weight & Hydration norm
      const savedWeight = localStorage.getItem('quit-smoking:physio-weight');
      if (savedWeight) weight = parseFloat(savedWeight) || 70;

      // 4. Sleep
      const savedSleep = localStorage.getItem(`quit-smoking:sleep-${todayStr}`);
      if (savedSleep) {
        const parsed = JSON.parse(savedSleep);
        sleepHours = Number(parsed.hours || parsed.duration || 7.5);
        if (parsed.bedtime) bedtime = parsed.bedtime;
        if (parsed.wakeTime) wakeTime = parsed.wakeTime;
      }

      // 5. Stange breath test
      const savedBreath = localStorage.getItem('quit-smoking:stange-test-history');
      if (savedBreath) {
        const history = JSON.parse(savedBreath);
        if (Array.isArray(history) && history.length > 0) {
          breathSeconds = history[0].seconds || 0;
        }
      }

      // 6. Top trigger from custom logs
      const savedLogs = localStorage.getItem('quit-smoking:health-custom-logs');
      if (savedLogs) {
        const logs = JSON.parse(savedLogs);
        if (Array.isArray(logs)) {
          const triggerCounts: Record<string, number> = {};
          logs.forEach((l: any) => {
            if (l.category === 'trigger' && l.details) {
              const match = l.details.match(/Тригер:\s*"([^"]+)"/);
              if (match && match[1]) {
                triggerCounts[match[1]] = (triggerCounts[match[1]] || 0) + 1;
              }
            }
          });
          let maxCount = 0;
          Object.entries(triggerCounts).forEach(([t, count]) => {
            if (count > maxCount) {
              topTrigger = t;
              maxCount = count;
            }
          });
        }
      }
    } catch (e) {
      console.error('Error fetching metrics for analyzer modal:', e);
    }

    const waterNorm = Math.round(weight * 33);
    const isDisruptedSleep = (() => {
      try {
        const [hStr] = bedtime.split(':');
        const h = parseInt(hStr, 10);
        return !isNaN(h) && h >= 2 && h <= 6;
      } catch {
        return false;
      }
    })();

    return {
      craving,
      mood,
      energy,
      water,
      waterNorm,
      sleepHours,
      bedtime,
      wakeTime,
      sleepQuality,
      topTrigger,
      breathSeconds,
      symptoms,
      isDisruptedSleep
    };
  }, [todayStr, refreshTrigger]);

  const systems = useMemo(() => getBodySystemsRecovery(diffMs), [diffMs]);

  // Request Live Analysis
  const fetchAnalysis = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analyzer/live-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diffDays: daysFree,
          craving: metrics.craving,
          water: metrics.water,
          waterNorm: metrics.waterNorm,
          sleepHours: metrics.sleepHours,
          bedtime: metrics.bedtime,
          wakeTime: metrics.wakeTime,
          sleepQuality: metrics.sleepQuality,
          energy: metrics.energy,
          mood: metrics.mood,
          topTrigger: metrics.topTrigger,
          breathSeconds: metrics.breathSeconds,
          symptoms: metrics.symptoms
        })
      });

      if (!res.ok) throw new Error('API error');
      const data: AdviceResponse = await res.json();
      setAdviceData(data);
    } catch {
      // Offline fallback heuristic advice
      let headline = 'Організм стабілізує нервову систему';
      let summary = `На ${daysFree}-й день відмови відновлюється рівень дофамінових рецепторів. `;
      const tips: string[] = [];
      let emergency: string | null = null;

      if (metrics.craving >= 4) {
        headline = 'Критична тяга: стабілізуйте дихання';
        summary += 'Гостра нікотинова тяга триває лише 3-5 хвилин і спадає хвилеподібно.';
        tips.push('Зробіть 5 глибоких циклів дихання: вдих 4с, видих 6с.');
        tips.push('Зробіть 15 швидких присідань для спалювання адреналіну.');
        tips.push('Випийте велику склянку холодної або теплої води.');
        emergency = 'Застосуйте протокол 4-7-8 прямо зараз!';
      } else if (metrics.water < metrics.waterNorm * 0.5) {
        headline = 'Дефіцит рідини: мозок сигналізує спрагу';
        summary += 'Густа кров уповільнює виведення токсинів та провокує спазми судин.';
        tips.push('Випийте 250-300 мл теплої води повільними ковтками.');
        tips.push('Додайте до раціону лимон або трав’яний чай.');
        tips.push('Зробіть 2 хвилини легких обертань плечима.');
      } else if (metrics.isDisruptedSleep) {
        headline = 'Циркадний зсув сну (засинання о ' + metrics.bedtime + ')';
        summary += 'Пізній сон підвищує ранковий кортизол і посилює потяг до стимуляторів.';
        tips.push('Уникайте кофеїну в другій половині дня.');
        tips.push('Почніть зсувати час відходу до сну на 15 хв раніше.');
        tips.push('Провітріть кімнату та зробіть коротку вечірню прогулянку.');
      } else {
        headline = 'Фізіологічні показники у нормі';
        summary += 'Кисневий обмін та тонус судин успішно регенерують.';
        tips.push('Підтримуйте регулярне пиття води протягом дня.');
        tips.push('Зробіть 10-хвилинну прогулянку на свіжому повітрі.');
        tips.push('Відзначте свій успіх у щоденнику вдячності.');
      }

      setAdviceData({
        headline,
        bodySummary: summary,
        quickTips: tips,
        emergencyAction: emergency,
        biologicalFocus: 'Очищення альвеол легень та вегетативна стабільність'
      });
    } finally {
      setIsLoading(false);
    }
  }, [daysFree, metrics]);

  useEffect(() => {
    if (isOpen) {
      fetchAnalysis();
    }
  }, [isOpen, fetchAnalysis]);

  // Quick Action: Add Water
  const handleAddWater = (ml: number) => {
    setWaterAdding(true);
    try {
      const key = `quit-smoking:hydration-${todayStr}`;
      const current = parseInt(localStorage.getItem(key) || '0', 10);
      const updated = current + ml;
      localStorage.setItem(key, String(updated));
      
      const savedLogs = localStorage.getItem('quit-smoking:health-custom-logs');
      const list = savedLogs ? JSON.parse(savedLogs) : [];
      list.unshift({
        id: Date.now().toString(),
        timestamp: Date.now(),
        dateStr: todayStr,
        timeStr: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
        category: 'hydration',
        title: 'Гідратація (Аналізатор)',
        details: `+${ml} мл (всього: ${updated} мл)`,
        value: `${updated}ml`
      });
      localStorage.setItem('quit-smoking:health-custom-logs', JSON.stringify(list.slice(0, 100)));

      window.dispatchEvent(new Event('hydration-updated'));
      window.dispatchEvent(new Event('storage'));
      setRefreshTrigger(prev => prev + 1);
      showToast(`+${ml} мл води додано! 💧`);
    } catch {}
    setTimeout(() => setWaterAdding(false), 300);
  };

  // Quick Action: Save Fluctuation (Коливання стану)
  const handleSaveFluctuation = () => {
    const finalCause = customFluctCause.trim() || fluctCause;
    const nowTime = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

    try {
      const savedDays = localStorage.getItem('quit-smoking:days');
      const map = savedDays ? JSON.parse(savedDays) : {};
      const existingDay = map[todayStr] || { surveys: [] };
      const currentSurveys = existingDay.surveys || existingDay.entries || [];

      const newEntry = {
        id: Date.now().toString(),
        time: nowTime,
        [fluctMetric]: fluctLevel,
        craving: fluctMetric === 'craving' ? fluctLevel : undefined,
        anxiety: fluctMetric === 'anxiety' ? fluctLevel : undefined,
        energy: fluctMetric === 'energy' ? fluctLevel : undefined,
        mood: fluctMetric === 'mood' ? fluctLevel : undefined,
        note: `[Аналізатор] Зміна: ${fluctMetric} (${fluctLevel}/5). Причина: ${finalCause}`.trim(),
        tags: [finalCause, fluctMetric]
      };

      existingDay.surveys = [...currentSurveys, newEntry];
      existingDay.entries = existingDay.surveys;
      if (fluctMetric === 'craving') existingDay.craving = fluctLevel;
      if (fluctMetric === 'mood') existingDay.mood = fluctLevel;

      map[todayStr] = existingDay;
      localStorage.setItem('quit-smoking:days', JSON.stringify(map));

      const savedLogs = localStorage.getItem('quit-smoking:health-custom-logs');
      const list = savedLogs ? JSON.parse(savedLogs) : [];
      list.unshift({
        id: Date.now().toString(),
        timestamp: Date.now(),
        dateStr: todayStr,
        timeStr: nowTime,
        category: 'trigger',
        title: `Коливання стану (${fluctMetric})`,
        details: `Рівень: ${fluctLevel}/5 | Тригер: "${finalCause}"`,
        value: `${fluctLevel}/5`
      });
      localStorage.setItem('quit-smoking:health-custom-logs', JSON.stringify(list.slice(0, 100)));

      window.dispatchEvent(new Event('storage'));
      setRefreshTrigger(prev => prev + 1);
      setCustomFluctCause('');
      showToast(`Коливання стану (${fluctMetric} ${fluctLevel}/5) зафіксовано! 🎯`);
      
      setTimeout(() => fetchAnalysis(), 500);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-fade-in overflow-x-hidden"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-[2.5rem] p-5 sm:p-6 text-left overflow-hidden border border-purple-500/30 shadow-[0_20px_60px_-15px_rgba(168,85,247,0.35)] transition-all duration-300 transform animate-scale-in bg-gradient-to-b from-[#161424]/95 via-[#0e0d17]/95 to-[#090810]/98 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Light Beam */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-purple-600/15" />

        {/* Feedback Toast */}
        {feedbackToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-purple-900/90 text-white text-xs font-bold rounded-xl border border-purple-400/40 shadow-xl backdrop-blur-md animate-fade-in">
            {feedbackToast}
          </div>
        )}

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 shadow-xs">
              <AnimatedAnalyzerIcon className="w-5 h-5" active={true} />
            </div>
            <div>
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    maxLength={22}
                    autoFocus
                    placeholder="Назва..."
                    className="px-2 py-0.5 text-sm font-bold bg-zinc-800 border border-purple-500/60 rounded-md text-white outline-none w-32 sm:w-44 focus:ring-1 focus:ring-purple-400"
                  />
                  <button 
                    type="submit" 
                    className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium cursor-pointer"
                  >
                    Зберегти
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditingName(false)} 
                    className="px-1.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <div 
                  className="flex items-center gap-1.5 group cursor-pointer" 
                  onClick={() => { setTempName(analyzerName); setIsEditingName(true); }}
                  title="Натисніть, щоб перейменувати Аналізатор"
                >
                  <h2 className="text-base font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
                    {analyzerName}
                  </h2>
                  <Edit3 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 opacity-70 group-hover:opacity-100 transition-all" />
                </div>
              )}
              <p className="text-[11px] text-zinc-400 font-medium">
                Показники організму • День {daysFree}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchAnalysis}
              disabled={isLoading}
              className={`p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer ${isLoading ? 'animate-spin opacity-50' : 'active:scale-95'}`}
              title="Оновити аналіз прямо зараз"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="Закрити"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher - Monolithic interactive switcher with drag & swipe */}
        <div className="relative z-10 my-3 shrink-0">
          <MonolithicSegmentedControl
            items={[
              { id: 'tips', label: 'Поради', icon: <Lightbulb className="w-3.5 h-3.5" /> },
              { id: 'fluctuations', label: 'Коливання', icon: <Sliders className="w-3.5 h-3.5" /> },
              { id: 'systems', label: 'Системи', icon: <Heart className="w-3.5 h-3.5" /> },
            ]}
            value={activeTab}
            onChange={(val) => setActiveTab(val as 'tips' | 'fluctuations' | 'systems')}
            size="md"
          />
        </div>

        {/* Modal Scrollable Body */}
        <div className="relative z-10 overflow-y-auto pr-1 flex-1 space-y-3.5">
          {/* Real-time mini metric tiles */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase text-zinc-400 mb-0.5">
                <Activity className="w-3 h-3 text-rose-400" />
                <span>Тяга</span>
              </div>
              <div className={`text-sm font-black font-mono ${metrics.craving >= 4 ? 'text-rose-400' : 'text-zinc-200'}`}>
                {metrics.craving}/5
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase text-zinc-400 mb-0.5">
                <Droplets className="w-3 h-3 text-sky-400" />
                <span>Вода</span>
              </div>
              <div className={`text-sm font-black font-mono ${metrics.water < metrics.waterNorm * 0.6 ? 'text-sky-400' : 'text-zinc-200'}`}>
                {metrics.water} <span className="text-[10px] font-normal text-zinc-400">мл</span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase text-zinc-400 mb-0.5">
                <Moon className="w-3 h-3 text-indigo-400" />
                <span>Сон</span>
              </div>
              <div className={`text-sm font-black font-mono ${metrics.isDisruptedSleep ? 'text-rose-400' : 'text-zinc-200'}`}>
                {metrics.sleepHours}г {metrics.isDisruptedSleep && '⚠️'}
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase text-zinc-400 mb-0.5">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Енергія</span>
              </div>
              <div className="text-sm font-black font-mono text-zinc-200">
                {metrics.energy}/5
              </div>
            </div>
          </div>

          {/* TAB 1: TIPS (ПОРАДИ) */}
          {activeTab === 'tips' && (
            <div className="space-y-3">
              {/* Emergency Banner if Craving is Critical */}
              {adviceData?.emergencyAction && (
                <div className="p-3.5 bg-rose-500/15 border border-rose-500/40 rounded-2xl flex items-start gap-3 text-rose-200 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-rose-300">
                      Екстрений протокол
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      {adviceData.emergencyAction}
                    </div>
                  </div>
                </div>
              )}

              {/* Main Status Card */}
              <div className="p-4 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent border border-purple-500/25 rounded-2xl space-y-2.5 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Аналіз фізіології прямо зараз
                  </span>
                  {adviceData?.biologicalFocus && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 truncate max-w-[200px]">
                      {adviceData.biologicalFocus}
                    </span>
                  )}
                </div>

                {isLoading ? (
                  <div className="py-6 flex flex-col items-center justify-center gap-2 text-zinc-400">
                    <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
                    <span className="text-xs font-medium">Аналізатор сканує біоритми та формує швидкі поради...</span>
                  </div>
                ) : (
                  <>
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {adviceData?.headline || "Нервова система поступово адаптується"}
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                      {adviceData?.bodySummary || "Фізіологічні бар'єри відновлюються, рівень кисню в крові стабільний."}
                    </p>
                  </>
                )}
              </div>

              {/* Quick Tips Section */}
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 px-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Швидкі поради на цю хвилину</span>
                </div>

                <div className="space-y-2">
                  {adviceData?.quickTips && adviceData.quickTips.length > 0 ? (
                    adviceData.quickTips.map((tip, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl flex items-start gap-3 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 text-xs font-black">
                          {idx + 1}
                        </div>
                        <p className="text-xs text-zinc-200 font-medium leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-white/[0.04] border border-white/10 rounded-2xl text-xs text-zinc-400">
                      Завантаження швидких рекомендацій...
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions Footer Buttons inside Tips Tab */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleAddWater(250)}
                  disabled={waterAdding}
                  className="py-2.5 px-3 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 rounded-xl text-sky-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <Droplets className="w-4 h-4 text-sky-400" />
                  <span>+250 мл води</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('fluctuations')}
                  className="py-2.5 px-3 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 rounded-xl text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span>Коливання</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FLUCTUATIONS (КОЛИВАННЯ) */}
          {activeTab === 'fluctuations' && (
            <div className="space-y-3.5">
              {/* Hydration quick adjuster */}
              <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4" />
                    Швидка гідратація
                  </span>
                  <span className="text-[10px] font-mono font-bold text-zinc-300">
                    {metrics.water} / {metrics.waterNorm} мл
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddWater(150)}
                    className="py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    +150 мл
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddWater(250)}
                    className="py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    +250 мл
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddWater(500)}
                    className="py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    +500 мл
                  </button>
                </div>
              </div>

              {/* State Fluctuations Tool */}
              <div className="p-3.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" />
                    Зафіксувати коливання стану
                  </span>
                  <span className="text-[10px] text-zinc-400">Впливає на поради</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Параметр
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'craving', label: 'Тяга' },
                        { id: 'energy', label: 'Енергія' },
                        { id: 'mood', label: 'Настрій' },
                        { id: 'anxiety', label: 'Тривога' }
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setFluctMetric(m.id as any)}
                          className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            fluctMetric === m.id
                              ? 'bg-purple-600 border-purple-500 text-white shadow-xs'
                              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Рівень ({fluctLevel}/5)
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setFluctLevel(lvl)}
                          className={`py-1.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                            fluctLevel === lvl
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Що спровокувало?
                    </label>
                    <div className="grid grid-cols-4 gap-1 mb-1.5">
                      {['Кава', 'Їжа', 'Стрес', 'Втома'].map((cause) => (
                        <button
                          key={cause}
                          type="button"
                          onClick={() => {
                            setFluctCause(cause);
                            setCustomFluctCause('');
                          }}
                          className={`py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            fluctCause === cause && !customFluctCause
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {cause}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Або вкажіть іншу причину..."
                      value={customFluctCause}
                      onChange={(e) => setCustomFluctCause(e.target.value)}
                      className="w-full text-xs p-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveFluctuation}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Зберегти коливання</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BODY SYSTEMS RECOVERY */}
          {activeTab === 'systems' && (
            <div className="space-y-3">
              <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center justify-between px-1">
                <span>Прогрес регенерації ключових систем</span>
                <span className="text-purple-400">День {daysFree}</span>
              </div>

              <div className="space-y-2">
                {systems.map((sys) => {
                  const pct = Math.min(100, Math.round(sys.progress));
                  return (
                    <div key={sys.name} className="p-3 bg-white/[0.04] border border-white/10 rounded-2xl space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>{sys.name}</span>
                        <span className="font-mono text-purple-400">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-500" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">
                        {sys.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {onOpenHealthTab && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenHealthTab();
                  }}
                  className="w-full py-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-2xl text-xs font-bold text-zinc-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Відкрити повний розділ Здоров'я</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between shrink-0 text-[10px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Аналіз зрізів та біоритмів організму</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all cursor-pointer"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};
