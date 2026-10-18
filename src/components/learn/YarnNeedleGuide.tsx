import React, { useState } from 'react';
import { Ruler, Calculator, Sparkles } from 'lucide-react';
import { YARN_PRESETS } from '@/data/yarnPresets';

const HOOK_CONVERSIONS = [
  { metricMm: '2.0 mm', us: '—', uk: '14' },
  { metricMm: '2.25 mm', us: 'B-1', uk: '13' },
  { metricMm: '2.5 mm', us: '—', uk: '12' },
  { metricMm: '2.75 mm', us: 'C-2', uk: '—' },
  { metricMm: '3.0 mm', us: '—', uk: '11' },
  { metricMm: '3.25 mm', us: 'D-3', uk: '10' },
  { metricMm: '3.5 mm', us: 'E-4', uk: '9' },
  { metricMm: '4.0 mm', us: 'G-6', uk: '8' },
  { metricMm: '4.5 mm', us: '7', uk: '7' },
  { metricMm: '5.0 mm', us: 'H-8', uk: '6' },
  { metricMm: '5.5 mm', us: 'I-9', uk: '5' },
  { metricMm: '6.0 mm', us: 'J-10', uk: '4' },
  { metricMm: '7.0 mm', us: '—', uk: '2' },
  { metricMm: '8.0 mm', us: 'L-11', uk: '0' },
  { metricMm: '10.0 mm', us: 'N/P-15', uk: '000' },
];

export const YarnNeedleGuide: React.FC = () => {
  // Calculadora de Amostra (Gauge)
  const [gaugeStitches, setGaugeStitches] = useState(22);
  const [gaugeRows, setGaugeRows] = useState(24);
  const [targetWidthCm, setTargetWidthCm] = useState(20);
  const [targetHeightCm, setTargetHeightCm] = useState(20);

  // Cálculos automáticos
  const stitchesNeeded = Math.round((targetWidthCm / 10) * gaugeStitches);
  const rowsNeeded = Math.round((targetHeightCm / 10) * gaugeRows);
  const estimatedMeters = Number(((stitchesNeeded * rowsNeeded * 0.08)).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Calculadora de Amostra / Tensão */}
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-cream-200 dark:border-stone-700 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-terracotta-500" />
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Calculadora de Tensão e Amostra (Gauge)
            </h3>
            <p className="text-xs text-stone-500">
              Calcule a quantidade de pontos e metragem de fio exata para sua peça
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-cream-50 dark:bg-stone-900 p-3 rounded-xl border border-cream-200 dark:border-stone-700">
            <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
              Pontos em 10 cm (Amostra)
            </label>
            <input
              type="number"
              value={gaugeStitches}
              onChange={(e) => setGaugeStitches(Number(e.target.value) || 1)}
              className="w-full text-sm font-mono font-bold px-2 py-1 rounded bg-white dark:bg-stone-800 border border-cream-300 dark:border-stone-700"
            />
          </div>

          <div className="bg-cream-50 dark:bg-stone-900 p-3 rounded-xl border border-cream-200 dark:border-stone-700">
            <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
              Carreiras em 10 cm (Amostra)
            </label>
            <input
              type="number"
              value={gaugeRows}
              onChange={(e) => setGaugeRows(Number(e.target.value) || 1)}
              className="w-full text-sm font-mono font-bold px-2 py-1 rounded bg-white dark:bg-stone-800 border border-cream-300 dark:border-stone-700"
            />
          </div>

          <div className="bg-cream-50 dark:bg-stone-900 p-3 rounded-xl border border-cream-200 dark:border-stone-700">
            <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
              Largura Desejada (cm)
            </label>
            <input
              type="number"
              value={targetWidthCm}
              onChange={(e) => setTargetWidthCm(Number(e.target.value) || 1)}
              className="w-full text-sm font-mono font-bold px-2 py-1 rounded bg-white dark:bg-stone-800 border border-cream-300 dark:border-stone-700"
            />
          </div>

          <div className="bg-cream-50 dark:bg-stone-900 p-3 rounded-xl border border-cream-200 dark:border-stone-700">
            <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
              Altura Desejada (cm)
            </label>
            <input
              type="number"
              value={targetHeightCm}
              onChange={(e) => setTargetHeightCm(Number(e.target.value) || 1)}
              className="w-full text-sm font-mono font-bold px-2 py-1 rounded bg-white dark:bg-stone-800 border border-cream-300 dark:border-stone-700"
            />
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-terracotta-50 dark:bg-terracotta-950/40 p-4 rounded-xl border border-terracotta-200 dark:border-terracotta-800 flex flex-wrap items-center justify-around gap-4 text-center">
          <div>
            <div className="text-[11px] text-terracotta-600 dark:text-terracotta-400 font-semibold">
              Pontos de Início
            </div>
            <div className="text-xl font-bold font-mono text-terracotta-900 dark:text-white">
              {stitchesNeeded} pontos
            </div>
          </div>
          <div>
            <div className="text-[11px] text-terracotta-600 dark:text-terracotta-400 font-semibold">
              Total de Carreiras
            </div>
            <div className="text-xl font-bold font-mono text-terracotta-900 dark:text-white">
              {rowsNeeded} carreiras
            </div>
          </div>
          <div>
            <div className="text-[11px] text-terracotta-600 dark:text-terracotta-400 font-semibold">
              Fio Estimado Necessário
            </div>
            <div className="text-xl font-bold font-mono text-terracotta-900 dark:text-white">
              ~{estimatedMeters} metros
            </div>
          </div>
        </div>
      </div>

      {/* Catálogo de Fios Industriais e Agulhas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabela de Conversão de Agulhas */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-cream-200 dark:border-stone-700 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-terracotta-500" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-white">
              Tabela de Equivalência de Agulhas (Métrico vs US vs UK)
            </h3>
          </div>
          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-cream-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 font-bold uppercase text-[10px] sticky top-0">
                <tr>
                  <th className="py-2 px-3">Métrico (mm)</th>
                  <th className="py-2 px-3">EUA (US)</th>
                  <th className="py-2 px-3">Reino Unido (UK)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 dark:divide-stone-700 font-mono">
                {HOOK_CONVERSIONS.map((h, i) => (
                  <tr key={i} className="hover:bg-cream-50 dark:hover:bg-stone-700/50">
                    <td className="py-1.5 px-3 font-semibold text-terracotta-600 dark:text-terracotta-400">{h.metricMm}</td>
                    <td className="py-1.5 px-3">{h.us}</td>
                    <td className="py-1.5 px-3">{h.uk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fios e Recomendações */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-cream-200 dark:border-stone-700 p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white">
            Características dos Fios Comerciais
          </h3>
          <div className="space-y-3">
            {YARN_PRESETS.map((yarn) => (
              <div key={yarn.id} className="p-3 rounded-xl bg-cream-50 dark:bg-stone-900/60 border border-cream-200 dark:border-stone-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{yarn.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cream-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    Agulha: {yarn.defaultHookMm}mm
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  {yarn.descriptionPt}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {yarn.recommendedUses.map((u, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-terracotta-100 dark:bg-terracotta-900/30 text-terracotta-700 dark:text-terracotta-300">
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
