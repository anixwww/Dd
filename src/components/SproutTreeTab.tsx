import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  Wind,
  Layers,
  Eye,
  Pause,
  Play,
  Sprout,
  Compass,
  Trophy
} from 'lucide-react';
import { RefractedInfiniteSproutIcon } from './RefractedGameIcons';

export interface SproutTreeTabProps {
  onSwitchTab?: (tab: any) => void;
}

export type TreeThemeId = 'sakura' | 'emerald' | 'silver' | 'ginkgo' | 'cosmic';

export interface TreeThemeConfig {
  id: TreeThemeId;
  name: string;
  subname: string;
  trunkColors: string[]; // Gradient steps for trunk
  branchColors: string[]; // Level 1-4 colors
  blossomColors: string[]; // Petal colors
  glowColor: string;
  particleColor: string;
  skyStops: {
    earth: [string, string];
    dawn: [string, string];
    clouds: [string, string];
    twilight: [string, string];
    space: [string, string];
  };
}

export const TREE_THEMES: Record<TreeThemeId, TreeThemeConfig> = {
  sakura: {
    id: 'sakura',
    name: 'Сакура',
    subname: 'Рожеві пелюстки & ранковий туман',
    trunkColors: ['#3f2212', '#5c3317', '#7c431d'],
    branchColors: ['#5c3317', '#7c431d', '#9c5a2c', '#bc733e'],
    blossomColors: ['#fda4af', '#f472b6', '#fbcfe8', '#ffffff'],
    glowColor: 'rgba(244, 114, 182, 0.4)',
    particleColor: 'rgba(251, 207, 232, 0.7)',
    skyStops: {
      earth: ['#0f172a', '#1e293b'],
      dawn: ['#311b42', '#5b21b6'],
      clouds: ['#4c1d95', '#831843'],
      twilight: ['#500724', '#1f0410'],
      space: ['#05010a', '#000000']
    }
  },
  emerald: {
    id: 'emerald',
    name: 'Бонсай',
    subname: 'Нефритова крона & смарагдовий мох',
    trunkColors: ['#1c1917', '#292524', '#44403c'],
    branchColors: ['#292524', '#44403c', '#065f46', '#047857'],
    blossomColors: ['#34d399', '#6ee7b7', '#10b981', '#a7f3d0'],
    glowColor: 'rgba(16, 185, 129, 0.4)',
    particleColor: 'rgba(110, 231, 183, 0.7)',
    skyStops: {
      earth: ['#06241b', '#064e3b'],
      dawn: ['#022c22', '#0f766e'],
      clouds: ['#115e59', '#134e4a'],
      twilight: ['#042f2e', '#021c18'],
      space: ['#011410', '#000000']
    }
  },
  silver: {
    id: 'silver',
    name: 'Кристал',
    subname: 'Срібні гілки & зоряне сяйво',
    trunkColors: ['#1e293b', '#334155', '#475569'],
    branchColors: ['#334155', '#475569', '#64748b', '#94a3b8'],
    blossomColors: ['#38bdf8', '#7dd3fc', '#e0f2fe', '#ffffff'],
    glowColor: 'rgba(56, 189, 248, 0.4)',
    particleColor: 'rgba(186, 230, 253, 0.7)',
    skyStops: {
      earth: ['#020617', '#0f172a'],
      dawn: ['#0c1938', '#1e3a8a'],
      clouds: ['#172554', '#1e40af'],
      twilight: ['#0a1945', '#030712'],
      space: ['#02040a', '#000000']
    }
  },
  ginkgo: {
    id: 'ginkgo',
    name: 'Гінкго',
    subname: 'Бурштинове листя & сонячні промені',
    trunkColors: ['#2e1005', '#451a03', '#78350f'],
    branchColors: ['#451a03', '#78350f', '#92400e', '#b45309'],
    blossomColors: ['#facc15', '#fde047', '#fef08a', '#f59e0b'],
    glowColor: 'rgba(245, 158, 11, 0.4)',
    particleColor: 'rgba(253, 224, 71, 0.7)',
    skyStops: {
      earth: ['#1c1007', '#451a03'],
      dawn: ['#78350f', '#9a3412'],
      clouds: ['#7c2d12', '#431407'],
      twilight: ['#290f05', '#120501'],
      space: ['#080200', '#000000']
    }
  },
  cosmic: {
    id: 'cosmic',
    name: 'Лотос',
    subname: 'Люмінесцентне біо-дерево',
    trunkColors: ['#180828', '#2e1065', '#3b0764'],
    branchColors: ['#2e1065', '#3b0764', '#581c87', '#6b21a8'],
    blossomColors: ['#c084fc', '#e879f9', '#a855f7', '#f0abfc'],
    glowColor: 'rgba(192, 132, 252, 0.45)',
    particleColor: 'rgba(232, 121, 249, 0.75)',
    skyStops: {
      earth: ['#0b0217', '#1a0533'],
      dawn: ['#2c0b55', '#4c0519'],
      clouds: ['#3b0764', '#4a044e'],
      twilight: ['#200336', '#090012'],
      space: ['#030008', '#000000']
    }
  }
};

interface Blossom {
  relPos: number; // 0..1 along branch
  angleOffset: number;
  size: number;
  color: string;
  bloomProgress: number; // 0..1
}

interface Branch {
  id: number;
  parentId: number | null;
  level: number; // 0 = trunk, 1 = primary, 2 = secondary, etc.
  startX: number;
  startY: number;
  targetLength: number;
  currentLength: number;
  baseAngle: number;
  currentAngle: number;
  thickness: number;
  growthSpeed: number;
  hasChildren: boolean;
  blossoms: Blossom[];
  curvature: number;
}

interface TouchRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

interface FloatingPetal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  angle: number;
  vAngle: number;
}

function parseHexColor(hex: string): [number, number, number] {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('');
  }
  const num = parseInt(h, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function interpolateHexColor(c1Hex: string, c2Hex: string, factor: number): string {
  const f = Math.max(0, Math.min(1, factor));
  const [r1, g1, b1] = parseHexColor(c1Hex);
  const [r2, g2, b2] = parseHexColor(c2Hex);
  const r = Math.round(r1 + (r2 - r1) * f);
  const g = Math.round(g1 + (g2 - g1) * f);
  const b = Math.round(b1 + (b2 - b1) * f);
  return `rgb(${r}, ${g}, ${b})`;
}

export const SproutTreeTab: React.FC<SproutTreeTabProps> = ({ onSwitchTab }) => {
  // Game State
  const [gameState, setGameState] = useState<'seed' | 'growing' | 'paused'>('seed');
  const [selectedTheme, setSelectedTheme] = useState<TreeThemeId>('sakura');
  const growthSpeedMult = 0.3; // Default constant speed 0.3x
  const [breathSync, setBreathSync] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Statistics
  const [treeHeightMeters, setTreeHeightMeters] = useState<number>(0);
  const [totalBranchesCount, setTotalBranchesCount] = useState<number>(1);
  const [totalBlossomsCount, setTotalBlossomsCount] = useState<number>(0);

  // High Score / Record State
  const [maxHeightRecord, setMaxHeightRecord] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sprout-tree:max-height');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  // Update best record when tree height grows
  useEffect(() => {
    if (treeHeightMeters > maxHeightRecord) {
      setMaxHeightRecord(treeHeightMeters);
      try {
        localStorage.setItem('sprout-tree:max-height', String(treeHeightMeters));
      } catch {}
    }
  }, [treeHeightMeters, maxHeightRecord]);

  // Canvas & Audio Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Simulation State Refs (mutable inside 60fps render loop)
  const branchesRef = useRef<Branch[]>([]);
  const nextBranchIdRef = useRef<number>(1);
  const petalsRef = useRef<FloatingPetal[]>([]);
  const ripplesRef = useRef<TouchRipple[]>([]);
  const cameraYRef = useRef<number>(0);
  const targetCameraYRef = useRef<number>(0);
  const highestPointRef = useRef<number>(0);
  const isDraggingCameraRef = useRef<boolean>(false);
  const lastPointerYRef = useRef<number>(0);
  const autoFollowCameraRef = useRef<boolean>(true);

  // Breath Phase: 0..1 (sine wave for 8s breathing cycle)
  const breathPhaseRef = useRef<number>(0);

  const theme = useMemo(() => TREE_THEMES[selectedTheme], [selectedTheme]);

  // Pentatonic Chime Frequencies in 432 Hz tuning
  const PENTATONIC_SCALE = useMemo(() => [
    259.2, // C4
    291.6, // D4
    324.0, // E4
    388.8, // G4
    432.0, // A4
    518.4, // C5
    583.2, // D5
    648.0, // E5
    777.6, // G5
    864.0  // A5
  ], []);

  // Web Audio Context initialization
  const initAudio = useCallback(() => {
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;

    const ctx = new AudioContextClass({ latencyHint: 'interactive' });
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : 0.85, ctx.currentTime);
    masterGain.connect(ctx.destination);

    audioCtxRef.current = ctx;
    masterGainRef.current = masterGain;

    return ctx;
  }, [isMuted]);

  // Play soft pentatonic chime on branch fork / blossom
  const playChime = useCallback((pitchIndex?: number, volume: number = 0.25) => {
    const ctx = initAudio();
    if (!ctx || !masterGainRef.current || isMuted) return;

    const now = ctx.currentTime;
    const noteIdx = pitchIndex !== undefined
      ? pitchIndex % PENTATONIC_SCALE.length
      : Math.floor(Math.random() * PENTATONIC_SCALE.length);
    const freq = PENTATONIC_SCALE[noteIdx];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Smooth bell envelope
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 3.2);

    osc.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(now);
    osc.stop(now + 3.3);
  }, [initAudio, isMuted, PENTATONIC_SCALE]);

  // Reset & Plant New Seed
  const handlePlantSeed = useCallback(() => {
    branchesRef.current = [];
    petalsRef.current = [];
    ripplesRef.current = [];
    nextBranchIdRef.current = 1;
    cameraYRef.current = 0;
    targetCameraYRef.current = 0;
    highestPointRef.current = 0;
    setTreeHeightMeters(0);
    setTotalBranchesCount(1);
    setTotalBlossomsCount(0);
    setGameState('seed');
  }, []);

  // Germinate Seed into Living Trunk
  const handleGerminateSeed = useCallback(() => {
    initAudio();
    playChime(0, 0.4);
    playChime(2, 0.3);
    playChime(4, 0.25);

    const initialTrunk: Branch = {
      id: 0,
      parentId: null,
      level: 0,
      startX: 0,
      startY: 0,
      targetLength: 95,
      currentLength: 0,
      baseAngle: -Math.PI / 2, // Straight Up
      currentAngle: -Math.PI / 2,
      thickness: 14,
      growthSpeed: 1.2,
      hasChildren: false,
      blossoms: [],
      curvature: 0.02
    };

    branchesRef.current = [initialTrunk];
    nextBranchIdRef.current = 1;
    setGameState('growing');
  }, [initAudio, playChime]);

  // Main 60 FPS Render & Procedural Growth Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTimestamp = performance.now();
    let lastStateTick = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Cap DPR to 1.2 max for low thermal load and energy efficiency
      const dpr = Math.min(window.devicePixelRatio || 1, 1.2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(canvas);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        lastTimestamp = performance.now();
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const targetFrameMs = 1000 / 45; // Cap at 45 FPS to prevent CPU overheat and save battery

    const render = (now: number) => {
      const elapsed = now - lastTimestamp;
      if (elapsed < targetFrameMs) {
        animId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min(0.08, elapsed / 1000);
      lastTimestamp = now;

      // Cap DPR to 1.2 max for fill-rate energy efficiency
      const dpr = Math.min(window.devicePixelRatio || 1, 1.2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const originX = width / 2;
      const originY = height - 90;

      // Update Breath Phase only if sync is active
      let breathFactor = 1.0;
      if (breathSync) {
        breathPhaseRef.current += dt * (2 * Math.PI / 8.0);
        breathFactor = 0.7 + 0.3 * Math.sin(breathPhaseRef.current);
      }

      // Calculate Sky Gradient Colors based on smooth altitude view
      const currentAltMeters = Math.max(0, -highestPointRef.current * 0.25);
      const viewAltMeters = Math.max(0, -cameraYRef.current * 0.25);

      // Throttle React setState calls to once every 300ms to save CPU cycles
      if (now - lastStateTick > 300) {
        lastStateTick = now;
        setTreeHeightMeters(Math.round(currentAltMeters));
      }

      // Smooth Sky Color Interpolation across altitude bands
      let topColor: string;
      let botColor: string;

      const stops = theme.skyStops;
      if (viewAltMeters <= 0) {
        topColor = stops.earth[0];
        botColor = stops.earth[1];
      } else if (viewAltMeters <= 150) {
        const t = viewAltMeters / 150;
        topColor = interpolateHexColor(stops.earth[0], stops.dawn[0], t);
        botColor = interpolateHexColor(stops.earth[1], stops.dawn[1], t);
      } else if (viewAltMeters <= 450) {
        const t = (viewAltMeters - 150) / 300;
        topColor = interpolateHexColor(stops.dawn[0], stops.clouds[0], t);
        botColor = interpolateHexColor(stops.dawn[1], stops.clouds[1], t);
      } else if (viewAltMeters <= 900) {
        const t = (viewAltMeters - 450) / 450;
        topColor = interpolateHexColor(stops.clouds[0], stops.twilight[0], t);
        botColor = interpolateHexColor(stops.clouds[1], stops.twilight[1], t);
      } else if (viewAltMeters <= 1600) {
        const t = (viewAltMeters - 900) / 700;
        topColor = interpolateHexColor(stops.twilight[0], stops.space[0], t);
        botColor = interpolateHexColor(stops.twilight[1], stops.space[1], t);
      } else {
        topColor = stops.space[0];
        botColor = stops.space[1];
      }

      // Smooth vertical sky linear gradient background draw
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, topColor);
      skyGrad.addColorStop(1, botColor);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(dpr, dpr);

      // Camera Smooth Interpolation
      if (autoFollowCameraRef.current && !isDraggingCameraRef.current) {
        targetCameraYRef.current = highestPointRef.current + 160;
      }
      cameraYRef.current += (targetCameraYRef.current - cameraYRef.current) * 0.05;

      ctx.save();
      ctx.translate(originX, originY - cameraYRef.current);

      // World Viewport Culling Bounds (skip drawing offscreen branches)
      const viewTopY = cameraYRef.current - height - 120;
      const viewBottomY = cameraYRef.current + 120;

      // 2. DRAW FERTILE EARTH & SEED (If visible near ground)
      if (viewBottomY >= -200) {
        const groundGrad = ctx.createRadialGradient(0, 20, 10, 0, 20, 240);
        groundGrad.addColorStop(0, 'rgba(28, 25, 23, 0.95)');
        groundGrad.addColorStop(0.5, 'rgba(41, 37, 36, 0.8)');
        groundGrad.addColorStop(1, 'rgba(12, 10, 9, 0)');
        ctx.fillStyle = groundGrad;
        ctx.beginPath();
        ctx.ellipse(0, 20, 220, 35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Root Base
        ctx.strokeStyle = theme.trunkColors[0];
        ctx.lineWidth = 16;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-15, 2);
        ctx.lineTo(-28, 22);
        ctx.moveTo(15, 2);
        ctx.lineTo(28, 22);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 18);
        ctx.stroke();

        // Interactive seed
        if (gameState === 'seed') {
          const seedPulse = 1.0 + 0.08 * Math.sin(now * 0.003);
          ctx.save();
          ctx.scale(seedPulse, seedPulse);

          const seedGlow = ctx.createRadialGradient(0, 0, 4, 0, 0, 32);
          seedGlow.addColorStop(0, theme.glowColor);
          seedGlow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = seedGlow;
          ctx.beginPath();
          ctx.arc(0, 0, 32, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fde047';
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(0, 0, 10, 7, -Math.PI / 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, -2, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      // 3. PROCEDURAL TREE SIMULATION & RENDERING
      if (gameState === 'growing' || gameState === 'paused') {
        const branches = branchesRef.current;
        const newBranchesToAdd: Branch[] = [];
        let minY = 0;
        let totalBlossoms = 0;

        for (let i = 0; i < branches.length; i++) {
          const b = branches[i];

          // Compute Branch Growth
          if (gameState === 'growing' && b.currentLength < b.targetLength) {
            const growthStep = b.growthSpeed * growthSpeedMult * breathFactor * 60 * dt;
            b.currentLength = Math.min(b.targetLength, b.currentLength + growthStep);
          }

          // Compute start & end coordinates
          let startX = b.startX;
          let startY = b.startY;
          if (b.parentId !== null && branches[b.parentId]) {
            const p = branches[b.parentId];
            const pEndAngle = p.currentAngle;
            startX = p.startX + Math.cos(pEndAngle) * p.currentLength;
            startY = p.startY + Math.sin(pEndAngle) * p.currentLength;
            b.startX = startX;
            b.startY = startY;
          }

          // Gentle wind sway
          const windAngle = Math.sin(now * 0.0015 + b.level * 0.8 + startY * 0.02) * (0.02 + b.level * 0.015);
          b.currentAngle = b.baseAngle + windAngle + b.curvature;

          const endX = startX + Math.cos(b.currentAngle) * b.currentLength;
          const endY = startY + Math.sin(b.currentAngle) * b.currentLength;

          if (endY < minY) minY = endY;

          // Offscreen Viewport Culling Check
          const isVisible = (startY >= viewTopY && startY <= viewBottomY) || (endY >= viewTopY && endY <= viewBottomY);

          // Draw Branch Segment only if visible inside viewport
          if (isVisible) {
            const branchColor = theme.branchColors[Math.min(theme.branchColors.length - 1, b.level)];
            ctx.strokeStyle = branchColor;
            ctx.lineWidth = Math.max(1.2, b.thickness * (1 - (b.currentLength / b.targetLength) * 0.25));
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
          }

          // Spawn Child Branches when parent reaches full length (Main trunk grows infinitely)
          if (
            gameState === 'growing' &&
            !b.hasChildren &&
            b.currentLength >= b.targetLength * 0.95
          ) {
            b.hasChildren = true;

            // Generate Blossoms on this finished branch
            const blossomCount = Math.floor(Math.random() * 3) + 2;
            for (let bl = 0; bl < blossomCount; bl++) {
              b.blossoms.push({
                relPos: 0.3 + (bl / blossomCount) * 0.7,
                angleOffset: (Math.random() - 0.5) * 1.6,
                size: Math.random() * 4 + 3.5,
                color: theme.blossomColors[Math.floor(Math.random() * theme.blossomColors.length)],
                bloomProgress: 0
              });
            }

            if (Math.random() < 0.45) {
              playChime(b.level + Math.floor(Math.random() * 3));
            }

            if (b.level === 0) {
              // Main vertical leader trunk segment (Always extends infinitely upwards)
              newBranchesToAdd.push({
                id: nextBranchIdRef.current++,
                parentId: b.id,
                level: 0,
                startX: endX,
                startY: endY,
                targetLength: Math.random() * 30 + 75,
                currentLength: 0,
                baseAngle: -Math.PI / 2 + (Math.random() - 0.5) * 0.18,
                currentAngle: -Math.PI / 2,
                thickness: Math.max(3.5, b.thickness * 0.88),
                growthSpeed: Math.random() * 0.4 + 1.0,
                hasChildren: false,
                blossoms: [],
                curvature: (Math.random() - 0.5) * 0.05
              });

              // Side branches allowed if under performance limit
              if (branches.length < 600) {
                newBranchesToAdd.push({
                  id: nextBranchIdRef.current++,
                  parentId: b.id,
                  level: 1,
                  startX: endX,
                  startY: endY,
                  targetLength: Math.random() * 25 + 50,
                  currentLength: 0,
                  baseAngle: -Math.PI / 2 - (0.45 + Math.random() * 0.25),
                  currentAngle: -Math.PI / 2 - 0.5,
                  thickness: b.thickness * 0.65,
                  growthSpeed: Math.random() * 0.3 + 0.8,
                  hasChildren: false,
                  blossoms: [],
                  curvature: -0.06
                });

                newBranchesToAdd.push({
                  id: nextBranchIdRef.current++,
                  parentId: b.id,
                  level: 1,
                  startX: endX,
                  startY: endY,
                  targetLength: Math.random() * 25 + 50,
                  currentLength: 0,
                  baseAngle: -Math.PI / 2 + (0.45 + Math.random() * 0.25),
                  currentAngle: -Math.PI / 2 + 0.5,
                  thickness: b.thickness * 0.65,
                  growthSpeed: Math.random() * 0.3 + 0.8,
                  hasChildren: false,
                  blossoms: [],
                  curvature: 0.06
                });
              }
            } else if (b.level < 4 && branches.length < 600) {
              const splitCount = Math.random() < 0.7 ? 2 : 1;
              for (let s = 0; s < splitCount; s++) {
                const spreadSign = s === 0 ? -1 : 1;
                const angleSpread = (0.35 + Math.random() * 0.3) * spreadSign;

                newBranchesToAdd.push({
                  id: nextBranchIdRef.current++,
                  parentId: b.id,
                  level: b.level + 1,
                  startX: endX,
                  startY: endY,
                  targetLength: b.targetLength * (0.65 + Math.random() * 0.2),
                  currentLength: 0,
                  baseAngle: b.baseAngle + angleSpread,
                  currentAngle: b.baseAngle + angleSpread,
                  thickness: Math.max(1.2, b.thickness * 0.65),
                  growthSpeed: Math.random() * 0.3 + 0.7,
                  hasChildren: false,
                  blossoms: [],
                  curvature: spreadSign * 0.04
                });
              }
            }
          }

          // Draw Blossoms & Leaves (only if branch is in viewport)
          for (let bl = 0; bl < b.blossoms.length; bl++) {
            const blossom = b.blossoms[bl];
            if (blossom.bloomProgress < 1.0) {
              blossom.bloomProgress = Math.min(1.0, blossom.bloomProgress + dt * 0.8);
            }
            totalBlossoms++;

            if (isVisible) {
              const bx = startX + (endX - startX) * blossom.relPos;
              const by = startY + (endY - startY) * blossom.relPos;
              const blossomSize = blossom.size * blossom.bloomProgress;

              // Fast blossom arc without heavy ctx.save/restore
              ctx.fillStyle = blossom.color;
              ctx.beginPath();
              ctx.arc(bx, by, blossomSize * 0.65, 0, Math.PI * 2);
              ctx.fill();

              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(bx, by, blossomSize * 0.2, 0, Math.PI * 2);
              ctx.fill();

              // Occasionally shed a gentle falling petal
              if (Math.random() < 0.0006 && petalsRef.current.length < 25) {
                petalsRef.current.push({
                  x: bx,
                  y: by,
                  vx: (Math.random() - 0.5) * 12,
                  vy: Math.random() * 10 + 6,
                  size: blossomSize * 0.7,
                  color: blossom.color,
                  alpha: 0.85,
                  angle: Math.random() * Math.PI * 2,
                  vAngle: (Math.random() - 0.5) * 2
                });
              }
            }
          }
        }

        if (newBranchesToAdd.length > 0) {
          branchesRef.current = [...branches, ...newBranchesToAdd];
        }

        highestPointRef.current = minY;
      }

      // 4. DRAW FLOATING PETALS
      const petals = petalsRef.current;
      for (let p = petals.length - 1; p >= 0; p--) {
        const petal = petals[p];
        petal.x += petal.vx * dt;
        petal.y += petal.vy * dt;
        petal.angle += petal.vAngle * dt;
        petal.alpha -= dt * 0.08;

        if (petal.alpha <= 0 || petal.y > 40) {
          petals.splice(p, 1);
          continue;
        }

        ctx.globalAlpha = petal.alpha;
        ctx.fillStyle = petal.color;
        ctx.beginPath();
        ctx.arc(petal.x, petal.y, petal.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // 5. DRAW TOUCH RIPPLES
      const ripples = ripplesRef.current;
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += dt * 45;
        rip.alpha -= dt * 0.7;

        if (rip.alpha <= 0) {
          ripples.splice(r, 1);
          continue;
        }

        ctx.strokeStyle = rip.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = rip.alpha;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      ctx.restore();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver.disconnect();
    };
  }, [gameState, selectedTheme, growthSpeedMult, breathSync, theme, playChime]);

  // Handle Touch / Tap on Canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    const touchY = e.clientY - rect.top;

    lastPointerYRef.current = touchY;

    // Convert to tree world coordinate space
    const originX = rect.width / 2;
    const originY = rect.height - 90;
    const worldX = touchX - originX;
    const worldY = touchY - originY + cameraYRef.current;

    // If in seed state and clicked near seed, germinate!
    if (gameState === 'seed') {
      const distToSeed = Math.sqrt(worldX * worldX + worldY * worldY);
      if (distToSeed < 70) {
        handleGerminateSeed();
        return;
      }
    }

    // Gently attract active branch tips towards tap
    if (gameState === 'growing') {
      branchesRef.current.forEach((b) => {
        if (!b.hasChildren && b.level > 0) {
          const dx = worldX - b.startX;
          const dy = worldY - b.startY;
          const targetAngle = Math.atan2(dy, dx);
          b.baseAngle += (targetAngle - b.baseAngle) * 0.15;
        }
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.buttons === 1) {
      isDraggingCameraRef.current = true;
      autoFollowCameraRef.current = false;
      const dy = e.clientY - lastPointerYRef.current;
      lastPointerYRef.current = e.clientY;
      targetCameraYRef.current -= dy * 1.5;
    }
  };

  const handlePointerUp = () => {
    isDraggingCameraRef.current = false;
  };

  // Re-center camera on top of tree
  const handleCenterCamera = () => {
    autoFollowCameraRef.current = true;
    targetCameraYRef.current = highestPointRef.current + 160;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 p-2.5 sm:p-4 w-full h-full overflow-hidden flex flex-col justify-between select-none text-left animate-fadeIn touch-none">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-zinc-800/80 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          {onSwitchTab && (
            <button
              type="button"
              onClick={() => onSwitchTab('counter')}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer"
              title="Назад"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <RefractedInfiniteSproutIcon className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wider leading-tight">
                Дерево Нескінченності
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium leading-tight">
                Медитативне проростання із зернини в небеса
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsMuted((m) => !m)}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isMuted
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-500'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-750'
            }`}
            title={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Theme Selection Bar (Single row fitted) */}
      <div className="pt-1.5 flex items-center gap-1 w-full text-xs flex-shrink-0">
        {(Object.keys(TREE_THEMES) as TreeThemeId[]).map((themeKey) => {
          const th = TREE_THEMES[themeKey];
          const isSelected = selectedTheme === themeKey;

          return (
            <button
              key={themeKey}
              type="button"
              onClick={() => setSelectedTheme(themeKey)}
              className={`flex-1 min-w-0 py-1 px-1.5 rounded-xl border transition-all text-center cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs font-bold'
                  : 'bg-slate-100/80 hover:bg-slate-200/80 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200/60 dark:border-zinc-800'
              }`}
            >
              <div className="text-[10px] sm:text-[11px] truncate font-medium">{th.name}</div>
            </button>
          );
        })}
      </div>

      {/* 4. Canvas Simulation Area (Fills available space nicely without spilling over) */}
      <div className="my-1.5 flex-1 min-h-[220px] h-full relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 dark:border-zinc-800 shadow-md bg-slate-950 flex flex-col">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full flex-1 cursor-pointer touch-none block"
        />

        {/* Live HUD Floating Stats Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none z-10 flex-wrap max-w-[80%]">

          <div className="px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Висота: {treeHeightMeters} м</span>
          </div>

          <div className="px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Рекорд: {maxHeightRecord} м</span>
          </div>

          <div className="px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs hidden sm:flex">
            <Sprout className="w-3 h-3 text-emerald-400" />
            <span>Гілок: {totalBranchesCount}</span>
          </div>
        </div>

        {/* Floating Controls Overlay */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
          {!autoFollowCameraRef.current && (
            <button
              type="button"
              onClick={handleCenterCamera}
              className="p-1.5 rounded-xl bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/15 text-white text-xs transition-colors cursor-pointer shadow-xs"
              title="Стежити за верхівкою"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Floating Start Seed Prompt if in Seed State */}
        {gameState === 'seed' && (
          <div className="absolute inset-x-0 bottom-5 flex flex-col items-center pointer-events-none animate-bounce z-10">
            <div className="px-3.5 py-1.5 rounded-2xl bg-black/65 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-bold shadow-lg">
              Торкніться сяючої зернини для проростання
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
