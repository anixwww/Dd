import React, { useRef, useEffect, useCallback } from 'react';
import { VisualEnergyMode } from './AnalyzerTip';
import { hslToRgb } from './LivingFireVisual';

export interface LivingGlitterVisualProps {
  mode: VisualEnergyMode;
  hasUnreadAdvice?: boolean;
  hasAdvice?: boolean;
  isThinking?: boolean;
  isDialogueActive?: boolean;
  isAllGood?: boolean;
  onClick: () => void;
  onSwipeAny?: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  blurAmount?: number;
  calmPoint?: number;
  calmHue?: number;
  calmLightness?: number;
}

/**
 * 3D Physical Glitter Flake in the Viscoelastic Energy Clot
 */
interface Flake3D {
  id: number;
  // Rest anchor position in 3D cloud space
  ox: number;
  oy: number;
  oz: number;
  // Current 3D simulated position
  x: number;
  y: number;
  z: number;
  // 3D velocity
  vx: number;
  vy: number;
  vz: number;
  // Mass & elastic spring properties
  mass: number;
  springK: number;
  damping: number;
  // Geometric & visual properties
  size: number;
  shape: 'diamond' | 'hexagon' | 'star' | 'cross' | 'shard';
  category: 'primary' | 'secondary' | 'accent' | 'crystalWhite';
  baseAlpha: number;
  // 3D Facet Euler orientation
  yaw: number;
  pitch: number;
  roll: number;
  yawSpeed: number;
  pitchSpeed: number;
  rollSpeed: number;
  // Scintillation glint parameters
  glintPhase: number;
  glintSpeed: number;
  glintScale: number;
  // Fluid streamline drift
  streamlinePhase: number;
  streamlineSpeed: number;
  streamlineRadius: number;
}

/**
 * Dynamic Spark that materializes, crystallizes with diamond scintillation, and sublimates
 */
interface DynamicSpark3D {
  id: number;
  // Anchor lobe
  lobeIdx: number;
  // 3D coordinates
  x: number;
  y: number;
  z: number;
  ox: number;
  oy: number;
  oz: number;
  // Velocity
  vx: number;
  vy: number;
  vz: number;
  // Lifecycle
  age: number;
  lifespan: number;
  // Visual
  size: number;
  shape: 'diamond' | 'star' | 'cross' | 'hexagon';
  category: 'primary' | 'secondary' | 'crystalWhite';
  maxAlpha: number;
  // 3D Facet
  yaw: number;
  pitch: number;
  yawSpeed: number;
  pitchSpeed: number;
  glintPhase: number;
  glintSpeed: number;
}

/**
 * Ambient Ethereal Shimmer Dust orbiting in wide fluid field
 */
interface AmbientDust {
  x: number;
  y: number;
  z: number;
  radius: number;
  orbitAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
  verticalFreq: number;
  twinklePhase: number;
  twinkleSpeed: number;
  isAccent: boolean;
}

/**
 * Living Glitter Shell Simulator (Жива Оболонка Глітер v5.0):
 * - Високоточна 3D симуляція частинок з перспективним глибинним паралаксом.
 * - Плавна векторна гідродинаміка (3D curl turbulence & toroidal vortex streamlines).
 * - Фізичний розрахунок відбиття світла гранями алмазів (3D normal dot light vector).
 * - Призматична веселкова дисперсія світла на іскрах (diamond chromatic dispersion).
 * - В'язкопружний софт-боді згусток з органічним відскоком та акустичними хвилями від дотику.
 * - Повна підтримка білого (платиновий діамант), чорного (обсидіановий алмаз) та спектру відтінків.
 * - Плавні переходи між станами завдяки дельта-тайм інтерполяції без ривків.
 */
export const LivingGlitterVisual: React.FC<LivingGlitterVisualProps> = ({
  mode,
  hasAdvice = false,
  isThinking = false,
  isDialogueActive = false,
  onClick,
  onSwipeAny,
  onSwipeRight,
  onLongPress,
  blurAmount = 0,
  calmHue = 330,
  calmLightness = 60,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References to keep event handlers and animation loop synchronized
  const hasAdviceRef = useRef(hasAdvice);
  hasAdviceRef.current = hasAdvice;

  const isThinkingRef = useRef(isThinking);
  isThinkingRef.current = isThinking;

  const isDialogueActiveRef = useRef(isDialogueActive);
  isDialogueActiveRef.current = isDialogueActive;

  const calmHueRef = useRef(calmHue);
  calmHueRef.current = calmHue;

  const calmLightnessRef = useRef(calmLightness);
  calmLightnessRef.current = calmLightness;

  // Dynamic particle count scale (circadian rhythm + thinking vortex)
  const glitterScaleRef = useRef(1.0);

  // Soft-body viscoelastic clot center physics (spring-damper with inertia)
  const clotPhysicsRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0,
    pullAngle: 0,
    pullMag: 0,
    wobblePhase: 0,
    wobbleAmp: 0,
  });

  // Color lerping state (0 = calm state, 1 = mode/alert flare)
  const colorLerpRef = useRef({
    ratio: 0,
    targetRatio: 0,
    targetR: 251,
    targetG: 191,
    targetB: 36,
  });

  // Dialogue neural flare state (flashes alternately across regions)
  const dialogueRegionRef = useRef({
    activeRegionIdx: 0,
    timer: 0,
    flashIntensity: 0,
  });

  // Periodic temporal freeze (етюд кристалічного завмирання на 1.2с)
  const freezeStateRef = useRef({
    cycleTimer: Math.floor(Math.random() * 250),
    freezeFactor: 0, // 0 = normal motion, 1 = crystalline suspended time
  });

  // Pointer & interaction state
  const pointerRef = useRef({
    active: false,
    isDown: false,
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    vx: 0,
    vy: 0,
  });

  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressTriggeredRef = useRef(false);

  // Particle collections
  const flakesRef = useRef<Flake3D[]>([]);
  const dynamicSparksRef = useRef<DynamicSpark3D[]>([]);
  const ambientDustRef = useRef<AmbientDust[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Helper to spawn/respawn a 3D dynamic spark inside the clot volume
  const spawnDynamicSpark = useCallback((
    id: number,
    lobes: { cx: number; cy: number; cz: number; rx: number; ry: number; rz: number }[],
    spawnPos?: { x: number; y: number; z: number },
    forceAgeZero = false
  ): DynamicSpark3D => {
    const lobeIdx = Math.floor(Math.random() * lobes.length);
    const lobe = lobes[lobeIdx];

    let ox: number, oy: number, oz: number;

    if (spawnPos) {
      ox = spawnPos.x + (Math.random() - 0.5) * 16;
      oy = spawnPos.y + (Math.random() - 0.5) * 16;
      oz = spawnPos.z + (Math.random() - 0.5) * 12;
    } else {
      // Gaussian 3D volume clustering inside organic lobe
      const u = Math.random() + Math.random();
      const r = (u > 1 ? 2 - u : u) * 0.92;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      ox = lobe.cx + Math.cos(theta) * Math.cos(phi) * lobe.rx * r;
      oy = lobe.cy + Math.sin(theta) * Math.cos(phi) * lobe.ry * r;
      oz = lobe.cz + Math.sin(phi) * lobe.rz * r;
    }

    const catRand = Math.random();
    let category: 'primary' | 'secondary' | 'crystalWhite' = 'primary';
    if (catRand < 0.45) category = 'primary';
    else if (catRand < 0.78) category = 'secondary';
    else category = 'crystalWhite';

    const shapeRand = Math.random();
    let shape: 'diamond' | 'star' | 'cross' | 'hexagon' = 'diamond';
    if (shapeRand < 0.45) shape = 'diamond';
    else if (shapeRand < 0.72) shape = 'star';
    else if (shapeRand < 0.88) shape = 'cross';
    else shape = 'hexagon';

    const lifespan = Math.floor(55 + Math.random() * 85);
    const age = forceAgeZero ? 0 : Math.floor(Math.random() * lifespan);
    const size = 1.05 + Math.random() * 1.55;

    return {
      id,
      lobeIdx,
      ox,
      oy,
      oz,
      x: ox,
      y: oy,
      z: oz,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      vz: (Math.random() - 0.5) * 0.25,
      age,
      lifespan,
      size,
      shape,
      category,
      maxAlpha: 0.82 + Math.random() * 0.18,
      yaw: Math.random() * Math.PI * 2,
      pitch: Math.random() * Math.PI * 2,
      yawSpeed: (Math.random() - 0.5) * 0.08,
      pitchSpeed: (Math.random() - 0.5) * 0.08,
      glintPhase: Math.random() * Math.PI * 2,
      glintSpeed: 0.05 + Math.random() * 0.07,
    };
  }, []);

  // Initialize 3D simulation entities
  useEffect(() => {
    // 3 overlapping volumetric lobes forming the organic energy clot with balanced proportions
    const lobes = [
      { cx: 0, cy: 0, cz: 0, rx: 60, ry: 48, rz: 40 },
      { cx: -28, cy: -10, cz: 8, rx: 46, ry: 40, rz: 34 },
      { cx: 28, cy: 10, cz: -8, rx: 48, ry: 42, rz: 36 },
    ];

    // 1. Structural 3D Glitter Flakes (~190 particles)
    const flakeCount = 190;
    const flakes: Flake3D[] = [];

    for (let i = 0; i < flakeCount; i++) {
      const lobeIdx = Math.floor(Math.random() * lobes.length);
      const lobe = lobes[lobeIdx];

      const u = Math.random() + Math.random();
      const r = (u > 1 ? 2 - u : u);
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      const ox = lobe.cx + Math.cos(theta) * Math.cos(phi) * lobe.rx * r;
      const oy = lobe.cy + Math.sin(theta) * Math.cos(phi) * lobe.ry * r;
      const oz = lobe.cz + Math.sin(phi) * lobe.rz * r;

      const catRand = Math.random();
      let category: 'primary' | 'secondary' | 'accent' | 'crystalWhite' = 'primary';
      if (catRand < 0.40) category = 'primary';
      else if (catRand < 0.72) category = 'secondary';
      else if (catRand < 0.88) category = 'accent';
      else category = 'crystalWhite';

      const shapeRand = Math.random();
      let shape: 'diamond' | 'hexagon' | 'star' | 'cross' | 'shard' = 'diamond';
      if (shapeRand < 0.40) shape = 'diamond';
      else if (shapeRand < 0.68) shape = 'hexagon';
      else if (shapeRand < 0.84) shape = 'star';
      else if (shapeRand < 0.94) shape = 'cross';
      else shape = 'shard';

      const sizeRand = Math.random();
      const size = sizeRand < 0.3
        ? 0.9 + Math.random() * 0.55
        : sizeRand < 0.8
        ? 1.4 + Math.random() * 0.75
        : 2.1 + Math.random() * 0.85;

      flakes.push({
        id: i,
        ox,
        oy,
        oz,
        x: ox,
        y: oy,
        z: oz,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        vz: (Math.random() - 0.5) * 0.1,
        mass: 0.85 + Math.random() * 0.65,
        springK: 0.045 + Math.random() * 0.035,
        damping: 0.88 + Math.random() * 0.05,
        size,
        shape,
        category,
        baseAlpha: 0.75 + Math.random() * 0.25,
        yaw: Math.random() * Math.PI * 2,
        pitch: Math.random() * Math.PI * 2,
        roll: Math.random() * Math.PI * 2,
        yawSpeed: (Math.random() - 0.5) * 0.05,
        pitchSpeed: (Math.random() - 0.5) * 0.05,
        rollSpeed: (Math.random() - 0.5) * 0.04,
        glintPhase: Math.random() * Math.PI * 2,
        glintSpeed: 0.035 + Math.random() * 0.05,
        glintScale: 0.9 + Math.random() * 0.8,
        streamlinePhase: Math.random() * Math.PI * 2,
        streamlineSpeed: 0.012 + Math.random() * 0.018,
        streamlineRadius: 1.8 + Math.random() * 2.8,
      });
    }
    flakesRef.current = flakes;

    // 2. Dynamic 3D Sparkling Sparks (~105 dynamic entities)
    const dynamicCount = 105;
    const dynamicSparks: DynamicSpark3D[] = [];
    for (let j = 0; j < dynamicCount; j++) {
      dynamicSparks.push(spawnDynamicSpark(j, lobes, undefined, false));
    }
    dynamicSparksRef.current = dynamicSparks;

    // 3. Ambient 3D Stardust Dust (~48 points)
    const dustCount = 48;
    const ambientDust: AmbientDust[] = [];
    for (let k = 0; k < dustCount; k++) {
      ambientDust.push({
        x: 0,
        y: 0,
        z: (Math.random() - 0.5) * 35,
        radius: 0.55 + Math.random() * 0.85,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: 20 + Math.random() * 32,
        orbitSpeed: (Math.random() - 0.5) * 0.016,
        verticalFreq: 0.015 + Math.random() * 0.02,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.04 + Math.random() * 0.06,
        isAccent: Math.random() < 0.45,
      });
    }
    ambientDustRef.current = ambientDust;
  }, [spawnDynamicSpark]);

  // Mode flare color triggers
  useEffect(() => {
    const c = colorLerpRef.current;
    if (mode === 'gold-flash') {
      c.targetRatio = 1;
      c.targetR = 251; c.targetG = 191; c.targetB = 36;
    } else if (mode === 'warm') {
      c.targetRatio = 1;
      c.targetR = 245; c.targetG = 158; c.targetB = 11;
    } else if (mode === 'red-flash' || mode === 'negative') {
      c.targetRatio = 1;
      c.targetR = 244; c.targetG = 63; c.targetB = 94;
    } else if (hasAdvice) {
      c.targetRatio = 1;
      c.targetR = 244; c.targetG = 63; c.targetB = 94;
    } else {
      c.targetRatio = 0;
    }
  }, [mode, hasAdvice]);

  // Main 60-120fps Delta-Time Physical Simulation & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    let lastTime = performance.now();
    let simTime = 0;

    const lobes = [
      { cx: 0, cy: 0, cz: 0, rx: 60, ry: 48, rz: 40 },
      { cx: -28, cy: -10, cz: 8, rx: 46, ry: 40, rz: 34 },
      { cx: 28, cy: 10, cz: -8, rx: 48, ry: 42, rz: 36 },
    ];

    const render = (now: number) => {
      if (!isRunning) return;

      // 1. High-precision Normalized Delta Time
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(0.05, Math.max(0.005, rawDt));
      const step = dt / 0.016667; // Normalized: exactly 1.0 at 60fps, 0.5 at 120fps
      simTime += dt;

      // Canvas DPR setup for crisp diamond glints
      const dpr = window.devicePixelRatio || 1;
      const logicalWidth = 360;
      const logicalHeight = 150;

      if (canvas.width !== logicalWidth * dpr || canvas.height !== logicalHeight * dpr) {
        canvas.width = logicalWidth * dpr;
        canvas.height = logicalHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      const centerX = logicalWidth / 2; // 180
      const centerY = logicalHeight / 2; // 75

      // 2. SOFT-BODY VISCOELASTIC CLOT DISPLACEMENT & SPRING RESPONSE
      const sp = clotPhysicsRef.current;
      const ptr = pointerRef.current;

      if (ptr.active) {
        const dx = ptr.x - centerX;
        const dy = ptr.y - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist > 1.2) {
          sp.pullAngle = Math.atan2(dy, dx);
          const maxPull = ptr.isDown ? 28 : 12;
          const pull = Math.min(maxPull, dist * (ptr.isDown ? 0.38 : 0.15));
          sp.targetX = Math.cos(sp.pullAngle) * pull;
          sp.targetY = Math.sin(sp.pullAngle) * pull;
          sp.pullMag = pull;
        } else {
          sp.targetX = 0;
          sp.targetY = 0;
          sp.pullMag = 0;
        }
      } else {
        sp.targetX = 0;
        sp.targetY = 0;
        sp.pullMag = 0;
      }

      // Spring damper with dt scaling
      const springK = ptr.isDown ? 0.24 : 0.14;
      const springDamping = Math.pow(ptr.isDown ? 0.79 : 0.86, step);

      const fX = (sp.targetX - sp.x) * springK;
      const fY = (sp.targetY - sp.y) * springK;

      sp.vx = (sp.vx + fX * step) * springDamping;
      sp.vy = (sp.vy + fY * step) * springDamping;

      sp.x += sp.vx * step;
      sp.y += sp.vy * step;

      // Organic fluid wobble oscillation (jelly recoil)
      if (sp.wobbleAmp > 0.05) {
        sp.wobblePhase += 0.22 * step;
        sp.wobbleAmp *= Math.pow(0.93, step);
      } else {
        sp.wobbleAmp = 0;
      }
      const wobbleX = Math.cos(sp.wobblePhase) * sp.wobbleAmp;
      const wobbleY = Math.sin(sp.wobblePhase) * sp.wobbleAmp;

      // 3. CIRCADIAN GLITTER FACTOR & THINKING SURGE
      const nowClock = new Date();
      const curH = nowClock.getHours() + nowClock.getMinutes() / 60;
      let circFactor = 1.0;
      if (curH >= 0 && curH < 6) circFactor = 0.35;
      else if (curH >= 6 && curH < 10) circFactor = 0.52;
      else if (curH >= 10 && curH < 18) circFactor = 0.78 + ((curH - 10) / 8) * 0.28;
      else circFactor = 1.06 + ((curH - 18) / 6) * 0.24;

      const thinkingTarget = isThinkingRef.current ? 2.3 : 1.0;
      const targetGlitterScale = circFactor * thinkingTarget;
      glitterScaleRef.current += (targetGlitterScale - glitterScaleRef.current) * (0.07 * step);
      const curGlitterScale = glitterScaleRef.current;

      // 4. PERIODIC CRYSTALLINE FREEZE (Завмирання блискіток на 1.2 секунди)
      const fs = freezeStateRef.current;
      fs.cycleTimer += step;
      const cyclePos = fs.cycleTimer % 520;
      let freezeTarget = 0;
      if (cyclePos >= 410 && cyclePos < 430) {
        const t = (cyclePos - 410) / 20;
        freezeTarget = t * t * (3 - 2 * t);
      } else if (cyclePos >= 430 && cyclePos < 495) {
        freezeTarget = 1.0; // Suspended in crystalline time
      } else if (cyclePos >= 495 && cyclePos < 515) {
        const t = 1 - (cyclePos - 495) / 20;
        freezeTarget = t * t * (3 - 2 * t);
      } else {
        freezeTarget = 0;
      }
      fs.freezeFactor = freezeTarget;
      const motionFactor = (1 - fs.freezeFactor * 0.94);

      // 5. COLOR PALETTE RESOLUTION (Calm Lightness / Hue / Advice Alert)
      const cLerp = colorLerpRef.current;
      const isWarmMode = cLerp.targetRatio > cLerp.ratio;
      const lerpSpeed = (isWarmMode ? 0.024 : 0.016) * step;
      cLerp.ratio += (cLerp.targetRatio - cLerp.ratio) * lerpSpeed;
      const smoothBlend = cLerp.ratio * cLerp.ratio * (3 - 2 * cLerp.ratio);
      const calmBlend = 1 - smoothBlend;

      const isAdvice = hasAdviceRef.current;
      const baseHue = isAdvice ? 355 : (calmHueRef.current ?? 330);
      const lightness = isAdvice ? 62 : (calmLightnessRef.current ?? 60);

      // Derive base colors: Support pure white (100%), pure black (0%), and full hue spectrum
      let coreRGB: [number, number, number];
      let secondaryRGB: [number, number, number];
      let accentRGB: [number, number, number];
      let crystalWhiteRGB: [number, number, number];

      if (isAdvice) {
        coreRGB = [244, 63, 94]; // Radiant Coral Red
        secondaryRGB = [251, 113, 133]; // Rose Crimson
        accentRGB = [253, 164, 175]; // Blossom Pink
        crystalWhiteRGB = [255, 235, 240];
      } else if (lightness === 100) {
        // Pure White Monochrome: Diamond Platinum, Moonstone & Ice Crystal
        coreRGB = [255, 255, 255];
        secondaryRGB = [240, 245, 255];
        accentRGB = [225, 235, 250];
        crystalWhiteRGB = [255, 255, 255];
      } else if (lightness === 0) {
        // Pure Black Monochrome: Velvet Obsidian, Midnight Onyx with Diamond Sparkles
        coreRGB = [24, 24, 32];
        secondaryRGB = [40, 42, 54];
        accentRGB = [60, 64, 82];
        crystalWhiteRGB = [230, 235, 250];
      } else {
        // Spectrum: Derived dynamically from hue & lightness
        const sat = Math.max(65, Math.min(95, 100 - Math.abs(lightness - 50) * 0.6));
        coreRGB = hslToRgb(baseHue, sat, lightness);
        secondaryRGB = hslToRgb((baseHue + 32) % 360, sat * 0.92, Math.min(92, lightness + 6));
        accentRGB = hslToRgb((baseHue - 28 + 360) % 360, sat * 0.88, Math.max(16, lightness - 8));
        crystalWhiteRGB = hslToRgb(baseHue, 18, Math.min(98, lightness + 35));
      }

      // Final interpolated RGB channels
      const rCore = Math.round(coreRGB[0] * calmBlend + cLerp.targetR * smoothBlend);
      const gCore = Math.round(coreRGB[1] * calmBlend + cLerp.targetG * smoothBlend);
      const bCore = Math.round(coreRGB[2] * calmBlend + cLerp.targetB * smoothBlend);

      const rSec = Math.round(secondaryRGB[0] * calmBlend + cLerp.targetR * smoothBlend);
      const gSec = Math.round(secondaryRGB[1] * calmBlend + cLerp.targetG * smoothBlend);
      const bSec = Math.round(secondaryRGB[2] * calmBlend + cLerp.targetB * smoothBlend);

      // 6. NEURAL FLARES DURING DIALOGUE
      const dReg = dialogueRegionRef.current;
      if (isDialogueActiveRef.current) {
        dReg.timer += step;
        if (dReg.timer > 26) {
          dReg.timer = 0;
          dReg.activeRegionIdx = (dReg.activeRegionIdx + 1 + Math.floor(Math.random() * 3)) % 5;
          dReg.flashIntensity = 1.0;
        }
        dReg.flashIntensity = Math.max(0, dReg.flashIntensity - 0.032 * step);
      } else {
        dReg.flashIntensity = 0;
      }

      const neuralRegions = [
        { x: centerX, y: centerY, r: 38 },
        { x: centerX - 26, y: centerY - 10, r: 32 },
        { x: centerX + 26, y: centerY + 6, r: 32 },
        { x: centerX, y: centerY - 25, r: 28 },
        { x: centerX, y: centerY + 22, r: 28 },
      ];
      const activeRegion = neuralRegions[dReg.activeRegionIdx];

      // 7. VOLUMETRIC AURA & AMBIENT RADIANT SHEEN
      const clotCX = centerX + sp.x * 0.5 + wobbleX;
      const clotCY = centerY + sp.y * 0.5 + wobbleY;
      const breath = Math.sin(simTime * 1.8) * 1.6;
      const breathScale = 1 + Math.sin(simTime * 1.8) * 0.024;

      // Soft plasma core
      const coreRadius = 46 + breath;
      const gCoreGrad = ctx.createRadialGradient(
        clotCX - 3, clotCY - 3, 2,
        clotCX, clotCY, coreRadius
      );
      const coreAlpha = (isAdvice ? 0.75 : lightness === 0 ? 0.35 : 0.65);
      gCoreGrad.addColorStop(0, `rgba(${rCore}, ${gCore}, ${bCore}, ${coreAlpha})`);
      gCoreGrad.addColorStop(0.48, `rgba(${rCore}, ${gCore}, ${bCore}, ${coreAlpha * 0.45})`);
      gCoreGrad.addColorStop(1, `rgba(${rCore}, ${gCore}, ${bCore}, 0)`);

      ctx.fillStyle = gCoreGrad;
      ctx.beginPath();
      ctx.arc(clotCX, clotCY, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Secondary chromatic mist
      const gSecGrad = ctx.createRadialGradient(
        clotCX + 6, clotCY + 4, 3,
        clotCX, clotCY, coreRadius * 0.88
      );
      gSecGrad.addColorStop(0, `rgba(${rSec}, ${gSec}, ${bSec}, ${coreAlpha * 0.55})`);
      gSecGrad.addColorStop(0.55, `rgba(${rSec}, ${gSec}, ${bSec}, ${coreAlpha * 0.22})`);
      gSecGrad.addColorStop(1, `rgba(${rSec}, ${gSec}, ${bSec}, 0)`);

      ctx.fillStyle = gSecGrad;
      ctx.beginPath();
      ctx.arc(clotCX, clotCY, coreRadius * 0.88, 0, Math.PI * 2);
      ctx.fill();

      // Crystalline caustic beams
      const causticAngle = simTime * 0.45;
      ctx.save();
      ctx.translate(clotCX, clotCY);
      ctx.rotate(causticAngle);
      for (let ray = 0; ray < 3; ray++) {
        ctx.rotate((Math.PI * 2) / 3);
        const rayGrad = ctx.createLinearGradient(0, -28, 0, 28);
        const rayAlpha = (0.04 + Math.sin(simTime * 2.2 + ray) * 0.02) * (lightness === 0 ? 0.5 : 1);
        rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        rayGrad.addColorStop(0.5, `rgba(255, 255, 255, ${rayAlpha})`);
        rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = rayGrad;
        ctx.fillRect(-2, -30, 4, 60);
      }
      ctx.restore();

      // 8. AMBIENT SHIMMER DUST (BACKGROUND LAYER)
      const dust = ambientDustRef.current;
      for (let k = 0; k < dust.length; k++) {
        const d = dust[k];
        d.orbitAngle += d.orbitSpeed * motionFactor * step;
        d.twinklePhase += d.twinkleSpeed * (0.35 + 0.65 * motionFactor) * step;

        const curR = d.orbitRadius + Math.sin(simTime * 1.5 + k) * 2.2;
        const dx = clotCX + Math.cos(d.orbitAngle) * curR;
        const dy = clotCY + Math.sin(d.orbitAngle) * (curR * 0.78) + Math.sin(simTime * d.verticalFreq) * 3;
        const dAlpha = (0.22 + Math.pow(Math.abs(Math.sin(d.twinklePhase)), 2) * 0.68) * Math.min(1.2, curGlitterScale);

        let dR = 255, dG = 255, dB = 255;
        if (isAdvice) {
          dR = 251; dG = 113; dB = 133;
        } else if (d.isAccent) {
          [dR, dG, dB] = secondaryRGB;
        } else {
          [dR, dG, dB] = coreRGB;
        }

        ctx.fillStyle = `rgba(${dR}, ${dG}, ${dB}, ${dAlpha})`;
        ctx.beginPath();
        ctx.arc(dx, dy, d.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 9. VIRTUAL 3D LIGHT SOURCE FOR DIAMOND SPECULAR GLINTS
      // Orbiting light vector in front of the clot producing authentic scintillation
      const lightYaw = simTime * 0.8;
      const lightPitch = 0.55 + Math.sin(simTime * 0.5) * 0.25;
      const lx = Math.cos(lightYaw) * Math.cos(lightPitch);
      const ly = Math.sin(lightPitch);
      const lz = Math.sin(lightYaw) * Math.cos(lightPitch);

      // 10. PHYSICAL 3D CURL STREAMLINE VELOCITY FIELD
      // Computes realistic organic fluid circulation & vortex eddies
      const getFluidVelocity = (x: number, y: number, z: number, isThink: boolean) => {
        const r = Math.hypot(x, y);
        let vx = 0, vy = 0, vz = 0;

        if (isThink) {
          // Analytical inward Fibonacci spiral vortex!
          if (r > 2) {
            const theta = Math.atan2(y, x);
            const thinkInward = 0.22;
            const thinkSwirl = 0.35 / (1 + r * 0.02);
            vx = -Math.cos(theta) * thinkInward - Math.sin(theta) * thinkSwirl;
            vy = -Math.sin(theta) * thinkInward + Math.cos(theta) * thinkSwirl;
            vz = Math.sin(r * 0.15 - simTime * 3) * 0.2;
          }
        } else {
          // Harmonious toroidal circulation + multi-scale fluid eddies
          const theta = Math.atan2(y, x);
          const vortexCirc = 0.09 / (1 + r * 0.025);
          vx = -Math.sin(theta) * vortexCirc * (r * 0.12);
          vy = Math.cos(theta) * vortexCirc * (r * 0.12);

          // Micro-turbulence eddies
          vx += Math.sin(y * 0.09 + simTime * 0.9) * Math.cos(z * 0.08 + simTime * 0.7) * 0.18;
          vy += Math.cos(x * 0.09 + simTime * 0.9) * Math.sin(z * 0.08 + simTime * 0.7) * 0.18;
          vz = Math.sin(x * 0.08 - y * 0.08 + simTime * 0.8) * 0.14;
        }

        return { vx, vy, vz };
      };

      // 11. UPDATE AND DRAW 3D STRUCTURAL GLITTER FLAKES
      const flakes = flakesRef.current;
      const stretchCos = Math.cos(sp.pullAngle);
      const stretchSin = Math.sin(sp.pullAngle);
      const stretchFactor = sp.pullMag > 0 ? (sp.pullMag / 22) * 0.38 : 0;

      const activeFlakeCount = Math.min(
        flakes.length,
        Math.max(48, Math.floor(flakes.length * 0.74 * curGlitterScale))
      );

      // Depth sorting perspective constant
      const fov = 150;

      for (let i = 0; i < activeFlakeCount; i++) {
        const p = flakes[i];

        // 3D rotation update
        p.yaw += p.yawSpeed * motionFactor * step;
        p.pitch += p.pitchSpeed * motionFactor * step;
        p.roll += p.rollSpeed * motionFactor * step;
        p.glintPhase += p.glintSpeed * (0.35 + 0.65 * motionFactor) * step;
        p.streamlinePhase += p.streamlineSpeed * motionFactor * step;

        // Fluid streamline drift
        const streamX = Math.cos(p.streamlinePhase) * p.streamlineRadius;
        const streamY = Math.sin(p.streamlinePhase) * p.streamlineRadius;

        // Elongation towards touch/drag
        const proj = (p.ox * stretchCos + p.oy * stretchSin);
        const elongation = proj > 0 ? proj * stretchFactor : proj * stretchFactor * 0.28;

        const targetX = p.ox * breathScale + elongation * stretchCos + streamX;
        const targetY = p.oy * breathScale + elongation * stretchSin + streamY;
        const targetZ = p.oz;

        // Spring force towards anchor
        const fx = (targetX - p.x) * p.springK;
        const fy = (targetY - p.y) * p.springK;
        const fz = (targetZ - p.z) * p.springK;

        p.vx = (p.vx + (fx / p.mass) * step) * Math.pow(p.damping, step);
        p.vy = (p.vy + (fy / p.mass) * step) * Math.pow(p.damping, step);
        p.vz = (p.vz + (fz / p.mass) * step) * Math.pow(p.damping, step);

        // Fluid velocity field force
        const fluid = getFluidVelocity(p.x, p.y, p.z, isThinkingRef.current);
        p.vx += fluid.vx * motionFactor * step;
        p.vy += fluid.vy * motionFactor * step;
        p.vz += fluid.vz * motionFactor * step;

        p.x += p.vx * motionFactor * step;
        p.y += p.vy * motionFactor * step;
        p.z += p.vz * motionFactor * step;

        // 3D Perspective Projection with depth parallax
        const depthK = (fov + p.z) / fov;
        const screenX = clotCX + p.x * depthK;
        const screenY = clotCY + p.y * depthK;

        // 3D Facet normal vector
        const nx = Math.sin(p.yaw) * Math.cos(p.pitch);
        const ny = Math.sin(p.pitch);
        const nz = Math.cos(p.yaw) * Math.cos(p.pitch);

        // Specular dot product with virtual 3D light vector
        const dotLight = Math.max(0, nx * lx + ny * ly + nz * lz);
        let specular = Math.pow(dotLight, 8) * Math.pow(Math.abs(Math.sin(p.glintPhase)), 2);

        // Dialogue neural flash boost
        if (dReg.flashIntensity > 0) {
          const rDist = Math.hypot(screenX - activeRegion.x, screenY - activeRegion.y);
          if (rDist < activeRegion.r) {
            const boost = (1 - rDist / activeRegion.r) * dReg.flashIntensity * 0.9;
            specular = Math.min(1, specular + boost);
          }
        }

        // Particle color according to category & theme
        let pRGB = coreRGB;
        if (p.category === 'secondary') pRGB = secondaryRGB;
        else if (p.category === 'accent') pRGB = accentRGB;
        else if (p.category === 'crystalWhite') pRGB = crystalWhiteRGB;

        const pR = Math.round(pRGB[0] * calmBlend + cLerp.targetR * smoothBlend);
        const pG = Math.round(pRGB[1] * calmBlend + cLerp.targetG * smoothBlend);
        const pB = Math.round(pRGB[2] * calmBlend + cLerp.targetB * smoothBlend);

        // Depth-scaled alpha and size
        const depthAlpha = Math.max(0.25, Math.min(1.0, 0.65 + (p.z / 60)));
        const finalAlpha = Math.min(1, (p.baseAlpha * depthAlpha) + specular * 0.4);
        const currentSize = p.size * depthK * (0.88 + specular * 0.55);

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(p.roll);

        ctx.fillStyle = `rgba(${pR}, ${pG}, ${pB}, ${finalAlpha})`;

        // Geometric Diamond & Facet Rendering
        if (p.shape === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(0, -currentSize * 1.35);
          ctx.lineTo(currentSize * 0.88, 0);
          ctx.lineTo(0, currentSize * 1.35);
          ctx.lineTo(-currentSize * 0.88, 0);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'hexagon') {
          ctx.beginPath();
          for (let stepIdx = 0; stepIdx < 6; stepIdx++) {
            const rad = (stepIdx * Math.PI) / 3;
            const hx = Math.cos(rad) * currentSize;
            const hy = Math.sin(rad) * currentSize;
            if (stepIdx === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'star') {
          ctx.beginPath();
          ctx.moveTo(0, -currentSize * 1.4);
          ctx.lineTo(currentSize * 0.42, -currentSize * 0.42);
          ctx.lineTo(currentSize * 1.4, 0);
          ctx.lineTo(currentSize * 0.42, currentSize * 0.42);
          ctx.lineTo(0, currentSize * 1.4);
          ctx.lineTo(-currentSize * 0.42, currentSize * 0.42);
          ctx.lineTo(-currentSize * 1.4, 0);
          ctx.lineTo(-currentSize * 0.42, -currentSize * 0.42);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'cross') {
          const arm = currentSize * 1.15;
          const th = currentSize * 0.35;
          ctx.beginPath();
          ctx.moveTo(-th, -arm);
          ctx.lineTo(th, -arm);
          ctx.lineTo(th, -th);
          ctx.lineTo(arm, -th);
          ctx.lineTo(arm, th);
          ctx.lineTo(th, th);
          ctx.lineTo(th, arm);
          ctx.lineTo(-th, arm);
          ctx.lineTo(-th, th);
          ctx.lineTo(-arm, th);
          ctx.lineTo(-arm, -th);
          ctx.lineTo(-th, -th);
          ctx.closePath();
          ctx.fill();
        } else {
          // Crystalline Shard
          ctx.beginPath();
          ctx.moveTo(0, -currentSize * 1.5);
          ctx.lineTo(currentSize * 0.7, -currentSize * 0.2);
          ctx.lineTo(currentSize * 0.3, currentSize * 1.4);
          ctx.lineTo(-currentSize * 0.5, currentSize * 0.4);
          ctx.closePath();
          ctx.fill();
        }

        // 12. DIAMOND SCINTILLATION BURST & PRISMATIC CHROMATIC DISPERSION
        if (specular > 0.42) {
          const rayLen = Math.max(0.7, Math.min(1.6, p.glintScale * 0.52 * (0.6 + specular * 0.6)));

          // Prismatic chromatic dispersion (red and blue light split slightly)
          if (specular > 0.55 && lightness !== 0) {
            ctx.save();
            ctx.fillStyle = `rgba(255, 80, 120, ${specular * 0.38})`;
            ctx.beginPath();
            ctx.arc(-0.4, 0, 0.6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(80, 180, 255, ${specular * 0.38})`;
            ctx.beginPath();
            ctx.arc(0.4, 0, 0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Pure brilliant diamond core
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, specular * 1.1)})`;
          ctx.beginPath();
          ctx.arc(0, 0, 0.9, 0, Math.PI * 2);
          ctx.fill();

          // 4-point diffraction spikes (tapered crystalline rays)
          ctx.strokeStyle = `rgba(255, 255, 255, ${specular * 0.9})`;
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          ctx.moveTo(-rayLen, 0);
          ctx.lineTo(rayLen, 0);
          ctx.moveTo(0, -rayLen);
          ctx.lineTo(0, rayLen);
          ctx.stroke();

          // Delicate 45° diagonal micro-facets
          ctx.strokeStyle = `rgba(255, 255, 255, ${specular * 0.4})`;
          ctx.lineWidth = 0.45;
          const diag = rayLen * 0.4;
          ctx.beginPath();
          ctx.moveTo(-diag, -diag);
          ctx.lineTo(diag, diag);
          ctx.moveTo(diag, -diag);
          ctx.lineTo(-diag, diag);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 13. UPDATE AND DRAW 3D DYNAMIC SPARKS (EMERGE, SHINE, DISSOLVE)
      const dynamicSparks = dynamicSparksRef.current;
      const activeDynamicCount = Math.min(
        dynamicSparks.length,
        Math.max(14, Math.floor(dynamicSparks.length * 0.78 * curGlitterScale))
      );

      for (let s = 0; s < activeDynamicCount; s++) {
        const spark = dynamicSparks[s];

        if (fs.freezeFactor < 0.90) {
          spark.age += step;
        }

        // Respawn when lifespan expires
        if (spark.age >= spark.lifespan) {
          dynamicSparks[s] = spawnDynamicSpark(spark.id, lobes, undefined, true);
          continue;
        }

        const progress = spark.age / spark.lifespan;

        // Smooth biological envelope: Birth -> Peak Diamond Brilliance -> Sublimation
        let lifeAlpha = 0;
        if (progress < 0.22) {
          lifeAlpha = Math.sin((progress / 0.22) * (Math.PI / 2));
        } else if (progress < 0.70) {
          lifeAlpha = 1.0;
        } else {
          lifeAlpha = Math.cos(((progress - 0.70) / 0.30) * (Math.PI / 2));
        }

        spark.yaw += spark.yawSpeed * motionFactor * step;
        spark.pitch += spark.pitchSpeed * motionFactor * step;
        spark.glintPhase += spark.glintSpeed * (0.35 + 0.65 * motionFactor) * step;

        const proj = (spark.ox * stretchCos + spark.oy * stretchSin);
        const elongation = proj > 0 ? proj * stretchFactor : proj * stretchFactor * 0.28;

        const targetX = spark.ox * breathScale + elongation * stretchCos;
        const targetY = spark.oy * breathScale + elongation * stretchSin;
        const targetZ = spark.oz;

        spark.vx = (spark.vx + (targetX - spark.x) * (0.09 * step)) * Math.pow(0.85, step);
        spark.vy = (spark.vy + (targetY - spark.y) * (0.09 * step)) * Math.pow(0.85, step);
        spark.vz = (spark.vz + (targetZ - spark.z) * (0.09 * step)) * Math.pow(0.85, step);

        const fluid = getFluidVelocity(spark.x, spark.y, spark.z, isThinkingRef.current);
        spark.vx += fluid.vx * 1.25 * motionFactor * step;
        spark.vy += fluid.vy * 1.25 * motionFactor * step;
        spark.vz += fluid.vz * 1.25 * motionFactor * step;

        spark.x += spark.vx * motionFactor * step;
        spark.y += spark.vy * motionFactor * step;
        spark.z += spark.vz * motionFactor * step;

        const depthK = (fov + spark.z) / fov;
        const screenX = clotCX + spark.x * depthK;
        const screenY = clotCY + spark.y * depthK;

        // 3D Scintillation normal dot light
        const snx = Math.sin(spark.yaw) * Math.cos(spark.pitch);
        const sny = Math.sin(spark.pitch);
        const snz = Math.cos(spark.yaw) * Math.cos(spark.pitch);
        const sDot = Math.max(0, snx * lx + sny * ly + snz * lz);
        let sGlint = Math.pow(sDot, 7) * Math.pow(Math.abs(Math.sin(spark.glintPhase)), 2);

        if (dReg.flashIntensity > 0) {
          const rDist = Math.hypot(screenX - activeRegion.x, screenY - activeRegion.y);
          if (rDist < activeRegion.r) {
            sGlint = Math.min(1, sGlint + (1 - rDist / activeRegion.r) * dReg.flashIntensity * 0.9);
          }
        }

        let sRGB = coreRGB;
        if (spark.category === 'secondary') sRGB = secondaryRGB;
        else if (spark.category === 'crystalWhite') sRGB = crystalWhiteRGB;

        const sR = Math.round(sRGB[0] * calmBlend + cLerp.targetR * smoothBlend);
        const sG = Math.round(sRGB[1] * calmBlend + cLerp.targetG * smoothBlend);
        const sB = Math.round(sRGB[2] * calmBlend + cLerp.targetB * smoothBlend);

        const sparkCombinedAlpha = Math.min(1, lifeAlpha * (spark.maxAlpha + sGlint * 0.35));
        const sparkSize = spark.size * depthK * (0.85 + sGlint * 0.65);

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(spark.yaw);

        ctx.fillStyle = `rgba(${sR}, ${sG}, ${sB}, ${sparkCombinedAlpha})`;

        if (spark.shape === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(0, -sparkSize * 1.38);
          ctx.lineTo(sparkSize * 0.88, 0);
          ctx.lineTo(0, sparkSize * 1.38);
          ctx.lineTo(-sparkSize * 0.88, 0);
          ctx.closePath();
          ctx.fill();
        } else if (spark.shape === 'star') {
          ctx.beginPath();
          ctx.moveTo(0, -sparkSize * 1.45);
          ctx.lineTo(sparkSize * 0.38, -sparkSize * 0.38);
          ctx.lineTo(sparkSize * 1.45, 0);
          ctx.lineTo(sparkSize * 0.38, sparkSize * 0.38);
          ctx.lineTo(0, sparkSize * 1.45);
          ctx.lineTo(-sparkSize * 0.38, sparkSize * 0.38);
          ctx.lineTo(-sparkSize * 1.45, 0);
          ctx.lineTo(-sparkSize * 0.38, -sparkSize * 0.38);
          ctx.closePath();
          ctx.fill();
        } else if (spark.shape === 'cross') {
          const arm = sparkSize * 1.15;
          const th = sparkSize * 0.32;
          ctx.beginPath();
          ctx.moveTo(-th, -arm);
          ctx.lineTo(th, -arm);
          ctx.lineTo(th, -th);
          ctx.lineTo(arm, -th);
          ctx.lineTo(arm, th);
          ctx.lineTo(th, th);
          ctx.lineTo(th, arm);
          ctx.lineTo(-th, arm);
          ctx.lineTo(-th, th);
          ctx.lineTo(-arm, th);
          ctx.lineTo(-arm, -th);
          ctx.lineTo(-th, -th);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          for (let stepIdx = 0; stepIdx < 6; stepIdx++) {
            const rad = (stepIdx * Math.PI) / 3;
            const hx = Math.cos(rad) * sparkSize;
            const hy = Math.sin(rad) * sparkSize;
            if (stepIdx === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.fill();
        }

        // Radiant Sparkle Glint Ray & Micro Bloom
        if (sGlint > 0.38 && lifeAlpha > 0.3) {
          const rayLen = Math.max(0.65, Math.min(1.5, 0.5 * (0.6 + sGlint * 0.6) * lifeAlpha));

          // Soft radiant bloom aura
          const bloom = ctx.createRadialGradient(0, 0, 0, 0, 0, rayLen * 1.35);
          bloom.addColorStop(0, `rgba(255, 255, 255, ${0.4 * sGlint * lifeAlpha})`);
          bloom.addColorStop(0.5, `rgba(${sR}, ${sG}, ${sB}, ${0.15 * sGlint * lifeAlpha})`);
          bloom.addColorStop(1, `rgba(${sR}, ${sG}, ${sB}, 0)`);
          ctx.fillStyle = bloom;
          ctx.beginPath();
          ctx.arc(0, 0, rayLen * 1.35, 0, Math.PI * 2);
          ctx.fill();

          // Diamond white core
          ctx.fillStyle = `rgba(255, 255, 255, ${sGlint * lifeAlpha})`;
          ctx.beginPath();
          ctx.arc(0, 0, 0.85, 0, Math.PI * 2);
          ctx.fill();

          // 4-point glittering rays
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.88 * sGlint * lifeAlpha})`;
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          ctx.moveTo(-rayLen, 0);
          ctx.lineTo(rayLen, 0);
          ctx.moveTo(0, -rayLen);
          ctx.lineTo(0, rayLen);
          ctx.stroke();

          // Diagonal micro-accent
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 * sGlint * lifeAlpha})`;
          ctx.lineWidth = 0.42;
          const diag = rayLen * 0.38;
          ctx.beginPath();
          ctx.moveTo(-diag, -diag);
          ctx.lineTo(diag, diag);
          ctx.moveTo(diag, -diag);
          ctx.lineTo(-diag, diag);
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore();

      const isEco =
        document.documentElement.getAttribute('data-perf-boost') === 'true' ||
        document.documentElement.getAttribute('data-economy') === 'true' ||
        document.documentElement.getAttribute('data-auto-eco') === 'true' ||
        localStorage.getItem('quit-smoking:perf-boost') === 'true';

      if (!isEco && isRunning) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    const handleEcoChange = () => {
      if (isRunning) {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    window.addEventListener('perf-boost-change', handleEcoChange);
    window.addEventListener('auto-eco-config-change', handleEcoChange);
    window.addEventListener('storage', handleEcoChange);

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      window.removeEventListener('perf-boost-change', handleEcoChange);
      window.removeEventListener('auto-eco-config-change', handleEcoChange);
      window.removeEventListener('storage', handleEcoChange);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [spawnDynamicSpark]);

  // POINTER & TOUCH INTERACTIONS
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isLongPressTriggeredRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };

    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      isLongPressTriggeredRef.current = true;
      if (navigator.vibrate) {
        try { navigator.vibrate([40, 80, 40]); } catch {}
      }
      if (onLongPress) onLongPress();
    }, 3000);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const localX = 180 + (e.clientX - (rect.left + rect.width / 2));
      const localY = 75 + (e.clientY - (rect.top + rect.height / 2));
      const distFromCenter = Math.hypot(localX - 180, localY - 75);
      if (distFromCenter > 65) return;

      pointerRef.current = {
        active: true,
        isDown: true,
        x: localX,
        y: localY,
        prevX: localX,
        prevY: localY,
        vx: 0,
        vy: 0,
      };

      // Acoustic Pressure Shockwave & Sparks Explosion on Tap!
      const flakes = flakesRef.current;
      for (let i = 0; i < flakes.length; i++) {
        const p = flakes[i];
        const screenX = 180 + p.x;
        const screenY = 75 + p.y;
        const dist = Math.hypot(screenX - localX, screenY - localY);
        if (dist < 68) {
          const impulse = (1 - dist / 68) * 9.5;
          const angle = Math.atan2(screenY - localY, screenX - localX);
          p.vx += Math.cos(angle) * impulse;
          p.vy += Math.sin(angle) * impulse;
          p.vz += (Math.random() - 0.5) * impulse;
          p.yawSpeed += (Math.random() - 0.5) * 0.3;
          p.pitchSpeed += (Math.random() - 0.5) * 0.3;
          p.glintSpeed += 0.08;
        }
      }

      // Spawn extra lively sparks right at contact
      const lobes = [
        { cx: 0, cy: 0, cz: 0, rx: 32, ry: 25, rz: 22 },
        { cx: -17, cy: -8, cz: 4, rx: 24, ry: 20, rz: 18 },
        { cx: 18, cy: 6, cz: -5, rx: 25, ry: 22, rz: 19 },
      ];
      const dynamicSparks = dynamicSparksRef.current;
      const spawnCount = Math.min(24, dynamicSparks.length);
      for (let s = 0; s < spawnCount; s++) {
        const idx = Math.floor(Math.random() * dynamicSparks.length);
        const relX = localX - 180;
        const relY = localY - 75;
        const newSpark = spawnDynamicSpark(dynamicSparks[idx].id, lobes, { x: relX, y: relY, z: 0 }, true);
        const burstAngle = Math.random() * Math.PI * 2;
        const burstSpeed = 1.6 + Math.random() * 4.0;
        newSpark.vx = Math.cos(burstAngle) * burstSpeed;
        newSpark.vy = Math.sin(burstAngle) * burstSpeed;
        newSpark.vz = (Math.random() - 0.5) * burstSpeed;
        dynamicSparks[idx] = newSpark;
      }
    }
  }, [onLongPress, spawnDynamicSpark]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current) {
      const dist = Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y);
      if (dist > 10 && longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const localX = 180 + (e.clientX - (rect.left + rect.width / 2));
    const localY = 75 + (e.clientY - (rect.top + rect.height / 2));

    const ptr = pointerRef.current;
    ptr.vx = localX - ptr.x;
    ptr.vy = localY - ptr.y;
    ptr.x = localX;
    ptr.y = localY;
    ptr.active = true;

    // Inject fluid momentum on drag
    if (ptr.isDown) {
      const flakes = flakesRef.current;
      for (let i = 0; i < flakes.length; i++) {
        flakes[i].vx += ptr.vx * 0.08;
        flakes[i].vy += ptr.vy * 0.08;
      }
      const dynamicSparks = dynamicSparksRef.current;
      for (let j = 0; j < dynamicSparks.length; j++) {
        dynamicSparks[j].vx += ptr.vx * 0.1;
        dynamicSparks[j].vy += ptr.vy * 0.1;
      }
    }
  }, []);

  const lastTapTimeRef = useRef(0);
  const triggerClickSafely = useCallback(() => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < 280) return;
    lastTapTimeRef.current = now;
    onClick();
  }, [onClick]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (isLongPressTriggeredRef.current) {
      isLongPressTriggeredRef.current = false;
      pointerRef.current.isDown = false;
      pointerRef.current.active = false;
      dragStartRef.current = null;
      return;
    }

    pointerRef.current.isDown = false;
    pointerRef.current.active = false;

    // Trigger organic jelly recoil wobble
    clotPhysicsRef.current.wobbleAmp = 7.0;

    if (dragStartRef.current) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      const totalDist = Math.hypot(deltaX, deltaY);
      dragStartRef.current = null;

      // Swipe trigger
      if (totalDist > 20) {
        if (navigator.vibrate) {
          try { navigator.vibrate(12); } catch {}
        }
        const swipeAngle = Math.atan2(deltaY, deltaX);
        const flakes = flakesRef.current;
        for (let i = 0; i < flakes.length; i++) {
          flakes[i].vx += Math.cos(swipeAngle) * (8.5 + Math.random() * 5);
          flakes[i].vy += Math.sin(swipeAngle) * (8.5 + Math.random() * 5);
        }
        const dynamicSparks = dynamicSparksRef.current;
        for (let j = 0; j < dynamicSparks.length; j++) {
          dynamicSparks[j].vx += Math.cos(swipeAngle) * (9.5 + Math.random() * 6);
          dynamicSparks[j].vy += Math.sin(swipeAngle) * (9.5 + Math.random() * 6);
        }
        if (onSwipeAny) {
          onSwipeAny();
          return;
        }
        if (onSwipeRight) {
          onSwipeRight();
          return;
        }
      }

      // Tap / Click (Only if inside shell radius)
      if (Math.abs(deltaX) < 25 && Math.abs(deltaY) < 25) {
        triggerClickSafely();
      }
    }
  }, [triggerClickSafely, onSwipeAny, onSwipeRight]);

  const handlePointerLeave = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    pointerRef.current.isDown = false;
    pointerRef.current.active = false;
    dragStartRef.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={(e) => {
        e.stopPropagation();
        triggerClickSafely();
      }}
      className="relative flex items-center justify-center p-0 select-none touch-none cursor-pointer w-[120px] h-[120px] sm:w-[130px] sm:h-[130px] rounded-full"
      title="Оболонка Глітер (клікніть для діалогу Зрізу / утримуйте для налаштувань)"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none select-none block overflow-visible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[150px] max-w-none transition-[filter] duration-300"
        style={{
          filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
        }}
      />
    </div>
  );
};
