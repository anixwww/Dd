import React, { useState } from 'react';
import {
  Utensils,
  Flame,
  UserX,
  BatteryLow,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  RotateCcw,
  Heart
} from 'lucide-react';
import { MonoRefractedHaltIcon } from './MonoRefractedSosIcons';

interface HaltSystemSectionProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

interface HaltItem {
  key: 'hungry' | 'angry' | 'lonely' | 'tired';
  letter: string;
  name: string;
  uaName: string;
  question: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  activeBorder: string;
  physiology: string;
  action: string;
  tip: string;
}

export const HaltSystemSection: React.FC<HaltSystemSectionProps> = ({
  onSuccess,
  onBack
}) => {
  const [selectedTriggers, setSelectedTriggers] = useState<Record<string, boolean>>({
    hungry: false,
    angry: false,
    lonely: false,
    tired: false
  });

  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({
    hungry: false,
    angry: false,
    lonely: false,
    tired: false
  });

  const [isResolved, setIsResolved] = useState<boolean>(false);

  const toggleTrigger = (key: string) => {
    setSelectedTriggers(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleActionDone = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedActions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const haltItems: HaltItem[] = [
    {
      key: 'hungry',
      letter: 'H',
      name: 'Hungry',
      uaName: 'Голодний',
      question: 'Чи давно ви повноцінно їли?',
      icon: Utensils,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 dark:bg-amber-500/15',
      borderColor: 'border-amber-500/20',
      activeBorder: 'border-amber-400/80 bg-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]',
      physiology: 'Падіння рівня глюкози в крові мозок сприймає як тривогу та стрес, провокуючи помилкове бажання закурити.',
      action: 'Зʼїжте поживний перекус (горіхи, банан, яблуко, сир) або випийте склянку теплої води/чаю.',
      tip: 'Зачекайте 10 хвилин після їжі — після насичення тяга до куріння природно згасне.'
    },
    {
      key: 'angry',
      letter: 'A',
      name: 'Angry',
      uaName: 'Злий / Роздратований',
      question: 'Чи відчуваєте ви гнів, роздратування чи внутрішню напругу?',
      icon: Flame,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 dark:bg-rose-500/15',
      borderColor: 'border-rose-500/20',
      activeBorder: 'border-rose-400/80 bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
      physiology: 'Сплеск адреналіну та кортизолу вимагає розрядки. Сигарета дає лише ілюзію паузи, але посилює хімічний стрес.',
      action: 'Зробіть 5–10 глибоких видихів животом, 15 швидких присідань або стисніть і розтисніть кулаки.',
      tip: 'Фізичний рух швидко утилізує надлишок стресових гормонів без жодної сигарети.'
    },
    {
      key: 'lonely',
      letter: 'L',
      name: 'Lonely',
      uaName: 'Самотній / Нудьгуючий',
      question: 'Чи бракує вам підтримки, контакту або цікавого заняття?',
      icon: UserX,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 dark:bg-indigo-500/15',
      borderColor: 'border-indigo-500/20',
      activeBorder: 'border-indigo-400/80 bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]',
      physiology: 'Мозок шукає окситоцин та дофамін. Ми часто купуємо сигарети, щоб "заповнити порожнечу" або відчути компаньйона.',
      action: 'Зателефонуйте другові (кнопка вгорі), напишіть повідомлення близьким або вийдіть на прогулянку серед людей.',
      tip: 'Живий контакт або зміна середовища миттєво перезавантажують емоційний стан.'
    },
    {
      key: 'tired',
      letter: 'T',
      name: 'Tired',
      uaName: 'Втомлений / Виснажений',
      question: 'Чи виснажені ви фізично або перевантажені розумово?',
      icon: BatteryLow,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10 dark:bg-sky-500/15',
      borderColor: 'border-sky-500/20',
      activeBorder: 'border-sky-400/80 bg-sky-500/20 shadow-[0_0_15px_rgba(56,189,248,0.15)]',
      physiology: 'Аденозин накопичується в нервовій системі. Виснажений мозок просить нікотин як швидкий штучний допінг.',
      action: 'Зробіть 10-хвилинну паузу з заплющеними очима, вмийтеся прохолодною водою або провітріть кімнату.',
      tip: 'Тілу потрібен справжній відпочинок і кисень, а не додатковий токсичний дим.'
    }
  ];

  const anyTriggerSelected = Object.values(selectedTriggers).some(Boolean);
  const activeCount = Object.values(selectedTriggers).filter(Boolean).length;

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-[#18181c]/80 border border-slate-200/80 dark:border-zinc-800/80 space-y-4 text-left animate-fadeIn">
      {/* Header Banner */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 flex items-center justify-center flex-none shadow-inner">
          <MonoRefractedHaltIcon className="w-6 h-6 text-zinc-100" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-zinc-100 tracking-tight">
              Система HALT: Оцінка стану
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              SOS Метод
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
            Швидка діагностика прихованих фізіологічних потреб
          </p>
        </div>
      </div>

      {/* Main Quote / Rule Prompt */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900/90 border border-slate-200/70 dark:border-zinc-800/80 space-y-2">
        <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
          Якщо ви сперечаєтесь із думкою <strong className="text-slate-900 dark:text-zinc-100 font-bold">«купити чи ні»</strong>, оцініть свій стан за системою <strong className="text-amber-500 dark:text-amber-300 font-black">HALT</strong>.
        </p>
        <p className="text-[11px] text-slate-500 dark:text-zinc-400">
          Запитайте себе, чи не є ви зараз в одному з цих 4 станів (натисніть, щоб обрати):
        </p>
      </div>

      {/* HALT 4-Block Interactive Cards */}
      <div className="space-y-2.5">
        {haltItems.map((item) => {
          const isSelected = selectedTriggers[item.key];
          const isDone = completedActions[item.key];
          const IconComp = item.icon;

          return (
            <div
              key={item.key}
              onClick={() => toggleTrigger(item.key)}
              className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer text-left select-none relative group ${
                isSelected
                  ? item.activeBorder
                  : 'bg-slate-50/70 dark:bg-zinc-900/60 border-slate-200/70 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Letter badge + icon */}
                  <div className={`w-9 h-9 rounded-xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center flex-none shadow-xs mt-0.5`}>
                    <span className={`text-base font-black ${item.color} font-mono`}>
                      {item.letter}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                        {item.name} ({item.uaName})
                      </h4>
                      {isSelected && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Виявлено
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-snug">
                      {item.question}
                    </p>
                  </div>
                </div>

                {/* Selection checkbox */}
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 mt-1 ${
                  isSelected
                    ? 'bg-amber-500 border-amber-400 text-zinc-950 font-bold shadow-xs'
                    : 'border-slate-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 text-transparent group-hover:border-slate-400 dark:group-hover:border-zinc-500'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Expandable details when selected */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-zinc-800/80 space-y-2 animate-fadeIn text-xs">
                  <div className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed bg-black/10 dark:bg-black/25 p-2.5 rounded-xl border border-white/5">
                    <strong className="text-slate-800 dark:text-zinc-100">Чому так відбувається:</strong> {item.physiology}
                  </div>

                  <div className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-emerald-700 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Конкретна дія замість сигарети:</span>
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-zinc-200 mt-0.5 leading-relaxed">
                        {item.action}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 italic">
                        💡 {item.tip}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => toggleActionDone(item.key, e)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                        isDone
                          ? 'bg-emerald-500 text-zinc-950 border border-emerald-400 shadow-xs'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Виконано</span>
                        </>
                      ) : (
                        <span>Зробив(ла)</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Box */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-100">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Головний висновок методу:</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Часто сигаретою ми намагаємося закрити одну з цих базових потреб. Задовольніть її (поїжте, заспокойтеся, поспілкуйтеся, відпочиньте) — і тяга до куріння різко знизиться.
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-2 space-y-2">
        <button
          type="button"
          onClick={() => {
            setIsResolved(true);
            if (onSuccess) onSuccess();
          }}
          className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>Я закрив(ла) базову потребу — потяг спав! 🎉</span>
        </button>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-600 dark:text-zinc-300 font-bold text-xs transition-colors cursor-pointer text-center"
          >
            Назад до меню SOS
          </button>
        )}
      </div>
    </div>
  );
};
