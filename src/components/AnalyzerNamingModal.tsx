import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { AnimatedAnalyzerIcon } from './AnimatedAnalyzerIcon';

interface AnalyzerNamingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (newName: string) => void;
}

export const AnalyzerNamingModal: React.FC<AnalyzerNamingModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [currentName, setCurrentName] = useState<string>('Аналізатор');
  const [inputVal, setInputVal] = useState<string>('Аналізатор');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('quit-smoking:analyzer-name');
        const name = (saved && saved.trim()) ? saved.trim() : 'Аналізатор';
        setCurrentName(name);
        setInputVal(name);
        setSavedSuccess(false);
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (nameToSave?: string) => {
    const final = (nameToSave || inputVal).trim() || 'Аналізатор';
    try {
      localStorage.setItem('quit-smoking:analyzer-name', final);
      window.dispatchEvent(new CustomEvent('analyzer-name-changed', { detail: final }));
      window.dispatchEvent(new Event('storage'));
      if (navigator.vibrate) {
        try { navigator.vibrate([15, 40, 20]); } catch {}
      }
    } catch {}

    setCurrentName(final);
    setInputVal(final);
    setSavedSuccess(true);
    if (onSaved) onSaved(final);

    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-[#16161c] border border-zinc-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-zinc-100 animate-in zoom-in-95 duration-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle glowing ambient backdrop */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none opacity-20 bg-zinc-700 blur-2xl" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center shadow-xs">
              <AnimatedAnalyzerIcon className="w-4 h-4" active={true} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-zinc-100 tracking-wide">
                  Ім'я Аналізатора
                </h3>
              </div>
              <p className="text-[11px] text-zinc-400">
                Персоналізація імені супутника
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-zinc-800 cursor-pointer"
            title="Закрити"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2">
          <div className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-zinc-400" />
            <span>Як це виглядатиме:</span>
          </div>

          <div className="flex items-center justify-around gap-2 pt-1">
            {/* 1. Preview above flame/cloud */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] text-zinc-400">Над сферою:</span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-[11px] font-medium shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
                <span className="truncate max-w-[85px]">{inputVal.trim() || 'Аналізатор'}</span>
              </div>
            </div>

            {/* 2. Preview in bottom navigation tab */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] text-zinc-400">У нижній вкладці:</span>
              <div className="flex flex-col items-center gap-0.5 p-1 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300">
                <AnimatedAnalyzerIcon className="w-4 h-4" active={true} />
                <span className="text-[9px] font-bold truncate max-w-[65px]">
                  {inputVal.trim() || 'Аналізатор'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-3"
        >
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              Введіть нове ім'я:
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                maxLength={22}
                autoFocus
                placeholder="Введіть ім'я..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-zinc-950 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all font-medium"
              />
              {inputVal && (
                <button
                  type="button"
                  onClick={() => setInputVal('')}
                  className="absolute right-2.5 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-1 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 text-xs font-semibold transition-all shadow-xs active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Зберегти ім'я</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
