import React from 'react';
import { Move, RotateCw, Maximize2 } from 'lucide-react';
import { useCrochetStore } from '@/store/useCrochetStore';

export const TransformGizmo: React.FC = () => {
  const { getActivePart, updatePart } = useCrochetStore();
  const activePart = getActivePart();

  if (!activePart) return null;

  const { position, rotation, scale } = activePart.transform;

  const handlePositionChange = (axis: 0 | 1 | 2, val: number) => {
    const newPos: [number, number, number] = [...position];
    newPos[axis] = val;
    updatePart(activePart.id, {
      transform: { ...activePart.transform, position: newPos },
    });
  };

  const handleRotationChange = (axis: 0 | 1 | 2, degVal: number) => {
    const newRot: [number, number, number] = [...rotation];
    newRot[axis] = (degVal * Math.PI) / 180;
    updatePart(activePart.id, {
      transform: { ...activePart.transform, rotation: newRot },
    });
  };

  const handleScaleChange = (val: number) => {
    const s = Math.max(0.1, val);
    updatePart(activePart.id, {
      transform: { ...activePart.transform, scale: [s, s, s] },
    });
  };

  return (
    <div className="bg-white dark:bg-stone-800/90 backdrop-blur rounded-xl border border-cream-200 dark:border-stone-700 p-3.5 space-y-3 shadow-sm">
      <div className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
        <span>Transformações 3D</span>
        <span className="text-[10px] text-terracotta-600 dark:text-terracotta-400 font-semibold">{activePart.name}</span>
      </div>

      {/* Posição */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400">
          <Move className="w-3 h-3" /> Posição (X, Y, Z)
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {(['X', 'Y', 'Z'] as const).map((axis, i) => (
            <div key={axis} className="flex items-center bg-cream-50 dark:bg-stone-900 rounded-lg px-2 py-1 border border-cream-200 dark:border-stone-700">
              <span className="text-[10px] font-bold text-stone-400 mr-1.5">{axis}</span>
              <input
                type="number"
                step="0.1"
                value={Number(position[i as 0 | 1 | 2].toFixed(2))}
                onChange={(e) => handlePositionChange(i as 0 | 1 | 2, parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent text-xs font-mono text-stone-800 dark:text-stone-200 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rotação */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400">
          <RotateCw className="w-3 h-3" /> Rotação (graus)
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {(['X', 'Y', 'Z'] as const).map((axis, i) => {
            const deg = Math.round((rotation[i as 0 | 1 | 2] * 180) / Math.PI);
            return (
              <div key={axis} className="flex items-center bg-cream-50 dark:bg-stone-900 rounded-lg px-2 py-1 border border-cream-200 dark:border-stone-700">
                <span className="text-[10px] font-bold text-stone-400 mr-1.5">{axis}</span>
                <input
                  type="number"
                  step="5"
                  value={deg}
                  onChange={(e) => handleRotationChange(i as 0 | 1 | 2, parseFloat(e.target.value) || 0)}
                  className="w-full bg-transparent text-xs font-mono text-stone-800 dark:text-stone-200 focus:outline-none"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Escala */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 dark:text-stone-400">
          <span className="flex items-center gap-1.5">
            <Maximize2 className="w-3 h-3" /> Escala Proporcional
          </span>
          <span className="font-mono text-xs text-stone-700 dark:text-stone-300">{scale[0].toFixed(2)}x</span>
        </div>
        <input
          type="range"
          min="0.2"
          max="3.0"
          step="0.05"
          value={scale[0]}
          onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-cream-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-terracotta-500"
        />
      </div>
    </div>
  );
};
