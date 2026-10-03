import React from 'react';
import { Calendar, AlertTriangle, X, Clock } from 'lucide-react';

interface SetupModalProps {
  initialDateMs: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (dateMs: number) => void;
}

export const SetupModal: React.FC<SetupModalProps> = ({
  initialDateMs,
  isOpen,
  onClose,
  onSave
}) => {
  const toLocalInput = (ms: number) => {
    const d = new Date(ms);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [dateStr, setDateStr] = React.useState(toLocalInput(initialDateMs));
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    setDateStr(toLocalInput(initialDateMs));
    setError('');
  }, [initialDateMs, isOpen]);

  if (!isOpen) return null;

  const handleSetNow = () => {
    setDateStr(toLocalInput(Date.now()));
    setError('');
  };

  const handleSave = () => {
    if (!dateStr) {
      setError('Оберіть дату й час.');
      return;
    }
    const ms = new Date(dateStr).getTime();
    if (!isFinite(ms)) {
      setError('Некоректний формат дати.');
      return;
    }
    if (ms > Date.now() + 60000) {
      setError('Дата не може бути в майбутньому.');
      return;
    }
    onSave(ms);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-[#18181b] border border-[#2d2d35] rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Час останньої сигарети
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Від цієї миті розраховується точний час регенерації органів, врятовані гроші та зернятка дерев.
        </p>

        <div>
          <input
            type="datetime-local"
            value={dateStr}
            max={toLocalInput(Date.now())}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full text-xs font-mono p-2.5 bg-black/40 border border-[#2d2d35] rounded-xl text-white outline-none focus:border-slate-400 transition-colors"
          />
          {error && <p className="text-xs text-rose-500 mt-1.5">{error}</p>}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={handleSetNow}
            className="py-2.5 px-3 border border-[#2d2d35] rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 cursor-pointer transition-colors"
          >
            Прямо зараз
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
          >
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
};

interface RelapseModalProps {
  isOpen: boolean;
  currentStart: number;
  onClose: () => void;
  onConfirmRelapse: (whenMs: number, note: string) => void;
}

export const RelapseModal: React.FC<RelapseModalProps> = ({
  isOpen,
  currentStart,
  onClose,
  onConfirmRelapse
}) => {
  const toLocalInput = (ms: number) => {
    const d = new Date(ms);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [whenStr, setWhenStr] = React.useState(toLocalInput(Date.now()));
  const [note, setNote] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    setWhenStr(toLocalInput(Date.now()));
    setNote('');
    setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!whenStr) {
      setError('Вкажіть час.');
      return;
    }
    const whenMs = new Date(whenStr).getTime();
    if (!isFinite(whenMs)) {
      setError('Некоректний формат часу.');
      return;
    }
    if (whenMs < currentStart) {
      setError('Час зриву не може бути раніше, ніж поточний старт.');
      return;
    }
    if (whenMs > Date.now() + 60000) {
      setError('Час не може бути в майбутньому.');
      return;
    }

    onConfirmRelapse(whenMs, note.trim() || 'Зрив. Досвід враховано, продовжую шлях.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-[#18181b] border border-[#2d2d35] rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Фіксація зриву
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Це не поразка, а досвід. Ваш попередній період чистих днів збережеться в загальній історії, а таймер перезапуститься.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Коли це сталося:
            </label>
            <input
              type="datetime-local"
              value={whenStr}
              max={toLocalInput(Date.now())}
              onChange={(e) => setWhenStr(e.target.value)}
              className="w-full text-xs font-mono p-2.5 bg-black/40 border border-[#2d2d35] rounded-xl text-white outline-none focus:border-slate-400 transition-colors"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">
              Що спровокувало (нотатка для аналізу):
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Наприклад: Стрес на роботі, алкоголь у компанії..."
              rows={2}
              className="w-full text-xs p-2.5 bg-black/40 border border-[#2d2d35] rounded-xl text-white outline-none focus:border-slate-400 resize-none transition-colors"
            />
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-3 border border-[#2d2d35] rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
          >
            Скасувати
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
          >
            Почати заново
          </button>
        </div>
      </div>
    </div>
  );
};
