import { PatternRow, StitchStep } from '@/types/crochet';

export class CrochetParserPtBr {
  /**
   * Converte texto livre em português para linhas estruturadas de receita de crochê.
   */
  static parse(text: string): PatternRow[] {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const rows: PatternRow[] = [];
    let currentRowNum = 1;

    for (const rawLine of lines) {
      // Ignora linhas que sejam cabeçalhos ou comentários sem instruções de pontos
      if (rawLine.startsWith('#') || rawLine.startsWith('//') || rawLine.toLowerCase().startsWith('materiais:')) {
        continue;
      }

      // Detecta carreiras em intervalo, ex: "Carr 5-8: 24 pb" ou "Carr 5 a 8: 24 pb"
      const rangeMatch = rawLine.match(/^(?:carr(?:eira)?\.?|c|r)?\s*(\d+)\s*(?:-|a|até|ate)\s*(\d+)[\s*:\.ªº\)-]+/i);
      if (rangeMatch) {
        const startRow = parseInt(rangeMatch[1], 10);
        const endRow = parseInt(rangeMatch[2], 10);
        const instruction = rawLine.substring(rangeMatch[0].length).trim();

        for (let r = startRow; r <= endRow; r++) {
          const parsedRow = this.parseInstructionLine(instruction, r);
          rows.push(parsedRow);
        }
        currentRowNum = endRow + 1;
        continue;
      }

      // Extrai número da carreira individual se presente (ex: "Carr 1:", "1.", "1ª carr:", "C1:")
      const rowNumMatch = rawLine.match(/^(?:carr(?:eira)?\.?|c|r)?\s*(\d+)[\s*:\.ªº\)-]+/i);
      let instruction = rawLine;
      if (rowNumMatch) {
        currentRowNum = parseInt(rowNumMatch[1], 10);
        instruction = rawLine.substring(rowNumMatch[0].length).trim();
      }

      const parsedRow = this.parseInstructionLine(instruction, currentRowNum);
      rows.push(parsedRow);
      currentRowNum += 1;
    }

    return rows;
  }

  private static parseInstructionLine(instruction: string, rowNum: number): PatternRow {
    // Detecta anotação final de contagem entre parênteses (ex: "... (24 pts)" ou "... (24)")
    const countNote = instruction.match(/\((\d+)\s*(?:pts?|pontos?|sts?|stitches?)?\)\s*$/i);
    let specifiedCount: number | null = null;
    let clean = instruction;

    if (countNote) {
      specifiedCount = parseInt(countNote[1], 10);
      clean = instruction.substring(0, countNote.index).trim();
    }

    const cleanLower = clean.toLowerCase();

    // Detecta anel mágico: ex "6 pb no anel mágico" ou "6pb no am"
    const amMatch = cleanLower.match(/(\d+)\s*(?:pb|pontos?)?\s*(?:no\s*)?(?:anel\s*m[aá]gico|am)/i);
    if (amMatch) {
      const count = parseInt(amMatch[1], 10);
      return {
        rowNumber: rowNum,
        instructionText: instruction,
        stitchCount: specifiedCount ?? count,
        type: 'round',
        stitches: [{ type: 'pb', count }],
      };
    }

    const stitches: StitchStep[] = [];
    let calculatedCount = 0;

    // Detecta repetições no formato [1 pb, 1 aum] x 6 ou (2 pb, 1 dim) * 6
    const repeatRegex = /(?:\[|\()([^\]\)]+)(?:\]|\))\s*(?:x|\*)\s*(\d+)/gi;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = repeatRegex.exec(clean)) !== null) {
      // Tokens antes desta repetição
      const beforeText = clean.substring(lastIndex, match.index).trim();
      if (beforeText) {
        const beforeStitches = this.parseSimpleTokens(beforeText);
        for (const s of beforeStitches) {
          stitches.push(s);
          calculatedCount += s.type === 'aum' ? s.count * 2 : s.count;
        }
      }

      // Tokens dentro da repetição
      const inner = match[1];
      const repeatCount = parseInt(match[2], 10);
      const innerStitches = this.parseSimpleTokens(inner);

      for (const item of innerStitches) {
        stitches.push({
          type: item.type,
          count: item.count * repeatCount,
        });

        if (item.type === 'aum') {
          calculatedCount += 2 * item.count * repeatCount;
        } else {
          calculatedCount += item.count * repeatCount;
        }
      }

      lastIndex = match.index + match[0].length;
    }

    // Tokens após a última repetição
    const afterText = clean.substring(lastIndex).trim();
    if (afterText) {
      const afterStitches = this.parseSimpleTokens(afterText);
      for (const s of afterStitches) {
        stitches.push(s);
        calculatedCount += s.type === 'aum' ? s.count * 2 : s.count;
      }
    }

    const finalStitchCount = specifiedCount ?? (calculatedCount > 0 ? calculatedCount : 6);

    return {
      rowNumber: rowNum,
      instructionText: instruction,
      stitchCount: finalStitchCount,
      type: cleanLower.includes('corr') && !cleanLower.includes('am') ? 'linear' : 'round',
      stitches: stitches.length > 0 ? stitches : [{ type: 'pb', count: finalStitchCount }],
    };
  }

  private static parseSimpleTokens(text: string): StitchStep[] {
    const list: StitchStep[] = [];
    const tokenRegex = /(\d+)?\s*(dim_inv|dim\s*inv|dim|aum|mpa|pbx|pad|pa|corr|pb)\b/gi;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(text)) !== null) {
      const count = match[1] ? parseInt(match[1], 10) : 1;
      const rawType = match[2].toLowerCase().replace(/\s+/g, '');
      let type: StitchStep['type'] = 'pb';

      if (rawType.startsWith('dim_inv') || rawType.startsWith('diminv')) {
        type = 'dim_inv';
      } else if (rawType.startsWith('dim')) {
        type = 'dim_inv';
      } else if (rawType.startsWith('aum')) {
        type = 'aum';
      } else if (rawType.startsWith('mpa')) {
        type = 'mpa';
      } else if (rawType.startsWith('pbx')) {
        type = 'pbx';
      } else if (rawType.startsWith('pad')) {
        type = 'pad';
      } else if (rawType.startsWith('pa')) {
        type = 'pa';
      } else if (rawType.startsWith('corr')) {
        type = 'corr';
      } else if (rawType.startsWith('pb')) {
        type = 'pb';
      }

      list.push({ type, count });
    }

    if (list.length === 0) {
      const numMatch = text.match(/(\d+)/);
      if (numMatch) {
        list.push({ type: 'pb', count: parseInt(numMatch[1], 10) });
      }
    }

    return list;
  }
}
