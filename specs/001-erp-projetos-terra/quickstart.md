# Guia de validação planejada — ERP Projetos Web Terra

**Estado**: guia para a futura implementação aprovada. Os diretórios de aplicação, manifests, Compose, fixtures e testes abaixo **ainda não existem**. Comandos são contratos de execução propostos, não comandos já executados/verificados. Esta etapa não instala a stack, inicia serviços, cria banco ou implementa testes.

## 1. Revisão antes de implementação

Ler [plan.md](plan.md), [research.md](research.md), [data-model.md](data-model.md) e [contrato da API](contracts/api.md). Revisar baseline RB/Q1 e fechar D-01–D-07: identidade/provisionamento, fuso, relação de prazos, exceções de acesso/histórico, retenção e RPO/RTO, volume/metas e ratificação dos princípios. Gerar tarefas somente em solicitação posterior.

O usuário autorizou usar as propostas no plano, não substituiu valores corporativos ausentes. Não criar um default de produção para fuso, identidade ou retenção só para fazer a inicialização passar.

## 2. Pré-requisitos futuros

- Checkout desta branch ou branch derivada contendo os artefatos; usar checkout existente, sem worktree automática.
- Python 3.12, uv e Node 24 LTS; Docker/Compose ou PostgreSQL descartável equivalente para testes e desenvolvimento. Disponibilidade de Docker não foi validada neste ambiente.
- Manifests/lockfiles backend/frontend aprovados e criados na implementação; versões exatas e compatibilidade então validadas.
- Configuração de desenvolvimento isolada com bindings secretos e `.env` ignorado. Banco/cookies/origens diferentes de staging/produção. Não copiar dados, contas ou backups reais da empresa.
- Fuso IANA explicitamente aprovado, política de identidade selecionada e contas sintéticas provisionadas por método seguro. Senhas não pertencem ao código, fixtures versionadas ou mensagens de chat.

Configuração planejada: `DATABASE_URL` secreta, `APP_ENV`, `PUBLIC_ORIGIN`, `CORPORATE_TIMEZONE`, parâmetros de expiração/cookie/CSRF e limite de tentativas. Se OIDC escolhido, issuer/client/callback e secret quando o tipo de cliente exigir. Não habilitar login local e OIDC simultaneamente por conveniência. Somente valores públicos podem entrar no build frontend; nunca expor DATABASE_URL ou segredo em `VITE_*`.

## 3. Convenção de comandos para futura implementação

Estes comandos só serão executáveis após os arquivos correspondentes serem implementados e revisados. Nenhum foi executado nesta etapa. Compose deve apontar apenas para banco de desenvolvimento descartável, não para URL de produção.

| Diretório | Comando futuro proposto | Resultado esperado após implementação |
| --- | --- | --- |
| `backend/` | `uv sync --frozen` | Ambiente instalado a partir do lockfile, sem modificar dependências por resolução implícita |
| `frontend/` | `npm ci` | Instalação fiel ao lockfile |
| Raiz | `docker compose --env-file .env.development.local -f ops/compose.dev.yml up -d db` | Somente PostgreSQL de desenvolvimento; segredo local ignorado; sem dados reais |
| `backend/` | `uv run alembic upgrade head` | Schema criado/evoluído usando identidade de migração, uma execução por ambiente |
| `backend/` | `uv run python -m erp.dev_seed` | Fixtures sintéticas via utilitário futuro explícito, bloqueado fora de development/test; não gera senha no log |
| `backend/` | `uv run uvicorn erp.main:app --reload` | API local com configuração validada; credencial de runtime e políticas aprovadas |
| `frontend/` | `npm run dev` | Frontend local; proxy de `/api/v1` para API e origem/cookies de dev configurados |
| `backend/` | `uv run pytest tests/unit tests/contract` | Políticas/domínio/contratos executados com contagem e resultado reais |
| `backend/` | `uv run pytest tests/integration` | Banco PostgreSQL isolado; constraints, migrações, locks e atomicidade verificados |
| `frontend/` | `npm run typecheck` e `npm run build` | Tipos/build validados sem credenciais no bundle |
| Raiz | `npm --prefix frontend run test:e2e` | Script futuro de Playwright configura `tests/e2e`, baseURL e contas isoladas; relatório registra jornadas efetivamente executadas |

Comandos de lint e instalação do navegador Playwright serão registrados nos manifests/CI futuros. Ambiente de teste deve inicializar/limpar exclusivamente seus próprios recursos; não usar comandos de reset em banco compartilhado ou real. Não publicar links de localhost como preview do onboarding.

## 4. População fictícia de referência

Criar dados claramente sintéticos: departamentos “Departamento Alfa (teste)” e “Departamento Beta (teste)”; contas administrador/executivo/gerente/líder/colaborador com contextos distintos; nenhum email/nome real. Credenciais são efêmeras e injetadas, não strings fixas no repositório.

- Projeto A autorizado: tarefa independente done, tarefa-pai in_progress e três subtarefas (duas done, uma todo). Esperado: 3/4 folhas = 75,0%; pai não contado duas vezes; projeto não pode concluir.
- Projeto B de outro departamento e sem participação do usuário sob teste: não aparece em lista, detalhes, seletores ou totais.
- Projeto C vazio: folhas zero, percentage null e conclusão recusada.
- Projeto D concluído: protegido contra alterações de trabalho; reabertura explícita e autorizada gera evento.
- Prazos relativos ao relógio de teste: ontem, hoje e amanhã no fuso aprovado; não depender da data real da máquina para criar teste frágil.
- Usuário inativo e participação revogada, além de responsável ativo com trabalho aberto para testar bloqueio de desativação.

## 5. Matriz de verificação significativa

| Cenário | Camada/ferramenta | Resultado esperado / vínculo |
| --- | --- | --- |
| Cada perfil × ação × contexto | Pytest domínio/API | Permissão aprovada respeitada; admin não ganha dados de projeto por ser admin; SC-001 |
| Recurso inacessível e agregados | Pytest API + Playwright | 404 uniforme e ausência em total/listas/dashboard/seletores; FR-002/003/021 |
| Logout, expiração, usuário inativo e revogação | Pytest PostgreSQL + Playwright | Nova operação nega mesmo com cookie antigo; estado vigente lido; FR-001/004 |
| CSRF/origem/campos de privilégio forjados | Pytest API | 403/422 sem efeitos, sem leaks de credenciais ou stacktrace; NFR-001/006 |
| Hierarquia e elegibilidade | Pytest PostgreSQL | FK de mesmo projeto, profundidade máxima, usuário/participação ativos e bloqueio de desativação; FR-008/013/014 |
| Progresso 3/4, vazio e arredondamento perto de 100% | Pytest domínio/API | Numerador/denominador corretos; não liberar conclusão por valor visual; SC-003/004 |
| Tarefa-pai done com subtarefa reaberta | Pytest PostgreSQL | Pai in_progress, ambas versões e histórico confirmam na mesma transação; RB-07 |
| Conclusão concorrente com criação de tarefa | Pytest integração, duas conexões | Comandos competem pelo lock do projeto; nunca projeto concluído com nova folha aberta; SC-004 |
| Desativação/revogação concorrente com atribuição | Pytest integração, duas conexões | Protocolo de locks impede responsabilidade inválida; próximo comando usa política vigente |
| Duas mudanças com a mesma versão | Pytest API + Playwright | Uma confirma; outra retorna 409, UI relê sem apagar mudança de terceiro; NFR-004 |
| Erro ao gravar histórico | Pytest integração | Forçar falha controlada: mutação sofre rollback, sem alteração sem evento; SC-005 |
| Permissão banco de auditoria | Pytest integração com credencial runtime | INSERT/SELECT autorizado; UPDATE/DELETE de evento negados; não testar como superusuário |
| Data ontem/hoje/amanhã e offsets | Pytest com relógio fixo | Atraso segue corporate_today aprovado, não relógio do navegador; NFR-007 |
| Filtros de projeto/trabalho e paginação | Pytest contrato/API | Unidades explícitas, total autorizado, progresso integral invariável por filtro de pessoa; FR-011/020/022 |
| Kanban e ação por teclado | Playwright | Mudança autorizada aparece em detalhe/tabela/Kanban; erro restaura estado; todas ações essenciais disponíveis sem drag; US5 |
| Fluxo administrador→projeto→trabalho→dashboard→histórico | Playwright com contas isoladas | Jornada ponta a ponta e histórico coerente, sem modules futuros |
| Migração vazia e upgrade anterior | Pytest/job CI PostgreSQL | Head consistente, dados sintéticos preservados, constraints/índices ativos; sem downgrade destrutivo presumido |
| Desempenho/usabilidade | Medição com população D-05 aprovada | Percentis e amostra registrados; não declarar meta atingida com um request ou suíte sem testes |
| Restauração de backup | Ensaio operacional isolado | Dados/histórico/permissões reconciliados, tempo/perda medidos contra RPO/RTO aprovados; nunca restaurar em dev |

## 6. Evidências e limpeza futura

Guardar comando, versão, contagem de testes executados, resultado, falhas/skips e relatórios do run corrente. Zero testes ou apenas PID/porta não provam readiness. Traces/screenshot/storageState são potencialmente sensíveis mesmo com contas sintéticas; ignorar no Git e restringir retenção/acesso no CI. Não mascarar teste de isolamento ou concorrência com mock que não exercita o comportamento.

Encerrar apenas processos iniciados por essa validação; remover apenas recursos descartáveis de teste identificados. Backups de produção, credenciais e bancos corporativos estão fora desse fluxo.

## 7. Implantação futura e go-live

Antes de implantar: plano e políticas aprovados; CI/migrações/E2E passaram; segredos segregados; TLS/cookie/CSRF/origem ativos; papel de runtime mínimo; ausência de dados reais em ambientes de desenvolvimento; restore rehearsal concluído; RPO/RTO/retenção e monitoramento definidos.

Executar migração única em staging, aplicar release compatível, testar health/readiness e jornadas, observar falhas/locks/pool. Produção exige autorização separada e runbook de rollback compatível com o schema. A entrega deste guia não fornece essa autorização nem prova um deploy.
