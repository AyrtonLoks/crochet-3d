import React, { useState } from 'react';
import { Key, Users, Sparkles, FolderHeart } from 'lucide-react';
import { useCrochetStore } from '@/store/useCrochetStore';
import { useSocialStore } from '@/store/useSocialStore';
import { ProjectCard } from './ProjectCard';
import { RedeemTokenModal } from './RedeemTokenModal';

export const SharedWithMeTab: React.FC = () => {
  const { projects, setActiveProjectId, setViewTab } = useCrochetStore();
  const { redeemedProjects } = useSocialStore();
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);

  // Filtra projetos que possuem compartilhamentos com o usuário atual ou que foram resgatados
  const sharedProjectsList = projects.filter(
    (p) =>
      p.visibility === 'private' &&
      (p.sharedWith?.some(
        (s) =>
          s.granteeHandle === '@artesao_criativo' ||
          s.granteeUserId === 'current-user' ||
          s.granteeHandle === '@bia_trico_croche'
      ) ||
        redeemedProjects.some((r) => r.project.id === p.id))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-stone-800 p-4 rounded-2xl border border-cream-200 dark:border-stone-700 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-terracotta-500" />
            <span>Projetos Privados Compartilhados Comigo ({sharedProjectsList.length})</span>
          </h2>
          <p className="text-xs text-stone-500">
            Receitas privadas que outros artesãos concederam acesso exclusivo a você
          </p>
        </div>

        <button
          onClick={() => setIsRedeemOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white text-xs font-bold shadow-md shadow-terracotta-500/20 transition-all hover:scale-105"
        >
          <Key className="w-4 h-4" />
          <span>Resgatar Chave de Convite</span>
        </button>
      </div>

      {sharedProjectsList.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-800 rounded-3xl border border-cream-200 dark:border-stone-700 p-8 space-y-3">
          <FolderHeart className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto" />
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
            Nenhum projeto compartilhado no momento
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Quando outro artesão convidar você pelo seu @handle ou enviar uma chave segura, ela aparecerá aqui.
          </p>
          <button
            onClick={() => setIsRedeemOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-terracotta-500 text-white text-xs font-bold shadow-sm"
          >
            Inserir Chave de Convite
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sharedProjectsList.map((proj) => {
            const redeemed = redeemedProjects.find((r) => r.project.id === proj.id);
            const share = redeemed
              ? redeemed.share
              : proj.sharedWith?.find(
                  (s) =>
                    s.granteeHandle === '@artesao_criativo' ||
                    s.granteeUserId === 'current-user' ||
                    s.granteeHandle === '@bia_trico_croche'
                ) || proj.sharedWith?.[0];

            return (
              <ProjectCard
                key={proj.id}
                project={proj}
                isSharedWithMe={true}
                sharedPermission={share?.permission || 'viewer'}
                allowPdfDownload={share?.allowPdfDownload ?? true}
              />
            );
          })}
        </div>
      )}

      <RedeemTokenModal
        isOpen={isRedeemOpen}
        onClose={() => setIsRedeemOpen(false)}
        onSuccess={(id) => {
          setActiveProjectId(id);
          setViewTab('tracker');
        }}
      />
    </div>
  );
};
