import React from 'react';
import { Award, Sparkles, TrendingUp } from 'lucide-react';
import { useProfileStore } from '@/store/useProfileStore';

export const StatsBadgesCard: React.FC = () => {
  const { profile } = useProfileStore();
  const { stats } = profile;

  return (
    <div className="space-y-4">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
        <div className="bg-cream-50 dark:bg-stone-800 p-3 rounded-2xl border border-cream-200 dark:border-stone-700">
          <div className="text-lg font-black text-stone-900 dark:text-white font-mono text-terracotta-600 dark:text-terracotta-400">
            {stats.totalStitchesCrocheted.toLocaleString()}
          </div>
          <div className="text-[10px] text-stone-500 font-medium">Pontos Tecidos</div>
        </div>

        <div className="bg-cream-50 dark:bg-stone-800 p-3 rounded-2xl border border-cream-200 dark:border-stone-700">
          <div className="text-lg font-black text-stone-900 dark:text-white font-mono">
            {stats.totalMetersUsed} m
          </div>
          <div className="text-[10px] text-stone-500 font-medium">Fio Consumido</div>
        </div>

        <div className="bg-cream-50 dark:bg-stone-800 p-3 rounded-2xl border border-cream-200 dark:border-stone-700">
          <div className="text-lg font-black text-stone-900 dark:text-white font-mono">
            {stats.completedProjectsCount}
          </div>
          <div className="text-[10px] text-stone-500 font-medium">Peças Concluídas</div>
        </div>

        <div className="bg-cream-50 dark:bg-stone-800 p-3 rounded-2xl border border-cream-200 dark:border-stone-700">
          <div className="text-lg font-black text-stone-900 dark:text-white font-mono">
            {stats.followersCount}
          </div>
          <div className="text-[10px] text-stone-500 font-medium">Seguidores</div>
        </div>
      </div>

      {/* Insígnias Conquistadas */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Suas Conquistas & Insígnias</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {stats.earnedBadges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
