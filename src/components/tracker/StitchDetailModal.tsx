import React from 'react';
import { X, HelpCircle, Check, Info } from 'lucide-react';
import { StitchType } from '@/types/crochet';
import { STITCH_TUTORIALS } from '@/data/tutorialDatabase';
import { useProfileStore } from '@/store/useProfileStore';

interface StitchDetailModalProps {
  stitchType: StitchType | null;
  onClose: () => void;
}

export const StitchDetailModal: React.FC<StitchDetailModalProps> = ({ stitchType, onClose }) => {
  const { profile } = useProfileStore();

  if (!stitchType) return null;

  const tutorial = STITCH_TUTORIALS.find((t) => t.id === stitchType) || STITCH_TUTORIALS[0];
  const instructions = profile.dominantHand === 'left'
    ? tutorial.leftHandInstructions
    : tutorial.rightHandInstructions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-2xl border border-cream-300 dark:border-stone-800 p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-cream-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-600 dark:text-terracotta-400 flex items-center justify-center font-bold">
              ?
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                Como tecer: {tutorial.namePt} ({tutorial.shortPt})
              </h3>
              <p className="text-[11px] text-stone-500">
                Padrão US: {tutorial.nameUs} ({tutorial.shortUs}) • Mão: {profile.dominantHand === 'left' ? 'Canhota 🖐️' : 'Destra ✋'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          {tutorial.description}
        </p>

        {/* Passo a Passo */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-terracotta-700 dark:text-terracotta-300 uppercase tracking-wider">
            Instruções Passo a Passo ({profile.dominantHand === 'left' ? 'Canhoto' : 'Destro'})
          </h4>
          <div className="space-y-1.5">
            {instructions.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 dark:text-stone-300 bg-cream-50/70 dark:bg-stone-800/50 p-2.5 rounded-lg border border-cream-200 dark:border-stone-700">
                <span className="w-5 h-5 rounded-full bg-terracotta-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dicas */}
        {tutorial.tips && tutorial.tips.length > 0 && (
          <div className="bg-sage-50 dark:bg-sage-950/40 p-3 rounded-xl border border-sage-200 dark:border-sage-800 space-y-1 text-xs text-sage-800 dark:text-sage-200">
            <div className="font-bold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sage-600" /> Dica de Mestre:
            </div>
            {tutorial.tips.map((tip, i) => (
              <p key={i} className="text-[11px] leading-relaxed">• {tip}</p>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold shadow-md transition-all"
          >
            Entendido, Voltar ao Crochê
          </button>
        </div>
      </div>
    </div>
  );
};
