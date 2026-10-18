import { describe, it, expect } from 'vitest';
import { CrochetParserPtBr } from '@/core/parser/CrochetParserPtBr';
import { CrochetParserUs } from '@/core/parser/CrochetParserUs';
import { PatternValidator } from '@/core/parser/PatternValidator';

describe('CrochetParserPtBr', () => {
  it('deve interpretar anel mágico inicial', () => {
    const text = 'Carr 1: 6 pb no anel mágico';
    const rows = CrochetParserPtBr.parse(text);
    expect(rows).toHaveLength(1);
    expect(rows[0].stitchCount).toBe(6);
    expect(rows[0].stitches[0].type).toBe('pb');
  });

  it('deve interpretar carreiras com aumentos simples e repetições', () => {
    const text = `
      Carr 1: 6 pb no am
      Carr 2: 6 aum (12)
      Carr 3: [1 pb, 1 aum] x 6 (18)
    `;
    const rows = CrochetParserPtBr.parse(text);
    expect(rows).toHaveLength(3);
    expect(rows[0].stitchCount).toBe(6);
    expect(rows[1].stitchCount).toBe(12);
    expect(rows[2].stitchCount).toBe(18);
  });

  it('deve interpretar carreiras lineares com correntinhas', () => {
    const text = '1. 20 corr + 1 para virar\n2. 20 pb';
    const rows = CrochetParserPtBr.parse(text);
    expect(rows).toHaveLength(2);
    expect(rows[0].type).toBe('linear');
  });
  it('deve interpretar carreiras com intervalos (ex: Carr 5-8: 24 pb)', () => {
    const text = `
      Carr 1: 6 pb no am
      Carr 2: 6 aum (12)
      Carr 3-5: 12 pb
    `;
    const rows = CrochetParserPtBr.parse(text);
    expect(rows).toHaveLength(5);
    expect(rows[2].rowNumber).toBe(3);
    expect(rows[3].rowNumber).toBe(4);
    expect(rows[4].rowNumber).toBe(5);
    expect(rows[2].stitchCount).toBe(12);
    expect(rows[3].stitchCount).toBe(12);
    expect(rows[4].stitchCount).toBe(12);
  });

  it('deve interpretar repetições com pontos antes e depois (prefixo e sufixo)', () => {
    const text = 'Carr 4: 2 pb, [1 pb, 1 aum] x 6, 2 pb (22)';
    const rows = CrochetParserPtBr.parse(text);
    expect(rows).toHaveLength(1);
    expect(rows[0].stitchCount).toBe(22);
    // 2 pb + 6 pb + 6 aum + 2 pb = 10 pb e 6 aum
    const pbCount = rows[0].stitches.filter(s => s.type === 'pb').reduce((acc, s) => acc + s.count, 0);
    const aumCount = rows[0].stitches.filter(s => s.type === 'aum').reduce((acc, s) => acc + s.count, 0);
    expect(pbCount).toBe(10);
    expect(aumCount).toBe(6);
  });
});

describe('CrochetParserUs', () => {
  it('deve interpretar anel mágico e repetições no formato US', () => {
    const text = `
      Rnd 1: 6 sc in magic ring
      Rnd 2: 6 inc (12)
      Rnd 3: [1 sc, 1 inc] * 6 (18)
      Rnd 4: [1 sc, 1 dec] * 6 (12)
    `;
    const rows = CrochetParserUs.parse(text);
    expect(rows).toHaveLength(4);
    expect(rows[0].stitchCount).toBe(6);
    expect(rows[1].stitchCount).toBe(12);
    expect(rows[2].stitchCount).toBe(18);
    expect(rows[3].stitchCount).toBe(12);
  });

  it('deve interpretar intervalos no formato US (ex: Rnds 5-7: 24 sc)', () => {
    const text = `
      Rnd 1: 6 sc in mr
      Rnds 2-4: 6 sc
    `;
    const rows = CrochetParserUs.parse(text);
    expect(rows).toHaveLength(4);
    expect(rows[1].rowNumber).toBe(2);
    expect(rows[2].rowNumber).toBe(3);
    expect(rows[3].rowNumber).toBe(4);
  });
});

describe('PatternValidator', () => {
  it('não deve emitir alertas para receitas matemáticas consistentes', () => {
    const rows = [
      { rowNumber: 1, instructionText: '6 pb no am', stitchCount: 6, type: 'round' as const, stitches: [{ type: 'pb' as const, count: 6 }] },
      { rowNumber: 2, instructionText: '6 aum', stitchCount: 12, type: 'round' as const, stitches: [{ type: 'aum' as const, count: 6 }] },
    ];
    const issues = PatternValidator.validate(rows);
    expect(issues).toHaveLength(0);
  });

  it('deve emitir alerta e sugestão quando a carreira consome pontos divergentes da base', () => {
    const rows = [
      { rowNumber: 1, instructionText: '6 pb no am', stitchCount: 6, type: 'round' as const, stitches: [{ type: 'pb' as const, count: 6 }] },
      { rowNumber: 2, instructionText: '8 aum', stitchCount: 16, type: 'round' as const, stitches: [{ type: 'aum' as const, count: 8 }] },
    ];
    const issues = PatternValidator.validate(rows);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].message).toContain('a fórmula requer 8 pontos de base, mas a Carreira 1 possui 6 pontos');
    expect(issues[0].suggestion).toBeDefined();
  });

  it('deve emitir alerta quando os pontos tecidos na carreira divergem do total informado', () => {
    const rows = [
      { rowNumber: 1, instructionText: '6 pb no am', stitchCount: 6, type: 'round' as const, stitches: [{ type: 'pb' as const, count: 6 }] },
      { rowNumber: 2, instructionText: '6 aum', stitchCount: 18, type: 'round' as const, stitches: [{ type: 'aum' as const, count: 6 }] },
    ];
    const issues = PatternValidator.validate(rows);
    expect(issues.some(i => i.message.includes('difere do total indicado'))).toBe(true);
  });

  it('todos os modelos padrão (PRESET_PROJECTS) devem passar na validação sem erros de contagem de pontos', async () => {
    const { PRESET_PROJECTS } = await import('@/data/presetProjects');
    for (const project of PRESET_PROJECTS) {
      for (const part of project.parts) {
        // Valida carreiras circulares
        const roundRows = part.rows.filter(r => r.type === 'round');
        if (roundRows.length > 0) {
          const issues = PatternValidator.validate(roundRows);
          expect(issues).toEqual([]);
        }
      }
    }
  });
});

describe('PatternTranslator', () => {
  it('deve traduzir corretamente termos de pt-BR para US', async () => {
    const { PatternTranslator } = await import('@/core/parser/PatternTranslator');
    const ptText = `Carr 1: 6 pb no anel mágico
Carr 2: 6 aum (12 pts)
Carr 3: [1 pb, 1 aum] x 6 (18 pts)`;

    const usText = PatternTranslator.translatePtBrToUs(ptText);
    expect(usText).toContain('Rnd 1: 6 sc in mr');
    expect(usText).toContain('Rnd 2: 6 inc (12 sts)');
    expect(usText).toContain('Rnd 3: [1 sc, 1 inc] x 6 (18 sts)');
  });

  it('deve traduzir corretamente termos de US para pt-BR', async () => {
    const { PatternTranslator } = await import('@/core/parser/PatternTranslator');
    const usText = `Rnd 1: 6 sc in magic ring
Rnd 2: 6 inc (12 sts)
Rnd 3: [1 sc, 1 inc] * 6 (18 sts)`;

    const ptText = PatternTranslator.translateUsToPtBr(usText);
    expect(ptText).toContain('Carr 1: 6 pb no anel mágico');
    expect(ptText).toContain('Carr 2: 6 aum (12 pts)');
    expect(ptText).toContain('Carr 3: [1 pb, 1 aum] * 6 (18 pts)');
  });
});

