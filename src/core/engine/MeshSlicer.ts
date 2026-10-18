import { PatternRow, PrimitiveShape, StitchStep } from '@/types/crochet';

export interface SliceOptions {
  shape: PrimitiveShape;
  dimensionsCm: { width: number; height: number; depth: number };
  stitchesPer10cm?: number;
  rowsPer10cm?: number;
}

export class MeshSlicer {
  /**
   * Converte uma forma geométrica 3D em carreiras de crochê estruturadas com aumentos e diminuições.
   */
  static sliceGeometryToPattern(options: SliceOptions): PatternRow[] {
    const { shape, dimensionsCm } = options;
    const stitchesPerCm = (options.stitchesPer10cm || 22) / 10;
    const rowsPerCm = (options.rowsPer10cm || 24) / 10;

    const height = Math.max(1, dimensionsCm.height);
    const maxDiameter = Math.max(1, Math.max(dimensionsCm.width, dimensionsCm.depth));
    const totalRows = Math.max(3, Math.round(height * rowsPerCm));
    const maxStitches = Math.max(6, Math.round(maxDiameter * Math.PI * stitchesPerCm));

    const rows: PatternRow[] = [];

    if (shape === 'box') {
      // Peça linear plana
      const stitchCount = Math.max(6, Math.round(dimensionsCm.width * stitchesPerCm));
      for (let r = 1; r <= totalRows; r++) {
        if (r === 1) {
          rows.push({
            rowNumber: 1,
            instructionText: `${stitchCount} corr + 1 para virar`,
            stitchCount,
            type: 'linear',
            stitches: [{ type: 'corr', count: stitchCount + 1 }],
          });
        } else {
          rows.push({
            rowNumber: r,
            instructionText: `${stitchCount} pb`,
            stitchCount,
            type: 'linear',
            stitches: [{ type: 'pb', count: stitchCount }],
          });
        }
      }
      return rows;
    }

    // Peças circulares / amigurumi (Sphere, Cylinder, Cone, Capsule, Torus)
    // Carreira 1: Anel Mágico inicial
    const baseStitches = 6;
    rows.push({
      rowNumber: 1,
      instructionText: `${baseStitches} pb no anel mágico`,
      stitchCount: baseStitches,
      type: 'round',
      stitches: [{ type: 'pb', count: baseStitches }],
    });

    // Fatiar camadas e calcular raio normalizado
    let prevStitches = baseStitches;

    for (let r = 2; r <= totalRows; r++) {
      const normalizedHeight = (r - 1) / (totalRows - 1); // 0 a 1
      let radiusRatio = 1;

      if (shape === 'sphere') {
        // Esfera: sen(pi * t)
        radiusRatio = Math.sin(Math.PI * normalizedHeight);
      } else if (shape === 'cylinder') {
        // Cilindro: diâmetro constante
        radiusRatio = 1.0;
      } else if (shape === 'cone') {
        // Cone: decresce linearmente da base ao topo
        radiusRatio = 1.0 - normalizedHeight;
      } else if (shape === 'capsule') {
        if (normalizedHeight < 0.25) {
          radiusRatio = Math.sin(Math.PI * (normalizedHeight / 0.5));
        } else if (normalizedHeight > 0.75) {
          radiusRatio = Math.sin(Math.PI * ((1 - normalizedHeight) / 0.5));
        } else {
          radiusRatio = 1.0;
        }
      }

      // Calcula a quantidade alvo de pontos para esta carreira
      let targetStitches = Math.round(Math.max(baseStitches, maxStitches * radiusRatio));
      // Garante múltiplos de 6 para manter simetria amigurumi quando próximo
      if (targetStitches % 6 !== 0 && targetStitches > 6) {
        targetStitches = Math.round(targetStitches / 6) * 6;
      }

      const diff = targetStitches - prevStitches;
      const stitches: StitchStep[] = [];
      let text = '';

      if (diff > 0) {
        // Aumentos
        const incCount = diff;
        const basePerInc = Math.floor(prevStitches / incCount);
        const s = Math.max(0, basePerInc - 1);
        const remainder = Math.max(0, prevStitches - (s + 1) * incCount);

        if (s === 0 && remainder === 0) {
          text = `${incCount} aum`;
          stitches.push({ type: 'aum', count: incCount });
        } else if (remainder === 0) {
          text = `[${s} pb, 1 aum] x ${incCount}`;
          stitches.push({ type: 'pb', count: s * incCount });
          stitches.push({ type: 'aum', count: incCount });
        } else {
          text = `[${s} pb, 1 aum] x ${incCount}, ${remainder} pb`;
          stitches.push({ type: 'pb', count: s * incCount + remainder });
          stitches.push({ type: 'aum', count: incCount });
        }
      } else if (diff < 0) {
        // Diminuições
        const decCount = Math.abs(diff);
        const s = decCount > 0 ? Math.floor((prevStitches - decCount * 2) / decCount) : 0;
        const remainder = Math.max(0, prevStitches - (s + 2) * decCount);

        if (s <= 0 && remainder === 0) {
          text = `${decCount} dim`;
          stitches.push({ type: 'dim_inv', count: decCount });
        } else if (remainder === 0) {
          text = `[${s} pb, 1 dim] x ${decCount}`;
          stitches.push({ type: 'pb', count: s * decCount });
          stitches.push({ type: 'dim_inv', count: decCount });
        } else {
          text = `[${s} pb, 1 dim] x ${decCount}, ${remainder} pb`;
          stitches.push({ type: 'pb', count: s * decCount + remainder });
          stitches.push({ type: 'dim_inv', count: decCount });
        }
      } else {
        // Carreira de manutenção
        text = `${targetStitches} pb em toda a volta`;
        stitches.push({ type: 'pb', count: targetStitches });
      }

      rows.push({
        rowNumber: r,
        instructionText: text,
        stitchCount: targetStitches,
        type: 'round',
        stitches,
      });

      prevStitches = targetStitches;
    }

    return rows;
  }
}
