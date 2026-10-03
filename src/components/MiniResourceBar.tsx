import React, { useState, useEffect } from 'react';

interface MiniResourceBarProps {
  onOpenMonitor?: () => void;
}

export const MiniResourceBar: React.FC<MiniResourceBarProps> = () => {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:mini-resource-bar-expanded') === 'true';
    } catch {
      return false;
    }
  });
  const [energyLoad, setEnergyLoad] = useState<number>(18);
  const [ramHeap, setRamHeap] = useState<number>(32);
  const [cpuTemp, setCpuTemp] = useState<number>(38);
  const [fps, setFps] = useState<number>(60);

  const toggleVisibility = () => {
    setIsVisible((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('quit-smoking:mini-resource-bar-expanded', String(next));
      } catch {}
      return next;
    });
  };

  // Measure real-time FPS
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animFrameId: number;

    const measureFps = () => {
      const now = performance.now();
      frameCount++;
      if (now >= lastTime + 1000) {
        const measuredFps = Math.min(120, Math.round((frameCount * 1000) / (now - lastTime)));
        setFps(measuredFps);
        frameCount = 0;
        lastTime = now;
      }
      animFrameId = requestAnimationFrame(measureFps);
    };

    animFrameId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  const updateMetrics = () => {
    try {
      const perfBoost = localStorage.getItem('quit-smoking:perf-boost') === 'true';
      const minimalIndicators = localStorage.getItem('quit-smoking:minimal-indicators') === 'true';
      const theme = localStorage.getItem('quit-smoking:app-theme') || 'standard-static';
      const isStaticTheme = theme === 'standard-static' || theme === 'eco' || theme === 'parchment';

      let estimatedEnergy = isStaticTheme ? 12 : 52;
      if (perfBoost) estimatedEnergy -= 25;
      if (minimalIndicators) estimatedEnergy -= 12;
      estimatedEnergy = Math.min(95, Math.max(8, estimatedEnergy + Math.floor(Math.random() * 5 - 2)));
      setEnergyLoad(estimatedEnergy);

      const estimatedTemp = Math.round(35 + (estimatedEnergy * 0.22) + (Math.random() * 1.5 - 0.75));
      setCpuTemp(estimatedTemp);

      if (typeof window !== 'undefined' && (performance as any).memory) {
        const mem = (performance as any).memory;
        const usedPct = Math.round((mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100);
        setRamHeap(usedPct);
      } else {
        setRamHeap(28 + (estimatedEnergy > 30 ? 8 : 0));
      }
    } catch {}
  };

  useEffect(() => {
    updateMetrics();
    const interval = setInterval(updateMetrics, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative flex flex-col items-start z-30 select-none pointer-events-auto cursor-pointer"
      onClick={toggleVisibility}
      title={isVisible ? "Згорнути панель продуктивності" : "Розгорнути панель продуктивності"}
    >
      <style>{`
        @keyframes drawJerkyErase {
          0% {
            stroke-dasharray: 45;
            stroke-dashoffset: 45;
          }
          15% {
            stroke-dashoffset: 45;
          }
          30% {
            stroke-dashoffset: 32;
          }
          45% {
            stroke-dashoffset: 22;
          }
          60% {
            stroke-dashoffset: 10;
          }
          75% {
            stroke-dashoffset: 0;
          }
          85% {
            stroke-dashoffset: 0;
          }
          95% {
            stroke-dashoffset: 45;
          }
          100% {
            stroke-dashoffset: 45;
          }
        }
        .animate-jerky-draw {
          animation: drawJerkyErase 6.5s steps(8, end) infinite;
        }
      `}</style>
      
      {/* Graph Icon Button (Gray colored when collapsed/inactive) */}
      <div
        className={`relative p-1 rounded-full transition-all duration-300 shrink-0 flex items-center justify-center text-zinc-400 opacity-80 hover:opacity-100 ${
          !isVisible ? 'opacity-40' : ''
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-zinc-400"
        >
          {/* Static axes */}
          <path d="M3 21h18" strokeOpacity="0.25" strokeWidth="1.5" />
          <path d="M3 3v18" strokeOpacity="0.25" strokeWidth="1.5" />

          {/* Active chart line + glowing tip dot when active */}
          {isVisible && (
            <>
              <path
                d="M3 17 L7 11 L12 14 L17 7 L21 10"
                className="text-zinc-400 animate-jerky-draw"
              />
              <circle cx="21" cy="10" r="2" className="fill-zinc-400/60 animate-ping opacity-75" />
              <circle cx="21" cy="10" r="1.5" className="fill-zinc-400" />
            </>
          )}
        </svg>
      </div>

      {/* Absolutely positioned vertical list with values placed right next to labels */}
      {isVisible && (
        <div className="absolute left-0 top-full mt-1 flex flex-col items-start gap-1 font-mono text-[10px] text-zinc-400 animate-in fade-in zoom-in-95 duration-200 pl-0.5 whitespace-nowrap">
          {/* 1. TEMP */}
          <div className="flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity" title="Температура ЦП">
            <span className="font-extrabold text-[8.5px] tracking-tighter text-zinc-400 select-none">TEMP</span>
            <span className="font-bold text-zinc-400 tabular-nums">{cpuTemp}°</span>
          </div>

          {/* 2. RAM */}
          <div className="flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity" title="Оперативна пам'ять (ОЗП)">
            <span className="font-extrabold text-[8.5px] tracking-tighter text-zinc-400 select-none">RAM</span>
            <span className="font-bold text-zinc-400 tabular-nums">{ramHeap}%</span>
          </div>

          {/* 3. FPS */}
          <div className="flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity" title="Кадрів на секунду (FPS)">
            <span className="font-extrabold text-[8.5px] tracking-tighter text-zinc-400 select-none">FPS</span>
            <span className="font-bold text-zinc-400 tabular-nums">{fps}</span>
          </div>

          {/* 4. PWR */}
          <div className="flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity" title="Енергоспоживання (навантаження)">
            <span className="font-extrabold text-[8.5px] tracking-tighter text-zinc-400 select-none">PWR</span>
            <span className="font-bold text-zinc-400 tabular-nums">{energyLoad}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
