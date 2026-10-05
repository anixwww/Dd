import React, { useState } from 'react';
import {
  Waves,
  Wind,
  Droplets,
  Heart,
  Bot,
  ArrowRight,
  ShieldAlert,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { SosCognitiveAiChat } from './SosCognitiveAiChat';
import { HealthyReplacements } from './HealthyReplacements';
import { CopingCardsWidget } from './CopingCardsWidget';
import { HaltSystemSection } from './HaltSystemSection';
import { useAiStatus } from '../utils/aiStatusManager';

interface SosTabProps {
  reasons?: string[];
  accent?: string;
  onCravingOver?: () => void;
  onRelapse?: () => void;
  onSwitchTab?: (tab: any) => void;
}

export const SosTab: React.FC<SosTabProps> = ({
  onCravingOver,
  onRelapse,
  onSwitchTab
}) => {
  const [activeSubMode, setActiveSubMode] = useState<'menu' | 'aichat' | 'breath' | 'cards' | 'replacements'>('menu');
  const { badgeText, badgeClasses, dotClasses, tooltipText } = useAiStatus();

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 text-white pb-24">
      {activeSubMode === 'aichat' ? (
        <div className="h-[550px]">
          <button
            onClick={() => setActiveSubMode('menu')}
            className="mb-3 px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1.5 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Назад до меню SOS</span>
          </button>
          <SosCognitiveAiChat onClose={() => setActiveSubMode('menu')} />
        </div>
      ) : (
        <>
          {/* Main AI Cognitive Chat Flagship Card */}
          <div
            onClick={() => setActiveSubMode('aichat')}
            className="w-full p-4 rounded-3xl bg-gradient-to-br from-[#1e1732]/95 via-[#151322]/95 to-[#0d0c15]/95 border border-purple-500/35 hover:border-purple-500/60 transition-all cursor-pointer text-left shadow-xl group active:scale-[0.99]"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Bot className="w-5 h-5 text-purple-300 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-200 transition-colors truncate">
                      Когнітивно-ШІ чат самодопомоги
                    </h4>
                    <span
                      className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border font-mono tracking-wider flex items-center gap-1 shrink-0 ${badgeClasses}`}
                      title={tooltipText}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClasses}`} />
                      <span>{badgeText}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-2.5 py-1 rounded-xl bg-purple-500/25 text-purple-200 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1 shrink-0">
                <span>Відкрити</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <p className="text-[11px] text-zinc-300 leading-relaxed font-normal mb-1">
              Психологічна CBT-підтримка та наукова деескалація тяги в реальному часі.
            </p>
          </div>

          {/* HALT System */}
          <HaltSystemSection />

          {/* Coping Cards */}
          <CopingCardsWidget />

          {/* Healthy Replacements */}
          <HealthyReplacements />
        </>
      )}
    </div>
  );
};
