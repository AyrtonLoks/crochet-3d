import { create } from 'zustand';
import { ArtisanProfile, DominantHand } from '@/types/crochet';
import { DEFAULT_USER_PROFILE } from '@/data/communityPresets';
import { db } from '@/core/storage/db';

interface ProfileState {
  profile: ArtisanProfile;
  setProfile: (profile: ArtisanProfile) => void;
  updateProfile: (data: Partial<ArtisanProfile>) => Promise<void>;
  setDominantHand: (hand: DominantHand) => Promise<void>;
  incrementStitches: (stitchesCount: number, metersApprox?: number) => Promise<void>;
  loadProfileFromDb: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: DEFAULT_USER_PROFILE,

  setProfile: (profile) => set({ profile }),

  updateProfile: async (data) => {
    const updated = {
      ...get().profile,
      ...data,
      updatedAt: Date.now(),
    };
    set({ profile: updated });
    await db.profiles.put(updated);
  },

  setDominantHand: async (hand) => {
    const updated = {
      ...get().profile,
      dominantHand: hand,
      updatedAt: Date.now(),
    };
    set({ profile: updated });
    await db.profiles.put(updated);
  },

  incrementStitches: async (stitchesCount, metersApprox = 0.08) => {
    const current = get().profile;
    const totalStitches = current.stats.totalStitchesCrocheted + stitchesCount;
    const totalMeters = Number((current.stats.totalMetersUsed + stitchesCount * metersApprox).toFixed(1));

    const earnedBadges = [...current.stats.earnedBadges];
    if (totalStitches >= 50 && !earnedBadges.includes('Primeiro Ponto')) {
      earnedBadges.push('Primeiro Ponto');
    }
    if (totalStitches >= 500 && !earnedBadges.includes('Mestre do Anel Mágico')) {
      earnedBadges.push('Mestre do Anel Mágico');
    }
    if (totalStitches >= 2000 && !earnedBadges.includes('Maratona Noturna')) {
      earnedBadges.push('Maratona Noturna');
    }
    if (totalStitches >= 10000 && !earnedBadges.includes('Centurião dos Fios')) {
      earnedBadges.push('Centurião dos Fios');
    }

    const updated: ArtisanProfile = {
      ...current,
      stats: {
        ...current.stats,
        totalStitchesCrocheted: totalStitches,
        totalMetersUsed: totalMeters,
        earnedBadges,
      },
      updatedAt: Date.now(),
    };

    set({ profile: updated });
    await db.profiles.put(updated);
  },

  loadProfileFromDb: async () => {
    try {
      const stored = await db.profiles.get('current-user');
      if (stored) {
        set({ profile: stored });
      }
    } catch (err) {
      console.warn('Erro ao carregar perfil do DB:', err);
    }
  },
}));
