import React, { useState } from 'react';
import { X, Lock, Globe, Key, UserPlus, Trash2, Check, Copy, Shield } from 'lucide-react';
import { CrochetProject, SharePermissionLevel } from '@/types/crochet';
import { ShareService } from '@/core/services/ShareService';
import { useCrochetStore } from '@/store/useCrochetStore';

interface ShareAccessModalProps {
  project: CrochetProject;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAccessModal: React.FC<ShareAccessModalProps> = ({ project, isOpen, onClose }) => {
  const { updateProject } = useCrochetStore();

  const [handleInput, setHandleInput] = useState('');
  const [selectedPermission, setSelectedPermission] = useState<SharePermissionLevel>('viewer');
  const [allowPdf, setAllowPdf] = useState(true);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleToggleVisibility = async (newVis: 'private' | 'public') => {
    await updateProject(project.id, { visibility: newVis });
  };

  const handleGenerateLink = async () => {
    setIsSubmitting(true);
    try {
      const share = await ShareService.createShareLink(project.id, selectedPermission, allowPdf);
      setGeneratedLink(share.accessToken || null);
      await updateProject(project.id, {
        sharedWith: [...(project.sharedWith || []), share],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInviteHandle = async () => {
    if (!handleInput.trim()) return;
    setIsSubmitting(true);
    try {
      const share = await ShareService.inviteArtisanByHandle(project.id, handleInput.trim(), selectedPermission, allowPdf);
      await updateProject(project.id, {
        sharedWith: [...(project.sharedWith || []), share],
      });
      setHandleInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (shareId: string) => {
    await ShareService.revokeAccess(project.id, shareId);
    const updatedShares = (project.sharedWith || []).filter((s) => s.id !== shareId);
    await updateProject(project.id, { sharedWith: updatedShares });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-2xl border border-cream-300 dark:border-stone-800 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-cream-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-600 dark:text-terracotta-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                Compartilhamento & Privacidade
              </h3>
              <p className="text-xs text-stone-500">Projeto: {project.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Seletor de Visibilidade (Público vs Privado) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
            Visibilidade do Projeto
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleToggleVisibility('private')}
              className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                project.visibility === 'private'
                  ? 'border-terracotta-500 bg-terracotta-50 dark:bg-terracotta-900/30'
                  : 'border-cream-200 dark:border-stone-700 hover:bg-cream-50'
              }`}
            >
              <Lock className="w-4 h-4 text-terracotta-600 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-stone-800 dark:text-white">Privado</div>
                <div className="text-[10px] text-stone-500 leading-tight">Apenas você e convidados autorizados</div>
              </div>
            </button>

            <button
              onClick={() => handleToggleVisibility('public')}
              className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                project.visibility === 'public'
                  ? 'border-terracotta-500 bg-terracotta-50 dark:bg-terracotta-900/30'
                  : 'border-cream-200 dark:border-stone-700 hover:bg-cream-50'
              }`}
            >
              <Globe className="w-4 h-4 text-terracotta-600 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-stone-800 dark:text-white">Público</div>
                <div className="text-[10px] text-stone-500 leading-tight">Exibido na Galeria da Comunidade</div>
              </div>
            </button>
          </div>
        </div>

        {/* Opções de Permissão */}
        <div className="bg-cream-50 dark:bg-stone-800/60 p-4 rounded-xl border border-cream-200 dark:border-stone-700 space-y-3">
          <div className="text-xs font-bold text-stone-700 dark:text-stone-300">
            Nível de Permissão para os Convidados
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedPermission('viewer')}
              className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                selectedPermission === 'viewer'
                  ? 'bg-white dark:bg-stone-800 border-terracotta-400 text-terracotta-700 dark:text-terracotta-300 shadow-sm'
                  : 'bg-transparent border-cream-200 dark:border-stone-700 text-stone-600'
              }`}
            >
              <div className="font-bold">👁️ Visualizador (Maker)</div>
              <div className="text-[10px] text-stone-400">Pode tecer e ver o 3D com progresso isolado</div>
            </button>

            <button
              onClick={() => setSelectedPermission('editor')}
              className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                selectedPermission === 'editor'
                  ? 'bg-white dark:bg-stone-800 border-terracotta-400 text-terracotta-700 dark:text-terracotta-300 shadow-sm'
                  : 'bg-transparent border-cream-200 dark:border-stone-700 text-stone-600'
              }`}
            >
              <div className="font-bold">✏️ Co-autor (Editor)</div>
              <div className="text-[10px] text-stone-400">Pode alterar e adicionar carreiras na receita</div>
            </button>
          </div>

          <label className="flex items-center gap-2 pt-1 text-xs text-stone-600 dark:text-stone-300 cursor-pointer">
            <input
              type="checkbox"
              checked={allowPdf}
              onChange={(e) => setAllowPdf(e.target.checked)}
              className="rounded text-terracotta-500 focus:ring-terracotta-400"
            />
            <span>Permitir download da receita em PDF pelo convidado</span>
          </label>
        </div>

        {/* Gerar Link com Token Revogável */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-terracotta-500" /> Link Seguro com Chave Revogável
            </span>
          </div>

          {generatedLink ? (
            <div className="flex items-center gap-2 bg-cream-50 dark:bg-stone-800 p-2.5 rounded-xl border border-terracotta-300">
              <span className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 truncate flex-1">
                {generatedLink}
              </span>
              <button
                onClick={() => copyToClipboard(generatedLink)}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-terracotta-500 text-white font-medium hover:bg-terracotta-600"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar Chave'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleGenerateLink}
              disabled={isSubmitting}
              className="w-full py-2 rounded-xl bg-terracotta-50 dark:bg-terracotta-900/30 border border-terracotta-300 text-terracotta-700 dark:text-terracotta-300 text-xs font-bold hover:bg-terracotta-100 transition-colors"
            >
              + Gerar Nova Chave / Link de Convite
            </button>
          )}
        </div>

        {/* Convidar por @Handle */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <UserPlus className="w-3.5 h-3.5 text-terracotta-500" /> Convidar por @Handle de Artesão
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ex: @bia_trico_croche ou @clara_amigurumi"
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-cream-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            />
            <button
              onClick={handleInviteHandle}
              disabled={!handleInput.trim() || isSubmitting}
              className="px-4 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold disabled:opacity-50"
            >
              Convidar
            </button>
          </div>
        </div>

        {/* Lista de Acessos Concedidos */}
        {project.sharedWith && project.sharedWith.length > 0 && (
          <div className="space-y-2 border-t border-cream-200 dark:border-stone-800 pt-3">
            <div className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Convidados com Acesso ({project.sharedWith.length})
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {project.sharedWith.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-cream-50 dark:bg-stone-800/50 text-xs border border-cream-200 dark:border-stone-700"
                >
                  <div>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {share.granteeHandle || `Chave: ${share.accessToken?.substring(0, 12)}...`}
                    </span>
                    <span className="text-[10px] text-stone-500 ml-2">
                      ({share.permission === 'editor' ? 'Co-autor' : 'Visualizador'})
                    </span>
                  </div>
                  <button
                    onClick={() => handleRevoke(share.id)}
                    title="Revogar Acesso"
                    className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
