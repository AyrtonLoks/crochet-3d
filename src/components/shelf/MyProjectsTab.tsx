import React from 'react';
import { Plus, FolderPlus } from 'lucide-react';
import { useCrochetStore } from '@/store/useCrochetStore';
import { ProjectCard } from './ProjectCard';

export const MyProjectsTab: React.FC = () => {
  const { projects, createProject, setActiveProjectId, setViewTab, setCreationSubTab } = useCrochetStore();

  const handleCreate = async () => {
    const title = prompt('Título do Novo Projeto:', 'Novo Amigurumi');
    if (title) {
      const newId = await createProject(title.trim());
      setActiveProjectId(newId);
      setCreationSubTab('studio');
      setViewTab('creation');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-stone-800 dark:text-stone-200">
            Meus Projetos Criados ({projects.length})
          </h2>
          <p className="text-xs text-stone-500">
            Gerencie seus modelos, defina privacidade e compartilhe com convidados
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-md shadow-terracotta-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Projeto</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-800 rounded-3xl border border-cream-200 dark:border-stone-700 p-8 space-y-3">
          <FolderPlus className="w-12 h-12 text-terracotta-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
            Sua prateleira está vazia
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Comece criando seu primeiro projeto 3D de crochê agora mesmo!
          </p>
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 rounded-xl bg-terracotta-500 text-white text-xs font-bold"
          >
            Criar Primeiro Modelo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      )}
    </div>
  );
};
