# Feature Specification: ERP Projetos Web Terra — MVP corporativo

**Feature Branch**: `feat/erp-projetos-terra-spec` (branch para revisão; sem merge na principal)

**Created**: 2026-10-13

**Status**: Rascunho para revisão de negócio — não aprovado para planejamento ou implementação.

**Input**: Especificar uma plataforma web corporativa de gestão de projetos internos, com visões estratégica, tática e operacional. O MVP cobre autenticação, acesso por perfil e contexto, usuários, departamentos, projetos, tarefas/subtarefas, responsáveis, prioridades, status, prazos, Kanban, indicadores básicos e histórico. Não implementar, criar banco de dados, definir tecnologia ou adotar regras ambíguas sem aprovação.

## User Scenarios & Testing *(mandatory)*

### Visão do produto e limites da primeira versão

Centralizar quem é responsável, o que precisa ser entregue, quando deve ser entregue e qual é a situação dos projetos internos. Oferecer uma fonte consistente para a operação diária e para decisões gerenciais, reduzindo a necessidade de consolidar manualmente informações dispersas.

| Nível | Objetivo | Evidência oferecida pelo MVP | Limite |
| --- | --- | --- | --- |
| Estratégico | Conhecer o portfólio autorizado, prioridades e situação das entregas | Quantidades por situação, projetos atrasados e progresso operacional | Não mede retorno financeiro, investimentos, riscos ou resultados estratégicos realizados |
| Tático/Gerencial | Acompanhar projetos, responsáveis e entregas | Projetos/tarefas por departamento, responsável, prazo e status | Não calcula capacidade, produtividade individual ou carga em horas |
| Operacional | Organizar o trabalho diário | Tarefas/subtarefas, responsáveis, prazos e Kanban | Não inclui apontamento de horas, dependências ou automações |

### Personas e objetivos

| Persona | Objetivos | Casos de uso principais |
| --- | --- | --- |
| Administrador do sistema | Manter identidades, perfis e estrutura organizacional | UC-01 autenticar; UC-02 administrar usuários/departamentos e concessões de acesso |
| Gestor executivo | Observar o portfólio autorizado e identificar atenção gerencial | UC-06 consultar indicadores e detalhar a população que os compõe |
| Gerente de projetos | Manter o projeto, organizar participantes e acompanhar entregas | UC-03 cadastrar/manter projeto; UC-04 organizar trabalho; UC-07 concluir projeto com regras explícitas |
| Líder de departamento | Acompanhar os projetos do seu contexto e a distribuição de responsáveis | UC-03, UC-04 e UC-06, nos limites concedidos |
| Colaborador | Saber o que lhe foi atribuído e atualizar a execução | UC-01, UC-04 e UC-05 movimentar trabalho no Kanban |

Os objetivos das personas não concedem permissões automaticamente. O perfil, o vínculo departamental, a participação no projeto e a ação solicitada devem ser avaliados em conjunto. A matriz em Q1 é uma proposta, não autorização aprovada.

### User Story 1 - Acessar somente informações autorizadas (Priority: P1)

Como usuário interno, quero autenticar-me e acessar apenas as operações e projetos permitidos, para trabalhar sem expor informações de outros contextos.

**Why this priority**: Controle de acesso é pré-requisito para qualquer uso corporativo.

**Independent Test**: Usar contas e projetos de referência para verificar autenticação, revogação e isolamento, sem exigir implementação de dashboard ou Kanban.

**Acceptance Scenarios**:

1. **Given** uma identidade ativa e acesso válido conforme Q1, **When** o usuário se autentica, **Then** recebe somente as opções e informações do seu contexto autorizado (FR-001, FR-002).
2. **Given** ausência de sessão válida, **When** alguém solicita dados ou operações protegidas, **Then** o acesso é negado sem revelar dados do projeto (FR-001).
3. **Given** um usuário sem permissão para o projeto B, **When** tenta acessá-lo diretamente ou alterar seus dados sem usar a interface, **Then** o servidor nega a solicitação e não altera nada (FR-002, FR-003).
4. **Given** um vínculo ou perfil revogado, **When** uma nova operação protegida é solicitada, **Then** a permissão revogada não é reutilizada, inclusive em sessão já aberta (FR-004).
5. **Given** uma sessão válida, **When** o usuário encerra a sessão, **Then** novas operações protegidas exigem autenticação (FR-001).

### User Story 2 - Administrar usuários e departamentos (Priority: P1)

Como administrador, quero manter usuários, departamentos e concessões de acesso, para refletir a estrutura e as responsabilidades da empresa.

**Why this priority**: Projetos e responsáveis dependem de cadastros consistentes.

**Independent Test**: Cadastrar e atualizar usuários/departamentos com contas de teste; verificar validações e histórico, sem depender de tarefas operacionais.

**Acceptance Scenarios**:

1. **Given** um administrador autorizado, **When** cadastra um departamento e associa um usuário ativo a ele, **Then** ambos ficam disponíveis para os usos permitidos, com identificação inequívoca (FR-005, FR-006).
2. **Given** um identificador de usuário já existente, **When** tenta criar outra identidade com o mesmo identificador, **Then** a duplicidade é rejeitada com explicação (FR-005).
3. **Given** um usuário sem privilégio administrativo, **When** tenta alterar perfis ou concessões, **Then** a alteração é negada também no servidor (FR-003, FR-007).
4. **Given** um responsável por trabalho aberto, **When** sua desativação é solicitada, **Then** a política aprovada de reassociação/revogação é aplicada e o histórico anterior é preservado (FR-008; regra proposta RB-11).

### User Story 3 - Cadastrar e conduzir um projeto (Priority: P1)

Como gerente autorizado, quero identificar o projeto, seu departamento, responsável principal, participantes, prioridade e prazo, para tornar seu acompanhamento possível.

**Why this priority**: O projeto é o contexto que organiza trabalho e acesso.

**Independent Test**: Manter um projeto com participantes de referência e verificar suas regras, sem depender de indicadores agregados.

**Acceptance Scenarios**:

1. **Given** os cadastros necessários, **When** o usuário autorizado fornece os campos obrigatórios aprovados, **Then** o projeto é criado e consultável somente pelos contextos permitidos (FR-009, FR-010).
2. **Given** ausência de responsável principal ou departamento válido, **When** solicita salvar o projeto, **Then** a operação é recusada sem registro parcial (FR-009).
3. **Given** um projeto existente, **When** um usuário autorizado muda responsável, participantes, prioridade, prazo ou status, **Then** os valores válidos são refletidos e a alteração importante fica rastreável (FR-010, FR-025).
4. **Given** a mesma consulta e os mesmos filtros, **When** dois usuários com contextos diferentes consultam projetos, **Then** cada um recebe somente a população autorizada para sua identidade (FR-011).

### User Story 4 - Organizar tarefas, subtarefas e responsáveis (Priority: P1)

Como gerente ou líder autorizado, quero dividir o projeto em trabalho rastreável e atribuir responsáveis, para explicitar entregas e compromissos.

**Why this priority**: É o núcleo da gestão operacional.

**Independent Test**: Em um projeto de referência, cadastrar uma tarefa e suas subtarefas, atribuir responsáveis e verificar validações e rastreabilidade.

**Acceptance Scenarios**:

1. **Given** um projeto editável, **When** cadastra uma tarefa com título, status, prioridade, prazo e responsável elegível, **Then** a tarefa pertence ao projeto e pode ser consultada por seus usuários autorizados (FR-012, FR-014).
2. **Given** uma tarefa existente, **When** cria uma subtarefa válida, **Then** o vínculo com a tarefa e o mesmo projeto é preservado, com responsável, status, prioridade e prazo próprios (FR-013).
3. **Given** responsável inativo ou sem elegibilidade para o projeto, **When** é atribuída uma tarefa, **Then** a atribuição é rejeitada sem ampliar seu acesso automaticamente (FR-014).
4. **Given** tentativa de vínculo circular ou entre projetos diferentes, **When** solicita salvar a hierarquia, **Then** a operação é rejeitada (FR-013).
5. **Given** responsável elegível e ação autorizada, **When** altera status, prazo, prioridade ou responsável, **Then** a alteração respeita Q2 e fica registrada no histórico (FR-015, FR-025).

### User Story 5 - Acompanhar execução no Kanban (Priority: P2)

Como colaborador ou gestor autorizado, quero visualizar o trabalho por status e movimentar os itens permitidos, para atualizar a execução sem perder consistência.

**Why this priority**: Facilita o uso diário após a base de acesso e trabalho estar disponível.

**Independent Test**: Usar tarefas previamente cadastradas para verificar colunas, transições e consistência com a visualização em tabela.

**Acceptance Scenarios**:

1. **Given** um projeto com tarefas de diferentes status, **When** abre seu Kanban, **Then** cada tarefa aparece uma única vez na coluna correspondente ao status vigente (FR-016).
2. **Given** uma transição autorizada e válida em Q2, **When** move um card, **Then** Kanban, tabela e detalhe refletem o mesmo status confirmado, e o histórico registra a mudança (FR-017, FR-025).
3. **Given** falta de permissão, transição inválida ou falha ao salvar, **When** tenta mover o card, **Then** o sistema informa a recusa e mantém ou restaura o estado confirmado, sem apresentar sucesso (FR-017, FR-026).
4. **Given** uso apenas por teclado ou tela estreita, **When** precisa atualizar um status, **Then** existe ação equivalente sem depender exclusivamente de arrastar e soltar (FR-027, NFR-002).

### User Story 6 - Consultar indicadores básicos confiáveis (Priority: P2)

Como executivo, gerente ou líder, quero consultar indicadores filtráveis com suas regras e população de origem, para identificar projetos que precisam de atenção.

**Why this priority**: A decisão gerencial depende de dados operacionais consistentes e autorizados.

**Independent Test**: Utilizar uma população de referência e conferir manualmente os indicadores e filtros aprovados em Q3.

**Acceptance Scenarios**:

1. **Given** projetos e tarefas de referência com resultados conhecidos, **When** consulta o dashboard, **Then** os totais coincidem com a população autorizada e as fórmulas documentadas, sem incluir módulos futuros (FR-020, FR-021).
2. **Given** um filtro de departamento, projeto, responsável, status, prioridade ou prazo, **When** o aplica, **Then** os indicadores aplicáveis e seus detalhamentos usam a mesma população e explicam os filtros ativos (FR-011, FR-022).
3. **Given** população vazia ou projeto sem unidades de trabalho, **When** consulta indicadores, **Then** vê zero nas contagens e “sem tarefas” no progresso sem denominador, não valores indefinidos (FR-020, RB-05 proposta).
4. **Given** uma alteração operacional confirmada, **When** atualiza a consulta, **Then** recebe os dados vigentes e a referência temporal usada no cálculo (FR-023).
5. **Given** projetos fora de seu contexto, **When** consulta um total ou detalhamento, **Then** esses projetos não aparecem nem influenciam o total (FR-002, FR-021).

### User Story 7 - Concluir projetos e consultar histórico (Priority: P2)

Como responsável autorizado, quero concluir um projeto somente quando as condições explícitas forem atendidas e entender mudanças importantes, para confiar na situação das entregas.

**Why this priority**: Evita conclusões arbitrárias e preserva responsabilidade.

**Independent Test**: Avaliar os exemplos de conclusão em Q2 e consultar eventos de um projeto de referência; não requer orçamento, aprovações ou relatórios avançados.

**Acceptance Scenarios**:

1. **Given** qualquer unidade de trabalho não concluída, **When** solicita concluir o projeto, **Then** a proposta RB-06 recusa a conclusão e lista o que falta, se essa regra for aprovada (FR-018).
2. **Given** trabalho elegível integralmente concluído e usuário autorizado, **When** solicita concluir o projeto, **Then** o sistema valida as condições no servidor, registra responsável/data da ação e muda a situação, sem workflow de aprovação separado (FR-018, FR-025).
3. **Given** um projeto concluído, **When** alguém tenta alterar trabalho que invalida a conclusão, **Then** aplica a regra de reabertura aprovada em Q2; nunca mantém silenciosamente uma conclusão inconsistente (FR-019).
4. **Given** mudança importante registrada, **When** usuário com direito a histórico consulta o evento, **Then** identifica autor, ação, objeto, instante e valores relevantes anteriores/novos, sem credenciais expostas (FR-024, FR-025).
5. **Given** usuário comum com acesso ao histórico, **When** tenta editar ou apagar um evento, **Then** a operação é negada (FR-024).

### Edge Cases

- Nenhum projeto acessível: mostrar estado vazio, sem dados de outro contexto.
- Projeto sem tarefas: progresso sem denominador não implica 100% nem conclusão automática; a regra final depende de Q2.
- Tarefa com subtarefas de prioridades/prazos distintos: destacar cada compromisso; não igualar silenciosamente seus campos.
- Responsável ou departamento desativado: impedir novas atribuições inválidas e preservar referências históricas; bloqueio/reassociação conforme RB-11 proposta.
- Prazo exatamente no limite do dia: atraso muda conforme fuso e limite aprovados em Q3, não conforme relógio local de cada usuário.
- Duas pessoas mudam o mesmo status: informar conflito ou atualização concorrente relevante; não ocultar perda de alteração (NFR-004).
- Queda de conexão durante movimentação: não confirmar alteração não persistida; nova consulta permite verificar o estado real.
- Mudança de prazo que remove classificação de atraso: recalcular o estado atual e manter o valor antigo no histórico, sem esconder a mudança.
- Remoção de participação após atribuição: não deixar responsabilidade operacional inválida; resolução conforme Q1/RB-11.
- Percentual arredondado para 100% com trabalho pendente: conclusão usa condições e valores exatos, nunca o percentual visual arredondado.
- Filtros conflitantes ou intervalo inválido: população vazia explicada ou erro de validação, sem exceção não tratada.

## Requirements *(mandatory)*

### Functional Requirements

Requisitos abaixo derivam do pedido. Valores detalhados marcados **proposta** são condicionais à revisão; não são regras aprovadas.

- **FR-001**: Exigir autenticação válida para acessar o sistema, permitir encerramento de sessão e negar acesso a identidade inativa; a jornada de entrada/recuperação será definida em Q1. Aceite: US1.1, US1.2 e US1.5.
- **FR-002**: Restringir informações e operações por perfil e contexto, inclusive contagens, buscas, detalhamentos, tarefas e histórico. Aceite: US1.1, US1.3, US3.4 e US6.5.
- **FR-003**: Validar permissões no backend em toda operação protegida; esconder controles na interface não basta. Aceite: US1.3 e US2.3.
- **FR-004**: Aplicar revogação de acesso na próxima operação protegida, sem permitir continuar com a autorização antiga. Aceite: US1.4.
- **FR-005**: Permitir ao administrador cadastrar, consultar, atualizar e desativar usuários, com identidade única e estado ativo/inativo. Aceite: US2.1, US2.2 e US2.4.
- **FR-006**: Permitir ao administrador manter departamentos e vínculos de usuários, evitando relações inválidas. Aceite: US2.1 e US2.4; cardinalidade proposta em RB-01.
- **FR-007**: Manter os cinco perfis informados e concessões contextuais conforme matriz aprovada, sem possibilitar autoelevação por usuário não autorizado. Aceite: US2.3 e US1.3.
- **FR-008**: Ao desativar cadastros ou retirar vínculos, aplicar tratamento explícito de responsabilidades abertas e preservar referências históricas. Aceite: US2.4; decisão RB-11/Q1.
- **FR-009**: Cadastrar projeto com identificação, departamento, responsável principal e campos gerenciais definidos em RB-02 proposta; rejeitar dados obrigatórios ausentes. Aceite: US3.1 e US3.2.
- **FR-010**: Manter participantes, responsável principal, prioridade, prazo e situação do projeto com validações e rastreabilidade. Aceite: US3.3.
- **FR-011**: Consultar projetos e trabalho em listas/detalhes com filtros de departamento, projeto, responsável, status, prioridade e intervalo de prazo, aplicáveis ao contexto visualizado. Aceite: US3.4 e US6.2.
- **FR-012**: Cadastrar e manter tarefas vinculadas a um projeto, com título, status, prioridade, prazo e responsável. Aceite: US4.1.
- **FR-013**: Cadastrar e manter subtarefas vinculadas a uma tarefa do mesmo projeto, impedir ciclos e respeitar a profundidade aprovada. Aceite: US4.2 e US4.4; proposta RB-03.
- **FR-014**: Atribuir responsáveis elegíveis conforme acesso, participação e situação do usuário, sem conceder acesso implicitamente. Aceite: US4.1 e US4.3.
- **FR-015**: Validar status, prioridades, prazos e transições segundo regras documentadas; não aceitar alteração inválida por outro canal. Aceite: US4.5 e US5.3.
- **FR-016**: Oferecer Kanban por status para tarefas do projeto; subtarefas devem ser identificáveis no contexto da tarefa, sem duplicar unidades nos indicadores. Aceite: US5.1; apresentação de subtarefas proposta em RB-03.
- **FR-017**: Atualizar status a partir de Kanban e ações equivalentes, mantendo consistência entre visualizações e explicando falhas. Aceite: US5.2 e US5.3.
- **FR-018**: Validar condições explícitas para conclusão de projeto, explicando recusas e registrando a conclusão autorizada. Aceite: US7.1 e US7.2; Q2.
- **FR-019**: Preservar coerência entre conclusão do projeto e trabalho interno mediante regra explícita de reabertura. Aceite: US7.3; Q2.
- **FR-020**: Exibir indicadores básicos e progresso conforme definições aprovadas, com tratamento de população vazia e sem incluir métricas de custos, riscos ou capacidade. Aceite: US6.1 e US6.3; Q2/Q3.
- **FR-021**: Calcular e detalhar indicadores apenas sobre informações autorizadas; cada total deve ser reconciliável com sua população. Aceite: US6.1 e US6.5.
- **FR-022**: Explicitar filtros ativos e distinguir se o indicador conta projetos, tarefas ou unidades de trabalho; não misturar entidades no mesmo total. Aceite: US6.2; Q3.
- **FR-023**: Identificar a referência temporal dos indicadores e refletir mudanças confirmadas após atualização da consulta. Aceite: US6.4.
- **FR-024**: Disponibilizar histórico importante somente a usuários autorizados, em ordem temporal, sem edição/exclusão por usuários comuns. Aceite: US7.4 e US7.5.
- **FR-025**: Registrar criação, mudanças de perfil/vínculo, participantes, responsável, status, prioridade, prazo, conclusão/reabertura e desativação, quando essas ações existirem no fluxo aprovado. Eventos incluem autor, instante, entidade, ação e valores anteriores/novos pertinentes; nunca senhas ou tokens. Aceite: US2.4, US3.3, US4.5, US5.2 e US7.2/4.
- **FR-026**: Validar campos obrigatórios, relações e valores; informar erros de maneira acionável, sem salvar parcialmente uma operação recusada. Aceite: US3.2, US4.3/4 e US5.3.
- **FR-027**: Oferecer navegação por menu lateral, dashboard inicial, filtros, tabelas, cards e Kanban, com apresentação adaptada ao perfil e à largura da tela. Aceite: US1.1, US5.4 e US6.2; NFR-002.

### Non-Functional Requirements

| ID | Requisito e evidência verificável | Situação |
| --- | --- | --- |
| NFR-001 | Nenhuma ação negada deve revelar conteúdo protegido ou alterar dados; testar todos os pares ação/contexto da matriz, inclusive acesso direto | Obrigatório, derivado das restrições de acesso |
| NFR-002 | Fluxos principais devem funcionar por teclado, com foco visível, campos identificados e status distinguível sem depender só de cor; testar larguras de 360, 768 e 1280 pixels, admitindo rolagem horizontal em tabelas | Proposta de critérios de responsividade/acessibilidade; aprovar metas em Q3 |
| NFR-003 | Em população piloto acordada, 95% das consultas a listas/dashboard devem apresentar resultado utilizável em até 3 segundos; estado de espera/falha deve ser percebido pelo usuário | Meta proposta, condicionada a volume, concorrência e condições de teste aprovados |
| NFR-004 | Alterações confirmadas devem permanecer recuperáveis; mudanças concorrentes conflitantes não podem ser descartadas silenciosamente; validar concorrência sobre o mesmo item | Obrigatório de consistência; estratégia técnica fora desta etapa |
| NFR-005 | Eventos importantes devem manter autor, referência temporal e conteúdo histórico legível após atualização/desativação dos cadastros; validar a sequência antes/depois | Obrigatório; prazo de retenção e acesso administrativo pendentes em Q3 |
| NFR-006 | Falhas devem explicar a ação possível ao usuário sem expor credenciais ou informações internas sensíveis; validar erro, recusa de acesso e conexão interrompida | Obrigatório de segurança/usabilidade |
| NFR-007 | Datas, prazos e histórico devem ter interpretação consistente entre usuários; validar limites de dia e apresentação da referência temporal | Obrigatório; fuso corporativo pendente em Q3 |

Disponibilidade, recuperação de dados, volume máximo e retenção precisam de metas do responsável de negócio/operação antes do planejamento. Não foi presumido SLA, conformidade regulatória específica ou escala de implantação.

### Regras de negócio e registro de aprovação

**Confirmado pelo pedido**: departamento pode ter vários projetos; projeto tem responsável principal e participantes; projeto pode ter várias tarefas; tarefa tem status, prioridade, prazo e responsável; conclusão/progresso/atraso/indicadores têm regras explícitas; operações sensíveis têm rastreabilidade; autorização é validada no backend.

| Regra | Proposta para revisão, sem aprovação implícita | Impacto e responsável pela decisão |
| --- | --- | --- |
| RB-01 | Cada projeto tem um departamento proprietário; participação de outros departamentos é permitida por usuário. Cada usuário tem um departamento principal no MVP | Q1; responsável de negócio e administração organizacional; confirmar necessidade de múltiplos vínculos |
| RB-02 | Projeto exige nome, departamento, responsável principal, prioridade e data-limite; descrição é opcional. Um responsável principal ativo é obrigatório e também integra os participantes. Tarefa/subtarefa exige título, responsável ativo, status, prioridade e prazo | Q2; responsável de negócio; confirmar se projeto em planejamento pode existir sem prazo |
| RB-03 | Hierarquia limitada a tarefa → subtarefa, sem níveis adicionais; subtarefas aparecem dentro da tarefa no Kanban, com status alterável por ação própria | Q2; responsável de negócio; evita hierarquia não delimitada |
| RB-04 | Tarefas/subtarefas: A fazer, Em andamento e Concluída. Projetos: Planejado, Em andamento e Concluído. Prioridades: Baixa, Média e Alta. Tarefas permitem ida/volta entre estados autorizados; o projeto passa de Planejado a Em andamento por ação do responsável | Q2; responsável de negócio; outros status não foram adicionados ao MVP |
| RB-05 | Progresso usa unidades-folha: tarefa sem subtarefas ou cada subtarefa, sem contar também a tarefa-pai. Fórmula P = 100 × folhas concluídas / total de folhas, com pesos iguais. Sem folhas, mostrar “sem tarefas”. Exibir uma casa decimal; conclusão nunca usa o valor arredondado | Q2; responsável de negócio; pesos por horas/esforço não integram a proposta do MVP |
| RB-06 | Tarefa com subtarefas só pode ser concluída quando todas estiverem concluídas. Projeto só pode ser concluído por ação explícita do responsável principal ou substituto autorizado, com pelo menos uma folha e todas as folhas e tarefas-pai concluídas. P = 100% não conclui automaticamente o projeto | Q2; responsável de negócio; não cria módulo de aprovações |
| RB-07 | Projeto concluído bloqueia mudança de trabalho, responsáveis, participantes, prazo e prioridade até reabertura explícita autorizada e registrada; se uma subtarefa de tarefa concluída for reaberta, a tarefa-pai volta a Em andamento na mesma operação | Q2; responsável de negócio; exceções e atores precisam ser ratificados |
| RB-08 | Cada compromisso tem seu próprio prazo; atraso não é um status manual. Projeto atrasado = projeto não concluído cujo prazo terminou; tarefa/subtarefa atrasada = item não concluído cujo prazo terminou. Um projeto com tarefa atrasada e prazo próprio vigente aparece como “com trabalho atrasado”, não como projeto atrasado | Q3; responsável de negócio; distinguir risco operacional de atraso do projeto |
| RB-09 | Prazo é uma data de calendário, válida até o fim desse dia no fuso corporativo; fica atrasado no dia seguinte. Tarefas podem ultrapassar o prazo do projeto somente após regra explícita de aceitação/rejeição — nenhuma escolhida aqui | Q3; responsável de negócio; confirmar fuso, dias corridos e relação de prazos |
| RB-10 | Contagens de dashboard usam projetos únicos e folhas únicas em blocos separados; progresso é por projeto, sem média global não solicitada. Filtros por trabalho restringem contagens de trabalho, mas não redefinem o progresso integral do projeto | Q3; responsável de negócio; aprovação da semântica dos filtros |
| RB-11 | Desativação não apaga referências; bloquear desativação/remoção de vínculo que deixe projeto ou trabalho aberto sem responsável elegível, até reassociação. Desativar departamento exige tratar projetos abertos e novas atribuições | Q1; responsável de negócio e administrador; confirmar bloqueio versus transferência |
| RB-12 | O MVP não oferece exclusão definitiva de projetos/trabalho com histórico. Correção e desativação/reabertura são rastreáveis; cancelamento/arquivamento não são acrescentados sem decisão de escopo | Q2/Q3; responsável de negócio e política de retenção; confirmar tratamento de cadastro indevido |

### Dúvidas prioritárias para revisão

#### Q1 — Identidade, permissões e elegibilidade

[NEEDS CLARIFICATION: Qual é a jornada de autenticação/recuperação e qual matriz de acesso por perfil, departamento e participação será aprovada, incluindo elegibilidade de responsáveis e tratamento de revogação/desativação?]

Proposta de matriz mínima (todas as concessões dependem do contexto; acumulação de perfis não é presumida):

| Perfil | Usuários/departamentos/perfis | Leitura de projetos e indicadores | Manter projeto/participantes | Manter tarefas | Atualizar execução | Concluir/reabrir | Histórico |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Administrador | Administrar | Somente se tiver contexto de negócio concedido | Sem privilégio de negócio automático | Sem privilégio automático | Sem privilégio automático | Sem privilégio automático | Cadastros administrados; projeto conforme contexto |
| Executivo | Não | Portfólio dos departamentos expressamente concedidos | Não | Não | Não | Não | Dos projetos autorizados |
| Gerente | Não | Projetos sob sua responsabilidade ou participação autorizada | Criar no contexto concedido; editar os de sua responsabilidade | Nos projetos que gerencia | Nos projetos que gerencia | Dos projetos que gerencia | Dos projetos autorizados |
| Líder | Não | Projetos do departamento concedido | Criar no departamento; editar apenas quando responsável principal | Apenas quando responsável principal; ampliar depende de aprovação | Conforme participação atribuída | Apenas quando responsável principal | Do contexto autorizado |
| Colaborador | Não | Projetos em que participa | Não | Não criar/replanejar | Status das tarefas/subtarefas de sua responsabilidade | Não | Alterações do trabalho acessível; alcance a confirmar |

| Opção | Alternativa de revisão | Implicações |
| --- | --- | --- |
| A | Aprovar a matriz proposta e informar jornada de entrada, recuperação e regras de elegibilidade | Acesso limitado por contexto; administrador sem leitura irrestrita automática |
| B | Ampliar atuação dos líderes/colaboradores ou acesso administrativo, enumerando ações e contextos | Requer revisar cenários de isolamento e operações sensíveis |
| C | Fornecer matriz corporativa e política de identidade próprias | Substitui a proposta e explicita vínculos/acumulação de perfis |

#### Q2 — Ciclo de vida, progresso e conclusão

[NEEDS CLARIFICATION: As propostas RB-02 a RB-07 e RB-12 são aprovadas, ou quais campos, estados, profundidade, fórmula de progresso, condições de conclusão e reabertura devem substituí-las?]

Exemplo da proposta: uma tarefa independente concluída e uma tarefa-pai com três subtarefas (duas concluídas e uma aberta) produzem quatro folhas, três concluídas: **75,0%**. A tarefa-pai não conta novamente. Projeto sem trabalho não pode concluir. Após a última subtarefa, ainda é preciso concluir a tarefa-pai e solicitar conclusão do projeto. Adicionar nova folha aberta reduz o progresso e gera histórico.

| Opção | Alternativa de revisão | Implicações |
| --- | --- | --- |
| A | Aprovar contagem de folhas com pesos iguais, fechamento explícito e reabertura controlada, revisando campos/estados | Fórmula verificável sem horas, custos ou workflow de aprovação |
| B | Contar apenas tarefas principais e derivar seu progresso das subtarefas | Exige definir agregação e arredondamento; exemplo de 75% deixa de valer |
| C | Fornecer fórmula e ciclo corporativos próprios | Requer exemplos para projeto vazio, tarefas sem subtarefas, reabertura e novos itens |

#### Q3 — Atraso, indicadores e políticas mensuráveis

[NEEDS CLARIFICATION: Quais critérios de prazo/fuso, indicadores e filtros de RB-08 a RB-10, e quais metas de desempenho/volume, disponibilidade, recuperação e retenção do histórico serão aprovados para o MVP?]

Proposta de indicadores básicos:

| Indicador | Definição proposta | Exemplo verificável |
| --- | --- | --- |
| Projetos por situação | Contar projetos únicos autorizados por Planejado, Em andamento e Concluído | 2 planejados + 3 em andamento + 1 concluído = 6 projetos |
| Projetos atrasados | Contar somente projetos não concluídos com data-limite anterior à data corporativa vigente | Projeto concluído com prazo passado não entra; data de hoje não entra |
| Progresso por projeto | RB-05, calculado sobre todo trabalho autorizado do projeto; não recalcular por filtro de responsável | Exemplo de Q2 permanece 75% após filtro de uma pessoa |
| Trabalho por status e atrasado | Contar folhas únicas, distinguindo tarefas independentes de subtarefas; folha concluída não é atraso vigente | Uma tarefa-pai com 3 subtarefas contribui com 3, não 4 |
| Projetos com trabalho atrasado | Contar projetos distintos com ao menos uma folha atrasada | Duas folhas atrasadas no mesmo projeto contam um projeto |

Proposta temporal: com data corporativa 13/10/2026, item aberto com prazo 12/10/2026 está atrasado; prazo 13/10/2026 ainda não; prazo 12/10/2026 concluído não é atraso vigente. Medir cumprimento histórico ou dias de atraso acumulados não foi incluído.

| Opção | Alternativa de revisão | Implicações |
| --- | --- | --- |
| A | Aprovar atraso pelo prazo próprio e os cinco indicadores propostos; informar fuso e metas operacionais | Mantém atraso de projeto distinto de trabalho atrasado |
| B | Considerar projeto atrasado sempre que qualquer trabalho estiver atrasado | Muda a leitura executiva e requer renomear/recalcular indicadores |
| C | Fornecer definições corporativas próprias e política de retenção/serviço | Exige fórmula, população, filtros, limites de dia e metas de teste para cada indicador |

As opções não consolidam decisões independentes: o revisor pode aprovar ou alterar cada regra separadamente. O prazo de retenção, o fuso, as permissões e a fórmula **não foram aprovados**. Revisar este rascunho é necessário antes de planejar; nenhuma opção será aplicada pelo silêncio.

### Key Entities *(include if feature involves data)*

- **Usuário**: identidade corporativa, nome, estado ativo/inativo, perfil(is) conforme aprovação e vínculo departamental. Não se presume múltiplo perfil ou múltiplo departamento.
- **Perfil e concessão contextual**: conjunto de ações permitido, associado a escopo de departamento/projeto; determina leitura e alteração, não apenas menus.
- **Departamento**: unidade organizacional identificada e com situação de uso; pode possuir vários projetos.
- **Projeto**: identificação, descrição, departamento proprietário proposto, responsável principal, participantes, prioridade, situação e prazo; progresso derivado, não informado manualmente.
- **Participação no projeto**: vínculo entre usuário e projeto para leitura/execução conforme matriz; não implica acesso a outros projetos do departamento.
- **Tarefa**: trabalho vinculado a um projeto, com identificação, status, prioridade, prazo e responsável; pode possuir subtarefas.
- **Subtarefa**: trabalho subordinado a uma tarefa no mesmo projeto, com seus próprios compromissos; profundidade proposta de um nível.
- **Evento de histórico**: evidência de ação importante, autoria, instante, entidade e mudança pertinente; preserva contexto anterior sem expor credenciais.

São conceitos de negócio, não esquema de banco de dados ou escolha de armazenamento.

### Delimitação de MVP e versões futuras

| Módulo previsto | Nesta especificação de MVP | Fora do MVP, sem requisitos de implementação |
| --- | --- | --- |
| Dashboard executivo | Indicadores básicos, filtros e população explicável | Investimentos, retorno, riscos e análises de portfólio avançadas |
| Projetos | Cadastro, responsável, participantes, prioridades, status e prazo | Priorização estratégica avançada e gestão de programas |
| Tarefas/subtarefas | Trabalho, responsáveis, prazos e hierarquia delimitada | Dependências, recorrência, horas e automações |
| Kanban | Visualização e atualização de status autorizado | Limites de trabalho em progresso e regras automáticas |
| Cronograma e marcos | Somente datas de prazo em projeto e trabalho | Cronograma visual, Gantt e marcos |
| Equipes/departamentos | Usuários, departamentos e participação no projeto | Capacidade em horas e planejamento de alocação |
| Riscos/impedimentos/problemas | Nenhuma gestão dedicada | Cadastros, avaliação e tratamento de riscos/problemas |
| Custos/orçamento | Nenhuma função ou indicador financeiro | Orçamento, custos realizados, investimentos e resultados financeiros |
| Relatórios/histórico/auditoria | Histórico das alterações importantes e consultas básicas | Exportações, relatórios avançados e análise de auditoria especializada |
| Notificações/aprovações | Mensagens de retorno das operações; conclusão conforme regra | Alertas proativos, notificações e workflow de aprovações |

Também não estão incluídos anexos, comentários, chat, aplicativo nativo, trabalho offline, integrações externas de negócio ou gestão de múltiplas empresas. A escolha da jornada de autenticação em Q1 não autoriza módulos adicionais.

## Success Criteria *(mandatory)*

### Measurable Outcomes

Os critérios de correção abaixo são obrigatórios; metas de usabilidade/desempenho são **propostas para aprovação**, não resultados já atingidos. Nenhum teste de aplicação foi executado nesta etapa documental.

- **SC-001 — Segurança**: 100% dos casos aprovados de ação/contexto devem respeitar a matriz; nenhuma ação negada deve retornar dados protegidos ou modificar estado, incluindo acesso direto, contagens e revogação (US1/2/6).
- **SC-002 — Integridade operacional**: 100% dos cenários de cadastro, atribuição, hierarquia e atualização definidos em US3/4/5 devem manter relações válidas e o mesmo estado em detalhe, tabela e Kanban após confirmação.
- **SC-003 — Indicadores**: 100% dos resultados de uma população de referência revisada devem coincidir com as fórmulas aprovadas, inclusive filtros, população vazia, limite do dia e tarefa-pai com subtarefas (US6, Q2/Q3).
- **SC-004 — Conclusão**: Todos os casos de conclusão/reabertura aprovados devem aceitar ou recusar a ação corretamente; percentual visual de 100% não deve liberar conclusão com condições pendentes (US7, Q2).
- **SC-005 — Rastreabilidade**: 100% das alterações importantes enumeradas em FR-025 devem produzir histórico consultável com autoria e valores pertinentes, inclusive mudanças que removam a indicação de atraso; não registrar credenciais.
- **SC-006 — Usabilidade, meta proposta**: Pelo menos 9 de 10 participantes representativos conseguem localizar seu trabalho, consultar o prazo e atualizar um status autorizado em até 2 minutos, após orientação inicial de até 5 minutos, sem ajuda durante a execução.
- **SC-007 — Desempenho, meta proposta**: Em volume/concorrência e condições de rede aprovados em Q3, ao menos 95% das consultas de listas/dashboard entregam resultado utilizável em até 3 segundos.
- **SC-008 — Responsividade, meta proposta**: Fluxos de autenticação, consulta de projeto e atualização de tarefa completáveis nas três larguras de NFR-002 e com teclado; nenhuma ação essencial depende exclusivamente de arrastar ou distinguir cores.

## Assumptions

- O produto é para projetos internos de uma empresa; múltiplas empresas, usuários externos e integrações de negócio não foram solicitados.
- O usuário forneceu o escopo do MVP e os cinco perfis; seus direitos específicos não foram definidos. O acesso deve permanecer pendente de revisão, não inferido a partir do nome do perfil.
- A conexão é necessária para confirmar operações. Não há modo offline neste MVP.
- Interface e documentação de negócio são propostas em português, conforme a solicitação; calendário corporativo, fuso e eventuais outros idiomas precisam de confirmação.
- Campos, cardinalidades, status, prioridades, fórmula, regras de atraso, reabertura e metas adicionais estão explicitamente propostos; não constituem política aprovada.
- O nome do produto nesta especificação é ERP Projetos Web Terra. Não se alterou o nome do repositório nem se criou branding ou aplicação.
- A constituição em `.specify/memory/constitution.md` permanece um template não ratificado; não se extraíram princípios obrigatórios de seus placeholders. A definição/ratificação pode ocorrer em revisão separada, sem invalidar o registro dos requisitos fornecidos aqui.
- Dependências de negócio: responsável habilitado a aprovar Q1–Q3; política de identidade e acesso; estrutura de departamentos; exemplos de projetos/trabalho; definição do fuso, volume piloto, retenção e metas operacionais.
- Não há tecnologia, fornecedor de identidade, modelo físico de dados ou infraestrutura escolhidos. A expressão “validação no backend” preserva uma restrição explícita do usuário, não escolhe uma implementação.
- Esta entrega encerra a etapa de especificação. Não autoriza execução de `$speckit-plan`, `$speckit-tasks` ou `$speckit-implement` nem criação de serviços/banco. A próxima ação é revisão do rascunho e resposta às decisões pendentes.
