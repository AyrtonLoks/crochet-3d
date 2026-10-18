import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCrochetStore } from '@/store/useCrochetStore';
import { PRESET_PROJECTS } from '@/data/presetProjects';

describe('useCrochetStore - Navegação e Modo Crochetagem', () => {
  beforeEach(() => {
    useCrochetStore.setState({
      projects: PRESET_PROJECTS,
      activeProjectId: PRESET_PROJECTS[0]?.id || '',
      activePartId: PRESET_PROJECTS[0]?.parts[0]?.id || '',
      viewTab: 'community',
      creationSubTab: 'studio',
      shelfSubTab: 'my-projects',
      selectedProjectDetailId: null,
      projectDetailInitialMode: 'overview',
    });
  });

  it('deve inicializar com as 4 abas principais corretas e valores padrão', () => {
    const state = useCrochetStore.getState();
    expect(state.viewTab).toBe('community');
    expect(state.creationSubTab).toBe('studio');
    expect(state.projectDetailInitialMode).toBe('overview');
    expect(state.selectedProjectDetailId).toBeNull();
  });

  it('deve permitir alternar sub-abas de criação incluindo tracker', () => {
    useCrochetStore.getState().setCreationSubTab('pattern');
    expect(useCrochetStore.getState().creationSubTab).toBe('pattern');

    useCrochetStore.getState().setCreationSubTab('tracker');
    expect(useCrochetStore.getState().creationSubTab).toBe('tracker');

    useCrochetStore.getState().setCreationSubTab('studio');
    expect(useCrochetStore.getState().creationSubTab).toBe('studio');
  });

  it('deve abrir projeto diretamente no tracker via openProjectInTracker', () => {
    const targetProject = PRESET_PROJECTS[1] || PRESET_PROJECTS[0];
    const expectedPartId = targetProject.parts[0]?.id || '';

    useCrochetStore.getState().openProjectInTracker(targetProject.id);

    const state = useCrochetStore.getState();
    expect(state.activeProjectId).toBe(targetProject.id);
    expect(state.activePartId).toBe(expectedPartId);
    expect(state.selectedProjectDetailId).toBe(targetProject.id);
    expect(state.projectDetailInitialMode).toBe('tracker');
  });

  it('deve atualizar projectDetailInitialMode via setProjectDetailInitialMode', () => {
    useCrochetStore.getState().setProjectDetailInitialMode('tracker');
    expect(useCrochetStore.getState().projectDetailInitialMode).toBe('tracker');

    useCrochetStore.getState().setProjectDetailInitialMode('overview');
    expect(useCrochetStore.getState().projectDetailInitialMode).toBe('overview');
  });

  it('deve lidar com ID inexistente em openProjectInTracker sem quebrar', () => {
    useCrochetStore.getState().openProjectInTracker('non-existent-id');

    const state = useCrochetStore.getState();
    expect(state.activeProjectId).toBe('non-existent-id');
    expect(state.activePartId).toBe('');
    expect(state.selectedProjectDetailId).toBe('non-existent-id');
    expect(state.projectDetailInitialMode).toBe('tracker');
  });

  it('deve resetar projectDetailInitialMode para overview ao chamar setSelectedProjectDetailId', () => {
    // 1. Abre no tracker
    const targetProject = PRESET_PROJECTS[0];
    useCrochetStore.getState().openProjectInTracker(targetProject.id);
    expect(useCrochetStore.getState().projectDetailInitialMode).toBe('tracker');

    // 2. Fecha detalhes (ex: ao navegar de volta para galeria)
    useCrochetStore.getState().setSelectedProjectDetailId(null);
    expect(useCrochetStore.getState().selectedProjectDetailId).toBeNull();
    expect(useCrochetStore.getState().projectDetailInitialMode).toBe('overview');

    // 3. Abre outro projeto normalmente (visão de detalhes)
    const secondProject = PRESET_PROJECTS[1] || PRESET_PROJECTS[0];
    useCrochetStore.getState().setSelectedProjectDetailId(secondProject.id);
    expect(useCrochetStore.getState().selectedProjectDetailId).toBe(secondProject.id);
    expect(useCrochetStore.getState().projectDetailInitialMode).toBe('overview');
  });

  it('deve suportar alternância entre as 4 abas estritas', () => {
    const tabs: ('community' | 'shelf' | 'creation' | 'learn')[] = [
      'community',
      'shelf',
      'creation',
      'learn',
    ];

    for (const tab of tabs) {
      useCrochetStore.getState().setViewTab(tab);
      expect(useCrochetStore.getState().viewTab).toBe(tab);
    }
  });
});
