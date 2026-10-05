import { MoneySettings } from '../types';

export function calculateCigsAvoided(timeInput: number | any[], settings: MoneySettings): number {
  let diffMs = 0;
  if (Array.isArray(timeInput)) {
    diffMs = timeInput.reduce((acc, interval) => {
      const from = Number(interval?.from);
      const to = Number(interval?.to);
      if (!isNaN(from) && !isNaN(to) && to > from) {
        return acc + (to - from);
      }
      return acc;
    }, 0);
  } else {
    diffMs = Number(timeInput) || 0;
  }

  const perDay = settings?.perDay ?? (settings as any)?.cigsPerDay ?? 20;

  if (diffMs <= 0 || !perDay) return 0;
  const days = diffMs / (1000 * 60 * 60 * 24);
  return days * perDay;
}

export function calculateTotalSaved(timeInput: number | any[], settings: MoneySettings): number {
  let diffMs = 0;
  if (Array.isArray(timeInput)) {
    diffMs = timeInput.reduce((acc, interval) => {
      const from = Number(interval?.from);
      const to = Number(interval?.to);
      if (!isNaN(from) && !isNaN(to) && to > from) {
        return acc + (to - from);
      }
      return acc;
    }, 0);
  } else {
    diffMs = Number(timeInput) || 0;
  }

  const perDay = settings?.perDay ?? (settings as any)?.cigsPerDay ?? 20;
  const packPrice = settings?.packPrice ?? (settings as any)?.pricePerPack ?? 100;
  const packSize = settings?.packSize ?? (settings as any)?.cigsPerPack ?? 20;

  if (diffMs <= 0 || !perDay || !packPrice || !packSize) return 0;
  const cigs = calculateCigsAvoided(timeInput, settings);
  const costPerCig = packPrice / packSize;
  return cigs * costPerCig;
}
