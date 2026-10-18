# Plano de Desenvolvimento: Crochê 3D Interativo 🧶✨

Este documento apresenta o plano técnico detalhado para a implementação do projeto **Crochê 3D Interativo**, estruturado em fases incrementais e orientadas a componentes reutilizáveis, garantindo alta performance gráfica, usabilidade hands-free, controle de privacidade (público/privado) e ecossistema social de artesãos.

---

## 1. Goal Description

Construir e inicializar uma aplicação web moderna (React + Vite + TypeScript + Tailwind CSS) integrada a um motor gráfico 3D (Three.js / React Three Fiber) que permite:
1. Criar e modelar objetos 3D ou importar arquivos `.glb` / `.obj` do Blender;
2. Simular texturas táteis de crochê em tempo real com relevo, torção e pilosidade de fios (algodão, lã, chenille e malha);
3. Converter bidirecionalmente modelos 3D em receitas de crochê (e vice-versa, com parser inteligente de texto pt-BR/US);
4. Executar receitas físicas no **Modo Crochetagem** com ditado por voz (TTS), comando de voz mãos-livres, feedback sonoro e mini-mapa 3D;
5. Controlar a **Visibilidade de Projetos (Públicos vs Privados)** com controle fino de permissões (`viewer` vs `editor`);
6. Compartilhar projetos privados via link seguro com token revogável ou convite por `@handle` do artesão, gerenciados na aba **'Compartilhados Comigo'**;
7. Explorar a **Galeria Pública da Comunidade**, seguir artesãos favoritos, curtir receitas e exibir fotos no mural **'Feito pela Comunidade'**;
8. Manter o **Perfil do Artesão** (ergonomia destro/canhoto, estatísticas e badges) e exportar receitas em PDF estilo revista.

---

## 2. User Review Required

> [!IMPORTANT]
> **Privacidade, Compartilhamento e Comunidade:**
> - **Projetos Privados**: Acessíveis exclusivamente pelo criador e por convidados autorizados. O dono escolhe o nível de permissão: `viewer` (pode tecer e ver o 3D com progresso isolado) ou `editor` (co-autoria com alteração de receitas), e pode habilitar/desabilitar download de PDF.
> - **Aba 'Compartilhados Comigo'**: Sub-aba dedicada na Prateleira onde o artesão visualiza todos os projetos privados concedidos por outros criadores e pode resgatar links com chave/token.
> - **Galeria da Comunidade**: Feed público social com filtros por categoria e nível de dificuldade, sistema de seguir criadores, curtidas e seção "Feito pela Comunidade" para fotos reais de peças físicas tecidas pelos usuários.

---

## 3. Open Questions

Nenhuma questão impeditiva em aberto. Todos os fluxos de permissão, links seguros e galeria social foram alinhados e validados no `/grill-me`.

---

## 4. Roteiro de Implementação por Fases

```mermaid
flowchart LR
    Fase1["Fase 1: Setup, Tipos & Perfil<br/><b>[CONCLUÍDA]</b>"] --> Fase2["Fase 2: Motor 3D & Shaders<br/><b>[CONCLUÍDA]</b>"]
    Fase2 --> Fase3["Fase 3: Conversão 3D <-> Receita<br/><b>[CONCLUÍDA]</b>"]
    Fase3 --> Fase4["Fase 4: Modo Crochetagem<br/><b>[CONCLUÍDA]</b>"]
    Fase4 --> Fase5["Fase 5: Dicionário & Tutoriais<br/><b>[CONCLUÍDA]</b>"]
    Fase5 --> Fase6["Fase 6: Prateleira, Compartilhamento & Comunidade<br/><b>[CONCLUÍDA]</b>"]
    Fase6 --> Fase7["Fase 7: Refatoração, Correções e Expansão de UX<br/><b>[CONCLUÍDA]</b>"]
```

---

### Fase 1: Fundação do Projeto, Tipos, Perfil e Estado Social `[CONCLUÍDA]`

- **Status**: 100% Implementado e Testado.
- **Artefatos Entregues**:
  - `package.json`, `vite.config.ts`, `tailwind.config.js`, `tsconfig.json`.
  - `src/types/crochet.ts`: Tipos completos de pontos, carreiras, perfis e permissões.
  - `src/core/storage/db.ts`: Instância do Dexie configurando tabelas `projects`, `profiles`, `sharedProjects` e `settings`.
  - `src/store/useCrochetStore.ts`, `useProfileStore.ts`, `useSocialStore.ts`.
  - `src/components/layout/Navbar.tsx` & `src/App.tsx`.

---

### Fase 2: Motor 3D, Shaders de Fio e Studio de Modelagem `[CONCLUÍDA]`

- **Status**: 100% Implementado e Testado.
- **Artefatos Entregues**:
  - `src/core/engine/CrochetShaderMaterial.ts`: Shaders procedurais simulando torção, relevo e pilosidade de fios.
  - `src/components/studio/Viewport3D.tsx`: Viewport com iluminação de estúdio, sombras de contato, câmera orbital e Drei `TransformControls`.
  - `src/components/studio/TransformGizmo.tsx`: Seletor de modos (Mover, Girar, Escalar).
  - `src/components/studio/PrimitiveControls.tsx`: Adição de primitivas paramétricas em centímetros.
  - `src/components/studio/PartsList.tsx`: Árvore de partes (duplicar, colorir, ocultar, deletar).
  - `src/components/studio/ImportModal.tsx`: Importador de `.glb`, `.gltf` e `.obj` com limite de 30MB.

---

### Fase 3: Motor de Conversão Bidirecional (3D $\leftrightarrow$ Receita) & Parser `[CONCLUÍDA]`

- **Status**: 100% Implementado e Testado.
- **Artefatos Entregues**:
  - `src/core/engine/MeshSlicer.ts`: Fatiamento radial (espiral/anel mágico) e linear com partição perfeita de aumentos e diminuições.
  - `src/core/parser/CrochetParserPtBr.ts` & `CrochetParserUs.ts`: Reconhecimento de abreviações pt-BR/US, expansão de ranges (`Carr 5-8`) e repetições com prefixo e sufixo.
  - `src/core/parser/PatternValidator.ts`: Validador matemático com sugestão de correção sem travar a renderização.
  - `src/core/engine/RecipeToMesh.ts`: Reconstrução 3D tubular em tempo real.
  - `src/components/pattern/PatternTextEditor.tsx` & `PatternRowTable.tsx`: Editor em texto livre e tabela visual com validação em tempo real.

---

### Fase 4: Modo Crochetagem (Hands-Free Live Tracker) `[CONCLUÍDA]`

- **Status**: 100% Implementado e Testado.
- **Artefatos Entregues**:
  - `src/core/audio/SpeechSynthesizer.ts`: Ditado em voz alta em português (TTS).
  - `src/core/audio/SpeechRecognizer.ts`: Reconhecimento contínuo de voz sem as mãos com resolução de prefix shadowing.
  - `src/core/audio/SoundEffects.ts`: Bips suaves via Web Audio API e celebração de finalização.
  - `src/components/tracker/LiveTrackerView.tsx` & `MiniMap3D.tsx`: Tela de execução com mini-mapa 3D sincronizado e botões de ajuda contextual `?`.

---

### Fase 5: Dicionário & Tutoriais Interativos de Crochê `[CONCLUÍDA]`

- **Status**: 100% Implementado e Testado.
- **Artefatos Entregues**:
  - `src/data/tutorialDatabase.ts`: Biblioteca de pontos e técnicas adaptadas para destros e canhotos.
  - `src/data/yarnPresets.ts`: Tabela técnica de fios e agulhas correspondentes.
  - `src/components/learn/StitchDictionary.tsx` & `YarnNeedleGuide.tsx`: Dicionário com busca rápida e calculadora de tensão/amostra.

---

### Fase 6: Prateleira de Projetos, Compartilhamento Privado & Galeria Social `[CONCLUÍDA]`

- **Status**: 100% Implementado e Testado.
- **Artefatos Entregues**:
  - `src/components/shelf/ProjectShelfView.tsx`: Sub-abas `Meus Projetos`, `Compartilhados Comigo` e `Favoritos`.
  - `src/components/shelf/ShareAccessModal.tsx` & `RedeemTokenModal.tsx`: Compartilhamento seguro com tokens revogáveis e convites por `@handle`.
  - `src/components/community/CommunityGalleryView.tsx`: Feed social com categorias, botão **Seguir Artesão** e mural **Feito pela Comunidade**.
  - `src/core/services/ShareService.ts` & `CommunityService.ts`: Serviços desacoplados e prontos para Supabase RLS.
  - `src/core/export/PdfExporter.ts`: Exportador de PDF profissional com render 3D em alta definição e assinatura imutável do designer.

---

### Fase 7: Refatoração, Correções Críticas e Expansão de UX `[CONCLUÍDA]`

- **Status**: 100% Implementado e Testado.
- **Artefatos Entregues**:
  - `src/components/layout/Navbar.tsx`: Reordenação da barra com 4 abas principais (`Comunidade` -> `Prateleira` -> `Criação` -> `Tutoriais`) e centralização contextual do Modo Crochetagem como 3ª sub-aba de Criação e na visualização dedicada do modelo.
  - `src/components/project/ProjectDetailView.tsx`: Tela de apresentação editorial com hero image real, especificações técnicas, lista de materiais/fios, botões de ação direta ("Abrir no 3D Studio" e "Modo Crochetagem") e mural comunitário.
  - `src/core/parser/PatternTranslator.ts`: Tradutor bidirecional inteligente pt-BR $\leftrightarrow$ US com regex ancorada no início da linha para evitar corrupção de números de contagem (`6 pb`).
  - `src/components/pattern/PatternTextEditor.tsx`: Botão de tradução instantânea e conversão automática ao alternar idiomas.
  - `src/core/engine/RecipeToMesh.ts`: Lathe esférico com fechamento perfeito em leque triangular (`fan`) no topo e na base, além de Laplacian Smoothing prevenindo pontas e malhas abertas.
  - `src/core/engine/CrochetShaderMaterial.ts`: Shaders aprimorados com Wrap Diffuse e Micro-Weave Sheen para textura aveludada.
  - `src/components/tracker/LiveTrackerView.tsx`: Controle intencional de execução (botão Play/Pause para áudio TTS), gaveta retrátil lateral com visão de todas as partes e carreiras do amigurumi, e badges clicáveis que abrem tutoriais com 1 clique.
  - `src/components/learn/StitchSvgDiagram.tsx`: Diagramas vetoriais paramétricos em SVG para todos os pontos básicos e avançados com espelhamento ergonômico para artesãos canhotos (`scaleX(-1)`).
  - `src/core/export/PdfExporter.ts`: Exportação em PDF no padrão revista com foto real de capa, tabela de materiais, convenções e caixas de checagem impressas (`[ ]`).
  - `src/components/auth/AuthModal.tsx`: Gestor de autenticação local com troca instantânea de perfis e criação de novos artesãos sem barreiras.
  - `src/__tests__/parsers.test.ts`: Suíte de testes expandida para 13 cenários cobrindo tradução bidirecional e regex de carreira.

---

## 5. Relatório de Verificação e Homologação

### Testes Automatizados (Vitest)
```powershell
npm test -- --run
```
- **Total de Testes**: 25 testes unitários em 3 suítes.
- **Resultado**: 25 passed (0 failed).
  - `src/__tests__/parsers.test.ts` (13 testes): Validação de parsing pt-BR, US, tradução bidirecional com regex ancorada, expansão de ranges e repetições aninhadas.
  - `src/__tests__/store_and_tabs.test.ts` (7 testes): Validação da hierarquia de 4 abas, sub-abas de Criação, controle de Play/Pause e abertura de projeto no tracker.
  - `src/__tests__/engine.test.ts` (5 testes): Fatiamento radial, conservação de pontos na malha, geração de malha tubular fechada e validação matemática sem falsos positivos.

### Compilação de Produção
```powershell
npm run build
```
- **Resultado**: Exit code 0, 2435 módulos compilados com sucesso via `tsc -b && vite build`.
- **Diagnósticos**: 0 erros de tipos TypeScript e 0 warnings impeditivos.
