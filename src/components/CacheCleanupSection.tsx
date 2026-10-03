import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ShieldAlert,
  Sparkles,
  Check
} from 'lucide-react';

export const CacheCleanupSection: React.FC = () => {
  const [cacheSizeMb, setCacheSizeMb] = useState<string>('0.0 MB');
  const [keysCount, setKeysCount] = useState<number>(0);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [confirmFullReset, setConfirmFullReset] = useState<boolean>(false);

  const calculateStorage = async () => {
    try {
      let totalBytes = 0;
      let count = 0;

      // 1. LocalStorage & SessionStorage size
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          totalBytes += key.length + (localStorage.getItem(key)?.length || 0);
          count++;
        }
      }

      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          totalBytes += key.length + (sessionStorage.getItem(key)?.length || 0);
        }
      }

      // 2. StorageManager estimate
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        if (estimate.usage) {
          totalBytes = Math.max(totalBytes, estimate.usage);
        }
      }

      const mb = (totalBytes / (1024 * 1024)).toFixed(2);
      setCacheSizeMb(`${mb} MB`);
      setKeysCount(count);
    } catch {
      setCacheSizeMb('1.2 MB');
    }
  };

  useEffect(() => {
    calculateStorage();
  }, []);

  const handleSoftCacheClean = async () => {
    setIsClearing(true);
    setStatusMessage('Очищення тимчасового кешу...');

    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }

      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          await reg.unregister();
        }
      }

      const keysToClean = [
        'quit-smoking:cache-version',
        'quit-smoking:temp-buffer',
        'quit-smoking:offline-assets'
      ];
      keysToClean.forEach((k) => localStorage.removeItem(k));

      await calculateStorage();
      setIsClearing(false);
      setStatusMessage('Тимчасовий кеш успішно очищено');
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      setIsClearing(false);
      setStatusMessage('Помилка при очищенні кешу');
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const handleFullHardReset = async () => {
    setIsClearing(true);
    setStatusMessage('Повне скидання додатку...');

    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }

      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          await reg.unregister();
        }
      }

      if (window.indexedDB && (window.indexedDB as any).databases) {
        try {
          const dbs = await (window.indexedDB as any).databases();
          for (const db of dbs) {
            if (db.name) window.indexedDB.deleteDatabase(db.name);
          }
        } catch {}
      }

      sessionStorage.clear();
      localStorage.clear();

      try {
        document.cookie.split(';').forEach((c) => {
          document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
      } catch {}

      setStatusMessage('Всі дані скинуто. Перезапуск...');

      setTimeout(() => {
        window.location.replace(window.location.origin + window.location.pathname);
      }, 900);
    } catch {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace(window.location.origin + window.location.pathname);
    }
  };

  return (
    <div className="space-y-3 text-left">
      {/* Metric Card */}
      <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 flex items-center justify-center shrink-0">
            <HardDrive className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200">
              Обсяг кешу та памʼяті
            </div>
            <div className="text-[10px] text-zinc-400 font-normal">
              {keysCount} системних записів
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold font-mono text-zinc-100">
            {cacheSizeMb}
          </span>
        </div>
      </div>

      {statusMessage && (
        <div className="p-2.5 rounded-xl bg-zinc-850 border border-zinc-750 text-xs font-medium text-zinc-200 text-center animate-fadeIn flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-zinc-300" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Button 1: Soft Cache Clean */}
      <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/90 space-y-2">
        <div>
          <h4 className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Очистити кеш браузера</span>
          </h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-normal mt-0.5">
            Очищає тимчасові буфери та картинки. Таймер і статистика залишаються цілими.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSoftCacheClean}
          disabled={isClearing}
          className="w-full py-2 px-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-100 border border-zinc-700/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-zinc-300 ${isClearing ? 'animate-spin' : ''}`} />
          <span>Очистити тимчасовий кеш</span>
        </button>
      </div>

      {/* Button 2: Full Hard Reset */}
      <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/90 space-y-2">
        <div>
          <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Почати з чистого аркуша</span>
          </h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-normal mt-0.5">
            Повне видалення всіх даних і записів у браузері для перезапуску з нуля.
          </p>
        </div>

        {!confirmFullReset ? (
          <button
            type="button"
            onClick={() => setConfirmFullReset(true)}
            disabled={isClearing}
            className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-xl text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Скинути всі дані</span>
          </button>
        ) : (
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
              <ShieldAlert className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Скинути абсолютно всі дані?</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleFullHardReset}
                disabled={isClearing}
                className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-xs font-semibold border border-zinc-700 cursor-pointer transition-all active:scale-95"
              >
                Так, скинути
              </button>
              <button
                type="button"
                onClick={() => setConfirmFullReset(false)}
                className="py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-xl text-xs font-medium border border-zinc-800 cursor-pointer transition-all"
              >
                Скасувати
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
