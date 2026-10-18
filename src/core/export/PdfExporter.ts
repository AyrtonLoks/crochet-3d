import jsPDF from 'jspdf';
import { CrochetProject } from '@/types/crochet';

export class PdfExporter {
  /**
   * Converte uma URL de imagem externa ou 3D snapshot em Data URL Base64 para inclusão no jsPDF.
   */
  private static async loadImageDataUrl(url: string): Promise<string | null> {
    if (!url) return null;
    if (url.startsWith('data:image/')) return url;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 600;
          canvas.height = img.naturalHeight || 600;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.88));
          } else {
            resolve(null);
          }
        } catch (e) {
          console.warn('CORS impediu conversão para canvas:', e);
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  /**
   * Exporta a receita completa do projeto em um PDF com diagramação profissional estilo revista,
   * incluindo fotos em alta resolução, ficha técnica completa e checkboxes para impressão.
   */
  static async exportPatternToPdf(project: CrochetProject, snapshotDataUrl?: string): Promise<void> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 16;

    // 1. Faixa Superior Editorial (Terracotta / Brand)
    doc.setFillColor(234, 74, 42); // Terracotta 500
    doc.rect(0, 0, pageWidth, 7, 'F');

    // 2. Título do Aplicativo / Selo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(180, 50, 25);
    doc.text('CROCHÊ 3D INTERATIVO • FICHA TÉCNICA & RECEITA EDITORIAL', 20, currentY);
    currentY += 8;

    // 3. Título Principal da Receita
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(30, 30, 30);
    doc.text(project.title, 20, currentY);
    currentY += 7;

    // 4. Créditos do Designer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(`Receita por ${project.designer.name} (${project.designer.handle})`, 20, currentY);
    currentY += 6;

    doc.setFontSize(8.5);
    doc.setTextColor(130, 130, 130);
    const totalStitches =
      project.totalStitchesEstimated ||
      project.parts.reduce(
        (sum, p) => sum + p.rows.reduce((s, r) => s + (r.stitchCount || 0), 0),
        0
      );
    doc.text(
      `Dificuldade: ${project.difficulty.toUpperCase()}  |  Categoria: ${project.category.toUpperCase()}  |  Pontos: ~${totalStitches}  |  Data: ${new Date().toLocaleDateString('pt-BR')}`,
      20,
      currentY
    );
    currentY += 8;

    // 5. Linha Divisória
    doc.setDrawColor(220, 220, 220);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 8;

    // 6. Imagem da Capa (Snapshot 3D ou Thumbnail da Receita)
    const coverImageUrl = snapshotDataUrl || project.thumbnailUrl;
    if (coverImageUrl) {
      const coverData = await this.loadImageDataUrl(coverImageUrl);
      if (coverData) {
        try {
          const imgWidth = pageWidth - 40;
          const imgHeight = 65;
          doc.addImage(coverData, 'JPEG', 20, currentY, imgWidth, imgHeight, undefined, 'FAST');
          currentY += imgHeight + 8;
        } catch (e) {
          console.warn('Falha ao adicionar imagem ao PDF:', e);
        }
      }
    }

    // 7. Descrição
    if (project.description) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(70, 70, 70);
      const splitDesc = doc.splitTextToSize(project.description, pageWidth - 40);
      doc.text(splitDesc, 20, currentY);
      currentY += splitDesc.length * 4.5 + 6;
    }

    // 8. Ficha de Materiais & Ingredientes (Card Destacado)
    const materialsBoxY = currentY;
    doc.setFillColor(252, 250, 246);
    doc.setDrawColor(225, 215, 200);
    doc.roundedRect(20, materialsBoxY, pageWidth - 40, 32, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(180, 38, 17);
    doc.text('MATERIAIS & ESPECIFICAÇÕES TÉCNICAS', 25, materialsBoxY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);

    const yarnsStr =
      project.materials.yarns
        .map((y) => `Fio ${y.yarnId} (aprox. ${y.estimatedMeters}m / ${y.estimatedGrams}g)`)
        .join(', ') || 'Fio de algodão para amigurumi';
    const hooksStr = project.materials.hooks.map((h) => `${h} mm`).join(', ') || '2.5 mm';
    const accStr = project.materials.accessories.join(', ') || 'Fibra siliconada e agulha de tapeceiro';

    doc.text(`• Fios Sugeridos: ${yarnsStr}`, 25, materialsBoxY + 14);
    doc.text(`• Agulhas de Crochê: ${hooksStr}`, 25, materialsBoxY + 20);
    doc.text(`• Acessórios & Aviamentos: ${accStr}`, 25, materialsBoxY + 26);
    currentY = materialsBoxY + 38;

    // 9. Tabela de Abreviações
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    doc.text('Guia de Abreviações:', 20, currentY);
    currentY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    doc.text('AM: Anel Mágico  |  pb: ponto baixo (sc)  |  aum: aumento (inc)  |  dim: diminuição invisível (dec)  |  corr: correntinha (ch)', 20, currentY);
    currentY += 8;

    // 10. Seção da Receita Passo a Passo com Checkboxes para Impressão
    for (const part of project.parts) {
      if (currentY > pageHeight - 35) {
        doc.addPage();
        currentY = 20;
      }

      // Cabeçalho da Parte
      doc.setFillColor(242, 245, 240);
      doc.roundedRect(20, currentY, pageWidth - 40, 7.5, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(40, 75, 45);
      doc.text(`Parte: ${part.name}  (Agulha recomendada: ${part.hookSizeMm} mm)`, 24, currentY + 5.2);
      currentY += 11;

      for (const row of part.rows) {
        if (currentY > pageHeight - 20) {
          doc.addPage();
          currentY = 20;
        }

        // Quadrado Checkbox para marcar a lápis [ ]
        doc.setDrawColor(180, 180, 180);
        doc.setFillColor(255, 255, 255);
        doc.rect(23, currentY - 3.2, 3.5, 3.5, 'FD');

        // Número da Carreira
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 30, 30);
        const prefix = `Carr ${row.rowNumber}: `;
        doc.text(prefix, 29, currentY);

        // Instrução e Contagem de Pontos
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        const instructionWithCount = `${row.instructionText}  (${row.stitchCount} pts)`;
        const lines = doc.splitTextToSize(instructionWithCount, pageWidth - 70);
        doc.text(lines, 48, currentY);

        currentY += Math.max(lines.length * 4.2, 5.5);
      }

      currentY += 5;
    }

    // 11. Termos de Licença e Rodapé
    if (currentY > pageHeight - 25) {
      doc.addPage();
      currentY = 20;
    }

    doc.setDrawColor(220, 220, 220);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text(
      project.designer.license.licenseText ||
        'Receita gerada pelo Crochê 3D Interativo. Todos os direitos reservados ao criador.',
      20,
      currentY
    );

    // Adiciona numeração de páginas em todas as páginas
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7.5);
      doc.setTextColor(150, 150, 150);
      doc.text(`Página ${i} de ${totalPages} • Crochê 3D Interativo`, pageWidth / 2, pageHeight - 6, {
        align: 'center',
      });
    }

    // Salva o PDF no navegador
    const safeTitle = project.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    doc.save(`Receita_${safeTitle}.pdf`);
  }
}
