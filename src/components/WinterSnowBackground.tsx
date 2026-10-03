import React, { useEffect, useRef, useState } from 'react';

export type WinterTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type WinterWeatherPhase = 
  | 'gentle_fall'     // Спокійний медитативний лапатий снігопад
  | 'wind_pillow'     // Подушка вітру — плавний порив з аеродинамічним підйомом пушинок
  | 'blizzard'        // Хурделиця — стрімкий вихор снігу та завірюха
  | 'settling'        // Поступове затихання
  | 'stillness'       // Завмирання — сніг майже зупиняється в невагомості
  | 'direction_turn'; // Зміна напрямку вітру (поворот у протилежний бік)

interface CottonLobe {
  angle: number;
  dist: number;
  radius: number;
}

// Delicate, soft, translucent snowflake particle (No sharp crystals)
interface WinterFlake {
  id: number;
  x: number;
  y: number;
  baseVy: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  type: 'micro_dust' | 'soft_down' | 'fluffy_clump';
  angle: number;
  spinSpeed: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmp: number;
  depth: number; // 0 = tiny distant background, 1 = mid floating, 2 = near soft puff
  lobes: CottonLobe[];
}

// Volumetric winter fog cloud billow
interface FogBillow {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  vx: number;
  vy: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  depth: number; // 0 = deep background behind snow, 1 = foreground floating veil
  r: number;
  g: number;
  b: number;
}

const getTimeOfDay = (date: Date = new Date()): WinterTimeOfDay => {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
};

const TIME_CONFIGS: Record<WinterTimeOfDay, {
  name: string;
  badge: string;
  bgGradient: string;
  ambientGlow: string;
  fogRgb: [number, number, number];
}> = {
  morning: {
    name: 'Морозний світанок',
    badge: 'Світанок ❄️',
    bgGradient: 'from-[#070a16] via-[#0d1226] to-[#04060d]',
    ambientGlow: 'radial-gradient(ellipse at 50% 25%, rgba(244, 114, 182, 0.06) 0%, rgba(147, 197, 253, 0.08) 50%, transparent 80%)',
    fogRgb: [224, 231, 255],
  },
  afternoon: {
    name: 'Сріблястий полудень',
    badge: 'Полудень ❄️',
    bgGradient: 'from-[#050914] via-[#0a1324] to-[#03060f]',
    ambientGlow: 'radial-gradient(ellipse at 50% 20%, rgba(56, 189, 248, 0.08) 0%, rgba(186, 230, 253, 0.07) 55%, transparent 85%)',
    fogRgb: [200, 232, 255],
  },
  evening: {
    name: 'Зимові сутінки',
    badge: 'Сутінки ❄️',
    bgGradient: 'from-[#090716] via-[#100c24] to-[#04030d]',
    ambientGlow: 'radial-gradient(ellipse at 50% 25%, rgba(168, 85, 247, 0.08) 0%, rgba(244, 114, 182, 0.06) 55%, transparent 80%)',
    fogRgb: [216, 210, 254],
  },
  night: {
    name: 'Полярна ніч',
    badge: 'Полярна ніч ❄️',
    bgGradient: 'from-[#03050d] via-[#060b18] to-[#020308]',
    ambientGlow: 'radial-gradient(ellipse at 50% 18%, rgba(20, 184, 166, 0.07) 0%, rgba(99, 102, 241, 0.07) 55%, transparent 85%)',
    fogRgb: [186, 230, 253],
  },
};

export const WinterSnowBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<WinterTimeOfDay>(() => getTimeOfDay());
  const [isPerfBoost, setIsPerfBoost] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:perf-boost') === 'true';
    } catch {
      return false;
    }
  });

  const pointerWindRef = useRef<{ x: number; y: number; active: boolean; vx: number }>({
    x: 0,
    y: 0,
    active: false,
    vx: 0,
  });

  // Weather state engine:
  // 'gentle_fall' -> 'wind_pillow' -> 'blizzard' -> 'settling' -> 'stillness' (завмирання) -> 'direction_turn' (зміна напряму)
  const weatherEngineRef = useRef({
    phase: 'gentle_fall' as WinterWeatherPhase,
    phaseTimer: 0,
    phaseDuration: 700, // frames (~12s)
    activeDensity: 0.65, // 0.15 (stillness) to 1.0 (blizzard)
    targetDensity: 0.65,
    windX: 0.3,
    targetWindX: 0.3,
    windLift: 0, // Aerodynamic upward buoyancy during wind pillows
    targetWindLift: 0,
    windDirectionSign: 1, // 1 for right, -1 for left
    windAngle: 0,
    fogDensity: 1.0,
    targetFogDensity: 1.0,
    blizzardIntensity: 0, // 0 to 1 for blizzard streaks
  });

  useEffect(() => {
    const updateTime = () => setTimeOfDay(getTimeOfDay());
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handlePerfChange = () => {
      try {
        setIsPerfBoost(localStorage.getItem('quit-smoking:perf-boost') === 'true');
      } catch {}
    };
    window.addEventListener('perf-boost-change', handlePerfChange);
    return () => window.removeEventListener('perf-boost-change', handlePerfChange);
  }, []);

  useEffect(() => {
    if (isPerfBoost) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let isRunning = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    let lastPointerX = 0;
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX !== undefined && clientY !== undefined) {
        const dx = clientX - lastPointerX;
        lastPointerX = clientX;
        pointerWindRef.current = {
          x: clientX,
          y: clientY,
          active: true,
          vx: Math.max(-3.5, Math.min(3.5, dx * 0.15)),
        };
      }
    };

    const handlePointerLeave = () => {
      pointerWindRef.current.active = false;
      pointerWindRef.current.vx = 0;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    const config = TIME_CONFIGS[timeOfDay];

    // ========================================================================
    // 1. INITIALIZE VOLUMETRIC MEDITATIVE FOG BILLOWS
    // ========================================================================
    const fogCount = 12;
    const fogBillows: FogBillow[] = [];
    const [fogR, fogG, fogB] = config.fogRgb;

    for (let f = 0; f < fogCount; f++) {
      const depth = f % 3 === 0 ? 1 : 0; // 1/3 foreground veil, 2/3 background layer
      const radiusX = 180 + Math.random() * 260;
      const radiusY = 120 + Math.random() * 180;
      fogBillows.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radiusX,
        radiusY,
        vx: (0.008 + Math.random() * 0.016) * (Math.random() < 0.5 ? 1 : -1),
        vy: (0.004 + Math.random() * 0.008) * (Math.random() < 0.5 ? 1 : -1),
        baseAlpha: depth === 1 ? 0.024 + Math.random() * 0.018 : 0.038 + Math.random() * 0.024,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.0016 + Math.random() * 0.0028,
        depth,
        r: fogR,
        g: fogG,
        b: fogB,
      });
    }

    // ========================================================================
    // 2. DELICATE, SOFT, SMALL & TRANSLUCENT SNOWFLAKES (NO CRYSTALS)
    // ========================================================================
    const totalFlakes = Math.min(320, Math.max(120, Math.floor(width / 4.5)));

    const createFlake = (id: number, spawnAtTop = false): WinterFlake => {
      const randType = Math.random();
      // Pure soft non-crystalline varieties:
      // - micro_dust (50%): fine translucent floating powder
      // - soft_down (35%): gentle rounded downy puff
      // - fluffy_clump (15%): small multi-lobed soft cotton puff
      const type: WinterFlake['type'] = 
        randType < 0.50 ? 'micro_dust' :
        randType < 0.85 ? 'soft_down' : 'fluffy_clump';

      const depth = Math.random() < 0.3 ? 2 : Math.random() < 0.7 ? 1 : 0;

      // Noticeably smaller sizes:
      let size = 1.4;
      // Noticeably more translucent baseAlpha:
      let baseAlpha = 0.28;

      if (type === 'micro_dust') {
        size = 0.65 + Math.random() * 0.75;
        baseAlpha = 0.14 + Math.random() * 0.18;
      } else if (type === 'soft_down') {
        size = 1.3 + Math.random() * 0.9;
        baseAlpha = 0.22 + Math.random() * 0.18;
      } else {
        // fluffy_clump
        size = 2.0 + Math.random() * 1.1;
        baseAlpha = 0.28 + Math.random() * 0.16;
      }

      if (depth === 0) size *= 0.65;
      if (depth === 2) size *= 1.15;

      const lobeCount = 3 + Math.floor(Math.random() * 3);
      const lobes: CottonLobe[] = [];
      for (let l = 0; l < lobeCount; l++) {
        lobes.push({
          angle: (l / lobeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5,
          dist: 0.25 + Math.random() * 0.35,
          radius: 0.35 + Math.random() * 0.3,
        });
      }

      const baseVy = (depth === 0 ? 0.24 : depth === 1 ? 0.42 : 0.62) + Math.random() * 0.22;

      return {
        id,
        x: Math.random() * (width + 100) - 50,
        y: spawnAtTop ? -15 - Math.random() * 50 : Math.random() * height,
        baseVy,
        vy: baseVy,
        size,
        alpha: spawnAtTop ? 0 : baseAlpha * 0.5,
        baseAlpha,
        type,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.008,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.012 + Math.random() * 0.018,
        swayAmp: (type === 'fluffy_clump' ? 0.55 : 0.35) + Math.random() * 0.45,
        depth,
        lobes,
      };
    };

    const flakes: WinterFlake[] = [];
    for (let i = 0; i < totalFlakes; i++) {
      flakes.push(createFlake(i, false));
    }

    // ========================================================================
    // 3. PROCEDURAL DRAWING PRIMITIVES (SOFT, FEATHERED, NON-CRYSTALLINE)
    // ========================================================================

    // 1. Micro Dust (Дрібний морозний пушок)
    const drawMicroDust = (c: CanvasRenderingContext2D, size: number, curAlpha: number) => {
      const grad = c.createRadialGradient(0, 0, 0, 0, 0, size);
      grad.addColorStop(0, `rgba(255, 255, 255, ${curAlpha * 0.95})`);
      grad.addColorStop(0.5, `rgba(224, 242, 254, ${curAlpha * 0.45})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      c.fillStyle = grad;
      c.beginPath();
      c.arc(0, 0, size, 0, Math.PI * 2);
      c.fill();
    };

    // 2. Soft Down (Ніжні круглі напівпрозорі пушинки)
    const drawSoftDown = (c: CanvasRenderingContext2D, size: number, curAlpha: number) => {
      const grad = c.createRadialGradient(0, 0, 0, 0, 0, size);
      grad.addColorStop(0, `rgba(255, 255, 255, ${curAlpha * 0.9})`);
      grad.addColorStop(0.55, `rgba(235, 245, 255, ${curAlpha * 0.5})`);
      grad.addColorStop(0.85, `rgba(220, 240, 255, ${curAlpha * 0.15})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      c.fillStyle = grad;
      c.beginPath();
      c.arc(0, 0, size, 0, Math.PI * 2);
      c.fill();
    };

    // 3. Fluffy Clump (Невеличкі м'які клаптики пуху)
    const drawFluffyClump = (c: CanvasRenderingContext2D, flake: WinterFlake, curAlpha: number) => {
      const baseR = flake.size;

      const g0 = c.createRadialGradient(0, 0, 0, 0, 0, baseR * 0.7);
      g0.addColorStop(0, `rgba(255, 255, 255, ${curAlpha * 0.85})`);
      g0.addColorStop(0.6, `rgba(235, 245, 255, ${curAlpha * 0.45})`);
      g0.addColorStop(1, 'rgba(255, 255, 255, 0)');
      c.fillStyle = g0;
      c.beginPath();
      c.arc(0, 0, baseR * 0.7, 0, Math.PI * 2);
      c.fill();

      for (let i = 0; i < flake.lobes.length; i++) {
        const lb = flake.lobes[i];
        const lx = Math.cos(lb.angle) * (baseR * lb.dist);
        const ly = Math.sin(lb.angle) * (baseR * lb.dist);
        const lr = baseR * lb.radius;

        const g = c.createRadialGradient(lx, ly, 0, lx, ly, lr);
        g.addColorStop(0, `rgba(255, 255, 255, ${curAlpha * 0.75})`);
        g.addColorStop(0.55, `rgba(235, 245, 255, ${curAlpha * 0.35})`);
        g.addColorStop(1, 'rgba(255, 255, 255, 0)');
        c.fillStyle = g;
        c.beginPath();
        c.arc(lx, ly, lr, 0, Math.PI * 2);
        c.fill();
      }
    };

    // Draw a volumetric atmospheric fog billow
    const drawFogCloud = (c: CanvasRenderingContext2D, fog: FogBillow, intensityMultiplier: number) => {
      fog.pulsePhase += fog.pulseSpeed;
      const breathe = 1 + Math.sin(fog.pulsePhase) * 0.18;
      const rx = fog.radiusX * breathe;
      const ry = fog.radiusY * breathe;
      const alpha = fog.baseAlpha * intensityMultiplier * (0.85 + Math.sin(fog.pulsePhase * 0.7) * 0.15);

      c.save();
      c.translate(fog.x, fog.y);
      c.scale(1, ry / rx);

      const grad = c.createRadialGradient(0, 0, 0, 0, 0, rx);
      grad.addColorStop(0, `rgba(${fog.r}, ${fog.g}, ${fog.b}, ${alpha})`);
      grad.addColorStop(0.5, `rgba(${fog.r}, ${fog.g}, ${fog.b}, ${alpha * 0.45})`);
      grad.addColorStop(1, `rgba(${fog.r}, ${fog.g}, ${fog.b}, 0)`);

      c.fillStyle = grad;
      c.beginPath();
      c.arc(0, 0, rx, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    let tick = 0;
    let lastFrameTime = performance.now();

    const render = (timestamp: number = performance.now()) => {
      if (!isRunning || document.hidden) return;

      const isPerfBoost = localStorage.getItem('quit-smoking:perf-boost') === 'true';
      const targetFps = isPerfBoost ? 20 : 30;
      const minIntervalMs = 1000 / targetFps - 2;

      const elapsed = timestamp - lastFrameTime;
      if (elapsed < minIntervalMs) {
        animId = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = timestamp;
      tick++;

      ctx.clearRect(0, 0, width, height);

      // ====================================================================
      // 4. WEATHER ENGINE DYNAMICS
      // ====================================================================
      const wEng = weatherEngineRef.current;
      wEng.phaseTimer++;

      if (wEng.phaseTimer >= wEng.phaseDuration) {
        wEng.phaseTimer = 0;

        switch (wEng.phase) {
          case 'gentle_fall': // Спокійний снігопад -> Подушка вітру
            wEng.phase = 'wind_pillow';
            wEng.phaseDuration = 450 + Math.floor(Math.random() * 200);
            wEng.targetDensity = 0.75;
            wEng.targetWindX = wEng.windDirectionSign * (1.5 + Math.random() * 0.7);
            wEng.targetWindLift = 0.22;
            wEng.targetFogDensity = 1.15;
            wEng.blizzardIntensity = 0.2;
            break;

          case 'wind_pillow': // Подушка вітру -> ХУРДЕЛИЦЯ (Blizzard)
            wEng.phase = 'blizzard';
            wEng.phaseDuration = 650 + Math.floor(Math.random() * 350);
            wEng.targetDensity = 1.0;
            wEng.targetWindX = wEng.windDirectionSign * (3.5 + Math.random() * 1.3);
            wEng.targetWindLift = 0.10;
            wEng.targetFogDensity = 1.45;
            wEng.blizzardIntensity = 1.0;
            break;

          case 'blizzard': // Хурделиця -> Вщухання (Settling)
            wEng.phase = 'settling';
            wEng.phaseDuration = 380;
            wEng.targetDensity = 0.45;
            wEng.targetWindX = wEng.windDirectionSign * 0.45;
            wEng.targetWindLift = 0;
            wEng.targetFogDensity = 1.1;
            wEng.blizzardIntensity = 0.1;
            break;

          case 'settling': // Вщухання -> ЗАВМИРАННЯ (Stillness)
            wEng.phase = 'stillness';
            wEng.phaseDuration = 700 + Math.floor(Math.random() * 400);
            wEng.targetDensity = 0.35;
            wEng.targetWindX = 0.04 * wEng.windDirectionSign;
            wEng.targetWindLift = 0.06;
            wEng.targetFogDensity = 0.88;
            wEng.blizzardIntensity = 0;
            break;

          case 'stillness': // Завмирання -> ЗМІНА НАПРЯМКУ ВІТРУ
            wEng.phase = 'direction_turn';
            wEng.phaseDuration = 450;
            wEng.windDirectionSign = wEng.windDirectionSign > 0 ? -1 : 1;
            wEng.targetDensity = 0.55;
            wEng.targetWindX = wEng.windDirectionSign * 1.1;
            wEng.targetWindLift = 0.05;
            wEng.targetFogDensity = 1.0;
            wEng.blizzardIntensity = 0;
            break;

          case 'direction_turn': // Зміна напрямку -> Спокійний лапатий снігопад
            wEng.phase = 'gentle_fall';
            wEng.phaseDuration = 700 + Math.floor(Math.random() * 300);
            wEng.targetDensity = 0.65;
            wEng.targetWindX = wEng.windDirectionSign * (0.35 + Math.random() * 0.35);
            wEng.targetWindLift = 0;
            wEng.targetFogDensity = 1.0;
            wEng.blizzardIntensity = 0;
            break;
        }
      }

      // Smooth continuous physical interpolation (lerp)
      const isBlizzard = wEng.phase === 'blizzard';
      const isStillness = wEng.phase === 'stillness';
      const isPillow = wEng.phase === 'wind_pillow';

      const lerpRate = isBlizzard ? 0.015 : isStillness ? 0.008 : 0.012;
      wEng.activeDensity += (wEng.targetDensity - wEng.activeDensity) * lerpRate;
      wEng.windX += (wEng.targetWindX - wEng.windX) * lerpRate;
      wEng.windLift += (wEng.targetWindLift - wEng.windLift) * 0.01;
      wEng.fogDensity += (wEng.targetFogDensity - wEng.fogDensity) * 0.01;

      // Micro wind breathing & turbulence
      const windBreathe = isStillness
        ? Math.sin(tick * 0.012) * 0.08
        : isBlizzard
        ? Math.sin(tick * 0.06) * 0.8 + Math.cos(tick * 0.09) * 0.4
        : Math.sin(tick * 0.025) * 0.35;

      const currentWind = wEng.windX + windBreathe;
      const pointer = pointerWindRef.current;

      // ====================================================================
      // 5. RENDER BACKGROUND FOG BILLOWS
      // ====================================================================
      for (const fog of fogBillows) {
        if (fog.depth === 0) {
          fog.x += fog.vx + currentWind * 0.035;
          fog.y += fog.vy;

          if (fog.x > width + fog.radiusX) fog.x = -fog.radiusX;
          if (fog.x < -fog.radiusX) fog.x = width + fog.radiusX;
          if (fog.y > height + fog.radiusY) fog.y = -fog.radiusY;
          if (fog.y < -fog.radiusY) fog.y = height + fog.radiusY;

          drawFogCloud(ctx, fog, wEng.fogDensity);
        }
      }

      // Ground and Horizon Soft Fog Layers
      const groundFogAlpha = 0.035 * wEng.fogDensity;
      const gFogGrad = ctx.createLinearGradient(0, height, 0, height - 180);
      gFogGrad.addColorStop(0, `rgba(${fogR}, ${fogG}, ${fogB}, ${groundFogAlpha})`);
      gFogGrad.addColorStop(0.65, `rgba(${fogR}, ${fogG}, ${fogB}, ${groundFogAlpha * 0.4})`);
      gFogGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gFogGrad;
      ctx.fillRect(0, height - 180, width, 180);

      // Blizzard veil streaking (when blizzard is active)
      if (wEng.blizzardIntensity > 0.05) {
        const bAlpha = 0.018 * wEng.blizzardIntensity;
        ctx.save();
        ctx.fillStyle = `rgba(224, 242, 254, ${bAlpha})`;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // ====================================================================
      // 6. RENDER TRANSLUCENT & DELICATE SNOWFLAKES
      // ====================================================================
      const targetActiveCount = Math.max(
        12,
        Math.min(flakes.length, Math.floor(flakes.length * wEng.activeDensity))
      );

      for (let i = 0; i < flakes.length; i++) {
        const flake = flakes[i];
        const isTargetActive = i < targetActiveCount;

        const targetAlpha = isTargetActive 
          ? flake.baseAlpha * (isStillness ? 0.85 : 1.0) 
          : 0;
        flake.alpha += (targetAlpha - flake.alpha) * 0.035;

        if (flake.alpha <= 0.005) continue;

        // Horizontal sway
        flake.swayPhase += flake.swaySpeed;
        const swayOffsetX = Math.sin(flake.swayPhase) * flake.swayAmp;

        // Depth perspective factor
        const depthFactor = flake.depth === 2 ? 1.2 : flake.depth === 1 ? 0.95 : 0.65;
        const windDrift = currentWind * depthFactor;

        // Interactive pointer breeze push
        let pointerBreezeX = 0;
        let pointerBreezeY = 0;
        if (pointer.active) {
          const dx = flake.x - pointer.x;
          const dy = flake.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 28000) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 175) * 1.4;
            pointerBreezeX = (dx / (dist || 1)) * force + pointer.vx * 0.6;
            pointerBreezeY = (dy / (dist || 1)) * force * 0.5;
          }
        }

        // Vertical speed modulation:
        let speedMultiplier = isStillness 
          ? 0.28 
          : isBlizzard 
          ? 1.5 
          : isPillow 
          ? 0.72 
          : 0.95;

        const liftEffect = wEng.windLift * (1.1 - flake.depth * 0.3);
        flake.vy = Math.max(0.08, flake.baseVy * speedMultiplier - liftEffect);

        flake.x += windDrift + swayOffsetX + pointerBreezeX;
        flake.y += flake.vy + pointerBreezeY;

        const targetTilt = windDrift * 0.08;
        flake.angle += flake.spinSpeed + (targetTilt - (flake.angle % (Math.PI * 2))) * 0.02;

        // Screen boundary wrapping
        if (flake.y > height + 25) {
          const fresh = createFlake(flake.id, true);
          Object.assign(flake, fresh);
        } else if (flake.y < -45) {
          flake.y = height + 10;
        }

        if (flake.x < -45) {
          flake.x = width + 40;
        } else if (flake.x > width + 45) {
          flake.x = -40;
        }

        ctx.save();
        ctx.translate(flake.x, flake.y);
        ctx.rotate(flake.angle);

        switch (flake.type) {
          case 'micro_dust':
            drawMicroDust(ctx, flake.size, flake.alpha);
            break;
          case 'soft_down':
            drawSoftDown(ctx, flake.size, flake.alpha);
            break;
          case 'fluffy_clump':
            drawFluffyClump(ctx, flake, flake.alpha);
            break;
        }

        ctx.restore();
      }

      // ====================================================================
      // 7. RENDER FOREGROUND FOG VEIL
      // ====================================================================
      for (const fog of fogBillows) {
        if (fog.depth === 1) {
          fog.x += fog.vx + currentWind * 0.045;
          fog.y += fog.vy;

          if (fog.x > width + fog.radiusX) fog.x = -fog.radiusX;
          if (fog.x < -fog.radiusX) fog.x = width + fog.radiusX;
          if (fog.y > height + fog.radiusY) fog.y = -fog.radiusY;
          if (fog.y < -fog.radiusY) fog.y = height + fog.radiusY;

          drawFogCloud(ctx, fog, wEng.fogDensity);
        }
      }

      if (isRunning && !document.hidden) {
        animId = requestAnimationFrame(render);
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        if (animId) cancelAnimationFrame(animId);
      } else {
        if (!isRunning) {
          isRunning = true;
          animId = requestAnimationFrame(render);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [timeOfDay, isPerfBoost]);

  const activeConfig = TIME_CONFIGS[timeOfDay];

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 transition-colors duration-1000 bg-gradient-to-b ${activeConfig.bgGradient}`}>
      {/* Deep meditative ambient background aura */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: activeConfig.ambientGlow,
        }}
      />
      {/* Volumetric Fog & Mist Ambience Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 65%, rgba(186, 230, 253, 0.045) 0%, rgba(148, 163, 184, 0.02) 50%, transparent 80%),
            radial-gradient(ellipse at 25% 35%, rgba(224, 242, 254, 0.03) 0%, transparent 60%)
          `,
        }}
      />
      {/* Bottom ground mist veil */}
      <div 
        className="absolute bottom-0 inset-x-0 h-64 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(186, 230, 253, 0.036) 0%, transparent 100%)',
        }}
      />
      {/* Top subtle twilight fog */}
      <div 
        className="absolute top-0 inset-x-0 h-44 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(186, 230, 253, 0.024) 0%, transparent 100%)',
        }}
      />
      {!isPerfBoost && (
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
      )}
    </div>
  );
});
