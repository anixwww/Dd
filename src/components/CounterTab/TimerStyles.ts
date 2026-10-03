export type TimerStyleType = 
  | 'classic'
  | 'prism-shell'
  // 20 First-Class Themed Styles
  | 'pixel-art'
  | 'cyberpunk'
  | 'gothic'
  | 'watercolor'
  | 'minimalist'
  | 'zen-breathe'
  | 'aurora'
  | 'nixie'
  | 'matrix'
  | 'synthwave'
  | 'parchment'
  | 'nordic-frost'
  | 'leather-gold'
  | 'obsidian-glow'
  | 'emerald-gold'
  | 'moonlight'
  | 'kyoto'
  | 'sandglass'
  | 'cosmic-void'
  | 'neon-pulse'
  | 'mystic-fog'
  | 'golden-shimmer'
  | 'electric-storm'
  | 'lava-lamp'
  | 'hologram-glitch'
  | 'quantum-portal'
  | 'cherry-blossom'
  | 'solaris-flare'
  | 'abyssal-pearl'
  | 'phoenix-fire'
  | 'neon-cybergrid'
  | 'neon-matrix-pulse'
  | 'holographic-aurora'
  | 'cyber-pulse-amber'
  | 'crystal-frost'
  | 'nebula-storm'
  | 'velvet-gold'
  | 'sunset-horizon'
  | 'electric-violet'
  | 'emerald-matrix'
  | 'solar-flare-gold'
  | 'ocean-depth'
  // 5 New Autumn Styles
  | 'autumn-words'
  | 'autumn-digital'
  | 'autumn-day-milestone'
  | 'autumn-leaf-texture'
  | 'autumn-golden-fall'
  // Legacy / Aliased styles for backward compatibility
  | 'harmonic'
  | 'handwritten'
  | 'digital'
  | 'minimal'
  | 'threed'
  | 'neon';

export interface TimerStyleDefinition {
  id: TimerStyleType;
  cssClass: string;
  name: string;
  tag: string;
  icon: string;
  category: 'autumn' | 'artistic' | 'meditative' | 'classic' | 'cyber';
  desc: string;
  preview: string;
}

export const TIMER_STYLES: TimerStyleDefinition[] = [
  {
    id: 'classic',
    cssClass: 'timer-classic',
    name: 'Класична',
    tag: 'За замовчуванням',
    icon: '⏱️',
    category: 'classic',
    desc: 'Класичний лаконічний таймер з чистими цифрами та ефектом зникання літер і цифр при проходженні рукава Кільця',
    preview: '1д 04г 18хв'
  },
  {
    id: 'prism-shell',
    cssClass: 'timer-prism-shell',
    name: 'Призматична оболонка',
    tag: 'Кристалічна рамка',
    icon: '💎',
    category: 'classic',
    desc: 'Призматичний таймер у кристалічній спектральній капсулі з кутовими діамантовими спалахами та аурою',
    preview: '1д 04г 18хв'
  },
  {
    id: 'pixel-art',
    cssClass: 'timer-pixel-art',
    name: 'Pixel Art 8-Bit',
    tag: 'Ретро-аркада',
    icon: '👾',
    category: 'artistic',
    desc: 'Ностальгічна 8-бітна піксельна естетика ігрових автоматів з неоновим люмінесцентним світінням та чіткими кутами',
    preview: '1:24:60:35'
  },
  {
    id: 'cyberpunk',
    cssClass: 'timer-cyberpunk',
    name: 'Cyberpunk 2077',
    tag: 'Неон & Глітч',
    icon: '⚡',
    category: 'cyber',
    desc: 'Хроматична аберація, голографічний неоновий ціан з футуристичним HUD-обрамленням та мікро-імпульсами',
    preview: '1:24:60:35'
  },
  {
    id: 'gothic',
    cssClass: 'timer-gothic',
    name: 'Gothic Romance',
    tag: 'Готичне письмо',
    icon: '🏰',
    category: 'artistic',
    desc: 'Середньовічна темна романтика, шляхетна готична фрактура з рубіново-срібним місячним ореолом',
    preview: '1:24:60:35'
  },
  {
    id: 'watercolor',
    cssClass: 'timer-watercolor',
    name: 'Watercolor Wash',
    tag: 'Акварельний живопис',
    icon: '🎨',
    category: 'artistic',
    desc: 'М\'які пастельні переливи акварелі, ніжні художні мазки та заспокійливий градієнтний розмив фарби',
    preview: '1:24:60:35'
  },
  {
    id: 'minimalist',
    cssClass: 'timer-minimalist',
    name: 'Swiss Minimalist',
    tag: 'Швейцарський мінімал',
    icon: '⚪',
    category: 'classic',
    desc: 'Абсолютна чистота форми, бездоганна монохромна типографіка та кришталева ясність думки',
    preview: '1:24:60:35'
  },
  {
    id: 'zen-breathe',
    cssClass: 'timer-zen-breathe',
    name: 'Дихання дзен',
    tag: '5.5с когерентність',
    icon: '🧘‍♂️',
    category: 'meditative',
    desc: 'М\'який ритм 5.5с (когерентне дихання) — синхронізує серцевий пульс, заспокоює нервову систему та тамує тягу',
    preview: '1:24:60:35'
  },
  {
    id: 'aurora',
    cssClass: 'timer-aurora',
    name: 'Північне сяйво',
    tag: 'Шовковий спектр',
    icon: '🌌',
    category: 'meditative',
    desc: 'Плавні шовкові переливи смарагдового, бірюзового та фіалкового світла, що заспокоюють думки',
    preview: '1:24:60:35'
  },
  {
    id: 'nixie',
    cssClass: 'timer-nixie',
    name: 'Лампи Nixie ІН-14',
    tag: 'Газорозрядні лампи',
    icon: '🔥',
    category: 'classic',
    desc: 'Теплий ламповий вогонь неонових катодних трубок, душевний затишок та символ незламної внутрішньої сили',
    preview: '1:24:60:35'
  },
  {
    id: 'matrix',
    cssClass: 'timer-matrix',
    name: 'Matrix Code',
    tag: 'CRT Термінал',
    icon: '📟',
    category: 'cyber',
    desc: 'Смарагдовий люмінофорний термінал комп\'ютерної ретро-естетики вільного цифрового розуму',
    preview: '1:24:60:35'
  },
  {
    id: 'synthwave',
    cssClass: 'timer-synthwave',
    name: 'Synthwave 80s',
    tag: 'Outrun Захід Сонця',
    icon: '🌆',
    category: 'cyber',
    desc: 'Ретровейв естетика неонового заходу сонця у Маямі: гарячий рожевий, ультрафіолет та хромовий блиск',
    preview: '1:24:60:35'
  },
  {
    id: 'parchment',
    cssClass: 'timer-parchment',
    name: 'Древній пергамент',
    tag: 'Каліграфічне перо',
    icon: '📜',
    category: 'artistic',
    desc: 'Затишна текстура старовинного пергаменту зі шляхетним рукописним чорнилом горіхового відтінку',
    preview: '1:24:60:35'
  },
  {
    id: 'nordic-frost',
    cssClass: 'timer-nordic-frost',
    name: 'Північний лід',
    tag: 'Морозна свіжість',
    icon: '❄️',
    category: 'meditative',
    desc: 'Напівпрозоре матове скло льодовика, вкрите морозними візерунками та крижаними іскрами чистого повітря',
    preview: '1:24:60:35'
  },
  {
    id: 'leather-gold',
    cssClass: 'timer-leather-gold',
    name: 'Шкіра та золото',
    tag: 'Люкс текстура',
    icon: '💼',
    category: 'classic',
    desc: 'Преміальна фактура темної шкіри з тисненням 24-каратним золотом та благородними золотими засічками',
    preview: '1:24:60:35'
  },
  {
    id: 'obsidian-glow',
    cssClass: 'timer-obsidian-glow',
    name: 'Чорний обсидіан',
    tag: 'Кристалічний вогонь',
    icon: '🌋',
    category: 'meditative',
    desc: 'Матовий темний обсидіан з пульсуючим неоново-фіолетовим кристалічним світлом у глибині розлому',
    preview: '1:24:60:35'
  },
  {
    id: 'emerald-gold',
    cssClass: 'timer-emerald-gold',
    name: 'Смарагд та золото',
    tag: 'Імператорський стиль',
    icon: '👑',
    category: 'artistic',
    desc: 'Глибокий королівський смарагдовий камінь із вишуканою золотою філігранню',
    preview: '1:24:60:35'
  },
  {
    id: 'moonlight',
    cssClass: 'timer-moonlight',
    name: 'Місячне сяйво',
    tag: 'Срібний ореол',
    icon: '🌙',
    category: 'meditative',
    desc: 'Перламутрове сріблясто-синє світло нічного спокою, захищеності та глибокого відновлення легень',
    preview: '1:24:60:35'
  },
  {
    id: 'kyoto',
    cssClass: 'timer-kyoto',
    name: 'Сад каменів Кіото',
    tag: 'Wabi-Sabi спокій',
    icon: '🎋',
    category: 'meditative',
    desc: 'Японська естетика внутрішньої тиші, фактура річкової гальки та благородна рівновага',
    preview: '1:24:60:35'
  },
  {
    id: 'sandglass',
    cssClass: 'timer-sandglass',
    name: 'Золотий пісок часу',
    tag: 'Ефірний час',
    icon: '⏳',
    category: 'meditative',
    desc: 'М\'яке сяйво бурштину та зоряні піщинки кожної секунди твого поверненого життя',
    preview: '1:24:60:35'
  },
  {
    id: 'cosmic-void',
    cssClass: 'timer-cosmic-void',
    name: 'Космічна туманність',
    tag: 'Зоряний пил',
    icon: '✨',
    category: 'cyber',
    desc: 'Глибокий безмежний космос, сяйво ультрафіолетових туманностей та мерехтіння далеких зірок',
    preview: '1:24:60:35'
  },
  {
    id: 'neon-pulse',
    cssClass: 'timer-neon-pulse',
    name: 'Неоновий імпульс',
    tag: 'Гіпер-сяйво',
    icon: '🔮',
    category: 'cyber',
    desc: 'Пульсуючий бірюзово-маджентовий неон з виразним диханням світлового поля',
    preview: '1:24:60:35'
  },
  {
    id: 'mystic-fog',
    cssClass: 'timer-mystic-fog',
    name: 'Містичний туман',
    tag: 'Серпанок та димка',
    icon: '🌫️',
    category: 'meditative',
    desc: 'Ефект проходження цифр крізь містичний серпанок та легкий туман за допомогою плавної анімації',
    preview: '1:24:60:35'
  },
  {
    id: 'golden-shimmer',
    cssClass: 'timer-golden-shimmer',
    name: 'Золотий блиск',
    tag: 'Люкс металик',
    icon: '🪙',
    category: 'artistic',
    desc: 'Розкішний перелив золота та м\'який металевий відблиск з об\'ємним сяйвом',
    preview: '1:24:60:35'
  },
  {
    id: 'electric-storm',
    cssClass: 'timer-electric-storm',
    name: 'Електричний шторм',
    tag: 'Блискавки та розряди',
    icon: '⚡',
    category: 'cyber',
    desc: 'Динамічний електричний імпульс високої напруги з мерехтливими синьо-білими розрядами',
    preview: '1:24:60:35'
  },
  {
    id: 'lava-lamp',
    cssClass: 'timer-lava-lamp',
    name: 'Лавова лампа',
    tag: 'Плинний органічний рух',
    icon: '🫧',
    category: 'artistic',
    desc: 'Плавні кольорові переливи та органічне пульсування в стилі заспокійливої лавової лампи',
    preview: '1:24:60:35'
  },
  {
    id: 'hologram-glitch',
    cssClass: 'timer-hologram-glitch',
    name: 'Голографічний сканер',
    tag: 'Футуристичний HUD',
    icon: '🛰️',
    category: 'cyber',
    desc: 'Скануючі горизонтальні лінії, глітч-ефекти та кібернетичне голографічне світіння',
    preview: '1:24:60:35'
  },
  {
    id: 'quantum-portal',
    cssClass: 'timer-quantum-portal',
    name: 'Квантовий портал',
    tag: 'Зоряний вир часу',
    icon: '🌀',
    category: 'cyber',
    desc: 'Глибокий фіолетово-блакитний вир простору-часу з розширюваними енергетичними кільцями',
    preview: '1:24:60:35'
  },
  {
    id: 'cherry-blossom',
    cssClass: 'timer-cherry-blossom',
    name: 'Палаюча сакура',
    tag: 'Весняний пелюстковий вальс',
    icon: '🌸',
    category: 'meditative',
    desc: 'Ніжний рожевий серпанок весняного цвіту сакури з повільним коливанням та теплим сяйвом',
    preview: '1:24:60:35'
  },
  {
    id: 'solaris-flare',
    cssClass: 'timer-solaris-flare',
    name: 'Сонячна корона',
    tag: 'Зоряний промінь',
    icon: '☀️',
    category: 'meditative',
    desc: 'Яскраве золотисто-янтарне пульсування сонячної корони з теплим енергетичним ореолом',
    preview: '1:24:60:35'
  },
  {
    id: 'abyssal-pearl',
    cssClass: 'timer-abyssal-pearl',
    name: 'Перлина безодні',
    tag: 'Океанічний перламутр',
    icon: '🐚',
    category: 'meditative',
    desc: 'Глибокий перламутровий перелив морської безодні з м\'яким переливом кольорів хвилі',
    preview: '1:24:60:35'
  },
  {
    id: 'phoenix-fire',
    cssClass: 'timer-phoenix-fire',
    name: 'Вогонь фенікса',
    tag: 'Полум\'я переродження',
    icon: '🔥',
    category: 'artistic',
    desc: 'Живі язики полум\'я та іскристі вуглинки з теплим оранжево-червоним мерехтінням',
    preview: '1:24:60:35'
  },
  {
    id: 'neon-cybergrid',
    cssClass: 'timer-neon-cybergrid',
    name: 'Кібернетична сітка',
    tag: 'Ретро-футуризм 80х',
    icon: '🌐',
    category: 'cyber',
    desc: 'Динамічна ретро-сітка кіберпростору з неоновим свіченням та кібернетичним ритмом',
    preview: '1:24:60:35'
  },
  {
    id: 'neon-matrix-pulse',
    cssClass: 'timer-neon-matrix-pulse',
    name: 'Неонова матриця',
    tag: 'Фосфорний код',
    icon: '🟢',
    category: 'cyber',
    desc: 'Пульсуючий зелений фосфорний код matrix з ретро-термінальним сяйвом',
    preview: '1:24:60:35'
  },
  {
    id: 'holographic-aurora',
    cssClass: 'timer-holographic-aurora',
    name: 'Голографічна аврора',
    tag: 'Переливчастий спектр',
    icon: '💎',
    category: 'meditative',
    desc: 'Змінний голографічний спектр світла з м\'яким переливом кольорів',
    preview: '1:24:60:35'
  },
  {
    id: 'cyber-pulse-amber',
    cssClass: 'timer-cyber-pulse-amber',
    name: 'Бурштиновий імпульс',
    tag: 'Ламповий теплий неон',
    icon: '🏮',
    category: 'classic',
    desc: 'Тепле бурштинове неонове пульсування у стилі ретро-ламп',
    preview: '1:24:60:35'
  },
  {
    id: 'crystal-frost',
    cssClass: 'timer-crystal-frost',
    name: 'Крижаний кристал',
    tag: 'Морозне скло',
    icon: '🧊',
    category: 'meditative',
    desc: 'Кришталево чисте замерзле скло з мерехтливими морозними іскрами',
    preview: '1:24:60:35'
  },
  {
    id: 'nebula-storm',
    cssClass: 'timer-nebula-storm',
    name: 'Зоряна буря',
    tag: 'Космічний пил',
    icon: '🌌',
    category: 'cyber',
    desc: 'Глибокий космічний вир з фіолетово-блакитними пиловими хмарами',
    preview: '1:24:60:35'
  },
  {
    id: 'velvet-gold',
    cssClass: 'timer-velvet-gold',
    name: 'Оксамит та золото',
    tag: 'Королівський люкс',
    icon: '👑',
    category: 'artistic',
    desc: 'Глибокий темний оксамит із золотим тисненням та шляхетним блиском',
    preview: '1:24:60:35'
  },
  {
    id: 'sunset-horizon',
    cssClass: 'timer-sunset-horizon',
    name: 'Західний горизонт',
    tag: 'Вечірнє небо',
    icon: '🌇',
    category: 'artistic',
    desc: 'Теплий градієнт вечірнього неба з помаранчево-рожевим сяйвом',
    preview: '1:24:60:35'
  },
  {
    id: 'electric-violet',
    cssClass: 'timer-electric-violet',
    name: 'Електричний фіолет',
    tag: 'Висока напруга',
    icon: '⚡',
    category: 'cyber',
    desc: 'Насичений фіолетовий розряд струму з високим контрастом та неоном',
    preview: '1:24:60:35'
  },
  {
    id: 'emerald-matrix',
    cssClass: 'timer-emerald-matrix',
    name: 'Смарагдовий матрикс',
    tag: 'Цифровий розум',
    icon: '🟩',
    category: 'cyber',
    desc: 'Глибокий смарагдовий код із заспокійливим фосфорним ритмом',
    preview: '1:24:60:35'
  },
  {
    id: 'solar-flare-gold',
    cssClass: 'timer-solar-flare-gold',
    name: 'Сонячний спалах',
    tag: 'Золота корона',
    icon: '✨',
    category: 'artistic',
    desc: 'Яскравий спалах золотистої енергії з випромінюванням тепла',
    preview: '1:24:60:35'
  },
  {
    id: 'ocean-depth',
    cssClass: 'timer-ocean-depth',
    name: 'Глибина океану',
    tag: 'Аквамариновий спокій',
    icon: '🌊',
    category: 'meditative',
    desc: 'Заспокійливі глибокі відтінки синього з м\'яким аквамариновим сяйвом',
    preview: '1:24:60:35'
  },
  {
    id: 'autumn-words',
    cssClass: 'timer-autumn-words',
    name: 'Осінь: Цифри й текст',
    tag: 'Осінні підписи',
    icon: '🍂',
    category: 'autumn',
    desc: 'Теплі теракотові та медові цифри з чіткими текстовими назвами одиниць часу (дн, год, хв, с)',
    preview: '1 дн 24 год 60 хв 35 с'
  },
  {
    id: 'autumn-digital',
    cssClass: 'timer-autumn-digital',
    name: 'Осінь: Бурштиновий Digital',
    tag: 'Цифровий годинник',
    icon: '📟',
    category: 'autumn',
    desc: 'Ретро-електронний 7-сегментний LED-дисплей у глибокому бурштиновому кольорі бабиного літа',
    preview: '01:24:60:35'
  },
  {
    id: 'autumn-day-milestone',
    cssClass: 'timer-autumn-day-milestone',
    name: 'Осінь: Day 1 (Рубіж)',
    tag: 'Етап & Календар',
    icon: '🍁',
    category: 'autumn',
    desc: 'Акцентний значок поточного дня «DAY 1» із золотим кленовим листком та ходом годин і хвилин',
    preview: 'DAY 1 • 24:60:35'
  },
  {
    id: 'autumn-leaf-texture',
    cssClass: 'timer-autumn-leaf-texture',
    name: 'Осінь: Дерево й листя',
    tag: 'Осіння текстура',
    icon: '🪵',
    category: 'autumn',
    desc: 'Осіння текстура витриманого дуба з прожилками кленового листя, золотими бліками та тисненими цифрами',
    preview: '1:24:60:35'
  },
  {
    id: 'autumn-golden-fall',
    cssClass: 'timer-autumn-golden-fall',
    name: 'Осінь: Золотий листопад',
    tag: 'Золото жовтня',
    icon: '✨',
    category: 'autumn',
    desc: 'Мерехтливий градієнт рідкого золота та медового янтаря з теплим сонячним ореолом кленового гаю',
    preview: '1:24:60:35'
  }
];

export const VALID_TIMER_STYLE_IDS: TimerStyleType[] = [
  'classic',
  'prism-shell',
  'pixel-art',
  'cyberpunk',
  'gothic',
  'watercolor',
  'minimalist',
  'zen-breathe',
  'aurora',
  'nixie',
  'matrix',
  'synthwave',
  'parchment',
  'nordic-frost',
  'leather-gold',
  'obsidian-glow',
  'emerald-gold',
  'moonlight',
  'kyoto',
  'sandglass',
  'cosmic-void',
  'neon-pulse',
  'mystic-fog',
  'golden-shimmer',
  'electric-storm',
  'lava-lamp',
  'hologram-glitch',
  'quantum-portal',
  'cherry-blossom',
  'solaris-flare',
  'abyssal-pearl',
  'phoenix-fire',
  'neon-cybergrid',
  'neon-matrix-pulse',
  'holographic-aurora',
  'cyber-pulse-amber',
  'crystal-frost',
  'nebula-storm',
  'velvet-gold',
  'sunset-horizon',
  'electric-violet',
  'emerald-matrix',
  'solar-flare-gold',
  'ocean-depth',
  'autumn-words',
  'autumn-digital',
  'autumn-day-milestone',
  'autumn-leaf-texture',
  'autumn-golden-fall',
  'harmonic',
  'handwritten',
  'digital',
  'minimal',
  'threed',
  'neon'
];

// ==================== FONTS ====================

export type TimerFontType =
  | 'default'
  | 'mono'
  | 'serif'
  | 'sans-heavy'
  | 'handwritten'
  | 'pixel'
  | 'cyber'
  | 'rounded'
  | 'condensed';

export interface TimerFontDefinition {
  id: TimerFontType;
  cssClass: string;
  fontFamily: string;
}

export const TIMER_FONTS: TimerFontDefinition[] = [
  { id: 'default', cssClass: 'font-sans font-extrabold', fontFamily: 'inherit' },
  { id: 'mono', cssClass: 'font-mono font-bold tracking-tight', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
  { id: 'serif', cssClass: 'font-serif font-bold tracking-wide italic', fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif' },
  { id: 'sans-heavy', cssClass: 'font-black uppercase tracking-tight', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { id: 'handwritten', cssClass: 'font-cursive italic tracking-wide', fontFamily: '"Caveat", "Dancing Script", "Comic Sans MS", cursive' },
  { id: 'pixel', cssClass: 'font-mono uppercase tracking-widest', fontFamily: '"Courier New", Courier, monospace' },
  { id: 'cyber', cssClass: 'font-mono font-black tracking-widest uppercase', fontFamily: '"Trebuchet MS", "Lucida Grande", sans-serif' },
  { id: 'rounded', cssClass: 'font-semibold tracking-normal', fontFamily: '"Quicksand", "Nunito", -apple-system, sans-serif' },
  { id: 'condensed', cssClass: 'font-bold tracking-tighter uppercase scale-y-110 inline-block', fontFamily: '"Arial Narrow", "Impact", sans-serif' },
];

export const getTimerFontCssClass = (fontId?: TimerFontType | string): string => {
  const f = TIMER_FONTS.find(item => item.id === fontId);
  return f ? f.cssClass : '';
};

// ==================== EFFECTS ====================

export type TimerEffectType =
  | 'none'
  | 'neon-glow'
  | 'glitch'
  | 'flame'
  | 'stardust'
  | 'wave'
  | 'prismatic'
  | 'breathe'
  | 'electric';

export interface TimerEffectDefinition {
  id: TimerEffectType;
  cssClass: string;
}

export const TIMER_EFFECTS: TimerEffectDefinition[] = [
  { id: 'none', cssClass: '' },
  { id: 'neon-glow', cssClass: 'drop-shadow-[0_0_12px_rgba(45,212,191,0.85)] filter animate-pulse' },
  { id: 'glitch', cssClass: 'drop-shadow-[2px_0_0_rgba(239,68,68,0.7)] drop-shadow-[-2px_0_0_rgba(59,130,246,0.7)]' },
  { id: 'flame', cssClass: 'drop-shadow-[0_0_14px_rgba(245,158,11,0.9)] text-amber-300' },
  { id: 'stardust', cssClass: 'drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-sparkle-occasional' },
  { id: 'wave', cssClass: 'bg-gradient-to-r from-teal-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' },
  { id: 'prismatic', cssClass: 'bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(236,72,153,0.4)]' },
  { id: 'breathe', cssClass: 'animate-breathing drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' },
  { id: 'electric', cssClass: 'drop-shadow-[0_0_14px_rgba(6,182,212,0.9)] text-cyan-200' },
];

export const getTimerEffectCssClass = (effectId?: TimerEffectType | string): string => {
  const e = TIMER_EFFECTS.find(item => item.id === effectId);
  return e ? e.cssClass : '';
};

export const getTimerStyleCssClass = (styleId: TimerStyleType | string): string => {
  switch (styleId) {
    case 'classic':
    case 'none':
      return 'text-[#FFFDD0] font-mono font-black drop-shadow-sm';
    case 'pixel-art':
      return 'timer-pixel-art';
    case 'cyberpunk':
      return 'timer-cyberpunk';
    case 'gothic':
      return 'timer-gothic';
    case 'watercolor':
      return 'timer-watercolor';
    case 'minimalist':
    case 'minimal':
      return 'timer-minimalist';
    case 'zen-breathe':
      return 'timer-zen-breathe';
    case 'aurora':
      return 'timer-aurora';
    case 'nixie':
      return 'timer-nixie';
    case 'matrix':
      return 'timer-matrix';
    case 'synthwave':
      return 'timer-synthwave';
    case 'parchment':
      return 'timer-parchment-box';
    case 'nordic-frost':
      return 'timer-nordic-frost-box';
    case 'leather-gold':
      return 'timer-leather-gold-box';
    case 'obsidian-glow':
      return 'timer-obsidian-glow-box';
    case 'emerald-gold':
      return 'timer-emerald-gold-box';
    case 'moonlight':
      return 'timer-moonlight';
    case 'kyoto':
      return 'timer-kyoto-box';
    case 'sandglass':
      return 'timer-sandglass';
    case 'cosmic-void':
      return 'timer-cosmic-void';
    case 'neon-pulse':
    case 'neon':
      return 'timer-neon-pulse-box';
    case 'mystic-fog':
      return 'timer-mystic-fog';
    case 'golden-shimmer':
      return 'timer-golden-shimmer';
    case 'electric-storm':
      return 'timer-electric-storm';
    case 'lava-lamp':
      return 'timer-lava-lamp';
    case 'hologram-glitch':
      return 'timer-hologram-glitch';
    case 'quantum-portal':
      return 'timer-quantum-portal';
    case 'cherry-blossom':
      return 'timer-cherry-blossom';
    case 'solaris-flare':
      return 'timer-solaris-flare';
    case 'abyssal-pearl':
      return 'timer-abyssal-pearl';
    case 'phoenix-fire':
      return 'timer-phoenix-fire';
    case 'neon-cybergrid':
      return 'timer-neon-cybergrid';
    case 'neon-matrix-pulse':
      return 'timer-neon-matrix-pulse';
    case 'holographic-aurora':
      return 'timer-holographic-aurora';
    case 'cyber-pulse-amber':
      return 'timer-cyber-pulse-amber';
    case 'crystal-frost':
      return 'timer-crystal-frost';
    case 'nebula-storm':
      return 'timer-nebula-storm';
    case 'velvet-gold':
      return 'timer-velvet-gold';
    case 'sunset-horizon':
      return 'timer-sunset-horizon';
    case 'electric-violet':
      return 'timer-electric-violet';
    case 'emerald-matrix':
      return 'timer-emerald-matrix';
    case 'solar-flare-gold':
      return 'timer-solar-flare-gold';
    case 'ocean-depth':
      return 'timer-ocean-depth';
    case 'autumn-words':
      return 'timer-autumn-words';
    case 'autumn-digital':
      return 'timer-autumn-digital';
    case 'autumn-day-milestone':
      return 'timer-autumn-day-milestone';
    case 'autumn-leaf-texture':
      return 'timer-autumn-leaf-texture';
    case 'autumn-golden-fall':
      return 'timer-autumn-golden-fall';
    case 'handwritten':
      return 'timer-handwritten-text text-slate-800 dark:text-emerald-300';
    case 'digital':
      return 'timer-digital-wrapper';
    case 'harmonic':
      return 'select-none';
    default:
      // Allow custom CSS classes directly if set in localStorage
      if (typeof styleId === 'string' && styleId.startsWith('timer-')) {
        return styleId;
      }
      return 'timer-zen-breathe';
  }
};
