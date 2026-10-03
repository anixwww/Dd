import { create } from 'zustand';

interface UIStoreState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showBottomNav: boolean;
  setShowBottomNav: (show: boolean) => void;
  isZenMode: boolean;
  setIsZenMode: (zen: boolean) => void;
}

export const useUIStore = create<UIStoreState>((set) => ({
  activeTab: 'counter',
  setActiveTab: (tab) => set({ activeTab: tab }),
  showBottomNav: true,
  setShowBottomNav: (show) => set({ showBottomNav: show }),
  isZenMode: false,
  setIsZenMode: (zen) => set({ isZenMode: zen }),
}));
