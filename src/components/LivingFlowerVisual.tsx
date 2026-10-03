import React, { useRef, useEffect, useCallback, useState } from 'react';
import { VisualEnergyMode } from './AnalyzerTip';
import { hslToRgb } from './LivingFireVisual';

export interface LivingFlowerVisualProps {
  mode: VisualEnergyMode;
  hasUnreadAdvice?: boolean;
  hasAdvice?: boolean;
  isThinking?: boolean;
  isDialogueActive?: boolean;
  isAllGood?: boolean;
  onClick: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  blurAmount?: number;
  calmHue?: number;
}

// Mystical Pollen particle swirling or bursting
interface PollenMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  hueOffset: number;
  orbitAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
  isBurst?: boolean;
  decay?: number;
  glow?: number;
}

// Detached micro-petal drifting or thrown in burst
interface FlowerDetachedPetal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  angle: number;
  spinSpeed: number;
  age: number;
  maxAge: number;
  hue: number;
  zScale: number;
  tilt: number;
  tiltSpeed: number;
}

// Dewdrop sparkle glint on petals
interface DewdropGlint {
  petalLayer: number; // 0 outer, 1 mid, 2 inner
  petalIndex: number;
  posRatio: number;
  side: number;
  sparklePhase: number;
  sparkleSpeed: number;
  size: number;
}

// Shockwave / Ethereal Bloom Ring
interface BloomRippleRing {
  id: number;
  r: number;
  maxR: number;
  alpha: number;
  color: string;
  lineWidth: number;
}

// Quantum Energy Arc / Plasma Filament Discharge
interface QuantumEnergyArc {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  segments: { x: number; y: number }[];
  branches: { segments: { x: number; y: number }[]; alpha: number }[];
  life: number;
  maxLife: number;
  hue: number;
  intensity: number;
  width: number;
  type: 'nucleus_to_petal' | 'petal_to_petal' | 'nucleus_to_pointer' | 'stamen_spark' | 'chain_ring';
}

/**
 * Enhanced Living Mystical Flower (Оболонка «Містична Квітка»):
 * 1. Спокій (Calm): М'яке гармонійне дихання, спокійний перламутровий/орхідейний відтінок, легкий пилок, іскриста роса.
 * 2. Діалог (Dialogue): Відкриття назустріч користувачеві (bloom expansion 1.18x), сакральний німб із обертанням, світлове биття серця.
 * 3. Реакція на негативні зміни (Negative Alert / Craving / Alert): Захисне змикання пелюсток (0.72x), рубіново-бурштиновий спектр, застережливі імпульсні кільця.
 * 4. Позитивна реакція (Добре / Зрозумів / Дякую): Сонячно-золотий розквіт (1.4x), салют золотого пилку, розліт пелюсток і хвилі гармонії.
 * 5. Енергетичні квантові розряди (Quantum Discharges):
 *    - Прив'язані до часу доби (ранок: квантова роса; день: сонячна плазма; вечір: озоновий люмінофор; ніч: неоновий біострум).
 *    - Динамічна реакція на взаємодію: дуги до пальця (pointer attraction), спалахи при тапі, ланцюгові блискавки при подвійному тапі, плазмові струни при перетягуванні.
 */

export const LivingFlowerVisual: React.FC<LivingFlowerVisualProps> = ({
  mode,
  hasAdvice = false,
  isThinking = false,
  isDialogueActive = false,
  isAllGood = true,
  onClick,
  onSwipeRight,
  onLongPress,
  blurAmount = 0,
  calmHue = 330, // Default mystical sakura orchid
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const swayWrapperRef = useRef<HTMLDivElement | null>(null);

  const calmHueRef = useRef(calmHue);
  calmHueRef.current = calmHue;

  const hasAdviceRef = useRef(hasAdvice);
  hasAdviceRef.current = hasAdvice;

  const isThinkingRef = useRef(isThinking);
  isThinkingRef.current = isThinking;

  const isDialogueActiveRef = useRef(isDialogueActive);
  isDialogueActiveRef.current = isDialogueActive;

  const isAllGoodRef = useRef(isAllGood);
  isAllGoodRef.current = isAllGood;

  const modeRef = useRef(mode);
  modeRef.current = mode;

  // Pointer interaction tracking
  const isPointerDownRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const pointerPosRef = useRef({ x: 180, y: 75, active: false });
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapTimeRef = useRef(0);

  // Smooth hue tracking for fluid color transitions
  const currentHueRef = useRef(calmHue);

  // CSS "Гойдалка" Harmonic Pendulum & Underdamped Spring Physics
  const pendulumRef = useRef({
    angle: 0,
    velocity: 0,
    targetAngle: 0,
    skew: 0,
    scaleY: 1,
  });

  // Fluid physical stretch & elastic petal tension
  const stretchPhysicsRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0,
    angle: 0,
    pullMagnitude: 0,
    bloomExpansion: 1.0,
    targetBloom: 1.0,
    energyPulse: 0,
    shockWave: 0,
    protectionLevel: 0,
  });

  // Movement choreography engine
  const choreoRef = useRef({
    state: 0,
    timer: 0,
    duration: 320,
    baseRotation: 0,
    rotSpeed: 0.0022,
    targetRotSpeed: 0.0022,
    layerSway1: 0,
    layerSway2: 0,
    layerSway3: 0,
    breathePhase: 0,
    breatheSpeed: 0.024,
    wavePhase: 0,
    stamenGlow: 1.0,
    warningTimer: 0,
    quantumArcTimer: 0,
  });

  // Dynamic particle & energy pools
  const pollenMotesRef = useRef<PollenMote[]>([]);
  const detachedPetalsRef = useRef<FlowerDetachedPetal[]>([]);
  const dewdropsRef = useRef<DewdropGlint[]>([]);
  const rippleRingsRef = useRef<BloomRippleRing[]>([]);
  const quantumArcsRef = useRef<QuantumEnergyArc[]>([]);

  // Time-of-Day Quantum Energy Profile Calculator
  const getQuantumProfile = useCallback(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      // 1. РАНОК (06:00 - 12:00) — Квантова роса & Перламутрова іонізація
      return {
        name: 'morning',
        baseHue: 215, // Рожево-блакитний перламутр
        hueVariance: 45,
        freqInterval: 45, // помірна частота
        maxArcs: 3,
        branchChance: 0.45,
        intensity: 0.9,
        glowWidth: 2.2,
      };
    } else if (hour >= 12 && hour < 18) {
      // 2. ДЕНЬ (12:00 - 18:00) — Сонячна високоенергетична плазма
      return {
        name: 'afternoon',
        baseHue: 48, // Сонячне золото й плазма
        hueVariance: 30,
        freqInterval: 25, // часті швидкі спалахи
        maxArcs: 5,
        branchChance: 0.75,
        intensity: 1.35,
        glowWidth: 3.2,
      };
    } else if (hour >= 18 && hour < 23) {
      // 3. ВЕЧІР (18:00 - 23:00) — Сутінковий люмінесцентний озон
      return {
        name: 'evening',
        baseHue: 285, // Бузково-аметистовий і теплий бурштин
        hueVariance: 50,
        freqInterval: 38, // середній заспокійливий ритм
        maxArcs: 4,
        branchChance: 0.55,
        intensity: 1.0,
        glowWidth: 2.6,
      };
    } else {
      // 4. НІЧ (23:00 - 06:00) — Місячна квантова біоелектрика
      return {
        name: 'night',
        baseHue: 178, // Неоновий аквамарин / бірюзовий флуоресцент
        hueVariance: 35,
        freqInterval: 60, // рідкісні глибокі яскраві імпульси
        maxArcs: 2,
        branchChance: 0.65,
        intensity: 1.15,
        glowWidth: 2.8,
      };
    }
  }, []);

  // Fractal Lightning Generator Helper
  const generateFractalSegments = useCallback((
    sx: number, sy: number, ex: number, ey: number, generations = 4, maxDisplace = 10
  ) => {
    let segs = [{ x: sx, y: sy }, { x: ex, y: ey }];

    for (let g = 0; g < generations; g++) {
      const newSegs: { x: number; y: number }[] = [];
      const curDisplace = maxDisplace / Math.pow(1.6, g);

      for (let i = 0; i < segs.length - 1; i++) {
        const p1 = segs[i];
        const p2 = segs[i + 1];
        newSegs.push(p1);

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        const offset = (Math.random() - 0.5) * curDisplace;
        newSegs.push({
          x: midX + nx * offset,
          y: midY + ny * offset,
        });
      }
      newSegs.push(segs[segs.length - 1]);
      segs = newSegs;
    }

    return segs;
  }, []);

  // Spawn a new Quantum Energy Arc
  const spawnQuantumArc = useCallback((
    sx: number,
    sy: number,
    ex: number,
    ey: number,
    type: QuantumEnergyArc['type'] = 'nucleus_to_petal',
    customHue?: number,
    intensityMult = 1.0,
    maxLife = 18
  ) => {
    const profile = getQuantumProfile();
    const arcHue = customHue !== undefined ? customHue : (profile.baseHue + (Math.random() - 0.5) * profile.hueVariance + 360) % 360;

    const segments = generateFractalSegments(sx, sy, ex, ey, 4, 12);
    const branches: { segments: { x: number; y: number }[]; alpha: number }[] = [];

    if (Math.random() < profile.branchChance) {
      const branchCount = 1 + Math.floor(Math.random() * 2);
      for (let b = 0; b < branchCount; b++) {
        const idx = Math.floor(segments.length * (0.3 + Math.random() * 0.4));
        const bStart = segments[idx];
        const bAngle = Math.atan2(ey - sy, ex - sx) + (Math.random() - 0.5) * 1.5;
        const bLen = (Math.sqrt(Math.pow(ex - sx, 2) + Math.pow(ey - sy, 2)) || 30) * (0.3 + Math.random() * 0.35);
        const bEnd = {
          x: bStart.x + Math.cos(bAngle) * bLen,
          y: bStart.y + Math.sin(bAngle) * bLen,
        };
        branches.push({
          segments: generateFractalSegments(bStart.x, bStart.y, bEnd.x, bEnd.y, 3, 6),
          alpha: 0.75,
        });
      }
    }

    quantumArcsRef.current.push({
      id: Date.now() + Math.random(),
      startX: sx,
      startY: sy,
      endX: ex,
      endY: ey,
      segments,
      branches,
      life: maxLife,
      maxLife,
      hue: arcHue,
      intensity: profile.intensity * intensityMult,
      width: profile.glowWidth,
      type,
    });
  }, [getQuantumProfile, generateFractalSegments]);

  // Initialize particles & dewdrops
  useEffect(() => {
    const pollen: PollenMote[] = [];
    const count = 38;
    for (let i = 0; i < count; i++) {
      const orbitR = 16 + Math.random() * 54;
      const orbitA = Math.random() * Math.PI * 2;
      pollen.push({
        x: Math.cos(orbitA) * orbitR,
        y: Math.sin(orbitA) * orbitR,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.15 - Math.random() * 0.35,
        size: 1.2 + Math.random() * 2.4,
        alpha: 0.25 + Math.random() * 0.65,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.04,
        hueOffset: (Math.random() - 0.5) * 45,
        orbitAngle: orbitA,
        orbitRadius: orbitR,
        orbitSpeed: (0.008 + Math.random() * 0.016) * (Math.random() < 0.5 ? 1 : -1),
      });
    }
    pollenMotesRef.current = pollen;

    const dewdrops: DewdropGlint[] = [];
    for (let d = 0; d < 24; d++) {
      dewdrops.push({
        petalLayer: Math.floor(Math.random() * 3),
        petalIndex: Math.floor(Math.random() * 8),
        posRatio: 0.4 + Math.random() * 0.45,
        side: Math.random() < 0.5 ? -1 : 1,
        sparklePhase: Math.random() * Math.PI * 2,
        sparkleSpeed: 0.028 + Math.random() * 0.05,
        size: 0.8 + Math.random() * 1.5,
      });
    }
    dewdropsRef.current = dewdrops;
  }, []);

  // Spawn a fountain burst of golden pollen & stamen sparks
  const triggerPollenBurst = useCallback((burstX = 0, burstY = 0, count = 32, isGold = false) => {
    const pArray = pollenMotesRef.current;
    const activeHue = currentHueRef.current;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.4 + Math.random() * 4.2;
      pArray.push({
        x: burstX,
        y: burstY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (0.8 + Math.random() * 1.4),
        size: 1.8 + Math.random() * 3.4,
        alpha: 0.95,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.06 + Math.random() * 0.08,
        hueOffset: isGold ? 48 : (Math.random() - 0.5) * 50,
        orbitAngle: angle,
        orbitRadius: 0,
        orbitSpeed: 0,
        isBurst: true,
        decay: 0.01 + Math.random() * 0.016,
        glow: 14,
      });
    }

    // Shockwave ripple ring
    const [r, g, b] = hslToRgb(isGold ? 48 : activeHue, 95, 75);
    rippleRingsRef.current.push({
      id: Date.now() + Math.random(),
      r: 10,
      maxR: 75,
      alpha: 0.9,
      color: `rgba(${r}, ${g}, ${b}`,
      lineWidth: 2.4,
    });
  }, []);

  // Spawn free-flying detached petal on energy peak or swipe
  const spawnDetachedPetal = useCallback((customAngle?: number, speedMult = 1.0) => {
    const spawnAngle = customAngle !== undefined ? customAngle : Math.random() * Math.PI * 2;
    const speed = (0.9 + Math.random() * 1.5) * speedMult;
    const activeHue = currentHueRef.current;

    detachedPetalsRef.current.push({
      x: Math.cos(spawnAngle) * 20,
      y: Math.sin(spawnAngle) * 20,
      vx: Math.cos(spawnAngle) * speed + 0.35,
      vy: Math.sin(spawnAngle) * speed * 0.6 - 0.45,
      size: 4.8 + Math.random() * 4.2,
      alpha: 0.92,
      angle: spawnAngle,
      spinSpeed: (Math.random() - 0.5) * 0.045,
      age: 0,
      maxAge: 170 + Math.floor(Math.random() * 100),
      hue: activeHue + (Math.random() - 0.5) * 30,
      zScale: 0.8 + Math.random() * 0.4,
      tilt: Math.random() * Math.PI,
      tiltSpeed: 0.02 + Math.random() * 0.03,
    });
  }, []);

  // Helper: shortest-distance angle interpolation
  const interpolateHue = (cur: number, target: number, speed = 0.06) => {
    let diff = (target - cur) % 360;
    if (diff < -180) diff += 360;
    if (diff > 180) diff -= 360;
    return (cur + diff * speed + 360) % 360;
  };

  // Energy Mode Changes Reactions (Positive Gratitude vs Negative Warning Alert)
  useEffect(() => {
    if (mode === 'gold-flash' || mode === 'warm') {
      // 4. ПОЗИТИВНА РЕАКЦІЯ (Добре, Зрозумів, Дякую) -> Золотий вибух розквіту!
      stretchPhysicsRef.current.energyPulse = 1.25;
      stretchPhysicsRef.current.targetBloom = 1.38;
      choreoRef.current.stamenGlow = 2.4;
      triggerPollenBurst(0, 0, 38, true);

      // Multiple outward golden quantum discharges in all petal directions
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        spawnQuantumArc(0, 0, Math.cos(ang) * 48, Math.sin(ang) * 48, 'nucleus_to_petal', 48, 1.5, 24);
      }

      for (let i = 0; i < 5; i++) {
        spawnDetachedPetal(undefined, 1.5);
      }
      setTimeout(() => {
        stretchPhysicsRef.current.targetBloom = 1.0;
      }, 1500);
    } else if (mode === 'red-flash' || mode === 'negative') {
      // 3. РЕАКЦІЯ НА НЕГАТИВНІ ЗМІНИ (Захисне змикання пелюсток та рубінове застереження)
      stretchPhysicsRef.current.targetBloom = 0.70;
      stretchPhysicsRef.current.energyPulse = 0.65;
      stretchPhysicsRef.current.protectionLevel = 1.0;

      // Spawn sharp ruby quantum warning discharges
      for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * Math.PI * 2 + Math.PI / 4;
        spawnQuantumArc(0, 0, Math.cos(ang) * 32, Math.sin(ang) * 32, 'nucleus_to_petal', 352, 1.3, 20);
      }

      // Spawn red warning ripple ring
      const [rr, rg, rb] = hslToRgb(352, 95, 65);
      rippleRingsRef.current.push({
        id: Date.now(),
        r: 8,
        maxR: 65,
        alpha: 0.85,
        color: `rgba(${rr}, ${rg}, ${rb}`,
        lineWidth: 2.2,
      });

      setTimeout(() => {
        stretchPhysicsRef.current.targetBloom = 1.0;
        stretchPhysicsRef.current.protectionLevel = 0.0;
      }, 1800);
    }
  }, [mode, triggerPollenBurst, spawnDetachedPetal, spawnQuantumArc]);

  // Main 60fps Physical Simulation & Visual Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let isRunning = true;
    let width = (canvas.width = 360);
    let height = (canvas.height = 150);

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = Math.max(280, Math.floor(rect.width * dpr));
      height = canvas.height = Math.max(120, Math.floor(rect.height * dpr));
    };
    handleResize();

    let globalTick = 0;

    // Helper: Draw organic glowing translucent petal with center vein
    const drawFlowerPetal = (
      c: CanvasRenderingContext2D,
      length: number,
      widthPetal: number,
      baseHue: number,
      curAlpha: number,
      curvature: number,
      glowBoost: number,
      waveOffset: number,
      curlInward = 0
    ) => {
      c.save();
      c.beginPath();
      c.moveTo(0, 0);

      // Organic curved petal contour with wind wave ripple & curl inward on protection
      const curlLength = length * (1 - curlInward * 0.3);
      const cp1x = -widthPetal * (0.95 - curlInward * 0.25) + waveOffset * 2;
      const cp1y = -curlLength * 0.35 + curvature * 4;
      const cp2x = -widthPetal * (0.65 - curlInward * 0.2) - waveOffset * 2;
      const cp2y = -curlLength * (0.82 - curlInward * 0.15);
      const tipX = curvature * 3 + waveOffset * 3;
      const tipY = -curlLength;

      const cp3x = widthPetal * (0.65 - curlInward * 0.2) - waveOffset * 2;
      const cp3y = -curlLength * (0.82 - curlInward * 0.15);
      const cp4x = widthPetal * (0.95 - curlInward * 0.25) + waveOffset * 2;
      const cp4y = -curlLength * 0.35 - curvature * 4;

      c.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tipX, tipY);
      c.bezierCurveTo(cp3x, cp3y, cp4x, cp4y, 0, 0);
      c.closePath();

      // Multi-stop ethereal petal gradient
      const [r1, g1, b1] = hslToRgb((baseHue + 25) % 360, 95, 92);
      const [r2, g2, b2] = hslToRgb(baseHue, 92, 68);
      const [r3, g3, b3] = hslToRgb((baseHue - 20 + 360) % 360, 95, 52);

      const grad = c.createLinearGradient(0, 0, tipX, tipY);
      grad.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, ${Math.min(1, curAlpha * 0.95)})`);
      grad.addColorStop(0.55, `rgba(${r2}, ${g2}, ${b2}, ${Math.min(1, curAlpha * 0.74)})`);
      grad.addColorStop(0.85, `rgba(${r3}, ${g3}, ${b3}, ${Math.min(1, curAlpha * 0.88)})`);
      grad.addColorStop(1, `rgba(${r1}, ${g1}, ${b1}, ${Math.min(1, curAlpha * (0.95 + glowBoost * 0.4))})`);

      c.fillStyle = grad;
      c.shadowColor = `rgba(${r2}, ${g2}, ${b2}, ${0.5 * curAlpha})`;
      c.shadowBlur = 8 + glowBoost * 14;
      c.fill();

      // Delicate crystalline central vein
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(curvature * 2, -curlLength * 0.5, tipX * 0.9, tipY * 0.9);
      c.strokeStyle = `rgba(255, 255, 255, ${curAlpha * 0.65})`;
      c.lineWidth = 1.0;
      c.stroke();

      c.restore();
    };

    // Helper: Draw procedural Quantum Arc / Plasma Filament
    const drawQuantumArc = (c: CanvasRenderingContext2D, arc: QuantumEnergyArc, scale: number) => {
      c.save();
      const lifeRatio = arc.life / arc.maxLife; // 1 to 0
      const [ar, ag, ab] = hslToRgb(arc.hue, 95, 75);
      const alpha = Math.min(1, lifeRatio * arc.intensity);

      // Pass 1: Volumetric Neon Glow Aura
      c.beginPath();
      for (let i = 0; i < arc.segments.length; i++) {
        const pt = arc.segments[i];
        if (i === 0) c.moveTo(pt.x * scale, pt.y * scale);
        else c.lineTo(pt.x * scale, pt.y * scale);
      }
      c.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, ${alpha * 0.65})`;
      c.lineWidth = arc.width * (1.2 + Math.sin(globalTick * 0.2) * 0.4);
      c.shadowColor = `rgba(${ar}, ${ag}, ${ab}, ${alpha * 0.95})`;
      c.shadowBlur = 12 * arc.intensity;
      c.stroke();

      // Pass 2: Pure White/Hot Core Plasma Beam
      c.beginPath();
      for (let i = 0; i < arc.segments.length; i++) {
        const pt = arc.segments[i];
        if (i === 0) c.moveTo(pt.x * scale, pt.y * scale);
        else c.lineTo(pt.x * scale, pt.y * scale);
      }
      c.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
      c.lineWidth = 1.0;
      c.shadowBlur = 4;
      c.stroke();

      // Draw branching tendrils
      for (const br of arc.branches) {
        c.beginPath();
        for (let i = 0; i < br.segments.length; i++) {
          const bpt = br.segments[i];
          if (i === 0) c.moveTo(bpt.x * scale, bpt.y * scale);
          else c.lineTo(bpt.x * scale, bpt.y * scale);
        }
        c.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, ${alpha * br.alpha * 0.7})`;
        c.lineWidth = 1.0;
        c.shadowBlur = 6;
        c.stroke();
      }

      c.restore();
    };

    // Main Render Routine
    const render = () => {
      if (!isRunning) return;
      globalTick++;

      ctx.clearRect(0, 0, width, height);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const centerX = width / 2;
      const centerY = height / 2;

      const isAdvice = hasAdviceRef.current;
      const isThinking = isThinkingRef.current;
      const isDialogue = isDialogueActiveRef.current;
      const curMode = modeRef.current;

      // 1. DYNAMIC COLOR SPECTRUM SMOOTH INTERPOLATION
      let targetHue = calmHueRef.current;
      if (curMode === 'gold-flash' || curMode === 'warm') {
        targetHue = 48; // Bright Golden Sunburst
      } else if (isAdvice || curMode === 'red-flash' || curMode === 'negative') {
        targetHue = 352; // Crimson Alert Ruby
      } else if (isDialogue) {
        targetHue = (calmHueRef.current + 18) % 360; // Luminous Orchid Communication Hue
      }

      currentHueRef.current = interpolateHue(currentHueRef.current, targetHue, 0.06);
      const activeHue = currentHueRef.current;

      const choreo = choreoRef.current;
      const physics = stretchPhysicsRef.current;
      const pendulum = pendulumRef.current;

      // ====================================================================
      // 1. BEHAVIORAL STATE & QUANTUM ENERGY ENGINE (Час доби + Взаємодія)
      // ====================================================================
      const qProfile = getQuantumProfile();
      choreo.quantumArcTimer++;

      // Spontaneous Quantum Energy Discharge aligned to Time-of-Day frequency
      if (choreo.quantumArcTimer >= qProfile.freqInterval && quantumArcsRef.current.length < qProfile.maxArcs) {
        choreo.quantumArcTimer = 0;
        const outerRot = choreo.baseRotation;
        const targetPetalIdx = Math.floor(Math.random() * 8);
        const petalAng = (targetPetalIdx / 8) * Math.PI * 2 + outerRot;
        const targetDist = 34 + Math.random() * 10;

        spawnQuantumArc(
          0,
          0,
          Math.cos(petalAng) * targetDist,
          Math.sin(petalAng) * targetDist,
          'nucleus_to_petal',
          undefined,
          isThinking ? 1.4 : isDialogue ? 1.2 : 1.0
        );

        // Chain between two adjacent petals if in high-energy mode
        if (Math.random() < 0.35) {
          const nextIdx = (targetPetalIdx + 1) % 8;
          const nextAng = (nextIdx / 8) * Math.PI * 2 + outerRot;
          spawnQuantumArc(
            Math.cos(petalAng) * targetDist,
            Math.sin(petalAng) * targetDist,
            Math.cos(nextAng) * targetDist,
            Math.sin(nextAng) * targetDist,
            'petal_to_petal',
            undefined,
            0.85
          );
        }
      }

      // Continuous interactive Quantum Arc to user's finger/cursor (Plasma Globe Effect)
      if (isPointerDownRef.current && pointerPosRef.current.active) {
        const localPointerX = (pointerPosRef.current.x - 180) / dpr;
        const localPointerY = (pointerPosRef.current.y - 75) / dpr;
        if (globalTick % 5 === 0) {
          spawnQuantumArc(
            0,
            0,
            localPointerX,
            localPointerY,
            'nucleus_to_pointer',
            activeHue,
            1.45,
            8
          );
        }
      }

      if (isAdvice) {
        // Warning alert pulse in negative state
        choreo.warningTimer++;
        if (choreo.warningTimer > 150) {
          choreo.warningTimer = 0;
          const [wr, wg, wb] = hslToRgb(352, 95, 65);
          rippleRingsRef.current.push({
            id: Date.now() + Math.random(),
            r: 8,
            maxR: 62,
            alpha: 0.75,
            color: `rgba(${wr}, ${wg}, ${wb}`,
            lineWidth: 2.0,
          });
        }
      }

      choreo.timer++;
      if (choreo.timer >= choreo.duration) {
        choreo.timer = 0;
        choreo.state = (choreo.state + 1) % 4;

        switch (choreo.state) {
          case 0: // MEDITATIVE_BREATHE (Спокій - медитативне дихання)
            choreo.duration = 380 + Math.floor(Math.random() * 180);
            choreo.targetRotSpeed = isDialogue ? 0.0045 : 0.0022;
            choreo.breatheSpeed = isDialogue ? 0.038 : 0.022;
            break;
          case 1: // SPIRAL_SWIRL (Спіральний танець)
            choreo.duration = 260 + Math.floor(Math.random() * 120);
            choreo.targetRotSpeed = isDialogue ? 0.009 : 0.0075;
            choreo.breatheSpeed = isDialogue ? 0.045 : 0.036;
            if (!isAdvice) spawnDetachedPetal();
            break;
          case 2: // WIND_RIPPLE_WAVE (Хвилеподібний трепет)
            choreo.duration = 320 + Math.floor(Math.random() * 140);
            choreo.targetRotSpeed = -0.0035;
            choreo.breatheSpeed = isDialogue ? 0.035 : 0.026;
            break;
          case 3: // ZEN_STILLNESS (Завмирання у невагомості)
            choreo.duration = 300 + Math.floor(Math.random() * 150);
            choreo.targetRotSpeed = 0.001;
            choreo.breatheSpeed = isDialogue ? 0.024 : 0.014;
            break;
        }
      }

      choreo.rotSpeed += (choreo.targetRotSpeed - choreo.rotSpeed) * 0.04;
      choreo.baseRotation += isThinking ? 0.015 : choreo.rotSpeed;
      choreo.breathePhase += isThinking ? 0.052 : choreo.breatheSpeed;
      choreo.wavePhase += 0.045;

      // ====================================================================
      // 2. CSS PENDULUM PHYSICS
      // ====================================================================
      if (isPointerDownRef.current && pointerPosRef.current.active) {
        const dx = pointerPosRef.current.x - 180;
        pendulum.targetAngle = Math.max(-32, Math.min(32, dx * 0.45));
        pendulum.skew = Math.max(-12, Math.min(12, dx * 0.15));
      } else {
        pendulum.targetAngle = 0;
        pendulum.skew = 0;
      }

      const pSpring = 0.085;
      const pDamp = 0.88;
      const pForce = (pendulum.targetAngle - pendulum.angle) * pSpring;
      pendulum.velocity = (pendulum.velocity + pForce) * pDamp;
      pendulum.angle += pendulum.velocity;

      if (swayWrapperRef.current) {
        swayWrapperRef.current.style.transform = `rotate(${pendulum.angle.toFixed(2)}deg) skewX(${pendulum.skew.toFixed(2)}deg)`;
      }

      // Stretch & Bloom target modulation
      const springK = isPointerDownRef.current ? 0.22 : 0.12;
      const springDamping = isPointerDownRef.current ? 0.78 : 0.86;
      physics.vx = (physics.vx + (physics.targetX - physics.x) * springK) * springDamping;
      physics.vy = (physics.vy + (physics.targetY - physics.y) * springK) * springDamping;
      physics.x += physics.vx;
      physics.y += physics.vy;

      physics.energyPulse *= 0.94;
      choreo.stamenGlow = 1.0 + physics.energyPulse + (isAdvice ? 0.6 : isDialogue ? 0.35 : 0);

      // Bloom target modulation based on active state
      let targetBloomBase = 1.0;
      if (isAdvice) {
        targetBloomBase = 0.78; // Protective inward posture on warning
      } else if (isThinking) {
        targetBloomBase = 1.22; // Thinking expansion
      } else if (isDialogue) {
        targetBloomBase = 1.16; // Dialogue attentive opening
      } else if (isPointerDownRef.current) {
        targetBloomBase = 1.15;
      }

      physics.bloomExpansion += (targetBloomBase * (1 + physics.energyPulse * 0.3) - physics.bloomExpansion) * 0.06;

      const breatheFactor = 1 + Math.sin(choreo.breathePhase) * (choreo.state === 3 ? 0.03 : isDialogue ? 0.075 : 0.06);
      const baseScale = (dpr * 0.94) * physics.bloomExpansion * breatheFactor;

      if (blurAmount > 0) {
        ctx.filter = `blur(${blurAmount}px)`;
      } else {
        ctx.filter = 'none';
      }

      ctx.save();
      ctx.translate(centerX + physics.x, centerY + physics.y);

      // ====================================================================
      // 3. BLOOM RIPPLE RINGS
      // ====================================================================
      const rings = rippleRingsRef.current;
      for (let rIdx = rings.length - 1; rIdx >= 0; rIdx--) {
        const ring = rings[rIdx];
        ring.r += 1.8;
        const progress = ring.r / ring.maxR;
        ring.alpha = Math.max(0, 0.88 * (1 - progress));

        if (progress >= 1 || ring.alpha <= 0.01) {
          rings.splice(rIdx, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, ring.r * baseScale, 0, Math.PI * 2);
        ctx.strokeStyle = `${ring.color}, ${ring.alpha})`;
        ctx.lineWidth = ring.lineWidth * (1 - progress * 0.5);
        ctx.stroke();
        ctx.restore();
      }

      // ====================================================================
      // 4. SACRED GEOMETRY FLORAL HALO (Сакральний німб у діалозі/спокої)
      // ====================================================================
      const haloRadius = 48 * baseScale;
      ctx.save();
      ctx.rotate(-choreo.baseRotation * (isDialogue ? 1.2 : 0.8));

      const [hr, hg, hb] = hslToRgb((activeHue + 30) % 360, 95, 75);
      const haloAlpha = isAdvice ? 0.45 : isDialogue ? 0.42 : isThinking ? 0.5 : 0.22;
      ctx.strokeStyle = `rgba(${hr}, ${hg}, ${hb}, ${haloAlpha})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, haloRadius, 0, Math.PI * 2);
      ctx.stroke();

      const outerHaloR = haloRadius * 1.28;
      ctx.beginPath();
      ctx.arc(0, 0, outerHaloR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${hr}, ${hg}, ${hb}, ${haloAlpha * 0.7})`;
      ctx.setLineDash([2, 8]);
      ctx.stroke();

      const nodeCount = isDialogue ? 8 : 6;
      for (let n = 0; n < nodeCount; n++) {
        const nodeAngle = (n / nodeCount) * Math.PI * 2 + choreo.baseRotation * 1.4;
        const nx = Math.cos(nodeAngle) * outerHaloR;
        const ny = Math.sin(nodeAngle) * outerHaloR;
        ctx.beginPath();
        ctx.arc(nx, ny, 1.5 * baseScale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.75 + Math.sin(globalTick * 0.06 + n) * 0.25})`;
        ctx.shadowColor = `rgba(${hr}, ${hg}, ${hb}, 0.85)`;
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      ctx.restore();

      // Ambient radial bloom behind petals
      const [br, bg, bb] = hslToRgb(activeHue, 95, 65);
      const bgAura = ctx.createRadialGradient(0, 0, 4, 0, 0, 64 * baseScale);
      bgAura.addColorStop(0, `rgba(255, 255, 255, ${isThinking ? 0.6 : isDialogue ? 0.45 : isAdvice ? 0.5 : 0.35})`);
      bgAura.addColorStop(0.35, `rgba(${br}, ${bg}, ${bb}, ${isThinking ? 0.45 : isDialogue ? 0.32 : isAdvice ? 0.38 : 0.22})`);
      bgAura.addColorStop(0.75, `rgba(${br}, ${bg}, ${bb}, 0.08)`);
      bgAura.addColorStop(1, 'transparent');
      ctx.fillStyle = bgAura;
      ctx.beginPath();
      ctx.arc(0, 0, 64 * baseScale, 0, Math.PI * 2);
      ctx.fill();

      // ====================================================================
      // 5. MULTI-LAYERED LIVING PETALS (Багатошарові живі пелюстки)
      // ====================================================================
      const curlAmount = isAdvice ? 0.28 : 0;

      // LAYER 1: Outer Petals (8 large ethereal petals)
      const outerCount = 8;
      const outerLen = 38 * baseScale;
      const outerWid = 18 * baseScale;
      const outerRot = choreo.baseRotation;

      for (let i = 0; i < outerCount; i++) {
        ctx.save();
        const baseAngle = (i / outerCount) * Math.PI * 2 + outerRot;
        const petalSway = Math.sin(choreo.breathePhase * 0.8 + i * 0.7) * 0.05;
        const waveOffset = Math.sin(choreo.wavePhase + i * 0.8) * (isDialogue ? 1.2 : 0.8);
        ctx.rotate(baseAngle + petalSway);

        const curvature = Math.sin(baseAngle - physics.angle) * (physics.pullMagnitude * 0.04);
        drawFlowerPetal(
          ctx,
          outerLen,
          outerWid,
          (activeHue - 15 + 360) % 360,
          0.76,
          curvature,
          isThinking ? 0.5 : isDialogue ? 0.35 : isAdvice ? 0.4 : 0.05,
          waveOffset,
          curlAmount
        );
        ctx.restore();
      }

      // LAYER 2: Middle Petals (6 blossoming radiant petals)
      const midCount = 6;
      const midLen = 29 * baseScale;
      const midWid = 14 * baseScale;
      const midRot = -choreo.baseRotation * 0.85 + Math.PI / 6;

      for (let i = 0; i < midCount; i++) {
        ctx.save();
        const baseAngle = (i / midCount) * Math.PI * 2 + midRot;
        const petalSway = Math.cos(choreo.breathePhase + i * 0.9) * 0.06;
        const waveOffset = Math.cos(choreo.wavePhase + i * 1.1) * (isDialogue ? 1.0 : 0.7);
        ctx.rotate(baseAngle + petalSway);

        const curvature = Math.sin(baseAngle - physics.angle) * (physics.pullMagnitude * 0.035);
        drawFlowerPetal(
          ctx,
          midLen,
          midWid,
          activeHue,
          0.86,
          curvature,
          isThinking ? 0.7 : isDialogue ? 0.45 : isAdvice ? 0.55 : 0.15,
          waveOffset,
          curlAmount * 0.8
        );
        ctx.restore();
      }

      // LAYER 3: Inner Core Petals (5 tender petals shielding the heart)
      const innerCount = 5;
      const innerLen = 20 * baseScale;
      const innerWid = 10.5 * baseScale;
      const innerRot = choreo.baseRotation * 1.25 + Math.PI / 5;

      for (let i = 0; i < innerCount; i++) {
        ctx.save();
        const baseAngle = (i / innerCount) * Math.PI * 2 + innerRot;
        const petalSway = Math.sin(choreo.breathePhase * 1.2 + i * 1.1) * 0.08;
        ctx.rotate(baseAngle + petalSway);

        const curvature = Math.sin(baseAngle - physics.angle) * (physics.pullMagnitude * 0.03);
        drawFlowerPetal(
          ctx,
          innerLen,
          innerWid,
          (activeHue + 20) % 360,
          0.95,
          curvature,
          isThinking ? 0.9 : isDialogue ? 0.6 : isAdvice ? 0.75 : 0.25,
          0,
          curlAmount * 0.5
        );
        ctx.restore();
      }

      // ====================================================================
      // 6. DEWDROP SPARKLES ON PETALS (Іскриста роса)
      // ====================================================================
      const dewdrops = dewdropsRef.current;
      for (const dew of dewdrops) {
        dew.sparklePhase += dew.sparkleSpeed;
        const sparkleVal = Math.sin(dew.sparklePhase);
        if (sparkleVal > 0.35) {
          const intensity = (sparkleVal - 0.35) / 0.65;
          const layerLen = dew.petalLayer === 0 ? outerLen : dew.petalLayer === 1 ? midLen : innerLen;
          const layerWid = dew.petalLayer === 0 ? outerWid : dew.petalLayer === 1 ? midWid : innerWid;
          const layerRot = dew.petalLayer === 0 ? outerRot : dew.petalLayer === 1 ? midRot : innerRot;
          const count = dew.petalLayer === 0 ? outerCount : dew.petalLayer === 1 ? midCount : innerCount;

          const petalAngle = (dew.petalIndex / count) * Math.PI * 2 + layerRot;
          const dist = layerLen * dew.posRatio;
          const sideOffset = (layerWid * 0.4) * dew.side;

          ctx.save();
          ctx.rotate(petalAngle);
          ctx.translate(sideOffset, -dist);

          const flareLen = dew.size * (2.2 + intensity * 2.5) * baseScale;
          ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.95})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(-flareLen, 0);
          ctx.lineTo(flareLen, 0);
          ctx.moveTo(0, -flareLen);
          ctx.lineTo(0, flareLen);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, dew.size * baseScale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 6;
          ctx.fill();

          ctx.restore();
        }
      }

      // ====================================================================
      // 7. QUANTUM ENERGY ARCS & PLASMA FILAMENTS (Квантові розряди)
      // ====================================================================
      const arcs = quantumArcsRef.current;
      for (let aIdx = arcs.length - 1; aIdx >= 0; aIdx--) {
        const arc = arcs[aIdx];
        arc.life--;
        if (arc.life <= 0) {
          arcs.splice(aIdx, 1);
          continue;
        }
        drawQuantumArc(ctx, arc, baseScale);
      }

      // ====================================================================
      // 8. STAMEN RING & GOLDEN/RUBY ANTHERS (Тичинки зі світловими імпульсами)
      // ====================================================================
      const stamenCount = 10;
      const stamenDist = 12 * baseScale;
      const stamenRot = choreo.baseRotation * 0.5;

      for (let s = 0; s < stamenCount; s++) {
        const sAngle = (s / stamenCount) * Math.PI * 2 + stamenRot;
        const sx = Math.cos(sAngle) * stamenDist;
        const sy = Math.sin(sAngle) * stamenDist;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = isAdvice 
          ? `rgba(254, 202, 202, ${0.8 + Math.sin(globalTick * 0.08 + s) * 0.2})`
          : `rgba(254, 240, 138, ${0.75 + Math.sin(globalTick * 0.05 + s) * 0.25})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sx, sy, 1.8 * baseScale * choreo.stamenGlow, 0, Math.PI * 2);
        ctx.fillStyle = isAdvice ? '#fca5a5' : '#fef08a';
        ctx.shadowColor = isAdvice ? '#ef4444' : '#fbbf24';
        ctx.shadowBlur = 8 * choreo.stamenGlow;
        ctx.fill();
      }

      // ====================================================================
      // 9. CENTRAL MYSTIC GEM NUCLEUS (Сяюче серце квітки)
      // ====================================================================
      const coreR = 7.5 * baseScale * (1 + physics.energyPulse * 0.25);
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.45, 'rgba(255, 255, 255, 0.95)');
      coreGrad.addColorStop(0.8, `rgba(${br}, ${bg}, ${bb}, 0.8)`);
      coreGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = coreGrad;
      ctx.shadowColor = `rgba(${br}, ${bg}, ${bb}, 0.95)`;
      ctx.shadowBlur = 12 + (isThinking ? 12 : isDialogue ? 8 : isAdvice ? 10 : 0) + physics.energyPulse * 16;
      ctx.beginPath();
      ctx.arc(0, 0, coreR, 0, Math.PI * 2);
      ctx.fill();

      // Diamond faceted crystal highlight
      ctx.beginPath();
      ctx.moveTo(0, -coreR * 0.7);
      ctx.lineTo(coreR * 0.5, 0);
      ctx.lineTo(0, coreR * 0.7);
      ctx.lineTo(-coreR * 0.5, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.fill();

      // ====================================================================
      // 10. ORBITING & BURSTING POLLEN MOTES (Магічний пилок)
      // ====================================================================
      const pollenList = pollenMotesRef.current;
      for (let pIdx = pollenList.length - 1; pIdx >= 0; pIdx--) {
        const mote = pollenList[pIdx];

        if (mote.isBurst) {
          mote.x += mote.vx;
          mote.y += mote.vy;
          mote.vy += 0.04;
          mote.vx *= 0.98;
          mote.alpha -= mote.decay || 0.015;

          if (mote.alpha <= 0.01) {
            pollenList.splice(pIdx, 1);
            continue;
          }

          const [pr, pg, pb] = hslToRgb((activeHue + mote.hueOffset + 360) % 360, 95, 80);
          ctx.beginPath();
          ctx.arc(mote.x, mote.y, mote.size * baseScale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${mote.alpha})`;
          ctx.shadowColor = `rgba(${pr}, ${pg}, ${pb}, ${mote.alpha})`;
          ctx.shadowBlur = mote.glow || 8;
          ctx.fill();
        } else {
          mote.pulsePhase += mote.pulseSpeed;
          const speedMultiplier = isThinking ? 2.5 : isDialogue ? 1.8 : isAdvice ? 0.7 : 1.0;
          mote.orbitAngle += mote.orbitSpeed * speedMultiplier;

          const orbitRadiusScale = isDialogue ? 0.85 : isAdvice ? 0.75 : 1.0;
          const currentR = mote.orbitRadius * baseScale * orbitRadiusScale + Math.sin(mote.pulsePhase) * 6;
          const mx = Math.cos(mote.orbitAngle) * currentR;
          const my = Math.sin(mote.orbitAngle) * currentR;

          const pAlpha = mote.alpha * (0.6 + Math.sin(mote.pulsePhase) * 0.4);
          const [pr, pg, pb] = hslToRgb((activeHue + mote.hueOffset + 360) % 360, 95, 80);

          ctx.beginPath();
          ctx.arc(mx, my, mote.size * baseScale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${pAlpha})`;
          ctx.shadowColor = `rgba(${pr}, ${pg}, ${pb}, ${pAlpha * 0.9})`;
          ctx.shadowBlur = 6;
          ctx.fill();
        }
      }

      // ====================================================================
      // 11. DETACHED FREE-FLYING PETALS (Опалі пелюстки у польоті)
      // ====================================================================
      const detachedList = detachedPetalsRef.current;
      for (let dIdx = detachedList.length - 1; dIdx >= 0; dIdx--) {
        const dp = detachedList[dIdx];
        dp.age++;
        const lifeRatio = dp.age / dp.maxAge;

        dp.x += dp.vx;
        dp.y += dp.vy;
        dp.angle += dp.spinSpeed;
        dp.tilt += dp.tiltSpeed;

        dp.alpha = Math.max(0, 0.92 * (1 - lifeRatio));

        if (lifeRatio >= 1 || dp.alpha <= 0.01) {
          detachedList.splice(dIdx, 1);
          continue;
        }

        ctx.save();
        ctx.translate(dp.x, dp.y);
        ctx.rotate(dp.angle);
        ctx.scale(Math.max(0.2, Math.abs(Math.cos(dp.tilt))) * dp.zScale, dp.zScale);
        drawFlowerPetal(ctx, dp.size * baseScale, dp.size * 0.55 * baseScale, dp.hue, dp.alpha, 0, 0, 0);
        ctx.restore();
      }

      ctx.restore();

      const isBoost =
        document.documentElement.getAttribute('data-perf-boost') === 'true' ||
        document.documentElement.getAttribute('data-economy') === 'true' ||
        localStorage.getItem('quit-smoking:perf-boost') === 'true';

      if (!isBoost && isRunning) {
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

    const handlePerfChange = () => {
      if (isRunning) {
        if (animId) cancelAnimationFrame(animId);
        animId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('perf-boost-change', handlePerfChange);
    window.addEventListener('storage', handlePerfChange);
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('perf-boost-change', handlePerfChange);
      window.removeEventListener('storage', handlePerfChange);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [blurAmount, spawnDetachedPetal, spawnQuantumArc, getQuantumProfile]);

  // Pointer & Gesture Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    pointerPosRef.current = { x, y, active: true };
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };

    stretchPhysicsRef.current.targetX = (x - centerX) * 0.35;
    stretchPhysicsRef.current.targetY = (y - centerY) * 0.35;
    stretchPhysicsRef.current.angle = Math.atan2(y - centerY, x - centerX);
    stretchPhysicsRef.current.pullMagnitude = Math.min(1.2, Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) / 60);

    // Immediate quantum touch discharge to finger
    spawnQuantumArc(
      0,
      0,
      (x - centerX) * 0.5,
      (y - centerY) * 0.5,
      'nucleus_to_pointer',
      currentHueRef.current,
      1.3,
      14
    );

    longPressTimeoutRef.current = setTimeout(() => {
      if (onLongPress && dragStartRef.current) {
        if (navigator.vibrate) try { navigator.vibrate([20, 50, 30]); } catch {}
        // Quantum Resonance Singularity Burst on long press
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          spawnQuantumArc(Math.cos(a) * 45, Math.sin(a) * 45, 0, 0, 'nucleus_to_petal', 48, 1.6, 20);
        }
        onLongPress();
      }
    }, 3000);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    pointerPosRef.current = { x, y, active: true };

    const dx = x - centerX;
    const dy = y - centerY;
    stretchPhysicsRef.current.targetX = dx * 0.35;
    stretchPhysicsRef.current.targetY = dy * 0.35;
    stretchPhysicsRef.current.angle = Math.atan2(dy, dx);
    stretchPhysicsRef.current.pullMagnitude = Math.min(1.4, Math.sqrt(dx * dx + dy * dy) / 50);

    if (dragStartRef.current) {
      const moveDist = Math.sqrt(
        Math.pow(e.clientX - dragStartRef.current.x, 2) +
        Math.pow(e.clientY - dragStartRef.current.y, 2)
      );
      if (moveDist > 10 && longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    pointerPosRef.current.active = false;

    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    if (dragStartRef.current) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      const deltaTime = Date.now() - dragStartRef.current.time;

      if (deltaX > 45 && Math.abs(deltaY) < 55 && deltaTime < 400) {
        // Swipe Right Gesture: Horizontal Quantum Plasma Bolt!
        if (navigator.vibrate) try { navigator.vibrate([18, 35]); } catch {}
        triggerPollenBurst(0, 0, 22, true);
        spawnDetachedPetal(0, 1.8);
        for (let i = -1; i <= 1; i++) {
          spawnQuantumArc(0, 0, 55, i * 18, 'nucleus_to_pointer', currentHueRef.current, 1.6, 22);
        }
        onSwipeRight?.();
        dragStartRef.current = null;
        stretchPhysicsRef.current.targetX = 0;
        stretchPhysicsRef.current.targetY = 0;
        stretchPhysicsRef.current.pullMagnitude = 0;
        return;
      }

      const totalDist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (totalDist < 10 && deltaTime < 400) {
        // Tap Gesture!
        const now = Date.now();
        if (now - lastTapTimeRef.current < 320) {
          // Double Tap: Supercharged Chain Lightning Ring around petal tips!
          if (navigator.vibrate) try { navigator.vibrate([22, 40]); } catch {}
          triggerPollenBurst(0, 0, 30, true);
          spawnDetachedPetal(undefined, 1.5);
          for (let p = 0; p < 8; p++) {
            const a1 = (p / 8) * Math.PI * 2;
            const a2 = ((p + 1) / 8) * Math.PI * 2;
            spawnQuantumArc(Math.cos(a1) * 36, Math.sin(a1) * 36, Math.cos(a2) * 36, Math.sin(a2) * 36, 'petal_to_petal', currentHueRef.current, 1.4, 20);
          }
        } else {
          // Single Tap: Quantum Core Flash
          for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2;
            spawnQuantumArc(0, 0, Math.cos(a) * 35, Math.sin(a) * 35, 'nucleus_to_petal', currentHueRef.current, 1.2, 16);
          }
          onClick();
        }
        lastTapTimeRef.current = now;
      }
    }

    stretchPhysicsRef.current.targetX = 0;
    stretchPhysicsRef.current.targetY = 0;
    stretchPhysicsRef.current.pullMagnitude = 0;
    dragStartRef.current = null;
  };

  const handlePointerCancel = () => {
    isPointerDownRef.current = false;
    pointerPosRef.current.active = false;
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    stretchPhysicsRef.current.targetX = 0;
    stretchPhysicsRef.current.targetY = 0;
    stretchPhysicsRef.current.pullMagnitude = 0;
    dragStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="relative w-[120px] h-[120px] sm:w-[130px] sm:h-[130px] rounded-full flex items-center justify-center cursor-pointer select-none touch-none overflow-visible"
      style={{ touchAction: 'none' }}
    >
      <div
        ref={swayWrapperRef}
        className="w-[360px] h-[150px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center will-change-transform pointer-events-none"
        style={{
          transformOrigin: '50% 50%',
          transition: 'transform 0.05s ease-out',
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block pointer-events-none"
        />
      </div>
    </div>
  );
};
