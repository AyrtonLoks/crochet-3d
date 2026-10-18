import { create } from 'zustand';
import {
  CrochetProject,
  ProjectPart,
  PatternRow,
  PrimitiveShape,
  MainTab,
  CreationSubTab,
} from '@/types/crochet';
import { PRESET_PROJECTS } from '@/data/presetProjects';
import { db } from '@/core/storage/db';

export type { MainTab, CreationSubTab };
export type ShelfSubTab = 'my-projects' | 'shared-with-me' | 'bookmarks';

interface CrochetState {
  projects: CrochetProject[];
  activeProjectId: string;
  activePartId: string;
  viewTab: MainTab;
  creationSubTab: CreationSubTab;
  shelfSubTab: ShelfSubTab;
  selectedProjectDetailId: string | null;
  projectDetailInitialMode: 'overview' | 'tracker';
  trackerIsPlaying: boolean;
  ttsEnabled: boolean;
  voiceCommandsEnabled: boolean;
  isMuted: boolean;
  isLoading: boolean;

  // Setters
  setViewTab: (tab: MainTab) => void;
  setCreationSubTab: (subTab: CreationSubTab) => void;
  setShelfSubTab: (subTab: ShelfSubTab) => void;
  setSelectedProjectDetailId: (id: string | null) => void;
  setProjectDetailInitialMode: (mode: 'overview' | 'tracker') => void;
  openProjectInTracker: (projectId: string) => void;
  setTrackerIsPlaying: (playing: boolean) => void;
  toggleTrackerPlay: () => void;
  setTtsEnabled: (enabled: boolean) => void;
  setVoiceCommandsEnabled: (enabled: boolean) => void;
  setIsMuted: (muted: boolean) => void;
  setActiveProjectId: (id: string) => void;
  setActivePartId: (id: string) => void;

  // DB Sync
  loadProjects: () => Promise<void>;
  saveProjectToDb: (project: CrochetProject) => Promise<void>;

  // Project CRUD
  createProject: (title?: string) => Promise<string>;
  updateProject: (id: string, updates: Partial<CrochetProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Parts CRUD
  addPart: (name: string, primitiveType?: PrimitiveShape, color?: string) => Promise<void>;
  updatePart: (partId: string, updates: Partial<ProjectPart>) => Promise<void>;
  duplicatePart: (partId: string) => Promise<void>;
  removePart: (partId: string) => Promise<void>;
  updatePartRows: (partId: string, rows: PatternRow[]) => Promise<void>;

  // Live Tracker navigation
  advanceStitch: () => void;
  rewindStitch: () => void;
  advanceRow: () => void;
  rewindRow: () => void;
  resetProgress: () => void;

  // Getters
  getActiveProject: () => CrochetProject | undefined;
  getActivePart: () => ProjectPart | undefined;
}

export const useCrochetStore = create<CrochetState>((set, get) => ({
  projects: PRESET_PROJECTS,
  activeProjectId: PRESET_PROJECTS[0]?.id || '',
  activePartId: PRESET_PROJECTS[0]?.parts[0]?.id || '',
  viewTab: 'community',
  creationSubTab: 'studio',
  shelfSubTab: 'my-projects',
  selectedProjectDetailId: null,
  projectDetailInitialMode: 'overview',
  trackerIsPlaying: false,
  ttsEnabled: false,
  voiceCommandsEnabled: false,
  isMuted: false,
  isLoading: false,

  setViewTab: (viewTab) => set({ viewTab }),
  setCreationSubTab: (creationSubTab) => set({ creationSubTab }),
  setShelfSubTab: (shelfSubTab) => set({ shelfSubTab }),
  setSelectedProjectDetailId: (selectedProjectDetailId) =>
    set({ selectedProjectDetailId, projectDetailInitialMode: 'overview' }),
  setProjectDetailInitialMode: (projectDetailInitialMode) => set({ projectDetailInitialMode }),
  openProjectInTracker: (projectId: string) => {
    const project = get().projects.find((p) => p.id === projectId);
    const activePartId = project?.parts[0]?.id || '';
    set({
      activeProjectId: projectId,
      activePartId,
      selectedProjectDetailId: projectId,
      projectDetailInitialMode: 'tracker',
    });
  },
  setTrackerIsPlaying: (trackerIsPlaying) => set({ trackerIsPlaying }),
  toggleTrackerPlay: () => set((state) => ({ trackerIsPlaying: !state.trackerIsPlaying })),
  setTtsEnabled: (ttsEnabled) => set({ ttsEnabled }),
  setVoiceCommandsEnabled: (voiceCommandsEnabled) => set({ voiceCommandsEnabled }),
  setIsMuted: (isMuted) => set({ isMuted }),

  setActiveProjectId: (activeProjectId) => {
    const project = get().projects.find((p) => p.id === activeProjectId);
    const activePartId = project?.parts[0]?.id || '';
    set({ activeProjectId, activePartId });
  },

  setActivePartId: (activePartId) => set({ activePartId }),

  loadProjects: async () => {
    set({ isLoading: true });
    try {
      const fromDb = await db.projects.toArray();
      if (fromDb.length > 0) {
        set({
          projects: fromDb,
          activeProjectId: fromDb[0].id,
          activePartId: fromDb[0].parts[0]?.id || '',
        });
      } else {
        await db.projects.bulkAdd(PRESET_PROJECTS);
        set({
          projects: PRESET_PROJECTS,
          activeProjectId: PRESET_PROJECTS[0].id,
          activePartId: PRESET_PROJECTS[0].parts[0]?.id || '',
        });
      }
    } catch (err) {
      console.warn('Erro ao carregar projetos do Dexie:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  saveProjectToDb: async (project) => {
    try {
      await db.projects.put(project);
    } catch (err) {
      console.error('Falha ao salvar projeto no Dexie:', err);
    }
  },

  createProject: async (title = 'Novo Projeto de Crochê') => {
    const newId = 'project-' + Date.now();
    const newPartId = 'part-main-' + Date.now();
    const newProject: CrochetProject = {
      id: newId,
      title,
      description: 'Projeto modelado no Crochê 3D Interativo',
      category: 'amigurumi',
      difficulty: 'beginner',
      visibility: 'private',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      designer: {
        userId: 'current-user',
        name: 'Artesão Criativo',
        handle: '@artesao_criativo',
        license: {
          allowSellingFinishedItems: true,
          allowSharingPattern: false,
          licenseText: 'Receita original.',
        },
      },
      journal: {
        userId: 'current-user',
        userHandle: '@artesao_criativo',
      },
      sharedWith: [],
      social: {
        likesCount: 0,
        makesCount: 0,
      },
      parts: [
        {
          id: newPartId,
          name: 'Parte Principal',
          color: '#f97316',
          yarnTypeId: 'cotton-amigurumi',
          hookSizeMm: 2.5,
          primitiveType: 'sphere',
          dimensionsCm: { width: 6, height: 6, depth: 6 },
          transform: {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
          rows: [
            {
              rowNumber: 1,
              instructionText: '6 pb no anel mágico',
              stitchCount: 6,
              type: 'round',
              stitches: [{ type: 'pb', count: 6 }],
            },
            {
              rowNumber: 2,
              instructionText: '6 aum',
              stitchCount: 12,
              type: 'round',
              stitches: [{ type: 'aum', count: 6 }],
            },
            {
              rowNumber: 3,
              instructionText: '[1 pb, 1 aum] x 6',
              stitchCount: 18,
              type: 'round',
              stitches: [{ type: 'pb', count: 6 }, { type: 'aum', count: 6 }],
            },
            {
              rowNumber: 4,
              instructionText: '18 pb',
              stitchCount: 18,
              type: 'round',
              stitches: [{ type: 'pb', count: 18 }],
            },
            {
              rowNumber: 5,
              instructionText: '[1 pb, 1 dim] x 6',
              stitchCount: 12,
              type: 'round',
              stitches: [{ type: 'pb', count: 6 }, { type: 'dim_inv', count: 6 }],
            },
            {
              rowNumber: 6,
              instructionText: '6 dim e arremate',
              stitchCount: 6,
              type: 'round',
              stitches: [{ type: 'dim_inv', count: 6 }],
            },
          ],
        },
      ],
      materials: {
        yarns: [{ yarnId: 'cotton-amigurumi', color: '#f97316', estimatedMeters: 20, estimatedGrams: 15 }],
        hooks: [2.5],
        accessories: [],
      },
      progress: {
        activePartId: newPartId,
        currentRowIndex: 0,
        currentStitchIndex: 0,
        completedPercentage: 0,
      },
    };

    const updatedProjects = [newProject, ...get().projects];
    set({
      projects: updatedProjects,
      activeProjectId: newId,
      activePartId: newPartId,
    });

    await get().saveProjectToDb(newProject);
    return newId;
  },

  updateProject: async (id, updates) => {
    const list = get().projects.map((p) => {
      if (p.id === id) {
        const updated = { ...p, ...updates, updatedAt: Date.now() };
        get().saveProjectToDb(updated);
        return updated;
      }
      return p;
    });
    set({ projects: list });
  },

  deleteProject: async (id) => {
    const filtered = get().projects.filter((p) => p.id !== id);
    const nextActiveId = filtered[0]?.id || '';
    const nextPartId = filtered[0]?.parts[0]?.id || '';
    set({
      projects: filtered,
      activeProjectId: nextActiveId,
      activePartId: nextPartId,
    });
    await db.projects.delete(id);
  },

  addPart: async (name, primitiveType = 'sphere', color = '#38bdf8') => {
    const activeProj = get().getActiveProject();
    if (!activeProj) return;

    const newPart: ProjectPart = {
      id: 'part-' + Date.now(),
      name,
      color,
      yarnTypeId: 'cotton-amigurumi',
      hookSizeMm: 2.5,
      primitiveType,
      dimensionsCm: { width: 5, height: 5, depth: 5 },
      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      rows: [
        {
          rowNumber: 1,
          instructionText: '6 pb no anel mágico',
          stitchCount: 6,
          type: 'round',
          stitches: [{ type: 'pb', count: 6 }],
        },
        {
          rowNumber: 2,
          instructionText: '6 aum',
          stitchCount: 12,
          type: 'round',
          stitches: [{ type: 'aum', count: 6 }],
        },
        {
          rowNumber: 3,
          instructionText: '12 pb em toda a volta',
          stitchCount: 12,
          type: 'round',
          stitches: [{ type: 'pb', count: 12 }],
        },
      ],
    };

    const updatedParts = [...activeProj.parts, newPart];
    await get().updateProject(activeProj.id, { parts: updatedParts });
    set({ activePartId: newPart.id });
  },

  updatePart: async (partId, updates) => {
    const activeProj = get().getActiveProject();
    if (!activeProj) return;

    const updatedParts = activeProj.parts.map((part) =>
      part.id === partId ? { ...part, ...updates } : part
    );

    await get().updateProject(activeProj.id, { parts: updatedParts });
  },

  duplicatePart: async (partId) => {
    const activeProj = get().getActiveProject();
    if (!activeProj) return;

    const target = activeProj.parts.find((p) => p.id === partId);
    if (!target) return;

    const duplicated: ProjectPart = {
      ...target,
      id: 'part-dup-' + Date.now(),
      name: `${target.name} (Cópia)`,
      transform: {
        ...target.transform,
        position: [
          target.transform.position[0] + 0.3,
          target.transform.position[1],
          target.transform.position[2] + 0.3,
        ],
      },
    };

    const updatedParts = [...activeProj.parts, duplicated];
    await get().updateProject(activeProj.id, { parts: updatedParts });
    set({ activePartId: duplicated.id });
  },

  removePart: async (partId) => {
    const activeProj = get().getActiveProject();
    if (!activeProj || activeProj.parts.length <= 1) return;

    const updatedParts = activeProj.parts.filter((p) => p.id !== partId);
    await get().updateProject(activeProj.id, { parts: updatedParts });
    set({ activePartId: updatedParts[0]?.id || '' });
  },

  updatePartRows: async (partId, rows) => {
    const activeProj = get().getActiveProject();
    if (!activeProj) return;

    const updatedParts = activeProj.parts.map((p) =>
      p.id === partId ? { ...p, rows } : p
    );

    await get().updateProject(activeProj.id, { parts: updatedParts });
  },

  advanceStitch: () => {
    const project = get().getActiveProject();
    const part = get().getActivePart();
    if (!project || !part || part.rows.length === 0) return;

    let { currentRowIndex, currentStitchIndex } = project.progress;
    const currentRow = part.rows[currentRowIndex];
    if (!currentRow) return;

    if (currentStitchIndex + 1 < currentRow.stitchCount) {
      currentStitchIndex += 1;
    } else {
      // Avança para a próxima carreira
      if (currentRowIndex + 1 < part.rows.length) {
        currentRowIndex += 1;
        currentStitchIndex = 0;
      }
    }

    const totalRows = part.rows.length;
    const completedPct = Math.min(100, Math.round(((currentRowIndex + (currentStitchIndex / (currentRow.stitchCount || 1))) / totalRows) * 100));

    get().updateProject(project.id, {
      progress: {
        ...project.progress,
        currentRowIndex,
        currentStitchIndex,
        completedPercentage: completedPct,
      },
    });
  },

  rewindStitch: () => {
    const project = get().getActiveProject();
    const part = get().getActivePart();
    if (!project || !part || part.rows.length === 0) return;

    let { currentRowIndex, currentStitchIndex } = project.progress;

    if (currentStitchIndex > 0) {
      currentStitchIndex -= 1;
    } else {
      if (currentRowIndex > 0) {
        currentRowIndex -= 1;
        const prevRow = part.rows[currentRowIndex];
        currentStitchIndex = Math.max(0, (prevRow?.stitchCount || 1) - 1);
      }
    }

    const totalRows = part.rows.length;
    const currentRow = part.rows[currentRowIndex];
    const completedPct = Math.min(100, Math.max(0, Math.round(((currentRowIndex + (currentStitchIndex / (currentRow?.stitchCount || 1))) / totalRows) * 100)));

    get().updateProject(project.id, {
      progress: {
        ...project.progress,
        currentRowIndex,
        currentStitchIndex,
        completedPercentage: completedPct,
      },
    });
  },

  advanceRow: () => {
    const project = get().getActiveProject();
    const part = get().getActivePart();
    if (!project || !part || part.rows.length === 0) return;

    let { currentRowIndex } = project.progress;
    if (currentRowIndex + 1 < part.rows.length) {
      currentRowIndex += 1;
    }

    const totalRows = part.rows.length;
    const completedPct = Math.min(100, Math.round(((currentRowIndex) / totalRows) * 100));

    get().updateProject(project.id, {
      progress: {
        ...project.progress,
        currentRowIndex,
        currentStitchIndex: 0,
        completedPercentage: completedPct,
      },
    });
  },

  rewindRow: () => {
    const project = get().getActiveProject();
    const part = get().getActivePart();
    if (!project || !part) return;

    let { currentRowIndex } = project.progress;
    if (currentRowIndex > 0) {
      currentRowIndex -= 1;
    }

    const totalRows = part.rows.length;
    const completedPct = Math.min(100, Math.max(0, Math.round(((currentRowIndex) / totalRows) * 100)));

    get().updateProject(project.id, {
      progress: {
        ...project.progress,
        currentRowIndex,
        currentStitchIndex: 0,
        completedPercentage: completedPct,
      },
    });
  },

  resetProgress: () => {
    const project = get().getActiveProject();
    if (!project) return;
    get().updateProject(project.id, {
      progress: {
        ...project.progress,
        currentRowIndex: 0,
        currentStitchIndex: 0,
        completedPercentage: 0,
      },
    });
  },

  getActiveProject: () => {
    const state = get();
    return state.projects.find((p) => p.id === state.activeProjectId) || state.projects[0];
  },

  getActivePart: () => {
    const project = get().getActiveProject();
    if (!project || project.parts.length === 0) return undefined;
    return project.parts.find((p) => p.id === get().activePartId) || project.parts[0];
  },
}));
