import { create } from 'zustand';

interface SettingsStoreState {
  visualStyle: string;
  setVisualStyle: (style: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  themeAccent: string;
  setThemeAccent: (accent: string) => void;
  money: any;
  setMoney: (money: any) => void;
  economyMode: boolean;
  setEconomyMode: (mode: boolean) => void;
  appTheme: string;
  setAppTheme: (theme: string) => void;
}

export const useSettingsStore = create<SettingsStoreState>((set) => ({
  visualStyle: 'cat',
  setVisualStyle: (style) => set({ visualStyle: style }),
  soundEnabled: true,
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  themeAccent: 'amber',
  setThemeAccent: (accent) => set({ themeAccent: accent }),
  money: 0,
  setMoney: (money) => set({ money }),
  economyMode: false,
  setEconomyMode: (economyMode) => set({ economyMode }),
  appTheme: 'dark',
  setAppTheme: (appTheme) => set({ appTheme }),
}));
