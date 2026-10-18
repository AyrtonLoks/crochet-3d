import React, { useState } from 'react';
import {
  Lock,
  Globe,
  Share2,
  Play,
  Box,
  Download,
  Trash2,
  User,
} from 'lucide-react';
import { CrochetProject } from '@/types/crochet';
import { useCrochetStore } from '@/store/useCrochetStore';
import { PdfExporter } from '@/core/export/PdfExporter';
import { ShareAccessModal } from './ShareAccessModal';

interface ProjectCardProps {
  project: CrochetProject;
  isSharedWithMe?: boolean;
  sharedPermission?: 'viewer' | 'editor';
  allowPdfDownload?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSharedWithMe = false,
  sharedPermission,
  allowPdfDownload = true,
}) => {
  const { setActiveProjectId, setViewTab, deleteProject } = useCrochetStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const totalRows = project.parts.reduce((sum, p) => sum + p.rows.length, 0);
  const totalStitches = project.parts.reduce(
    (sum, p) => sum + p.rows.reduce((s, r) => s + (r.stitchCount || 0), 0),
    0
  );

  const canDownloadPdf = !isSharedWithMe || allowPdfDownload !== false;

  const handleOpenStudio = () => {
    setActiveProjectId(project.id);
    setViewTab('studio');
  };

  const handleOpenTracker = () => {
    setActiveProjectId(project.id);
    setViewTab('tracker');
  };

  const handleExportPdf = () => {
    if (!canDownloadPdf) {
      alert('O criador desta receita não autorizou o download do PDF.');
      return;
    }
    PdfExporter.exportPatternToPdf(project);
  };

  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl border border-cream-200 dark:border-stone-700 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Imagem / Capa */}
        <div className="relative h-44 w-full bg-cream-100 dark:bg-stone-900 overflow-hidden">
          <img
            src={
              project.thumbnailUrl ||
              'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80'
            }
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges de Visibilidade e Dificuldade */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
                project.visibility === 'public'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {project.visibility === 'public' ? (
                <>
                  <Globe className="w-3 h-3" /> Público
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" /> Privado
                </>
              )}
            </span>

            {isSharedWithMe && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lavender-500 text-white shadow-sm">
                {sharedPermission === 'editor' ? '✏️ Co-autor' : '👁️ Visualizador'}
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3">
            <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
              {project.difficulty}
            </span>
          </div>

          {/* Barra de Progresso Sobreposta */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
            <div
              className="h-full bg-terracotta-500 transition-all duration-300"
              style={{ width: `${project.progress.completedPercentage || 0}%` }}
            />
          </div>
        </div>

        {/* Informações Textuais */}
        <div className="p-4 space-y-2.5">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white line-clamp-1 group-hover:text-terracotta-600 transition-colors">
            {project.title}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {project.description || 'Sem descrição cadastrada.'}
          </p>

          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-cream-100 dark:border-stone-700/60">
            <span>{project.parts.length} partes • {totalRows} carr</span>
            <span>~{totalStitches} pontos</span>
          </div>

          {/* Créditos do Designer */}
          <div className="flex items-center gap-2 pt-1">
            <img
              src={
                project.designer.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'
              }
              alt={project.designer.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-[11px] text-stone-600 dark:text-stone-300 truncate">
              Por <b>{project.designer.name}</b>
            </span>
          </div>
        </div>
      </div>

      {/* Ações do Card */}
      <div className="p-4 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleOpenStudio}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-cream-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-cream-50 dark:hover:bg-stone-700 text-xs font-semibold transition-colors"
          >
            <Box className="w-3.5 h-3.5" />
            <span>Studio 3D</span>
          </button>

          <button
            onClick={handleOpenTracker}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Tecer Agora</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-cream-100 dark:border-stone-700/50">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsShareModalOpen(true)}
              title="Gerenciar compartilhamento e visibilidade"
              className="p-1.5 rounded-lg text-stone-500 hover:bg-cream-100 dark:hover:bg-stone-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {canDownloadPdf && (
              <button
                onClick={handleExportPdf}
                title="Baixar receita em PDF"
                className="p-1.5 rounded-lg text-stone-500 hover:bg-cream-100 dark:hover:bg-stone-700 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>

          {!isSharedWithMe && (
            <button
              onClick={() => {
                if (window.confirm(`Deseja realmente excluir o projeto "${project.title}"?`)) {
                  deleteProject(project.id);
                }
              }}
              title="Excluir projeto"
              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <ShareAccessModal
        project={project}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
