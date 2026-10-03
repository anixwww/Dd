import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { ArrowLeft } from 'lucide-react';
import { TabType, MoneySettings } from '../types';

export interface UnicornChessTabProps {
  onSwitchTab?: (tab: TabType) => void;
  diffMs?: number;
  startDate?: number;
  money?: MoneySettings;
  totalSaved?: number;
  cigsAvoided?: number;
  totalSeconds?: number;
  activeGoalName?: string;
  activeGoalPct?: number;
  isGameOptimizationActive?: boolean;
  onToggleGameOptimization?: (val: boolean) => void;
}

// ========================================================
// 1. DELICATE CELESTIAL GLASS & SILVER CHIMES SYNTHESIZER
// Ultra-pure, thin, gentle, non-harsh bells synchronized with hoof strikes
// ========================================================
class DelicateBellChimesAudio {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private masterGain: GainNode | null = null;
  private isStarted: boolean = false;
  private lastChimeTime = 0;

  // Delicate Silver Celesta Lydian Pentatonic Scale (soft, gentle frequencies)
  private gentleChimes = [
    { freq: 1174.66, pan: -0.28, gain: 0.80 }, // D6 (Soft Left Front)
    { freq: 1318.51, pan: 0.25,  gain: 0.85 }, // E6 (Soft Right Hind)
    { freq: 1479.98, pan: 0.30,  gain: 0.88 }, // F#6 (Soft Right Front)
    { freq: 1760.00, pan: -0.25, gain: 0.82 }, // A6 (Soft Left Hind)
    { freq: 1975.53, pan: -0.28, gain: 0.86 }, // B6
    { freq: 2217.46, pan: 0.28,  gain: 0.90 }, // C#7 (Delicate sparkle)
    { freq: 2349.32, pan: -0.25, gain: 0.85 }, // D7
    { freq: 1760.00, pan: 0.25,  gain: 0.80 }  // A6
  ];

  constructor() {
    try {
      const saved = localStorage.getItem('quit-smoking:unicorn-audio');
      if (saved !== null) {
        this.isEnabled = saved === 'true';
      }
    } catch {}
  }

  get enabled() {
    return this.isEnabled;
  }

  setEnabled(val: boolean) {
    this.isEnabled = val;
    try {
      localStorage.setItem('quit-smoking:unicorn-audio', String(val));
    } catch {}
    if (!val && this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    } else if (val && this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(0.055, this.ctx.currentTime);
    }
  }

  public init() {
    if (this.ctx && this.isStarted) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      const now = this.ctx.currentTime;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isEnabled ? 0.055 : 0.0001, now);
      this.masterGain.connect(this.ctx.destination);

      this.isStarted = true;
    } catch {}
  }

  /**
   * Play a delicate, thin, gentle chime exactly when a hoof touches the board
   */
  public playHoofChime(stepNumber: number, hoofIndex: number, volumeMultiplier = 1.0) {
    if (!this.isEnabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      // Minimum interval to avoid flutter
      if (now - this.lastChimeTime < 0.11) return;
      this.lastChimeTime = now;

      const idx = Math.abs(stepNumber) % this.gentleChimes.length;
      const chime = this.gentleChimes[idx];
      const fundamental = chime.freq;

      const isLeft = hoofIndex === 0 || hoofIndex === 3;
      const panVal = isLeft ? -0.28 : 0.28;

      const panNode = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      if (panNode) {
        panNode.pan.setValueAtTime(panVal, now);
      }

      // Smooth warm air lowpass filter (removes any harsh/sharp transients)
      const airFilter = this.ctx.createBiquadFilter();
      airFilter.type = 'lowpass';
      airFilter.frequency.setValueAtTime(3200, now);

      // Delicate partials for ultra-soft glass chime
      const partials = [
        { mult: 1.0,  gain: 0.65, decay: 1.8 },
        { mult: 2.01, gain: 0.18, decay: 1.2 },
        { mult: 3.02, gain: 0.06, decay: 0.7 }
      ];

      partials.forEach(p => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const pGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * p.mult, now);

        // Soft 10ms smooth ramp up to completely eliminate clicking
        const peakGain = 0.024 * p.gain * chime.gain * volumeMultiplier;
        pGain.gain.setValueAtTime(0.00001, now);
        pGain.gain.linearRampToValueAtTime(peakGain, now + 0.012);
        pGain.gain.exponentialRampToValueAtTime(0.00001, now + p.decay);

        osc.connect(pGain);
        pGain.connect(airFilter);

        osc.start(now);
        osc.stop(now + p.decay + 0.05);
      });

      if (panNode) {
        airFilter.connect(panNode);
        panNode.connect(this.masterGain || this.ctx.destination);
      } else {
        airFilter.connect(this.masterGain || this.ctx.destination);
      }
    } catch {}
  }

  /**
   * Magical plush heart pickup sparkle chime
   */
  public playHeartPickupSound() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      const notes = [1318.51, 1567.98, 1975.53, 2637.02]; // E6, G6, B6, E7
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        const startTime = now + i * 0.06;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.035, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.00001, startTime + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain || this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.25);
      });
    } catch {}
  }
}

const bellAudio = new DelicateBellChimesAudio();

// ========================================================
// 2. PROCEDURAL TEXTURES
// ========================================================

// 2a. Cached Procedural Plush Yarn & Wool Texture for the Stuffed Heart
let cachedPlushTexture: THREE.CanvasTexture | null = null;

function getPlushWoolTexture(): THREE.CanvasTexture {
  if (cachedPlushTexture) return cachedPlushTexture;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Warm crimson woolly base
  ctx.fillStyle = '#E11D48';
  ctx.fillRect(0, 0, size, size);

  // Knitted yarn fibers & fuzzy wool threads
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = 3 + Math.random() * 8;
    const angle = Math.random() * Math.PI * 2;

    ctx.strokeStyle = Math.random() > 0.4 ? 'rgba(254, 205, 211, 0.45)' : 'rgba(159, 18, 57, 0.5)';
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }

  // Soft fuzzy lint specks
  for (let j = 0; j < 300; j++) {
    const fx = Math.random() * size;
    const fy = Math.random() * size;
    const fr = 0.5 + Math.random() * 1.5;
    ctx.fillStyle = 'rgba(255, 241, 242, 0.5)';
    ctx.beginPath();
    ctx.arc(fx, fy, fr, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  cachedPlushTexture = tex;
  return tex;
}

// 2b. Procedural Unified Milky Aura Texture (4 squares front, 2 squares sides, 1 square back)
let cachedMilkyAuraTexture: THREE.CanvasTexture | null = null;

function getUnicornMilkyAuraTexture(): THREE.CanvasTexture {
  if (cachedMilkyAuraTexture) return cachedMilkyAuraTexture;
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);

  // Unicorn center is at X: 256, Y: 370 (leaving 370px ahead for 4 squares, 142px behind for 1 square, 210px sides for 2 squares)
  const ux = 256;
  const uy = 370;

  // 1. Primary forward-projected milky envelope (4 squares ahead, 2 sides, 1 back)
  const forwardGrad = ctx.createRadialGradient(ux, uy - 120, 10, ux, uy - 90, 260);
  forwardGrad.addColorStop(0, 'rgba(244, 248, 255, 0.72)');
  forwardGrad.addColorStop(0.28, 'rgba(228, 238, 252, 0.55)');
  forwardGrad.addColorStop(0.55, 'rgba(195, 212, 235, 0.28)');
  forwardGrad.addColorStop(0.82, 'rgba(150, 170, 198, 0.08)');
  forwardGrad.addColorStop(1, 'rgba(14, 16, 20, 0.0)');

  ctx.save();
  ctx.translate(ux, uy - 90);
  ctx.scale(0.85, 1.25); // Ellipse: wider front/back projection (4 squares ahead), proportional sides (2 squares)
  ctx.beginPath();
  ctx.arc(0, 0, 240, 0, Math.PI * 2);
  ctx.fillStyle = forwardGrad;
  ctx.fill();
  ctx.restore();

  // 2. Direct ground halo centered on the unicorn (1.5 squares radius)
  const coreGrad = ctx.createRadialGradient(ux, uy, 0, ux, uy, 120);
  coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
  coreGrad.addColorStop(0.4, 'rgba(240, 246, 255, 0.45)');
  coreGrad.addColorStop(0.8, 'rgba(205, 220, 242, 0.15)');
  coreGrad.addColorStop(1, 'rgba(17, 18, 21, 0.0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(ux, uy, 120, 0, Math.PI * 2);
  ctx.fill();

  // 3. Painterly handmade air puffs & soft cloud wisps within the envelope
  for (let p = 0; p < 24; p++) {
    const angle = Math.random() * Math.PI * 2;
    // Bias wisps toward forward vision cone (4 squares ahead)
    const isForward = Math.random() > 0.35;
    const px = ux + (Math.random() - 0.5) * 190;
    const py = isForward ? uy - Math.random() * 260 : uy + Math.random() * 70;
    const pr = 35 + Math.random() * 65;

    const puffGrad = ctx.createRadialGradient(px, py, 0, px, py, pr);
    puffGrad.addColorStop(0, 'rgba(248, 250, 255, 0.25)');
    puffGrad.addColorStop(0.5, 'rgba(220, 232, 248, 0.10)');
    puffGrad.addColorStop(1, 'rgba(180, 195, 215, 0.0)');

    ctx.fillStyle = puffGrad;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.generateMipmaps = true;
  cachedMilkyAuraTexture = tex;
  return tex;
}

// 2c. Procedural Painterly Chessboard Floor
let cachedFloorTexture: THREE.CanvasTexture | null = null;

function getPainterlyChessboardTexture(): THREE.CanvasTexture {
  if (cachedFloorTexture) return cachedFloorTexture;
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) {
    cachedFloorTexture = new THREE.CanvasTexture(canvas);
    return cachedFloorTexture;
  }

  const tiles = 8;
  const tileSize = size / tiles;

  for (let r = 0; r < tiles; r++) {
    for (let c = 0; c < tiles; c++) {
      const isWhite = (r + c) % 2 === 0;
      const x = c * tileSize;
      const y = r * tileSize;

      if (isWhite) {
        ctx.fillStyle = '#E3E0D8';
        ctx.fillRect(x, y, tileSize, tileSize);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 4; i++) {
          ctx.fillRect(x + Math.random() * (tileSize - 15), y + Math.random() * tileSize, Math.random() * 20 + 8, 2);
        }
        ctx.fillStyle = 'rgba(205, 201, 192, 0.3)';
        ctx.beginPath();
        ctx.arc(x + tileSize * 0.5, y + tileSize * 0.5, tileSize * 0.35, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#22232A';
        ctx.fillRect(x, y, tileSize, tileSize);
        ctx.fillStyle = 'rgba(40, 42, 52, 0.6)';
        for (let i = 0; i < 4; i++) {
          ctx.fillRect(x + Math.random() * (tileSize - 15), y + Math.random() * tileSize, Math.random() * 20 + 8, 2);
        }
      }
      ctx.strokeStyle = isWhite ? 'rgba(200, 195, 185, 0.3)' : 'rgba(20, 20, 25, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 16);
  cachedFloorTexture = tex;
  return tex;
}

// ========================================================
// 3. 3D PROCEDURAL PLUSH HEART MODEL ("Плюшеве серце з ниток і ворсинок")
// ========================================================
function buildPlushHeart(): THREE.Group {
  const heartGroup = new THREE.Group();
  const plushTex = getPlushWoolTexture();

  const plushMaterial = new THREE.MeshStandardMaterial({
    map: plushTex,
    color: 0xFB7185,
    roughness: 0.92,
    metalness: 0.05,
    bumpMap: plushTex,
    bumpScale: 0.04
  });

  const stitchMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFE4E6
  });

  // Sculpted Heart Geometry via Extruded Heart Shape
  const shape = new THREE.Shape();
  const x = 0, y = 0;
  shape.moveTo(x, y + 0.22);
  shape.bezierCurveTo(x, y + 0.22, x - 0.22, y + 0.55, x - 0.44, y + 0.55);
  shape.bezierCurveTo(x - 0.7, y + 0.55, x - 0.7, y + 0.22, x - 0.7, y + 0.22);
  shape.bezierCurveTo(x - 0.7, y - 0.1, x - 0.4, y - 0.38, x, y - 0.65);
  shape.bezierCurveTo(x + 0.4, y - 0.38, x + 0.7, y - 0.1, x + 0.7, y + 0.22);
  shape.bezierCurveTo(x + 0.7, y + 0.22, x + 0.7, y + 0.55, x + 0.44, y + 0.55);
  shape.bezierCurveTo(x + 0.22, y + 0.55, x, y + 0.22, x, y + 0.22);

  const extrudeSettings = {
    steps: 2,
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.14,
    bevelSize: 0.12,
    bevelOffset: 0,
    bevelSegments: 8
  };

  const heartGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  heartGeo.center();
  const heartMesh = new THREE.Mesh(heartGeo, plushMaterial);
  heartMesh.scale.set(0.24, 0.24, 0.24);
  // Laying flat on the chessboard with slight plush tilt
  heartMesh.rotation.x = -Math.PI / 2.3;
  heartMesh.rotation.z = 0.25;
  heartMesh.position.y = 0.08;
  heartGroup.add(heartMesh);

  // Cute plush thread stitches along the center seam
  for (let s = -4; s <= 4; s++) {
    const stitchGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.035, 6);
    const stitch = new THREE.Mesh(stitchGeo, stitchMaterial);
    stitch.position.set(s * 0.025, 0.10, s * 0.005);
    stitch.rotation.z = Math.PI / 3.5;
    heartGroup.add(stitch);
  }

  // Soft fuzzy wool aura (halo of delicate yarn wisps)
  const fuzzCount = 14;
  for (let f = 0; f < fuzzCount; f++) {
    const angle = (f / fuzzCount) * Math.PI * 2;
    const rad = 0.11 + Math.random() * 0.04;
    const fuzzGeo = new THREE.SphereGeometry(0.018, 6, 6);
    const fuzzMesh = new THREE.Mesh(fuzzGeo, plushMaterial);
    fuzzMesh.position.set(Math.cos(angle) * rad, 0.07 + Math.random() * 0.03, Math.sin(angle) * rad * 0.8);
    heartGroup.add(fuzzMesh);
  }

  // Cozy gentle warm red glow around the plush heart
  const heartLight = new THREE.PointLight(0xF43F5E, 1.2, 3.5, 2.0);
  heartLight.position.set(0, 0.25, 0);
  heartGroup.add(heartLight);

  return heartGroup;
}

// ========================================================
// 3b. MID-POLY UNICORN FUR & PELT TEXTURE GENERATORS
// Fine organic hair strands, pelt directional grain & bump relief
// ========================================================
let cachedFurPeltTexture: THREE.CanvasTexture | null = null;
let cachedFurBumpTexture: THREE.CanvasTexture | null = null;
let cachedManeHairTexture: THREE.CanvasTexture | null = null;
let cachedGoldenHornTexture: THREE.CanvasTexture | null = null;

function getFurPeltTexture(): THREE.CanvasTexture {
  if (cachedFurPeltTexture) return cachedFurPeltTexture;
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Warm silky pearl-ivory base coat
  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(0, 0, size, size);

  // Soft directional fur wash (golden-ivory highlights & gentle shadow)
  const wash = ctx.createLinearGradient(0, 0, 0, size);
  wash.addColorStop(0, 'rgba(255, 253, 248, 0.4)');
  wash.addColorStop(0.5, 'rgba(245, 240, 232, 0.2)');
  wash.addColorStop(1, 'rgba(232, 226, 216, 0.35)');
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, size, size);

  // Over 2,200 fine individual hair-strand strokes for tactile fur grain
  const hairColors = [
    'rgba(255, 255, 255, 0.28)',
    'rgba(240, 235, 225, 0.22)',
    'rgba(225, 218, 208, 0.16)',
    'rgba(252, 248, 242, 0.32)'
  ];

  for (let i = 0; i < 2200; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = 5 + Math.random() * 12;
    // Downward & backward hair stroke direction with natural jitter
    const angle = Math.PI * 0.45 + (Math.random() - 0.5) * 0.4;

    ctx.strokeStyle = hairColors[i % hairColors.length];
    ctx.lineWidth = 0.8 + Math.random() * 1.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }

  // Soft rosy blush tint for muzzle and inner ears
  const blushGrad = ctx.createRadialGradient(size * 0.8, size * 0.2, 0, size * 0.8, size * 0.2, size * 0.25);
  blushGrad.addColorStop(0, 'rgba(251, 207, 232, 0.38)');
  blushGrad.addColorStop(1, 'rgba(250, 248, 245, 0.0)');
  ctx.fillStyle = blushGrad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.5, 1.5);
  cachedFurPeltTexture = tex;
  return tex;
}

function getFurBumpTexture(): THREE.CanvasTexture {
  if (cachedFurBumpTexture) return cachedFurBumpTexture;
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // Micro hair scratches for bump depth
  for (let b = 0; b < 1800; b++) {
    const bx = Math.random() * size;
    const by = Math.random() * size;
    const len = 4 + Math.random() * 10;
    const angle = Math.PI * 0.45 + (Math.random() - 0.5) * 0.35;

    ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(210, 210, 210, 0.35)' : 'rgba(50, 50, 50, 0.35)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + Math.cos(angle) * len, by + Math.sin(angle) * len);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  cachedFurBumpTexture = tex;
  return tex;
}

function getManeHairTexture(): THREE.CanvasTexture {
  if (cachedManeHairTexture) return cachedManeHairTexture;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FAF5FF';
  ctx.fillRect(0, 0, size, size);

  // Silky pastel hair strands
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(233, 213, 255, 0.35)' : 'rgba(254, 240, 138, 0.3)';
    ctx.lineWidth = 1.2 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 14);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  cachedManeHairTexture = tex;
  return tex;
}

function getGoldenHornTexture(): THREE.CanvasTexture {
  if (cachedGoldenHornTexture) return cachedGoldenHornTexture;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FDE047';
  ctx.fillRect(0, 0, size, size);

  for (let g = 0; g < 400; g++) {
    const gx = Math.random() * size;
    const gy = Math.random() * size;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(254, 249, 195, 0.6)' : 'rgba(202, 138, 4, 0.35)';
    ctx.fillRect(gx, gy, 2 + Math.random() * 4, 2 + Math.random() * 4);
  }

  const tex = new THREE.CanvasTexture(canvas);
  cachedGoldenHornTexture = tex;
  return tex;
}

// ========================================================
// 4. MID-POLY 3D UNICORN MODEL WITH FUR/PELT TEXTURE
// ========================================================
interface UnicornRig {
  root: THREE.Group;
  body: THREE.Mesh;
  neck: THREE.Group;
  head: THREE.Group;
  leftEar: THREE.Group;
  rightEar: THREE.Group;
  horn: THREE.Group;
  hornGlowLight: THREE.PointLight;
  mane: THREE.Group;
  tail: THREE.Group;
  frontLeftLeg: { hip: THREE.Group; knee: THREE.Group; hoof: THREE.Mesh };
  frontRightLeg: { hip: THREE.Group; knee: THREE.Group; hoof: THREE.Mesh };
  backLeftLeg: { hip: THREE.Group; knee: THREE.Group; hoof: THREE.Mesh };
  backRightLeg: { hip: THREE.Group; knee: THREE.Group; hoof: THREE.Mesh };
}

function build3DUnicorn(): UnicornRig {
  const root = new THREE.Group();
  root.scale.set(0.24, 0.24, 0.24);

  // 1. Textures & Materials
  const furTex = getFurPeltTexture();
  const furBump = getFurBumpTexture();
  const maneTex = getManeHairTexture();
  const hornTex = getGoldenHornTexture();

  // Mid-Poly Soft Pelt Fur Material
  const furMaterial = new THREE.MeshStandardMaterial({
    map: furTex,
    bumpMap: furBump,
    bumpScale: 0.035,
    color: 0xFDFBF7,
    roughness: 0.78,
    metalness: 0.05
  });

  // Silky Fur Mane & Tail Material
  const maneMaterial = new THREE.MeshStandardMaterial({
    map: maneTex,
    bumpMap: furBump,
    bumpScale: 0.028,
    color: 0xFFFBEB,
    roughness: 0.82,
    metalness: 0.02
  });

  // Soft Pink Muzzle / Ear Interior Material
  const pinkMuzzleMaterial = new THREE.MeshStandardMaterial({
    map: furTex,
    color: 0xFBCFE8,
    roughness: 0.75,
    bumpMap: furBump,
    bumpScale: 0.02
  });

  // Glossy Eyes Material
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x1E1B4B,
    roughness: 0.12,
    metalness: 0.88
  });

  const eyeSparkMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF
  });

  // Crystalline Spiral Golden Horn Material
  const hornMaterial = new THREE.MeshStandardMaterial({
    map: hornTex,
    bumpMap: furBump,
    bumpScale: 0.04,
    color: 0xFEF08A,
    roughness: 0.38,
    metalness: 0.40,
    emissive: 0xFDE047,
    emissiveIntensity: 0.85
  });

  // Polished Dark Hooves Material
  const hoofMaterial = new THREE.MeshStandardMaterial({
    color: 0x44403C,
    roughness: 0.55,
    metalness: 0.15
  });

  // 2. Mid-Poly Torso & Ribcage
  const bodyGeo = new THREE.SphereGeometry(0.72, 22, 18);
  bodyGeo.scale(0.92, 1.05, 1.48);
  const body = new THREE.Mesh(bodyGeo, furMaterial);
  body.position.y = 1.22;
  root.add(body);

  // Withers / Shoulder Transition
  const withersGeo = new THREE.SphereGeometry(0.44, 18, 14);
  withersGeo.scale(0.95, 1.12, 1.18);
  const withers = new THREE.Mesh(withersGeo, furMaterial);
  withers.position.set(0, 0.32, 0.52);
  body.add(withers);

  // Chest Puff
  const chestPuffGeo = new THREE.SphereGeometry(0.36, 16, 12);
  chestPuffGeo.scale(1.02, 1.20, 0.88);
  const chestPuff = new THREE.Mesh(chestPuffGeo, maneMaterial);
  chestPuff.position.set(0, -0.06, 0.88);
  body.add(chestPuff);

  // 3. Arched Mid-Poly Neck & Throat
  const neck = new THREE.Group();
  neck.position.set(0, 0.38, 0.68);
  body.add(neck);

  const neckLowerGeo = new THREE.CylinderGeometry(0.34, 0.46, 0.62, 18);
  neckLowerGeo.rotateX(Math.PI / 4.8);
  neckLowerGeo.translate(0, 0.26, 0.12);
  const neckLower = new THREE.Mesh(neckLowerGeo, furMaterial);
  neck.add(neckLower);

  const neckUpperGeo = new THREE.CylinderGeometry(0.26, 0.34, 0.52, 18);
  neckUpperGeo.rotateX(Math.PI / 3.8);
  neckUpperGeo.translate(0, 0.62, 0.34);
  const neckUpper = new THREE.Mesh(neckUpperGeo, furMaterial);
  neck.add(neckUpper);

  const throatLatchGeo = new THREE.SphereGeometry(0.26, 16, 12);
  throatLatchGeo.scale(1.0, 0.95, 1.15);
  const throatLatch = new THREE.Mesh(throatLatchGeo, furMaterial);
  throatLatch.position.set(0, 0.88, 0.44);
  neck.add(throatLatch);

  // 4. Mid-Poly Head & Muzzle
  const head = new THREE.Group();
  head.position.set(0, 0.92, 0.46);
  neck.add(head);

  const craniumGeo = new THREE.SphereGeometry(0.48, 20, 18);
  craniumGeo.scale(1.02, 1.10, 1.10);
  const cranium = new THREE.Mesh(craniumGeo, furMaterial);
  head.add(cranium);

  // Cheeks
  const cheekGeo = new THREE.SphereGeometry(0.24, 14, 12);
  cheekGeo.scale(0.9, 0.8, 0.9);
  const leftCheek = new THREE.Mesh(cheekGeo, furMaterial);
  leftCheek.position.set(-0.28, -0.15, 0.2);
  head.add(leftCheek);

  const rightCheek = new THREE.Mesh(cheekGeo, furMaterial);
  rightCheek.position.set(0.28, -0.15, 0.2);
  head.add(rightCheek);

  // Muzzle & Soft Nose Tip
  const muzzleGeo = new THREE.SphereGeometry(0.24, 16, 14);
  muzzleGeo.scale(1.05, 0.82, 1.18);
  const muzzle = new THREE.Mesh(muzzleGeo, furMaterial);
  muzzle.position.set(0, -0.18, 0.45);
  head.add(muzzle);

  const noseTipGeo = new THREE.SphereGeometry(0.065, 10, 10);
  noseTipGeo.scale(1.2, 0.7, 0.9);
  const noseTip = new THREE.Mesh(noseTipGeo, pinkMuzzleMaterial);
  noseTip.position.set(0, -0.14, 0.68);
  head.add(noseTip);

  // Glossy Almond Eyes
  const eyeRadius = 0.135;
  const eyeGeo = new THREE.SphereGeometry(eyeRadius, 16, 14);
  eyeGeo.scale(0.85, 1.15, 0.85);

  const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
  leftEye.position.set(-0.25, 0.08, 0.36);
  leftEye.rotation.y = -0.32;
  leftEye.rotation.z = -0.05;
  head.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, eyeMaterial);
  rightEye.position.set(0.25, 0.08, 0.36);
  rightEye.rotation.y = 0.32;
  rightEye.rotation.z = 0.05;
  head.add(rightEye);

  // Eye Specular Sparkles
  const sparkGeo = new THREE.SphereGeometry(0.042, 8, 8);
  const leftSpark = new THREE.Mesh(sparkGeo, eyeSparkMaterial);
  leftSpark.position.set(-0.265, 0.13, 0.44);
  head.add(leftSpark);

  const rightSpark = new THREE.Mesh(sparkGeo, eyeSparkMaterial);
  rightSpark.position.set(0.235, 0.13, 0.44);
  head.add(rightSpark);

  // Ears
  const buildEar = (isLeft: boolean) => {
    const earGroup = new THREE.Group();
    earGroup.position.set(isLeft ? -0.22 : 0.22, 0.48, -0.02);
    earGroup.rotation.z = isLeft ? -0.25 : 0.25;
    earGroup.rotation.x = -0.15;
    head.add(earGroup);

    const outerGeo = new THREE.ConeGeometry(0.14, 0.46, 14);
    outerGeo.scale(0.85, 1.0, 0.55);
    const outer = new THREE.Mesh(outerGeo, furMaterial);
    earGroup.add(outer);

    const innerGeo = new THREE.ConeGeometry(0.09, 0.36, 12);
    innerGeo.scale(0.8, 1.0, 0.4);
    innerGeo.translate(0, -0.02, 0.04);
    const inner = new THREE.Mesh(innerGeo, pinkMuzzleMaterial);
    earGroup.add(inner);

    return earGroup;
  };

  const leftEar = buildEar(true);
  const rightEar = buildEar(false);

  // 5. Golden Spiral Horn with Starlight Glow
  const hornGroup = new THREE.Group();
  hornGroup.position.set(0, 0.46, 0.22);
  hornGroup.rotation.x = Math.PI / 16;
  head.add(hornGroup);

  const hornCoreGeo = new THREE.ConeGeometry(0.095, 1.28, 16);
  hornCoreGeo.translate(0, 0.62, 0);
  const hornCore = new THREE.Mesh(hornCoreGeo, hornMaterial);
  hornGroup.add(hornCore);

  for (let s = 0; s < 12; s++) {
    const t = s / 12;
    const h = t * 1.15 + 0.05;
    const r = (1.0 - t * 0.78) * 0.095;
    const angle = t * Math.PI * 6.0;
    const ridgeGeo = new THREE.SphereGeometry(r * 0.48, 8, 8);
    const ridge = new THREE.Mesh(ridgeGeo, hornMaterial);
    ridge.position.set(Math.cos(angle) * r, h, Math.sin(angle) * r);
    hornGroup.add(ridge);
  }

  const hornGlowLight = new THREE.PointLight(0xFEF08A, 2.0, 8.5, 2.0);
  hornGlowLight.position.set(0, 1.3, 0.2);
  head.add(hornGlowLight);

  // 6. Soft Fur Mane
  const mane = new THREE.Group();
  neck.add(mane);
  const manePuffs = [
    { r: 0.22, y: 0.82, z: 0.25 },
    { r: 0.25, y: 0.62, z: 0.10 },
    { r: 0.26, y: 0.42, z: -0.06 },
    { r: 0.23, y: 0.22, z: -0.18 },
    { r: 0.20, y: 0.02, z: -0.28 }
  ];
  manePuffs.forEach(p => {
    const puffGeo = new THREE.SphereGeometry(p.r, 14, 12);
    puffGeo.scale(0.85, 1.15, 1.25);
    const puff = new THREE.Mesh(puffGeo, maneMaterial);
    puff.position.set(0, p.y, p.z);
    mane.add(puff);
  });

  // 7. Compact Fur Tail
  const tail = new THREE.Group();
  tail.position.set(0, 0.32, -0.85);
  body.add(tail);

  const tailPuffs = [
    { r: 0.13, x: 0, y: 0, z: -0.06 },
    { r: 0.16, x: 0.02, y: -0.10, z: -0.14 },
    { r: 0.18, x: -0.02, y: -0.22, z: -0.22 },
    { r: 0.15, x: 0.015, y: -0.36, z: -0.28 },
    { r: 0.11, x: 0, y: -0.48, z: -0.32 }
  ];
  tailPuffs.forEach(tp => {
    const tpGeo = new THREE.SphereGeometry(tp.r, 12, 10);
    tpGeo.scale(0.95, 1.1, 1.2);
    const puffMesh = new THREE.Mesh(tpGeo, maneMaterial);
    puffMesh.position.set(tp.x, tp.y, tp.z);
    tail.add(puffMesh);
  });

  // 8. Articulated Equine Legs with Fetlock Feathering & Hooves
  const buildEquineLeg = (offsetX: number, offsetZ: number) => {
    const hip = new THREE.Group();
    hip.position.set(offsetX, -0.22, offsetZ);
    body.add(hip);

    const socketGeo = new THREE.SphereGeometry(0.18, 14, 12);
    socketGeo.scale(0.85, 1.15, 1.1);
    const socket = new THREE.Mesh(socketGeo, furMaterial);
    hip.add(socket);

    const thighGeo = new THREE.CylinderGeometry(0.11, 0.088, 0.48, 14);
    thighGeo.translate(0, -0.24, 0);
    const thigh = new THREE.Mesh(thighGeo, furMaterial);
    hip.add(thigh);

    const knee = new THREE.Group();
    knee.position.set(0, -0.48, 0);
    hip.add(knee);

    const kneeKnuckleGeo = new THREE.SphereGeometry(0.092, 12, 10);
    const kneeKnuckle = new THREE.Mesh(kneeKnuckleGeo, furMaterial);
    knee.add(kneeKnuckle);

    const shinGeo = new THREE.CylinderGeometry(0.085, 0.068, 0.44, 14);
    shinGeo.translate(0, -0.22, 0);
    const shin = new THREE.Mesh(shinGeo, furMaterial);
    knee.add(shin);

    const fetlockCuffGeo = new THREE.TorusGeometry(0.105, 0.048, 10, 16);
    fetlockCuffGeo.rotateX(Math.PI / 2);
    fetlockCuffGeo.translate(0, -0.42, 0.01);
    const fetlockCuff = new THREE.Mesh(fetlockCuffGeo, maneMaterial);
    knee.add(fetlockCuff);

    const hoofGeo = new THREE.CylinderGeometry(0.068, 0.105, 0.15, 14);
    hoofGeo.translate(0, -0.49, 0.015);
    const hoof = new THREE.Mesh(hoofGeo, hoofMaterial);
    knee.add(hoof);

    return { hip, knee, hoof };
  };

  const frontLeftLeg = buildEquineLeg(-0.34, 0.65);
  const frontRightLeg = buildEquineLeg(0.34, 0.65);
  const backLeftLeg = buildEquineLeg(-0.34, -0.65);
  const backRightLeg = buildEquineLeg(0.34, -0.65);

  return {
    root,
    body,
    neck,
    head,
    leftEar,
    rightEar,
    horn: hornGroup,
    hornGlowLight,
    mane,
    tail,
    frontLeftLeg,
    frontRightLeg,
    backLeftLeg,
    backRightLeg
  };
}

// ========================================================
// 5. MAIN COMPONENT: 3D UNICORN CHESS SIMULATOR
// ========================================================
export const UnicornChessTab: React.FC<UnicornChessTabProps> = ({
  onSwitchTab
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Steps & Collected Hearts State
  const [stepsCount, setStepsCount] = useState<number>(0);
  const [collectedHearts, setCollectedHearts] = useState<number>(() => {
    try {
      const h = localStorage.getItem('quit-smoking:unicorn-hearts');
      return h ? Number(h) : 0;
    } catch {
      return 0;
    }
  });

  // Joystick state
  const joystickRef = useRef({
    active: false,
    vectorX: 0,
    vectorY: 0,
    intensity: 0
  });
  const joystickKnobRef = useRef<HTMLDivElement | null>(null);
  const joystickBaseRef = useRef<HTMLDivElement | null>(null);

  // 3D Scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const unicornRigRef = useRef<UnicornRig | null>(null);
  const plushHeartRef = useRef<THREE.Group | null>(null);

  // Unicorn Dynamic Kinematics
  const simRef = useRef({
    x: 0,
    z: 0,
    rotation: Math.PI,
    targetRotation: Math.PI,
    angularVelocity: 0,
    walkPhase: 0,
    speed: 0,
    stepsTaken: 0,
    lastStepPhaseInt: 0,
    heartX: 3.5,
    heartZ: -3.5,
    heartActive: true,
    stepsUntilSpawn: 0
  });

  // Camera Orbit Tracking (Calibrated higher and further for panoramic board view)
  const camTrackingRef = useRef({
    currentPos: new THREE.Vector3(0, 1.35, 3.2),
    targetPos: new THREE.Vector3(0, 1.35, 3.2),
    lookAt: new THREE.Vector3(0, 0.28, 0)
  });

  // Audio start trigger
  const handleUserInteractAudio = useCallback(() => {
    bellAudio.init();
  }, []);

  // Keyboard controls
  const keysDownRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysDownRef.current[e.code] = true;
      handleUserInteractAudio();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysDownRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleUserInteractAudio]);

  // Three.js 3D Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene with cohesive dark atmosphere & smooth distance fog
    // Fog darkens smoothly beyond the unicorn's light milky envelope
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1014);
    scene.fog = new THREE.Fog(0x0e1014, 4.0, 13.0);
    sceneRef.current = scene;

    // 2. Perspective Camera (Adaptive FOV based on screen aspect ratio)
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const aspect = width / height;
    const initialFov = aspect < 1.0 ? Math.min(64, Math.max(45, 45 / Math.sqrt(aspect))) : 45;
    const camera = new THREE.PerspectiveCamera(initialFov, aspect, 0.1, 80);
    camera.position.set(0, 1.35, 3.2);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'low-power'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting & Directional Spotlight for Forward 4-Square Milky Illumination
    const ambientLight = new THREE.AmbientLight(0x60697a, 0.95);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0xE2E8F0, 1.15);
    moonLight.position.set(4, 12, 6);
    scene.add(moonLight);

    // Forward Searchlight / Vision Cone: Illuminates 4 squares ahead in the direction unicorn looks
    const visionSpot = new THREE.SpotLight(0xF5F9FF, 2.8, 9.2, Math.PI / 4.0, 0.85, 1.6);
    visionSpot.position.set(0, 0.75, 0);
    scene.add(visionSpot);
    const visionTarget = new THREE.Object3D();
    scene.add(visionTarget);
    visionSpot.target = visionTarget;

    // 5. Painterly Checkered Floor
    const floorTexture = getPainterlyChessboardTexture();
    const floorGeo = new THREE.PlaneGeometry(240, 240);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.75,
      metalness: 0.08
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    scene.add(floorMesh);

    // 5b. Unified Dynamic Milky Fog Envelope (2 squares on sides, 4 squares in front, 1 square behind)
    const milkyAuraGroup = new THREE.Group();
    scene.add(milkyAuraGroup);

    const milkyTex = getUnicornMilkyAuraTexture();
    const milkyMat = new THREE.MeshBasicMaterial({
      map: milkyTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    // Primary ground milky fog field
    // 8.5 units wide (2 squares on left/right flanks), 11.5 units long (4 squares forward, 1 square rear)
    const milkyGeo = new THREE.PlaneGeometry(8.5, 11.5);
    milkyGeo.rotateX(-Math.PI / 2);
    milkyGeo.translate(0, 0, 2.6); // Center offset so 4 squares extend forward, 1 behind
    const milkyMesh = new THREE.Mesh(milkyGeo, milkyMat);
    milkyMesh.position.y = 0.035;
    milkyAuraGroup.add(milkyMesh);

    // Secondary ethereal floating layer for organic 3D fog volume
    const floatMat = new THREE.MeshBasicMaterial({
      map: milkyTex,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
    const floatGeo = new THREE.PlaneGeometry(7.6, 10.4);
    floatGeo.rotateX(-Math.PI / 2);
    floatGeo.translate(0, 0, 2.4);
    const floatMesh = new THREE.Mesh(floatGeo, floatMat);
    floatMesh.position.y = 0.12;
    milkyAuraGroup.add(floatMesh);

    // 5c. Low Drifting Mist in the Air across the realm
    const driftingMistDiscs: THREE.Mesh[] = [];
    const driftGeo = new THREE.PlaneGeometry(10, 10);
    driftGeo.rotateX(-Math.PI / 2);
    const driftMat = new THREE.MeshBasicMaterial({
      map: milkyTex,
      transparent: true,
      opacity: 0.20,
      depthWrite: false
    });
    for (let m = 0; m < 8; m++) {
      const mesh = new THREE.Mesh(driftGeo, driftMat);
      mesh.position.set(
        (Math.random() - 0.5) * 32,
        0.15 + Math.random() * 0.35,
        (Math.random() - 0.5) * 32
      );
      scene.add(mesh);
      driftingMistDiscs.push(mesh);
    }

    // 6. Build & Add 3D Unicorn
    const unicornRig = build3DUnicorn();
    scene.add(unicornRig.root);
    unicornRigRef.current = unicornRig;

    // 7. Rare Plush Heart Object on Board
    const plushHeart = buildPlushHeart();
    plushHeart.position.set(simRef.current.heartX, 0, simRef.current.heartZ);
    scene.add(plushHeart);
    plushHeartRef.current = plushHeart;

    // 8. Adaptive Power-Saving Animation & Game Loop
    let animId = 0;
    let lastTime = performance.now();
    let isTabVisible = document.visibilityState === 'visible';

    const _camTarget = new THREE.Vector3();
    const _camLook = new THREE.Vector3();

    const animate = (time: number) => {
      if (!isTabVisible) return;

      const sim = simRef.current;
      const joy = joystickRef.current;
      const keys = keysDownRef.current;

      const isActivelyMoving = Math.abs(sim.speed) > 0.04 || joy.intensity > 0.05;
      const targetInterval = isActivelyMoving ? 16.0 : 33.3;

      const elapsed = time - lastTime;
      if (elapsed < targetInterval) {
        animId = requestAnimationFrame(animate);
        return;
      }

      lastTime = time - (elapsed % targetInterval);
      const dt = Math.min(0.08, elapsed / 1000);

      // Drift air mist gently
      for (let m = 0; m < driftingMistDiscs.length; m++) {
        driftingMistDiscs[m].position.x += Math.sin(time * 0.0003 + m) * 0.003;
        if (Math.abs(driftingMistDiscs[m].position.x - sim.x) > 22) {
          driftingMistDiscs[m].position.x = sim.x + (Math.random() - 0.5) * 28;
        }
        if (Math.abs(driftingMistDiscs[m].position.z - sim.z) > 22) {
          driftingMistDiscs[m].position.z = sim.z + (Math.random() - 0.5) * 28;
        }
      }

      // Plush Heart Animation & Collision Check
      if (plushHeartRef.current) {
        if (sim.heartActive) {
          plushHeartRef.current.visible = true;
          // Soft plush floating/breathing pulse
          plushHeartRef.current.position.y = 0.04 + Math.sin(time * 0.003) * 0.02;
          plushHeartRef.current.rotation.y = Math.sin(time * 0.0015) * 0.2;

          // Distance check to collect heart
          const distToHeart = Math.hypot(sim.x - sim.heartX, sim.z - sim.heartZ);
          if (distToHeart < 0.42) {
            // Collected plush heart!
            sim.heartActive = false;
            plushHeartRef.current.visible = false;
            bellAudio.playHeartPickupSound();
            setCollectedHearts(prev => {
              const next = prev + 1;
              try {
                localStorage.setItem('quit-smoking:unicorn-hearts', String(next));
              } catch {}
              return next;
            });
            // Schedule next very rare spawn (after 50-80 steps)
            sim.stepsUntilSpawn = 50 + Math.floor(Math.random() * 30);
          }
        } else {
          plushHeartRef.current.visible = false;
        }
      }

      // Directional Movement Input
      let inputX = joy.vectorX;
      let inputZ = joy.vectorY;

      if (keys['KeyA'] || keys['ArrowLeft']) inputX -= 0.8;
      if (keys['KeyD'] || keys['ArrowRight']) inputX += 0.8;
      if (keys['KeyW'] || keys['ArrowUp']) inputZ -= 0.8;
      if (keys['KeyS'] || keys['ArrowDown']) inputZ += 0.8;

      // Non-linear response curve for less sensitive, fine-grained joystick steering
      const absX = Math.abs(inputX);
      const curvedX = absX > 0.06 ? Math.sign(inputX) * Math.pow((absX - 0.06) / 0.94, 1.5) : 0;

      // Character Steering Kinematics: Smooth gradual rotation with gentle turning speed
      const turnSpeed = 1.35; // Soft, relaxed turning rate (less sensitive)
      const targetTurn = -curvedX * turnSpeed;
      sim.angularVelocity += (targetTurn - sim.angularVelocity) * 0.055; // Silky rotational inertia
      sim.rotation += sim.angularVelocity * dt;

      // Forward drive with non-linear curve & smooth acceleration
      const absZ = Math.abs(inputZ);
      const curvedZ = absZ > 0.06 ? Math.sign(inputZ) * Math.pow((absZ - 0.06) / 0.94, 1.4) : 0;
      const forwardDrive = -curvedZ; // Pushing up on joystick drives forward

      if (Math.abs(forwardDrive) > 0.03) {
        const targetSpeed = forwardDrive > 0 ? Math.min(1.0, forwardDrive) * 0.58 : forwardDrive * 0.26;
        sim.speed += (targetSpeed - sim.speed) * 0.042; // Soft, progressive acceleration
      } else {
        sim.speed *= 0.90; // Gentle deceleration
        if (Math.abs(sim.speed) < 0.01) sim.speed = 0;
      }

      // Advance Position in unicorn's current heading
      sim.x += Math.sin(sim.rotation) * sim.speed * dt;
      sim.z += Math.cos(sim.rotation) * sim.speed * dt;

      // Stride cadence for walking and in-place turning
      const isMoving = Math.abs(sim.speed) > 0.02 || Math.abs(curvedX) > 0.10;
      const strideRate = Math.max(Math.abs(sim.speed), Math.abs(curvedX) * 0.30);

      if (isMoving) {
        sim.walkPhase += dt * strideRate * 4.4;

        // Hoof contact chimes: sound plays the instant a hoof touches the board
        const stepPhaseInt = Math.floor(sim.walkPhase / (Math.PI * 0.5));
        if (stepPhaseInt > sim.lastStepPhaseInt) {
          sim.lastStepPhaseInt = stepPhaseInt;
          sim.stepsTaken++;
          setStepsCount(sim.stepsTaken);
          const hoofIndex = sim.stepsTaken % 4;
          bellAudio.playHoofChime(sim.stepsTaken, hoofIndex, 0.85);

          // Spawn new plush heart if rare step cooldown reached
          if (!sim.heartActive && sim.stepsUntilSpawn > 0) {
            sim.stepsUntilSpawn--;
            if (sim.stepsUntilSpawn <= 0) {
              // Spawn rare plush heart 3 to 5 squares ahead/around
              const angle = Math.random() * Math.PI * 2;
              const dist = 3.5 + Math.random() * 3.5;
              sim.heartX = sim.x + Math.cos(angle) * dist;
              sim.heartZ = sim.z + Math.sin(angle) * dist;
              sim.heartActive = true;
              if (plushHeartRef.current) {
                plushHeartRef.current.position.set(sim.heartX, 0, sim.heartZ);
              }
            }
          }
        }
      }

      // Update 3D Mid-Poly Unicorn Rig with Fur/Pelt Texture
      if (unicornRigRef.current) {
        const rig = unicornRigRef.current;
        rig.root.position.set(sim.x, 0, sim.z);
        rig.root.rotation.y = sim.rotation;

        const isLocomoting = Math.abs(sim.speed) > 0.02 || Math.abs(curvedX) > 0.10;
        const phase = sim.walkPhase;

        if (isLocomoting) {
          // Equine diagonal gait pairing
          const fL = Math.sin(phase);
          const fR = Math.sin(phase + Math.PI);
          const bL = Math.sin(phase + Math.PI * 0.5);
          const bR = Math.sin(phase + Math.PI * 1.5);

          rig.frontLeftLeg.hip.rotation.x = fL * 0.44;
          rig.frontLeftLeg.knee.rotation.x = Math.max(0, -fL * 0.68);

          rig.frontRightLeg.hip.rotation.x = fR * 0.44;
          rig.frontRightLeg.knee.rotation.x = Math.max(0, -fR * 0.68);

          rig.backLeftLeg.hip.rotation.x = bL * 0.40;
          rig.backLeftLeg.knee.rotation.x = Math.max(0, bL * 0.62);

          rig.backRightLeg.hip.rotation.x = bR * 0.40;
          rig.backRightLeg.knee.rotation.x = Math.max(0, bR * 0.62);

          rig.body.position.y = 1.22 + Math.abs(Math.sin(phase * 2)) * 0.045;
          rig.neck.rotation.x = Math.sin(phase * 2) * 0.042;
          rig.head.rotation.x = Math.sin(phase * 2 + 0.3) * 0.03;
          rig.tail.rotation.z = Math.sin(phase) * 0.28;
        } else {
          rig.body.position.y = 1.22;
          rig.frontLeftLeg.hip.rotation.x *= 0.85;
          rig.frontLeftLeg.knee.rotation.x *= 0.85;
          rig.frontRightLeg.hip.rotation.x *= 0.85;
          rig.frontRightLeg.knee.rotation.x *= 0.85;
          rig.backLeftLeg.hip.rotation.x *= 0.85;
          rig.backLeftLeg.knee.rotation.x *= 0.85;
          rig.backRightLeg.hip.rotation.x *= 0.85;
          rig.backRightLeg.knee.rotation.x *= 0.85;

          const idleBreath = Math.sin(time * 0.002) * 0.018;
          rig.neck.rotation.x = idleBreath;
          rig.head.rotation.x = -idleBreath * 0.5;
          rig.tail.rotation.z = Math.sin(time * 0.0018) * 0.07;
        }

        rig.hornGlowLight.intensity = 2.0 + 0.40 * Math.sin(time * 0.0035);
      }

      // Update Unified Dynamic Milky Fog Envelope (2 squares sides, 4 squares in front, 1 square behind)
      milkyAuraGroup.position.set(sim.x, 0, sim.z);
      milkyAuraGroup.rotation.y = sim.rotation;
      milkyMat.opacity = 0.84 + Math.sin(time * 0.002) * 0.04;
      floatMat.opacity = 0.38 + Math.cos(time * 0.0025) * 0.03;

      // Update Forward Spotlight (reveals 4 squares ahead in looking direction)
      visionSpot.position.set(sim.x, 0.75, sim.z);
      visionTarget.position.set(
        sim.x + Math.sin(sim.rotation) * 6.0,
        0.05,
        sim.z + Math.cos(sim.rotation) * 6.0
      );

      // Camera smoothly floats behind unicorn with gentle, slow, cinematic damping ("поворот камери плавним і повільним")
      if (cameraRef.current) {
        const cam = cameraRef.current;
        const camTrack = camTrackingRef.current;

        // Position camera behind and elevated relative to unicorn orientation (higher & further)
        const camDist = 3.2;
        const camHeight = 1.35;
        _camTarget.set(
          sim.x - Math.sin(sim.rotation) * camDist,
          camHeight,
          sim.z - Math.cos(sim.rotation) * camDist
        );
        _camLook.set(
          sim.x + Math.sin(sim.rotation) * 2.2,
          0.28,
          sim.z + Math.cos(sim.rotation) * 2.2
        );

        // Smooth, slow, cinematic camera interpolation (no rapid jerks)
        camTrack.currentPos.lerp(_camTarget, 0.026);
        camTrack.lookAt.lerp(_camLook, 0.032);
        cam.position.copy(camTrack.currentPos);
        cam.lookAt(camTrack.lookAt);
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
      if (isTabVisible) {
        lastTime = performance.now();
        if (!animId) animId = requestAnimationFrame(animate);
      } else {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = 0;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const updateViewportSize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      if (w <= 0 || h <= 0) return;
      const currentAspect = w / h;
      camera.aspect = currentAspect;
      camera.fov = currentAspect < 1.0 ? Math.min(64, Math.max(45, 45 / Math.sqrt(currentAspect))) : 45;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    let resizeTimer: any = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateViewportSize();
      }, 40);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateViewportSize();
      });
      resizeObserver.observe(container);
    }

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      if (animId) cancelAnimationFrame(animId);
      if (resizeObserver) resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });

      floorGeo.dispose();
      floorMat.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  // Joystick handlers
  const handleJoystickMove = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current || !joystickRef.current.active) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.hypot(dx, dy);
    const maxRadius = rect.width / 2;

    const clampedDist = Math.min(distance, maxRadius);
    const angle = Math.atan2(dy, dx);

    const normX = (Math.cos(angle) * clampedDist) / maxRadius;
    const normY = (Math.sin(angle) * clampedDist) / maxRadius;

    joystickRef.current.vectorX = normX;
    joystickRef.current.vectorY = normY;
    joystickRef.current.intensity = clampedDist / maxRadius;

    if (joystickKnobRef.current) {
      joystickKnobRef.current.style.transform = `translate(${normX * (maxRadius * 0.75)}px, ${normY * (maxRadius * 0.75)}px)`;
    }
  };

  const handleJoystickStart = (e: React.TouchEvent | React.MouseEvent) => {
    handleUserInteractAudio();
    joystickRef.current.active = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    handleJoystickMove(clientX, clientY);
  };

  const handleJoystickEnd = () => {
    joystickRef.current.active = false;
    joystickRef.current.vectorX = 0;
    joystickRef.current.vectorY = 0;
    joystickRef.current.intensity = 0;
    if (joystickKnobRef.current) {
      joystickKnobRef.current.style.transform = 'translate(0px, 0px)';
    }
  };

  useEffect(() => {
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (joystickRef.current.active) {
        handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (joystickRef.current.active) {
        handleJoystickMove(e.clientX, e.clientY);
      }
    };
    const handleGlobalEnd = () => {
      if (joystickRef.current.active) {
        handleJoystickEnd();
      }
    };

    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    window.addEventListener('touchend', handleGlobalEnd);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalEnd);

    return () => {
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalEnd);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
    };
  }, []);

  return (
    <div
      className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col bg-[#0e1014] overflow-hidden select-none touch-none overscroll-none"
      onClick={handleUserInteractAudio}
    >
      {/* 1. TOP HEADER (Strictly ONLY Back button with steps below it, and Plush Heart in right corner) */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-start justify-between p-4 pointer-events-none">
        {/* Left Side: Back Button and Steps directly beneath */}
        <div className="flex flex-col items-start gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => onSwitchTab?.('counter')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 hover:bg-black/70 border border-zinc-700/60 backdrop-blur-md text-zinc-200 hover:text-white transition-all duration-200 active:scale-95 text-xs font-medium cursor-pointer shadow-lg"
            title="Повернутися до меню"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Меню</span>
          </button>
          <div className="text-[11px] font-mono text-zinc-300 bg-black/50 px-2.5 py-0.5 rounded-lg border border-zinc-700/50 backdrop-blur-md shadow-md">
            Кроки: <span className="text-white font-semibold">{stepsCount}</span>
          </div>
        </div>

        {/* Right Corner: Plush Heart Badge with collected count */}
        <div 
          className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/40 backdrop-blur-md text-rose-200 shadow-xl transition-all"
          title="Зібрані плюшеві серця на дошці"
        >
          <span className="text-sm select-none animate-pulse">❤️</span>
          <span className="text-xs font-semibold font-mono text-rose-200">
            {collectedHearts}
          </span>
        </div>
      </div>

      {/* 2. 3D WEBGL CANVAS */}
      <div ref={mountRef} className="w-full h-full flex-1 touch-none overflow-hidden" />

      {/* 2b. COHESIVE ATMOSPHERIC DARKENING (Sides and front darken seamlessly into one unified space) */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `
            radial-gradient(ellipse 82% 70% at 50% 56%, rgba(14, 16, 20, 0) 32%, rgba(14, 16, 20, 0.45) 68%, rgba(10, 11, 14, 0.90) 100%)
          `
        }}
      />

      {/* 3. MINIMALIST ON-SCREEN JOYSTICK (Bottom Right Corner, Tiny Sphere) */}
      <div className="absolute bottom-5 right-5 z-30 pointer-events-auto flex items-center justify-center">
        <div
          ref={joystickBaseRef}
          onMouseDown={handleJoystickStart}
          onTouchStart={handleJoystickStart}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/40 border border-zinc-700/60 backdrop-blur-md shadow-2xl relative flex items-center justify-center cursor-pointer select-none touch-none active:border-zinc-500"
          title="Керування єдинорогом"
        >
          <div className="w-4 h-4 rounded-full border border-dashed border-zinc-600/40 pointer-events-none" />
          <div
            ref={joystickKnobRef}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-zinc-200/95 border border-white/70 shadow-lg absolute pointer-events-none transition-transform duration-75 flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600/70" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnicornChessTab;
