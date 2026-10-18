import React, { useState } from 'react';
import { Plus, Scissors, Palette } from 'lucide-react';
import { useCrochetStore } from '@/store/useCrochetStore';
import { PrimitiveShape } from '@/types/crochet';
import { YARN_PRESETS } from '@/data/yarnPresets';
import { MeshSlicer } from '@/core/engine/MeshSlicer';

const SHAPES: { id: PrimitiveShape; name: string; icon: string }[] = [
  { id: 'sphere', name: 'Esfera', icon: '⚪' },
  { id: 'cylinder', name: 'Cilindro', icon: '🥫' },
  { id: 'cone', name: 'Cone', icon: '🔺' },
  { id: 'capsule', name: 'Cápsula', icon: '💊' },
  { id: 'box', name: 'Cubo / Painel', icon: '📦' },
  { id: 'torus', name: 'Torus (Rosca)', icon: '🍩' },
];

const COLOR_PALETTE = [
  '#38bdf8', '#0284c7', '#f43f5e', '#e11d48', '#f97316',
  '#ea580c', '#84cc16', '#10b981', '#a855f7', '#ec4899',
  '#be9973', '#64748b', '#ffffff', '#1e293b'
];

export const PrimitiveControls: React.FC = () => {
  const { addPart, getActivePart, updatePart } = useCrochetStore();
  const activePart = getActivePart();

  const [newPartName, setNewPartName] = useState('');
  const [selectedShape, setSelectedShape] = useState<PrimitiveShape>('sphere');
  const [selectedColor, setSelectedColor] = useState('#38bdf8');
  const [isAdding, setIsAdding] = useState(false);

  // Dimensões em cm
  const [widthCm, setWidthCm] = useState(6);
  const [heightCm, setHeightCm] = useState(6);
  const [depthCm, setDepthCm] = useState(6);

  const handleCreatePart = () => {
    const name = newPartName.trim() || `Nova ${selectedShape}`;
    addPart(name, selectedShape, selectedColor);
    setNewPartName('');
    setIsAdding(false);
  };

  const handleSliceCurrent = () => {
    if (!activePart) return;
    const slicedRows = MeshSlicer.sliceGeometryToPattern({
      shape: activePart.primitiveType || 'sphere',
      dimensionsCm: { width: widthCm, height: heightCm, depth: depthCm },
    });
    updatePart(activePart.id, {
      rows: slicedRows,
      dimensionsCm: { width: widthCm, height: heightCm, depth: depthCm },
    });
  };

  return (
    <div className="bg-white dark:bg-stone-800/90 backdrop-blur rounded-xl border border-cream-200 dark:border-stone-700 p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
          <span>Modelagem & Fatiamento 3D</span>
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nova Parte</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-cream-50 dark:bg-stone-900/80 p-3 rounded-lg border border-cream-300 dark:border-stone-700 space-y-3">
          <div className="text-xs font-semibold text-stone-700 dark:text-stone-300">
            Adicionar Nova Primitiva
          </div>
          <input
            type="text"
            placeholder="Nome da parte (ex: Orelha, Focinho)"
            value={newPartName}
            onChange={(e) => setNewPartName(e.target.value)}
            className="w-full text-xs px-3 py-1.5 rounded-lg border border-cream-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
          />

          <div className="grid grid-cols-3 gap-1.5">
            {SHAPES.map((shape) => (
              <button
                key={shape.id}
                onClick={() => setSelectedShape(shape.id)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                  selectedShape === shape.id
                    ? 'bg-terracotta-50 dark:bg-terracotta-900/40 border-terracotta-400 text-terracotta-700 dark:text-terracotta-300'
                    : 'bg-white dark:bg-stone-800 border-cream-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                <span>{shape.icon}</span>
                <span className="truncate">{shape.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 rounded-full flex-shrink-0 transition-transform ${
                  selectedColor === c ? 'ring-2 ring-offset-2 ring-terracotta-500 scale-110' : 'hover:scale-105'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setIsAdding(false)}
              className="text-xs px-3 py-1 rounded-lg text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreatePart}
              className="text-xs px-3.5 py-1 rounded-lg bg-terracotta-600 hover:bg-terracotta-700 text-white font-medium"
            >
              Criar
            </button>
          </div>
        </div>
      )}

      {/* Ajuste da Peça Ativa */}
      {activePart && (
        <div className="space-y-3 pt-2 border-t border-cream-200 dark:border-stone-700">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
            <span>Dimensões Reais da Peça (cm)</span>
            <span className="text-[11px] text-stone-500">{activePart.name}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-stone-500 block mb-0.5">Largura (cm)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={widthCm}
                onChange={(e) => setWidthCm(Number(e.target.value) || 1)}
                className="w-full text-xs font-mono px-2 py-1 rounded bg-cream-50 dark:bg-stone-900 border border-cream-300 dark:border-stone-700"
              />
            </div>
            <div>
              <label className="text-[10px] text-stone-500 block mb-0.5">Altura (cm)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value) || 1)}
                className="w-full text-xs font-mono px-2 py-1 rounded bg-cream-50 dark:bg-stone-900 border border-cream-300 dark:border-stone-700"
              />
            </div>
            <div>
              <label className="text-[10px] text-stone-500 block mb-0.5">Profundidade (cm)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={depthCm}
                onChange={(e) => setDepthCm(Number(e.target.value) || 1)}
                className="w-full text-xs font-mono px-2 py-1 rounded bg-cream-50 dark:bg-stone-900 border border-cream-300 dark:border-stone-700"
              />
            </div>
          </div>

          {/* Fio & Cor da Peça Ativa */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-600 dark:text-stone-400">
              <Palette className="w-3.5 h-3.5" /> Fio & Textura Tátil
            </div>
            <select
              value={activePart.yarnTypeId}
              onChange={(e) => updatePart(activePart.id, { yarnTypeId: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-cream-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200"
            >
              {YARN_PRESETS.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name} (Agulha recomendada: {y.defaultHookMm}mm)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSliceCurrent}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Scissors className="w-4 h-4" />
            <span>Recalcular Fatiamento em Receita</span>
          </button>
        </div>
      )}
    </div>
  );
};
