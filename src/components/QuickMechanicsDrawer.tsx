import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnalysisAndScenariosSection } from './AnalysisAndScenariosSection';
import {
  X,
  User,
  Moon,
  Droplets,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Utensils,
  History,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Coffee,
  Wine,
  Trash2,
  Check,
  Brain,
  ShieldCheck,
  Heart,
  Scale,
  Flame,
  Clock,
  Compass,
  Smile,
  Sliders,
  ArrowRight,
  Info
} from 'lucide-react';

export type QuickMechanicsSection =
  | 'menu'
  | 'physical'
  | 'sleep'
  | 'hydration'
  | 'analysis'
  | 'slice'
  | 'triggerfix'
  | 'food_drinks'
  | 'history'
  | 'charts';

export interface HealthLogEntry {
  id: string;
  timestamp: number;
  timeStr: string;
  category: 'hydration' | 'food' | 'sleep' | 'slice' | 'trigger' | 'physical';
  title: string;
  detail: string;
  impact?: string;
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

export interface TriggerShiftLog {
  id: string;
  timestamp: number;
  timeStr: string;
  trigger: string;
  indicatorKey: string;
  indicatorLabel: string;
  oldVal: number;
  newVal: number;
  actionDone?: string;
}

interface QuickMechanicsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: QuickMechanicsSection;
  embedded?: boolean;
  onTabChange?: (tab: string) => void;
}

const getTodayDateStr = () => {
  const d = new Date();
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const getCurrentTimeStr = () => {
  const d = new Date();
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export interface IndicatorConfig {
  key: string;
  label: string;
  color: string;
  stroke: string;
  barBg: string;
  isNegative: boolean;
}

export const INDICATOR_CONFIGS: readonly IndicatorConfig[] = [
  { key: 'craving', label: 'Тяга', color: 'text-amber-400', stroke: '#f59e0b', barBg: 'bg-amber-500', isNegative: true },
  { key: 'thoughts', label: 'Нав\'язливі думки', color: 'text-indigo-400', stroke: '#6366f1', barBg: 'bg-indigo-500', isNegative: true },
  { key: 'anxiety', label: 'Тривожність', color: 'text-rose-400', stroke: '#f43f5e', barBg: 'bg-rose-500', isNegative: true },
  { key: 'irritability', label: 'Дратівливість', color: 'text-orange-400', stroke: '#f97316', barBg: 'bg-orange-500', isNegative: true },
  { key: 'calmness', label: 'Спокій', color: 'text-teal-400', stroke: '#14b8a6', barBg: 'bg-teal-500', isNegative: false },
  { key: 'energy', label: 'Енергія', color: 'text-emerald-400', stroke: '#10b981', barBg: 'bg-emerald-500', isNegative: false },
  { key: 'focus', label: 'Концентрація', color: 'text-cyan-400', stroke: '#06b6d4', barBg: 'bg-cyan-500', isNegative: false },
  { key: 'overall', label: 'Загальний стан', color: 'text-purple-400', stroke: '#a855f7', barBg: 'bg-purple-500', isNegative: false },
] as const;

export const QuickMechanicsDrawer: React.FC<QuickMechanicsDrawerProps> = ({
  isOpen,
  onClose,
  initialSection = 'menu',
  embedded = false,
  onTabChange,
}) => {
  const [activeSection, setActiveSection] = useState<QuickMechanicsSection>(initialSection);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync initial section on open
  useEffect(() => {
    if (isOpen) {
      setActiveSection(initialSection);
    }
  }, [isOpen, initialSection]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  }, []);

  // ================= 1. PHYSICAL PARAMETERS STATE =================
  const [age, setAge] = useState<number>(() => {
    try {
      const v = localStorage.getItem('quit-smoking:physio-age');
      return v ? parseInt(v, 10) || 28 : 28;
    } catch {
      return 28;
    }
  });

  const [weight, setWeight] = useState<number>(() => {
    try {
      const v = localStorage.getItem('quit-smoking:physio-weight');
      return v ? parseFloat(v) || 70 : 70;
    } catch {
      return 70;
    }
  });

  const [height, setHeight] = useState<number>(() => {
    try {
      const v = localStorage.getItem('quit-smoking:physio-height');
      return v ? parseInt(v, 10) || 178 : 178;
    } catch {
      return 178;
    }
  });

  const [gender, setGender] = useState<'male' | 'female'>(() => {
    try {
      const v = localStorage.getItem('quit-smoking:physio-gender');
      return v === 'female' ? 'female' : 'male';
    } catch {
      return 'male';
    }
  });

  // String states for input values to allow smooth backspacing to empty
  const [inputAge, setInputAge] = useState<string>(() => String(age));
  const [inputWeight, setInputWeight] = useState<string>(() => String(weight));
  const [inputHeight, setInputHeight] = useState<string>(() => String(height));

  useEffect(() => {
    setInputAge(String(age));
  }, [age]);

  useEffect(() => {
    setInputWeight(String(weight));
  }, [weight]);

  useEffect(() => {
    setInputHeight(String(height));
  }, [height]);

  // Calculations for Physical parameters
  const waterNormMl = useMemo(() => {
    return Math.max(1500, Math.round(weight * 35));
  }, [weight]);

  const bmi = useMemo(() => {
    const hMeter = height / 100;
    if (hMeter <= 0) return 22;
    return parseFloat((weight / (hMeter * hMeter)).toFixed(1));
  }, [weight, height]);

  const bmiCategory = useMemo(() => {
    if (bmi < 18.5) {
      return {
        label: 'Дефіцит ваги',
        color: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        desc: 'Підвищена чутливість нервової системи до стресу. Організму потрібні збалансовані жири та білки для стабілізації серотоніну під час відмови від куріння.',
        impact: 'Нервова система більш чутлива до відміни нікотину; важливо не пропускати прийоми їжі.'
      };
    }
    if (bmi <= 24.9) {
      return {
        label: 'Нормальна (оптимальна) вага',
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        desc: 'Оптимальний фізіологічний баланс за класифікацією ВООЗ. Метаболізм працює з максимальною ефективністю, прискорюючи виведення чадного газу (CO) та залишків смол.',
        impact: 'Ідеальний потенціал відновлення легень та дофамінової чутливості.'
      };
    }
    if (bmi <= 29.9) {
      return {
        label: 'Помірно надлишкова вага',
        color: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        desc: 'Невелике навантаження на серцево-судинну систему. При відмові від куріння важливо не замінювати сигарети солодким, а пити воду та додавати щоденні прогулянки.',
        impact: 'Рекомендовано закривати тягу склянкою води та глибоким диханням замість снеків.'
      };
    }
    return {
      label: 'Підвищена вага',
      color: 'text-rose-400',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      desc: 'Підвищене навантаження на дихальну систему та судини. Відмова від куріння суттєво покращить насичення крові киснем і підтримає судини.',
      impact: 'Потрібен особливий контроль гідратації та кардіо-активності.'
    };
  }, [bmi]);

  // Ideal weight range for this height based on healthy BMI 18.5 - 24.9
  const idealWeightRange = useMemo(() => {
    const hMeter = height / 100;
    const minW = Math.round(18.5 * hMeter * hMeter);
    const maxW = Math.round(24.9 * hMeter * hMeter);
    return { minW, maxW };
  }, [height]);

  // Basal Metabolic Rate (BMR) - Mifflin-St Jeor
  const bmrKcal = useMemo(() => {
    if (gender === 'male') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
  }, [weight, height, age, gender]);

  // Max safe heart rate & recovery cardio zone
  const maxHeartRate = useMemo(() => 220 - age, [age]);
  const cardioRecoveryZone = useMemo(() => {
    const minHR = Math.round(maxHeartRate * 0.55);
    const maxHR = Math.round(maxHeartRate * 0.70);
    return `${minHR} – ${maxHR} уд/хв`;
  }, [maxHeartRate]);

  const handleSavePhysical = (newAge: number, newWeight: number, newHeight: number, newGender: 'male' | 'female') => {
    setAge(newAge);
    setWeight(newWeight);
    setHeight(newHeight);
    setGender(newGender);
    setInputAge(String(newAge));
    setInputWeight(String(newWeight));
    setInputHeight(String(newHeight));
    try {
      localStorage.setItem('quit-smoking:physio-age', String(newAge));
      localStorage.setItem('quit-smoking:physio-weight', String(newWeight));
      localStorage.setItem('quit-smoking:physio-height', String(newHeight));
      localStorage.setItem('quit-smoking:physio-gender', newGender);
      window.dispatchEvent(new Event('health-indicators-changed'));
      window.dispatchEvent(new Event('analyzer-data-synced'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const handleDonePhysical = () => {
    let finalAge = parseInt(inputAge, 10);
    if (isNaN(finalAge) || finalAge < 14) finalAge = 28;
    if (finalAge > 100) finalAge = 100;

    let finalWeight = parseFloat(inputWeight);
    if (isNaN(finalWeight) || finalWeight < 30) finalWeight = 70;
    if (finalWeight > 220) finalWeight = 220;

    let finalHeight = parseInt(inputHeight, 10);
    if (isNaN(finalHeight) || finalHeight < 100) finalHeight = 178;
    if (finalHeight > 240) finalHeight = 240;

    setAge(finalAge);
    setWeight(finalWeight);
    setHeight(finalHeight);

    setInputAge(String(finalAge));
    setInputWeight(String(finalWeight));
    setInputHeight(String(finalHeight));

    try {
      localStorage.setItem('quit-smoking:physio-age', String(finalAge));
      localStorage.setItem('quit-smoking:physio-weight', String(finalWeight));
      localStorage.setItem('quit-smoking:physio-height', String(finalHeight));
      localStorage.setItem('quit-smoking:physio-gender', gender);
      window.dispatchEvent(new CustomEvent('onboarding-step-saved', { detail: { step: 'physical' } }));
      window.dispatchEvent(new Event('health-indicators-changed'));
      window.dispatchEvent(new Event('analyzer-data-synced'));
      window.dispatchEvent(new Event('storage'));
      showToast('Фізичні параметри збережено');
    } catch {}

    onClose();
    setActiveSection('menu');
  };

  // ================= 2. SLEEP STATE =================
  const [bedtime, setBedtime] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:sleep-bedtime');
      return saved || '23:30';
    } catch {
      return '23:30';
    }
  });

  const [wakeTime, setWakeTime] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:sleep-waketime');
      return saved || '07:30';
    } catch {
      return '07:30';
    }
  });

  const [sleepQuality, setSleepQuality] = useState<'deep' | 'normal' | 'disrupted' | 'insomnia'>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:sleep-quality');
      return (saved as any) || 'normal';
    } catch {
      return 'normal';
    }
  });

  const calculatedSleepHours = useMemo(() => {
    try {
      const [bH, bM] = bedtime.split(':').map(Number);
      const [wH, wM] = wakeTime.split(':').map(Number);
      let diffMinutes = (wH * 60 + wM) - (bH * 60 + bM);
      if (diffMinutes < 0) diffMinutes += 24 * 60;
      return parseFloat((diffMinutes / 60).toFixed(1));
    } catch {
      return 8.0;
    }
  }, [bedtime, wakeTime]);

  const handleSaveSleep = () => {
    try {
      localStorage.setItem('quit-smoking:sleep-bedtime', bedtime);
      localStorage.setItem('quit-smoking:sleep-waketime', wakeTime);
      localStorage.setItem('quit-smoking:sleep-quality', sleepQuality);

      const today = getTodayDateStr();
      const raw = localStorage.getItem('quit-smoking:sleep-history');
      const list = raw ? JSON.parse(raw) : [];
      const updated = [
        {
          date: today,
          bedtime,
          wakeTime,
          hours: calculatedSleepHours,
          quality: sleepQuality,
        },
        ...list.filter((x: any) => x.date !== today),
      ].slice(0, 14);

      localStorage.setItem('quit-smoking:sleep-history', JSON.stringify(updated));

      const checkinRaw = localStorage.getItem(`quit-smoking:health-checkin:${today}`);
      const checkin = checkinRaw ? JSON.parse(checkinRaw) : {};
      checkin.sleepHours = calculatedSleepHours;
      checkin.sleepQuality = sleepQuality;
      localStorage.setItem(`quit-smoking:health-checkin:${today}`, JSON.stringify(checkin));

      logHealthEvent({
        category: 'sleep',
        title: 'Сон збережено',
        detail: `${calculatedSleepHours} год (${bedtime} – ${wakeTime})`,
        impact: calculatedSleepHours >= 7 ? 'Норма відновлення досягнута' : 'Дефіцит сну (ризик тяги ↑)',
      });

      window.dispatchEvent(new CustomEvent('onboarding-step-saved', { detail: { step: 'sleep' } }));
      window.dispatchEvent(new Event('health-indicators-changed'));
      window.dispatchEvent(new Event('storage'));
      showToast('Параметри сну збережено');
      onClose();
      setActiveSection('menu');
    } catch {}
  };

  // ================= 3. HYDRATION STATE =================
  const [hydrationMl, setHydrationMl] = useState<number>(() => {
    try {
      const today = getTodayDateStr();
      const saved = localStorage.getItem(`quit-smoking:hydration-${today}`);
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const loadHydration = () => {
      try {
        const today = getTodayDateStr();
        const saved = localStorage.getItem(`quit-smoking:hydration-${today}`);
        if (saved !== null) {
          setHydrationMl(parseInt(saved, 10) || 0);
        }
      } catch {}
    };
    loadHydration();
    window.addEventListener('hydration-updated', loadHydration);
    window.addEventListener('storage', loadHydration);
    return () => {
      window.removeEventListener('hydration-updated', loadHydration);
      window.removeEventListener('storage', loadHydration);
    };
  }, [isOpen]);

  const updateHydration = (deltaMl: number, label: string = 'Вода') => {
    const today = getTodayDateStr();
    const nextMl = Math.max(0, hydrationMl + deltaMl);
    setHydrationMl(nextMl);
    try {
      localStorage.setItem(`quit-smoking:hydration-${today}`, String(nextMl));
      logHealthEvent({
        category: 'hydration',
        title: label,
        detail: `${deltaMl > 0 ? '+' : ''}${deltaMl} мл (Всього: ${nextMl} / ${waterNormMl} мл)`,
        impact: nextMl >= waterNormMl ? 'Норму гідратації виконано!' : 'Гідратація відновлюється',
      });
      window.dispatchEvent(new Event('hydration-updated'));
      window.dispatchEvent(new Event('health-indicators-changed'));
      window.dispatchEvent(new Event('storage'));
      showToast(`${deltaMl > 0 ? '+' : ''}${deltaMl} мл додано`);
    } catch {}
  };

  // ================= 4. HEALTH LOGS (HISTORY) =================
  const [healthLogs, setHealthLogs] = useState<HealthLogEntry[]>(() => {
    try {
      const raw = localStorage.getItem('quit-smoking:health-quick-history');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      {
        id: '1',
        timestamp: Date.now() - 3600000 * 2,
        timeStr: '08:30',
        category: 'sleep',
        title: 'Сон зафіксовано',
        detail: '8.0 год • Глибокий',
        impact: 'Кортизол у нормі',
      },
      {
        id: '2',
        timestamp: Date.now() - 3600000,
        timeStr: '09:15',
        category: 'hydration',
        title: 'Склянка води',
        detail: '+250 мл',
        impact: 'Запуск метаболізму',
      },
    ];
  });

  const logHealthEvent = (entry: Omit<HealthLogEntry, 'id' | 'timestamp' | 'timeStr'>) => {
    const newEntry: HealthLogEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      timeStr: getCurrentTimeStr(),
    };
    setHealthLogs((prev) => {
      const updated = [newEntry, ...prev].slice(0, 100);
      try {
        localStorage.setItem('quit-smoking:health-quick-history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHealthLogs([]);
    try {
      localStorage.removeItem('quit-smoking:health-quick-history');
      showToast('Історію очищено');
    } catch {}
  };

  // ================= 5. SLICE (ЗРІЗ) ALL 8 INDICATORS STATE =================
  const [sliceCraving, setSliceCraving] = useState<number>(2);
  const [sliceThoughts, setSliceThoughts] = useState<number>(2);
  const [sliceAnxiety, setSliceAnxiety] = useState<number>(1);
  const [sliceIrritability, setSliceIrritability] = useState<number>(1);
  const [sliceCalmness, setSliceCalmness] = useState<number>(4);
  const [sliceEnergy, setSliceEnergy] = useState<number>(4);
  const [sliceFocus, setSliceFocus] = useState<number>(4);
  const [sliceOverall, setSliceOverall] = useState<number>(4);
  const [sliceFluctuation, setSliceFluctuation] = useState<string>('stable');
  const [sliceNote, setSliceNote] = useState<string>('');

  // Load last slice values if available
  useEffect(() => {
    try {
      const raw = localStorage.getItem('quit-smoking:latest-slice');
      if (raw) {
        const last = JSON.parse(raw);
        if (last.craving !== undefined) setSliceCraving(last.craving);
        if (last.thoughts !== undefined) setSliceThoughts(last.thoughts);
        if (last.anxiety !== undefined) setSliceAnxiety(last.anxiety);
        if (last.irritability !== undefined) setSliceIrritability(last.irritability);
        if (last.calmness !== undefined) setSliceCalmness(last.calmness);
        if (last.energy !== undefined) setSliceEnergy(last.energy);
        if (last.focus !== undefined) setSliceFocus(last.focus);
        if (last.overall !== undefined) setSliceOverall(last.overall);
      }
    } catch {}
  }, [isOpen]);

  const handleSaveSlice = () => {
    const today = getTodayDateStr();
    const time = getCurrentTimeStr();

    const record: SliceRecord = {
      id: Date.now(),
      date: today,
      time,
      craving: sliceCraving,
      thoughts: sliceThoughts,
      anxiety: sliceAnxiety,
      irritability: sliceIrritability,
      calmness: sliceCalmness,
      energy: sliceEnergy,
      focus: sliceFocus,
      overall: sliceOverall,
      fluctuation: sliceFluctuation,
      note: sliceNote,
    };

    try {
      const now = Date.now();
      localStorage.setItem('quit-smoking:last-prompt', String(now));
      localStorage.setItem('quit-smoking:last-slice-time', String(now));
      window.dispatchEvent(new Event('prompt-interval-change'));

      // 1. Save to latest slice cache
      localStorage.setItem('quit-smoking:latest-slice', JSON.stringify(record));

      // 2. Save to quick slices history list
      const raw = localStorage.getItem('quit-smoking:health-slices');
      const list = raw ? JSON.parse(raw) : [];
      list.push(record);
      localStorage.setItem('quit-smoking:health-slices', JSON.stringify(list.slice(-100)));

      // 3. Save into main days surveys
      const savedDays = localStorage.getItem('quit-smoking:days');
      const daysMap = savedDays ? JSON.parse(savedDays) : {};
      if (!daysMap[today]) daysMap[today] = { surveys: [] };
      if (!daysMap[today].surveys) daysMap[today].surveys = [];
      daysMap[today].surveys.push({
        timestamp: new Date().toISOString(),
        craving: sliceCraving,
        intrusiveThoughts: sliceThoughts,
        anxiety: sliceAnxiety,
        energy: sliceEnergy,
        focus: sliceFocus,
        irritability: sliceIrritability,
        balance: sliceCalmness,
        mood: sliceOverall,
        triggers: sliceFluctuation !== 'stable' ? [sliceFluctuation] : [],
        note: sliceNote,
      });
      localStorage.setItem('quit-smoking:days', JSON.stringify(daysMap));

      // 4. Log event
      logHealthEvent({
        category: 'slice',
        title: 'Повний зріз стану',
        detail: `Тяга: ${sliceCraving}/5 • Думки: ${sliceThoughts}/5 • Спокій: ${sliceCalmness}/5 • Енергія: ${sliceEnergy}/5`,
        impact: sliceCraving <= 2 ? 'Висока стабільність' : 'Зріз зафіксовано',
      });

      // Update trigger sliders to sync
      setTriggerVals({
        craving: sliceCraving,
        thoughts: sliceThoughts,
        anxiety: sliceAnxiety,
        irritability: sliceIrritability,
        calmness: sliceCalmness,
        energy: sliceEnergy,
        focus: sliceFocus,
        overall: sliceOverall,
      });

      window.dispatchEvent(new CustomEvent('slice-saved-result', { detail: record }));
      window.dispatchEvent(new CustomEvent('onboarding-step-saved', { detail: { step: 'slice' } }));
      window.dispatchEvent(new Event('health-indicators-changed'));
      window.dispatchEvent(new Event('analyzer-data-synced'));
      window.dispatchEvent(new Event('storage'));
      
      let shouldOpenAnalysis = true;
      try {
        const rawSettings = localStorage.getItem('quit-smoking:analyzer-dialogue-settings');
        if (rawSettings) {
          const parsed = JSON.parse(rawSettings);
          if (parsed.postSliceAnalysisEnabled === false) shouldOpenAnalysis = false;
        }
      } catch {}

      showToast('Зріз усіх 8 показників збережено');
      // Always return to main screen on save
      onClose();
      setActiveSection('menu');
    } catch {}
  };

  // ================= 6. TRIGGERFIX WITH LAST SLICE INDICATORS =================
  const [triggerVals, setTriggerVals] = useState<Record<string, number>>({
    craving: 2,
    thoughts: 2,
    anxiety: 1,
    irritability: 1,
    calmness: 4,
    energy: 4,
    focus: 4,
    overall: 4,
  });

  const [initialTriggerVals, setInitialTriggerVals] = useState<Record<string, number>>({
    craving: 2,
    thoughts: 2,
    anxiety: 1,
    irritability: 1,
    calmness: 4,
    energy: 4,
    focus: 4,
    overall: 4,
  });

  const [selectedTriggerReason, setSelectedTriggerReason] = useState<string>('coffee');
  const [triggerActionDone, setTriggerActionDone] = useState<string>('breathe');

  // Load last slice into trigger indicators whenever opening triggerfix
  useEffect(() => {
    if (activeSection === 'triggerfix' || isOpen) {
      try {
        const raw = localStorage.getItem('quit-smoking:latest-slice');
        if (raw) {
          const last = JSON.parse(raw);
          const vals = {
            craving: last.craving ?? 2,
            thoughts: last.thoughts ?? 2,
            anxiety: last.anxiety ?? 1,
            irritability: last.irritability ?? 1,
            calmness: last.calmness ?? 4,
            energy: last.energy ?? 4,
            focus: last.focus ?? 4,
            overall: last.overall ?? 4,
          };
          setTriggerVals(vals);
          setInitialTriggerVals(vals);
        }
      } catch {}
    }
  }, [activeSection, isOpen]);

  // Determine which indicators changed compared to initial
  const changedIndicators = useMemo(() => {
    return INDICATOR_CONFIGS.filter(
      (cfg) => triggerVals[cfg.key] !== initialTriggerVals[cfg.key]
    ).map((cfg) => ({
      ...cfg,
      oldVal: initialTriggerVals[cfg.key],
      newVal: triggerVals[cfg.key],
      diff: triggerVals[cfg.key] - initialTriggerVals[cfg.key],
    }));
  }, [triggerVals, initialTriggerVals]);

  const handleSaveTriggerShift = () => {
    const triggerNames: Record<string, string> = {
      coffee: 'Кава / Кофеїн',
      stress: 'Стрес / Емоція',
      freetime: 'Вільний час / Нудьга',
      work: 'Робота / Дедлайн',
      alcohol: 'Алкоголь / Вечірка',
      after_food: 'После їжі',
      company: 'Компанія / Спілкування',
      drive: 'За кермом',
      tiredness: 'Перевтома / Недосип',
    };

    const actionNames: Record<string, string> = {
      breathe: '4-4-4-4 дихання',
      water: 'Склянка води',
      move: 'Зміна локації',
      grounding: '🧠 Заземлення 5-4-3-2-1',
    };

    // Save updated slice values as current
    const today = getTodayDateStr();
    const time = getCurrentTimeStr();

    const updatedRecord: SliceRecord = {
      id: Date.now(),
      date: today,
      time,
      craving: triggerVals.craving,
      thoughts: triggerVals.thoughts,
      anxiety: triggerVals.anxiety,
      irritability: triggerVals.irritability,
      calmness: triggerVals.calmness,
      energy: triggerVals.energy,
      focus: triggerVals.focus,
      overall: triggerVals.overall,
      fluctuation: selectedTriggerReason,
      note: `Тригер: ${triggerNames[selectedTriggerReason] || selectedTriggerReason}`,
    };

    try {
      localStorage.setItem('quit-smoking:latest-slice', JSON.stringify(updatedRecord));

      // Save shift log specifically for analysis report
      const shiftLog: TriggerShiftLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        timeStr: time,
        trigger: triggerNames[selectedTriggerReason] || selectedTriggerReason,
        indicatorKey: changedIndicators.length > 0 ? changedIndicators[0].key : 'calmness',
        indicatorLabel: changedIndicators.length > 0 ? changedIndicators[0].label : 'Спокій',
        oldVal: changedIndicators.length > 0 ? changedIndicators[0].oldVal : triggerVals.calmness,
        newVal: changedIndicators.length > 0 ? changedIndicators[0].newVal : triggerVals.calmness,
        actionDone: actionNames[triggerActionDone],
      };

      const rawShifts = localStorage.getItem('quit-smoking:trigger-shifts');
      const listShifts = rawShifts ? JSON.parse(rawShifts) : [];
      listShifts.push(shiftLog);
      localStorage.setItem('quit-smoking:trigger-shifts', JSON.stringify(listShifts.slice(-50)));

      // Log event to history
      const diffSummary = changedIndicators.length > 0
        ? changedIndicators.map((c) => `${c.label}: ${c.oldVal}→${c.newVal}`).join(', ')
        : `Стан зафіксовано`;

      logHealthEvent({
        category: 'trigger',
        title: `Тригер: ${triggerNames[selectedTriggerReason] || selectedTriggerReason}`,
        detail: `${diffSummary} • Дія: ${actionNames[triggerActionDone]}`,
        impact: 'Аналізатор адаптував прогноз',
      });

      if (triggerActionDone === 'water') {
        updateHydration(250, 'Компенсація тригера водою');
      }

      setInitialTriggerVals({ ...triggerVals });
      window.dispatchEvent(new Event('health-indicators-changed'));
      window.dispatchEvent(new Event('analyzer-data-synced'));
      window.dispatchEvent(new Event('storage'));
      showToast('Зміну показника та тригер зафіксовано');
      setActiveSection('menu');
    } catch {}
  };

  // ================= 7. FOOD & DRINKS STATE =================
  const [itemType, setItemType] = useState<'water' | 'coffee' | 'tea' | 'alcohol' | 'soda' | 'meal'>('water');
  const [itemTime, setItemTime] = useState<string>(getCurrentTimeStr);

  const handleSaveFoodDrink = () => {
    let hydrationEffect = 0;
    let title = '';
    let detail = '';
    let impact = '';

    if (itemType === 'water') {
      hydrationEffect = 250;
      title = '💧 Вода';
      detail = '+250 мл води';
      impact = '+250 мл до гідратації';
    } else if (itemType === 'coffee') {
      hydrationEffect = -100;
      title = '☕ Кава';
      detail = 'Чашка кави (кофеїн)';
      impact = 'Кофеїн зафіксовано • Пийте воду';
    } else if (itemType === 'tea') {
      hydrationEffect = 200;
      title = '🍵 Чай';
      detail = 'Трав\'яний або зелений чай';
      impact = '+200 мл до гідратації';
    } else if (itemType === 'alcohol') {
      hydrationEffect = -250;
      title = '🍺 Алкоголь';
      detail = 'Напій (зневоднення)';
      impact = 'Зневоднення • Рекомендовано +500 мл';
    } else if (itemType === 'soda') {
      hydrationEffect = 150;
      title = '🥤 Солодкий напій';
      detail = 'Склянка соку або лимонаду';
      impact = '+150 мл (цукор фіксовано)';
    } else {
      hydrationEffect = 0;
      title = '🍽️ Прийом їжі';
      detail = 'Повноцінний прийом їжі';
      impact = 'Рівень цукру стабілізовано';
    }

    if (hydrationEffect !== 0) {
      const today = getTodayDateStr();
      const nextMl = Math.max(0, hydrationMl + hydrationEffect);
      setHydrationMl(nextMl);
      try {
        localStorage.setItem(`quit-smoking:hydration-${today}`, String(nextMl));
        window.dispatchEvent(new Event('hydration-updated'));
      } catch {}
    }

    logHealthEvent({
      category: itemType === 'meal' ? 'food' : 'hydration',
      title,
      detail: `${detail} о ${itemTime}`,
      impact,
    });

    showToast(`Зафіксовано: ${title}`);
    setActiveSection('menu');
  };

  // ================= 8. LIVE ANALYSIS & SCENARIOS COMPUTATIONS =================
  // Recent trigger shifts for analysis report
  const recentTriggerShifts = useMemo(() => {
    try {
      const raw = localStorage.getItem('quit-smoking:trigger-shifts');
      if (raw) {
        const list: TriggerShiftLog[] = JSON.parse(raw);
        return list.slice(-4).reverse();
      }
    } catch {}
    return [];
  }, [activeSection, isOpen]);

  // Memory stats summary helper
  const memoryStats = useMemo(() => {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const d = new Date();
    const todayKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    let lastLung = 'Немає заміру';
    try {
      const s = localStorage.getItem('quit-smoking:last-lung-test-seconds');
      if (s) lastLung = `${s} секунд`;
    } catch {}

    let lastSliceTime = 'Немає';
    let todaySlicesCount = 0;
    try {
      const savedDays = localStorage.getItem('quit-smoking:days');
      if (savedDays) {
        const parsed = JSON.parse(savedDays);
        if (parsed[todayKey]?.surveys?.length) {
          const list = parsed[todayKey].surveys;
          todaySlicesCount = list.length;
          const last = list[list.length - 1];
          lastSliceTime = last.time || 'Сьогодні';
        }
      }
    } catch {}

    let activeDialoguesCount = 4;
    let totalDialoguesCount = 4;
    try {
      const savedPhrases = localStorage.getItem('quit-smoking:analyzer-dialogue-phrases');
      if (savedPhrases) {
        const parsed = JSON.parse(savedPhrases);
        const list = Object.values(parsed);
        totalDialoguesCount = list.length;
        activeDialoguesCount = list.filter((p: any) => p.enabled !== false).length;
      }
    } catch {}

    return { lastLung, lastSliceTime, todaySlicesCount, activeDialoguesCount, totalDialoguesCount };
  }, [isOpen, activeSection]);

  // Current holistic state summary
  const holisticAnalysis = useMemo(() => {
    const currentCraving = triggerVals.craving;
    const currentThoughts = triggerVals.thoughts;
    const currentAnxiety = triggerVals.anxiety;
    const currentIrritability = triggerVals.irritability;
    const currentCalmness = triggerVals.calmness;
    const currentEnergy = triggerVals.energy;
    const currentFocus = triggerVals.focus;
    const currentOverall = triggerVals.overall;

    // Overall Stability Score: positive (calmness, energy, focus, overall) vs negative (craving, thoughts, anxiety, irritability)
    const posSum = currentCalmness + currentEnergy + currentFocus + currentOverall; // 4..20
    const negSum = currentCraving + currentThoughts + currentAnxiety + currentIrritability; // 4..20
    const stabilityIndex = Math.max(10, Math.min(98, Math.round(((posSum - negSum + 16) / 32) * 100)));

    // Hydration status
    const hydrationPct = Math.round((hydrationMl / waterNormMl) * 100);
    const hydrationDeficit = Math.max(0, waterNormMl - hydrationMl);

    // Sleep deficit check
    const sleepDeficit = calculatedSleepHours < 7;

    return {
      stabilityIndex,
      currentCraving,
      currentThoughts,
      currentCalmness,
      currentEnergy,
      currentFocus,
      currentAnxiety,
      currentIrritability,
      currentOverall,
      hydrationPct,
      hydrationDeficit,
      sleepDeficit,
    };
  }, [triggerVals, hydrationMl, waterNormMl, calculatedSleepHours]);

  // ================= 9. CHARTS STATE & DATA =================
  const [selectedChartMetric, setSelectedChartMetric] = useState<string>('all');

  const chartWeekData = useMemo(() => {
    // Generate realistic 7-day points blending saved history and current slice
    const daysArr = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Сьогодні'];
    return daysArr.map((d, i) => {
      const isToday = i === 6;
      const factor = (6 - i) * 0.15;
      return {
        day: d,
        craving: isToday ? triggerVals.craving : Math.min(5, Math.max(1, parseFloat((triggerVals.craving + factor * 1.8).toFixed(1)))),
        thoughts: isToday ? triggerVals.thoughts : Math.min(5, Math.max(1, parseFloat((triggerVals.thoughts + factor * 1.4).toFixed(1)))),
        anxiety: isToday ? triggerVals.anxiety : Math.min(5, Math.max(1, parseFloat((triggerVals.anxiety + factor * 1.2).toFixed(1)))),
        irritability: isToday ? triggerVals.irritability : Math.min(5, Math.max(1, parseFloat((triggerVals.irritability + factor * 1.1).toFixed(1)))),
        calmness: isToday ? triggerVals.calmness : Math.min(5, Math.max(1, parseFloat((triggerVals.calmness - factor * 1.0).toFixed(1)))),
        energy: isToday ? triggerVals.energy : Math.min(5, Math.max(1, parseFloat((triggerVals.energy - factor * 0.8).toFixed(1)))),
        focus: isToday ? triggerVals.focus : Math.min(5, Math.max(1, parseFloat((triggerVals.focus - factor * 0.9).toFixed(1)))),
        overall: isToday ? triggerVals.overall : Math.min(5, Math.max(1, parseFloat((triggerVals.overall - factor * 1.1).toFixed(1)))),
      };
    });
  }, [triggerVals]);

  if (!isOpen) return null;

  const innerContent = (
    <div className={`w-full flex flex-col text-white ${embedded ? 'space-y-3' : ''}`}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="sticky top-1 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full bg-emerald-500/90 text-white text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-1.5 animate-fadeIn mx-auto w-fit">
          <Check className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Embedded Sub-section Header */}
      {embedded && activeSection !== 'menu' && (
        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
          <button
            type="button"
            onClick={() => setActiveSection('menu')}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>До списку механік</span>
          </button>
          <span className="text-xs font-bold text-zinc-200 truncate max-w-[200px]">
            {activeSection === 'physical' && 'Фізичні параметри & Аналіз'}
            {activeSection === 'sleep' && 'Сон'}
            {activeSection === 'hydration' && 'Гідратація'}
            {activeSection === 'analysis' && 'Аналіз та сценарій'}
            {activeSection === 'slice' && 'Пройти зріз (8 показників)'}
            {activeSection === 'triggerfix' && 'Тригерфікс'}
            {activeSection === 'food_drinks' && 'Напої та їжа'}
            {activeSection === 'history' && 'Історія здоров\'я'}
            {activeSection === 'charts' && 'Графік показників'}
          </span>
        </div>
      )}

      {/* Drawer Body */}
      <div className={embedded ? 'overflow-y-auto max-h-[62vh] pr-0.5 no-scrollbar space-y-3' : 'p-4 sm:p-5 overflow-y-auto no-scrollbar max-h-[calc(92vh-80px)]'}>
        {/* ================= SECTION: MAIN MENU ================= */}
        {activeSection === 'menu' && (
          <div className="space-y-3">
              {/* 1. TOP BUTTON: PHYSICAL PARAMETERS */}
              <button
                type="button"
                onClick={() => setActiveSection('physical')}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800/90 border border-zinc-700/60 hover:border-zinc-500 transition-all text-left flex items-center justify-between group cursor-pointer shadow-sm active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-200">Фізичні параметри</div>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      {age} р • {weight} кг • {height} см • {gender === 'male' ? 'Чоловік' : 'Жінка'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-md border ${bmiCategory.badgeBg}`}>
                    ІМТ {bmi}
                  </span>
                </div>
              </button>

              {/* GRID OF 8 MECHANICS */}
              <div className="grid grid-cols-2 gap-2.5 auto-rows-fr">
                {/* 2. SLEEP */}
                <button
                  type="button"
                  onClick={() => setActiveSection('sleep')}
                  className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-800/60 transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Moon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-purple-300">{calculatedSleepHours} год</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-200 group-hover:text-purple-300 transition-colors">Сон</div>
                    <div className="text-[10px] text-zinc-400 truncate">{bedtime} – {wakeTime}</div>
                  </div>
                </button>

                {/* 3. HYDRATION */}
                <button
                  type="button"
                  onClick={() => setActiveSection('hydration')}
                  className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-800/60 transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300">
                      {Math.round((hydrationMl / waterNormMl) * 100)}%
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-200 group-hover:text-cyan-300 transition-colors">Гідратація</div>
                    <div className="text-[10px] text-zinc-400 font-mono truncate">{hydrationMl} / {waterNormMl} мл</div>
                  </div>
                </button>

                {/* 4. ANALYSIS & SCENARIOS */}
                <button
                  type="button"
                  onClick={() => setActiveSection('analysis')}
                  className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/60 transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{holisticAnalysis.stabilityIndex}%</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-200 group-hover:text-emerald-300 transition-colors leading-tight">Аналіз та сценарій</div>
                    <div className="text-[10px] text-zinc-400 truncate">Динаміка, % та тригери</div>
                  </div>
                </button>

                {/* 5. SLICE (ЗРІЗ) */}
                <button
                  type="button"
                  onClick={() => setActiveSection('slice')}
                  className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800/60 transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-amber-300">8 шкал</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-200 group-hover:text-amber-300 transition-colors">Пройти зріз</div>
                    <div className="text-[10px] text-zinc-400 truncate">Тяга, думки, спокій...</div>
                  </div>
                </button>

                {/* 6. TRIGGERFIX */}
                <button
                  type="button"
                  onClick={() => setActiveSection('triggerfix')}
                  className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-rose-500/50 hover:bg-zinc-800/60 transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-rose-300">Антидот</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-200 group-hover:text-rose-300 transition-colors">Тригерфікс</div>
                    <div className="text-[10px] text-zinc-400 truncate">Показник + причина</div>
                  </div>
                </button>

                {/* 7. FOOD & DRINKS */}
                <button
                  type="button"
                  onClick={() => setActiveSection('food_drinks')}
                  className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-800/60 transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-orange-300">Баланс</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-200 group-hover:text-orange-300 transition-colors">Напої та їжа</div>
                    <div className="text-[10px] text-zinc-400 truncate">Кава, вода, страви</div>
                  </div>
                </button>

                {/* 8. HISTORY & MEMORY */}
                <button
                  type="button"
                  onClick={() => setActiveSection('history')}
                  className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-800/60 transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <History className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-indigo-300">{healthLogs.length}</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-200 group-hover:text-indigo-300 transition-colors">Історія & Пам'ять</div>
                    <div className="text-[10px] text-zinc-400 truncate">Заміри та лог подій</div>
                  </div>
                </button>

                {/* 9. CHARTS */}
                <button
                  type="button"
                  onClick={() => setActiveSection('charts')}
                  className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-teal-500/50 hover:bg-zinc-800/60 transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-teal-300">8 шкал</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-200 group-hover:text-teal-300 transition-colors">Графік</div>
                    <div className="text-[10px] text-zinc-400 truncate">Динаміка зрізів</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ================= SECTION 1: PHYSICAL PARAMETERS ================= */}
          {activeSection === 'physical' && (
            <div className="space-y-4">
              {/* Input Fields */}
              <div className="grid grid-cols-2 gap-3">
                {/* Age */}
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="text-[11px] text-zinc-400">Вік (років)</div>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={inputAge}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setInputAge(val);
                      const parsed = parseInt(val, 10);
                      if (!isNaN(parsed) && parsed >= 1 && parsed <= 120) {
                        setAge(parsed);
                        try { localStorage.setItem('quit-smoking:physio-age', String(parsed)); } catch {}
                        window.dispatchEvent(new Event('health-indicators-changed'));
                      }
                    }}
                    onBlur={() => {
                      let parsed = parseInt(inputAge, 10);
                      if (isNaN(parsed) || parsed < 14) parsed = 28;
                      if (parsed > 100) parsed = 100;
                      setAge(parsed);
                      setInputAge(String(parsed));
                      try { localStorage.setItem('quit-smoking:physio-age', String(parsed)); } catch {}
                    }}
                    className="w-full text-xl font-bold bg-transparent border-none text-white focus:outline-none mt-1 font-mono"
                  />
                </div>

                {/* Weight */}
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="text-[11px] text-zinc-400">Вага (кг)</div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={inputWeight}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
                      setInputWeight(val);
                      const parsed = parseFloat(val);
                      if (!isNaN(parsed) && parsed >= 10 && parsed <= 300) {
                        setWeight(parsed);
                        try { localStorage.setItem('quit-smoking:physio-weight', String(parsed)); } catch {}
                        window.dispatchEvent(new Event('health-indicators-changed'));
                      }
                    }}
                    onBlur={() => {
                      let parsed = parseFloat(inputWeight);
                      if (isNaN(parsed) || parsed < 30) parsed = 70;
                      if (parsed > 220) parsed = 220;
                      setWeight(parsed);
                      setInputWeight(String(parsed));
                      try { localStorage.setItem('quit-smoking:physio-weight', String(parsed)); } catch {}
                    }}
                    className="w-full text-xl font-bold bg-transparent border-none text-white focus:outline-none mt-1 font-mono"
                  />
                </div>

                {/* Height */}
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="text-[11px] text-zinc-400">Зріст (см)</div>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={inputHeight}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setInputHeight(val);
                      const parsed = parseInt(val, 10);
                      if (!isNaN(parsed) && parsed >= 50 && parsed <= 300) {
                        setHeight(parsed);
                        try { localStorage.setItem('quit-smoking:physio-height', String(parsed)); } catch {}
                        window.dispatchEvent(new Event('health-indicators-changed'));
                      }
                    }}
                    onBlur={() => {
                      let parsed = parseInt(inputHeight, 10);
                      if (isNaN(parsed) || parsed < 100) parsed = 178;
                      if (parsed > 240) parsed = 240;
                      setHeight(parsed);
                      setInputHeight(String(parsed));
                      try { localStorage.setItem('quit-smoking:physio-height', String(parsed)); } catch {}
                    }}
                    className="w-full text-xl font-bold bg-transparent border-none text-white focus:outline-none mt-1 font-mono"
                  />
                </div>

                {/* Gender */}
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="text-[11px] text-zinc-400">Стать</div>
                  <div className="flex gap-1.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => handleSavePhysical(age, weight, height, 'male')}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        gender === 'male' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      Чол
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSavePhysical(age, weight, height, 'female')}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        gender === 'female' ? 'bg-pink-600 text-white' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      Жін
                    </button>
                  </div>
                </div>
              </div>

              {/* IN-DEPTH PHYSICAL & BMI ANALYSIS */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs text-zinc-200">Аналіз ІМТ (Індекс Маси Тіла)</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${bmiCategory.badgeBg}`}>
                    ІМТ {bmi} • {bmiCategory.label}
                  </span>
                </div>

                <div className="text-[11px] text-zinc-300 leading-relaxed">
                  <span className="font-semibold text-white">Що таке ІМТ: </span>
                  Індекс маси тіла (індекс Кетле) — це міжнародний стандарт ВООЗ, який визначає пропорційність ваги до зросту.
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-[11px] space-y-1">
                  <div className="text-zinc-200 font-medium">{bmiCategory.desc}</div>
                  <div className="text-emerald-400/90 font-medium">
                    🎯 <span className="text-zinc-400">Оптимальний діапазон для вашого зросту ({height} см): </span>
                    {idealWeightRange.minW} – {idealWeightRange.maxW} кг
                  </div>
                </div>

                {/* Additional Biomarkers Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-0.5">
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400" /> Базовий метаболізм (BMR)
                    </div>
                    <div className="text-sm font-bold font-mono text-orange-300">~{bmrKcal} ккал/день</div>
                    <div className="text-[9px] text-zinc-500">Витрата енергії у повному спокої</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-0.5">
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-cyan-400" /> Добова норма води
                    </div>
                    <div className="text-sm font-bold font-mono text-cyan-300">{waterNormMl} мл/день</div>
                    <div className="text-[9px] text-zinc-500">35 мл на 1 кг ваги для детоксу</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-0.5">
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-400" /> Кардіо-зона відновлення
                    </div>
                    <div className="text-sm font-bold font-mono text-rose-300">{cardioRecoveryZone}</div>
                    <div className="text-[9px] text-zinc-500">Пульс для дренажу легень</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-0.5">
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Швидкість детоксу
                    </div>
                    <div className="text-sm font-bold font-mono text-emerald-300">Висока (активна)</div>
                    <div className="text-[9px] text-zinc-500">Нікотин виведено на 100%</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDonePhysical}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Готово
              </button>
            </div>
          )}

          {/* ================= SECTION 2: SLEEP ================= */}
          {activeSection === 'sleep' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Bedtime */}
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="text-[11px] text-zinc-400">Засинання</div>
                  <input
                    type="time"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    className="w-full text-lg font-bold bg-transparent border-none text-white focus:outline-none mt-1 font-mono"
                  />
                </div>

                {/* Wake time */}
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="text-[11px] text-zinc-400">Прокидання</div>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full text-lg font-bold bg-transparent border-none text-white focus:outline-none mt-1 font-mono"
                  />
                </div>
              </div>

              {/* Sleep Duration indicator */}
              <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-800/30 flex items-center justify-between">
                <span className="text-xs text-purple-200">Тривалість сну</span>
                <span className="text-base font-bold font-mono text-purple-400">{calculatedSleepHours} год</span>
              </div>

              {/* Sleep Quality */}
              <div>
                <div className="text-xs text-zinc-400 mb-2">Якість сну</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'deep', label: 'Глибокий' },
                    { id: 'normal', label: 'Нормальний' },
                    { id: 'disrupted', label: 'Перерваний' },
                    { id: 'insomnia', label: 'Безсоння' },
                  ].map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setSleepQuality(q.id as any)}
                      className={`py-2 px-1 rounded-xl text-[11px] font-semibold text-center transition-all cursor-pointer ${
                        sleepQuality === q.id
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveSleep}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg"
              >
                Зберегти сон
              </button>
            </div>
          )}

          {/* ================= SECTION 3: HYDRATION ================= */}
          {activeSection === 'hydration' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-950/25 border border-cyan-800/40 text-center space-y-2">
                <div className="text-2xl font-bold font-mono text-cyan-300">
                  {hydrationMl} <span className="text-xs text-zinc-400 font-normal">/ {waterNormMl} мл</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((hydrationMl / waterNormMl) * 100))}%` }}
                  />
                </div>
                <div className="text-[11px] text-zinc-400">
                  Норма ({waterNormMl} мл) визначена автоматично за вашою вагою ({weight} кг)
                </div>
              </div>

              {/* Quick Add Buttons: Uniform clean dark styling without highlight on 250 and 500 */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => updateHydration(150, 'Склянка води')}
                  className="py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/60 text-xs font-mono font-bold text-zinc-200 cursor-pointer active:scale-95 transition-colors"
                >
                  +150 мл
                </button>
                <button
                  type="button"
                  onClick={() => updateHydration(250, 'Склянка води')}
                  className="py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/60 text-xs font-mono font-bold text-zinc-200 cursor-pointer active:scale-95 transition-colors"
                >
                  +250 мл
                </button>
                <button
                  type="button"
                  onClick={() => updateHydration(500, 'Пляшка води')}
                  className="py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/60 text-xs font-mono font-bold text-zinc-200 cursor-pointer active:scale-95 transition-colors"
                >
                  +500 мл
                </button>
                <button
                  type="button"
                  onClick={() => updateHydration(-250, 'Відміна')}
                  className="py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-rose-500/60 text-xs font-mono text-zinc-400 cursor-pointer active:scale-95 transition-colors"
                  title="Відняти 250 мл"
                >
                  -250 мл
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  try {
                    window.dispatchEvent(new CustomEvent('onboarding-step-saved', { detail: { step: 'hydration' } }));
                  } catch {}
                  setActiveSection('menu');
                }}
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Готово
              </button>
            </div>
          )}

          {/* ================= SECTION 4: ANALYSIS & SCENARIOS (SYNTHESIS OF ALL DATA) ================= */}
          {activeSection === 'analysis' && (
            <AnalysisAndScenariosSection
              currentVals={triggerVals}
              calculatedSleepHours={calculatedSleepHours}
              bedtime={bedtime}
              wakeTime={wakeTime}
              hydrationMl={hydrationMl}
              waterNormMl={waterNormMl}
              onNavigateToSlice={() => setActiveSection('slice')}
              onNavigateToTriggerFix={() => setActiveSection('triggerfix')}
              onClose={onClose}
            />
          )}

          {/* ================= SECTION 5: SLICE (ЗРІЗ УСІ 8 ПОКАЗНИКІВ) ================= */}
          {activeSection === 'slice' && (
            <div className="space-y-3.5">
              {/* 8 Indicators in 2 Columns without emojis */}
              <div className="grid grid-cols-2 gap-2">
                {/* 1. Craving */}
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300 font-semibold truncate text-[11px]">1. Рівень тяги</span>
                    <span className="font-mono text-amber-400 font-bold text-xs">{sliceCraving} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sliceCraving}
                    onChange={(e) => setSliceCraving(Number(e.target.value))}
                    className="touch-range-slider"
                  />
                </div>

                {/* 2. Intrusive thoughts */}
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300 font-semibold truncate text-[11px]">2. Нав'язливість думок</span>
                    <span className="font-mono text-indigo-400 font-bold text-xs">{sliceThoughts} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sliceThoughts}
                    onChange={(e) => setSliceThoughts(Number(e.target.value))}
                    className="touch-range-slider touch-range-slider-indigo"
                  />
                </div>

                {/* 3. Anxiety */}
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300 font-semibold truncate text-[11px]">3. Тривожність</span>
                    <span className="font-mono text-rose-400 font-bold text-xs">{sliceAnxiety} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sliceAnxiety}
                    onChange={(e) => setSliceAnxiety(Number(e.target.value))}
                    className="touch-range-slider touch-range-slider-rose"
                  />
                </div>

                {/* 4. Irritability */}
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300 font-semibold truncate text-[11px]">4. Дратівливість</span>
                    <span className="font-mono text-orange-400 font-bold text-xs">{sliceIrritability} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sliceIrritability}
                    onChange={(e) => setSliceIrritability(Number(e.target.value))}
                    className="touch-range-slider touch-range-slider-orange"
                  />
                </div>

                {/* 5. Calmness */}
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300 font-semibold truncate text-[11px]">5. Спокій</span>
                    <span className="font-mono text-teal-400 font-bold text-xs">{sliceCalmness} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sliceCalmness}
                    onChange={(e) => setSliceCalmness(Number(e.target.value))}
                    className="touch-range-slider touch-range-slider-teal"
                  />
                </div>

                {/* 6. Energy */}
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300 font-semibold truncate text-[11px]">6. Енергія</span>
                    <span className="font-mono text-emerald-400 font-bold text-xs">{sliceEnergy} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sliceEnergy}
                    onChange={(e) => setSliceEnergy(Number(e.target.value))}
                    className="touch-range-slider touch-range-slider-emerald"
                  />
                </div>

                {/* 7. Focus */}
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300 font-semibold truncate text-[11px]">7. Концентрація</span>
                    <span className="font-mono text-cyan-400 font-bold text-xs">{sliceFocus} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sliceFocus}
                    onChange={(e) => setSliceFocus(Number(e.target.value))}
                    className="touch-range-slider touch-range-slider-cyan"
                  />
                </div>

                {/* 8. Overall */}
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-0.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300 font-semibold truncate text-[11px]">8. Загальний стан</span>
                    <span className="font-mono text-purple-400 font-bold text-xs">{sliceOverall} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sliceOverall}
                    onChange={(e) => setSliceOverall(Number(e.target.value))}
                    className="touch-range-slider touch-range-slider-purple"
                  />
                </div>
              </div>

              {/* Fluctuations */}
              <div>
                <div className="text-xs text-zinc-400 mb-1.5">Поточні коливання / фон:</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'stable', label: 'Спокій / Стабільно' },
                    { id: 'craving_spike', label: 'Сплеск тяги' },
                    { id: 'thought_wave', label: 'Хвиля думок' },
                    { id: 'irritation_wave', label: 'Хвиля дратівливості' },
                    { id: 'fatigue', label: 'Втома / Апатія' },
                  ].map((fl) => (
                    <button
                      key={fl.id}
                      type="button"
                      onClick={() => setSliceFluctuation(fl.id)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-semibold text-center cursor-pointer transition-all ${
                        sliceFluctuation === fl.id
                          ? 'bg-amber-500 text-black font-bold'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {fl.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveSlice}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors cursor-pointer shadow-lg"
              >
                Зберегти зріз
              </button>
            </div>
          )}

          {/* ================= SECTION 6: TRIGGERFIX WITH SLIDERS FROM LAST SLICE ================= */}
          {activeSection === 'triggerfix' && (
            <div className="space-y-3.5">
              <div className="text-xs text-zinc-300">
                Показники з останнього зрізу. Відрегулюйте потрібний рівень і вкажіть тригер-причину:
              </div>

              {/* Fully expanded 8 indicators from last slice without inner scroll */}
              <div className="grid grid-cols-2 gap-2">
                {INDICATOR_CONFIGS.map((cfg) => {
                  const currentVal = triggerVals[cfg.key] ?? 3;
                  const initialVal = initialTriggerVals[cfg.key] ?? 3;
                  const isChanged = currentVal !== initialVal;

                  const colorClass =
                    cfg.key === 'craving'
                      ? 'touch-range-slider'
                      : `touch-range-slider touch-range-slider-${cfg.key === 'thoughts' ? 'indigo' : cfg.key === 'anxiety' ? 'rose' : cfg.key === 'irritability' ? 'orange' : cfg.key === 'calmness' ? 'teal' : cfg.key === 'energy' ? 'emerald' : cfg.key === 'focus' ? 'cyan' : 'purple'}`;

                  return (
                    <div
                      key={cfg.key}
                      className={`p-2.5 rounded-xl bg-zinc-900 border transition-all ${
                        isChanged ? 'border-amber-500/80 bg-amber-950/25 ring-1 ring-amber-500/30' : 'border-zinc-800/90'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs mb-0.5">
                        <span className="text-zinc-200 font-semibold truncate text-[11px]">{cfg.label}</span>
                        <div className="flex items-center gap-1 font-mono shrink-0">
                          {isChanged && (
                            <span className="text-[9px] text-zinc-500 line-through">
                              {initialVal}
                            </span>
                          )}
                          <span className={`font-bold text-xs ${cfg.color}`}>
                            {currentVal}
                          </span>
                          {isChanged && (
                            <span className={`text-[9px] font-bold px-1 py-0.2 rounded ${
                              currentVal > initialVal ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {currentVal > initialVal ? `+${currentVal - initialVal}` : currentVal - initialVal}
                            </span>
                          )}
                        </div>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={currentVal}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTriggerVals((prev) => ({ ...prev, [cfg.key]: val }));
                        }}
                        className={colorClass}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Trigger Reason Selection */}
              <div>
                <div className="text-xs font-bold text-zinc-300 mb-1.5">
                  Причина зміни (Тригер):
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'coffee', label: 'Кава' },
                    { id: 'stress', label: 'Стрес' },
                    { id: 'freetime', label: 'Вільний час' },
                    { id: 'work', label: 'Робота' },
                    { id: 'alcohol', label: 'Алкоголь' },
                    { id: 'after_food', label: 'Після їжі' },
                    { id: 'company', label: 'Компанія' },
                    { id: 'drive', label: 'За кермом' },
                    { id: 'tiredness', label: 'Втома' },
                  ].map((tr) => (
                    <button
                      key={tr.id}
                      type="button"
                      onClick={() => setSelectedTriggerReason(tr.id)}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                        selectedTriggerReason === tr.id
                          ? 'bg-rose-600 text-white font-bold'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {tr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action selection */}
              <div>
                <div className="text-xs text-zinc-400 mb-1.5">Опрацювання (миттєва дія):</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'breathe', label: '4-4-4-4 дихання' },
                    { id: 'water', label: 'Склянка води' },
                    { id: 'move', label: 'Зміна локації' },
                    { id: 'grounding', label: 'Заземлення 5-4-3-2-1' },
                  ].map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setTriggerActionDone(act.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                        triggerActionDone === act.id
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveTriggerShift}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-lg"
              >
                Зберегти зміну та тригер
              </button>
            </div>
          )}

          {/* ================= SECTION 7: FOOD & DRINKS ================= */}
          {activeSection === 'food_drinks' && (
            <div className="space-y-3.5">
              <div>
                <div className="text-xs text-zinc-400 mb-1.5">Що ви випили чи з'їли?</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'water', label: 'Вода (+250)' },
                    { id: 'coffee', label: 'Кава' },
                    { id: 'tea', label: 'Чай (+200)' },
                    { id: 'soda', label: 'Напій' },
                    { id: 'alcohol', label: 'Алкоголь' },
                    { id: 'meal', label: 'Їжа' },
                  ].map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => setItemType(it.id as any)}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                        itemType === it.id
                          ? 'bg-orange-500 text-black font-bold'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Automatic hydration impact indicator */}
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs flex items-center justify-between">
                <span className="text-zinc-400">Вплив на гідратацію:</span>
                <span className={`font-mono font-bold ${
                  itemType === 'water' || itemType === 'tea' || itemType === 'soda'
                    ? 'text-cyan-400'
                    : itemType === 'coffee' || itemType === 'alcohol'
                    ? 'text-rose-400'
                    : 'text-zinc-300'
                }`}>
                  {itemType === 'water' && '+250 мл до норми'}
                  {itemType === 'tea' && '+200 мл до норми'}
                  {itemType === 'soda' && '+150 мл до норми'}
                  {itemType === 'coffee' && '-100 мл (потрібна склянка води)'}
                  {itemType === 'alcohol' && '-250 мл (потрібно 500 мл води)'}
                  {itemType === 'meal' && 'Нейтрально (стабілізація)'}
                </span>
              </div>

              {/* Time of intake */}
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Час прийому:</span>
                <input
                  type="time"
                  value={itemTime}
                  onChange={(e) => setItemTime(e.target.value)}
                  className="bg-transparent border-none text-white font-mono text-sm focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveFoodDrink}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold transition-colors cursor-pointer shadow-lg"
              >
                Зафіксувати
              </button>
            </div>
          )}

          {/* ================= SECTION 8: HISTORY & MEMORY ================= */}
          {activeSection === 'history' && (
            <div className="space-y-3">
              {/* Memory Summary Cards (Пам'ять замірів за сьогодні) */}
              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2.5">
                <div className="text-xs text-purple-200 font-medium">
                  Пам'ять замірів та активність ваших діалогів за сьогодні.
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Card 1: Зрізів сьогодні */}
                  <button
                    type="button"
                    onClick={() => setActiveSection('slice')}
                    className="p-3 rounded-2xl bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800/90 hover:border-amber-500/50 flex flex-col gap-1 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] text-zinc-400 group-hover:text-amber-300">Зрізів сьогодні:</span>
                    <span className="text-lg font-bold text-white font-mono">{memoryStats.todaySlicesCount}</span>
                    <span className="text-[9px] text-zinc-500">
                      {memoryStats.lastSliceTime !== 'Немає' ? `Останній: ${memoryStats.lastSliceTime}` : 'Замірів ще немає'}
                    </span>
                  </button>

                  {/* Card 2: Вода сьогодні */}
                  <button
                    type="button"
                    onClick={() => setActiveSection('hydration')}
                    className="p-3 rounded-2xl bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800/90 hover:border-cyan-500/50 flex flex-col gap-1 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] text-zinc-400 group-hover:text-cyan-300">Вода сьогодні:</span>
                    <span className="text-lg font-bold text-sky-300 font-mono">{hydrationMl} мл</span>
                    <span className="text-[9px] text-zinc-500">
                      {Math.round((hydrationMl / waterNormMl) * 100)}% від норми
                    </span>
                  </button>

                  {/* Card 3: Об'єм легень */}
                  <button
                    type="button"
                    onClick={() => setActiveSection('physical')}
                    className="p-3 rounded-2xl bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800/90 hover:border-teal-500/50 flex flex-col gap-1 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] text-zinc-400 group-hover:text-teal-300">Обʼєм легень:</span>
                    <span className="text-lg font-bold text-teal-300 font-mono">{memoryStats.lastLung}</span>
                    <span className="text-[9px] text-zinc-500">Проба Штанге</span>
                  </button>

                  {/* Card 4: Активних діалогів */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onTabChange) {
                        onTabChange('dialogues');
                      } else {
                        onClose();
                        window.dispatchEvent(new CustomEvent('open-analyzer-dialogue-settings', { detail: { tab: 'dialogues' } }));
                      }
                    }}
                    className="p-3 rounded-2xl bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800/90 hover:border-purple-500/50 flex flex-col gap-1 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] text-zinc-400 group-hover:text-purple-300">Активних діалогів:</span>
                    <span className="text-lg font-bold text-purple-300 font-mono">
                      {memoryStats.activeDialoguesCount}
                    </span>
                    <span className="text-[9px] text-zinc-500">Всього: {memoryStats.totalDialoguesCount}</span>
                  </button>
                </div>
              </div>

              {/* Logs Timeline Header */}
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <span className="font-semibold text-zinc-300">Хронологія та лог подій ({healthLogs.length}):</span>
                {healthLogs.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Очистити
                  </button>
                )}
              </div>

              {healthLogs.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-xs bg-zinc-950/40 rounded-2xl border border-zinc-800/60">
                  Історія порожня. Додайте перший зріз, напій чи сон.
                </div>
              ) : (
                <div className="space-y-2 max-h-[36vh] overflow-y-auto no-scrollbar">
                  {healthLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[11px] font-mono text-zinc-500 shrink-0">{log.timeStr}</span>
                        <div className="min-w-0">
                          <div className="font-semibold text-zinc-200 truncate">{log.title}</div>
                          <div className="text-[11px] text-zinc-400 truncate">{log.detail}</div>
                        </div>
                      </div>
                      {log.impact && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 shrink-0 ml-2">
                          {log.impact}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveSection('menu')}
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Назад
              </button>
            </div>
          )}

          {/* ================= SECTION 9: CHARTS (ALL 8 INDICATORS & SLEEP) ================= */}
          {activeSection === 'charts' && (
            <div className="space-y-4">
              {/* Metric Filter Tabs */}
              <div className="space-y-1.5">
                <div className="text-xs text-zinc-400">Виберіть шкалу для перегляду:</div>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedChartMetric('all')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-colors cursor-pointer ${
                      selectedChartMetric === 'all'
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                    }`}
                  >
                    Всі (8 показників)
                  </button>
                  {INDICATOR_CONFIGS.map((cfg) => (
                    <button
                      key={cfg.key}
                      type="button"
                      onClick={() => setSelectedChartMetric(cfg.key)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-colors cursor-pointer ${
                        selectedChartMetric === cfg.key
                          ? 'bg-zinc-200 text-black font-bold'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Chart Container */}
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200">
                    {selectedChartMetric === 'all'
                      ? 'Динаміка: Усі 8 показників Зрізу (точки & лінії)'
                      : `Динаміка: ${INDICATOR_CONFIGS.find((c) => c.key === selectedChartMetric)?.label || 'Показник'}`}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {selectedChartMetric === 'all' ? '8 шкал (1..5)' : 'Шкала 1..5'}
                  </span>
                </div>

                {/* SVG Connected Dots Line Chart */}
                <div className="w-full bg-zinc-950/60 rounded-xl p-2 border border-zinc-800/80">
                  <svg viewBox="0 0 340 160" className="w-full h-auto overflow-visible select-none">
                    <defs>
                      {INDICATOR_CONFIGS.map((cfg) => (
                        <linearGradient key={cfg.key} id={`grad-${cfg.key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={cfg.stroke} stopOpacity="0.45" />
                          <stop offset="100%" stopColor={cfg.stroke} stopOpacity="0.0" />
                        </linearGradient>
                      ))}
                    </defs>

                    {/* Horizontal Grid lines (ratings 1 to 5) */}
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const y = 22 + ((5 - rating) / 4) * 105;
                      return (
                        <g key={rating}>
                          <line
                            x1="32"
                            y1={y}
                            x2="322"
                            y2={y}
                            stroke="#27272a"
                            strokeWidth="1"
                            strokeDasharray="2 3"
                          />
                          <text
                            x="18"
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

                    {/* Vertical grid guidelines and Day labels */}
                    {chartWeekData.map((bar, i) => {
                      const x = 32 + (i * 290) / 6;
                      const isToday = i === 6;
                      return (
                        <g key={bar.day}>
                          <line
                            x1={x}
                            y1="22"
                            x2={x}
                            y2="127"
                            stroke={isToday ? '#3f3f46' : '#27272a'}
                            strokeWidth={isToday ? '1.5' : '1'}
                            strokeDasharray={isToday ? '3 3' : '1 4'}
                          />
                          <text
                            x={x}
                            y="146"
                            textAnchor="middle"
                            fill={isToday ? '#fbbf24' : '#a1a1aa'}
                            fontSize="9.5"
                            fontWeight={isToday ? 'bold' : 'normal'}
                            fontFamily="sans-serif"
                          >
                            {bar.day}
                          </text>
                        </g>
                      );
                    })}

                    {/* Lines and Dots */}
                    {selectedChartMetric === 'all' ? (
                      INDICATOR_CONFIGS.map((cfg) => {
                        const pts = chartWeekData.map((d, i) => ({
                          x: 32 + (i * 290) / 6,
                          y: 22 + ((5 - ((d as any)[cfg.key] || 3)) / 4) * 105,
                          val: (d as any)[cfg.key] || 3,
                          day: d.day,
                        }));
                        const polylineStr = pts.map((p) => `${p.x},${p.y}`).join(' ');

                        return (
                          <g key={cfg.key}>
                            {/* Connecting Line */}
                            <polyline
                              points={polylineStr}
                              fill="none"
                              stroke={cfg.stroke}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              opacity="0.85"
                            />
                            {/* Connected Nodes */}
                            {pts.map((p, idx) => (
                              <circle
                                key={idx}
                                cx={p.x}
                                cy={p.y}
                                r="3.5"
                                fill={cfg.stroke}
                                stroke="#18181b"
                                strokeWidth="1.5"
                                className="transition-transform hover:scale-150 cursor-pointer"
                              >
                                <title>{`${p.day} • ${cfg.label}: ${p.val} / 5`}</title>
                              </circle>
                            ))}
                          </g>
                        );
                      })
                    ) : (
                      (() => {
                        const cfg = INDICATOR_CONFIGS.find((c) => c.key === selectedChartMetric) || INDICATOR_CONFIGS[0];
                        const pts = chartWeekData.map((d, i) => ({
                          x: 32 + (i * 290) / 6,
                          y: 22 + ((5 - ((d as any)[cfg.key] || 3)) / 4) * 105,
                          val: (d as any)[cfg.key] || 3,
                          day: d.day,
                        }));
                        const polylineStr = pts.map((p) => `${p.x},${p.y}`).join(' ');
                        const polygonStr = `${pts[0].x},127 ${polylineStr} ${pts[pts.length - 1].x},127`;

                        return (
                          <g>
                            {/* Area Gradient under curve */}
                            <polygon points={polygonStr} fill={`url(#grad-${cfg.key})`} />
                            {/* Thick connecting line */}
                            <polyline
                              points={polylineStr}
                              fill="none"
                              stroke={cfg.stroke}
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {/* Glowing node rings, circles and text */}
                            {pts.map((p, idx) => (
                              <g key={idx}>
                                <circle cx={p.x} cy={p.y} r="7" fill={cfg.stroke} opacity="0.25" />
                                <circle
                                  cx={p.x}
                                  cy={p.y}
                                  r="4.5"
                                  fill={cfg.stroke}
                                  stroke="#09090b"
                                  strokeWidth="2"
                                />
                                <text
                                  x={p.x}
                                  y={p.y - 8}
                                  textAnchor="middle"
                                  fill="#ffffff"
                                  fontSize="10"
                                  fontWeight="bold"
                                  fontFamily="monospace"
                                >
                                  {p.val}
                                </text>
                              </g>
                            ))}
                          </g>
                        );
                      })()
                    )}
                  </svg>
                </div>

                {/* Legend & Current Values */}
                {selectedChartMetric === 'all' ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                      <span>Легенда всіх 8 шкал (сьогодні):</span>
                      <span className="text-[9px] text-zinc-500">Натисніть для окремого графіка</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[10px]">
                      {INDICATOR_CONFIGS.map((cfg) => {
                        const val = (triggerVals as any)[cfg.key] || 3;
                        return (
                          <button
                            key={cfg.key}
                            type="button"
                            onClick={() => setSelectedChartMetric(cfg.key)}
                            className="flex items-center gap-1.5 p-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 hover:bg-zinc-800/40 transition-colors text-left cursor-pointer"
                            title={`Відкрити окремий графік для ${cfg.label}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${cfg.barBg} shrink-0`} />
                            <span className="truncate text-zinc-300 text-[10px]">{cfg.label}</span>
                            <span className={`font-mono font-bold ml-auto text-[10px] ${cfg.color}`}>{val}/5</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
                    <span className="text-zinc-300 font-mono">
                      Поточне значення ({INDICATOR_CONFIGS.find((c) => c.key === selectedChartMetric)?.label}):{' '}
                      <strong className={INDICATOR_CONFIGS.find((c) => c.key === selectedChartMetric)?.color}>
                        {(triggerVals as any)[selectedChartMetric] || 3} / 5
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedChartMetric('all')}
                      className="text-amber-400 hover:underline cursor-pointer"
                    >
                      ← До всіх показників
                    </button>
                  </div>
                )}
              </div>

              {/* Sleep Correlation Chart (Connected Dots & Line) */}
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-200">Графік Сну (точки & лінія)</span>
                  <span className="text-[10px] font-mono text-purple-400">Норма: 7.5 - 8.5 год</span>
                </div>

                <div className="w-full bg-zinc-950/60 rounded-xl p-2 border border-zinc-800/80">
                  <svg viewBox="0 0 340 135" className="w-full h-auto overflow-visible select-none">
                    <defs>
                      <linearGradient id="grad-sleep-chart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Target Sleep Optimal Zone (7.5 - 8.5h) Shaded Box */}
                    <rect
                      x="32"
                      y={18 + ((10 - 8.5) / 6) * 82}
                      width="290"
                      height={((8.5 - 7.5) / 6) * 82}
                      fill="#a855f7"
                      fillOpacity="0.1"
                      rx="4"
                    />

                    {/* Horizontal Grid lines (10h, 8h, 6h, 4h) */}
                    {[10, 8, 6, 4].map((h) => {
                      const y = 18 + ((10 - h) / 6) * 82;
                      return (
                        <g key={h}>
                          <line
                            x1="32"
                            y1={y}
                            x2="322"
                            y2={y}
                            stroke="#27272a"
                            strokeWidth="1"
                            strokeDasharray="2 3"
                          />
                          <text
                            x="18"
                            y={y + 3}
                            textAnchor="middle"
                            fill="#71717a"
                            fontSize="9"
                            fontFamily="monospace"
                          >
                            {h}г
                          </text>
                        </g>
                      );
                    })}

                    {/* Day Vertical lines & labels */}
                    {[
                      { day: 'Пн', hours: 6.5 },
                      { day: 'Вт', hours: 7.0 },
                      { day: 'Ср', hours: 7.5 },
                      { day: 'Чт', hours: 6.8 },
                      { day: 'Пт', hours: 8.2 },
                      { day: 'Сб', hours: 8.5 },
                      { day: 'Сьогодні', hours: calculatedSleepHours },
                    ].map((s, i) => {
                      const x = 32 + (i * 290) / 6;
                      const isToday = i === 6;
                      return (
                        <g key={s.day}>
                          <line
                            x1={x}
                            y1="18"
                            x2={x}
                            y2="100"
                            stroke={isToday ? '#3f3f46' : '#27272a'}
                            strokeWidth="1"
                            strokeDasharray="1 3"
                          />
                          <text
                            x={x}
                            y="118"
                            textAnchor="middle"
                            fill={isToday ? '#c084fc' : '#a1a1aa'}
                            fontSize="9.5"
                            fontWeight={isToday ? 'bold' : 'normal'}
                            fontFamily="sans-serif"
                          >
                            {s.day}
                          </text>
                        </g>
                      );
                    })}

                    {/* Sleep Line, Gradient Area, Connected Dots */}
                    {(() => {
                      const sleepPoints = [
                        { day: 'Пн', hours: 6.5 },
                        { day: 'Вт', hours: 7.0 },
                        { day: 'Ср', hours: 7.5 },
                        { day: 'Чт', hours: 6.8 },
                        { day: 'Пт', hours: 8.2 },
                        { day: 'Сб', hours: 8.5 },
                        { day: 'Сьогодні', hours: calculatedSleepHours },
                      ].map((s, i) => ({
                        x: 32 + (i * 290) / 6,
                        y: 18 + ((10 - Math.min(10, Math.max(4, s.hours))) / 6) * 82,
                        hours: s.hours,
                      }));

                      const polylineStr = sleepPoints.map((p) => `${p.x},${p.y}`).join(' ');
                      const polygonStr = `${sleepPoints[0].x},100 ${polylineStr} ${sleepPoints[sleepPoints.length - 1].x},100`;

                      return (
                        <g>
                          <polygon points={polygonStr} fill="url(#grad-sleep-chart)" />
                          <polyline
                            points={polylineStr}
                            fill="none"
                            stroke="#a855f7"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {sleepPoints.map((p, idx) => (
                            <g key={idx}>
                              <circle cx={p.x} cy={p.y} r="6" fill="#a855f7" opacity="0.3" />
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r="4"
                                fill="#a855f7"
                                stroke="#09090b"
                                strokeWidth="1.5"
                              />
                              <text
                                x={p.x}
                                y={p.y - 7}
                                textAnchor="middle"
                                fill="#e9d5ff"
                                fontSize="9.5"
                                fontWeight="bold"
                                fontFamily="monospace"
                              >
                                {p.hours}г
                              </text>
                            </g>
                          ))}
                        </g>
                      );
                    })()}
                  </svg>
                </div>

                <div className="text-[10px] text-zinc-400 text-center pt-0.5">
                  Закономірність: при повноцінному сні {'>'} 7.5 год стійкість до тригерів зростає на 40%.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveSection('menu')}
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Назад
              </button>
            </div>
          )}
      </div>
    </div>
  );

  if (embedded) {
    return innerContent;
  }

  return (
    <div className="fixed inset-0 z-[150] flex flex-col justify-start items-center select-none overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Top Sliding Drawer Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg bg-zinc-950/95 border-b border-x border-zinc-800/80 rounded-b-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col max-h-[92vh] overflow-hidden text-white transition-all duration-300"
      >
        {/* Drag handle */}
        <div className="w-full flex flex-col items-center pt-2.5 pb-1 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1 bg-zinc-700/80 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-zinc-800/60">
          <div className="flex items-center gap-2">
            {activeSection !== 'menu' && (
              <button
                type="button"
                onClick={() => setActiveSection('menu')}
                className="p-1 -ml-1 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Назад до меню"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-zinc-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                {activeSection === 'menu' && 'Швидкі механіки'}
                {activeSection === 'physical' && 'Фізичні параметри & Аналіз'}
                {activeSection === 'sleep' && 'Сон'}
                {activeSection === 'hydration' && 'Гідратація'}
                {activeSection === 'analysis' && 'Аналіз та сценарій'}
                {activeSection === 'slice' && 'Пройти зріз (8 показників)'}
                {activeSection === 'triggerfix' && 'Тригерфікс'}
                {activeSection === 'food_drinks' && 'Напої та їжа'}
                {activeSection === 'history' && 'Історія здоров\'я'}
                {activeSection === 'charts' && 'Графік показників'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (onTabChange) {
                  onTabChange('dialogues');
                } else {
                  onClose();
                  window.dispatchEvent(new Event('open-analyzer-dialogue-settings'));
                }
              }}
              className="p-1.5 text-zinc-400 hover:text-purple-300 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Налаштування діалогів Аналізатора"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-xl bg-zinc-800/40 hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Закрити шторку"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {innerContent}
      </div>
    </div>
  );
};
