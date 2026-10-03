/**
 * Card and Storage Safety Utilities
 * Ensures data integrity, corrupted JSON auto-healing, and emergency window restoration.
 */

export const CARD_STORAGE_KEYS = {
  STEPS_DOCKED: 'quit-smoking:steps-docked',
  MENTAL_HEALTH_DOCKED: 'quit-smoking:mental-health-docked',
  GRATITUDE_DOCKED: 'quit-smoking:gratitude-docked',
  GOALS_DOCKED: 'quit-smoking:goals-docked',
  QUICK_GOAL_DOCKED: 'quit-smoking:quick-goal-docked',
  
  STEPS_DATA: 'quit-smoking:daily-micro-steps',
  STEPS_HISTORY: 'quit-smoking:daily-steps-history',
  MENTAL_HEALTH_DATA: 'quit-smoking:mental-health-habits-config',
  GRATITUDE_DATA: 'quit-smoking:gratitude-journal-entries',
} as const;

/**
 * Safely parse JSON from localStorage with automatic fallback and self-healing.
 */
export function safeGetJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    return parsed as T;
  } catch (err) {
    console.warn(`[SafeStorage] Auto-healing corrupted key "${key}":`, err);
    try {
      localStorage.setItem(key, JSON.stringify(fallback));
    } catch {}
    return fallback;
  }
}

/**
 * Safely writes JSON to localStorage and dispatches storage + custom events.
 */
export function safeSetJSON<T>(key: string, value: T, eventName?: string): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (eventName) {
      window.dispatchEvent(new Event(eventName));
    }
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error(`[SafeStorage] Failed to save key "${key}":`, err);
  }
}

/**
 * Emergency Action: Restores all docked windows back into the main feed.
 */
export function restoreAllWindowsToFeed(): void {
  try {
    localStorage.setItem(CARD_STORAGE_KEYS.STEPS_DOCKED, 'false');
    localStorage.setItem(CARD_STORAGE_KEYS.MENTAL_HEALTH_DOCKED, 'false');
    localStorage.setItem(CARD_STORAGE_KEYS.GRATITUDE_DOCKED, 'false');
    localStorage.setItem(CARD_STORAGE_KEYS.GOALS_DOCKED, 'false');
    localStorage.setItem(CARD_STORAGE_KEYS.QUICK_GOAL_DOCKED, 'false');

    window.dispatchEvent(new Event('steps-docked-change'));
    window.dispatchEvent(new Event('mental-health-docked-change'));
    window.dispatchEvent(new Event('gratitude-docked-change'));
    window.dispatchEvent(new Event('goals-docked-change'));
    window.dispatchEvent(new Event('quick-goal-docked-change'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('[SafeStorage] Failed to restore all windows:', err);
  }
}

/**
 * Verify and repair all local state structures to ensure zero runtime crashes.
 */
export function verifyAndRepairDataIntegrity(): { repairedCount: number; status: string } {
  let repaired = 0;

  try {
    // 1. Verify steps
    const steps = localStorage.getItem(CARD_STORAGE_KEYS.STEPS_DATA);
    if (steps) {
      try {
        const parsed = JSON.parse(steps);
        if (!Array.isArray(parsed)) throw new Error('Invalid steps structure');
      } catch {
        localStorage.removeItem(CARD_STORAGE_KEYS.STEPS_DATA);
        repaired++;
      }
    }

    // 2. Verify gratitude
    const gratitude = localStorage.getItem(CARD_STORAGE_DATA.GRATITUDE_DATA || 'quit-smoking:gratitude-journal-entries');
    if (gratitude) {
      try {
        const parsed = JSON.parse(gratitude);
        if (!Array.isArray(parsed)) throw new Error('Invalid gratitude structure');
      } catch {
        localStorage.removeItem('quit-smoking:gratitude-journal-entries');
        repaired++;
      }
    }

    // 3. Verify mental health habits
    const habits = localStorage.getItem(CARD_STORAGE_KEYS.MENTAL_HEALTH_DATA);
    if (habits) {
      try {
        const parsed = JSON.parse(habits);
        if (!Array.isArray(parsed)) throw new Error('Invalid habits structure');
      } catch {
        localStorage.removeItem(CARD_STORAGE_KEYS.MENTAL_HEALTH_DATA);
        repaired++;
      }
    }

    // 4. Verify dock flags (ensure they are strictly 'true' or 'false')
    [
      CARD_STORAGE_KEYS.STEPS_DOCKED,
      CARD_STORAGE_KEYS.MENTAL_HEALTH_DOCKED,
      CARD_STORAGE_KEYS.GRATITUDE_DOCKED,
      CARD_STORAGE_KEYS.GOALS_DOCKED,
      CARD_STORAGE_KEYS.QUICK_GOAL_DOCKED
    ].forEach((dockKey) => {
      const val = localStorage.getItem(dockKey);
      if (val !== 'true' && val !== 'false' && val !== null) {
        localStorage.setItem(dockKey, 'false');
        repaired++;
      }
    });

    window.dispatchEvent(new Event('storage'));
    return {
      repairedCount: repaired,
      status: repaired > 0 ? `Відновлено ${repaired} елементів цілісності!` : 'Усі дані повністю цілісні та захищені.'
    };
  } catch (e) {
    return { repairedCount: 0, status: 'Перевірка завершена.' };
  }
}
const CARD_STORAGE_DATA = CARD_STORAGE_KEYS;
