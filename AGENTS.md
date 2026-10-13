# ERP Projetos — instruções para Codex

Este repositório inicia uma plataforma web corporativa para gestão de projetos internos. A tecnologia da aplicação ainda não foi definida. O estado inicial contém somente a configuração oficial do GitHub Spec Kit, não uma implementação do ERP.

## Spec Kit

Use as skills oficiais em `.agents/skills/speckit-*/SKILL.md`. Leia a skill solicitada antes de executá-la. A ordem recomendada é constitution → specify → clarify → plan → tasks → analyze → implement, uma etapa por tarefa e com revisão dos artefatos entre etapas. Não avance automaticamente de configuração ou especificação para implementação.

No Codex, a sintaxe oficial é `$speckit-constitution`, `$speckit-specify`, `$speckit-clarify`, `$speckit-plan`, `$speckit-tasks` e `$speckit-implement`. Se a descoberta de skills no Codex Web não ocorrer, abra o `SKILL.md` da etapa diretamente e siga suas instruções usando os templates de `.specify/templates/`. Trate o texto após o nome da skill como o argumento do usuário (`$ARGUMENTS`). Consulte `docs/spec-kit-codex-web.md`.

Execute scripts relativos a partir da raiz do repositório. Cada tarefa cloud já é isolada; use o checkout existente e não crie Git worktrees sem solicitação explícita. O Specify CLI é ferramenta de configuração, não servidor da aplicação. Nenhuma extensão adicional foi habilitada.

## Escopo e preservação

Preserve conteúdo existente. Não use `specify init --force` nem atualizações que sobrescrevam arquivos sem revisar conflitos. Não faça merge na branch principal. A instalação do Spec Kit não autoriza criar banco de dados, iniciar serviços ou implementar o ERP; essas ações exigem uma tarefa futura que as solicite.

Para continuidade em novas tarefas, disponibilize os arquivos `.agents/skills/`, `.specify/`, este arquivo e a documentação no checkout selecionado. Uma instalação local ou rascunho de ambiente salvo não prova que esses arquivos chegaram a outra branch ou tarefa.
