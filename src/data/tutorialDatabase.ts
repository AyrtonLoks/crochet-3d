import { StitchTutorial } from '@/types/crochet';

export const STITCH_TUTORIALS: StitchTutorial[] = [
  {
    id: 'am',
    namePt: 'Anel Mágico',
    nameUs: 'Magic Ring / Adjustable Ring',
    shortPt: 'AM',
    shortUs: 'MR',
    difficulty: 'iniciante',
    category: 'inicio',
    description: 'A fundação essencial para qualquer peça circular ou amigurumi, permitindo puxar o fio central para fechar o orifício completamente sem deixar buraco.',
    rightHandInstructions: [
      'Enrole o fio sobre os dedos indicador e médio da mão esquerda, cruzando na frente para formar um "X".',
      'Segure a ponta curta com o polegar.',
      'Com a agulha na mão direita, passe por baixo do primeiro fio e puxe o segundo fio para dentro da laçada.',
      'Dê uma leve torção e faça uma correntinha para travar o anel.',
      'Teça a quantidade de pontos baixos indicada dentro do anel duplo.',
      'Puxe a ponta solta para fechar o anel firmemente.'
    ],
    leftHandInstructions: [
      'Enrole o fio sobre os dedos indicador e médio da mão direita, cruzando na frente para formar um "X".',
      'Segure a ponta curta com o polegar da mão direita.',
      'Com a agulha na mão esquerda, passe por baixo do primeiro fio e puxe o segundo fio para dentro da laçada.',
      'Dê uma leve torção e faça uma correntinha para travar o anel.',
      'Teça os pontos da primeira carreira dentro do círculo.',
      'Puxe o fio solto com a mão direita para fechar bem o centro.'
    ],
    tips: [
      'Não aperte demais a laçada inicial para deslizar com facilidade.',
      'Sempre conte os pontos antes de puxar o fio final do miolo.'
    ],
    videoOrAnimKey: 'anim_am',
  },
  {
    id: 'corr',
    namePt: 'Correntinha',
    nameUs: 'Chain Stitch',
    shortPt: 'corr',
    shortUs: 'ch',
    difficulty: 'iniciante',
    category: 'basico',
    description: 'Ponto base universal para criar cordões iniciais, subir carreiras e construir espaços abertos ou rendados.',
    rightHandInstructions: [
      'Faça um nó corrediço na agulha.',
      'Passe a agulha sob o fio de trabalho (laçada/yarn over) de trás para frente.',
      'Gire o gancho levemente para baixo e puxe o fio através da laçada que já estava na agulha.'
    ],
    leftHandInstructions: [
      'Faça o nó corrediço na agulha segurada pela mão esquerda.',
      'Com a agulha, enlace o fio que vem do novelo (mão direita) de trás para a frente.',
      'Puxe o fio delicadamente passando por dentro da laçada na agulha.'
    ],
    tips: [
      'Mantenha a tensão uniforme: se ficar muito apertada, será difícil inserir a agulha na próxima carreira.'
    ],
    videoOrAnimKey: 'anim_corr',
  },
  {
    id: 'pb',
    namePt: 'Ponto Baixo',
    nameUs: 'Single Crochet',
    shortPt: 'pb',
    shortUs: 'sc',
    difficulty: 'iniciante',
    category: 'basico',
    description: 'O ponto mais estruturado e fechado do crochê, padrão absoluto para amigurumis por reter bem o enchimento de fibra sem esgarçar.',
    rightHandInstructions: [
      'Insira a agulha no próximo ponto da carreira de base.',
      'Passe o fio sobre a agulha (laçada) e puxe para frente (ficam 2 laçadas na agulha).',
      'Dê nova laçada no fio e puxe através das 2 laçadas de uma só vez.'
    ],
    leftHandInstructions: [
      'Insira a agulha da mão esquerda no próximo ponto da base.',
      'Enlace o fio de trabalho e traga para frente (ficando com 2 laçadas na agulha).',
      'Faça outra laçada e passe por dentro das duas laçadas.'
    ],
    tips: [
      'Nos amigurumis, muitos artesãos usam o ponto "X" (yarn under) em vez de "V" (yarn over) para um acabamento ainda mais denso.'
    ],
    videoOrAnimKey: 'anim_pb',
  },
  {
    id: 'mpa',
    namePt: 'Meio Ponto Alto',
    nameUs: 'Half Double Crochet',
    shortPt: 'mpa',
    shortUs: 'hdc',
    difficulty: 'iniciante',
    category: 'altos',
    description: 'Ponto intermediário entre o ponto baixo e o ponto alto. Cria um tecido macio, maleável e com uma terceira alça característica atrás.',
    rightHandInstructions: [
      'Dê uma laçada na agulha antes de entrar no ponto.',
      'Insira a agulha no ponto de base.',
      'Puxe uma laçada (agora você tem 3 laçadas na agulha).',
      'Dê outra laçada e passe de uma só vez por todas as 3 laçadas.'
    ],
    leftHandInstructions: [
      'Enlace o fio na agulha segurada na mão esquerda.',
      'Insira no ponto da base.',
      'Puxe o fio, acumulando 3 laçadas na agulha.',
      'Enlace novamente e deslize por dentro de todas as três laçadas simultaneamente.'
    ],
    tips: [
      'Excelente para golas, roupas de bebê e gorros canelados.'
    ],
    videoOrAnimKey: 'anim_mpa',
  },
  {
    id: 'pa',
    namePt: 'Ponto Alto',
    nameUs: 'Double Crochet',
    shortPt: 'pa',
    shortUs: 'dc',
    difficulty: 'iniciante',
    category: 'altos',
    description: 'Ponto clássico e rápido que cresce duas vezes mais depressa que o ponto baixo. Muito utilizado em mantas, bolsas e vestuário.',
    rightHandInstructions: [
      'Dê uma laçada na agulha.',
      'Insira no ponto de base e puxe uma laçada (3 laçadas na agulha).',
      'Dê uma laçada e passe pelas duas primeiras laçadas (sobram 2 laçadas).',
      'Dê outra laçada e passe pelas duas últimas laçadas.'
    ],
    leftHandInstructions: [
      'Enlace o fio na agulha com a mão esquerda.',
      'Insira no ponto e pesque o fio (3 laçadas).',
      'Enlace e passe por 2 laçadas (sobram 2).',
      'Enlace e passe pelas duas laçadas restantes.'
    ],
    tips: [
      'Para subir carreira em peças retas, costuma-se fazer 3 correntinhas que contam como 1 ponto alto.'
    ],
    videoOrAnimKey: 'anim_pa',
  },
  {
    id: 'pbx',
    namePt: 'Ponto Baixíssimo',
    nameUs: 'Slip Stitch',
    shortPt: 'pbx',
    shortUs: 'sl st',
    difficulty: 'iniciante',
    category: 'basico',
    description: 'Ponto plano sem altura, utilizado para fechar voltas redondas, arrematar bordas ou caminhar até outra posição do trabalho.',
    rightHandInstructions: [
      'Insira a agulha no ponto desejado.',
      'Puxe o fio diretamente através do ponto e da laçada na agulha em um único movimento contínuo.'
    ],
    leftHandInstructions: [
      'Insira a agulha no ponto.',
      'Puxe o fio e traga direto por dentro da laçada que já estava na agulha sem dar laçadas extras.'
    ],
    tips: [
      'Não aperte excessivamente para não encolher o diâmetro da boca da peça.'
    ],
    videoOrAnimKey: 'anim_pbx',
  },
  {
    id: 'pad',
    namePt: 'Ponto Alto Duplo',
    nameUs: 'Treble / Triple Crochet',
    shortPt: 'pad',
    shortUs: 'tr',
    difficulty: 'intermediario',
    category: 'altos',
    description: 'Ponto alto e elegante com duas laçadas iniciais, ótimo para pontos decorativos, folhas e detalhes longos.',
    rightHandInstructions: [
      'Enrole o fio 2 vezes na agulha (2 voltas).',
      'Insira no ponto e puxe uma laçada (4 laçadas na agulha).',
      'Passe de 2 em 2: enlace e tire 2 (ficam 3), enlace e tire 2 (ficam 2), enlace e tire as últimas 2.'
    ],
    leftHandInstructions: [
      'Dê 2 voltas completas de fio na agulha.',
      'Insira na base e puxe (4 laçadas).',
      'Repita 3 vezes o processo de puxar o fio através de 2 laçadas por vez até restar 1.'
    ],
    tips: [
      'Mantenha as hastes alinhadas para que o ponto não fique frouxo no centro.'
    ],
    videoOrAnimKey: 'anim_pad',
  },
  {
    id: 'aum',
    namePt: 'Aumento Simples',
    nameUs: 'Increase',
    shortPt: 'aum',
    shortUs: 'inc',
    difficulty: 'iniciante',
    category: 'modificadores',
    description: 'Consiste em tecer 2 pontos no mesmo ponto de base da carreira anterior, expandindo a circunferência ou largura do trabalho.',
    rightHandInstructions: [
      'Faça 1 ponto (normalmente pb) no ponto de base.',
      'Insira novamente a agulha no MESMO orifício onde acabou de tecer o ponto.',
      'Faça o segundo ponto no mesmo lugar.'
    ],
    leftHandInstructions: [
      'Teça o primeiro ponto na base.',
      'Insira a agulha no mesmo ponto anterior mais uma vez.',
      'Conclua o segundo ponto exatamente no mesmo local.'
    ],
    tips: [
      'Distribua os aumentos de forma homogênea para formar círculos perfeitos sem criar pontas hexagonais.'
    ],
    videoOrAnimKey: 'anim_aum',
  },
  {
    id: 'dim',
    namePt: 'Diminuição Tradicional',
    nameUs: 'Decrease (sc2tog)',
    shortPt: 'dim',
    shortUs: 'dec',
    difficulty: 'iniciante',
    category: 'modificadores',
    description: 'Junta dois pontos de base adjacentes em um único ponto, reduzindo a contagem total da carreira.',
    rightHandInstructions: [
      'Insira a agulha no primeiro ponto e puxe uma laçada (2 laçadas na agulha).',
      'Sem fechar, insira no segundo ponto adjacente e puxe mais uma laçada (3 laçadas).',
      'Dê uma laçada e passe através de todas as 3 laçadas juntas.'
    ],
    leftHandInstructions: [
      'Pesque uma laçada no primeiro ponto (2 laçadas na agulha).',
      'Insira no ponto seguinte e pesque outra laçada (3 laçadas).',
      'Enlace e feche as 3 juntas.'
    ],
    tips: [
      'Para amigurumis sem buracos, prefira sempre a "Diminuição Invisível".'
    ],
    videoOrAnimKey: 'anim_dim',
  },
  {
    id: 'dim_inv',
    namePt: 'Diminuição Invisível',
    nameUs: 'Invisible Decrease (invdec)',
    shortPt: 'dim_inv',
    shortUs: 'inv dec',
    difficulty: 'intermediario',
    category: 'modificadores',
    description: 'Técnica de ouro dos mestres do amigurumi! Pega apenas as alças da frente de dois pontos consecutivos, tornando a redução imperceptível no tecido.',
    rightHandInstructions: [
      'Pegue APENAS a alça da frente (front loop) do primeiro ponto de base com a ponta da agulha.',
      'Sem puxar fio, gire a ponta e pegue também a alça da frente do segundo ponto.',
      'Dê a laçada e passe através das duas alças da frente (2 laçadas na agulha).',
      'Dê outra laçada e feche o ponto normalmente.'
    ],
    leftHandInstructions: [
      'Insira a ponta da agulha de baixo para cima somente na alça frontal do primeiro ponto.',
      'Imediatamente introduza na alça frontal do ponto consecutivo.',
      'Puxe o fio por dentro das duas alças frontais.',
      'Faça uma laçada e feche as duas laçadas restantes.'
    ],
    tips: [
      'Praticamente elimina o desnível e os furinhos característicos da diminuição comum em amigurumis.'
    ],
    videoOrAnimKey: 'anim_dim_inv',
  },
];
