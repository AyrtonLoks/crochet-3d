import * as THREE from 'three';
import { PatternRow } from '@/types/crochet';

export class RecipeToMesh {
  /**
   * Constrói uma geometria 3D Three.js a partir das carreiras de uma receita de crochê.
   */
  static generateGeometryFromRows(rows: PatternRow[], scale: number = 1.0): THREE.BufferGeometry {
    if (!rows || rows.length === 0) {
      return new THREE.SphereGeometry(0.5, 16, 16);
    }

    const segmentsPerCircle = 32;
    const numRows = rows.length;
    const maxStitches = Math.max(...rows.map((r) => r.stitchCount || 6), 6);
    const baseRadius = 0.8 * scale;
    const totalHeight = 1.4 * scale;

    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    // Cria anéis de vértices para cada carreira
    for (let r = 0; r < numRows; r++) {
      const row = rows[r];
      const normalizedY = (r / Math.max(1, numRows - 1));
      const y = (normalizedY - 0.5) * totalHeight;

      // Raio proporcional ao número de pontos da carreira
      const stitches = Math.max(1, row.stitchCount || 6);
      const radius = Math.max(0.08, (stitches / maxStitches) * baseRadius);

      for (let s = 0; s <= segmentsPerCircle; s++) {
        const u = s / segmentsPerCircle;
        const theta = u * Math.PI * 2;
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);

        vertices.push(x, y, z);
        uvs.push(u, normalizedY);
      }
    }

    // Cria as faces triangulares entre carreiras adjacentes
    for (let r = 0; r < numRows - 1; r++) {
      for (let s = 0; s < segmentsPerCircle; s++) {
        const current = r * (segmentsPerCircle + 1) + s;
        const next = current + segmentsPerCircle + 1;

        indices.push(current, next, current + 1);
        indices.push(next, next + 1, current + 1);
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
