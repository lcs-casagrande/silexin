# GitHub Spec Kit com Codex — ERP Projetos

## Estado da configuração

Foram inspecionados `/workspace/silexin`, o estado Git, instruções locais e ferramentas disponíveis. Não havia `.specify/`, skills do Spec Kit, manifesto de aplicação ou CLI `specify`. As cinco exclusões Python já existentes eram resultado da solicitação anterior do usuário; esta configuração não alterou essas exclusões nem o histórico Git.

O ambiente oferece Linux, Python 3.12.14, uv 0.12.23, Git e o executável Codex. O Specify CLI **1.2.0**, publicado oficialmente no PyPI como `specify-cli`, foi instalado isoladamente em `/workspace/.erp-projetos-tools/uv-tools/`. Seu executável está em `/workspace/.erp-projetos-tools/bin/specify`.

O CLI instala dependências próprias: Typer/Click e Rich para comandos e saída; PyYAML/JSON5, Packaging e Pathspec para configuração e caminhos; Pydantic e MCP para recursos do CLI; bibliotecas transitivas de HTTP, criptografia e validação. São ferramentas do Spec Kit, não dependências do ERP. Nenhum servidor MCP, aplicação ou banco de dados foi iniciado. Não foram instalados Node, framework web ou banco de dados para este projeto.

## Fontes oficiais

- [Repositório e README](https://github.com/github/spec-kit)
- [Instalação](https://github.com/github/spec-kit/blob/v1.2.0/docs/installation.md)
- [Integrações e sintaxe Codex](https://github.com/github/spec-kit/blob/v1.2.0/docs/reference/integrations.md)
- [Adoção em repositórios existentes](https://github.com/github/spec-kit/blob/v1.2.0/docs/guides/existing-projects.md)

A documentação do branch `main` também foi consultada. Os arquivos gerados vêm dos assets oficiais incluídos no pacote estável 1.2.0, não de prompts recriados manualmente.

## Instalação e preservação

Comando de instalação reproduzível no ambiente cloud:

```bash
UV_TOOL_DIR=/workspace/.erp-projetos-tools/uv-tools \
UV_TOOL_BIN_DIR=/workspace/.erp-projetos-tools/bin \
UV_CACHE_DIR=/workspace/.cache/uv \
uv tool install specify-cli==1.2.0
export PATH="/workspace/.erp-projetos-tools/bin:$PATH"
specify version
```

A configuração foi gerada inicialmente em uma pasta temporária nova:

```bash
specify init /tmp/erp-projetos-speckit-stage \
  --integration codex --integration-options='--skills' \
  --script sh --non-interactive
```

Os 30 arquivos gerados foram copiados para o repositório somente após verificar ausência de conflitos. A cópia usou criação exclusiva de arquivos, preservou permissões e não sobrescreveu conteúdo existente. Não foi usado `--force`, não foi criado outro repositório Git e não foram habilitadas extensões Git, GitHub, agent-context ou bancos de dados. Não repita a inicialização para executar cada skill.

## Estrutura criada

```text
AGENTS.md
docs/spec-kit-codex-web.md
.agents/skills/
  speckit-constitution/SKILL.md
  speckit-specify/SKILL.md
  speckit-clarify/SKILL.md
  speckit-plan/SKILL.md
  speckit-tasks/SKILL.md
  speckit-implement/SKILL.md
  speckit-analyze/SKILL.md
  speckit-checklist/SKILL.md
  speckit-converge/SKILL.md
  speckit-taskstoissues/SKILL.md
.specify/
  integration.json
  init-options.json
  integrations/{codex,speckit}.manifest.json
  memory/constitution.md
  memory/.constitution-template.json
  scripts/bash/ (6 scripts oficiais)
  templates/ (constitution, spec, plan, tasks e checklist)
  workflows/speckit/workflow.yml
  workflows/workflow-registry.json
  .gitignore
```

`constitution.md` ainda é o template inicial, não princípios aprovados para o ERP. Não foram criados `specs/`, especificação funcional, plano arquitetural, tarefas de implementação ou código da aplicação. As quatro skills extras vieram do conjunto padrão oficial; nenhuma foi executada. `speckit-taskstoissues` não autoriza publicar issues e pode exigir uma extensão GitHub em uma tarefa futura.

## Uso em novas tarefas do Codex Web

Selecione `lcs-casagrande/silexin` e a branch de revisão `feat/erp-projetos-terra-spec`, que reúne a limpeza anterior, esta configuração e a especificação inicial. Não houve merge na principal. Para reutilizar a máquina preparada, revise/salve e publique o rascunho nas configurações do ambiente; isso é diferente de integrar arquivos na branch Git.

Para continuar a revisão da especificação já criada, leia `specs/001-erp-projetos-terra/spec.md` e seu checklist. O ponteiro `.specify/feature.json` é estado local ignorado pelo Git; em um novo checkout, informe `SPECIFY_FEATURE_DIRECTORY=specs/001-erp-projetos-terra` ao executar scripts ou peça ao Codex para selecionar essa funcionalidade. Não execute novamente `speckit-specify` para responder às dúvidas da especificação existente; revise Q1–Q3 ou solicite `speckit-clarify` sobre essa funcionalidade.

Execute uma etapa por mensagem/tarefa, usando a sintaxe Codex, não comandos de terminal:

| Etapa | Mensagem de exemplo | Resultado esperado |
| --- | --- | --- |
| Princípios | `$speckit-constitution Defina os princípios do ERP Projetos para segurança corporativa, autorização, auditabilidade, qualidade e testes. Não implemente a aplicação nem escolha a stack ainda.` | Constituição do projeto |
| Requisitos | `$speckit-specify Especifique a primeira funcionalidade de gestão de projetos internos do ERP Projetos. Identifique usuários, fluxos, limites e critérios de aceite. Não implemente.` | `spec.md` de uma funcionalidade delimitada |
| Clarificação | `$speckit-clarify Resolva as ambiguidades da especificação atual antes de planejar.` | Perguntas e especificação refinada |
| Arquitetura | `$speckit-plan Elabore o plano técnico para a especificação revisada; justifique alternativas e dependências. Não crie banco nem inicie serviços.` | Plano e artefatos de desenho; um modelo de dados documental não cria banco |
| Tarefas | `$speckit-tasks Gere tarefas a partir do plano revisado, sem executá-las.` | `tasks.md` |
| Implementação futura | `$speckit-implement Execute as tarefas aprovadas dentro do escopo desta tarefa.` | Código e validação, somente quando solicitados |

Antes de implementar, recomenda-se `$speckit-analyze` para conferir consistência entre especificação, plano e tarefas. O workflow automático completo inclui implementação e **não deve ser iniciado** durante esta configuração.

A documentação oficial do Spec Kit descreve esta integração como **Codex CLI** e usa o layout `.agents/skills`. A presença dos arquivos e o estado da integração foram verificados; descoberta automática, autocomplete ou execução nativa em uma **nova tarefa do Codex Web** ainda não foram testados. A sessão atual não comprova atualização automática de seu catálogo de skills.

Se `$speckit-constitution` não for reconhecido, use esta mensagem equivalente:

```text
Leia AGENTS.md e .agents/skills/speckit-constitution/SKILL.md deste repositório.
Execute essa etapa seguindo o template oficial de .specify/templates/constitution-template.md.
Considere como argumento: definir princípios do ERP Projetos para segurança,
autorização, auditoria, qualidade e testes. Não implemente o ERP.
```

Para outra etapa, substitua o caminho pelo `SKILL.md` respectivo. Isso usa exatamente as instruções e templates oficiais e não depende da descoberta nativa da interface. Execute a partir da raiz do checkout; não exija caminhos absolutos desta máquina em tarefas futuras.

## Verificações e limites

- `specify version`: versão 1.2.0 com Python 3.12.14.
- `specify check`: executável Codex disponível.
- `specify init`: geração oficial em pasta temporária concluída.
- `specify integration status` na raiz real: OK; Codex padrão, zero arquivos gerenciados modificados/ausentes e zero caminhos de manifesto inválidos.
- Conferência dos seis nomes solicitados e frontmatter YAML das skills.
- Resolução dos cinco templates pelo script oficial e conferência dos manifestos.
- Scripts Bash conferidos; nenhuma etapa de criação de funcionalidade, planejamento ou implementação foi executada.
- Git: somente arquivos novos de configuração/documentação, além das exclusões já existentes. Histórico e branch preservados.

Não há teste funcional de ERP para executar porque o ERP ainda não existe. Não é necessário fornecer credenciais GitHub adicionais ou chaves de API para inicializar os templates locais. O antigo requisito de ambiente `LI_AT` não pertence ao ERP; remova-o nas configurações do ambiente se ainda estiver listado. Nenhuma credencial foi lida, copiada ou salva.

Próximo passo: tornar esta configuração disponível à próxima tarefa e executar somente `$speckit-constitution`; depois delimitar o MVP com `$speckit-specify` e esclarecer requisitos antes de escolher a stack.
