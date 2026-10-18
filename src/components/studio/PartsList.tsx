import React, { useState } from 'react';
import { Layers, Copy, Trash2, Edit2, Check, Download, Upload } from 'lucide-react';
import { useCrochetStore } from '@/store/useCrochetStore';
import { PdfExporter } from '@/core/export/PdfExporter';

interface PartsListProps {
  onOpenImport: () => void;
}

export const PartsList: React.FC<PartsListProps> = ({ onOpenImport }) => {
  const { getActiveProject, activePartId, setActivePartId, duplicatePart, removePart, updatePart } = useCrochetStore();
  const project = getActiveProject();

  const [editingPartId, setEditingPartId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  if (!project) return null;

  const handleStartRename = (id: string, currentName: string) => {
    setEditingPartId(id);
    setEditingName(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (editingName.trim()) {
      updatePart(id, { name: editingName.trim() });
    }
    setEditingPartId(null);
  };

  const handleExportPdf = () => {
    PdfExporter.exportPatternToPdf(project);
  };

  return (
    <div className="bg-white dark:bg-stone-800/90 backdrop-blur rounded-xl border border-cream-200 dark:border-stone-700 p-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-terracotta-600 dark:text-terracotta-400" />
          <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">
            Partes do Modelo ({project.parts.length})
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenImport}
            title="Importar arquivo 3D (.glb / .obj)"
            className="p-1.5 rounded-lg border border-cream-200 dark:border-stone-700 hover:bg-cream-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleExportPdf}
            title="Exportar Receita em PDF"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {project.parts.map((part) => {
          const isSelected = part.id === activePartId;
          const isEditing = part.id === editingPartId;
          const totalStitches = part.rows.reduce((sum, r) => sum + (r.stitchCount || 0), 0);

          return (
            <div
              key={part.id}
              onClick={() => setActivePartId(part.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-terracotta-50/70 dark:bg-terracotta-900/30 border-terracotta-400 dark:border-terracotta-600 shadow-sm'
                  : 'bg-cream-50/50 dark:bg-stone-900/40 border-cream-200 dark:border-stone-700 hover:border-cream-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <input
                  type="color"
                  value={part.color}
                  onChange={(e) => updatePart(part.id, { color: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  className="w-5 h-5 rounded-full border-0 cursor-pointer p-0 bg-transparent"
                  title="Alterar cor do fio"
                />

                {isEditing ? (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(part.id)}
                      autoFocus
                      className="text-xs px-2 py-0.5 rounded border border-terracotta-400 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveRename(part.id)}
                      className="p-1 rounded bg-terracotta-500 text-white hover:bg-terracotta-600"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-stone-800 dark:text-stone-200 truncate">
                      {part.name}
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">
                      {part.rows.length} carreiras • {totalStitches} pts
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                {!isEditing && (
                  <button
                    onClick={() => handleStartRename(part.id, part.name)}
                    title="Renomear"
                    className="p-1.5 rounded hover:bg-cream-200 dark:hover:bg-stone-700 text-stone-500"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => duplicatePart(part.id)}
                  title="Duplicar peça"
                  className="p-1.5 rounded hover:bg-cream-200 dark:hover:bg-stone-700 text-stone-500"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {project.parts.length > 1 && (
                  <button
                    onClick={() => removePart(part.id)}
                    title="Remover peça"
                    className="p-1.5 rounded hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
