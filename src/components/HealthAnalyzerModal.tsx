import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sparkles, 
  Droplets, 
  Moon, 
  Brain, 
  Zap, 
  Check, 
  RefreshCw, 
  Sliders, 
  AlertTriangle, 
  Flame, 
  ShieldCheck, 
  Edit3,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { MonoRefractedDropletsIcon } from './MonoRefractedSosIcons';

interface HealthAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  diffMs?: number;
  onOpenHealthTab?: () => void;
  onOpenQuickMechanics?: () => void;
}

interface AdviceResponse {
  headline: string;
  statusLevel?: 'optimal' | 'recovering' | 'warning' | 'critical';
  healthScore?: number;
  bodySummary: string;
  immediateAction?: string;
  quickTips: string[];
  emergencyAction?: string | null;
  biologicalFocus?: string;
  neuroBiologicalInsight?: string;
  personalizedAffirmation?: string;
  isLiveAi?: boolean;
}

export const HealthAnalyzerModal: React.FC<HealthAnalyzerModalProps> = ({
  isOpen,
  onClose,
  diffMs = 0,
  onOpenQuickMechanics
}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [focusMode, setFocusMode] = useState<'general' | 'urgent_craving' | 'hydration_detox' | 'sleep_recovery' | 'lungs_breathing'>('general');
  const [waterAdding, setWaterAdding] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [showExpressSlice, setShowExpressSlice] = useState(false);

  // Cached advice initial state for instant load
  const [adviceData, setAdviceData] = useState<AdviceResponse | null>(() => {
    try {
      const cached = localStorage.getItem('quit-smoking:cached-ai-advice');
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  });

  // Quick Slice adjusters
  const [quickCraving, setQuickCraving] = useState<number>(2);
  const [quickAnxiety, setQuickAnxiety] = useState<number>(2);
  const [quickCalmness, setQuickCalmness] = useState<number>(3);
  const [quickEnergy, setQuickEnergy] = useState<number>(3);
  const [quickNote, setQuickNote] = useState<string>('');

  // Custom Analyzer Name
  const [analyzerName, setAnalyzerName] = useState<string>(() => {
    try {
      const s = localStorage.getItem('quit-smoking:analyzer-name');
      if (s && s.trim()) return s.trim();
    } catch {}
    return 'ШІ-Аналіз стану';
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
          setAnalyzerName((s && s.trim()) ? s.trim() : 'ШІ-Аналіз стану');
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
    const finalName = tempName.trim() || 'ШІ-Аналіз стану';
    setAnalyzerName(finalName);
    setIsEditingName(false);
    try {
      localStorage.setItem('quit-smoking:analyzer-name', finalName);
      window.dispatchEvent(new CustomEvent('analyzer-name-changed', { detail: finalName }));
      window.dispatchEvent(new Event('storage'));
      showToast(`Назву збережено: «${finalName}»`);
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

  const daysFree = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  // Load Real-time telemetry from Quick Mechanics
  const telemetry = useMemo(() => {
    let age: number | null = null;
    let weight = 70;
    let height: number | null = null;
    let gender = 'не вказано';

    let sleepHours = 7.5;
    let bedtime = '23:00';
    let wakeTime = '07:30';
    let sleepQuality = 4;

    let water = 0;
    let drinksSummary = '';

    let craving = 2;
    let thoughts = 2;
    let anxiety = 2;
    let irritability = 2;
    let calmness = 3;
    let energy = 3;
    let focus = 3;
    let overall = 3;
    let sliceFluctuation = 'стабільний';
    let sliceNote = '';
    let sliceTime = '';

    let topTrigger = 'Кава';
    let recentTriggerShiftsCount = 0;
    let breathSeconds = 0;

    try {
      const savedAge = localStorage.getItem('quit-smoking:physio-age');
      if (savedAge) age = parseInt(savedAge, 10);

      const savedWeight = localStorage.getItem('quit-smoking:physio-weight');
      if (savedWeight) weight = parseFloat(savedWeight) || 70;

      const savedHeight = localStorage.getItem('quit-smoking:physio-height');
      if (savedHeight) height = parseInt(savedHeight, 10);

      const savedGender = localStorage.getItem('quit-smoking:physio-gender');
      if (savedGender) gender = savedGender;

      const savedBedtime = localStorage.getItem('quit-smoking:sleep-bedtime');
      if (savedBedtime) bedtime = savedBedtime;

      const savedWake = localStorage.getItem('quit-smoking:sleep-waketime');
      if (savedWake) wakeTime = savedWake;

      const savedQuality = localStorage.getItem('quit-smoking:sleep-quality');
      if (savedQuality) {
        if (savedQuality === 'good') sleepQuality = 5;
        else if (savedQuality === 'normal') sleepQuality = 3;
        else if (savedQuality === 'bad') sleepQuality = 2;
        else sleepQuality = Number(savedQuality) || 4;
      }

      try {
        const [bh, bm] = bedtime.split(':').map(Number);
        const [wh, wm] = wakeTime.split(':').map(Number);
        if (!isNaN(bh) && !isNaN(wh)) {
          let bMinutes = bh * 60 + (bm || 0);
          let wMinutes = wh * 60 + (wm || 0);
          if (wMinutes < bMinutes) wMinutes += 24 * 60;
          sleepHours = Math.round(((wMinutes - bMinutes) / 60) * 10) / 10;
        }
      } catch {}

      const savedWater = localStorage.getItem(`quit-smoking:hydration-${todayStr}`);
      if (savedWater) water = parseInt(savedWater, 10) || 0;

      const savedHealthQuick = localStorage.getItem('quit-smoking:health-quick-history');
      if (savedHealthQuick) {
        const hList = JSON.parse(savedHealthQuick);
        if (Array.isArray(hList)) {
          const todayDrinks = hList.filter((item: any) => {
            const itemDate = new Date(item.timestamp || Date.now()).toISOString().split('T')[0];
            return itemDate === todayStr;
          });
          if (todayDrinks.length > 0) {
            drinksSummary = todayDrinks.map((d: any) => `${d.title || d.detail} (${d.timeStr || ''})`).join(', ');
          }
        }
      }

      const savedLatestSlice = localStorage.getItem('quit-smoking:latest-slice');
      if (savedLatestSlice) {
        const sl = JSON.parse(savedLatestSlice);
        if (typeof sl.craving === 'number') craving = sl.craving;
        if (typeof sl.thoughts === 'number') thoughts = sl.thoughts;
        if (typeof sl.anxiety === 'number') anxiety = sl.anxiety;
        if (typeof sl.irritability === 'number') irritability = sl.irritability;
        if (typeof sl.calmness === 'number') calmness = sl.calmness;
        if (typeof sl.energy === 'number') energy = sl.energy;
        if (typeof sl.focus === 'number') focus = sl.focus;
        if (typeof sl.overall === 'number') overall = sl.overall;
        if (sl.fluctuation) sliceFluctuation = sl.fluctuation;
        if (sl.note) sliceNote = sl.note;
        if (sl.time) sliceTime = sl.time;
      }

      const savedUserTriggers = localStorage.getItem('quit-smoking:custom-user-triggers');
      if (savedUserTriggers) {
        const uList = JSON.parse(savedUserTriggers);
        if (Array.isArray(uList) && uList.length > 0) {
          topTrigger = uList[0];
        }
      }

      const savedShifts = localStorage.getItem('quit-smoking:trigger-shifts');
      if (savedShifts) {
        const sList = JSON.parse(savedShifts);
        if (Array.isArray(sList) && sList.length > 0 && sList[0].trigger) {
          topTrigger = sList[0].trigger;
          recentTriggerShiftsCount = sList.length;
        }
      }

      const savedLung = localStorage.getItem('quit-smoking:last-lung-test-seconds');
      if (savedLung) {
        breathSeconds = parseInt(savedLung, 10) || 0;
      }
    } catch (e) {
      console.error('Error reading telemetry:', e);
    }

    const waterGoal = Math.round(weight * 33);
    const hydrationPct = waterGoal > 0 ? Math.min(100, Math.round((water / waterGoal) * 100)) : 0;

    return {
      age,
      weight,
      height,
      gender,
      sleepHours,
      bedtime,
      wakeTime,
      sleepQuality,
      water,
      waterGoal,
      hydrationPct,
      drinksSummary,
      craving,
      thoughts,
      anxiety,
      irritability,
      calmness,
      energy,
      focus,
      overall,
      sliceFluctuation,
      sliceNote,
      sliceTime,
      topTrigger,
      recentTriggerShiftsCount,
      breathSeconds
    };
  }, [todayStr, refreshTrigger]);

  useEffect(() => {
    setQuickCraving(telemetry.craving);
    setQuickAnxiety(telemetry.anxiety);
    setQuickCalmness(telemetry.calmness);
    setQuickEnergy(telemetry.energy);
    setQuickNote(telemetry.sliceNote || '');
  }, [telemetry]);

  // Request Live Analysis to Gemini AI
  const fetchAnalysis = useCallback(async (modeOverride?: typeof focusMode) => {
    setIsLoading(true);
    const currentMode = modeOverride || focusMode;
    try {
      const res = await fetch('/api/analyzer/live-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diffDays: daysFree,
          physical: {
            age: telemetry.age,
            weight: telemetry.weight,
            height: telemetry.height,
            gender: telemetry.gender,
          },
          sleep: {
            bedtime: telemetry.bedtime,
            wakeTime: telemetry.wakeTime,
            sleepHours: telemetry.sleepHours,
            sleepQuality: telemetry.sleepQuality,
          },
          hydration: {
            todayWater: telemetry.water,
            waterGoal: telemetry.waterGoal,
            hydrationPct: telemetry.hydrationPct,
            drinksSummary: telemetry.drinksSummary,
          },
          slice: {
            craving: telemetry.craving,
            thoughts: telemetry.thoughts,
            anxiety: telemetry.anxiety,
            irritability: telemetry.irritability,
            calmness: telemetry.calmness,
            energy: telemetry.energy,
            focus: telemetry.focus,
            overall: telemetry.overall,
            fluctuation: telemetry.sliceFluctuation,
            note: telemetry.sliceNote,
            timeStr: telemetry.sliceTime,
          },
          triggers: {
            topTrigger: telemetry.topTrigger,
            recentShiftsCount: telemetry.recentTriggerShiftsCount,
          },
          lungs: {
            breathSeconds: telemetry.breathSeconds,
          },
          focusMode: currentMode
        })
      });

      if (!res.ok) throw new Error('API response not ok');
      const data: AdviceResponse = await res.json();
      setAdviceData(data);
      try {
        localStorage.setItem('quit-smoking:cached-ai-advice', JSON.stringify(data));
      } catch {}
    } catch (err) {
      console.warn('Fallback analysis applied:', err);
      const isUrgent = telemetry.craving >= 4 || telemetry.anxiety >= 4;
      const isLowWater = telemetry.hydrationPct < 50;

      const fallback: AdviceResponse = {
        headline: isUrgent 
          ? 'Пікова тяга: потрібна стабілізація' 
          : isLowWater 
          ? 'Зневоднення посилює тягу' 
          : 'Біоритми та детоксикація у нормі',
        statusLevel: isUrgent ? 'warning' : isLowWater ? 'recovering' : 'optimal',
        healthScore: Math.max(35, Math.min(95, Math.round(100 - (telemetry.craving * 10) - (telemetry.anxiety * 8) + (telemetry.calmness * 6) + (telemetry.energy * 4)))),
        bodySummary: `Організм на ${daysFree}-му дні відновлення. Рівень тяги ${telemetry.craving}/5, рівень спокою ${telemetry.calmness}/5. Сон тривав ${telemetry.sleepHours} год, випито ${telemetry.water} мл (${telemetry.hydrationPct}% норми).`,
        immediateAction: isUrgent 
          ? 'Зробіть 5 глибоких циклів дихання (вдих 4 сек, довгий видих 6 сек) та випийте 200 мл води.'
          : 'Випийте склянку теплої води повільними ковтками та зробіть 2 хвилини розминки плечей.',
        quickTips: [
          'Випийте 250 мл води для прискорення виведення токсинів нирками.',
          telemetry.sleepHours < 7 ? 'Сон був коротким (<7 год): рівень кортизолу підвищений, уникайте кофеїну після 14:00.' : 'Нічний відпочинок ефективно підтримує баланс дофаміну.',
          `При тригері «${telemetry.topTrigger}» замініть звичку на склянку холодної води або жуйку з ментолом.`
        ],
        emergencyAction: isUrgent ? 'Вмийте обличчя крижаною водою на 10 секунд (стимуляція блукаючого нерва).' : null,
        biologicalFocus: 'Нікотинові ацетилхолінові рецептори та очищення альвеол легень',
        neuroBiologicalInsight: 'Хвиля тяги має фізіологічний пік до 3-5 хвилин і спадає природним шляхом.',
        personalizedAffirmation: 'Кожна подолана хвилина зміцнює нові нейронні зв\'язки свободи від залежності.',
        isLiveAi: false
      };
      setAdviceData(fallback);
      try {
        localStorage.setItem('quit-smoking:cached-ai-advice', JSON.stringify(fallback));
      } catch {}
    } finally {
      setIsLoading(false);
    }
  }, [daysFree, telemetry, focusMode]);

  // Sync listener
  useEffect(() => {
    const handleRealtimeUpdate = () => {
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('storage', handleRealtimeUpdate);
    window.addEventListener('slice-saved', handleRealtimeUpdate);
    window.addEventListener('hydration-updated', handleRealtimeUpdate);
    window.addEventListener('sleep-updated', handleRealtimeUpdate);
    window.addEventListener('trigger-shift-added', handleRealtimeUpdate);
    window.addEventListener('health-quick-history-updated', handleRealtimeUpdate);
    window.addEventListener('quick-mechanics-updated', handleRealtimeUpdate);

    return () => {
      window.removeEventListener('storage', handleRealtimeUpdate);
      window.removeEventListener('slice-saved', handleRealtimeUpdate);
      window.removeEventListener('hydration-updated', handleRealtimeUpdate);
      window.removeEventListener('sleep-updated', handleRealtimeUpdate);
      window.removeEventListener('trigger-shift-added', handleRealtimeUpdate);
      window.removeEventListener('health-quick-history-updated', handleRealtimeUpdate);
      window.removeEventListener('quick-mechanics-updated', handleRealtimeUpdate);
    };
  }, []);

  // Fetch when opened
  useEffect(() => {
    if (isOpen) {
      fetchAnalysis();
    }
  }, [isOpen, refreshTrigger]);

  // Quick Action: Add Water
  const handleAddWater = (ml: number) => {
    setWaterAdding(true);
    try {
      const key = `quit-smoking:hydration-${todayStr}`;
      const current = parseInt(localStorage.getItem(key) || '0', 10);
      const updated = current + ml;
      localStorage.setItem(key, String(updated));
      
      const savedLogs = localStorage.getItem('quit-smoking:health-quick-history');
      const list = savedLogs ? JSON.parse(savedLogs) : [];
      const timeStr = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
      list.unshift({
        id: Date.now().toString(),
        timestamp: Date.now(),
        dateStr: todayStr,
        timeStr,
        category: 'hydration',
        title: 'Вода (ШІ-Аналіз)',
        detail: `+${ml} мл (разом: ${updated} мл)`,
        value: `${updated}ml`
      });
      localStorage.setItem('quit-smoking:health-quick-history', JSON.stringify(list.slice(0, 100)));

      window.dispatchEvent(new Event('hydration-updated'));
      window.dispatchEvent(new Event('storage'));
      setRefreshTrigger(prev => prev + 1);
      showToast(`+${ml} мл води додано! 💧`);
    } catch {}
    setTimeout(() => setWaterAdding(false), 300);
  };

  // Express Slice save
  const handleSaveExpressSlice = () => {
    try {
      const now = Date.now();
      const timeStr = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
      
      const record = {
        id: now,
        date: todayStr,
        time: timeStr,
        craving: quickCraving,
        thoughts: telemetry.thoughts,
        anxiety: quickAnxiety,
        irritability: telemetry.irritability,
        calmness: quickCalmness,
        energy: quickEnergy,
        focus: telemetry.focus,
        overall: Math.round((quickCalmness + quickEnergy + (6 - quickCraving)) / 3),
        fluctuation: quickCraving >= 4 ? 'гостра тяга' : quickCalmness >= 4 ? 'спокій' : 'стабільний',
        note: quickNote.trim() || undefined
      };

      localStorage.setItem('quit-smoking:latest-slice', JSON.stringify(record));

      const raw = localStorage.getItem('quit-smoking:health-slices');
      const list = raw ? JSON.parse(raw) : [];
      list.push(record);
      localStorage.setItem('quit-smoking:health-slices', JSON.stringify(list.slice(-100)));

      window.dispatchEvent(new Event('slice-saved'));
      window.dispatchEvent(new Event('quick-mechanics-updated'));
      window.dispatchEvent(new Event('storage'));
      
      showToast('Зріз оновлено! ШІ перераховує аналіз... ✨');
      setShowExpressSlice(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (e) {
      console.error('Error saving express slice:', e);
    }
  };

  if (!isOpen) return null;

  const statusColor = adviceData?.statusLevel === 'critical'
    ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
    : adviceData?.statusLevel === 'warning'
    ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
    : adviceData?.statusLevel === 'optimal'
    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
    : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300';

  return createPortal(
    <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-left z-10">
        
        {/* Toast */}
        {feedbackToast && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 bg-purple-900/95 text-white text-xs font-bold rounded-xl border border-purple-400/50 shadow-2xl backdrop-blur-md flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* HEADER */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-800/80 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-4.5 h-4.5 text-purple-300" />
            </div>

            <div className="min-w-0">
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    maxLength={25}
                    autoFocus
                    className="px-2 py-0.5 text-xs font-bold bg-zinc-800 border border-purple-500/60 rounded-md text-white outline-none w-36"
                  />
                  <button type="submit" className="px-2 py-0.5 rounded bg-purple-600 text-white text-[11px] font-bold">OK</button>
                  <button type="button" onClick={() => setIsEditingName(false)} className="px-1.5 py-0.5 text-zinc-400 text-[11px]">✕</button>
                </form>
              ) : (
                <div 
                  className="flex items-center gap-1.5 group cursor-pointer"
                  onClick={() => { setTempName(analyzerName); setIsEditingName(true); }}
                  title="Натисніть для зміни назви"
                >
                  <h2 className="text-sm sm:text-base font-black text-white truncate tracking-wide">
                    {analyzerName}
                  </h2>
                  <Edit3 className="w-3 h-3 text-zinc-500 group-hover:text-purple-400 shrink-0" />
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Gemini 3.8
                  </span>
                </div>
              )}
              <div className="text-[11px] font-medium text-zinc-400 mt-0.5">
                День {daysFree} без куріння
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fetchAnalysis()}
              disabled={isLoading}
              className={`p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer ${
                isLoading ? 'opacity-50' : 'active:scale-95'
              }`}
              title="Оновити аналіз"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-purple-400' : ''}`} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="Закрити"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* UNIFIED SINGLE PAGE BODY */}
        <div className="overflow-y-auto pr-0.5 pt-3 space-y-3 flex-1 text-left">
          
          {/* COMPACT REAL-TIME METRICS STRIP */}
          <div className="grid grid-cols-4 gap-1.5 select-none">
            {/* Вода */}
            <div 
              onClick={() => handleAddWater(250)}
              className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800/80 hover:border-cyan-500/40 cursor-pointer active:scale-95 transition-all text-center"
              title="Натисніть: +250 мл води"
            >
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-cyan-400">
                <Droplets className="w-3 h-3 text-cyan-400" />
                <span>Вода</span>
              </div>
              <div className="text-xs sm:text-sm font-black font-mono text-zinc-100 mt-0.5">
                {telemetry.water} <span className="text-[9px] font-normal text-zinc-400">мл</span>
              </div>
              <div className="text-[9px] font-bold text-cyan-300/80">
                {telemetry.hydrationPct}%
              </div>
            </div>

            {/* Сон */}
            <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-indigo-400">
                <Moon className="w-3 h-3 text-indigo-400" />
                <span>Сон</span>
              </div>
              <div className="text-xs sm:text-sm font-black font-mono text-zinc-100 mt-0.5">
                {telemetry.sleepHours} <span className="text-[9px] font-normal text-zinc-400">год</span>
              </div>
              <div className="text-[9px] font-medium text-zinc-400 truncate">
                {telemetry.sleepQuality}/5 якість
              </div>
            </div>

            {/* Тяга */}
            <div 
              onClick={() => setShowExpressSlice(prev => !prev)}
              className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800/80 hover:border-amber-500/40 cursor-pointer active:scale-95 transition-all text-center"
              title="Натисніть для оновлення зрізу"
            >
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-amber-400">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>Тяга</span>
              </div>
              <div className={`text-xs sm:text-sm font-black font-mono mt-0.5 ${telemetry.craving >= 4 ? 'text-amber-400 animate-pulse' : 'text-zinc-100'}`}>
                {telemetry.craving}/5
              </div>
              <div className="text-[9px] font-bold text-amber-300/80 underline decoration-dotted">
                Зріз ✏️
              </div>
            </div>

            {/* Спокій */}
            <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-teal-400">
                <ShieldCheck className="w-3 h-3 text-teal-400" />
                <span>Спокій</span>
              </div>
              <div className="text-xs sm:text-sm font-black font-mono text-teal-300 mt-0.5">
                {telemetry.calmness}/5
              </div>
              <div className="text-[9px] font-medium text-zinc-400 truncate">
                {telemetry.topTrigger}
              </div>
            </div>
          </div>

          {/* INLINE EXPRESS SLICE FORM (Expands when needed) */}
          {showExpressSlice && (
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-purple-500/40 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  <span>Швидкий зріз відчуттів</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowExpressSlice(false)}
                  className="text-zinc-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-zinc-300 mb-1">
                    <span>Тяга:</span>
                    <span className="font-mono text-amber-400">{quickCraving}/5</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={quickCraving}
                    onChange={(e) => setQuickCraving(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-bold text-zinc-300 mb-1">
                    <span>Тривога:</span>
                    <span className="font-mono text-rose-400">{quickAnxiety}/5</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={quickAnxiety}
                    onChange={(e) => setQuickAnxiety(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-bold text-zinc-300 mb-1">
                    <span>Спокій:</span>
                    <span className="font-mono text-teal-400">{quickCalmness}/5</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={quickCalmness}
                    onChange={(e) => setQuickCalmness(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-bold text-zinc-300 mb-1">
                    <span>Енергія:</span>
                    <span className="font-mono text-emerald-400">{quickEnergy}/5</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={quickEnergy}
                    onChange={(e) => setQuickEnergy(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveExpressSlice}
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Оновити аналіз</span>
              </button>
            </div>
          )}

          {/* FOCUS MODES FILTER PILLS */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'general', label: 'Всі дані', icon: '⚡' },
              { id: 'urgent_craving', label: 'Гостра тяга', icon: '🔥' },
              { id: 'hydration_detox', label: 'Детокс & Вода', icon: '💧' },
              { id: 'sleep_recovery', label: 'Сон & Біоритми', icon: '🌙' },
              { id: 'lungs_breathing', label: 'Легені & Дихання', icon: '🫁' },
            ].map(item => {
              const isActive = focusMode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFocusMode(item.id as any);
                    fetchAnalysis(item.id as any);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* EMERGENCY PROTOCOL (Visible when needed) */}
          {adviceData?.emergencyAction && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-500/50 rounded-2xl flex items-start gap-3 text-rose-100 shadow-lg">
              <div className="p-1.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 shrink-0">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-wider text-rose-300">
                  Екстрена допомога
                </div>
                <div className="text-xs font-bold text-white mt-0.5 leading-snug">
                  {adviceData.emergencyAction}
                </div>
              </div>
            </div>
          )}

          {/* MAIN AI DIAGNOSTIC CARD */}
          <div className={`p-4 rounded-2xl space-y-2 border shadow-lg ${statusColor}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 opacity-90">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>Статус організму</span>
              </div>
              {adviceData?.biologicalFocus && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/10 border border-white/15 truncate max-w-[200px]">
                  🧬 {adviceData.biologicalFocus}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="py-6 flex flex-col items-center justify-center gap-2 text-zinc-300">
                <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
                <span className="text-xs font-medium">ШІ аналізує показники...</span>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                    {adviceData?.headline || "Стан нервової системи стабілізується"}
                  </h3>
                  {typeof adviceData?.healthScore === 'number' && (
                    <div className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/20 shrink-0 text-center">
                      <span className="text-xs font-black font-mono text-white">{adviceData.healthScore}%</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed font-normal">
                  {adviceData?.bodySummary || "Фізіологічні бар'єри відновлюються, водний баланс та кисневий обмін у межах норми."}
                </p>
              </>
            )}
          </div>

          {/* IMMEDIATE MICRO-ACTION (2 min) */}
          {adviceData?.immediateAction && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-2.5">
              <div className="p-1 rounded-md bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                  Дія прямо зараз (2 хв):
                </div>
                <p className="text-xs font-bold text-zinc-100 mt-0.5 leading-snug">
                  {adviceData.immediateAction}
                </p>
              </div>
            </div>
          )}

          {/* AI RECOMMENDATIONS */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 px-0.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Рекомендації ШІ</span>
            </div>

            <div className="space-y-1.5">
              {adviceData?.quickTips && adviceData.quickTips.length > 0 ? (
                adviceData.quickTips.map((tip, idx) => (
                  <div 
                    key={idx} 
                    className="p-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl flex items-start gap-2.5"
                  >
                    <div className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 text-[10px] font-black">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-zinc-200 font-medium leading-relaxed">
                      {tip}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-400">
                  Завантаження рекомендацій...
                </div>
              )}
            </div>
          </div>

          {/* NEUROBIOLOGICAL INSIGHT */}
          {adviceData?.neuroBiologicalInsight && (
            <div className="p-3 bg-indigo-950/25 border border-indigo-500/20 rounded-2xl space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                <span>Нейробіологія стану</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {adviceData.neuroBiologicalInsight}
              </p>
            </div>
          )}

          {/* PERSONALIZED AFFIRMATION */}
          {adviceData?.personalizedAffirmation && (
            <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-center">
              <p className="text-xs font-semibold text-emerald-300 italic">
                «{adviceData.personalizedAffirmation}»
              </p>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="pt-1 pb-1 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleAddWater(250)}
              disabled={waterAdding}
              className="py-2.5 px-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <MonoRefractedDropletsIcon className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>+250 мл води</span>
            </button>
            <button
              type="button"
              onClick={() => setShowExpressSlice(prev => !prev)}
              className="py-2.5 px-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Sliders className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{showExpressSlice ? 'Сховати зріз' : 'Швидкий зріз'}</span>
            </button>
          </div>

          {/* Direct Link to Quick Mechanics */}
          {onOpenQuickMechanics && (
            <div className="pt-0.5 pb-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQuickMechanics();
                }}
                className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 font-bold text-xs flex items-center justify-between transition-all cursor-pointer"
              >
                <span>Детальний журнал сну, води та тригерів</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
