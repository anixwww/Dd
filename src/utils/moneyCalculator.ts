import { MoneySettings, PriceTier } from '../types';

export const DAY_MS = 24 * 60 * 60 * 1000;

export interface TimeInterval {
  from: number;
  to: number;
}

/**
 * Calculates total cigarettes avoided across all intervals.
 */
export function calculateCigsAvoided(
  intervals: TimeInterval[],
  money: MoneySettings | null
): number {
  if (!money || isNaN(Number(money.perDay)) || Number(money.perDay) <= 0) return 0;
  const perDay = Number(money.perDay);
  if (!Array.isArray(intervals) || intervals.length === 0) return 0;

  const totalMs = intervals.reduce((acc, int) => {
    if (!int) return acc;
    const from = Number(int.from);
    const to = Number(int.to);
    if (isNaN(from) || isNaN(to) || to <= from) return acc;
    return acc + (to - from);
  }, 0);

  if (isNaN(totalMs) || totalMs <= 0) return 0;
  const res = (totalMs / DAY_MS) * perDay;
  return isNaN(res) ? 0 : Math.max(0, res);
}

/**
 * Calculates total money saved across all intervals taking price history into account.
 * For each interval [from, to], if there are price tiers, we split the interval
 * at each tier timestamp and multiply the duration by the rate active during that sub-interval.
 */
export function calculateTotalSaved(
  intervals: TimeInterval[],
  money: MoneySettings | null
): number {
  if (!money || isNaN(Number(money.perDay)) || isNaN(Number(money.packSize)) || isNaN(Number(money.packPrice))) return 0;
  const perDay = Number(money.perDay);
  const packSize = Number(money.packSize);
  const packPrice = Number(money.packPrice);
  if (perDay <= 0 || packSize <= 0 || packPrice <= 0) return 0;
  if (!Array.isArray(intervals) || intervals.length === 0) return 0;

  const validIntervals = intervals
    .map((i) => {
      if (!i) return null;
      const from = Number(i.from);
      const to = Number(i.to);
      if (isNaN(from) || isNaN(to)) return null;
      return { from: Math.min(from, to), to: Math.max(from, to) };
    })
    .filter((i): i is { from: number; to: number } => i !== null && i.to > i.from);

  if (validIntervals.length === 0) return 0;

  const history =
    money.priceHistory && money.priceHistory.length > 0
      ? [...money.priceHistory]
          .filter(h => h && !isNaN(Number(h.timestamp)) && !isNaN(Number(h.packPrice)))
          .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
      : null;

  // If no price history, use simple formula
  if (!history || history.length === 0) {
    const totalMs = validIntervals.reduce((acc, i) => acc + (i.to - i.from), 0);
    if (isNaN(totalMs) || totalMs <= 0) return 0;
    const cigs = (totalMs / DAY_MS) * perDay;
    const res = (cigs / packSize) * packPrice;
    return isNaN(res) ? 0 : Math.max(0, res);
  }

  // Helper: get pack price active at timestamp t
  const getPriceAt = (t: number): number => {
    // If before first recorded tier, use first tier's price
    if (t < history[0].timestamp) return Number(history[0].packPrice) || packPrice;
    for (let i = history.length - 1; i >= 0; i--) {
      if (t >= history[i].timestamp) {
        return Number(history[i].packPrice) || packPrice;
      }
    }
    return packPrice;
  };

  let totalUah = 0;

  for (const interval of validIntervals) {
    // Collect all split points within [interval.from, interval.to]
    const splitPoints = [interval.from];
    for (const tier of history) {
      const tierTime = Number(tier.timestamp);
      if (tierTime > interval.from && tierTime < interval.to) {
        splitPoints.push(tierTime);
      }
    }
    splitPoints.push(interval.to);
    splitPoints.sort((a, b) => a - b);

    // Sum up each slice
    for (let j = 0; j < splitPoints.length - 1; j++) {
      const start = splitPoints[j];
      const end = splitPoints[j + 1];
      const durationMs = end - start;
      if (durationMs <= 0 || isNaN(durationMs)) continue;

      const price = getPriceAt(start);
      const sliceCigs = (durationMs / DAY_MS) * perDay;
      const sliceUah = (sliceCigs / packSize) * price;
      if (!isNaN(sliceUah)) {
        totalUah += sliceUah;
      }
    }
  }

  return isNaN(totalUah) ? 0 : Math.max(0, totalUah);
}
