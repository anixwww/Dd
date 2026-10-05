import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize or retrieve Google GenAI instance dynamically
function getGenAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to attempt model generation with fallbacks across aliases if primary hits 429 quota
async function generateContentWithFallback(aiClient: GoogleGenAI, params: any) {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      return await aiClient.models.generateContent({
        ...params,
        model,
      });
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini generation with model ${model} failed:`, err?.message || err);
    }
  }
  throw lastError;
}

// AI System Status Endpoint
app.get('/api/ai/status', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({ status: 'offline', isLiveAi: false });
  }
  return res.json({ status: 'active', isLiveAi: true });
});

// AI Health Analyzer real-time endpoint
app.post('/api/analyzer/live-advice', async (req, res) => {
  const { 
    diffDays, 
    physical,
    sleep,
    hydration,
    slice,
    recentSlicesSummary,
    triggers,
    lungs,
    focusMode
  } = req.body || {};

  const craving = slice?.craving ?? req.body?.craving ?? 2;
  const thoughts = slice?.thoughts ?? 2;
  const anxiety = slice?.anxiety ?? 2;
  const irritability = slice?.irritability ?? 2;
  const calmness = slice?.calmness ?? 3;
  const energy = slice?.energy ?? req.body?.energy ?? 3;
  const focus = slice?.focus ?? 3;
  const overall = slice?.overall ?? 3;
  const sliceNote = slice?.note || req.body?.customNote || '';

  const water = hydration?.todayWater ?? req.body?.water ?? 0;
  const waterNorm = hydration?.waterGoal ?? req.body?.waterNorm ?? 2200;
  const drinksLog = hydration?.drinksSummary || '';

  const sleepHours = sleep?.sleepHours ?? req.body?.sleepHours ?? 7.5;
  const bedtime = sleep?.bedtime || req.body?.bedtime || '23:00';
  const wakeTime = sleep?.wakeTime || req.body?.wakeTime || '07:30';
  const sleepQuality = sleep?.sleepQuality ?? req.body?.sleepQuality ?? 4;

  const age = physical?.age;
  const weight = physical?.weight;
  const height = physical?.height;
  const gender = physical?.gender || 'не вказано';

  const topTrigger = triggers?.topTrigger || req.body?.topTrigger || 'не вказано';
  const breathSeconds = lungs?.breathSeconds ?? req.body?.breathSeconds ?? 0;

  try {

    const aiClient = getGenAI();

    if (!aiClient) {
      // High-quality fallback response if API key not present
      const isUrgent = craving >= 4 || anxiety >= 4;
      const isDehydrated = water < (waterNorm * 0.5);
      return res.json({
        isLiveAi: false,
        headline: isUrgent ? 'Пік тяги: вегетативна стабілізація' : isDehydrated ? 'Клітинна дегідратація: посилення тяги' : 'Біоритми та детокс у нормі',
        statusLevel: isUrgent ? 'warning' : isDehydrated ? 'warning' : 'optimal',
        healthScore: Math.max(30, Math.min(98, Math.round(100 - (craving * 10) - (anxiety * 8) + (calmness * 6) + (energy * 4) + (water >= waterNorm ? 10 : 0)))),
        bodySummary: `На ${diffDays || 1}-му дні без нікотину бронхи та легені активно очищаються від смол, а дихальні шляхи відновлюють нормальну епітеліальну функцію.\n\nҐрунтуючись на останніх зрізах та показниках (тяга: ${craving}/5, тривога: ${anxiety}/5, спокій: ${calmness}/5, сон: ${sleepHours} год, вода: ${water} мл), рекомендуємо втримати баланс та пити більше чистої води для виведення токсинів.`,
        immediateAction: isUrgent 
          ? 'Зробіть 5 глибоких циклів дихання: вдих носом на 4 сек, затримка на 4 сек, плавний видих ротом на 6 сек.'
          : 'Випийте повільними ковтками 200-250 мл чистої теплої води.',
        quickTips: [
          'Випийте 250 мл теплої води для прискорення вимивання залишків котиніну нирками.',
          sleepHours < 7 ? 'Сон тривав менше 7 год: чутливість аденозинових рецепторів підвищена, уникайте кофеїну після 14:00.' : 'Режим сну підтримує відновлення дофамінового балансу.',
          'Змініть фокус уваги на 3 хвилини фізичного руху (швидка ходьба або легкі розтяжки).'
        ],
        emergencyAction: isUrgent ? 'Зробіть 15 присідань або вмийте обличчя холодною водою для стимуляції блукаючого нерва (diving reflex).' : null,
        biologicalFocus: 'Очищення альвеол легень та відновлення чутливості дофамінових рецепторів',
        neuroBiologicalInsight: 'При дефіциті нікотину рівень ацетилхоліну коливається. Гідратація знижує в\'язкість крові та полегшує доставку кисню до префронтальної кори.',
        personalizedAffirmation: 'Кожна подолана хвилина зміцнює нейронні шляхи вільного від залежності мозку.'
      });
    }

    const prompt = `Ти — передовий медичний ШІ-аналізатор у реальному часі на основі Gemini AI для відмови від куріння.
Твоє завдання: на основі ВСІХ отриманих у реальному часі даних з вкладки "Швидкі механіки" дати чіткий, точний фізіологічний аналіз та конкретні, миттєво здійсненні швидкі поради українською мовою.

АКТУАЛЬНІ ДАНІ КОРИСТУВАЧА ЗІ ШВИДКИХ МЕХАНІК:
• Стаж відмови: ${diffDays ?? 1} днів
• ФІЗИЧНИЙ ПРОФІЛЬ: вік: ${age || 'не вказано'}, вага: ${weight ? `${weight} кг` : 'не вказано'}, зріст: ${height ? `${height} см` : 'не вказано'}, стать: ${gender}
• ПОТОЧНИЙ ЗРІЗ СТАНУ (1-5):
  - Тяга до сигарети: ${craving}/5
  - Нав'язливі думки: ${thoughts}/5
  - Тривожність: ${anxiety}/5
  - Дратівливість: ${irritability}/5
  - Рівень спокою: ${calmness}/5
  - Енергія: ${energy}/5
  - Концентрація: ${focus}/5
  - Загальне самопочуття: ${overall}/5
  - Нотатка користувача: ${sliceNote || 'немає'}
• РЕЖИМ СНУ:
  - Тривалість сну: ${sleepHours} год (відбій: ${bedtime}, підйом: ${wakeTime})
  - Суб'єктивна якість сну: ${sleepQuality}/5
• ВОДНИЙ БАЛАНС:
  - Випито сьогодні: ${water} мл із норми ${waterNorm} мл (${Math.round((water / (waterNorm || 2200)) * 100)}%)
  - Додаткові напої/раціон: ${drinksLog || 'не зафіксовано'}
• ТРИГЕРИ:
  - Найчастіший тригер: ${topTrigger}
• ДИХАЛЬНА СИСТЕМА:
  - Проба Штанге (затримка дихання): ${breathSeconds ? `${breathSeconds} сек` : 'ще не пройдено'}
• РЕЖИМ ЗАПИТУ: ${focusMode || 'general'}

ФОРМАТ ВІДПОВІДІ (ТІЛЬКИ ВАЛІДНИЙ ЧИСТИЙ JSON, БЕЗ MARKDOWN-БЛОКІВ, БЕЗ \`\`\`json):
{
  "headline": "Короткий ємний статус стану (до 6 слів)",
  "statusLevel": "optimal" | "recovering" | "warning" | "critical",
  "healthScore": 85,
  "bodySummary": "Два абзаци: у першому детально опиши що відбувається з тілом у даний момент в контексті відмови від куріння, а в другому дай поточну пораду, яка базується на даних із Зрізів у першу чергу",
  "immediateAction": "Одна конкретна мікро-дія прямо зараз на найближчі 2 хвилини",
  "quickTips": [
    "Перша швидка порада (фокус на тязі чи тривозі)",
    "Друга порада (фокус на воді чи детоксі)",
    "Третя порада (фокус на сні, енергії або диханні)"
  ],
  "emergencyAction": "Швидкий SOS-прийом, якщо тяга >= 3 або тривога >= 4, інакше null",
  "biologicalFocus": "Ключова біологічна система у фокусі прямо зараз (наприклад: 'Нікотинові ацетилхолінові рецептори' чи 'Очищення альвеол легень')",
  "neuroBiologicalInsight": "Наукове коротке пояснення того, чому саме зараз організм так реагує (1-2 речення)",
  "personalizedAffirmation": "Коротке науково обґрунтоване підбадьорення"
}`;

    const response = await generateContentWithFallback(aiClient, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    });

    const text = (response.text || '').trim();
    let cleaned = text;
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    }

    try {
      const parsed = JSON.parse(cleaned);
      return res.json({
        ...parsed,
        isLiveAi: true
      });
    } catch {
      return res.json({
        isLiveAi: true,
        headline: 'Стан нервової системи стабілізується',
        statusLevel: 'recovering',
        healthScore: 78,
        bodySummary: text.slice(0, 300),
        immediateAction: 'Випийте 250 мл чистої води та зробіть повільний видих 4-7-8.',
        quickTips: [
          'Випийте 250 мл свіжої води для очищення лімфи.',
          'Глибокий вдих на 4 секунди, затримка на 2, повільний видих на 6.',
          'Зробіть коротку паузу та змініть позу або кімнату.'
        ],
        emergencyAction: craving >= 3 ? 'Вмийте обличчя холодною водою для стимуляції блукаючого нерва.' : null,
        biologicalFocus: 'Вегетативна стабілізація та детоксикація',
        neuroBiologicalInsight: 'Регулярне пиття води знижує концентрацію метаболітів нікотину в сироватці крові.',
        personalizedAffirmation: 'Ваш організм щохвилини успішно відновлює природний дофаміновий баланс.'
      });
    }
  } catch (error: any) {
    console.warn('Live AI health advice fallback triggered due to API quota/error:', error?.message || error);
    const isUrgent = craving >= 4 || anxiety >= 4;
    const isDehydrated = water < (waterNorm * 0.5);
    return res.json({
      isLiveAi: false,
      headline: isUrgent ? 'Пік тяги: вегетативна стабілізація' : isDehydrated ? 'Клітинна дегідратація: посилення тяги' : 'Біоритми та детокс у нормі',
      statusLevel: isUrgent ? 'warning' : isDehydrated ? 'warning' : 'optimal',
      healthScore: Math.max(30, Math.min(98, Math.round(100 - (craving * 10) - (anxiety * 8) + (calmness * 6) + (energy * 4) + (water >= waterNorm ? 10 : 0)))),
      bodySummary: `На ${diffDays || 1}-му дні без нікотину організм поступово очищається від токсичних залишків, а дихальні функції стабілізуються.\n\nВраховуючи дані вашого поточного зрізу (тяга: ${craving}/5, тривога: ${anxiety}/5, спокій: ${calmness}/5, сон: ${sleepHours} год, вода: ${water} мл), рекомендуємо звернути увагу на м'яке дихання та підтримання гідратації.`,
      immediateAction: isUrgent 
        ? 'Зробіть 5 глибоких циклів дихання: вдих носом на 4 сек, затримка на 4 сек, плавний видих ротом на 6 сек.'
        : 'Випийте повільними ковтками 200-250 мл чистої теплої води.',
      quickTips: [
        'Випийте 250 мл теплої води для прискорення вимивання залишків котиніну нирками.',
        sleepHours < 7 ? 'Сон тривав менше 7 год: чутливість аденозинових рецепторів підвищена, обмежте кофеїн.' : 'Режим сну підтримує відновлення дофамінового балансу.',
        'Змініть фокус уваги на 3 хвилини фізичного руху або розтяжки.'
      ],
      emergencyAction: isUrgent ? 'Зробіть 15 присідань або вмийте обличчя холодною водою для стимуляції блукаючого нерва.' : null,
      biologicalFocus: 'Очищення альвеол легень та відновлення чутливості дофамінових рецепторів',
      neuroBiologicalInsight: 'Гідратація та регуляція дихання знижують в\'язкість крові та стабілізують префронтальну кору.',
      personalizedAffirmation: 'Кожна подолана хвилина зміцнює нейронні шляхи вільного від залежності мозку.'
    });
  }
});

// Cognitive AI Self-Help Chat Endpoint for SOS tab (Gemini 3.8 Flash)
app.post('/api/sos/chat', async (req, res) => {
  const { messages = [], context = {} } = req.body || {};
  const {
    diffDays = 1,
    craving = 3,
    anxiety = 2,
    trigger = 'гостра тяга',
  } = context;

  try {
    const aiClient = getGenAI();

    if (!aiClient) {
      // High-quality CBT fallback response
      return res.json({
        reply: `Я чую, наскільки відчутний цей імпульс прямо зараз. Пам'ятай: фізіологічна хвиля тяги триває лише 3–5 хвилин і потім гарантовано спадає.

💡 **Когнітивне переформулювання (CBT):**
Думка «Мені терміново потрібна сигарета» — це лише залишковий сигнал старих нейронних шляхів, а не реальна фізична потреба. Твоє тіло вже ${diffDays || 1}-й день успішно відновлюється без нікотину.

⚡ **Що зробити прямо зараз:**
1. Зроби 3 повільних «фізіологічних зітхання»: подвійний вдих носом і плавний довгий видих ротом.
2. Випий кілька повільних ковтків прохолодної води.
3. Спостерігай за тягою як за хвилею: вона досягає піку і спадає, не змушуючи тебе підкорятися.

Як ти зараз почуваєшся після кількох глибоких вдихів?`,
        isLiveAi: false,
        actionSuggestion: 'Зробити 3 глибоких видихи',
      });
    }

    const systemInstruction = `Ти — експертний когнітивно-поведінковий ШІ-терапевт (CBT & ACT психолог) у додатку NoSmo для екстреної самодопомоги при відмові від куріння.
Твоя мета: швидко, спокійно, емпатично та науково обґрунтовано допомогти користувачеві подолати гостру тягу (craving), зняти тривогу, виявити когнітивні пастки («лише одна затяжка», «я не витримаю», «це зніме стрес») та переключити увагу.

КОНТЕКСТ КОРИСТУВАЧА:
- Днів без нікотину: ${diffDays}
- Поточний рівень тяги: ${craving}/5
- Рівень тривоги: ${anxiety}/5
- Останній тригер: ${trigger}

ПРАВИЛА ВІДПОВІДІ:
1. Спілкуйся українською мовою, звертайся на «ти», тепло, впевнено і підтримувально.
2. Не пиши надто довгих лекцій (максимум 2-3 коротких абзаци або чіткий список із 2-3 пунктів). Людина у стані тяги потребує чіткості й спокою.
3. Використовуй когнітивне переформулювання (CBT/ACT): покажи, що думка про сигарету — це не наказ, а тимчасовий спайк нейромедіаторів, який спаде за 3–5 хвилин.
4. Завжди давай одну конкретну тілесну або ментальну мікро-дію (наприклад, техніка 4-7-8, ковток холодної води, заземлення 5-4-3-2-1, розтирання долонь).
5. Завершуй коротким відкритим запитанням або мотивуючим словом.`;

    const contents: any[] = [];
    for (const msg of messages) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }

    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: 'У мене сильна тяга закурити прямо зараз, допоможи мені перечекати цей момент.' }]
      });
    }

    const response = await generateContentWithFallback(aiClient, {
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.6,
        topP: 0.95,
      }
    });

    const reply = response.text || 'Я поруч. Зроби повільний видих і пам\'ятай, що ця хвиля скоро вщухне.';

    return res.json({
      reply,
      isLiveAi: true
    });
  } catch (error: any) {
    console.warn('SOS cognitive chat fallback triggered due to API quota/error:', error?.message || error);
    return res.json({
      reply: `Я відчуваю, наскільки інтенсивною може бути ця хвиля прямо зараз. Пам'ятай: фізіологічний спайк тяги триває лише 3–5 хвилин і потім гарантовано спадає.

💡 **Когнітивне переформулювання (CBT):**
Думка «Мені потрібно закурити» — це лише тимчасовий сигнал старих рецепторів, а не реальна фізична потреба. Твоє тіло вже ${diffDays || 1}-й день успішно відновлюється.

⚡ **Дія прямо зараз:**
1. Зроби 3 повільних «фізіологічних зітхання»: подвійний вдих носом і довгий видих ротом.
2. Випий кілька ковтків прохолодної води.
3. Спостерігай за хвилею: вона скоро спаде.

Як ти зараз почуваєшся після глибокого видиху?`,
      isLiveAi: false,
      actionSuggestion: 'Зробити 3 глибоких видихи'
    });
  }
});

// AI Background Image Generation Endpoint
app.post('/api/generate-ai-background', async (req, res) => {
  try {
    const body = (req.body || {}) as any;
    const promptStyle = body.promptStyle;
    const customPrompt = body.customPrompt;
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'GEMINI_API_KEY відсутній у налаштуваннях середовища' });
      return;
    }
    const ai = new GoogleGenAI({ apiKey });

    let finalPrompt = (typeof customPrompt === 'string' ? customPrompt : '').trim() || 'A breathtaking abstract deep space gradient background with fluid cosmic nebula waves, subtle luminous purple and indigo glow';
    if (promptStyle === 'nebula') {
      finalPrompt = 'A breathtaking abstract deep space gradient background with fluid cosmic nebula waves, subtle luminous purple, violet, indigo and emerald cyan glow, dark atmospheric ambient wallpaper, smooth high quality';
    } else if (promptStyle === 'aurora') {
      finalPrompt = 'An ethereal abstract aurora boreal gradient background with flowing neon teal, emerald green, magenta and deep dark obsidian waves, glowing atmospheric fluid motion, smooth minimalist wallpaper';
    } else if (promptStyle === 'sunset') {
      finalPrompt = 'A rich luxurious abstract sunset gradient background with fluid velvet crimson, amber gold, warm bronze, dark terracotta and subtle violet glow, organic atmospheric waves, smooth wallpaper';
    } else if (promptStyle === 'cyber') {
      finalPrompt = 'An ultra-modern abstract dark gradient background with iridescent holographic blue, deep violet and electric indigo silk waves, smooth liquid glass sheen, dark ambient aesthetic';
    }

    try {
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: finalPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
      });

      const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
      if (base64Image) {
        const dataUrl = `data:image/jpeg;base64,${base64Image}`;
        res.json({ imageUrl: dataUrl, prompt: finalPrompt });
        return;
      }
    } catch (genErr: any) {
      console.warn('imagen-3.0-generate-002 image generation failed:', genErr?.message);
    }

    res.status(500).json({ error: 'Не вдалося згенерувати AI фоновий градієнт' });
    return;
  } catch (error: any) {
    console.error('Error generating AI background image:', error);
    res.status(500).json({ error: error?.message || 'Помилка генерації AI фону' });
    return;
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
