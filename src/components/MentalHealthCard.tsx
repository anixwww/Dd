import React from 'react';
import { Smile, Brain, Heart, Sparkles } from 'lucide-react';

interface MentalHealthCardProps {
  onClose?: () => void;
}

export const MentalHealthCard: React.FC<MentalHealthCardProps> = ({ onClose }) => {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-zinc-900/60 to-zinc-950/90 border border-indigo-500/30 text-white space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold">Психоемоційний баланс</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-xs text-zinc-400 hover:text-white">✕</button>
        )}
      </div>
      <p className="text-xs text-zinc-300">
        Твоя дофамінова система відновлює природні рецептори задоволення. Кожен день без нікотину знижує рівень кортизолу (гормону стресу).
      </p>
    </div>
  );
};
