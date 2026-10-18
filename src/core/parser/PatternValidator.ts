import { PatternRow, ValidationIssue } from '@/types/crochet';

export class PatternValidator {
  /**
   * Valida a progressão matemática de pontos entre carreiras consecutivas.
   * Não trava a aplicação, apenas retorna avisos e sugestões de correção.
   */
  static validate(rows: PatternRow[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!rows || rows.length === 0) {
      return issues;
    }

    // Validação da primeira carreira
    if (rows.length > 0) {
      const firstRow = rows[0];
      let firstGen = 0;
      for (const s of firstRow.stitches) {
        firstGen += s.type === 'aum' ? s.count * 2 : s.count;
      }
      if (firstGen > 0 && firstRow.stitchCount > 0 && firstGen !== firstRow.stitchCount) {
        issues.push({
          rowIndex: 0,
          rowNumber: firstRow.rowNumber,
          type: 'warning',
          expectedCount: firstRow.stitchCount,
          actualCount: firstGen,
          message: `Carreira ${firstRow.rowNumber}: a soma dos pontos tecidos (${firstGen}) difere do total indicado (${firstRow.stitchCount}).`,
          suggestion: `Ajuste a contagem total para ${firstGen} pts ou corrija a quantidade de pontos.`,
        });
      }
    }

    for (let i = 1; i < rows.length; i++) {
      const prevRow = rows[i - 1];
      const currRow = rows[i];

      const prevStitches = prevRow.stitchCount || 6;
      let consumedFromBase = 0;
      let generatedInRow = 0;

      for (const step of currRow.stitches) {
        if (step.type === 'aum') {
          consumedFromBase += step.count * 1;
          generatedInRow += step.count * 2;
        } else if (step.type === 'dim' || step.type === 'dim_inv') {
          consumedFromBase += step.count * 2;
          generatedInRow += step.count * 1;
        } else {
          consumedFromBase += step.count;
          generatedInRow += step.count;
        }
      }

      // Validação interna da carreira: soma gerada vs stitchCount informado
      if (generatedInRow > 0 && currRow.stitchCount > 0 && generatedInRow !== currRow.stitchCount) {
        issues.push({
          rowIndex: i,
          rowNumber: currRow.rowNumber,
          type: 'warning',
          expectedCount: currRow.stitchCount,
          actualCount: generatedInRow,
          message: `Carreira ${currRow.rowNumber}: a soma dos pontos tecidos (${generatedInRow}) difere do total indicado (${currRow.stitchCount}).`,
          suggestion: `Ajuste o total para ${generatedInRow} pts ou alinhe a contagem de pontos.`,
        });
      }

      // Se a carreira anterior era circular e esta carreira consumiu mais/menos pontos que a anterior (exceto carreiras explícitas de junção de peças)
      const isJoinRow = /(?:una|unir|junte|juntar|join)/i.test(currRow.instructionText);
      if (!isJoinRow && currRow.type === 'round' && consumedFromBase > 0 && consumedFromBase !== prevStitches) {
        const diff = consumedFromBase - prevStitches;
        issues.push({
          rowIndex: i,
          rowNumber: currRow.rowNumber,
          type: 'warning',
          expectedCount: prevStitches,
          actualCount: consumedFromBase,
          message: `Carreira ${currRow.rowNumber}: a fórmula requer ${consumedFromBase} pontos de base, mas a Carreira ${prevRow.rowNumber} possui ${prevStitches} pontos (${diff > 0 ? `+${diff}` : diff}).`,
          suggestion: diff > 0
            ? `Diminua ${Math.abs(diff)} ponto(s) ou aumente a Carreira ${prevRow.rowNumber}.`
            : `Adicione ${Math.abs(diff)} ponto(s) simples para completar os ${prevStitches} pontos da base.`,
        });
      }
    }

    return issues;
  }
}
