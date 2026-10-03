import React from 'react';
import { History, ChevronUp, ChevronDown, Copy, Trash2 } from 'lucide-react';

interface HistorySectionProps {
  customLogs: any[];
  filteredLogs: any[];
  isHistoryOpen: boolean;
  toggleSection: (key: any) => void;
  accentClasses: any;
  historyCategoryFilter: string;
  setHistoryCategoryFilter: (filter: string) => void;
  handleExportHistoryTxt: () => void;
  deleteLog: (id: string) => void;
}

export const HistorySection = React.memo(({
  customLogs,
  filteredLogs,
  isHistoryOpen,
  toggleSection,
  accentClasses,
  historyCategoryFilter,
  setHistoryCategoryFilter,
  handleExportHistoryTxt,
  deleteLog,
}: HistorySectionProps) => {
  return (
    <div className={`bg-white/95 dark:bg-[#1c1c22]/95 backdrop-blur-md border rounded-2xl shadow-xs overflow-hidden transition-all mt-3 ${isHistoryOpen ? accentClasses.activeCard : 'border-[#B7CDC6]/70 dark:border-[#33333d]'}`}>
      <button
        type="button"
        onClick={() => toggleSection('history')}
        className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5 cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              7. Історія та логи
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-300 truncate">
              {customLogs.length} записів • фільтрація за категоріями
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
            {customLogs.length} логів
          </span>
          {isHistoryOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {isHistoryOpen && (
        <div className="p-4 pt-1 border-t border-slate-100 dark:border-white/5 space-y-3">
          {/* Action buttons & Category filter */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1 text-[10px] font-bold">
              {[
                { id: 'all', label: 'Усі' },
                { id: 'survey', label: 'Зрізи' },
                { id: 'trigger', label: 'Тригери' },
                { id: 'sleep', label: 'Сон' },
                { id: 'lungs', label: 'Легені' },
                { id: 'workout', label: 'Спорт' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setHistoryCategoryFilter(f.id)}
                  className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${historyCategoryFilter === f.id ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-50 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleExportHistoryTxt}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1 flex-shrink-0"
              title="Експортувати та скопіювати в буфер"
            >
              <Copy className="w-3 h-3" />
              <span>Експорт</span>
            </button>
          </div>

          {/* List of logs */}
          {filteredLogs.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 dark:text-zinc-400">
              Записів у цій категорії поки що немає.
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 bg-slate-50 dark:bg-zinc-900/70 rounded-xl border border-slate-200/80 dark:border-zinc-800 flex items-start justify-between gap-2 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400">{log.timeStr}</span>
                      <span className="font-bold text-slate-900 dark:text-white truncate">{log.title}</span>
                    </div>
                    {log.details && (
                      <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-snug">
                        {log.details}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteLog(log.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Видалити запис"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

HistorySection.displayName = 'HistorySection';
