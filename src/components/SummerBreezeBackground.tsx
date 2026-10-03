import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sun, Moon, Sunrise, Sunset, Wind, Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';

export type SeaTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type SummerWeatherPhase = 'calm_swell' | 'sunbeam_gleam' | 'breeze_gust' | 'glow_pulse';

export const getSummerTimeOfDay = (date: Date = new Date()): SeaTimeOfDay => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
};

interface AmbientTheme {
  name: string;
  badge: string;
  baseBg: string;
  meshGradients: {
    color1: string; // Radiant sun / sky highlight
    color2: string; // Tropical aqua / azure water glow
    color3: string; // Deep oceanic mood tone
    color4: string; // Velvet atmospheric depth
  };
  sunPosition: { x: number; y: number }; // normalized (0..1)
  sunbeamColor: string;
  causticColor: string;
  foamColor: string;
  foamGlow: string;
  sparkleColor: string;
  moteRgb: [number, number, number];
  bottomHazeColor: string;
  waveTints: [string, string, string, string];
}

const SUMMER_AMBIENT_THEMES: Record<SeaTimeOfDay, AmbientTheme> = {
  morning: {
    name: 'Лагідний літній світанок',
    badge: 'Світанок 🌅',
    baseBg: '#04101e',
    meshGradients: {
      color1: 'rgba(251, 146, 60, 0.30)',   // Soft Peach Sunrise
      color2: 'rgba(56, 189, 248, 0.32)',   // Crystal Azure Water
      color3: 'rgba(20, 184, 166, 0.24)',   // Morning Aquamarine
      color4: 'rgba(6, 22, 42, 0.85)',      // Deep Coastal Horizon
    },
    sunPosition: { x: 0.24, y: 0.14 },
    sunbeamColor: 'rgba(254, 215, 170, 0.16)',
    causticColor: 'rgba(254, 243, 199, 0.32)',
    foamColor: 'rgba(255, 247, 237, 0.85)',
    foamGlow: 'rgba(251, 146, 60, 0.40)',
    sparkleColor: 'rgba(255, 251, 235, 0.90)',
    moteRgb: [253, 230, 138],
    bottomHazeColor: 'rgba(4, 16, 30, 0.92)',
    waveTints: [
      'rgba(12, 74, 110, 0.35)',
      'rgba(14, 116, 144, 0.40)',
      'rgba(13, 148, 136, 0.45)',
      'rgba(6, 182, 212, 0.50)',
    ],
  },
  afternoon: {
    name: 'Тропічний лазуровий полудень',
    badge: 'Полудень ☀️',
    baseBg: '#020d1c',
    meshGradients: {
      color1: 'rgba(6, 182, 212, 0.34)',    // Radiant Turquoise Lagoon
      color2: 'rgba(14, 165, 233, 0.38)',   // Azure Horizon Sky
      color3: 'rgba(245, 158, 11, 0.22)',   // Golden Sunlight Flare
      color4: 'rgba(3, 18, 36, 0.85)',      // Deep Mediterranean Trench
    },
    sunPosition: { x: 0.50, y: 0.10 },
    sunbeamColor: 'rgba(224, 242, 254, 0.20)',
    causticColor: 'rgba(255, 255, 255, 0.42)',
    foamColor: 'rgba(240, 249, 255, 0.90)',
    foamGlow: 'rgba(56, 189, 248, 0.50)',
    sparkleColor: 'rgba(255, 255, 255, 0.95)',
    moteRgb: [186, 230, 253],
    bottomHazeColor: 'rgba(2, 13, 28, 0.92)',
    waveTints: [
      'rgba(3, 105, 161, 0.35)',
      'rgba(2, 132, 199, 0.42)',
      'rgba(8, 145, 178, 0.48)',
      'rgba(6, 182, 212, 0.55)',
    ],
  },
  evening: {
    name: 'Оксамитовий золотий захід',
    badge: 'Захід сонця 🌇',
    baseBg: '#0c0717',
    meshGradients: {
      color1: 'rgba(244, 114, 182, 0.32)',  // Velvet Sakura & Coral
      color2: 'rgba(251, 146, 60, 0.30)',   // Warm Sunset Amber Glow
      color3: 'rgba(147, 51, 234, 0.26)',   // Twilight Lavender Sea
      color4: 'rgba(14, 7, 26, 0.85)',      // Nocturnal Indigo
    },
    sunPosition: { x: 0.76, y: 0.22 },
    sunbeamColor: 'rgba(253, 186, 116, 0.20)',
    causticColor: 'rgba(254, 215, 170, 0.35)',
    foamColor: 'rgba(255, 241, 242, 0.88)',
    foamGlow: 'rgba(244, 114, 182, 0.45)',
    sparkleColor: 'rgba(254, 240, 138, 0.92)',
    moteRgb: [252, 211, 77],
    bottomHazeColor: 'rgba(12, 7, 23, 0.94)',
    waveTints: [
      'rgba(88, 28, 135, 0.35)',
      'rgba(157, 23, 77, 0.40)',
      'rgba(194, 65, 12, 0.44)',
      'rgba(244, 114, 182, 0.50)',
    ],
  },
  night: {
    name: 'Біолюмінесцентна зоряна ніч',
    badge: 'Ніч & Неон 🌌',
    baseBg: '#010512',
    meshGradients: {
      color1: 'rgba(6, 182, 212, 0.28)',    // Bioluminescent Cyan Lagoon
      color2: 'rgba(99, 102, 241, 0.28)',   // Cosmic Deep Indigo
      color3: 'rgba(168, 85, 247, 0.22)',   // Luminescent Violet Aura
      color4: 'rgba(2, 6, 20, 0.90)',       // Abyssal Night Depths
    },
    sunPosition: { x: 0.82, y: 0.15 },      // Soft silver moonlight
    sunbeamColor: 'rgba(147, 197, 253, 0.14)',
    causticColor: 'rgba(34, 211, 238, 0.40)',
    foamColor: 'rgba(207, 250, 254, 0.88)',
    foamGlow: 'rgba(34, 211, 238, 0.65)',
    sparkleColor: 'rgba(165, 243, 252, 0.98)',
    moteRgb: [103, 232, 249],
    bottomHazeColor: 'rgba(1, 5, 18, 0.95)',
    waveTints: [
      'rgba(30, 27, 75, 0.40)',
      'rgba(15, 23, 42, 0.50)',
      'rgba(14, 116, 144, 0.45)',
      'rgba(6, 182, 212, 0.50)',
    ],
  },
};

// Interactive Water Ripple (кільця на воді при дотику)
interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  strength: number;
}

// Airborne Sparkling Sea Spray Droplet (бризки води / сонячні іскорки)
interface SeaDroplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  life: number;
  maxLife: number;
  isBioluminescent: boolean;
}

// Floating Summer Mist & Pollen / Plankton Mote
interface SummerMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  depth: number;
}

// Caustic Net Node (сонячні зайчики на поверхні води)
interface CausticGlint {
  xRatio: number;
  yRatio: number;
  size: number;
  phase: number;
  speed: number;
  alpha: number;
}

export const SummerBreezeBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentTimeOfDay, setCurrentTimeOfDay] = useState<SeaTimeOfDay>(() => getSummerTimeOfDay());

  const [isPerfBoost, setIsPerfBoost] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:perf-boost') === 'true';
    } catch {
      return false;
    }
  });

  // Effective time of day: fully automatic by real-world clock
  const effectiveTime: SeaTimeOfDay = currentTimeOfDay;
  const theme = SUMMER_AMBIENT_THEMES[effectiveTime];
  const effectiveTimeRef = useRef<SeaTimeOfDay>(effectiveTime);
  effectiveTimeRef.current = effectiveTime;

  // Pointer state for interactive breeze & touch waves
  const pointerRef = useRef<{
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    active: boolean;
    intensity: number;
    vx: number;
    vy: number;
  }>({
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    active: false,
    intensity: 0,
    vx: 0,
    vy: 0,
  });

  // Keep auto time of day updated by current clock
  useEffect(() => {
    const update = () => setCurrentTimeOfDay(getSummerTimeOfDay());
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  // Performance boost listener
  useEffect(() => {
    const handlePerfChange = () => {
      try {
        setIsPerfBoost(localStorage.getItem('quit-smoking:perf-boost') === 'true');
      } catch {}
    };
    window.addEventListener('perf-boost-change', handlePerfChange);
    return () => window.removeEventListener('perf-boost-change', handlePerfChange);
  }, []);

  // Canvas Ocean & Breeze Simulation Engine
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

    // Arrays of dynamic elements
    const ripples: WaterRipple[] = [];
    const droplets: SeaDroplet[] = [];
    const motes: SummerMote[] = [];
    const caustics: CausticGlint[] = [];

    // Initialize Summer Motes (mist, sun dust, sea plankton)
    const moteCount = 38;
    for (let i = 0; i < moteCount; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0.15 + Math.random() * 0.45,
        vy: -0.10 + Math.random() * 0.20,
        radius: 1.2 + Math.random() * 2.8,
        alpha: 0.2 + Math.random() * 0.6,
        baseAlpha: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.015 + Math.random() * 0.03,
        depth: 0.5 + Math.random() * 0.5,
      });
    }

    // Initialize Caustic Glints (dancing sun highlights)
    const causticCount = 28;
    for (let i = 0; i < causticCount; i++) {
      caustics.push({
        xRatio: 0.05 + Math.random() * 0.90,
        yRatio: 0.35 + Math.random() * 0.55,
        size: 8 + Math.random() * 22,
        phase: Math.random() * Math.PI * 2,
        speed: 0.012 + Math.random() * 0.025,
        alpha: 0.15 + Math.random() * 0.35,
      });
    }

    // Spawn water ripple & spray burst
    const spawnWaterSplash = (x: number, y: number, count: number = 10) => {
      // Ripple ring
      ripples.push({
        x,
        y,
        radius: 4,
        maxRadius: 130 + Math.random() * 50,
        alpha: 0.75,
        speed: 2.2 + Math.random() * 1.2,
        strength: 1.0,
      });

      // Droplets flying upward in an arc
    };

    // Pointer handlers
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : (e as MouseEvent).clientY;
      if (clientX !== undefined && clientY !== undefined) {
        const ptr = pointerRef.current;
        ptr.vx = clientX - ptr.x;
        ptr.vy = clientY - ptr.y;
        ptr.prevX = ptr.x;
        ptr.prevY = ptr.y;
        ptr.x = clientX;
        ptr.y = clientY;
        ptr.active = true;
        ptr.intensity = 1.0;

        // Trigger gentle splash on rapid swipe
        const speed = Math.hypot(ptr.vx, ptr.vy);
        if (speed > 16 && Math.random() < 0.4) {
          spawnWaterSplash(clientX, clientY, 4);
        }
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : (e as MouseEvent).clientY;
      if (clientX !== undefined && clientY !== undefined) {
        pointerRef.current.x = clientX;
        pointerRef.current.y = clientY;
        pointerRef.current.active = true;
        pointerRef.current.intensity = 1.0;
        spawnWaterSplash(clientX, clientY, 12);
      }
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('touchend', handlePointerLeave);

    let tick = 0;
    let lastFrameTime = performance.now();

    // ========================================================================
    // RENDER LOOP (100% Continuous, Seamless & Infinite)
    // ========================================================================
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

      const currentTheme = SUMMER_AMBIENT_THEMES[effectiveTimeRef.current];
      const isNight = effectiveTimeRef.current === 'night';

      // Continuous harmonic breeze oscillator (no abrupt jumps)
      const breezeOsc = Math.sin(tick * 0.0028);
      const breezeGust = Math.max(0, breezeOsc) * 0.6;

      // Smooth pointer intensity decay
      if (!pointerRef.current.active) {
        pointerRef.current.intensity *= 0.95;
      }

      // ----------------------------------------------------------------------
      // 2. SUNLIGHT CAUSTIC REFLECTIONS (Жива сітка сонячних зайчиків)
      // ----------------------------------------------------------------------
      for (let i = 0; i < caustics.length; i++) {
        const c = caustics[i];
        c.phase += c.speed;

        const cx = width * c.xRatio + Math.sin(c.phase * 0.7) * 20;
        const cy = height * c.yRatio + Math.cos(c.phase * 0.5) * 15;
        const curSize = c.size * (0.8 + Math.sin(c.phase) * 0.35);
        const curAlpha = c.alpha * (0.6 + Math.sin(c.phase * 1.2) * 0.4);

        const cGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, curSize);
        cGrad.addColorStop(0, currentTheme.causticColor.replace(/[\d\.]+\)$/, `${curAlpha})`));
        cGrad.addColorStop(0.5, currentTheme.causticColor.replace(/[\d\.]+\)$/, `${curAlpha * 0.35})`));
        cGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = cGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, curSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // ----------------------------------------------------------------------
      // 3. 4-TIER MULTI-HARMONIC OCEAN WAVES WITH REALISTIC FOAM CRESTS
      // ----------------------------------------------------------------------
      const waveLayers = 4;
      const stepX = 14;

      for (let w = 0; w < waveLayers; w++) {
        // Higher w = closer to front / higher amplitude
        const baseYRatio = 0.48 - w * 0.11;
        const amp = 14 + w * 9 + breezeGust * 8;
        const freq = 0.0032 + w * 0.0014;
        const speed = (w % 2 === 0 ? 1 : -1) * (0.008 + w * 0.004);
        const tideSwell = Math.sin(tick * 0.009 + w * 1.2) * (14 + w * 6);
        const baseY = height - height * baseYRatio - tideSwell;

        ctx.beginPath();
        ctx.moveTo(0, height);

        const startY = baseY + Math.sin(tick * speed) * amp;
        ctx.lineTo(0, startY);

        // Track wave points for crest line & foam
        const wavePoints: { x: number; y: number }[] = [];

        for (let x = 0; x <= width + stepX; x += stepX) {
          const wave1 = Math.sin(x * freq + tick * speed) * amp;
          const wave2 = Math.cos(x * freq * 1.6 - tick * speed * 1.2) * (amp * 0.42);
          const wave3 = Math.sin(x * freq * 0.6 + tick * speed * 0.5) * (amp * 0.25);

          // Interaction with pointer
          const distToPtr = Math.abs(x - pointerRef.current.x);
          const touchEffect = pointerRef.current.active && distToPtr < 240
            ? (1 - distToPtr / 240) * (Math.sin(tick * 0.14) * 14 * pointerRef.current.intensity)
            : 0;

          const y = baseY + wave1 + wave2 + wave3 + touchEffect;
          wavePoints.push({ x, y });
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Wave volumetric body gradient
        const waveGrad = ctx.createLinearGradient(0, baseY - amp * 2, 0, height);
        waveGrad.addColorStop(0, currentTheme.waveTints[w]);
        waveGrad.addColorStop(0.4, currentTheme.waveTints[w].replace(/[\d\.]+\)$/, '0.22)'));
        waveGrad.addColorStop(1, currentTheme.waveTints[w].replace(/[\d\.]+\)$/, '0.04)'));

        ctx.fillStyle = waveGrad;
        ctx.fill();

        // Wave Crest Lace Foam (Мереживна піна на гребені)
        ctx.save();
        ctx.beginPath();
        for (let p = 0; p < wavePoints.length; p++) {
          if (p === 0) ctx.moveTo(wavePoints[p].x, wavePoints[p].y);
          else ctx.lineTo(wavePoints[p].x, wavePoints[p].y);
        }
        ctx.strokeStyle = currentTheme.foamColor.replace(/[\d\.]+\)$/, `${0.35 + w * 0.15})`);
        ctx.lineWidth = 1.8 + w * 0.8;
        ctx.shadowColor = currentTheme.foamGlow;
        ctx.shadowBlur = 10 + w * 6;
        ctx.stroke();
        ctx.restore();

        // Shimmering micro foam bubbles on front wave
        if (w >= 2 && tick % 2 === 0) {
          for (let p = 0; p < wavePoints.length; p += 3) {
            const pt = wavePoints[p];
            if (Math.sin(pt.x * 0.05 + tick * 0.08) > 0.4) {
              ctx.fillStyle = currentTheme.sparkleColor;
              ctx.beginPath();
              ctx.arc(pt.x + Math.sin(tick * 0.1 + p) * 3, pt.y - 1.5, 1.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // ----------------------------------------------------------------------
      // 4. WATER RIPPLE RINGS (Інтерактивні кола на воді)
      // ----------------------------------------------------------------------
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += rip.speed;
        rip.alpha *= 0.965;

        if (rip.alpha < 0.02 || rip.radius > rip.maxRadius) {
          ripples.splice(r, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = currentTheme.sparkleColor.replace(/[\d\.]+\)$/, `${rip.alpha * 0.6})`);
        ctx.lineWidth = 2.0;
        ctx.shadowColor = currentTheme.foamGlow;
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Second subtle harmonic inner ring
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, Math.max(0, rip.radius * 0.7), 0, Math.PI * 2);
        ctx.strokeStyle = currentTheme.causticColor.replace(/[\d\.]+\)$/, `${rip.alpha * 0.4})`);
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // ----------------------------------------------------------------------
      // 6. FLOATING SUMMER MOTES & SEA BREEZE PLANKTON
      // ----------------------------------------------------------------------
      const windBonus = breezeGust * 0.5;

      for (let m = 0; m < motes.length; m++) {
        const mote = motes[m];
        mote.phase += mote.speed;
        mote.x += (mote.vx + windBonus);
        mote.y += mote.vy + Math.sin(mote.phase) * 0.35;

        // Wrap around seamlessly
        if (mote.x > width + 20) mote.x = -20;
        if (mote.y < -20) mote.y = height + 10;
        if (mote.y > height + 20) mote.y = -10;

        const currentAlpha = mote.baseAlpha * (0.6 + Math.sin(mote.phase) * 0.4);
        const [r, g, b] = currentTheme.moteRgb;

        ctx.save();
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
        if (isNight) {
          ctx.shadowColor = 'rgba(34, 211, 238, 0.9)';
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
          ctx.shadowBlur = 4;
        }
        ctx.fill();
        ctx.restore();
      }

      // ----------------------------------------------------------------------
      // 7. INTERACTIVE TOUCH GLOW RIPPLE (Removed as per request)
      // ----------------------------------------------------------------------

      if (isRunning && !document.hidden) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

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

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('touchend', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPerfBoost]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 transition-colors duration-1000 overflow-hidden"
      style={{ backgroundColor: theme.baseBg }}
    >
      {/* Dynamic Multi-Layered Oceanic Nebula Gradients */}
      <div 
        className="absolute -top-[15%] -left-[10%] w-[75vw] h-[75vw] rounded-full filter blur-[90px] opacity-75 transition-all duration-1000 pointer-events-none"
        style={{ background: theme.meshGradients.color1 }}
      />
      <div 
        className="absolute -bottom-[20%] -right-[15%] w-[85vw] h-[85vw] rounded-full filter blur-[100px] opacity-70 transition-all duration-1000 pointer-events-none"
        style={{ background: theme.meshGradients.color2 }}
      />
      <div 
        className="absolute top-[35%] right-[10%] w-[60vw] h-[60vw] rounded-full filter blur-[90px] opacity-60 transition-all duration-1000 pointer-events-none"
        style={{ background: theme.meshGradients.color3 }}
      />

      {/* Atmospheric Vignette & Soft Diffusion Glass Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none backdrop-blur-[2px]"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, transparent 35%, rgba(2, 6, 20, 0.48) 100%)',
        }}
      />

      {/* High-Performance Canvas for Waves, God Rays, Caustics, and Sprays */}
      {!isPerfBoost && (
        <canvas
          ref={canvasRef}
          className="w-full h-full block relative z-10 pointer-events-auto"
        />
      )}

      {/* Ethereal Soft Progressive Blur & Gradient Haze over Bottom Waves */}
      <div 
        className="absolute bottom-0 inset-x-0 h-64 sm:h-80 pointer-events-none backdrop-blur-[12px] z-20 transition-all duration-1000"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.4) 65%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.4) 65%, transparent 100%)',
          background: `linear-gradient(to top, ${theme.bottomHazeColor} 0%, rgba(6, 182, 212, 0.06) 50%, transparent 100%)`,
        }}
      />
    </div>
  );
});
