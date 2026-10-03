import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Check, 
  Wind, 
  Brain, 
  Heart, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { SentientRandomThought } from '../data/analyzerThoughts';

interface AnalyzerThoughtModalProps {
  thought: SentientRandomThought | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenSavedCollection: () => void;
}

export const AnalyzerThoughtModal: React.FC<AnalyzerThoughtModalProps> = ({
  thought,
  isOpen,
  onClose,
  onNext,
  onPrev,
  onOpenSavedCollection,
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathSeconds, setBreathSeconds] = useState<number>(4);

  // Check saved state in localStorage
  useEffect(() => {
    if (!thought) return;
    try {
      const raw = localStorage.getItem('quit-smoking:saved-analyzer-thoughts');
      const list: string[] = raw ? JSON.parse(raw) : [];
      setIsSaved(list.includes(thought.id));
    } catch {
      setIsSaved(false);
    }
  }, [thought]);

  // Breathing focus loop (4-4-4 rhythm)
  useEffect(() => {
    if (!isBreathingActive) return;
    const interval = setInterval(() => {
      setBreathSeconds((prev) => {
        if (prev > 1) return prev - 1;
        // Switch phase
        setBreathPhase((currentPhase) => {
          if (currentPhase === 'inhale') return 'hold';
          if (currentPhase === 'hold') return 'exhale';
          return 'inhale';
        });
        return 4;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive]);

  if (!isOpen || !thought || typeof document === 'undefined') return null;

  const handleToggleSave = () => {
    try {
      const raw = localStorage.getItem('quit-smoking:saved-analyzer-thoughts');
      let list: string[] = raw ? JSON.parse(raw) : [];
      if (list.includes(thought.id)) {
        list = list.filter((id) => id !== thought.id);
        setIsSaved(false);
      } else {
        list.push(thought.id);
        setIsSaved(true);
      }
      localStorage.setItem('quit-smoking:saved-analyzer-thoughts', JSON.stringify(list));
      window.dispatchEvent(new Event('saved-thoughts-updated'));
    } catch {}
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(`«${thought.text}» — Думка Аналізатора`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Provide rich context fallback if not provided
  const contextText = thought.insightContext || 
    'Ця думка відображає переналаштування нейронних зв’язків та поступове очищення рецепторів. Твоє тіло зараз відновлює природну автономію від нікотинового стимулятора.';

  const practiceText = thought.microPractice || 
    'Зроби повільний вдих через ніс на 4 секунди, відчуй опору під ногами і м’яко видихни.';

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-zinc-100 relative animate-in zoom-in-95 duration-200 select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
              Глибина думки
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs font-medium text-cyan-300">
              {thought.categoryLabel || 'Усвідомлення'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleToggleSave}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSaved 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
              title={isSaved ? 'Збережено в улюблені' : 'Зберегти думку'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Core Thought */}
        <div className="py-2">
          <p className="text-base sm:text-lg font-medium text-zinc-100 leading-relaxed tracking-tight select-text">
            «{thought.text}»
          </p>
        </div>

        {/* Biological / Psychological Insight Context */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
            <Brain className="w-3.5 h-3.5 shrink-0" />
            <span>Нейробіологічний та психологічний резонанс</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {contextText}
          </p>
        </div>

        {/* Grounding & Breath Focus */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/70 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <Wind className="w-3.5 h-3.5 shrink-0" />
              <span>Практика присутності</span>
            </div>
            <button
              type="button"
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              {isBreathingActive ? 'Зупинити дихання' : 'Дихальна пауза (4-4-4)'}
            </button>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            {practiceText}
          </p>

          {isBreathingActive && (
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full transition-all duration-1000 ${
                  breathPhase === 'inhale' 
                    ? 'bg-emerald-400 scale-125' 
                    : breathPhase === 'hold' 
                    ? 'bg-cyan-400 scale-100' 
                    : 'bg-teal-400 scale-75 opacity-60'
                }`} />
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wide">
                  {breathPhase === 'inhale' ? 'Вдих' : breathPhase === 'hold' ? 'Затримка' : 'Видих'}
                </span>
              </div>
              <span className="text-lg font-mono font-bold text-emerald-300">
                {breathSeconds}с
              </span>
            </div>
          )}
        </div>

        {/* Bottom Actions & Controls */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrev}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Попередня думка"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Наступна думка"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Скопіювати цитату"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenSavedCollection}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Скарбничка усвідомлень</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
