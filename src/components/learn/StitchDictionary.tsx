import React, { useState } from 'react';
import { Search, BookOpen, Sparkles, Filter } from 'lucide-react';
import { STITCH_TUTORIALS } from '@/data/tutorialDatabase';
import { useProfileStore } from '@/store/useProfileStore';
import { StitchTutorial } from '@/types/crochet';
import { StitchSvgDiagram } from './StitchSvgDiagram';

export const StitchDictionary: React.FC = () => {
  const { profile, setDominantHand } = useProfileStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedTutorial, setSelectedTutorial] = useState<StitchTutorial | null>(null);

  const categories = [
    { id: 'todos', label: 'Todos os Pontos' },
    { id: 'inicio', label: 'Início & Anéis' },
    { id: 'basico', label: 'Básicos' },
    { id: 'altos', label: 'Altos & Duplos' },
    { id: 'modificadores', label: 'Aumentos & Diminuições' },
  ];

  const filtered = STITCH_TUTORIALS.filter((t) => {
    const matchSearch =
      t.namePt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nameUs.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.shortPt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.shortUs.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      selectedCategory === 'todos' || t.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Dominant Hand Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-stone-800 p-4 rounded-2xl border border-cream-200 dark:border-stone-700 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-terracotta-500" />
            <span>Dicionário Ilustrado de Pontos de Crochê</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Aprenda a técnica correta com instruções sob medida para sua mão dominante
          </p>
        </div>

        {/* Hand Toggle */}
        <div className="flex items-center gap-2 bg-cream-50 dark:bg-stone-900 p-1 rounded-xl border border-cream-300 dark:border-stone-700">
          <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 pl-2">
            Orientação:
          </span>
          <button
            onClick={() => setDominantHand('right')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              profile.dominantHand === 'right'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            ✋ Destro
          </button>
          <button
            onClick={() => setDominantHand('left')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              profile.dominantHand === 'left'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            🖐️ Canhoto
          </button>
        </div>
      </div>

      {/* Busca & Filtros */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por ponto, sigla pt-BR ou US (ex: pb, sc, anel mágico, diminuição)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-terracotta-400/40"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-terracotta-500 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-cream-200 dark:border-stone-700 hover:bg-cream-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Cards de Pontos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tutorial) => {
          const instructions =
            profile.dominantHand === 'left'
              ? tutorial.leftHandInstructions
              : tutorial.rightHandInstructions;

          return (
            <div
              key={tutorial.id}
              className="bg-white dark:bg-stone-800 rounded-2xl border border-cream-200 dark:border-stone-700 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-700 dark:text-terracotta-300">
                    {tutorial.shortPt} / {tutorial.shortUs}
                  </span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cream-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                    {tutorial.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  {tutorial.namePt}
                </h3>
                <p className="text-[11px] text-stone-500 mb-2">
                  US: <i>{tutorial.nameUs}</i>
                </p>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-3">
                  {tutorial.description}
                </p>

                {/* Ilustração Vetorial SVG Passo a Passo */}
                <div className="my-3">
                  <StitchSvgDiagram
                    stitchId={tutorial.id}
                    isLeftHanded={profile.dominantHand === 'left'}
                  />
                </div>

                {/* Resumo do Passo a Passo */}
                <div className="space-y-1.5 border-t border-cream-200 dark:border-stone-700 pt-3">
                  <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                    Como Fazer ({profile.dominantHand === 'left' ? 'Mão Esquerda 🖐️' : 'Mão Direita ✋'}):
                  </div>
                  <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
                    {instructions.map((st, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-terracotta-500 font-bold">{i + 1}.</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {tutorial.tips && tutorial.tips.length > 0 && (
                <div className="bg-amber-50/80 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 italic mt-3">
                  💡 <b>Dica de Ouro:</b> {tutorial.tips[0]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
