// Sentient Thought Database for Analyzer (900 items across 9 unique themes)
import { HEALTH_ADVICE_THOUGHTS } from './thoughts/healthAdvice';
import { APP_GUIDE_THOUGHTS } from './thoughts/appGuide';
import { ABSURD_THOUGHTS } from './thoughts/absurd';
import { POETIC_THOUGHTS } from './thoughts/poetic';
import { SUBTLE_MUNDANE_THOUGHTS } from './thoughts/subtleMundane';
import { JOKES_THOUGHTS } from './thoughts/jokes';
import { SCIENCE_THOUGHTS } from './thoughts/science';
import { NATURE_WILDLIFE_THOUGHTS } from './thoughts/natureWildlife';
import { HIDDEN_COZINESS_THOUGHTS } from './thoughts/hiddenCoziness';

export type ThoughtCategory = 
  | 'health_advice'   // 1. Поради щодо здоровʼя (100)
  | 'app_guide'       // 2. Інструкції з використання застосунку (100)
  | 'absurd'          // 3. Абсурдні фрази (100)
  | 'poetic'          // 4. Поетичні фрази (100)
  | 'subtle_mundane'  // 5. Буденні фрази про те що людям здається занадто простим але це дуже особливі фрази (100)
  | 'jokes'           // 6. Жарти (100)
  | 'science'         // 7. Наукові факти (100)
  | 'nature_wildlife' // 8. Факти з життя тварин рослин та всієї природи (100)
  | 'hidden_coziness' // 9. Фрази про затишок який не одразу розумієш (100)
  // Legacy aliases:
  | 'useful_advice'
  | 'app_tip'
  | 'humor'
  | 'nature'
  | 'unobvious'
  | 'mundane';

export interface SentientRandomThought {
  id: string;
  category: ThoughtCategory;
  categoryLabel: string;
  emoji: string;
  text: string;
}

export interface ThoughtCategoryMeta {
  category: ThoughtCategory;
  label: string;
  iconName: string;
  description: string;
  glowColor: string;
}

export const THOUGHT_CATEGORIES_METADATA: Record<ThoughtCategory, ThoughtCategoryMeta> = {
  health_advice: {
    category: 'health_advice',
    label: 'Поради щодо здоровʼя',
    iconName: 'HeartPulse',
    description: 'Фізіологія відновлення, дихальні практики, сон та подолання тяги',
    glowColor: 'rgba(239, 68, 68, 0.95)',
  },
  useful_advice: {
    category: 'health_advice',
    label: 'Поради щодо здоровʼя',
    iconName: 'HeartPulse',
    description: 'Фізіологія відновлення, дихальні практики, сон та подолання тяги',
    glowColor: 'rgba(239, 68, 68, 0.95)',
  },
  app_guide: {
    category: 'app_guide',
    label: 'Інструкції застосунку',
    iconName: 'Smartphone',
    description: 'Секрети керування, жести, вкладки, бекап, теми та корисні фічі',
    glowColor: 'rgba(59, 130, 246, 0.95)',
  },
  app_tip: {
    category: 'app_guide',
    label: 'Інструкції застосунку',
    iconName: 'Smartphone',
    description: 'Секрети керування, жести, вкладки, бекап, теми та корисні фічі',
    glowColor: 'rgba(59, 130, 246, 0.95)',
  },
  absurd: {
    category: 'absurd',
    label: 'Абсурдні фрази',
    iconName: 'Sparkles',
    description: 'Сюрреалістичні парадокси, кумедні метафори та дивовижні роздуми',
    glowColor: 'rgba(232, 121, 249, 0.95)',
  },
  poetic: {
    category: 'poetic',
    label: 'Поетичні фрази',
    iconName: 'Feather',
    description: 'Атмосферні, ліричні думки про час, тишу, світло й внутрішній спокій',
    glowColor: 'rgba(244, 114, 182, 0.95)',
  },
  subtle_mundane: {
    category: 'subtle_mundane',
    label: 'Особлива буденність',
    iconName: 'Coffee',
    description: 'Прості буденні дрібниці, які насправді мають колосальне значення',
    glowColor: 'rgba(251, 146, 60, 0.95)',
  },
  mundane: {
    category: 'subtle_mundane',
    label: 'Особлива буденність',
    iconName: 'Coffee',
    description: 'Прості буденні дрібниці, які насправді мають колосальне значення',
    glowColor: 'rgba(251, 146, 60, 0.95)',
  },
  jokes: {
    category: 'jokes',
    label: 'Жарти',
    iconName: 'Laugh',
    description: 'Дотепний гумор, самоіронія, життєві ситуації та легкість думок',
    glowColor: 'rgba(253, 224, 71, 0.95)',
  },
  humor: {
    category: 'jokes',
    label: 'Жарти',
    iconName: 'Laugh',
    description: 'Дотепний гумор, самоіронія, життєві ситуації та легкість думок',
    glowColor: 'rgba(253, 224, 71, 0.95)',
  },
  science: {
    category: 'science',
    label: 'Наукові факти',
    iconName: 'Atom',
    description: 'Астрофізика, квантовий світ, нейробіологія та будова Всесвіту',
    glowColor: 'rgba(56, 189, 248, 0.95)',
  },
  nature_wildlife: {
    category: 'nature_wildlife',
    label: 'Світ природи',
    iconName: 'Leaf',
    description: 'Дивовижні факти про тварин, ліси, океани, грибниці та комах',
    glowColor: 'rgba(74, 222, 128, 0.95)',
  },
  nature: {
    category: 'nature_wildlife',
    label: 'Світ природи',
    iconName: 'Leaf',
    description: 'Дивовижні факти про тварин, ліси, океани, грибниці та комах',
    glowColor: 'rgba(74, 222, 128, 0.95)',
  },
  hidden_coziness: {
    category: 'hidden_coziness',
    label: 'Неочевидний затишок',
    iconName: 'Moon',
    description: 'Затишок, який помічаєш не одразу: морозні звуки, стара книга, теплий светр',
    glowColor: 'rgba(168, 85, 247, 0.95)',
  },
  unobvious: {
    category: 'hidden_coziness',
    label: 'Неочевидний затишок',
    iconName: 'Moon',
    description: 'Затишок, який помічаєш не одразу: морозні звуки, стара книга, теплий светр',
    glowColor: 'rgba(168, 85, 247, 0.95)',
  },
};

// 9 Primary Distinct Themes in Strict User Order
export const PRIMARY_THEMES_ORDER: ThoughtCategory[] = [
  'health_advice',   // 1. Поради щодо здоровʼя
  'app_guide',       // 2. Інструкції з використання застосунку
  'absurd',          // 3. Абсурдні фрази
  'poetic',          // 4. Поетичні фрази
  'subtle_mundane',  // 5. Буденні фрази про те що здається занадто простим але дуже особливе
  'jokes',           // 6. Жарти
  'science',         // 7. Наукові факти
  'nature_wildlife', // 8. Факти з життя тварин рослин та всієї природи
  'hidden_coziness', // 9. Фрази про затишок який не одразу розумієш
];

// Rich Sentient Thought Database (All 900 unique items)
export const SENTIENT_ANALYZER_THOUGHTS: SentientRandomThought[] = [
  ...HEALTH_ADVICE_THOUGHTS,
  ...APP_GUIDE_THOUGHTS,
  ...ABSURD_THOUGHTS,
  ...POETIC_THOUGHTS,
  ...SUBTLE_MUNDANE_THOUGHTS,
  ...JOKES_THOUGHTS,
  ...SCIENCE_THOUGHTS,
  ...NATURE_WILDLIFE_THOUGHTS,
  ...HIDDEN_COZINESS_THOUGHTS,
];

// Fast Lookup Map by ID
const THOUGHTS_BY_ID_MAP = new Map<string, SentientRandomThought>();
SENTIENT_ANALYZER_THOUGHTS.forEach((t) => THOUGHTS_BY_ID_MAP.set(t.id, t));

// Grouped Map by Primary Category
const THOUGHTS_BY_CATEGORY_MAP = new Map<ThoughtCategory, SentientRandomThought[]>();
PRIMARY_THEMES_ORDER.forEach((cat) => {
  THOUGHTS_BY_CATEGORY_MAP.set(
    cat,
    SENTIENT_ANALYZER_THOUGHTS.filter((t) => t.category === cat)
  );
});

// Helper: Fisher-Yates Shuffle
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

interface ThoughtCycleState {
  categoryIndex: number;
  decks: Record<string, string[]>;
  pointers: Record<string, number>;
}

const CYCLE_STORAGE_KEY = 'quit-smoking:analyzer-thought-cycle-state-v1';

function normalizeCategory(cat?: string): ThoughtCategory {
  if (!cat) return 'health_advice';
  if (cat === 'useful_advice') return 'health_advice';
  if (cat === 'app_tip') return 'app_guide';
  if (cat === 'humor') return 'jokes';
  if (cat === 'nature') return 'nature_wildlife';
  if (cat === 'unobvious') return 'hidden_coziness';
  if (cat === 'mundane') return 'subtle_mundane';
  return cat as ThoughtCategory;
}

// Load or Initialize Round-Robin & Anti-Repeat Shuffled Decks
function loadOrInitCycleState(): ThoughtCycleState {
  try {
    const raw = localStorage.getItem(CYCLE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ThoughtCycleState;
      if (
        typeof parsed.categoryIndex === 'number' &&
        parsed.decks &&
        parsed.pointers
      ) {
        return parsed;
      }
    }
  } catch {}

  const state: ThoughtCycleState = {
    categoryIndex: 0,
    decks: {},
    pointers: {},
  };

  PRIMARY_THEMES_ORDER.forEach((cat) => {
    const pool = THOUGHTS_BY_CATEGORY_MAP.get(cat) || [];
    const ids = pool.map((t) => t.id);
    state.decks[cat] = shuffleArray(ids);
    state.pointers[cat] = 0;
  });

  try {
    localStorage.setItem(CYCLE_STORAGE_KEY, JSON.stringify(state));
  } catch {}

  return state;
}

function saveCycleState(state: ThoughtCycleState) {
  try {
    localStorage.setItem(CYCLE_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

/**
 * Sequential Anti-Repeat Thought Generator:
 * - Cycles strictly through the 9 themes in order:
 *   Health -> App Guide -> Absurd -> Poetic -> Subtle Mundane -> Jokes -> Science -> Nature -> Hidden Coziness
 * - Each theme maintains a deck of 100 items. No thought repeats until the entire 100-item deck is exhausted!
 */
export function getNextSequentialThought(preferredCategory?: ThoughtCategory): SentientRandomThought {
  const state = loadOrInitCycleState();

  let targetCategory: ThoughtCategory;

  if (preferredCategory) {
    targetCategory = normalizeCategory(preferredCategory);
  } else {
    // Round-robin theme selection
    const rawCat = PRIMARY_THEMES_ORDER[state.categoryIndex % PRIMARY_THEMES_ORDER.length];
    targetCategory = rawCat;
    state.categoryIndex = (state.categoryIndex + 1) % PRIMARY_THEMES_ORDER.length;
  }

  // Ensure deck exists for this category
  let deck = state.decks[targetCategory];
  let ptr = state.pointers[targetCategory] ?? 0;
  const pool = THOUGHTS_BY_CATEGORY_MAP.get(targetCategory) || [];

  if (!deck || deck.length === 0 || ptr >= deck.length) {
    deck = shuffleArray(pool.map((t) => t.id));
    state.decks[targetCategory] = deck;
    ptr = 0;
  }

  const chosenId = deck[ptr];
  state.pointers[targetCategory] = ptr + 1;

  saveCycleState(state);

  const found = THOUGHTS_BY_ID_MAP.get(chosenId);
  if (found) return found;

  return pool[0] || SENTIENT_ANALYZER_THOUGHTS[0];
}

export function matchesCategory(thoughtOrCategory: SentientRandomThought | string, category: ThoughtCategory | 'all'): boolean {
  if (!category || category === ('all' as any)) return true;
  const catStr = typeof thoughtOrCategory === 'string' ? thoughtOrCategory : thoughtOrCategory.category;
  const normCat = normalizeCategory(category);
  const normThoughtCat = normalizeCategory(catStr as ThoughtCategory);
  return normThoughtCat === normCat;
}

export function getInterleavedThoughtStream(): SentientRandomThought[] {
  return [...SENTIENT_ANALYZER_THOUGHTS];
}

