# Diretrizes e Invariantes do Projeto: Crochê 3D Interativo

Este repositório implementa uma aplicação web moderna de modelagem têxtil 3D, conversão bidirecional de receitas de crochê e execução hands-free por comandos de voz.
Ao realizar implementações, refatorações ou manutenções neste projeto, siga rigorosamente as seguintes invariantes arquiteturais e regras de engenharia:

---

## 1. Arquitetura de Navegação (4 Abas Globais)

- A barra de navegação global (`src/components/layout/Navbar.tsx`) possui exatamente 4 abas principais:
  1. `community` (Comunidade: feed público, seguir artesãos, curtidas e mural "Feito pela Comunidade")
  2. `shelf` (Prateleira: Meus Projetos, Compartilhados Comigo com link/token e Favoritos)
  3. `creation` (Criação: Hub unificado com 3 sub-abas)
  4. `learn` (Tutoriais: Dicionário de pontos com SVG, guia de fios e agulhas)
- **Localização do Modo Crochetagem**:
  - O Modo Crochetagem **nunca** deve ser adicionado como uma aba de 1º nível na Navbar.
  - Ele é acessado no contexto do projeto ativo:
    - Na tela dedicada da receita ([`ProjectDetailView.tsx`](file:///c:/Users/ayrto/Documents/antigravity/crochet-3d/src/components/project/ProjectDetailView.tsx)) através do botão "Tecer Agora no Modo Crochetagem" (com botão de retorno `← Voltar aos Detalhes`).
    - Na área de Criação como a 3ª sub-aba horizontal: `[Studio 3D] [Editor de Receitas] [Modo Crochetagem]`.
  - Ao clicar em "Tecer Peça" em qualquer card da vitrine ou prateleira, use `openProjectInTracker(projectId)`, que abre a tela de detalhes do modelo diretamente no tracker.

---

## 2. Invariantes de Parser e Tradução (PatternTranslator & CrochetParsers)

- **Ancoragem de Linha em Expressões Regulares**:
  - Toda captura de número de carreira deve ser estritamente ancorada no início da linha com:
    ```typescript
    /^\s*(?:carr(?:eira)?\.?|c)?\s*(\d+)/i
    ```
  - **Nunca** utilize regex de carreira com prefixo opcional sem ancoragem de linha (`^`), pois isso captura contagens de pontos isoladas (ex: `6 pb` era transformado erroneamente em `Rnd 6: pb`).
- **Ordem de Substituição de Tokens**:
  - Termos compostos e mais longos (ex: `dim_inv`, `sl st`, `mr`, `hdc`, `fpdc`) devem sempre ser processados antes de termos curtos ou substrings (ex: `dim`, `st`, `sc`, `dc`), evitando substituições parciais indevidas.

---

## 3. Invariantes do Motor 3D e Shaders (RecipeToMesh & CrochetShaderMaterial)

- **Geometria Fechada de Amigurumi**:
  - Peças circulares fechadas (como cabeças, corpos e esferas de amigurumi) devem gerar polos fechados triangulados em leque (*fan triangulation*) conectando os anéis extremos aos vértices polares `(0, y_topo, 0)` e `(0, y_base, 0)`.
  - Nunca deixe malhas de amigurumi com extremidades abertas em forma de funil ou tubo oco.
  - O perfil do raio das carreiras deve seguir distribuição senoidal/esférica suave para evitar cones afiados.
  - Utilize Laplacian Smoothing moderado para eliminar vincos ou dobras mecânicas entre carreiras.
- **Renderização Têxtil Fiel e Leve**:
  - O shader customizado (`CrochetShaderMaterial.ts`) deve simular textura tátil através de Wrap Diffuse e Micro-Weave Sheen para reproduzir o toque de veludo/algodão sem o custo computacional de malha volumétrica (garantindo $\ge 60 \text{ FPS}$).

---

## 4. Invariantes de Áudio e Usabilidade Hands-Free (LiveTrackerView)

- **Controle Intencional de Áudio (Play/Pause Gate)**:
  - A síntese de voz (TTS) **nunca** deve tocar automaticamente no carregamento da tela (`autoplay`).
  - O áudio só deve ser emitido se `trackerIsPlaying === true` E `ttsEnabled === true`.
  - O usuário deve ter controle explícito via botão Play/Pause.
- **Visão Ampla da Receita (Drawer)**:
  - O Modo Crochetagem deve conter uma gaveta lateral retrátil (drawer) listando todas as partes e carreiras do amigurumi completo, permitindo saltar diretamente para qualquer ponto da receita.
- **Tutoriais Rápidos em Popover**:
  - As abreviações de pontos na carreira ativa devem ser clicáveis como badges, abrindo instantaneamente o modal explicativo com o passo a passo em SVG sem perder o progresso.

---

## 5. Invariantes de Acessibilidade e Diagramas SVG (StitchSvgDiagram)

- **Diagramas Vetoriais em SVG**:
  - Cada ponto do crochê deve ter um diagrama explicativo vetorial limpo desenhado com SVG nativo (`StitchSvgDiagram.tsx`).
- **Ergonomia para Canhotos**:
  - Quando a preferência do perfil for canhoto (`dominantHand === 'left'`), os diagramas devem ser espelhados horizontalmente de forma automática usando CSS `transform: scaleX(-1)`.

---

## 6. Invariantes de Exportação em PDF (PdfExporter)

- **Layout Revista Editorial**:
  - O PDF deve ter acabamento profissional com capa fotográfica em alta resolução baseada nas fotos da peça física real, preservando sua proporção (`keepAspectRatio`).
  - Deve conter ficha técnica de materiais consumidos, tabela de abreviações e créditos imutáveis do designer.
  - **Acompanhamento no Papel**: Todas as carreiras devem conter caixas de checagem impressas (`[ ]`) para que artesãos que preferem trabalhar longe da tela possam marcar o progresso com caneta.

---

## 7. Qualidade de Código e Verificação

- **Testes Automatizados**: A suíte de testes unitários com Vitest (`npm test -- --run`) deve manter 100% de sucesso (25/25 testes passando).
- **Compilação TypeScript & Vite**: O comando `npm run build` deve compilar com 0 erros de tipagem e 0 avisos impeditivos.
- **Preservação de Documentação**: Mantenha os documentos em `docs/` e `plans/` rigorosamente alinhados com o código.
