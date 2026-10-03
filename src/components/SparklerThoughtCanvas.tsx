import React from 'react';
import { Sparkles } from 'lucide-react';

interface SparklerProps {
  onClose?: () => void;
  active?: boolean;
  originCoords?: { x: number; y: number } | null;
  originXPercent?: number;
  originYPercent?: number;
  mode?: string;
}

export const SparklerThoughtCanvas: React.FC<SparklerProps> = ({ onClose }) => {
  return (
    <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 text-white text-center relative">
      <div className="flex items-center justify-center gap-2 mb-3 text-amber-400">
        <Sparkles className="w-5 h-5 animate-pulse" />
        <h4 className="font-semibold text-lg">Полотна бенгальських вогнів думок</h4>
      </div>
      <p className="text-sm text-zinc-400 mb-4">Інтерактивна іскриста візуалізація ваших потоків свідомості.</p>
      {onClose && (
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white transition"
        >
          Згорнути
        </button>
      )}
    </div>
  );
};
