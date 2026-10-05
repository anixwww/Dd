import React from 'react';
import { Flame, ShieldCheck, Activity } from 'lucide-react';

export const StateTriggersAnalytics: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3 text-white">
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-orange-400" />
        <h4 className="text-xs font-bold">Аналітика тригерів</h4>
      </div>
      <p className="text-[11px] text-zinc-400 leading-relaxed">
        Найчастіші тригери тяги: кава (42%), стрес на роботі (28%), відпочинок (15%). Використовуйте заміщення з розділу SOS.
      </p>
    </div>
  );
};
