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
    getActiveProject,
    getActivePart,
    advanceStitch,
    rewindStitch,
    advanceRow,
    rewindRow,
    resetProgress,
    ttsEnabled,
    setTtsEnabled,
    voiceCommandsEnabled,
    setVoiceCommandsEnabled,
    isMuted,
  } = useCrochetStore();

  const { incrementStitches } = useProfileStore();

  const project = getActiveProject();
  const part = getActivePart();

  const [activeHelpStitch, setActiveHelpStitch] = useState<StitchType | null>(null);
  const [showFinishedCelebration, setShowFinishedCelebration] = useState(false);

  const currentRowIndex = project?.progress.currentRowIndex ?? 0;
  const currentStitchIndex = project?.progress.currentStitchIndex ?? 0;
  const currentRow = part?.rows[currentRowIndex];
  const totalRows = part?.rows.length ?? 0;
  const totalStitchesInRow = currentRow?.stitchCount ?? 6;

  // Fala instrução atual via TTS
  const speakCurrent = useCallback(() => {
    if (!ttsEnabled || !currentRow) return;
    const text = `Carreira ${currentRow.rowNumber}. ${currentRow.instructionText}. Ponto ${currentStitchIndex + 1} de ${totalStitchesInRow}.`;
    SpeechSynthesizer.speak(text);
  }, [ttsEnabled, currentRow, currentStitchIndex, totalStitchesInRow]);

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

      if (e.code === 'Space' || e.code === 'ArrowRight') {
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
  }, [handleAdvance, handleRewind, advanceRow, rewindRow, speakCurrent]);

  // Narração automática de voz ao mudar de carreira
  useEffect(() => {
    if (ttsEnabled) {
      speakCurrent();
    }
  }, [currentRowIndex, ttsEnabled]);

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

  if (!project || !part || !currentRow) {
    return (
      <div className="p-8 text-center text-stone-500">
        Nenhum projeto ou parte ativa selecionada.
      </div>
    );
  }

  const rowProgressPct = Math.round(
    ((currentStitchIndex + 1) / totalStitchesInRow) * 100
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Barra de Status e Controles Superiores */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-stone-800 p-4 rounded-2xl border border-cream-200 dark:border-stone-700 shadow-sm">
        <div>
          <div className="text-xs font-semibold text-terracotta-600 dark:text-terracotta-400">
            {project.title}
          </div>
          <h2 className="text-base font-bold text-stone-900 dark:text-white">
            Peça: {part.name}
          </h2>
        </div>

        <div className="flex items-center gap-2">
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
            onClick={resetProgress}
            title="Reiniciar contagem da peça"
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cartão Gigante de Execução (High-Contrast & Legibilidade 50cm+) */}
      <div className="bg-white dark:bg-stone-800/90 rounded-3xl border-2 border-cream-300 dark:border-stone-700 p-6 sm:p-10 shadow-lg text-center space-y-6 relative overflow-hidden">
        {/* Carreira Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-700 dark:text-terracotta-300 font-bold text-xs sm:text-sm tracking-wide uppercase">
          <span>Carreira {currentRow.rowNumber} de {totalRows}</span>
          <span>•</span>
          <span>{currentRow.type === 'round' ? 'Circular' : 'Linear'}</span>
        </div>

        {/* Instrução Principal em Tipografia Enorme */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
            {currentRow.instructionText}
          </h1>
          {currentRow.notes && (
            <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 italic">
              💡 {currentRow.notes}
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
          <div className="w-full max-w-md h-3 bg-cream-200 dark:bg-stone-700 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-terracotta-500 to-amber-400 transition-all duration-300"
              style={{ width: `${rowProgressPct}%` }}
            />
          </div>
          <div className="text-xs text-stone-500 font-medium">
            {rowProgressPct}% da carreira concluído
          </div>
        </div>

        {/* Botões de Ação Gigantes (Hands-Free / Toque Rápido) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <button
            onClick={handleRewind}
            className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-cream-50 dark:bg-stone-900 hover:bg-cream-100 text-stone-700 dark:text-stone-200 font-bold text-sm sm:text-base active:scale-95 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Voltar Ponto [←]</span>
          </button>

          <button
            onClick={handleAdvance}
            className="flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 active:scale-95 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-terracotta-500/30 transition-all hover:scale-[1.02]"
          >
            <span>Avançar Ponto [Espaço]</span>
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

        {/* Botão de Ajuda Rápida do Ponto */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setActiveHelpStitch('pb')}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-terracotta-600 dark:hover:text-terracotta-400 font-medium transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Dúvida sobre o ponto? Ver tutorial passo a passo [?]</span>
          </button>
        </div>
      </div>

      {/* Mini-Mapa 3D & Atalhos de Navegação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <MiniMap3D />
        </div>
        <div className="bg-white dark:bg-stone-800/90 rounded-xl border border-cream-200 dark:border-stone-700 p-4 space-y-3">
          <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            Navegação Rápida entre Carreiras
          </h4>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={rewindRow}
              className="flex-1 py-2 rounded-lg bg-cream-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs hover:bg-cream-200 transition-colors"
            >
              ▲ Carreira Anterior
            </button>
            <button
              onClick={advanceRow}
              className="flex-1 py-2 rounded-lg bg-cream-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs hover:bg-cream-200 transition-colors"
            >
              ▼ Próxima Carreira
            </button>
          </div>

          <div className="text-[11px] text-stone-500 space-y-1 pt-1">
            <p>⌨️ <b>Teclado:</b> Espaço / Seta Direita para avançar; Seta Esquerda para voltar; R para ouvir de novo.</p>
            <p>🎙️ <b>Comandos de voz:</b> "Próximo", "Voltar", "Repetir", "Ajuda".</p>
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

      {/* Modal de Tutorial Rápido */}
      {activeHelpStitch && (
        <StitchDetailModal
          stitchType={activeHelpStitch}
          onClose={() => setActiveHelpStitch(null)}
        />
      )}
    </div>
  );
};
