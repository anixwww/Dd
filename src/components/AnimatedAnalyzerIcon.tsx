import React, { useEffect, useState, useId } from 'react';

interface AnimatedAnalyzerIconProps {
  active?: boolean;
  className?: string;
  styleMode?: 'autumn' | 'fire' | 'snowflake' | 'flower' | 'standard' | 'sun' | 'wave' | 'cat' | 'cosmic_ring' | 'auto';
  hue?: number;
  hasAdvice?: boolean;
}

export const AnimatedAnalyzerIcon: React.FC<AnimatedAnalyzerIconProps> = ({
  active = false,
  className = 'w-5 h-5',
  styleMode = 'auto',
  hue,
  hasAdvice: propHasAdvice
}) => {
  const [currentStyle, setCurrentStyle] = useState<'autumn' | 'fire' | 'snowflake' | 'flower' | 'standard' | 'sun' | 'wave' | 'cat' | 'cosmic_ring'>('standard');
  const [currentHue, setCurrentHue] = useState<number>(190);
  const [storedHasAdvice, setStoredHasAdvice] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:analyzer-has-advice') === 'true';
    } catch {
      return false;
    }
  });
  const [isEcoMode, setIsEcoMode] = useState<boolean>(() => {
    try {
      return (
        document.documentElement.getAttribute('data-perf-boost') === 'true' ||
        document.documentElement.getAttribute('data-economy') === 'true' ||
        document.documentElement.getAttribute('data-auto-eco') === 'true' ||
        localStorage.getItem('quit-smoking:perf-boost') === 'true'
      );
    } catch {
      return false;
    }
  });

  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9]/g, '_');

  const effectiveHasAdvice = propHasAdvice !== undefined ? propHasAdvice : storedHasAdvice;

  useEffect(() => {
    const updateStyleAndHue = () => {
      try {
        const eco =
          document.documentElement.getAttribute('data-perf-boost') === 'true' ||
          document.documentElement.getAttribute('data-economy') === 'true' ||
          document.documentElement.getAttribute('data-auto-eco') === 'true' ||
          localStorage.getItem('quit-smoking:perf-boost') === 'true';
        setIsEcoMode(eco);

        if (styleMode === 'auto') {
          const s = localStorage.getItem('quit-smoking:analyzer-style');
          if (s === 'autumn' || s === 'fire') setCurrentStyle('autumn');
          else if (s === 'snowflake') setCurrentStyle('snowflake');
          else if (s === 'flower') setCurrentStyle('flower');
          else if (s === 'sun') setCurrentStyle('sun');
          else if (s === 'wave') setCurrentStyle('wave');
          else if (s === 'cat') setCurrentStyle('cat');
          else if (s === 'standard') setCurrentStyle('standard');
          else setCurrentStyle('standard');
        } else {
          setCurrentStyle(styleMode);
        }

        if (hue !== undefined) {
          setCurrentHue(hue);
        } else {
          const h = localStorage.getItem('quit-smoking:analyzer-rest-hue');
          if (h) {
            const parsed = parseInt(h, 10);
            if (!isNaN(parsed)) setCurrentHue(parsed);
          }
        }

        const adv = localStorage.getItem('quit-smoking:analyzer-has-advice') === 'true';
        setStoredHasAdvice(adv);
      } catch {}
    };

    updateStyleAndHue();

    const handleStyleChange = () => updateStyleAndHue();
    const handleHueChange = (e: any) => {
      if (typeof e?.detail === 'number') {
        setCurrentHue(e.detail);
      } else {
        updateStyleAndHue();
      }
    };
    const handleAdviceChange = (e: any) => {
      if (typeof e?.detail === 'boolean') {
        setStoredHasAdvice(e.detail);
      } else {
        updateStyleAndHue();
      }
    };

    window.addEventListener('analyzer-style-change', handleStyleChange);
    window.addEventListener('analyzer-rest-hue-changed', handleHueChange);
    window.addEventListener('analyzer-has-advice-changed', handleAdviceChange);
    window.addEventListener('perf-boost-change', handleStyleChange);
    window.addEventListener('auto-eco-config-change', handleStyleChange);
    window.addEventListener('storage', handleStyleChange);

    return () => {
      window.removeEventListener('analyzer-style-change', handleStyleChange);
      window.removeEventListener('analyzer-rest-hue-changed', handleHueChange);
      window.removeEventListener('analyzer-has-advice-changed', handleAdviceChange);
      window.removeEventListener('perf-boost-change', handleStyleChange);
      window.removeEventListener('auto-eco-config-change', handleStyleChange);
      window.removeEventListener('storage', handleStyleChange);
    };
  }, [styleMode, hue]);

  const isAutumn = currentStyle === 'autumn' || currentStyle === 'fire';
  const isSnowflake = currentStyle === 'snowflake';
  const isFlower = currentStyle === 'flower';
  const isSun = currentStyle === 'sun';
  const isWave = currentStyle === 'wave';
  const isCat = currentStyle === 'cat';

  // Dynamic palette based on visual mode, currentHue, and reddish hasAdvice alert
  const primaryColor = effectiveHasAdvice
    ? '#f43f5e'
    : isCat ? '#10b981'
    : isWave ? '#06b6d4'
    : isFlower ? `hsl(${currentHue || 330}, 92%, 64%)`
    : isSnowflake ? '#38bdf8'
    : isSun ? '#f59e0b'
    : isAutumn ? '#f59e0b'
    : `hsl(${currentHue}, 92%, 62%)`;

  const secondaryColor = effectiveHasAdvice
    ? '#fb7185'
    : isWave ? '#38bdf8'
    : isFlower ? `hsl(${(currentHue + 30) % 360}, 95%, 72%)`
    : isSnowflake ? '#e0f2fe'
    : isSun ? '#fbbf24'
    : isAutumn ? '#ea580c'
    : `hsl(${(currentHue + 40) % 360}, 92%, 58%)`;

  const tertiaryColor = effectiveHasAdvice
    ? '#fda4af'
    : isWave ? '#a5f3fc'
    : isFlower ? '#fef08a'
    : isSnowflake ? '#bae6fd'
    : isSun ? '#fef08a'
    : isAutumn ? '#fef08a'
    : `hsl(${(currentHue - 35 + 360) % 360}, 90%, 65%)`;

  const coreHighlight = effectiveHasAdvice
    ? '#fff1f2'
    : '#ffffff';

  const dropGlow = effectiveHasAdvice
    ? 'rgba(244, 63, 94, 0.55)'
    : isWave ? 'rgba(6, 182, 212, 0.65)'
    : isFlower ? `hsla(${currentHue || 330}, 90%, 65%, 0.6)`
    : isSnowflake ? 'rgba(56, 189, 248, 0.6)'
    : isSun ? 'rgba(245, 158, 11, 0.65)'
    : isAutumn ? 'rgba(245, 158, 11, 0.65)'
    : `hsla(${currentHue}, 90%, 60%, 0.45)`;

  return (
    <div className={`relative inline-flex items-center justify-center select-none overflow-visible ${className}`}>
      <style>{`
        @keyframes analyzerBreathe_${id} {
          0%, 100% {
            transform: scale(0.92);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }
        @keyframes analyzerOrbit_${id} {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes analyzerWaveFlow_${id} {
          0%, 100% {
            transform: translateX(-1.5px) scaleY(0.92);
          }
          50% {
            transform: translateX(1.5px) scaleY(1.08);
          }
        }
        @keyframes analyzerSparkle_${id} {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.7);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible transition-all duration-300"
        style={{
          filter: active ? `drop-shadow(0 0 5px ${dropGlow})` : undefined
        }}
      >
        <defs>
          <linearGradient id={`flowerPetal_${id}`} x1="0%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.8" />
            <stop offset="60%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={coreHighlight} />
          </linearGradient>

          <linearGradient id={`waveGrad_${id}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0891b2" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          <radialGradient id={`coreGrad_${id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="55%" stopColor={primaryColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* 1. Orbiting Sacred Geometry Ring / Water Ripple (Суцільний плавний слід) */}
        <g
          style={{
            transformOrigin: '12px 12px',
            animation: !isEcoMode ? `analyzerOrbit_${id} ${active ? '6s' : '10s'} linear infinite` : 'none'
          }}
        >
          <ellipse
            cx="12"
            cy="12"
            rx="9.5"
            ry="4.5"
            transform="rotate(-25 12 12)"
            stroke={primaryColor}
            strokeWidth="1.1"
            opacity={active ? 0.75 : 0.45}
          />
          <circle cx="21" cy="8" r="1.1" fill={coreHighlight} opacity={0.9} />
          <circle cx="3" cy="16" r="0.9" fill={coreHighlight} opacity={0.7} />
        </g>

        {/* 2. Living Entity Silhouette */}
        {isCat ? (
          <g>
            {/* Left Ear */}
            <polygon points="6,12 4,4 11,8" fill="#181924" stroke="#2d3040" strokeWidth="0.8" strokeLinejoin="round" />
            <polygon points="6,11 5,6 9,8" fill="#2d2230" />
            {/* Right Ear */}
            <polygon points="18,12 20,4 13,8" fill="#181924" stroke="#2d3040" strokeWidth="0.8" strokeLinejoin="round" />
            <polygon points="18,11 19,6 15,8" fill="#2d2230" />
            {/* Cat Head */}
            <circle cx="12" cy="13" r="6.2" fill="#12131a" stroke="#2d3040" strokeWidth="0.8" />
            {/* Forehead Crescent */}
            <circle cx="12" cy="9.2" r="1.1" fill={effectiveHasAdvice ? '#f43f5e' : '#fbbf24'} />
            {/* Eyes */}
            <ellipse cx="9.5" cy="12.6" rx="1.6" ry="1.2" fill={primaryColor} />
            <ellipse cx="9.5" cy="12.6" rx="0.5" ry="1.1" fill="#090a0d" />
            <ellipse cx="14.5" cy="12.6" rx="1.6" ry="1.2" fill={primaryColor} />
            <ellipse cx="14.5" cy="12.6" rx="0.5" ry="1.1" fill="#090a0d" />
            {/* Nose */}
            <polygon points="12,14.6 11.2,14 12.8,14" fill="#474354" />
            {/* Whiskers */}
            <line x1="8" y1="14.5" x2="3.5" y2="13.5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" strokeLinecap="round" />
            <line x1="8" y1="15.5" x2="3.5" y2="16.5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" strokeLinecap="round" />
            <line x1="16" y1="14.5" x2="20.5" y2="13.5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" strokeLinecap="round" />
            <line x1="16" y1="15.5" x2="20.5" y2="16.5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" strokeLinecap="round" />
          </g>
        ) : isWave ? (
          <g
            style={{
              transformOrigin: '12px 12px',
              animation: `analyzerWaveFlow_${id} ${active ? '1.8s' : '2.8s'} ease-in-out infinite`
            }}
          >
            {/* Multi-layered flowing wave crests */}
            <path
              d="M3 15C5 13 7 12 9.5 13.5C12 15 14.5 16 17 14C19 12.5 20.5 13 21 14C20 18 16 20 12 20C7 20 4 17.5 3 15Z"
              fill={`url(#waveGrad_${id})`}
              opacity={0.85}
            />
            <path
              d="M4 11C6.5 8.5 9 8.5 11.5 10.5C14 12.5 16.5 12.5 19 10C17.5 7 13.5 6 10 7.5C6.5 9 4.5 10 4 11Z"
              fill={secondaryColor}
              opacity={0.9}
            />
            {/* Luminous Ocean Heart & Foam Crest */}
            <circle cx="12" cy="12" r="3.2" fill={`url(#coreGrad_${id})`} />
            <circle cx="12" cy="12" r="1.4" fill="#ffffff" />
            <circle cx="16.5" cy="9.5" r="0.9" fill="#ffffff" />
            <circle cx="7.5" cy="14.5" r="0.8" fill={tertiaryColor} />
          </g>
        ) : isFlower ? (
          <g
            style={{
              transformOrigin: '12px 12px',
              animation: `analyzerBreathe_${id} ${active ? '2s' : '3.2s'} ease-in-out infinite`
            }}
          >
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <path
                key={deg}
                d="M12 12 C10.2 9.5 9.5 6.5 12 3 C14.5 6.5 13.8 9.5 12 12 Z"
                fill={`url(#flowerPetal_${id})`}
                transform={`rotate(${deg} 12 12)`}
                opacity={active ? 0.95 : 0.85}
              />
            ))}
            {[30, 90, 150, 210, 270, 330].map((deg) => (
              <circle
                key={deg}
                cx="12"
                cy="7"
                r="0.9"
                fill={tertiaryColor}
                transform={`rotate(${deg} 12 12)`}
                opacity={0.95}
              />
            ))}
            <circle cx="12" cy="12" r="3.2" fill={`url(#coreGrad_${id})`} />
            <circle cx="12" cy="12" r="1.4" fill="#ffffff" />
          </g>
        ) : isSnowflake ? (
          <g
            style={{
              transformOrigin: '12px 12px',
              animation: `analyzerOrbit_${id} ${active ? '8s' : '14s'} linear infinite`
            }}
          >
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 12 12)`}>
                <line x1="12" y1="12" x2="12" y2="4" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M10 7L12 5.2L14 7" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            ))}
            <circle cx="12" cy="12" r="2.8" fill={`url(#coreGrad_${id})`} />
            <circle cx="12" cy="12" r="1.3" fill="#ffffff" />
          </g>
        ) : isSun ? (
          <g
            style={{
              transformOrigin: '12px 12px',
              animation: `analyzerBreathe_${id} ${active ? '2s' : '3.2s'} ease-in-out infinite`
            }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="12"
                y1="3.5"
                x2="12"
                y2="1.5"
                stroke={secondaryColor}
                strokeWidth="1.4"
                strokeLinecap="round"
                transform={`rotate(${deg} 12 12)`}
                opacity={active ? 0.95 : 0.75}
              />
            ))}
            <circle cx="12" cy="12" r="5.5" fill={`url(#coreGrad_${id})`} />
            <circle cx="12" cy="12" r="2.8" fill="#ffffff" opacity={active ? 1 : 0.9} />
          </g>
        ) : isAutumn ? (
          <g
            style={{
              transformOrigin: '12px 12px',
              animation: `analyzerBreathe_${id} ${active ? '2s' : '3.2s'} ease-in-out infinite`
            }}
          >
            {/* Autumn Maple Leaf */}
            <path
              d="M12 21V16.5M12 16.5L8.5 15.5L9.5 13.5L5.5 12L7.5 10L6.5 7.5L9.5 8L12 3.5L14.5 8L17.5 7.5L16.5 10L18.5 12L14.5 13.5L15.5 15.5L12 16.5Z"
              fill={`url(#coreGrad_${id})`}
              stroke={secondaryColor}
              strokeWidth="0.8"
              strokeLinejoin="round"
              opacity={active ? 1 : 0.92}
            />
            <line x1="12" y1="16.5" x2="12" y2="7.5" stroke="#ffffff" strokeWidth="0.75" opacity="0.8" />
            <line x1="12" y1="11.5" x2="8.5" y2="10" stroke="#ffffff" strokeWidth="0.6" opacity="0.65" />
            <line x1="12" y1="11.5" x2="15.5" y2="10" stroke="#ffffff" strokeWidth="0.6" opacity="0.65" />
            <circle cx="12" cy="11.5" r="1.8" fill="#ffffff" opacity={active ? 1 : 0.85} />
          </g>
        ) : (
          <g
            style={{
              transformOrigin: '12px 13px',
              animation: `analyzerBreathe_${id} ${active ? '2s' : '3.2s'} ease-in-out infinite`
            }}
          >
            <path
              d="M12 2C10.5 4.5 7.5 7.5 7.5 11.5C7.5 15.6 9.8 19 12 21C11 18.5 10.5 16 11.2 13.5C11.5 12.2 12.2 11 12 8.5C12 7.2 11.8 4 12 2Z"
              fill={`url(#flowerPetal_${id})`}
              opacity={active ? 0.95 : 0.85}
            />
            <path
              d="M12 2C13.5 4.8 16.5 7.8 16.5 11.5C16.5 15.6 14.2 19 12 21C13 18.5 13.5 16 12.8 13.5C12.5 12.2 11.8 11 12 8.5C12 7.2 12.2 4 12 2Z"
              fill={`url(#flowerPetal_${id})`}
              opacity={active ? 0.95 : 0.85}
            />
            <circle cx="12" cy="13" r="4.2" fill={`url(#coreGrad_${id})`} />
            {/* Tiny Star shape instead of diamond */}
            <path d="M12 10.5L12.4 12.2L14.1 12.6L12.4 13L12 14.7L11.6 13L9.9 12.6L11.6 12.2Z" fill="#ffffff" opacity={active ? 1 : 0.9} />
          </g>
        )}

        {/* 4. Twinkling Starlight 1 */}
        <g
          style={{
            transformOrigin: '5px 6px',
            animation: `analyzerSparkle_${id} 2.4s ease-in-out infinite`
          }}
        >
          <path d="M5 4.5V7.5M3.5 6H6.5" stroke={coreHighlight} strokeWidth="1.1" strokeLinecap="round" />
        </g>

        {/* 5. Twinkling Starlight 2 */}
        <g
          style={{
            transformOrigin: '19px 18px',
            animation: `analyzerSparkle_${id} 2.8s ease-in-out infinite 0.7s`
          }}
        >
          <path d="M19 16.5V19.5M17.5 18H20.5" stroke={coreHighlight} strokeWidth="1" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
