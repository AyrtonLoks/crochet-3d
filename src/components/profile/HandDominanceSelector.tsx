import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { DominantHand } from '@/types/crochet';

export const HandDominanceSelector: React.FC = () => {
  const { profile, setDominantHand } = useProfileStore();

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
        Mão Dominante (Ergonomia da Tecelagem)
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setDominantHand('right')}
          className={`p-3 rounded-xl border text-left transition-all ${
            profile.dominantHand === 'right'
              ? 'border-terracotta-500 bg-terracotta-50 dark:bg-terracotta-900/40 text-terracotta-800 dark:text-terracotta-200 shadow-sm'
              : 'border-cream-300 dark:border-stone-700 hover:bg-cream-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300'
          }`}
        >
          <div className="font-bold text-xs flex items-center gap-1.5">
            <span>✋ Destro</span>
          </div>
          <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
            Sentido anti-horário e tutoriais com a agulha na mão direita
          </div>
        </button>

        <button
          type="button"
          onClick={() => setDominantHand('left')}
          className={`p-3 rounded-xl border text-left transition-all ${
            profile.dominantHand === 'left'
              ? 'border-terracotta-500 bg-terracotta-50 dark:bg-terracotta-900/40 text-terracotta-800 dark:text-terracotta-200 shadow-sm'
              : 'border-cream-300 dark:border-stone-700 hover:bg-cream-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300'
          }`}
        >
          <div className="font-bold text-xs flex items-center gap-1.5">
            <span>🖐️ Canhoto</span>
          </div>
          <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
            Sentido horário espelhado e tutoriais com a agulha na mão esquerda
          </div>
        </button>
      </div>
    </div>
  );
};
