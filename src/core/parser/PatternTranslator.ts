export class PatternTranslator {
  /**
   * Traduz um texto de receita de Crochê em Português (pt-BR) para Inglês Americano (US).
   */
  static translatePtBrToUs(text: string): string {
    const lines = text.split('\n');
    const translatedLines = lines.map((line) => {
      let l = line;

      // Traduz intervalos de carreiras no início da linha: "Carr 5-8:" -> "Rnds 5-8:"
      l = l.replace(/^\s*(?:carr(?:eira)?\.?|c)?\s*(\d+)\s*(?:-|a|até|ate)\s*(\d+)[\s*:\.ªº\)-]*/i, 'Rnds $1-$2: ');

      // Traduz carreiras individuais no início da linha: "Carr 1:" / "1ª carr:" -> "Rnd 1:"
      l = l.replace(/^\s*(?:carr(?:eira)?\.?|c)?\s*(\d+)[\s*:\.ªº\)-]+/i, 'Rnd $1: ');

      // Traduz anel mágico: "6 pb no anel mágico" -> "6 sc in mr"
      l = l.replace(/(\d+)?\s*(?:pb|pontos?)?\s*(?:no\s*)?(?:anel\s*m[aá]gico|am)\b/gi, '$1 sc in mr');

      // Traduz diminuições invisíveis e normais
      l = l.replace(/\b(\d+)?\s*(?:dim_inv|dim\s*inv)\b/gi, '$1 inv dec');
      l = l.replace(/\b(\d+)?\s*dim\b/gi, '$1 dec');

      // Traduz aumentos
      l = l.replace(/\b(\d+)?\s*aum\b/gi, '$1 inc');

      // Traduz pontos específicos
      l = l.replace(/\b(\d+)?\s*pb\b/gi, '$1 sc');
      l = l.replace(/\b(\d+)?\s*mpa\b/gi, '$1 hdc');
      l = l.replace(/\b(\d+)?\s*pa\b/gi, '$1 dc');
      l = l.replace(/\b(\d+)?\s*pad\b/gi, '$1 tr');
      l = l.replace(/\b(\d+)?\s*pbx\b/gi, '$1 sl st');
      l = l.replace(/\b(\d+)?\s*corr\b/gi, '$1 ch');

      // Expressões comuns
      l = l.replace(/\bem\s*toda\s*a\s*volta\b/gi, 'around');
      l = l.replace(/\b(\d+)\s*(?:pts?|pontos?)\b/gi, '$1 sts');
      l = l.replace(/\b(?:repita|repetir)\b/gi, 'repeat');
      l = l.replace(/\b(?:vire|virar)\b/gi, 'turn');
      l = l.replace(/\b(?:arremate|arrematar)\b/gi, 'fasten off');

      return l;
    });

    return translatedLines.join('\n');
  }

  /**
   * Traduz um texto de receita de Crochê em Inglês Americano (US) para Português (pt-BR).
   */
  static translateUsToPtBr(text: string): string {
    const lines = text.split('\n');
    const translatedLines = lines.map((line) => {
      let l = line;

      // Traduz intervalos de carreiras no início da linha: "Rnds 5-8:" -> "Carr 5-8:"
      l = l.replace(/^\s*(?:rnds?|rounds?|rows?|r)?\s*(\d+)\s*(?:-|to)\s*(\d+)[\s*:\.ªº\)-]*/i, 'Carr $1-$2: ');

      // Traduz carreiras individuais no início da linha: "Rnd 1:" / "Row 1:" -> "Carr 1:"
      l = l.replace(/^\s*(?:rnds?|rounds?|rows?|r)?\s*(\d+)[\s*:\.ªº\)-]+/i, 'Carr $1: ');

      // Traduz magic ring: "6 sc in mr" -> "6 pb no anel mágico"
      l = l.replace(/(\d+)?\s*(?:sc|sts?)?\s*(?:in|into)?\s*(?:magic\s*ring|mr)\b/gi, '$1 pb no anel mágico');

      // Traduz diminuições invisíveis e normais
      l = l.replace(/\b(\d+)?\s*(?:inv\s*dec|invdec)\b/gi, '$1 dim');
      l = l.replace(/\b(\d+)?\s*(?:dec|sc2tog)\b/gi, '$1 dim');

      // Traduz aumentos
      l = l.replace(/\b(\d+)?\s*inc\b/gi, '$1 aum');

      // Traduz pontos específicos
      l = l.replace(/\b(\d+)?\s*sc\b/gi, '$1 pb');
      l = l.replace(/\b(\d+)?\s*hdc\b/gi, '$1 mpa');
      l = l.replace(/\b(\d+)?\s*dc\b/gi, '$1 pa');
      l = l.replace(/\b(\d+)?\s*tr\b/gi, '$1 pad');
      l = l.replace(/\b(\d+)?\s*(?:sl\s*st|slst)\b/gi, '$1 pbx');
      l = l.replace(/\b(\d+)?\s*ch\b/gi, '$1 corr');

      // Expressões comuns
      l = l.replace(/\baround\b/gi, 'em toda a volta');
      l = l.replace(/\b(\d+)\s*(?:sts?|stitches?)\b/gi, '$1 pts');
      l = l.replace(/\brepeat\b/gi, 'repetir');
      l = l.replace(/\bturn\b/gi, 'virar');
      l = l.replace(/\bfasten\s*off\b/gi, 'arremate');

      return l;
    });

    return translatedLines.join('\n');
  }
}
