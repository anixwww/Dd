import React, { useEffect, useRef, useState } from 'react';

export type StandardSpaceMode = 'auto' | 'deep_space' | 'nebula' | 'aurora' | 'meteor';
export type StandardDensity = 'calm' | 'medium' | 'rich';

interface StarParticle {
  id: number;
  x: number;
  y: number;
  baseVx: number;
  baseVy: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  spectralColor: string;
  glowColor: string;
  hasRays: boolean;
  rayLength: number;
  layer: number;
  isTrapped?: boolean;
  escapeTimer?: number;
  ringOrbitRadius?: number;
  ringOrbitSpeed?: number;
  rotation?: number;
  rotSpeed?: number;
  birthFlare?: number;
  isSupernova?: boolean;
  isPulsarRemnant?: boolean;
  pulsarSpin?: number;
  isBinary?: boolean;
  binaryPartnerId?: number;
  barycenterX?: number;
  barycenterY?: number;
  barycenterVx?: number;
  barycenterVy?: number;
  binaryOrbitRadius?: number;
  binaryOrbitAngle?: number;
  binaryOrbitSpeed?: number;
  capturedByStarId?: number;
  capturedOrbitAngle?: number;
  capturedOrbitRadius?: number;
  capturedOrbitSpeed?: number;
  isMergedGiant?: boolean;
  mergeCount?: number;
  dyingAge?: number;
  isAbsorbed?: boolean;
  isRedStar?: boolean;
  isRedDwarf?: boolean;
  redFadeTimer?: number;
  redFadeDuration?: number;
  initialAlpha?: number;
  constellationId?: number;
  binaryAge?: number;
  hasCapturedPlanet?: boolean;
  isStableBinary?: boolean;
  binaryWillMerge?: boolean;
  isRedGiant?: boolean;
  redGiantAge?: number;
  redGiantMaxAge?: number;
  isNeutronStar?: boolean;
  neutronLife?: number;
  neutronMaxLife?: number;
  neutronSpinSpeed?: number;
  neutronSpinAngle?: number;
  neutronPhase?: 'spinning' | 'exploding' | 'faded';
  neutronTimer?: number;
  constellationBarycentricOffsetX?: number;
  constellationBarycentricOffsetY?: number;
  microPuff?: number;
}

interface ConstellationFormation {
  id: number;
  starIds: number[];
  edges: Array<[number, number]>;
  elapsed: number;
  duration: number;
  alpha: number;
  barycenterX?: number;
  barycenterY?: number;
  barycenterVx?: number;
  barycenterVy?: number;
}

interface NeutronHaloExplosion {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  haloThickness: number;
  alpha: number;
  elapsed: number;
  duration: number;
  color: string;
}

interface SupernovaEjecta {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  glowColor: string;
  element: 'Hydrogen' | 'Oxygen' | 'Nickel' | 'Iron';
  decay: number;
}

interface SupernovaExplosion {
  id: number;
  starId: number;
  x: number;
  y: number;
  stage: 'pulsing' | 'implosion' | 'breakout' | 'blast' | 'remnant';
  elapsed: number;
  totalTime: number;
  progenitorRadius: number;
  progenitorColor: string;
  progenitorGlow: string;
  flashRadius: number;
  flashAlpha: number;
  shockwaveRadius: number;
  maxShockwaveRadius: number;
  diffractionR: number;
  synchrotronR: number;
  synchrotronAlpha: number;
  synchrotronTilt: number;
  ejecta: SupernovaEjecta[];
  hasSpawnedHaloInfants?: boolean;
}

interface CosmicNebula {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  colorInner: string;
  colorOuter: string;
  vx: number;
  vy: number;
  pulsePhase: number;
  pulseSpeed: number;
  maxAlpha: number;
}

export type MeteorKind = 'dart' | 'grazer' | 'bolide' | 'pair' | 'sporadic';

interface MeteorPoint {
  x: number;
  y: number;
  speed: number;
  alpha: number;
  width: number;
}

interface PersistentTrain {
  points: Array<{ x: number; y: number; width: number; alpha: number }>;
  color: string;
  glowColor: string;
  alpha: number;
  decayRate: number;
  expansionRate: number;
  driftVx: number;
  driftVy: number;
}

interface MeteorSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
  temperature: number; // 1.0 (white hot) -> 0.0 (ember red)
}

interface MeteorFragment {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  tailColor: string;
  history: Array<{ x: number; y: number }>;
}

interface AirburstFlash {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface Meteor {
  id: number;
  kind: MeteorKind;
  x: number;
  y: number;
  startX: number;
  startY: number;
  vx: number;
  vy: number;
  z: number;
  initialSpeed: number;
  speed: number;
  mass: number;
  initialMass: number;
  density: number;
  luminosity: number;
  life: number;
  maxLife: number;
  color: string;
  coreColor: string;
  tailColor: string;
  glowColor: string;
  active: boolean;
  size: number;
  isBolide: boolean;
  flaresLeft: number;
  nextFlareProgress: number;
  spectralType: string;
  history: MeteorPoint[];
  sparkles: MeteorSpark[];
  fragments: MeteorFragment[];
  activeTrain?: PersistentTrain;
  wavePhase?: number;
  waveSpeed?: number;
}

interface StarlightGlow {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  sparks: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    size: number;
    color: string;
  }>;
}

interface StardustMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number;
  driftPhase: number;
  isTrapped?: boolean;
  escapeTimer?: number;
  ringOrbitRadius?: number;
  ringOrbitSpeed?: number;
}

export interface AsteroidSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export interface GravitationalWave {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  strength: number;
  alpha: number;
}

export interface Asteroid {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  shapePoints: number[];
  capturedByStarId?: number;
  capturedByBinaryId?: number;
  capturedByConstellationId?: number;
  orbitAngle?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitEccentricity?: number;
  orbitPeriapsisAngle?: number;
  slingshotCooldown?: number;
  isShredded?: boolean;
}

export type PlanetStage = 'rock' | 'volcanic' | 'ice' | 'water_land' | 'lung_breath' | 'verdant';

export interface EvolvingPlanet {
  id: number;
  hostStarId?: number;
  capturedByBinaryId?: number;
  capturedByConstellationId?: number;
  capturedBinaryBarycenterX?: number;
  capturedBinaryBarycenterY?: number;
  x: number;
  y: number;
  radius: number;
  orbitAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitEccentricity?: number;
  orbitPeriapsisAngle?: number;
  stage: PlanetStage;
  stageTimer: number;
  rotation: number;
  rotSpeed: number;
  continents: Array<{ cx: number; cy: number; r: number }>;
  breathPulse: number;
  collisionFlash: number;
  zoneType?: 'scorching' | 'habitable' | 'frozen';
}

export interface CumulusPuff {
  dx: number;
  dy: number;
  r: number;
  alphaMult: number;
}

export interface FaintCumulusNebula {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  puffs: CumulusPuff[];
  colorCore: string;
  colorGlow: string;
  colorOuter: string;
  targetMaxAlpha: number;
  alpha: number;
  age: number;
  duration: number;
  pulsePhase: number;
  pulseSpeed: number;
}

export interface PlanetaryDebris {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  glowColor: string;
  rotation: number;
  rotSpeed: number;
  shapePoints: number[];
  life: number;
  maxLife: number;
}

export const StardustBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Storage / Mode state
  const [spaceMode, setSpaceMode] = useState<StandardSpaceMode>(() => {
    try {
      return (localStorage.getItem('quit-smoking:standard-space-mode') as StandardSpaceMode) || 'auto';
    } catch {
      return 'auto';
    }
  });

  const [density, setDensity] = useState<StandardDensity>(() => {
    try {
      return (localStorage.getItem('quit-smoking:standard-density') as StandardDensity) || 'medium';
    } catch {
      return 'medium';
    }
  });

  const [isPerfBoost, setIsPerfBoost] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:perf-boost') === 'true';
    } catch {
      return false;
    }
  });

  const [meteorIntensity, setMeteorIntensity] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:meteor-intensity');
      if (saved) return parseFloat(saved) || 1.0;
    } catch {}
    return 1.0; // minimal intensity by default
  });

  const [starCountSetting, setStarCountSetting] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:star-count');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 35; // medium intensity by default
  });

  // Auto-FPS Guard: Dynamic Frame Budget Monitor
  const perfFrameTimesRef = useRef<number[]>([]);
  const isLowFpsModeRef = useRef<boolean>(false);

  // Time of day calculation
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 22 || currentHour < 6;
  const isDawn = currentHour >= 6 && currentHour < 9;
  const isSunset = currentHour >= 18 && currentHour < 22;
  const isDay = !isNight && !isDawn && !isSunset;

  // Listen for custom events from MoreTab
  useEffect(() => {
    const handleModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode: StandardSpaceMode }>;
      if (customEvent.detail?.mode) {
        setSpaceMode(customEvent.detail.mode);
      }
    };

    const handleDensityChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ density: StandardDensity }>;
      if (customEvent.detail?.density) {
        setDensity(customEvent.detail.density);
      }
    };

    const handleMeteorIntensityChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ intensity: number }>;
      if (typeof customEvent.detail?.intensity === 'number') {
        setMeteorIntensity(customEvent.detail.intensity);
      }
    };

    const handleStarCountChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ count: number }>;
      if (typeof customEvent.detail?.count === 'number') {
        setStarCountSetting(customEvent.detail.count);
      }
    };

    const handlePerfChange = () => {
      try {
        setIsPerfBoost(localStorage.getItem('quit-smoking:perf-boost') === 'true');
      } catch {}
    };

    window.addEventListener('standard-space-change', handleModeChange);
    window.addEventListener('standard-density-change', handleDensityChange);
    window.addEventListener('meteor-intensity-change', handleMeteorIntensityChange);
    window.addEventListener('star-count-change', handleStarCountChange);
    window.addEventListener('perf-boost-change', handlePerfChange);

    return () => {
      window.removeEventListener('standard-space-change', handleModeChange);
      window.removeEventListener('standard-density-change', handleDensityChange);
      window.removeEventListener('meteor-intensity-change', handleMeteorIntensityChange);
      window.removeEventListener('star-count-change', handleStarCountChange);
      window.removeEventListener('perf-boost-change', handlePerfChange);
    };
  }, []);

  // Main Canvas Particle Animation Engine
  useEffect(() => {
    if (isPerfBoost) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isRunning = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Star count determined by density mode and star count setting (pinned to minimum by default)
    const densityMult = density === 'calm' ? 0.6 : density === 'rich' ? 1.5 : 1.0;
    const baseCount = starCountSetting;
    const initialStarCount = Math.round(baseCount * densityMult);
    const MAX_STAR_LIMIT = initialStarCount + 20; // Ліміт: до +20 зірок від кліків, після якого кількість не зростає
    const starCount = initialStarCount;

    // Spectral stellar colors: Cool O/B sapphire, diamond white, solar gold, celestial amethyst, rosy quasar, crimson red dwarf
    const spectralPalettes = [
      { star: '#ffffff', glow: '#60a5fa' }, // Diamond with sapphire halo
      { star: '#f0f9ff', glow: '#38bdf8' }, // Cyan beacon
      { star: '#fef08a', glow: '#f59e0b' }, // Solar gold dwarf
      { star: '#fbcfe8', glow: '#ec4899' }, // Rosy quartz star
      { star: '#e0e7ff', glow: '#818cf8' }, // Indigo starlight
      { star: '#cffafe', glow: '#06b6d4' }, // Aquamarine
      { star: '#f87171', glow: '#dc2626' }, // Crimson red star (повільно згасає)
      { star: '#ffffff', glow: '#ffffff' }, // Pure radiant white
    ];

    // Shared Barycenter for the guaranteed Binary Star System (Подвійна зоряна система)
    const initBaryX = Math.random() * (width * 0.7) + width * 0.15;
    const initBaryY = Math.random() * (height * 0.7) + height * 0.15;
    const initBaryVx = (Math.random() - 0.5) * 0.08;
    const initBaryVy = (Math.random() - 0.5) * 0.06;

    const stars: StarParticle[] = Array.from({ length: starCount }, (_, i) => {
      // Stars 0 & 1 form a pristine binary star system orbiting their shared barycenter
      if (i === 0 || i === 1) {
        const isPrimary = i === 0;
        const orbitR = isPrimary ? 13 : 17;
        const orbitAngle = isPrimary ? 0 : Math.PI;
        const baseRadius = isPrimary ? 2.2 : 1.6;
        return {
          id: i,
          x: initBaryX + Math.cos(orbitAngle) * orbitR,
          y: initBaryY + Math.sin(orbitAngle) * orbitR,
          baseVx: initBaryVx,
          baseVy: initBaryVy,
          vx: 0,
          vy: 0,
          radius: baseRadius,
          baseRadius,
          alpha: 0.95,
          baseAlpha: 0.95,
          pulseSpeed: 1.2,
          pulsePhase: isPrimary ? 0 : Math.PI,
          spectralColor: isPrimary ? '#f0f9ff' : '#fef08a', // Blue giant & Gold companion
          glowColor: isPrimary ? '#38bdf8' : '#f59e0b',
          hasRays: isPrimary,
          rayLength: isPrimary ? 16 : 8,
          layer: 2,
          rotation: 0,
          rotSpeed: 0.1,
          isBinary: true,
          isStableBinary: true,
          binaryWillMerge: false,
          binaryPartnerId: isPrimary ? 1 : 0,
          barycenterX: initBaryX,
          barycenterY: initBaryY,
          barycenterVx: initBaryVx,
          barycenterVy: initBaryVy,
          binaryOrbitRadius: orbitR,
          binaryOrbitAngle: orbitAngle,
          binaryOrbitSpeed: 0.65,
        };
      }

      const palette = spectralPalettes[i % spectralPalettes.length];
      const isRed = palette.star === '#f87171';
      const layer = Math.random() < 0.2 ? 2 : Math.random() < 0.6 ? 1 : 0;
      const baseRadius = layer === 2 ? Math.random() * 1.5 + 1.4 : layer === 1 ? Math.random() * 0.9 + 0.8 : Math.random() * 0.5 + 0.4;
      const baseAlpha = layer === 2 ? Math.random() * 0.4 + 0.6 : layer === 1 ? Math.random() * 0.4 + 0.4 : Math.random() * 0.3 + 0.2;
      const hasRays = layer === 2 && Math.random() < 0.65;

      return {
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        baseVx: (Math.random() - 0.5) * (layer === 2 ? 0.15 : 0.08),
        baseVy: (Math.random() - 0.5) * 0.1 - (layer === 2 ? 0.05 : 0.02),
        vx: 0,
        vy: 0,
        radius: baseRadius,
        baseRadius,
        alpha: baseAlpha,
        baseAlpha,
        initialAlpha: baseAlpha,
        pulseSpeed: Math.random() * 1.6 + 0.6,
        pulsePhase: Math.random() * Math.PI * 2,
        spectralColor: palette.star,
        glowColor: palette.glow,
        hasRays,
        rayLength: baseRadius * (Math.random() * 5 + 6),
        layer,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() < 0.5 ? -1 : 1) * (0.05 + Math.random() * 0.15),
        isRedStar: isRed,
        isRedDwarf: isRed,
        redFadeTimer: 0,
        redFadeDuration: 35.0 + Math.random() * 15.0,
      };
    });

    // Static Single-Layer Cosmic Nebula (Pre-rendered for optimal performance & thermal efficiency)
    let staticNebulaCanvas: HTMLCanvasElement | null = null;
    try {
      staticNebulaCanvas = document.createElement('canvas');
      staticNebulaCanvas.width = width;
      staticNebulaCanvas.height = height;
      const sCtx = staticNebulaCanvas.getContext('2d');
      if (sCtx) {
        // Single gentle ethereal celestial gradient
        const cx1 = width * 0.40;
        const cy1 = height * 0.32;
        const r1 = Math.min(width, height) * 0.48;
        const grad1 = sCtx.createRadialGradient(cx1, cy1, 0, cx1, cy1, r1);
        grad1.addColorStop(0, 'rgba(99, 102, 241, 0.08)');  // Subtle Indigo
        grad1.addColorStop(0.5, 'rgba(168, 85, 247, 0.035)'); // Subtle Purple
        grad1.addColorStop(1, 'rgba(15, 23, 42, 0)');
        sCtx.fillStyle = grad1;
        sCtx.beginPath();
        sCtx.arc(cx1, cy1, r1, 0, Math.PI * 2);
        sCtx.fill();

        const cx2 = width * 0.68;
        const cy2 = height * 0.65;
        const r2 = Math.min(width, height) * 0.42;
        const grad2 = sCtx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r2);
        grad2.addColorStop(0, 'rgba(6, 182, 212, 0.06)');   // Subtle Cyan
        grad2.addColorStop(0.6, 'rgba(56, 189, 248, 0.02)');
        grad2.addColorStop(1, 'rgba(15, 23, 42, 0)');
        sCtx.fillStyle = grad2;
        sCtx.beginPath();
        sCtx.arc(cx2, cy2, r2, 0, Math.PI * 2);
        sCtx.fill();
      }
    } catch {}

    // Planetary Cosmic Debris (Шматки планетарного сміття після вибуху)
    const planetaryDebris: PlanetaryDebris[] = [];

    const triggerPlanetExplosion = (ep: EvolvingPlanet) => {
      // Atmospheric airburst shockwave
      airburstFlashes.push({
        x: ep.x,
        y: ep.y,
        radius: ep.radius * 2,
        maxRadius: ep.radius * 13,
        alpha: 0.85,
        color: '#34d399',
      });

      // Spawn 24 to 36 pieces of planetary cosmic debris
      const debrisColors = ['#059669', '#34d399', '#3b82f6', '#1d4ed8', '#f59e0b', '#78716c', '#44403c', '#e0f2fe'];
      const glowColors = ['#34d399', '#60a5fa', '#fcd34d', '#94a3b8'];

      for (let d = 0; d < 30; d++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.8 + 0.5;
        const numPts = Math.floor(Math.random() * 3) + 5;
        const shapePoints = Array.from({ length: numPts }, () => 0.6 + Math.random() * 0.6);

        planetaryDebris.push({
          id: Math.random(),
          x: ep.x + Math.cos(angle) * (ep.radius * 0.4),
          y: ep.y + Math.sin(angle) * (ep.radius * 0.4),
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.3,
          vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.5 + 0.7,
          alpha: 1.0,
          color: debrisColors[Math.floor(Math.random() * debrisColors.length)],
          glowColor: glowColors[Math.floor(Math.random() * glowColors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 3.5,
          shapePoints,
          life: 0,
          maxLife: Math.random() * 6.0 + 7.0, // Drifts and disappears over 7-13s
        });
      }
    };
    const moteCount = Math.round(35 * densityMult);
    const motes: StardustMote[] = Array.from({ length: moteCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.25 - 0.05,
      size: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.6 + 0.15,
      hue: Math.random() > 0.5 ? 190 + Math.random() * 60 : 270 + Math.random() * 40,
      driftPhase: Math.random() * Math.PI * 2,
    }));

    // Cosmic Asteroids (космічні тіла / шматки каміння - вкрай рідко, 1-2 шт)
    const asteroidCount = 2;
    const asteroids: Asteroid[] = Array.from({ length: asteroidCount }, (_, i) => {
      const numPts = 7;
      const shapePoints = Array.from({ length: numPts }, () => 0.6 + Math.random() * 0.65);
      return {
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        size: Math.random() * 1.4 + 2.0,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.7,
        shapePoints,
      };
    });

    // Asteroid collision sparks & Spacetime Gravitational Wave ripple arrays
    const asteroidSparks: AsteroidSpark[] = [];
    const gravitationalWaves: GravitationalWave[] = [];

    // Exactly ONE evolving planetary genesis system (на весь екран всього одна така система)
    let evolvingPlanet: EvolvingPlanet | null = null;

    // Constellations Engine (Інколи зірки не притягуються, а утворюють сузірʼя)
    const constellations: ConstellationFormation[] = [];
    let nextConstellationCheck = 2.5;

    // Neutron Star Halo Explosions
    const neutronHaloExplosions: NeutronHaloExplosion[] = [];
    let nextBinaryFormCheck = 6.0;

    // Dynamic Meteors / Shooting Stars with Simulator Physics & Diverse Archetypes
    const meteors: Meteor[] = [];
    const persistentTrains: PersistentTrain[] = [];
    const airburstFlashes: AirburstFlash[] = [];
    let nextMeteorTime = performance.now() + 1200;

    const spawnMeteor = (
      customX?: number,
      customY?: number,
      forcedKind?: MeteorKind,
      forcedAngle?: number,
      isPairChild = false
    ) => {
      // Determine archetype if not forced
      let kind: MeteorKind = forcedKind ?? 'dart';
      if (!forcedKind) {
        const randKind = Math.random();
        if (randKind < 0.40) {
          kind = 'dart';        // 40% hypersonic razor-sharp needle
        } else if (randKind < 0.62) {
          kind = 'grazer';      // 22% horizon earthgrazer spanning wide sky
        } else if (randKind < 0.78) {
          kind = 'pair';        // 16% twin synchronized shooting stars
        } else if (randKind < 0.92) {
          kind = 'bolide';      // 14% luminous exploding fireball
        } else {
          kind = 'sporadic';    // 8% deep distant gentle shooting star
        }
      }

      const isBolide = kind === 'bolide';
      const isGrazer = kind === 'grazer';
      const isDart = kind === 'dart';
      const isSporadic = kind === 'sporadic';

      // 3D perspective depth factor
      let z = 1.0;
      if (isSporadic) {
        z = Math.random() * 0.25 + 0.45; // Distant & ethereal
      } else if (isBolide) {
        z = Math.random() * 0.25 + 0.95; // Close & powerful
      } else if (isGrazer) {
        z = Math.random() * 0.35 + 0.75;
      } else {
        z = Math.random() * 0.45 + 0.70;
      }

      // Diverse radiant trajectories and natural entry points
      let angle = forcedAngle;
      let startX: number;
      let startY: number;

      if (angle === undefined) {
        if (isGrazer) {
          // Earthgrazer: shallow horizontal flight (left-to-right or right-to-left)
          const fromLeft = Math.random() < 0.55;
          if (fromLeft) {
            angle = (Math.random() * 0.18 + 0.08); // ~5° to 15° down-right
            startX = customX ?? -25;
            startY = customY ?? (Math.random() * (height * 0.38) + 15);
          } else {
            angle = Math.PI - (Math.random() * 0.18 + 0.08); // ~165° to 175° down-left
            startX = customX ?? (width + 25);
            startY = customY ?? (Math.random() * (height * 0.38) + 15);
          }
        } else {
          const randDir = Math.random();
          if (randDir < 0.45) {
            // Radiant 1: North-West heading East-South-East (down-right, ~30° to 55°)
            angle = (Math.PI * 0.22) + (Math.random() - 0.5) * 0.42;
            startX = customX ?? (Math.random() * (width * 0.75) - 20);
            startY = customY ?? (Math.random() * (height * 0.20) - 25);
          } else if (randDir < 0.80) {
            // Radiant 2: North-East heading West-South-West (down-left, ~125° to 150°)
            angle = (Math.PI * 0.78) + (Math.random() - 0.5) * 0.40;
            startX = customX ?? (width * 0.25 + Math.random() * (width * 0.75) + 20);
            startY = customY ?? (Math.random() * (height * 0.20) - 25);
          } else {
            // Radiant 3: Zenith plunge (steep descent, ~75° to 105°)
            angle = (Math.PI * 0.50) + (Math.random() - 0.5) * 0.30;
            startX = customX ?? (Math.random() * width);
            startY = customY ?? -25;
          }
        }
      } else {
        startX = customX ?? (Math.random() * width);
        startY = customY ?? (Math.random() * (height * 0.25));
      }

      // Archetype-tailored hypersonic speeds
      let speed: number;
      if (isDart) {
        speed = (Math.random() * 14 + 32) * z; // 32 - 46 px/frame
      } else if (isGrazer) {
        speed = (Math.random() * 8 + 20) * z;  // 20 - 28 px/frame
      } else if (isBolide) {
        speed = (Math.random() * 10 + 24) * z; // 24 - 34 px/frame
      } else if (isSporadic) {
        speed = (Math.random() * 6 + 15) * z;  // 15 - 21 px/frame
      } else {
        speed = (Math.random() * 10 + 26) * z;
      }

      // Initial physical mass
      const initialMass = isBolide 
        ? Math.random() * 45 + 28 
        : isGrazer 
        ? Math.random() * 12 + 6 
        : Math.random() * 2.5 + 0.5;

      // Refined, sleek physical sizes (no fat smudges!)
      const size = isBolide
        ? (Math.random() * 0.6 + 1.8) * z // 1.8 - 2.4
        : isGrazer
        ? (Math.random() * 0.4 + 1.0) * z // 1.0 - 1.4
        : isSporadic
        ? (Math.random() * 0.3 + 0.6) * z // 0.6 - 0.9
        : (Math.random() * 0.4 + 0.9) * z; // 0.9 - 1.3

      // Lifetime across screen
      const maxLife = isGrazer
        ? Math.floor((Math.random() * 28 + 48) / z) // Long graceful traversal
        : isDart
        ? Math.floor((Math.random() * 8 + 14) / z)  // Ultra swift flash
        : isBolide
        ? Math.floor((Math.random() * 20 + 34) / z) // Dramatic incandescence
        : Math.floor((Math.random() * 14 + 22) / z);

      // Chemical Element Emission Spectra
      const SPECTRA = [
        {
          name: 'perseid_emerald', // Perseid emerald/teal (Mg I + O I)
          core: '#ffffff',
          head: '#a7f3d0',
          tail: '#059669',
          glow: 'rgba(5, 150, 105, 0.32)',
        },
        {
          name: 'leonid_azure', // Leonid electric cyan diamond (Si + N2)
          core: '#ffffff',
          head: '#bae6fd',
          tail: '#0284c7',
          glow: 'rgba(2, 132, 199, 0.32)',
        },
        {
          name: 'geminid_gold', // Geminid champagne gold (Na D + Fe)
          core: '#fffbeb',
          head: '#fef08a',
          tail: '#d97706',
          glow: 'rgba(217, 119, 6, 0.32)',
        },
        {
          name: 'lyrid_violet', // Taurid / Lyrid violet-rose (Ca+ + Fe)
          core: '#ffffff',
          head: '#ede9fe',
          tail: '#7c3aed',
          glow: 'rgba(124, 58, 237, 0.32)',
        },
        {
          name: 'orionid_rose', // Orionid rose opal
          core: '#ffffff',
          head: '#fce7f3',
          tail: '#e11d48',
          glow: 'rgba(225, 29, 72, 0.32)',
        },
        {
          name: 'comet_platinum', // Pure pristine cometary ice
          core: '#ffffff',
          head: '#f8fafc',
          tail: '#94a3b8',
          glow: 'rgba(148, 163, 184, 0.28)',
        },
      ];

      const spec = isBolide 
        ? (Math.random() < 0.55 
            ? { name: 'bolide_gold', core: '#ffffff', head: '#fef08a', tail: '#ea580c', glow: 'rgba(234, 88, 12, 0.45)' }
            : { name: 'bolide_cyan', core: '#ffffff', head: '#ccfbf1', tail: '#0284c7', glow: 'rgba(2, 132, 199, 0.45)' })
        : SPECTRA[Math.floor(Math.random() * SPECTRA.length)];

      meteors.push({
        id: Math.random(),
        kind,
        startX,
        startY,
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        z,
        initialSpeed: speed,
        speed,
        mass: initialMass,
        initialMass,
        density: Math.random() * 1.2 + 2.8,
        luminosity: 0,
        life: 0,
        maxLife,
        color: spec.head,
        coreColor: spec.core,
        tailColor: spec.tail,
        glowColor: spec.glow,
        active: true,
        size,
        isBolide,
        flaresLeft: isBolide ? Math.floor(Math.random() * 2 + 1) : 0,
        nextFlareProgress: isBolide ? (0.60 + Math.random() * 0.18) : 1.0,
        spectralType: spec.name,
        history: [{ x: startX, y: startY, speed, alpha: 0, width: size }],
        sparkles: [],
        fragments: [],
        wavePhase: Math.random() * Math.PI * 2,
        waveSpeed: 0.15 + Math.random() * 0.25,
      });

      // Spawn matching twin meteor for 'pair' archetype
      if (kind === 'pair' && !isPairChild) {
        setTimeout(() => {
          const staggerDist = 28 + Math.random() * 32;
          const perpAngle = angle + Math.PI / 2;
          const offsetPerp = (Math.random() - 0.5) * 36;
          spawnMeteor(
            startX - Math.cos(angle) * staggerDist + Math.cos(perpAngle) * offsetPerp,
            startY - Math.sin(angle) * staggerDist + Math.sin(perpAngle) * offsetPerp,
            'dart',
            angle + (Math.random() - 0.5) * 0.04,
            true
          );
        }, 90 + Math.random() * 160);
      }
    };

    // Delicate Starlight Glow (Зоряне сяйво) on screen click
    const starlightGlows: StarlightGlow[] = [];

    const spawnStarlightGlow = (px: number, py: number) => {
      const sparkCount = 5;
      const sparks = Array.from({ length: sparkCount }, () => {
        const theta = Math.random() * Math.PI * 2;
        const spd = Math.random() * 1.5 + 0.5;
        return {
          x: px,
          y: py,
          vx: Math.cos(theta) * spd,
          vy: Math.sin(theta) * spd,
          alpha: 0.85,
          size: Math.random() * 1.2 + 0.6,
          color: Math.random() > 0.5 ? '#a5f3fc' : '#e0f2fe',
        };
      });

      starlightGlows.push({
        id: Math.random(),
        x: px,
        y: py,
        radius: 2,
        maxRadius: 22,
        alpha: 0.75,
        color: '#67e8f9',
        sparks,
      });

      if (starlightGlows.length > 12) {
        starlightGlows.shift();
      }
    };

    // Shell Attractor & Trapped Particles Physics
    let shellX = width / 2;
    let shellY = 160;
    let shellRadius = 65;
    let isShellPresent = false;
    let shellStyle = 'cosmic_ring';

    const updateShellPos = () => {
      const el = document.getElementById('analyzer-shell-anchor');
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          shellX = rect.left + rect.width / 2;
          shellY = rect.top + rect.height / 2;
          shellRadius = 65; // Radius of the visual analyzer shell orb
          isShellPresent = true;
          shellStyle = el.getAttribute('data-shell-style') || localStorage.getItem('quit-smoking:analyzer-visual-style') || 'cosmic_ring';
          return;
        }
      }
      isShellPresent = false;
    };
    updateShellPos();

    // Disperse ONLY particles trapped in/near the Shell when clicking the shell center
    const disperseShellParticles = (originX?: number, originY?: number) => {
      updateShellPos();
      const ox = originX ?? shellX;
      const oy = originY ?? shellY;

      // 1. Scatter ONLY trapped stars that were drawn into the Analyzer
      stars.forEach((s) => {
        const dx = s.x - ox;
        const dy = s.y - oy;
        const dist = Math.hypot(dx, dy);
        if (s.isTrapped || dist <= shellRadius + 12) {
          s.isTrapped = false;
          s.escapeTimer = 2.4; // 2.4s grace period before being pulled back in
          s.ringOrbitRadius = undefined;
          s.ringOrbitSpeed = undefined;
          const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.6;
          const speed = Math.random() * 7.5 + 5.0;
          s.vx = Math.cos(angle) * speed;
          s.vy = Math.sin(angle) * speed;
        }
      });

      // 2. Scatter ONLY trapped stardust motes (пилинки) that were drawn into the Analyzer
      motes.forEach((m) => {
        const dx = m.x - ox;
        const dy = m.y - oy;
        const dist = Math.hypot(dx, dy);
        if (m.isTrapped || dist <= shellRadius + 12) {
          m.isTrapped = false;
          m.escapeTimer = 2.4;
          m.ringOrbitRadius = undefined;
          m.ringOrbitSpeed = undefined;
          const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.7;
          const speed = Math.random() * 8.5 + 5.5;
          m.vx = Math.cos(angle) * speed;
          m.vy = Math.sin(angle) * speed;
        }
      });

      // 3. Delicate starlight glow (skip center flash for cosmic ring)
      if (shellStyle !== 'cosmic_ring') {
        spawnStarlightGlow(ox, oy);
      }
    };

    const handleShellBurstEvent = (e: any) => {
      updateShellPos();
      // Shell burst/click event is dispatched directly when clicking on the analyzer shell
      disperseShellParticles(shellX, shellY);
    };

    window.addEventListener('analyzer-shell-burst', handleShellBurstEvent);
    window.addEventListener('analyzer-shell-click', handleShellBurstEvent);
    window.addEventListener('scroll', updateShellPos, { passive: true });

    // Pointer gravitational lensing & interactive disturbance
    let pointerX = -1000;
    let pointerY = -1000;
    let isPointerDown = false;

    const handlePointerMove = (e: MouseEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        pointerX = e.touches[0].clientX;
        pointerY = e.touches[0].clientY;
      }
    };

    // Клік по екрану може створити до 20 зірок, досягнувши ліміту MAX_STAR_LIMIT
    const spawnStarAtClick = (clickX: number, clickY: number) => {
      // Якщо досягнуто максимальний ліміт (+20 зірок), кількість зірок уже не зростає
      if (stars.length >= MAX_STAR_LIMIT) {
        spawnStarlightGlow(clickX, clickY);
        return;
      }

      const palette = spectralPalettes[Math.floor(Math.random() * spectralPalettes.length)];
      const isMajor = Math.random() < 0.28;
      const layer = isMajor ? 2 : Math.random() < 0.6 ? 1 : 0;
      const baseRadius = layer === 2
        ? Math.random() * 1.5 + 1.4
        : layer === 1
          ? Math.random() * 0.9 + 0.8
          : Math.random() * 0.5 + 0.4;
      const baseAlpha = layer === 2
        ? Math.random() * 0.35 + 0.65
        : layer === 1
          ? Math.random() * 0.35 + 0.45
          : Math.random() * 0.3 + 0.25;
      const hasRays = layer === 2 && Math.random() < 0.7;

      // Add newly created star at exact click point with birth flare
      stars.push({
        id: Math.random(),
        x: clickX,
        y: clickY,
        baseVx: (Math.random() - 0.5) * (layer === 2 ? 0.15 : 0.08),
        baseVy: (Math.random() - 0.5) * 0.1 - (layer === 2 ? 0.05 : 0.02),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: baseRadius,
        baseRadius,
        alpha: 1.0,
        baseAlpha,
        pulseSpeed: Math.random() * 1.8 + 0.8,
        pulsePhase: Math.random() * Math.PI * 2,
        spectralColor: palette.star,
        glowColor: palette.glow,
        hasRays,
        rayLength: baseRadius * (Math.random() * 5 + 6),
        layer,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() < 0.5 ? -1 : 1) * (0.05 + Math.random() * 0.15),
        birthFlare: 1.0,
      });

      // Subtle birth starlight glow
      spawnStarlightGlow(clickX, clickY);
    };

    // Adopt detached stars from the Cosmic Ring's spiral arms into the Theme
    const handleArmStarDetached = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;

      // Keep total star count within bounds
      if (stars.length >= MAX_STAR_LIMIT) {
        let maxDistSq = -1;
        let removeIdx = 0;
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          if (s.isTrapped || s.isSupernova || s.isPulsarRemnant || s.isBinary) continue;
          const distSq = (s.x - detail.x) * (s.x - detail.x) + (s.y - detail.y) * (s.y - detail.y);
          if (distSq > maxDistSq) {
            maxDistSq = distSq;
            removeIdx = i;
          }
        }
        stars.splice(removeIdx, 1);
      }

      stars.push({
        id: Math.random(),
        x: detail.x,
        y: detail.y,
        baseVx: (detail.vx || 0) * 0.35,
        baseVy: (detail.vy || 0) * 0.35,
        vx: detail.vx || 0,
        vy: detail.vy || 0,
        radius: detail.radius || 1.1,
        baseRadius: detail.radius || 1.1,
        alpha: 0.95,
        baseAlpha: 0.75,
        pulseSpeed: Math.random() * 1.5 + 0.8,
        pulsePhase: Math.random() * Math.PI * 2,
        spectralColor: detail.spectralColor || '#ffffff',
        glowColor: detail.glowColor || '#60a5fa',
        hasRays: false,
        rayLength: 0,
        layer: 0,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() < 0.5 ? -1 : 1) * 0.1,
        birthFlare: 0.7,
      });
    };

    // Supernova Simulation (removed per user request)
    const supernovae: SupernovaExplosion[] = [];

    const triggerSupernovaAt = (x: number, y: number) => {
      // Supernova explosions disabled
    };

    const handlePointerDown = (e: MouseEvent) => {
      isPointerDown = true;
      updateShellPos();
      const distToCenter = Math.hypot(e.clientX - shellX, e.clientY - shellY);

      // Disperse trapped particles ONLY when clicking directly on the center analyzer shell orb
      if (isShellPresent && distToCenter <= 75) {
        disperseShellParticles(shellX, shellY);
        return;
      }

      // Check if user clicked directly on or near a Giant star (isMergedGiant, Red Giant, or Massive Star)!
      let clickedGiant = false;
      for (let sIdx = 0; sIdx < stars.length; sIdx++) {
        const st = stars[sIdx];
        if (st.isMergedGiant || st.isRedStar || (st.layer >= 2 && st.radius >= 2.8)) {
          const dToStar = Math.hypot(e.clientX - st.x, e.clientY - st.y);
          if (dToStar <= Math.max(28, st.radius * 4.8)) {
            // Explode the giant into a majestic celestial Supernova!
            triggerSupernovaAt(st.x, st.y);
            st.isAbsorbed = true; // Consumed into supernova remnant
            if (navigator.vibrate) {
              try { navigator.vibrate([40, 75, 50]); } catch {}
            }
            clickedGiant = true;
            break;
          }
        }
      }
      if (clickedGiant) return;

      // "Клік по екрану у поточній темі створює одну зірку. Загальна кількість зірок на екрані не змінюється"
      spawnStarAtClick(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      isPointerDown = true;
      if (e.touches.length > 0) {
        updateShellPos();
        const tx = e.touches[0].clientX;
        const ty = e.touches[0].clientY;
        const distToCenter = Math.hypot(tx - shellX, ty - shellY);

        if (isShellPresent && distToCenter <= 75) {
          disperseShellParticles(shellX, shellY);
          return;
        }

        // Check if user touched directly on or near a Giant star!
        let clickedGiant = false;
        for (let sIdx = 0; sIdx < stars.length; sIdx++) {
          const st = stars[sIdx];
          if (st.isMergedGiant || st.isRedStar || (st.layer >= 2 && st.radius >= 2.8)) {
            const dToStar = Math.hypot(tx - st.x, ty - st.y);
            if (dToStar <= Math.max(30, st.radius * 5.0)) {
              triggerSupernovaAt(st.x, st.y);
              st.isAbsorbed = true;
              if (navigator.vibrate) {
                try { navigator.vibrate([40, 75, 50]); } catch {}
              }
              clickedGiant = true;
              break;
            }
          }
        }
        if (clickedGiant) return;

        spawnStarAtClick(tx, ty);
      }
    };

    const handlePointerUp = () => {
      isPointerDown = false;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('cosmic-arm-star-detached', handleArmStarDetached);
    window.addEventListener('trigger-supernova', () => triggerSupernovaAt(Math.random() * (width - 120) + 60, Math.random() * (height - 120) + 60));

    let lastFrameTime = performance.now();
    let frameCount = 0;

    // Smart thermal & CPU governor: Caps background rendering to 30 FPS (or 20 FPS in Eco Boost)
    const render = (timestamp: number) => {
      if (!isRunning || document.hidden) return;

      const isPerfBoost = localStorage.getItem('quit-smoking:perf-boost') === 'true';
      const targetFps = isPerfBoost ? 20 : 30; // Radical CPU cooling: 30 FPS max (20 FPS in Eco)
      const minIntervalMs = 1000 / targetFps - 2;

      const elapsed = timestamp - lastFrameTime;
      if (elapsed < minIntervalMs) {
        animId = requestAnimationFrame(render);
        return;
      }
      const dt = Math.min(elapsed * 0.001, 0.05);
      lastFrameTime = timestamp;
      const t = timestamp * 0.001;
      const frameStartMs = performance.now();

      if (frameCount % 30 === 0) {
        updateShellPos();
      }
      frameCount++;

      ctx.clearRect(0, 0, width, height);

      const isParchment = document.documentElement.getAttribute('data-app-theme') === 'parchment';
      const isDark = document.documentElement.classList.contains('dark') && !isParchment;

      if (isDark) {
        // Multi-layered refined deep space gradient - not overly dark, not overly bluish,
        // featuring balanced cosmic charcoal, slate, and subtle ethereal interstellar hues
        const voidGrad = ctx.createRadialGradient(
          width * 0.52, height * 0.42, width * 0.08,
          width * 0.5, height * 0.5, Math.max(width, height) * 0.92
        );
        voidGrad.addColorStop(0, '#151622');    // Subtle interstellar core (balanced cosmic graphite with faint warmth)
        voidGrad.addColorStop(0.25, '#12131d'); // Smooth transition to deep stellar space
        voidGrad.addColorStop(0.55, '#0e0f17'); // Rich cosmic dusk (neutral slate-charcoal)
        voidGrad.addColorStop(0.82, '#0a0b12'); // Soft deep interstellar medium
        voidGrad.addColorStop(1, '#07080d');    // Velvety non-pitch cosmic perimeter
        ctx.fillStyle = voidGrad;
        ctx.fillRect(0, 0, width, height);

        // Soft ambient deep space cross-layer to eliminate banding and add organic galactic perspective
        const subtleAmbGrad = ctx.createLinearGradient(0, 0, width, height);
        subtleAmbGrad.addColorStop(0, 'rgba(28, 25, 38, 0.07)');   // Faint warm stellar dust hint
        subtleAmbGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        subtleAmbGrad.addColorStop(1, 'rgba(18, 26, 32, 0.06)');   // Faint cool celestial undertone
        ctx.fillStyle = subtleAmbGrad;
        ctx.fillRect(0, 0, width, height);

        // 1. STATIC SINGLE-LAYER COSMIC NEBULA (Lightweight, single-pass, static)
        if (staticNebulaCanvas) {
          ctx.drawImage(staticNebulaCanvas, 0, 0);
        }
      }

      // 3. STARS UPDATE & DRAW
      stars.forEach((s) => {
        // NEUTRON STAR ISOLATION (Нейтронна зірка не притягує нічого і не притягується до чогось)
        if (s.isNeutronStar) {
          s.vx = s.baseVx || 0;
          s.vy = s.baseVy || 0;
          s.x += s.vx;
          s.y += s.vy;
          return;
        }

        // Shell Gravitational Attractor: strictly within 1 cm (~38px) from the cloud body (~48px)
        if (s.escapeTimer && s.escapeTimer > 0) {
          s.escapeTimer -= dt;
        } else if (isShellPresent) {
          const dxToCenter = s.x - shellX;
          const dyToCenter = s.y - shellY;
          const sdist = Math.hypot(dxToCenter, dyToCenter);

          // Cloud major radius is ~48px. Capture zone is strictly 1 cm (~38px) outside the cloud.
          const cloudBodyR = 48;
          const captureDistance = 38; // ~1 cm in screen pixels
          const attractRadius = cloudBodyR + captureDistance; // ~86px (pulls ONLY within 1 cm from cloud, NOT from screen center!)

          if (sdist < attractRadius && sdist > 1) {
            const distFromCloud = Math.abs(sdist - cloudBodyR);
            const pullFactor = Math.pow(Math.max(0, 1 - distFromCloud / captureDistance), 1.4);
            const angle = Math.atan2(dyToCenter, dxToCenter);

            if (shellStyle === 'cosmic_ring') {
              // Captured stars move along DIFFERENT CONCENTRIC ORBITS inside the ring
              if (!s.ringOrbitRadius) {
                // Distribute across 5 distinct concentric orbital lanes:
                // 42.5px, 45.2px, 48.0px, 50.8px, 53.5px
                const LANES = [42.5, 45.2, 48.0, 50.8, 53.5];
                const laneIdx = Math.abs(s.id) % LANES.length;
                const fineJitter = ((s.id * 13) % 7 - 3) * 0.25;
                s.ringOrbitRadius = LANES[laneIdx] + fineJitter;
                // Differential Keplerian orbital velocity: inner lanes orbit faster, outer lanes slower
                const baseSpeed = 2.8 - (s.ringOrbitRadius - 42.5) * 0.08;
                s.ringOrbitSpeed = baseSpeed * (0.92 + ((s.id * 5) % 4) * 0.05);
              }

              const targetR = s.ringOrbitRadius;
              const deltaRing = sdist - targetR;
              const ringPull = -deltaRing * 0.12 * pullFactor;
              const ux = Math.cos(angle);
              const uy = Math.sin(angle);

              s.vx += ux * ringPull * dt * 4.2;
              s.vy += uy * ringPull * dt * 4.2;

              // Tangential flow strictly along its assigned orbit lane
              const orbitSpeed = s.ringOrbitSpeed || 2.2;
              s.vx += (-uy) * pullFactor * dt * orbitSpeed;
              s.vy += ux * pullFactor * dt * orbitSpeed;

              // Center void barrier: strictly repel away from center
              if (sdist < 38) {
                const repulse = (38 - sdist) * 0.45;
                s.vx += ux * repulse;
                s.vy += uy * repulse;
              }

              if (Math.abs(deltaRing) < 6) {
                s.isTrapped = true;
                s.vx *= 0.95;
                s.vy *= 0.95;
              }
            } else {
              s.vx += (-dxToCenter / sdist) * pullFactor * dt * 3.6;
              s.vy += (-dyToCenter / sdist) * pullFactor * dt * 3.6;
              const tangX = -dyToCenter / sdist;
              const tangY = dxToCenter / sdist;
              s.vx += tangX * pullFactor * dt * 2.2;
              s.vy += tangY * pullFactor * dt * 2.2;

              if (sdist < shellRadius + 4) {
                s.isTrapped = true;
                s.vx *= 0.94;
                s.vy *= 0.94;
              }
            }
          } else if (sdist >= attractRadius) {
            s.isTrapped = false;
            s.ringOrbitRadius = undefined;
            s.ringOrbitSpeed = undefined;
          }
        }

        // Gravitational interaction with pointer
        if (pointerX > 0 && pointerY > 0) {
          const pdx = pointerX - s.x;
          const pdy = pointerY - s.y;
          const pdist = Math.hypot(pdx, pdy);
          if (pdist < 140 && pdist > 2) {
            const pull = (1 - pdist / 140) * (isPointerDown ? -4 : 0.8);
            s.vx += (pdx / pdist) * pull * dt * 3;
            s.vy += (pdy / pdist) * pull * dt * 3;
          }
        }

        // 2b. BINARY STAR SYSTEM ORBITS & MERGERS:
        // У подвійних системах де одна із зірок більша а друга менша — більша поглинає меншу!
        if (s.isBinary && s.barycenterX !== undefined && s.barycenterY !== undefined && !s.isAbsorbed && s.binaryPartnerId !== undefined) {
          s.binaryAge = (s.binaryAge || 0) + dt;
          s.barycenterX += (s.barycenterVx || 0);
          s.barycenterY += (s.barycenterVy || 0);
          if (s.barycenterX < -20) s.barycenterX = width + 20;
          if (s.barycenterX > width + 20) s.barycenterX = -20;
          if (s.barycenterY < -20) s.barycenterY = height + 20;
          if (s.barycenterY > height + 20) s.barycenterY = -20;

          const partner = stars.find((st) => st.id === s.binaryPartnerId && !st.isAbsorbed);
          if (partner) {
            partner.barycenterX = s.barycenterX;
            partner.barycenterY = s.barycenterY;

            const isDifferentSize = Math.abs(s.radius - partner.radius) >= 0.1 || Math.abs(s.baseRadius - partner.baseRadius) >= 0.1;
            const isLarger = s.radius > partner.radius || (s.radius === partner.radius && (s.baseRadius || 0) >= (partner.baseRadius || 0));

            if (isDifferentSize) {
              // У ПОДВІЙНИХ СИСТЕМАХ ДЕ ОДНА ЗІРКА БІЛЬША А ДРУГА МЕНША: БІЛЬША ПОГЛИНАЄ МЕНШУ
              const baseR = s.binaryOrbitRadius || 16.0;
              // Спіральне зближення орбіти меншої зірки до більшої
              const currentOrbitR = Math.max(0.1, baseR - s.binaryAge * 0.42);
              const orbitSpeed = (s.binaryOrbitSpeed || 0.65) + (baseR - currentOrbitR) * 0.35;

              s.binaryOrbitAngle = (s.binaryOrbitAngle || 0) + orbitSpeed * dt;

              // Більша зірка знаходиться в центрі/баріцентрі з мінімальним коливанням
              if (isLarger) {
                const largerWobble = currentOrbitR * 0.2;
                s.x = s.barycenterX + Math.cos(s.binaryOrbitAngle) * largerWobble;
                s.y = s.barycenterY + Math.sin(s.binaryOrbitAngle) * largerWobble;
              } else {
                // Менша зірка закручується по спадній спіралі навколо більшої
                s.x = s.barycenterX + Math.cos(s.binaryOrbitAngle + Math.PI) * currentOrbitR;
                s.y = s.barycenterY + Math.sin(s.binaryOrbitAngle + Math.PI) * currentOrbitR;
              }

              // МОМЕНТ ПОГЛИНАННЯ: коли менша зірка наближається впритул (< 3.6px або минув час зближення)
              if (currentOrbitR <= 3.6 || s.binaryAge >= 32.0) {
                const largerStar = isLarger ? s : partner;
                const smallerStar = isLarger ? partner : s;

                // Більша поглинає меншу
                smallerStar.isAbsorbed = true;
                smallerStar.isBinary = false;
                smallerStar.binaryPartnerId = undefined;

                largerStar.isBinary = false;
                largerStar.isStableBinary = false;
                largerStar.binaryWillMerge = false;
                largerStar.binaryPartnerId = undefined;
                largerStar.mergeCount = (largerStar.mergeCount || 0) + 1;
                largerStar.radius = Math.min(5.0, largerStar.radius + Math.max(0.4, smallerStar.radius * 0.4));
                largerStar.baseRadius = largerStar.radius;
                largerStar.birthFlare = 0.95;
                largerStar.x = s.barycenterX;
                largerStar.y = s.barycenterY;
                largerStar.vx = s.barycenterVx || largerStar.baseVx;
                largerStar.vy = s.barycenterVy || largerStar.baseVy;

                // Зоряний мікро-викид іскор при поглинанні
                for (let k = 0; k < 10; k++) {
                  const ang = Math.random() * Math.PI * 2;
                  const spd = Math.random() * 1.5 + 0.5;
                  asteroidSparks.push({
                    x: largerStar.x,
                    y: largerStar.y,
                    vx: Math.cos(ang) * spd,
                    vy: Math.sin(ang) * spd,
                    size: Math.random() * 1.1 + 0.4,
                    alpha: 0.95,
                  });
                }
              }
            } else {
              // Рівні за розміром зірки: стабільна або закручувана орбіта
              if (s.isStableBinary || !s.binaryWillMerge) {
                const orbitR = s.binaryOrbitRadius || 15.0;
                const orbitSpeed = s.binaryOrbitSpeed || 0.65;
                s.binaryOrbitAngle = (s.binaryOrbitAngle || 0) + orbitSpeed * dt;
                s.x = s.barycenterX + Math.cos(s.binaryOrbitAngle) * orbitR;
                s.y = s.barycenterY + Math.sin(s.binaryOrbitAngle) * orbitR;
              } else {
                const baseR = s.binaryOrbitRadius || 18.0;
                const currentRadius = Math.max(0.1, baseR - s.binaryAge * 0.35);
                const orbitSpeed = 0.65 + (baseR - currentRadius) * 0.28;

                s.binaryOrbitAngle = (s.binaryOrbitAngle || 0) + orbitSpeed * dt;
                s.x = s.barycenterX + Math.cos(s.binaryOrbitAngle) * currentRadius;
                s.y = s.barycenterY + Math.sin(s.binaryOrbitAngle) * currentRadius;

                if (currentRadius <= 2.5 || s.binaryAge >= 42.0) {
                  const bx = s.barycenterX;
                  const by = s.barycenterY;
                  const bvx = s.barycenterVx || 0;
                  const bvy = s.barycenterVy || 0;

                  s.isBinary = false;
                  s.isStableBinary = false;
                  s.binaryWillMerge = false;
                  s.binaryPartnerId = undefined;
                  s.isNeutronStar = true;
                  s.neutronPhase = 'spinning';
                  s.neutronTimer = 0;
                  s.neutronSpinSpeed = 24.0;
                  s.neutronSpinAngle = 0;
                  s.radius = 1.6;
                  s.baseRadius = 1.6;
                  s.spectralColor = '#ffffff';
                  s.glowColor = '#38bdf8';
                  s.baseAlpha = 1.0;
                  s.x = bx;
                  s.y = by;
                  s.vx = bvx;
                  s.vy = bvy;
                  s.birthFlare = 0.95;

                  partner.isAbsorbed = true;
                  partner.isBinary = false;
                  partner.binaryPartnerId = undefined;
                }
              }
            }
          }
        }

        // 2c. BALANCED GRAVITATIONAL CAPTURE & STAR MERGERS:
        // - ЧЕРВОНІ КАРЛИКИ ТА ГІГАНТИ НЕ ПРИТЯГУЮТЬ І НЕ ПРИТЯГУЮТЬСЯ (ПРОСТО ГАСНУТЬ)
        // - СТАБІЛЬНІ СИСТЕМИ (подвійні та сузірʼя) НЕ ПРИТЯГУЮТЬ І НЕ ПРИТЯГУЮТЬСЯ
        if (
          s.layer === 0 && 
          !s.isTrapped && 
          !s.isBinary && 
          s.binaryPartnerId === undefined &&
          !s.isAbsorbed && 
          !s.isRedStar && 
          !s.isRedDwarf &&
          !s.isRedGiant &&
          s.spectralColor !== '#f87171' && 
          s.spectralColor !== '#ef4444' &&
          s.spectralColor !== '#dc2626' &&
          s.spectralColor !== '#991b1b' &&
          s.spectralColor !== '#7f1d1d' &&
          s.constellationId === undefined
        ) {
          for (let oIdx = 0; oIdx < stars.length; oIdx++) {
            const massive = stars[oIdx];
            if (
              massive.id === s.id || 
              massive.layer < 2 || 
              massive.isMergedGiant || 
              massive.isRedGiant ||
              massive.isRedDwarf ||
              massive.isRedStar ||
              massive.isAbsorbed ||
              massive.isBinary ||
              massive.binaryPartnerId !== undefined ||
              massive.spectralColor === '#f87171' ||
              massive.spectralColor === '#ef4444' ||
              massive.spectralColor === '#dc2626' ||
              massive.spectralColor === '#991b1b' ||
              massive.spectralColor === '#7f1d1d' ||
              massive.constellationId !== undefined ||
              massive.isNeutronStar ||
              massive.isPulsarRemnant
            ) {
              continue;
            }

            // Менші зірки не можуть притягувати більші (лише більша зірка притягує меншу)
            if (massive.radius <= s.radius || massive.baseRadius <= s.baseRadius) {
              continue;
            }

            const gdx = massive.x - s.x;
            const gdy = massive.y - s.y;
            const gdist = Math.hypot(gdx, gdy);

            // COLLISION MERGER: злиття при безпосередньому зіткненні (< 5.0px)
            if (gdist < 5.0 && !massive.isBinary && massive.binaryPartnerId === undefined && !massive.isSupernova) {
              massive.mergeCount = (massive.mergeCount || 0) + 1;
              s.isAbsorbed = true;

              // ДЕЯКІ ЗІРКИ ЯКІ ПОГЛИНУЛИ БІЛЬШЕ 3-Х ЗІРОК СТАЮТЬ ЧЕРВОНИМИ КАРЛИКАМИ, ЯКІ БІЛЬШЕ НЕ ПРИТЯГУЮТЬ І НЕ ПРИТЯГУЮТЬСЯ, А ПРОСТО ЗГАСАЮТЬ!
              if (massive.mergeCount > 3) {
                massive.isRedDwarf = true;
                massive.isRedGiant = false;
                massive.isMergedGiant = false;
                massive.spectralColor = '#f87171';
                massive.glowColor = '#dc2626';
                massive.radius = Math.min(3.8, massive.radius + 0.4);
                massive.baseRadius = massive.radius;
                massive.redFadeTimer = 0;
                massive.redFadeDuration = 35.0 + Math.random() * 15.0;
                massive.birthFlare = 0.5;
                massive.initialAlpha = massive.baseAlpha || 0.85;
              } else {
                massive.radius = Math.min(4.2, massive.radius + 0.6);
                massive.baseRadius = massive.radius;
                massive.birthFlare = 0.8;
              }
              break;
            }

            // Компактне гравітаційне поле (~38px замість 85px)
            if (gdist < 38 && gdist > 5) {
              const currentSpd = Math.hypot(s.vx, s.vy);
              const pullStrength = (1.0 - gdist / 38) * (massive.radius * 0.45);
              
              s.vx += (gdx / gdist) * pullStrength * dt * 2.2;
              s.vy += (gdy / gdist) * pullStrength * dt * 2.2;

              // Tangential velocity component for orbital deflection
              const tangX = -gdy / gdist;
              const tangY = gdx / gdist;
              s.vx += tangX * pullStrength * dt * 1.6;
              s.vy += tangY * pullStrength * dt * 1.6;

              if (gdist < 16 && currentSpd < 0.25) {
                s.vx *= 0.97;
                s.vy *= 0.97;
              }
              break;
            }
          }
        }

        // 2d. RED DWARFS & RED STARS LIFECYCLE:
        // Червоний карлик коли стає червоним карликом більше не притягує інші зірки і сам не притягується, просто плавно гасне
        if ((s.isRedDwarf || s.isRedStar || s.isRedGiant || s.spectralColor === '#f87171' || s.spectralColor === '#ef4444' || s.spectralColor === '#dc2626' || s.spectralColor === '#991b1b') && !s.isNeutronStar) {
          s.redFadeTimer = (s.redFadeTimer || 0) + dt;
          const maxDuration = s.redFadeDuration || (s.isRedGiant ? (s.redGiantMaxAge || 45.0) : 38.0);
          const fadeFrac = Math.min(1.0, s.redFadeTimer / maxDuration);
          
          s.baseAlpha = Math.max(0, (s.initialAlpha || 0.85) * (1.0 - fadeFrac));
          s.radius = Math.max(0.3, s.baseRadius * (1.0 - fadeFrac * 0.35));
          
          // Вільний плавний дрейф без сторонніх притягань
          s.vx = s.baseVx;
          s.vy = s.baseVy;

          if (fadeFrac >= 1.0 || s.baseAlpha <= 0.01) {
            s.isAbsorbed = true; // Просто згасає і зникає
          }
        }

        // 2e. NEUTRON STAR: SPINS AND EXPLODES WITH SMOOTH HALO ("крутиться і вибухає створюючи плавний вибух з ореолом який повільно зникає")
        if (s.isNeutronStar) {
          s.neutronTimer = (s.neutronTimer || 0) + dt;

          if (s.neutronPhase === 'spinning') {
            s.neutronSpinAngle = (s.neutronSpinAngle || 0) + (s.neutronSpinSpeed || 24.0) * dt;

            // Micro-sparks around spinning neutron star
            if (Math.random() < 0.3) {
              const spAngle = Math.random() * Math.PI * 2;
              const spSpd = Math.random() * 1.5 + 0.6;
              asteroidSparks.push({
                x: s.x,
                y: s.y,
                vx: Math.cos(spAngle) * spSpd,
                vy: Math.sin(spAngle) * spSpd,
                size: Math.random() * 1.0 + 0.5,
                alpha: 0.9,
              });
            }

            // Spin for ~2.8s before smooth halo explosion
            if (s.neutronTimer >= 2.8) {
              s.neutronPhase = 'exploding';
              s.neutronTimer = 0;

              // TRIGGER SMOOTH EXPANDING HALO EXPLOSION!
              neutronHaloExplosions.push({
                id: Math.random(),
                x: s.x,
                y: s.y,
                radius: 2,
                maxRadius: 82,
                haloThickness: 18,
                alpha: 1.0,
                elapsed: 0,
                duration: 6.5,
                color: '#38bdf8',
              });

              // Radiate gentle expanding motes
              for (let k = 0; k < 14; k++) {
                const ang = (k / 14) * Math.PI * 2 + Math.random() * 0.15;
                const spd = Math.random() * 1.6 + 0.7;
                asteroidSparks.push({
                  x: s.x,
                  y: s.y,
                  vx: Math.cos(ang) * spd,
                  vy: Math.sin(ang) * spd,
                  size: Math.random() * 1.2 + 0.6,
                  alpha: 0.95,
                });
              }
            }
          } else if (s.neutronPhase === 'exploding') {
            // Core dissolves smoothly
            s.baseAlpha = Math.max(0, 1.0 - s.neutronTimer / 1.4);
            s.radius = Math.max(0.2, s.baseRadius * (1.0 - s.neutronTimer / 1.4));
            if (s.baseAlpha <= 0.02 || s.neutronTimer >= 1.5) {
              s.isAbsorbed = true; // Cleanly disappears
            }
          } else {
            s.neutronLife = (s.neutronLife || 0) + dt;
            const lifeFrac = Math.min(1.0, s.neutronLife / (s.neutronMaxLife || 24.0));
            s.baseAlpha = Math.max(0, (1.0 - lifeFrac) * 0.95);
            s.radius = Math.max(0.3, 0.8 * (1.0 - lifeFrac * 0.25));
            if (lifeFrac >= 1.0 || s.baseAlpha <= 0.01) {
              s.isAbsorbed = true;
            }
          }
        }

        // Pulsar Remnant lifetime & fade out
        if (s.isPulsarRemnant) {
          s.neutronLife = (s.neutronLife || 0) + dt;
          const lifeFrac = Math.min(1.0, s.neutronLife / 24.0);
          s.baseAlpha = Math.max(0, (1.0 - lifeFrac) * 0.95);
          s.radius = Math.max(0.3, 1.2 * (1.0 - lifeFrac * 0.25));
          if (lifeFrac >= 1.0 || s.baseAlpha <= 0.01) {
            s.isAbsorbed = true;
          }
        }

        // 2e. MERGED GIANT AGING & FADING OUT ("З часом червоніє і просто згасає")
        if (s.isMergedGiant && s.dyingAge !== undefined) {
          s.dyingAge += dt;
          if (s.dyingAge < 4.0) {
            s.spectralColor = '#fffbeb';
            s.glowColor = '#fef08a';
          } else if (s.dyingAge < 16.0) {
            const redProg = Math.min(1.0, (s.dyingAge - 4.0) / 6.0);
            s.spectralColor = redProg > 0.6 ? '#dc2626' : '#ea580c';
            s.glowColor = '#991b1b';
          } else {
            const fadeProg = Math.min(1.0, (s.dyingAge - 16.0) / 10.0);
            s.spectralColor = '#991b1b';
            s.glowColor = '#7f1d1d';
            s.baseAlpha = Math.max(0, (1.0 - fadeProg) * 0.85);
          }
        }

        // Apply friction/damping to velocity
        if (!s.isBinary) {
          s.vx += (s.baseVx - s.vx) * 0.05;
          s.vy += (s.baseVy - s.vy) * 0.05;

          s.x += s.vx;
          s.y += s.vy;
        }

        // Render coordinates for star
        let renderX = s.x;
        let renderY = s.y;

        // Extremely subtle Spacetime Gravitational Wave ripple (м'яке, непомітне просторове тремтіння)
        for (const gw of gravitationalWaves) {
          const wdx = s.x - gw.x;
          const wdy = s.y - gw.y;
          const wdist = Math.hypot(wdx, wdy);
          const diff = Math.abs(wdist - gw.radius);
          if (diff < 22) {
            const waveFactor = Math.sin((1.0 - diff / 22) * Math.PI) * gw.alpha * 1.4;
            renderX += (wdx / (wdist || 1)) * waveFactor;
            renderY += (wdy / (wdist || 1)) * waveFactor;
          }
        }

        if (s.rotation !== undefined && s.rotSpeed !== undefined) {
          s.rotation += s.rotSpeed * dt;
        }

        // Wrap around viewport edges
        if (s.x < -10) s.x = width + 10;
        if (s.x > width + 10) s.x = -10;
        if (s.y < -10) s.y = height + 10;
        if (s.y > height + 10) s.y = -10;

        // If cosmic ring is active, NEVER render any star inside the center void (sdist < 37.5px)!
        if (isShellPresent && shellStyle === 'cosmic_ring') {
          const distToCenter = Math.hypot(renderX - shellX, renderY - shellY);
          if (distToCenter < 37.5) {
            return;
          }
        }

        // Check birth flare
        if (s.birthFlare && s.birthFlare > 0) {
          s.birthFlare = Math.max(0, s.birthFlare - dt * 2.2);
          ctx.save();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.shadowColor = s.glowColor;
          ctx.shadowBlur = 8;
          ctx.globalAlpha = s.birthFlare * 0.85;
          ctx.beginPath();
          ctx.arc(renderX, renderY, s.radius + (1.0 - s.birthFlare) * 14, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Active supernova progenitor handles its own rendering
        if (s.isSupernova) {
          return;
        }

        // Pulsar Stellar Remnant: spinning relativistic synchrotron beam
        if (s.isPulsarRemnant) {
          s.pulsarSpin = (s.pulsarSpin || 0) + 16 * dt;
          ctx.save();
          ctx.translate(renderX, renderY);
          ctx.rotate(s.pulsarSpin);
          ctx.strokeStyle = 'rgba(125, 211, 252, 0.85)';
          ctx.lineWidth = 1.0;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          const beamLen = 8.5;
          ctx.beginPath();
          ctx.moveTo(-beamLen, 0); ctx.lineTo(beamLen, 0);
          ctx.stroke();

          // Intense pinpoint diamond core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          return;
        }

        // Spinning Neutron Star: intense rapid rotation and cross diffraction beams
        if (s.isNeutronStar && s.neutronPhase === 'spinning') {
          s.neutronSpinAngle = (s.neutronSpinAngle || 0) + (s.neutronSpinSpeed || 24.0) * dt;
          ctx.save();
          ctx.translate(renderX, renderY);
          ctx.rotate(s.neutronSpinAngle);
          ctx.strokeStyle = 'rgba(186, 230, 253, 0.95)';
          ctx.lineWidth = 1.0;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 12;
          const beamLen = 9.5;
          ctx.beginPath();
          ctx.moveTo(-beamLen, 0); ctx.lineTo(beamLen, 0);
          ctx.moveTo(0, -beamLen * 0.45); ctx.lineTo(0, beamLen * 0.45);
          ctx.stroke();

          // Intense pinpoint diamond core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          return;
        }

        // Twinkling scintillation calculation
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.pulseSpeed + s.pulsePhase);
        let currentAlpha = s.baseAlpha * twinkle;
        if (s.isTrapped) {
          currentAlpha = Math.min(1, currentAlpha * 1.4 + 0.25);
        }

        // Red Giant deep crimson corona
        if (s.isRedGiant) {
          ctx.save();
          const coronaPulse = 1.0 + 0.12 * Math.sin(t * 1.5 + s.pulsePhase);
          const rGrad = ctx.createRadialGradient(renderX, renderY, s.radius * 0.3, renderX, renderY, s.radius * 2.6 * coronaPulse);
          rGrad.addColorStop(0, '#ffffff');
          rGrad.addColorStop(0.25, '#f87171');
          rGrad.addColorStop(0.65, '#dc2626');
          rGrad.addColorStop(1, 'rgba(153, 27, 27, 0)');
          ctx.fillStyle = rGrad;
          ctx.globalAlpha = Math.min(1.0, currentAlpha * 1.15);
          ctx.beginPath();
          ctx.arc(renderX, renderY, s.radius * 2.6 * coronaPulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.save();

        if (isParchment) {
          // Warm floating antique golden motes / astrolabe dust
          const goldAlpha = currentAlpha * (isNight ? 0.35 : 0.45);
          ctx.fillStyle = `rgba(184, 134, 11, ${Math.min(1, goldAlpha)})`;
          ctx.shadowColor = '#d4af37';
          ctx.shadowBlur = s.radius * 3;
          ctx.beginPath();
          ctx.arc(renderX, renderY, s.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (isDark) {
          // Deep space celestial brilliance
          ctx.fillStyle = s.spectralColor;
          ctx.shadowColor = s.glowColor;
          ctx.shadowBlur = s.layer === 2 ? s.radius * 5 : s.radius * 2.5;

          ctx.beginPath();
          ctx.arc(renderX, renderY, s.radius * (0.85 + 0.25 * twinkle), 0, Math.PI * 2);
          ctx.fill();

          // Relativistic Pulsar Lighthouse Rotating Beams
          if (s.isPulsarRemnant) {
            s.pulsarSpin = (s.pulsarSpin || 0) + 4.2 * dt;
            ctx.save();
            ctx.translate(renderX, renderY);
            ctx.rotate(s.pulsarSpin);
            const beamLen = 32;
            const beamGrad = ctx.createLinearGradient(0, -beamLen, 0, beamLen);
            beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
            beamGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.35)');
            beamGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
            beamGrad.addColorStop(0.65, 'rgba(56, 189, 248, 0.35)');
            beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
            ctx.fillStyle = beamGrad;
            ctx.beginPath();
            ctx.moveTo(-0.6, -beamLen); ctx.lineTo(0.6, -beamLen);
            ctx.lineTo(1.2, beamLen); ctx.lineTo(-1.2, beamLen);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }

          // Diffraction rays for bright foreground beacon stars with individual spin
          if (s.hasRays && currentAlpha > 0.4) {
            ctx.strokeStyle = s.spectralColor;
            ctx.lineWidth = 0.6;
            ctx.globalAlpha = (currentAlpha - 0.4) * 0.7;

            const rLen = s.rayLength * (0.7 + 0.3 * twinkle);
            const rot = s.rotation || 0;
            
            ctx.save();
            ctx.translate(renderX, renderY);
            ctx.rotate(rot);
            
            ctx.beginPath();
            // Horizontal ray
            ctx.moveTo(-rLen, 0);
            ctx.lineTo(rLen, 0);
            // Vertical ray
            ctx.moveTo(0, -rLen);
            ctx.lineTo(0, rLen);
            ctx.stroke();
            
            ctx.restore();
          }
        } else {
          // Light mode: pristine daytime ethereal stardust
          const dayFactor = 0.4;
          ctx.fillStyle = `rgba(100, 116, 139, ${currentAlpha * dayFactor})`;
          ctx.shadowColor = '#94a3b8';
          ctx.shadowBlur = s.radius * 2;
          ctx.beginPath();
          ctx.arc(renderX, renderY, s.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // Clean up absorbed stars from mergers and fully extinguished red giants
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        if (s.isAbsorbed || (s.isMergedGiant && s.dyingAge !== undefined && s.dyingAge >= 26.0)) {
          stars.splice(i, 1);
        }
      }

      // 2f. DYNAMIC BINARY STAR SYSTEMS (Деякі зірки утворюють стабільні подвійні системи)
      nextBinaryFormCheck -= dt;
      if (nextBinaryFormCheck <= 0) {
        nextBinaryFormCheck = 12.0 + Math.random() * 8.0;
        const activeBinaryCount = stars.filter((s) => s.isBinary).length / 2;
        if (activeBinaryCount < 2) {
          const singles = stars.filter(
            (st) =>
              !st.isBinary &&
              st.binaryPartnerId === undefined &&
              !st.isSupernova &&
              !st.isMergedGiant &&
              !st.isRedGiant &&
              !st.isAbsorbed &&
              !st.isNeutronStar &&
              st.constellationId === undefined &&
              st.layer >= 1
          );

          let formed = false;
          for (let i = 0; i < singles.length && !formed; i++) {
            const s1 = singles[i];
            for (let j = i + 1; j < singles.length && !formed; j++) {
              const s2 = singles[j];
              const d = Math.hypot(s1.x - s2.x, s1.y - s2.y);
              if (d > 14 && d < 34) {
                const bx = (s1.x + s2.x) * 0.5;
                const by = (s1.y + s2.y) * 0.5;
                const bvx = ((s1.vx || s1.baseVx || 0) + (s2.vx || s2.baseVx || 0)) * 0.5;
                const bvy = ((s1.vy || s1.baseVy || 0) + (s2.vy || s2.baseVy || 0)) * 0.5;
                const ang = Math.atan2(s1.y - by, s1.x - bx);
                const halfDist = Math.max(11, d * 0.5);

                const willMerge = Math.random() < 0.15; // Рідкісне злиття (~15%)
                const isStable = !willMerge;

                s1.isBinary = true;
                s1.binaryPartnerId = s2.id;
                s1.barycenterX = bx;
                s1.barycenterY = by;
                s1.barycenterVx = bvx;
                s1.barycenterVy = bvy;
                s1.binaryOrbitRadius = halfDist;
                s1.binaryOrbitAngle = ang;
                s1.binaryOrbitSpeed = 0.65;
                s1.binaryAge = 0;
                s1.isStableBinary = isStable;
                s1.binaryWillMerge = willMerge;

                s2.isBinary = true;
                s2.binaryPartnerId = s1.id;
                s2.barycenterX = bx;
                s2.barycenterY = by;
                s2.barycenterVx = bvx;
                s2.barycenterVy = bvy;
                s2.binaryOrbitRadius = halfDist;
                s2.binaryOrbitAngle = ang + Math.PI;
                s2.binaryOrbitSpeed = 0.65;
                s2.binaryAge = 0;
                s2.isStableBinary = isStable;
                s2.binaryWillMerge = willMerge;

                formed = true;
              }
            }
          }
        }
      }

      // 3. CELESTIAL CONSTELLATIONS ENGINE (Disabled during initial dialogues)
      const isIntroDialogueActive =
        typeof document !== 'undefined' &&
        (document.documentElement.getAttribute('data-intro-dialogue-active') === 'true' ||
         localStorage.getItem('quit-smoking:intro-dialogue-shown') !== 'true');

      if (isIntroDialogueActive) {
        if (constellations.length > 0) {
          constellations.forEach((c) => {
            stars.forEach((cs) => {
              if (cs.constellationId === c.id) cs.constellationId = undefined;
            });
          });
          constellations.length = 0;
        }
      } else {
        nextConstellationCheck -= dt;
      }

      if (!isIntroDialogueActive && nextConstellationCheck <= 0 && isDark && constellations.length < 2) {
        nextConstellationCheck = 9.0 + Math.random() * 6.0;

        const availableStars = stars.filter(
          (st) =>
            !st.isBinary &&
            !st.isSupernova &&
            !st.isMergedGiant &&
            !st.isRedGiant &&
            !st.isRedDwarf &&
            !st.isRedStar &&
            st.spectralColor !== '#f87171' &&
            st.spectralColor !== '#ef4444' &&
            st.spectralColor !== '#dc2626' &&
            !st.isAbsorbed &&
            !st.isNeutronStar &&
            st.constellationId === undefined
        );

        if (availableStars.length >= 3) {
          const rootStar = availableStars[Math.floor(Math.random() * availableStars.length)];
          // Стабільні сузірʼя не можуть утворюватися на великих відстанях (компактний максимальний радіус <= 46px)
          const MAX_CONSTELLATION_DISTANCE = 46;
          const MAX_CONSTELLATION_STARS = 6;

          const closeNeighbors = availableStars
            .filter((st) => st.id !== rootStar.id)
            .map((st) => ({ star: st, dist: Math.hypot(st.x - rootStar.x, st.y - rootStar.y) }))
            .filter((item) => item.dist <= MAX_CONSTELLATION_DISTANCE && item.dist >= 12)
            .sort((a, b) => a.dist - b.dist);

          // Обмеження: сузірʼя не утворюються більше ніж з 6 зірок (максимум 6 зірок)
          const selectedStars = [rootStar];
          for (let k = 0; k < closeNeighbors.length && selectedStars.length < MAX_CONSTELLATION_STARS; k++) {
            const cand = closeNeighbors[k].star;
            // Перевіряємо взаємну відстань до всіх уже відібраних зірок (не більше MAX_CONSTELLATION_DISTANCE)
            const isAllClose = selectedStars.every(
              (sel) => Math.hypot(sel.x - cand.x, sel.y - cand.y) <= MAX_CONSTELLATION_DISTANCE
            );
            if (isAllClose) {
              selectedStars.push(cand);
            }
          }

          const clusterStars = selectedStars.slice(0, MAX_CONSTELLATION_STARS);
          if (clusterStars.length >= 3 && clusterStars.length <= MAX_CONSTELLATION_STARS) {
            const constId = Math.random();
            const starIds = clusterStars.map((cs) => cs.id);
            const cx = clusterStars.reduce((acc, s) => acc + s.x, 0) / clusterStars.length;
            const cy = clusterStars.reduce((acc, s) => acc + s.y, 0) / clusterStars.length;
            const cvx = clusterStars.reduce((acc, s) => acc + (s.vx || s.baseVx || 0), 0) / clusterStars.length;
            const cvy = clusterStars.reduce((acc, s) => acc + (s.vy || s.baseVy || 0), 0) / clusterStars.length;

            clusterStars.forEach((cs) => {
              cs.constellationId = constId;
              cs.vx = cvx;
              cs.vy = cvy;
              cs.constellationBarycentricOffsetX = cs.x - cx;
              cs.constellationBarycentricOffsetY = cs.y - cy;
            });

            const edges: Array<[number, number]> = [];
            for (let eIdx = 0; eIdx < clusterStars.length - 1; eIdx++) {
              const s1 = clusterStars[eIdx];
              const s2 = clusterStars[eIdx + 1];
              if (Math.hypot(s1.x - s2.x, s1.y - s2.y) <= MAX_CONSTELLATION_DISTANCE) {
                edges.push([s1.id, s2.id]);
              }
            }
            if (clusterStars.length > 3) {
              const sFirst = clusterStars[0];
              const sLast = clusterStars[clusterStars.length - 1];
              if (Math.hypot(sFirst.x - sLast.x, sFirst.y - sLast.y) <= MAX_CONSTELLATION_DISTANCE && Math.random() < 0.6) {
                edges.push([sFirst.id, sLast.id]);
              }
            }

            constellations.push({
              id: constId,
              starIds,
              edges,
              elapsed: 0,
              duration: 28.0 + Math.random() * 14.0,
              alpha: 0,
              barycenterX: cx,
              barycenterY: cy,
              barycenterVx: cvx,
              barycenterVy: cvy,
            });
          }
        }
      }

      // Update & Render Constellations (Стабільний дрейф та витончені світлові лінії сузірʼя)
      for (let cIdx = constellations.length - 1; cIdx >= 0; cIdx--) {
        const c = constellations[cIdx];
        c.elapsed += dt;

        if (c.barycenterX !== undefined && c.barycenterY !== undefined) {
          c.barycenterX += (c.barycenterVx || 0);
          c.barycenterY += (c.barycenterVy || 0);
        }

        const constStars = stars.filter((st) => c.starIds.includes(st.id));

        // Smooth fade-in (3s) -> Steady -> Smooth fade-out (4s)
        const fadeIn = Math.min(1.0, c.elapsed / 3.0);
        const fadeOut = Math.max(0, (c.duration - c.elapsed) / 4.0);
        c.alpha = Math.min(fadeIn, fadeOut);

        // Keep constellation members in harmonic formation
        for (const cs of constStars) {
          if (c.barycenterVx !== undefined && c.barycenterVy !== undefined) {
            cs.vx = c.barycenterVx;
            cs.vy = c.barycenterVy;
          }
        }

        // Render delicate celestial constellation bonds
        if (c.alpha > 0.02 && isDark) {
          ctx.save();
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = `rgba(186, 230, 253, ${c.alpha * 0.28})`;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 4;
          ctx.beginPath();
          for (const [id1, id2] of c.edges) {
            const s1 = constStars.find((s) => s.id === id1);
            const s2 = constStars.find((s) => s.id === id2);
            if (s1 && s2) {
              const d = Math.hypot(s1.x - s2.x, s1.y - s2.y);
              // Суворе обмеження: лінія малюється лише на малій компактній відстані (<= 38px)
              if (d <= 38) {
                ctx.moveTo(s1.x, s1.y);
                ctx.lineTo(s2.x, s2.y);
              }
            }
          }
          ctx.stroke();
          ctx.restore();
        }

        if (c.elapsed >= c.duration) {
          for (const cs of constStars) {
            if (cs.constellationId === c.id) {
              cs.constellationId = undefined;
              cs.vx = (Math.random() - 0.5) * 0.12;
              cs.vy = (Math.random() - 0.5) * 0.08;
            }
          }
          constellations.splice(cIdx, 1);
        }
      }

      // 3a. NEUTRON STAR EXPANDING HALO EXPLOSIONS ("плавний вибух з ореолом який повільно зникає")
      for (let hIdx = neutronHaloExplosions.length - 1; hIdx >= 0; hIdx--) {
        const he = neutronHaloExplosions[hIdx];
        he.elapsed += dt;
        const p = Math.min(1.0, he.elapsed / he.duration);
        he.radius = 2 + Math.sin(p * Math.PI * 0.5) * (he.maxRadius - 2);
        he.alpha = Math.pow(Math.max(0, 1.0 - p), 1.35);

        if (he.alpha > 0.01) {
          ctx.save();
          const innerR = Math.max(0, he.radius - he.haloThickness);
          const outerR = he.radius + he.haloThickness * 0.6;
          const hGrad = ctx.createRadialGradient(he.x, he.y, innerR, he.x, he.y, outerR);
          hGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
          hGrad.addColorStop(0.35, `rgba(103, 232, 249, ${he.alpha * 0.35})`);
          hGrad.addColorStop(0.7, `rgba(255, 255, 255, ${he.alpha * 0.75})`);
          hGrad.addColorStop(0.9, `rgba(56, 189, 248, ${he.alpha * 0.45})`);
          hGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');

          ctx.fillStyle = hGrad;
          ctx.beginPath();
          ctx.arc(he.x, he.y, outerR, 0, Math.PI * 2);
          ctx.fill();

          // Delicate outer luminous shockwave rim
          ctx.strokeStyle = `rgba(186, 230, 253, ${he.alpha * 0.55})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(he.x, he.y, he.radius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.restore();
        }

        if (he.elapsed >= he.duration) {
          neutronHaloExplosions.splice(hIdx, 1);
        }
      }

      // 3c. SUPERNOVA EXPLOSION HALO & AURA (Ultra-Lightweight & Smooth)
      for (let sIdx = supernovae.length - 1; sIdx >= 0; sIdx--) {
        const sn = supernovae[sIdx];
        sn.elapsed += dt;

        // Clean lifetime cap: 2.8 seconds total
        if (sn.elapsed >= 2.8) {
          supernovae.splice(sIdx, 1);
          continue;
        }

        const normTime = sn.elapsed / 2.8; // 0.0 -> 1.0
        const smoothAlpha = Math.sin(normTime * Math.PI); // Smooth 0 -> 1 -> 0 curve

        ctx.save();

        // 1. Initial Soft Flash Peak (First ~0.5 seconds)
        if (normTime < 0.22) {
          const flashProgress = normTime / 0.22;
          const flashR = 6 + flashProgress * 42;
          const flashAlpha = (1.0 - flashProgress) * 0.85;

          const flashGrad = ctx.createRadialGradient(sn.x, sn.y, 0, sn.x, sn.y, flashR);
          flashGrad.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha})`);
          flashGrad.addColorStop(0.4, `rgba(186, 230, 253, ${flashAlpha * 0.6})`);
          flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = flashGrad;
          ctx.beginPath();
          ctx.arc(sn.x, sn.y, flashR, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Majestic Expanding Supernova Halo Ring & Aura (Main Requested Visual)
        const maxHaloRadius = sn.maxShockwaveRadius || 180;
        const currentHaloRadius = 10 + Math.pow(normTime, 0.6) * maxHaloRadius;
        const haloWidth = 20 + normTime * 35;

        const innerR = Math.max(0, currentHaloRadius - haloWidth * 0.5);
        const outerR = currentHaloRadius + haloWidth * 0.5;

        const haloGrad = ctx.createRadialGradient(sn.x, sn.y, innerR, sn.x, sn.y, outerR);
        haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        haloGrad.addColorStop(0.35, `rgba(186, 230, 253, ${smoothAlpha * 0.45})`);
        haloGrad.addColorStop(0.65, `rgba(168, 85, 247, ${smoothAlpha * 0.6})`);
        haloGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(sn.x, sn.y, outerR, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
      /*
          const currentStar = stars.find((s) => s.id === sn.starId);
          if (currentStar) {
            // Rapid shiver and steep volumetric contraction
            const shiver = 1.0 + 0.35 * Math.sin(sn.elapsed * 45);
            currentStar.radius = Math.max(0.4, sn.progenitorRadius * (1.0 - Math.pow(impT, 1.8)) * shiver);
            currentStar.alpha = 1.0;
            currentStar.spectralColor = '#e0e7ff';
            currentStar.glowColor = '#818cf8';
          }

          if (sn.elapsed >= 1.4) {
            sn.stage = 'breakout';
            sn.elapsed = 0;
            sn.flashAlpha = 1.0;
            sn.flashRadius = sn.progenitorRadius * 2.5;
          }
        }
        // Stage 2: Supersonic Shock Breakout (blinding peak photic flash, 0 to 0.75s)
        else if (sn.stage === 'breakout') {
          const boT = Math.min(1.0, sn.elapsed / 0.75);
          sn.flashRadius = (sn.progenitorRadius * 3) + boT * 48;
          sn.diffractionR = 15 + boT * 70;
          sn.flashAlpha = Math.max(0, 1.0 - boT * 0.65);

          if (sn.elapsed >= 0.75) {
            sn.stage = 'blast';
            sn.elapsed = 0;
            sn.shockwaveRadius = 6;
            sn.synchrotronR = 10;
            sn.synchrotronAlpha = 0.95;

            // Spawn multi-element Rayleigh-Taylor ejecta filaments (Hydrogen, Oxygen, Nickel, Iron)
            const elements: Array<{ element: 'Hydrogen' | 'Oxygen' | 'Nickel' | 'Iron'; color: string; glow: string }> = [
              { element: 'Hydrogen', color: '#38bdf8', glow: '#0284c7' }, // [H-alpha] Ionized hydrogen cyan/blue
              { element: 'Oxygen', color: '#34d399', glow: '#059669' },   // [O III] Doubly ionized oxygen emerald
              { element: 'Nickel', color: '#fbbf24', glow: '#d97706' },   // 56Ni Radioactive decay amber
              { element: 'Iron', color: '#f87171', glow: '#dc2626' },     // Synthesized Fe-group ruby
            ];
            for (let i = 0; i < 24; i++) {
              const el = elements[i % elements.length];
              const ang = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
              const spd = Math.random() * 1.6 + 0.5;
              sn.ejecta.push({
                x: sn.x,
                y: sn.y,
                vx: Math.cos(ang) * spd + (Math.random() - 0.5) * 0.2,
                vy: Math.sin(ang) * spd + (Math.random() - 0.5) * 0.2,
                size: Math.random() * 1.5 + 0.7,
                alpha: 1.0,
                color: el.color,
                glowColor: el.glow,
                element: el.element,
                decay: 0.018 + Math.random() * 0.012,
              });
            }

            // Progenitor converts into permanent spinning Pulsar Remnant (star count strictly conserved)
            const star = stars.find((s) => s.id === sn.starId);
            if (star) {
              star.isSupernova = false;
              star.isPulsarRemnant = true;
              star.radius = 1.2;
              star.baseRadius = 1.2;
              star.alpha = 1.0;
              star.spectralColor = '#ffffff';
              star.glowColor = '#67e8f9';
              star.pulsarSpin = 0;
            }
          }
        }
        // Stage 3: Relativistic Blast Wave & Expanding Supernova Remnant (0 to 80s, плавне розширення, перебування і безшовне згасання)
        else if (sn.stage === 'blast') {
          // 0. PHYSICAL RADIATION PRESSURE & BLAST WAVE IMPULSE
          // The supersonic shockwave physically pushes interstellar dust motes and free asteroids outwards!
          if (sn.elapsed < 8.0) {
            const blastFront = sn.shockwaveRadius;
            const shockPushStrength = Math.max(0, 1.0 - sn.elapsed / 8.0);

            // Blast push on floating stardust motes
            for (let mIdx = 0; mIdx < motes.length; mIdx++) {
              const m = motes[mIdx];
              const dToSN = Math.hypot(m.x - sn.x, m.y - sn.y);
              if (dToSN > 4 && dToSN < blastFront + 35) {
                const nx = (m.x - sn.x) / dToSN;
                const ny = (m.y - sn.y) / dToSN;
                const pushMag = (1.0 - Math.min(1.0, Math.abs(dToSN - blastFront) / 45)) * 4.2 * shockPushStrength;
                m.vx += nx * pushMag * dt * 60;
                m.vy += ny * pushMag * dt * 60;
              }
            }

            // Blast push on free floating asteroids
            for (let aIdx = 0; aIdx < asteroids.length; aIdx++) {
              const ast = asteroids[aIdx];
              if (!ast.capturedByStarId) {
                const dToSN = Math.hypot(ast.x - sn.x, ast.y - sn.y);
                if (dToSN > 6 && dToSN < blastFront + 40) {
                  const nx = (ast.x - sn.x) / dToSN;
                  const ny = (ast.y - sn.y) / dToSN;
                  const pushMag = (1.0 - Math.min(1.0, Math.abs(dToSN - blastFront) / 50)) * 2.8 * shockPushStrength;
                  ast.vx += nx * pushMag * dt * 60;
                  ast.vy += ny * pushMag * dt * 60;
                  ast.rotSpeed += (Math.random() - 0.5) * 1.5 * shockPushStrength;

                  // Micro mineral sparks from relativistic shock ablation
                  if (asteroidSparks.length < 50 && Math.random() < 0.25) {
                    asteroidSparks.push({
                      x: ast.x,
                      y: ast.y,
                      vx: nx * (Math.random() * 2.5 + 1.0),
                      vy: ny * (Math.random() * 2.5 + 1.0),
                      size: Math.random() * 0.9 + 0.4,
                      alpha: 0.95,
                    });
                  }
                }
              }
            }
          }

          // У ореолі вибуху наднової утворюється кілька крихітних зірочок і кілька каменюк космічного мусору
          if (!sn.hasSpawnedHaloInfants) {
            sn.hasSpawnedHaloInfants = true;

            // 1. Крихітні зірочки в ореолі наднової (2-4 infant stars)
            const infantCount = Math.floor(Math.random() * 3) + 2;
            for (let ns = 0; ns < infantCount; ns++) {
              const nAngle = Math.random() * Math.PI * 2;
              const nDist = 18 + Math.random() * 32;
              const starX = sn.x + Math.cos(nAngle) * nDist;
              const starY = sn.y + Math.sin(nAngle) * nDist;

              stars.push({
                id: Math.random(),
                x: starX,
                y: starY,
                radius: 0.75 + Math.random() * 0.5, // Крихітна зірочка
                baseRadius: 1.0,
                layer: 1,
                alpha: 0.95,
                baseAlpha: 0.85,
                spectralColor: '#e0f2fe',
                glowColor: '#38bdf8',
                hasRays: false,
                rayLength: 4,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 1.8 + Math.random() * 1.5,
                baseVx: Math.cos(nAngle) * 0.18 + (Math.random() - 0.5) * 0.1,
                baseVy: Math.sin(nAngle) * 0.18 + (Math.random() - 0.5) * 0.1,
                vx: Math.cos(nAngle) * 0.18,
                vy: Math.sin(nAngle) * 0.18,
                birthFlare: 1.0,
              });
            }

            // 2. Каменюки космічного мусору в ореолі наднової (5-8 rocks that vanish)
            const rockCount = Math.floor(Math.random() * 4) + 5;
            for (let nr = 0; nr < rockCount; nr++) {
              const rAngle = Math.random() * Math.PI * 2;
              const rSpeed = Math.random() * 2.2 + 0.6;
              const numPts = Math.floor(Math.random() * 3) + 5;
              const shapePoints = Array.from({ length: numPts }, () => 0.6 + Math.random() * 0.6);

              planetaryDebris.push({
                id: Math.random(),
                x: sn.x + Math.cos(rAngle) * 12,
                y: sn.y + Math.sin(rAngle) * 12,
                vx: Math.cos(rAngle) * rSpeed + (Math.random() - 0.5) * 0.3,
                vy: Math.sin(rAngle) * rSpeed + (Math.random() - 0.5) * 0.3,
                size: Math.random() * 1.8 + 0.9,
                alpha: 1.0,
                color: '#78716c',
                glowColor: '#a8a29e',
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 3.2,
                shapePoints,
                life: 0,
                maxLife: Math.random() * 5.0 + 6.0, // Просто зникає через 6-11 секунд
              });
            }
          }

          // 1. Sedov-Taylor blast wave expansion & hydrodynamic relaxation
          const expandSpeed = sn.elapsed < 24.0 ? 0.016 : 0.0035;
          sn.shockwaveRadius += (sn.maxShockwaveRadius - sn.shockwaveRadius) * expandSpeed + (sn.elapsed < 16 ? 0.75 : 0.12);
          sn.synchrotronR += (sn.maxShockwaveRadius * 0.65 - sn.synchrotronR) * 0.008 + 0.14;

          // 2. Multi-Element Rayleigh-Taylor Ejecta ballistic update
          for (let eIdx = sn.ejecta.length - 1; eIdx >= 0; eIdx--) {
            const ej = sn.ejecta[eIdx];
            ej.x += ej.vx * dt * 60;
            ej.y += ej.vy * dt * 60;
            ej.vx *= Math.pow(0.985, dt * 60);
            ej.vy *= Math.pow(0.985, dt * 60);
            ej.size += dt * 0.08;
            ej.alpha = Math.max(0, ej.alpha - ej.decay * dt * 60);

            if (ej.alpha <= 0.01) {
              sn.ejecta.splice(eIdx, 1);
            }
          }

          // 3. Плавне згасання за косинусоїдою (до 80с)
          if (sn.elapsed < 25.0) {
            sn.synchrotronAlpha = 0.85;
          } else {
            const fadeProg = Math.min(1.0, (sn.elapsed - 25.0) / 55.0);
            const smoothFade = 0.5 * (1 + Math.cos(fadeProg * Math.PI)); // 1.0 -> 0.0 без жодних різких стрибків
            sn.synchrotronAlpha = 0.85 * smoothFade;
          }

          sn.flashAlpha = Math.max(0, sn.flashAlpha - dt * 0.8);
          sn.diffractionR = Math.max(0, sn.diffractionR - dt * 25);

          if (sn.elapsed >= 80.0) {
            supernovae.splice(sIdx, 1);
            continue;
          }
        }

        // --- RENDER SCIENTIFIC SUPERNOVA (БЕЗ КОНФЕТІ, ПЛАВНА АТМОСФЕРА ДАЛЕКОГО ПОШИРЕННЯ) ---
        ctx.save();

        // 1. Ambient Starlight Illumination (Peak Relativistic Flash)
        if (sn.flashAlpha > 0.02) {
          const ambientR = sn.flashRadius * 5.2;
          const ambGrad = ctx.createRadialGradient(sn.x, sn.y, 0, sn.x, sn.y, ambientR);
          ambGrad.addColorStop(0, `rgba(255, 255, 255, ${sn.flashAlpha * 0.35})`);
          ambGrad.addColorStop(0.35, `rgba(103, 232, 249, ${sn.flashAlpha * 0.2})`);
          ambGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = ambGrad;
          ctx.beginPath();
          ctx.arc(sn.x, sn.y, ambientR, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Core Shock Breakout Corona & 8-Point Diffraction Spikes
        if (sn.flashAlpha > 0.05 && sn.flashRadius > 0) {
          const coreGrad = ctx.createRadialGradient(sn.x, sn.y, 0, sn.x, sn.y, sn.flashRadius);
          coreGrad.addColorStop(0, '#ffffff');
          coreGrad.addColorStop(0.25, '#f0f9ff');
          coreGrad.addColorStop(0.65, 'rgba(56, 189, 248, 0.6)');
          coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = coreGrad;
          ctx.shadowColor = '#67e8f9';
          ctx.shadowBlur = 28;
          ctx.beginPath();
          ctx.arc(sn.x, sn.y, sn.flashRadius, 0, Math.PI * 2);
          ctx.fill();

          if (sn.diffractionR > 2) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${sn.flashAlpha * 0.95})`;
            ctx.lineWidth = 1.4;
            const r = sn.diffractionR;
            ctx.beginPath();
            ctx.moveTo(sn.x - r, sn.y); ctx.lineTo(sn.x + r, sn.y);
            ctx.moveTo(sn.x, sn.y - r); ctx.lineTo(sn.x + r, sn.y);
            const diagR = r * 0.7;
            ctx.moveTo(sn.x - diagR, sn.y - diagR); ctx.lineTo(sn.x + diagR, sn.y + diagR);
            ctx.moveTo(sn.x - diagR, sn.y + diagR); ctx.lineTo(sn.x + diagR, sn.y - diagR);
            ctx.stroke();
          }
        }

        // 3. Far-Traveling Atmospheric Expanding Blast Wave (Плавний ореол: плавно розширюється і абсолютно безшовно зникає)
        if (sn.shockwaveRadius > 2) {
          let haloOpacity = 0.72;
          if (sn.elapsed > 25.0) {
            const fadeProg = Math.min(1.0, (sn.elapsed - 25.0) / 55.0);
            const smoothFade = 0.5 * (1 + Math.cos(fadeProg * Math.PI)); // безперервна косинусоїдна плавна крива
            haloOpacity = 0.72 * smoothFade;
          }
          const swAlpha = Math.max(0, (1 - sn.shockwaveRadius / (sn.maxShockwaveRadius * 1.15)) * haloOpacity);
          const innerR = Math.max(0, sn.shockwaveRadius * 0.5);
          const outerR = sn.shockwaveRadius * 1.35;
          const atmosGrad = ctx.createRadialGradient(sn.x, sn.y, innerR, sn.x, sn.y, outerR);
          atmosGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
          atmosGrad.addColorStop(0.35, `rgba(186, 230, 253, ${swAlpha * 0.32})`);
          atmosGrad.addColorStop(0.75, `rgba(56, 189, 248, ${swAlpha * 0.62})`);
          atmosGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');

          ctx.fillStyle = atmosGrad;
          ctx.beginPath();
          ctx.arc(sn.x, sn.y, outerR, 0, Math.PI * 2);
          ctx.fill();
        }

        // 4. Circumstellar Synchrotron Ionization Cloud (М'яка газова туманність без різких ліній)
        if (sn.synchrotronR > 2 && sn.synchrotronAlpha > 0.02) {
          ctx.save();
          ctx.translate(sn.x, sn.y);
          ctx.rotate(sn.synchrotronTilt);
          ctx.scale(1.0, 0.46);
          const synInnerR = Math.max(0, sn.synchrotronR * 0.4);
          const synOuterR = sn.synchrotronR * 1.45;
          const synGrad = ctx.createRadialGradient(0, 0, synInnerR, 0, 0, synOuterR);
          synGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
          synGrad.addColorStop(0.55, `rgba(56, 189, 248, ${sn.synchrotronAlpha * 0.45})`);
          synGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
          ctx.fillStyle = synGrad;
          ctx.beginPath();
          ctx.arc(0, 0, synOuterR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 5. Multi-Element Rayleigh-Taylor Nucleosynthetic Ejecta Knots ([H-alpha], [O III], 56Ni, Iron)
        if (sn.ejecta.length > 0) {
          ctx.save();
          for (let eIdx = 0; eIdx < sn.ejecta.length; eIdx++) {
            const ej = sn.ejecta[eIdx];
            if (ej.alpha <= 0.02) continue;

            const ejGlowR = ej.size * 3.4;
            const ejGrad = ctx.createRadialGradient(ej.x, ej.y, 0, ej.x, ej.y, ejGlowR);
            ejGrad.addColorStop(0, ej.color);
            ejGrad.addColorStop(0.35, ej.glowColor);
            ejGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = ejGrad;
            ctx.globalAlpha = ej.alpha;
            ctx.beginPath();
            ctx.arc(ej.x, ej.y, ejGlowR, 0, Math.PI * 2);
            ctx.fill();

            // Luminous dense condensate core
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = ej.alpha * 0.9;
            ctx.beginPath();
            ctx.arc(ej.x, ej.y, ej.size * 0.65, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        ctx.restore();
      }
      */

      // 3d. SPACETIME GRAVITATIONAL WAVES (Дуже м'яка, майже невидима хвиля простору)
      ctx.save();
      for (let gIdx = gravitationalWaves.length - 1; gIdx >= 0; gIdx--) {
        const gw = gravitationalWaves[gIdx];
        gw.radius += gw.speed * dt;
        gw.alpha *= 0.982;

        if (gw.radius >= gw.maxRadius || gw.alpha <= 0.005) {
          gravitationalWaves.splice(gIdx, 1);
          continue;
        }

        // Ultra-soft, delicate subtle wave ring without harsh contrast
        ctx.strokeStyle = `rgba(186, 230, 253, ${gw.alpha * 0.14})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(gw.x, gw.y, gw.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 4. FLOATING STARDUST MOTES
      motes.forEach((m) => {
        // Shell Gravitational Attractor for motes: strictly within 1 cm (~38px) from cloud body (~48px)
        if (m.escapeTimer && m.escapeTimer > 0) {
          m.escapeTimer -= dt;
        } else if (isShellPresent) {
          const mdxToCenter = m.x - shellX;
          const mdyToCenter = m.y - shellY;
          const mdist = Math.hypot(mdxToCenter, mdyToCenter);

          const cloudBodyR = 48;
          const captureDistance = 38; // ~1 cm
          const attractRadius = cloudBodyR + captureDistance; // ~86px

          if (mdist < attractRadius && mdist > 1) {
            const distFromCloud = Math.abs(mdist - cloudBodyR);
            const pullFactor = Math.pow(Math.max(0, 1 - distFromCloud / captureDistance), 1.4);
            const angle = Math.atan2(mdyToCenter, mdxToCenter);

            if (shellStyle === 'cosmic_ring') {
              // Captured motes move along DIFFERENT CONCENTRIC ORBITS inside the ring
              if (!m.ringOrbitRadius) {
                const LANES = [43.0, 45.8, 48.2, 51.0, 53.8];
                const laneIdx = Math.floor(Math.random() * LANES.length);
                const fineJitter = (Math.random() - 0.5) * 0.8;
                m.ringOrbitRadius = LANES[laneIdx] + fineJitter;
                const baseSpeed = 2.6 - (m.ringOrbitRadius - 43.0) * 0.07;
                m.ringOrbitSpeed = baseSpeed * (0.9 + Math.random() * 0.2);
              }

              const targetR = m.ringOrbitRadius;
              const deltaRing = mdist - targetR;
              const ringPull = -deltaRing * 0.12 * pullFactor;
              const ux = Math.cos(angle);
              const uy = Math.sin(angle);

              m.vx += ux * ringPull * dt * 3.8;
              m.vy += uy * ringPull * dt * 3.8;

              // Swirl strictly along assigned orbit
              const orbSpeed = m.ringOrbitSpeed || 2.2;
              m.vx += (-uy) * pullFactor * dt * orbSpeed;
              m.vy += ux * pullFactor * dt * orbSpeed;

              if (mdist < 38) {
                const repulseForce = (38 - mdist) * 0.45;
                m.vx += ux * repulseForce;
                m.vy += uy * repulseForce;
              }

              if (Math.abs(deltaRing) < 6) {
                m.isTrapped = true;
                m.vx *= 0.94;
                m.vy *= 0.94;
              }
            } else {
              m.vx += (-mdxToCenter / mdist) * pullFactor * dt * 3.4;
              m.vy += (-mdyToCenter / mdist) * pullFactor * dt * 3.4;
              m.vx += (-mdyToCenter / mdist) * pullFactor * dt * 2.0;
              m.vy += (mdxToCenter / mdist) * pullFactor * dt * 2.0;

              if (mdist < shellRadius + 4) {
                m.isTrapped = true;
                m.vx *= 0.93;
                m.vy *= 0.93;
              }
            }
          } else if (mdist >= attractRadius) {
            m.isTrapped = false;
            m.ringOrbitRadius = undefined;
            m.ringOrbitSpeed = undefined;
          }
        }

        m.x += m.vx;
        m.y += m.vy;
        m.driftPhase += 0.02;

        if (m.x < 0) m.x = width;
        if (m.x > width) m.x = 0;
        if (m.y < 0) m.y = height;
        if (m.y > height) m.y = 0;

        // If cosmic ring is active, NEVER render any mote inside the center void (mdist < 37.5px)!
        if (isShellPresent && shellStyle === 'cosmic_ring') {
          const distToCenter = Math.hypot(m.x - shellX, m.y - shellY);
          if (distToCenter < 37.5) {
            return;
          }
        }

        const pulse = 0.5 + 0.5 * Math.sin(m.driftPhase);
        const moteAlpha = m.isTrapped ? Math.min(1, m.alpha * 1.5 + 0.25) : m.alpha * pulse;
        ctx.save();
        if (isDark) {
          ctx.fillStyle = `hsla(${m.hue}, 90%, 80%, ${moteAlpha * 0.75})`;
          ctx.shadowColor = `hsl(${m.hue}, 90%, 60%)`;
          ctx.shadowBlur = m.isTrapped ? 6 : 3;
        } else {
          ctx.fillStyle = `rgba(148, 163, 184, ${moteAlpha * 0.45})`;
        }
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.isTrapped ? m.size * 1.2 : m.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 4b. ASTEROIDS & UNIQUE EVOLVING PLANETARY GENESIS SYSTEM (Всього одна така система на весь екран)
      if (!evolvingPlanet) {
        // Group captured asteroids by host star, binary system, or constellation
        const starAsteroidMap = new Map<number, Asteroid[]>();
        const binaryAsteroidMap = new Map<number, Asteroid[]>();
        const constellationAsteroidMap = new Map<number, Asteroid[]>();

        for (let aIdx = 0; aIdx < asteroids.length; aIdx++) {
          const ast = asteroids[aIdx];

          if (ast.capturedByBinaryId !== undefined) {
            // Circumbinary Keplerian Orbit around Binary Barycenter
            const host = stars.find((s) => s.id === ast.capturedByBinaryId && s.isBinary);
            if (host && host.barycenterX !== undefined && host.barycenterY !== undefined) {
              const a = ast.orbitRadius || 34;
              const e = ast.orbitEccentricity || 0.16;
              const omega = ast.orbitPeriapsisAngle || 0;
              const trueAnomaly = (ast.orbitAngle || 0) - omega;
              const currentR = (a * (1 - e * e)) / (1 + e * Math.cos(trueAnomaly));
              const instSpeed = (ast.orbitSpeed || 0.45) * Math.pow(a / currentR, 1.5);
              ast.orbitAngle = (ast.orbitAngle || 0) + instSpeed * dt;
              ast.x = host.barycenterX + Math.cos(ast.orbitAngle) * currentR;
              ast.y = host.barycenterY + Math.sin(ast.orbitAngle) * currentR;

              ast.orbitRadius = Math.max(16, a - dt * 0.15); // Poynting-Robertson radiation drag
              if (currentR < 16) {
                for (let sparkIdx = 0; sparkIdx < 6; sparkIdx++) {
                  asteroidSparks.push({
                    x: ast.x, y: ast.y,
                    vx: (Math.random() - 0.5) * 1.8, vy: (Math.random() - 0.5) * 1.8,
                    size: Math.random() * 1.1 + 0.4, alpha: 0.9,
                  });
                }
                ast.isShredded = true;
              }

              let list = binaryAsteroidMap.get(host.id);
              if (!list) {
                list = [];
                binaryAsteroidMap.set(host.id, list);
              }
              if (!ast.isShredded) list.push(ast);
            } else {
              ast.capturedByBinaryId = undefined;
            }
          } else if (ast.capturedByConstellationId !== undefined) {
            // Keplerian Orbit within Stable Constellation around Anchor Star
            const c = constellations.find((con) => con.id === ast.capturedByConstellationId);
            const rootStar = c ? stars.find((s) => s.id === c.starIds[0]) : null;
            if (rootStar) {
              const a = ast.orbitRadius || 26;
              const e = ast.orbitEccentricity || 0.16;
              const omega = ast.orbitPeriapsisAngle || 0;
              const trueAnomaly = (ast.orbitAngle || 0) - omega;
              const currentR = (a * (1 - e * e)) / (1 + e * Math.cos(trueAnomaly));
              const instSpeed = (ast.orbitSpeed || 0.50) * Math.pow(a / currentR, 1.5);
              ast.orbitAngle = (ast.orbitAngle || 0) + instSpeed * dt;
              ast.x = rootStar.x + Math.cos(ast.orbitAngle) * currentR;
              ast.y = rootStar.y + Math.sin(ast.orbitAngle) * currentR;

              ast.orbitRadius = Math.max(14, a - dt * 0.15);
              if (currentR < 14) {
                for (let sparkIdx = 0; sparkIdx < 6; sparkIdx++) {
                  asteroidSparks.push({
                    x: ast.x, y: ast.y,
                    vx: (Math.random() - 0.5) * 1.8, vy: (Math.random() - 0.5) * 1.8,
                    size: Math.random() * 1.1 + 0.4, alpha: 0.9,
                  });
                }
                ast.isShredded = true;
              }

              let list = constellationAsteroidMap.get(c!.id);
              if (!list) {
                list = [];
                constellationAsteroidMap.set(c!.id, list);
              }
              if (!ast.isShredded) list.push(ast);
            } else {
              ast.capturedByConstellationId = undefined;
            }
          } else if (ast.capturedByStarId !== undefined) {
            const host = stars.find((s) => s.id === ast.capturedByStarId);
            if (host) {
              // 1. KEPLERIAN ELLIPTICAL ORBIT (Прискорення в перицентрі, сповільнення в апоцентрі)
              const a = ast.orbitRadius || 26;
              const e = ast.orbitEccentricity || 0.20;
              const omega = ast.orbitPeriapsisAngle || 0;
              const trueAnomaly = (ast.orbitAngle || 0) - omega;
              const currentR = (a * (1 - e * e)) / (1 + e * Math.cos(trueAnomaly));
              
              // 2-й закон Кеплера: миттєва кутова швидкість пропорційна (a / r)^1.5
              const instSpeed = (ast.orbitSpeed || 0.55) * Math.pow(a / currentR, 1.5);
              ast.orbitAngle = (ast.orbitAngle || 0) + instSpeed * dt;
              ast.x = host.x + Math.cos(ast.orbitAngle) * currentR;
              ast.y = host.y + Math.sin(ast.orbitAngle) * currentR;

              // === SCIENTIFIC INTERACTION 2: POYNTING-ROBERTSON RADIATION DRAG ===
              ast.orbitRadius = Math.max(10, a - dt * 0.18);

              // === SCIENTIFIC INTERACTION 1: ROCHE LIMIT TIDAL DISRUPTION ===
              if (currentR < 18 || (ast.orbitRadius && ast.orbitRadius < 18)) {
                for (let sparkIdx = 0; sparkIdx < 7; sparkIdx++) {
                  const sAngle = Math.random() * Math.PI * 2;
                  const sSpd = Math.random() * 1.8 + 0.6;
                  asteroidSparks.push({
                    x: ast.x,
                    y: ast.y,
                    vx: Math.cos(sAngle) * sSpd,
                    vy: Math.sin(sAngle) * sSpd,
                    size: Math.random() * 1.2 + 0.5,
                    alpha: 0.95,
                  });
                }
                ast.isShredded = true;
              }

              let list = starAsteroidMap.get(host.id);
              if (!list) {
                list = [];
                starAsteroidMap.set(host.id, list);
              }
              if (!ast.isShredded) {
                list.push(ast);
              }
            } else {
              ast.capturedByStarId = undefined;
            }
          } else {
            // Asteroid free drift
            ast.x += ast.vx;
            ast.y += ast.vy;
            ast.rotation += ast.rotSpeed * dt;

            if (ast.x < -20) ast.x = width + 20;
            if (ast.x > width + 20) ast.x = -20;
            if (ast.y < -20) ast.y = height + 20;
            if (ast.y > height + 20) ast.y = -20;

            if (ast.slingshotCooldown && ast.slingshotCooldown > 0) {
              ast.slingshotCooldown -= dt;
            }

            // === SCIENTIFIC INTERACTION 3: GRAVITATIONAL SLINGSHOT / FLYBY ===
            if (!ast.slingshotCooldown || ast.slingshotCooldown <= 0) {
              for (let sIdx = 0; sIdx < stars.length; sIdx++) {
                const star = stars[sIdx];
                if (star.layer < 2 && !star.isBinary) continue;

                const adx = ast.x - star.x;
                const ady = ast.y - star.y;
                const adist = Math.hypot(adx, ady);
                const speed = Math.hypot(ast.vx, ast.vy);

                if (adist > 24 && adist < 55 && speed > 1.2) {
                  const flybyAngle = Math.atan2(ady, adx);
                  const slingshotSpeed = Math.min(4.8, speed * 1.55);
                  ast.vx = Math.cos(flybyAngle + 0.2) * slingshotSpeed;
                  ast.vy = Math.sin(flybyAngle + 0.2) * slingshotSpeed;
                  ast.slingshotCooldown = 3.2;

                  for (let sparkIdx = 0; sparkIdx < 3; sparkIdx++) {
                    asteroidSparks.push({
                      x: ast.x,
                      y: ast.y,
                      vx: -ast.vx * 0.25 + (Math.random() - 0.5) * 0.3,
                      vy: -ast.vy * 0.25 + (Math.random() - 0.5) * 0.3,
                      size: Math.random() * 0.9 + 0.5,
                      alpha: 0.88,
                    });
                  }
                  break;
                }
              }
            }

            // CHECK ASTEROID CAPTURE:
            // 1. Може притягнутися до подвійної системи (Circumbinary)
            let captured = false;
            for (let sIdx = 0; sIdx < stars.length; sIdx++) {
              const star = stars[sIdx];
              if (!star.isBinary || star.barycenterX === undefined || star.barycenterY === undefined || (star.binaryPartnerId !== undefined && star.id > star.binaryPartnerId)) continue;
              const bdx = star.barycenterX - ast.x;
              const bdy = star.barycenterY - ast.y;
              const bdist = Math.hypot(bdx, bdy);
              const astSpd = Math.hypot(ast.vx, ast.vy);
              if (bdist < 85 && bdist > 18 && astSpd < 1.15) {
                const already = asteroids.filter((a) => a.capturedByBinaryId === star.id).length;
                if (already < 2) {
                  ast.capturedByBinaryId = star.id;
                  ast.orbitRadius = 34 + Math.random() * 12;
                  ast.orbitAngle = Math.atan2(ast.y - star.barycenterY, ast.x - star.barycenterX);
                  ast.orbitSpeed = 0.45 + Math.random() * 0.20;
                  ast.orbitEccentricity = 0.15 + Math.random() * 0.10;
                  ast.orbitPeriapsisAngle = Math.random() * Math.PI * 2;
                  captured = true;
                  break;
                }
              }
            }

            // 2. Може притягнутися до стабільного сузірʼя (Constellation planetary capture)
            if (!captured) {
              for (let cIdx = 0; cIdx < constellations.length; cIdx++) {
                const c = constellations[cIdx];
                const rootStar = stars.find((s) => s.id === c.starIds[0]);
                if (!rootStar) continue;
                const cdx = rootStar.x - ast.x;
                const cdy = rootStar.y - ast.y;
                const cdist = Math.hypot(cdx, cdy);
                const astSpd = Math.hypot(ast.vx, ast.vy);
                if (cdist < 80 && cdist > 16 && astSpd < 1.15) {
                  const already = asteroids.filter((a) => a.capturedByConstellationId === c.id).length;
                  if (already < 2) {
                    ast.capturedByConstellationId = c.id;
                    ast.orbitRadius = 26 + Math.random() * 10;
                    ast.orbitAngle = Math.atan2(ast.y - rootStar.y, ast.x - rootStar.x);
                    ast.orbitSpeed = 0.50 + Math.random() * 0.20;
                    ast.orbitEccentricity = 0.16 + Math.random() * 0.10;
                    ast.orbitPeriapsisAngle = Math.random() * Math.PI * 2;
                    captured = true;
                    break;
                  }
                }
              }
            }

            // 3. Може притягнутися до звичайної поодинокої масивної зірки
            if (!captured) {
              for (let sIdx = 0; sIdx < stars.length; sIdx++) {
                const star = stars[sIdx];
                if (
                  star.layer < 2 || 
                  star.isBinary || 
                  star.binaryPartnerId !== undefined || 
                  star.isMergedGiant || 
                  star.isRedGiant ||
                  star.isSupernova || 
                  star.isPulsarRemnant ||
                  star.isAbsorbed ||
                  star.constellationId !== undefined
                ) {
                  continue;
                }

                const alreadyCaptured = asteroids.filter((a) => a.capturedByStarId === star.id).length;
                if (alreadyCaptured >= 2) continue;

                const adx = star.x - ast.x;
                const ady = star.y - ast.y;
                const adist = Math.hypot(adx, ady);

                if (adist < 80 && adist > 4) {
                  const astSpd = Math.hypot(ast.vx, ast.vy);
                  if (astSpd > 0.95) {
                    const pull = (1.0 - adist / 80) * 0.18;
                    ast.vx += (adx / adist) * pull;
                    ast.vy += (ady / adist) * pull;
                    continue;
                  }

                  ast.capturedByStarId = star.id;
                  ast.orbitRadius = 22 + Math.random() * 12;
                  ast.orbitAngle = Math.atan2(ast.y - star.y, ast.x - star.x);
                  ast.orbitSpeed = 0.50 + Math.random() * 0.25;
                  ast.orbitEccentricity = 0.18 + Math.random() * 0.12;
                  ast.orbitPeriapsisAngle = Math.random() * Math.PI * 2;
                  break;
                }
              }
            }
          }
        }

        // ПРУЖНІ ЗІТКНЕННЯ МІЖ ВІЛЬНИМИ АСТЕРОЇДАМИ (Збереження імпульсу + мікропил)
        for (let i = 0; i < asteroids.length; i++) {
          const a1 = asteroids[i];
          if (a1.capturedByStarId !== undefined || a1.capturedByBinaryId !== undefined || a1.capturedByConstellationId !== undefined) continue;
          for (let j = i + 1; j < asteroids.length; j++) {
            const a2 = asteroids[j];
            if (a2.capturedByStarId !== undefined || a2.capturedByBinaryId !== undefined || a2.capturedByConstellationId !== undefined) continue;

            const cdx = a2.x - a1.x;
            const cdy = a2.y - a1.y;
            const cdist = Math.hypot(cdx, cdy);
            const minDist = (a1.size + a2.size) * 1.05;

            if (cdist < minDist && cdist > 0.05) {
              const nx = cdx / cdist;
              const ny = cdy / cdist;
              const kx = a1.vx - a2.vx;
              const ky = a1.vy - a2.vy;
              const p = (nx * kx + ny * ky) * 0.90; // Еластичний відскок

              a1.vx -= p * nx;
              a1.vy -= p * ny;
              a2.vx += p * nx;
              a2.vy += p * ny;

              a1.rotSpeed = (Math.random() - 0.5) * 1.1;
              a2.rotSpeed = (Math.random() - 0.5) * 1.1;

              const overlap = 0.5 * (minDist - cdist);
              a1.x -= nx * overlap;
              a1.y -= ny * overlap;
              a2.x += nx * overlap;
              a2.y += ny * overlap;

              const contactX = (a1.x + a2.x) * 0.5;
              const contactY = (a1.y + a2.y) * 0.5;
              for (let s = 0; s < 3; s++) {
                const sAngle = Math.random() * Math.PI * 2;
                const sSpd = Math.random() * 0.6 + 0.2;
                asteroidSparks.push({
                  x: contactX,
                  y: contactY,
                  vx: Math.cos(sAngle) * sSpd,
                  vy: Math.sin(sAngle) * sSpd,
                  size: Math.random() * 0.8 + 0.4,
                  alpha: 0.85,
                });
              }
            }
          }
        }

        // Procedural continent seeds
        const continents = [
          { cx: -1.1, cy: -0.9, r: 2.0 },
          { cx: 1.3, cy: 0.7, r: 1.7 },
          { cx: -0.5, cy: 1.3, r: 1.4 },
          { cx: 0.9, cy: -1.2, r: 1.3 },
        ];

        // 1. When 2 or more asteroids are captured by a SINGLE STAR -> COLLIDE & FORM PRIMORDIAL PLANET!
        for (const [starId, capturedList] of starAsteroidMap.entries()) {
          if (capturedList.length >= 2 && !evolvingPlanet) {
            const hostStar = stars.find((s) => s.id === starId);
            if (hostStar) {
              const avgOrbitR = capturedList.reduce((acc, a) => acc + (a.orbitRadius || 28), 0) / capturedList.length;
              const avgAngle = capturedList[0].orbitAngle || 0;
              const zoneType: 'scorching' | 'habitable' | 'frozen' =
                avgOrbitR < 23 ? 'scorching' : avgOrbitR > 33 ? 'frozen' : 'habitable';

              evolvingPlanet = {
                id: Math.random(),
                hostStarId: starId,
                x: hostStar.x + Math.cos(avgAngle) * avgOrbitR,
                y: hostStar.y + Math.sin(avgAngle) * avgOrbitR,
                radius: 4.4,
                orbitAngle: avgAngle,
                orbitRadius: avgOrbitR,
                orbitSpeed: 0.45,
                orbitEccentricity: 0.16 + Math.random() * 0.10,
                orbitPeriapsisAngle: Math.random() * Math.PI * 2,
                stage: 'rock',
                stageTimer: 0,
                rotation: 0,
                rotSpeed: 0.28,
                continents,
                breathPulse: 0,
                collisionFlash: 1.0,
                zoneType,
              };

              const mergedIds = new Set(capturedList.map((a) => a.id));
              for (let i = asteroids.length - 1; i >= 0; i--) {
                if (mergedIds.has(asteroids[i].id)) asteroids.splice(i, 1);
              }
              break;
            }
          }
        }

        // 2. When 2 or more asteroids are captured by a BINARY SYSTEM -> COLLIDE & FORM CIRCUMBINARY PLANET!
        if (!evolvingPlanet) {
          for (const [binaryId, capturedList] of binaryAsteroidMap.entries()) {
            if (capturedList.length >= 2 && !evolvingPlanet) {
              const host = stars.find((s) => s.id === binaryId && s.isBinary);
              if (host && host.barycenterX !== undefined && host.barycenterY !== undefined) {
                const avgOrbitR = capturedList.reduce((acc, a) => acc + (a.orbitRadius || 36), 0) / capturedList.length;
                const avgAngle = capturedList[0].orbitAngle || 0;
                evolvingPlanet = {
                  id: Math.random(),
                  capturedByBinaryId: binaryId,
                  capturedBinaryBarycenterX: host.barycenterX,
                  capturedBinaryBarycenterY: host.barycenterY,
                  x: host.barycenterX + Math.cos(avgAngle) * avgOrbitR,
                  y: host.barycenterY + Math.sin(avgAngle) * avgOrbitR,
                  radius: 4.6,
                  orbitAngle: avgAngle,
                  orbitRadius: avgOrbitR,
                  orbitSpeed: 0.40,
                  orbitEccentricity: 0.15 + Math.random() * 0.08,
                  orbitPeriapsisAngle: Math.random() * Math.PI * 2,
                  stage: 'rock',
                  stageTimer: 0,
                  rotation: 0,
                  rotSpeed: 0.28,
                  continents,
                  breathPulse: 0,
                  collisionFlash: 1.0,
                  zoneType: 'habitable',
                };

                const mergedIds = new Set(capturedList.map((a) => a.id));
                for (let i = asteroids.length - 1; i >= 0; i--) {
                  if (mergedIds.has(asteroids[i].id)) asteroids.splice(i, 1);
                }
                break;
              }
            }
          }
        }

        // 3. When 2 or more asteroids are captured by a STABLE CONSTELLATION -> COLLIDE & FORM CONSTELLATION PLANET!
        if (!evolvingPlanet) {
          for (const [constId, capturedList] of constellationAsteroidMap.entries()) {
            if (capturedList.length >= 2 && !evolvingPlanet) {
              const c = constellations.find((con) => con.id === constId);
              const rootStar = c ? stars.find((s) => s.id === c.starIds[0]) : null;
              if (rootStar) {
                const avgOrbitR = capturedList.reduce((acc, a) => acc + (a.orbitRadius || 28), 0) / capturedList.length;
                const avgAngle = capturedList[0].orbitAngle || 0;
                evolvingPlanet = {
                  id: Math.random(),
                  capturedByConstellationId: constId,
                  hostStarId: rootStar.id,
                  x: rootStar.x + Math.cos(avgAngle) * avgOrbitR,
                  y: rootStar.y + Math.sin(avgAngle) * avgOrbitR,
                  radius: 4.4,
                  orbitAngle: avgAngle,
                  orbitRadius: avgOrbitR,
                  orbitSpeed: 0.48,
                  orbitEccentricity: 0.16 + Math.random() * 0.08,
                  orbitPeriapsisAngle: Math.random() * Math.PI * 2,
                  stage: 'rock',
                  stageTimer: 0,
                  rotation: 0,
                  rotSpeed: 0.28,
                  continents,
                  breathPulse: 0,
                  collisionFlash: 1.0,
                  zoneType: 'habitable',
                };

                const mergedIds = new Set(capturedList.map((a) => a.id));
                for (let i = asteroids.length - 1; i >= 0; i--) {
                  if (mergedIds.has(asteroids[i].id)) asteroids.splice(i, 1);
                }
                break;
              }
            }
          }
        }
      } else {
        // Free drifting remaining asteroids
        for (let aIdx = 0; aIdx < asteroids.length; aIdx++) {
          const ast = asteroids[aIdx];
          ast.x += ast.vx;
          ast.y += ast.vy;
          ast.rotation += ast.rotSpeed * dt;
          if (ast.x < -20) ast.x = width + 20;
          if (ast.x > width + 20) ast.x = -20;
          if (ast.y < -20) ast.y = height + 20;
          if (ast.y > height + 20) ast.y = -20;
        }

        // Asteroid-asteroid collision check for remaining asteroids
        for (let i = 0; i < asteroids.length; i++) {
          const a1 = asteroids[i];
          for (let j = i + 1; j < asteroids.length; j++) {
            const a2 = asteroids[j];
            const cdx = a2.x - a1.x;
            const cdy = a2.y - a1.y;
            const cdist = Math.hypot(cdx, cdy);
            const minDist = (a1.size + a2.size) * 1.05;

            if (cdist < minDist && cdist > 0.05) {
              const nx = cdx / cdist;
              const ny = cdy / cdist;
              const kx = a1.vx - a2.vx;
              const ky = a1.vy - a2.vy;
              const p = (nx * kx + ny * ky) * 0.90;

              a1.vx -= p * nx;
              a1.vy -= p * ny;
              a2.vx += p * nx;
              a2.vy += p * ny;

              a1.rotSpeed = (Math.random() - 0.5) * 1.1;
              a2.rotSpeed = (Math.random() - 0.5) * 1.1;

              const overlap = 0.5 * (minDist - cdist);
              a1.x -= nx * overlap;
              a1.y -= ny * overlap;
              a2.x += nx * overlap;
              a2.y += ny * overlap;
            }
          }
        }
      }

      // RENDER ASTEROID SPARKS
      ctx.save();
      for (let spIdx = asteroidSparks.length - 1; spIdx >= 0; spIdx--) {
        const sp = asteroidSparks[spIdx];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= dt * 1.6;

        if (sp.alpha <= 0.02) {
          asteroidSparks.splice(spIdx, 1);
          continue;
        }

        ctx.fillStyle = '#d6d3d1';
        ctx.globalAlpha = sp.alpha * 0.75;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Clean up shredded asteroids (Roche limit tidal disruption)
      for (let i = asteroids.length - 1; i >= 0; i--) {
        if (asteroids[i].isShredded) {
          asteroids.splice(i, 1);
        }
      }

      // RENDER ASTEROIDS (Шматки каміння)
      for (let aIdx = 0; aIdx < asteroids.length; aIdx++) {
        const ast = asteroids[aIdx];
        ctx.save();
        ctx.translate(ast.x, ast.y);
        ctx.rotate(ast.rotation);
        ctx.fillStyle = '#78716c';
        ctx.strokeStyle = '#44403c';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        const numPts = ast.shapePoints.length;
        for (let p = 0; p < numPts; p++) {
          const theta = (p / numPts) * Math.PI * 2;
          const r = ast.size * ast.shapePoints[p];
          const px = Math.cos(theta) * r;
          const py = Math.sin(theta) * r;
          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Crater shading
        ctx.fillStyle = '#292524';
        ctx.beginPath();
        ctx.arc(ast.size * 0.25, -ast.size * 0.2, ast.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // RENDER UNIQUE EVOLVING PLANET SYSTEM (Еволюція з урахуванням Goldilocks Zone)
      if (evolvingPlanet) {
        const ep = evolvingPlanet;
        const hostStar = stars.find((s) => s.id === ep.hostStarId);
        if (hostStar) {
          // KEPLERIAN ORBIT DYNAMICS (Прискорення в перицентрі, сповільнення в апоцентрі)
          const a = ep.orbitRadius;
          const e = ep.orbitEccentricity || 0.18;
          const omega = ep.orbitPeriapsisAngle || 0;
          const trueAnomaly = ep.orbitAngle - omega;
          const currentR = (a * (1 - e * e)) / (1 + e * Math.cos(trueAnomaly));
          const instSpeed = ep.orbitSpeed * Math.pow(a / currentR, 1.5);

          ep.orbitAngle += instSpeed * dt;
          ep.x = hostStar.x + Math.cos(ep.orbitAngle) * currentR;
          ep.y = hostStar.y + Math.sin(ep.orbitAngle) * currentR;
        }

        ep.stageTimer += dt;
        ep.rotation += ep.rotSpeed * dt;

        // GOLDILOCKS HABITABLE ZONE EVOLUTION
        if (ep.zoneType === 'scorching') {
          // Гаряча орбіта біля зірки -> вічний вулканічний світ
          ep.stage = ep.stageTimer < 6.0 ? 'rock' : 'volcanic';
        } else if (ep.zoneType === 'frozen') {
          // Холодна далека орбіта -> крижана куля
          ep.stage = ep.stageTimer < 6.0 ? 'rock' : 'ice';
        } else {
          // Зона життя (Habitable) -> повний цикл зародження біосфери:
          if (ep.stageTimer < 7.0) {
            ep.stage = 'rock';
          } else if (ep.stageTimer < 16.0) {
            ep.stage = 'volcanic';
          } else if (ep.stageTimer < 24.0) {
            ep.stage = 'ice';
          } else if (ep.stageTimer < 34.0) {
            ep.stage = 'water_land';
          } else if (ep.stageTimer < 44.0) {
            ep.stage = 'lung_breath';
          } else {
            ep.stage = 'verdant';
          }
        }

        // Collision birth flash
        if (ep.collisionFlash > 0.01) {
          ep.collisionFlash = Math.max(0, ep.collisionFlash - dt * 1.6);
          ctx.save();
          const flR = ep.radius * (3.5 + (1.0 - ep.collisionFlash) * 6.0);
          const flGrad = ctx.createRadialGradient(ep.x, ep.y, 0, ep.x, ep.y, flR);
          flGrad.addColorStop(0, `rgba(255, 255, 255, ${ep.collisionFlash * 0.9})`);
          flGrad.addColorStop(0.35, `rgba(251, 191, 36, ${ep.collisionFlash * 0.6})`);
          flGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
          ctx.fillStyle = flGrad;
          ctx.beginPath();
          ctx.arc(ep.x, ep.y, flR, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.save();
        ctx.translate(ep.x, ep.y);

        // Render atmospheric glow aura matching current planet stage
        ctx.save();
        const atmRadius = ep.radius * 1.6;
        const atmGrad = ctx.createRadialGradient(0, 0, ep.radius * 0.75, 0, 0, atmRadius);
        let atmColor1 = 'rgba(168, 162, 158, 0.35)';

        if (ep.stage === 'rock') {
          atmColor1 = 'rgba(168, 162, 158, 0.35)';
        } else if (ep.stage === 'volcanic') {
          atmColor1 = 'rgba(239, 68, 68, 0.72)'; // Вогняно-червона атмосфера для вулканічної активності
        } else if (ep.stage === 'ice') {
          atmColor1 = 'rgba(56, 189, 248, 0.75)'; // Блакитна крижана атмосфера для крижаної планети
        } else if (ep.stage === 'water_land') {
          atmColor1 = 'rgba(14, 165, 233, 0.55)';
        } else if (ep.stage === 'lung_breath') {
          atmColor1 = 'rgba(45, 212, 191, 0.6)';
        } else if (ep.stage === 'verdant') {
          atmColor1 = 'rgba(74, 222, 128, 0.6)';
        }

        atmGrad.addColorStop(0, atmColor1);
        atmGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = atmGrad;
        ctx.beginPath();
        ctx.arc(0, 0, atmRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // --- STAGE RENDERING ---
        if (ep.stage === 'rock') {
          // 1. Шматок каміння (proto-planet rock with jagged contours)
          ctx.save();
          ctx.rotate(ep.rotation);
          ctx.fillStyle = '#57534e';
          ctx.strokeStyle = '#292524';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          const rockPts = 8;
          for (let p = 0; p < rockPts; p++) {
            const th = (p / rockPts) * Math.PI * 2;
            const r = ep.radius * (0.8 + 0.35 * Math.sin(p * 2.3));
            const rx = Math.cos(th) * r;
            const ry = Math.sin(th) * r;
            if (p === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Craters
          ctx.fillStyle = '#1c1917';
          ctx.beginPath();
          ctx.arc(-1.2, -0.6, 1.1, 0, Math.PI * 2);
          ctx.arc(1.0, 1.0, 0.9, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (ep.stage === 'volcanic') {
          // 2. Вулканічна активність (Magma ocean, glowing lava cracks, incandescent heat)
          const heatProg = Math.min(1.0, (ep.stageTimer - 11.0) / 4.0);
          
          // Magma body glow
          ctx.shadowColor = '#ea580c';
          ctx.shadowBlur = 10 * heatProg;

          // Dark basalt crust
          ctx.fillStyle = '#1c1917';
          ctx.beginPath();
          ctx.arc(0, 0, ep.radius, 0, Math.PI * 2);
          ctx.fill();

          // Glowing lava fissures & magma rivers
          ctx.save();
          ctx.rotate(ep.rotation * 0.8);
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(-ep.radius * 0.7, -ep.radius * 0.3);
          ctx.lineTo(-ep.radius * 0.1, ep.radius * 0.4);
          ctx.lineTo(ep.radius * 0.6, ep.radius * 0.1);
          ctx.stroke();

          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(-ep.radius * 0.4, ep.radius * 0.2);
          ctx.lineTo(ep.radius * 0.3, -ep.radius * 0.6);
          ctx.stroke();

          // Volcanic caldera eruption hotspots
          const pulseLava = 0.5 + 0.5 * Math.sin(ep.stageTimer * 6);
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(-ep.radius * 0.2, -ep.radius * 0.2, 1.0 + pulseLava * 0.4, 0, Math.PI * 2);
          ctx.arc(ep.radius * 0.3, ep.radius * 0.3, 0.9 + pulseLava * 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (ep.stage === 'ice') {
          // 3. Крижана планета (Frozen ice world with glacial blue crust and white frost sheets)
          ctx.save();
          ctx.rotate(ep.rotation);
          ctx.fillStyle = '#bae6fd'; // Ice blue
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(0, 0, ep.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Glacial ice caps
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, -ep.radius * 0.55, ep.radius * 0.5, 0, Math.PI * 2);
          ctx.arc(0, ep.radius * 0.55, ep.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (ep.stage === 'water_land') {
          // 3. Покривається водою і сушею (Oceans & emerging brown continents)
          // Ocean sphere
          ctx.fillStyle = '#1d4ed8';
          ctx.shadowColor = '#3b82f6';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(0, 0, ep.radius, 0, Math.PI * 2);
          ctx.fill();

          // Continents
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, ep.radius - 0.2, 0, Math.PI * 2);
          ctx.clip();
          ctx.rotate(ep.rotation);
          ctx.fillStyle = '#78716c'; // Barren rocky land
          ep.continents.forEach((c) => {
            ctx.beginPath();
            ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
        } else if (ep.stage === 'lung_breath') {
          // 4. "Один раз легенів" (The Great Oxygenation / Planetary Breath exhalation)
          const breathT = (ep.stageTimer - 38.0) / 8.0; // 0 to 1
          const breathSine = Math.sin(breathT * Math.PI); // Inhale -> Peak Expansion -> Exhale
          ep.breathPulse = breathSine;

          // Planetary Atmosphere Exhalation Wave (Легені планети)
          const auraR = ep.radius * (1.2 + breathSine * 1.8);
          const auraGrad = ctx.createRadialGradient(0, 0, ep.radius * 0.8, 0, 0, auraR);
          auraGrad.addColorStop(0, `rgba(56, 189, 248, ${0.45 * breathSine})`);
          auraGrad.addColorStop(0.65, `rgba(167, 243, 208, ${0.35 * breathSine})`);
          auraGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(0, 0, auraR, 0, Math.PI * 2);
          ctx.fill();

          // Oceans
          ctx.fillStyle = '#2563eb';
          ctx.beginPath();
          ctx.arc(0, 0, ep.radius, 0, Math.PI * 2);
          ctx.fill();

          // Continents transitioning from stone to early moss green
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, ep.radius - 0.2, 0, Math.PI * 2);
          ctx.clip();
          ctx.rotate(ep.rotation);
          const blendGreen = Math.floor(100 + breathSine * 60);
          ctx.fillStyle = `rgb(90, ${blendGreen}, 80)`;
          ep.continents.forEach((c) => {
            ctx.beginPath();
            ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
        } else if (ep.stage === 'verdant') {
          // 5. Зеленіє (Lush living planet with vibrant green flora, blue oceans, white swirling clouds)
          // Biosphere atmospheric halo
          ctx.save();
          const atmoGrad = ctx.createRadialGradient(0, 0, ep.radius * 0.9, 0, 0, ep.radius * 1.55);
          atmoGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
          atmoGrad.addColorStop(0.7, 'rgba(52, 211, 153, 0.2)');
          atmoGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
          ctx.fillStyle = atmoGrad;
          ctx.beginPath();
          ctx.arc(0, 0, ep.radius * 1.55, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Deep vibrant sapphire ocean
          ctx.fillStyle = '#1d4ed8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(0, 0, ep.radius, 0, Math.PI * 2);
          ctx.fill();

          // Lush emerald-green continents
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, ep.radius - 0.2, 0, Math.PI * 2);
          ctx.clip();
          ctx.rotate(ep.rotation);
          ctx.fillStyle = '#059669'; // Emerald flora
          ep.continents.forEach((c) => {
            ctx.beginPath();
            ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2);
            ctx.fill();
          });

          // Secondary vibrant lime/forest patches
          ctx.fillStyle = '#34d399';
          ep.continents.forEach((c) => {
            ctx.beginPath();
            ctx.arc(c.cx + 0.4, c.cy - 0.3, c.r * 0.55, 0, Math.PI * 2);
            ctx.fill();
          });

          // Drifting white atmospheric clouds
          ctx.rotate(ep.rotation * 0.6);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.beginPath();
          ctx.arc(-1.5, 0.8, 1.4, 0, Math.PI * 2);
          ctx.arc(1.2, -1.0, 1.2, 0, Math.PI * 2);
          ctx.arc(0.2, 1.6, 0.9, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.restore();

        // Check planetary life cycle termination (ends after verdant stage ~58s) -> Explodes into cosmic debris
        const shouldExplode = ep.stageTimer >= 58.0;

        if (shouldExplode) {
          triggerPlanetExplosion(ep);
          evolvingPlanet = null;
        }
      }

      // 4b. RENDER PLANETARY DEBRIS FRAGMENTS (Шматки космічного сміття після вибуху планети)
      for (let pdIdx = planetaryDebris.length - 1; pdIdx >= 0; pdIdx--) {
        const pd = planetaryDebris[pdIdx];
        pd.life += dt;
        pd.x += pd.vx;
        pd.y += pd.vy;
        pd.vx *= 0.985;
        pd.vy *= 0.985;
        pd.rotation += pd.rotSpeed * dt;

        pd.alpha = Math.max(0, 1.0 - pd.life / pd.maxLife);

        if (pd.life >= pd.maxLife || pd.alpha <= 0.01) {
          planetaryDebris.splice(pdIdx, 1);
          continue;
        }

        ctx.save();
        ctx.translate(pd.x, pd.y);
        ctx.rotate(pd.rotation);
        ctx.globalAlpha = pd.alpha;

        ctx.fillStyle = pd.color;
        ctx.shadowColor = pd.glowColor;
        ctx.shadowBlur = pd.size * 2;

        ctx.beginPath();
        const numPts = pd.shapePoints.length;
        for (let p = 0; p < numPts; p++) {
          const theta = (p / numPts) * Math.PI * 2;
          const r = pd.size * pd.shapePoints[p];
          const px = Math.cos(theta) * r;
          const py = Math.sin(theta) * r;
          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // 5. REALISTIC METEOR FLIGHT SIMULATION & PERSISTENT ION TRAILS
      if (timestamp > nextMeteorTime && isDark) {
        spawnMeteor();
        const delayMult = Math.max(0.08, 1.0 / Math.pow(meteorIntensity / 3.5, 1.35));
        // Natural Poisson burst rhythm: occasional quick pairs, occasional serene pauses
        const burstRoll = Math.random();
        let baseDelay = spaceMode === 'meteor' ? 1400 : 5200;
        if (burstRoll < 0.22) {
          baseDelay *= 0.32; // Quick follow-up burst
        } else if (burstRoll > 0.88) {
          baseDelay *= 1.55; // Quiet celestial interval
        }
        const jitter = (Math.random() - 0.5) * (baseDelay * 0.40);
        nextMeteorTime = timestamp + Math.max(350, (baseDelay + jitter) * delayMult);
      }

      // 5a. AIRBURST HALO FLASHES (Explosive terminal airbursts)
      ctx.save();
      for (let fIdx = airburstFlashes.length - 1; fIdx >= 0; fIdx--) {
        const flash = airburstFlashes[fIdx];
        flash.radius += (flash.maxRadius - flash.radius) * 0.28 + 1.2;
        flash.alpha *= 0.85;

        if (flash.alpha <= 0.02 || flash.radius >= flash.maxRadius - 1) {
          airburstFlashes.splice(fIdx, 1);
          continue;
        }

        // Ambient radial light bloom
        const fGrad = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, flash.radius);
        fGrad.addColorStop(0, `rgba(255, 255, 255, ${flash.alpha * 0.70})`);
        fGrad.addColorStop(0.40, `${flash.color}${Math.floor(flash.alpha * 140).toString(16).padStart(2, '0')}`);
        fGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = fGrad;
        ctx.beginPath();
        ctx.arc(flash.x, flash.y, flash.radius, 0, Math.PI * 2);
        ctx.fill();

        // Expanding delicate shockwave ring
        ctx.strokeStyle = `rgba(255, 255, 255, ${flash.alpha * 0.50})`;
        ctx.lineWidth = 1.0;
        ctx.shadowColor = flash.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(flash.x, flash.y, flash.radius * 0.88, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 5b. PERSISTENT IONIZATION TRAILS (Delicate, gossamer mesospheric ion trail)
      ctx.save();
      for (let tIdx = persistentTrains.length - 1; tIdx >= 0; tIdx--) {
        const tr = persistentTrains[tIdx];
        tr.alpha -= dt * tr.decayRate;

        if (tr.alpha <= 0.015) {
          persistentTrains.splice(tIdx, 1);
          continue;
        }

        // Apply thermal diffusion (expansion) & upper-altitude wind drift
        for (let pIdx = 0; pIdx < tr.points.length; pIdx++) {
          const pt = tr.points[pIdx];
          pt.x += tr.driftVx;
          pt.y += tr.driftVy;
          pt.width += tr.expansionRate;
        }

        if (tr.points.length >= 2) {
          // Outer subtle ion glow
          ctx.beginPath();
          ctx.moveTo(tr.points[0].x, tr.points[0].y);
          for (let pIdx = 1; pIdx < tr.points.length; pIdx++) {
            ctx.lineTo(tr.points[pIdx].x, tr.points[pIdx].y);
          }
          ctx.strokeStyle = tr.color;
          ctx.lineWidth = Math.max(0.8, tr.points[0].width * 0.75);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowColor = tr.glowColor;
          ctx.shadowBlur = 6;
          ctx.globalAlpha = tr.alpha * 0.25;
          ctx.stroke();

          // Delicate central ionization filament
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = Math.max(0.5, tr.points[0].width * 0.25);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.globalAlpha = tr.alpha * 0.20;
          ctx.stroke();
        }
      }
      ctx.restore();

      // 5c. METEORS / SHOOTING STARS PHYSICS LOOP
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life++;

        // 1. Aerodynamic drag deceleration and trajectory physics
        const normY = Math.min(1.2, Math.max(0, m.y / height));
        const rho = (0.010 + 0.12 * Math.exp(2.2 * normY)) / m.z;
        const currentSpeed = Math.hypot(m.vx, m.vy);
        
        const dragForce = (0.5 * rho * (currentSpeed * currentSpeed) * 0.9) / m.mass;
        const newSpeed = Math.max(currentSpeed - dragForce * 0.032, m.initialSpeed * 0.38);
        
        const dirX = currentSpeed > 0.001 ? m.vx / currentSpeed : 1;
        const dirY = currentSpeed > 0.001 ? m.vy / currentSpeed : 0;
        m.vx = dirX * newSpeed;
        m.vy = dirY * newSpeed;
        m.speed = newSpeed;

        // Thermal ablation mass loss
        const heatFlux = rho * Math.pow(newSpeed, 2.7) * 0.000010;
        m.mass -= heatFlux;

        // Hypersonic kinetic position integration
        m.x += m.vx;
        m.y += m.vy;

        // Asymmetric meteor light curve tailored to archetype
        const progress = m.life / m.maxLife;
        let lightCurve: number;

        if (m.kind === 'grazer') {
          // Earthgrazer: undulating luminosity skipping along the mesosphere
          const baseArc = Math.sin(progress * Math.PI);
          const ripple = 0.12 * Math.sin(progress * 14 + (m.wavePhase ?? 0));
          lightCurve = Math.max(0, baseArc * (0.88 + ripple));
        } else if (m.kind === 'dart') {
          // Hypersonic dart: razor-sharp early flash then rapid elegant extinction
          if (progress < 0.16) {
            lightCurve = Math.pow(progress / 0.16, 1.6);
          } else {
            lightCurve = Math.pow(Math.max(0, 1.0 - (progress - 0.16) / 0.84), 1.25);
          }
        } else if (m.kind === 'sporadic') {
          // Gentle smooth bell curve for distant meteors
          lightCurve = Math.sin(progress * Math.PI);
        } else {
          // Bolide / Pair: intense incandescence with peak ram-pressure flare
          if (progress < 0.20) {
            lightCurve = Math.pow(progress / 0.20, 1.8);
          } else {
            lightCurve = Math.pow(Math.max(0, 1.0 - (progress - 0.20) / 0.80), 1.10);
          }
        }

        const dynamicAblationGlow = Math.min(0.4, heatFlux * 15);
        m.luminosity = Math.max(0, Math.min(1.0, lightCurve * (0.85 + dynamicAblationGlow)));

        // Record high-frequency path history (sleek, non-smudgy widths)
        m.history.unshift({
          x: m.x,
          y: m.y,
          speed: newSpeed,
          alpha: m.luminosity,
          width: m.size * (0.80 + m.luminosity * 0.35) * m.z,
        });
        const maxHistory = m.kind === 'grazer' ? 52 : m.isBolide ? 46 : 28;
        if (m.history.length > maxHistory) {
          m.history.pop();
        }

        // 2. Deposit persistent mesospheric ionization train
        if (m.luminosity > 0.22 && (m.isBolide || m.kind === 'grazer' || Math.random() < 0.35)) {
          if (!m.activeTrain) {
            if (persistentTrains.length < 24) {
              const newTrain: PersistentTrain = {
                points: [{ x: m.x, y: m.y, width: Math.max(0.6, m.size * 0.85 * m.z), alpha: m.luminosity * 0.65 }],
                color: m.tailColor,
                glowColor: m.glowColor,
                alpha: m.luminosity * (m.isBolide ? 0.85 : 0.55),
                decayRate: m.isBolide ? 0.10 : 0.16,
                expansionRate: 0.012,
                driftVx: (Math.random() - 0.48) * 0.08,
                driftVy: (Math.random() - 0.5) * 0.02,
              };
              persistentTrains.push(newTrain);
              m.activeTrain = newTrain;
            }
          } else {
            m.activeTrain.points.push({
              x: m.x,
              y: m.y,
              width: Math.max(0.6, m.size * 0.85 * m.z),
              alpha: m.luminosity * 0.65,
            });
            m.activeTrain.alpha = Math.max(m.activeTrain.alpha, m.luminosity * (m.isBolide ? 0.85 : 0.55));
          }
        }

        // 3. Aerodynamic shockwave perturbation on cosmic dust motes
        for (let mIdx = 0; mIdx < motes.length; mIdx++) {
          const mote = motes[mIdx];
          const mdx = mote.x - m.x;
          const mdy = mote.y - m.y;
          const mdistSq = mdx * mdx + mdy * mdy;
          const shockRadius = m.size * 14;
          if (mdistSq < shockRadius * shockRadius && mdistSq > 4) {
            const mdist = Math.sqrt(mdistSq);
            const shockStrength = (1.0 - mdist / shockRadius) * (m.isBolide ? 1.2 : 0.6);
            mote.vx += (mdx / mdist) * shockStrength + dirX * 0.20;
            mote.vy += (mdy / mdist) * shockStrength + dirY * 0.20;
          }
        }

        // 4. Shed dynamic mineral sparks (Spallation debris with differential drag)
        if (m.luminosity > 0.30 && Math.random() < (m.isBolide ? 0.70 : 0.28)) {
          const revAngle = Math.atan2(m.vy, m.vx) + Math.PI + (Math.random() - 0.5) * 0.35;
          const sparkSpeed = Math.random() * 3.6 + 1.0;
          m.sparkles.push({
            x: m.x,
            y: m.y,
            vx: Math.cos(revAngle) * sparkSpeed + (Math.random() - 0.5) * 0.4,
            vy: Math.sin(revAngle) * sparkSpeed + (Math.random() - 0.5) * 0.4,
            alpha: 1.0,
            size: Math.random() * (m.isBolide ? 1.4 : 0.9) + 0.3,
            color: '#ffffff',
            temperature: 1.0, // starts white-hot
          });
        }

        // 5. Update and Render Shed Debris Sparkles
        ctx.save();
        for (let sIdx = m.sparkles.length - 1; sIdx >= 0; sIdx--) {
          const sp = m.sparkles[sIdx];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vx *= 0.92;
          sp.vy *= 0.92;
          sp.temperature -= dt * 2.8;
          sp.alpha -= dt * 1.8;

          if (sp.alpha <= 0.02 || sp.temperature <= 0) {
            m.sparkles.splice(sIdx, 1);
            continue;
          }

          // Thermal cooling color transition: White -> Gold -> Amber -> Cinder
          let sparkColor: string;
          if (sp.temperature > 0.70) {
            sparkColor = '#ffffff';
          } else if (sp.temperature > 0.40) {
            sparkColor = '#fef08a';
          } else if (sp.temperature > 0.18) {
            sparkColor = '#f97316';
          } else {
            sparkColor = '#991b1b';
          }

          ctx.fillStyle = sparkColor;
          ctx.globalAlpha = sp.alpha * m.luminosity;
          ctx.shadowColor = sparkColor;
          ctx.shadowBlur = sp.size * 2;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // 6. Bolide Catastrophic Airburst & Fragmentation
        if (m.isBolide && m.flaresLeft > 0 && progress >= m.nextFlareProgress) {
          m.flaresLeft--;
          m.nextFlareProgress += 0.14;

          // Detonation airburst shockwave flash
          airburstFlashes.push({
            x: m.x,
            y: m.y,
            radius: 2,
            maxRadius: m.size * 14,
            alpha: 0.85,
            color: m.color,
          });

          // Disintegrate into 2-3 daughter fragments
          const fragmentCount = Math.floor(Math.random() * 2 + 2);
          for (let f = 0; f < fragmentCount; f++) {
            const fAngle = Math.atan2(m.vy, m.vx) + (Math.random() - 0.5) * 0.28;
            const fSpeed = currentSpeed * (0.80 + Math.random() * 0.20);
            m.fragments.push({
              x: m.x,
              y: m.y,
              vx: Math.cos(fAngle) * fSpeed,
              vy: Math.sin(fAngle) * fSpeed,
              size: m.size * (0.30 + Math.random() * 0.20),
              life: 0,
              maxLife: Math.floor(Math.random() * 10 + 8),
              color: m.color,
              tailColor: m.tailColor,
              history: [{ x: m.x, y: m.y }],
            });
          }

          // Explosive ejection of bright sparks
          for (let b = 0; b < 6; b++) {
            const bAngle = Math.random() * Math.PI * 2;
            const bSpeed = Math.random() * 5.0 + 1.5;
            m.sparkles.push({
              x: m.x,
              y: m.y,
              vx: Math.cos(bAngle) * bSpeed,
              vy: Math.sin(bAngle) * bSpeed,
              alpha: 1.0,
              size: Math.random() * 1.6 + 0.6,
              color: '#ffffff',
              temperature: 1.0,
            });
          }
        }

        // 7. Update & Draw Daughter Fragments
        if (m.fragments.length > 0) {
          ctx.save();
          for (let fIdx = m.fragments.length - 1; fIdx >= 0; fIdx--) {
            const frag = m.fragments[fIdx];
            frag.life++;
            frag.vx *= 0.95;
            frag.vy *= 0.95;
            frag.x += frag.vx;
            frag.y += frag.vy;
            frag.history.unshift({ x: frag.x, y: frag.y });
            if (frag.history.length > 6) frag.history.pop();

            const fProgress = frag.life / frag.maxLife;
            const fFade = Math.max(0, 1.0 - fProgress);

            if (frag.life >= frag.maxLife) {
              m.fragments.splice(fIdx, 1);
              continue;
            }

            if (frag.history.length >= 2) {
              ctx.strokeStyle = frag.tailColor;
              ctx.lineWidth = Math.max(0.5, frag.size * 1.4 * fFade);
              ctx.lineCap = 'round';
              ctx.globalAlpha = fFade * 0.6;
              ctx.shadowColor = frag.tailColor;
              ctx.shadowBlur = 4;
              ctx.beginPath();
              ctx.moveTo(frag.history[0].x, frag.history[0].y);
              ctx.lineTo(frag.history[frag.history.length - 1].x, frag.history[frag.history.length - 1].y);
              ctx.stroke();

              // Fragment head
              ctx.fillStyle = '#ffffff';
              ctx.globalAlpha = fFade * 0.9;
              ctx.beginPath();
              ctx.arc(frag.x, frag.y, Math.max(0.4, frag.size * fFade * 0.8), 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();
        }

        // 8. MULTI-PASS HYPERSONIC PLASMA COLUMN RENDERING (Laser-crisp, elegant tapering)
        if (m.history.length >= 2 && m.luminosity > 0.02) {
          ctx.save();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          // PASS 0: Soft Ambient Sky Bloom (Subtle cosmic illuminance for bright meteors)
          if (m.luminosity > 0.45) {
            const bloomRadius = m.size * (m.isBolide ? 28 : 16) * m.luminosity * m.z;
            const bloomGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, bloomRadius);
            bloomGrad.addColorStop(0, `${m.tailColor}${Math.floor(m.luminosity * 30).toString(16).padStart(2, '0')}`);
            bloomGrad.addColorStop(0.6, `${m.tailColor}06`);
            bloomGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = bloomGrad;
            ctx.beginPath();
            ctx.arc(m.x, m.y, bloomRadius, 0, Math.PI * 2);
            ctx.fill();
          }

          // PASS 1: Sleek Thermal Ionization Sheath (Atmospheric plasma glow)
          for (let hIdx = 0; hIdx < m.history.length - 1; hIdx++) {
            const p1 = m.history[hIdx];
            const p2 = m.history[hIdx + 1];
            const taper = 1.0 - (hIdx / m.history.length);
            const segAlpha = m.luminosity * taper * 0.45;

            ctx.strokeStyle = m.tailColor;
            ctx.lineWidth = Math.max(0.8, p1.width * 1.5 * taper);
            ctx.shadowColor = m.glowColor;
            ctx.shadowBlur = m.isBolide ? 10 : 5;
            ctx.globalAlpha = segAlpha;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }

          // PASS 2: Needle-Sharp Incandescent Core (Extreme temperature shockfront)
          const coreLen = Math.min(m.history.length - 1, Math.ceil(m.history.length * 0.85));
          for (let hIdx = 0; hIdx < coreLen; hIdx++) {
            const p1 = m.history[hIdx];
            const p2 = m.history[hIdx + 1];
            const taper = 1.0 - (hIdx / coreLen);

            ctx.strokeStyle = m.coreColor;
            ctx.lineWidth = Math.max(0.5, p1.width * 0.75 * taper);
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = m.isBolide ? 6 : 3;
            ctx.globalAlpha = m.luminosity * taper * 0.95;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }

          // PASS 3: Aerodynamic Hypersonic Compression Cap & Diffraction Sparkle
          const headAngle = Math.atan2(m.vy, m.vx);
          const headRadius = m.size * 1.3 * m.luminosity * m.z;

          if (headRadius > 0.2) {
            ctx.save();
            ctx.translate(m.x, m.y);
            ctx.rotate(headAngle);

            // Elliptical teardrop compression cap
            const shockGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, headRadius * 2.0);
            shockGrad.addColorStop(0, '#ffffff');
            shockGrad.addColorStop(0.35, m.color);
            shockGrad.addColorStop(0.75, m.tailColor);
            shockGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = shockGrad;
            ctx.shadowColor = m.color;
            ctx.shadowBlur = m.isBolide ? 14 : 7;
            ctx.globalAlpha = m.luminosity;
            ctx.beginPath();
            ctx.ellipse(0, 0, headRadius * 1.8, headRadius * 0.9, 0, 0, Math.PI * 2);
            ctx.fill();

            // Core solid white-hot focal point
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, headRadius * 0.65, 0, Math.PI * 2);
            ctx.fill();

            // PASS 4: Diffraction Glare Spikes (Telescopic astrophotography diamond sparkle)
            if (m.luminosity > 0.50) {
              const spikeLen = headRadius * (m.isBolide ? 3.8 : 2.6);
              ctx.strokeStyle = 'rgba(255, 255, 255, ' + (m.luminosity * 0.85) + ')';
              ctx.lineWidth = 0.6;
              ctx.shadowColor = '#ffffff';
              ctx.shadowBlur = 4;

              // Primary 4-ray cross
              ctx.beginPath();
              ctx.moveTo(-spikeLen, 0);
              ctx.lineTo(spikeLen, 0);
              ctx.moveTo(0, -spikeLen * 0.7);
              ctx.lineTo(0, spikeLen * 0.7);
              ctx.stroke();
            }

            ctx.restore();
          }

          ctx.restore();
        }

        // Termination conditions: lifetime expired, mass completely ablated, or offscreen
        if (m.life >= m.maxLife || m.mass <= 0.05 || m.x > width + 180 || m.x < -180 || m.y > height + 180) {
          meteors.splice(i, 1);
        }
      }

      // 6. SUBTLE STARLIGHT GLOW (Зоряне сяйво)
      for (let i = starlightGlows.length - 1; i >= 0; i--) {
        const glow = starlightGlows[i];
        glow.radius += (glow.maxRadius - glow.radius) * 0.12 + 0.8;
        glow.alpha *= 0.91;

        if (glow.alpha < 0.02 || glow.radius >= glow.maxRadius - 1) {
          starlightGlows.splice(i, 1);
          continue;
        }

        // Never render starlight glow inside the cosmic ring center void
        if (isShellPresent && shellStyle === 'cosmic_ring') {
          const distToCenter = Math.hypot(glow.x - shellX, glow.y - shellY);
          if (distToCenter < 38) {
            starlightGlows.splice(i, 1);
            continue;
          }
        }

        ctx.save();
        // Delicate soft ring
        ctx.strokeStyle = `rgba(103, 232, 249, ${glow.alpha * 0.55})`;
        ctx.lineWidth = 1.0;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(glow.x, glow.y, glow.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Small 4-point cross glint in center
        const glintLen = (1 - glow.radius / glow.maxRadius) * 6;
        if (glintLen > 0.5) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${glow.alpha * 0.8})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(glow.x - glintLen, glow.y);
          ctx.lineTo(glow.x + glintLen, glow.y);
          ctx.moveTo(glow.x, glow.y - glintLen);
          ctx.lineTo(glow.x, glow.y + glintLen);
          ctx.stroke();
        }

        // Tiny pinprick sparks
        glow.sparks.forEach((sp) => {
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vx *= 0.92;
          sp.vy *= 0.92;
          sp.alpha *= 0.92;

          ctx.fillStyle = sp.color;
          ctx.globalAlpha = sp.alpha * glow.alpha;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      }

      // AUTO-FPS GUARD: Evaluate frame budget and dynamically adjust fidelity
      const frameDurationMs = performance.now() - frameStartMs;
      if (frameDurationMs > 0 && frameDurationMs < 200) {
        perfFrameTimesRef.current.push(frameDurationMs);
        if (perfFrameTimesRef.current.length > 25) perfFrameTimesRef.current.shift();
        const avgFrameMs = perfFrameTimesRef.current.reduce((a, b) => a + b, 0) / perfFrameTimesRef.current.length;
        if (avgFrameMs > 18 && !isLowFpsModeRef.current) {
          isLowFpsModeRef.current = true;
        } else if (avgFrameMs < 13 && isLowFpsModeRef.current) {
          isLowFpsModeRef.current = false;
        }
      }

      if (isRunning && !document.hidden) {
        animId = requestAnimationFrame(render);
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        if (animId) cancelAnimationFrame(animId);
      } else {
        if (isRunning) {
          if (animId) cancelAnimationFrame(animId);
          animId = requestAnimationFrame(render);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('scroll', updateShellPos);
      window.removeEventListener('analyzer-shell-burst', handleShellBurstEvent);
      window.removeEventListener('analyzer-shell-click', handleShellBurstEvent);
      window.removeEventListener('cosmic-arm-star-detached', handleArmStarDetached);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPerfBoost, density, spaceMode, isNight, isDawn, isSunset, starCountSetting]);

  // Atmosphere background gradient overlay based on active space mode and circadian time
  const isParchment = typeof document !== 'undefined' && document.documentElement.getAttribute('data-app-theme') === 'parchment';

  const getAtmosphereStyle = () => {
    if (isParchment) {
      return 'bg-amber-900/[0.02]';
    }

    if (spaceMode === 'deep_space') {
      return 'bg-gradient-to-b from-slate-900/10 via-zinc-950/20 to-slate-950/30';
    }
    if (spaceMode === 'nebula') {
      return 'bg-gradient-to-tr from-indigo-950/20 via-purple-950/15 to-slate-950/30';
    }
    if (spaceMode === 'aurora') {
      return 'bg-gradient-to-b from-emerald-950/15 via-cyan-950/20 to-slate-950/30';
    }
    if (spaceMode === 'meteor') {
      return 'bg-gradient-to-b from-slate-900/15 via-zinc-950/25 to-slate-950/35';
    }

    // Auto circadian atmosphere
    if (isNight) {
      return 'bg-slate-950/15 dark:bg-zinc-950/20';
    }
    if (isDawn) {
      return 'bg-rose-950/10 dark:bg-indigo-950/20';
    }
    if (isSunset) {
      return 'bg-amber-950/10 dark:bg-purple-950/25';
    }
    return 'bg-transparent';
  };

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 transition-colors duration-1000 ${getAtmosphereStyle()}`}>
      {!isPerfBoost && (
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      )}
    </div>
  );
};
