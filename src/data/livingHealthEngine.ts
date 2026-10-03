export interface UnifiedHealthCheckIn {
  waterGlasses: number;
  waterMl: number;
  coffeeCups: number;
  lastCoffeeTime: 'morning' | 'afternoon' | 'evening' | 'none' | string;
  sleepHours: number;
  sleepQuality: 'deep' | 'moderate' | 'average' | 'restless' | string;
  sleepSchedule: 'regular' | 'disrupted' | 'early_bird' | 'night_owl' | 'stable' | 'fragmented' | string;
  cravingLevel: number;
  moodLevel: number;
  energyLevel: number;
  anxietyLevel: number;
  intrusiveThoughtsLevel: number;
  calmLevel: number;
  stepsCount: number;
  dopamineActions: string[];
  bioRecoveryScore?: number;
  bedtime?: string;
  wakeTime?: string;
  weight?: number;
  focusLevel?: number;
  restingHeartRate?: number;
  bloodPressureSys?: number;
  bloodPressureDia?: number;
  spO2?: number;
  breathHoldSec?: number;
  [key: string]: any;
}

export interface TriggerFixLog {
  id: string;
  trigger?: string;
  type?: string;
  cause?: string;
  intensity?: number | string;
  fixApplied?: string;
  status?: 'resolved' | 'active' | string;
  timestamp: number;
  note?: string;
  [key: string]: any;
}

export interface PredictiveScenario {
  id: string;
  timeWindow: string;
  probability: number;
  title: string;
  mechanism?: string;
  riskFactors?: string[];
  preventiveAction?: string;
  status?: 'safe' | 'warning' | 'critical' | string;
  color?: string;
  probabilityText?: string;
  insight?: string;
  recommendation?: string;
  [key: string]: any;
}

export interface DialogueChoice {
  id: string;
  text: string;
  actionType?: 'antidote' | 'water' | 'breath' | 'affirm' | 'custom' | string;
  payload?: any;
  response?: string;
  tone?: string;
  suggestedAction?: any;
  metricImpact?: any;
  [key: string]: any;
}

export interface LivingDialogueTurn {
  id: string;
  speaker: 'analyzer' | 'user' | string;
  text?: string;
  choices?: DialogueChoice[];
  timestamp: number;
  reactionTone?: string;
  emotionalTone?: string;
  greeting?: string;
  livingAnalysis?: string;
  [key: string]: any;
}

export interface DopamineSubstituteItem {
  id: string;
  name: string;
  icon?: string;
  desc: string;
  isCustom?: boolean;
  category?: string;
  [key: string]: any;
}

export const DOPAMINE_SUBSTITUTES: DopamineSubstituteItem[] = [
  {
    id: 'cold_splash',
    name: 'Холодний сплеск на обличчя',
    icon: '🧊',
    desc: 'Миттєво запускає пірнальний рефлекс, сповільнює пульс і стимулює блукаючий нерв.'
  },
  {
    id: 'squats_20',
    name: '20 динамічних присідань',
    icon: '⚡',
    desc: 'Швидка утилізація кортизолу та надлишку адреналіну великими м’язами стегон.'
  },
  {
    id: 'citrus_aroma',
    name: 'Цитрусовий арома-шок (лимон / м’ята)',
    icon: '🍋',
    desc: 'Прямий сенсорний сигнал у нюхову цибулину, що блокує нейронні патерни звички.'
  },
  {
    id: 'matcha_tea',
    name: 'Зелений чай матча або пуер',
    icon: '🍵',
    desc: 'L-теанін у поєднанні з м’яким теоброміном стимулює альфа-хвилі спокійного фокусу.'
  },
  {
    id: 'loud_music',
    name: 'Улюблений трек на повній гучності',
    icon: '🎧',
    desc: 'Акустичний стимул викликає викид ендогенного дофаміну у смугастому тілі мозку.'
  }
];

export const COMMON_TRIGGERS = [
  { id: 'coffee', name: 'Ранкова або післяобідня кава', riskLevel: 'high' },
  { id: 'stress', name: 'Робочий або побутовий стрес', riskLevel: 'critical' },
  { id: 'eating', name: 'Щільний прийом їжі', riskLevel: 'medium' },
  { id: 'alcohol', name: 'Алкоголь або вечірка', riskLevel: 'critical' },
  { id: 'boredom', name: 'Нудьга / Очікування', riskLevel: 'medium' },
  { id: 'driving', name: 'За кермом у заторі', riskLevel: 'high' }
];

export const TRIGGERFIX_ANTIDOTES: Array<{
  id: string;
  label: string;
  icon: string;
  desc: string;
}> = [
  {
    id: 'breath_478',
    label: 'Дихання 4-7-8',
    icon: '💨',
    desc: '3 глибоких цикли: вдих 4с, затримка 7с, довгий видих 8с.'
  },
  {
    id: 'cold_water',
    label: 'Склянка крижаної води',
    icon: '💧',
    desc: 'Швидкий ковток зволожує слизові та перезавантажує рецептори рота.'
  },
  {
    id: 'fist_squeeze',
    label: 'Силове стискання кулаків',
    icon: '✊',
    desc: '10 разів із силою стисніть і розтисніть пальці для скидання тонусу.'
  },
  {
    id: 'walk_fast',
    label: '5-хвилинна активна ходьба',
    icon: '🚶',
    desc: 'Розганяє застійну кров і перемикає увагу на рух тіла.'
  }
];

export function calculateBioRecoveryIndex(arg1: any, arg2?: any): number {
  let diffDays = 1;
  let checkIn: any = {};

  if (typeof arg1 === 'number') {
    diffDays = Math.max(1, Math.floor(arg1 / (24 * 3600 * 1000)));
    checkIn = arg2 || {};
  } else {
    checkIn = arg1 || {};
    diffDays = typeof arg2 === 'number' ? arg2 : 1;
  }

  let score = 50;
  score += Math.min(30, diffDays * 2.5);

  const water = checkIn.waterMl || ((checkIn.waterGlasses || 0) * 250);
  if (water >= 2000) score += 10;
  else if (water < 800) score -= 12;

  const sleep = checkIn.sleepHours || 7.5;
  if (sleep >= 7 && sleep <= 9) score += 10;
  else if (sleep < 6) score -= 15;

  const craving = checkIn.cravingLevel || 1;
  const anxiety = checkIn.anxietyLevel || 1;
  score -= (craving - 1) * 4;
  score -= (anxiety - 1) * 3;

  return Math.max(10, Math.min(100, Math.round(score)));
}

export function generatePredictiveScenarios(arg1?: any, arg2?: any): PredictiveScenario[] {
  const safeCheckIn: any = typeof arg1 === 'number' ? (arg2 || {}) : (arg1 || {});
  const scenarios: PredictiveScenario[] = [];

  const water = safeCheckIn.waterMl || ((safeCheckIn.waterGlasses || 0) * 250);
  if (water < 1000) {
    scenarios.push({
      id: 'sc_water',
      timeWindow: 'Наступні 45–60 хв',
      probability: 78,
      probabilityText: '78%',
      title: 'Хибний позив на тлі зневоднення',
      insight: 'Згущення крові та сухість слизових провокують псевдо-тягу.',
      mechanism: 'Згущення крові та сухість слизових провокують псевдо-тягу як сигнал стресу судин.',
      riskFactors: ['Дефіцит води', 'Сухість у роті'],
      preventiveAction: 'Випийте 300 мл чистої води негайно.',
      recommendation: 'Випийте 300 мл чистої води негайно.',
      status: 'warning',
      color: 'amber'
    });
  }

  if ((safeCheckIn.coffeeCups || 0) >= 3 || (safeCheckIn.lastCoffeeTime === 'evening')) {
    scenarios.push({
      id: 'sc_caffeine',
      timeWindow: 'Вечір 20:00–23:00',
      probability: 82,
      probabilityText: '82%',
      title: 'Кофеїновий зрив гальмування',
      insight: 'Блокада аденозину підвищує збудливість.',
      mechanism: 'Блокада аденозину підвищує вегетативну збудливість і підсилює компульсивні імпульси.',
      riskFactors: ['Пізній кофеїн', 'Підвищений пульс'],
      preventiveAction: 'Перейдіть на трав’яний чай з мелісою або ромашкою.',
      recommendation: 'Перейдіть на трав’яний чай з мелісою або ромашкою.',
      status: 'critical',
      color: 'rose'
    });
  }

  if (safeCheckIn.sleepSchedule === 'disrupted' || (safeCheckIn.sleepHours || 7.5) < 6.5) {
    scenarios.push({
      id: 'sc_sleep',
      timeWindow: 'Пообідній спад (14:00–16:00)',
      probability: 74,
      probabilityText: '74%',
      title: 'Зниження префронтального контролю',
      insight: 'Виснажена кора шукає швидкий дофамін.',
      mechanism: 'Виснажена кора мозку шукає швидкий дофамін для підтримки пильності.',
      riskFactors: ['Недосип', 'Збитий графік'],
      preventiveAction: 'Зробіть 15-хвилинну паузу для очей та легку прогулянку.',
      recommendation: 'Зробіть 15-хвилинну паузу для очей та легку прогулянку.',
      status: 'warning',
      color: 'amber'
    });
  }

  if (scenarios.length === 0) {
    scenarios.push({
      id: 'sc_harmony',
      timeWindow: 'Весь день',
      probability: 90,
      probabilityText: '90%',
      title: 'Стійка фізіологічна регенерація',
      insight: 'Нейрогуморальний баланс у нормі.',
      mechanism: 'Нейрогуморальний баланс у нормі, ацетилхолінові рецептори стабільно відновлюються.',
      riskFactors: ['Факторів ризику не виявлено'],
      preventiveAction: 'Продовжуйте поточний гармонійний режим.',
      recommendation: 'Продовжуйте поточний гармонійний режим.',
      status: 'safe',
      color: 'emerald'
    });
  }

  return scenarios;
}

export function getAnalyzerLivingDialogue(arg1?: any, arg2?: any): LivingDialogueTurn {
  const safeCheckIn: any = typeof arg1 === 'number' ? (arg2 || {}) : (arg1 || {});
  const craving = safeCheckIn.cravingLevel || 1;
  const water = safeCheckIn.waterMl || ((safeCheckIn.waterGlasses || 0) * 250);

  if (craving >= 4) {
    return {
      id: `turn_${Date.now()}`,
      speaker: 'analyzer',
      text: 'Бачу сильний імпульс тяги. Ця хімічна хвиля триватиме лише 3 хвилини. Ми дихаємо разом з тобою.',
      greeting: 'Я поруч.',
      livingAnalysis: 'Зафіксовано адреналіновий пік тяги. Застосуй антидот 4-7-8.',
      emotionalTone: 'calm',
      choices: [
        { id: 'c1', text: 'Почати дихання 4-7-8', actionType: 'breath' },
        { id: 'c2', text: 'Випити склянку води', actionType: 'water' },
        { id: 'c3', text: 'Я тримаюся!', actionType: 'affirm' }
      ],
      timestamp: Date.now()
    };
  }

  if (water < 800) {
    return {
      id: `turn_${Date.now()}`,
      speaker: 'analyzer',
      text: 'Рівень гідратації знижений. Чашка чистої води прямо зараз зніме судинний спазм і додасть сил.',
      greeting: 'Зверни увагу на гідратацію.',
      livingAnalysis: 'Густа кров уповільнює детоксикацію. Випий води.',
      emotionalTone: 'supportive',
      choices: [
        { id: 'w1', text: '+1 склянка води (+250 мл)', actionType: 'water' },
        { id: 'w2', text: 'Добре, зараз вип’ю', actionType: 'affirm' }
      ],
      timestamp: Date.now()
    };
  }

  return {
    id: `turn_${Date.now()}`,
    speaker: 'analyzer',
    text: 'Усі твої показники в гармонії. Пульс спокійний, мозок очищається від нікотинового туману. Я поруч ✨',
    greeting: 'Все гармонійно.',
    livingAnalysis: 'Твої біопоказники стабільні, нервова система відновлюється.',
    emotionalTone: 'harmony',
    choices: [
      { id: 'h1', text: 'Дякую ✨', actionType: 'affirm' }
    ],
    timestamp: Date.now()
  };
}
