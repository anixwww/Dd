import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MoneySettings, TreeState, GoalsState, OrbitVoyageState, DayRating, Streak } from '../../types';
import { TREE_SPECIES, getTreeStageInfo } from '../../data/treeSpecies';
import { getTodayHealthFact, HEALTH_MILESTONES, getBodySystemsRecovery } from '../../data/healthData';
import { LEVEL_CONFIG, getLevelCounts } from '../../data/sandConfig';
import { useModalManager } from './useModalManager';
import { StatusIndicators } from './StatusIndicators';
import { GoalsSection } from './GoalsSection';
import { ModalContainer } from './ModalContainer';
import { MiniResourceBar } from '../MiniResourceBar';
import { EdenPenCanvas } from '../EdenPenCanvas';
import {
  User,
  ShieldAlert,
  Sparkles,
  Eye,
  EyeOff,
  HeartPulse,
  Activity,
  Trees,
  ArrowRight,
  Target,
  Check,
  Lock,
  LockOpen,
  TrendingUp,
  Clock,
  Sword,
  BookOpen,
  Dumbbell,
  Footprints,
  CheckSquare,
  CheckCircle2,
  Brain,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Gift,
  Minimize2,
  Maximize2,
  Cigarette,
  Wind,
  Waves,
  Music,
  Gamepad2,
  Droplets,
  History,
  Calculator,
  Save,
  Leaf,
  Palette,
  Layout,
  Heart,
  FileText,
  Download,
  Coffee,
  Star,
  Sun,
  Sliders
} from 'lucide-react';

import { IndicatorSettingsModal } from '../IndicatorSettingsModal';
import { DailyStepsSection } from '../DailyStepsSection';
import { MentalHealthCard } from '../MentalHealthCard';
import { GratitudeJournalCard } from '../GratitudeJournalCard';
import { CardErrorBoundary } from '../CardErrorBoundary';
import { restoreAllWindowsToFeed } from '../../utils/cardStorageSafety';
import { AnalyzerTip } from '../AnalyzerTip';
import { MotivationalPhrasesModal, MotivationStyle } from '../MotivationalPhrasesModal';
import { GoalSettingsModal } from '../GoalSettingsModal';

const RefractedYinYangIcon: React.FC<{ className?: string; isDecomposing?: boolean }> = ({ className = 'w-5 h-5' }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2a10 10 0 0 0 0 20 5 5 0 0 0 0-10 5 5 0 0 1 0-10z" fill="currentColor" />
      <circle cx="12" cy="7" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" />
    </svg>
  </div>
);

const RefractedMeditationStarIcon: React.FC<{ className?: string; style?: React.CSSProperties; isDecomposing?: boolean }> = ({ className = 'w-5 h-5', style }) => (
  <Star className={className} style={style} />
);

const RefractedTimerShell: React.FC<{ children?: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style }) => (
  <div className={className} style={style}>{children}</div>
);

const getSectionRefractedPictogram = (key: string, cls: string = 'w-5 h-5') => {
  switch (key) {
    case 'calc': return <Calculator className={cls} />;
    case 'presets': return <Sliders className={cls} />;
    case 'themes': return <Palette className={cls} />;
    case 'timer_skins': return <Clock className={cls} />;
    case 'theme': return <Sun className={cls} />;
    case 'frameless_style': return <Sparkles className={cls} />;
    case 'gratitude_journal': return <Heart className={cls} />;
    case 'daily_steps': return <CheckSquare className={cls} />;
    case 'mental_health': return <Brain className={cls} />;
    case 'notes': return <BookOpen className={cls} />;
    case 'analyzer_thoughts_db': return <FileText className={cls} />;
    case 'backup': return <Download className={cls} />;
    case 'perf_optimization': return <Zap className={cls} />;
    case 'cache_cleanup': return <Trash2 className={cls} />;
    case 'monitor': return <Activity className={cls} />;
    default: return <Sparkles className={cls} />;
  }
};
import { 
  RefractedSandglassIcon, 
  RefractedTreeOfLifeIcon, 
  RefractedOrbitSphereIcon,
  RefractedSingingBowlIcon,
  RefractedInfiniteSproutIcon
} from '../RefractedGameIcons';

/**
 * Animated Refracted Light Yin-Yang icon:
 * Light of the Yin-Yang symbol refracted through a glass prism, splitting into celestial rays
 * with subtle prismatic optical dispersion and gentle breathing movement.
 */
const YinYangIcon: React.FC<{
  className?: string;
  isDecomposing?: boolean;
}> = ({ className, isDecomposing = true }) => (
  <RefractedYinYangIcon className={className} isDecomposing={isDecomposing} />
);

import { QuickGoalCard } from '../QuickGoalCard';
import { RecoveryPictogramsBlock } from './RecoveryPictograms';
import { CoffeeBreakfastModal } from '../CoffeeBreakfastModal';
import { StateChartModal } from '../StateChartModal';
import { ExpandedSavedResourcesStats } from './ExpandedSavedResourcesStats';
import { getTimerStyleCssClass, VALID_TIMER_STYLE_IDS } from './TimerStyles';
import { 
  X, 
  Bookmark, 
  Pin, 
  Edit3, 
  ChevronLeft, 
  ChevronRight as ChevronRightIcon,
  Coins,
  Hourglass,
  Wallet,
  TreePine,
  Timer,
  Bird,
  ShieldCheck,
  SlidersHorizontal,
  Settings,
  Zap,
  Sparkle,
  Compass,
  StickyNote,
  Trash2,
  Plus,
  Search,
  Tag,
  Info,
  MousePointer2,
  LayoutGrid,
  Grid,
  Grid3X3,
  List
} from 'lucide-react';




export const ThoughtAnticipationIcon: React.FC<{
  stage: 'speaking' | 'disappearing' | 'calm' | 'gathering' | 'imminent';
  isAboutToBurst?: boolean;
  className?: string;
  style?: React.CSSProperties;
}> = ({ stage, isAboutToBurst = false, className = 'w-4 h-4', style }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      style={style}
    >
      {/* Central intuitive thought orb (expands to outer border 1s before thought appears) */}
      <circle 
        cx="12" 
        cy="12" 
        r={isAboutToBurst ? "8.5" : "3.2"} 
        fill="currentColor" 
        fillOpacity={
          isAboutToBurst 
            ? '0.95' 
            : stage === 'speaking' 
            ? '0.9' 
            : stage === 'imminent' 
            ? '0.85' 
            : stage === 'gathering' 
            ? '0.5' 
            : '0.25'
        } 
        className="transition-all duration-700 ease-out"
      />
      {/* Outer energy brainwaves/arcs */}
      <path d="M12 3a9 9 0 0 1 6.36 2.64" strokeWidth="1.6" strokeDasharray={stage === 'calm' ? '2 2' : 'none'} className="transition-opacity duration-500" />
      <path d="M21 12a9 9 0 0 1-2.64 6.36" strokeWidth="1.6" strokeDasharray={stage === 'calm' ? '2 2' : 'none'} className="transition-opacity duration-500" />
      <path d="M12 21a9 9 0 0 1-6.36-2.64" strokeWidth="1.6" strokeDasharray={stage === 'calm' ? '2 2' : 'none'} className="transition-opacity duration-500" />
      <path d="M3 12a9 9 0 0 1 2.64-6.36" strokeWidth="1.6" strokeDasharray={stage === 'calm' ? '2 2' : 'none'} className="transition-opacity duration-500" />
    </svg>
  );
};

export const FourPointStar: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = 'w-5 h-5', style }) => {
  return (
    <RefractedMeditationStarIcon className={className} style={style} />
  );
};

export const SliceIcon: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  isFast?: boolean;
}> = ({ className = 'w-4 h-4', style, isFast = false }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <style>{`
        @keyframes slide-one {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(7px); }
        }
        @keyframes slide-two {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(-7px); }
        }
        .slider-node-1 {
          animation: slide-one ${isFast ? '1.2s' : '3s'} ease-in-out infinite;
        }
        .slider-node-2 {
          animation: slide-two ${isFast ? '1.4s' : '3.5s'} ease-in-out infinite;
        }
      `}</style>
      <path d="M4 8h16" stroke="currentColor" opacity="0.4" />
      <circle cx="7" cy="8" r="2.2" fill="currentColor" className="slider-node-1 text-[#FFFDD0]" />

      <path d="M4 16h16" stroke="currentColor" opacity="0.4" />
      <circle cx="17" cy="16" r="2.2" fill="currentColor" className="slider-node-2 text-[#FFFDD0]" />
    </svg>
  );
};

interface CounterTabProps {
  onOpenMeditation?: () => void;
  isMeditationOpen?: boolean;
  diffMs: number;
  startDate: number;
  money: MoneySettings | null;
  totalSaved: number;
  cigsAvoided: number;
  treeState: TreeState;
  orbitState?: OrbitVoyageState;
  daysCount: number;
  reasons: string[];
  streaks?: Streak[];
  longestStreakMs?: number;
  goals?: GoalsState;
  activeGoalName?: string;
  activeGoalPct?: number;
  onOpenSos: () => void;
  onOpenSetup?: () => void;
  onOpenRelapse?: () => void;
  onUndoLastRelapse?: () => void;
  onSwitchTab: (tab: any) => void;
  onAddGoal?: (name: string, amount?: number, targetDate?: string) => void;
  onCompleteGoal?: (goalId: string) => void;
  onDeleteGoal?: (goalId: string) => void;
  dayRatings: Record<string, DayRating>;
  accent?: string;
  appTheme?: string;
  onUpdateReasons?: (reasons: string[]) => void;
  onUpdateMoney?: (money: MoneySettings) => void;
  onOpenOverlaySection?: (sectionKey: string) => void;
  indicatorStyle?: string;
  onUpdateIndicatorStyle?: (style: string) => void;
  showTimerHint?: boolean;
  onUpdateTimerHint?: (show: boolean) => void;
  isZenMode?: boolean;
  setIsZenMode?: (val: boolean) => void;
  isTimerStarted?: boolean;
  onOpenAnalyzerModal?: () => void;
}



const AutumnLeaves: React.FC = () => {
  const leaves = React.useMemo(() => {
    const leafIcons = ['🍁', '🍂'];
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      char: leafIcons[i % leafIcons.length],
      left: `${(i * 7) + 2}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${6 + Math.random() * 5}s`,
      size: `${14 + Math.random() * 10}px`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0">
      {leaves.map((leaf) => (
        <span
          key={leaf.id}
          className="absolute text-amber-500/80 dark:text-orange-400/80 animate-autumnFall"
          style={{
            left: leaf.left,
            top: '-20px',
            fontSize: leaf.size,
            animationDelay: leaf.delay,
            animationDuration: leaf.duration,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear'
          }}
        >
          {leaf.char}
        </span>
      ))}
    </div>
  );
};

interface SectionVisualInfo {
  icon: (iconClass: string) => React.ReactNode;
  bgClass: string;
  textClass: string;
  hoverBorder: string;
  title: string;
  desc: string;
}

const getSectionVisual = (key: string): SectionVisualInfo => {
  const getIcon = (cls: string) => getSectionRefractedPictogram(key, cls);
  const baseVisual = {
    bgClass: "bg-zinc-800/80 border border-zinc-700/50",
    textClass: "text-zinc-200",
    hoverBorder: "hover:border-zinc-600",
    icon: getIcon,
  };

  switch (key) {
    case "calc":
      return {
        ...baseVisual,
        title: "Калькулятор витрат",
        desc: "Кількість на день, ціна та підрахунок"
      };
    case "presets":
      return {
        ...baseVisual,
        title: "Конфігурації та Пресети",
        desc: "Збереження та захист усіх поточних налаштувань"
      };
    case "themes":
      return {
        ...baseVisual,
        title: "Теми",
        desc: "Оформлення та динамічний фон"
      };
    case "timer_skins":
      return {
        ...baseVisual,
        title: "Оболонки таймера",
        desc: "Стиль та вигляд центрального лічильника"
      };
    case "theme":
      return {
        ...baseVisual,
        title: "Відтінок",
        desc: "Акцентний колір інтерфейсу"
      };
    case "frameless_style":
      return {
        ...baseVisual,
        title: "Налаштування вікон",
        desc: "Прозорість, рамки та закруглення"
      };
    case "who_progress":
      return {
        ...baseVisual,
        title: "Прогрес одужання за ВООЗ",
        desc: "Медичні рубежі регенерації систем організму"
      };
    case "gratitude_journal":
      return {
        ...baseVisual,
        title: "Щоденник вдячності",
        desc: "3 приємні моменти щодня для ресурсу"
      };
    case "daily_steps":
      return {
        ...baseVisual,
        title: "Щоденні справи",
        desc: "Список щоденних мікро-кроків та завдань"
      };
    case "mental_health":
      return {
        ...baseVisual,
        title: "Ментальне здоров'я",
        desc: "Дофамінові практики та ритуали балансу"
      };
    case "notes":
      return {
        ...baseVisual,
        title: "Мої нотатки",
        desc: "Швидкі замітки та думки"
      };
    case "analyzer_thoughts_db":
      return {
        ...baseVisual,
        title: "База думок Аналізатора",
        desc: "Перегляд усіх 8 категорій: абсурд, гумор, наука, природа, поради, підказки"
      };
    case "yinyang_gallery":
      return {
        ...baseVisual,
        title: "Галерея картин Інь-Ян",
        desc: "Світлові картини у дерев’яних рамах"
      };
    case "backup":
      return {
        ...baseVisual,
        title: "Резервне копіювання даних",
        desc: "Експорт та відновлення прогресу у файл"
      };
    case "perf_optimization":
      return {
        ...baseVisual,
        title: "Оптимізація продуктивності",
        desc: "Зупинка важких часток, охолодження ЦП та економія батареї"
      };
    case "monitor":
      return {
        ...baseVisual,
        title: "Моніторинг ресурсів (Кеш, ЦП, ОЗП, FPS)",
        desc: "Апаратні метрики: StorageManager, Event Loop, Температура та FPS"
      };
    case "developer":
      return {
        ...baseVisual,
        title: "Підтримка розробника",
        desc: "Автор проекту та банка Monobank"
      };
    case "cache_cleanup":
      return {
        ...baseVisual,
        title: "Очистити кеш та скинути стан",
        desc: "Видалення тимчасових файлів кешу або повне скидання додатка"
      };
    case "sos_breath":
      return {
        ...baseVisual,
        title: "Фізіологічне дихання",
        desc: "SOS-практика подвійного вдиху проти тяги"
      };
    case "sos_wave":
      return {
        ...baseVisual,
        title: "Серфінг хвилі тяги",
        desc: "Перечекати пік фізіологічної тяги (3–5 хв)"
      };
    case "sos_grounding":
      return {
        ...baseVisual,
        title: "Заземлення 5-4-3-2-1",
        desc: "Швидке сенсорне перемикання уваги"
      };
    case "sos_sound":
    case "sos_soundscapes":
      return {
        ...baseVisual,
        title: "Звукотерапія спокою",
        desc: "Релаксуючі ембієнт-звуки природи"
      };
    case "sos_wheel":
    case "sos_replacements":
      return {
        ...baseVisual,
        title: "Колесо замінників",
        desc: "Корисні 1-хвилинні дії замість сигарети"
      };
    case "sos_game":
    case "sos_bubbles":
      return {
        ...baseVisual,
        title: "Лопай Бульбашки",
        desc: "Тактильна гра для зняття напруги"
      };
    case "sos_cards":
      return {
        ...baseVisual,
        title: "Когнітивні картки SOS",
        desc: "Психологічна аргументація проти зриву"
      };
    case "sos_cold":
      return {
        ...baseVisual,
        title: "Холодовий шок нирця",
        desc: "Миттєве перезавантаження блукаючого нерва"
      };
    case "bowls":
    case "sos_bowls":
      return {
        ...baseVisual,
        title: "Співочі чаші",
        desc: "Акустична дзен-симуляція звучання тибетських чаш"
      };
    case "sos_log":
      return {
        ...baseVisual,
        title: "Журнал криз SOS",
        desc: "Історія та перемога над нападами тяги"
      };
    default:
      return {
        ...baseVisual,
        title: `Розділ: ${key}`,
        desc: "Швидкий доступ з панелей застосунку"
      };
  }
};

const getSectionIcon = (key: string, iconClass = "w-4 h-4") => {
  return getSectionVisual(key).icon(iconClass);
};

const getSectionMetadata = (key: string) => {
  const visual = getSectionVisual(key);
  return { title: visual.title, desc: visual.desc };
};

interface QuickAccessViewSwitcherProps {
  mode: 'large' | 'medium' | 'small' | 'list';
  onChange: (mode: 'large' | 'medium' | 'small' | 'list') => void;
}

const QuickAccessViewSwitcher: React.FC<QuickAccessViewSwitcherProps> = ({ mode, onChange }) => {
  const modes = [
    { id: 'large' as const, icon: LayoutGrid, title: 'Великі плитки' },
    { id: 'medium' as const, icon: Grid, title: 'Середні плитки' },
    { id: 'small' as const, icon: Grid3X3, title: 'Малі плитки' },
    { id: 'list' as const, icon: List, title: 'Список' },
  ];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const currentIndex = modes.findIndex(m => m.id === mode);

  const updateFromPosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = Math.max(0, Math.min(rect.width - 1, clientX - rect.left));
    const targetIdx = Math.min(modes.length - 1, Math.max(0, Math.floor((relX / rect.width) * modes.length)));
    if (targetIdx !== currentIndex) {
      onChange(modes[targetIdx].id);
      if (navigator.vibrate) {
        try { navigator.vibrate(10); } catch {}
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromPosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    updateFromPosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try { (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative flex items-center p-0.5 rounded-xl bg-zinc-800/80 dark:bg-zinc-900/90 select-none cursor-ew-resize touch-none shadow-2xs"
      title="Перетягуйте вліво або вправо для зміни вигляду"
    >
      {/* Sliding active indicator without borders */}
      <div
        className="absolute top-0.5 bottom-0.5 rounded-lg bg-zinc-700/90 dark:bg-zinc-700/80 transition-all duration-200 ease-out shadow-xs pointer-events-none"
        style={{
          width: `calc(100% / ${modes.length})`,
          left: `calc(${currentIndex} * (100% / ${modes.length}))`
        }}
      />

      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = m.id === mode;
        return (
          <button
            key={m.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(m.id);
            }}
            className={`relative z-10 px-2 py-1 flex items-center justify-center transition-colors duration-150 cursor-pointer border-none bg-transparent ${
              isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title={m.title}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        );
      })}
    </div>
  );
};

const CounterTabComponent: React.FC<CounterTabProps> = ({
  onOpenMeditation,
  isMeditationOpen = false,
  diffMs,
  startDate,
  money,
  totalSaved,
  cigsAvoided,
  treeState,
  orbitState,
  daysCount,
  reasons,
  streaks = [],
  longestStreakMs = 0,
  goals,
  activeGoalName,
  activeGoalPct,
  onOpenSos,
  onOpenSetup,
  onOpenRelapse,
  onUndoLastRelapse,
  onSwitchTab,
  onAddGoal,
  onCompleteGoal,
  onDeleteGoal,
  dayRatings,
  accent = 'indigo',
  appTheme = 'modern',
  onUpdateReasons,
  onUpdateMoney,
  onOpenOverlaySection,
  isZenMode: propIsZenMode,
  setIsZenMode: propSetIsZenMode,
  isTimerStarted: propIsTimerStarted,
  onOpenAnalyzerModal
}) => {
  const [currentReasonIdx, setCurrentReasonIdx] = React.useState(0);
  const [internalZenMode, setInternalZenMode] = React.useState(false);
  const isZenMode = propIsZenMode !== undefined ? propIsZenMode : internalZenMode;
  const setIsZenMode = propSetIsZenMode || setInternalZenMode;

  const [isTimerStarted, setIsTimerStarted] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (propIsTimerStarted !== undefined) {
      setIsTimerStarted(propIsTimerStarted);
    }
  }, [propIsTimerStarted]);

  const [isAutumnMode, setIsAutumnMode] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:autumn-timer') === 'true';
    } catch {
      return false;
    }
  });

  // First-run choreographed entrance animation from blur: Star -> YinYang -> Sections 1..5 -> BottomNav
  const isIntroAlreadyDone = React.useMemo(() => {
    try {
      return localStorage.getItem('quit-smoking:first-run-intro-animated') === 'true';
    } catch {
      return true;
    }
  }, []);

  const [showMiniResourceBar, setShowMiniResourceBar] = React.useState<boolean>(() => {
    try {
      const val = localStorage.getItem('quit-smoking:show-mini-resource-bar');
      return val === null ? true : val === 'true';
    } catch {
      return true;
    }
  });

  React.useEffect(() => {
    const handleMiniBarChange = () => {
      try {
        const val = localStorage.getItem('quit-smoking:show-mini-resource-bar');
        setShowMiniResourceBar(val === null ? true : val === 'true');
      } catch {}
    };
    window.addEventListener('mini-resource-bar-change', handleMiniBarChange);
    window.addEventListener('storage', handleMiniBarChange);
    return () => {
      window.removeEventListener('mini-resource-bar-change', handleMiniBarChange);
      window.removeEventListener('storage', handleMiniBarChange);
    };
  }, []);

  // Cosmic Ring Sleeve Stars Timer Dimmer / Vanishing Effect
  React.useEffect(() => {
    const handleCosmicStars = (e: Event) => {
      const customEvent = e as CustomEvent;
      const stars = customEvent.detail?.stars || [];
      const charElements = document.querySelectorAll('.cosmic-dim-char');
      if (charElements.length === 0) return;
      
      charElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elCx = rect.left + rect.width / 2;
        const elCy = rect.top + rect.height / 2;
        
        let minDistance = Infinity;
        for (let i = 0; i < stars.length; i++) {
          const star = stars[i];
          const dx = elCx - star.x;
          const dy = elCy - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDistance) {
            minDistance = dist;
          }
        }
        
        const vanishRadius = 25;
        const proximityRadius = 45;
        
        if (minDistance < vanishRadius) {
          (el as HTMLElement).style.opacity = '0';
          (el as HTMLElement).style.filter = 'blur(6px)';
          (el as HTMLElement).style.transform = 'scale(0.6)';
        } else if (minDistance < proximityRadius) {
          const ratio = (minDistance - vanishRadius) / (proximityRadius - vanishRadius);
          (el as HTMLElement).style.opacity = (ratio * 0.9).toFixed(2);
          (el as HTMLElement).style.filter = `blur(${(4 * (1 - ratio)).toFixed(1)}px)`;
          (el as HTMLElement).style.transform = `scale(${(0.7 + 0.3 * ratio).toFixed(2)})`;
        } else {
          (el as HTMLElement).style.opacity = '';
          (el as HTMLElement).style.filter = '';
          (el as HTMLElement).style.transform = '';
        }
      });
    };

    window.addEventListener('cosmic-sleeve-stars-tick', handleCosmicStars as EventListener);
    return () => {
      window.removeEventListener('cosmic-sleeve-stars-tick', handleCosmicStars as EventListener);
    };
  }, []);

  // Smooth initial ring reveal on app load
  const [isRingRevealed, setIsRingRevealed] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:first-run-intro-animated') === 'true';
    } catch {
      return true;
    }
  });

  React.useEffect(() => {
    // Smooth reveal of the ring
    const timer = setTimeout(() => {
      setIsRingRevealed(true);
      try {
        localStorage.setItem('quit-smoking:first-run-intro-animated', 'true');
      } catch {}
      window.dispatchEvent(new Event('intro-animation-completed'));
    }, 850);

    return () => clearTimeout(timer);
  }, []);

  const [introStarVisible] = React.useState<boolean>(true);
  const [introTimerVisible] = React.useState<boolean>(true);
  const [introAnalyzerVisible] = React.useState<boolean>(true);
  const [introYinYangVisible] = React.useState<boolean>(true);
  const [introSec1Visible] = React.useState<boolean>(true);
  const [introSec2Visible] = React.useState<boolean>(true);
  const [introSec3Visible] = React.useState<boolean>(true);
  const [introSec4Visible] = React.useState<boolean>(true);
  const [introSec5Visible] = React.useState<boolean>(true);

  const [isIntroDialogueActive, setIsIntroDialogueActive] = React.useState<boolean>(() => {
    try {
      return document.documentElement.getAttribute('data-intro-dialogue-active') === 'true';
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    const handleIntroVis = (e: any) => {
      const active = !!(e.detail && e.detail.active);
      setIsIntroDialogueActive(active);
    };
    window.addEventListener('intro-dialogue-visibility', handleIntroVis);
    return () => window.removeEventListener('intro-dialogue-visibility', handleIntroVis);
  }, []);

  const longPressTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = React.useRef<boolean>(false);

  const handleYinYangPressStart = () => {
    if (isEverythingHidden) return;
    isLongPressRef.current = false;
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      if (onOpenAnalyzerModal) {
        onOpenAnalyzerModal();
      } else if (typeof setIsAnalyzerModalOpen === 'function') {
        setIsAnalyzerModalOpen(true);
      }
    }, 480);
  };

  const handleYinYangPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleYinYangClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      return;
    }
    const nextVal = !isEverythingHidden;
    setIsEverythingHidden(nextVal);
    try {
      localStorage.setItem('quit-smoking:everything-hidden', String(nextVal));
      window.dispatchEvent(new CustomEvent('eden-harmony-mode-change', { detail: nextVal }));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const handleExitYinYang = React.useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsEverythingHidden(false);
    try {
      localStorage.setItem('quit-smoking:everything-hidden', 'false');
      window.dispatchEvent(new CustomEvent('eden-harmony-mode-change', { detail: false }));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, []);

  const zenStarButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const [isZenStarBright, setIsZenStarBright] = React.useState<boolean>(false);
  const [flyingStars, setFlyingStars] = React.useState<Array<{
    id: number;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    progress: number;
  }>>([]);

  React.useEffect(() => {
    const handleFlyStar = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || !zenStarButtonRef.current) return;
      const rect = zenStarButtonRef.current.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      const newStar = {
        id: Date.now() + Math.random(),
        startX: detail.startX,
        startY: detail.startY,
        targetX,
        targetY,
        progress: 0,
      };

      setFlyingStars(prev => [...prev, newStar]);

      const startTime = performance.now();
      const duration = 500;
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const p = Math.min(1.0, elapsed / duration);
        setFlyingStars(curr => curr.map(s => s.id === newStar.id ? { ...s, progress: p } : s));

        if (p < 1.0) {
          requestAnimationFrame(animate);
        } else {
          setFlyingStars(curr => curr.filter(s => s.id !== newStar.id));
          setIsZenStarBright(true);
          setTimeout(() => setIsZenStarBright(false), 450);
        }
      };
      requestAnimationFrame(animate);
    };

    window.addEventListener('cosmic-star-fly-to-zen-star', handleFlyStar as EventListener);
    return () => window.removeEventListener('cosmic-star-fly-to-zen-star', handleFlyStar as EventListener);
  }, []);

  const showAnalyzer = true;
  const showRows = true;
  const showStar = true;
  const showTimerDays = true;
  const showTimerHours = true;
  const showTimerMins = true;

  // Modals for Gratitude Journal & Daily Steps
  const [isGratitudeModalOpen, setIsGratitudeModalOpen] = React.useState(false);
  const [isDailyStepsModalOpen, setIsDailyStepsModalOpen] = React.useState(false);
  const [indicatorRefreshTrigger, setIndicatorRefreshTrigger] = React.useState(0);
  const [isAnalyzerNameVisible, setIsAnalyzerNameVisible] = React.useState(true);
  const [swipeStartX, setSwipeStartX] = React.useState<number | null>(null);
  const hasSwiped = React.useRef<boolean>(false);

  React.useEffect(() => {
    const handleNameVisibility = (e: any) => {
      if (typeof e.detail === 'boolean') {
        setIsAnalyzerNameVisible(e.detail);
      }
    };
    window.addEventListener('analyzer-name-visibility-changed', handleNameVisibility);
    return () => {
      window.removeEventListener('analyzer-name-visibility-changed', handleNameVisibility);
    };
  }, []);

  const refreshIndicators = React.useCallback(() => {
    setIndicatorRefreshTrigger((prev) => prev + 1);
  }, []);



  // Gratitude status indicator helper
  const isGratitudeDoneToday = React.useMemo(() => {
    try {
      const d = new Date();
      const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const saved = localStorage.getItem('quit-smoking:gratitude-journal-entries');
      if (saved) {
        const parsed: any[] = JSON.parse(saved);
        const entry = parsed.find((e) => e.date === todayStr);
        if (entry && (entry.g1?.trim() || entry.g2?.trim() || entry.g3?.trim())) {
          return true;
        }
      }
    } catch {}
    return false;
  }, [indicatorRefreshTrigger, isGratitudeModalOpen]);

  // Daily steps status indicator helper
  const dailyStepsCounts = React.useMemo(() => {
    try {
      const d = new Date();
      const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      let steps: any[] = [];

      const savedSteps = localStorage.getItem('quit-smoking:daily-micro-steps');
      if (savedSteps) {
        const parsed = JSON.parse(savedSteps);
        if (Array.isArray(parsed)) steps = parsed;
      }

      const savedHistory = localStorage.getItem('quit-smoking:daily-steps-history');
      let doneIds: string[] = [];
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        doneIds = parsed[todayStr] || [];
      }

      const total = steps.length;
      const done = steps.filter((s) => doneIds.includes(s.id)).length;
      return { done, total, isAllDone: total > 0 && done === total };
    } catch {
      return { done: 0, total: 0, isAllDone: false };
    }
  }, [indicatorRefreshTrigger, isDailyStepsModalOpen]);

  // Active cat sleep timer and critical needs check for game badge
  const [catSleepMinutes, setCatSleepMinutes] = React.useState<number>(0);
  const [catNeedsAttention, setCatNeedsAttention] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkCatState = () => {
      try {
        const su = localStorage.getItem('quit-smoking:cat-sleep-until');
        if (su) {
          const time = Number(su);
          setCatSleepMinutes(Math.max(0, Math.ceil((time - Date.now()) / 60000)));
        } else {
          setCatSleepMinutes(0);
        }

        // Check if any Tamagotchi need (Food, Water, Joy, Litter) is at or near 0
        const last = localStorage.getItem('quit-smoking:cat-last-time');
        const elapsedSec = last ? (Date.now() - Number(last)) / 1000 : 0;

        const food = Number(localStorage.getItem('quit-smoking:cat-food') ?? 85) - elapsedSec * 0.0025;
        const water = Number(localStorage.getItem('quit-smoking:cat-water') ?? 90) - elapsedSec * 0.0035;
        const joy = Number(localStorage.getItem('quit-smoking:cat-joy') ?? 80) - elapsedSec * 0.0028;
        const litter = Number(localStorage.getItem('quit-smoking:cat-litter') ?? 95) - elapsedSec * 0.002;

        const isCritical = food <= 5 || water <= 5 || joy <= 5 || litter <= 5;
        setCatNeedsAttention(isCritical);
      } catch {
        setCatSleepMinutes(0);
        setCatNeedsAttention(false);
      }
    };

    checkCatState();
    const interval = setInterval(checkCatState, 3000);
    window.addEventListener('storage', checkCatState);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkCatState);
    };
  }, []);

  // USER NOTES SYSTEM
  const [notes, setNotes] = React.useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:user-notes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newNoteText, setNewNoteText] = React.useState('');
  const [newNoteTag, setNewNoteTag] = React.useState('📝 Нотатка');
  const [editingNoteId, setEditingNoteId] = React.useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilterTag, setSelectedFilterTag] = React.useState('Всі');

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const now = new Date();
    const formattedDate = `${now.getDate()} ${['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'][now.getMonth()]} ${now.getFullYear()} o ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newNote = {
      id: `note-${Date.now()}`,
      text: newNoteText.trim(),
      tag: newNoteTag,
      createdAt: formattedDate,
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    try {
      localStorage.setItem('quit-smoking:user-notes', JSON.stringify(updated));
    } catch {}
    setNewNoteText('');
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    try {
      localStorage.setItem('quit-smoking:user-notes', JSON.stringify(updated));
    } catch {}
  };

  const handleStartEditNote = (note: any) => {
    setEditingNoteId(note.id);
    setEditingNoteText(note.text);
  };

  const handleSaveEditNote = (id: string) => {
    if (!editingNoteText.trim()) return;
    const updated = notes.map((n) => n.id === id ? { ...n, text: editingNoteText.trim() } : n);
    setNotes(updated);
    try {
      localStorage.setItem('quit-smoking:user-notes', JSON.stringify(updated));
    } catch {}
    setEditingNoteId(null);
    setEditingNoteText('');
  };

  const filteredNotes = React.useMemo(() => {
    return notes.filter((n) => {
      const textMatch = (n.text || '').toLowerCase().includes(searchQuery.toLowerCase());
      const tagMatch = (n.tag || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = textMatch || tagMatch;
      const matchesTag = selectedFilterTag === 'Всі' || n.tag === selectedFilterTag;
      return matchesSearch && matchesTag;
    });
  }, [notes, searchQuery, selectedFilterTag]);

  const [hideStars, setHideStars] = React.useState<boolean>(() => sessionStorage.getItem('hide_star_achievements') === 'true');
  const [flickerActive, setFlickerActive] = React.useState(false);
  const [flickeringIndices, setFlickeringIndices] = React.useState<number[]>([]);
  const [extinguishedIndices, setExtinguishedIndices] = React.useState<number[]>([]);
  const [globalBlackout, setGlobalBlackout] = React.useState(false);

  const [isStepsOpen, setIsStepsOpen] = React.useState(false);
  const [isStepsPromptOpen, setIsStepsPromptOpen] = React.useState(false);
  const { modals, toggleModal } = useModalManager();
  const { 
    isMentalHealthOpen, 
    isGratitudeOpen, 
    isCoffeeBreakfastModalOpen, 
    isGoalModalOpen, 
    isMotivationsModalOpen, 
    isAnalyzerModalOpen, 
    isTriggerDetectorOpen, 
    isStateChartModalOpen 
  } = modals;

  const setIsMentalHealthOpen = (v: boolean) => toggleModal('isMentalHealthOpen', v);
  const setIsGratitudeOpen = (v: boolean) => toggleModal('isGratitudeOpen', v);
  const setIsCoffeeBreakfastModalOpen = (v: boolean) => toggleModal('isCoffeeBreakfastModalOpen', v);
  const setIsGoalModalOpen = (v: boolean) => toggleModal('isGoalModalOpen', v);
  const setIsMotivationsModalOpen = (v: boolean) => toggleModal('isMotivationsModalOpen', v);
  const setIsAnalyzerModalOpen = (v: boolean) => toggleModal('isAnalyzerModalOpen', v);
  const setIsTriggerDetectorOpen = (v: boolean) => toggleModal('isTriggerDetectorOpen', v);
  const setIsStateChartModalOpen = (v: boolean) => toggleModal('isStateChartModalOpen', v);

  const [isPromptDocked, setIsPromptDocked] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:prompt-docked') === 'true';
    } catch { return false; }
  });

  const [isPromptCompact, setIsPromptCompact] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:prompt-compact') === 'true';
    } catch { return false; }
  });

  const [analyzerHighlight, setAnalyzerHighlight] = React.useState<'water' | 'sleep' | 'caffeine' | 'craving' | undefined>(undefined);

  React.useEffect(() => {
    const handlePromptStateChange = () => {
      try {
        setIsPromptDocked(localStorage.getItem('quit-smoking:prompt-docked') === 'true');
        setIsPromptCompact(localStorage.getItem('quit-smoking:prompt-compact') === 'true');
      } catch {}
    };

    window.addEventListener('prompt-docked-change', handlePromptStateChange);
    window.addEventListener('prompt-compact-change', handlePromptStateChange);
    window.addEventListener('storage', handlePromptStateChange);

    return () => {
      window.removeEventListener('prompt-docked-change', handlePromptStateChange);
      window.removeEventListener('prompt-compact-change', handlePromptStateChange);
      window.removeEventListener('storage', handlePromptStateChange);
    };
  }, []);

  const [goalToast, setGoalToast] = React.useState<{ goalName: string; amount: number; goalId: string } | null>(null);

  // Check if active goal target reached and trigger festive celebration toast
  React.useEffect(() => {
    const activeGoal = goals?.queue && goals.queue.length > 0 ? goals.queue[0] : null;
    if (!activeGoal) return;

    const amount = activeGoal.amount || 0;
    if (amount <= 0) return;

    const spentMoney = (goals?.base || 0) + (goals?.done?.reduce((acc, g) => acc + (g.amount || g.total || 0), 0) || 0);
    const availableMoney = Math.max(0, totalSaved - spentMoney);

    if (availableMoney >= amount) {
      const notifiedKey = `quit-smoking:goal-celebrated-${activeGoal.id}`;
      try {
        if (localStorage.getItem(notifiedKey) !== 'true') {
          localStorage.setItem(notifiedKey, 'true');
          setGoalToast({
            goalName: activeGoal.name,
            amount: amount,
            goalId: activeGoal.id
          });
        }
      } catch {}
    }
  }, [goals, totalSaved]);

  const sessionStartRef = React.useRef<number>(Date.now());

  // 5-minute activity check: prompt to fill daily steps if empty
  React.useEffect(() => {
    const checkFiveMinActivity = () => {
      const elapsedMs = Date.now() - sessionStartRef.current;
      if (elapsedMs >= 5 * 60 * 1000) { // 5 minutes (300,000 ms)
        const d = new Date();
        const todayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const promptShownKey = `quit-smoking:daily-steps-prompt-date-${todayKey}`;

        try {
          const savedSteps = localStorage.getItem('quit-smoking:daily-micro-steps');
          const steps = savedSteps ? JSON.parse(savedSteps) : [];
          const promptAlreadyShown = localStorage.getItem(promptShownKey) === 'true';

          if ((!Array.isArray(steps) || steps.length === 0) && !promptAlreadyShown) {
            localStorage.setItem(promptShownKey, 'true');
            setIsStepsPromptOpen(true);
          }
        } catch {}
      }
    };

    const interval = setInterval(checkFiveMinActivity, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const [motivationStyle, setMotivationStyle] = React.useState<MotivationStyle>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:motivational-style');
      if (saved === 'quote' || saved === 'card' || saved === 'neon' || saved === 'kraft' || saved === 'ticker') {
        return saved;
      }
    } catch {}
    return 'quote';
  });

  const [autoRotateMotivations, setAutoRotateMotivations] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:motivational-autorotate') === 'true';
    } catch {
      return false;
    }
  });

  const handleStyleChange = (style: MotivationStyle) => {
    setMotivationStyle(style);
    try {
      localStorage.setItem('quit-smoking:motivational-style', style);
    } catch {}
  };

  const handleAutoRotateChange = (val: boolean) => {
    setAutoRotateMotivations(val);
    try {
      localStorage.setItem('quit-smoking:motivational-autorotate', String(val));
    } catch {}
  };

  // Auto-rotate effect
  React.useEffect(() => {
    if (!autoRotateMotivations || reasons.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentReasonIdx((prev) => (prev + 1) % (reasons.length || 1));
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRotateMotivations, reasons.length]);

  const [isCompactGoals, setIsCompactGoals] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:use-compact-goals') === 'true';
    } catch {
      return false;
    }
  });

  // One-time check to make sure cards (Gratitude, Steps, Mental Health) are visible in feed
  React.useEffect(() => {
    try {
      const restored = localStorage.getItem('quit-smoking:cards-restored-v3');
      if (!restored) {
        localStorage.setItem('quit-smoking:steps-docked', 'false');
        localStorage.setItem('quit-smoking:mental-health-docked', 'false');
        localStorage.setItem('quit-smoking:gratitude-docked', 'false');
        localStorage.setItem('quit-smoking:cards-restored-v3', 'true');
        setIsStepsDocked(false);
        setIsMentalHealthDocked(false);
        setIsGratitudeDocked(false);
      }
    } catch {}
  }, []);

  const [isGoalsDocked, setIsGoalsDocked] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:goals-docked') === 'true';
    } catch {
      return false;
    }
  });

  const [isStepsDocked, setIsStepsDocked] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:steps-docked') === 'true';
    } catch {
      return false;
    }
  });

  const [isMentalHealthDocked, setIsMentalHealthDocked] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:mental-health-docked') === 'true';
    } catch {
      return false;
    }
  });

  const [isGratitudeDocked, setIsGratitudeDocked] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:gratitude-docked') === 'true';
    } catch {
      return false;
    }
  });

  const [isStepsMinimized, setIsStepsMinimized] = React.useState<boolean>(() => {
    try {
      const val = localStorage.getItem('quit-smoking:steps-minimized');
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  });

  const [isMentalHealthMinimized, setIsMentalHealthMinimized] = React.useState<boolean>(() => {
    try {
      const val = localStorage.getItem('quit-smoking:mental-health-minimized');
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  });

  const [isGratitudeMinimized, setIsGratitudeMinimized] = React.useState<boolean>(() => {
    try {
      const val = localStorage.getItem('quit-smoking:gratitude-minimized');
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  });

  const [isIndicatorSettingsOpen, setIsIndicatorSettingsOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState<string>(() => {
    return localStorage.getItem('quit-smoking:indicator-style') || 'indicators';
  });
  const [diskAngle, setDiskAngle] = useState(0);
  const [sequentialIndex, setSequentialIndex] = useState(0);

  const saveIndicatorStyle = (style: string) => {
    setIndicatorStyle(style);
    localStorage.setItem('quit-smoking:indicator-style', style);
    setIsIndicatorSettingsOpen(false);
  };

  useEffect(() => {
    const handleIndicatorChange = () => {
      try {
        const saved = localStorage.getItem('quit-smoking:indicator-style');
        if (saved) setIndicatorStyle(saved);
      } catch {}
    };
    window.addEventListener('indicator-style-change', handleIndicatorChange);
    window.addEventListener('storage', handleIndicatorChange);
    return () => {
      window.removeEventListener('indicator-style-change', handleIndicatorChange);
      window.removeEventListener('storage', handleIndicatorChange);
    };
  }, []);

  const [economyMode, setEconomyMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:economy-mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-economy', String(economyMode));
  }, [economyMode]);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        setEconomyMode(localStorage.getItem('quit-smoking:economy-mode') === 'true');
      } catch {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [isQuickGoalDocked, setIsQuickGoalDocked] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:quick-goal-docked') === 'true';
    } catch {
      return false;
    }
  });

  const [isHealthDocked, setIsHealthDocked] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:health-docked') === 'true';
    } catch {
      return false;
    }
  });

  const [isAnalyzerDocked, setIsAnalyzerDocked] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:analyzer-docked') === 'true';
    } catch {
      return false;
    }
  });

  const [isSavedResourcesDocked, setIsSavedResourcesDocked] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:saved-resources-docked') === 'true';
    } catch {
      return false;
    }
  });

  const [isSavedResourcesMinimized, setIsSavedResourcesMinimized] = React.useState<boolean>(() => {
    try {
      const val = localStorage.getItem('quit-smoking:saved-resources-minimized');
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  });

  const toggleSavedResourcesMinimized = () => {
    setIsSavedResourcesMinimized((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('quit-smoking:saved-resources-minimized', String(next));
      } catch {}
      return next;
    });
  };

  const [isSavedStatsExpanded, setIsSavedStatsExpanded] = React.useState<boolean>(false);

  // Clear any legacy stale expanded state on mount so it never automatically pops open
  React.useEffect(() => {
    try {
      localStorage.removeItem('quit-smoking:saved-stats-expanded');
    } catch {}
  }, []);

  const [isStatsMinimized, setIsStatsMinimized] = React.useState<boolean>(() => {
    try {
      const val = localStorage.getItem('quit-smoking:saved-stats-minimized');
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  });

  // Whenever stats panel is minimized into a triangle, ensure expanded details are closed
  React.useEffect(() => {
    if (isStatsMinimized && isSavedStatsExpanded) {
      setIsSavedStatsExpanded(false);
    }
  }, [isStatsMinimized, isSavedStatsExpanded]);

  // When switching tabs via event or when unmounting, always ensure expanded stats is closed
  React.useEffect(() => {
    const handleCloseExpanded = () => {
      setIsSavedStatsExpanded(false);
    };
    window.addEventListener('change-tab', handleCloseExpanded);
    return () => window.removeEventListener('change-tab', handleCloseExpanded);
  }, []);

  const [isMeditativeSpacesMinimized, setIsMeditativeSpacesMinimized] = React.useState<boolean>(() => {
    try {
      const val = localStorage.getItem('quit-smoking:meditative-spaces-minimized');
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  });

  const [isPinnedSectionsMinimized, setIsPinnedSectionsMinimized] = React.useState<boolean>(() => {
    try {
      const val = localStorage.getItem('quit-smoking:pinned-sections-minimized');
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  });

  const [isGoalsSectionCollapsed, setIsGoalsSectionCollapsed] = React.useState<boolean>(() => {
    try {
      const val = localStorage.getItem('quit-smoking:goals-section-collapsed');
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  });

  const [isRecoveryCollapsed, setIsRecoveryCollapsed] = React.useState<boolean>(() => {
    try {
      const val = localStorage.getItem('quit-smoking:recovery-block-minimized');
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  });

  const [isEverythingHidden, setIsEverythingHidden] = React.useState<boolean>(false);

  const [isBioPinned, setIsBioPinned] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:bio-regeneration-pinned') === 'true';
    } catch {
      return false;
    }
  });

  const [isWhoPinned, setIsWhoPinned] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:who-milestones-pinned') === 'true';
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    const handleEvents = () => {
      try {
        const recVal = localStorage.getItem('quit-smoking:recovery-block-minimized');
        setIsRecoveryCollapsed(recVal !== null ? recVal === 'true' : true);
        const goalsVal = localStorage.getItem('quit-smoking:goals-section-collapsed');
        setIsGoalsSectionCollapsed(goalsVal !== null ? goalsVal === 'true' : true);
        setIsEverythingHidden(localStorage.getItem('quit-smoking:everything-hidden') === 'true');
        setIsBioPinned(localStorage.getItem('quit-smoking:bio-regeneration-pinned') === 'true');
        setIsWhoPinned(localStorage.getItem('quit-smoking:who-milestones-pinned') === 'true');
        setIsGoalsDocked(localStorage.getItem('quit-smoking:goals-docked') === 'true');
        setIsQuickGoalDocked(localStorage.getItem('quit-smoking:quick-goal-docked') === 'true');
        setIsHealthDocked(localStorage.getItem('quit-smoking:health-docked') === 'true');
        setIsStepsDocked(localStorage.getItem('quit-smoking:steps-docked') === 'true');
        setIsMentalHealthDocked(localStorage.getItem('quit-smoking:mental-health-docked') === 'true');
        setIsGratitudeDocked(localStorage.getItem('quit-smoking:gratitude-docked') === 'true');
        const pinVal = localStorage.getItem('quit-smoking:pinned-sections-minimized');
        setIsPinnedSectionsMinimized(pinVal !== null ? pinVal === 'true' : true);
      } catch {}
    };
    window.addEventListener('storage', handleEvents);
    window.addEventListener('recovery-block-minimized-change', handleEvents);
    window.addEventListener('recovery-pictograms-pinned-change', handleEvents);
    window.addEventListener('goals-docked-change', handleEvents);
    window.addEventListener('quick-goal-docked-change', handleEvents);
    window.addEventListener('health-docked-change', handleEvents);
    window.addEventListener('steps-docked-change', handleEvents);
    window.addEventListener('mental-health-docked-change', handleEvents);
    window.addEventListener('gratitude-docked-change', handleEvents);
    window.addEventListener('goals-section-collapsed-change', handleEvents);
    window.addEventListener('pinned-sections-minimized-change', handleEvents);
    return () => {
      window.removeEventListener('storage', handleEvents);
      window.removeEventListener('recovery-block-minimized-change', handleEvents);
      window.removeEventListener('recovery-pictograms-pinned-change', handleEvents);
      window.removeEventListener('goals-docked-change', handleEvents);
      window.removeEventListener('quick-goal-docked-change', handleEvents);
      window.removeEventListener('health-docked-change', handleEvents);
      window.removeEventListener('steps-docked-change', handleEvents);
      window.removeEventListener('mental-health-docked-change', handleEvents);
      window.removeEventListener('gratitude-docked-change', handleEvents);
      window.removeEventListener('goals-section-collapsed-change', handleEvents);
      window.removeEventListener('pinned-sections-minimized-change', handleEvents);
    };
  }, []);

  const toggleMeditativeSpacesMinimized = () => {
    setIsMeditativeSpacesMinimized((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('quit-smoking:meditative-spaces-minimized', String(next));
      } catch {}
      return next;
    });
  };

  const savedStatsContainerRef = React.useRef<HTMLDivElement | null>(null);

  const toggleSavedStatsExpanded = () => {
    if (isStatsMinimized) return;
    setIsSavedStatsExpanded((prev) => !prev);
  };

  React.useEffect(() => {
    if (!isSavedStatsExpanded) return;

    const handleGlobalClick = (e: MouseEvent) => {
      if (savedStatsContainerRef.current && savedStatsContainerRef.current.contains(e.target as Node)) {
        return;
      }
      setIsSavedStatsExpanded(false);
    };

    const timer = setTimeout(() => {
      document.addEventListener('click', handleGlobalClick);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [isSavedStatsExpanded]);

  const [quickGoalData, setQuickGoalData] = React.useState<any | null>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:quick-goal');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [quickGoalNow, setQuickGoalNow] = React.useState<number>(Date.now());

  React.useEffect(() => {
    if (!isQuickGoalDocked || !quickGoalData) return;
    const interval = setInterval(() => {
      setQuickGoalNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [isQuickGoalDocked, quickGoalData]);

  const [gamePlaytimes, setGamePlaytimes] = React.useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:game-playtimes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { tree: 144, bowls: 48, orbit: 12, sand: 8 };
  });

  const handlePlayGame = (gameId: string) => {
    setGamePlaytimes((prev) => {
      const current = prev[gameId] || 0;
      const updated = { ...prev, [gameId]: current + 5 };
      try {
        localStorage.setItem('quit-smoking:game-playtimes', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    onSwitchTab(gameId);
  };

  React.useEffect(() => {
    const handleDockChange = () => {
      try {
        setIsGoalsDocked(localStorage.getItem('quit-smoking:goals-docked') === 'true');
        setIsQuickGoalDocked(localStorage.getItem('quit-smoking:quick-goal-docked') === 'true');
        setIsHealthDocked(localStorage.getItem('quit-smoking:health-docked') === 'true');
        setIsAnalyzerDocked(localStorage.getItem('quit-smoking:analyzer-docked') === 'true');
        setIsSavedResourcesDocked(localStorage.getItem('quit-smoking:saved-resources-docked') === 'true');
        setIsStepsDocked(localStorage.getItem('quit-smoking:steps-docked') === 'true');
        setIsMentalHealthDocked(localStorage.getItem('quit-smoking:mental-health-docked') === 'true');
        setIsGratitudeDocked(localStorage.getItem('quit-smoking:gratitude-docked') === 'true');
        
        const saved = localStorage.getItem('quit-smoking:quick-goal');
        setQuickGoalData(saved ? JSON.parse(saved) : null);
        setRefreshTick((t) => t + 1);
      } catch {}
    };

    const handleQuickGoalCustomEvent = () => {
      try {
        const saved = localStorage.getItem('quit-smoking:quick-goal');
        setQuickGoalData(saved ? JSON.parse(saved) : null);
        setRefreshTick((t) => t + 1);
      } catch {}
    };

    const handleRefresh = () => setRefreshTick((t) => t + 1);

    const handleOpenDailySteps = () => setIsStepsOpen(true);
    const handleOpenGratitude = () => setIsGratitudeOpen(true);
    const handleOpenMentalHealth = () => setIsMentalHealthOpen(true);
    const handleOpenCoffee = () => setIsCoffeeBreakfastModalOpen(true);

    window.addEventListener('storage', handleDockChange);
    window.addEventListener('quick-goal-docked-change', handleDockChange);
    window.addEventListener('goals-docked-change', handleDockChange);
    window.addEventListener('health-docked-change', handleDockChange);
    window.addEventListener('analyzer-docked-change', handleDockChange);
    window.addEventListener('saved-resources-docked-change', handleDockChange);
    window.addEventListener('steps-docked-change', handleDockChange);
    window.addEventListener('mental-health-docked-change', handleDockChange);
    window.addEventListener('gratitude-docked-change', handleDockChange);
    window.addEventListener('steps-updated', handleRefresh);
    window.addEventListener('gratitude-updated', handleRefresh);
    window.addEventListener('mental-health-updated', handleRefresh);
    window.addEventListener('quick-goal-change', handleQuickGoalCustomEvent);
    window.addEventListener('open-daily-steps-modal', handleOpenDailySteps);
    window.addEventListener('open-gratitude-modal', handleOpenGratitude);
    window.addEventListener('open-mental-health-modal', handleOpenMentalHealth);
    window.addEventListener('open-coffee-modal', handleOpenCoffee);

    return () => {
      window.removeEventListener('storage', handleDockChange);
      window.removeEventListener('quick-goal-docked-change', handleDockChange);
      window.removeEventListener('goals-docked-change', handleDockChange);
      window.removeEventListener('health-docked-change', handleDockChange);
      window.removeEventListener('analyzer-docked-change', handleDockChange);
      window.removeEventListener('saved-resources-docked-change', handleDockChange);
      window.removeEventListener('steps-docked-change', handleDockChange);
      window.removeEventListener('mental-health-docked-change', handleDockChange);
      window.removeEventListener('gratitude-docked-change', handleDockChange);
      window.removeEventListener('steps-updated', handleRefresh);
      window.removeEventListener('gratitude-updated', handleRefresh);
      window.removeEventListener('mental-health-updated', handleRefresh);
      window.removeEventListener('quick-goal-change', handleQuickGoalCustomEvent);
      window.removeEventListener('open-daily-steps-modal', handleOpenDailySteps);
      window.removeEventListener('open-gratitude-modal', handleOpenGratitude);
      window.removeEventListener('open-mental-health-modal', handleOpenMentalHealth);
      window.removeEventListener('open-coffee-modal', handleOpenCoffee);
    };
  }, []);

  const toggleCompactGoals = () => {
    const nextVal = !isCompactGoals;
    setIsCompactGoals(nextVal);
    try {
      localStorage.setItem('quit-smoking:use-compact-goals', String(nextVal));
      window.dispatchEvent(new Event('compact-goals-change'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  React.useEffect(() => {
    const handleCompactChange = () => {
      try {
        setIsCompactGoals(localStorage.getItem('quit-smoking:use-compact-goals') === 'true');
      } catch {}
    };
    window.addEventListener('storage', handleCompactChange);
    window.addEventListener('compact-goals-change', handleCompactChange);
    return () => {
      window.removeEventListener('storage', handleCompactChange);
      window.removeEventListener('compact-goals-change', handleCompactChange);
    };
  }, []);
  const [refreshTick, setRefreshTick] = React.useState(0);
  const handleUpdate = React.useCallback(() => {
    setRefreshTick((prev) => prev + 1);
  }, []);

  const accentThemeInfo = React.useMemo(() => {
    switch (accent) {
      case 'charcoal':
        return {
          glowColor: '#71717a', // zinc-500
          offColor: '#18181b',  // zinc-900
          shadowColor: '#3f3f46',
          gradientClass: 'bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-400 dark:to-zinc-200 bg-clip-text text-transparent'
        };
      case 'sage':
        return {
          glowColor: '#8a9a92',
          offColor: '#1c2420',
          shadowColor: '#4f5c56',
          gradientClass: 'bg-gradient-to-r from-[#21352c] to-[#3f5349] dark:from-[#8fa097] dark:to-[#c3d1cb] bg-clip-text text-transparent'
        };
      case 'taupe':
        return {
          glowColor: '#a89c93',
          offColor: '#2b2420',
          shadowColor: '#63574f',
          gradientClass: 'bg-gradient-to-r from-[#3e322b] to-[#5a483e] dark:from-[#a39488] dark:to-[#d6cac0] bg-clip-text text-transparent'
        };
      case 'slate-blue':
        return {
          glowColor: '#7d8da4',
          offColor: '#171f2b',
          shadowColor: '#475569',
          gradientClass: 'bg-gradient-to-r from-[#0f172a] to-[#334155] dark:from-[#8899b3] dark:to-[#c5d2e3] bg-clip-text text-transparent'
        };
      case 'ash-olive':
        return {
          glowColor: '#7c8874',
          offColor: '#1a1f17',
          shadowColor: '#4d5746',
          gradientClass: 'bg-gradient-to-r from-[#242c20] to-[#3f4a38] dark:from-[#8a9683] dark:to-[#c4cec0] bg-clip-text text-transparent'
        };
      case 'gray':
      default:
        return {
          glowColor: '#94a3b8', // slate-400
          offColor: '#1e293b',   // slate-800
          shadowColor: '#475569', // slate-600
          gradientClass: 'bg-gradient-to-r from-slate-950 to-slate-750 dark:from-slate-400 dark:to-slate-200 bg-clip-text text-transparent'
        };
    }
  }, [accent]);

  const getAccentBorderClass = (id: string) => {
    switch (id) {
      case 'charcoal': return 'border-zinc-500/30 dark:border-zinc-400/30';
      case 'sage': return 'border-stone-500/30 dark:border-stone-400/30';
      case 'taupe': return 'border-[#786b62]/30 dark:border-[#a39488]/30';
      case 'slate-blue': return 'border-[#5b6a82]/30 dark:border-[#8899b3]/30';
      case 'ash-olive': return 'border-[#5f6959]/30 dark:border-[#8a9683]/30';
      case 'gray':
      default: return 'border-slate-400/30 dark:border-slate-500/30';
    }
  };

  const getAccentBgClass = (id: string) => {
    switch (id) {
      case 'charcoal': return 'bg-zinc-500/10 dark:bg-zinc-400/15';
      case 'sage': return 'bg-stone-500/10 dark:bg-stone-400/15';
      case 'taupe': return 'bg-[#786b62]/10 dark:bg-[#786b62]/20';
      case 'slate-blue': return 'bg-[#5b6a82]/10 dark:bg-[#5b6a82]/20';
      case 'ash-olive': return 'bg-[#5f6959]/10 dark:bg-[#5f6959]/20';
      case 'gray':
      default: return 'bg-slate-500/10 dark:bg-slate-400/15';
    }
  };

  const getAccentTextClass = (id: string) => {
    switch (id) {
      case 'charcoal': return 'text-zinc-900 dark:text-zinc-300';
      case 'sage': return 'text-emerald-950 dark:text-stone-300';
      case 'taupe': return 'text-[#3e322b] dark:text-[#c4b5a8]';
      case 'slate-blue': return 'text-slate-950 dark:text-[#9bb0cc]';
      case 'ash-olive': return 'text-[#242c20] dark:text-[#aab3a4]';
      case 'gray':
      default: return 'text-slate-900 dark:text-slate-200';
    }
  };

  const triggerTimerFlicker = () => {
    if (flickerActive) return;
    
    const textLen = humanQuitTimeText.length;
    if (textLen === 0) return;
    
    setFlickerActive(true);
    
    // Choose if this click triggered a long/severe malfunction combination (45% chance)
    const isLongMalfunction = Math.random() < 0.45;

    if (isLongMalfunction) {
      // --- LONG SEVERE MALFUNCTION SEQUENCE (~3.1 seconds of agonizing struggle) ---
      
      // Stage L1: Immediate global blackout
      setGlobalBlackout(true);
      if (navigator.vibrate) {
        try {
          navigator.vibrate([100, 60, 100]);
        } catch (e) {}
      }

      // Stage L2: Power returns weakly. Most chars are extinguished (completely out) and a few flicker
      setTimeout(() => {
        setGlobalBlackout(false);
        // Almost all chars extinguished
        const extIdxs = Array.from({ length: textLen }, (_, i) => i)
          .filter(() => Math.random() < 0.7); // 70% of chars go dead
        setExtinguishedIndices(extIdxs);

        const flickIdxs = Array.from({ length: textLen }, (_, i) => i)
          .filter(i => !extIdxs.includes(i) && Math.random() < 0.5);
        setFlickeringIndices(flickIdxs);
        
        if (navigator.vibrate) {
          try {
            navigator.vibrate([40, 40, 40]);
          } catch (e) {}
        }
      }, 250);

      // Stage L3: Power drops again (second blackout)
      setTimeout(() => {
        setGlobalBlackout(true);
      }, 950);

      // Stage L4: Rapid chaotic flickering on all segments (neon buzzes furiously)
      setTimeout(() => {
        setGlobalBlackout(false);
        setExtinguishedIndices([]);
        // All characters flicker rapidly like a dying lamp
        const allIdxs = Array.from({ length: textLen }, (_, i) => i);
        setFlickeringIndices(allIdxs);
        if (navigator.vibrate) {
          try {
            navigator.vibrate([30, 20, 30, 20, 30, 20]);
          } catch (e) {}
        }
      }, 1150);

      // Stage L5: Third quick drop to darkness
      setTimeout(() => {
        setGlobalBlackout(true);
        setFlickeringIndices([]);
      }, 1800);

      // Stage L6: Partial return. Only a few letters spark.
      setTimeout(() => {
        setGlobalBlackout(false);
        const extIdxs = Array.from({ length: textLen }, (_, i) => i)
          .filter(() => Math.random() < 0.4); // 40% dead
        setExtinguishedIndices(extIdxs);
        
        const flickCount = Math.floor(Math.random() * 3) + 1;
        const flickIdxs: number[] = [];
        while (flickIdxs.length < flickCount) {
          const randIdx = Math.floor(Math.random() * textLen);
          if (!flickIdxs.includes(randIdx) && !extIdxs.includes(randIdx)) {
            flickIdxs.push(randIdx);
          }
        }
        setFlickeringIndices(flickIdxs);
      }, 2050);

      // Stage L7: Stabilization and full bright return!
      setTimeout(() => {
        setFlickerActive(false);
        setFlickeringIndices([]);
        setExtinguishedIndices([]);
        setGlobalBlackout(false);
        if (navigator.vibrate) {
          try {
            navigator.vibrate([40, 200]);
          } catch (e) {}
        }
      }, 3100);

    } else {
      // --- STANDARD QUICK FLICKER SEQUENCE (~1.6 seconds) ---
      
      // Stage S1: Immediate total blackout of the entire neon board!
      setGlobalBlackout(true);
      if (navigator.vibrate) {
        try {
          navigator.vibrate([80, 50, 40]);
        } catch (e) {}
      }

      // Stage S2: Turn back on, but with some characters flickering and some completely extinguished
      setTimeout(() => {
        setGlobalBlackout(false);
        
        const flickCount = Math.floor(Math.random() * 3) + 2;
        const flickIdxs: number[] = [];
        while (flickIdxs.length < flickCount) {
          const randIdx = Math.floor(Math.random() * textLen);
          if (!flickIdxs.includes(randIdx)) flickIdxs.push(randIdx);
        }
        setFlickeringIndices(flickIdxs);

        const extCount = Math.floor(Math.random() * 2) + 1;
        const extIdxs: number[] = [];
        while (extIdxs.length < extCount) {
          const randIdx = Math.floor(Math.random() * textLen);
          if (!extIdxs.includes(randIdx)) extIdxs.push(randIdx);
        }
        setExtinguishedIndices(extIdxs);

        if (navigator.vibrate) {
          try {
            navigator.vibrate([30, 100, 30]);
          } catch (e) {}
        }
      }, 180);

      // Stage S3: A momentary second full blackout (power drop) after 700ms
      setTimeout(() => {
        setGlobalBlackout(true);
      }, 700);

      // Stage S4: Restore with different flickering indices, and some extinguished
      setTimeout(() => {
        setGlobalBlackout(false);
        
        const extCount = Math.floor(Math.random() * 2) + 1;
        const extIdxs: number[] = [];
        while (extIdxs.length < extCount) {
          const randIdx = Math.floor(Math.random() * textLen);
          if (!extIdxs.includes(randIdx)) extIdxs.push(randIdx);
        }
        setExtinguishedIndices(extIdxs);
        
        const flickCount = Math.floor(Math.random() * 2) + 1;
        const flickIdxs: number[] = [];
        while (flickIdxs.length < flickCount) {
          const randIdx = Math.floor(Math.random() * textLen);
          if (!flickIdxs.includes(randIdx) && !extIdxs.includes(randIdx)) flickIdxs.push(randIdx);
        }
        setFlickeringIndices(flickIdxs);
      }, 850);

      // Stage S5: Final neon stabilization and fully restore
      setTimeout(() => {
        setFlickerActive(false);
        setFlickeringIndices([]);
        setExtinguishedIndices([]);
        setGlobalBlackout(false);
        if (navigator.vibrate) {
          try {
            navigator.vibrate([20]);
          } catch (e) {}
        }
      }, 1600);
    }
  };

  // Motivational quote visibility and switching
  const [isQuoteVisible] = React.useState<boolean>(true);
  const [isQuoteSwitching, setIsQuoteSwitching] = React.useState<boolean>(false);

  const handleNextReason = React.useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsQuoteSwitching(true);
    setTimeout(() => {
      setCurrentReasonIdx((prev) => prev + 1);
      setIsQuoteSwitching(false);
    }, 160);
  }, []);

  // Thought Anticipation Icon State (speaking, disappearing, calm, gathering, imminent)
  const [thoughtRemainingSec, setThoughtRemainingSec] = React.useState<number | null>(null);
  const [thoughtStage, setThoughtStage] = React.useState<'speaking' | 'disappearing' | 'calm' | 'gathering' | 'imminent'>('speaking');
  const [isAboutToBurst, setIsAboutToBurst] = React.useState<boolean>(false);

  React.useEffect(() => {
    let targetTime = 0;
    let totalDelay = 30000;
    let currentPhase: 'speaking' | 'disappearing' | 'scheduled' = 'speaking';

    const handleScheduled = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.targetTime) {
        targetTime = detail.targetTime;
        totalDelay = detail.totalDelay || 30000;
        currentPhase = 'scheduled';
      }
    };

    const handleStarted = () => {
      currentPhase = 'speaking';
      setThoughtStage('speaking');
      setIsAboutToBurst(false);
    };

    const handleDisappearing = () => {
      currentPhase = 'disappearing';
      setThoughtStage('disappearing');
      setIsAboutToBurst(false);
    };

    window.addEventListener('analyzer-thought-scheduled', handleScheduled as EventListener);
    window.addEventListener('analyzer-thought-started', handleStarted);
    window.addEventListener('analyzer-thought-disappearing', handleDisappearing);

    // Update intuition stage smoothly every 200ms
    const interval = setInterval(() => {
      if (currentPhase === 'speaking') {
        setThoughtStage('speaking');
        setIsAboutToBurst(false);
        return;
      }

      if (currentPhase === 'disappearing') {
        setThoughtStage('disappearing');
        setIsAboutToBurst(false);
        return;
      }

      if (!targetTime) {
        setThoughtStage('calm');
        setIsAboutToBurst(false);
        return;
      }

      const remainingMs = Math.max(0, targetTime - Date.now());
      setThoughtRemainingSec(Math.ceil(remainingMs / 1000));

      if (remainingMs <= 1100 && remainingMs > 0) {
        // Exactly 1 second before thought appears: inner circle expands to outer frame!
        setIsAboutToBurst(true);
        setThoughtStage('imminent');
      } else {
        setIsAboutToBurst(false);
        if (remainingMs <= 0) {
          setThoughtStage('imminent');
        } else if (remainingMs < 4500) {
          setThoughtStage('imminent');
        } else if (remainingMs < totalDelay * 0.5) {
          setThoughtStage('gathering');
        } else {
          setThoughtStage('calm');
        }
      }
    }, 200);

    return () => {
      window.removeEventListener('analyzer-thought-scheduled', handleScheduled as EventListener);
      window.removeEventListener('analyzer-thought-started', handleStarted);
      window.removeEventListener('analyzer-thought-disappearing', handleDisappearing);
      clearInterval(interval);
    };
  }, []);

  // Feline Cat Eye Blinking and Dilation state
  const [isEyeBlinking, setIsEyeBlinking] = React.useState<boolean>(false);
  const [isEyeHovered, setIsEyeHovered] = React.useState<boolean>(false);

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let secondTimeoutId: ReturnType<typeof setTimeout>;

    const triggerCatBlink = () => {
      // 35% chance of playful feline double-blink
      const isDoubleBlink = Math.random() < 0.35;
      setIsEyeBlinking(true);

      timeoutId = setTimeout(() => {
        setIsEyeBlinking(false);
        if (isDoubleBlink) {
          secondTimeoutId = setTimeout(() => {
            setIsEyeBlinking(true);
            setTimeout(() => setIsEyeBlinking(false), 140);
          }, 110);
        }
      }, 160);
    };

    // Blink every 3.8 to 5.8 seconds
    const interval = setInterval(triggerCatBlink, 4400);
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
      clearTimeout(secondTimeoutId);
    };
  }, []);

  // Automatic Lock/Padlock Rattle shake effect (runs independently every 8 seconds)
  const [isLockShaking, setIsLockShaking] = React.useState<boolean>(false);

  React.useEffect(() => {
    const triggerLockShake = () => {
      setIsLockShaking(true);
      setTimeout(() => {
        setIsLockShaking(false);
      }, 450);
    };

    const interval = setInterval(triggerLockShake, 8000);
    return () => clearInterval(interval);
  }, []);

  // Check daily steps state for today
  const dailyStepsState = React.useMemo(() => {
    try {
      const STEPS_STORAGE_KEY = 'quit-smoking:daily-micro-steps';
      const HISTORY_STORAGE_KEY = 'quit-smoking:daily-steps-history';
      const SHOW_INDICATOR_KEY = 'quit-smoking:daily-steps-show-indicator';

      const savedSteps = localStorage.getItem(STEPS_STORAGE_KEY);
      const steps = savedSteps ? JSON.parse(savedSteps) : [];
      const total = Array.isArray(steps) ? steps.length : 0;
      
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      const history = savedHistory ? JSON.parse(savedHistory) : {};
      const savedShow = localStorage.getItem(SHOW_INDICATOR_KEY);
      const showIndicator = savedShow !== null ? savedShow === 'true' : true;
      
      const d = new Date();
      const todayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const todayDone = history[todayKey] || [];
      const done = Array.isArray(steps) ? steps.filter((s: any) => todayDone.includes(s.id)).length : 0;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      
      return { done, total, pct, showIndicator };
    } catch {
      return { done: 0, total: 0, pct: 0, showIndicator: true };
    }
  }, [refreshTick]);

  // Check mental health for today
  const mentalHealthState = React.useMemo(() => {
    try {
      const d = new Date();
      const todayKey = `quit-smoking:mental-health-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const habitsKey = 'quit-smoking:mental-health-habits-config';
      const showIndicatorKey = 'quit-smoking:mental-health-show-indicator';

      const savedLog = localStorage.getItem(todayKey);
      const savedHabits = localStorage.getItem(habitsKey);
      const savedShow = localStorage.getItem(showIndicatorKey);

      const log = savedLog ? JSON.parse(savedLog) : {};
      const habits = savedHabits ? JSON.parse(savedHabits) : [];
      const showIndicator = savedShow !== null ? savedShow === 'true' : true;

      const list = Array.isArray(habits) && habits.length > 0 ? habits : [
        { id: 'hugs', type: 'checkbox' },
        { id: 'chat', type: 'checkbox' },
        { id: 'cold_splash', type: 'checkbox' },
        { id: 'sun_walk', type: 'checkbox' },
        { id: 'music', type: 'checkbox' },
        { id: 'gratitude', type: 'checkbox' },
        { id: 'dark_chocolate', type: 'checkbox' },
        { id: 'breathing', type: 'checkbox' },
        { id: 'micro_win', type: 'checkbox' },
        { id: 'smile', type: 'checkbox' }
      ];

      let score = 0;
      list.forEach((h: any) => {
        const val = log[h.id];
        if (h.type === 'counter') {
          const target = h.targetCount || 10;
          const count = typeof val === 'number' ? val : 0;
          score += Math.min(1, count / target);
        } else if (val === true) {
          score += 1;
        }
      });

      const pct = list.length > 0 ? Math.round((score / list.length) * 100) : 0;
      return { pct, showIndicator };
    } catch {
      return { pct: 0, showIndicator: true };
    }
  }, [refreshTick]);

  // Check gratitude journal state for today and reminder visibility
  const gratitudeState = React.useMemo(() => {
    try {
      const d = new Date();
      const todayDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const showKey = 'quit-smoking:gratitude-show-indicator';
      const storageKey = 'quit-smoking:gratitude-journal-entries';

      const savedShow = localStorage.getItem(showKey);
      const savedEntries = localStorage.getItem(storageKey);

      const showIndicator = savedShow !== null ? savedShow === 'true' : true;

      const list = savedEntries ? JSON.parse(savedEntries) : [];
      const todayEntry = Array.isArray(list) ? list.find((e: any) => e.date === todayDateStr) : null;

      let count = 0;
      if (todayEntry) {
        if (todayEntry.g1 && todayEntry.g1.trim()) count++;
        if (todayEntry.g2 && todayEntry.g2.trim()) count++;
        if (todayEntry.g3 && todayEntry.g3.trim()) count++;
      }

      return {
        count,
        showIndicator,
        isCompleted: count >= 3
      };
    } catch {
      return { count: 0, showIndicator: true, isCompleted: false };
    }
  }, [refreshTick]);

  const handleHealthClick = () => {
    try {
      const saved = localStorage.getItem('quit-smoking:more-sections-open');
      const current = saved ? JSON.parse(saved) : {};
      current.health = true;
      localStorage.setItem('quit-smoking:more-sections-open', JSON.stringify(current));
    } catch (e) {}
    onSwitchTab('more');
  };

  const DAY_MS = 24 * 60 * 60 * 1000;
  const HOUR_MS = 60 * 60 * 1000;
  const MIN_MS = 60 * 1000;
  const SEC_MS = 1000;

  const days = Math.floor(diffMs / DAY_MS);
  const hours = Math.floor((diffMs % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((diffMs % HOUR_MS) / MIN_MS);
  const seconds = Math.floor((diffMs % MIN_MS) / SEC_MS);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  // Digital format: D:HH:MM:SS:CC
  const digitalTimeText = React.useMemo(() => {
    const ms = diffMs % 1000;
    const cs = Math.floor(ms / 10);
    if (days > 0) {
      return `${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(cs)}`;
    }
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(cs)}`;
  }, [days, hours, minutes, seconds, diffMs]);

  const colonTimeText = React.useMemo(() => {
    return `${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }, [days, hours, minutes, seconds]);

  const todayFact = getTodayHealthFact(diffMs);

  const effectiveReasons = React.useMemo(() => {
    return Array.isArray(reasons)
      ? reasons.filter((r): r is string => typeof r === 'string' && r.trim().length > 0)
      : [];
  }, [reasons]);

  const currentReason = React.useMemo(() => {
    if (!effectiveReasons || effectiveReasons.length === 0) {
      return null;
    }
    const idx = ((currentReasonIdx % effectiveReasons.length) + effectiveReasons.length) % effectiveReasons.length;
    return effectiveReasons[idx] || null;
  }, [effectiveReasons, currentReasonIdx]);

  // Auto-rotate effect optimized to not cause re-render conflicts
  React.useEffect(() => {
    if (!autoRotateMotivations || effectiveReasons.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentReasonIdx((prev) => (prev + 1) % effectiveReasons.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRotateMotivations, effectiveReasons.length]);

  // Timer Effect Mode
  const [timerEffectMode, setTimerEffectMode] = React.useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:timer-horizon-effect') || 'classic';
    } catch {
      return 'classic';
    }
  });

  React.useEffect(() => {
    const handleTimerStyleChange = () => {
      try {
        const saved = localStorage.getItem('quit-smoking:timer-horizon-effect');
        if (saved) setTimerEffectMode(saved);
        else setTimerEffectMode('classic');
      } catch {}
    };
    window.addEventListener('timer-effect-change', handleTimerStyleChange);
    window.addEventListener('storage', handleTimerStyleChange);
    return () => {
      window.removeEventListener('timer-effect-change', handleTimerStyleChange);
      window.removeEventListener('storage', handleTimerStyleChange);
    };
  }, []);
  // Timer Minimized State & Handlers
  const [isTimerMinimized, setIsTimerMinimized] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:timer-minimized') === 'true';
    } catch {
      return false;
    }
  });

  const [pinnedSections, setPinnedSections] = React.useState<string[]>(() => {
    try {
      const defaultSections = ['daily_steps', 'gratitude_journal', 'notes'];
      const versionKey = 'quit-smoking:pinned-default-v3';
      const hasInit = localStorage.getItem(versionKey);
      if (!hasInit) {
        localStorage.setItem('quit-smoking:pinned-more-sections', JSON.stringify(defaultSections));
        localStorage.setItem(versionKey, 'true');
        return defaultSections;
      }
      const raw = localStorage.getItem('quit-smoking:pinned-more-sections');
      if (raw) return JSON.parse(raw);
    } catch {}
    return ['daily_steps', 'gratitude_journal', 'notes'];
  });

  React.useEffect(() => {
    const handlePinnedChange = () => {
      try {
        const raw = localStorage.getItem('quit-smoking:pinned-more-sections');
        if (raw) setPinnedSections(JSON.parse(raw));
        else setPinnedSections([]);
      } catch {}
    };
    window.addEventListener('pinned-more-sections-change', handlePinnedChange);
    window.addEventListener('storage', handlePinnedChange);
    return () => {
      window.removeEventListener('pinned-more-sections-change', handlePinnedChange);
      window.removeEventListener('storage', handlePinnedChange);
    };
  }, []);

  const handleUnpinSection = (key: string) => {
    const next = pinnedSections.filter((k) => k !== key);
    setPinnedSections(next);
    try {
      localStorage.setItem('quit-smoking:pinned-more-sections', JSON.stringify(next));
      window.dispatchEvent(new Event('pinned-more-sections-change'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  // Quick Access View Mode: 'list' | 'large' | 'medium' | 'small'
  const [quickAccessViewMode, setQuickAccessViewMode] = React.useState<'list' | 'large' | 'medium' | 'small'>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:quick-access-view-mode');
      if (saved === 'list' || saved === 'large' || saved === 'medium' || saved === 'small') {
        return saved;
      }
    } catch {}
    return 'medium';
  });

  const handleSetQuickAccessViewMode = (mode: 'list' | 'large' | 'medium' | 'small') => {
    setQuickAccessViewMode(mode);
    try {
      localStorage.setItem('quit-smoking:quick-access-view-mode', mode);
    } catch {}
  };

  // Custom Tile Names & Long Press Rename State
  const [customTileNames, setCustomTileNames] = React.useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:custom-tile-names');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [editingTileKey, setEditingTileKey] = React.useState<string | null>(null);
  const [editingTileNameInput, setEditingTileNameInput] = React.useState<string>('');

  const tileLongPressTimerRef = React.useRef<any>(null);
  const isLongPressActiveRef = React.useRef<boolean>(false);

  const handleOpenRenameTile = (secKey: string) => {
    const visual = getSectionVisual(secKey);
    const currentName = customTileNames[secKey] || visual.title;
    setEditingTileKey(secKey);
    setEditingTileNameInput(currentName);
  };

  const handleSaveTileName = () => {
    if (!editingTileKey) return;
    const trimmed = editingTileNameInput.trim();
    const updated = { ...customTileNames };
    if (trimmed) {
      updated[editingTileKey] = trimmed;
    } else {
      delete updated[editingTileKey];
    }
    setCustomTileNames(updated);
    try {
      localStorage.setItem('quit-smoking:custom-tile-names', JSON.stringify(updated));
    } catch {}
    setEditingTileKey(null);
  };

  const handleStartTilePress = (secKey: string) => {
    isLongPressActiveRef.current = false;
    tileLongPressTimerRef.current = setTimeout(() => {
      isLongPressActiveRef.current = true;
      try { navigator.vibrate?.(50); } catch {}
      handleOpenRenameTile(secKey);
    }, 450);
  };

  const handleEndTilePress = () => {
    if (tileLongPressTimerRef.current) {
      clearTimeout(tileLongPressTimerRef.current);
      tileLongPressTimerRef.current = null;
    }
  };

  const handleTileClick = (key: string) => {
    window.dispatchEvent(new CustomEvent('open-section-overlay', { detail: key }));
  };

  const handleMinimizedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTimerMinimized(false);
    try {
      localStorage.setItem('quit-smoking:timer-minimized', 'false');
    } catch {}
  };

  // Slice Countdown State & Sync Logic
  const [sliceTimeLeftSec, setSliceTimeLeftSec] = React.useState<number | null>(null);
  const [sliceIntervalMin, setSliceIntervalMin] = React.useState<number>(30);

  React.useEffect(() => {
    const updateSliceCountdown = () => {
      try {
        let intervalMin = 30;
        const intervalVal = localStorage.getItem('quit-smoking:prompt-interval-min');
        if (intervalVal !== null) {
          intervalMin = Number(intervalVal);
        } else {
          const rawSettings = localStorage.getItem('quit-smoking:analyzer-dialogue-settings');
          if (rawSettings) {
            const parsed = JSON.parse(rawSettings);
            if (parsed.sliceIntervalMinutes) intervalMin = Number(parsed.sliceIntervalMinutes);
          }
        }
        setSliceIntervalMin(isNaN(intervalMin) ? 30 : intervalMin);

        if (intervalMin === 0) {
          setSliceTimeLeftSec(null);
          return;
        }

        const lastPromptVal = localStorage.getItem('quit-smoking:last-prompt');
        let lastPrompt = lastPromptVal ? Number(lastPromptVal) : 0;
        if (lastPrompt === 0) {
          lastPrompt = Date.now();
          localStorage.setItem('quit-smoking:last-prompt', String(lastPrompt));
        }

        const effectiveMin = intervalMin > 0 ? intervalMin : 45;
        const intervalMs = effectiveMin * 60 * 1000;
        const targetTime = lastPrompt + intervalMs;
        const timeLeftMs = Math.max(0, targetTime - Date.now());
        setSliceTimeLeftSec(Math.floor(timeLeftMs / 1000));
      } catch {
        setSliceTimeLeftSec(null);
      }
    };

    updateSliceCountdown();
    const interval = setInterval(updateSliceCountdown, 1000);

    window.addEventListener('prompt-interval-change', updateSliceCountdown);
    window.addEventListener('analyzer-dialogue-settings-changed', updateSliceCountdown);
    window.addEventListener('storage', updateSliceCountdown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('prompt-interval-change', updateSliceCountdown);
      window.removeEventListener('analyzer-dialogue-settings-changed', updateSliceCountdown);
      window.removeEventListener('storage', updateSliceCountdown);
    };
  }, []);

  const slicePromptSentRef = React.useRef<boolean>(false);
  React.useEffect(() => {
    if (sliceTimeLeftSec === 0) {
      if (!slicePromptSentRef.current) {
        slicePromptSentRef.current = true;
        window.dispatchEvent(new Event('slice-timer-reached-zero'));
      }
    } else if (sliceTimeLeftSec !== null && sliceTimeLeftSec > 0) {
      slicePromptSentRef.current = false;
    }
  }, [sliceTimeLeftSec]);


  // Timer Background Texture state
  const [timerTexture, setTimerTexture] = React.useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:timer-texture') || 'none';
    } catch {
      return 'none';
    }
  });

  // Timer Hidden State (temporary, reset on next entry/session)
  const [isTimerHidden, setIsTimerHidden] = React.useState<boolean>(() => {
    try {
      return sessionStorage.getItem('quit-smoking:timer-hidden') === 'true';
    } catch {
      return false;
    }
  });

  const [isTimerInfoOpen, setIsTimerInfoOpen] = React.useState(false);
  const [isTreeTipOpen, setIsTreeTipOpen] = React.useState(false);

  const hideTimer = () => {
    setIsTimerHidden(true);
    try {
      sessionStorage.setItem('quit-smoking:timer-hidden', 'true');
    } catch {}
  };

  const showTimer = () => {
    setIsTimerHidden(false);
    try {
      sessionStorage.removeItem('quit-smoking:timer-hidden');
    } catch {}
  };

  const handleTimerMouseDown = (e: React.MouseEvent) => {
    setSwipeStartX(e.clientX);
    hasSwiped.current = false;
  };

  const handleTimerMouseMove = (e: React.MouseEvent) => {
  };

  const handleTimerMouseLeave = () => {
  };

  const handleTimerMouseUp = (e: React.MouseEvent) => {
    setSwipeStartX(null);
  };

  const handleTimerClick = (e: React.MouseEvent) => {
    if (isTimerHidden) return;
    if (e.detail >= 2) {
      setIsTimerMinimized(prev => {
        const next = !prev;
        try {
          localStorage.setItem('quit-smoking:timer-minimized', String(next));
        } catch {}
        return next;
      });
      return;
    }
  };

  const handleTimerTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      setSwipeStartX(touch.clientX);
      hasSwiped.current = false;
    }
  };

  const handleTimerTouchMove = (e: React.TouchEvent) => {
  };

  const handleTimerTouchCancel = () => {
  };

  const handleTimerTouchEnd = (e: React.TouchEvent) => {
    setSwipeStartX(null);
  };

  React.useEffect(() => {
    const handleTimerEffectChange = () => {
      try {
        const mode = localStorage.getItem('quit-smoking:timer-horizon-effect');
        setTimerEffectMode(mode || 'none');
      } catch {}
    };
    const handleTimerTextureChange = () => {
      try {
        const tex = localStorage.getItem('quit-smoking:timer-texture');
        setTimerTexture(tex || 'none');
      } catch {}
    };
    window.addEventListener('timer-effect-change', handleTimerEffectChange);
    window.addEventListener('timer-texture-change', handleTimerTextureChange);
    window.addEventListener('storage', handleTimerEffectChange);
    window.addEventListener('storage', handleTimerTextureChange);
    return () => {
      window.removeEventListener('timer-effect-change', handleTimerEffectChange);
      window.removeEventListener('timer-texture-change', handleTimerTextureChange);
      window.removeEventListener('storage', handleTimerEffectChange);
      window.removeEventListener('storage', handleTimerTextureChange);
    };
  }, []);

  const nextReason = () => {
    if (reasons.length > 1) {
      setCurrentReasonIdx((prev) => (prev + 1) % reasons.length);
    }
  };

  const formattedStartDate = React.useMemo(() => {
    try {
      return new Date(startDate).toLocaleString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return new Date(startDate).toLocaleString();
    }
  }, [startDate]);

  // Formatted human quit time with Ukrainian declensions
  // e.g. "Ти не куриш 10 днів, 12 годин і 13хв"
  const humanQuitTimeText = React.useMemo(() => {
    const getDaysWord = (d: number) => {
      const m10 = d % 10;
      const m100 = d % 100;
      if (m100 >= 11 && m100 <= 14) return 'днів';
      if (m10 === 1) return 'день';
      if (m10 >= 2 && m10 <= 4) return 'дні';
      return 'днів';
    };

    const getHoursWord = (h: number) => {
      const m10 = h % 10;
      const m100 = h % 100;
      if (m100 >= 11 && m100 <= 14) return 'годин';
      if (m10 === 1) return 'година';
      if (m10 >= 2 && m10 <= 4) return 'години';
      return 'годин';
    };

    if (days > 0) {
      return `${days} ${getDaysWord(days)} ${hours} ${getHoursWord(hours)} ${minutes}хв`;
    }
    if (hours > 0) {
      return `${hours} ${getHoursWord(hours)} ${minutes}хв`;
    }
    return `${Math.max(1, minutes)}хв`;
  }, [days, hours, minutes]);

  const numericQuitTimeText = React.useMemo(() => {
    return days > 0
      ? `${pad(days)} : ${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`
      : `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
  }, [days, hours, minutes, seconds]);

  // Freedom duration human-readable text

  // Packs avoided human-readable text (e.g. "123.8 пачки", "5 пачок", "1 пачка")
  const packsAvoidedText = React.useMemo(() => {
    if (!money || !money.packSize) return '0 пачок';
    const packs = cigsAvoided / money.packSize;
    const str = packs.toFixed(1);
    if (str.endsWith('.0')) {
      const intVal = Math.round(packs);
      const mod10 = intVal % 10;
      const mod100 = intVal % 100;
      if (mod100 >= 11 && mod100 <= 14) return `${intVal} пачок`;
      if (mod10 === 1) return `${intVal} пачка`;
      if (mod10 >= 2 && mod10 <= 4) return `${intVal} пачки`;
      return `${intVal} пачок`;
    }
    return `${str} пачки`;
  }, [cigsAvoided, money]);

  // Dream economy calculations
  const spentOnDreams = React.useMemo(() => {
    return (goals?.done || []).reduce((acc, g) => acc + (g.total || g.amount || 0), 0);
  }, [goals?.done]);

  const availableForDreams = React.useMemo(() => {
    return Math.max(0, totalSaved - (goals?.base || 0));
  }, [totalSaved, goals?.base]);

  // Current active smoking expense rates
  const curPerDay = money?.perDay ?? 20;
  const curPackSize = money?.packSize ?? 20;
  const curPackPrice = money?.packPrice ?? 100;

  const costPerCig = curPackSize > 0 ? curPackPrice / curPackSize : 0;
  const costPerDay = curPackSize > 0 ? (curPerDay / curPackSize) * curPackPrice : 0;
  const costPerMonth = costPerDay * 30;
  const costPerYear = costPerDay * 365;

  // Sand level badges breakdown
  const sandLevelBadges = React.useMemo(() => {
    const items = getLevelCounts(daysCount).filter(item => item.count > 0).slice(-4).reverse();

    if (items.length === 0) {
      return (
        <span className="text-[11px] text-slate-600 dark:text-zinc-300 font-medium">
          🌱 Менше 1 хвилини (перша піщинка формується)
        </span>
      );
    }

    return (
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {items.map((item) => (
          <span
            key={item.level}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/5 dark:bg-black/30 border border-[#B7CDC6]/50 dark:border-[#2d2d35] text-[10px] font-mono font-bold"
            style={{ color: item.config.color }}
          >
            <span>{item.count} × {item.config.name}</span>
          </span>
        ))}
      </div>
    );
  }, [daysCount]);

  // Tree stats for clickable card
  const currentTree = treeState.current;
  const currentSpecies = (currentTree && TREE_SPECIES[currentTree.speciesId]) ? TREE_SPECIES[currentTree.speciesId] : TREE_SPECIES.pine;
  const currentStage = currentTree ? getTreeStageInfo(currentTree.growth) : null;
  const treeGrowth = currentTree ? Math.floor(currentTree.growth) : 8;

  // Calculation of returned time: 1 cigarette takes user-defined minutes (default 7 min)
  const returnedTimeData = React.useMemo(() => {
    const minutesPerCig = money?.minutesPerCig ?? 7;
    const totalMinutes = Math.round(cigsAvoided * minutesPerCig);
    const wholeHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    const getBooksDeclension = (b: number) => {
      const m10 = b % 10;
      const m100 = b % 100;
      if (m100 >= 11 && m100 <= 14) return 'книг';
      if (m10 === 1) return 'книга';
      if (m10 >= 2 && m10 <= 4) return 'книги';
      return 'книг';
    };

    const getWorkoutsDeclension = (w: number) => {
      const m10 = w % 10;
      const m100 = w % 100;
      if (m100 >= 11 && m100 <= 14) return 'тренувань';
      if (m10 === 1) return 'тренування';
      if (m10 >= 2 && m10 <= 4) return 'тренування';
      return 'тренувань';
    };

    let timeText = '';
    if (wholeHours >= 24) {
      const d = Math.floor(wholeHours / 24);
      const h = wholeHours % 24;
      timeText = `${wholeHours} год (${d} дн. ${h > 0 ? `${h} год` : ''})`.trim();
    } else if (wholeHours > 0) {
      timeText = `${wholeHours} год${remainingMinutes > 0 ? ` ${remainingMinutes} хв` : ''}`;
    } else {
      timeText = `${Math.max(1, totalMinutes)} хв`;
    }

    // Realistic equivalents
    const booksCount = Math.max(1, Math.round(Math.max(1, wholeHours) / 10));
    const workoutsCount = Math.max(1, Math.round(Math.max(1, wholeHours) / 1));

    const perDay = money?.perDay ?? 15;
    const yearlyMinutes = perDay * minutesPerCig * 365;
    const yearlyHours = Math.round(yearlyMinutes / 60);

    return {
      totalMinutes,
      wholeHours,
      timeText,
      yearlyHoursText: `${yearlyHours.toLocaleString('uk-UA')} / рік`,
      booksText: `${booksCount} ${getBooksDeclension(booksCount)}`,
      workoutsText: `${workoutsCount} ${getWorkoutsDeclension(workoutsCount)}`
    };
  }, [cigsAvoided, money?.minutesPerCig, money?.perDay]);

  const gamesList = React.useMemo(() => {
    const list = [
      {
        id: 'sand',
        title: 'Піщинки часу',
        desc: 'Квантовий організм спокою. Торкніться, щоб відчути плин чистого часу.',
        icon: <RefractedSandglassIcon className="w-5 h-5 select-none" />,
        bgClass: 'bg-slate-50/70 hover:bg-slate-100/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/90 border-slate-200/80 dark:border-zinc-800',
        iconBgClass: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/25 group-hover:border-amber-500/45 transition-colors',
      },
      {
        id: 'orbit',
        title: 'Гравітаційні орбіти',
        desc: 'Музика небесних сфер. Запускайте космічні тіла у плавний вічний танець.',
        icon: <RefractedOrbitSphereIcon className="w-5 h-5 select-none" />,
        bgClass: 'bg-slate-50/70 hover:bg-slate-100/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/90 border-slate-200/80 dark:border-zinc-800',
        iconBgClass: 'bg-indigo-500/10 dark:bg-indigo-500/15 border-indigo-500/25 group-hover:border-indigo-500/45 transition-colors',
      },
      {
        id: 'sprout',
        title: 'Дерево Нескінченності',
        desc: 'Медитативне проростання зернини у височінь. Нескінченне розгалуження, цвітіння та перелив дзен-передзвонів.',
        icon: <RefractedInfiniteSproutIcon className="w-5 h-5 select-none" />,
        bgClass: 'bg-slate-50/70 hover:bg-slate-100/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/90 border-slate-200/80 dark:border-zinc-800',
        iconBgClass: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/25 group-hover:border-emerald-500/45 transition-colors',
      },
      {
        id: 'bowls',
        title: 'Співочі чаші',
        desc: 'Фізична дзен-симуляція звучання тибетських і кришталевих чаш. Спів по вінцю, вібрація води та медитація.',
        icon: <RefractedSingingBowlIcon className="w-5 h-5 select-none" />,
        bgClass: 'bg-slate-50/70 hover:bg-slate-100/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/90 border-slate-200/80 dark:border-zinc-800',
        iconBgClass: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/25 group-hover:border-amber-500/45 transition-colors',
      }
    ];

    return [...list].sort((a, b) => {
      const timeA = gamePlaytimes[a.id] || 0;
      const timeB = gamePlaytimes[b.id] || 0;
      return timeB - timeA;
    });
  }, [gamePlaytimes]);

  return (
    <div className="flex flex-col flex-1 pb-4 max-w-md mx-auto w-full relative">
      {/* 1. ТАЙМЕР */}
      <div 
        className="mb-3 px-0 pb-1 pt-0 flex flex-col justify-center items-center relative"
      >
         <style dangerouslySetInnerHTML={{ __html: `
          @keyframes neonFlicker {
            0%, 18%, 22%, 25%, 53%, 57%, 100% {
              opacity: 1;
              color: ${accentThemeInfo.glowColor};
              text-shadow: 0 0 6px ${accentThemeInfo.glowColor}, 0 0 12px ${accentThemeInfo.shadowColor}, 0 0 20px ${accentThemeInfo.shadowColor};
            }
            20%, 24%, 55% {
              opacity: 0.1;
              color: ${accentThemeInfo.offColor};
              text-shadow: none;
            }
          }
          .neon-flickering-char {
            animation: neonFlicker 0.18s infinite;
          }
          .neon-extinguished-char {
            opacity: 0.04 !important;
            color: ${accentThemeInfo.offColor} !important;
            text-shadow: none !important;
          }

          /* Vintage Nixie Tube Lamp (Газорозрядна лампа ІН-14) - спокійне стабільне тепле світіння */
          .timer-nixie-wrapper {
            background: radial-gradient(ellipse at center, rgba(30,15,5,0.92) 0%, rgba(12,6,3,0.98) 100%);
            border: 1px solid rgba(249, 115, 22, 0.4);
            box-shadow: inset 0 0 16px rgba(234, 88, 12, 0.25), 0 4px 20px rgba(0, 0, 0, 0.5);
            padding: 8px 18px;
            border-radius: 16px;
            font-family: 'Share Tech Mono', monospace;
            position: relative;
          }
          .timer-nixie-char {
            color: #fff7ed;
            text-shadow: 0 0 4px #ffedd5, 0 0 10px #fb923c, 0 0 20px #ea580c, 0 0 32px #c2410c;
            font-weight: 700;
          }

          /* Matrix Terminal - чіткий спокійний зелений дисплей */
          .timer-matrix-wrapper {
            background: #020c04;
            border: 1px solid rgba(34, 197, 94, 0.4);
            box-shadow: inset 0 0 14px rgba(34, 197, 94, 0.2), 0 0 15px rgba(34, 197, 94, 0.15);
            padding: 6px 16px;
            border-radius: 10px;
            font-family: 'VT323', monospace;
            letter-spacing: 2px;
          }
          .timer-matrix-char {
            color: #22c55e;
            text-shadow: 0 0 4px #22c55e, 0 0 10px #15803d;
          }

          /* Handwritten Calligraphy (Рукописний стиль) */
          .timer-handwritten-text {
            font-family: 'Caveat', cursive;
            font-weight: 700;
            font-size: 1.35em;
            letter-spacing: 0.5px;
            transform: rotate(-1.5deg);
            filter: drop-shadow(1px 2px 3px rgba(0,0,0,0.15));
          }

          /* 3D Modern - єдиний стиль з активним мерехтінням/підсвіткою */
          @keyframes threedFlicker {
            0%, 100% {
              color: #f8fafc;
              text-shadow: 
                1px 1px 0px #94a3b8,
                2px 2px 0px #64748b,
                3px 3px 0px #475569,
                4px 4px 6px rgba(0,0,0,0.35);
              filter: drop-shadow(0 0 4px rgba(255,255,255,0.4));
            }
            50% {
              color: #e2e8f0;
              text-shadow: 
                1px 1px 0px #64748b,
                2px 2px 0px #475569,
                3px 3px 0px #334155,
                4px 4px 8px rgba(0,0,0,0.5);
              filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.7));
            }
          }
          .timer-3d {
            animation: threedFlicker 2s infinite ease-in-out;
            transform: skew(-2deg, 1deg);
          }
          html:not(.dark) .timer-3d {
            color: #0f172a !important;
            animation: none !important;
            text-shadow: 
              1px 1px 0px #cbd5e1,
              2px 2px 0px #94a3b8,
              3px 3px 0px #64748b,
              4px 4px 6px rgba(0,0,0,0.15) !important;
            filter: drop-shadow(0 0 2px rgba(0,0,0,0.08)) !important;
          }

          /* Vintage Digital LCD */
          .timer-digital-wrapper {
            font-family: 'Share Tech Mono', monospace;
            background: #09090b;
            color: #ef4444;
            padding: 6px 16px;
            border-radius: 8px;
            box-shadow: inset 0 0 12px #000, 0 0 15px rgba(239, 68, 68, 0.25);
            border: 1px solid #27272a;
            letter-spacing: 1px;
          }

          /* 1. Coherent Zen Breathing Pulse (Дихання дзен) - 5.5с резонансний ритм */
          @keyframes zenBreathPulse {
            0%, 100% {
              transform: scale(0.985);
              opacity: 0.92;
            }
            50% {
              transform: scale(1.025);
              opacity: 1;
            }
          }
          @keyframes zenBreathHaloDark {
            0%, 100% {
              filter: drop-shadow(0 0 8px rgba(45, 212, 191, 0.35)) drop-shadow(0 0 16px rgba(20, 184, 166, 0.15));
            }
            50% {
              filter: drop-shadow(0 0 16px rgba(45, 212, 191, 0.75)) drop-shadow(0 0 32px rgba(20, 184, 166, 0.35));
            }
          }
          @keyframes zenBreathHaloLight {
            0%, 100% {
              filter: drop-shadow(0 1px 2px rgba(15, 23, 42, 0.08)) drop-shadow(0 0 8px rgba(13, 148, 136, 0.2));
            }
            50% {
              filter: drop-shadow(0 1px 3px rgba(15, 23, 42, 0.12)) drop-shadow(0 0 18px rgba(13, 148, 136, 0.45));
            }
          }
          .timer-zen-breathe {
            font-family: 'Marcellus', serif;
            letter-spacing: 0.04em;
          }
          html.dark .timer-zen-breathe {
            color: #ccfbf1;
            text-shadow: 0 0 10px rgba(45, 212, 191, 0.55), 0 0 20px rgba(20, 184, 166, 0.3);
            animation: zenBreathPulse 5.5s ease-in-out infinite, zenBreathHaloDark 5.5s ease-in-out infinite;
          }
          html:not(.dark) .timer-zen-breathe {
            color: #042f2e;
            text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
            animation: zenBreathPulse 5.5s ease-in-out infinite, zenBreathHaloLight 5.5s ease-in-out infinite;
          }

          /* 2. Aurora Borealis (Північне сяйво) */
          @keyframes auroraGradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .timer-aurora {
            font-family: 'Marcellus', serif;
            letter-spacing: 0.04em;
            background-size: 300% 300%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent !important;
            animation: auroraGradientShift 12s ease-in-out infinite;
          }
          html.dark .timer-aurora {
            background-image: linear-gradient(135deg, #2dd4bf 0%, #38bdf8 25%, #818cf8 50%, #c084fc 75%, #2dd4bf 100%);
            filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.4));
          }
          html:not(.dark) .timer-aurora {
            background-image: linear-gradient(135deg, #0f766e 0%, #0369a1 25%, #4338ca 50%, #7e22ce 75%, #0f766e 100%);
            filter: drop-shadow(0 1px 2px rgba(15, 23, 42, 0.12));
          }

          /* 3. Kyoto Rock Garden (Сад каменів) */
          .timer-kyoto-box {
            font-family: 'Marcellus', serif;
            letter-spacing: 0.08em;
            padding: 4px 16px;
            border-radius: 20px;
            transition: all 0.3s ease;
          }
          html.dark .timer-kyoto-box {
            background: rgba(28, 25, 23, 0.7);
            border: 1px solid rgba(168, 162, 158, 0.25);
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 4px 16px rgba(0, 0, 0, 0.4);
            color: #f5f5f4;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8), 0 0 14px rgba(214, 211, 209, 0.25);
          }
          html:not(.dark) .timer-kyoto-box {
            background: rgba(250, 250, 249, 0.85);
            border: 1px solid rgba(120, 113, 108, 0.25);
            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 8px rgba(120, 113, 108, 0.12);
            color: #1c1917;
            text-shadow: 0 1px 1px rgba(255, 255, 255, 0.9);
          }

          /* 4. Moonlight (Місячне сяйво) */
          @keyframes moonlightBreathe {
            0%, 100% {
              filter: drop-shadow(0 0 6px rgba(186, 230, 253, 0.35)) drop-shadow(0 0 16px rgba(147, 197, 253, 0.15));
              opacity: 0.94;
            }
            50% {
              filter: drop-shadow(0 0 14px rgba(224, 242, 254, 0.7)) drop-shadow(0 0 28px rgba(186, 230, 253, 0.35));
              opacity: 1;
            }
          }
          .timer-moonlight {
            font-family: 'Marcellus', serif;
            letter-spacing: 0.05em;
            animation: moonlightBreathe 7s ease-in-out infinite;
          }
          html.dark .timer-moonlight {
            color: #f8fafc;
            text-shadow: 0 0 10px rgba(224, 242, 254, 0.7), 0 0 22px rgba(147, 197, 253, 0.35);
          }
          html:not(.dark) .timer-moonlight {
            color: #0f172a;
            text-shadow: 0 1px 2px rgba(255, 255, 255, 0.9), 0 0 12px rgba(56, 189, 248, 0.25);
          }

          /* 5. Sandglass (Золотий пісок часу) */
          @keyframes sandflowPulse {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          .timer-sandglass {
            font-family: 'Marcellus', serif;
            letter-spacing: 0.04em;
            background-size: 250% 250%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent !important;
            animation: sandflowPulse 9s ease-in-out infinite;
          }
          html.dark .timer-sandglass {
            background-image: linear-gradient(135deg, #fef3c7 0%, #f59e0b 30%, #fbbf24 60%, #d97706 85%, #fef3c7 100%);
            filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.45));
          }
          html:not(.dark) .timer-sandglass {
            background-image: linear-gradient(135deg, #78350f 0%, #b45309 30%, #d97706 60%, #92400e 100%);
            filter: drop-shadow(0 1px 2px rgba(15, 23, 42, 0.1));
          }

          /* Zen Star: Реалістична ніжна мерехтлива зірка з повільним медитативним подихом */
          @keyframes realisticStarBreathe {
            0% {
              transform: scale(0.92);
              opacity: 0.72;
              background-color: #ffffff;
              box-shadow: 
                0 0 2px 1px #ffffff,
                0 0 6px 2px rgba(186, 230, 253, 0.8),   /* льодисто-блакитний відблиск */
                0 0 14px 4px rgba(56, 189, 248, 0.35),
                0 0 24px 8px rgba(14, 165, 233, 0.15);
            }
            15% {
              transform: scale(1.05);
              opacity: 0.95;
              box-shadow: 
                0 0 3px 1.5px #ffffff,
                0 0 8px 3px rgba(191, 219, 254, 0.9),   /* кришталевий блакитний */
                0 0 18px 6px rgba(96, 165, 250, 0.4),
                0 0 32px 10px rgba(37, 99, 235, 0.18);
            }
            32% {
              transform: scale(0.85);
              opacity: 0.58;
              box-shadow: 
                0 0 2px 1px #ffffff,
                0 0 5px 2px rgba(233, 213, 255, 0.7),   /* ніжний лавандовий */
                0 0 12px 3px rgba(192, 132, 252, 0.3),
                0 0 20px 6px rgba(168, 85, 247, 0.12);
            }
            48% {
              transform: scale(1.12);
              opacity: 1;
              box-shadow: 
                0 0 3px 1.5px #ffffff,
                0 0 9px 3px rgba(244, 114, 182, 0.85),  /* м'який рожево-фіолетовий спектр */
                0 0 20px 6px rgba(217, 70, 239, 0.45),
                0 0 36px 12px rgba(147, 51, 234, 0.2);
            }
            65% {
              transform: scale(0.9);
              opacity: 0.65;
              box-shadow: 
                0 0 2px 1px #ffffff,
                0 0 6px 2px rgba(254, 205, 211, 0.75),  /* ніжний рубіновий відблиск */
                0 0 14px 4px rgba(251, 113, 133, 0.35),
                0 0 24px 8px rgba(244, 63, 94, 0.15);
            }
            82% {
              transform: scale(1.08);
              opacity: 0.92;
              box-shadow: 
                0 0 3px 1.5px #ffffff,
                0 0 8px 3px rgba(216, 180, 254, 0.85),  /* фіалково-блакитний перехід */
                0 0 18px 6px rgba(167, 139, 250, 0.4),
                0 0 30px 10px rgba(124, 58, 237, 0.18);
            }
            100% {
              transform: scale(0.92);
              opacity: 0.72;
              background-color: #ffffff;
              box-shadow: 
                0 0 2px 1px #ffffff,
                0 0 6px 2px rgba(186, 230, 253, 0.8),
                0 0 14px 4px rgba(56, 189, 248, 0.35),
                0 0 24px 8px rgba(14, 165, 233, 0.15);
            }
          }

          /* Повільне органічне мерехтіння атмосфери (scintillation) */
          @keyframes gentleScintillation {
            0%, 100% {
              opacity: 0.45;
              transform: rotate(0deg) scale(0.95);
            }
            25% {
              opacity: 0.75;
              transform: rotate(1.5deg) scale(1.06);
            }
            50% {
              opacity: 0.35;
              transform: rotate(0deg) scale(0.9);
            }
            75% {
              opacity: 0.8;
              transform: rotate(-1.5deg) scale(1.08);
            }
          }

          /* Тонкий дифракційний хрест оптичного телескопа/ока */
          @keyframes diffractionPulse {
            0%, 100% {
              opacity: 0.28;
              transform: scaleX(0.9) scaleY(0.9);
            }
            50% {
              opacity: 0.65;
              transform: scaleX(1.15) scaleY(1.15);
            }
          }

          .zen-star-pinpoint {
            animation: realisticStarBreathe 10s infinite ease-in-out;
          }
          .zen-star-diffraction {
            animation: diffractionPulse 7s infinite ease-in-out;
          }
          .zen-star-halo {
            animation: gentleScintillation 14s infinite ease-in-out;
          }

          /* 13. Leather and Gold Style */
          .timer-leather-gold-box {
            background: radial-gradient(circle at center, #2e2621 0%, #171311 100%);
            border: 2px solid #b45309;
            outline: 1.5px dashed #f59e0b;
            outline-offset: -5px;
            box-shadow: inset 0 0 14px rgba(0,0,0,0.9), 0 5px 20px rgba(0,0,0,0.65);
            color: #f59e0b;
            font-family: 'Cinzel', 'Marcellus', serif;
            letter-spacing: 0.05em;
            padding: 8px 20px;
            border-radius: 16px;
            text-shadow: 1px 1px 0px #78350f, 0 0 8px rgba(245, 158, 11, 0.45);
          }

          /* 14. Obsidian Glow Style */
          @keyframes obsidianPulse {
            0%, 100% {
              filter: drop-shadow(0 0 5px rgba(168, 85, 247, 0.45)) drop-shadow(0 0 12px rgba(168, 85, 247, 0.2));
              border-color: rgba(168, 85, 247, 0.4);
            }
            50% {
              filter: drop-shadow(0 0 14px rgba(168, 85, 247, 0.9)) drop-shadow(0 0 28px rgba(236, 72, 153, 0.45));
              border-color: rgba(236, 72, 153, 0.65);
            }
          }
          .timer-obsidian-glow-box {
            background: radial-gradient(circle at center, #18181b 0%, #09090b 100%);
            border: 1px solid rgba(168, 85, 247, 0.45);
            box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.95), 0 4px 18px rgba(168, 85, 247, 0.15);
            color: #f3e8ff;
            font-family: 'Marcellus', serif;
            letter-spacing: 0.05em;
            padding: 8px 20px;
            border-radius: 14px;
            animation: obsidianPulse 4.5s infinite ease-in-out;
            text-shadow: 0 0 8px rgba(168, 85, 247, 0.75);
          }

          /* 15. Ancient Parchment Style */
          .timer-parchment-box {
            background-color: #f7ebd3;
            background-image: radial-gradient(rgba(242, 232, 212, 0.5) 30%, rgba(212, 192, 166, 0.65) 100%);
            border: 1px solid #c2a67e;
            box-shadow: inset 0 0 10px rgba(139, 92, 26, 0.18), 0 4px 12px rgba(0, 0, 0, 0.15);
            color: #3f2d1e;
            font-family: 'Caveat', cursive;
            font-weight: 700;
            font-size: 1.25em;
            letter-spacing: 0.5px;
            padding: 6px 18px;
            border-radius: 10px;
            text-shadow: 0.5px 0.5px 1px rgba(255,255,255,0.75);
          }

          /* 16. Nordic Frost Style */
          @keyframes frostBreathe {
            0%, 100% {
              background-color: rgba(224, 242, 254, 0.16);
              box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.25), 0 4px 16px rgba(56, 189, 248, 0.16);
            }
            50% {
              background-color: rgba(224, 242, 254, 0.3);
              box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.4), 0 6px 24px rgba(56, 189, 248, 0.32);
            }
          }
          .timer-nordic-frost-box {
            background-color: rgba(224, 242, 254, 0.18);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            color: #f0f9ff;
            font-family: 'Marcellus', serif;
            letter-spacing: 0.05em;
            padding: 8px 20px;
            border-radius: 20px;
            animation: frostBreathe 6.5s infinite ease-in-out;
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.85), 0 0 16px rgba(56, 189, 248, 0.45);
          }

          /* 17. Emerald & Gold Style */
          .timer-emerald-gold-box {
            background: radial-gradient(circle at center, #064e3b 0%, #022c22 100%);
            border: 1.5px solid #fbbf24;
            box-shadow: inset 0 0 12px rgba(0,0,0,0.85), 0 4px 15px rgba(251, 191, 36, 0.25);
            color: #fbbf24;
            font-family: 'Marcellus', serif;
            letter-spacing: 0.06em;
            padding: 8px 20px;
            border-radius: 14px;
            text-shadow: 0 0 8px rgba(251, 191, 36, 0.65);
          }

          /* 18. Neon Pulse Style */
          @keyframes neonBlueBreathe {
            0%, 100% {
              text-shadow: 0 0 4px #06b6d4, 0 0 10px #06b6d4, 0 0 20px #0891b2;
              color: #ecfeff;
            }
            50% {
              text-shadow: 0 0 12px #22d3ee, 0 0 24px #22d3ee, 0 0 40px #06b6d4;
              color: #ffffff;
            }
          }
          .timer-neon-pulse-box {
            background-color: rgba(6, 182, 212, 0.05);
            border: 1.5px solid rgba(6, 182, 212, 0.35);
            padding: 6px 18px;
            border-radius: 12px;
            animation: neonBlueBreathe 3s infinite ease-in-out;
          }

          /* General bottom slide drawer animation for style menu */
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .animate-slideUp {
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          /* Occasional rotating gear animation */
          @keyframes gearRotate {
            0%, 75%, 100% {
              transform: rotate(0deg);
            }
            80% {
              transform: rotate(180deg);
            }
            85% {
              transform: rotate(360deg);
            }
          }
          .animate-gear-occasional {
            display: inline-block;
            animation: gearRotate 12s infinite ease-in-out;
          }

          /* Occasional sparkle spin/pulse animation */
          @keyframes sparkleOccasional {
            0%, 70%, 100% {
              transform: rotate(0deg) scale(1);
            }
            75% {
              transform: rotate(45deg) scale(1.15);
            }
            80% {
              transform: rotate(90deg) scale(1);
            }
            85% {
              transform: rotate(135deg) scale(1.15);
            }
            90% {
              transform: rotate(180deg) scale(1);
            }
          }
          .animate-sparkle-occasional {
            display: inline-block;
            animation: sparkleOccasional 10s infinite ease-in-out;
          }

          @keyframes autumnFall {
            0% {
              transform: translateY(-20px) translateX(0) rotate(0deg);
              opacity: 0;
            }
            15% {
              opacity: 1;
            }
            85% {
              opacity: 1;
            }
            100% {
              transform: translateY(220px) translateX(35px) rotate(360deg);
              opacity: 0;
            }
          }
          .animate-autumnFall {
            animation-name: autumnFall;
          }

          @keyframes autumnWavy {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
              filter: hue-rotate(0deg);
            }
            25% {
              transform: translateY(-3px) rotate(-1.5deg);
              filter: hue-rotate(3deg);
            }
            50% {
              transform: translateY(1.5px) rotate(1deg);
              filter: hue-rotate(-2deg);
            }
            75% {
              transform: translateY(-1.5px) rotate(-1deg);
              filter: hue-rotate(4deg);
            }
          }
          .autumn-char {
            display: inline-block;
            animation: autumnWavy 3.5s ease-in-out infinite;
          }

          /* Black Hole Event Horizon Transparent Lens Keyframes */
          @keyframes horizonLensPass {
            0% {
              left: -14%;
              transform: translateY(-50%) scale(0.94) rotate(-3deg);
            }
            48% {
              left: 86%;
              transform: translateY(-50%) scale(1.14) rotate(3deg);
            }
            50% {
              left: 86%;
              transform: translateY(-50%) scale(1.14) rotate(3deg);
            }
            98% {
              left: -14%;
              transform: translateY(-50%) scale(0.94) rotate(-3deg);
            }
            100% {
              left: -14%;
              transform: translateY(-50%) scale(0.94) rotate(-3deg);
            }
          }

          @keyframes horizonLensTextWarp {
            0%, 100% {
              transform: scale(1.22) skewX(-7deg) scaleY(1.08);
              filter: brightness(140%) contrast(130%) drop-shadow(0 0 10px rgba(56, 189, 248, 0.95)) drop-shadow(0 0 16px rgba(168, 85, 247, 0.6));
            }
            50% {
              transform: scale(1.25) skewX(7deg) scaleY(1.12);
              filter: brightness(150%) contrast(135%) drop-shadow(0 0 12px rgba(168, 85, 247, 0.95)) drop-shadow(0 0 18px rgba(56, 189, 248, 0.6));
            }
          }

          @keyframes eventHorizonSweep {
            0% {
              transform: translateX(-130%) skewX(-20deg);
            }
            45%, 100% {
              transform: translateX(240%) skewX(-20deg);
            }
          }

          @keyframes horizonWarp {
            0%, 100% {
              transform: scaleY(-1) translateY(0);
              filter: blur(1px);
            }
            25% {
              transform: scaleY(-0.95) scaleX(1.02) translateY(1px);
              filter: blur(1.5px);
            }
            50% {
              transform: scaleY(-1.03) scaleX(0.98) translateY(-0.5px);
              filter: blur(1.2px);
            }
            75% {
              transform: scaleY(-0.97) scaleX(1.01) translateY(0.5px);
              filter: blur(1.6px);
            }
          }

          @keyframes accretionPulse {
            0%, 100% {
              opacity: 0.55;
              transform: scale(1);
            }
            50% {
              opacity: 0.85;
              transform: scale(1.06);
            }
          }

          @keyframes swaySoft {
            0%, 100% { transform: rotate(0deg) translateY(0); }
            25% { transform: rotate(-6deg) translateY(-1px); }
            75% { transform: rotate(6deg) translateY(1px); }
          }
          .animate-sway-gentle {
            animation: swaySoft 2s ease-in-out infinite;
          }

          .animate-horizon-lens-text {
            animation: horizonLensTextWarp 3s ease-in-out infinite alternate;
          }

          .animate-horizon-sweep {
            animation: eventHorizonSweep 3.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          .animate-horizon-warp {
            animation: horizonWarp 5.5s ease-in-out infinite;
          }

          .animate-accretion-pulse {
            animation: accretionPulse 3.8s ease-in-out infinite;
          }

          @keyframes pinPressPush {
            0%, 60%, 100% {
              transform: translateY(0) scale(1) scaleY(1);
            }
            15% {
              transform: translateY(2.5px) scaleY(0.72) scaleX(1.18);
            }
            30% {
              transform: translateY(-0.8px) scaleY(1.08) scaleX(0.94);
            }
            42% {
              transform: translateY(1px) scaleY(0.88) scaleX(1.05);
            }
            50% {
              transform: translateY(0) scale(1);
            }
          }

          .animate-pin-push {
            animation: pinPressPush 3.8s ease-in-out infinite;
          }

          @keyframes lockShake {
            0%, 100% { transform: translateX(0) rotate(0deg); }
            20%, 60% { transform: translateX(-4px) rotate(-12deg); }
            40%, 80% { transform: translateX(4px) rotate(12deg); }
          }

          .animate-lock-shake {
            animation: lockShake 0.45s ease-in-out;
          }

          @keyframes bounceLeft {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-5px); }
          }

          @keyframes bounceRight {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(5px); }
          }

          @keyframes triangleEmanateLeft {
            0% { transform: translate(35px, -18px) scale(0.2); opacity: 0; }
            60% { opacity: 1; }
            100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }

          @keyframes triangleEmanateRight {
            0% { transform: translate(-25px, -18px) scale(0.2); opacity: 0; }
            60% { opacity: 1; }
            100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }

          .animate-triangle-left {
            animation: triangleEmanateLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards, bounceLeft 1s ease-in-out 0.5s infinite;
          }

          .animate-triangle-right {
            animation: triangleEmanateRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards, bounceRight 1s ease-in-out 0.5s infinite;
          }

          @keyframes swipeLeftTri {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-4px); }
          }
          @keyframes swipeRightTri {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(4px); }
          }

          @keyframes starMeditationPulse {
            0%, 100% {
              transform: scale(1) rotate(0deg);
              filter: drop-shadow(0 0 3px rgba(255, 253, 208, 0.8)) drop-shadow(0 0 6px rgba(168, 85, 247, 0.4));
              opacity: 0.9;
            }
            33% {
              transform: scale(1.05) rotate(45deg);
              filter: drop-shadow(0 0 5px rgba(255, 253, 208, 0.95)) drop-shadow(0 0 8px rgba(236, 72, 153, 0.5));
              opacity: 1;
            }
            66% {
              transform: scale(0.96) rotate(90deg);
              filter: drop-shadow(0 0 3px rgba(255, 253, 208, 0.7)) drop-shadow(0 0 6px rgba(59, 130, 246, 0.4));
              opacity: 0.85;
            }
          }

          .animate-meditation-star {
            animation: starMeditationPulse 4.5s ease-in-out infinite;
          }

          @keyframes yinYangRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-yinyang-slow {
            animation: yinYangRotate 12s linear infinite;
          }

          @keyframes yinYangPartA {
            0%, 28% {
              transform: translate(0px, 0px) rotate(0deg);
            }
            48% {
              transform: translate(-3.8px, -3.2px) rotate(-18deg);
            }
            68% {
              transform: translate(-3.2px, -3.8px) rotate(-8deg);
            }
            88%, 100% {
              transform: translate(0px, 0px) rotate(0deg);
            }
          }

          @keyframes yinYangPartB {
            0%, 28% {
              transform: translate(0px, 0px) rotate(0deg);
            }
            48% {
              transform: translate(3.8px, 3.2px) rotate(-18deg);
            }
            68% {
              transform: translate(3.2px, 3.8px) rotate(-8deg);
            }
            88%, 100% {
              transform: translate(0px, 0px) rotate(0deg);
            }
          }

          .animate-yinyang-part-a {
            animation: yinYangPartA 8.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            transform-origin: 12px 12px;
          }

          .animate-yinyang-part-b {
            animation: yinYangPartB 8.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            transform-origin: 12px 12px;
          }

          @keyframes iconFlip {
            0%, 100% { transform: rotateY(0deg); }
            50% { transform: rotateY(180deg); }
          }
          .animate-icon-flip {
            animation: iconFlip 4s ease-in-out infinite;
            transform-style: preserve-3d;
          }
        `}} />

        {/* TIMER DISPLAY */}
        <div 
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          className={`relative group flex flex-col w-full pt-3 pb-3 overflow-visible select-none items-center scale-100 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isEverythingHidden || isIntroDialogueActive ? 'opacity-0 pointer-events-none -translate-y-2 blur-xs' : 'opacity-100 pointer-events-auto translate-y-0 blur-0'
          }`}
        >
            <div className="relative flex items-center justify-center overflow-visible w-full">
              <div className="relative flex flex-col items-center justify-center w-full">

                  {/* 1. Meditation Star & Resource Chart Icon (Far Left Column, Symmetrical with Status Indicators) */}
                  <div 
                    className={`absolute top-1.5 left-3.5 sm:left-4 z-[45] flex flex-col items-center gap-1.5 pointer-events-auto transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-[transform,opacity,filter] ${
                      showStar && introStarVisible
                        ? 'opacity-100 scale-100 blur-0 pointer-events-auto' 
                        : 'opacity-0 scale-75 blur-xl pointer-events-none'
                    }`}
                  >
                    <button
                      type="button"
                      ref={zenStarButtonRef}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onOpenMeditation) {
                          onOpenMeditation();
                        } else {
                          setIsZenMode(true);
                        }
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onOpenMeditation) {
                          onOpenMeditation();
                        } else {
                          setIsZenMode(true);
                        }
                      }}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-300 cursor-pointer active:scale-90 group/star select-none shrink-0 flex items-center justify-center hover:bg-zinc-800/40 ${
                        isZenStarBright ? 'scale-125 bg-zinc-700/40 ring-2 ring-zinc-400' : ''
                      }`}
                      title="Зірка медитації (дихання та спокій)"
                      aria-label="Відкрити режим медитації"
                    >
                      <FourPointStar className={`w-5 h-5 sm:w-5 sm:h-5 transition-all duration-300 origin-center ${
                        isZenStarBright 
                          ? 'text-zinc-100 scale-125' 
                          : 'text-zinc-400 dark:text-zinc-300 opacity-85 hover:opacity-100 group-hover/star:scale-115 animate-meditation-star'
                      }`} />
                    </button>
                  </div>

                  {/* 2. Pinned Goal & Recovery Indicators (Far Right Column, Horizontally aligned with Timer, Gift on top row) */}
                  <div 
                    className={`absolute top-2 right-3.5 sm:right-4 z-[45] flex flex-col items-end pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-[transform,opacity,filter] ${
                      showRows ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-90 pointer-events-none'
                    }`}
                  >
                    <StatusIndicators
                      isGoalsDocked={isGoalsDocked}
                      setIsGoalsDocked={setIsGoalsDocked}
                      isQuickGoalDocked={isQuickGoalDocked}
                      setIsQuickGoalDocked={setIsQuickGoalDocked}
                      isHealthDocked={isHealthDocked}
                      setIsHealthDocked={setIsHealthDocked}
                      isStepsDocked={isStepsDocked}
                      setIsStepsDocked={setIsStepsDocked}
                      isMentalHealthDocked={isMentalHealthDocked}
                      setIsMentalHealthDocked={setIsMentalHealthDocked}
                      isGratitudeDocked={isGratitudeDocked}
                      setIsGratitudeDocked={setIsGratitudeDocked}
                      goals={goals}
                      totalSaved={totalSaved}
                      startDate={startDate}
                      quickGoalData={quickGoalData}
                      quickGoalNow={quickGoalNow}
                      diffMs={diffMs}
                      getBodySystemsRecovery={getBodySystemsRecovery}
                      setIsGoalModalOpen={setIsGoalModalOpen}
                      handleHealthClick={handleHealthClick}
                      setIsStepsOpen={setIsStepsOpen}
                      setIsMentalHealthOpen={setIsMentalHealthOpen}
                      setIsGratitudeOpen={setIsGratitudeOpen}
                      dailyStepsState={dailyStepsState}
                      mentalHealthState={mentalHealthState}
                      gratitudeState={gratitudeState}
                      iconStyle={indicatorStyle}
                      isAnalyzerModalOpen={isAnalyzerModalOpen}
                    />
                  </div>

                  {/* Center Timer Display in Top Bar */}
                  <div
                    onTouchStart={handleTimerTouchStart}
                    onTouchMove={handleTimerTouchMove}
                    onTouchEnd={handleTimerTouchEnd}
                    onTouchCancel={handleTimerTouchCancel}
                    onMouseDown={handleTimerMouseDown}
                    onMouseMove={handleTimerMouseMove}
                    onMouseUp={handleTimerMouseUp}
                    onMouseLeave={handleTimerMouseLeave}
                    onClick={handleTimerClick}
                    className={`absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center h-7 select-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-[transform,opacity,filter] cursor-pointer ${
                      introTimerVisible
                        ? 'opacity-100 scale-100 blur-0 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-90 blur-xl -translate-y-2 pointer-events-none'
                    }`}
                    title="Клік: перемикання режимів таймера"
                  >
                    {!isTimerHidden && (() => {
                      const isClassic = timerEffectMode === 'classic' || timerEffectMode === 'none' || !timerEffectMode;
                      const isPrismShell = timerEffectMode === 'prism-shell';
                      const styleClass = (isClassic || isPrismShell) ? '' : getTimerStyleCssClass(timerEffectMode);

                      const renderChars = (val: string | number, isUnit: boolean = false) => {
                        const str = String(val);
                        return str.split('').map((char, i) => (
                          <span
                            key={i}
                            className={`cosmic-dim-char inline-block transition-all duration-300 transform-gpu will-change-[opacity,transform,filter] ${
                              isUnit 
                                ? 'text-[11px] sm:text-[12px] font-bold text-zinc-400 dark:text-zinc-400' 
                                : 'tabular-nums font-black text-zinc-100 dark:text-zinc-100 tracking-tight'
                            }`}
                          >
                            {char}
                          </span>
                        ));
                      };

                      const timerContent = (
                        <div 
                          className={`relative z-10 inline-flex items-center justify-center text-[13px] sm:text-[15px] font-mono select-none pointer-events-none transition-all duration-300 animate-section-header-text section-delay-0 bg-transparent ${
                            (isClassic || isPrismShell) 
                              ? '' 
                              : `${styleClass} scale-90 origin-center py-0.5 px-2`
                          }`}
                        >
                          {/* Days */}
                          <span className={`inline-flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
                            showTimerDays ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-75'
                          }`}>
                            {isClassic ? (
                              <>
                                {renderChars(days, false)}
                                <span className="ml-0.5 mr-1.5 inline-flex items-center">
                                  {renderChars('д', true)}
                                </span>
                              </>
                            ) : isPrismShell ? (
                              <>
                                <span className="tabular-nums font-black refracted-prism-text tracking-tight cosmic-dim-char inline-block">{days}</span>
                                <span className="text-[11px] sm:text-[12px] font-bold ml-0.5 mr-1.5 refracted-prism-unit cosmic-dim-char inline-block">д</span>
                              </>
                            ) : (
                              <>
                                <span className="tabular-nums font-black tracking-tight cosmic-dim-char inline-block">{days}</span>
                                <span className="text-[11px] sm:text-[12px] font-bold ml-0.5 mr-1.5 cosmic-dim-char inline-block">д</span>
                              </>
                            )}
                          </span>

                          {/* Hours */}
                          <span className={`inline-flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
                            showTimerHours ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-75'
                          }`}>
                            {isClassic ? (
                              <>
                                {renderChars(pad(hours), false)}
                                <span className="ml-0.5 mr-1.5 inline-flex items-center">
                                  {renderChars('г', true)}
                                </span>
                              </>
                            ) : isPrismShell ? (
                              <>
                                <span className="tabular-nums font-black refracted-prism-text tracking-tight cosmic-dim-char inline-block">{pad(hours)}</span>
                                <span className="text-[11px] sm:text-[12px] font-bold ml-0.5 mr-1.5 refracted-prism-unit cosmic-dim-char inline-block">г</span>
                              </>
                            ) : (
                              <>
                                <span className="tabular-nums font-black tracking-tight cosmic-dim-char inline-block">{pad(hours)}</span>
                                <span className="text-[11px] sm:text-[12px] font-bold ml-0.5 mr-1.5 cosmic-dim-char inline-block">г</span>
                              </>
                            )}
                          </span>

                          {/* Minutes */}
                          <span className={`inline-flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
                            showTimerMins ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-75'
                          }`}>
                            {isClassic ? (
                              <>
                                {renderChars(pad(minutes), false)}
                                <span className="ml-0.5 inline-flex items-center">
                                  {renderChars('х', true)}
                                </span>
                              </>
                            ) : isPrismShell ? (
                              <>
                                <span className="tabular-nums font-black refracted-prism-text tracking-tight cosmic-dim-char inline-block">{pad(minutes)}</span>
                                <span className="text-[11px] sm:text-[12px] font-bold ml-0.5 refracted-prism-unit cosmic-dim-char inline-block">х</span>
                              </>
                            ) : (
                              <>
                                <span className="tabular-nums font-black tracking-tight cosmic-dim-char inline-block">{pad(minutes)}</span>
                                <span className="text-[11px] sm:text-[12px] font-bold ml-0.5 cosmic-dim-char inline-block">х</span>
                              </>
                            )}
                          </span>
                        </div>
                      );

                      if (isPrismShell) {
                        return (
                          <RefractedTimerShell>
                            {timerContent}
                          </RefractedTimerShell>
                        );
                      }

                      return timerContent;
                    })()}
                  </div>
              </div>
            </div>
          </div>

        {/* Інтерактивний Аналізатор Здоров'я (ЗГУСТОК ЕНЕРГІЇ / ОБОЛОНКА) */}
        {!isAnalyzerDocked && !isEverythingHidden && (
          <div className="relative flex flex-col items-center justify-center my-0.5 select-none">
            <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-[transform,opacity,filter] ${
              isRingRevealed
                ? 'opacity-100 scale-100 blur-0 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-90 blur-md translate-y-2 pointer-events-none'
            }`}>
              <AnalyzerTip 
                onOpenModal={() => setIsAnalyzerModalOpen(true)}
                isDocked={isAnalyzerDocked}
                setIsDocked={setIsAnalyzerDocked}
                isEverythingHidden={isEverythingHidden}
              />
            </div>
          </div>
        )}
      </div>

  {/* ZEN MODE: EVERYTHING COLLAPSED YIN YANG CONTROLLER REMOVED FROM FLOW */}

  {!isEverythingHidden && (
    <div className={`mt-[70px] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-[transform,opacity,filter] ${
      showRows && !isIntroDialogueActive
        ? 'opacity-100 translate-y-0 blur-0 pointer-events-auto' 
        : 'opacity-0 translate-y-8 blur-xl pointer-events-none'
    }`}>
      {/* 1. БЛОК СТАТИСТИКА */}
      {/* Тьмяний задній фон при розгортанні (тільки коли дійсно розгорнуто та не згорнуто у трикутник) */}
      {isSavedStatsExpanded && !isStatsMinimized && (
        <div 
          onClick={() => setIsSavedStatsExpanded(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[45] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer opacity-100 pointer-events-auto"
        />
      )}

      {/* Заощаджені ресурси та розширена статистика */}
      <div 
        ref={savedStatsContainerRef} 
        className={`w-full max-w-md mx-auto relative space-y-2 mb-3.5 px-3 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-[transform,opacity,filter] ${
          introSec1Visible
            ? 'opacity-100 translate-y-0 blur-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 blur-xl pointer-events-none'
        } ${
          isSavedStatsExpanded && !isStatsMinimized ? 'relative z-[50]' : 'relative z-10'
        }`}
      >
        {/* Yin-Yang Icon positioned right above Statistics, vertically aligned over the triangle */}
        <div 
          className={`absolute -top-10 left-[18px] h-7 z-40 flex items-center justify-center select-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-[transform,opacity,filter] ${
            introYinYangVisible
              ? 'opacity-100 scale-100 blur-0 pointer-events-auto'
              : 'opacity-0 scale-75 blur-xl pointer-events-none'
          }`}
        >
          <div className="pointer-events-auto">
            <button
              type="button"
              onMouseDown={handleYinYangPressStart}
              onMouseUp={handleYinYangPressEnd}
              onMouseLeave={handleYinYangPressEnd}
              onTouchStart={handleYinYangPressStart}
              onTouchEnd={handleYinYangPressEnd}
              onClick={handleYinYangClick}
              className="p-1 rounded-full transition-all duration-300 cursor-pointer active:scale-90 flex items-center justify-center shrink-0 group/yinyang"
              title={isEverythingHidden ? "Режим Інь-Ян: увімкнено (клік для розгортання, утримуйте для меню)" : "Увімкнути режим Інь-Ян (сховати все, утримуйте для меню)"}
            >
              <YinYangIcon className={`w-5 h-5 transition-all duration-300 group-hover/yinyang:scale-110 origin-center ${
                isEverythingHidden
                  ? 'animate-yinyang-slow text-white opacity-100'
                  : 'text-zinc-400 dark:text-zinc-300 opacity-80 hover:opacity-100'
              }`} />
            </button>
          </div>
        </div>
          {isStatsMinimized ? (
            /* Тільки стрілка ліворуч без фону і рамки, точково вирівняна під вертикаль Інь-Ян */
            <div 
              onClick={() => {
                setIsSavedStatsExpanded(false);
                setIsStatsMinimized(false);
                try { localStorage.setItem('quit-smoking:saved-stats-minimized', 'false'); } catch {}
              }}
              className="py-0.5 pl-[18px] pr-1 flex items-center justify-start cursor-pointer group/min w-fit"
              title="Розгорнути статистику"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSavedStatsExpanded(false);
                  setIsStatsMinimized(false);
                  try { localStorage.setItem('quit-smoking:saved-stats-minimized', 'false'); } catch {}
                }}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all active:scale-90 cursor-pointer flex items-center justify-center shrink-0"
                title="Розгорнути статистику"
              >
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover/min:text-zinc-100 transition-colors animate-section-chevron section-delay-0" />
              </button>
              <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 ml-1 group-hover/min:text-zinc-100 transition-colors animate-section-header-text section-delay-0">
                Статистика
              </span>
            </div>
          ) : (
            <>
              <div className="pl-[18px] pr-1 flex items-center justify-between">
                <div 
                  onClick={() => {
                    setIsSavedStatsExpanded(false);
                    setIsStatsMinimized(true);
                    try { localStorage.setItem('quit-smoking:saved-stats-minimized', 'true'); } catch {}
                  }}
                  className="flex items-center gap-2 cursor-pointer group/exp w-fit"
                  title="Згорнути статистику"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSavedStatsExpanded(false);
                      setIsStatsMinimized(true);
                      try { localStorage.setItem('quit-smoking:saved-stats-minimized', 'true'); } catch {}
                    }}
                    className="p-1 text-zinc-400 hover:text-zinc-200 shrink-0 flex items-center justify-center rounded-full hover:bg-zinc-800/60 transition-colors cursor-pointer active:scale-90"
                    title="Згорнути статистику"
                  >
                    <ChevronLeft className="w-4 h-4 text-zinc-400 group-hover/exp:text-zinc-100 transition-transform animate-section-chevron section-delay-0" />
                  </button>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 group-hover/exp:text-zinc-100 transition-colors animate-section-header-text section-delay-0">
                    Статистика
                  </span>
                </div>
              </div>

              {/* Головний індикатор-рядок */}
              <div 
                onClick={toggleSavedStatsExpanded}
                className="w-full py-2 px-2.5 xs:px-3 sm:px-4 rounded-2xl flex items-center justify-between gap-1 sm:gap-2 text-[10px] xs:text-[11px] sm:text-xs font-mono cursor-pointer transition-all duration-200 select-none shadow-xs bg-[#18181f]/90 border border-zinc-800/80 hover:bg-[#1f1f27] hover:border-zinc-700 overflow-hidden"
                title={isSavedStatsExpanded ? "Згорнути детальну статистику" : "Розгорнути детальну статистику"}
              >
                <div className="flex-1 min-w-0 flex items-center justify-between sm:justify-center gap-1 xs:gap-1.5 sm:gap-3 text-zinc-300 font-semibold overflow-hidden">
                  {/* 1. Wallet / Total Saved */}
                  <span className="flex items-center gap-0.5 xs:gap-1 shrink-0 text-zinc-200">
                    <Wallet className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-zinc-400 shrink-0" />
                    <span className="font-mono font-bold tracking-tighter xs:tracking-tight text-[10px] xs:text-[11px] sm:text-xs whitespace-nowrap">
                      {Math.floor(totalSaved).toLocaleString('uk-UA')} {money?.cur ?? '₴'}
                    </span>
                  </span>
                  
                  {/* 2. Free Time */}
                  <span className="flex items-center gap-0.5 xs:gap-1 shrink-0 text-zinc-200">
                    <Bird className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-zinc-400 shrink-0" />
                    <span className="font-mono font-bold tracking-tighter xs:tracking-tight text-[10px] xs:text-[11px] sm:text-xs whitespace-nowrap">
                      {returnedTimeData.timeText}
                    </span>
                  </span>
                  
                  {/* 3. Cigarettes Avoided */}
                  <span className="flex items-center gap-0.5 xs:gap-1 shrink-0 text-zinc-200">
                    <Cigarette className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-zinc-400 shrink-0" />
                    <span className="font-mono font-bold tracking-tighter xs:tracking-tight text-[10px] xs:text-[11px] sm:text-xs whitespace-nowrap">
                      {Math.floor(cigsAvoided).toLocaleString('uk-UA')} шт
                    </span>
                  </span>
                  
                  {/* 4. Trees */}
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTreeTipOpen(true);
                    }}
                    className="flex items-center gap-0.5 xs:gap-1 shrink-0 cursor-pointer hover:bg-zinc-800/60 px-0.5 xs:px-1 py-0.5 rounded-md transition-colors text-zinc-200"
                    title="Врятовані дерева"
                  >
                    <TreePine className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-zinc-400 shrink-0" />
                    <span className="font-mono font-bold tracking-tighter xs:tracking-tight text-[10px] xs:text-[11px] sm:text-xs whitespace-nowrap">
                      ~{(cigsAvoided / 300).toFixed(1)}
                    </span>
                  </span>
                </div>

                <div className="text-zinc-500 hover:text-zinc-300 shrink-0 flex items-center pl-0.5 xs:pl-1">
                  <ChevronDown 
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      isSavedStatsExpanded ? 'rotate-180 text-zinc-300' : 'rotate-0 text-zinc-500'
                    }`} 
                  />
                </div>
              </div>

            {/* Детальна інформація при розгортанні */}
            {!isStatsMinimized && (
              <div 
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isSavedStatsExpanded 
                    ? 'grid-rows-[1fr] opacity-100 pointer-events-auto' 
                    : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                }`}
              >
                <div className="overflow-hidden">
                  <div 
                    className={`pt-3 space-y-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isSavedStatsExpanded 
                        ? 'transform translate-y-0 opacity-100' 
                        : 'transform -translate-y-2.5 opacity-0'
                    }`}
                  >
                  {/* 3 детальні картки-показники */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
                    {/* 1. Заощаджено */}
                    <div
                      className="flex flex-col justify-between p-2.5 sm:p-3 bg-[#18181f]/90 border border-zinc-800/80 rounded-xl select-none overflow-hidden shadow-xs"
                    >
                      <div className="flex items-center gap-1.5 w-full mb-1 min-w-0">
                        <Wallet className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400 truncate">
                          Заощаджено
                        </span>
                      </div>
                      <div className="my-0.5 sm:my-1 w-full">
                        <div className="text-xs xs:text-sm sm:text-base font-bold font-mono tracking-tight text-zinc-100 flex items-baseline gap-1 truncate">
                          <span>{Math.floor(totalSaved).toLocaleString('uk-UA')}</span>
                          <span className="text-zinc-400 text-[10px] sm:text-xs">{money?.cur ?? '₴'}</span>
                        </div>
                      </div>
                      <div className="pt-1.5 border-t border-zinc-800 w-full flex items-center justify-between text-[10px] text-zinc-500">
                        <span className="truncate font-mono font-normal" title={`Денна норма збереження: +${costPerDay.toFixed(0)} ₴/день`}>
                          +{costPerDay > 0 ? costPerDay.toFixed(0) : '0'} {money?.cur ?? '₴'}/д
                        </span>
                      </div>
                    </div>

                    {/* 2. Вільний час */}
                    <div
                      className="flex flex-col justify-between p-2.5 sm:p-3 bg-[#18181f]/90 border border-zinc-800/80 rounded-xl select-none overflow-hidden shadow-xs"
                    >
                      <div className="flex items-center gap-1.5 w-full mb-1 min-w-0">
                        <Bird className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400 truncate">
                          Вільний час
                        </span>
                      </div>
                      <div className="my-0.5 sm:my-1 w-full">
                        <div className="text-xs xs:text-sm sm:text-base font-bold font-mono tracking-tight text-zinc-100 truncate" title={returnedTimeData.timeText}>
                          {returnedTimeData.timeText}
                        </div>
                      </div>
                      <div className="pt-1.5 border-t border-zinc-800 w-full flex items-center justify-between text-[10px] text-zinc-500">
                        <span className="truncate font-mono font-normal" title={`Повернений час на день: +${curPerDay * (money?.minutesPerCig ?? 7)} хв`}>
                          +{(curPerDay * (money?.minutesPerCig ?? 7))} хв/д
                        </span>
                      </div>
                    </div>

                    {/* 3. Не викурено */}
                    <div
                      className="flex flex-col justify-between p-2.5 sm:p-3 bg-[#18181f]/90 border border-zinc-800/80 rounded-xl select-none overflow-hidden shadow-xs"
                    >
                      <div className="flex items-center gap-1.5 w-full mb-1 min-w-0">
                        <Cigarette className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400 truncate">
                          Не викурено
                        </span>
                      </div>
                      <div className="my-0.5 sm:my-1 w-full">
                        <div className="text-xs xs:text-sm sm:text-base font-bold font-mono tracking-tight text-zinc-100 flex items-baseline gap-1 truncate">
                          <span>{Math.floor(cigsAvoided).toLocaleString('uk-UA')}</span>
                          <span className="text-zinc-400 text-[10px] sm:text-xs">шт</span>
                        </div>
                      </div>
                      <div className="pt-1.5 border-t border-zinc-800 w-full flex items-center justify-between text-[10px] text-zinc-500">
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsTreeTipOpen(true);
                          }}
                          className="truncate font-mono flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer" 
                          title="300 не викурених сигарет = 1 збережене дерево"
                        >
                          <TreePine className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span>~{(cigsAvoided / 300).toFixed(1)} д</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Розширена статистика та чеклист цілей */}
                  <ExpandedSavedResourcesStats
                    totalSaved={totalSaved}
                    cigsAvoided={cigsAvoided}
                    diffMs={diffMs}
                    startDate={startDate}
                    streaks={streaks}
                    longestStreakMs={longestStreakMs}
                    money={money}
                    goals={goals}
                    onOpenGoalsModal={() => setIsGoalModalOpen(true)}
                    onOpenTreeTip={() => setIsTreeTipOpen(true)}
                    onOpenSetup={onOpenSetup}
                    onOpenRelapse={onOpenRelapse}
                    onUndoLastRelapse={onUndoLastRelapse}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>

      {/* 2. БЛОК: ШВИДКИЙ ДОСТУП */}
      {pinnedSections.length > 0 && (
        <div className={`w-full max-w-md mx-auto space-y-2 mb-3.5 px-3 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-[transform,opacity,filter] ${
          introSec2Visible
            ? 'opacity-100 translate-y-0 blur-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 blur-xl pointer-events-none'
        }`}>
          {isPinnedSectionsMinimized ? (
            <div 
              onClick={() => {
                setIsPinnedSectionsMinimized(false);
                try { localStorage.setItem('quit-smoking:pinned-sections-minimized', 'false'); } catch {}
              }}
              className="py-0.5 pl-[18px] pr-1 flex items-center justify-start cursor-pointer group/min w-fit"
              title="Розгорнути швидкий доступ"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPinnedSectionsMinimized(false);
                  try { localStorage.setItem('quit-smoking:pinned-sections-minimized', 'false'); } catch {}
                }}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all active:scale-90 cursor-pointer flex items-center justify-center shrink-0"
                title="Розгорнути швидкий доступ"
              >
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover/min:text-zinc-100 transition-colors animate-section-chevron section-delay-1" />
              </button>
              <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 ml-1 group-hover/min:text-zinc-100 transition-colors animate-section-header-text section-delay-1">
                Швидкий доступ
              </span>
            </div>
          ) : (
            <>
              <div className="pl-[18px] pr-1 flex items-center justify-between gap-1 flex-wrap">
                <div 
                  onClick={() => {
                    setIsPinnedSectionsMinimized(true);
                    try { localStorage.setItem('quit-smoking:pinned-sections-minimized', 'true'); } catch {}
                  }}
                  className="flex items-center gap-2 cursor-pointer group/exp w-fit"
                  title="Згорнути швидкий доступ"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPinnedSectionsMinimized(true);
                      try { localStorage.setItem('quit-smoking:pinned-sections-minimized', 'true'); } catch {}
                    }}
                    className="text-zinc-400 hover:text-zinc-200 shrink-0 flex items-center justify-center p-1 rounded-full hover:bg-zinc-800/60 transition-colors cursor-pointer active:scale-90"
                    title="Згорнути швидкий доступ"
                  >
                    <ChevronLeft className="w-4 h-4 text-zinc-400 group-hover/exp:text-zinc-100 transition-transform animate-section-chevron section-delay-1" />
                  </button>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 group-hover/exp:text-zinc-100 transition-colors animate-section-header-text section-delay-1">
                    Швидкий доступ
                  </span>
                </div>

                {/* Перемикач режимів перегляду: всі варіанти в одній кнопці зі свайпом/перетягуванням */}
                <QuickAccessViewSwitcher
                  mode={quickAccessViewMode}
                  onChange={handleSetQuickAccessViewMode}
                />
              </div>

              {/* Плитковий вигляд (тільки клікабельні піктограми без кіл навколо) */}
              {quickAccessViewMode !== 'list' ? (
                <div
                  className={`pt-1 ${
                    quickAccessViewMode === 'large'
                      ? 'grid grid-cols-3 sm:grid-cols-4 gap-2.5'
                      : quickAccessViewMode === 'medium'
                      ? 'grid grid-cols-4 sm:grid-cols-5 gap-2'
                      : 'grid grid-cols-5 sm:grid-cols-6 gap-1.5'
                  }`}
                >
                  {pinnedSections.map((secKey) => {
                    const visual = getSectionVisual(secKey);
                    const tileTitle = customTileNames[secKey] || visual.title;

                    return (
                      <div
                        key={secKey}
                        onTouchStart={() => handleStartTilePress(secKey)}
                        onTouchEnd={handleEndTilePress}
                        onTouchMove={handleEndTilePress}
                        onMouseDown={() => handleStartTilePress(secKey)}
                        onMouseUp={handleEndTilePress}
                        onMouseLeave={handleEndTilePress}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleOpenRenameTile(secKey);
                        }}
                        onClick={(e) => {
                          if (isLongPressActiveRef.current) {
                            e.preventDefault();
                            e.stopPropagation();
                            isLongPressActiveRef.current = false;
                            return;
                          }
                          handleTileClick(secKey);
                        }}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative cursor-pointer group transition-all duration-200 active:scale-95 select-none bg-[#18181f]/90 border border-zinc-800/80 hover:border-zinc-700 hover:bg-[#1f1f27] shadow-xs ${
                          quickAccessViewMode === 'large'
                            ? 'p-2'
                            : quickAccessViewMode === 'medium'
                            ? 'p-1.5'
                            : 'p-1'
                        }`}
                        title={`${tileTitle} (затисніть для перейменування)`}
                      >
                        <div
                          className={`rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 group-hover:text-zinc-100 group-hover:border-zinc-600 ${
                            quickAccessViewMode === 'large'
                              ? 'w-10 h-10 sm:w-11 sm:h-11'
                              : quickAccessViewMode === 'medium'
                              ? 'w-8 h-8 sm:w-9 sm:h-9'
                              : 'w-7 h-7 sm:w-7.5 sm:h-7.5'
                          }`}
                        >
                          {visual.icon(
                            quickAccessViewMode === 'large'
                              ? 'w-5 h-5 sm:w-5.5 sm:h-5.5'
                              : quickAccessViewMode === 'medium'
                              ? 'w-4 h-4 sm:w-4.5 sm:h-4.5'
                              : 'w-3.5 h-3.5'
                          )}
                        </div>

                        <span className="text-[9.5px] font-bold text-center text-zinc-300 truncate w-full mt-1.5 px-0.5 leading-tight group-hover:text-white transition-colors">
                          {tileTitle}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Список (розгорнутий вигляд) */
                pinnedSections.map((secKey) => {
                  const visual = getSectionVisual(secKey);
                  const tileTitle = customTileNames[secKey] || visual.title;
                  return (
                    <div 
                      key={secKey}
                      onTouchStart={() => handleStartTilePress(secKey)}
                      onTouchEnd={handleEndTilePress}
                      onTouchMove={handleEndTilePress}
                      onMouseDown={() => handleStartTilePress(secKey)}
                      onMouseUp={handleEndTilePress}
                      onMouseLeave={handleEndTilePress}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleOpenRenameTile(secKey);
                      }}
                      onClick={(e) => {
                        if (isLongPressActiveRef.current) {
                          e.preventDefault();
                          e.stopPropagation();
                          isLongPressActiveRef.current = false;
                          return;
                        }
                        handleTileClick(secKey);
                      }}
                      className="p-3.5 bg-[#18181f]/90 border border-zinc-800/80 hover:border-zinc-700 hover:bg-[#1f1f27] rounded-2xl shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] group"
                      title="Натисніть, щоб відкрити. Затисніть для перейменування"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 flex items-center justify-center shrink-0 group-hover:border-zinc-600 group-hover:text-zinc-100 transition-colors">
                          {visual.icon('w-4 h-4 sm:w-4.5 sm:h-4.5')}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-zinc-100 truncate group-hover:text-white transition-colors">
                            {tileTitle}
                          </div>
                          <div className="text-[10px] text-zinc-400 truncate">
                            {visual.desc}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenRenameTile(secKey);
                          }}
                          className="p-1.5 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors cursor-pointer shrink-0 relative z-10"
                          title="Перейменувати плитку"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnpinSection(secKey);
                          }}
                          className="p-1.5 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-zinc-800/60 transition-colors cursor-pointer shrink-0 relative z-10"
                          title="Прибрати з Головної"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      )}

      {/* 3. БЛОК: ЦІЛІ */}
      {(!isQuickGoalDocked || !isGoalsDocked) && (
        <div className={`w-full max-w-md mx-auto mb-3 px-3 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-[transform,opacity,filter] ${
          introSec3Visible
            ? 'opacity-100 translate-y-0 blur-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 blur-xl pointer-events-none'
        }`}>
          {isGoalsSectionCollapsed ? (
            <div 
              onClick={() => {
                setIsGoalsSectionCollapsed(false);
                try { localStorage.setItem('quit-smoking:goals-section-collapsed', 'false'); } catch {}
              }}
              className="py-0.5 pl-[18px] pr-1 flex items-center justify-start cursor-pointer group/min w-fit"
              title="Розгорнути Цілі"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsGoalsSectionCollapsed(false);
                  try { localStorage.setItem('quit-smoking:goals-section-collapsed', 'false'); } catch {}
                }}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all active:scale-90 cursor-pointer flex items-center justify-center shrink-0"
                title="Розгорнути Цілі"
              >
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover/min:text-zinc-100 transition-colors animate-section-chevron section-delay-2" />
              </button>
              <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 ml-1 group-hover/min:text-zinc-100 transition-colors animate-section-header-text section-delay-2">
                Цілі
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="pl-[18px] pr-1 flex items-center justify-between">
                <div 
                  onClick={() => {
                    setIsGoalsSectionCollapsed(true);
                    try { localStorage.setItem('quit-smoking:goals-section-collapsed', 'true'); } catch {}
                  }}
                  className="flex items-center gap-2 cursor-pointer group/exp w-fit"
                  title="Згорнути Цілі"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsGoalsSectionCollapsed(true);
                      try { localStorage.setItem('quit-smoking:goals-section-collapsed', 'true'); } catch {}
                    }}
                    className="text-zinc-400 hover:text-zinc-200 shrink-0 flex items-center justify-center p-1 rounded-full hover:bg-zinc-800/60 transition-colors cursor-pointer active:scale-90"
                    title="Згорнути Цілі"
                  >
                    <ChevronLeft className="w-4 h-4 text-zinc-400 group-hover/exp:text-zinc-100 transition-transform animate-section-chevron section-delay-2" />
                  </button>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 group-hover/exp:text-zinc-100 transition-colors animate-section-header-text section-delay-2">
                    Цілі
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {!isQuickGoalDocked && (
                  <CardErrorBoundary cardName="Швидка ціль">
                    <QuickGoalCard accent={accent} startDate={startDate} isDocked={isQuickGoalDocked} />
                  </CardErrorBoundary>
                )}
                {!isGoalsDocked && (
                  <CardErrorBoundary cardName="Ціль">
                    <GoalsSection
                      goals={goals}
                      totalSaved={totalSaved}
                      setIsGoalsDocked={setIsGoalsDocked}
                      setIsGoalModalOpen={setIsGoalModalOpen}
                      money={money}
                      quickGoalNow={quickGoalNow}
                    />
                  </CardErrorBoundary>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. БЛОК: ВІДНОВЛЕННЯ ТА ВООЗ */}
      {(!isBioPinned || !isWhoPinned) && (
        <div className={`w-full max-w-md mx-auto mb-3 px-3 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-[transform,opacity,filter] ${
          introSec4Visible
            ? 'opacity-100 translate-y-0 blur-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 blur-xl pointer-events-none'
        }`}>
          <CardErrorBoundary cardName="Регенерація та Рубежі ВООЗ">
            <RecoveryPictogramsBlock
              diffMs={diffMs}
              onOpenHealthModal={handleHealthClick}
            />
          </CardErrorBoundary>
        </div>
      )}

      {/* 5. БЛОК: ПРОСТІР СПОКОЮ */}
      <div className={`w-full max-w-md mx-auto space-y-2 mb-4 px-3 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-[transform,opacity,filter] ${
        introSec5Visible
          ? 'opacity-100 translate-y-0 blur-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 blur-xl pointer-events-none'
      }`}>
        {isMeditativeSpacesMinimized ? (
          <div 
            onClick={() => {
              setIsMeditativeSpacesMinimized(false);
              try { localStorage.setItem('quit-smoking:meditative-spaces-minimized', 'false'); } catch {}
            }}
            className="py-0.5 pl-[18px] pr-1 flex items-center justify-start cursor-pointer group/min w-fit"
            title="Розгорнути простір спокою"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMeditativeSpacesMinimized(false);
                try { localStorage.setItem('quit-smoking:meditative-spaces-minimized', 'false'); } catch {}
              }}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all active:scale-90 cursor-pointer flex items-center justify-center shrink-0"
              title="Розгорнути простір спокою"
            >
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover/min:text-zinc-100 transition-colors animate-section-chevron section-delay-4" />
            </button>
            <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 ml-1 group-hover/min:text-zinc-100 transition-colors animate-section-header-text section-delay-4">
              Простір спокою
            </span>
          </div>
        ) : (
          <>
            <div className="pl-[18px] pr-1 flex items-center justify-between">
              <div 
                onClick={() => {
                  setIsMeditativeSpacesMinimized(true);
                  try { localStorage.setItem('quit-smoking:meditative-spaces-minimized', 'true'); } catch {}
                }}
                className="flex items-center gap-2 cursor-pointer group/exp w-fit"
                title="Згорнути простір спокою"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMeditativeSpacesMinimized(true);
                    try { localStorage.setItem('quit-smoking:meditative-spaces-minimized', 'true'); } catch {}
                  }}
                  className="text-zinc-400 hover:text-zinc-200 shrink-0 flex items-center justify-center p-1 rounded-full hover:bg-zinc-800/60 transition-colors cursor-pointer active:scale-90"
                  title="Згорнути простір спокою"
                >
                  <ChevronLeft className="w-4 h-4 text-zinc-400 group-hover/exp:text-zinc-100 transition-transform animate-section-chevron section-delay-4" />
                </button>
                <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 group-hover/exp:text-zinc-100 transition-colors animate-section-header-text section-delay-4">
                  Простір спокою
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {gamesList.map((game, index) => {
                const playtime = gamePlaytimes[game.id] || 0;

                const getPopularityBadge = (idx: number) => {
                  if (idx === 0) {
                    return (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-200 select-none">
                        Топ 1
                      </span>
                    );
                  }
                  if (idx === 1) {
                    return (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 select-none">
                        Топ 2
                      </span>
                    );
                  }
                  if (idx === 2) {
                    return (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 select-none">
                        Топ 3
                      </span>
                    );
                  }
                  return null;
                };

                return (
                  <div 
                    key={game.id}
                    onClick={() => handlePlayGame(game.id)}
                    className="w-full p-3.5 bg-[#18181f]/90 border border-zinc-800/80 hover:border-zinc-700 hover:bg-[#1f1f27] rounded-2xl shadow-xs transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] text-left relative overflow-hidden group cursor-pointer"
                    title="Натисніть, щоб поринути у практику"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-zinc-800/90 border border-zinc-700/60 text-zinc-300 flex items-center justify-center shrink-0">
                          {React.cloneElement(game.icon, {
                            className: "w-4 h-4 select-none opacity-90 group-hover:opacity-100 transition-opacity"
                          })}
                        </div>
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-200">
                          {game.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {getPopularityBadge(index)}
                        <span className="text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">
                          {playtime} хв
                        </span>
                      </div>
                    </div>

                    {/* Description Body */}
                    <div className="relative z-10 space-y-1.5">
                      <p className="text-xs font-medium text-zinc-400 leading-snug">
                        {game.desc}
                      </p>

                      <div className="text-[10px] text-zinc-400 flex items-center gap-1 pt-0.5 font-medium">
                        <Sparkles className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span>Натисніть для входу у медитативний простір</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )}





      {/* Festive Toast Notification when Savings Reach Active Goal */}
      {goalToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-md p-4 bg-[#16161c] text-zinc-100 rounded-3xl shadow-2xl border border-zinc-700 animate-bounce-short flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-2xl shrink-0">
              🎉
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                <span>Ціль накопичено!</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold truncate text-white">
                «{goalToast.goalName}» ({goalToast.amount.toLocaleString('uk-UA')} ₴)
              </h4>
              <p className="text-[10px] text-zinc-400 font-medium leading-tight">
                Вітаємо! Сума вашої цілі повністю заощаджена!
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setGoalToast(null);
                setIsGoalModalOpen(true);
              }}
              className="px-3 py-1.5 bg-zinc-100 text-zinc-900 rounded-xl font-extrabold text-[11px] shadow-sm hover:bg-white cursor-pointer transition-colors"
            >
              Відкрити
            </button>
            <button
              type="button"
              onClick={() => setGoalToast(null)}
              className="p-1 text-zinc-400 hover:text-white cursor-pointer self-center"
              title="Закрити"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <ModalContainer
        modals={modals}
        setIsStepsOpen={setIsStepsOpen}
        isStepsOpen={isStepsOpen}
        isStepsPromptOpen={isStepsPromptOpen}
        setIsStepsPromptOpen={setIsStepsPromptOpen}
        handleUpdate={handleUpdate}
        goals={goals}
        totalSaved={totalSaved}
        money={money}
        onAddGoal={onAddGoal}
        onCompleteGoal={onCompleteGoal}
        onDeleteGoal={onDeleteGoal}
        reasons={reasons}
        onUpdateReasons={onUpdateReasons}
        motivationStyle={motivationStyle}
        handleStyleChange={handleStyleChange}
        autoRotateMotivations={autoRotateMotivations}
        handleAutoRotateChange={handleAutoRotateChange}
        accent={accent}
        onUpdateMoney={onUpdateMoney}
        indicatorStyle={indicatorStyle}
        saveIndicatorStyle={saveIndicatorStyle}
        setIsIndicatorSettingsOpen={setIsIndicatorSettingsOpen}
        isIndicatorSettingsOpen={isIndicatorSettingsOpen}
        analyzerHighlight={analyzerHighlight}
        setAnalyzerHighlight={setAnalyzerHighlight}
        dayRatings={dayRatings}
        toggleModal={toggleModal}
        diffMs={diffMs}
        startDate={startDate}
        cigsAvoided={cigsAvoided}
        longestStreakMs={longestStreakMs}
        streaks={streaks}
        onOpenSetup={onOpenSetup}
        onOpenRelapse={onOpenRelapse}
        onUndoLastRelapse={onUndoLastRelapse}
        onOpenHealthTab={() => onSwitchTab('health')}
        isStepsDocked={isStepsDocked}
        setIsStepsDocked={setIsStepsDocked}
        isMentalHealthDocked={isMentalHealthDocked}
        setIsMentalHealthDocked={setIsMentalHealthDocked}
        isGratitudeDocked={isGratitudeDocked}
        setIsGratitudeDocked={setIsGratitudeDocked}
      />



      {isZenMode && (
        <div
          onClick={() => setIsZenMode(false)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden bg-[#F8FAFC] dark:bg-[#121215]"
          style={{ animation: 'fadeIn 1.2s ease-out forwards' }}
          aria-label="Режим дзен"
        >
          {/* Реалістична ніжна мерехтлива зірка у центрі */}
          <div className="relative flex items-center justify-center pointer-events-none">
            {/* Тонкі дифракційні промені світла (притаманні справжнім зорям) */}
            <div className="absolute w-36 h-36 flex items-center justify-center zen-star-diffraction pointer-events-none">
              <div className="absolute w-full h-[0.75px] bg-gradient-to-r from-transparent via-sky-300/40 to-transparent blur-[0.3px]" />
              <div className="absolute h-full w-[0.75px] bg-gradient-to-b from-transparent via-purple-300/40 to-transparent blur-[0.3px]" />
              <div className="absolute w-2/3 h-[0.5px] rotate-45 bg-gradient-to-r from-transparent via-rose-300/25 to-transparent blur-[0.3px]" />
              <div className="absolute w-2/3 h-[0.5px] -rotate-45 bg-gradient-to-r from-transparent via-blue-300/25 to-transparent blur-[0.3px]" />
            </div>

            {/* М'яка розсіяна хроматична аура */}
            <div className="w-24 h-24 rounded-full blur-2xl opacity-40 zen-star-halo bg-radial from-violet-400/30 via-sky-400/20 to-transparent pointer-events-none" />

            {/* Крихітне, яскраве, живе ядро зірки (2.5px), що плавно дихає крізь спектр */}
            <div className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full zen-star-pinpoint" />
          </div>
        </div>
      )}



      {/* Timer Interaction Info Modal */}
      {isTimerInfoOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="bg-[#16161c] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-zinc-800 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-white">Керування таймером</h3>
              <button 
                onClick={() => setIsTimerInfoOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-800 border border-zinc-700/60 rounded-xl text-zinc-300">
                  <MousePointer2 className="w-5 h-5 text-zinc-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-zinc-200">Подвійний клік</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">Миттєво приховує таймер. Повернути його можна кнопкою «Показати таймер».</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-800 border border-zinc-700/60 rounded-xl text-zinc-300">
                  <MousePointer2 className="w-5 h-5 text-zinc-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-zinc-200">Один клік</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">Вмикає режим зміни стилю (з'явиться зелена рамка). Клікніть ще раз, щоб вийти.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-800 border border-zinc-700/60 rounded-xl text-zinc-300">
                  <ChevronRightIcon className="w-5 h-5 text-zinc-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-zinc-200">Свайп (у режимі зміни)</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">Гортайте вліво або вправо по таймеру, щоб швидко перемикати стилі.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsTimerInfoOpen(false)}
              className="w-full mt-6 py-2.5 bg-zinc-100 text-zinc-900 rounded-xl font-bold hover:bg-white active:scale-95 transition-all text-xs cursor-pointer"
            >
              Зрозуміло
            </button>
          </div>
        </div>
      )}

      {/* Saved Trees Ecological Tip Modal */}
      {isTreeTipOpen && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsTreeTipOpen(false)}
        >
          <div 
            className="bg-[#16161c] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-zinc-800 animate-in zoom-in-95 duration-300 text-left relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-zinc-800 border border-zinc-700/60 text-zinc-300 rounded-xl">
                  <TreePine className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Врятовані дерева</h3>
                  <p className="text-xs text-zinc-400 font-medium">Екологічний факт</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsTreeTipOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3.5 relative z-10 text-xs text-zinc-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200">
                <p className="font-bold text-zinc-100 mb-1 flex items-center gap-1.5">
                  <span>🌲 300 цигарок ≈ 1 дерево</span>
                </p>
                <p className="text-xs text-zinc-400 leading-normal">
                  На виготовлення приблизно <strong>300 цигарок</strong> (сушіння тютюнового листя деревиною та виробництво паперу для гільз і пачок) витрачається близько <strong>1 дерева</strong>.
                </p>
              </div>

              <p className="text-xs text-zinc-400 leading-normal">
                Тож коли ми не куримо, ми безпосередньо рятуємо живі дерева та зберігаємо зелені ліси нашої планети.
              </p>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">Ваш екологічний внесок:</span>
                <span className="text-sm font-bold font-mono text-zinc-100">
                  ~{(cigsAvoided / 300).toFixed(1)} {((cigsAvoided / 300) >= 1 && (cigsAvoided / 300) < 5) ? 'дерева' : 'дерев'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsTreeTipOpen(false)}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-white active:scale-[0.98] text-zinc-900 font-bold text-xs transition-all shadow-md cursor-pointer text-center"
              >
                Дякую, зрозуміло! 🌿
              </button>
            </div>
          </div>
        </div>
      )}

      {(() => {
        if (isZenMode || isMeditationOpen) return null;
        if (
          isAnalyzerModalOpen ||
          isGoalModalOpen ||
          isCoffeeBreakfastModalOpen ||
          isMotivationsModalOpen ||
          isStateChartModalOpen ||
          isGratitudeModalOpen ||
          isDailyStepsModalOpen
        ) return null;

        const showStatsSection = true;
        const showGoalsSection = !isQuickGoalDocked || !isGoalsDocked;
        const showRecoverySection = !isBioPinned || !isWhoPinned;
        const showPinnedSection = pinnedSections.length > 0;
        const showSpacesSection = true;

        const allActiveSectionsAreCollapsed = 
          (!showStatsSection || isStatsMinimized) &&
          (!showGoalsSection || isGoalsSectionCollapsed) &&
          (!showRecoverySection || isRecoveryCollapsed) &&
          (!showPinnedSection || isPinnedSectionsMinimized) &&
          (!showSpacesSection || isMeditativeSpacesMinimized);

        const handleYinYangPressStart = () => {
          if (isEverythingHidden) return;
          isLongPressRef.current = false;
          if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = setTimeout(() => {
            isLongPressRef.current = true;
            if (onOpenAnalyzerModal) {
              onOpenAnalyzerModal();
            } else if (typeof setIsAnalyzerModalOpen === 'function') {
              setIsAnalyzerModalOpen(true);
            }
          }, 480);
        };

        const handleYinYangPressEnd = () => {
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
        };

        const handleYinYangClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (isLongPressRef.current) {
            isLongPressRef.current = false;
            return;
          }
          const nextVal = !isEverythingHidden;
          setIsEverythingHidden(nextVal);
          try {
            localStorage.setItem('quit-smoking:everything-hidden', String(nextVal));
            window.dispatchEvent(new CustomEvent('eden-harmony-mode-change', { detail: nextVal }));
            window.dispatchEvent(new Event('storage'));
          } catch {}
        };

        return (
          <>
            {/* Eden / YinYang Calligraphy Pen Canvas */}
            <EdenPenCanvas isActive={isEverythingHidden} onExit={handleExitYinYang} />
          </>
        );
      })()}

      {flyingStars.map(fs => {
        const currentX = fs.startX + (fs.targetX - fs.startX) * fs.progress;
        const currentY = fs.startY + (fs.targetY - fs.startY) * fs.progress;
        return (
          <div
            key={fs.id}
            className="fixed z-[100] pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: currentX, top: currentY }}
          >
            <div className="w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,1)] animate-ping" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,1)]" />
          </div>
        );
      })}

      {/* Portal-rendered Tile Rename Dialog (always correctly centered & never clipped) */}
      {editingTileKey && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-fadeIn"
          onClick={() => setEditingTileKey(null)}
        >
          <div 
            className="bg-zinc-950/95 border border-zinc-700/80 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-zinc-100 transform transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setEditingTileKey(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Закрити"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Tile Visual & Header */}
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700/70 text-zinc-200 flex items-center justify-center mb-3 shadow-inner">
                {getSectionVisual(editingTileKey).icon('w-6 h-6')}
              </div>
              <h3 className="text-base font-bold text-white">
                Перейменувати плитку
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Введіть новий підпис для плитки у «Швидкому доступі»
              </p>
            </div>

            {/* Input field */}
            <div className="space-y-2 mb-4">
              <input
                type="text"
                value={editingTileNameInput}
                onChange={(e) => setEditingTileNameInput(e.target.value)}
                placeholder={getSectionVisual(editingTileKey).title}
                className="w-full px-4 py-2.5 bg-zinc-900/90 border border-zinc-700 rounded-xl text-sm font-semibold text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTileName();
                  if (e.key === 'Escape') setEditingTileKey(null);
                }}
              />

              {/* Reset to default link */}
              {customTileNames[editingTileKey] && (
                <button
                  type="button"
                  onClick={() => {
                    const visual = getSectionVisual(editingTileKey);
                    setEditingTileNameInput(visual.title);
                  }}
                  className="text-[11px] text-zinc-400 hover:text-zinc-200 hover:underline cursor-pointer transition-colors block text-left"
                >
                  Скинути до стандартної назви ({getSectionVisual(editingTileKey).title})
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setEditingTileKey(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Скасувати
              </button>
              <button
                type="button"
                onClick={handleSaveTileName}
                className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Зберегти
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export const CounterTab = React.memo(CounterTabComponent);
