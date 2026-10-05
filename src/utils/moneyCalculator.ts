import { MoneySettings } from '../types';

export function calculateCigsAvoided(diffMs: number, settings: MoneySettings): number {
  if (diffMs <= 0 || !settings.cigsPerDay) return 0;
  const days = diffMs / (1000 * 60 * 60 * 24);
  return days * settings.cigsPerDay;
}

export function calculateTotalSaved(diffMs: number, settings: MoneySettings): number {
  if (diffMs <= 0 || !settings.cigsPerDay || !settings.pricePerPack || !settings.cigsPerPack) return 0;
  const cigs = calculateCigsAvoided(diffMs, settings);
  const costPerCig = settings.pricePerPack / settings.cigsPerPack;
  return cigs * costPerCig;
}
