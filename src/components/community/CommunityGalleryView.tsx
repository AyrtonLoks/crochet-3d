import React, { useState } from 'react';
import { Search, Flame, Clock, Sparkles, Filter, Users } from 'lucide-react';
import { useCrochetStore } from '@/store/useCrochetStore';
import { ArtisanProfile, ProjectCategory, ProjectDifficulty } from '@/types/crochet';
import { CommunityProjectCard } from './CommunityProjectCard';
import { CommunityMakesSection } from './CommunityMakesSection';
import { PublicArtisanProfileModal } from './PublicArtisanProfileModal';

export const CommunityGalleryView: React.FC = () => {
  const { projects } = useCrochetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'recent'>('popular');
  const [inspectingArtisan, setInspectingArtisan] = useState<ArtisanProfile | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Todas as Categorias' },
    { id: 'amigurumi', label: 'Amigurumis 🧸' },
    { id: 'clothing', label: 'Roupas & Gorros 🧣' },
    { id: 'bags', label: 'Bolsas & Acessórios 👜' },
    { id: 'home', label: 'Casa & Decoração 🏡' },
  ];

  const difficulties: { id: string; label: string }[] = [
    { id: 'all', label: 'Qualquer Nível' },
    { id: 'beginner', label: 'Iniciante' },
    { id: 'intermediate', label: 'Intermediário' },
    { id: 'advanced', label: 'Avançado' },
  ];

  // Filtra apenas projetos públicos da comunidade
  const publicProjects = projects.filter((p) => p.visibility === 'public');

  const filtered = publicProjects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.designer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.designer.handle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    const matchDiff =
      selectedDifficulty === 'all' || p.difficulty === selectedDifficulty;

    return matchSearch && matchCategory && matchDiff;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'popular') {
      return (b.social?.likesCount || 0) - (a.social?.likesCount || 0);
    }
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-lg space-y-3 relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-amber-200">
            <Users className="w-3.5 h-3.5" /> Comunidade Aberta de Artesãos
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Descubra & Teça Receitas em 3D
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            Navegue por receitas modeladas pela comunidade, siga criadores talentosos e poste fotos das suas peças físicas concluídas.
          </p>
        </div>
      </div>

      {/* Busca & Filtros */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar modelos, bichinhos, gorros ou @artesão..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-2xl border border-cream-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-terracotta-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
            {/* Dificuldade */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-cream-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300"
            >
              {difficulties.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>

            {/* Ordenação */}
            <div className="inline-flex rounded-xl border border-cream-300 dark:border-stone-700 p-0.5 bg-cream-50 dark:bg-stone-900">
              <button
                onClick={() => setSortBy('popular')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'popular'
                    ? 'bg-terracotta-500 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Populares</span>
              </button>
              <button
                onClick={() => setSortBy('recent')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'recent'
                    ? 'bg-terracotta-500 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Recentes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categorias Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-terracotta-500 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-cream-200 dark:border-stone-700 hover:bg-cream-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Projetos Públicos */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-800 rounded-3xl border border-cream-200 dark:border-stone-700 p-8">
          <p className="text-sm text-stone-500">
            Nenhum projeto encontrado para os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((proj) => (
            <CommunityProjectCard
              key={proj.id}
              project={proj}
              onSelectArtisan={setInspectingArtisan}
            />
          ))}
        </div>
      )}

      {/* Seção Mural "Feito pela Comunidade" */}
      <CommunityMakesSection />

      {/* Modal de Perfil do Artesão */}
      <PublicArtisanProfileModal
        artisan={inspectingArtisan}
        isOpen={!!inspectingArtisan}
        onClose={() => setInspectingArtisan(null)}
      />
    </div>
  );
};
