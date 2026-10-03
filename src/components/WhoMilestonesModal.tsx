import React from 'react';
import { X, Award } from 'lucide-react';

interface WhoMilestonesModalProps {
  isOpen: boolean;
  onClose: () => void;
  diffMs?: number;
}

export const WhoMilestonesModal: React.FC<WhoMilestonesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/50 hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Етапи одужання за ВООЗ</h3>
            <p className="text-sm text-zinc-400">Ключові віхи відновлення здоров'я організму</p>
          </div>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 text-center my-6">
          <p className="text-sm text-zinc-400">Усі етапи одужання згідно з офіційними рекомендаціями Всесвітньої організації охорони здоров'я.</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold transition"
        >
          Закрити
        </button>
      </div>
    </div>
  );
};
