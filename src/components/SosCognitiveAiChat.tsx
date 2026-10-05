import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, RefreshCw, X, AlertCircle } from 'lucide-react';
import { useAiStatus, reportAiSuccess, reportAiQuotaLimit } from '../utils/aiStatusManager';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface SosCognitiveAiChatProps {
  onClose?: () => void;
  diffDays?: number;
}

export const SosCognitiveAiChat: React.FC<SosCognitiveAiChatProps> = ({ onClose, diffDays = 1 }) => {
  const { badgeText, badgeClasses, dotClasses, tooltipText } = useAiStatus();
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:sos-ai-chat-history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: '1',
        role: 'assistant',
        content: `Привіт! Я твій когнітивний ШІ-психолог самодопомоги. 🧠\n\nЯкщо відчуваєш гостру тягу, тривогу чи нав'язливі думки про сигарету — обери швидку тему або опиши свій стан:`,
        timestamp: Date.now()
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    try {
      localStorage.setItem('quit-smoking:sos-ai-chat-history', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: String(Date.now()),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/sos/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          diffDays,
          craving: 4
        })
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.reply || 'Зроби 3 повільних видихи. Ця хвиля гарантовано спаде за кілька хвилин.';
        setMessages(prev => [
          ...prev,
          {
            id: String(Date.now() + 1),
            role: 'assistant',
            content: reply,
            timestamp: Date.now()
          }
        ]);
        if (data.isLiveAi) {
          reportAiSuccess();
        } else {
          reportAiQuotaLimit();
        }
      } else {
        throw new Error('API limit');
      }
    } catch {
      reportAiQuotaLimit();
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: '💡 **CBT Підтримка:** Тяга — це лише тимчасова біохімічна хвиля. Вона досягає піку за 3 хвилини і спадає. Випий 250 мл води і зроби повільний видих 4-7-8.',
          timestamp: Date.now()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#13121e] text-white rounded-3xl border border-purple-500/30 overflow-hidden">
      {/* Header */}
      <div className="p-3 px-4 bg-[#1a1829] border-b border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-400" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold">Когнітивний ШІ-чат</span>
              <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border flex items-center gap-1 ${badgeClasses}`} title={tooltipText}>
                <span className={`w-1.5 h-1.5 rounded-full ${dotClasses}`} />
                <span>{badgeText}</span>
              </span>
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-line leading-relaxed ${
              m.role === 'user' ? 'bg-purple-600 text-white rounded-tr-xs' : 'bg-zinc-800/90 text-zinc-200 border border-zinc-700/60 rounded-tl-xs'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-2.5 rounded-2xl bg-zinc-800/90 border border-purple-500/30 text-purple-300 flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>ШІ готує відповідь...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2 bg-zinc-900/60 border-t border-zinc-800 flex gap-1.5 overflow-x-auto no-scrollbar">
        {['Сильна тяга', 'Тривога і стрес', 'Сумнів: "лише одна"', 'Дихальна техніка'].map(t => (
          <button
            key={t}
            onClick={() => handleSend(t)}
            className="px-2.5 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] whitespace-nowrap border border-zinc-700/60 transition-colors"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-2.5 bg-[#171624] border-t border-purple-500/20 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Напишіть свої думки чи відчуття..."
          className="flex-1 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="p-2 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
