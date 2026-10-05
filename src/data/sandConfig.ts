export interface SandLevelItemConfig {
  name: string;
  color: string;
  icon?: string;
}

export interface SandLevelItem {
  level: number;
  count: number;
  config: SandLevelItemConfig;
}

export const LEVEL_CONFIG: Record<number, SandLevelItemConfig> = {
  1: { name: 'хв', color: '#10b981' },
  2: { name: 'год', color: '#06b6d4' },
  3: { name: 'дн', color: '#3b82f6' },
  4: { name: 'тиж', color: '#8b5cf6' },
  5: { name: 'міс', color: '#ec4899' },
  6: { name: 'р', color: '#f59e0b' },
};

export function getLevelCounts(daysCount: number): SandLevelItem[] {
  if (!daysCount || daysCount <= 0) return [];

  // Convert days to total minutes
  const totalMinutes = Math.floor(daysCount * 24 * 60);
  if (totalMinutes <= 0) return [];

  const years = Math.floor(totalMinutes / (365 * 24 * 60));
  let rem = totalMinutes % (365 * 24 * 60);

  const months = Math.floor(rem / (30 * 24 * 60));
  rem = rem % (30 * 24 * 60);

  const weeks = Math.floor(rem / (7 * 24 * 60));
  rem = rem % (7 * 24 * 60);

  const days = Math.floor(rem / (24 * 60));
  rem = rem % (24 * 60);

  const hours = Math.floor(rem / 60);
  const minutes = rem % 60;

  const result: SandLevelItem[] = [];

  if (minutes > 0) {
    result.push({ level: 1, count: minutes, config: LEVEL_CONFIG[1] });
  }
  if (hours > 0) {
    result.push({ level: 2, count: hours, config: LEVEL_CONFIG[2] });
  }
  if (days > 0) {
    result.push({ level: 3, count: days, config: LEVEL_CONFIG[3] });
  }
  if (weeks > 0) {
    result.push({ level: 4, count: weeks, config: LEVEL_CONFIG[4] });
  }
  if (months > 0) {
    result.push({ level: 5, count: months, config: LEVEL_CONFIG[5] });
  }
  if (years > 0) {
    result.push({ level: 6, count: years, config: LEVEL_CONFIG[6] });
  }

  return result;
}
