import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useCrochetStore } from '@/store/useCrochetStore';
import { RecipeToMesh } from '@/core/engine/RecipeToMesh';
import { CrochetShaderMaterial } from '@/core/engine/CrochetShaderMaterial';

export const MiniMap3D: React.FC = () => {
  const { getActivePart } = useCrochetStore();
  const activePart = getActivePart();

  const geometry = useMemo(() => {
    if (!activePart || !activePart.rows) return new THREE.SphereGeometry(0.5, 16, 16);
    return RecipeToMesh.generateGeometryFromRows(activePart.rows, 0.9);
  }, [activePart?.rows]);

  const material = useMemo(() => {
    return new CrochetShaderMaterial({
      color: activePart?.color || '#38bdf8',
      isHighlighted: true,
      highlightColor: '#f59e0b',
      fuzziness: 0.4,
    });
  }, [activePart?.color]);

  return (
    <div className="w-full h-44 rounded-xl overflow-hidden bg-stone-900/90 border border-stone-700 relative shadow-inner">
      <Canvas camera={{ position: [2, 1.8, 2.5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 3]} intensity={1.5} />
        <Center>
          <mesh geometry={geometry} material={material} />
        </Center>
        <OrbitControls autoRotate autoRotateSpeed={1.5} enableZoom={false} />
      </Canvas>
      <div className="absolute top-2 left-2.5 bg-black/60 px-2 py-0.5 rounded text-[10px] text-amber-300 font-mono font-medium backdrop-blur-sm">
        Mini-Mapa 3D • Carreira Ativa
      </div>
    </div>
  );
};
