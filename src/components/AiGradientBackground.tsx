import React, { useState, useEffect } from 'react';
import bgNebula from '../assets/images/ai_gradient_nebula_1791113909726.jpg';

// Default pre-generated initial AI gradient background image (Cosmic Nebula)
export const DEFAULT_AI_BACKGROUNDS = [
  {
    id: 'ai_gradient_nebula',
    title: 'Космічна Небула',
    subtitle: 'Глибоке фіолетово-індіго сяйво',
    url: bgNebula,
    preset: 'nebula'
  }
];

export interface AiBackgroundTuning {
  brightness: number; // 30 - 120 (default 85)
  blur: number;       // 0 - 12 (default 0)
  opacity: number;    // 20 - 100 (default 90)
}

export const AiGradientBackground: React.FC = () => {
  const [bgUrl, setBgUrl] = useState<string>(() => {
    try {
      const activeUrl = localStorage.getItem('quit-smoking:active-custom-bg');
      if (activeUrl) return activeUrl;
    } catch {}
    return DEFAULT_AI_BACKGROUNDS[0].url;
  });

  const [tuning, setTuning] = useState<AiBackgroundTuning>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:ai-bg-tuning');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          brightness: parsed.brightness ?? 85,
          blur: parsed.blur ?? 0,
          opacity: parsed.opacity ?? 90,
        };
      }
    } catch {}
    return { brightness: 85, blur: 0, opacity: 90 };
  });

  useEffect(() => {
    const handleBgChange = () => {
      try {
        const activeUrl = localStorage.getItem('quit-smoking:active-custom-bg');
        if (activeUrl) setBgUrl(activeUrl);

        const savedTuning = localStorage.getItem('quit-smoking:ai-bg-tuning');
        if (savedTuning) {
          const parsed = JSON.parse(savedTuning);
          setTuning({
            brightness: parsed.brightness ?? 85,
            blur: parsed.blur ?? 0,
            opacity: parsed.opacity ?? 90,
          });
        }
      } catch {}
    };

    window.addEventListener('app-ai-bg-change', handleBgChange);
    window.addEventListener('app-theme-change', handleBgChange);
    return () => {
      window.removeEventListener('app-ai-bg-change', handleBgChange);
      window.removeEventListener('app-theme-change', handleBgChange);
    };
  }, []);

  if (!bgUrl) return null;

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-[#090a0f] overflow-hidden select-none">
      <img
        src={bgUrl}
        alt="AI Abstract Gradient Background"
        className="w-full h-full object-cover transition-all duration-700 ease-out"
        style={{
          opacity: tuning.opacity / 100,
          filter: `brightness(${tuning.brightness}%) blur(${tuning.blur}px)`,
        }}
        referrerPolicy="no-referrer"
      />
      {/* Dark Vignette Overlay for Crisp Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40" />
    </div>
  );
};
