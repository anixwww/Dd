import React, { useRef, useEffect, useCallback } from 'react';
import { VisualEnergyMode } from './AnalyzerTip';

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
}

interface FlameTongue {
  id: number;
  baseOffsetX: number;
  baseWidth: number;
  maxHeight: number;
  speed: number;
  phase: number;
  turbulenceFreq: number;
  colorType: 'core' | 'mid' | 'outer' | 'tendril';
  reachPower: number;
  whipPhase: number;
}

interface FireSpark {
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
  floatFreq: number;
}

export interface LivingFireVisualProps {
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
 * Living Fire Visual (Живий Вогонь v4.0 - Затишний камінний вогонь з плавними іскрами):
 * - М'які, затишні камінні вуглинки та плавні, тепло-золотисті іскри, що легенько витають угору.
 * - Плавні синусоїдальні траєкторії підйому без різких спалахів чи гострих ліній.
 * - Оксамитові гарячі відтінки персика, апельсинового янтаря та затишного домашнього вогнища.
 * - Гармонічна фізика маятника при дотиках та кліках.
 */
export const LivingFireVisual: React.FC<LivingFireVisualProps> = ({
  mode,
  onClick,
  onSwipeRight,
  onLongPress,
  blurAmount = 0,
  calmHue = 20,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const swayWrapperRef = useRef<HTMLDivElement | null>(null);

  // Pointer interaction & Long Press tracking
  const isPointerDownRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressActiveRef = useRef(false);

  const pointerPosRef = useRef<{ x: number; y: number; active: boolean; targetPullX: number; targetPullY: number }>({
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

  // Smooth Fire State Transitions
  const fireStateRef = useRef({
    intensity: 1.0,
    targetIntensity: 1.0,
    hueOffset: 0,
    burstPulse: 0,
  });

  // Flame tongues definition
  const tonguesRef = useRef<FlameTongue[]>([]);
  useEffect(() => {
    const list: FlameTongue[] = [
      { id: 1, baseOffsetX: 0, baseWidth: 32, maxHeight: 68, speed: 0.038, phase: 0, turbulenceFreq: 2.2, colorType: 'core', reachPower: 1.0, whipPhase: 0 },
      { id: 2, baseOffsetX: -9, baseWidth: 26, maxHeight: 58, speed: 0.044, phase: 1.2, turbulenceFreq: 2.8, colorType: 'mid', reachPower: 0.85, whipPhase: 0.5 },
      { id: 3, baseOffsetX: 9, baseWidth: 26, maxHeight: 58, speed: 0.042, phase: 2.4, turbulenceFreq: 2.5, colorType: 'mid', reachPower: 0.85, whipPhase: 1.1 },
      { id: 4, baseOffsetX: -18, baseWidth: 20, maxHeight: 46, speed: 0.052, phase: 3.6, turbulenceFreq: 3.2, colorType: 'outer', reachPower: 0.7, whipPhase: 1.8 },
      { id: 5, baseOffsetX: 18, baseWidth: 20, maxHeight: 46, speed: 0.050, phase: 4.8, turbulenceFreq: 3.0, colorType: 'outer', reachPower: 0.7, whipPhase: 2.3 },
      { id: 6, baseOffsetX: -5, baseWidth: 14, maxHeight: 78, speed: 0.062, phase: 0.8, turbulenceFreq: 4.0, colorType: 'tendril', reachPower: 1.25, whipPhase: 3.1 },
      { id: 7, baseOffsetX: 5, baseWidth: 14, maxHeight: 78, speed: 0.058, phase: 2.1, turbulenceFreq: 3.8, colorType: 'tendril', reachPower: 1.25, whipPhase: 4.0 },
    ];
    tonguesRef.current = list;
  }, []);

  // Floating Sparks pool
  const sparksRef = useRef<FireSpark[]>([]);

  // Mode reactions
  useEffect(() => {
    const fs = fireStateRef.current;
    if (mode === 'gold-flash' || mode === 'warm') {
      fs.targetIntensity = 1.35;
      fs.burstPulse = 1.0;

      // Spawn soft warm golden hearth embers on positive flash
      const sparks = sparksRef.current;
      for (let i = 0; i < 28; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.1;
        const speed = 0.6 + Math.random() * 1.4;
        const [r, g, b] = hslToRgb((calmHue + 15 + Math.random() * 25) % 360, 95, 75);
        sparks.push({
          id: Math.random(),
          x: 180 + (Math.random() - 0.5) * 24,
          y: 110 + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.4,
          size: 1.8 + Math.random() * 2.4,
          alpha: 0.95,
          maxAlpha: 0.95,
          decay: 0.006 + Math.random() * 0.008,
          color: `rgb(${r}, ${g}, ${b})`,
          glowColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
          sparklePhase: Math.random() * Math.PI * 2,
          floatFreq: 0.02 + Math.random() * 0.02,
        });
      }
    } else if (mode === 'red-flash' || mode === 'negative') {
      fs.targetIntensity = 0.45;
      fs.burstPulse = 0;
    } else {
      fs.targetIntensity = 1.0;
    }
  }, [mode, calmHue]);

  // Main Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let isRunning = true;
    let displayW = (canvas.width = 360);
    let displayH = (canvas.height = 150);

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      displayW = canvas.width = Math.max(280, Math.floor(rect.width * dpr));
      displayH = canvas.height = Math.max(120, Math.floor(rect.height * dpr));
    };
    handleResize();

    let time = 0;

    const render = () => {
      if (!isRunning) return;
      time += 1;

      ctx.clearRect(0, 0, displayW, displayH);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const centerX = displayW / 2;
      const baseY = displayH - 18 * dpr;

      const fs = fireStateRef.current;
      fs.intensity += (fs.targetIntensity - fs.intensity) * 0.05;
      fs.burstPulse *= 0.94;

      // Safeguard: Limit spark count to prevent memory leaks and performance degradation
      if (sparksRef.current.length > 80) {
        sparksRef.current.length = 80;
      }

      try {
        const pend = pendulumRef.current;
        const ptr = pointerPosRef.current;

      // Pendulum spring physics
      const springK = isPointerDownRef.current ? 0.18 : 0.08;
      const damping = isPointerDownRef.current ? 0.78 : 0.88;

      if (ptr.active && isPointerDownRef.current) {
        pend.targetAngle = Math.max(-32, Math.min(32, ptr.targetPullX * 0.45));
        pend.skew = Math.max(-10, Math.min(10, ptr.targetPullX * 0.16));
        pend.scaleY = 1 + Math.min(0.35, Math.abs(ptr.targetPullY) * 0.005);
      } else {
        pend.targetAngle = 0;
        pend.skew = 0;
        pend.scaleY += (1 - pend.scaleY) * 0.1;
      }

      const accel = (pend.targetAngle - pend.angle) * springK;
      pend.velocity = (pend.velocity + accel) * damping;
      pend.angle += pend.velocity;

      const targetPx = ptr.active ? ptr.targetPullX * 0.6 : 0;
      const targetPy = ptr.active ? ptr.targetPullY * 0.4 : 0;
      pend.pullX += (targetPx - pend.pullX) * 0.12;
      pend.pullY += (targetPy - pend.pullY) * 0.12;

      if (swayWrapperRef.current) {
        swayWrapperRef.current.style.transform = `rotate(${pend.angle.toFixed(2)}deg) skewX(${pend.skew.toFixed(2)}deg) scaleY(${pend.scaleY.toFixed(2)})`;
      }

      // Cozy Warm Color Palette
      const hue = (calmHue + fs.hueOffset) % 360;
      const [cR, cG, cB] = hslToRgb((hue + 25) % 360, 100, 88); // Soft golden heart
      const [mR, mG, mB] = hslToRgb((hue + 12) % 360, 95, 62);  // Warm hearth orange
      const [oR, oG, oB] = hslToRgb(hue, 90, 48);              // Deep cozy crimson

      const curScale = dpr * 0.92 * (1 + fs.burstPulse * 0.25);

      if (blurAmount > 0) {
        ctx.filter = `blur(${blurAmount}px)`;
      } else {
        ctx.filter = 'none';
      }

      ctx.save();

      // 1. SOFT COZY HEARTH GLOW
      const hearthRadius = 65 * curScale * fs.intensity;
      const glowGrad = ctx.createRadialGradient(
        centerX + pend.pullX * 0.2,
        baseY - 12 * curScale,
        4,
        centerX + pend.pullX * 0.2,
        baseY - 12 * curScale,
        hearthRadius
      );
      glowGrad.addColorStop(0, `rgba(${cR}, ${cG}, ${cB}, ${0.35 * fs.intensity})`);
      glowGrad.addColorStop(0.45, `rgba(${mR}, ${mG}, ${mB}, ${0.18 * fs.intensity})`);
      glowGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX + pend.pullX * 0.2, baseY - 12 * curScale, hearthRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. FLAME TONGUES (Плавне затишне полум'я)
      const tongues = tonguesRef.current;
      for (const tongue of tongues) {
        tongue.phase += tongue.speed;
        tongue.whipPhase += tongue.speed * 1.2;

        const tHeight = tongue.maxHeight * curScale * fs.intensity * (0.85 + Math.sin(tongue.phase) * 0.15);
        const tWidth = tongue.baseWidth * curScale * (0.9 + Math.cos(tongue.phase * 0.8) * 0.1);
        const offsetX = tongue.baseOffsetX * curScale + Math.sin(time * 0.04 + tongue.id) * (4 * curScale);

        const tipPullX = pend.pullX * tongue.reachPower + Math.sin(tongue.whipPhase) * (5 * curScale);
        const tipPullY = Math.min(0, pend.pullY * tongue.reachPower);

        const rootX = centerX + offsetX;
        const rootY = baseY;
        const tipX = rootX + tipPullX;
        const tipY = rootY - tHeight + tipPullY;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(rootX - tWidth * 0.5, rootY);

        const cp1x = rootX - tWidth * 0.4 + tipPullX * 0.3;
        const cp1y = rootY - tHeight * 0.4;
        const cp2x = tipX - tWidth * 0.2;
        const cp2y = tipY + tHeight * 0.3;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tipX, tipY);

        const cp3x = tipX + tWidth * 0.2;
        const cp3y = tipY + tHeight * 0.3;
        const cp4x = rootX + tWidth * 0.4 + tipPullX * 0.3;
        const cp4y = rootY - tHeight * 0.4;

        ctx.bezierCurveTo(cp3x, cp3y, cp4x, cp4y, rootX + tWidth * 0.5, rootY);
        ctx.closePath();

        // Color fills for flame layers
        const fillGrad = ctx.createLinearGradient(rootX, rootY, tipX, tipY);
        if (tongue.colorType === 'core') {
          fillGrad.addColorStop(0, `rgba(${cR}, ${cG}, ${cB}, 0.95)`);
          fillGrad.addColorStop(0.6, `rgba(${mR}, ${mG}, ${mB}, 0.85)`);
          fillGrad.addColorStop(1, `rgba(${oR}, ${oG}, ${oB}, 0.1)`);
        } else if (tongue.colorType === 'mid') {
          fillGrad.addColorStop(0, `rgba(${mR}, ${mG}, ${mB}, 0.85)`);
          fillGrad.addColorStop(0.7, `rgba(${oR}, ${oG}, ${oB}, 0.65)`);
          fillGrad.addColorStop(1, 'transparent');
        } else if (tongue.colorType === 'outer') {
          fillGrad.addColorStop(0, `rgba(${oR}, ${oG}, ${oB}, 0.60)`);
          fillGrad.addColorStop(0.8, `rgba(${oR - 15}, ${oG - 10}, ${oB}, 0.25)`);
          fillGrad.addColorStop(1, 'transparent');
        } else {
          fillGrad.addColorStop(0, `rgba(${cR}, ${cG}, ${cB}, 0.90)`);
          fillGrad.addColorStop(0.5, `rgba(${mR}, ${mG}, ${mB}, 0.70)`);
          fillGrad.addColorStop(1, 'transparent');
        }

        ctx.fillStyle = fillGrad;
        ctx.fill();
        ctx.restore();
      }

      // 3. COZY HEARTH EMBER SEAT
      const emberWidth = 22 * curScale;
      const emberHeight = 5.5 * curScale;
      const emberGrad = ctx.createRadialGradient(
        centerX + pend.pullX * 0.15,
        baseY,
        1,
        centerX + pend.pullX * 0.15,
        baseY,
        emberWidth
      );
      emberGrad.addColorStop(0, `rgba(${cR}, ${cG}, ${cB}, ${0.95 * fs.intensity})`);
      emberGrad.addColorStop(0.4, `rgba(${mR}, ${mG}, ${mB}, ${0.75 * fs.intensity})`);
      emberGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = emberGrad;
      ctx.beginPath();
      ctx.ellipse(centerX + pend.pullX * 0.15, baseY, emberWidth, emberHeight, 0, 0, Math.PI * 2);
      ctx.fill();

      // 4. FLOATING COZY EMBERS & SMOOTH SPARKS (Плавні, затишні іскри)
      const sparks = sparksRef.current;

      // Ambient cozy spark spawn (smooth & low frequency)
      if (Math.random() < 0.25 * fs.intensity && sparks.length < 45) {
        const spawnAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.9;
        const speed = 0.35 + Math.random() * 0.85; // Slow gentle floating rise
        const [spR, spG, spB] = hslToRgb((hue + 10 + Math.random() * 20) % 360, 95, 72);
        sparks.push({
          id: Math.random(),
          x: centerX + (Math.random() - 0.5) * (18 * curScale) + pend.pullX * 0.3,
          y: baseY - Math.random() * 12,
          vx: Math.cos(spawnAngle) * speed * 0.6,
          vy: Math.sin(spawnAngle) * speed - 0.25,
          size: 1.2 + Math.random() * 1.8,
          alpha: 0.80,
          maxAlpha: 0.85,
          decay: 0.004 + Math.random() * 0.006, // Long, smooth float
          color: `rgb(${spR}, ${spG}, ${spB})`,
          glowColor: `rgba(${spR}, ${spG}, ${spB}, 0.35)`,
          sparklePhase: Math.random() * Math.PI * 2,
          floatFreq: 0.015 + Math.random() * 0.015,
        });
      }

      // Pointer touch warm ember spawn
      if (ptr.active && Math.random() < 0.35) {
        const [spR, spG, spB] = hslToRgb((hue + 20) % 360, 95, 80);
        sparks.push({
          id: Math.random(),
          x: ptr.x + (Math.random() - 0.5) * 10,
          y: ptr.y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -0.6 - Math.random() * 0.8,
          size: 1.5 + Math.random() * 1.8,
          alpha: 0.9,
          maxAlpha: 0.9,
          decay: 0.008 + Math.random() * 0.008,
          color: `rgb(${spR}, ${spG}, ${spB})`,
          glowColor: `rgba(${spR}, ${spG}, ${spB}, 0.4)`,
          sparklePhase: Math.random() * Math.PI * 2,
          floatFreq: 0.02 + Math.random() * 0.02,
        });
      }

      // Render smooth cozy sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];

        s.sparklePhase += s.floatFreq;
        s.x += s.vx + Math.sin(s.sparklePhase) * 0.35; // Smooth harmonic drift
        s.y += s.vy;
        s.vy *= 0.985; // Gentle decelerating rise
        s.alpha -= s.decay;

        if (s.alpha <= 0 || s.y < -20 || s.y > displayH + 20) {
          sparks.splice(i, 1);
          continue;
        }

        const currentSize = s.size * (0.7 + Math.sin(s.sparklePhase) * 0.3);
        const curAlpha = Math.max(0, Math.min(1, s.alpha));

        // Soft outer glowing aura
        ctx.save();
        ctx.fillStyle = s.glowColor;
        ctx.beginPath();
        ctx.arc(s.x, s.y, currentSize * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Soft ember core
        ctx.fillStyle = s.color;
        ctx.globalAlpha = curAlpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
      } catch (e) {
        console.error('[LivingFireVisual] Safeguard caught render error:', e);
      }

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

    return () => {
      isRunning = false;
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('perf-boost-change', handlePerfChange);
      window.removeEventListener('storage', handlePerfChange);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [mode, calmHue, blurAmount]);

  // Pointer event handlers
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    isLongPressActiveRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };

    if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
    longPressTimeoutRef.current = setTimeout(() => {
      isLongPressActiveRef.current = true;
      if (navigator.vibrate) {
        try { navigator.vibrate([40, 80, 40]); } catch {}
      }
      if (onLongPress) onLongPress();
    }, 3000);

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const px = ((e.clientX - rect.left) / rect.width) * 360;
      const py = ((e.clientY - rect.top) / rect.height) * 150;
      pointerPosRef.current = {
        x: px,
        y: py,
        active: true,
        targetPullX: px - 180,
        targetPullY: py - 132,
      };
    }
  }, [onLongPress]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 360;
    const py = ((e.clientY - rect.top) / rect.height) * 150;

    pointerPosRef.current = {
      x: px,
      y: py,
      active: true,
      targetPullX: px - 180,
      targetPullY: py - 132,
    };

    if (dragStartRef.current) {
      const dist = Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y);
      if (dist > 10 && longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }
    }
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    if (dragStartRef.current && !isLongPressActiveRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = Math.abs(e.clientY - dragStartRef.current.y);
      const dt = Date.now() - dragStartRef.current.time;

      const dist = Math.hypot(dx, dy);
      if (dist > 24 && dt < 600 && onSwipeRight) {
        pendulumRef.current.velocity += 18;
        onSwipeRight();
      } else if (Math.abs(dx) < 8 && dy < 8 && dt < 450) {
        onClick();
      }
    }

    isPointerDownRef.current = false;
    dragStartRef.current = null;
    pointerPosRef.current.active = false;
  }, [onClick, onSwipeRight]);

  const handlePointerLeave = useCallback(() => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    isPointerDownRef.current = false;
    dragStartRef.current = null;
    pointerPosRef.current.active = false;
  }, []);

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
      title="Затишний Живий Вогонь (утримуй для налаштувань)"
    >
      <div
        ref={swayWrapperRef}
        className="w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-75 ease-out"
        style={{ transformOrigin: '50% 90%' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block overflow-visible"
        />
      </div>
    </div>
  );
};
