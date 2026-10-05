import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw } from 'lucide-react';
import { MonoRefractedCheckinIcon } from './MonoRefractedStatsIcons';
import { QuickMechanicsDrawer } from '../QuickMechanicsDrawer';

interface CheckinData {
  completed: boolean;
  timestamp: number;
  time?: string;
  water: number;
  sleepHours: number;
  sleepQuality: number;
  craving: number;
  anxiety: number;
  calmness: number;
  energy: number;
  entries?: any[];
  intermediateCount?: number;
}

export const AiCheckinQuickWidget: React.FC = () => {
  const [checkin, setCheckin] = useState<CheckinData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getTodayDateStr = () => {
    const d = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const loadCheckinStatus = () => {
    try {
      const today = getTodayDateStr();
      const raw = localStorage.getItem(`quit-smoking:health-checkin:${today}`);
      if (raw) {
        setCheckin(JSON.parse(raw));
      } else {
        setCheckin(null);
      }
    } catch {
      setCheckin(null);
    }
  };

  useEffect(() => {
    loadCheckinStatus();
    window.addEventListener('storage', loadCheckinStatus);
    window.addEventListener('quick-mechanics-updated', loadCheckinStatus);
    window.addEventListener('checkin-updated', loadCheckinStatus);
    window.addEventListener('health-indicators-changed', loadCheckinStatus);
    return () => {
      window.removeEventListener('storage', loadCheckinStatus);
      window.removeEventListener('quick-mechanics-updated', loadCheckinStatus);
      window.removeEventListener('checkin-updated', loadCheckinStatus);
      window.removeEventListener('health-indicators-changed', loadCheckinStatus);
    };
  }, []);

  const handleOpenCheckin = () => {
    setIsDrawerOpen(true);
    // Also dispatch event for any global listeners
    window.dispatchEvent(new CustomEvent('open-quick-mechanics', { detail: 'daily_checkin' }));
  };

  const isCompleted = checkin && checkin.completed;
  const count = checkin?.intermediateCount || (checkin?.entries?.length) || (isCompleted ? 1 : 0);

  return (
    <>
      <div className="w-full max-w-md mx-auto mb-2.5 px-3 select-none">
        <div 
          onClick={handleOpenCheckin}
          className="w-full p-2.5 px-3.5 rounded-2xl bg-[#14141c]/90 hover:bg-[#1a1a24] border border-zinc-800/80 hover:border-zinc-700/80 shadow-xs flex flex-col gap-2.5 text-left transition-all duration-200 cursor-pointer active:scale-[0.99] group backdrop-blur-md"
        >
          <div className="flex items-center justify-between gap-3 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-200/15 via-zinc-400/5 to-zinc-950/60 border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-md flex items-center justify-center text-zinc-100 group-hover:border-white/40 group-hover:scale-105 transition-all shrink-0">
                <MonoRefractedCheckinIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-200 group-hover:text-white flex items-center gap-1.5 transition-colors">
                  <span>Чек-ін</span>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-md border font-mono tracking-wider uppercase scale-90 ${
                    isCompleted 
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.2)]' 
                      : 'border-amber-500/40 bg-amber-500/15 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                  }`}>
                    {isCompleted ? (count > 1 ? `Пройдено (${count} зрізи)` : 'Виконано') : 'Не пройдено'}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                  {isCompleted 
                    ? (count > 1 
                        ? `${count} проміжні зрізи сьогодні • Натисніть для оновлення` 
                        : `Зріз зафіксовано • Натисніть для повторного проходження (проміжний зріз)`)
                    : 'Оцініть свій стан, сон та воду прямо зараз'}
                </p>
              </div>
            </div>

            {isCompleted && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold flex-none">
                <span className="text-[11px] hidden xs:inline opacity-80">Оновити</span>
                <RefreshCw className="w-3.5 h-3.5 text-zinc-500 group-hover:rotate-180 transition-transform duration-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Direct Quick Mechanics Drawer modal for seamless instantaneous check-in */}
      <QuickMechanicsDrawer
        isOpen={isDrawerOpen}
        initialSection="daily_checkin"
        onClose={() => {
          setIsDrawerOpen(false);
          loadCheckinStatus();
        }}
      />
    </>
  );
};
