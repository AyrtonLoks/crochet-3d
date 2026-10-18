import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Box,
  PlayCircle,
  BookOpen,
  FolderHeart,
  Users,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  UserCheck,
} from 'lucide-react';
import { useCrochetStore, MainTab } from '@/store/useCrochetStore';
import { useProfileStore } from '@/store/useProfileStore';

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProfile, onOpenAuth }) => {
  const { viewTab, setViewTab, isMuted, setIsMuted, setSelectedProjectDetailId } = useCrochetStore();
  const { profile } = useProfileStore();
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      }
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const navItems: { id: MainTab; label: string; icon: React.ReactNode }[] = [
    { id: 'community', label: 'Comunidade', icon: <Users className="w-4 h-4" /> },
    { id: 'shelf', label: 'Prateleira', icon: <FolderHeart className="w-4 h-4" /> },
    { id: 'learn', label: 'Tutoriais', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'creation', label: 'Criação', icon: <Box className="w-4 h-4" /> },
    { id: 'tracker', label: 'Modo Crochetagem', icon: <PlayCircle className="w-4 h-4" /> },
  ];

  const handleTabClick = (tabId: MainTab) => {
    setSelectedProjectDetailId(null);
    setViewTab(tabId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-cream-200 dark:border-stone-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => handleTabClick('community')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-terracotta-500 to-terracotta-400 text-white flex items-center justify-center shadow-md shadow-terracotta-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🧶</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-lg leading-tight tracking-tight text-stone-900 dark:text-white">
              Crochê 3D
              <Sparkles className="w-4 h-4 text-terracotta-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium leading-none">
              Modelador & Assistente Inteligente
            </p>
          </div>
        </div>

        {/* Central Navigation Tabs (Ordem: 1. Comunidade -> 2. Prateleira -> 3. Tutoriais -> 4. Criação -> 5. Tracker) */}
        <nav className="hidden md:flex items-center gap-1 bg-cream-100/70 dark:bg-stone-800/70 p-1 rounded-xl border border-cream-200 dark:border-stone-700">
          {navItems.map((item) => {
            const isActive = viewTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-stone-900 text-terracotta-600 dark:text-terracotta-400 shadow-sm border border-stone-200/50 dark:border-stone-700'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-stone-700/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Audio, Dark Mode & Profile */}
        <div className="flex items-center gap-2">
          {/* Mute Audio Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Áudio desativado' : 'Áudio ativado'}
            className="p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-cream-100 dark:hover:bg-stone-800 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDark ? 'Tema Claro' : 'Tema Escuro'}
            className="p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-cream-100 dark:hover:bg-stone-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Botão de Alternar Contas */}
          <button
            onClick={onOpenAuth}
            title="Alternar conta ou criar novo artesão"
            className="p-2 rounded-xl border border-cream-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-cream-100 dark:hover:bg-stone-800 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-terracotta-500" />
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-cream-200 dark:border-stone-700 bg-cream-50 dark:bg-stone-800 hover:border-terracotta-300 dark:hover:border-terracotta-600 transition-all group"
          >
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={profile.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-terracotta-400"
            />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-tight">
                {profile.name}
              </div>
              <div className="text-[10px] text-terracotta-600 dark:text-terracotta-400 font-medium">
                {profile.stats.totalStitchesCrocheted.toLocaleString()} pts
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Submenu Bar */}
      <div className="md:hidden flex items-center justify-around py-2 px-2 border-t border-cream-200 dark:border-stone-800 bg-cream-50 dark:bg-stone-900 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = viewTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap ${
                isActive
                  ? 'text-terracotta-600 dark:text-terracotta-400 font-bold'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
