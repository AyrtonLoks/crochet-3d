import React, { useRef, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Grid, Center, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { useCrochetStore } from '@/store/useCrochetStore';
import { ProjectPart } from '@/types/crochet';
import { CrochetShaderMaterial } from '@/core/engine/CrochetShaderMaterial';
import { RecipeToMesh } from '@/core/engine/RecipeToMesh';
import { Move, RotateCw, Maximize2, Eye } from 'lucide-react';

export type GizmoMode = 'translate' | 'rotate' | 'scale' | 'none';

interface PartMeshProps {
  part: ProjectPart;
  isSelected: boolean;
  gizmoMode: GizmoMode;
  onSelect: () => void;
  onTransformChange: (updates: Partial<ProjectPart>) => void;
}

const PartMesh: React.FC<PartMeshProps> = ({ part, isSelected, gizmoMode, onSelect, onTransformChange }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Gera a geometria correspondente às carreiras da receita
  const geometry = useMemo(() => {
    if (part.rows && part.rows.length > 0) {
      return RecipeToMesh.generateGeometryFromRows(part.rows, 1.0);
    }
    // Fallback para geometria primitiva padrão
    switch (part.primitiveType) {
      case 'cylinder':
        return new THREE.CylinderGeometry(0.5, 0.5, 1.2, 32);
      case 'cone':
        return new THREE.ConeGeometry(0.6, 1.2, 32);
      case 'box':
        return new THREE.BoxGeometry(1, 1, 1);
      case 'torus':
        return new THREE.TorusGeometry(0.6, 0.25, 20, 32);
      case 'sphere':
      default:
        return new THREE.SphereGeometry(0.6, 32, 32);
    }
  }, [part.rows, part.primitiveType]);

  // Material Shader de Crochê tátil com relevo de ponto e penugem
  const material = useMemo(() => {
    return new CrochetShaderMaterial({
      color: part.color,
      isHighlighted: isSelected,
      highlightColor: '#facc15',
      fuzziness: part.yarnTypeId === 'chenille-plush' ? 0.8 : 0.35,
      roughness: 0.5,
      stitchScale: [36.0, 32.0],
    });
  }, [part.color, isSelected, part.yarnTypeId]);

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        position={part.transform?.position || [0, 0, 0]}
        rotation={part.transform?.rotation || [0, 0, 0]}
        scale={part.transform?.scale || [1, 1, 1]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        castShadow
        receiveShadow
      />
      {isSelected && gizmoMode !== 'none' && meshRef.current && (
        <TransformControls
          object={meshRef.current}
          mode={gizmoMode}
          size={0.7}
          onMouseUp={() => {
            if (meshRef.current) {
              const pos = meshRef.current.position;
              const rot = meshRef.current.rotation;
              const scl = meshRef.current.scale;
              onTransformChange({
                transform: {
                  position: [Number(pos.x.toFixed(2)), Number(pos.y.toFixed(2)), Number(pos.z.toFixed(2))],
                  rotation: [Number(rot.x.toFixed(2)), Number(rot.y.toFixed(2)), Number(rot.z.toFixed(2))],
                  scale: [Number(scl.x.toFixed(2)), Number(scl.y.toFixed(2)), Number(scl.z.toFixed(2))],
                },
              });
            }
          }}
        />
      )}
    </>
  );
};

export const Viewport3D: React.FC = () => {
  const { getActiveProject, activePartId, setActivePartId, updatePart } = useCrochetStore();
  const project = getActiveProject();
  const [gizmoMode, setGizmoMode] = useState<GizmoMode>('translate');

  return (
    <div className="relative w-full h-full min-h-[460px] bg-gradient-to-b from-stone-100 to-cream-200 dark:from-stone-900 dark:to-stone-950 rounded-2xl overflow-hidden border border-cream-300 dark:border-stone-800 shadow-inner">
      {/* Gizmo Mode Switcher Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/90 dark:bg-stone-800/90 backdrop-blur-md p-1 rounded-xl border border-cream-200 dark:border-stone-700 shadow-md">
        <button
          onClick={() => setGizmoMode('none')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            gizmoMode === 'none'
              ? 'bg-terracotta-500 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-300 hover:bg-cream-100 dark:hover:bg-stone-700'
          }`}
          title="Modo Câmera / Navegação Livre"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Visualizar</span>
        </button>
        <button
          onClick={() => setGizmoMode('translate')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            gizmoMode === 'translate'
              ? 'bg-terracotta-500 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-300 hover:bg-cream-100 dark:hover:bg-stone-700'
          }`}
          title="Mover Peça no Espaço 3D (X, Y, Z)"
        >
          <Move className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mover</span>
        </button>
        <button
          onClick={() => setGizmoMode('rotate')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            gizmoMode === 'rotate'
              ? 'bg-terracotta-500 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-300 hover:bg-cream-100 dark:hover:bg-stone-700'
          }`}
          title="Rotacionar Peça em 3D"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Girar</span>
        </button>
        <button
          onClick={() => setGizmoMode('scale')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            gizmoMode === 'scale'
              ? 'bg-terracotta-500 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-300 hover:bg-cream-100 dark:hover:bg-stone-700'
          }`}
          title="Redimensionar Escala da Peça"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Escalar</span>
        </button>
      </div>

      <Canvas
        camera={{ position: [2.5, 2.5, 3.5], fov: 45 }}
        shadows
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={1024}
        />
        <directionalLight
          position={[-5, 4, -4]}
          intensity={0.4}
          color="#a79ae6" // Rim light lavanda suave
        />

        <Center top>
          <group>
            {project?.parts.map((part) => (
              <PartMesh
                key={part.id}
                part={part}
                isSelected={part.id === activePartId}
                gizmoMode={gizmoMode}
                onSelect={() => setActivePartId(part.id)}
                onTransformChange={(updates) => updatePart(part.id, updates)}
              />
            ))}
          </group>
        </Center>

        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.45}
          scale={8}
          blur={1.8}
          far={4}
        />

        <Grid
          position={[0, -0.02, 0]}
          args={[10, 10]}
          cellSize={0.5}
          cellThickness={0.7}
          cellColor="#d5c8b5"
          sectionSize={2.0}
          sectionThickness={1.2}
          sectionColor="#be9973"
          fadeDistance={12}
        />

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={1.2}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />
      </Canvas>

      {/* Floating 3D Navigation Overlay Help */}
      <div className="absolute bottom-3 left-3 bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-cream-200 dark:border-stone-700 text-[11px] text-stone-600 dark:text-stone-300 pointer-events-none flex items-center gap-2 shadow-sm">
        <span>🖱️ <b>Girar:</b> Botão esquerdo</span>
        <span>•</span>
        <span>🔍 <b>Zoom:</b> Roda do mouse</span>
        <span>•</span>
        <span>✋ <b>Arrastar:</b> Botão direito</span>
      </div>
    </div>
  );
};
