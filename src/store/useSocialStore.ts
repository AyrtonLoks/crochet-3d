import { create } from 'zustand';
import { CrochetProject, ProjectShareEntry } from '@/types/crochet';
import { ShareService } from '@/core/services/ShareService';

interface SocialState {
  followedArtisanIds: string[];
  likedProjectIds: string[];
  bookmarkedProjectIds: string[];
  redeemedProjects: { project: CrochetProject; share: ProjectShareEntry }[];

  toggleFollow: (artisanId: string) => void;
  toggleLike: (projectId: string) => void;
  toggleBookmark: (projectId: string) => void;
  redeemToken: (token: string) => Promise<{ success: boolean; project?: CrochetProject; message: string }>;
  isFollowing: (artisanId: string) => boolean;
  isLiked: (projectId: string) => boolean;
  isBookmarked: (projectId: string) => boolean;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  followedArtisanIds: ['artisan-clara'],
  likedProjectIds: ['project-polvo-amigurumi'],
  bookmarkedProjectIds: ['project-polvo-amigurumi', 'project-coracao-3d'],
  redeemedProjects: [],

  toggleFollow: (artisanId) => {
    const list = get().followedArtisanIds;
    const exists = list.includes(artisanId);
    set({
      followedArtisanIds: exists ? list.filter((id) => id !== artisanId) : [...list, artisanId],
    });
  },

  toggleLike: (projectId) => {
    const list = get().likedProjectIds;
    const exists = list.includes(projectId);
    set({
      likedProjectIds: exists ? list.filter((id) => id !== projectId) : [...list, projectId],
    });
  },

  toggleBookmark: (projectId) => {
    const list = get().bookmarkedProjectIds;
    const exists = list.includes(projectId);
    set({
      bookmarkedProjectIds: exists ? list.filter((id) => id !== projectId) : [...list, projectId],
    });
  },

  redeemToken: async (token) => {
    const result = await ShareService.redeemToken(token);
    if (!result) {
      return { success: false, message: 'Chave ou link de convite inválido ou expirado.' };
    }

    const current = get().redeemedProjects;
    if (!current.some((item) => item.project.id === result.project.id)) {
      set({
        redeemedProjects: [...current, result],
      });
    }

    return {
      success: true,
      project: result.project,
      message: `Acesso liberado com sucesso como ${result.share.permission === 'editor' ? 'Co-autor' : 'Visualizador'}!`,
    };
  },

  isFollowing: (artisanId) => get().followedArtisanIds.includes(artisanId),
  isLiked: (projectId) => get().likedProjectIds.includes(projectId),
  isBookmarked: (projectId) => get().bookmarkedProjectIds.includes(projectId),
}));
