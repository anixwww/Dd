import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MonoRefractedBotIcon } from './MonoRefractedStatsIcons';
import { 
  Bot, 
  Sparkles, 
  Send, 
  ChevronRight, 
  X, 
  Flame, 
  Coffee, 
  Zap, 
  Brain, 
  Wind, 
  CheckCircle2, 
  RotateCcw,
  Copy,
  Check,
  Clock
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AiCognitiveChatQuickWidgetProps {
  diffMs?: number;
  onOpenFullChat?: () => void;
  onSwitchToSos?: () => void;
}

export const AiCognitiveChatQuickWidget: React.FC<AiCognitiveChatQuickWidgetProps> = ({
  diffMs = 0,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('quit-smoking:sos-ai-chat-history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'msg_init',
        role: 'assistant',
        content: 'Привіт! Я твій когнітивний ШІ-психолог самодопомоги. 🧠\n\nЯкщо відчуваєш гостру тягу, тривогу чи нав\'язливі думки про сигарету — обери швидку тему або напиши, що зараз відбувається:',
        timestamp: Date.now()
      }
    ];
  });

  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCravingLogged, setIsCravingLogged] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Lock body scroll when modal is open on mobile
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen, messages]);

  useEffect(() => {
    try {
      sessionStorage.setItem('quit-smoking:sos-ai-chat-history', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const QUICK_PROMPTS = [
    {
      id: 'urgent_craving',
      icon: Flame,
      label: '🚨 Гостра тяга',
      prompt: 'У мене сильний напад тяги прямо зараз. Що зробити в перші 2 хвилини, щоб не зірватися?'
    },
    {
      id: 'stress',
      icon: Zap,
      label: '🤯 Стрес і нерви',
      prompt: 'Я на сильних нервах через стрес, здається, що сигарета заспокоїть. Поясни, чому це ілюзія і як заспокоїтися без неї?'
    },
    {
      id: 'habit',
      icon: Coffee,
      label: '☕ Звичка з кавою',
      prompt: 'Я щойно поїв або п\'ю каву, і руки автоматично тягнуться до сигарети. Як зламати цей тригер?'
    },
    {
      id: 'just_one',
      icon: Brain,
      label: '💭 «Лише одна»',
      prompt: 'Мій розум переконує мене: «від однієї затяжки нічого не буде». Розбий цю пастку CBT-аргументами.'
    },
    {
      id: 'breathe',
      icon: Wind,
      label: '🫁 60с дихання',
      prompt: 'Дай мені коротку 60-секундну дихальну техніку для швидкого зниження пульсу і тяги.'
    }
  ];

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      let diffDays = 1;
      let craving = 3;
      let anxiety = 2;

      try {
        const savedStart = localStorage.getItem('quit-smoking:start-date');
        if (savedStart) {
          const startMs = new Date(savedStart).getTime();
          diffDays = Math.max(1, Math.floor((Date.now() - startMs) / (1000 * 60 * 60 * 24)));
        } else if (diffMs > 0) {
          diffDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        }
      } catch {}

      try {
        const savedSlice = localStorage.getItem('quit-smoking:latest-slice');
        if (savedSlice) {
          const sl = JSON.parse(savedSlice);
          if (sl.craving) craving = sl.craving;
          if (sl.anxiety) anxiety = sl.anxiety;
        }
      } catch {}

      const res = await fetch('/api/sos/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          context: {
            diffDays,
            craving,
            anxiety,
            trigger: 'головний екран'
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: data.reply || 'Я поруч. Зроби повільний видих і пам\'ятай: хвиля тяги триває лише кілька хвилин.',
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('API failed');
      }
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: `Я з тобою. Зроби 3 повільних «фізіологічних зітхання» (два вдихи носом, плавний довгий видих ротом).\n\nТяга — це хвиля на 3–5 хвилин. Кожен ковток води і кожен глибокий видих повертають контроль до твоєї префронтальної кори.`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm('Очистити історію ШІ-чату?')) {
      const initial: ChatMessage[] = [
        {
          id: 'msg_init',
          role: 'assistant',
          content: 'Чат оновлено. Що ти відчуваєш просто зараз? Я готовий надати когнітивну пораду та підтримку.',
          timestamp: Date.now()
        }
      ];
      setMessages(initial);
      try {
        sessionStorage.removeItem('quit-smoking:sos-ai-chat-history');
      } catch {}
    }
  };

  const handleRecordSuccess = () => {
    try {
      const now = new Date();
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

      const saved = localStorage.getItem('quit-smoking:sos-crisis-log');
      const log = saved ? JSON.parse(saved) : [];
      const newEntry = {
        id: `crisis_${Date.now()}`,
        timestamp: Date.now(),
        dateStr,
        timeStr,
        protocolName: 'Когнітивний ШІ-чат',
        outcome: 'overcome'
      };
      localStorage.setItem('quit-smoking:sos-crisis-log', JSON.stringify([newEntry, ...log]));
      window.dispatchEvent(new Event('storage'));
      setIsCravingLogged(true);
      setTimeout(() => setIsCravingLogged(false), 3000);
    } catch {}
  };

  return (
    <div className="w-full max-w-md mx-auto px-3 mb-2.5 select-none">
      {/* Clickable Trigger on Main Screen */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full p-2.5 px-3.5 rounded-2xl bg-[#14141c]/90 hover:bg-[#1a1a24] border border-zinc-800/80 hover:border-zinc-700/80 shadow-xs flex items-center justify-between gap-3 text-left transition-all duration-200 cursor-pointer active:scale-[0.99] group backdrop-blur-md"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-200/15 via-zinc-400/5 to-zinc-950/60 border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-md flex items-center justify-center text-zinc-100 group-hover:border-white/40 group-hover:scale-105 transition-all shrink-0">
            <MonoRefractedBotIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-zinc-200 group-hover:text-white flex items-center gap-1.5 transition-colors">
              <span>ШІ-Чат</span>
              <span className="text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-md border border-indigo-500/40 bg-indigo-500/20 text-indigo-200 font-mono tracking-wider uppercase flex items-center gap-1 shadow-[0_0_8px_rgba(99,102,241,0.25)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-[0_0_5px_#34d399]" />
                <span>LIVE AI</span>
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 truncate mt-0.5">
              Самодопомога та розбір тяги онлайн
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold flex-none">
          <span className="text-[11px] hidden xs:inline opacity-80 font-medium">Чат</span>
        </div>
      </button>

      {/* Screen-optimized Centered Full-Size Chat Modal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[500] flex items-center justify-center sm:p-4 bg-black/90 sm:bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full h-full sm:w-full sm:max-w-2xl sm:h-[90vh] sm:max-h-[900px] flex flex-col sm:rounded-3xl bg-[#13121e]/98 border-none sm:border sm:border-indigo-500/35 shadow-2xl overflow-hidden text-zinc-100 backdrop-blur-2xl animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle background glow */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header Bar */}
            <div className="p-3.5 px-4 bg-gradient-to-r from-indigo-950/60 via-[#161427]/90 to-[#100f1c] border-b border-indigo-500/20 flex items-center justify-between gap-3 shrink-0 relative z-10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 shadow-xs">
                  <Bot className="w-4 h-4 text-indigo-300" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-zinc-100 truncate">
                      ШІ-Чат
                    </h3>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 shrink-0">
                      Gemini Live
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate">
                    CBT самодопомога та деескалація тяги
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-colors cursor-pointer"
                  title="Очистити чат"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Закрити"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Scenario Chips Bar */}
            <div className="p-2 px-3 bg-[#0d0c16]/90 border-b border-white/5 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
              {QUICK_PROMPTS.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => sendMessage(p.prompt)}
                    disabled={isLoading}
                    className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-indigo-500/15 border border-white/10 hover:border-indigo-500/30 text-[11px] font-medium text-zinc-300 hover:text-indigo-200 shrink-0 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    <Icon className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Messages Scroll Area (Flex-1) */}
            <div className="flex-1 p-3.5 sm:p-4 space-y-3.5 overflow-y-auto scroll-smooth text-left">
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
                  >
                    {!isUser && (
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed relative group ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-xs shadow-md'
                          : 'bg-[#1b192b] border border-indigo-500/20 text-zinc-200 rounded-tl-xs shadow-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans space-y-1">
                        {m.content}
                      </div>

                      {!isUser && (
                        <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(m.timestamp).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleCopy(m.id, m.content)}
                            className="opacity-70 hover:opacity-100 hover:text-white transition-opacity flex items-center gap-1 cursor-pointer"
                            title="Копіювати текст"
                          >
                            {copiedId === m.id ? (
                              <>
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                                <span className="text-emerald-400">Скопійовано</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-2.5 h-2.5" />
                                <span>Копіювати</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-2.5 justify-start animate-in fade-in duration-200">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-xs p-3 bg-[#1b192b] border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                    <span>ШІ аналізує когнітивну реакцію та готує відповідь...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Overcome Craving Action Bar */}
            <div className="p-2 px-3.5 bg-[#0f0e1a] border-t border-white/5 flex items-center justify-between gap-2 text-xs shrink-0">
              <span className="text-[11px] text-zinc-400">
                Вдалося перечекати тягу?
              </span>
              <button
                type="button"
                onClick={handleRecordSuccess}
                disabled={isCravingLogged}
                className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs border ${
                  isCravingLogged
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-300 active:scale-95'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isCravingLogged ? 'Зафіксовано в журналі!' : 'Я подолав тягу (+1)'}</span>
              </button>
            </div>

            {/* Input Form Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="p-3 bg-[#161426] border-t border-indigo-500/20 flex items-center gap-2 shrink-0 pb-safe"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Напиши, що ти відчуваєш або запитай пораду..."
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0c0b14] border border-zinc-700/70 focus:border-indigo-500 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-colors"
                autoFocus
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center justify-center shrink-0 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
