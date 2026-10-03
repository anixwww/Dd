import React, { useRef, useEffect, useCallback } from 'react';
import { VisualEnergyMode } from './AnalyzerTip';
import { hslToRgb } from './LivingFireVisual';

export interface LivingWaveVisualProps {
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

// Gentle water ripple
interface WaterRipple {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}



// Subsurface air bubble
interface SeaBubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
}

// Hydrodynamic Surface Node for fluid tension
interface SurfaceNode {
  angle: number;
  displacement: number;
  velocity: number;
}

/**
 * Living Wave Visual (Жива Морська Хвиля v7.0 - Deep Inner Radiance & Luminous Core):
 * - Посилене внутрішнє кришталеве сяйво (Volumetric Inner Glow, Caustic Light Refraction, Radiant Heart).
 * - Багатошарова текуча океанічна форма з кришталевим серцем та світловими внутрішніми променями.
 * - Хвиляста анімована аура та гармонійне дихання.
 * - Фізика поверхневого натягу (32 вузли) та пружний відгук на дотики.
 */
export const LivingWaveVisual: React.FC<LivingWaveVisualProps> = ({
  mode,
  hasAdvice = false,
  isThinking = false,
  isDialogueActive = false,
  onClick,
  onSwipeRight,
  onLongPress,
  blurAmount = 0,
  calmHue = 190,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const swayWrapperRef = useRef<HTMLDivElement | null>(null);

  const calmHueRef = useRef(calmHue);
  calmHueRef.current = calmHue;
  const currentHueRef = useRef<number>(calmHue);

  const hasAdviceRef = useRef(hasAdvice);
  hasAdviceRef.current = hasAdvice;

  const isThinkingRef = useRef(isThinking);
  isThinkingRef.current = isThinking;

  const isDialogueActiveRef = useRef(isDialogueActive);
  isDialogueActiveRef.current = isDialogueActive;

  // Interaction tracking
  const isPointerDownRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const pointerPosRef = useRef({ x: 180, y: 75, active: false });
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapTimeRef = useRef(0);
  const chargeProgressRef = useRef(0); // 0 to 1 for long-press charge build-up



  // Neural dialogue flares tracking
  const dialogueFlaresRef = useRef<{
    timer: number;
    activeCrest: number;
    intensity: number;
  }>({
    timer: 0,
    activeCrest: 0,
    intensity: 0,
  });

  // Surface tension node mesh (32 nodes)
  const surfaceNodesRef = useRef<SurfaceNode[]>([]);
  useEffect(() => {
    const NODE_COUNT = 32;
    const nodes: SurfaceNode[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        angle: (i / NODE_COUNT) * Math.PI * 2,
        displacement: 0,
        velocity: 0,
      });
    }
    surfaceNodesRef.current = nodes;
  }, []);

  const stretchPhysicsRef = useRef({
    energyPulse: 0,
    touchAuraIntensity: 0,
  });

  // Continuous harmonic flow clocks
  const cycleEngineRef = useRef({
    phaseSwirl: 0,        // Main fluid rotation
    phaseWave1: 0,        // Primary wave swell
    phaseWave2: 0,        // Counter-flow harmonic
    phaseAura: 0,         // Outer wavy aura undulation
    phaseCaustic: 0,      // Sunbeam shimmer
    phaseInnerGlow: 0,    // Deep inner radiance pulsation
    phaseShell: 0,        // Shell perimeter photon circulation
    phaseShellShimmer: 0, // Prismatic caustic dispersion
    phaseBreathing: 0,    // Harmonic quantum breathing (~3.5-4.5s)
  });

  // Particle pools
  const ripplesRef = useRef<WaterRipple[]>([]);
  const bubblesRef = useRef<SeaBubble[]>([]);

  // Initialize bubbles
  useEffect(() => {
    const bList: SeaBubble[] = [];
    for (let b = 0; b < 22; b++) {
      bList.push({
        x: (Math.random() - 0.5) * 70,
        y: (Math.random() - 0.5) * 35,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.2 - Math.random() * 0.35,
        radius: 0.8 + Math.random() * 1.8,
        alpha: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    bubblesRef.current = bList;
  }, []);

  // Surface excitation on touch / tap
  const exciteSurface = useCallback((angle: number, force: number) => {
    const nodes = surfaceNodesRef.current;
    if (!nodes || nodes.length === 0) return;
    for (let i = 0; i < nodes.length; i++) {
      let diff = Math.abs(nodes[i].angle - angle);
      if (diff > Math.PI) diff = Math.PI * 2 - diff;
      const influence = Math.max(0, 1 - diff / (Math.PI * 0.5));
      nodes[i].velocity += influence * force;
    }
  }, []);

  // Spawn pure concentric water ripples
  const triggerRipples = useCallback((splashX = 0, splashY = 0, isGolden = false) => {
    const activeHue = isGolden ? 44 : (hasAdviceRef.current ? 352 : calmHueRef.current);
    const [r, g, b] = hslToRgb(activeHue, 95, 75);

    // 2 expanding concentric wave ripples
    for (let i = 0; i < 2; i++) {
      ripplesRef.current.push({
        id: Date.now() + Math.random() + i,
        x: splashX,
        y: splashY,
        radius: 3 + i * 9,
        maxRadius: 54 + i * 18,
        alpha: 0.85 - i * 0.2,
        color: `rgba(${r}, ${g}, ${b}`,
      });
    }

    exciteSurface(Math.atan2(splashY, splashX), 3.5);
  }, [exciteSurface]);

  // Mode reactions
  useEffect(() => {
    if (mode === 'gold-flash' || mode === 'warm') {
      stretchPhysicsRef.current.energyPulse = 1.0;
      triggerRipples(0, 0, true);
    } else if (mode === 'red-flash' || mode === 'negative') {
      stretchPhysicsRef.current.energyPulse = 0.5;
      triggerRipples(0, 0, false);
    }
  }, [mode, triggerRipples]);

  // Main 60fps/120fps Animation Loop
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

    let lastTimestamp = performance.now();

    const render = (now: number) => {
      if (!isRunning) return;
      const dt = Math.min(32, now - lastTimestamp);
      lastTimestamp = now;
      const dtFactor = dt / 16.666;

      ctx.clearRect(0, 0, width, height);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const centerX = width / 2;
      const centerY = height / 2;

      const isAdvice = hasAdviceRef.current;
      const isThinking = isThinkingRef.current;
      const isGolden = mode === 'gold-flash' || mode === 'warm';
      const isWarning = hasAdvice || mode === 'red-flash' || mode === 'negative';

      // ====================================================================
      // 4 CHROMATIC STATES (State Shifting):
      // 1. Спокій (Calm Rest): user/preset calmHue (лазур, аквамарин, ціан, сапфір)
      // 2. Нейронний діалог (Sentient Dialogue): біоелектричні імпульси-синапси
      // 3. Золотий спалах тріумфу (Gold Flash Mode): сонячно-янтарний спектр ~44° + збільшена світність
      // 4. Неоновий тривожний імпульс (Warning Red Alert): карміново-червоний ~354° + пульсуюча аура
      // ====================================================================
      const targetHue = isGolden ? 44 : isWarning ? 354 : (calmHueRef.current ?? 190);

      // Smooth shortest-arc HSL interpolation across frames
      let diffHue = targetHue - currentHueRef.current;
      if (diffHue > 180) diffHue -= 360;
      if (diffHue < -180) diffHue += 360;
      currentHueRef.current = (currentHueRef.current + diffHue * 0.08 * dtFactor + 360) % 360;
      const activeHue = currentHueRef.current;

      const cycle = cycleEngineRef.current;
      const physics = stretchPhysicsRef.current;

      // ====================================================================
      // 1. HARMONIC LUMINESCENCE (ГАРМОНІЙНЕ КВАНТОВЕ ДИХАННЯ ~3.5-4.5с)
      // ====================================================================
      cycle.phaseBreathing += 0.026 * dtFactor;
      const breathingSin = Math.sin(cycle.phaseBreathing);
      const breathingAuraMult = 1.0 + breathingSin * 0.11;
      const goldLuminanceBoost = isGolden ? 1.35 : 1.0;
      const warningAuraPulse = isWarning ? Math.sin(now * 0.007) * 10 * dpr : 0;
      const breathingLuminance = (1.0 + breathingSin * 0.16) * goldLuminanceBoost;

      // Continuous harmonic clocks — always flowing, never freezing
      const speedMult = (isThinking ? 1.7 : 1.0) * dtFactor;
      cycle.phaseSwirl += 0.022 * speedMult;
      cycle.phaseWave1 += 0.034 * speedMult;
      cycle.phaseWave2 -= 0.028 * speedMult;
      cycle.phaseAura += 0.024 * speedMult;
      cycle.phaseCaustic += 0.018 * speedMult;
      cycle.phaseInnerGlow += 0.038 * speedMult;
      cycle.phaseShell += 0.026 * speedMult;
      cycle.phaseShellShimmer += 0.032 * speedMult;

      // Sentient dialogue neural synaptic flares (біоелектричні імпульси-синапси)
      const dFlares = dialogueFlaresRef.current;
      if (isDialogueActiveRef.current) {
        dFlares.timer += dtFactor;
        if (dFlares.timer > 34) {
          dFlares.timer = 0;
          dFlares.activeCrest = Math.floor(Math.random() * 32);
          dFlares.intensity = 1.0;
        }
      } else {
        dFlares.intensity = 0;
        dFlares.timer = 0;
      }
      dFlares.intensity *= Math.pow(0.91, dtFactor);

      // Long-press progressive charge accumulator
      const charge = chargeProgressRef.current;

      // ====================================================================
      // 2. HYDRODYNAMIC SURFACE TENSION MESH
      // ====================================================================
      const nodes = surfaceNodesRef.current;
      const nodeCount = nodes.length;
      if (nodeCount > 0) {
        const springK = 0.045;
        const damping = 0.88;
        const neighborSpread = 0.28;

        for (let i = 0; i < nodeCount; i++) {
          const n = nodes[i];
          const force = -springK * n.displacement;
          n.velocity = (n.velocity + force * dtFactor) * Math.pow(damping, dtFactor);
          n.displacement += n.velocity * dtFactor;
        }

        const leftDeltas = new Float32Array(nodeCount);
        const rightDeltas = new Float32Array(nodeCount);
        for (let pass = 0; pass < 2; pass++) {
          for (let i = 0; i < nodeCount; i++) {
            const prev = nodes[(i - 1 + nodeCount) % nodeCount];
            const next = nodes[(i + 1) % nodeCount];
            leftDeltas[i] = neighborSpread * (nodes[i].displacement - prev.displacement);
            rightDeltas[i] = neighborSpread * (nodes[i].displacement - next.displacement);
          }
          for (let i = 0; i < nodeCount; i++) {
            nodes[(i - 1 + nodeCount) % nodeCount].displacement += leftDeltas[i] * dtFactor;
            nodes[(i + 1) % nodeCount].displacement += rightDeltas[i] * dtFactor;
          }
        }
      }

      // ====================================================================
      // 3. TACTILE LIGHT FEEDBACK & HAPTIC CHARGE RESONANCE
      // ====================================================================
      if (isPointerDownRef.current && pointerPosRef.current.active) {
        physics.touchAuraIntensity += (1 - physics.touchAuraIntensity) * (0.15 * dtFactor);
      } else {
        physics.touchAuraIntensity *= Math.pow(0.94, dtFactor);
      }
      physics.energyPulse *= Math.pow(0.94, dtFactor);

      // Long-press micro tremor haptic resonance
      const chargeTremorX = charge > 0.05 ? (Math.sin(now * 0.06) * charge * 2.2) : 0;
      const chargeTremorY = charge > 0.05 ? (Math.cos(now * 0.07) * charge * 2.2) : 0;

      if (swayWrapperRef.current) {
        swayWrapperRef.current.style.transform = `translate(${chargeTremorX.toFixed(1)}px, ${chargeTremorY.toFixed(1)}px)`;
      }

      // Color Palette Calculation with Breathing Luminance & State Shifting
      const [cr, cg, cb] = hslToRgb(activeHue, 95, Math.min(95, Math.round(62 * breathingLuminance)));
      const [dr, dg, db] = hslToRgb((activeHue + 32) % 360, 95, Math.min(98, Math.round(78 * breathingLuminance)));
      const [er, eg, eb] = hslToRgb((activeHue - 28 + 360) % 360, 90, Math.min(85, Math.round(52 * (isGolden ? 1.2 : 1.0))));
      const [lr, lg, lb] = hslToRgb(activeHue, 100, Math.min(100, Math.round(88 * breathingLuminance)));

      const swellScale = 1 + Math.sin(cycle.phaseWave1 * 0.6) * 0.08;
      const baseScale = dpr * 0.95 * swellScale * (1 + physics.energyPulse * 0.25 + charge * 0.35);

      if (blurAmount > 0) {
        ctx.filter = `blur(${blurAmount}px)`;
      } else {
        ctx.filter = 'none';
      }

      ctx.save();
      ctx.translate(centerX, centerY);

      // ====================================================================
      // 3.5. HELPER: 4-POINT SPECULAR DIAMOND STAR GLINT
      // ====================================================================
      const drawDiamondStarGlint = (
        gx: number,
        gy: number,
        gSize: number,
        color: string,
        alpha: number,
        angle = 0
      ) => {
        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(angle);

        // Soft outer corona
        ctx.beginPath();
        ctx.arc(0, 0, gSize * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10 * baseScale;
        ctx.fill();

        // 4-Point Diamond Star
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 6 * baseScale;

        // Vertical spike
        ctx.beginPath();
        ctx.moveTo(0, -gSize * 2.2);
        ctx.quadraticCurveTo(0, 0, gSize * 0.32, 0);
        ctx.lineTo(0, gSize * 2.2);
        ctx.quadraticCurveTo(0, 0, -gSize * 0.32, 0);
        ctx.closePath();
        ctx.fill();

        // Horizontal spike
        ctx.beginPath();
        ctx.moveTo(-gSize * 2.2, 0);
        ctx.quadraticCurveTo(0, 0, 0, gSize * 0.32);
        ctx.lineTo(gSize * 2.2, 0);
        ctx.quadraticCurveTo(0, 0, 0, -gSize * 0.32);
        ctx.closePath();
        ctx.fill();

        // Specular white center
        ctx.beginPath();
        ctx.arc(0, 0, gSize * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
      };

      // ====================================================================
      // 4. MULTI-LAYERED WAVY ANIMATED LUMINOUS AURA (ХВИЛЯСТА АНІМОВАНА АУРА)
      // ====================================================================

      const drawWavyAuraLayer = (
        baseRadius: number,
        waveAmp: number,
        waveFreq: number,
        phase: number,
        fillColor: string,
        strokeColor: string,
        strokeWidth: number
      ) => {
        ctx.save();
        ctx.beginPath();
        const auraSegments = 36;
        for (let s = 0; s <= auraSegments; s++) {
          const theta = (s / auraSegments) * Math.PI * 2;
          const w1 = Math.sin(theta * waveFreq + phase) * waveAmp;
          const w2 = Math.cos(theta * (waveFreq + 1) - phase * 1.2) * (waveAmp * 0.45);
          const r = (baseRadius + w1 + w2) * baseScale;
          const px = Math.cos(theta) * r;
          const py = Math.sin(theta) * (r * 0.82);

          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();

        if (strokeWidth > 0) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = strokeWidth * baseScale;
          ctx.stroke();
        }
        ctx.restore();
      };

      // 4.1. Outermost Diffuse Ocean Aura with Quantum Breathing, Long-Press Charge & Warning Alert Pulse
      const outerAuraR = (66 + physics.touchAuraIntensity * 16 + charge * 42 + warningAuraPulse) * baseScale * breathingAuraMult;
      const outerAuraGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, outerAuraR);
      outerAuraGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${0.36 + physics.touchAuraIntensity * 0.25 + charge * 0.35 + (isWarning ? 0.15 : 0)})`);
      outerAuraGrad.addColorStop(0.5, `rgba(${dr}, ${dg}, ${db}, ${0.18 + charge * 0.2 + (isWarning ? 0.12 : 0)})`);
      outerAuraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = outerAuraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, outerAuraR, 0, Math.PI * 2);
      ctx.fill();

      // 4.2. Wavy Breathing Aura Layer 1 (Outer soft ripples)
      drawWavyAuraLayer(
        50 * breathingAuraMult,
        4.8,
        4,
        cycle.phaseAura,
        `rgba(${dr}, ${dg}, ${db}, 0.18)`,
        `rgba(${dr}, ${dg}, ${db}, 0.42)`,
        1.2
      );

      // 4.3. Wavy Breathing Aura Layer 2 (Mid glowing water ring)
      drawWavyAuraLayer(
        39 * breathingAuraMult,
        3.8,
        5,
        -cycle.phaseAura * 1.3,
        `rgba(${cr}, ${cg}, ${cb}, 0.26)`,
        `rgba(255, 255, 255, 0.55)`,
        1.3
      );

      // 4.4. Rotating Caustic Sunbeam Rays
      ctx.save();
      ctx.rotate(cycle.phaseCaustic);
      const causticRays = 8;
      for (let c = 0; c < causticRays; c++) {
        const angle = (c / causticRays) * Math.PI * 2 + Math.sin(cycle.phaseCaustic + c) * 0.12;
        const len = (36 + Math.sin(cycle.phaseCaustic * 1.5 + c) * 12) * baseScale;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * (len * 0.82));
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 + Math.sin(cycle.phaseCaustic * 2 + c) * 0.12})`;
        ctx.lineWidth = 1.3 * baseScale;
        ctx.stroke();
      }
      ctx.restore();

      // ====================================================================
      // 5. WATER RIPPLE RINGS
      // ====================================================================
      const ripples = ripplesRef.current;
      for (let rIdx = ripples.length - 1; rIdx >= 0; rIdx--) {
        const rip = ripples[rIdx];
        rip.radius += 1.5 * dtFactor;
        const prog = rip.radius / rip.maxRadius;
        rip.alpha = Math.max(0, 0.85 * (1 - prog));

        if (prog >= 1 || rip.alpha <= 0.01) {
          ripples.splice(rIdx, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius * baseScale, 0, Math.PI * 2);
        ctx.strokeStyle = `${rip.color}, ${rip.alpha})`;
        ctx.lineWidth = 1.8 * (1 - prog * 0.5);
        ctx.stroke();
        ctx.restore();
      }

      // ====================================================================
      // 6. CLOSED CUBIC SPLINE MONOLITHIC FLUID MESH
      // ====================================================================

      const drawSplineFluid = (
        layerPhase: number,
        baseR: number,
        waveAmp: number,
        fillColor: CanvasGradient | string,
        strokeColor: string,
        strokeW: number
      ) => {
        ctx.save();

        const points: { x: number; y: number }[] = [];
        const count = nodes.length;

        for (let i = 0; i < count; i++) {
          const theta = nodes[i].angle;
          const w1 = Math.sin(theta * 3 + layerPhase) * waveAmp;
          const w2 = Math.cos(theta * 4 - layerPhase * 1.2) * (waveAmp * 0.4);
          const hydroDisp = nodes[i].displacement * 0.8;

          const r = (baseR + w1 + w2 + hydroDisp) * baseScale;
          const px = Math.cos(theta) * r;
          const py = Math.sin(theta) * (r * 0.82);
          points.push({ x: px, y: py });
        }

        ctx.beginPath();
        const firstMidX = (points[0].x + points[count - 1].x) / 2;
        const firstMidY = (points[0].y + points[count - 1].y) / 2;
        ctx.moveTo(firstMidX, firstMidY);

        for (let i = 0; i < count; i++) {
          const next = points[(i + 1) % count];
          const midX = (points[i].x + next.x) / 2;
          const midY = (points[i].y + next.y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
        }

        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();

        if (strokeW > 0) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = strokeW * baseScale;
          ctx.stroke();
        }

        ctx.restore();
      };

      // ====================================================================
      // 6.0. MASTER BIOLUMINESCENT FLUID SHELL (ГОЛОВНА ОБОЛОНКА ХВИЛІ)
      // ====================================================================
      const drawBioluminescentShell = () => {
        ctx.save();
        const count = nodes.length;
        const shellPoints: { x: number; y: number; r: number; theta: number }[] = [];
        const baseShellR = 43 * breathingAuraMult;
        const waveAmp = 4.8;

        for (let i = 0; i < count; i++) {
          const theta = nodes[i].angle;
          const w1 = Math.sin(theta * 3 + cycle.phaseWave1 * 0.9) * waveAmp;
          const w2 = Math.cos(theta * 4 - cycle.phaseWave2 * 0.8) * (waveAmp * 0.45);
          const w3 = Math.sin(theta * 2 + cycle.phaseShellShimmer) * (waveAmp * 0.25);
          const hydroDisp = nodes[i].displacement * 1.1;

          const r = (baseShellR + w1 + w2 + w3 + hydroDisp) * baseScale;
          const px = Math.cos(theta) * r;
          const py = Math.sin(theta) * (r * 0.82);
          shellPoints.push({ x: px, y: py, r, theta });
        }

        // 1. Path of the Shell
        ctx.beginPath();
        const firstMidX = (shellPoints[0].x + shellPoints[count - 1].x) / 2;
        const firstMidY = (shellPoints[0].y + shellPoints[count - 1].y) / 2;
        ctx.moveTo(firstMidX, firstMidY);

        for (let i = 0; i < count; i++) {
          const next = shellPoints[(i + 1) % count];
          const midX = (shellPoints[i].x + next.x) / 2;
          const midY = (shellPoints[i].y + next.y) / 2;
          ctx.quadraticCurveTo(shellPoints[i].x, shellPoints[i].y, midX, midY);
        }
        ctx.closePath();

        // 2. Translucent Nacre & Caustic Membrane Fill
        const shellGrad = ctx.createRadialGradient(
          0,
          0,
          10 * baseScale,
          0,
          0,
          (baseShellR + 6) * baseScale
        );
        shellGrad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.12)`);
        shellGrad.addColorStop(0.55, `rgba(${dr}, ${dg}, ${db}, 0.22)`);
        shellGrad.addColorStop(0.85, `rgba(${lr}, ${lg}, ${lb}, 0.38)`);
        shellGrad.addColorStop(1, `rgba(255, 255, 255, 0.65)`);
        ctx.fillStyle = shellGrad;
        ctx.fill();

        // 3. Double-Pass Specular Meniscus Rim
        // Pass A: Volumetric outer luminous halo
        ctx.strokeStyle = `rgba(${dr}, ${dg}, ${db}, ${0.65 + physics.touchAuraIntensity * 0.25 + charge * 0.35})`;
        ctx.lineWidth = (2.6 + physics.touchAuraIntensity * 1.6 + charge * 1.8) * baseScale;
        ctx.shadowColor = `rgba(${lr}, ${lg}, ${lb}, 0.85)`;
        ctx.shadowBlur = 14 * baseScale;
        ctx.stroke();

        // Pass B: Crisp razor crystalline edge
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.88 + physics.touchAuraIntensity * 0.12})`;
        ctx.lineWidth = 1.25 * baseScale;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 4 * baseScale;
        ctx.stroke();

        ctx.restore();

        // 4. Sentient Dialogue Neural Flares (Електричні імпульси-синапси між гребенями)
        if (dFlares.intensity > 0.04 && shellPoints.length > 0) {
          ctx.save();
          const crest1 = shellPoints[dFlares.activeCrest % count];
          const crest2 = shellPoints[(dFlares.activeCrest + 10) % count];
          const crest3 = shellPoints[(dFlares.activeCrest + 21) % count];

          // Primary synaptic arc
          ctx.beginPath();
          ctx.moveTo(crest1.x, crest1.y);
          ctx.quadraticCurveTo(0, 0, crest2.x, crest2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${dFlares.intensity * 0.95})`;
          ctx.lineWidth = 1.8 * baseScale;
          ctx.shadowColor = `rgba(${lr}, ${lg}, ${lb}, 1)`;
          ctx.shadowBlur = 14 * baseScale;
          ctx.stroke();

          // Secondary branch arc
          ctx.beginPath();
          ctx.moveTo(crest2.x, crest2.y);
          ctx.quadraticCurveTo(crest1.x * 0.3, crest1.y * 0.3, crest3.x, crest3.y);
          ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${dFlares.intensity * 0.65})`;
          ctx.lineWidth = 1.2 * baseScale;
          ctx.stroke();

          // Micro-lens star sparkles at synaptic terminals
          drawDiamondStarGlint(crest1.x, crest1.y, 3.4 * baseScale, `rgba(${dr}, ${dg}, ${db}, 1)`, dFlares.intensity);
          drawDiamondStarGlint(crest2.x, crest2.y, 3.4 * baseScale, `rgba(${dr}, ${dg}, ${db}, 1)`, dFlares.intensity);
          drawDiamondStarGlint(crest3.x, crest3.y, 2.6 * baseScale, `rgba(${dr}, ${dg}, ${db}, 1)`, dFlares.intensity * 0.7);
          ctx.restore();
        }

        // 5. Prismatic 4-Point Diamond Star Glints at Wave Crests (Спекулярні спалахи)
        for (let i = 0; i < count; i += 4) {
          const pt = shellPoints[i];
          const crestFactor = Math.sin(pt.theta * 3 + cycle.phaseWave1 * 0.9);
          if (crestFactor > 0.20) {
            const glintSize = (2.2 + crestFactor * 2.2 + Math.sin(cycle.phaseShellShimmer * 2 + i) * 1.0) * baseScale;
            const alpha = Math.min(1.0, 0.45 + crestFactor * 0.55);
            drawDiamondStarGlint(
              pt.x,
              pt.y,
              glintSize,
              `rgba(${lr}, ${lg}, ${lb}, 0.9)`,
              alpha,
              pt.theta + cycle.phaseShellShimmer * 0.5
            );
          }
        }

        // 6. Circulating Bioluminescent Surface Photons (Кванти світла по контуру)
        ctx.save();
        const photonCount = 7;
        for (let p = 0; p < photonCount; p++) {
          const normIdx = ((cycle.phaseShell * 0.65 + p / photonCount) % 1.0) * count;
          const idxFloor = Math.floor(normIdx);
          const idxCeil = (idxFloor + 1) % count;
          const frac = normIdx - idxFloor;

          const p1 = shellPoints[idxFloor];
          const p2 = shellPoints[idxCeil];

          const curX = p1.x + (p2.x - p1.x) * frac;
          const curY = p1.y + (p2.y - p1.y) * frac;

          // Head photon with star ray flare
          const pRadius = (1.8 + Math.sin(cycle.phaseShell * 3 + p) * 0.6) * baseScale;
          drawDiamondStarGlint(curX, curY, pRadius * 1.1, `rgba(${lr}, ${lg}, ${lb}, 0.95)`, 0.92, p);

          // Delicate trailing tail along the shell
          const prevIdx = (idxFloor - 1 + count) % count;
          const prevP = shellPoints[prevIdx];
          ctx.beginPath();
          ctx.moveTo(curX, curY);
          ctx.lineTo(prevP.x, prevP.y);
          ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, 0.45)`;
          ctx.lineWidth = 1.0 * baseScale;
          ctx.stroke();
        }
        ctx.restore();
      };

      // Draw the Master Bioluminescent Shell first
      drawBioluminescentShell();

      // LAYER 1: Deep Ocean Trench & Core
      const g1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 38 * baseScale);
      g1.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.96)`);
      g1.addColorStop(0.65, `rgba(${er}, ${eg}, ${eb}, 0.88)`);
      g1.addColorStop(1, `rgba(${er - 20}, ${eg - 15}, ${eb + 20}, 0.65)`);
      drawSplineFluid(cycle.phaseWave1, 34, 5.4, g1, `rgba(${dr}, ${dg}, ${db}, 0.55)`, 1.3);

      // LAYER 2: Radiant Tropical Azure Swell
      const g2 = ctx.createLinearGradient(-26, -20, 26, 20);
      g2.addColorStop(0, `rgba(${dr}, ${dg}, ${db}, 0.92)`);
      g2.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, 0.82)`);
      g2.addColorStop(1, 'rgba(255, 255, 255, 0.75)');
      drawSplineFluid(cycle.phaseWave2, 26, 4.2, g2, 'rgba(255, 255, 255, 0.75)', 1.2);

      // LAYER 2.5: INTENSE VOLUMETRIC INNER RADIANCE FIELD (ВНУТРІШНЄ СЯЙВО)
      const innerGlowPulse = 1 + Math.sin(cycle.phaseInnerGlow) * 0.18;
      const innerGlowR = 24 * baseScale * innerGlowPulse;
      const innerGlowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, innerGlowR);
      innerGlowGrad.addColorStop(0, `rgba(255, 255, 255, 0.95)`);
      innerGlowGrad.addColorStop(0.35, `rgba(${lr}, ${lg}, ${lb}, 0.85)`);
      innerGlowGrad.addColorStop(0.70, `rgba(${dr}, ${dg}, ${db}, 0.50)`);
      innerGlowGrad.addColorStop(1, 'transparent');

      ctx.save();
      ctx.fillStyle = innerGlowGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, innerGlowR * 1.1, innerGlowR * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rotating inner caustic refraction flares inside the core
      ctx.rotate(-cycle.phaseSwirl * 1.4);
      const innerFlares = 6;
      for (let f = 0; f < innerFlares; f++) {
        const fAngle = (f / innerFlares) * Math.PI * 2;
        const fLen = (14 + Math.sin(cycle.phaseInnerGlow + f * 1.5) * 6) * baseScale;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(fAngle) * fLen, Math.sin(fAngle) * (fLen * 0.75));
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 + Math.sin(cycle.phaseInnerGlow * 1.8 + f) * 0.25})`;
        ctx.lineWidth = 1.5 * baseScale;
        ctx.stroke();
      }
      ctx.restore();

      // LAYER 3: Crystalline Crest & Outer Sheen
      const g3 = ctx.createLinearGradient(-15, -11, 15, 11);
      g3.addColorStop(0, '#ffffff');
      g3.addColorStop(0.55, `rgba(${dr}, ${dg}, ${db}, 0.90)`);
      g3.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0.55)`);
      drawSplineFluid(cycle.phaseWave1 * 1.5, 17, 3.2, g3, '#ffffff', 1.5);

      // ====================================================================
      // 7. ULTRA-LUMINOUS AQUAMARINE SEA HEART & CRYSTAL STAR CORE
      // ====================================================================
      const heartR = 8.0 * baseScale * (1 + physics.energyPulse * 0.35);
      
      // Radiant outer halo
      const heartHaloGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, heartR * 2.2);
      heartHaloGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      heartHaloGrad.addColorStop(0.35, `rgba(${dr}, ${dg}, ${db}, 0.85)`);
      heartHaloGrad.addColorStop(0.7, `rgba(${cr}, ${cg}, ${cb}, 0.4)`);
      heartHaloGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = heartHaloGrad;
      ctx.beginPath();
      ctx.arc(0, 0, heartR * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Core heart
      const heartGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, heartR);
      heartGrad.addColorStop(0, '#ffffff');
      heartGrad.addColorStop(0.40, `rgba(${lr}, ${lg}, ${lb}, 0.98)`);
      heartGrad.addColorStop(0.80, `rgba(${dr}, ${dg}, ${db}, 0.90)`);
      heartGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = heartGrad;
      ctx.shadowColor = `rgba(${lr}, ${lg}, ${lb}, 1)`;
      ctx.shadowBlur = 22 + (isThinking ? 10 : 0);
      ctx.beginPath();
      ctx.arc(0, 0, heartR, 0, Math.PI * 2);
      ctx.fill();

      // Specular diamond star highlight with 4 radiant flare spikes
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 10;
      
      // Vertical / horizontal primary star
      ctx.beginPath();
      ctx.moveTo(0, -heartR * 0.9);
      ctx.lineTo(heartR * 0.45, 0);
      ctx.lineTo(0, heartR * 0.9);
      ctx.lineTo(-heartR * 0.45, 0);
      ctx.closePath();
      ctx.fill();

      // Diagonal secondary sparkles
      ctx.beginPath();
      ctx.moveTo(0, -heartR * 0.5);
      ctx.lineTo(heartR * 0.25, 0);
      ctx.lineTo(0, heartR * 0.5);
      ctx.lineTo(-heartR * 0.25, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // ====================================================================
      // 8. SUBSURFACE AIR BUBBLES
      // ====================================================================
      const bubbles = bubblesRef.current;
      for (const bub of bubbles) {
        bub.phase += 0.03 * dtFactor;
        bub.y += bub.vy * dtFactor;
        bub.x += bub.vx * dtFactor + Math.sin(bub.phase) * 0.3;

        if (bub.y < -32) {
          bub.y = 28 + Math.random() * 8;
          bub.x = (Math.random() - 0.5) * 55;
        }

        const bAlpha = bub.alpha * (0.6 + Math.sin(bub.phase) * 0.4);
        ctx.beginPath();
        ctx.arc(bub.x * baseScale, bub.y * baseScale, bub.radius * baseScale, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${bAlpha})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc((bub.x - bub.radius * 0.3) * baseScale, (bub.y - bub.radius * 0.3) * baseScale, bub.radius * 0.35 * baseScale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${bAlpha * 0.9})`;
        ctx.fill();
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
      lastTimestamp = performance.now();
      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(render);
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
  }, [blurAmount]);

  // Pointer & Gesture Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    chargeProgressRef.current = 0;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    pointerPosRef.current = { x, y, active: true };

    const dx = x - centerX;
    const dy = y - centerY;
    const hitAngle = Math.atan2(dy, dx);

    exciteSurface(hitAngle, 4.0);

    const now = Date.now();
    if (now - lastTapTimeRef.current < 280) {
      triggerRipples(dx * 0.4, dy * 0.4, true);
    }
    lastTapTimeRef.current = now;

    if (onLongPress) {
      longPressTimeoutRef.current = setTimeout(() => {
        triggerRipples(0, 0, true);
        stretchPhysicsRef.current.energyPulse = 1.0;
        chargeProgressRef.current = 0;
        onLongPress();
      }, 3000);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    pointerPosRef.current = { x, y, active: true };

    if (!isPointerDownRef.current) return;

    if (dragStartRef.current) {
      const movedX = Math.abs(e.clientX - dragStartRef.current.x);
      const movedY = Math.abs(e.clientY - dragStartRef.current.y);
      if (movedX > 10 || movedY > 10) {
        chargeProgressRef.current = 0;
        if (longPressTimeoutRef.current) {
          clearTimeout(longPressTimeoutRef.current);
          longPressTimeoutRef.current = null;
        }
      }
    }
  };

  const handlePointerLeave = () => {
    pointerPosRef.current.active = false;
    chargeProgressRef.current = 0;
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    chargeProgressRef.current = 0;
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    if (dragStartRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = Math.abs(e.clientY - dragStartRef.current.y);
      const dt = Date.now() - dragStartRef.current.time;

      const dist = Math.hypot(dx, dy);
      if (dist > 24 && dt < 600 && onSwipeRight) {
        triggerRipples(25, 0, mode === 'gold-flash' || mode === 'warm');
        onSwipeRight();
      } else if (Math.abs(dx) < 8 && dy < 8 && dt < 450) {
        const rect = containerRef.current?.getBoundingClientRect();
        const tapX = rect ? (e.clientX - rect.left - rect.width / 2) * 0.5 : 0;
        const tapY = rect ? (e.clientY - rect.top - rect.height / 2) * 0.5 : 0;
        triggerRipples(tapX, tapY, mode === 'gold-flash' || mode === 'warm');
        onClick();
      }
    }

    isPointerDownRef.current = false;
    dragStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="w-full h-full relative cursor-pointer select-none touch-none flex items-center justify-center overflow-visible"
      title="Жива Морська Хвиля (утримуй для налаштувань)"
    >
      <div
        ref={swayWrapperRef}
        className="w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-75 ease-out"
        style={{ transformOrigin: '50% 50%' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block overflow-visible"
        />
      </div>
    </div>
  );
};
