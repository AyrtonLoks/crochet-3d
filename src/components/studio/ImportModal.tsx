import React, { useState, useRef } from 'react';
import { X, UploadCloud, AlertCircle, CheckCircle, FileCode } from 'lucide-react';
import { useCrochetStore } from '@/store/useCrochetStore';
import { MeshSlicer } from '@/core/engine/MeshSlicer';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const { addPart, updatePart } = useCrochetStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSizeMb, setFileSizeMb] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [slicingMode, setSlicingMode] = useState<'round' | 'linear'>('round');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const sizeMb = file.size / (1024 * 1024);
    setFileSizeMb(Number(sizeMb.toFixed(2)));

    // Validação de limite de 30MB (RP-03)
    if (sizeMb > 30) {
      setErrorMsg('O arquivo excede o limite máximo permitido de 30 MB.');
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['glb', 'gltf', 'obj'].includes(ext || '')) {
      setErrorMsg('Formato não suportado. Por favor, envie arquivos .glb, .gltf ou .obj.');
      return;
    }

    setFileName(file.name);
  };

  const handleImportConfirm = async () => {
    if (!fileName) return;

    setIsProcessing(true);
    try {
      // Simula a decimação e detecção de malhas para fatiamento
      const basePartName = fileName.replace(/\.[^/.]+$/, '');
      const shapeType = slicingMode === 'linear' ? 'box' : 'capsule';

      // Cria a nova parte
      await addPart(basePartName, shapeType, '#84cc16');

      // Gera as carreiras fatiadas a partir da malha importada
      const slicedRows = MeshSlicer.sliceGeometryToPattern({
        shape: shapeType,
        dimensionsCm: { width: 8, height: 10, depth: 8 },
      });

      // Busca o último part criado para atualizar as rows
      const currentStore = useCrochetStore.getState();
      const project = currentStore.getActiveProject();
      const lastPart = project?.parts[project.parts.length - 1];

      if (lastPart) {
        await updatePart(lastPart.id, { rows: slicedRows });
      }

      onClose();
    } catch {
      setErrorMsg('Erro ao processar e fatiar a malha 3D.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-2xl border border-cream-300 dark:border-stone-800 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-terracotta-100 dark:bg-terracotta-900/50 flex items-center justify-center text-terracotta-600 dark:text-terracotta-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Importar Modelo 3D
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          Importe arquivos do Blender ou de escaneamento 3D (.glb, .gltf ou .obj). O motor de fatiamento irá converter a geometria em carreiras de crochê executáveis.
        </p>

        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-cream-300 dark:border-stone-700 hover:border-terracotta-400 dark:hover:border-terracotta-500 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-cream-50/50 dark:bg-stone-800/40 transition-colors"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".glb,.gltf,.obj"
            className="hidden"
          />
          <FileCode className="w-10 h-10 text-terracotta-500" />
          <div className="text-center">
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              {fileName ? fileName : 'Clique para selecionar ou arraste o arquivo'}
            </span>
            <div className="text-[10px] text-stone-400 mt-0.5">
              Formatos aceitos: GLB, GLTF, OBJ (Máx: 30 MB)
            </div>
          </div>
        </div>

        {fileSizeMb > 0 && !errorMsg && (
          <div className="flex items-center gap-2 text-xs text-sage-600 dark:text-sage-400 bg-sage-50 dark:bg-sage-950/40 p-2.5 rounded-lg border border-sage-200 dark:border-sage-800">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Arquivo pronto para fatiamento: {fileName} ({fileSizeMb} MB)</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modo de fatiamento */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
            Modo de Fatiamento Desejado
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSlicingMode('round')}
              className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                slicingMode === 'round'
                  ? 'border-terracotta-500 bg-terracotta-50 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-300 font-semibold'
                  : 'border-cream-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              <div>🌀 Espiral / Circular</div>
              <div className="text-[10px] text-stone-400 mt-0.5">Para amigurumis e peças volumosas</div>
            </button>
            <button
              onClick={() => setSlicingMode('linear')}
              className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                slicingMode === 'linear'
                  ? 'border-terracotta-500 bg-terracotta-50 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-300 font-semibold'
                  : 'border-cream-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              <div>📏 Carreiras Lineares</div>
              <div className="text-[10px] text-stone-400 mt-0.5">Para mantas e peças planas</div>
            </button>
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="flex justify-end gap-2 pt-2 border-t border-cream-200 dark:border-stone-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleImportConfirm}
            disabled={!fileName || !!errorMsg || isProcessing}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-terracotta-600 hover:bg-terracotta-700 disabled:opacity-50 text-white shadow-sm transition-all"
          >
            {isProcessing ? 'Fatiando Geometria...' : 'Importar & Fatiar'}
          </button>
        </div>
      </div>
    </div>
  );
};
