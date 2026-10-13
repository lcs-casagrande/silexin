# Pesquisa e decisões técnicas — ERP Projetos Web Terra

**Data**: 2026-10-13. **Estado**: decisões propostas para aprovação do plano. A consulta a sites de documentação retornou 403 pela política de rede; a pesquisa usou arquivos de documentação dos repositórios oficiais em `raw.githubusercontent.com`, acessíveis sem mudar políticas ou desabilitar verificação TLS. As branches das fontes não são pins de dependências.

## ADR-01 — Monólito modular

**Decisão**: seis módulos internos, um backend, um PostgreSQL; frontend separado. Organização por capacidade com camadas HTTP/aplicação/domínio/persistência e compartilhamento explícito de transações.

**Justificativa**: o MVP exige consistência entre autorização, trabalho, conclusão e histórico e não demonstra necessidade de implantação independente por módulo.

**Alternativas**: microsserviços introduzem coordenação distribuída; monólito sem fronteiras reduz custo inicial mas dificulta manutenção; event sourcing e mensageria não são necessários para histórico de mudanças do MVP.

**Consequência**: alterações podem confirmar juntas; independência é de código, não de banco/infra. A separação futura depende de necessidades observadas, não de scaffolding preventivo.

## ADR-02 — React e TypeScript

**Decisão**: SPA React/TypeScript, Vite para build e desenvolvimento, React Router para navegação e TanStack Query recomendado para estado remoto. Tipos de contratos alinhados com OpenAPI; sem credenciais em armazenamento JS. Kanban oferece ação por teclado além de drag-and-drop.

**Justificativa**: dashboard, tabelas, filtros e Kanban beneficiam-se de componentes, tipos e navegação explícita. O custo de uma SPA é aceitável para uso corporativo interno, sem requisito de indexação pública.

**Alternativas**: páginas renderizadas pelo servidor simplificam fluxo simples, mas limitam a reutilização da interação planejada; Next.js/SSR não traz benefício demonstrado ao MVP e adiciona outra camada de execução.

**Consequência**: regras finais ficam na API; invalidar detalhes/Kanban/dashboard após mutações. Evitar um store global para copiar todos os dados remotos.

**Fonte observada**: [React — uso de TypeScript](https://raw.githubusercontent.com/reactjs/react.dev/main/src/content/learn/typescript.md), que descreve JSX e tipos React. A escolha de Vite/router/query é recomendação arquitetural, não declaração de benchmark ou instalação realizada.

## ADR-03 — FastAPI e persistência síncrona

**Decisão**: FastAPI/Pydantic 2, SQLAlchemy 2 e Psycopg 3, sessão/transação por caso de uso, caminhos síncronos para I/O de banco inicialmente.

**Justificativa**: contratos tipados, validação e documentação OpenAPI combinam com a API; operações são CRUD transacional e não há meta de concorrência que justifique uma pilha async inteira.

**Alternativas**: async SQLAlchemy é viável se medições indicarem benefício; misturar driver síncrono em `async def` bloqueia execução; Django pode oferecer administração integrada, mas a stack solicitada favorece contratos e módulos próprios do domínio.

**Consequência**: Session nunca compartilhada entre requisições/threads; fechar ou rollback em falhas e emitir resposta após commit. Não criar abstração genérica de repositório para cada tabela sem necessidade.

**Fonte observada**: [SQLAlchemy — Session basics](https://raw.githubusercontent.com/sqlalchemy/sqlalchemy/rel_2_0/doc/build/orm/session_basics.rst), com limites de sessão e framing transacional.

## ADR-04 — PostgreSQL e modelo relacional

**Decisão**: PostgreSQL 17 como baseline proposta, uma base, UUIDs e FKs; `DATE` para prazo e `TIMESTAMPTZ` para eventos. Estado/priority como códigos validados e CHECKs nomeados, evitando enums físicos difíceis de evoluir. Referências de usuários/dep/projeto preservadas; sem cascade de exclusão histórica.

**Justificativa**: relações, integridade e concorrência são centrais; PostgreSQL oferece constraints e locks adequados.

**Alternativas**: SQLite é útil em casos simples, mas não valida as propriedades operacionais escolhidas; banco documental não é necessário; RLS não será adicionado agora como segunda implementação da matriz de acesso. A política central aplica filtros em todas as consultas, com testes negativos obrigatórios; RLS pode ser avaliado se houver requisito de isolamento adicional.

**Consequência**: índices guiados por consultas e testados com dados sintéticos; não armazenar progresso/atraso como campos editáveis nem manter cache antecipado.

## ADR-05 — Sessão opaca, identidade ainda a definir

**Decisão**: sessão aleatória forte com hash no PostgreSQL, cookie seguro e autorização vigente reavaliada. Origem única, token CSRF vinculado à sessão e verificação de Origin para mutações. Sessão é técnica comum; política de identidade local/SSO é D-01.

**Justificativa**: revogação na próxima operação requer estado vigente. O navegador não precisa guardar tokens nem papéis; sessões no banco evitam Redis obrigatório.

**Alternativas**: JWT com perfil/escopo embutidos fica desatualizado até expirar, ou acaba exigindo consulta de revogação; OIDC pode ser obrigatório na empresa, mas não presume fornecedor nem login paralelo. Se OIDC escolhido, usar authorization code com PKCE e validar state/nonce/issuer/audience, mantendo sessão própria após retorno.

**Consequência**: credenciais locais só existirão se aprovadas. Recomenda-se Argon2id para hash nesse caso; parametrização, provisionamento, recuperação, TTL e limite de tentativas exigem definição. Rate limiting multiworker precisa ser compartilhado na borda ou PostgreSQL, não só dicionário em um processo.

**Fonte observada**: [FastAPI — security](https://raw.githubusercontent.com/fastapi/fastapi/master/docs/en/docs/tutorial/security/oauth2-jwt.md), que recomenda Argon2. O tutorial de JWT não determina a escolha de transporte/autorização desta aplicação.

## ADR-06 — Concorrência otimista e lock do projeto

**Decisão**: versionamento explícito nos comandos; lock da linha do projeto em todo comando que muda trabalho, participantes, elegibilidade, conclusão ou reabertura. Mudança e evento confirmam na mesma transação.

**Justificativa**: versionamento isolado evita perda de atualização na mesma linha, mas não impede inserir nova tarefa enquanto outro comando conclui o projeto. Ambas as operações precisam competir pelo mesmo lock.

**Alternativas**: só verificar percentual ou só travar a conclusão deixa corrida; serializable generalizado aumenta retries; locks de projeto são mais fáceis de auditar no início. Sem atualizações bulk que ignorem versão/políticas.

**Consequência**: operações no mesmo projeto são serializadas; timeout/deadlock não gera sucesso parcial. Ordenar locks e testar corrida com duas conexões reais. Dashboard composto usa um snapshot de leitura consistente e não promove sua transação para escrita.

**Fonte observada**: [SQLAlchemy — versioning](https://raw.githubusercontent.com/sqlalchemy/sqlalchemy/rel_2_0/doc/build/orm/versioning.rst); `version_id_col` atua no flush ORM, não substitui proteção em updates/deletes multirow.

## ADR-07 — Histórico transacional

**Decisão**: eventos append-only para o runtime, com ator, instante, objeto, contexto, ação e diff de campos permitidos. Papel de banco runtime não recebe UPDATE/DELETE em audit_events. Histórico de negócio é distinto de logs operacionais sanitizados.

**Justificativa**: uma falha de auditoria deve impedir confirmação da mudança importante; não há requisito de reconstruir toda entidade por eventos.

**Alternativas**: log depois do commit pode perder evento; trigger para toda semântica não conhece adequadamente autorização/ator; event sourcing amplia escopo. Exportação para log independente/WORM depende de requisito futuro de compliance.

**Consequência**: proteção contra mutação pelo aplicativo, sem alegar inviolabilidade contra administrador do banco. Retenção/expurgo operacional só com política D-04 e credencial segregada; nenhuma rota pública de expurgo.

## ADR-08 — Alembic e releases compatíveis

**Decisão**: uma cadeia de migrações revisadas; autogenerate é candidato. Testar instalação vazia, upgrade com fixtures e consistência; migração única por release com identidade própria. Expand/contract quando mudança exige compatibilidade.

**Justificativa**: migração é código operacional capaz de perder dados ou bloquear aplicação, não um efeito automático de atualizar models.

**Alternativas**: `create_all` não substitui histórico de schema; executar em cada worker cria corrida; downgrade automático não recupera transformação irreversível.

**Consequência**: revisão explícita de renomeações, constraints, índices e transformações. Backups/restore e forward-fix são parte da estratégia de recuperação.

**Fonte observada**: [Alembic — autogenerate](https://raw.githubusercontent.com/sqlalchemy/alembic/main/docs/build/autogenerate.rst), que exige revisão/correção das migrações candidatas.

## ADR-09 — Testes orientados a risco

**Decisão**: Pytest para políticas/regra/transação/contrato com PostgreSQL descartável; Playwright para jornadas de ponta a ponta, contexto de usuário e acessibilidade essencial. Fixtures sintéticas isoladas, com identidade por worker quando teste modifica estado.

**Justificativa**: os principais riscos são vazamento, revogação ineficaz, corrida na conclusão, cálculo inconsistente e histórico sem atomicidade.

**Alternativas**: somente mocks não provam FKs/locks/transação; somente E2E torna investigação lenta; não usar dados de produção para realismo.

**Consequência**: `storageState`, screenshots, traces e reports podem conter dados de sessão mesmo em testes. Não versionar estado autenticado; restringir retenção/acesso dos artefatos e usar dados fictícios.

**Fontes observadas**: [Pytest — fixtures](https://raw.githubusercontent.com/pytest-dev/pytest/main/doc/en/how-to/fixtures.rst) e [Playwright — authentication](https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/auth.md), incluindo isolamento por worker e sensibilidade de arquivos de autenticação.

## ADR-10 — Implantação e recuperação

**Decisão**: frontend estático, backend container e proxy TLS sob origem única, PostgreSQL privado gerenciado quando disponível. Backups criptografados, PITR quando suportado e restauração ensaiada; CI/staging antes da produção.

**Justificativa**: suficiente para monólito; operação gerenciada reduz carga sem impor plataforma de orquestração.

**Alternativas**: Kubernetes, cache distribuído e réplicas de leitura adicionam custo antes de um problema demonstrado. Dumps são úteis para portabilidade, mas não entregam sozinhos RPO/RTO definidos.

**Consequência**: escolher provedor, dimensionamento e frequência/retenção de backups após D-04/D-05. Nenhuma conta cloud, segredo, serviço ou job foi criado.

**Fonte observada**: [PostgreSQL — backups](https://raw.githubusercontent.com/postgres/postgres/REL_18_STABLE/doc/src/sgml/backup.sgml), com dump, backup físico e PITR. A fonte PG18 descreve conceitos usados pelo plano PG17; disponibilidade e detalhes da versão/provedor serão verificados antes de implantação.

## Conclusão da pesquisa

Escolhas técnicas têm decisão, justificativa, alternativa e consequência. Não há incógnita técnica disfarçada de fato observado: versões exatas e desempenho serão validados na implementação; D-01–D-07 são decisões de identidade, negócio e operação que pesquisa não pode aprovar. O desenho permanece para revisão; documentação consultada não equivale a stack instalada ou testes executados.
