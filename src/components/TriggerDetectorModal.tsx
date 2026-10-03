import React, { useState } from 'react';
import { X, Brain, AlertTriangle, Save } from 'lucide-react';

interface TriggerDetectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TriggerDetectorModal: React.FC<TriggerDetectorModalProps> = ({ isOpen, onClose }) => {
  const [craving, setCraving] = useState(3);
  const [cause, setCause] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    // Logic to save trigger to localStorage
    const today = new Date().toISOString().split('T')[0];
    const savedDays = localStorage.getItem('quit-smoking:days');
    const daysMap = savedDays ? JSON.parse(savedDays) : {};
    
    if (!daysMap[today]) daysMap[today] = { surveys: [] };
    if (!daysMap[today].surveys) daysMap[today].surveys = [];

    daysMap[today].surveys.push({
      timestamp: new Date().toISOString(),
      craving,
      triggers: [cause],
      note,
    });

    localStorage.setItem('quit-smoking:days', JSON.stringify(daysMap));
    window.dispatchEvent(new Event('storage'));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121216] border border-rose-500/50 rounded-3xl p-6 w-full max-w-sm text-white shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" /> Детектор тяги
          </h2>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400">Рівень тяги (1-5)</label>
            <input type="range" min="1" max="5" value={craving} onChange={(e) => setCraving(Number(e.target.value))} className="w-full accent-rose-500" />
            <div className="text-center font-bold text-lg">{craving}</div>
          </div>
          
          <input type="text" placeholder="Причина (напр. стрес)" value={cause} onChange={(e) => setCause(e.target.value)} className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm" />
          <textarea placeholder="Нотатка" value={note} onChange={(e) => setNote(e.target.value)} className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm" />
          
          <button onClick={handleSave} className="w-full py-2 bg-rose-600 hover:bg-rose-500 rounded-xl font-bold flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Зафіксувати
          </button>
        </div>
      </div>
    </div>
  );
};
