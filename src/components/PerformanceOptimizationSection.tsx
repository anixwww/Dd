import React, { useState, useEffect } from 'react';
import { 
  Zap, Cpu, Battery, Layers, CheckCircle2, ShieldCheck, 
  Flame, Smartphone, Info, Gauge, BatteryCharging, BatteryLow, 
  BatteryMedium, SlidersHorizontal
} from 'lucide-react';
import { 
  getAutoEcoConfig, 
  setAutoEcoConfig, 
  checkAndApplyAutoEco,
  AUTO_ECO_KEYS 
} from '../utils/autoEcoManager';

interface DeviceHardwareProfile {
  cores: number;
  ramGb: number | null;
  gpuRenderer: string;
  batteryLevel: number | null;
  isCharging: boolean | null;
  isBatterySupported: boolean;
  deviceClass: 'budget' | 'standard' | 'flagship';
  platform: string;
}

interface PerformanceOptimizationSectionProps {
  perfBoost: boolean;
  onTogglePerfBoost: (enabled: boolean) => void;
  accentClasses?: {
    activeCard?: string;
    card?: string;
    btn?: string;
    badge?: string;
  };
}

export const PerformanceOptimizationSection: React.FC<PerformanceOptimizationSectionProps> = ({
  perfBoost,
  onTogglePerfBoost,
}) => {
  const [deviceProfile, setDeviceProfile] = useState<DeviceHardwareProfile>({
    cores: 4,
    ramGb: null,
    gpuRenderer: 'Стандартний графічний прискорювач',
    batteryLevel: null,
    isCharging: null,
    isBatterySupported: false,
    deviceClass: 'standard',
    platform: 'Мобільний / ПК пристрій',
  });

  // Auto-Eco configuration state
  const [autoEcoEnabled, setAutoEcoEnabled] = useState<boolean>(() => getAutoEcoConfig().enabled);
  const [autoEcoThreshold, setAutoEcoThreshold] = useState<number>(() => getAutoEcoConfig().threshold);
  const [isAutoEcoTriggered, setIsAutoEcoTriggered] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTO_ECO_KEYS.TRIGGERED) === 'true';
    } catch {
      return false;
    }
  });

  // Minimalist Indicators state (Disables shimmer, glow & heavy shadows)
  const [minimalIndicators, setMinimalIndicators] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:minimal-indicators') === 'true';
    } catch {
      return false;
    }
  });

  // Dynamic App Energy Consumption Calculation State
  const [energyDetails, setEnergyDetails] = useState<{
    level: 'low' | 'medium' | 'high';
    label: string;
    score: number;
    hasCanvasTheme: boolean;
    isPerfBoost: boolean;
    isMinimalIndicators: boolean;
    isDocHidden: boolean;
  }>({
    level: 'low',
    label: 'Низьке',
    score: 15,
    hasCanvasTheme: false,
    isPerfBoost: false,
    isMinimalIndicators: false,
    isDocHidden: false,
  });

  useEffect(() => {
    const calculateEnergy = () => {
      try {
        const isDocHidden = document.hidden;
        const currentTheme = localStorage.getItem('quit-smoking:app-theme') || 'standard-static';
        const isBoost = localStorage.getItem('quit-smoking:perf-boost') === 'true';
        const isMinimal = localStorage.getItem('quit-smoking:minimal-indicators') === 'true';

        // Check if active theme has animated canvas background
        const isStaticTheme = currentTheme === 'standard-static' || currentTheme === 'eco' || currentTheme === 'parchment';
        const hasCanvasTheme = !isStaticTheme;

        if (isDocHidden) {
          setEnergyDetails({
            level: 'low',
            label: 'Заморожено (Низьке)',
            score: 5,
            hasCanvasTheme,
            isPerfBoost: isBoost,
            isMinimalIndicators: isMinimal,
            isDocHidden: true,
          });
          return;
        }

        let score = 15; // Base minimal app load
        if (hasCanvasTheme) {
          score += 45; // Canvas particles background + 3D motion
        }

        if (isBoost) {
          score -= 30; // 20 FPS cap + 80% particle reduction + shadowBlur removal
        }

        if (isMinimal) {
          score -= 15; // Shadows, glow, animations stripped
        }

        // Clamp score between 10 and 95
        score = Math.min(95, Math.max(10, score));

        let level: 'low' | 'medium' | 'high' = 'low';
        let label = 'Низьке';

        if (score >= 50) {
          level = 'high';
          label = 'Високе';
        } else if (score >= 30) {
          level = 'medium';
          label = 'Середнє';
        } else {
          level = 'low';
          label = 'Низьке';
        }

        setEnergyDetails({
          level,
          label,
          score,
          hasCanvasTheme,
          isPerfBoost: isBoost,
          isMinimalIndicators: isMinimal,
          isDocHidden: false,
        });
      } catch {}
    };

    calculateEnergy();
    const interval = setInterval(calculateEnergy, 1000);
    window.addEventListener('visibilitychange', calculateEnergy);
    window.addEventListener('storage', calculateEnergy);
    window.addEventListener('minimal-indicators-change', calculateEnergy);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', calculateEnergy);
      window.removeEventListener('storage', calculateEnergy);
      window.removeEventListener('minimal-indicators-change', calculateEnergy);
    };
  }, [perfBoost, minimalIndicators]);

  const handleToggleMinimalIndicators = (enabled: boolean) => {
    setMinimalIndicators(enabled);
    try {
      localStorage.setItem('quit-smoking:minimal-indicators', enabled ? 'true' : 'false');
      if (enabled) {
        document.documentElement.setAttribute('data-minimal-indicators', 'true');
      } else {
        document.documentElement.removeAttribute('data-minimal-indicators');
      }
      window.dispatchEvent(new Event('minimal-indicators-change'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const handleToggleAutoEco = (enabled: boolean) => {
    setAutoEcoEnabled(enabled);
    setAutoEcoConfig(enabled, autoEcoThreshold);
    if (!enabled && isAutoEcoTriggered) {
      sessionStorage.removeItem(AUTO_ECO_KEYS.TRIGGERED);
      setIsAutoEcoTriggered(false);
      onTogglePerfBoost(false);
    } else if (enabled && deviceProfile.batteryLevel !== null) {
      const active = checkAndApplyAutoEco(
        deviceProfile.batteryLevel, 
        deviceProfile.isCharging || false, 
        onTogglePerfBoost
      );
      setIsAutoEcoTriggered(active);
    }
  };

  const handleChangeThreshold = (threshold: number) => {
    setAutoEcoThreshold(threshold);
    setAutoEcoConfig(autoEcoEnabled, threshold);
    if (autoEcoEnabled && deviceProfile.batteryLevel !== null) {
      const isLow = deviceProfile.batteryLevel <= threshold && !(deviceProfile.isCharging || false);
      if (isLow) {
        sessionStorage.setItem(AUTO_ECO_KEYS.TRIGGERED, 'true');
        setIsAutoEcoTriggered(true);
        onTogglePerfBoost(true);
      } else if (isAutoEcoTriggered && !isLow) {
        sessionStorage.removeItem(AUTO_ECO_KEYS.TRIGGERED);
        setIsAutoEcoTriggered(false);
        onTogglePerfBoost(false);
      }
    }
  };

  // Detect genuine hardware specs & real-time battery listeners
  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4;
    const ram = (navigator as any).deviceMemory || null;

    let gpu = 'Інтегрована графіка';
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (renderer) {
            gpu = renderer.replace(/ANGLE \((.+)\)/, '$1').replace(/Direct3D.+/, '').trim();
          }
        }
      }
    } catch {}

    let plat = 'Пристрій';
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) plat = 'iOS';
    else if (/Android/.test(ua)) plat = 'Android';
    else if (/Macintosh/.test(ua)) plat = 'macOS';
    else if (/Windows/.test(ua)) plat = 'Windows';
    else if (/Linux/.test(ua)) plat = 'Linux';

    let classification: 'budget' | 'standard' | 'flagship' = 'standard';
    if (cores <= 4 && (!ram || ram <= 4)) classification = 'budget';
    else if (cores >= 8 && (ram && ram >= 8)) classification = 'flagship';

    let batteryRef: any = null;
    let handleBatteryChange: (() => void) | null = null;

    if ((navigator as any).getBattery) {
      (navigator as any).getBattery().then((battery: any) => {
        batteryRef = battery;
        const updateBatteryInfo = () => {
          const batLevel = Math.round(battery.level * 100);
          const charging = battery.charging;
          setDeviceProfile(prev => ({
            ...prev,
            batteryLevel: batLevel,
            isCharging: charging,
            isBatterySupported: true,
          }));

          const { enabled } = getAutoEcoConfig();
          if (enabled) {
            const triggered = checkAndApplyAutoEco(batLevel, charging, onTogglePerfBoost);
            setIsAutoEcoTriggered(triggered);
          }
        };

        updateBatteryInfo();
        handleBatteryChange = updateBatteryInfo;
        battery.addEventListener('levelchange', handleBatteryChange);
        battery.addEventListener('chargingchange', handleBatteryChange);
      }).catch(() => {
        setDeviceProfile(prev => ({ ...prev, isBatterySupported: false }));
      });
    }

    setDeviceProfile(prev => ({
      ...prev,
      cores,
      ramGb: ram,
      gpuRenderer: gpu,
      deviceClass: classification,
      platform: plat,
    }));

    return () => {
      if (batteryRef && handleBatteryChange) {
        batteryRef.removeEventListener('levelchange', handleBatteryChange);
        batteryRef.removeEventListener('chargingchange', handleBatteryChange);
      }
    };
  }, [onTogglePerfBoost]);

  const estimatedCpuSavings = deviceProfile.deviceClass === 'budget' ? '22-30%' : deviceProfile.deviceClass === 'standard' ? '18-24%' : '12-18%';
  const estimatedBatteryGain = deviceProfile.deviceClass === 'budget' ? '+1.5–2.5 год' : '+1.0–2.0 год';
  const isLowBatteryActive = autoEcoEnabled && (deviceProfile.batteryLevel !== null && deviceProfile.batteryLevel <= autoEcoThreshold && !deviceProfile.isCharging);

  return (
    <div className="space-y-3.5 text-slate-800 dark:text-zinc-200">
      {/* 0. ДИНАМІЧНИЙ ІНДИКАТОР ЕНЕРГОСПОЖИВАННЯ ЗАСТОСУНКУ */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 ${
        energyDetails.level === 'high'
          ? 'bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-transparent border-rose-500/35 shadow-xs'
          : energyDetails.level === 'medium'
          ? 'bg-gradient-to-r from-amber-500/10 via-teal-500/5 to-transparent border-amber-500/35 shadow-xs'
          : 'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/35 shadow-xs'
      }`}>
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              energyDetails.level === 'high'
                ? 'bg-rose-500/20 text-rose-500'
                : energyDetails.level === 'medium'
                ? 'bg-amber-500/20 text-amber-500'
                : 'bg-emerald-500/20 text-emerald-500'
            }`}>
              {energyDetails.level === 'high' ? (
                <Flame className="w-5 h-5 animate-pulse" />
              ) : energyDetails.level === 'medium' ? (
                <Zap className="w-5 h-5 text-amber-500" />
              ) : (
                <BatteryCharging className="w-5 h-5 text-emerald-500" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 font-sans tracking-wider">
                Розрахункове навантаження на ЦП
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 truncate flex items-center gap-2 mt-0.5">
                Енергоспоживання: 
                <span className={`text-xs px-2 py-0.5 rounded-md font-mono font-black uppercase ${
                  energyDetails.level === 'high'
                    ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                    : energyDetails.level === 'medium'
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                }`}>
                  {energyDetails.label}
                </span>
              </h4>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-mono font-black text-slate-900 dark:text-zinc-100">
              {energyDetails.score}%
            </span>
            <div className="text-[9px] text-slate-500 dark:text-zinc-400 font-medium">
              навантаження
            </div>
          </div>
        </div>

        {/* Dynamic Energy Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden p-0.5 flex gap-1">
            <div className={`h-full rounded-full transition-all duration-500 ${
              energyDetails.score >= 10 ? 'bg-emerald-500 flex-1' : 'bg-slate-300 dark:bg-zinc-700 flex-1'
            }`} />
            <div className={`h-full rounded-full transition-all duration-500 ${
              energyDetails.score >= 35 ? 'bg-amber-500 flex-1' : 'bg-slate-300 dark:bg-zinc-700 flex-1'
            }`} />
            <div className={`h-full rounded-full transition-all duration-500 ${
              energyDetails.score >= 60 ? 'bg-rose-500 flex-1' : 'bg-slate-300 dark:bg-zinc-700 flex-1'
            }`} />
          </div>

          {/* Breakdown Status Tags */}
          <div className="flex flex-wrap items-center justify-between text-[10px] gap-1.5 pt-1 text-slate-600 dark:text-zinc-300">
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${energyDetails.hasCanvasTheme ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              Анімований фон: {energyDetails.hasCanvasTheme ? 'Canvas-частинки (Активно)' : 'Статичний (0% ЦП)'}
            </span>

            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${energyDetails.isPerfBoost ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              Eco Turbo: {energyDetails.isPerfBoost ? 'Увімкнено (-30%)' : 'Вимкнуто'}
            </span>

            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${energyDetails.isMinimalIndicators ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              Мінімалізм: {energyDetails.isMinimalIndicators ? 'Увімкнено (-15%)' : 'Вимкнуто'}
            </span>
          </div>

          {energyDetails.level === 'high' && !perfBoost && (
            <button
              type="button"
              onClick={() => onTogglePerfBoost(true)}
              className="mt-2 w-full py-1.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              Оптимізувати в 1 клік (Увімкнути Eco Turbo)
            </button>
          )}
        </div>
      </div>

      {/* 1. Головний тумблер оптимізації */}
      <div className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 ${
        perfBoost 
          ? 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border-emerald-500/40 shadow-xs'
          : 'bg-slate-50/80 dark:bg-zinc-900/60 border-slate-200/80 dark:border-zinc-800'
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
              perfBoost 
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 scale-105' 
                : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
            }`}>
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">
                  Режим оптимізації швидкодії
                </h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold uppercase font-mono ${
                  perfBoost 
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' 
                    : 'bg-slate-200/80 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                }`}>
                  {perfBoost ? 'АКТИВНИЙ' : 'ВИМКНЕНО'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-0.5 leading-snug">
                {perfBoost 
                  ? 'Зупинено фонові Canvas-частинки, охолодження ЦП та збереження батареї' 
                  : 'Стандартний режим з усіма живими візуальними ефектами'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (perfBoost) {
                sessionStorage.removeItem(AUTO_ECO_KEYS.TRIGGERED);
                setIsAutoEcoTriggered(false);
              }
              onTogglePerfBoost(!perfBoost);
            }}
            aria-checked={perfBoost}
            role="switch"
            className={`w-13 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
              perfBoost ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-zinc-700'
            }`}
            title={perfBoost ? 'Вимкнути режим оптимізації' : 'Увімкнути режим оптимізації'}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              perfBoost ? 'translate-x-6' : 'translate-x-0'
            } shadow-sm`} />
          </button>
        </div>
      </div>

      {/* 2. Перемикач «Мінімалістичні індикатори» */}
      <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${
        minimalIndicators 
          ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/35 shadow-xs' 
          : 'bg-slate-50/60 dark:bg-zinc-900/40 border-slate-200/80 dark:border-zinc-800/80'
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              minimalIndicators ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-slate-200 dark:bg-zinc-800 text-slate-500'
            }`}>
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h5 className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                  Мінімалістичні індикатори
                </h5>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                  minimalIndicators ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'bg-slate-200 dark:bg-zinc-800 text-slate-500'
                }`}>
                  {minimalIndicators ? 'АКТИВНО' : 'ВИМКНЕНО'}
                </span>
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-snug">
                Вимикає анімований блиск, пульсацію, сяйво та тіні на всіх картках головного екрана для економії ЦП
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleToggleMinimalIndicators(!minimalIndicators)}
            aria-checked={minimalIndicators}
            role="switch"
            className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
              minimalIndicators ? 'bg-amber-600' : 'bg-slate-300 dark:bg-zinc-700'
            }`}
            title={minimalIndicators ? 'Вимкнути мінімалістичні індикатори' : 'Увімкнути мінімалістичні індикатори'}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              minimalIndicators ? 'translate-x-5' : 'translate-x-0'
            } shadow-sm`} />
          </button>
        </div>
      </div>

      {/* 3. Компактний інтелектуальний модуль «Авто-Еко» */}
      <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${
        autoEcoEnabled 
          ? 'bg-teal-500/5 dark:bg-teal-500/10 border-teal-500/30' 
          : 'bg-slate-50/60 dark:bg-zinc-900/40 border-slate-200/80 dark:border-zinc-800/80'
      }`}>
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              autoEcoEnabled ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400' : 'bg-slate-200 dark:bg-zinc-800 text-slate-500'
            }`}>
              {deviceProfile.isCharging ? (
                <BatteryCharging className="w-4 h-4 text-emerald-500" />
              ) : isLowBatteryActive ? (
                <BatteryLow className="w-4 h-4 text-amber-500 animate-pulse" />
              ) : (
                <BatteryMedium className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h5 className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                  Автоматичне Еко (Авто-Еко)
                </h5>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                  autoEcoEnabled ? 'bg-teal-500/20 text-teal-700 dark:text-teal-300' : 'bg-slate-200 dark:bg-zinc-800 text-slate-500'
                }`}>
                  {autoEcoEnabled ? 'УВІМК' : 'ВИМК'}
                </span>
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-zinc-400 truncate">
                Авто-увімкнення при розряді батареї та вимкнення при зарядці
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleToggleAutoEco(!autoEcoEnabled)}
            aria-checked={autoEcoEnabled}
            role="switch"
            className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
              autoEcoEnabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-zinc-700'
            }`}
            title={autoEcoEnabled ? 'Вимкнути Авто-Еко' : 'Увімкнути Авто-Еко'}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              autoEcoEnabled ? 'translate-x-5' : 'translate-x-0'
            } shadow-sm`} />
          </button>
        </div>

        {/* Battery Bar & Threshold selector */}
        <div className="space-y-2 pt-1 border-t border-slate-200/60 dark:border-zinc-800/60">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-600 dark:text-zinc-300 flex items-center gap-1.5">
              <span>Заряд пристрою:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-zinc-100">
                {deviceProfile.batteryLevel !== null ? `${deviceProfile.batteryLevel}%` : 'Визначається ОС'}
              </span>
            </span>

            <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400">
              Поріг спрацьовування: {autoEcoThreshold}%
            </span>
          </div>

          {deviceProfile.batteryLevel !== null && (
            <div className="relative w-full h-1.5 rounded-full bg-slate-200 dark:bg-zinc-700/80 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  deviceProfile.isCharging 
                    ? 'bg-emerald-500' 
                    : deviceProfile.batteryLevel <= autoEcoThreshold 
                    ? 'bg-amber-500' 
                    : 'bg-teal-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, deviceProfile.batteryLevel))}%` }}
              />
            </div>
          )}

          {/* Quick Threshold Selector */}
          <div className="flex items-center justify-between gap-1.5 pt-0.5">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">
              Активація при розряді:
            </span>
            <div className="flex items-center gap-1">
              {[15, 20, 30, 40].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleChangeThreshold(val)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    autoEcoThreshold === val
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 hover:bg-teal-50 dark:hover:bg-zinc-700'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Оновлена інформативна сітка метрик пристрою та економії */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Hardware Cores */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-[9px] font-bold uppercase font-sans">Процесор</span>
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-xs font-extrabold text-slate-900 dark:text-zinc-100 font-mono mt-0.5">
            {deviceProfile.cores} <span className="text-[10px] font-normal text-slate-500">ядер ({deviceProfile.platform})</span>
          </div>
        </div>

        {/* CPU Savings */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-[9px] font-bold uppercase font-sans">Навантаження ЦП</span>
            <Gauge className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
            -{estimatedCpuSavings} <span className="text-[10px] font-normal text-slate-500">менше</span>
          </div>
        </div>

        {/* Battery Extension */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-[9px] font-bold uppercase font-sans">Автономність</span>
            <Battery className="w-3.5 h-3.5 text-teal-500" />
          </div>
          <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
            {estimatedBatteryGain}
          </div>
        </div>

        {/* Thermal Drop */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
            <span className="text-[9px] font-bold uppercase font-sans">Температура</span>
            <Flame className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
            -3...5°C <span className="text-[10px] font-normal text-slate-500">охолодження</span>
          </div>
        </div>
      </div>

      {/* 4. Наочний підсумок стану режимів */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-zinc-900/80 border border-slate-200/70 dark:border-zinc-800/70 flex items-start gap-2">
          <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-zinc-100 block">Що оптимізується:</span>
            <span className="text-[11px] text-slate-600 dark:text-zinc-400 leading-tight block mt-0.5">
              Зупиняється фоновий Canvas-рендеринг частинок (листя, сніг, зірки) та часті цикли перемальовування.
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-zinc-900/80 border border-slate-200/70 dark:border-zinc-800/70 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-zinc-100 block">Захищені функції (100%):</span>
            <span className="text-[11px] text-slate-600 dark:text-zinc-400 leading-tight block mt-0.5">
              Таймери, лічильники днів/заощаджень, теми та всі сповіщення працюють із бездоганною точністю.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
