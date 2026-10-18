export type VoiceCommandHandler = (command: 'next' | 'prev' | 'repeat' | 'next-row' | 'prev-row' | 'help') => void;

interface WebkitSpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: unknown) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
}

export class SpeechRecognizer {
  private static recognition: WebkitSpeechRecognitionInstance | null = null;
  private static isListening: boolean = false;
  private static commandCallback: VoiceCommandHandler | null = null;

  static isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  static start(onCommand: VoiceCommandHandler): boolean {
    if (!this.isSupported()) return false;

    this.commandCallback = onCommand;

    try {
      const windowObj = window as unknown as {
        SpeechRecognition?: new () => WebkitSpeechRecognitionInstance;
        webkitSpeechRecognition?: new () => WebkitSpeechRecognitionInstance;
      };

      const RecognitionConstructor = windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;
      if (!RecognitionConstructor) return false;

      this.recognition = new RecognitionConstructor();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'pt-BR';

      this.recognition.onresult = (event: unknown) => {
        const speechEvent = event as {
          resultIndex: number;
          results: { [key: number]: { [key: number]: { transcript: string } } };
        };
        const transcript = speechEvent.results[speechEvent.resultIndex]?.[0]?.transcript?.trim().toLowerCase() || '';

        if (!transcript || !this.commandCallback) return;

        if (
          transcript.includes('próxima carreira') ||
          transcript.includes('proxima carreira') ||
          transcript.includes('avançar carreira')
        ) {
          this.commandCallback('next-row');
        } else if (
          transcript.includes('carreira anterior') ||
          transcript.includes('voltar carreira')
        ) {
          this.commandCallback('prev-row');
        } else if (
          transcript.includes('ajuda') ||
          transcript.includes('tutorial') ||
          transcript.includes('como faz')
        ) {
          this.commandCallback('help');
        } else if (
          transcript.includes('repetir') ||
          transcript.includes('repete') ||
          transcript.includes('de novo')
        ) {
          this.commandCallback('repeat');
        } else if (
          transcript.includes('próximo') ||
          transcript.includes('proximo') ||
          transcript.includes('avançar') ||
          transcript.includes('avança') ||
          transcript.includes('vai') ||
          transcript.includes('ok') ||
          transcript.includes('pronto')
        ) {
          this.commandCallback('next');
        } else if (
          transcript.includes('voltar') ||
          transcript.includes('volta') ||
          transcript.includes('anterior')
        ) {
          this.commandCallback('prev');
        }
      };

      this.recognition.onerror = () => {
        // Ignora erros temporários de microfone
      };

      this.recognition.onend = () => {
        // Se ainda estiver marcado como escutando, reinicia suavemente
        if (this.isListening && this.recognition) {
          try {
            this.recognition.start();
          } catch {}
        }
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch {
      return false;
    }
  }

  static stop(): void {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      this.recognition = null;
    }
  }
}
