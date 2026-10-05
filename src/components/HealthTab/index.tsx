import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  HEALTH_MILESTONES,
  getBodySystemsRecovery,
  DAY
} from '../../data/healthData';
import {
  UnifiedHealthCheckIn,
  TriggerFixLog,
  PredictiveScenario,
  LivingDialogueTurn,
  DialogueChoice,
  DopamineSubstituteItem,
  DOPAMINE_SUBSTITUTES,
  COMMON_TRIGGERS,
  TRIGGERFIX_ANTIDOTES,
  calculateBioRecoveryIndex,
  generatePredictiveScenarios,
  getAnalyzerLivingDialogue
} from '../../data/livingHealthEngine';
import { StateDynamicsChart } from '../StateDynamicsChart';
import {
  Sparkles,
  Heart,
  Droplets,
  Moon,
  Coffee,
  Activity,
  Brain,
  Sliders,
  ChevronRight,
  Check,
  CheckCircle2,
  Zap,
  Wind,
  AlertTriangle,
  TrendingUp,
  Clock,
  MessageSquare,
  Shield,
  Smile,
  Flame,
  Footprints,
  Award,
  Plus,
  Minus,
  RefreshCw,
  Target,
  History,
  User,
  BarChart2,
  Edit3
} from 'lucide-react';

import { ChartIconAnimated } from '../ChartIconAnimated';

// Monochrome Refracted Icons
import {
  MonoRefractedWindIcon,
  MonoRefractedWavesIcon,
  MonoRefractedEyeIcon,
  MonoRefractedDropletsIcon,
  MonoRefractedCompassIcon,
  MonoRefractedHistoryIcon,
} from '../MonoRefractedSosIcons';

import {
  MonoRefractedZapIcon,
  MonoRefractedFlameIcon,
  MonoRefractedShieldIcon,
  MonoRefractedHeartIcon,
  MonoRefractedWindowIcon,
  MonoRefractedTreeIcon,
  MonoRefractedSlidersIcon,
  MonoRefractedDropIcon,
  MonoRefractedAwardIcon,
  MonoRefractedAccentIcon,
  MonoRefractedTrendingUpIcon,
} from '../CounterTab/MonoRefractedStatsIcons';

import {
  RefractedPrismBrainIcon,
  RefractedPrismCheckIcon,
} from '../CounterTab/RefractedStatusIcons';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { DayRating } from '../../types';

interface HealthTabProps {
  diffMs: number;
  startDate: number;
  days: Record<string, DayRating>;
  onSaveRating?: (dateKey: string, rating: DayRating) => void;
  onDeleteRating?: (dateKey: string) => void;
  accent?: string;
  appTheme?: string;
}

type HealthModule = 'dialogue' | 'checkin' | 'triggerfix' | 'who_timeline' | 'charts';

const HealthTabComponent: React.FC<HealthTabProps> = ({
  diffMs,
  startDate,
  days,
  onSaveRating,
  onDeleteRating,
  accent = 'green',
  appTheme = 'ai_gradient'
}) => {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const d = new Date();
  const todayStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  // Active top navigation module
  const [activeModule, setActiveModule] = useState<HealthModule>('dialogue');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3400);
  };

  // Sound chime
  const playZenSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432.0, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(648.0, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.72);
    } catch {}
  }, []);

  // 1. PERSISTENT HEALTH CHECK-IN STATE (Default water is strictly 0, sleepSchedule default: 'disrupted')
  const [checkIn, setCheckIn] = useState<UnifiedHealthCheckIn>(() => {
    try {
      const saved = localStorage.getItem(`quit-smoking:health-checkin:${todayStr}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          sleepSchedule: parsed.sleepSchedule || 'disrupted',
          dopamineActions: Array.isArray(parsed.dopamineActions) ? parsed.dopamineActions : ['walk'],
        };
      }
    } catch {}

    const todayEntry = days[todayStr] || {};
    const sleepLogged = todayEntry.sleep;

    return {
      timestamp: Date.now(),
      sleepHours: sleepLogged ? sleepLogged.hours : 7.5,
      sleepQuality: 'deep',
      sleepSchedule: 'disrupted', // За замовчуванням "Збитий режим" як зазначив користувач
      waterGlasses: 0, // Початкова гідратація строго 0!
      waterMl: 0,
      coffeeCups: 0,
      lastCoffeeTime: 'none',

      // 7 Mental health parameters
      cravingLevel: 1,
      moodLevel: 4,
      energyLevel: 3,
      focusLevel: 3,
      anxietyLevel: 1,
      intrusiveThoughtsLevel: 1,
      calmLevel: 4,

      // Physiological metrics
      restingHeartRate: 68,
      bloodPressureSys: 120,
      bloodPressureDia: 80,
      spO2: 98,
      breathHoldSec: 36,
      stepsCount: 3200,

      mealsStatus: 'balanced',
      activeTrigger: 'жодного',
      dopamineActions: ['walk'],
      bioRecoveryScore: 80
    };
  });

  // Sleep Period State
  const [bedtime, setBedtime] = useState<string>(() => checkIn.bedtime || '23:30');
  const [wakeTime, setWakeTime] = useState<string>(() => checkIn.wakeTime || '07:00');

  // Physio Params State
  const [weight, setWeight] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:physio-weight');
      return saved ? Number(saved) : 70;
    } catch { return 70; }
  });
  const [height, setHeight] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:physio-height');
      return saved ? Number(saved) : 175;
    } catch { return 175; }
  });
  const [age, setAge] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:physio-age');
      return saved ? Number(saved) : 30;
    } catch { return 30; }
  });
  const [gender, setGender] = useState<'male' | 'female'>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:physio-gender');
      return (saved as 'male' | 'female') || 'male';
    } catch { return 'male'; }
  });

  // Custom Analyzer Name
  const [analyzerName, setAnalyzerName] = useState<string>(() => {
    try {
      const s = localStorage.getItem('quit-smoking:analyzer-name');
      if (s && s.trim()) return s.trim();
    } catch {}
    return 'Аналізатор';
  });

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

  const handleUpdatePhysio = (field: 'weight' | 'height' | 'age' | 'gender', val: any) => {
    let nextWeight = weight;
    let nextHeight = height;
    let nextAge = age;
    let nextGender = gender;

    if (field === 'weight') {
      nextWeight = Math.max(20, Math.min(300, Number(val) || 70));
      setWeight(nextWeight);
      try { localStorage.setItem('quit-smoking:physio-weight', String(nextWeight)); } catch {}
    } else if (field === 'height') {
      nextHeight = Math.max(80, Math.min(250, Number(val) || 175));
      setHeight(nextHeight);
      try { localStorage.setItem('quit-smoking:physio-height', String(nextHeight)); } catch {}
    } else if (field === 'age') {
      nextAge = Math.max(10, Math.min(120, Number(val) || 30));
      setAge(nextAge);
      try { localStorage.setItem('quit-smoking:physio-age', String(nextAge)); } catch {}
    } else if (field === 'gender') {
      nextGender = val;
      setGender(nextGender);
      try { localStorage.setItem('quit-smoking:physio-gender', val); } catch {}
    }

    handleSaveCheckIn({
      ...checkIn,
      weight: nextWeight,
      height: nextHeight,
      age: nextAge,
      gender: nextGender
    });
    window.dispatchEvent(new Event('storage'));
  };

  const calculateSleepDuration = (startStr: string, endStr: string): number => {
    if (!startStr || !endStr) return 8;
    const [h1, m1] = startStr.split(':').map(Number);
    const [h2, m2] = endStr.split(':').map(Number);
    if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return 8;
    let mins1 = h1 * 60 + m1;
    let mins2 = h2 * 60 + m2;
    if (mins2 <= mins1) mins2 += 24 * 60;
    return Number(((mins2 - mins1) / 60).toFixed(1));
  };

  const handleBedtimeChange = (newBedtime: string) => {
    setBedtime(newBedtime);
    const dur = calculateSleepDuration(newBedtime, wakeTime);
    handleSaveCheckIn({
      ...checkIn,
      bedtime: newBedtime,
      wakeTime,
      sleepHours: dur
    });
  };

  const handleWakeTimeChange = (newWakeTime: string) => {
    setWakeTime(newWakeTime);
    const dur = calculateSleepDuration(bedtime, newWakeTime);
    handleSaveCheckIn({
      ...checkIn,
      bedtime,
      wakeTime: newWakeTime,
      sleepHours: dur
    });
  };

  // Intermediate Checkpoint Confirmation Handler
  const handleConfirmIntermediateState = () => {
    playZenSound();
    const nowTime = new Date().toTimeString().slice(0, 5);
    const newEntry = {
      id: Math.random().toString(36).substring(2, 9),
      time: nowTime,
      craving: checkIn.cravingLevel,
      anxiety: checkIn.anxietyLevel,
      intrusiveThoughts: checkIn.intrusiveThoughtsLevel,
      energy: checkIn.energyLevel,
      balance: checkIn.calmLevel,
      focus: checkIn.focusLevel
    };

    if (onSaveRating) {
      const currentDay = days[todayStr] || {};
      const existingSurveys = currentDay.surveys || currentDay.entries || [];
      const updatedSurveys = [...existingSurveys, newEntry];
      onSaveRating(todayStr, {
        ...currentDay,
        surveys: updatedSurveys,
        entries: updatedSurveys
      });
    }

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('health-indicators-changed'));
    showToast(`✨ Проміжний стан [${nowTime}] зафіксовано! Спільний графік та Аналізатор оновлено.`);
  };

  const handleDeleteSurveyEntry = (id: string) => {
    playZenSound();
    if (onSaveRating) {
      const currentDay = days[todayStr] || {};
      const existing = currentDay.surveys || currentDay.entries || [];
      const filtered = existing.filter((e: any) => e.id !== id);
      onSaveRating(todayStr, {
        ...currentDay,
        surveys: filtered,
        entries: filtered
      });
    }
    window.dispatchEvent(new Event('storage'));
    showToast('Зріз стану видалено');
  };

  // Custom dopamine substitutes written and stored by user
  const [customDopamineList, setCustomDopamineList] = useState<DopamineSubstituteItem[]>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:custom-dopamine-substitutes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [isAddingDopamine, setIsAddingDopamine] = useState(false);
  const [newDopamineName, setNewDopamineName] = useState('');
  const [newDopamineIcon, setNewDopamineIcon] = useState('✨');
  const [newDopamineDesc, setNewDopamineDesc] = useState('');

  // Combined dopamine practices: Custom + Built-in
  const allDopamineList = useMemo(() => {
    return [...customDopamineList, ...DOPAMINE_SUBSTITUTES];
  }, [customDopamineList]);

  // Synchronize hydration & live check-in from external events (e.g. AnalyzerTip dialogue)
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(`quit-smoking:health-checkin:${todayStr}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setCheckIn((prev) => ({
            ...prev,
            ...parsed,
            waterGlasses: parsed.waterGlasses ?? prev.waterGlasses,
            waterMl: parsed.waterMl ?? prev.waterMl,
            coffeeCups: parsed.coffeeCups ?? prev.coffeeCups
          }));
        }
      } catch {}
    };

    window.addEventListener('hydration-updated', handleSync);
    window.addEventListener('health-indicators-changed', handleSync);
    window.addEventListener('checkin-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('hydration-updated', handleSync);
      window.removeEventListener('health-indicators-changed', handleSync);
      window.removeEventListener('checkin-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [todayStr]);

  // Calculate live bio-recovery score
  const liveRecoveryScore = useMemo(() => {
    return calculateBioRecoveryIndex(diffMs, checkIn);
  }, [diffMs, checkIn]);

  useEffect(() => {
    if (checkIn.bioRecoveryScore !== liveRecoveryScore) {
      setCheckIn((prev) => ({ ...prev, bioRecoveryScore: liveRecoveryScore }));
    }
  }, [liveRecoveryScore]);

  // Save check-in to localStorage, sync hydration ml, and synchronize with days
  const handleSaveCheckIn = useCallback((updated: UnifiedHealthCheckIn) => {
    const safeUpdated: UnifiedHealthCheckIn = {
      ...updated,
      dopamineActions: Array.isArray(updated.dopamineActions) ? updated.dopamineActions : ['walk'],
    };
    setCheckIn(safeUpdated);
    try {
      localStorage.setItem(`quit-smoking:health-checkin:${todayStr}`, JSON.stringify(safeUpdated));
      localStorage.setItem(`quit-smoking:hydration-${todayStr}`, String((safeUpdated.waterGlasses || 0) * 250));
      window.dispatchEvent(new Event('hydration-updated'));
      window.dispatchEvent(new Event('health-indicators-changed'));
    } catch {}

    if (onSaveRating) {
      const currentDay = days[todayStr] || {};
      const newRating: DayRating = {
        ...currentDay,
        sleep: {
          bedtime: updated.bedtime || (updated.sleepSchedule === 'disrupted' ? 'Збитий' : '23:30'),
          hours: updated.sleepHours,
          note: `Режим: ${updated.sleepSchedule === 'disrupted' ? 'Збитий' : updated.sleepSchedule || 'Нормований'} · Якість: ${updated.sleepQuality}`
        },
        craving: updated.cravingLevel,
        anxiety: updated.anxietyLevel,
        mood: updated.moodLevel
      };
      onSaveRating(todayStr, newRating);
    }
  }, [todayStr, days, onSaveRating]);

  // 2. TRIGGERFIX STATE & LOGGING
  const [triggerFixLogs, setTriggerFixLogs] = useState<TriggerFixLog[]>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:triggerfix-logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [fixFormType, setFixFormType] = useState<'craving' | 'anxiety' | 'both'>('craving');
  const [fixFormIntensity, setFixFormIntensity] = useState<'mild' | 'moderate' | 'high'>('moderate');
  const [fixFormCause, setFixFormCause] = useState<string>('стрес');
  const [fixFormSelectedAntidote, setFixFormSelectedAntidote] = useState<string>('breath_478');

  // Submit TriggerFix Event
  const handleSubmitTriggerFix = () => {
    playZenSound();
    const newLog: TriggerFixLog = {
      id: `fix_${Date.now()}`,
      timestamp: Date.now(),
      type: fixFormType,
      intensity: fixFormIntensity,
      cause: fixFormCause,
      fixApplied: fixFormSelectedAntidote,
      status: 'active'
    };

    const updatedLogs = [newLog, ...triggerFixLogs];
    setTriggerFixLogs(updatedLogs);
    try {
      localStorage.setItem('quit-smoking:triggerfix-logs', JSON.stringify(updatedLogs));
    } catch {}

    // Bump up craving/anxiety in checkIn so Analyzer tracks this spike
    const updatedCheckin = {
      ...checkIn,
      cravingLevel: fixFormType === 'anxiety' ? checkIn.cravingLevel : Math.min(5, checkIn.cravingLevel + 1),
      anxietyLevel: fixFormType === 'craving' ? checkIn.anxietyLevel : Math.min(5, checkIn.anxietyLevel + 1),
      activeTrigger: fixFormCause
    };
    handleSaveCheckIn(updatedCheckin);

    showToast(`Тригер зафіксовано! Аналізатор адаптував біо-прогноз та підтримку ⚡`);
  };

  // Mark TriggerFix Log resolved
  const handleResolveTriggerFix = (id: string) => {
    playZenSound();
    const updated = triggerFixLogs.map((log) => (log.id === id ? { ...log, status: 'resolved' as const } : log));
    setTriggerFixLogs(updated);
    try {
      localStorage.setItem('quit-smoking:triggerfix-logs', JSON.stringify(updated));
    } catch {}
    showToast('Хвилю успішно подолано! Баланс відновлено 🏆');
  };

  // 3. SENTIENT ANALYZER DIALOGUE STATE
  const [dialogueHistory, setDialogueHistory] = useState<LivingDialogueTurn[]>(() => {
    return [
      {
        id: 'initial',
        speaker: 'analyzer',
        text: 'Я відчуваю твої біоритми та стежу за 7 вимірами психоемоційного балансу. Як твоє самопочуття зараз?',
        timestamp: Date.now(),
        reactionTone: 'zen'
      }
    ];
  });

  const currentDialogue = useMemo(() => {
    return getAnalyzerLivingDialogue(diffMs, checkIn);
  }, [diffMs, checkIn]);

  const handleSelectChoice = (choice: DialogueChoice) => {
    playZenSound();

    const userTurn: LivingDialogueTurn = {
      id: `u_${Date.now()}`,
      speaker: 'user',
      text: choice.text,
      timestamp: Date.now()
    };

    const analyzerTurn: LivingDialogueTurn = {
      id: `a_${Date.now() + 1}`,
      speaker: 'analyzer',
      text: choice.response,
      timestamp: Date.now() + 1,
      reactionTone: choice.tone
    };

    setDialogueHistory((prev) => [...prev, userTurn, analyzerTurn]);

    if (choice.suggestedAction === 'triggerfix') {
      setActiveModule('triggerfix');
    }

    if (choice.metricImpact) {
      const { key, value } = choice.metricImpact;
      const updated = { ...checkIn, [key]: value };
      handleSaveCheckIn(updated);
    }

    showToast('Аналізатор прийняв твій сигнал ✨');
  };

  // 4. PREDICTIVE SCENARIOS
  const scenarios: PredictiveScenario[] = useMemo(() => {
    return generatePredictiveScenarios(diffMs, checkIn);
  }, [diffMs, checkIn]);

  // 5. BREATH HOLD STOPWATCH (Проба Штанге)
  const [isBreathTesting, setIsBreathTesting] = useState(false);
  const [breathSeconds, setBreathSeconds] = useState(0);
  const breathIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startBreathTest = () => {
    setIsBreathTesting(true);
    setBreathSeconds(0);
    playZenSound();
    if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    breathIntervalRef.current = setInterval(() => {
      setBreathSeconds((s) => s + 1);
    }, 1000);
  };

  const stopBreathTest = () => {
    setIsBreathTesting(false);
    if (breathIntervalRef.current) {
      clearInterval(breathIntervalRef.current);
      breathIntervalRef.current = null;
    }
    const finalSec = breathSeconds;
    const updated = { ...checkIn, breathHoldSec: finalSec };
    handleSaveCheckIn(updated);

    let assessment = 'Задовільно';
    if (finalSec >= 55) assessment = 'Відмінно! Киснева ємність легень на максимумі!';
    else if (finalSec >= 40) assessment = 'Добре! Бронхіальний тонус суттєво зріс!';
    else assessment = 'Нормально. Легені продовжують активну детоксикацію!';

    showToast(`Проба Штанге: ${finalSec} сек. ${assessment}`);
  };

  useEffect(() => {
    return () => {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    };
  }, []);

  // Hydration helpers (чашка води, пляшка)
  const addGlasses = (deltaGlasses: number) => {
    playZenSound();
    const nextGlasses = Math.max(0, checkIn.waterGlasses + deltaGlasses);
    const nextMl = nextGlasses * 250;
    const updated = { ...checkIn, waterGlasses: nextGlasses, waterMl: nextMl };
    handleSaveCheckIn(updated);
    showToast(deltaGlasses > 0 ? `+${deltaGlasses} чаш. води додано! 💧` : 'Чашку води скасовано');
  };

  // Coffee helper: Logging coffee AUTOMATICALLY ADDS HYDRATION (+1 чашка води)
  const handleUpdateCoffee = (cups: number, time: 'morning' | 'afternoon' | 'evening' | 'none') => {
    playZenSound();
    const prevCups = checkIn.coffeeCups;
    const delta = cups - prevCups;
    // Each new cup of coffee automatically adds to hydration (+1 чашка води ~250ml)
    const newGlasses = delta > 0 ? checkIn.waterGlasses + delta : checkIn.waterGlasses;
    const newMl = newGlasses * 250;

    const updated = {
      ...checkIn,
      coffeeCups: cups,
      lastCoffeeTime: time,
      waterGlasses: newGlasses,
      waterMl: newMl
    };
    handleSaveCheckIn(updated);

    if (delta > 0) {
      showToast(`Каву оновлено (${cups} чаш.). Автоматично додано +${delta} чаш. води рідини до гідратації ☕💧`);
    } else {
      showToast(`Каву оновлено (${cups} чаш.) ☕`);
    }
  };

  // Toggle Dopamine Substitute
  const toggleDopamine = (id: string) => {
    playZenSound();
    const currentActions = Array.isArray(checkIn.dopamineActions) ? checkIn.dopamineActions : [];
    const exists = currentActions.includes(id);
    const nextActions = exists
      ? currentActions.filter((item) => item !== id)
      : [...currentActions, id];
    const updated = { ...checkIn, dopamineActions: nextActions };
    handleSaveCheckIn(updated);
    showToast(exists ? 'Практику прибрано' : 'Здоровий дофамін зафіксовано 🧠✨');
  };

  // Save new user custom dopamine substitute
  const handleSaveCustomDopamine = () => {
    if (!newDopamineName.trim()) return;
    playZenSound();
    const newItem: DopamineSubstituteItem = {
      id: `custom_dop_${Date.now()}`,
      name: newDopamineName.trim(),
      icon: newDopamineIcon || '✨',
      desc: newDopamineDesc.trim() || 'Персональна здорова дофамінова альтернатива',
      isCustom: true
    };
    const updatedList = [newItem, ...customDopamineList];
    setCustomDopamineList(updatedList);
    try {
      localStorage.setItem('quit-smoking:custom-dopamine-substitutes', JSON.stringify(updatedList));
    } catch {}

    // Auto-select this newly created dopamine activity
    const currentActions = Array.isArray(checkIn.dopamineActions) ? checkIn.dopamineActions : [];
    const nextActions = currentActions.includes(newItem.id)
      ? currentActions
      : [...currentActions, newItem.id];
    handleSaveCheckIn({ ...checkIn, dopamineActions: nextActions });

    setNewDopamineName('');
    setNewDopamineDesc('');
    setIsAddingDopamine(false);
    showToast('Свій дофаміновий замінник успішно додано й збережено! 🧠✨');
  };

  // Delete user custom dopamine substitute
  const handleDeleteCustomDopamine = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playZenSound();
    const updatedList = customDopamineList.filter((item) => item.id !== id);
    setCustomDopamineList(updatedList);
    try {
      localStorage.setItem('quit-smoking:custom-dopamine-substitutes', JSON.stringify(updatedList));
    } catch {}
    const currentActions = Array.isArray(checkIn.dopamineActions) ? checkIn.dopamineActions : [];
    const nextActions = currentActions.filter((x) => x !== id);
    handleSaveCheckIn({ ...checkIn, dopamineActions: nextActions });
    showToast('Замінник видалено');
  };

  // 6. CHART DATA & GRAPH VIEW SWITCHER
  const [chartView, setChartView] = useState<'craving_calm' | 'energy_anxiety' | 'mood_focus' | 'intrusive_sleep'>('craving_calm');

  const chartData = useMemo(() => {
    const points = [];
    for (let i = 6; i >= 0; i--) {
      const past = new Date(Date.now() - i * DAY);
      const key = `${past.getFullYear()}-${pad(past.getMonth() + 1)}-${pad(past.getDate())}`;
      const dayData = days[key] || {};
      const dayName = past.toLocaleDateString('uk-UA', { weekday: 'short' });

      // Build day trends
      points.push({
        name: dayName,
        craving: dayData.craving ?? Math.max(1, 4 - Math.floor((6 - i) * 0.4)),
        calm: dayData.mood ?? Math.min(5, 2 + Math.floor((6 - i) * 0.5)),
        energy: 2.5 + ((i * 2) % 3),
        anxiety: dayData.anxiety ?? Math.max(1, 4 - (6 - i) * 0.4),
        mood: dayData.mood ?? 3.5,
        focus: 3 + ((i + 1) % 3) * 0.8,
        intrusive: Math.max(1, 4 - Math.floor((6 - i) * 0.5)),
        sleep: dayData.sleep?.hours ?? (7 + (i % 2 === 0 ? 0.5 : -0.5))
      });
    }
    return points;
  }, [days]);

  // 7. WHO RECOVERY DATA
  const whoSystems = useMemo(() => {
    return getBodySystemsRecovery(diffMs);
  }, [diffMs]);

  const currentMilestoneIndex = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < HEALTH_MILESTONES.length; i++) {
      if (diffMs >= HEALTH_MILESTONES[i].t) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [diffMs]);

  const currentMilestone = HEALTH_MILESTONES[currentMilestoneIndex];
  const nextMilestone = HEALTH_MILESTONES[currentMilestoneIndex + 1];

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans select-none pb-28">
      {/* 1. TOP CELESTIAL HEADER: LIVING ANALYZER CORE */}
      <section className="relative w-full pt-4 pb-4 px-4 sm:px-6 bg-gradient-to-b from-[#0F1422] via-[#090D18] to-[#07090E] border-b border-slate-800/80 shadow-2xl flex flex-col items-center">
        {/* Ambient atmospheric glow */}
        <div 
          className="absolute -top-12 w-72 h-72 rounded-full pointer-events-none transition-all duration-700 opacity-25 blur-3xl"
          style={{
            background: currentDialogue.emotionalTone === 'warning'
              ? 'radial-gradient(circle, #F59E0B, transparent 70%)'
              : currentDialogue.emotionalTone === 'praise'
              ? 'radial-gradient(circle, #34D399, transparent 70%)'
              : 'radial-gradient(circle, #38BDF8, transparent 70%)'
          }}
        />

        {/* Analyzer Identity & Rename Header Bar */}
        <div className="w-full max-w-lg mb-3 px-3 py-2 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div>
              <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <span>{analyzerName}</span>
                <span className="text-[10px] text-purple-400 font-normal">супутник здоров’я</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-analyzer-naming-modal'))}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
            title="Встановити інше ім'я для Аналізатора"
          >
            <Edit3 className="w-3 h-3" />
            <span>Змінити ім'я</span>
          </button>
        </div>

        {/* Sentient Breathing Entity Core */}
        <div className="relative flex items-center justify-center mb-2.5">
          <div 
            className="w-16 h-16 rounded-full animate-pulse transition-all duration-500 flex items-center justify-center shadow-xl border border-white/10"
            style={{
              backgroundColor: currentDialogue.emotionalTone === 'warning'
                ? 'rgba(245, 158, 11, 0.15)'
                : currentDialogue.emotionalTone === 'praise'
                ? 'rgba(52, 211, 153, 0.15)'
                : 'rgba(56, 189, 248, 0.15)',
              boxShadow: currentDialogue.emotionalTone === 'warning'
                ? '0 0 32px rgba(245, 158, 11, 0.35)'
                : currentDialogue.emotionalTone === 'praise'
                ? '0 0 32px rgba(52, 211, 153, 0.35)'
                : '0 0 32px rgba(56, 189, 248, 0.35)'
            }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-400 to-amber-300 flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-white drop-shadow-md animate-spin" style={{ animationDuration: '14s' }} />
            </div>
          </div>

          <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1 shadow-lg">
            <span>{liveRecoveryScore}%</span>
            <span className="text-[8px] text-slate-400 font-normal uppercase tracking-wider">регенерація</span>
          </div>
        </div>

        {/* Living Entity Speech Bubble */}
        <div className="w-full max-w-lg mt-2 p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-lg text-center">
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            <span className="font-semibold text-cyan-300 mr-1.5">{analyzerName}:</span>
            {currentDialogue.greeting} {currentDialogue.livingAnalysis}
          </p>
        </div>

        {/* 2. REFINED SUB-MODULE TABS (ARRANGED IN 2-3 CLEAN ROWS: ZERO OVERFLOW) */}
        <div className="w-full max-w-lg mt-3.5 grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-950/85 border border-slate-800/80 shadow-inner">
          {[
            { id: 'dialogue' as HealthModule, name: 'Діалог & Поради', icon: MonoRefractedAccentIcon },
            { id: 'checkin' as HealthModule, name: 'Зріз & Чек-ін', icon: MonoRefractedSlidersIcon },
            { id: 'triggerfix' as HealthModule, name: 'Тригер', icon: MonoRefractedZapIcon },
            { id: 'who_timeline' as HealthModule, name: 'ВООЗ & Тіло', icon: MonoRefractedShieldIcon },
            { id: 'charts' as HealthModule, name: 'Графіки', icon: TrendingUp }
          ].map((tab, idx) => {
            const isActive = activeModule === tab.id;
            const Icon = tab.icon;
            const isLast = idx === 4;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playZenSound();
                  setActiveModule(tab.id);
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                  isLast ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-xs font-semibold'
                    : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border border-slate-800/70 hover:border-slate-700'
                }`}
              >
                {tab.id === 'charts' ? (
                  <ChartIconAnimated isActive={isActive} className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                )}
                <span className="truncate">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. MAIN CONTENT MODULES */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-5 flex-1 flex flex-col gap-5">
        
        {/* MODULE 1: LIVING DIALOGUE & PREDICTIVE SCENARIOS */}
        {activeModule === 'dialogue' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Interactive Response Choices */}
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-xl space-y-2.5">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                Швидка відповідь ({analyzerName}):
              </span>

              <div className="grid grid-cols-1 gap-2 pt-1">
                {(currentDialogue.choices || []).map((choice: any) => (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => handleSelectChoice(choice)}
                    className="w-full p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 active:scale-[0.99] border border-slate-700/50 hover:border-cyan-500/40 text-left transition-all cursor-pointer flex items-center justify-between text-xs text-slate-200 shadow-xs"
                  >
                    <span>{choice.text}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Timeline Stream */}
            {dialogueHistory.length > 1 && (
              <div className="p-4 rounded-3xl bg-slate-900/40 border border-slate-800/60 space-y-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Останні реакції:
                </span>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {dialogueHistory.slice(-4).map((turn) => (
                    <div
                      key={turn.id}
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        turn.speaker === 'user'
                          ? 'bg-cyan-950/30 border border-cyan-800/30 text-cyan-200 ml-5'
                          : 'bg-slate-800/50 border border-slate-700/40 text-slate-300 mr-5'
                      }`}
                    >
                      <span className="font-semibold block mb-0.5 text-[10px] text-slate-400 uppercase">
                        {turn.speaker === 'user' ? 'Ти' : analyzerName}:
                      </span>
                      {turn.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Predictive Health Scenarios */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Ймовірні сценарії на сьогодні:
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Біоритмічний прогноз</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {scenarios.map((sc) => (
                  <div
                    key={sc.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sc.color }} />
                        {sc.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 text-cyan-300 border border-slate-700/50">
                        {sc.probabilityText}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{sc.insight}</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/60">
                      💡 <strong>Порада:</strong> {sc.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick 1-Tap Meditative Support Actions */}
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => addGlasses(1)}
                className="flex-1 py-2.5 px-2 rounded-2xl bg-sky-950/40 hover:bg-sky-900/50 border border-sky-800/40 text-sky-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>+1 чашка води</span>
              </button>

              <button
                type="button"
                onClick={startBreathTest}
                className="flex-1 py-2.5 px-2 rounded-2xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/40 text-indigo-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <Wind className="w-3.5 h-3.5 text-indigo-400" />
                <span>Тест легень</span>
              </button>

              <button
                type="button"
                onClick={() => toggleDopamine('breath')}
                className="flex-1 py-2.5 px-2 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 text-emerald-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <Brain className="w-3.5 h-3.5 text-emerald-400" />
                <span>Дихання 4-7-8</span>
              </button>
            </div>
          </div>
        )}

        {/* MODULE 2: GLOBAL HEALTH DIAGNOSTIC & CHECK-IN */}
        {activeModule === 'checkin' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Header intro */}
            <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <MonoRefractedSlidersIcon className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                  Глобальний зріз та чек-ін
                </h3>
                <p className="text-xs text-slate-400">
                  7 параметрів ментального стану, фізіологія, сон та гідратація.
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-mono font-bold text-cyan-300">{liveRecoveryScore}%</span>
                <span className="block text-[9px] text-slate-500 uppercase">баланс</span>
              </div>
            </div>

            {/* Check-In Card 1: 7 Mental Health Fluctuation Sliders */}
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <RefractedPrismBrainIcon className="w-4 h-4 text-purple-400 shrink-0" />
                7 вимірів ментального здоров'я (1..5):
              </span>

              {/* 1. Рівень тяги */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <MonoRefractedFlameIcon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    Рівень тяги
                  </span>
                  <span className="font-mono font-bold text-rose-300">{checkIn.cravingLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={checkIn.cravingLevel}
                  onChange={(e) => handleSaveCheckIn({ ...checkIn, cravingLevel: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
                />
              </div>

              {/* 2. Настрій */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <MonoRefractedEyeIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Настрій
                  </span>
                  <span className="font-mono font-bold text-amber-300">{checkIn.moodLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={checkIn.moodLevel}
                  onChange={(e) => handleSaveCheckIn({ ...checkIn, moodLevel: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* 3. Енергія */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <MonoRefractedZapIcon className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    Енергія
                  </span>
                  <span className="font-mono font-bold text-yellow-300">{checkIn.energyLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={checkIn.energyLevel}
                  onChange={(e) => handleSaveCheckIn({ ...checkIn, energyLevel: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                />
              </div>

              {/* 4. Концентрація */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <MonoRefractedCompassIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    Концентрація
                  </span>
                  <span className="font-mono font-bold text-cyan-300">{checkIn.focusLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={checkIn.focusLevel}
                  onChange={(e) => handleSaveCheckIn({ ...checkIn, focusLevel: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* 5. Тривожність */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <MonoRefractedWindIcon className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    Тривожність
                  </span>
                  <span className="font-mono font-bold text-orange-300">{checkIn.anxietyLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={checkIn.anxietyLevel}
                  onChange={(e) => handleSaveCheckIn({ ...checkIn, anxietyLevel: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-400"
                />
              </div>

              {/* 6. Нав'язливість думок */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <RefractedPrismBrainIcon className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    Нав'язливість думок
                  </span>
                  <span className="font-mono font-bold text-pink-300">{checkIn.intrusiveThoughtsLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={checkIn.intrusiveThoughtsLevel}
                  onChange={(e) => handleSaveCheckIn({ ...checkIn, intrusiveThoughtsLevel: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-400"
                />
              </div>

              {/* 7. Спокій (рівень задоволення) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <MonoRefractedHeartIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Спокій (рівень задоволення)
                  </span>
                  <span className="font-mono font-bold text-emerald-300">{checkIn.calmLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={checkIn.calmLevel}
                  onChange={(e) => handleSaveCheckIn({ ...checkIn, calmLevel: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* CONFIRMATION BUTTON FOR INTERMEDIATE CHECKPOINT */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handleConfirmIntermediateState}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 text-white font-black text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefractedPrismCheckIcon className="w-4.5 h-4.5 shrink-0" />
                  <span>Підтвердити проміжний стан</span>
                </button>
                <p className="text-[10px] text-slate-400 text-center leading-tight">
                  Фіксує точні значення повзунків для побудови ліній показового графіка та аналізу коливань Аналізатором
                </p>
              </div>

              {/* List of Intermediate Survey Checkpoints Logged Today */}
              {(() => {
                const currentDay = days[todayStr] || {};
                const surveys = currentDay.surveys || currentDay.entries || [];
                if (surveys.length === 0) return null;

                return (
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                        <MonoRefractedHistoryIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Історія зафіксованих зрізів за день ({surveys.length})</span>
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {surveys.map((s: any, idx: number) => (
                        <div
                          key={s.id || idx}
                          className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-[11px] flex items-center justify-between gap-2"
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-emerald-400 text-xs">
                                [{s.time || `#${idx + 1}`}]
                              </span>
                              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                                {s.craving !== undefined && <span className="text-red-400">🔴Тяга:{s.craving}</span>}
                                {s.anxiety !== undefined && <span className="text-orange-400">🟧Тривога:{s.anxiety}</span>}
                                {s.intrusiveThoughts !== undefined && <span className="text-yellow-400">🟨Думки:{s.intrusiveThoughts}</span>}
                                {s.energy !== undefined && <span className="text-emerald-400">🟩Енергія:{s.energy}</span>}
                                {s.balance !== undefined && <span className="text-indigo-400">🟦Спокій:{s.balance}</span>}
                                {s.focus !== undefined && <span className="text-purple-400">🟪Фокус:{s.focus}</span>}
                              </div>
                            </div>
                            {s.note && (
                              <p className="text-[10px] text-slate-400 italic truncate">
                                "{s.note}"
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => s.id && handleDeleteSurveyEntry(s.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 cursor-pointer shrink-0"
                            title="Видалити цей зріз"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Check-In Card 2: Physiological Parameters */}
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Activity className="w-4 h-4 text-emerald-400" />
                Фізіологічні параметри тіла:
              </span>

              {/* Physical Body Parameters */}
              <div className="p-3 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-2">
                <span className="text-[11px] font-bold text-teal-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  Параметри тіла (Вага, Зріст, Вік, Стать):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <label className="text-[9px] text-slate-400 block font-mono">Вага (кг)</label>
                    <input
                      type="number"
                      min="20"
                      max="300"
                      value={weight}
                      onChange={(e) => handleUpdatePhysio('weight', e.target.value)}
                      className="w-full bg-transparent font-mono font-bold text-teal-300 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <label className="text-[9px] text-slate-400 block font-mono">Зріст (см)</label>
                    <input
                      type="number"
                      min="80"
                      max="250"
                      value={height}
                      onChange={(e) => handleUpdatePhysio('height', e.target.value)}
                      className="w-full bg-transparent font-mono font-bold text-teal-300 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <label className="text-[9px] text-slate-400 block font-mono">Вік (років)</label>
                    <input
                      type="number"
                      min="10"
                      max="120"
                      value={age}
                      onChange={(e) => handleUpdatePhysio('age', e.target.value)}
                      className="w-full bg-transparent font-mono font-bold text-teal-300 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <label className="text-[9px] text-slate-400 block font-mono">Стать</label>
                    <div className="flex gap-1 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleUpdatePhysio('gender', 'male')}
                        className={`flex-1 py-0.5 rounded text-[10px] font-bold cursor-pointer ${gender === 'male' ? 'bg-teal-500 text-white' : 'text-slate-400 bg-slate-900'}`}
                      >Чол</button>
                      <button
                        type="button"
                        onClick={() => handleUpdatePhysio('gender', 'female')}
                        className={`flex-1 py-0.5 rounded text-[10px] font-bold cursor-pointer ${gender === 'female' ? 'bg-teal-500 text-white' : 'text-slate-400 bg-slate-900'}`}
                      >Жін</button>
                    </div>
                  </div>
                </div>

                {/* Personal Water Norm Bar */}
                <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-200">💧 Розрахована норма води:</span>
                  <span className="font-bold text-cyan-300">{((weight * 35) / 1000).toFixed(2)} л /день ({Math.round((weight * 35) / 250)} склянок)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* Пульс */}
                <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-1">
                  <span className="text-[10px] text-slate-400 block">Пульс у спокої</span>
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <input
                      type="number"
                      value={checkIn.restingHeartRate}
                      onChange={(e) => handleSaveCheckIn({ ...checkIn, restingHeartRate: parseInt(e.target.value, 10) || 68 })}
                      className="w-14 bg-transparent font-mono font-bold text-slate-100 text-sm focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">уд/хв</span>
                  </div>
                </div>

                {/* Тиск */}
                <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-1">
                  <span className="text-[10px] text-slate-400 block">Артеріальний тиск</span>
                  <div className="flex items-center gap-1 text-slate-100 font-mono text-sm font-bold">
                    <input
                      type="number"
                      value={checkIn.bloodPressureSys}
                      onChange={(e) => handleSaveCheckIn({ ...checkIn, bloodPressureSys: parseInt(e.target.value, 10) || 120 })}
                      className="w-10 bg-transparent text-right focus:outline-none"
                    />
                    <span>/</span>
                    <input
                      type="number"
                      value={checkIn.bloodPressureDia}
                      onChange={(e) => handleSaveCheckIn({ ...checkIn, bloodPressureDia: parseInt(e.target.value, 10) || 80 })}
                      className="w-10 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Кисень SpO2 */}
                <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-1">
                  <span className="text-[10px] text-slate-400 block">Кисень SpO2</span>
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    <input
                      type="number"
                      value={checkIn.spO2}
                      onChange={(e) => handleSaveCheckIn({ ...checkIn, spO2: parseInt(e.target.value, 10) || 98 })}
                      className="w-10 bg-transparent font-mono font-bold text-slate-100 text-sm focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">%</span>
                  </div>
                </div>

                {/* Проба Штанге */}
                <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-1 col-span-2 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 block">Проба Штанге (затримка дихання)</span>
                    <span className="font-mono text-xs font-bold text-cyan-300">{checkIn.breathHoldSec} сек</span>
                  </div>
                  <div className="flex gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={startBreathTest}
                      className="px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-[11px] font-semibold hover:bg-cyan-500/30 transition-all cursor-pointer"
                    >
                      {isBreathTesting ? `Йде тест: ${breathSeconds}с` : 'Запустити секундомір'}
                    </button>
                    {isBreathTesting && (
                      <button
                        type="button"
                        onClick={stopBreathTest}
                        className="px-3 py-1 rounded-xl bg-rose-500/80 text-white text-[11px] font-semibold hover:bg-rose-600 transition-all cursor-pointer"
                      >
                        Зупинити
                      </button>
                    )}
                  </div>
                </div>

                {/* Кроки */}
                <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-1">
                  <span className="text-[10px] text-slate-400 block">Фіз активність</span>
                  <div className="flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                    <input
                      type="number"
                      step="500"
                      value={checkIn.stepsCount}
                      onChange={(e) => handleSaveCheckIn({ ...checkIn, stepsCount: parseInt(e.target.value, 10) || 3000 })}
                      className="w-16 bg-transparent font-mono font-bold text-slate-100 text-sm focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">кроків</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Check-In Card 3: Hydration (Unit: Чашка води ~250мл, Пляшка, Початкова 0) & Coffee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Hydration */}
              <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-400" />
                    Гідратація (чашка води)
                  </span>
                  <span className="font-mono text-sky-300 font-bold">
                    {checkIn.waterGlasses} чаш. води ({(checkIn.waterGlasses * 0.25).toFixed(2)} л)
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-sky-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (checkIn.waterGlasses / 8) * 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => addGlasses(1)}
                    className="py-1.5 px-1 rounded-xl bg-sky-950/40 border border-sky-800/40 text-sky-200 text-xs hover:bg-sky-900/50 transition-all cursor-pointer text-center"
                  >
                    +1 чашка
                  </button>
                  <button
                    type="button"
                    onClick={() => addGlasses(2)}
                    className="py-1.5 px-1 rounded-xl bg-sky-950/40 border border-sky-800/40 text-sky-200 text-xs hover:bg-sky-900/50 transition-all cursor-pointer text-center"
                  >
                    +1 пляшка (+2)
                  </button>
                  <button
                    type="button"
                    onClick={() => addGlasses(-1)}
                    disabled={checkIn.waterGlasses <= 0}
                    className="py-1.5 px-1 rounded-xl bg-slate-800/40 border border-slate-700/40 text-slate-400 text-xs hover:bg-slate-800 transition-all cursor-pointer text-center disabled:opacity-40"
                  >
                    -1 чашка
                  </button>
                </div>
              </div>

              {/* Coffee Tracker (Selection automatically adds hydration!) */}
              <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Coffee className="w-4 h-4 text-amber-400" />
                    Кава (додає чашку води)
                  </span>
                  <span className="font-mono text-amber-300 font-bold">{checkIn.coffeeCups} чашок</span>
                </div>

                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleUpdateCoffee(c, (checkIn.lastCoffeeTime as any) || 'none')}
                      className={`flex-1 py-1 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        checkIn.coffeeCups === c
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-xs'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <div className="flex gap-1.5 pt-0.5">
                  {(['morning', 'afternoon', 'evening'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleUpdateCoffee(checkIn.coffeeCups, t)}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-medium border transition-all cursor-pointer ${
                        checkIn.lastCoffeeTime === t
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                          : 'bg-slate-800/30 border-slate-700/40 text-slate-500'
                      }`}
                    >
                      {t === 'morning' ? 'Ранок' : t === 'afternoon' ? 'День' : 'Вечір'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Check-In Card 4: Sleep Hours & Sleep Regimen (Збитий режим підтримка) */}
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  Години сну та зафіксований період
                </span>
                <span className="font-mono text-cyan-300 font-bold">{checkIn.sleepHours} год</span>
              </div>

              {/* Specific Sleep Period Time Inputs */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-indigo-950/20 border border-indigo-500/30">
                <div>
                  <label className="text-[10px] text-indigo-300 font-mono block mb-1">
                    Заснув о (час):
                  </label>
                  <input
                    type="time"
                    value={bedtime}
                    onChange={(e) => handleBedtimeChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-indigo-300 font-mono block mb-1">
                    Прокинувся о (час):
                  </label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => handleWakeTimeChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={checkIn.sleepHours}
                onChange={(e) => handleSaveCheckIn({ ...checkIn, sleepHours: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />

              {/* Sleep Quality */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Якість сну:</span>
                <div className="flex gap-2">
                  {(['deep', 'moderate', 'restless'] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSaveCheckIn({ ...checkIn, sleepQuality: q })}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        checkIn.sleepQuality === q
                          ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-semibold shadow-xs'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {q === 'deep' ? 'Глибокий' : q === 'moderate' ? 'Звичайний' : 'Неспокійний'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep Regimen / Schedule Mode */}
              <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    Режим сну (циркадний графік):
                  </span>
                  {checkIn.sleepSchedule === 'disrupted' && (
                    <span className="text-[10px] text-amber-300 font-medium bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      Переважно збитий
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {[
                    { id: 'disrupted' as const, label: 'Збитий режим', icon: '🌙', desc: 'Плаваючий графік' },
                    { id: 'night_owl' as const, label: 'Нічна сова', icon: '🦉', desc: 'Пізній сон' },
                    { id: 'early_bird' as const, label: 'Жайворонок', icon: '🐦', desc: 'Ранній підйом' },
                    { id: 'stable' as const, label: 'Стабільний', icon: '⚓', desc: '23:00 — 07:00' },
                    { id: 'fragmented' as const, label: 'Уривчастий', icon: '🧩', desc: 'З денним сном' }
                  ].map((sched, idx) => {
                    const isSelected = checkIn.sleepSchedule === sched.id;
                    const isLast = idx === 4;
                    return (
                      <button
                        key={sched.id}
                        type="button"
                        onClick={() => {
                          playZenSound();
                          handleSaveCheckIn({ ...checkIn, sleepSchedule: sched.id });
                        }}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                          isLast ? 'col-span-2 sm:col-span-1' : ''
                        } ${
                          isSelected
                            ? 'bg-indigo-500/25 border-indigo-400/60 text-indigo-200 shadow-xs'
                            : 'bg-slate-800/30 border-slate-700/40 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-sm shrink-0">{sched.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold leading-tight">{sched.label}</div>
                          <div className="text-[9px] text-slate-400 truncate">{sched.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Adaptive Circadian Advice for Disrupted Sleep */}
                {checkIn.sleepSchedule === 'disrupted' && (
                  <div className="mt-2 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2.5">
                    <span className="text-base shrink-0 mt-0.5">🌙</span>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-indigo-300">Біоритм: Збитий режим враховано</div>
                      <div className="text-[11px] text-slate-300 leading-relaxed">
                        При нерегулярному сні мозок відчуває тимчасовий спад дофаміну, що може симулювати тягу.
                        <strong> Порада Аналізатора:</strong> поглянь на ранкове денне світло протягом 30 хв після пробудження (це перезапускає циркадні SCN-ядра гіпоталамуса) та уникай кави за 9 год до сну.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Check-In Card 5: Dopamine Substitutes with Custom Adding & Storing */}
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-purple-400" />
                  Здорові дофамінові замінники
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-purple-300 font-mono">
                    {(checkIn.dopamineActions || []).length} вибрано
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingDopamine(!isAddingDopamine)}
                    className="py-1 px-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-purple-300" />
                    <span>Свій замінник</span>
                  </button>
                </div>
              </div>

              {/* Creator Form for User's Custom Dopamine Substitutes */}
              {isAddingDopamine && (
                <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Створити свій дофаміновий замінник:
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingDopamine(false)}
                      className="text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Назва практики / заміни:</label>
                    <input
                      type="text"
                      placeholder="напр. Малювання, Пробіжка 15 хв, Погладити кота, Гра на гітарі..."
                      value={newDopamineName}
                      onChange={(e) => setNewDopamineName(e.target.value)}
                      className="w-full py-1.5 px-3 rounded-xl bg-slate-900 border border-purple-500/30 text-slate-100 text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  {/* Emoji Quick Selector */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Іконка / емодзі:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['🎨', '🎸', '🏃', '🐱', '☕', '🎮', '📖', '🎧', '🍵', '🧩', '🌿', '🏊', '🚴', '🎹', '🧘'].map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setNewDopamineIcon(em)}
                          className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all cursor-pointer ${
                            newDopamineIcon === em
                              ? 'bg-purple-500/40 border border-purple-400 scale-110 shadow-xs'
                              : 'bg-slate-800/40 hover:bg-slate-800'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Коротка дія або ефект (необов’язково):</label>
                    <input
                      type="text"
                      placeholder="напр. Миттєво перемикає увагу та дарує радість"
                      value={newDopamineDesc}
                      onChange={(e) => setNewDopamineDesc(e.target.value)}
                      className="w-full py-1.5 px-3 rounded-xl bg-slate-900 border border-purple-500/30 text-slate-100 text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSaveCustomDopamine}
                      disabled={!newDopamineName.trim()}
                      className="flex-1 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Зберегти у свої замінники</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingDopamine(false)}
                      className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all cursor-pointer"
                    >
                      Скасувати
                    </button>
                  </div>
                </div>
              )}

              {/* List of Dopamine Substitutes (Custom at the top, then Built-in) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {allDopamineList.map((dop) => {
                  const isChecked = (checkIn.dopamineActions || []).includes(dop.id);
                  return (
                    <div
                      key={dop.id}
                      onClick={() => toggleDopamine(dop.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                        isChecked
                          ? 'bg-purple-950/30 border-purple-500/50 text-purple-200 shadow-xs'
                          : 'bg-slate-800/30 border-slate-700/40 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="text-base shrink-0">{dop.icon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-200 truncate">{dop.name}</span>
                            {dop.isCustom && (
                              <span className="text-[9px] font-medium px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 shrink-0">
                                Свій
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight line-clamp-1">{dop.desc}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {dop.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustomDopamine(dop.id, e)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Видалити цей замінник"
                          >
                            ✕
                          </button>
                        )}
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-purple-500 border-purple-400 text-white'
                              : 'border-slate-600 bg-slate-900/60'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 3: ТРИГЕРФІКС (TRIGGERFIX SPIKE REPORT & INSTANT ANTIDOTE) */}
        {activeModule === 'triggerfix' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Header intro */}
            <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <MonoRefractedZapIcon className="w-4.5 h-4.5 text-rose-400 shrink-0" />
                  Тригер (Фіксація сплеску та антидот)
                </h3>
                <p className="text-xs text-slate-400">
                  Зафіксуй стрибок тяги чи тривоги, вкажи причину і отримай миттєвий фізіологічний антидот.
                </p>
              </div>
            </div>

            {/* Quick TriggerFix Form */}
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4 shadow-xl">
              {/* 1. What spiked? */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300 block">1. Що саме зросло?</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'craving' as const, label: 'Зросла тяга', icon: MonoRefractedFlameIcon, color: 'text-rose-400' },
                    { id: 'anxiety' as const, label: 'Зросла тривожність', icon: MonoRefractedWindIcon, color: 'text-orange-400' },
                    { id: 'both' as const, label: 'І тяга, і тривога', icon: MonoRefractedZapIcon, color: 'text-amber-400' }
                  ].map((item) => {
                    const isSelected = fixFormType === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFixFormType(item.id)}
                        className={`p-2.5 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-500/15 border-rose-500/50 text-rose-200 font-bold shadow-xs'
                            : 'bg-slate-800/30 border-slate-700/40 text-slate-400'
                        }`}
                      >
                        <Icon className={`w-4.5 h-4.5 ${item.color} shrink-0`} />
                        <span className="text-[11px] text-center">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Intensity */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300 block">2. Сила сплеску:</span>
                <div className="flex gap-2">
                  {[
                    { id: 'mild' as const, label: 'Легка хвиля' },
                    { id: 'moderate' as const, label: 'Помітна' },
                    { id: 'high' as const, label: 'Гостра (потрібен захист)' }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setFixFormIntensity(lvl.id)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        fixFormIntensity === lvl.id
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                          : 'bg-slate-800/30 border-slate-700/40 text-slate-400'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Cause / Reason */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300 block">3. Причина / тригер:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'кава', label: 'Кава / Еспресо', icon: '☕' },
                    { id: 'стрес', label: 'Стрес / Дедлайн', icon: '⚡' },
                    { id: 'їжа', label: 'Після їжі', icon: '🍽️' },
                    { id: 'втома', label: 'Втома / Брак сну', icon: '🥱' },
                    { id: 'нудьга', label: 'Пауза / Нудьга', icon: '⏳' },
                    { id: 'соціум', label: 'Компанія / Розмова', icon: '👥' },
                    { id: 'алкоголь', label: 'Алкоголь', icon: '🍷' },
                    { id: 'інше', label: 'Інше', icon: '🌱' }
                  ].map((cause) => (
                    <button
                      key={cause.id}
                      type="button"
                      onClick={() => setFixFormCause(cause.id)}
                      className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                        fixFormCause === cause.id
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 font-bold'
                          : 'bg-slate-800/30 border-slate-700/40 text-slate-400'
                      }`}
                    >
                      <span>{cause.icon}</span>
                      <span className="truncate">{cause.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Instant Recommended Antidote */}
              <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                <span className="text-xs font-semibold text-slate-300 block">4. Обери антидот від Аналізатора:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TRIGGERFIX_ANTIDOTES.map((ant) => (
                    <button
                      key={ant.id}
                      type="button"
                      onClick={() => setFixFormSelectedAntidote(ant.id)}
                      className={`p-2.5 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        fixFormSelectedAntidote === ant.id
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 shadow-xs'
                          : 'bg-slate-800/20 border-slate-700/40 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="text-base">{ant.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 leading-tight mb-0.5">{ant.label}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{ant.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit TriggerFix Button */}
              <button
                type="button"
                onClick={handleSubmitTriggerFix}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <MonoRefractedZapIcon className="w-4.5 h-4.5 text-slate-950 shrink-0" />
                <span>Зафіксувати у журналі Тригер</span>
              </button>
            </div>

            {/* Saved TriggerFix Logs Stream */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block px-1">
                Історія зафіксованих сплесків ({triggerFixLogs.length}):
              </span>

              {triggerFixLogs.length === 0 ? (
                <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                  Сплесків не зафіксовано. Твоя нервова система працює спокійно і чисто 🌱
                </div>
              ) : (
                <div className="space-y-2">
                  {triggerFixLogs.map((log) => {
                    const antidoteObj = TRIGGERFIX_ANTIDOTES.find((a) => a.id === log.fixApplied);
                    const isResolved = log.status === 'resolved';
                    return (
                      <div
                        key={log.id}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                          isResolved
                            ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                            : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-100">
                              {log.type === 'both' ? 'Тяга + Тривожність' : log.type === 'craving' ? 'Сплеск тяги' : 'Сплеск тривожності'}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                              Причина: {log.cause}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                            <span>Застосовано: {antidoteObj ? antidoteObj.label : log.fixApplied}</span>
                          </div>
                        </div>

                        {isResolved ? (
                          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                            <RefractedPrismCheckIcon className="w-4 h-4 shrink-0" />
                            <span>Подолано</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleResolveTriggerFix(log.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md active:scale-95"
                          >
                            Відпустило
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODULE 4: WHO TIMELINE & SYSTEMS RECOVERY */}
        {activeModule === 'who_timeline' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Current Active Milestone Hero Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-cyan-950/30 border border-cyan-500/30 backdrop-blur-md shadow-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Поточний етап відновлення ВООЗ
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {currentMilestoneIndex + 1} / {HEALTH_MILESTONES.length}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-100">{currentMilestone.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{currentMilestone.description}</p>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-cyan-200/90 leading-relaxed">
                🔬 <strong>Медичний факт:</strong> {currentMilestone.medicalFact}
              </div>
              {nextMilestone && (
                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
                  <span>Наступна мета: {nextMilestone.title}</span>
                  <span className="font-mono text-cyan-400">
                    {Math.max(0, Math.ceil((nextMilestone.t - diffMs) / (1000 * 60 * 60)))} год
                  </span>
                </div>
              )}
            </div>

            {/* 5 Biological Systems Recovery */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-200 px-1 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                Клітинне оновлення систем організму:
              </span>

              <div className="grid grid-cols-1 gap-2.5">
                {whoSystems.map((sys) => (
                  <div
                    key={sys.name}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 flex items-center gap-2">
                        <span>{sys.icon}</span>
                        <span>{sys.name}</span>
                      </span>
                      <span className="font-mono font-bold" style={{ color: sys.color }}>
                        {Math.round(sys.progress)}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${sys.progress}%`, backgroundColor: sys.color }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">{sys.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete WHO Timeline Milestones */}
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Хронологія повного очищення ВООЗ:
              </span>
              <div className="space-y-2">
                {HEALTH_MILESTONES.map((m) => {
                  const isAchieved = diffMs >= m.t;
                  return (
                    <div
                      key={m.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isAchieved
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
                          : 'bg-slate-800/20 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{m.icon}</span>
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{m.title}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{m.description}</div>
                        </div>
                      </div>
                      {isAchieved ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 5: CHARTS & FLUCTUATION DYNAMICS (MULTI-PARAMETER) */}
        {activeModule === 'charts' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Full Shared State Dynamics Chart with Period Selector */}
            <StateDynamicsChart days={days} daysRange={7} showPeriodSelector={true} />

            {/* Triggers Breakdown */}
            <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
              <span className="text-xs font-semibold text-slate-200 block">
                Аналіз найбільш частих тригерів коливань:
              </span>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Кава / Ранковий ритуал', count: 4, pct: 40, color: '#F59E0B' },
                  { name: 'Втома / Дефіцит сну', count: 3, pct: 30, color: '#38BDF8' },
                  { name: 'Стрес / Дедлайни', count: 2, pct: 20, color: '#EC4899' },
                  { name: 'Нудьга / Паузи', count: 1, pct: 10, color: '#A78BFA' }
                ].map((trig) => (
                  <div key={trig.name} className="space-y-1">
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span>{trig.name}</span>
                      <span className="font-mono text-slate-400">{trig.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${trig.pct}%`, backgroundColor: trig.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* TOAST FEEDBACK */}
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900/95 border border-cyan-500/50 text-cyan-200 text-xs shadow-2xl backdrop-blur-md animate-in fade-in duration-200">
          {toastMsg}
        </div>
      )}
    </div>
  );
};

export const HealthTab = React.memo(HealthTabComponent);
