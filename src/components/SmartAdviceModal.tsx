import React, { useState, useEffect, useMemo } from 'react';
import { X, Activity, Droplets, Moon, Coffee, Sparkles, Zap, Check } from 'lucide-react';

const OwlIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Head and ears */}
    <path d="M18 3c-1.5 1.5-2.5 3-2.5 4.5 0 0-2-.5-3.5-.5S8.5 7.5 8.5 7.5C8.5 6 7.5 4.5 6 3c0 2 0 4 .5 5.5C4.5 10 4 12 4 14c0 4.5 3.5 8 8 8s8-3.5 8-8c0-2-.5-4-2.5-5.5.5-1.5.5-3.5.5-5.5z" />
    {/* Eyes */}
    <circle cx="9" cy="12" r="2.5" />
    <circle cx="15" cy="12" r="2.5" />
    <circle cx="9" cy="12" r="1" fill="currentColor" />
    <circle cx="15" cy="12" r="1" fill="currentColor" />
    {/* Beak */}
    <path d="M12 13.5l-1 2h2l-1-2z" fill="currentColor" />
    {/* Chest feathers */}
    <path d="M9 18c1 .5 2 .8 3 .8s2-.3 3-.8" strokeWidth="1.5" />
  </svg>
);

interface SmartAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartAdviceModal: React.FC<SmartAdviceModalProps> = ({ isOpen, onClose }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleStorage = () => setRefreshTrigger(prev => prev + 1);
    window.addEventListener('storage', handleStorage);
    
    // Auto-refresh every 30 seconds for real-time feel
    const interval = setInterval(() => setRefreshTrigger(prev => prev + 1), 30000);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const metrics = useMemo(() => {
    let craving = 1;
    let water = 0;
    let sleep = 7.5;
    let coffee = false;
    let energy = 5;

    try {
      // 1. Survey Data (Craving, Energy)
      const savedDays = localStorage.getItem('quit-smoking:days');
      if (savedDays) {
        const daysMap = JSON.parse(savedDays);
        if (daysMap && daysMap[todayStr]) {
          const surveys = daysMap[todayStr].surveys || daysMap[todayStr].entries || [];
          if (surveys.length > 0) {
            const latest = surveys[surveys.length - 1];
            if (typeof latest.craving === 'number') craving = latest.craving;
            if (typeof latest.energy === 'number') energy = latest.energy;
          }
        }
      }

      // 2. Physical Metrics (Water, Sleep, Caffeine)
      const savedWater = localStorage.getItem(`quit-smoking:hydration-${todayStr}`);
      if (savedWater) water = parseInt(savedWater, 10) || 0;

      const savedSleep = localStorage.getItem(`quit-smoking:sleep-${todayStr}`);
      if (savedSleep) sleep = parseFloat(savedSleep) || 7.5;

      const savedMorning = localStorage.getItem(`quit-smoking:morning-${todayStr}`);
      if (savedMorning === 'true') coffee = true;

      const savedCustom = localStorage.getItem('quit-smoking:health-custom-logs');
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom);
        if (Array.isArray(parsed)) {
          const todayCoffee = parsed.some((l: any) => l.dateStr === todayStr && l.category === 'coffee');
          if (todayCoffee) coffee = true;
        }
      }
    } catch (e) {
      console.error('Error fetching metrics for SmartAdviceModal:', e);
    }

    return { craving, water, sleep, coffee, energy };
  }, [refreshTrigger, todayStr]);

  const handleAddWater = () => {
    try {
      const key = `quit-smoking:hydration-${todayStr}`;
      const current = parseInt(localStorage.getItem(key) || '0', 10);
      const updated = current + 250;
      localStorage.setItem(key, String(updated));
      window.dispatchEvent(new Event('hydration-updated'));
      window.dispatchEvent(new Event('storage'));
      onClose();
    } catch {}
  };

  const advice = useMemo(() => {
    if (metrics.craving >= 4) {
      return { 
        text: "Аналізатор: Критична тяга. Дихайте.", 
        description: "Хвиля тяги триває лише 3-5 хвилин. Зробіть глибокий видих — імпульс неминуче піде на спад.",
        icon: <Activity className="w-4 h-4 text-rose-400" />,
        type: 'rose',
        actionButtonText: "Зрозумів",
        quickAddWater: false,
      };
    }
    
    if (metrics.water < 1200) {
      return { 
        text: "Аналізатор: Дефіцит води. Випийте.", 
        description: "Сухість слизових мозок часто плутає з бажанням закурити. Склянка води миттєво знімає спазм.",
        icon: <Droplets className="w-4 h-4 text-sky-400" />,
        type: 'sky',
        actionButtonText: "Випити води (+250 мл)",
        quickAddWater: true,
      };
    }

    if (metrics.energy < 3) {
      return { 
        text: "Аналізатор: Низька енергія. Пауза.", 
        description: "Виснажений мозок шукає швидкого дофаміну. Дайте собі 5 хвилин тихого перепочинку без гаджетів.",
        icon: <Zap className="w-4 h-4 text-amber-400" />,
        type: 'amber',
        actionButtonText: "Зрозумів, відпочину",
        quickAddWater: false,
      };
    }

    if (metrics.sleep < 6.5) {
      return { 
        text: "Аналізатор: Недосип. Будьте обережні.", 
        description: "Брак сну тимчасово знижує ресурс лобової кори. Сьогодні уникайте зайвого стресу та тригерів.",
        icon: <Moon className="w-4 h-4 text-indigo-400" />,
        type: 'indigo',
        actionButtonText: "Зрозумів",
        quickAddWater: false,
      };
    }

    if (metrics.coffee) {
      return { 
        text: "Аналізатор: Кофеїн. Зробіть розминку.", 
        description: "Без нікотину кава діє вдвічі яскравіше. 20 присідань або коротка розминка спалять зайвий адреналін.",
        icon: <Coffee className="w-4 h-4 text-orange-400" />,
        type: 'orange',
        actionButtonText: "Зрозумів, розімнуся",
        quickAddWater: false,
      };
    }
    
    return { 
      text: "Аналізатор: Ваш стан стабільний", 
      description: "Всі ключові показники в нормі. Твоя нервова система захищена фізіологічними ресурсами.",
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      type: 'emerald',
      actionButtonText: "Чудово, дякую!",
      quickAddWater: false,
    };
  }, [metrics]);

  const styleConfig = useMemo(() => {
    switch (advice.type) {
      case 'rose':
        return {
          border: 'border-rose-500/30',
          ambientGlow: 'bg-rose-500/15',
          ringGlow: 'bg-rose-500/20',
          shadow: 'shadow-[0_20px_60px_-15px_rgba(244,63,94,0.35)]',
          statusDot: 'bg-rose-500',
          iconColor: 'text-rose-400',
          buttonClass: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.35)]',
        };
      case 'sky':
        return {
          border: 'border-sky-500/30',
          ambientGlow: 'bg-sky-500/15',
          ringGlow: 'bg-sky-500/20',
          shadow: 'shadow-[0_20px_60px_-15px_rgba(14,165,233,0.35)]',
          statusDot: 'bg-sky-400',
          iconColor: 'text-sky-400',
          buttonClass: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(14,165,233,0.35)]',
        };
      case 'amber':
        return {
          border: 'border-amber-500/30',
          ambientGlow: 'bg-amber-500/15',
          ringGlow: 'bg-amber-500/20',
          shadow: 'shadow-[0_20px_60px_-15px_rgba(245,158,11,0.35)]',
          statusDot: 'bg-amber-400',
          iconColor: 'text-amber-400',
          buttonClass: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 shadow-[0_0_30px_rgba(245,158,11,0.35)]',
        };
      case 'indigo':
        return {
          border: 'border-indigo-500/30',
          ambientGlow: 'bg-indigo-500/15',
          ringGlow: 'bg-indigo-500/20',
          shadow: 'shadow-[0_20px_60px_-15px_rgba(99,102,241,0.35)]',
          statusDot: 'bg-indigo-400',
          iconColor: 'text-indigo-400',
          buttonClass: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.35)]',
        };
      case 'orange':
        return {
          border: 'border-orange-500/30',
          ambientGlow: 'bg-orange-500/15',
          ringGlow: 'bg-orange-500/20',
          shadow: 'shadow-[0_20px_60px_-15px_rgba(249,115,22,0.35)]',
          statusDot: 'bg-orange-400',
          iconColor: 'text-orange-400',
          buttonClass: 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.35)]',
        };
      default:
        return {
          border: 'border-emerald-500/30',
          ambientGlow: 'bg-emerald-500/15',
          ringGlow: 'bg-emerald-500/20',
          shadow: 'shadow-[0_20px_60px_-15px_rgba(16,185,129,0.35)]',
          statusDot: 'bg-emerald-400',
          iconColor: 'text-emerald-400',
          buttonClass: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 shadow-[0_0_30px_rgba(16,185,129,0.35)]',
        };
    }
  }, [advice.type]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-sm rounded-[2.5rem] p-6 sm:p-7 text-center overflow-hidden border transition-all duration-300 transform animate-scale-in bg-gradient-to-b from-[#15161f]/95 via-[#0e0f15]/95 to-[#090a0f]/98 ${styleConfig.border} ${styleConfig.shadow}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Light Beam */}
        <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none ${styleConfig.ambientGlow}`} />

        {/* Top Bar with Badge & Close */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-black uppercase tracking-wider text-zinc-300">
            <span className={`w-1.5 h-1.5 rounded-full ${styleConfig.statusDot} animate-pulse`} />
            <span>Аналізатор стану</span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
            title="Закрити"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Central Simplified Badge */}
        <div className="relative z-10 mx-auto my-6 flex items-center justify-center">
          <div className={`absolute w-20 h-20 rounded-full blur-2xl opacity-60 ${styleConfig.ringGlow}`} />
          <div className="relative w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
            {/* Using a star sparkle for the analyzer logo */}
            <Sparkles className={`w-8 h-8 ${styleConfig.iconColor}`} />
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#101117] border border-white/15 shadow-md">
              {advice.icon}
            </div>
          </div>
        </div>

        {/* Primary Advice Headline */}
        <div className="relative z-10 space-y-1 mb-6">
          <h3 className="text-lg font-bold text-white tracking-tight">
            {advice.text.replace('Аналізатор: ', '')}
          </h3>
          <p className="text-xs text-zinc-400 font-medium leading-relaxed px-2">
            {advice.description}
          </p>
        </div>

        {/* Live Mini-Metrics Sensor Bar */}
        <div className="relative z-10 grid grid-cols-4 gap-1 p-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-5 text-center">
          <div className="py-1 px-0.5">
            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Тяга</div>
            <div className={`text-xs font-black font-mono mt-0.5 ${metrics.craving >= 4 ? 'text-rose-400' : 'text-zinc-200'}`}>
              {metrics.craving}/5
            </div>
          </div>
          <div className="py-1 px-0.5 border-l border-white/[0.06]">
            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Вода</div>
            <div className={`text-xs font-black font-mono mt-0.5 ${metrics.water < 1200 ? 'text-sky-400' : 'text-zinc-200'}`}>
              {metrics.water} <span className="text-[9px] font-normal text-zinc-500">мл</span>
            </div>
          </div>
          <div className="py-1 px-0.5 border-l border-white/[0.06]">
            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Енергія</div>
            <div className={`text-xs font-black font-mono mt-0.5 ${metrics.energy < 3 ? 'text-amber-400' : 'text-zinc-200'}`}>
              {metrics.energy}/5
            </div>
          </div>
          <div className="py-1 px-0.5 border-l border-white/[0.06]">
            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Сон</div>
            <div className={`text-xs font-black font-mono mt-0.5 ${metrics.sleep < 6.5 ? 'text-indigo-400' : 'text-zinc-200'}`}>
              {metrics.sleep} <span className="text-[9px] font-normal text-zinc-500">г</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="relative z-10">
          {advice.quickAddWater ? (
            <button
              type="button"
              onClick={handleAddWater}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${styleConfig.buttonClass}`}
            >
              <Droplets className="w-4 h-4" />
              <span>{advice.actionButtonText}</span>
            </button>
          ) : (
            <button 
              type="button"
              onClick={onClose}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${styleConfig.buttonClass}`}
            >
              <Check className="w-4 h-4" />
              <span>{advice.actionButtonText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
