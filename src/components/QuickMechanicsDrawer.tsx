import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnalysisAndScenariosSection } from './AnalysisAndScenariosSection';
import { ToughestTimeSection } from './ToughestTimeSection';
import { ToughestTimeChart } from './ToughestTimeChart';
import { SleepScheduleAnalytics } from './SleepScheduleAnalytics';
import { EnhancedChartsSection } from './EnhancedChartsSection';
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
  Info,
  Plus,
  Tag,
  Pin,
  Gift,
  Target,
  Trophy,
  RefreshCw
} from 'lucide-react';

export type QuickMechanicsSection =
  | 'menu'
  | 'daily_checkin'
  | 'physical'
  | 'sleep'
  | 'hydration'
  | 'analysis'
  | 'slice'
  | 'triggerfix'
  | 'food_drinks'
  | 'history'
  | 'charts'
  | 'toughest_time'
  | 'goal'
  | 'quick_goal';

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
  onSectionChange?: (sec: QuickMechanicsSection) => void;
  onboardingStep?: 'none' | 'physical' | 'sleep' | 'hydration' | 'slice' | 'completed';
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
  onSectionChange,
  onboardingStep = 'none',
}) => {
  const [activeSection, setActiveSectionState] = useState<QuickMechanicsSection>(initialSection);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isOnboarding = onboardingStep !== 'none' && onboardingStep !== 'completed';
  const isOnboardingPhysical = onboardingStep === 'physical';
  const isOnboardingSleep = onboardingStep === 'sleep';
  const isOnboardingHydration = onboardingStep === 'hydration';
  const isOnboardingSlice = onboardingStep === 'slice';

  const setActiveSection = useCallback((sec: QuickMechanicsSection) => {
    setActiveSectionState(sec);
    onSectionChange?.(sec);
  }, [onSectionChange]);

  // Sync initial section on open
  useEffect(() => {
    if (isOpen) {
      setActiveSection(initialSection);
    }
  }, [isOpen, initialSection, setActiveSection]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  }, []);

  // Quick access pinned sections state (sync with Main page tiles)
  const [pinnedSections, setPinnedSections] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('quit-smoking:pinned-more-sections');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  useEffect(() => {
    const handlePinnedChange = () => {
      try {
        const raw = localStorage.getItem('quit-smoking:pinned-more-sections');
        if (raw !== null) {
          setPinnedSections(JSON.parse(raw));
        }
      } catch {}
    };
    const handleOpenQuickMechanicsEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const section = customEvent.detail;
      if (section) {
        setActiveSection(section);
      }
    };
    window.addEventListener('pinned-more-sections-change', handlePinnedChange);
    window.addEventListener('storage', handlePinnedChange);
    window.addEventListener('open-quick-mechanics', handleOpenQuickMechanicsEvent);
    return () => {
      window.removeEventListener('pinned-more-sections-change', handlePinnedChange);
      window.removeEventListener('storage', handlePinnedChange);
      window.removeEventListener('open-quick-mechanics', handleOpenQuickMechanicsEvent);
    };
  }, [setActiveSection]);

  const togglePinSection = useCallback((key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let next: string[];
    const isPinned = pinnedSections.includes(key);
    if (isPinned) {
      next = pinnedSections.filter((k) => k !== key);
      showToast('Плитку прибрано з Головної');
    } else {
      next = [...pinnedSections, key];
      showToast('Плитку закріплено на Головній!');
    }
    setPinnedSections(next);
    try {
      localStorage.setItem('quit-smoking:pinned-more-sections', JSON.stringify(next));
      window.dispatchEvent(new Event('pinned-more-sections-change'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, [pinnedSections, showToast]);

  const renderPinButton = useCallback((key: string, extraCls: string = '') => {
    const isPinned = pinnedSections.includes(key);
    return (
      <button
        type="button"
        onClick={(e) => togglePinSection(key, e)}
        className={`p-1.5 rounded-xl transition-all cursor-pointer ${
          isPinned
            ? 'text-zinc-100 hover:text-white bg-zinc-800/80 border border-zinc-700/60 shadow-xs'
            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
        } ${extraCls}`}
        title={isPinned ? 'Прибрати плитку з Головної' : 'Закріпити плитку на Головній'}
      >
        <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current text-zinc-100' : ''}`} />
      </button>
    );
  }, [pinnedSections, togglePinSection]);

  // ================= DAILY CHECK-IN STATE =================
  const [checkinStep, setCheckinStep] = useState<number>(0);
  const [checkinWater, setCheckinWater] = useState<number>(0);
  const [checkinSleepQuality, setCheckinSleepQuality] = useState<number>(4);
  const [checkinCraving, setCheckinCraving] = useState<number>(4);
  const [checkinThoughts, setCheckinThoughts] = useState<number>(4);
  const [checkinAnxiety, setCheckinAnxiety] = useState<number>(2);
  const [checkinIrritability, setCheckinIrritability] = useState<number>(2);
  const [checkinCalmness, setCheckinCalmness] = useState<number>(8);
  const [checkinEnergy, setCheckinEnergy] = useState<number>(7);
  const [checkinFocus, setCheckinFocus] = useState<number>(7);
  const [checkinOverall, setCheckinOverall] = useState<number>(8);
  const [checkinAdvice, setCheckinAdvice] = useState<string | null>(null);
  const [checkinLoadingAdvice, setCheckinLoadingAdvice] = useState<boolean>(false);
  const [existingCheckinData, setExistingCheckinData] = useState<any>(null);

  // Synchronize existing check-in data when opening daily_checkin
  useEffect(() => {
    if (activeSection === 'daily_checkin') {
      try {
        const today = getTodayDateStr();
        const raw = localStorage.getItem(`quit-smoking:health-checkin:${today}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          setExistingCheckinData(parsed);
          if (parsed.water) setCheckinWater(parsed.water);
          if (parsed.sleepQuality) setCheckinSleepQuality(parsed.sleepQuality);
          if (parsed.craving) setCheckinCraving(parsed.craving);
          if (parsed.thoughts) setCheckinThoughts(parsed.thoughts);
          if (parsed.anxiety) setCheckinAnxiety(parsed.anxiety);
          if (parsed.irritability) setCheckinIrritability(parsed.irritability);
          if (parsed.calmness) setCheckinCalmness(parsed.calmness);
          if (parsed.energy) setCheckinEnergy(parsed.energy);
          if (parsed.focus) setCheckinFocus(parsed.focus);
          if (parsed.overall) setCheckinOverall(parsed.overall);
        } else {
          setExistingCheckinData(null);
          const rawHydration = localStorage.getItem(`quit-smoking:hydration-${today}`);
          if (rawHydration) {
            setCheckinWater(parseInt(rawHydration, 10) || 0);
          }
        }
      } catch {
        setExistingCheckinData(null);
      }
    }
  }, [activeSection]);

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

      localStorage.setItem(`quit-smoking:sleep-${today}`, JSON.stringify({
        hours: calculatedSleepHours,
        bedtime,
        wakeTime,
        quality: sleepQuality
      }));

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
      window.dispatchEvent(new Event('sleep-updated'));
      window.dispatchEvent(new Event('quick-mechanics-updated'));
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

  // ================= 5. SLICE / SURVEY ALL 8 INDICATORS STATE (1 to 10 scale) =================
  const [sliceCraving, setSliceCraving] = useState<number>(4);
  const [sliceThoughts, setSliceThoughts] = useState<number>(4);
  const [sliceAnxiety, setSliceAnxiety] = useState<number>(2);
  const [sliceIrritability, setSliceIrritability] = useState<number>(2);
  const [sliceCalmness, setSliceCalmness] = useState<number>(8);
  const [sliceEnergy, setSliceEnergy] = useState<number>(7);
  const [sliceFocus, setSliceFocus] = useState<number>(7);
  const [sliceOverall, setSliceOverall] = useState<number>(8);
  const [sliceFluctuation, setSliceFluctuation] = useState<string>('stable');
  const [sliceNote, setSliceNote] = useState<string>('');

  // Sync initial daily check-in states
  useEffect(() => {
    if (activeSection === 'daily_checkin') {
      setCheckinStep(0);
      setCheckinWater(hydrationMl);
      setCheckinSleepQuality(4);
      setCheckinCraving(sliceCraving);
      setCheckinThoughts(sliceThoughts);
      setCheckinAnxiety(sliceAnxiety);
      setCheckinIrritability(sliceIrritability);
      setCheckinCalmness(sliceCalmness);
      setCheckinEnergy(sliceEnergy);
      setCheckinFocus(sliceFocus);
      setCheckinOverall(sliceOverall);
      setCheckinAdvice(null);
    }
  }, [
    activeSection,
    hydrationMl,
    sliceCraving,
    sliceThoughts,
    sliceAnxiety,
    sliceIrritability,
    sliceCalmness,
    sliceEnergy,
    sliceFocus,
    sliceOverall
  ]);

  // Load last slice values if available (converting 1-5 scale to 1-10 scale if needed)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('quit-smoking:latest-slice');
      if (raw) {
        const last = JSON.parse(raw);
        const normalizeVal = (v: any, fallback: number) => {
          if (v === undefined || isNaN(Number(v))) return fallback;
          const num = Number(v);
          return Math.min(10, Math.max(1, Math.round(num)));
        };
        if (last.craving !== undefined) setSliceCraving(normalizeVal(last.craving, 4));
        if (last.thoughts !== undefined) setSliceThoughts(normalizeVal(last.thoughts, 4));
        if (last.anxiety !== undefined) setSliceAnxiety(normalizeVal(last.anxiety, 2));
        if (last.irritability !== undefined) setSliceIrritability(normalizeVal(last.irritability, 2));
        if (last.calmness !== undefined) setSliceCalmness(normalizeVal(last.calmness, 8));
        if (last.energy !== undefined) setSliceEnergy(normalizeVal(last.energy, 7));
        if (last.focus !== undefined) setSliceFocus(normalizeVal(last.focus, 7));
        if (last.overall !== undefined) setSliceOverall(normalizeVal(last.overall, 8));
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
        title: 'Опитування стану',
        detail: `Тяга: ${sliceCraving}/10 • Думки: ${sliceThoughts}/10 • Спокій: ${sliceCalmness}/10 • Енергія: ${sliceEnergy}/10`,
        impact: sliceCraving <= 4 ? 'Висока стабільність' : 'Опитування збережено',
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
      window.dispatchEvent(new Event('slice-saved'));
      window.dispatchEvent(new Event('quick-mechanics-updated'));
      window.dispatchEvent(new Event('storage'));
      
      showToast('Опитування збережено');
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

  const handleGenerateCheckinAdvice = async () => {
    setCheckinLoadingAdvice(true);
    setCheckinStep(3);
    try {
      const res = await fetch('/api/analyzer/live-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diffDays: 1,
          craving: checkinCraving,
          energy: checkinEnergy,
          water: checkinWater,
          waterNorm: waterNormMl,
          sleepHours: calculatedSleepHours,
          sleepQuality: checkinSleepQuality,
          slice: {
            craving: checkinCraving,
            thoughts: checkinThoughts,
            anxiety: checkinAnxiety,
            irritability: checkinIrritability,
            calmness: checkinCalmness,
            energy: checkinEnergy,
            focus: checkinFocus,
            overall: checkinOverall,
            note: 'Щоденний ШІ Чек-ін'
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCheckinAdvice(data);
      } else {
        throw new Error('API failed');
      }
    } catch (e) {
      setCheckinAdvice({
        headline: checkinCraving >= 6 ? 'Підвищене нервове напруження' : 'Вегетативний баланс стабільний',
        statusLevel: checkinCraving >= 6 ? 'warning' : 'optimal',
        healthScore: Math.round(100 - (checkinCraving * 3) - (checkinAnxiety * 2) - (checkinIrritability * 2) + (checkinCalmness * 2) + (checkinEnergy * 2) + (checkinFocus * 2) + (checkinOverall * 2)),
        bodySummary: `Зафіксовано воду: ${checkinWater} мл, сон: ${calculatedSleepHours} год. Зріз (8 показників): Тяга ${checkinCraving}/10, Думки ${checkinThoughts}/10, Тривога ${checkinAnxiety}/10, Дратівливість ${checkinIrritability}/10, Спокій ${checkinCalmness}/10, Енергія ${checkinEnergy}/10, Фокус ${checkinFocus}/10, Загальний ${checkinOverall}/10.`,
        immediateAction: checkinCraving >= 6 ? 'Зробіть 5 повільних дихальних циклів 4-7-8 та випийте склянку теплої води.' : 'Випийте повільними ковтками свіжу воду для детоксу.',
        quickTips: [
          `Регулярно поповнюйте водний баланс (норма — ${waterNormMl} мл).`,
          checkinSleepQuality <= 2 ? 'Сон був неспокійним: обмежте каву та чай сьогодні для стабілізації пульсу.' : 'Сон підтримує відновлення дофамінових рецепторів.',
          'Пройдіть 5 хвилин пішої прогулянки на свіжому повітрі для стимуляції кровообігу.'
        ],
        biologicalFocus: 'Дофамінова стабілізація та нирковий кліренс котиніну',
        neuroBiologicalInsight: 'Регулярне пиття води відновлює церебральну перфузію, знижуючи в\'язкість крові.',
        personalizedAffirmation: 'Ваш організм щохвилини успішно відновлює природний дофаміновий баланс.'
      } as any);
    } finally {
      setCheckinLoadingAdvice(false);
    }
  };

  const handleCompleteCheckin = () => {
    try {
      const today = getTodayDateStr();
      const now = Date.now();
      const timeStr = getCurrentTimeStr();

      // Read existing check-in data to handle intermediate check-ins for the day
      const existingRaw = localStorage.getItem(`quit-smoking:health-checkin:${today}`);
      let existing: any = null;
      try {
        existing = existingRaw ? JSON.parse(existingRaw) : null;
      } catch {}

      const prevEntries = existing && Array.isArray(existing.entries) 
        ? existing.entries 
        : (existing && existing.timestamp ? [{
            id: existing.timestamp,
            timestamp: existing.timestamp,
            time: existing.time || '09:00',
            water: existing.water || 0,
            sleepHours: existing.sleepHours || calculatedSleepHours,
            sleepQuality: existing.sleepQuality || checkinSleepQuality,
            craving: existing.craving || checkinCraving,
            thoughts: existing.thoughts || checkinThoughts,
            anxiety: existing.anxiety || checkinAnxiety,
            irritability: existing.irritability || checkinIrritability,
            calmness: existing.calmness || checkinCalmness,
            energy: existing.energy || checkinEnergy,
            focus: existing.focus || checkinFocus,
            overall: existing.overall || checkinOverall,
          }] : []);

      const checkinIndex = prevEntries.length + 1;
      const isRecheckin = prevEntries.length > 0;

      const newEntry = {
        id: now,
        timestamp: now,
        time: timeStr,
        water: checkinWater,
        sleepHours: calculatedSleepHours,
        sleepQuality: checkinSleepQuality,
        craving: checkinCraving,
        thoughts: checkinThoughts,
        anxiety: checkinAnxiety,
        irritability: checkinIrritability,
        calmness: checkinCalmness,
        energy: checkinEnergy,
        focus: checkinFocus,
        overall: checkinOverall,
        note: isRecheckin ? `Проміжний зріз чек-іну #${checkinIndex}` : 'Щоденний ШІ чек-ін',
      };

      const allEntries = [...prevEntries, newEntry];

      // Calculate intermediate daily averages across all entries today
      const calcAvg = (getter: (e: any) => number) => {
        const sum = allEntries.reduce((acc, e) => acc + (getter(e) || 0), 0);
        return Number((sum / allEntries.length).toFixed(1));
      };

      const intermediateAverages = {
        craving: calcAvg(e => e.craving),
        thoughts: calcAvg(e => e.thoughts),
        anxiety: calcAvg(e => e.anxiety),
        irritability: calcAvg(e => e.irritability),
        calmness: calcAvg(e => e.calmness),
        energy: calcAvg(e => e.energy),
        focus: calcAvg(e => e.focus),
        overall: calcAvg(e => e.overall),
        water: checkinWater,
        sleepHours: calculatedSleepHours,
        sleepQuality: checkinSleepQuality,
      };

      setHydrationMl(checkinWater);
      localStorage.setItem(`quit-smoking:hydration-${today}`, String(checkinWater));
      logHealthEvent({
        category: 'hydration',
        title: isRecheckin ? `Чек-ін (проміжний #${checkinIndex}): Вода` : 'Чек-ін: Вода',
        detail: `Зафіксовано ${checkinWater} мл води`,
        impact: checkinWater >= waterNormMl ? 'Норму виконано!' : 'Гідратація відновлюється',
      });

      localStorage.setItem('quit-smoking:sleep-bedtime', bedtime);
      localStorage.setItem('quit-smoking:sleep-waketime', wakeTime);
      localStorage.setItem('quit-smoking:sleep-quality', String(checkinSleepQuality));

      const rawSleep = localStorage.getItem('quit-smoking:sleep-history');
      const sleepList = rawSleep ? JSON.parse(rawSleep) : [];
      const updatedSleep = [
        {
          date: today,
          bedtime,
          wakeTime,
          hours: calculatedSleepHours,
          quality: checkinSleepQuality,
        },
        ...sleepList.filter((x: any) => x.date !== today),
      ].slice(0, 14);
      localStorage.setItem('quit-smoking:sleep-history', JSON.stringify(updatedSleep));

      localStorage.setItem(`quit-smoking:sleep-${today}`, JSON.stringify({
        hours: calculatedSleepHours,
        bedtime,
        wakeTime,
        quality: checkinSleepQuality
      }));

      const record: SliceRecord = {
        id: now,
        date: today,
        time: timeStr,
        craving: checkinCraving,
        thoughts: checkinThoughts,
        anxiety: checkinAnxiety,
        irritability: checkinIrritability,
        calmness: checkinCalmness,
        energy: checkinEnergy,
        focus: checkinFocus,
        overall: checkinOverall,
        fluctuation: checkinCraving >= 6 ? 'гостра тяга' : checkinCalmness >= 7 ? 'спокій' : 'стабільний',
        note: isRecheckin ? `Проміжний ШІ чек-ін #${checkinIndex}` : 'Щоденний ШІ чек-ін',
      };

      localStorage.setItem('quit-smoking:last-prompt', String(now));
      localStorage.setItem('quit-smoking:last-slice-time', String(now));
      localStorage.setItem('quit-smoking:latest-slice', JSON.stringify(record));

      // Also update drawer slice states
      setSliceCraving(checkinCraving);
      setSliceThoughts(checkinThoughts);
      setSliceAnxiety(checkinAnxiety);
      setSliceIrritability(checkinIrritability);
      setSliceCalmness(checkinCalmness);
      setSliceEnergy(checkinEnergy);
      setSliceFocus(checkinFocus);
      setSliceOverall(checkinOverall);

      const rawSlices = localStorage.getItem('quit-smoking:health-slices');
      const slicesList = rawSlices ? JSON.parse(rawSlices) : [];
      slicesList.push(record);
      localStorage.setItem('quit-smoking:health-slices', JSON.stringify(slicesList.slice(-100)));

      const savedDays = localStorage.getItem('quit-smoking:days');
      const daysMap = savedDays ? JSON.parse(savedDays) : {};
      if (!daysMap[today]) daysMap[today] = { surveys: [] };
      if (!daysMap[today].surveys) daysMap[today].surveys = [];
      daysMap[today].surveys.push({
        id: `checkin_${now}`,
        timestamp: new Date().toISOString(),
        time: timeStr,
        craving: checkinCraving,
        intrusiveThoughts: checkinThoughts,
        anxiety: checkinAnxiety,
        energy: checkinEnergy,
        focus: checkinFocus,
        irritability: checkinIrritability,
        balance: checkinCalmness,
        mood: checkinOverall,
        triggers: [],
        note: isRecheckin ? `Проміжний ШІ чек-ін #${checkinIndex}` : 'Щоденний ШІ чек-ін',
      });
      daysMap[today].craving = intermediateAverages.craving;
      daysMap[today].mood = intermediateAverages.overall;
      daysMap[today].energy = intermediateAverages.energy;
      daysMap[today].focus = intermediateAverages.focus;
      daysMap[today].calmness = intermediateAverages.calmness;
      daysMap[today].checkinsCount = allEntries.length;
      daysMap[today].waterMl = checkinWater;
      localStorage.setItem('quit-smoking:days', JSON.stringify(daysMap));

      logHealthEvent({
        category: 'slice',
        title: isRecheckin ? `Чек-ін (проміжний #${checkinIndex}): Зріз стану` : 'Чек-ін: Зріз стану',
        detail: `Тяга: ${checkinCraving}/10 • Думки: ${checkinThoughts}/10 • Спокій: ${checkinCalmness}/10 • Енергія: ${checkinEnergy}/10`,
        impact: checkinCraving <= 4 ? 'Висока стабільність' : 'Проміжний зріз зафіксовано',
      });

      setTriggerVals({
        craving: checkinCraving,
        thoughts: checkinThoughts,
        anxiety: checkinAnxiety,
        irritability: checkinIrritability,
        calmness: checkinCalmness,
        energy: checkinEnergy,
        focus: checkinFocus,
        overall: checkinOverall,
      });

      const updatedCheckinObj = {
        completed: true,
        timestamp: now,
        time: timeStr,
        water: checkinWater,
        sleepHours: calculatedSleepHours,
        sleepQuality: checkinSleepQuality,
        craving: checkinCraving,
        thoughts: checkinThoughts,
        anxiety: checkinAnxiety,
        irritability: checkinIrritability,
        calmness: checkinCalmness,
        energy: checkinEnergy,
        focus: checkinFocus,
        overall: checkinOverall,
        entries: allEntries,
        averages: intermediateAverages,
        intermediateCount: allEntries.length,
      };
      localStorage.setItem(`quit-smoking:health-checkin:${today}`, JSON.stringify(updatedCheckinObj));

      window.dispatchEvent(new CustomEvent('slice-saved-result', { detail: record }));
      window.dispatchEvent(new Event('hydration-updated'));
      window.dispatchEvent(new Event('sleep-updated'));
      window.dispatchEvent(new Event('health-indicators-changed'));
      window.dispatchEvent(new Event('analyzer-data-synced'));
      window.dispatchEvent(new Event('slice-saved'));
      window.dispatchEvent(new Event('health-slices-change'));
      window.dispatchEvent(new Event('checkin-updated'));
      window.dispatchEvent(new Event('quick-mechanics-updated'));
      window.dispatchEvent(new Event('storage'));

      showToast(isRecheckin 
        ? `🎉 Проміжний чек-ін #${checkinIndex} зафіксовано та оновлено у всіх системах!` 
        : '🎉 Щоденний Чек-ін успішно збережено та синхронізовано!');
      setActiveSection('menu');
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Помилка при збереженні чек-іну');
    }
  };

  const DEFAULT_TRIGGER_LIST = useMemo(() => [
    { id: 'coffee', name: 'Кава / Чай', emoji: '☕' },
    { id: 'stress', name: 'Стрес / Емоція', emoji: '⚡' },
    { id: 'freetime', name: 'Вільний час / Нудьга', emoji: '🥱' },
    { id: 'work', name: 'Робота / Дедлайн', emoji: '💼' },
    { id: 'alcohol', name: 'Алкоголь / Вечірка', emoji: '🍷' },
    { id: 'after_food', name: 'Після їжі', emoji: '🍲' },
    { id: 'company', name: 'Компанія / Спілкування', emoji: '👥' },
    { id: 'drive', name: 'За кермом / Дорога', emoji: '🚗' },
    { id: 'tiredness', name: 'Перевтома / Недосип', emoji: '🛌' },
    { id: 'phone', name: 'Телефон / Скролінг', emoji: '📱' },
    { id: 'evening', name: 'Вечірній відпочинок', emoji: '🛋️' },
    { id: 'argument', name: 'Суперечка / Конфлікт', emoji: '🗯️' },
  ], []);

  const [customTriggers, setCustomTriggers] = useState<Array<{ id: string; name: string; emoji: string }>>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:custom-user-triggers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [isAddingCustomTrigger, setIsAddingCustomTrigger] = useState<boolean>(false);
  const [newTriggerName, setNewTriggerName] = useState<string>('');
  const [newTriggerEmoji, setNewTriggerEmoji] = useState<string>('🎯');
  const [selectedTriggerReason, setSelectedTriggerReason] = useState<string>('coffee');

  const allTriggers = useMemo(() => {
    return [...DEFAULT_TRIGGER_LIST, ...customTriggers];
  }, [DEFAULT_TRIGGER_LIST, customTriggers]);

  const handleAddCustomTrigger = () => {
    const trimmed = newTriggerName.trim();
    if (!trimmed) return;
    const newId = `custom_${Date.now()}`;
    const newTrigger = {
      id: newId,
      name: trimmed,
      emoji: newTriggerEmoji || '🎯'
    };
    const updated = [...customTriggers, newTrigger];
    setCustomTriggers(updated);
    try {
      localStorage.setItem('quit-smoking:custom-user-triggers', JSON.stringify(updated));
    } catch {}
    setSelectedTriggerReason(newId);
    setNewTriggerName('');
    setIsAddingCustomTrigger(false);
    showToast(`Тригер «${trimmed}» створено!`);
  };

  const handleDeleteCustomTrigger = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = customTriggers.filter((t) => t.id !== id);
    setCustomTriggers(updated);
    try {
      localStorage.setItem('quit-smoking:custom-user-triggers', JSON.stringify(updated));
    } catch {}
    if (selectedTriggerReason === id) {
      setSelectedTriggerReason('coffee');
    }
    showToast('Власний тригер видалено');
  };

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
    const foundTrigger = allTriggers.find((t) => t.id === selectedTriggerReason);
    const triggerLabel = foundTrigger ? `${foundTrigger.emoji} ${foundTrigger.name}` : selectedTriggerReason;

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
      note: `Тригер: ${triggerLabel}`,
    };

    try {
      localStorage.setItem('quit-smoking:latest-slice', JSON.stringify(updatedRecord));

      // Save shift log specifically for analysis report
      const shiftLog: TriggerShiftLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        timeStr: time,
        trigger: triggerLabel,
        indicatorKey: changedIndicators.length > 0 ? changedIndicators[0].key : 'calmness',
        indicatorLabel: changedIndicators.length > 0 ? changedIndicators[0].label : 'Спокій',
        oldVal: changedIndicators.length > 0 ? changedIndicators[0].oldVal : triggerVals.calmness,
        newVal: changedIndicators.length > 0 ? changedIndicators[0].newVal : triggerVals.calmness,
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
        title: `Тригер: ${triggerLabel}`,
        detail: diffSummary,
        impact: 'Аналізатор адаптував прогноз',
      });

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

  // ================= 9. GOALS & QUICK GOALS STATE & ACTIONS =================
  const [goalsData, setGoalsData] = useState<{
    base: number;
    queue: Array<{ id: string; name: string; amount: number; targetDate?: string }>;
    done: Array<{ id: string; name: string; amount?: number; total?: number; doneAt?: string; completedAt?: number }>;
  }>(() => {
    try {
      const raw = localStorage.getItem('quit-smoking:goals');
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      base: 0,
      queue: [
        { id: 'g1', name: 'Бездротові навушники', amount: 3500 },
        { id: 'g2', name: 'Вікенд у Карпатах', amount: 9500 },
      ],
      done: [
        { id: 'gd1', name: 'Святкова вечеря', amount: 1200, doneAt: '2026-09-15' },
      ],
    };
  });

  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');

  const [quickGoal, setQuickGoal] = useState<{
    id: string;
    title: string;
    createdAt: number;
    targetTime: number;
    isCompleted?: boolean;
    claimedAt?: number;
  } | null>(() => {
    try {
      const raw = localStorage.getItem('quit-smoking:quick-goal');
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  });

  const [quickGoalNow, setQuickGoalNow] = useState(Date.now());
  const [quickGoalTitleInput, setQuickGoalTitleInput] = useState('');
  const [quickGoalDuration, setQuickGoalDuration] = useState(3);

  useEffect(() => {
    const t = setInterval(() => setQuickGoalNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const syncGoals = () => {
      try {
        const rawG = localStorage.getItem('quit-smoking:goals');
        if (rawG) setGoalsData(JSON.parse(rawG));
        const rawQG = localStorage.getItem('quit-smoking:quick-goal');
        setQuickGoal(rawQG ? JSON.parse(rawQG) : null);
      } catch {}
    };
    window.addEventListener('storage', syncGoals);
    window.addEventListener('goals-change', syncGoals);
    window.addEventListener('quick-goal-change', syncGoals);
    return () => {
      window.removeEventListener('storage', syncGoals);
      window.removeEventListener('goals-change', syncGoals);
      window.removeEventListener('quick-goal-change', syncGoals);
    };
  }, []);

  // Compute live savings
  const savedSavings = useMemo(() => {
    try {
      const rawM = localStorage.getItem('quit-smoking:money');
      const rawD = localStorage.getItem('quit-smoking:quit-date');
      if (rawM && rawD) {
        const money = JSON.parse(rawM);
        const startTime = parseInt(rawD, 10);
        const diffMs = Math.max(0, Date.now() - startTime);
        const days = diffMs / (1000 * 60 * 60 * 24);
        const packSize = money.packSize || 20;
        const daily = (money.perDay / packSize) * money.packPrice;
        return Math.floor(days * daily);
      }
    } catch {}
    return 56898;
  }, [isOpen, activeSection]);

  const netSavedForGoals = Math.max(0, savedSavings - (goalsData.base || 0));
  const activeMainGoal = goalsData.queue && goalsData.queue.length > 0 ? goalsData.queue[0] : null;
  const goalTargetAmount = activeMainGoal?.amount || 0;
  const goalProgressPct = goalTargetAmount > 0 ? Math.min(100, Math.floor((netSavedForGoals / goalTargetAmount) * 100)) : 0;
  const isMainGoalReached = goalProgressPct >= 100;

  const quickGoalStats = useMemo(() => {
    if (!quickGoal) return { active: false, pct: 0, timeLeftStr: '00:00', isReached: false };
    const total = quickGoal.targetTime - quickGoal.createdAt;
    const elapsed = quickGoalNow - quickGoal.createdAt;
    const isReached = quickGoalNow >= quickGoal.targetTime;
    const pct = isReached ? 100 : Math.min(100, Math.max(0, Math.floor((elapsed / (total || 1)) * 100)));
    const remainingMs = Math.max(0, quickGoal.targetTime - quickGoalNow);
    const totalSecs = Math.floor(remainingMs / 1000);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const timeLeftStr = h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
    return { active: true, pct, timeLeftStr, isReached };
  }, [quickGoal, quickGoalNow]);

  const handleAddNewGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim() || !newGoalAmount) return;
    const amt = parseFloat(newGoalAmount);
    if (isNaN(amt) || amt <= 0) return;
    const newG = {
      id: Math.random().toString(36).substring(2, 9),
      name: newGoalName.trim(),
      amount: amt,
      targetDate: newGoalDate || undefined,
    };
    const nextQueue = [...goalsData.queue, newG];
    const nextGoals = { ...goalsData, queue: nextQueue };
    setGoalsData(nextGoals);
    try {
      localStorage.setItem('quit-smoking:goals', JSON.stringify(nextGoals));
      window.dispatchEvent(new Event('goals-change'));
      window.dispatchEvent(new Event('storage'));
      showToast(`Ціль «${newG.name}» додано!`);
    } catch {}
    setNewGoalName('');
    setNewGoalAmount('');
    setNewGoalDate('');
  };

  const handleCompleteGoal = (id: string) => {
    const target = goalsData.queue.find((g) => g.id === id);
    if (!target) return;
    const nextQueue = goalsData.queue.filter((g) => g.id !== id);
    const nowStr = new Date().toISOString().split('T')[0];
    const doneItem = {
      id: target.id,
      name: target.name,
      amount: target.amount,
      total: target.amount,
      doneAt: nowStr,
      completedAt: Date.now(),
    };
    const nextDone = [doneItem, ...goalsData.done];
    const nextGoals = { ...goalsData, queue: nextQueue, done: nextDone };
    setGoalsData(nextGoals);
    try {
      localStorage.setItem('quit-smoking:goals', JSON.stringify(nextGoals));
      window.dispatchEvent(new Event('goals-change'));
      window.dispatchEvent(new Event('storage'));
      showToast(`🎉 Ціль «${target.name}» виконано!`);
    } catch {}
  };

  const handleDeleteGoal = (id: string) => {
    const nextQueue = goalsData.queue.filter((g) => g.id !== id);
    const nextGoals = { ...goalsData, queue: nextQueue };
    setGoalsData(nextGoals);
    try {
      localStorage.setItem('quit-smoking:goals', JSON.stringify(nextGoals));
      window.dispatchEvent(new Event('goals-change'));
      window.dispatchEvent(new Event('storage'));
      showToast('Ціль видалено');
    } catch {}
  };

  const handleStartQuickGoal = (hours: number, title?: string) => {
    const creation = Date.now();
    const target = creation + hours * 3600 * 1000;
    const item = {
      id: Math.random().toString(36).substring(2, 9),
      title: title?.trim() || `${hours} год стриманості`,
      createdAt: creation,
      targetTime: target,
      isCompleted: false,
    };
    try {
      localStorage.setItem('quit-smoking:quick-goal', JSON.stringify(item));
      setQuickGoal(item);
      window.dispatchEvent(new Event('quick-goal-change'));
      window.dispatchEvent(new Event('storage'));
      showToast(`Швидку ціль запущено на ${hours} год!`);
    } catch {}
    setQuickGoalTitleInput('');
  };

  const handleClaimQuickGoal = () => {
    if (!quickGoal) return;
    try {
      localStorage.removeItem('quit-smoking:quick-goal');
      setQuickGoal(null);
      window.dispatchEvent(new Event('quick-goal-change'));
      window.dispatchEvent(new Event('storage'));
      showToast('🎉 Вітаємо! Винагороду отримано!');
    } catch {}
  };

  const handleCancelQuickGoal = () => {
    try {
      localStorage.removeItem('quit-smoking:quick-goal');
      setQuickGoal(null);
      window.dispatchEvent(new Event('quick-goal-change'));
      window.dispatchEvent(new Event('storage'));
      showToast('Швидку ціль скасовано');
    } catch {}
  };

  if (!isOpen) return null;

  const innerContent = (
    <div className={`w-full max-w-full min-w-0 box-border overflow-x-hidden flex flex-col text-white ${embedded ? 'space-y-3' : ''}`}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="sticky top-1 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full bg-emerald-500/90 text-white text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-1.5 animate-fadeIn mx-auto w-fit">
          <Check className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Embedded Sub-section Header */}
      {embedded && activeSection !== 'menu' && (
        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 border border-zinc-800/80 gap-2 w-full min-w-0 box-border">
          {!isOnboarding ? (
            <button
              type="button"
              onClick={() => setActiveSection('menu')}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>До списку механік</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Початкове налаштування</span>
            </div>
          )}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-zinc-200 truncate max-w-[140px] sm:max-w-[180px]">
              {activeSection === 'physical' && 'Фізичні параметри'}
              {activeSection === 'sleep' && 'Сон'}
              {activeSection === 'hydration' && 'Гідратація'}
              {activeSection === 'analysis' && 'Аналіз'}
              {activeSection === 'slice' && 'Опитування (10 балів)'}
              {activeSection === 'triggerfix' && 'Тригер'}
              {activeSection === 'food_drinks' && 'Напої'}
              {activeSection === 'history' && 'Історія'}
              {activeSection === 'charts' && 'Графік'}
              {activeSection === 'toughest_time' && 'Хвиля тяги'}
              {activeSection === 'goal' && 'Ціль'}
              {activeSection === 'quick_goal' && 'Швидка ціль'}
            </span>
            {!isOnboarding && renderPinButton(`mechanics_${activeSection}`)}
          </div>
        </div>
      )}

      {/* Drawer Body */}
      <div className={embedded ? 'overflow-y-auto max-h-[62vh] pr-0.5 no-scrollbar space-y-3 w-full max-w-full min-w-0 box-border overflow-x-hidden' : 'p-3 sm:p-5 overflow-y-auto no-scrollbar max-h-[calc(92vh-80px)] w-full max-w-full min-w-0 box-border overflow-x-hidden'}>
        {/* ================= SECTION: MAIN MENU ================= */}
        {activeSection === 'menu' && (
          <div className="space-y-3">
              {/* 🌟 Щоденний ШІ Чек-ін */}
              {!isOnboarding && (
                <div
                  onClick={() => {
                    setActiveSection('daily_checkin');
                  }}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-[#10141f] border border-emerald-500/40 hover:border-emerald-400/60 shadow-lg flex items-center justify-between group cursor-pointer transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                        <span>Щоденний ШІ Чек-ін</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                          Рекомендовано
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-300 truncate mt-0.5">
                        Швидкий звіт: Вода • Сон • Зріз стану • Порада ШІ
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <span className="text-[10px] font-bold text-emerald-300 hidden sm:inline">Пройти</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              )}

              {/* ✨ GEMINI AI HEALTH ANALYZER BANNER */}
              {!isOnboarding && (
                <div
                  onClick={() => {
                    setActiveSection('analysis');
                  }}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-indigo-950/40 to-purple-950/50 border border-purple-500/40 hover:border-purple-400/60 shadow-lg shadow-purple-950/30 flex items-center justify-between group cursor-pointer transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                        <span>ШІ-Аналізатор (Gemini 3.8 Flash)</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                          Live
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-300 truncate mt-0.5">
                        Аналіз сну, води та зрізів у реальному часі • Швидка порада
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <span className="text-[10px] font-bold text-purple-300 hidden sm:inline">Аналізувати</span>
                    <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              )}

              {/* 1. TOP BUTTON: PHYSICAL PARAMETERS */}
              <div
                onClick={() => (!isOnboarding || isOnboardingPhysical) ? setActiveSection('physical') : null}
                className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between group shadow-xs active:scale-[0.99] ${
                  isOnboarding
                    ? isOnboardingPhysical
                      ? 'bg-[#18181f]/95 border-2 border-emerald-500/60 ring-2 ring-emerald-500/20 cursor-pointer shadow-md'
                      : 'bg-[#18181f]/40 border-zinc-800/40 filter blur-[3.5px] opacity-30 select-none pointer-events-none'
                    : 'bg-[#18181f]/90 border-zinc-800/80 hover:border-zinc-700 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-zinc-900 border text-zinc-200 flex items-center justify-center shadow-xs ${
                    isOnboardingPhysical ? 'border-emerald-500/40 text-emerald-300' : 'border-zinc-800'
                  }`}>
                    <User className="w-5 h-5 text-zinc-300" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-100 flex items-center gap-2">
                      <span>Фізичні параметри</span>
                      {isOnboardingPhysical && (
                        <span className="text-[9.5px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 rounded-md">Крок 1</span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      {age} р • {weight} кг • {height} см • {gender === 'male' ? 'Чоловік' : 'Жінка'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md border bg-zinc-900 text-zinc-300 border-zinc-800">
                    ІМТ {bmi}
                  </span>
                  {!isOnboarding && renderPinButton('mechanics_physical')}
                </div>
              </div>

              {/* GRID OF 8 MECHANICS */}
              <div className="grid grid-cols-2 gap-2.5 auto-rows-fr">
                {/* 2. SLEEP */}
                <div
                  onClick={() => (!isOnboarding || isOnboardingSleep) ? setActiveSection('sleep') : null}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group shadow-xs active:scale-[0.98] ${
                    isOnboarding
                      ? isOnboardingSleep
                        ? 'bg-[#18181f]/95 border-2 border-emerald-500/60 ring-2 ring-emerald-500/20 cursor-pointer shadow-md'
                        : 'bg-[#18181f]/40 border-zinc-800/40 filter blur-[3.5px] opacity-30 select-none pointer-events-none'
                      : 'bg-[#18181f]/90 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/60 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`w-8 h-8 rounded-xl bg-zinc-900 border text-zinc-200 flex items-center justify-center shadow-xs ${
                      isOnboardingSleep ? 'border-emerald-500/40 text-emerald-300' : 'border-zinc-800'
                    }`}>
                      <Moon className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-zinc-400">{calculatedSleepHours} год</span>
                      {!isOnboarding && renderPinButton('mechanics_sleep')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors">Сон</div>
                    <div className="text-[10px] text-zinc-400 truncate">{bedtime} – {wakeTime}</div>
                  </div>
                </div>

                {/* 3. HYDRATION */}
                <div
                  onClick={() => (!isOnboarding || isOnboardingHydration) ? setActiveSection('hydration') : null}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group shadow-xs active:scale-[0.98] ${
                    isOnboarding
                      ? isOnboardingHydration
                        ? 'bg-[#18181f]/95 border-2 border-emerald-500/60 ring-2 ring-emerald-500/20 cursor-pointer shadow-md'
                        : 'bg-[#18181f]/40 border-zinc-800/40 filter blur-[3.5px] opacity-30 select-none pointer-events-none'
                      : 'bg-[#18181f]/90 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/60 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`w-8 h-8 rounded-xl bg-zinc-900 border text-zinc-200 flex items-center justify-center shadow-xs ${
                      isOnboardingHydration ? 'border-emerald-500/40 text-emerald-300' : 'border-zinc-800'
                    }`}>
                      <Droplets className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-zinc-400">
                        {Math.round((hydrationMl / waterNormMl) * 100)}%
                      </span>
                      {!isOnboarding && renderPinButton('mechanics_hydration')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors">Гідратація</div>
                    <div className="text-[10px] text-zinc-400 font-mono truncate">{hydrationMl} / {waterNormMl} мл</div>
                  </div>
                </div>

                {/* 4. ШІ-АНАЛІЗАТОР (GEMINI AI LIVE) */}
                <div
                  onClick={() => (!isOnboarding ? setActiveSection('analysis') : null)}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group shadow-xs active:scale-[0.98] ${
                    isOnboarding
                      ? 'bg-[#18181f]/40 border-zinc-800/40 filter blur-[3.5px] opacity-30 select-none pointer-events-none'
                      : 'bg-gradient-to-br from-purple-950/30 to-[#18181f]/90 border-purple-500/30 hover:border-purple-400/60 hover:bg-zinc-800/60 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-xs">
                      <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Live AI
                      </span>
                      {!isOnboarding && renderPinButton('mechanics_analysis')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors leading-tight flex items-center gap-1">
                      <span>ШІ-Аналізатор</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">Сон, вода, зріз • Порада</div>
                  </div>
                </div>

                {/* 5. SLICE -> ОПИТУВАННЯ */}
                <div
                  onClick={() => (!isOnboarding || isOnboardingSlice) ? setActiveSection('slice') : null}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group shadow-xs active:scale-[0.98] ${
                    isOnboarding
                      ? isOnboardingSlice
                        ? 'bg-[#18181f]/95 border-2 border-emerald-500/60 ring-2 ring-emerald-500/20 cursor-pointer shadow-md'
                        : 'bg-[#18181f]/40 border-zinc-800/40 filter blur-[3.5px] opacity-30 select-none pointer-events-none'
                      : 'bg-[#18181f]/90 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/60 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`w-8 h-8 rounded-xl bg-zinc-900 border text-zinc-200 flex items-center justify-center shadow-xs ${
                      isOnboardingSlice ? 'border-emerald-500/40 text-emerald-300' : 'border-zinc-800'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-zinc-400">10 балів</span>
                      {!isOnboarding && renderPinButton('mechanics_slice')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors">Опитування</div>
                    <div className="text-[10px] text-zinc-400 truncate">8 шкал (1..10)</div>
                  </div>
                </div>

                {/* 6. TRIGGERFIX */}
                <div
                  onClick={() => (!isOnboarding ? setActiveSection('triggerfix') : null)}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group shadow-xs active:scale-[0.98] ${
                    isOnboarding
                      ? 'bg-[#18181f]/40 border-zinc-800/40 filter blur-[3.5px] opacity-30 select-none pointer-events-none'
                      : 'bg-[#18181f]/90 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/60 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center shadow-xs">
                      <AlertTriangle className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-zinc-400">Антидот</span>
                      {!isOnboarding && renderPinButton('mechanics_triggerfix')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors">Тригер</div>
                    <div className="text-[10px] text-zinc-400 truncate">Показник + причина</div>
                  </div>
                </div>

                {/* 7. FOOD & DRINKS -> НАПОЇ */}
                <div
                  onClick={() => (!isOnboarding ? setActiveSection('food_drinks') : null)}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group shadow-xs active:scale-[0.98] ${
                    isOnboarding
                      ? 'bg-[#18181f]/40 border-zinc-800/40 filter blur-[3.5px] opacity-30 select-none pointer-events-none'
                      : 'bg-[#18181f]/90 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/60 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center shadow-xs">
                      <Utensils className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-zinc-400">Баланс</span>
                      {!isOnboarding && renderPinButton('mechanics_food_drinks')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors">Напої</div>
                    <div className="text-[10px] text-zinc-400 truncate">Кава, вода, чай</div>
                  </div>
                </div>

                {/* 8. HISTORY -> ІСТОРІЯ */}
                <div
                  onClick={() => (!isOnboarding ? setActiveSection('history') : null)}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group shadow-xs active:scale-[0.98] ${
                    isOnboarding
                      ? 'bg-[#18181f]/40 border-zinc-800/40 filter blur-[3.5px] opacity-30 select-none pointer-events-none'
                      : 'bg-[#18181f]/90 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/60 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center shadow-xs">
                      <History className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-zinc-400">{healthLogs.length}</span>
                      {!isOnboarding && renderPinButton('mechanics_history')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors">Історія</div>
                    <div className="text-[10px] text-zinc-400 truncate">Заміри та лог подій</div>
                  </div>
                </div>

                {/* 9. CHARTS -> ГРАФІК */}
                <div
                  onClick={() => (!isOnboarding ? setActiveSection('charts') : null)}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group shadow-xs active:scale-[0.98] ${
                    isOnboarding
                      ? 'bg-[#18181f]/40 border-zinc-800/40 filter blur-[3.5px] opacity-30 select-none pointer-events-none'
                      : 'bg-[#18181f]/90 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/60 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center shadow-xs">
                      <TrendingUp className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-zinc-400">10 балів</span>
                      {!isOnboarding && renderPinButton('mechanics_charts')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors">Графік</div>
                    <div className="text-[10px] text-zinc-400 truncate">Динаміка опитувань</div>
                  </div>
                </div>

                {/* 10. TOUGHEST TIME -> ХВИЛЯ ТЯГИ */}
                <div
                  onClick={() => {
                    if (isOnboarding) return;
                    window.dispatchEvent(new CustomEvent('change-tab', { detail: 'state' }));
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('open-craving-wave'));
                    }, 80);
                    onClose?.();
                  }}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group shadow-xs active:scale-[0.98] col-span-2 ${
                    isOnboarding
                      ? 'bg-[#18181f]/40 border-zinc-800/40 filter blur-[3.5px] opacity-30 select-none pointer-events-none'
                      : 'bg-[#18181f]/90 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/80 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center shadow-xs">
                      <Flame className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                        У вкладці Стан
                      </span>
                      {!isOnboarding && renderPinButton('mechanics_toughest_time')}
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors flex items-center gap-1.5">
                        <span>Хвиля тяги</span>
                        <span className="text-[9px] font-mono text-zinc-400">→ Стан</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">
                        Періоди, сплески, таймер та графік
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 11. СИСТЕМА ЦІЛЬ */}
                <div
                  onClick={() => (!isOnboarding ? setActiveSection('goal') : null)}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group shadow-xs active:scale-[0.98] ${
                    isOnboarding
                      ? 'bg-[#18181f]/40 border-zinc-800/40 filter blur-[3.5px] opacity-30 select-none pointer-events-none'
                      : 'bg-[#18181f]/90 border-zinc-800/80 hover:border-amber-500/50 hover:bg-zinc-800/60 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center shadow-xs">
                      <Gift className="w-4 h-4 text-amber-300" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-amber-400 font-bold">
                        {goalProgressPct}%
                      </span>
                      {!isOnboarding && renderPinButton('mechanics_goal')}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-100 group-hover:text-amber-300 transition-colors truncate">Ціль</div>
                    <div className="text-[10px] text-zinc-400 truncate">{activeMainGoal?.name || 'Накопичення коштів'}</div>
                  </div>
                </div>

                {/* 12. СИСТЕМА ШВИДКА ЦІЛЬ */}
                <div
                  onClick={() => (!isOnboarding ? setActiveSection('quick_goal') : null)}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-[92px] min-h-[92px] group shadow-xs active:scale-[0.98] ${
                    isOnboarding
                      ? 'bg-[#18181f]/40 border-zinc-800/40 filter blur-[3.5px] opacity-30 select-none pointer-events-none'
                      : 'bg-[#18181f]/90 border-zinc-800/80 hover:border-yellow-500/50 hover:bg-zinc-800/60 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 flex items-center justify-center shadow-xs">
                      <Zap className="w-4 h-4 text-yellow-300" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-yellow-400 font-bold">
                        {quickGoalStats.active ? quickGoalStats.timeLeftStr : '1-24г'}
                      </span>
                      {!isOnboarding && renderPinButton('mechanics_quick_goal')}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-100 group-hover:text-yellow-300 transition-colors truncate">Швидка ціль</div>
                    <div className="text-[10px] text-zinc-400 truncate">{quickGoal?.title || 'Стриманість до 24г'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 1: PHYSICAL PARAMETERS ================= */}
          {activeSection === 'physical' && (
            <div className="space-y-3.5 text-left">
              {/* TOP SUMMARY STATS GRID (style matching Statistics window) */}
              <div className={`grid grid-cols-3 gap-2 transition-all duration-300 ${
                isOnboardingPhysical ? 'filter blur-[3.5px] opacity-35 select-none pointer-events-none' : ''
              }`}>
                <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                  <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Індекс маси (ІМТ)</div>
                  <div className="text-sm font-bold font-mono text-zinc-100 flex items-center gap-1">
                    <span>{bmi}</span>
                    <span className="text-[10px] font-sans font-medium text-zinc-400 truncate">({bmiCategory.label})</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                  <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Метаболізм (BMR)</div>
                  <div className="text-sm font-bold font-mono text-zinc-100 truncate">
                    ~{bmrKcal} <span className="text-[10px] font-normal text-zinc-400">ккал</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                  <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Норма води</div>
                  <div className="text-sm font-bold font-mono text-zinc-100 truncate">
                    {waterNormMl} <span className="text-[10px] font-normal text-zinc-400">мл</span>
                  </div>
                </div>
              </div>

              {/* INPUT CARDS GRID */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Age Card */}
                <div className={`p-3 rounded-2xl space-y-1.5 shadow-xs transition-all duration-300 ${
                  isOnboardingPhysical
                    ? 'bg-[#18181f]/95 border-2 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-[#18181f]/90 border border-zinc-800/80'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-medium ${isOnboardingPhysical ? 'text-emerald-300 font-bold' : 'text-zinc-300'}`}>
                      Вік (років)
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.max(14, age - 1);
                          setAge(next);
                          setInputAge(String(next));
                          try { localStorage.setItem('quit-smoking:physio-age', String(next)); } catch {}
                          window.dispatchEvent(new Event('health-indicators-changed'));
                        }}
                        className="w-5 h-5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.min(100, age + 1);
                          setAge(next);
                          setInputAge(String(next));
                          try { localStorage.setItem('quit-smoking:physio-age', String(next)); } catch {}
                          window.dispatchEvent(new Event('health-indicators-changed'));
                        }}
                        className="w-5 h-5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
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
                    className={`w-full text-lg font-bold bg-zinc-950/80 border rounded-xl px-2.5 py-1 text-zinc-100 focus:outline-none font-mono ${
                      isOnboardingPhysical ? 'border-emerald-500/40 focus:border-emerald-400' : 'border-zinc-800 focus:border-zinc-600'
                    }`}
                  />
                </div>

                {/* Weight Card */}
                <div className={`p-3 rounded-2xl space-y-1.5 shadow-xs transition-all duration-300 ${
                  isOnboardingPhysical
                    ? 'bg-[#18181f]/95 border-2 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-[#18181f]/90 border border-zinc-800/80'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-medium ${isOnboardingPhysical ? 'text-emerald-300 font-bold' : 'text-zinc-300'}`}>
                      Вага (кг)
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.max(30, Math.round((weight - 0.5) * 10) / 10);
                          setWeight(next);
                          setInputWeight(String(next));
                          try { localStorage.setItem('quit-smoking:physio-weight', String(next)); } catch {}
                          window.dispatchEvent(new Event('health-indicators-changed'));
                        }}
                        className="w-5 h-5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.min(220, Math.round((weight + 0.5) * 10) / 10);
                          setWeight(next);
                          setInputWeight(String(next));
                          try { localStorage.setItem('quit-smoking:physio-weight', String(next)); } catch {}
                          window.dispatchEvent(new Event('health-indicators-changed'));
                        }}
                        className="w-5 h-5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
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
                    className={`w-full text-lg font-bold bg-zinc-950/80 border rounded-xl px-2.5 py-1 text-zinc-100 focus:outline-none font-mono ${
                      isOnboardingPhysical ? 'border-emerald-500/40 focus:border-emerald-400' : 'border-zinc-800 focus:border-zinc-600'
                    }`}
                  />
                </div>

                {/* Height Card */}
                <div className={`p-3 rounded-2xl space-y-1.5 shadow-xs transition-all duration-300 ${
                  isOnboardingPhysical
                    ? 'bg-[#18181f]/95 border-2 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-[#18181f]/90 border border-zinc-800/80'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-medium ${isOnboardingPhysical ? 'text-emerald-300 font-bold' : 'text-zinc-300'}`}>
                      Зріст (см)
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.max(100, height - 1);
                          setHeight(next);
                          setInputHeight(String(next));
                          try { localStorage.setItem('quit-smoking:physio-height', String(next)); } catch {}
                          window.dispatchEvent(new Event('health-indicators-changed'));
                        }}
                        className="w-5 h-5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.min(240, height + 1);
                          setHeight(next);
                          setInputHeight(String(next));
                          try { localStorage.setItem('quit-smoking:physio-height', String(next)); } catch {}
                          window.dispatchEvent(new Event('health-indicators-changed'));
                        }}
                        className="w-5 h-5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
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
                    className={`w-full text-lg font-bold bg-zinc-950/80 border rounded-xl px-2.5 py-1 text-zinc-100 focus:outline-none font-mono ${
                      isOnboardingPhysical ? 'border-emerald-500/40 focus:border-emerald-400' : 'border-zinc-800 focus:border-zinc-600'
                    }`}
                  />
                </div>

                {/* Gender Card */}
                <div className={`p-3 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-1.5 shadow-xs flex flex-col justify-between transition-all duration-300 ${
                  isOnboardingPhysical ? 'filter blur-[3.5px] opacity-30 select-none pointer-events-none' : ''
                }`}>
                  <span className="text-[11px] font-medium text-zinc-300">Стать</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSavePhysical(age, weight, height, 'male')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        gender === 'male' 
                          ? 'bg-zinc-100 text-zinc-950 shadow-xs' 
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Чоловік
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSavePhysical(age, weight, height, 'female')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        gender === 'female' 
                          ? 'bg-zinc-100 text-zinc-950 shadow-xs' 
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Жінка
                    </button>
                  </div>
                </div>
              </div>

              {/* DETAILED BMI & PHYSIOLOGICAL CARD */}
              <div className={`p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-3 shadow-xs transition-all duration-300 ${
                isOnboardingPhysical ? 'filter blur-[4px] opacity-25 select-none pointer-events-none' : ''
              }`}>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-zinc-300" />
                    <span className="font-bold text-xs text-zinc-100">Індекс Маси Тіла (ІМТ)</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-zinc-800/90 text-zinc-200 border border-zinc-700/60">
                    ІМТ {bmi} • {bmiCategory.label}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11px] space-y-1">
                  <div className="text-zinc-300 font-medium">{bmiCategory.desc}</div>
                  <div className="text-zinc-400 font-medium">
                    🎯 Оптимальна вага для зросту ({height} см): <strong className="text-zinc-100 font-mono">{idealWeightRange.minW} – {idealWeightRange.maxW} кг</strong>
                  </div>
                </div>

                {/* 4 Biomarkers Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-0.5">
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-zinc-300" /> Базовий BMR
                    </div>
                    <div className="text-sm font-bold font-mono text-zinc-100">~{bmrKcal} ккал/день</div>
                    <div className="text-[9px] text-zinc-500">Витрата енергії у спокої</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-0.5">
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-zinc-300" /> Гідратація
                    </div>
                    <div className="text-sm font-bold font-mono text-zinc-100">{waterNormMl} мл/день</div>
                    <div className="text-[9px] text-zinc-500">35 мл на 1 кг ваги</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-0.5">
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-zinc-300" /> Кардіо-зона
                    </div>
                    <div className="text-sm font-bold font-mono text-zinc-100">{cardioRecoveryZone}</div>
                    <div className="text-[9px] text-zinc-500">Пульс для дренажу легень</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-0.5">
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" /> Детокс легень
                    </div>
                    <div className="text-sm font-bold font-mono text-zinc-100">Активна фаза</div>
                    <div className="text-[9px] text-zinc-500">Повне очищення тканин</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDonePhysical}
                className={`w-full py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-md active:scale-98 ${
                  isOnboardingPhysical
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 ring-2 ring-emerald-400/30 shadow-emerald-950/50'
                    : 'bg-zinc-100 hover:bg-white text-zinc-950'
                }`}
              >
                {isOnboardingPhysical ? 'Зберегти параметри та продовжити →' : 'Зберегти параметри'}
              </button>
            </div>
          )}

          {/* ================= SECTION 2: SLEEP ================= */}
          {activeSection === 'sleep' && (
            <div className="space-y-3.5 text-left">
              {/* TOP SUMMARY STATS GRID */}
              <div className={`grid grid-cols-3 gap-2 transition-all duration-300 ${
                isOnboardingSleep ? 'filter blur-[3.5px] opacity-35 select-none pointer-events-none' : ''
              }`}>
                <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                  <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Тривалість сну</div>
                  <div className="text-sm font-bold font-mono text-zinc-100">
                    {calculatedSleepHours} <span className="text-[10px] font-normal text-zinc-400">год</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                  <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Розклад доби</div>
                  <div className="text-sm font-bold font-mono text-zinc-100 truncate">
                    {bedtime} – {wakeTime}
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                  <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Цикли сну</div>
                  <div className="text-sm font-bold font-mono text-zinc-100">
                    ~{Math.max(1, Math.round(calculatedSleepHours / 1.5))} <span className="text-[10px] font-normal text-zinc-400">фаз</span>
                  </div>
                </div>
              </div>

              {/* TIME PICKERS IN DARK ELEVATED CARDS */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Bedtime */}
                <div className={`p-3 rounded-2xl space-y-2 shadow-xs transition-all duration-300 ${
                  isOnboardingSleep
                    ? 'bg-[#18181f]/95 border-2 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-[#18181f]/90 border border-zinc-800/80'
                }`}>
                  <div className="flex items-center justify-between text-[11px] font-medium">
                    <span className="flex items-center gap-1.5">
                      <Moon className={`w-3.5 h-3.5 ${isOnboardingSleep ? 'text-emerald-400' : 'text-zinc-400'}`} />
                      <span className={isOnboardingSleep ? 'text-emerald-300 font-bold' : 'text-zinc-300'}>Час засинання</span>
                    </span>
                  </div>
                  <input
                    type="time"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    className={`w-full text-base font-bold bg-zinc-950/80 border rounded-xl px-2.5 py-1 text-zinc-100 focus:outline-none font-mono ${
                      isOnboardingSleep ? 'border-emerald-500/40 focus:border-emerald-400' : 'border-zinc-800 focus:border-zinc-600'
                    }`}
                  />
                  <div className="flex flex-wrap gap-1">
                    {['22:30', '23:00', '23:30', '00:00'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setBedtime(t)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                          bedtime === t
                            ? 'bg-zinc-200 text-zinc-950 font-bold'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wake time */}
                <div className={`p-3 rounded-2xl space-y-2 shadow-xs transition-all duration-300 ${
                  isOnboardingSleep
                    ? 'bg-[#18181f]/95 border-2 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-[#18181f]/90 border border-zinc-800/80'
                }`}>
                  <div className="flex items-center justify-between text-[11px] font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className={`w-3.5 h-3.5 ${isOnboardingSleep ? 'text-emerald-400' : 'text-zinc-400'}`} />
                      <span className={isOnboardingSleep ? 'text-emerald-300 font-bold' : 'text-zinc-300'}>Час підйому</span>
                    </span>
                  </div>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className={`w-full text-base font-bold bg-zinc-950/80 border rounded-xl px-2.5 py-1 text-zinc-100 focus:outline-none font-mono ${
                      isOnboardingSleep ? 'border-emerald-500/40 focus:border-emerald-400' : 'border-zinc-800 focus:border-zinc-600'
                    }`}
                  />
                  <div className="flex flex-wrap gap-1">
                    {['06:30', '07:00', '07:30', '08:00'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setWakeTime(t)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                          wakeTime === t
                            ? 'bg-zinc-200 text-zinc-950 font-bold'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SLEEP QUALITY & ANALYTICS WRAPPER */}
              <div className={`space-y-3.5 transition-all duration-300 ${
                isOnboardingSleep ? 'filter blur-[4px] opacity-25 select-none pointer-events-none' : ''
              }`}>
                {/* SLEEP QUALITY SELECTOR */}
                <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-200">Якість та глибина сну</span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {calculatedSleepHours >= 7.5 ? 'Оптимально' : 'Потребує уваги'}
                    </span>
                  </div>
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
                            ? 'bg-zinc-100 text-zinc-950 shadow-xs font-bold'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CIRCADIAN RHYTHM & RECOVERY INSIGHT */}
                <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                    <Brain className="w-4 h-4 text-zinc-300" />
                    <span>Біоритми та відновлення дофаміну</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-normal">
                    Під час глибокого сну (23:00 – 03:00) мозок відновлює чутливість ацетилхолінових та дофамінових рецепторів. Стабільний графік сну знижує ранкову тягу на 60%.
                  </p>
                </div>

                {/* SLEEP CHARTS & 24H OVERLAY REGIME ANALYTICS */}
                <SleepScheduleAnalytics
                  currentBedtime={bedtime}
                  currentWakeTime={wakeTime}
                  currentQuality={sleepQuality}
                />
              </div>

              <button
                type="button"
                onClick={handleSaveSleep}
                className={`w-full py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-md active:scale-98 ${
                  isOnboardingSleep
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 ring-2 ring-emerald-400/30 shadow-emerald-950/50'
                    : 'bg-zinc-100 hover:bg-white text-zinc-950'
                }`}
              >
                {isOnboardingSleep ? 'Зберегти сон та продовжити →' : 'Зберегти сон'}
              </button>
            </div>
          )}

          {/* ================= SECTION 3: HYDRATION ================= */}
          {activeSection === 'hydration' && (
            <div className="space-y-3.5 text-left">
              {/* TOP SUMMARY STATS GRID (style matching Statistics & Main page) */}
              <div className={`grid grid-cols-3 gap-2 transition-all duration-300 ${
                isOnboardingHydration ? 'filter blur-[3.5px] opacity-35 select-none pointer-events-none' : ''
              }`}>
                <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                  <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Випито води</div>
                  <div className="text-sm font-bold font-mono text-zinc-100 truncate">
                    {hydrationMl} <span className="text-[10px] font-normal text-zinc-400">мл</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                  <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Добова норма</div>
                  <div className="text-sm font-bold font-mono text-zinc-100 truncate">
                    {waterNormMl} <span className="text-[10px] font-normal text-zinc-400">мл</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                  <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Виконано</div>
                  <div className="text-sm font-bold font-mono text-zinc-100">
                    {Math.round((hydrationMl / waterNormMl) * 100)}%
                  </div>
                </div>
              </div>

              {/* PROGRESS BAR CARD */}
              <div className={`p-3.5 rounded-2xl space-y-2 shadow-xs transition-all duration-300 ${
                isOnboardingHydration
                  ? 'bg-[#18181f]/95 border-2 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-md'
                  : 'bg-[#18181f]/90 border border-zinc-800/80'
              }`}>
                <div className="flex items-center justify-between text-xs text-zinc-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Droplets className={`w-3.5 h-3.5 ${isOnboardingHydration ? 'text-emerald-400' : 'text-zinc-300'}`} />
                    <span className={isOnboardingHydration ? 'text-emerald-300 font-bold' : ''}>Прогрес гідратації</span>
                  </span>
                  <span className="font-mono text-zinc-400 text-[11px]">
                    Залишилось: {Math.max(0, waterNormMl - hydrationMl)} мл
                  </span>
                </div>
                <div className="w-full h-2 bg-zinc-950/80 rounded-full overflow-hidden border border-zinc-800/80">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-200 transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((hydrationMl / waterNormMl) * 100))}%` }}
                  />
                </div>
                <div className="text-[10px] text-zinc-400 font-normal">
                  Норма ({waterNormMl} мл) визначена автоматично за вашою вагою ({weight} кг).
                </div>
              </div>

              {/* QUICK ADD BUTTONS */}
              <div className={`p-3.5 rounded-2xl space-y-2.5 shadow-xs transition-all duration-300 ${
                isOnboardingHydration
                  ? 'bg-[#18181f]/95 border-2 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-md'
                  : 'bg-[#18181f]/90 border border-zinc-800/80'
              }`}>
                <div className={`text-xs font-semibold ${isOnboardingHydration ? 'text-emerald-300 font-bold' : 'text-zinc-200'}`}>
                  Швидке додавання:
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => updateHydration(150, 'Склянка води')}
                    className="py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-xs font-mono font-bold text-zinc-200 cursor-pointer active:scale-95 transition-all shadow-xs"
                  >
                    +150 мл
                  </button>
                  <button
                    type="button"
                    onClick={() => updateHydration(250, 'Склянка води')}
                    className="py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-xs font-mono font-bold text-zinc-200 cursor-pointer active:scale-95 transition-all shadow-xs"
                  >
                    +250 мл
                  </button>
                  <button
                    type="button"
                    onClick={() => updateHydration(500, 'Пляшка води')}
                    className="py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-xs font-mono font-bold text-zinc-200 cursor-pointer active:scale-95 transition-all shadow-xs"
                  >
                    +500 мл
                  </button>
                  <button
                    type="button"
                    onClick={() => updateHydration(-250, 'Відміна')}
                    className="py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-xs font-mono font-bold text-zinc-400 hover:text-zinc-200 cursor-pointer active:scale-95 transition-all shadow-xs"
                    title="Відняти 250 мл"
                  >
                    -250 мл
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  try {
                    window.dispatchEvent(new CustomEvent('onboarding-step-saved', { detail: { step: 'hydration' } }));
                  } catch {}
                  setActiveSection('menu');
                }}
                className={`w-full py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-md active:scale-98 ${
                  isOnboardingHydration
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 ring-2 ring-emerald-400/30 shadow-emerald-950/50'
                    : 'bg-zinc-100 hover:bg-white text-zinc-950'
                }`}
              >
                {isOnboardingHydration ? 'Зберегти гідратацію та продовжити →' : 'Зберегти гідратацію'}
              </button>
            </div>
          )}

          {/* ================= SECTION: Щоденний ШІ Чек-ін ================= */}
          {activeSection === 'daily_checkin' && (
            <div className="space-y-4 text-left">
              {/* Intermediate check-in banner */}
              {existingCheckinData?.completed && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-zinc-900 border border-emerald-500/40 shadow-sm flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-emerald-200 flex items-center gap-1.5 truncate">
                        <span>Повторний чек-ін</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 font-mono font-bold">
                          Зріз #{(existingCheckinData?.entries?.length || 1) + 1}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-300 truncate">
                        Створює проміжне значення для поточної доби та оновить усі системи
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stepper Progress Indicator */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono tracking-wider">
                  Крок {checkinStep + 1} з 4
                </span>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((stepIdx) => (
                    <div
                      key={stepIdx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        stepIdx === checkinStep
                          ? 'w-6 bg-emerald-500'
                          : stepIdx < checkinStep
                          ? 'w-2 bg-emerald-700/60'
                          : 'w-2 bg-zinc-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* STEP 0: WATER CHECK-IN */}
              {checkinStep === 0 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-[#18181f]/90 border border-emerald-500/20 space-y-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Droplets className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-100">Гідратація та детокс</h3>
                        <p className="text-[11px] text-zinc-400">Скільки води ви випили за сьогодні?</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[11px] text-zinc-400">Сьогодні випито:</span>
                        <span className="text-xl font-mono font-black text-emerald-300">
                          {checkinWater} <span className="text-xs font-normal text-zinc-400">мл</span>
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="3500"
                        step="100"
                        value={checkinWater}
                        onChange={(e) => setCheckinWater(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                        <span>0 мл</span>
                        <span className="text-emerald-400/80 font-bold">Норма: {waterNormMl} мл</span>
                        <span>3500 мл</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setCheckinWater((w) => Math.min(3500, w + 250))}
                        className="py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-bold text-zinc-300 transition-colors cursor-pointer active:scale-95"
                      >
                        +250 мл (Склянка)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckinWater((w) => Math.min(3500, w + 500))}
                        className="py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-bold text-zinc-300 transition-colors cursor-pointer active:scale-95"
                      >
                        +500 мл (Пляшка)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckinWater(0)}
                        className="py-2 rounded-xl bg-zinc-900/50 hover:bg-rose-950/20 border border-zinc-800 hover:border-rose-900/30 text-[11px] font-bold text-rose-300/80 transition-colors cursor-pointer active:scale-95"
                      >
                        Скинути
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCheckinStep(1)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                  >
                    <span>Далі (Сон)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* STEP 1: SLEEP CHECK-IN */}
              {checkinStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-[#18181f]/90 border border-indigo-500/20 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                        <Moon className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-100">Якість та режим сну</h3>
                        <p className="text-[11px] text-zinc-400">Оцініть свій відпочинок минулої ночі</p>
                      </div>
                    </div>

                    {/* Time Inputs */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Відбій:</label>
                        <input
                          type="time"
                          value={bedtime}
                          onChange={(e) => setBedtime(e.target.value)}
                          className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Підйом:</label>
                        <input
                          type="time"
                          value={wakeTime}
                          onChange={(e) => setWakeTime(e.target.value)}
                          className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-y border-zinc-800/80">
                      <span className="text-[11px] text-zinc-400">Розрахована тривалість сну:</span>
                      <span className="text-sm font-mono font-bold text-indigo-300">
                        {calculatedSleepHours} год
                      </span>
                    </div>

                    {/* Sleep Quality */}
                    <div className="space-y-2">
                      <span className="text-[11px] text-zinc-400 block">Якість сну:</span>
                      <div className="grid grid-cols-5 gap-1.5">
                        {[1, 2, 3, 4, 5].map((q) => {
                          const labels = ['Жахливо', 'Погано', 'Нівроку', 'Добре', 'Чудово'];
                          return (
                            <button
                              key={q}
                              type="button"
                              onClick={() => setCheckinSleepQuality(q)}
                              className={`py-2 px-1 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                                checkinSleepQuality === q
                                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                              }`}
                              title={labels[q - 1]}
                            >
                              <span className="block text-center text-xs mb-0.5">
                                {q === 1 && '🥱'}
                                {q === 2 && '🙁'}
                                {q === 3 && '😐'}
                                {q === 4 && '🙂'}
                                {q === 5 && '🤩'}
                              </span>
                              <span className="block text-center leading-none text-[8.5px] truncate">
                                {labels[q - 1]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckinStep(0)}
                      className="py-3 border border-zinc-800 bg-zinc-900 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      ← Назад
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckinStep(2)}
                      className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      <span>Далі (Зріз)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: STATE SURVEY (ALL 8 SLIDERS) */}
              {checkinStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-[#18181f]/90 border border-purple-500/20 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                        <Activity className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-100">Миттєвий зріз стану (Всі 8 показників)</h3>
                        <p className="text-[11px] text-zinc-400">Оцініть свій психофізичний стан (1 — мін, 10 — макс)</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-1">
                      {/* 1. Craving */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            Тяга до сигарет
                          </span>
                          <span className="font-mono font-bold text-amber-400">{checkinCraving} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={checkinCraving}
                          onChange={(e) => setCheckinCraving(Number(e.target.value))}
                          className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>

                      {/* 2. Thoughts */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                            Думки про куриво
                          </span>
                          <span className="font-mono font-bold text-indigo-400">{checkinThoughts} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={checkinThoughts}
                          onChange={(e) => setCheckinThoughts(Number(e.target.value))}
                          className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                      </div>

                      {/* 3. Anxiety */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                            Тривожність
                          </span>
                          <span className="font-mono font-bold text-rose-400">{checkinAnxiety} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={checkinAnxiety}
                          onChange={(e) => setCheckinAnxiety(Number(e.target.value))}
                          className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
                        />
                      </div>

                      {/* 4. Irritability */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                            Дратівливість
                          </span>
                          <span className="font-mono font-bold text-orange-400">{checkinIrritability} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={checkinIrritability}
                          onChange={(e) => setCheckinIrritability(Number(e.target.value))}
                          className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                      </div>

                      {/* 5. Calmness */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                            Рівень спокою
                          </span>
                          <span className="font-mono font-bold text-teal-400">{checkinCalmness} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={checkinCalmness}
                          onChange={(e) => setCheckinCalmness(Number(e.target.value))}
                          className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-teal-500"
                        />
                      </div>

                      {/* 6. Energy */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Життєва енергія
                          </span>
                          <span className="font-mono font-bold text-emerald-400">{checkinEnergy} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={checkinEnergy}
                          onChange={(e) => setCheckinEnergy(Number(e.target.value))}
                          className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>

                      {/* 7. Focus */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                            Концентрація та фокус
                          </span>
                          <span className="font-mono font-bold text-sky-400">{checkinFocus} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={checkinFocus}
                          onChange={(e) => setCheckinFocus(Number(e.target.value))}
                          className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                      </div>

                      {/* 8. Overall */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                            Загальне самопочуття
                          </span>
                          <span className="font-mono font-bold text-purple-400">{checkinOverall} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={checkinOverall}
                          onChange={(e) => setCheckinOverall(Number(e.target.value))}
                          className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckinStep(1)}
                      className="py-3 border border-zinc-800 bg-zinc-900 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      ← Назад
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateCheckinAdvice}
                      className="py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      <span>ШІ-Аналіз</span>
                      <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: REAL-TIME AI CLINICAL REC & FINALIZE SYNC */}
              {checkinStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {checkinLoadingAdvice ? (
                    <div className="p-8 rounded-2xl bg-[#14141c]/95 border border-purple-500/20 text-center space-y-4 shadow-xl">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400 animate-spin">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">Генерація медичних ШІ-рекомендацій...</h4>
                        <p className="text-[10.5px] text-zinc-400">Gemini аналізує біопоказники сну, води та зрізу у реальному часі</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {checkinAdvice && (
                        <div className="p-4 rounded-2xl bg-[#151426] border border-purple-500/30 space-y-3.5 relative overflow-hidden shadow-xl text-left">
                          {/* Subtle glow background */}
                          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                          <div className="flex items-center gap-2 pb-2.5 border-b border-white/5 justify-between">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-xs font-bold text-purple-300 truncate">
                                {(checkinAdvice as any).headline || 'Аналіз успішно завершено'}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20 uppercase shrink-0">
                              {(checkinAdvice as any).isLiveAi ? 'Live Gemini' : 'CBT Локальний'}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                              <Activity className="w-4 h-4 text-purple-400 shrink-0" />
                              <span>Аналіз показників:</span>
                            </div>
                            <p className="text-[11px] text-zinc-300 leading-relaxed font-normal">
                              {(checkinAdvice as any).bodySummary}
                            </p>
                          </div>

                          {/* Quick tip */}
                          <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[10.5px] text-purple-200">
                            <span className="font-extrabold uppercase text-[9px] block text-purple-400 mb-0.5">Рекомендація:</span>
                            {(checkinAdvice as any).immediateAction}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCheckinStep(2)}
                          className="py-3 border border-zinc-800 bg-zinc-900 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                          ← Змінити дані
                        </button>
                        <button
                          type="button"
                          onClick={handleCompleteCheckin}
                          className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>{existingCheckinData?.completed ? 'Зафіксувати проміжний зріз' : 'Завершити Чек-ін'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= SECTION 4: ANALYSIS & SCENARIOS ================= */}
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

          {/* ================= SECTION 5: SLICE / ОПИТУВАННЯ (10 БАЛІВ) ================= */}
          {activeSection === 'slice' && (
            <div className="space-y-3.5 text-left">
              {/* TOP HEADER NOTE */}
              <div className="p-3 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 flex items-center justify-between text-xs shadow-xs">
                <span className="text-zinc-300 font-semibold">Шкала оцінки:</span>
                <span className="font-mono text-zinc-200 font-bold px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
                  1 (мінімум) — 10 (максимум)
                </span>
              </div>

              {/* 8 Indicators in 2 Columns matching Main page style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: 'craving', label: '1. Рівень тяги', val: sliceCraving, setVal: setSliceCraving },
                  { key: 'thoughts', label: '2. Нав\'язливі думки', val: sliceThoughts, setVal: setSliceThoughts },
                  { key: 'anxiety', label: '3. Тривожність', val: sliceAnxiety, setVal: setSliceAnxiety },
                  { key: 'irritability', label: '4. Дратівливість', val: sliceIrritability, setVal: setSliceIrritability },
                  { key: 'calmness', label: '5. Спокій', val: sliceCalmness, setVal: setSliceCalmness },
                  { key: 'energy', label: '6. Енергія', val: sliceEnergy, setVal: setSliceEnergy },
                  { key: 'focus', label: '7. Концентрація', val: sliceFocus, setVal: setSliceFocus },
                  { key: 'overall', label: '8. Загальний стан', val: sliceOverall, setVal: setSliceOverall },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`p-3 rounded-2xl space-y-2 shadow-xs transition-all duration-300 ${
                      isOnboardingSlice
                        ? 'bg-[#18181f]/95 border-2 border-emerald-500/50 ring-1 ring-emerald-500/20'
                        : 'bg-[#18181f]/90 border border-zinc-800/80'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-200 font-semibold text-[11.5px] truncate">{item.label}</span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <button
                          type="button"
                          onClick={() => item.setVal(Math.max(1, item.val - 1))}
                          className="w-5 h-5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-9 text-center font-bold text-xs bg-zinc-950/80 text-zinc-100 py-0.5 rounded-lg border border-zinc-800">
                          {item.val}/10
                        </span>
                        <button
                          type="button"
                          onClick={() => item.setVal(Math.min(10, item.val + 1))}
                          className="w-5 h-5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={item.val}
                      onChange={(e) => item.setVal(Number(e.target.value))}
                      className="w-full accent-zinc-200 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                      <span>1</span>
                      <span>5</span>
                      <span>10</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fluctuations Selector in Main Page Dark Style */}
              <div className={`p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2 shadow-xs transition-all duration-300 ${
                isOnboardingSlice ? 'filter blur-[3.5px] opacity-30 select-none pointer-events-none' : ''
              }`}>
                <div className="text-xs text-zinc-300 font-semibold">Поточний фон або стан:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {[
                    { id: 'stable', label: 'Спокій / Стабільно' },
                    { id: 'craving_spike', label: 'Сплеск тяги' },
                    { id: 'thought_wave', label: 'Хвиля думок' },
                    { id: 'irritation_wave', label: 'Дратівливість' },
                    { id: 'fatigue', label: 'Втома / Спад сил' },
                  ].map((fl) => (
                    <button
                      key={fl.id}
                      type="button"
                      onClick={() => setSliceFluctuation(fl.id)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-semibold text-center cursor-pointer transition-all ${
                        sliceFluctuation === fl.id
                          ? 'bg-zinc-200 text-zinc-950 font-bold shadow-xs'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
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
                className={`w-full py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-md active:scale-98 ${
                  isOnboardingSlice
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 ring-2 ring-emerald-400/30 shadow-emerald-950/50'
                    : 'bg-zinc-100 hover:bg-white text-zinc-950'
                }`}
              >
                {isOnboardingSlice ? 'Зберегти опитування та продовжити →' : 'Зберегти опитування'}
              </button>
            </div>
          )}

          {/* ================= SECTION 6: TRIGGERFIX (10 БАЛІВ) ================= */}
          {activeSection === 'triggerfix' && (
            <div className="space-y-3.5 text-left">
              {/* Header Hero Card */}
              <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-100">Калібрування Тригера</span>
                  <span className="text-[10px] font-mono text-zinc-400">Шкала 1..10</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Скоригуйте поточні показники стану та прив'яжіть тригер для адаптації діалогів Аналізатора.
                </p>
              </div>

              {/* 8 Indicators Sliders Grid (1 to 10 scale) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {INDICATOR_CONFIGS.map((cfg) => {
                  const currentVal = triggerVals[cfg.key] ?? 5;
                  const initialVal = initialTriggerVals[cfg.key] ?? 5;
                  const isChanged = currentVal !== initialVal;

                  return (
                    <div
                      key={cfg.key}
                      className={`p-3 rounded-2xl bg-[#18181f]/90 border transition-all space-y-2 shadow-xs ${
                        isChanged ? 'border-zinc-600 ring-1 ring-zinc-500/30' : 'border-zinc-800/80'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-200 font-semibold text-[11.5px] truncate">{cfg.label}</span>
                        <div className="flex items-center gap-1 font-mono text-xs font-bold">
                          {isChanged && <span className="text-zinc-500 line-through text-[10px]">{initialVal}</span>}
                          <span className="text-zinc-100">{currentVal}/10</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={currentVal}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTriggerVals((prev) => ({ ...prev, [cfg.key]: val }));
                        }}
                        className="w-full accent-zinc-200 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                        <span>1</span>
                        <span>5</span>
                        <span>10</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trigger Reason Selection & Creator */}
              <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-200">
                  <span>Фактор ситуації / Тригер:</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomTrigger((prev) => !prev)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all cursor-pointer"
                  >
                    + Свій тригер
                  </button>
                </div>

                {isAddingCustomTrigger && (
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-700 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTriggerName}
                        onChange={(e) => setNewTriggerName(e.target.value)}
                        placeholder="Назва тригера..."
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomTrigger}
                        className="px-3 py-1.5 rounded-xl bg-zinc-200 text-zinc-950 text-xs font-bold cursor-pointer"
                      >
                        Додати
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {allTriggers.map((tr) => {
                    const isSelected = selectedTriggerReason === tr.id;
                    const isCustom = tr.id.startsWith('custom_');

                    return (
                      <div
                        key={tr.id}
                        onClick={() => setSelectedTriggerReason(tr.id)}
                        className={`p-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-zinc-200 text-zinc-950 font-bold shadow-xs'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        <span className="truncate text-[11px]">{tr.name}</span>
                        {isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustomTrigger(e, tr.id)}
                            className="text-zinc-400 hover:text-rose-400 p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveTriggerShift}
                className="w-full py-3 rounded-2xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-all cursor-pointer shadow-md active:scale-98"
              >
                Зберегти тригер
              </button>
            </div>
          )}

          {/* ================= SECTION 7: DRINKS / НАПОЇ ================= */}
          {activeSection === 'food_drinks' && (
            <div className="space-y-3.5 text-left">
              {/* Beverage Selector */}
              <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2 shadow-xs">
                <div className="text-xs text-zinc-300 font-semibold">Оберіть напій або прийом:</div>
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
                          ? 'bg-zinc-200 text-zinc-950 font-bold shadow-xs'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Automatic Hydration Impact */}
              <div className="p-3 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 text-xs flex items-center justify-between shadow-xs">
                <span className="text-zinc-400">Вплив на гідратацію:</span>
                <span className="font-mono font-bold text-zinc-200">
                  {itemType === 'water' && '+250 мл до норми'}
                  {itemType === 'tea' && '+200 мл до норми'}
                  {itemType === 'soda' && '+150 мл до норми'}
                  {itemType === 'coffee' && '-100 мл (потрібна вода)'}
                  {itemType === 'alcohol' && '-250 мл (потрібна вода)'}
                  {itemType === 'meal' && 'Нейтрально (стабілізація)'}
                </span>
              </div>

              {/* Time of intake */}
              <div className="p-3 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 flex items-center justify-between shadow-xs">
                <span className="text-xs text-zinc-300 font-semibold">Час прийому:</span>
                <input
                  type="time"
                  value={itemTime}
                  onChange={(e) => setItemTime(e.target.value)}
                  className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-2.5 py-1 text-zinc-100 font-mono text-sm font-bold focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveFoodDrink}
                className="w-full py-3 rounded-2xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-all cursor-pointer shadow-md active:scale-98"
              >
                Зафіксувати напій
              </button>
            </div>
          )}

          {/* ================= SECTION 8: HISTORY / ІСТОРІЯ ================= */}
          {activeSection === 'history' && (
            <div className="space-y-3.5 text-left">
              {/* Memory Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                  <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Опитувань</div>
                  <div className="text-sm font-bold font-mono text-zinc-100">{memoryStats.todaySlicesCount}</div>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                  <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Вода</div>
                  <div className="text-sm font-bold font-mono text-zinc-100">{hydrationMl} мл</div>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                  <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Легені</div>
                  <div className="text-sm font-bold font-mono text-zinc-100">{memoryStats.lastLung}</div>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs">
                  <div className="text-[9.5px] uppercase font-mono text-zinc-400 mb-0.5">Діалоги</div>
                  <div className="text-sm font-bold font-mono text-zinc-100">{memoryStats.activeDialoguesCount}</div>
                </div>
              </div>

              {/* Logs Timeline Header */}
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                <span className="font-semibold text-zinc-300">Хронологія та лог ({healthLogs.length}):</span>
                {healthLogs.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="text-zinc-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer text-xs font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Очистити
                  </button>
                )}
              </div>

              {healthLogs.length === 0 ? (
                <div className="p-6 text-center text-zinc-400 text-xs bg-[#18181f]/90 rounded-2xl border border-zinc-800/80">
                  Історія порожня. Додайте перше опитування, напій чи сон.
                </div>
              ) : (
                <div className="space-y-2 max-h-[36vh] overflow-y-auto pr-0.5 no-scrollbar">
                  {healthLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 flex items-center justify-between text-xs shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[11px] font-mono text-zinc-400 shrink-0">{log.timeStr}</span>
                        <div className="min-w-0">
                          <div className="font-bold text-zinc-100 truncate">{log.title}</div>
                          <div className="text-[11px] text-zinc-400 truncate">{log.detail}</div>
                        </div>
                      </div>
                      {log.impact && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 shrink-0 ml-2">
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
                className="w-full py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Назад
              </button>
            </div>
          )}

          {/* ================= SECTION 9: CHARTS / ГРАФІК (10 БАЛІВ) ================= */}
          {activeSection === 'charts' && (
            <EnhancedChartsSection
              triggerVals={triggerVals}
              hydrationMl={hydrationMl}
              waterNormMl={waterNormMl}
              calculatedSleepHours={calculatedSleepHours}
              onBack={() => setActiveSection('menu')}
              onSelectSection={setActiveSection}
            />
          )}

          {/* ================= SECTION 10: TOUGHEST TIME (НАЙВАЖЧИЙ ЧАС) ================= */}
          {activeSection === 'toughest_time' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/5 border border-amber-500/30 flex items-center justify-between gap-3 text-left shadow-lg">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Розділ перенесено до вкладки «Стан»</span>
                  </div>
                  <div className="text-[10.5px] text-zinc-400 truncate mt-0.5">
                    Централізований моніторинг біоритмів, графіків та тригерів
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('change-tab', { detail: 'state' }));
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('open-craving-wave'));
                    }, 80);
                    onClose?.();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black text-xs font-black shrink-0 transition-all shadow-md cursor-pointer active:scale-95"
                >
                  У Стан 🌊
                </button>
              </div>

              <ToughestTimeSection
                onBack={() => setActiveSection('menu')}
                onOpenUrgeTimer={() => {
                  window.dispatchEvent(new CustomEvent('open-urge-surfing-timer'));
                }}
              />
            </div>
          )}

          {/* ================= SECTION 11: GOALS SYSTEM (СИСТЕМА ЦІЛЬ) ================= */}
          {activeSection === 'goal' && (
            <div className="space-y-3.5 text-left animate-fadeIn">
              {/* Top Banner / Summary */}
              <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-amber-950/30 via-[#18181f] to-[#121217] border border-amber-500/30 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" />
                    <span>Поточна головна ціль</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-300">
                    {goalProgressPct}% накопичено
                  </span>
                </div>

                {activeMainGoal ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-white truncate">
                        «{activeMainGoal.name}»
                      </h3>
                      <span className="text-xs font-mono font-bold text-amber-300 shrink-0">
                        {activeMainGoal.amount.toLocaleString('uk-UA')} ₴
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isMainGoalReached
                              ? 'bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                              : 'bg-gradient-to-r from-amber-500 to-yellow-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                          }`}
                          style={{ width: `${goalProgressPct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                        <span>Заощаджено: <strong className="text-zinc-200">{netSavedForGoals.toLocaleString('uk-UA')} ₴</strong></span>
                        <span>Залишилось: <strong className="text-zinc-200">{Math.max(0, goalTargetAmount - netSavedForGoals).toLocaleString('uk-UA')} ₴</strong></span>
                      </div>
                    </div>

                    {isMainGoalReached && (
                      <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎉</span>
                          <span className="text-xs font-bold text-emerald-300">Ціль досягнута! Час винагородити себе!</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCompleteGoal(activeMainGoal.id)}
                          className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs cursor-pointer transition-colors shadow-xs shrink-0"
                        >
                          Отримати
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-1.5">
                    <p className="text-xs text-zinc-300 font-semibold">У вас поки немає активної цілі</p>
                    <p className="text-[11px] text-zinc-400">Створіть омріяну мету, щоб бачити, як заощаджені від відмови гроші наближають її!</p>
                  </div>
                )}
              </div>

              {/* Add New Goal Form */}
              <form onSubmit={handleAddNewGoal} className="p-3.5 rounded-3xl bg-[#14141c]/95 border border-zinc-800/80 space-y-2.5 shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Додати нову ціль</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Черга цілей</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                    placeholder="Назва (наприклад: Смартфон)"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newGoalAmount}
                      onChange={(e) => setNewGoalAmount(e.target.value)}
                      placeholder="Сума (₴)"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <button
                      type="submit"
                      disabled={!newGoalName.trim() || !newGoalAmount}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none text-zinc-950 font-bold text-xs cursor-pointer transition-all shadow-xs shrink-0"
                    >
                      Додати
                    </button>
                  </div>
                </div>
              </form>

              {/* Queue of Upcoming Goals */}
              <div className="p-3.5 rounded-3xl bg-[#14141c]/95 border border-zinc-800/80 space-y-2.5 shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Черга цілей ({goalsData.queue.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      window.dispatchEvent(new CustomEvent('open-goal-modal'));
                    }}
                    className="text-[10px] text-amber-400 hover:underline cursor-pointer font-mono"
                  >
                    Всі налаштування →
                  </button>
                </div>

                <div className="space-y-1.5">
                  {goalsData.queue.map((g, idx) => (
                    <div
                      key={g.id}
                      className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 text-xs ${
                        idx === 0
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-zinc-900/60 border-zinc-800/60'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-zinc-100 truncate flex items-center gap-1.5">
                          {idx === 0 && <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-400 text-zinc-950 font-bold font-mono">1</span>}
                          <span>{g.name}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                          {g.amount.toLocaleString('uk-UA')} ₴
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCompleteGoal(g.id)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-300 transition-colors cursor-pointer"
                          title="Позначити виконаною"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGoal(g.id)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer"
                          title="Видалити ціль"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed Goals History */}
              {goalsData.done.length > 0 && (
                <div className="p-3.5 rounded-3xl bg-[#14141c]/95 border border-zinc-800/80 space-y-2 shadow-xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Досягнуті цілі ({goalsData.done.length})</span>
                    </span>
                  </div>
                  <div className="space-y-1">
                    {goalsData.done.map((dg) => (
                      <div key={dg.id} className="p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/50 flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-300 truncate">✅ {dg.name}</span>
                        <span className="text-emerald-400 font-semibold shrink-0">
                          {(dg.amount || dg.total || 0).toLocaleString('uk-UA')} ₴
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= SECTION 12: QUICK GOAL SYSTEM (СИСТЕМА ШВИДКА ЦІЛЬ) ================= */}
          {activeSection === 'quick_goal' && (
            <div className="space-y-3.5 text-left animate-fadeIn">
              {/* Main Quick Goal Status Card */}
              <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-yellow-950/30 via-[#18181f] to-[#121217] border border-yellow-500/30 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Мікро-ціль стриманості (до 24 год)</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-yellow-500/40 bg-yellow-500/15 text-yellow-300">
                    {quickGoalStats.active ? (quickGoalStats.isReached ? 'Виконано!' : `${quickGoalStats.pct}%`) : 'Не активна'}
                  </span>
                </div>

                {quickGoal ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-white truncate">
                          «{quickGoal.title}»
                        </h3>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Ціль: без жодної затяжки до часу X
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xl font-black font-mono text-yellow-300 tracking-tight">
                          {quickGoalStats.timeLeftStr}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400">
                          {quickGoalStats.isReached ? 'Час настав!' : 'залишилось'}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          quickGoalStats.isReached
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                            : 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]'
                        }`}
                        style={{ width: `${quickGoalStats.pct}%` }}
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {quickGoalStats.isReached ? (
                        <button
                          type="button"
                          onClick={handleClaimQuickGoal}
                          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-zinc-950 font-black text-xs cursor-pointer shadow-lg active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                        >
                          <Trophy className="w-3.5 h-3.5" />
                          <span>Забрати винагороду 🎉</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleCancelQuickGoal}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 font-semibold text-xs cursor-pointer transition-colors"
                        >
                          Скасувати ціль
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <p className="text-xs text-zinc-300">
                      Швидка ціль допомагає розбити день на короткі досяжні проміжки та отримати дофамін від маленьких перемог!
                    </p>

                    {/* Step 1: Reward Input & Chips */}
                    <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                      <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                        <span>1. Впишіть вашу винагороду:</span>
                        <span className="text-[10px] text-zinc-400 font-mono font-normal">🎁 Що отримаєте</span>
                      </label>
                      <input
                        type="text"
                        value={quickGoalTitleInput}
                        onChange={(e) => setQuickGoalTitleInput(e.target.value)}
                        placeholder="Наприклад: Смачна кава з десертом ☕"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-amber-500/30 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                        autoFocus
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-400 block">Швидкий вибір:</span>
                        <div className="flex flex-wrap gap-1">
                          {[
                            '☕ Смачна кава',
                            '🍰 Улюблений десерт',
                            '🎬 Серія серіалу',
                            '🛁 Гаряча ванна',
                            '🚶 Прогулянка',
                            '🎮 30 хв гри',
                            '🍫 Шоколад'
                          ].map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => setQuickGoalTitleInput(chip)}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-all cursor-pointer ${
                                quickGoalTitleInput === chip
                                  ? 'bg-amber-400 text-zinc-950 border-amber-300 font-bold'
                                  : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 border-zinc-700/60'
                              }`}
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Duration Presets */}
                    <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                      <label className="text-xs font-bold text-zinc-200 block">
                        2. Оберіть час стриманості:
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { h: 1, label: '1 година', desc: 'Короткий ривок' },
                          { h: 2, label: '2 години', desc: 'Після кави' },
                          { h: 3, label: '3 години', desc: 'Фокус' },
                          { h: 6, label: '6 годин', desc: 'Півдня' },
                          { h: 12, label: '12 годин', desc: 'До ночі' },
                          { h: 24, label: '24 години', desc: 'Ціла доба' },
                        ].map((preset) => (
                          <button
                            key={preset.h}
                            type="button"
                            onClick={() => setQuickGoalDuration(preset.h)}
                            className={`p-2 rounded-xl border text-left transition-all cursor-pointer group ${
                              quickGoalDuration === preset.h
                                ? 'bg-amber-400 text-zinc-950 border-amber-300 font-bold shadow-xs'
                                : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800/80 text-zinc-100 hover:border-zinc-700'
                            }`}
                          >
                            <div className={`font-bold text-xs font-mono ${quickGoalDuration === preset.h ? 'text-zinc-950' : 'text-zinc-100 group-hover:text-amber-300'}`}>
                              {preset.label}
                            </div>
                            <div className={`text-[9.5px] truncate ${quickGoalDuration === preset.h ? 'text-zinc-800' : 'text-zinc-400'}`}>
                              {preset.desc}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Launch Button */}
                    <button
                      type="button"
                      onClick={() => handleStartQuickGoal(quickGoalDuration, quickGoalTitleInput)}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black rounded-xl text-xs cursor-pointer transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-4 h-4 fill-zinc-950" />
                      <span>Запустити швидку ціль ({quickGoalDuration} год) ⚡</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 3 Micro-Tactics during Quick Goal */}
              <div className="p-3.5 rounded-3xl bg-[#14141c]/95 border border-zinc-800/80 space-y-2.5 shadow-xl">
                <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Швидкі тактики стриманості</span>
                </span>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-zinc-900/50 border border-zinc-800/60 flex items-start gap-2">
                    <span className="text-sm">🧘</span>
                    <div>
                      <div className="font-semibold text-zinc-200">Техніка 4-7-8</div>
                      <div className="text-[10px] text-zinc-400">Вдих 4 сек, затримка 7 сек, видих 8 сек. Знімає спазм тяги за 90 секунд.</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900/50 border border-zinc-800/60 flex items-start gap-2">
                    <span className="text-sm">💧</span>
                    <div>
                      <div className="font-semibold text-zinc-200">Склянка прохолодної води</div>
                      <div className="text-[10px] text-zinc-400">Повільні дрібні ковтки перемикають оральний імпульс та очищають рецептори.</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900/50 border border-zinc-800/60 flex items-start gap-2">
                    <span className="text-sm">🚶</span>
                    <div>
                      <div className="font-semibold text-zinc-200">Зміна локації на 5 хвилин</div>
                      <div className="text-[10px] text-zinc-400">Встаньте з місця, вийдіть в іншу кімнату або пройдіться. Розірвіть ланцюг тригера.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );

  if (embedded) {
    return innerContent;
  }

  return createPortal(
    <div className="fixed inset-0 z-[800] flex flex-col justify-center sm:justify-center items-center select-none overflow-hidden animate-fadeIn p-2 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal / Drawer Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg bg-[#0e0e14]/95 border border-zinc-800 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col max-h-[90vh] overflow-x-hidden overflow-y-auto text-white transition-all duration-300 box-border min-w-0"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-[#0e0e14]/95 border-b border-zinc-800/80 backdrop-blur-md">
          <div className="flex items-center gap-2 min-w-0">
            {activeSection !== 'menu' && (
              <button
                type="button"
                onClick={() => setActiveSection('menu')}
                className="p-1.5 -ml-1 text-zinc-400 hover:text-white rounded-xl bg-zinc-800/40 hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                title="Назад до меню"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold text-sm sm:text-base text-zinc-100 flex items-center gap-1.5 truncate">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                <span className="truncate">
                  {activeSection === 'menu' && 'Швидкі механіки'}
                  {activeSection === 'daily_checkin' && 'Щоденний ШІ Чек-ін'}
                  {activeSection === 'physical' && 'Фізичні параметри & Аналіз'}
                  {activeSection === 'sleep' && 'Сон'}
                  {activeSection === 'hydration' && 'Гідратація'}
                  {activeSection === 'analysis' && 'Динаміка'}
                  {activeSection === 'slice' && 'Пройти зріз (8 показників)'}
                  {activeSection === 'triggerfix' && 'Тригер'}
                  {activeSection === 'food_drinks' && 'Напої та їжа'}
                  {activeSection === 'history' && 'Історія здоров\'я'}
                  {activeSection === 'charts' && 'Графік показників'}
                  {activeSection === 'toughest_time' && 'Хвиля тяги'}
                  {activeSection === 'goal' && 'Система Ціль (Накопичення)'}
                  {activeSection === 'quick_goal' && 'Система Швидка ціль (Стриманість)'}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
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
              title="Закрити вікно"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {innerContent}
        </div>
      </div>
    </div>,
    document.body
  );
};
