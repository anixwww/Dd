import { useState, useEffect } from 'react';

export type AiStatus = 'active' | 'limited' | 'offline';

export interface AiStatusInfo {
  status: AiStatus;
  isLiveAi: boolean;
  label: string;
  badgeText: string;
  tooltipText: string;
}

const STORAGE_KEY = 'quit-smoking:ai-status';
const EVENT_NAME = 'ai-status-change';

// Get initial cached status
export const getStoredAiStatus = (): AiStatus => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'limited' || saved === 'offline' || saved === 'active') {
      return saved;
    }
  } catch {}
  return 'active';
};

// Set stored status and broadcast across window
export const setStoredAiStatus = (status: AiStatus): void => {
  try {
    localStorage.setItem(STORAGE_KEY, status);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { status } }));
  } catch {}
};

// Report successful live AI response
export const reportAiSuccess = (): void => {
  setStoredAiStatus('active');
};

// Report 429 quota exhaustion or rate limit
export const reportAiQuotaLimit = (): void => {
  setStoredAiStatus('limited');
};

// Report offline / missing key
export const reportAiOffline = (): void => {
  setStoredAiStatus('offline');
};

// Fetch current status from backend
export const fetchAiStatus = async (): Promise<AiStatus> => {
  try {
    const res = await fetch('/api/ai/status');
    if (res.ok) {
      const data = await res.json();
      const status: AiStatus = data.status === 'limited' ? 'limited' : data.status === 'offline' ? 'offline' : 'active';
      setStoredAiStatus(status);
      return status;
    }
  } catch {}
  return getStoredAiStatus();
};

/**
 * React hook to observe and react to AI status in real time
 */
export const useAiStatus = () => {
  const [status, setStatus] = useState<AiStatus>(getStoredAiStatus);

  useEffect(() => {
    fetchAiStatus().then((st) => setStatus(st));

    const handleStatusChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.status) {
        setStatus(customEvent.detail.status);
      } else {
        setStatus(getStoredAiStatus());
      }
    };

    window.addEventListener(EVENT_NAME, handleStatusChange);
    window.addEventListener('focus', () => {
      fetchAiStatus().then((st) => setStatus(st));
    });

    const timer = setInterval(() => {
      fetchAiStatus().then((st) => setStatus(st));
    }, 45000);

    return () => {
      window.removeEventListener(EVENT_NAME, handleStatusChange);
      clearInterval(timer);
    };
  }, []);

  const isActive = status === 'active';
  const isLimited = status === 'limited';
  const isOffline = status === 'offline';

  const badgeText = isActive ? 'Активний' : isLimited ? 'Ліміт API' : 'Офлайн';
  const shortBadgeText = isActive ? 'Активно' : isLimited ? 'Ліміт' : 'Офлайн';

  const badgeClasses = isActive
    ? 'border-emerald-500/35 bg-emerald-500/15 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.15)]'
    : isLimited
      ? 'border-amber-500/35 bg-amber-500/15 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
      : 'border-zinc-700 bg-zinc-800/80 text-zinc-400';

  const dotClasses = isActive
    ? 'bg-emerald-400 shadow-[0_0_5px_#34d399] animate-pulse'
    : isLimited
      ? 'bg-amber-400 shadow-[0_0_5px_#fbbf24]'
      : 'bg-zinc-500';

  const tooltipText = isActive
    ? 'Gemini AI працює у реальному часі: чат і аналіз активні'
    : isLimited
      ? 'Вичерпано квоту безкоштовного API: задіяно локальну аналітичну модель'
      : 'API ключ не знайдено або відсутнє підключення до мережі';

  return {
    status,
    isActive,
    isLimited,
    isOffline,
    badgeText,
    shortBadgeText,
    badgeClasses,
    dotClasses,
    tooltipText,
    refreshStatus: () => fetchAiStatus().then((st) => setStatus(st))
  };
};
