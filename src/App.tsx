import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Viewport3D } from '@/components/studio/Viewport3D';
import { PartsList } from '@/components/studio/PartsList';
import { PrimitiveControls } from '@/components/studio/PrimitiveControls';
import { TransformGizmo } from '@/components/studio/TransformGizmo';
import { ImportModal } from '@/components/studio/ImportModal';
import { PatternTextEditor } from '@/components/pattern/PatternTextEditor';
import { PatternRowTable } from '@/components/pattern/PatternRowTable';
import { LiveTrackerView } from '@/components/tracker/LiveTrackerView';
import { StitchDictionary } from '@/components/learn/StitchDictionary';
import { YarnNeedleGuide } from '@/components/learn/YarnNeedleGuide';
import { ProjectShelfView } from '@/components/shelf/ProjectShelfView';
import { CommunityGalleryView } from '@/components/community/CommunityGalleryView';
import { ProfileModal } from '@/components/profile/ProfileModal';
import { useCrochetStore } from '@/store/useCrochetStore';
import { useProfileStore } from '@/store/useProfileStore';
import { FileText, Table, BookOpen, Ruler } from 'lucide-react';

export const App: React.FC = () => {
  const { viewTab, loadProjects } = useCrochetStore();
  const { loadProfileFromDb } = useProfileStore();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [patternSubTab, setPatternSubTab] = useState<'text' | 'table'>('text');
  const [learnSubTab, setLearnSubTab] = useState<'dictionary' | 'yarn'>('dictionary');

  useEffect(() => {
    loadProjects();
    loadProfileFromDb();
  }, [loadProjects, loadProfileFromDb]);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50/70 dark:bg-stone-900 text-stone-800 dark:text-stone-100 transition-colors">
      <Navbar onOpenProfile={() => setIsProfileModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: STUDIO 3D */}
        {viewTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 h-[600px] lg:h-[720px]">
              <Viewport3D />
            </div>

            <div className="lg:col-span-4 space-y-4">
              <PartsList onOpenImport={() => setIsImportModalOpen(true)} />
              <PrimitiveControls />
              <TransformGizmo />
            </div>
          </div>
        )}

        {/* TAB 2: EDITOR DE RECEITAS */}
        {viewTab === 'pattern' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between border-b border-cream-200 dark:border-stone-800 pb-3">
              <div>
                <h1 className="text-lg font-bold text-stone-900 dark:text-white">
                  Editor e Parser de Receita
                </h1>
                <p className="text-xs text-stone-500">
                  Edite visualmente carreira por carreira ou cole receitas de texto livre com conversão 3D
                </p>
              </div>

              <div className="flex items-center gap-1 bg-cream-100 dark:bg-stone-800 p-1 rounded-xl border border-cream-200 dark:border-stone-700">
                <button
                  onClick={() => setPatternSubTab('text')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    patternSubTab === 'text'
                      ? 'bg-white dark:bg-stone-900 text-terracotta-600 dark:text-terracotta-400 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Modo Texto Livre</span>
                </button>
                <button
                  onClick={() => setPatternSubTab('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    patternSubTab === 'table'
                      ? 'bg-white dark:bg-stone-900 text-terracotta-600 dark:text-terracotta-400 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Modo Tabela Visual</span>
                </button>
              </div>
            </div>

            {patternSubTab === 'text' ? <PatternTextEditor /> : <PatternRowTable />}
          </div>
        )}

        {/* TAB 3: MODO CROCHETAGEM */}
        {viewTab === 'tracker' && <LiveTrackerView />}

        {/* TAB 4: TUTORIAIS & DICIONÁRIO */}
        {viewTab === 'learn' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-cream-200 dark:border-stone-800 pb-2">
              <button
                onClick={() => setLearnSubTab('dictionary')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  learnSubTab === 'dictionary'
                    ? 'bg-terracotta-500 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 hover:bg-cream-100 dark:hover:bg-stone-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Dicionário de Pontos</span>
              </button>

              <button
                onClick={() => setLearnSubTab('yarn')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  learnSubTab === 'yarn'
                    ? 'bg-terracotta-500 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 hover:bg-cream-100 dark:hover:bg-stone-800'
                }`}
              >
                <Ruler className="w-4 h-4" />
                <span>Guia de Fios & Agulhas</span>
              </button>
            </div>

            {learnSubTab === 'dictionary' ? <StitchDictionary /> : <YarnNeedleGuide />}
          </div>
        )}

        {/* TAB 5: PRATELEIRA DE PROJETOS */}
        {viewTab === 'shelf' && <ProjectShelfView />}

        {/* TAB 6: GALERIA DA COMUNIDADE */}
        {viewTab === 'community' && <CommunityGalleryView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-cream-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 py-6 text-center text-xs text-stone-500 space-y-1">
        <p className="font-semibold text-stone-700 dark:text-stone-300">
          Crochê 3D Interativo 🧶✨ • Feito com amor para a comunidade de artesãos
        </p>
        <p className="text-[11px] text-stone-400">
          Modelagem Tridimensional • Shaders PBR Táteis • Modo Crochetagem Hands-Free com Voz • PDF Profissional
        </p>
      </footer>

      {/* Modais Globais */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
};

export default App;
