import React from 'react';
import { X, Sliders, Check } from 'lucide-react';

interface IndicatorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IndicatorSettingsModal: React.FC<IndicatorSettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md p-5 rounded-3xl bg-zinc-900 border border-zinc-800 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold">Налаштування показників</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-zinc-400">
          Виберіть біопоказники та метрики, які відображаються на головному екрані.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs"
        >
          Зберегти
        </button>
      </div>
    </div>
  );
};
