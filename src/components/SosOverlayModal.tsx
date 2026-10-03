import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Wind, 
  Droplets, 
  Waves, 
  Eye, 
  Music, 
  Compass, 
  Gamepad2, 
  BookOpen, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  Calendar,
  Clock,
  Trash2
} from 'lucide-react';
import { SosSoundscapes } from './SosSoundscapes';
import { HealthyReplacements } from './HealthyReplacements';
import { AntiStressBubbles } from './AntiStressBubbles';
import { CopingCardsWidget } from './CopingCardsWidget';
import {
  MonoRefractedWindIcon,
  MonoRefractedWavesIcon,
  MonoRefractedEyeIcon,
  MonoRefractedMusicIcon,
  MonoRefractedCompassIcon,
  MonoRefractedGamepadIcon,
  MonoRefractedBookOpenIcon,
  MonoRefractedDropletsIcon,
  MonoRefractedHistoryIcon,
  MonoRefractedLifebuoyIcon
} from './MonoRefractedSosIcons';

interface SosOverlayModalProps {
  sectionKey: string;
  onClose: () => void;
  onSwitchTab?: (tab: any) => void;
}

const CRISIS_LOG_STORAGE_KEY = 'quit-smoking:sos-crisis-log';

export const SosOverlayModal: React.FC<SosOverlayModalProps> = ({
  sectionKey,
  onClose,
  onSwitchTab,
}) => {
  // Breathing state
  const [breathTechnique, setBreathTechnique] = useState<'sigh' | 'box' | '478'>('sigh');
  const [breathSecLeft, setBreathSecLeft] = useState<number>(4);
  const [breathPhase, setBreathPhase] = useState<string>('Вдих');

  // Wave state
  const [waveSecLeft, setWaveSecLeft] = useState<number>(180);
  const [waveRunning, setWaveRunning] = useState<boolean>(true);

  // Grounding state
  const [groundingStep, setGroundingStep] = useState<number>(0);

  // Crisis log state
  const [crisisLog, setCrisisLog] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(CRISIS_LOG_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Breathing timer
  useEffect(() => {
    if (sectionKey !== 'sos_breath') return;
    let step = 0;
    const timer = setInterval(() => {
      let sec = breathSecLeft;
      if (breathTechnique === 'sigh') {
        step = (step + 1) % 3;
        if (step === 0) {
          setBreathPhase('Глибокий вдих');
          sec = 3;
        } else if (step === 1) {
          setBreathPhase('Мікро-вдих до верху');
          sec = 1;
        } else {
          setBreathPhase('Повільний видих ротом');
          sec = 6;
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
      setBreathSecLeft(sec);
    }, 1000);

    return () => clearInterval(timer);
  }, [sectionKey, breathTechnique]);

  // Wave timer
  useEffect(() => {
    if (sectionKey !== 'sos_wave' || !waveRunning) return;
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
  }, [sectionKey, waveRunning]);

  const handleDeleteEntry = (id: string) => {
    const next = crisisLog.filter((item) => item.id !== id);
    setCrisisLog(next);
    try {
      localStorage.setItem(CRISIS_LOG_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const getMetadata = () => {
    switch (sectionKey) {
      case 'sos_breath':
        return {
          title: 'Фізіологічне дихання',
          desc: 'Знижує пульс, рівень адреналіну та гострий потяг',
          icon: MonoRefractedWindIcon,
          color: 'text-zinc-200'
        };
      case 'sos_wave':
        return {
          title: 'Серфінг хвилі тяги',
          desc: 'Перечекати пік фізіологічної тяги (3–5 хв)',
          icon: MonoRefractedWavesIcon,
          color: 'text-zinc-200'
        };
      case 'sos_grounding':
        return {
          title: 'Заземлення 5-4-3-2-1',
          desc: 'Сенсорне повернення у тіло через органи чуття',
          icon: MonoRefractedEyeIcon,
          color: 'text-zinc-200'
        };
      case 'sos_sound':
        return {
          title: 'Звукотерапія спокою',
          desc: 'Звуки природи для миттєвого релаксу',
          icon: MonoRefractedMusicIcon,
          color: 'text-zinc-200'
        };
      case 'sos_wheel':
        return {
          title: 'Колесо корисних замінників',
          desc: '1-хвилинні мікро-дії замість сигарети',
          icon: MonoRefractedCompassIcon,
          color: 'text-zinc-200'
        };
      case 'sos_game':
        return {
          title: 'Лопай Бульбашки',
          desc: 'Тактильна гра для перемикання уваги',
          icon: MonoRefractedGamepadIcon,
          color: 'text-zinc-200'
        };
      case 'sos_cards':
        return {
          title: 'Когнітивні картки SOS',
          desc: 'Психологічна підтримка проти зриву',
          icon: MonoRefractedBookOpenIcon,
          color: 'text-zinc-200'
        };
      case 'sos_cold':
        return {
          title: 'Холодовий шок нирця',
          desc: 'Миттєве перезавантаження блукаючого нерва',
          icon: MonoRefractedDropletsIcon,
          color: 'text-zinc-200'
        };
      case 'sos_log':
        return {
          title: 'Журнал криз SOS',
          desc: 'Історія та перемога над нападами тяги',
          icon: MonoRefractedHistoryIcon,
          color: 'text-zinc-200'
        };
      default:
        return {
          title: 'SOS Практика',
          desc: 'Швидка допомога при гострій тязі',
          icon: MonoRefractedLifebuoyIcon,
          color: 'text-zinc-200'
        };
    }
  };

  const meta = getMetadata();
  const IconComp = meta.icon;

  const renderContent = () => {
    switch (sectionKey) {
      case 'sos_sound':
        return <SosSoundscapes />;
      case 'sos_wheel':
        return <HealthyReplacements />;
      case 'sos_game':
        return <AntiStressBubbles />;
      case 'sos_cards':
        return <CopingCardsWidget />;

      case 'sos_breath':
        return (
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#18181c] border border-slate-200/80 dark:border-zinc-800/80 space-y-4 text-center">
            <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-slate-200/70 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
              {[
                { id: 'sigh', label: 'Подвійний вдих' },
                { id: 'box', label: 'Квадрат 4x4' },
                { id: '478', label: 'Сон 4-7-8' }
              ].map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => setBreathTechnique(tech.id as any)}
                  className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    breathTechnique === tech.id
                      ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-500 dark:text-zinc-400'
                  }`}
                >
                  {tech.label}
                </button>
              ))}
            </div>

            <div className="py-6 flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full bg-emerald-500/20 dark:bg-emerald-500/15 border-2 border-emerald-500/40 transition-all duration-1000 transform ${
                    breathPhase.includes('Вдих') ? 'scale-110' : 'scale-90'
                  }`}
                />
                <div className="relative z-10 space-y-1">
                  <div className="text-4xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                    {breathSecLeft}
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                    {breathPhase}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Повторіть цей цикл 5–10 разів, щоб нервова система автоматично перемкнулася у парасимпатичний спокій.
            </p>
          </div>
        );

      case 'sos_wave':
        const formatWaveTime = (total: number) => {
          const m = Math.floor(total / 60);
          const s = total % 60;
          return `${m}:${s < 10 ? '0' : ''}${s}`;
        };
        return (
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#18181c] border border-slate-200/80 dark:border-zinc-800/80 space-y-4 text-center">
            <div className="py-4 flex flex-col items-center justify-center">
              <div className="w-36 h-36 rounded-full bg-teal-500/15 border-2 border-teal-500/30 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-teal-500/10 animate-pulse pointer-events-none" />
                <span className="text-3xl font-black font-mono text-teal-600 dark:text-teal-400 relative z-10">
                  {formatWaveTime(waveSecLeft)}
                </span>
                <span className="text-[10px] text-teal-700 dark:text-teal-300 font-bold uppercase tracking-wider mt-1 relative z-10">
                  {waveRunning ? 'Хвиля спадає' : 'Хвилю подолано!'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">
              Нікотиновий позив досягає піку за 90 секунд і зникає через 3 хвилини. Просто спостерігайте за відчуттями, дихайте і не боріться.
            </p>

            <button
              type="button"
              onClick={() => {
                setWaveSecLeft(180);
                setWaveRunning(true);
              }}
              className="py-2.5 px-4 rounded-xl border border-teal-500/40 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Перезапустити 3 хв</span>
            </button>
          </div>
        );

      case 'sos_grounding':
        return (
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#18181c] border border-slate-200/80 dark:border-zinc-800/80 space-y-4 text-center">
            <div className="flex justify-center gap-1.5 mb-2">
              {[5, 4, 3, 2, 1].map((num, i) => (
                <div
                  key={num}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    groundingStep === i
                      ? 'bg-indigo-600 text-white shadow-xs scale-105'
                      : groundingStep > i
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>

            {groundingStep === 0 && (
              <div className="space-y-2 py-3">
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                  Побачте 5 предметів навколо
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Озирніться та усвідомлено назвіть про себе: вікно, стіл, тінь на стіні, годинник, власні руки.
                </p>
              </div>
            )}
            {groundingStep === 1 && (
              <div className="space-y-2 py-3">
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                  Відчуйте 4 фізичні дотики
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Сфокусуйтесь на тактильних відчуттях: одяг на тілі, прохолода телефону, опора стоп об підлогу.
                </p>
              </div>
            )}
            {groundingStep === 2 && (
              <div className="space-y-2 py-3">
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                  Прислухайтесь до 3 звуків
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Закрийте очі та розрізніть: шуми на вулиці, власне дихання, гудіння приладів.
                </p>
              </div>
            )}
            {groundingStep === 3 && (
              <div className="space-y-2 py-3">
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                  Знайдіть 2 запахи
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Вдихніть повітря носом: свіжість кімнати, аромат кави або мила на пальцях.
                </p>
              </div>
            )}
            {groundingStep === 4 && (
              <div className="space-y-2 py-3">
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                  Відчуйте 1 смак
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Зробіть ковток води, відчуйте м'ятну свіжість або чистий подих без диму.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                if (groundingStep < 4) {
                  setGroundingStep((s) => s + 1);
                } else {
                  setGroundingStep(0);
                }
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs transition-colors cursor-pointer"
            >
              {groundingStep < 4 ? 'Наступне відчуття ➡️' : 'Почати спочатку 🔄'}
            </button>
          </div>
        );

      case 'sos_cold':
        return (
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#18181c] border border-slate-200/80 dark:border-zinc-800/80 space-y-3.5 text-left">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 flex items-start gap-3.5 text-xs">
              <div className="w-6 h-6 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-none font-black">
                1
              </div>
              <p className="text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">
                Повільно випийте склянку крижаної води дрібними ковтками, фокусуючись на фізичному відчутті прохолоди в горлі.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 flex items-start gap-3.5 text-xs">
              <div className="w-6 h-6 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-none font-black">
                2
              </div>
              <p className="text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">
                Вмийте обличчя крижаною водою або прикладіть холодний компрес до потилиці — це запускає вазомоторний рефлекс нирця, який миттєво збиває потяг.
              </p>
            </div>
          </div>
        );

      case 'sos_log':
        return (
          <div className="space-y-3">
            {crisisLog.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-zinc-500">
                Записів криз поки немає. Ваша витримка на найвищому рівні! ✨
              </div>
            ) : (
              crisisLog.map((entry) => {
                const isOvercome = entry.outcome === 'overcome';
                return (
                  <div
                    key={entry.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                      isOvercome
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-950 dark:text-emerald-100'
                        : 'bg-rose-500/5 border-rose-500/20 text-rose-950 dark:text-rose-100'
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
              })
            )}
          </div>
        );

      default:
        return (
          <div className="py-6 text-center text-xs text-slate-500 dark:text-zinc-400">
            Практика успішно закріплена у Швидкому доступі!
          </div>
        );
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-x-hidden overflow-y-auto">
      {/* Solid Dark Backdrop - prevents bleed through */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer" 
        onClick={onClose}
      />
      
      {/* Modal Dialog Body - 100% Opaque Solid Surface */}
      <div className="relative w-full max-w-md mx-auto bg-white dark:bg-[#13141a] border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col max-h-[88dvh] overflow-hidden animate-fade-in z-10 text-left">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200/50 dark:border-zinc-800/50 flex items-center justify-between bg-slate-50 dark:bg-[#181a22] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className={`p-2 rounded-xl bg-rose-500/10 ${meta.color}`}>
              <IconComp className="w-4 h-4" />
            </span>
            <div className="text-left">
              <h3 className="text-xs font-black text-slate-900 dark:text-zinc-100 uppercase tracking-widest leading-none">
                {meta.title}
              </h3>
              <p className="text-[9px] text-slate-500 dark:text-zinc-400 mt-1 font-medium leading-none">
                {meta.desc}
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Scrollable Section Content Container */}
        <div className="p-4 overflow-y-auto flex-1 text-left bg-white dark:bg-[#13141a]">
          {renderContent()}

          {/* Quick link to full SOS tab */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-zinc-800/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-zinc-500">
              Потрібна додаткова підтримка?
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onSwitchTab) {
                  onSwitchTab('sos');
                } else {
                  window.dispatchEvent(new CustomEvent('change-tab', { detail: 'sos' }));
                }
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              <span>Відкрити весь розділ SOS</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};
