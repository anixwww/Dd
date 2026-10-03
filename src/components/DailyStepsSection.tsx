import React, { useState, useEffect } from 'react';
import { DailyMicroStep } from '../types';
import {
  CheckCircle2,
  Circle,
  Trash2,
  CheckSquare,
  Pin,
  RotateCcw,
  Timer,
  Play,
  MessageSquare
} from 'lucide-react';
import { RefractedPrismCheckIcon } from './CounterTab/RefractedStatusIcons';

const DEFAULT_STEPS: DailyMicroStep[] = [];

const STEPS_STORAGE_KEY = 'quit-smoking:daily-micro-steps';
const HISTORY_STORAGE_KEY = 'quit-smoking:daily-steps-history';

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

interface DailyStepsSectionProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onUpdate?: () => void;
  isDocked?: boolean;
  onDockChange?: (docked: boolean) => void;
  isMinimized?: boolean;
  onMinimizeChange?: (minimized: boolean) => void;
  onOpenModal?: () => void;
  isFullView?: boolean;
}

export const DailyStepsSection: React.FC<DailyStepsSectionProps> = ({ 
  isOpen: _isOpen, 
  onToggle: _onToggle, 
  onUpdate, 
  isDocked: _isDocked, 
  onDockChange,
  isMinimized,
  onMinimizeChange,
}) => {
  // Steps definition (defaults + user custom steps)
  const [steps, setSteps] = useState<DailyMicroStep[]>(() => {
    try {
      const saved = localStorage.getItem(STEPS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return DEFAULT_STEPS;
  });

  // History of completions by date: { [dateStr]: string[] }
  const [completions, setCompletions] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [newStepText, setNewStepText] = useState('');
  const [newStepTime, setNewStepTime] = useState('12:00');

  const todayKey = getTodayKey();
  const todayCompletedIds = completions[todayKey] || [];

  // Persist steps
  useEffect(() => {
    try {
      localStorage.setItem(STEPS_STORAGE_KEY, JSON.stringify(steps));
    } catch {}
  }, [steps]);

  // Persist completions
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(completions));
    } catch {}
  }, [completions]);

  // Toggle step completion for today
  const handleToggleStep = (stepId: string) => {
    setCompletions((prev) => {
      const currentList = prev[todayKey] || [];
      const isDone = currentList.includes(stepId);
      const updatedList = isDone
        ? currentList.filter((id) => id !== stepId)
        : [...currentList, stepId];

      return {
        ...prev,
        [todayKey]: updatedList
      };
    });
    onUpdate?.();
  };

  // Update step time
  const handleUpdateStepTime = (stepId: string, time: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, scheduledTime: time || undefined } : s))
    );
    onUpdate?.();
  };

  // Toggle step dialogue reminder
  const handleToggleStepReminder = (stepId: string) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId
          ? { ...s, reminderDialogueEnabled: s.reminderDialogueEnabled === false ? true : false }
          : s
      )
    );
    onUpdate?.();
  };

  // Test launch Analyzer dialogue for this step
  const handleTestStepDialogue = (step: DailyMicroStep) => {
    window.dispatchEvent(new CustomEvent('trigger-task-dialogue', { detail: step }));
  };

  // Add user-defined custom step
  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newStepText.trim();
    if (!trimmed) return;

    const newStep: DailyMicroStep = {
      id: `custom-${Date.now()}`,
      title: trimmed,
      isCustom: true,
      createdAt: Date.now(),
      scheduledTime: newStepTime || undefined,
      reminderDialogueEnabled: true,
      dialoguePrompt: `Час для справи: «${trimmed}»! Готовий виконати?`
    };

    setSteps((prev) => [...prev, newStep]);
    setNewStepText('');
    setNewStepTime('12:00');
    onUpdate?.();
  };

  // Delete a step
  const handleDeleteStep = (stepId: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== stepId));
    // Also remove from completions
    setCompletions((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        next[k] = next[k].filter((id) => id !== stepId);
      });
      return next;
    });
    onUpdate?.();
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Clear all steps reliably
  const handleClearAllSteps = () => {
    setSteps([]);
    setCompletions({});
    try {
      localStorage.setItem(STEPS_STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify({}));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('steps-updated'));
    } catch {}
    setShowClearConfirm(false);
    onUpdate?.();
  };

  const totalStepsCount = steps.length;
  const completedCount = steps.filter((s) => todayCompletedIds.includes(s.id)).length;
  const progressPct = totalStepsCount > 0 ? Math.round((completedCount / totalStepsCount) * 100) : 0;
  const isAllDone = totalStepsCount > 0 && completedCount === totalStepsCount;

  const nextTask = steps.find(s => !todayCompletedIds.includes(s.id));

  if (isMinimized) {
    return (
      <div 
        onClick={() => onMinimizeChange?.(false)}
        className="w-full p-3.5 bg-[#18181f]/90 border border-zinc-800/80 rounded-2xl shadow-xs relative overflow-hidden transition-all duration-300 hover:border-zinc-700 text-left cursor-pointer group"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 flex items-center justify-center shrink-0">
              <RefractedPrismCheckIcon className="w-3.5 h-3.5 shrink-0" />
            </div>
            <h3 className="text-xs font-bold text-zinc-200">
              Щоденні справи
            </h3>
          </div>

          {onDockChange && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDockChange(true);
                }}
                className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-200 cursor-pointer rounded-lg hover:bg-zinc-800/60 transition-all"
                title="Закріпити"
              >
                <Pin className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Content & Progress Bar */}
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <span className="text-xs font-semibold text-zinc-300 truncate">
              {nextTask ? nextTask.title : (totalStepsCount > 0 ? 'Всі справи виконано' : 'Створіть справи')}
            </span>
            <span className="text-xs font-mono font-bold text-zinc-300 shrink-0">
              {completedCount}/{totalStepsCount}
            </span>
          </div>

          <div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-zinc-400"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1 text-[10px]">
              <span className="text-zinc-500">
                {isAllDone ? '100% виконано' : 'Кроки на день'}
              </span>
              <span className="font-bold font-mono text-zinc-400">
                {progressPct}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 text-left">
      {/* 1. Progress Bar & Header metrics */}
      <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-medium text-zinc-300">
            Прогрес на сьогодні
          </span>
          <span className="font-mono font-bold text-zinc-200">
            {progressPct}% ({completedCount}/{totalStepsCount})
          </span>
        </div>

        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out bg-zinc-400"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* 2. Checklist of steps */}
      <div className="space-y-2">
        {steps.length === 0 ? (
          <div className="p-4 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30">
            <p className="text-xs text-zinc-500">
              Справ на сьогодні немає. Створіть власні справи нижче.
            </p>
          </div>
        ) : (
          steps.map((step) => {
            const isDone = todayCompletedIds.includes(step.id);
            const isRemEnabled = step.reminderDialogueEnabled !== false;
            return (
              <div
                key={step.id}
                className={`group p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                  isDone
                    ? 'bg-zinc-900/40 border-zinc-800/60'
                    : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleStep(step.id)}
                    className="flex items-center gap-2.5 flex-1 min-w-0 text-left cursor-pointer"
                  >
                    <div className="flex-none">
                      {isDone ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-zinc-400" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      )}
                    </div>
                    <span
                      className={`text-xs leading-snug transition-all ${
                        isDone
                          ? 'line-through text-zinc-500'
                          : 'font-medium text-zinc-200'
                      }`}
                    >
                      {step.title}
                    </span>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Time input */}
                    <input
                      type="time"
                      value={step.scheduledTime || ''}
                      onChange={(e) => handleUpdateStepTime(step.id, e.target.value)}
                      className="py-1 px-1.5 bg-zinc-800/80 border border-zinc-700/60 rounded-lg text-[11px] font-mono font-bold text-zinc-200 focus:outline-hidden focus:border-zinc-500 cursor-pointer"
                      title="Час нагадування"
                    />

                    {/* Analyzer Dialogue Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleStepReminder(step.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
                        isRemEnabled
                          ? 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700'
                          : 'bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:bg-zinc-800/40'
                      }`}
                      title={isRemEnabled ? 'Нагадування увімкнено' : 'Вимкнено'}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteStep(step.id)}
                      className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Видалити"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub row */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[10px] text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Timer className="w-3 h-3 text-zinc-400" />
                    <span>
                      {step.scheduledTime
                        ? `Час: ${step.scheduledTime}`
                        : 'Без таймера'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTestStepDialogue(step)}
                    className="px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Play className="w-2.5 h-2.5 text-zinc-400" />
                    <span>Тест</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Add custom step form */}
      <form onSubmit={handleAddStep} className="pt-1 flex flex-col sm:flex-row items-center gap-2">
        <input
          type="text"
          value={newStepText}
          onChange={(e) => setNewStepText(e.target.value)}
          placeholder="Нова справа..."
          maxLength={80}
          className="w-full sm:flex-1 py-2 px-3 text-xs bg-zinc-900/80 border border-zinc-800 rounded-xl text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-zinc-600 transition-colors"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="time"
            value={newStepTime}
            onChange={(e) => setNewStepTime(e.target.value)}
            className="py-2 px-2 text-xs font-mono font-bold bg-zinc-900/80 border border-zinc-800 rounded-xl text-zinc-200 outline-none focus:border-zinc-600 cursor-pointer"
            title="Час"
          />
          <button
            type="submit"
            disabled={!newStepText.trim()}
            className="flex-1 sm:flex-none py-2 px-4 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 font-semibold text-xs rounded-xl border border-zinc-700/60 cursor-pointer transition-all active:scale-95"
          >
            Додати
          </button>
        </div>
      </form>

      {/* 4. Footer */}
      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
        <span className="text-[11px] text-zinc-500 flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>Оновлюється щодня</span>
        </span>

        {showClearConfirm ? (
          <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-zinc-300">
              Видалити всі?
            </span>
            <button
              type="button"
              onClick={handleClearAllSteps}
              className="px-2 py-0.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Так
            </button>
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="px-2 py-0.5 text-zinc-400 hover:text-zinc-200 text-xs cursor-pointer"
            >
              Ні
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Очистити</span>
          </button>
        )}
      </div>
    </div>
  );
};
