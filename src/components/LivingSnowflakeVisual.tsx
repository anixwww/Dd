import React, { useRef, useEffect, useCallback } from 'react';
import { VisualEnergyMode } from './AnalyzerTip';
import { hslToRgb } from './LivingFireVisual';

export interface LivingSnowflakeVisualProps {
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

interface DynamicIceSparkle {
  id: number;
  rayIdx: number;       // Which of the 6 rays it belongs to
  branchDist: number;   // Distance along ray
  branchSide: number;   // -1 left, 0 stem, 1 right
  vx: number;
  vy: number;
  age: number;
  lifespan: number;
  size: number;
  maxAlpha: number;
  glintPhase: number;
  glintSpeed: number;
  glintSize: number;
  shape: 'diamond' | 'star' | 'circle';
}

// Weather particle inside the aura sphere
interface WeatherParticle {
  x: number;            // Relative to sphere center
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  flutterPhase: number;
  flutterSpeed: number;
  swirlRadius: number;
  isStreak?: boolean;
}

// Snow spray particle thrown off by centrifugal force
interface SnowSprayParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotSpeed: number;
}

// Mystical Fog puff swirling around the snowflake & aura
interface FogPuff {
  angle: number;
  baseRadius: number;
  orbitSpeed: number;
  cloudSize: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  driftX: number;
  driftY: number;
}

export const LivingSnowflakeVisual: React.FC<LivingSnowflakeVisualProps> = ({
  mode,
  hasAdvice = false,
  isThinking = false,
  isDialogueActive = false,
  onClick,
  onSwipeRight,
  onLongPress,
  blurAmount = 0,
  calmHue = 205,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const calmHueRef = useRef(calmHue);
  calmHueRef.current = calmHue;

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

  // Physical stretch & spring
  const stretchPhysicsRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0,
    angle: 0,
    pullMagnitude: 0,
    shockWave: 0,
  });

  // Rotation choreography state machine
  // Phases:
  // 0: SLOW_CW (повільно крутиться за годинниковою)
  // 1: ACCEL_CW (розганяється)
  // 2: DECEL_CW (сповільнюється)
  // 3: FREEZE (завмирає, нерухомий кришталь)
  // 4: REVERSE_ACCEL_CCW (крутиться в інший бік, пришвидшується)
  // 5: DECEL_CCW (сповільнюється)
  // 6: SHARP_SPIN_BURST (різкий оберт зі скиданням снігу)
  // 7: EASE_TO_CALM (плавний перехід до спокійного)
  const rotationStateRef = useRef({
    phase: 0,
    phaseTimer: 0,
    phaseDuration: 180, // frames
    angle: 0,
    angularVelocity: 0.003,
    targetVelocity: 0.003,
    isBursting: false,
  });

  // Snow accumulation on facets (наліплювання білого снігу)
  const snowAccumulationRef = useRef({
    amount: 0.2, // 0 = clean ice, 1 = heavy fluffy snow caps
    growthRate: 0.0006,
  });

  // Weather state machine inside aura:
  // 'blizzard' (хуртовина, що затихає) -> 'gentle' (спокійний снігопад) -> 'clear' (відсутність снігопаду)
  const weatherStateRef = useRef<{
    mode: 'blizzard' | 'gentle' | 'clear';
    timer: number;
    duration: number;
    windStrength: number; // 1.0 -> 0.0 during blizzard
  }>({
    mode: 'blizzard',
    timer: 0,
    duration: 360,
    windStrength: 1.0,
  });

  // Centrifugal spray particles (скинутий сніг при різкому оберті)
  const snowSprayRef = useRef<SnowSprayParticle[]>([]);

  // Weather particles pool
  const weatherParticlesRef = useRef<WeatherParticle[]>([]);

  // Mystical fog puffs around the snowflake & aura
  const fogPuffsRef = useRef<FogPuff[]>([]);

  // Dynamic glitter crystals
  const dynamicSparksRef = useRef<DynamicIceSparkle[]>([]);

  // Sentient dialogue tracking
  const dialogueSectorsRef = useRef({
    activeRayIdx: 0,
    timer: 0,
    flashIntensity: 0,
    speechPulse: 0,
  });

  // Color lerp
  const colorLerpRef = useRef({
    currentRatio: 0,
    targetRatio: 0,
    modeTargetR: 56,
    modeTargetG: 189,
    modeTargetB: 248,
  });

  // Function to trigger sharp centrifugal snow shed
  const triggerSnowShed = useCallback((forceMultiplier = 1.0) => {
    const currentSnow = snowAccumulationRef.current.amount;
    if (currentSnow < 0.05) return;

    // Reset accumulated snow
    snowAccumulationRef.current.amount = 0;

    // Spawn flying centrifugal spray particles
    const currentAngle = rotationStateRef.current.angle;
    const sprayCount = Math.floor((25 + Math.random() * 20) * currentSnow);
    const newSpray: SnowSprayParticle[] = [];

    const baseRadius = 28;

    for (let i = 0; i < sprayCount; i++) {
      const ray = Math.floor(Math.random() * 6);
      const rayAngle = currentAngle + (ray * Math.PI) / 3;
      const dist = 8 + Math.random() * baseRadius;

      const px = Math.cos(rayAngle) * dist;
      const py = Math.sin(rayAngle) * dist;

      // Tangential velocity from rotation + radial outward centrifugal push
      const spinDir = rotationStateRef.current.angularVelocity >= 0 ? 1 : -1;
      const tangX = -Math.sin(rayAngle) * spinDir * (2.5 + Math.random() * 3.5);
      const tangY = Math.cos(rayAngle) * spinDir * (2.5 + Math.random() * 3.5);
      const radX = Math.cos(rayAngle) * (1.8 + Math.random() * 3.2);
      const radY = Math.sin(rayAngle) * (1.8 + Math.random() * 3.2);

      newSpray.push({
        x: px,
        y: py,
        vx: (tangX + radX) * forceMultiplier,
        vy: (tangY + radY) * forceMultiplier,
        size: 1.2 + Math.random() * 2.8,
        alpha: 0.95,
        life: 0,
        maxLife: Math.floor(35 + Math.random() * 30),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    snowSprayRef.current = [...snowSprayRef.current, ...newSpray];
  }, []);

  // Initialize Mystical Fog Puffs around the snowflake
  useEffect(() => {
    const puffs: FogPuff[] = [];
    const count = 30;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const baseRadius = 32 + Math.random() * 32;
      const cloudSize = 18 + Math.random() * 22;
      puffs.push({
        angle,
        baseRadius,
        orbitSpeed: (0.002 + Math.random() * 0.005) * (Math.random() < 0.5 ? 1 : -1),
        cloudSize,
        baseAlpha: 0.12 + Math.random() * 0.16,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.025,
        driftX: (Math.random() - 0.5) * 6,
        driftY: (Math.random() - 0.5) * 4,
      });
    }
    fogPuffsRef.current = puffs;
  }, []);

  // Initialize Weather Particles inside Aura
  useEffect(() => {
    const particles: WeatherParticle[] = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 46;
      particles.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 0.4 + Math.random() * 0.8,
        size: 0.8 + Math.random() * 1.6,
        alpha: 0.3 + Math.random() * 0.6,
        flutterPhase: Math.random() * Math.PI * 2,
        flutterSpeed: 0.03 + Math.random() * 0.05,
        swirlRadius: 10 + Math.random() * 32,
        isStreak: Math.random() < 0.35,
      });
    }
    weatherParticlesRef.current = particles;
  }, []);

  // Initialize Dynamic Sparkles
  useEffect(() => {
    const sparkles: DynamicIceSparkle[] = [];
    for (let i = 0; i < 55; i++) {
      sparkles.push({
        id: i,
        rayIdx: Math.floor(Math.random() * 6),
        branchDist: 7 + Math.random() * 25,
        branchSide: Math.random() < 0.35 ? 0 : Math.random() < 0.65 ? -1 : 1,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        age: Math.floor(Math.random() * 80),
        lifespan: Math.floor(50 + Math.random() * 60),
        size: 0.9 + Math.random() * 1.4,
        maxAlpha: 0.85 + Math.random() * 0.15,
        glintPhase: Math.random() * Math.PI * 2,
        glintSpeed: 0.04 + Math.random() * 0.08,
        glintSize: 2.2 + Math.random() * 3.0,
        shape: Math.random() < 0.55 ? 'diamond' : 'star',
      });
    }
    dynamicSparksRef.current = sparkles;
  }, []);

  // Handle color mode target
  useEffect(() => {
    if (mode === 'gold-flash') {
      colorLerpRef.current.targetRatio = 1;
      colorLerpRef.current.modeTargetR = 251;
      colorLerpRef.current.modeTargetG = 191;
      colorLerpRef.current.modeTargetB = 36;
    } else if (mode === 'warm') {
      colorLerpRef.current.targetRatio = 1;
      colorLerpRef.current.modeTargetR = 245;
      colorLerpRef.current.modeTargetG = 158;
      colorLerpRef.current.modeTargetB = 11;
    } else if (mode === 'red-flash' || mode === 'negative' || hasAdvice) {
      colorLerpRef.current.targetRatio = 1;
      colorLerpRef.current.modeTargetR = 244;
      colorLerpRef.current.modeTargetG = 63;
      colorLerpRef.current.modeTargetB = 94;
    } else {
      colorLerpRef.current.targetRatio = 0;
    }
  }, [mode, hasAdvice]);

  // Main Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    let time = 0;

    const render = () => {
      if (!isRunning) return;
      time += 1;

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

      const centerX = logicalWidth / 2;
      const centerY = logicalHeight / 2;
      const auraRadius = 54;

      // 1. ROTATION CHOREOGRAPHY STATE MACHINE
      // 0: SLOW_CW -> 1: ACCEL_CW -> 2: DECEL_CW -> 3: FREEZE ->
      // 4: REVERSE_ACCEL_CCW -> 5: DECEL_CCW -> 6: SHARP_SPIN_BURST -> 7: EASE_TO_CALM
      const rot = rotationStateRef.current;
      rot.phaseTimer += 1;

      if (rot.phaseTimer >= rot.phaseDuration) {
        rot.phaseTimer = 0;
        rot.phase = (rot.phase + 1) % 8;

        switch (rot.phase) {
          case 0: // SLOW_CW: повільно
            rot.phaseDuration = 180 + Math.floor(Math.random() * 60);
            rot.targetVelocity = 0.003;
            break;
          case 1: // ACCEL_CW: розганяється
            rot.phaseDuration = 120;
            rot.targetVelocity = 0.024;
            break;
          case 2: // DECEL_CW: сповільнюється
            rot.phaseDuration = 110;
            rot.targetVelocity = 0.001;
            break;
          case 3: // FREEZE: завмирає
            rot.phaseDuration = 90 + Math.floor(Math.random() * 40);
            rot.targetVelocity = 0.000;
            break;
          case 4: // REVERSE_ACCEL_CCW: в інший бік, пришвидшується
            rot.phaseDuration = 140;
            rot.targetVelocity = -0.022;
            break;
          case 5: // DECEL_CCW: сповільнюється
            rot.phaseDuration = 110;
            rot.targetVelocity = -0.002;
            break;
          case 6: // SHARP_SPIN_BURST: різкий оберт зі скиданням снігу!
            rot.phaseDuration = 65;
            rot.targetVelocity = 0.085;
            // Centrifugal snow burst!
            triggerSnowShed(1.2);
            break;
          case 7: // EASE_TO_CALM
            rot.phaseDuration = 80;
            rot.targetVelocity = 0.003;
            break;
        }
      }

      // Smooth interpolation of angular velocity
      const accelRate = rot.phase === 6 ? 0.12 : 0.04;
      rot.angularVelocity += (rot.targetVelocity - rot.angularVelocity) * accelRate;
      rot.angle += rot.angularVelocity;

      // 2. WEATHER CYCLE INSIDE AURA
      // 'blizzard' -> 'gentle' -> 'clear'
      const wth = weatherStateRef.current;
      wth.timer += 1;

      if (wth.timer >= wth.duration) {
        wth.timer = 0;
        if (wth.mode === 'blizzard') {
          wth.mode = 'gentle';
          wth.duration = 420; // ~7s gentle snow
          wth.windStrength = 0;
        } else if (wth.mode === 'gentle') {
          wth.mode = 'clear';
          wth.duration = 320; // ~5s clear stillness
          wth.windStrength = 0;
        } else {
          wth.mode = 'blizzard';
          wth.duration = 400; // ~6.5s blizzard tapering off
          wth.windStrength = 1.0;
        }
      }

      // During blizzard, wind strength diminishes gradually over time
      if (wth.mode === 'blizzard') {
        const progress = wth.timer / wth.duration;
        wth.windStrength = Math.max(0.1, 1.0 - progress * 0.85);
      }

      // 3. SNOW ACCUMULATION ON BRANCHES
      // Builds up during blizzard and gentle snowfall when not in sharp spin
      const snAcc = snowAccumulationRef.current;
      if (rot.phase !== 6 && Math.abs(rot.angularVelocity) < 0.035) {
        if (wth.mode === 'blizzard') {
          snAcc.amount = Math.min(1.0, snAcc.amount + snAcc.growthRate * 1.8);
        } else if (wth.mode === 'gentle') {
          snAcc.amount = Math.min(1.0, snAcc.amount + snAcc.growthRate * 1.0);
        }
      }

      // 4. CIRCADIAN DAILY FACTOR
      const now = new Date();
      const currentH = now.getHours() + now.getMinutes() / 60;
      let circadianFactor = 1.0;
      if (currentH >= 0 && currentH < 6) {
        circadianFactor = 0.35; // Night calm
      } else if (currentH >= 6 && currentH < 10) {
        circadianFactor = 0.50; // Dawn fresh
      } else if (currentH >= 10 && currentH < 18) {
        circadianFactor = 0.75 + ((currentH - 10) / 8) * 0.30;
      } else {
        circadianFactor = 1.05 + ((currentH - 18) / 6) * 0.25; // Evening brilliance
      }

      // 5. SENTIENT DIALOGUE FLARES
      const dSec = dialogueSectorsRef.current;
      if (isDialogueActiveRef.current) {
        dSec.timer += 1;
        dSec.speechPulse = 0.5 + Math.sin(time * 0.18) * 0.5;
        if (dSec.timer > 24) {
          dSec.timer = 0;
          dSec.activeRayIdx = (dSec.activeRayIdx + 1 + Math.floor(Math.random() * 3)) % 6;
          dSec.flashIntensity = 1.0;
        }
        dSec.flashIntensity = Math.max(0, dSec.flashIntensity - 0.032);
      } else {
        dSec.flashIntensity = 0;
        dSec.speechPulse = 0;
      }

      // 6. ELASTIC PHYSICAL SPRING STRETCH TOWARDS CLICK / POINTER
      const sp = stretchPhysicsRef.current;
      const ptr = pointerPosRef.current;

      if (ptr.active) {
        const pdx = ptr.x - centerX;
        const pdy = ptr.y - centerY;
        const pdist = Math.hypot(pdx, pdy);
        if (pdist > 2) {
          sp.angle = Math.atan2(pdy, pdx);
          const maxPull = isPointerDownRef.current ? 20 : 8;
          const pull = Math.min(maxPull, pdist * (isPointerDownRef.current ? 0.3 : 0.12));
          sp.targetX = Math.cos(sp.angle) * pull;
          sp.targetY = Math.sin(sp.angle) * pull;
          sp.pullMagnitude = pull;
        }
      } else {
        sp.targetX = 0;
        sp.targetY = 0;
        sp.pullMagnitude = 0;
      }

      const springK = isPointerDownRef.current ? 0.22 : 0.12;
      const springDamp = isPointerDownRef.current ? 0.80 : 0.86;
      sp.vx = (sp.vx + (sp.targetX - sp.x) * springK) * springDamp;
      sp.vy = (sp.vy + (sp.targetY - sp.y) * springK) * springDamp;
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.shockWave = Math.max(0, sp.shockWave - 0.035);

      const flakeX = centerX + sp.x;
      const flakeY = centerY + sp.y;

      // 7. COLOR INTERPOLATION
      const cLerp = colorLerpRef.current;
      cLerp.currentRatio += (cLerp.targetRatio - cLerp.currentRatio) * 0.02;
      const smoothBlend = cLerp.currentRatio * cLerp.currentRatio * (3 - 2 * cLerp.currentRatio);
      const calmBlend = 1 - smoothBlend;

      const baseHue = calmHueRef.current || 205;
      const isRedAlert = hasAdviceRef.current;
      const [calmMainR, calmMainG, calmMainB] = isRedAlert ? [244, 63, 94] : hslToRgb(baseHue, 92, 68);
      const [calmSecR, calmSecG, calmSecB] = isRedAlert ? [251, 113, 133] : hslToRgb((baseHue + 25) % 360, 85, 75);

      const curCoreR = Math.round(calmMainR * calmBlend + cLerp.modeTargetR * smoothBlend);
      const curCoreG = Math.round(calmMainG * calmBlend + cLerp.modeTargetG * smoothBlend);
      const curCoreB = Math.round(calmMainB * calmBlend + cLerp.modeTargetB * smoothBlend);

      const curSecR = Math.round(calmSecR * calmBlend + cLerp.modeTargetR * smoothBlend);
      const curSecG = Math.round(calmSecG * calmBlend + cLerp.modeTargetG * smoothBlend);
      const curSecB = Math.round(calmSecB * calmBlend + cLerp.modeTargetB * smoothBlend);

      // ====================================================================
      // 8. RENDER MYSTICAL FOG EFFECT (Ефект туману навколо сніжинки)
      // ====================================================================
      ctx.save();
      const fogPuffs = fogPuffsRef.current;

      fogPuffs.forEach((puff) => {
        puff.angle += puff.orbitSpeed;
        puff.pulsePhase += puff.pulseSpeed;

        const currentDist = puff.baseRadius + Math.sin(puff.pulsePhase) * 6;
        const fx = flakeX + Math.cos(puff.angle) * currentDist + puff.driftX;
        const fy = flakeY + Math.sin(puff.angle) * (currentDist * 0.88) + puff.driftY;

        const breathe = 1 + Math.sin(puff.pulsePhase) * 0.22;
        const puffSize = puff.cloudSize * breathe;
        const curAlpha = puff.baseAlpha * (0.7 + Math.sin(puff.pulsePhase * 0.7) * 0.3) * circadianFactor;

        const fogGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, puffSize);
        fogGrad.addColorStop(0, `rgba(${curSecR}, ${curSecG}, ${curSecB}, ${curAlpha * (isRedAlert ? 0.32 : 0.22)})`);
        fogGrad.addColorStop(0.45, `rgba(224, 242, 254, ${curAlpha * 0.12})`);
        fogGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = fogGrad;
        ctx.beginPath();
        ctx.arc(fx, fy, puffSize, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // ====================================================================
      // 9. RENDER AURA SPHERE BOUNDARY & CAUSTICS (Аура всередині якої сніжинка)
      // ====================================================================
      ctx.save();
      // Outer Soft Glow
      const auraGrad = ctx.createRadialGradient(
        flakeX, flakeY, auraRadius * 0.2,
        flakeX, flakeY, auraRadius * 1.25
      );
      auraGrad.addColorStop(0, `rgba(${curCoreR}, ${curCoreG}, ${curCoreB}, 0.26)`);
      auraGrad.addColorStop(0.65, `rgba(${curSecR}, ${curSecG}, ${curSecB}, 0.12)`);
      auraGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(flakeX, flakeY, auraRadius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Soft Foggy Aura Rim (М'який туманний контур без різких ліній)
      ctx.strokeStyle = `rgba(224, 242, 254, ${0.28 + (dSec.speechPulse * 0.2)})`;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(flakeX, flakeY, auraRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Clip inside Aura Sphere for Weather Simulation
      ctx.beginPath();
      ctx.arc(flakeX, flakeY, auraRadius - 1, 0, Math.PI * 2);
      ctx.clip();

      // ====================================================================
      // 10. WEATHER SIMULATION (Хуртовина, Спокійний снігопад, Відсутність)
      // ====================================================================
      if (wth.mode !== 'clear') {
        const wParts = weatherParticlesRef.current;
        const isBlizzard = wth.mode === 'blizzard';
        const wind = wth.windStrength;

        wParts.forEach((wp) => {
          wp.flutterPhase += wp.flutterSpeed;

          if (isBlizzard) {
            // Blizzard motion: fast swirling diagonal gusts
            const gustX = (2.4 + Math.sin(time * 0.04) * 1.2) * wind;
            const gustY = (1.8 + Math.cos(time * 0.05) * 0.8) * wind;
            wp.x += gustX + Math.cos(time * 0.08 + wp.swirlRadius) * 0.8;
            wp.y += gustY;
          } else {
            // Gentle snowfall motion: slow vertical drift with gentle sway
            wp.x += Math.sin(wp.flutterPhase) * 0.35;
            wp.y += wp.vy * 0.65;
          }

          // Boundary wrap inside sphere
          const distFromC = Math.hypot(wp.x, wp.y);
          if (distFromC > auraRadius - 2 || wp.y > auraRadius - 4) {
            wp.y = -auraRadius + 4;
            wp.x = (Math.random() - 0.5) * (auraRadius * 1.6);
          }

          const curAlpha = wp.alpha * (isBlizzard ? (0.4 + wind * 0.5) : 0.65) * circadianFactor;

          if (isBlizzard && wp.isStreak && wind > 0.4) {
            // Slanted blizzard wind streak
            ctx.strokeStyle = `rgba(255, 255, 255, ${curAlpha * 0.8})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(flakeX + wp.x, flakeY + wp.y);
            ctx.lineTo(flakeX + wp.x - 6 * wind, flakeY + wp.y - 4 * wind);
            ctx.stroke();
          } else {
            // Flake dot
            ctx.fillStyle = `rgba(255, 255, 255, ${curAlpha})`;
            ctx.beginPath();
            ctx.arc(flakeX + wp.x, flakeY + wp.y, wp.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // ====================================================================
      // 11. CENTRIFUGAL SNOW SPRAY PARTICLES (Скинутий сніг при різкому оберті)
      // ====================================================================
      const sprays = snowSprayRef.current;
      for (let s = sprays.length - 1; s >= 0; s--) {
        const spk = sprays[s];
        spk.life += 1;
        spk.x += spk.vx;
        spk.y += spk.vy;
        spk.vx *= 0.94; // air drag
        spk.vy *= 0.94;
        spk.rotation += spk.rotSpeed;

        const lifeRatio = 1 - spk.life / spk.maxLife;
        if (lifeRatio <= 0) {
          sprays.splice(s, 1);
          continue;
        }

        ctx.save();
        ctx.translate(flakeX + spk.x, flakeY + spk.y);
        ctx.rotate(spk.rotation);
        ctx.fillStyle = `rgba(255, 255, 255, ${spk.alpha * lifeRatio})`;
        ctx.beginPath();
        ctx.arc(0, 0, spk.size * lifeRatio, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore(); // Restore aura sphere clip

      // ====================================================================
      // 12. RENDER LIVING SNOWFLAKE WITH ACCUMULATED SNOW ON FACETS
      // ====================================================================
      ctx.save();
      ctx.translate(flakeX, flakeY);
      ctx.rotate(rot.angle);

      const baseRadius = 27 + Math.sin(time * 0.024) * 1.2 + (dSec.speechPulse * 1.8);
      const snowCling = snAcc.amount;

      // Draw each of the 6 fractal rays
      for (let ray = 0; ray < 6; ray++) {
        ctx.save();
        ctx.rotate((ray * Math.PI) / 3);

        const isRayActive = isDialogueActiveRef.current && dSec.activeRayIdx === ray;
        const rayEnergy = isRayActive ? (0.6 + dSec.flashIntensity * 0.8) : 0;

        // Main stem stroke
        const stemAlpha = 0.88 + rayEnergy * 0.12;
        const stemR = Math.min(255, curCoreR + (isRayActive ? 60 : 0));
        const stemG = Math.min(255, curCoreG + (isRayActive ? 60 : 0));
        const stemB = Math.min(255, curCoreB + (isRayActive ? 60 : 0));

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -baseRadius);
        ctx.strokeStyle = `rgba(${stemR}, ${stemG}, ${stemB}, ${stemAlpha})`;
        ctx.lineWidth = isRayActive ? 2.4 : 1.7;
        ctx.stroke();

        // Branches along the ray (tiers 1, 2, 3)
        const branchTiers = [
          { posRatio: 0.32, lenRatio: 0.38, angle: Math.PI / 3 },
          { posRatio: 0.58, lenRatio: 0.30, angle: Math.PI / 3.2 },
          { posRatio: 0.80, lenRatio: 0.20, angle: Math.PI / 3.4 },
        ];

        branchTiers.forEach((tier) => {
          const by = -baseRadius * tier.posRatio;
          const blen = baseRadius * tier.lenRatio * (1 + rayEnergy * 0.25);
          const bx = Math.sin(tier.angle) * blen;
          const bExtY = Math.cos(tier.angle) * blen;

          // Right Branch
          ctx.beginPath();
          ctx.moveTo(0, by);
          ctx.lineTo(bx, by - bExtY);
          // Left Branch
          ctx.moveTo(0, by);
          ctx.lineTo(-bx, by - bExtY);

          ctx.strokeStyle = isRayActive 
            ? `rgba(255, 255, 255, 0.95)` 
            : `rgba(${curSecR}, ${curSecG}, ${curSecB}, 0.82)`;
          ctx.lineWidth = isRayActive ? 1.5 : 1.1;
          ctx.stroke();

          // Sub-barbs
          const subLen = blen * 0.38;
          ctx.beginPath();
          ctx.moveTo(bx * 0.5, by - bExtY * 0.5);
          ctx.lineTo(bx * 0.5 + subLen * 0.6, by - bExtY * 0.5 - subLen * 0.7);
          ctx.moveTo(-bx * 0.5, by - bExtY * 0.5);
          ctx.lineTo(-bx * 0.5 - subLen * 0.6, by - bExtY * 0.5 - subLen * 0.7);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.65 + rayEnergy * 0.35})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Branch Tip Crystals
          ctx.fillStyle = isRayActive ? '#ffffff' : `rgba(240, 249, 255, 0.95)`;
          ctx.beginPath();
          ctx.arc(bx, by - bExtY, isRayActive ? 1.6 : 1.1, 0, Math.PI * 2);
          ctx.arc(-bx, by - bExtY, isRayActive ? 1.6 : 1.1, 0, Math.PI * 2);
          ctx.fill();

          // ================================================================
          // ACCUMULATED SOFT WHITE SNOW CLUSTERS (Наліплювання білого снігу)
          // ================================================================
          if (snowCling > 0.04) {
            const snowCapSize = (1.5 + tier.posRatio * 1.8) * snowCling;
            ctx.fillStyle = `rgba(255, 255, 255, ${0.85 * snowCling})`;

            // Snow clump on node junction
            ctx.beginPath();
            ctx.arc(0, by - snowCapSize * 0.5, snowCapSize * 0.9, 0, Math.PI * 2);
            ctx.fill();

            // Snow clumps on branch forks
            ctx.beginPath();
            ctx.arc(bx * 0.6, by - bExtY * 0.6 - snowCapSize * 0.4, snowCapSize * 0.7, 0, Math.PI * 2);
            ctx.arc(-bx * 0.6, by - bExtY * 0.6 - snowCapSize * 0.4, snowCapSize * 0.7, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Tip Diamond of the Ray
        const tipY = -baseRadius;
        ctx.fillStyle = isRayActive ? '#ffffff' : `rgba(${curCoreR}, ${curCoreG}, ${curCoreB}, 0.95)`;
        ctx.beginPath();
        ctx.moveTo(0, tipY - 2.8);
        ctx.lineTo(1.8, tipY);
        ctx.lineTo(0, tipY + 2.8);
        ctx.lineTo(-1.8, tipY);
        ctx.closePath();
        ctx.fill();

        // Snow cluster on the tip
        if (snowCling > 0.04) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * snowCling})`;
          ctx.beginPath();
          ctx.arc(0, tipY - 1.5, 2.2 * snowCling, 0, Math.PI * 2);
          ctx.fill();
        }

        // Dialogue Ray Radiant Glint when speaking
        if (isRayActive && dSec.flashIntensity > 0.15) {
          const glintLen = 8 * dSec.flashIntensity;
          ctx.strokeStyle = `rgba(255, 255, 255, ${dSec.flashIntensity})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(-glintLen, tipY);
          ctx.lineTo(glintLen, tipY);
          ctx.moveTo(0, tipY - glintLen);
          ctx.lineTo(0, tipY + glintLen);
          ctx.stroke();
        }

        ctx.restore();
      }

      // Central Hexagon Core
      const hexR = (baseRadius * 0.26) * (1 + Math.sin(time * 0.04) * 0.06);
      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const ha = (h * Math.PI) / 3;
        const hx = Math.cos(ha) * hexR;
        const hy = Math.sin(ha) * hexR;
        if (h === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(${curCoreR}, ${curCoreG}, ${curCoreB}, ${0.35 + dSec.speechPulse * 0.25})`;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Interlocking Inner Star
      ctx.beginPath();
      for (let s = 0; s < 6; s++) {
        const sa = (s * Math.PI) / 3 + Math.PI / 6;
        const starRad = s % 2 === 0 ? hexR * 0.85 : hexR * 0.42;
        const sx = Math.cos(sa) * starRad;
        const sy = Math.sin(sa) * starRad;
        if (s === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fill();

      // Heart Core Diamond
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 2.5 + (dSec.speechPulse * 1.2), 0, Math.PI * 2);
      ctx.fill();

      // Dynamic Ice Sparkles
      const dynamicSparks = dynamicSparksRef.current;
      for (let s = 0; s < dynamicSparks.length; s++) {
        const spk = dynamicSparks[s];
        spk.age += 1;
        if (spk.age >= spk.lifespan) {
          spk.age = 0;
          spk.rayIdx = Math.floor(Math.random() * 6);
          spk.branchDist = 7 + Math.random() * 25;
        }

        const progress = spk.age / spk.lifespan;
        const lifeAlpha = Math.sin(progress * Math.PI);
        spk.glintPhase += spk.glintSpeed;

        const rayAngle = (spk.rayIdx * Math.PI) / 3;
        const rDist = spk.branchDist;
        const baseX = Math.sin(rayAngle) * rDist;
        const baseY = -Math.cos(rayAngle) * rDist;

        const sideOffset = spk.branchSide * 4.2;
        const perpAngle = rayAngle + Math.PI / 2;
        const sparkX = baseX + Math.cos(perpAngle) * sideOffset + spk.vx;
        const sparkY = baseY + Math.sin(perpAngle) * sideOffset + spk.vy;

        let specular = Math.pow(Math.abs(Math.sin(spk.glintPhase)), 3);
        if (isDialogueActiveRef.current && dSec.activeRayIdx === spk.rayIdx) {
          specular = Math.min(1, specular + dSec.flashIntensity * 0.6);
        }

        const curAlpha = lifeAlpha * (0.55 + specular * 0.45);

        ctx.save();
        ctx.translate(sparkX, sparkY);
        ctx.fillStyle = `rgba(255, 255, 255, ${curAlpha})`;

        if (spk.shape === 'diamond') {
          const ds = spk.size * (0.8 + specular * 0.5);
          ctx.beginPath();
          ctx.moveTo(0, -ds * 1.3);
          ctx.lineTo(ds, 0);
          ctx.lineTo(0, ds * 1.3);
          ctx.lineTo(-ds, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, spk.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Diamond Specular Cross Glint
        if (specular > 0.45) {
          const gRay = spk.glintSize * (0.7 + specular * 0.8);
          ctx.strokeStyle = `rgba(255, 255, 255, ${specular * 0.85})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(-gRay, 0);
          ctx.lineTo(gRay, 0);
          ctx.moveTo(0, -gRay);
          ctx.lineTo(0, gRay);
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore(); // Restore center translate
      ctx.restore(); // Restore dpr scale

      const isBoost =
        document.documentElement.getAttribute('data-perf-boost') === 'true' ||
        document.documentElement.getAttribute('data-economy') === 'true' ||
        localStorage.getItem('quit-smoking:perf-boost') === 'true';

      if (!isBoost && isRunning) {
        requestAnimationFrame(render);
      }
    };

    const handlePerfChange = () => {
      if (isRunning) {
        requestAnimationFrame(render);
      }
    };

    window.addEventListener('perf-boost-change', handlePerfChange);
    window.addEventListener('storage', handlePerfChange);

    requestAnimationFrame(render);

    return () => {
      isRunning = false;
      window.removeEventListener('perf-boost-change', handlePerfChange);
      window.removeEventListener('storage', handlePerfChange);
    };
  }, [triggerSnowShed]);

  // Pointer interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      pointerPosRef.current = {
        x: 180 + (e.clientX - (rect.left + rect.width / 2)),
        y: 75 + (e.clientY - (rect.top + rect.height / 2)),
        active: true,
      };
    }

    stretchPhysicsRef.current.shockWave = 1.0;

    // A tap/click instantly triggers a sharp spin burst and sheds snow!
    const rot = rotationStateRef.current;
    rot.phase = 6;
    rot.phaseTimer = 0;
    rot.phaseDuration = 60;
    rot.targetVelocity = rot.angularVelocity >= 0 ? 0.095 : -0.095;
    triggerSnowShed(1.4);

    if (onLongPress) {
      longPressTimeoutRef.current = setTimeout(() => {
        onLongPress();
      }, 3000);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      pointerPosRef.current = {
        x: 180 + (e.clientX - (rect.left + rect.width / 2)),
        y: 75 + (e.clientY - (rect.top + rect.height / 2)),
        active: true,
      };
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }

    if (dragStartRef.current && onSwipeRight) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      const dist = Math.hypot(dx, dy);
      const dt = Date.now() - dragStartRef.current.time;
      if (dist > 24 && dt < 600) {
        onSwipeRight();
      }
    }

    isPointerDownRef.current = false;
    pointerPosRef.current.active = false;
    onClick();
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
        isPointerDownRef.current = false;
        pointerPosRef.current.active = false;
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="relative w-[120px] h-[120px] sm:w-[130px] sm:h-[130px] rounded-full flex items-center justify-center cursor-pointer select-none touch-none"
      title="Жива Сніжинка • Аура з інеєм, хуртовиною та скиданням снігу"
    >
      <canvas
        ref={canvasRef}
        className="w-[360px] h-[150px] max-w-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
        }}
      />
    </div>
  );
};
