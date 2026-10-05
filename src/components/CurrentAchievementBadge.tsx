import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Check, 
  Lock, 
  Clock, 
  Sparkles, 
  Share2, 
  CheckCheck, 
  Flame, 
  HeartPulse, 
  ShieldCheck, 
  Zap, 
  Trophy, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { NavTimeAchievementIcon } from './BottomNavIcons';
import { ToughestTimeWidgetTimer } from './ToughestTimeWidgetTimer';

export interface TimeMilestone {
  id: string;
  hours: number;
  epoch: 'hours' | 'days' | 'weeks' | 'months';
  epochTitle: string;
  title: string;
  subtitle: string;
  tag: string;
  iconType: 'sparkle' | 'heart' | 'shield' | 'flame' | 'zap' | 'trophy';
  medicalFact: string;
  psychFact: string;
  quote: string;
}

export const TIME_MILESTONES: TimeMilestone[] = [
  // ЕПОХА: ПЕРШІ ГОДИНИ
  {
    id: 'h1',
    hours: 1,
    epoch: 'hours',
    epochTitle: 'Перші години',
    title: 'Перша Година',
    subtitle: 'Початок очищення кровотоку',
    tag: '1 година',
    iconType: 'sparkle',
    medicalFact: 'ЧСС і артеріальний тиск починають знижуватися до нормального фізіологічного рівня. Периферичні судини роблять перший крок до відновлення.',
    psychFact: 'Перше вольове «ні» залежності. Ти перетнув найважчу психологічну межу — сам початок.',
    quote: '«Дорога в тисячу миль починається з першої години непохитного рішення.»'
  },
  {
    id: 'h2',
    hours: 2,
    epoch: 'hours',
    epochTitle: 'Перші години',
    title: 'Нікотиновий Відтік',
    subtitle: 'Зниження концентрації алкалоїду',
    tag: '2 години',
    iconType: 'zap',
    medicalFact: 'Рівень нікотину в крові стрімко падає на 50%. Тіло починає метаболізувати накопичені токсини.',
    psychFact: 'Мозок шукає звичний дофаміновий стимул, але ти вчишся бути господарем своїх імпульсів.',
    quote: '«Твоя воля — це мʼяз. Кожна подолана хвилина робить її непереможною.»'
  },
  {
    id: 'h4',
    hours: 4,
    epoch: 'hours',
    epochTitle: 'Перші години',
    title: 'Кисневий Перелом',
    subtitle: 'Насичення еритроцитів',
    tag: '4 години',
    iconType: 'heart',
    medicalFact: 'Рівень кисню в плазмі крові підвищується, що значно покращує живлення клітин головного мозку.',
    psychFact: 'Поліпшується ясність думок, спадає токсична затуманеність сприйняття.',
    quote: '«Ти повертаєш своєму тілу те, що належить йому за правом народження — чисте повітря.»'
  },
  {
    id: 'h8',
    hours: 8,
    epoch: 'hours',
    epochTitle: 'Перші години',
    title: 'Очищення від Чадного Газу',
    subtitle: 'Падіння рівня токсичного CO',
    tag: '8 годин',
    iconType: 'shield',
    medicalFact: 'Рівень чадного газу (CO) в крові падає більш ніж наполовину. Киснева ємність крові різко відновлюється.',
    psychFact: 'Сон стає глибшим і продуктивнішим, якщо цей період припадає на ніч.',
    quote: '«Клітини дякують тобі за кожен ковток природного кисню.»'
  },
  {
    id: 'h12',
    hours: 12,
    epoch: 'hours',
    epochTitle: 'Перші години',
    title: 'Фізіологічна Норма CO',
    subtitle: 'Повне очищення від оксиду вуглецю',
    tag: '12 годин',
    iconType: 'heart',
    medicalFact: 'Рівень монооксиду вуглецю в крові повертається до показників людини, яка ніколи не курила.',
    psychFact: 'Півдоби абсолютної чистоти. Ти довів, що здатний тримати контроль тривалий час.',
    quote: '«Твоє серце більше не бʼється під димовою завісою.»'
  },

  // ЕПОХА: ДНІ НЕЗЛАМНОСТІ
  {
    id: 'd1',
    hours: 24,
    epoch: 'days',
    epochTitle: 'Дні незламності',
    title: 'Добовий Тріумф',
    subtitle: '24 години абсолютної свободи',
    tag: '1 доба',
    iconType: 'trophy',
    medicalFact: 'Ризик раптового коронарного інфаркту міокарда починає вимірювано знижуватися. Бронхи починають самоочищатися.',
    psychFact: 'Пройдено повне добове коло: ранок, робота, вечір і сон без жодної затяжки.',
    quote: '«Ціла доба свободи — це фундамент нової, сильної особистості.»'
  },
  {
    id: 'd2',
    hours: 48,
    epoch: 'days',
    epochTitle: 'Дні незламності',
    title: 'Відродження Відчуттів',
    subtitle: 'Регенерація нервових закінчень',
    tag: '2 доби',
    iconType: 'sparkle',
    medicalFact: 'Пошкоджені нервові закінчення нюху та смаку починають активно відростати. Смак їжі та запахи стають яскравими.',
    psychFact: 'Світ наповнюється свіжими фарбами та ароматами, які раніше блокувалися димом.',
    quote: '«Життя знову набуває справжнього, соковитого смаку.»'
  },
  {
    id: 'd3',
    hours: 72,
    epoch: 'days',
    epochTitle: 'Дні незламності',
    title: 'Пік Подолано!',
    subtitle: '100% нікотину покинуло тіло',
    tag: '3 доби',
    iconType: 'flame',
    medicalFact: 'Нікотин повністю виведений з організму. Фізична залежність пройдена через свій найвищий пік і йде на спад.',
    psychFact: 'Найважча фізична битва виграна. Надалі боротьба стає легшою з кожним днем.',
    quote: '«Пік шторму позаду. Попереду — спокійне, вільне плавання.»'
  },
  {
    id: 'd5',
    hours: 120,
    epoch: 'days',
    epochTitle: 'Дні незламності',
    title: 'Вільні Бронхи',
    subtitle: 'Розслаблення дихальних шляхів',
    tag: '5 діб',
    iconType: 'shield',
    medicalFact: 'Бронхіальні трубки розслабляються, життєвий обʼєм легень збільшується, рівень витривалості зростає на 15–20%.',
    psychFact: 'Зʼявляється небувалий прилив енергії та бадьорості вранці.',
    quote: '«Глибокий вдих на повні груди — це твоя найбільша винагорода.»'
  },
  {
    id: 'd7',
    hours: 168,
    epoch: 'days',
    epochTitle: 'Дні незламності',
    title: 'Тижнева Фортеця',
    subtitle: '7 днів без тютюну',
    tag: '1 тиждень',
    iconType: 'trophy',
    medicalFact: 'Слизові оболонки шлунка та дихальних шляхів активно відновлюються. Війковий епітелій починає вимітати залишки смол.',
    psychFact: 'Твоя самооцінка зростає. Ті, хто протрималися тиждень, мають у 9 разів вищий шанс ніколи не повернутися до куріння.',
    quote: '«Сім днів стійкості перетворюють намір на залізну реальність.»'
  },

  // ЕПОХА: ТИЖНІ ПЕРЕМОГИ
  {
    id: 'd10',
    hours: 240,
    epoch: 'weeks',
    epochTitle: 'Тижні перемоги',
    title: 'Капілярний Баланс',
    subtitle: 'Відновлення мікроциркуляції',
    tag: '10 діб',
    iconType: 'zap',
    medicalFact: 'Мікроциркуляція крові в яснах, шкірі та кінцівках відновлюється. Колір обличчя набуває здорового відтінку.',
    psychFact: 'Дратівливість повністю вщухає, на її місце приходить глибокий внутрішній спокій.',
    quote: '«Твоє тіло дякує тобі свіжістю кожної клітини.»'
  },
  {
    id: 'd14',
    hours: 336,
    epoch: 'weeks',
    epochTitle: 'Тижні перемоги',
    title: 'Капілярний Ренесанс',
    subtitle: '2 тижні повної чистоти',
    tag: '2 тижні',
    iconType: 'heart',
    medicalFact: 'Кровообіг суттєво покращується по всьому тілу. Функція легень зростає на величину до 30%. Ходьба та спорт стають легкими.',
    psychFact: 'Звичка автоматично тягнутися за сигаретою слабшає і заміщується новими ритуалами.',
    quote: '«Два тижні свободи — це вже не спроба, це новий спосіб життя.»'
  },
  {
    id: 'd21',
    hours: 504,
    epoch: 'weeks',
    epochTitle: 'Тижні перемоги',
    title: 'Нейронний Зсув',
    subtitle: 'Перебудова дофамінових рецепторів',
    tag: '3 тижні',
    iconType: 'sparkle',
    medicalFact: 'Нейропластичність мозку: дофамінові рецептори повертаються до природного балансу без штучної стимуляції нікотином.',
    psychFact: 'Психологічна звичка зламана за класичним 21-денним законом адаптації.',
    quote: '«Твій мозок навчився бути щасливим без штучних отруйних підпорок.»'
  },
  {
    id: 'd30',
    hours: 720,
    epoch: 'weeks',
    epochTitle: 'Тижні перемоги',
    title: 'Сталевий Моноліт',
    subtitle: '1 місяць свободи!',
    tag: '1 місяць',
    iconType: 'trophy',
    medicalFact: 'Війковий епітелій у бронхах повністю регенерував. Задишка та хронічний кашель курця зникають.',
    psychFact: 'Ти перейшов у статус людини, яка впевнено каже: «Я не курю».',
    quote: '«Місяць без сигарет — це фундаментальний тріумф твоєї особистості.»'
  },

  // ЕПОХА: ЗОЛОТА ЕРА СВОБОДИ
  {
    id: 'd45',
    hours: 1080,
    epoch: 'months',
    epochTitle: 'Золота ера свободи',
    title: 'Енергетичний Розквіт',
    subtitle: '1.5 місяці незламності',
    tag: '45 днів',
    iconType: 'flame',
    medicalFact: 'Імунна система працює на пікових показниках. Опірність сезонним інфекціям зростає у рази.',
    psychFact: 'Стресостійкість стає значно вищою, ніж у період активного куріння.',
    quote: '«Справжня сила — це спокій серед будь-яких життєвих викликів.»'
  },
  {
    id: 'd60',
    hours: 1440,
    epoch: 'months',
    epochTitle: 'Золота ера свободи',
    title: 'Глибока Регенерація',
    subtitle: '2 місяці абсолюту',
    tag: '2 місяці',
    iconType: 'shield',
    medicalFact: 'Кровоносне русло повністю очищене від атеросклеротичних провокаторів диму. Тонус судин бездоганний.',
    psychFact: 'Ти більше не відчуваєш потреби заповнювати паузи димом.',
    quote: '«Два місяці чистоти — це доказ твоєї абсолютної самодисципліни.»'
  },
  {
    id: 'd90',
    hours: 2160,
    epoch: 'months',
    epochTitle: 'Золота ера свободи',
    title: 'Сезон Перемоги',
    subtitle: '3 місяці (квартал)',
    tag: '3 місяці',
    iconType: 'trophy',
    medicalFact: 'Функція легень повністю стабілізована. Ризик інсульту та тромбозів починає стрімко падати.',
    psychFact: 'Критична фаза рецидивів залишилася далеко позаду.',
    quote: '«Три місяці — це цілий сезон чистого, ясного і радісного життя.»'
  },
  {
    id: 'd180',
    hours: 4320,
    epoch: 'months',
    epochTitle: 'Золота ера свободи',
    title: 'Спортивні Легені',
    subtitle: 'Півроку чистого дихання',
    tag: '6 місяців',
    iconType: 'heart',
    medicalFact: 'Легеневі тканини практично повністю очистилися від залишків смол. Життєвий обʼєм легень на піку.',
    psychFact: 'Повна психологічна незалежність від компаній курців та тригерних ситуацій.',
    quote: '«Півроку — це рубіж, яким пишаються все життя.»'
  },
  {
    id: 'd270',
    hours: 6480,
    epoch: 'months',
    epochTitle: 'Золота ера свободи',
    title: 'Нова Анатомія',
    subtitle: '9 місяців клітинного оновлення',
    tag: '9 місяців',
    iconType: 'sparkle',
    medicalFact: 'Всі клітини крові, слизових оболонок та мікрокапілярів повністю оновилися в умовах чистого середовища.',
    psychFact: 'Образ минулого куріння здається далеким і чужим сном.',
    quote: '«Твоє тіло народилося заново вільним і сильним.»'
  },
  {
    id: 'd365',
    hours: 8760,
    epoch: 'months',
    epochTitle: 'Золота ера свободи',
    title: 'Ювілей Абсолюту',
    subtitle: '1 рік повної свободи!',
    tag: '1 рік',
    iconType: 'trophy',
    medicalFact: 'Ризик розвитку ішемічної хвороби серця знизився рівно на 50% порівняно з курцем.',
    psychFact: 'Абсолютна внутрішня перемога. Ти — людина слова, залізної волі та міцного здоровʼя.',
    quote: '«Один рік свободи — це подвиг, який змінює долю назавжди!»'
  }
];

interface CurrentAchievementBadgeProps {
  startDate: number;
  className?: string;
}

const getRankByHours = (hours: number): { title: string; color: string; emblem: string } => {
  if (hours < 24) return { title: 'Шукач Волі', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', emblem: '⚡' };
  if (hours < 72) return { title: 'Воїн Рівноваги', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10', emblem: '🛡️' };
  if (hours < 168) return { title: 'Вартовий Спокою', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', emblem: '🌿' };
  if (hours < 336) return { title: 'Сталевий Ветеран', color: 'text-teal-400 border-teal-500/30 bg-teal-500/10', emblem: '💎' };
  if (hours < 720) return { title: 'Хранитель Чистоти', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10', emblem: '🌊' };
  if (hours < 2160) return { title: 'Володар Дихання', color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10', emblem: '👑' };
  if (hours < 4320) return { title: 'Адепт Гармонії', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10', emblem: '🌟' };
  if (hours < 8760) return { title: 'Легенда Свободи', color: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10', emblem: '🦅' };
  return { title: 'Абсолютний Майстер', color: 'text-amber-300 border-amber-400/40 bg-amber-500/15', emblem: '🏆' };
};

export const CurrentAchievementBadge: React.FC<CurrentAchievementBadgeProps> = ({ startDate, className = '' }) => {
  const [now, setNow] = useState<number>(Date.now());
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'achieved' | 'upcoming'>('all');
  const [selectedMilestone, setSelectedMilestone] = useState<TimeMilestone | null>(null);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // Update clock every second for live real-time countdown
  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const safeStartDate = typeof startDate === 'number' && !isNaN(startDate) && startDate > 0 ? startDate : Date.now();
  const diffMs = Math.max(0, now - safeStartDate);
  const totalHours = isNaN(diffMs) ? 0 : Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = isNaN(totalHours) ? 0 : Math.floor(totalHours / 24);
  const remHours = isNaN(totalHours) ? 0 : totalHours % 24;
  const remMinutes = isNaN(diffMs) ? 0 : Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const remSeconds = isNaN(diffMs) ? 0 : Math.floor((diffMs % (1000 * 60)) / 1000);

  const rank = useMemo(() => getRankByHours(totalHours), [totalHours]);

  // Determine achieved, next and locked milestones
  const { achievedMilestones, nextMilestone, upcomingMilestones } = useMemo<{
    achievedMilestones: TimeMilestone[];
    nextMilestone: TimeMilestone | null;
    upcomingMilestones: TimeMilestone[];
  }>(() => {
    const achieved: TimeMilestone[] = [];
    const upcoming: TimeMilestone[] = [];
    let next: TimeMilestone | null = null;

    TIME_MILESTONES.forEach((m) => {
      if (totalHours >= m.hours) {
        achieved.push(m);
      } else {
        if (!next) {
          next = m;
        }
        upcoming.push(m);
      }
    });

    return {
      achievedMilestones: achieved,
      nextMilestone: next,
      upcomingMilestones: upcoming
    };
  }, [totalHours]);

  // Progress to next milestone
  const nextProgressPct = useMemo(() => {
    if (!nextMilestone) return 100;
    const prevMilestoneHours = achievedMilestones.length > 0
      ? (achievedMilestones[achievedMilestones.length - 1]?.hours || 0)
      : 0;
    const span = ((nextMilestone as TimeMilestone)?.hours || 0) - prevMilestoneHours;
    if (span <= 0) return 100;
    const currentProgressHours = (diffMs / (1000 * 60 * 60)) - prevMilestoneHours;
    const pct = Math.max(0, Math.min(100, (currentProgressHours / span) * 100));
    return isNaN(pct) ? 0 : Math.round(pct);
  }, [nextMilestone, achievedMilestones, diffMs]);

  // Time remaining to next milestone
  const nextTimeRemainingText = useMemo(() => {
    if (!nextMilestone) return 'Усі ключові рубежі підкорено!';
    const targetMs = safeStartDate + (nextMilestone.hours * 60 * 60 * 1000);
    const leftMs = Math.max(0, targetMs - now);
    if (isNaN(leftMs)) return '0 хв.';
    const hLeft = Math.floor(leftMs / (1000 * 60 * 60));
    const mLeft = Math.floor((leftMs % (1000 * 60 * 60)) / (1000 * 60));
    const sLeft = Math.floor((leftMs % (1000 * 60)) / 1000);

    if (hLeft > 24) {
      const dLeft = Math.floor(hLeft / 24);
      const remH = hLeft % 24;
      return `${dLeft} дн. ${remH} год.`;
    }
    if (hLeft > 0) {
      return `${hLeft} год. ${mLeft} хв.`;
    }
    return `${mLeft} хв. ${sLeft} сек.`;
  }, [nextMilestone, safeStartDate, now]);

  const handleShareTrophy = (milestone?: TimeMilestone) => {
    if (navigator.vibrate) {
      try { navigator.vibrate(25); } catch {}
    }
    const m = milestone || (achievedMilestones.length > 0 ? achievedMilestones[achievedMilestones.length - 1] : null);
    const shareText = m 
      ? `🏆 Моє часове досягнення: «${m.title}» (${m.tag})!\nВже ${totalDays > 0 ? `${totalDays} дн. ` : ''}${remHours} год. свободи від тютюну. Тіло оновлюється, воля міцнішає! ✨`
      : `🌟 Мій шлях свободи від куріння: вже ${totalHours} год. без сигарет! Кожна секунда має значення.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      }).catch(() => {});
    }
  };

  const filteredMilestones = useMemo(() => {
    if (activeTab === 'achieved') return achievedMilestones;
    if (activeTab === 'upcoming') return upcomingMilestones;
    return TIME_MILESTONES;
  }, [activeTab, achievedMilestones, upcomingMilestones]);

  const currentStage = useMemo(() => {
    if (achievedMilestones.length === 0) {
      return {
        tag: '< 1 год',
        title: 'Старт'
      };
    }
    const latest = achievedMilestones[achievedMilestones.length - 1];
    return {
      tag: latest.tag,
      title: latest.title
    };
  }, [achievedMilestones]);

  // Real-time countdown to completion of the current milestone stage
  const countdownText = useMemo(() => {
    if (!nextMilestone) return 'Всі етапи підкорено ✨';
    const targetMs = safeStartDate + (nextMilestone.hours * 60 * 60 * 1000);
    const leftMs = Math.max(0, targetMs - now);
    if (isNaN(leftMs) || leftMs <= 0) return '0 хв 00 с';

    const totalSeconds = Math.floor(leftMs / 1000);
    const s = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const m = totalMinutes % 60;
    const totalHoursLeft = Math.floor(totalMinutes / 60);
    const h = totalHoursLeft % 24;
    const d = Math.floor(totalHoursLeft / 24);

    const pad = (n: number) => String(n).padStart(2, '0');

    if (d > 0) {
      return `${d} дн ${h} год ${m} хв ${pad(s)} с`;
    }
    if (totalHoursLeft > 0) {
      return `${totalHoursLeft} год ${m} хв ${pad(s)} с`;
    }
    return `${m} хв ${pad(s)} с`;
  }, [nextMilestone, safeStartDate, now]);

  // Smoke-free total elapsed time formatted when all milestone achievements are done
  const smokeFreeTime = useMemo(() => {
    const totalElapsedMs = Math.max(0, now - safeStartDate);
    const totalSeconds = Math.floor(totalElapsedMs / 1000);
    const s = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const m = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const h = totalHours % 24;
    const d = Math.floor(totalHours / 24);

    const pad = (n: number) => String(n).padStart(2, '0');

    if (d > 0) {
      return {
        line1: `${d} дн ${h} год`,
        line2: `${m} хв ${pad(s)} с`,
        full: `${d} дн ${h} год ${m} хв ${pad(s)} с`
      };
    }
    if (totalHours > 0) {
      return {
        line1: `${totalHours} год`,
        line2: `${m} хв ${pad(s)} с`,
        full: `${totalHours} год ${m} хв ${pad(s)} с`
      };
    }
    return {
      line1: `${m} хв`,
      line2: `${pad(s)} с`,
      full: `${m} хв ${pad(s)} с`
    };
  }, [now, safeStartDate]);

  const triggerTitle = useMemo(() => {
    if (!nextMilestone) return `Усі часові досягнення здобуто! 🏆 Час без куріння: ${smokeFreeTime.full}`;
    return `Поточний етап: ${(nextMilestone as TimeMilestone).title} (${(nextMilestone as TimeMilestone).tag}) • Залишилось: ${countdownText} • Прогрес: ${nextProgressPct}%`;
  }, [nextMilestone, countdownText, nextProgressPct, smokeFreeTime.full]);

  return (
    <>
      {/* 2-LINE OPTIMIZED TIMER DISPLAY */}
      <div className="pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (navigator.vibrate) {
              try { navigator.vibrate(20); } catch {}
            }
            setShowModal(true);
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-2.5 xs:px-3 sm:px-4 rounded-2xl bg-zinc-950/70 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700 shadow-xl transition-all duration-300 cursor-pointer active:scale-95 group/achieve backdrop-blur-xl ${className}`}
          title={triggerTitle}
        >
          {/* Рядок 1: Назва етапу • Проценти / або чистий час без куріння коли всі етапи пройдено */}
          <div className="flex items-center justify-center gap-1.5 select-none">
            <span className="text-[12.5px] sm:text-[14px] font-black tracking-tight text-zinc-100 group-hover/achieve:text-white transition-colors whitespace-nowrap">
              {nextMilestone ? (nextMilestone as TimeMilestone).tag : smokeFreeTime.line1}
            </span>
            {nextMilestone ? (
              <span className="text-[10.5px] sm:text-[12px] font-mono font-bold text-zinc-300 bg-zinc-800/80 border border-zinc-700/80 px-1.5 py-0.2 rounded-md shadow-xs">
                {nextProgressPct}%
              </span>
            ) : null}
          </div>

          {/* Рядок 2: Кількість часу до завершення етапу (Зворотній відлік) / або хвилини та секунди вільного часу */}
          <div className="flex items-center justify-center gap-1 mt-0.5 text-[10px] sm:text-[11.5px] font-mono font-medium text-zinc-400 group-hover/achieve:text-zinc-300 select-none whitespace-nowrap truncate max-w-[170px] xs:max-w-[190px] sm:max-w-[270px]">
            <span className="truncate">
              {nextMilestone ? `ще ${countdownText}` : smokeFreeTime.line2}
            </span>
          </div>
        </button>
      </div>

      {/* FULL SPECTACULAR MODAL (Rendered at root level via createPortal) */}
      {showModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="w-full max-w-lg max-h-[90vh] bg-[#121217] border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. TOP HEADER */}
            <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between gap-3 sticky top-0 z-20 backdrop-blur-md">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-none text-amber-300 shadow-inner">
                  <NavTimeAchievementIcon active={true} className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-black tracking-tight text-white truncate">
                      Хроніка Свободи
                    </h2>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${rank.color}`}>
                      <span>{rank.emblem}</span>
                      <span>{rank.title}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate">
                    Часові рубежі біологічного та вольового тріумфу
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-none">
                <button
                  type="button"
                  onClick={() => handleShareTrophy()}
                  className="p-2 text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/80 rounded-xl transition-all cursor-pointer"
                  title="Поділитися успіхом"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-xl transition-all cursor-pointer"
                  title="Закрити"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. SCROLLABLE CONTENT BODY */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-left custom-scrollbar">

              {/* HERO CARD: LIVE COUNTER & PROGRESS */}
              <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#1a1a24] via-[#16161f] to-[#14141c] border border-amber-500/25 shadow-lg overflow-hidden space-y-4">
                <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Live counter digits */}
                <div className="space-y-1 relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Час безперервної свободи</span>
                  </span>
                  <div className="flex items-baseline gap-2 sm:gap-3 font-mono font-black text-white text-xl sm:text-2xl pt-1">
                    {totalDays > 0 && (
                      <span className="flex items-baseline gap-0.5">
                        <span className="text-2xl sm:text-3xl text-amber-300">{totalDays}</span>
                        <span className="text-xs text-zinc-400 font-sans font-medium">дн</span>
                      </span>
                    )}
                    <span className="flex items-baseline gap-0.5">
                      <span className="text-2xl sm:text-3xl text-amber-200">{String(remHours).padStart(2, '0')}</span>
                      <span className="text-xs text-zinc-400 font-sans font-medium">год</span>
                    </span>
                    <span className="text-zinc-500">:</span>
                    <span className="flex items-baseline gap-0.5">
                      <span className="text-2xl sm:text-3xl text-zinc-200">{String(remMinutes).padStart(2, '0')}</span>
                      <span className="text-xs text-zinc-400 font-sans font-medium">хв</span>
                    </span>
                    <span className="text-zinc-500">:</span>
                    <span className="flex items-baseline gap-0.5">
                      <span className="text-xl sm:text-2xl text-amber-400/80">{String(remSeconds).padStart(2, '0')}</span>
                      <span className="text-xs text-zinc-500 font-sans font-medium">сек</span>
                    </span>
                  </div>
                </div>

                {/* NEXT UPCOMING MILESTONE BANNER */}
                {nextMilestone ? (
                  <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/30 space-y-2 relative z-10">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-none" />
                        <span className="text-zinc-400 truncate">Наступний рубіж:</span>
                        <span className="font-bold text-amber-300 truncate">{(nextMilestone as TimeMilestone).title} ({(nextMilestone as TimeMilestone).tag})</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-200 flex-none ml-2">
                        ще {nextTimeRemainingText}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500"
                          style={{ width: `${nextProgressPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-zinc-400">
                        <span>Прогрес етапу: {nextProgressPct}%</span>
                        <span>Ціль: {(nextMilestone as TimeMilestone).hours} годин</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    <span>Вітаємо! Всі 20 ключових рубежів Хроніки Свободи успішно досягнуто! 🎉</span>
                  </div>
                )}

                {/* Toughest Time Countdown & Urge Surfing Timer */}
                <ToughestTimeWidgetTimer
                  onOpenDialog={() => {
                    setShowModal(false);
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('open-toughest-time-dialog'));
                    }, 250);
                  }}
                />

                {/* THREE COMPACT SUMMARY TILES */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-0.5">
                    <span className="text-[10px] text-zinc-400 block font-medium">Здобуто</span>
                    <span className="text-xs sm:text-sm font-black font-mono text-amber-300">
                      {achievedMilestones.length} / {TIME_MILESTONES.length}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-0.5">
                    <span className="text-[10px] text-zinc-400 block font-medium">Рубежі</span>
                    <span className="text-xs sm:text-sm font-black font-mono text-emerald-400">
                      {Math.round((achievedMilestones.length / TIME_MILESTONES.length) * 100)}%
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-0.5">
                    <span className="text-[10px] text-zinc-400 block font-medium">Всього діб</span>
                    <span className="text-xs sm:text-sm font-black font-mono text-zinc-200">
                      {(diffMs / (1000 * 60 * 60 * 24)).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* TABS FILTER */}
              <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.vibrate) try { navigator.vibrate(15); } catch {}
                      setActiveTab('all');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'all'
                        ? 'bg-zinc-800 text-white border border-zinc-700'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Всі ({TIME_MILESTONES.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.vibrate) try { navigator.vibrate(15); } catch {}
                      setActiveTab('achieved');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'achieved'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Здобуті ({achievedMilestones.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.vibrate) try { navigator.vibrate(15); } catch {}
                      setActiveTab('upcoming');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'upcoming'
                        ? 'bg-zinc-800 text-white border border-zinc-700'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Попереду ({upcomingMilestones.length})
                  </button>
                </div>

                <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                  Старт: {new Date(startDate).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}
                </span>
              </div>

              {/* MILESTONE CARDS LIST */}
              <div className="space-y-2.5">
                {filteredMilestones.map((m) => {
                  const isAchieved = totalHours >= m.hours;
                  const isCurrentTarget = nextMilestone && nextMilestone.id === m.id;

                  // Target achievement timestamp
                  const achievedDate = new Date(startDate + m.hours * 60 * 60 * 1000);
                  const formattedDate = achievedDate.toLocaleString('uk-UA', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        if (navigator.vibrate) try { navigator.vibrate(15); } catch {}
                        setSelectedMilestone(m);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none group relative overflow-hidden ${
                        isAchieved
                          ? 'bg-zinc-900/90 hover:bg-zinc-800/90 border-amber-500/30 hover:border-amber-500/60 shadow-xs'
                          : isCurrentTarget
                            ? 'bg-amber-500/10 hover:bg-amber-500/15 border-amber-400/60 shadow-md ring-1 ring-amber-400/20'
                            : 'bg-zinc-900/40 hover:bg-zinc-900/60 border-zinc-800/80 opacity-70 hover:opacity-90'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Status Icon Badge */}
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-none text-base border transition-all ${
                            isAchieved
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs'
                              : isCurrentTarget
                                ? 'bg-amber-400/20 text-amber-300 border-amber-400/60'
                                : 'bg-zinc-800/60 text-zinc-500 border-zinc-700/50'
                          }`}>
                            {isAchieved ? (
                              <CheckCheck className="w-5 h-5 text-amber-400" />
                            ) : isCurrentTarget ? (
                              <Clock className="w-4 h-4 text-amber-300" />
                            ) : (
                              <Lock className="w-4 h-4 text-zinc-500" />
                            )}
                          </div>

                          {/* Title & Tag */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={`text-xs sm:text-sm font-bold truncate ${isAchieved ? 'text-zinc-100 group-hover:text-amber-200' : isCurrentTarget ? 'text-amber-200' : 'text-zinc-400'}`}>
                                {m.title}
                              </h4>
                              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${
                                isAchieved
                                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                  : isCurrentTarget
                                    ? 'bg-amber-400/20 text-amber-200 border-amber-400/40'
                                    : 'bg-zinc-800 text-zinc-500 border-zinc-700/50'
                              }`}>
                                {m.tag}
                              </span>
                              {isCurrentTarget && (
                                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/15 px-1.5 py-0.5 rounded-full border border-amber-400/30">
                                  У процесі
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                              {m.medicalFact}
                            </p>
                          </div>
                        </div>

                        {/* Right side info / chevron */}
                        <div className="text-right flex-none space-y-0.5">
                          <span className={`text-[10px] font-mono block ${isAchieved ? 'text-emerald-400' : isCurrentTarget ? 'text-amber-300 font-bold' : 'text-zinc-500'}`}>
                            {isAchieved ? `Здобуто: ${formattedDate}` : isCurrentTarget ? `ще ${nextTimeRemainingText}` : `Ціль: ${m.hours} год`}
                          </span>
                          <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 flex items-center justify-end gap-0.5 transition-colors">
                            <span>Деталі</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. MODAL FOOTER */}
            <div className="p-3.5 sm:p-4 border-t border-zinc-800/80 bg-zinc-900/80 flex items-center justify-between gap-3 text-xs text-zinc-400 backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">Кожна година без куріння — це необоротна регенерація тіла.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs cursor-pointer transition-all flex-none"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* DETAILED MILESTONE POPUP MODAL (When tapping any card) */}
      {selectedMilestone && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[550] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-150"
          onClick={() => setSelectedMilestone(null)}
        >
          <div 
            className="w-full max-w-sm bg-[#16161f] border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-left relative space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMilestone(null)}
              className="absolute top-3.5 right-3.5 p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xl shadow-inner">
                {totalHours >= selectedMilestone.hours ? '🏆' : '⏳'}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {selectedMilestone.epochTitle} • {selectedMilestone.tag}
                </span>
                <h3 className="text-base font-extrabold text-white">
                  {selectedMilestone.title}
                </h3>
              </div>
            </div>

            {/* Medical physiological facts */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <HeartPulse className="w-4 h-4 shrink-0" />
                <span>Фізіологічна трансформація:</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {selectedMilestone.medicalFact}
              </p>
            </div>

            {/* Psychological / mental transformation */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Психологічна перемога:</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {selectedMilestone.psychFact}
              </p>
            </div>

            {/* Power quote */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 italic text-xs leading-relaxed text-center">
              {selectedMilestone.quote}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleShareTrophy(selectedMilestone)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-zinc-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Поділитися досягненням</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* COPIED TOAST NOTIFICATION */}
      {copiedToast && typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[600] bg-amber-500 text-zinc-950 text-xs font-bold px-4 py-2 rounded-full shadow-2xl border border-amber-300 animate-in fade-in slide-in-from-bottom-2 duration-150 flex items-center gap-1.5">
          <Check className="w-4 h-4" />
          <span>Текст досягнення скопійовано!</span>
        </div>,
        document.body
      )}
    </>
  );
};
