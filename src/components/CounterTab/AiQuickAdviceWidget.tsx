import React, { useState, useCallback } from 'react';
import { Sparkles, RefreshCw, X, ChevronRight, Droplets, Zap, ShieldCheck, Check, Activity } from 'lucide-react';
import { MonoRefractedSparklesIcon } from './MonoRefractedStatsIcons';

interface AiQuickAdviceWidgetProps {
  diffMs: number;
  cigsAvoided?: number;
  longestStreakMs?: number;
  onOpenFullAnalyzer?: () => void;
}

export const AiQuickAdviceWidget: React.FC<AiQuickAdviceWidgetProps> = ({
  diffMs,
  cigsAvoided = 0,
  longestStreakMs = 0,
  onOpenFullAnalyzer
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bodySummary, setBodySummary] = useState<string | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [headline, setHeadline] = useState<string>('');
  const [isLiveAi, setIsLiveAi] = useState<boolean>(false);
  const [quickActionDone, setQuickActionDone] = useState<boolean>(false);

  const fetchAdvice = useCallback(async () => {
    setIsLoading(true);
    setQuickActionDone(false);

    try {
      const now = new Date();
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

      let water = 0;
      let sleepHours = 7.5;
      let craving = 2;
      let anxiety = 2;
      let energy = 3;

      try {
        const savedWater = localStorage.getItem(`quit-smoking:hydration-${todayStr}`);
        if (savedWater) water = parseInt(savedWater, 10) || 0;
      } catch {}

      try {
        const bedtime = localStorage.getItem('quit-smoking:sleep-bedtime') || '23:00';
        const wakeTime = localStorage.getItem('quit-smoking:sleep-waketime') || '07:00';
        const [bh, bm] = bedtime.split(':').map(Number);
        const [wh, wm] = wakeTime.split(':').map(Number);
        if (!isNaN(bh) && !isNaN(wh)) {
          let bMinutes = bh * 60 + (bm || 0);
          let wMinutes = wh * 60 + (wm || 0);
          if (wMinutes < bMinutes) wMinutes += 24 * 60;
          sleepHours = Math.round(((wMinutes - bMinutes) / 60) * 10) / 10;
        }
      } catch {}

      try {
        const savedLatestSlice = localStorage.getItem('quit-smoking:latest-slice');
        if (savedLatestSlice) {
          const sl = JSON.parse(savedLatestSlice);
          if (typeof sl.craving === 'number') craving = sl.craving;
          if (typeof sl.anxiety === 'number') anxiety = sl.anxiety;
          if (typeof sl.energy === 'number') energy = sl.energy;
        }
      } catch {}

      const hoursFree = Math.floor(diffMs / (1000 * 60 * 60));
      const minutesFree = Math.floor(diffMs / (1000 * 60));

      const payload = {
        hoursFree,
        minutesFree,
        diffDays: Math.max(1, Math.floor(hoursFree / 24) + 1),
        cigsAvoided: Math.round(cigsAvoided * 10) / 10,
        longestStreakHours: Math.round(longestStreakMs / (1000 * 60 * 60)),
        sleepHours,
        waterMl: water,
        waterNormMl: 2450,
        cravingScore: craving,
        anxietyScore: anxiety,
        energyScore: energy,
        focusMode: 'general'
      };

      const res = await fetch('/api/analyzer/live-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const mainTip = data.immediateAction || (data.quickTips && data.quickTips[0]) || 'Зробіть 5 повільних видихів для стабілізації вегетативної системи.';
        const summary = data.bodySummary || `Організм перебуває на ${payload.diffDays}-му дні відмови від куріння. Легені та судини активно очищуються від метаболітів, відновлюючи природний тонус.`;

        setHeadline(data.headline || 'Швидка порада ШІ');
        setBodySummary(summary);
        setAdvice(mainTip);
        setIsLiveAi(!!data.isLiveAi);
      } else {
        throw new Error('API unavailable');
      }
    } catch (e) {
      const hoursFree = Math.floor(diffMs / (1000 * 60 * 60));
      const curHour = new Date().getHours();
      const diffDays = Math.max(1, Math.floor(hoursFree / 24) + 1);

      let summaryFallback = `Організм перебуває на ${diffDays}-му дні очищення від нікотину. Судини та альвеоли відновлюють мікроциркуляцію, а рецептори мозку поступово повертають природну чутливість до дофаміну.`;
      let adviceFallback = 'На основі останніх даних Зрізу стану: випийте 250 мл чистої води та зробіть 3 повільних видихи 4-7-8 для миттєвого зняття нервового напруження.';

      if (curHour >= 22 || curHour < 6) {
        adviceFallback = 'У нічний час нервова система потребує глибокої регенерації: випийте склянку теплої води або ромашковий чай для нормалізації сну.';
      } else if (hoursFree < 24) {
        adviceFallback = 'Перша доба — найважливіший етап детоксикації. Пийте воду дрібними ковтками щоразу, коли виникає найменший імпульс тяги.';
      }

      setHeadline('Аналіз стану тіла та Зрізу');
      setBodySummary(summaryFallback);
      setAdvice(adviceFallback);
      setIsLiveAi(false);
    } finally {
      setIsLoading(false);
    }
  }, [diffMs, cigsAvoided, longestStreakMs]);

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      if (!advice || !bodySummary) {
        fetchAdvice();
      }
    } else {
      setIsOpen(false);
    }
  };

  const handleAddWater = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const now = new Date();
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const savedWater = localStorage.getItem(`quit-smoking:hydration-${todayStr}`);
      const current = savedWater ? parseInt(savedWater, 10) || 0 : 0;
      const next = current + 250;
      localStorage.setItem(`quit-smoking:hydration-${todayStr}`, String(next));
      window.dispatchEvent(new Event('hydration-change'));
      window.dispatchEvent(new Event('storage'));
      setQuickActionDone(true);
    } catch {}
  };

  return (
    <div className="w-full max-w-md mx-auto px-3 mb-2.5 select-none">
      {!isOpen ? (
        /* Concise Clickable Trigger */
        <button
          type="button"
          onClick={handleToggle}
          className="w-full p-2.5 px-3.5 rounded-2xl bg-[#14141c]/90 hover:bg-[#1a1a24] border border-zinc-800/80 hover:border-zinc-700/80 shadow-xs flex items-center justify-between gap-3 text-left transition-all duration-200 cursor-pointer active:scale-[0.99] group backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-200/15 via-zinc-400/5 to-zinc-950/60 border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-md flex items-center justify-center text-zinc-100 group-hover:border-white/40 group-hover:scale-105 transition-all shrink-0">
              <MonoRefractedSparklesIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-zinc-200 group-hover:text-white flex items-center gap-1.5 transition-colors">
                <span>ШІ-Аналіз</span>
                <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-400 font-mono tracking-wider uppercase scale-90">
                  Gemini
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                Натисніть для швидкої поради
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold flex-none">
            <span className="text-[11px] hidden xs:inline opacity-80 font-medium">Порада</span>
          </div>
        </button>
      ) : (
        /* Expanded Live Advice Card (2 distinct paragraphs) */
        <div className="w-full p-3.5 rounded-2xl bg-gradient-to-br from-[#181528]/95 via-[#12111c]/95 to-[#0d0c14]/95 border border-purple-500/40 shadow-xl text-left text-zinc-100 animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl relative overflow-hidden space-y-3">
          {/* Subtle Top Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-purple-500/20 pb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : 'animate-pulse'}`} />
              </div>
              <span className="text-xs font-bold text-purple-200 truncate">
                {headline || 'Швидка порада ШІ'}
              </span>
              {isLiveAi && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 shrink-0">
                  LIVE
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={fetchAdvice}
                disabled={isLoading}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
                title="Оновити пораду"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-400' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Згорнути"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Advice Body: 2 distinct paragraphs */}
          <div className="space-y-2.5">
            {isLoading ? (
              <div className="flex items-center gap-2 py-3 text-xs text-purple-300">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-400" />
                <span>Аналізую стан тіла та показники Зрізу...</span>
              </div>
            ) : (
              <>
                {/* Paragraph 1: What is happening to the body */}
                {bodySummary && (
                  <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11.5px] text-purple-100/90 leading-relaxed font-normal">
                    <span className="font-extrabold text-purple-300 uppercase text-[9px] block tracking-wider mb-1 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-purple-400 shrink-0" />
                      Що відбувається з тілом у цей момент:
                    </span>
                    {bodySummary}
                  </div>
                )}

                {/* Paragraph 2: Advice based on the Slice */}
                {advice && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/25 border border-emerald-500/25 text-[11.5px] text-emerald-100/90 leading-relaxed font-normal">
                    <span className="font-extrabold text-emerald-300 uppercase text-[9px] block tracking-wider mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                      Поточна порада (на основі даних Зрізу):
                    </span>
                    {advice}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quick Actions Footer */}
          {!isLoading && (
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5 text-[11px]">
              <button
                type="button"
                onClick={handleAddWater}
                disabled={quickActionDone}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold flex items-center gap-1 transition-all cursor-pointer border ${
                  quickActionDone
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200'
                    : 'bg-white/5 border-white/10 text-cyan-300 hover:bg-cyan-500/15 hover:border-cyan-500/30'
                }`}
              >
                {quickActionDone ? <Check className="w-3 h-3 text-cyan-300" /> : <Droplets className="w-3 h-3 text-cyan-400" />}
                <span>{quickActionDone ? '+250 мл додано' : '+250 мл води'}</span>
              </button>

              {onOpenFullAnalyzer && (
                <button
                  type="button"
                  onClick={onOpenFullAnalyzer}
                  className="text-purple-300 hover:text-purple-200 font-bold flex items-center gap-1 hover:underline cursor-pointer transition-colors ml-auto"
                >
                  <span>Детальніше</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
