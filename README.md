# ERP Projetos Web Terra

Plataforma corporativa de gestão de projetos em desenvolvimento com GitHub Spec Kit e Codex.

## Demonstração

[**URL da demonstração no GitHub Pages**](https://lcs-casagrande.github.io/silexin/)

Publicado e verificado: Pages com build concluído, HTTP 200 e assets iguais ao build testado. Consulte o registro em [publicação da demonstração](docs/github-pages-demo.md).

A demonstração é um frontend React/TypeScript estático com dados fictícios. Permite explorar projetos, tarefas/subtarefas, Kanban, progresso por folhas e histórico local. Não existe autenticação real, backend ou banco nessa versão; não insira dados da empresa ou credenciais. Dados alterados ficam apenas no navegador e podem ser restaurados.

Fonte: `frontend/`. Publicação: build estático na branch `gh-pages`, sem merge na `main`.

## Documentação e continuidade

- [Especificação do MVP](specs/001-erp-projetos-terra/spec.md)
- [Plano técnico](specs/001-erp-projetos-terra/plan.md)
- [Modelo de dados](specs/001-erp-projetos-terra/data-model.md)
- [Contratos de API](specs/001-erp-projetos-terra/contracts/api.md)
- [Tarefas e estado de execução](specs/001-erp-projetos-terra/tasks.md)
- [Registro de aprovação/escopo](specs/001-erp-projetos-terra/approvals.md)
- [Validação e publicação da demonstração](docs/github-pages-demo.md)
- [Spec Kit no Codex Web](docs/spec-kit-codex-web.md)

O MVP transacional segue o plano React/TypeScript + FastAPI + PostgreSQL. Esse backend e a política de identidade/operação exigem outra hospedagem; GitHub Pages sozinho hospeda apenas o frontend. O backlog distingue demonstração concluída de funcionalidades corporativas ainda não implementadas.

## Executar a demonstração localmente

```bash
cd frontend
npm ci
npm run dev
```

Build: `npm run build`. Testes: `npm run test:e2e` (Playwright com navegador instalado ou `PLAYWRIGHT_CHROMIUM_EXECUTABLE`). Nunca versionar arquivos `.env`, senhas ou estado autenticado do Playwright.
