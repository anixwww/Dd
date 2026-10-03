import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  X, RotateCcw, Trash2, Save, Image as ImageIcon, 
  PenTool, Eraser, Sun, Sliders, ChevronDown, Palette, Pipette
} from 'lucide-react';
import { YinYangGalleryModal, saveArtworkToStorage } from './YinYangGalleryModal';

interface EdenPenCanvasProps {
  isActive: boolean;
  onExit?: () => void;
}

export interface SprayParticle {
  dx: number;
  dy: number;
  r: number;
  alpha: number;
}

export interface StrokePoint {
  x: number;
  y: number;
  particles?: SprayParticle[];
}

export type LightToolType = 'pen' | 'spray' | 'laser' | 'mirror' | 'prism' | 'eraser';
export type SymmetryMode = 'none' | 'dual' | 'quad';

// ==========================================
// BESPOKE CUSTOM SVGs ACCORDING TO USER SPEC
// ==========================================

// 1. Спрей — Скупчення крапок (Cluster of dots / Quantum Stippling)
export const SprayDotsIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="12" r="2.2" />
    <circle cx="7.5" cy="8.5" r="1.4" opacity="0.9" />
    <circle cx="16.5" cy="8" r="1.6" opacity="0.95" />
    <circle cx="16.5" cy="15.5" r="1.3" opacity="0.85" />
    <circle cx="8" cy="16" r="1.5" opacity="0.9" />
    <circle cx="12" cy="5.5" r="1.2" opacity="0.75" />
    <circle cx="12" cy="18.5" r="1.2" opacity="0.75" />
    <circle cx="4.5" cy="12" r="1.0" opacity="0.65" />
    <circle cx="19.5" cy="12" r="1.0" opacity="0.65" />
    <circle cx="14.5" cy="11.5" r="0.9" opacity="0.8" />
    <circle cx="9.5" cy="12.5" r="0.9" opacity="0.8" />
  </svg>
);

// 2. Лазер — Крапки в лінії (Dots arranged in a straight line)
export const LaserDottedLineIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="3.5" cy="12" r="1.8" fill="currentColor" />
    <circle cx="7.5" cy="12" r="1.5" fill="currentColor" opacity="0.9" />
    <circle cx="11.5" cy="12" r="1.4" fill="currentColor" opacity="0.85" />
    <circle cx="15.5" cy="12" r="1.5" fill="currentColor" opacity="0.9" />
    <circle cx="19.5" cy="12" r="1.8" fill="currentColor" />
    <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 3" opacity="0.4" />
  </svg>
);

// 3. Дзеркало — Старовинне витончене дзеркало з ручкою (Vintage ornate handheld mirror)
export const VintageMirrorIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="9.5" rx="6.5" ry="7.5" fill="currentColor" fillOpacity="0.12" />
    <ellipse cx="12" cy="9.5" rx="4.8" ry="5.8" strokeWidth="1" strokeDasharray="5 2" opacity="0.75" />
    <path d="M10 6 C12 7 13 8.5 13.5 11" strokeWidth="1.2" opacity="0.85" />
    <path d="M10 2 C11.2 2.5 12.8 2.5 14 2" strokeWidth="1.4" />
    <circle cx="12" cy="2" r="0.7" fill="currentColor" />
    <path d="M12 17 L12 21.5" strokeWidth="2.2" />
    <ellipse cx="12" cy="22" rx="1.8" ry="1.2" fill="currentColor" />
  </svg>
);

// 4. Призма — Гранований кристал (Faceted Crystal / Gemstone)
export const CrystalGemIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="6,3 18,3 22,9 12,22 2,9" fill="currentColor" fillOpacity="0.12" />
    <line x1="2" y1="9" x2="22" y2="9" strokeWidth="1.4" />
    <polyline points="6,3 9.5,9 12,22 14.5,9 18,3" strokeWidth="1.2" />
    <polyline points="9.5,9 12,3 14.5,9" strokeWidth="1.2" />
  </svg>
);

// 5. Симетрія 1x — 1 центральна крапка
export const Symmetry1xIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 18 18" fill="currentColor" className={className}>
    <circle cx="9" cy="9" r="3.2" />
  </svg>
);

// 6. Симетрія 2x (Інь-Ян) — 2 крапки в симетричному положенні малювання (180°)
export const Symmetry2xIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 18 18" fill="currentColor" className={className}>
    <circle cx="4.5" cy="4.5" r="2.5" />
    <circle cx="13.5" cy="13.5" r="2.5" />
    <circle cx="9" cy="9" r="0.9" opacity="0.4" />
  </svg>
);

// 7. Симетрія 4x (Мандала) — 4 крапки у 4 положеннях малювання
export const Symmetry4xIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 18 18" fill="currentColor" className={className}>
    <circle cx="9" cy="3" r="2.2" />
    <circle cx="15" cy="9" r="2.2" />
    <circle cx="9" cy="15" r="2.2" />
    <circle cx="3" cy="9" r="2.2" />
    <circle cx="9" cy="9" r="0.9" opacity="0.4" />
  </svg>
);

export interface ToolMetadata {
  id: LightToolType;
  name: string;
  badge: string;
  shortDesc: string;
  fullDesc: string;
  icon: any;
  colorClass: string;
}

export const TOOLS_METADATA: Record<LightToolType, ToolMetadata> = {
  pen: {
    id: 'pen',
    name: 'Світло',
    badge: 'Каліграфія',
    shortDesc: 'Мʼякий промінь світла',
    fullDesc: 'Каліграфічне перо: малювання суцільним фотонним світлом із мʼяким сяючим ореолом.',
    icon: PenTool,
    colorClass: 'text-amber-300'
  },
  spray: {
    id: 'spray',
    name: 'Спрей',
    badge: 'Зоряний пил',
    shortDesc: 'Квантовий аерозоль',
    fullDesc: 'Зоряний спрей: розпилює сяючі квантові фотони та мерехтливий космічний пил.',
    icon: SprayDotsIcon,
    colorClass: 'text-yellow-300'
  },
  laser: {
    id: 'laser',
    name: 'Лазер',
    badge: 'Когерентний',
    shortDesc: 'Генератор фотонів',
    fullDesc: 'Лазерний емітер: створює когерентні промені та вистрілює активні квантові фотони.',
    icon: LaserDottedLineIcon,
    colorClass: 'text-amber-400'
  },
  mirror: {
    id: 'mirror',
    name: 'Дзеркало',
    badge: 'Відбиття',
    shortDesc: 'Оптичне дзеркало',
    fullDesc: 'Оптичне дзеркало: намальована лінія відбиває фотони світла й лазера за законом θi = θr.',
    icon: VintageMirrorIcon,
    colorClass: 'text-cyan-400'
  },
  prism: {
    id: 'prism',
    name: 'Призма',
    badge: 'Кристал',
    shortDesc: 'Дисперсія світла',
    fullDesc: 'Кристалічна призма: заломлює траєкторію фотонів і розщеплює їх на спектр веселки.',
    icon: CrystalGemIcon,
    colorClass: 'text-purple-400'
  },
  eraser: {
    id: 'eraser',
    name: 'Гумка',
    badge: 'Поглинач',
    shortDesc: 'Поглинач світла',
    fullDesc: 'Оптичний вакуум: безслідно поглинає та видаляє нанесені промені світла під пальцем.',
    icon: Eraser,
    colorClass: 'text-rose-400'
  }
};

export interface LightStroke {
  id: string;
  tool: LightToolType;
  points: StrokePoint[];
  color: string;
  width: number;
  opacity: number;
  symmetry?: SymmetryMode;
}

export interface PhotonBeam {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  wavelength: number;
  life: number;
  maxLife: number;
  history: { x: number; y: number }[];
  isSplit?: boolean;
  lastBounceId?: string;
  bounces?: number;
}

export interface OpticalSpark {
  x: number;
  y: number;
  color: string;
  radius: number;
  maxRadius: number;
  alpha: number;
  isPrism?: boolean;
}

interface Segment2D {
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  tool: LightToolType;
  width: number;
  strokeId: string;
  segIdx: number;
}

// Curated Spectral Presets
const SPECTRAL_LIGHTS = [
  { name: 'Сонячний Ян', value: '#ffffff', wavelength: 550 },
  { name: 'Золоте Світло', value: '#ffd54f', wavelength: 580 },
  { name: 'Неоновий Ціан', value: '#00e5ff', wavelength: 485 },
  { name: 'Смарагд', value: '#00e676', wavelength: 532 },
  { name: 'Астральний Фіал', value: '#e040fb', wavelength: 415 },
  { name: 'Рубін', value: '#ff1744', wavelength: 650 },
  { name: 'Амбра', value: '#ff9100', wavelength: 605 },
  { name: 'Аквамарин', value: '#1de9b6', wavelength: 500 },
  { name: 'Ультрамарин', value: '#3d5afe', wavelength: 440 },
  { name: 'Електрик Лайм', value: '#aeea00', wavelength: 545 },
  { name: 'Трояндовий Кварц', value: '#ff4081', wavelength: 620 },
  { name: 'Місячне Срібло', value: '#e2e8f0', wavelength: 560 },
];

export const EdenPenCanvas: React.FC<EdenPenCanvasProps> = ({ isActive, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorInputRef = useRef<HTMLInputElement | null>(null);
  
  const isDrawingRef = useRef<boolean>(false);
  const strokesRef = useRef<LightStroke[]>([]);
  const currentStrokeRef = useRef<LightStroke | null>(null);
  const photonsRef = useRef<PhotonBeam[]>([]);
  const sparksRef = useRef<OpticalSpark[]>([]);
  const lastPointRef = useRef<StrokePoint | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef<boolean>(false);
  const frameCountRef = useRef<number>(0);

  // Tools & State
  const [currentTool, setCurrentTool] = useState<LightToolType>('pen');
  const [currentColor, setCurrentColor] = useState<string>('#ffd54f');
  const [symmetryMode, setSymmetryMode] = useState<SymmetryMode>('none');
  
  // Brush Parameters: Size & Opacity
  const [brushSize, setBrushSize] = useState<number>(6);
  const [lightOpacity, setLightOpacity] = useState<number>(0.85);
  const [isSlidersOpen, setIsSlidersOpen] = useState<boolean>(false);
  const [isColorDiagramOpen, setIsColorDiagramOpen] = useState<boolean>(false);

  // Color Spectrum Diagram State
  const [hue, setHue] = useState<number>(45);
  const [saturation, setSaturation] = useState<number>(100);
  const [lightness, setLightness] = useState<number>(65);

  // Gallery & Notifications
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [saveToastMsg, setSaveToastMsg] = useState<string | null>(null);
  const [strokeCount, setStrokeCount] = useState<number>(0);

  const handleExitYinYang = useCallback(() => {
    try {
      localStorage.setItem('quit-smoking:everything-hidden', 'false');
      window.dispatchEvent(new CustomEvent('eden-harmony-mode-change', { detail: false }));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    if (onExit) onExit();
  }, [onExit]);

  // Sync HSL to HEX
  const applyHslColor = (h: number, s: number, l: number) => {
    setHue(h);
    setSaturation(s);
    setLightness(l);
    
    const c = (1 - Math.abs(2 * (l / 100) - 1)) * (s / 100);
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l / 100 - c / 2;
    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
    
    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
    setCurrentColor(`#${rHex}${gHex}${bHex}`);
  };

  const hexToRgba = (hex: string, alpha: number): string => {
    let c = hex.replace('#', '');
    if (c.length === 3) {
      c = c.split('').map(x => x + x).join('');
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
  };

  const getCanvasCoords = (clientX: number, clientY: number): StrokePoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: clientX, y: clientY };
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Helper to spawn photons along a directional vector
  const spawnLaserPhotons = (x: number, y: number, angle: number, color: string, count = 2) => {
    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 0.12;
      const speed = 5.5 + Math.random() * 3.5;
      const finalAngle = angle + spread;
      photonsRef.current.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx: Math.cos(finalAngle) * speed,
        vy: Math.sin(finalAngle) * speed,
        color,
        wavelength: 580,
        life: 0,
        maxLife: 220 + Math.random() * 80,
        history: [{ x, y }],
        bounces: 0
      });
    }
  };

  // Redraw committed strokes onto persistent offscreen canvas
  const renderCommittedStrokesToOffscreen = useCallback(() => {
    const offscreen = offscreenCanvasRef.current;
    const mainCanvas = canvasRef.current;
    if (!offscreen || !mainCanvas) return;

    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = offscreen.width / dpr;
    const height = offscreen.height / dpr;

    ctx.clearRect(0, 0, offscreen.width, offscreen.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const renderStrokePath = (points: StrokePoint[], tool: LightToolType, color: string, width: number, opacity: number) => {
      if (points.length === 0) return;

      if (tool === 'eraser') {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = width * 2.2;
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        ctx.restore();
        return;
      }

      if (tool === 'spray') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (const pt of points) {
          if (pt.particles) {
            for (const p of pt.particles) {
              const px = pt.x + p.dx;
              const py = pt.y + p.dy;
              ctx.fillStyle = hexToRgba(color, p.alpha * opacity);
              ctx.beginPath();
              ctx.arc(px, py, p.r, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        ctx.restore();
        return;
      }

      // ==========================================
      // PHYSICAL OPTICAL RENDERING FOR TOOLS
      // ==========================================

      if (tool === 'mirror') {
        // Optical Metallic Silver-Cyan Reflective Mirror Line
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';

        // 1. Soft reflective silver aura
        ctx.strokeStyle = 'rgba(165, 243, 252, 0.35)';
        ctx.lineWidth = width * 2.6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();

        // 2. Solid metallic reflective core
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.95)';
        ctx.lineWidth = width * 1.2;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();

        // 3. Specular silver center sheen
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1.2, width * 0.4);
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();

        ctx.restore();
        return;
      }

      if (tool === 'prism') {
        // Multi-spectral Chromatic Crystal Prism Facet Line
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // 1. Violet & Spectral rainbow dispersion halo
        ctx.strokeStyle = 'rgba(224, 64, 251, 0.45)';
        ctx.lineWidth = width * 3.0;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();

        // 2. Cyan & Amber refracted inner glow
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.65)';
        ctx.lineWidth = width * 1.4;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();

        // 3. Crystal diamond spine
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1.5, width * 0.4);
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();

        ctx.restore();
        return;
      }

      if (tool === 'laser') {
        // Coherent Photon Laser Channel
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // Broad laser ionization channel
        ctx.strokeStyle = hexToRgba(color, opacity * 0.35);
        ctx.lineWidth = width * 2.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();

        // Coherent core beam
        ctx.strokeStyle = hexToRgba(color, opacity * 0.95);
        ctx.lineWidth = width * 1.1;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();

        // Incandescent central filament
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1, width * 0.35);
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();

        ctx.restore();
        return;
      }

      // Default Light Pen Calligraphy
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // 1. Broad soft ambient light halo
      ctx.strokeStyle = hexToRgba(color, opacity * 0.22);
      ctx.lineWidth = width * 2.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.stroke();

      // 2. Focused core beam
      ctx.strokeStyle = hexToRgba(color, opacity * 0.85);
      ctx.lineWidth = width * 1.1;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.stroke();

      // 3. Incandescent white photon filament
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.95})`;
      ctx.lineWidth = Math.max(1, width * 0.35);
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.stroke();

      ctx.restore();
    };

    const drawWithSymmetry = (stroke: LightStroke) => {
      const { points, tool, color, width: sw, opacity, symmetry } = stroke;
      if (points.length === 0) return;

      renderStrokePath(points, tool, color, sw, opacity);

      if (symmetry === 'dual' || symmetry === 'quad') {
        const dualPoints = points.map(pt => ({
          x: width - pt.x,
          y: height - pt.y,
          particles: pt.particles?.map(p => ({ ...p, dx: -p.dx, dy: -p.dy }))
        }));
        renderStrokePath(dualPoints, tool, color, sw, opacity);
      }

      if (symmetry === 'quad') {
        const quad1 = points.map(pt => ({
          x: width - pt.x,
          y: pt.y,
          particles: pt.particles?.map(p => ({ ...p, dx: -p.dx, dy: p.dy }))
        }));
        const quad2 = points.map(pt => ({
          x: pt.x,
          y: height - pt.y,
          particles: pt.particles?.map(p => ({ ...p, dx: p.dx, dy: -p.dy }))
        }));
        renderStrokePath(quad1, tool, color, sw, opacity);
        renderStrokePath(quad2, tool, color, sw, opacity);
      }
    };

    for (const stroke of strokesRef.current) {
      drawWithSymmetry(stroke);
    }

    ctx.restore();
  }, []);

  // Main high-frequency optical simulation & render loop
  useEffect(() => {
    if (!isActive) return;

    const mainCanvas = canvasRef.current;
    if (!mainCanvas) return;
    const ctx = mainCanvas.getContext('2d');
    if (!ctx) return;

    const offscreen = document.createElement('canvas');
    offscreenCanvasRef.current = offscreen;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mainCanvas.width = Math.round(w * dpr);
      mainCanvas.height = Math.round(h * dpr);
      offscreen.width = Math.round(w * dpr);
      offscreen.height = Math.round(h * dpr);
      renderCommittedStrokesToOffscreen();
    };

    resize();
    window.addEventListener('resize', resize);
    isLoopRunningRef.current = true;

    const loop = () => {
      if (!isLoopRunningRef.current) return;

      const w = mainCanvas.width / dpr;
      const h = mainCanvas.height / dpr;
      frameCountRef.current++;

      ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Draw persistent offscreen buffer (all committed strokes)
      if (offscreenCanvasRef.current) {
        ctx.drawImage(offscreenCanvasRef.current, 0, 0, w, h);
      }

      // 2. Draw active live stroke if dragging
      const active = currentStrokeRef.current;
      if (active && active.points.length > 0) {
        const renderLivePath = (pts: StrokePoint[], t: LightToolType, col: string, sw: number, op: number) => {
          if (pts.length === 0) return;
          if (t === 'eraser') {
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 100, 100, 0.4)';
            ctx.lineWidth = sw * 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
            ctx.stroke();
            ctx.restore();
            return;
          }

          if (t === 'spray') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (const pt of pts) {
              if (pt.particles) {
                for (const p of pt.particles) {
                  ctx.fillStyle = hexToRgba(col, p.alpha * op);
                  ctx.beginPath();
                  ctx.arc(pt.x + p.dx, pt.y + p.dy, p.r, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
            }
            ctx.restore();
            return;
          }

          if (t === 'mirror') {
            ctx.save();
            ctx.strokeStyle = 'rgba(224, 242, 254, 0.9)';
            ctx.lineWidth = sw * 1.2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
            ctx.stroke();
            ctx.restore();
            return;
          }

          if (t === 'prism') {
            ctx.save();
            ctx.strokeStyle = 'rgba(224, 64, 251, 0.7)';
            ctx.lineWidth = sw * 1.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
            ctx.stroke();
            ctx.restore();
            return;
          }

          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          // Halo
          ctx.strokeStyle = hexToRgba(col, op * 0.25);
          ctx.lineWidth = sw * 3.0;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.stroke();

          // Core
          ctx.strokeStyle = hexToRgba(col, op * 0.9);
          ctx.lineWidth = sw * 1.1;
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.stroke();

          // Filament
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = Math.max(1, sw * 0.35);
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.stroke();
          ctx.restore();
        };

        const drawLiveWithSymmetry = (st: LightStroke) => {
          const { points, tool, color, width: sw, opacity, symmetry } = st;
          renderLivePath(points, tool, color, sw, opacity);

          if (symmetry === 'dual' || symmetry === 'quad') {
            const dualPts = points.map(pt => ({
              x: w - pt.x,
              y: h - pt.y,
              particles: pt.particles?.map(p => ({ ...p, dx: -p.dx, dy: -p.dy }))
            }));
            renderLivePath(dualPts, tool, color, sw, opacity);
          }

          if (symmetry === 'quad') {
            const q1 = points.map(pt => ({
              x: w - pt.x,
              y: pt.y,
              particles: pt.particles?.map(p => ({ ...p, dx: -p.dx, dy: p.dy }))
            }));
            const q2 = points.map(pt => ({
              x: pt.x,
              y: h - pt.y,
              particles: pt.particles?.map(p => ({ ...p, dx: p.dx, dy: -p.dy }))
            }));
            renderLivePath(q1, tool, color, sw, opacity);
            renderLivePath(q2, tool, color, sw, opacity);
          }
        };

        drawLiveWithSymmetry(active);
      }

      // =========================================================================
      // 3. CONTINUOUS LASER PHOTON EMISSION & OPTICAL INTERACTIVE PHYSICS ENGINE
      // =========================================================================

      // A. Automatic continuous emitter from all committed Laser strokes on canvas
      if (frameCountRef.current % 14 === 0) {
        for (const stroke of strokesRef.current) {
          if (stroke.tool === 'laser' && stroke.points.length >= 2) {
            const pts = stroke.points;
            const p1 = pts[pts.length - 2];
            const p2 = pts[pts.length - 1];
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            spawnLaserPhotons(p2.x, p2.y, angle, stroke.color, 1);

            if (stroke.symmetry === 'dual' || stroke.symmetry === 'quad') {
              spawnLaserPhotons(w - p2.x, h - p2.y, angle + Math.PI, stroke.color, 1);
            }
          }
        }
      }

      // B. Collect all active line segments for fast physical 2D ray collision
      const segments: Segment2D[] = [];
      const allStrokes = [...strokesRef.current];
      if (active && active.points.length >= 2) {
        allStrokes.push(active);
      }

      const addStrokeSegments = (pts: StrokePoint[], t: LightToolType, sw: number, sId: string) => {
        for (let i = 0; i < pts.length - 1; i++) {
          segments.push({
            p1: pts[i],
            p2: pts[i + 1],
            tool: t,
            width: sw,
            strokeId: sId,
            segIdx: i
          });
        }
      };

      for (const st of allStrokes) {
        if (st.tool !== 'mirror' && st.tool !== 'prism') continue;
        const pts = st.points;
        if (pts.length < 2) continue;

        addStrokeSegments(pts, st.tool, st.width, st.id);

        if (st.symmetry === 'dual' || st.symmetry === 'quad') {
          const dualPts = pts.map(p => ({ x: w - p.x, y: h - p.y }));
          addStrokeSegments(dualPts, st.tool, st.width, `${st.id}_dual`);
        }

        if (st.symmetry === 'quad') {
          const q1 = pts.map(p => ({ x: w - p.x, y: p.y }));
          const q2 = pts.map(p => ({ x: p.x, y: h - p.y }));
          addStrokeSegments(q1, st.tool, st.width, `${st.id}_q1`);
          addStrokeSegments(q2, st.tool, st.width, `${st.id}_q2`);
        }
      }

      // C. Update Photons with Physics (Reflection off Mirrors & Refraction through Prisms)
      const photons = photonsRef.current;
      const newDaughterPhotons: PhotonBeam[] = [];

      for (let i = photons.length - 1; i >= 0; i--) {
        const p = photons[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > 12) p.history.shift();

        // Expire if out of bounds or life ended
        if (p.life >= p.maxLife || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
          photons.splice(i, 1);
          continue;
        }

        // Test collision against optical segments
        if (segments.length > 0) {
          for (const seg of segments) {
            const segKey = `${seg.strokeId}_${seg.segIdx}`;
            if (p.lastBounceId === segKey) continue; // Avoid self-intersection on consecutive frames

            const x1 = seg.p1.x, y1 = seg.p1.y;
            const x2 = seg.p2.x, y2 = seg.p2.y;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const segLenSq = dx * dx + dy * dy;
            if (segLenSq < 1) continue;

            // Project photon onto segment
            const t = Math.max(0, Math.min(1, ((p.x - x1) * dx + (p.y - y1) * dy) / segLenSq));
            const qx = x1 + t * dx;
            const qy = y1 + t * dy;

            const distSq = (p.x - qx) * (p.x - qx) + (p.y - qy) * (p.y - qy);
            const hitRadius = Math.max(8, seg.width + 4);

            if (distSq <= hitRadius * hitRadius) {
              p.lastBounceId = segKey;
              p.bounces = (p.bounces || 0) + 1;

              const segLen = Math.sqrt(segLenSq);
              const ux = dx / segLen;
              const uy = dy / segLen;
              // Normal vector perpendicular to segment
              let nx = -uy;
              let ny = ux;

              // Ensure normal points against incoming photon velocity
              if (p.vx * nx + p.vy * ny > 0) {
                nx = -nx;
                ny = -ny;
              }

              // -----------------------------------------------------------------
              // 1. MIRROR REFLECTION: Law of Reflection (θi = θr)
              // -----------------------------------------------------------------
              if (seg.tool === 'mirror') {
                const dot = p.vx * nx + p.vy * ny;
                p.vx = p.vx - 2 * dot * nx;
                p.vy = p.vy - 2 * dot * ny;
                
                // Push photon outward past mirror surface
                p.x = qx + nx * (hitRadius + 2);
                p.y = qy + ny * (hitRadius + 2);

                // Spawn reflection specular glint
                sparksRef.current.push({
                  x: qx,
                  y: qy,
                  color: '#a5f3fc',
                  radius: 2,
                  maxRadius: 10 + Math.random() * 6,
                  alpha: 0.95
                });
                break;
              }

              // -----------------------------------------------------------------
              // 2. PRISM REFRACTION & CHROMATIC DISPERSION (Snell's Law & Rainbow Split)
              // -----------------------------------------------------------------
              if (seg.tool === 'prism') {
                // Refraction bend
                const currentSpeed = Math.hypot(p.vx, p.vy);
                const currentAngle = Math.atan2(p.vy, p.vx);
                const refractOffset = 0.55; // ~31 degrees bending
                const bentAngle = currentAngle + refractOffset;

                p.vx = Math.cos(bentAngle) * currentSpeed;
                p.vy = Math.sin(bentAngle) * currentSpeed;
                p.x = qx + p.vx * 1.5;
                p.y = qy + p.vy * 1.5;

                // Split into 6 rainbow spectral wavelengths if not already split
                if (!p.isSplit && newDaughterPhotons.length < 24) {
                  p.isSplit = true;
                  const rainbowColors = [
                    '#ff1744', // Red 650nm
                    '#ff9100', // Orange 605nm
                    '#ffd54f', // Yellow 580nm
                    '#00e676', // Emerald 532nm
                    '#00e5ff', // Cyan 485nm
                    '#e040fb'  // Violet 415nm
                  ];

                  for (let ri = 0; ri < rainbowColors.length; ri++) {
                    const fanAngle = bentAngle + ((ri - 2.5) * 0.16);
                    newDaughterPhotons.push({
                      x: qx,
                      y: qy,
                      vx: Math.cos(fanAngle) * (currentSpeed * (0.85 + ri * 0.05)),
                      vy: Math.sin(fanAngle) * (currentSpeed * (0.85 + ri * 0.05)),
                      color: rainbowColors[ri],
                      wavelength: 400 + ri * 45,
                      life: 0,
                      maxLife: 180 + Math.random() * 60,
                      history: [{ x: qx, y: qy }],
                      isSplit: true,
                      bounces: p.bounces
                    });
                  }
                }

                // Spawn prism rainbow sparkle
                sparksRef.current.push({
                  x: qx,
                  y: qy,
                  color: '#e040fb',
                  radius: 3,
                  maxRadius: 14 + Math.random() * 8,
                  alpha: 1.0,
                  isPrism: true
                });
                break;
              }
            }
          }
        }
      }

      // Add daughter split photons
      if (newDaughterPhotons.length > 0) {
        photonsRef.current.push(...newDaughterPhotons);
      }

      // D. Render Quantum Laser & Light Photons
      if (photons.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < photons.length; i++) {
          const p = photons[i];
          const lifeRatio = 1 - p.life / p.maxLife;

          // Photon glowing trajectory tail
          if (p.history.length > 1) {
            ctx.strokeStyle = hexToRgba(p.color, lifeRatio * 0.75);
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(p.history[0].x, p.history[0].y);
            for (let hi = 1; hi < p.history.length; hi++) {
              ctx.lineTo(p.history[hi].x, p.history[hi].y);
            }
            ctx.stroke();
          }

          // Quantum photon incandescent head
          ctx.fillStyle = hexToRgba(p.color, lifeRatio * 0.4);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // E. Render Optical Sparks & Glints (Mirror reflections & Prism dispersion flares)
      const sparks = sparksRef.current;
      if (sparks.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = sparks.length - 1; i >= 0; i--) {
          const sp = sparks[i];
          sp.radius += 0.8;
          sp.alpha -= 0.05;

          if (sp.alpha <= 0.01 || sp.radius >= sp.maxRadius) {
            sparks.splice(i, 1);
            continue;
          }

          ctx.strokeStyle = sp.color;
          ctx.globalAlpha = Math.max(0, sp.alpha);
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Specular 4-point cross glint
          const glintLen = sp.radius * 1.8;
          ctx.beginPath();
          ctx.moveTo(sp.x - glintLen, sp.y);
          ctx.lineTo(sp.x + glintLen, sp.y);
          ctx.moveTo(sp.x, sp.y - glintLen);
          ctx.lineTo(sp.x, sp.y + glintLen);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
        ctx.restore();
      }

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isLoopRunningRef.current = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isActive, renderCommittedStrokesToOffscreen]);

  // Touch & Mouse Drawing Handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    isDrawingRef.current = true;
    const pt = getCanvasCoords(clientX, clientY);
    lastPointRef.current = pt;

    if (currentTool === 'spray') {
      const particles: SprayParticle[] = [];
      const count = Math.round(brushSize * 1.8);
      for (let i = 0; i < count; i++) {
        const rad = Math.random() * brushSize * 2.0;
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          dx: Math.cos(angle) * rad,
          dy: Math.sin(angle) * rad,
          r: 0.8 + Math.random() * 1.8,
          alpha: 0.4 + Math.random() * 0.6
        });
      }
      pt.particles = particles;
    }

    currentStrokeRef.current = {
      id: `stroke_${Date.now()}`,
      tool: currentTool,
      points: [pt],
      color: currentColor,
      width: brushSize,
      opacity: lightOpacity,
      symmetry: symmetryMode
    };

    // When tapping or starting with Laser: fire burst of photons
    if (currentTool === 'laser') {
      const angle = Math.random() * Math.PI * 2;
      spawnLaserPhotons(pt.x, pt.y, angle, currentColor, 4);
    }
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    const pt = getCanvasCoords(clientX, clientY);

    if (currentTool === 'spray') {
      const particles: SprayParticle[] = [];
      const count = Math.round(brushSize * 1.8);
      for (let i = 0; i < count; i++) {
        const rad = Math.random() * brushSize * 2.0;
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          dx: Math.cos(angle) * rad,
          dy: Math.sin(angle) * rad,
          r: 0.8 + Math.random() * 1.8,
          alpha: 0.4 + Math.random() * 0.6
        });
      }
      pt.particles = particles;
    }

    currentStrokeRef.current.points.push(pt);

    // Continuous photon stream along laser drag vector
    if (currentTool === 'laser' && lastPointRef.current) {
      const dx = pt.x - lastPointRef.current.x;
      const dy = pt.y - lastPointRef.current.y;
      const len = Math.hypot(dx, dy);
      if (len > 3) {
        const angle = Math.atan2(dy, dx);
        spawnLaserPhotons(pt.x, pt.y, angle, currentColor, 2);
      }
    }

    lastPointRef.current = pt;
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    const finished = currentStrokeRef.current;
    if (finished && finished.points.length > 0) {
      strokesRef.current.push(finished);
      setStrokeCount(strokesRef.current.length);
      renderCommittedStrokesToOffscreen();
    }
    currentStrokeRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => handlePointerDown(e.clientX, e.clientY);
  const handleMouseMove = (e: React.MouseEvent) => handlePointerMove(e.clientX, e.clientY);
  const handleMouseUp = () => handlePointerUp();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const handleTouchEnd = () => handlePointerUp();

  const handleUndo = () => {
    if (strokesRef.current.length === 0) return;
    strokesRef.current.pop();
    setStrokeCount(strokesRef.current.length);
    renderCommittedStrokesToOffscreen();
  };

  const handleClear = () => {
    if (strokesRef.current.length === 0) return;
    strokesRef.current = [];
    photonsRef.current = [];
    sparksRef.current = [];
    setStrokeCount(0);
    renderCommittedStrokesToOffscreen();
  };

  const handleSaveArtwork = () => {
    const offscreen = offscreenCanvasRef.current;
    const mainCanvas = canvasRef.current;
    if (!offscreen || !mainCanvas || strokesRef.current.length === 0) {
      setSaveToastMsg('Спочатку намалюйте штрихи світлом');
      setTimeout(() => setSaveToastMsg(null), 2500);
      return;
    }

    try {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = mainCanvas.width;
      exportCanvas.height = mainCanvas.height;
      const expCtx = exportCanvas.getContext('2d');
      if (!expCtx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = exportCanvas.width / dpr;
      const h = exportCanvas.height / dpr;

      // 1. Deep Celestial Black Background
      expCtx.fillStyle = '#050508';
      expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      expCtx.save();
      expCtx.scale(dpr, dpr);

      // 2. Draw all committed strokes from offscreen buffer (including mirror and prism lines)
      expCtx.drawImage(offscreen, 0, 0, w, h);

      // 3. Bake all active Quantum Laser Photons and Trajectories
      const photons = photonsRef.current;
      if (photons.length > 0) {
        expCtx.save();
        expCtx.globalCompositeOperation = 'lighter';
        for (const p of photons) {
          const lifeRatio = Math.max(0.2, 1 - p.life / p.maxLife);

          // Trajectory tail
          if (p.history.length > 1) {
            expCtx.strokeStyle = hexToRgba(p.color, lifeRatio * 0.85);
            expCtx.lineWidth = 2.8;
            expCtx.beginPath();
            expCtx.moveTo(p.history[0].x, p.history[0].y);
            for (let hi = 1; hi < p.history.length; hi++) {
              expCtx.lineTo(p.history[hi].x, p.history[hi].y);
            }
            expCtx.stroke();
          }

          // Quantum photon glowing head
          expCtx.fillStyle = hexToRgba(p.color, lifeRatio * 0.6);
          expCtx.beginPath();
          expCtx.arc(p.x, p.y, 5.0, 0, Math.PI * 2);
          expCtx.fill();

          expCtx.fillStyle = '#ffffff';
          expCtx.beginPath();
          expCtx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
          expCtx.fill();
        }
        expCtx.restore();
      }

      // 4. Bake all Optical Mirror Reflection Sparks & Prism Rainbow Dispersion Flares
      const sparks = sparksRef.current;
      if (sparks.length > 0) {
        expCtx.save();
        expCtx.globalCompositeOperation = 'lighter';
        for (const sp of sparks) {
          expCtx.strokeStyle = sp.color;
          expCtx.globalAlpha = Math.max(0.2, sp.alpha);
          expCtx.lineWidth = 2.0;
          expCtx.beginPath();
          expCtx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
          expCtx.stroke();

          // 4-point specular diamond cross glint
          const glintLen = sp.radius * 2.2;
          expCtx.beginPath();
          expCtx.moveTo(sp.x - glintLen, sp.y);
          expCtx.lineTo(sp.x + glintLen, sp.y);
          expCtx.moveTo(sp.x, sp.y - glintLen);
          expCtx.lineTo(sp.x, sp.y + glintLen);
          expCtx.stroke();
        }
        expCtx.restore();
      }

      expCtx.restore();

      const dataUrl = exportCanvas.toDataURL('image/png');
      const now = new Date();
      const dateStr = now.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
      const toolLabel = TOOLS_METADATA[currentTool].name;

      saveArtworkToStorage({
        title: `Гармонія Інь-Ян #${strokesRef.current.length + 1}`,
        dateStr,
        dataUrl,
        strokeCount: strokesRef.current.length,
        spectrumType: toolLabel,
        description: `Створено світлом із квантовими фотонами лазера, відбиттями дзеркал та хроматичною дисперсією призм (${brushSize}px).`
      });

      setSaveToastMsg('Картину з усіма ефектами збережено до Галереї ✨');
      setTimeout(() => setSaveToastMsg(null), 2800);
    } catch (e) {
      setSaveToastMsg('Помилка збереження картини');
      setTimeout(() => setSaveToastMsg(null), 2500);
    }
  };

  if (!isActive) return null;

  return (
    <>
      {/* Toast Notification */}
      {saveToastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[1050] px-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs font-semibold shadow-2xl animate-bounce flex items-center gap-2">
          <span>{saveToastMsg}</span>
        </div>
      )}

      {/* TOP HEADER OVERLAY */}
      <div 
        className="fixed top-3 sm:top-4 inset-x-2 sm:inset-x-6 z-[95] flex items-center justify-between gap-1.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl bg-zinc-900/95 backdrop-blur-2xl border-2 border-zinc-700/80 shadow-[0_12px_35px_rgba(0,0,0,0.85)] text-zinc-200 select-none pointer-events-auto max-w-4xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 shadow-inner">
            <Sun className="w-4 h-4 text-amber-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-zinc-100 truncate">
                Режим Інь-Ян
              </span>
              <span className="text-[10px] font-mono text-amber-400/90 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.2 rounded hidden sm:inline-block">
                Світлове полотно
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 truncate font-mono">
              <span>Штрихи: {strokeCount}</span>
              <span aria-hidden="true">·</span>
              <span>{brushSize}px</span>
              <span aria-hidden="true">·</span>
              <span>{Math.round(lightOpacity * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Symmetry Selector with Geometric Position Dots */}
        <div className="flex items-center gap-1 p-1 rounded-xl sm:rounded-2xl bg-zinc-950/80 border border-zinc-800 shrink-0">
          <button
            type="button"
            onClick={() => setSymmetryMode('none')}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg sm:rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              symmetryMode === 'none'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-600 shadow-md ring-1 ring-white/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Пряме малювання (1 центральна крапка)"
          >
            <Symmetry1xIcon className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-xs font-bold">1x</span>
          </button>
          <button
            type="button"
            onClick={() => setSymmetryMode('dual')}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg sm:rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              symmetryMode === 'dual'
                ? 'bg-zinc-800 text-amber-300 border border-zinc-600 shadow-md ring-1 ring-amber-400/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Дуальна симетрія Інь-Ян (2 симетричні крапки 180°)"
          >
            <Symmetry2xIcon className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs font-bold">2x</span>
          </button>
          <button
            type="button"
            onClick={() => setSymmetryMode('quad')}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg sm:rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              symmetryMode === 'quad'
                ? 'bg-zinc-800 text-cyan-300 border border-zinc-600 shadow-md ring-1 ring-cyan-400/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="4-кратна симетрія Мандали (4 крапки у 4 напрямках)"
          >
            <Symmetry4xIcon className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-xs font-bold">4x</span>
          </button>
        </div>

        {/* Exit Button */}
        <button
          type="button"
          onClick={handleExitYinYang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl sm:rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-white transition-all active:scale-95 cursor-pointer shrink-0 shadow-md"
          title="Вийти з режиму Інь-Ян"
        >
          <X className="w-4 h-4" />
          <span className="text-xs font-semibold hidden sm:inline">Вийти</span>
        </button>
      </div>

      {/* FLOATING BRUSH PARAMETERS POPOVER (Size & Opacity) */}
      {isSlidersOpen && (
        <div 
          className="fixed bottom-34 sm:bottom-38 left-1/2 -translate-x-1/2 z-[98] w-80 max-w-[92vw] p-4 rounded-3xl bg-zinc-900/95 backdrop-blur-2xl border-2 border-zinc-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-zinc-100 select-none animate-fadeIn pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-zinc-800">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-amber-300" />
              Параметри світлового променя
            </span>
            <button 
              type="button" 
              onClick={() => setIsSlidersOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Brush Size Slider */}
          <div className="space-y-1.5 mb-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Товщина променя</span>
              <span className="font-mono text-amber-300 font-bold">{brushSize} px</span>
            </div>
            <input
              type="range"
              min="1"
              max="36"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { label: 'Тонкий', val: 2 },
                { label: 'Норма', val: 6 },
                { label: 'Широкий', val: 14 },
                { label: 'Аура', val: 26 },
              ].map(p => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setBrushSize(p.val)}
                  className={`py-1 text-[11px] font-medium rounded-lg border transition-colors cursor-pointer ${
                    brushSize === p.val 
                      ? 'bg-zinc-800 text-amber-300 border-zinc-600 font-bold' 
                      : 'bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Light Opacity Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Яскравість / Прозорість</span>
              <span className="font-mono text-cyan-300 font-bold">{Math.round(lightOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.15"
              max="1.0"
              step="0.05"
              value={lightOpacity}
              onChange={(e) => setLightOpacity(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { label: 'Ефір', val: 0.25 },
                { label: 'Мʼяке', val: 0.50 },
                { label: 'Сяйво', val: 0.85 },
                { label: 'Макс', val: 1.0 },
              ].map(p => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setLightOpacity(p.val)}
                  className={`py-1 text-[11px] font-medium rounded-lg border transition-colors cursor-pointer ${
                    Math.abs(lightOpacity - p.val) < 0.05 
                      ? 'bg-zinc-800 text-cyan-300 border-zinc-600 font-bold' 
                      : 'bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FULL COLOR SPECTRUM DIAGRAM MODAL / POPOVER */}
      {isColorDiagramOpen && (
        <div 
          className="fixed bottom-34 sm:bottom-38 left-1/2 -translate-x-1/2 z-[98] w-84 max-w-[92vw] p-4 rounded-3xl bg-zinc-900/98 backdrop-blur-2xl border-2 border-zinc-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-zinc-100 select-none animate-fadeIn pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-zinc-800">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-300" />
              Діаграма кольорів спектра
            </span>
            <button 
              type="button" 
              onClick={() => setIsColorDiagramOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color Preview & Native Picker Trigger */}
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 mb-3.5">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-9 h-9 rounded-xl border-2 border-white/80 shadow-lg shrink-0 transition-transform active:scale-95"
                style={{ backgroundColor: currentColor }}
              />
              <div>
                <div className="text-xs font-bold font-mono uppercase text-white">{currentColor}</div>
                <div className="text-[10px] text-zinc-400">Повний спектр світла</div>
              </div>
            </div>

            {/* Native Color Picker Trigger */}
            <button
              type="button"
              onClick={() => colorInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-medium text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95"
              title="Відкрити піпетку / системну палітру"
            >
              <Pipette className="w-3.5 h-3.5" />
              <span>Піпетка</span>
            </button>
            <input 
              ref={colorInputRef}
              type="color" 
              value={currentColor} 
              onChange={(e) => setCurrentColor(e.target.value)}
              className="sr-only"
            />
          </div>

          {/* 1. 360° Chromatic Hue Spectrum Diagram Slider */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Відтінок спектра (Hue)</span>
              <span className="font-mono text-amber-300 font-bold">{hue}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={hue}
              onChange={(e) => applyHslColor(Number(e.target.value), saturation, lightness)}
              style={{
                background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
              }}
              className="w-full h-3.5 rounded-lg appearance-none cursor-pointer accent-white border border-white/20 shadow-inner"
            />
          </div>

          {/* 2. Lightness / Luminescence Slider */}
          <div className="space-y-1.5 mb-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Світлосила / Яскравість</span>
              <span className="font-mono text-cyan-300 font-bold">{lightness}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="95"
              value={lightness}
              onChange={(e) => applyHslColor(hue, saturation, Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, #000000 0%, hsl(${hue}, ${saturation}%, 50%) 50%, #ffffff 100%)`
              }}
              className="w-full h-3.5 rounded-lg appearance-none cursor-pointer accent-white border border-white/20 shadow-inner"
            />
          </div>

          {/* 3. Curated Physical Spectral Wavelengths Palette */}
          <div>
            <div className="text-[11px] font-medium text-zinc-400 mb-1.5">Фізичні спектральні промені</div>
            <div className="grid grid-cols-6 gap-1.5">
              {SPECTRAL_LIGHTS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCurrentColor(c.value)}
                  style={{ backgroundColor: c.value }}
                  className={`h-7 rounded-lg transition-transform cursor-pointer shadow-md flex items-center justify-center ${
                    currentColor.toLowerCase() === c.value.toLowerCase() ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-950 scale-105' : 'hover:scale-105 opacity-85'
                  }`}
                  title={`${c.name} (${c.wavelength}nm)`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING OPTICAL TOOLBAR ON BOTTOM: THICK DUAL-TIER INTEGRATED DOCK (NO SCROLLING) */}
      <div 
        className="fixed bottom-3 sm:bottom-5 inset-x-2 sm:inset-x-4 max-w-xl mx-auto z-[95] flex flex-col gap-2 p-2.5 sm:p-3.5 rounded-3xl bg-zinc-900/95 backdrop-blur-2xl border-2 border-zinc-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-zinc-200 select-none pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TIER 1: ALL 6 TOOLS + BRUSH SLIDERS TOGGLE */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {/* 1. Light Pen */}
          <button
            type="button"
            onClick={() => setCurrentTool('pen')}
            className={`h-10 sm:h-12 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 active:scale-95 ${
              currentTool === 'pen'
                ? 'bg-zinc-800 text-amber-300 border border-zinc-600 shadow-md ring-1 ring-white/10 font-bold'
                : 'bg-zinc-950/70 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
            }`}
            title="Світло (мʼякий промінь)"
          >
            <PenTool className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-amber-300" />
            <span className="text-[10px] sm:text-xs">Світло</span>
          </button>

          {/* 2. Spray (Cluster of dots) */}
          <button
            type="button"
            onClick={() => setCurrentTool('spray')}
            className={`h-10 sm:h-12 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 active:scale-95 ${
              currentTool === 'spray'
                ? 'bg-zinc-800 text-yellow-300 border border-zinc-600 shadow-md ring-1 ring-white/10 font-bold'
                : 'bg-zinc-950/70 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
            }`}
            title="Спрей (скупчення крапок)"
          >
            <SprayDotsIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-yellow-400" />
            <span className="text-[10px] sm:text-xs">Спрей</span>
          </button>

          {/* 3. Laser (Dots in a line) */}
          <button
            type="button"
            onClick={() => setCurrentTool('laser')}
            className={`h-10 sm:h-12 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 active:scale-95 ${
              currentTool === 'laser'
                ? 'bg-zinc-800 text-amber-400 border border-zinc-600 shadow-md ring-1 ring-white/10 font-bold'
                : 'bg-zinc-950/70 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
            }`}
            title="Лазер (вистрілює квантові фотони)"
          >
            <LaserDottedLineIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-amber-400" />
            <span className="text-[10px] sm:text-xs">Лазер</span>
          </button>

          {/* 4. Vintage Mirror */}
          <button
            type="button"
            onClick={() => setCurrentTool('mirror')}
            className={`h-10 sm:h-12 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 active:scale-95 ${
              currentTool === 'mirror'
                ? 'bg-zinc-800 text-cyan-300 border border-zinc-600 shadow-md ring-1 ring-white/10 font-bold'
                : 'bg-zinc-950/70 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
            }`}
            title="Дзеркало (відбиває промені світла за законом відбиття)"
          >
            <VintageMirrorIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-cyan-400" />
            <span className="text-[10px] sm:text-xs">Дзеркало</span>
          </button>

          {/* 5. Crystal Prism */}
          <button
            type="button"
            onClick={() => setCurrentTool('prism')}
            className={`h-10 sm:h-12 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 active:scale-95 ${
              currentTool === 'prism'
                ? 'bg-zinc-800 text-purple-300 border border-zinc-600 shadow-md ring-1 ring-white/10 font-bold'
                : 'bg-zinc-950/70 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
            }`}
            title="Призма (викривлює та розщеплює світло на спектр веселки)"
          >
            <CrystalGemIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-purple-400" />
            <span className="text-[10px] sm:text-xs">Призма</span>
          </button>

          {/* 6. Eraser */}
          <button
            type="button"
            onClick={() => setCurrentTool('eraser')}
            className={`h-10 sm:h-12 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 active:scale-95 ${
              currentTool === 'eraser'
                ? 'bg-rose-500/25 text-rose-300 border border-rose-500/60 shadow-md font-bold'
                : 'bg-zinc-950/70 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
            }`}
            title="Гумка (поглинач світла)"
          >
            <Eraser className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-rose-400" />
            <span className="text-[10px] sm:text-xs">Гумка</span>
          </button>

          {/* 7. Brush Parameters Toggle (Sliders) */}
          <button
            type="button"
            onClick={() => {
              setIsSlidersOpen(!isSlidersOpen);
              if (isColorDiagramOpen) setIsColorDiagramOpen(false);
            }}
            className={`h-10 sm:h-12 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 active:scale-95 ${
              isSlidersOpen
                ? 'bg-zinc-800 text-amber-300 border border-zinc-600 shadow-md font-bold'
                : 'bg-zinc-950/70 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
            }`}
            title="Налаштування товщини та прозорості"
          >
            <Sliders className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-amber-300" />
            <span className="text-[10px] sm:text-xs font-mono">{brushSize}px</span>
          </button>
        </div>

        {/* TIER 2: COLOR SPECTRUM DIAGRAM + QUICK SWATCHES + CANVAS ACTIONS */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Left: Color Spectrum Diagram Button */}
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={() => {
                setIsColorDiagramOpen(!isColorDiagramOpen);
                if (isSlidersOpen) setIsSlidersOpen(false);
              }}
              className={`h-9 sm:h-10 px-2 sm:px-3 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0 shadow-sm ${
                isColorDiagramOpen
                  ? 'bg-zinc-800 text-amber-300 border-zinc-600 shadow-md font-bold'
                  : 'bg-zinc-950/80 text-zinc-300 border-zinc-800 hover:text-white hover:bg-zinc-900'
              }`}
              title="Відкрити діаграму вибору будь-якого кольору"
            >
              <div 
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full border border-white/80 shadow-md shrink-0" 
                style={{ backgroundColor: currentColor }} 
              />
              <span className="text-xs font-semibold">Колір</span>
              <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${isColorDiagramOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* 4 Quick Popular Spectral Dots */}
            <div className="hidden xs:flex items-center gap-1 p-1 bg-zinc-950/80 rounded-xl border border-zinc-800 shrink-0">
              {['#ffffff', '#ffd54f', '#00e5ff', '#ff1744'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrentColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-5 h-5 rounded-full transition-transform cursor-pointer shadow-sm ${
                    currentColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-950 scale-110' : 'hover:scale-110 opacity-80'
                  }`}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Right: Actions (Undo, Clear, Save, Gallery) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Undo */}
            <button
              type="button"
              onClick={handleUndo}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm shrink-0"
              title="Скасувати останній штрих"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Clear */}
            <button
              type="button"
              onClick={handleClear}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm shrink-0"
              title="Очистити полотно"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Save */}
            <button
              type="button"
              onClick={handleSaveArtwork}
              className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md shrink-0"
              title="Зберегти картину до Галереї"
            >
              <Save className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Зберегти</span>
            </button>

            {/* Gallery */}
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md shrink-0"
              title="Відкрити Галерею робіт"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Галерея</span>
            </button>
          </div>
        </div>
      </div>

      {/* ULTRA HIGH-PERFORMANCE LIGHT DRAWING CANVAS */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="fixed inset-0 w-full h-full z-[80] pointer-events-auto cursor-crosshair touch-none select-none"
      />

      {/* GALLERY MODAL */}
      <YinYangGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </>
  );
};

export default EdenPenCanvas;
