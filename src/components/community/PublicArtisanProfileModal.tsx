import React from 'react';
import { X, Award, MapPin, Instagram, Globe, Sparkles } from 'lucide-react';
import { ArtisanProfile } from '@/types/crochet';
import { FollowButton } from './FollowButton';
import { useSocialStore } from '@/store/useSocialStore';
import { useCrochetStore } from '@/store/useCrochetStore';

interface PublicArtisanProfileModalProps {
  artisan: ArtisanProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PublicArtisanProfileModal: React.FC<PublicArtisanProfileModalProps> = ({
  artisan,
  isOpen,
  onClose,
}) => {
  const { isFollowing } = useSocialStore();
  const { projects, setSelectedProjectDetailId } = useCrochetStore();

  if (!isOpen || !artisan) return null;

  const following = isFollowing(artisan.id);
  const followerCount = artisan.stats.followersCount + (following ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl border border-cream-300 dark:border-stone-800 p-6 shadow-2xl space-y-5">
        {/* Top Header com Botão Fechar */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-wider">
            Perfil do Criador
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informações Básicas */}
        <div className="flex items-start gap-4">
          <img
            src={
              artisan.avatarUrl ||
              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
            }
            alt={artisan.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-terracotta-400 shadow-md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white truncate">
                {artisan.name}
              </h3>
              <FollowButton artisanId={artisan.id} size="sm" />
            </div>
            <div className="text-xs font-semibold text-terracotta-600 dark:text-terracotta-400">
              {artisan.handle}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              Nível: <span className="capitalize font-medium">{artisan.skillLevel}</span> • Mão:{' '}
              {artisan.dominantHand === 'left' ? 'Canhoto 🖐️' : 'Destro ✋'}
            </div>
          </div>
        </div>

        {/* Bio */}
        {artisan.bio && (
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-cream-50 dark:bg-stone-800/50 p-3 rounded-xl border border-cream-200 dark:border-stone-700">
            {artisan.bio}
          </p>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-cream-50 dark:bg-stone-800 p-2.5 rounded-xl border border-cream-200 dark:border-stone-700">
            <div className="text-base font-bold text-stone-900 dark:text-white font-mono">
              {artisan.stats.totalStitchesCrocheted.toLocaleString()}
            </div>
            <div className="text-[10px] text-stone-500">Pontos Tecidos</div>
          </div>
          <div className="bg-cream-50 dark:bg-stone-800 p-2.5 rounded-xl border border-cream-200 dark:border-stone-700">
            <div className="text-base font-bold text-stone-900 dark:text-white font-mono">
              {followerCount.toLocaleString()}
            </div>
            <div className="text-[10px] text-stone-500">Seguidores</div>
          </div>
          <div className="bg-cream-50 dark:bg-stone-800 p-2.5 rounded-xl border border-cream-200 dark:border-stone-700">
            <div className="text-base font-bold text-stone-900 dark:text-white font-mono">
              {artisan.stats.completedProjectsCount}
            </div>
            <div className="text-[10px] text-stone-500">Peças Concluídas</div>
          </div>
        </div>

        {/* Conquistas e Badges */}
        {artisan.stats.earnedBadges && artisan.stats.earnedBadges.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Insígnias Conquistadas</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {artisan.stats.earnedBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Receitas Publicadas por este Artesão */}
        <div className="space-y-2 pt-2 border-t border-cream-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Receitas Publicadas
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              {projects.filter((p) => p.designer.userId === artisan.id || p.designer.handle === artisan.handle).length} projetos
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {projects
              .filter((p) => p.designer.userId === artisan.id || p.designer.handle === artisan.handle)
              .map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectDetailId(proj.id);
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl bg-cream-50 dark:bg-stone-800 hover:bg-cream-100 dark:hover:bg-stone-700 border border-cream-200 dark:border-stone-700 cursor-pointer transition-all group/item"
                >
                  <img
                    src={proj.thumbnailUrl || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=100&q=80'}
                    alt={proj.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-stone-800 dark:text-stone-200 group-hover/item:text-terracotta-500 transition-colors truncate">
                      {proj.title}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      {proj.difficulty}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Links Sociais */}
        {artisan.socialLinks && (
          <div className="flex items-center gap-3 pt-2 border-t border-cream-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
            {artisan.socialLinks.instagram && (
              <span className="flex items-center gap-1">
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                <span>{artisan.socialLinks.instagram}</span>
              </span>
            )}
            {artisan.socialLinks.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>{artisan.socialLinks.website}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
