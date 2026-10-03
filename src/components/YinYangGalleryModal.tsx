import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface YinYangGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const saveArtworkToStorage = (artwork: any) => {
  try {
    const saved = JSON.parse(localStorage.getItem('eden_artworks') || '[]');
    localStorage.setItem('eden_artworks', JSON.stringify([artwork, ...saved]));
  } catch (e) {
    console.error(e);
  }
};

export const YinYangGalleryModal: React.FC<YinYangGalleryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-zinc-900 border border-purple-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/50 hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Галерея Інь-Янь та малюнків</h3>
            <p className="text-sm text-zinc-400">Ваші творчі роботи та гармонійні візерунки</p>
          </div>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 text-center my-6">
          <p className="text-sm text-zinc-400">Тут зберігаються створені вами візерунки полотна Eden Pen та мандали.</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold transition"
        >
          Закрити
        </button>
      </div>
    </div>
  );
};
