export class SpeechSynthesizer {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static ptVoice: SpeechSynthesisVoice | null = null;

  static initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    this.ptVoice = voices.find((v) => v.lang.startsWith('pt')) || null;
  }

  /**
   * Fala a instrução em português com baixa latência
   */
  static speak(text: string): void {
    if (!this.synth) return;

    this.synth.cancel(); // Cancela falas anteriores para manter latência < 300ms
    if (!this.ptVoice) {
      this.initVoice();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05; // Leve aceleração para ritmo fluido de trabalho
    utterance.pitch = 1.0;
    if (this.ptVoice) {
      utterance.voice = this.ptVoice;
    }

    this.synth.speak(utterance);
  }

  static stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    SpeechSynthesizer.initVoice();
  };
}
