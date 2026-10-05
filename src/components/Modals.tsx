import React, { useState } from 'react';
import { X, AlertTriangle, Calendar, Settings } from 'lucide-react';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (newDateMs: number) => void;
  initialDateMs?: number;
}

export const SetupModal: React.FC<SetupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDateMs = Date.now()
}) => {
  const d = new Date(initialDateMs);
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const [dateStr, setDateStr] = useState(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  const [timeStr, setTimeStr] = useState(`${pad(d.getHours())}:${pad(d.getMinutes())}`);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hours, minutes] = timeStr.split(':').map(Number);
      const target = new Date(year, month - 1, day, hours || 0, minutes || 0);
      const ms = target.getTime();
      if (!isNaN(ms)) {
        onSave?.(ms);
      }
    } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md p-6 rounded-3xl bg-zinc-900 border border-zinc-800 text-white space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold">Дата та час останньої сигарети</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Дата відмови</label>
            <input 
              type="date" 
              value={dateStr} 
              onChange={e => setDateStr(e.target.value)} 
              className="w-full p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Точний час</label>
            <input 
              type="time" 
              value={timeStr} 
              onChange={e => setTimeStr(e.target.value)} 
              className="w-full p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-white"
            />
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm transition-colors cursor-pointer"
        >
          Зберегти дату
        </button>
      </div>
    </div>
  );
};

interface RelapseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRelapse: (reason: string) => void;
  currentStart?: number;
}

export const RelapseModal: React.FC<RelapseModalProps> = ({
  isOpen,
  onClose,
  onConfirmRelapse,
  currentStart
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md p-6 rounded-3xl bg-zinc-900 border border-rose-500/40 text-white space-y-4 shadow-2xl">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-base font-bold">Скидання лічильника</h3>
        </div>
        <p className="text-xs text-zinc-300">
          Зрив — це не поразка, а досвід. Зафіксуйте причину, щоб уникнути її наступного разу.
        </p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Що спровокувало зрив? (стрес, алкоголь, тригер...)"
          className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-xs min-h-[80px] text-white"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700 transition-colors">
            Скасувати
          </button>
          <button 
            onClick={() => {
              onConfirmRelapse(reason || 'Не вказано');
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs transition-colors cursor-pointer"
          >
            Почати заново
          </button>
        </div>
      </div>
    </div>
  );
};
