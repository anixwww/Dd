import React, { useRef, useEffect, useCallback } from 'react';
import { VisualEnergyMode } from './AnalyzerTip';
import { hslToRgb } from './LivingFireVisual';

interface OrbitingLeaf {
  id: number;
  angle: number;
  speed: number;
  orbitRadiusX: number;
  orbitRadiusY: number;
  tiltAngle: number;
  size: number;
  type: 'maple' | 'ginkgo' | 'oak' | 'birch';
  tumble: number;
  tumbleSpeed: number;
  color1: string;
  color2: string;
  alpha: number;
  scale: number;
}

interface AutumnSpark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  color: string;
  glowColor: string;
  sparklePhase: number;
}

export interface LivingAutumnVisualProps {
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

/**
 * Living Autumn Visual (Живий Осінній Листок v1.0):
 * - Сяючий центральний золотий кленовий листок з ніжними прожилками та диханням.
 * - Осінній вихор: орбітальний танець мініатюрних листочків (клен, гінкго, дуб, берізка).
 * - Золоті пилинки та теплі іскри бабиного літа навколо оболонки.
 * - Пружне маятникове погойдування на вітрі та інтерактивні спалахи при дотиках.
 */
export const LivingAutumnVisual: React.FC<LivingAutumnVisualProps> = ({
  mode,
  hasAdvice = false,
  isThinking = false,
  isDialogueActive = false,
  isAllGood = false,
  onClick,
  onSwipeRight,
  onLongPress,
  blurAmount = 0,
  calmHue = 38,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const swayWrapperRef = useRef<HTMLDivElement | null>(null);

  // Pointer interaction & Long Press tracking
  const isPointerDownRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressActiveRef = useRef(false);

  const pointerPosRef = useRef<{
    x: number;
    y: number;
    active: boolean;
    targetPullX: number;
    targetPullY: number;
  }>({
    x: 0,
    y: 0,
    active: false,
    targetPullX: 0,
    targetPullY: 0,
  });

  // Harmonic Pendulum Physics State
  const pendulumRef = useRef({
    angle: 0,
    velocity: 0,
    targetAngle: 0,
    skew: 0,
    scaleY: 1,
    pullX: 0,
    pullY: 0,
  });

  // Internal reactive values
  const hasAdviceRef = useRef(hasAdvice);
  hasAdviceRef.current = hasAdvice;
  const isThinkingRef = useRef(isThinking);
  isThinkingRef.current = isThinking;
  const isDialogueActiveRef = useRef(isDialogueActive);
  isDialogueActiveRef.current = isDialogueActive;
  const isAllGoodRef = useRef(isAllGood);
  isAllGoodRef.current = isAllGood;
  const calmHueRef = useRef(calmHue);
  calmHueRef.current = calmHue;

  // Orbiting Mini-Leaves System
  const orbitingLeavesRef = useRef<OrbitingLeaf[]>([]);
  const sparksRef = useRef<AutumnSpark[]>([]);

  // Initialize orbiting mini-leaves
  useEffect(() => {
    const leaves: OrbitingLeaf[] = [];
    const count = 9;
    const types: ('maple' | 'ginkgo' | 'oak' | 'birch')[] = ['maple', 'ginkgo', 'oak', 'birch'];

    const palettes = [
      { c1: '#f59e0b', c2: '#d97706' }, // Golden
      { c1: '#ea580c', c2: '#c2410c' }, // Tangerine
      { c1: '#dc2626', c2: '#991b1b' }, // Crimson
      { c1: '#facc15', c2: '#eab308' }, // Ginkgo Gold
      { c1: '#ca8a04', c2: '#a16207' }, // Bronze
    ];

    for (let i = 0; i < count; i++) {
      const pal = palettes[i % palettes.length];
      const type = types[i % types.length];
      leaves.push({
        id: i,
        angle: (i / count) * Math.PI * 2,
        speed: 0.016 + Math.random() * 0.012,
        orbitRadiusX: 38 + (i % 3) * 10,
        orbitRadiusY: 22 + (i % 3) * 6,
        tiltAngle: -0.3 + (i % 3) * 0.25,
        size: 7 + (i % 3) * 2.5,
        type,
        tumble: Math.random() * Math.PI * 2,
        tumbleSpeed: 0.03 + Math.random() * 0.04,
        color1: pal.c1,
        color2: pal.c2,
        alpha: 0.75 + Math.random() * 0.2,
        scale: 0.8 + Math.random() * 0.35,
      });
    }
    orbitingLeavesRef.current = leaves;
  }, []);

  // Spawn golden spark burst
  const spawnSparkBurst = useCallback((cx: number, cy: number, count = 12) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 1.8 + Math.random() * 3.2;
      sparksRef.current.push({
        id: Math.random(),
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.6,
        size: 1.2 + Math.random() * 2.2,
        alpha: 1,
        maxAlpha: 1,
        decay: 0.025 + Math.random() * 0.03,
        color: '#fef08a',
        glowColor: '#f59e0b',
        sparklePhase: Math.random() * Math.PI * 2,
      });
    }
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let isRunning = true;
    let tick = 0;

    const width = 160;
    const height = 160;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;

    // Drawing helper: Maple Leaf
    const drawMapleLeaf = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      c.moveTo(0, size * 0.9);
      c.lineTo(0, size * 0.55);
      c.lineTo(-size * 0.42, size * 0.42);
      c.lineTo(-size * 0.32, size * 0.18);
      c.lineTo(-size * 0.82, size * 0.02);
      c.lineTo(-size * 0.52, -size * 0.25);
      c.lineTo(-size * 0.62, -size * 0.55);
      c.lineTo(-size * 0.25, -size * 0.48);
      c.lineTo(0, -size * 0.95);
      c.lineTo(size * 0.25, -size * 0.48);
      c.lineTo(size * 0.62, -size * 0.55);
      c.lineTo(size * 0.52, -size * 0.25);
      c.lineTo(size * 0.82, size * 0.02);
      c.lineTo(size * 0.32, size * 0.18);
      c.lineTo(size * 0.42, size * 0.42);
      c.closePath();
      c.fill();

      // Delicate veins
      c.beginPath();
      c.moveTo(0, size * 0.9);
      c.lineTo(0, -size * 0.7);
      c.moveTo(0, 0);
      c.lineTo(-size * 0.45, -size * 0.1);
      c.moveTo(0, 0);
      c.lineTo(size * 0.45, -size * 0.1);
      c.stroke();
    };

    // Drawing helper: Ginkgo Leaf
    const drawGinkgoLeaf = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      c.moveTo(0, size * 0.95);
      c.lineTo(0, size * 0.45);
      c.bezierCurveTo(-size * 0.45, size * 0.25, -size * 0.85, -size * 0.15, -size * 0.80, -size * 0.55);
      c.bezierCurveTo(-size * 0.50, -size * 0.85, -size * 0.18, -size * 0.80, 0, -size * 0.62);
      c.bezierCurveTo(size * 0.18, -size * 0.80, size * 0.50, -size * 0.85, size * 0.80, -size * 0.55);
      c.bezierCurveTo(size * 0.85, -size * 0.15, size * 0.45, size * 0.25, 0, size * 0.45);
      c.closePath();
      c.fill();
    };

    // Drawing helper: Oak Leaf
    const drawOakLeaf = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      c.moveTo(0, size * 0.85);
      c.lineTo(0, size * 0.6);
      c.bezierCurveTo(-size * 0.32, size * 0.5, -size * 0.42, size * 0.3, -size * 0.18, size * 0.18);
      c.bezierCurveTo(-size * 0.52, size * 0.08, -size * 0.55, -size * 0.18, -size * 0.22, -size * 0.28);
      c.bezierCurveTo(-size * 0.45, -size * 0.45, -size * 0.32, -size * 0.72, 0, -size * 0.9);
      c.bezierCurveTo(size * 0.32, -size * 0.72, size * 0.45, -size * 0.45, size * 0.22, -size * 0.28);
      c.bezierCurveTo(size * 0.55, -size * 0.18, size * 0.52, size * 0.08, size * 0.18, size * 0.18);
      c.bezierCurveTo(size * 0.42, size * 0.3, size * 0.32, size * 0.5, 0, size * 0.6);
      c.closePath();
      c.fill();
    };

    // Drawing helper: Birch Leaf
    const drawBirchLeaf = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      c.moveTo(0, size * 0.75);
      c.lineTo(0, size * 0.5);
      c.bezierCurveTo(-size * 0.48, size * 0.35, -size * 0.45, -size * 0.15, 0, -size * 0.85);
      c.bezierCurveTo(size * 0.45, -size * 0.15, size * 0.48, size * 0.35, 0, size * 0.5);
      c.closePath();
      c.fill();
    };

    const render = () => {
      if (!isRunning) return;
      tick++;
      ctx.clearRect(0, 0, width, height);

      const adv = hasAdviceRef.current;
      const thk = isThinkingRef.current;
      const dial = isDialogueActiveRef.current;
      const baseH = calmHueRef.current;

      // Color computation based on state
      const hue = adv ? 355 : thk ? 45 : dial ? 35 : baseH;
      const [rCore, gCore, bCore] = hslToRgb(hue, 95, adv ? 55 : 52);
      const [rAura, gAura, bAura] = hslToRgb((hue + 15) % 360, 90, 60);

      // Pendulum harmonic updates
      const p = pendulumRef.current;
      const ptr = pointerPosRef.current;

      if (ptr.active) {
        p.targetAngle = (ptr.targetPullX / 60) * 0.35;
        p.pullX += (ptr.targetPullX - p.pullX) * 0.15;
        p.pullY += (ptr.targetPullY - p.pullY) * 0.15;
      } else {
        p.targetAngle = Math.sin(tick * 0.04) * 0.08;
        p.pullX *= 0.88;
        p.pullY *= 0.88;
      }

      const springForce = (p.targetAngle - p.angle) * 0.08;
      p.velocity = (p.velocity + springForce) * 0.85;
      p.angle += p.velocity;

      // Breathing scale
      const breathe = dial
        ? 1.0 + Math.sin(tick * 0.05) * 0.03
        : thk
        ? 1.05 + Math.sin(tick * 0.14) * 0.08
        : 1.0 + Math.sin(tick * 0.035) * 0.05;

      const leafBaseSize = 25 * breathe;

      // ----------------------------------------------------------------------
      // 1. SOFT RADIAL AURA & GOLDEN GLOW
      // ----------------------------------------------------------------------
      const auraPulse = Math.max(0.1, 0.85 + Math.sin(tick * 0.04) * 0.15);
      const auraRadius = Math.max(5, (adv ? 52 : thk ? 58 : 46) * auraPulse);

      const auraGrad = ctx.createRadialGradient(
        centerX + p.pullX * 0.3,
        centerY + p.pullY * 0.3,
        0,
        centerX + p.pullX * 0.3,
        centerY + p.pullY * 0.3,
        auraRadius
      );
      auraGrad.addColorStop(0, `rgba(${rCore}, ${gCore}, ${bCore}, ${adv ? 0.55 : 0.42})`);
      auraGrad.addColorStop(0.5, `rgba(${rAura}, ${gAura}, ${bAura}, 0.18)`);
      auraGrad.addColorStop(1, 'transparent');

      ctx.save();
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(centerX + p.pullX * 0.3, centerY + p.pullY * 0.3, auraRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ----------------------------------------------------------------------
      // 2. ORBITING MINI-LEAVES (BACK HEMISPHERE)
      // ----------------------------------------------------------------------
      const speedMultiplier = thk ? 2.4 : ptr.active ? 1.6 : 1.0;
      const leaves = orbitingLeavesRef.current;

      // Render back leaves (sin(angle) < 0)
      leaves.forEach((l) => {
        l.angle += l.speed * speedMultiplier;
        l.tumble += l.tumbleSpeed;

        const sinA = Math.sin(l.angle);
        if (sinA >= 0) return; // Will render in front

        const cosA = Math.cos(l.angle);
        const lx = centerX + cosA * l.orbitRadiusX;
        const ly = centerY + sinA * l.orbitRadiusY + Math.sin(l.angle * 2) * 5;

        const depthScale = 0.75 + (sinA + 1) * 0.25;
        const flip = Math.cos(l.tumble);
        const scaleY = Math.max(0.12, Math.abs(flip));

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(l.tiltAngle + Math.sin(tick * 0.05 + l.id) * 0.3);
        ctx.scale(l.scale * depthScale, l.scale * depthScale * scaleY);

        ctx.fillStyle = flip < 0 ? l.color2 : l.color1;
        ctx.globalAlpha = l.alpha * 0.65;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 0.5;

        if (l.type === 'maple') drawMapleLeaf(ctx, l.size);
        else if (l.type === 'ginkgo') drawGinkgoLeaf(ctx, l.size);
        else if (l.type === 'oak') drawOakLeaf(ctx, l.size);
        else drawBirchLeaf(ctx, l.size);

        ctx.restore();
      });

      // ----------------------------------------------------------------------
      // 3. CENTRAL LIVING AUTUMN MAPLE LEAF CORE
      // ----------------------------------------------------------------------
      ctx.save();
      ctx.translate(centerX + p.pullX, centerY + p.pullY);
      ctx.rotate(p.angle);

      // Core leaf shadow
      ctx.shadowColor = `rgba(${rCore}, ${gCore}, ${bCore}, 0.8)`;
      ctx.shadowBlur = adv ? 22 : 16;

      // Core leaf gradient
      const coreGrad = ctx.createLinearGradient(0, -leafBaseSize, 0, leafBaseSize);
      if (adv) {
        coreGrad.addColorStop(0, '#f43f5e');
        coreGrad.addColorStop(0.5, '#e11d48');
        coreGrad.addColorStop(1, '#9f1239');
      } else if (thk) {
        coreGrad.addColorStop(0, '#fef08a');
        coreGrad.addColorStop(0.5, '#f59e0b');
        coreGrad.addColorStop(1, '#d97706');
      } else {
        coreGrad.addColorStop(0, '#fef08a');
        coreGrad.addColorStop(0.3, '#f59e0b');
        coreGrad.addColorStop(0.7, '#ea580c');
        coreGrad.addColorStop(1, '#b45309');
      }

      ctx.fillStyle = coreGrad;
      ctx.strokeStyle = adv ? 'rgba(255, 255, 255, 0.6)' : 'rgba(254, 240, 138, 0.75)';
      ctx.lineWidth = 1.0;

      drawMapleLeaf(ctx, leafBaseSize);

      // Inner pulsating light heart of the leaf
      const centerPulse = Math.max(0.1, 0.85 + Math.sin(tick * 0.08) * 0.15);
      const centerRadius = Math.max(1, 10 * centerPulse);
      const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, centerRadius);
      centerGrad.addColorStop(0, '#ffffff');
      centerGrad.addColorStop(0.6, `rgba(${rCore}, ${gCore}, ${bCore}, 0.8)`);
      centerGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = centerGrad;
      ctx.beginPath();
      ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // ----------------------------------------------------------------------
      // 4. ORBITING MINI-LEAVES (FRONT HEMISPHERE)
      // ----------------------------------------------------------------------
      leaves.forEach((l) => {
        const sinA = Math.sin(l.angle);
        if (sinA < 0) return; // Was rendered in back

        const cosA = Math.cos(l.angle);
        const lx = centerX + cosA * l.orbitRadiusX;
        const ly = centerY + sinA * l.orbitRadiusY + Math.sin(l.angle * 2) * 5;

        const depthScale = 0.95 + sinA * 0.25;
        const flip = Math.cos(l.tumble);
        const scaleY = Math.max(0.12, Math.abs(flip));

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(l.tiltAngle + Math.sin(tick * 0.05 + l.id) * 0.3);
        ctx.scale(l.scale * depthScale, l.scale * depthScale * scaleY);

        ctx.shadowColor = `rgba(${rAura}, ${gAura}, ${bAura}, 0.5)`;
        ctx.shadowBlur = 6;

        ctx.fillStyle = flip < 0 ? l.color2 : l.color1;
        ctx.globalAlpha = l.alpha;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 0.6;

        if (l.type === 'maple') drawMapleLeaf(ctx, l.size);
        else if (l.type === 'ginkgo') drawGinkgoLeaf(ctx, l.size);
        else if (l.type === 'oak') drawOakLeaf(ctx, l.size);
        else drawBirchLeaf(ctx, l.size);

        ctx.restore();
      });

      // ----------------------------------------------------------------------
      // 5. GOLDEN SPARKS & DANCING EMBER PARTICLES
      // ----------------------------------------------------------------------
      // Ambient spawn
      if (Math.random() < (thk ? 0.35 : 0.12)) {
        const a = Math.random() * Math.PI * 2;
        const r = 20 + Math.random() * 25;
        sparksRef.current.push({
          id: Math.random(),
          x: centerX + Math.cos(a) * r,
          y: centerY + Math.sin(a) * r,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(0.4 + Math.random() * 0.8),
          size: 1.0 + Math.random() * 1.8,
          alpha: 1,
          maxAlpha: 0.9,
          decay: 0.02 + Math.random() * 0.03,
          color: adv ? '#fda4af' : '#fef08a',
          glowColor: adv ? '#f43f5e' : '#f59e0b',
          sparklePhase: Math.random() * Math.PI * 2,
        });
      }

      const sparks = sparksRef.current;
      for (let s = sparks.length - 1; s >= 0; s--) {
        const sp = sparks[s];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= sp.decay;
        sp.sparklePhase += 0.1;

        if (sp.alpha <= 0) {
          sparks.splice(s, 1);
          continue;
        }

        const flicker = 0.7 + Math.sin(sp.sparklePhase) * 0.3;
        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, Math.max(0.1, sp.size), 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.shadowColor = sp.glowColor;
        ctx.shadowBlur = 6;
        ctx.globalAlpha = Math.max(0, sp.alpha * flicker);
        ctx.fill();
        ctx.restore();
      }

      const isBoost =
        document.documentElement.getAttribute('data-perf-boost') === 'true' ||
        document.documentElement.getAttribute('data-economy') === 'true' ||
        localStorage.getItem('quit-smoking:perf-boost') === 'true';

      if (!isBoost && isRunning) {
        animId = requestAnimationFrame(render);
      }
    };

    const handlePerfChange = () => {
      if (isRunning) {
        if (animId) cancelAnimationFrame(animId);
        animId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('perf-boost-change', handlePerfChange);
    window.addEventListener('storage', handlePerfChange);

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      window.removeEventListener('perf-boost-change', handlePerfChange);
      window.removeEventListener('storage', handlePerfChange);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [calmHue]);

  // Pointer & Tap Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    isLongPressActiveRef.current = false;

    // Start Long Press timer
    longPressTimeoutRef.current = setTimeout(() => {
      isLongPressActiveRef.current = true;
      if (onLongPress) onLongPress();
    }, 550);

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const offsetX = e.clientX - (rect.left + rect.width / 2);
      const offsetY = e.clientY - (rect.top + rect.height / 2);
      pointerPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
        targetPullX: Math.max(-25, Math.min(25, offsetX)),
        targetPullY: Math.max(-25, Math.min(25, offsetY)),
      };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    if (dragStartRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.hypot(dx, dy) > 12) {
        if (longPressTimeoutRef.current) {
          clearTimeout(longPressTimeoutRef.current);
          longPressTimeoutRef.current = null;
        }
      }
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const offsetX = e.clientX - (rect.left + rect.width / 2);
      const offsetY = e.clientY - (rect.top + rect.height / 2);
      pointerPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
        targetPullX: Math.max(-30, Math.min(30, offsetX)),
        targetPullY: Math.max(-30, Math.min(30, offsetY)),
      };
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isPointerDownRef.current = false;
    pointerPosRef.current.active = false;

    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    if (dragStartRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      const totalDist = Math.hypot(dx, dy);

      // Check for swipe right
      if (dx > 40 && Math.abs(dy) < 30 && onSwipeRight) {
        onSwipeRight();
        dragStartRef.current = null;
        return;
      }

      // Check for clean tap / click
      if (totalDist < 16 && !isLongPressActiveRef.current) {
        // Gentle wind gust swirl on orbiting leaves
        orbitingLeavesRef.current.forEach((leaf) => {
          leaf.speed = Math.min(0.045, leaf.speed + 0.018);
          leaf.tumbleSpeed = Math.min(0.08, leaf.tumbleSpeed + 0.025);
        });
        pendulumRef.current.velocity += 0.06;

        // Haptic feedback
        try {
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate([15, 25, 20]);
          }
        } catch {}

        onClick();
      }
    }
    dragStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative flex items-center justify-center cursor-pointer select-none touch-none"
      style={{
        width: 140,
        height: 140,
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
      }}
      title="Осінній листок — торкніться для запуску діалогу"
    >
      <div ref={swayWrapperRef} className="w-full h-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full block pointer-events-none"
        />
      </div>
    </div>
  );
};
