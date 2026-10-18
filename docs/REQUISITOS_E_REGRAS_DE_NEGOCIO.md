# Matriz de Requisitos e Regras de Negócio: Crochê 3D Interativo

Documento formal consolidado com os Requisitos Funcionais, Requisitos Não-Funcionais, Regras de Negócio e Restrições do Sistema.

---

## 1. Regras de Negócio (RN)

| ID | Nome da Regra | Descrição e Critério de Aceite |
| :--- | :--- | :--- |
| **RN-01** | **Validação Inteligente de Pontos** | O sistema não deve travar a aplicação diante de erros de contagem em receitas. Se a soma de pontos de uma carreira divergir do total esperado (ex: carreira anterior com 18 pts, mas a fórmula resulta em 20 pts), o sistema emite um alerta visual indicando a diferença e sugere a correção matemática ideal, mantendo a visualização 3D aproximada. |
| **RN-02** | **Cálculo de Tensão e Dimensões (Gauge)** | O sistema calcula automaticamente o tamanho físico da peça pronta (em centímetros: largura, altura e profundidade) e a metragem/peso de fio necessário (metros e gramas) com base no fio e na agulha selecionados. Permite calibração manual de amostra (ex: $N$ pontos $\times$ $M$ carreiras = $10 \text{ cm}$) para artesãos experientes. |
| **RN-03** | **Direcionalidade da Tecelagem** | Para peças circulares/amigurumis, a receita padrão é gerada em espiral contínua a partir de um Anel Mágico (`am`) com aumentos radiais ($+6$ a $+8$ pontos por volta dependendo do ponto base) até o diâmetro máximo e fechamento com diminuições (`dim` ou `dim_inv`). Para peças planas, a geração ocorre em carreiras lineares de ida e volta com correntinhas de virada (`corr`). |
| **RN-04** | **Estrutura Multi-Peças para Montagem** | Modelos complexos (como amigurumis) são organizados hierarquicamente em partes independentes (ex: "Cabeça", "Corpo", "Orelhas (fazer 2)", "Focinho"). Cada peça possui sua própria receita numerada de forma independente e lista de instruções de montagem/costura. |
| **RN-05** | **Política de Auto-Save e Proteção** | Toda ação no Modo Crochetagem (avanço de carreira, contagem de ponto concluído) e toda edição no Studio 3D deve persistir imediatamente no banco de dados local (IndexedDB) com debounce de segurança, garantindo que o progresso nunca seja perdido se a aba for fechada. |
| **RN-06** | **Padrão de Nomenclatura Bilíngue** | O motor de processamento deve reconhecer sinônimos e abreviações tanto do padrão brasileiro (pt-BR: `corr`, `pb`, `pa`, `mpa`, `pbx`, `aum`, `dim`, `dim_inv`, `am`) quanto do padrão internacional (US: `ch`, `sc`, `dc`, `hdc`, `sl st`, `inc`, `dec`, `mr`). |
| **RN-07** | **Vínculo Duplo de Projeto (Autor vs Executante)** | O projeto suporta distinção explícita entre quem desenhou/modelou a receita (`designer`) e quem está tecendo a peça (`maker`). O usuário logado ou ativo no navegador registra seu progresso em um Diário de Execução pessoal independente. |
| **RN-08** | **Preservação de Direitos e Créditos Imutáveis** | Ao exportar um projeto (`.crochet3d` ou PDF), os créditos do designer original (nome, marca, links sociais e licença de uso) tornam-se imutáveis. Quem importar o arquivo passa a ser o executante da sua própria cópia, respeitando as condições de venda da peça física. |
| **RN-09** | **Ergonomia por Mão Dominante (Destro/Canhoto)** | A preferência de mão dominante do artesão no perfil ajusta a renderização e animações de laçadas nos tutoriais (espelhando a mão segurando a agulha) e orienta a ordem de leitura das carreiras circulares (sentido anti-horário para destros e horário para canhotos). |
| **RN-10** | **Acúmulo de Estatísticas e Conquistas** | Cada ponto e carreira concluída no Modo Crochetagem incrementa o contador global do artesão (total de pontos e metros de fio estimados), desbloqueando insígnias comemorativas na conclusão de peças. |
| **RN-11** | **Controle de Visibilidade (Público vs Privado)** | Todo projeto possui um estado de visibilidade configurado pelo dono. Projetos **Públicos** são visíveis na Galeria da Comunidade e podem ser descobertos e favoritados por qualquer artesão. Projetos **Privados** são acessíveis exclusivamente pelo dono e pelos usuários que receberem permissão explícita. |
| **RN-12** | **Concessão de Acesso a Projetos Privados** | A permissão para um projeto privado é concedida pelo dono através de: (1) Convite direto ao `@handle` do artesão, ou (2) Link seguro com chave de acesso/token gerado pelo dono, com capacidade de revogação a qualquer momento. |
| **RN-13** | **Hierarquia de Permissões Compartilhadas** | Ao compartilhar um projeto privado, o dono define o papel do convidado: **Visualizador/Maker** (pode visualizar o modelo 3D e acompanhar no Modo Crochetagem com progresso individual, sem alterar a receita) ou **Co-autor/Editor** (pode sugerir e editar instruções da receita). O download de PDF pode ser liberado ou bloqueado pelo dono. |
| **RN-14** | **Engajamento e Rede de Artesãos (Follow & Likes)** | Usuários podem seguir artesãos na comunidade. Os projetos públicos dos artesãos seguidos aparecem com destaque no feed do usuário. Curtidas incrementam o ranking de popularidade dos modelos. |
| **RN-15** | **Comunidade 'Feito por Você' (Makes)** | Usuários que crochetagem receitas públicas da comunidade podem publicar fotos de suas peças físicas reais na página do projeto original, enriquecendo a receita com fotos reais da comunidade mantendo os créditos do designer. |
| **RN-16** | **Obrigatoriedade de Tela de Detalhes da Receita** | O clique em um card de projeto na Prateleira ou na Comunidade direciona para a visualização dedicada (`ProjectDetailView`), onde o artesão visualiza a foto real da peça, lista de materiais/ingredientes, créditos do designer, fotos da comunidade e botões claros de ação para "Abrir no 3D Studio" e "Iniciar Modo Crochetagem". |
| **RN-17** | **Controle Explícito de Reprodução no Modo Crochetagem (Play/Pause Gate)** | O áudio do ditado TTS e a progressão de pontos nunca devem iniciar automaticamente ao abrir a tela. A execução requer ação intencional do usuário através do botão "Iniciar Execução" (Play/Pause), prevenindo disparos sonoros inesperados e garantindo controle ergonômico pleno. |
| **RN-18** | **Tradução Automática de Idioma e Convenções (pt-BR $\leftrightarrow$ US)** | A alternância entre português e inglês no editor traduz não apenas os termos de pontos, mas normaliza números de carreira (`Carr. X:` $\leftrightarrow$ `Rnd X:`), repetições e anotações com ancoragem de regex no início da linha para nunca corromper contagens isoladas de pontos (ex: `6 pb`). |
| **RN-19** | **Exportação em PDF com Checkboxes para Impressão Física** | O PDF gerado deve conter caixas de checagem impressas (`[ ]`) para cada carreira, permitindo ao artesão marcar com caneta seu progresso no papel, além de foto da peça física na capa e tabela de materiais. |
| **RN-20** | **Autenticação Fluida e Gestão Local de Identidades** | O sistema deve permitir criar novas contas de artesão e alternar entre perfis de teste ou locais instantaneamente sem exigir confirmações de e-mail ou senhas impeditivas na versão local. |

---

## 2. Requisitos Funcionais (RF)

### 2.1. Modelagem 3D & Importação (Studio)
- **RF-01**: O sistema deve fornecer ferramentas para adicionar e manipular primitivas 3D (Esfera, Cilindro, Cápsula, Cone, Cubo e Torus).
- **RF-02**: O sistema deve permitir mover, rotacionar e escalar objetos em eixos 3D (X, Y, Z) com Gizmo interativo e painel numérico de dimensões em cm.
- **RF-03**: O sistema deve permitir criar múltiplas partes, duplicá-las, renomeá-las e definir cores/fios individuais para cada peça.
- **RF-04**: O sistema deve suportar importação de arquivos 3D externos nos formatos `.glb`, `.gltf` e `.obj` (com limite de até 30 MB).
- **RF-05**: Ao importar arquivos externos com múltiplos objetos, o sistema deve detectar automaticamente as sub-malhas e permitir selecionar a orientação espacial e o ponto inicial da tecelagem.

### 2.2. Renderização Fiel de Crochê (Render Engine)
- **RF-06**: O sistema deve renderizar os modelos 3D com shaders de textura realista de crochê (simulando pontos reais, relevo, pilosidade e torção de fios).
- **RF-07**: O sistema deve disponibilizar catálogo com presets de fios comerciais (Algodão Tradicional, Fio Amigurumi, Chenille/Pelúcia, Lã/Acrílico e Fio de Malha) e opções de diâmetro (mm) e cor.
- **RF-08**: A renderização 3D deve permitir destacar visualmente a carreira e o ponto atualmente selecionados no modelo.

### 2.3. Conversão e Editor de Receitas (Pattern Hub)
- **RF-09**: O sistema deve converter automaticamente qualquer modelo 3D modelado ou importado em uma receita textual de crochê completa.
- **RF-10**: O sistema deve permitir ao usuário colar receitas em texto livre e interpretá-las (parser), reconstruindo a geometria 3D correspondente.
- **RF-11**: O sistema deve fornecer um editor estruturado carreira a carreira para ajuste manual de pontos, repetições (`[1 pb, 1 aum] x 6`) e cores.
- **RF-12**: O sistema deve emitir validações e contadores de pontos em tempo real em cada linha da receita.

### 2.4. Modo Crochetagem (Live Execution Tracker)
- **RF-13**: O sistema deve exibir uma tela de execução em tela cheia com a carreira ativa, o ponto atual em destaque e o total acumulado.
- **RF-14**: O sistema deve ditar em voz alta em português (Text-to-Speech) as instruções da carreira e do ponto ativo.
- **RF-15**: O sistema deve permitir controle por comandos de voz (ex: "Próximo", "Voltar", "Repetir") sem necessidade de usar as mãos.
- **RF-16**: O sistema deve oferecer botões grandes de toque/clique e atalhos de teclado (Barra de Espaço para avançar, Setas para navegar) com feedback sonoro suave (bip de confirmação).
- **RF-17**: O sistema deve exibir um mini-mapa 3D interativo sincronizado que destaca em cor contrastante exatamente onde o artesão está no modelo físico.

### 2.5. Tutoriais e Dicionário Integrado
- **RF-18**: O sistema deve conter uma biblioteca de pontos com ilustrações, fotos, vídeos/animações e explicações textuais detalhadas.
- **RF-19**: O sistema deve conter guia de correspondência de fios, agulhas e tabela de conversão de unidades (mm vs US/UK).
- **RF-20**: Cada ponto mencionado na receita dentro do Modo Crochetagem deve possuir um botão de ajuda rápida `?` que abre o tutorial do ponto sem sair da carreira.

### 2.6. Prateleira de Projetos & Compartilhamento Privado
- **RF-21**: A Prateleira de Projetos deve conter 3 sub-abas: `Meus Projetos`, `Compartilhados Comigo` e `Favoritos`.
- **RF-22**: Cada projeto na aba `Meus Projetos` deve exibir um seletor de visibilidade (`Público` / `Privado`).
- **RF-23**: O sistema deve fornecer um modal de compartilhamento para projetos privados, permitindo convidar por `@handle`, gerar link com chave de acesso revogável e definir o nível de permissão (`viewer` ou `editor`).
- **RF-24**: A aba `Compartilhados Comigo` deve listar todos os projetos privados concedidos por outros artesãos, indicando o autor original, o papel recebido e um botão de resgatar chave/token de convite.
- **RF-25**: O sistema deve exportar a receita em PDF com layout profissional de revista (capa com foto real do amigurumi, assinatura do designer, ficha técnica, abreviações, instruções por partes e checkboxes de acompanhamento `[ ]`).
- **RF-26**: O sistema deve permitir exportar e importar arquivos de backup `.crochet3d` preservando a autoria original do modelo.

### 2.7. Galeria Pública da Comunidade & Rede Social
- **RF-27**: O sistema deve fornecer uma aba principal `Comunidade` com feed de projetos públicos categorizados (Amigurumis, Roupas, Bolsas, Decoração).
- **RF-28**: A Galeria deve permitir filtrar por nível de dificuldade (Iniciante, Intermediário, Avançado) e ordenar por 'Mais Populares', 'Mais Recentes' e 'Em Alta'.
- **RF-29**: O usuário deve poder curtir/favoritar projetos públicos e salvá-los na sua sub-aba de `Favoritos`.
- **RF-30**: O sistema deve permitir ao usuário seguir outros artesãos (`Seguir`/`Deixar de Seguir`) e visualizar a contagem de seguidores/seguindo.
- **RF-31**: Cada projeto público deve exibir a seção "Feito pela Comunidade", onde artesãos podem postar fotos da peça física real tecida a partir daquela receita.
- **RF-32**: O sistema deve exibir o Perfil Público do Artesão ao clicar em seu nome/avatar, mostrando sua biografia, redes sociais e todos os seus projetos públicos.

### 2.8. Perfil do Artesão e Diário de Execução
- **RF-33**: O sistema deve permitir ao usuário cadastrar e editar seu Perfil de Artesão (Nome, @Handle único, Avatar, Biografia, Mão Dominante Destro/Canhoto, Nível e Redes Sociais).
- **RF-34**: O perfil do usuário deve assinar automaticamente como designer na criação de novos modelos e no PDF da receita.
- **RF-35**: O sistema deve manter um Diário de Execução (Maker Journal) para cada projeto, permitindo registrar datas de início e término, agulha e fio realmente utilizados, fotos da peça física real e anotações.
- **RF-36**: O sistema deve exibir um Painel de Conquistas e Estatísticas acumuladas no perfil (total de pontos tecidos, metros de fio consumidos e projetos finalizados).
- **RF-37**: O sistema deve permitir alternar entre múltiplos perfis de artesão no mesmo navegador.
- **RF-38**: O sistema deve oferecer arquitetura preparada para login opcional em nuvem (Google/Email via Supabase/Firebase) para sincronizar projetos entre dispositivos.

### 2.9. Experiência de Uso, Acessibilidade e Ferramentas Auxiliares
- **RF-39**: A barra de navegação principal deve apresentar a ordem de 4 abas `1. Comunidade`, `2. Prateleira`, `3. Criação` (com 3 sub-abas: `Studio 3D`, `Editor de Receitas` e `Modo Crochetagem`) e `4. Tutoriais`.
- **RF-40**: Cada ponto do dicionário e das carreiras deve possuir diagrama visual explicativo em SVG com suporte a inversão horizontal para artesãos canhotos (`scaleX(-1)`).
- **RF-41**: O Modo Crochetagem deve disponibilizar uma gaveta lateral retrátil (drawer) com a receita completa de todas as peças e carreiras do amigurumi, permitindo salto direto.
- **RF-42**: O clique sobre qualquer ponto abreviado em uma carreira ativa deve abrir imediatamente um modal flutuante com o tutorial e diagrama SVG do ponto.
- **RF-43**: O editor de receitas deve possuir tradutor automático bidirecional pt-BR $\leftrightarrow$ US com preservação de estrutura e contagens de pontos.
- **RF-44**: O exportador de PDF deve incorporar a fotografia da peça física pronta com proporção preservada na capa da receita impressa.

---

## 3. Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição |
| :--- | :--- | :--- |
| **RNF-01** | **Desempenho (Desktop)** | A taxa de quadros (framerate) do viewport 3D deve manter $\ge 60 \text{ FPS}$ em computadores desktop e notebooks com aceleração gráfica padrão. |
| **RNF-02** | **Desempenho (Mobile/Tablet)** | Em dispositivos móveis e tablets, a taxa de quadros deve se manter estável em $\ge 30 \text{ FPS}$, aplicando redução adaptativa de sombras e efeitos pós-processamento. |
| **RNF-03** | **Otimização de Geometria** | Malhas importadas do Blender com mais de 10.000 polígonos devem passar por decimação automática antes do fatiamento para evitar travamentos de memória. |
| **RNF-04** | **Acessibilidade Visual & Tema** | A interface deve possuir suporte nativo a Tema Escuro (Dark Mode) e Tema Claro (Light Mode), com tipografia de alto contraste e fontes grandes legíveis a mais de 50 cm de distância. |
| **RNF-05** | **Latência de Voz** | A resposta aos comandos de voz e a síntese de fala (TTS) deve ocorrer com latência inferior a $300 \text{ ms}$ para proporcionar ritmo fluido ao artesão. |
| **RNF-06** | **Segurança em Projetos Privados** | O acesso a projetos privados compartilhados via link/token deve validar a integridade da chave e os direitos do usuário sem expor dados restritos na galeria pública. |

---

## 4. Restrições de Projeto (RP)

- **RP-01**: **Modelo de Conectividade**: A aplicação é concebida como aplicação web tradicional (Online First) — requer conexão com a internet para carregamento inicial dos scripts, fontes e assets do Three.js, mantendo resiliência total de dados e cache local no IndexedDB após o carregamento.
- **RP-02**: **Microfone e Navegadores**: O reconhecimento de voz contínuo depende do suporte à Web Speech API (`webkitSpeechRecognition`), presente nativamente no Google Chrome, Edge e browsers baseados em Chromium; navegadores sem suporte devem apresentar fallback automático gracioso para atalhos de toque e teclado.
- **RP-03**: **Limite de Upload de Arquivos**: O tamanho máximo de arquivos 3D importados pelo usuário é restrito a 30 MB por arquivo para prevenir exaustão de memória na aba do navegador.
- **RP-04**: **Compatibilidade de Exportação**: O arquivo PDF gerado deve ser compatível com padrão PDF/A para garantir fidelidade visual em qualquer leitor de PDF e impressora comum.
