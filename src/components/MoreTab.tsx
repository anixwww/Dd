import React, { useState } from 'react';
import { Settings, Shield, Moon, Droplets, Trophy, Sliders, Info, Heart, RotateCcw } from 'lucide-react';
import { MoneySettings } from '../types';
import { QuickMechanicsDrawer, QuickMechanicsSection } from './QuickMechanicsDrawer';

interface MoreTabProps {
  moneySettings?: MoneySettings;
  money?: MoneySettings;
  onOpenSettings?: () => void;
  onOpenReset?: () => void;
  onOpenSetup?: () => void;
  onOpenRelapse?: () => void;
  onSwitchTab?: (tab: any) => void;
  overlaySectionKey?: string | null;
  onCloseOverlay?: () => void;
  reasons?: string[];
  streaks?: any[];
  currentStart?: number;
  totalFreeMs?: number;
  longestStreakMs?: number;
  goals?: any;
  totalSaved?: number;
  cigsAvoided?: number;
  days?: any;
  currentAccent?: string;
  onUpdateAccent?: (accent: string) => void;
  onUpdateMoney?: (money: any) => void;
  onAddGoal?: (goal: any) => void;
  onCompleteGoal?: (id: string) => void;
  onDeleteGoal?: (id: string) => void;
  onAddReason?: (reason: string) => void;
  onDeleteReason?: (idx: number) => void;
  onUndoLastRelapse?: () => void;
  onOpenOnboarding?: () => void;
  indicatorStyle?: any;
  onUpdateIndicatorStyle?: (st: any) => void;
  showTimerHint?: boolean;
  onUpdateTimerHint?: (val: boolean) => void;
  economyMode?: boolean;
  onUpdateEconomyMode?: (val: boolean) => void;
  appTheme?: string;
  onUpdateAppTheme?: (theme: string) => void;
  windowsOpacity?: number;
  onUpdateWindowsOpacity?: (op: number) => void;
}

export const MoreTab: React.FC<MoreTabProps> = ({
  moneySettings,
  money,
  onOpenSettings,
  onOpenReset,
  onOpenSetup,
  onOpenRelapse,
  onSwitchTab,
  overlaySectionKey,
  onCloseOverlay,
  onUpdateMoney,
  onUpdateAppTheme,
  appTheme
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerSection, setDrawerSection] = useState<QuickMechanicsSection>('menu');

  const activeMoney = money || moneySettings || { perDay: 20, packPrice: 100, packSize: 20, cur: '₴' };

  // If overlaySectionKey is passed from App.tsx (e.g. 'mechanics', 'daily_checkin', etc.)
  const isOverlayOpen = Boolean(overlaySectionKey);
  const initialOverlaySection: QuickMechanicsSection =
    overlaySectionKey === 'mechanics'
      ? 'daily_checkin'
      : (overlaySectionKey as QuickMechanicsSection) || 'menu';

  return (
    <>
      <div className="w-full max-w-md mx-auto p-4 space-y-4 text-white pb-24">
        {/* Quick Mechanics Button */}
        <div className="p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-3">
          <h3 className="text-sm font-bold text-zinc-200">Щоденні механіки здоров'я</h3>
          <p className="text-xs text-zinc-400">
            Пройдіть чек-ін, відстежуйте воду, сон, фізичну активність та швидкі 8D-зрізи стану.
          </p>
          <button
            onClick={() => {
              setDrawerSection('daily_checkin');
              setIsDrawerOpen(true);
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold transition-colors cursor-pointer"
          >
            Відкрити щоденний чек-ін
          </button>
        </div>

        {/* Parameters */}
        <div className="p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-200">Параметри калькулятора</h3>
            <Settings className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-xs text-zinc-400 space-y-1">
            <div>Сигарет на день: <span className="text-zinc-200 font-bold">{activeMoney.perDay || activeMoney.cigsPerDay || 20}</span></div>
            <div>Ціна пачки: <span className="text-zinc-200 font-bold">{activeMoney.packPrice || activeMoney.pricePerPack || 100} {activeMoney.cur || activeMoney.currency || '₴'}</span></div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={onOpenSetup || onOpenSettings}
              className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Змінити дату / дані
            </button>
            <button
              onClick={onOpenRelapse || onOpenReset}
              className="py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
              title="Скинути таймер"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* About App */}
        <div className="p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-2">
          <h3 className="text-sm font-bold text-zinc-200">Про застосунок NoSmo</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Науковий персональний помічник звільнення від нікотину з живим ШІ-аналізом стану, когнітивним CBT-помічником та моніторингом хвиль тяги.
          </p>
        </div>
      </div>

      {/* QuickMechanics Drawer for direct clicks or App.tsx overlays */}
      <QuickMechanicsDrawer
        isOpen={isOverlayOpen || isDrawerOpen}
        initialSection={isOverlayOpen ? initialOverlaySection : drawerSection}
        onClose={() => {
          setIsDrawerOpen(false);
          onCloseOverlay?.();
        }}
      />
    </>
  );
};
