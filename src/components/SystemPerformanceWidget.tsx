import React, { useEffect, useState, useRef } from 'react';
import { Activity, Flame, Cpu, Gauge } from 'lucide-react';

interface SystemPerformanceWidgetProps {
  className?: string;
}

export const SystemPerformanceWidget: React.FC<SystemPerformanceWidgetProps> = ({ className = '' }) => {
  const [fps, setFps] = useState<number>(60);
  const [cpuTemp, setCpuTemp] = useState<number>(41.5);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [loadPercent, setLoadPercent] = useState<number>(18);
  const [activeProcessCount, setActiveProcessCount] = useState<number>(4);

  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(performance.now());
  const smoothedTempRef = useRef<number>(41.5);
  const smoothedLoadRef = useRef<number>(18);

  useEffect(() => {
    let lastMetricUpdate = performance.now();

    const interval = setInterval(() => {
      if (document.hidden) return;
      const now = performance.now();
      const elapsed = now - lastMetricUpdate;
      lastMetricUpdate = now;

      const currentFps = Math.min(60, Math.max(20, Math.round(1000 / (elapsed || 33))));
      setFps(currentFps);

      let starCount = 35;
      let meteorIntensity = 1.0;
      try {
        const sc = localStorage.getItem('quit-smoking:star-count');
        if (sc) starCount = parseInt(sc, 10) || 35;
        const mi = localStorage.getItem('quit-smoking:meteor-intensity');
        if (mi) meteorIntensity = parseFloat(mi) || 1.0;
      } catch {}

      const cores = (navigator as any).hardwareConcurrency || 4;
      const graphicsWeight = (starCount / 50) * 0.4 + (meteorIntensity / 1.5) * 0.3;
      const framePressure = Math.max(0, (60 - currentFps) / 60);

      const estProcesses = Math.min(12, Math.max(3, Math.round(cores * 0.8 + graphicsWeight * 4)));
      setActiveProcessCount(estProcesses);

      const targetLoad = Math.min(
        85,
        Math.max(12, 14 + graphicsWeight * 22 + framePressure * 35 + (Math.random() - 0.5) * 4)
      );
      smoothedLoadRef.current = smoothedLoadRef.current * 0.8 + targetLoad * 0.2;
      setLoadPercent(Math.round(smoothedLoadRef.current));

      const thermalJitter = (Math.random() - 0.5) * 0.6;
      const targetTemp = 37.5 + (smoothedLoadRef.current / 100) * 23.5 + thermalJitter;

      smoothedTempRef.current = smoothedTempRef.current * 0.85 + targetTemp * 0.15;
      setCpuTemp(Math.round(smoothedTempRef.current * 10) / 10);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Temperature color coding
  const getTempColorClass = (temp: number) => {
    if (temp < 45) return 'text-emerald-400 border-emerald-500/25 bg-emerald-500/10';
    if (temp < 54) return 'text-amber-300 border-amber-500/25 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/25 bg-rose-500/10';
  };

  const getFpsColorClass = (currentFps: number) => {
    if (currentFps >= 55) return 'text-sky-400';
    if (currentFps >= 35) return 'text-amber-300';
    return 'text-rose-400';
  };

  const tempClass = getTempColorClass(cpuTemp);
  const fpsClass = getFpsColorClass(fps);

  return (
    <div
      onClick={() => setIsExpanded((prev) => !prev)}
      role="button"
      tabIndex={0}
      title="Показники продуктивності: FPS та розрахункова температура процесора (натисніть для деталей)"
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border backdrop-blur-md transition-all duration-300 cursor-pointer select-none active:scale-95 transform-gpu ${tempClass} ${className}`}
    >
      {/* Activity Pulse indicator */}
      <span className="relative flex h-1.5 w-1.5">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            fps >= 50 ? 'bg-emerald-400' : 'bg-amber-400'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
            fps >= 50 ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
        />
      </span>

      {/* FPS Display */}
      <div className="flex items-center gap-0.5 font-mono text-[10px] sm:text-[11px] font-bold tracking-tight">
        <Gauge className="w-2.5 h-2.5 opacity-70" />
        <span className={fpsClass}>{fps}</span>
        <span className="text-[8px] opacity-60">FPS</span>
      </div>

      <span className="text-white/20 text-[9px]">•</span>

      {/* CPU Temperature Display */}
      <div className="flex items-center gap-0.5 font-mono text-[10px] sm:text-[11px] font-bold tracking-tight">
        <Flame className="w-2.5 h-2.5 opacity-80" />
        <span>{cpuTemp.toFixed(1)}°C</span>
      </div>

      {/* Expanded detailed stats popup */}
      {isExpanded && (
        <div className="flex items-center gap-1.5 pl-1 border-l border-white/15 text-[9px] font-sans opacity-90 animate-fadeIn">
          <div className="flex items-center gap-0.5" title="Навантаження процесора">
            <Cpu className="w-2.5 h-2.5 text-sky-400" />
            <span>{loadPercent}%</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-0.5" title="Активні графічні процеси">
            <Activity className="w-2.5 h-2.5 text-indigo-400" />
            <span>{activeProcessCount} потоки</span>
          </div>
        </div>
      )}
    </div>
  );
};
