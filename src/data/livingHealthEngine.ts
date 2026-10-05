export interface UnifiedHealthCheckIn {
  waterMl: number;
  sleepHours: number;
  cravingScore: number;
  anxietyScore: number;
  energyScore: number;
  note?: string;
  timestamp: number;
}

export interface TriggerFixLog {
  id: string;
  triggerName: string;
  antidoteUsed: string;
  timestamp: number;
}

export interface PredictiveScenario {
  id: string;
  title: string;
  probability: number;
  timeframe: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
}

export interface DialogueChoice {
  id: string;
  label: string;
  actionText: string;
}

export interface LivingDialogueTurn {
  id: string;
  speaker: 'ai' | 'user';
  message: string;
  choices?: DialogueChoice[];
}

export interface DopamineSubstituteItem {
  id: string;
  title: string;
  category: 'physical' | 'sensory' | 'mental' | 'social';
  durationMin: number;
  dopamineBoostPct: number;
  description: string;
}

export const COMMON_TRIGGERS = [
  { id: 'coffee', name: 'Ранкова кава', icon: '☕' },
  { id: 'stress', name: 'Стрес / Робота', icon: '⚡' },
  { id: 'alcohol', name: 'Алкоголь / Вечірка', icon: '🍷' },
  { id: 'meal', name: 'Після їжі', icon: '🍽️' },
  { id: 'boredom', name: 'Нудьга / Очікування', icon: '⏳' },
  { id: 'driving', name: 'За кермом / Дорога', icon: '🚗' },
];

export const TRIGGERFIX_ANTIDOTES = [
  { id: 'water', name: 'Холодна вода з лимоном', target: 'coffee' },
  { id: 'breath', name: 'Дихання 4-7-8', target: 'stress' },
  { id: 'walk', name: '5-хвилинна прогулянка', target: 'boredom' },
  { id: 'gum', name: 'М\'ятна жуйка / льодяник', target: 'meal' },
];

export const DOPAMINE_SUBSTITUTES: DopamineSubstituteItem[] = [
  { id: '1', title: 'Холодне вмивання / душ', category: 'sensory', durationMin: 2, dopamineBoostPct: 250, description: 'Миттєвий сплеск норадреналіну та дофаміну без нікотину.' },
  { id: '2', title: 'Інтенсивні присідання (20 разів)', category: 'physical', durationMin: 3, dopamineBoostPct: 180, description: 'Швидка утилізація кортизолу та стимуляція ендорфінів.' },
  { id: '3', title: 'Улюблений енергійний трек', category: 'sensory', durationMin: 4, dopamineBoostPct: 140, description: 'Акустична стимуляція центру винагороди мозку.' },
  { id: '4', title: 'Зелений чай матча', category: 'sensory', durationMin: 5, dopamineBoostPct: 120, description: 'L-теанін забезпечує спокійний фокус та стабільний дофамін.' },
];

export function calculateBioRecoveryIndex(diffMs: number): number {
  const days = Math.max(0, diffMs / (1000 * 60 * 60 * 24));
  return Math.min(100, Math.round(15 + Math.sqrt(days) * 12));
}

export function generatePredictiveScenarios(diffMs: number): PredictiveScenario[] {
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 72) {
    return [
      { id: '1', title: 'Пікова детоксикація', probability: 85, timeframe: 'Наступні 24-48 год', recommendation: 'Пийте більше води та використовуйте дихання при спайках.', severity: 'high' },
      { id: '2', title: 'Сонливість або гіперактивність', probability: 60, timeframe: 'Сьогодні ввечері', recommendation: 'Лягайте спати на 30 хв раніше.', severity: 'medium' }
    ];
  }
  return [
    { id: '1', title: 'Психологічний тригер звички', probability: 40, timeframe: 'Вихідні', recommendation: 'Заздалегідь підготуйте корисні снеки та м\'ятні льодяники.', severity: 'medium' },
    { id: '2', title: 'Повна нормалізація дофаміну', probability: 95, timeframe: 'Через 2-3 тижні', recommendation: 'Фіксуйте досягнення та радійте чистому диханню!', severity: 'low' }
  ];
}

export function getAnalyzerLivingDialogue(diffMs: number): LivingDialogueTurn[] {
  const days = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
  return [
    {
      id: '1',
      speaker: 'ai',
      message: `Вітаю! Ти вже на ${days}-му дні чистого життя. Твої судини та легені щохвилини регенерують. Як оцінюєш рівень енергії сьогодні?`,
      choices: [
        { id: 'high', label: '⚡ Високий', actionText: 'Відчуваю приплив сил!' },
        { id: 'med', label: '⚖️ Помірний', actionText: 'Нормально, тримаю баланс.' },
        { id: 'low', label: '💤 Потребую відпочинку', actionText: 'Трохи втомлений.' }
      ]
    }
  ];
}

export function getLiveHealthMetrics(diffMs: number) {
  const hours = Math.max(0, diffMs / (1000 * 60 * 60));
  const days = hours / 24;
  return {
    oxygenLevel: Math.min(100, 92 + Math.min(7.8, hours * 0.3)),
    carbonMonoxideDrop: Math.min(100, Math.round(hours * 4.2)),
    nicotineCleared: Math.min(100, Math.round((hours / 72) * 100)),
    tasteSensoryRecovery: Math.min(100, Math.round((hours / 48) * 100)),
    lungCiliaRegeneration: Math.min(100, Math.round((days / 30) * 100)),
    circulatoryEfficiency: Math.min(100, Math.round((days / 14) * 100)),
    dopamineResensitization: Math.min(100, Math.round((days / 90) * 100)),
  };
}
