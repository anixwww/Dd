import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Waves, Home, LifeBuoy } from 'lucide-react';

interface SosCravingTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCravingOver?: () => void;
  onVictory?: () => void;
  onGoToHome?: () => void;
  onOpenFullSos?: () => void;
}

export const SosCravingTimerModal: React.FC<SosCravingTimerModalProps> = ({
  isOpen,
  onClose,
  onCravingOver,
  onVictory,
  onGoToHome,
  onOpenFullSos
}) => {
  const [secondsLeft, setSecondsLeft] = useState(180);

  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(180);
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const handleVictory = () => {
    onVictory?.();
    onCravingOver?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[750] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md p-6 rounded-3xl bg-zinc-900 border border-indigo-500/40 text-white text-center space-y-4 shadow-2xl">
        <div className="flex justify-end">
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <Waves className="w-10 h-10 text-indigo-400 mx-auto animate-pulse" />
        <h3 className="text-base font-bold">Хвиля тяги спадає</h3>
        <div className="text-4xl font-black font-mono text-indigo-300">
          {mins}:{secs < 10 ? `0${secs}` : secs}
        </div>
        <p className="text-xs text-zinc-400">
          Пік тяги триває лише 3 хвилини. Зроби повільний глибокий вдих і видих.
        </p>
        <button
          onClick={handleVictory}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs cursor-pointer transition-colors shadow-lg"
        >
          Тяга минула! 🏆
        </button>
        <div className="flex gap-2 pt-1">
          {onOpenFullSos && (
            <button
              onClick={onOpenFullSos}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>ШІ-чат SOS</span>
            </button>
          )}
          {onGoToHome && (
            <button
              onClick={onGoToHome}
              className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>На головну</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
