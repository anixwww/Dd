import React from 'react';
import { Flame, Clock } from 'lucide-react';

export const ToughestTimeChart: React.FC<any> = () => {
  return (
    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-white space-y-3">
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-amber-400" />
        <h4 className="text-xs font-bold">Піки тяги протягом доби</h4>
      </div>
      <p className="text-[11px] text-zinc-400">
        Найбільш вразливі години: ранок (8:00 - 9:30) та вечір (19:00 - 20:30). Застосовуйте техніки заміщення.
      </p>
    </div>
  );
};
