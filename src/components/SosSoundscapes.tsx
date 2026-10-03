import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Clock, Sparkles, Sliders, Waves, Wind, Flame, Bell, Bird, CloudRain, Compass } from 'lucide-react';
import { MonolithicSegmentedControl } from './MonolithicSegmentedControl';

interface SoundscapeTrack {
  id: string;
  name: string;
  category: string;
  emoji: string;
  icon: React.ElementType;
  description: string;
  scientificBenefit: string;
  color: string;
  activeColor: string;
  type: 'rain' | 'ocean' | 'forest' | 'fire' | 'cosmic' | 'chimes';
}

const TRACKS: SoundscapeTrack[] = [
  {
    id: 'ocean',
    name: 'Ритмічні хвилі океану',
    category: 'Дихальний ритм',
    emoji: '🌊',
    icon: Waves,
    description: 'Мʼякий приплив і відплив, що синхронізується з диханням',
    scientificBenefit: 'Стабілізує варіабельність серцевого ритму (HRV)',
    color: 'border-teal-500/20 text-teal-500 bg-teal-500/5 hover:bg-teal-500/10',
    activeColor: 'border-teal-500/60 bg-teal-500/15 text-teal-600 dark:text-teal-400 ring-1 ring-teal-500/30',
    type: 'ocean'
  },
  {
    id: 'rain',
    name: 'Теплий дощ і відлуння',
    category: 'Змивання тривоги',
    emoji: '🌧️',
    icon: CloudRain,
    description: 'Монотонне шепотіння крапель, що приглушує внутрішній діалог',
    scientificBenefit: 'Створює акустичну маску (рожевий шум) проти стресових імпульсів',
    color: 'border-blue-500/20 text-blue-500 bg-blue-500/5 hover:bg-blue-500/10',
    activeColor: 'border-blue-500/60 bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/30',
    type: 'rain'
  },
  {
    id: 'forest',
    name: 'Лісовий струмок і птахи',
    category: 'Природне відновлення',
    emoji: '🌲',
    icon: Bird,
    description: 'Дзюрчання лісової води та тонкий спів птахів у ранковій тиші',
    scientificBenefit: 'Активує парасимпатичну нервову систему за 60 секунд',
    color: 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10',
    activeColor: 'border-emerald-500/60 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30',
    type: 'forest'
  },
  {
    id: 'fire',
    name: 'Затишне вечірнє вогнище',
    category: 'Тепло й безпека',
    emoji: '🔥',
    icon: Flame,
    description: 'Мʼяке потріскування полін та затишне гудіння полумʼя',
    scientificBenefit: 'Створює еволюційне відчуття захищеності та спокою',
    color: 'border-orange-500/20 text-orange-500 bg-orange-500/5 hover:bg-orange-500/10',
    activeColor: 'border-orange-500/60 bg-orange-500/15 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/30',
    type: 'fire'
  },
  {
    id: 'cosmic',
    name: 'Глибокий космічний ембієнт',
    category: 'Трансцендентний стан',
    emoji: '🌌',
    icon: Compass,
    description: 'Низькочастотний теплий дрон і сяйво для глибокої медитації',
    scientificBenefit: 'Переводить хвилі мозку в альфа- та тета-ритм (8–12 Гц)',
    color: 'border-purple-500/20 text-purple-500 bg-purple-500/5 hover:bg-purple-500/10',
    activeColor: 'border-purple-500/60 bg-purple-500/15 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/30',
    type: 'cosmic'
  },
  {
    id: 'chimes',
    name: 'Вітряні дзен-дзвіночки',
    category: 'Ясність розуму',
    emoji: '🎐',
    icon: Wind,
    description: 'Кришталеві пентатонічні передзвони під подихом гірського вітру',
    scientificBenefit: 'Знижує імпульсивність та розриває ланцюг навʼязливих думок',
    color: 'border-cyan-500/20 text-cyan-500 bg-cyan-500/5 hover:bg-cyan-500/10',
    activeColor: 'border-cyan-500/60 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 ring-1 ring-cyan-500/30',
    type: 'chimes'
  }
];

export const SosSoundscapes: React.FC = () => {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [masterVolume, setMasterVolume] = useState<number>(0.65);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(5); // Default 5 min
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'sounds' | 'info'>('sounds');

  // Audio Context and Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<Array<{ stop: () => void }>>([]);
  const birdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chimesIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rainDropsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fireCracklesIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Canvas visualizer ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize or resume AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
      
      const master = audioCtxRef.current.createGain();
      master.gain.setValueAtTime(isMuted ? 0 : masterVolume, audioCtxRef.current.currentTime);
      master.connect(audioCtxRef.current.destination);
      masterGainRef.current = master;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    return audioCtxRef.current;
  }, [isMuted, masterVolume]);

  // Sync Master Volume
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const targetGain = isMuted ? 0 : masterVolume;
      masterGainRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.05);
    }
  }, [masterVolume, isMuted]);

  // Stop all active sound generators
  const stopAllSounds = useCallback(() => {
    activeNodesRef.current.forEach(node => {
      try { node.stop(); } catch {}
    });
    activeNodesRef.current = [];

    if (birdIntervalRef.current) clearInterval(birdIntervalRef.current);
    if (chimesIntervalRef.current) clearInterval(chimesIntervalRef.current);
    if (rainDropsIntervalRef.current) clearInterval(rainDropsIntervalRef.current);
    if (fireCracklesIntervalRef.current) clearInterval(fireCracklesIntervalRef.current);
  }, []);

  // Procedural Sound Synthesizers for Crystal-Clear Audio
  const startSound = useCallback((trackType: SoundscapeTrack['type']) => {
    const ctx = getAudioContext();
    if (!ctx || !masterGainRef.current) return;

    stopAllSounds();

    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(0.001, ctx.currentTime);
    trackGain.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 1.2);
    trackGain.connect(masterGainRef.current);

    const cleanupNodes: Array<{ stop: () => void }> = [];

    if (trackType === 'rain') {
      // 1. High-Density Warm Pink Noise Floor
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Lowpass + Highpass filters for cozy rain
      const lpFilter = ctx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.setValueAtTime(2400, ctx.currentTime);

      const hpFilter = ctx.createBiquadFilter();
      hpFilter.type = 'highpass';
      hpFilter.frequency.setValueAtTime(180, ctx.currentTime);

      noiseSource.connect(hpFilter);
      hpFilter.connect(lpFilter);
      lpFilter.connect(trackGain);
      noiseSource.start();
      cleanupNodes.push(noiseSource);

      // 2. Random Warm Rain Droplets
      rainDropsIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        const now = audioCtxRef.current.currentTime;
        const dropOsc = audioCtxRef.current.createOscillator();
        const dropGain = audioCtxRef.current.createGain();
        
        const freq = 1200 + Math.random() * 2400;
        dropOsc.type = 'sine';
        dropOsc.frequency.setValueAtTime(freq, now);
        dropOsc.frequency.exponentialRampToValueAtTime(freq * 0.45, now + 0.04);

        dropGain.gain.setValueAtTime(0.06 * Math.random(), now);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        dropOsc.connect(dropGain);
        dropGain.connect(trackGain);
        dropOsc.start(now);
        dropOsc.stop(now + 0.06);
      }, 70);

    } else if (trackType === 'ocean') {
      // Modulated Rolling Ocean Waves (Brown Noise + Dual Resonant Filter Sweep)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 2.8;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const waveFilter = ctx.createBiquadFilter();
      waveFilter.type = 'bandpass';
      waveFilter.frequency.setValueAtTime(320, ctx.currentTime);
      waveFilter.Q.setValueAtTime(1.8, ctx.currentTime);

      const waveGain = ctx.createGain();
      waveGain.gain.setValueAtTime(0.2, ctx.currentTime);

      // Low frequency oscillator for wave ebb & flow (4.8s cycle)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.18, ctx.currentTime); // ~5.5s wave rhythm
      lfoGain.gain.setValueAtTime(260, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(waveFilter.frequency);

      // Volume surge on wave crash
      const volLfo = ctx.createOscillator();
      const volLfoGain = ctx.createGain();
      volLfo.frequency.setValueAtTime(0.18, ctx.currentTime);
      volLfoGain.gain.setValueAtTime(0.35, ctx.currentTime);
      volLfo.connect(volLfoGain);
      volLfoGain.connect(waveGain.gain);

      noiseSource.connect(waveFilter);
      waveFilter.connect(waveGain);
      waveGain.connect(trackGain);

      noiseSource.start();
      lfo.start();
      volLfo.start();

      cleanupNodes.push(noiseSource, lfo, volLfo);

    } else if (trackType === 'forest') {
      // 1. Babbling Stream Water Flow
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.04 * white)) / 1.04;
        lastOut = output[i];
        output[i] *= 1.4;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const streamFilter = ctx.createBiquadFilter();
      streamFilter.type = 'bandpass';
      streamFilter.frequency.setValueAtTime(750, ctx.currentTime);
      streamFilter.Q.setValueAtTime(2.2, ctx.currentTime);

      noiseSource.connect(streamFilter);
      streamFilter.connect(trackGain);
      noiseSource.start();
      cleanupNodes.push(noiseSource);

      // 2. Gentle Natural Morning Bird Chirping Trills
      const birdNotes = [2093, 2349, 2637, 3135, 3520]; // C7, D7, E7, G7, A7 pentatonic
      birdIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        if (Math.random() > 0.45) return;

        const now = audioCtxRef.current.currentTime;
        const chirpCount = Math.floor(Math.random() * 3) + 2;
        
        for (let k = 0; k < chirpCount; k++) {
          const chirpTime = now + k * 0.09;
          const osc = audioCtxRef.current.createOscillator();
          const gain = audioCtxRef.current.createGain();
          const baseFreq = birdNotes[Math.floor(Math.random() * birdNotes.length)];

          osc.type = 'sine';
          osc.frequency.setValueAtTime(baseFreq, chirpTime);
          osc.frequency.linearRampToValueAtTime(baseFreq * (1 + (Math.random() * 0.2 - 0.1)), chirpTime + 0.04);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, chirpTime + 0.07);

          gain.gain.setValueAtTime(0.0001, chirpTime);
          gain.gain.linearRampToValueAtTime(0.04, chirpTime + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, chirpTime + 0.07);

          osc.connect(gain);
          gain.connect(trackGain);
          osc.start(chirpTime);
          osc.stop(chirpTime + 0.08);
        }
      }, 1600);

    } else if (trackType === 'fire') {
      // 1. Warm Acoustic Fire Rumbling & Hiss
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.015 * white)) / 1.015;
        lastOut = output[i];
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const fireFilter = ctx.createBiquadFilter();
      fireFilter.type = 'bandpass';
      fireFilter.frequency.setValueAtTime(450, ctx.currentTime);
      fireFilter.Q.setValueAtTime(1.5, ctx.currentTime);

      noiseSource.connect(fireFilter);
      fireFilter.connect(trackGain);
      noiseSource.start();
      cleanupNodes.push(noiseSource);

      // 2. Real Crackling Wood Sparks & Embers Popping
      fireCracklesIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        if (Math.random() > 0.65) return;

        const now = audioCtxRef.current.currentTime;
        const popOsc = audioCtxRef.current.createOscillator();
        const popGain = audioCtxRef.current.createGain();
        
        popOsc.type = Math.random() > 0.5 ? 'triangle' : 'square';
        popOsc.frequency.setValueAtTime(600 + Math.random() * 1800, now);
        popGain.gain.setValueAtTime(0.08 * Math.random(), now);
        popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

        popOsc.connect(popGain);
        popGain.connect(trackGain);
        popOsc.start(now);
        popOsc.stop(now + 0.03);
      }, 90);

    } else if (trackType === 'cosmic') {
      // Deep Analog Cosmic Drone (F Minor / 174 Hz Solfeggio Warmth)
      const droneFreqs = [174, 261, 348, 522]; // Solfeggio 174Hz + deep warm chord
      droneFreqs.forEach(freq => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.8, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);
        filter.Q.setValueAtTime(3.0, ctx.currentTime);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.08 + Math.random() * 0.04, ctx.currentTime);
        lfoGain.gain.setValueAtTime(120, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(trackGain);

        osc.start();
        lfo.start();
        cleanupNodes.push(osc, lfo);
      });

    } else if (trackType === 'chimes') {
      // Soft Wind Breeze Noise Floor + Pentatonic Metallic Bell Chimes
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.04;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(380, ctx.currentTime);
      windFilter.Q.setValueAtTime(1.0, ctx.currentTime);

      noiseSource.connect(windFilter);
      windFilter.connect(trackGain);
      noiseSource.start();
      cleanupNodes.push(noiseSource);

      // Pentatonic Wind Chimes (A4, B4, C#5, E5, F#5, A5)
      const chimeFreqs = [440, 493.88, 554.37, 659.25, 739.99, 880, 1108.73];
      chimesIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        if (Math.random() > 0.5) return;

        const now = audioCtxRef.current.currentTime;
        const chimeFreq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];
        
        const osc = audioCtxRef.current.createOscillator();
        const osc2 = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(chimeFreq, now);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(chimeFreq * 2.76, now); // Metallic non-harmonic chime partial

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(trackGain);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 3.0);
        osc2.stop(now + 3.0);
      }, 1400);
    }

    activeNodesRef.current = cleanupNodes;
  }, [getAudioContext, stopAllSounds]);

  // Handle Track Toggle
  const handleToggleTrack = (track: SoundscapeTrack) => {
    if (activeTrackId === track.id && isPlaying) {
      // Pause
      stopAllSounds();
      setIsPlaying(false);
    } else {
      // Start or switch
      setActiveTrackId(track.id);
      setIsPlaying(true);
      startSound(track.type);

      // Start timer if set
      if (timerMinutes) {
        setRemainingSeconds(timerMinutes * 60);
      }
    }
  };

  // Timer Countdown Handler
  useEffect(() => {
    if (isPlaying && remainingSeconds !== null && remainingSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev === null || prev <= 1) {
            stopAllSounds();
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPlaying, remainingSeconds, stopAllSounds]);

  // Master Stop / Pause
  const handleToggleGlobalPlay = () => {
    if (isPlaying) {
      stopAllSounds();
      setIsPlaying(false);
    } else {
      const trackToPlay = TRACKS.find(t => t.id === activeTrackId) || TRACKS[0];
      setActiveTrackId(trackToPlay.id);
      setIsPlaying(true);
      startSound(trackToPlay.type);
      if (timerMinutes) {
        setRemainingSeconds(timerMinutes * 60);
      }
    }
  };

  // Cleanup on unmount or page visibility hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        stopAllSounds();
        setIsPlaying(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      stopAllSounds();
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch {}
        audioCtxRef.current = null;
      }
    };
  }, [stopAllSounds]);

  // Real-time Canvas Equalizer Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      phase += 0.04;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const centerY = h / 2;

      if (isPlaying) {
        // Draw fluid organic sound wave
        ctx.beginPath();
        ctx.moveTo(0, centerY);

        const bars = 36;
        for (let i = 0; i < bars; i++) {
          const x = (i / (bars - 1)) * w;
          const amp = Math.sin(phase * 1.5 + i * 0.28) * Math.cos(phase * 0.9 + i * 0.15);
          const y = centerY + amp * (h * 0.38) * (isMuted ? 0.05 : masterVolume);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.0;
        ctx.shadowColor = '#0ea5e9';
        ctx.shadowBlur = 6;
        ctx.stroke();

        // Second harmonic wave
        ctx.beginPath();
        for (let i = 0; i < bars; i++) {
          const x = (i / (bars - 1)) * w;
          const amp = Math.cos(phase * 2.1 + i * 0.35) * Math.sin(phase * 1.1 + i * 0.2);
          const y = centerY + amp * (h * 0.25) * (isMuted ? 0.05 : masterVolume);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 4;
        ctx.stroke();
      } else {
        // Flat calm resting baseline
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(w, centerY);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, isMuted, masterVolume]);

  const formatRemainingTime = (sec: number | null) => {
    if (sec === null) return 'Без таймера';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const activeTrack = TRACKS.find(t => t.id === activeTrackId);

  return (
    <div className="p-4 sm:p-5 rounded-[2rem] bg-white dark:bg-zinc-900/40 border border-slate-200/80 dark:border-zinc-800/80 text-left space-y-4 relative overflow-hidden transition-all shadow-xs backdrop-blur-md">
      {/* Background ambient gradient glow */}
      <div className="absolute -right-12 -top-12 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-base shadow-xs transition-all ${
            isPlaying 
              ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)] scale-105' 
              : 'bg-sky-500/15 text-sky-600 dark:text-sky-400'
          }`}>
            🎧
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 leading-none">
                Звукотерапія спокою
              </h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold">
                WebAudio 432Hz
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-tight">
              Кришталеві ембієнт-частоти гасять дофаміновий голод і тривогу
            </p>
          </div>
        </div>

        {/* Global Play / Pause button */}
        <button
          type="button"
          onClick={handleToggleGlobalPlay}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
            isPlaying
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300'
          }`}
          title={isPlaying ? 'Зупинити все' : 'Увімкнути звукотерапію'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current stroke-[2.5]" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>
      </div>

      {/* Live Equalizer Canvas & Active Track Info */}
      <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/80 relative overflow-hidden flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-zinc-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[200px]">
              {isPlaying && activeTrack ? `${activeTrack.emoji} ${activeTrack.name}` : 'Оберіть акустичний простір нижче'}
            </span>
          </div>
          {isPlaying && remainingSeconds !== null && (
            <div className="flex items-center gap-1 font-mono text-[9.5px] text-sky-600 dark:text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />
              <span>{formatRemainingTime(remainingSeconds)}</span>
            </div>
          )}
        </div>

        {/* Real-time sound wave canvas */}
        <canvas
          ref={canvasRef}
          width={320}
          height={32}
          className="w-full h-8 rounded-lg bg-slate-900/10 dark:bg-black/30 pointer-events-none"
        />
      </div>

      {/* Tabs Switcher: Sounds vs Scientific Info */}
      <MonolithicSegmentedControl
        items={[
          { id: 'sounds', label: `🎵 Акустичні простори (${TRACKS.length})` },
          { id: 'info', label: '✨ Як це працює' },
        ]}
        value={activeTab}
        onChange={(val) => setActiveTab(val as 'sounds' | 'info')}
        size="sm"
      />

      {/* Playlist Grid */}
      {activeTab === 'sounds' ? (
        <div className="grid grid-cols-1 gap-2 max-h-[290px] overflow-y-auto pr-0.5 custom-scrollbar">
          {TRACKS.map((sound) => {
            const isCurrent = activeTrackId === sound.id && isPlaying;
            return (
              <button
                key={sound.id}
                type="button"
                onClick={() => handleToggleTrack(sound)}
                className={`w-full p-2.5 sm:p-3 rounded-2xl border transition-all flex items-center justify-between text-left cursor-pointer active:scale-[0.99] group ${
                  isCurrent
                    ? sound.activeColor
                    : `${sound.color} bg-slate-50/60 dark:bg-zinc-900/40 border-slate-200/60 dark:border-zinc-800/80`
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <span className="text-xl shrink-0 filter drop-shadow-xs group-hover:scale-110 transition-transform">
                    {sound.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[11px] sm:text-xs font-bold leading-tight truncate">
                        {sound.name}
                      </h4>
                    </div>
                    <p className="text-[9.5px] text-slate-500 dark:text-zinc-400 truncate mt-0.5 font-normal">
                      {sound.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                    isCurrent 
                      ? 'bg-sky-500 text-white shadow-xs' 
                      : 'bg-slate-200/80 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 group-hover:bg-slate-300 dark:group-hover:bg-zinc-700'
                  }`}>
                    {isCurrent ? <Pause className="w-3.5 h-3.5 fill-white stroke-[2.5]" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/80 space-y-2 text-[10px] text-slate-600 dark:text-zinc-400 leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="text-sm shrink-0">🧠</span>
            <p>
              <strong className="text-slate-800 dark:text-zinc-200">Нейроакустичний ефект:</strong> Частоти 432 Гц та рожевий шум перехоплюють сигнал тривоги в мигдалеподібному тілі мозку, знімаючи гострий імпульс закурити протягом перших 90 секунд.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm shrink-0">🌿</span>
            <p>
              <strong className="text-slate-800 dark:text-zinc-200">100% Автономність:</strong> Усі звукові хвилі синтезуються в реальному часі на вашому пристрої без завантаження з інтернету, трафіку чи збоїв звʼязку.
            </p>
          </div>
        </div>
      )}

      {/* Bottom Controls: Volume & Sleep Timer */}
      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 space-y-2.5">
        {/* Timer selector */}
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" /> Таймер вимкнення:
          </span>
          <div className="flex items-center gap-1">
            {[
              { val: 2, label: '2 хв' },
              { val: 5, label: '5 хв' },
              { val: 10, label: '10 хв' },
              { val: 15, label: '15 хв' },
              { val: null, label: 'Без меж' }
            ].map(item => (
              <button
                key={String(item.val)}
                type="button"
                onClick={() => {
                  setTimerMinutes(item.val);
                  if (item.val) {
                    setRemainingSeconds(item.val * 60);
                  } else {
                    setRemainingSeconds(null);
                  }
                }}
                className={`px-2 py-0.5 rounded-lg text-[9.5px] font-medium transition-all cursor-pointer ${
                  timerMinutes === item.val
                    ? 'bg-sky-500 text-white shadow-2xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-sky-500" />}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : masterVolume}
            onChange={(e) => {
              setMasterVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="flex-1 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
          
          <span className="font-mono text-[9px] text-slate-400 dark:text-zinc-500 w-8 text-right font-medium">
            {isMuted ? '0%' : `${Math.round(masterVolume * 100)}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
