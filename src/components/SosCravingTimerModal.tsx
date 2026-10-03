import React from 'react';
import { X, Clock } from 'lucide-react';

interface SosCravingTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVictory?: () => void;
  onGoToHome?: () => void;
  onOpenFullSos?: () => void;
}

export const SosCravingTimerModal: React.FC<SosCravingTimerModalProps> = ({ isOpen, onClose, onVictory }) => {
  const [timeLeft, setTimeLeft] = React.useState(300); // 5 mins
  const [isRunning, setIsRunning] = React.useState(true);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onVictory?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, isRunning, timeLeft, onVictory]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/50 hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Екстрена пауза тяги</h3>
            <p className="text-sm text-zinc-400">Перечекайте гострий імпульс протягом 5 хвилин</p>
          </div>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-8 text-center my-6">
          <div className="text-5xl font-extrabold font-mono tracking-wider text-amber-400 mb-2">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <p className="text-xs text-zinc-400">Імпульси зазвичай слабшають і зникають за 5-10 хвилин</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold transition"
          >
            {isRunning ? 'Пауза' : 'Продовжити'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition"
          >
            Закінчити
          </button>
        </div>
      </div>
    </div>
  );
};
