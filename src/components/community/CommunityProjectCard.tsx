import React from 'react';
import { Heart, Bookmark, Play, Box, Camera } from 'lucide-react';
import { CrochetProject, ArtisanProfile } from '@/types/crochet';
import { useSocialStore } from '@/store/useSocialStore';
import { useCrochetStore } from '@/store/useCrochetStore';
import { FollowButton } from './FollowButton';

interface CommunityProjectCardProps {
  project: CrochetProject;
  onSelectArtisan: (artisan: ArtisanProfile | null) => void;
}

export const CommunityProjectCard: React.FC<CommunityProjectCardProps> = ({
  project,
  onSelectArtisan,
}) => {
  const { toggleLike, isLiked, toggleBookmark, isBookmarked } = useSocialStore();
  const { setActiveProjectId, setViewTab, setSelectedProjectDetailId } = useCrochetStore();

  const liked = isLiked(project.id);
  const bookmarked = isBookmarked(project.id);
  const likesCount = (project.social?.likesCount || 0) + (liked ? 1 : 0);

  const handleOpenDetail = () => {
    setSelectedProjectDetailId(project.id);
  };

  const handleOpenStudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveProjectId(project.id);
    setViewTab('creation');
  };

  const handleOpenTracker = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveProjectId(project.id);
    setViewTab('tracker');
  };

  return (
    <div
      onClick={handleOpenDetail}
      className="bg-white dark:bg-stone-800 rounded-3xl border border-cream-200 dark:border-stone-700 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Imagem / Capa */}
        <div className="relative h-48 w-full bg-cream-100 dark:bg-stone-900 overflow-hidden">
          <img
            src={
              project.thumbnailUrl ||
              'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80'
            }
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Dificuldade & Categoria */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
              {project.category}
            </span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-terracotta-500 text-white shadow-sm">
              {project.difficulty}
            </span>
          </div>

          {/* Botões Flutuantes: Like e Bookmark */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              onClick={() => toggleBookmark(project.id)}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                bookmarked
                  ? 'bg-amber-400 text-stone-900 shadow-md'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
              title="Salvar nos Favoritos"
            >
              <Bookmark className="w-3.5 h-3.5" fill={bookmarked ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={() => toggleLike(project.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full backdrop-blur-md transition-all ${
                liked
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
              title="Curtir receita"
            >
              <Heart className="w-3.5 h-3.5" fill={liked ? 'currentColor' : 'none'} />
              <span className="text-xs font-bold font-mono">{likesCount}</span>
            </button>
          </div>

          {/* Contador de Makes */}
          <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium">
            <Camera className="w-3 h-3 text-terracotta-400" />
            <span>{project.social?.makesCount || 0} tecidos pela comunidade</span>
          </div>
        </div>

        {/* Informações da Receita */}
        <div className="p-4 space-y-3">
          {/* Autor */}
          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                onSelectArtisan({
                  id: project.designer.userId,
                  name: project.designer.name,
                  handle: project.designer.handle,
                  avatarUrl: project.designer.avatarUrl,
                  bio: 'Designer apaixonado por criações têxteis em 3D.',
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
              className="flex items-center gap-2 cursor-pointer group/author"
            >
              <img
                src={
                  project.designer.avatarUrl ||
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
                }
                alt={project.designer.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-terracotta-400"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover/author:text-terracotta-500 transition-colors truncate">
                  {project.designer.name}
                </div>
                <div className="text-[10px] text-terracotta-600 dark:text-terracotta-400 font-medium">
                  {project.designer.handle}
                </div>
              </div>
            </div>

            <FollowButton artisanId={project.designer.userId} size="sm" />
          </div>

          <h3 className="text-sm font-bold text-stone-900 dark:text-white line-clamp-1">
            {project.title}
          </h3>

          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>
      </div>

      {/* Ações */}
      <div className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleOpenStudio}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-cream-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-cream-50 dark:hover:bg-stone-700 text-xs font-semibold transition-colors"
          >
            <Box className="w-3.5 h-3.5" />
            <span>Ver no 3D</span>
          </button>

          <button
            onClick={handleOpenTracker}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Tecer Peça</span>
          </button>
        </div>
      </div>
    </div>
  );
};
