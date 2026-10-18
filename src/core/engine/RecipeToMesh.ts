import * as THREE from 'three';
import { PatternRow } from '@/types/crochet';

export class RecipeToMesh {
  /**
   * Constrói uma geometria 3D Three.js a partir das carreiras de uma receita de crochê.
   * Produz formas amigurumi orgânicas, suaves e volumosas com fechamento esférico
   * nos polos (anel mágico no polo inferior e arremate no polo superior),
   * eliminando formatos cônicos pontudos e piões distorcidos.
   */
  static generateGeometryFromRows(rows: PatternRow[], scale: number = 1.0): THREE.BufferGeometry {
    if (!rows || rows.length === 0) {
      return new THREE.SphereGeometry(0.5 * scale, 32, 24);
    }

    const segments = 36;
    const numRows = rows.length;
    const maxStitches = Math.max(...rows.map((r) => r.stitchCount || 6), 6);
    const baseRadius = 0.75 * scale;
    const totalHeight = Math.max(0.6 * scale, Math.min(2.4 * scale, numRows * 0.14 * scale));

    // Determina se a peça começa em anel mágico fechado e se termina fechada
    const firstRowText = (rows[0].instructionText || '').toLowerCase();
    const isClosedBottom = firstRowText.includes('anel') || firstRowText.includes('am') || (rows[0].stitchCount || 6) <= 8;

    const lastRowText = (rows[numRows - 1].instructionText || '').toLowerCase();
    const isClosedTop = lastRowText.includes('dim') || lastRowText.includes('anel') || (rows[numRows - 1].stitchCount || 6) <= 8;

    // Calcula raios brutos baseados na contagem de pontos
    const rawRadii: number[] = [];
    for (let i = 0; i < numRows; i++) {
      const stitches = Math.max(1, rows[i].stitchCount || 6);
      const ratio = stitches / maxStitches;
      // Curvatura convexa não-linear para dar volume amigurumi fofinho
      const r = Math.pow(ratio, 0.72) * baseRadius;
      rawRadii.push(r);
    }

    // Suavização laplaciana dos raios entre carreiras consecutivas para evitar degraus abruptos
    const smoothRadii: number[] = [];
    for (let i = 0; i < numRows; i++) {
      const prev = i > 0 ? rawRadii[i - 1] : rawRadii[0];
      const curr = rawRadii[i];
      const next = i < numRows - 1 ? rawRadii[i + 1] : rawRadii[numRows - 1];
      // Média ponderada centrada
      const smoothed = prev * 0.2 + curr * 0.6 + next * 0.2;
      smoothRadii.push(Math.max(0.12 * scale, smoothed));
    }

    // Distribuição de alturas (y) com arqueamento elíptico nos polos
    const yCoordinates: number[] = [];
    for (let i = 0; i < numRows; i++) {
      const t = numRows === 1 ? 0.5 : i / (numRows - 1);
      // Suavização senoidal/arco para as carreiras polares
      const archedT = 0.5 - 0.5 * Math.cos(t * Math.PI);
      const y = (archedT - 0.5) * totalHeight;
      yCoordinates.push(y);
    }

    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    // 1. POLO INFERIOR (Polo Sul - Início do Anel Mágico)
    let bottomPoleIndex = -1;
    if (isClosedBottom) {
      const yBottom = yCoordinates[0] - (totalHeight / (numRows + 1)) * 0.6;
      bottomPoleIndex = vertices.length / 3;
      vertices.push(0, yBottom, 0);
      uvs.push(0.5, 0.0);
    }

    // 2. ANÉIS DE CARREIRAS
    const ringStartIndex = vertices.length / 3;

    for (let r = 0; r < numRows; r++) {
      const y = yCoordinates[r];
      const radius = smoothRadii[r];
      const v = (r + (isClosedBottom ? 1 : 0)) / (numRows + (isClosedBottom ? 1 : 0) + (isClosedTop ? 1 : 0));

      for (let s = 0; s <= segments; s++) {
        const u = s / segments;
        const theta = u * Math.PI * 2;
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);

        vertices.push(x, y, z);
        uvs.push(u, v);
      }
    }

    // 3. POLO SUPERIOR (Polo Norte - Arremate Final)
    let topPoleIndex = -1;
    if (isClosedTop) {
      const yTop = yCoordinates[numRows - 1] + (totalHeight / (numRows + 1)) * 0.6;
      topPoleIndex = vertices.length / 3;
      vertices.push(0, yTop, 0);
      uvs.push(0.5, 1.0);
    }

    // 4. TRIANGULAÇÃO DO POLO INFERIOR (Fan Cap)
    if (isClosedBottom && bottomPoleIndex !== -1) {
      const firstRingOffset = ringStartIndex;
      for (let s = 0; s < segments; s++) {
        const next = s + 1;
        indices.push(bottomPoleIndex, firstRingOffset + next, firstRingOffset + s);
      }
    }

    // 5. TRIANGULAÇÃO ENTRE ANÉIS CONSECUTIVOS (Quad strips)
    for (let r = 0; r < numRows - 1; r++) {
      const rowOffset = ringStartIndex + r * (segments + 1);
      const nextRowOffset = ringStartIndex + (r + 1) * (segments + 1);

      for (let s = 0; s < segments; s++) {
        const current = rowOffset + s;
        const currentNext = rowOffset + (s + 1);
        const next = nextRowOffset + s;
        const nextNext = nextRowOffset + (s + 1);

        indices.push(current, next, currentNext);
        indices.push(next, nextNext, currentNext);
      }
    }

    // 6. TRIANGULAÇÃO DO POLO SUPERIOR (Fan Cap)
    if (isClosedTop && topPoleIndex !== -1) {
      const lastRingOffset = ringStartIndex + (numRows - 1) * (segments + 1);
      for (let s = 0; s < segments; s++) {
        const next = s + 1;
        indices.push(topPoleIndex, lastRingOffset + s, lastRingOffset + next);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }
}
