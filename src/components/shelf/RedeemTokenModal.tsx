import React, { useState } from 'react';
import { X, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSocialStore } from '@/store/useSocialStore';

interface RedeemTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (projectId: string) => void;
}

export const RedeemTokenModal: React.FC<RedeemTokenModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { redeemToken } = useSocialStore();
  const [tokenInput, setTokenInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRedeem = async () => {
    if (!tokenInput.trim()) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await redeemToken(tokenInput.trim());
      if (res.success && res.project) {
        setStatusMessage({ text: res.message, isError: false });
        setTimeout(() => {
          onSuccess(res.project!.id);
          onClose();
        }, 1200);
      } else {
        setStatusMessage({ text: res.message, isError: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-2xl border border-cream-300 dark:border-stone-800 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-600 dark:text-terracotta-400 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Resgatar Convite de Projeto Privado
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
          Cole a chave ou token fornecido pelo artesão criador para adicionar a receita privada à sua prateleira.
        </p>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
            Chave de Acesso / Token
          </label>
          <input
            type="text"
            placeholder="Ex: CR3D_X92K_... ou TOKEN_BEATRIZ_G982"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="w-full text-xs font-mono px-3 py-2.5 rounded-xl border border-cream-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-terracotta-400"
          />
        </div>

        {statusMessage && (
          <div
            className={`flex items-center gap-2 p-3 rounded-xl text-xs ${
              statusMessage.isError
                ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                : 'bg-sage-50 dark:bg-sage-950/40 border border-sage-200 dark:border-sage-800 text-sage-700 dark:text-sage-300'
            }`}
          >
            {statusMessage.isError ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-cream-200 dark:border-stone-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleRedeem}
            disabled={!tokenInput.trim() || isSubmitting}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-terracotta-600 hover:bg-terracotta-700 text-white disabled:opacity-50 shadow-sm transition-all"
          >
            {isSubmitting ? 'Validando...' : 'Resgatar Projeto'}
          </button>
        </div>
      </div>
    </div>
  );
};
