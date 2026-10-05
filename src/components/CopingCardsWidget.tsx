import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Bookmark,
  BookOpen,
  Brain,
  Layers,
  HeartPulse,
  Compass,
  List,
  SlidersHorizontal,
  Shuffle,
  ShieldCheck,
  Activity,
  Flame,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export type CopingCategory = 'all' | 'neuro' | 'cbt' | 'somatic' | 'behavior' | 'saved';

export interface CopingCardItem {
  id: number;
  category: 'neuro' | 'cbt' | 'somatic' | 'behavior';
  categoryLabel: string;
  tag: string;
  title: string;
  keyThought: string;
  description: string;
  actionableStep: string;
  scienceFact: string;
}

export const COPING_CARDS_DATA: CopingCardItem[] = [
  {
    id: 1,
    category: 'neuro',
    categoryLabel: 'Нейробіологія',
    tag: 'Хвиля 180 секунд',
    title: 'Пік тяги триває лише 3 хвилини',
    keyThought: 'Потяг не наростає безкінечно. Це короткий хімічний сплеск.',
    description: 'Гостре бажання закурити підкоряється закону нормального розподілу (гаусова крива). Викид норадреналіну та позив досягають піку за 90-180 секунд і неминуче згасають самі по собі, якщо не підживлювати їх панічними думками.',
    actionableStep: 'Засічіть рівно 3 хвилини на таймері та просто спостерігайте за фізичним відчуттям у тілі, не роблячи жодних різких рухів.',
    scienceFact: 'Локальний нейромедіаторний імпульс збудження в лімбічній системі виснажується за 180 секунд за відсутності підкріплення.'
  },
  {
    id: 2,
    category: 'cbt',
    categoryLabel: 'КПТ і мислення',
    tag: 'Ілюзія зняття стресу',
    title: 'Сигарета лікує лише той стрес, який сама створила',
    keyThought: 'Куріння не заспокоює нерви — воно лише знімає нікотинову ломку.',
    description: 'Нікотин не володіє седативною дією. Навпаки, він звужує судини, підвищує пульс і збільшує рівень кортизолу. Відчуття розслаблення під час затяжки — це лише тимчасове купірування мікро-абстиненції від попередньої сигарети.',
    actionableStep: 'Коли відчуваєте тривогу, нагадайте собі: "Сигарета збільшить навантаження на моє серце, а не вирішить проблему".',
    scienceFact: 'У курців базовий рівень кортизолу та тривожності між перекурами значно вищий, ніж у людей, які не вживають нікотин.'
  },
  {
    id: 3,
    category: 'cbt',
    categoryLabel: 'КПТ і мислення',
    tag: 'Пастка однієї затяжки',
    title: 'Міф про "лише одну сигарету"',
    keyThought: 'Одна затяжка не принесе полегшення, але реактивує всі рецептори.',
    description: 'Думка "я зроблю лише одну затяжку для заспокоєння" — це класична когнітивна раціоналізація залежного мозку. Одна затяжка не задовольнить бажання, а лише запустить новий повний цикл абстинентного дискомфорту на наступні 72 години.',
    actionableStep: 'Переформулюйте вибір: "Я обираю або бути повністю вільним, або повернутися до щоденного рабства по 20 сигарет на день".',
    scienceFact: 'Одна доза нікотину зв\'язує до 50% ацетилхолінових рецепторів VTA-зони мозку, відновлюючи стійку толерантність.'
  },
  {
    id: 4,
    category: 'neuro',
    categoryLabel: 'Нейробіологія',
    tag: 'Дофаміновий баланс',
    title: 'Порожнеча — це процес відновлення чутливості',
    keyThought: 'Тимчасова нудьга означає, що ваші рецептори дофаміну загоюються.',
    description: 'Нікотин штучно бомбардував систему винагороди наддозами дофаміну. Зараз мозок знижує поріг чутливості, щоб ви знову могли відчувати яскраву радість від простих речей: смачної їжі, музики, спілкування та сонця.',
    actionableStep: 'Сприймайте внутрішню порожнечу не як брак чогось, а як простір, де прямо зараз будуються нові здорові рецептори.',
    scienceFact: 'Щільність дофамінових D2-рецепторів смугастого тіла повертається до норми здорової людини за 21–30 днів чистоти.'
  },
  {
    id: 5,
    category: 'cbt',
    categoryLabel: 'КПТ і мислення',
    tag: 'Когнітивне роз\'єднання',
    title: 'Метод "Я помічаю, що з\'явилася думка"',
    keyThought: 'Ви — це не ваші думки. Ви — простір, у якому ці думки виникають.',
    description: 'Замість фрази "Я нестерпно хочу курити", скажіть собі: "Я помічаю, що мій мозок зараз генерує автоматичну думку про куріння". Цей прийом з терапії прийняття та відповідальності (ACT) створює дистанцію між імпульсом і вашою дією.',
    actionableStep: 'Промовте вголос або подумки: "Я свідок цього імпульсу. Я можу відчувати цей позив і водночас нічого з ним не робити".',
    scienceFact: 'Метакогнітивне роз\'єднання знижує активність острівцевої кори мозку, яка відповідає за імпульсивну поведінку.'
  },
  {
    id: 6,
    category: 'behavior',
    categoryLabel: 'Поведінка',
    tag: 'Правило 10 хвилин',
    title: 'Відтермінування замість жорсткої заборони',
    keyThought: 'Не кажіть собі "ніколи". Скажіть собі: "Я повернуся до цього через 10 хвилин".',
    description: 'Пряма жорстка заборона викликає психологічний опір і посилює фіксацію на об\'єкті (ефект білої мавпи). Відтермінування знімає панічний стрес, а за 10 хвилин інтенсивність бажання знижується в рази.',
    actionableStep: 'Поставте таймер на 10 хвилин і займіться будь-якою простою справою (склянка води, прогулянка, вмивання). Коли продзвенить таймер — тяги вже не буде.',
    scienceFact: 'Відкладене задоволення активує дорсолатеральну префронтальну кору, яка пригнічує автоматичні підкіркові імпульси.'
  },
  {
    id: 7,
    category: 'somatic',
    categoryLabel: 'Соматика і тіло',
    tag: 'Фізіологія затяжки',
    title: 'Мозок шукає глибокого вдиху, а не диму',
    keyThought: 'Справжній заспокійливий ефект перекуру крився у глибокому видиху.',
    description: 'Коли ви курили, ви робили глибокий вдих і тривалий видих через стиснуті губи. Це рефлекторно стимулює парасимпатичну нервову систему. Сигаретний дим був лише токсичним додатком до правильної техніки релаксаційного дихання.',
    actionableStep: 'Зробіть подвійний вдих носом і один довгий плавний видих ротом (фізіологічне зітхання). Повторіть 3 рази.',
    scienceFact: 'Подовжений видих змушує діафрагмальний нерв активувати гальмівні сигнали до синусового вузла серця.'
  },
  {
    id: 8,
    category: 'behavior',
    categoryLabel: 'Поведінка',
    tag: 'Зміна контексту',
    title: 'Переривання ланцюжка тригерів',
    keyThought: 'Змініть кімнату, положення тіла або дію на 120 секунд.',
    description: 'Звичка куріння закодована в базальних гангліях як моторний ланцюжок: "тригер -> місце -> рух -> затяжка". Якщо ви залишаєтеся на тому ж місці в тій самій позі, мозок продовжує очікувати ритуал.',
    actionableStep: 'Встаньте, вийдіть в інше приміщення, змініть освітлення, розімніть плечі або торкніться прохолодного предмета.',
    scienceFact: 'Зміна сенсорного середовища перериває автоматичні патерни в смугастому тілі та перемикає увагу на нові подразники.'
  },
  {
    id: 9,
    category: 'neuro',
    categoryLabel: 'Нейробіологія',
    tag: 'Регенерація легенів',
    title: 'Війковий епітелій очищує ваші дихальні шляхи прямо зараз',
    keyThought: 'Кожна година без диму дозволяє мільйонам мікроскопічних вій вимітати смоли.',
    description: 'Гарячий дим паралізував війчастий епітелій бронхів. Вже через 48-72 години після відмови від куріння війки відновлюють свою рухливість, проводячи генеральне прибирання дихальної системи.',
    actionableStep: 'Зробіть глибокий повільний вдих чистим повітрям і відчуйте, як легені безперешкодно розширюються.',
    scienceFact: 'Повне очищення бронхіального дерева від накопичених часток смол завершується протягом перших 1-9 місяців.'
  },
  {
    id: 10,
    category: 'somatic',
    categoryLabel: 'Соматика і тіло',
    tag: 'Переоцінка тривоги',
    title: 'Симптоми відміни — це ознаки одужання',
    keyThought: 'Дискомфорт — це не загроза, це фізичний процес загоєння тіла.',
    description: 'Прискорене серцебиття, пітливість або напруга в м\'язах часто лякають. Але це не ознака хвороби, це тіло звільняється від токсинів і перебудовує обмін речовин на здоровий лад.',
    actionableStep: 'Коли відчуваєте дискомфорт у грудях чи м\'язах, подумки промовте: "Це не біль, це моє тіло скидає залишки отрути".',
    scienceFact: 'Когнітивна переоцінка фізіологічних симптомів (reappraisal) знижує реактивність мигдалеподібного тіла на 40%.'
  },
  {
    id: 11,
    category: 'cbt',
    categoryLabel: 'КПТ і мислення',
    tag: 'Перспектива майбутнього',
    title: 'Погляд на себе через 1 рік',
    keyThought: 'Ваше майбутнє "Я" буде безмежно вдячне вам за цей конкретний вибір.',
    description: 'У момент спокуси ми схильні до гіперболічного дисконтування — переоцінки миттєвого задоволення порівняно з довгостроковою цінністю. Уявіть себе через 12 місяців: вільним, спокійним, із чистим диханням і високою самоповагою.',
    actionableStep: 'Запитайте себе: "Чи варта 3-хвилинна слабкість того, щоб віддати здоров\'я і свободу всього мого майбутнього життя?".',
    scienceFact: 'Уявлення власного майбутнього образу активує медіальну префронтальну кору, посилюючи силу волі.'
  },
  {
    id: 12,
    category: 'somatic',
    categoryLabel: 'Соматика і тіло',
    tag: 'Соматичне заземлення',
    title: 'Повернення у фізичну реальність через стопи',
    keyThought: 'Тяга живе в уяві. Реальне тіло в цей момент знаходиться в повній безпеці.',
    description: 'Коли розум захоплюють нав\'язливі думки про куріння, найшвидший спосіб вийти з ментальної пастки — перенести 100% уваги на тактильні відчуття в нижній частині тіла.',
    actionableStep: 'Відчуйте вагу всього тіла через підошви стоп. Втисніть пальці ніг у підлогу, відчуйте тверду опору під собою.',
    scienceFact: 'Фокусування на пропріоцептивних сигналах стоп блокує роботу мережі пасивного режиму мозку (DMN), що генерує тривожні думки.'
  }
];

export const CopingCardsWidget: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CopingCategory>('all');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [cardIndex, setCardIndex] = useState(0);
  const [showScienceFact, setShowScienceFact] = useState(false);

  const [savedCardIds, setSavedCardIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:saved-coping-cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const filteredCards = useMemo(() => {
    if (selectedCategory === 'all') return COPING_CARDS_DATA;
    if (selectedCategory === 'saved') {
      return COPING_CARDS_DATA.filter((c) => savedCardIds.includes(c.id));
    }
    return COPING_CARDS_DATA.filter((c) => c.category === selectedCategory);
  }, [selectedCategory, savedCardIds]);

  const activeCard = filteredCards[cardIndex] || filteredCards[0] || COPING_CARDS_DATA[0];

  const handleNext = () => {
    setShowScienceFact(false);
    if (filteredCards.length > 0) {
      setCardIndex((prev) => (prev + 1) % filteredCards.length);
    }
  };

  const handlePrev = () => {
    setShowScienceFact(false);
    if (filteredCards.length > 0) {
      setCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }
  };

  const handleRandom = () => {
    setShowScienceFact(false);
    if (filteredCards.length <= 1) return;
    let nextIdx = Math.floor(Math.random() * filteredCards.length);
    if (nextIdx === cardIndex) {
      nextIdx = (nextIdx + 1) % filteredCards.length;
    }
    setCardIndex(nextIdx);
  };

  const toggleSaveCard = (id: number) => {
    const updated = savedCardIds.includes(id)
      ? savedCardIds.filter((cardId) => cardId !== id)
      : [...savedCardIds, id];
    setSavedCardIds(updated);
    try {
      localStorage.setItem('quit-smoking:saved-coping-cards', JSON.stringify(updated));
    } catch {}
  };

  const handleSelectCategory = (cat: CopingCategory) => {
    setSelectedCategory(cat);
    setCardIndex(0);
    setShowScienceFact(false);
  };

  const isCurrentSaved = activeCard && savedCardIds.includes(activeCard.id);

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-[#18181c]/95 border border-slate-200/90 dark:border-zinc-800/90 shadow-xs space-y-4 select-none backdrop-blur-xl text-left transition-all">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-200 flex items-center justify-center shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-100 tracking-wide uppercase">
              Когнітивні картки стійкості
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
              Науково обґрунтовані установки проти гострої тяги
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Random */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleRandom}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-700/60 transition-colors cursor-pointer"
            title="Випадкова порада"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode((m) => (m === 'card' ? 'list' : 'card'))}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-700/60'
            }`}
            title={viewMode === 'list' ? 'Режим карток' : 'Режим списку'}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Category Filters Pills (Zero-pill aesthetic: clean segmented look) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-medium">
        <button
          type="button"
          onClick={() => handleSelectCategory('all')}
          className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent font-bold'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800 border-slate-200/60 dark:border-zinc-750'
          }`}
        >
          Всі ({COPING_CARDS_DATA.length})
        </button>

        <button
          type="button"
          onClick={() => handleSelectCategory('neuro')}
          className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'neuro'
              ? 'bg-indigo-600 text-white dark:bg-indigo-500 border-transparent font-bold'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800 border-slate-200/60 dark:border-zinc-750'
          }`}
        >
          <Brain className="w-3 h-3" />
          <span>Нейробіологія</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectCategory('cbt')}
          className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'cbt'
              ? 'bg-sky-600 text-white dark:bg-sky-500 border-transparent font-bold'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800 border-slate-200/60 dark:border-zinc-750'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>КПТ і мислення</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectCategory('somatic')}
          className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'somatic'
              ? 'bg-emerald-600 text-white dark:bg-emerald-500 border-transparent font-bold'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800 border-slate-200/60 dark:border-zinc-750'
          }`}
        >
          <HeartPulse className="w-3 h-3" />
          <span>Соматика</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectCategory('behavior')}
          className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'behavior'
              ? 'bg-amber-600 text-white dark:bg-amber-500 border-transparent font-bold'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800 border-slate-200/60 dark:border-zinc-750'
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>Поведінка</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectCategory('saved')}
          className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'saved'
              ? 'bg-rose-600 text-white dark:bg-rose-500 border-transparent font-bold'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800 border-slate-200/60 dark:border-zinc-750'
          }`}
        >
          <Bookmark className="w-3 h-3" />
          <span>Обрані ({savedCardIds.length})</span>
        </button>
      </div>

      {/* 3. Empty State for Filter */}
      {filteredCards.length === 0 && (
        <div className="py-8 text-center text-slate-400 dark:text-zinc-500 text-xs space-y-2">
          <p className="font-bold text-slate-700 dark:text-zinc-300">
            {selectedCategory === 'saved'
              ? 'Немає збережених карток'
              : 'У цій категорії поки немає записів'}
          </p>
          <p className="text-[11px] opacity-80 max-w-[240px] mx-auto">
            {selectedCategory === 'saved'
              ? 'Натисніть значок закладки на будь-якій картці, щоб зберегти її сюди для швидкого доступу під час кризи.'
              : 'Оберіть іншу категорію або перегляньте всі картки.'}
          </p>
          {selectedCategory === 'saved' && (
            <button
              type="button"
              onClick={() => handleSelectCategory('all')}
              className="mt-2 px-3 py-1.5 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold text-[11px] cursor-pointer"
            >
              Переглянути всі картки
            </button>
          )}
        </div>
      )}

      {/* 4. Single Card View */}
      {viewMode === 'card' && filteredCards.length > 0 && activeCard && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/90 border border-slate-200/70 dark:border-zinc-800/80 space-y-3.5 relative overflow-hidden">
            {/* Top Card Meta */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase bg-slate-200/80 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-300/60 dark:border-zinc-700/60">
                  {activeCard.categoryLabel}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
                  {activeCard.tag}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                  {cardIndex + 1} / {filteredCards.length}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSaveCard(activeCard.id)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isCurrentSaved
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-500 dark:text-rose-400'
                      : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-400 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
                  }`}
                  title={isCurrentSaved ? 'Видалити з обраного' : 'Зберегти в обране'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isCurrentSaved ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Title & Key Thought */}
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-zinc-100 leading-snug">
                {activeCard.title}
              </h4>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 leading-relaxed">
                {activeCard.keyThought}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
              {activeCard.description}
            </p>

            {/* Actionable Step Box */}
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-zinc-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-none" />
                <span>Що зробити прямо зараз:</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed pl-5">
                {activeCard.actionableStep}
              </p>
            </div>

            {/* Science Fact Accordion */}
            {showScienceFact ? (
              <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-900/40 text-[11px] text-slate-700 dark:text-zinc-300 leading-relaxed space-y-1 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Нейробіологічний механізм:</span>
                </div>
                <p className="pl-5 text-slate-600 dark:text-zinc-300">
                  {activeCard.scienceFact}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowScienceFact(true)}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold cursor-pointer inline-flex items-center gap-1.5 pt-0.5"
              >
                <span>Чому це працює біологічно?</span>
                <Sparkles className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={handlePrev}
              className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-300 rounded-2xl text-xs font-bold border border-slate-200/80 dark:border-zinc-700/70 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Попередня</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-2xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Наступна порада</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 5. List Catalog View */}
      {viewMode === 'list' && filteredCards.length > 0 && (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {filteredCards.map((card, idx) => {
            const isSaved = savedCardIds.includes(card.id);
            return (
              <div
                key={card.id}
                onClick={() => {
                  setCardIndex(idx);
                  setViewMode('card');
                  setShowScienceFact(false);
                }}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900/90 dark:hover:bg-zinc-850 border border-slate-200/70 dark:border-zinc-800/80 transition-all cursor-pointer space-y-2 group text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                      {card.categoryLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                      {card.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveCard(card.id);
                      }}
                      className={`p-1 rounded-md transition-colors ${
                        isSaved ? 'text-rose-500' : 'text-slate-300 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-zinc-300'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
