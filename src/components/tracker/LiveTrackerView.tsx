import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  HelpCircle,
  Trophy,
  Sparkles,
  CheckCircle2,
  Play,
  Pause,
  ListOrdered,
  BookOpen,
} from 'lucide-react';
import { useCrochetStore } from '@/store/useCrochetStore';
import { useProfileStore } from '@/store/useProfileStore';
import { SoundEffects } from '@/core/audio/SoundEffects';
import { SpeechSynthesizer } from '@/core/audio/SpeechSynthesizer';
import { MiniMap3D } from './MiniMap3D';
import { VoiceController } from './VoiceController';
import { StitchDetailModal } from './StitchDetailModal';
import { StitchType } from '@/types/crochet';

export const LiveTrackerView: React.FC = () => {
  const {
    projects,
    activeProjectId,
    getActiveProject,
    getActivePart,
    setActivePartId,
    advanceStitch,
    rewindStitch,
    advanceRow,
    rewindRow,
    resetProgress,
    trackerIsPlaying,
    setTrackerIsPlaying,
    toggleTrackerPlay,
    ttsEnabled,
    setTtsEnabled,
    voiceCommandsEnabled,
    setVoiceCommandsEnabled,
    isMuted,
    updateProject,
  } = useCrochetStore();

  const { incrementStitches } = useProfileStore();

  const project = getActiveProject();
  const part = getActivePart();

  const [activeHelpStitch, setActiveHelpStitch] = useState<StitchType | null>(null);
  const [showFinishedCelebration, setShowFinishedCelebration] = useState(false);
  const [showFullPatternSidebar, setShowFullPatternSidebar] = useState(true);

  const currentRowIndex = project?.progress.currentRowIndex ?? 0;
  const currentStitchIndex = project?.progress.currentStitchIndex ?? 0;
  const currentRow = part?.rows[currentRowIndex];
  const totalRows = part?.rows.length ?? 0;
  const totalStitchesInRow = currentRow?.stitchCount ?? 6;

  // Fala instrução atual via TTS (somente chamada sob demanda ou se estiver executando)
  const speakCurrent = useCallback(() => {
    if (!currentRow) return;
    const text = `Carreira ${currentRow.rowNumber}. ${currentRow.instructionText}. Ponto ${currentStitchIndex + 1} de ${totalStitchesInRow}.`;
    SpeechSynthesizer.speak(text);
  }, [currentRow, currentStitchIndex, totalStitchesInRow]);

  // Ação de avançar ponto
  const handleAdvance = useCallback(() => {
    if (!project || !part) return;

    if (!isMuted) {
      if (currentStitchIndex + 1 >= totalStitchesInRow) {
        SoundEffects.playRowCompleteChime();
      } else {
        SoundEffects.playStitchTick();
      }
    }

    advanceStitch();
    incrementStitches(1);

    // Se estiver no último ponto da última carreira -> Celebração!
    if (
      currentRowIndex === totalRows - 1 &&
      currentStitchIndex + 1 >= totalStitchesInRow
    ) {
      if (!isMuted) SoundEffects.playCelebrationFanfare();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      setShowFinishedCelebration(true);
      setTrackerIsPlaying(false);
    }
  }, [
    project,
    part,
    isMuted,
    currentStitchIndex,
    totalStitchesInRow,
    currentRowIndex,
    totalRows,
    advanceStitch,
    incrementStitches,
    setTrackerIsPlaying,
  ]);

  // Ação de retroceder ponto
  const handleRewind = useCallback(() => {
    if (!isMuted) SoundEffects.playStitchTick();
    rewindStitch();
  }, [isMuted, rewindStitch]);

  // Atalhos de Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se estiver digitando em input ou textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        toggleTrackerPlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleAdvance();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleRewind();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        advanceRow();
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        rewindRow();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        speakCurrent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAdvance, handleRewind, advanceRow, rewindRow, speakCurrent, toggleTrackerPlay]);

  // Narração automática de voz APENAS se o usuário tiver dado PLAY e TTS estiver ativo!
  // NUNCA inicia sozinho sem interação do usuário!
  useEffect(() => {
    if (trackerIsPlaying && ttsEnabled) {
      speakCurrent();
    }
  }, [currentRowIndex, trackerIsPlaying, ttsEnabled]);

  const handleVoiceCommand = (
    cmd: 'next' | 'prev' | 'repeat' | 'next-row' | 'prev-row' | 'help'
  ) => {
    switch (cmd) {
      case 'next':
        handleAdvance();
        break;
      case 'prev':
        handleRewind();
        break;
      case 'repeat':
        speakCurrent();
        break;
      case 'next-row':
        advanceRow();
        break;
      case 'prev-row':
        rewindRow();
        break;
      case 'help':
        setActiveHelpStitch('pb');
        break;
    }
  };

  const handleJumpToRow = (rowIndex: number) => {
    if (!project) return;
    updateProject(project.id, {
      progress: {
        ...project.progress,
        currentRowIndex: rowIndex,
        currentStitchIndex: 0,
      },
    });
  };

  if (!project || !part || !currentRow) {
    return (
      <div className="p-12 text-center text-stone-500 bg-white dark:bg-stone-800 rounded-3xl border border-cream-200 dark:border-stone-700">
        Nenhum projeto ou peça ativa selecionada para crochetagem.
      </div>
    );
  }

  const rowProgressPct = Math.round(
    ((currentStitchIndex + 1) / totalStitchesInRow) * 100
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Barra de Status e Controles Superiores */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-stone-800 p-4 rounded-3xl border border-cream-200 dark:border-stone-700 shadow-sm">
        <div>
          <div className="text-xs font-semibold text-terracotta-600 dark:text-terracotta-400">
            {project.title}
          </div>
          <h2 className="text-base font-bold text-stone-900 dark:text-white">
            Peça em Foco: {part.name}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Botão Play / Pause Explícito com Destaque */}
          <button
            onClick={toggleTrackerPlay}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              trackerIsPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-stone-900'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {trackerIsPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pausar Crochetagem</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Crochetagem (Play)</span>
              </>
            )}
          </button>

          {/* Voice Controller */}
          <VoiceController
            isEnabled={voiceCommandsEnabled}
            onToggle={setVoiceCommandsEnabled}
            onCommand={handleVoiceCommand}
          />

          {/* Botão de Narração TTS */}
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              ttsEnabled
                ? 'bg-cream-100 dark:bg-stone-700 text-stone-800 dark:text-white border-cream-300 dark:border-stone-600'
                : 'bg-white dark:bg-stone-900 text-stone-400 border-stone-200 dark:border-stone-800'
            }`}
            title="Narração automática por voz (TTS)"
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4 text-terracotta-500" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Voz TTS</span>
          </button>

          <button
            onClick={() => setShowFullPatternSidebar(!showFullPatternSidebar)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showFullPatternSidebar
                ? 'bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-700 dark:text-terracotta-300 border-terracotta-300'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-cream-200 dark:border-stone-700'
            }`}
            title="Exibir/Ocultar visão geral da receita"
          >
            <ListOrdered className="w-4 h-4" />
            <span className="hidden sm:inline">Todas as Partes</span>
          </button>

          <button
            onClick={resetProgress}
            title="Reiniciar contagem da peça"
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Principal: Visão Geral de Todas as Partes (Esquerda) + Spotlight Ativo (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Painel Esquerdo: Receita Completa de Todas as Partes do Amigurumi */}
        {showFullPatternSidebar && (
          <div className="lg:col-span-4 space-y-4 bg-white dark:bg-stone-800 rounded-3xl border border-cream-200 dark:border-stone-700 p-5 shadow-sm max-h-[750px] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-cream-200 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-terracotta-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Receita do Amigurumi Completo
                </h3>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">
                {project.parts.length} peças
              </span>
            </div>

            {/* Alternador de Peças */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {project.parts.map((p) => {
                const isActivePart = p.id === part.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePartId(p.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActivePart
                        ? 'bg-terracotta-500 text-white shadow-sm'
                        : 'bg-cream-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Lista de Carreiras da Peça Selecionada */}
            <div className="space-y-1.5 pt-1">
              {part.rows.map((r, idx) => {
                const isCurrent = idx === currentRowIndex;
                const isCompleted = idx < currentRowIndex;

                return (
                  <div
                    key={r.rowNumber}
                    onClick={() => handleJumpToRow(idx)}
                    className={`flex items-center justify-between gap-2 p-2.5 rounded-xl text-xs cursor-pointer transition-all border ${
                      isCurrent
                        ? 'bg-terracotta-50 dark:bg-terracotta-950/40 border-terracotta-400 text-stone-900 dark:text-white font-bold shadow-sm'
                        : isCompleted
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-stone-600 dark:text-stone-400 opacity-80'
                        : 'bg-cream-50/50 dark:bg-stone-900/40 border-cream-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-cream-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 ${
                            isCurrent
                              ? 'bg-terracotta-500 text-white'
                              : 'bg-cream-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                          }`}
                        >
                          {r.rowNumber}
                        </span>
                      )}
                      <span className="truncate">{r.instructionText}</span>
                    </div>

                    <span className="font-mono text-[10px] opacity-75 flex-shrink-0">
                      {r.stitchCount} pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Painel Central/Direito: Spotlight da Carreira Ativa & Controles Gigantes */}
        <div className={`${showFullPatternSidebar ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6`}>
          {/* Cartão Gigante de Execução */}
          <div className="bg-white dark:bg-stone-800/90 rounded-3xl border-2 border-cream-300 dark:border-stone-700 p-6 sm:p-10 shadow-lg text-center space-y-6 relative overflow-hidden">
            {/* Status de Play/Pause Flutuante */}
            <div className="flex items-center justify-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  trackerIsPlaying
                    ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200'
                    : 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200'
                }`}
              >
                {trackerIsPlaying ? '▶️ Em Execução' : '⏸️ Pausado'}
              </span>

              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                Carreira {currentRow.rowNumber} de {totalRows} ({currentRow.type === 'round' ? 'Circular' : 'Linear'})
              </span>
            </div>

            {/* Instrução Principal em Tipografia Enorme */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
                {currentRow.instructionText}
              </h1>

              {/* Badges Clicáveis dos Pontos da Carreira -> Abrem Tutoriais Imediatamente */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {currentRow.stitches.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveHelpStitch(step.type)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-terracotta-50 dark:bg-terracotta-950/40 hover:bg-terracotta-100 dark:hover:bg-terracotta-900/60 border border-terracotta-200 dark:border-terracotta-800 text-terracotta-700 dark:text-terracotta-300 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
                    title={`Ver como tecer ${step.type.toUpperCase()}`}
                  >
                    <span>{step.count}x</span>
                    <span className="uppercase">{step.type}</span>
                    <HelpCircle className="w-3.5 h-3.5 opacity-70" />
                  </button>
                ))}
              </div>

              {currentRow.notes && (
                <p className="text-sm sm:text-base text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800 font-medium">
                  💡 <b>Dica:</b> {currentRow.notes}
                </p>
              )}
            </div>

            {/* Contador de Ponto Atual em Destaque */}
            <div className="flex flex-col items-center justify-center gap-2 pt-2">
              <div className="text-4xl sm:text-6xl font-black font-mono text-terracotta-600 dark:text-terracotta-400 tracking-tight">
                Ponto {currentStitchIndex + 1}
                <span className="text-xl sm:text-3xl text-stone-400 font-normal"> / {totalStitchesInRow}</span>
              </div>

              {/* Barra de Progresso da Carreira */}
              <div className="w-full max-w-md h-3.5 bg-cream-200 dark:bg-stone-700 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-gradient-to-r from-terracotta-500 to-amber-400 transition-all duration-300 rounded-full"
                  style={{ width: `${rowProgressPct}%` }}
                />
              </div>
              <div className="text-xs text-stone-500 font-medium">
                {rowProgressPct}% da carreira concluído
              </div>
            </div>

            {/* Botões de Ação Gigantes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <button
                onClick={handleRewind}
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-cream-50 dark:bg-stone-900 hover:bg-cream-100 text-stone-700 dark:text-stone-200 font-bold text-sm sm:text-base active:scale-95 transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Voltar [←]</span>
              </button>

              <button
                onClick={handleAdvance}
                className="flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 active:scale-95 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-terracotta-500/30 transition-all hover:scale-[1.02]"
              >
                <span>Avançar Ponto</span>
                <ChevronRight className="w-6 h-6" />
              </button>

              <button
                onClick={speakCurrent}
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-cream-50 dark:bg-stone-900 hover:bg-cream-100 text-stone-700 dark:text-stone-200 font-bold text-sm sm:text-base active:scale-95 transition-all shadow-sm"
              >
                <Volume2 className="w-5 h-5 text-terracotta-500" />
                <span>Repetir [R]</span>
              </button>
            </div>
          </div>

          {/* Mini-Mapa 3D & Navegação Rápida */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <MiniMap3D />
            </div>
            <div className="bg-white dark:bg-stone-800/90 rounded-2xl border border-cream-200 dark:border-stone-700 p-4 space-y-3">
              <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Navegação Rápida entre Carreiras
              </h4>
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={rewindRow}
                  className="flex-1 py-2.5 rounded-xl bg-cream-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs hover:bg-cream-200 transition-colors"
                >
                  ▲ Carreira Anterior
                </button>
                <button
                  onClick={advanceRow}
                  className="flex-1 py-2.5 rounded-xl bg-cream-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs hover:bg-cream-200 transition-colors"
                >
                  ▼ Próxima Carreira
                </button>
              </div>

              <div className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1 pt-1">
                <p>⌨️ <b>Teclado:</b> Espaço alterna Play/Pause; Seta Direita avança ponto; Seta Esquerda volta ponto; R ouve instrução.</p>
                <p>🎙️ <b>Comandos de voz:</b> "Próximo", "Voltar", "Repetir", "Ajuda".</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Conclusão Comemorativa */}
      {showFinishedCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-3xl border-2 border-amber-400 p-8 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-500 mx-auto flex items-center justify-center shadow-inner">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-stone-900 dark:text-white">
              Peça Concluída! 🎉
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Parabéns! Você finalizou com sucesso a peça <b>{part.name}</b>. Seus pontos foram registrados no seu Perfil de Artesão!
            </p>
            <button
              onClick={() => setShowFinishedCelebration(false)}
              className="w-full py-3 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-md transition-all"
            >
              Continuar Criando ✨
            </button>
          </div>
        </div>
      )}

      {/* Modal de Tutorial Rápido com SVG */}
      {activeHelpStitch && (
        <StitchDetailModal
          stitchType={activeHelpStitch}
          onClose={() => setActiveHelpStitch(null)}
        />
      )}
    </div>
  );
};
