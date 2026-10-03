import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Streak, GoalsState, MoneySettings, PriceTier, DayRating, SavingsGoal } from '../types';
import {
  Calendar,
  RefreshCw,
  Target,
  Check,
  Trash2,
  Plus,
  Minus,
  Trophy,
  Calculator,
  History,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Info,
  Heart,
  HeartPulse,
  ChevronRight,
  Award,
  ShoppingBag,
  Download,
  Upload,
  Sparkles,
  Smile,
  FileText,
  Coffee,
  ExternalLink,
  Palette,
  Activity,
  Cpu,
  Clock,
  Brain,
  BookOpen,
  Sun,
  Moon,
  Laptop,
  Layout,
  Scroll,
  Leaf,
  Flame,
  Zap,
  Snowflake,
  Flower2,
  Waves,
  Wind,
  Coins,
  SlidersHorizontal,
  Pin,
  X,
  Maximize,
  Minimize,
  Play,
  CheckCircle2
} from 'lucide-react';

import { RefractedPrismShieldIcon } from './CounterTab/RefractedStatusIcons';
import { 
  MonoRefractedWalletIcon,
  MonoRefractedBirdIcon,
  MonoRefractedCigaretteIcon,
  MonoRefractedTreeIcon,
  MonoRefractedCoinsIcon,
  MonoRefractedBagIcon,
  MonoRefractedAwardIcon,
  MonoRefractedCalendarIcon,
  MonoRefractedRefreshIcon,
  MonoRefractedTrendingUpIcon,
  MonoRefractedShieldIcon,
  MonoRefractedFlameIcon,
  MonoRefractedDropIcon,
  MonoRefractedHeartIcon,
  MonoRefractedZapIcon,
  MonoRefractedGiftIcon,
  MonoRefractedSlidersIcon,
  MonoRefractedCoffeeIcon,
  MonoRefractedBookIcon,
  MonoRefractedFilmIcon,
  MonoRefractedPizzaIcon
} from './CounterTab/MonoRefractedStatsIcons';
import {
  MonoRefractedBookOpenIcon,
  MonoRefractedHistoryIcon,
  MonoRefractedPhoneIcon
} from './MonoRefractedSosIcons';
import {
  RefractedPrismCheckIcon,
  RefractedPrismBrainIcon,
  RefractedPrismStarIcon,
  RefractedPrismYinYangIcon
} from './CounterTab/RefractedStatusIcons';

import { HEALTH_MILESTONES, getBodySystemsRecovery } from '../data/healthData';
import { HealthTab } from './HealthTab';
import { TIMER_STYLES, getTimerStyleCssClass } from './CounterTab/TimerStyles';
import { TimerSkinModal } from './CounterTab/TimerSkinModal';
import { GratitudeJournalCard } from './GratitudeJournalCard';
import { DailyStepsSection } from './DailyStepsSection';
import { QuickGoalCard } from './QuickGoalCard';
const getSectionRefractedPictogram = (key: string, cls: string = 'w-5 h-5') => {
  switch (key) {
    case 'who_progress': return <MonoRefractedHeartIcon className={cls} />;
    case 'goals': return <MonoRefractedGiftIcon className={cls} />;
    case 'calc': return <MonoRefractedCoinsIcon className={cls} />;
    case 'presets': return <MonoRefractedBagIcon className={cls} />;
    case 'themes': return <MonoRefractedSlidersIcon className={cls} />;
    case 'timer_skins': return <MonoRefractedCalendarIcon className={cls} />;
    case 'theme': return <MonoRefractedSlidersIcon className={cls} />;
    case 'frameless_style': return <RefractedPrismStarIcon className={cls} />;
    case 'gratitude_journal': return <MonoRefractedHeartIcon className={cls} />;
    case 'daily_steps': return <RefractedPrismCheckIcon className={cls} />;
    case 'mental_health': return <RefractedPrismBrainIcon className={cls} />;
    case 'notes': return <MonoRefractedBookIcon className={cls} />;
    case 'analyzer_thoughts_db': return <MonoRefractedBookOpenIcon className={cls} />;
    case 'backup': return <MonoRefractedShieldIcon className={cls} />;
    case 'perf_optimization': return <MonoRefractedZapIcon className={cls} />;
    case 'cache_cleanup': return <MonoRefractedFlameIcon className={cls} />;
    case 'monitor': return <MonoRefractedTrendingUpIcon className={cls} />;
    case 'developer': return <MonoRefractedSlidersIcon className={cls} />;
    default: return <RefractedPrismStarIcon className={cls} />;
  }
};
import { MentalHealthCard } from './MentalHealthCard';
import { AnalyzerThoughtsDatabase } from './AnalyzerThoughtsDatabase';
import { restoreAllWindowsToFeed, verifyAndRepairDataIntegrity } from '../utils/cardStorageSafety';
import { ShieldCheck, RotateCcw, Save, Database } from 'lucide-react';
import { SystemResourceMonitor } from './SystemResourceMonitor';
import { PerformanceOptimizationSection } from './PerformanceOptimizationSection';
import { CacheCleanupSection } from './CacheCleanupSection';

export interface MoreTabProps {
  reasons: string[];
  streaks: Streak[];
  currentStart: number;
  totalFreeMs: number;
  longestStreakMs: number;
  goals: GoalsState;
  totalSaved: number;
  cigsAvoided: number;
  money: MoneySettings | null;
  days?: Record<string, DayRating>;
  promptIntervalMinutes?: number;
  currentAccent?: string;
  onUpdateAccent?: (accent: string) => void;
  appTheme?: string;
  onUpdateAppTheme?: (theme: string) => void;
  analyzerStyle?: 'standard' | 'autumn' | 'fire' | 'snowflake' | 'flower' | 'wave' | 'cat' | 'cosmic_ring';
  onUpdateAnalyzerStyle?: (style: 'standard' | 'autumn' | 'fire' | 'snowflake' | 'flower' | 'wave' | 'cat' | 'cosmic_ring') => void;
  onUpdatePromptInterval?: (minutes: number) => void;
  onUpdateMoney: (newMoney: MoneySettings) => void;
  onAddGoal: (name: string, amount?: number, targetDate?: string) => void;
  onCompleteGoal: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
  onAddReason?: (reason: string) => void;
  onDeleteReason?: (index: number) => void;
  onRestoreData?: (backup: any) => void;
  onUndoLastRelapse: () => void;
  onOpenSetup?: () => void;
  onOpenRelapse?: () => void;
  onOpenOnboarding?: () => void;
  indicatorStyle?: string;
  onUpdateIndicatorStyle?: (style: string) => void;
  showTimerHint: boolean;
  onUpdateTimerHint: (val: boolean) => void;
  economyMode: boolean;
  onUpdateEconomyMode: (enabled: boolean) => void;
  overlaySectionKey?: SectionKey | null;
  onCloseOverlay?: () => void;
  windowsOpacity?: number;
  onUpdateWindowsOpacity?: (opacity: number) => void;
}

type SectionKey = 'who_progress' | 'themes' | 'timer_style' | 'timer_skins' | 'analyzer_style' | 'analyzer_thoughts_db' | 'calc' | 'habits' | 'daily_steps' | 'gratitude_journal' | 'mental_health' | 'health_tests' | 'hydration' | 'goals' | 'start' | 'streaks' | 'reasons' | 'badges' | 'equivalents' | 'prompt' | 'theme' | 'frameless_style' | 'backup' | 'perf_optimization' | 'monitor' | 'developer' | 'health' | 'notes' | 'presets' | 'cache_cleanup';

export const MoreTab: React.FC<MoreTabProps> = ({
  reasons,
  streaks,
  currentStart,
  totalFreeMs,
  longestStreakMs,
  goals,
  totalSaved,
  cigsAvoided,
  money,
  days = {},
  promptIntervalMinutes = 30,
  currentAccent = 'green',
  onUpdateAccent,
  appTheme = 'modern',
  onUpdateAppTheme,
  analyzerStyle = 'cosmic_ring',
  onUpdateAnalyzerStyle,
  onUpdatePromptInterval,
  onUpdateMoney,
  onAddGoal,
  onCompleteGoal,
  onDeleteGoal,
  onAddReason,
  onDeleteReason,
  onUndoLastRelapse,
  onOpenSetup,
  onOpenRelapse,
  onOpenOnboarding,
  economyMode,
  onUpdateEconomyMode,
  indicatorStyle,
  onUpdateIndicatorStyle,
  showTimerHint,
  onUpdateTimerHint,
  overlaySectionKey,
  onCloseOverlay,
  windowsOpacity = 100,
  onUpdateWindowsOpacity
}) => {
  // Feedback toast message
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const replayIntro = () => {
    try {
      localStorage.removeItem('quit-smoking:first-run-intro-animated');
      window.location.reload();
    } catch {}
  };
  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:app-theme');
      if (saved) return saved.replace(/"/g, '').trim();
    } catch {}
    return (appTheme || 'eco').replace(/"/g, '').trim();
  });

  useEffect(() => {
    if (appTheme) {
      setSelectedTheme(appTheme.replace(/"/g, '').trim());
    }
  }, [appTheme]);

  const activeAppTheme = (selectedTheme || appTheme || 'eco').replace(/"/g, '').trim();

  const handleSelectAppTheme = (themeId: string, themeName: string, emoji: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const cleanId = themeId.trim();
    setSelectedTheme(cleanId);
    try {
      localStorage.setItem('quit-smoking:app-theme', cleanId);
      window.dispatchEvent(new CustomEvent('app-theme-change', { detail: cleanId }));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    onUpdateAppTheme?.(cleanId);
    showFeedback(`Встановлено тему "${themeName}" ${emoji}`);
  };

  const [pinnedSections, setPinnedSections] = useState<string[]>(() => {
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

  useEffect(() => {
    const handlePinnedChange = () => {
      try {
        const raw = localStorage.getItem('quit-smoking:pinned-more-sections');
        if (raw !== null) {
          setPinnedSections(JSON.parse(raw));
        }
      } catch {}
    };
    window.addEventListener('pinned-more-sections-change', handlePinnedChange);
    window.addEventListener('storage', handlePinnedChange);
    return () => {
      window.removeEventListener('pinned-more-sections-change', handlePinnedChange);
      window.removeEventListener('storage', handlePinnedChange);
    };
  }, []);

  const togglePinSection = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let next: string[];
    if (pinnedSections.includes(key)) {
      next = pinnedSections.filter((k) => k !== key);
      showFeedback('Розділ прибрано з Головної');
    } else {
      next = [...pinnedSections, key];
      showFeedback('Розділ успішно винесено на Головну! ');
    }
    setPinnedSections(next);
    try {
      localStorage.setItem('quit-smoking:pinned-more-sections', JSON.stringify(next));
      window.dispatchEvent(new Event('pinned-more-sections-change'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const renderPinButton = (key: string) => {
    if (isOverlayMode) return null;
    return (
      <button
        type="button"
        onClick={(e) => togglePinSection(key, e)}
        className={`p-1.5 rounded-xl transition-all cursor-pointer ${
          pinnedSections.includes(key)
            ? 'bg-amber-500/20 text-zinc-300 border border-amber-500/40'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-200/20 dark:hover:bg-zinc-800'
        }`}
        title={pinnedSections.includes(key) ? "Прибрати з Головної" : "Винести на Головну"}
      >
        <Pin className="w-3.5 h-3.5" />
      </button>
    );
  };

  // Frameless & Glassmorphism customization
  const [framelessMode, setFramelessMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:frameless-mode');
      return saved !== 'false';
    } catch {
      return true;
    }
  });



  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    return typeof document !== 'undefined' && !!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement || (document as any).msFullscreenElement);
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement || (document as any).msFullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement && !(document as any).mozFullScreenElement && !(document as any).msFullscreenElement) {
        const elem = document.documentElement as any;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          await elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
        showFeedback('Повноекранний режим увімкнено ');
      } else {
        const doc = document as any;
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
        showFeedback('Повноекранний режим вимкнено');
      }
    } catch (e) {
      showFeedback('Не вдалося змінити режим екрана (обмеження браузера)');
    }
  };

  const [cardRadius, setCardRadius] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:card-radius') || '24px';
    } catch {
      return '24px';
    }
  });

  const [isTimerSkinModalOpen, setIsTimerSkinModalOpen] = useState(false);
  const [currentTimerStyle, setCurrentTimerStyle] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:timer-horizon-effect') || 'none';
    } catch {
      return 'none';
    }
  });

  useEffect(() => {
    if (overlaySectionKey === 'timer_skins') {
      setIsTimerSkinModalOpen(true);
    }
  }, [overlaySectionKey]);

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('quit-smoking:timer-horizon-effect');
        if (saved) setCurrentTimerStyle(saved);
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('timer-effect-change', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('timer-effect-change', handleStorage);
    };
  }, []);

  useEffect(() => {
    const handleOpenSectionEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail === 'string') {
        const key = customEvent.detail as SectionKey;
        
        let targetGroup: 'customization' | 'useful_tools' | 'tech_moments' | null = null;
        if (['themes', 'timer_skins', 'theme', 'frameless_style'].includes(key)) {
          targetGroup = 'customization';
        } else if (['calc', 'who_progress', 'gratitude_journal', 'daily_steps', 'mental_health', 'notes', 'analyzer_thoughts_db', 'backup'].includes(key)) {
          targetGroup = 'useful_tools';
        } else if (['perf_optimization', 'monitor', 'developer'].includes(key)) {
          targetGroup = 'tech_moments';
        }

        if (targetGroup) {
          setOpenGroups((prev) => ({ ...prev, [targetGroup]: true }));
        }

        setOpenSectionsState((prev) => {
          const next = { ...prev, [key]: true };
          try {
            localStorage.setItem('quit-smoking:more-sections-state', JSON.stringify(next));
          } catch {}
          return next;
        });

        setTimeout(() => {
          const element = document.getElementById(`more-sec-${key}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      }
    };
    window.addEventListener('open-more-section', handleOpenSectionEvent);
    return () => window.removeEventListener('open-more-section', handleOpenSectionEvent);
  }, []);

  const handleSelectTimerStyle = (style: string) => {
    setCurrentTimerStyle(style);
    try {
      localStorage.setItem('quit-smoking:timer-horizon-effect', style);
      window.dispatchEvent(new Event('timer-effect-change'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    showFeedback('Оболонку таймера оновлено! ');
  };

  const DAY_MS = 24 * 3600 * 1000;
  const HOUR_MS = 3600 * 1000;
  const MIN_MS = 60 * 1000;
  const timerDays = Math.floor(totalFreeMs / DAY_MS);
  const hours = Math.floor((totalFreeMs % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((totalFreeMs % HOUR_MS) / MIN_MS);
  const previewTimeText = `${timerDays} днів ${hours} год ${minutes} хв`;

  const [liquidGlass, setLiquidGlass] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:liquid-glass') === 'true';
    } catch {
      return false;
    }
  });

  // Summer Ocean Theme Custom Time of Day & Audio Controls
  const [summerTimeMode, setSummerTimeMode] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:summer-time-mode') || 'auto';
    } catch {
      return 'auto';
    }
  });

  const [isSummerAudioOn, setIsSummerAudioOn] = useState<boolean>(false);

  const handleSetSummerTimeMode = (mode: string) => {
    setSummerTimeMode(mode);
    try {
      localStorage.setItem('quit-smoking:summer-time-mode', mode);
    } catch {}
    window.dispatchEvent(new CustomEvent('summer-time-change', { detail: { mode } }));
    const modeLabel = mode === 'auto' ? 'Авто (за часом доби) ' : mode === 'morning' ? 'Світанок ' : mode === 'afternoon' ? 'Полудень ' : mode === 'evening' ? 'Захід ' : 'Біо-ніч ';
    showFeedback(`Час доби морської теми: ${modeLabel}`);
  };

  const handleToggleSummerAudio = () => {
    setIsSummerAudioOn((prev) => !prev);
    window.dispatchEvent(new Event('summer-audio-toggle'));
  };

  // Spring Bloom Theme Custom Time of Day & Audio Controls
  const [springTimeMode, setSpringTimeMode] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:spring-time-mode') || 'auto';
    } catch {
      return 'auto';
    }
  });

  const [isSpringAudioOn, setIsSpringAudioOn] = useState<boolean>(false);

  const handleSetSpringTimeMode = (mode: string) => {
    setSpringTimeMode(mode);
    try {
      localStorage.setItem('quit-smoking:spring-time-mode', mode);
    } catch {}
    window.dispatchEvent(new CustomEvent('spring-time-change', { detail: { mode } }));
    const modeLabel = mode === 'auto' ? 'Авто (за годинником) ' : mode === 'dawn' ? 'Світанок ' : mode === 'afternoon' ? 'Полудень ' : mode === 'sunset' ? 'Захід 🪻' : 'Біо-ніч ';
    showFeedback(`Час доби весняної теми: ${modeLabel}`);
  };

  const handleToggleSpringAudio = () => {
    setIsSpringAudioOn((prev) => !prev);
    window.dispatchEvent(new Event('spring-audio-toggle'));
  };

  // Autumn Leaves Theme Custom Time of Day & Audio Controls
  const [autumnTimeMode, setAutumnTimeMode] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:autumn-time-mode') || 'auto';
    } catch {
      return 'auto';
    }
  });

  const [isAutumnAudioOn, setIsAutumnAudioOn] = useState<boolean>(false);

  const handleSetAutumnTimeMode = (mode: string) => {
    setAutumnTimeMode(mode);
    try {
      localStorage.setItem('quit-smoking:autumn-time-mode', mode);
    } catch {}
    window.dispatchEvent(new CustomEvent('autumn-time-change', { detail: { mode } }));
    const modeLabel =
      mode === 'auto'
        ? 'Авто (за часом доби) '
        : mode === 'morning'
        ? 'Золотий ранок '
        : mode === 'afternoon'
        ? 'Бабине літо '
        : mode === 'evening'
        ? 'Багряний захід '
        : 'Камін & Ніч ';
    showFeedback(`Час доби осінньої теми: ${modeLabel}`);
  };

  const handleToggleAutumnAudio = () => {
    setIsAutumnAudioOn((prev) => !prev);
    window.dispatchEvent(new Event('autumn-audio-toggle'));
  };

  // Standard (Stardust & Deep Space) Theme Controls
  const [standardSpaceMode, setStandardSpaceMode] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:standard-space-mode') || 'auto';
    } catch {
      return 'auto';
    }
  });

  const [standardDensity, setStandardDensity] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:standard-density') || 'medium';
    } catch {
      return 'medium';
    }
  });

  const [isStandardAudioOn, setIsStandardAudioOn] = useState<boolean>(false);

  const handleSetStandardSpaceMode = (mode: string) => {
    setStandardSpaceMode(mode);
    try {
      localStorage.setItem('quit-smoking:standard-space-mode', mode);
    } catch {}
    window.dispatchEvent(new CustomEvent('standard-space-change', { detail: { mode } }));
    const modeLabel =
      mode === 'auto'
        ? 'Авто (за часом доби) '
        : mode === 'deep_space'
        ? 'Глибокий космос '
        : mode === 'nebula'
        ? 'Туманність '
        : mode === 'aurora'
        ? 'Полярне сяйво '
        : 'Зорепад ';
    showFeedback(`Космос стандартної теми: ${modeLabel}`);
  };

  const handleSetStandardDensity = (density: string) => {
    setStandardDensity(density);
    try {
      localStorage.setItem('quit-smoking:standard-density', density);
    } catch {}
    window.dispatchEvent(new CustomEvent('standard-density-change', { detail: { density } }));
    const densityLabel = density === 'calm' ? 'Спокійна ' : density === 'rich' ? 'Насичена ' : 'Збалансована ';
    showFeedback(`Щільність зір: ${densityLabel}`);
  };

  const [meteorIntensity, setMeteorIntensity] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:meteor-intensity');
      if (saved) return parseFloat(saved) || 3.5;
    } catch {}
    return 3.5;
  });

  const [starCountSlider, setStarCountSlider] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:star-count');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 15; // default to minimum
  });

  const handleSetStarCountSlider = (val: number) => {
    setStarCountSlider(val);
    try {
      localStorage.setItem('quit-smoking:star-count', String(val));
    } catch {}
    window.dispatchEvent(new CustomEvent('star-count-change', { detail: { count: val } }));
  };

  const handleSetMeteorIntensity = (val: number) => {
    setMeteorIntensity(val);
    try {
      localStorage.setItem('quit-smoking:meteor-intensity', String(val));
    } catch {}
    window.dispatchEvent(new CustomEvent('meteor-intensity-change', { detail: { intensity: val } }));
  };

  const handleToggleStandardAudio = () => {
    setIsStandardAudioOn((prev) => !prev);
    window.dispatchEvent(new Event('standard-audio-toggle'));
  };

  const handleToggleFrameless = (enabled: boolean) => {
    setFramelessMode(enabled);
    try {
      localStorage.setItem('quit-smoking:frameless-mode', String(enabled));
      document.documentElement.setAttribute('data-frameless', String(enabled));
    } catch {}
    showFeedback(enabled ? 'Режим без рамок увімкнено ' : 'Стандартні рамки відновлено ');
  };

  const handleSelectRadius = (radius: string) => {
    setCardRadius(radius);
    try {
      localStorage.setItem('quit-smoking:card-radius', radius);
      document.documentElement.setAttribute('data-radius', radius);
    } catch {}
    showFeedback('Закруглення кутів оновлено! ');
  };

  const handleToggleGlass = (enabled: boolean) => {
    setLiquidGlass(enabled);
    try {
      localStorage.setItem('quit-smoking:liquid-glass', String(enabled));
      document.documentElement.setAttribute('data-glass', String(enabled));
    } catch {}
    showFeedback(enabled ? 'Ефект «Легке рідке скло» увімкнено ' : 'Класичне матове скло відновлено ');
  };

  // Performance Boost mode state
  const [perfBoost, setPerfBoost] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:perf-boost') === 'true';
    } catch {
      return false;
    }
  });

  const handleTogglePerfBoost = (enabled: boolean) => {
    setPerfBoost(enabled);
    try {
      localStorage.setItem('quit-smoking:perf-boost', String(enabled));
      document.documentElement.setAttribute('data-perf-boost', String(enabled));
      window.dispatchEvent(new Event('perf-boost-change'));
    } catch {}
    showFeedback(enabled ? 'Режим збільшення продуктивності увімкнено (анімації та важкі фони вимкнено) ' : 'Стандартний візуальний режим відновлено ');
  };

  // Timer Effect Mode state
  const [timerEffectMode, setTimerEffectMode] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:timer-horizon-effect') || 'classic';
    } catch {
      return 'classic';
    }
  });

  const [disabledTimerStyles, setDisabledTimerStyles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:disabled-timer-styles');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const handleDeleteTimerStyle = (styleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = [...disabledTimerStyles, styleId];
    setDisabledTimerStyles(updated);
    try {
      localStorage.setItem('quit-smoking:disabled-timer-styles', JSON.stringify(updated));
    } catch {}
    if (timerEffectMode === styleId) {
      handleSelectTimerEffectMode('none');
    }
    showFeedback('Стиль таймера видалено ');
  };

  const handleSelectTimerEffectMode = (mode: string) => {
    setTimerEffectMode(mode);
    try {
      localStorage.setItem('quit-smoking:timer-horizon-effect', mode);
      window.dispatchEvent(new Event('timer-effect-change'));
    } catch {}
    showFeedback('Вигляд таймера успішно оновлено ');
  };

  // Timer Background Texture state
  const [timerTexture, setTimerTexture] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:timer-texture') || 'none';
    } catch {
      return 'none';
    }
  });

  const handleSelectTimerTexture = (texture: string) => {
    setTimerTexture(texture);
    try {
      localStorage.setItem('quit-smoking:timer-texture', texture);
      window.dispatchEvent(new Event('timer-texture-change'));
    } catch {}
    showFeedback('Текстуру фону таймера успішно оновлено ');
  };

  // WHO Progress Calculations
  const whoSystems = useMemo(() => getBodySystemsRecovery(totalFreeMs), [totalFreeMs]);
  const whoAchievedCount = useMemo(() => HEALTH_MILESTONES.filter((m) => totalFreeMs >= m.t).length, [totalFreeMs]);

  // Collapsible sections state (all closed by default)
  const closedSectionsDefault: Record<SectionKey, boolean> = useMemo(() => ({
    who_progress: false,
    themes: false,
    timer_style: false,
    timer_skins: false,
    analyzer_style: false,
    analyzer_thoughts_db: false,
    calc: false,
    habits: false,
    daily_steps: false,
    gratitude_journal: false,
    mental_health: false,
    health_tests: false,
    hydration: false,
    goals: false,
    start: false,
    streaks: false,
    reasons: false,
    badges: false,
    equivalents: false,
    prompt: false,
    theme: false,
    frameless_style: false,
    backup: false,
    perf_optimization: false,
    monitor: false,
    developer: false,
    health: false,
    notes: false,
    presets: false,
    cache_cleanup: false
  }), []);

  const [openSectionsState, setOpenSectionsState] = useState<Record<SectionKey, boolean>>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:more-sections-state');
      if (saved) {
        return { ...closedSectionsDefault, ...JSON.parse(saved), monitor: false };
      }
    } catch {}
    return closedSectionsDefault;
  });

  const isOverlayMode = !!overlaySectionKey;

  const openSections = useMemo(() => {
    if (isOverlayMode && overlaySectionKey) {
      return { ...openSectionsState, [overlaySectionKey]: true };
    }
    return openSectionsState;
  }, [openSectionsState, isOverlayMode, overlaySectionKey]);

  const [openGroups, setOpenGroups] = useState<Record<'customization' | 'useful_tools' | 'tech_moments', boolean>>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:more-groups-state');
      if (saved) return { customization: true, useful_tools: true, tech_moments: true, ...JSON.parse(saved) };
    } catch {}
    return {
      customization: true,
      useful_tools: true,
      tech_moments: true
    };
  });

  const toggleGroup = (key: 'customization' | 'useful_tools' | 'tech_moments') => {
    setOpenGroups((prev) => {
      const updated = {
        ...prev,
        [key]: !prev[key]
      };
      try {
        localStorage.setItem('quit-smoking:more-groups-state', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleSection = (key: SectionKey) => {
    setOpenSectionsState((prev) => {
      const isCurrentlyOpen = prev[key];
      // Close all other sections, toggle only the selected section
      const updated = { ...closedSectionsDefault, [key]: !isCurrentlyOpen };
      try {
        localStorage.setItem('quit-smoking:more-sections-state', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Configuration Presets Helpers & State
  const getFullAppConfig = () => {
    const config: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('quit-smoking:')) {
        if (
          key === 'quit-smoking:presets-list' || 
          key === 'quit-smoking:presets-lock-enabled' ||
          key === 'quit-smoking:presets-active-id' ||
          key === 'quit-smoking:more-sections-state'
        ) {
          continue;
        }
        const val = localStorage.getItem(key);
        if (val !== null) {
          config[key] = val;
        }
      }
    }
    return config;
  };

  const applyAppConfig = (config: Record<string, string>) => {
    Object.entries(config).forEach(([key, val]) => {
      localStorage.setItem(key, val);
    });
  };

  const [presetsList, setPresetsList] = useState<{ id: number; name: string; savedAt?: string; configData?: Record<string, string> }[]>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:presets-list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 1, name: 'Конфігурація 1' },
      { id: 2, name: 'Конфігурація 2' },
      { id: 3, name: 'Конфігурація 3' },
      { id: 4, name: 'Конфігурація 4' },
      { id: 5, name: 'Конфігурація 5' }
    ];
  });

  const [presetsLockEnabled, setPresetsLockEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:presets-lock-enabled') === 'true';
    } catch {
      return false;
    }
  });

  const handleTogglePresetsLock = () => {
    const nextVal = !presetsLockEnabled;
    setPresetsLockEnabled(nextVal);
    try {
      localStorage.setItem('quit-smoking:presets-lock-enabled', String(nextVal));
    } catch {}
    showFeedback(nextVal ? 'Захист конфігурацій активовано ' : 'Захист конфігурацій деактивовано ');
  };

  const handleSavePreset = (id: number) => {
    const fullConfig = getFullAppConfig();
    const now = new Date();
    const formattedDate = now.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });

    const updated = presetsList.map(p => {
      if (p.id === id) {
        return {
          ...p,
          savedAt: formattedDate,
          configData: fullConfig
        };
      }
      return p;
    });

    setPresetsList(updated);
    try {
      localStorage.setItem('quit-smoking:presets-list', JSON.stringify(updated));
    } catch {}
    showFeedback(`Конфігурацію збережено в Слот ${id} `);
  };

  const handleLoadPreset = (id: number) => {
    const slot = presetsList.find(p => p.id === id);
    if (!slot || !slot.configData) {
      showFeedback('Слот порожній! Спершу збережіть конфігурацію.');
      return;
    }

    try {
      applyAppConfig(slot.configData);
      localStorage.setItem('quit-smoking:presets-active-id', String(id));
      showFeedback(`Конфігурацію "${slot.name}" успішно завантажено! Перезавантаження... `);
      
      setTimeout(() => {
        window.location.reload();
      }, 950);
    } catch {
      showFeedback('Помилка при завантаженні конфігурації ');
    }
  };

  const handleDeletePreset = (id: number) => {
    const updated = presetsList.map(p => {
      if (p.id === id) {
        return { id: p.id, name: `Конфігурація ${p.id}` };
      }
      return p;
    });
    setPresetsList(updated);
    try {
      localStorage.setItem('quit-smoking:presets-list', JSON.stringify(updated));
    } catch {}
    showFeedback(`Слот ${id} очищено `);
  };

  const handleRenamePreset = (id: number, newName: string) => {
    const updated = presetsList.map(p => {
      if (p.id === id) {
        return { ...p, name: newName };
      }
      return p;
    });
    setPresetsList(updated);
    try {
      localStorage.setItem('quit-smoking:presets-list', JSON.stringify(updated));
    } catch {}
  };

  const allOpen = Object.values(openSections).every(Boolean);
  const toggleAll = () => {
    const nextVal = !allOpen;
    const updated: Record<SectionKey, boolean> = {
      who_progress: nextVal,
      themes: nextVal,
      timer_style: nextVal,
      timer_skins: nextVal,
      analyzer_style: nextVal,
      analyzer_thoughts_db: nextVal,
      calc: nextVal,
      habits: nextVal,
      daily_steps: nextVal,
      gratitude_journal: nextVal,
      mental_health: nextVal,
      health_tests: nextVal,
      hydration: nextVal,
      goals: nextVal,
      start: nextVal,
      streaks: nextVal,
      reasons: nextVal,
      badges: nextVal,
      equivalents: nextVal,
      prompt: nextVal,
      theme: nextVal,
      frameless_style: nextVal,
      backup: nextVal,
      perf_optimization: nextVal,
      monitor: nextVal,
      developer: nextVal,
      health: nextVal,
      notes: nextVal,
      presets: nextVal,
      cache_cleanup: nextVal
    };
    setOpenSectionsState(updated);
    try {
      localStorage.setItem('quit-smoking:more-sections-state', JSON.stringify(updated));
    } catch {}
  };

  // Dynamic accent classes for section card hover & click highlighting
  const accentClasses = useMemo(() => {
    switch (currentAccent) {
      case 'charcoal':
        return {
          card: 'hover:border-zinc-500/60 dark:hover:border-zinc-400/60 active:border-zinc-500',
          btn: 'hover:bg-zinc-500/10 dark:hover:bg-zinc-400/15 active:bg-zinc-500/25',
          activeCard: 'border-zinc-500/50 dark:border-zinc-400/50 bg-zinc-500/5'
        };
      case 'sage':
        return {
          card: 'hover:border-[#6b7c75]/60 dark:hover:border-[#6b7c75]/60 active:border-[#6b7c75]',
          btn: 'hover:bg-[#6b7c75]/10 dark:hover:bg-[#6b7c75]/20 active:bg-[#6b7c75]/30',
          activeCard: 'border-[#6b7c75]/50 bg-[#6b7c75]/5'
        };
      case 'taupe':
        return {
          card: 'hover:border-[#786b62]/60 dark:hover:border-[#786b62]/60 active:border-[#786b62]',
          btn: 'hover:bg-[#786b62]/10 dark:hover:bg-[#786b62]/20 active:bg-[#786b62]/30',
          activeCard: 'border-[#786b62]/50 bg-[#786b62]/5'
        };
      case 'slate-blue':
        return {
          card: 'hover:border-[#5b6a82]/60 dark:hover:border-[#5b6a82]/60 active:border-[#5b6a82]',
          btn: 'hover:bg-[#5b6a82]/10 dark:hover:bg-[#5b6a82]/20 active:bg-[#5b6a82]/30',
          activeCard: 'border-[#5b6a82]/50 bg-[#5b6a82]/5'
        };
      case 'ash-olive':
        return {
          card: 'hover:border-[#5f6959]/60 dark:hover:border-[#5f6959]/60 active:border-[#5f6959]',
          btn: 'hover:bg-[#5f6959]/10 dark:hover:bg-[#5f6959]/20 active:bg-[#5f6959]/30',
          activeCard: 'border-[#5f6959]/50 bg-[#5f6959]/5'
        };
      case 'gray':
        return {
          card: 'hover:border-slate-500/60 dark:hover:border-slate-400/60 active:border-slate-500',
          btn: 'hover:bg-slate-500/10 dark:hover:bg-slate-400/15 active:bg-slate-500/25',
          activeCard: 'border-slate-500/50 bg-slate-500/5'
        };
      case 'green':
      default:
        return {
          card: 'hover:border-[emerald-600]/60 dark:hover:border-[emerald-400]/60 active:border-[emerald-600]',
          btn: 'hover:bg-emerald-600/10 dark:hover:bg-emerald-600/20 active:bg-emerald-600/30',
          activeCard: 'border-[emerald-600]/50 dark:border-[emerald-400]/50 bg-emerald-600/5'
        };
    }
  }, [currentAccent]);

  // Safety and window recovery feedback
  const [safetyFeedback, setSafetyFeedback] = useState<string | null>(null);

  const handleRestoreAllWindows = () => {
    restoreAllWindowsToFeed();
    setSafetyFeedback('Усі 5 вікон успішно повернуто у головну стрічку! ');
    setTimeout(() => setSafetyFeedback(null), 3500);
  };

  const handleVerifyIntegrity = () => {
    const result = verifyAndRepairDataIntegrity();
    setSafetyFeedback(`${result.status} `);
    setTimeout(() => setSafetyFeedback(null), 3500);
  };

  // Calculator state
  const [calcFeedback, setCalcFeedback] = useState<string | null>(null);
  const [perDayInput, setPerDayInput] = useState<string>(() => String(money?.perDay ?? 20));
  const [packSizeInput, setPackSizeInput] = useState<string>(() => String(money?.packSize ?? 20));
  const [minutesPerCigInput, setMinutesPerCigInput] = useState<string>(() => String(money?.minutesPerCig ?? 7));
  const [packPriceInput, setPackPriceInput] = useState<string>(() => String(money?.packPrice ?? 100));

  const [showPriceChangeForm, setShowPriceChangeForm] = useState(false);
  const [newPackPriceInput, setNewPackPriceInput] = useState<string>(() => String(money?.packPrice ?? 100));
  const [priceChangeNote, setPriceChangeNote] = useState('');
  const [priceChangeDateMode, setPriceChangeDateMode] = useState<'now' | 'custom'>('now');
  const [customPriceDate, setCustomPriceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [showPriceHistory, setShowPriceHistory] = useState(false);

  useEffect(() => {
    if (money) {
      setPerDayInput(String(money.perDay));
      setPackSizeInput(String(money.packSize));
      setMinutesPerCigInput(String(money.minutesPerCig ?? 7));
      setPackPriceInput(String(money.packPrice));
      setNewPackPriceInput(String(money.packPrice));
    }
  }, [money]);

  const handleSaveBaseSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const perDay = Math.max(1, parseFloat(perDayInput) || 20);
    const packSize = Math.max(1, parseFloat(packSizeInput) || 20);
    const minutesPerCig = Math.max(1, parseFloat(minutesPerCigInput) || 7);
    const packPrice = Math.max(1, parseFloat(packPriceInput) || 100);

    const updatedMoney: MoneySettings = {
      ...(money || { cur: '₴', priceHistory: [] }),
      perDay,
      packSize,
      minutesPerCig,
      packPrice,
    };
    onUpdateMoney(updatedMoney);
    setCalcFeedback('Параметри успішно збережено! ');
    setTimeout(() => setCalcFeedback(null), 3000);
  };

  const handleAddPriceTier = (e: React.FormEvent) => {
    e.preventDefault();
    const newPrice = Math.max(1, parseFloat(newPackPriceInput) || 100);
    const timestamp = priceChangeDateMode === 'custom' && customPriceDate ? new Date(customPriceDate).getTime() : Date.now();
    const newTier: PriceTier = {
      timestamp,
      packPrice: newPrice,
      note: priceChangeNote.trim() || undefined
    };

    const existingHistory = money?.priceHistory ? [...money.priceHistory] : [];
    const updatedHistory = [...existingHistory, newTier].sort((a, b) => a.timestamp - b.timestamp);

    const updatedMoney: MoneySettings = {
      ...(money || { perDay: 20, packSize: 20, minutesPerCig: 7, cur: '₴' }),
      packPrice: newPrice,
      priceHistory: updatedHistory
    };
    onUpdateMoney(updatedMoney);
    setShowPriceChangeForm(false);
    setPriceChangeNote('');
    setCalcFeedback('Нову ціну збережено з прив’язкою до дати! ');
    setTimeout(() => setCalcFeedback(null), 3000);
  };

  const handleDeletePriceTier = (timestamp: number) => {
    if (!money?.priceHistory) return;
    const filtered = money.priceHistory.filter(t => t.timestamp !== timestamp);
    const latestPrice = filtered.length > 0 ? filtered[filtered.length - 1].packPrice : money.packPrice;
    const updatedMoney: MoneySettings = {
      ...money,
      packPrice: latestPrice,
      priceHistory: filtered
    };
    onUpdateMoney(updatedMoney);
    setCalcFeedback('Запис ціни видалено! ');
    setTimeout(() => setCalcFeedback(null), 3000);
  };

  // Reasons local form state
  const [newReasonInput, setNewReasonInput] = useState('');
  const [notes, setNotes] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:notes') || '';
    } catch {
      return '';
    }
  });

  const handleUpdateNotes = (value: string) => {
    setNotes(value);
    try {
      localStorage.setItem('quit-smoking:notes', value);
    } catch {}
  };

  const handleCreateReason = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newReasonInput.trim();
    if (!trimmed) return;
    onAddReason?.(trimmed);
    setNewReasonInput('');
  };

  const handleExportStateTxt = () => {
    let txt = `=== ПОВНА ІСТОРІЯ СТАНУ ТА САМОПОЧУТТЯ ===\n`;
    txt += `Експортовано: ${new Date().toLocaleString('uk-UA')}\n\n`;

    const sortedDates = Object.keys(days || {}).sort();
    if (sortedDates.length === 0) {
      txt += `Записів стану поки що немає.\n`;
    } else {
      sortedDates.forEach((dateKey) => {
        const day = days[dateKey];
        txt += `--------------------------------------------------\n`;
        txt += `ДАТА: ${dateKey}\n`;
        if (day.mood) txt += `Загальний настрій/баланс: ${day.mood}/5\n`;
        if (day.craving) txt += `Тяга до паління: ${day.craving}/5\n`;
        if (day.anxiety) txt += `Тривожність: ${day.anxiety}/5\n`;
        if (day.note) txt += `Нотатка дня: ${day.note}\n`;

        const allSurveys = day.surveys || day.entries || [];
        if (allSurveys.length > 0) {
          txt += `  Опитування протягом дня (${allSurveys.length}):\n`;
          allSurveys.forEach((s, idx) => {
            txt += `    [${s.time || `#${idx + 1}`}]\n`;
            if (s.energy) txt += `      - Енергія: ${s.energy}/5\n`;
            if (s.sleepQuality) txt += `      - Виспаність: ${s.sleepQuality}/5\n`;
            if (s.focus) txt += `      - Концентрація: ${s.focus}/5\n`;
            if (s.intrusiveThoughts) txt += `      - Нав'язливі думки: ${s.intrusiveThoughts}/5\n`;
            if (s.craving) txt += `      - Тяга: ${s.craving}/5\n`;
            if (s.anxiety) txt += `      - Тривожність: ${s.anxiety}/5\n`;
            if (s.balance) txt += `      - Баланс: ${s.balance}/5\n`;
            if (s.note) txt += `      - Нотатка: ${s.note}\n`;
          });
        }
        txt += `\n`;
      });
    }

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `state-history-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback('Історію стану успішно вивантажено у TXT файл! ');
  };
  const handleExportBackup = () => {
    const backupData = {
      start: currentStart,
      money,
      streaks,
      reasons,
      goals,
      tree: JSON.parse(localStorage.getItem('quit-smoking:tree') || '{}'),
      days: JSON.parse(localStorage.getItem('quit-smoking:days') || '{}'),
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quit-smoking-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback('Резервну копію збережено у файл! ');
  };

  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed) {
          if (parsed.start) localStorage.setItem('quit-smoking:start', String(parsed.start));
          if (parsed.money) localStorage.setItem('quit-smoking:money', JSON.stringify(parsed.money));
          if (parsed.streaks) localStorage.setItem('quit-smoking:streaks', JSON.stringify(parsed.streaks));
          if (parsed.reasons) localStorage.setItem('quit-smoking:reasons', JSON.stringify(parsed.reasons));
          if (parsed.goals) localStorage.setItem('quit-smoking:goals', JSON.stringify(parsed.goals));
          if (parsed.tree) localStorage.setItem('quit-smoking:tree', JSON.stringify(parsed.tree));
          if (parsed.days) localStorage.setItem('quit-smoking:days', JSON.stringify(parsed.days));
          alert('Резервну копію успішно відновлено! Сторінка оновлюється...');
          window.location.reload();
        }
      } catch {
        alert('Помилка читання файлу: невірний формат JSON.');
      }
    };
    reader.readAsText(file);
  };

  const milestonesList = [
    { title: '1 година', hours: 1, icon: '' },
    { title: '12 годин', hours: 12, icon: '⏳' },
    { title: '1 день', hours: 24, icon: '' },
    { title: '2 дні', hours: 48, icon: '' },
    { title: '3 дні', hours: 72, icon: '' },
    { title: '5 днів', hours: 120, icon: '' },
    { title: '1 тиждень', hours: 168, icon: '' },
    { title: '2 тижні', hours: 336, icon: '' },
    { title: '1 місяць', hours: 720, icon: '' },
    { title: '3 місяці', hours: 2160, icon: '' },
    { title: '6 місяців', hours: 4380, icon: '' },
    { title: '1 рік', hours: 8760, icon: '' },
    { title: '2 роки', hours: 17520, icon: '⭐' },
    { title: '3 роки', hours: 26280, icon: '' },
    { title: '4 роки', hours: 35040, icon: '' },
    { title: '5 років', hours: 43800, icon: '' },
    { title: '6 років', hours: 52560, icon: '' },
    { title: '7 років', hours: 61320, icon: '' },
    { title: '8 років', hours: 70080, icon: '' },
    { title: '9 років', hours: 78840, icon: '' },
    { title: '10+ років', hours: 87600, icon: '' },
  ];

  const totalHours = totalFreeMs / (3600 * 1000);

  // Goals local form state
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalDate, setGoalDate] = useState('');

  const formattedStartDate = useMemo(() => {
    try {
      return new Date(currentStart).toLocaleString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return new Date(currentStart).toLocaleString();
    }
  }, [currentStart]);

  const fmtDuration = (ms: number) => {
    const d = Math.floor(ms / (24 * 3600 * 1000));
    const h = Math.floor((ms % (24 * 3600 * 1000)) / (3600 * 1000));
    if (d > 0) return `${d} дн. ${h} год.`;
    return `${h} год.`;
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName.trim()) return;
    const amt = goalAmount ? parseFloat(goalAmount) : undefined;
    onAddGoal(goalName.trim(), amt, goalDate ? goalDate : undefined);
    setGoalName('');
    setGoalAmount('');
    setGoalDate('');
  };

  const netSaved = Math.max(0, totalSaved - (goals.base || 0));

  const curPackPrice = money?.packPrice ?? 100;
  const curPerDay = money?.perDay ?? 20;
  const curPackSize = money?.packSize ?? 20;

  const standardLayout = (
    <div className={isOverlayMode ? "more-overlay-modal-mode text-left" : "flex flex-col flex-1 pb-8 max-w-md mx-auto w-full"}>
      {isOverlayMode && (
        <style dangerouslySetInnerHTML={{ __html: `
          .more-overlay-modal-mode > div > * {
            display: none !important;
          }
          .more-overlay-modal-mode #more-sec-${overlaySectionKey} {
            display: block !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .more-overlay-modal-mode #more-sec-${overlaySectionKey} > button {
            display: none !important;
          }
          .more-overlay-modal-mode #more-sec-${overlaySectionKey} > div {
            display: block !important;
            border-top: none !important;
            padding: 0 !important;
            margin-top: 0 !important;
          }
          .more-overlay-modal-mode button[title*="Закріпити"],
          .more-overlay-modal-mode button[title*="Прибрати"],
          .more-overlay-modal-mode button[title*="Винести"],
          .more-overlay-modal-mode .lucide-pin,
          .more-overlay-modal-mode svg.lucide-pin {
            display: none !important;
          }
        `}} />
      )}

      {feedbackMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] max-w-[92%] px-4 py-2.5 bg-slate-900/95 dark:bg-zinc-800/95 text-white text-xs font-semibold rounded-2xl text-center shadow-2xl border border-zinc-700/80 backdrop-blur-md animate-fade-in flex items-center justify-center gap-2 pointer-events-none">
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Top Header */}
      {!isOverlayMode && (
        <div className="mb-4">
          <h1 className="text-xl font-extrabold text-zinc-100 tracking-tight">
            Додаткові налаштування
          </h1>
        </div>
      )}

      <div className="space-y-3">
        {/* ==================================================================== */}
        {/* РОЗДІЛ: КАЛЬКУЛЯТОР ВИТРАТ ТА СИГАРЕТ (ГРН) (ЗГОРТАЄТЬСЯ) */}
        {/* ==================================================================== */}
        <div id="more-sec-calc" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl ${openSections.calc ? accentClasses.activeCard : 'border-zinc-800/80'} ${accentClasses.card}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection('calc')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('calc'); }}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group select-none ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("calc", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-100 truncate">
                    Калькулятор витрат та сигарет
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                    грн
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 truncate">
                  Кількість на день, ціна пачки повзунками та миттєвий підрахунок
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('calc')}
              {openSections.calc ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {openSections.calc && (
            <div className="p-4 pt-1 border-t border-zinc-800/80 space-y-4">
              {calcFeedback && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{calcFeedback}</span>
                </div>
              )}

              {/* 1. Повзунок: Кількість сигарет на день */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-500" />
                    <span>Сигарет на день:</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPerDayInput(String(Math.max(1, (parseInt(perDayInput, 10) || 20) - 1)))}
                      className="w-7 h-7 rounded-lg bg-zinc-800/90 border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:bg-zinc-700 font-bold transition-colors cursor-pointer"
                      title="Зменшити на 1"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center text-sm font-extrabold font-mono text-zinc-200 bg-zinc-800/90 py-0.5 rounded-lg border border-zinc-700/80">
                      {perDayInput || 20}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPerDayInput(String(Math.min(100, (parseInt(perDayInput, 10) || 20) + 1)))}
                      className="w-7 h-7 rounded-lg bg-zinc-800/90 border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:bg-zinc-700 font-bold transition-colors cursor-pointer"
                      title="Збільшити на 1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-zinc-400 ml-1">шт</span>
                  </div>
                </div>

                {/* Range Slider for Per Day */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={perDayInput || 20}
                    onChange={(e) => setPerDayInput(e.target.value)}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-400"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                    <span>1 шт</span>
                    <span>10</span>
                    <span>20 (пачка)</span>
                    <span>30</span>
                    <span>40</span>
                    <span>60 шт</span>
                  </div>
                </div>
              </div>

              {/* 2. Повзунок та поле: Ціна за пачку (грн) */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-zinc-300" />
                    <span>Ціна за пачку (грн):</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPackPriceInput(String(Math.max(1, (parseFloat(packPriceInput) || 100) - 1)))}
                      className="px-2 py-1 rounded-lg bg-zinc-800/90 border border-zinc-700/80 text-xs font-bold text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
                      title="Зменшити на 1 грн"
                    >
                      -1
                    </button>
                    
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        step="1"
                        value={packPriceInput}
                        onChange={(e) => setPackPriceInput(e.target.value)}
                        className="w-18 text-center text-sm font-extrabold font-mono text-zinc-200 bg-zinc-800/90 py-1 rounded-lg border border-zinc-700/80 focus:outline-hidden focus:border-emerald-500"
                        placeholder="100"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setPackPriceInput(String((parseFloat(packPriceInput) || 100) + 1))}
                      className="px-2 py-1 rounded-lg bg-zinc-800/90 border border-zinc-700/80 text-xs font-bold text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
                      title="Збільшити на 1 грн"
                    >
                      +1
                    </button>
                    <span className="text-xs font-bold text-zinc-200 ml-1">грн</span>
                  </div>
                </div>

                {/* Range Slider for Pack Price */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="20"
                    max="300"
                    step="1"
                    value={Math.min(300, Math.max(20, parseFloat(packPriceInput) || 100))}
                    onChange={(e) => setPackPriceInput(e.target.value)}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-400"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                    <span>20 грн</span>
                    <span>70 грн</span>
                    <span>100 грн</span>
                    <span>150 грн</span>
                    <span>200 грн</span>
                    <span>300 грн</span>
                  </div>
                </div>
              </div>

              {/* 3. Повзунок: Час на одну сигарету (хвилини) */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-zinc-200" />
                    <span>Час на куріння 1 сигарети:</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setMinutesPerCigInput(String(Math.max(1, (parseInt(minutesPerCigInput, 10) || 7) - 1)))}
                      className="w-7 h-7 rounded-lg bg-zinc-800/90 border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:bg-zinc-700 font-bold transition-colors cursor-pointer"
                      title="Зменшити на 1 хв"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center text-sm font-extrabold font-mono text-zinc-200 bg-zinc-800/90 py-0.5 rounded-lg border border-zinc-700/80">
                      {minutesPerCigInput || 7}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMinutesPerCigInput(String(Math.min(30, (parseInt(minutesPerCigInput, 10) || 7) + 1)))}
                      className="w-7 h-7 rounded-lg bg-zinc-800/90 border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:bg-zinc-700 font-bold transition-colors cursor-pointer"
                      title="Збільшити на 1 хв"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-zinc-400 ml-1">хв</span>
                  </div>
                </div>

                {/* Range Slider for Minutes Per Cig */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={Math.min(20, Math.max(1, parseInt(minutesPerCigInput, 10) || 7))}
                    onChange={(e) => setMinutesPerCigInput(e.target.value)}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-400"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                    <span>1 хв</span>
                    <span>3 хв</span>
                    <span>5 хв</span>
                    <span>7 хв (стандарт)</span>
                    <span>10 хв</span>
                    <span>15 хв</span>
                    <span>20 хв</span>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {['3', '5', '7', '10', '15'].map((min) => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => setMinutesPerCigInput(min)}
                      className={`py-1 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                        minutesPerCigInput === min
                          ? 'bg-cyan-600 text-white shadow-xs'
                          : 'bg-zinc-800/90 text-zinc-300 border border-zinc-700/80 hover:bg-cyan-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {min} хв {min === '7' ? '' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Кількість сигарет у пачці (Розмір пачки) */}
              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-200">
                    Сигарет у пачці:
                  </span>
                  <span className="font-mono font-bold text-zinc-200">
                    {packSizeInput || 20} шт
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {['10', '20', '25', '30', '40'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setPackSizeInput(size)}
                      className={`py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                        packSizeInput === size
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-zinc-800/90 text-zinc-300 border border-zinc-700/80 hover:bg-emerald-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {size} {size === '20' ? '' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Інтерактивний живий підрахунок витрат та звільненого часу */}
              {(() => {
                const cPerDay = Math.max(1, parseFloat(perDayInput) || 20);
                const cPrice = Math.max(1, parseFloat(packPriceInput) || 100);
                const cSize = Math.max(1, parseInt(packSizeInput, 10) || 20);
                const cMinutes = Math.max(1, parseFloat(minutesPerCigInput) || 7);
                const cCostPerCig = cPrice / cSize;
                const cDay = cPerDay * cCostPerCig;
                const cMonth = cDay * 30.5;
                const cYear = cDay * 365;
                const c5Years = cYear * 5;

                const dayMinutes = cPerDay * cMinutes;
                const dayHours = Math.floor(dayMinutes / 60);
                const dayRemMin = Math.round(dayMinutes % 60);

                const monthHours = Math.round((dayMinutes * 30.5) / 60);
                const yearDays = ((dayMinutes * 365) / 60 / 24).toFixed(1);

                return (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-100">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span>Розрахунок витрат та повернутого часу (грн / час):</span>
                      </span>
                      <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
                        1 шт ≈ {cCostPerCig.toFixed(2)} грн • {cMinutes} хв
                      </span>
                    </div>

                    {/* Гроші */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-zinc-800/90 border border-emerald-500/20">
                        <div className="text-[10px] text-zinc-400 font-medium">Витрати на день</div>
                        <div className="text-sm font-extrabold text-zinc-200 font-mono mt-0.5">
                          {cDay.toFixed(1)} грн
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-zinc-800/90 border border-emerald-500/20">
                        <div className="text-[10px] text-zinc-400 font-medium">На місяць (30 дн)</div>
                        <div className="text-sm font-extrabold text-zinc-200 font-mono mt-0.5">
                          {Math.round(cMonth).toLocaleString()} грн
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-zinc-800/90 border border-emerald-500/20">
                        <div className="text-[10px] text-zinc-400 font-medium">На 1 рік (365 дн)</div>
                        <div className="text-sm font-extrabold text-zinc-200 font-mono mt-0.5">
                          {Math.round(cYear).toLocaleString()} грн
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-zinc-800/90 border border-emerald-500/20">
                        <div className="text-[10px] text-zinc-400 font-medium">За 5 років</div>
                        <div className="text-sm font-extrabold text-zinc-200 font-mono mt-0.5">
                          {Math.round(c5Years).toLocaleString()} грн
                        </div>
                      </div>
                    </div>

                    {/* Повернутий час */}
                    <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-emerald-500/20">
                      <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                        <div className="text-[10px] text-cyan-700 dark:text-zinc-300 font-medium">Час на день</div>
                        <div className="text-xs font-extrabold text-zinc-200 font-mono mt-0.5">
                          {dayHours > 0 ? `${dayHours}г ${dayRemMin}хв` : `${dayRemMin} хв`}
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                        <div className="text-[10px] text-cyan-700 dark:text-zinc-300 font-medium">Час на місяць</div>
                        <div className="text-xs font-extrabold text-zinc-200 font-mono mt-0.5">
                          {monthHours} годин
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                        <div className="text-[10px] text-cyan-700 dark:text-zinc-300 font-medium">Час на рік</div>
                        <div className="text-xs font-extrabold text-zinc-200 font-mono mt-0.5">
                          {yearDays} повних днів
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 6. Кнопка збереження та синхронізації зі статистикою */}
              <button
                type="button"
                onClick={handleSaveBaseSettings}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <Check className="w-4 h-4" />
                <span>Зберегти та оновити всю статистику</span>
              </button>

              {/* 6. Зміна ціни з прив'язкою до дати (Історія цін) */}
              <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-500" />
                    <span>Зміна ціни у минулому або майбутньому</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPriceChangeForm(!showPriceChangeForm)}
                    className="text-xs font-semibold text-zinc-200 hover:underline cursor-pointer"
                  >
                    {showPriceChangeForm ? 'Сховати форму' : '+ Додати нову ціну з дати'}
                  </button>
                </div>

                {showPriceChangeForm && (
                  <form onSubmit={handleAddPriceTier} className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-2.5 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                          Нова ціна за пачку (грн):
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={newPackPriceInput}
                          onChange={(e) => setNewPackPriceInput(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-700/80 bg-zinc-800/90 text-zinc-100 font-mono text-xs focus:outline-hidden focus:border-emerald-500"
                          placeholder="120"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                          Дата набрання чинності:
                        </label>
                        <input
                          type="date"
                          value={customPriceDate}
                          onChange={(e) => {
                            setCustomPriceDate(e.target.value);
                            setPriceChangeDateMode('custom');
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-700/80 bg-zinc-800/90 text-zinc-100 font-mono text-xs focus:outline-hidden focus:border-emerald-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Примітка (необов'язково):
                      </label>
                      <input
                        type="text"
                        value={priceChangeNote}
                        onChange={(e) => setPriceChangeNote(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-zinc-700/80 bg-zinc-800/90 text-zinc-100 text-xs focus:outline-hidden focus:border-emerald-500"
                        placeholder="Наприклад: подорожчання з нового року"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Зафіксувати ціну з цієї дати</span>
                    </button>
                  </form>
                )}

                {/* Таблиця історії цін, якщо вони є */}
                {money?.priceHistory && money.priceHistory.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowPriceHistory(!showPriceHistory)}
                      className="text-[11px] text-zinc-400 flex items-center gap-1 font-semibold hover:text-slate-800 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      <span>Історія змін цін ({money.priceHistory.length})</span>
                      {showPriceHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {showPriceHistory && (
                      <div className="space-y-1">
                        {money.priceHistory.map((tier) => (
                          <div
                            key={tier.timestamp}
                            className="p-2 rounded-lg bg-zinc-800/90 border border-slate-200/80 dark:border-zinc-700 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-bold text-zinc-200 font-mono">
                                {tier.packPrice} грн
                              </span>
                              <span className="text-zinc-400 ml-2 font-mono text-[11px]">
                                з {new Date(tier.timestamp).toLocaleDateString('uk-UA')}
                              </span>
                              {tier.note && (
                                <span className="text-zinc-400 text-[10px] block">
                                  {tier.note}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeletePriceTier(tier.timestamp)}
                              className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                              title="Видалити цей запис"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* КАТЕГОРІЯ 1: КАСТОМІЗАЦІЯ */}
        {/* ==================================================================== */}
        <div className="w-full pt-1 pb-1 flex items-center justify-between gap-2 border-b border-zinc-800/80 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-600 dark:text-zinc-300 flex items-center justify-center shrink-0">
              <Palette className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300">
              Кастомізація
            </h2>
          </div>
        </div>

            {/* ==================================================================== */}
            {/* РОЗДІЛ: КОНФІГУРАЦІЇ ТА ПРЕСЕТИ (ЗГОРТАЄТЬСЯ) */}
            {/* ==================================================================== */}
        <div id="more-sec-presets" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-1 mb-2.5 ${openSections.presets ? accentClasses.activeCard : 'border-zinc-800/80'} ${accentClasses.card}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection('presets')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('presets'); }}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group select-none ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("presets", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 truncate flex items-center gap-2">
                  <span>Конфігурації та Пресети</span>
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">
                  Збереження та захист усіх поточних налаштувань (5 слотів)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('presets')}
              {openSections.presets ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {openSections.presets && (
            <div className="p-4 pt-0 border-t border-zinc-800/80 space-y-4 mt-1">
              
              {/* SWITCH / СВІТЧ FOR AUTO-RECOVERY & PROTECTION */}
              <div className="pt-4 pb-2.5 px-3.5 rounded-xl bg-zinc-900/50 border border-slate-100 dark:border-zinc-800/40 flex items-center justify-between gap-4">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-zinc-200 shrink-0 mt-0.5">
                    <Database className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-zinc-100 leading-tight">
                      Захист від скидання налаштувань
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">
                      Блокує поточну конфігурацію від випадкового збиття та автоматично відновлює її при завантаженні
                    </p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={handleTogglePresetsLock}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                    presetsLockEnabled ? 'bg-emerald-500 dark:bg-emerald-600' : 'bg-slate-300 dark:bg-zinc-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      presetsLockEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 5 CONVENTIONAL CONFIG SLOTS */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-500">
                    Доступні слоти збереження (5)
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {presetsList.map((slot) => {
                    const isSaved = !!slot.savedAt;
                    return (
                      <div
                        key={slot.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                          isSaved 
                            ? 'border-purple-500/30 dark:border-purple-500/20 bg-purple-500/[0.02] dark:bg-purple-500/[0.01]' 
                            : 'border-zinc-800/80 bg-white/40 dark:bg-zinc-900/10'
                        }`}
                      >
                        {/* Left: Slot metadata & rename */}
                        <div className="flex-1 min-w-0 space-y-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-500/10 text-zinc-300 tracking-wider">
                              Слот {slot.id}
                            </span>
                            <input
                              type="text"
                              value={slot.name}
                              onChange={(e) => handleRenamePreset(slot.id, e.target.value)}
                              className="text-xs font-bold text-zinc-100 bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-zinc-700 focus:border-purple-500 focus:outline-none py-0.5 truncate max-w-[150px] transition-colors"
                              placeholder={`Слот ${slot.id}`}
                            />
                          </div>
                          
                          <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                            {isSaved ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span>Збережено: {slot.savedAt}</span>
                              </>
                            ) : (
                              <span className="text-slate-400 dark:text-zinc-600 font-medium">Порожній слот конфігурації</span>
                            )}
                          </p>
                        </div>

                        {/* Right: Slot Action Buttons */}
                        <div className="flex items-center gap-1.5 justify-end shrink-0">
                          {/* Save Current Config */}
                          <button
                            type="button"
                            onClick={() => handleSavePreset(slot.id)}
                            className="px-2.5 py-1.5 text-[10.5px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer flex items-center gap-1"
                            title="Зберегти поточну конфігурацію у цей слот"
                          >
                            <Save className="w-3 h-3" />
                            <span>Зберегти</span>
                          </button>

                          {/* Load Saved Config */}
                          {isSaved && (
                            <button
                              type="button"
                              onClick={() => handleLoadPreset(slot.id)}
                              className="px-2.5 py-1.5 text-[10.5px] font-black rounded-lg bg-purple-600 hover:bg-purple-500 active:scale-95 text-white shadow-xs shadow-purple-500/20 transition-all cursor-pointer flex items-center gap-1"
                              title="Завантажити та застосувати цю конфігурацію"
                            >
                              <RefreshCw className="w-3 h-3 animate-spin-slow" />
                              <span>Завантажити</span>
                            </button>
                          )}

                          {/* Clear Slot */}
                          {isSaved && (
                            <button
                              type="button"
                              onClick={() => handleDeletePreset(slot.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 hover:bg-red-500/5 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Очистити слот"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

            {/* ==================================================================== */}
            {/* РОЗДІЛ: ТЕМИ (ЗГОРТАЄТЬСЯ) */}
            {/* ==================================================================== */}
        <div id="more-sec-themes" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-1 ${openSections.themes ? accentClasses.activeCard : 'border-zinc-800/80'} ${openSections.themes ? '' : accentClasses.card}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection('themes')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('themes'); }}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group select-none ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("themes", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 truncate flex items-center gap-2">
                  <span>Теми</span>
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">
                  Оберіть тему оформлення та динамічний фон
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('themes')}
              {openSections.themes ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {openSections.themes && (
            <div className="p-4 pt-0 border-t border-zinc-800/80 space-y-3 mt-1">
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 0. ТЕМА: ЕКО (ДУЖЕ ЧОРНА БЕЗ АНІМАЦІЙ) */}
                <div
                  onClick={(e) => handleSelectAppTheme('eco', 'Еко', '', e)}
                  className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-3 relative overflow-hidden cursor-pointer select-none active:scale-[0.98] ${
                    activeAppTheme === 'eco'
                      ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10 shadow-xs ring-2 ring-emerald-500/40'
                      : 'border-zinc-800/80 bg-zinc-900/90 hover:bg-[#1f1f27] hover:border-zinc-700'
                  }`}
                >
                  <div className="w-full text-left flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-zinc-200 flex items-center justify-center shrink-0">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-100">Еко</div>
                          <div className="text-[10px] text-zinc-200 font-medium">Без анімацій • Глибокий чорний (OLED)</div>
                        </div>
                      </div>
                      {activeAppTheme === 'eco' && (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Ультра-економна глибока чорна тема (#000000) без фонових часток, Canvas та анімацій. Повністю вимикає пікселі на AMOLED/OLED дисплеях для максимальної економії заряду батареї.
                    </p>

                    {/* Decorative preview bar */}
                    <div className="w-full h-8 rounded-lg bg-black border border-emerald-500/40 flex items-center justify-between px-3 shadow-inner">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                        <span className="text-[10px] text-emerald-300 font-mono font-bold">0% CPU • True Black</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-400">
                        <span className="bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-300">#000000</span>
                        <span className="text-zinc-200 font-semibold">ECO</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <span className="text-emerald-500"></span> Без анімацій
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-emerald-500"></span> 100% Black OLED
                    </span>
                  </div>
                </div>

                {/* 1. СТАНДАРТНА БЕЗ АНІМАЦІЙ (МАКСИМАЛЬНА ПРОДУКТИВНІСТЬ) */}
                <div
                  onClick={(e) => handleSelectAppTheme('standard-static', 'Стандартна (Без анімацій)', '', e)}
                  className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-3 relative overflow-hidden cursor-pointer select-none active:scale-[0.98] ${
                    activeAppTheme === 'standard-static'
                      ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10 shadow-xs ring-2 ring-emerald-500/40'
                      : 'border-zinc-800/80 bg-zinc-900/90 hover:bg-[#1f1f27] hover:border-zinc-700'
                  }`}
                >
                  <div className="w-full text-left flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-zinc-200 flex items-center justify-center shrink-0">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-100">Стандартна (Без анімацій)</div>
                          <div className="text-[10px] text-zinc-200 font-medium">Максимальна продуктивність • 0% навантаження CPU</div>
                        </div>
                      </div>
                      {activeAppTheme === 'standard-static' && (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Ультрашвидка статична тема без фонових часток, Canvas та анімацій. Забезпечує миттєвий відгук, 120 FPS скролінг та максимальне заощадження заряду батареї.
                    </p>

                    {/* Decorative preview bar */}
                    <div className="w-full h-8 rounded-lg bg-gradient-to-r from-[#0c0d12] via-[#14151d] to-[#0a0b0e] border border-emerald-500/30 flex items-center justify-between px-3 shadow-inner">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                        <span className="text-[10px] text-emerald-300 font-mono font-bold">0% CPU / GPU</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-400">
                        <span className="bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-300">STATIC</span>
                        <span className="text-zinc-200 font-semibold">120 FPS</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <span className="text-emerald-500"></span> Без циклів Canvas
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-emerald-500"></span> Економія батареї
                    </span>
                  </div>
                </div>

                {/* 2. СТАНДАРТНА ТЕМА (ГЛИБОКИЙ КОСМОС ТА ЗОРЯНИЙ ПИЛ) */}
                <div
                  onClick={(e) => handleSelectAppTheme('standard', 'Стандартна (Космічний пил)', '', e)}
                  className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-3 relative overflow-hidden cursor-pointer select-none active:scale-[0.98] ${
                    activeAppTheme !== 'autumn' && activeAppTheme !== 'winter' && activeAppTheme !== 'spring' && activeAppTheme !== 'summer' && activeAppTheme !== 'standard-static' && activeAppTheme !== 'eco'
                      ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-500/10 dark:bg-indigo-400/10 shadow-xs ring-2 ring-indigo-500/40'
                      : 'border-zinc-800/80 bg-zinc-900/90 hover:bg-[#1f1f27] hover:border-zinc-700'
                  }`}
                >
                  <div className="w-full text-left flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-100">Стандартна (Космічний пил)</div>
                          <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">Космічний пил • Безмежний простір</div>
                        </div>
                      </div>
                      {activeAppTheme !== 'autumn' && activeAppTheme !== 'winter' && activeAppTheme !== 'spring' && activeAppTheme !== 'summer' && activeAppTheme !== 'standard-static' && activeAppTheme !== 'eco' && (
                        <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Багатошаровий зоряний простір: мерехтливі спектральні зорі, космічні туманності, метеори, гравітаційна взаємодія та спалахи супернової від дотику.
                    </p>

                    {/* Decorative preview bar */}
                    <div className="w-full h-8 rounded-lg bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 border border-indigo-800/60 flex items-center justify-center gap-2 px-2 shadow-inner">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#67e8f9] animate-pulse" />
                      <span className="w-1 h-1 rounded-full bg-white opacity-90 shadow-[0_0_4px_#fff]" />
                      <span className="w-2 h-2 rounded-full bg-purple-400 opacity-80 shadow-[0_0_6px_#c084fc]" />
                      <span className="text-[10px] text-indigo-200/90 font-mono">deep cosmos • 432 hz</span>
                      <span className="text-[10px] text-zinc-300"></span>
                    </div>
                  </div>

                  {/* SUB-CONTROLS FOR STANDARD THEME */}
                  {activeAppTheme !== 'autumn' && activeAppTheme !== 'winter' && activeAppTheme !== 'spring' && activeAppTheme !== 'summer' && activeAppTheme !== 'standard-static' && activeAppTheme !== 'eco' && (
                    <div className="pt-2 border-t border-indigo-500/20 space-y-2.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-300">
                          Режим космосу:
                        </span>
                        <span className="text-[9px] font-mono text-indigo-400">
                          {standardSpaceMode === 'auto'
                            ? 'За часом '
                            : standardSpaceMode === 'deep_space'
                            ? 'Глибокий космос '
                            : standardSpaceMode === 'nebula'
                            ? 'Туманність '
                            : standardSpaceMode === 'aurora'
                            ? 'Сяйво '
                            : 'Зорепад '}
                        </span>
                      </div>

                      {/* Space mode switcher chips */}
                      <div className="grid grid-cols-5 gap-1">
                        {[
                          { id: 'auto', label: 'Авто' },
                          { id: 'deep_space', label: 'Космос' },
                          { id: 'nebula', label: 'Хмари' },
                          { id: 'aurora', label: 'Сяйво' },
                          { id: 'meteor', label: 'Зорепад' },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetStandardSpaceMode(m.id);
                            }}
                            className={`py-1 px-1 rounded-lg text-[10px] font-medium text-center transition-all cursor-pointer ${
                              standardSpaceMode === m.id
                                ? 'bg-indigo-500 text-white font-bold shadow-xs'
                                : 'bg-slate-200/70 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-white'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>

                      {/* Star Density selector */}
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-300">
                          Щільність зір:
                        </span>
                        <div className="flex gap-1">
                          {[
                            { id: 'calm', label: 'Спокійна' },
                            { id: 'medium', label: 'Баланс' },
                            { id: 'rich', label: 'Насичена' },
                          ].map((d) => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetStandardDensity(d.id);
                              }}
                              className={`py-0.5 px-2 rounded-md text-[9px] font-medium transition-all cursor-pointer ${
                                standardDensity === d.id
                                  ? 'bg-indigo-600 text-white font-bold'
                                  : 'bg-slate-200/60 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Star Count Slider */}
                      <div className="pt-2 border-t border-indigo-500/20 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300">
                          <span className="flex items-center gap-1.5">
                            <span></span>
                            <span>Кількість зірок:</span>
                          </span>
                          <span className="text-[10px] font-mono text-indigo-400 font-bold">
                            {starCountSlider} зірок (мінімум)
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="80"
                          step="5"
                          value={starCountSlider}
                          onChange={(e) => handleSetStarCountSlider(Number(e.target.value))}
                          className="w-full accent-indigo-500 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Meteor Shower Intensity Slider */}
                      <div className="pt-2 border-t border-indigo-500/20 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300">
                          <span className="flex items-center gap-1.5">
                            <span></span>
                            <span>Інтенсивність метеоритного дощу:</span>
                          </span>
                          <span className="text-[10px] font-mono text-zinc-200 dark:text-zinc-200 font-bold">
                            {meteorIntensity <= 1.5
                              ? 'Рідкісні метеори '
                              : meteorIntensity <= 3.5
                              ? 'Помірний потік '
                              : meteorIntensity <= 6.0
                              ? 'Густий зорепад '
                              : meteorIntensity <= 8.5
                              ? 'Інтенсивний потік '
                              : 'Зоряний шторм '}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="0.5"
                          value={meteorIntensity}
                          onChange={(e) => handleSetMeteorIntensity(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
                        />
                        <div className="flex justify-between text-[9px] font-mono text-zinc-400">
                          <span>Рідкісний</span>
                          <span>Баланс</span>
                          <span>Шторм</span>
                        </div>
                      </div>

                      {/* Sound toggle & Interactive hint */}
                      <div className="pt-1 flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStandardAudio();
                          }}
                          className={`w-full py-1.5 px-2.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isStandardAudioOn
                              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                              : 'bg-zinc-800/90/60 text-zinc-600 dark:text-zinc-400 border border-transparent hover:border-zinc-700'
                          }`}
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${isStandardAudioOn ? 'animate-pulse text-indigo-400' : ''}`} />
                          <span>{isStandardAudioOn ? 'Гармонія космосу увімкнена (432 Гц) ' : 'Увімкнути гармонію космосу (432 Гц) '}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.dispatchEvent(new CustomEvent('trigger-blackhole'));
                            showFeedback('Створено науково точну Чорну діру  (Гравітаційне лінзування & акреційний диск)');
                          }}
                          className="w-full py-1.5 px-2.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-slate-900/80 text-zinc-300 border border-cyan-500/40 hover:bg-slate-900 hover:border-cyan-400"
                        >
                          <span></span>
                          <span>Створити чорну діру (Інь-Ян) </span>
                        </button>
                      </div>

                      <div className="text-[10px] text-indigo-400/90 text-center font-mono">
                         Торкніться фону для створення зірок або активуйте чорну діру
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. ОСІННЯ ТЕМА */}
                <div
                  onClick={(e) => handleSelectAppTheme('autumn', 'Осіння затишна', '', e)}
                  className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-3 relative overflow-hidden cursor-pointer select-none active:scale-[0.98] ${
                    activeAppTheme === 'autumn'
                      ? 'border-amber-500 dark:border-amber-400 bg-amber-500/10 dark:bg-amber-400/10 shadow-xs ring-2 ring-amber-500/40'
                      : 'border-zinc-800/80 bg-zinc-900/90 hover:bg-[#1f1f27] hover:border-zinc-700'
                  }`}
                >
                  <div className="w-full text-left flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-zinc-300 flex items-center justify-center shrink-0">
                          <Leaf className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-100">Осіння затишна</div>
                          <div className="text-[10px] text-amber-600 dark:text-zinc-300 font-medium">Золотий листопад • Шелест вітру • Камін</div>
                        </div>
                      </div>
                      {activeAppTheme === 'autumn' && (
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Медитативний 3D-листопад з 5 видами листя (клен, дуб, бук, золоте гінкго, берізка), що кружляють у вихорі, сонячні промені крізь крону, мерехтливі іскри каміна та атмосферний шелест.
                    </p>

                    {/* Decorative preview bar */}
                    <div className="w-full h-8 rounded-lg bg-gradient-to-r from-[#211510] via-[#2a170d] to-[#1c110d] border border-amber-900/40 flex items-center justify-center gap-2 px-2">
                      <span className="text-zinc-300 text-xs"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-zinc-300 text-xs"></span>
                      <span className="text-[10px] text-zinc-300/90 font-mono">autumn drift & sunbeams</span>
                      <span className="text-zinc-300 text-xs"></span>
                    </div>
                  </div>

                  {/* SUB-CONTROLS FOR AUTUMN THEME */}
                  {activeAppTheme === 'autumn' && (
                    <div className="pt-2 border-t border-amber-500/20 space-y-2.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-300">
                          Час доби атмосфери:
                        </span>
                        <span className="text-[9px] font-mono text-zinc-300">
                          {autumnTimeMode === 'auto'
                            ? 'За годинником '
                            : autumnTimeMode === 'morning'
                            ? 'Золотий ранок '
                            : autumnTimeMode === 'afternoon'
                            ? 'Бабине літо '
                            : autumnTimeMode === 'evening'
                            ? 'Багряний захід '
                            : 'Камін & Ніч '}
                        </span>
                      </div>

                      {/* Time-of-day switcher chips */}
                      <div className="grid grid-cols-5 gap-1">
                        {[
                          { id: 'auto', label: 'Авто' },
                          { id: 'morning', label: 'Ранок' },
                          { id: 'afternoon', label: 'Полудень' },
                          { id: 'evening', label: 'Захід' },
                          { id: 'night', label: 'Ніч' },
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetAutumnTimeMode(t.id);
                            }}
                            className={`py-1 px-1 rounded-lg text-[10px] font-medium text-center transition-all cursor-pointer ${
                              autumnTimeMode === t.id
                                ? 'bg-amber-500 text-white font-bold shadow-xs'
                                : 'bg-slate-200/70 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-white'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {/* Sound toggle & Interactive hint */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAutumnAudio();
                          }}
                          className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isAutumnAudioOn
                              ? 'bg-amber-600/30 text-zinc-300 border border-amber-500/40'
                              : 'bg-zinc-800/90/60 text-zinc-600 dark:text-zinc-400 border border-transparent hover:border-zinc-700'
                          }`}
                        >
                          <Wind className={`w-3.5 h-3.5 ${isAutumnAudioOn ? 'animate-pulse text-zinc-300' : ''}`} />
                          <span>{isAutumnAudioOn ? 'Шелест листя увімкнено ' : 'Увімкнути шелест листя '}</span>
                        </button>
                      </div>

                      <div className="text-[10px] text-zinc-300/80 text-center font-mono">
                         Торкніться екрана для вихору листя, золотих іскорок та пориву вітру
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. ЗИМОВА ТЕМА */}
                <div
                  onClick={(e) => handleSelectAppTheme('winter', 'Зимова', '', e)}
                  className={`p-3.5 rounded-xl text-left cursor-pointer transition-all border flex flex-col justify-between gap-3 relative overflow-hidden select-none active:scale-[0.98] ${
                    activeAppTheme === 'winter'
                      ? 'border-cyan-400 dark:border-cyan-300 bg-cyan-500/10 dark:bg-cyan-400/10 shadow-xs ring-2 ring-cyan-400/40'
                      : 'border-zinc-800/80 bg-zinc-900/90 hover:bg-[#1f1f27] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-zinc-200 dark:text-zinc-300 flex items-center justify-center shrink-0">
                        <Snowflake className="w-4 h-4 animate-spin-slow" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-100">Зимова</div>
                        <div className="text-[10px] text-cyan-600 dark:text-zinc-300 font-medium">Казка • Час доби</div>
                      </div>
                    </div>
                    {activeAppTheme === 'winter' && (
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Легкий медитативний снігопад, кристальні сніжинки та м'яке сяйво, що змінюється за часом доби.
                  </p>

                  {/* Decorative preview bar */}
                  <div className="w-full h-8 rounded-lg bg-gradient-to-r from-[#0d1829] via-[#14233c] to-[#0a1220] border border-cyan-500/30 flex items-center justify-center gap-2 px-2">
                    <span className="text-zinc-300 text-xs"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white opacity-90 animate-pulse" />
                    <span className="w-1 h-1 rounded-full bg-cyan-200 opacity-80" />
                    <span className="text-[10px] text-cyan-200/90 font-mono">winter frost</span>
                  </div>
                </div>

                {/* 4. ВЕСНЯНА ТЕМА (ЦВІТ САКУРИ ТА ВЕСНЯНИЙ САД) */}
                <div
                  onClick={(e) => handleSelectAppTheme('spring', 'Весняна', '', e)}
                  className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-3 relative overflow-hidden cursor-pointer select-none active:scale-[0.98] ${
                    activeAppTheme === 'spring'
                      ? 'border-pink-400 dark:border-pink-300 bg-pink-500/10 dark:bg-pink-400/10 shadow-xs ring-2 ring-pink-400/40'
                      : 'border-zinc-800/80 bg-zinc-900/90 hover:bg-[#1f1f27] hover:border-zinc-700'
                  }`}
                >
                  <div className="w-full text-left flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-500 dark:text-pink-300 flex items-center justify-center shrink-0">
                          <Flower2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-100">Весняна</div>
                          <div className="text-[10px] text-pink-500 dark:text-pink-300 font-medium">Цвіт сакури • Весняний сад</div>
                        </div>
                      </div>
                      {activeAppTheme === 'spring' && (
                        <span className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Ніжні пелюстки сакури з 3D-перевертанням, сонячне проміння крізь крони, молоді пагони, нічні світлячки та весняний вітерець.
                    </p>

                    {/* Decorative preview bar */}
                    <div className="w-full h-8 rounded-lg bg-gradient-to-r from-[#21111a] via-[#2d1424] to-[#131f18] border border-pink-500/30 flex items-center justify-center gap-2 px-2">
                      <span className="text-zinc-300 text-xs"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-300 opacity-90 animate-pulse" />
                      <span className="text-zinc-200 text-xs"></span>
                      <span className="text-[10px] text-pink-200/90 font-mono">sakura & spring garden</span>
                    </div>
                  </div>

                  {/* SUB-CONTROLS FOR SPRING THEME */}
                  {activeAppTheme === 'spring' && (
                    <div className="pt-2 border-t border-pink-500/20 space-y-2.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-300">
                          Час доби атмосфери:
                        </span>
                        <span className="text-[9px] font-mono text-zinc-300">
                          {springTimeMode === 'auto' ? 'За годинником ' : springTimeMode === 'dawn' ? 'Світанок ' : springTimeMode === 'afternoon' ? 'Полудень ' : springTimeMode === 'sunset' ? 'Захід 🪻' : 'Біо-ніч '}
                        </span>
                      </div>

                      {/* Time-of-day switcher chips */}
                      <div className="grid grid-cols-5 gap-1">
                        {[
                          { id: 'auto', label: 'Авто' },
                          { id: 'dawn', label: 'Світанок' },
                          { id: 'afternoon', label: 'Полудень' },
                          { id: 'sunset', label: 'Захід' },
                          { id: 'night', label: 'Біо-ніч' },
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetSpringTimeMode(t.id);
                            }}
                            className={`py-1 px-1 rounded-lg text-[10px] font-medium text-center transition-all cursor-pointer ${
                              springTimeMode === t.id
                                ? 'bg-pink-500 text-white font-bold shadow-xs'
                                : 'bg-slate-200/70 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-white'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {/* Sound toggle & Interactive hint */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSpringAudio();
                          }}
                          className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSpringAudioOn
                              ? 'bg-pink-600/30 text-pink-300 border border-pink-500/40'
                              : 'bg-zinc-800/90/60 text-zinc-600 dark:text-zinc-400 border border-transparent hover:border-zinc-700'
                          }`}
                        >
                          <Flower2 className={`w-3.5 h-3.5 ${isSpringAudioOn ? 'animate-pulse text-zinc-300' : ''}`} />
                          <span>{isSpringAudioOn ? 'Спів весняного саду увімкнено ' : 'Увімкнути весняний сад '}</span>
                        </button>
                      </div>

                      <div className="text-[10px] text-zinc-300/80 text-center font-mono">
                         Торкніться екрана для вихору сакури або свайпніть для подиху вітру
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. ЛІТНЯ ТЕМА (МОРСЬКИЙ БРИЗ ТА ХВИЛІ) */}
                <div
                  onClick={(e) => handleSelectAppTheme('summer', 'Літня морська', '', e)}
                  className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-3 relative overflow-hidden cursor-pointer select-none active:scale-[0.98] ${
                    activeAppTheme === 'summer'
                      ? 'border-cyan-400 dark:border-cyan-300 bg-cyan-500/10 dark:bg-cyan-400/10 shadow-xs ring-2 ring-cyan-400/40'
                      : 'border-zinc-800/80 bg-zinc-900/90 hover:bg-[#1f1f27] hover:border-zinc-700'
                  }`}
                >
                  <div className="w-full text-left flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-zinc-200 dark:text-zinc-300 flex items-center justify-center shrink-0">
                          <Waves className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-100">Літня морська</div>
                          <div className="text-[10px] text-zinc-200 dark:text-zinc-300 font-medium">Морський бриз • Накочування хвиль</div>
                        </div>
                      </div>
                      {activeAppTheme === 'summer' && (
                        <span className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Шовкові 4-ярусні хвилі з мереживною піною, сонячні промені крізь воду, живі сонячні зайчики (каустика) та біолюмінесцентний неоновий планктон.
                    </p>

                    {/* Decorative preview bar */}
                    <div className="w-full h-8 rounded-lg bg-gradient-to-r from-[#06182c] via-[#092c48] to-[#041220] border border-cyan-500/30 flex items-center justify-center gap-2 px-2">
                      <span className="text-zinc-200 text-xs"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 opacity-95 animate-pulse" />
                      <span className="text-zinc-300 text-xs"></span>
                      <span className="text-[10px] text-cyan-200/90 font-mono">ocean breeze & god rays</span>
                    </div>
                  </div>

                  {/* SUB-CONTROLS FOR SUMMER THEME */}
                  {activeAppTheme === 'summer' && (
                    <div className="pt-2 border-t border-cyan-500/20 space-y-2.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-300">
                          Час доби атмосфери:
                        </span>
                        <span className="text-[9px] font-mono text-zinc-200">
                          {summerTimeMode === 'auto' ? 'За годинником ' : summerTimeMode}
                        </span>
                      </div>

                      {/* Time-of-day switcher chips */}
                      <div className="grid grid-cols-5 gap-1">
                        {[
                          { id: 'auto', label: 'Авто' },
                          { id: 'morning', label: 'Світанок' },
                          { id: 'afternoon', label: 'Полудень' },
                          { id: 'evening', label: 'Захід' },
                          { id: 'night', label: 'Біо-ніч' },
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetSummerTimeMode(t.id);
                            }}
                            className={`py-1 px-1 rounded-lg text-[10px] font-medium text-center transition-all cursor-pointer ${
                              summerTimeMode === t.id
                                ? 'bg-cyan-500 text-white font-bold shadow-xs'
                                : 'bg-slate-200/70 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-white'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {/* Sound toggle & Interactive hint */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSummerAudio();
                          }}
                          className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSummerAudioOn
                              ? 'bg-cyan-600/30 text-zinc-300 border border-cyan-500/40'
                              : 'bg-zinc-800/90/60 text-zinc-600 dark:text-zinc-400 border border-transparent hover:border-zinc-700'
                          }`}
                        >
                          <Waves className={`w-3.5 h-3.5 ${isSummerAudioOn ? 'animate-pulse text-zinc-200' : ''}`} />
                          <span>{isSummerAudioOn ? 'Шум хвиль увімкнено ' : 'Увімкнути шум хвиль '}</span>
                        </button>
                      </div>

                      <div className="text-[10px] text-zinc-200/80 text-center font-mono">
                         Торкніться екрана для розбіжних кіл на воді та бризок
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* РОЗДІЛ: ОБОЛОНКИ ТАЙМЕРА */}
        {/* ==================================================================== */}
        <div id="more-sec-timer_skins" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-1 ${accentClasses.card}`}>
          <div
            onClick={() => setIsTimerSkinModalOpen(true)}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("timer_skins", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 truncate flex items-center gap-2">
                  <span>Оболонки таймера</span>
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">
                  Виберіть стиль та оформлення головного лічильника
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('timer_skins')}
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-300 transition-colors" />
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* РОЗДІЛ: ВІДТІНОК (ЗГОРТАЄТЬСЯ) */}
        {/* ==================================================================== */}
        <div id="more-sec-theme" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-3 ${openSections.theme ? accentClasses.activeCard : 'border-zinc-800/80'} ${openSections.theme ? '' : accentClasses.card}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection('theme')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('theme'); }}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group select-none ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("theme", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 truncate flex items-center gap-2">
                  <span>Загальний акцент</span>
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">
                  Оберіть акцентний відтінок інтерфейсу
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('theme')}
              {openSections.theme ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {openSections.theme && (
            <div className="p-4 pt-0 border-t border-zinc-800/80 space-y-5 mt-1">
              {/* Акцентні відтінки */}
              <div className="pt-3 space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'gray', name: 'Шляхетний сірий', color: 'bg-slate-600' },
                      { id: 'charcoal', name: 'Глибокий антрацит', color: 'bg-zinc-700' },
                      { id: 'sage', name: 'Тьмяна шавлія', color: 'bg-[#6b7c75]' },
                      { id: 'taupe', name: 'Теплий тауп', color: 'bg-[#786b62]' },
                      { id: 'slate-blue', name: 'Попелястий індиго', color: 'bg-[#5b6a82]' },
                      { id: 'ash-olive', name: 'Попеляста олива', color: 'bg-[#5f6959]' },
                      { id: 'green', name: 'Смарагдовий', color: 'bg-emerald-600' },
                    ].map((item) => {
                      const active = currentAccent === item.id;
                      
                      const getAccentBorderClass = (id: string) => {
                        switch (id) {
                          case 'charcoal': return 'border-zinc-500 dark:border-zinc-400 bg-zinc-500/10 dark:bg-zinc-400/15 text-zinc-600 dark:text-zinc-300';
                          case 'sage': return 'border-stone-500 dark:border-stone-400 bg-stone-500/10 dark:bg-stone-400/15 text-stone-600 dark:text-stone-300';
                          case 'taupe': return 'border-[#786b62]/40 bg-[#786b62]/10 text-[#786b62] dark:text-[#c4b5a8]';
                          case 'slate-blue': return 'border-slate-500/50 bg-slate-500/10 text-slate-700 dark:text-slate-300';
                          case 'ash-olive': return 'border-[#5f6959]/50 bg-[#5f6959]/10 text-[#5f6959] dark:text-[#aab3a4]';
                          case 'green': return 'border-[emerald-600] dark:border-[emerald-400] bg-emerald-600/10 dark:bg-[emerald-400]/15 text-[emerald-600] dark:text-[emerald-400]';
                          case 'gray':
                          default: return 'border-slate-500 dark:border-slate-400 bg-slate-500/10 dark:bg-slate-400/15 text-slate-600 dark:text-slate-300';
                        }
                      };
                      
                      const activeClasses = getAccentBorderClass(item.id);

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onUpdateAccent?.(item.id)}
                          className={`p-3 rounded-xl text-left cursor-pointer transition-all border flex items-center justify-between gap-2 ${
                            active
                              ? `${activeClasses.split(' ').slice(0, 3).join(' ')} shadow-xs scale-102`
                              : 'border-slate-200 dark:border-[#33333d] bg-white/80 dark:bg-[#23232c]/80 hover:border-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-3.5 h-3.5 rounded-full ${item.color} shrink-0 shadow-xs`} />
                            <span className="text-xs font-bold text-slate-800 dark:text-[#f4f4f5] leading-tight truncate">{item.name}</span>
                          </div>
                          {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* РОЗДІЛ: РЕЖИМ РАМОК ТА ОФОРМЛЕННЯ (ЗГОРТАЄТЬСЯ) */}
        {/* ==================================================================== */}
        <div id="more-sec-frameless_style" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-3 ${openSections.frameless_style ? accentClasses.activeCard : 'border-zinc-800/80'} ${accentClasses.card}`}>
          <div
            onClick={() => toggleSection('frameless_style')}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("frameless_style", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 truncate">
                  Налаштування вікон
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">
                  Прозорість, керування рамками та закругленням
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('frameless_style')}
              {openSections.frameless_style ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {openSections.frameless_style && (
            <div className="p-4 pt-0 border-t border-zinc-800/80 space-y-4 mt-1">
              {/* 1. БЕЗ РАМОК */}
              <div className="flex items-center justify-between pt-3">
                <div>
                  <label className="text-xs font-bold text-zinc-100 block">
                    Без рамок
                  </label>
                  <p className="text-[10px] text-zinc-400">
                    Приховує контурні лінії карток для монолітного вигляду
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleFrameless(!framelessMode)}
                  className={`w-10 h-5 rounded-full p-1 transition-colors cursor-pointer flex-none ${framelessMode ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'}`}
                >
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${framelessMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* 3. ПРОЗОРІСТЬ ВІКОН ТА ПАНЕЛЕЙ */}
              <div className="pt-3 border-t border-zinc-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-zinc-100 block">
                      Прозорість вікон та меню
                    </label>
                    <p className="text-[10px] text-zinc-400">
                      Регулювання прозорості карток, панелей та нижнього меню
                    </p>
                  </div>
                  <span className="text-xs font-black font-mono text-zinc-200 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {windowsOpacity}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-mono">0%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={windowsOpacity}
                    onChange={(e) => onUpdateWindowsOpacity?.(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-400"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">100%</span>
                </div>
              </div>



              {/* 2. ЗАКРУГЛЕННЯ КУТІВ РАМОК */}
              <div className="pt-3 border-t border-zinc-800/80">
                <p className="text-xs text-zinc-400 font-medium mb-2.5">
                  Закруглення кутів рамок:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sharp', label: '8px' },
                    { id: 'soft', label: '14px' },
                    { id: 'standard', label: '20px' },
                    { id: '24px', label: '24px' },
                    { id: 'pill', label: '28px' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleSelectRadius(r.id)}
                      className={`p-3 rounded-xl text-center border transition-all cursor-pointer font-bold ${
                        cardRadius === r.id
                          ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500/30 shadow-xs'
                          : 'bg-white/80 dark:bg-[#23232c]/80 border-slate-200 dark:border-[#33333d] text-slate-700 dark:text-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. ПОВНОЕКРАННИЙ РЕЖИМ */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-zinc-100 block flex items-center gap-1.5">
                    {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-indigo-500" /> : <Maximize className="w-3.5 h-3.5 text-indigo-500" />}
                    <span>Повноекранний режим</span>
                  </label>
                  <p className="text-[10px] text-zinc-400">
                    Розгортає веб-додаток на весь екран без панелей браузера
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs ${
                    isFullscreen
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                      : 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/25 active:scale-95'
                  }`}
                  title={isFullscreen ? 'Вийти з повного екрана' : 'Увімкнути повний екран'}
                >
                  {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                  <span>{isFullscreen ? 'Згорнути' : 'На весь екран'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* КАТЕГОРІЯ 2: КОРИСНІ ДРІБНИЦІ */}
        {/* ==================================================================== */}
        <div className="w-full pt-5 pb-1 flex items-center justify-between gap-2 border-b border-zinc-800/80 mb-2.5 mt-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-purple-500/15 text-zinc-300 flex items-center justify-center shrink-0">
              <Brain className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300">
              Корисні дрібниці
            </h2>
          </div>
        </div>
            {/* ==================================================================== */}
            {/* РОЗДІЛ: ПРОГРЕС ОДУЖАННЯ ЗА ВООЗ (ЗГОРТАЄТЬСЯ) */}
            {/* ==================================================================== */}
            <div id="more-sec-who_progress" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-3 ${openSections.who_progress ? accentClasses.activeCard : 'border-zinc-800/80'} ${accentClasses.card}`}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleSection('who_progress')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('who_progress'); }}
                className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group select-none ${accentClasses.btn}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                    {getSectionRefractedPictogram("who_progress", "w-5 h-5")}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-zinc-100 truncate flex items-center gap-2">
                      <span>Прогрес одужання за ВООЗ</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {whoAchievedCount} з {HEALTH_MILESTONES.length} медичних рубежів ВООЗ досягнуто
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-none">
                  {renderPinButton('who_progress')}
                  {openSections.who_progress ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </div>
              </div>

              {openSections.who_progress && (
                <div className="p-4 pt-1 border-t border-zinc-800/80 space-y-4 mt-1">
                  {/* Body Systems Progress */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-zinc-200 flex items-center justify-between">
                      <span>Регенерація систем організму:</span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {Math.round(whoSystems.reduce((acc, s) => acc + s.progress, 0) / Math.max(1, whoSystems.length))}% загалом
                      </span>
                    </div>

                    <div className="space-y-2">
                      {whoSystems.map((sys, idx) => (
                        <div key={idx} className="p-3 bg-zinc-900/60 hover:bg-zinc-900/80 rounded-xl border border-zinc-800/80 hover:border-zinc-700/60 transition-all">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-zinc-100">{sys.name}</span>
                            <span className="text-xs font-mono font-bold text-emerald-400">{sys.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/30">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                              style={{ width: `${sys.progress}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1.5 leading-snug">
                            {sys.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Health Milestones */}
                  <div className="pt-3 border-t border-zinc-800/80">
                    <div className="text-xs font-bold text-zinc-200 mb-2.5 flex items-center justify-between">
                      <span>Хронологічні рубежі одужання ВООЗ:</span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {whoAchievedCount}/{HEALTH_MILESTONES.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {HEALTH_MILESTONES.map((m) => {
                        const isDone = totalFreeMs >= m.t;
                        const cleanTitle = m.title.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

                        return (
                          <div
                            key={m.id}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                              isDone
                                ? 'bg-zinc-900/80 border-emerald-500/30 text-zinc-100'
                                : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-300'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="font-bold truncate text-zinc-100">{cleanTitle}</div>
                              <div className="text-[10px] text-zinc-400 mt-0.5 leading-snug">{m.description}</div>
                            </div>

                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shrink-0 border ${
                              isDone
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-zinc-800/90 text-zinc-400 border-zinc-700/50'
                            }`}>
                              {isDone ? 'Досягнуто' : 'У процесі'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Button to open full WHO modal */}
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          window.dispatchEvent(new Event('open-who-milestones-modal'));
                        } catch {}
                      }}
                      className="w-full mt-3 py-2.5 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 font-semibold border border-zinc-700/60 text-xs transition cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                    >
                      <span>Розгорнути детальний календар-хронометр ВООЗ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ==================================================================== */}
            {/* РОЗДІЛ: ЩОДЕННИК ВДДЯЧНОСТІ (ЗГОРТАЄТЬСЯ) */}
            {/* ==================================================================== */}
            <div id="more-sec-gratitude_journal" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-3 ${openSections.gratitude_journal ? accentClasses.activeCard : 'border-zinc-800/80'} ${accentClasses.card}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection('gratitude_journal')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('gratitude_journal'); }}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group select-none ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("gratitude_journal", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 truncate flex items-center gap-2">
                  <span>Щоденник вдячності</span>
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">
                  3 приємні моменти щодня для ресурсу
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('gratitude_journal')}
              {openSections.gratitude_journal ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {openSections.gratitude_journal && (
            <div className="p-4 pt-0 border-t border-zinc-800/80 space-y-3 mt-1">
              <div className="pt-2">
                <GratitudeJournalCard isFullView={true} />
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* РОЗДІЛ: ЩОДЕННІ СПРАВИ (ЗГОРТАЄТЬСЯ) */}
        {/* ==================================================================== */}
        {/* ==================================================================== */}
        {/* РОЗДІЛ: ЩОДЕННІ СПРАВИ (ЗГОРТАЄТЬСЯ) */}
        {/* ==================================================================== */}
        <div id="more-sec-daily_steps" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-3 ${openSections.daily_steps ? accentClasses.activeCard : 'border-zinc-800/80'} ${accentClasses.card}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection('daily_steps')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('daily_steps'); }}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group select-none ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("daily_steps", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 truncate flex items-center gap-2">
                  <span>Щоденні справи</span>
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">
                  Список щоденних мікро-кроків та завдань
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('daily_steps')}
              {openSections.daily_steps ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {openSections.daily_steps && (
            <div className="p-4 pt-0 border-t border-zinc-800/80 space-y-3 mt-1">
              <div className="pt-2">
                <DailyStepsSection isFullView={true} isOpen={true} onToggle={() => {}} />
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* РОЗДІЛ: МЕНТАЛЬНЕ ЗДОРОВ'Я (ЗГОРТАЄТЬСЯ) */}
        {/* ==================================================================== */}
        <div id="more-sec-mental_health" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-3 ${openSections.mental_health ? accentClasses.activeCard : 'border-zinc-800/80'} ${accentClasses.card}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection('mental_health')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('mental_health'); }}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group select-none ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("mental_health", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 truncate flex items-center gap-2">
                  <span>Ментальне здоров'я</span>
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">
                  Дофамінові практики та ритуали балансу
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('mental_health')}
              {openSections.mental_health ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {openSections.mental_health && (
            <div className="p-4 pt-0 border-t border-zinc-800/80 space-y-3 mt-1">
              <div className="pt-2">
                <MentalHealthCard isFullView={true} />
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* РОЗДІЛ: МОЇ НОТАТКИ (ЗГОРТАЄТЬСЯ) */}
        {/* ==================================================================== */}
        <div id="more-sec-notes" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-3 ${openSections.notes ? accentClasses.activeCard : 'border-zinc-800/80'} ${accentClasses.card}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection('notes')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('notes'); }}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group select-none ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("notes", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 truncate">
                  Мої нотатки
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">
                  Швидкі замітки та думки
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('notes')}
              {openSections.notes ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {openSections.notes && (
            <div className="p-4 pt-0 border-t border-zinc-800/80 space-y-3 mt-1">
              <textarea
                value={notes}
                onChange={(e) => handleUpdateNotes(e.target.value)}
                placeholder="Ваші нотатки..."
                className="w-full h-32 p-3 text-sm rounded-xl border border-slate-300 dark:border-[#33333d] bg-slate-50/80 dark:bg-black/40 text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* КАТЕГОРІЯ 3: ТЕХНІЧНІ ПРОЦЕСИ */}
        {/* ==================================================================== */}
        <div className="w-full pt-5 pb-1 flex items-center justify-between gap-2 border-b border-zinc-800/80 mb-2.5 mt-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-zinc-800/80 text-zinc-300 border border-zinc-700/50 flex items-center justify-center shrink-0">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300">
              Технічні процеси
            </h2>
          </div>
        </div>
            {/* ==================================================================== */}
            {/* РОЗДІЛ: БАЗА ДУМОК АНАЛІЗАТОРА (800 ДУМОК) */}
            {/* ==================================================================== */}
            <div id="more-sec-analyzer_thoughts_db" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-3 ${openSections.analyzer_thoughts_db ? accentClasses.activeCard : 'border-zinc-800/80'} ${accentClasses.card}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection('analyzer_thoughts_db')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('analyzer_thoughts_db'); }}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group select-none ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("analyzer_thoughts_db", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 truncate">
                  База думок Аналізатора
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">
                  Перегляд усіх категорій: абсурд, гумор, наука, природа, поради, підказки
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('analyzer_thoughts_db')}
              {openSections.analyzer_thoughts_db ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {openSections.analyzer_thoughts_db && (
            <div className="p-3 pt-0 border-t border-zinc-800/80 space-y-3 mt-1">
              <div className="pt-2 h-[560px]">
                <AnalyzerThoughtsDatabase />
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* РОЗДІЛ: РЕЗЕРВНЕ КОПІЮВАННЯ ТА ДАНІ (ЗГОРТАЄТЬСЯ) */}
        <div id="more-sec-backup" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-3 ${openSections.backup ? accentClasses.activeCard : 'border-zinc-800/80'} ${accentClasses.card}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection('backup')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('backup'); }}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group select-none ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("backup", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 truncate">
                  Резервне копіювання даних
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">
                  Експорт та відновлення прогресу у файл
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('backup')}
              {openSections.backup ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {openSections.backup && (
            <div className="p-4 pt-0 border-t border-zinc-800/80 space-y-3 mt-1">
              <p className="text-xs text-zinc-200 pt-2">
                Збережіть файл резервної копії, щоб ніколи не втратити свій прогрес, статистику, цілі та дерева у разі зміни пристрою.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-[#176d53] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Експортувати бекап (JSON)</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportStateTxt}
                  className="py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>Завантажити історію стану (TXT)</span>
                </button>

                <label className="py-2.5 px-3 sm:col-span-2 border border-zinc-700/80 hover:bg-white/60 dark:hover:bg-zinc-800/60 rounded-xl text-xs font-semibold text-slate-800 dark:text-[#f4f4f5] flex items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                  <Upload className="w-4 h-4 text-[emerald-600] dark:text-[emerald-400]" />
                  <span>Відновити з бекапу (JSON)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackupFile}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Безпека та відновлення вікон */}
              <div className="pt-3 mt-2 border-t border-slate-200/60 dark:border-zinc-800/60 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Захист та відновлення вікон</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Якщо ви закріпили картки і бажаєте повернути їх усі у головну стрічку, або якщо виникла невідповідність даних — скористайтесь швидким скиданням.
                </p>

                {safetyFeedback && (
                  <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 text-center animate-fadeIn">
                    {safetyFeedback}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleRestoreAllWindows}
                    className="py-2.5 px-3 bg-zinc-800/90 hover:bg-zinc-700 border border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-[#f4f4f5] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Повернути всі вікна у стрічку</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleVerifyIntegrity}
                    className="py-2.5 px-3 bg-zinc-800/90 hover:bg-zinc-700 border border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-[#f4f4f5] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Перевірити цілісність даних</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* РОЗДІЛ: ОПТИМІЗАЦІЯ ПРОДУКТИВНОСТІ ТА ЕНЕРГОЗБЕРЕЖЕННЯ (ЗГОРТАЄТЬСЯ) */}
        {/* ==================================================================== */}
        {/* ==================================================================== */}
        {/* РОЗДІЛ: ОПТИМІЗАЦІЯ ПРОДУКТИВНОСТІ ТА ЕНЕРГОЗБЕРЕЖЕННЯ (ЗГОРТАЄТЬСЯ) */}
        {/* ==================================================================== */}
        <div id="more-sec-perf_optimization" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-3 ${openSections.perf_optimization ? accentClasses.activeCard : 'border-zinc-800/80'} ${accentClasses.card}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              toggleSection('perf_optimization');
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('perf_optimization'); }}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group select-none ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("perf_optimization", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-100 truncate">
                    Оптимізація продуктивності
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                    perfBoost 
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' 
                      : 'bg-zinc-800/90 text-zinc-400'
                  }`}>
                    {perfBoost ? 'Вкл' : 'Викл'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 truncate">
                  Зупинка важких часток, охолодження ЦП та економія батареї
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('perf_optimization')}
              {openSections.perf_optimization ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {openSections.perf_optimization && (
            <div className="p-4 pt-2 border-t border-zinc-800/80">
              <PerformanceOptimizationSection 
                perfBoost={perfBoost}
                onTogglePerfBoost={handleTogglePerfBoost}
                accentClasses={accentClasses}
              />
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* РОЗДІЛ: ОЧИЩЕННЯ КЕШУ */}
        {/* ==================================================================== */}
        <div id="more-sec-cache_cleanup" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-3 ${openSections.cache_cleanup ? accentClasses.activeCard : 'border-zinc-800/80'} ${accentClasses.card}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              toggleSection('cache_cleanup');
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('cache_cleanup'); }}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group select-none ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("cache_cleanup", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 truncate">
                  Очищення даних та кешу
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">
                  Видалення тимчасових даних, скидання кешу додатку
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('cache_cleanup')}
              {openSections.cache_cleanup ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {openSections.cache_cleanup && (
            <div className="p-4 pt-2 border-t border-zinc-800/80">
              <CacheCleanupSection />
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* РОЗДІЛ: МОНІТОРИНГ РЕСУРСІВ (ПАМ'ЯТЬ, ЦП, БАТАРЕЯ) (ЗГОРТАЄТЬСЯ) */}
        {/* ==================================================================== */}
        <div id="more-sec-monitor" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-3 ${openSections.monitor ? accentClasses.activeCard : 'border-zinc-800/80'} ${accentClasses.card}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              toggleSection('monitor');
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('monitor'); }}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group select-none ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("monitor", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 truncate">
                  Моніторинг ресурсів (Кеш, ЦП, ОЗП, FPS)
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">
                  Апаратні метрики: StorageManager, Event Loop, Температура та FPS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('monitor')}
              {openSections.monitor ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {openSections.monitor && (
            <div className="p-4 pt-2 border-t border-zinc-800/80">
              <SystemResourceMonitor 
                perfBoost={perfBoost}
                onTogglePerfBoost={handleTogglePerfBoost}
              />
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* 10. РОЗДІЛ: ІНФОРМАЦІЯ ПРО РОЗРОБНИКА ТА ДОНАТ (ЗГОРТАЄТЬСЯ) */}
        {/* ==================================================================== */}
        <div id="more-sec-developer" className={`bg-[#18181f]/90 hover:bg-[#1f1f27] border border-zinc-800/80 hover:border-zinc-700 rounded-2xl shadow-xs overflow-hidden transition-all backdrop-blur-xl mt-3 ${openSections.developer ? accentClasses.activeCard : 'border-zinc-800/80'} ${accentClasses.card}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggleSection('developer')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('developer'); }}
            className={`w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors group select-none ${accentClasses.btn}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                {getSectionRefractedPictogram("developer", "w-5 h-5")}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-zinc-100 truncate">
                  Підтримка розробника
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">
                  Автор проекту та банка Monobank
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              {renderPinButton('developer')}
              {openSections.developer ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {openSections.developer && (
            <div className="p-4 pt-0 border-t border-zinc-800/80 space-y-3 mt-1">
              <p className="text-xs text-zinc-200 pt-2 flex items-center flex-wrap gap-1">
                <span>Цей додаток створено з турботою про ваше здоров'я та вільне від паління життя. Якщо додаток допомагає вам або ви хочете подякувати за розробку — підтримайте проєкт донатом на банку Monobank!</span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30 inline-block align-baseline shrink-0" />
              </p>

              <div className="pt-1">
                <a
                  href="https://send.monobank.ua/jar/7HQL5m91BK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:scale-[1.01]"
                >
                  <Coffee className="w-4 h-4" />
                  <span>Підтримати розробника (Банка Monobank)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80 ml-1" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <TimerSkinModal
        isOpen={isTimerSkinModalOpen}
        onClose={() => setIsTimerSkinModalOpen(false)}
        currentStyle={currentTimerStyle}
        onSelectStyle={handleSelectTimerStyle}
        previewTimeText={previewTimeText}
      />
    </div>
  );

  if (isOverlayMode) {
    if (overlaySectionKey === 'timer_skins') {
      return (
        <TimerSkinModal
          isOpen={true}
          onClose={() => {
            setIsTimerSkinModalOpen(false);
            if (onCloseOverlay) onCloseOverlay();
          }}
          currentStyle={currentTimerStyle}
          onSelectStyle={handleSelectTimerStyle}
          previewTimeText={previewTimeText}
        />
      );
    }

    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        {/* Backdrop with heavy blur and dim */}
        <div 
          className="absolute inset-0 bg-zinc-950/70 backdrop-blur-md cursor-pointer" 
          onClick={onCloseOverlay}
        />
        
        {/* Modal Dialog Body */}
        <div className="relative w-[92%] sm:w-full max-w-md bg-white/95 dark:bg-[#1c1c22]/95 border border-zinc-800/80 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-fade-in z-10 text-left">
          
          {/* Header */}
          <div className="p-4 border-b border-zinc-800/60 flex items-center justify-between bg-zinc-900/50 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-purple-500/10 text-zinc-300">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </span>
              <div className="text-left">
                <h3 className="text-xs font-black text-zinc-100 uppercase tracking-widest leading-none">
                  {(overlaySectionKey as any) === 'calc' ? 'Калькулятор економії' :
                   (overlaySectionKey as any) === 'themes' ? 'Теми оформлення' :
                   (overlaySectionKey as any) === 'timer_skins' ? 'Оболонки таймера' :
                   (overlaySectionKey as any) === 'theme' ? 'Загальний акцент' :
                   (overlaySectionKey as any) === 'frameless_style' ? 'Налаштування вікон' :
                   (overlaySectionKey as any) === 'who_progress' ? 'Прогрес одужання за ВООЗ' :
                   (overlaySectionKey as any) === 'gratitude_journal' ? 'Щоденник вдячності' :
                   (overlaySectionKey as any) === 'daily_steps' ? 'Кроки здоров\'я' :
                   (overlaySectionKey as any) === 'mental_health' ? 'Психологічна допомога' :
                   (overlaySectionKey as any) === 'notes' ? 'Особисті нотатки' :
                   (overlaySectionKey as any) === 'analyzer_thoughts_db' ? 'Лог думок аналізатора' :
                   (overlaySectionKey as any) === 'backup' ? 'Резервне копіювання' :
                   (overlaySectionKey as any) === 'perf_optimization' ? 'Оптимізація швидкодії' :
                   (overlaySectionKey as any) === 'monitor' ? 'Монітор ресурсів' :
                   (overlaySectionKey as any) === 'developer' ? 'Режим розробника' : 'Перенесений розділ'}
                </h3>
                <p className="text-[9px] text-zinc-400 mt-1 font-medium leading-none">
                  Швидкий віджет на головній
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={onCloseOverlay}
              className="p-1.5 rounded-full hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Scrollable Section Content Container */}
          <div className="p-4 overflow-y-auto flex-1 text-left">
            {standardLayout}
          </div>
        </div>
      </div>
    );
  }

  return standardLayout;
};
