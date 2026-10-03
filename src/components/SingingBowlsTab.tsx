import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  Sliders,
  Sparkles,
  Activity,
  Check,
  Disc,
  Flame,
  Moon,
  Landmark
} from 'lucide-react';

export interface SingingBowlsTabProps {
  onSwitchTab?: (tab: any) => void;
}

export type BowlMaterial = 'tibetan' | 'quartz' | 'full_moon' | 'keisu';

export interface MaterialConfig {
  id: BowlMaterial;
  name: string;
  subname: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  baseDecay: number; // Base sustain time in seconds
  fundamentalWeight: number;
  overtoneWeight: number;
  subharmonicWeight: number;
  reverbSend: number;
  partials: { ratio: number; gain: number; decayMult: number; beatDelta: number }[];
  getThemeForBowl: (bowlId: string, chakraColor: string) => {
    outer: string;
    bodyStart: string;
    bodyEnd: string;
    rim: string;
    rimHighlight: string;
    innerGlow: string;
    textColor: string;
  };
}

export interface BowlData {
  id: string;
  note: string;
  chakraUk: string;
  chakraLatin: string;
  semitoneRatio: number; // Ratio relative to A4 (432 or 440)
  diameterRatio: number; // For physical size scaling
  chakraAccent: string;
  arcPosition: {
    leftPercent: number;
    topPercent: number;
  };
}

// 7 Authentic Chakra Bowls arranged along a natural semi-circle (Півколо)
export const BOWLS_SET: BowlData[] = [
  {
    id: 'bowl_c',
    note: 'C',
    chakraUk: 'Муладхара',
    chakraLatin: 'Root',
    semitoneRatio: Math.pow(2, -9 / 12), // C4 relative to A4
    diameterRatio: 1.04,
    chakraAccent: '#ef4444',
    arcPosition: { leftPercent: 7.2, topPercent: 61.2 }
  },
  {
    id: 'bowl_d',
    note: 'D',
    chakraUk: 'Свадхістана',
    chakraLatin: 'Sacral',
    semitoneRatio: Math.pow(2, -7 / 12), // D4
    diameterRatio: 1.01,
    chakraAccent: '#f97316',
    arcPosition: { leftPercent: 15.5, topPercent: 38.0 }
  },
  {
    id: 'bowl_e',
    note: 'E',
    chakraUk: 'Маніпура',
    chakraLatin: 'Solar',
    semitoneRatio: Math.pow(2, -5 / 12), // E4
    diameterRatio: 0.98,
    chakraAccent: '#eab308',
    arcPosition: { leftPercent: 30.8, topPercent: 22.0 }
  },
  {
    id: 'bowl_f',
    note: 'F',
    chakraUk: 'Анахата',
    chakraLatin: 'Heart',
    semitoneRatio: Math.pow(2, -4 / 12), // F4
    diameterRatio: 0.95,
    chakraAccent: '#10b981',
    arcPosition: { leftPercent: 50.0, topPercent: 16.2 }
  },
  {
    id: 'bowl_g',
    note: 'G',
    chakraUk: 'Вішуддха',
    chakraLatin: 'Throat',
    semitoneRatio: Math.pow(2, -2 / 12), // G4
    diameterRatio: 0.92,
    chakraAccent: '#0ea5e9',
    arcPosition: { leftPercent: 69.2, topPercent: 22.0 }
  },
  {
    id: 'bowl_a',
    note: 'A',
    chakraUk: 'Аджна',
    chakraLatin: 'Third Eye',
    semitoneRatio: 1.0, // A4 (Reference Pitch)
    diameterRatio: 0.89,
    chakraAccent: '#6366f1',
    arcPosition: { leftPercent: 84.5, topPercent: 38.0 }
  },
  {
    id: 'bowl_b',
    note: 'B',
    chakraUk: 'Сахасрара',
    chakraLatin: 'Crown',
    semitoneRatio: Math.pow(2, 2 / 12), // B4
    diameterRatio: 0.86,
    chakraAccent: '#a855f7',
    arcPosition: { leftPercent: 92.8, topPercent: 61.2 }
  }
];

// 4 Authentic Material Acoustic Profiles & Visuals
export const MATERIALS_CATALOG: Record<BowlMaterial, MaterialConfig> = {
  tibetan: {
    id: 'tibetan',
    name: 'Тибетська 7 металів',
    subname: 'Кована антична бронза',
    desc: 'Сакральний сплав із теплим, оксамитовим низом та багатими негармонійними вібраціями.',
    icon: Flame,
    baseDecay: 16.0,
    fundamentalWeight: 1.0,
    overtoneWeight: 0.65,
    subharmonicWeight: 0.22,
    reverbSend: 0.35,
    partials: [
      { ratio: 1.0, gain: 1.0, decayMult: 1.0, beatDelta: 0.8 },
      { ratio: 2.714, gain: 0.62, decayMult: 0.65, beatDelta: 1.4 },
      { ratio: 4.952, gain: 0.35, decayMult: 0.42, beatDelta: 2.1 },
      { ratio: 7.625, gain: 0.18, decayMult: 0.28, beatDelta: 3.2 },
      { ratio: 10.83, gain: 0.08, decayMult: 0.18, beatDelta: 4.5 },
      { ratio: 0.51, gain: 0.22, decayMult: 0.85, beatDelta: 0.4 }
    ],
    getThemeForBowl: (bowlId, chakraColor) => ({
      outer: '#451a03',
      bodyStart: '#78350f',
      bodyEnd: '#291407',
      rim: '#d97706',
      rimHighlight: '#fbbf24',
      innerGlow: `${chakraColor}25`,
      textColor: chakraColor
    })
  },
  quartz: {
    id: 'quartz',
    name: 'Кварцовий кристал',
    subname: 'Матовий білий кварц 432 Гц',
    desc: 'Надчистий, кришталево прозорий синусоїдальний тон із наддовгим сяючим сустейном.',
    icon: Disc,
    baseDecay: 24.0,
    fundamentalWeight: 1.25,
    overtoneWeight: 0.28,
    subharmonicWeight: 0.05,
    reverbSend: 0.45,
    partials: [
      { ratio: 1.0, gain: 1.2, decayMult: 1.0, beatDelta: 0.4 },
      { ratio: 2.005, gain: 0.32, decayMult: 0.85, beatDelta: 0.8 },
      { ratio: 3.012, gain: 0.16, decayMult: 0.65, beatDelta: 1.2 },
      { ratio: 4.225, gain: 0.08, decayMult: 0.45, beatDelta: 1.8 },
      { ratio: 0.50, gain: 0.06, decayMult: 0.95, beatDelta: 0.2 }
    ],
    getThemeForBowl: (bowlId, chakraColor) => ({
      outer: '#0f172a',
      bodyStart: '#e2e8f0',
      bodyEnd: '#64748b',
      rim: '#f8fafc',
      rimHighlight: '#ffffff',
      innerGlow: `${chakraColor}35`,
      textColor: chakraColor
    })
  },
  full_moon: {
    id: 'full_moon',
    name: 'Срібна повномісячна',
    subname: 'Місячний срібний сплав',
    desc: 'Кована під час повного місяця. Світлі, небесні, мерехтливі високі обертони.',
    icon: Moon,
    baseDecay: 18.0,
    fundamentalWeight: 0.95,
    overtoneWeight: 0.85,
    subharmonicWeight: 0.15,
    reverbSend: 0.40,
    partials: [
      { ratio: 1.0, gain: 0.95, decayMult: 1.0, beatDelta: 1.2 },
      { ratio: 2.762, gain: 0.75, decayMult: 0.72, beatDelta: 1.9 },
      { ratio: 5.124, gain: 0.48, decayMult: 0.52, beatDelta: 2.8 },
      { ratio: 8.140, gain: 0.25, decayMult: 0.35, beatDelta: 4.0 },
      { ratio: 0.51, gain: 0.14, decayMult: 0.80, beatDelta: 0.6 }
    ],
    getThemeForBowl: (bowlId, chakraColor) => ({
      outer: '#1e293b',
      bodyStart: '#94a3b8',
      bodyEnd: '#334155',
      rim: '#cbd5e1',
      rimHighlight: '#f1f5f9',
      innerGlow: `${chakraColor}30`,
      textColor: chakraColor
    })
  },
  keisu: {
    id: 'keisu',
    name: 'Храмовий дзвін Кейсу',
    subname: 'Темна японська храмова бронза',
    desc: 'Масивна чаша з глибоким контрабасовим резонансом і тривалим відлунням дзен-монастиря.',
    icon: Landmark,
    baseDecay: 22.0,
    fundamentalWeight: 1.15,
    overtoneWeight: 0.45,
    subharmonicWeight: 0.40,
    reverbSend: 0.42,
    partials: [
      { ratio: 1.0, gain: 1.1, decayMult: 1.0, beatDelta: 0.6 },
      { ratio: 2.580, gain: 0.45, decayMult: 0.60, beatDelta: 1.1 },
      { ratio: 4.620, gain: 0.22, decayMult: 0.38, beatDelta: 1.8 },
      { ratio: 0.50, gain: 0.40, decayMult: 0.95, beatDelta: 0.3 },
      { ratio: 0.25, gain: 0.18, decayMult: 0.90, beatDelta: 0.2 }
    ],
    getThemeForBowl: (bowlId, chakraColor) => ({
      outer: '#18181b',
      bodyStart: '#52525b',
      bodyEnd: '#09090b',
      rim: '#a1a1aa',
      rimHighlight: '#f4f4f5',
      innerGlow: `${chakraColor}25`,
      textColor: chakraColor
    })
  }
};

interface ContinuousSingingVoice {
  fundamentalOscA: OscillatorNode;
  fundamentalOscB: OscillatorNode;
  overtoneOscA: OscillatorNode;
  overtoneOscB: OscillatorNode;
  highOvertoneOsc: OscillatorNode;
  noiseFilter: BiquadFilterNode;
  noiseGain: GainNode;
  noiseSource: AudioBufferSourceNode;
  voiceGain: GainNode;
  targetGain: number;
  currentGain: number;
  energy: number;
  lastUpdated: number;
}

export const SingingBowlsTab: React.FC<SingingBowlsTabProps> = ({ onSwitchTab }) => {
  // Selected Bowl Material (Tibetan, Quartz, Full Moon, Keisu)
  const [selectedMaterial, setSelectedMaterial] = useState<BowlMaterial>('tibetan');

  // Master Pitch Settings (Default 432 Hz Verdi Tuning)
  const [basePitchHz, setBasePitchHz] = useState<number>(432);
  const [octaveShift, setOctaveShift] = useState<number>(0); // -1 (Bass), 0 (Standard), +1 (High)
  const [masterVolume, setMasterVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Active vibrating intensity per bowl id (0.0 to 1.0)
  const [vibratingBowls, setVibratingBowls] = useState<Record<string, number>>({});
  // Visual angle of pointer circling per bowl (for subtle rim highlight)
  const [rimAngles, setRimAngles] = useState<Record<string, number>>({});

  // Audio Context Ref & Master Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const reverbNodeRef = useRef<ConvolverNode | null>(null);
  const reverbGainRef = useRef<GainNode | null>(null);

  // Active continuous singing voices per bowl (for circular rim rubbing)
  const singingVoicesRef = useRef<Map<string, ContinuousSingingVoice>>(new Map());

  // Multi-pointer state tracking
  const pointerTrackerRef = useRef<
    Map<
      number,
      {
        bowlId: string;
        lastX: number;
        lastY: number;
        lastAngle: number;
        lastTime: number;
        panVal: number;
      }
    >
  >(new Map());

  // Animation frame ref for smooth singing gain interpolation & decay
  const animFrameRef = useRef<number>(0);

  const currentMaterialConfig = useMemo(() => {
    return MATERIALS_CATALOG[selectedMaterial];
  }, [selectedMaterial]);

  // Initialize Web Audio API with pristine acoustics
  const initAudioContext = useCallback(() => {
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;

    const ctx = new AudioContextClass({ latencyHint: 'interactive' });

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : masterVolume, ctx.currentTime);

    // Dynamic Limiter / Compressor for pristine sound without clipping
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-16, ctx.currentTime);
    compressor.knee.setValueAtTime(10, ctx.currentTime);
    compressor.ratio.setValueAtTime(6, ctx.currentTime);
    compressor.attack.setValueAtTime(0.003, ctx.currentTime);
    compressor.release.setValueAtTime(0.25, ctx.currentTime);

    // Create algorithmic velvet impulse response for deep monastery temple acoustics
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * 3.5; // 3.5s smooth warm reverb tail
    const impulse = ctx.createBuffer(2, length, sampleRate);
    const leftChannel = impulse.getChannelData(0);
    const rightChannel = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const decay = Math.exp(-i / (sampleRate * 1.2));
      leftChannel[i] = (Math.random() * 2 - 1) * decay;
      rightChannel[i] = (Math.random() * 2 - 1) * decay;
    }

    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;

    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(currentMaterialConfig.reverbSend, ctx.currentTime);

    const dryGain = ctx.createGain();
    dryGain.gain.setValueAtTime(0.85, ctx.currentTime);

    // Routing
    masterGain.connect(dryGain);
    masterGain.connect(convolver);
    convolver.connect(reverbGain);

    dryGain.connect(compressor);
    reverbGain.connect(compressor);
    compressor.connect(ctx.destination);

    audioCtxRef.current = ctx;
    masterGainRef.current = masterGain;
    reverbNodeRef.current = convolver;
    reverbGainRef.current = reverbGain;

    return ctx;
  }, [isMuted, masterVolume, currentMaterialConfig]);

  // Update reverb level when material changes
  useEffect(() => {
    if (audioCtxRef.current && reverbGainRef.current) {
      reverbGainRef.current.gain.setTargetAtTime(
        currentMaterialConfig.reverbSend,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [currentMaterialConfig]);

  // Handle master volume changes
  useEffect(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const now = audioCtxRef.current.currentTime;
    masterGainRef.current.gain.cancelScheduledValues(now);
    masterGainRef.current.gain.linearRampToValueAtTime(isMuted ? 0 : masterVolume, now + 0.05);
  }, [masterVolume, isMuted]);

  // Strike a bowl (Tap / Hit) - Volume scales purely with strike position (Center = Loud, Edge = Quiet)
  const strikeBowl = useCallback(
    (bowl: BowlData, velocity: number = 0.8, panValue: number = 0) => {
      const ctx = initAudioContext();
      if (!ctx || !masterGainRef.current) return;

      const now = ctx.currentTime;
      const octaveMultiplier = Math.pow(2, octaveShift);
      const fundamentalHz = basePitchHz * bowl.semitoneRatio * octaveMultiplier;

      // Position-based velocity curve
      const mappedVelocity = Math.max(0.18, Math.min(1.0, velocity));

      // Create Voice Nodes
      const voiceGain = ctx.createGain();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      if (panner) {
        panner.pan.setValueAtTime(panValue, now);
        voiceGain.connect(panner);
        panner.connect(masterGainRef.current);
      } else {
        voiceGain.connect(masterGainRef.current);
      }

      // 1. Initial acoustic strike impulse (soft felt/mallet click)
      const attackBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.04), ctx.sampleRate);
      const attackData = attackBuffer.getChannelData(0);
      for (let i = 0; i < attackData.length; i++) {
        attackData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.006));
      }
      const attackSource = ctx.createBufferSource();
      attackSource.buffer = attackBuffer;

      const attackFilter = ctx.createBiquadFilter();
      attackFilter.type = 'bandpass';
      attackFilter.frequency.setValueAtTime(fundamentalHz * 2.7, now);
      attackFilter.Q.setValueAtTime(3.0, now);

      const attackGain = ctx.createGain();
      attackGain.gain.setValueAtTime(mappedVelocity * 0.28, now);
      attackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      attackSource.connect(attackFilter);
      attackFilter.connect(attackGain);
      attackGain.connect(voiceGain);
      attackSource.start(now);

      // 2. Physical Inharmonic Modal Oscillators for the selected material
      const baseDecaySeconds = currentMaterialConfig.baseDecay;

      currentMaterialConfig.partials.forEach((partial) => {
        const modeFreq = fundamentalHz * partial.ratio;
        if (modeFreq > 18000 || modeFreq < 20) return;

        const partialGain = ctx.createGain();
        const partialAmp = partial.gain * mappedVelocity * currentMaterialConfig.fundamentalWeight;
        const decayTime = Math.max(1.5, baseDecaySeconds * partial.decayMult);

        // Amplitude Envelope with smooth exponential decay
        partialGain.gain.setValueAtTime(0.0001, now);
        partialGain.gain.exponentialRampToValueAtTime(Math.max(0.0005, partialAmp), now + 0.035);
        partialGain.gain.exponentialRampToValueAtTime(0.00001, now + decayTime);

        // Twin Oscillators for dual acoustic mode splitting / natural beating
        const oscA = ctx.createOscillator();
        const oscB = ctx.createOscillator();

        oscA.type = 'sine';
        oscB.type = 'sine';

        // Constant pure tuning
        oscA.frequency.setValueAtTime(modeFreq - partial.beatDelta * 0.5, now);
        oscB.frequency.setValueAtTime(modeFreq + partial.beatDelta * 0.5, now);

        oscA.connect(partialGain);
        oscB.connect(partialGain);
        partialGain.connect(voiceGain);

        oscA.start(now);
        oscB.start(now);

        oscA.stop(now + decayTime + 0.5);
        oscB.stop(now + decayTime + 0.5);
      });

      // Update UI Vibration state scaled by strike position velocity
      setVibratingBowls((prev) => ({
        ...prev,
        [bowl.id]: Math.min(1.0, mappedVelocity * 1.2)
      }));

      // Subtle haptic feedback on supported touch devices
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(Math.round(10 + mappedVelocity * 20));
        } catch {}
      }
    },
    [basePitchHz, octaveShift, currentMaterialConfig, initAudioContext]
  );

  // Continuous Singing (Circular Rubbing around the Rim)
  const getOrCreateSingingVoice = useCallback(
    (bowl: BowlData, panValue: number): ContinuousSingingVoice | null => {
      const ctx = initAudioContext();
      if (!ctx || !masterGainRef.current) return null;

      const existing = singingVoicesRef.current.get(bowl.id);
      if (existing) return existing;

      const now = ctx.currentTime;
      const octaveMultiplier = Math.pow(2, octaveShift);
      const fundamentalHz = basePitchHz * bowl.semitoneRatio * octaveMultiplier;

      // Master voice gain
      const voiceGain = ctx.createGain();
      voiceGain.gain.setValueAtTime(0.00001, now);

      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (panner) {
        panner.pan.setValueAtTime(panValue, now);
        voiceGain.connect(panner);
        panner.connect(masterGainRef.current);
      } else {
        voiceGain.connect(masterGainRef.current);
      }

      // 1. Fundamental Twin Oscillators (Constant pure tone at exact frequency)
      const fundamentalOscA = ctx.createOscillator();
      const fundamentalOscB = ctx.createOscillator();
      fundamentalOscA.type = 'sine';
      fundamentalOscB.type = 'sine';
      fundamentalOscA.frequency.setValueAtTime(fundamentalHz - 0.4, now);
      fundamentalOscB.frequency.setValueAtTime(fundamentalHz + 0.4, now);

      const fundamentalGain = ctx.createGain();
      fundamentalGain.gain.setValueAtTime(0.85 * currentMaterialConfig.fundamentalWeight, now);
      fundamentalOscA.connect(fundamentalGain);
      fundamentalOscB.connect(fundamentalGain);
      fundamentalGain.connect(voiceGain);

      // 2. Inharmonic Second Overtone (Mode 0,2 @ 2.714 f0)
      const overtoneOscA = ctx.createOscillator();
      const overtoneOscB = ctx.createOscillator();
      overtoneOscA.type = 'sine';
      overtoneOscB.type = 'sine';
      overtoneOscA.frequency.setValueAtTime(fundamentalHz * 2.714 - 0.9, now);
      overtoneOscB.frequency.setValueAtTime(fundamentalHz * 2.714 + 0.9, now);

      const overtoneGain = ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.35 * currentMaterialConfig.overtoneWeight, now);
      overtoneOscA.connect(overtoneGain);
      overtoneOscB.connect(overtoneGain);
      overtoneGain.connect(voiceGain);

      // 3. High Overtone (Mode 0,3 @ 4.952 f0)
      const highOvertoneOsc = ctx.createOscillator();
      highOvertoneOsc.type = 'sine';
      highOvertoneOsc.frequency.setValueAtTime(fundamentalHz * 4.952, now);

      const highOvertoneGain = ctx.createGain();
      highOvertoneGain.gain.setValueAtTime(0.12 * currentMaterialConfig.overtoneWeight, now);
      highOvertoneOsc.connect(highOvertoneGain);
      highOvertoneGain.connect(voiceGain);

      // 4. Subtle friction noise buffer (rim contact warmth)
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * 0.12;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(fundamentalHz * 2.714, now);
      noiseFilter.Q.setValueAtTime(3.5, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06, now);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(voiceGain);

      // Start all continuous nodes
      fundamentalOscA.start(now);
      fundamentalOscB.start(now);
      overtoneOscA.start(now);
      overtoneOscB.start(now);
      highOvertoneOsc.start(now);
      noiseSource.start(now);

      const voice: ContinuousSingingVoice = {
        fundamentalOscA,
        fundamentalOscB,
        overtoneOscA,
        overtoneOscB,
        highOvertoneOsc,
        noiseFilter,
        noiseGain,
        noiseSource,
        voiceGain,
        targetGain: 0.35,
        currentGain: 0.00001,
        energy: 0.85,
        lastUpdated: Date.now()
      };

      singingVoicesRef.current.set(bowl.id, voice);
      return voice;
    },
    [basePitchHz, octaveShift, currentMaterialConfig, initAudioContext]
  );

  // Update base frequencies when master pitch settings change
  useEffect(() => {
    if (!audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    const octaveMultiplier = Math.pow(2, octaveShift);

    BOWLS_SET.forEach((bowl) => {
      const voice = singingVoicesRef.current.get(bowl.id);
      if (voice) {
        const fundamentalHz = basePitchHz * bowl.semitoneRatio * octaveMultiplier;
        voice.fundamentalOscA.frequency.setTargetAtTime(fundamentalHz - 0.4, now, 0.05);
        voice.fundamentalOscB.frequency.setTargetAtTime(fundamentalHz + 0.4, now, 0.05);
        voice.overtoneOscA.frequency.setTargetAtTime(fundamentalHz * 2.714 - 0.9, now, 0.05);
        voice.overtoneOscB.frequency.setTargetAtTime(fundamentalHz * 2.714 + 0.9, now, 0.05);
        voice.highOvertoneOsc.frequency.setTargetAtTime(fundamentalHz * 4.952, now, 0.05);
        voice.noiseFilter.frequency.setTargetAtTime(fundamentalHz * 2.714, now, 0.05);
      }
    });
  }, [basePitchHz, octaveShift]);

  // Animation loop: Smooth resonance sustaining, soft restoration and natural decay over time
  useEffect(() => {
    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;
      const nowMs = Date.now();
      const ctx = audioCtxRef.current;

      singingVoicesRef.current.forEach((voice, bowlId) => {
        // Continuous energy dissipation during rotation (gradually gets quieter)
        voice.energy = Math.max(0.0001, voice.energy * 0.995);

        if (nowMs - voice.lastUpdated > 200) {
          voice.targetGain *= 0.94; // Decay faster when motion stops
        } else {
          // While actively rotating around the rim, sustain tone but respect decaying energy cap
          voice.targetGain = Math.min(voice.targetGain, voice.energy);
          voice.targetGain *= 0.997; // Smooth natural decay over time during rotation
        }

        const gainSmoothing = voice.targetGain > voice.currentGain ? 0.07 : 0.025;
        voice.currentGain += (voice.targetGain - voice.currentGain) * gainSmoothing;

        if (ctx && ctx.state !== 'closed') {
          const nowAudio = ctx.currentTime;
          const effectiveVoiceGain = Math.max(0.00001, voice.currentGain * 0.75);
          voice.voiceGain.gain.setValueAtTime(effectiveVoiceGain, nowAudio);
        }

        // Update UI vibration
        if (voice.currentGain > 0.008) {
          setVibratingBowls((prev) => ({
            ...prev,
            [bowlId]: Math.min(1.0, voice.currentGain * 1.3)
          }));
        }
      });

      // Gradually decay hit vibration states
      setVibratingBowls((prev) => {
        let hasChanges = false;
        const next: Record<string, number> = {};
        for (const [id, val] of Object.entries(prev)) {
          const singing = singingVoicesRef.current.get(id);
          const singingGain = singing ? singing.currentGain : 0;
          const decayed = Math.max(singingGain, val * 0.975);
          if (decayed > 0.005) {
            next[id] = decayed;
          }
          if (Math.abs(decayed - val) > 0.01) hasChanges = true;
        }
        return hasChanges ? next : prev;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Position-based volume dynamics:
  // Center strike = 100% full volume & deep fundamental resonance
  // Closer to rim/edge = progressively quieter down to ~28% volume
  const extractPositionVelocity = (e: React.PointerEvent<HTMLDivElement>): number => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.max(1, rect.width / 2);
    const normalizedDist = Math.min(1.0, dist / radius);

    // Smooth gradient: 1.0 (100% volume at center) down to 0.28 (28% volume at edge)
    const velocity = 1.0 - normalizedDist * 0.72;
    return Math.max(0.20, Math.min(1.0, velocity));
  };

  // Multi-Touch Pointer Event Handlers
  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    bowl: BowlData,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Capture pointer on this element for tracking outside bounds
    try {
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    } catch {}

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const angle = Math.atan2(dy, dx);
    const panVal = -0.75 + (index / (BOWLS_SET.length - 1)) * 1.5;

    // Calculate Strike Velocity based purely on hit position (center = loud, edge = quiet)
    const strikeVelocity = extractPositionVelocity(e);

    // 1. Initial Strike on tap with position-based volume & energy recharge
    strikeBowl(bowl, strikeVelocity, panVal);

    const existingVoice = singingVoicesRef.current.get(bowl.id);
    if (existingVoice) {
      existingVoice.energy = Math.min(0.85, existingVoice.energy + strikeVelocity * 0.5);
    }

    // 2. Track this pointer for circular rim rubbing & soft vibration sustaining
    pointerTrackerRef.current.set(e.pointerId, {
      bowlId: bowl.id,
      lastX: e.clientX,
      lastY: e.clientY,
      lastAngle: angle,
      lastTime: Date.now(),
      panVal
    });

    setRimAngles((prev) => ({
      ...prev,
      [bowl.id]: angle
    }));
  };

  const handlePointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
    bowl: BowlData,
    index: number
  ) => {
    const tracker = pointerTrackerRef.current.get(e.pointerId);
    if (!tracker || tracker.bowlId !== bowl.id) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = rect.width / 2;

    const angle = Math.atan2(dy, dx);
    const now = Date.now();

    // Compute smallest angular delta (-PI to +PI)
    let dTheta = angle - tracker.lastAngle;
    while (dTheta > Math.PI) dTheta -= 2 * Math.PI;
    while (dTheta < -Math.PI) dTheta += 2 * Math.PI;

    // Update angle tracker
    tracker.lastX = e.clientX;
    tracker.lastY = e.clientY;
    tracker.lastAngle = angle;
    tracker.lastTime = now;

    setRimAngles((prev) => ({
      ...prev,
      [bowl.id]: angle
    }));

    // If moving in circular motion around the rim: sustain tone but allow volume to naturally decay over time
    if (dist >= radius * 0.25 && dist <= radius * 1.4) {
      if (Math.abs(dTheta) > 0.008) {
        const voice = getOrCreateSingingVoice(bowl, tracker.panVal);
        if (voice) {
          voice.lastUpdated = now;
          const addGain = Math.abs(dTheta) * 0.06;
          // Target gain is sustained by movement, but bounded by decaying energy cap
          voice.targetGain = Math.min(voice.energy, voice.targetGain + addGain);
        }
      }
    }
  };

  const handlePointerUpOrCancel = (
    e: React.PointerEvent<HTMLDivElement>,
    bowl: BowlData
  ) => {
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {}

    pointerTrackerRef.current.delete(e.pointerId);
  };

  // Silence all active sounds
  const handleSilenceAll = () => {
    if (audioCtxRef.current && masterGainRef.current) {
      const now = audioCtxRef.current.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.linearRampToValueAtTime(0, now + 0.12);

      setTimeout(() => {
        if (masterGainRef.current && audioCtxRef.current) {
          masterGainRef.current.gain.linearRampToValueAtTime(
            isMuted ? 0 : masterVolume,
            audioCtxRef.current.currentTime + 0.05
          );
        }
      }, 160);
    }

    singingVoicesRef.current.forEach((voice) => {
      voice.targetGain = 0;
      voice.currentGain = 0;
    });

    setVibratingBowls({});
  };

  // Switch Material Handler
  const handleSelectMaterial = (mat: BowlMaterial) => {
    handleSilenceAll();
    setSelectedMaterial(mat);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-[600px] max-w-lg mx-auto w-full select-none text-left animate-fadeIn pb-6 touch-none">
      {/* 1. Top Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          {onSwitchTab && (
            <button
              type="button"
              onClick={() => onSwitchTab('counter')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer"
              title="Назад"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wider">
              Співочі чаші
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
              {currentMaterialConfig.name} • Сакральне півколо
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleSilenceAll}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-750 transition-colors cursor-pointer"
            title="Приглушити всі чаші"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsMuted((m) => !m)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isMuted
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-500'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-750'
            }`}
            title={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setShowSettings((s) => !s)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              showSettings
                ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent font-bold'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-750'
            }`}
            title="Налаштування строю та частоти"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Material Selector Responsive Grid */}
      <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {(Object.keys(MATERIALS_CATALOG) as BowlMaterial[]).map((matKey) => {
          const mat = MATERIALS_CATALOG[matKey];
          const IconComp = mat.icon;
          const isSelected = selectedMaterial === matKey;

          return (
            <button
              key={matKey}
              type="button"
              onClick={() => handleSelectMaterial(matKey)}
              className={`py-2 px-2.5 rounded-2xl border transition-all text-left flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs font-bold'
                  : 'bg-slate-100/80 hover:bg-slate-200/80 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200/60 dark:border-zinc-800'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-xl flex items-center justify-center flex-none ${
                  isSelected
                    ? 'bg-white/20 dark:bg-black/10 text-white dark:text-zinc-900'
                    : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] leading-tight font-bold">{mat.name}</div>
                <div className="truncate text-[9px] opacity-70 leading-tight hidden xs:block">{mat.subname}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Frequency & Settings Panel (Expandable) */}
      {showSettings && (
        <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 space-y-3.5 animate-fadeIn">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-500" />
                <span>Базова опорна частота (A4):</span>
              </span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {basePitchHz} Гц
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={415}
              max={448}
              step={1}
              value={basePitchHz}
              onChange={(e) => setBasePitchHz(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
            />
          </div>

          {/* Presets */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5 text-[11px]">
            <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-medium mr-1">
              Пресет:
            </span>
            {[
              { label: '432 Гц (Природний / Верді)', hz: 432 },
              { label: '440 Гц (Концертний)', hz: 440 },
              { label: '528 Гц (Сольфеджіо)', hz: 528 },
              { label: '417 Гц (Регенерація)', hz: 417 }
            ].map((p) => (
              <button
                key={p.hz}
                type="button"
                onClick={() => setBasePitchHz(p.hz)}
                className={`px-2.5 py-1 rounded-lg border text-[10px] font-semibold transition-colors cursor-pointer ${
                  basePitchHz === p.hz
                    ? 'bg-indigo-600 text-white dark:bg-indigo-500 border-transparent'
                    : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-750'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Octave Range Switch */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-zinc-800/80 text-xs">
            <span className="font-bold text-slate-700 dark:text-zinc-300">
              Октавний діапазон:
            </span>
            <div className="flex items-center gap-1">
              {[
                { shift: -1, label: 'Глибокий бас' },
                { shift: 0, label: 'Класичний' },
                { shift: 1, label: 'Високий дзвін' }
              ].map((oct) => (
                <button
                  key={oct.shift}
                  type="button"
                  onClick={() => setOctaveShift(oct.shift)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                    octaveShift === oct.shift
                      ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent'
                      : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700'
                  }`}
                >
                  {oct.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. The Authentic Semi-Circle (Півколо) Ensemble Area */}
      <div className="mt-2 flex-1 flex flex-col justify-center items-center py-2 px-1">
        <div className="relative w-full max-w-[480px] h-[370px] sm:h-[410px] mx-auto select-none">
          {/* Subtle Zen Semi-Circle Guide Arc */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-25" viewBox="0 0 480 380">
            <path
              d="M 34.6 232.5 A 210 210 0 0 1 445.4 232.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              className="text-slate-400 dark:text-zinc-600"
            />
          </svg>

          {/* Central Sacred Aura Point */}
          <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center space-y-1 opacity-60 dark:opacity-50">
            <div className="w-12 h-12 rounded-full border border-dashed border-slate-400 dark:border-zinc-600 flex items-center justify-center mx-auto">
              <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-zinc-500" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-mono text-slate-400 dark:text-zinc-500 font-bold block">
              Дзен-простір
            </span>
          </div>

          {/* 7 Bowls Arranged in Semi-Circle with Separate Non-Overlapping Hitboxes */}
          {BOWLS_SET.map((bowl, index) => {
            const vibrationLevel = vibratingBowls[bowl.id] || 0;
            const isVibrating = vibrationLevel > 0.08;
            const octaveMult = Math.pow(2, octaveShift);
            
            // Standard authentic constant frequency for this bowl
            const exactHz = Math.round(basePitchHz * bowl.semitoneRatio * octaveMult);

            // Get Theme for this Bowl with selected material
            const bowlTheme = currentMaterialConfig.getThemeForBowl(bowl.id, bowl.chakraAccent);

            // Scale diameter proportionally (60px to 78px for generous spacing)
            const sizePx = Math.round(72 * bowl.diameterRatio);
            const rimAngle = rimAngles[bowl.id] || 0;

            return (
              <div
                key={bowl.id}
                style={{
                  left: `${bowl.arcPosition.leftPercent}%`,
                  top: `${bowl.arcPosition.topPercent}%`,
                  transform: 'translate(-50%, -50%)',
                  touchAction: 'none'
                }}
                className="absolute flex flex-col items-center gap-1 group touch-none z-10 pointer-events-none"
              >
                {/* Clean Rounded Bowl Surface (Interactive Click Target) */}
                <div
                  style={{
                    width: `${sizePx}px`,
                    height: `${sizePx}px`,
                    transform: isVibrating ? `scale(${1 + vibrationLevel * 0.04})` : 'scale(1)',
                    transition: 'transform 0.08s ease-out, box-shadow 0.2s ease-out',
                    touchAction: 'none'
                  }}
                  className="relative rounded-full flex items-center justify-center select-none active:scale-95 shadow-md hover:shadow-lg transition-transform touch-none cursor-pointer pointer-events-auto"
                  onPointerDown={(e) => handlePointerDown(e, bowl, index)}
                  onPointerMove={(e) => handlePointerMove(e, bowl, index)}
                  onPointerUp={(e) => handlePointerUpOrCancel(e, bowl)}
                  onPointerCancel={(e) => handlePointerUpOrCancel(e, bowl)}
                >
                  {/* Outer Bowl Body Rim Gradient */}
                  <div
                    className="absolute inset-0 rounded-full border border-black/25 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${bowlTheme.bodyStart} 0%, ${bowlTheme.bodyEnd} 75%, ${bowlTheme.outer} 100%)`,
                      boxShadow: isVibrating
                        ? `inset 0 2px 6px rgba(255,255,255,0.45), inset 0 -4px 10px rgba(0,0,0,0.65), 0 0 ${Math.round(12 + vibrationLevel * 16)}px ${bowlTheme.textColor}${Math.round(30 + vibrationLevel * 50)}`
                        : 'inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -4px 8px rgba(0,0,0,0.5)'
                    }}
                  />

                  {/* Concentric Rim Ring Highlight */}
                  <div
                    className="absolute inset-1.5 rounded-full border pointer-events-none"
                    style={{
                      borderColor: bowlTheme.rim,
                      opacity: 0.85
                    }}
                  />

                  {/* Subtle Circular Rubbing Rim Point / Reflection */}
                  {vibrationLevel > 0.1 && (
                    <div
                      className="absolute w-3 h-3 rounded-full pointer-events-none opacity-85 blur-[1px]"
                      style={{
                        background: bowlTheme.rimHighlight,
                        left: `calc(50% + ${Math.cos(rimAngle) * (sizePx / 2 - 7)}px - 6px)`,
                        top: `calc(50% + ${Math.sin(rimAngle) * (sizePx / 2 - 7)}px - 6px)`
                      }}
                    />
                  )}

                  {/* Inner Metallic Acoustic Cavity */}
                  <div
                    className="absolute inset-2.5 rounded-full flex items-center justify-center pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${bowlTheme.bodyEnd} 0%, ${bowlTheme.outer} 100%)`,
                      boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.7)'
                    }}
                  >
                    {/* Concentric Center Bottom */}
                    <div
                      className="w-4 h-4 rounded-full border border-black/30 flex items-center justify-center"
                      style={{
                        background: bowlTheme.rimHighlight,
                        opacity: 0.85
                      }}
                    >
                      <span className="text-[9px] font-black text-zinc-950 font-mono">
                        {bowl.note}
                      </span>
                    </div>
                  </div>

                  {/* Soft Concentric Vibration Ripple */}
                  {isVibrating && (
                    <div
                      className="absolute inset-0 rounded-full border pointer-events-none"
                      style={{
                        borderColor: bowlTheme.rimHighlight,
                        opacity: vibrationLevel * 0.45,
                        animation: 'ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite'
                      }}
                    />
                  )}
                </div>

                {/* Bowl Label: Chakra & Constant Pure Frequency */}
                <div className="text-center space-y-0.5 pointer-events-none select-none">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-zinc-200">
                      {bowl.chakraUk}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 dark:text-zinc-400 font-semibold">
                    {exactHz} Гц
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
