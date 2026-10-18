import React from 'react';
import { Folder, Users, Bookmark } from 'lucide-react';
import { useCrochetStore, ShelfSubTab } from '@/store/useCrochetStore';
import { MyProjectsTab } from './MyProjectsTab';
import { SharedWithMeTab } from './SharedWithMeTab';
import { BookmarksTab } from './BookmarksTab';

export const ProjectShelfView: React.FC = () => {
  const { shelfSubTab, setShelfSubTab } = useCrochetStore();

  const tabs: { id: ShelfSubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'my-projects', label: 'Meus Projetos', icon: <Folder className="w-4 h-4" /> },
    { id: 'shared-with-me', label: 'Compartilhados Comigo', icon: <Users className="w-4 h-4" /> },
    { id: 'bookmarks', label: 'Favoritos', icon: <Bookmark className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tabs header */}
      <div className="flex items-center gap-1 border-b border-cream-200 dark:border-stone-800 pb-2">
        {tabs.map((tab) => {
          const isActive = shelfSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setShelfSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-terracotta-500 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-cream-100 dark:hover:bg-stone-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render selected subtab */}
      {shelfSubTab === 'my-projects' && <MyProjectsTab />}
      {shelfSubTab === 'shared-with-me' && <SharedWithMeTab />}
      {shelfSubTab === 'bookmarks' && <BookmarksTab />}
    </div>
  );
};
