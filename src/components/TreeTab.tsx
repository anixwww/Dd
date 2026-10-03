import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { TreeState, TreeSpeciesId, CurrentTree, ForestTree } from '../types';
import { TREE_SPECIES, getTreeStageInfo } from '../data/treeSpecies';
import { CozyForestModal } from './CozyForestModal';
import {
  ArrowLeft,
  Trees,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Sparkles,
  X,
  Compass,
  Clock,
  SlidersHorizontal,
  RotateCcw,
  Sprout,
  Check,
  Info
} from 'lucide-react';

export interface TreeTabProps {
  treeState?: TreeState;
  money?: any;
  cigsAvoided?: number;
  totalSeconds?: number;
  onUpdateTreeState?: (newState: TreeState) => void;
  onSwitchTab?: (tab: any) => void;
}

const CIGS_PER_SEED = 300;
const MATURATION_DAYS = 21;
const MATURATION_MS = MATURATION_DAYS * 24 * 3600 * 1000;

// ========================================================
// 7 DISTINCT TIME-OF-DAY PERIODS & REAL ASTRONOMICAL ENGINE
// ========================================================
export type TimeOfDay = 'predawn' | 'dawn' | 'morning' | 'day' | 'twilight' | 'evening' | 'night';

export interface AtmosphereSettings {
  period: TimeOfDay;
  periodName: string;
  icon: string;
  skyTop: string;
  skyMid1: string;
  skyMid2: string;
  skyHorizon: string;
  groundBase: string;
  groundTop: string;
  hazeColor: string;
  showSun: boolean;
  sunX?: number;
  sunY?: number;
  sunRadius?: number;
  sunCoreColor?: string;
  sunCoronaColor?: string;
  showMoon: boolean;
  moonOpacity: number;
  lightTone: 'cool' | 'warm-gold' | 'fresh-day' | 'noon' | 'sunset' | 'deep-violet' | 'nocturnal';
}

export const ATMOSPHERES: Record<TimeOfDay, AtmosphereSettings> = {
  predawn: {
    period: 'predawn',
    periodName: 'Досвіток',
    icon: '🌌',
    skyTop: '#060B18',
    skyMid1: '#12172E',
    skyMid2: '#281C38',
    skyHorizon: '#48243F',
    groundBase: '#0A120E',
    groundTop: '#182B20',
    hazeColor: 'rgba(120, 70, 130, 0.22)',
    showSun: false,
    showMoon: true,
    moonOpacity: 0.95,
    lightTone: 'cool'
  },
  dawn: {
    period: 'dawn',
    periodName: 'Світанок',
    icon: '🌅',
    skyTop: '#0F1A30',
    skyMid1: '#26294A',
    skyMid2: '#583648',
    skyHorizon: '#965036',
    groundBase: '#121A0F',
    groundTop: '#2C4422',
    hazeColor: 'rgba(235, 135, 80, 0.28)',
    showSun: true,
    sunX: 0.22,
    sunY: 0.38,
    sunRadius: 26,
    sunCoreColor: '#FFAE42',
    sunCoronaColor: 'rgba(255, 175, 75, 0.45)',
    showMoon: false,
    moonOpacity: 0,
    lightTone: 'warm-gold'
  },
  morning: {
    period: 'morning',
    periodName: 'Ранок',
    icon: '🌤️',
    skyTop: '#1A4260',
    skyMid1: '#2B6178',
    skyMid2: '#3E8388',
    skyHorizon: '#52A188',
    groundBase: '#102414',
    groundTop: '#326335',
    hazeColor: 'rgba(110, 205, 160, 0.22)',
    showSun: true,
    sunX: 0.32,
    sunY: 0.24,
    sunRadius: 28,
    sunCoreColor: '#FFF4CC',
    sunCoronaColor: 'rgba(255, 235, 155, 0.5)',
    showMoon: false,
    moonOpacity: 0,
    lightTone: 'fresh-day'
  },
  day: {
    period: 'day',
    periodName: 'День',
    icon: '☀️',
    skyTop: '#1B4F73',
    skyMid1: '#2A6F89',
    skyMid2: '#3B8E92',
    skyHorizon: '#49B091',
    groundBase: '#122816',
    groundTop: '#38733A',
    hazeColor: 'rgba(85, 190, 145, 0.22)',
    showSun: true,
    sunX: 0.50,
    sunY: 0.15,
    sunRadius: 30,
    sunCoreColor: '#FFFFFF',
    sunCoronaColor: 'rgba(255, 248, 220, 0.65)',
    showMoon: false,
    moonOpacity: 0,
    lightTone: 'noon'
  },
  twilight: {
    period: 'twilight',
    periodName: 'Сутінки',
    icon: '🌇',
    skyTop: '#1B1433',
    skyMid1: '#3D2045',
    skyMid2: '#6B2840',
    skyHorizon: '#A1482A',
    groundBase: '#140E0A',
    groundTop: '#342014',
    hazeColor: 'rgba(235, 110, 55, 0.3)',
    showSun: true,
    sunX: 0.76,
    sunY: 0.42,
    sunRadius: 26,
    sunCoreColor: '#FF6430',
    sunCoronaColor: 'rgba(255, 85, 35, 0.48)',
    showMoon: false,
    moonOpacity: 0,
    lightTone: 'sunset'
  },
  evening: {
    period: 'evening',
    periodName: 'Вечір',
    icon: '🌆',
    skyTop: '#130C24',
    skyMid1: '#221530',
    skyMid2: '#3A182A',
    skyHorizon: '#54221A',
    groundBase: '#100805',
    groundTop: '#22120A',
    hazeColor: 'rgba(185, 80, 40, 0.22)',
    showSun: false,
    showMoon: true,
    moonOpacity: 0.95,
    lightTone: 'deep-violet'
  },
  night: {
    period: 'night',
    periodName: 'Ніч',
    icon: '🌙',
    skyTop: '#03050E',
    skyMid1: '#050B14',
    skyMid2: '#071114',
    skyHorizon: '#040C08',
    groundBase: '#020302',
    groundTop: '#0B160D',
    hazeColor: 'rgba(18, 42, 28, 0.28)',
    showSun: false,
    showMoon: true,
    moonOpacity: 1.0,
    lightTone: 'nocturnal'
  }
};

export const TIME_PERIODS_ORDER: TimeOfDay[] = [
  'predawn',
  'dawn',
  'morning',
  'day',
  'twilight',
  'evening',
  'night'
];

export const getRealTimeOfDay = (): TimeOfDay => {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  if (hour >= 4 && hour < 6) return 'predawn';
  if (hour >= 6 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 11.5) return 'morning';
  if (hour >= 11.5 && hour < 16.5) return 'day';
  if (hour >= 16.5 && hour < 19.5) return 'twilight';
  if (hour >= 19.5 && hour < 22.5) return 'evening';
  return 'night';
};

// Real-world astronomical synodic Moon Phase calculation
export interface MoonPhaseData {
  phase: number;        // 0.0 to 1.0 (exact cycle fraction)
  illumination: number; // 0.0 to 1.0 (exact physical percentage / 100)
  percentage: number;   // 0 to 100
  name: string;
  icon: string;
  description: string;
  ageDays: number;
  significance: string;
}

export const getRealMoonPhase = (date: Date = new Date()): MoonPhaseData => {
  const KNOWN_NEW_MOON = 1704974220000;
  const SYNODIC_PERIOD_MS = 29.53058867 * 86400 * 1000;

  const elapsed = date.getTime() - KNOWN_NEW_MOON;
  const cycleFraction = ((elapsed % SYNODIC_PERIOD_MS) + SYNODIC_PERIOD_MS) % SYNODIC_PERIOD_MS;
  const rawPhase = cycleFraction / SYNODIC_PERIOD_MS;

  const illumination = (1 - Math.cos(2 * Math.PI * rawPhase)) / 2;
  const percentage = Math.round(illumination * 100);
  const ageDays = +(rawPhase * 29.53058867).toFixed(1);

  let name = 'Молодик (Новий місяць)';
  let icon = '🌑';
  let description = 'Місячний диск повернений до Землі темною стороною. Початок нового місячного циклу.';
  let significance = 'Час зародження нових намірів, глибокого спокою та внутрішнього перезавантаження.';

  if (rawPhase < 0.03 || rawPhase >= 0.97) {
    name = 'Молодик (Новий місяць)';
    icon = '🌑';
    description = 'Місяць між Землею та Сонцем. Небо відкриває новий цикл відродження.';
    significance = 'Час закладення твердого наміру, очищення думок та спокійного фокусу.';
  } else if (rawPhase < 0.22) {
    name = 'Зростаючий серп';
    icon = '🌒';
    description = 'Сріблястий серп щовечора стає яскравішим на західному небокраї.';
    significance = 'Час пробудження сил. Кожен чистий день зміцнює паросток вашої волі.';
  } else if (rawPhase < 0.28) {
    name = 'Перша чверть';
    icon = '🌓';
    description = 'Освітлена рівно половина місячного диска. Гармонія світла й тіні.';
    significance = 'Час рішучості, впевненості у виборі та подолання внутрішніх сумнівів.';
  } else if (rawPhase < 0.47) {
    name = 'Зростаючий місяць';
    icon = '🌔';
    description = 'Більша частина диска залита сяйвом і впевнено наближається до кульмінації.';
    significance = 'Енергія розквіту та міцності. Дерево наповнюється життєдайним соком.';
  } else if (rawPhase < 0.53) {
    name = 'Повний місяць (Повня)';
    icon = '🌕';
    description = 'Сяючий срібний диск повністю осяює нічний простір святилища.';
    significance = 'Пік духовної сили, ясне бачення свого шляху свободи та внутрішній спокій.';
  } else if (rawPhase < 0.72) {
    name = 'Спадний місяць';
    icon = '🌖';
    description = 'Світло поступово м’якшає, сонячні промені залишають правий край диска.';
    significance = 'Час вдячності за пройдені дні, спокійного збирання плодів витримки.';
  } else if (rawPhase < 0.78) {
    name = 'Остання чверть';
    icon = '🌗';
    description = 'Освітлена ліва половина диска на передранковому небі.';
    significance = 'Легке відпускання старих токсичних звичок і спокійне оновлення тіла.';
  } else {
    name = 'Спадний серп (Старий місяць)';
    icon = '🌘';
    description = 'Тонкий серп перед світанком, що завершує синодичний місячний шлях.';
    significance = 'Глибоке відновлення сил, медитативна гармонія та підготовка до нового циклу.';
  }

  return { phase: rawPhase, illumination, percentage, name, icon, description, ageDays, significance };
};

// ========================================================
// TRANSCENDENT SANCTUARY AUDIO
// Pure procedural ASMR wind breeze & gentle flame crackle
// ========================================================
// ========================================================
// TRANSCENDENT SANCTUARY AUDIO (HIGH EFFICIENCY & LOW BATTERY DRAIN)
// Pure procedural ASMR wind breeze & crackle with zero-allocation audio buffers
// ========================================================
class SanctuaryAudio {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private breezeGain: GainNode | null = null;
  private breezeFilter: BiquadFilterNode | null = null;
  private isStarted: boolean = false;
  private isNeuralActive: boolean = false;
  private neuralCrackleGain: GainNode | null = null;
  private neuralSparkTimer: any = null;
  private sharedNoiseBuffer: AudioBuffer | null = null;

  constructor() {
    try {
      const saved = localStorage.getItem('quit-smoking:tree-audio');
      if (saved !== null) {
        this.isEnabled = saved === 'true';
      }
    } catch {}
  }

  get enabled() {
    return this.isEnabled;
  }

  setEnabled(val: boolean) {
    this.isEnabled = val;
    try {
      localStorage.setItem('quit-smoking:tree-audio', String(val));
    } catch {}

    if (!val) {
      this.silence();
      return;
    }

    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (this.breezeGain) {
        this.breezeGain.gain.setTargetAtTime(0.016, this.ctx.currentTime, 0.4);
      }
      if (this.neuralCrackleGain && this.isNeuralActive) {
        this.neuralCrackleGain.gain.setTargetAtTime(0.026, this.ctx.currentTime, 0.35);
      }
    }
    if (!this.isStarted) {
      this.init();
    }
  }

  public silence() {
    if (this.neuralSparkTimer) {
      clearTimeout(this.neuralSparkTimer);
      this.neuralSparkTimer = null;
    }
    if (this.breezeGain && this.ctx) {
      try {
        this.breezeGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.breezeGain.gain.setValueAtTime(0.00001, this.ctx.currentTime);
      } catch {}
    }
    if (this.neuralCrackleGain && this.ctx) {
      try {
        this.neuralCrackleGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.neuralCrackleGain.gain.setValueAtTime(0.00001, this.ctx.currentTime);
      } catch {}
    }
    if (this.ctx && this.ctx.state === 'running') {
      try {
        this.ctx.suspend().catch(() => {});
      } catch {}
    }
  }

  public resume() {
    if (this.isEnabled && this.ctx && this.ctx.state === 'suspended') {
      try {
        this.ctx.resume().catch(() => {});
      } catch {}
    }
  }

  public init() {
    if (this.ctx && this.isStarted) {
      if (this.isEnabled && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      const now = this.ctx.currentTime;

      // Single pre-allocated 1.5-second loopable noise buffer
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.5);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (last + 0.015 * white) / 1.015;
        last = data[i];
      }
      this.sharedNoiseBuffer = noiseBuffer;

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(260, now);
      this.breezeFilter = lowpass;

      this.breezeGain = this.ctx.createGain();
      this.breezeGain.gain.setValueAtTime(this.isEnabled ? 0.016 : 0.00001, now);

      noiseSource.connect(lowpass);
      lowpass.connect(this.breezeGain);
      this.breezeGain.connect(this.ctx.destination);

      noiseSource.start(now);
      this.isStarted = true;
    } catch {}
  }

  public updateWindIntensity(intensity: number) {
    if (!this.ctx || !this.breezeGain || !this.breezeFilter || !this.isEnabled || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const targetGain = 0.002 + intensity * 0.022;
    const targetCutoff = 180 + intensity * 340;
    this.breezeGain.gain.setTargetAtTime(targetGain, now, 0.4);
    this.breezeFilter.frequency.setTargetAtTime(targetCutoff, now, 0.5);
  }

  setNeuralCrackle(active: boolean) {
    this.isNeuralActive = active;
    if (active && this.isEnabled) {
      this.init();
      this.startCrackleLoop();
    } else {
      this.stopCrackleLoop();
    }
  }

  private startCrackleLoop() {
    if (!this.ctx || !this.isEnabled) return;
    if (this.neuralCrackleGain) {
      this.neuralCrackleGain.gain.setTargetAtTime(0.045, this.ctx.currentTime, 0.2);
      return;
    }

    try {
      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.00001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.045, now + 0.2);
      masterGain.connect(this.ctx.destination);
      this.neuralCrackleGain = masterGain;

      const scheduleCrackle = () => {
        if (!this.isNeuralActive || !this.ctx || !this.neuralCrackleGain || !this.isEnabled || this.ctx.state === 'suspended') {
          return;
        }

        if (this.sharedNoiseBuffer) {
          const sparkTime = this.ctx.currentTime;
          const sSource = this.ctx.createBufferSource();
          sSource.buffer = this.sharedNoiseBuffer;

          const sFilter = this.ctx.createBiquadFilter();
          sFilter.type = 'bandpass';
          sFilter.frequency.setValueAtTime(1400 + Math.random() * 2200, sparkTime);
          sFilter.Q.setValueAtTime(2.8, sparkTime);

          const sGain = this.ctx.createGain();
          const vol = 0.02 + Math.random() * 0.03;
          sGain.gain.setValueAtTime(vol, sparkTime);
          sGain.gain.exponentialRampToValueAtTime(0.00001, sparkTime + 0.012);

          sSource.connect(sFilter);
          sFilter.connect(sGain);
          sGain.connect(this.neuralCrackleGain);

          sSource.start(sparkTime, Math.random() * 0.5, 0.015);
        }

        const nextDelay = 45 + Math.random() * 85;
        this.neuralSparkTimer = setTimeout(scheduleCrackle, nextDelay);
      };

      scheduleCrackle();
    } catch {}
  }

  private stopCrackleLoop() {
    if (this.neuralSparkTimer) {
      clearTimeout(this.neuralSparkTimer);
      this.neuralSparkTimer = null;
    }

    if (this.neuralCrackleGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.neuralCrackleGain.gain.setTargetAtTime(0.00001, now, 0.15);
        const gainToClean = this.neuralCrackleGain;
        this.neuralCrackleGain = null;
        setTimeout(() => {
          try { gainToClean.disconnect(); } catch {}
        }, 200);
      } catch {}
    }
  }

  playDropNote() {
    if (!this.ctx || !this.isEnabled) {
      if (this.isEnabled && !this.isStarted) this.init();
      return;
    }

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      const notes = [329.63, 369.99, 440.0, 493.88, 587.33];
      const freq = notes[Math.floor(Math.random() * notes.length)];

      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 0.22);

      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.85);

      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.9);
    } catch {}
  }
}

const audio = new SanctuaryAudio();

// ========================================================
// PROCEDURAL BOTANICAL & SILVER-NEURAL GOSSAMER INTERFACES
// ========================================================
interface BranchNode {
  id: string;
  length: number;
  angle: number;
  depth: number;
  thickness: number;
  swayOffset: number;
  curvature?: number;
  children: BranchNode[];
  leafCount: number;
}

interface RootNode {
  id: string;
  length: number;
  angle: number;
  depth: number;
  thickness: number;
  children: RootNode[];
}

interface AtmosphericMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
}

interface GrassBlade {
  xPercent: number;
  height: number;
  baseAngle: number;
  swayPhase: number;
  colorVariation: number;
  width: number;
}

interface FilamentSegment {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  ctrlX?: number;
  ctrlY?: number;
  isCurved?: boolean;
  domain: 'canopy' | 'root' | 'web';
  depth: number;
}

interface LightBundle {
  id: number;
  domain: 'canopy' | 'root' | 'web';
  segIndex: number;
  progress: number;
  speed: number;
  direction: 1 | -1;
  radius: number;
  alpha: number;
  subPhotons: { angle: number; dist: number; speed: number; size: number }[];
}

export const TreeTab: React.FC<TreeTabProps> = React.memo(({
  treeState,
  cigsAvoided = 0,
  onUpdateTreeState,
  onSwitchTab
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(audio.enabled);
  const [isForestOpen, setIsForestOpen] = useState<boolean>(false);
  const [isMoonModalOpen, setIsMoonModalOpen] = useState<boolean>(false);
  const [isTimeSelectorOpen, setIsTimeSelectorOpen] = useState<boolean>(false);

  // Time of Day state: Real-time automatic vs manual override
  const [manualTimePeriod, setManualTimePeriod] = useState<TimeOfDay | null>(null);
  const [realTimePeriod, setRealTimePeriod] = useState<TimeOfDay>(getRealTimeOfDay());
  const [moonData, setMoonData] = useState<MoonPhaseData>(getRealMoonPhase());

  const activePeriod = manualTimePeriod || realTimePeriod;
  const currentAtmosphere = ATMOSPHERES[activePeriod] || ATMOSPHERES.night;

  const activePeriodRef = useRef<TimeOfDay>(activePeriod);
  activePeriodRef.current = activePeriod;
  const currentAtmosphereRef = useRef<AtmosphereSettings>(currentAtmosphere);
  currentAtmosphereRef.current = currentAtmosphere;
  const moonDataRef = useRef<MoonPhaseData>(moonData);
  moonDataRef.current = moonData;

  useEffect(() => {
    const timer = setInterval(() => {
      const p = getRealTimeOfDay();
      const m = getRealMoonPhase();
      setRealTimePeriod(p);
      setMoonData(m);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Silver Neural Tree mode (Default true for rich neural model)
  const [isNeuralMode, setIsNeuralMode] = useState<boolean>(true);
  const isNeuralModeRef = useRef<boolean>(true);
  isNeuralModeRef.current = isNeuralMode;

  const neuralProgressRef = useRef<number>(1.0);
  const [hasClickedSeed, setHasClickedSeed] = useState<boolean>(false);
  const hasClickedSeedRef = useRef<boolean>(false);
  hasClickedSeedRef.current = hasClickedSeed;

  useEffect(() => {
    audio.setNeuralCrackle(isNeuralMode && soundEnabled);
    return () => {
      audio.setNeuralCrackle(false);
      audio.silence();
    };
  }, [isNeuralMode, soundEnabled]);

  // Silence audio on component unmount and when page is hidden
  useEffect(() => {
    return () => {
      audio.silence();
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.silence();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Adult Tree Preview mode
  const [previewAdult, setPreviewAdult] = useState<boolean>(false);
  const previewAdultRef = useRef<boolean>(false);
  previewAdultRef.current = previewAdult;

  const previewProgressRef = useRef<number>(0);
  const lastSpeciesRef = useRef<TreeSpeciesId | null>(null);

  // Tree state
  const currentTree = treeState?.current || null;
  const currentTreeRef = useRef<CurrentTree | null>(currentTree);
  currentTreeRef.current = currentTree;

  const forest = useMemo(() => treeState?.forest || [], [treeState?.forest]);

  const totalTreesPlanted = forest.length + (currentTree ? 1 : 0);
  const earnedSeedsTotal = Math.floor(cigsAvoided / CIGS_PER_SEED);
  const availableSeeds = Math.max(0, earnedSeedsTotal - totalTreesPlanted);
  const progressToNextSeed = cigsAvoided % CIGS_PER_SEED;
  const cigsRemaining = CIGS_PER_SEED - progressToNextSeed;

  // Selected seed when choosing
  const [selectedSeedSpecies, setSelectedSeedSpecies] = useState<TreeSpeciesId>('oak');
  const [showSeedPicker, setShowSeedPicker] = useState<boolean>(false);

  const activeSpeciesId = currentTree?.speciesId || 'oak';
  const activeSpeciesIdRef = useRef<TreeSpeciesId>(activeSpeciesId);
  activeSpeciesIdRef.current = activeSpeciesId;

  const activeSpecies = TREE_SPECIES[activeSpeciesId] || TREE_SPECIES.oak;
  const activeSpeciesRef = useRef(activeSpecies);
  activeSpeciesRef.current = activeSpecies;

  // 21-DAY REALISTIC GROWTH CALCULATION
  const { growthProgress, isMature, currentDay, daysRemaining, hoursRemaining } = useMemo(() => {
    if (!currentTree) {
      return { growthProgress: 0, isMature: false, currentDay: 0, daysRemaining: 21, hoursRemaining: 0 };
    }
    const now = Date.now();
    const elapsedMs = Math.max(0, now - (currentTree.plantedAt || now));
    const rawProgress = Math.min(1.0, elapsedMs / MATURATION_MS);
    const day = Math.min(21, Math.floor(elapsedMs / (24 * 3600 * 1000)) + 1);
    const msLeft = Math.max(0, MATURATION_MS - elapsedMs);
    const daysLeft = Math.floor(msLeft / (24 * 3600 * 1000));
    const hoursLeft = Math.floor((msLeft % (24 * 3600 * 1000)) / (3600 * 1000));
    return {
      growthProgress: rawProgress,
      isMature: rawProgress >= 1.0,
      currentDay: day,
      daysRemaining: daysLeft,
      hoursRemaining: hoursLeft
    };
  }, [currentTree]);

  const growthProgressRef = useRef<number>(growthProgress);
  growthProgressRef.current = growthProgress;

  const branchSkeletonRef = useRef<BranchNode | null>(null);
  const rootSkeletonsRef = useRef<RootNode[]>([]);
  const motesRef = useRef<AtmosphericMote[]>([]);
  const grassBladesRef = useRef<GrassBlade[]>([]);
  const lightBundlesRef = useRef<LightBundle[]>([]);

  // Toggle Sound
  const handleToggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audio.setEnabled(next);
  }, [soundEnabled]);

  // Set Time of Day
  const handleSelectTimePeriod = useCallback((period: TimeOfDay | 'auto') => {
    audio.init();
    audio.playDropNote();
    if (period === 'auto') {
      setManualTimePeriod(null);
    } else {
      setManualTimePeriod(period);
    }
    setIsTimeSelectorOpen(false);
  }, []);

  // Plant a chosen seed
  const handlePlantChosenSeed = useCallback((speciesId: TreeSpeciesId) => {
    const newTree: CurrentTree = {
      speciesId,
      plantedAt: Date.now(),
      growth: 0,
      water: 100,
      sun: 100,
      food: 100,
      lastTick: Date.now(),
      nextWeedAt: Date.now() + 86400000,
      weeds: []
    };

    onUpdateTreeState?.({
      forest: treeState?.forest || [],
      current: newTree
    });

    branchSkeletonRef.current = null;
    rootSkeletonsRef.current = [];
    setIsNeuralMode(true);
    isNeuralModeRef.current = true;
    setPreviewAdult(false);
    previewAdultRef.current = false;
    previewProgressRef.current = 0;
    neuralProgressRef.current = 1.0;
    setHasClickedSeed(false);
    hasClickedSeedRef.current = false;
    audio.playDropNote();
  }, [onUpdateTreeState, treeState?.forest]);

  // Transition mature tree into the Cozy Forest
  const handleTransitionToForest = useCallback(() => {
    if (!currentTree) return;

    const newForestTree: ForestTree = {
      id: `tree_${Date.now()}`,
      speciesId: currentTree.speciesId,
      plantedAt: currentTree.plantedAt,
      grownAt: Date.now(),
      nickname: activeSpecies.name,
      oxygenProducedKg: 48
    };

    const updatedForest = [...(treeState?.forest || []), newForestTree];

    onUpdateTreeState?.({
      forest: updatedForest,
      current: null
    });

    audio.playDropNote();
    setIsForestOpen(true);
  }, [currentTree, activeSpecies.name, onUpdateTreeState, treeState?.forest]);

  // Build tree structure skeleton
  // Build deeply elaborated neural tree structure skeleton
  const buildSkeleton = (species: TreeSpeciesId) => {
    // Multi-depth subterranean sensory nerve plexus
    const makeRootBranch = (depth: number, length: number, angle: number, idPrefix: string): RootNode => {
      const node: RootNode = {
        id: idPrefix,
        length,
        angle,
        depth,
        thickness: Math.max(0.4, 2.2 - depth * 0.42),
        children: []
      };

      if (depth < 4) {
        const count = depth === 0 ? 3 : 2;
        for (let i = 0; i < count; i++) {
          const spread = (i === 0 ? -1 : (i === 2 ? 0.9 : 0.15)) * (0.32 + Math.random() * 0.18);
          const lenScale = 0.68 + Math.random() * 0.14;
          node.children.push(
            makeRootBranch(depth + 1, length * lenScale, angle + spread, `${idPrefix}_${i}`)
          );
        }
      }
      return node;
    };

    const roots: RootNode[] = [
      makeRootBranch(0, 44, Math.PI / 2 + 0.05, 'root_tap1'),
      makeRootBranch(0, 40, Math.PI / 2 - 0.15, 'root_tap2'),
      makeRootBranch(0, 36, Math.PI / 2 - 0.52, 'root_left'),
      makeRootBranch(0, 36, Math.PI / 2 + 0.52, 'root_right'),
      makeRootBranch(0, 30, Math.PI / 2 - 0.88, 'root_far_l'),
      makeRootBranch(0, 30, Math.PI / 2 + 0.88, 'root_far_r'),
      makeRootBranch(0, 24, Math.PI / 2 - 1.15, 'root_lat_l'),
      makeRootBranch(0, 24, Math.PI / 2 + 1.15, 'root_lat_r')
    ];
    rootSkeletonsRef.current = roots;

    // Elaborated species neural arborization
    if (species === 'oak') {
      // Giant Neocortical Dendritic Arbor
      const makeOakBranch = (depth: number, length: number, angle: number, thick: number, idPrefix: string): BranchNode => {
        const node: BranchNode = {
          id: idPrefix,
          length,
          angle,
          depth,
          thickness: thick,
          swayOffset: Math.random() * Math.PI * 2,
          curvature: (Math.random() - 0.5) * 0.22,
          children: [],
          leafCount: depth >= 2 ? 7 : 0
        };
        if (depth < 6) {
          const count = depth === 0 ? 3 : (depth <= 2 ? 2 : (Math.random() > 0.25 ? 2 : 1));
          const spreads = depth === 0 ? [-0.68, 0.04, 0.64] : [-0.56, 0.52];
          for (let i = 0; i < count; i++) {
            const a = spreads[i % spreads.length] * (0.84 + Math.random() * 0.32);
            const lenScale = depth === 0 ? 0.84 : (depth === 1 ? 0.76 : 0.7);
            node.children.push(
              makeOakBranch(depth + 1, length * lenScale, a, thick * 0.64, `${idPrefix}_${i}`)
            );
          }
        }
        return node;
      };
      branchSkeletonRef.current = makeOakBranch(0, 82, -Math.PI / 2, 14, 'oak_trunk');

    } else if (species === 'sakura') {
      // Elegant Cascading Pyramidal Dendrite Arbor
      const makeSakuraBranch = (depth: number, length: number, angle: number, thick: number, idPrefix: string): BranchNode => {
        const isLeft = idPrefix.includes('_0');
        const node: BranchNode = {
          id: idPrefix,
          length,
          angle,
          depth,
          thickness: thick,
          swayOffset: Math.random() * Math.PI * 2,
          curvature: isLeft ? -0.2 : 0.2,
          children: [],
          leafCount: depth >= 1 ? 6 : 0
        };
        if (depth < 6) {
          const count = depth === 0 ? 3 : 2;
          const spreads = depth === 0 ? [-0.62, 0.02, 0.58] : [-0.62, 0.56];
          for (let i = 0; i < count; i++) {
            const a = spreads[i] * (0.86 + Math.random() * 0.28);
            node.children.push(
              makeSakuraBranch(depth + 1, length * (depth <= 1 ? 0.8 : 0.74), a, thick * 0.62, `${idPrefix}_${i}`)
            );
          }
        }
        return node;
      };
      branchSkeletonRef.current = makeSakuraBranch(0, 92, -Math.PI / 2 + 0.04, 10.5, 'sakura_trunk');

    } else if (species === 'pine') {
      // Cerebellar Purkinje Multitier Axon System
      const makePineSkeleton = (): BranchNode => {
        const trunk: BranchNode = {
          id: 'pine_trunk',
          length: 132,
          angle: -Math.PI / 2,
          depth: 0,
          thickness: 12,
          swayOffset: 0,
          children: [],
          leafCount: 0
        };

        const tiers = [
          { tierLen: 72, spread: 1.42 },
          { tierLen: 60, spread: 1.39 },
          { tierLen: 48, spread: 1.36 },
          { tierLen: 36, spread: 1.32 },
          { tierLen: 24, spread: 1.28 }
        ];

        tiers.forEach((tier, tIdx) => {
          const makeTierBranch = (len: number, angle: number, depth: number, id: string): BranchNode => {
            const b: BranchNode = {
              id,
              length: len,
              angle,
              depth,
              thickness: Math.max(0.85, 5.6 - depth * 1.2),
              swayOffset: Math.random() * Math.PI * 2,
              curvature: 0.1,
              children: [],
              leafCount: 7
            };
            if (depth < 3) {
              b.children.push(
                makeTierBranch(len * 0.66, -0.32, depth + 1, `${id}_subL`),
                makeTierBranch(len * 0.66, 0.32, depth + 1, `${id}_subR`)
              );
            }
            return b;
          };

          const leftBranch = makeTierBranch(tier.tierLen, -tier.spread, 1, `tier_${tIdx}_left`);
          const rightBranch = makeTierBranch(tier.tierLen, tier.spread, 1, `tier_${tIdx}_right`);
          trunk.children.push(leftBranch, rightBranch);
        });

        trunk.children.push({
          id: 'pine_apex',
          length: 32,
          angle: 0,
          depth: 1,
          thickness: 4.8,
          swayOffset: 0,
          children: [],
          leafCount: 9
        });

        return trunk;
      };
      branchSkeletonRef.current = makePineSkeleton();

    } else if (species === 'apple') {
      // Radiant Multipolar Neural Arbor
      const makeAppleBranch = (depth: number, length: number, angle: number, thick: number, idPrefix: string): BranchNode => {
        const node: BranchNode = {
          id: idPrefix,
          length,
          angle,
          depth,
          thickness: thick,
          swayOffset: Math.random() * Math.PI * 2,
          curvature: (Math.random() - 0.5) * 0.18,
          children: [],
          leafCount: depth >= 1 ? 6 : 0
        };
        if (depth < 6) {
          const count = depth === 0 ? 3 : 2;
          const spreads = depth === 0 ? [-0.72, 0.02, 0.68] : [-0.52, 0.48];
          for (let i = 0; i < count; i++) {
            const a = spreads[i] * (0.86 + Math.random() * 0.28);
            node.children.push(
              makeAppleBranch(depth + 1, length * 0.75, a, thick * 0.62, `${idPrefix}_${i}`)
            );
          }
        }
        return node;
      };
      branchSkeletonRef.current = makeAppleBranch(0, 68, -Math.PI / 2, 11, 'apple_trunk');

    } else {
      // Starburst Radial Cortical Arbor
      const makeMapleBranch = (depth: number, length: number, angle: number, thick: number, idPrefix: string): BranchNode => {
        const node: BranchNode = {
          id: idPrefix,
          length,
          angle,
          depth,
          thickness: thick,
          swayOffset: Math.random() * Math.PI * 2,
          curvature: (Math.random() - 0.5) * 0.16,
          children: [],
          leafCount: depth >= 1 ? 6 : 0
        };
        if (depth < 6) {
          const count = depth === 0 ? 3 : 2;
          const spreads = depth === 0 ? [-0.46, 0.0, 0.46] : [-0.56, 0.54];
          for (let i = 0; i < count; i++) {
            const a = spreads[i] * (0.88 + Math.random() * 0.24);
            node.children.push(
              makeMapleBranch(depth + 1, length * 0.76, a, thick * 0.63, `${idPrefix}_${i}`)
            );
          }
        }
        return node;
      };
      branchSkeletonRef.current = makeMapleBranch(0, 88, -Math.PI / 2, 11.5, 'maple_trunk');
    }

    // High-Energy Light Bundles & Quantum Photons
    const bundles: LightBundle[] = [];
    for (let i = 0; i < 48; i++) {
      bundles.push({
        id: i,
        domain: i % 3 === 0 ? 'root' : i % 3 === 1 ? 'web' : 'canopy',
        segIndex: i,
        progress: Math.random(),
        speed: 0.16 + Math.random() * 0.36,
        direction: Math.random() > 0.3 ? 1 : -1,
        radius: 2.6 + Math.random() * 2.2,
        alpha: 0.75 + Math.random() * 0.25,
        subPhotons: [
          { angle: 0, dist: 1.6, speed: 3.8, size: 1.3 },
          { angle: 2.0, dist: 3.0, speed: -4.4, size: 1.1 },
          { angle: 4.1, dist: 2.4, speed: 5.2, size: 1.0 },
          { angle: 1.3, dist: 3.6, speed: -3.0, size: 0.9 },
          { angle: 5.2, dist: 1.8, speed: 4.0, size: 0.8 }
        ]
      });
    }
    lightBundlesRef.current = bundles;
  };

  // ========================================================
  // HIGH-PERFORMANCE ZERO-ALLOCATION RENDER ENGINE & OFFSCREEN SPRITES
  // ========================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // 1. Offscreen Sprite Cache (Pre-rendered radial gradients to eliminate runtime gradient allocation)
    const createOffscreenGlow = (r1: number, r2: number, g1: number, g2: number, b1: number, b2: number, size = 64): HTMLCanvasElement => {
      const off = document.createElement('canvas');
      off.width = size;
      off.height = size;
      const octx = off.getContext('2d');
      if (octx) {
        const half = size / 2;
        const grad = octx.createRadialGradient(half, half, 0, half, half, half);
        grad.addColorStop(0, `rgba(255, 255, 255, 1)`);
        grad.addColorStop(0.3, `rgba(${r1}, ${g1}, ${b1}, 0.85)`);
        grad.addColorStop(0.65, `rgba(${r2}, ${g2}, ${b2}, 0.3)`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        octx.fillStyle = grad;
        octx.beginPath();
        octx.arc(half, half, half, 0, Math.PI * 2);
        octx.fill();
      }
      return off;
    };

    const spriteCyan = createOffscreenGlow(56, 192, 189, 132, 248, 252);
    const spriteViolet = createOffscreenGlow(192, 132, 132, 200, 252, 255);
    const spriteGold = createOffscreenGlow(253, 251, 224, 191, 71, 36);
    const spriteTeal = createOffscreenGlow(45, 56, 212, 189, 191, 248);
    const spritePink = createOffscreenGlow(244, 251, 114, 191, 182, 36);
    const spriteWhite = createOffscreenGlow(255, 224, 255, 242, 255, 254, 48);

    // 2. Offscreen Background Scenery Cache (Sky, Hills, Ground, Stars)
    const bgCanvas = document.createElement('canvas');
    const bgCtx = bgCanvas.getContext('2d', { alpha: false });
    let bgNeedsUpdate = true;

    // 3. Clamped DPR and Layout Dimensions
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const syncCanvasSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      bgCanvas.width = Math.floor(width * dpr);
      bgCanvas.height = Math.floor(height * dpr);
      if (bgCtx) {
        bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      bgNeedsUpdate = true;
    };

    syncCanvasSize();

    const handleResize = () => {
      syncCanvasSize();
    };
    window.addEventListener('resize', handleResize);

    const groundY = height * 0.68;
    const treeX = width * 0.5;

    if (!branchSkeletonRef.current || rootSkeletonsRef.current.length === 0 || lastSpeciesRef.current !== activeSpeciesIdRef.current) {
      lastSpeciesRef.current = activeSpeciesIdRef.current;
      buildSkeleton(activeSpeciesIdRef.current);
    }

    if (grassBladesRef.current.length === 0) {
      const blades: GrassBlade[] = [];
      const count = 70;
      for (let i = 0; i < count; i++) {
        blades.push({
          xPercent: (i + Math.random() * 0.6) / count,
          height: 6 + Math.random() * 11,
          baseAngle: (Math.random() - 0.5) * 0.25,
          swayPhase: Math.random() * Math.PI * 2,
          colorVariation: Math.random(),
          width: 1.2 + Math.random() * 1.2
        });
      }
      grassBladesRef.current = blades;
    }

    if (motesRef.current.length === 0) {
      const motes: AtmosphericMote[] = [];
      for (let i = 0; i < 28; i++) {
        motes.push({
          x: Math.random() * width,
          y: height * 0.15 + Math.random() * (groundY * 0.8),
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 3,
          size: 1.2 + Math.random() * 1.6,
          alpha: 0.2 + Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2
        });
      }
      motesRef.current = motes;
    }

    // 4. Zero-Allocation Object Pools for Tree Filaments & Node Points
    const registeredSegments: FilamentSegment[] = [];
    let segmentPoolIndex = 0;
    const segmentPool: FilamentSegment[] = [];

    const allocSegment = (
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      domain: 'canopy' | 'root' | 'web',
      depth: number,
      isCurved = false,
      ctrlX?: number,
      ctrlY?: number
    ) => {
      let seg: FilamentSegment;
      if (segmentPoolIndex < segmentPool.length) {
        seg = segmentPool[segmentPoolIndex++];
        seg.startX = startX;
        seg.startY = startY;
        seg.endX = endX;
        seg.endY = endY;
        seg.domain = domain;
        seg.depth = depth;
        seg.isCurved = isCurved;
        seg.ctrlX = ctrlX;
        seg.ctrlY = ctrlY;
      } else {
        seg = { startX, startY, endX, endY, domain, depth, isCurved, ctrlX, ctrlY };
        segmentPool.push(seg);
        segmentPoolIndex++;
      }
      registeredSegments.push(seg);
    };

    const canopyNodePoints: { x: number; y: number; depth: number }[] = [];
    const rootNodePoints: { x: number; y: number; depth: number }[] = [];

    // Pointer events: Click on seed OR Click on Moon
    const handlePointerDown = (e: PointerEvent) => {
      audio.init();
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (currentAtmosphereRef.current.showMoon) {
        const moonX = width * 0.82;
        const moonY = height * 0.16;
        const distToMoon = Math.hypot(clickX - moonX, clickY - moonY);
        if (distToMoon < 52) {
          audio.playDropNote();
          setIsMoonModalOpen((prev) => !prev);
          return;
        }
      }

      const curAtm = currentAtmosphereRef.current;
      if (curAtm.showSun && curAtm.sunX !== undefined && curAtm.sunY !== undefined) {
        const sunX = width * curAtm.sunX;
        const sunY = height * curAtm.sunY;
        const distToSun = Math.hypot(clickX - sunX, clickY - sunY);
        if (distToSun < (curAtm.sunRadius || 28) * 1.5) {
          audio.playDropNote();
          return;
        }
      }

      const distToSeed = Math.hypot(clickX - treeX, clickY - groundY);
      if (distToSeed < 65) {
        setHasClickedSeed(true);
        hasClickedSeedRef.current = true;
        setIsNeuralMode((prev) => {
          isNeuralModeRef.current = !prev;
          return !prev;
        });
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);

    // 5. Render Static Scenery into Offscreen Canvas
    let lastRenderedAtmosphere: string = '';
    const renderStaticBackground = (curAtm: AtmosphereSettings, periodKey: TimeOfDay) => {
      if (!bgCtx) return;

      const skyGrad = bgCtx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, curAtm.skyTop);
      skyGrad.addColorStop(0.38, curAtm.skyMid1);
      skyGrad.addColorStop(0.64, curAtm.skyMid2);
      skyGrad.addColorStop(0.68, curAtm.skyHorizon);
      skyGrad.addColorStop(1, curAtm.groundBase);
      bgCtx.fillStyle = skyGrad;
      bgCtx.fillRect(0, 0, width, height);

      // Starfield
      if (periodKey === 'night' || periodKey === 'predawn' || periodKey === 'evening' || periodKey === 'dawn' || periodKey === 'twilight') {
        bgCtx.save();
        const starCount = periodKey === 'night' ? 42 : (periodKey === 'predawn' ? 32 : (periodKey === 'evening' ? 20 : 10));
        for (let i = 0; i < starCount; i++) {
          const sx = (treeX * 0.35 + i * 47) % width;
          const sy = (height * 0.03 + (i * 29) % (groundY * 0.62));
          const starSize = (i % 5 === 0) ? 1.2 : 0.8;
          bgCtx.fillStyle = `rgba(230, 242, 255, ${periodKey === 'night' ? 0.6 : 0.35})`;
          bgCtx.beginPath();
          bgCtx.arc(sx, sy, starSize, 0, Math.PI * 2);
          bgCtx.fill();
        }
        bgCtx.restore();
      }

      // Soft ambient haze
      const haze = bgCtx.createRadialGradient(treeX, groundY - 30, 20, treeX, groundY - 30, width * 0.55);
      haze.addColorStop(0, curAtm.hazeColor);
      haze.addColorStop(1, 'rgba(0, 0, 0, 0)');
      bgCtx.fillStyle = haze;
      bgCtx.fillRect(0, 0, width, height);

      // Rolling Ground Ridges & Mound
      const ridgeY = groundY + 14;
      bgCtx.fillStyle = periodKey === 'night' ? '#040906' : (periodKey === 'predawn' ? '#0A140F' : (periodKey === 'day' || periodKey === 'morning' ? '#172C1C' : (periodKey === 'dawn' ? '#1C2414' : '#141E15')));
      bgCtx.beginPath();
      bgCtx.moveTo(0, height);
      bgCtx.lineTo(0, ridgeY + 12);
      bgCtx.bezierCurveTo(width * 0.35, ridgeY - 8, width * 0.75, ridgeY + 22, width, ridgeY);
      bgCtx.lineTo(width, height);
      bgCtx.closePath();
      bgCtx.fill();

      const midHillY = groundY + 6;
      bgCtx.fillStyle = periodKey === 'night' ? '#061009' : (periodKey === 'predawn' ? '#0D1C14' : (periodKey === 'day' || periodKey === 'morning' ? '#1D3B23' : (periodKey === 'dawn' ? '#26341B' : '#1A281B')));
      bgCtx.beginPath();
      bgCtx.moveTo(0, height);
      bgCtx.lineTo(0, midHillY + 6);
      bgCtx.bezierCurveTo(width * 0.25, midHillY + 14, width * 0.65, midHillY - 12, width, midHillY + 8);
      bgCtx.lineTo(width, height);
      bgCtx.closePath();
      bgCtx.fill();

      const moundGrad = bgCtx.createLinearGradient(0, groundY - 15, 0, height);
      moundGrad.addColorStop(0, curAtm.groundTop);
      moundGrad.addColorStop(0.12, curAtm.groundBase);
      moundGrad.addColorStop(0.45, '#0a1209');
      moundGrad.addColorStop(1, '#020402');
      bgCtx.fillStyle = moundGrad;

      bgCtx.beginPath();
      bgCtx.moveTo(0, height);
      bgCtx.lineTo(0, groundY + 8);
      bgCtx.bezierCurveTo(
        width * 0.25, groundY + 3,
        treeX - width * 0.15, groundY - 2,
        treeX, groundY
      );
      bgCtx.bezierCurveTo(
        treeX + width * 0.15, groundY - 2,
        width * 0.75, groundY + 5,
        width, groundY + 10
      );
      bgCtx.lineTo(width, height);
      bgCtx.closePath();
      bgCtx.fill();

      // Subterranean mineral flecks
      bgCtx.save();
      for (let m = 0; m < 16; m++) {
        const sx = (treeX * 0.4 + m * 73) % width;
        const sy = groundY + 25 + (m * 19) % (height - groundY - 40);
        bgCtx.fillStyle = 'rgba(186, 230, 253, 0.12)';
        bgCtx.beginPath();
        bgCtx.arc(sx, sy, 1.2, 0, Math.PI * 2);
        bgCtx.fill();
      }
      bgCtx.restore();

      // Moss Cushion & Fog
      bgCtx.save();
      const mossGrad = bgCtx.createRadialGradient(treeX, groundY + 4, 2, treeX, groundY + 4, 38);
      mossGrad.addColorStop(0, periodKey === 'day' || periodKey === 'morning' ? '#3B6B3E' : (periodKey === 'dawn' ? '#486634' : '#1E3E26'));
      mossGrad.addColorStop(0.5, periodKey === 'day' || periodKey === 'morning' ? '#274B2A' : '#132818');
      mossGrad.addColorStop(1, 'rgba(0,0,0,0)');
      bgCtx.fillStyle = mossGrad;
      bgCtx.beginPath();
      bgCtx.ellipse(treeX, groundY + 3, 34, 9, 0, 0, Math.PI * 2);
      bgCtx.fill();

      const fogGrad = bgCtx.createLinearGradient(0, groundY - 12, 0, groundY + 28);
      fogGrad.addColorStop(0, 'rgba(0,0,0,0)');
      fogGrad.addColorStop(0.5, periodKey === 'night' || periodKey === 'predawn' ? 'rgba(30, 55, 45, 0.12)' : (periodKey === 'dawn' ? 'rgba(215, 140, 90, 0.15)' : 'rgba(100, 160, 130, 0.1)'));
      fogGrad.addColorStop(1, 'rgba(0,0,0,0)');
      bgCtx.fillStyle = fogGrad;
      bgCtx.fillRect(0, groundY - 12, width, 40);
      bgCtx.restore();

      lastRenderedAtmosphere = `${periodKey}_${width}x${height}`;
    };

    let animId: number;
    let lastTime = performance.now();
    let lastFrameTime = 0;
    const targetFrameInterval = 1000 / 60; // 60 FPS Cap to preserve battery & avoid thermal throttle
    let windSmoothed = 0.01;

    // Visibility & Lifecycle Handlers
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.silence();
        if (animId) cancelAnimationFrame(animId);
      } else {
        lastTime = performance.now();
        lastFrameTime = performance.now();
        audio.resume();
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Continuous 60fps Energy-Efficient Render Loop
    const render = (timeMs: number) => {
      if (document.hidden) return;

      // Frame pacing: Cap at 60 FPS to preserve mobile battery
      const elapsedSinceLast = timeMs - lastFrameTime;
      if (elapsedSinceLast < targetFrameInterval - 1.2) {
        animId = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = timeMs;

      const dt = Math.min(0.04, (timeMs - lastTime) / 1000);
      lastTime = timeMs;
      const t = timeMs * 0.001;

      if (lastSpeciesRef.current !== activeSpeciesIdRef.current) {
        lastSpeciesRef.current = activeSpeciesIdRef.current;
        buildSkeleton(activeSpeciesIdRef.current);
      }

      // 1. Dynamic Wind Physics
      const slowMacro1 = Math.sin(t * 0.14);
      const slowMacro2 = Math.sin(t * 0.067 + 1.2);
      const windGate = Math.max(0, (slowMacro1 * 0.6 + slowMacro2 * 0.6 - 0.05));
      const rawBreeze = (0.012 + 0.018 * windGate) * windGate;
      const microTurbulence = (Math.sin(t * 1.8) * 0.003 + Math.sin(t * 3.7 + 0.5) * 0.0015) * windGate;
      const rawTargetWind = Math.max(0, rawBreeze + microTurbulence);

      windSmoothed += (rawTargetWind - windSmoothed) * Math.min(1.0, dt * 1.6);
      const windAudioIntensity = Math.max(0, Math.min(1.0, windSmoothed / 0.026));
      audio.updateWindIntensity(windAudioIntensity);

      // Smooth neural & preview easing
      const targetNeuralProgress = isNeuralModeRef.current ? 1.0 : 0.0;
      neuralProgressRef.current += (targetNeuralProgress - neuralProgressRef.current) * (dt * 2.5);
      const neuralAmount = neuralProgressRef.current;

      const targetPreview = previewAdultRef.current ? 1.0 : 0.0;
      previewProgressRef.current += (targetPreview - previewProgressRef.current) * (dt * 2.8);
      const previewAmount = previewProgressRef.current;

      const physicalGrowth = Math.max(growthProgressRef.current, previewAmount);

      const curAtmosphere = currentAtmosphereRef.current;
      const curRealPeriod = activePeriodRef.current;
      const curMoon = moonDataRef.current;
      const curSpecies = activeSpeciesRef.current;

      // 2. Blit Pre-rendered Scenery from Offscreen Canvas (Ultra-Fast Blit)
      const currentAtmKey = `${curRealPeriod}_${width}x${height}`;
      if (bgNeedsUpdate || lastRenderedAtmosphere !== currentAtmKey) {
        renderStaticBackground(curAtmosphere, curRealPeriod);
        bgNeedsUpdate = false;
      }
      ctx.drawImage(bgCanvas, 0, 0, width, height);

      // 3. Radiant Sun (Dawn, Morning, Day, Twilight)
      if (curAtmosphere.showSun && curAtmosphere.sunX !== undefined && curAtmosphere.sunY !== undefined) {
        ctx.save();
        const sx = width * curAtmosphere.sunX;
        const sy = height * curAtmosphere.sunY;
        const sr = curAtmosphere.sunRadius || 28;

        ctx.translate(sx, sy);

        // Rotating Sunlight Rays
        ctx.rotate(t * 0.08);
        ctx.strokeStyle = curAtmosphere.sunCoronaColor || 'rgba(255, 230, 160, 0.35)';
        ctx.lineWidth = 1.2;
        for (let r = 0; r < 10; r++) {
          const rAngle = (r * Math.PI * 2) / 10;
          const rayLen = sr * (1.8 + 0.35 * Math.sin(t * 2.0 + r));
          ctx.beginPath();
          ctx.moveTo(Math.cos(rAngle) * (sr * 0.8), Math.sin(rAngle) * (sr * 0.8));
          ctx.lineTo(Math.cos(rAngle) * rayLen, Math.sin(rAngle) * rayLen);
          ctx.stroke();
        }

        // Diamond Sun Core
        ctx.drawImage(spriteGold, -sr * 2.2, -sr * 2.2, sr * 4.4, sr * 4.4);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, sr * 0.75, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 4. Radiant Luminous Moon
      if (curAtmosphere.showMoon) {
        ctx.save();
        const mx = width * 0.82;
        const my = height * 0.16 + Math.sin(t * 0.08) * 1.2;
        const mr = 28;

        ctx.globalAlpha = curAtmosphere.moonOpacity;
        ctx.translate(mx, my);

        // Radiant Atmospheric Corona using Sprite Blitting
        const glowPulse = 0.95 + 0.05 * Math.sin(t * 1.2);
        const moonAuraR = mr * 3.4 * glowPulse;
        ctx.drawImage(spriteWhite, -moonAuraR, -moonAuraR, moonAuraR * 2, moonAuraR * 2);

        // Base Disc
        ctx.fillStyle = 'rgba(226, 232, 240, 0.35)';
        ctx.beginPath();
        ctx.arc(0, 0, mr, 0, Math.PI * 2);
        ctx.fill();

        // Real Astronomical Phase Disc
        const phase = curMoon.phase;
        ctx.save();
        ctx.beginPath();

        if (phase < 0.02 || phase > 0.98) {
          ctx.arc(0, 0, mr, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(241, 245, 249, 0.18)';
          ctx.fill();
        } else {
          const isWaxing = phase < 0.5;
          const k = Math.cos(2 * Math.PI * phase);
          const rx = Math.max(0.1, Math.abs(k) * mr);

          if (isWaxing) {
            ctx.arc(0, 0, mr, -Math.PI / 2, Math.PI / 2, false);
            ctx.ellipse(0, 0, rx, mr, 0, Math.PI / 2, -Math.PI / 2, k < 0);
          } else {
            ctx.arc(0, 0, mr, Math.PI / 2, -Math.PI / 2, false);
            ctx.ellipse(0, 0, rx, mr, 0, -Math.PI / 2, Math.PI / 2, k < 0);
          }
          ctx.closePath();
          ctx.clip();

          // Luminous lit pearl body
          ctx.fillStyle = '#F8FAFC';
          ctx.beginPath();
          ctx.arc(0, 0, mr, 0, Math.PI * 2);
          ctx.fill();

          // Tycho Crater Rays
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
          ctx.lineWidth = 0.8;
          const tychoX = mr * 0.05;
          const tychoY = mr * 0.58;
          ctx.beginPath();
          for (let r = 0; r < 6; r++) {
            const rayAngle = -Math.PI * 0.5 + (r - 2.5) * 0.35;
            ctx.moveTo(tychoX, tychoY);
            ctx.lineTo(tychoX + Math.cos(rayAngle) * mr * 0.9, tychoY + Math.sin(rayAngle) * mr * 0.9);
          }
          ctx.stroke();
        }
        ctx.restore();

        // Luminous glowing rim
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(0, 0, mr, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // 5. Living Grass Blades
      const blades = grassBladesRef.current;
      ctx.save();
      blades.forEach((b) => {
        const gx = b.xPercent * width;
        const dx = (gx - treeX) / (width * 0.5);
        const gy = groundY + (dx * dx) * 7;

        const bladeSway = windSmoothed * 14 + Math.sin(t * 2.4 + b.swayPhase) * (0.05 + windSmoothed * 4);
        const bladeAngle = b.baseAngle + bladeSway;

        const tipX = gx + Math.sin(bladeAngle) * b.height;
        const tipY = gy - Math.cos(bladeAngle) * b.height;

        ctx.strokeStyle = curRealPeriod === 'night' || curRealPeriod === 'predawn'
          ? (b.colorVariation > 0.5 ? '#1B3824' : '#142B1B')
          : (curRealPeriod === 'day' || curRealPeriod === 'morning' ? (b.colorVariation > 0.5 ? '#3C7043' : '#2F5935') : (curRealPeriod === 'dawn' ? '#446633' : '#31442B'));
        ctx.lineWidth = b.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(gx, gy + 1);
        ctx.quadraticCurveTo((gx + tipX) * 0.5 + bladeSway * 3, (gy + tipY) * 0.5, tipX, tipY);
        ctx.stroke();
      });
      ctx.restore();

      // Reset Pools
      registeredSegments.length = 0;
      segmentPoolIndex = 0;
      canopyNodePoints.length = 0;
      rootNodePoints.length = 0;

      // 6. Subterranean Root Network & Neural Axons
      const renderRootNode = (node: RootNode, startX: number, startY: number, parentAngle: number) => {
        const physicalRootGrowth = Math.min(1.0, physicalGrowth * 1.3);
        const neuralRootGrowth = Math.min(1.0, neuralAmount * 1.3);
        const effectiveRootGrowth = Math.max(physicalRootGrowth, neuralRootGrowth);

        if (effectiveRootGrowth <= 0.01) return;

        const endX = startX + Math.cos(parentAngle) * (node.length * effectiveRootGrowth);
        const endY = startY + Math.sin(parentAngle) * (node.length * effectiveRootGrowth);

        rootNodePoints.push({ x: endX, y: endY, depth: node.depth });
        allocSegment(startX, startY, endX, endY, 'root', node.depth);

        // Botanical Root
        if (physicalGrowth > 0.01 && physicalRootGrowth > 0.01) {
          ctx.save();
          ctx.strokeStyle = curRealPeriod === 'day' || curRealPeriod === 'morning' ? '#4A3728' : '#33271D';
          ctx.lineWidth = Math.max(0.65, node.thickness * physicalRootGrowth);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX + Math.cos(parentAngle) * (node.length * physicalRootGrowth), startY + Math.sin(parentAngle) * (node.length * physicalRootGrowth));
          ctx.stroke();
          ctx.restore();
        }

        // Bioluminescent Neural Root Axons
        if (neuralAmount > 0.04 && neuralRootGrowth > 0.01) {
          ctx.save();
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.2 + 0.35 * neuralAmount})`;
          ctx.lineWidth = Math.max(1.2, node.thickness * neuralRootGrowth * 0.85);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          ctx.strokeStyle = `rgba(224, 242, 254, ${0.65 + 0.35 * neuralAmount})`;
          ctx.lineWidth = Math.max(0.5, node.thickness * neuralRootGrowth * 0.32);
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          if (node.children.length === 0) {
            const tipPulse = 0.8 + 0.3 * Math.sin(t * 3.2 + node.depth);
            const rR = 1.6 * tipPulse * neuralAmount;
            ctx.fillStyle = '#67E8F9';
            ctx.beginPath();
            ctx.arc(endX, endY, rR, 0, Math.PI * 2);
            ctx.fill();

            const auraSize = rR * 5.0;
            ctx.drawImage(spriteCyan, endX - auraSize * 0.5, endY - auraSize * 0.5, auraSize, auraSize);
          }

          // Upward Traveling Root Action Potentials
          const rootPulseU = ((1.0 - (t * 1.4 + node.depth * 0.28) % 1.0) + 1.0) % 1.0;
          const rpx = startX + (endX - startX) * rootPulseU;
          const rpy = startY + (endY - startY) * rootPulseU;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(rpx, rpy, 1.1, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        for (let i = 0; i < node.children.length; i++) {
          renderRootNode(node.children[i], endX, endY, parentAngle + node.children[i].angle);
        }
      };

      if ((physicalGrowth > 0.01 || neuralAmount > 0.01) && rootSkeletonsRef.current.length > 0) {
        rootSkeletonsRef.current.forEach((trunk) => {
          renderRootNode(trunk, treeX, groundY, trunk.angle);
        });

        if (neuralAmount > 0.12 && rootNodePoints.length > 3) {
          ctx.save();
          ctx.strokeStyle = `rgba(186, 230, 253, ${0.16 * neuralAmount})`;
          ctx.lineWidth = 0.55;

          for (let i = 0; i < rootNodePoints.length; i += 2) {
            for (let j = i + 1; j < rootNodePoints.length; j += 2) {
              const p1 = rootNodePoints[i];
              const p2 = rootNodePoints[j];
              const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
              if (dist > 14 && dist < 65 && Math.abs(p1.depth - p2.depth) <= 1) {
                const midX = (p1.x + p2.x) * 0.5;
                const midY = (p1.y + p2.y) * 0.5 + 4;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
                ctx.stroke();

                allocSegment(p1.x, p1.y, p2.x, p2.y, 'root', p1.depth, true, midX, midY);
              }
            }
          }
          ctx.restore();
        }
      }

      // 7. Sacred Soma (Perikaryon / Nucleus)
      const seedScale = Math.max(0.7, 1 - physicalGrowth * 1.3);
      const seedR = Math.max(6.5, 9.5 * seedScale);
      ctx.save();

      // Expanding ripples
      for (let w = 1; w <= 3; w++) {
        const waveProgress = ((t * 0.75 + w * 0.33) % 1.0);
        const waveRadius = seedR + waveProgress * 36;
        const waveAlpha = (1 - waveProgress) * 0.55 * neuralAmount;
        ctx.strokeStyle = `rgba(56, 189, 248, ${waveAlpha})`;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.arc(treeX, groundY, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Soma Corona using Sprite Blit
      const haloR = seedR * (2.4 + 0.45 * Math.sin(t * 2.6));
      ctx.drawImage(spriteCyan, treeX - haloR, groundY - haloR, haloR * 2, haloR * 2);

      // Soma Cytoplasm
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.ellipse(treeX, groundY, seedR * 1.18, seedR * 0.92, 0, 0, Math.PI * 2);
      ctx.fill();

      // Chromatin matrix
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 0.8;
      for (let c = 0; c < 5; c++) {
        const cAngle = (c * Math.PI) / 2.5 + t * 0.4;
        ctx.beginPath();
        ctx.moveTo(treeX, groundY);
        ctx.lineTo(treeX + Math.cos(cAngle) * (seedR * 0.75), groundY + Math.sin(cAngle) * (seedR * 0.65));
        ctx.stroke();
      }

      // Nucleolus core
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(treeX, groundY, seedR * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 8. Canopy: Deep Multi-Level Neural Arborization
      const chosenSprite = activeSpeciesIdRef.current === 'sakura' ? spritePink : (activeSpeciesIdRef.current === 'pine' ? spriteTeal : (activeSpeciesIdRef.current === 'apple' ? spriteGold : spriteCyan));

      const renderBranch = (
        node: BranchNode,
        startX: number,
        startY: number,
        accumAngle: number
      ) => {
        const depthThreshold = node.depth * 0.1;

        const physicalBranchGrowth = Math.max(0, Math.min(1.0, (physicalGrowth - depthThreshold) * 2.5));
        const neuralBranchGrowth = Math.max(0, Math.min(1.0, (neuralAmount - depthThreshold) * 2.5));
        const effectiveBranchGrowth = Math.max(physicalBranchGrowth, neuralBranchGrowth);

        if (effectiveBranchGrowth <= 0.004) return;

        const depthFactor = (node.depth + 1);
        const windDeflection = windSmoothed * 1.5 * depthFactor;
        const harmonicOscillation = Math.sin(t * (1.6 + windSmoothed * 4.0) + node.swayOffset) * (0.003 + windSmoothed * 0.02) * depthFactor;
        const totalWindSway = windDeflection + harmonicOscillation;

        const currentAngle = accumAngle + node.angle + totalWindSway;

        const len = node.length * effectiveBranchGrowth;
        const endX = startX + Math.cos(currentAngle) * len;
        const endY = startY + Math.sin(currentAngle) * len;

        const curveOffset = (node.curvature || 0) * len;
        const midX = (startX + endX) * 0.5 - Math.sin(currentAngle) * curveOffset;
        const midY = (startY + endY) * 0.5 + Math.cos(currentAngle) * curveOffset;

        canopyNodePoints.push({ x: endX, y: endY, depth: node.depth });
        allocSegment(startX, startY, endX, endY, 'canopy', node.depth, !!node.curvature, node.curvature ? midX : undefined, node.curvature ? midY : undefined);

        // Botanical Wood
        if (physicalGrowth > 0.02 && physicalBranchGrowth > 0.01) {
          ctx.save();
          const pLen = node.length * physicalBranchGrowth;
          const pEndX = startX + Math.cos(currentAngle) * pLen;
          const pEndY = startY + Math.sin(currentAngle) * pLen;
          const pCurveOffset = (node.curvature || 0) * pLen;
          const pMidX = (startX + pEndX) * 0.5 - Math.sin(currentAngle) * pCurveOffset;
          const pMidY = (startY + pEndY) * 0.5 + Math.cos(currentAngle) * pCurveOffset;

          const woodThick = Math.max(1.1, node.thickness * physicalBranchGrowth);
          ctx.strokeStyle = curSpecies.trunkColor || '#5C381E';
          ctx.lineWidth = woodThick;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          if (node.curvature) ctx.quadraticCurveTo(pMidX, pMidY, pEndX, pEndY);
          else ctx.lineTo(pEndX, pEndY);
          ctx.stroke();

          if (node.depth <= 1 && woodThick > 3.5) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.lineWidth = woodThick * 0.35;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            if (node.curvature) ctx.quadraticCurveTo(pMidX, pMidY, pEndX, pEndY);
            else ctx.lineTo(pEndX, pEndY);
            ctx.stroke();
          }
          ctx.restore();
        }

        // Bioluminescent Neural Arborization
        if (neuralAmount > 0.04 && neuralBranchGrowth > 0.01) {
          ctx.save();
          const nLen = node.length * neuralBranchGrowth;
          const nEndX = startX + Math.cos(currentAngle) * nLen;
          const nEndY = startY + Math.sin(currentAngle) * nLen;
          const nCurveOffset = (node.curvature || 0) * nLen;
          const nMidX = (startX + nEndX) * 0.5 - Math.sin(currentAngle) * nCurveOffset;
          const nMidY = (startY + nEndY) * 0.5 + Math.cos(currentAngle) * nCurveOffset;

          // Halo
          const haloPulse = 0.82 + 0.22 * Math.sin(t * 2.8 + node.depth * 0.65);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.32 * neuralAmount * haloPulse})`;
          ctx.lineWidth = Math.max(2.0, node.thickness * neuralBranchGrowth * 0.72);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          if (node.curvature) ctx.quadraticCurveTo(nMidX, nMidY, nEndX, nEndY);
          else ctx.lineTo(nEndX, nEndY);
          ctx.stroke();

          // Myelinated Axon Trunk
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = Math.max(0.95, node.thickness * neuralBranchGrowth * 0.32);
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          if (node.curvature) ctx.quadraticCurveTo(nMidX, nMidY, nEndX, nEndY);
          else ctx.lineTo(nEndX, nEndY);
          ctx.stroke();

          // High-Frequency Core
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = Math.max(0.55, node.thickness * neuralBranchGrowth * 0.12);
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          if (node.curvature) ctx.quadraticCurveTo(nMidX, nMidY, nEndX, nEndY);
          else ctx.lineTo(nEndX, nEndY);
          ctx.stroke();

          // Nodes of Ranvier
          if (node.depth <= 2 && nLen > 24) {
            const numNodes = Math.floor(nLen / 22);
            for (let rIdx = 1; rIdx <= numNodes; rIdx++) {
              const rU = rIdx / (numNodes + 1);
              const invRU = 1 - rU;
              const rx = node.curvature ? (invRU * invRU * startX + 2 * invRU * rU * nMidX + rU * rU * nEndX) : (startX + (nEndX - startX) * rU);
              const ry = node.curvature ? (invRU * invRU * startY + 2 * invRU * rU * nMidY + rU * rU * nEndY) : (startY + (nEndY - startY) * rU);

              ctx.strokeStyle = '#FDE047';
              ctx.lineWidth = 1.1;
              ctx.beginPath();
              ctx.arc(rx, ry, (2.0 + node.thickness * 0.12) * neuralAmount, 0, Math.PI * 2);
              ctx.stroke();
            }
          }

          // Dendritic Spines
          if (node.depth >= 1 && nLen > 11) {
            const numSpines = Math.min(5, Math.floor(nLen / 7));
            for (let s = 1; s <= numSpines; s++) {
              const u = s / (numSpines + 1);
              const invU = 1 - u;
              const bx = node.curvature ? (invU * invU * startX + 2 * invU * u * nMidX + u * u * nEndX) : (startX + (nEndX - startX) * u);
              const by = node.curvature ? (invU * invU * startY + 2 * invU * u * nMidY + u * u * nEndY) : (startY + (nEndY - startY) * u);
              const side = s % 2 === 0 ? 1 : -1;
              const spineAngle = currentAngle + side * (Math.PI * 0.42);
              const spineLen = (2.6 + (s % 3) * 1.2) * neuralAmount;
              const spineTipX = bx + Math.cos(spineAngle) * spineLen;
              const spineTipY = by + Math.sin(spineAngle) * spineLen;

              ctx.strokeStyle = 'rgba(186, 230, 253, 0.7)';
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(bx, by);
              ctx.lineTo(spineTipX, spineTipY);
              ctx.stroke();

              ctx.fillStyle = s % 2 === 0 ? '#67E8F9' : '#A7F3D0';
              ctx.beginPath();
              ctx.arc(spineTipX, spineTipY, 1.0 * neuralAmount, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Traveling Action Potential
          const waveU = ((t * 1.75 - node.depth * 0.32) % 1.0 + 1.0) % 1.0;
          const invW = 1 - waveU;
          const px = node.curvature ? (invW * invW * startX + 2 * invW * waveU * nMidX + waveU * waveU * nEndX) : (startX + (nEndX - startX) * waveU);
          const py = node.curvature ? (invW * invW * startY + 2 * invW * waveU * nMidY + waveU * waveU * nEndY) : (startY + (nEndY - startY) * waveU);

          const spikeSize = 8 * neuralAmount;
          ctx.drawImage(chosenSprite, px - spikeSize * 0.5, py - spikeSize * 0.5, spikeSize, spikeSize);
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        // Terminal Synaptic Boutons
        if (neuralAmount > 0.06 && neuralBranchGrowth > 0.01) {
          ctx.save();
          const nLen = node.length * neuralBranchGrowth;
          const nEndX = startX + Math.cos(currentAngle) * nLen;
          const nEndY = startY + Math.sin(currentAngle) * nLen;

          ctx.translate(nEndX, nEndY);

          const isTerminal = node.children.length === 0;
          const pearlPulse = 0.85 + 0.28 * Math.sin(t * 3.6 + node.depth * 1.1);
          const boutonRadius = (isTerminal ? 3.2 : 2.0) * pearlPulse * neuralAmount;

          const boutonAuraSize = boutonRadius * 4.5;
          ctx.drawImage(chosenSprite, -boutonAuraSize * 0.5, -boutonAuraSize * 0.5, boutonAuraSize, boutonAuraSize);

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, 0, boutonRadius, 0, Math.PI * 2);
          ctx.fill();

          if (isTerminal) {
            ctx.strokeStyle = `rgba(186, 230, 253, ${0.75 * neuralAmount})`;
            ctx.lineWidth = 0.75;
            for (let d = -2; d <= 2; d++) {
              const dAngle = currentAngle + d * 0.38 + Math.sin(t * 2.4 + d) * 0.12;
              const fibrilLen = (6.0 + Math.abs(d) * 1.5) * neuralAmount;
              ctx.beginPath();
              ctx.moveTo(0, 0);
              const fx = Math.cos(dAngle) * fibrilLen;
              const fy = Math.sin(dAngle) * fibrilLen;
              ctx.lineTo(fx, fy);
              ctx.stroke();

              ctx.fillStyle = '#E0F2FE';
              ctx.beginPath();
              ctx.arc(fx, fy, 0.95 * neuralAmount, 0, Math.PI * 2);
              ctx.fill();
            }

            const orbitAngle = t * 3.2 + node.depth;
            const orbitDist = 5.5 * neuralAmount;
            ctx.fillStyle = '#FDE047';
            ctx.beginPath();
            ctx.arc(Math.cos(orbitAngle) * orbitDist, Math.sin(orbitAngle) * orbitDist, 0.95 * neuralAmount, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // Physical Foliage
        const leafGrowth = Math.max(0, Math.min(1.0, (physicalGrowth - 0.15 - node.depth * 0.08) * 2.2));
        if (leafGrowth > 0.05 && node.leafCount > 0 && (previewAmount > 0.08 || growthProgressRef.current > 0.12)) {
          ctx.save();
          const pLen = node.length * physicalBranchGrowth;
          const pEndX = startX + Math.cos(currentAngle) * pLen;
          const pEndY = startY + Math.sin(currentAngle) * pLen;
          ctx.translate(pEndX, pEndY);

          const flutterSpeed = 4.0 + windSmoothed * 24.0;
          const flutterAmp = 0.02 + windSmoothed * 0.18;

          if (activeSpeciesIdRef.current === 'pine') {
            ctx.strokeStyle = curSpecies.leafColor || '#1B6B45';
            ctx.lineWidth = 1.1;
            for (let n = -3; n <= 3; n++) {
              const nFlutter = Math.sin(t * flutterSpeed + n) * flutterAmp;
              const nAngle = currentAngle + n * 0.24 + nFlutter;
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(Math.cos(nAngle) * 12 * leafGrowth, Math.sin(nAngle) * 12 * leafGrowth);
              ctx.stroke();
            }
          } else if (activeSpeciesIdRef.current === 'sakura') {
            ctx.fillStyle = curSpecies.leafColor2 || '#F4A3C2';
            ctx.globalAlpha = 0.85;
            for (let pIdx = 0; pIdx < 5; pIdx++) {
              const pFlutter = Math.sin(t * flutterSpeed + pIdx) * flutterAmp;
              const pAngle = (pIdx * Math.PI * 2) / 5 + pFlutter;
              ctx.beginPath();
              ctx.arc(Math.cos(pAngle) * 5.5 * leafGrowth, Math.sin(pAngle) * 5.5 * leafGrowth, 3.8 * leafGrowth, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (activeSpeciesIdRef.current === 'oak') {
            ctx.fillStyle = curSpecies.leafColor || '#2D8055';
            for (let lIdx = -2; lIdx <= 2; lIdx++) {
              const lFlutter = Math.sin(t * flutterSpeed + lIdx * 1.5) * flutterAmp;
              const lAngle = currentAngle + lIdx * 0.35 + lFlutter;
              ctx.beginPath();
              ctx.ellipse(Math.cos(lAngle) * 6 * leafGrowth, Math.sin(lAngle) * 6 * leafGrowth, 8.5 * leafGrowth, 4.8 * leafGrowth, lAngle, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (activeSpeciesIdRef.current === 'apple') {
            ctx.fillStyle = curSpecies.leafColor || '#369A5D';
            for (let aIdx = -1; aIdx <= 1; aIdx++) {
              const aFlutter = Math.sin(t * flutterSpeed + aIdx * 2) * flutterAmp;
              const aAngle = currentAngle + aIdx * 0.45 + aFlutter;
              ctx.beginPath();
              ctx.ellipse(Math.cos(aAngle) * 5 * leafGrowth, Math.sin(aAngle) * 5 * leafGrowth, 7.5 * leafGrowth, 4.2 * leafGrowth, aAngle, 0, Math.PI * 2);
              ctx.fill();
            }
            if (node.depth >= 2 && leafGrowth > 0.55 && node.children.length === 0) {
              ctx.fillStyle = '#DC2626';
              ctx.beginPath();
              ctx.arc(0, 6 * leafGrowth, 4.2 * leafGrowth, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            ctx.fillStyle = curSpecies.leafColor || '#E68A2E';
            for (let mIdx = -2; mIdx <= 2; mIdx++) {
              const mFlutter = Math.sin(t * flutterSpeed + mIdx * 1.6) * flutterAmp;
              const mAngle = currentAngle + mIdx * 0.32 + mFlutter;
              ctx.beginPath();
              ctx.ellipse(Math.cos(mAngle) * 5.5 * leafGrowth, Math.sin(mAngle) * 5.5 * leafGrowth, 8 * leafGrowth, 3.8 * leafGrowth, mAngle, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();
        }

        for (let i = 0; i < node.children.length; i++) {
          renderBranch(node.children[i], endX, endY, currentAngle);
        }
      };

      if (branchSkeletonRef.current && (physicalGrowth > 0.005 || neuralAmount > 0.005)) {
        renderBranch(branchSkeletonRef.current, treeX, groundY, 0);
      }

      // 9. Astrocytic Glia Matrix
      if (neuralAmount > 0.1 && canopyNodePoints.length > 6) {
        ctx.save();
        ctx.strokeStyle = `rgba(241, 245, 249, ${0.35 * neuralAmount})`;
        ctx.lineWidth = 0.7;

        for (let i = 0; i < canopyNodePoints.length; i += 2) {
          for (let j = i + 1; j < canopyNodePoints.length; j += 2) {
            const p1 = canopyNodePoints[i];
            const p2 = canopyNodePoints[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

            if (dist > 30 && dist < 140 && Math.abs(p1.depth - p2.depth) <= 1) {
              const midX = (p1.x + p2.x) * 0.5;
              const midY = (p1.y + p2.y) * 0.5 + (dist * 0.08);

              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
              ctx.stroke();

              const astroPulse = 0.8 + 0.3 * Math.sin(t * 2.8 + p1.depth + i);
              const pearlR = 1.35 * astroPulse * neuralAmount;
              ctx.fillStyle = 'rgba(224, 242, 254, 0.9)';
              ctx.beginPath();
              ctx.arc(midX, midY, pearlR, 0, Math.PI * 2);
              ctx.fill();

              allocSegment(p1.x, p1.y, p2.x, p2.y, 'web', p1.depth, true, midX, midY);
            }
          }
        }
        ctx.restore();
      }

      // 10. Light Bundles & Action Potential Photons (Sprite-Accelerated)
      if (neuralAmount > 0.08 && registeredSegments.length > 0) {
        const segCount = registeredSegments.length;
        const bundles = lightBundlesRef.current;

        bundles.forEach((bundle) => {
          bundle.progress += bundle.speed * bundle.direction * dt;

          if (bundle.progress > 1.0) {
            bundle.progress = 0;
            bundle.segIndex = Math.floor(Math.random() * segCount);
            bundle.direction = Math.random() > 0.2 ? 1 : -1;
          } else if (bundle.progress < 0.0) {
            bundle.progress = 1.0;
            bundle.segIndex = Math.floor(Math.random() * segCount);
            bundle.direction = Math.random() > 0.2 ? 1 : -1;
          }

          const seg = registeredSegments[bundle.segIndex % segCount];
          if (!seg) return;

          let px: number;
          let py: number;
          const u = bundle.progress;

          if (seg.isCurved && seg.ctrlX !== undefined && seg.ctrlY !== undefined) {
            const inv = 1 - u;
            px = inv * inv * seg.startX + 2 * inv * u * seg.ctrlX + u * u * seg.endX;
            py = inv * inv * seg.startY + 2 * inv * u * seg.ctrlY + u * u * seg.endY;
          } else {
            px = seg.startX + (seg.endX - seg.startX) * u;
            py = seg.startY + (seg.endY - seg.startY) * u;
          }

          ctx.save();
          const auraR = (bundle.radius * 3.4) * neuralAmount;
          ctx.drawImage(chosenSprite, px - auraR, py - auraR, auraR * 2, auraR * 2);

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(px, py, bundle.radius * 0.75 * neuralAmount, 0, Math.PI * 2);
          ctx.fill();

          bundle.subPhotons.forEach((sp) => {
            const currentSubAngle = sp.angle + t * sp.speed;
            const spX = px + Math.cos(currentSubAngle) * sp.dist;
            const spY = py + Math.sin(currentSubAngle) * sp.dist;
            ctx.fillStyle = 'rgba(224, 242, 254, 0.9)';
            ctx.beginPath();
            ctx.arc(spX, spY, sp.size * neuralAmount, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.restore();
        });
      }

      // 11. Atmospheric Motes
      const motes = motesRef.current;
      motes.forEach((m) => {
        const windDriftX = windSmoothed * 38;
        m.x += (m.vx + windDriftX) * dt;
        m.y += m.vy * dt;

        if (m.x < 5) m.x = width - 10;
        if (m.x > width - 5) m.x = 10;
        if (m.y < height * 0.12) m.y = groundY - 10;
        if (m.y > groundY + 10) m.y = height * 0.18;

        ctx.save();
        if (neuralAmount > 0.25) {
          const pulse = 0.4 + 0.6 * Math.sin(t * 3.0 + m.phase);
          ctx.fillStyle = `rgba(186, 230, 253, ${pulse * 0.65})`;
        } else if (curRealPeriod === 'night' || curRealPeriod === 'predawn') {
          const pulse = 0.3 + 0.7 * Math.sin(t * 2.2 + m.phase);
          ctx.fillStyle = 'rgba(210, 255, 140, ' + (pulse * 0.55) + ')';
        } else {
          ctx.fillStyle = 'rgba(200, 235, 180, 0.32)';
        }
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      audio.silence();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#040711] text-stone-100 select-none overflow-hidden font-sans touch-none"
    >
      {/* Living Sanctuary Canvas (Full Screen) */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full cursor-pointer" />

      {/* CSS PULSATING MOON GLOW AURA (Overlaid at 82% left, 16% top) */}
      {currentAtmosphere.showMoon && (
        <div
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full animate-lunar-pulse z-20"
          style={{
            left: '82%',
            top: '16%',
            width: '64px',
            height: '64px',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, rgba(224, 242, 254, 0.45) 45%, rgba(186, 230, 253, 0) 75%)'
          }}
        />
      )}

      {/* TOP BAR: BACK ARROW, TIME SELECTOR, SOUND TOGGLE & 'ЛІС' BUTTON */}
      <header className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => onSwitchTab?.('counter')}
          className="pointer-events-auto w-10 h-10 rounded-full bg-stone-900/60 hover:bg-stone-800/80 active:scale-95 border border-stone-700/40 backdrop-blur-md flex items-center justify-center text-stone-300 hover:text-white transition-all cursor-pointer shadow-lg"
          title="Повернутися"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {/* Time of Day Switcher Button */}
          <button
            type="button"
            onClick={() => {
              audio.init();
              audio.playDropNote();
              setIsTimeSelectorOpen((prev) => !prev);
            }}
            className={`pointer-events-auto h-10 px-3.5 rounded-full border backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
              manualTimePeriod
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-200 hover:bg-amber-900/70 hover:text-white'
                : 'bg-stone-900/60 border-stone-700/40 text-stone-300 hover:bg-stone-800/80 hover:text-white'
            }`}
            title="Перемикач часу доби (досвіток, світанок, ранок, день, сутінки, вечір, ніч)"
          >
            <span className="text-sm">{currentAtmosphere.icon}</span>
            <span className="text-xs font-semibold">{currentAtmosphere.periodName}</span>
            {manualTimePeriod && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          {/* Sound Ambience Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`pointer-events-auto w-10 h-10 rounded-full border backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
              soundEnabled
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/70 hover:text-white'
                : 'bg-stone-900/60 border-stone-700/40 text-stone-400 hover:bg-stone-800/80 hover:text-stone-200'
            }`}
            title={soundEnabled ? 'Звук увімкнено (шелест вітру, ASMR)' : 'Звук вимкнено'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* 'Ліс' Full-Screen Button */}
          <button
            type="button"
            onClick={() => setIsForestOpen(true)}
            className="pointer-events-auto h-10 px-4 rounded-full bg-stone-900/70 hover:bg-stone-800/90 active:scale-95 border border-emerald-500/30 backdrop-blur-md flex items-center gap-2 text-emerald-200 hover:text-white transition-all cursor-pointer shadow-lg"
            title="Затишний Ліс"
          >
            <Trees className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold">Ліс</span>
            {forest.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-mono text-emerald-300">
                {forest.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* TIME-OF-DAY SELECTOR FLOATING MENU */}
      {isTimeSelectorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-black/40 backdrop-blur-sm animate-fade-in pointer-events-auto"
          onClick={() => setIsTimeSelectorOpen(false)}
        >
          <div
            className="w-72 rounded-3xl bg-stone-950/92 border border-amber-500/30 backdrop-blur-2xl shadow-2xl p-4 text-stone-100 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800/80 mb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Час та Освітлення
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsTimeSelectorOpen(false)}
                className="w-6 h-6 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 7 Times Grid */}
            <div className="grid grid-cols-1 gap-1.5 mb-3">
              {TIME_PERIODS_ORDER.map((periodKey) => {
                const item = ATMOSPHERES[periodKey];
                const isSelected = activePeriod === periodKey;
                return (
                  <button
                    key={periodKey}
                    type="button"
                    onClick={() => handleSelectTimePeriod(periodKey)}
                    className={`w-full px-3 py-2 rounded-2xl flex items-center justify-between text-xs font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-md scale-[1.01]'
                        : 'bg-stone-900/50 border-stone-800/50 hover:bg-stone-800/70 text-stone-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.periodName}</span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 font-mono">
                        Активно
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Automatic Real-Time Button */}
            <button
              type="button"
              onClick={() => handleSelectTimePeriod('auto')}
              className={`w-full py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-medium transition-all cursor-pointer border ${
                manualTimePeriod === null
                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-200'
                  : 'bg-stone-900/60 border-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Реальний час (Авто: {ATMOSPHERES[realTimePeriod].periodName})</span>
            </button>
          </div>
        </div>
      )}

      {/* ASTRONOMICAL MOON PHASE FLOATING INFO MODAL / CARD */}
      {isMoonModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in pointer-events-auto"
          onClick={() => setIsMoonModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-stone-950/90 border border-sky-500/30 backdrop-blur-2xl shadow-2xl p-6 text-stone-100 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-stone-800/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-sky-950/80 border border-sky-500/30 flex items-center justify-center text-sky-300">
                  <Moon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium uppercase tracking-widest text-sky-400/90">
                  Астрономічний Місяць
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMoonModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Закрити"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-5 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-stone-900 via-sky-950/40 to-stone-900 border border-sky-400/30 flex items-center justify-center shadow-lg relative shrink-0">
                <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(186,230,253,0.6)]">
                  {moonData.icon}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-sky-100 truncate">
                  {moonData.name}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {moonData.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 my-4">
              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800/80">
                <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mb-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Освітленість</span>
                </div>
                <p className="text-base font-bold text-white font-mono">
                  {moonData.percentage}%
                </p>
                <div className="w-full h-1.5 bg-stone-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-amber-300 rounded-full transition-all duration-500"
                    style={{ width: `${moonData.percentage}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800/80">
                <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mb-1">
                  <Clock className="w-3 h-3 text-sky-400" />
                  <span>Вік Місяця</span>
                </div>
                <p className="text-base font-bold text-white font-mono">
                  {moonData.ageDays} <span className="text-xs font-normal text-stone-400">/ 29.5 дні</span>
                </p>
                <p className="text-[10px] text-stone-500 mt-1">
                  {currentAtmosphere.periodName}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-500/20 my-3">
              <div className="flex items-start gap-2">
                <Compass className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                <p className="text-xs text-sky-200/90 leading-relaxed">
                  {moonData.significance}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMoonModalOpen(false)}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-sky-600/80 to-indigo-600/80 hover:from-sky-500 hover:to-indigo-500 active:scale-98 text-white text-xs font-semibold tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Зрозуміло</span>
            </button>
          </div>
        </div>
      )}

      {/* ADULT TREE PREVIEW FLOATING PILL */}
      {previewAdult && !isMature && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-sm w-[90%] sm:w-auto animate-fade-in">
          <div className="px-4 py-3 rounded-2xl bg-stone-950/85 border border-emerald-500/40 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl shrink-0">{activeSpecies.icon}</span>
              <div>
                <p className="text-xs font-semibold text-emerald-300">
                  Форма дорослого дерева ({activeSpecies.name})
                </p>
                <p className="text-[10px] text-stone-400">
                  Повторює нейронні контури. Торкніться зернини для павутинки
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                audio.init();
                audio.playDropNote();
                setPreviewAdult(false);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium cursor-pointer transition-all border border-stone-600/50 shrink-0"
            >
              Закрити
            </button>
          </div>
        </div>
      )}

      {/* МІНІМАЛІСТИЧНИЙ ІНДИКАТОР: ПРИБРАНО НИЖНЮ ПАНЕЛЬ, ЗАЛИШЕНО ДЕНЬ 1 */}
      {currentTree && !isMature && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-fade-in select-none">
          <div className="px-5 py-2 rounded-full bg-stone-950/80 border border-emerald-500/40 backdrop-blur-xl shadow-2xl flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
            <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-emerald-300 uppercase">
              День {currentDay || 1}
            </span>
          </div>
        </div>
      )}

      {/* 2. NO CURRENT TREE: SEED PICKER MODAL (OPEN ON DEMAND OR WHEN SEED READY) */}
      {!currentTree && (showSeedPicker || availableSeeds > 0) && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in pointer-events-auto">
          <div className="w-full max-w-md rounded-3xl bg-stone-950/95 border border-emerald-500/40 shadow-2xl p-5 text-stone-100 relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-lg">
                  🌱
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-200">
                    {availableSeeds > 0 ? 'Вам відкрилася насінина дерева!' : 'Вибір насінини дерева'}
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Розвиток живої нейронної моделі дерева
                  </p>
                </div>
              </div>
              {availableSeeds === 0 && (
                <button
                  type="button"
                  onClick={() => setShowSeedPicker(false)}
                  className="w-7 h-7 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* SEED SELECTION LIST */}
            <div className="my-3 space-y-2 overflow-y-auto flex-1 pr-1">
              {(Object.keys(TREE_SPECIES) as TreeSpeciesId[]).map((spId) => {
                const sp = TREE_SPECIES[spId];
                const isSelected = selectedSeedSpecies === spId;
                return (
                  <div
                    key={spId}
                    onClick={() => {
                      setSelectedSeedSpecies(spId);
                      audio.init();
                      audio.playDropNote();
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400/70 shadow-lg scale-[1.01]'
                        : 'bg-stone-900/60 border-stone-800/80 hover:bg-stone-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-2xl shrink-0">
                        {sp.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-100">{sp.name}</span>
                          <span className="text-[10px] text-stone-400 italic">({sp.botanicalName})</span>
                        </div>
                        <p className="text-[11px] text-stone-400 line-clamp-1">{sp.symbol}</p>
                        <p className="text-[10px] text-emerald-400/90 font-mono mt-0.5">Нейронний ріст</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-black shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-2 border-t border-stone-800/80 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  handlePlantChosenSeed(selectedSeedSpecies);
                  setShowSeedPicker(false);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition active:scale-98 shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <Sprout className="w-4 h-4" />
                <span>Посадити насінину ({TREE_SPECIES[selectedSeedSpecies].name})</span>
              </button>
              {availableSeeds === 0 && (
                <p className="text-[10px] text-center text-stone-400">
                  (Тестовий режим: доступний для миттєвого ознайомлення)
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. NO TREE & NO SEED AVAILABLE: PROGRESSION CARD TOWARDS 300 CIGARETTES */}
      {!currentTree && availableSeeds === 0 && !showSeedPicker && (
        <div className="absolute bottom-6 left-4 right-4 z-30 pointer-events-none flex justify-center">
          <div className="pointer-events-auto max-w-md w-full p-4 rounded-3xl bg-stone-950/90 border border-amber-500/35 backdrop-blur-2xl shadow-2xl flex flex-col gap-2.5 text-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-xl shrink-0">
                🌰
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-amber-200">
                  Насінина відкривається за 300 сигарет
                </h4>
                <p className="text-[11px] text-stone-400">
                  Не викурюйте 300 сигарет, щоб обрати насінину та посадити дерево
                </p>
              </div>
            </div>

            {/* Progress to 300 cigarettes avoided */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-300">Прогрес:</span>
                <span className="text-amber-400 font-bold">
                  {progressToNextSeed} / 300 ({Math.round((progressToNextSeed / 300) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-stone-800/80 rounded-full h-2 overflow-hidden border border-stone-700/50">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-700 rounded-full"
                  style={{ width: `${Math.max(2, Math.round((progressToNextSeed / 300) * 100))}%` }}
                />
              </div>
              <p className="text-[10px] text-stone-400 text-right">
                Залишилося: <span className="text-stone-200 font-semibold">{cigsRemaining} сигарет</span>
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowSeedPicker(true)}
                className="flex-1 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600/50 text-stone-200 text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Ознайомитися з породами</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handlePlantChosenSeed('oak');
                }}
                className="py-2 px-3 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
                title="Посадити насінину в демо-режимі"
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>Посадити зараз (Демо)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MATURE TREE: TRANSITION TO COZY FOREST PROMPT (21 DAYS REACHED) */}
      {isMature && currentTree && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <div className="px-5 py-3 rounded-2xl bg-stone-950/85 border border-emerald-500/40 backdrop-blur-xl shadow-2xl flex items-center gap-4 animate-fade-in">
            <div>
              <p className="text-xs font-semibold text-emerald-300">Дерево повністю дозріло!</p>
              <p className="text-[11px] text-stone-400">Час перенести саджанець у Затишний Ліс</p>
            </div>
            <button
              type="button"
              onClick={handleTransitionToForest}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-medium transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Trees className="w-3.5 h-3.5" />
              <span>У Затишний Ліс</span>
            </button>
          </div>
        </div>
      )}

      {/* COZY FOREST FULL SCREEN */}
      <CozyForestModal
        isOpen={isForestOpen}
        onClose={() => setIsForestOpen(false)}
        forest={forest}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        availableSeeds={availableSeeds}
        cigsAvoided={cigsAvoided}
        currentTree={currentTree}
        moonData={moonData}
        onPlantSeed={handlePlantChosenSeed}
      />
    </div>
  );
});
