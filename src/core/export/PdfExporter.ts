import jsPDF from 'jspdf';
import { CrochetProject } from '@/types/crochet';

export class PdfExporter {
  /**
   * Exporta a receita completa do projeto em um PDF com diagramação profissional estilo revista.
   */
  static exportPatternToPdf(project: CrochetProject): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;

    // Cabeçalho Decorativo (Faixa Terracota / Creme)
    doc.setFillColor(234, 74, 42); // Terracotta 500
    doc.rect(0, 0, pageWidth, 8, 'F');

    // Título Principal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text(project.title, 20, currentY);
    currentY += 8;

    // Subtítulo e Créditos do Designer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Receita por ${project.designer.name} (${project.designer.handle})`, 20, currentY);
    currentY += 6;

    doc.setFontSize(9);
    doc.setTextColor(140, 140, 140);
    doc.text(`Dificuldade: ${project.difficulty.toUpperCase()} | Categoria: ${project.category.toUpperCase()} | Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, currentY);
    currentY += 10;

    // Linha divisória
    doc.setDrawColor(220, 220, 220);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 8;

    // Descrição do Projeto
    if (project.description) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const splitDesc = doc.splitTextToSize(project.description, pageWidth - 40);
      doc.text(splitDesc, 20, currentY);
      currentY += splitDesc.length * 5 + 6;
    }

    // Caixa de Materiais
    doc.setFillColor(250, 248, 245);
    doc.setDrawColor(230, 220, 205);
    doc.roundedRect(20, currentY, pageWidth - 40, 28, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(180, 38, 17); // Terracotta 700
    doc.text('MATERIAIS SUGERIDOS', 25, currentY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);

    const yarnsStr = project.materials.yarns
      .map((y) => `Fio ${y.yarnId} (aprox. ${y.estimatedMeters}m / ${y.estimatedGrams}g)`)
      .join(', ') || 'Fio de algodão para amigurumi';
    const hooksStr = project.materials.hooks.map((h) => `${h} mm`).join(', ') || '2.5 mm';
    const accStr = project.materials.accessories.join(', ') || 'Fibra siliconada e agulha de tapeceiro';

    doc.text(`• Fios: ${yarnsStr}`, 25, currentY + 13);
    doc.text(`• Agulha de Crochê: ${hooksStr}`, 25, currentY + 19);
    doc.text(`• Outros: ${accStr}`, 25, currentY + 25);
    currentY += 36;

    // Tabela de Abreviações
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text('Abreviações Utilizadas:', 20, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(90, 90, 90);
    doc.text('AM: Anel Mágico | pb: ponto baixo | aum: aumento (2 pb no mesmo pt) | dim: diminuição | corr: correntinha', 20, currentY);
    currentY += 10;

    // Partes e Carreiras
    for (const part of project.parts) {
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFillColor(240, 245, 240); // Sage 50
      doc.roundedRect(20, currentY, pageWidth - 40, 8, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(45, 75, 46); // Sage 800
      doc.text(`Parte: ${part.name} (Agulha: ${part.hookSizeMm} mm)`, 24, currentY + 5.5);
      currentY += 12;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);

      for (const row of part.rows) {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }

        const prefix = `Carr ${row.rowNumber}: `;
        doc.setFont('helvetica', 'bold');
        doc.text(prefix, 24, currentY);

        doc.setFont('helvetica', 'normal');
        const instructionWithCount = `${row.instructionText} [${row.stitchCount} pts]`;
        const lines = doc.splitTextToSize(instructionWithCount, pageWidth - 70);
        doc.text(lines, 45, currentY);

        currentY += Math.max(lines.length * 4.5, 6);
      }

      currentY += 6;
    }

    // Termos de Licença e Direitos
    if (currentY > 255) {
      doc.addPage();
      currentY = 20;
    }

    doc.setDrawColor(220, 220, 220);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Licença e Direitos Autorais:', 20, currentY);
    currentY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    const licenseText = project.designer.license?.licenseText || 'Receita gerada pelo Crochê 3D Interativo. Todos os direitos reservados.';
    const splitLicense = doc.splitTextToSize(licenseText, pageWidth - 40);
    doc.text(splitLicense, 20, currentY);

    // Rodapé
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFontSize(8);
      doc.setTextColor(160, 160, 160);
      doc.text(
        `Crochê 3D Interativo • Página ${p} de ${totalPages} • crochê3d.art`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: 'center' }
      );
    }

    // Salva o arquivo no navegador
    const safeTitle = project.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    doc.save(`receita_${safeTitle}.pdf`);
  }
}
