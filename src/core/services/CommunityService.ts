import { CommunityMake, CrochetProject, ArtisanProfile } from '@/types/crochet';
import { db } from '@/core/storage/db';
import { COMMUNITY_ARTISANS, COMMUNITY_MAKES } from '@/data/communityPresets';

export class CommunityService {
  /**
   * Retorna os projetos públicos da comunidade.
   */
  static async getPublicProjects(): Promise<CrochetProject[]> {
    return await db.projects.filter((p) => p.visibility === 'public').toArray();
  }

  /**
   * Retorna fotos postadas no mural 'Feito pela Comunidade'.
   */
  static async getCommunityMakes(projectId?: string): Promise<CommunityMake[]> {
    const all = await db.communityMakes.toArray();
    if (projectId) {
      return all.filter((m) => m.projectId === projectId);
    }
    return all.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Adiciona uma nova foto de peça física ao mural de um projeto.
   */
  static async addCommunityMake(make: Omit<CommunityMake, 'id' | 'createdAt' | 'likesCount'>): Promise<CommunityMake> {
    const newMake: CommunityMake = {
      ...make,
      id: 'make-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: Date.now(),
      likesCount: 1,
    };

    await db.communityMakes.put(newMake);

    // Incrementa contador do projeto
    const project = await db.projects.get(make.projectId);
    if (project) {
      project.social = {
        ...project.social,
        makesCount: (project.social.makesCount || 0) + 1,
      };
      await db.projects.put(project);
    }

    return newMake;
  }

  /**
   * Curtir uma foto do mural da comunidade.
   */
  static async likeMake(makeId: string): Promise<number> {
    const make = await db.communityMakes.get(makeId);
    if (make) {
      make.likesCount += 1;
      await db.communityMakes.put(make);
      return make.likesCount;
    }
    return 0;
  }

  /**
   * Retorna a lista de perfis de artesãos da comunidade.
   */
  static getCommunityArtisans(): ArtisanProfile[] {
    return COMMUNITY_ARTISANS;
  }

  /**
   * Encontra um artesão pelo ID ou @handle.
   */
  static getArtisan(idOrHandle: string): ArtisanProfile | undefined {
    return COMMUNITY_ARTISANS.find(
      (a) => a.id === idOrHandle || a.handle.toLowerCase() === idOrHandle.toLowerCase()
    );
  }
}
