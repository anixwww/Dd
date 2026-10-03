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

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Health Analyzer real-time endpoint
app.post('/api/analyzer/live-advice', async (req, res) => {
  try {
    const { 
      diffDays, 
      craving, 
      water, 
      waterNorm, 
      sleepHours, 
      bedtime, 
      wakeTime, 
      sleepQuality, 
      energy, 
      mood, 
      topTrigger,
      breathSeconds,
      customNote,
      symptoms
    } = req.body || {};

    if (!ai) {
      // Fallback response if no API key configured
      return res.json({
        headline: craving >= 4 ? 'Критична тяга: видихніть' : water < (waterNorm * 0.6) ? 'Дефіцит води: клітинна спрага' : 'Організм стабілізується',
        bodySummary: `Зараз організм на ${diffDays || 1}-му дні відновлення. Рівень тяги: ${craving || 2}/5, рівень гідратації: ${water || 0} мл із ${waterNorm || 2200} мл.`,
        quickTips: [
          'Випийте повільними ковтками 200-250 мл теплої води.',
          'Зробіть 4 повільні вдихи носом (4 сек) і плавний видих ротом (6 сек).',
          'Змініть положення тіла або вийдіть на свіже повітря на 2 хвилини.'
        ],
        emergencyAction: craving >= 4 ? 'Зробіть 15 присідань для вивільнення накопиченого адреналіну.' : null,
        biologicalFocus: 'Очищення альвеол легень та нормалізація чутливості дофамінових рецепторів'
      });
    }

    const prompt = `Ти — інтелектуальний медичний ШІ-аналізатор у реальному часі для людини, яка кидає палити.
Аналізуй поточні біометричні дані людини та дай чіткий, швидкий та науково обґрунтований медичний аналіз актуального стану організму прямо зараз і дай дієві швидкі поради.

ПОТОЧНІ ДАНІ КОРИСТУВАЧА:
- Днів без паління: ${diffDays ?? 1}
- Поточна тяга до куріння (1-5): ${craving ?? 2}
- Вода випита сьогодні: ${water ?? 0} мл (норма: ${waterNorm ?? 2200} мл)
- Сон: ${sleepHours ?? 7.5} год (засинання о ${bedtime || '23:00'}, підйом о ${wakeTime || '07:30'}), якість: ${sleepQuality ?? 4}/5
- Рівень енергії (1-5): ${energy ?? 3}
- Настрій/спокій (1-5): ${mood ?? 3}
- Найчастіший тригер: ${topTrigger || 'не вказано'}
- Затримка дихання (проба Штанге): ${breathSeconds ? `${breathSeconds} сек` : 'ще не пройдено'}
- Відмічені симптоми: ${Array.isArray(symptoms) && symptoms.length > 0 ? symptoms.join(', ') : 'немає гострих скарг'}
- Особиста нотатка: ${customNote || 'немає'}

ФОРМАТ ВІДПОВІДІ (ТІЛЬКИ ЧИСТИЙ JSON, без markdown-огорож, без пояснень):
{
  "headline": "Короткий заголовок стану (до 6 слів)",
  "bodySummary": "Точний аналіз поточного фізіологічного стану організму прямо в цю хвилину (2-3 ємні речення)",
  "quickTips": [
    "Перша надшвидка дія прямо зараз (до 15 слів)",
    "Друга дія для нервової системи або дихання (до 15 слів)",
    "Третя фізіологічна порада (вода/перекус/рух) (до 15 слів)"
  ],
  "emergencyAction": "Термінова мікро-дія, якщо тяга висока (або null, якщо стан стабільний)",
  "biologicalFocus": "Ключова біологічна система у фокусі регенерації сьогодні (наприклад: 'Нікотинові ацетилхолінові рецептори' чи 'Очищення війчастого епітелію бронхів')"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      }
    });

    const text = response.text || '';
    try {
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch {
      return res.json({
        headline: 'Стан нервової системи стабілізується',
        bodySummary: text.slice(0, 300),
        quickTips: [
          'Випийте 250 мл свіжої води для очищення лімфи.',
          'Глибокий вдих на 4 секунди, затримка на 2, повільний видих на 6.',
          'Відволічіть увагу на тактильну або рухову вправу.'
        ],
        emergencyAction: null,
        biologicalFocus: 'Вегетативна стабілізація та детоксикація'
      });
    }
  } catch (error: any) {
    console.error('Error generating live AI health advice:', error);
    return res.status(500).json({ error: error?.message || 'Помилка аналізу' });
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
