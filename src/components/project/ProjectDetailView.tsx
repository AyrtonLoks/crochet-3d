import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Box,
  Download,
  Bookmark,
  Heart,
  Share2,
  Clock,
  Sparkles,
  Layers,
  Ruler,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useCrochetStore } from '@/store/useCrochetStore';
import { useSocialStore } from '@/store/useSocialStore';
import { FollowButton } from '@/components/community/FollowButton';
import { CommunityMakesSection } from '@/components/community/CommunityMakesSection';
import { PdfExporter } from '@/core/export/PdfExporter';
import { ShareAccessModal } from '@/components/shelf/ShareAccessModal';
import { PublicArtisanProfileModal } from '@/components/community/PublicArtisanProfileModal';
import { LiveTrackerView } from '@/components/tracker/LiveTrackerView';
import { ArtisanProfile } from '@/types/crochet';

export const ProjectDetailView: React.FC = () => {
  const {
    projects,
    selectedProjectDetailId,
    setSelectedProjectDetailId,
    projectDetailInitialMode,
    setProjectDetailInitialMode,
    setActiveProjectId,
    setViewTab,
    setCreationSubTab,
  } = useCrochetStore();

  const { isLiked, toggleLike, isBookmarked, toggleBookmark } = useSocialStore();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [activePartTab, setActivePartTab] = useState<string>('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<ArtisanProfile | null>(null);
  const [isCrocheting, setIsCrocheting] = useState(projectDetailInitialMode === 'tracker');

  useEffect(() => {
    setIsCrocheting(projectDetailInitialMode === 'tracker');
  }, [projectDetailInitialMode, selectedProjectDetailId]);

  const project = projects.find((p) => p.id === selectedProjectDetailId);

  if (!project) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <p className="text-sm text-stone-500">Projeto não encontrado.</p>
        <button
          onClick={() => {
            setSelectedProjectDetailId(null);
            setProjectDetailInitialMode('overview');
          }}
          className="px-4 py-2 rounded-xl bg-terracotta-500 text-white text-xs font-bold shadow-sm"
        >
          Voltar para a Galeria
        </button>
      </div>
    );
  }

  if (isCrocheting) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-16">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setIsCrocheting(false);
              setProjectDetailInitialMode('overview');
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-cream-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-cream-100 dark:hover:bg-stone-700 text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-terracotta-500" />
            <span>Voltar aos Detalhes do Projeto ({project.title})</span>
          </button>
        </div>

        <LiveTrackerView />
      </div>
    );
  }

  const currentPartId = activePartTab || project.parts[0]?.id || '';
  const currentPart = project.parts.find((p) => p.id === currentPartId) || project.parts[0];

  const liked = isLiked(project.id);
  const bookmarked = isBookmarked(project.id);
  const likesCount = (project.social?.likesCount || 0) + (liked ? 1 : 0);

  const totalRows = project.parts.reduce((sum, p) => sum + p.rows.length, 0);
  const totalStitches =
    project.totalStitchesEstimated ||
    project.parts.reduce(
      (sum, p) => sum + p.rows.reduce((s, r) => s + (r.stitchCount || 0), 0),
      0
    );

  const photos = project.galleryPhotos && project.galleryPhotos.length > 0
    ? project.galleryPhotos
    : [
        project.thumbnailUrl ||
          'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
      ];

  const handleStartCrocheting = () => {
    setActiveProjectId(project.id);
    setProjectDetailInitialMode('tracker');
    setIsCrocheting(true);
  };

  const handleOpenStudio = () => {
    setActiveProjectId(project.id);
    setCreationSubTab('studio');
    setSelectedProjectDetailId(null);
    setProjectDetailInitialMode('overview');
    setViewTab('creation');
  };

  const handleDownloadPdf = () => {
    PdfExporter.exportPatternToPdf(project);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Botão de Voltar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setSelectedProjectDetailId(null);
            setProjectDetailInitialMode('overview');
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-cream-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-cream-100 dark:hover:bg-stone-700 text-xs font-bold transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-terracotta-500" />
          <span>Voltar para a Galeria</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cream-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-cream-100 text-xs font-semibold"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartilhar</span>
          </button>
          <button
            onClick={() => toggleBookmark(project.id)}
            className={`p-2 rounded-xl border transition-all ${
              bookmarked
                ? 'bg-amber-400 text-stone-900 border-amber-500 shadow-sm'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-cream-300 dark:border-stone-700 hover:bg-cream-100'
            }`}
            title="Salvar nos Favoritos"
          >
            <Bookmark className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => toggleLike(project.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              liked
                ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-cream-300 dark:border-stone-700 hover:bg-cream-100'
            }`}
          >
            <Heart className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} />
            <span className="text-xs font-bold font-mono">{likesCount}</span>
          </button>
        </div>
      </div>

      {/* Hero Section: Foto Principal + Ficha Rápida */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Galeria de Fotos */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-[380px] sm:h-[460px] w-full rounded-3xl overflow-hidden shadow-lg border border-cream-200 dark:border-stone-800 bg-stone-900">
            <img
              src={photos[activePhotoIndex]}
              alt={project.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
            {/* Badges Flutuantes */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="text-xs uppercase font-bold px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-md">
                {project.category}
              </span>
              <span className="text-xs uppercase font-semibold px-3 py-1 rounded-full bg-terracotta-500 text-white shadow-sm">
                {project.difficulty}
              </span>
            </div>
          </div>

          {/* Miniaturas de Ângulos */}
          {photos.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {photos.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activePhotoIndex === idx
                      ? 'border-terracotta-500 ring-2 ring-terracotta-300 shadow-md scale-105'
                      : 'border-cream-300 dark:border-stone-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Ângulo ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Coluna Direita: Informações & Ações Principais */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white leading-tight">
              {project.title}
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
              {project.description || 'Receita completa modelada em 3D para crochê passo a passo.'}
            </p>
          </div>

          {/* Designer Card */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-stone-800 border border-cream-200 dark:border-stone-700 shadow-sm">
            <div
              onClick={() => {
                setSelectedArtisan({
                  id: project.designer.userId,
                  name: project.designer.name,
                  handle: project.designer.handle,
                  avatarUrl: project.designer.avatarUrl,
                  bio: 'Designer têxtil e autor desta receita exclusiva.',
                  dominantHand: 'right',
                  skillLevel: 'advanced',
                  tensionCalibration: { customGaugeEnabled: false, stitchesPer10cm: 22, rowsPer10cm: 24 },
                  stats: {
                    totalStitchesCrocheted: 35000,
                    totalMetersUsed: 950,
                    completedProjectsCount: 28,
                    followersCount: 312,
                    followingCount: 40,
                    earnedBadges: ['Designer Verificado'],
                  },
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                });
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img
                src={
                  project.designer.avatarUrl ||
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
                }
                alt={project.designer.name}
                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-terracotta-400"
              />
              <div>
                <div className="text-xs text-stone-400">Criado por</div>
                <div className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-terracotta-500 transition-colors">
                  {project.designer.name}
                </div>
                <div className="text-xs text-terracotta-600 dark:text-terracotta-400 font-medium">
                  {project.designer.handle}
                </div>
              </div>
            </div>

            <FollowButton artisanId={project.designer.userId} size="sm" />
          </div>

          {/* Métricas do Projeto */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-cream-100/70 dark:bg-stone-800 border border-cream-200 dark:border-stone-700">
              <div className="text-base font-bold text-stone-900 dark:text-white">
                🧶 {totalStitches.toLocaleString()}
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">Pontos Totais</div>
            </div>
            <div className="p-3 rounded-2xl bg-cream-100/70 dark:bg-stone-800 border border-cream-200 dark:border-stone-700">
              <div className="text-base font-bold text-stone-900 dark:text-white">
                {project.parts.length} peças
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">{totalRows} carreiras</div>
            </div>
            <div className="p-3 rounded-2xl bg-cream-100/70 dark:bg-stone-800 border border-cream-200 dark:border-stone-700">
              <div className="text-base font-bold text-stone-900 dark:text-white">
                {project.materials.hooks[0] || 2.5} mm
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">Agulha Recomendada</div>
            </div>
          </div>

          {/* Botões de Ação Destacados */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleStartCrocheting}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-sm font-extrabold shadow-lg shadow-terracotta-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Tecer Agora no Modo Crochetagem</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleOpenStudio}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-cream-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-cream-50 dark:hover:bg-stone-700 text-xs font-bold transition-all shadow-sm"
              >
                <Box className="w-4 h-4 text-terracotta-500" />
                <span>Ver & Editar no Studio 3D</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-cream-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-cream-50 dark:hover:bg-stone-700 text-xs font-bold transition-all shadow-sm"
              >
                <Download className="w-4 h-4 text-terracotta-500" />
                <span>Baixar PDF com Fotos</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Caixa de Materiais & Ingredientes */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-800 border border-cream-200 dark:border-stone-700 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-terracotta-500" />
          <h2 className="text-base font-bold text-stone-900 dark:text-white">
            Ingredientes & Materiais Necessários
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Fios */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              🧶 Fios Sugeridos
            </h3>
            <div className="space-y-2">
              {project.materials.yarns.map((yarn, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-cream-50 dark:bg-stone-900/60 border border-cream-200 dark:border-stone-700 text-xs"
                >
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-sm flex-shrink-0"
                    style={{ backgroundColor: yarn.color }}
                  />
                  <div>
                    <div className="font-bold text-stone-800 dark:text-stone-200">
                      {yarn.yarnId}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Aprox. {yarn.estimatedMeters}m ({yarn.estimatedGrams}g)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agulhas */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              🪡 Agulhas de Crochê
            </h3>
            <div className="p-3 rounded-xl bg-cream-50 dark:bg-stone-900/60 border border-cream-200 dark:border-stone-700 space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
              {project.materials.hooks.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-terracotta-500" />
                  <span className="font-semibold">{h} mm</span>
                  <span className="text-stone-400 text-[11px]">(ou tamanho para sua tensão)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acessórios */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              ✂️ Acessórios & Aviamentos
            </h3>
            <div className="p-3 rounded-xl bg-cream-50 dark:bg-stone-900/60 border border-cream-200 dark:border-stone-700 space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
              {project.materials.accessories.map((acc, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{acc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Seção da Receita Completa Peça por Peça */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-800 border border-cream-200 dark:border-stone-700 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream-200 dark:border-stone-700 pb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">
              Receita Detalhada por Peça
            </h2>
            <p className="text-xs text-stone-500">
              Selecione uma peça para visualizar todas as carreiras formatadas
            </p>
          </div>

          {/* Alternador de Peças */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {project.parts.map((p) => {
              const isSelected = p.id === currentPart.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePartTab(p.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-terracotta-500 text-white shadow-sm'
                      : 'bg-cream-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <span>{p.name}</span>
                  <span className="text-[10px] opacity-80 font-mono">({p.rows.length} carr)</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de Carreiras da Peça Selecionada */}
        <div className="space-y-2">
          {currentPart.rows.map((row) => (
            <div
              key={row.rowNumber}
              className="flex items-start justify-between gap-4 p-3 rounded-xl bg-cream-50/70 dark:bg-stone-900/60 border border-cream-200 dark:border-stone-700/80 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-terracotta-600 dark:text-terracotta-400 font-mono">
                    Carr {row.rowNumber}:
                  </span>
                  <span className="text-stone-800 dark:text-stone-200 font-medium">
                    {row.instructionText}
                  </span>
                </div>
                {row.notes && (
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                    💡 {row.notes}
                  </p>
                )}
              </div>

              <span className="font-mono font-bold px-2 py-0.5 rounded bg-cream-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] flex-shrink-0">
                {row.stitchCount} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Community Makes */}
      <CommunityMakesSection projectId={project.id} />

      {/* Modais de Compartilhamento e Perfil */}
      <ShareAccessModal
        project={project}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <PublicArtisanProfileModal
        artisan={selectedArtisan}
        isOpen={Boolean(selectedArtisan)}
        onClose={() => setSelectedArtisan(null)}
      />
    </div>
  );
};
