import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CardErrorBoundary } from './CardErrorBoundary';
import { LivingGlitterVisual, LivingGlitterVisual as EnergyClotVisual } from './LivingGlitterVisual';
import { LivingFireVisual, hslToRgb } from './LivingFireVisual';
import { LivingAutumnVisual } from './LivingAutumnVisual';
import { LivingSnowflakeVisual } from './LivingSnowflakeVisual';
import { LivingFlowerVisual } from './LivingFlowerVisual';
import { LivingWaveVisual } from './LivingWaveVisual';
import { LivingBlackCatVisual } from './LivingBlackCatVisual';
import { RealConstellation } from './RealConstellations';
import { 
  X, Sliders, Palette, Sparkles, Edit3, Telescope, Lightbulb, Snowflake, Flower, Flower2, Sun, Moon, Waves,
  Smile, Atom, Leaf, Compass, Eye, Coffee, MessageSquare, Plus, Minus, Zap, BarChart2, Layers, Clock, Type,
  Feather, Heart, Smartphone, SlidersHorizontal, CircleDot, Cat
} from 'lucide-react';
import { ShatteredDialogueText } from './ShatteredDialogueText';
const SparklerThoughtCanvas: React.FC<{
  active?: boolean;
  originCoords?: { x: number; y: number } | null;
  originXPercent?: number;
  originYPercent?: number;
  mode?: string;
}> = () => null;

const RefractedCategoryIcon: React.FC<{ category?: string; className?: string }> = ({ category, className }) => {
  switch (category) {
    case 'health_advice': return <Heart className={className} />;
    case 'app_guide': return <Sparkles className={className} />;
    case 'science': return <Atom className={className} />;
    case 'nature_wildlife':
    case 'nature': return <Leaf className={className} />;
    case 'subtle_mundane':
    case 'mundane': return <Compass className={className} />;
    case 'poetic': return <Feather className={className} />;
    case 'absurd': return <Zap className={className} />;
    case 'jokes':
    case 'humor': return <Smile className={className} />;
    case 'hidden_coziness':
    case 'unobvious': return <Coffee className={className} />;
    default: return <Sparkles className={className} />;
  }
};
import { AnimatedAnalyzerIcon } from './AnimatedAnalyzerIcon';
import { QuickHourlySliceModal } from './QuickHourlySliceModal';
import { DailyLungTestModal } from './DailyLungTestModal';
import {
  SENTIENT_ANALYZER_THOUGHTS,
  SentientRandomThought,
  ThoughtCategory,
  THOUGHT_CATEGORIES_METADATA,
  getNextSequentialThought,
} from '../data/analyzerThoughts';
import { QuickMechanicsDrawer, QuickMechanicsSection } from './QuickMechanicsDrawer';
import {
  loadAnalyzerDialogueSettings,
  loadDialoguePhrases,
  AnalyzerDialogueSettings,
  DialoguePhrasesMap,
  DialogueOptionConfig,
  DialogueActionType,
  getAllAnalyzerActions,
  DEFAULT_DIALOGUE_SETTINGS,
  DEFAULT_DIALOGUE_PHRASES
} from './AnalyzerDialogueSettingsTypes';
import { AnalyzerDialogueSettingsSection } from './AnalyzerDialogueSettingsSection';

export { SENTIENT_ANALYZER_THOUGHTS, THOUGHT_CATEGORIES_METADATA };
export type { SentientRandomThought, ThoughtCategory };

export const AnalyzerBadgeIcon = AnimatedAnalyzerIcon;
export const DualGalaxyIcon = AnimatedAnalyzerIcon;

export type VisualEnergyMode = 'normal' | 'warm' | 'gold-flash' | 'red-flash' | 'negative' | 'cyan-pulse' | 'purple-glow';

export interface RandomWordItem {
  word: string;
  meaning: string;
}

export interface RestLightPoint {
  id: number;
  label: string;
  name: string;
  hue: number;
  secondaryHue: number;
  accentHue: number;
  colorName: string;
  hex: string;
  accentHex: string;
  rgb: [number, number, number];
  secondaryRgb: [number, number, number];
  bgGrad: string;
  description: string;
}

export const REST_LIGHT_POINTS: Record<number, RestLightPoint> = {
  1: {
    id: 1,
    label: 'Точка 1',
    name: 'Лазуровий кристал',
    colorName: 'Лазур',
    hue: 205,
    secondaryHue: 185,
    accentHue: 225,
    hex: '#38bdf8',
    accentHex: '#7dd3fc',
    rgb: [56, 189, 248],
    secondaryRgb: [125, 211, 252],
    bgGrad: 'from-sky-500/20 to-cyan-500/10',
    description: 'Прохолодне кришталево-чисте лазурове світіння',
  },
  2: {
    id: 2,
    label: 'Точка 2',
    name: 'Перламутровий цвіт',
    colorName: 'Перламутр',
    hue: 330,
    secondaryHue: 350,
    accentHue: 310,
    hex: '#f472b6',
    accentHex: '#fb7185',
    rgb: [244, 114, 182],
    secondaryRgb: [251, 113, 133],
    bgGrad: 'from-pink-500/20 to-rose-500/10',
    description: 'М\'яке квітуче біо-сяйво сакури та перлів',
  },
  3: {
    id: 3,
    label: 'Точка 3',
    name: 'Сонячний бурштин',
    colorName: 'Бурштин',
    hue: 42,
    secondaryHue: 24,
    accentHue: 58,
    hex: '#fbbf24',
    accentHex: '#f59e0b',
    rgb: [251, 191, 36],
    secondaryRgb: [245, 158, 11],
    bgGrad: 'from-amber-500/20 to-yellow-500/10',
    description: 'Тепле затишне золотаво-сонячне сяйво',
  },
};

// Thoughts database (800 items across 8 categories: absurd, humor, science, nature, advice, app_tip, unobvious, mundane)
// is imported and re-exported from src/data/analyzerThoughts.ts above.

export const POWER_WORDS: RandomWordItem[] = [
  { word: 'Свобода', meaning: 'Повний вдих чистого життя без рамок залежності.' },
  { word: 'Глибина', meaning: 'Усередині тебе більше сили й спокою, ніж будь-якої тривоги.' },
  { word: 'Тиша', meaning: 'Зупинись на мить і прислухайся до свого чистого серцебиття.' },
  { word: 'Воля', meaning: 'Твоє усвідомлене рішення сильніше за будь-який тимчасовий позив.' },
  { word: 'Рівновага', meaning: 'Твоє тіло щосекунди повертає свій природний баланс і сили.' },
  { word: 'Тепло', meaning: 'Зігрій себе турботою — ти робиш велику справу щодня.' },
  { word: 'Світанок', meaning: 'Кожна чиста хвилина — це новий день і новий початок.' },
  { word: 'Незламність', meaning: 'Хвиля тяги завжди минає, а твій сталевий вибір залишається.' },
  { word: 'Легкість', meaning: 'Твої легені з кожним днем стають чистішими та просторішими.' },
  { word: 'Опора', meaning: 'Ти завжди маєш себе і силу вибору просто тут і зараз.' },
  { word: 'Ясність', meaning: 'Туман розсіюється, відкриваючи гострий розум та чисті думки.' },
  { word: 'Присутність', meaning: 'Будь у цій конкретній секунді. Тут немає тяги — є тільки дихання.' },
  { word: 'Джерело', meaning: 'Твоя життєва енергія самостійно оновлюється з кожним подихом.' },
  { word: 'Гармонія', meaning: 'Усі твої нервові клітини та рецептори зцілюються природно.' },
  { word: 'Мужність', meaning: 'Вибір бути вільним вартий кожної подоланої миті сумніву.' },
  { word: 'Сяйво', meaning: 'Ти випромінюєш світло й надихаєш оточуючих своєю силою.' },
  { word: 'Терпіння', meaning: 'Дай своєму тілу час загоїтися і розквітнути по-справжньому.' },
  { word: 'Вдячність', meaning: 'Подякуй своєму тілу за надзвичайну здатність до відновлення.' },
  { word: 'Простір', meaning: 'Відчуй, як багато вільного часу й повітря тепер належить тобі.' },
  { word: 'Стихія', meaning: 'Ти — океан спокою. Дрібні хвилі на поверхні не здатні порушити дно.' },
  { word: 'Натхнення', meaning: 'Кожен день без диму відкриває справжні кольори й запахи світу.' },
  { word: 'Стійкість', meaning: 'Коріння твого спокою стає глибшим із кожною відкинутою спокусою.' },
  { word: 'Відродження', meaning: 'Твої судини, серце та смак очищуються просто зараз.' },
  { word: 'Чистота', meaning: 'Прозоре повітря наповнює кожну альвеолу чистим життям.' },
  { word: 'Міць', meaning: 'Здатність сказати собі «я обираю здоров\'я» робить тебе непереможним.' },
  { word: 'Турбота', meaning: 'Стався до свого тіла як до найдорожчого дому.' },
  { word: 'Спокій', meaning: 'Повільний видих виносить будь-яку напругу геть.' },
  { word: 'Єдність', meaning: 'Твій розум, тіло та подих діють в ідеальній злагоді.' }
];

/**
 * Living Glitter Shell Simulator (EnergyClotVisual)
 * High-performance 3D particle physics, curl turbulence, diamond scintillation & prismatic chromatic dispersion
 */
export { LivingGlitterVisual, EnergyClotVisual };

// Zen Meditation Yin-Yang Icon for Analyzer Thoughts
export const ZenMeditationStarIcon: React.FC = () => {
  const [isLit, setIsLit] = useState<boolean>(false);

  useEffect(() => {
    setIsLit(false);
    const timer = setTimeout(() => {
      setIsLit(true);
    }, 280);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="inline-flex items-center justify-center mr-2 relative align-middle shrink-0">
      {/* Zen Yin-Yang Meditation Glow Aura */}
      <div 
        className={`absolute -inset-1.5 rounded-full blur-md transition-all duration-1000 ease-out pointer-events-none ${
          isLit ? 'opacity-80 scale-115' : 'opacity-0 scale-50'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(200, 200, 210, 0.2) 60%, transparent 100%)',
          filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.6))'
        }}
      />

      {/* Rotating Yin-Yang Meditation Icon */}
      <svg 
        viewBox="0 0 24 24" 
        className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-1000 ease-out relative z-10 ${
          isLit 
            ? 'scale-105 opacity-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]' 
            : 'scale-75 opacity-20'
        }`}
        fill="none"
      >
        <g className="yinyang-meditation-icon">
          <circle cx="12" cy="12" r="10" fill="#09090b" stroke="#e4e4e7" strokeWidth="1.2" />
          <path
            d="M 12 2 A 10 10 0 0 1 12 22 A 5 5 0 0 1 12 12 A 5 5 0 0 0 12 2 Z"
            fill="#ffffff"
          />
          <circle cx="12" cy="7" r="1.6" fill="#09090b" />
          <circle cx="12" cy="17" r="1.6" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
};

export const AnalyzerRainbowIcon: React.FC<{ progress: number; cloudRestHue: number; className?: string }> = ({
  progress,
  cloudRestHue,
  className = 'w-6 h-6'
}) => {
  const isNearlyReady = progress >= 0.95;
  const percentage = Math.round(progress * 100);

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none overflow-visible ${className}`}
      title={`Час до наступної думки: ${percentage}%`}
    >
      {/* Pulsing ready glow when progress is almost complete */}
      {isNearlyReady && (
        <div className="absolute -inset-1 rounded-full bg-amber-400/35 animate-ping pointer-events-none" />
      )}
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full overflow-visible relative z-10">
        <defs>
          <filter id="rainbowGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor={`hsl(${cloudRestHue}, 90%, 65%)`} floodOpacity="0.75" />
          </filter>
        </defs>
        <g filter="url(#rainbowGlow)">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const r = 9 - i * 0.85;
            const circumference = Math.PI * r;
            const stripeTarget = Math.max(0, Math.min(1, (progress * 1.15) - (i * 0.07)));
            const strokeOffset = circumference * (1 - stripeTarget);
            const stripeHue = (cloudRestHue + i * 26) % 360;

            return (
              <path
                key={i}
                d={`M ${12 - r} 16 A ${r} ${r} 0 0 1 ${12 + r} 16`}
                stroke={`hsl(${stripeHue}, 95%, ${65 + (i % 2) * 12}%)`}
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                className="transition-all duration-150 ease-out"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export interface ThoughtWordStreamProps {
  thoughtText: string;
  thoughtCategory?: ThoughtCategory;
  thoughtCategoryLabel?: string;
  onThoughtFinished: () => void;
  onNextThought: () => void;
  cloudRestHue: number;
  isFire: boolean;
  isSun?: boolean;
  isVisible: boolean;
  typingSpeed?: number;
  fontSize?: number;
  animSetting?: string;
}

interface BotanicalCurlyBracketProps {
  color: string;
  glow?: string;
  isVisible: boolean;
  category?: ThoughtCategory | string;
  animMode?: 'double_defocus' | 'stream' | 'random_letters_fade' | 'sparkler' | 'dialogue';
  phase?: string;
  appearedRatio?: number;
  disappearedRatio?: number;
}

/**
 * Вишукана орнаментальна рослинна лінія-дужка під кожною думкою:
 * - Унікальний неповторний ботанічний візерунок під кожну із 16 тематик (інь-ян баланс, природа, наука, гумор тощо)
 * - Повністю синхронізована з анімацією появи та зникнення тексту:
 *   * Потік (stream): розгортається від центру в боки за темпом слів і стирається справа наліво назад
 *   * Подвійний розфокус (double_defocus): проходить такий самий розфокус і чіткість
 *   * Випадкові літери (random_letters_fade): розчиняється та згасає зоряним мерехтінням
 *   * Бенгальський вогник (sparkler): палає та випаровується вогняною хвилею
 */
export const BotanicalCurlyBracket: React.FC<BotanicalCurlyBracketProps> = ({
  color,
  glow,
  isVisible,
  category,
  animMode = 'stream',
  phase = 'holding',
  appearedRatio = 1,
  disappearedRatio = 0
}) => {
  const renderCategorySvg = () => {
    switch (category) {
      case 'health_advice':
        // 1. Поради щодо здоров'я: серцеподібний паросток життя, пульсуючі цілющі вузлики та завитки відновлення
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            {/* Central Yin-Yang Heart Sprout */}
            <path d="M 120,20 C 115,13 112,8 117,4 C 120,2 122,5 120,9 C 118,5 120,2 123,4 C 128,8 125,13 120,20 Z" fill="currentColor" opacity="0.95" />
            <circle cx="120" cy="3.5" r="1.4" fill="currentColor" opacity="0.95" />
            {/* Left Cardiogram Vine Arch */}
            <path d="M 10,7 C 22,2 35,5 44,8 C 58,13 74,9 92,7 L 98,12 L 104,3 L 110,13 L 115,10 L 118,17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Right Cardiogram Vine Arch */}
            <path d="M 230,7 C 218,2 205,5 196,8 C 182,13 166,9 148,7 L 142,12 L 136,3 L 130,13 L 125,10 L 122,17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Leaflet pairs */}
            <path d="M 28,6 C 24,1 32,1 36,4 C 33,6 30,7 28,6 Z" fill="currentColor" opacity="0.85" />
            <path d="M 212,6 C 216,1 208,1 204,4 C 207,6 210,7 212,6 Z" fill="currentColor" opacity="0.85" />
            <path d="M 68,9 C 72,4 80,4 83,7 C 79,9 74,10 68,9 Z" fill="currentColor" opacity="0.85" />
            <path d="M 172,9 C 168,4 160,4 157,7 C 161,9 166,10 172,9 Z" fill="currentColor" opacity="0.85" />
          </svg>
        );

      case 'useful_advice':
        // 2. Корисні поради: чотирилисник мудрості, сонячні променисті пагони та золотисті паростки знань
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            {/* Central Wisdom Clover Bloom */}
            <circle cx="120" cy="11" r="2.2" fill="currentColor" opacity="0.95" />
            <path d="M 120,4 C 117,7 117,10 120,11 C 123,10 123,7 120,4 Z" fill="currentColor" opacity="0.9" />
            <path d="M 120,18 C 117,15 117,12 120,11 C 123,12 123,15 120,18 Z" fill="currentColor" opacity="0.9" />
            <path d="M 113,11 C 116,8 119,8 120,11 C 119,14 116,14 113,11 Z" fill="currentColor" opacity="0.9" />
            <path d="M 127,11 C 124,8 121,8 120,11 C 121,14 124,14 127,11 Z" fill="currentColor" opacity="0.9" />
            {/* Arches of illumination */}
            <path d="M 12,8 C 26,2 45,6 64,10 C 82,13 100,7 114,13 L 118,17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 228,8 C 214,2 195,6 176,10 C 158,13 140,7 126,13 L 122,17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <circle cx="38" cy="5" r="1.6" fill="currentColor" opacity="0.9" />
            <circle cx="202" cy="5" r="1.6" fill="currentColor" opacity="0.9" />
            <path d="M 82,9 C 85,4 93,5 95,8 C 91,10 86,10 82,9 Z" fill="currentColor" opacity="0.85" />
            <path d="M 158,9 C 155,4 147,5 145,8 C 149,10 154,10 158,9 Z" fill="currentColor" opacity="0.85" />
          </svg>
        );

      case 'app_guide':
        // 3. Інструкції застосунку: геометричний кришталевий лотос, цифрові симетричні контури
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            <path d="M 120,5 L 125,12 L 120,19 L 115,12 Z" fill="currentColor" opacity="0.95" />
            <path d="M 120,1 L 129,10 L 120,17 L 111,10 Z" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.75" />
            <path d="M 12,9 L 34,4 C 52,2 72,11 90,8 L 110,8 L 116,14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 228,9 L 206,4 C 188,2 168,11 150,8 L 130,8 L 124,14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <circle cx="34" cy="4" r="1.8" fill="currentColor" opacity="0.9" />
            <circle cx="206" cy="4" r="1.8" fill="currentColor" opacity="0.9" />
            <path d="M 62,8 L 68,3 L 74,8 L 68,12 Z" fill="currentColor" opacity="0.8" />
            <path d="M 178,8 L 172,3 L 166,8 L 172,12 Z" fill="currentColor" opacity="0.8" />
          </svg>
        );

      case 'app_tip':
        // 4. Підказки застосунку: механіко-ботанічна шестерня-квітка з напрямними стрілчастими пагонами
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            {/* Cog flower center */}
            <circle cx="120" cy="11" r="3.2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.9" />
            <circle cx="120" cy="11" r="1.2" fill="currentColor" />
            <path d="M 120,6 L 120,8 M 120,14 L 120,16 M 115,11 L 117,11 M 123,11 L 125,11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            {/* Precision directional stems */}
            <path d="M 14,10 C 30,3 52,14 74,8 C 90,4 104,11 114,14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 226,10 C 210,3 188,14 166,8 C 150,4 136,11 126,14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <polygon points="14,10 22,6 20,11" fill="currentColor" opacity="0.85" />
            <polygon points="226,10 218,6 220,11" fill="currentColor" opacity="0.85" />
            <circle cx="86" cy="8" r="1.5" fill="currentColor" opacity="0.85" />
            <circle cx="154" cy="8" r="1.5" fill="currentColor" opacity="0.85" />
          </svg>
        );

      case 'absurd':
        // 5. Абсурдні фрази: сюрреалістичні парадоксальні петлі Мебіуса, літаючі невагомі зіркові листочки
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            <path d="M 120,4 C 117,10 110,12 120,20 C 130,12 123,10 120,4 Z" fill="currentColor" opacity="0.9" />
            <circle cx="120" cy="12" r="1.6" fill="currentColor" opacity="0.9" />
            <path d="M 10,13 C 20,2 30,18 44,6 C 60,-3 78,16 96,8 C 106,3 114,13 118,18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 230,13 C 220,2 210,18 196,6 C 180,-3 162,16 144,8 C 134,3 126,13 122,18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Defying gravity star leaves */}
            <polygon points="32,7 34,2 36,7 41,8 36,9 34,14 32,9 27,8" fill="currentColor" opacity="0.9" />
            <polygon points="208,7 206,2 204,7 199,8 204,9 206,14 208,9 213,8" fill="currentColor" opacity="0.9" />
            <path d="M 72,11 C 68,15 62,12 65,9 C 68,9 72,10 72,11 Z" fill="currentColor" opacity="0.8" />
            <path d="M 168,11 C 172,15 178,12 175,9 C 172,9 168,10 168,11 Z" fill="currentColor" opacity="0.8" />
          </svg>
        );

      case 'poetic':
        // 6. Поетичні фрази: витончені вербові гілочки-пір'їнки, плавні лебедині вигини, політ ранкового вітру
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            <path d="M 120,6 C 116,11 115,16 120,21 C 125,16 124,11 120,6 Z" fill="currentColor" opacity="0.92" />
            <path d="M 12,8 C 24,2 40,4 56,9 C 75,12 94,6 110,9 C 115,10 117,14 118,18" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />
            <path d="M 228,8 C 216,2 200,4 184,9 C 165,12 146,6 130,9 C 125,10 123,14 122,18" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />
            <path d="M 34,6 C 30,1 38,0 43,4 C 39,6 36,7 34,6 Z" fill="currentColor" opacity="0.85" />
            <path d="M 206,6 C 210,1 202,0 197,4 C 201,6 204,7 206,6 Z" fill="currentColor" opacity="0.85" />
            <path d="M 68,9 C 65,3 74,2 78,6 C 75,8 71,9 68,9 Z" fill="currentColor" opacity="0.85" />
            <path d="M 172,9 C 175,3 166,2 162,6 C 165,8 169,9 172,9 Z" fill="currentColor" opacity="0.85" />
          </svg>
        );

      case 'subtle_mundane':
        // 7. Особлива буденність: затишні листочки свіжого чаю/кави, плавні круглі паростки та хвилі пари
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            <path d="M 120,8 C 115,13 114,17 120,21 C 126,17 125,13 120,8 Z" fill="currentColor" opacity="0.9" />
            <circle cx="120" cy="5" r="1.6" fill="currentColor" opacity="0.85" />
            <path d="M 14,9 C 28,4 42,6 56,10 C 76,13 96,7 111,10 C 116,11 118,14 119,18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 226,9 C 212,4 198,6 184,10 C 164,13 144,7 129,10 C 124,11 122,14 121,18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 38,8 C 34,3 43,2 47,6 C 44,8 40,8 38,8 Z" fill="currentColor" opacity="0.85" />
            <path d="M 202,8 C 206,3 197,2 193,6 C 196,8 200,8 202,8 Z" fill="currentColor" opacity="0.85" />
            <path d="M 78,10 C 74,5 83,4 87,8 C 84,10 80,10 78,10 Z" fill="currentColor" opacity="0.8" />
            <path d="M 162,10 C 166,5 157,4 153,8 C 156,10 160,10 162,10 Z" fill="currentColor" opacity="0.8" />
          </svg>
        );

      case 'mundane':
        // 8. Буденні спостереження: золоті колоски стиглого колосся, польові трави теплого серпневого полудня
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            <circle cx="120" cy="12" r="2.2" fill="currentColor" opacity="0.95" />
            <path d="M 120,4 L 120,20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            {/* Wheat awns and grains */}
            <path d="M 115,8 C 117,10 120,10 120,8 C 120,6 117,6 115,8 Z" fill="currentColor" opacity="0.9" />
            <path d="M 125,8 C 123,10 120,10 120,8 C 120,6 123,6 125,8 Z" fill="currentColor" opacity="0.9" />
            <path d="M 114,14 C 116,16 120,16 120,14 C 120,12 116,12 114,14 Z" fill="currentColor" opacity="0.9" />
            <path d="M 126,14 C 124,16 120,16 120,14 C 120,12 124,12 126,14 Z" fill="currentColor" opacity="0.9" />
            <path d="M 12,11 C 32,3 60,14 88,8 C 100,5 110,12 118,16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 228,11 C 208,3 180,14 152,8 C 140,5 130,12 122,16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <circle cx="48" cy="7" r="1.5" fill="currentColor" opacity="0.85" />
            <circle cx="192" cy="7" r="1.5" fill="currentColor" opacity="0.85" />
          </svg>
        );

      case 'jokes':
        // 9. Жарти: грайливі пружні завитки з гронами ягід, усміхнені рослинні дуги
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            <path d="M 120,10 C 115,15 114,18 120,21 C 126,18 125,15 120,10 Z" fill="currentColor" opacity="0.9" />
            <circle cx="116" cy="7" r="1.4" fill="currentColor" opacity="0.9" />
            <circle cx="124" cy="7" r="1.4" fill="currentColor" opacity="0.9" />
            <circle cx="120" cy="3.5" r="1.6" fill="currentColor" opacity="0.95" />
            <path d="M 12,11 C 22,2 36,15 52,8 C 68,0 86,15 103,9 C 110,6 116,13 118,18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 228,11 C 218,2 204,15 188,8 C 172,0 154,15 137,9 C 130,6 124,13 122,18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <circle cx="42" cy="5" r="1.5" fill="currentColor" opacity="0.9" />
            <circle cx="47" cy="8" r="1.2" fill="currentColor" opacity="0.85" />
            <circle cx="198" cy="5" r="1.5" fill="currentColor" opacity="0.9" />
            <circle cx="193" cy="8" r="1.2" fill="currentColor" opacity="0.85" />
          </svg>
        );

      case 'humor':
        // 10. Гумор та іронія: театральні маскові пелюстки, закручені грайливі спіралі з іскристими вузлами
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            <circle cx="120" cy="11" r="2" fill="currentColor" opacity="0.95" />
            <path d="M 112,8 C 116,4 124,4 128,8 C 124,12 116,12 112,8 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.9" />
            <path d="M 114,14 C 117,17 123,17 126,14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 10,10 C 24,1 42,16 60,7 C 78,-1 98,14 114,9 L 118,17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 230,10 C 216,1 198,16 180,7 C 162,-1 142,14 126,9 L 122,17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <circle cx="34" cy="5" r="1.5" fill="currentColor" opacity="0.9" />
            <circle cx="206" cy="5" r="1.5" fill="currentColor" opacity="0.9" />
          </svg>
        );

      case 'science':
        // 11. Наукові факти: золотий перетин, квантові орбітальні кола, логарифмічна ботанічна спіраль
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            <circle cx="120" cy="10" r="2.4" fill="currentColor" opacity="0.95" />
            <ellipse cx="120" cy="10" rx="7" ry="2.6" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.8" />
            <path d="M 120,13 L 120,21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 10,8 C 24,1 40,13 56,6 C 74,0 92,13 108,7 C 114,5 117,11 118,16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 230,8 C 216,1 200,13 184,6 C 166,0 148,13 132,7 C 126,5 123,11 122,16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <circle cx="36" cy="5" r="1.8" fill="currentColor" opacity="0.9" />
            <circle cx="204" cy="5" r="1.8" fill="currentColor" opacity="0.9" />
            <polygon points="68,6 72,2 76,6 72,10" fill="currentColor" opacity="0.85" />
            <polygon points="172,6 168,2 164,6 168,10" fill="currentColor" opacity="0.85" />
          </svg>
        );

      case 'nature_wildlife':
        // 12. Світ природи: лісова вікова папороть, дубове листя, переплетені гілки пралісу
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            <path d="M 120,6 C 116,11 114,16 120,21 C 126,16 124,11 120,6 Z" fill="currentColor" opacity="0.95" />
            <path d="M 116,12 C 112,10 111,8 114,7 C 116,8 117,10 116,12 Z" fill="currentColor" opacity="0.85" />
            <path d="M 124,12 C 128,10 129,8 126,7 C 124,8 123,10 124,12 Z" fill="currentColor" opacity="0.85" />
            <path d="M 12,9 C 24,3 38,6 53,10 C 72,14 90,7 108,10 C 114,11 117,15 118,18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 228,9 C 216,3 202,6 187,10 C 168,14 150,7 132,10 C 126,11 123,15 122,18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 32,6 C 28,2 36,1 40,5 C 37,7 34,7 32,6 Z" fill="currentColor" opacity="0.85" />
            <path d="M 208,6 C 212,2 204,1 200,5 C 203,7 206,7 208,6 Z" fill="currentColor" opacity="0.85" />
            <path d="M 70,10 C 66,5 75,4 79,8 C 76,10 72,11 70,10 Z" fill="currentColor" opacity="0.85" />
            <path d="M 170,10 C 174,5 165,4 161,8 C 164,10 168,11 170,10 Z" fill="currentColor" opacity="0.85" />
          </svg>
        );

      case 'nature':
        // 13. Спостереження природи: весняні первоцвіти, краплі роси на прокинених паростках
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            <circle cx="120" cy="11" r="2" fill="currentColor" opacity="0.95" />
            <path d="M 120,4 C 116,8 116,14 120,18 C 124,14 124,8 120,4 Z" fill="currentColor" opacity="0.85" />
            <path d="M 12,9 C 28,3 48,11 68,7 C 88,3 106,12 118,17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 228,9 C 212,3 192,11 172,7 C 152,3 134,12 122,17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <circle cx="38" cy="5" r="1.6" fill="currentColor" opacity="0.9" />
            <circle cx="202" cy="5" r="1.6" fill="currentColor" opacity="0.9" />
            <path d="M 76,8 C 73,4 80,3 83,6 C 80,8 77,9 76,8 Z" fill="currentColor" opacity="0.85" />
            <path d="M 164,8 C 167,4 160,3 157,6 C 160,8 163,9 164,8 Z" fill="currentColor" opacity="0.85" />
          </svg>
        );

      case 'hidden_coziness':
        // 14. Неочевидний затишок: бутон у формі півмісяця, нічна лаванда, краплі вечірньої тиші
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            <path d="M 120,6 C 114,10 114,17 120,21 C 116,18 116,9 120,6 Z" fill="currentColor" opacity="0.95" />
            <circle cx="125" cy="8.5" r="1.3" fill="currentColor" opacity="0.9" />
            <path d="M 12,10 C 24,4 38,7 52,11 C 70,14 88,8 106,10 C 112,11 115,14 117,18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 228,10 C 216,4 202,7 188,11 C 170,14 152,8 134,10 C 128,11 125,14 123,18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <circle cx="34" cy="5" r="1.4" fill="currentColor" opacity="0.85" />
            <circle cx="206" cy="5" r="1.4" fill="currentColor" opacity="0.85" />
            <path d="M 72,9 C 69,5 76,4 79,8 C 76,10 73,10 72,9 Z" fill="currentColor" opacity="0.8" />
            <path d="M 168,9 C 171,5 164,4 161,8 C 164,10 167,10 168,9 Z" fill="currentColor" opacity="0.8" />
          </svg>
        );

      case 'unobvious':
        // 15. Неочевидні спостереження: містичний нічний жасмин, калейдоскопічні грані світла
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            <polygon points="120,4 123,9 128,10 124,14 125,19 120,16 115,19 116,14 112,10 117,9" fill="currentColor" opacity="0.95" />
            <path d="M 12,10 C 26,4 46,12 66,7 C 86,2 104,13 116,17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 228,10 C 214,4 194,12 174,7 C 154,2 136,13 124,17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <circle cx="44" cy="6" r="1.5" fill="currentColor" opacity="0.85" />
            <circle cx="196" cy="6" r="1.5" fill="currentColor" opacity="0.85" />
          </svg>
        );

      case 'dialogue':
      case 'analyzer_dialogue':
        // Спеціальна оригінальна дужка для живих Діалогів з Аналізатором:
        // - Центральний резонансний вузол взаєморозуміння та живого спілкування
        // - Переплетені акустичні гармонійні арки голосу та думки
        // - Симетричні крила ментального зв'язку з мініатюрними сяючими нодами діалогу
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-44 sm:w-52 max-w-[90%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            {/* Central Communicative Harmony Nexus */}
            <circle cx="120" cy="11" r="2.2" fill="currentColor" opacity="0.95" />
            <circle cx="120" cy="11" r="4.5" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 1.5" fill="none" opacity="0.65" />
            
            {/* Twin Interlocking Speech & Resonance Arcs */}
            <path d="M 115,7 C 117,9 117,13 115,15 C 113.5,13 113.5,9 115,7 Z" fill="currentColor" opacity="0.9" />
            <path d="M 125,7 C 123,9 123,13 125,15 C 126.5,13 126.5,9 125,7 Z" fill="currentColor" opacity="0.9" />
            <circle cx="120" cy="3.5" r="1.3" fill="currentColor" opacity="0.9" />
            <circle cx="120" cy="18.5" r="1.3" fill="currentColor" opacity="0.9" />

            {/* Left Acoustic-Optical Dialogue Wave Wing */}
            <path d="M 12,9 C 24,3 38,13 54,8 C 70,3 84,12 100,7 C 108,5 113,8 116,14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 32,8 C 42,12 52,5 64,9" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.65" />
            
            {/* Right Acoustic-Optical Dialogue Wave Wing */}
            <path d="M 228,9 C 216,3 202,13 186,8 C 170,3 156,12 140,7 C 132,5 127,8 124,14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 208,8 C 198,12 188,5 176,9" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.65" />

            {/* Communicative Spark Nodules */}
            <circle cx="28" cy="5.5" r="1.6" fill="currentColor" opacity="0.9" />
            <circle cx="212" cy="5.5" r="1.6" fill="currentColor" opacity="0.9" />
            <circle cx="74" cy="7.5" r="1.4" fill="currentColor" opacity="0.85" />
            <circle cx="166" cy="7.5" r="1.4" fill="currentColor" opacity="0.85" />
            
            {/* Dialogue Filigree Accents */}
            <path d="M 52,8 C 55,4 61,4 64,7 C 60,8 56,9 52,8 Z" fill="currentColor" opacity="0.8" />
            <path d="M 188,8 C 185,4 179,4 176,7 C 180,8 184,9 188,8 Z" fill="currentColor" opacity="0.8" />
          </svg>
        );

      default:
        // Класична витончена рослинна фігурна дужка
        return (
          <svg viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 sm:w-48 max-w-[88%] h-auto overflow-visible" style={{ color, filter: glow && glow !== 'none' ? `drop-shadow(${glow})` : undefined }}>
            <path d="M 120,11 C 118,14 117,17 120,21 C 123,17 122,14 120,11 Z" fill="currentColor" opacity="0.95" />
            <circle cx="120" cy="8" r="1.4" fill="currentColor" opacity="0.9" />
            <path d="M 11,5 C 16,3 23,3 29,6 C 37,9 46,10 56,9 C 74,7 92,6 108,8 C 114,9 118,11 120,18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 229,5 C 224,3 217,3 211,6 C 203,9 194,10 184,9 C 166,7 148,6 132,8 C 126,9 122,11 120,18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="24" cy="5" r="1.6" fill="currentColor" opacity="0.85" />
            <circle cx="216" cy="5" r="1.6" fill="currentColor" opacity="0.85" />
          </svg>
        );
    }
  };

  return (
    <div
      className="w-full flex items-center justify-center mt-1.5 pointer-events-none select-none overflow-visible"
      style={{
        transformOrigin: 'center center',
        transform: isVisible ? 'scale(1)' : 'scale(0.96)',
        opacity: isVisible ? 0.95 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(2px)',
        transition: 'opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1), filter 350ms ease',
        willChange: 'transform, opacity, filter'
      }}
      aria-hidden="true"
    >
      {renderCategorySvg()}
    </div>
  );
};

export const ThoughtWordStream: React.FC<ThoughtWordStreamProps> = ({
  thoughtText,
  thoughtCategory,
  thoughtCategoryLabel,
  onThoughtFinished,
  onNextThought,
  cloudRestHue,
  isFire,
  isSun = false,
  isVisible,
  typingSpeed = 1.0,
  fontSize,
  animSetting
}) => {
  // Render bespoke category pictogram in the luminous prism light style
  const categoryPictogram = useMemo(() => {
    if (!thoughtCategory) return null;
    return (
      <RefractedCategoryIcon 
        category={thoughtCategory} 
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 drop-shadow-[0_0_8px_rgba(255,253,208,0.55)]" 
      />
    );
  }, [thoughtCategory]);

  // Strip emojis & extract clean text
  const cleanText = useMemo(() => {
    return (thoughtText || '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }, [thoughtText]);

  // Break cleanText into structured words
  const words = useMemo(() => {
    if (!cleanText) return [];
    return cleanText.split(/\s+/).filter(Boolean);
  }, [cleanText]);
  const totalWords = words.length;

  // Identify natural thinking pause spot(s) where the Analyzer briefly pauses as if pondering
  const thinkingWordIndices = useMemo(() => {
    const indices = new Set<number>();
    if (words.length < 3) return indices;

    // Check for words ending with punctuation marks (comma, dash, colon, etc.)
    const punctuationCandidates: number[] = [];
    words.forEach((w, idx) => {
      if (idx < words.length - 1 && /[,;—:!?]$/.test(w)) {
        punctuationCandidates.push(idx);
      }
    });

    if (punctuationCandidates.length > 0) {
      const chosen = punctuationCandidates[Math.floor(Math.random() * punctuationCandidates.length)];
      indices.add(chosen);
    } else {
      // Pick a natural spot between ~35% and ~65% of the sentence
      const midStart = Math.max(1, Math.floor(words.length * 0.35));
      const midEnd = Math.max(midStart, Math.floor(words.length * 0.65));
      const chosen = midStart + Math.floor(Math.random() * (midEnd - midStart + 1));
      if (chosen < words.length - 1) {
        indices.add(chosen);
      }
    }

    // For longer thoughts (>= 10 words), 35% chance to have a second thinking pause spot
    if (words.length >= 10 && Math.random() < 0.35) {
      const secondSpot = Math.min(words.length - 2, Math.floor(words.length * 0.75));
      if (!indices.has(secondSpot)) {
        indices.add(secondSpot);
      }
    }

    return indices;
  }, [words]);

  // Total characters count and per-word character offsets for reverse char-by-char deletion
  const { totalCharsCount, wordCharRanges } = useMemo(() => {
    let count = 0;
    const ranges: Array<{ start: number; end: number; length: number }> = [];
    words.forEach((w) => {
      const len = Array.from(w).length;
      ranges.push({ start: count, end: count + len, length: len });
      count += len;
    });
    return { totalCharsCount: count, wordCharRanges: ranges };
  }, [words]);

  // Number of words revealed from the start (0 .. totalWords)
  const [appearedWords, setAppearedWords] = useState<number>(0);

  // Number of characters erased from the end of the sentence (0 .. totalCharsCount)
  const [erasedCharsCount, setErasedCharsCount] = useState<number>(0);

  // Sparkler (Бенгальський вогник) state
  const [sparklerCharCount, setSparklerCharCount] = useState<number>(0);
  const [isSparklerActive, setIsSparklerActive] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeCharRef = useRef<HTMLSpanElement | null>(null);
  const [sparklerCoords, setSparklerCoords] = useState<{ x: number; y: number } | null>(null);

  // Prevent any state mismatch / phantom flashes during transition between thoughts
  const [prevText, setPrevText] = useState<string>('');
  if (cleanText !== prevText) {
    setPrevText(cleanText);
    setSparklerCharCount(0);
    setIsSparklerActive(false);
  }

  // Symmetrical Animation Mode: 'sparkler' | 'double_defocus' | 'stream' | 'random_letters_fade';
  type ThoughtAnimMode = 'sparkler' | 'double_defocus' | 'stream' | 'random_letters_fade';
  const [animMode, setAnimMode] = useState<ThoughtAnimMode>('sparkler');

  // Symmetrical lifecycle phases:
  // - sparkler: sparkler_appearing -> holding -> sparkler_disappearing -> disappearing
  // - double_defocus: appear_defocus_1 -> appear_refocus_1 -> appear_defocus_2 -> holding -> defocusing -> refocusing -> second_defocusing -> disappearing
  // - stream: appearing -> holding -> reverse_erasing -> disappearing
  // - random_letters_fade: random_fade_appearing -> holding -> random_fade_disappearing -> disappearing
  type ThoughtPhase =
    | 'sparkler_appearing'
    | 'sparkler_disappearing'
    | 'appear_defocus_1'
    | 'appear_refocus_1'
    | 'appear_defocus_2'
    | 'appearing'
    | 'random_fade_appearing'
    | 'holding'
    | 'defocusing'
    | 'refocusing'
    | 'second_defocusing'
    | 'reverse_erasing'
    | 'random_fade_disappearing'
    | 'disappearing'
    | 'idle';

  const [phase, setPhase] = useState<ThoughtPhase>('sparkler_appearing');
  // Bracket visibility: appears strictly after text finishes revealing, and disappears before text begins exit
  const [isBracketRevealed, setIsBracketRevealed] = useState<boolean>(false);

  // Random Letters Fade state (поступова поява та згасання рандомних літер)
  const [randomRevealedIndices, setRandomRevealedIndices] = useState<Set<number>>(new Set());
  const [randomHiddenIndices, setRandomHiddenIndices] = useState<Set<number>>(new Set());
  const randomOrderRef = useRef<number[]>([]);

  // Thinking state (triggers moving 3-dots animation after current word)
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [thinkingWordIdx, setThinkingWordIdx] = useState<number | null>(null);

  // Reset states & randomly pick an animation mode for each new thought
  useEffect(() => {
    if (!isVisible || totalWords === 0) {
      setPhase('idle');
      setIsBracketRevealed(false);
      setAppearedWords(0);
      setErasedCharsCount(0);
      setRandomRevealedIndices(new Set());
      setRandomHiddenIndices(new Set());
      setIsThinking(false);
      setThinkingWordIdx(null);
      return;
    }

    let chosenMode: ThoughtAnimMode = 'sparkler';
    const effectivePref = animSetting || (() => {
      try {
        return localStorage.getItem('quit-smoking:analyzer-thought-anim-mode') || 'random';
      } catch {
        return 'random';
      }
    })();

    if (effectivePref === 'sparkler') {
      chosenMode = 'sparkler';
    } else if (effectivePref === 'double_defocus') {
      chosenMode = 'double_defocus';
    } else if (effectivePref === 'stream') {
      chosenMode = 'stream';
    } else if (effectivePref === 'random_letters_fade') {
      chosenMode = 'random_letters_fade';
    } else {
      const modes: ThoughtAnimMode[] = ['sparkler', 'double_defocus', 'stream', 'random_letters_fade'];
      chosenMode = modes[Math.floor(Math.random() * modes.length)];
    }

    setAnimMode(chosenMode);

    setErasedCharsCount(0);
    setIsThinking(false);
    setThinkingWordIdx(null);

    // Створюємо перемішаний порядок індексів для випадкової появи літер
    const shuffled: number[] = Array.from({ length: totalCharsCount }, (_, i) => i);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    randomOrderRef.current = shuffled;

    if (chosenMode === 'sparkler') {
      setAppearedWords(totalWords);
      setSparklerCharCount(0);
      setIsSparklerActive(true);
      setPhase('sparkler_appearing');
    } else if (chosenMode === 'double_defocus') {
      setAppearedWords(totalWords);
      setPhase('appear_defocus_1');
    } else if (chosenMode === 'random_letters_fade') {
      setAppearedWords(totalWords);
      setRandomRevealedIndices(new Set());
      setRandomHiddenIndices(new Set());
      setPhase('random_fade_appearing');
    } else {
      setAppearedWords(0);
      setPhase('appearing');
    }
  }, [cleanText, isVisible, totalWords, totalCharsCount, animSetting]);

  const onThoughtFinishedRef = useRef(onThoughtFinished);
  useEffect(() => {
    onThoughtFinishedRef.current = onThoughtFinished;
  }, [onThoughtFinished]);

  // Main lifecycle state machine handling symmetrical appearance, holding, and disappearance
  useEffect(() => {
    if (!isVisible || phase === 'idle' || totalWords === 0) return;

    let timer: ReturnType<typeof setTimeout>;

    // 0. SPARKLER ANIMATION (БЕНГАЛЬСЬКИЙ ВОГНИК — ПОЯВА)
    if (phase === 'sparkler_appearing') {
      if (sparklerCharCount < totalCharsCount) {
        const stepDelay = Math.max(12, Math.round(24 / Math.sqrt(typingSpeed)));
        timer = setTimeout(() => {
          setSparklerCharCount((prev) => Math.min(totalCharsCount, prev + 1));
        }, stepDelay);
      } else {
        try {
          window.dispatchEvent(new Event('analyzer-thought-sparkler-burst'));
        } catch (e) {}
        setIsSparklerActive(false);
        setPhase('holding');
      }
    }

    // 1. DOUBLE DEFOCUS SYMMETRY
    else if (phase === 'appear_defocus_1') {
      timer = setTimeout(() => {
        setPhase('appear_refocus_1');
      }, 280);
    } else if (phase === 'appear_refocus_1') {
      timer = setTimeout(() => {
        setPhase('appear_defocus_2');
      }, 220);
    } else if (phase === 'appear_defocus_2') {
      timer = setTimeout(() => {
        setPhase('holding');
      }, 180);
    }

  // 3. TYPEWRITER STREAM SYMMETRY (ПОЯВА СЛОВО ЗА СЛОВОМ)
    else if (phase === 'appearing') {
      if (appearedWords < totalWords) {
        if (isThinking) {
          const thinkingDuration = Math.max(700, Math.round(1100 / Math.sqrt(typingSpeed)));
          timer = setTimeout(() => {
            setIsThinking(false);
            setThinkingWordIdx(null);
          }, thinkingDuration);
        } else {
          const currentIdx = appearedWords;
          const prevWordText = currentIdx > 0 ? words[currentIdx - 1] : '';
          const prevLettersCount = prevWordText ? prevWordText.replace(/[^\p{L}\p{N}]/gu, '').length : 4;
          const baseDelay = currentIdx === 0 ? 50 : 70 + Math.min(prevLettersCount, 12) * 22;
          const delay = Math.max(35, Math.round(baseDelay / typingSpeed));

          timer = setTimeout(() => {
            const nextAppeared = currentIdx + 1;
            setAppearedWords(nextAppeared);

            if (thinkingWordIndices.has(currentIdx)) {
              setIsThinking(true);
              setThinkingWordIdx(currentIdx);
            }
          }, delay);
        }
      } else {
        if (isThinking) {
          const thinkingDuration = Math.max(700, Math.round(1100 / Math.sqrt(typingSpeed)));
          timer = setTimeout(() => {
            setIsThinking(false);
            setThinkingWordIdx(null);
            setPhase('holding');
          }, thinkingDuration);
        } else {
          setPhase('holding');
        }
      }
    }

    // 4. RANDOM LETTERS FADE (ПОСТУПОВА ПОЯВА РАНДОМНИХ ЛІТЕР)
    else if (phase === 'random_fade_appearing') {
      if (randomRevealedIndices.size < totalCharsCount) {
        const stepDelay = Math.max(16, Math.round(26 / Math.sqrt(typingSpeed)));
        timer = setTimeout(() => {
          setRandomRevealedIndices((prev) => {
            const next = new Set(prev);
            const batchSize = Math.max(1, Math.min(3, Math.ceil(totalCharsCount / 26)));
            for (let b = 0; b < batchSize; b++) {
              for (let i = 0; i < randomOrderRef.current.length; i++) {
                const idx = randomOrderRef.current[i];
                if (!next.has(idx)) {
                  next.add(idx);
                  break;
                }
              }
            }
            return next;
          });
        }, stepDelay);
      } else {
        setPhase('holding');
      }
    }

    // COMMON HOLDING PHASE (Повністю відкрита думка дихає і утримується)
    else if (phase === 'holding') {
      const baseHoldTime = Math.max(4000, totalWords * 320 + 800);
      const holdTime = Math.max(2600, Math.round(baseHoldTime / Math.sqrt(typingSpeed)));

      // Дужка з'являється плавно ПІСЛЯ повної появи всього тексту
      const bracketAppearTimer = setTimeout(() => {
        setIsBracketRevealed(true);
      }, 150);

      // Дужка зникає плавно ПЕРЕД тим, як текст почне зникати (за 400мс до виходу тексту)
      const bracketFadeTimer = setTimeout(() => {
        setIsBracketRevealed(false);
      }, Math.max(200, holdTime - 400));

      timer = setTimeout(() => {
        setIsBracketRevealed(false);
        if (animMode === 'sparkler') {
          setErasedCharsCount(0);
          setIsSparklerActive(true);
          setPhase('sparkler_disappearing');
        } else if (animMode === 'double_defocus') {
          setPhase('defocusing');
        } else if (animMode === 'random_letters_fade') {
          // Створюємо новий випадковий порядок для поступового згасання
          const shuffled: number[] = Array.from({ length: totalCharsCount }, (_, i) => i);
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          randomOrderRef.current = shuffled;
          setRandomHiddenIndices(new Set());
          setPhase('random_fade_disappearing');
        } else {
          setPhase('reverse_erasing');
        }
      }, holdTime);

      return () => {
        clearTimeout(bracketAppearTimer);
        clearTimeout(bracketFadeTimer);
        if (timer) clearTimeout(timer);
      };
    }

    // SPARKLER DISAPPEARANCE (БЕНГАЛЬСЬКИЙ ВОГНИК — ЗНИКНЕННЯ)
    else if (phase === 'sparkler_disappearing') {
      if (erasedCharsCount < totalCharsCount) {
        const stepDelay = Math.max(10, Math.round(18 / Math.sqrt(typingSpeed)));
        timer = setTimeout(() => {
          setErasedCharsCount((prev) => Math.min(totalCharsCount, prev + 1));
        }, stepDelay);
      } else {
        try {
          window.dispatchEvent(new Event('analyzer-thought-sparkler-burst'));
        } catch (e) {}
        setIsSparklerActive(false);
        setPhase('disappearing');
      }
    }

    // DOUBLE DEFOCUS SYMMETRY (ЗНИКНЕННЯ)
    else if (phase === 'defocusing') {
      timer = setTimeout(() => {
        setPhase('refocusing');
      }, 700);
    } else if (phase === 'refocusing') {
      timer = setTimeout(() => {
        setPhase('second_defocusing');
      }, 350);
    } else if (phase === 'second_defocusing') {
      timer = setTimeout(() => {
        setPhase('disappearing');
        try {
          window.dispatchEvent(new Event('analyzer-thought-disappearing'));
        } catch (e) {}
      }, 200);
    }

    // TYPEWRITER STREAM SYMMETRY (ПОСИМВОЛЬНЕ ЗНИКНЕННЯ СПРАВА НАЛІВО)
    else if (phase === 'reverse_erasing') {
      if (erasedCharsCount < totalCharsCount) {
        const eraseDelay = Math.max(14, Math.round(26 / typingSpeed));
        timer = setTimeout(() => {
          setErasedCharsCount((prev) => Math.min(totalCharsCount, prev + 1));
        }, eraseDelay);
      } else {
        setPhase('disappearing');
      }
    }

    // RANDOM LETTERS FADE SYMMETRY (ПОСТУПОВЕ ЗГАСАННЯ РАНДОМНИХ ЛІТЕР)
    else if (phase === 'random_fade_disappearing') {
      if (randomHiddenIndices.size < totalCharsCount) {
        const stepDelay = Math.max(14, Math.round(22 / Math.sqrt(typingSpeed)));
        timer = setTimeout(() => {
          setRandomHiddenIndices((prev) => {
            const next = new Set(prev);
            const batchSize = Math.max(1, Math.min(3, Math.ceil(totalCharsCount / 22)));
            for (let b = 0; b < batchSize; b++) {
              for (let i = 0; i < randomOrderRef.current.length; i++) {
                const idx = randomOrderRef.current[i];
                if (!next.has(idx)) {
                  next.add(idx);
                  break;
                }
              }
            }
            return next;
          });
        }, stepDelay);
      } else {
        setPhase('disappearing');
      }
    }

    // FINAL DISSOLVE AFTER TEXT IS COMPLETELY ERASED / GONE
    else if (phase === 'disappearing') {
      timer = setTimeout(() => {
        onThoughtFinishedRef.current();
      }, 260);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [
    phase,
    animMode,
    sparklerCharCount,
    cleanText,
    appearedWords,
    erasedCharsCount,
    randomRevealedIndices,
    randomHiddenIndices,
    isThinking,
    totalWords,
    totalCharsCount,
    words,
    thinkingWordIndices,
    isVisible,
    typingSpeed
  ]);

  if (!isVisible || totalWords === 0) {
    return (
      <div 
        className="w-full h-[62px] min-h-[62px] max-h-[62px] flex items-center justify-center text-center py-0 px-2 pointer-events-none opacity-0 select-none"
        aria-hidden="true"
      />
    );
  }

  // Text color & soft ambient glow: clear, bright, and highly legible
  const textColor = isSun 
    ? 'rgba(28, 25, 23, 0.92)' 
    : '#FFFDD0';

  const textGlow = isSun ? 'none' : '0 0 10px rgba(255, 253, 208, 0.45)';

  // Defocus / Refocus / Glitch container transition properties
  const isAppearDefocus1 = phase === 'appear_defocus_1';
  const isAppearRefocus1 = phase === 'appear_refocus_1';
  const isAppearDefocus2 = phase === 'appear_defocus_2';
  const isDefocusPhase = phase === 'defocusing';
  const isRefocusPhase = phase === 'refocusing';
  const isSecondDefocusPhase = phase === 'second_defocusing';
  const isSharpDisappearing = phase === 'disappearing';

  let containerFilter = 'blur(0px)';
  let containerTransform = 'scale(1)';
  let containerOpacity = 1;
  let containerTransition = 'filter 300ms ease, transform 300ms ease, opacity 300ms ease';

  if (isAppearDefocus1) {
    containerFilter = 'blur(3.4px)';
    containerTransform = 'scale(1.035)';
    containerOpacity = 0.82;
    containerTransition = 'filter 280ms cubic-bezier(0.16, 1, 0.3, 1), transform 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 280ms ease';
  } else if (isAppearRefocus1) {
    containerFilter = 'blur(0px)';
    containerTransform = 'scale(1.0)';
    containerOpacity = 1.0;
    containerTransition = 'filter 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 220ms cubic-bezier(0.16, 1, 0.3, 1), opacity 220ms ease';
  } else if (isAppearDefocus2) {
    containerFilter = 'blur(1.8px)';
    containerTransform = 'scale(1.018)';
    containerOpacity = 0.88;
    containerTransition = 'filter 180ms ease-out, transform 180ms ease-out, opacity 180ms ease-out';
  } else if (isDefocusPhase) {
    containerFilter = 'blur(2.4px)';
    containerTransform = 'scale(1.025)';
    containerOpacity = 0.88;
    containerTransition = 'filter 700ms cubic-bezier(0.25, 1, 0.5, 1), transform 700ms cubic-bezier(0.25, 1, 0.5, 1), opacity 700ms ease';
  } else if (isRefocusPhase) {
    containerFilter = 'blur(0px)';
    containerTransform = 'scale(1.0)';
    containerOpacity = 1.0;
    containerTransition = 'filter 350ms cubic-bezier(0.25, 1, 0.5, 1), transform 350ms cubic-bezier(0.25, 1, 0.5, 1), opacity 350ms ease';
  } else if (isSecondDefocusPhase) {
    containerFilter = 'blur(1.8px)';
    containerTransform = 'scale(1.018)';
    containerOpacity = 0.86;
    containerTransition = 'filter 200ms ease-out, transform 200ms ease-out, opacity 200ms ease-out';
  } else if (isSharpDisappearing) {
    containerTransform = 'scale(0.97)';
    containerOpacity = 0;
    containerTransition = 'opacity 75ms ease-in, transform 75ms ease-in, filter 75ms ease-in';
  }

  // Рослинна дужка синхронізовано з'являється та зникає за тією ж анімацією, що й текст думки
  const isBracketVisible = isVisible && phase !== 'idle';

  return (
    <div 
      ref={containerRef}
      onClick={(e) => {
        e.stopPropagation();
        onNextThought();
      }}
      className="w-full h-[62px] min-h-[62px] max-h-[62px] flex items-center justify-center text-center cursor-pointer select-none py-0 px-2 group relative overflow-visible"
      title="Натисніть, щоб почути нову думку Аналізатора"
    >
      <div 
        className={`relative z-10 flex flex-col items-center justify-center not-italic font-normal tracking-tight text-center leading-snug px-1 py-0.5 text-zinc-500 ${
          phase === 'holding' ? 'animate-thought-breathe' : ''
        }`}
        style={{
          fontSize: fontSize ? `${fontSize}px` : undefined,
          filter: containerFilter,
          transform: containerTransform,
          opacity: containerOpacity,
          transition: containerTransition,
          willChange: 'filter, transform, opacity'
        }}
      >
        <div className="flex flex-wrap items-center justify-center">
          {/* Bespoke Category Pictogram */}
          {categoryPictogram && (
            <span 
              className={`inline-flex items-center shrink-0 mr-1.5 select-none transition-all ${
                phase === 'disappearing'
                  ? 'duration-250 opacity-0 scale-75 blur-[1px] pointer-events-none'
                  : (animMode === 'sparkler' ? sparklerCharCount > 0 : (appearedWords > 0 || animMode === 'double_defocus' || animMode === 'random_letters_fade'))
                  ? 'duration-400 opacity-100 scale-100 pointer-events-auto'
                  : 'duration-400 opacity-0 scale-90 pointer-events-none'
              }`}
              title={thoughtCategoryLabel || (thoughtCategory ? THOUGHT_CATEGORIES_METADATA[thoughtCategory]?.label : 'Думка Аналізатора')}
            >
              {categoryPictogram}
            </span>
          )}

          {/* Word streaming, sparkler, double defocus, and random fade rendering */}
          {words.map((wordStr, wordIdx) => {
            const wordRange = wordCharRanges[wordIdx] || { start: 0, end: 0, length: 0 };
            const isRevealedWord = animMode !== 'stream' || wordIdx < appearedWords;
            const isThinkingHere = isThinking && thinkingWordIdx === wordIdx;
            const chars = Array.from(wordStr);

            return (
              <span
                key={`${wordIdx}-${wordStr}`}
                className="inline-flex items-baseline mr-[0.34em] last:mr-0 align-baseline whitespace-nowrap"
              >
                <span className="inline-inline-flex items-baseline">
                  {chars.map((char, cIdx) => {
                    const globalCharIdx = wordRange.start + cIdx;
                    const isCharErased = animMode === 'stream' && phase === 'reverse_erasing' && globalCharIdx >= (totalCharsCount - erasedCharsCount);

                    // Random Letters Fade Logic
                    const isRandomFadeRevealed = animMode === 'random_letters_fade'
                      ? (phase === 'holding' || (phase === 'random_fade_appearing' && randomRevealedIndices.has(globalCharIdx)) || (phase === 'random_fade_disappearing' && !randomHiddenIndices.has(globalCharIdx)))
                      : true;

                    // Sparkler (Бенгальський вогник) Logic
                    const remainingCharsCount = Math.max(0, totalCharsCount - erasedCharsCount);
                    const isSparklerRevealed = animMode === 'sparkler'
                      ? (globalCharIdx < sparklerCharCount && globalCharIdx < remainingCharsCount)
                      : true;

                    // Active burning tip during appearance (head of sparkler)
                    const isSparklerIgniting = animMode === 'sparkler' && 
                      phase === 'sparkler_appearing' && 
                      globalCharIdx < sparklerCharCount && 
                      globalCharIdx >= Math.max(0, sparklerCharCount - 2);

                    // Active burning tip during disappearance (sparkler vaporizing the text)
                    const isSparklerVaporizing = animMode === 'sparkler' && 
                      phase === 'sparkler_disappearing' && 
                      globalCharIdx >= Math.max(0, remainingCharsCount - 2) && 
                      globalCharIdx < remainingCharsCount;

                    const isCurrentSparklerHead = animMode === 'sparkler' && (
                      (phase === 'sparkler_appearing' && sparklerCharCount > 0 && globalCharIdx === sparklerCharCount - 1) ||
                      (phase === 'sparkler_disappearing' && remainingCharsCount > 0 && globalCharIdx === remainingCharsCount - 1)
                    );

                    const charStyle: React.CSSProperties = {
                      color: isSparklerIgniting 
                        ? '#ffffff' 
                        : isSparklerVaporizing 
                        ? '#ffffff' 
                        : textColor,
                      textShadow: isSparklerIgniting
                        ? '0 0 16px #ffca28, 0 0 8px #ffffff, 0 0 24px #ff9800'
                        : isSparklerVaporizing
                        ? '0 0 20px #ff5722, 0 0 10px #ffca28, 0 0 6px #ffffff'
                        : textGlow,
                      filter: isSparklerIgniting
                        ? 'brightness(2.2) drop-shadow(0 0 6px rgba(255,202,40,0.95))'
                        : isSparklerVaporizing
                        ? 'brightness(2.5) drop-shadow(0 0 8px rgba(255,87,34,0.95))'
                        : 'none',
                      willChange: 'opacity, transform, filter'
                    };

                    let charClass = '';

                    if (animMode === 'sparkler') {
                      if (isSparklerVaporizing) {
                        charClass = 'opacity-100 scale-110 blur-0 translate-y-0';
                        charStyle.transition = 'opacity 75ms ease, transform 75ms ease, filter 75ms ease';
                      } else if (isSparklerIgniting) {
                        charClass = 'opacity-100 scale-105 blur-0 translate-y-0';
                        charStyle.transition = 'opacity 90ms ease, transform 90ms ease, filter 90ms ease';
                      } else if (isSparklerRevealed && phase !== 'disappearing') {
                        charClass = 'opacity-100 blur-0 translate-y-0 scale-100';
                        charStyle.transition = 'opacity 180ms ease, filter 180ms ease, transform 180ms ease';
                      } else {
                        charClass = 'opacity-0 blur-[3px] scale-90 translate-y-0 pointer-events-none';
                        charStyle.transition = 'opacity 120ms ease, filter 120ms ease, transform 120ms ease';
                      }
                    } else if (animMode === 'random_letters_fade') {
                      if (isRandomFadeRevealed && phase !== 'disappearing') {
                        charClass = 'opacity-100 blur-0 translate-y-0 scale-100';
                        charStyle.transition = 'opacity 220ms ease, filter 220ms ease, transform 220ms ease';
                      } else {
                        charClass = 'opacity-0 blur-[2px] scale-90 translate-y-0 pointer-events-none';
                        charStyle.transition = 'opacity 180ms ease, filter 180ms ease, transform 180ms ease';
                      }
                    } else if (isRevealedWord && !isCharErased) {
                      charClass = 'opacity-100 blur-0 translate-y-0 scale-100';
                      charStyle.transition = phase === 'appearing'
                        ? `opacity 140ms ease ${cIdx * 20}ms, transform 140ms ease ${cIdx * 20}ms`
                        : 'opacity 140ms ease, transform 140ms ease';
                    } else if (isCharErased) {
                      charClass = 'opacity-0 blur-0 scale-90 translate-y-0 pointer-events-none';
                      charStyle.transition = 'opacity 70ms ease, transform 70ms ease';
                    } else {
                      charClass = 'opacity-0 blur-[1.5px] translate-y-1 scale-[0.94] pointer-events-none';
                    }

                    return (
                      <span
                        key={`${cIdx}-${char}`}
                        ref={isCurrentSparklerHead ? activeCharRef : undefined}
                        className={`inline-block ${charClass}`}
                        style={charStyle}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>

                {/* Standard text punctuation "…" seamlessly rendered as regular text when pausing as if thinking */}
                {isThinkingHere && (
                  <span 
                    className="inline-block transition-all duration-300 ease-out animate-pulse ml-0.5 select-none"
                    style={{
                      color: textColor,
                      textShadow: textGlow
                    }}
                    aria-label="…"
                  >
                    …
                  </span>
                )}
              </span>
            );
          })}
        </div>

        {/* Вишукана рослинна фігурна дужка під думкою */}
        <BotanicalCurlyBracket
          color={textColor}
          glow={textGlow}
          category={thoughtCategory}
          isVisible={isBracketRevealed}
        />
      </div>

      {/* Real-time Sparkler particle canvas for ThoughtWordStream */}
      <SparklerThoughtCanvas
        active={animMode === 'sparkler' && isSparklerActive}
        originCoords={sparklerCoords}
        originXPercent={
          phase === 'sparkler_appearing'
            ? Math.min(96, Math.max(4, (sparklerCharCount / Math.max(1, totalCharsCount)) * 100))
            : Math.min(96, Math.max(4, (Math.max(0, totalCharsCount - erasedCharsCount) / Math.max(1, totalCharsCount)) * 100))
        }
        originYPercent={50}
        mode={phase === 'sparkler_disappearing' ? 'disappear' : 'appear'}
      />
    </div>
  );
};

interface AnalyzerTipProps {
  onOpenModal?: () => void;
  isDocked?: boolean;
  setIsDocked?: (docked: boolean) => void;
  isEverythingHidden?: boolean;
}

export const AnalyzerTip: React.FC<AnalyzerTipProps> = ({
  onOpenModal,
  isDocked,
  setIsDocked,
  isEverythingHidden = false
}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const introJustClosedRef = useRef<boolean>(false);

  // Visual Appearance Style: 'standard' | 'autumn' | 'snowflake' | 'flower' | 'wave' | 'cat' | 'cosmic_ring'
  const [visualStyle, setVisualStyle] = useState<'standard' | 'autumn' | 'snowflake' | 'flower' | 'wave' | 'cat' | 'cosmic_ring'>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:analyzer-style');
      if (saved === 'autumn' || saved === 'fire') return 'autumn';
      if (saved === 'snowflake' || saved === 'flower' || saved === 'wave' || saved === 'cat' || saved === 'standard') {
        return saved as any;
      }
      return 'standard';
    } catch {
      return 'standard';
    }
  });

  // Typing speed adjustment value for analyzer thoughts: -2.0 to +2.0 with step 0.1 (default 0.0x)
  const [speedValue, setSpeedValue] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:analyzer-typing-speed');
      if (saved !== null) {
        const val = parseFloat(saved);
        if (!isNaN(val)) {
          if (val >= -2.0 && val <= 2.0) return val;
          // Migration from old 0.5 - 3.0 scale:
          if (val >= 0.5 && val <= 3.0) return parseFloat((val - 1.0).toFixed(1));
        }
      }
    } catch {}
    return -2.0;
  });

  const [thoughtFontSize, setThoughtFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:analyzer-thought-font-size');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 3 && val <= 26) return val;
      }
    } catch {}
    return 12;
  });

  // Thought animation mode setting: 'sparkler' | 'double_defocus' | 'glitch' | 'stream' | 'random_letters_fade' | 'random'
  const [thoughtAnimSetting, setThoughtAnimSetting] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:analyzer-thought-anim-mode') || 'random';
    } catch {
      return 'random';
    }
  });

  const updateThoughtAnimSetting = (mode: string) => {
    setThoughtAnimSetting(mode);
    try {
      localStorage.setItem('quit-smoking:analyzer-thought-anim-mode', mode);
      window.dispatchEvent(new Event('analyzer-thought-anim-mode-change'));
    } catch {}
  };

  const typingSpeedMultiplier = useMemo(() => {
    if (speedValue >= 0) {
      return 1.0 + speedValue;
    } else {
      return 1.0 / (1.0 + Math.abs(speedValue));
    }
  }, [speedValue]);

  // Requirement 1: Single slider, single point (один повзунок одна точка) for color selection (0 to 360 hue)
  const [cloudRestHue, setCloudRestHue] = useState<number>(() => {
    try {
      const savedHue = localStorage.getItem('quit-smoking:analyzer-rest-hue');
      if (savedHue !== null) {
        const h = parseInt(savedHue, 10);
        if (!isNaN(h)) return ((h % 360) + 360) % 360;
      }
      const savedPoint = localStorage.getItem('quit-smoking:analyzer-rest-point');
      if (savedPoint) {
        const p = parseInt(savedPoint, 10);
        if (REST_LIGHT_POINTS[p]) return REST_LIGHT_POINTS[p].hue;
      }
    } catch {}
    return 260; // default violet
  });

  const cloudRestPoint = useMemo(() => {
    if (cloudRestHue >= 160 && cloudRestHue <= 240) return 1;
    if (cloudRestHue >= 20 && cloudRestHue <= 80) return 3;
    return 2;
  }, [cloudRestHue]);

  const [cloudBlur, setCloudBlur] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:analyzer-blur');
      return saved !== null ? parseFloat(saved) : 0;
    } catch {
      return 0;
    }
  });

  const updateRestBlur = useCallback((newBlur: number) => {
    const b = Math.max(0, Math.min(12, newBlur));
    setCloudBlur(b);
    try {
      localStorage.setItem('quit-smoking:analyzer-blur', b.toString());
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, []);

  const updateRestHue = useCallback((newHue: number) => {
    const h = ((Math.round(newHue) % 360) + 360) % 360;
    setCloudRestHue(h);
    try {
      localStorage.setItem('quit-smoking:analyzer-rest-hue', h.toString());
      window.dispatchEvent(new CustomEvent('analyzer-rest-hue-changed', { detail: h }));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, []);

  const [cloudRestLightness, setCloudRestLightness] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:analyzer-rest-lightness');
      if (saved !== null) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) return Math.max(0, Math.min(100, val));
      }
    } catch {}
    return 60;
  });

  const updateRestLightness = useCallback((newVal: number) => {
    const l = Math.max(0, Math.min(100, Math.round(newVal)));
    setCloudRestLightness(l);
    try {
      localStorage.setItem('quit-smoking:analyzer-rest-lightness', l.toString());
      window.dispatchEvent(new CustomEvent('analyzer-rest-lightness-changed', { detail: l }));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, []);

  const [colorActiveMode, setColorActiveMode] = useState<'color' | 'monochrome'>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:analyzer-color-mode');
      if (saved === 'monochrome' || saved === 'color') return saved;
    } catch {}
    return 'color';
  });

  const updateColorActiveMode = useCallback((mode: 'color' | 'monochrome') => {
    setColorActiveMode(mode);
    try {
      localStorage.setItem('quit-smoking:analyzer-color-mode', mode);
      window.dispatchEvent(new CustomEvent('analyzer-color-mode-changed', { detail: mode }));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, []);

  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState<boolean>(false);
  const [shellSettingsTab, setShellSettingsTab] = useState<'appearance' | 'mechanics' | 'dialogues' | 'tasks_gratitude' | 'create_dialogue' | 'actions' | 'phrases' | 'results' | 'create'>('appearance');
  const [dialogueSettings, setDialogueSettings] = useState<AnalyzerDialogueSettings>(loadAnalyzerDialogueSettings);
  const [dialoguePhrases, setDialoguePhrases] = useState<DialoguePhrasesMap>(loadDialoguePhrases);
  const [ringStarsCount, setRingStarsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:analyzer-ring-stars-count');
      if (saved !== null) {
        const p = parseInt(saved, 10);
        if (!isNaN(p)) return Math.max(1, Math.min(200, p));
      }
    } catch {}
    return 80;
  });

  useEffect(() => {
    const handleSettingsChange = (e: any) => {
      if (e?.detail) setDialogueSettings(e.detail);
      else setDialogueSettings(loadAnalyzerDialogueSettings());
    };
    const handlePhrasesChange = (e: any) => {
      if (e?.detail) setDialoguePhrases(e.detail);
      else setDialoguePhrases(loadDialoguePhrases());
    };
    const handleOpenAppearance = () => {
      setShellSettingsTab('appearance');
      setIsAppearanceModalOpen(true);
    };
    const handleOpenDialogueSettings = () => {
      setShellSettingsTab('dialogues');
      setIsAppearanceModalOpen(true);
    };

    window.addEventListener('analyzer-dialogue-settings-changed', handleSettingsChange);
    window.addEventListener('analyzer-dialogue-phrases-changed', handlePhrasesChange);
    window.addEventListener('open-analyzer-appearance-modal', handleOpenAppearance);
    window.addEventListener('open-analyzer-dialogue-settings', handleOpenDialogueSettings);

    const handlePhrasesToggle = () => {
      try {
        setArePhrasesDisabled(localStorage.getItem('quit-smoking:analyzer-disable-phrases') === 'true');
      } catch {}
    };
    window.addEventListener('analyzer-phrases-toggle', handlePhrasesToggle);

    return () => {
      window.removeEventListener('analyzer-dialogue-settings-changed', handleSettingsChange);
      window.removeEventListener('analyzer-dialogue-phrases-changed', handlePhrasesChange);
      window.removeEventListener('open-analyzer-appearance-modal', handleOpenAppearance);
      window.removeEventListener('open-analyzer-dialogue-settings', handleOpenDialogueSettings);
      window.removeEventListener('analyzer-phrases-toggle', handlePhrasesToggle);
    };
  }, []);

  const [arePhrasesDisabled, setArePhrasesDisabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:analyzer-disable-phrases') === 'true';
    } catch {
      return false;
    }
  });

  const disableDialogues = arePhrasesDisabled || isEverythingHidden;

  const [isPulseRingActive, setIsPulseRingActive] = useState<boolean>(false);
  const pulseRingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Analyzer Name State & Sentient Random Thoughts (Аналізатор v.4.5)
  const [analyzerName, setAnalyzerName] = useState<string>(() => {
    try {
      const s = localStorage.getItem('quit-smoking:analyzer-name');
      if (s && s.trim()) return s.trim();
    } catch {}
    return 'Аналізатор';
  });

  // Current Sentient Random Thought from 9 distinct themes (Round-robin & Anti-repeat)
  const [currentThought, setCurrentThought] = useState<SentientRandomThought>(() => {
    return getNextSequentialThought();
  });

  const currentThoughtRef = useRef<SentientRandomThought>(currentThought);
  useEffect(() => {
    currentThoughtRef.current = currentThought;
  }, [currentThought]);

  // Authentic Celestial Constellation active on the Cosmic Ring
  const [activeConstellation, setActiveConstellation] = useState<RealConstellation | null>(null);
  const activeConstellationRef = useRef<RealConstellation | null>(null);
  activeConstellationRef.current = activeConstellation;

  useEffect(() => {
    const handleConActive = (e: any) => {
      setActiveConstellation(e.detail || null);
    };
    const handleConDormant = () => {
      setActiveConstellation(null);
    };
    window.addEventListener('analyzer-constellation-active', handleConActive);
    window.addEventListener('analyzer-constellation-dormant', handleConDormant);
    return () => {
      window.removeEventListener('analyzer-constellation-active', handleConActive);
      window.removeEventListener('analyzer-constellation-dormant', handleConDormant);
    };
  }, []);

  // Persistent first-run dialogue flag & Guided Tour active flag
  const [isPersistentDialogue, setIsPersistentDialogue] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:intro-dialogue-shown') !== 'true';
    } catch {
      return false;
    }
  });

  const [isGuidedTourActive, setIsGuidedTourActive] = useState<boolean>(false);

  useEffect(() => {
    const handleTourVis = (e: any) => {
      setIsGuidedTourActive(Boolean(e.detail));
    };
    window.addEventListener('guided-tour-visibility', handleTourVis);
    return () => window.removeEventListener('guided-tour-visibility', handleTourVis);
  }, []);

  // Initial delay is just 1.2s on mount so initial UI settles cleanly before first thought blooms
  const [isThoughtActive, setIsThoughtActive] = useState<boolean>(false);
  const nextThoughtTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [nextThoughtTargetTime, setNextThoughtTargetTime] = useState<number | null>(null);
  const [countdownSec, setCountdownSec] = useState<number | null>(null);

  // When in Yin-Yang / Harmony mode (isEverythingHidden), disable dialogues & turn off active thoughts
  useEffect(() => {
    if (isEverythingHidden) {
      setIsThoughtActive(false);
      setIsRevealed(false);
    }
  }, [isEverythingHidden]);

  // Initial start: reveal first thought smoothly after 1.2s if dialogues are enabled, intro is done and guide is closed
  useEffect(() => {
    if (disableDialogues) return;
    const hasShownIntro = typeof window !== 'undefined' && localStorage.getItem('quit-smoking:intro-dialogue-shown') === 'true';
    // Поки цей діалог або гід не закінчаться — аналізатор не запускає жодних діалогів чи думок!
    if (!hasShownIntro || isPersistentDialogue || isGuidedTourActive || introJustClosedRef.current) return;
    const startTimer = setTimeout(() => {
      setIsThoughtActive(true);
    }, 1200);
    return () => clearTimeout(startTimer);
  }, [disableDialogues, isPersistentDialogue, isGuidedTourActive]);

  // Live real-time countdown timer ticking every second
  useEffect(() => {
    const updateCountdown = () => {
      if (nextThoughtTargetTime && !isThoughtActive && !disableDialogues) {
        const remaining = Math.max(0, Math.ceil((nextThoughtTargetTime - Date.now()) / 1000));
        setCountdownSec(remaining);
      } else {
        setCountdownSec(null);
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextThoughtTargetTime, isThoughtActive, arePhrasesDisabled]);

  // Dynamic organic cooldown generator with diverse, natural intervals
  const getRandomQuietDelay = useCallback(() => {
    // Engaging natural quiet interval (18 - 38 seconds)
    const baseDelaySec = 18 + Math.random() * 20;
    return Math.floor(baseDelaySec * 1000);
  }, []);

  // Automatic random thought generator with organic, spontaneous intervals
  const handleThoughtFinished = useCallback(() => {
    setIsThoughtActive(false);

    try {
      window.dispatchEvent(new Event('analyzer-thought-quiet-window'));
    } catch (e) {}

    if (nextThoughtTimerRef.current) {
      clearTimeout(nextThoughtTimerRef.current);
      nextThoughtTimerRef.current = null;
    }

    const hasShownIntro = typeof window !== 'undefined' && localStorage.getItem('quit-smoking:intro-dialogue-shown') === 'true';
    if (!hasShownIntro || isPersistentDialogue || isGuidedTourActive || disableDialogues) {
      setNextThoughtTargetTime(null);
      return;
    }

    // Schedule next thought using the dynamic cooldown randomizer
    const randomQuietDelay = getRandomQuietDelay();
    const targetTime = Date.now() + randomQuietDelay;
    setNextThoughtTargetTime(targetTime);

    try {
      window.dispatchEvent(new CustomEvent('analyzer-thought-scheduled', {
        detail: { targetTime, totalDelay: randomQuietDelay }
      }));
    } catch (e) {}

    nextThoughtTimerRef.current = setTimeout(() => {
      nextThoughtTimerRef.current = null;
      setNextThoughtTargetTime(null);
      if (disableDialogues || isPersistentDialogue || isGuidedTourActive) return;
      const nextT = getNextSequentialThought();
      if (nextT) {
        currentThoughtRef.current = nextT;
        setCurrentThought(nextT);
        setIsThoughtActive(true); // Wake up with new random thought!
      }
    }, randomQuietDelay);
  }, [getRandomQuietDelay, disableDialogues, isPersistentDialogue, isGuidedTourActive]);

  // Manual trigger (tap/click on cloud or thought area at any time)
  const triggerNewThought = useCallback((preferredCategory?: SentientRandomThought['category']) => {
    const hasShownIntro = typeof window !== 'undefined' && localStorage.getItem('quit-smoking:intro-dialogue-shown') === 'true';
    if (!hasShownIntro || isPersistentDialogue || isGuidedTourActive) return;

    if (navigator.vibrate) {
      try { navigator.vibrate(15); } catch {}
    }

    if (nextThoughtTimerRef.current) {
      clearTimeout(nextThoughtTimerRef.current);
      nextThoughtTimerRef.current = null;
    }
    setNextThoughtTargetTime(null);

    const nextT = getNextSequentialThought(preferredCategory);
    if (nextT) {
      currentThoughtRef.current = nextT;
      setCurrentThought(nextT);
      setIsThoughtActive(true);
    }
  }, [isPersistentDialogue, isGuidedTourActive]);

  // Dispatch event when thought becomes active
  useEffect(() => {
    if (isThoughtActive) {
      try {
        window.dispatchEvent(new Event('analyzer-thought-started'));
      } catch (e) {}
    }
  }, [isThoughtActive]);

  // Listen for global force trigger from thought anticipation icon
  useEffect(() => {
    const handleForceTrigger = () => {
      triggerNewThought();
    };
    window.addEventListener('analyzer-force-trigger-thought', handleForceTrigger);
    return () => {
      window.removeEventListener('analyzer-force-trigger-thought', handleForceTrigger);
    };
  }, [triggerNewThought]);

  // Continuous Heartbeat Watchdog: ensures thoughts are properly scheduled if ever interrupted
  useEffect(() => {
    const watchdog = setInterval(() => {
      if (arePhrasesDisabled) return;
      if (!isThoughtActive && !nextThoughtTimerRef.current) {
        handleThoughtFinished();
      }
    }, 10000);
    return () => clearInterval(watchdog);
  }, [isThoughtActive, handleThoughtFinished, arePhrasesDisabled]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (nextThoughtTimerRef.current) clearTimeout(nextThoughtTimerRef.current);
    };
  }, []);

  // Interaction State:
  // isRevealed: whether text is currently showing
  // displayStage: 'sentient_dialogue' | 'advice' | 'followup_question' | 'how_are_you_question' | 'status_response' | 'random_word'
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [displayStage, setDisplayStage] = useState<'sentient_dialogue' | 'advice' | 'followup_question' | 'how_are_you_question' | 'status_response' | 'random_word'>('sentient_dialogue');
  const [responseText, setResponseText] = useState<string>('');
  const [randomWord, setRandomWord] = useState<RandomWordItem>(POWER_WORDS[0]);
  const sparkFadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Thinking state: when true, glitter sparkles surge by 2.4x and swirl inward in an analytical vortex!
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const thinkingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sentient Living Dialogue State
  const [activeDialogueText, setActiveDialogueText] = useState<string>('');
  const [activeDialogueOptions, setActiveDialogueOptions] = useState<Array<{ label: string; action: () => void }>>([]);
  const [isDissolving, setIsDissolving] = useState<boolean>(false);
  const [areOptionsRevealed, setAreOptionsRevealed] = useState<boolean>(false);
  const [isIntroChattering, setIsIntroChattering] = useState<boolean>(false);
  const dissolveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoFadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoClose10sTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCloudClickTimeRef = useRef<number>(0);
  const dialogueOpenedAtRef = useRef<number>(0);

  // Smooth reveal for response options whenever dialogue is active
  useEffect(() => {
    if (isRevealed && !isDissolving) {
      setAreOptionsRevealed(true);
    } else {
      setAreOptionsRevealed(false);
    }
  }, [isRevealed, isDissolving, activeDialogueText]);

  // Sync intro dialogue active state globally (to hide timer, buttons, icons, sections, and bottom navigation bar during intro dialogue)
  useEffect(() => {
    const isIntroActive = (isIntroChattering || isPersistentDialogue) && isRevealed;
    try {
      window.dispatchEvent(new CustomEvent('intro-dialogue-visibility', { detail: { active: isIntroActive } }));
    } catch {}
    if (isIntroActive) {
      document.documentElement.setAttribute('data-intro-dialogue-active', 'true');
    } else {
      document.documentElement.removeAttribute('data-intro-dialogue-active');
    }
  }, [isIntroChattering, isPersistentDialogue, isRevealed]);

  // Pause thoughts while dialogue is revealed
  useEffect(() => {
    if (isRevealed) {
      setIsThoughtActive(false);
      if (nextThoughtTimerRef.current) {
        clearTimeout(nextThoughtTimerRef.current);
        nextThoughtTimerRef.current = null;
      }
    }
  }, [isRevealed]);

  const closeDialogue = useCallback(() => {
    setIsIntroChattering(false);
    setIsPulseRingActive(false);
    if (autoFadeTimeoutRef.current) clearTimeout(autoFadeTimeoutRef.current);
    if (autoClose10sTimerRef.current) clearTimeout(autoClose10sTimerRef.current);
    try {
      window.dispatchEvent(new CustomEvent('analyzer-constellation-release'));
    } catch {}
    setIsDissolving(true);
    setTimeout(() => {
      setIsRevealed(false);
      setIsDissolving(false);

      // Advance to next fresh thought so it never repeats the previous thought after a dialogue!
      const nextT = getNextSequentialThought();
      if (nextT) {
        currentThoughtRef.current = nextT;
        setCurrentThought(nextT);
      }

      // ПОВЕРНЕННЯ У СВІЙ РИТМ:
      // Перехід у природний спокійний період тиші, після якого почнеться органічний показ думок
      try {
        window.dispatchEvent(new Event('analyzer-thought-quiet-window'));
      } catch (e) {}

      if (disableDialogues) {
        setNextThoughtTargetTime(null);
        return;
      }

      const randomQuietDelay = getRandomQuietDelay();
      const targetTime = Date.now() + randomQuietDelay;
      setNextThoughtTargetTime(targetTime);

      try {
        window.dispatchEvent(new CustomEvent('analyzer-thought-scheduled', {
          detail: { targetTime, totalDelay: randomQuietDelay }
        }));
      } catch (e) {}

      if (nextThoughtTimerRef.current) {
        clearTimeout(nextThoughtTimerRef.current);
        nextThoughtTimerRef.current = null;
      }

      nextThoughtTimerRef.current = setTimeout(() => {
        nextThoughtTimerRef.current = null;
        setNextThoughtTargetTime(null);
        if (disableDialogues) return;
        setIsThoughtActive(true); // Входить у свій регулярний ритм!
      }, randomQuietDelay);
    }, 500);
  }, [getRandomQuietDelay, disableDialogues]);

  // Auto-close dialogue after 14s if user does not respond (defocus blur transition)
  useEffect(() => {
    // У цьому початковому діалозі вікна просто так не зникають: він висить поки юзер не вибере щось
    if (isPersistentDialogue) {
      if (autoClose10sTimerRef.current) {
        clearTimeout(autoClose10sTimerRef.current);
        autoClose10sTimerRef.current = null;
      }
      return;
    }

    if (isRevealed && !isDissolving) {
      if (autoClose10sTimerRef.current) clearTimeout(autoClose10sTimerRef.current);
      autoClose10sTimerRef.current = setTimeout(() => {
        closeDialogue();
      }, 14000);
    } else {
      if (autoClose10sTimerRef.current) {
        clearTimeout(autoClose10sTimerRef.current);
        autoClose10sTimerRef.current = null;
      }
    }

    return () => {
      if (autoClose10sTimerRef.current) {
        clearTimeout(autoClose10sTimerRef.current);
        autoClose10sTimerRef.current = null;
      }
    };
  }, [isRevealed, isPersistentDialogue, activeDialogueText, displayStage, isDissolving, closeDialogue]);

  // Quick Mechanics State (Вікно Аналізатор / Швидкі механіки)
  const [isQuickMechanicsOpen, setIsQuickMechanicsOpen] = useState<boolean>(false);
  const [pendingSosFeedback, setPendingSosFeedback] = useState<boolean>(false);
  const prevQuickMechanicsOpen = useRef<boolean>(false);
  const [quickMechanicsSection, setQuickMechanicsSection] = useState<QuickMechanicsSection>('menu');
  const cloudTouchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const handleOpenQuickMechanics = () => {
      setQuickMechanicsSection('menu');
      setShellSettingsTab('mechanics');
      setIsAppearanceModalOpen(true);
    };
    const handleOpenHourlySlice = () => {
      setQuickMechanicsSection('slice');
      setShellSettingsTab('mechanics');
      setIsAppearanceModalOpen(true);
    };
    const handleSliceZero = () => {
      // Launch sentient dialogue for slice directly in the Analyzer cloud
      launchDialoguePhrase('slice');
    };
    const handleTriggerGratitudeDialogue = () => {
      launchDialoguePhrase('gratitude_journal');
    };
    const handleTriggerTaskDialogue = (e: any) => {
      const step = e?.detail;
      if (step) {
        const question = step.dialoguePrompt?.trim() || `Час для справи: «${step.title}»! Готовий виконати?`;
        setActiveDialogueText(question);
        setActiveDialogueOptions([
          {
            label: 'Виконано!',
            action: () => executeDialogueOption('daily_steps', {
              id: `task_done_${step.id}`,
              text: 'Виконано!',
              action: 'task_done',
              actionParam: step.id,
              visualReaction: 'joy'
            })
          },
          {
            label: 'Відкрити список справ',
            action: () => executeDialogueOption('daily_steps', {
              id: 'open_steps',
              text: 'Відкрити список',
              action: 'daily_steps',
              visualReaction: 'active'
            })
          },
          {
            label: 'Нагадати через 30 хв',
            action: () => executeDialogueOption('daily_steps', {
              id: `postpone_${step.id}`,
              text: 'Пізніше',
              action: 'remind_timer',
              actionParam: 30,
              visualReaction: 'calm',
              analyzerReply: 'Зрозумів, нагадаю за 30 хв.'
            })
          }
        ]);
        setDisplayStage('sentient_dialogue');
        setIsDissolving(false);
        setIsRevealed(true);
        setAreOptionsRevealed(true);
        setIsPulseRingActive(true);
        triggerColorShift('warm', 4500);
      } else {
        launchDialoguePhrase('daily_steps');
      }
    };
    const handleOpenAnalyzerModal = () => {
      if (onOpenModal) {
        onOpenModal();
      } else {
        setShellSettingsTab('appearance');
        setIsAppearanceModalOpen(true);
      }
    };
    window.addEventListener('open-quick-mechanics', handleOpenQuickMechanics);
    window.addEventListener('open-hourly-slice', handleOpenHourlySlice);
    window.addEventListener('slice-timer-reached-zero', handleSliceZero);
    window.addEventListener('trigger-gratitude-dialogue', handleTriggerGratitudeDialogue);
    window.addEventListener('trigger-task-dialogue', handleTriggerTaskDialogue);
    window.addEventListener('open-analyzer-modal', handleOpenAnalyzerModal);
    window.addEventListener('open-analyzer-window', handleOpenAnalyzerModal);

    return () => {
      window.removeEventListener('open-quick-mechanics', handleOpenQuickMechanics);
      window.removeEventListener('open-hourly-slice', handleOpenHourlySlice);
      window.removeEventListener('slice-timer-reached-zero', handleSliceZero);
      window.removeEventListener('trigger-gratitude-dialogue', handleTriggerGratitudeDialogue);
      window.removeEventListener('trigger-task-dialogue', handleTriggerTaskDialogue);
      window.removeEventListener('open-analyzer-modal', handleOpenAnalyzerModal);
      window.removeEventListener('open-analyzer-window', handleOpenAnalyzerModal);
    };
  }, [onOpenModal]);

  const handleCloudTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      cloudTouchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  }, []);

  const handleCloudTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (cloudTouchStartRef.current && e.changedTouches.length > 0) {
      cloudTouchStartRef.current = null;
    }
  }, []);

  // Proactive Tests Modals State (Аналізатор v.2)
  const [isHourlySliceModalOpen, setIsHourlySliceModalOpen] = useState<boolean>(false);
  const [isDailyLungModalOpen, setIsDailyLungModalOpen] = useState<boolean>(false);

  const getLiveCheckIn = useCallback(() => {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    let data: any = {};
    try {
      const raw = localStorage.getItem(`quit-smoking:health-checkin:${todayStr}`);
      if (raw) data = JSON.parse(raw);
    } catch {}

    // Check separate hydration store if present and synchronize
    try {
      const hydRaw = localStorage.getItem(`quit-smoking:hydration-${todayStr}`);
      if (hydRaw !== null) {
        const hydMl = parseInt(hydRaw, 10);
        if (!isNaN(hydMl) && (data.waterMl === undefined || data.waterMl < hydMl)) {
          data.waterMl = hydMl;
          data.waterGlasses = Math.floor(hydMl / 250);
        }
      }
    } catch {}

    return {
      waterGlasses: data.waterGlasses ?? 0,
      waterMl: data.waterMl ?? (data.waterGlasses ? data.waterGlasses * 250 : 0),
      coffeeCups: data.coffeeCups ?? 0,
      lastCoffeeTime: data.lastCoffeeTime ?? 'none',
      sleepHours: data.sleepHours ?? 7.5,
      sleepQuality: data.sleepQuality ?? 'deep',
      sleepSchedule: data.sleepSchedule ?? 'disrupted',
      cravingLevel: data.cravingLevel ?? 1,
      moodLevel: data.moodLevel ?? 4,
      energyLevel: data.energyLevel ?? 3,
      anxietyLevel: data.anxietyLevel ?? 1,
      intrusiveThoughtsLevel: data.intrusiveThoughtsLevel ?? 1,
      calmLevel: data.calmLevel ?? 4,
      stepsCount: data.stepsCount ?? 3000
    };
  }, []);

  const updateLiveCheckIn = useCallback((updater: (prev: any) => any) => {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    try {
      const prev = getLiveCheckIn();
      const updated = updater(prev);
      localStorage.setItem(`quit-smoking:health-checkin:${todayStr}`, JSON.stringify(updated));
      if (typeof updated.waterGlasses === 'number') {
        const ml = updated.waterMl ?? updated.waterGlasses * 250;
        localStorage.setItem(`quit-smoking:hydration-${todayStr}`, String(ml));
      }
      window.dispatchEvent(new Event('hydration-updated'));
      window.dispatchEvent(new Event('health-indicators-changed'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, [getLiveCheckIn]);

  const transitionToPhrase = useCallback((newText: string, newOptions: Array<{ label: string; action: () => void }>, autoDismissMs?: number) => {
    if (autoFadeTimeoutRef.current) clearTimeout(autoFadeTimeoutRef.current);
    if (autoClose10sTimerRef.current) clearTimeout(autoClose10sTimerRef.current);
    setIsDissolving(true);
    if (dissolveTimeoutRef.current) clearTimeout(dissolveTimeoutRef.current);
    dissolveTimeoutRef.current = setTimeout(() => {
      setActiveDialogueText(newText);
      setActiveDialogueOptions(newOptions);
      setIsDissolving(false);

      if (autoDismissMs) {
        autoFadeTimeoutRef.current = setTimeout(() => {
          setIsDissolving(true);
          setTimeout(() => {
            setIsRevealed(false);
            setIsDissolving(false);
          }, 500);
        }, autoDismissMs);
      }
    }, 400);
  }, []);

  // Persistent completion status: 'pending' | 'yes' | 'no'
  const [adviceStatus, setAdviceStatus] = useState<'pending' | 'yes' | 'no'>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:analyzer-advice-status');
      if (saved === 'yes' || saved === 'no' || saved === 'pending') return saved;
      return localStorage.getItem('quit-smoking:analyzer-warm') === 'true' ? 'yes' : 'pending';
    } catch {
      return 'pending';
    }
  });

  // Track whether the current advice was already delivered and skipped/dismissed
  const [isAdviceDelivered, setIsAdviceDelivered] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quit-smoking:analyzer-advice-delivered') === 'true';
    } catch {
      return false;
    }
  });

  // Transient visual flare: 'gold-flash' | 'warm' | 'red-flash' | null
  const [transientFlash, setTransientFlash] = useState<'gold-flash' | 'warm' | 'red-flash' | 'cyan-pulse' | 'purple-glow' | null>(null);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track acknowledged negative warnings: Red glow only shows when Analyzer notices a negative change and goes normal after warned/acknowledged!
  const [acknowledgedWarningKey, setAcknowledgedWarningKey] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:acknowledged-warning-key') || '';
    } catch {
      return '';
    }
  });

  const triggerColorShift = useCallback((flashMode: 'gold-flash' | 'warm' | 'red-flash' | 'cyan-pulse' | 'purple-glow', durationMs = 4500) => {
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setTransientFlash(flashMode);
    flashTimerRef.current = setTimeout(() => {
      setTransientFlash(null); // Smoothly and gradually transitions back to normal calm white-pink-blue!
    }, durationMs);
  }, []);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  // Improvise Dialogue Sequence:
  // 1. User presses "Імпровізуй" in dialogue
  // 2. Ring creates full-height cat silhouette
  // 3. Asks "Ну як тобі?"
  // 4. User replies "Несподівано."
  // 5. Analyzer says "Ну, гаразд. Тепер я готовий почати"
  // 6. Performs "танець зірочок" star dance animation
  // 7. Returns to normal mode
  const handleImproviseFlow = useCallback(() => {
    introJustClosedRef.current = true;
    try { localStorage.setItem('quit-smoking:intro-dialogue-shown', 'true'); } catch {}

    // 1. Кільце створює силует кота у повний зріст
    try {
      window.dispatchEvent(new Event('analyzer-ring-cat-silhouette'));
    } catch {}
    setVisualStyle('cat');
    try { localStorage.setItem('quit-smoking:analyzer-style', 'cat'); } catch {}

    // 2. І питає: "Ну як тобі?"
    setActiveDialogueText('Ну як тобі?');

    // 3. Відповідь: "Несподівано."
    setActiveDialogueOptions([
      {
        label: 'Несподівано.',
        action: () => {
          // 4. Аналізатор каже: "Ну, гаразд. Тепер я готовий почати"
          setActiveDialogueText('Ну, гаразд. Тепер я готовий почати');
          setActiveDialogueOptions([]);

          // 5. І робить анімацію танець зірочок
          try {
            window.dispatchEvent(new Event('analyzer-ring-star-dance'));
            window.dispatchEvent(new Event('analyzer-ring-sparkler-sparks'));
          } catch {}
          triggerColorShift('gold-flash', 3200);

          // 6. Потім звичайний режим
          setTimeout(() => {
            try {
              window.dispatchEvent(new Event('analyzer-ring-normal-mode'));
            } catch {}
            setIsPersistentDialogue(false);
            closeDialogue();
            handleThoughtFinished();
          }, 3200);
        }
      }
    ]);
    setDisplayStage('sentient_dialogue');
    setIsDissolving(false);
    setIsRevealed(true);
    setAreOptionsRevealed(true);
  }, [closeDialogue, handleThoughtFinished, triggerColorShift]);

  // Rethought Sentient Intro Dialogue: Shortened, concise, persistent until user chooses
  const launchIntroDialogue = useCallback(() => {
    if (disableDialogues) return;

    setIsPersistentDialogue(true);
    setIsIntroChattering(true);
    setIsPulseRingActive(true);
    triggerColorShift('warm', 9000);

    // Exact Ukrainian initial greeting copy:
    const introGreeting = `Привіт, я твій Аналізатор.

Налаштуєш мене чи мені імпровізувати?`;

    const options = [
      {
        label: 'Налаштувати',
        action: () => {
          introJustClosedRef.current = true;
          try { window.dispatchEvent(new Event('analyzer-ring-star-fade-pulse')); } catch {}
          setIsPersistentDialogue(false);
          try {
            localStorage.setItem('quit-smoking:intro-dialogue-shown', 'true');
          } catch {}
          setActiveDialogueText('Чудово! Відкриваю налаштування 🛠️');
          setActiveDialogueOptions([]);
          try {
            window.dispatchEvent(new CustomEvent('open-analyzer-dialogue-settings', { detail: { tab: 'dialogues' } }));
          } catch {}
          setTimeout(() => {
            closeDialogue();
            // Поява перших думок: прив'язана до моменту закінчення початкового діалогу!
            handleThoughtFinished();
          }, 1000);
        }
      },
      {
        label: 'Імпровізуй',
        action: () => {
          handleImproviseFlow();
        }
      }
    ];

    setActiveDialogueText(introGreeting);
    setActiveDialogueOptions(options);
    setDisplayStage('sentient_dialogue');
    setIsDissolving(false);
    setIsRevealed(true);
    setAreOptionsRevealed(true);
  }, [disableDialogues, triggerColorShift, closeDialogue, handleThoughtFinished, handleImproviseFlow]);

  // Listen for guided tour completion ("До головної") or manual re-test
  useEffect(() => {
    const handleTourFinished = () => {
      const hasShown = typeof window !== 'undefined' && localStorage.getItem('quit-smoking:intro-dialogue-shown') === 'true';
      if (!hasShown && !disableDialogues) {
        setTimeout(() => {
          launchIntroDialogue();
        }, 450);
      }
    };

    const handleManualTrigger = () => {
      launchIntroDialogue();
    };

    window.addEventListener('guided-tour-finished-go-home', handleTourFinished);
    window.addEventListener('trigger-intro-dialogue', handleManualTrigger);

    // If user already completed GuidedTourModal previously, but intro dialogue is pending
    const hasShown = typeof window !== 'undefined' && localStorage.getItem('quit-smoking:intro-dialogue-shown') === 'true';
    const hasWalked = typeof window !== 'undefined' && localStorage.getItem('quit-smoking:initial-walkthrough-completed') === 'true';
    let fallbackTimer: NodeJS.Timeout | null = null;
    if (!hasShown && hasWalked && !disableDialogues) {
      fallbackTimer = setTimeout(() => {
        launchIntroDialogue();
      }, 800);
    }

    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      window.removeEventListener('guided-tour-finished-go-home', handleTourFinished);
      window.removeEventListener('trigger-intro-dialogue', handleManualTrigger);
    };
  }, [launchIntroDialogue, disableDialogues]);

  // Track the signature of data when user last saw advice
  const [lastViewedSignature, setLastViewedSignature] = useState<string>(() => {
    try {
      return localStorage.getItem('quit-smoking:analyzer-last-sig') || '';
    } catch {
      return '';
    }
  });

  // Listen to application events to detect new data
  useEffect(() => {
    const handleStorage = () => {
      setRefreshTrigger(prev => prev + 1);

      // Trigger beautiful pulsing halo around the glitter/fire visual
      setIsPulseRingActive(true);
      if (pulseRingTimeoutRef.current) clearTimeout(pulseRingTimeoutRef.current);
      pulseRingTimeoutRef.current = setTimeout(() => {
        setIsPulseRingActive(false);
      }, 7000);
    };

    const handleVisualChange = () => {
      try {
        const saved = localStorage.getItem('quit-smoking:analyzer-style');
        if (saved === 'autumn' || saved === 'fire') {
          setVisualStyle('autumn');
        } else if (saved === 'snowflake' || saved === 'flower' || saved === 'wave' || saved === 'cat' || saved === 'standard') {
          setVisualStyle(saved as any);
        } else {
          setVisualStyle('standard');
        }
      } catch {}
    };

    const handlePointChange = (e: any) => {
      if (typeof e?.detail === 'number') {
        const p = Math.max(1, Math.min(3, Math.round(e.detail)));
        if (REST_LIGHT_POINTS[p]) updateRestHue(REST_LIGHT_POINTS[p].hue);
      } else {
        try {
          const saved = localStorage.getItem('quit-smoking:analyzer-rest-point');
          if (saved) {
            const p = parseInt(saved, 10);
            if (REST_LIGHT_POINTS[p]) updateRestHue(REST_LIGHT_POINTS[p].hue);
          }
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('storage', handleVisualChange);
    window.addEventListener('analyzer-style-change', handleVisualChange);
    window.addEventListener('analyzer-rest-point-changed', handlePointChange);
    window.addEventListener('hydration-updated', handleStorage);
    window.addEventListener('quit-date-changed', handleStorage);
    window.addEventListener('prompt-history-change', handleStorage);
    window.addEventListener('daily-steps-change', handleStorage);
    window.addEventListener('gratitude-saved', handleStorage);
    window.addEventListener('quick-goal-data-change', handleStorage);
    window.addEventListener('health-indicators-changed', handleStorage);

    return () => {
      if (pulseRingTimeoutRef.current) clearTimeout(pulseRingTimeoutRef.current);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('storage', handleVisualChange);
      window.removeEventListener('analyzer-style-change', handleVisualChange);
      window.removeEventListener('analyzer-rest-point-changed', handlePointChange);
      window.removeEventListener('hydration-updated', handleStorage);
      window.removeEventListener('quit-date-changed', handleStorage);
      window.removeEventListener('prompt-history-change', handleStorage);
      window.removeEventListener('daily-steps-change', handleStorage);
      window.removeEventListener('gratitude-saved', handleStorage);
      window.removeEventListener('quick-goal-data-change', handleStorage);
      window.removeEventListener('health-indicators-changed', handleStorage);
    };
  }, []);

  const todayStr = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);

  // Compute current data signature
  const currentSignature = useMemo(() => {
    try {
      const daysRaw = localStorage.getItem('quit-smoking:days') || '';
      const hydrationRaw = localStorage.getItem(`quit-smoking:hydration-${todayStr}`) || '0';
      const sleepRaw = localStorage.getItem(`quit-smoking:sleep-${todayStr}`) || '';
      const triggersRaw = localStorage.getItem('quit-smoking:triggers') || '';
      const morningRaw = localStorage.getItem(`quit-smoking:morning-${todayStr}`) || '';
      const crisisRaw = localStorage.getItem('quit-smoking:crisis-events') || '';
      return `${daysRaw.length}-${daysRaw.slice(-30)}-${hydrationRaw}-${sleepRaw.slice(-20)}-${morningRaw}-${triggersRaw.length}-${crisisRaw.length}`;
    } catch {
      return '0';
    }
  }, [refreshTrigger, todayStr]);

  // Gather health & behavior metrics
  const metrics = useMemo(() => {
    let craving = 1;
    let mood = 4;
    let energy = 4;
    let anxiety = 1;
    let water = 0;
    let sleepHours = 7.5;
    let coffee = false;
    let daysQuit = 0;
    let currentHour = new Date().getHours();

    try {
      const savedStartDate = localStorage.getItem('quit-smoking:start-date');
      if (savedStartDate) {
        const start = new Date(savedStartDate).getTime();
        const now = Date.now();
        if (!isNaN(start) && start <= now) {
          daysQuit = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        }
      }

      const savedDays = localStorage.getItem('quit-smoking:days');
      if (savedDays) {
        const daysMap = JSON.parse(savedDays);
        if (daysMap && daysMap[todayStr]) {
          const surveys = daysMap[todayStr].surveys || daysMap[todayStr].entries || [];
          if (surveys.length > 0) {
            const latest = surveys[surveys.length - 1];
            if (typeof latest.craving === 'number') craving = latest.craving;
            if (typeof latest.mood === 'number') mood = latest.mood;
            if (typeof latest.energy === 'number') energy = latest.energy;
            if (typeof latest.anxiety === 'number') anxiety = latest.anxiety;
          }
        }
      }

      const savedWater = localStorage.getItem(`quit-smoking:hydration-${todayStr}`);
      if (savedWater) water = parseInt(savedWater, 10) || 0;

      const savedSleep = localStorage.getItem(`quit-smoking:sleep-${todayStr}`);
      if (savedSleep) {
        const parsed = JSON.parse(savedSleep);
        sleepHours = parseFloat(parsed.hours || parsed.duration || 7.5);
      }

      const savedMorning = localStorage.getItem(`quit-smoking:morning-${todayStr}`);
      if (savedMorning === 'true') coffee = true;
    } catch (e) {}

    return { 
      craving, 
      mood, 
      energy, 
      anxiety, 
      water, 
      sleepHours, 
      coffee, 
      daysQuit, 
      currentHour 
    };
  }, [refreshTrigger, todayStr]);

  // Helper to trigger thinking state with surge of sparkles (factor 2.4x)
  const triggerThinking = useCallback((durationMs = 1300) => {
    if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);
    setIsThinking(true);
    thinkingTimeoutRef.current = setTimeout(() => {
      setIsThinking(false);
    }, durationMs);
  }, []);

  // 1. SMART ORGANISM STATE EVALUATION & FORECAST (Аналізатор v.2)
  // Розуміє який стан організму юзера на даний момент і яким ймовірно буде.
  // Кожного разу коли Аналізатор має що порадити — його світло червонувате.
  // У спокійному стані він біло—рожевий—блакитний.
  const organismDiagnosis = useMemo(() => {
    const live = getLiveCheckIn();
    const { craving, energy, anxiety, water, sleepHours, coffee, daysQuit, currentHour } = metrics;
    
    // Weight-based personalized water target
    let weight = 70;
    try {
      const w = localStorage.getItem('quit-smoking:physio-weight');
      if (w && !isNaN(Number(w))) weight = Number(w);
    } catch {}
    const personalizedWaterMl = Math.max(1500, Math.round(weight * 35));
    const effectiveWaterMl = Math.max(water, live.waterMl || (live.waterGlasses * 250));
    const effectiveGlasses = live.waterGlasses || Math.floor(effectiveWaterMl / 250);
    const waterRatio = effectiveWaterMl / personalizedWaterMl;
    const sleepSchedule = live.sleepSchedule || 'disrupted';
    const intrusive = live.intrusiveThoughtsLevel || 1;
    const steps = live.stepsCount || 3000;
    const isCoffeeLate = coffee && (live.lastCoffeeTime === 'evening' || (currentHour >= 16 && live.coffeeCups >= 2));

    // Check hydration snooze (if user clicked "Зрозумів", snooze for 1 hour)
    let isHydrationSnoozed = false;
    try {
      const snoozeUntil = parseInt(localStorage.getItem('quit-smoking:hydration-snooze-until') || '0', 10);
      if (Date.now() < snoozeUntil) {
        isHydrationSnoozed = true;
      }
    } catch {}

    // Priority Check 0: 1-hour Calm Rest mode after user confirmed "Так, все гаразд"
    let isCalmRestActive = false;
    try {
      const calmUntil = parseInt(localStorage.getItem('quit-smoking:all-good-calm-until') || '0', 10);
      if (Date.now() < calmUntil) {
        isCalmRestActive = true;
      }
    } catch {}

    if (isCalmRestActive) {
      return {
        hasAdvice: false,
        isAllGood: true,
        topic: 'harmony' as const,
        headline: 'Організм у стані природної рівноваги (Режим спокою)',
        currentStatus: `Зараз: всі показники в гармонії. Режим спокою активний.`,
        forecast: `Прогноз: висока стабільність нейрогуморальної системи та спокійний стан (гармонія 100%).`,
        adviceText: `Все гаразд. Всі біопоказники в гармонії, пульс спокійний, дихання чисте. Я поруч ✨`,
        recommendedActionLabel: 'Дякую'
      };
    }

    // Priority Check 1: Severe Dehydration
    if (!isHydrationSnoozed && (waterRatio < 0.45 || (effectiveGlasses < 2 && effectiveWaterMl < 500))) {
      return {
        hasAdvice: true,
        isAllGood: false,
        topic: 'water' as const,
        headline: 'Зневоднення та судинний спазм',
        currentStatus: `Зараз: вжито ${effectiveWaterMl} мл (${effectiveGlasses} скл.) з норми ${personalizedWaterMl} мл. Плазма крові згущена, слизові оболонки сухі.`,
        forecast: `Прогноз: через 30–45 хв посилиться головний біль та виникне хибний позив закурити (ймовірність 82%), спровокований дефіцитом вологи.`,
        adviceText: `Випий чашку чистої води просто зараз — це миттєво зніме судинний спазм і поверне легкість дихання 💧`,
        recommendedActionLabel: 'Випив чашку'
      };
    }

    // Priority Check 2: Acute Craving or Adrenaline Spike
    if (craving >= 3 || anxiety >= 4) {
      return {
        hasAdvice: true,
        isAllGood: false,
        topic: 'craving' as const,
        headline: 'Хімічна хвиля тяги / Адреналіновий пік',
        currentStatus: `Зараз: рівень тяги ${craving}/5, тривожність ${anxiety}/5. Симпатична нервова система збуджена, капіляри звужені.`,
        forecast: `Прогноз: ця фізіологічна хвиля триватиме ще 3–5 хвилин. При перемиканні уваги тяга спаде на 85%.`,
        adviceText: `Зроби 5 повільних видихів за схемою 4-7-8 та випий води. Ми дихаємо разом з тобою — ця хвиля обов'язково спаде.`,
        recommendedActionLabel: 'Дихання 4-7-8'
      };
    }

    // Priority Check 3: Disrupted Sleep Schedule / Sleep Deprivation
    if (sleepSchedule === 'disrupted' || sleepHours < 6.5) {
      return {
        hasAdvice: true,
        isAllGood: false,
        topic: 'sleep' as const,
        headline: 'Збитий циркадний ритм та дефіцит енергії',
        currentStatus: `Зараз: сон тривав ${sleepHours} год (режим плаваючий). Префронтальна кора має дефіцит дофаміну та гальмівних медіаторів.`,
        forecast: `Прогноз: очікується різкий пообідній або вечірній спад сили волі (ймовірність втоми 74%), мозок шукатиме швидкий стимул.`,
        adviceText: `Дай собі м'який день і не вимагай надзусиль. Зроби 15-хвилинну паузу для очей і спокійного відпочинку 🌿`,
        recommendedActionLabel: 'Зрозуміло, тримаюся'
      };
    }

    // Priority Check 4: Excess / Late Coffee
    if (isCoffeeLate || live.coffeeCups >= 3) {
      return {
        hasAdvice: true,
        isAllGood: false,
        topic: 'coffee' as const,
        headline: 'Кофеїнове перевантаження рецепторів',
        currentStatus: `Зараз: випито ${live.coffeeCups || 2} чашки кави на тлі вечірнього часу. Аденозинові рецептори заблоковані.`,
        forecast: `Прогноз: високий ризик поверхневого сну та нічної тривожності (68%). Пульс залишиться підвищеним.`,
        adviceText: `Зупини кофеїн на сьогодні. Склянка води з лимоном або трав'яний чай знімуть вегетативне збудження 🍵`,
        recommendedActionLabel: '+1 склянка води'
      };
    }

    // Priority Check 5: Intrusive Thoughts / Sensory Tunnel
    if (intrusive >= 3) {
      return {
        hasAdvice: true,
        isAllGood: false,
        topic: 'intrusive' as const,
        headline: 'Нав’язливі фонові думки (активність DMN)',
        currentStatus: `Зараз: рівень нав'язливості ${intrusive}/5. Дефолт-система мозку прокручує старі нейронні шаблони звички.`,
        forecast: `Прогноз: без перемикання сенсорного фокусу ментальна втома посилиться, провокуючи внутрішній діалог.`,
        adviceText: `Перемкни увагу в тіло: торкнися 5 різних предметів навколо та відчуй їхню текстуру. Твій розум вільний від тютюну.`,
        recommendedActionLabel: 'Заземлення'
      };
    }

    // Priority Check 6: Sedentary Afternoon
    if (steps < 2000 && currentHour >= 14) {
      return {
        hasAdvice: true,
        isAllGood: false,
        topic: 'steps' as const,
        headline: 'Застій кровообігу та низький тонус',
        currentStatus: `Зараз: активність лише ${steps} кроків. Знижена оксигенація тканин, уповільнений метаболізм.`,
        forecast: `Прогноз: до вечора посилиться млявість та сонливість (ймовірність 65%), що послабить самоконтроль.`,
        adviceText: `Зроби 10-хвилинну неспішну прогулянку — це підніме природний дофамін без будь-яких стимуляторів 🚶`,
        recommendedActionLabel: 'Пройдуся 🚶'
      };
    }

    // Priority Check 7: Low Lung Capacity / Breath hold (Штанге замір)
    let lastLungSec: number | null = null;
    try {
      const s = localStorage.getItem('quit-smoking:last-lung-test-seconds');
      if (s) lastLungSec = parseFloat(s);
    } catch {}

    if (lastLungSec !== null && lastLungSec < 22) {
      return {
        hasAdvice: true,
        isAllGood: false,
        topic: 'lung' as const,
        headline: 'Очищення альвеол та адаптація дихання',
        currentStatus: `Зараз: остання затримка дихання склала ${lastLungSec} с (початковий резерв). Альвеоли та бронхіоли поступово звільняються від смол.`,
        forecast: `Прогноз: регулярні дихальні паузи підвищать життєвий об'єм легень на 25% за перші 10-14 днів чистого дихання.`,
        adviceText: `Виконай 5 м'яких циклів діафрагмального дихання: вдих животом на 4с, видих на 6с через губи. Легені регенерують щомиті 🫁`,
        recommendedActionLabel: 'Дихати животом'
      };
    }

    // Default Case: Everything is in Harmony! (Все гаразд)
    return {
      hasAdvice: false,
      isAllGood: true,
      topic: 'harmony' as const,
      headline: 'Організм у стані природної рівноваги',
      currentStatus: `Зараз: всі показники в гармонії. Водний баланс (${effectiveWaterMl} мл), пульс спокійний, дихання вільне, ацетилхолінові рецептори регенерують.`,
      forecast: `Прогноз: прогнозується висока стабільність нейрогуморальної системи, глибокий сон та спокійний вечір (гармонія 92%).`,
      adviceText: `Все гаразд. Всі біопоказники в гармонії, пульс спокійний, дихання чисте. Я поруч ✨`,
      recommendedActionLabel: 'Дякую'
    };
  }, [getLiveCheckIn, metrics]);

  // Synchronize hasAdvice globally for all analyzer indicators
  useEffect(() => {
    try {
      localStorage.setItem('quit-smoking:analyzer-has-advice', String(organismDiagnosis.hasAdvice));
      window.dispatchEvent(new CustomEvent('analyzer-has-advice-changed', { detail: organismDiagnosis.hasAdvice }));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }, [organismDiagnosis.hasAdvice]);

  // Current warning key identifying the specific negative issue detected by the Analyzer
  const currentWarningKey = useMemo(() => {
    if (!organismDiagnosis.hasAdvice) return '';
    return `${organismDiagnosis.topic}_${organismDiagnosis.headline}_${organismDiagnosis.currentStatus}`;
  }, [organismDiagnosis.hasAdvice, organismDiagnosis.topic, organismDiagnosis.headline, organismDiagnosis.currentStatus]);

  // Red glow is ONLY active when Analyzer noticed a negative change AND user has NOT yet been warned / acknowledged it!
  // Після того як юзер натиснув Добре або виконує те що каже аналізатор світіння стає нормальним спокійним.
  // Червоне світіння тільки тоді коли Аналізатор помітив якусь негативну зміну.
  // Після попередження про неї він стає нормальним.
  const isRedGlowActive = useMemo(() => {
    if (!organismDiagnosis.hasAdvice) return false;
    return acknowledgedWarningKey !== currentWarningKey;
  }, [organismDiagnosis.hasAdvice, acknowledgedWarningKey, currentWarningKey]);

  // Helper to acknowledge the negative warning so the red glow immediately turns calm normal!
  const acknowledgeNegativeWarning = useCallback((customKey?: string) => {
    const key = currentWarningKey || (customKey ? `${customKey}_acknowledged` : `${organismDiagnosis.topic}_acknowledged`);
    setAcknowledgedWarningKey(key);
    try {
      localStorage.setItem('quit-smoking:acknowledged-warning-key', key);
      window.dispatchEvent(new CustomEvent('analyzer-ring-expand-react'));
    } catch {}
    setTransientFlash(null);
  }, [currentWarningKey, organismDiagnosis.topic]);

  // Determine if there is a negative shift (high craving, anxiety, exhaustion, dehydration)
  const isNegativeShift = useMemo(() => {
    return organismDiagnosis.hasAdvice;
  }, [organismDiagnosis.hasAdvice]);

  // Compute analyzer advice text - explicitly written in the collective "Ми" voice
  const currentAdviceText = useMemo(() => {
    return `${organismDiagnosis.currentStatus} ${organismDiagnosis.forecast}\n\n${organismDiagnosis.adviceText}`;
  }, [organismDiagnosis]);

  // Has new data arrived since the last time the user viewed advice?
  const hasNewData = useMemo(() => {
    return currentSignature !== lastViewedSignature;
  }, [currentSignature, lastViewedSignature]);

  // When fresh new health data arrives, reset delivery status so advice comes first!
  useEffect(() => {
    if (hasNewData && lastViewedSignature !== '') {
      setIsAdviceDelivered(false);
      setAdviceStatus('pending');
      try {
        localStorage.setItem('quit-smoking:analyzer-advice-delivered', 'false');
        localStorage.setItem('quit-smoking:analyzer-advice-status', 'pending');
        localStorage.setItem('quit-smoking:analyzer-warm', 'false');
      } catch {}
    }
  }, [hasNewData, lastViewedSignature]);

  // Active visual mode:
  // After changing color to yellow (warm, gold-flash) or red (red-flash) — the color smoothly returns to normal (pink-white)!
  const activeMode: VisualEnergyMode = useMemo(() => {
    if (transientFlash) return transientFlash;
    return 'normal';
  }, [transientFlash]);

  const handleUserSaysAllGood = useCallback((_live?: any) => {
    // User responded "Так, все гаразд" -> Any analyzer shell switches to Calm Rest mode for 1 hour!
    const calmUntil = Date.now() + 60 * 60 * 1000; // 1 hour (60 minutes)
    try {
      localStorage.setItem('quit-smoking:all-good-calm-until', String(calmUntil));
      localStorage.setItem('quit-smoking:last-how-are-you-time', String(Date.now()));
      localStorage.setItem('quit-smoking:analyzer-has-advice', 'false');
      localStorage.setItem('quit-smoking:analyzer-advice-status', 'yes');
      localStorage.setItem('quit-smoking:analyzer-warm', 'false');
      localStorage.removeItem('quit-smoking:analyzer-last-topic');
      window.dispatchEvent(new CustomEvent('analyzer-has-advice-changed', { detail: false }));
      window.dispatchEvent(new Event('storage'));
    } catch {}

    acknowledgeNegativeWarning('all_good_calm');
    setTransientFlash(null); // Switch all shells immediately to pure Calm Rest!

    transitionToPhrase("Тішуся, що все гаразд ✨ Переходжу в режим спокою на годину. Я поруч 🌿", [
      { 
        label: "Дякую", 
        action: () => {
          closeDialogue();
        } 
      }
    ], 4500);
  }, [acknowledgeNegativeWarning, transitionToPhrase, closeDialogue]);

  // 1. Ask what specifically is wrong and lead directly to full slice or triggerfix
  const askWhatIsWrong = useCallback(() => {
    // Reset acknowledgment so that this issue is actively flagged
    setAcknowledgedWarningKey('');
    try { localStorage.removeItem('quit-smoking:acknowledged-warning-key'); } catch {}

    triggerColorShift('warm', 4000);
    setActiveDialogueText("Зафіксуємо стан?");
    setActiveDialogueOptions([
      {
        label: "Пройти зріз",
        action: () => {
          setQuickMechanicsSection('slice');
          setIsQuickMechanicsOpen(true);
          closeDialogue();
        }
      },
      {
        label: "Тригерфікс",
        action: () => {
          setQuickMechanicsSection('triggerfix');
          setIsQuickMechanicsOpen(true);
          closeDialogue();
        }
      }
    ]);
    setDisplayStage('sentient_dialogue');
    setIsDissolving(false);
    setIsRevealed(true);
  }, [closeDialogue, triggerColorShift]);

  // ================= DYNAMIC DIALOGUE ACTION EXECUTOR =================
  const executeDialogueOption = useCallback((phraseId: string, opt: DialogueOptionConfig) => {
    try {
      window.dispatchEvent(new Event('analyzer-ring-star-fade-pulse'));
    } catch {}

    const allActions = getAllAnalyzerActions();
    const actionDef = allActions.find((a) => a.id === opt.action);
    const effectiveAction = actionDef?.behavior || opt.action;
    const reply = opt.analyzerReply?.trim() || actionDef?.defaultReply?.trim();

    // Trigger visual/light/animation reaction on user choice:
    const lowerText = opt.text.toLowerCase();
    if (lowerText.includes('імпровіз') || (opt.action as string) === 'improvise') {
      handleImproviseFlow();
      return;
    }

    if (lowerText.includes('ок') || lowerText.includes('зрозумів') || lowerText.includes('гаразд')) {
      try {
        window.dispatchEvent(new CustomEvent('analyzer-ring-expand-react'));
      } catch {}
    }

    const reaction = opt.visualReaction || (
      lowerText.includes('добре') ||
      lowerText.includes('ок') ||
      lowerText.includes('спокійно') ||
      lowerText.includes('супер') ||
      effectiveAction === 'close_quiet'
        ? 'joy'
        : effectiveAction === 'remind_timer'
          ? 'calm'
          : 'active'
    );

    if (reaction === 'joy') {
      // Режим радості — коли юзер каже все ок / обирає радісний варіант
      triggerColorShift('gold-flash', 6000);
      setIsPulseRingActive(true);
      if (pulseRingTimeoutRef.current) clearTimeout(pulseRingTimeoutRef.current);
      pulseRingTimeoutRef.current = setTimeout(() => {
        setIsPulseRingActive(false);
      }, 6000);
    } else if (reaction === 'active') {
      // Режим повідомлення — активна пульсація й дія
      triggerColorShift('warm', 5000);
      setIsPulseRingActive(true);
      if (pulseRingTimeoutRef.current) clearTimeout(pulseRingTimeoutRef.current);
      pulseRingTimeoutRef.current = setTimeout(() => {
        setIsPulseRingActive(false);
      }, 5000);
    } else if (reaction === 'calm') {
      // Спокійний режим — м'яке медитативне повернення у базовий спокій
      setTransientFlash(null);
      setIsPulseRingActive(false);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    }

    switch (effectiveAction) {
      case 'slice':
        triggerThinking(600);
        setQuickMechanicsSection('slice');
        setIsQuickMechanicsOpen(true);
        closeDialogue();
        break;

      case 'analysis':
        triggerThinking(600);
        setQuickMechanicsSection('analysis');
        setIsQuickMechanicsOpen(true);
        closeDialogue();
        break;

      case 'triggerfix':
        triggerThinking(600);
        setQuickMechanicsSection('triggerfix');
        setIsQuickMechanicsOpen(true);
        closeDialogue();
        break;

      case 'lung_test':
        triggerThinking(600);
        setIsDailyLungModalOpen(true);
        closeDialogue();
        break;

      case 'gratitude_journal':
        triggerThinking(600);
        triggerColorShift('gold-flash', 3500);
        try {
          window.dispatchEvent(new Event('open-gratitude-modal'));
          window.dispatchEvent(new CustomEvent('change-tab', { detail: 'counter' }));
        } catch {}
        closeDialogue();
        break;

      case 'daily_steps':
        triggerThinking(600);
        triggerColorShift('purple-glow', 3500);
        try {
          window.dispatchEvent(new Event('open-daily-steps-modal'));
          window.dispatchEvent(new CustomEvent('change-tab', { detail: 'counter' }));
        } catch {}
        closeDialogue();
        break;

      case 'task_done': {
        const taskId = String(opt.actionParam || '');
        let pct = 20;
        if (taskId) {
          try {
            const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
            const d = new Date();
            const todayK = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
            const histStr = localStorage.getItem('quit-smoking:daily-steps-history');
            const hist = histStr ? JSON.parse(histStr) : {};
            const currentList: string[] = hist[todayK] || [];
            if (!currentList.includes(taskId)) {
              currentList.push(taskId);
              hist[todayK] = currentList;
              localStorage.setItem('quit-smoking:daily-steps-history', JSON.stringify(hist));
              window.dispatchEvent(new Event('daily-steps-change'));
              window.dispatchEvent(new Event('storage'));
            }

            const stepsStr = localStorage.getItem('quit-smoking:daily-micro-steps');
            const stepsList = stepsStr ? JSON.parse(stepsStr) : [];
            const totalCount = Math.max(1, stepsList.length);
            const completedCount = currentList.length;
            pct = Math.min(100, Math.round((completedCount / totalCount) * 100));
          } catch {}
        }
        triggerColorShift('gold-flash', 4500);
        const taskPctReply = reply || `${pct}% сьогоднішніх справ уже зроблено! 🎉`;
        transitionToPhrase(
          taskPctReply,
          [{ label: "Супер!", action: closeDialogue }],
          4000
        );
        break;
      }

      case 'hydration': {
        const addMl = Number(opt.actionParam || actionDef?.actionParam) || 250;
        triggerThinking(800);
        updateLiveCheckIn((p: any) => {
          const newMl = (p.waterMl || 0) + addMl;
          const newGlasses = Math.floor(newMl / 250);
          return { ...p, waterGlasses: newGlasses, waterMl: newMl };
        });
        acknowledgeNegativeWarning('water');
        triggerColorShift('cyan-pulse', 3500);
        try {
          localStorage.setItem('quit-smoking:last-hydration-prompt-time', String(Date.now()));
          window.dispatchEvent(new Event('water-intake-updated'));
        } catch {}
        const positiveReply = reply || 'Ловлю на слові.';
        transitionToPhrase(positiveReply, [
          { label: "Дякую", action: closeDialogue }
        ], 3000);
        break;
      }

      case 'remind_timer': {
        const minutes = Number(opt.actionParam || actionDef?.actionParam) || 30;
        const now = Date.now();
        const remindAt = now + minutes * 60 * 1000;
        try {
          localStorage.setItem(`quit-smoking:timer-remind-${phraseId}`, String(remindAt));
          if (phraseId === 'slice') {
            localStorage.setItem('quit-smoking:last-prompt', String(now));
            localStorage.setItem('quit-smoking:last-hourly-prompt-time', String(now));
          } else if (phraseId === 'lung_test') {
            localStorage.setItem('quit-smoking:last-lung-prompt-time', String(now));
          } else if (phraseId === 'triggerfix') {
            localStorage.setItem('quit-smoking:last-triggerfix-prompt-time', String(now));
          } else if (phraseId === 'hydration') {
            localStorage.setItem('quit-smoking:last-hydration-prompt-time', String(now));
          }
          window.dispatchEvent(new Event('prompt-interval-change'));
          window.dispatchEvent(new Event('storage'));
        } catch {}
        triggerColorShift('warm', 2500);
        transitionToPhrase(
          reply || `Зрозумів, нагадаю за таймером через ${minutes < 60 ? `${minutes} хв` : `${minutes / 60} год`} 🌿`,
          [{ label: "Добре", action: closeDialogue }],
          4000
        );
        break;
      }

      case 'box_breath':
        triggerColorShift('warm', 4000);
        transitionToPhrase(
          "Квадратне дихання 4-4-4-4: 4с вдих, 4с затримка, 4с видих, 4с затримка...",
          [{ label: "Ритм стабілізовано ✨", action: closeDialogue }],
          10000
        );
        break;

      case 'mint_tea':
        triggerColorShift('warm', 3000);
        transitionToPhrase(
          reply || "М'ята розслабляє гладку мускулатуру, знімає спазм і повертає фокус ☕",
          [{ label: "Чудово ✨", action: closeDialogue }],
          5000
        );
        break;

      case 'cold_compress':
        triggerColorShift('cyan-pulse', 3000);
        transitionToPhrase(
          reply || "Охолодження скронь переключає рецептори шкіри і знімає психологічний затиск ❄️",
          [{ label: "Напруга спала ✨", action: closeDialogue }],
          5000
        );
        break;

      case 'style_cat':
        setVisualStyle('cat');
        try { localStorage.setItem('quit-smoking:analyzer-style', 'cat'); } catch {}
        window.dispatchEvent(new Event('analyzer-style-change'));
        transitionToPhrase(reply || "Оболонку переключено на Чорного кота!", [{ label: "Добре", action: closeDialogue }], 4000);
        break;

      case 'style_wave':
        setVisualStyle('wave');
        try { localStorage.setItem('quit-smoking:analyzer-style', 'wave'); } catch {}
        window.dispatchEvent(new Event('analyzer-style-change'));
        transitionToPhrase(reply || "Оболонку переключено на режим Хвилі.", [{ label: "Добре", action: closeDialogue }], 4000);
        break;

      case 'style_cosmic_ring':
        setVisualStyle('standard');
        try { localStorage.setItem('quit-smoking:analyzer-style', 'standard'); } catch {}
        window.dispatchEvent(new Event('analyzer-style-change'));
        transitionToPhrase(reply || "Оболонку переключено на Глітер ✨", [{ label: "Добре", action: closeDialogue }], 4000);
        break;

      case 'style_glitter':
        setVisualStyle('standard');
        try { localStorage.setItem('quit-smoking:analyzer-style', 'standard'); } catch {}
        window.dispatchEvent(new Event('analyzer-style-change'));
        transitionToPhrase(reply || "Оболонку переключено на Глітер.", [{ label: "Добре", action: closeDialogue }], 4000);
        break;

      case 'set_hue_sakura':
        updateRestHue(330);
        updateColorActiveMode('color');
        transitionToPhrase(reply || "Спектр сяйва змінено на Сакура (330°).", [{ label: "Гарно ✨", action: closeDialogue }], 4000);
        break;

      case 'set_hue_ocean':
        updateRestHue(210);
        updateColorActiveMode('color');
        transitionToPhrase(reply || "Спектр сяйва змінено на Океан (210°).", [{ label: "Добре", action: closeDialogue }], 4000);
        break;

      case 'style_snowflake':
        setVisualStyle('snowflake');
        try { localStorage.setItem('quit-smoking:analyzer-style', 'snowflake'); } catch {}
        window.dispatchEvent(new Event('analyzer-style-change'));
        transitionToPhrase(reply || "Оболонку переключено на Сніжинку.", [{ label: "Добре", action: closeDialogue }], 4000);
        break;

      case 'style_autumn':
        setVisualStyle('autumn');
        try { localStorage.setItem('quit-smoking:analyzer-style', 'autumn'); } catch {}
        window.dispatchEvent(new Event('analyzer-style-change'));
        transitionToPhrase(reply || "Оболонку переключено на режим Осені.", [{ label: "Добре", action: closeDialogue }], 4000);
        break;

      case 'style_flower':
        setVisualStyle('flower');
        try { localStorage.setItem('quit-smoking:analyzer-style', 'flower'); } catch {}
        window.dispatchEvent(new Event('analyzer-style-change'));
        transitionToPhrase(reply || "Оболонку переключено на Квітку.", [{ label: "Добре", action: closeDialogue }], 4000);
        break;

      case 'set_hue_emerald':
        updateRestHue(140);
        updateColorActiveMode('color');
        transitionToPhrase(reply || "Спектр сяйва змінено на Смарагд (140°).", [{ label: "Гарно", action: closeDialogue }], 4000);
        break;

      case 'set_hue_amber':
        updateRestHue(45);
        updateColorActiveMode('color');
        transitionToPhrase(reply || "Спектр сяйва змінено на Янтар (45°).", [{ label: "Тепло", action: closeDialogue }], 4000);
        break;

      case 'set_hue_uv':
        updateRestHue(280);
        updateColorActiveMode('color');
        transitionToPhrase(reply || "Спектр сяйва змінено на Ультрафіолет (280°).", [{ label: "Супер", action: closeDialogue }], 4000);
        break;

      case 'set_hue_custom': {
        const val = Number(opt.actionParam || actionDef?.actionParam || 180);
        updateRestHue(val);
        updateColorActiveMode('color');
        transitionToPhrase(reply || `Спектр сяйва змінено на градус ${val}°.`, [{ label: "Чудово", action: closeDialogue }], 4000);
        break;
      }

      case 'set_mode_mono_black':
        updateRestLightness(0);
        updateColorActiveMode('monochrome');
        transitionToPhrase(reply || "Увімкнено темний монохромний режим.", [{ label: "Зрозуміло", action: closeDialogue }], 4000);
        break;

      case 'set_mode_color':
        updateColorActiveMode('color');
        transitionToPhrase(reply || "Повнокольоровий спектр оболонки відновлено.", [{ label: "Яскраво", action: closeDialogue }], 4000);
        break;

      case 'set_blur_max':
        updateRestBlur(12);
        transitionToPhrase(reply || "Максимальну розмитість туману увімкнено.", [{ label: "Затишно", action: closeDialogue }], 4000);
        break;

      case 'set_blur_medium':
        updateRestBlur(6);
        transitionToPhrase(reply || "Середнє розмиття туману активовано.", [{ label: "М'яко", action: closeDialogue }], 4000);
        break;

      case 'set_blur_zero':
        updateRestBlur(0);
        transitionToPhrase(reply || "Оболонку переведено у чіткий контурний режим.", [{ label: "Чітко", action: closeDialogue }], 4000);
        break;

      case 'navigate_sos':
        triggerThinking(600);
        setQuickMechanicsSection('menu');
        setIsQuickMechanicsOpen(true);
        closeDialogue();
        break;

      case 'deep_breath_10':
        triggerColorShift('cyan-pulse', 3500);
        transitionToPhrase(reply || "10 глибоких вдихів витісняють залишкову напругу та наповнюють кров киснем.", [{ label: "Дихаю вільно", action: closeDialogue }], 5000);
        break;

      case 'grounding_54321':
        triggerColorShift('warm', 4000);
        transitionToPhrase(reply || "Техніка 5-4-3-2-1: Назви 5 предметів навколо, 4 відчуття, 3 звуки, 2 запахи, 1 глибинне вдихання.", [{ label: "Зроблено", action: closeDialogue }], 7000);
        break;

      case 'stop_thought_technique':
        triggerColorShift('gold-flash', 3000);
        transitionToPhrase(reply || "СТОП! Ця думка про сигарету — лише тимчасова біохімічна хвиля. Вона мине за 3 хвилини.", [{ label: "Я контролюю це", action: closeDialogue }], 5000);
        break;

      case 'lung_clean_visualization':
        triggerColorShift('cyan-pulse', 4000);
        transitionToPhrase(reply || "Відчуй, як з кожним видихом альвеоли скидають смолу і повертають природну еластичність.", [{ label: "Відчуваю чисті легені", action: closeDialogue }], 5000);
        break;

      case 'sound_zen_impulse':
        triggerColorShift('purple-glow', 3000);
        transitionToPhrase(reply || "Акустичний дзен-імпульс розсіяв тривожність. Спокій відновлено.", [{ label: "Гармонія", action: closeDialogue }], 4000);
        break;

      case 'provocation_challenge':
        triggerColorShift('gold-flash', 3500);
        transitionToPhrase(reply || "Психологічний виклик: Доведи собі, що твій свідомий розум сильніший за хімічну звичку!", [{ label: "Я сильніший", action: closeDialogue }], 5000);
        break;

      case 'add_resilience_10':
      case 'add_resilience_50':
      case 'add_resilience_100': {
        const bonus = effectiveAction === 'add_resilience_100' ? 100 : effectiveAction === 'add_resilience_50' ? 50 : 10;
        triggerColorShift('gold-flash', 3000);
        transitionToPhrase(
          reply || `Твоя стійкість зросла на +${bonus} балів!`,
          [{ label: "Супер!", action: closeDialogue }],
          4000
        );
        break;
      }

      case 'catarsis_release':
        triggerColorShift('cyan-pulse', 3500);
        transitionToPhrase(
          reply || "Видихни все, що тиснуло. Вся напруга розсіялася в просторі.",
          [{ label: "Легше", action: closeDialogue }],
          5000
        );
        break;

      case 'philosophy_thought':
        triggerColorShift('purple-glow', 4000);
        transitionToPhrase(
          reply || "Свобода — це не відсутність бажань, це влада над своїм вибором.",
          [{ label: "Сильно", action: closeDialogue }],
          6000
        );
        break;

      case 'combo_chain': {
        // Execute Mind-Bending Multi-Combo Chain!
        triggerColorShift('gold-flash', 4000);
        if (actionDef?.subSteps?.length) {
          actionDef.subSteps.forEach((step) => {
            const beh = step.behavior;
            if (beh === 'hydration') {
              updateLiveCheckIn((p: any) => ({ ...p, waterGlasses: (p.waterGlasses || 0) + 1, waterMl: ((p.waterGlasses || 0) + 1) * 250 }));
            } else if (beh === 'style_wave') {
              setVisualStyle('wave');
            } else if (beh === 'style_cat') {
              setVisualStyle('cat');
            } else if (beh === 'style_cosmic_ring') {
              setVisualStyle('standard');
              try { localStorage.setItem('quit-smoking:analyzer-style', 'standard'); } catch {}
            } else if (beh === 'style_glitter') {
              setVisualStyle('standard');
            } else if (beh === 'style_snowflake') {
              setVisualStyle('snowflake');
            } else if (beh === 'style_autumn') {
              setVisualStyle('autumn');
            } else if (beh === 'style_flower') {
              setVisualStyle('flower');
            } else if (beh === 'set_hue_ocean') {
              updateRestHue(210);
              updateColorActiveMode('color');
            } else if (beh === 'set_hue_sakura') {
              updateRestHue(330);
              updateColorActiveMode('color');
            } else if (beh === 'set_hue_emerald') {
              updateRestHue(140);
              updateColorActiveMode('color');
            } else if (beh === 'set_hue_amber') {
              updateRestHue(45);
              updateColorActiveMode('color');
            } else if (beh === 'set_hue_uv') {
              updateRestHue(280);
              updateColorActiveMode('color');
            } else if (beh === 'set_mode_mono_white') {
              updateRestLightness(100);
              updateColorActiveMode('monochrome');
            } else if (beh === 'set_mode_mono_black') {
              updateRestLightness(0);
              updateColorActiveMode('monochrome');
            } else if (beh === 'set_mode_color') {
              updateColorActiveMode('color');
            } else if (beh === 'set_blur_max') {
              updateRestBlur(12);
            } else if (beh === 'set_blur_zero') {
              updateRestBlur(0);
            }
          });
        }
        transitionToPhrase(
          reply || "Запущено комбіновану каскадну мульти-дію! Всі механіки активовано.",
          [{ label: "Фініш", action: closeDialogue }],
          5000
        );
        break;
      }

      case 'next_replica': {
        const isSosSelection = phraseId === 'how_are_you' || (opt.nextReplicaText && opt.nextReplicaText.includes('SOS')) || (reply && reply.includes('SOS'));
        const nextText = opt.nextReplicaText || reply || (isSosSelection ? "Я поруч 🌿 Обери одну із технік у SOS, щоб зняти напругу:" : "Я поруч 🌿 Чим я можу допомогти прямо зараз?");
        triggerThinking(800);

        if (isSosSelection) {
          transitionToPhrase(
            nextText,
            [
              {
                label: "Дихання 4-7-8",
                action: () => {
                  executeDialogueOption('how_are_you', {
                    id: 'sos_breath',
                    text: 'Дихання 4-7-8',
                    action: 'navigate_sos',
                    actionParam: 'breath',
                    analyzerReply: 'Переходимо до дихальних вправ...'
                  });
                }
              },
              {
                label: "Серфінг хвилі",
                action: () => {
                  executeDialogueOption('how_are_you', {
                    id: 'sos_wave',
                    text: 'Серфінг хвилі',
                    action: 'navigate_sos',
                    actionParam: 'wave',
                    analyzerReply: 'Переходимо до серфінгу хвилі...'
                  });
                }
              },
              {
                label: "Заземлення 5-4-3-2-1",
                action: () => {
                  executeDialogueOption('how_are_you', {
                    id: 'sos_grounding',
                    text: 'Заземлення',
                    action: 'navigate_sos',
                    actionParam: 'grounding',
                    analyzerReply: 'Переходимо до заземлення...'
                  });
                }
              },
              {
                label: "Холодна вода",
                action: () => {
                  executeDialogueOption('how_are_you', {
                    id: 'sos_cold',
                    text: 'Холодна вода',
                    action: 'navigate_sos',
                    actionParam: 'cold',
                    analyzerReply: 'Переходимо до холодового рефлексу...'
                  });
                }
              },
              {
                label: "Звуки природи",
                action: () => {
                  executeDialogueOption('how_are_you', {
                    id: 'sos_sound',
                    text: 'Звуки природи',
                    action: 'navigate_sos',
                    actionParam: 'sound',
                    analyzerReply: 'Вмикаю звуки природи...'
                  });
                }
              },
              {
                label: "Бульбашки антистрес",
                action: () => {
                  executeDialogueOption('how_are_you', {
                    id: 'sos_game',
                    text: 'Бульбашки антистрес',
                    action: 'navigate_sos',
                    actionParam: 'game',
                    analyzerReply: 'Відкриваю антистрес бульбашки...'
                  });
                }
              },
              {
                label: "Всі практики SOS",
                action: () => {
                  executeDialogueOption('how_are_you', {
                    id: 'sos_menu',
                    text: 'Всі техніки SOS',
                    action: 'navigate_sos',
                    actionParam: 'menu',
                    analyzerReply: 'Відкриваю всі техніки SOS...'
                  });
                }
              }
            ],
            20000
          );
        } else {
          transitionToPhrase(
            nextText,
            [
              {
                label: "Зріз стану",
                action: () => {
                  setQuickMechanicsSection('slice');
                  setIsQuickMechanicsOpen(true);
                  closeDialogue();
                }
              },
              {
                label: "Тригерфікс",
                action: () => {
                  setQuickMechanicsSection('triggerfix');
                  setIsQuickMechanicsOpen(true);
                  closeDialogue();
                }
              },
              {
                label: "Аналіз та сценарій",
                action: () => {
                  setQuickMechanicsSection('analysis');
                  setIsQuickMechanicsOpen(true);
                  closeDialogue();
                }
              },
              {
                label: "Все спокійно",
                action: closeDialogue
              }
            ],
            12000
          );
        }
        break;
      }

      case 'navigate_sos': {
        const targetMode = String(opt.actionParam || actionDef?.actionParam || 'menu');
        try {
          sessionStorage.setItem('quit-smoking:pending-sos-feedback', 'true');
          sessionStorage.setItem('quit-smoking:sos-target-opened', targetMode);
        } catch {}
        setPendingSosFeedback(true);

        // Send user directly into this SOS tab
        window.dispatchEvent(new CustomEvent('change-tab', { detail: 'sos' }));
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('open-sos-mode', { detail: { mode: targetMode } }));
        }, 80);

        closeDialogue();
        break;
      }


      case 'close_quiet':
      default:
        if (reply) {
          transitionToPhrase(reply, [{ label: "Добре", action: closeDialogue }], 3500);
        } else {
          closeDialogue();
        }
        break;
    }
  }, [
    closeDialogue,
    triggerThinking,
    setQuickMechanicsSection,
    setIsQuickMechanicsOpen,
    setIsDailyLungModalOpen,
    updateLiveCheckIn,
    acknowledgeNegativeWarning,
    triggerColorShift,
    transitionToPhrase
  ]);

  // Unified Launch for any Dialogue Phrase (standard or custom)
  const launchDialoguePhrase = useCallback((phraseId: string) => {
    if (disableDialogues) return;
    const phrase = dialoguePhrases[phraseId] || DEFAULT_DIALOGUE_PHRASES[phraseId];
    if (!phrase) return;

    const rawOptions = Array.isArray(phrase.options) && phrase.options.length > 0
      ? phrase.options
      : [
          {
            id: 'opt_1',
            text: phrase.option1 || 'Так',
            action: 'slice' as DialogueActionType,
            analyzerReply: 'Відкриваю повний зріз...'
          },
          {
            id: 'opt_2',
            text: phrase.option2 || 'Ні',
            action: 'close_quiet' as DialogueActionType,
            analyzerReply: 'Зрозумів 🌿'
          }
        ];

    // Combine question with follow-up if present, dynamic water intake calculation for hydration
    let fullText = phrase.question;
    if (phraseId === 'hydration') {
      const live = getLiveCheckIn();
      const currentMl = live.waterMl || 0;
      let weight = 70;
      try {
        const w = localStorage.getItem('quit-smoking:physio-weight');
        if (w && !isNaN(Number(w))) weight = Number(w);
      } catch {}
      const targetMl = Math.max(1500, Math.round(weight * 35));
      fullText = `Помітив, що твій рівень гідратації ${currentMl}/${targetMl}. Не бажаєш чашки або склянки води?`;
    } else if (phrase.analyzerFollowUp) {
      fullText = `${phrase.question}\n\n${phrase.analyzerFollowUp}`;
    }

    setActiveDialogueText(fullText);
    setActiveDialogueOptions(
      rawOptions.map((opt) => ({
        label: opt.text,
        action: () => executeDialogueOption(phraseId, opt)
      }))
    );

    setDisplayStage('sentient_dialogue');
    setIsDissolving(false);
    setIsRevealed(true);
    setAreOptionsRevealed(true);

    // Shell enters Active / Notification mode when presenting a dialogue (without turning yellow)
    setIsPulseRingActive(true);
  }, [dialoguePhrases, executeDialogueOption, disableDialogues]);

  // SOS Feedback Loop Trigger Handler
  useEffect(() => {
    const triggerSosFeedbackDialogue = () => {
      const isPending = sessionStorage.getItem('quit-smoking:pending-sos-feedback') === 'true' || pendingSosFeedback;
      const wasViewed = sessionStorage.getItem('quit-smoking:sos-technique-viewed') === 'true';

      // Опісля Аналізатор бачить шо ця вкладка відкрилася і тільки в цьому випадку питає чи допомогла техніка
      if (isPending && wasViewed) {
        try {
          sessionStorage.removeItem('quit-smoking:pending-sos-feedback');
          sessionStorage.removeItem('quit-smoking:sos-technique-viewed');
        } catch {}
        setPendingSosFeedback(false);

        setTimeout(() => {
          triggerThinking(700);
          setIsRevealed(true);
          setDisplayStage('sentient_dialogue');
          transitionToPhrase(
            "Чи допомогла техніка?",
            [
              {
                label: "Так, допомогла",
                action: () => {
                  triggerColorShift('gold-flash', 4000);
                  transitionToPhrase(
                    "Чудово! Пропоную зробити новий зріз стану",
                    [
                      {
                        label: "Зробити зріз",
                        action: () => {
                          setQuickMechanicsSection('slice');
                          setIsQuickMechanicsOpen(true);
                          closeDialogue();
                        }
                      },
                      {
                        label: "Не зараз",
                        action: closeDialogue
                      }
                    ],
                    8000
                  );
                }
              },
              {
                label: "Ні, не допомогла",
                action: () => {
                  setTransientFlash(null);
                  transitionToPhrase(
                    "Я поруч, скоро спробуємо ще раз 🌿",
                    [{ label: "Добре", action: closeDialogue }],
                    4500
                  );
                  // І переходить у спокійний режим до спрацьовування наступного тригера
                  try {
                    const calmUntil = Date.now() + 45 * 60 * 1000;
                    localStorage.setItem('quit-smoking:all-good-calm-until', String(calmUntil));
                    localStorage.setItem('quit-smoking:analyzer-has-advice', 'false');
                  } catch {}
                }
              }
            ],
            14000
          );
        }, 450);
      }
    };

    // Check if drawer just closed with pending feedback
    if (prevQuickMechanicsOpen.current === true && !isQuickMechanicsOpen) {
      triggerSosFeedbackDialogue();
    }
    prevQuickMechanicsOpen.current = isQuickMechanicsOpen;

    const handleTabChangeForSosFeedback = (e: any) => {
      if (e?.detail === 'counter') {
        triggerSosFeedbackDialogue();
      }
    };

    const handleSosTechniqueFinished = () => {
      triggerSosFeedbackDialogue();
    };

    window.addEventListener('change-tab', handleTabChangeForSosFeedback);
    window.addEventListener('sos-technique-finished', handleSosTechniqueFinished);

    return () => {
      window.removeEventListener('change-tab', handleTabChangeForSosFeedback);
      window.removeEventListener('sos-technique-finished', handleSosTechniqueFinished);
    };
  }, [closeDialogue, isQuickMechanicsOpen, pendingSosFeedback, transitionToPhrase, triggerColorShift, triggerThinking]);

  // 2. Ask "Чи все зараз гаразд?"
  const askIsEverythingAlright = useCallback(() => {
    launchDialoguePhrase('how_are_you');
  }, [launchDialoguePhrase]);

  // 3. Prompt Hourly Slice
  const promptHourlySlice = useCallback(() => {
    launchDialoguePhrase('slice');
  }, [launchDialoguePhrase]);

  const promptSliceQuickPanel = useCallback(() => {
    launchDialoguePhrase('slice');
  }, [launchDialoguePhrase]);

  useEffect(() => {
    (window as any).__promptSliceQuickPanel = promptSliceQuickPanel;
    return () => {
      delete (window as any).__promptSliceQuickPanel;
    };
  }, [promptSliceQuickPanel]);

  // 4. Prompt Daily Lung Test
  const promptDailyLungTest = useCallback(() => {
    launchDialoguePhrase('lung_test');
  }, [launchDialoguePhrase]);

  // 5. Prompt TriggerFix
  const promptTriggerFix = useCallback(() => {
    launchDialoguePhrase('triggerfix');
  }, [launchDialoguePhrase]);

  // 6. Prompt Hydration
  const promptHydration = useCallback(() => {
    launchDialoguePhrase('hydration');
  }, [launchDialoguePhrase]);

  // Smart Short Analysis of Slice Results
  const triggerPostSliceShortAnalysis = useCallback((slice: {
    craving?: number;
    energy?: number;
    mood?: number;
    calmness?: number;
    thoughts?: number;
    anxiety?: number;
    focus?: number;
  }) => {
    triggerThinking(1000);
    triggerColorShift('gold-flash', 3500);

    const craving = slice.craving ?? 2;
    const calmness = slice.calmness ?? slice.mood ?? 4;
    const energy = slice.energy ?? 3;
    const thoughts = slice.thoughts ?? 2;
    const anxiety = slice.anxiety ?? 1;
    const focus = slice.focus ?? 4;

    // Calculate stability index 0-100%
    const posSum = calmness + energy + focus + (slice.mood ?? 4);
    const negSum = craving + thoughts + anxiety + (slice.craving ?? 2);
    const rawRatio = (posSum * 5) - (negSum * 3);
    const stabilityIndex = Math.max(30, Math.min(100, Math.round(50 + rawRatio * 1.8)));

    const cravingDesc = craving <= 1 
      ? `Тяга ${craving}/5 (мінімальна)` 
      : craving <= 2 
      ? `Тяга ${craving}/5 (контрольована)` 
      : `Тяга ${craving}/5 (потребує уваги)`;

    const analysisText = `Зріз збережено: Стійкість ${stabilityIndex}%. Відкрити аналіз?`;

    setActiveDialogueText(analysisText);
    setActiveDialogueOptions([
      {
        label: "Аналіз",
        action: () => {
          setQuickMechanicsSection('analysis');
          setIsQuickMechanicsOpen(true);
          closeDialogue();
        }
      },
      {
        label: "Закрити",
        action: closeDialogue
      }
    ]);

    setDisplayStage('sentient_dialogue');
    setIsDissolving(false);
    setIsRevealed(true);
  }, [closeDialogue, executeDialogueOption, setIsQuickMechanicsOpen, setQuickMechanicsSection, triggerColorShift, triggerThinking]);

  // Submit handler for Quick Hourly Slice
  const handleHourlySliceSubmit = useCallback((slice: {
    craving: number;
    energy: number;
    mood: number;
    waterAddedMl: number;
    isFullNorm?: boolean;
    symptoms: string[];
  }) => {
    setIsHourlySliceModalOpen(false);
    const now = Date.now();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const d = new Date();
    const todayKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    // Update live check-in
    updateLiveCheckIn((p: any) => {
      let weight = 70;
      try {
        const w = localStorage.getItem('quit-smoking:physio-weight');
        if (w && !isNaN(Number(w))) weight = Number(w);
      } catch {}
      const targetNormMl = Math.max(1500, Math.round(weight * 35));
      const finalWaterMl = slice.isFullNorm 
        ? targetNormMl 
        : (p.waterMl || 0) + slice.waterAddedMl;
      const finalGlasses = Math.floor(finalWaterMl / 250);

      return {
        ...p,
        cravingLevel: slice.craving,
        energyLevel: slice.energy,
        moodLevel: slice.mood,
        waterGlasses: finalGlasses,
        waterMl: finalWaterMl
      };
    });

    // Save to daily entries
    try {
      localStorage.setItem('quit-smoking:last-prompt', String(now));
      localStorage.setItem('quit-smoking:last-slice-time', String(now));
      localStorage.setItem('quit-smoking:last-hourly-prompt-time', String(now));
      window.dispatchEvent(new Event('prompt-interval-change'));
      
      const savedDays = localStorage.getItem('quit-smoking:days');
      const daysMap = savedDays ? JSON.parse(savedDays) : {};
      const currentDay = daysMap[todayKey] || { surveys: [], entries: [] };
      const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
      const newEntry = {
        id: `slice_${now}`,
        time: timeStr,
        craving: slice.craving,
        energy: slice.energy,
        mood: slice.mood,
        balance: slice.mood,
        focus: slice.energy,
        tags: slice.symptoms,
        note: 'Щогодинний зріз Аналізатора'
      };
      const updatedEntries = [...(currentDay.surveys || currentDay.entries || []), newEntry];
      daysMap[todayKey] = {
        ...currentDay,
        craving: slice.craving,
        energy: slice.energy,
        mood: slice.mood,
        surveys: updatedEntries,
        entries: updatedEntries
      };
      localStorage.setItem('quit-smoking:days', JSON.stringify(daysMap));
      window.dispatchEvent(new Event('storage'));
    } catch {}

    // If Post-Slice Analysis toggle is enabled, offer short analysis with options
    if (dialogueSettings.postSliceAnalysisEnabled !== false) {
      triggerPostSliceShortAnalysis(slice);
    } else {
      triggerColorShift('gold-flash', 3000);
      transitionToPhrase("Зріз успішно збережено в пам'ять Аналізатора ✨ Твоє тіло відновлюється 🌿", [
        { label: "Дякую", action: closeDialogue }
      ], 4500);
    }
  }, [closeDialogue, dialogueSettings.postSliceAnalysisEnabled, transitionToPhrase, triggerColorShift, triggerPostSliceShortAnalysis, updateLiveCheckIn]);

  // Listen for slice saved result from Quick Mechanics drawer or other components
  useEffect(() => {
    const handleSliceSavedResult = (e: any) => {
      if (dialogueSettings.postSliceAnalysisEnabled !== false) {
        triggerPostSliceShortAnalysis(e?.detail || {});
      }
    };
    window.addEventListener('slice-saved-result', handleSliceSavedResult);
    return () => window.removeEventListener('slice-saved-result', handleSliceSavedResult);
  }, [dialogueSettings.postSliceAnalysisEnabled, triggerPostSliceShortAnalysis]);

  // Complete handler for Daily Lung Test
  const handleDailyLungComplete = useCallback((seconds: number) => {
    setIsDailyLungModalOpen(false);
    triggerThinking(1200);

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const d = new Date();
    const todayKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    try {
      localStorage.setItem(`quit-smoking:daily-lung-test-done-${todayKey}`, 'true');
      localStorage.setItem('quit-smoking:last-lung-test-seconds', String(seconds));
      localStorage.setItem('quit-smoking:last-lung-prompt-time', String(Date.now()));
    } catch {}

    triggerColorShift('gold-flash', 4000);

    let praise = `Затримка ${seconds} с! Твої легені активно регенерують, життєвий об'єм відновлюється ✨`;
    if (seconds >= 45) {
      praise = `Неймовірний результат: ${seconds} с! Рівень кисневої витривалості як у спортсмена. Альвеоли чисті ✨`;
    } else if (seconds >= 30) {
      praise = `Чудовий результат: ${seconds} с! Бронхіальне дерево очищається від слизу, газообмін на висоті ✨`;
    }

    transitionToPhrase(praise, [
      { label: "Пишаюся собою", action: closeDialogue }
    ], 6500);
  }, [closeDialogue, transitionToPhrase, triggerColorShift, triggerThinking]);

  // Proactive Sentient Scheduler respecting user dialogue settings
  useEffect(() => {
    const checkProactivePrompts = () => {
      // Don't interrupt if user is actively in another dialogue or intro/guided tour pending
      const hasShownIntro = typeof window !== 'undefined' && localStorage.getItem('quit-smoking:intro-dialogue-shown') === 'true';
      if (!hasShownIntro || isPersistentDialogue || isGuidedTourActive || isRevealed) return;

      const now = Date.now();
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      const d = new Date();
      const todayKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

      // Only prompt during waking hours (08:00 - 23:30)
      if (currentHour < 8 || currentHour >= 24) return;

      // Check A: Daily Lung Volume Test
      if (dialogueSettings.lungTestEnabled) {
        let lungTargetMinute = 14 * 60; // default 14:00
        if (dialogueSettings.lungTestSchedule === 'morning') lungTargetMinute = 9 * 60;
        else if (dialogueSettings.lungTestSchedule === 'afternoon') lungTargetMinute = 14 * 60;
        else if (dialogueSettings.lungTestSchedule === 'evening') lungTargetMinute = 19 * 60;
        else if (dialogueSettings.lungTestSchedule === 'random') {
          try {
            const storedTarget = localStorage.getItem(`quit-smoking:daily-lung-target-${todayKey}`);
            if (storedTarget) {
              lungTargetMinute = parseInt(storedTarget, 10);
            } else {
              lungTargetMinute = 660 + Math.floor(Math.random() * 510);
              localStorage.setItem(`quit-smoking:daily-lung-target-${todayKey}`, String(lungTargetMinute));
            }
          } catch {}
        }

        const isLungDoneToday = localStorage.getItem(`quit-smoking:daily-lung-test-done-${todayKey}`) === 'true';
        const lastLungPrompt = parseInt(localStorage.getItem('quit-smoking:last-lung-prompt-time') || '0', 10);
        const currentDayMinute = currentHour * 60 + currentMinute;

        if (!isLungDoneToday && currentDayMinute >= lungTargetMinute && (now - lastLungPrompt > 2 * 60 * 60 * 1000)) {
          try {
            localStorage.setItem('quit-smoking:last-lung-prompt-time', String(now));
          } catch {}
          promptDailyLungTest();
          return;
        }
      }

      // Check B: Slice (за розкладом користувача з підтримкою Рандомного часу)
      if (dialogueSettings.sliceEnabled) {
        const lastPromptVal = parseInt(localStorage.getItem('quit-smoking:last-prompt') || '0', 10);
        const lastSliceTime = parseInt(localStorage.getItem('quit-smoking:last-slice-time') || '0', 10);
        const lastHourlyPrompt = parseInt(localStorage.getItem('quit-smoking:last-hourly-prompt-time') || '0', 10);
        const refTime = Math.max(lastPromptVal, lastSliceTime, lastHourlyPrompt);

        const sliceInterval = dialogueSettings.sliceIntervalMinutes === -1
          ? (45 + (now % 45)) * 60 * 1000
          : (dialogueSettings.sliceIntervalMinutes || 60) * 60 * 1000;

        if (refTime === 0 || (now - refTime >= sliceInterval)) {
          try {
            localStorage.setItem('quit-smoking:last-hourly-prompt-time', String(now));
          } catch {}
          promptHourlySlice();
          return;
        }
      }

      // Check C: TriggerFix (за розкладом користувача з підтримкою Рандомного часу)
      if (dialogueSettings.triggerFixEnabled) {
        const lastTriggerFix = parseInt(localStorage.getItem('quit-smoking:last-triggerfix-prompt-time') || '0', 10);
        const triggerFixInterval = dialogueSettings.triggerFixIntervalMinutes === -1
          ? (75 + (now % 60)) * 60 * 1000
          : (dialogueSettings.triggerFixIntervalMinutes || 120) * 60 * 1000;

        if (now - lastTriggerFix >= triggerFixInterval) {
          try {
            localStorage.setItem('quit-smoking:last-triggerfix-prompt-time', String(now));
          } catch {}
          promptTriggerFix();
          return;
        }
      }

      // Check D: Hydration (за розкладом користувача з підтримкою Рандомного часу)
      if (dialogueSettings.hydrationEnabled) {
        const lastHydration = parseInt(localStorage.getItem('quit-smoking:last-hydration-prompt-time') || '0', 10);
        const hydrationInterval = dialogueSettings.hydrationIntervalMinutes === -1
          ? (40 + (now % 40)) * 60 * 1000
          : (dialogueSettings.hydrationIntervalMinutes || 60) * 60 * 1000;

        if (now - lastHydration >= hydrationInterval) {
          try {
            localStorage.setItem('quit-smoking:last-hydration-prompt-time', String(now));
          } catch {}
          promptHydration();
          return;
        }
      }

      // Check E: Proactive "Чи все зараз гаразд?" (з підтримкою Рандомного часу)
      if (dialogueSettings.howAreYouEnabled) {
        const lastHowAreYou = parseInt(localStorage.getItem('quit-smoking:last-how-are-you-time') || '0', 10);
        const calmUntil = parseInt(localStorage.getItem('quit-smoking:all-good-calm-until') || '0', 10);
        const howAreYouInterval = dialogueSettings.howAreYouIntervalMinutes === -1
          ? (50 + (now % 50)) * 60 * 1000
          : (dialogueSettings.howAreYouIntervalMinutes || 60) * 60 * 1000;

        if (now >= calmUntil && (now - lastHowAreYou >= howAreYouInterval)) {
          try {
            localStorage.setItem('quit-smoking:last-how-are-you-time', String(now));
          } catch {}
          askIsEverythingAlright();
          return;
        }
      }

      // Check F: Щоденник вдячності (за розкладом вечора або інтервалу)
      if (dialogueSettings.gratitudeEnabled !== false) {
        const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
        const d = new Date();
        const todayK = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        const entriesStr = localStorage.getItem('quit-smoking:gratitude-journal-entries') || '[]';
        let isFilled = false;
        try {
          const entries = JSON.parse(entriesStr);
          isFilled = entries.some((e: any) => e.date === todayK && (e.g1?.trim() || e.g2?.trim() || e.g3?.trim()));
        } catch {}

        const targetHour = dialogueSettings.gratitudeHour ?? 20;
        const currentHour = d.getHours();
        const lastGratPrompt = parseInt(localStorage.getItem('quit-smoking:last-gratitude-prompt-time') || '0', 10);

        if (!isFilled && currentHour >= targetHour && (now - lastGratPrompt >= 90 * 60 * 1000)) {
          try {
            localStorage.setItem('quit-smoking:last-gratitude-prompt-time', String(now));
          } catch {}
          launchDialoguePhrase('gratitude_journal');
          return;
        }
      }

      // Check G: Список справ (Таймери на кожну справу окремо)
      if (dialogueSettings.dailyStepsEnabled !== false) {
        const stepsStr = localStorage.getItem('quit-smoking:daily-micro-steps');
        const historyStr = localStorage.getItem('quit-smoking:daily-steps-history');
        if (stepsStr) {
          try {
            const steps = JSON.parse(stepsStr);
            const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
            const d = new Date();
            const todayK = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
            const history = historyStr ? JSON.parse(historyStr) : {};
            const completedToday: string[] = history[todayK] || [];

            if (Array.isArray(steps)) {
              for (const step of steps) {
                if (!step.scheduledTime || step.reminderDialogueEnabled === false) continue;
                if (completedToday.includes(step.id)) continue;

                const [sHour, sMin] = step.scheduledTime.split(':').map(Number);
                if (isNaN(sHour) || isNaN(sMin)) continue;

                const nowMinutes = d.getHours() * 60 + d.getMinutes();
                const schedMinutes = sHour * 60 + sMin;

                if (nowMinutes >= schedMinutes) {
                  const lastTaskPromptKey = `quit-smoking:last-task-prompt-${step.id}`;
                  const lastTaskPrompt = parseInt(localStorage.getItem(lastTaskPromptKey) || '0', 10);
                  if (now - lastTaskPrompt >= 30 * 60 * 1000) {
                    try {
                      localStorage.setItem(lastTaskPromptKey, String(now));
                    } catch {}

                    const question = step.dialoguePrompt?.trim() || `Час для справи: «${step.title}»! Готовий виконати?`;
                    setActiveDialogueText(question);
                    setActiveDialogueOptions([
                      {
                        label: 'Виконано!',
                        action: () => executeDialogueOption('daily_steps', {
                          id: `task_done_${step.id}`,
                          text: 'Виконано!',
                          action: 'task_done',
                          actionParam: step.id,
                          visualReaction: 'joy'
                        })
                      },
                      {
                        label: 'Відкрити список справ',
                        action: () => executeDialogueOption('daily_steps', {
                          id: 'open_steps',
                          text: 'Відкрити список',
                          action: 'daily_steps',
                          visualReaction: 'active'
                        })
                      },
                      {
                        label: 'Нагадати через 30 хв',
                        action: () => executeDialogueOption('daily_steps', {
                          id: `postpone_${step.id}`,
                          text: 'Пізніше',
                          action: 'remind_timer',
                          actionParam: 30,
                          visualReaction: 'calm',
                          analyzerReply: 'Зрозумів, нагадаю за 30 хв.'
                        })
                      }
                    ]);
                    setDisplayStage('sentient_dialogue');
                    setIsDissolving(false);
                    setIsRevealed(true);
                    setAreOptionsRevealed(true);
                    setIsPulseRingActive(true);
                    triggerColorShift('warm', 4500);
                    return;
                  }
                }
              }
            }
          } catch {}
        }
      }
    };

    // Run check after initial 5 seconds on screen, then every 30 seconds
    const initialTimer = setTimeout(checkProactivePrompts, 5000);
    const interval = setInterval(checkProactivePrompts, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [
    isRevealed,
    dialogueSettings,
    promptDailyLungTest,
    promptHourlySlice,
    promptTriggerFix,
    promptHydration,
    askIsEverythingAlright
  ]);

  // Handler for manual dialogue test from Settings Modal
  const handleTestTriggerDialogue = useCallback((type: string) => {
    setIsAppearanceModalOpen(false);
    setTimeout(() => {
      launchDialoguePhrase(type);
    }, 280);
  }, [launchDialoguePhrase]);

  // Celestial Constellation Astronomical Dialogue Handler
  const handleLaunchConstellationDialogue = useCallback((con: RealConstellation) => {
    // 1. Lock the constellation on the ring canvas so it remains brilliant throughout explanation
    try {
      window.dispatchEvent(new CustomEvent('analyzer-constellation-lock'));
    } catch {}

    const finishConstellation = () => {
      try {
        window.dispatchEvent(new CustomEvent('analyzer-constellation-release'));
        window.dispatchEvent(new Event('analyzer-ring-sparkler-sparks'));
      } catch {}
      closeDialogue();
    };

    const showFacts = () => {
      transitionToPhrase(
        con.factsText,
        [
          {
            label: "Дякую",
            action: finishConstellation,
          }
        ],
        25000
      );
    };

    const showLocation = () => {
      transitionToPhrase(
        con.locationText,
        [
          {
            label: "Цікаві факти",
            action: showFacts,
          },
          {
            label: "Зрозуміло",
            action: finishConstellation,
          }
        ],
        25000
      );
    };

    // Stage 1: Tell what constellation this is
    setActiveDialogueText(con.introText);
    setActiveDialogueOptions([
      {
        label: "Де спостерігати",
        action: showLocation,
      },
      {
        label: "Зрозуміло",
        action: finishConstellation,
      }
    ]);

    setDisplayStage('sentient_dialogue');
    setIsDissolving(false);
    setIsRevealed(true);
    setAreOptionsRevealed(true);
  }, [closeDialogue, transitionToPhrase, triggerColorShift, triggerThinking]);

  // Cloud click handler: Opens sentient living dialogue & scatters trapped stardust!
  const handleCloudClick = useCallback(() => {
    const now = Date.now();
    if (now - lastCloudClickTimeRef.current < 280) return;
    lastCloudClickTimeRef.current = now;

    if (navigator.vibrate) {
      try { navigator.vibrate(18); } catch {}
    }

    // Always disperse particles trapped in/near the Shell on click!
    const shellEl = document.getElementById('analyzer-shell-anchor');
    let shellX = window.innerWidth / 2;
    let shellY = 160;
    if (shellEl) {
      const rect = shellEl.getBoundingClientRect();
      shellX = rect.left + rect.width / 2;
      shellY = rect.top + rect.height / 2;
    }
    window.dispatchEvent(new CustomEvent('analyzer-shell-burst', { detail: { x: shellX, y: shellY } }));
    window.dispatchEvent(new Event('analyzer-shell-click'));

    if (isEverythingHidden) return;

    // If text is currently revealed, clicking again smoothly dissolves it into mist
    if (isRevealed) {
      if (isPersistentDialogue) return; // У цьому діалозі вікна просто так не зникають! Він висить поки юзер не вибере щось
      if (now - dialogueOpenedAtRef.current < 380) return;
      closeDialogue();
      return;
    }

    dialogueOpenedAtRef.current = now;

    // Priority Check 0: Authentic Night Sky Constellation Active!
    if (activeConstellationRef.current && !disableDialogues) {
      handleLaunchConstellationDialogue(activeConstellationRef.current);
      return;
    }

    // Trigger thinking sparkle surge for 1.2 seconds
    triggerThinking(1200);

    const live = getLiveCheckIn();

    // Priority Check: Smart Organism Advice & Forecast (Аналізатор v.2)
    // Кожного разу коли Аналізатор має що порадити І ця порада іще не підтверджена ("Зрозумів") — показуємо її.
    if (organismDiagnosis.hasAdvice && isRedGlowActive) {
      const shortAdvice = organismDiagnosis.adviceText || organismDiagnosis.currentStatus || "Потрібна увага до стану.";
      setActiveDialogueText(shortAdvice);
      
      const options: Array<{ label: string; action: () => void }> = [];
      if (organismDiagnosis.topic === 'water') {
        const currentMl = live.waterMl || 0;
        let weight = 70;
        try {
          const w = localStorage.getItem('quit-smoking:physio-weight');
          if (w && !isNaN(Number(w))) weight = Number(w);
        } catch {}
        const targetMl = Math.max(1500, Math.round(weight * 35));
        setActiveDialogueText(`Помітив, що твій рівень гідратації ${currentMl}/${targetMl}. Не бажаєш чашки або склянки води?`);

        options.push({
          label: "Випʼю чашку",
          action: () => {
            triggerThinking(800);
            updateLiveCheckIn((p: any) => {
              const newMl = (p.waterMl || 0) + 200;
              const newGlasses = Math.floor(newMl / 250);
              return { ...p, waterGlasses: newGlasses, waterMl: newMl };
            });
            acknowledgeNegativeWarning('water');
            triggerColorShift('cyan-pulse', 3500);
            localStorage.removeItem('quit-smoking:analyzer-last-topic');
            try { window.dispatchEvent(new Event('water-intake-updated')); } catch {}
            transitionToPhrase("Ловлю на слові.", [
              { label: "Дякую", action: () => { acknowledgeNegativeWarning(); closeDialogue(); } }
            ], 2500);
          }
        });
        options.push({
          label: "Випʼю склянку",
          action: () => {
            triggerThinking(800);
            updateLiveCheckIn((p: any) => {
              const newMl = (p.waterMl || 0) + 250;
              const newGlasses = Math.floor(newMl / 250);
              return { ...p, waterGlasses: newGlasses, waterMl: newMl };
            });
            acknowledgeNegativeWarning('water');
            triggerColorShift('cyan-pulse', 3500);
            localStorage.removeItem('quit-smoking:analyzer-last-topic');
            try { window.dispatchEvent(new Event('water-intake-updated')); } catch {}
            transitionToPhrase("Ловлю на слові.", [
              { label: "Дякую", action: () => { acknowledgeNegativeWarning(); closeDialogue(); } }
            ], 2500);
          }
        });
        options.push({
          label: "Пізніше",
          action: () => {
            acknowledgeNegativeWarning('water');
            transitionToPhrase("Гаразд!", [
              { label: "Добре", action: () => { acknowledgeNegativeWarning(); closeDialogue(); } }
            ], 2000);
          }
        });
      } else {
        options.push({
          label: "Пройти зріз",
          action: () => {
            triggerThinking(600);
            setQuickMechanicsSection('slice');
            setIsQuickMechanicsOpen(true);
            closeDialogue();
          }
        });
        options.push({
          label: "Зрозумів",
          action: () => {
            acknowledgeNegativeWarning(organismDiagnosis.topic);
            try { localStorage.removeItem('quit-smoking:analyzer-last-topic'); } catch {}
            closeDialogue();
          }
        });
      }

      setActiveDialogueOptions(options);
      setDisplayStage('sentient_dialogue');
      setIsDissolving(false);
      setIsRevealed(true);
      setAreOptionsRevealed(true);
      return;
    }

    // Default & requested behavior: Launch Slice dialogue through Analyzer!
    launchDialoguePhrase('slice');
  }, [
    isRevealed,
    closeDialogue,
    triggerThinking,
    getLiveCheckIn,
    organismDiagnosis,
    isRedGlowActive,
    updateLiveCheckIn,
    acknowledgeNegativeWarning,
    triggerColorShift,
    transitionToPhrase,
    setQuickMechanicsSection,
    setIsQuickMechanicsOpen,
    launchDialoguePhrase
  ]);

  // Skip advice handler (User dismisses advice, dialogues happen later)
  const handleSkipAdvice = (e: React.MouseEvent) => {
    e.stopPropagation();
    try { window.dispatchEvent(new Event('analyzer-ring-star-fade-pulse')); } catch {}
    if (navigator.vibrate) {
      try { navigator.vibrate(14); } catch {}
    }

    setIsAdviceDelivered(true);
    setLastViewedSignature(currentSignature);
    try {
      localStorage.setItem('quit-smoking:analyzer-advice-delivered', 'true');
      localStorage.setItem('quit-smoking:analyzer-last-sig', currentSignature);
    } catch {}

    // Smoothly dissolve advice into mist without lighting jumps
    setIsRevealed(false);
  };

  // User confirms "Так" (Done!) later
  const handleFollowupYes = (e: React.MouseEvent) => {
    e.stopPropagation();
    try { window.dispatchEvent(new Event('analyzer-ring-star-fade-pulse')); } catch {}
    if (navigator.vibrate) {
      try { navigator.vibrate([28, 45, 28]); } catch {}
    }

    setAdviceStatus('yes');
    try {
      localStorage.setItem('quit-smoking:analyzer-advice-status', 'yes');
      localStorage.setItem('quit-smoking:analyzer-warm', 'true');
    } catch {}

    triggerColorShift('warm', 3500); // Changes to warm yellow, then smoothly returns to normal!
    setResponseText("Ми з тобою, відчуй це спокійне тепло.");
    setDisplayStage('status_response');

    setTimeout(() => {
      setIsRevealed(false);
    }, 4200);
  };

  // User answers "Ні" to "Ти зробив те, що ми радили?"
  const handleFollowupNo = (e: React.MouseEvent) => {
    e.stopPropagation();
    try { window.dispatchEvent(new Event('analyzer-ring-star-fade-pulse')); } catch {}
    if (navigator.vibrate) {
      try { navigator.vibrate(15); } catch {}
    }

    setAdviceStatus('no');
    try {
      localStorage.setItem('quit-smoking:analyzer-advice-status', 'no');
      localStorage.setItem('quit-smoking:analyzer-warm', 'false');
    } catch {}

    triggerColorShift('red-flash', 3500); // Changes to red, then smoothly returns to normal!
    setResponseText("Зроби це, коли відчуєш силу. Ми поруч, бережи свій спокій.");
    setDisplayStage('status_response');

    setTimeout(() => {
      setIsRevealed(false);
    }, 4200);
  };

  // "Як справи?" -> "Добре"
  const handleHowAreYouGood = (e: React.MouseEvent) => {
    e.stopPropagation();
    try { window.dispatchEvent(new Event('analyzer-ring-star-fade-pulse')); } catch {}
    if (navigator.vibrate) {
      try { navigator.vibrate([25, 40, 50, 30]); } catch {}
    }

    triggerColorShift('gold-flash', 3200); // Changes to bright golden yellow, then smoothly returns to normal!
    setResponseText("Ми радіємо разом із тобою. Тримай це світло.");
    setDisplayStage('status_response');

    setTimeout(() => {
      setIsRevealed(false);
    }, 4200);
  };

  // "Як справи?" -> "Чесно, не дуже"
  const handleHowAreYouNotGood = (e: React.MouseEvent) => {
    e.stopPropagation();
    try { window.dispatchEvent(new Event('analyzer-ring-star-fade-pulse')); } catch {}
    if (navigator.vibrate) {
      try { navigator.vibrate(20); } catch {}
    }

    setAdviceStatus('pending');
    try {
      localStorage.setItem('quit-smoking:analyzer-advice-status', 'pending');
      localStorage.setItem('quit-smoking:analyzer-warm', 'false');
    } catch {}

    triggerColorShift('red-flash', 3200); // Changes to soft red, then smoothly returns to normal!
    setResponseText("Ми чуємо тебе. Давай спокійно відновимо сили — ми поруч.");
    setDisplayStage('status_response');

    setTimeout(() => {
      setIsRevealed(false);
    }, 4200);
  };

  // Random Word Generator triggered by Swipe Right!
  const handleTriggerRandomWord = useCallback(() => {
    if (navigator.vibrate) {
      try { navigator.vibrate([18, 35]); } catch {}
    }

    // Pick a new random word different from current
    let nextIndex = Math.floor(Math.random() * POWER_WORDS.length);
    if (POWER_WORDS[nextIndex].word === randomWord.word) {
      nextIndex = (nextIndex + 1) % POWER_WORDS.length;
    }

    setRandomWord(POWER_WORDS[nextIndex]);
    setDisplayStage('random_word');
    setIsRevealed(true);

    // Auto slow fade out: quote from Spark stays visible for ~5.5s, then slowly fades out on its own
    if (sparkFadeTimeoutRef.current) {
      clearTimeout(sparkFadeTimeoutRef.current);
    }
    sparkFadeTimeoutRef.current = setTimeout(() => {
      setIsRevealed(false);
    }, 5500);
  }, [randomWord]);

  return (
    <div className="w-full flex flex-col items-center justify-center mt-7 sm:mt-9 pt-1 mb-2 relative select-none overflow-visible pointer-events-none">
      {/* Keyframe animations for particle assembly & vapor dissolution */}
      <style>{`
        @keyframes assembleFragments {
          0% {
            opacity: 0;
            filter: blur(12px);
            transform: translateY(8px) scale(0.96);
            letter-spacing: 0.05em;
          }
          50% {
            opacity: 0.8;
            filter: blur(2.5px);
            transform: translateY(-1px) scale(1.01);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
            transform: translateY(0px) scale(1);
            letter-spacing: normal;
          }
        }

        @keyframes dissolveVapor {
          0% {
            opacity: 1;
            filter: blur(0px);
            transform: translateY(0px) scale(1);
            letter-spacing: normal;
          }
          40% {
            opacity: 0.55;
            filter: blur(4px);
            transform: translateY(-3px) scale(1.02);
            letter-spacing: 0.03em;
          }
          100% {
            opacity: 0;
            filter: blur(14px);
            transform: translateY(-8px) scale(1.06);
            letter-spacing: 0.08em;
          }
        }

        .animate-assemble-fragments {
          animation: assembleFragments 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-dissolve-vapor {
          animation: dissolveVapor 0.42s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
      `}</style>

      {/* Absolute Pulsing Rings wrapped around the visual simulator */}
      <div 
        id="analyzer-shell-anchor"
        data-analyzer-shell="true"
        data-shell-style={visualStyle}
        onClick={handleCloudClick}
        className="relative flex items-center justify-center w-[130px] h-[130px] sm:w-[140px] sm:h-[140px] rounded-full overflow-visible select-none pointer-events-auto transition-all duration-300 cursor-pointer"
        style={{
          filter: cloudRestLightness === 100
            ? 'grayscale(100%) brightness(1.65) contrast(1.1)'
            : cloudRestLightness === 0
            ? 'grayscale(100%) brightness(0.22) contrast(1.5)'
            : 'none'
        }}
      >
        {isPulseRingActive && visualStyle !== 'cosmic_ring' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            {/* Soft Ambient Ethereal Ripple (Contour-free, diffuse atmospheric mist) */}
            <div className={`absolute rounded-full w-[140px] h-[140px] animate-ripple-halo pointer-events-none filter blur-[8px] opacity-25 ${
              visualStyle === 'wave'
                ? 'bg-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
                : visualStyle === 'snowflake'
                ? 'bg-cyan-500/15 shadow-[0_0_24px_rgba(6,182,212,0.2)]'
                : visualStyle === 'autumn'
                ? 'bg-amber-500/15 shadow-[0_0_24px_rgba(245,158,11,0.2)]'
                : 'bg-purple-500/15 shadow-[0_0_24px_rgba(168,85,247,0.2)]'
            }`} />
          </div>
        )}

        <CardErrorBoundary cardName="Візуалізація Аналізатора">
          <div 
            className="relative flex items-center justify-center"
            style={{
              transition: 'transform 2000ms cubic-bezier(0.25, 1, 0.5, 1), filter 2000ms ease-in-out',
              transform: 'scale(1)',
              filter: [
                isIntroChattering 
                  ? 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.75))' 
                  : '',
                colorActiveMode === 'monochrome'
                  ? `grayscale(100%) contrast(120%) brightness(${cloudRestLightness <= 50 ? 0.35 + (cloudRestLightness / 50) * 0.65 : 1 + ((cloudRestLightness - 50) / 50) * 0.7})`
                  : '',
                cloudBlur > 0 ? `blur(${cloudBlur}px)` : ''
              ].filter(Boolean).join(' ') || 'none',
              willChange: 'transform, filter'
            }}
          >
            <div 
              className={`w-full h-full flex items-center justify-center ${
                isIntroChattering ? 'animate-shell-wave-sway' : ''
              }`}
              style={{
                willChange: isIntroChattering ? 'transform' : 'auto'
              }}
            >
              {visualStyle === 'cosmic_ring' ? (
                <LivingGlitterVisual
                  mode={activeMode}
                  hasUnreadAdvice={hasNewData && !isAdviceDelivered}
                  hasAdvice={isRedGlowActive}
                  isThinking={isThinking}
                  isDialogueActive={isRevealed}
                  isAllGood={organismDiagnosis.isAllGood}
                  onClick={handleCloudClick}
                  onSwipeAny={() => {}}
                  onSwipeRight={() => {}}
                  onLongPress={() => {
                    setShellSettingsTab('appearance');
                    setIsAppearanceModalOpen(true);
                  }}
                  blurAmount={cloudBlur}
                  calmHue={cloudRestHue}
                  calmLightness={cloudRestLightness}
                />
              ) : visualStyle === 'cat' ? (
                <LivingBlackCatVisual
                  mode={activeMode}
                  hasUnreadAdvice={hasNewData && !isAdviceDelivered}
                  hasAdvice={isRedGlowActive}
                  isThinking={isThinking}
                  isDialogueActive={isRevealed}
                  isAllGood={organismDiagnosis.isAllGood}
                  onClick={handleCloudClick}
                  onSwipeRight={() => {}}
                  onLongPress={() => {
                    setShellSettingsTab('appearance');
                    setIsAppearanceModalOpen(true);
                  }}
                  blurAmount={cloudBlur}
                  calmHue={cloudRestHue}
                />
              ) : visualStyle === 'wave' ? (
                <LivingWaveVisual
                  mode={activeMode}
                  hasUnreadAdvice={hasNewData && !isAdviceDelivered}
                  hasAdvice={isRedGlowActive}
                  isThinking={isThinking}
                  isDialogueActive={isRevealed && displayStage === 'sentient_dialogue'}
                  isAllGood={organismDiagnosis.isAllGood}
                  onClick={handleCloudClick}
                  onSwipeRight={() => {}}
                  onLongPress={() => {
                    setShellSettingsTab('appearance');
                    setIsAppearanceModalOpen(true);
                  }}
                  blurAmount={cloudBlur}
                  calmHue={cloudRestHue}
                />
              ) : visualStyle === 'flower' ? (
                <LivingFlowerVisual
                  mode={activeMode}
                  hasUnreadAdvice={hasNewData && !isAdviceDelivered}
                  hasAdvice={isRedGlowActive}
                  isThinking={isThinking}
                  isDialogueActive={isRevealed && displayStage === 'sentient_dialogue'}
                  isAllGood={organismDiagnosis.isAllGood}
                  onClick={handleCloudClick}
                  onSwipeRight={() => {}}
                  onLongPress={() => {
                    setShellSettingsTab('appearance');
                    setIsAppearanceModalOpen(true);
                  }}
                  blurAmount={cloudBlur}
                  calmHue={cloudRestHue}
                />
              ) : visualStyle === 'autumn' ? (
                <LivingAutumnVisual
                  mode={activeMode}
                  hasUnreadAdvice={hasNewData && !isAdviceDelivered}
                  hasAdvice={isRedGlowActive}
                  isThinking={isThinking}
                  isDialogueActive={isRevealed && displayStage === 'sentient_dialogue'}
                  isAllGood={organismDiagnosis.isAllGood}
                  onClick={handleCloudClick}
                  onSwipeRight={() => {}}
                  onLongPress={() => {
                    setShellSettingsTab('appearance');
                    setIsAppearanceModalOpen(true);
                  }}
                  blurAmount={cloudBlur}
                  calmHue={cloudRestHue}
                />
              ) : visualStyle === 'snowflake' ? (
                <LivingSnowflakeVisual
                  mode={activeMode}
                  hasUnreadAdvice={hasNewData && !isAdviceDelivered}
                  hasAdvice={isRedGlowActive}
                  isThinking={isThinking}
                  isDialogueActive={isRevealed && displayStage === 'sentient_dialogue'}
                  isAllGood={organismDiagnosis.isAllGood}
                  onClick={handleCloudClick}
                  onSwipeRight={() => {}}
                  onLongPress={() => {
                    setShellSettingsTab('appearance');
                    setIsAppearanceModalOpen(true);
                  }}
                  blurAmount={cloudBlur}
                  calmHue={cloudRestHue}
                />
              ) : (
                <EnergyClotVisual 
                  mode={activeMode} 
                  hasUnreadAdvice={hasNewData && !isAdviceDelivered} 
                  hasAdvice={isRedGlowActive}
                  isThinking={isThinking}
                  isDialogueActive={isRevealed && displayStage === 'sentient_dialogue'}
                  isAllGood={organismDiagnosis.isAllGood}
                  onClick={handleCloudClick}
                  onSwipeAny={() => {}}
                  onSwipeRight={() => {}}
                  onLongPress={() => {
                    setShellSettingsTab('appearance');
                    setIsAppearanceModalOpen(true);
                  }}
                  blurAmount={cloudBlur}
                  calmPoint={cloudRestPoint}
                  calmHue={cloudRestHue}
                  calmLightness={cloudRestLightness}
                />
              )}
            </div>
          </div>
        </CardErrorBoundary>
      </div>


      {/* Unified Thought & Dialogue Container (Strictly fixed height 62px to completely eliminate layout shifting and jumping of menu and yin-yang icon) */}
      <div className="w-full max-w-[340px] sm:max-w-sm mx-auto h-[62px] min-h-[62px] max-h-[62px] flex flex-col items-center justify-center relative px-2 my-0 pointer-events-auto overflow-visible">
        {!isRevealed ? (
          !arePhrasesDisabled ? (
            <ThoughtWordStream
              thoughtText={currentThought ? currentThought.text : ''}
              thoughtCategory={currentThought ? currentThought.category : undefined}
              thoughtCategoryLabel={currentThought ? currentThought.categoryLabel : undefined}
              onThoughtFinished={handleThoughtFinished}
              onNextThought={triggerNewThought}
              cloudRestHue={cloudRestHue}
              isFire={visualStyle === 'autumn'}
              isSun={false}
              isVisible={isThoughtActive}
              typingSpeed={typingSpeedMultiplier}
              fontSize={thoughtFontSize}
              animSetting={thoughtAnimSetting}
            />
          ) : null
        ) : (
          <div 
            onClick={handleCloudClick}
            className="w-full cursor-pointer transition-all duration-300 ease-out flex flex-col items-center justify-center text-center"
          >
            {/* 0. SENTIENT LIVING DIALOGUE STAGE */}
            {displayStage === 'sentient_dialogue' && (
              <div 
                className="flex flex-col items-center justify-center gap-2 py-0.5 w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <ShatteredDialogueText
                  text={activeDialogueText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✨⏱️⚡]/gu, '').trim()}
                  isDissolving={isDissolving}
                  calmHue={cloudRestHue}
                  isFire={visualStyle === 'autumn'}
                  fontSize={thoughtFontSize}
                />

                {activeDialogueOptions.length > 0 && (
                  <div className={`flex flex-wrap items-center justify-center gap-2 pt-0.5 min-h-[28px] transition-all duration-300 ease-out pointer-events-auto z-20 ${
                    areOptionsRevealed && !isDissolving
                      ? 'opacity-100 blur-0 scale-100 translate-y-0'
                      : 'opacity-0 blur-sm scale-90 translate-y-1 pointer-events-none'
                  }`}>
                    {activeDialogueOptions.map((opt, i) => {
                      const cleanLabel = opt.label.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✨📝⚡☕🫁🚶]/gu, '').trim() || opt.label.trim();
                      return (
                        <React.Fragment key={i}>
                          {i > 0 && (
                            <span 
                              className="text-[#FFFDD0]/35 drop-shadow-[0_0_6px_rgba(255,253,208,0.5)] select-none font-bold"
                              style={{ fontSize: thoughtFontSize ? `${Math.max(9, thoughtFontSize * 0.9)}px` : undefined }}
                            >
                              ·
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              try { window.dispatchEvent(new Event('analyzer-ring-star-fade-pulse')); } catch {}
                              opt.action();
                            }}
                            style={{ fontSize: thoughtFontSize ? `${thoughtFontSize}px` : undefined }}
                            className="bg-transparent border-0 px-2 py-0.5 font-semibold text-[#FFFDD0] drop-shadow-[0_0_10px_rgba(255,253,208,0.85)] hover:drop-shadow-[0_0_16px_rgba(255,253,208,1)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none whitespace-nowrap leading-none pointer-events-auto z-30"
                          >
                            {cleanLabel}
                          </button>
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 1. ADVICE DISPLAY STAGE */}
            {displayStage === 'advice' && (
              <div className="space-y-1.5 py-0.5 w-full">
                <ShatteredDialogueText
                  text={currentAdviceText}
                  isDissolving={isDissolving}
                  fontSize={thoughtFontSize}
                />

                <div 
                  className={`flex items-center justify-center pt-0.5 transition-all duration-450 ease-out ${
                    areOptionsRevealed && !isDissolving
                      ? 'opacity-100 blur-0 scale-100 translate-y-0'
                      : 'opacity-0 blur-sm scale-90 translate-y-1.5 pointer-events-none'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={handleSkipAdvice}
                    style={{ fontSize: thoughtFontSize ? `${thoughtFontSize}px` : undefined }}
                    className="bg-transparent border-0 px-2.5 py-0.5 font-semibold text-[#FFFDD0]/80 hover:text-[#FFFDD0] drop-shadow-[0_0_8px_rgba(255,253,208,0.7)] hover:drop-shadow-[0_0_14px_rgba(255,253,208,1)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none"
                    title="Пропустити пораду"
                  >
                    Пропустити
                  </button>
                </div>
              </div>
            )}

            {/* 2. QUESTION STAGE LATER: "Ти зробив те, що ми радили?" */}
            {displayStage === 'followup_question' && (
              <div className="flex flex-col items-center gap-1.5 py-0.5 w-full">
                <ShatteredDialogueText
                  text="Ти зробив те, що ми радили?"
                  isDissolving={isDissolving}
                  fontSize={thoughtFontSize}
                />

                <div 
                  className={`flex items-center gap-3 pt-0.5 transition-all duration-450 ease-out ${
                    areOptionsRevealed && !isDissolving
                      ? 'opacity-100 blur-0 scale-100 translate-y-0'
                      : 'opacity-0 blur-sm scale-90 translate-y-1.5 pointer-events-none'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={handleFollowupYes}
                    style={{ fontSize: thoughtFontSize ? `${thoughtFontSize}px` : undefined }}
                    className="bg-transparent border-0 px-2.5 py-0.5 font-semibold text-[#FFFDD0] drop-shadow-[0_0_10px_rgba(255,253,208,0.85)] hover:drop-shadow-[0_0_16px_rgba(255,253,208,1)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none"
                  >
                    Так
                  </button>
                  <span 
                    className="text-[#FFFDD0]/35 drop-shadow-[0_0_6px_rgba(255,253,208,0.5)] select-none font-bold"
                    style={{ fontSize: thoughtFontSize ? `${Math.max(9, thoughtFontSize * 0.9)}px` : undefined }}
                  >
                    ·
                  </span>
                  <button
                    type="button"
                    onClick={handleFollowupNo}
                    style={{ fontSize: thoughtFontSize ? `${thoughtFontSize}px` : undefined }}
                    className="bg-transparent border-0 px-2.5 py-0.5 font-semibold text-[#FFFDD0]/80 hover:text-[#FFFDD0] drop-shadow-[0_0_8px_rgba(255,253,208,0.7)] hover:drop-shadow-[0_0_14px_rgba(255,253,208,1)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none"
                  >
                    Ні
                  </button>
                </div>
              </div>
            )}

            {/* 3. QUESTION STAGE LATER: "Як справи?" */}
            {displayStage === 'how_are_you_question' && (
              <div className="flex flex-col items-center gap-1.5 py-0.5 w-full">
                <ShatteredDialogueText
                  text="Як справи?"
                  isDissolving={isDissolving}
                  fontSize={thoughtFontSize}
                />

                <div 
                  className={`flex items-center gap-3 pt-0.5 transition-all duration-450 ease-out ${
                    areOptionsRevealed && !isDissolving
                      ? 'opacity-100 blur-0 scale-100 translate-y-0'
                      : 'opacity-0 blur-sm scale-90 translate-y-1.5 pointer-events-none'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={handleHowAreYouGood}
                    style={{ fontSize: thoughtFontSize ? `${thoughtFontSize}px` : undefined }}
                    className="bg-transparent border-0 px-2.5 py-0.5 font-semibold text-[#FFFDD0] drop-shadow-[0_0_10px_rgba(255,253,208,0.85)] hover:drop-shadow-[0_0_16px_rgba(255,253,208,1)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none"
                  >
                    Добре
                  </button>
                  <span 
                    className="text-[#FFFDD0]/35 drop-shadow-[0_0_6px_rgba(255,253,208,0.5)] select-none font-bold"
                    style={{ fontSize: thoughtFontSize ? `${Math.max(9, thoughtFontSize * 0.9)}px` : undefined }}
                  >
                    ·
                  </span>
                  <button
                    type="button"
                    onClick={handleHowAreYouNotGood}
                    style={{ fontSize: thoughtFontSize ? `${thoughtFontSize}px` : undefined }}
                    className="bg-transparent border-0 px-2.5 py-0.5 font-semibold text-[#FFFDD0]/80 hover:text-[#FFFDD0] drop-shadow-[0_0_8px_rgba(255,253,208,0.7)] hover:drop-shadow-[0_0_14px_rgba(255,253,208,1)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none"
                  >
                    Чесно, не дуже
                  </button>
                </div>
              </div>
            )}

            {/* 5. RESPONSE STAGE: Smooth feedback message */}
            {displayStage === 'status_response' && (
              <div className="flex flex-col items-center justify-center gap-1.5 py-0.5 w-full">
                <ShatteredDialogueText
                  text={responseText}
                  isDissolving={isDissolving}
                  fontSize={thoughtFontSize}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Appearance & Quick Mechanics Unified Analyzer Modal (Triggered by Long Press on Analyzer Cloud / Fire) */}
      {isAppearanceModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-x-hidden"
          onClick={() => setIsAppearanceModalOpen(false)}
        >
          <div 
            className="w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 bg-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col gap-3.5 text-zinc-100 animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <AnimatedAnalyzerIcon className="w-5 h-5" active={true} />
                <h3 className="text-sm font-bold text-zinc-100 truncate max-w-[200px]">
                  {analyzerName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAppearanceModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 transition-colors p-1.5 rounded-full hover:bg-zinc-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs for Unified Analyzer Window */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 bg-zinc-900/80 rounded-2xl border border-zinc-800/80 text-[10px] sm:text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setShellSettingsTab('appearance')}
                className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                  shellSettingsTab === 'appearance'
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] leading-none">Оболонка</span>
              </button>
              <button
                type="button"
                onClick={() => setShellSettingsTab('mechanics')}
                className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                  shellSettingsTab === 'mechanics'
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] leading-none">Механіки</span>
              </button>
              <button
                type="button"
                onClick={() => setShellSettingsTab('dialogues')}
                className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                  shellSettingsTab === 'dialogues'
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] leading-none">Діалоги</span>
              </button>
              <button
                type="button"
                onClick={() => setShellSettingsTab('create_dialogue')}
                className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                  shellSettingsTab === 'create_dialogue' || shellSettingsTab === 'create'
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] leading-none">Створити</span>
              </button>
              <button
                type="button"
                onClick={() => setShellSettingsTab('actions')}
                className={`py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                  shellSettingsTab === 'actions'
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] sm:text-[11px] leading-none">Дії</span>
              </button>
            </div>

            {/* TAB CONTENT: MECHANICS / DIALOGUES / APPEARANCE / ACTIONS */}
            {shellSettingsTab === 'mechanics' ? (
              <QuickMechanicsDrawer
                isOpen={true}
                embedded={true}
                onClose={() => setIsAppearanceModalOpen(false)}
                initialSection={quickMechanicsSection}
                onTabChange={(t) => setShellSettingsTab(t as any)}
              />
            ) : shellSettingsTab !== 'appearance' ? (
              <AnalyzerDialogueSettingsSection
                activeSubTab={shellSettingsTab}
                onTabChange={(t) => setShellSettingsTab(t as any)}
                onTestTriggerDialogue={handleTestTriggerDialogue}
                onOpenQuickMechanicsSection={(sec) => {
                  setQuickMechanicsSection(sec as any);
                  setShellSettingsTab('mechanics');
                }}
                onCloseModal={() => setIsAppearanceModalOpen(false)}
              />
            ) : (
              /* TAB CONTENT: APPEARANCE (ОБОЛОНКА) */
              <div className="flex flex-col gap-3">
                {/* Quick Rename & Style Selector */}
                <div className="flex flex-col gap-2">
                  <div className="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between gap-2">
                    <div className="text-xs text-zinc-300">
                      <span className="text-zinc-400 font-medium">Назва:</span> <span className="font-bold text-zinc-100">«{analyzerName}»</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAppearanceModalOpen(false);
                        window.dispatchEvent(new Event('open-analyzer-naming-modal'));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all cursor-pointer border border-zinc-700/70"
                    >
                      Змінити назву
                    </button>
                  </div>

                  {/* Style Switcher with Clean Lucide Icons and NO emojis */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 bg-zinc-900/60 rounded-2xl border border-zinc-800/80">
                    {[
                      { id: 'cat', label: 'Чорний кіт', icon: Cat },
                      { id: 'standard', label: 'Глітер', icon: Sparkles },
                      { id: 'autumn', label: 'Осінь', icon: Leaf },
                      { id: 'snowflake', label: 'Сніжинка', icon: Snowflake },
                      { id: 'flower', label: 'Квітка', icon: Flower2 },
                      { id: 'wave', label: 'Хвиля', icon: Waves },
                    ].map((st) => {
                      const IconCmp = st.icon;
                      const isSelected = visualStyle === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setVisualStyle(st.id as any);
                            try {
                              localStorage.setItem('quit-smoking:analyzer-style', st.id);
                              window.dispatchEvent(new Event('analyzer-style-change'));
                            } catch {}
                          }}
                          className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-center ${
                            isSelected
                              ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs'
                              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                          }`}
                        >
                          <IconCmp className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[10px] leading-tight truncate">{st.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Preview Pill rendering the REAL shell visual as on main screen */}
                <div className="w-full h-28 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-center overflow-hidden relative shadow-inner">
                  {/* REAL Live Shell Visual Component as rendered on main screen */}
                  <div 
                    className="relative transform scale-[0.6] sm:scale-[0.65] origin-center flex items-center justify-center pointer-events-none transition-all duration-300"
                    style={{
                      filter: [
                        colorActiveMode === 'monochrome'
                          ? `grayscale(100%) contrast(120%) brightness(${cloudRestLightness <= 50 ? 0.35 + (cloudRestLightness / 50) * 0.65 : 1 + ((cloudRestLightness - 50) / 50) * 0.7})`
                          : '',
                        cloudBlur > 0 ? `blur(${cloudBlur}px)` : ''
                      ].filter(Boolean).join(' ') || 'none'
                    }}
                  >
                    {visualStyle === 'cosmic_ring' ? (
                      <LivingGlitterVisual
                        mode={activeMode}
                        hasUnreadAdvice={hasNewData && !isAdviceDelivered}
                        hasAdvice={isRedGlowActive}
                        isThinking={false}
                        isDialogueActive={false}
                        isAllGood={organismDiagnosis.isAllGood}
                        onClick={() => {}}
                        onSwipeAny={() => {}}
                        onSwipeRight={() => {}}
                        onLongPress={() => {}}
                        blurAmount={cloudBlur}
                        calmHue={cloudRestHue}
                        calmLightness={cloudRestLightness}
                      />
                    ) : visualStyle === 'cat' ? (
                      <LivingBlackCatVisual
                        mode={activeMode}
                        hasUnreadAdvice={hasNewData && !isAdviceDelivered}
                        hasAdvice={isRedGlowActive}
                        isThinking={false}
                        isDialogueActive={false}
                        isAllGood={organismDiagnosis.isAllGood}
                        onClick={() => {}}
                        onSwipeRight={() => {}}
                        onLongPress={() => {}}
                        blurAmount={cloudBlur}
                        calmHue={cloudRestHue}
                      />
                    ) : visualStyle === 'wave' ? (
                      <LivingWaveVisual
                        mode={activeMode}
                        hasUnreadAdvice={hasNewData && !isAdviceDelivered}
                        hasAdvice={isRedGlowActive}
                        isThinking={false}
                        isDialogueActive={false}
                        isAllGood={organismDiagnosis.isAllGood}
                        onClick={() => {}}
                        onSwipeRight={() => {}}
                        onLongPress={() => {}}
                        blurAmount={cloudBlur}
                        calmHue={cloudRestHue}
                      />
                    ) : visualStyle === 'flower' ? (
                      <LivingFlowerVisual
                        mode={activeMode}
                        hasUnreadAdvice={hasNewData && !isAdviceDelivered}
                        hasAdvice={isRedGlowActive}
                        isThinking={false}
                        isDialogueActive={false}
                        isAllGood={organismDiagnosis.isAllGood}
                        onClick={() => {}}
                        onSwipeRight={() => {}}
                        onLongPress={() => {}}
                        blurAmount={cloudBlur}
                        calmHue={cloudRestHue}
                      />
                    ) : visualStyle === 'autumn' ? (
                      <LivingAutumnVisual
                        mode={activeMode}
                        hasUnreadAdvice={hasNewData && !isAdviceDelivered}
                        hasAdvice={isRedGlowActive}
                        isThinking={false}
                        isDialogueActive={false}
                        isAllGood={organismDiagnosis.isAllGood}
                        onClick={() => {}}
                        onSwipeRight={() => {}}
                        onLongPress={() => {}}
                        blurAmount={cloudBlur}
                        calmHue={cloudRestHue}
                      />
                    ) : visualStyle === 'snowflake' ? (
                      <LivingSnowflakeVisual
                        mode={activeMode}
                        hasUnreadAdvice={hasNewData && !isAdviceDelivered}
                        hasAdvice={isRedGlowActive}
                        isThinking={false}
                        isDialogueActive={false}
                        isAllGood={organismDiagnosis.isAllGood}
                        onClick={() => {}}
                        onSwipeRight={() => {}}
                        onLongPress={() => {}}
                        blurAmount={cloudBlur}
                        calmHue={cloudRestHue}
                      />
                    ) : (
                      <EnergyClotVisual 
                        mode={activeMode} 
                        hasUnreadAdvice={hasNewData && !isAdviceDelivered} 
                        hasAdvice={isRedGlowActive}
                        isThinking={false}
                        isDialogueActive={false}
                        isAllGood={organismDiagnosis.isAllGood}
                        onClick={() => {}}
                        onSwipeAny={() => {}}
                        onLongPress={() => {}}
                        blurAmount={cloudBlur}
                        calmHue={cloudRestHue}
                      />
                    )}
                  </div>

                  <span className="absolute bottom-1.5 text-[10px] tracking-wider text-zinc-400 font-mono select-none flex items-center gap-1.5">
                    <span>{analyzerName}</span>
                    <span>•</span>
                    <span>{visualStyle === 'cosmic_ring' ? 'Кільце' : visualStyle === 'wave' ? 'Хвиля' : visualStyle === 'flower' ? 'Квітка' : visualStyle === 'snowflake' ? 'Сніжинка' : visualStyle === 'autumn' ? 'Осінь' : visualStyle === 'cat' ? 'Чорний кіт' : 'Глітер'}</span>
                    <span>•</span>
                    <span className="text-zinc-300 font-semibold">
                      {colorActiveMode === 'color' ? `${cloudRestHue}°` : `Ч/б ${cloudRestLightness}%`}
                    </span>
                  </span>
                </div>

                {/* Card Block: Blur Range Slider (Розмитість) */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>Розмитість оболонки</span>
                    </span>
                    <span className="text-zinc-200 font-bold font-mono text-[11px] bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 rounded-lg">
                      {cloudBlur.toFixed(1)} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={cloudBlur}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCloudBlur(val);
                      try { localStorage.setItem('quit-smoking:analyzer-blur', val.toString()); } catch {}
                    }}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-200"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono pt-0.5">
                    <span>Чітка (0 px)</span>
                    <span>М'яка (6 px)</span>
                    <span>Розмита (12 px)</span>
                  </div>
                </div>

                {/* Card Block: Cosmic Ring Stars Count (Кількість зірок у кільці) */}
                {visualStyle === 'cosmic_ring' && (
                  <div className="p-3.5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 space-y-2.5 shadow-xs transition-all">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                        <CircleDot className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>Кількість зірок у кільці</span>
                      </span>
                      <span className="text-zinc-200 font-bold font-mono text-[11px] bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 rounded-lg">
                        {ringStarsCount} шт
                      </span>
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={200}
                      step={1}
                      value={ringStarsCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setRingStarsCount(val);
                        try {
                          localStorage.setItem('quit-smoking:analyzer-ring-stars-count', String(val));
                          window.dispatchEvent(new Event('analyzer-ring-stars-changed'));
                        } catch {}
                      }}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-200"
                    />

                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono pt-0.5">
                      <span>1</span>
                      <span>80 (Стандарт)</span>
                      <span>200</span>
                    </div>

                    <p className="text-[10px] text-zinc-500 font-medium leading-normal">
                      Повзунком можна регулювати кількість зірок у кільці по 1 шт (від 1 до 200).
                    </p>
                  </div>
                )}

                {/* Card Block: Thought Stream Toggle */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-200 text-xs font-semibold flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span>Потік думок</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = !arePhrasesDisabled;
                        setArePhrasesDisabled(nextVal);
                        try {
                          localStorage.setItem('quit-smoking:analyzer-disable-phrases', String(nextVal));
                          window.dispatchEvent(new Event('analyzer-phrases-toggle'));
                        } catch {}
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        !arePhrasesDisabled ? 'bg-emerald-500' : 'bg-zinc-800'
                      }`}
                      aria-label="Перемикач потоку думок"
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          !arePhrasesDisabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Статус</span>
                    <span className={`font-bold font-mono px-2 py-0.5 rounded-lg border ${
                      !arePhrasesDisabled 
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {!arePhrasesDisabled ? 'Увімкнено' : 'Вимкнено'}
                    </span>
                  </div>

                  {/* До наступної думки: live countdown timer */}
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-zinc-800/60">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>До наступної думки</span>
                    </span>
                    <span className={`font-bold font-mono px-2 py-0.5 rounded-lg border flex items-center gap-1.5 ${
                      arePhrasesDisabled
                        ? 'bg-zinc-800 text-zinc-500 border-zinc-700'
                        : isThoughtActive
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-200 border-zinc-700'
                    }`}>
                      {arePhrasesDisabled ? (
                        'Вимкнено'
                      ) : isThoughtActive ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Думка транслюється</span>
                        </>
                      ) : countdownSec !== null && countdownSec > 0 ? (
                        <span>{countdownSec} с</span>
                      ) : (
                        'За мить...'
                      )}
                    </span>
                  </div>

                  {/* Quick Action: Trigger Next Thought Instantly */}
                  {!arePhrasesDisabled && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerNewThought();
                      }}
                      className="w-full mt-1 py-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] border border-zinc-700 text-zinc-200 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                      <span>Показати наступну думку зараз</span>
                    </button>
                  )}
                </div>

                {/* Card Block: Typing Speed Slider */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>Швидкість появи тексту</span>
                    </span>
                    <span className="text-zinc-200 font-bold font-mono text-[11px] bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 rounded-lg">
                      {Math.abs(speedValue) < 0.05
                        ? '0.0x (Стандарт)'
                        : speedValue > 0
                        ? `+${speedValue.toFixed(1)}x`
                        : `${speedValue.toFixed(1)}x`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.1"
                    value={speedValue}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setSpeedValue(val);
                      try { localStorage.setItem('quit-smoking:analyzer-typing-speed', val.toFixed(1)); } catch {}
                    }}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-200"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono pt-0.5">
                    <span>-2.0x</span>
                    <span>-1.0x</span>
                    <span className="text-zinc-300 font-bold">0.0x</span>
                    <span>+1.0x</span>
                    <span>+2.0x</span>
                  </div>
                </div>

                {/* Card Block: Font Size Slider */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>Розмір тексту</span>
                    </span>
                    <span className="text-zinc-200 font-bold font-mono text-[11px] bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 rounded-lg">
                      {thoughtFontSize} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="24"
                    step="1"
                    value={thoughtFontSize}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setThoughtFontSize(val);
                      try { 
                        localStorage.setItem('quit-smoking:analyzer-thought-font-size', val.toString()); 
                        window.dispatchEvent(new Event('analyzer-font-size-change'));
                      } catch {}
                    }}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-200"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono pt-0.5">
                    <span>3 px (Міні)</span>
                    <span>12 px (Стандарт)</span>
                    <span>24 px (Максі)</span>
                  </div>
                </div>

                {/* Card Block: Thought Animation Style Selector */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-200 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>Анімація появи думок</span>
                    </span>
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-lg bg-zinc-800/80 text-zinc-200 border border-zinc-700/60">
                      {thoughtAnimSetting === 'sparkler'
                        ? 'Бенгальський вогник'
                        : thoughtAnimSetting === 'double_defocus'
                        ? 'Розфокус'
                        : thoughtAnimSetting === 'glitch'
                        ? 'Глітч'
                        : thoughtAnimSetting === 'stream'
                        ? 'Потік'
                        : thoughtAnimSetting === 'random_letters_fade'
                        ? 'Рандомні літери'
                        : 'Випадковий мікс'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                      { id: 'sparkler', name: 'Бенгальський вогник', desc: 'Іскри та спалахування', icon: Sparkles },
                      { id: 'double_defocus', name: 'Подвійний розфокус', desc: 'Оптичне розмиття', icon: Eye },
                      { id: 'glitch', name: 'Глітч-матриця', desc: 'Кібернетичні символи', icon: Zap },
                      { id: 'stream', name: 'Посимвольний потік', desc: 'Машинопис та стирання', icon: Edit3 },
                      { id: 'random_letters_fade', name: 'Рандомні літери', desc: 'Поступова кристалізація', icon: Telescope },
                      { id: 'random', name: 'Випадковий мікс', desc: 'Зміна на кожну думку', icon: SlidersHorizontal }
                    ].map((item) => {
                      const isSelected = thoughtAnimSetting === item.id;
                      const IconCmp = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => updateThoughtAnimSetting(item.id)}
                          className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-800 text-zinc-100 border-zinc-600 shadow-xs'
                              : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <IconCmp className="w-3.5 h-3.5 shrink-0 text-zinc-300" />
                              <span className="text-xs font-semibold truncate text-zinc-200">{item.name}</span>
                            </div>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-zinc-100 shrink-0" />}
                          </div>
                          <span className="text-[10px] text-zinc-500 line-clamp-1">{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Card Block: COLOR & MONOCHROME MODES */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-200 font-semibold">Режим кольору</span>
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-lg border bg-zinc-800/80 text-zinc-200 border-zinc-700/60">
                      {colorActiveMode === 'color' ? `Колір (${cloudRestHue}°)` : `Ч/б (${cloudRestLightness}%)`}
                    </span>
                  </div>

                  {/* SLIDER 1: COLOR */}
                  <div 
                    onClick={() => updateColorActiveMode('color')}
                    className={`p-3 rounded-xl border transition-all duration-200 space-y-2 cursor-pointer ${
                      colorActiveMode === 'color'
                        ? 'bg-zinc-800/70 border-zinc-600 shadow-sm'
                        : 'bg-zinc-900/40 border-zinc-800/60 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <Palette className={`w-3.5 h-3.5 ${colorActiveMode === 'color' ? 'text-zinc-200' : 'text-zinc-500'}`} />
                        <span className={`font-semibold ${colorActiveMode === 'color' ? 'text-zinc-100' : 'text-zinc-400'}`}>
                          Спектральний колір
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-3.5 h-3.5 rounded-full border border-white/80 shadow-xs"
                          style={{ backgroundColor: `hsl(${cloudRestHue}, 85%, 60%)` }}
                        />
                        <span className="text-[11px] font-mono text-zinc-300">
                          {cloudRestHue}°
                        </span>
                      </div>
                    </div>

                    <div className="relative pt-1 pb-1">
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={cloudRestHue}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          updateRestHue(val);
                          if (colorActiveMode !== 'color') {
                            updateColorActiveMode('color');
                          }
                        }}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-white relative z-10"
                        style={{
                          background: 'linear-gradient(to right, #f43f5e 0%, #fb923c 14%, #facc15 28%, #4ade80 42%, #38bdf8 57%, #6366f1 71%, #a855f7 85%, #f43f5e 100%)'
                        }}
                      />
                    </div>
                  </div>

                  {/* SLIDER 2: MONOCHROME */}
                  <div 
                    onClick={() => updateColorActiveMode('monochrome')}
                    className={`p-3 rounded-xl border transition-all duration-200 space-y-2 cursor-pointer ${
                      colorActiveMode === 'monochrome'
                        ? 'bg-zinc-800/70 border-zinc-600 shadow-sm'
                        : 'bg-zinc-900/40 border-zinc-800/60 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <Sun className={`w-3.5 h-3.5 ${colorActiveMode === 'monochrome' ? 'text-zinc-200' : 'text-zinc-500'}`} />
                        <span className={`font-semibold ${colorActiveMode === 'monochrome' ? 'text-zinc-100' : 'text-zinc-400'}`}>
                          Монохром (Ч/б)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-3.5 h-3.5 rounded-full border border-white/80 shadow-xs"
                          style={{ 
                            backgroundColor: `hsl(0, 0%, ${cloudRestLightness}%)`
                          }}
                        />
                        <span className="text-[11px] font-mono text-zinc-300">
                          {cloudRestLightness}%
                        </span>
                      </div>
                    </div>

                    <div className="relative pt-1 pb-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={cloudRestLightness}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          updateRestLightness(val);
                          if (colorActiveMode !== 'monochrome') {
                            updateColorActiveMode('monochrome');
                          }
                        }}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-zinc-200 relative z-10 shadow-inner"
                        style={{
                          background: 'linear-gradient(to right, #000000 0%, #18181b 15%, #3f3f46 35%, #71717a 50%, #a1a1aa 65%, #e4e4e7 85%, #ffffff 100%)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Done Button */}
            <button
              type="button"
              onClick={() => setIsAppearanceModalOpen(false)}
              className="w-full mt-1 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 text-xs font-semibold transition-colors cursor-pointer border border-zinc-800"
            >
              Готово
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Quick Hourly Slice Modal (Щогодинний зріз стану) */}
      {isHourlySliceModalOpen && typeof document !== 'undefined' && createPortal(
        <QuickHourlySliceModal
          isOpen={isHourlySliceModalOpen}
          onClose={() => {
            setIsHourlySliceModalOpen(false);
            const now = Date.now();
            try {
              localStorage.setItem('quit-smoking:last-prompt', String(now));
              localStorage.setItem('quit-smoking:last-hourly-prompt-time', String(now));
              window.dispatchEvent(new Event('prompt-interval-change'));
              window.dispatchEvent(new Event('storage'));
            } catch {}
          }}
          onSubmit={handleHourlySliceSubmit}
        />,
        document.body
      )}

      {/* Daily Lung Volume Test Modal (Щоденний замір обʼєму легень) */}
      {isDailyLungModalOpen && typeof document !== 'undefined' && createPortal(
        <DailyLungTestModal
          isOpen={isDailyLungModalOpen}
          onClose={() => setIsDailyLungModalOpen(false)}
          onComplete={handleDailyLungComplete}
        />,
        document.body
      )}

      {/* Quick Mechanics Top Drawer (Швидкі механіки: свайп у будь-який бік з центру Аналізатора) */}
      {isQuickMechanicsOpen && typeof document !== 'undefined' && createPortal(
        <QuickMechanicsDrawer
          isOpen={isQuickMechanicsOpen}
          onClose={() => setIsQuickMechanicsOpen(false)}
          initialSection={quickMechanicsSection}
        />,
        document.body
      )}
    </div>
  );
};
