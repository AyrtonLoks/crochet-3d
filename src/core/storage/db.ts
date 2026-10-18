import Dexie, { type EntityTable } from 'dexie';
import { CrochetProject, ArtisanProfile, ProjectShareEntry, CommunityMake } from '@/types/crochet';
import { PRESET_PROJECTS } from '@/data/presetProjects';
import { DEFAULT_USER_PROFILE, COMMUNITY_MAKES } from '@/data/communityPresets';

export class CrochetDatabase extends Dexie {
  projects!: EntityTable<CrochetProject, 'id'>;
  profiles!: EntityTable<ArtisanProfile, 'id'>;
  sharedProjects!: EntityTable<ProjectShareEntry, 'id'>;
  communityMakes!: EntityTable<CommunityMake, 'id'>;

  constructor() {
    super('Crochet3DDatabase');
    this.version(1).stores({
      projects: 'id, title, category, difficulty, visibility, createdAt, updatedAt',
      profiles: 'id, handle, name',
      sharedProjects: 'id, projectId, granteeHandle, accessToken',
      communityMakes: 'id, projectId, makerId, createdAt',
    });
  }

  async seedInitialData(): Promise<void> {
    const projectCount = await this.projects.count();
    if (projectCount === 0) {
      await this.projects.bulkAdd(PRESET_PROJECTS);
    }

    const profileCount = await this.profiles.count();
    if (profileCount === 0) {
      await this.profiles.add(DEFAULT_USER_PROFILE);
    }

    const makesCount = await this.communityMakes.count();
    if (makesCount === 0) {
      await this.communityMakes.bulkAdd(COMMUNITY_MAKES);
    }
  }
}

export const db = new CrochetDatabase();

// Auto-seed in browser
if (typeof window !== 'undefined') {
  db.seedInitialData().catch((err) => {
    console.error('Falha ao inicializar o banco IndexedDB:', err);
  });
}
