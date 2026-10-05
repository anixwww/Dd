import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CravingLogEntry } from './ToughestTimeSection';

interface CravingDensityScaleWidgetProps {
  className?: string;
}

export const CravingDensityScaleWidget: React.FC<CravingDensityScaleWidgetProps> = ({
  className = ''
}) => {
  const [now, setNow] = useState<number>(Date.now());

  // Update time every 10 seconds for ultra-low battery consumption and smooth movement
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Helper to load all craving sources
  const readAllCravingLogs = useCallback((): CravingLogEntry[] => {
    let combinedLogs: CravingLogEntry[] = [];
    try {
      const saved = localStorage.getItem('quit-smoking:toughest-time-logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          combinedLogs = parsed;
        }
      }
    } catch {}

    // Fallback default initial logs if localStorage is completely untouched
    if (combinedLogs.length === 0) {
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      const d = new Date();
      const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      combinedLogs = [
        {
          id: 'init_1',
          timestamp: Date.now() - 3600 * 1000 * 4,
          dateStr,
          timeStr: '14:30',
          type: 'spike',
          durationMinutes: 20,
          intensity: 8
        },
        {
          id: 'init_2',
          timestamp: Date.now() - 3600 * 1000 * 24,
          dateStr,
          timeStr: '19:00',
          endTimeStr: '20:15',
          type: 'window',
          durationMinutes: 75,
          intensity: 7
        }
      ];
    }

    // Also include recent high-craving moments from 8D Slices (if craving >= 4)
    try {
      const slicesRaw = localStorage.getItem('quit-smoking:health-slices');
      if (slicesRaw) {
        const slices = JSON.parse(slicesRaw);
        if (Array.isArray(slices)) {
          slices.slice(-10).forEach((s: any) => {
            const cravingScore = Number(s.craving || 0);
            if (cravingScore >= 3.5 && s.time) {
              combinedLogs.push({
                id: `slice_${s.id || s.time}`,
                timestamp: s.timestamp || Date.now(),
                dateStr: s.date || '',
                timeStr: s.time,
                type: 'spike',
                durationMinutes: 30,
                intensity: cravingScore >= 5 ? 9 : 7
              });
            }
          });
        }
      }
    } catch {}

    return combinedLogs;
  }, []);

  const [logs, setLogs] = useState<CravingLogEntry[]>(readAllCravingLogs);

  // Sync with ALL events across the app when cravings or peaks are added/updated
  useEffect(() => {
    const handleUpdate = (e?: Event) => {
      try {
        if (e && (e as CustomEvent).detail && Array.isArray((e as CustomEvent).detail)) {
          setLogs((e as CustomEvent).detail);
          return;
        }
        setLogs(readAllCravingLogs());
      } catch {}
    };

    window.addEventListener('toughest-time-logs-updated', handleUpdate);
    window.addEventListener('cravings-updated', handleUpdate);
    window.addEventListener('slice-saved', handleUpdate);
    window.addEventListener('health-slices-change', handleUpdate);
    window.addEventListener('checkin-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    return () => {
      window.removeEventListener('toughest-time-logs-updated', handleUpdate);
      window.removeEventListener('cravings-updated', handleUpdate);
      window.removeEventListener('slice-saved', handleUpdate);
      window.removeEventListener('health-slices-change', handleUpdate);
      window.removeEventListener('checkin-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, [readAllCravingLogs]);

  // 2-Hour window: 1 hour before and 1 hour forward (-60 min to +60 min)
  const windowStartMs = now - 60 * 60 * 1000;
  const windowEndMs = now + 60 * 60 * 1000;

  // Find hour markers within [windowStartMs, windowEndMs]
  const hourTicks = useMemo(() => {
    const ticks: Array<{ label: string; pct: number }> = [];
    const startDate = new Date(windowStartMs);
    const firstHour = new Date(startDate);
    firstHour.setMinutes(0, 0, 0);
    if (firstHour.getTime() < windowStartMs) {
      firstHour.setHours(firstHour.getHours() + 1);
    }

    let cur = firstHour.getTime();
    while (cur <= windowEndMs) {
      const pct = ((cur - windowStartMs) / (120 * 60 * 1000)) * 100;
      const d = new Date(cur);
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      ticks.push({
        label: `${pad(d.getHours())}:00`,
        pct
      });
      cur += 60 * 60 * 1000;
    }
    return ticks;
  }, [windowStartMs, windowEndMs]);

  // Calculate craving density across 25 sample points spanning -60 min to +60 min
  const { samplePoints, currentDensity, peakApproaching, peakMinuteOffset, nextUpcomingPeak } = useMemo(() => {
    const sampleCount = 25;
    const points: Array<{ minuteOffset: number; density: number; x: number; y: number }> = [];

    // Parse logs into daily minute intervals (0 - 1440)
    const logIntervals = logs.map((l) => {
      const [h, m] = (l.timeStr || '12:00').split(':').map((x) => parseInt(x, 10) || 0);
      const startMin = h * 60 + m;
      let endMin = startMin + (l.durationMinutes || 20);
      const isWindow = l.type === 'window' && !!l.endTimeStr;

      if (isWindow && l.endTimeStr) {
        const [eh, em] = l.endTimeStr.split(':').map((x) => parseInt(x, 10) || 0);
        endMin = eh * 60 + em;
      }

      return {
        startMin,
        endMin,
        isWindow,
        duration: Math.max(15, l.durationMinutes || 20),
        intensity: Math.min(10, Math.max(1, Number(l.intensity) || 7))
      };
    });

    const dNow = new Date(now);
    const curMinOfDay = dNow.getHours() * 60 + dNow.getMinutes();

    // Check if user has specific logs
    const hasUserLogs = logIntervals.length > 0;

    // Find nearest upcoming peak from user logs (within 24 hours)
    let nextUpcoming: { minOfDay: number; diffMinutes: number; intensity: number; timeStr: string } | null = null;
    let minDiff = 9999;
    for (const log of logIntervals) {
      let diff = log.startMin - curMinOfDay;
      if (diff < -30) diff += 1440; // past today's peak by >30m, look at tomorrow's
      if (diff >= -30 && diff < minDiff) {
        minDiff = diff;
        const h = Math.floor(log.startMin / 60);
        const m = log.startMin % 60;
        nextUpcoming = {
          minOfDay: log.startMin,
          diffMinutes: diff,
          intensity: log.intensity,
          timeStr: `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`
        };
      }
    }

    // Default circadian craving peaks (used ONLY when user has no logs)
    const defaultCircadianPeaks = [
      { min: 8 * 60 + 30, intensity: 6.5, width: 35 },
      { min: 14 * 60, intensity: 7.5, width: 45 },
      { min: 16 * 60 + 30, intensity: 7.0, width: 40 },
      { min: 19 * 60, intensity: 8.0, width: 50 },
      { min: 22 * 60, intensity: 6.0, width: 40 },
    ];

    /**
     * Compute intensity at minute:
     * - Direct 1-10 mapping for single peaks
     * - Weighted average when multiple periods/spikes overlap
     * - 0 when baseline calm
     */
    const getDensityAtMinute = (timeMs: number): number => {
      const d = new Date(timeMs);
      const minuteOfDay = d.getHours() * 60 + d.getMinutes();

      if (hasUserLogs) {
        let weightedIntensitySum = 0;
        let totalWeight = 0;
        let maxWeight = 0;

        for (const log of logIntervals) {
          const logIntensity = log.intensity;
          let w = 0;

          if (log.isWindow) {
            // Window entry from startMin to endMin
            let inside = false;
            let distToBorder = 9999;
            const startM = log.startMin;
            const endM = log.endMin;

            if (startM <= endM) {
              if (minuteOfDay >= startM && minuteOfDay <= endM) {
                inside = true;
              } else if (minuteOfDay < startM) {
                distToBorder = startM - minuteOfDay;
              } else {
                distToBorder = minuteOfDay - endM;
              }
            } else {
              // Spanning midnight
              if (minuteOfDay >= startM || minuteOfDay <= endM) {
                inside = true;
              } else {
                distToBorder = Math.min(startM - minuteOfDay, minuteOfDay - endM);
              }
            }

            if (inside) {
              w = 1.0;
            } else if (distToBorder <= 25) {
              w = Math.cos((distToBorder / 25) * (Math.PI / 2));
            }
          } else {
            // Spike entry centered at startMin
            let diff = Math.abs(minuteOfDay - log.startMin);
            if (diff > 720) diff = 1440 - diff;

            const halfWidth = Math.max(25, log.duration);
            if (diff <= halfWidth) {
              w = Math.cos((diff / halfWidth) * (Math.PI / 2));
            } else if (diff <= halfWidth + 20) {
              const falloff = 1 - (diff - halfWidth) / 20;
              w = 0.25 * falloff;
            }
          }

          if (w > 0.001) {
            weightedIntensitySum += w * logIntensity;
            totalWeight += w;
            if (w > maxWeight) maxWeight = w;
          }
        }

        // Overlapping calculation: weighted average of all overlapping intensities
        if (totalWeight > 0) {
          const avgIntensity = weightedIntensitySum / totalWeight;
          const blendFactor = Math.min(1.0, maxWeight);
          const finalVal = blendFactor * avgIntensity;
          return Math.min(10, Math.max(0, Math.round(finalVal * 10) / 10));
        }

        return 0; // Calm baseline when no logs overlap
      } else {
        // Fallback default circadian baseline when no user logs exist
        let circadianSum = 0;
        let circadianWeight = 0;
        let maxW = 0;

        for (const peak of defaultCircadianPeaks) {
          let diff = Math.abs(minuteOfDay - peak.min);
          if (diff > 720) diff = 1440 - diff;
          if (diff <= peak.width) {
            const w = Math.cos((diff / peak.width) * (Math.PI / 2));
            circadianSum += w * peak.intensity;
            circadianWeight += w;
            if (w > maxW) maxW = w;
          }
        }

        if (circadianWeight > 0) {
          const avg = circadianSum / circadianWeight;
          const blend = Math.min(1.0, maxW);
          const finalVal = blend * avg;
          return Math.min(10, Math.max(0, Math.round(finalVal * 10) / 10));
        }

        return 0;
      }
    };

    let curDens = 0;
    let maxFutureDens = 0;
    let nextPeakMin = -1;

    for (let i = 0; i < sampleCount; i++) {
      const frac = i / (sampleCount - 1);
      const minOffset = -60 + frac * 120;
      const pointTime = now + minOffset * 60 * 1000;
      const dens = getDensityAtMinute(pointTime);

      const x = frac * 190 + 5; // SVG coordinate 5 to 195
      // Linear mapping of intensity 0-10 to wave height: baseline y=21 down to ceiling y=3 (18px total delta)
      const y = 21 - Math.min(18, Math.max(0, (dens / 10.0) * 18.0));

      points.push({ minuteOffset: minOffset, density: dens, x, y });

      if (i === 12) {
        curDens = dens; // center (now)
      } else if (minOffset > 0 && minOffset <= 60) {
        if (dens > maxFutureDens) {
          maxFutureDens = dens;
          nextPeakMin = Math.round(minOffset);
        }
      }
    }

    const isPeakActive = curDens >= 5.0;
    const isPeakApproaching = !isPeakActive && maxFutureDens >= 3.5;

    return {
      samplePoints: points,
      currentDensity: curDens,
      peakApproaching: isPeakApproaching,
      peakMinuteOffset: nextPeakMin,
      nextUpcomingPeak: nextUpcoming
    };
  }, [now, logs]);

  // Construct SVG spline path and area
  const { pathD, areaD } = useMemo(() => {
    if (samplePoints.length === 0) return { pathD: '', areaD: '' };

    let d = `M ${samplePoints[0].x} ${samplePoints[0].y}`;
    for (let i = 0; i < samplePoints.length - 1; i++) {
      const p0 = samplePoints[i];
      const p1 = samplePoints[i + 1];
      const mx = (p0.x + p1.x) / 2;
      d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const last = samplePoints[samplePoints.length - 1];
    const first = samplePoints[0];
    const a = `${d} L ${last.x} 21 L ${first.x} 21 Z`;

    return { pathD: d, areaD: a };
  }, [samplePoints]);

  const handleClickWidget = () => {
    // Navigate straight to State tab and open craving wave
    window.dispatchEvent(new CustomEvent('change-tab', { detail: 'state' }));
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-craving-wave'));
    }, 60);
  };

  /**
   * Top Header State Text (без символа кола):
   * Відсутня — 0
   * Слабка   — 0-3 (0 < x <= 3)
   * Помірна  — 3-5 (3 < x <= 5)
   * Висока   — 5-7 (5 < x <= 7)
   * Небезпечна — 7-10 (7 < x <= 10)
   */
  const intensityInfo = useMemo(() => {
    const d = currentDensity;
    if (d <= 0.1) {
      return { label: 'Відсутня', color: 'text-zinc-400' };
    }
    if (d <= 3.0) {
      return { label: 'Слабка', color: 'text-emerald-400' };
    }
    if (d <= 5.0) {
      return { label: 'Помірна', color: 'text-amber-300' };
    }
    if (d <= 7.0) {
      return { label: 'Висока', color: 'text-orange-400 font-bold' };
    }
    return { label: 'Небезпечна', color: 'text-rose-400 font-extrabold animate-pulse' };
  }, [currentDensity]);

  /**
   * Bottom Text (Час періоду тяги замість Зараз):
   * Наприклад: ~30хв, ~20хв, ~15хв або час найближчого періоду
   */
  const cravingTimePeriod = useMemo(() => {
    if (currentDensity >= 7.0) {
      return '~20хв';
    }
    if (currentDensity >= 3.0) {
      return '~15хв';
    }
    if (peakApproaching && peakMinuteOffset > 0) {
      return `~${peakMinuteOffset}хв`;
    }
    if (nextUpcomingPeak) {
      if (nextUpcomingPeak.diffMinutes > 0 && nextUpcomingPeak.diffMinutes <= 90) {
        return `~${nextUpcomingPeak.diffMinutes}хв`;
      }
      return nextUpcomingPeak.timeStr;
    }
    return '~30хв';
  }, [currentDensity, peakApproaching, peakMinuteOffset, nextUpcomingPeak]);

  const isPeakActive = currentDensity >= 5.0;
  const isCalm = currentDensity <= 0.5 && !peakApproaching;

  // The exact Y position of the center point (NOW) on the spline curve
  const centerPointY = samplePoints[12]?.y ?? 21;

  // Dynamic tooltip describing state
  const widgetTooltip = `Інтенсивність тяги: ${intensityInfo.label} (${currentDensity.toFixed(1)}/10). Період: ${cravingTimePeriod}. Натисніть для огляду хвилі`;

  return (
    <div
      onClick={handleClickWidget}
      className={`select-none group cursor-pointer pointer-events-auto transition-all duration-700 ${className}`}
      title={widgetTooltip}
    >
      <div 
        className="flex flex-col justify-between bg-transparent border-0 shadow-none p-0 w-[68px] xs:w-[74px] sm:w-[80px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Top Header Row - Інтенсивність поточного стану (без символа кола) */}
        <div className="flex items-center justify-center mb-0.5 min-h-[16px]">
          <span className={`text-[9px] xs:text-[9.5px] font-bold font-mono tracking-tight leading-none whitespace-nowrap transition-colors duration-500 ${intensityInfo.color}`}>
            {intensityInfo.label}
          </span>
        </div>

        {/* Horizontal Craving Density Moving SVG Track with Smooth Mask & Opacity */}
        <div 
          className="relative h-5 w-full flex items-center justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            maskImage: isCalm
              ? 'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.45) 25%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.45) 75%, rgba(0,0,0,0.18) 100%)'
              : 'none',
            WebkitMaskImage: isCalm
              ? 'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.45) 25%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.45) 75%, rgba(0,0,0,0.18) 100%)'
              : 'none',
          }}
        >
          {/* Background Spline & Area with calm semi-transparency */}
          <svg 
            viewBox="0 0 200 24" 
            className={`w-full h-full overflow-visible transition-opacity duration-700 ease-in-out ${
              isCalm ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <defs>
              <linearGradient id="densityTrackGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={currentDensity >= 7.0 ? '#f43f5e' : currentDensity >= 5.0 ? '#f97316' : currentDensity >= 3.0 ? '#f59e0b' : '#10b981'} stopOpacity={isCalm ? "0.2" : "0.55"} />
                <stop offset="100%" stopColor={currentDensity >= 7.0 ? '#f43f5e' : currentDensity >= 5.0 ? '#f97316' : currentDensity >= 3.0 ? '#f59e0b' : '#10b981'} stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="densityLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor={currentDensity >= 7.0 ? '#f43f5e' : currentDensity >= 5.0 ? '#f97316' : currentDensity >= 3.0 ? '#f59e0b' : '#34d399'} />
                <stop offset="100%" stopColor={peakApproaching ? '#f59e0b' : '#10b981'} />
              </linearGradient>
            </defs>

            {/* Base Horizontal Baseline */}
            <line x1="5" y1="21" x2="195" y2="21" stroke="#3f3f46" strokeWidth="1" opacity={isCalm ? 0.35 : 0.6} />

            {/* Density Filled Area */}
            {areaD && (
              <path d={areaD} fill="url(#densityTrackGrad)" />
            )}

            {/* Density Spline Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="url(#densityLineGrad)"
                strokeWidth={isCalm ? "1.4" : "2.0"}
                strokeLinecap="round"
              />
            )}

            {/* Hour Ticks and Labels */}
            {hourTicks.map((tick, i) => {
              const x = 5 + (tick.pct / 100) * 190;
              return (
                <g key={`tick-${i}`} opacity={isCalm ? 0.3 : 0.85} className="transition-opacity duration-700">
                  <line x1={x} y1="16" x2={x} y2="21" stroke="#52525b" strokeWidth="1" />
                  <text
                    x={x}
                    y="24"
                    fill="#71717a"
                    fontSize="6.5"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {tick.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Central Sharp Indicator */}
          <svg viewBox="0 0 200 24" className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
            {/* Current Moment Cursor Line (at exact center 50%, x = 100) */}
            <line 
              x1="100" 
              y1={Math.max(1, centerPointY - 3)} 
              x2="100" 
              y2="21" 
              stroke="#ffffff" 
              strokeWidth="1.3" 
              strokeDasharray="2 1.5" 
              opacity={isCalm ? 0.9 : 1.0}
              className="transition-all duration-700"
            />
            {/* Central Point Beacon Dot - dynamically rides the exact curve elevation */}
            <circle 
              cx="100" 
              cy={centerPointY} 
              r={isCalm ? 2.0 : 2.5} 
              fill={currentDensity >= 7.0 ? '#f43f5e' : currentDensity >= 5.0 ? '#f97316' : currentDensity >= 3.0 ? '#f59e0b' : '#34d399'}
              className={`transition-all duration-700 ${
                currentDensity >= 7.0 
                  ? 'drop-shadow-[0_0_6px_#f43f5e]' 
                  : currentDensity >= 5.0
                    ? 'drop-shadow-[0_0_6px_#f97316]' 
                    : currentDensity >= 3.0
                      ? 'drop-shadow-[0_0_6px_#f59e0b]' 
                      : 'drop-shadow-[0_0_4px_#34d399]'
              }`}
            />
          </svg>
        </div>

        {/* Micro Scale Legend (Час періоду тяги замість Зараз) */}
        <div className="flex items-center justify-center text-[8.5px] xs:text-[9px] font-mono font-bold mt-0.5 transition-all duration-700">
          <span className={currentDensity >= 7.0 ? "text-rose-400 font-extrabold animate-pulse" : currentDensity >= 5.0 ? "text-orange-400 font-bold" : currentDensity >= 3.0 ? "text-amber-300 font-bold" : currentDensity > 0 ? "text-emerald-400 font-semibold" : "text-zinc-400 font-semibold"}>
            {cravingTimePeriod}
          </span>
        </div>
      </div>
    </div>
  );
};
