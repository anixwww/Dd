import React from 'react';
import { X, Layout, Square, Maximize, CircleDot, Check, Sliders } from 'lucide-react';

interface IndicatorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayStyle: string;
  onSave: (style: string) => void;
}

export const IndicatorSettingsModal: React.FC<IndicatorSettingsModalProps> = ({
  isOpen,
  onClose,
  displayStyle,
  onSave,
}) => {
  if (!isOpen) return null;

  const styles = [
    { id: 'indicators', label: 'Класичні індикатори', icon: CircleDot },
    { id: 'small-tiles', label: 'Маленькі плитки', icon: Square },
    { id: 'medium-tiles', label: 'Середні плитки', icon: Square },
    { id: 'large-tiles', label: 'Великі плитки', icon: Maximize },
    { id: 'disk-3d', label: 'Дископодібне 3D обертове меню', icon: Layout },
    { id: 'sequential-one', label: 'По одному (по черзі)', icon: Layout },
    { id: 'ticker-marquee', label: 'Рядок, який біжить', icon: Layout },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#16161a] border border-[#2a2a32] w-full max-w-sm rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 text-white flex items-center justify-center shrink-0">
              <Sliders className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Вигляд індикаторів
              </h2>
              <p className="text-xs text-zinc-400">
                Стиль розташування на головній
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {styles.map((s) => (
            <button
              key={s.id}
              onClick={() => onSave(s.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                displayStyle === s.id
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-white font-bold'
                  : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <s.icon className={`w-4 h-4 ${displayStyle === s.id ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span className="text-xs font-semibold">{s.label}</span>
              {displayStyle === s.id && <Check className="w-4 h-4 text-emerald-400 ml-auto" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
