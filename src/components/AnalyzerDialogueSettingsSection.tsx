import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  Clock,
  Activity,
  Heart,
  Droplets,
  Zap,
  Sliders,
  RotateCcw,
  Check,
  Play,
  FileText,
  AlertCircle,
  BarChart2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Plus,
  Trash2,
  Layers,
  ArrowRight,
  HelpCircle,
  Settings2,
  Edit2,
  Filter,
  X,
  Compass,
  Smile,
  ShieldCheck,
  Timer,
  Search,
  Shuffle
} from 'lucide-react';
import { DailyMicroStep } from '../types';
import {
  AnalyzerDialogueSettings,
  DialoguePhrasesMap,
  DialogueOptionConfig,
  DialogueActionType,
  DialoguePhraseItem,
  AnalyzerActionDefinition,
  ActionSubStep,
  BUILTIN_ANALYZER_ACTIONS,
  stripEmoji,
  loadAnalyzerDialogueSettings,
  saveAnalyzerDialogueSettings,
  loadDialoguePhrases,
  saveDialoguePhrases,
  createNewDialoguePhrase,
  loadCustomAnalyzerActions,
  saveCustomAnalyzerActions,
  getAllAnalyzerActions,
  createNewCustomAction,
  DEFAULT_DIALOGUE_SETTINGS,
  DEFAULT_DIALOGUE_PHRASES
} from './AnalyzerDialogueSettingsTypes';

interface AnalyzerDialogueSettingsSectionProps {
  activeSubTab: 'dialogues' | 'create_dialogue' | 'create' | 'actions' | 'results' | 'schedule' | 'phrases' | string;
  onTabChange?: (tab: 'dialogues' | 'create_dialogue' | 'actions' | 'results' | 'appearance' | string) => void;
  onTestTriggerDialogue: (type: string) => void;
  onOpenQuickMechanicsSection: (section: 'menu' | 'slice' | 'triggerfix' | 'hydration' | 'analysis' | 'history') => void;
  onCloseModal: () => void;
}

// Format interval in human readable Ukrainian without emojis
const formatIntervalLabel = (min: number) => {
  if (min === -1) return 'Рандомний час';
  if (min < 60) return `${min} хв`;
  const hrs = Math.floor(min / 60);
  const rem = min % 60;
  if (rem === 0) return `${hrs} ${hrs === 1 ? 'година' : hrs < 5 ? 'години' : 'годин'}`;
  return `${hrs} год ${rem} хв`;
};

interface FlexibleIntervalPickerProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  minSliderVal?: number;
  maxSliderVal?: number;
}

const FlexibleIntervalPicker: React.FC<FlexibleIntervalPickerProps> = ({
  label,
  value,
  onChange,
  minSliderVal = 5,
  maxSliderVal = 360
}) => {
  const isRandom = value === -1;
  const [showSlider, setShowSlider] = useState<boolean>(!isRandom);
  const [customInputValue, setCustomInputValue] = useState<string>(value > 0 ? String(value) : '30');

  useEffect(() => {
    if (value > 0) {
      setCustomInputValue(String(value));
    }
  }, [value]);

  const handleCustomApply = () => {
    const p = parseInt(customInputValue, 10);
    if (!isNaN(p) && p > 0) {
      onChange(p);
    }
  };

  const handleSelectRandom = () => {
    onChange(-1);
    setShowSlider(false);
  };

  const handleToggleSlider = () => {
    if (isRandom) {
      const targetVal = parseInt(customInputValue, 10) > 0 ? parseInt(customInputValue, 10) : 30;
      onChange(targetVal);
      setShowSlider(true);
    } else {
      setShowSlider(!showSlider);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Header with label and current selected value */}
      <div className="flex items-center justify-between text-[11px] text-zinc-300">
        <span className="font-medium text-zinc-300">{label}:</span>
        <span className="font-bold text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded-md text-[10px] font-mono">
          {formatIntervalLabel(value)}
        </span>
      </div>

      {/* Only two buttons: Random & Slider config */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleSelectRandom}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            isRandom
              ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400/50'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Рандом</span>
        </button>

        <button
          type="button"
          onClick={handleToggleSlider}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            !isRandom
              ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400/50'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{value > 0 ? formatIntervalLabel(value) : 'Налаштувати повзунком'}</span>
        </button>
      </div>

      {/* Slider & Minute precision input when slider is selected/opened */}
      {showSlider && !isRandom && (
        <div className="p-3 rounded-2xl bg-zinc-900/90 border border-purple-500/30 flex flex-col gap-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[11px] text-zinc-300">
            <span className="flex items-center gap-1">
              <Sliders className="w-3 h-3 text-purple-400" />
              <span>Повзунок інтервалу:</span>
            </span>
            <span className="font-mono text-purple-300 font-bold bg-purple-950/70 border border-purple-500/20 px-2 py-0.5 rounded text-[10px]">
              {value > 0 ? `${value} хв (${(value / 60).toFixed(1)} год)` : '30 хв'}
            </span>
          </div>

          <input
            type="range"
            min={minSliderVal}
            max={maxSliderVal}
            step={5}
            value={value > 0 ? value : 30}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCustomInputValue(String(val));
              onChange(val);
            }}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />

          <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono">
            <span>{minSliderVal} хв</span>
            <span>1 год</span>
            <span>2 год</span>
            <span>3 год</span>
            <span>{maxSliderVal / 60} год</span>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 shrink-0">Вказати хвилини:</span>
            <input
              type="number"
              min={1}
              max={1440}
              value={customInputValue}
              onChange={(e) => setCustomInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCustomApply();
              }}
              placeholder="30"
              className="w-16 px-2 py-1 bg-black/60 border border-zinc-700 rounded-lg text-xs text-white font-mono text-center focus:outline-none focus:border-purple-500"
            />
            <button
              type="button"
              onClick={handleCustomApply}
              className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold cursor-pointer transition-colors"
            >
              Застосувати
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const AnalyzerDialogueSettingsSection: React.FC<AnalyzerDialogueSettingsSectionProps> = ({
  activeSubTab,
  onTabChange,
  onTestTriggerDialogue,
  onOpenQuickMechanicsSection,
  onCloseModal
}) => {
  const [settings, setSettings] = useState<AnalyzerDialogueSettings>(loadAnalyzerDialogueSettings);
  const [phrases, setPhrases] = useState<DialoguePhrasesMap>(loadDialoguePhrases);
  const [customActions, setCustomActions] = useState<AnalyzerActionDefinition[]>(loadCustomAnalyzerActions);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  // Cosmic Ring Stars Count (Initial 80 stars, slider step = 1)
  const [ringStarCount, setRingStarCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:analyzer-ring-stars-count');
      if (saved !== null) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) return Math.max(1, Math.min(200, val));
      }
    } catch {}
    return 80;
  });

  const handleUpdateStarCount = (count: number) => {
    const clamped = Math.max(1, Math.min(200, count));
    setRingStarCount(clamped);
    try {
      localStorage.setItem('quit-smoking:analyzer-ring-stars-count', String(clamped));
      window.dispatchEvent(new CustomEvent('analyzer-ring-stars-count-changed', { detail: clamped }));
      window.dispatchEvent(new Event('analyzer-ring-stars-changed'));
      window.dispatchEvent(new Event('storage'));
      triggerToast(`Кількість зірок у кільці: ${clamped} шт.`);
    } catch {}
  };

  // Local tab switcher
  const [currentTab, setCurrentTab] = useState<string>(activeSubTab || 'dialogues');

  // Sync prop tab
  useEffect(() => {
    if (activeSubTab) {
      setCurrentTab(activeSubTab);
    }
  }, [activeSubTab]);

  // Daily tasks management state
  const [dailyTasks, setDailyTasks] = useState<DailyMicroStep[]>(() => {
    try {
      const raw = localStorage.getItem('quit-smoking:daily-micro-steps');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('10:00');
  const [newTaskPrompt, setNewTaskPrompt] = useState('');

  const saveDailyTasks = (updated: DailyMicroStep[]) => {
    setDailyTasks(updated);
    try {
      localStorage.setItem('quit-smoking:daily-micro-steps', JSON.stringify(updated));
      window.dispatchEvent(new Event('daily-steps-change'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const handleAddTaskFromSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;
    const newStep: DailyMicroStep = {
      id: `custom-${Date.now()}`,
      title,
      isCustom: true,
      createdAt: Date.now(),
      scheduledTime: newTaskTime || undefined,
      reminderDialogueEnabled: true,
      dialoguePrompt: newTaskPrompt.trim() || `Час для справи: «${title}»! Готовий виконати?`
    };
    const updated = [...dailyTasks, newStep];
    saveDailyTasks(updated);
    setNewTaskTitle('');
    setNewTaskPrompt('');
    triggerToast(`Справу «${newStep.title}» додано з таймером!`);
  };

  const handleUpdateTaskTime = (taskId: string, time: string) => {
    const updated = dailyTasks.map((t) => (t.id === taskId ? { ...t, scheduledTime: time } : t));
    saveDailyTasks(updated);
    triggerToast('Час нагадування збережено');
  };

  const handleToggleTaskReminder = (taskId: string, enabled: boolean) => {
    const updated = dailyTasks.map((t) => (t.id === taskId ? { ...t, reminderDialogueEnabled: enabled } : t));
    saveDailyTasks(updated);
    triggerToast(enabled ? 'Діалог увімкнено' : 'Діалог вимкнено');
  };

  const handleUpdateTaskPrompt = (taskId: string, prompt: string) => {
    const updated = dailyTasks.map((t) => (t.id === taskId ? { ...t, dialoguePrompt: prompt } : t));
    saveDailyTasks(updated);
  };

  const handleDeleteTaskFromSettings = (taskId: string) => {
    const updated = dailyTasks.filter((t) => t.id !== taskId);
    saveDailyTasks(updated);
    triggerToast('Справу видалено');
  };

  const handleTestTaskDialogueFromSettings = (task: DailyMicroStep) => {
    onCloseModal();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('trigger-task-dialogue', { detail: task }));
    }, 280);
  };

  const handleTestGratitudeDialogueFromSettings = () => {
    onCloseModal();
    setTimeout(() => {
      window.dispatchEvent(new Event('trigger-gratitude-dialogue'));
    }, 280);
  };

  // Expanded cards in dialogues list
  const [expandedPhraseId, setExpandedPhraseId] = useState<string | null>(null);

  // New Dialogue form state
  const [newDialName, setNewDialName] = useState<string>('');
  const [newDialCategory, setNewDialCategory] = useState<string>('Власний блок');
  const [newDialQuestion, setNewDialQuestion] = useState<string>('');
  const [newDialInterval, setNewDialInterval] = useState<number>(60);
  const [newDialOptions, setNewDialOptions] = useState<DialogueOptionConfig[]>([
    { id: 'opt_1', text: 'Пройти Зріз', action: 'slice', analyzerReply: 'Відкриваю повний зріз 8 показників...' },
    { id: 'opt_2', text: 'Все спокійно', action: 'close_quiet', analyzerReply: 'Гарного та спокійного дня!' }
  ]);

  // New Action form state
  const [isCreatingAction, setIsCreatingAction] = useState<boolean>(false);
  const [actionBuildType, setActionBuildType] = useState<'single' | 'combo'>('single');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [actionSearchQuery, setActionSearchQuery] = useState<string>('');
  const [newActionLabel, setNewActionLabel] = useState<string>('');
  const [newActionDescription, setNewActionDescription] = useState<string>('');
  const [newActionBehavior, setNewActionBehavior] = useState<DialogueActionType>('close_quiet');
  const [newActionCategory, setNewActionCategory] = useState<'health' | 'analytics' | 'appearance' | 'dialogue' | 'gamification' | 'system' | 'combo'>('health');
  const [newActionParam, setNewActionParam] = useState<string | number>('');
  const [newActionReply, setNewActionReply] = useState<string>('');
  const [comboSubSteps, setComboSubSteps] = useState<ActionSubStep[]>([
    { id: 'step_1', behavior: 'hydration', label: 'Додати воду (+250 мл)' },
    { id: 'step_2', behavior: 'calm_breath', label: 'Дихання 4-7-8' }
  ]);

  useEffect(() => {
    const handleSettingsChange = (e: any) => {
      if (e?.detail) setSettings(e.detail);
      else setSettings(loadAnalyzerDialogueSettings());
    };
    const handlePhrasesChange = (e: any) => {
      if (e?.detail) setPhrases(e.detail);
      else setPhrases(loadDialoguePhrases());
    };
    const handleActionsChange = (e: any) => {
      if (e?.detail) setCustomActions(e.detail);
      else setCustomActions(loadCustomAnalyzerActions());
    };

    window.addEventListener('analyzer-dialogue-settings-changed', handleSettingsChange);
    window.addEventListener('analyzer-dialogue-phrases-changed', handlePhrasesChange);
    window.addEventListener('analyzer-custom-actions-changed', handleActionsChange);

    return () => {
      window.removeEventListener('analyzer-dialogue-settings-changed', handleSettingsChange);
      window.removeEventListener('analyzer-dialogue-phrases-changed', handlePhrasesChange);
      window.removeEventListener('analyzer-custom-actions-changed', handleActionsChange);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 2200);
  };

  // Combined all actions: custom created + built-in
  const allAvailableActions = useMemo(() => {
    return [...customActions, ...BUILTIN_ANALYZER_ACTIONS];
  }, [customActions]);

  // Update a main setting
  const updateSetting = <K extends keyof AnalyzerDialogueSettings>(
    key: K,
    val: AnalyzerDialogueSettings[K]
  ) => {
    const updated = { ...settings, [key]: val };
    setSettings(updated);
    saveAnalyzerDialogueSettings(updated);
    if (key === 'sliceIntervalMinutes') {
      try {
        const minVal = Number(val);
        const effectiveMin = minVal > 0 ? minVal : 30;
        localStorage.setItem('quit-smoking:prompt-interval-min', String(effectiveMin));
        localStorage.setItem('quit-smoking:last-prompt', String(Date.now()));
        window.dispatchEvent(new Event('prompt-interval-change'));
        window.dispatchEvent(new Event('storage'));
      } catch {}
    }
    triggerToast('Налаштування збережено');
  };

  // Update specific phrase item
  const updatePhraseItem = (phraseId: string, updates: Partial<DialoguePhraseItem>) => {
    const current = phrases[phraseId] || DEFAULT_DIALOGUE_PHRASES[phraseId];
    if (!current) return;
    const updatedItem = { ...current, ...updates };
    const updated = { ...phrases, [phraseId]: updatedItem };
    setPhrases(updated);
    saveDialoguePhrases(updated);
  };

  // Update dialogue timer & enabled status
  const updateDialogueTimer = (phraseId: string, enabled: boolean, intervalMinutes: number) => {
    updatePhraseItem(phraseId, { enabled, intervalMinutes });
    if (phraseId === 'slice') {
      updateSetting('sliceEnabled', enabled);
      updateSetting('sliceIntervalMinutes', intervalMinutes);
    } else if (phraseId === 'triggerfix') {
      updateSetting('triggerFixEnabled', enabled);
      updateSetting('triggerFixIntervalMinutes', intervalMinutes);
    } else if (phraseId === 'how_are_you') {
      updateSetting('howAreYouEnabled', enabled);
      updateSetting('howAreYouIntervalMinutes', intervalMinutes);
    } else if (phraseId === 'hydration') {
      updateSetting('hydrationEnabled', enabled);
      updateSetting('hydrationIntervalMinutes', intervalMinutes);
    }
  };

  // Delete custom dialogue
  const deleteDialoguePhrase = (phraseId: string) => {
    const phrase = phrases[phraseId];
    if (!phrase) return;
    const copy = { ...phrases };
    delete copy[phraseId];
    setPhrases(copy);
    saveDialoguePhrases(copy);
    triggerToast('Діалог видалено');
  };

  // Randomize all toggles across all dialogues, settings and tasks
  const handleRandomizeAllToggles = () => {
    // 1. Randomize all dialogue phrases (enabled = true or false)
    const updatedPhrases: DialoguePhrasesMap = { ...phrases };
    Object.keys(updatedPhrases).forEach((id) => {
      const isEnabled = Math.random() >= 0.5;
      updatedPhrases[id] = { ...updatedPhrases[id], enabled: isEnabled };
      if (id === 'slice') updateSetting('sliceEnabled', isEnabled);
      if (id === 'triggerfix') updateSetting('triggerFixEnabled', isEnabled);
      if (id === 'how_are_you') updateSetting('howAreYouEnabled', isEnabled);
      if (id === 'hydration') updateSetting('hydrationEnabled', isEnabled);
    });
    setPhrases(updatedPhrases);
    saveDialoguePhrases(updatedPhrases);

    // 2. Randomize master toggles
    const newGratitude = Math.random() >= 0.5;
    const newDailySteps = Math.random() >= 0.5;
    updateSetting('gratitudeEnabled', newGratitude);
    updateSetting('dailyStepsEnabled', newDailySteps);

    // 3. Randomize all daily task reminder dialogue toggles
    if (dailyTasks.length > 0) {
      const updatedTasks = dailyTasks.map((t) => ({
        ...t,
        reminderDialogueEnabled: Math.random() >= 0.5
      }));
      saveDailyTasks(updatedTasks);
    }

    triggerToast('Усі тумблери переключено на рандом! ');
  };

  // Create new dialogue submit
  const handleCreateNewDialogue = (e: React.FormEvent) => {
    e.preventDefault();
    const name = stripEmoji(newDialName.trim()) || 'Новий діалог';
    const question = stripEmoji(newDialQuestion.trim()) || 'Як я можу допомогти прямо зараз?';
    const phrase = createNewDialoguePhrase(
      name,
      stripEmoji(newDialCategory) || 'Власний блок',
      '',
      question,
      newDialInterval
    );
    phrase.options = newDialOptions.length > 0 ? newDialOptions : [
      { id: `opt_${Date.now()}_1`, text: 'Зрозуміло', action: 'close_quiet', analyzerReply: 'Гарного дня!' }
    ];

    const updated = {
      [phrase.id]: phrase,
      ...phrases
    };
    setPhrases(updated);
    saveDialoguePhrases(updated);

    // Reset form
    setNewDialName('');
    setNewDialQuestion('');
    setNewDialInterval(60);
    setNewDialOptions([
      { id: 'opt_1', text: 'Пройти Зріз', action: 'slice', analyzerReply: 'Відкриваю повний зріз 8 показників...' },
      { id: 'opt_2', text: 'Все спокійно', action: 'close_quiet', analyzerReply: 'Гарного та спокійного дня!' }
    ]);

    triggerToast(`Діалог «${name}» створено і закріплено зверху!`);
    setCurrentTab('dialogues');
    onTabChange?.('dialogues');
    setExpandedPhraseId(phrase.id);
  };

  // Create new action submit
  const handleCreateNewAction = (e: React.FormEvent) => {
    e.preventDefault();
    const label = stripEmoji(newActionLabel.trim()) || (actionBuildType === 'combo' ? 'Мульти-Комбо' : 'Нова дія');
    
    const action: AnalyzerActionDefinition = {
      id: `custom_act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label,
      icon: '',
      description: stripEmoji(newActionDescription.trim()) || (actionBuildType === 'combo' ? 'Ланцюгова мульти-дія' : 'Власна дія Аналізатора'),
      behavior: actionBuildType === 'combo' ? 'combo_chain' : newActionBehavior,
      actionParam: newActionParam !== '' ? newActionParam : undefined,
      defaultReply: stripEmoji(newActionReply.trim()) || (actionBuildType === 'combo' ? 'Запущено комбіновану ланцюгову дію!' : 'Дію виконано.'),
      isCustom: true,
      createdAt: Date.now(),
      category: actionBuildType === 'combo' ? 'combo' : newActionCategory,
      subSteps: actionBuildType === 'combo' ? comboSubSteps : undefined
    };

    const updated = [action, ...customActions];
    setCustomActions(updated);
    saveCustomAnalyzerActions(updated);

    setNewActionLabel('');
    setNewActionDescription('');
    setNewActionReply('');
    setNewActionParam('');
    setIsCreatingAction(false);
    triggerToast(actionBuildType === 'combo' ? `Мульти-комбо «${label}» створено!` : `Дію «${label}» створено!`);
  };

  // Delete custom action
  const handleDeleteCustomAction = (actionId: string) => {
    const updated = customActions.filter((a) => a.id !== actionId);
    setCustomActions(updated);
    saveCustomAnalyzerActions(updated);
    triggerToast('Дію видалено');
  };

  // Sorted phrases: custom created dialogues ALWAYS AT THE VERY TOP
  const sortedPhrasesList = useMemo(() => {
    const list = Object.values(phrases);
    return list.sort((a, b) => {
      if (a.isCustom && !b.isCustom) return -1;
      if (!a.isCustom && b.isCustom) return 1;
      if (a.isCustom && b.isCustom) {
        return (b.createdAt || 0) - (a.createdAt || 0);
      }
      return 0;
    });
  }, [phrases]);

  // Quick stats from local storage for results tab
  const getStoredStats = () => {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const d = new Date();
    const todayKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    let lastLung = 'Немає заміру';
    try {
      const s = localStorage.getItem('quit-smoking:last-lung-test-seconds');
      if (s) lastLung = `${s} секунд`;
    } catch {}

    let waterMl = 0;
    try {
      const w = localStorage.getItem(`quit-smoking:hydration-${todayKey}`);
      if (w) waterMl = parseInt(w, 10);
    } catch {}

    let lastSliceTime = 'Немає';
    let todaySlicesCount = 0;
    try {
      const savedDays = localStorage.getItem('quit-smoking:days');
      if (savedDays) {
        const parsed = JSON.parse(savedDays);
        if (parsed[todayKey]?.surveys?.length) {
          const list = parsed[todayKey].surveys;
          todaySlicesCount = list.length;
          const last = list[list.length - 1];
          lastSliceTime = last.time || 'Сьогодні';
        }
      }
    } catch {}

    return { lastLung, waterMl, lastSliceTime, todaySlicesCount };
  };

  const stats = getStoredStats();

  return (
    <div className="flex flex-col gap-3 relative text-zinc-100 font-sans">
      {savedToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-2xl border border-purple-300/40 animate-in fade-in zoom-in duration-150">
          {savedToast}
        </div>
      )}

      {/* ================= TAB: SCHEDULE & TIMERS (ЧИСТИЙ СПИСОК: НАЗВА + НАЛАШТУВАННЯ ЧАСУ ПОЯВИ) ================= */}
      {currentTab === 'schedule' && (
        <div className="flex flex-col gap-4">
          {/* Header Info */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700/60 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-zinc-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-100">
                  Список діалогів та налаштування таймерів
                </div>
                <div className="text-[10px] text-zinc-400">
                  Початкові діалоги — без таймеру. Для інших — точний час або інтервал появи.
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/90 px-2 py-1 rounded-md border border-zinc-700/40 shrink-0">
              Всього: 16+
            </span>
          </div>

          {/* 1. ПОЧАТКОВІ ДІАЛОГИ (ВКАЗУЮТЬСЯ БЕЗ ТАЙМЕРУ) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                <span>Початкові Діалоги</span>
                <span className="text-[10px] font-normal text-zinc-500 lowercase">(без таймеру)</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Стартовий онбординг</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { title: 'Початкове привітання', desc: 'Привіт, я твій Аналізатор', icon: '💬' },
                { title: 'Імпровізація / Кіт', desc: 'Силует кота та перевірка реакції', icon: '🐱' },
                { title: 'Фізичні параметри', desc: 'Вік, вага, зріст та стать', icon: '📋' },
                { title: 'Налаштування сну', desc: 'Час засинання та пробудження', icon: '🌙' },
                { title: 'Вкладка Гідратація', desc: 'Водний баланс та норма випитої води', icon: '💧' },
                { title: 'Початковий Зріз стану', desc: '8 базових показників відновлення', icon: '📊' },
                { title: 'Фінальна готовність', desc: 'Завершення налаштувань та старт', icon: '🚀' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-2.5 hover:border-zinc-700/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-200 truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                    Початковий
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. ПЕРІОДИЧНІ ТА ЗАПЛАНОВАНІ ДІАЛОГИ (З НАЛАШТУВАННЯМ ЧАСУ ПОЯВИ) */}
          <div className="flex flex-col gap-2.5 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-zinc-400" />
                <span>Діалоги з таймерами запуску</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Час та інтервал появи</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* 1. Щогодинний зріз стану */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col gap-2.5 transition-all hover:border-zinc-700/70">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700/50 flex items-center justify-center shrink-0">
                      <BarChart2 className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-100 truncate">
                        Щогодинний зріз стану
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">
                        Інтервальне опитування 8 показників
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onTestTriggerDialogue('slice')}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                      title="Протестувати діалог"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSetting('sliceEnabled', !settings.sliceEnabled)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        settings.sliceEnabled !== false ? 'bg-amber-600' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                          settings.sliceEnabled !== false ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {settings.sliceEnabled !== false && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-zinc-800/60">
                    <span className="text-[10px] font-medium text-zinc-400 mr-1">Інтервал:</span>
                    {[30, 60, 90, 120, -1].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => updateSetting('sliceIntervalMinutes', val)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          settings.sliceIntervalMinutes === val
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                            : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40'
                        }`}
                      >
                        {val === -1 ? 'Рандом' : val < 60 ? `${val} хв` : `${val / 60} год`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Ранковий чекін & якість сну */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col gap-2.5 transition-all hover:border-zinc-700/70">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700/50 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-100 truncate">
                        Ранковий чекін & сон
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">
                        Фіксація часу сну та кортизолу
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onTestTriggerDialogue('sleep')}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                      title="Протестувати діалог"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSetting('howAreYouEnabled', !settings.howAreYouEnabled)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        settings.howAreYouEnabled !== false ? 'bg-cyan-600' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                          settings.howAreYouEnabled !== false ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/60 text-[10px] text-zinc-400">
                  <span className="font-medium">Час появи:</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono font-bold border border-zinc-700/50">
                    08:00 (після пробудження)
                  </span>
                </div>
              </div>

              {/* 3. Щоденний замір об'єму легень */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col gap-2.5 transition-all hover:border-zinc-700/70">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700/50 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-100 truncate">
                        Замір об'єму легень
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">
                        Проба Штанге & фіксація секунд
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onTestTriggerDialogue('lung_test')}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                      title="Протестувати діалог"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSetting('lungTestEnabled', !settings.lungTestEnabled)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        settings.lungTestEnabled !== false ? 'bg-emerald-600' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                          settings.lungTestEnabled !== false ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {settings.lungTestEnabled !== false && (
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[10px] text-zinc-400">
                    <span className="font-medium">Час щоденного тесту:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={settings.lungTestHour ?? 14}
                        onChange={(e) => {
                          const h = parseInt(e.target.value, 10);
                          if (!isNaN(h) && h >= 0 && h <= 23) updateSetting('lungTestHour', h);
                        }}
                        className="w-12 px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-center text-xs font-mono font-bold text-zinc-100"
                      />
                      <span>:00</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Нагадування про воду (Гідратація) */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col gap-2.5 transition-all hover:border-zinc-700/70">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700/50 flex items-center justify-center shrink-0">
                      <Droplets className="w-4 h-4 text-sky-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-100 truncate">
                        Гідратація & вода
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">
                        Нагадування випити склянку води
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onTestTriggerDialogue('hydration')}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                      title="Протестувати діалог"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSetting('hydrationEnabled', !settings.hydrationEnabled)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        settings.hydrationEnabled !== false ? 'bg-sky-600' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                          settings.hydrationEnabled !== false ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {settings.hydrationEnabled !== false && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-zinc-800/60">
                    <span className="text-[10px] font-medium text-zinc-400 mr-1">Інтервал:</span>
                    {[45, 60, 90, 120, -1].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => updateSetting('hydrationIntervalMinutes', val)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          settings.hydrationIntervalMinutes === val
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-xs'
                            : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40'
                        }`}
                      >
                        {val === -1 ? 'Рандом' : val < 60 ? `${val} хв` : `${val / 60} год`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Щоденник вдячності (Вечірній підсумок) */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col gap-2.5 transition-all hover:border-zinc-700/70">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700/50 flex items-center justify-center shrink-0">
                      <Heart className="w-4 h-4 text-pink-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-100 truncate">
                        Вечірня вдячність
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">
                        Фіксація 3 приємних моментів дня
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleTestGratitudeDialogueFromSettings}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                      title="Протестувати діалог"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSetting('gratitudeEnabled', !settings.gratitudeEnabled)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        settings.gratitudeEnabled !== false ? 'bg-pink-600' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                          settings.gratitudeEnabled !== false ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {settings.gratitudeEnabled !== false && (
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[10px] text-zinc-400">
                    <span className="font-medium">Час щовечірнього підсумку:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={settings.gratitudeHour ?? 21}
                        onChange={(e) => {
                          const h = parseInt(e.target.value, 10);
                          if (!isNaN(h) && h >= 0 && h <= 23) updateSetting('gratitudeHour', h);
                        }}
                        className="w-12 px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-center text-xs font-mono font-bold text-zinc-100"
                      />
                      <span>:00</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Тригерфікс (Робота з тягою) */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex flex-col gap-2.5 transition-all hover:border-zinc-700/70">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700/50 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-100 truncate">
                        Тригерфікс (Тяга)
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">
                        Психологічна допомога при потязі
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onTestTriggerDialogue('triggerfix')}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                      title="Протестувати діалог"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSetting('triggerFixEnabled', !settings.triggerFixEnabled)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        settings.triggerFixEnabled !== false ? 'bg-purple-600' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                          settings.triggerFixEnabled !== false ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {settings.triggerFixEnabled !== false && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-zinc-800/60">
                    <span className="text-[10px] font-medium text-zinc-400 mr-1">Інтервал:</span>
                    {[60, 120, 180, 240, -1].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => updateSetting('triggerFixIntervalMinutes', val)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          settings.triggerFixIntervalMinutes === val
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-xs'
                            : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40'
                        }`}
                      >
                        {val === -1 ? 'Рандом' : val < 60 ? `${val} хв` : `${val / 60} год`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 1: DIALOGUES & TIMERS LIST (INCLUDING INTEGRATED DIARY DIALOGUES) ================= */}
      {(currentTab === 'dialogues' || currentTab === 'phrases' || currentTab === 'tasks_gratitude') && (
        <div className="flex flex-col gap-3.5">
          {/* BLOCK 0: Зірки Космічного Кільця Аналізатора */}
          <div className="p-4 rounded-2xl bg-[#18181f]/90 border border-purple-500/30 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4.5 h-4.5 text-purple-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                    <span>Зірки Космічного Кільця</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {ringStarCount} шт.
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Початково 80 шт. Регулювання повзунком по 1 шт.
                  </div>
                </div>
              </div>

              {ringStarCount !== 80 && (
                <button
                  type="button"
                  onClick={() => handleUpdateStarCount(80)}
                  className="px-2.5 py-1 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 text-[10px] font-bold border border-purple-500/40 transition-colors cursor-pointer shrink-0"
                  title="Скинути до початкових 80 шт"
                >
                  Скинути 80
                </button>
              )}
            </div>

            {/* Slider with step=1 */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>1 шт</span>
                <span className="text-purple-300 font-bold text-xs">{ringStarCount} зірок у кільці</span>
                <span>150 шт</span>
              </div>
              <input
                type="range"
                min={1}
                max={150}
                step={1}
                value={ringStarCount}
                onChange={(e) => handleUpdateStarCount(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>

          {/* BLOCK 1: Щоденник вдячності */}
          <div className="p-4 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 hover:border-zinc-700/80 flex flex-col gap-3 shadow-xs transition-all">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center shrink-0 shadow-xs">
                  <Heart className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                    <span>Щоденник вдячності</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20 uppercase tracking-wider">
                      Дофамін
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Діалог-пропозиція зафіксувати 3 речі вдячності
                  </div>
                </div>
              </div>

              {/* Master toggle */}
              <button
                type="button"
                onClick={() => updateSetting('gratitudeEnabled', !settings.gratitudeEnabled)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  settings.gratitudeEnabled !== false ? 'bg-pink-600' : 'bg-zinc-700'
                }`}
                title={settings.gratitudeEnabled !== false ? 'Вимкнути діалог' : 'Увімкнути діалог'}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    settings.gratitudeEnabled !== false ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Time Settings */}
            {settings.gratitudeEnabled !== false && (
              <div className="flex flex-col gap-2.5 pt-1">
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span className="text-[11px] font-medium">Час щовечірнього діалогу:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={settings.gratitudeHour ?? 20}
                      onChange={(e) => {
                        const h = Math.max(0, Math.min(23, parseInt(e.target.value, 10) || 20));
                        updateSetting('gratitudeHour', h);
                      }}
                      className="w-14 text-center py-1 px-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-mono font-bold text-pink-300 focus:outline-none focus:border-pink-500"
                    />
                    <span className="text-xs text-zinc-400 font-bold">:00</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleTestGratitudeDialogueFromSettings}
                    className="py-2 px-3 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-pink-400" />
                    <span>Тест діалогу Щоденника</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onCloseModal();
                      window.dispatchEvent(new Event('open-gratitude-modal'));
                      window.dispatchEvent(new CustomEvent('change-tab', { detail: 'counter' }));
                    }}
                    className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-pink-400" />
                    <span>Відкрити Щоденник</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* BLOCK 2: Список справ дня з індивідуальними таймерами на кожну справу */}
          <div className="p-4 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 hover:border-zinc-700/80 flex flex-col gap-3 shadow-xs transition-all">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center shrink-0 shadow-xs">
                  <Timer className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                    <span>Список справ дня</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 uppercase tracking-wider">
                      Таймери справ
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Індивідуальні діалоги-нагадування для кожної справи
                  </div>
                </div>
              </div>

              {/* Master toggle */}
              <button
                type="button"
                onClick={() => updateSetting('dailyStepsEnabled', !settings.dailyStepsEnabled)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  settings.dailyStepsEnabled !== false ? 'bg-teal-600' : 'bg-zinc-700'
                }`}
                title={settings.dailyStepsEnabled !== false ? 'Вимкнути всі нагадування' : 'Увімкнути нагадування'}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    settings.dailyStepsEnabled !== false ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {settings.dailyStepsEnabled !== false && (
              <div className="flex flex-col gap-3">
                {/* List of Tasks with individual timers */}
                <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1">
                  {dailyTasks.length === 0 ? (
                    <div className="p-4 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 text-xs text-zinc-400">
                      У списку ще немає справ. Додайте справу нижче та задайте час для нагадування!
                    </div>
                  ) : (
                    dailyTasks.map((task, idx) => {
                      const isTaskRemEnabled = task.reminderDialogueEnabled !== false;
                      return (
                        <div
                          key={task.id || idx}
                          className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80 flex flex-col gap-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-bold text-white truncate">
                                {task.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* Task Time Input */}
                              <input
                                type="time"
                                value={task.scheduledTime || ''}
                                onChange={(e) => handleUpdateTaskTime(task.id, e.target.value)}
                                className="py-1 px-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono font-bold text-teal-300 focus:outline-none focus:border-teal-500 cursor-pointer"
                                title="Встановити час нагадування для цієї справи"
                              />

                              {/* Task Dialogue Toggle */}
                              <button
                                type="button"
                                onClick={() => handleToggleTaskReminder(task.id, !isTaskRemEnabled)}
                                className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                                  isTaskRemEnabled ? 'bg-teal-600' : 'bg-zinc-700'
                                }`}
                                title={isTaskRemEnabled ? 'Вимкнути діалог для цієї справи' : 'Увімкнути діалог'}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full bg-white transition-transform absolute top-0.5 ${
                                    isTaskRemEnabled ? 'left-4.5' : 'left-0.5'
                                  }`}
                                />
                              </button>

                              {/* Delete Task */}
                              <button
                                type="button"
                                onClick={() => handleDeleteTaskFromSettings(task.id)}
                                className="p-1 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                                title="Видалити справу"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Quick Trigger Test for this Task */}
                          <div className="flex items-center justify-between pt-1.5 border-t border-zinc-800/60">
                            <span className="text-[10px] text-zinc-400">
                              {task.scheduledTime ? `Таймер на: ${task.scheduledTime}` : 'Таймер не встановлено'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleTestTaskDialogueFromSettings(task)}
                              className="px-2.5 py-1 rounded-lg bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/40 text-teal-200 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Play className="w-3 h-3 text-teal-400" />
                              <span>Запустити діалог для цієї справи</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Add new task form */}
                <form onSubmit={handleAddTaskFromSettings} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-2">
                  <div className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-teal-400" />
                    <span>Додати справу з власним таймером:</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Назва справи (наприклад: пробіжка, дихальна гімнастика)..."
                      className="flex-1 py-1.5 px-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-teal-500"
                    />
                    <input
                      type="time"
                      value={newTaskTime}
                      onChange={(e) => setNewTaskTime(e.target.value)}
                      className="py-1.5 px-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono font-bold text-teal-300 focus:outline-none focus:border-teal-500 cursor-pointer"
                    />
                    <button
                      type="submit"
                      disabled={!newTaskTitle.trim()}
                      className="py-1.5 px-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs shrink-0"
                    >
                      Додати
                    </button>
                  </div>
                </form>

                {/* Open full Daily Steps button */}
                <button
                  type="button"
                  onClick={() => {
                    onCloseModal();
                    window.dispatchEvent(new Event('open-daily-steps-modal'));
                    window.dispatchEvent(new CustomEvent('change-tab', { detail: 'counter' }));
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                  <span>Відкрити повний Список справ</span>
                </button>
              </div>
            )}
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span>Аналізатор ініціює діалоги за вашим таймером. Створені діалоги закріплені вгорі.</span>
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleRandomizeAllToggles}
                className="px-2.5 py-1.5 bg-purple-950/90 hover:bg-purple-900/90 text-purple-200 border border-purple-500/40 hover:border-purple-400 rounded-lg text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
                title="Переключити усі тумблери у випадковий стан (увімкнено / вимкнено)"
              >
                <Shuffle className="w-3.5 h-3.5 text-purple-400" />
                <span>Усі рандом</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentTab('create_dialogue');
                  onTabChange?.('create_dialogue');
                }}
                className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Новий діалог</span>
              </button>
            </div>
          </div>

          {/* List of Dialogue Cards */}
          <div className="flex flex-col gap-2.5">
            {sortedPhrasesList.map((phrase) => {
              const isExpanded = expandedPhraseId === phrase.id;
              const isEnabled = phrase.enabled !== false;
              const intervalVal = phrase.intervalMinutes !== undefined ? phrase.intervalMinutes : 60;

              return (
                <div
                  key={phrase.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 shadow-xs hover:border-zinc-700/80 ${
                    phrase.isCustom
                      ? 'bg-gradient-to-b from-purple-950/20 via-[#18181f]/90 to-[#18181f]/95 border-purple-500/30'
                      : 'bg-[#18181f]/90 border-zinc-800/80'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 flex items-center justify-center shrink-0 shadow-xs">
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-zinc-100 truncate">
                            {phrase.name}
                          </span>
                          {phrase.isCustom ? (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                              Створений
                            </span>
                          ) : (
                            <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                              {phrase.category || 'Системний'}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 italic line-clamp-1 mt-0.5">
                          «{phrase.question}»
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Toggle On/Off */}
                      <button
                        type="button"
                        onClick={() => updateDialogueTimer(phrase.id, !isEnabled, intervalVal)}
                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                          isEnabled ? 'bg-purple-600' : 'bg-zinc-700'
                        }`}
                        title={isEnabled ? 'Вимкнути діалог' : 'Увімкнути діалог'}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                            isEnabled ? 'left-5' : 'left-0.5'
                          }`}
                        />
                      </button>

                      {/* Expand / Collapse Button */}
                      <button
                        type="button"
                        onClick={() => setExpandedPhraseId(isExpanded ? null : phrase.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isExpanded
                            ? 'bg-purple-600/30 border-purple-500/50 text-purple-200'
                            : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-400 hover:text-white'
                        }`}
                        title="Редагувати репліки та дії"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {/* Delete (custom only) */}
                      {phrase.isCustom && (
                        <button
                          type="button"
                          onClick={() => deleteDialoguePhrase(phrase.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer transition-colors"
                          title="Видалити діалог"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Direct Integrated Timer Setting */}
                  {isEnabled && (
                    <div className="pt-2 border-t border-zinc-800/60 flex flex-col gap-2">
                      <FlexibleIntervalPicker
                        label="Таймер появи"
                        value={intervalVal}
                        onChange={(val) => updateDialogueTimer(phrase.id, true, val)}
                        minSliderVal={5}
                        maxSliderVal={360}
                      />

                      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/40">
                        <span className="text-[10px] text-zinc-500">
                          {phrase.options?.length || 0} варіанти дій
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onCloseModal();
                            onTestTriggerDialogue(phrase.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-purple-300 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Play className="w-3 h-3 text-purple-400" />
                          <span>Запустити тест</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Expanded Phrase & Actions Editor */}
                  {isExpanded && (
                    <div className="pt-3 mt-1 border-t border-purple-500/30 flex flex-col gap-3 animate-in fade-in duration-150 bg-black/20 -mx-3 -mb-3 p-3 rounded-b-2xl">
                      {/* Edit Question */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-zinc-300 flex items-center gap-1">
                          <Edit2 className="w-3 h-3 text-purple-400" />
                          <span>Репліка Аналізатора (Запитання):</span>
                        </label>
                        <textarea
                          rows={2}
                          value={phrase.question}
                          onChange={(e) => updatePhraseItem(phrase.id, { question: stripEmoji(e.target.value) })}
                          className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                          placeholder="Що Аналізатор запитає у хмаринці..."
                        />
                      </div>

                      {/* Edit Options / Buttons & Actions */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[10px] font-bold text-zinc-300">
                          <span>Варіанти відповідей користувача та дії:</span>
                          <span className="text-zinc-500 font-normal">до 8 дій</span>
                        </div>

                        <div className="flex flex-col gap-2">
                          {(phrase.options || []).map((opt, optIndex) => (
                            <div
                              key={opt.id || optIndex}
                              className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-purple-400 shrink-0">
                                  #{optIndex + 1}
                                </span>
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) => {
                                    const opts = [...(phrase.options || [])];
                                    opts[optIndex] = { ...opts[optIndex], text: stripEmoji(e.target.value) };
                                    updatePhraseItem(phrase.id, { options: opts });
                                  }}
                                  placeholder="Текст на кнопці..."
                                  className="flex-1 px-2 py-1 bg-black/50 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                                />
                                {phrase.options.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const opts = phrase.options.filter((_, i) => i !== optIndex);
                                      updatePhraseItem(phrase.id, { options: opts });
                                    }}
                                    className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer"
                                    title="Видалити кнопку"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>

                              {/* Action Selector from Actions Constructor */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[9px] text-zinc-400">Дія Аналізатора:</span>
                                  <select
                                    value={opt.action}
                                    onChange={(e) => {
                                      const actionId = e.target.value;
                                      const actDef = allAvailableActions.find((a) => a.id === actionId);
                                      const opts = [...(phrase.options || [])];
                                      opts[optIndex] = {
                                        ...opts[optIndex],
                                        action: actionId as DialogueActionType,
                                        analyzerReply: actDef?.defaultReply || opts[optIndex].analyzerReply
                                      };
                                      updatePhraseItem(phrase.id, { options: opts });
                                    }}
                                    className="px-2 py-1 bg-zinc-950 border border-zinc-700 rounded-lg text-[11px] text-zinc-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                                  >
                                    {allAvailableActions.map((act) => (
                                      <option key={act.id} value={act.id}>
                                        {act.label} {act.isCustom ? '(Створена)' : ''}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[9px] text-zinc-400">Що відповість Аналізатор:</span>
                                  <input
                                    type="text"
                                    value={opt.analyzerReply || ''}
                                    onChange={(e) => {
                                      const opts = [...(phrase.options || [])];
                                      opts[optIndex] = { ...opts[optIndex], analyzerReply: stripEmoji(e.target.value) };
                                      updatePhraseItem(phrase.id, { options: opts });
                                    }}
                                    placeholder="Репліка Аналізатора..."
                                    className="px-2 py-1 bg-zinc-950 border border-zinc-700 rounded-lg text-[11px] text-zinc-200 focus:outline-none focus:border-purple-500"
                                  />
                                </div>
                              </div>

                              {/* Light / Animation Reaction Selector */}
                              <div className="flex flex-col gap-1 pt-1 border-t border-zinc-800/60">
                                <span className="text-[9px] text-zinc-400 font-medium">Світлова реакція оболонки:</span>
                                <div className="grid grid-cols-3 gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const opts = [...(phrase.options || [])];
                                      opts[optIndex] = { ...opts[optIndex], visualReaction: 'joy' };
                                      updatePhraseItem(phrase.id, { options: opts });
                                    }}
                                    className={`py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                      (opt.visualReaction === 'joy' || (!opt.visualReaction && opt.action === 'close_quiet'))
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                                    }`}
                                  >
                                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                                    <span className="truncate">Радість (все ок)</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const opts = [...(phrase.options || [])];
                                      opts[optIndex] = { ...opts[optIndex], visualReaction: 'active' };
                                      updatePhraseItem(phrase.id, { options: opts });
                                    }}
                                    className={`py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                      (opt.visualReaction === 'active' || (!opt.visualReaction && opt.action !== 'close_quiet' && opt.action !== 'remind_timer'))
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-xs'
                                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                                    }`}
                                  >
                                    <Zap className="w-3 h-3 text-purple-400 shrink-0" />
                                    <span className="truncate">Повідомлення</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const opts = [...(phrase.options || [])];
                                      opts[optIndex] = { ...opts[optIndex], visualReaction: 'calm' };
                                      updatePhraseItem(phrase.id, { options: opts });
                                    }}
                                    className={`py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                      (opt.visualReaction === 'calm' || (!opt.visualReaction && opt.action === 'remind_timer'))
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                                    }`}
                                  >
                                    <Smile className="w-3 h-3 text-emerald-400 shrink-0" />
                                    <span className="truncate">Спокійний</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Option Button */}
                        {(phrase.options || []).length < 8 && (
                          <button
                            type="button"
                            onClick={() => {
                              const opts = [...(phrase.options || [])];
                              const newOpt: DialogueOptionConfig = {
                                id: `opt_${Date.now()}_${opts.length + 1}`,
                                text: 'Новий варіант',
                                action: 'close_quiet',
                                analyzerReply: 'Зрозумів, бережи себе.'
                              };
                              updatePhraseItem(phrase.id, { options: [...opts, newOpt] });
                            }}
                            className="w-full py-1.5 rounded-xl border border-dashed border-zinc-700 hover:border-purple-500 text-zinc-400 hover:text-purple-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Додати кнопку відповіді</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: CREATE NEW DIALOGUE ================= */}
      {(currentTab === 'create_dialogue' || currentTab === 'create') && (
        <form onSubmit={handleCreateNewDialogue} className="flex flex-col gap-3 text-zinc-100">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
            <span className="font-bold">Створення нового діалогу.</span> Створений блок автоматично зʼявиться на самому початку списку у вкладці «Діалоги» та матиме повні налаштування таймера й дій.
          </div>

          {/* Step 1: Name */}
          <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <span>1.</span>
              <span>Назва діалогу</span>
            </label>
            <input
              type="text"
              required
              value={newDialName}
              onChange={(e) => setNewDialName(stripEmoji(e.target.value))}
              placeholder="Наприклад: Вечірнє розвантаження"
              className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Step 2: Question / Phrase */}
          <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <span>2.</span>
              <span>Репліка Аналізатора (Запитання у хмаринці)</span>
            </label>
            <textarea
              required
              rows={2}
              value={newDialQuestion}
              onChange={(e) => setNewDialQuestion(stripEmoji(e.target.value))}
              placeholder="Наприклад: Як твій рівень стресу зараз? Потрібна пауза чи практика дихання?"
              className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Step 3: Timer Schedule */}
          <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <span>3.</span>
              <span>Таймер появи (Періодичність)</span>
            </label>
            <FlexibleIntervalPicker
              label="Інтервал появи діалогу"
              value={newDialInterval}
              onChange={(val) => setNewDialInterval(val)}
              minSliderVal={5}
              maxSliderVal={360}
            />
          </div>

          {/* Step 4: Button Options with Action Selection */}
          <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
              <span className="flex items-center gap-1.5">
                <span>4.</span>
                <span>Варіанти відповідей користувача (Кнопки)</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-normal">до 8 кнопок</span>
            </div>

            <div className="flex flex-col gap-2">
              {newDialOptions.map((opt, optIndex) => (
                <div
                  key={opt.id || optIndex}
                  className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-purple-400 shrink-0">#{optIndex + 1}</span>
                    <input
                      type="text"
                      required
                      value={opt.text}
                      onChange={(e) => {
                        const opts = [...newDialOptions];
                        opts[optIndex] = { ...opts[optIndex], text: stripEmoji(e.target.value) };
                        setNewDialOptions(opts);
                      }}
                      placeholder="Текст на кнопці..."
                      className="flex-1 px-2 py-1 bg-black/50 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                    {newDialOptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setNewDialOptions(newDialOptions.filter((_, i) => i !== optIndex))}
                        className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-zinc-400">Дія з Конструктора дій:</span>
                      <select
                        value={opt.action}
                        onChange={(e) => {
                          const actionId = e.target.value;
                          const actDef = allAvailableActions.find((a) => a.id === actionId);
                          const opts = [...newDialOptions];
                          opts[optIndex] = {
                            ...opts[optIndex],
                            action: actionId as DialogueActionType,
                            analyzerReply: actDef?.defaultReply || opts[optIndex].analyzerReply
                          };
                          setNewDialOptions(opts);
                        }}
                        className="px-2 py-1 bg-zinc-950 border border-zinc-700 rounded-lg text-[11px] text-zinc-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                      >
                        {allAvailableActions.map((act) => (
                          <option key={act.id} value={act.id}>
                            {act.label} {act.isCustom ? '(Створена)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-zinc-400">Відповідь Аналізатора:</span>
                      <input
                        type="text"
                        value={opt.analyzerReply || ''}
                        onChange={(e) => {
                          const opts = [...newDialOptions];
                          opts[optIndex] = { ...opts[optIndex], analyzerReply: stripEmoji(e.target.value) };
                          setNewDialOptions(opts);
                        }}
                        placeholder="Репліка Аналізатора..."
                        className="px-2 py-1 bg-zinc-950 border border-zinc-700 rounded-lg text-[11px] text-zinc-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Light / Animation Reaction Selector */}
                  <div className="flex flex-col gap-1 pt-1 border-t border-zinc-800/60">
                    <span className="text-[9px] text-zinc-400 font-medium">Світлова реакція оболонки:</span>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const opts = [...newDialOptions];
                          opts[optIndex] = { ...opts[optIndex], visualReaction: 'joy' };
                          setNewDialOptions(opts);
                        }}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          (opt.visualReaction === 'joy' || (!opt.visualReaction && opt.action === 'close_quiet'))
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                            : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">Радість (все ок)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const opts = [...newDialOptions];
                          opts[optIndex] = { ...opts[optIndex], visualReaction: 'active' };
                          setNewDialOptions(opts);
                        }}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          (opt.visualReaction === 'active' || (!opt.visualReaction && opt.action !== 'close_quiet' && opt.action !== 'remind_timer'))
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-xs'
                            : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        <Zap className="w-3 h-3 text-purple-400 shrink-0" />
                        <span className="truncate">Повідомлення</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const opts = [...newDialOptions];
                          opts[optIndex] = { ...opts[optIndex], visualReaction: 'calm' };
                          setNewDialOptions(opts);
                        }}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          (opt.visualReaction === 'calm' || (!opt.visualReaction && opt.action === 'remind_timer'))
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                            : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        <Smile className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">Спокійний</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {newDialOptions.length < 8 && (
              <button
                type="button"
                onClick={() => {
                  const newOpt: DialogueOptionConfig = {
                    id: `opt_${Date.now()}_${newDialOptions.length + 1}`,
                    text: 'Нова відповідь',
                    action: 'close_quiet',
                    analyzerReply: 'Зрозумів, дякую.'
                  };
                  setNewDialOptions([...newDialOptions, newOpt]);
                }}
                className="w-full py-2 rounded-xl border border-dashed border-zinc-700 hover:border-purple-500 text-zinc-400 hover:text-purple-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Додати ще кнопку</span>
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
          >
            <Check className="w-4 h-4" />
            <span>Створити та закріпити діалог зверху</span>
          </button>
        </form>
      )}

      {/* ================= TAB 3: ANALYZER ACTIONS CONSTRUCTOR ================= */}
      {currentTab === 'actions' && (
        <div className="flex flex-col gap-3.5 animate-in fade-in duration-150">
          {/* Header Banner with Statistics */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-zinc-950 to-indigo-950/80 border border-purple-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-extrabold text-purple-200 flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  <Zap className="w-4 h-4 text-purple-300" />
                </div>
                <span>Конструктор Дій та Немислимих Комбінацій</span>
              </div>
              <p className="text-[11px] text-zinc-300/90 leading-snug max-w-xl">
                Побудуйте будь-які немислимі комбінації: гідратація, дихальні цикли, зміна оболонки, кольоровий спектр, розмиття, катарсис та бали стійкості у каскадних комбо-ланцюжках!
              </p>
              {/* Stat Chips */}
              <div className="flex items-center gap-2 pt-1.5 flex-wrap text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300">
                  Всього дій: <strong className="text-purple-300">{allAvailableActions.length}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300">
                  Вбудованих: <strong className="text-indigo-300">{BUILTIN_ANALYZER_ACTIONS.length}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300">
                  Кастомних & Комбо: <strong className="text-amber-300">{customActions.length}</strong>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCreatingAction(!isCreatingAction)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold shrink-0 cursor-pointer transition-all shadow-lg shadow-purple-900/30 flex items-center gap-1.5 active:scale-95"
            >
              {isCreatingAction ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Сховати конструктор</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Створити немислиме комбо</span>
                </>
              )}
            </button>
          </div>

          {/* Creation Form Modal/Card */}
          {isCreatingAction && (
            <form
              onSubmit={handleCreateNewAction}
              className="p-4 rounded-2xl bg-zinc-950/95 border border-purple-500/60 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 shadow-2xl ring-1 ring-purple-500/20"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                <div className="text-xs font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Створення нової дії або мульти-комбо ланцюжка</span>
                </div>

                {/* Single vs Multi-Combo Toggle */}
                <div className="flex p-0.5 bg-zinc-900 rounded-xl border border-zinc-800 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setActionBuildType('single')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      actionBuildType === 'single'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Одиночна дія
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionBuildType('combo')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      actionBuildType === 'combo'
                        ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-xs'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Мульти-Комбо Ланцюжок
                  </button>
                </div>
              </div>

              {/* Action Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-300">Назва дії або комбо:</span>
                  <input
                    type="text"
                    required
                    value={newActionLabel}
                    onChange={(e) => setNewActionLabel(stripEmoji(e.target.value))}
                    placeholder={actionBuildType === 'combo' ? 'Наприклад: Космічна Матриця Волі' : "Наприклад: Гарячий м'ятний чай"}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-300">Категорія:</span>
                  <select
                    value={newActionCategory}
                    onChange={(e) => setNewActionCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer font-medium"
                  >
                    <option value="health">Здоров'я & Тіло</option>
                    <option value="appearance">Оболонка & Вигляд</option>
                    <option value="analytics">Аналітика & Графіки</option>
                    <option value="dialogue">Психологія & Діалог</option>
                    <option value="gamification">Стійкість & Бонуси</option>
                    <option value="system">Системні & Таймери</option>
                    <option value="combo">Мульти-Комбо</option>
                  </select>
                </div>
              </div>

              {/* SINGLE ACTION BUILDER */}
              {actionBuildType === 'single' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <span className="text-[10px] font-bold text-purple-300">Базова механіка Аналізатора:</span>
                    <select
                      value={newActionBehavior}
                      onChange={(e) => setNewActionBehavior(e.target.value as any)}
                      className="w-full p-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer font-medium"
                    >
                      <optgroup label="Здоров'я & Тіло">
                        <option value="hydration">Додати склянку води (+250 мл)</option>
                        <option value="calm_breath">Запустити Дихання 4-7-8</option>
                        <option value="box_breath">Квадратне дихання 4-4-4-4</option>
                        <option value="deep_breath_10">Глибокі 10 вдихів</option>
                        <option value="grounding_54321">Заземлення 5-4-3-2-1</option>
                        <option value="lung_test">Запустити Тест легень (проба Штанге)</option>
                        <option value="mint_tea">Гарячий м'ятний чай</option>
                        <option value="cold_compress">Охолодження скронь</option>
                        <option value="pulse_check">Перевірка пульсу</option>
                      </optgroup>
                      <optgroup label="Оболонка & Вигляд">
                        <option value="style_cat">Переключити на Чорного кота</option>
                        <option value="style_cosmic_ring">Переключити на Космічне кільце</option>
                        <option value="style_glitter">Переключити на Глітер</option>
                        <option value="style_wave">Переключити на Хвилю</option>
                        <option value="style_snowflake">Переключити на Сніжинку</option>
                        <option value="style_autumn">Переключити на режим Осені</option>
                        <option value="style_flower">Переключити на Квітку</option>
                        <option value="set_hue_sakura">Змінити сяйво на Сакуру (330°)</option>
                        <option value="set_hue_ocean">Змінити сяйво на Океан (210°)</option>
                        <option value="set_hue_emerald">Змінити сяйво на Смарагд (140°)</option>
                        <option value="set_hue_amber">Змінити сяйво на Янтар (45°)</option>
                        <option value="set_hue_uv">Змінити сяйво на Ультрафіолет (280°)</option>
                        <option value="set_hue_custom">Кастомний градус кольору</option>
                        <option value="set_mode_mono_white">Переключити в Білий Ч/б</option>
                        <option value="set_mode_mono_black">Переключити в Чорний Ч/б</option>
                        <option value="set_mode_color">Повнокольоровий режим</option>
                        <option value="set_blur_max">Максимальне розмиття (12 px)</option>
                        <option value="set_blur_medium">Середнє розмиття (6 px)</option>
                        <option value="set_blur_zero">Абсолютна чіткість (0 px)</option>
                      </optgroup>
                      <optgroup label="Аналітика & Навігація">
                        <option value="slice">Відкрити Повний Зріз (8 показників)</option>
                        <option value="analysis">Відкрити Графіки та Аналіз</option>
                        <option value="triggerfix">Відкрити Тригерфікс</option>
                        <option value="navigate_sos">Перейти до SOS Режиму</option>
                        <option value="open_quick_panel">Відкрити Швидку Панель Механік</option>
                      </optgroup>
                      <optgroup label="Психологія & Діалог">
                        <option value="catarsis_release">Запустити Катарсис-розрядку</option>
                        <option value="philosophy_thought">Філософська мудрість</option>
                        <option value="stop_thought_technique">Техніка Стоп-Думка</option>
                        <option value="lung_clean_visualization">Візуалізація чистої легені</option>
                        <option value="sound_zen_impulse">Звуковий дзен-імпульс</option>
                        <option value="provocation_challenge">Психологічний виклик</option>
                        <option value="close_quiet">Спокійне завершення діалогу</option>
                      </optgroup>
                      <optgroup label="Стійкість & Бонуси">
                        <option value="add_resilience_10">Нарахувати +10 балів стійкості</option>
                        <option value="add_resilience_50">Нарахувати +50 балів стійкості</option>
                        <option value="add_resilience_100">Нарахувати +100 балів супер-стійкості</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* Optional Custom Parameter */}
                  {(newActionBehavior === 'set_hue_custom' || newActionBehavior === 'remind_timer' || newActionBehavior === 'add_resilience_custom') && (
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <span className="text-[10px] font-bold text-amber-300">Кастомний параметр (число):</span>
                      <input
                        type="number"
                        value={newActionParam}
                        onChange={(e) => setNewActionParam(e.target.value)}
                        placeholder="Наприклад: 180 (градус), 45 (хвилин) або 200 (балів)"
                        className="w-full p-2 bg-zinc-950 border border-amber-500/40 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              ) : (
                /* MULTI-ACTION COMBO CHAIN STEP CONSTRUCTOR */
                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-extrabold text-purple-200 border-b border-purple-500/20 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Каскадний Конструктор Кроків ({comboSubSteps.length} кроків)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newId = `step_${Date.now()}`;
                        setComboSubSteps([
                          ...comboSubSteps,
                          { id: newId, behavior: 'hydration', label: 'Додати воду (+250 мл)' }
                        ]);
                      }}
                      className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-extrabold cursor-pointer transition-all flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Додати крок</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {comboSubSteps.map((step, idx) => (
                      <div
                        key={step.id}
                        className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-2 shadow-sm animate-in fade-in duration-100"
                      >
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="w-5 h-5 rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center justify-center text-[10px] font-mono font-bold">
                            #{idx + 1}
                          </span>
                        </div>

                        <select
                          value={step.behavior}
                          onChange={(e) => {
                            const val = e.target.value as DialogueActionType;
                            const updated = comboSubSteps.map((s) => s.id === step.id ? { ...s, behavior: val } : s);
                            setComboSubSteps(updated);
                          }}
                          className="w-full p-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="hydration">Вода (+250 мл)</option>
                          <option value="calm_breath">Дихання 4-7-8</option>
                          <option value="box_breath">Квадратне дихання 4-4-4-4</option>
                          <option value="deep_breath_10">Глибокі 10 вдихів</option>
                          <option value="grounding_54321">Заземлення 5-4-3-2-1</option>
                          <option value="mint_tea">М'ятний чай</option>
                          <option value="cold_compress">Охолодження скронь</option>
                          <option value="style_cat">Оболонка Чорний кіт</option>
                          <option value="style_cosmic_ring">Оболонка Космічне кільце</option>
                          <option value="style_wave">Оболонка Хвиля</option>
                          <option value="style_glitter">Оболонка Глітер</option>
                          <option value="style_snowflake">Оболонка Сніжинка</option>
                          <option value="style_autumn">Оболонка Осінь</option>
                          <option value="style_flower">Оболонка Квітка</option>
                          <option value="set_hue_sakura">Сяйво Сакура (330°)</option>
                          <option value="set_hue_ocean">Сяйво Океан (210°)</option>
                          <option value="set_hue_emerald">Сяйво Смарагд (140°)</option>
                          <option value="set_hue_amber">Сяйво Янтар (45°)</option>
                          <option value="set_hue_uv">Сяйво Ультрафіолет (280°)</option>
                          <option value="set_mode_mono_white">Білий Ч/б</option>
                          <option value="set_mode_mono_black">Чорний Ч/б</option>
                          <option value="set_blur_max">Розмиття 12px</option>
                          <option value="set_blur_zero">Чіткість 0px</option>
                          <option value="add_resilience_10">+10 балів стійкості</option>
                          <option value="add_resilience_50">+50 балів стійкості</option>
                          <option value="add_resilience_100">+100 балів супер-стійкості</option>
                          <option value="catarsis_release">Катарсис-розрядка</option>
                          <option value="stop_thought_technique">Техніка Стоп-Думка</option>
                          <option value="lung_clean_visualization">Візуалізація чистої легені</option>
                          <option value="slice">Зріз 8 показників</option>
                          <option value="analysis">Графіки та Аналіз</option>
                          <option value="triggerfix">Тригерфікс</option>
                        </select>

                        {/* Order & Trash Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          {comboSubSteps.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setComboSubSteps(comboSubSteps.filter((s) => s.id !== step.id))}
                              className="p-1.5 text-zinc-500 hover:text-rose-400 cursor-pointer transition-colors"
                              title="Видалити крок"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Flowchart Chain Visualizer */}
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-purple-500/20 text-[10px] text-purple-200 font-mono flex items-center gap-1.5 overflow-x-auto">
                    <span className="text-zinc-500 font-sans font-bold shrink-0">Ланцюжок:</span>
                    {comboSubSteps.map((s, i) => (
                      <React.Fragment key={s.id || i}>
                        {i > 0 && <span className="text-zinc-300">→</span>}
                        <span className="px-1.5 py-0.5 rounded bg-purple-900/40 text-purple-200 border border-purple-500/30 shrink-0">
                          #{i + 1} {s.label || s.behavior}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* Analyzer Reply Text */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-zinc-300">Що відповість Аналізатор у хмаринці:</span>
                <input
                  type="text"
                  value={newActionReply}
                  onChange={(e) => setNewActionReply(stripEmoji(e.target.value))}
                  placeholder="Наприклад: Каскадна програма перезавантаження запущена успішно!"
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Action Description */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-zinc-300">Короткий опис ефекту:</span>
                <input
                  type="text"
                  value={newActionDescription}
                  onChange={(e) => setNewActionDescription(stripEmoji(e.target.value))}
                  placeholder="Опис для підказки та списку дій"
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs cursor-pointer transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 active:scale-98"
              >
                <Check className="w-4 h-4" />
                <span>Зберегти та зафіксувати {actionBuildType === 'combo' ? 'Мульти-Комбо' : 'Дію'}</span>
              </button>
            </form>
          )}

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={actionSearchQuery}
                onChange={(e) => setActionSearchQuery(e.target.value)}
                placeholder="Пошук дій або комбо..."
                className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
              {actionSearchQuery && (
                <button
                  type="button"
                  onClick={() => setActionSearchQuery('')}
                  className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300 cursor-pointer text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
              {[
                { id: 'all', label: 'Усі дії' },
                { id: 'combo', label: 'Мульти-Комбо' },
                { id: 'health', label: 'Здоров\'я' },
                { id: 'appearance', label: 'Оболонка' },
                { id: 'analytics', label: 'Аналітика' },
                { id: 'dialogue', label: 'Психологія' },
                { id: 'gamification', label: 'Стійкість' },
                { id: 'system', label: 'Системні' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-purple-600 text-white border-purple-400 shadow-xs'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {allAvailableActions
              .filter((act) => {
                if (selectedCategoryFilter !== 'all') {
                  if (selectedCategoryFilter === 'combo') {
                    if (act.behavior !== 'combo_chain' && act.category !== 'combo') return false;
                  } else if (act.category !== selectedCategoryFilter) {
                    return false;
                  }
                }
                if (actionSearchQuery.trim()) {
                  const q = actionSearchQuery.toLowerCase();
                  return (
                    act.label.toLowerCase().includes(q) ||
                    act.description.toLowerCase().includes(q) ||
                    act.defaultReply.toLowerCase().includes(q)
                  );
                }
                return true;
              })
              .map((act) => (
                <div
                  key={act.id}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2.5 transition-all ${
                    act.behavior === 'combo_chain' || act.category === 'combo'
                      ? 'bg-gradient-to-br from-purple-950/60 via-zinc-950 to-indigo-950/50 border-purple-500/60 shadow-md ring-1 ring-purple-500/20'
                      : act.isCustom
                      ? 'bg-purple-950/20 border-purple-500/40 shadow-sm'
                      : 'bg-zinc-950/80 border-zinc-800/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        act.behavior === 'combo_chain' || act.category === 'combo'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-zinc-100 truncate flex items-center gap-1.5">
                          <span>{act.label}</span>
                          {(act.behavior === 'combo_chain' || act.category === 'combo') && (
                            <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 uppercase tracking-wider">
                              Мульти-Комбо
                            </span>
                          )}
                          {act.isCustom && (
                            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                              Кастомна
                            </span>
                          )}
                        </div>
                        <div className="text-[10.5px] text-zinc-400 line-clamp-1 mt-0.5">
                          {act.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => triggerToast(`Тест дії «${act.label}»: ${act.defaultReply}`)}
                        className="p-1 text-zinc-400 hover:text-purple-300 cursor-pointer"
                        title="Протестувати відповідь дії"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>

                      {act.isCustom && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomAction(act.id)}
                          className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer transition-colors"
                          title="Видалити кастомну дію"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SubSteps Flow Badges for Combos */}
                  {act.subSteps && act.subSteps.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-0.5">
                      {act.subSteps.map((s, i) => (
                        <span key={s.id || i} className="text-[9px] bg-zinc-900 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30 font-mono flex items-center gap-0.5">
                          <span className="text-purple-400 font-bold">#{i + 1}</span> {s.label || s.behavior}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Reply Callout */}
                  <div className="text-[10px] text-purple-200/90 font-mono bg-purple-950/50 px-2.5 py-1 rounded-xl border border-purple-500/20 truncate">
                    Відповідь: «{act.defaultReply}»
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: MEMORY & RESULTS ================= */}
      {currentTab === 'results' && (
        <div className="flex flex-col gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
            Пам'ять замірів та активність ваших діалогів за сьогодні.
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex flex-col gap-1">
              <span className="text-[10px] text-zinc-400">Зрізів сьогодні:</span>
              <span className="text-lg font-bold text-white font-mono">{stats.todaySlicesCount}</span>
              <span className="text-[9px] text-zinc-500">Останній: {stats.lastSliceTime}</span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex flex-col gap-1">
              <span className="text-[10px] text-zinc-400">Вода сьогодні:</span>
              <span className="text-lg font-bold text-sky-300 font-mono">{stats.waterMl} мл</span>
              <span className="text-[9px] text-zinc-500">{Math.round((stats.waterMl / 2000) * 100)}% від норми</span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex flex-col gap-1">
              <span className="text-[10px] text-zinc-400">Обʼєм легень:</span>
              <span className="text-lg font-bold text-teal-300 font-mono">{stats.lastLung}</span>
              <span className="text-[9px] text-zinc-500">Проба Штанге</span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex flex-col gap-1">
              <span className="text-[10px] text-zinc-400">Активних діалогів:</span>
              <span className="text-lg font-bold text-purple-300 font-mono">
                {Object.values(phrases).filter((p) => p.enabled !== false).length}
              </span>
              <span className="text-[9px] text-zinc-500">Всього: {Object.keys(phrases).length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
