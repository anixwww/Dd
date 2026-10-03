import React, { useEffect, useRef, useState } from 'react';

interface StarMeditationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeditationStarIcon: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className = 'w-5 h-5', style }) => {
  const [isClicked, setIsClicked] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 700);
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} cursor-pointer select-none overflow-visible`}
      style={style}
      onClick={handleClick}
    >
      <style>{`
        @keyframes slowGlowPulse {
          0% {
            opacity: 0.25;
            filter: drop-shadow(0 0 0px rgba(255, 253, 208, 0));
            transform: scale(0.92);
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 8px rgba(255, 253, 208, 0.95)) drop-shadow(0 0 16px rgba(255, 220, 100, 0.75));
            transform: scale(1.08);
          }
          100% {
            opacity: 0.25;
            filter: drop-shadow(0 0 0px rgba(255, 253, 208, 0));
            transform: scale(0.92);
          }
        }

        @keyframes funnyWobbleDance {
          0% { transform: rotate(0deg) scale(1) translateY(0px); }
          15% { transform: rotate(-14deg) scale(1.12, 0.88) translateY(-1px); }
          30% { transform: rotate(16deg) scale(0.88, 1.15) translateY(-2px); }
          45% { transform: rotate(-10deg) scale(1.08, 0.92) translateY(1px); }
          60% { transform: rotate(12deg) scale(0.92, 1.08) translateY(-1px); }
          75% { transform: rotate(-16deg) scale(1.12, 0.88) translateY(0px); }
          90% { transform: rotate(8deg) scale(0.96, 1.04) translateY(-1px); }
          100% { transform: rotate(0deg) scale(1) translateY(0px); }
        }

        @keyframes starEyeBlink {
          0%, 88%, 100% { transform: scaleY(1); }
          93% { transform: scaleY(0.08); }
        }

        @keyframes funnyBoingClick {
          0% { transform: scale(1) rotate(0deg); }
          20% { transform: scale(1.4, 0.6) rotate(-25deg); }
          45% { transform: scale(0.7, 1.35) rotate(190deg); }
          70% { transform: scale(1.2, 0.85) rotate(360deg); }
          85% { transform: scale(0.92, 1.08) rotate(370deg); }
          100% { transform: scale(1) rotate(360deg); }
        }

        @keyframes sparkleFloat {
          0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
          50% { opacity: 1; transform: translate(var(--tx), var(--ty)) scale(1.2); }
          100% { opacity: 0; transform: translate(calc(var(--tx) * 1.5), calc(var(--ty) * 1.5)) scale(0.2); }
        }

        .slow-star-glow {
          transform-origin: 12px 12px;
          animation: slowGlowPulse 6.5s ease-in-out infinite;
        }

        .funny-star-body {
          transform-origin: 12px 12px;
          animation: funnyWobbleDance 3.2s ease-in-out infinite;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .group\/star:hover .funny-star-body,
        .funny-star-body:hover {
          animation-duration: 0.8s;
        }

        .funny-star-clicked {
          animation: funnyBoingClick 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }

        .funny-star-eye {
          transform-origin: 12px 11px;
          animation: starEyeBlink 3.8s ease-in-out infinite;
        }

        .funny-sparkle-1 { --tx: -5px; --ty: -6px; animation: sparkleFloat 1.8s ease-in-out infinite 0.2s; }
        .funny-sparkle-2 { --tx: 6px; --ty: -5px; animation: sparkleFloat 1.8s ease-in-out infinite 0.7s; }
        .funny-sparkle-3 { --tx: -6px; --ty: 6px; animation: sparkleFloat 1.8s ease-in-out infinite 1.2s; }
      `}</style>

      {/* Floating tiny magic sparkles */}
      <g className="opacity-0 group-hover/star:opacity-100 transition-opacity duration-300">
        <circle cx="12" cy="12" r="1" fill="#FFFDD0" className="funny-sparkle-1" />
        <circle cx="12" cy="12" r="1.2" fill="#FFE57F" className="funny-sparkle-2" />
        <circle cx="12" cy="12" r="0.9" fill="#FF8EA3" className="funny-sparkle-3" />
      </g>

      <g className={`slow-star-glow ${isClicked ? 'funny-star-clicked' : ''}`}>
        <g className="funny-star-body">
          {/* Main 4-pointed Star Shape */}
          <path
            d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z"
            fill="currentColor"
          />

          {/* Cute Face details */}
          <g className="funny-star-eye">
            {/* Left Eye */}
            <ellipse cx="9.2" cy="10.8" rx="1.1" ry="1.4" fill="#1E1E24" />
            <circle cx="8.9" cy="10.3" r="0.4" fill="#FFFFFF" />

            {/* Right Eye */}
            <ellipse cx="14.8" cy="10.8" rx="1.1" ry="1.4" fill="#1E1E24" />
            <circle cx="14.5" cy="10.3" r="0.4" fill="#FFFFFF" />
          </g>

          {/* Blushing Pink Cheeks */}
          <ellipse cx="7.6" cy="12.3" rx="1.1" ry="0.6" fill="#FF77A8" opacity="0.85" />
          <ellipse cx="16.4" cy="12.3" rx="1.1" ry="0.6" fill="#FF77A8" opacity="0.85" />

          {/* Funny Happy Mouth with Tongue */}
          <path
            d="M 10.2 13 Q 12 15.2 13.8 13"
            stroke="#1E1E24"
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
          />
          {/* Tiny tongue sticking out */}
          <path
            d="M 11.2 13.8 C 11.2 15 12.8 15 12.8 13.8 Z"
            fill="#FF5252"
          />
        </g>
      </g>
    </svg>
  );
};

export const FourPointStar = MeditationStarIcon;

/**
 * Astronomical Earth-based Stellar Simulator:
 * - Unresolved optical point core (Airy disk & Moffat Point Spread Function)
 * - Atmospheric thermal scintillation (Kolmogorov turbulence micro-twinkle & chromatic dispersion)
 * - Fraunhofer diffraction spikes with interference flutter
 * - Pinch-to-zoom gesture (двома пальцями) та колесо миші
 * - Вхідні підказки з плавним зникненням
 */
export const StarMeditationModal: React.FC<StarMeditationModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Zoom state (target & smooth animated zoom)
  const zoomRef = useRef<number>(1.0);
  const targetZoomRef = useRef<number>(1.0);

  // Touch gesture tracking
  const initialTouchDistanceRef = useRef<number | null>(null);
  const initialZoomOnPinchRef = useRef<number>(1.0);
  const isPinchingRef = useRef<boolean>(false);
  const touchStartPosRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Initial Hint overlay visibility
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintMounted, setHintMounted] = useState<boolean>(false);

  // Reset & trigger hint animation on open
  useEffect(() => {
    if (!isOpen) {
      setShowHint(false);
      setHintMounted(false);
      zoomRef.current = 1.0;
      targetZoomRef.current = 1.0;
      return;
    }

    setHintMounted(true);
    // Subtle delay for smooth entry
    const showTimer = setTimeout(() => {
      setShowHint(true);
    }, 250);

    // Stay visible longer (fade out after 8 seconds)
    const hideTimer = setTimeout(() => {
      setShowHint(false);
    }, 8200);

    // Unmount from DOM after smooth 1.6s fade out completes
    const unmountTimer = setTimeout(() => {
      setHintMounted(false);
    }, 10000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(unmountTimer);
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Touch gesture handlers for Pinch-to-Zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Two finger pinch start
      isPinchingRef.current = true;
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialTouchDistanceRef.current = dist;
      initialZoomOnPinchRef.current = targetZoomRef.current;
    } else if (e.touches.length === 1) {
      touchStartPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialTouchDistanceRef.current !== null) {
      isPinchingRef.current = true;
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / initialTouchDistanceRef.current;
      const newZoom = initialZoomOnPinchRef.current * ratio;
      // Clamp between 0.4x and 4.8x
      targetZoomRef.current = Math.min(4.8, Math.max(0.4, newZoom));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      initialTouchDistanceRef.current = null;
    }

    if (e.touches.length === 0) {
      // If user was pinching, do not trigger click-to-close
      if (isPinchingRef.current) {
        setTimeout(() => {
          isPinchingRef.current = false;
        }, 150);
        return;
      }

      // Check if it was a quick stationary tap to close
      if (touchStartPosRef.current) {
        const changedTouch = e.changedTouches[0];
        if (changedTouch) {
          const dx = Math.abs(changedTouch.clientX - touchStartPosRef.current.x);
          const dy = Math.abs(changedTouch.clientY - touchStartPosRef.current.y);
          const dt = Date.now() - touchStartPosRef.current.time;
          if (dx < 12 && dy < 12 && dt < 450) {
            onClose();
          }
        }
        touchStartPosRef.current = null;
      }
    }
  };

  // Wheel zoom support for desktop / trackpad
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.0018;
    const nextZoom = targetZoomRef.current + zoomDelta;
    targetZoomRef.current = Math.min(4.8, Math.max(0.4, nextZoom));
  };

  // Desktop click to close
  const handleClick = (e: React.MouseEvent) => {
    if (isPinchingRef.current) return;
    onClose();
  };

  // Astronomical Starlight Canvas Simulation Loop
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const startTime = performance.now();

    const render = (now: number) => {
      const t = (now - startTime) / 1000;
      const bw = canvas.width;
      const bh = canvas.height;

      // Smooth zoom interpolation (inertia)
      zoomRef.current += (targetZoomRef.current - zoomRef.current) * 0.14;
      const currentZoom = zoomRef.current;

      // Absolute center of the screen
      const cx = bw / 2;
      const cy = bh / 2;
      const scale = dpr;

      // 1. PURE OBSIDIAN DEEP SPACE VOID
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, bw, bh);

      // Micro atmospheric depth at the horizon of space
      const voidGrad = ctx.createRadialGradient(cx, cy, 2 * scale, cx, cy, Math.max(bw, bh) * 0.6);
      voidGrad.addColorStop(0, 'rgba(1, 2, 8, 0.45)');
      voidGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = voidGrad;
      ctx.fillRect(0, 0, bw, bh);

      // 2. ATMOSPHERIC TURBULENCE & SCINTILLATION (Seeing Simulation)
      const turbulence =
        0.82 +
        0.11 * Math.sin(t * 22.7) +
        0.06 * Math.sin(t * 37.3) +
        0.04 * Math.cos(t * 14.1) +
        0.03 * Math.sin(t * 53.9) +
        0.015 * Math.sin(t * 89.2);

      // Slow 8.2-second calm meditative breathing envelope
      const breath = 0.5 + 0.5 * Math.sin((t * Math.PI * 2) / 8.2);
      const intensity = Math.min(1.0, Math.max(0.68, (0.86 + 0.16 * breath) * turbulence));

      // Chromatic dispersion (prismatic starlight scintillation)
      const chromaT = t * 2.3;
      const red = Math.round(242 + 13 * Math.sin(chromaT));
      const green = Math.round(247 + 8 * Math.sin(chromaT + 1.8));
      const blue = 255;
      const starRgb = `${red}, ${green}, ${blue}`;

      // Micro sub-pixel thermal seeing centroid jiggle
      const jiggleX = (0.35 * Math.sin(t * 31.4) + 0.2 * Math.cos(t * 47.2)) * scale;
      const jiggleY = (0.35 * Math.cos(t * 26.8) + 0.2 * Math.sin(t * 41.9)) * scale;
      const starX = cx + jiggleX;
      const starY = cy + jiggleY;

      // 3. ATMOSPHERIC CORONA (Rayleigh & Mie Scattering in Earth's Atmosphere)
      // Scaled with currentZoom
      const outerHaloRad = (46 + 18 * breath) * turbulence * scale * currentZoom;
      const outerGrad = ctx.createRadialGradient(starX, starY, 0, starX, starY, outerHaloRad);
      outerGrad.addColorStop(0, `rgba(${starRgb}, ${(0.12 * intensity).toFixed(3)})`);
      outerGrad.addColorStop(0.3, `rgba(186, 230, 253, ${(0.05 * intensity).toFixed(3)})`);
      outerGrad.addColorStop(0.7, `rgba(147, 197, 253, ${(0.015 * intensity).toFixed(3)})`);
      outerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      ctx.arc(starX, starY, outerHaloRad, 0, Math.PI * 2);
      ctx.fill();

      // Inner intense photoreceptor corona
      const innerCoronaRad = (14 + 6 * breath) * Math.sqrt(turbulence) * scale * currentZoom;
      const innerGrad = ctx.createRadialGradient(starX, starY, 0, starX, starY, innerCoronaRad);
      innerGrad.addColorStop(0, `rgba(255, 255, 255, ${(0.75 * intensity).toFixed(3)})`);
      innerGrad.addColorStop(0.2, `rgba(${starRgb}, ${(0.42 * intensity).toFixed(3)})`);
      innerGrad.addColorStop(0.55, `rgba(186, 230, 253, ${(0.12 * intensity).toFixed(3)})`);
      innerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(starX, starY, innerCoronaRad, 0, Math.PI * 2);
      ctx.fill();

      // Subtle delicate Airy ring
      const airyRingR = (9.5 + 2.5 * breath) * Math.sqrt(turbulence) * scale * currentZoom;
      ctx.strokeStyle = `rgba(224, 242, 254, ${(0.085 * intensity).toFixed(3)})`;
      ctx.lineWidth = 0.85 * scale;
      ctx.beginPath();
      ctx.arc(starX, starY, airyRingR, 0, Math.PI * 2);
      ctx.stroke();

      // 4. REAL OPTICAL DIFFRACTION SPIKES (Справжні тонкі дифракційні голки)
      ctx.save();
      ctx.translate(starX, starY);

      // Micro-tremble of atmospheric air currents
      const rayFlutter = 0.008 * Math.sin(t * 18.5);
      ctx.rotate(rayFlutter);

      // 4 Primary Cardinal Needle Rays (0°, 90°, 180°, 270°)
      const cardinalLength = (48 + 14 * breath) * turbulence * scale * currentZoom;
      const cardinalWidth = 1.15 * scale * Math.pow(currentZoom, 0.35); // needle-sharp profile

      for (const angleDeg of [0, 90, 180, 270]) {
        ctx.save();
        ctx.rotate((angleDeg * Math.PI) / 180);

        const spikeGrad = ctx.createLinearGradient(0, 0, cardinalLength, 0);
        spikeGrad.addColorStop(0, `rgba(255, 255, 255, ${(0.92 * intensity).toFixed(3)})`);
        spikeGrad.addColorStop(0.12, `rgba(${starRgb}, ${(0.6 * intensity).toFixed(3)})`);
        spikeGrad.addColorStop(0.4, `rgba(186, 230, 253, ${(0.18 * intensity).toFixed(3)})`);
        spikeGrad.addColorStop(0.75, `rgba(147, 197, 253, ${(0.03 * intensity).toFixed(3)})`);
        spikeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = spikeGrad;
        ctx.beginPath();
        ctx.moveTo(0, -cardinalWidth / 2);
        ctx.lineTo(cardinalLength, 0);
        ctx.lineTo(0, cardinalWidth / 2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // 4 Secondary Diagonal Needle Rays (45°, 135°, 225°, 315°) - softer & shorter
      const diagLength = (22 + 7 * breath) * turbulence * scale * currentZoom;
      const diagWidth = 0.75 * scale * Math.pow(currentZoom, 0.35);

      for (const angleDeg of [45, 135, 225, 315]) {
        ctx.save();
        ctx.rotate((angleDeg * Math.PI) / 180);

        const diagGrad = ctx.createLinearGradient(0, 0, diagLength, 0);
        diagGrad.addColorStop(0, `rgba(255, 255, 255, ${(0.55 * intensity).toFixed(3)})`);
        diagGrad.addColorStop(0.2, `rgba(${starRgb}, ${(0.25 * intensity).toFixed(3)})`);
        diagGrad.addColorStop(0.65, `rgba(186, 230, 253, ${(0.05 * intensity).toFixed(3)})`);
        diagGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = diagGrad;
        ctx.beginPath();
        ctx.moveTo(0, -diagWidth / 2);
        ctx.lineTo(diagLength, 0);
        ctx.lineTo(0, diagWidth / 2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      ctx.restore();

      // 5. UNRESOLVED OPTICAL STELLAR POINT CORE (Чисте точкове ядро зірки)
      // Radius grows smoothly with root zoom to keep the realistic pinpoint look
      const coreR = (2.1 + 0.35 * breath) * scale * Math.pow(currentZoom, 0.45);

      // Immediate hyper-bright photosphere bloom
      const bloomGrad = ctx.createRadialGradient(starX, starY, 0, starX, starY, coreR * 2.5);
      bloomGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      bloomGrad.addColorStop(0.4, `rgba(255, 255, 255, ${(0.92 * intensity).toFixed(3)})`);
      bloomGrad.addColorStop(0.8, `rgba(${starRgb}, ${(0.45 * intensity).toFixed(3)})`);
      bloomGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = bloomGrad;
      ctx.beginPath();
      ctx.arc(starX, starY, coreR * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Sharp, pure needle-point core (#FFFFFF)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(starX, starY, coreR, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black select-none cursor-pointer overflow-hidden animate-fade-in touch-none"
      title="Торкніться для виходу або зведіть пальці для масштабування"
    >
      {/* High-Performance Atmospheric Physics Stellar Simulator Canvas: Guaranteed Centered */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none block"
        style={{ width: '100vw', height: '100vh' }}
      />

      {/* Disappearing onboarding hints: pure floating glowing text (no box, no frame, no border) */}
      {hintMounted && (
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-center pointer-events-none transition-all duration-[1600ms] ease-out select-none ${
            showHint
              ? 'opacity-85 translate-y-0 scale-100 blur-0'
              : 'opacity-0 translate-y-2 scale-95 blur-sm'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#FFFDD0] drop-shadow-[0_0_12px_rgba(255,253,208,0.9)]">
            <span>✨</span>
            <span>Масштабуйте жестом пальців (наближення / віддалення)</span>
          </div>
          <div className="text-[11px] sm:text-xs text-[#FFFDD0]/75 drop-shadow-[0_0_8px_rgba(255,253,208,0.7)] tracking-wide font-sans">
            Торкніться у будь-якому місці, щоб повернутися
          </div>
        </div>
      )}
    </div>
  );
};
