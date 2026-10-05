import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Trophy, Sparkles, X, Flame, ShieldCheck, Heart, Zap, Award } from 'lucide-react';

interface HourlyAchievementModalProps {
  startDate: number;
}

export const HourlyAchievementModal: React.FC<HourlyAchievementModalProps> = ({ startDate }) => {
  const [currentMilestoneHour, setCurrentMilestoneHour] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkHourMilestone = () => {
      const now = Date.now();
      const diffMs = now - startDate;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));

      if (hours < 1) return;

      try {
        const lastCelebrated = localStorage.getItem('quit-smoking:last-celebrated-hour');
        
        // On very first launch, initialize to current hours without abruptly flashing old milestones
        if (lastCelebrated === null) {
          localStorage.setItem('quit-smoking:last-celebrated-hour', String(hours));
          return;
        }

        const lastNum = parseInt(lastCelebrated, 10);
        if (!isNaN(lastNum) && hours > lastNum) {
          // New hourly milestone reached!
          setCurrentMilestoneHour(hours);
          setIsOpen(true);
          localStorage.setItem('quit-smoking:last-celebrated-hour', String(hours));
          try {
            if (navigator.vibrate) navigator.vibrate([50, 100, 50, 100, 200]);
          } catch {}
        }
      } catch {}
    };

    checkHourMilestone();
    const interval = setInterval(checkHourMilestone, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [startDate]);

  if (!isOpen || currentMilestoneHour === null || typeof document === 'undefined') return null;

  const getMilestoneDetails = (hr: number) => {
    if (hr === 1) {
      return {
        title: 'Перша година свободи!',
        subtitle: 'Сталевий початок',
        desc: 'Рівень чадного газу в крові починає падати, а кисень повертається до кожної клітини.',
        badge: '✨',
        color: 'from-amber-500 to-orange-500'
      };
    } else if (hr === 2) {
      return {
        title: '2 години чистого дихання!',
        subtitle: 'Перші кроки до перемоги',
        desc: 'Нікотин починає виходити з кровотоку. Твоя воля сильніша за будь-який тимчасовий потяг!',
        badge: '🛡️',
        color: 'from-emerald-500 to-teal-500'
      };
    } else if (hr === 3) {
      return {
        title: '3 години незламності!',
        subtitle: 'Рівень енергії росте',
        desc: 'Бронхіоли розслабляються, дихати стає помітно легше. Ти тримаєш ситуацію під повним контролем!',
        badge: '⚡',
        color: 'from-sky-500 to-indigo-500'
      };
    } else if (hr === 6) {
      return {
        title: '6 годин тріумфу!',
        subtitle: 'Половина пікового дня',
        desc: 'Фізіологічна буря перших годин позаду. Твоє тіло активно очищується від токсинів.',
        badge: '💎',
        color: 'from-purple-500 to-pink-500'
      };
    } else if (hr === 12) {
      return {
        title: '12 годин чистоти!',
        subtitle: 'Півдоби без отрути',
        desc: 'Рівень кисню повністю нормалізується. Серцевий мʼяз працює в ідеальному спокійному ритмі.',
        badge: '🌟',
        color: 'from-blue-600 to-cyan-500'
      };
    } else if (hr === 24) {
      return {
        title: 'Ціла доба (24 години)! Епічний рубіж!',
        subtitle: 'День абсолютної свободи',
        desc: 'Ти подолав повну добу! Ризик серцевого нападу починає знижуватися. Це неймовірне досягнення!',
        badge: '👑',
        color: 'from-amber-400 via-rose-500 to-purple-600'
      };
    } else {
      return {
        title: `${hr} годин абсолютного тріумфу!`,
        subtitle: 'Епічна стійкість',
        desc: `Вже ${hr} годин твоє тіло і розум вільні від сигаретного полону. Кожна година робить тебе сильнішим!`,
        badge: '🏆',
        color: 'from-indigo-600 via-purple-600 to-pink-600'
      };
    }
  };

  const details = getMilestoneDetails(currentMilestoneHour);

  return createPortal(
    <div 
      className="fixed inset-0 z-[500] flex items-center justify-center p-3.5 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="w-full max-w-md bg-gradient-to-b from-zinc-900 via-zinc-900 to-[#121216] border border-amber-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-white text-center relative overflow-hidden space-y-5 animate-in zoom-in-95 duration-300 origin-center my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow background effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center space-y-4">
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-0 right-0 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Epic Badge Emblem */}
          <div className="relative pt-2">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500/25 to-purple-500/25 border-2 border-amber-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.3)] animate-bounce" style={{ animationDuration: '3s' }}>
              <span className="text-4xl select-none">{details.badge}</span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-[10px] uppercase tracking-wider shadow-md">
              {currentMilestoneHour} ГОДИНА
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
              {details.subtitle}
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              {details.title}
            </h2>
          </div>

          {/* Description Card */}
          <div className="p-4 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 text-xs sm:text-sm text-zinc-200 leading-relaxed shadow-inner">
            {details.desc}
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className={`w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r ${details.color} hover:opacity-95 text-white font-extrabold text-sm shadow-lg cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-2`}
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Продовжувати тріумф! 🚀</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
