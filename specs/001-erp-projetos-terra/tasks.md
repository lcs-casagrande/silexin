# Tasks: ERP Projetos Web Terra — demonstração e MVP transacional

**Input**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [API](contracts/api.md) e [quickstart.md](quickstart.md).

**Aprovação**: [approvals.md](approvals.md). O usuário autorizou publicar **demonstração estática** no GitHub Pages. Essa é a entrega atual, não o backend inteiro. Tarefas do MVP transacional permanecem abertas; marcação de protótipo concluído não prova segurança, persistência ou auditoria corporativa.

**Formato**: `[ID] [P?] [US?] descrição com caminho`. Testes são necessários conforme plano aprovado (Pytest/Playwright). Escrever testes significativos antes da respectiva implementação; não usar SQLite para comprovar locks/constraints PostgreSQL. [P] permite execução independente em arquivos distintos, sem autorizar delegação automática.

## Phase 1: Setup e demonstração autorizada

**Objetivo**: uma demonstração pública, responsiva, com somente dados fictícios, separada da segurança/persistência futuras.

- [x] T001 Registrar aprovação e limite de publicação estática em `specs/001-erp-projetos-terra/approvals.md`.
- [x] T002 Criar frontend React/TypeScript/Vite com lockfile e exclusões de segredos/build em `frontend/package.json`, `frontend/tsconfig.json`, `frontend/vite.config.ts` e `.gitignore`.
- [x] T003 Criar dados fictícios e estado local separado da API futura em `frontend/src/demo/data.ts`; progresso por folhas, estado vazio e sem credenciais.
- [x] T004 Criar interface demonstrativa com dashboard, projetos, tarefas/subtarefas, Kanban, pessoas/departamentos e histórico em `frontend/src/App.tsx` e `frontend/src/styles.css`; personas são simulação, sem login real.
- [x] T005 Validar fluxos demonstrativos e tela de 360px em `frontend/tests/demo.spec.ts`, build/typecheck e dependências; registrar resultados em `docs/github-pages-demo.md`.
- [x] T006 Publicar somente build estático em branch `gh-pages`, configurar Pages e verificar URL/versão de release; documentar em `docs/github-pages-demo.md`.

**Checkpoint**: link público da demonstração, com distinção visível do ERP transacional; backend e banco não são necessários para este milestone.

## Phase 2: Foundational — MVP transacional futuro

**Bloqueio de negócio/operação**: D-01–D-07 devem receber definições concretas antes das tarefas dependentes, não defaults presumidos. Hospedagem do backend/PostgreSQL é distinta de Pages.

- [ ] T007 Registrar identidade/provisionamento, fuso, prazo além do projeto, alcance de histórico, retenção e metas D-01–D-07 em `specs/001-erp-projetos-terra/approvals.md` e atualizar documentos derivados sem apagar decisões anteriores.
- [ ] T008 Preparar projeto Python 3.12/FastAPI/SQLAlchemy/Alembic/Psycopg com lockfile em `backend/pyproject.toml` e `backend/uv.lock`.
- [ ] T009 [P] Criar configuração tipada em `backend/src/erp/core/config.py` e `.env.example` só com nomes/placeholders; falhar se faltar fuso/configuração obrigatória.
- [ ] T010 Criar composição API, sessão por requisição, erros/correlação sanitizados em `backend/src/erp/main.py`, `backend/src/erp/core/database.py` e `backend/src/erp/core/errors.py`.
- [ ] T011 Implementar transação e protocolo usuários→departamentos→projetos→tarefas em `backend/src/erp/core/transactions.py`, ordenando IDs e garantindo rollback completo.
- [ ] T012 Criar histórico append-only runtime e inserção na transação em `backend/src/erp/modules/audit/persistence/models.py` e `backend/src/erp/modules/audit/application/events.py`, sem senhas/cookies/tokens em diff.
- [ ] T013 Preparar Alembic e esquema inicial com UUID, `DATE`, `TIMESTAMPTZ`, versões inteiras ≥1 e constraints nomeadas em `backend/migrations/` e `backend/alembic.ini`.
- [ ] T014 [P] Criar PostgreSQL descartável, fixtures sintéticas e isolamento por teste em `backend/tests/conftest.py`, `ops/compose.dev.yml` e `backend/src/erp/dev_seed.py`; seed bloqueado em produção.

## Phase 3: US1 — Acessar somente informações autorizadas (P1)

**Teste independente**: contas/contextos sintéticos, requests diretos, expiração, CSRF e revogação com cookie antigo.

- [ ] T015 [P] [US1] Escrever testes da matriz/permissões em `backend/tests/unit/test_access_policy.py` para cinco perfis, contexto e acesso administrativo sem leitura global automática.
- [ ] T016 [P] [US1] Escrever testes de sessão/CSRF/Origin/revogação em `backend/tests/integration/test_identity.py`; 401/403/404 sem leak nem alterações.
- [ ] T017 [US1] Implementar modelo de sessão, hash do token opaco, CSRF sincronizado e revogação em `backend/src/erp/modules/identity/persistence/models.py` conforme identidade definida em T007.
- [ ] T018 [US1] Implementar autorização atual por ação/perfil/contexto em `backend/src/erp/modules/identity/domain/policies.py` e filtro de escopo antes de contagem/paginação.
- [ ] T019 [US1] Implementar jornada de identidade escolhida, me/logout/CSRF em `backend/src/erp/modules/identity/api/router.py`; não criar login local e SSO simultaneamente sem requisito.
- [ ] T020 [US1] Substituir persona demonstrativa por sessão real e cliente protegido em `frontend/src/features/identity/`, `frontend/src/shared/api.ts` e `tests/e2e/identity.spec.ts`; nenhuma credencial em localStorage.

## Phase 4: US2 — Usuários e departamentos (P1)

**Teste independente**: administrador mantém cadastros; não-admin não eleva privilégios; desativação preserva referências e não deixa responsáveis inválidos.

- [ ] T021 [P] [US2] Escrever contrato e testes de cadastros/escopos/desativação em `backend/tests/contract/test_organization.py` e `backend/tests/integration/test_organization.py`.
- [ ] T022 [US2] Criar usuários/departamentos/escopos em `backend/src/erp/modules/organization/persistence/models.py`: identificador normalizado único, departamento principal FK, perfil único entre os cinco códigos aprovados.
- [ ] T023 [US2] Implementar cadastro, concessões, bloqueio de responsabilidade e revogação em `backend/src/erp/modules/organization/application/service.py`; domínio valida ativos, versão e efeito nos projetos.
- [ ] T024 [US2] Implementar `/users`, `/departments` e concessões/seletor contextual em `backend/src/erp/modules/organization/api/router.py` e contratos de 120/254 caracteres conforme `contracts/api.md`.
- [ ] T025 [US2] Conectar interface real de organização e validar jornada em `frontend/src/features/organization/` e `tests/e2e/organization.spec.ts`.

## Phase 5: US3 — Cadastrar e conduzir projetos (P1)

**Teste independente**: projeto com owner/participantes/contexto; campos obrigatórios, versão e histórico; outro contexto nunca revela o recurso.

- [ ] T026 [P] [US3] Escrever testes de projeto/participantes/acesso em `backend/tests/contract/test_projects.py` e `backend/tests/integration/test_projects.py`.
- [ ] T027 [US3] Criar projects/members em `backend/src/erp/modules/projects/persistence/models.py`: status planned/in_progress/completed, prioridade low/medium/high, prazo obrigatório DATE, owner ativo e membro; sem transferência departamental implícita.
- [ ] T028 [US3] Implementar casos de uso/versionamento/elegibilidade em `backend/src/erp/modules/projects/application/service.py`, confirmando owner/membership/audit juntos e sem exclusão histórica.
- [ ] T029 [US3] Implementar consultas/edição/participantes e seletores elegíveis em `backend/src/erp/modules/projects/api/router.py`; name 1–200, description até 4.000, versão obrigatória e 409 em conflito.
- [ ] T030 [US3] Conectar frontend de projetos/contextos e testar navegação/cadastro em `frontend/src/features/projects/` e `tests/e2e/projects.spec.ts`.

## Phase 6: US4 — Tarefas, subtarefas e responsáveis (P1)

**Teste independente**: hierarquia de um nível no mesmo projeto, participantes ativos, sem ciclos nem efeito parcial.

- [ ] T031 [P] [US4] Escrever testes PostgreSQL de hierarquia/atribuição/concorrência em `backend/tests/integration/test_work.py` e contrato em `backend/tests/contract/test_work.py`.
- [ ] T032 [US4] Criar Task em `backend/src/erp/modules/work/persistence/models.py`: title 1–200, status todo/in_progress/done, prazo obrigatório, FK composta `(parent_task_id, project_id)` e `(project_id, assignee_user_id)` conforme modelo.
- [ ] T033 [US4] Implementar criação/edição/status/elegibilidade/profundidade em `backend/src/erp/modules/work/application/service.py`; shared lock de responsáveis e lock de projeto antes de alterar tarefas, versões e audit.
- [ ] T034 [US4] Implementar `/tasks` e seletores de responsáveis em `backend/src/erp/modules/work/api/router.py` conforme payloads/versionamento; não conceder acesso automaticamente ao atribuir tarefa.
- [ ] T035 [US4] Conectar formulários de tarefas/subtarefas e verificar erros/contextos em `frontend/src/features/work/` e `tests/e2e/work.spec.ts`.

## Phase 7: US5 — Kanban (P2)

**Teste independente**: tarefa uma vez na coluna, subitens no contexto, operação por teclado, rollback visual em erro/conflito.

- [ ] T036 [P] [US5] Escrever contrato de colunas/paginação e mudanças de status em `backend/tests/contract/test_kanban.py` e jornada em `tests/e2e/kanban.spec.ts`.
- [ ] T037 [US5] Implementar query autorizada/paginada de Kanban em `backend/src/erp/modules/work/application/kanban.py` e rota em `backend/src/erp/modules/work/api/router.py`.
- [ ] T038 [US5] Conectar Kanban ao servidor e ação equivalente por teclado em `frontend/src/features/work/Kanban.tsx`; sucesso depende do commit, conflito relê estado, sem replay automático cego.

## Phase 8: US6 — Indicadores básicos (P2)

**Teste independente**: reconciliar dataset conhecido (3/4 = 75%), vazio, filtros separados, limite do dia/fuso e escopo nos totais.

- [ ] T039 [P] [US6] Escrever regras de folhas/atraso/filtros e isolamento em `backend/tests/unit/test_indicators.py` e `backend/tests/integration/test_reporting.py`.
- [ ] T040 [US6] Implementar agregados autorizados/snapshot e progresso derivado em `backend/src/erp/modules/reporting/application/queries.py`; denominator zero → percentage null; prazo aberto anterior ao corporate_today é atraso.
- [ ] T041 [US6] Implementar dashboard com filtros projeto/trabalho separados, unidade explícita, as_of/timezone e paginação de detalhamento em `backend/src/erp/modules/reporting/api/router.py`.
- [ ] T042 [US6] Conectar indicadores reais e invalidar queries após mudanças em `frontend/src/features/dashboard/` e `tests/e2e/dashboard.spec.ts`; não mostrar métricas de custos/riscos/capacidade.

## Phase 9: US7 — Conclusão e histórico (P2)

**Teste independente**: projeto não conclui vazio/incompleto; conclusão/reabertura/novo trabalho competem pelo lock; audit confirmado junto e sem edição pública.

- [ ] T043 [P] [US7] Escrever corridas conclusão versus tarefa e reabertura versus subtarefa em `backend/tests/integration/test_project_completion.py` usando duas conexões PostgreSQL reais.
- [ ] T044 [P] [US7] Escrever teste de rollback ao falhar histórico e privilégios runtime em `backend/tests/integration/test_audit.py`; não rodar essa prova como superusuário.
- [ ] T045 [US7] Implementar complete/reopen e efeito atômico no pai em `backend/src/erp/modules/projects/application/completion.py` e `backend/src/erp/modules/work/application/service.py`; não usar percentual arredondado para conclusão.
- [ ] T046 [US7] Implementar queries de histórico por contexto/campo autorizado em `backend/src/erp/modules/audit/application/queries.py` e `backend/src/erp/modules/audit/api/router.py`.
- [ ] T047 [US7] Conectar fechamento/histórico e testar eventos relevantes em `frontend/src/features/history/`, `frontend/src/features/projects/` e `tests/e2e/history.spec.ts`.

## Phase 10: Polish, integração e implantação transacional

- [ ] T048 [P] Verificar 360/768/1280 pixels, foco/teclado e estados acessíveis em `tests/e2e/accessibility.spec.ts` e `frontend/src/shared/`.
- [ ] T049 Validar schema vazio/upgrade da versão anterior com dados sintéticos e revisar migrações em `backend/tests/integration/test_migrations.py` e `backend/migrations/`.
- [ ] T050 Verificar OpenAPI gerado contra contrato aprovado e rejeição de campos desconhecidos em `backend/tests/contract/test_openapi.py`.
- [ ] T051 Criar pipeline de lockfiles/tipos/testes/builds/segredos em `.github/workflows/ci.yml`, sem credentials em reports ou arquivos de estado Playwright.
- [ ] T052 Criar containers/runbooks de deploy de API e PostgreSQL em `ops/` com provedor autorizado, origem TLS única, migração uma vez por release e segredo segregado.
- [ ] T053 Ensaiar backup/PITR/restore isolado e medir RPO/RTO aprovados em `ops/backup-runbook.md`; não restaurar dados reais em development.
- [ ] T054 Executar jornadas e medições de piloto dimensionado, registrando resultados reais e skips em `docs/mvp-validation.md`.
- [ ] T055 Implantar staging/produção apenas no destino autorizado e registrar URL/versão/smoke test em `docs/deployment.md`; GitHub Pages isoladamente não fornece backend transacional.

## Dependências e execução

Demo T001–T006 é entrega separada e suficiente para explorar UX; não comprova US1–US7 transacionais. Foundation T007–T014 bloqueia backend. Depois: US1 → US2 → US3 → US4; US5 e US6 podem avançar após US4 em arquivos distintos; US7 depende de US3/US4/audit; release depende de todas as jornadas e T048–T054.

| Jornada | Tarefas | Verificação independente |
| --- | --- | --- |
| US1 | T015–T020 (6) | Negação contextual, sessão e revogação |
| US2 | T021–T025 (5) | Cadastros sem elevação e sem responsáveis inválidos |
| US3 | T026–T030 (5) | Projeto/contexto/participantes/versionamento |
| US4 | T031–T035 (5) | Hierarquia/elegibilidade/transação |
| US5 | T036–T038 (3) | Kanban/teclado/conflito |
| US6 | T039–T042 (4) | Fórmula/datas/filtros/isolamento |
| US7 | T043–T047 (5) | Conclusão concorrente e histórico atômico |

**Oportunidades paralelas**: testes T015/T016 (US1), teste cadastral versus fixtures em arquivos distintos (US2), contrato de projeto versus revisão UX (US3), contrato/hierarquia (US4), contrato Kanban versus design visual (US5), cálculo unitário versus dataset integração (US6), corridas T043 versus audit T044 (US7). Cada dupla depende das foundations e não implica editar simultaneamente arquivos compartilhados. Tests-first onde indicado; services precedem routers, routers precedem conexão real no frontend.

**Estratégia incremental**: publicar a demonstração autorizada primeiro; manter backlog real aberto. No MVP transacional, entregar acesso seguro/organização antes de projetos e trabalho, então Kanban/indicadores/histórico e só depois deploy. Não reduzir o MVP do pedido a apenas login nem considerar simulação de persona implementação de autorização.

Total: **55 tarefas**, IDs únicos e sequenciais. As marcações relatam evidência da entrega, não intenção.
