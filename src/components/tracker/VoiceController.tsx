import React, { useEffect, useState } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { SpeechRecognizer } from '@/core/audio/SpeechRecognizer';

interface VoiceControllerProps {
  onCommand: (command: 'next' | 'prev' | 'repeat' | 'next-row' | 'prev-row' | 'help') => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  onCommand,
  isEnabled,
  onToggle,
}) => {
  const [isSupported, setIsSupported] = useState(true);
  const [lastHeard, setLastHeard] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported(SpeechRecognizer.isSupported());
  }, []);

  useEffect(() => {
    if (isEnabled && isSupported) {
      SpeechRecognizer.start((cmd) => {
        setLastHeard(cmd);
        onCommand(cmd);
        setTimeout(() => setLastHeard(null), 2000);
      });
    } else {
      SpeechRecognizer.stop();
    }

    return () => {
      SpeechRecognizer.stop();
    };
  }, [isEnabled, isSupported, onCommand]);

  if (!isSupported) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Voz não suportada neste navegador (use Chrome/Edge)</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onToggle(!isEnabled)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
          isEnabled
            ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
            : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-cream-200 dark:border-stone-700 hover:border-terracotta-400'
        }`}
      >
        {isEnabled ? (
          <>
            <Mic className="w-4 h-4 text-white" />
            <span>Ouvindo Comandos...</span>
          </>
        ) : (
          <>
            <MicOff className="w-4 h-4 text-stone-400" />
            <span>Ativar Microfone Hands-Free</span>
          </>
        )}
      </button>

      {lastHeard && (
        <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-terracotta-100 dark:bg-terracotta-900/50 text-terracotta-700 dark:text-terracotta-300 animate-bounce">
          🗣️ "{lastHeard}"
        </span>
      )}
    </div>
  );
};
