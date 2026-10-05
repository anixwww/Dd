import React from 'react';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[800] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="w-full max-w-md p-6 rounded-3xl bg-zinc-900 border border-emerald-500/40 text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold">Ласкаво просимо до NoSmo!</h2>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Твій персональний помічник для повного звільнення від нікотину. Використовуй розумні трекери, швидку допомогу SOS та ШІ-аналіз стану для легкого прогресу.
        </p>
        <button
          onClick={() => {
            onComplete();
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
        >
          <span>Розпочати шлях</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
