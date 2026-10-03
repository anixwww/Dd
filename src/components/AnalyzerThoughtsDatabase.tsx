import React, { useState, useMemo } from 'react';
import { 
  SENTIENT_ANALYZER_THOUGHTS, 
  THOUGHT_CATEGORIES_METADATA, 
  SentientRandomThought, 
  ThoughtCategory,
  getInterleavedThoughtStream,
  matchesCategory
} from '../data/analyzerThoughts';
const RefractedCategoryIcon: React.FC<{ category?: string; className?: string }> = ({ category, className }) => {
  switch (category) {
    case 'health_advice': return <Heart className={className} />;
    case 'app_guide': return <Smartphone className={className} />;
    case 'science': return <Atom className={className} />;
    case 'nature_wildlife':
    case 'nature': return <Leaf className={className} />;
    case 'subtle_mundane':
    case 'mundane': return <Moon className={className} />;
    case 'poetic': return <Feather className={className} />;
    case 'absurd': return <Sparkles className={className} />;
    case 'jokes':
    case 'humor': return <Smile className={className} />;
    case 'hidden_coziness':
    case 'unobvious': return <Brain className={className} />;
    default: return <Sparkles className={className} />;
  }
};
import { BotanicalCurlyBracket } from './AnalyzerTip';
import { 
  Brain, 
  Search, 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  Filter, 
  Shuffle, 
  ExternalLink,
  ChevronDown,
  Volume2,
  MessageSquare,
  MessageSquareOff,
  Heart,
  Smartphone,
  Feather,
  Smile,
  Atom,
  Leaf,
  Moon,
  HelpCircle
} from 'lucide-react';

interface AnalyzerThoughtsDatabaseProps {
  onClose?: () => void;
}

export const AnalyzerThoughtsDatabase: React.FC<AnalyzerThoughtsDatabaseProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<ThoughtCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTestThoughtId, setActiveTestThoughtId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(30);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [phrasesDisabled, setPhrasesDisabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:analyzer-disable-phrases') === 'true';
    } catch {
      return false;
    }
  });

  // Standard font size matching words from dialogues (10px default or saved size)
  const [thoughtFontSize, setThoughtFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:analyzer-thought-font-size');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 3) return val;
      }
    } catch {}
    return 12;
  });

  React.useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('quit-smoking:analyzer-thought-font-size');
        if (saved) {
          const val = parseInt(saved, 10);
          if (!isNaN(val) && val >= 3) setThoughtFontSize(val);
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('analyzer-font-size-change', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('analyzer-font-size-change', handleStorageChange);
    };
  }, []);

  const togglePhrasesDisabled = () => {
    const nextVal = !phrasesDisabled;
    setPhrasesDisabled(nextVal);
    try {
      localStorage.setItem('quit-smoking:analyzer-disable-phrases', String(nextVal));
      window.dispatchEvent(new Event('analyzer-phrases-toggle'));
      showToast(nextVal ? 'Появу фраз під Аналізатором вимкнено' : 'Появу фраз під Аналізатором увімкнено');
    } catch {}
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter thoughts by category & search query (uses interleaved stream for 'all')
  const filteredThoughts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const source = selectedCategory === 'all' ? getInterleavedThoughtStream() : SENTIENT_ANALYZER_THOUGHTS;
    return source.filter((item) => {
      const matchCat = matchesCategory(item.category, selectedCategory);
      const matchQuery = !q || item.text.toLowerCase().includes(q) || item.categoryLabel.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = (item: SentientRandomThought) => {
    try {
      navigator.clipboard.writeText(item.text);
      setCopiedId(item.id);
      showToast('Текст думки скопійовано');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Не вдалося скопіювати текст');
    }
  };

  const handleTestInAnalyzer = (item: SentientRandomThought) => {
    setActiveTestThoughtId(item.id);
    try {
      if (navigator.vibrate) navigator.vibrate(20);
      window.dispatchEvent(new CustomEvent('analyzer-force-trigger-thought', {
        detail: { thought: item }
      }));
      showToast('Думку надіслано в Аналізатор');
    } catch {}
    setTimeout(() => setActiveTestThoughtId(null), 2500);
  };

  const handlePickRandom = () => {
    if (filteredThoughts.length === 0) return;
    const rIdx = Math.floor(Math.random() * filteredThoughts.length);
    const item = filteredThoughts[rIdx];
    handleTestInAnalyzer(item);
  };

  const categoriesList: { id: ThoughtCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: `Усі думки (${SENTIENT_ANALYZER_THOUGHTS.length})`, count: SENTIENT_ANALYZER_THOUGHTS.length },
    { id: 'health_advice', label: 'Поради та здоровʼя', count: SENTIENT_ANALYZER_THOUGHTS.filter(t => matchesCategory(t.category, 'health_advice')).length },
    { id: 'app_guide', label: 'Інструкції та підказки', count: SENTIENT_ANALYZER_THOUGHTS.filter(t => matchesCategory(t.category, 'app_guide')).length },
    { id: 'humor', label: 'Гумор та жарти', count: SENTIENT_ANALYZER_THOUGHTS.filter(t => matchesCategory(t.category, 'humor')).length },
    { id: 'nature', label: 'Світ природи', count: SENTIENT_ANALYZER_THOUGHTS.filter(t => matchesCategory(t.category, 'nature')).length },
    { id: 'mundane', label: 'Буденні спостереження', count: SENTIENT_ANALYZER_THOUGHTS.filter(t => matchesCategory(t.category, 'mundane')).length },
    { id: 'unobvious', label: 'Неочевидні спостереження', count: SENTIENT_ANALYZER_THOUGHTS.filter(t => matchesCategory(t.category, 'unobvious')).length },
    { id: 'science', label: 'Наукові факти', count: SENTIENT_ANALYZER_THOUGHTS.filter(t => matchesCategory(t.category, 'science')).length },
    { id: 'absurd', label: 'Абсурдні фрази', count: SENTIENT_ANALYZER_THOUGHTS.filter(t => matchesCategory(t.category, 'absurd')).length },
    { id: 'poetic', label: 'Поетичні фрази', count: SENTIENT_ANALYZER_THOUGHTS.filter(t => matchesCategory(t.category, 'poetic')).length },
  ];

  return (
    <div className="flex flex-col w-full h-full text-zinc-100 select-none space-y-3.5">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-zinc-800 text-zinc-100 border border-zinc-700/80 font-bold text-xs tracking-wide shadow-2xl animate-bounce flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-zinc-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Toggle Control: Disable/Enable phrase under Analyzer */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-3 shadow-xs shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            phrasesDisabled ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-800 text-zinc-200 border border-zinc-700/50'
          }`}>
            {phrasesDisabled ? <MessageSquareOff className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-zinc-200 truncate">
                Поява фрази під Аналізатором
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shrink-0 ${
                !phrasesDisabled
                  ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  : 'bg-zinc-900/40 text-zinc-500 border border-zinc-800'
              }`}>
                {!phrasesDisabled ? 'Вкл' : 'Викл'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
              {!phrasesDisabled
                ? 'Аналізатор показує підказки та спонтанні думки під своєю сферою'
                : 'Появу авто-фраз під Аналізатором вимкнено'}
            </p>
          </div>
        </div>

        {/* Switch toggle */}
        <button
          type="button"
          onClick={togglePhrasesDisabled}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            !phrasesDisabled ? 'bg-zinc-700' : 'bg-zinc-800'
          }`}
          role="switch"
          aria-checked={!phrasesDisabled}
          title={!phrasesDisabled ? 'Вимкнути фразу під Аналізатором' : 'Увімкнути фразу під Аналізатором'}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-zinc-200 shadow-xs ring-0 transition duration-200 ease-in-out ${
              !phrasesDisabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Search & Actions Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(30);
            }}
            placeholder="Пошук думок за словом або емодзі..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-zinc-950/40 border border-zinc-800/80 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Random Thought Generator Button */}
        <button
          type="button"
          onClick={handlePickRandom}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold border border-zinc-700/60 text-xs tracking-wide transition cursor-pointer active:scale-95 flex items-center justify-center gap-2 shrink-0"
          title="Обрати та проговорити випадкову думку"
        >
          <Shuffle className="w-4 h-4" />
          <span>Випадкова думка</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 no-scrollbar shrink-0">
        {categoriesList.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setVisibleCount(30);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-200 shadow-xs'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {cat.id !== 'all' ? (
                <RefractedCategoryIcon category={cat.id} className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              )}
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${isActive ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-950/40 text-zinc-600'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Subheader */}
      <div className="flex items-center justify-between text-xs text-zinc-500 mb-2 px-1 shrink-0">
        <span>Знайдено: <strong className="text-zinc-300 font-mono font-bold">{filteredThoughts.length}</strong> думок</span>
        {selectedCategory !== 'all' && (
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className="text-zinc-400 hover:underline cursor-pointer font-medium"
          >
            Скинути фільтр
          </button>
        )}
      </div>

      {/* List of Thought Cards */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
        {filteredThoughts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500 space-y-2">
            <Brain className="w-8 h-8 text-zinc-700 animate-pulse" />
            <p className="text-xs font-medium">База думок порожня.</p>
          </div>
        ) : (
          filteredThoughts.slice(0, visibleCount).map((item) => {
            const isTestActive = activeTestThoughtId === item.id;
            const isCopied = copiedId === item.id;
            const meta = THOUGHT_CATEGORIES_METADATA[item.category];

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900/80 border transition-all duration-200 group flex flex-col justify-between gap-2.5 relative ${
                  isTestActive
                    ? 'border-zinc-600 bg-zinc-800/20 shadow-xs'
                    : 'border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Category & Emoji Badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <RefractedCategoryIcon category={item.category} className="w-4 h-4 shrink-0 drop-shadow-[0_0_6px_rgba(255,253,208,0.5)]" />
                    <span 
                      className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border backdrop-blur-xs text-zinc-300 flex items-center gap-1.5"
                      style={{
                        borderColor: meta?.glowColor ? meta.glowColor.replace('0.95', '0.4') : 'rgba(255,255,255,0.2)',
                        backgroundColor: meta?.glowColor ? meta.glowColor.replace('0.95', '0.12') : 'rgba(255,255,255,0.05)'
                      }}
                    >
                      {meta?.label || item.categoryLabel}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleCopy(item)}
                      className={`p-1.5 rounded-xl border transition cursor-pointer ${
                        isCopied
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                          : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                      }`}
                      title="Скопіювати текст"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTestInAnalyzer(item)}
                      className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold tracking-wide transition cursor-pointer flex items-center gap-1.5 ${
                        isTestActive
                          ? 'bg-zinc-700 text-zinc-100 border-zinc-600 shadow-xs'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                      }`}
                      title="Озвучити цю думку в Аналізаторі"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>В Аналізатор</span>
                    </button>
                  </div>
                </div>

                 {/* Thought Text */}
                <p 
                  className="text-zinc-200 leading-relaxed font-medium pl-1 transition-all"
                  style={{ fontSize: `${thoughtFontSize}px` }}
                >
                  «{item.text}»
                </p>

                {/* Theme-Specific Ornamental Botanical Line Bracket */}
                <BotanicalCurlyBracket
                  color={meta?.glowColor ? meta.glowColor.replace('0.95', '0.85') : '#e4e4e7'}
                  glow={meta?.glowColor ? `0 0 6px ${meta.glowColor.replace('0.95', '0.5')}` : 'none'}
                  isVisible={true}
                  category={item.category}
                />
              </div>
            );
          })
        )}

        {/* Load More Button */}
        {visibleCount < filteredThoughts.length && (
          <div className="pt-2 pb-4 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 40)}
              className="px-6 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs tracking-wider transition cursor-pointer border border-zinc-700/60 active:scale-95 flex items-center gap-2"
            >
              <ChevronDown className="w-4 h-4" />
              <span>Показати ще ({filteredThoughts.length - visibleCount})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
