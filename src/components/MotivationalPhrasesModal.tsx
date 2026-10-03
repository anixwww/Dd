import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  Quote,
  Sparkles
} from 'lucide-react';

export type MotivationStyle = 'quote' | 'card' | 'neon' | 'kraft' | 'ticker';

interface MotivationalPhrasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  reasons: string[];
  onSaveReasons: (newReasons: string[]) => void;
  currentStyle?: MotivationStyle;
  onStyleChange?: (style: MotivationStyle) => void;
  autoRotate?: boolean;
  onAutoRotateChange?: (autoRotate: boolean) => void;
  accent?: string;
}

export const MotivationalPhrasesModal: React.FC<MotivationalPhrasesModalProps> = ({
  isOpen,
  onClose,
  reasons,
  onSaveReasons
}) => {
  const [phrases, setPhrases] = useState<string[]>(reasons);
  const [newPhraseText, setNewPhraseText] = useState<string>('');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // Sync state when modal opens or reasons prop changes
  useEffect(() => {
    if (isOpen) {
      setPhrases(reasons);
      setEditingIdx(null);
      setNewPhraseText('');
    }
  }, [isOpen, reasons]);

  if (!isOpen) return null;

  // Add Phrase
  const handleAddPhrase = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPhraseText.trim();
    if (!trimmed) return;

    const updated = [trimmed, ...phrases];
    setPhrases(updated);
    onSaveReasons(updated);
    try {
      localStorage.setItem('quit-smoking:reasons', JSON.stringify(updated));
    } catch {}
    setNewPhraseText('');
  };

  // Delete Phrase
  const handleDeletePhrase = (indexToDelete: number) => {
    const updated = phrases.filter((_, idx) => idx !== indexToDelete);
    setPhrases(updated);
    onSaveReasons(updated);
    try {
      localStorage.setItem('quit-smoking:reasons', JSON.stringify(updated));
    } catch {}
    if (editingIdx === indexToDelete) {
      setEditingIdx(null);
    }
  };

  // Save Phrase Edit
  const handleSaveEdit = (indexToEdit: number) => {
    const trimmed = editingText.trim();
    if (!trimmed) return;

    const updated = phrases.map((text, idx) => (idx === indexToEdit ? trimmed : text));
    setPhrases(updated);
    onSaveReasons(updated);
    try {
      localStorage.setItem('quit-smoking:reasons', JSON.stringify(updated));
    } catch {}
    setEditingIdx(null);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-fadeIn p-4">
      <div className="bg-[#16161a] border border-[#2a2a32] rounded-3xl p-5 sm:p-6 w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl transition-transform duration-300 animate-slideUp overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 text-white flex items-center justify-center shrink-0">
              <Quote className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-1.5">
                <span>Мотиваційні цитати</span>
                <span className="text-xs font-mono font-bold text-amber-400">({phrases.length})</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Ваші особисті причини та натхнення
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
            title="Закрити"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAddPhrase} className="mb-3.5 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={newPhraseText}
              onChange={(e) => setNewPhraseText(e.target.value)}
              placeholder="Введіть власну мотиваційну фразу..."
              className="flex-1 text-xs p-2.5 bg-black/40 border border-[#2a2a32] rounded-xl text-white placeholder-zinc-500 outline-none focus:border-zinc-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!newPhraseText.trim()}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Додати</span>
            </button>
          </div>
        </form>

        {/* Phrases List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {phrases.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs">
              <p>Список порожній. Додайте свою першу мотиваційну фразу вище.</p>
            </div>
          ) : (
            phrases.map((text, idx) => (
              <div
                key={idx}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-start justify-between gap-2.5 hover:border-white/20 transition-all group"
              >
                {editingIdx === idx ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-1 text-xs p-2 bg-black/50 border border-[#2a2a32] rounded-xl text-white outline-none focus:border-zinc-400 font-medium"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(idx)}
                      className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs cursor-pointer shadow-xs"
                      title="Зберегти"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIdx(null)}
                      className="p-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl text-xs cursor-pointer"
                      title="Скасувати"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-white leading-relaxed flex-1 font-medium">
                      "{text}"
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingIdx(idx);
                          setEditingText(text);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                        title="Редагувати"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePhrase(idx)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 cursor-pointer transition-colors"
                        title="Видалити"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3.5 border-t border-white/10 mt-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
          >
            Готово
          </button>
        </div>

      </div>
    </div>
  );
};
