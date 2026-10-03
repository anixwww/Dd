import React, { useState } from 'react';
import { X, Check, Palette, Trash2 } from 'lucide-react';
import { TIMER_STYLES, TimerStyleType, getTimerStyleCssClass } from './TimerStyles';

interface TimerSkinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStyle: TimerStyleType | string;
  onSelectStyle: (style: TimerStyleType | string) => void;
  previewTimeText: string;
}

const STORAGE_DELETED_SKINS_KEY = 'quit-smoking:deleted-timer-skins';
const LEGACY_STORAGE_HIDDEN_KEY = 'quit-smoking:hidden-timer-skins';

export const TimerSkinModal: React.FC<TimerSkinModalProps> = ({
  isOpen,
  onClose,
  currentStyle,
  onSelectStyle,
  previewTimeText,
}) => {
  const [deletedSkinIds, setDeletedSkinIds] = useState<string[]>(() => {
    try {
      const deletedRaw = localStorage.getItem(STORAGE_DELETED_SKINS_KEY);
      const hiddenRaw = localStorage.getItem(LEGACY_STORAGE_HIDDEN_KEY);
      const deleted = deletedRaw ? JSON.parse(deletedRaw) : [];
      const hidden = hiddenRaw ? JSON.parse(hiddenRaw) : [];
      const safeDeleted = Array.isArray(deleted) ? deleted : [];
      const safeHidden = Array.isArray(hidden) ? hidden : [];
      const combined = Array.from(new Set([...safeDeleted, ...safeHidden]));
      if (combined.length > 0) {
        localStorage.setItem(STORAGE_DELETED_SKINS_KEY, JSON.stringify(combined));
      }
      return combined;
    } catch {}
    return [];
  });

  if (!isOpen) return null;

  const handleDeleteSkin = (styleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.vibrate) {
      try { navigator.vibrate(25); } catch {}
    }
    const next = Array.from(new Set([...(Array.isArray(deletedSkinIds) ? deletedSkinIds : []), styleId]));
    setDeletedSkinIds(next);
    try {
      localStorage.setItem(STORAGE_DELETED_SKINS_KEY, JSON.stringify(next));
      localStorage.removeItem(LEGACY_STORAGE_HIDDEN_KEY);
    } catch {}

    if (currentStyle === styleId) {
      onSelectStyle('none');
    }
  };

  const safeDeletedIds = Array.isArray(deletedSkinIds) ? deletedSkinIds : [];
  const availableStyles = (Array.isArray(TIMER_STYLES) ? TIMER_STYLES : []).filter(
    (item) => item && item.id && !safeDeletedIds.includes(item.id)
  );

  const handleSelect = (styleId: TimerStyleType | string) => {
    onSelectStyle(styleId);
    if (navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch {}
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 select-none animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-[#18181f] w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl relative my-auto max-h-[85vh] flex flex-col text-zinc-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">
                Оболонки таймера
              </h3>
              <p className="text-[11px] text-zinc-500">
                Виберіть стиль лічильника
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800/60 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Grid of Skins */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-2.5">
            
            {/* Classic / None style */}
            {!safeDeletedIds.includes('none') && (
              <div
                onClick={() => handleSelect('none')}
                className={`group p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                  currentStyle === 'none'
                    ? 'bg-zinc-800/90 border-zinc-600 shadow-xs text-zinc-100'
                    : 'bg-zinc-900/60 hover:bg-zinc-800/40 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {currentStyle === 'none' ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-700 border border-zinc-600 text-zinc-200 flex items-center gap-1">
                        <Check className="w-3 h-3 text-zinc-300" />
                        <span>Активна</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-500 uppercase">
                        Стиль
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteSkin('none', e)}
                    className="p-1 rounded-md text-zinc-600 hover:text-zinc-300 opacity-40 group-hover:opacity-100 transition cursor-pointer"
                    title="Видалити"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="py-2 px-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-center flex items-center justify-center my-1 min-h-[36px]">
                  <span className="text-xs font-mono font-semibold text-zinc-200">
                    {previewTimeText || '10д 14г 32хв'}
                  </span>
                </div>

                <div className="mt-2 text-left pt-1 border-t border-zinc-800/60">
                  <div className="text-xs font-semibold text-zinc-200 truncate">Класичний</div>
                  <div className="text-[10px] text-zinc-500 truncate">Стандартний</div>
                </div>
              </div>
            )}

            {availableStyles.map((style) => {
              const isSelected = currentStyle === style.id;

              return (
                <div
                  key={style.id}
                  onClick={() => handleSelect(style.id)}
                  className={`group p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                    isSelected
                      ? 'bg-zinc-800/90 border-zinc-600 shadow-xs text-zinc-100'
                      : 'bg-zinc-900/60 hover:bg-zinc-800/40 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-700 border border-zinc-600 text-zinc-200 flex items-center gap-1">
                          <Check className="w-3 h-3 text-zinc-300" />
                          <span>Активна</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500 uppercase">
                          Стиль
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteSkin(style.id, e)}
                      className="p-1 rounded-md text-zinc-600 hover:text-zinc-300 opacity-40 group-hover:opacity-100 transition cursor-pointer"
                      title="Видалити"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="py-2 px-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-center flex items-center justify-center my-1 min-h-[36px]">
                    <span className={`text-xs font-mono font-semibold ${getTimerStyleCssClass(style.id)}`}>
                      {previewTimeText || style.preview || '10д 14г 32хв'}
                    </span>
                  </div>

                  <div className="mt-2 text-left pt-1 border-t border-zinc-800/60">
                    <div className="text-xs font-semibold text-zinc-200 truncate">{style.name}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{style.tag}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
