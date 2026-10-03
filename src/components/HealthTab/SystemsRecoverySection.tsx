import React from 'react';
import { Heart, ChevronUp, ChevronDown } from 'lucide-react';
import { HEALTH_MILESTONES } from '../../data/healthData';

interface SystemsRecoverySectionProps {
  systems: any[];
  isSystemsOpen: boolean;
  toggleSection: (key: any) => void;
  accentClasses: any;
  achievedCount: number;
  diffMs: number;
}

export const SystemsRecoverySection = React.memo(({
  systems,
  isSystemsOpen,
  toggleSection,
  accentClasses,
  achievedCount,
  diffMs,
}: SystemsRecoverySectionProps) => {
  return (
    <div className={`bg-white/95 dark:bg-[#1c1c22]/95 backdrop-blur-md border rounded-2xl shadow-xs overflow-hidden transition-all mt-3 ${isSystemsOpen ? accentClasses.activeCard : 'border-[#B7CDC6]/70 dark:border-[#33333d]'}`}>
      <button
        type="button"
        onClick={() => toggleSection('systems')}
        className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5 cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              Регенерація систем та Рубежі
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-300 truncate">
              {achievedCount} досягнуто з {HEALTH_MILESTONES.length} медичних етапів
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400">
            {systems.length} систем
          </span>
          {isSystemsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {isSystemsOpen && (
        <div className="p-4 pt-1 border-t border-slate-100 dark:border-white/5 space-y-4">
          {/* Body Systems Progress */}
          <div className="space-y-3">
            {systems.map((sys, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-zinc-900/60 rounded-xl border border-slate-200/80 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{sys.icon}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">{sys.name}</span>
                  </div>
                  <span className="text-xs font-black font-mono text-emerald-500">{sys.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${sys.progress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-zinc-300 mt-1 leading-snug">
                  {sys.description}
                </p>
              </div>
            ))}
          </div>

          {/* Health Milestones */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 mb-2">
              Хронологічні рубежі одужання
            </h4>
            <div className="space-y-2">
              {HEALTH_MILESTONES.slice(0, 8).map((m) => {
                const isDone = diffMs >= m.t;
                return (
                  <div
                    key={m.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${isDone ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-900 dark:text-white' : 'bg-slate-50 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200'}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base">{m.icon}</span>
                      <div className="min-w-0">
                        <div className="font-bold truncate">{m.title}</div>
                        <div className="text-[10px] text-slate-500 dark:text-zinc-400">{m.category}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${isDone ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'}`}>
                      {isDone ? 'Досягнуто ✓' : 'У процесі'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

SystemsRecoverySection.displayName = 'SystemsRecoverySection';
