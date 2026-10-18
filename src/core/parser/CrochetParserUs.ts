import { PatternRow, StitchStep } from '@/types/crochet';

export class CrochetParserUs {
  /**
   * Converte texto livre em inglês (padrão US) para linhas estruturadas de receita de crochê.
   */
  static parse(text: string): PatternRow[] {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const rows: PatternRow[] = [];
    let currentRowNum = 1;

    for (const rawLine of lines) {
      if (rawLine.startsWith('#') || rawLine.startsWith('//') || rawLine.toLowerCase().startsWith('materials:')) {
        continue;
      }

      // Range detection: e.g. "Rnds 5-8: 24 sc" or "Rows 5 to 8: 24 sc"
      const rangeMatch = rawLine.match(/^(?:rounds?|rnds?|rows?|r)?\s*(\d+)\s*(?:-|to)\s*(\d+)[\s*:\.ªº\)-]+/i);
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

      const rowNumMatch = rawLine.match(/^(?:rounds?|rnds?|rows?|r)?\s*(\d+)[\s*:\.ªº\)-]+/i);
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
    const countNote = instruction.match(/\((\d+)\s*(?:sts?|stitches?)?\)\s*$/i);
    let specifiedCount: number | null = null;
    let clean = instruction;

    if (countNote) {
      specifiedCount = parseInt(countNote[1], 10);
      clean = instruction.substring(0, countNote.index).trim();
    }

    const cleanLower = clean.toLowerCase();

    // Detecta magic ring (MR): "6 sc in magic ring" or "6 sc in mr"
    const mrMatch = cleanLower.match(/(\d+)\s*(?:sc|sts?)?\s*(?:in|into)?\s*(?:magic\s*ring|mr)/i);
    if (mrMatch) {
      const count = parseInt(mrMatch[1], 10);
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

    // Detecta repetições: [1 sc, 1 inc] * 6 or (2 sc, 1 dec) x 6
    const repeatRegex = /(?:\[|\()([^\]\)]+)(?:\]|\))\s*(?:x|\*)\s*(\d+)/gi;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = repeatRegex.exec(clean)) !== null) {
      // Tokens before repeat
      const beforeText = clean.substring(lastIndex, match.index).trim();
      if (beforeText) {
        const beforeStitches = this.parseSimpleTokens(beforeText);
        for (const s of beforeStitches) {
          stitches.push(s);
          calculatedCount += s.type === 'aum' ? s.count * 2 : s.count;
        }
      }

      // Inner repeat
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

    // Tokens after repeat
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
      type: cleanLower.includes('ch') && !cleanLower.includes('mr') ? 'linear' : 'round',
      stitches: stitches.length > 0 ? stitches : [{ type: 'pb', count: finalStitchCount }],
    };
  }

  private static parseSimpleTokens(text: string): StitchStep[] {
    const list: StitchStep[] = [];
    const tokenRegex = /(\d+)?\s*(inv\s*dec|invdec|sc2tog|dec|inc|hdc|sl\s*st|slst|tr|dc|ch|sc)\b/gi;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(text)) !== null) {
      const count = match[1] ? parseInt(match[1], 10) : 1;
      const rawType = match[2].toLowerCase().replace(/\s+/g, '');
      let type: StitchStep['type'] = 'pb';

      if (rawType.startsWith('invdec')) {
        type = 'dim_inv';
      } else if (rawType.startsWith('dec') || rawType.startsWith('sc2tog')) {
        type = 'dim_inv';
      } else if (rawType.startsWith('inc')) {
        type = 'aum';
      } else if (rawType.startsWith('hdc')) {
        type = 'mpa';
      } else if (rawType.startsWith('slst')) {
        type = 'pbx';
      } else if (rawType.startsWith('tr')) {
        type = 'pad';
      } else if (rawType.startsWith('dc')) {
        type = 'pa';
      } else if (rawType.startsWith('ch')) {
        type = 'corr';
      } else if (rawType.startsWith('sc')) {
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
