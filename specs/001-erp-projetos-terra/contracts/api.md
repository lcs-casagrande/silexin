# Contrato de API do MVP — ERP Projetos Web Terra

**Estado**: contrato proposto para aprovação, não API implementada. Base `/api/v1`, JSON UTF-8, datas ISO 8601. Baseline de negócio autorizada para o plano; definições D-01–D-07 em [plan.md](../plan.md). OpenAPI gerado pelo FastAPI deverá reproduzir tipos, validações, segurança e resultados aqui definidos; derivações incompatíveis exigem revisão do contrato.

## Regras transversais

- UUID identifica recursos; `DATE` usa `YYYY-MM-DD`; instantes usam RFC 3339 com offset UTC. `corporate_today` usa fuso IANA configurado, não o navegador.
- Campos desconhecidos no payload são rejeitados; IDs, autoria, versões novas, progresso, atraso, departamento do ator e privilégios não podem ser injetados pelo cliente. Campos opcionais omitidos no PATCH permanecem; `null` somente em campos explicitamente anuláveis.
- Respostas públicas não contêm senha/hash, token/digest de sessão, segredos de provedor ou credenciais de banco. Ator vem da sessão, nunca do body.
- Mutações de recurso existente exigem `expected_version` inteiro ≥1 no body. Criação/adição/remoção em contexto de projeto exige `expected_project_version`. Falta de versão esperada é 422; divergência é 409 `VERSION_CONFLICT`. Retornar versões novas após confirmação.
- Sem exclusão definitiva pública. Revogação de participação preserva linha histórica. Não há endpoints financeiros, de risco, upload, aprovação ou notificação.
- Paginação de listas: `page` ≥1, `page_size` de 1 a 100, default técnico 25; ordenação estável por `created_at,id` ou `occurred_at,id`. Envelope `{items, page, page_size, total}`. `total` só inclui recursos autorizados e a população da consulta. Filtros inválidos geram 422, não acesso mais amplo.
- IDs inacessíveis produzem 404 uniforme, sem revelar existência. Sessão ausente/expirada é 401; ação administrativa/global sem permissão é 403. Nenhuma resposta de erro altera dados parcialmente.

### Autenticação e CSRF

Cookie de sessão opaca `HttpOnly; Secure; SameSite=Lax; Path=/`, com nome `__Host-erp_session` em produção e sem Domain. Navegador envia cookie automaticamente sob a mesma origem; não há bearer token em localStorage. `POST /auth/login` é candidato apenas se identidade local for escolhida. OIDC substituiria a jornada de entrada, mantendo sessão própria e contratos de me/logout/CSRF; provedor e callback dependem de D-01.

Toda mutação autenticada exige `X-CSRF-Token` aleatório vinculado à sessão e `Origin` exatamente permitido. `GET /auth/csrf` entrega o token ao usuário autenticado, com `Cache-Control: no-store`; o frontend guarda em memória. O token CSRF sincronizado é mantido no estado de sessão do servidor e entregue somente nesse endpoint; pode ser reutilizado pelas abas da mesma sessão até sua renovação. O cookie de autenticação continua armazenado somente como digest no banco. Token CSRF não é retornado em queries, URLs ou logs. Login local também valida Origin e não aceita origem ausente em jornada de navegador; após sucesso, renovar sessão e token. Cookies de dev HTTP, se necessários, têm nome diferente e configuração limitada a loopback; produção nunca permite cookie sem Secure. CORS não é necessário sob origem única; se usado em dev, permitir somente origem exata, sem wildcard com credenciais.

Política de TTL, recuperação, provisionamento e limite de tentativas é D-01; não definir contas reais ou credenciais no contrato. Fluxos opcionais não serão implementados todos antecipadamente.

## Tipos públicos

| Tipo | Campos e validações |
| --- | --- |
| `Department` | `id: UUID`, `name: string não vazia`, `is_active: boolean`, `version: integer`, `created_at/updated_at: instant` |
| `User` (admin) | `id`, `display_name`, `login_identifier`, `department_id`, `profile_code`, `is_active`, `version`, instantes; nenhuma credencial. login_identifier deve ser único conforme D-01 |
| `PersonOption` | `id`, `display_name`; apenas pessoas elegíveis no contexto solicitado, sem diretório global implícito |
| `Me` | `id`, `display_name`, `profile_code`, departamento principal, concessões contextuais e capacidades de navegação vigentes; não substitui autorização backend |
| `Project` | `id`, `name`, `description: string ou null`, `department_id`, `owner_user_id`, `status: planned/in_progress/completed`, `priority: low/medium/high`, `due_date`, `completed_at: instant ou null`, `version`, instantes, `progress`, `is_overdue` derivados |
| `Progress` | `completed_leaves: integer ≥0`, `total_leaves: integer ≥0`, `percentage: number de 0 a 100 ou null`; null somente quando total é zero, uma casa decimal para apresentação |
| `Task` | `id`, `project_id`, `parent_task_id: UUID ou null`, `title`, `status: todo/in_progress/done`, `priority: low/medium/high`, `due_date`, `assignee_user_id`, `version`, instantes, `is_overdue` derivado |
| `Member` | `project_id`, `user_id`, `is_active`, `version`; sem papel extra que amplie o perfil do usuário |
| `AuditEvent` | `id`, `actor` com identidade histórica permitida, `occurred_at`, `entity_type/entity_id`, `action`, `before_values/after_values` sanitizados, `correlation_id`; contexto autorizado e sem edição pública |

Limites técnicos propostos para aprovação: nome de departamento e display_name de 1 a 120 caracteres, nome de projeto e título de tarefa de 1 a 200, description de até 4.000 e login_identifier de 1 a 254. Validação usa comprimento após trim, não aceita string obrigatória vazia ou só espaços e rejeita excesso com 422; Pydantic, frontend e schema deverão alinhar esses limites. Versões exatas dos códigos de estado correspondem à baseline RB-04, sem novos estados.

### Payloads de comandos

| Nome | Campos permitidos |
| --- | --- |
| `LoginCandidate` | `login_identifier`, `password`; exclusivamente body TLS, mascarado em logs; depende de D-01 |
| `DepartmentCreate` | `name` |
| `DepartmentPatch` | `expected_version`, `name?`, `is_active?` |
| `UserCreate` | `display_name`, `login_identifier`, `department_id`, `profile_code`; provisionamento de credenciais segue D-01, não senha retornada no cadastro |
| `UserPatch` | `expected_version`, `display_name?`, `department_id?`, `profile_code?`, `is_active?`; mudança de identificador depende de D-01, não genérica |
| `ScopeChange` | `expected_version` do usuário, `department_id` alvo; ator admin autorizado, não aceita user_id diferente do path |
| `ProjectCreate` | `name`, `description?`, `department_id`, `owner_user_id`, `priority`, `due_date`; estado inicial planned. Responsável ativo/elegível e participação inicial são validados juntos |
| `ProjectPatch` | `expected_version`, `name?`, `description?`, `owner_user_id?`, `priority?`, `due_date?`; departamento proprietário não é transferido silenciosamente no MVP |
| `ProjectStateCommand` | `expected_version`; ação expressa no endpoint start/complete/reopen, estado final não livre |
| `MemberChange` | `expected_project_version`, `user_id` quando inclusão; remoção identifica usuário no path; resolve responsabilidades antes de revogar |
| `TaskCreate` | `expected_project_version`, `title`, `priority`, `due_date`, `assignee_user_id`; `parent_task_id?` para subtarefa; estado inicial todo |
| `TaskPatch` | `expected_version`, `title?`, `priority?`, `due_date?`, `assignee_user_id?`; não muda projeto ou parent, status possui comando próprio |
| `TaskStatusCommand` | `expected_version`, `status`; colaborador só modifica status de trabalho autorizado, não replaneja por este endpoint |

Regra de identidade, campos históricos acessíveis ao colaborador e limite prazo tarefa/projeto ainda condicionais a D-01/D-02/D-03. Campos suficientes para desenho foram delimitados; não liberar implementação enquanto essas políticas estiverem abertas.

## Endpoints e resultados

Todos os endpoints de negócio são autenticados. HTTP 200 significa comando/leitura concluído; 201 representa criação com Location e representação; 204 não tem body. PATCH com pelo menos um campo alterável; no-op não gera histórico falso nem incrementa versão sem mudança.

| Método e path | Entrada / saída de sucesso | Política e validação |
| --- | --- | --- |
| POST `/auth/login` | LoginCandidate → 200 Me + Set-Cookie; erros genéricos 401/429 | Candidato local; Origin, limitação e identidade ativa; D-01 |
| GET `/auth/me` | 200 Me | Sessão válida e usuário ativo |
| GET `/auth/csrf` | 200 `{csrf_token}`; no-store | Sessão válida; valor não pode ir para logs |
| POST `/auth/logout` | 204 e expiração do cookie | CSRF/Origin; invalidar sessão no banco |
| GET `/users` | Filtros de departamento/perfil/ativo → lista User | Admin; nenhuma consulta global para colaborador |
| POST `/users` | UserCreate → 201 User | Admin; unicidade, departamento e perfil válidos |
| GET `/users/{user_id}` | 200 User | Admin; dados mínimos de seleção têm rotas contextuais próprias |
| PATCH `/users/{user_id}` | UserPatch → 200 User | Admin; versão, tratamento de responsabilidades, revogação e audit |
| POST `/users/{user_id}/department-scopes` | ScopeChange → 200 usuário e escopos vigentes | Admin; muda concessão e version do usuário; audit |
| POST `/users/{user_id}/department-scopes/{department_id}/revoke` | `{expected_version}` → 200 usuário e escopos | Admin; verificar efeito sobre elegibilidade e revogar efetivamente |
| GET `/departments` | Lista Department | Admin vê cadastros; demais só departamentos necessários ao seu contexto, com saída mínima quando aplicável |
| POST `/departments` | DepartmentCreate → 201 Department | Admin |
| PATCH `/departments/{department_id}` | DepartmentPatch → 200 Department | Admin; bloqueio/desativação e versão |
| GET `/departments/{department_id}/eligible-project-owners` | Lista PersonOption | Só ator com permissão de criar projeto no departamento; participantes candidatos conforme Q1 |
| GET `/projects` | Filtros de departamento/owner/status/priority/due_from/due_to → lista Project | Escopo antes de filtros/paginação/total |
| POST `/projects` | ProjectCreate → 201 Project | Gerente/líder com contexto concedido; owner elegível; membro inicial e audit atômicos |
| GET `/projects/{project_id}` | 200 Project | Leitura autorizada, sem revelar existência se negada |
| PATCH `/projects/{project_id}` | ProjectPatch → 200 Project | Responsável/gestor conforme Q1; projeto editável e versão vigente |
| POST `/projects/{project_id}/start` | ProjectStateCommand → 200 Project | planned → in_progress; autorização e versão |
| POST `/projects/{project_id}/complete` | ProjectStateCommand → 200 Project | Lock do projeto; pelo menos uma folha; todas folhas e pais concluídos; nunca percentual arredondado |
| POST `/projects/{project_id}/reopen` | ProjectStateCommand → 200 Project | completed → in_progress; audit; ator autorizado |
| GET `/projects/{project_id}/participants` | Lista Member e representação mínima de pessoa | Leitura do projeto e contexto autorizado |
| POST `/projects/{project_id}/participants` | MemberChange → 201 `{member, project_version}` | Ator pode manter participantes; usuário ativo e elegível; associação já ativa gera 409 |
| POST `/projects/{project_id}/participants/{user_id}/revoke` | `{expected_project_version}` → 200 `{member, project_version}` | Não revogar owner ou responsável por trabalho aberto antes de reassociação; não apagar linha histórica |
| GET `/projects/{project_id}/eligible-assignees` | Lista PersonOption | Somente projeto autorizado; membros ativos elegíveis, sem expansão automática de acesso |
| GET `/projects/{project_id}/tasks` | Filtros de assignee/status/priority/due/parent → lista Task | Scope do projeto; declarar parent/root/all para distinguir pais e folhas |
| POST `/projects/{project_id}/tasks` | TaskCreate → 201 `{task, project_version}` | Gerente/líder autorizado; hierarquia máxima, mesmo projeto, elegibilidade, estado e versão |
| GET `/tasks/{task_id}` | 200 Task | Autorização derivada do projeto da tarefa, não project_id alegado pelo cliente |
| PATCH `/tasks/{task_id}` | TaskPatch → 200 `{task, project_version}` | Quem mantém trabalho; FK não substitui contexto/elegibilidade |
| POST `/tasks/{task_id}/status` | TaskStatusCommand → 200 `{task, related_updates, project_version}` | Ator pode executar esse trabalho; pais/subtarefas e conclusão/reabertura atômicos |
| GET `/projects/{project_id}/kanban` | 200 `{project_version, columns, pagination}` | Colunas todo/in_progress/done com tarefas-raiz e subtarefas no contexto; acesso ao projeto |
| GET `/dashboard` | Filtros de projeto e trabalho separados → Dashboard | População autorizada e snapshot consistente; sem custos/riscos |
| GET `/projects/{project_id}/history` | Filtros de entidade/ação/período → lista AuditEvent | Contexto e alcance de histórico do perfil; D-03 |
| GET `/history/organization` | Filtros de user/department/ação/período → lista AuditEvent | Admin para cadastros; não concede histórico de projeto indiscriminado |

Cadastro de usuário não fornece senha nem login funcional sem provisionamento seguro. Se OIDC for escolhido, definir start/callback OIDC e remover LoginCandidate; não coexistem automaticamente com login local. Health/readiness de deployment são endpoints operacionais futuros, sem dados de negócio ou segredos e com exposição restrita.

### Paginação de Kanban

`column_page`/`page_size` limitam tarefas-raiz por coluna, com ordenação estável. Resposta informa por coluna `total`, `page` e `page_size`; não fingir que todas tarefas cabem em um payload. Subtarefas são carregadas pela lista de tarefas com `parent_task_id` quando necessário e respeitam paginação própria. Contagens visuais de cards-raiz são distintas de contagens de folhas do dashboard; ambos explicitam a unidade.

### Filtros do dashboard

Separar `project_department_id`, `project_id`, `project_owner_id`, `project_status`, `project_priority`, `project_due_from/to` de `work_assignee_id`, `work_status`, `work_priority`, `work_due_from/to`. Sem parâmetro `status` genérico que misture entidades. Filtros de trabalho só afetam contagens de folhas e projetos com trabalho atrasado; total/progresso integral dos projetos da população não muda silenciosamente. Nenhum filtro pode ampliar o contexto autorizado.

Exemplo sintético de resposta, sem identidade real:

```json
{
  "as_of": "2026-10-13T15:00:00Z",
  "timezone": "<fuso-IANA-aprovado>",
  "filters": {"project_status": "in_progress"},
  "projects": {"total": 3, "by_status": {"planned": 0, "in_progress": 3, "completed": 0}, "overdue": 1, "with_overdue_work": 2},
  "work_leaves": {"total": 8, "by_status": {"todo": 2, "in_progress": 3, "done": 3}, "overdue": 2}
}
```

`timezone` acima é placeholder documental obrigatório, não valor aceito em runtime. Progresso por projeto está na representação Project e no detalhamento paginado de projetos; não adicionar lista ilimitada de progresso dentro de Dashboard nem média global.

### Erros

Envelope uniforme, sem stacktrace, SQL, credencial ou existência de objeto fora do escopo:

```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "O item mudou. Atualize a consulta antes de tentar novamente.",
    "request_id": "00000000-0000-4000-8000-000000000001",
    "details": []
  }
}
```

| HTTP | Códigos principais | Efeito esperado |
| --- | --- | --- |
| 401 | AUTH_REQUIRED, INVALID_CREDENTIALS | Autenticação inválida; nenhuma informação de conta sensível |
| 403 | ACTION_FORBIDDEN, CSRF_FAILED, ORIGIN_NOT_ALLOWED | Ação global/origem/token negados; não altera dados |
| 404 | RESOURCE_NOT_FOUND | Ausente ou inacessível, sem distinguir os dois casos |
| 409 | VERSION_CONFLICT, RESPONSIBILITY_CONFLICT, INVALID_STATE, PROJECT_NOT_COMPLETABLE, DUPLICATE_MEMBERSHIP | Conflito de versão/regra; details só incluem objetos e campos que o ator pode ler |
| 422 | VALIDATION_ERROR, INVALID_RELATION, DUPLICATE_IDENTIFIER | Entrada inválida, campos desconhecidos, relações inválidas ou dados cadastrais duplicados em contexto admin autorizado |
| 429 | TOO_MANY_ATTEMPTS | Limitação de entrada conforme política; Retry-After quando aplicável |
| 503 | TEMPORARILY_UNAVAILABLE | Falha transitória/timeout; não confirmar sucesso nem registrar mudança parcial |

Não retransmitir exceção bruta FastAPI/SQLAlchemy ao cliente. Mensagens de erro não ecoam valores de senha ou o payload inteiro. Respostas de complete só listam pendências acessíveis; logs registram correlação, não bodies sensíveis.

## Regras de atomicidade e testes de contrato

Mutação, atualização de pai/projeto/version e histórico confirmam juntos. `related_updates` contém tarefas-pai afetadas de forma autorizada; frontend invalida suas queries e o dashboard. Cliente não otimiza progresso como verdade definitiva. Em conflito, recuperar estado confirmado e permitir nova ação consciente, sem retry automático de comando com versão antiga.

Contratos devem testar: códigos e campos permitidos, rejeição de campos read-only/unknown, versões, sessão/CSRF/origem, recursos inacessíveis 404, paginação limitada, scopes em totais e seleção de responsáveis, status inválido, commit/histórico e limites de dia. OpenAPI gerado precisa descrever segurança por cookie/header e não documentar bearer obrigatório que não existe. Não há teste executável nem chamada de API realizada nesta fase.
