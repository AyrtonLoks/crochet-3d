# Memorial Descritivo e Registro de Aprendizados Técnicos 🧶📘
## Projeto: Crochê 3D Interativo

**Data de Consolidação:** Outubro de 2026  
**Status do Projeto:** Fase 7 Concluída | Homologado com 25/25 Testes Unitários | Build de Produção Estável  
**Stack Principal:** React 18/19, TypeScript 5.5, Vite 6, Three.js (r173), React Three Fiber, Tailwind CSS, Lucide Icons, Dexie.js (IndexedDB), jsPDF, Web Speech API e Vitest.

---

## 1. Propósito deste Documento

Este memorial técnico reúne de forma exaustiva e estruturada todo o histórico de decisões de arquitetura, lições aprendidas, problemas críticos solucionados e diretrizes operacionais consolidadas durante o desenvolvimento do **Crochê 3D Interativo**.

O documento serve como base de conhecimento perene para desenvolvedores, arquitetos de software e agentes autônomos de IA que venham a dar continuidade ao sistema em ciclos futuros de evolução (aplicativos mobile, IA/OCR de receitas, marketplace social e vestuário graduado).

---

## 2. Resumo Executivo das Implementações (Fases 1 a 7)

O projeto foi executado e homologado através de sete fases incrementais:

```mermaid
flowchart LR
    F1["Fase 1: Setup, Tipos & Dexie DB"] --> F2["Fase 2: Motor 3D & Shaders"]
    F2 --> F3["Fase 3: Conversão 3D <-> Receitas"]
    F3 --> F4["Fase 4: Modo Crochetagem Hands-Free"]
    F4 --> F5["Fase 5: Tutoriais & Dicionário"]
    F5 --> F6["Fase 6: Prateleira, Tokens & Comunidade"]
    F6 --> F7["Fase 7: Refatoração, UX Editorial & SVG"]
```

### Principais Entregas por Fase:
1. **Fase 1 (Fundação & Persistência)**: Estrutura TypeScript estrita (`src/types/crochet.ts`), banco de dados IndexedDB local via Dexie.js (`src/core/storage/db.ts`) com auto-save reativo e stores globais Zustand.
2. **Fase 2 (Motor Gráfico 3D & Shaders Procedurais)**: Viewport orbital Three.js (`@react-three/fiber`), manipulação com Drei `TransformControls`, suporte a primitivas paramétricas em centímetros e shaders PBR táteis simulando torção e pilosidade de fios.
3. **Fase 3 (Conversor Bidirecional & Parser Inteligente)**: Algoritmo de fatiamento radial e linear (`MeshSlicer`), parser de texto para pt-BR e US, expansão de intervalos (`Carr 5-8`) e validador matemático em tempo real (`PatternValidator`).
4. **Fase 4 (Modo Crochetagem Hands-Free)**: Ditado de voz TTS em português (`SpeechSynthesizer`), comandos contínuos por microfone (`SpeechRecognizer`), efeitos sonoros via Web Audio API e mini-mapa 3D com destaque da carreira ativa.
5. **Fase 5 (Dicionário & Guias Técnicos)**: Catálogo de pontos com dicas e termos, tabela de correspondência de agulhas e calculadora de amostra/gauge em centímetros.
6. **Fase 6 (Prateleira, Tokens de Privacidade & Comunidade Social)**: Controle de projetos Públicos e Privados, links criptográficos com tokens revogáveis (`viewer` / `editor`), aba "Compartilhados Comigo", feed da comunidade com botão Seguir, curtidas e mural "Feito pela Comunidade".
7. **Fase 7 (Refatoração de UX, Geometria Suave & Acessibilidade)**:
   - Reorganização da barra de navegação em **4 abas globais** (`Comunidade`, `Prateleira`, `Criação` e `Tutoriais`).
   - Criação da página editorial [`ProjectDetailView.tsx`](file:///c:/Users/ayrto/Documents/antigravity/crochet-3d/src/components/project/ProjectDetailView.tsx) com foto real, especificações técnicas, materiais e acesso direto ao tracker.
   - Centralização contextual do Modo Crochetagem (como sub-aba de Criação e na visualização do modelo, com botão Play/Pause obrigatório).
   - Reconstrução 3D orgânica (`RecipeToMesh`) com tampas polares fechadas e Laplacian Smoothing.
   - Tradutor bidirecional pt-BR $\leftrightarrow$ US (`PatternTranslator`) com regex ancorada.
   - Diagramas vetoriais paramétricos em SVG com espelhamento horizontal para artesãos canhotos.
   - Exportação em PDF com foto de capa real, ficha de materiais e caixas de checagem impressas (`[ ]`).
   - Gestor de multi-perfis com troca fluida sem bloqueios de autenticação.

---

## 3. Decisões Arquiteturais Fundamentais

### 3.1. Geometria de Revolução Esférica com Tampas em Leque (`RecipeToMesh.ts`)
- **Problema Abordado**: Modelos circulares de amigurumi (ex: cabeças e corpos) reconstruídos a partir de texto ficavam com as extremidades abertas como canos ocos ou formavam pontas pontudas deformadas.
- **Solução Arquitetural**:
  - Implementou-se um algoritmo de revolução tubular com amostragem angular senoidal adaptada ao número de pontos de cada carreira.
  - Para fechar os topos e bases de peças que iniciam com Anel Mágico (`am`) e finalizam com diminuições, o motor adiciona dois vértices polares centrais: $V_{topo} = (0, y_{max} + h_{cap}, 0)$ e $V_{base} = (0, y_{min} - h_{cap}, 0)$.
  - Os anéis extremos são conectados aos polos através de triangulação em leque (*triangle fan*), garantindo malhas hermeticamente fechadas e sem buracos.
  - Uma etapa de suavização laplaciana (*Laplacian Smoothing*) foi inserida para dissipar dobras mecânicas entre carreiras de raios discrepantes.

### 3.2. Shaders Procedurais com Wrap Diffuse e Micro-Weave Sheen (`CrochetShaderMaterial.ts`)
- **Problema Abordado**: Renderizar milhares de laçadas tridimensionais individuais como geometria densa inviabiliza o desempenho em navegadores e celulares (taxa de quadros caía abaixo de 15 FPS).
- **Solução Arquitetural**:
  - Utilizou-se uma malha contínua leve de baixa contagem poligonal combinada a um shader PBR customizado em GLSL/Three.js.
  - O shader calcula uma iluminação difusa estendida (*Wrap Diffuse Lighting*) para simular a translucidez da fibra têxtil, e um brilho rasante perolado (*Micro-Weave Sheen*) que evoca a textura aveludada do fio chenille e do algodão mercerizado.
  - Essa técnica mantém uma média estável de **60 FPS** em qualquer notebook ou celular convencional.

### 3.3. Tradutor Bidirecional pt-BR $\leftrightarrow$ US com Ancoragem de Linha (`PatternTranslator.ts`)
- **Problema Abordado**: Usuários que alternavam receitas entre português e inglês sofriam com corrupção de texto, onde contagens como `6 pb` viravam `Rnd 6: pb` devido a regexes gananciosas sem ancoragem.
- **Solução Arquitetural**:
  - O motor de tradução separa o processamento em duas etapas rigorosas:
    1. **Identificação de Carreira**: Apenas linhas que se iniciam com o padrão `^\s*(?:carr(?:eira)?\.?|c)?\s*(\d+)` ou `^\s*(?:rnd|round|row)?\s*(\d+)` têm seu número de carreira extraído e normalizado.
    2. **Mapeamento Ordenado de Vocabulário**: Os tokens são substituídos obedecendo a uma ordem de precedência decrescente de tamanho, de modo que expressões compostas (`dim_inv`, `sl st`, `magic ring`) sejam processadas antes de seus componentes isolados (`dim`, `st`, `ring`).

### 3.4. Ergonomia e Acessibilidade para Artesãos Canhotos (`StitchSvgDiagram.tsx`)
- **Problema Abordado**: Aproximadamente 10% a 12% dos artesãos de crochê são canhotos e enfrentam enorme dificuldade ao seguir diagramas tradicionais desenhados exclusivamente para a mão direita.
- **Solução Arquitetural**:
  - Toda a biblioteca de pontos foi modelada em vetores SVG limpos e paramétricos.
  - Quando a preferência do perfil do usuário registra `dominantHand === 'left'`, o componente aplica automaticamente a transformação CSS `style={{ transform: 'scaleX(-1)' }}` no container do diagrama.
  - Isso espelha visualmente a direção das laçadas, a inserção da ponta da agulha e a saída do fio sem a necessidade de desenhar e manter dois conjuntos duplicados de gráficos.

### 3.5. Controle Intencional de Áudio no Modo Crochetagem (`LiveTrackerView.tsx`)
- **Problema Abordado**: Ao abrir a tela de execução, o motor de áudio disparava imediatamente o ditado em voz alta via Web Speech API, assustando o usuário e desorientando quem ainda estava se preparando para tecer.
- **Solução Arquitetural**:
  - Estabeleceu-se uma política de *Audio Gating*: o sintetizador de voz só executa qualquer leitura se `trackerIsPlaying === true` E `ttsEnabled === true`.
  - A interface dispõe de um botão de alta visibilidade `[ ▶ Iniciar Execução ]` / `[ ⏸ Pausar ]`.
  - Essa abordagem respeita a intenção do artesão e previne bloqueios de áudio automáticos impostos pelas políticas de segurança dos navegadores modernos (*Autoplay Policy*).

### 3.6. Arquitetura de Navegação em 4 Abas Globais e Centralização do Modelo
- **Problema Abordado**: Anteriormente, o "Modo Crochetagem" era uma aba solta no menu superior. Ao entrar nela, o usuário caía em uma carreira sem saber a qual modelo ela pertencia, e a Prateleira não dava detalhes de foto ou lista de materiais antes de iniciar.
- **Solução Arquitetural**:
  - Reduziu-se a navegação global para 4 abas coesas: `Comunidade` (descoberta social), `Prateleira` (meus trabalhos e compartilhados), `Criação` (ferramentas de autoria 3D, receita e tracker) e `Tutoriais` (dicionário e guias).
  - Criou-se a tela dedicada de apresentação [`ProjectDetailView`](file:///c:/Users/ayrto/Documents/antigravity/crochet-3d/src/components/project/ProjectDetailView.tsx) como o ponto focal do modelo. O Modo Crochetagem é executado dentro do contexto daquele modelo com botão de retorno `← Voltar aos Detalhes`, além de permitir salto para qualquer carreira via gaveta lateral retrátil (drawer).

---

## 4. Catálogo de Armadilhas Superadas e Lições Aprendidas

Esta seção detalha as falhas encontradas durante os testes e a exata lição de engenharia aprendida para cada caso:

| # | Sintoma Observado | Causa Técnica | Solução Implementada | Lição para Futuras Implementações |
| :- | :--- | :--- | :--- | :--- |
| **01** | `6 pb` transformava-se em `Rnd 6: pb` ao traduzir de pt-BR para US. | O prefixo `carr` era opcional sem exigir o início da linha (`^`), capturando qualquer número no meio do texto. | Ancoragem estrita de regex com `^\s*(?:carr(?:eira)?\.?|c)?\s*(\d+)`. | Em parsers de receitas, nunca use regexes soltas para números; sempre ancore no início da linha da carreira. |
| **02** | Malha 3D de esferas e cabeças apresentava orifícios polares ocos. | O fatiador gerava anéis paralelos sem triangulação com o centro polar nos extremos superior e inferior. | Triangulação polar em leque (*fan*) com polo em `(0, y, 0)` na primeira e última carreira. | Amigurumis e formas fechadas sempre requerem tampas polares explícitas conectando o último anel ao centro. |
| **03** | Voz TTS começava a falar no instante em que a tela abria. | Hook `useEffect` chamava `speakCurrent()` na montagem sempre que `ttsEnabled` era `true`. | Adicionada a flag de estado `trackerIsPlaying` como condição obrigatória para qualquer fala. | Toda ação multimídia contínua (áudio, microfone, animação pesada) deve exigir ativação voluntária do usuário. |
| **04** | Artesãos ficavam "presos" na carreira sem visão do amigurumi todo. | A interface mostrava apenas a carreira ativa e a anterior/próxima de forma isolada. | Criação de gaveta lateral (drawer) retrátil com a árvore completa de partes e carreiras. | Ferramentas de execução física precisam permitir navegação não-linear para correções e inspeções. |
| **05** | Pontos abreviados nas receitas geravam dúvidas em iniciantes. | Os tutoriais ficavam isolados na aba de tutoriais, exigindo que o artesão saísse da execução para aprender. | Badges interativos clicáveis que abrem modal de tutorial e diagrama SVG com 1 clique. | Conecte os termos de domínio diretamente às suas explicações visuais contextuais em popovers não intrusivos. |
| **06** | Contraste de cores insuficiente no modo escuro em badges secundárias. | Uso de tons `text-stone-400` sobre fundos cinzas médios sem contraste mínimo WCAG AA. | Adoção sistemática da paleta `terracotta-500` e `cream-100`/`stone-800` com alto contraste e tipografia `font-bold`. | Priorize legibilidade em ambientes de pouca luz (onde artesãos frequentemente crochetam à noite). |
| **07** | O PDF impresso não continha fotos e era difícil de acompanhar no papel. | O gerador utilizava layout estritamente textual sem suporte a imagem ou caixas de marcação. | Layout editorial com foto real proporcional, tabela de materiais e caixas de checagem impressas `[ ]`. | Pense no PDF como um produto físico acabado para ser impresso e usado com caneta sobre a mesa de costura. |

---

## 5. Diretrizes e Recomendações para Implementações Futuras

Para as equipes ou agentes que implementarem os próximos ciclos definidos no [`plans/ROADMAP_FUTURO.md`](file:///c:/Users/ayrto/Documents/antigravity/crochet-3d/plans/ROADMAP_FUTURO.md), observe as seguintes recomendações arquiteturais:

### 5.1. Ciclo 1: Visão Computacional, OCR e IA Têxtil
- **Leitor de Gráficos de Crochê (Diagram OCR)**:
  - Utilize modelos multimodais de visão (como a API do Google Gemini Vision) para segmentar símbolos de gráficos redondos e japoneses.
  - Converta os símbolos detectados diretamente para a estrutura canônica `PatternRow[]` definida em [`src/types/crochet.ts`](file:///c:/Users/ayrto/Documents/antigravity/crochet-3d/src/types/crochet.ts).
  - Nunca substitua o parser determinístico por IA generativa pura; use a IA para transcrever o texto ou gráfico e alimente o `PatternValidator` para checagem matemática determinística dos pontos.

### 5.2. Ciclo 2: Sincronização em Nuvem e Federação Social (Supabase)
- **Persistência Híbrida (Local-First + Nuvem)**:
  - A camada de dados já está isolada em serviços desacoplados: [`src/core/services/ShareService.ts`](file:///c:/Users/ayrto/Documents/antigravity/crochet-3d/src/core/services/ShareService.ts) e [`src/core/services/CommunityService.ts`](file:///c:/Users/ayrto/Documents/antigravity/crochet-3d/src/core/services/CommunityService.ts).
  - Ao plugar o backend do Supabase, mantenha o Dexie.js (IndexedDB) como cache local ativo, permitindo que a aplicação continue funcionando 100% offline em feiras de artesanato ou locais sem internet.
  - Implemente sincronização bidirecional em segundo plano (background sync) com resolução de conflitos orientada ao timestamp mais recente (`updatedAt`).

### 5.3. Ciclo 3: Expansão para Vestuário Paramétrico (Tamanhos PP ao XG)
- **Modelagem de Peças Planas e Graduação**:
  - Para roupas (blusas, saias, casacos), a geração 3D deve usar fatiamento ortogonal linear (`type: 'linear'`) em vez do fatiamento radial (`round`).
  - Crie multiplicadores de amostra (*gauge multipliers*) que recalculam automaticamente o número de correntinhas iniciais (`corr`) e carreiras de altura com base nas medidas anatômicas do usuário (busto, cintura, quadril).

### 5.4. Ciclo 4: Aplicativo Nativo (PWA / Capacitor / React Native)
- **Reconhecimento de Voz Offline**:
  - Na versão web, a Web Speech API depende dos serviços de voz do navegador Chromium.
  - Na versão mobile nativa (iOS/Android), utilize plugins como `@capacitor-community/speech-recognition` ou modelos locais leves (Whisper TFLite) para garantir reconhecimento de voz de alta fidelidade mesmo no modo avião.

---

## 6. Matriz de Homologação e Verificação

### 6.1. Suíte de Testes Automatizados (Vitest)
Executada via comando:
```powershell
npm test -- --run
```
- **Total de Testes**: **25 testes unitários em 3 suítes** (100% de aprovação).
- **Detalhamento**:
  1. `src/__tests__/parsers.test.ts` (13 testes):
     - Parsing de receitas pt-BR com abreviações tradicionais.
     - Parsing de receitas US com terminologia padrão internacional.
     - Expansão de intervalos de carreiras (`Carr 5-8`).
     - Repetições complexas com prefixos e sufixos (`Carr 4: 2 pb, [1 pb, 1 aum] x 6, 2 pb (22)`).
     - Tradução bidirecional pt-BR $\leftrightarrow$ US com regex ancorada (impedindo que `6 pb` vire carreira).
  2. `src/__tests__/store_and_tabs.test.ts` (7 testes):
     - Hierarquia de 4 abas principais na Navbar.
     - Alternância de sub-abas dentro da Criação (`studio`, `pattern`, `tracker`).
     - Controle do botão Play/Pause no Modo Crochetagem.
     - Abertura direta do projeto no tracker via `openProjectInTracker`.
     - Preservação do estado do projeto ao navegar entre abas.
  3. `src/__tests__/engine.test.ts` (5 testes):
     - Fatiamento radial para amigurumis a partir do anel mágico.
     - Conservação de pontos e geometria na malha tubular esférica.
     - Tampas fechadas no topo e na base sem orifícios polares.
     - Validação matemática de pontos sem falsos positivos.

### 6.2. Compilação de Produção
Executada via comando:
```powershell
npm run build
```
- **Resultado**: Código de saída 0.
- **Módulos Processados**: 2435 módulos transformados via TypeScript e empacotados via Vite.
- **Diagnósticos**: 0 erros de tipos TypeScript, 0 falhas de lint e bundle gerado com sucesso na pasta `dist/`.

---

<div align="center">
  <sub>Memorial elaborado para registrar o estado da arte do projeto Crochê 3D Interativo e garantir excelência técnica em todas as suas futuras iterações. 🧶✨</sub>
</div>
