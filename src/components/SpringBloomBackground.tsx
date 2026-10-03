import React, { useEffect, useRef, useState, useCallback } from 'react';

export type SpringTimeOfDay = 'dawn' | 'afternoon' | 'sunset' | 'night';

export interface SpringTimeTheme {
  id: SpringTimeOfDay;
  name: string;
  badge: string;
  bgGradient: string;
  ambientVignette: string;
  pollenColorRgb: [number, number, number];
  hasFireflies: boolean;
  leafRatio: number; // 0 to 1 ratio of fresh emerald leaves vs blossom petals
}

export const SPRING_TIME_THEMES: Record<SpringTimeOfDay, SpringTimeTheme> = {
  dawn: {
    id: 'dawn',
    name: 'Весняний світанок',
    badge: 'Світанок 🌸',
    bgGradient: 'radial-gradient(ellipse 110% 80% at 50% 15%, rgba(244, 114, 182, 0.12) 0%, rgba(251, 207, 232, 0.08) 35%, rgba(74, 222, 128, 0.05) 65%, transparent 95%)',
    ambientVignette: 'radial-gradient(circle at 50% 30%, rgba(255, 241, 242, 0.06) 0%, transparent 70%)',
    pollenColorRgb: [253, 224, 71],
    hasFireflies: false,
    leafRatio: 0.2,
  },
  afternoon: {
    id: 'afternoon',
    name: 'Сонячний полудень',
    badge: 'Полудень ☀️',
    bgGradient: 'radial-gradient(ellipse 110% 80% at 50% 10%, rgba(250, 204, 21, 0.11) 0%, rgba(134, 239, 172, 0.08) 40%, rgba(56, 189, 248, 0.05) 70%, transparent 95%)',
    ambientVignette: 'radial-gradient(circle at 60% 25%, rgba(254, 240, 138, 0.08) 0%, transparent 75%)',
    pollenColorRgb: [250, 204, 21],
    hasFireflies: false,
    leafRatio: 0.35,
  },
  sunset: {
    id: 'sunset',
    name: 'Бузковий захід',
    badge: 'Захід 🪻',
    bgGradient: 'radial-gradient(ellipse 110% 80% at 50% 20%, rgba(192, 132, 252, 0.12) 0%, rgba(251, 146, 60, 0.09) 45%, rgba(244, 114, 182, 0.06) 75%, transparent 95%)',
    ambientVignette: 'radial-gradient(circle at 40% 35%, rgba(233, 213, 255, 0.07) 0%, transparent 70%)',
    pollenColorRgb: [251, 146, 60],
    hasFireflies: true,
    leafRatio: 0.25,
  },
  night: {
    id: 'night',
    name: 'Зоряний весняний сад',
    badge: 'Біо-ніч 🌙',
    bgGradient: 'radial-gradient(ellipse 110% 80% at 50% 15%, rgba(56, 189, 248, 0.08) 0%, rgba(168, 85, 247, 0.06) 40%, rgba(20, 184, 166, 0.05) 75%, transparent 95%)',
    ambientVignette: 'radial-gradient(circle at 50% 20%, rgba(186, 230, 253, 0.05) 0%, transparent 75%)',
    pollenColorRgb: [110, 231, 183],
    hasFireflies: true,
    leafRatio: 0.3,
  },
};

export const getSpringTimeOfDay = (date: Date = new Date()): SpringTimeOfDay => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return 'dawn';
  if (hour >= 11 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'sunset';
  return 'night';
};

export type PetalType = 'sakura' | 'apple_blossom' | 'wisteria' | 'young_leaf';

export interface ChromaticColorPalette {
  name: string;
  ambientRgb: [number, number, number];
  coreColor: string;
  midColor: string;
  outerGlow: string;
  petalGradStart: string;
  petalGradEnd: string;
  moteRgb: [number, number, number];
}

const SPRING_CHROMATIC_PALETTES: ChromaticColorPalette[] = [
  // 1. Сакура & Ранкова Роса (Sakura Dawn Mist)
  {
    name: 'sakura_dawn',
    ambientRgb: [244, 114, 182],
    coreColor: 'rgba(255, 241, 242, 0.88)',
    midColor: 'rgba(244, 114, 182, 0.52)',
    outerGlow: 'rgba(251, 207, 232, 0.25)',
    petalGradStart: 'rgba(255, 250, 252, 0.95)',
    petalGradEnd: 'rgba(244, 114, 182, 0.78)',
    moteRgb: [251, 207, 232],
  },
  // 2. Персиковий Цвіт (Apricot Sunburst)
  {
    name: 'apricot_sun',
    ambientRgb: [251, 146, 60],
    coreColor: 'rgba(255, 251, 235, 0.92)',
    midColor: 'rgba(251, 146, 60, 0.48)',
    outerGlow: 'rgba(254, 215, 170, 0.22)',
    petalGradStart: 'rgba(255, 247, 237, 0.92)',
    petalGradEnd: 'rgba(251, 146, 60, 0.72)',
    moteRgb: [254, 215, 170],
  },
  // 3. Бузкова Гліцинія (Lilac Wisteria Aura)
  {
    name: 'lilac_wisteria',
    ambientRgb: [192, 132, 252],
    coreColor: 'rgba(250, 245, 255, 0.9)',
    midColor: 'rgba(192, 132, 252, 0.5)',
    outerGlow: 'rgba(233, 213, 255, 0.24)',
    petalGradStart: 'rgba(250, 245, 255, 0.9)',
    petalGradEnd: 'rgba(168, 85, 247, 0.72)',
    moteRgb: [233, 213, 255],
  },
  // 4. Смарагдовий Молодий Пагін (Fresh Mint Leaf)
  {
    name: 'mint_dew',
    ambientRgb: [74, 222, 128],
    coreColor: 'rgba(240, 253, 244, 0.9)',
    midColor: 'rgba(74, 222, 128, 0.48)',
    outerGlow: 'rgba(187, 247, 208, 0.22)',
    petalGradStart: 'rgba(240, 253, 244, 0.92)',
    petalGradEnd: 'rgba(34, 197, 94, 0.7)',
    moteRgb: [187, 247, 208],
  },
  // 5. Весняний Лазуровий Дзвіночок (Azure Sky Blossom)
  {
    name: 'azure_sky',
    ambientRgb: [56, 189, 248],
    coreColor: 'rgba(240, 249, 255, 0.92)',
    midColor: 'rgba(56, 189, 248, 0.46)',
    outerGlow: 'rgba(186, 230, 253, 0.22)',
    petalGradStart: 'rgba(240, 249, 255, 0.9)',
    petalGradEnd: 'rgba(14, 165, 233, 0.68)',
    moteRgb: [186, 230, 253],
  },
  // 6. Золотий Пилок Медоносів (Honey Gold Pollen)
  {
    name: 'honey_gold',
    ambientRgb: [250, 204, 21],
    coreColor: 'rgba(254, 252, 232, 0.94)',
    midColor: 'rgba(250, 204, 21, 0.5)',
    outerGlow: 'rgba(254, 240, 138, 0.25)',
    petalGradStart: 'rgba(254, 252, 232, 0.92)',
    petalGradEnd: 'rgba(234, 179, 8, 0.72)',
    moteRgb: [254, 240, 138],
  },
];

interface ChromaticBurst {
  id: number;
  x: number;
  y: number;
  maxRadius: number;
  currentRadius: number;
  palette: ChromaticColorPalette;
  age: number;
  duration: number;
  alpha: number;
  peakAlpha: number;
  rippleCount: number;
  swayPhase: number;
  swaySpeed: number;
  petalsEjected: boolean;
}

interface SpringPetalParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: PetalType;
  palette: ChromaticColorPalette;
  // 3D rotations & fluttering
  angle: number;
  spinSpeed: number;
  tilt: number;
  tiltSpeed: number;
  roll: number;
  rollSpeed: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmp: number;
  zDepth: number; // 0.6 to 1.3
  age: number;
  maxAge: number;
  alpha: number;
  blur: number;
}

interface SpringPollenMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  r: number;
  g: number;
  b: number;
}

interface SpringFirefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  glowRadius: number;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  targetX: number;
  targetY: number;
}

export const SpringBloomBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentTimeOfDay, setCurrentTimeOfDay] = useState<SpringTimeOfDay>(() => getSpringTimeOfDay());

  const [isPerfBoost, setIsPerfBoost] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:perf-boost') === 'true';
    } catch {
      return false;
    }
  });

  // Effective time of day: fully automatic by real-world clock
  const effectiveTime: SpringTimeOfDay = currentTimeOfDay;
  const currentTheme = SPRING_TIME_THEMES[effectiveTime];
  const effectiveTimeRef = useRef<SpringTimeOfDay>(effectiveTime);
  effectiveTimeRef.current = effectiveTime;

  // Pointer interaction
  const pointerWindRef = useRef<{
    x: number;
    y: number;
    active: boolean;
    vx: number;
    vy: number;
    prevX: number;
    prevY: number;
  }>({
    x: 0,
    y: 0,
    active: false,
    vx: 0,
    vy: 0,
    prevX: 0,
    prevY: 0,
  });

  // Keep auto time of day updated by current clock
  useEffect(() => {
    const update = () => setCurrentTimeOfDay(getSpringTimeOfDay());
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

  // Clock tick to update time-of-day automatically every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimeOfDay(getSpringTimeOfDay());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Main canvas animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isRunning = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : (e as MouseEvent).clientY;
      if (clientX !== undefined && clientY !== undefined) {
        const prevX = pointerWindRef.current.x || clientX;
        const prevY = pointerWindRef.current.y || clientY;
        const dx = clientX - prevX;
        const dy = clientY - prevY;
        pointerWindRef.current = {
          x: clientX,
          y: clientY,
          active: true,
          vx: Math.max(-4, Math.min(4, dx * 0.18)),
          vy: Math.max(-4, Math.min(4, dy * 0.18)),
          prevX,
          prevY,
        };
      }
    };

    const handlePointerEnd = () => {
      pointerWindRef.current.active = false;
      pointerWindRef.current.vx *= 0.5;
      pointerWindRef.current.vy *= 0.5;
    };

    // User touch/click triggers a sakura blossom explosion with expanding ripples
    const handlePointerClick = (e: MouseEvent | TouchEvent) => {
      const clientX = 'changedTouches' in e && e.changedTouches[0] ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'changedTouches' in e && e.changedTouches[0] ? e.changedTouches[0].clientY : (e as MouseEvent).clientY;
      if (clientX !== undefined && clientY !== undefined) {
        spawnChromaticBurst(clientX, clientY, 1.35);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchstart', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerEnd, { passive: true });
    window.addEventListener('mouseleave', handlePointerEnd);
    window.addEventListener('click', handlePointerClick);

    // ========================================================================
    // 1. PARTICLES & ARRAYS
    // ========================================================================
    const bursts: ChromaticBurst[] = [];
    const petals: SpringPetalParticle[] = [];
    let nextEntityId = 1;

    // Helper: spawn chromatic color burst
    const spawnChromaticBurst = (customX?: number, customY?: number, scaleMult = 1.0) => {
      const marginX = Math.min(120, width * 0.1);
      const marginY = Math.min(120, height * 0.1);
      const x = customX !== undefined ? customX : marginX + Math.random() * (width - marginX * 2);
      const y = customY !== undefined ? customY : marginY + Math.random() * (height - marginY * 2);

      const palette = SPRING_CHROMATIC_PALETTES[Math.floor(Math.random() * SPRING_CHROMATIC_PALETTES.length)];
      const maxRadius = (85 + Math.random() * 80) * scaleMult;

      bursts.push({
        id: nextEntityId++,
        x,
        y,
        maxRadius,
        currentRadius: 6,
        palette,
        age: 0,
        duration: 170 + Math.floor(Math.random() * 80),
        alpha: 0,
        peakAlpha: 0.32 + Math.random() * 0.16,
        rippleCount: 3,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.018 + Math.random() * 0.015,
        petalsEjected: false,
      });
    };

    // Helper: eject botanical petals from burst heart
    const ejectPetals = (burst: ChromaticBurst) => {
      const count = isPerfBoost ? 4 + Math.floor(Math.random() * 3) : 7 + Math.floor(Math.random() * 5);
      const windPushX = 0.55 + Math.random() * 0.5;

      const leafRatio = SPRING_TIME_THEMES[effectiveTimeRef.current].leafRatio;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 1.8;
        const size = 4.0 + Math.random() * 4.2;

        let type: PetalType = 'sakura';
        const rand = Math.random();
        if (rand < leafRatio) {
          type = 'young_leaf';
        } else if (rand < 0.6) {
          type = 'apple_blossom';
        } else if (rand < 0.85) {
          type = 'sakura';
        } else {
          type = 'wisteria';
        }

        petals.push({
          id: nextEntityId++,
          x: burst.x + Math.cos(angle) * (burst.currentRadius * 0.3),
          y: burst.y + Math.sin(angle) * (burst.currentRadius * 0.3),
          vx: Math.cos(angle) * speed + windPushX,
          vy: Math.sin(angle) * speed * 0.65 + (0.15 + Math.random() * 0.45),
          size,
          type,
          palette: burst.palette,
          angle: Math.random() * Math.PI * 2,
          spinSpeed: (Math.random() - 0.5) * 0.03,
          tilt: Math.random() * Math.PI,
          tiltSpeed: 0.018 + Math.random() * 0.025,
          roll: Math.random() * Math.PI,
          rollSpeed: 0.014 + Math.random() * 0.02,
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.02 + Math.random() * 0.02,
          swayAmp: 0.7 + Math.random() * 0.9,
          zDepth: 0.7 + Math.random() * 0.5,
          age: 0,
          maxAge: 300 + Math.floor(Math.random() * 220),
          alpha: 0.82,
          blur: 0,
        });
      }
    };

    // Pre-seed some floating petals across the screen
    const initialPetalCount = isPerfBoost ? 8 : 18;
    for (let i = 0; i < initialPetalCount; i++) {
      const palette = SPRING_CHROMATIC_PALETTES[Math.floor(Math.random() * SPRING_CHROMATIC_PALETTES.length)];
      const rand = Math.random();
      const type: PetalType = rand < 0.3 ? 'young_leaf' : rand < 0.7 ? 'sakura' : 'apple_blossom';
      petals.push({
        id: nextEntityId++,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0.6 + Math.random() * 0.6,
        vy: 0.25 + Math.random() * 0.5,
        size: 4.2 + Math.random() * 3.8,
        type,
        palette,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.025,
        tilt: Math.random() * Math.PI,
        tiltSpeed: 0.015 + Math.random() * 0.02,
        roll: Math.random() * Math.PI,
        rollSpeed: 0.015 + Math.random() * 0.02,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.02 + Math.random() * 0.02,
        swayAmp: 0.7 + Math.random() * 0.8,
        zDepth: 0.75 + Math.random() * 0.45,
        age: Math.floor(Math.random() * 150),
        maxAge: 320 + Math.floor(Math.random() * 200),
        alpha: 0.8,
        blur: 0,
      });
    }

    // Warm Golden Pollen Motes & Spring Stardust
    const MOTE_COUNT = isPerfBoost ? 16 : 32;
    const motes: SpringPollenMote[] = [];
    for (let i = 0; i < MOTE_COUNT; i++) {
      const isWarm = Math.random() > 0.35;
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0.15 + Math.random() * 0.35,
        vy: -0.18 - Math.random() * 0.32, // Float upward on thermal spring air
        radius: 1.0 + Math.random() * 2.2,
        alpha: 0.2 + Math.random() * 0.5,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.018 + Math.random() * 0.025,
        r: isWarm ? 254 : 244,
        g: isWarm ? 240 : 190,
        b: isWarm ? 138 : 220,
      });
    }

    // Spring Fireflies (Night & Sunset only)
    const fireflyCount = isPerfBoost ? 6 : 14;
    const fireflies: SpringFirefly[] = [];
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1.5 + Math.random() * 1.5,
        glowRadius: 10 + Math.random() * 14,
        alpha: 0,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.025 + Math.random() * 0.03,
        targetX: Math.random() * width,
        targetY: Math.random() * height,
      });
    }

    // Initial 2-3 ambient color bursts
    const initialBurstCount = isPerfBoost ? 2 : 3;
    for (let i = 0; i < initialBurstCount; i++) {
      spawnChromaticBurst();
    }

    // ========================================================================
    // 2. PROCEDURAL DRAWING PRIMITIVES
    // ========================================================================



    // 2. Draw Botanical Petal
    const drawPetal = (c: CanvasRenderingContext2D, p: SpringPetalParticle) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.angle);

      // 3D tumble perspective
      const cosTilt = Math.cos(p.tilt);
      const cosRoll = Math.cos(p.roll);
      const scaleX = Math.max(0.18, Math.abs(cosTilt)) * p.zDepth;
      const scaleY = Math.max(0.2, Math.abs(cosRoll)) * p.zDepth;
      c.scale(scaleX, scaleY);

      if (p.blur > 0.5) {
        c.shadowColor = p.palette.midColor;
        c.shadowBlur = p.blur;
      }

      const len = p.size;
      const wid = p.size * 0.58;

      if (p.type === 'sakura') {
        // Sakura petal with iconic top notch
        c.beginPath();
        c.moveTo(0, len * 0.55); // base
        c.bezierCurveTo(-wid, len * 0.2, -wid * 0.95, -len * 0.45, -wid * 0.3, -len * 0.6);
        c.lineTo(0, -len * 0.48); // notch dent
        c.lineTo(wid * 0.3, -len * 0.6);
        c.bezierCurveTo(wid * 0.95, -len * 0.45, wid, len * 0.2, 0, len * 0.55);
        c.closePath();
      } else if (p.type === 'young_leaf') {
        // Fresh spring shoot leaf with gentle curved tip
        c.beginPath();
        c.moveTo(0, len * 0.65);
        c.bezierCurveTo(-wid * 0.85, len * 0.25, -wid * 0.9, -len * 0.2, 0, -len * 0.7);
        c.bezierCurveTo(wid * 0.9, -len * 0.2, wid * 0.85, len * 0.25, 0, len * 0.65);
        c.closePath();
      } else if (p.type === 'wisteria') {
        // Teardrop wisteria/lilac bell floret
        c.beginPath();
        c.moveTo(0, len * 0.6);
        c.bezierCurveTo(-wid * 1.1, len * 0.3, -wid * 0.7, -len * 0.5, 0, -len * 0.65);
        c.bezierCurveTo(wid * 0.7, -len * 0.5, wid * 1.1, len * 0.3, 0, len * 0.6);
        c.closePath();
      } else {
        // Apple/Cherry blossom rounded silky petal
        c.beginPath();
        c.moveTo(0, len * 0.5);
        c.bezierCurveTo(-wid, len * 0.2, -wid * 0.8, -len * 0.5, 0, -len * 0.6);
        c.bezierCurveTo(wid * 0.8, -len * 0.5, wid, len * 0.2, 0, len * 0.5);
        c.closePath();
      }

      // Shading based on tumble side (front vs back of petal)
      const isFront = cosTilt >= 0;
      const grad = c.createLinearGradient(0, -len * 0.6, 0, len * 0.55);
      if (p.type === 'young_leaf') {
        grad.addColorStop(0, isFront ? 'rgba(240, 253, 244, 0.95)' : 'rgba(187, 247, 208, 0.9)');
        grad.addColorStop(1, isFront ? 'rgba(34, 197, 94, 0.75)' : 'rgba(21, 128, 61, 0.8)');
      } else {
        grad.addColorStop(0, isFront ? p.palette.petalGradStart : p.palette.petalGradEnd);
        grad.addColorStop(1, isFront ? p.palette.petalGradEnd : p.palette.petalGradStart);
      }

      c.fillStyle = grad;
      c.globalAlpha = p.alpha;
      c.fill();

      // Subtle delicate translucent central vein for leaves and sakura
      if ((p.type === 'young_leaf' || p.type === 'sakura') && p.size > 5) {
        c.beginPath();
        c.moveTo(0, len * 0.45);
        c.lineTo(0, -len * 0.35);
        c.strokeStyle = p.type === 'young_leaf' ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.28)';
        c.lineWidth = 0.8;
        c.stroke();
      }

      c.restore();
    };

    // 3. Draw Watercolor Bloom Burst
    const drawChromaticBurst = (c: CanvasRenderingContext2D, burst: ChromaticBurst) => {
      c.save();
      c.translate(burst.x, burst.y);

      const r = burst.currentRadius;
      const alpha = burst.alpha;

      const grad = c.createRadialGradient(0, 0, 0, 0, 0, r);
      grad.addColorStop(0, burst.palette.coreColor);
      grad.addColorStop(0.35, burst.palette.midColor);
      grad.addColorStop(0.75, burst.palette.outerGlow);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      c.globalAlpha = alpha;
      c.fillStyle = grad;
      c.beginPath();
      c.arc(0, 0, r, 0, Math.PI * 2);
      c.fill();

      // Concentric waking nature ripples
      for (let i = 0; i < burst.rippleCount; i++) {
        const ripplePhase = (burst.age * 0.018 + (i / burst.rippleCount)) % 1;
        const rippleR = r * ripplePhase;
        const rippleAlpha = Math.sin(ripplePhase * Math.PI) * alpha * 0.38;

        c.beginPath();
        c.arc(0, 0, rippleR, 0, Math.PI * 2);
        c.strokeStyle = burst.palette.midColor;
        c.lineWidth = 1.2;
        c.globalAlpha = rippleAlpha;
        c.stroke();
      }

      c.restore();
    };

    // 4. Draw Fireflies
    const drawFirefly = (c: CanvasRenderingContext2D, f: SpringFirefly) => {
      c.save();
      c.translate(f.x, f.y);

      // Outer soft volumetric bioluminescent halo
      const grad = c.createRadialGradient(0, 0, 0, 0, 0, f.glowRadius);
      grad.addColorStop(0, `rgba(167, 243, 208, ${f.alpha * 0.85})`);
      grad.addColorStop(0.4, `rgba(52, 211, 153, ${f.alpha * 0.4})`);
      grad.addColorStop(1, 'transparent');

      c.fillStyle = grad;
      c.beginPath();
      c.arc(0, 0, f.glowRadius, 0, Math.PI * 2);
      c.fill();

      // Tiny white-gold core spark
      c.beginPath();
      c.arc(0, 0, f.radius, 0, Math.PI * 2);
      c.fillStyle = `rgba(255, 255, 255, ${f.alpha * 0.95})`;
      c.fill();

      c.restore();
    };

    let globalTime = 0;
    let spawnTimer = 0;
    let lastFrameTime = performance.now();

    // ========================================================================
    // 3. MAIN ANIMATION & RENDERING LOOP
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
      globalTime += 0.016;
      spawnTimer++;

      ctx.clearRect(0, 0, width, height);

      const activeTheme = SPRING_TIME_THEMES[effectiveTimeRef.current];

      // Periodically spawn natural watercolor bursts
      const maxActiveBursts = isPerfBoost ? 3 : 5;
      if (spawnTimer >= 95 && bursts.length < maxActiveBursts) {
        spawnTimer = 0;
        spawnChromaticBurst();
      }

      // 1. Draw & Update Warm Pollen Motes
      const [pr, pg, pb] = activeTheme.pollenColorRgb;
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.pulsePhase += m.pulseSpeed;
        m.x += m.vx + Math.sin(globalTime + i) * 0.28;
        m.y += m.vy;

        if (m.y < -15) m.y = height + 15;
        if (m.x > width + 15) m.x = -15;

        const currentAlpha = m.alpha * (0.6 + Math.sin(m.pulsePhase) * 0.4);

        ctx.save();
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${currentAlpha})`;
        ctx.shadowColor = `rgba(${pr}, ${pg}, ${pb}, ${currentAlpha * 0.8})`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // 2. Update & Draw Fireflies (if active in this phase)
      if (activeTheme.hasFireflies) {
        for (let i = 0; i < fireflies.length; i++) {
          const f = fireflies[i];
          f.pulsePhase += f.pulseSpeed;
          f.alpha = Math.max(0, Math.sin(f.pulsePhase)) * 0.85;

          // Wandering motion
          const dx = f.targetX - f.x;
          const dy = f.targetY - f.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 40 || Math.random() < 0.015) {
            f.targetX = Math.random() * width;
            f.targetY = Math.random() * height;
          }

          f.vx += (dx / (dist || 1)) * 0.035;
          f.vy += (dy / (dist || 1)) * 0.035;
          f.vx *= 0.96;
          f.vy *= 0.96;

          f.x += f.vx + Math.sin(globalTime * 1.5 + i) * 0.35;
          f.y += f.vy + Math.cos(globalTime * 1.2 + i) * 0.35;

          if (f.alpha > 0.02) {
            drawFirefly(ctx, f);
          }
        }
      }

      // 3. Update & Render Chromatic Bursts
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.age++;
        const progress = b.age / b.duration;

        const easeOut = 1 - Math.pow(1 - progress, 2.2);
        b.currentRadius = 6 + (b.maxRadius - 6) * easeOut;

        if (progress < 0.25) {
          b.alpha = (progress / 0.25) * b.peakAlpha;
        } else if (progress < 0.65) {
          b.alpha = b.peakAlpha;
        } else {
          const fadeOut = (progress - 0.65) / 0.35;
          b.alpha = Math.max(0, b.peakAlpha * (1 - fadeOut));
        }

        if (progress >= 0.28 && !b.petalsEjected) {
          b.petalsEjected = true;
          ejectPetals(b);
        }

        if (progress >= 1 || b.alpha <= 0.005) {
          bursts.splice(i, 1);
          continue;
        }

        drawChromaticBurst(ctx, b);
      }

      // 4. Update & Render Botanical Petals & Shoots
      const windSway = Math.sin(globalTime * 0.75) * 0.7;
      const pointer = pointerWindRef.current;

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.age++;
        const lifeRatio = p.age / p.maxAge;

        // Life cycle and bokeh dissolution
        if (lifeRatio > 0.6) {
          const dissolveProgress = (lifeRatio - 0.6) / 0.4;
          p.alpha = Math.max(0, 0.82 * (1 - dissolveProgress));
          p.blur = dissolveProgress * 15;
          p.size *= 1.001;
        }

        if (lifeRatio >= 1 || p.alpha <= 0.008) {
          petals.splice(i, 1);
          continue;
        }

        p.swayPhase += p.swaySpeed;
        p.angle += p.spinSpeed;
        p.tilt += p.tiltSpeed;
        p.roll += p.rollSpeed;

        const cosTilt = Math.cos(p.tilt);
        const sinSway = Math.sin(p.swayPhase) * p.swayAmp;

        // Pointer wind breeze push
        let pushX = 0;
        let pushY = 0;
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 25000) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 158) * 2.6;
            pushX = (dx / (dist || 1)) * force + pointer.vx * 0.45;
            pushY = (dy / (dist || 1)) * force * 0.35 + pointer.vy * 0.35;
          }
        }

        p.x += p.vx + windSway + sinSway + pushX;
        p.y += p.vy + Math.abs(cosTilt) * 0.4 + pushY;

        // Decelerate toward gentle breeze speed
        p.vx *= 0.99;
        if (p.vx < 0.5) p.vx = 0.5 + Math.random() * 0.25;

        if (p.x > width + 60) p.x = -40;
        if (p.y > height + 60) p.y = -40;

        drawPetal(ctx, p);
      }

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
      window.removeEventListener('touchstart', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerEnd);
      window.removeEventListener('mouseleave', handlePointerEnd);
      window.removeEventListener('click', handlePointerClick);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPerfBoost]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Dynamic Time-of-Day Atmospheric Gradient */}
      <div 
        className="absolute inset-0 transition-all duration-1000 opacity-95 dark:opacity-85"
        style={{
          background: currentTheme.bgGradient,
        }}
      />
      {/* Soft Spring Ambient Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: currentTheme.ambientVignette,
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
});
