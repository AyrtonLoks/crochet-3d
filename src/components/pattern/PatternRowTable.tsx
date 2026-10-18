import React from 'react';
import { Plus, Trash2, ArrowDown } from 'lucide-react';
import { useCrochetStore } from '@/store/useCrochetStore';
import { PatternRow } from '@/types/crochet';
import { CrochetParserPtBr } from '@/core/parser/CrochetParserPtBr';
import { PatternValidator } from '@/core/parser/PatternValidator';
import { ValidationBadge } from './ValidationBadge';

export const PatternRowTable: React.FC = () => {
  const { getActivePart, updatePartRows } = useCrochetStore();
  const activePart = getActivePart();

  if (!activePart) return null;

  const handleRowChange = (index: number, field: keyof PatternRow, value: unknown) => {
    const updated = [...activePart.rows];
    let row = { ...updated[index], [field]: value };

    if (field === 'instructionText' && typeof value === 'string' && value.trim()) {
      const parsed = CrochetParserPtBr.parse(`Carr ${row.rowNumber}: ${value}`);
      if (parsed.length > 0) {
        row = {
          ...row,
          stitches: parsed[0].stitches,
          stitchCount: parsed[0].stitchCount || row.stitchCount,
          type: parsed[0].type || row.type,
        };
      }
    }

    updated[index] = row;
    updatePartRows(activePart.id, updated);
  };

  const handleAddRow = (index?: number) => {
    const insertAt = index !== undefined ? index + 1 : activePart.rows.length;
    const prevStitches = activePart.rows[insertAt - 1]?.stitchCount || 6;
    const newRow: PatternRow = {
      rowNumber: insertAt + 1,
      instructionText: `${prevStitches} pb`,
      stitchCount: prevStitches,
      type: 'round',
      stitches: [{ type: 'pb', count: prevStitches }],
    };

    const updated = [...activePart.rows];
    updated.splice(insertAt, 0, newRow);

    // Renumera carreiras
    const renumbered = updated.map((r, i) => ({ ...r, rowNumber: i + 1 }));
    updatePartRows(activePart.id, renumbered);
  };

  const handleDeleteRow = (index: number) => {
    if (activePart.rows.length <= 1) return;
    const updated = activePart.rows.filter((_, i) => i !== index);
    const renumbered = updated.map((r, i) => ({ ...r, rowNumber: i + 1 }));
    updatePartRows(activePart.id, renumbered);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-stone-600 dark:text-stone-400">
          Tabela Estruturada de Carreiras • Peça: <b>{activePart.name}</b>
        </div>
        <button
          onClick={() => handleAddRow()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Adicionar Carreira</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-cream-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-cream-100/70 dark:bg-stone-900 border-b border-cream-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 uppercase tracking-wider font-bold text-[10px]">
            <tr>
              <th className="py-2.5 px-3 w-16 text-center">Carr #</th>
              <th className="py-2.5 px-3 w-28">Tipo</th>
              <th className="py-2.5 px-3">Instruções da Carreira</th>
              <th className="py-2.5 px-3 w-24 text-center">Total Pts</th>
              <th className="py-2.5 px-3 w-20 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100 dark:divide-stone-700/50">
            {activePart.rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-cream-50/50 dark:hover:bg-stone-700/30 transition-colors">
                <td className="py-2 px-3 text-center font-mono font-bold text-terracotta-600 dark:text-terracotta-400">
                  {row.rowNumber}
                </td>
                <td className="py-2 px-3">
                  <select
                    value={row.type}
                    onChange={(e) => handleRowChange(idx, 'type', e.target.value)}
                    className="w-full text-[11px] px-2 py-1 rounded bg-cream-50 dark:bg-stone-900 border border-cream-200 dark:border-stone-700 text-stone-700 dark:text-stone-200"
                  >
                    <option value="round">Circular (Espiral)</option>
                    <option value="linear">Linear (Reto)</option>
                  </select>
                </td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={row.instructionText}
                    onChange={(e) => handleRowChange(idx, 'instructionText', e.target.value)}
                    className="w-full text-xs px-2.5 py-1 rounded bg-cream-50 dark:bg-stone-900 border border-cream-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-mono focus:outline-none focus:ring-1 focus:ring-terracotta-400"
                  />
                </td>
                <td className="py-2 px-3 text-center">
                  <input
                    type="number"
                    min="1"
                    value={row.stitchCount}
                    onChange={(e) => handleRowChange(idx, 'stitchCount', parseInt(e.target.value, 10) || 0)}
                    className="w-16 text-center text-xs px-2 py-1 rounded bg-cream-50 dark:bg-stone-900 border border-cream-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 font-mono"
                  />
                </td>
                <td className="py-2 px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => handleAddRow(idx)}
                      title="Inserir carreira abaixo"
                      className="p-1 rounded hover:bg-cream-200 dark:hover:bg-stone-700 text-stone-500"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    {activePart.rows.length > 1 && (
                      <button
                        onClick={() => handleDeleteRow(idx)}
                        title="Excluir carreira"
                        className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Validação em Tempo Real */}
      <div className="pt-2">
        <ValidationBadge issues={PatternValidator.validate(activePart.rows)} />
      </div>
    </div>
  );
};
