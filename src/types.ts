export type TabType = 'counter' | 'health' | 'sos' | 'state' | 'more';

export interface MoneySettings {
  currency: string;
  pricePerPack: number;
  cigsPerPack: number;
  cigsPerDay: number;
  yearsSmoked?: number;
  customCigCost?: number;
}

export interface DayRating {
  date: string;
  rating: number; // 1-5
  cravingLevel?: number;
  moodLevel?: number;
  note?: string;
}

export interface Streak {
  startDate: string;
  endDate?: string;
  durationMs: number;
  reasonForRelapse?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  targetPrice?: number;
  cost?: number;
  icon?: string;
  category?: string;
  createdAt: number;
  isCustom?: boolean;
  completed?: boolean;
  completedAt?: number;
  imageUrl?: string;
}

export interface CompletedGoal extends SavingsGoal {
  completedAt: number;
}

export interface GoalsState {
  activeGoals: SavingsGoal[];
  completedGoals: CompletedGoal[];
  selectedGoalId?: string | null;
}

export interface TreeState {
  currentStage: number; // 0-4
  stageProgress: number; // 0-100
  speciesIndex: number;
  totalLeavesEarned: number;
  waterDrops: number;
  growthHistory: Array<{
    timestamp: number;
    stage: number;
    action: string;
  }>;
}

export interface HealthSlice {
  id?: string;
  timestamp: number;
  dateStr: string;
  timeStr: string;
  craving: number;
  thoughts: number;
  anxiety: number;
  irritability: number;
  calmness: number;
  energy: number;
  focus: number;
  overall: number;
  note?: string;
}
