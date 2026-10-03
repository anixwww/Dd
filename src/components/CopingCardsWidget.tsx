import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Check, Bookmark, Heart, ShieldAlert, BookOpen } from 'lucide-react';

interface CopingCard {
  id: number;
  emoji: string;
  title: string;
  text: string;
  scienceFact: string;
}

const COPING_CARDS: CopingCard[] = [
  {
    id: 1,
    emoji: '⏳',
    title: 'Правило 3-х хвилин',
    text: 'Гостре бажання закурити — це не вічне відчуття, а короткий хімічний сплеск. Він досягає піку за 3 хвилини й повністю згасає за 5 хвилин, якщо не піддатися паніці.',
    scienceFact: 'Дослідження доводять: якщо перемкнути увагу в перші 180 секунд, інтенсивність потягу спадає на 85%.'
  },
  {
    id: 2,
    emoji: '🌬️',
    title: 'Кисневий детокс',
    text: 'Твоєму мозку бракувало не нікотину, а саме глибокого дихання! Під час куріння ти робив глибокі затяжки, які розслабляли діафрагму. Зроби 3 повільні глибокі вдихи чистим повітрям.',
    scienceFact: 'Глибоке діафрагмальне дихання насичує кров киснем та знижує пульс, зупиняючи викид адреналіну.'
  },
  {
    id: 3,
    emoji: '🧠',
    title: 'Дофамінова пастка',
    text: 'Твій мозок намагається обдурити тебе, кажучи: "сигарета заспокоїть". Насправді нікотин спочатку штучно викликає тривогу через абстиненцію, а потім знімає її. Сигарета лікує ту тривогу, яку сама ж і викликала!',
    scienceFact: 'Коли ти терпиш тягу, твої дофамінові рецептори повертаються до природного здорового стану.'
  },
  {
    id: 4,
    emoji: '🩸',
    title: 'Очищення чадного газу',
    text: 'Уже через 12 годин без сигарет рівень чадного газу (CO) у твоїй крові падає до абсолютної норми здорової людини. Твоє серце нарешті отримує чисту, багату на кисень кров.',
    scienceFact: 'Зниження рівня CO миттєво знижує навантаження на серцевий м\'яз і судини.'
  },
  {
    id: 5,
    emoji: '💧',
    title: 'Заміна ритуалу блукаючого нерва',
    text: 'Коли відчуваєш сильний позив, випий склянку холодної води повільними, дрібними ковтками. Ковтальний рефлекс у поєднанні з прохолодою подразнює блукаючий нерв і миттєво перебиває нікотиновий сигнал у мозку.',
    scienceFact: 'Блукаючий нерв активує парасимпатичну систему, яка миттєво вмикає режим біологічного релаксу.'
  },
  {
    id: 6,
    emoji: '💸',
    title: 'Твоя фінансова свобода',
    text: 'Кожна некуплена пачка — це не просто збережені гроші, а твій особистий бойкот тютюновим корпораціям. Ти більше не платиш мільярди за руйнування власного здоров\'я.',
    scienceFact: 'Людина, що кинула курити, заощаджує в середньому від 25 000 до 40 000 ₴ щороку.'
  },
  {
    id: 7,
    emoji: '🛡️',
    title: 'Пробудження війкових клітин',
    text: 'Твої легені прямо зараз проводять генеральне прибирання! Легеневі війки, які раніше були паралізовані гарячими смолами, прокинулися і вимітають накопичений бруд.',
    scienceFact: 'Війковий епітелій повністю відновлює свою очисну функцію вже за перші 2-3 тижні свободи.'
  },
  {
    id: 8,
    emoji: '🏆',
    title: 'Кожна відмова — це перемога',
    text: 'Щоразу, коли ти кажеш "Ні" сигареті під час гострої тяги, ти буквально руйнуєш старі нікотинові нейронні шляхи та будуєш нові, здорові зв\'язки.',
    scienceFact: 'Мозок повністю перебудовує свою нейронну карту та стирає нікотиновий автоматизм за 21–60 днів.'
  }
];

export const CopingCardsWidget: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const [savedCards, setSavedCards] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('quit-smoking:saved-coping-cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const activeCard = COPING_CARDS[currentIndex];

  const handleNext = () => {
    setShowFact(false);
    setCurrentIndex((prev) => (prev + 1) % COPING_CARDS.length);
  };

  const handlePrev = () => {
    setShowFact(false);
    setCurrentIndex((prev) => (prev - 1 + COPING_CARDS.length) % COPING_CARDS.length);
  };

  const toggleSaveCard = (id: number) => {
    const updated = savedCards.includes(id)
      ? savedCards.filter((cardId) => cardId !== id)
      : [...savedCards, id];
    setSavedCards(updated);
    try {
      localStorage.setItem('quit-smoking:saved-coping-cards', JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#18181f]/90 border border-zinc-800/80 shadow-xs space-y-4 select-none backdrop-blur-xl text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700/60 text-rose-400 flex items-center justify-center text-sm shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider font-mono">
              Когнітивні картки стійкості
            </h3>
            <p className="text-[11px] text-zinc-400 font-mono">
              Картка {currentIndex + 1} з {COPING_CARDS.length}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleSaveCard(activeCard.id)}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            savedCards.includes(activeCard.id)
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
          title={savedCards.includes(activeCard.id) ? 'Збережено в обране' : 'Додати в обране'}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Main Card View */}
      <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800/80 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{activeCard.emoji}</span>
          <h4 className="text-sm font-bold text-zinc-100">
            {activeCard.title}
          </h4>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed font-normal">
          {activeCard.text}
        </p>

        {showFact ? (
          <div className="p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/60 text-[11px] text-zinc-300 leading-relaxed animate-fade-in font-mono">
            <span className="text-emerald-400 font-bold">🔬 Науковий факт: </span>
            {activeCard.scienceFact}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowFact(true)}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono font-bold cursor-pointer inline-flex items-center gap-1"
          >
            <span>Чому це працює біологічно?</span>
            <Sparkles className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={handlePrev}
          className="flex-1 py-2 px-3 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-xl text-xs font-semibold font-mono border border-zinc-700/70 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Попередня</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex-1 py-2 px-3 bg-zinc-800 hover:bg-zinc-750 text-zinc-100 rounded-xl text-xs font-semibold font-mono border border-zinc-700/70 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Наступна</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
