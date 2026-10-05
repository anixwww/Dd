import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  TabType,
  MoneySettings,
  DayRating,
  Streak,
  GoalsState,
  TreeState,
  SavingsGoal,
  CompletedGoal,
} from './types';
import { CounterTab } from './components/CounterTab';


import { SetupModal, RelapseModal } from './components/Modals';
import { OnboardingModal } from './components/OnboardingModal';
import { GuidedTourModal } from './components/GuidedTourModal';
import { SosCravingTimerModal } from './components/SosCravingTimerModal';
import { calculateCigsAvoided, calculateTotalSaved } from './utils/moneyCalculator';
import { checkAndApplyAutoEco } from './utils/autoEcoManager';
import { HourlyAchievementModal } from './components/HourlyAchievementModal';
import { CravingDensityScaleWidget } from './components/CravingDensityScaleWidget';

// Background Animations (Cosmic Nebula & Eco)
import { AiGradientBackground } from './components/AiGradientBackground';

// Tab Views
import { HealthTab } from './components/HealthTab/index';
import { MoreTab } from './components/MoreTab';
import { SosTab } from './components/SosTab';
import { StateTab } from './components/StateTab';
import {
  Clock,
  HeartPulse,
  Smile,
  Trees,
  Hourglass,
  MoreHorizontal,
  ShieldAlert,
  X,
  Maximize2
} from 'lucide-react';
import {
  NavHomeIcon,
  NavStateIcon,
  NavSosIcon,
  NavMoreIcon
} from './components/BottomNavIcons';

const STORAGE_KEYS = {
  START: 'quit-smoking:start',
  MONEY: 'quit-smoking:money',
  DAYS: 'quit-smoking:days',
  STREAKS: 'quit-smoking:streaks',
  REASONS: 'quit-smoking:reasons',
  GOALS: 'quit-smoking:goals',
  TREE: 'quit-smoking:tree',
  THEME: 'quit-smoking:theme',
  ACCENT: 'quit-smoking:accent',
  APP_THEME: 'quit-smoking:app-theme'
};

function AppContent() {
  const [activeTab, setActiveTab] = React.useState<TabType>('counter');
  const [showBottomNav, setShowBottomNav] = React.useState<boolean>(true);
  const [money, setMoney] = React.useState<MoneySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MONEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          perDay: parsed.perDay ?? parsed.cigsPerDay ?? 20,
          packPrice: parsed.packPrice ?? parsed.pricePerPack ?? 100,
          packSize: parsed.packSize ?? parsed.cigsPerPack ?? 20,
          cur: parsed.cur ?? parsed.currency ?? '₴',
          minutesPerCig: parsed.minutesPerCig ?? 7,
          priceHistory: parsed.priceHistory ?? []
        };
      }
    } catch {
      // Fallback to default
    }
    return { perDay: 20, packPrice: 100, packSize: 20, cur: '₴', minutesPerCig: 7 };
  });
  const [economyMode, setEconomyMode] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:eco-mode') === 'true';
    } catch {
      return false;
    }
  });
  const [appTheme, setAppTheme] = React.useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.APP_THEME) || 'ai_gradient';
    } catch {
      return 'ai_gradient';
    }
  });

  // Local state that is not yet migrated
  const [startDate, setStartDate] = React.useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.START);
      if (!saved) return Date.now();
      const num = Number(saved);
      return !isNaN(num) && num > 0 ? num : Date.now();
    } catch {
      return Date.now();
    }
  });
  
  const [days, setDays] = React.useState<Record<string, DayRating>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAYS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [streaks, setStreaks] = React.useState<Streak[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STREAKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reasons, setReasons] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REASONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [goals, setGoals] = React.useState<GoalsState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : { base: 0, queue: [], done: [] };
    } catch {
      return { base: 0, queue: [], done: [] };
    }
  });

  const [treeState, setTreeState] = React.useState<TreeState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TREE);
      return saved ? JSON.parse(saved) : { forest: [], current: null };
    } catch {
      return { forest: [], current: null };
    }
  });

  const [accent, setAccent] = React.useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACCENT) || 'gray';
    } catch {
      return 'gray';
    }
  });

  const [appToast, setAppToast] = React.useState<string | null>(null);
  const [navScale, setNavScale] = React.useState<number>(1);
  const [activeOverlaySection, setActiveOverlaySection] = React.useState<any>(null);
  const [isGuidedTourOpen, setIsGuidedTourOpen] = React.useState<boolean>(false);
  const [isSetupOpen, setIsSetupOpen] = React.useState(false);
  const [isRelapseOpen, setIsRelapseOpen] = React.useState(false);
  const [isSosOpen, setIsSosOpen] = React.useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = React.useState(false);
  const [isSosTimerModalOpen, setIsSosTimerModalOpen] = React.useState(false);
  const [isTimerStarted, setIsTimerStarted] = React.useState(() => {
    try {
      return localStorage.getItem('quit-smoking:calculator-saved') === 'true';
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    const applyMinimalIndicators = () => {
      try {
        const isMinimal = localStorage.getItem('quit-smoking:minimal-indicators') === 'true';
        if (isMinimal) {
          document.documentElement.setAttribute('data-minimal-indicators', 'true');
        } else {
          document.documentElement.removeAttribute('data-minimal-indicators');
        }
      } catch {}
    };

    applyMinimalIndicators();
    window.addEventListener('minimal-indicators-change', applyMinimalIndicators);
    window.addEventListener('storage', applyMinimalIndicators);

    return () => {
      window.removeEventListener('minimal-indicators-change', applyMinimalIndicators);
      window.removeEventListener('storage', applyMinimalIndicators);
    };
  }, []);



  // Habits/Tasks Reminders state
  const [activeHabitReminder, setActiveHabitReminder] = useState<any | null>(null);
  const [reminderReaction, setReminderReaction] = useState<'positive' | 'negative' | 'dismissed' | null>(null);

  // Gratitude Journal Reminder state
  const [isGratitudeReminderOpen, setIsGratitudeReminderOpen] = useState(false);
  const [gratitudeG1, setGratitudeG1] = useState('');
  const [gratitudeG2, setGratitudeG2] = useState('');
  const [gratitudeG3, setGratitudeG3] = useState('');
  const [gratitudeFeedback, setGratitudeFeedback] = useState<'positive' | 'postponed' | 'dismissed' | null>(null);

  // Yin-Yang / Harmony mode state tracking
  const [isEverythingHidden, setIsEverythingHidden] = useState<boolean>(false);

  React.useEffect(() => {
    const handleYinYangChange = (e: any) => {
      if (typeof e?.detail === 'boolean') {
        setIsEverythingHidden(e.detail);
      } else {
        try {
          setIsEverythingHidden(localStorage.getItem('quit-smoking:everything-hidden') === 'true');
        } catch {}
      }
    };
    window.addEventListener('eden-harmony-mode-change', handleYinYangChange);
    window.addEventListener('storage', handleYinYangChange);
    return () => {
      window.removeEventListener('eden-harmony-mode-change', handleYinYangChange);
      window.removeEventListener('storage', handleYinYangChange);
    };
  }, []);

  React.useEffect(() => {
    const checkHabitReminders = () => {
      try {
        const d = new Date();
        const nowHourMin = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        const todayDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const nowTs = Date.now();

        // 1. Check Gratitude Journal Reminder FIRST
        const gratitudeTime = localStorage.getItem('quit-smoking:gratitude-reminder-time');
        if (gratitudeTime && !isGratitudeReminderOpen) {
          const entriesStr = localStorage.getItem('quit-smoking:gratitude-journal-entries') || '[]';
          const entries = JSON.parse(entriesStr);
          const hasTodayEntry = entries.some((e: any) => e.date === todayDateStr && (e.g1 || e.g2 || e.g3));

          if (!hasTodayEntry) {
            const disabledToday = localStorage.getItem('quit-smoking:gratitude-disabled-for-today');
            const postponedUntilStr = localStorage.getItem('quit-smoking:gratitude-postponed-until');
            const postponedUntil = postponedUntilStr ? Number(postponedUntilStr) : 0;

            if (disabledToday !== todayDateStr && nowTs >= postponedUntil) {
              const [grHour, grMin] = gratitudeTime.split(':').map(Number);
              const grMinutes = grHour * 60 + grMin;
              const nowMinutes = d.getHours() * 60 + d.getMinutes();

              if (nowMinutes >= grMinutes) {
                const lastShownKey = 'quit-smoking:gratitude-last-shown';
                const lastShownStr = localStorage.getItem(lastShownKey);
                if (!lastShownStr || (nowTs - Number(lastShownStr)) >= 15 * 60 * 1000) {
                  setGratitudeG1('');
                  setGratitudeG2('');
                  setGratitudeG3('');
                  setIsGratitudeReminderOpen(true);
                  setGratitudeFeedback(null);
                  localStorage.setItem(lastShownKey, String(nowTs));
                  return; // Don't show both popups simultaneously
                }
              }
            }
          }
        }

        // 2. Check Mental Health Habit Reminders
        const habitsStr = localStorage.getItem('quit-smoking:mental-health-habits-config');
        if (!habitsStr) return;
        const habits = JSON.parse(habitsStr);
        if (!Array.isArray(habits)) return;

        // Get today's log to see if it's already completed
        const todayKey = `quit-smoking:mental-health-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const todayLogStr = localStorage.getItem(todayKey);
        const todayLog = todayLogStr ? JSON.parse(todayLogStr) : {};

        for (const h of habits) {
          // If already completed today, skip
          if (todayLog[h.id] === true) continue;

          // If user selected "Do not remind" for today, skip
          if (h.reminderDisabledForToday === todayDateStr) continue;

          // If postponed and postpone time is not yet reached, skip
          if (h.reminderPostponedUntil && nowTs < h.reminderPostponedUntil) continue;

          // If there is a scheduled time and it is reached
          if (h.scheduledTime) {
            const [schHour, schMin] = h.scheduledTime.split(':').map(Number);
            const schMinutes = schHour * 60 + schMin;
            const nowMinutes = d.getHours() * 60 + d.getMinutes();

            if (nowMinutes >= schMinutes) {
              // Avoid spamming within 15 minutes
              const lastReminderKey = `quit-smoking:last-reminder-shown-${h.id}`;
              const lastShownStr = localStorage.getItem(lastReminderKey);
              if (lastShownStr && (nowTs - Number(lastShownStr)) < 15 * 60 * 1000) {
                continue;
              }

              setActiveHabitReminder(h);
              setReminderReaction(null);
              localStorage.setItem(lastReminderKey, String(nowTs));
              break;
            }
          }
        }
      } catch {}
    };

    const interval = setInterval(checkHabitReminders, 12000);
    return () => clearInterval(interval);
  }, [isGratitudeReminderOpen]);

  const handleSaveGratitudeReminder = (action: 'save' | 'postpone' | 'dismiss') => {
    try {
      const d = new Date();
      const todayDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      if (action === 'save') {
        const formattedDate = d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
        const entry = {
          id: todayDateStr,
          date: todayDateStr,
          formattedDate,
          g1: gratitudeG1.trim(),
          g2: gratitudeG2.trim(),
          g3: gratitudeG3.trim(),
          updatedAt: Date.now()
        };

        const entriesStr = localStorage.getItem('quit-smoking:gratitude-journal-entries') || '[]';
        const entries = JSON.parse(entriesStr).filter((e: any) => e.date !== todayDateStr);
        const updatedList = [entry, ...entries];
        localStorage.setItem('quit-smoking:gratitude-journal-entries', JSON.stringify(updatedList));

        // Also update mental health habit status for gratitude
        const todayKey = `quit-smoking:mental-health-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const todayLogStr = localStorage.getItem(todayKey) || '{}';
        const todayLog = JSON.parse(todayLogStr);
        todayLog.gratitude = true;
        localStorage.setItem(todayKey, JSON.stringify(todayLog));

        // Fire custom events so other components sync instantly
        window.dispatchEvent(new Event('gratitude-updated'));
        window.dispatchEvent(new Event('storage'));

        setGratitudeFeedback('positive');
      } else if (action === 'postpone') {
        const oneHourLater = Date.now() + 60 * 60 * 1000;
        localStorage.setItem('quit-smoking:gratitude-postponed-until', String(oneHourLater));
        window.dispatchEvent(new Event('storage'));
        setGratitudeFeedback('postponed');
      } else if (action === 'dismiss') {
        localStorage.setItem('quit-smoking:gratitude-disabled-for-today', todayDateStr);
        window.dispatchEvent(new Event('storage'));
        setGratitudeFeedback('dismissed');
      }
    } catch {}
  };

  const handleReminderAction = (action: 'yes' | 'no' | 'dismiss') => {
    if (!activeHabitReminder) return;

    try {
      const d = new Date();
      const todayDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const todayKey = `quit-smoking:mental-health-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      const habitsStr = localStorage.getItem('quit-smoking:mental-health-habits-config') || '[]';
      let habits = JSON.parse(habitsStr);

      if (action === 'yes') {
        setReminderReaction('positive');
        
        // Update today's log to complete the habit
        const todayLogStr = localStorage.getItem(todayKey) || '{}';
        const todayLog = JSON.parse(todayLogStr);
        todayLog[activeHabitReminder.id] = true;
        localStorage.setItem(todayKey, JSON.stringify(todayLog));

        // Fire custom events so other tabs update their state
        window.dispatchEvent(new Event('storage'));
      } else if (action === 'no') {
        setReminderReaction('negative');

        // Postpone for 1 hour
        const oneHourLater = Date.now() + 60 * 60 * 1000;
        habits = habits.map((h: any) => 
          h.id === activeHabitReminder.id 
            ? { ...h, reminderPostponedUntil: oneHourLater } 
            : h
        );
        localStorage.setItem('quit-smoking:mental-health-habits-config', JSON.stringify(habits));
        window.dispatchEvent(new Event('storage'));
      } else if (action === 'dismiss') {
        setReminderReaction('dismissed');

        // Disable for today
        habits = habits.map((h: any) => 
          h.id === activeHabitReminder.id 
            ? { ...h, reminderDisabledForToday: todayDateStr } 
            : h
        );
        localStorage.setItem('quit-smoking:mental-health-habits-config', JSON.stringify(habits));
        window.dispatchEvent(new Event('storage'));
      }
    } catch {}
  };






  const [indicatorStyle, setIndicatorStyle] = useState<string>(() => {
    return localStorage.getItem('quit-smoking:indicator-style') || 'indicators';
  });

  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  React.useEffect(() => {
    const handleTabChange = (e: any) => {
      const target = e?.detail;
      if (typeof target === 'string') {
        setActiveTab(target as TabType);
        setActiveOverlaySection(null);
        setIsSosTimerModalOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    const handleOpenSosTimer = () => setIsSosTimerModalOpen(true);

    window.addEventListener('change-tab', handleTabChange);
    window.addEventListener('open-sos-timer-modal', handleOpenSosTimer);

    const handleOpenSectionOverlay = (e: any) => {
      const secKey = e?.detail;
      if (secKey) {
        if (['counter', 'health', 'state', 'tree', 'more'].includes(secKey)) {
          setActiveOverlaySection(null);
          setActiveTab(secKey as TabType);
        } else if (secKey === 'toughest_time' || secKey === 'mechanics_toughest_time' || secKey === 'craving_wave') {
          setActiveOverlaySection(null);
          setActiveTab('state');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-craving-wave'));
          }, 80);
        } else if (secKey.startsWith('sos_') || secKey === 'sos') {
          setActiveOverlaySection(null);
          setIsSosTimerModalOpen(false);
          setActiveTab('sos');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const mode = secKey === 'sos' ? 'menu' : secKey.replace('sos_', '');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-sos-mode', { detail: { mode: mode || 'menu' } }));
          }, 50);
        } else {
          setActiveOverlaySection(secKey);
        }
      }
    };
    window.addEventListener('open-section-overlay', handleOpenSectionOverlay);
    window.addEventListener('open-overlay-section', handleOpenSectionOverlay);

    return () => {
      window.removeEventListener('change-tab', handleTabChange);
      window.removeEventListener('open-sos-timer-modal', handleOpenSosTimer);
      window.removeEventListener('open-section-overlay', handleOpenSectionOverlay);
      window.removeEventListener('open-overlay-section', handleOpenSectionOverlay);
    };
  }, []);

  const [showTimerHint, setShowTimerHint] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:show-timer-hint');
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });


  const [disableBottomNavBlur, setDisableBottomNavBlur] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:disable-bottom-nav-blur') === 'true';
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    const handleBottomNavBlurSync = () => {
      try {
        const val = localStorage.getItem('quit-smoking:disable-bottom-nav-blur') === 'true';
        setDisableBottomNavBlur(val);
      } catch {}
    };
    window.addEventListener('disable-bottom-nav-blur-change', handleBottomNavBlurSync);
    window.addEventListener('storage', handleBottomNavBlurSync);
    return () => {
      window.removeEventListener('disable-bottom-nav-blur-change', handleBottomNavBlurSync);
      window.removeEventListener('storage', handleBottomNavBlurSync);
    };
  }, []);

  // Persist styling modes (frameless, radius, glass)
  React.useEffect(() => {
    try {
      const framelessVal = localStorage.getItem('quit-smoking:frameless-mode');
      const frameless = framelessVal !== 'false';
      const radius = localStorage.getItem('quit-smoking:card-radius') || '24px';
      const glass = localStorage.getItem('quit-smoking:liquid-glass') === 'true';
      document.documentElement.setAttribute('data-frameless', String(frameless));
      document.documentElement.setAttribute('data-radius', radius);
      document.documentElement.setAttribute('data-glass', String(glass));
    } catch {}
  }, []);

  React.useEffect(() => {
    localStorage.setItem('quit-smoking:economy-mode', String(economyMode));
    document.documentElement.setAttribute('data-economy', String(economyMode));
  }, [economyMode]);

  React.useEffect(() => {
    localStorage.setItem('quit-smoking:show-timer-hint', String(showTimerHint));
  }, [showTimerHint]);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TREE, JSON.stringify(treeState));
    } catch {}
  }, [treeState]);

  // Real-time dynamic background gradient selection
  React.useEffect(() => {
    const getDynamicGradient = (hour: number, currentAccent: string): string => {
      switch (currentAccent) {
        case 'charcoal':
          if (hour >= 22 || hour < 6) return 'linear-gradient(135deg, #050506 0%, #0d0d10 50%, #010102 100%)';
          if (hour >= 6 && hour < 12) return 'linear-gradient(135deg, #111114 0%, #1e1e24 50%, #08080a 100%)';
          if (hour >= 12 && hour < 18) return 'linear-gradient(135deg, #18181c 0%, #2c2c35 50%, #0e0e11 100%)';
          return 'linear-gradient(135deg, #0f0e12 0%, #1d1c24 50%, #060608 100%)';
        case 'sage':
          if (hour >= 22 || hour < 6) return 'linear-gradient(135deg, #030605 0%, #0e1713 50%, #010201 100%)';
          if (hour >= 6 && hour < 12) return 'linear-gradient(135deg, #0d1613 0%, #1e2e28 50%, #08100d 100%)';
          if (hour >= 12 && hour < 18) return 'linear-gradient(135deg, #131d19 0%, #293d35 50%, #0c1512 100%)';
          return 'linear-gradient(135deg, #0e1212 0%, #1c2624 50%, #090e0e 100%)';
        case 'taupe':
          if (hour >= 22 || hour < 6) return 'linear-gradient(135deg, #050303 0%, #120e0b 50%, #010101 100%)';
          if (hour >= 6 && hour < 12) return 'linear-gradient(135deg, #14100d 0%, #26201b 50%, #0c0a08 100%)';
          if (hour >= 12 && hour < 18) return 'linear-gradient(135deg, #1c1714 0%, #352e28 50%, #120f0d 100%)';
          return 'linear-gradient(135deg, #161112 0%, #292022 50%, #0a0809 100%)';
        case 'slate-blue':
          if (hour >= 22 || hour < 6) return 'linear-gradient(135deg, #020408 0%, #091322 50%, #010204 100%)';
          if (hour >= 6 && hour < 12) return 'linear-gradient(135deg, #0b111f 0%, #18263c 50%, #070c14 100%)';
          if (hour >= 12 && hour < 18) return 'linear-gradient(135deg, #10192e 0%, #25395a 50%, #0a111f 100%)';
          return 'linear-gradient(135deg, #0e0a1f 0%, #1d193d 50%, #060412 100%)';
        case 'ash-olive':
          if (hour >= 22 || hour < 6) return 'linear-gradient(135deg, #030402 0%, #0e120b 50%, #010101 100%)';
          if (hour >= 6 && hour < 12) return 'linear-gradient(135deg, #0f120d 0%, #20271d 50%, #090c08 100%)';
          if (hour >= 12 && hour < 18) return 'linear-gradient(135deg, #151a12 0%, #2d3828 50%, #0d120d 100%)';
          return 'linear-gradient(135deg, #12120e 0%, #23251a 50%, #080906 100%)';
        case 'gray':
        default:
          if (hour >= 22 || hour < 6) return 'linear-gradient(135deg, #030406 0%, #0e1115 50%, #010203 100%)';
          if (hour >= 6 && hour < 12) return 'linear-gradient(135deg, #0f1218 0%, #202530 50%, #090d10 100%)';
          if (hour >= 12 && hour < 18) return 'linear-gradient(135deg, #151922 0%, #2e3545 50%, #0e1219 100%)';
          return 'linear-gradient(135deg, #100f18 0%, #201f30 50%, #08080f 100%)';
      }
    };

    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      let tod = 'afternoon';
      if (hour >= 22 || hour < 6) {
        tod = 'night';
      } else if (hour >= 6 && hour < 12) {
        tod = 'morning';
      } else if (hour >= 12 && hour < 18) {
        tod = 'afternoon';
      } else {
        tod = 'evening';
      }
      document.documentElement.setAttribute('data-time-of-day', tod);

      const gradient = getDynamicGradient(hour, accent);
      document.documentElement.style.setProperty('--bg-gradient', gradient);
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [accent]);

  // Global Auto-Eco listener for automatic battery protection across all tabs
  useEffect(() => {
    if (typeof window === 'undefined' || !(navigator as any).getBattery) return;

    let batteryRef: any = null;
    let handleBatteryChange: (() => void) | null = null;

    (navigator as any).getBattery().then((battery: any) => {
      batteryRef = battery;
      const checkBattery = () => {
        const batLevel = Math.round(battery.level * 100);
        const charging = battery.charging;
        checkAndApplyAutoEco(batLevel, charging);
      };

      checkBattery();

      handleBatteryChange = checkBattery;
      battery.addEventListener('levelchange', handleBatteryChange);
      battery.addEventListener('chargingchange', handleBatteryChange);
    }).catch(() => {});

    return () => {
      if (batteryRef && handleBatteryChange) {
        batteryRef.removeEventListener('levelchange', handleBatteryChange);
        batteryRef.removeEventListener('chargingchange', handleBatteryChange);
      }
    };
  }, []);



  const theme = 'dark';



  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent('guided-tour-visibility', { detail: isGuidedTourOpen }));
  }, [isGuidedTourOpen]);



  // Listener for manual 'open-guided-tour' event and tour completion
  React.useEffect(() => {
    const handleOpenTour = () => {
      setIsGuidedTourOpen(true);
    };
    const handleTourFinish = () => {
      const introShown = localStorage.getItem('quit-smoking:intro-dialogue-shown') === 'true';
      if (introShown) {
        setShowBottomNav(true);
        setIsIntroDialogueActive(false);
      } else {
        setShowBottomNav(false);
        setIsIntroDialogueActive(true);
      }
      try {
        localStorage.setItem('quit-smoking:first-run-intro-animated', 'true');
        localStorage.setItem('quit-smoking:initial-walkthrough-completed', 'true');
      } catch {}
    };

    window.addEventListener('open-guided-tour', handleOpenTour);
    window.addEventListener('guided-tour-finished-go-home', handleTourFinish);
    return () => {
      window.removeEventListener('open-guided-tour', handleOpenTour);
      window.removeEventListener('guided-tour-finished-go-home', handleTourFinish);
    };
  }, [setShowBottomNav]);

  const [isIntroDialogueActive, setIsIntroDialogueActive] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleIntroNavReveal = () => {
      setShowBottomNav(true);
    };

    const handleIntroVis = (e: any) => {
      const active = !!(e.detail && e.detail.active);
      setIsIntroDialogueActive(active);
      if (active) {
        setShowBottomNav(false);
      } else if (!e.detail?.triggerChoreography) {
        // If not running choreography (e.g. standard resume), reveal immediately
        setShowBottomNav(true);
      }
    };

    window.addEventListener('intro-bottom-nav-reveal', handleIntroNavReveal);
    window.addEventListener('intro-dialogue-visibility', handleIntroVis);
    return () => {
      window.removeEventListener('intro-bottom-nav-reveal', handleIntroNavReveal);
      window.removeEventListener('intro-dialogue-visibility', handleIntroVis);
    };
  }, [setShowBottomNav]);

  // Touch gesture auto-hide for bottom navigation:
  // Immediately appears upon touch on screen; hides completely on Home tab and minimizes on Games/More/SOS tabs after touch release.
  const [isNavVisibleOnTouch, setIsNavVisibleOnTouch] = React.useState<boolean>(false);
  const touchHideTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const handleTouchStart = () => {
      if (touchHideTimerRef.current) {
        clearTimeout(touchHideTimerRef.current);
        touchHideTimerRef.current = null;
      }
      setIsNavVisibleOnTouch(true);
    };

    const handleTouchEnd = () => {
      if (touchHideTimerRef.current) {
        clearTimeout(touchHideTimerRef.current);
      }
      // Hide (on home) or minimize (on other tabs) smoothly after 3s of touch release
      touchHideTimerRef.current = setTimeout(() => {
        setIsNavVisibleOnTouch(false);
        touchHideTimerRef.current = null;
      }, 3000);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    window.addEventListener('mousedown', handleTouchStart, { passive: true });
    window.addEventListener('mouseup', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('mousedown', handleTouchStart);
      window.removeEventListener('mouseup', handleTouchEnd);
      if (touchHideTimerRef.current) clearTimeout(touchHideTimerRef.current);
    };
  }, []);

  // Center Expand Fullscreen Button State & Double-Click Toggle
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(() => {
    return !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
  });

  const [isExpandButtonDismissed, setIsExpandButtonDismissed] = React.useState<boolean>(() => {
    try {
      return sessionStorage.getItem('quit-smoking:fullscreen-prompt-dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const dismissFullscreenPrompt = React.useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsExpandButtonDismissed(true);
    try {
      sessionStorage.setItem('quit-smoking:fullscreen-prompt-dismissed', 'true');
    } catch {}
  }, []);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const activeFS = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(activeFS);
      if (activeFS) {
        setIsExpandButtonDismissed(true);
      }
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

  React.useEffect(() => {
    const handleDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'BUTTON' ||
          target.closest('button') ||
          target.closest('input') ||
          target.closest('.interactive-tile'))
      ) {
        return;
      }
      setIsExpandButtonDismissed((prev) => !prev);
    };

    window.addEventListener('dblclick', handleDblClick);
    return () => {
      window.removeEventListener('dblclick', handleDblClick);
    };
  }, []);

  const handleExpandFullscreen = () => {
    try {
      const elem = document.documentElement as any;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } catch {}
    setIsExpandButtonDismissed(true);
  };

  const [windowsOpacity, setWindowsOpacity] = React.useState<number>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:windows-opacity');
      if (saved) return Number(saved);
    } catch {}
    return 80;
  });

  const handleUpdateWindowsOpacity = (val: number) => {
    setWindowsOpacity(val);
    try {
      localStorage.setItem('quit-smoking:windows-opacity', String(val));
    } catch {}
  };



  // Presets Auto-Recovery Lock Initialization to prevent settings reset
  React.useEffect(() => {
    try {
      const lockEnabled = localStorage.getItem('quit-smoking:presets-lock-enabled') === 'true';
      if (lockEnabled) {
        const activePresetId = localStorage.getItem('quit-smoking:presets-active-id');
        const savedPresets = localStorage.getItem('quit-smoking:presets-list');
        if (activePresetId && savedPresets) {
          const list = JSON.parse(savedPresets);
          const activeSlot = list.find((p: any) => p.id === Number(activePresetId));
          if (activeSlot && activeSlot.configData) {
            Object.entries(activeSlot.configData).forEach(([key, val]) => {
              if (localStorage.getItem(key) !== val) {
                localStorage.setItem(key, val as string);
              }
            });
          }
        }
      }
    } catch {}
  }, []);

  // Mark onboarded and initialize default collapsed states on first app launch
  React.useEffect(() => {
    try {
      localStorage.setItem('quit-smoking:onboarded', 'true');
      
      const FIRST_RUN_KEY = 'quit-smoking:first-run-sections-collapsed-v3';
      if (!localStorage.getItem(FIRST_RUN_KEY)) {
        // Вкладки: Статистика, цілі, відновлення, швидкий доступ і простір спокою мають бути згорнуті
        if (localStorage.getItem('quit-smoking:saved-stats-minimized') === null) {
          localStorage.setItem('quit-smoking:saved-stats-minimized', 'true');
        }
        if (localStorage.getItem('quit-smoking:goals-section-collapsed') === null) {
          localStorage.setItem('quit-smoking:goals-section-collapsed', 'true');
        }
        if (localStorage.getItem('quit-smoking:recovery-block-minimized') === null) {
          localStorage.setItem('quit-smoking:recovery-block-minimized', 'true');
        }
        if (localStorage.getItem('quit-smoking:pinned-sections-minimized') === null) {
          localStorage.setItem('quit-smoking:pinned-sections-minimized', 'true');
        }
        if (localStorage.getItem('quit-smoking:meditative-spaces-minimized') === null) {
          localStorage.setItem('quit-smoking:meditative-spaces-minimized', 'true');
        }

        // Інтенсивність метеоритного дощу мінімальна
        if (localStorage.getItem('quit-smoking:meteor-intensity') === null) {
          localStorage.setItem('quit-smoking:meteor-intensity', '1.0');
        }

        // Кількість зірок середньої інтенсивності (35 зірок)
        if (localStorage.getItem('quit-smoking:star-count') === null) {
          localStorage.setItem('quit-smoking:star-count', '35');
        }

        // Відкладений старт Аналізатора на 5хв при першому запуску
        if (localStorage.getItem('quit-smoking:first-run-timestamp') === null) {
          localStorage.setItem('quit-smoking:first-run-timestamp', String(Date.now()));
        }

        localStorage.setItem(FIRST_RUN_KEY, 'true');
      }
    } catch {}
  }, []);

  // Time difference in milliseconds, updated strictly 1 time per second for MAX ENERGY EFFICIENCY!
  const [diffMs, setDiffMs] = React.useState<number>(() => {
    const safeStart = typeof startDate === 'number' && !isNaN(startDate) && startDate > 0 ? startDate : Date.now();
    return Math.max(0, Date.now() - safeStart);
  });

  // 1-second interval loop with page visibility pausing (Item 5)
  React.useEffect(() => {
    const updateTime = () => {
      const safeStart = typeof startDate === 'number' && !isNaN(startDate) && startDate > 0 ? startDate : Date.now();
      setDiffMs(Math.max(0, Date.now() - safeStart));
    };

    updateTime();
    let intervalId: any = null;

    const startTimer = () => {
      if (!intervalId) {
        updateTime();
        intervalId = setInterval(updateTime, 1000);
      }
    };

    const stopTimer = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Listen to visibilitychange: sleep timer when tab is hidden, wake up when visible!
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    };

    if (!document.hidden) {
      startTimer();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startDate]);

  // Sync isTimerStarted and money when calculator is saved or updated
  React.useEffect(() => {
    const handleCalcSaved = () => {
      try {
        const s = localStorage.getItem(STORAGE_KEYS.START);
        if (s) {
          const n = Number(s);
          setStartDate(n);
          setDiffMs(Math.max(0, Date.now() - n));
        }
        const m = localStorage.getItem(STORAGE_KEYS.MONEY);
        if (m) {
          const parsed = JSON.parse(m);
          setMoney(parsed);
        }
      } catch {}
    };
    window.addEventListener('calculator-saved-change', handleCalcSaved);
    window.addEventListener('money-settings-changed', handleCalcSaved);
    window.addEventListener('storage', handleCalcSaved);
    return () => {
      window.removeEventListener('calculator-saved-change', handleCalcSaved);
      window.removeEventListener('money-settings-changed', handleCalcSaved);
      window.removeEventListener('storage', handleCalcSaved);
    };
  }, []);

  // Listen for external app-theme changes and sync state
  React.useEffect(() => {
    const handleThemeSync = (e?: any) => {
      let themeVal = '';
      if (typeof e?.detail === 'string' && e.detail.trim()) {
        themeVal = e.detail.trim();
      } else {
        try {
          const saved = localStorage.getItem(STORAGE_KEYS.APP_THEME);
          if (saved) {
            themeVal = saved.replace(/"/g, '').trim();
          }
        } catch {}
      }
      if (themeVal && themeVal !== 'parchment' && themeVal !== 'standard-minimal') {
        setAppTheme(themeVal);
      }
    };
    window.addEventListener('app-theme-change', handleThemeSync);
    window.addEventListener('storage', handleThemeSync);
    return () => {
      window.removeEventListener('app-theme-change', handleThemeSync);
      window.removeEventListener('storage', handleThemeSync);
    };
  }, [setAppTheme]);

  // Apply theme & accent class to root
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_THEME, appTheme);
    } catch {}

    const root = document.documentElement;
    root.setAttribute('data-app-theme', appTheme);

    if (appTheme === 'parchment') {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'parchment');
    } else {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    }

    if (accent) {
      root.setAttribute('data-accent', accent);
    } else {
      root.removeAttribute('data-accent');
    }
  }, [accent, appTheme]);

  // Sync to localStorage
  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.START, String(startDate)); } catch {}
  }, [startDate]);

  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.MONEY, JSON.stringify(money)); } catch {}
  }, [money]);

  React.useEffect(() => {
    try { 
      localStorage.setItem(STORAGE_KEYS.DAYS, JSON.stringify(days)); 
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('prompt-history-change'));
    } catch {}
  }, [days]);

  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.STREAKS, JSON.stringify(streaks)); } catch {}
  }, [streaks]);

  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.REASONS, JSON.stringify(reasons)); } catch {}
  }, [reasons]);

  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals)); } catch {}
  }, [goals]);

  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.TREE, JSON.stringify(treeState)); } catch {}
  }, [treeState]);

  // Auto-decay and growth pause for current tree if not maintained every hour
  React.useEffect(() => {
    if (!treeState.current) return;
    const now = Date.now();
    const tree = treeState.current;
    const last = tree.lastTick || tree.plantedAt;
    const elapsedMs = now - last;
    if (elapsedMs < 30000) return;

    const elapsedHours = elapsedMs / (3600 * 1000);
    const newWater = Math.max(0, tree.water - elapsedHours * 50);
    const newSun = Math.max(0, tree.sun - elapsedHours * 45);
    const newFood = Math.max(0, tree.food - elapsedHours * 35);

    let newGrowth = tree.growth;
    if (newWater >= 30 && newSun >= 30 && newFood >= 30 && tree.growth < 100) {
      newGrowth = Math.min(100, tree.growth + elapsedHours * 3.0);
    }

    if (
      newWater !== tree.water ||
      newSun !== tree.sun ||
      newFood !== tree.food ||
      newGrowth !== tree.growth
    ) {
      setTreeState({
        ...treeState,
        current: {
          ...tree,
          water: newWater,
          sun: newSun,
          food: newFood,
          growth: newGrowth,
          lastTick: now
        }
      });
    }
  }, [diffMs]);

  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.ACCENT, accent); } catch {}
  }, [accent]);

  // Observes activeTab to auto-complete practices and games in the Daily Map in real-time
  React.useEffect(() => {
    if (!activeTab) return;
    try {
      const d = new Date();
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      const todayK = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      
      if (activeTab === 'sos') {
        localStorage.setItem(`quit-smoking:practices-done-${todayK}`, 'true');
        window.dispatchEvent(new Event('practices-done'));
        window.dispatchEvent(new Event('storage'));
      }
    } catch {}
  }, [activeTab]);

  // Total free time including previous streaks
  const pastFreeMs = React.useMemo(() => (streaks || []).reduce((acc, s) => {
    const f = Number(s?.from);
    const t = Number(s?.to);
    return isNaN(f) || isNaN(t) || t <= f ? acc : acc + (t - f);
  }, 0), [streaks]);
  const safeDiffMs = isNaN(diffMs) ? 0 : Math.max(0, diffMs);
  const totalFreeMs = safeDiffMs + pastFreeMs;
  const longestStreakMs = React.useMemo(() => {
    const validStreaks = (streaks || [])
      .map(s => Number(s?.to) - Number(s?.from))
      .filter(d => !isNaN(d) && d > 0);
    return Math.max(safeDiffMs, ...validStreaks, 0);
  }, [safeDiffMs, streaks]);

  const totalDays = Math.floor(totalFreeMs / (24 * 3600 * 1000));
  const totalHours = Math.floor(totalFreeMs / (3600 * 1000));
  const totalSeconds = Math.floor(totalFreeMs / 1000);

  // Total free time intervals (past streaks + active streak)
  const intervals = React.useMemo(() => {
    const safeStart = typeof startDate === 'number' && !isNaN(startDate) && startDate > 0 ? startDate : Date.now();
    const list = (streaks || [])
      .filter(s => s && !isNaN(Number(s.from)) && !isNaN(Number(s.to)) && Number(s.to) > Number(s.from))
      .map((s) => ({ from: Number(s.from), to: Number(s.to) }));
    list.push({ from: safeStart, to: Date.now() });
    return list;
  }, [streaks, startDate, diffMs]);

  // Calculations for money and cigarettes avoided (supports price changes over time)
  const cigsAvoided = React.useMemo(() => {
    const res = calculateCigsAvoided(intervals, money);
    return isNaN(res) ? 0 : Math.max(0, res);
  }, [intervals, money]);

  const totalSaved = React.useMemo(() => {
    const res = calculateTotalSaved(intervals, money);
    return isNaN(res) ? 0 : Math.max(0, res);
  }, [intervals, money]);

  // Dot badges
  const todayKey = React.useMemo(() => {
    const d = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);
  const hasRatedToday = !!days[todayKey];
  const canPlantTree = Math.floor(cigsAvoided / 300) > (treeState.forest.length + (treeState.current ? 1 : 0)) && !treeState.current;

  const getAccentTextClass = React.useCallback((id: string) => {
    switch (id) {
      case 'charcoal': return 'text-zinc-900 dark:text-zinc-300';
      case 'sage': return 'text-emerald-900 dark:text-emerald-300';
      case 'taupe': return 'text-amber-950 dark:text-amber-200';
      case 'slate-blue': return 'text-indigo-950 dark:text-indigo-300';
      case 'ash-olive': return 'text-[#283224] dark:text-[#c4cec0]';
      case 'graphite': return 'text-neutral-900 dark:text-neutral-200';
      case 'gray':
      default: return 'text-slate-900 dark:text-slate-200';
    }
  }, []);

  // Handlers
  const handleSaveDate = React.useCallback((newMs: number) => {
    setStartDate(newMs);
    setDiffMs(Math.max(0, Date.now() - newMs));
    setIsSetupOpen(false);
  }, []);

  const handleConfirmRelapse = React.useCallback((whenMs: number, note: string) => {
    const streak: Streak = {
      from: startDate,
      to: whenMs,
      note
    };
    setStreaks((prev) => [...prev, streak]);
    setStartDate(whenMs);
    setDiffMs(Math.max(0, Date.now() - whenMs));
    setIsRelapseOpen(false);
    setIsSosOpen(false);
    setActiveTab('counter');
  }, [startDate]);

  const handleUndoLastRelapse = React.useCallback(() => {
    setStreaks((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setStartDate(last.from);
      setDiffMs(Math.max(0, Date.now() - last.from));
      return prev.slice(0, -1);
    });
  }, []);

  const handleAddGoal = React.useCallback((name: string, amount?: number, targetDate?: string) => {
    const newGoal: SavingsGoal = {
      id: `goal_${Date.now()}`,
      name,
      amount: amount && amount > 0 ? amount : undefined,
      targetDate: targetDate ? targetDate : undefined,
      createdAt: Date.now()
    };
    setGoals(prev => ({
      ...prev,
      queue: [...prev.queue, newGoal]
    }));
  }, []);

  const handleCompleteGoal = React.useCallback((goalId: string) => {
    setGoals(prev => {
      const goal = prev.queue.find(g => g.id === goalId);
      if (!goal) return prev;
      const newQueue = prev.queue.filter(g => g.id !== goalId);
      const completed: CompletedGoal = {
        ...goal,
        createdAt: goal.createdAt || Date.now(),
        at: Date.now(),
        total: goal.amount || totalSaved
      };
      return {
        ...prev,
        base: goal.amount ? prev.base + goal.amount : prev.base,
        queue: newQueue,
        done: [completed, ...prev.done]
      };
    });
  }, [totalSaved]);

  const handleDeleteGoal = React.useCallback((goalId: string) => {
    setGoals(prev => ({
      ...prev,
      queue: prev.queue.filter(g => g.id !== goalId),
      done: prev.done.filter(g => g.id !== goalId)
    }));
  }, []);

  const handleAddReason = React.useCallback((newReason: string) => {
    const trimmed = newReason.trim();
    if (!trimmed) return;
    setReasons((prev) => [...prev, trimmed]);
  }, []);

  const handleDeleteReason = React.useCallback((index: number) => {
    setReasons((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSaveDayRating = React.useCallback((dateKey: string, rating: DayRating) => {
    setDays((prev) => ({
      ...prev,
      [dateKey]: rating
    }));
  }, []);

  const handleDeleteDayRating = React.useCallback((dateKey: string) => {
    setDays((prev) => {
      const copy = { ...prev };
      delete copy[dateKey];
      return copy;
    });
  }, []);

  const handleRestoreAllData = React.useCallback((backup: any) => {
    if (backup.start) setStartDate(backup.start);
    if (backup.money) setMoney(backup.money);
    if (backup.days) setDays(backup.days);
    if (backup.streaks) setStreaks(backup.streaks);
    if (backup.reasons) setReasons(backup.reasons);
    if (backup.goals) setGoals(backup.goals);
    if (backup.tree) setTreeState(backup.tree);
    setAppToast('Дані успішно відновлено! ✨');
    setTimeout(() => setAppToast(null), 3500);
  }, []);

  const handleCompleteOnboarding = React.useCallback((data: {
    userName: string;
    startDate: number;
    money: MoneySettings;
    mainReason: string;
    initialSurvey?: {
      craving: number;
      mood: number;
      energy: number;
      anxiety: number;
      note: string;
    };
  }) => {
    setStartDate(data.startDate);
    try { 
      localStorage.setItem(STORAGE_KEYS.START, String(data.startDate));
      localStorage.setItem('quit-smoking:calculator-saved', 'true');
      setIsTimerStarted(true);
      window.dispatchEvent(new Event('calculator-saved-change'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    setMoney(data.money);
    try { localStorage.setItem(STORAGE_KEYS.MONEY, JSON.stringify(data.money)); } catch {}
    setReasons((prev) => [data.mainReason, ...prev.filter((r) => r !== data.mainReason)]);

    if (data.initialSurvey) {
      const d = new Date(data.startDate);
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      const dateKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}`;

      const newEntry = {
        id: `init_${Date.now()}`,
        time: timeStr,
        mood: data.initialSurvey.mood,
        craving: data.initialSurvey.craving,
        anxiety: data.initialSurvey.anxiety,
        energy: data.initialSurvey.energy,
        balance: data.initialSurvey.mood,
        focus: data.initialSurvey.energy,
        note: data.initialSurvey.note
      };

      setDays((prev) => {
        const existing = prev[dateKey] || {
          mood: data.initialSurvey!.mood,
          craving: data.initialSurvey!.craving,
          anxiety: data.initialSurvey!.anxiety,
          surveys: [],
          entries: []
        };
        const updated = [...(existing.surveys || existing.entries || []), newEntry];
        return {
          ...prev,
          [dateKey]: {
            ...existing,
            mood: data.initialSurvey!.mood,
            craving: data.initialSurvey!.craving,
            anxiety: data.initialSurvey!.anxiety,
            surveys: updated,
            entries: updated
          }
        };
      });
    }

    setIsOnboardingOpen(false);
    setAppToast('Статистику налаштовано! Відлік чистого життя розпочато ✨');
    setTimeout(() => setAppToast(null), 3500);
  }, []);

  const handleUpdateMoney = React.useCallback((newMoney: MoneySettings) => {
    setMoney(newMoney);
    try {
      localStorage.setItem(STORAGE_KEYS.MONEY, JSON.stringify(newMoney));
      localStorage.setItem('quit-smoking:calculator-saved', 'true');
      setIsTimerStarted(true);
      const existingStart = localStorage.getItem(STORAGE_KEYS.START);
      if (!existingStart) {
        const now = Date.now();
        setStartDate(now);
        localStorage.setItem(STORAGE_KEYS.START, String(now));
      }
      window.dispatchEvent(new Event('calculator-saved-change'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, []);

  const activeGoalPct = React.useMemo(() => {
    if (goals.queue[0] && goals.queue[0].amount) {
      return Math.min(
        100,
        Math.floor((Math.max(0, totalSaved - goals.base) / goals.queue[0].amount) * 100)
      );
    }
    return 0;
  }, [goals, totalSaved]);

  const handleOpenSos = React.useCallback(() => setIsSosTimerModalOpen(true), []);
  const handleOpenSetup = React.useCallback(() => setIsSetupOpen(true), []);
  const handleOpenRelapse = React.useCallback(() => setIsRelapseOpen(true), []);
  const handleOpenOnboarding = React.useCallback(() => setIsOnboardingOpen(true), []);

  React.useEffect(() => {
    const onSetupEvent = () => setIsSetupOpen(true);
    const onRelapseEvent = () => setIsRelapseOpen(true);
    const onUndoRelapseEvent = () => handleUndoLastRelapse();

    (window as any).__openSetupModal = () => setIsSetupOpen(true);
    (window as any).__openRelapseModal = () => setIsRelapseOpen(true);
    (window as any).__undoLastRelapse = () => handleUndoLastRelapse();

    window.addEventListener('open-setup-modal', onSetupEvent);
    window.addEventListener('open-relapse-modal', onRelapseEvent);
    window.addEventListener('undo-last-relapse', onUndoRelapseEvent);

    return () => {
      delete (window as any).__openSetupModal;
      delete (window as any).__openRelapseModal;
      delete (window as any).__undoLastRelapse;
      window.removeEventListener('open-setup-modal', onSetupEvent);
      window.removeEventListener('open-relapse-modal', onRelapseEvent);
      window.removeEventListener('undo-last-relapse', onUndoRelapseEvent);
    };
  }, [handleUndoLastRelapse]);

  const handleUpdateAccent = React.useCallback((val: string) => {
    setAccent(val);
    try {
      localStorage.setItem(STORAGE_KEYS.ACCENT, val);
    } catch {}
  }, []);

  const handleUpdateAppTheme = React.useCallback((val: string) => {
    const cleanTheme = val.trim();
    setAppTheme(cleanTheme);
    try {
      localStorage.setItem(STORAGE_KEYS.APP_THEME, cleanTheme);
      window.dispatchEvent(new CustomEvent('app-theme-change', { detail: cleanTheme }));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, [setAppTheme]);



  const handleOpenOverlaySection = React.useCallback((section: string) => {
    if (section === 'sos' || section.startsWith('sos_')) {
      setActiveOverlaySection(null);
      setIsSosTimerModalOpen(false);
      setActiveTab('sos');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const mode = section === 'sos' ? 'menu' : section.replace('sos_', '');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-sos-mode', { detail: { mode: mode || 'menu' } }));
      }, 50);
    } else {
      setActiveOverlaySection(section);
    }
  }, []);



  return (
    <div className="min-h-screen flex flex-col justify-between max-w-md mx-auto w-full px-4 pt-1.5 pb-16 select-none relative z-10">
      
      {/* Dynamic Transparency CSS for All Windows & Menus */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --win-opacity: ${(windowsOpacity / 100).toFixed(2)};
        }
        
        /* Dynamic transparency with backdrop blur for all modal windows & menus */
        .fixed.inset-0 > div,
        [role="dialog"],
        .modal-card {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          opacity: 1;
        }

        /* Dynamic Corner Radius Overrides */
        html[data-radius="sharp"] .rounded-2xl, html[data-radius="sharp"] .rounded-3xl, html[data-radius="sharp"] .rounded-xl { border-radius: 8px !important; }
        html[data-radius="soft"] .rounded-2xl, html[data-radius="soft"] .rounded-3xl, html[data-radius="soft"] .rounded-xl { border-radius: 14px !important; }
        html[data-radius="standard"] .rounded-2xl, html[data-radius="standard"] .rounded-3xl, html[data-radius="standard"] .rounded-xl { border-radius: 20px !important; }
        html[data-radius="24px"] .rounded-2xl, html[data-radius="24px"] .rounded-3xl, html[data-radius="24px"] .rounded-xl, html[data-radius="24"] .rounded-2xl, html[data-radius="24"] .rounded-3xl, html[data-radius="24"] .rounded-xl { border-radius: 24px !important; }
        html[data-radius="pill"] .rounded-2xl, html[data-radius="pill"] .rounded-3xl, html[data-radius="pill"] .rounded-xl { border-radius: 28px !important; }

        /* Frameless Mode Override */
        html[data-frameless="true"] .border,
        html[data-frameless="true"] [class*="border-"] { border-color: transparent !important; }
      `}} />

      <React.Suspense fallback={null}>
        {appTheme === 'eco' ? (
          <div 
            className="fixed inset-0 pointer-events-none -z-10 bg-black"
            style={{
              backgroundColor: '#000000',
            }}
          />
        ) : (
          /* Cosmic Nebula (Default Theme) */
          <AiGradientBackground />
        )}
      </React.Suspense>


      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <div key={activeTab} className="flex-1 flex flex-col animate-tab-fade-in">
          <React.Suspense fallback={
            <div className="flex-1 flex items-center justify-center py-12 bg-[#090a0f]">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            {activeTab === 'counter' && (
              <CounterTab
                diffMs={diffMs}
                startDate={startDate}
                money={money}
                totalSaved={totalSaved}
                cigsAvoided={cigsAvoided}
                treeState={treeState}
                daysCount={totalSeconds}
                reasons={reasons}
                streaks={streaks}
                longestStreakMs={longestStreakMs}
                goals={goals}
                activeGoalName={goals.queue[0]?.name}
                activeGoalPct={activeGoalPct}
                onOpenSos={handleOpenSos}
                onOpenSetup={handleOpenSetup}
                onOpenRelapse={handleOpenRelapse}
                onUndoLastRelapse={handleUndoLastRelapse}
                onSwitchTab={setActiveTab}
                onOpenOverlaySection={handleOpenOverlaySection}
                onAddGoal={handleAddGoal}
                onCompleteGoal={handleCompleteGoal}
                onDeleteGoal={handleDeleteGoal}
                dayRatings={days}
                accent={accent}
                appTheme={appTheme}
                onUpdateReasons={setReasons}
                indicatorStyle={indicatorStyle}
                showTimerHint={showTimerHint}
                onUpdateTimerHint={setShowTimerHint}
                onUpdateMoney={handleUpdateMoney}
                isZenMode={isZenMode}
                setIsZenMode={setIsZenMode}
                isTimerStarted={isTimerStarted}
              />
            )}

            {activeTab === 'health' && (
              <HealthTab
                diffMs={totalFreeMs}
                startDate={startDate}
                days={days}
                onSaveRating={handleSaveDayRating}
                onDeleteRating={handleDeleteDayRating}
                accent={accent}
                appTheme={appTheme}
              />
            )}

            {activeTab === 'state' && (
              <StateTab
                diffMs={totalFreeMs}
                startDate={startDate}
                days={days}
                accent={accent}
              />
            )}

            {activeTab === 'sos' && (
              <SosTab
                reasons={reasons}
                accent={accent}
                onCravingOver={() => {
                  setAppToast('Чудово! Чергову хвилю тяги успішно подолано! 🏆');
                  setTimeout(() => setAppToast(null), 4000);
                  setActiveTab('counter');
                }}
                onRelapse={() => {
                  setIsRelapseOpen(true);
                }}
                onSwitchTab={setActiveTab}
              />
            )}

            {activeTab === 'more' && (
              <MoreTab
                reasons={reasons}
                streaks={streaks}
                currentStart={startDate}
                totalFreeMs={totalFreeMs}
                longestStreakMs={longestStreakMs}
                goals={goals}
                totalSaved={totalSaved}
                cigsAvoided={cigsAvoided}
                money={money}
                days={days}
                currentAccent={accent}
                onUpdateAccent={handleUpdateAccent}
                onUpdateMoney={handleUpdateMoney}
                onAddGoal={handleAddGoal}
                onCompleteGoal={handleCompleteGoal}
                onDeleteGoal={handleDeleteGoal}
                onAddReason={handleAddReason}
                onDeleteReason={handleDeleteReason}
                onUndoLastRelapse={handleUndoLastRelapse}
                onOpenSetup={handleOpenSetup}
                onOpenRelapse={handleOpenRelapse}
                onOpenOnboarding={handleOpenOnboarding}
                indicatorStyle={indicatorStyle}
                onUpdateIndicatorStyle={setIndicatorStyle}
                showTimerHint={showTimerHint}
                onUpdateTimerHint={setShowTimerHint}
                economyMode={economyMode}
                onUpdateEconomyMode={setEconomyMode}
                appTheme={appTheme}
                onUpdateAppTheme={handleUpdateAppTheme}
                windowsOpacity={windowsOpacity}
                onUpdateWindowsOpacity={handleUpdateWindowsOpacity}
              />
            )}
            
            {activeOverlaySection && (
              String(activeOverlaySection).startsWith('sos_') ? (
                (() => {
                  const mode = String(activeOverlaySection).replace('sos_', '') || 'menu';
                  setTimeout(() => {
                    setActiveOverlaySection(null);
                    setIsSosTimerModalOpen(false);
                    setActiveTab('sos');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    window.dispatchEvent(new CustomEvent('open-sos-mode', { detail: { mode: mode || 'menu' } }));
                  }, 0);
                  return null;
                })()
              ) : (
                <MoreTab
                  overlaySectionKey={activeOverlaySection}
                  onCloseOverlay={() => setActiveOverlaySection(null)}
                  reasons={reasons}
                  streaks={streaks}
                  currentStart={startDate}
                  totalFreeMs={totalFreeMs}
                  longestStreakMs={longestStreakMs}
                  goals={goals}
                  totalSaved={totalSaved}
                  cigsAvoided={cigsAvoided}
                  money={money}
                  days={days}
                  currentAccent={accent}
                  onUpdateAccent={handleUpdateAccent}
                  onUpdateMoney={handleUpdateMoney}
                  onAddGoal={handleAddGoal}
                  onCompleteGoal={handleCompleteGoal}
                  onDeleteGoal={handleDeleteGoal}
                  onAddReason={handleAddReason}
                  onDeleteReason={handleDeleteReason}
                  onUndoLastRelapse={handleUndoLastRelapse}
                  onOpenSetup={handleOpenSetup}
                  onOpenRelapse={handleOpenRelapse}
                  onOpenOnboarding={handleOpenOnboarding}
                  indicatorStyle={indicatorStyle}
                  onUpdateIndicatorStyle={setIndicatorStyle}
                  showTimerHint={showTimerHint}
                  onUpdateTimerHint={setShowTimerHint}
                  economyMode={economyMode}
                  onUpdateEconomyMode={setEconomyMode}
                  appTheme={appTheme}
                  onUpdateAppTheme={handleUpdateAppTheme}
                  windowsOpacity={windowsOpacity}
                  onUpdateWindowsOpacity={handleUpdateWindowsOpacity}
                />
              )
            )}
          </React.Suspense>
        </div>
      </main>

      {/* Persistent Bottom Navigation Bar */}
      {!isZenMode && !isEverythingHidden && (
        <div 
          className="fixed bottom-3 left-1/2 z-40 transition-all duration-300 transform-gpu w-[calc(100%-1.25rem)] max-w-md opacity-100 pointer-events-auto"
          style={{
            transform: `translate(-50%, 0px) scale(${navScale})`,
            transformOrigin: 'bottom center'
          }}
        >
          <nav 
            className={`border border-slate-200/90 dark:border-zinc-800/90 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.4)] bg-white/95 dark:bg-[#18181f]/95 ${
              disableBottomNavBlur ? 'backdrop-blur-none' : 'backdrop-blur-md'
            } transition-all duration-300 py-2 px-2.5 sm:px-3.5 rounded-2xl`}
          >
            <div className="mx-auto grid grid-cols-2 text-center items-center gap-0.5 sm:gap-1.5 max-w-md w-full">
              {/* 1. Counter / Home */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('counter');
                  setIsNavVisibleOnTouch(true);
                }}
                className={`flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-300 py-1.5 px-1 sm:px-2 gap-0.5 ${
                  activeTab === 'counter'
                    ? `${getAccentTextClass(accent)} font-bold bg-white/5 dark:bg-white/[0.04]`
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6">
                  <NavHomeIcon active={activeTab === 'counter'} className="w-5 h-5" />
                </div>
                <span className="leading-tight tracking-tight text-[10px] sm:text-[11px]">
                  Головна
                </span>
              </button>

              {/* 2. State / Стан */}
              <button
                type="button"
                id="nav-btn-state"
                onClick={() => {
                  setActiveTab('state');
                  setIsNavVisibleOnTouch(true);
                }}
                className={`flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-300 py-1.5 px-1 sm:px-2 gap-0.5 ${
                  activeTab === 'state'
                    ? `${getAccentTextClass(accent)} font-bold bg-white/5 dark:bg-white/[0.04]`
                    : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6">
                  <NavStateIcon active={activeTab === 'state'} className="w-5 h-5" />
                </div>
                <span className="leading-tight tracking-tight text-[10px] sm:text-[11px]">
                  Стан
                </span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* MODALS */}
      {/* (Sos is now a full native tab matching the style of Головна) */}

      {/* Gratitude Journal Reminder Dialog from the Sentient Analyzer */}
      {isGratitudeReminderOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-x-hidden">
          {/* Backdrop click closes / postpones modal safely */}
          <div 
            className="absolute inset-0 bg-black/85 backdrop-blur-xl cursor-pointer"
            onClick={() => {
              setIsGratitudeReminderOpen(false);
              setGratitudeFeedback(null);
            }}
          />
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#181528] via-[#0d0c18] to-[#08070f] border border-amber-500/30 rounded-[2.5rem] p-6 text-center shadow-[0_20px_50px_rgba(245,158,11,0.2)] text-white transform animate-scale-in z-10">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setIsGratitudeReminderOpen(false);
                setGratitudeFeedback(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Закрити"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Animated Heart Icon */}
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <span className="text-2xl">📝</span>
            </div>

            <h3 className="text-base font-extrabold text-amber-400 uppercase tracking-widest mb-1.5 font-mono">
              Нагадування:
            </h3>

            {gratitudeFeedback === null ? (
              <div className="space-y-4 text-left">
                <p className="text-xs sm:text-sm text-zinc-200 text-center font-medium leading-relaxed">
                  Час заповнити <strong className="text-amber-300">Щоденник вдячності</strong>. Запиши три моменти радості чи спокою за сьогодні:
                </p>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[10px] text-zinc-400 font-bold block mb-1">
                      1. Що порадувало тебе сьогодні?
                    </label>
                    <input
                      type="text"
                      value={gratitudeG1}
                      onChange={(e) => setGratitudeG1(e.target.value)}
                      placeholder="Наприклад: Прохолодний душ / смачна кава..."
                      className="w-full bg-black/40 border border-amber-500/20 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 font-bold block mb-1">
                      2. За що ти вдячний(а) собі?
                    </label>
                    <input
                      type="text"
                      value={gratitudeG2}
                      onChange={(e) => setGratitudeG2(e.target.value)}
                      placeholder="Наприклад: Що стримався від тяги до нікотину..."
                      className="w-full bg-black/40 border border-amber-500/20 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 font-bold block mb-1">
                      3. Будь-яка приємна дрібниця:
                    </label>
                    <input
                      type="text"
                      value={gratitudeG3}
                      onChange={(e) => setGratitudeG3(e.target.value)}
                      placeholder="Наприклад: Затишна погода за вікном..."
                      className="w-full bg-black/40 border border-amber-500/20 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => handleSaveGratitudeReminder('save')}
                    disabled={!gratitudeG1.trim() && !gratitudeG2.trim() && !gratitudeG3.trim()}
                    className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 active:scale-98 text-white font-bold rounded-2xl text-xs sm:text-sm cursor-pointer transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(245,158,11,0.2)]"
                  >
                    <span>✓ Зберегти вдячність</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveGratitudeReminder('postpone')}
                    className="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    ⏳ Нагадай через годину
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveGratitudeReminder('dismiss')}
                    className="w-full py-2 px-4 bg-transparent border border-zinc-800 text-zinc-500 hover:text-zinc-400 font-medium rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    Не нагадуй сьогодні
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {gratitudeFeedback === 'positive' && (
                  <div className="space-y-2.5">
                    <p className="text-sm text-emerald-300 font-bold">
                      Чудово виконано! 🌟
                    </p>
                    <p className="text-xs text-zinc-300 leading-relaxed text-center">
                      Зосередження уваги на приємних ресурсах вивільняє серотонін та допомагає префронтальній корі легше долати потяги. Твій Щоденник вдячності успішно збережено! ✨
                    </p>
                  </div>
                )}

                {gratitudeFeedback === 'postponed' && (
                  <div className="space-y-2.5">
                    <p className="text-sm text-amber-300 font-bold">
                      Прийнято ⏳
                    </p>
                    <p className="text-xs text-zinc-300 leading-relaxed text-center">
                      Без проблем! Твій затишок та готовність важливіші. Я м'яко нагадаю тобі заповнити щоденник рівно через годину.
                    </p>
                  </div>
                )}

                {gratitudeFeedback === 'dismissed' && (
                  <div className="space-y-2.5">
                    <p className="text-sm text-zinc-400 font-bold">
                      Нагадування вимкнено
                    </p>
                    <p className="text-xs text-zinc-400 leading-relaxed text-center">
                      Гаразд, я більше не нагадуватиму про щоденник сьогодні. Сфокусуйся на відпочинку. 🧘
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsGratitudeReminderOpen(false);
                    setGratitudeFeedback(null);
                  }}
                  className="mt-2 w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Добре
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Habit Reminder Prompt from the Sentient Analyzer */}
      {activeHabitReminder && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-x-hidden">
          {/* Backdrop click closes modal safely */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-xl cursor-pointer"
            onClick={() => {
              setActiveHabitReminder(null);
              setReminderReaction(null);
            }}
          />
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#161424] via-[#0e0d17] to-[#090810] border border-purple-500/30 rounded-[2.5rem] p-6 text-center shadow-[0_20px_50px_rgba(168,85,247,0.25)] text-white transform animate-scale-in z-10">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setActiveHabitReminder(null);
                setReminderReaction(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Закрити"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Analyzer Icon */}
            <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-400/30 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-2xl">{activeHabitReminder.icon || '🌱'}</span>
            </div>

            <h3 className="text-base font-extrabold text-purple-300 uppercase tracking-widest mb-1.5 font-mono">
              Нагадування:
            </h3>

            {reminderReaction === null ? (
              <div className="space-y-4">
                <p className="text-sm text-zinc-100 font-medium leading-relaxed">
                  Настав час для запланованої справи:<br />
                  <strong className="text-purple-200 text-base">«{activeHabitReminder.title}»</strong>
                </p>
                <p className="text-xs text-zinc-400">
                  Ти вже виконав цей корисний ритуал?
                </p>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleReminderAction('yes')}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold rounded-2xl text-xs sm:text-sm cursor-pointer transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
                  >
                    <span>✓ Так, зробив!</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReminderAction('no')}
                    className="w-full py-2.5 px-4 bg-amber-600/90 hover:bg-amber-500 active:scale-98 text-white font-bold rounded-2xl text-xs sm:text-sm cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <span>⏳ Ще ні (нагадати через годину)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReminderAction('dismiss')}
                    className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 active:scale-98 text-zinc-300 hover:text-white font-medium rounded-2xl text-xs sm:text-sm cursor-pointer transition-all"
                  >
                    <span>Не нагадуй</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {reminderReaction === 'positive' && (
                  <div className="space-y-2.5">
                    <p className="text-sm text-emerald-300 font-bold">
                      Чудово виконано! 🎉
                    </p>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Нейронні зв'язки твоєї стійкості міцнішають прямо зараз. Твій мозок виробляє чистий серотонін та природний дофамін без відкатів! Продовжуй у тому ж дусі! ✨
                    </p>
                  </div>
                )}

                {reminderReaction === 'negative' && (
                  <div className="space-y-2.5">
                    <p className="text-sm text-amber-300 font-bold">
                      Потрібен невеликий поштовх? 💪
                    </p>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Оу, лімбічна система пручається? Спробуй нагадати собі, чому цей ритуал важливий для твого здоров'я. Нагадаю тобі ще раз рівно через годину! ⏳
                    </p>
                  </div>
                )}

                {reminderReaction === 'dismissed' && (
                  <div className="space-y-2.5">
                    <p className="text-sm text-zinc-400 font-bold">
                      Прийнято
                    </p>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Гаразд, я не турбуватиму тебе сьогодні цією справою. Фокусуйся на спокої та вільному диханні. 🧘
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setActiveHabitReminder(null);
                    setReminderReaction(null);
                  }}
                  className="mt-2 w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Добре
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Floating Notification Toast */}
      {appToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#12302B] dark:bg-[#1E8A69] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full shadow-xl border border-white/20 animate-fade-in flex items-center gap-2">
          <span>{appToast}</span>
        </div>
      )}

      <React.Suspense fallback={null}>
        <SetupModal
          initialDateMs={startDate}
          isOpen={isSetupOpen}
          onClose={() => setIsSetupOpen(false)}
          onSave={handleSaveDate}
        />

        <RelapseModal
          isOpen={isRelapseOpen}
          currentStart={startDate}
          onClose={() => setIsRelapseOpen(false)}
          onConfirmRelapse={handleConfirmRelapse}
        />

        <OnboardingModal
          isOpen={isOnboardingOpen}
          onComplete={handleCompleteOnboarding}
        />

        <GuidedTourModal
          isOpen={isGuidedTourOpen}
          onClose={() => {
            setIsGuidedTourOpen(false);
            setShowBottomNav(true);
            try {
              localStorage.setItem('quit-smoking:first-run-intro-animated', 'true');
              localStorage.setItem('quit-smoking:initial-walkthrough-completed', 'true');
            } catch {}
          }}
          money={money}
          onUpdateMoney={handleUpdateMoney}
          appTheme={appTheme}
          onUpdateAppTheme={handleUpdateAppTheme}
          onOpenMoreTab={() => {
            setActiveTab('more');
          }}
        />



        <SosCravingTimerModal
          isOpen={isSosTimerModalOpen}
          onClose={() => setIsSosTimerModalOpen(false)}
          onVictory={() => {
            setAppToast('Чудово! Чергову хвилю тяги успішно подолано! 🏆');
            setTimeout(() => setAppToast(null), 4000);
          }}
          onGoToHome={() => {
            setActiveTab('counter');
            setIsSosTimerModalOpen(false);
          }}
          onOpenFullSos={() => {
            setIsSosTimerModalOpen(false);
            setActiveTab('sos');
          }}
        />

        <HourlyAchievementModal startDate={startDate} />
      </React.Suspense>

      {/* Bottom Compact Expand Fullscreen Floating Icon with Close Cross */}
      {!isFullscreen && !isExpandButtonDismissed && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[90] pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-[#18181f]/95 text-zinc-100 shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-zinc-700/80 backdrop-blur-xl animate-fadeIn transition-all">
          <button
            type="button"
            onClick={handleExpandFullscreen}
            className="p-2.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 font-bold transition-all active:scale-90 cursor-pointer flex items-center justify-center shrink-0"
            title="Розширити на весь екран"
            aria-label="Розширити на весь екран"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          <div className="w-[1px] h-4 bg-zinc-700/60" />

          <button
            type="button"
            onClick={dismissFullscreenPrompt}
            className="p-2.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-all active:scale-90 cursor-pointer flex items-center justify-center shrink-0"
            title="Сховати"
            aria-label="Сховати підказку"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}



    </div>
  );
}

export default function App() {
  return (
    <AppContent />
  );
}
