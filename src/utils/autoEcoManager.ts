/**
 * Auto-Eco Manager
 * Automatically enables Performance Optimization Mode when battery level drops below user-specified threshold,
 * and restores normal mode when plugged in or charged.
 */

export const AUTO_ECO_KEYS = {
  ENABLED: 'quit-smoking:auto-eco-enabled',
  THRESHOLD: 'quit-smoking:auto-eco-threshold',
  TRIGGERED: 'quit-smoking:auto-eco-triggered',
  PERF_BOOST: 'quit-smoking:perf-boost',
};

export interface AutoEcoState {
  enabled: boolean;
  threshold: number; // e.g. 15, 20, 30
  batteryLevel: number | null; // 0 to 100
  isCharging: boolean | null;
  isBatterySupported: boolean;
  isAutoEcoActive: boolean; // currently triggered by low battery
}

export function getAutoEcoConfig() {
  let enabled = true;
  let threshold = 20;

  try {
    const savedEnabled = localStorage.getItem(AUTO_ECO_KEYS.ENABLED);
    if (savedEnabled !== null) {
      enabled = savedEnabled === 'true';
    } else {
      localStorage.setItem(AUTO_ECO_KEYS.ENABLED, 'true');
    }
    const savedThreshold = localStorage.getItem(AUTO_ECO_KEYS.THRESHOLD);
    if (savedThreshold) {
      threshold = parseInt(savedThreshold, 10) || 20;
    } else {
      localStorage.setItem(AUTO_ECO_KEYS.THRESHOLD, '20');
    }
  } catch {}

  return { enabled, threshold };
}

export function setAutoEcoConfig(enabled: boolean, threshold?: number) {
  try {
    localStorage.setItem(AUTO_ECO_KEYS.ENABLED, String(enabled));
    if (threshold !== undefined) {
      localStorage.setItem(AUTO_ECO_KEYS.THRESHOLD, String(threshold));
    }
    window.dispatchEvent(new CustomEvent('auto-eco-config-change', { detail: { enabled, threshold } }));
  } catch {}
}

export function checkAndApplyAutoEco(
  batteryLevel: number,
  isCharging: boolean,
  onPerfBoostChange?: (boost: boolean) => void
): boolean {
  const { enabled, threshold } = getAutoEcoConfig();
  if (!enabled) return false;

  const isLow = batteryLevel <= threshold && !isCharging;
  const wasTriggered = sessionStorage.getItem(AUTO_ECO_KEYS.TRIGGERED) === 'true';

  if (isLow) {
    // Need to activate perf boost
    try {
      sessionStorage.setItem(AUTO_ECO_KEYS.TRIGGERED, 'true');
      localStorage.setItem(AUTO_ECO_KEYS.PERF_BOOST, 'true');
      document.documentElement.setAttribute('data-perf-boost', 'true');
      window.dispatchEvent(new Event('perf-boost-change'));
      if (onPerfBoostChange) onPerfBoostChange(true);
    } catch {}
    return true;
  } else if (wasTriggered && (isCharging || batteryLevel > threshold)) {
    // Battery recovered or plugged into charger -> restore standard
    try {
      sessionStorage.removeItem(AUTO_ECO_KEYS.TRIGGERED);
      localStorage.setItem(AUTO_ECO_KEYS.PERF_BOOST, 'false');
      document.documentElement.setAttribute('data-perf-boost', 'false');
      window.dispatchEvent(new Event('perf-boost-change'));
      if (onPerfBoostChange) onPerfBoostChange(false);
    } catch {}
    return false;
  }

  return wasTriggered;
}
