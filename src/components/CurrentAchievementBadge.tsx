import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles, X, Award, Flame } from 'lucide-react';

interface CurrentAchievementBadgeProps {
  startDate: number;
}

const YinYangStarIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} stroke="currentColor" strokeWidth="1.2">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 2a10 10 0 0 0 0 20 5 5 0 0 0 0-10 5 5 0 0 1 0-10z" fill="currentColor" />
    {/* Upper Star instead of circle */}
    <polygon points="12,5.2 12.6,6.8 14.2,6.8 12.9,7.8 13.4,9.4 12,8.4 10.6,9.4 11.1,7.8 9.8,6.8 11.4,6.8" fill="#121216" />
    {/* Lower Star instead of circle */}
    <polygon points="12,14.6 12.6,16.2 14.2,16.2 12.9,17.2 13.4,18.8 12,17.8 10.6,18.8 11.1,17.2 9.8,16.2 11.4,16.2" fill="#ffffff" />
  </svg>
);

export const CurrentAchievementBadge: React.FC<CurrentAchievementBadgeProps> = ({ startDate }) => {
  const [hours, setHours] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const updateHours = () => {
      const now = Date.now();
      const diffMs = now - startDate;
      const h = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
      setHours(h);
    };
    updateHours();
    const interval = setInterval(updateHours, 10000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <>
      {/* Floating Badge in Top Right Corner */}
      <div 
        onClick={() => setShowModal(true)}
        className="fixed top-3 right-3 z-[110] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/90 via-orange-500/90 to-purple-600/90 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-300/50 cursor-pointer hover:scale-105 active:scale-95 transition-all select-none animate-fadeIn backdrop-blur-md"
        title="Ваше актуальне досягнення"
      >
        <YinYangStarIcon className="w-3.5 h-3.5 text-amber-200" />
        <span className="text-xs font-black font-mono tracking-wide">
          {hours === 0 ? '< 1 год' : `${hours} год`}
        </span>
      </div>

      {/* Modal / Summary popup when clicked */}
      {showModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="w-full max-w-sm bg-[#18181f] border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-white text-center relative space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-inner text-2xl">
              🏆
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Актуальне досягнення
              </span>
              <h3 className="text-lg font-black text-white mt-1">
                {hours === 0 ? 'Початок шляху' : `${hours} годин свободи!`}
              </h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {hours === 0
                ? 'Ти тільки почав свій шлях без тютюну. Кожна секунда має значення!'
                : `Ти не куриш вже ${hours} годин поспіль. Твоє тіло очищується від токсинів, а твоя сила волі творить справжні чудеса.`}
            </p>

            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
              Старт: {new Date(startDate).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' })}
            </div>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs cursor-pointer shadow-md hover:opacity-95 transition-all"
            >
              Продовжувати перемогу! ✨
            </button>
          </div>
        </div>
      )}
    </>
  );
};
