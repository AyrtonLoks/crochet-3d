import React from 'react';
import { Bookmark, Sparkles } from 'lucide-react';
import { useCrochetStore } from '@/store/useCrochetStore';
import { useSocialStore } from '@/store/useSocialStore';
import { ProjectCard } from './ProjectCard';

export const BookmarksTab: React.FC = () => {
  const { projects, setViewTab } = useCrochetStore();
  const { bookmarkedProjectIds } = useSocialStore();

  const bookmarkedList = projects.filter((p) =>
    bookmarkedProjectIds.includes(p.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-terracotta-500" />
          <span>Receitas Favoritas Salvas ({bookmarkedList.length})</span>
        </h2>
        <p className="text-xs text-stone-500">
          Projetos públicos da comunidade que você salvou para tecer depois
        </p>
      </div>

      {bookmarkedList.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-800 rounded-3xl border border-cream-200 dark:border-stone-700 p-8 space-y-3">
          <Bookmark className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto" />
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
            Nenhuma receita favoritada ainda
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Explore a Galeria da Comunidade e clique no ícone de salvar para guardar suas receitas preferidas aqui!
          </p>
          <button
            onClick={() => setViewTab('community')}
            className="px-5 py-2.5 rounded-xl bg-terracotta-500 text-white text-xs font-bold shadow-sm"
          >
            Explorar Galeria Comunitária
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bookmarkedList.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      )}
    </div>
  );
};
