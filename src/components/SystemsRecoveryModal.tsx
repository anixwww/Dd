import React from 'react';
import { X, Activity, CheckCircle2 } from 'lucide-react';

interface SystemsRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  diffMs?: number;
}

export const SystemsRecoveryModal: React.FC<SystemsRecoveryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-zinc-900 border border-emerald-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/50 hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Відновлення систем організму</h3>
            <p className="text-sm text-zinc-400">Детальна динаміка регенерації органів і тканин</p>
          </div>
        </div>

        <div className="space-y-4 my-6">
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-emerald-400">Кровообіг та тиск</h4>
              <p className="text-xs text-zinc-400">Нормалізація пульсу та артеріального тиску</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-emerald-400">Дихальна система</h4>
              <p className="text-xs text-zinc-400">Очищення легенів та покращення об'єму кисню</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-emerald-400">Енергетичний баланс</h4>
              <p className="text-xs text-zinc-400">Відновлення мітохондріальної енергії та бадьорості</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold transition"
        >
          Зрозуміло
        </button>
      </div>
    </div>
  );
};
