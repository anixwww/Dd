import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Wind,
  Target,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Info,
  Activity,
  Play,
  Square,
  Award,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Flame,
  ShieldCheck,
  HeartPulse
} from 'lucide-react';

type TestTabId = 'fagerstrom' | 'horn' | 'richmond' | 'lungs';

interface TestTab {
  id: TestTabId;
  name: string;
  badge: string;
  desc: string;
  icon: React.ReactNode;
}

const STORAGE_KEY_PREFIX = 'nosmo_health_test_';

interface HealthTestsSectionProps {
  initialTab?: TestTabId;
  standalone?: boolean;
}

export const HealthTestsSection: React.FC<HealthTestsSectionProps> = ({ initialTab = 'fagerstrom', standalone = false }) => {
  const [activeTab, setActiveTab] = useState<TestTabId>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs: TestTab[] = [
    {
      id: 'fagerstrom',
      name: 'Фагерстрем',
      badge: 'Нікотин',
      desc: 'Тест фізичної нікотинової залежності',
      icon: <Flame className="w-4 h-4 text-amber-400" />
    },
    {
      id: 'horn',
      name: 'Шкала Хорна',
      badge: '6 мотивів',
      desc: 'Психологічні типи та мотиви куріння',
      icon: <Brain className="w-4 h-4 text-purple-400" />
    },
    {
      id: 'richmond',
      name: 'Річмонд',
      badge: 'Мотивація',
      desc: 'Тест готовності кинути курити',
      icon: <Target className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 'lungs',
      name: 'Обʼєм легень',
      badge: 'Штанге / ЖЄЛ',
      desc: 'Витривалість та киснева ємність',
      icon: <Wind className="w-4 h-4 text-cyan-400" />
    }
  ];

  return (
    <div className="space-y-4">
      {/* Intro banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-teal-500/10 border border-purple-500/20 text-xs text-zinc-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Наукові стандартизовані психометричні та фізіологічні тести. Отримайте об’єктивну оцінку типу залежності, рівня мотивації та стану дихальної системи з розгорнутим клінічним поясненням.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-zinc-800/90 border-purple-500/50 shadow-md shadow-purple-500/5 ring-1 ring-purple-500/40'
                  : 'bg-zinc-900/60 border-zinc-800/70 hover:bg-zinc-800/50 hover:border-zinc-700/60 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span className="p-1 rounded-lg bg-zinc-800/80 border border-zinc-700/40">
                  {tab.icon}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                  {tab.badge}
                </span>
              </div>
              <div>
                <h4 className={`text-xs font-bold leading-tight ${isActive ? 'text-zinc-100' : 'text-zinc-300'}`}>
                  {tab.name}
                </h4>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                  {tab.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Test Panels */}
      <div className="pt-1">
        {activeTab === 'fagerstrom' && <FagerstromTestPanel />}
        {activeTab === 'horn' && <HornTestPanel />}
        {activeTab === 'richmond' && <RichmondTestPanel />}
        {activeTab === 'lungs' && <LungsTestPanel />}
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 1. ТЕСТ ФАГЕРСТРЕМА (FTND)                                                */
/* ========================================================================= */

interface FagerstromQuestion {
  id: number;
  question: string;
  hint?: string;
  options: { text: string; points: number }[];
}

const FAGERSTROM_QUESTIONS: FagerstromQuestion[] = [
  {
    id: 1,
    question: 'Через скільки часу після ранкового пробудження ви викурюєте першу сигарету?',
    hint: 'Найбільш показовий маркер нічного виснаження рівня нікотину в крові',
    options: [
      { text: 'Протягом перших 5 хвилин', points: 3 },
      { text: 'Від 6 до 30 хвилин', points: 2 },
      { text: 'Від 31 до 60 хвилин', points: 1 },
      { text: 'Більше ніж через 60 хвилин', points: 0 }
    ]
  },
  {
    id: 2,
    question: 'Чи важко вам утриматися від куріння в місцях, де це заборонено (лікарня, транспорт, кінотеатр)?',
    options: [
      { text: 'Так, це викликає сильний дискомфорт або неспокій', points: 1 },
      { text: 'Ні, можу легко потерпіти скільки потрібно', points: 0 }
    ]
  },
  {
    id: 3,
    question: 'Від якої саме сигарети протягом дня вам найважче відмовитися?',
    options: [
      { text: 'Від найпершої ранкової сигарети', points: 1 },
      { text: 'Від будь-якої іншої протягом дня', points: 0 }
    ]
  },
  {
    id: 4,
    question: 'Скільки сигарет на день ви зазвичай викурюєте (або викурювали до відмови)?',
    options: [
      { text: '10 сигарет або менше', points: 0 },
      { text: 'Від 11 до 20 сигарет (близько 1 пачки)', points: 1 },
      { text: 'Від 21 до 30 сигарет', points: 2 },
      { text: '31 сигарета або більше (понад 1.5 пачки)', points: 3 }
    ]
  },
  {
    id: 5,
    question: 'Чи частіше ви курите в перші години після пробудження, ніж протягом решти дня?',
    hint: 'Вказує на синдром «ранкового надолуження» дефіциту дофаміну',
    options: [
      { text: 'Так, вранці частота перекурів значно вища', points: 1 },
      { text: 'Ні, куріння розподілено рівномірно протягом дня', points: 0 }
    ]
  },
  {
    id: 6,
    question: 'Чи курите ви під час сильної хвороби, коли більшу частину дня проводите в ліжку?',
    options: [
      { text: 'Так, навіть при застуді чи температурі пересилюю себе', points: 1 },
      { text: 'Ні, під час хвороби легко утримуюсь або не курю взагалі', points: 0 }
    ]
  }
];

export const FagerstromTestPanel: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}fagerstrom_answers`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [savedResultDate, setSavedResultDate] = useState<string | null>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}fagerstrom_date`);
  });

  const totalQuestions = FAGERSTROM_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === totalQuestions;

  const score = Object.values(answers).reduce((acc, pts) => acc + pts, 0);

  const handleSelectOption = (qId: number, points: number) => {
    const nextAnswers = { ...answers, [qId]: points };
    setAnswers(nextAnswers);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}fagerstrom_answers`, JSON.stringify(nextAnswers));
      if (Object.keys(nextAnswers).length === totalQuestions) {
        const nowStr = new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' });
        localStorage.setItem(`${STORAGE_KEY_PREFIX}fagerstrom_date`, nowStr);
        setSavedResultDate(nowStr);
      }
    } catch {}
  };

  const handleReset = () => {
    setAnswers({});
    setSavedResultDate(null);
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}fagerstrom_answers`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}fagerstrom_date`);
    } catch {}
  };

  // Interpretation helper
  const getFagerstromInterpretation = (pts: number) => {
    if (pts <= 2) {
      return {
        level: 'Дуже слабка залежність',
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        bg: 'bg-emerald-500/10',
        summary: 'Фізична потреба в нікотині мінімальна. Ваш головний виклик — суто психологічні ритуали та звички поведінки.',
        neurobiology: 'Рецептори альфа-4 бета-2 у вентральній зоні покришки мозку майже не змінили своєї щільності. Синдром відміни пройде практично непомітно протягом 2-3 днів.',
        recommendation: 'Вам абсолютно не потрібні нікотинозамінники (пластирі, жуйки). Зосередьтесь на поведінкових замінах: пийте воду, носіть із собою горішки чи м’ятні льодяники, уникайте автоматичних ритуалів куріння за компанію.'
      };
    }
    if (pts <= 4) {
      return {
        level: 'Слабка залежність',
        color: 'text-teal-400',
        borderColor: 'border-teal-500/30',
        bg: 'bg-teal-500/10',
        summary: 'Помірна фізіологічна прив’язаність. Організм здатний самостійно й швидко відновити власний ацетилхоліновий баланс.',
        neurobiology: 'Невеликий дефіцит дофаміну відчувається лише в стресових ситуаціях. Пік фізичної тяги спадає вже на 4-й день утримання.',
        recommendation: 'Використовуйте техніку відтермінування тяги «Правило 5 хвилин». Більшість імпульсів зникають за 3-5 хвилин без застосування медикаментів.'
      };
    }
    if (pts === 5) {
      return {
        level: 'Середній рівень залежності',
        color: 'text-amber-400',
        borderColor: 'border-amber-500/30',
        bg: 'bg-amber-500/10',
        summary: 'Фізичний компонент виражений помітно. Організм звик до постійного підживлення нікотином кожні 2–3 години.',
        neurobiology: 'Густина нікотинових рецепторів підвищена на 40-70%. Перші 3–7 днів супроводжуються дратівливістю, безсонням або порушенням концентрації уваги.',
        recommendation: 'Підготуйте антикризовий план: тримайте поруч воду з лимоном, дихальні вправи (4-7-8), легкі прогулянки. При вираженому дискомфорті можна застосувати гліцин або консультацію щодо нікотинових пластирів.'
      };
    }
    if (pts <= 7) {
      return {
        level: 'Висока нікотинова залежність',
        color: 'text-orange-400',
        borderColor: 'border-orange-500/30',
        bg: 'bg-orange-500/10',
        summary: 'Глибока фізіологічна адаптація організму. Тіло сприймає нікотин як обов’язковий елемент клітинного метаболізму.',
        neurobiology: 'Хронічна десенсибілізація холінорецепторів. Різка відміна викликає виражений вегетативний синдром абстиненції (пітливість, коливання тиску, гостра тривожність).',
        recommendation: 'Не покладайтеся лише на силу волі. Рекомендується скласти покроковий план, при потребі проконсультуватися з лікарем щодо НЗТ або варенікліну, обов’язково нормалізувати сон та вживати вітаміни групи B і магній.'
      };
    }
    return {
      level: 'Дуже висока залежність',
      color: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      bg: 'bg-rose-500/10',
      summary: 'Максимальна біохімічна прив’язаність. Тіло практично не функціонує без регулярних ударних доз нікотину.',
      neurobiology: 'Масивне розростання нікотинових рецепторів. Повна нормалізація рецепторного апарату триває від 6 до 12 тижнів чистоти.',
      recommendation: 'Кожен день без сигарет для вас — це подвиг і велика перемога. Використовуйте щоденник станів, підтримку близьких, професійну медичну допомогу та щохвилинний таймер подолання гострої кризи.'
    };
  };

  const interp = getFagerstromInterpretation(score);

  return (
    <div className="space-y-4">
      {/* Header and status */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-100">Тест Фагерстрема на нікотинову залежність</span>
            {savedResultDate && (
              <span className="text-[10px] text-zinc-400 font-mono">({savedResultDate})</span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Відповідей: <span className="font-mono text-zinc-200">{answeredCount}/{totalQuestions}</span>
            {isComplete && <span> · Результат: <strong className={interp.color}>{score} з 10 балів</strong></span>}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
          title="Скинути відповіді та пройти заново"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Пройти заново</span>
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {FAGERSTROM_QUESTIONS.map((q) => {
          const selectedPoints = answers[q.id];
          return (
            <div key={q.id} className="p-3.5 rounded-xl bg-[#1c1c24]/90 border border-zinc-800/70 space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {q.id}
                </span>
                <div>
                  <h5 className="text-xs font-semibold text-zinc-200 leading-snug">
                    {q.question}
                  </h5>
                  {q.hint && (
                    <p className="text-[10px] text-zinc-500 italic mt-0.5">
                      {q.hint}
                    </p>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 pl-7">
                {q.options.map((opt, oIdx) => {
                  const isSelected = selectedPoints === opt.points;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(q.id, opt.points)}
                      className={`p-2 rounded-lg text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-2 border ${
                        isSelected
                          ? 'bg-purple-500/15 border-purple-500/50 text-purple-200 font-medium'
                          : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                      }`}
                    >
                      <span>{opt.text}</span>
                      <span className="text-[10px] font-mono px-1 rounded bg-zinc-800/60 text-zinc-400 shrink-0">
                        +{opt.points} б.
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Result Section */}
      {isComplete ? (
        <div className={`p-4 rounded-2xl border ${interp.borderColor} ${interp.bg} space-y-3.5 animate-fadeIn`}>
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <div className="flex items-center gap-2.5">
              <Award className={`w-6 h-6 ${interp.color}`} />
              <div>
                <h4 className="text-sm font-extrabold text-zinc-100 flex items-center gap-2">
                  <span>Рівень:</span>
                  <span className={interp.color}>{interp.level}</span>
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Сума балів: <strong className="text-zinc-200">{score}</strong> з 10 можливих
                </p>
              </div>
            </div>

            {/* Score visual bar */}
            <div className="w-28 text-right">
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    score <= 4 ? 'bg-emerald-500' : score <= 7 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, (score / 10) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {score <= 2 ? 'Мінімум' : score <= 4 ? 'Помірно' : score <= 7 ? 'Високо' : 'Критично'}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs leading-relaxed text-zinc-300">
            <div>
              <strong className="text-zinc-100 block mb-0.5">Що це означає:</strong>
              <p className="text-zinc-400">{interp.summary}</p>
            </div>
            <div>
              <strong className="text-zinc-100 block mb-0.5">Нейрофізіологічний стан мозку:</strong>
              <p className="text-zinc-400">{interp.neurobiology}</p>
            </div>
            <div>
              <strong className="text-emerald-400 block mb-0.5">Персональна стратегія свободи:</strong>
              <p className="text-zinc-300">{interp.recommendation}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-center text-xs text-zinc-500">
          Дайте відповіді на всі 6 запитань, щоб отримати повний розрахунок та персоналізований аналіз.
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* 2. ШКАЛА ХОРНА (18 ТВЕРДЖЕНЬ — 6 МОТИВІВ ПАЛІННЯ)                         */
/* ========================================================================= */

interface HornItem {
  id: string;
  num: number;
  factor: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  text: string;
}

const HORN_STATEMENTS: HornItem[] = [
  { id: 'h1', num: 1, factor: 'A', text: 'Я курю, щоб підтримувати себе в тонусі, підбадьоритися та зібратися з силами.' },
  { id: 'h2', num: 2, factor: 'B', text: 'Мені подобається сам процес: тримати сигарету в руках, крутити запальничку, попільничку.' },
  { id: 'h3', num: 3, factor: 'C', text: 'Куріння приносить мені фізичне задоволення та допомагає приємно розслабитися.' },
  { id: 'h4', num: 4, factor: 'D', text: 'Я беруся за сигарету, коли я роздратований(-а), засмучений(-а) або відчуваю злість.' },
  { id: 'h5', num: 5, factor: 'E', text: 'Коли сигарети закінчуються, я відчуваю гостру тривогу і непереборний внутрішній поклик.' },
  { id: 'h6', num: 6, factor: 'F', text: 'Я часто закурюю автоматично, навіть не помічаючи, як сигарета опинилася запаленою.' },
  { id: 'h7', num: 7, factor: 'A', text: 'Сигарета допомагає мені зосередитися на складній задачі або повернутися до роботи.' },
  { id: 'h8', num: 8, factor: 'B', text: 'Сам естетичний ритуал діставання та запалювання сигарети приносить мені насолоду.' },
  { id: 'h9', num: 9, factor: 'C', text: 'Мені подобається затягуватися у моменти спокою, затишку та приємного відпочинку.' },
  { id: 'h10', num: 10, factor: 'D', text: 'Я курю, коли відчуваю нервове напруження, хвилювання чи будь-який стрес.' },
  { id: 'h11', num: 11, factor: 'E', text: 'Я чітко фізично відчуваю, коли рівень нікотину в тілі падає і з’являється «голод».' },
  { id: 'h12', num: 12, factor: 'F', text: 'Буває, що я помічаю вже запалену сигарету в попільничці, коли закурюю нову.' },
  { id: 'h13', num: 13, factor: 'A', text: 'Сигарета допомагає мені прокинутися вранці й розпочати день на повну силу.' },
  { id: 'h14', num: 14, factor: 'B', text: 'Процес пускання кілець диму та споглядання за його розсіюванням мене заворожує.' },
  { id: 'h15', num: 15, factor: 'C', text: 'Я найохочіше курю, коли мені добре і комфортно (за чашкою кави, після смачного обіду).' },
  { id: 'h16', num: 16, factor: 'D', text: 'Куріння допомагає мені заглушити почуття образи, пригніченості чи глибокої нудьги.' },
  { id: 'h17', num: 17, factor: 'E', text: 'Без сигарет я відчуваю справжній фізичний дискомфорт, тремтіння або спазми.' },
  { id: 'h18', num: 18, factor: 'F', text: 'Я часто запалюю сигарету за звичкою на автопілоті, хоча бажання курити не було.' }
];

const HORN_FACTOR_NAMES: Record<string, { title: string; desc: string; icon: string }> = {
  A: { title: 'Стимуляція', desc: 'Куріння як допінг для підтримки бадьорості та працездатності', icon: '⚡' },
  B: { title: 'Гра / Ритуал', desc: 'Тактильне задоволення від предметів, жестів та споглядання диму', icon: '🎭' },
  C: { title: 'Розслаблення / Гедонізм', desc: 'Куріння заради комфорту, смаку, затишку та додаткового задоволення', icon: '☕' },
  D: { title: 'Зниження стресу', desc: 'Куріння як емоційний милиця при тривозі, гніві та напруженні', icon: '🛡️' },
  E: { title: 'Фізична тяга', desc: 'Гостра біохімічна потреба у відновленні рівня нікотину', icon: '🧬' },
  F: { title: 'Звичка / Автоматизм', desc: 'Неусвідомлене паління за сформованим моторним шаблоном', icon: '🔄' }
};

export const HornTestPanel: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}horn_answers`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const total = HORN_STATEMENTS.length;
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === total;

  const handleRate = (num: number, val: number) => {
    const nextAnswers = { ...answers, [num]: val };
    setAnswers(nextAnswers);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}horn_answers`, JSON.stringify(nextAnswers));
    } catch {}
  };

  const handleReset = () => {
    setAnswers({});
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}horn_answers`);
    } catch {}
  };

  // Calculate scores per factor
  // A: 1 + 7 + 13
  // B: 2 + 8 + 14
  // C: 3 + 9 + 15
  // D: 4 + 10 + 16
  // E: 5 + 11 + 17
  // F: 6 + 12 + 18
  const factorScores = {
    A: (answers[1] || 0) + (answers[7] || 0) + (answers[13] || 0),
    B: (answers[2] || 0) + (answers[8] || 0) + (answers[14] || 0),
    C: (answers[3] || 0) + (answers[9] || 0) + (answers[15] || 0),
    D: (answers[4] || 0) + (answers[10] || 0) + (answers[16] || 0),
    E: (answers[5] || 0) + (answers[11] || 0) + (answers[17] || 0),
    F: (answers[6] || 0) + (answers[12] || 0) + (answers[18] || 0)
  };

  const getFactorAdvice = (fKey: string, score: number) => {
    if (score < 7) return null;
    const isDominant = score >= 11;
    switch (fKey) {
      case 'A':
        return {
          status: isDominant ? 'Провідний мотив' : 'Помірний мотив',
          mechanism: 'Нікотин штучно викидає норадреналін та адреналін, створюючи ілюзію бадьорості.',
          alternatives: 'Контрастний душ вранці, зелений чай матча, швидка ходьба сходами, холодна вода з лимоном.'
        };
      case 'B':
        return {
          status: isDominant ? 'Провідний мотив' : 'Помірний мотив',
          mechanism: 'Тактильна орально-мануальна фіксація. Рукам і губам потрібна зайнятість.',
          alternatives: 'Кишеньковий еспандер, чотки, стилус, зубочистки з корицею, кубик антистрес, малювання ліній.'
        };
      case 'C':
        return {
          status: isDominant ? 'Провідний мотив' : 'Помірний мотив',
          mechanism: 'Паління асоціюється з нагородою або паузою у справах.',
          alternatives: 'Свіжозаварений трав’яний чай, прослуховування 1 улюбленого треку в тиші, смачний перекус, розтяжка.'
        };
      case 'D':
        return {
          status: isDominant ? 'Провідний мотив' : 'Помірний мотив',
          mechanism: 'Хибний зв’язок: глибокі вдихи під час паління заспокоювали, а нікотин лише посилював тривогу.',
          alternatives: 'Діафрагмальне дихання (вдих 4с, затримка 4с, видих 6с), техніка заземлення 5-4-3-2-1, вмивання крижаною водою.'
        };
      case 'E':
        return {
          status: isDominant ? 'Провідний мотив' : 'Помірний мотив',
          mechanism: 'Справжня хімічна залежність та спад концентрації речовини в крові.',
          alternatives: 'Тяга триває хвилеподібно по 3–5 хвилин. Пийте воду маленькими ковтками, застосуйте кнопку SOS у додатку.'
        };
      case 'F':
        return {
          status: isDominant ? 'Провідний мотив' : 'Помірний мотив',
          mechanism: 'Нейронний шлях «тригер → дія». Рука тягнеться без участі свідомості.',
          alternatives: 'Змініть звичні маршрути, приберіть усі попільнички, змініть руку, якою тримаєте чашку з кавою, використовуйте нагадування.'
        };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and status */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Шкала мотивів куріння Деніела Хорна</h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Відповідей: <span className="font-mono text-zinc-200">{answeredCount}/{total}</span>
            {isComplete && <span className="text-emerald-400 font-medium"> · Усі мотиви прораховано</span>}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Скинути</span>
        </button>
      </div>

      {/* Scale guide */}
      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60 text-[11px] text-zinc-400 flex items-center justify-between gap-2 overflow-x-auto">
        <span className="shrink-0 font-medium text-zinc-300">Оцінка:</span>
        <span className="shrink-0">1 — Ніколи</span>
        <span className="shrink-0">2 — Рідко</span>
        <span className="shrink-0">3 — Іноді</span>
        <span className="shrink-0">4 — Часто</span>
        <span className="shrink-0">5 — Завжди</span>
      </div>

      {/* Statements List */}
      <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
        {HORN_STATEMENTS.map((item) => {
          const val = answers[item.num];
          return (
            <div key={item.id} className="p-3 rounded-xl bg-[#1c1c24]/90 border border-zinc-800/70 space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {item.num}
                </span>
                <p className="text-xs text-zinc-200 leading-snug">
                  {item.text}
                </p>
              </div>

              {/* 1-5 rating buttons */}
              <div className="flex items-center justify-between gap-1 pl-7">
                {[1, 2, 3, 4, 5].map((rate) => {
                  const isChecked = val === rate;
                  return (
                    <button
                      key={rate}
                      onClick={() => handleRate(item.num, rate)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-purple-500/25 border-purple-500 text-purple-200 shadow-xs'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                      }`}
                    >
                      {rate}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Results Analysis */}
      {isComplete ? (
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-purple-500/30 space-y-4 animate-fadeIn">
          <div className="border-b border-zinc-800 pb-2.5">
            <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Ваш психологічний профіль паління за Хорном</span>
            </h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              11+ балів — головний провідний мотив; 7–10 — додатковий фактор; до 6 — слабкий вплив.
            </p>
          </div>

          {/* Factor bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(['A', 'B', 'C', 'D', 'E', 'F'] as const).map((key) => {
              const sc = factorScores[key];
              const fInfo = HORN_FACTOR_NAMES[key];
              const isDominant = sc >= 11;
              const isModerate = sc >= 7 && sc < 11;
              return (
                <div key={key} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                      <span>{fInfo.icon}</span>
                      <span>{fInfo.title}</span>
                    </span>
                    <span className="font-mono font-bold">
                      <span className={isDominant ? 'text-purple-400' : isModerate ? 'text-amber-400' : 'text-zinc-400'}>
                        {sc}
                      </span>
                      <span className="text-zinc-600 text-[10px]"> / 15</span>
                    </span>
                  </div>

                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDominant ? 'bg-purple-500' : isModerate ? 'bg-amber-500' : 'bg-zinc-600'
                      }`}
                      style={{ width: `${Math.min(100, (sc / 15) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-zinc-400 truncate max-w-[170px]">{fInfo.desc}</span>
                    <span className={`font-medium ${isDominant ? 'text-purple-400' : isModerate ? 'text-amber-400' : 'text-zinc-500'}`}>
                      {isDominant ? 'Провідний' : isModerate ? 'Помірний' : 'Слабкий'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep personalized interpretation for active factors */}
          <div className="pt-2 border-t border-zinc-800 space-y-3">
            <h5 className="text-xs font-bold text-zinc-200">
              Персоналізовані рекомендації під ваші провідні мотиви:
            </h5>
            <div className="space-y-2.5">
              {(['A', 'B', 'C', 'D', 'E', 'F'] as const).map((key) => {
                const sc = factorScores[key];
                const adv = getFactorAdvice(key, sc);
                if (!adv) return null;
                const fInfo = HORN_FACTOR_NAMES[key];
                return (
                  <div key={key} className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-zinc-100 flex items-center gap-1.5">
                        <span>{fInfo.icon}</span>
                        <span>{fInfo.title}</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300">
                        {adv.status} ({sc} б.)
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      <span className="text-zinc-300 font-medium">Чому так:</span> {adv.mechanism}
                    </p>
                    <p className="text-emerald-300 text-[11px] leading-relaxed pt-0.5">
                      <span className="font-medium text-emerald-400">Чим замінити:</span> {adv.alternatives}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-center text-xs text-zinc-500">
          Оцініть усі 18 тверджень шкали Хорна, щоб сформувати повну психологічну карту ваших мотивів.
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* 3. ТЕСТ РІЧМОНДА (ГОТОВНІСТЬ ДО ВІДМОВИ ВІД ТЮТЮНУ)                         */
/* ========================================================================= */

interface RichmondQuestion {
  id: number;
  question: string;
  options: { text: string; points: number }[];
}

const RICHMOND_QUESTIONS: RichmondQuestion[] = [
  {
    id: 1,
    question: 'Чи хотіли б ви кинути курити, якби це не вимагало жодних зусиль (чарівна паличка)?',
    options: [
      { text: 'Так, безумовно', points: 1 },
      { text: 'Ні, мені подобається курити', points: 0 }
    ]
  },
  {
    id: 2,
    question: 'Наскільки сильне ваше особисте внутрішнє бажання позбутися куріння назавжди?',
    options: [
      { text: 'Дуже сильне, це мій найвищий пріоритет', points: 3 },
      { text: 'Помірне, розумію користь, але є страхи', points: 2 },
      { text: 'Слабке, просто «треба б колись»', points: 1 },
      { text: 'Зовсім не маю бажання кидати', points: 0 }
    ]
  },
  {
    id: 3,
    question: 'Чи плануєте ви спробувати кинути курити протягом найближчих 2 тижнів?',
    options: [
      { text: 'Обов’язково / Я вже кинув і не курю прямо зараз', points: 3 },
      { text: 'Цілком імовірно, готуюся до цього', points: 2 },
      { text: 'Навряд чи, зараз не найкращий момент', points: 1 },
      { text: 'Точно ні, навіть не планую', points: 0 }
    ]
  },
  {
    id: 4,
    question: 'Яка ймовірність того, що через 6 місяців ви будете повністю вільними від тютюну?',
    options: [
      { text: 'Висока (71–100%) — я налаштований(-а) рішуче', points: 3 },
      { text: 'Середня (31–70%) — маю надію, хоч і побоююся зриву', points: 2 },
      { text: 'Низька (11–30%) — надто часто зривався(-лася)', points: 1 },
      { text: 'Мінімальна (0–10%) — не вірю в такий результат', points: 0 }
    ]
  }
];

export const RichmondTestPanel: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}richmond_answers`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const total = RICHMOND_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === total;

  const score = Object.values(answers).reduce((acc, p) => acc + p, 0);

  const handleSelect = (qId: number, points: number) => {
    const nextAnswers = { ...answers, [qId]: points };
    setAnswers(nextAnswers);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}richmond_answers`, JSON.stringify(nextAnswers));
    } catch {}
  };

  const handleReset = () => {
    setAnswers({});
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}richmond_answers`);
    } catch {}
  };

  const getRichmondAnalysis = (pts: number) => {
    if (pts <= 5) {
      return {
        level: 'Низька мотивація',
        stage: 'Стадія міркування (Contemplation)',
        color: 'text-amber-400',
        borderColor: 'border-amber-500/30',
        bg: 'bg-amber-500/10',
        explanation: 'Бажання кинути є радше абстрактним або навіяним ззовні (прохання рідних, ціна сигарет), але всередині ви все ще чіпляєтеся за ілюзорні вигоди куріння.',
        focus: 'Не змушуйте себе через силу. Сфокусуйтеся на підрахунку заощаджених грошей, перегляньте шкали регенерації органів за ВООЗ, випишіть власні 10 причин відмови в розділі «Причини».'
      };
    }
    if (pts <= 7) {
      return {
        level: 'Помірна мотивація',
        stage: 'Стадія підготовки (Preparation)',
        color: 'text-sky-400',
        borderColor: 'border-sky-500/30',
        bg: 'bg-sky-500/10',
        explanation: 'Ви усвідомили шкоду тютюну і прагнете змін, однак зберігається страх «як жити без сигарети при стресі чи на святах». Це нормальний перехідний стан.',
        focus: 'Приберіть тригери: запальнички, попільнички, уникайте компаній курців на першому тижні. Завчасно оберіть альтернативу нікотину під час кризи (кнопка SOS, вода, дихальні практики).'
      };
    }
    return {
      level: 'Висока мотивація та готовність',
      stage: 'Стадія активних дій (Action / Maintenance)',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      explanation: 'Ви психологічно дозріли до повної свободи від диму. У вас є потужний внутрішній стимул, який переважає будь-які хвилинні спокуси.',
      focus: 'Чудовий стан! Фіксуйте кожен чистий день у лічильнику. Використовуйте щоденник вдячності, відзначайте покращення дихання та смакових відчуттів. Шанс на довічну свободу перевищує 85%!'
    };
  };

  const analysis = getRichmondAnalysis(score);

  return (
    <div className="space-y-4">
      {/* Header and status */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">Тест Річмонда: готовність кинути курити</h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Відповідей: <span className="font-mono text-zinc-200">{answeredCount}/{total}</span>
            {isComplete && <span> · Результат: <strong className={analysis.color}>{score} з 10 балів</strong></span>}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Скинути</span>
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {RICHMOND_QUESTIONS.map((q) => {
          const selected = answers[q.id];
          return (
            <div key={q.id} className="p-3.5 rounded-xl bg-[#1c1c24]/90 border border-zinc-800/70 space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {q.id}
                </span>
                <h5 className="text-xs font-semibold text-zinc-200 leading-snug">
                  {q.question}
                </h5>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-7">
                {q.options.map((opt, idx) => {
                  const isChecked = selected === opt.points;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(q.id, opt.points)}
                      className={`p-2 rounded-lg text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-2 border ${
                        isChecked
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200 font-medium'
                          : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                      }`}
                    >
                      <span>{opt.text}</span>
                      <span className="text-[10px] font-mono px-1 rounded bg-zinc-800/60 text-zinc-400 shrink-0">
                        +{opt.points} б.
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Result Section */}
      {isComplete ? (
        <div className={`p-4 rounded-2xl border ${analysis.borderColor} ${analysis.bg} space-y-3 animate-fadeIn`}>
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <div className="flex items-center gap-2.5">
              <Target className={`w-6 h-6 ${analysis.color}`} />
              <div>
                <h4 className="text-sm font-extrabold text-zinc-100 flex items-center gap-2">
                  <span>Мотивація:</span>
                  <span className={analysis.color}>{analysis.level}</span>
                </h4>
                <p className="text-[11px] text-zinc-400">
                  {analysis.stage} · {score} з 10 балів
                </p>
              </div>
            </div>

            <div className="w-28 text-right">
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    score <= 5 ? 'bg-amber-500' : score <= 7 ? 'bg-sky-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (score / 10) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {score <= 5 ? 'Низька' : score <= 7 ? 'Помірна' : 'Висока'}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs leading-relaxed text-zinc-300">
            <div>
              <strong className="text-zinc-100 block mb-0.5">Клінічний стан готовності:</strong>
              <p className="text-zinc-400">{analysis.explanation}</p>
            </div>
            <div>
              <strong className="text-emerald-400 block mb-0.5">Рекомендований фокус дій:</strong>
              <p className="text-zinc-300">{analysis.focus}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-center text-xs text-zinc-500">
          Дайте відповіді на 4 запитання тесту Річмонда для оцінки готовності кинути курити.
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* 4. ТЕСТ НА ОБʼЄМ ТА ВИТРИВАЛІСТЬ ЛЕГЕНЬ (ПРОБА ШТАНГЕ + РОЗРАХУНОК ЖЄЛ)    */
/* ========================================================================= */

interface StangeHistoryItem {
  id: string;
  timestamp: number;
  dateStr: string;
  seconds: number;
}

export const LungsTestPanel: React.FC = () => {
  const [history, setHistory] = useState<StangeHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}stange_history`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [testState, setTestState] = useState<'idle' | 'prep' | 'running' | 'done'>('idle');
  const [prepCount, setPrepCount] = useState<number>(3);
  const [elapsed, setElapsed] = useState<number>(0);

  // Vital capacity calculation parameters
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(30);
  const [height, setHeight] = useState<number>(175);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Save history
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}stange_history`, JSON.stringify(history));
    } catch {}
  }, [history]);

  // Handle prep countdown
  useEffect(() => {
    if (testState !== 'prep') return;
    if (prepCount > 0) {
      const t = setTimeout(() => {
        setPrepCount((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(t);
    } else {
      setTestState('running');
      setElapsed(0);
      startTimeRef.current = performance.now();
    }
  }, [testState, prepCount]);

  // Handle running stopwatch
  useEffect(() => {
    if (testState !== 'running') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      const diffSec = (performance.now() - startTimeRef.current) / 1000;
      setElapsed(diffSec);
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testState]);

  const handleStart = () => {
    setPrepCount(3);
    setTestState('prep');
    setElapsed(0);
  };

  const handleStop = () => {
    const finalSeconds = Math.round(elapsed * 10) / 10;
    setElapsed(finalSeconds);
    setTestState('done');

    const newResult: StangeHistoryItem = {
      id: `stange-${Date.now()}`,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      seconds: finalSeconds
    };

    setHistory((prev) => [newResult, ...prev.slice(0, 9)]);
  };

  const handleReset = () => {
    setTestState('idle');
    setElapsed(0);
  };

  const evaluateStange = (sec: number) => {
    if (sec < 20) {
      return {
        label: 'Знижена ємність',
        color: 'text-amber-400',
        badgeBg: 'bg-amber-500/10 border-amber-500/30',
        explanation: 'Типовий результат при стажі куріння або перших днях відмови. Війчастий епітелій бронхів паралізований смолами, киснева дифузія в альвеолах суттєво уповільнена.',
        action: 'Виконуйте техніку повільного видиху крізь зімкнуті губи, робіть прогулянки на свіжому повітрі та пийте теплу воду для полегшення відхаркування слизу.'
      };
    }
    if (sec < 35) {
      return {
        label: 'Задовільно',
        color: 'text-sky-400',
        badgeBg: 'bg-sky-500/10 border-sky-500/30',
        explanation: 'Помітний прогрес регенерації. Рівень чадного газу (CO) в крові впав до нуля, гемоглобін на 100% звільнився для зв’язування кисню.',
        action: 'Додайте ранкову дихальну гімнастику: 10 глибоких діафрагмальних вдихів на повні груди з видихом у 2 рази довшим за вдих.'
      };
    }
    if (sec < 50) {
      return {
        label: 'Добре (Норма здорової людини)',
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
        explanation: 'Відмінна життєва ємність легень! Бронхіальне дерево повністю очистилося від тютюнового дьогтю, життєвий об’єм легень зріс на 15–30%.',
        action: 'Ваша дихальна та серцево-судинна системи працюють у фізіологічній нормі некурця. Підтримуйте витривалість аеробним бігом, плаванням чи велосипедом.'
      };
    }
    return {
      label: 'Відмінно (Рівень спортсмена)',
      color: 'text-teal-300',
      badgeBg: 'bg-teal-500/10 border-teal-500/30',
      explanation: 'Виняткова витривалість легеневої тканини та висока стійкість мозку до гіпоксії. Повна компенсація кисневого голоду.',
      action: 'Ваші легені повністю відновили свою природну еластичність та максимальний об’єм газообміну.'
    };
  };

  // Vital capacity calculation using Baldwin formula
  // Men: VC = 0.052 * height - 0.022 * age - 3.60 (Liters)
  // Women: VC = 0.041 * height - 0.018 * age - 2.69 (Liters)
  const calcVitalCapacity = () => {
    let vc = 0;
    if (gender === 'male') {
      vc = 0.052 * height - 0.022 * age - 3.6;
    } else {
      vc = 0.041 * height - 0.018 * age - 2.69;
    }
    return Math.max(1.8, Math.round(vc * 100) / 100);
  };

  const currentEval = evaluateStange(elapsed);

  return (
    <div className="space-y-4">
      {/* 1. Interactive Stange Test */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-3.5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
              <Activity className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-zinc-100">Проба Штанге: витривалість легень</h4>
              <p className="text-[11px] text-zinc-400">
                Затримка дихання після повного вдиху (секундомір)
              </p>
            </div>
          </div>
          {testState !== 'idle' && (
            <button
              onClick={handleReset}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Скинути</span>
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-zinc-300 bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/70 space-y-1">
          <p className="font-semibold text-zinc-200">Як правильно робити тест:</p>
          <ol className="list-decimal pl-4 space-y-0.5 text-zinc-400 text-[11px]">
            <li>Сядьте рівно, розслабтеся, зробіть 2–3 спокійних вдихи й видихи.</li>
            <li>Зробіть глибокий вдих на 80–90% об’єму легень і затисніть ніс.</li>
            <li>Натисніть <strong>«Почати тест»</strong> і затримайте дихання.</li>
            <li>При появі непереборного бажання вдихнути натисніть <strong>«Зупинити»</strong>.</li>
          </ol>
        </div>

        {/* Stopwatch display */}
        <div className="p-5 rounded-2xl bg-[#14141a] border border-cyan-500/20 text-center space-y-2">
          {testState === 'prep' && (
            <div className="animate-pulse">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest block">
                Приготуйтеся, глибокий вдих...
              </span>
              <span className="text-4xl font-extrabold text-cyan-300 font-mono">
                {prepCount}
              </span>
            </div>
          )}

          {testState !== 'prep' && (
            <div>
              <span className="text-5xl font-extrabold font-mono text-zinc-100 tracking-tight">
                {elapsed.toFixed(1)}
                <span className="text-base text-zinc-500 font-sans ml-1">сек</span>
              </span>
              {testState === 'running' && (
                <div className="text-[11px] text-cyan-400 font-medium animate-pulse mt-1">
                  ⏱️ Тримайте подих, легені регенерують...
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex justify-center gap-2">
            {testState === 'idle' && (
              <button
                onClick={handleStart}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all cursor-pointer active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Почати тест (3-2-1)</span>
              </button>
            )}

            {testState === 'running' && (
              <button
                onClick={handleStop}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/25 transition-all cursor-pointer active:scale-95 animate-pulse"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Зупинити та зафіксувати</span>
              </button>
            )}

            {testState === 'done' && (
              <button
                onClick={handleStart}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Пройти ще раз</span>
              </button>
            )}
          </div>
        </div>

        {/* Result Evaluation Card */}
        {testState === 'done' && elapsed > 0 && (
          <div className={`p-4 rounded-xl border ${currentEval.badgeBg} space-y-2 animate-fadeIn`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-100 flex items-center gap-2">
                <span>Оцінка:</span>
                <span className={currentEval.color}>{currentEval.label}</span>
              </span>
              <span className="text-xs font-mono font-bold text-zinc-200">
                {elapsed} с
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {currentEval.explanation}
            </p>
            <div className="pt-1 border-t border-zinc-800/60 text-xs text-emerald-300">
              <strong className="text-emerald-400">Рекомендація: </strong>
              {currentEval.action}
            </div>
          </div>
        )}

        {/* History table */}
        {history.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-bold text-zinc-300 block">
              Історія останніх вимірювань:
            </span>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {history.map((h, i) => (
                <div key={h.id || i} className="p-2 rounded-lg bg-zinc-950/40 border border-zinc-800/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 text-[11px]">{h.dateStr}</span>
                  <span className="text-cyan-400 font-bold">{h.seconds} с</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Vital Capacity Calculator (Розрахунок належної ЖЄЛ) */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-3">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2.5">
          <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
            <HeartPulse className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-zinc-100">Розрахунок належної ЖЄЛ (Життєва Ємність Легень)</h4>
            <p className="text-[11px] text-zinc-400">
              Теоретичний обʼєм легень за медичною формулою Болдуіна-Ентоні
            </p>
          </div>
        </div>

        {/* Parameters input */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Стать:</label>
            <div className="flex rounded-lg bg-zinc-950 border border-zinc-800 p-0.5">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  gender === 'male' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400'
                }`}
              >
                Чоловік
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  gender === 'female' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400'
                }`}
              >
                Жінка
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Вік (років):</label>
            <input
              type="number"
              min={14}
              max={100}
              value={age}
              onChange={(e) => setAge(Math.max(14, Math.min(100, Number(e.target.value) || 30)))}
              className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Зріст (см):</label>
            <input
              type="number"
              min={120}
              max={230}
              value={height}
              onChange={(e) => setHeight(Math.max(120, Math.min(230, Number(e.target.value) || 175)))}
              className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Output */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/20 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-zinc-400 block">Ваша розрахункова фізіологічна ЖЄЛ:</span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono">
              {calcVitalCapacity()} літрів
            </span>
          </div>
          <div className="text-right text-[11px] text-zinc-400 max-w-[200px]">
            Куріння зменшує корисний об’єм на <strong>15–25%</strong> через хронічний бронхоспазм. При відмові об’єм поступово відновлюється на <strong>100%</strong> за 3–9 місяців.
          </div>
        </div>
      </div>
    </div>
  );
};
