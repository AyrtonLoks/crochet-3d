import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { MeshSlicer } from '@/core/engine/MeshSlicer';
import { RecipeToMesh } from '@/core/engine/RecipeToMesh';

describe('MeshSlicer', () => {
  it('deve fatiar esfera em carreiras de amigurumi com anel mágico', async () => {
    const rows = MeshSlicer.sliceGeometryToPattern({
      shape: 'sphere',
      dimensionsCm: { width: 6, height: 6, depth: 6 },
    });

    expect(rows.length).toBeGreaterThan(3);
    expect(rows[0].stitches[0].type).toBe('pb');
    expect(rows[0].stitchCount).toBe(6);

    // Valida consistência matemática das carreiras fatiadas
    const { PatternValidator } = await import('@/core/parser/PatternValidator');
    const issues = PatternValidator.validate(rows);
    expect(issues).toEqual([]);
  });

  it('deve expandir a contagem total de pontos em carreiras com repetições', () => {
    const rows = MeshSlicer.sliceGeometryToPattern({
      shape: 'sphere',
      dimensionsCm: { width: 8, height: 8, depth: 8 },
    });

    for (const r of rows) {
      const generated = r.stitches.reduce((sum, s) => sum + (s.type === 'aum' ? s.count * 2 : s.count), 0);
      expect(generated).toBe(r.stitchCount);
    }
  });

  it('deve fatiar caixa em carreiras lineares', () => {
    const rows = MeshSlicer.sliceGeometryToPattern({
      shape: 'box',
      dimensionsCm: { width: 10, height: 5, depth: 2 },
    });

    expect(rows.length).toBeGreaterThan(2);
    expect(rows[0].type).toBe('linear');
  });
});

describe('RecipeToMesh', () => {
  it('deve gerar geometria Three.js válida com posições e normais a partir das carreiras', () => {
    const sampleRows = [
      { rowNumber: 1, instructionText: '6 pb no am', stitchCount: 6, type: 'round' as const, stitches: [{ type: 'pb' as const, count: 6 }] },
      { rowNumber: 2, instructionText: '12 pb', stitchCount: 12, type: 'round' as const, stitches: [{ type: 'pb' as const, count: 12 }] },
      { rowNumber: 3, instructionText: '6 pb', stitchCount: 6, type: 'round' as const, stitches: [{ type: 'pb' as const, count: 6 }] },
    ];

    const geom = RecipeToMesh.generateGeometryFromRows(sampleRows);
    expect(geom).toBeDefined();
    expect(geom.getAttribute('position')).toBeDefined();
    expect(geom.getAttribute('normal')).toBeDefined();
    expect(geom.getAttribute('uv')).toBeDefined();
    expect(geom.getIndex()).toBeDefined();

    // Deve possuir polos fechados (número de triângulos > 0 e índices válidos)
    const indices = geom.getIndex();
    expect(indices).not.toBeNull();
    expect(indices!.count).toBeGreaterThan(100);
  });
});

describe('ShareService', () => {
  it('deve criar link de compartilhamento e resgatar token válido', async () => {
    const { ShareService } = await import('@/core/services/ShareService');
    const { db } = await import('@/core/storage/db');
    const { PRESET_PROJECTS } = await import('@/data/presetProjects');

    // Assegura banco populado
    await db.projects.bulkPut(PRESET_PROJECTS);

    const share = await ShareService.createShareLink(
      'project-polvo-amigurumi',
      'viewer',
      false
    );

    expect(share.accessToken).toBeDefined();
    expect(share.allowPdfDownload).toBe(false);

    const redeemed = await ShareService.redeemToken(share.accessToken!);
    expect(redeemed).not.toBeNull();
    expect(redeemed?.project.id).toBe('project-polvo-amigurumi');
    expect(redeemed?.share.permission).toBe('viewer');
    expect(redeemed?.share.allowPdfDownload).toBe(false);
  });
});
