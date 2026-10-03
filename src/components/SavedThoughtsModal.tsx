import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Bookmark, Trash2, Share2, Check, Sparkles, BookOpen } from 'lucide-react';
import { SENTIENT_ANALYZER_THOUGHTS, SentientRandomThought } from '../data/analyzerThoughts';
import { CURATED_ANALYZER_THOUGHTS } from '../data/curatedAnalyzerThoughts';

interface SavedThoughtsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectThought?: (thought: SentientRandomThought) => void;
}

export const SavedThoughtsModal: React.FC<SavedThoughtsModalProps> = ({
  isOpen,
  onClose,
  onSelectThought,
}) => {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadSavedIds = () => {
    try {
      const raw = localStorage.getItem('quit-smoking:saved-analyzer-thoughts');
      const list: string[] = raw ? JSON.parse(raw) : [];
      setSavedIds(list);
    } catch {
      setSavedIds([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSavedIds();
    }
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  // Build combined map of all thoughts
  const allThoughtsMap = new Map<string, any>();
  CURATED_ANALYZER_THOUGHTS.forEach((t) => allThoughtsMap.set(t.id, t));
  SENTIENT_ANALYZER_THOUGHTS.forEach((t) => allThoughtsMap.set(t.id, t));

  const savedList = savedIds
    .map((id) => allThoughtsMap.get(id))
    .filter(Boolean);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = savedIds.filter((item) => item !== id);
      setSavedIds(updated);
      localStorage.setItem('quit-smoking:saved-analyzer-thoughts', JSON.stringify(updated));
      window.dispatchEvent(new Event('saved-thoughts-updated'));
    } catch {}
  };

  const handleCopy = (t: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(`«${t.text}» — Думка Аналізатора`);
      setCopiedId(t.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {}
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 bg-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-zinc-100 relative animate-in zoom-in-95 duration-200 select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-zinc-100">
              Скарбничка Усвідомлень
            </h3>
            <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
              {savedList.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        {savedList.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-zinc-300">
              Скарбничка порожня
            </div>
            <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
              Коли натрапиш на думку, яка відгукується чи допомагає втримати спокій — натисни іконку закладки, щоб зберегти її тут.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {savedList.map((item: any) => (
              <div
                key={item.id}
                onClick={() => {
                  if (onSelectThought) {
                    onSelectThought(item);
                    onClose();
                  }
                }}
                className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col gap-2 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-wider text-cyan-400/90 uppercase">
                    {item.categoryLabel || 'Усвідомлення'}
                  </span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => handleCopy(item, e)}
                      className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                      title="Скопіювати"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleRemove(item.id, e)}
                      className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
                      title="Видалити"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-medium text-zinc-200 leading-relaxed">
                  «{item.text}»
                </p>

                {item.insightContext && (
                  <p className="text-[11px] text-zinc-500 leading-snug line-clamp-2 pt-1 border-t border-zinc-800/50">
                    {item.insightContext}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
