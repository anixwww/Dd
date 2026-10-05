import React, { useState } from 'react';
import { Sparkles, X, Heart, Flame, Shield, Compass } from 'lucide-react';

export type MotivationStyle = 'stoic' | 'medical' | 'mindful' | 'warrior';

interface MotivationalPhrasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveStyle?: (style: MotivationStyle) => void;
}

export const MotivationalPhrasesModal: React.FC<MotivationalPhrasesModalProps> = ({
  isOpen,
  onClose,
  onSaveStyle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md p-5 rounded-3xl bg-zinc-900 border border-zinc-800 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold">Стиль мотивації</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-zinc-400">
          Оберіть тон та філософію щоденних мотиваційних повідомлень.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => { onSaveStyle?.('stoic'); onClose(); }}
            className="p-3 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700 text-left space-y-1"
          >
            <div className="text-xs font-bold text-amber-300">Стоїцизм</div>
            <div className="text-[10px] text-zinc-400">Сила духу, витримка, розум</div>
          </button>
          <button
            onClick={() => { onSaveStyle?.('medical'); onClose(); }}
            className="p-3 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700 text-left space-y-1"
          >
            <div className="text-xs font-bold text-teal-300">Науковий</div>
            <div className="text-[10px] text-zinc-400">Біохімія, факти, регенерація</div>
          </button>
        </div>
      </div>
    </div>
  );
};
