import React, { useEffect, useRef, useCallback } from 'react';
import { VisualEnergyMode } from './AnalyzerTip';
import { RealConstellation, getRandomRealConstellation } from './RealConstellations';

export const CAT_CONSTELLATION: RealConstellation = {
  id: 'standing_cat_silhouette',
  nameUk: 'Силует Чорного Кота',
  latinName: 'Felis Caelestis',
  introText: 'Силует Чорного Кота із закрученим хвостом та очима',
  locationText: 'Центр Космічного Кільця',
  factsText: 'Зоряний контурний силует Чорного Кота з очима, крихітною зіркою-носиком та закрученим хвостом без вусів',
  stars: [
    { x: -10, y: -48, brightness: 2.8, color: '#ffffff' }, // 0: Left Ear Tip
    { x: 0, y: -41, brightness: 2.4, color: '#67e8f9' },   // 1: Head Crown
    { x: 10, y: -48, brightness: 2.8, color: '#ffffff' },  // 2: Right Ear Tip
    { x: -12, y: -38, brightness: 2.2, color: '#38bdf8' }, // 3: Left Ear Base
    { x: 12, y: -38, brightness: 2.2, color: '#38bdf8' },  // 4: Right Ear Base
    { x: -14, y: -31, brightness: 2.6, color: '#67e8f9' }, // 5: Left Cheek
    { x: 14, y: -31, brightness: 2.6, color: '#67e8f9' },  // 6: Right Cheek
    { x: 0, y: -25, brightness: 2.5, color: '#ffffff' },   // 7: Chin
    { x: -6, y: -35, brightness: 2.6, color: '#38bdf8' },  // 8: Left Eye
    { x: 6, y: -35, brightness: 2.6, color: '#38bdf8' },   // 9: Right Eye
    { x: 0, y: -30, brightness: 1.5, color: '#fef08a' },   // 10: Nose (Одна крихітна зірка)
    { x: -14, y: -16, brightness: 2.2, color: '#ffffff' }, // 11: Chest
    { x: 13, y: -20, brightness: 2.2, color: '#ffffff' },  // 12: Upper Back
    { x: -16, y: 8, brightness: 2.1, color: '#38bdf8' },   // 13: Front Leg Outer
    { x: 15, y: 0, brightness: 2.1, color: '#67e8f9' },    // 14: Spine
    { x: 16, y: 18, brightness: 2.3, color: '#f472b6' },   // 15: Hips / Lower Back
    { x: -16, y: 38, brightness: 2.5, color: '#ffffff' },  // 16: Front Paw L
    { x: -6, y: 38, brightness: 2.5, color: '#ffffff' },   // 17: Front Paw R
    { x: 0, y: 20, brightness: 2.0, color: '#38bdf8' },    // 18: Inner Leg Gap
    { x: 8, y: 38, brightness: 2.5, color: '#ffffff' },    // 19: Back Paw L
    { x: 18, y: 38, brightness: 2.5, color: '#ffffff' },   // 20: Back Paw R
    { x: 18, y: 16, brightness: 2.4, color: '#f472b6' },   // 21: Tail Base
    { x: 30, y: 4, brightness: 2.4, color: '#fb7185' },    // 22: Tail Mid Curve
    { x: 36, y: -12, brightness: 2.6, color: '#fef08a' },  // 23: Tail Upper Curve
    { x: 32, y: -28, brightness: 2.7, color: '#f472b6' },  // 24: Tail Curl Out
    { x: 22, y: -34, brightness: 2.8, color: '#ffffff' },  // 25: Tail Curl In (кручений кінчик)
    { x: 26, y: -28, brightness: 2.5, color: '#38bdf8' }   // 26: Tail Curl Center Loop
  ],
  lines: [
    // Outer Ear & Head Contour
    [0, 1], [1, 2], [2, 4], [4, 6], [6, 7], [7, 5], [5, 3], [3, 0],
    // Body Outer Contour (Повний ріст по зовнішньому контуру)
    [5, 11], [11, 13], [13, 16], [16, 17], [17, 18], [18, 19], [19, 20], [20, 15], [15, 14], [14, 12], [12, 7],
    // Curled Tail (Закручений хвіст)
    [21, 22], [22, 23], [23, 24], [24, 25], [25, 26]
  ]
};

export interface LivingCosmicRingVisualProps {
  mode: VisualEnergyMode;
  hasUnreadAdvice?: boolean;
  hasAdvice?: boolean;
  isThinking?: boolean;
  isDialogueActive?: boolean;
  isFirstDialogue?: boolean;
  isAllGood?: boolean;
  isCatMode?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onSwipeAny?: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  blurAmount?: number;
  calmHue?: number;
  calmLightness?: number;
  onConstellationActiveChange?: (constellation: RealConstellation | null) => void;
}

/**
 * High-Fidelity 3D Ring Star
 */
interface RingStar3D {
  id: number;
  theta: number;          // Orbital angle around the ring torus
  phi: number;            // Tube cross-section angle
  orbitSpeed: number;     // Angular velocity along ring
  phiSpeed: number;       // Tube twisting speed
  ringRadius: number;     // Major radius
  tubeRadius: number;     // Minor tube offset
  x: number;              // Current 3D position
  y: number;
  z: number;
  ox: number;             // Target parametric equilibrium position
  oy: number;
  oz: number;
  vx: number;             // Physics velocity
  vy: number;
  vz: number;
  mass: number;
  springK: number;
  damping: number;
  radius: number;         // Star visual scale
  baseRadius: number;
  spectralColor: string;
  glowColor: string;
  layer: number;          // 0 = micro star, 1 = star, 2 = major diamond star
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  flareIntensity: number; // Local dialogue flare effect
  isConstellationMember?: boolean;
  constellationVertexIndex?: number;
  constellationTargetThetaOffset?: number;
  constellationTargetR?: number;
  constellationTargetTubeR?: number;
  centerTargetX?: number;
  centerTargetY?: number;
  centerTargetZ?: number;
  projScreenX?: number;
  projScreenY?: number;
  projDepthScale?: number;
  symmetricTargetTheta?: number;
  symmetricTargetR?: number;
  rotation: number;
  rotSpeed: number;
}

/**
 * Smaller stars crawling out of the cosmic ring along a galactic spiral arm
 */
interface SpiralArmStar {
  id: number;
  distAlongArm: number;   // radial crawl offset beyond ring (0 to ~65px)
  crawlSpeed: number;     // slow outward crawl speed (~1.2 - 2.0 px/s)
  angleOffset: number;    // angle dispersion along arm
  tubeOffset: number;     // perpendicular thickness
  radius: number;
  baseRadius: number;
  spectralColor: string;
  glowColor: string;
  alpha: number;
  rotation: number;
  rotSpeed: number;
  twinklePhase: number;
  pulseSpeed: number;
  layer: number;          // 0 = micro star, 1 = crystalline 4-pointed star, 2 = major diamond star (identical to ring stars)
  projScreenX: number;
  projScreenY: number;
  projZ: number;
}

/**
 * Sparkler spark particle for outward sparkler explosion (бенгальський вогник)
 */
interface SparklerParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  glowColor: string;
  life: number;
  maxLife: number;
  twinkleSpeed: number;
}

/**
 * Multi-Armed Galactic Spiral Formation:
 * Smaller stars slowly crawl out from the ring, winding into long spiral arms,
 * and eventually detach into the Theme.
 */
interface SpiralArm {
  id: number;
  rootTheta: number;        // Attachment point angle on the ring
  windingDirection: number; // 1 or -1
  tightness: number;        // Logarithmic spiral angle coefficient
  maxArmLength: number;     // distance where stars detach (~60-70px from ring surface)
  stars: SpiralArmStar[];
  maxStars: number;
  age: number;
  spawnTimer: number;
  exhausted: boolean;
}

/**
 * Localized Neural Flash during active dialogue
 */
interface LocalDialogueFlare {
  id: number;
  angle: number;
  intensity: number;
  duration: number;
  elapsed: number;
  spread: number;
  color: string;
}

// 7 Authentic spectral palettes from the Standard Cosmos (Stardust) theme
const SPECTRAL_PALETTES = [
  { star: '#ffffff', glow: '#60a5fa' }, // Diamond with sapphire halo
  { star: '#f0f9ff', glow: '#38bdf8' }, // Cyan beacon
  { star: '#fef08a', glow: '#f59e0b' }, // Solar gold dwarf
  { star: '#fbcfe8', glow: '#ec4899' }, // Rosy quartz star
  { star: '#e0e7ff', glow: '#818cf8' }, // Indigo starlight
  { star: '#cffafe', glow: '#06b6d4' }, // Aquamarine
  { star: '#ffffff', glow: '#ffffff' }, // Pure radiant white
];


/**
 * Authentic 4-Pointed Star / Diamond Geometry Renderer
 * Renders crystalline celestial stars, NOT circular bubbles!
 */
function drawCosmicStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  fillColor: string,
  glowColor: string,
  alpha: number,
  rotation: number,
  layer: number, // 0 = micro star, 1 = star, 2 = major diamond star
  twinkle: number
) {
  if (alpha <= 0.02 || radius <= 0.3) return;

  ctx.save();
  ctx.globalAlpha = Math.min(1.0, alpha);

  // 1. Delicate photic aura (strictly atmospheric glow, smooth quadratic falloff)
  const auraR = radius * (layer === 2 ? 2.4 : layer === 1 ? 1.7 : 1.3);
  const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, auraR);
  aura.addColorStop(0, glowColor);
  aura.addColorStop(0.25, glowColor);
  aura.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = aura;
  ctx.globalAlpha = alpha * 0.32;
  ctx.beginPath();
  ctx.arc(cx, cy, auraR, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = Math.min(1.0, alpha);

  // 2. Micro stars (layer 0) and small stars: natural tiny circular stars with radiant pinpoint core
  if (layer === 0 || radius < 1.4) {
    const starR = Math.max(0.65, radius * 0.9);
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.arc(cx, cy, starR, 0, Math.PI * 2);
    ctx.fill();

    // Pure white pinpoint core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, starR * 0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    return;
  }

  // 3. Medium & Major stars: authentic crystalline 4-pointed stellar diamond (✦)
  const outerR = radius;
  // Inner ratio defines sharp, slender stellar points
  const innerR = radius * (layer === 2 ? 0.22 : 0.26);

  const cosR = Math.cos(rotation);
  const sinR = Math.sin(rotation);

  // Outer Star Polygon (8 vertices)
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const r = i % 2 === 0 ? outerR : innerR;
    const px = r * Math.cos(angle);
    const py = r * Math.sin(angle);
    const rx = px * cosR - py * sinR;
    const ry = px * sinR + py * cosR;

    if (i === 0) ctx.moveTo(cx + rx, cy + ry);
    else ctx.lineTo(cx + rx, cy + ry);
  }
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.fill();

  // Pure White Core Diamond (intense stellar core)
  const coreOuterR = outerR * (layer === 2 ? 0.55 : 0.5);
  const coreInnerR = innerR * 0.45;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const r = i % 2 === 0 ? coreOuterR : coreInnerR;
    const px = r * Math.cos(angle);
    const py = r * Math.sin(angle);
    const rx = px * cosR - py * sinR;
    const ry = px * sinR + py * cosR;

    if (i === 0) ctx.moveTo(cx + rx, cy + ry);
    else ctx.lineTo(cx + rx, cy + ry);
  }
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Subtle needle spikes ONLY for major beacon stars at peak twinkle
  if (layer === 2 && twinkle > 0.82) {
    const spikeLen = outerR * 1.4;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = (twinkle - 0.82) * 5.0 * alpha * 0.65;
    ctx.beginPath();
    ctx.moveTo(cx - spikeLen * cosR, cy - spikeLen * sinR);
    ctx.lineTo(cx + spikeLen * cosR, cy + spikeLen * sinR);
    ctx.moveTo(cx + spikeLen * sinR, cy - spikeLen * cosR);
    ctx.lineTo(cx - spikeLen * sinR, cy + spikeLen * cosR);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Nebula Gas Mote inside the cosmic ring
 */
interface NebulaGasMote {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  color: string;
}

/**
 * Completely contour-free, soft, non-bright volumetric celestial nebula veil:
 * - No sharp stroke lines, no hard borders, no bright neon glare.
 * - Created through overlapping smooth radial-basis gas puffs that fade to 0.0 at their edges.
 * - Volumetrically enshrouds the ring torus, leaving the center void dark and pristine.
 * - Gently undulates with breathing and orbital drift.
 */
function drawRingNebulaShroud(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  factor: number,
  simTime: number,
  tiltX: number,
  breathePhase: number,
  ringRadius: number,
  motes: NebulaGasMote[],
  dt: number,
  colorR: number = 130,
  colorG: number = 165,
  colorB: number = 240
) {
  if (factor <= 0.01) return;

  ctx.save();
  ctx.translate(cx, cy);

  // Foreshorten with ring's 3D inclination
  const cosTiltX = Math.cos(tiltX);
  ctx.scale(1.0, cosTiltX);

  const baseR = ringRadius;

  // Gentle, calm base palette harmonized with the current starlight
  // Soft, muted, never bright or neon (low saturation, soft luminous values)
  const rCore = Math.min(200, Math.max(90, Math.round(colorR * 0.72 + 25)));
  const gCore = Math.min(210, Math.max(110, Math.round(colorG * 0.72 + 35)));
  const bCore = Math.min(235, Math.max(140, Math.round(colorB * 0.82 + 40)));

  // Secondary ethereal tone (soft twilight indigo-violet)
  const rSec = Math.min(180, Math.max(80, Math.round(bCore * 0.62 + 20)));
  const gSec = Math.min(190, Math.max(90, Math.round(gCore * 0.62 + 25)));
  const bSec = Math.min(230, Math.max(130, Math.round(rCore * 0.48 + 105)));

  // Soft overall multiplier: keeps it ethereal, faint, and restful (not bright!)
  const masterAlpha = factor * 0.11;

  ctx.save();
  // Apply deep diffuse canvas blur if supported by the browser canvas context
  try {
    if ('filter' in ctx) {
      ctx.filter = 'blur(12px)';
    }
  } catch {}

  // 1. LAYER 1: DEEP AMBIENT TOROIDAL MIST (Continuous annular diffuse fog)
  // Drawn using 32 overlapping soft Gaussian puffs along the orbital torus
  const numPuffsL1 = 32;
  for (let i = 0; i < numPuffsL1; i++) {
    const theta = (i / numPuffsL1) * Math.PI * 2 + simTime * 0.05;
    // Harmonic organic wave gives subtle natural cloud drift
    const radialWisp = 2.4 * Math.sin(3 * theta - simTime * 0.35) + 1.8 * Math.cos(5 * theta + simTime * 0.25);
    const puffRadius = baseR + radialWisp;
    const px = Math.cos(theta) * puffRadius;
    const py = Math.sin(theta) * puffRadius;

    // Wide, soft puff scale (28px radius)
    const puffR = 28 + 3 * Math.sin(theta * 4 + simTime * 0.4);

    const grad = ctx.createRadialGradient(px, py, 0, px, py, puffR);
    grad.addColorStop(0, `rgba(${rSec}, ${gSec}, ${bSec}, ${masterAlpha * 0.75})`);
    grad.addColorStop(0.35, `rgba(${rSec}, ${gSec}, ${bSec}, ${masterAlpha * 0.48})`);
    grad.addColorStop(0.7, `rgba(${rCore}, ${gCore}, ${bCore}, ${masterAlpha * 0.18})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, puffR, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. LAYER 2: INTERMEDIATE VOLUMETRIC GAS VEIL (Subtle celestial stardust vapor)
  // Swirls counter-directionally with gentle respiratory pulse
  const numPuffsL2 = 28;
  for (let i = 0; i < numPuffsL2; i++) {
    const theta = (i / numPuffsL2) * Math.PI * 2 - simTime * 0.07;
    const radialWisp = 1.8 * Math.sin(4 * theta + simTime * 0.5);
    const puffRadius = baseR + radialWisp;
    const px = Math.cos(theta) * puffRadius;
    const py = Math.sin(theta) * puffRadius;

    const puffR = 20 + 2.5 * Math.cos(theta * 3 - simTime * 0.3);

    const grad = ctx.createRadialGradient(px, py, 0, px, py, puffR);
    grad.addColorStop(0, `rgba(${rCore}, ${gCore}, ${bCore}, ${masterAlpha * 0.90})`);
    grad.addColorStop(0.4, `rgba(${rCore}, ${gCore}, ${bCore}, ${masterAlpha * 0.55})`);
    grad.addColorStop(0.8, `rgba(${rSec}, ${gSec}, ${bSec}, ${masterAlpha * 0.16})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, puffR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  // 3. LAYER 3: FLOATING INTERSTELLAR DUST MOTES
  // Rendered as soft fading micro-wisps (never sharp dots!)
  ctx.save();
  try {
    if ('filter' in ctx) {
      ctx.filter = 'blur(1.5px)';
    }
  } catch {}

  for (let i = 0; i < motes.length; i++) {
    const m = motes[i];
    m.angle += m.speed * dt * 0.5;
    // Drift softly within the ring torus volume
    const mRadius = baseR + Math.sin(m.angle * 2.5 + simTime * 0.6) * 4.2;
    const mx = Math.cos(m.angle) * mRadius;
    const my = Math.sin(m.angle) * mRadius;
    const pulse = 0.5 + 0.5 * Math.sin(simTime * m.pulseSpeed + m.pulsePhase);
    const moteAlpha = masterAlpha * m.alpha * pulse * 1.5;

    if (moteAlpha <= 0.005) continue;

    const moteR = m.size * 1.8;
    const moteGrad = ctx.createRadialGradient(mx, my, 0, mx, my, moteR);
    moteGrad.addColorStop(0, `rgba(${rCore}, ${gCore}, ${bCore}, ${moteAlpha})`);
    moteGrad.addColorStop(0.5, `rgba(${rSec}, ${gSec}, ${bSec}, ${moteAlpha * 0.5})`);
    moteGrad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = moteGrad;
    ctx.beginPath();
    ctx.arc(mx, my, moteR, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.restore();
}

export const LivingCosmicRingVisual: React.FC<LivingCosmicRingVisualProps> = ({
  mode,
  hasAdvice = false,
  isThinking = false,
  isDialogueActive = false,
  isFirstDialogue = false,
  isAllGood = false,
  isCatMode = false,
  onClick,
  onSwipeAny,
  onSwipeRight,
  onLongPress,
  blurAmount = 0,
  calmHue = 260,
  calmLightness = 60,
  onConstellationActiveChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync props to refs for 60fps render loop
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const hasAdviceRef = useRef(hasAdvice);
  hasAdviceRef.current = hasAdvice;

  const isThinkingRef = useRef(isThinking);
  isThinkingRef.current = isThinking;

  const isDialogueActiveRef = useRef(isDialogueActive);
  isDialogueActiveRef.current = isDialogueActive;

  const isFirstDialogueRef = useRef(isFirstDialogue);
  isFirstDialogueRef.current = isFirstDialogue;

  const isAllGoodRef = useRef(isAllGood);
  isAllGoodRef.current = isAllGood;

  const calmHueRef = useRef(calmHue);
  calmHueRef.current = calmHue;

  const onConstellationActiveChangeRef = useRef(onConstellationActiveChange);
  useEffect(() => {
    onConstellationActiveChangeRef.current = onConstellationActiveChange;
  }, [onConstellationActiveChange]);

  const calmLightnessRef = useRef(calmLightness);
  calmLightnessRef.current = calmLightness;

  // Pointer drag & touch tracking
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    isDown: false,
    active: false,
  });

  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isLongPressTriggeredRef = useRef(false);

  // Physical simulation constants & variables
  const physicsRef = useRef({
    wobblePhase: 0,
    tiltX: 0.32,
    tiltY: 0,
    rotation: 0,
    breathePhase: 0,
    shockwaveRadius: 0,
    shockwaveIntensity: 0,
  });

  // Emotional light mood transition interpolator (Спокій / Позитив / Негатив)
  const moodColorRef = useRef({
    ratio: 0,
    targetRatio: 0,
    targetR: 96,
    targetG: 165,
    targetB: 250,
    currentR: 96,
    currentG: 165,
    currentB: 250,
    moodType: 'calm' as 'calm' | 'positive' | 'anxiety' | 'luminous' | 'calm_soft',
    auraIntensity: 0.65,
    speedMultiplier: 1.0,
    targetSpeedMultiplier: 1.0,
    starScaleMultiplier: 1.0,
    targetStarScaleMultiplier: 1.0,
    starAlphaMultiplier: 1.0,
    targetStarAlphaMultiplier: 1.0,
  });

  // Neutral Reaction: Expanding & returning ring wave on "Ок / Зрозумів"
  const neutralExpandRef = useRef({
    active: false,
    progress: 0,
    currentOffset: 0,
  });

  // Periodic Celestial Freeze & Symmetry ("Коли воно завмирає — зірки утворюють симетричну структуру з однаковими проміжками")
  const freezeStateRef = useRef({
    timer: 0,
    nextFreezeInterval: 22 + Math.random() * 12,
    phase: 'idle' as 'idle' | 'freezing' | 'symmetrizing' | 'holding_symmetry' | 'releasing',
    phaseElapsed: 0,
    freezeFactor: 0,
    symmetryFactor: 0,
    tremorIntensity: 0, // Інтенсивність хаотичного дрижання зірок на місці (1.0 -> 0.0)
    freezeDecelDuration: 1.2,
    symmetrizeDuration: 1.5,
    holdDuration: 5.4, // Подовжене утримання нерухомої структури з дрижанням
    releaseDuration: 2.6, // Плавне заспокоєння та плавний перехід у звичайний режим обертання
  });

  // Authentic Night Sky Constellation on the outer edge
  const constellationRef = useRef({
    timer: 0,
    nextConstellationInterval: 8 + Math.random() * 8, // Initial emergence after 8-16s
    active: false,
    phase: 'dormant' as 'dormant' | 'emerging' | 'holding' | 'locked' | 'returning',
    phaseElapsed: 0,
    lineAlpha: 0,
    currentConstellation: null as RealConstellation | null,
    baseAngle: -Math.PI / 2,
  });

  // Star Fade Wave effect: stars gradually fade out in a circle and light up again on dialogue option click
  const starFadeWaveRef = useRef({
    active: false,
    elapsed: 0,
    duration: 1.6,
  });

  useEffect(() => {
    const handleFadePulse = () => {
      starFadeWaveRef.current = {
        active: true,
        elapsed: 0,
        duration: 1.6,
      };
    };
    window.addEventListener('analyzer-ring-star-fade-pulse', handleFadePulse);
    return () => window.removeEventListener('analyzer-ring-star-fade-pulse', handleFadePulse);
  }, []);

  // Sparkler sparks effect (бенгальський вогник: зовнішні та внутрішні вибухи)
  const sparklerParticlesRef = useRef<SparklerParticle[]>([]);

  useEffect(() => {
    const handleSparkler = () => {
      const particles: SparklerParticle[] = [];

      // 1. Зовнішні вибухи бенгальського вогника (із зовнішнього шару кільця назовні)
      const outerCount = 55;
      const outerRimRadius = 55; // Крайній зовнішній шар тора Кільця

      for (let i = 0; i < outerCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Спалахують на зовнішньому шарі кільця
        const spawnR = outerRimRadius + (Math.random() - 0.5) * 4.0;
        const startX = Math.cos(angle) * spawnR;
        const startY = Math.sin(angle) * spawnR;

        // Політ суворо назовні від кільця з природним конусом розсіювання
        const outwardAngle = angle + (Math.random() - 0.5) * 0.45;
        const speed = 70 + Math.random() * 130;
        const maxLife = 0.8 + Math.random() * 1.0;
        const colors = ['#ffffff', '#fef08a', '#fbbf24', '#f59e0b', '#38bdf8'];
        const col = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
          x: startX,
          y: startY,
          vx: Math.cos(outwardAngle) * speed,
          vy: Math.sin(outwardAngle) * speed,
          radius: Math.random() * 1.9 + 0.8,
          alpha: 1.0,
          color: col,
          glowColor: col === '#ffffff' ? '#60a5fa' : col,
          life: 0,
          maxLife,
          twinkleSpeed: 15 + Math.random() * 20,
        });
      }

      // 2. Дрібніші вибухи всередину кільця із внутрішнього шару кільця
      const innerCount = 45;
      const innerRimRadius = 41.5; // Внутрішній шар тора Кільця

      // Концентровані мікровибухові вузли по колу внутрішнього шару
      const numInnerBurstNodes = 4 + Math.floor(Math.random() * 3);
      const burstAngles: number[] = [];
      for (let b = 0; b < numInnerBurstNodes; b++) {
        burstAngles.push((b / numInnerBurstNodes) * Math.PI * 2 + (Math.random() - 0.5) * 0.5);
      }

      for (let i = 0; i < innerCount; i++) {
        const baseAngle = (i % 2 === 0 && burstAngles.length > 0)
          ? burstAngles[i % burstAngles.length] + (Math.random() - 0.5) * 0.35
          : Math.random() * Math.PI * 2;

        const spawnR = innerRimRadius + (Math.random() - 0.5) * 3.0;
        const startX = Math.cos(baseAngle) * spawnR;
        const startY = Math.sin(baseAngle) * spawnR;

        // Політ всередину кільця (до центру) із конусом розсіювання
        const inwardAngle = baseAngle + Math.PI + (Math.random() - 0.5) * 0.55;
        const speed = 40 + Math.random() * 75; // Делікатніша швидкість польоту всередину
        const maxLife = 0.55 + Math.random() * 0.65;
        const innerColors = ['#ffffff', '#fef08a', '#fde047', '#67e8f9', '#93c5fd', '#f472b6'];
        const col = innerColors[Math.floor(Math.random() * innerColors.length)];

        particles.push({
          x: startX,
          y: startY,
          vx: Math.cos(inwardAngle) * speed,
          vy: Math.sin(inwardAngle) * speed,
          radius: Math.random() * 0.8 + 0.45, // Дрібніший розмір частинок (0.45 - 1.25px)
          alpha: 1.0,
          color: col,
          glowColor: col === '#ffffff' ? '#38bdf8' : col,
          life: 0,
          maxLife,
          twinkleSpeed: 20 + Math.random() * 25,
        });
      }

      sparklerParticlesRef.current = particles;
    };
    window.addEventListener('analyzer-ring-sparkler-sparks', handleSparkler);
    return () => window.removeEventListener('analyzer-ring-sparkler-sparks', handleSparkler);
  }, []);

  // Dialogue Local Flare Spawner
  const dialogueFlaresRef = useRef<LocalDialogueFlare[]>([]);
  const nextFlareTimerRef = useRef(0.4);

  // Dialogue Transition & Cosmic Nebula State
  const dialogueTransitionRef = useRef({ factor: 0 });
  const nebulaMotesRef = useRef<NebulaGasMote[]>([]);

  // Hold-to-inhale long press state ("розширюється ніби легені що наповнюються киснем")
  const holdInhaleRef = useRef({
    isHolding: false,
    progress: 0,
    triggered: false,
  });

  // User Ring Circular Spin Dragging & Inertial Physics
  const spinRef = useRef({
    isDragging: false,
    lastAngle: 0,
    angularVelocity: 0, // rad/sec
    userOffsetAngle: 0, // accumulated user spin angle
  });

  // Stars of the living cosmic ring
  const starsRef = useRef<RingStar3D[]>([]);
  // Galactic spiral arms creeping out of the ring
  const spiralArmsRef = useRef<SpiralArm[]>([]);
  const nextArmSpawnTimerRef = useRef<number>(1.8); // First arm begins forming smoothly after 1.8s
  const animFrameRef = useRef<number | null>(null);

  // Star Dance Animation ("танець зірочок")
  const starDanceRef = useRef({
    active: false,
    elapsed: 0,
    duration: 3.2,
  });

  // Listen for 'analyzer-ring-expand-react' event when user clicks "Зрозумів" / "Ок",
  // constellation lock/release, cat silhouette, and star dance events
  useEffect(() => {
    const handleExpandReact = () => {
      const ne = neutralExpandRef.current;
      ne.active = true;
      ne.progress = 0;
    };
    const handleLock = () => {
      if (constellationRef.current.active) {
        constellationRef.current.phase = 'locked';
      }
    };
    const handleRelease = () => {
      if (constellationRef.current.active) {
        constellationRef.current.phase = 'returning';
        constellationRef.current.phaseElapsed = 0;
      }
    };
    const handleTrigger = () => {
      const c = constellationRef.current;
      c.timer = c.nextConstellationInterval + 1;
    };
    const handleTriggerFreeze = () => {
      const f = freezeStateRef.current;
      if (f.phase === 'idle') {
        f.timer = f.nextFreezeInterval + 1;
      }
    };

    // Cat Silhouette creation: ring forms a full-height standing cat constellation silhouette
    const handleCatSilhouette = () => {
      const c = constellationRef.current;
      c.active = true;
      c.phase = 'locked';
      c.lineAlpha = 1.0;
      c.currentConstellation = CAT_CONSTELLATION;
      c.phaseElapsed = 0;

      const stars = starsRef.current;
      if (stars.length > 0) {
        stars.forEach((s) => {
          s.isConstellationMember = false;
          s.constellationVertexIndex = undefined;
        });

        CAT_CONSTELLATION.stars.forEach((cStar, vIdx) => {
          const s = stars[vIdx % stars.length];
          s.isConstellationMember = true;
          s.constellationVertexIndex = vIdx;
          s.centerTargetX = cStar.x;
          s.centerTargetY = cStar.y;
          s.centerTargetZ = 0;
        });
      }
    };

    // Star Dance animation ("танець зірочок")
    const handleStarDance = () => {
      starDanceRef.current = {
        active: true,
        elapsed: 0,
        duration: 3.2,
      };
      try {
        window.dispatchEvent(new Event('analyzer-ring-sparkler-sparks'));
      } catch {}
    };

    // Normal mode return
    const handleNormalMode = () => {
      starDanceRef.current.active = false;
      const c = constellationRef.current;
      c.phase = 'returning';
      c.phaseElapsed = 0;
      setTimeout(() => {
        c.active = false;
        c.currentConstellation = null;
        starsRef.current.forEach((s) => {
          s.isConstellationMember = false;
          s.constellationVertexIndex = undefined;
        });
      }, 800);
    };

    window.addEventListener('analyzer-ring-expand-react', handleExpandReact);
    window.addEventListener('analyzer-constellation-lock', handleLock);
    window.addEventListener('analyzer-constellation-release', handleRelease);
    window.addEventListener('trigger-constellation', handleTrigger);
    window.addEventListener('analyzer-ring-trigger-freeze', handleTriggerFreeze);
    window.addEventListener('analyzer-ring-cat-silhouette', handleCatSilhouette);
    window.addEventListener('analyzer-ring-star-dance', handleStarDance);
    window.addEventListener('analyzer-ring-normal-mode', handleNormalMode);

    return () => {
      window.removeEventListener('analyzer-ring-expand-react', handleExpandReact);
      window.removeEventListener('analyzer-constellation-lock', handleLock);
      window.removeEventListener('analyzer-constellation-release', handleRelease);
      window.removeEventListener('trigger-constellation', handleTrigger);
      window.removeEventListener('analyzer-ring-trigger-freeze', handleTriggerFreeze);
      window.removeEventListener('analyzer-ring-cat-silhouette', handleCatSilhouette);
      window.removeEventListener('analyzer-ring-star-dance', handleStarDance);
      window.removeEventListener('analyzer-ring-normal-mode', handleNormalMode);
    };
  }, []);

  useEffect(() => {
    if (isCatMode) {
      try {
        window.dispatchEvent(new Event('analyzer-ring-cat-silhouette'));
      } catch {}
    }
  }, [isCatMode]);

  // Initialize ring stars across multi-layered concentric orbits
  useEffect(() => {
    const getStarCount = () => {
      try {
        const saved = localStorage.getItem('quit-smoking:analyzer-ring-stars-count');
        if (saved !== null) {
          const val = parseInt(saved, 10);
          if (!isNaN(val)) return Math.max(1, Math.min(200, val));
        }
      } catch {}
      return 80; // Default initial star count: 80 stars
    };

    const initStars = () => {
      const starCount = getStarCount();
      const tubeRadiusMax = 6.5; // Minor tube offset (leaves pristine void in center r < 38)
      const ORBITAL_LANES = [43.5, 45.8, 48.0, 50.4, 52.8];

      const stars: RingStar3D[] = [];

      for (let i = 0; i < starCount; i++) {
        const palette = SPECTRAL_PALETTES[i % SPECTRAL_PALETTES.length];
        const theta = (i / starCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.12;
        const phi = Math.random() * Math.PI * 2;
        const tubeR = Math.pow(Math.random(), 0.75) * tubeRadiusMax;

        // Concentric sub-orbit selection with fine natural jitter
        const lane = ORBITAL_LANES[i % ORBITAL_LANES.length];
        const starMajorRadius = lane + (Math.random() - 0.5) * 0.8;
        // Differential orbital velocity: inner lanes move slightly faster than outer lanes
        const baseOrbitSpeed = (0.24 - (starMajorRadius - 43.5) * 0.009) * (0.9 + Math.random() * 0.2);

        // 5 DISTINCT SIZE & BRIGHTNESS GRADATION TIERS
        const sizeTier = (i % 5) + 1;

        let baseRadius = 2.0;
        let baseAlpha = 0.6;
        let layer = 1;

        if (sizeTier === 5) {
          baseRadius = Math.random() * 0.5 + 3.6; // Level 5: Largest (Max current size)
          baseAlpha = Math.random() * 0.08 + 0.92; // Level 5: Brightest
          layer = 2; // Major diamond star
        } else if (sizeTier === 4) {
          baseRadius = Math.random() * 0.5 + 2.9; // Level 4
          baseAlpha = Math.random() * 0.13 + 0.75; // Level 4
          layer = 1;
        } else if (sizeTier === 3) {
          baseRadius = Math.random() * 0.4 + 2.2; // Level 3
          baseAlpha = Math.random() * 0.14 + 0.58; // Level 3
          layer = 1;
        } else if (sizeTier === 2) {
          baseRadius = Math.random() * 0.4 + 1.5; // Level 2
          baseAlpha = Math.random() * 0.14 + 0.40; // Level 2
          layer = 1;
        } else {
          baseRadius = Math.random() * 0.5 + 0.8; // Level 1: Smallest
          baseAlpha = Math.random() * 0.14 + 0.22; // Level 1: Faintest
          layer = 0; // Micro pinpoint star
        }

        const ox = (starMajorRadius + tubeR * Math.cos(phi)) * Math.cos(theta);
        const oy = (starMajorRadius + tubeR * Math.cos(phi)) * Math.sin(theta);
        const oz = tubeR * Math.sin(phi);

        stars.push({
          id: i,
          theta,
          phi,
          orbitSpeed: baseOrbitSpeed,
          phiSpeed: (Math.random() - 0.5) * 0.25,
          ringRadius: starMajorRadius,
          tubeRadius: tubeR,
          x: ox,
          y: oy,
          z: oz,
          ox,
          oy,
          oz,
          vx: 0,
          vy: 0,
          vz: 0,
          mass: 0.85 + Math.random() * 0.4,
          springK: 0.07 + Math.random() * 0.03,
          damping: 0.88 + Math.random() * 0.04,
          radius: baseRadius,
          baseRadius,
          spectralColor: palette.star,
          glowColor: palette.glow,
          layer,
          baseAlpha,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 1.8 + 0.9,
          flareIntensity: 0,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() < 0.5 ? -1 : 1) * (0.2 + Math.random() * 0.3),
        });
      }

      starsRef.current = stars;

      // Scale arm stars proportionally from 5 down to 0
      const armStarCount = Math.max(0, Math.min(5, Math.floor((5 / 80) * starCount)));

      const initialArms: SpiralArm[] = [
        {
          id: 1,
          rootTheta: 0.35,
          windingDirection: -1,
          tightness: 1.45,
          maxArmLength: 72,
          stars: [],
          maxStars: 8,
          age: 10,
          spawnTimer: 2.0,
          exhausted: false,
        },
        {
          id: 2,
          rootTheta: 0.35 + Math.PI,
          windingDirection: -1,
          tightness: 1.45,
          maxArmLength: 72,
          stars: [],
          maxStars: 8,
          age: 10,
          spawnTimer: 2.0,
          exhausted: false,
        }
      ];

      initialArms.forEach(arm => {
        for (let s = 0; s < armStarCount; s++) {
          const pal = SPECTRAL_PALETTES[(s * 2) % SPECTRAL_PALETTES.length];
          const distAlongArm = 8 + s * 11;
          const armTier = (s % 4) + 2; // tiers 2..5
          const armRadius = armTier === 5 ? 3.4 : armTier === 4 ? 2.8 : armTier === 3 ? 2.2 : 1.6;
          const armAlpha = armTier === 5 ? 0.95 : armTier === 4 ? 0.85 : armTier === 3 ? 0.70 : 0.55;
          const layer = armTier >= 4 ? 2 : armTier >= 2 ? 1 : 0;

          arm.stars.push({
            id: Math.random(),
            distAlongArm,
            crawlSpeed: 1.4 + Math.random() * 0.5,
            angleOffset: (Math.random() - 0.5) * 0.06,
            tubeOffset: (Math.random() - 0.5) * 3.0,
            radius: armRadius,
            baseRadius: armRadius,
            spectralColor: pal.star,
            glowColor: pal.glow,
            alpha: armAlpha,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() < 0.5 ? -1 : 1) * 0.25,
            twinklePhase: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 1.8 + 0.9,
            layer,
            projScreenX: 0,
            projScreenY: 0,
            projZ: 0,
          });
        }
      });

      spiralArmsRef.current = initialArms;
    };

    initStars();

    const handleStarsChange = () => {
      initStars();
    };

    window.addEventListener('analyzer-ring-stars-changed', handleStarsChange);
    return () => {
      window.removeEventListener('analyzer-ring-stars-changed', handleStarsChange);
    };
  }, []);

  // Initialize cosmic nebula motes
  useEffect(() => {
    // Initialize cosmic nebula motes
    const NEBULA_PALETTE = ['#38bdf8', '#34d399', '#c084fc', '#f472b6', '#67e8f9', '#ffffff'];
    const motes: NebulaGasMote[] = [];
    for (let i = 0; i < 22; i++) {
      motes.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 18 + 4,
        speed: (Math.random() * 0.4 + 0.2) * (Math.random() < 0.5 ? 1 : -1),
        size: Math.random() * 1.1 + 0.6,
        alpha: Math.random() * 0.45 + 0.45,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 2.0 + 1.2,
        color: NEBULA_PALETTE[i % NEBULA_PALETTE.length],
      });
    }
    nebulaMotesRef.current = motes;
  }, []);

  // Main high-performance render loop
  useEffect(() => {
    let isRunning = true;
    let lastTime = performance.now();
    let simTime = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
      s /= 100;
      l /= 100;
      const k = (n: number) => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
    };

    const render = (now: number) => {
      if (!isRunning) return;

      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(rawDt, 0.05);
      simTime += dt;
      const step = dt * 60;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const baseCenterX = width / 2;
      const baseCenterY = height / 2;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const phys = physicsRef.current;
      const ptr = pointerRef.current;
      const mc = moodColorRef.current;
      const ne = neutralExpandRef.current;
      const freeze = freezeStateRef.current;
      const constel = constellationRef.current;
      const flares = dialogueFlaresRef.current;

      const curMode = modeRef.current;
      const curAdvice = hasAdviceRef.current;
      const curThinking = isThinkingRef.current;
      const curDialogue = isDialogueActiveRef.current;
      const curAllGood = isAllGoodRef.current;

      // 1. REACTION SCHEMES
      // "Червону пульсацію прибери хай натомість буде збільшення сяйливості самої хмари кільця"
      if (curAdvice && !curAllGood) {
        // High-Luminosity Radiant Alert: cloud becomes radiant, shining with intense starlight (no red!)
        mc.moodType = 'luminous';
        mc.targetR = 255; mc.targetG = 255; mc.targetB = 255; // Diamond brilliant starlight
        mc.targetRatio = 1.0;
        mc.auraIntensity = 1.6;                // Amplified celestial radiance
        mc.targetSpeedMultiplier = 1.35;       // Living orbital flow
        mc.targetStarScaleMultiplier = 1.25;   // Stars expand into radiant beacons
        mc.targetStarAlphaMultiplier = 1.5;    // Maximum stellar luminosity
      } else if ((curMode as any) === 'anxiety' || curMode === 'red-flash') {
        // Calm supportive starlight (no red alarms)
        mc.moodType = 'calm_soft';
        mc.targetR = 147; mc.targetG = 197; mc.targetB = 253; // Soft celestial blue
        mc.targetRatio = 0.8;
        mc.auraIntensity = 0.85;
        mc.targetSpeedMultiplier = 0.85;
        mc.targetStarScaleMultiplier = 1.0;
        mc.targetStarAlphaMultiplier = 1.0;
      } else if (curDialogue) {
        // Dialogue active (Зріз стану, тощо) — спокійне кришталево-блакитне сяйво без жовтіння
        mc.moodType = 'calm_soft';
        mc.targetR = 147; mc.targetG = 197; mc.targetB = 253; // Soft celestial sapphire
        mc.targetRatio = 0.85;
        mc.auraIntensity = 0.9;
        mc.targetSpeedMultiplier = 1.0;
        mc.targetStarScaleMultiplier = 1.0;
        mc.targetStarAlphaMultiplier = 1.0;
      } else if (curThinking) {
        mc.moodType = 'calm';
        mc.targetR = 192; mc.targetG = 132; mc.targetB = 252; // Violet
        mc.targetRatio = 0.7;
        mc.auraIntensity = 0.8;
        mc.targetSpeedMultiplier = 1.4;
        mc.targetStarScaleMultiplier = 1.05;
        mc.targetStarAlphaMultiplier = 0.9;
      } else {
        mc.moodType = 'calm';
        mc.targetR = 96; mc.targetG = 165; mc.targetB = 250; // Serene Sapphire
        mc.targetRatio = 0.0;
        mc.auraIntensity = 0.65;
        mc.targetSpeedMultiplier = 0.95;       // Slow, tranquil movement
        mc.targetStarScaleMultiplier = 1.0;
        mc.targetStarAlphaMultiplier = 1.0;
      }

      // Smooth state interpolation
      const smoothBlend = 0.07 * step;
      mc.ratio += (mc.targetRatio - mc.ratio) * smoothBlend;
      mc.speedMultiplier += (mc.targetSpeedMultiplier - mc.speedMultiplier) * smoothBlend;
      mc.starScaleMultiplier += (mc.targetStarScaleMultiplier - mc.starScaleMultiplier) * smoothBlend;
      mc.starAlphaMultiplier += (mc.targetStarAlphaMultiplier - mc.starAlphaMultiplier) * smoothBlend;

      // 2. PERIODIC CELESTIAL FREEZE & SYMMETRY ("Коли воно завмирає — зірки утворюють симетричну структуру з однаковими проміжками")
      const isConstellationMode = constel.active || constel.phase !== 'dormant';
      const isFirstDialogueActive = isFirstDialogueRef.current;

      if (freeze.phase === 'idle') {
        if (!isConstellationMode && !isFirstDialogueActive && !curDialogue) {
          freeze.timer += dt;
          if (freeze.timer > freeze.nextFreezeInterval) {
            freeze.phase = 'freezing';
            freeze.phaseElapsed = 0;
            freeze.freezeFactor = 0;
            freeze.symmetryFactor = 0;
          }
        }
      } else if (freeze.phase === 'freezing') {
        // Кільце плавно сповільнюється і завмирає
        freeze.phaseElapsed += dt;
        const progress = Math.min(1.0, freeze.phaseElapsed / freeze.freezeDecelDuration);
        freeze.freezeFactor = progress * progress * (3 - 2 * progress); // smoothstep

        if (freeze.phaseElapsed >= freeze.freezeDecelDuration) {
          freeze.freezeFactor = 1.0;
          // Коли кільце завмерло — наступна фаза анімації: розрахунок симетричної структури з однаковими проміжками між зірками
          const starList = starsRef.current;
          const count = starList.length;
          if (count > 0) {
            // Сортуємо зірки за поточним кутом theta, щоб кожна плавно перемістилася до найближчого симетричного слоту
            const indexed = starList.map((st, idx) => {
              const normTheta = ((st.theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
              return { idx, normTheta, star: st };
            });
            indexed.sort((a, b) => a.normTheta - b.normTheta);

            const baseAngle = indexed[0].normTheta;
            for (let k = 0; k < count; k++) {
              const item = indexed[k];
              const equidistantTheta = baseAngle + (k / count) * (Math.PI * 2);
              // Найкоротший шлях до симетричної позиції
              let diff = (equidistantTheta - item.star.theta) % (Math.PI * 2);
              if (diff > Math.PI) diff -= Math.PI * 2;
              if (diff < -Math.PI) diff += Math.PI * 2;
              item.star.symmetricTargetTheta = item.star.theta + diff;
              // Симетрична структура: гармонійні концентричні проміжки з однаковою відстанню
              item.star.symmetricTargetR = 48.0 + (k % 2 === 0 ? -2.2 : 2.2);
            }
          }

          freeze.phase = 'symmetrizing';
          freeze.phaseElapsed = 0;
        }
      } else if (freeze.phase === 'symmetrizing') {
        // Зірки утворюють симетричну структуру з однаковими проміжками
        freeze.phaseElapsed += dt;
        const progress = Math.min(1.0, freeze.phaseElapsed / freeze.symmetrizeDuration);
        freeze.symmetryFactor = progress * progress * (3 - 2 * progress);
        freeze.freezeFactor = 1.0;
        // Під кінець змикання структури починається наростання хаотичного дрижання
        freeze.tremorIntensity = Math.max(0, (progress - 0.7) / 0.3);

        if (freeze.phaseElapsed >= freeze.symmetrizeDuration) {
          freeze.symmetryFactor = 1.0;
          freeze.tremorIntensity = 1.0;
          freeze.phase = 'holding_symmetry';
          freeze.phaseElapsed = 0;
        }
      } else if (freeze.phase === 'holding_symmetry') {
        // Утримання нерухомої симетричної структури зірок: хаотичне дрижання на місці з поступовим заспокоєнням
        freeze.phaseElapsed += dt;
        freeze.symmetryFactor = 1.0;
        freeze.freezeFactor = 1.0;

        const holdProgress = Math.min(1.0, freeze.phaseElapsed / freeze.holdDuration);
        // Перші 45% часу — інтенсивне хаотичне дрижання (1.0), потім плавно згасає до 0.25
        if (holdProgress < 0.45) {
          freeze.tremorIntensity = 1.0;
        } else {
          const calmProgress = (holdProgress - 0.45) / 0.55;
          freeze.tremorIntensity = 1.0 - calmProgress * 0.75;
        }

        if (freeze.phaseElapsed >= freeze.holdDuration) {
          freeze.phase = 'releasing';
          freeze.phaseElapsed = 0;
        }
      } else if (freeze.phase === 'releasing') {
        // Плавне повне заспокоєння дрижання та плавний перехід у звичайний режим обертання
        freeze.phaseElapsed += dt;
        const progress = Math.min(1.0, freeze.phaseElapsed / freeze.releaseDuration);
        const invProgress = 1.0 - (progress * progress * (3 - 2 * progress));
        freeze.symmetryFactor = invProgress;
        freeze.freezeFactor = invProgress;
        freeze.tremorIntensity = 0.25 * Math.max(0, 1.0 - progress * 1.5);

        if (freeze.phaseElapsed >= freeze.releaseDuration) {
          freeze.symmetryFactor = 0;
          freeze.freezeFactor = 0;
          freeze.tremorIntensity = 0;
          freeze.phase = 'idle';
          freeze.timer = 0;
          freeze.nextFreezeInterval = 22 + Math.random() * 12;

          // Оновлюємо базові кути зірок для безперервного стандартного обертання
          const starList = starsRef.current;
          for (let i = 0; i < starList.length; i++) {
            if (starList[i].symmetricTargetTheta !== undefined) {
              starList[i].theta = starList[i].symmetricTargetTheta!;
            }
          }
        }
      }

      // Dialogue mode transition (Smooth acceleration, narrowing, and nebula reveal)
      const dTrans = dialogueTransitionRef.current;
      const targetDialogueFactor = (curDialogue && !isConstellationMode) ? 1.0 : 0.0;
      dTrans.factor += (targetDialogueFactor - dTrans.factor) * Math.min(1.0, dt * 3.8);
      const dialogueFactor = dTrans.factor;

      // Speed acceleration: in constellation mode, keep calm and steady (1.0x) to avoid device overload
      const dialogueSpeedBoost = isConstellationMode ? 1.0 : (1.0 + dialogueFactor * 1.8);
      let effectiveSpeedFactor = isConstellationMode
        ? 1.0
        : mc.speedMultiplier * Math.max(0, 1.0 - freeze.freezeFactor) * dialogueSpeedBoost;

      // Ring contraction: completely disabled during constellation mode
      const dialogueContraction = isConstellationMode ? 0 : dialogueFactor * 10.0;

      // 3. NEUTRAL REACTION EXPANSION ("Ок / Зрозумів" expands and returns)
      if (ne.active) {
        ne.progress += dt * 1.5;
        if (ne.progress >= 1.0) {
          ne.active = false;
          ne.progress = 0;
          ne.currentOffset = 0;
        } else {
          ne.currentOffset = Math.sin(ne.progress * Math.PI) * 12.0;
        }
      }

      // 4. PERIODIC AUTHENTIC CONSTELLATION EMERGENCE (Formed organically from the living ring stars)
      constel.timer += dt;
      if (!constel.active && constel.timer > constel.nextConstellationInterval) {
        constel.active = true;
        constel.phase = 'emerging';
        constel.phaseElapsed = 0;
        constel.lineAlpha = 0;

        const nextCon = getRandomRealConstellation(constel.currentConstellation?.id);
        constel.currentConstellation = nextCon;
        // Position along the upper/side arc of the living ring
        constel.baseAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5;

        // Organically assign the constellation vertices to existing ring stars in that sector
        const starList = starsRef.current;
        const requiredCount = nextCon.stars.length;
        if (starList.length > 0) {
          // Reset previous member flags
          starList.forEach(s => {
            s.isConstellationMember = false;
            s.constellationVertexIndex = undefined;
          });

          // Find candidate stars closest in theta to the constellation baseAngle
          const scored = starList.map((st, idx) => {
            const rawDiff = ((st.theta - constel.baseAngle) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
            const diff = Math.abs(rawDiff);
            return { idx, diff, star: st };
          });
          // Sort primarily by angular proximity to baseAngle
          scored.sort((a, b) => a.diff - b.diff);

          // Assign the best candidate stars to each vertex of the constellation
          for (let v = 0; v < requiredCount && v < scored.length; v++) {
            const vStar = nextCon.stars[v];
            const member = scored[v].star;
            member.isConstellationMember = true;
            member.constellationVertexIndex = v;
            // Map the constellation coordinates to fly directly into the center of the ring
            // Span of ~34px in the center void of the cosmic ring
            member.centerTargetX = (vStar.x - 0.5) * 34.0;
            member.centerTargetY = (vStar.y - 0.5) * 34.0;
            member.centerTargetZ = (vStar.y - 0.5) * 6.0;
            // Record initial theta for smooth return flight back to the ring
            member.symmetricTargetTheta = member.theta;
            member.symmetricTargetR = member.ringRadius;
          }
        }

        if (onConstellationActiveChangeRef.current) {
          onConstellationActiveChangeRef.current(nextCon);
        }
        try {
          window.dispatchEvent(new CustomEvent('analyzer-constellation-active', { detail: nextCon }));
        } catch {}
      }

      if (constel.active) {
        constel.phaseElapsed += dt;
        if (constel.phase === 'emerging') {
          constel.lineAlpha = Math.min(1.0, constel.phaseElapsed / 1.8);
          if (constel.phaseElapsed >= 1.8) {
            constel.phase = 'holding';
            constel.phaseElapsed = 0;
          }
        } else if (constel.phase === 'holding') {
          constel.lineAlpha = 0.95 + 0.05 * Math.sin(simTime * 3);
          // 1.8s emerging + 7.2s holding + 1.8s returning = ~10.8s total duration
          if (constel.phaseElapsed >= 7.2) {
            constel.phase = 'returning';
            constel.phaseElapsed = 0;
          }
        } else if (constel.phase === 'locked') {
          // Locked during active astronomical explanation dialogue
          constel.lineAlpha = 1.0;
        } else if (constel.phase === 'returning') {
          constel.lineAlpha = Math.max(0.0, 1.0 - constel.phaseElapsed / 1.8);
          if (constel.phaseElapsed >= 1.8) {
            constel.active = false;
            constel.phase = 'dormant';
            constel.timer = 0;
            constel.nextConstellationInterval = 10 + Math.random() * 12;
            constel.currentConstellation = null;

            // Reset constellation membership on ring stars and let them seamlessly resume orbiting
            const starList = starsRef.current;
            starList.forEach(s => {
              if (s.isConstellationMember) {
                s.isConstellationMember = false;
                s.constellationVertexIndex = undefined;
              }
            });

            if (onConstellationActiveChangeRef.current) {
              onConstellationActiveChangeRef.current(null);
            }
            try {
              window.dispatchEvent(new CustomEvent('analyzer-constellation-dormant'));
            } catch {}
          }
        }
      }

      // 5. LOCAL DIALOGUE FLARES (disabled during constellation mode to prevent lag)
      if (curDialogue && !isConstellationMode) {
        nextFlareTimerRef.current -= dt;
        if (nextFlareTimerRef.current <= 0) {
          nextFlareTimerRef.current = 0.35 + Math.random() * 0.45;
          const flareAngle = Math.random() * Math.PI * 2;
          flares.push({
            id: Math.random(),
            angle: flareAngle,
            intensity: 1.0,
            duration: 0.8 + Math.random() * 0.6,
            elapsed: 0,
            spread: 0.55 + Math.random() * 0.4,
            color: SPECTRAL_PALETTES[Math.floor(Math.random() * SPECTRAL_PALETTES.length)].star,
          });
        }
      }

      for (let f = flares.length - 1; f >= 0; f--) {
        const fl = flares[f];
        fl.elapsed += dt;
        fl.intensity = Math.max(0, 1.0 - fl.elapsed / fl.duration);
        if (fl.elapsed >= fl.duration) {
          flares.splice(f, 1);
        }
      }

      // 6. Color blending
      const cHue = calmHueRef.current;
      const cLight = calmLightnessRef.current;
      const calmBlend = 1 - mc.ratio;

      let calmR = 96, calmG = 165, calmB = 250;
      if (cLight === 100) {
        calmR = 255; calmG = 255; calmB = 255;
      } else if (cLight === 0) {
        calmR = 30; calmG = 35; calmB = 45;
      } else {
        const [r, g, b] = hslToRgb(cHue, 85, cLight);
        calmR = r; calmG = g; calmB = b;
      }

      mc.currentR = Math.round(calmR * calmBlend + mc.targetR * smoothBlend);
      mc.currentG = Math.round(calmG * calmBlend + mc.targetG * smoothBlend);
      mc.currentB = Math.round(calmB * calmBlend + mc.targetB * smoothBlend);

      // Star dance animation ("танець зірочок") boost
      const sd = starDanceRef.current;
      if (sd.active) {
        sd.elapsed += dt;
        effectiveSpeedFactor *= 4.5;
        if (sd.elapsed >= sd.duration) {
          sd.active = false;
        }
      }

      // Rotation & Coherent Resonant Breathing (~6 breaths/min = 10s period for neuro-vagal calmness)
      phys.rotation += 0.2 * dt * effectiveSpeedFactor;
      const isDialogue = curDialogue;
      const COHERENT_PERIOD = 10.0;
      const breatheSpeed = isDialogue ? 1.5 : (2 * Math.PI) / COHERENT_PERIOD;
      phys.breathePhase += dt * breatheSpeed;
      const breatheAmplitude = isDialogue ? 6.5 : 2.8;
      const breathe = Math.sin(phys.breathePhase) * breatheAmplitude + ne.currentOffset;

      // Hold Inhale State (Довге затискання: розширюється ніби легені що наповнюються киснем)
      const hi = holdInhaleRef.current;
      if (hi.isHolding && !hi.triggered) {
        hi.progress = Math.min(1.0, hi.progress + dt / 1.25);
        if (hi.progress >= 1.0) {
          hi.triggered = true;
          if (navigator.vibrate) {
            try { navigator.vibrate([35, 60, 40]); } catch {}
          }
          if (onLongPress) onLongPress();
        }
      } else if (!hi.isHolding) {
        hi.progress = Math.max(0, hi.progress - dt * 2.4);
      }

      // Respiratory expansion curve (natural lung inhalation kinematics)
      const inhaleEase = Math.sin((hi.progress * Math.PI) / 2);
      const holdRadiusExpand = inhaleEase * 14; // Major radius expands outwards like lungs inflating
      const holdTubeExpand = inhaleEase * 0.45;  // Tube volume swells like lungs filling with air
      const holdAlphaBoost = inhaleEase * 0.35;  // Radiant oxygen starlight

      const centerX = baseCenterX;
      const centerY = baseCenterY;

      // Interactive 3D Gyroscope Dynamic Floating Tilt
      if (ptr.active || ptr.isDown) {
        const targetTiltX = 0.32 + Math.max(-0.28, Math.min(0.28, (ptr.y - baseCenterY) * 0.0036));
        const targetTiltY = Math.max(-0.35, Math.min(0.35, (ptr.x - baseCenterX) * 0.0046));
        const tiltResponse = ptr.isDown ? 0.14 : 0.08;
        phys.tiltX += (targetTiltX - phys.tiltX) * tiltResponse * step;
        phys.tiltY += (targetTiltY - phys.tiltY) * tiltResponse * step;
      } else {
        phys.tiltX += (0.32 - phys.tiltX) * 0.05 * step;
        phys.tiltY += (0 - phys.tiltY) * 0.05 * step;
      }

      // Target Ring Radius for this frame (contracts during active dialogue)
      const currentRingRadius = 48 - dialogueContraction + breathe + holdRadiusExpand;

      const cosTiltX = Math.cos(phys.tiltX);
      const sinTiltX = Math.sin(phys.tiltX);
      const cosTiltY = Math.cos(phys.tiltY);
      const sinTiltY = Math.sin(phys.tiltY);

      // 6b. GALACTIC SPIRAL ARMS SIMULATION ("рукави, з яких менші зірки плавно виповзають і відділяються")
      const arms = spiralArmsRef.current;
      const spin = spinRef.current;
      nextArmSpawnTimerRef.current -= dt;

      // Arm creation (support multiple symmetric trailing spiral arms)
      if (nextArmSpawnTimerRef.current <= 0 && arms.length < 3) {
        nextArmSpawnTimerRef.current = 24 + Math.random() * 16; // 24-40s interval between arms
        let rootTheta = phys.rotation + spin.userOffsetAngle + (Math.random() - 0.5) * 0.3;
        if (arms.length === 1) {
          // Symmetric barred spiral arm opposite to the first arm (180 deg offset)
          rootTheta = arms[0].rootTheta + Math.PI + (Math.random() - 0.5) * 0.15;
        } else if (arms.length === 2) {
          rootTheta = arms[0].rootTheta + (Math.PI * 0.66) + (Math.random() - 0.5) * 0.15;
        }

        arms.push({
          id: Math.random(),
          rootTheta,
          windingDirection: -1, // Рукави закручуються ЗА напрямком обертання (відстають від руху центру)
          tightness: 1.42 + (Math.random() - 0.5) * 0.2,
          maxArmLength: 68, // Crawl ~68px outside ring (total radius ~116px)
          stars: [],
          maxStars: 8,
          age: 0,
          spawnTimer: 0.3,
          exhausted: false,
        });
      }

      // Update active spiral arms
      for (let aIdx = arms.length - 1; aIdx >= 0; aIdx--) {
        const arm = arms[aIdx];
        arm.age += dt;
        arm.rootTheta += (0.2 * dt * effectiveSpeedFactor) + (spin.angularVelocity * dt);

        // Recruit smaller stars into the arm from the ring ("менші зірки плавно виповзають")
        arm.spawnTimer -= dt;
        if (!arm.exhausted && arm.spawnTimer <= 0 && arm.stars.length < arm.maxStars) {
          arm.spawnTimer = 2.2 + Math.random() * 2.0;
          const pal = SPECTRAL_PALETTES[Math.floor(Math.random() * SPECTRAL_PALETTES.length)];
          const crawlSpeed = 1.3 + Math.random() * 0.7; // ~1.3-2.0 px/s (smooth continuous crawl)
          const armTier = Math.floor(Math.random() * 5) + 1;
          const armRadius = armTier === 5 ? 3.4 : armTier === 4 ? 2.8 : armTier === 3 ? 2.2 : armTier === 2 ? 1.6 : 1.1;
          const armAlpha = armTier === 5 ? 0.95 : armTier === 4 ? 0.85 : armTier === 3 ? 0.70 : armTier === 2 ? 0.52 : 0.35;
          const layer = armTier >= 4 ? 2 : armTier >= 2 ? 1 : 0;

          arm.stars.push({
            id: Math.random(),
            distAlongArm: 0, // starts right at ring perimeter
            crawlSpeed,
            angleOffset: (Math.random() - 0.5) * 0.08,
            tubeOffset: (Math.random() - 0.5) * 3.5,
            radius: armRadius,
            baseRadius: armRadius,
            spectralColor: pal.star,
            glowColor: pal.glow,
            alpha: armAlpha,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() < 0.5 ? -1 : 1) * 0.25,
            twinklePhase: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 1.8 + 0.9,
            layer,
            projScreenX: 0,
            projScreenY: 0,
            projZ: 0,
          });

          // After forming for over 45 seconds, stop recruiting to let the arm gracefully unwind
          if (arm.age > 45) {
            arm.exhausted = true;
          }
        }

        // Advance stars along arm and handle detachment ("відділяються від кільця і стають частиною Теми")
        for (let sIdx = arm.stars.length - 1; sIdx >= 0; sIdx--) {
          const as = arm.stars[sIdx];
          as.distAlongArm += as.crawlSpeed * dt * effectiveSpeedFactor;
          as.rotation += as.rotSpeed * dt;

          const armR = currentRingRadius + as.distAlongArm;
          // Logarithmic trailing spiral: angle decreases as radius increases (відстає від обертання центру)
          const spiralLag = Math.log(Math.max(1, armR / currentRingRadius)) * arm.tightness;
          const spiralTheta = arm.rootTheta - spiralLag + as.angleOffset;

          const rawX = Math.cos(spiralTheta) * armR + as.tubeOffset * Math.sin(spiralTheta);
          const rawY = Math.sin(spiralTheta) * armR - as.tubeOffset * Math.cos(spiralTheta);
          const rawZ = as.tubeOffset * 0.5 * Math.sin(phys.breathePhase + as.distAlongArm * 0.08);

          // 3D rotation with ring tilt
          const rx_x = rawX;
          const rx_y = rawY * cosTiltX - rawZ * sinTiltX;
          const rx_z = rawY * sinTiltX + rawZ * cosTiltX;

          const px = rx_x * cosTiltY + rx_z * sinTiltY;
          const py = rx_y;
          const pz = -rx_x * sinTiltY + rx_z * cosTiltY;

          const focal = 180;
          const depthScale = focal / (focal + pz);
          as.projScreenX = centerX + px * depthScale;
          as.projScreenY = centerY + py * depthScale;
          as.projZ = pz;

          // Detachment condition: reached max arm length (outer edge)
          if (as.distAlongArm >= arm.maxArmLength) {
            const canvasRect = canvas.getBoundingClientRect();
            const globalX = canvasRect.left + as.projScreenX;
            const globalY = canvasRect.top + as.projScreenY;

            // Check if this star is passing by the Star icon (top-left quadrant)
            const isNearZenStar = as.projScreenX < -20 && as.projScreenY < -20;

            if (isNearZenStar) {
              try {
                window.dispatchEvent(new CustomEvent('cosmic-star-fly-to-zen-star', {
                  detail: {
                    startX: globalX,
                    startY: globalY,
                  }
                }));
              } catch {}
            } else {
              // Outward tangential release velocity following trailing momentum
              const tangAngle = spiralTheta - (Math.PI / 2);
              const escapeSpeed = 0.45 + Math.random() * 0.35;
              const exitVx = Math.cos(tangAngle) * escapeSpeed;
              const exitVy = Math.sin(tangAngle) * escapeSpeed;

              try {
                window.dispatchEvent(new CustomEvent('cosmic-arm-star-detached', {
                  detail: {
                    x: globalX,
                    y: globalY,
                    vx: exitVx,
                    vy: exitVy,
                    radius: as.radius,
                    spectralColor: as.spectralColor,
                    glowColor: as.glowColor,
                  }
                }));
              } catch {}
            }

            arm.stars.splice(sIdx, 1);
          }
        }

        // Remove exhausted arms that have finished detaching all their stars
        if (arm.exhausted && arm.stars.length === 0) {
          arms.splice(aIdx, 1);
        }
      }

      // Collect all active arm stars in global screen coordinates and dispatch event for timer dimming
      const activeArmStars: Array<{ x: number; y: number; radius: number }> = [];
      arms.forEach(arm => {
        if (arm.exhausted) return;
        const canvasRect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0 };
        arm.stars.forEach(s => {
          activeArmStars.push({
            x: canvasRect.left + s.projScreenX,
            y: canvasRect.top + s.projScreenY,
            radius: s.radius * 2.5
          });
        });
      });
      if (activeArmStars.length > 0) {
        try {
          window.dispatchEvent(new CustomEvent('cosmic-sleeve-stars-tick', {
            detail: { stars: activeArmStars }
          }));
        } catch {}
      }

      // Star Fade Wave animation tick
      if (starFadeWaveRef.current.active) {
        starFadeWaveRef.current.elapsed += dt;
        if (starFadeWaveRef.current.elapsed >= starFadeWaveRef.current.duration) {
          starFadeWaveRef.current.active = false;
        }
      }

      // 7. 3D TORUS STARS SIMULATION (THE RING)
      const stars = starsRef.current;

      // User inertial spin decay when released ("Потім інерційно продовжує рух сповільнюється і повертається до свого звичайного обертання")
      if (!spin.isDragging && Math.abs(spin.angularVelocity) > 0.001) {
        spin.userOffsetAngle += spin.angularVelocity * dt;
        // Smooth exponential friction
        spin.angularVelocity *= Math.pow(0.91, dt * 60);
        if (Math.abs(spin.angularVelocity) < 0.002) {
          spin.angularVelocity = 0;
        }
      }

      const symmetryFactor = freeze.symmetryFactor;
      const focal = 180;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // В режимі першого діалогу або під час завмирання/симетрії кільце не обертається
        const starSpeed = (isFirstDialogueActive || symmetryFactor > 0.001) ? 0 : (isConstellationMode ? 1.0 : effectiveSpeedFactor);
        s.theta += s.orbitSpeed * dt * starSpeed;
        s.phi += s.phiSpeed * dt * starSpeed;
        s.rotation += s.rotSpeed * dt * starSpeed;

        const effectiveTheta = s.theta + spin.userOffsetAngle;
        const targetSymTheta = s.symmetricTargetTheta !== undefined ? s.symmetricTargetTheta : effectiveTheta;
        const targetSymR = s.symmetricTargetR !== undefined ? s.symmetricTargetR : s.ringRadius;

        // Зірки плавно займають симетричні позиції з однаковими проміжками
        let blendedTheta = effectiveTheta + (targetSymTheta - effectiveTheta) * symmetryFactor;

        // Major ring radius + lung inhalation expansion - dialogue contraction
        const currentMajorR = s.ringRadius - dialogueContraction + breathe + holdRadiusExpand;
        let blendedMajorR = currentMajorR + (targetSymR - currentMajorR) * symmetryFactor;

        // Torus tube thickness swells in sync with breathing and tightens during dialogue; drops to 0 during symmetry
        const tubeBreath = isDialogue ? (1.0 + 0.25 * Math.sin(phys.breathePhase)) : 1.0;
        const currentTubeR = s.tubeRadius * (1.0 - dialogueFactor * 0.25) * (tubeBreath + holdTubeExpand) * (1.0 - symmetryFactor * 0.95);
        let blendedTubeR = currentTubeR;
        const currentPhi = s.phi * (1.0 - symmetryFactor * 0.95);

        // Torus parametric coordinates with interactive user spin and symmetry alignment
        const torusX = (blendedMajorR + blendedTubeR * Math.cos(currentPhi)) * Math.cos(blendedTheta);
        const torusY = (blendedMajorR + blendedTubeR * Math.cos(currentPhi)) * Math.sin(blendedTheta);
        const torusZ = blendedTubeR * Math.sin(currentPhi);

        // 3D rotation & inclination tilt for ring orbit
        const rotX_x = torusX;
        const rotX_y = torusY * cosTiltX - torusZ * sinTiltX;
        const rotX_z = torusY * sinTiltX + torusZ * cosTiltX;

        let finalTargetX = rotX_x * cosTiltY + rotX_z * sinTiltY;
        let finalTargetY = rotX_y;
        let finalTargetZ = -rotX_x * sinTiltY + rotX_z * cosTiltY;

        // Flying to the Center of the Ring for Constellation Members & returning back
        if (s.isConstellationMember && constel.active && constel.currentConstellation && s.centerTargetX !== undefined) {
          let morphProgress = 0;
          if (constel.phase === 'emerging') {
            const t = Math.min(1.0, constel.phaseElapsed / 2.0);
            morphProgress = t * t * (3 - 2 * t); // smooth flight from ring into the center
          } else if (constel.phase === 'holding' || constel.phase === 'locked') {
            morphProgress = 1.0; // held suspended in the center
          } else if (constel.phase === 'returning') {
            const t = Math.min(1.0, constel.phaseElapsed / 2.0);
            morphProgress = 1.0 - (t * t * (3 - 2 * t)); // smooth return flight back out to the ring
          }

          if (morphProgress > 0.001) {
            // Target coordinates centered directly in the heart of the ring void (0, 0, 0)
            const cX = s.centerTargetX || 0;
            const cY = s.centerTargetY || 0;
            const cZ = (s.centerTargetZ || 0) + Math.sin(simTime * 2.2 + (s.constellationVertexIndex || 0)) * 1.5;

            // 3D tilt applied to the central constellation
            const centerRotX = cX * cosTiltY + (cY * sinTiltX + cZ * cosTiltX) * sinTiltY;
            const centerRotY = cY * cosTiltX - cZ * sinTiltX;
            const centerRotZ = -cX * sinTiltY + (cY * sinTiltX + cZ * cosTiltX) * cosTiltY;

            // Smooth interpolation between ring orbit and center position
            finalTargetX = finalTargetX + (centerRotX - finalTargetX) * morphProgress;
            finalTargetY = finalTargetY + (centerRotY - finalTargetY) * morphProgress;
            finalTargetZ = finalTargetZ + (centerRotZ - finalTargetZ) * morphProgress;

            // Constellation stars brighten and sparkle with pure diamond radiance in the center
            s.flareIntensity = Math.max(s.flareIntensity, morphProgress * 1.8);
          }
        }

        // Хаотичне дрижання на місці під час утримання нерухомої структури
        if (freeze.tremorIntensity > 0.001) {
          const t = simTime;
          const idSeed = s.id * 19.371;
          const jx = (Math.sin(t * 44.0 + idSeed) * 0.62 + Math.sin(t * 82.0 + idSeed * 1.73) * 0.38) * freeze.tremorIntensity * 2.1;
          const jy = (Math.cos(t * 48.0 + idSeed * 1.31) * 0.62 + Math.cos(t * 88.0 + idSeed * 2.19) * 0.38) * freeze.tremorIntensity * 2.1;
          const jz = (Math.sin(t * 56.0 + idSeed * 0.93) * 0.6 + Math.cos(t * 96.0 + idSeed * 1.45) * 0.4) * freeze.tremorIntensity * 1.4;

          finalTargetX += jx;
          finalTargetY += jy;
          finalTargetZ += jz;
        }

        s.ox = finalTargetX;
        s.oy = finalTargetY;
        s.oz = finalTargetZ;

        // Soft-body spring-damper integration
        const fx = (s.ox - s.x) * s.springK;
        const fy = (s.oy - s.y) * s.springK;
        const fz = (s.oz - s.z) * s.springK;

        s.vx = (s.vx + fx / s.mass) * s.damping;
        s.vy = (s.vy + fy / s.mass) * s.damping;
        s.vz = (s.vz + fz / s.mass) * s.damping;

        // Pointer fluid momentum
        if (ptr.isDown && ptr.active) {
          const ptrDist = Math.hypot((centerX + s.x) - ptr.x, (centerY + s.y) - ptr.y);
          if (ptrDist < 55) {
            const pull = (1 - ptrDist / 55) * 0.42;
            s.vx += ptr.vx * pull * 0.15;
            s.vy += ptr.vy * pull * 0.15;
          }
        }

        s.x += s.vx;
        s.y += s.vy;
        s.z += s.vz;

        // Center Void barrier: adjusts with dialogue contraction (bypassed for constellation members in center)
        if (!s.isConstellationMember) {
          const minCenterVoid = Math.max(20, 37 - dialogueContraction);
          const distFromCenter = Math.hypot(s.x, s.y);
          if (distFromCenter < minCenterVoid) {
            const ang = Math.atan2(s.y, s.x);
            s.x = Math.cos(ang) * minCenterVoid;
            s.y = Math.sin(ang) * minCenterVoid;
            s.vx = 0;
            s.vy = 0;
          }
        }

        // Precompute projected screen coordinates for star and constellation drawing
        const depthScale = focal / (focal + s.z);
        s.projScreenX = centerX + s.x * depthScale;
        s.projScreenY = centerY + s.y * depthScale;
        s.projDepthScale = depthScale;

        // Flare decay & angle-based excitation
        s.flareIntensity = Math.max(0, s.flareIntensity - 2.5 * dt);

        if (flares.length > 0) {
          const normalizedTheta = (s.theta % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
          for (let f = 0; f < flares.length; f++) {
            const fl = flares[f];
            let angleDiff = Math.abs(normalizedTheta - fl.angle);
            if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
            if (angleDiff < fl.spread) {
              const flareEffect = fl.intensity * (1.0 - angleDiff / fl.spread);
              s.flareIntensity = Math.max(s.flareIntensity, flareEffect);
            }
          }
        }
      }

      // Sort stars by depth
      const sortedStars = [...stars].sort((a, b) => a.z - b.z);

      // 8b. DRAW CELESTIAL NEBULA SHROUD (skipped during constellation mode to prevent GPU/CPU spikes)
      if (!isConstellationMode && dialogueFactor > 0.05) {
        const nebulaFactor = (0.32 + 0.68 * dialogueFactor) * (mc.auraIntensity ? Math.min(1.15, mc.auraIntensity) : 1.0);
        drawRingNebulaShroud(
          ctx,
          centerX,
          centerY,
          nebulaFactor,
          simTime,
          phys.tiltX,
          phys.breathePhase,
          currentRingRadius,
          nebulaMotesRef.current,
          dt,
          mc.currentR,
          mc.currentG,
          mc.currentB
        );
      }

      // 9. DRAW AUTHENTIC REAL NIGHT SKY CONSTELLATION FILAMENTS & DIAMOND FLARES
      // Formed organically right on the living ring stars
      if (constel.active && constel.currentConstellation && constel.lineAlpha > 0.02) {
        ctx.save();
        const con = constel.currentConstellation;

        // Gather screen positions of all participating member stars
        const vertexPoints: { [vIdx: number]: { x: number; y: number; star: (typeof con.stars)[0]; ringStar: RingStar3D } } = {};
        for (let i = 0; i < stars.length; i++) {
          const st = stars[i];
          if (st.isConstellationMember && st.constellationVertexIndex !== undefined) {
            const vIdx = st.constellationVertexIndex;
            const conStar = con.stars[vIdx];
            if (conStar && st.projScreenX !== undefined && st.projScreenY !== undefined) {
              vertexPoints[vIdx] = {
                x: st.projScreenX,
                y: st.projScreenY,
                star: conStar,
                ringStar: st,
              };
            }
          }
        }

        // Progressive line drawing during emergence & gentle dissolve on return
        let lineDrawFactor = 1.0;
        if (constel.phase === 'emerging') {
          const t = Math.max(0, (constel.phaseElapsed - 0.25) / 1.5);
          lineDrawFactor = Math.min(1.0, t * t * (3 - 2 * t));
        } else if (constel.phase === 'returning') {
          lineDrawFactor = Math.max(0, 1.0 - constel.phaseElapsed / 1.8);
        }

        // Draw delicate luminous stardust filament lines connecting the ring stars
        if (lineDrawFactor > 0.01) {
          const lineAlpha = Math.min(0.48, constel.lineAlpha * lineDrawFactor * 0.45);
          ctx.strokeStyle = `rgba(220, 245, 255, ${lineAlpha})`;
          ctx.lineWidth = 0.65;
          ctx.beginPath();

          con.lines.forEach(([iA, iB]) => {
            const pA = vertexPoints[iA];
            const pB = vertexPoints[iB];
            if (pA && pB) {
              const curX = pA.x + (pB.x - pA.x) * Math.min(1.0, lineDrawFactor * 1.15);
              const curY = pA.y + (pB.y - pA.y) * Math.min(1.0, lineDrawFactor * 1.15);
              ctx.moveTo(pA.x, pA.y);
              ctx.lineTo(curX, curY);
            }
          });
          ctx.stroke();

          // Subtle celestial stardust nodes at each vertex on the ring
          Object.values(vertexPoints).forEach(({ x, y, star, ringStar }) => {
            const nodeAlpha = Math.min(1.0, constel.lineAlpha * (1.1 + 0.3 * Math.sin(simTime * 4.0 + (star.x || 0))));
            const nodeR = Math.max(2.8, (star.brightness || 1.8) * 1.6 * (ringStar.projDepthScale || 1.0));

            ctx.save();
            ctx.fillStyle = star.color || '#ffffff';
            ctx.shadowColor = '#67e8f9';
            ctx.shadowBlur = 10 * constel.lineAlpha;
            ctx.globalAlpha = nodeAlpha;

            // 4-pointed diamond star core
            ctx.beginPath();
            ctx.moveTo(x, y - nodeR);
            ctx.lineTo(x + nodeR * 0.32, y);
            ctx.lineTo(x, y + nodeR);
            ctx.lineTo(x - nodeR * 0.32, y);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(x - nodeR, y);
            ctx.lineTo(x, y + nodeR * 0.32);
            ctx.lineTo(x + nodeR, y);
            ctx.lineTo(x, y - nodeR * 0.32);
            ctx.closePath();
            ctx.fill();

            // Radiant pure white center pinpoint
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = Math.min(1.0, nodeAlpha * 1.3);
            ctx.beginPath();
            ctx.arc(x, y, Math.max(1.0, nodeR * 0.45), 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          });
        }

        ctx.restore();
      }

      // 10. UNIFIED CO-DEPTH RENDER FOR ALL QUALITY STARS (✦) (Making spiral arms part of the unified ring particle system)
      // У режимі сузір'я (перед кліком): звичайні зірки кільця дещо тускніють, а саме сузір'я сяє найяскравіше
      const constelDimFactor = constel.active ? Math.max(0.32, 1.0 - constel.lineAlpha * 0.68) : 1.0;

      // Draw active arm connection filaments BEFORE any stars to keep lines underneath stars
      for (let aIdx = 0; aIdx < arms.length; aIdx++) {
        const arm = arms[aIdx];
        if (arm.stars.length > 1) {
          ctx.save();
          const sortedArmStars = [...arm.stars].sort((a, b) => a.distAlongArm - b.distAlongArm);
          ctx.beginPath();
          for (let si = 0; si < sortedArmStars.length; si++) {
            const s = sortedArmStars[si];
            if (si === 0) {
              ctx.moveTo(s.projScreenX, s.projScreenY);
            } else {
              ctx.lineTo(s.projScreenX, s.projScreenY);
            }
          }
          ctx.strokeStyle = `rgba(${mc.currentR}, ${mc.currentG}, ${mc.currentB}, 0.15)`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
          ctx.restore();
        }
      }


      // Collect both ring stars and spiral arm stars into a single list
      interface UnifiedStarDrawItem {
        z: number;
        screenX: number;
        screenY: number;
        renderRadius: number;
        starFill: string;
        starGlow: string;
        starAlpha: number;
        rotation: number;
        layer: number;
        twinkle: number;
      }

      const unifiedStarsToDraw: UnifiedStarDrawItem[] = [];

      // 10a. Add Ring Stars to the list
      for (let i = 0; i < sortedStars.length; i++) {
        const s = sortedStars[i];

        // Ensure nothing in the contracted center void is drawn (except constellation members)
        const minDrawRadius = Math.max(18, 36.5 - dialogueContraction);
        if (!s.isConstellationMember && Math.hypot(s.x, s.y) <= minDrawRadius) continue;

        const depthScale = focal / (focal + s.z);
        const screenX = centerX + s.x * depthScale;
        const screenY = centerY + s.y * depthScale;

        // Scintillation twinkling
        const twinkleFreq = s.pulseSpeed * 1.2;
        const twinkle = 0.5 + 0.5 * Math.sin(simTime * twinkleFreq + s.pulsePhase);

        // Star Fade Wave multiplier (stars gradually fade out in a circle and light up again on dialogue response)
        let waveAlphaFactor = 1.0;
        if (starFadeWaveRef.current.active) {
          const rawP = Math.min(1.0, starFadeWaveRef.current.elapsed / starFadeWaveRef.current.duration);
          // Smooth ease-in-out curve for overall wave progression
          const p = 0.5 - 0.5 * Math.cos(rawP * Math.PI);
          const starAngle = ((s.theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

          if (p <= 0.48) {
            // Fading out in a clockwise circular sweep
            const sweep = (p / 0.48) * (Math.PI * 2 + 1.2);
            const delta = starAngle - (sweep - 0.6);
            if (delta <= -0.6) {
              waveAlphaFactor = 0.08;
            } else if (delta >= 0.6) {
              waveAlphaFactor = 1.0;
            } else {
              // Smooth cosine transition between 1.0 and 0.08
              const t = (delta + 0.6) / 1.2;
              waveAlphaFactor = 0.08 + 0.92 * (0.5 - 0.5 * Math.cos(t * Math.PI));
            }
          } else if (p <= 0.54) {
            // Calm rest state at the nadir of circular fading
            waveAlphaFactor = 0.08;
          } else {
            // Rekindling in a clockwise circular dawn sweep
            const pIn = (p - 0.54) / 0.46;
            const sweep = pIn * (Math.PI * 2 + 1.2);
            const delta = starAngle - (sweep - 0.6);
            if (delta <= -0.6) {
              waveAlphaFactor = 1.0;
            } else if (delta >= 0.6) {
              waveAlphaFactor = 0.08;
            } else {
              // Smooth cosine transition between 0.08 and 1.0
              const t = (delta + 0.6) / 1.2;
              waveAlphaFactor = 1.0 - 0.92 * (0.5 - 0.5 * Math.cos(t * Math.PI));
            }
          }
        }

        // Alpha calculation with constellation dimming factor
        let starAlpha = (s.baseAlpha * (0.65 + 0.35 * twinkle) + s.flareIntensity * 0.6) * depthScale * mc.starAlphaMultiplier * waveAlphaFactor * constelDimFactor;
        // In dialogue mode, stars' starlight breathes gently in sync with respiration; and swells with lung inhalation
        const dialogueAlphaBreath = isDialogue ? (0.92 + 0.22 * Math.sin(phys.breathePhase)) : 1.0;
        starAlpha = Math.min(1.0, Math.max(0.08, starAlpha * dialogueAlphaBreath * (1.0 + holdAlphaBoost)));

        // Render radius
        const renderRadius = Math.max(
          0.8,
          s.radius * depthScale * mc.starScaleMultiplier * (1 + s.flareIntensity * 0.4) * (1 + inhaleEase * 0.22)
        );

        // Spectral mood tinting (no red pulsation!)
        let starFill = s.spectralColor;
        let starGlow = s.glowColor;

        if (freeze.symmetryFactor > 0.05) {
          starFill = '#ffffff';
          starGlow = '#67e8f9'; // Sacred crystalline diamond starlight during symmetry
        } else if (mc.moodType === 'luminous') {
          starFill = '#ffffff';
          starGlow = '#38bdf8'; // Radiant cyan diamond halo
        } else if (mc.moodType === 'calm_soft') {
          starFill = '#f0f9ff';
          starGlow = '#7dd3fc'; // Soft soothing cyan/sapphire
        } else if (s.flareIntensity > 0.1) {
          starFill = '#ffffff';
          starGlow = '#93c5fd';
        }

        unifiedStarsToDraw.push({
          z: s.z,
          screenX,
          screenY,
          renderRadius,
          starFill,
          starGlow,
          starAlpha,
          rotation: s.rotation,
          layer: s.layer,
          twinkle
        });
      }

      // 10b. Add Galactic Spiral Arm Stars to the list (so they are depth-sorted perfectly together!)
      for (let aIdx = 0; aIdx < arms.length; aIdx++) {
        const arm = arms[aIdx];
        for (let k = 0; k < arm.stars.length; k++) {
          const as = arm.stars[k];
          const depthScale = focal / (focal + as.projZ);
          const twinkleFreq = as.pulseSpeed * 1.2;
          const twinkle = 0.5 + 0.5 * Math.sin(simTime * twinkleFreq + as.twinklePhase);
          const renderRadius = Math.max(0.75, as.radius * depthScale * (0.85 + 0.25 * twinkle));
          const starAlpha = Math.min(1.0, as.alpha * depthScale * (0.75 + 0.25 * twinkle));

          // Spectral mood tinting (exactly matching ring stars!)
          let starFill = as.spectralColor;
          let starGlow = as.glowColor;

          if (mc.moodType === 'luminous') {
            starFill = '#ffffff';
            starGlow = '#38bdf8'; // Radiant cyan diamond halo
          } else if (mc.moodType === 'calm_soft') {
            starFill = '#f0f9ff';
            starGlow = '#7dd3fc'; // Soft soothing cyan/sapphire
          }

          unifiedStarsToDraw.push({
            z: as.projZ,
            screenX: as.projScreenX,
            screenY: as.projScreenY,
            renderRadius,
            starFill,
            starGlow,
            starAlpha,
            rotation: as.rotation,
            layer: as.layer,
            twinkle
          });
        }
      }

      // 10c. SORT ALL COMBINED STARS BY 3D DEPTH (Z coordinate) for perfect realism and layout integration!
      unifiedStarsToDraw.sort((a, b) => a.z - b.z);

      // 10d. DRAW ALL STARS IN UNIFIED PASS
      for (let i = 0; i < unifiedStarsToDraw.length; i++) {
        const item = unifiedStarsToDraw[i];
        drawCosmicStar(
          ctx,
          item.screenX,
          item.screenY,
          item.renderRadius,
          item.starFill,
          item.starGlow,
          item.starAlpha,
          item.rotation,
          item.layer,
          item.twinkle
        );
      }

      // Update & render sparkler spark particles (бенгальський вогник)
      const sparkParticles = sparklerParticlesRef.current;
      if (sparkParticles.length > 0) {
        ctx.save();
        ctx.translate(centerX, centerY);
        for (let sp = sparkParticles.length - 1; sp >= 0; sp--) {
          const pt = sparkParticles[sp];
          pt.life += dt;
          if (pt.life >= pt.maxLife) {
            sparkParticles.splice(sp, 1);
            continue;
          }
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
          pt.vx *= Math.pow(0.88, dt * 60);
          pt.vy *= Math.pow(0.88, dt * 60);

          const progress = pt.life / pt.maxLife;
          const currentAlpha = Math.max(0, (1.0 - progress) * (0.8 + 0.2 * Math.sin(simTime * pt.twinkleSpeed)));
          
          if (currentAlpha <= 0.01) continue;

          ctx.save();
          ctx.globalAlpha = currentAlpha;
          ctx.fillStyle = pt.color;
          ctx.shadowColor = pt.glowColor;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.radius * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
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

    const handleVisibility = () => {
      if (document.hidden) {
        lastTime = performance.now();
      } else if (isRunning) {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    const handleEcoChange = () => {
      if (isRunning) {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('perf-boost-change', handleEcoChange);
    window.addEventListener('auto-eco-config-change', handleEcoChange);
    window.addEventListener('storage', handleEcoChange);

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('perf-boost-change', handleEcoChange);
      window.removeEventListener('auto-eco-config-change', handleEcoChange);
      window.removeEventListener('storage', handleEcoChange);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // POINTER & TOUCH INTERACTIONS
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isLongPressTriggeredRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };

    const hi = holdInhaleRef.current;
    hi.isHolding = true;
    hi.progress = 0;
    hi.triggered = false;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    // Track circular touch/mouse spin position relative to center of ring
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const clickAngle = Math.atan2(e.clientY - rect.top - centerY, e.clientX - rect.left - centerX);

    spinRef.current.isDragging = true;
    spinRef.current.lastAngle = clickAngle;

    pointerRef.current = {
      x: px,
      y: py,
      vx: 0,
      vy: 0,
      isDown: true,
      active: true,
    };
  }, []);

  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    pointerRef.current.x = e.clientX - rect.left;
    pointerRef.current.y = e.clientY - rect.top;
    pointerRef.current.active = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (!pointerRef.current.isDown) {
      pointerRef.current.active = false;
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const oldX = pointerRef.current.x;
    const oldY = pointerRef.current.y;
    pointerRef.current.vx = (px - oldX) * 0.4;
    pointerRef.current.vy = (py - oldY) * 0.4;
    pointerRef.current.x = px;
    pointerRef.current.y = py;
    pointerRef.current.active = true;

    if (!pointerRef.current.isDown) return;

    if (dragStartRef.current) {
      const dx = Math.abs(e.clientX - dragStartRef.current.x);
      const dy = Math.abs(e.clientY - dragStartRef.current.y);
      if (dx > 14 || dy > 14) {
        holdInhaleRef.current.isHolding = false;
      }
    }

    // Circular spin dragging: calculate angular delta and velocity
    if (spinRef.current.isDragging) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const currentAngle = Math.atan2(e.clientY - rect.top - centerY, e.clientX - rect.left - centerX);
      let deltaAngle = currentAngle - spinRef.current.lastAngle;

      if (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
      if (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;

      spinRef.current.userOffsetAngle += deltaAngle;
      spinRef.current.angularVelocity = deltaAngle * 28; // convert delta to angular velocity rad/s
      spinRef.current.lastAngle = currentAngle;
    }
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    spinRef.current.isDragging = false;
    const hi = holdInhaleRef.current;
    const wasTriggered = hi.triggered;
    hi.isHolding = false;

    pointerRef.current.isDown = false;
    pointerRef.current.active = false;

    if (dragStartRef.current && !wasTriggered) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 30) {
        if (dx > 35 && Math.abs(dy) < 45) {
          if (onSwipeRight) onSwipeRight();
          if (onSwipeAny) onSwipeAny();
        } else {
          if (onSwipeAny) onSwipeAny();
        }
      }
    }

    dragStartRef.current = null;
  }, [onSwipeAny, onSwipeRight]);

  const handlePointerCancel = useCallback(() => {
    spinRef.current.isDragging = false;
    holdInhaleRef.current.isHolding = false;
    pointerRef.current.isDown = false;
    pointerRef.current.active = false;
    dragStartRef.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClick={(e) => {
        if (holdInhaleRef.current.triggered) {
          e.stopPropagation();
          return;
        }
        if (onClick) onClick(e);
      }}
      className="relative flex items-center justify-center cursor-pointer select-none touch-none w-[150px] h-[150px] overflow-visible"
      style={{
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
      }}
      title="Космічне кільце зірок (клікніть для діалогу / затисніть для налаштувань)"
    >
      <canvas
        ref={canvasRef}
        width={260 * (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)}
        height={260 * (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)}
        style={{
          width: 260,
          height: 260,
        }}
        className="pointer-events-none drop-shadow-[0_0_16px_rgba(96,165,250,0.35)] absolute -left-[55px] -top-[55px]"
      />
    </div>
  );
};
