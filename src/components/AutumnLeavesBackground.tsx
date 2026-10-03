import React, { useEffect, useRef, useState, useCallback } from 'react';

export type AutumnTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export const getAutumnTimeOfDay = (date: Date = new Date()): AutumnTimeOfDay => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
};

interface AutumnAmbientTheme {
  name: string;
  badge: string;
  baseBg: string;
  meshGradients: {
    color1: string; // Warm canopy / sun flare
    color2: string; // Vibrant foliage amber / cinnabar
    color3: string; // Deep wood / forest twilight mood
    color4: string; // Atmospheric background depth
  };
  sunPosition: { x: number; y: number }; // normalized (0..1)
  sparkleColor: string;
  moteRgb: [number, number, number];
  bottomHazeColor: string;
  ringColor: string;
}

const AUTUMN_AMBIENT_THEMES: Record<AutumnTimeOfDay, AutumnAmbientTheme> = {
  morning: {
    name: 'Золотистий туманний ранок',
    badge: 'Золотий ранок 🌅',
    baseBg: '#130a05',
    meshGradients: {
      color1: 'rgba(245, 158, 11, 0.32)',   // Honey amber morning sunlight
      color2: 'rgba(251, 146, 60, 0.28)',   // Soft peach dawn haze
      color3: 'rgba(180, 83, 9, 0.24)',    // Golden forest canopy
      color4: 'rgba(19, 10, 5, 0.88)',     // Rich earthy depth
    },
    sunPosition: { x: 0.25, y: 0.14 },
    sparkleColor: 'rgba(254, 243, 199, 0.95)',
    moteRgb: [253, 224, 71],
    bottomHazeColor: 'rgba(19, 10, 5, 0.94)',
    ringColor: 'rgba(245, 158, 11, 0.50)',
  },
  afternoon: {
    name: 'Сонячне ласкаве Бабине літо',
    badge: 'Бабине літо ☀️',
    baseBg: '#170c06',
    meshGradients: {
      color1: 'rgba(234, 88, 12, 0.36)',    // Radiant warm copper
      color2: 'rgba(245, 158, 11, 0.32)',   // Sunlit maple crown
      color3: 'rgba(194, 65, 12, 0.26)',   // Spiced orange terracotta
      color4: 'rgba(18, 8, 4, 0.88)',      // Deep amber shadow
    },
    sunPosition: { x: 0.52, y: 0.10 },
    sparkleColor: 'rgba(255, 255, 255, 0.95)',
    moteRgb: [251, 191, 36],
    bottomHazeColor: 'rgba(23, 12, 6, 0.94)',
    ringColor: 'rgba(234, 88, 12, 0.50)',
  },
  evening: {
    name: 'Багряний оксамитовий захід',
    badge: 'Багряний захід 🌇',
    baseBg: '#15060b',
    meshGradients: {
      color1: 'rgba(220, 38, 38, 0.34)',   // Deep crimson ruby
      color2: 'rgba(194, 65, 12, 0.30)',   // Burnt cinnabar & carmine
      color3: 'rgba(131, 24, 67, 0.28)',   // Twilight burgundy haze
      color4: 'rgba(17, 6, 11, 0.90)',     // Velvet nocturnal forest
    },
    sunPosition: { x: 0.76, y: 0.20 },
    sparkleColor: 'rgba(254, 205, 211, 0.95)',
    moteRgb: [248, 113, 113],
    bottomHazeColor: 'rgba(21, 6, 11, 0.95)',
    ringColor: 'rgba(220, 38, 38, 0.50)',
  },
  night: {
    name: 'Затишна ніч біля каміна',
    badge: 'Камін & Ніч 🕯️',
    baseBg: '#090505',
    meshGradients: {
      color1: 'rgba(217, 119, 6, 0.26)',   // Warm fireplace hearth amber
      color2: 'rgba(180, 83, 9, 0.22)',    // Glowing embers
      color3: 'rgba(88, 28, 135, 0.20)',   // Cosmic autumn violet mist
      color4: 'rgba(7, 4, 4, 0.92)',       // Deep charcoal solitude
    },
    sunPosition: { x: 0.80, y: 0.15 },     // Soft amber moonlight / hearth
    sparkleColor: 'rgba(254, 240, 138, 0.98)',
    moteRgb: [251, 146, 60],
    bottomHazeColor: 'rgba(9, 5, 5, 0.96)',
    ringColor: 'rgba(245, 158, 11, 0.55)',
  },
};

export type AutumnLeafType = 'maple' | 'oak' | 'beech' | 'ginkgo' | 'birch';

interface AutumnLeaf {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  scaleX: number;
  scaleY: number;
  type: AutumnLeafType;
  frontColor1: string;
  frontColor2: string;
  backColor1: string;
  backColor2: string;
  alpha: number;
  // 3D tumble, flutter & spin
  angle: number;
  spinSpeed: number;
  tumble: number;
  tumbleSpeed: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmp: number;
  depth: number; // 0..1 (0 = far away & smaller, 1 = foreground)
}

interface AutumnMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  r: number;
  g: number;
  b: number;
  depth: number;
}

interface AutumnBreezeWisp {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  curveFactor: number;
  curvePhase: number;
  curveFreq: number;
  width: number;
  alpha: number;
  maxAlpha: number;
  age: number;
  maxAge: number;
  color: string;
}

const AUTUMN_PALETTES = [
  // Golden Maple
  {
    front1: '#f59e0b',
    front2: '#d97706',
    back1: '#b45309',
    back2: '#92400e',
  },
  // Spiced Tangerine / Warm Amber
  {
    front1: '#ea580c',
    front2: '#c2410c',
    back1: '#9a3412',
    back2: '#7c2d12',
  },
  // Fiery Crimson / Scarlet
  {
    front1: '#dc2626',
    front2: '#991b1b',
    back1: '#7f1d1d',
    back2: '#571313',
  },
  // Ginkgo Biloba Radiant Golden Yellow
  {
    front1: '#facc15',
    front2: '#eab308',
    back1: '#ca8a04',
    back2: '#a16207',
  },
  // Warm Ocher / Bronze Beech
  {
    front1: '#eab308',
    front2: '#ca8a04',
    back1: '#854d0e',
    back2: '#713f12',
  },
  // Cinnamon & Terracotta Birch
  {
    front1: '#b45309',
    front2: '#78350f',
    back1: '#713f12',
    back2: '#451a03',
  },
];

export const AutumnLeavesBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentTimeOfDay, setCurrentTimeOfDay] = useState<AutumnTimeOfDay>(() => getAutumnTimeOfDay());

  const [isPerfBoost, setIsPerfBoost] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:perf-boost') === 'true';
    } catch {
      return false;
    }
  });

  // Effective time of day: fully automatic by real-world clock
  const effectiveTime: AutumnTimeOfDay = currentTimeOfDay;
  const theme = AUTUMN_AMBIENT_THEMES[effectiveTime];
  const effectiveTimeRef = useRef<AutumnTimeOfDay>(effectiveTime);
  effectiveTimeRef.current = effectiveTime;

  // Pointer state for wind and interactive leaf swirls
  const pointerRef = useRef<{
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    active: boolean;
    vx: number;
    vy: number;
  }>({
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    active: false,
    vx: 0,
    vy: 0,
  });

  // Keep auto time of day updated by current clock
  useEffect(() => {
    const update = () => setCurrentTimeOfDay(getAutumnTimeOfDay());
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

  // Canvas Autumn Simulation Engine
  useEffect(() => {
    if (isPerfBoost) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let isRunning = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Interactive elements arrays
    const breezeWisps: AutumnBreezeWisp[] = [];

    // Trigger gentle wind gusts & airy breeze trails on tap (легенькі подмухи вітру)
    const triggerWindBreeze = (clientX: number, clientY: number) => {
      // Spawn 4-6 delicate, flowing breeze streamlines
      const wispCount = 5;
      const baseAngle = -0.15 + (Math.random() - 0.5) * 0.35; // Gentle upward/rightward drift

      for (let i = 0; i < wispCount; i++) {
        const offsetAngle = baseAngle + (Math.random() - 0.5) * 0.25;
        const speed = 2.8 + Math.random() * 3.2;
        const startOffsetY = (i - wispCount / 2) * 16 + (Math.random() - 0.5) * 12;
        const startOffsetX = (Math.random() - 0.5) * 24;

        breezeWisps.push({
          id: Math.random(),
          x: clientX + startOffsetX,
          y: clientY + startOffsetY,
          vx: Math.cos(offsetAngle) * speed,
          vy: Math.sin(offsetAngle) * speed,
          length: 45 + Math.random() * 45,
          curveFactor: (Math.random() - 0.5) * 14,
          curvePhase: Math.random() * Math.PI * 2,
          curveFreq: 0.04 + Math.random() * 0.04,
          width: 1.1 + Math.random() * 0.9,
          alpha: 0,
          maxAlpha: 0.55 + Math.random() * 0.35,
          age: 0,
          maxAge: 40 + Math.floor(Math.random() * 25),
          color: 'rgba(254, 240, 138, 1)',
        });
      }

      // Smooth aerodynamic breeze push on leaves in the gust zone
      leaves.forEach((leaf) => {
        const dx = leaf.x - clientX;
        const dy = leaf.y - clientY;
        const dist = Math.hypot(dx, dy);
        if (dist < 260 && dist > 1) {
          const power = Math.max(0, 1 - dist / 260) * 4.5;
          // Smooth glide in breeze vector rather than jarring radial explosion
          leaf.vx += Math.cos(baseAngle) * power * 0.8 + (Math.random() - 0.5) * 0.6;
          leaf.vy += Math.sin(baseAngle) * power * 0.5 - power * 0.3; // Gentle upward lift
          leaf.swayAmp = Math.min(26, leaf.swayAmp + power * 0.8);
          leaf.spinSpeed += (Math.random() - 0.5) * 0.03;
          leaf.tumbleSpeed += 0.025;
        }
      });
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX !== undefined && clientY !== undefined) {
        const prevX = pointerRef.current.x;
        const prevY = pointerRef.current.y;
        pointerRef.current.vx = clientX - prevX;
        pointerRef.current.vy = clientY - prevY;
        pointerRef.current.x = clientX;
        pointerRef.current.y = clientY;
        pointerRef.current.active = true;
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX !== undefined && clientY !== undefined) {
        triggerWindBreeze(clientX, clientY);
      }
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.vx = 0;
      pointerRef.current.vy = 0;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    window.addEventListener('touchend', handlePointerLeave, { passive: true });

    // Leaf generator: 5 species (maple, oak, beech, ginkgo, birch)
    const leafCount = Math.min(32, Math.max(22, Math.floor(width / 40)));

    const createLeaf = (id: number, spawnAtTop = false): AutumnLeaf => {
      const pal = AUTUMN_PALETTES[Math.floor(Math.random() * AUTUMN_PALETTES.length)];
      const types: AutumnLeafType[] = ['maple', 'oak', 'beech', 'ginkgo', 'birch'];
      const type = types[Math.floor(Math.random() * types.length)];

      const depth = 0.4 + Math.random() * 0.6; // Scale with depth
      let baseSize = 13 + Math.random() * 10;
      if (type === 'ginkgo') baseSize = 12 + Math.random() * 8;
      if (type === 'birch') baseSize = 9 + Math.random() * 6;

      const size = baseSize * depth;

      return {
        id,
        x: Math.random() * width,
        y: spawnAtTop ? -25 - Math.random() * 50 : Math.random() * height,
        vx: 0.18 + Math.random() * 0.42, // Gentle rightward breeze
        vy: (0.40 + Math.random() * 0.60) * depth, // Natural descent
        size,
        scaleX: 0.85 + Math.random() * 0.3,
        scaleY: 0.85 + Math.random() * 0.3,
        type,
        frontColor1: pal.front1,
        frontColor2: pal.front2,
        backColor1: pal.back1,
        backColor2: pal.back2,
        alpha: 0.40 + Math.random() * 0.45,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.025,
        tumble: Math.random() * Math.PI * 2,
        tumbleSpeed: 0.016 + Math.random() * 0.028,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.018 + Math.random() * 0.024,
        swayAmp: 0.7 + Math.random() * 0.9,
        depth,
      };
    };

    const leaves: AutumnLeaf[] = Array.from({ length: leafCount }, (_, i) => createLeaf(i, false));

    // Warm golden ambient motes & fireplace embers
    const moteCount = 30;
    const motes: AutumnMote[] = Array.from({ length: moteCount }, () => {
      const depth = 0.5 + Math.random() * 0.5;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.20 + 0.10,
        vy: -(0.14 + Math.random() * 0.28) * depth,
        radius: (0.9 + Math.random() * 1.8) * depth,
        alpha: 0.25 + Math.random() * 0.55,
        baseAlpha: 0.25 + Math.random() * 0.55,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.025 + Math.random() * 0.035,
        r: 245 + Math.floor(Math.random() * 10),
        g: 158 + Math.floor(Math.random() * 60),
        b: 11 + Math.floor(Math.random() * 30),
        depth,
      };
    });

    // Drawing helper: Maple Leaf (5-lobed pointed leaf)
    const drawMapleLeaf = (size: number) => {
      ctx.beginPath();
      // Stem
      ctx.moveTo(0, size * 0.9);
      ctx.lineTo(0, size * 0.55);
      // Left lower lobe
      ctx.lineTo(-size * 0.42, size * 0.42);
      ctx.lineTo(-size * 0.32, size * 0.18);
      // Left middle lobe
      ctx.lineTo(-size * 0.82, size * 0.02);
      ctx.lineTo(-size * 0.52, -size * 0.25);
      // Left upper lobe
      ctx.lineTo(-size * 0.62, -size * 0.55);
      ctx.lineTo(-size * 0.25, -size * 0.48);
      // Top central tip
      ctx.lineTo(0, -size * 0.95);
      // Right upper lobe
      ctx.lineTo(size * 0.25, -size * 0.48);
      ctx.lineTo(size * 0.62, -size * 0.55);
      // Right middle lobe
      ctx.lineTo(size * 0.52, -size * 0.25);
      ctx.lineTo(size * 0.82, size * 0.02);
      // Right lower lobe
      ctx.lineTo(size * 0.32, size * 0.18);
      ctx.lineTo(size * 0.42, size * 0.42);
      ctx.closePath();
      ctx.fill();

      // Delicate veins
      ctx.beginPath();
      ctx.moveTo(0, size * 0.9);
      ctx.lineTo(0, -size * 0.7);
      ctx.moveTo(0, 0);
      ctx.lineTo(-size * 0.45, -size * 0.1);
      ctx.moveTo(0, 0);
      ctx.lineTo(size * 0.45, -size * 0.1);
      ctx.stroke();
    };

    // Drawing helper: Oak Leaf (Rounded wavy lobes)
    const drawOakLeaf = (size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, size * 0.85);
      ctx.lineTo(0, size * 0.6);
      ctx.bezierCurveTo(-size * 0.32, size * 0.5, -size * 0.42, size * 0.3, -size * 0.18, size * 0.18);
      ctx.bezierCurveTo(-size * 0.52, size * 0.08, -size * 0.55, -size * 0.18, -size * 0.22, -size * 0.28);
      ctx.bezierCurveTo(-size * 0.45, -size * 0.45, -size * 0.32, -size * 0.72, 0, -size * 0.9);
      ctx.bezierCurveTo(size * 0.32, -size * 0.72, size * 0.45, -size * 0.45, size * 0.22, -size * 0.28);
      ctx.bezierCurveTo(size * 0.55, -size * 0.18, size * 0.52, size * 0.08, size * 0.18, size * 0.18);
      ctx.bezierCurveTo(size * 0.42, size * 0.3, size * 0.32, size * 0.5, 0, size * 0.6);
      ctx.closePath();
      ctx.fill();

      // Main stem vein
      ctx.beginPath();
      ctx.moveTo(0, size * 0.85);
      ctx.lineTo(0, -size * 0.72);
      ctx.stroke();
    };

    // Drawing helper: Beech Leaf (Slender pointed oval)
    const drawBeechLeaf = (size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, size * 0.8);
      ctx.lineTo(0, size * 0.6);
      ctx.bezierCurveTo(-size * 0.42, size * 0.35, -size * 0.42, -size * 0.32, 0, -size * 0.9);
      ctx.bezierCurveTo(size * 0.42, -size * 0.32, size * 0.42, size * 0.35, 0, size * 0.6);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, size * 0.8);
      ctx.lineTo(0, -size * 0.72);
      ctx.stroke();
    };

    // Drawing helper: Ginkgo Biloba Leaf (Fan-shaped with delicate notch)
    const drawGinkgoLeaf = (size: number) => {
      ctx.beginPath();
      // Stem
      ctx.moveTo(0, size * 0.95);
      ctx.lineTo(0, size * 0.45);
      // Fan curve left
      ctx.bezierCurveTo(-size * 0.45, size * 0.25, -size * 0.85, -size * 0.15, -size * 0.80, -size * 0.55);
      // Upper fan left
      ctx.bezierCurveTo(-size * 0.50, -size * 0.85, -size * 0.18, -size * 0.80, 0, -size * 0.62); // Center notch
      // Upper fan right
      ctx.bezierCurveTo(size * 0.18, -size * 0.80, size * 0.50, -size * 0.85, size * 0.80, -size * 0.55);
      // Fan curve right
      ctx.bezierCurveTo(size * 0.85, -size * 0.15, size * 0.45, size * 0.25, 0, size * 0.45);
      ctx.closePath();
      ctx.fill();

      // Delicate radiating fan striations
      ctx.beginPath();
      ctx.moveTo(0, size * 0.45);
      ctx.lineTo(-size * 0.45, -size * 0.55);
      ctx.moveTo(0, size * 0.45);
      ctx.lineTo(size * 0.45, -size * 0.55);
      ctx.stroke();
    };

    // Drawing helper: Birch Leaf (Teardrop diamond with fine flutter)
    const drawBirchLeaf = (size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, size * 0.75);
      ctx.lineTo(0, size * 0.5);
      ctx.bezierCurveTo(-size * 0.48, size * 0.35, -size * 0.45, -size * 0.15, 0, -size * 0.85);
      ctx.bezierCurveTo(size * 0.45, -size * 0.15, size * 0.48, size * 0.35, 0, size * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, size * 0.75);
      ctx.lineTo(0, -size * 0.65);
      ctx.stroke();
    };

    let tick = 0;
    let lastFrameTime = performance.now();

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
      tick++;

      const currentTheme = AUTUMN_AMBIENT_THEMES[effectiveTimeRef.current];
      ctx.clearRect(0, 0, width, height);

      // ----------------------------------------------------------------------
      // 1. INTERACTIVE GENTLE WIND GUSTS & BREEZE TRAILS (Легенькі подмухи вітру)
      // ----------------------------------------------------------------------
      for (let w = breezeWisps.length - 1; w >= 0; w--) {
        const b = breezeWisps[w];
        b.age++;
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.982;
        b.vy *= 0.982;
        b.curvePhase += b.curveFreq;

        const progress = b.age / b.maxAge;
        if (progress < 0.2) {
          b.alpha = (progress / 0.2) * b.maxAlpha;
        } else {
          b.alpha = Math.max(0, (1 - (progress - 0.2) / 0.8) * b.maxAlpha);
        }

        if (b.age >= b.maxAge || b.alpha <= 0.01) {
          breezeWisps.splice(w, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        const tailX = b.x;
        const tailY = b.y;
        const angle = Math.atan2(b.vy, b.vx);
        const waveOffset = Math.sin(b.curvePhase) * b.curveFactor;
        const headX = b.x + Math.cos(angle) * b.length;
        const headY = b.y + Math.sin(angle) * b.length + waveOffset;
        const midX = (tailX + headX) / 2;
        const midY = (tailY + headY) / 2 + waveOffset * 1.4;

        ctx.moveTo(tailX, tailY);
        ctx.quadraticCurveTo(midX, midY, headX, headY);
        ctx.strokeStyle = `rgba(254, 240, 138, ${b.alpha.toFixed(3)})`;
        ctx.lineWidth = b.width;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(251, 191, 36, 0.4)';
        ctx.shadowBlur = 5;
        ctx.stroke();
        ctx.restore();
      }

      // ----------------------------------------------------------------------
      // 4. FLOATING WARM MOTES & EMBER PARTICLES (Золоті пилинки / іскри)
      // ----------------------------------------------------------------------
      const [rVal, gVal, bVal] = currentTheme.moteRgb;

      motes.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;
        m.pulsePhase += m.pulseSpeed;

        if (m.y < -15) m.y = height + 15;
        if (m.x < -15) m.x = width + 15;
        if (m.x > width + 15) m.x = -15;

        const pulse = 0.5 + 0.5 * Math.sin(m.pulsePhase);
        const curAlpha = m.baseAlpha * pulse;

        ctx.save();
        ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${curAlpha})`;
        ctx.shadowColor = `rgba(${rVal}, ${gVal}, ${bVal}, 0.8)`;
        ctx.shadowBlur = m.radius * 3.2;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // ----------------------------------------------------------------------
      // 5. 3D TUMBLING AUTUMN LEAVES (Медитативний 3D-листопад)
      // ----------------------------------------------------------------------
      const ptr = pointerRef.current;

      leaves.forEach((leaf) => {
        // Increment kinematics
        leaf.swayPhase += leaf.swaySpeed;
        leaf.tumble += leaf.tumbleSpeed;
        leaf.angle += leaf.spinSpeed;

        // Aerodynamic sinusoidal horizontal sway + ambient drift
        const sway = Math.sin(leaf.swayPhase) * leaf.swayAmp;
        leaf.x += leaf.vx + sway;
        leaf.y += leaf.vy;

        // Pointer breeze reaction (aerodynamic wake push)
        if (ptr.active) {
          const dx = leaf.x - ptr.x;
          const dy = leaf.y - ptr.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150 && dist > 1) {
            const push = (1 - dist / 150) * 2.2;
            leaf.x += (dx / dist) * push + ptr.vx * 0.08;
            leaf.y += (dy / dist) * push * 0.6 + ptr.vy * 0.08;
            leaf.spinSpeed += (Math.random() - 0.5) * 0.015;
            leaf.tumbleSpeed += 0.01;
          }
        }

        // Seamless wrap & natural respawn
        if (leaf.y > height + 45) {
          Object.assign(leaf, createLeaf(leaf.id, true));
        }
        if (leaf.x > width + 45) {
          leaf.x = -40;
        } else if (leaf.x < -45) {
          leaf.x = width + 40;
        }

        // 3D tumble flip calculation (cosine projection)
        const flip = Math.cos(leaf.tumble);
        const isBackside = flip < 0;
        const scaleYFactor = Math.max(0.07, Math.abs(flip));

        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.angle);
        ctx.scale(leaf.scaleX, leaf.scaleY * scaleYFactor);

        // Volumetric shadow for high depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.32)';
        ctx.shadowBlur = 6 * leaf.depth;
        ctx.shadowOffsetY = 4 * leaf.depth;

        // Two-sided gradient with dynamic lighting
        const grad = ctx.createLinearGradient(0, -leaf.size, 0, leaf.size);
        if (isBackside) {
          grad.addColorStop(0, leaf.backColor1);
          grad.addColorStop(1, leaf.backColor2);
          ctx.globalAlpha = leaf.alpha * 0.88;
        } else {
          grad.addColorStop(0, leaf.frontColor1);
          grad.addColorStop(1, leaf.frontColor2);
          ctx.globalAlpha = leaf.alpha;
        }

        ctx.fillStyle = grad;
        ctx.strokeStyle = isBackside ? 'rgba(0, 0, 0, 0.22)' : 'rgba(255, 255, 255, 0.20)';
        ctx.lineWidth = 0.75;

        // Render species geometry
        if (leaf.type === 'maple') {
          drawMapleLeaf(leaf.size);
        } else if (leaf.type === 'oak') {
          drawOakLeaf(leaf.size);
        } else if (leaf.type === 'beech') {
          drawBeechLeaf(leaf.size);
        } else if (leaf.type === 'ginkgo') {
          drawGinkgoLeaf(leaf.size);
        } else {
          drawBirchLeaf(leaf.size);
        }

        ctx.restore();
      });

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
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('touchend', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPerfBoost]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 transition-colors duration-1000 overflow-hidden"
      style={{ backgroundColor: theme.baseBg }}
    >
      {/* Dynamic Multi-Layered Autumn Canopy Gradients */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[75vw] h-[75vw] rounded-full filter blur-[90px] opacity-75 transition-all duration-1000 pointer-events-none"
        style={{ background: theme.meshGradients.color1 }}
      />
      <div
        className="absolute -bottom-[20%] -right-[15%] w-[85vw] h-[85vw] rounded-full filter blur-[100px] opacity-70 transition-all duration-1000 pointer-events-none"
        style={{ background: theme.meshGradients.color2 }}
      />
      <div
        className="absolute top-[35%] right-[10%] w-[60vw] h-[60vw] rounded-full filter blur-[90px] opacity-60 transition-all duration-1000 pointer-events-none"
        style={{ background: theme.meshGradients.color3 }}
      />

      {/* Atmospheric Vignette & Soft Diffusion Glass Overlay */}
      <div
        className="absolute inset-0 pointer-events-none backdrop-blur-[2px]"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, transparent 35%, rgba(10, 4, 3, 0.48) 100%)',
        }}
      />

      {/* High-Performance Canvas for Leaves, Rays, Ripples & Embers */}
      {!isPerfBoost && (
        <canvas
          ref={canvasRef}
          className="w-full h-full block relative z-10 pointer-events-auto"
        />
      )}

      {/* Ethereal Soft Progressive Blur & Gradient Haze over Bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-64 sm:h-80 pointer-events-none backdrop-blur-[12px] z-20 transition-all duration-1000"
        style={{
          maskImage:
            'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.4) 65%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.4) 65%, transparent 100%)',
          background: `linear-gradient(to top, ${theme.bottomHazeColor} 0%, rgba(245, 158, 11, 0.05) 50%, transparent 100%)`,
        }}
      />
    </div>
  );
});
