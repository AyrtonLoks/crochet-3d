import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { ValidationIssue } from '@/types/crochet';

interface ValidationBadgeProps {
  issues: ValidationIssue[];
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({ issues }) => {
  if (!issues || issues.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sage-50 dark:bg-sage-950/40 border border-sage-200 dark:border-sage-800 text-sage-700 dark:text-sage-300 text-xs">
        <CheckCircle className="w-4 h-4 text-sage-500" />
        <span className="font-semibold">Contagem Matemática Perfeita</span>
        <span className="text-stone-400">• Todos os pontos conferem com as carreiras anteriores</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {issues.map((issue, idx) => (
        <div
          key={idx}
          className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs leading-relaxed"
        >
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold">{issue.message}</div>
            {issue.suggestion && (
              <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                <Info className="w-3.5 h-3.5 text-terracotta-500" />
                <span><b>Sugestão:</b> {issue.suggestion}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
