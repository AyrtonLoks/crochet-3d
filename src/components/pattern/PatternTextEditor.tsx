import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Languages, Check } from 'lucide-react';
import { useCrochetStore } from '@/store/useCrochetStore';
import { CrochetParserPtBr } from '@/core/parser/CrochetParserPtBr';
import { CrochetParserUs } from '@/core/parser/CrochetParserUs';
import { PatternValidator } from '@/core/parser/PatternValidator';
import { ValidationBadge } from './ValidationBadge';

export const PatternTextEditor: React.FC = () => {
  const { getActivePart, updatePartRows } = useCrochetStore();
  const activePart = getActivePart();

  const [rawText, setRawText] = useState('');
  const [parserLang, setParserLang] = useState<'pt-BR' | 'US'>('pt-BR');
  const [syncFeedback, setSyncFeedback] = useState(false);

  // Carrega as carreiras da peça ativa como texto quando monta ou troca de peça
  useEffect(() => {
    if (activePart && activePart.rows) {
      const formatted = activePart.rows
        .map((r) => `Carr ${r.rowNumber}: ${r.instructionText} (${r.stitchCount} pts)`)
        .join('\n');
      setRawText(formatted);
    }
  }, [activePart?.id]);

  if (!activePart) return null;

  const handleProcessText = () => {
    if (!rawText.trim()) return;

    const parsed = parserLang === 'pt-BR'
      ? CrochetParserPtBr.parse(rawText)
      : CrochetParserUs.parse(rawText);

    if (parsed.length > 0) {
      updatePartRows(activePart.id, parsed);
      setSyncFeedback(true);
      setTimeout(() => setSyncFeedback(false), 2500);
    }
  };

  const validationIssues = PatternValidator.validate(activePart.rows);

  return (
    <div className="space-y-4">
      {/* Barra de Ferramentas do Editor */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-stone-800 p-3.5 rounded-xl border border-cream-200 dark:border-stone-700">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-terracotta-500" />
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
            Formato da Receita:
          </span>
          <div className="inline-flex rounded-lg border border-cream-300 dark:border-stone-700 p-0.5 bg-cream-50 dark:bg-stone-900">
            <button
              onClick={() => setParserLang('pt-BR')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                parserLang === 'pt-BR'
                  ? 'bg-terracotta-500 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Português (pt-BR)
            </button>
            <button
              onClick={() => setParserLang('US')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                parserLang === 'US'
                  ? 'bg-terracotta-500 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Inglês (US)
            </button>
          </div>
        </div>

        <button
          onClick={handleProcessText}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold shadow-md shadow-terracotta-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {syncFeedback ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Receita Sincronizada com 3D!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Processar & Atualizar 3D</span>
            </>
          )}
        </button>
      </div>

      {/* Área de Texto Livre */}
      <div className="relative">
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={12}
          placeholder="Cole ou digite sua receita aqui... Exemplo:
Carr 1: 6 pb no anel mágico
Carr 2: 6 aum (12)
Carr 3: [1 pb, 1 aum] x 6 (18)
Carr 4: [2 pb, 1 aum] x 6 (24)
Carr 5-8: 24 pb
Carr 9: [2 pb, 1 dim] x 6 (18)"
          className="w-full font-mono text-xs leading-relaxed p-4 rounded-xl border border-cream-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-terracotta-400/50 resize-y shadow-inner"
        />
        <div className="absolute top-3 right-3 text-[10px] text-stone-400 font-mono">
          {rawText.split('\n').filter((l) => l.trim()).length} linhas
        </div>
      </div>

      {/* Validações em Tempo Real */}
      <div className="pt-1">
        <ValidationBadge issues={validationIssues} />
      </div>
    </div>
  );
};
