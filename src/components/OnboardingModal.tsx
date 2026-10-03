import React, { useState, useMemo } from 'react';
import {
  Calculator,
  User,
  Droplets,
  Activity,
  Moon,
  Brain,
  ChevronRight,
  ChevronLeft,
  Check,
  Flame,
  ShieldCheck,
  Sparkles,
  Wind,
  Dumbbell
} from 'lucide-react';
import { MoneySettings, DayRating, StateEntry, SleepLog } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (data: {
    userName: string;
    startDate: number;
    money: MoneySettings;
    mainReason: string;
  }) => void;
}

const getTodayKey = () => {
  const d = new Date();
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const todayStr = getTodayKey();
  const [currentStep, setCurrentStep] = useState<number>(1); // Step 1 to 6

  // ---------------------------------------------------------------------------
  // STEP 1: Дані для розрахунку витрат
  // ---------------------------------------------------------------------------
  const [perDay, setPerDay] = useState<string>('20');
  const [packPrice, setPackPrice] = useState<string>('100');
  const [packSize] = useState<string>('20');
  const [currency, setCurrency] = useState<'₴' | '$' | '€'>('₴');

  const numPerDay = Math.max(1, parseFloat(perDay) || 20);
  const numPrice = Math.max(100, parseFloat(packPrice) || 100);
  const numPackSize = Math.max(1, parseInt(packSize, 10) || 20);
  const costPerCig = numPrice / numPackSize;
  const monthlySaved = Math.round(numPerDay * costPerCig * 30.5);

  // ---------------------------------------------------------------------------
  // STEP 2: Фізичні характеристики
  // ---------------------------------------------------------------------------
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(175);
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [restingHeartRate, setRestingHeartRate] = useState<number>(72);
  const [bloodPressure, setBloodPressure] = useState<string>('120/80');

  const bmi = useMemo(() => {
    const hMeter = height / 100;
    if (hMeter <= 0) return 0;
    return Number((weight / (hMeter * hMeter)).toFixed(1));
  }, [weight, height]);

  const bmiAssessment = useMemo(() => {
    if (bmi < 18.5) return { text: 'Дефіцит ваги', color: 'text-amber-400' };
    if (bmi <= 24.9) return { text: 'Нормальна вага', color: 'text-emerald-400' };
    if (bmi <= 29.9) return { text: 'Надлишкова вага', color: 'text-orange-400' };
    return { text: 'Ожиріння', color: 'text-rose-400' };
  }, [bmi]);

  // ---------------------------------------------------------------------------
  // STEP 3: Вода (Гідратація до цього часу)
  // ---------------------------------------------------------------------------
  const [waterDrunk, setWaterDrunk] = useState<number>(500); // 500ml preset

  // ---------------------------------------------------------------------------
  // STEP 4: Фізична активність
  // ---------------------------------------------------------------------------
  const [stepGoal] = useState<number>(10000);
  const [actualSteps, setActualSteps] = useState<number>(3000);
  const [additionalActivity, setAdditionalActivity] = useState<string>('walk'); // walk, run, workout, stretch
  const [activityMinutes, setActivityMinutes] = useState<number>(20);

  // ---------------------------------------------------------------------------
  // STEP 5: Тривалість і якість сну
  // ---------------------------------------------------------------------------
  const [sleepBedTime, setSleepBedTime] = useState<string>('23:00');
  const [sleepWakeTime, setSleepWakeTime] = useState<string>('07:30');
  const [sleepDuration, setSleepDuration] = useState<number>(8.0);
  const [sleepQuality, setSleepQuality] = useState<number>(4);

  // ---------------------------------------------------------------------------
  // STEP 6: Детальний зріз стану
  // ---------------------------------------------------------------------------
  const [detEnergy, setDetEnergy] = useState<number>(3);
  const [detFocus, setDetFocus] = useState<number>(3);
  const [detCraving, setDetCraving] = useState<number>(2);
  const [detAnxiety, setDetAnxiety] = useState<number>(2);
  const [detBalance, setDetBalance] = useState<number>(3);
  const [detSymptoms, setDetSymptoms] = useState<string[]>([]);
  const [detNote, setDetNote] = useState<string>('');

  const toggleSymptom = (s: string) => {
    setDetSymptoms((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  if (!isOpen) return null;

  // Multi-step navigation
  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Onboarding completion and data compilation
  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();

    const d = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}`;

    // 1. Compile money settings
    const moneySettings: MoneySettings = {
      perDay: numPerDay,
      packPrice: numPrice,
      packSize: numPackSize,
      minutesPerCig: 7,
      cur: currency
    };

    try {
      // 2. Save Physio parameters (Step 2)
      localStorage.setItem('quit-smoking:physio-weight', String(weight));
      localStorage.setItem('quit-smoking:physio-height', String(height));
      localStorage.setItem('quit-smoking:physio-age', String(age));
      localStorage.setItem('quit-smoking:physio-gender', gender);
      localStorage.setItem('quit-smoking:physio-pulse', String(restingHeartRate));
      localStorage.setItem('quit-smoking:physio-pressure', bloodPressure);

      // 3. Save Hydration log (Step 3)
      localStorage.setItem(`quit-smoking:hydration-${todayStr}`, String(waterDrunk));

      // 4. Save Steps log (Step 4)
      localStorage.setItem(`quit-smoking:steps-${todayStr}`, String(actualSteps));

      // 5. Create sleep log object (Step 5)
      const sleepLog: SleepLog = {
        bedtime: sleepBedTime,
        wakeTime: sleepWakeTime,
        hours: sleepDuration,
        note: `Якість: ${sleepQuality}/5 (вказано при реєстрації)`
      };
      localStorage.setItem(`quit-smoking:sleep-${todayStr}`, JSON.stringify(sleepLog));

      // 6. Save Detailed Survey (Step 6)
      const detailedSurvey: StateEntry = {
        id: `onboarding_${Date.now()}`,
        time: timeStr,
        energy: detEnergy,
        sleepQuality: sleepQuality,
        focus: detFocus,
        craving: detCraving,
        anxiety: detAnxiety,
        balance: detBalance,
        mood: detBalance,
        note: detNote.trim() || (detSymptoms.length > 0 ? `Симптоми: ${detSymptoms.join(', ')}` : undefined),
        tags: detSymptoms
      };

      const daysMap: Record<string, DayRating> = {};
      daysMap[todayStr] = {
        sleep: sleepLog,
        surveys: [detailedSurvey],
        entries: [detailedSurvey],
        craving: detCraving,
        mood: detBalance,
        anxiety: detAnxiety
      };
      localStorage.setItem('quit-smoking:days', JSON.stringify(daysMap));

      // 7. Save Custom Logs List for Analyzer
      const customLogs = [
        {
          id: `onb_sleep_${Date.now()}`,
          timestamp: Date.now(),
          dateStr: todayStr,
          timeStr,
          category: 'sleep',
          title: 'Запис сну (Реєстрація)',
          details: `${sleepDuration} год, якість сну: ${sleepQuality}/5`,
          value: `${sleepDuration}h`
        },
        {
          id: `onb_water_${Date.now()}`,
          timestamp: Date.now(),
          dateStr: todayStr,
          timeStr,
          category: 'hydration',
          title: 'Споживання води (Реєстрація)',
          details: `Випито до початку реєстрації: ${waterDrunk} мл`,
          value: `${waterDrunk}ml`
        },
        {
          id: `onb_steps_${Date.now()}`,
          timestamp: Date.now(),
          dateStr: todayStr,
          timeStr,
          category: 'activity',
          title: 'Фізична активність (Реєстрація)',
          details: `Пройдено кроків: ${actualSteps}. Активність: ${additionalActivity} (${activityMinutes} хв)`,
          value: `${actualSteps} steps`
        },
        {
          id: `onb_survey_${Date.now()}`,
          timestamp: Date.now(),
          dateStr: todayStr,
          timeStr,
          category: 'survey',
          title: 'Стартовий зріз стану',
          details: `Тяга: ${detCraving}, Енергія: ${detEnergy}, Тривога: ${detAnxiety}. Симптоми: ${detSymptoms.join(', ') || 'немає'}`,
          value: `Тяга: ${detCraving}/5`
        }
      ];
      localStorage.setItem('quit-smoking:health-custom-logs', JSON.stringify(customLogs));

      // 8. Final completion flags
      localStorage.setItem('quit-smoking:onboarded', 'true');
      window.dispatchEvent(new Event('storage'));
    } catch (err) {}

    onComplete({
      userName: 'Користувач',
      startDate: Date.now() - 3600000, // slight offset to start counters smoothly
      money: moneySettings,
      mainReason: 'Відновлення здоров’я, економія та свобода від диму'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto no-scrollbar">
      <div className="bg-[#14151b] border border-[#2a2b34] rounded-[2.5rem] p-5 sm:p-7 max-w-md w-full shadow-[0_25px_70px_rgba(0,0,0,0.85)] space-y-5 text-white my-auto relative overflow-hidden">
        {/* Step Progress Top Dots */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Калібрування
            </span>
            <span className="text-xs text-zinc-400 font-bold">
              Крок {currentStep} з 6
            </span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map((st) => (
              <span
                key={st}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  currentStep === st
                    ? 'bg-emerald-400 w-3'
                    : currentStep > st
                    ? 'bg-emerald-500/50'
                    : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: Дані для розрахунку витрат */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-wide">
                  1. Фінансові розрахунки
                </h3>
                <p className="text-xs text-zinc-400">
                  Інформація про куріння для калькулятора економії
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
                  <span>Сигарет на день:</span>
                  <span className="text-emerald-400 font-mono text-sm">{perDay} шт</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={perDay}
                  onChange={(e) => setPerDay(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-3 bg-black/40 border border-[#2a2b34] rounded-xl text-white outline-none focus:border-emerald-500 transition-colors"
                  required
                />
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[10, 15, 20, 25, 30].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setPerDay(String(count))}
                      className={`py-1.5 text-xs font-mono font-black rounded-lg border transition-all cursor-pointer ${
                        numPerDay === count
                          ? 'bg-white text-zinc-900 border-white shadow-xs'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400">
                    Ціна однієї пачки:
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={packPrice}
                    onChange={(e) => setPackPrice(e.target.value)}
                    className="w-full text-xs font-mono font-bold p-3 bg-black/40 border border-[#2a2b34] rounded-xl text-white outline-none focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400">
                    Оберіть валюту:
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['₴', '$', '€'] as const).map((cur) => (
                      <button
                        key={cur}
                        type="button"
                        onClick={() => setCurrency(cur)}
                        className={`py-2 text-xs font-bold font-mono rounded-xl border transition-all cursor-pointer ${
                          currency === cur
                            ? 'bg-white text-slate-900 border-white shadow-xs font-extrabold'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {cur}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Заощадження на місяць:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ~{monthlySaved.toLocaleString()} {currency}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: Фізичні характеристики */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-wide">
                  2. Фізичні показники
                </h3>
                <p className="text-xs text-zinc-400">
                  Базові метрики тіла для розрахунку регенерації
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">Вага (кг)</label>
                <input
                  type="number"
                  min="35"
                  max="200"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full text-xs font-mono font-bold p-3 bg-black/40 border border-[#2a2b34] rounded-xl text-white outline-none focus:border-sky-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">Зріст (см)</label>
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full text-xs font-mono font-bold p-3 bg-black/40 border border-[#2a2b34] rounded-xl text-white outline-none focus:border-sky-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">Вік (років)</label>
                <input
                  type="number"
                  min="12"
                  max="110"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full text-xs font-mono font-bold p-3 bg-black/40 border border-[#2a2b34] rounded-xl text-white outline-none focus:border-sky-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">Стать</label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      gender === 'male'
                        ? 'bg-sky-500 text-white border-sky-600'
                        : 'bg-white/5 border-white/10 text-zinc-400'
                    }`}
                  >
                    Чоловік
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      gender === 'female'
                        ? 'bg-pink-500 text-white border-pink-600'
                        : 'bg-white/5 border-white/10 text-zinc-400'
                    }`}
                  >
                    Жінка
                  </button>
                </div>
              </div>
            </div>

            {/* BMI Badge Indicator */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-zinc-400">Твій Індекс маси тіла (ІМТ):</span>
                <div className="text-sm font-black text-white font-mono mt-0.5">{bmi}</div>
              </div>
              <span className={`text-[11px] font-black uppercase ${bmiAssessment.color}`}>
                {bmiAssessment.text}
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: Скільки води випито */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 animate-pulse">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-wide">
                  3. Квантовий Монітор Гідратації
                </h3>
                <p className="text-xs text-zinc-400">
                  Вкажіть вжиту воду для калібрування Аналізатора
                </p>
              </div>
            </div>

            <div className="space-y-4 py-2">
              <div className="text-center space-y-1">
                <div className="text-3xl font-black font-mono text-blue-400">
                  {waterDrunk} <span className="text-sm text-zinc-400">мл</span>
                </div>
                <div className="text-xs text-zinc-400 font-medium">
                  Рекомендована добова норма: ~{Math.round(weight * 33)} мл
                </div>
              </div>

              {/* Slider / Presets */}
              <input
                type="range"
                min="0"
                max="3000"
                step="100"
                value={waterDrunk}
                onChange={(e) => setWaterDrunk(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />

              <div className="grid grid-cols-4 gap-1.5">
                {[250, 500, 1000, 1500].map((ml) => (
                  <button
                    key={ml}
                    type="button"
                    onClick={() => setWaterDrunk(ml)}
                    className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                      waterDrunk === ml
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {ml >= 1000 ? `${(ml / 1000).toFixed(1)}л` : `${ml} мл`}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed bg-blue-500/5 p-3 rounded-2xl border border-blue-500/10">
              💡 **Гідратація Аналізатора:** Дані напряму потрапляють у вбудовану систему квантового аналізу для розрахунку розрідження крові та швидкості виведення нікотинових токсинів.
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: Фізична активність */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-wide">
                  4. Фізична активність
                </h3>
                <p className="text-xs text-zinc-400">
                  Вкажіть приблизну кількість кроків або активність сьогодні
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
                  <span>Пройдено кроків сьогодні:</span>
                  <span className="text-emerald-400 font-mono text-sm">{actualSteps.toLocaleString()} / {stepGoal.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15000"
                  step="500"
                  value={actualSteps}
                  onChange={(e) => setActualSteps(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="grid grid-cols-4 gap-1.5">
                  {[2000, 5000, 8000, 10000].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setActualSteps(st)}
                      className={`py-1.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                        actualSteps === st
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {st >= 1000 ? `${st / 1000}к` : st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl grid grid-cols-2 gap-2 text-center text-xs">
                <div>
                  <span className="text-zinc-500">Дистанція</span>
                  <div className="font-bold font-mono text-white mt-0.5">{((actualSteps * 0.75) / 1000).toFixed(1)} км</div>
                </div>
                <div>
                  <span className="text-zinc-500">Калорії</span>
                  <div className="font-bold font-mono text-white mt-0.5">{Math.round(actualSteps * 0.042)} ккал</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: Тривалість і якість сну */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-wide">
                  5. Тривалість & Якість сну
                </h3>
                <p className="text-xs text-zinc-400">
                  Метрики вчорашнього сну перед відмовою від сигарет
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400">Час засинання</label>
                  <input
                    type="time"
                    value={sleepBedTime}
                    onChange={(e) => setSleepBedTime(e.target.value)}
                    className="w-full text-xs font-mono font-bold p-3 bg-black/40 border border-[#2a2b34] rounded-xl text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400">Час пробудження</label>
                  <input
                    type="time"
                    value={sleepWakeTime}
                    onChange={(e) => setSleepWakeTime(e.target.value)}
                    className="w-full text-xs font-mono font-bold p-3 bg-black/40 border border-[#2a2b34] rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold text-zinc-400 mb-1">
                  <span>Фактична тривалість:</span>
                  <span className="text-indigo-400 font-mono text-sm">{sleepDuration} год</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={sleepDuration}
                  onChange={(e) => setSleepDuration(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1.5">
                  Якість сну ({sleepQuality}/5)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSleepQuality(val)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        sleepQuality === val
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {val === 1 ? '😫' : val === 2 ? '🥱' : val === 3 ? '😐' : val === 4 ? '😊' : '🌟'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: Детальний зріз стану */}
        {/* ========================================================================= */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-wide">
                  6. Детальний зріз стану
                </h3>
                <p className="text-xs text-zinc-400">
                  Заповніть початковий психологічний зріз
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 no-scrollbar">
              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-400 mb-0.5">
                  <span>🔋 Енергія:</span>
                  <span className="font-mono text-emerald-400">{detEnergy}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={detEnergy}
                  onChange={(e) => setDetEnergy(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-400 mb-0.5">
                  <span>🔥 Тяга до паління:</span>
                  <span className="font-mono text-rose-400">{detCraving}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={detCraving}
                  onChange={(e) => setDetCraving(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-400 mb-0.5">
                  <span>⚡ Тривожність:</span>
                  <span className="font-mono text-amber-400">{detAnxiety}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={detAnxiety}
                  onChange={(e) => setDetAnxiety(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-400 mb-0.5">
                  <span>🎯 Концентрація:</span>
                  <span className="font-mono text-purple-400">{detFocus}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={detFocus}
                  onChange={(e) => setDetFocus(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1.5">
                  Фізичні симптоми (оберіть наявні)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Головний біль', 'Сухість у роті', 'Втома', 'Кашель курця', 'Спокій'].map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                        detSymptoms.includes(sym)
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-white/5 border-white/10 text-zinc-400'
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                  Нотатка про стартове самопочуття
                </label>
                <input
                  type="text"
                  placeholder="Опишіть ваш поточний настрій..."
                  value={detNote}
                  onChange={(e) => setDetNote(e.target.value)}
                  className="w-full text-xs p-3 bg-black/40 border border-[#2a2b34] rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-white/[0.08]">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>
          )}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Продовжити</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-xs rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4 text-zinc-950 stroke-[3]" />
              <span>Запустити Аналізатор</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
