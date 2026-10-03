export interface AnalyzerDialogueSettings {
  // 1. Зріз стану (-1 = випадковий час)
  sliceEnabled: boolean;
  sliceIntervalMinutes: number; // 30, 60, 90, 120, 180, or -1 (random)

  // 2. Тест на обʼєм легень
  lungTestEnabled: boolean;
  lungTestSchedule: 'random' | 'morning' | 'afternoon' | 'evening' | 'custom';
  lungTestHour: number; // 0 - 23

  // 3. Тригерфікс (-1 = випадковий час)
  triggerFixEnabled: boolean;
  triggerFixIntervalMinutes: number; // 60, 120, 180, 240, or -1 (random)

  // 4. Запитати "Як справи?" (-1 = випадковий час)
  howAreYouEnabled: boolean;
  howAreYouIntervalMinutes: number; // 30, 60, 120, 180, or -1 (random)

  // 5. Аналіз зрізу після проходження (вкл / викл)
  postSliceAnalysisEnabled: boolean;

  // 6. Гідратація (-1 = випадковий час)
  hydrationEnabled: boolean;
  hydrationIntervalMinutes: number; // 45, 60, 90, 120, or -1 (random)
  hydrationTargetMl: number;

  // 7. Щоденник вдячності
  gratitudeEnabled: boolean;
  gratitudeSchedule: 'evening' | 'custom' | 'interval' | 'random';
  gratitudeHour: number; // 0 - 23 (e.g. 20 for 20:00)
  gratitudeIntervalMinutes: number;

  // 8. Список справ дня (Таймери на кожну справу)
  dailyStepsEnabled: boolean;
  dailyStepsReminderMode: 'per_task' | 'general' | 'both' | 'random';
  dailyStepsGeneralHour: number;
}

export type DialogueActionType =
  | 'slice' // Відкрити повний зріз стану
  | 'analysis' // Відкрити Аналіз та графіки
  | 'triggerfix' // Відкрити Тригерфікс
  | 'navigate_sos' // Навігація до SOS вкладки
  | 'lung_test' // Запустити тест легень (проба Штанге)
  | 'hydration' // Додати воду (+1 склянка або мл)
  | 'gratitude_journal' // Відкрити Щоденник вдячності
  | 'daily_steps' // Відкрити Список справ дня
  | 'task_reminder' // Нагадування про конкретну справу
  | 'task_done' // Позначити справу виконаною
  | 'remind_timer' // Нагадати за таймером
  | 'calm_breath' // Дихання 4-7-8
  | 'box_breath' // Квадратне дихання 4-4-4-4
  | 'deep_breath_10' // Глибокі 10 вдихів
  | 'grounding_54321' // Заземлення 5-4-3-2-1
  | 'mint_tea' // М'ятний чай
  | 'cold_compress' // Охолодження скронь
  | 'pulse_check' // Перевірка пульсу
  | 'next_replica' // Наступна репліка Аналізатора
  | 'open_quick_panel' // Відкрити головне меню Швидкої панелі
  | 'close_quiet' // Закрити в спокійному режимі
  | 'style_cat' // Переключити на Чорного кота
  | 'style_glitter' // Переключити на Глітер
  | 'style_cosmic_ring' // Переключити на Космічне кільце
  | 'style_wave' // Переключити на Хвилю
  | 'style_snowflake' // Переключити на Сніжинку
  | 'style_autumn' // Переключити на Осінь
  | 'style_flower' // Переключити на Квітку
  | 'set_hue_sakura' // Сяйво: Сакура (330°)
  | 'set_hue_ocean' // Сяйво: Океан (210°)
  | 'set_hue_emerald' // Сяйво: Смарагд (140°)
  | 'set_hue_amber' // Сяйво: Янтар (45°)
  | 'set_hue_uv' // Сяйво: Ультрафіолет (280°)
  | 'set_hue_custom' // Кастомний спектр градусу
  | 'set_mode_mono_white' // Монохромний режим: Білий
  | 'set_mode_mono_black' // Монохромний режим: Чорний
  | 'set_mode_color' // Повнокольоровий режим
  | 'set_blur_max' // Максимальне розмиття (12 px)
  | 'set_blur_medium' // Середне розмиття (6 px)
  | 'set_blur_zero' // Абсолютна чіткість (0 px)
  | 'set_blur_custom' // Кастомне розмиття
  | 'add_resilience_10' // +10 балів стійкості
  | 'add_resilience_50' // +50 балів стійкості
  | 'add_resilience_100' // +100 балів супер-стійкості
  | 'add_resilience_custom' // Кастомна кількість балів
  | 'catarsis_release' // Катарсис-розрядка
  | 'philosophy_thought' // Філософська мудрість
  | 'provocation_challenge' // Психологічний виклик
  | 'stop_thought_technique' // Техніка Стоп-Думка
  | 'lung_clean_visualization' // Візуалізація чистої легені
  | 'sound_zen_impulse' // Звуковий дзен-імпульс
  | 'combo_chain'; // Немислима комбінована мульти-дія!

export type DialogueVisualReaction = 'joy' | 'active' | 'calm';

export interface DialogueOptionConfig {
  id: string;
  text: string;
  action: DialogueActionType;
  actionParam?: number | string;
  visualReaction?: DialogueVisualReaction;
  analyzerReply?: string;
  nextReplicaText?: string;
}

export interface DialoguePhraseItem {
  id: string;
  name: string;
  category?: string;
  icon?: string;
  question: string;
  enabled?: boolean;
  intervalMinutes?: number;
  isCustom?: boolean;
  createdAt?: number;
  options: DialogueOptionConfig[];
  scheduleType?: 'interval' | 'hourly';
  scheduledHour?: number;
  analyzerFollowUp?: string;
  option1?: string;
  option2?: string;
}

export type DialoguePhrasesMap = Record<string, DialoguePhraseItem>;

export interface ActionSubStep {
  id: string;
  behavior: DialogueActionType;
  actionParam?: number | string;
  label?: string;
}

export interface AnalyzerActionDefinition {
  id: string;
  label: string;
  icon?: string;
  description: string;
  defaultReply: string;
  behavior: DialogueActionType;
  actionParam?: number | string;
  isCustom?: boolean;
  createdAt?: number;
  category?: 'health' | 'analytics' | 'appearance' | 'dialogue' | 'gamification' | 'system' | 'combo';
  subSteps?: ActionSubStep[]; // Chain of sub-actions to execute together in a combo!
}

export const stripEmoji = (str: string): string => {
  if (!str) return '';
  return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✨🌿💧⚡🫁⏱️📊💭☕🧘⏰💬🎛️🎲🌸🌊🔥❄️🎯🚨🌅]/gu, '');
};

export const BUILTIN_ANALYZER_ACTIONS: AnalyzerActionDefinition[] = [
  // --- 1. HEALTH & BODY ---
  {
    id: 'hydration',
    label: 'Додати воду (+1 склянка)',
    description: 'Фіксує прийом чистої води (+250 мл) для прискорення детоксу',
    defaultReply: 'Волога вже пішла в клітини та судини.',
    behavior: 'hydration',
    category: 'health'
  },
  {
    id: 'calm_breath',
    label: 'Дихання 4-7-8',
    description: 'Запускає цикл заспокоєння парасимпатичної нервової системи',
    defaultReply: 'Повільний вдих 4с, затримка 7с, довгий видих 8с...',
    behavior: 'calm_breath',
    category: 'health'
  },
  {
    id: 'box_breath',
    label: 'Квадратне дихання 4-4-4-4',
    description: '4 секунди вдих, 4с затримка, 4с видих, 4с затримка',
    defaultReply: 'Стабілізуємо серцевий ритм та фокус...',
    behavior: 'box_breath',
    category: 'health'
  },
  {
    id: 'deep_breath_10',
    label: 'Глибокі 10 вдихів',
    description: 'Енергійне насичення киснем тканин мозку',
    defaultReply: '10 глибоких вдихів витісняють залишкову напругу.',
    behavior: 'deep_breath_10',
    category: 'health'
  },
  {
    id: 'grounding_54321',
    label: 'Заземлення 5-4-3-2-1',
    description: 'Психофізична техніка повернення в реальність',
    defaultReply: 'Знайди 5 предметів, 4 звуки, 3 відчуття, 2 запахи, 1 смак.',
    behavior: 'grounding_54321',
    category: 'health'
  },
  {
    id: 'lung_test',
    label: 'Тест на обʼєм легень',
    description: 'Запускає щоденну пробу Штанге на затримку дихання',
    defaultReply: 'Приготуйся до повільного глибокого вдиху...',
    behavior: 'lung_test',
    category: 'health'
  },
  {
    id: 'mint_tea',
    label: 'Гарячий м\'ятний чай',
    description: 'Знімає спазм судин і пом\'якшує дихальні шляхи',
    defaultReply: 'М\'ята розслабляє гладку мускулатуру і повертає затишок.',
    behavior: 'mint_tea',
    category: 'health'
  },
  {
    id: 'cold_compress',
    label: 'Охолодження скронь',
    description: 'Нейтралізує гострий спалах тяги за рахунок холодового рефлексу',
    defaultReply: 'Холод переключає рецептори шкіри і знімає психологічний затиск.',
    behavior: 'cold_compress',
    category: 'health'
  },
  {
    id: 'pulse_check',
    label: 'Перевірка пульсу',
    description: 'Фіксує поточну частоту серцевих скорочень',
    defaultReply: 'Вимірюємо ритм пульсу для контролю стресу.',
    behavior: 'pulse_check',
    category: 'health'
  },

  // --- 2. ANALYTICS & STATS ---
  {
    id: 'slice',
    label: 'Відкрити Зріз (8 показників)',
    description: 'Відкриває повний зріз стану у Швидкій панелі',
    defaultReply: 'Відкриваю повний зріз 8 показників...',
    behavior: 'slice',
    category: 'analytics'
  },
  {
    id: 'gratitude_journal',
    label: 'Відкрити Щоденник вдячності',
    description: 'Заповнення щоденних пунктів вдячності для дофамінової рівноваги',
    defaultReply: 'Відкриваю Щоденник вдячності...',
    behavior: 'gratitude_journal',
    category: 'dialogue'
  },
  {
    id: 'daily_steps',
    label: 'Відкрити Список справ дня',
    description: 'Перегляд та відмітка запланованих щоденних мікро-кроків',
    defaultReply: 'Відкриваю Список справ дня...',
    behavior: 'daily_steps',
    category: 'dialogue'
  },
  {
    id: 'task_done',
    label: 'Позначити справу виконаною (% зроблено)',
    description: 'Зараховує поточну заплановану справу як виконану та показує % прогресу',
    defaultReply: 'Справу виконано! 20% сьогоднішніх справ уже зроблено!',
    behavior: 'task_done',
    category: 'gamification'
  },
  {
    id: 'analysis',
    label: 'Відкрити Аналіз та графіки',
    description: 'Переводить до розгорнутої динаміки, % змін та графіків',
    defaultReply: 'Відкриваю аналіз та графіки динаміки...',
    behavior: 'analysis',
    category: 'analytics'
  },
  {
    id: 'triggerfix',
    label: 'Відкрити Тригерфікс',
    description: 'Фіксація тригера та підбір антидоту проти тяги',
    defaultReply: 'Фіксуємо тригер і нейтралізуємо напругу...',
    behavior: 'triggerfix',
    category: 'analytics'
  },
  {
    id: 'navigate_sos',
    label: 'Перейти у режим SOS',
    description: 'Екстрена загартована кнопка порятунку від зриву',
    defaultReply: 'Активовано екстрений захисний SOS-сценарій!',
    behavior: 'navigate_sos',
    category: 'analytics'
  },

  // --- 3. APPEARANCE & SHELL CONTROLS ---
  {
    id: 'style_cat',
    label: 'Оболонка: Чорний кіт',
    description: 'Переключає вигляд оболонки на піксельного Чорного кота',
    defaultReply: 'Оболонку переключено на Чорного кота!',
    behavior: 'style_cat',
    category: 'appearance'
  },
  {
    id: 'style_wave',
    label: 'Оболонка: Хвиля',
    description: 'Переключає вигляд оболонки на динамічну Хвилю',
    defaultReply: 'Оболонку переключено на режим Хвилі.',
    behavior: 'style_wave',
    category: 'appearance'
  },
  {
    id: 'style_glitter',
    label: 'Оболонка: Глітер',
    description: 'Переключає вигляд оболонки на іскристий Глітер',
    defaultReply: 'Оболонку переключено на Глітер.',
    behavior: 'style_glitter',
    category: 'appearance'
  },
  {
    id: 'style_cosmic_ring',
    label: 'Оболонка: Космічне кільце',
    description: 'Орбітальне кільце спектральних зірок теми Стандартна космос',
    defaultReply: 'Оболонку переключено на Космічне кільце.',
    behavior: 'style_cosmic_ring',
    category: 'appearance'
  },
  {
    id: 'style_snowflake',
    label: 'Оболонка: Сніжинка',
    description: 'Кристалічний морозяний візерунок розслаблення',
    defaultReply: 'Оболонку переключено на Сніжинку.',
    behavior: 'style_snowflake',
    category: 'appearance'
  },
  {
    id: 'style_autumn',
    label: 'Оболонка: Осінь',
    description: 'Теплі золоті та бурштинові листопади',
    defaultReply: 'Оболонку переключено на режим Осені.',
    behavior: 'style_autumn',
    category: 'appearance'
  },
  {
    id: 'style_flower',
    label: 'Оболонка: Квітка',
    description: 'Ніжні пелюстки біологічного сяйва',
    defaultReply: 'Оболонку переключено на Квітку.',
    behavior: 'style_flower',
    category: 'appearance'
  },
  {
    id: 'set_hue_sakura',
    label: 'Сяйво: Сакура (330°)',
    description: 'Встановлює колір сяйва у ніжно-рожевий спектр сакури',
    defaultReply: 'Спектр сяйва змінено на Сакура (330°).',
    behavior: 'set_hue_sakura',
    category: 'appearance'
  },
  {
    id: 'set_hue_ocean',
    label: 'Сяйво: Океан (210°)',
    description: 'Встановлює колір сяйва у глибокий океанічний лазуровий',
    defaultReply: 'Спектр сяйва змінено на Океан (210°).',
    behavior: 'set_hue_ocean',
    category: 'appearance'
  },
  {
    id: 'set_hue_emerald',
    label: 'Сяйво: Смарагд (140°)',
    description: 'Заспокійливий живий лісовий зелений спектр',
    defaultReply: 'Спектр сяйва змінено на Смарагд (140°).',
    behavior: 'set_hue_emerald',
    category: 'appearance'
  },
  {
    id: 'set_hue_amber',
    label: 'Сяйво: Янтар (45°)',
    description: 'Тепле сонячне бурштинове сяйво затишку',
    defaultReply: 'Спектр сяйва змінено на Янтар (45°).',
    behavior: 'set_hue_amber',
    category: 'appearance'
  },
  {
    id: 'set_hue_uv',
    label: 'Сяйво: Ультрафіолет (280°)',
    description: 'Глибокий космічний неоновий ультрафіолет',
    defaultReply: 'Спектр сяйва змінено на Ультрафіолет (280°).',
    behavior: 'set_hue_uv',
    category: 'appearance'
  },
  {
    id: 'set_mode_mono_white',
    label: 'Переключити у Білий Ч/б',
    description: 'Вмикає білосніжний монохромний режим оболонки',
    defaultReply: 'Увімкнено білий монохромний режим.',
    behavior: 'set_mode_mono_white',
    category: 'appearance'
  },
  {
    id: 'set_mode_mono_black',
    label: 'Переключити у Чорний Ч/б',
    description: 'Глибокий темний монохромний режим оболонки',
    defaultReply: 'Увімкнено темний монохромний режим.',
    behavior: 'set_mode_mono_black',
    category: 'appearance'
  },
  {
    id: 'set_mode_color',
    label: 'Повнокольоровий режим',
    description: 'Відновлює насичений спектр кольору оболонки',
    defaultReply: 'Повнокольоровий спектр оболонки відновлено.',
    behavior: 'set_mode_color',
    category: 'appearance'
  },
  {
    id: 'set_blur_max',
    label: 'Максимальне розмиття (12 px)',
    description: 'Занурює оболонку у туманний затишний аура-фільтр',
    defaultReply: 'Максимальну розмитість туману увімкнено.',
    behavior: 'set_blur_max',
    category: 'appearance'
  },
  {
    id: 'set_blur_zero',
    label: 'Абсолютна чіткість (0 px)',
    description: 'Скидає розмиття для кришталевої чіткості деталей',
    defaultReply: 'Оболонку переведено у чіткий контурний режим.',
    behavior: 'set_blur_zero',
    category: 'appearance'
  },

  // --- 4. GAMIFICATION & RESILIENCE ---
  {
    id: 'add_resilience_10',
    label: 'Додати +10 балів стійкості',
    description: 'Нараховує 10 бонусних очок до твого рейтингу волі',
    defaultReply: 'Твоя стійкість зросла на +10 балів!',
    behavior: 'add_resilience_10',
    category: 'gamification'
  },
  {
    id: 'add_resilience_50',
    label: 'Бонус +50 балів стійкості',
    description: 'Велике заохочення за подолання важкого випробування',
    defaultReply: 'Супер-прогрес! +50 балів додано до твого балансу!',
    behavior: 'add_resilience_50',
    category: 'gamification'
  },
  {
    id: 'add_resilience_100',
    label: 'Супер-Бонус +100 балів',
    description: 'Екстра-нагорода за подолання критичного тригера',
    defaultReply: 'Мега-перемога! +100 балів Супер-Стійкості зараховано!',
    behavior: 'add_resilience_100',
    category: 'gamification'
  },

  // --- 5. DIALOGUE & PSYCHOLOGY ---
  {
    id: 'catarsis_release',
    label: 'Катарсис-розрядка',
    description: 'Психологічний скид накопиченого стресу та напруги',
    defaultReply: 'Видихни все, що тиснуло. Напруга розсіялася.',
    behavior: 'catarsis_release',
    category: 'dialogue'
  },
  {
    id: 'philosophy_thought',
    label: 'Філософська мудрість',
    description: 'Глибокий погляд на свободу від залежності',
    defaultReply: 'Свобода — це не відсутність бажань, це влада над ними.',
    behavior: 'philosophy_thought',
    category: 'dialogue'
  },
  {
    id: 'stop_thought_technique',
    label: 'Техніка Стоп-Думка',
    description: 'Миттєвий розрив шаблону при виникненні імпульсу',
    defaultReply: 'СТОП! Ця думка — лише тимчасова біохімічна хвиля.',
    behavior: 'stop_thought_technique',
    category: 'dialogue'
  },
  {
    id: 'lung_clean_visualization',
    label: 'Візуалізація чистої легені',
    description: 'Уявне очищення альвеол та відновлення кисню',
    defaultReply: 'Відчуй, як з кожним видихом альвеоли стають чистішими.',
    behavior: 'lung_clean_visualization',
    category: 'dialogue'
  },
  {
    id: 'sound_zen_impulse',
    label: 'Звуковий дзен-імпульс',
    description: 'Гармонізаційний імпульс частоти розслаблення',
    defaultReply: 'Звуковий акустичний резонанс дзен активовано.',
    behavior: 'sound_zen_impulse',
    category: 'dialogue'
  },
  {
    id: 'provocation_challenge',
    label: 'Психологічний виклик',
    description: 'Виклик твоїй волі від Аналізатора',
    defaultReply: 'Доведи собі, що твій мобільний розум сильніший за хімію.',
    behavior: 'provocation_challenge',
    category: 'dialogue'
  },
  {
    id: 'next_replica',
    label: 'Наступна репліка Аналізатора',
    description: 'Розширює діалог переходом до наступної гілки',
    defaultReply: 'Я поруч, давай розберемося разом.',
    behavior: 'next_replica',
    category: 'dialogue'
  },

  // --- 6. SYSTEM & NAVIGATION ---
  {
    id: 'remind_timer',
    label: 'Нагадати через 30 хв',
    description: 'Відкладає діалог на обрану кількість хвилин',
    defaultReply: 'Зрозумів, нагадаю за таймером.',
    behavior: 'remind_timer',
    actionParam: 30,
    category: 'system'
  },
  {
    id: 'open_quick_panel',
    label: 'Відкрити Швидку панель',
    description: 'Відкриває головне меню швидких дій Аналізатора',
    defaultReply: 'Відкриваю панель швидких механік...',
    behavior: 'open_quick_panel',
    category: 'system'
  },
  {
    id: 'close_quiet',
    label: 'Подякувати й закрити',
    description: 'Закриває діалог, Аналізатор переходить у спокійний режим',
    defaultReply: 'Все спокійно. Гарного самопочуття!',
    behavior: 'close_quiet',
    category: 'system'
  },

  // --- 7. MIND-BENDING COMBO CHAINS (Немислимі комбіновані мульти-дії) ---
  {
    id: 'combo_zen_reset',
    label: 'Мульти-Комбо: Дзен Перезавантаження',
    description: 'Повне занурення: Вода + Хвиля + Океан 210° + Дихання 4-7-8 + +10 Стійкості',
    defaultReply: 'Запущено повну програму Дзен-перезавантаження!',
    behavior: 'combo_chain',
    category: 'combo',
    subSteps: [
      { id: 'c1', behavior: 'hydration', label: 'Вода (+250 мл)' },
      { id: 'c2', behavior: 'style_wave', label: 'Оболонка Хвиля' },
      { id: 'c3', behavior: 'set_hue_ocean', label: 'Океанське сяйво 210°' },
      { id: 'c4', behavior: 'calm_breath', label: 'Дихання 4-7-8' },
      { id: 'c5', behavior: 'add_resilience_10', label: '+10 балів' }
    ]
  },
  {
    id: 'combo_cosmic_jump',
    label: 'Мульти-Комбо: Космічний Неоновий Стрибок',
    description: 'Комбо: Глітер + Ультрафіолет 280° + Туман 12px + Стоп-Думка + +50 Стійкості',
    defaultReply: 'Неоновий стрибок активовано! Повна нейтралізація тяги.',
    behavior: 'combo_chain',
    category: 'combo',
    subSteps: [
      { id: 'cj1', behavior: 'style_glitter', label: 'Оболонка Глітер' },
      { id: 'cj2', behavior: 'set_hue_uv', label: 'Ультрафіолет 280°' },
      { id: 'cj3', behavior: 'set_blur_max', label: 'Розмиття 12px' },
      { id: 'cj4', behavior: 'stop_thought_technique', label: 'Техніка Стоп-Думка' },
      { id: 'cj5', behavior: 'add_resilience_50', label: '+50 балів' }
    ]
  },
  {
    id: 'combo_ice_detox',
    label: 'Мульти-Комбо: Крижаний Детокс & Зріз',
    description: 'Комбо: Охолодження скронь + Чіткість 0px + Вода + Тест легень + Повний Зріз',
    defaultReply: 'Крижаний детокс зафіксовано, відкриваю аналітику...',
    behavior: 'combo_chain',
    category: 'combo',
    subSteps: [
      { id: 'id1', behavior: 'cold_compress', label: 'Охолодження скронь' },
      { id: 'id2', behavior: 'set_blur_zero', label: 'Чіткість 0px' },
      { id: 'id3', behavior: 'hydration', label: 'Вода (+250 мл)' },
      { id: 'id4', behavior: 'lung_test', label: 'Тест легень' },
      { id: 'id5', behavior: 'slice', label: 'Зріз 8 показників' }
    ]
  },
  {
    id: 'combo_black_cat_matrix',
    label: 'Мульти-Комбо: Чорна Матриця Волі',
    description: 'Комбо: Чорний кіт + Чорний Ч/б + Катарсис + +100 Супер-Стійкості',
    defaultReply: 'Матриця волі активована. Ти контролюєш свій розум.',
    behavior: 'combo_chain',
    category: 'combo',
    subSteps: [
      { id: 'bm1', behavior: 'style_cat', label: 'Оболонка Чорний кіт' },
      { id: 'bm2', behavior: 'set_mode_mono_black', label: 'Чорний Ч/б' },
      { id: 'bm3', behavior: 'catarsis_release', label: 'Катарсис-розрядка' },
      { id: 'bm4', behavior: 'add_resilience_100', label: '+100 балів стійкості' }
    ]
  },
  {
    id: 'combo_flower_harmony',
    label: 'Мульти-Комбо: Квітуча Гармонія',
    description: 'Комбо: Квітка + Смарагд 140° + М\'ятний чай + Філософія + Заземлення 5-4-3-2-1',
    defaultReply: 'Гармонія відновлена. Дихай вільно та легко.',
    behavior: 'combo_chain',
    category: 'combo',
    subSteps: [
      { id: 'fh1', behavior: 'style_flower', label: 'Оболонка Квітка' },
      { id: 'fh2', behavior: 'set_hue_emerald', label: 'Смарагд 140°' },
      { id: 'fh3', behavior: 'mint_tea', label: 'М\'ятний чай' },
      { id: 'fh4', behavior: 'grounding_54321', label: 'Заземлення 5-4-3-2-1' },
      { id: 'fh5', behavior: 'philosophy_thought', label: 'Філософська мудрість' }
    ]
  }
];

export const DIALOGUE_ACTIONS_LIST = BUILTIN_ANALYZER_ACTIONS;

const CUSTOM_ACTIONS_STORAGE_KEY = 'quit-smoking:custom-analyzer-actions';

export const loadCustomAnalyzerActions = (): AnalyzerActionDefinition[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_ACTIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((a) => ({
          ...a,
          label: stripEmoji(a.label),
          description: stripEmoji(a.description),
          defaultReply: a.defaultReply ? stripEmoji(a.defaultReply) : undefined,
          icon: a.icon ? stripEmoji(a.icon) : undefined
        }));
      }
    }
  } catch {}
  return [];
};

export const saveCustomAnalyzerActions = (actions: AnalyzerActionDefinition[]): void => {
  try {
    const cleaned = actions.map((a) => ({
      ...a,
      label: stripEmoji(a.label),
      description: stripEmoji(a.description),
      defaultReply: a.defaultReply ? stripEmoji(a.defaultReply) : undefined,
      icon: a.icon ? stripEmoji(a.icon) : undefined
    }));
    localStorage.setItem(CUSTOM_ACTIONS_STORAGE_KEY, JSON.stringify(cleaned));
    window.dispatchEvent(new CustomEvent('analyzer-custom-actions-changed', { detail: cleaned }));
    window.dispatchEvent(new Event('storage'));
  } catch {}
};

export const getAllAnalyzerActions = (): AnalyzerActionDefinition[] => {
  const custom = loadCustomAnalyzerActions();
  return [...custom, ...BUILTIN_ANALYZER_ACTIONS];
};

export const createNewCustomAction = (
  label: string,
  icon: string = '',
  description: string = 'Власна дія',
  behavior: DialogueActionType = 'close_quiet',
  defaultReply: string = 'Дію виконано.',
  actionParam?: number | string
): AnalyzerActionDefinition => {
  const id = `action_${Date.now()}`;
  return {
    id,
    label: stripEmoji(label),
    icon: stripEmoji(icon),
    description: stripEmoji(description),
    defaultReply: stripEmoji(defaultReply),
    behavior,
    actionParam,
    isCustom: true,
    createdAt: Date.now()
  };
};

export const DEFAULT_DIALOGUE_SETTINGS: AnalyzerDialogueSettings = {
  sliceEnabled: true,
  sliceIntervalMinutes: -1,

  lungTestEnabled: true,
  lungTestSchedule: 'random',
  lungTestHour: 14,

  triggerFixEnabled: true,
  triggerFixIntervalMinutes: -1,

  howAreYouEnabled: true,
  howAreYouIntervalMinutes: -1,

  postSliceAnalysisEnabled: true,

  hydrationEnabled: true,
  hydrationIntervalMinutes: -1,
  hydrationTargetMl: 2000,

  gratitudeEnabled: true,
  gratitudeSchedule: 'random',
  gratitudeHour: 20,
  gratitudeIntervalMinutes: -1,

  dailyStepsEnabled: true,
  dailyStepsReminderMode: 'random',
  dailyStepsGeneralHour: 10
};

export const DEFAULT_DIALOGUE_PHRASES: DialoguePhrasesMap = {
  slice: {
    id: 'slice',
    name: 'Пройти Зріз стану',
    category: 'Аналітика',
    icon: '',
    question: 'Час для зрізу стану. Пройдемо?',
    enabled: true,
    intervalMinutes: -1,
    options: [
      {
        id: 'opt_slice_1',
        text: 'Пройти зріз',
        action: 'slice',
        visualReaction: 'active',
        analyzerReply: 'Відкриваю зріз...'
      },
      {
        id: 'opt_slice_2',
        text: 'Пізніше',
        action: 'close_quiet',
        visualReaction: 'calm',
        analyzerReply: 'Добре, нагадаю згодом.'
      }
    ]
  },
  gratitude_journal: {
    id: 'gratitude_journal',
    name: 'Щоденник вдячності',
    category: 'Психологія',
    icon: '',
    question: 'Час для Щоденника вдячності! Знайдемо 3 речі, за які ти вдячний сьогодні?',
    enabled: true,
    intervalMinutes: -1,
    scheduleType: 'hourly',
    scheduledHour: 20,
    options: [
      {
        id: 'opt_grat_1',
        text: 'Заповнити щоденник',
        action: 'gratitude_journal',
        visualReaction: 'joy',
        analyzerReply: 'Відкриваю Щоденник вдячності...'
      },
      {
        id: 'opt_grat_2',
        text: 'Нагадати через 30 хв',
        action: 'remind_timer',
        actionParam: 30,
        visualReaction: 'calm',
        analyzerReply: 'Зрозумів, нагадаю згодом.'
      },
      {
        id: 'opt_grat_3',
        text: 'Вже заповнив',
        action: 'close_quiet',
        visualReaction: 'joy',
        analyzerReply: 'Чудово! Дофаміновий баланс зафіксовано.'
      }
    ]
  },
  daily_steps: {
    id: 'daily_steps',
    name: 'Список справ дня',
    category: 'Продуктивність',
    icon: '',
    question: 'Переглянемо твій список запланованих справ на сьогодні?',
    enabled: true,
    intervalMinutes: -1,
    scheduleType: 'hourly',
    scheduledHour: 10,
    options: [
      {
        id: 'opt_steps_1',
        text: 'Відкрити список справ',
        action: 'daily_steps',
        visualReaction: 'active',
        analyzerReply: 'Відкриваю Список справ дня...'
      },
      {
        id: 'opt_steps_2',
        text: 'Нагадати пізніше',
        action: 'remind_timer',
        actionParam: 30,
        visualReaction: 'calm',
        analyzerReply: 'Нагадаю за таймером.'
      },
      {
        id: 'opt_steps_3',
        text: 'Все під контролем',
        action: 'close_quiet',
        visualReaction: 'joy',
        analyzerReply: 'Супер! Успішного та спокійного дня!'
      }
    ]
  },
  how_are_you: {
    id: 'how_are_you',
    name: 'Запитати «Чи все гаразд?»',
    category: 'Самопочуття',
    icon: '',
    question: 'Чи все гаразд?',
    enabled: true,
    intervalMinutes: -1,
    options: [
      {
        id: 'opt_1',
        text: 'Так, все добре',
        action: 'close_quiet',
        analyzerReply: 'Чудово, я поруч.'
      },
      {
        id: 'opt_2',
        text: 'Ні, потрібна підтримка',
        action: 'next_replica',
        nextReplicaText: 'Обери техніку SOS:',
        analyzerReply: 'Я поруч.'
      }
    ]
  },
  triggerfix: {
    id: 'triggerfix',
    name: 'Тригерфікс',
    category: 'Захист',
    icon: '',
    question: 'Відчуваєш напругу?',
    enabled: true,
    intervalMinutes: -1,
    options: [
      {
        id: 'opt_1',
        text: 'Тригерфікс',
        action: 'triggerfix',
        analyzerReply: 'Відкриваю Тригерфікс...'
      },
      {
        id: 'opt_2',
        text: 'Все добре',
        action: 'close_quiet',
        analyzerReply: 'Супер!'
      }
    ]
  },
  post_slice: {
    id: 'post_slice',
    name: 'Аналіз після зрізу',
    category: 'Аналітика',
    icon: '',
    question: 'Зріз збережено. Відкрити аналіз?',
    enabled: true,
    options: [
      {
        id: 'opt_1',
        text: 'Аналіз',
        action: 'analysis',
        analyzerReply: 'Відкриваю аналіз...'
      },
      {
        id: 'opt_2',
        text: 'Закрити',
        action: 'close_quiet',
        analyzerReply: 'Збережено.'
      }
    ]
  },
  hydration: {
    id: 'hydration',
    name: 'Гідратація',
    category: 'Тіло',
    icon: '',
    question: 'Помітив, що твій рівень гідратації 0/3500. Не бажаєш чашки або склянки води?',
    enabled: true,
    intervalMinutes: -1,
    options: [
      {
        id: 'opt_hyd_cup',
        text: 'Випʼю чашку',
        action: 'hydration',
        actionParam: 200,
        visualReaction: 'joy',
        analyzerReply: 'Ловлю на слові.'
      },
      {
        id: 'opt_hyd_glass',
        text: 'Випʼю склянку',
        action: 'hydration',
        actionParam: 250,
        visualReaction: 'joy',
        analyzerReply: 'Ловлю на слові.'
      },
      {
        id: 'opt_hyd_later',
        text: 'Пізніше',
        action: 'close_quiet',
        visualReaction: 'calm',
        analyzerReply: 'Гаразд!'
      }
    ]
  }
};

export const PHRASES_STORAGE_KEY = 'quit-smoking:analyzer-dialogue-phrases';
export const SETTINGS_STORAGE_KEY = 'quit-smoking:analyzer-dialogue-settings';

export const loadAnalyzerDialogueSettings = (): AnalyzerDialogueSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_DIALOGUE_SETTINGS,
        ...parsed
      };
    }
  } catch {}
  return DEFAULT_DIALOGUE_SETTINGS;
};

export const saveAnalyzerDialogueSettings = (settings: AnalyzerDialogueSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('analyzer-dialogue-settings-changed', { detail: settings }));
    window.dispatchEvent(new Event('storage'));
  } catch {}
};

export const loadDialoguePhrases = (): DialoguePhrasesMap => {
  const merged: DialoguePhrasesMap = { ...DEFAULT_DIALOGUE_PHRASES };
  try {
    const raw = localStorage.getItem(PHRASES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const allKeys = Array.from(new Set([...Object.keys(DEFAULT_DIALOGUE_PHRASES), ...Object.keys(parsed)]));

      allKeys.forEach((k) => {
        const defItem = DEFAULT_DIALOGUE_PHRASES[k];
        const item = parsed[k];

        if (defItem) {
          // Built-in phrase: prioritize updated default question/options, keep user's schedule/enabled settings
          merged[k] = {
            ...defItem,
            ...(item ? {
              enabled: item.enabled !== undefined ? item.enabled : defItem.enabled,
              intervalMinutes: item.intervalMinutes !== undefined ? item.intervalMinutes : defItem.intervalMinutes,
              scheduleType: item.scheduleType || defItem.scheduleType,
              scheduledHour: item.scheduledHour !== undefined ? item.scheduledHour : defItem.scheduledHour
            } : {})
          };
        } else if (item) {
          // Custom user phrase
          let options: DialogueOptionConfig[] = Array.isArray(item.options) && item.options.length > 0
            ? item.options
            : [];

          const cleanedOptions = options.map((opt) => ({
            ...opt,
            text: stripEmoji(opt.text),
            analyzerReply: opt.analyzerReply ? stripEmoji(opt.analyzerReply) : undefined,
            nextReplicaText: opt.nextReplicaText ? stripEmoji(opt.nextReplicaText) : undefined,
            visualReaction: opt.visualReaction || 'active'
          }));

          merged[k] = {
            ...item,
            id: k,
            name: stripEmoji(item.name || 'Діалог'),
            category: stripEmoji(item.category || 'Користувацькі'),
            icon: '',
            question: stripEmoji(item.question || 'Запитання Аналізатора'),
            analyzerFollowUp: item.analyzerFollowUp ? stripEmoji(item.analyzerFollowUp) : undefined,
            options: cleanedOptions,
            enabled: item.enabled !== undefined ? item.enabled : true,
            intervalMinutes: item.intervalMinutes !== undefined ? item.intervalMinutes : 60,
            scheduleType: item.scheduleType || 'interval',
            scheduledHour: item.scheduledHour || 14,
            createdAt: item.createdAt || Date.now(),
          };
        }
      });
      return merged;
    }
  } catch {}
  return DEFAULT_DIALOGUE_PHRASES;
};

export const createNewDialoguePhrase = (
  name: string,
  category: string = 'Власний блок',
  icon: string = '',
  question: string = 'Чим я можу допомогти прямо зараз?',
  intervalMinutes: number = 60
): DialoguePhraseItem => {
  const now = Date.now();
  const id = `custom_${now}`;
  return {
    id,
    name: stripEmoji(name),
    category: stripEmoji(category),
    icon: '',
    question: stripEmoji(question),
    analyzerFollowUp: 'Ви можете налаштувати будь-які дії та репліки для цього діалогу',
    isCustom: true,
    createdAt: now,
    enabled: true,
    intervalMinutes,
    scheduleType: 'interval',
    options: [
      {
        id: `opt_${now}_1`,
        text: 'Пройти Зріз',
        action: 'slice',
        visualReaction: 'active',
        analyzerReply: 'Відкриваю повний зріз 8 показників...'
      },
      {
        id: `opt_${now}_2`,
        text: 'Ні дякую (Нагадати)',
        action: 'remind_timer',
        actionParam: 30,
        visualReaction: 'calm',
        analyzerReply: 'Зрозумів, нагадаю за таймером.'
      },
      {
        id: `opt_${now}_3`,
        text: 'Все спокійно',
        action: 'close_quiet',
        visualReaction: 'joy',
        analyzerReply: 'Гарного та спокійного дня!'
      }
    ],
    option1: 'Пройти Зріз',
    option2: 'Ні дякую (Нагадати)'
  };
};

export const saveDialoguePhrases = (phrases: DialoguePhrasesMap): void => {
  try {
    const copy: DialoguePhrasesMap = {};
    Object.keys(phrases).forEach((k) => {
      const p = phrases[k];
      const cleanedOpts = (p.options || []).map((o) => ({
        ...o,
        text: stripEmoji(o.text),
        analyzerReply: o.analyzerReply ? stripEmoji(o.analyzerReply) : undefined,
        nextReplicaText: o.nextReplicaText ? stripEmoji(o.nextReplicaText) : undefined,
        visualReaction: o.visualReaction || 'active'
      }));

      copy[k] = {
        ...p,
        name: stripEmoji(p.name),
        question: stripEmoji(p.question),
        category: p.category ? stripEmoji(p.category) : undefined,
        analyzerFollowUp: p.analyzerFollowUp ? stripEmoji(p.analyzerFollowUp) : undefined,
        icon: '',
        options: cleanedOpts,
        option1: cleanedOpts[0]?.text || '',
        option2: cleanedOpts[1]?.text || ''
      };
    });

    localStorage.setItem(PHRASES_STORAGE_KEY, JSON.stringify(copy));
    window.dispatchEvent(new CustomEvent('analyzer-dialogue-phrases-changed', { detail: copy }));
    window.dispatchEvent(new Event('storage'));
  } catch {}
};
