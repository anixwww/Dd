import React, { useState, useEffect, useMemo } from 'react';
import {
  Wind,
  Droplets,
  Waves,
  Eye,
  Music,
  Compass,
  Gamepad2,
  BookOpen,
  Clock,
  History,
  Trophy,
  ShieldCheck,
  Phone,
  PhoneCall,
  Edit3,
  ArrowRight,
  ChevronLeft,
  RotateCcw,
  Check,
  X,
  Trash2,
  Calendar,
  Pin,
  Sparkles
} from 'lucide-react';
import { SosSoundscapes } from './SosSoundscapes';
import { HealthyReplacements } from './HealthyReplacements';
import { AntiStressBubbles } from './AntiStressBubbles';
import { CopingCardsWidget } from './CopingCardsWidget';
import { MonolithicSegmentedControl } from './MonolithicSegmentedControl';
import { RefractedSingingBowlIcon } from './RefractedGameIcons';

export interface SosCrisisEntry {
  id: string;
  timestamp: number;
  dateStr: string;
  timeStr: string;
  protocolName: string;
  outcome: 'overcome' | 'relapse';
}

interface SosTabProps {
  reasons: string[];
  accent?: string;
  onCravingOver: () => void;
  onRelapse: () => void;
  onSwitchTab?: (tab: any) => void;
}

type SosMode = 'menu' | 'breath' | 'wave' | 'grounding' | 'cold' | 'sound' | 'wheel' | 'game' | 'cards' | 'log';
type BreathTechnique = 'sigh' | 'box' | '478';

const CRISIS_LOG_STORAGE_KEY = 'quit-smoking:sos-crisis-log';

export const SosTab: React.FC<SosTabProps> = React.memo(({
  reasons,
  accent = 'indigo',
  onCravingOver,
  onRelapse,
  onSwitchTab
}) => {
  const [mode, setMode] = useState<SosMode>('menu');
  const [activeProtocol, setActiveProtocol] = useState<string>('Загальний виклик SOS');

  // Quick access pinned sections state
  const [pinnedSections, setPinnedSections] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:pinned-more-sections');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['daily_steps', 'gratitude_journal', 'notes'];
  });

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  useEffect(() => {
    const handlePinnedChange = () => {
      try {
        const saved = localStorage.getItem('quit-smoking:pinned-more-sections');
        if (saved) setPinnedSections(JSON.parse(saved));
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
      showFeedback('Розділ прибрано зі Швидкого доступу');
    } else {
      next = [...pinnedSections, key];
      showFeedback('Вкладку закріплено у Швидкий доступ на Головній! 📌');
    }
    setPinnedSections(next);
    try {
      localStorage.setItem('quit-smoking:pinned-more-sections', JSON.stringify(next));
      window.dispatchEvent(new Event('pinned-more-sections-change'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  // Phone support configuration state
  const [sosPhone, setSosPhone] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:sos-phone') || '';
    } catch {
      return '';
    }
  });
  const [isEditingPhone, setIsEditingPhone] = useState<boolean>(false);
  const [phoneInputText, setPhoneInputText] = useState<string>(sosPhone);

  const saveSosPhone = (phoneNum: string) => {
    const trimmed = phoneNum.trim();
    setSosPhone(trimmed);
    try {
      localStorage.setItem('quit-smoking:sos-phone', trimmed);
    } catch {}
    setIsEditingPhone(false);
  };

  // Crisis Log History State
  const [crisisLog, setCrisisLog] = useState<SosCrisisEntry[]>(() => {
    try {
      const saved = localStorage.getItem(CRISIS_LOG_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const saveCrisisLog = (newLog: SosCrisisEntry[]) => {
    setCrisisLog(newLog);
    try {
      localStorage.setItem(CRISIS_LOG_STORAGE_KEY, JSON.stringify(newLog));
    } catch {}
  };

  // 1. Breathing State
  const [breathTechnique, setBreathTechnique] = useState<BreathTechnique>('sigh');
  const [breathPhase, setBreathPhase] = useState<'Вдих 1' | 'Вдих 2' | 'Видих' | 'Вдих' | 'Затримка'>('Вдих 1');
  const [breathSecLeft, setBreathSecLeft] = useState<number>(2);

  // 2. Wave (Urge Surfing) State - 90 seconds
  const [waveSecLeft, setWaveSecLeft] = useState<number>(90);
  const [waveRunning, setWaveRunning] = useState<boolean>(false);

  // 3. Grounding 5-4-3-2-1 active step
  const [groundingStep, setGroundingStep] = useState<number>(0);

  // Random reason reminder
  const randomReason = useMemo(() => {
    return reasons.length > 0 ? reasons[Math.floor(Math.random() * reasons.length)] : 'Свобода та чисті легені';
  }, [reasons]);

  const handleSelectMode = (newMode: SosMode, protocolName: string) => {
    setActiveProtocol(protocolName);
    setMode(newMode);
    if (newMode === 'wave') {
      setWaveSecLeft(90);
      setWaveRunning(true);
    } else if (newMode === 'grounding') {
      setGroundingStep(0);
    }
    try {
      sessionStorage.setItem('quit-smoking:sos-technique-viewed', 'true');
      sessionStorage.setItem('quit-smoking:last-sos-mode', newMode);
      window.dispatchEvent(new CustomEvent('sos-technique-opened', { detail: { mode: newMode, protocol: protocolName } }));
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleOpenSosModeEvent = (e: any) => {
      const target = e?.detail?.mode || e?.detail;
      const protocol = e?.detail?.protocol || 'Екстрена допомога SOS';
      if (typeof target === 'string') {
        const modeMap: Record<string, { mode: SosMode; name: string }> = {
          breath: { mode: 'breath', name: 'Фізіологічне дихання' },
          breathing: { mode: 'breath', name: 'Дихання 4-7-8' },
          wave: { mode: 'wave', name: 'Серфінг хвилі тяги' },
          surfing: { mode: 'wave', name: 'Серфінг хвилі тяги' },
          grounding: { mode: 'grounding', name: 'Заземлення 5-4-3-2-1' },
          cold: { mode: 'cold', name: 'Холодовий рефлекс нирця' },
          water: { mode: 'cold', name: 'Холодна вода' },
          sound: { mode: 'sound', name: 'Звуки природи' },
          sounds: { mode: 'sound', name: 'Звуки природи' },
          soundscapes: { mode: 'sound', name: 'Звуки природи' },
          game: { mode: 'game', name: 'Бульбашки антистрес' },
          bubbles: { mode: 'game', name: 'Бульбашки антистрес' },
          cards: { mode: 'cards', name: 'Копінг-картки' },
          wheel: { mode: 'wheel', name: 'Корисні замінники' },
          replacements: { mode: 'wheel', name: 'Корисні замінники' },
          menu: { mode: 'menu', name: 'Всі техніки SOS' }
        };

        const resolved = modeMap[target.toLowerCase()] || { mode: 'menu', name: protocol };
        handleSelectMode(resolved.mode, resolved.name);
      }
    };

    window.addEventListener('open-sos-mode', handleOpenSosModeEvent);
    return () => window.removeEventListener('open-sos-mode', handleOpenSosModeEvent);
  }, []);

  const handleRecordOutcome = (outcome: 'overcome' | 'relapse') => {
    const now = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const newEntry: SosCrisisEntry = {
      id: `crisis_${Date.now()}`,
      timestamp: Date.now(),
      dateStr,
      timeStr,
      protocolName: activeProtocol,
      outcome
    };

    const updatedLog = [newEntry, ...crisisLog];
    saveCrisisLog(updatedLog);

    if (outcome === 'overcome') {
      onCravingOver();
    } else {
      onRelapse();
    }
  };

  const handleDeleteEntry = (id: string) => {
    const updated = crisisLog.filter((item) => item.id !== id);
    saveCrisisLog(updated);
  };

  const handleClearLog = () => {
    if (window.confirm('Ви впевнені, що хочете очистити журнал кризових ситуацій?')) {
      saveCrisisLog([]);
    }
  };

  // Breathing Loop
  useEffect(() => {
    if (mode !== 'breath') return;

    let sec = breathTechnique === 'sigh' ? 2 : 4;
    let step = 0;

    const timer = setInterval(() => {
      sec -= 1;
      if (sec <= 0) {
        if (breathTechnique === 'sigh') {
          step = (step + 1) % 3;
          if (step === 0) {
            setBreathPhase('Вдих 1');
            sec = 2;
          } else if (step === 1) {
            setBreathPhase('Вдих 2');
            sec = 1;
          } else {
            setBreathPhase('Видих');
            sec = 5;
          }
        } else if (breathTechnique === 'box') {
          step = (step + 1) % 4;
          if (step === 0) {
            setBreathPhase('Вдих');
            sec = 4;
          } else if (step === 1) {
            setBreathPhase('Затримка');
            sec = 4;
          } else if (step === 2) {
            setBreathPhase('Видих');
            sec = 4;
          } else {
            setBreathPhase('Затримка');
            sec = 4;
          }
        } else {
          step = (step + 1) % 3;
          if (step === 0) {
            setBreathPhase('Вдих');
            sec = 4;
          } else if (step === 1) {
            setBreathPhase('Затримка');
            sec = 7;
          } else {
            setBreathPhase('Видих');
            sec = 8;
          }
        }
      }
      setBreathSecLeft(sec);
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, breathTechnique]);

  // Urge Wave Timer
  useEffect(() => {
    if (mode !== 'wave' || !waveRunning) return;

    const timer = setInterval(() => {
      setWaveSecLeft((prev) => {
        if (prev <= 1) {
          setWaveRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, waveRunning]);

  const overcomeCount = crisisLog.filter((item) => item.outcome === 'overcome').length;
  const totalCrises = crisisLog.length;
  const successRate = totalCrises > 0 ? Math.round((overcomeCount / totalCrises) * 100) : 100;

  const PRACTICES = [
    {
      id: 'breath',
      title: 'Фізіологічне дихання',
      desc: 'Подвійний вдих та подовжений видих. Знижує пульс та рівень кортизолу.',
      action: 'Почати дихати',
      icon: Wind,
      svg: (
        <svg viewBox="0 0 60 60" className="w-10 h-10 select-none opacity-85 group-hover:opacity-100 transition-opacity">
          <circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-zinc-600 animate-spin" style={{ animationDuration: '18s' }} />
          <circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400/70" />
          <circle cx="30" cy="30" r="5" fill="currentColor" className="text-emerald-400" />
        </svg>
      )
    },

    {
      id: 'wave',
      title: 'Серфінг хвилі',
      desc: 'Фізіологічний потяг живе недовго. Спостерігайте за ним як за хвилею, не борючись.',
      action: 'Перечекати хвилю',
      icon: Waves,
      svg: (
        <svg viewBox="0 0 60 60" className="w-10 h-10 select-none opacity-85 group-hover:opacity-100 transition-opacity">
          <path d="M10,34 Q20,20 30,34 T50,34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-teal-400/80" />
          <path d="M12,40 Q22,26 32,40 T52,40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-zinc-500" />
          <circle cx="30" cy="20" r="3" fill="currentColor" className="text-amber-400/90" />
        </svg>
      )
    },
    {
      id: 'grounding',
      title: 'Заземлення 5-4-3-2-1',
      desc: 'Повернення у тіло через органи чуття: зір, дотик, слух, нюх і смак.',
      action: 'Увімкнути відчуття',
      icon: Eye,
      svg: (
        <svg viewBox="0 0 60 60" className="w-10 h-10 select-none opacity-85 group-hover:opacity-100 transition-opacity">
          <circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-zinc-600" />
          <ellipse cx="30" cy="30" rx="14" ry="7" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400/80" />
          <circle cx="30" cy="30" r="3.5" fill="currentColor" className="text-zinc-200" />
        </svg>
      )
    },
    {
      id: 'sound',
      title: 'Звукотерапія спокою',
      desc: 'Ембієнт-звуки пригнічують імпульсивне бажання закурити: дощ, океан, ліс.',
      action: 'Слухати звуки',
      icon: Music,
      svg: (
        <svg viewBox="0 0 60 60" className="w-10 h-10 select-none opacity-85 group-hover:opacity-100 transition-opacity">
          <circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-600" />
          <rect x="22" y="24" width="3" height="12" rx="1.5" fill="currentColor" className="text-sky-400/80" />
          <rect x="28" y="18" width="3" height="24" rx="1.5" fill="currentColor" className="text-zinc-300" />
          <rect x="34" y="22" width="3" height="16" rx="1.5" fill="currentColor" className="text-sky-400/80" />
        </svg>
      )
    },
    {
      id: 'wheel',
      title: 'Колесо замінників',
      desc: 'Отримайте 1-хвилинне корисне завдання замість сигарети від колеса удачі.',
      action: 'Крутити колесо',
      icon: Compass,
      svg: (
        <svg viewBox="0 0 60 60" className="w-10 h-10 select-none opacity-85 group-hover:opacity-100 transition-opacity">
          <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-400/70" />
          <line x1="30" y1="10" x2="30" y2="50" stroke="currentColor" strokeWidth="1" className="text-zinc-600" />
          <line x1="10" y1="30" x2="50" y2="30" stroke="currentColor" strokeWidth="1" className="text-zinc-600" />
          <circle cx="30" cy="30" r="3.5" fill="currentColor" className="text-amber-400" />
        </svg>
      )
    },
    {
      id: 'game',
      title: 'Лопай Бульбашки',
      desc: 'Антистрес-гра для перемикання уваги та зайняття рук легкими бульбашками.',
      action: 'Грати (1 хв)',
      icon: Gamepad2,
      svg: (
        <svg viewBox="0 0 60 60" className="w-10 h-10 select-none opacity-85 group-hover:opacity-100 transition-opacity">
          <circle cx="24" cy="26" r="10" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-indigo-400/70" />
          <circle cx="38" cy="34" r="8" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-zinc-400" />
          <circle cx="22" cy="40" r="5" fill="currentColor" className="text-teal-400/60" />
        </svg>
      )
    },
    {
      id: 'cards',
      title: 'Когнітивні картки',
      desc: 'Психологічні факти та підтримка при гострому поклику до сигарети.',
      action: 'Читати факти',
      icon: BookOpen,
      svg: (
        <svg viewBox="0 0 60 60" className="w-10 h-10 select-none opacity-85 group-hover:opacity-100 transition-opacity">
          <rect x="18" y="16" width="24" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400" />
          <line x1="23" y1="24" x2="37" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-rose-400/70" />
          <line x1="23" y1="30" x2="33" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-500" />
        </svg>
      )
    },
    {
      id: 'cold',
      title: 'Холодовий рефлекс нирця',
      desc: 'Склянка крижаної води або вмивання обличчя. Миттєво перемикає блукаючий нерв.',
      action: 'Дізнатися кроки',
      icon: Droplets,
      svg: (
        <svg viewBox="0 0 60 60" className="w-10 h-10 select-none opacity-85 group-hover:opacity-100 transition-opacity">
          <path d="M30,14 C30,14 18,30 18,37 C18,44 23.4,49 30,49 C36.6,49 42,44 42,37 C42,30 30,14 30,14 Z" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-sky-400/80" />
          <circle cx="28" cy="38" r="3" fill="currentColor" className="text-zinc-200" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-col flex-1 pb-6 max-w-md mx-auto w-full animate-fadeIn select-none pt-1">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] max-w-sm w-[90%] p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold text-center shadow-xl animate-fadeIn flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* ШВИДКІ ІНСТРУМЕНТИ: 1. ДЗВІНОК ДРУГУ | 2. ЖУРНАЛ КРИЗ */}
      {mode === 'menu' && (
        <div className="grid grid-cols-2 gap-2.5 mb-3.5 px-0.5">
          {/* 1. ДЗВІНОК ДРУГУ (ПЕРША ВКЛАДКА) */}
          <div 
            onClick={() => {
              if (sosPhone) {
                window.location.href = `tel:${sosPhone}`;
              } else {
                setIsEditingPhone(true);
              }
            }}
            className="p-3 rounded-2xl bg-white dark:bg-[#18181f]/90 border border-slate-200/90 dark:border-zinc-800/80 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1f1f27] transition-all text-left shadow-2xs group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center shrink-0 shadow-xs group-hover:border-zinc-600 transition-colors">
                <PhoneCall className="w-4 h-4 text-zinc-200" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate group-hover:text-zinc-200 transition-colors">
                  Дзвінок другу
                </div>
                <div className="text-[10px] text-slate-400 dark:text-zinc-400 truncate">
                  {sosPhone || 'Налаштувати'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingPhone(true);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200"
              title="Змінити номер"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. ЖУРНАЛ КРИЗ */}
          <div 
            onClick={() => handleSelectMode('log', 'Журнал звернень')}
            className="p-3 rounded-2xl bg-white dark:bg-[#18181f]/90 border border-slate-200/90 dark:border-zinc-800/80 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1f1f27] transition-all text-left shadow-2xs group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center shrink-0 shadow-xs group-hover:border-zinc-600 transition-colors">
                <History className="w-4 h-4 text-zinc-200" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate group-hover:text-zinc-200 transition-colors">
                  Журнал криз
                </div>
                <div className="text-[10px] text-slate-400 dark:text-zinc-400 truncate">
                  {crisisLog.length} записів
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => togglePinSection('sos_log', e)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                pinnedSections.includes('sos_log')
                  ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
              title={pinnedSections.includes('sos_log') ? "Прибрати зі Швидкого доступу" : "Закріпити у Швидкий доступ на Головній"}
            >
              <Pin className={`w-3.5 h-3.5 ${pinnedSections.includes('sos_log') ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* ФОРМА НАЛАШТУВАННЯ ТЕЛЕФОНУ */}
      {isEditingPhone && (
        <div className="p-3.5 mb-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 text-left space-y-2 animate-fadeIn">
          <div className="text-xs font-bold text-zinc-200 flex items-center justify-between">
            <span>Номер екстреної підтримки</span>
            <button
              type="button"
              onClick={() => setIsEditingPhone(false)}
              className="text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400">
            Введіть номер близької людини чи гарячої лінії для швидкого дзвінка у момент кризи:
          </p>
          <div className="flex gap-2">
            <input
              type="tel"
              value={phoneInputText}
              onChange={(e) => setPhoneInputText(e.target.value)}
              placeholder="+380..."
              className="flex-1 px-3 py-1.5 rounded-xl border border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-100"
            />
            <button
              type="button"
              onClick={() => saveSosPhone(phoneInputText)}
              className="px-3.5 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              Зберегти
            </button>
          </div>
        </div>
      )}

      {/* 4. ВНУТРІШНІ ЕКРАНИ / ПРАКТИКИ (ЯКЩО ВІДКРИТА КОНКРЕТНА ПРАКТИКА) */}
      {mode !== 'menu' && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setMode('menu')}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Назад до всіх практик SOS</span>
          </button>

          {mode === 'sound' && <SosSoundscapes />}
          {mode === 'wheel' && <HealthyReplacements />}
          {mode === 'game' && <AntiStressBubbles />}
          {mode === 'cards' && <CopingCardsWidget />}

          {/* ДИХАННЯ */}
          {mode === 'breath' && (
            <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#18181c]/80 border border-slate-200/80 dark:border-zinc-800/80 space-y-4 text-center">
              <MonolithicSegmentedControl
                items={[
                  { id: 'sigh', label: 'Зітхання' },
                  { id: 'box', label: 'Квадрат' },
                  { id: '478', label: 'Релакс 4-7-8' }
                ]}
                value={breathTechnique}
                onChange={(val) => setBreathTechnique(val as BreathTechnique)}
                size="md"
              />

              <div className="py-6 flex flex-col items-center justify-center relative">
                <div
                  className={`w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 bg-slate-50/50 dark:bg-zinc-900/40 shadow-inner relative z-10 ${
                    breathPhase.includes('Вдих')
                      ? 'scale-110 border-emerald-500 shadow-emerald-500/10'
                      : breathPhase === 'Затримка'
                      ? 'scale-105 border-amber-500 shadow-amber-500/10'
                      : 'scale-95 border-sky-500 shadow-sky-500/10'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">
                    {breathPhase}
                  </span>
                  <span className="text-4xl font-mono font-black text-slate-800 dark:text-zinc-100">
                    {breathSecLeft}с
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed font-medium">
                Дихайте животом. Довгий повільний видих активує блукаючий нерв і повертає відчуття спокою.
              </p>
            </div>
          )}

          {/* СЕРФІНГ ХВИЛІ */}
          {mode === 'wave' && (
            <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#18181c]/80 border border-slate-200/80 dark:border-zinc-800/80 space-y-4 text-center">
              <div className="py-4 flex flex-col items-center justify-center">
                <div className="w-36 h-36 rounded-full bg-slate-50 dark:bg-[#141418] border-2 border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center shadow-inner">
                  <span className="text-4xl font-mono font-black text-slate-800 dark:text-zinc-100">
                    {waveSecLeft}с
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold mt-1">до спаду піку</span>
                </div>
              </div>

              <div className="w-full bg-slate-100 dark:bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-slate-200/40 dark:border-zinc-800">
                <div
                  className="bg-emerald-500 h-full transition-all duration-1000 shadow-xs"
                  style={{ width: `${((90 - waveSecLeft) / 90) * 100}%` }}
                />
              </div>

              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed font-medium">
                Уявіть, що потяг — це хвиля. Ви не зупиняєте океан, ви просто стоїте на березі й спостерігаєте.
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setWaveRunning((v) => !v)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-xs font-bold text-slate-700 dark:text-zinc-300 cursor-pointer transition-colors"
                >
                  {waveRunning ? 'Пауза' : 'Продовжити'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWaveSecLeft(90);
                    setWaveRunning(true);
                  }}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-500 cursor-pointer transition-colors"
                  title="Скинути"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ЗАЗЕМЛЕННЯ */}
          {mode === 'grounding' && (
            <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#18181c]/80 border border-slate-200/80 dark:border-zinc-800/80 space-y-4 text-center">
              {groundingStep === 0 && (
                <div className="space-y-2 py-4">
                  <div className="text-4xl font-black font-mono text-emerald-500">5</div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                    Знайдіть поглядом 5 речей навколо
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Подивіться навколо та назвіть: стіл, вікно, годинник, тінь на стіні, власні долоні.
                  </p>
                </div>
              )}
              {groundingStep === 1 && (
                <div className="space-y-2 py-4">
                  <div className="text-4xl font-black font-mono text-emerald-500">4</div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                    Відчуйте 4 тактильні дотики
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Сфокусуйтеся на тілі: тканина одягу, прохолода телефону, опора ніг на підлозі, повітря на шкірі.
                  </p>
                </div>
              )}
              {groundingStep === 2 && (
                <div className="space-y-2 py-4">
                  <div className="text-4xl font-black font-mono text-emerald-500">3</div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                    Прислухайтесь до 3 різних звуків
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Закрийте очі та розрізніть: шум вулиці за вікном, власне дихання, гул техніки.
                  </p>
                </div>
              )}
              {groundingStep === 3 && (
                <div className="space-y-2 py-4">
                  <div className="text-4xl font-black font-mono text-emerald-500">2</div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                    Знайдіть 2 різні запахи
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Вдихніть повітря носом: свіжість кімнати, аромат кави або мила на руках.
                  </p>
                </div>
              )}
              {groundingStep === 4 && (
                <div className="space-y-2 py-4">
                  <div className="text-4xl font-black font-mono text-emerald-500">1</div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                    Відчуйте 1 приємний смак
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Зробіть ковток води, відчуйте м'ятну цукерку або просто усвідомте чистий подих без диму.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  if (groundingStep < 4) {
                    setGroundingStep((s) => s + 1);
                  } else {
                    setMode('menu');
                  }
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
              >
                {groundingStep < 4 ? 'Наступне відчуття' : 'Завершити заземлення'}
              </button>
            </div>
          )}

          {/* ХОЛОДОВИЙ РЕФЛЕКС НИРЦЯ */}
          {mode === 'cold' && (
            <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#18181c]/80 border border-slate-200/80 dark:border-zinc-800/80 space-y-4 animate-fadeIn">
              {/* Header Badge & Title */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/20">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center flex-none font-bold">
                  <Droplets className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                    Холодовий рефлекс нирця (Mammalian Dive Reflex)
                  </h3>
                  <p className="text-[11px] text-sky-600 dark:text-sky-300 font-medium">
                    Миттєве фізіологічне гальмування паніки та гострої тяги
                  </p>
                </div>
              </div>

              {/* SECTION 1: Як це допомагає (Нейробіологія) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/90 border border-slate-200/60 dark:border-zinc-800/80 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Як це допомагає (Фізіологічний механізм):</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-none" />
                    <span>
                      <strong className="text-slate-800 dark:text-zinc-100">Активація блукаючого нерва (Nervus Vagus):</strong> Рецептори трійчастого нерва на обличчі (навколо очей, носа та щік) миттєво реагують на вплив холоду та вологи.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-none" />
                    <span>
                      <strong className="text-slate-800 dark:text-zinc-100">Зниження пульсу на 10–25%:</strong> Сигнал мозочка стимулює сповільнення серцебиття (брадикардію) за 10–20 секунд. Серце починає битися спокійніше.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-none" />
                    <span>
                      <strong className="text-slate-800 dark:text-zinc-100">Блокування адреналіну:</strong> Мозок перемикається зі стану тривоги «бий або біжи» на режим збереження ресурсів. У такому стані панічна атака чи гостра тяга біохімічно не можуть утримувати піковий рівень.
                    </span>
                  </li>
                </ul>
              </div>

              {/* SECTION 2: Що саме робити (Покроковий алгоритм) */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <span>Що саме робити (оберіть один із методів):</span>
                </h4>

                {/* Method 1 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center flex-none font-bold text-[11px]">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 dark:text-zinc-200">
                      Занурення або вмивання обличчя (Найпотужніший спосіб)
                    </p>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                      Наберіть у миску чи раковину холодної води (10–15°C). Затримайте подих і нахиліться, зануривши обличчя (щоки, ніс, під очима) на 10–15 секунд. Або інтенсивно ополосніть обличчя крижаною водою 3–5 разів.
                    </p>
                  </div>
                </div>

                {/* Method 2 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center flex-none font-bold text-[11px]">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 dark:text-zinc-200">
                      Холодний компрес / Лід під очі
                    </p>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                      Прикладіть пакет з льодом, заморожений продукт або холодну пляшку до вилиць та ділянки під очима на 15–30 секунд. Також можна прикласти холодний вологий рушник до бічних поверхонь шиї.
                    </p>
                  </div>
                </div>

                {/* Method 3 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center flex-none font-bold text-[11px]">
                    3
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 dark:text-zinc-200">
                      Повільні ковтки крижаної води
                    </p>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                      Повільно випийте склянку крижаної води дрібними свідомими ковтками, відчуваючи, як прохолода опускається по горлу та стравоходу, заспокоюючи нервові закінчення.
                    </p>
                  </div>
                </div>
              </div>

              {/* Note / Tip */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed font-medium">
                💡 <strong>Важливо:</strong> Холод повинен впливати саме на обличчя (зона трійчастого нерва) або внутрішні рецептори стравоходу. Холодна вода на кистях рук чи стопах рефлекс нирця НЕ вмикає.
              </div>

              <button
                type="button"
                onClick={() => setMode('menu')}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-xs cursor-pointer transition-colors"
              >
                Зрозуміло
              </button>
            </div>
          )}

          {/* ЖУРНАЛ КРИЗ */}
          {mode === 'log' && (
            <div className="p-4 rounded-3xl bg-white/80 dark:bg-[#18181c]/80 border border-slate-200/80 dark:border-zinc-800/80 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-150 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                    Історія звернень по допомогу
                  </h3>
                </div>

                {crisisLog.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearLog}
                    className="text-[10px] text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Очистити все</span>
                  </button>
                )}
              </div>

              {crisisLog.length === 0 ? (
                <div className="py-8 text-center text-slate-400 dark:text-zinc-500 text-xs space-y-1">
                  <p className="font-bold text-slate-700 dark:text-zinc-300">Записів кризових ситуацій поки немає</p>
                  <p className="text-[10px] opacity-80 max-w-[220px] mx-auto">При використанні практик SOS кожен виклик буде збережено для аналізу.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {crisisLog.map((entry) => {
                    const isOvercome = entry.outcome === 'overcome';
                    return (
                      <div
                        key={entry.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                          isOvercome
                            ? 'bg-emerald-500/5 dark:bg-emerald-950/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-100'
                            : 'bg-rose-500/5 dark:bg-rose-950/10 border-rose-500/20 text-rose-950 dark:text-rose-100'
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-extrabold text-xs truncate text-slate-800 dark:text-zinc-200">
                              {entry.protocolName || 'Виклик SOS'}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[9px] font-black border shrink-0 ${
                                isOvercome
                                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-300'
                              }`}
                            >
                              {isOvercome ? 'Подолано' : 'Зрив'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {entry.dateStr}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {entry.timeStr}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                          title="Видалити запис"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. КАРТКИ ПРАКТИК В ТОЧНОМУ СТИЛІ «МЕДИТАТИВНІ ПРОСТОРИ» З ГОЛОВНОЇ */}
      {mode === 'menu' && (
        <div className="space-y-3 mb-6">
          <div className="px-1 flex items-center justify-between">
            <span className="text-[11px] font-medium tracking-widest uppercase text-slate-400 dark:text-zinc-500">
              Практики самодопомоги
            </span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-600 font-mono">
              зняти потяг
            </span>
          </div>

          {PRACTICES.map((p) => {
            const IconComponent = p.icon;
            const isPinned = pinnedSections.includes(`sos_${p.id}`);
            return (
              <div
                key={p.id}
                onClick={() => {
                  handleSelectMode(p.id as SosMode, p.title);
                }}
                className="w-full p-4 rounded-3xl bg-white hover:bg-slate-50/90 dark:bg-[#18181f]/90 dark:hover:bg-[#1f1f27] border border-slate-200/90 dark:border-zinc-800/80 transition-all duration-300 cursor-pointer text-left relative overflow-hidden group active:scale-[0.99] shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center flex-none shadow-xs group-hover:border-zinc-600 transition-colors">
                          <IconComponent className="w-4 h-4 text-zinc-200" />
                        </div>
                        <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-zinc-100 truncate">
                          {p.title}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => togglePinSection(`sos_${p.id}`, e)}
                        className={`p-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                          isPinned
                            ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/40 shadow-xs'
                            : 'text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800'
                        }`}
                        title={isPinned ? "Прибрати зі Швидкого доступу" : "Закріпити у Швидкий доступ на Головній"}
                      >
                        <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-2 font-normal">
                      {p.desc}
                    </p>
                    <div className="text-[11px] text-slate-400 dark:text-zinc-400 flex items-center gap-1 group-hover:text-slate-700 dark:group-hover:text-zinc-200 transition-colors">
                      <span className="font-medium">{p.action}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 text-zinc-200 flex items-center justify-center flex-none border border-zinc-700/50 group-hover:border-zinc-600 transition-colors shadow-xs">
                    {p.svg}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
