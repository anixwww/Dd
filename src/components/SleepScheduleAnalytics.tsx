import React from 'react';
import { Moon, Clock, Sparkles } from 'lucide-react';

export const SleepScheduleAnalytics: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-white">
      <div className="flex items-center gap-2">
        <Moon className="w-4 h-4 text-indigo-400" />
        <h4 className="text-xs font-bold">Аналітика сну</h4>
      </div>
      <p className="text-[11px] text-zinc-400">
        Якісний сон прискорює детоксикацію мозку та знижує ранкову тягу на 60%.
      </p>
    </div>
  );
};
