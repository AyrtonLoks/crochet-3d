import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Languages, Check, ArrowLeftRight } from 'lucide-react';
import { useCrochetStore } from '@/store/useCrochetStore';
import { CrochetParserPtBr } from '@/core/parser/CrochetParserPtBr';
import { CrochetParserUs } from '@/core/parser/CrochetParserUs';
import { PatternTranslator } from '@/core/parser/PatternTranslator';
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
      const isUs = parserLang === 'US';
      const formatted = activePart.rows
        .map((r) => {
          if (isUs) {
            return `Rnd ${r.rowNumber}: ${r.instructionText} (${r.stitchCount} sts)`;
          }
          return `Carr ${r.rowNumber}: ${r.instructionText} (${r.stitchCount} pts)`;
        })
        .join('\n');
      setRawText(formatted);
    }
  }, [activePart?.id]);

  if (!activePart) return null;

  const handleSwitchLanguage = (newLang: 'pt-BR' | 'US') => {
    if (newLang === parserLang) return;
    if (rawText.trim()) {
      if (newLang === 'US') {
        setRawText(PatternTranslator.translatePtBrToUs(rawText));
      } else {
        setRawText(PatternTranslator.translateUsToPtBr(rawText));
      }
    }
    setParserLang(newLang);
  };

  const handleTranslateToggle = () => {
    if (!rawText.trim()) return;
    if (parserLang === 'pt-BR') {
      setRawText(PatternTranslator.translatePtBrToUs(rawText));
      setParserLang('US');
    } else {
      setRawText(PatternTranslator.translateUsToPtBr(rawText));
      setParserLang('pt-BR');
    }
  };

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
        <div className="flex flex-wrap items-center gap-2">
          <Languages className="w-4 h-4 text-terracotta-500" />
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
            Formato da Receita:
          </span>
          <div className="inline-flex rounded-lg border border-cream-300 dark:border-stone-700 p-0.5 bg-cream-50 dark:bg-stone-900">
            <button
              onClick={() => handleSwitchLanguage('pt-BR')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                parserLang === 'pt-BR'
                  ? 'bg-terracotta-500 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Português (pt-BR)
            </button>
            <button
              onClick={() => handleSwitchLanguage('US')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                parserLang === 'US'
                  ? 'bg-terracotta-500 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Inglês (US)
            </button>
          </div>

          <button
            onClick={handleTranslateToggle}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-cream-300 dark:border-stone-700 hover:bg-cream-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors"
            title="Traduzir termos e abreviações da receita"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Traduzir {parserLang === 'pt-BR' ? 'pt-BR ➔ US' : 'US ➔ pt-BR'}</span>
          </button>
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
